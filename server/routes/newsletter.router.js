const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

<<<<<<< HEAD
=======
//GET USER SUBSCRIPTION STATUS
router.get('/:userId', (req, res) => {
    const user_id = req.params.userId;
    const sqlText = `SELECT * FROM "newsletter_subscribers" WHERE "user_id" = $1;`;
    
    pool.query(sqlText, [user_id])
    .then((result) => {
        res.send({ isSubscribed: result.rows.length > 0 });
    })
    .catch((dbErr) => {
        console.log('newsletter GET route error', dbErr);
        res.sendStatus(500);
    });
});

>>>>>>> 37fd5d015f750503552ddf06067a270f7331cf36
//POST USER EMAIL
router.post('/:userId', (req, res) => {
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