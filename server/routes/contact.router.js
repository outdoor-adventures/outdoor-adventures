const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

//POST CONTACT FORM SUBMISSION
router.post('/:userId', (req, res) => {
    const { name, email, reason, message } = req.body; 
    
    const user_id = req.params.userId;
    const sqlText = `INSERT INTO "contact_submissions" ("name", "email", "reason", "message", "user_id", "is_resolved") VALUES ($1, $2, $3, $4, $5, $6);`;
    const sqlValues = [name, email, reason, message, user_id, false];

    pool.query(sqlText, sqlValues)
    .then((result) => {
        res.sendStatus(201);
        console.log(result);
    })
    .catch((dbErr) => {
        console.log('contact POST route error', dbErr);
        res.sendStatus(500);
    });
});

module.exports = router;
