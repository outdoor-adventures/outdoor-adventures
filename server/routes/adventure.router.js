const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();


//NEED conditional rendering or queries to only get adventures with a status of accepted?

//GET ALL ADVENTURES
router.get('/', (req, res) => {
    const sqlText = 'SELECT * FROM "adventures";';

    pool.query(sqlText)

    .then((result) => {
        console.log('result of adventure GET is:', result)
        console.log(`query ${sqlText} was successful`)
            res.send(result.rows);
    })
    .catch((error) => {
        console.log(`query ${sqlText} failed with error: ${error}`)
        res.sendStatus(500);
    });
}); // END GET



// GET NEARBY ADVENTURES
router.get('/nearby', (req, res) => {
    const { lat, lng, radius, category, abilityLevel, costLevel } = req.query;
    
    console.log('Searching for adventures near:', { lat, lng, radius });
    
    //if category is selected, filter by that selection. if not, dont filter.
    //distance_squared orders by closest first 
    const sqlText = `
        SELECT *, 
            (((latitude - $1) * (latitude - $1)) + 
             ((longitude - $2) * (longitude - $2))) AS distance_squared
                FROM "adventures" 
                WHERE "status" = 'accepted'
                AND ($3::INTEGER IS NULL OR "category_id" = $3::INTEGER)
                AND ($4::INTEGER IS NULL OR "ability_level_id" = $4::INTEGER)
                AND ($5::INTEGER IS NULL OR "cost_level_id" = $5::INTEGER)
                ORDER BY distance_squared
                LIMIT 10;
    `;
    
    pool.query(sqlText, [lat, lng, category || null, abilityLevel || null, costLevel || null])
    .then((result) => {
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
        
        console.log(`Found ${filteredResults.length} adventures within ${radius} miles`);
        console.log('data recived in /recent is:', req.params.id);
        res.send(filteredResults);
    })
    .catch((error) => {
        console.log(`Nearby adventures query failed with error:`, error);
        // Return empty array instead of 500 error
        res.send([]);
    });
}); // END GET NEARBY



//GET SINGLE ADVENTURE
router.get('/:id', (req, res) => {
    let id = req.params.id;
    const sqlText = 'SELECT * FROM "adventures" WHERE "id" = $1;';

    pool.query(sqlText, [id])

    .then((result) => {
        console.log(`got single adventure from ${id}`)
        console.log(`query ${sqlText} was successful`)
        res.send(result.rows)
    })
    .catch((error) => {
        console.log(`query ${sqlText} failed with error: ${error}`)
        res.sendStatus(500);
    });
});//END GET SINGLE ADVENTURE



//GET users adventures
//FINISHED, WORKS WELL
router.get('/:createdby/adventures' ,(req,res) => {
    const created_by = req.params.createdby; 
    const sqlText = `
    SELECT * FROM "adventures"
    WHERE "created_by" = $1;`;

    const sqlValues = [created_by]

    pool.query(sqlText, sqlValues)
    .then((result) => {
        console.log(`got adventures from user id: ${created_by}`)
        res.send(result.rows)
    })
    .catch((error) => {
        console.log(`query ${sqlText} failed with error: ${error}`)
        res.sendStatus(500);
    });
})
//USE THIS AS AN EXAMPLE:  http://localhost:5173/api/adventures/2/adventures







//GET users favorited adventures basued off user_id



//GET 3 RECENTS APPROVED ADVENTURES
//we use this as a test http://localhost:5173/api/adventures/recents/recent
router.get('/recents/recent', (req, res) => {
    // 

    const sqlText = `
    SELECT * FROM "adventures"
    WHERE "status" = 'accepted'
    ORDER BY "created_at" DESC
    LIMIT 3;`;

    pool.query(sqlText)

    .then((result) => {
        console.log('got three recent adventures')
        console.log(`query ${sqlText} was successful`)
        res.send(result.rows)
    })
    .catch((error) => {
        console.log(`query ${sqlText} failed with error: ${error}`)
        res.sendStatus(500);
    });
});



//DELETE
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

//IN THE WORKS

//PUT
//UPDATED PUT ROUTE FOR DB 5/24
router.put('/:id', (req, res) => {
    const { id } = req.params;

    const {  category_id, ability_level_id,
    cost_level_id, photo, link, activity_name, description,
    latitude, longitude, created_at, status, address } = req.body;


    //working on this put request. 
    console.log(`testing in the PUT route in adventure.router.js ${id}`)

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
    "created_at" = $10,
    "status" = $11,
    "address" = $12
    WHERE "id" = $13;`

    const sqlValues = [category_id, ability_level_id, cost_level_id, photo, link, activity_name, description, latitude, longitude, created_at, status, address, id]

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


//POST
//UPDATED TO LATEST DB
router.post('/:createdby', (req, res) => {
    // const { id } = req.params;
    const { category_id, activity_name, ability_level_id , cost_level_id 
    , photo , link , description, latitude, longitude, created_at, 
    address} = req.body;

    const created_by = req.params.createdby; 
    // not completed , hard coded the created_by user
    const status = req.body.status;


    console.log(`testing in the post route in adventure.router.js ${created_by}`)

    const sqlText = `INSERT INTO "adventures" 
    ( "category_id", "ability_level_id", "cost_level_id", "photo", "link", "activity_name", "description", "latitude", "longitude", "created_at", "created_by", "status", "address")
    VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);`

    const sqlValues = [category_id, ability_level_id, cost_level_id, photo, link, activity_name, description, latitude, longitude, created_at, created_by, status, address]

    pool.query(sqlText, sqlValues)
    .then((result) => {
        res.sendStatus(201)
        console.log(result)
    })
    .catch((dbErr) => {
        console.log('POST route not working', dbErr);
        res.sendStatus(500)
    })
})
//^^^IN ORDER TO TEST THIS, USE THIS AS A REFERENCE
// {
//     "category_id": "3",
//     "ability_level_id": "1",
//     "cost_level_id": "3",
//     "photo": "test",
//     "link": "test.com",
//     "activity_name": "test",
//     "description": "test",
//     "latitude": 22.333,
//     "longitude": 11.222,
//     "created_at": "2025-05-24T15:00:00Z",
//     "created_by": 2,
//     "status": "accepted",
//     "address": "NYC"
// }




// post the favorite adventures, make a query on this.
// still not done

router.post('/favorites/:userid/:adventureid',(req, res) => {
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
//TEST LIKE THIS
//http://localhost:5173/api/adventures/favorites/2/9
//{
//     "user_id": "2",
//     "adventure_id": "9"
// }

// get user, id, and adventure id onto this table



//STILL NEED FILTERS / SEARCH 

//ADMIN ONLY ?
//admin put request to change the status of a post







module.exports = router;
