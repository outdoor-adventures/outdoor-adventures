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
    const { lat, lng, radius } = req.query;
    
    console.log('Searching for adventures near:', { lat, lng, radius });
    
    const sqlText = `
        SELECT *, 
            (((latitude - $1) * (latitude - $1)) + 
             ((longitude - $2) * (longitude - $2))) AS distance_squared
        FROM "adventures" WHERE "status" = 'accepted'
        ORDER BY distance_squared
        LIMIT 10;
    `;
    
    pool.query(sqlText, [lat, lng])
    .then((result) => {
        // Filter client-side to ensure we get results
        const filteredResults = result.rows.map(row => {
            // Calculate approximate distance in miles
            const latDiff = 69.1 * (row.latitude - lat);
            const lngDiff = 55.0 * (row.longitude - lng);
            const distanceMiles = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
            
            return {
                ...row,
                distance: distanceMiles
            };
        }).filter(row => row.distance <= radius);
        
        console.log(`Found ${filteredResults.length} adventures within ${radius} miles`);
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


//GET users favorited adventures basued off user_id



//GET 3 RECENTS APPROVED ADVENTURES
// almost finished however we need to get the 3 accepted from status. do we create a table named accepted instead?
router.get('/recents/recent', (req, res) => {


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
    })
    .catch((dbErr) => {
        console.log('PUT route not working', dbErr);
        res.sendStatus(500)
    })
})


//POST


//update to latest DB
router.post('/', (req, res) => {
    // const { id } = req.params;
    const category_id = req.body.category_id;
    const activity_name = req.body.activity_name;
    const ability_level_id = req.body.ability_level_id;
    const cost_level_id = req.body.cost_level_id;
    const photo = req.body.photo;
    const link = req.body.link;
    const description = req.body.description;
    const city = req.body.city;
    const state = req.body.state;
    const zip = req.body.zip; 
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const created_by = 1;
    // not completed , hard coded the created_by user
    const status = req.body.status;


    console.log(`testing in the post route in adventure.router.js ${created_by}`)

    const sqlText = `INSERT INTO "adventures" 
    ( "category_id", "activity_name", "ability_level_id", "cost_level_id", "photo", "link", "description", "city", "state", "zip", "latitude", "longitude", "created_by", "status")
    VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);`

    const sqlValues = [category_id, activity_name, ability_level_id, cost_level_id, photo, link, description, city, state, zip, latitude, longitude, created_by, status]

    pool.query(sqlText, sqlValues)
    .then(() => {
        res.sendStatus(201)
    })
    .catch((dbErr) => {
        console.log('POST route not working', dbErr);
        res.sendStatus(500)
    })
})

// post the favorite adventures, make a query on this.
// get user, id, and adventure id onto this table



//STILL NEED FILTERS / SEARCH 

//ADMIN ONLY ?
//admin put request to change the status of a post







module.exports = router;
