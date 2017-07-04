'use strict';
//
// Environment configurations @{
var respectCORS = typeof process.env.RESPECT_CORS !== undefined;
// @}

//
// Required libraries @{
var express = require('express');
var router = express.Router();
// @}

//
// Avoid CORS validations.
if (!respectCORS) {
    var cors = require('cors');
    router.all('*', cors());
}

router.get('/', (req, res) => {
    res.json({
        message: "this is an example endpoint"
    });
});

module.exports = router;
