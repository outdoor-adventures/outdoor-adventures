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



//GET SINGLE ADVENTURE
router.get('/:id', (req, res) => {
    let id = req.params.id;
    const sqlText = 'SELECT * FROM "adventures" WHERE "id" = $1;';

    pool.query(sqlText, [id])

    .then((result) => {
        console.log('got single adventure')
        console.log(`query ${sqlText} was successful`)
        res.send(result.rows)
    })
    .catch((error) => {
        console.log(`query ${sqlText} failed with error: ${error}`)
        res.sendStatus(500);
    });
});//END GET SINGLE ADVENTURE



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

//POST

//STILL NEED FILTERS / SEARCH 

//ADMIN ONLY ?







module.exports = router;
