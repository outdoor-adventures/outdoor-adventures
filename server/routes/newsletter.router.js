const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

//POST USER EMAIL
router.post('/subscribe/:userId', (req, res) => {
    const { email, name } = req.body; 
    
    const  user_id  = req.params.userId;
    const sqlText = `INSERT INTO "newsletter_subscribers" ( "email", "name", "user_id") VALUES ($1, $2, $3);`;
    const sqlValues = [ email, name, user_id ];

    pool.query(sqlText, sqlValues)
    .then((result) => {
        res.sendStatus(201)
        console.log(result)
    })
    .catch((dbErr) => {
        console.log('newsletter POST route not working', dbErr);
        res.sendStatus(500)
    })

    console.log('testing in newsletter signup POST route')

})

module.exports = router;