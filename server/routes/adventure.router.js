const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

//GET ALL ADVENTURES 
router.get('/', (req, res) => {
    const sqlText = 'SELECT * FROM "adventures";';

    pool.query(sqlText)

    .then ((result) => {
        console.log('result of adventure GET is:', result)
        console.log(`query ${sqlText} was successful`)
            res.send(result.rows);
    })
    .catch ((error) => {
        console.log(`query ${sqlText} failed with error: ${error}`)
        res.sendStatus(500);
    });
}); // END GET

//IN THE WORKS
//POST ADVENTURE
router.post('/', (req, res) => {
    console.log('adventure sent to post is:', req.body);
    const sqlText = `INSERT INTO "adventures" 
                    (SQL, COLUMNS, HERE) 
                    VALUES
                    ($1, CONTINUING AS MANY AS NEEDED);`;

    const sqlValues = [
        // VALUES HERE
    ];

    pool.query(sqlText, sqlValues)
    
    .then((result) => {
        res.sendStatus(201);
    })
    .catch((error) => {
        console.log('error in adventure POST', error);
        res.sendStatus(500);
    });
}); //END POST

//GET SINGLE ADVENTURE

// search / filter queries


//admin only
//PUT
router.put('/:id', (req, res) => {
    let { id } = req.params;
    // const { VALUES } = req.body
    console.log()
})

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





module.exports = router;
