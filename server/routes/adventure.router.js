const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

const { upload, uploadToS3, getSignedImageUrl } = require('../modules/multer-S3-middleware');


//GET ALL ADVENTURES
router.get('/', async (req, res) => {
    const sqlText = 'SELECT * FROM "adventures" JOIN "category_table" ON "adventures"."category_id" = "category_table"."id" JOIN "cost_table" ON "adventures"."cost_level_id" = "cost_table"."id" JOIN "ability_table" ON "adventures"."ability_level_id" = "ability_table"."id";';

    try {
        const result = await pool.query(sqlText);
        
        // Generate signed URLs for photos
        const adventuresWithSignedUrls = await Promise.all(
            result.rows.map(async (adventure) => {
                if (adventure.photo && adventure.photo.includes('amazonaws.com')) {
                    const key = adventure.photo.split('/').pop();
                    adventure.signedPhotoUrl = await getSignedImageUrl(key);
                }
                return adventure;
            })
        );
        
        res.send(adventuresWithSignedUrls);
    } catch (error) {
        console.log(`query ${sqlText} failed with error: ${error}`);
        res.sendStatus(500);
    }
}); // END GET



// GET NEARBY ADVENTURES
router.get('/nearby', (req, res) => {
    const { lat, lng, radius, category, abilityLevel, costLevel } = req.query;
    
    console.log('Searching for adventures near:', { lat, lng, radius });
    
    //if category is selected, filter by that selection. if not, dont filter.
    //distance_squared orders by closest first 
    const sqlText = `
    SELECT *, 
    adventures.*,
    category_table.category_name,
    cost_table.cost_level,
        (((latitude - $1) * (latitude - $1)) + 
         ((longitude - $2) * (longitude - $2))) AS distance_squared
            FROM "adventures" 
            JOIN "category_table" ON "adventures"."category_id" = "category_table"."id"
            JOIN "cost_table" ON "adventures"."cost_level_id" = "cost_table"."id"
            JOIN "ability_table" ON "adventures"."ability_level_id" = "ability_table"."id"

            WHERE "status" = 'accepted'
            AND ($3::INTEGER IS NULL OR "category_id" = $3::INTEGER)
            AND ($4::INTEGER IS NULL OR "ability_level_id" = $4::INTEGER)
            AND ($5::INTEGER IS NULL OR "cost_level_id" = $5::INTEGER)
            ORDER BY distance_squared
            LIMIT 10;
`;
    
    pool.query(sqlText, [lat, lng, category || null, abilityLevel || null, costLevel || null])
    .then(async (result) => {
        // Filter client-side to ensure we get results
        const filteredResults = result.rows.map(row => {
            // Calculate approximate distance in miles
            const latDiff = 69.1 * (row.latitude - lat);
            const lngDiff = 55.0 * (row.longitude - lng);
            //math.sqrt returns the number that equals x when squared
            const distanceMiles = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
            
            return {
                ...row,
                distance: distanceMiles
            };
        }).filter(row => row.distance <= radius);
        
        // Generate signed URLs for photos
        const adventuresWithSignedUrls = await Promise.all(
            filteredResults.map(async (adventure) => {
                if (adventure.photo && adventure.photo.includes('amazonaws.com')) {
                    const key = adventure.photo.split('/').pop();
                    adventure.signedPhotoUrl = await getSignedImageUrl(key);
                }
                return adventure;
            })
        );
        
        console.log(`Found ${adventuresWithSignedUrls.length} adventures within ${radius} miles`);
        res.send(adventuresWithSignedUrls);
    })
    .catch((error) => {
        console.log(`Nearby adventures query failed with error:`, error);
        // Return empty array instead of 500 error
        res.send([]);
    });
}); // END GET NEARBY



