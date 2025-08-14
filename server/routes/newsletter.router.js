const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

//PUT USER EMAIL
router.put('/email/:userId', (req, res) => {
    const { email } = req.body; 
    const { userId } = req.params;
    const sqlText = 'UPDATE "user" SET "email" = $1 where "id" = $2;';
    const sqlValues = [ email, userId ];

    pool.query(sqlText, sqlValues)
    .then((result) => {
        res.sendStatus(201)
        console.log(result)
    })
    .catch((dbErr) => {
        console.log('newsletter PUT route not working', dbErr);
        res.sendStatus(500)
    })

    console.log('testing in email put route')

})

module.exports = router;