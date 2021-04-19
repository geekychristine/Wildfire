"use-strict"

const express = require('express');
const jsonData = require('./../../app/profilesData.json');
let router = express.Router();

router.route('/').get((req, res) => {
    res.send('profiles parent!')
})

router.route('/get-profiles-db')
    .get((req, res) => {
        res.send(jsonData)
})


module.exports = router;