//GET SINGLE ADVENTURE
router.get('/:id', async (req, res) => {
    let id = req.params.id;
    const sqlText = 'SELECT * FROM "adventures" WHERE "id" = $1;';

    try {
        const result = await pool.query(sqlText, [id]);
        
        // Generate signed URLs for photos
        const adventuresWithSignedUrls = await Promise.all(
            result.rows.map(async (adventure) => {
                if (adventure.photo && adventure.photo.includes('amazonaws.com')) {
                    const key = adventure.photo.split('/').pop();
                    adventure.signedPhotoUrl = await getSignedImageUrl(key);
                }
                return adventure;
            })
        );
        
        console.log(`got single adventure from ${id}`);
        res.send(adventuresWithSignedUrls);
    } catch (error) {
        console.log(`query ${sqlText} failed with error: ${error}`);
        res.sendStatus(500);
    }
});//END GET SINGLE ADVENTURE



//GET MY ADVENTURES
router.get('/my/:createdby', async (req,res) => {
    const created_by = req.params.createdby; 
    const sqlText = `
    SELECT "adventures".*, "category_table"."category_name", "cost_table"."cost_level", "ability_table"."ability_level" FROM "adventures"
            JOIN "category_table" ON "adventures"."category_id" = "category_table"."id"
            JOIN "cost_table" ON "adventures"."cost_level_id" = "cost_table"."id"
            JOIN "ability_table" ON "adventures"."ability_level_id" = "ability_table"."id"
    WHERE "created_by" = $1;`;

    const sqlValues = [created_by]

    try {
        const result = await pool.query(sqlText, sqlValues);
        
        // Generate signed URLs for photos
        const adventuresWithSignedUrls = await Promise.all(
            result.rows.map(async (adventure) => {
                if (adventure.photo && adventure.photo.includes('amazonaws.com')) {
                    const key = adventure.photo.split('/').pop();
                    adventure.signedPhotoUrl = await getSignedImageUrl(key);
                }
                return adventure;
            })
        );
        
        console.log(`got adventures from user id: ${created_by}`);
        res.send(adventuresWithSignedUrls);
    } catch (error) {
        console.log(`query ${sqlText} failed with error: ${error}`);
        res.sendStatus(500);
    }
})



//GET ROUTE FOR THE ROUTE BASED OF THE PENDING STATUS:
router.get('/admin/pending', async (req, res) => {
    const sqlText = `
    SELECT "adventures".*, 
           "category_table"."category_name" as "category", 
           "cost_table"."cost_level" as "price", 
           "ability_table"."ability_level" as "difficulty",
           "adventures"."activity_name" as "title",
           "adventures"."address" as "location"
    FROM "adventures" 
    JOIN "category_table" ON "adventures"."category_id" = "category_table"."id"
    JOIN "cost_table" ON "adventures"."cost_level_id" = "cost_table"."id"
    JOIN "ability_table" ON "adventures"."ability_level_id" = "ability_table"."id"
    WHERE "status" = 'pending'
    ORDER BY "id" DESC;`;

    try {
        const result = await pool.query(sqlText);
        
        // Generate signed URLs for photos
        const adventuresWithSignedUrls = await Promise.all(
            result.rows.map(async (adventure) => {
                if (adventure.photo && adventure.photo.includes('amazonaws.com')) {
                    const key = adventure.photo.split('/').pop();
                    adventure.signedPhotoUrl = await getSignedImageUrl(key);
                }
                return adventure;
            })
        );
        
        console.log('getting pending adventures from user');
        res.send(adventuresWithSignedUrls);
    } catch (error) {
        console.log('error in the get pending route.', error);
        res.sendStatus(500);
    }
})


