const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
 
// CATEGORY GET
router.get('/category', (req, res) => {
    const sqlText = 'SELECT * FROM "category_table";';

    pool.query(sqlText)

    .then((result) => {
        console.log('result of category GET is:', result)
        console.log(`query ${sqlText} was successful`)
            res.send(result.rows);
    })
    .catch((error) => {
        console.log(`query ${sqlText} failed with error: ${error}`)
        res.sendStatus(500);
    });
}); // END GET

// CATEGORY GET
router.get('/ability', (req, res) => {
    const sqlText = 'SELECT * FROM "ability_table";';

    pool.query(sqlText)

    .then((result) => {
        console.log('result of ability GET is:', result)
        console.log(`query ${sqlText} was successful`)
            res.send(result.rows);
    })
    .catch((error) => {
        console.log(`query ${sqlText} failed with error: ${error}`)
        res.sendStatus(500);
    });
}); // END GET

// PRICE GET
router.get('/cost', (req, res) => {
    const sqlText = 'SELECT * FROM "cost_table";';

    pool.query(sqlText)

    .then((result) => {
        console.log('result of cost GET is:', result)
        console.log(`query ${sqlText} was successful`)
            res.send(result.rows);
    })
    .catch((error) => {
        console.log(`query ${sqlText} failed with error: ${error}`)
        res.sendStatus(500);
    });
}); // END GET

module.exports = router;
