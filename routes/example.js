'use strict';

var express = require('express');
var router = express.Router();
var cors = require('cors');

router.all('*', cors());

router.get('/', (req, res) => {
    res.json({
        message: "this is an example endpoint"
    });
});

module.exports = router;