//GET USERS FAVORITES
router.get('/my/favorites/:userId', async (req,res) => {
    const userId = req.params.userId; 
    const sqlText = `
    SELECT "adventures"."id", "activity_name", "category_name", "ability_level", "cost_level", "photo", "link", "description", "address" FROM "adventures" 
 JOIN "favorite_adventures" 
 ON "adventures"."id" = "favorite_adventures"."adventure_id"
 JOIN "user" 
 ON "favorite_adventures"."user_id" = "user"."id"
 JOIN "category_table" 
 ON "adventures"."category_id" = "category_table"."id"
 JOIN "cost_table" 
 ON "adventures"."cost_level_id" = "cost_table"."id"
 JOIN "ability_table" 	
 ON "adventures"."ability_level_id" = "ability_table"."id"
 WHERE "favorite_adventures"."user_id" = $1;
    `;
    const sqlValues = [userId]

    try {
        const result = await pool.query(sqlText, sqlValues);
        
        // Generate signed URLs for photos
        const adventuresWithSignedUrls = await Promise.all(
            result.rows.map(async (adventure) => {
                if (adventure.photo && adventure.photo.includes('amazonaws.com')) {
                    const key = adventure.photo.split('/').pop();
                    adventure.signedPhotoUrl = await getSignedImageUrl(key);
                }
                return adventure;
            })
        );
        
        console.log(`got favorite adventures from user id: ${userId}`);
        res.send(adventuresWithSignedUrls);
    } catch (error) {
        console.log(`query ${sqlText} failed with error: ${error}`);
        res.sendStatus(500);
    }
})



//GET 3 RECENTS APPROVED ADVENTURES
router.get('/recents/recent', async (req, res) => {

    const sqlText = `
    SELECT "adventures".*, "category_table"."category_name", "cost_table"."cost_level", "ability_table"."ability_level" 
    FROM "adventures"
    JOIN "category_table" ON "adventures"."category_id" = "category_table"."id"
    JOIN "cost_table" ON "adventures"."cost_level_id" = "cost_table"."id"
    JOIN "ability_table" ON "adventures"."ability_level_id" = "ability_table"."id"
    WHERE "status" = 'accepted'
    ORDER BY "created_at" DESC
    LIMIT 3;`;

    try {
        const result = await pool.query(sqlText);
        
        // Generate signed URLs for photos
        const adventuresWithSignedUrls = await Promise.all(
            result.rows.map(async (adventure) => {
                if (adventure.photo && adventure.photo.includes('amazonaws.com')) {
                    const key = adventure.photo.split('/').pop();
                    adventure.signedPhotoUrl = await getSignedImageUrl(key);
                }
                return adventure;
            })
        );
        
        res.send(adventuresWithSignedUrls);
    } catch (error) {
        console.log(`query ${sqlText} failed with error: ${error}`);
        res.sendStatus(500);
    }
});



//DELETE ADVENTURE
router.delete('/:id', (req, res) => {
    let { id } = req.params;
    const sqlText = 'DELETE FROM "adventures" WHERE "id" = $1;';

    pool.query(sqlText, [id])

    .then((result) => {
        console.log('adventure deleted:', result)
        res.sendStatus(204);
    })
    .catch((error) => {
        console.log(`error in DELETE ${sqlText}`, error);
        res.sendStatus(500);
    });
}); //END DELETE



//UPDATE POST
router.put('/:id', upload.single('photo'), uploadToS3, (req, res) => {
    const { id } = req.params;
    const status = 'pending';

    //for multer - preserve existing photo if no new file uploaded
    const photo = req.file ? req.file.s3Url : req.body.photo;

    // console.log(`Updating adventure ${id}`);
    // console.log('File S3 URL:', req.file?.s3Url);

    const sqlText = `
    UPDATE "adventures"
    SET 
    "category_id" = $1,
    "ability_level_id" = $2,
    "cost_level_id" = $3,
    "photo" = $4,
    "link" = $5,
    "activity_name" = $6,
    "description" = $7,
    "latitude" = $8,
    "longitude" = $9,
    "address" = $10,
    "status" = $11
    WHERE "id" = $12;`

    const sqlValues = [
        req.body.category_id, req.body.ability_level_id, req.body.cost_level_id,
        photo, req.body.link, req.body.activity_name, req.body.description,
        req.body.latitude, req.body.longitude, req.body.address, status, id,
    ];

    pool.query(sqlText, sqlValues)
    .then(() => {
        res.sendStatus(201)
        console.log('Adventure updated successfully')
    })
    .catch((dbErr) => {
        console.log('PUT route not working', dbErr);
        res.sendStatus(500)
    })
})



