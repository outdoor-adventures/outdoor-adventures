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
    })
}); // END GET



module.exports = router;