//UPDATE STATUS to ACCEPTEC
router.put('/status/:id', (req, res) => {
    const { id } = req.params;
    const newStatus = 'accepted';

    const sqlText = 'UPDATE "adventures" SET "status" = $1 WHERE id = $2;';

    const sqlValues = [ newStatus, id ];

    pool.query(sqlText, sqlValues)
    .then(() => {
        res.sendStatus(201)
        console.log()
    })
    .catch((dbErr) => {
        console.log('PUT route not working', dbErr);
        res.sendStatus(500)
    })
})



//CREATE ADVENTURE
router.post('/:createdby', upload.single('photo'), uploadToS3, (req, res) => {
    const created_by = req.params.createdby; 
    const status = 'pending';

    console.log(`Creating adventure for user ${created_by}`);
    console.log('S3 URL:', req.file?.s3Url);

    const sqlText = `INSERT INTO "adventures" 
    ( "category_id", "ability_level_id", "cost_level_id", "photo", "link", "activity_name", "description", "latitude", "longitude", "created_by", "address", "status")
    VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`

    const sqlValues = [
        req.body.category_id, req.body.ability_level_id, req.body.cost_level_id,
        req.file?.s3Url || null, req.body.link, req.body.activity_name, req.body.description,
        req.body.latitude, req.body.longitude, created_by, req.body.address, status
    ];

    pool.query(sqlText, sqlValues)
    .then((result) => {
        res.sendStatus(201)
        console.log('Adventure created successfully')
    })
    .catch((dbErr) => {
        console.log('POST route not working', dbErr);
        res.sendStatus(500)
    })
})



//CHECK IF ADVENTURE IS FAVORITED
router.get('/favorites/:userid/:adventureid', (req, res) => {
    const {userid, adventureid} = req.params;
    
    const sqlText = `
    SELECT * FROM "favorite_adventures"
    WHERE "user_id" = $1 AND "adventure_id" = $2;`;
    
    pool.query(sqlText, [userid, adventureid])
    .then((result) => {
        res.send({ isFavorited: result.rows.length > 0 });
    })
    .catch((error) => {
        console.log('Error checking favorite status:', error);
        res.sendStatus(500);
    });
});

//FAVORITE ADVENTURE
router.post('/favorites/:userid/:adventureid', (req, res) => {
    console.log('testing the favorite adventures POST route')
    const {userid, adventureid} = req.params;

    console.log('MOVING ONTO THE POST ROUTE SQLTEXT')

    const sqlText = `
    INSERT INTO "favorite_adventures"
    ("user_id", "adventure_id")
    VALUES ($1, $2);`;

    const sqlValues = [userid, adventureid]

    pool.query(sqlText, sqlValues)
    .then((result) => {
        res.sendStatus(201)
        console.log(result.rows)
    })
    .catch((dbErr) => {
        console.log('POST ROUTE NOT WORKING', dbErr);
        res.sendStatus(500)
    })

})

//REMOVE FAVORITE ADVENTURE
router.delete('/favorites/:userid/:adventureid', (req, res) => {
    const {userid, adventureid} = req.params;
    
    const sqlText = `
    DELETE FROM "favorite_adventures"
    WHERE "user_id" = $1 AND "adventure_id" = $2;`;
    
    pool.query(sqlText, [userid, adventureid])
    .then((result) => {
        res.sendStatus(204);
    })
    .catch((error) => {
        console.log('Error removing favorite:', error);
        res.sendStatus(500);
    });
});



module.exports = router;