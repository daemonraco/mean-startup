'use strict';

module.exports = ({ routeName, app }) => {
    //
    // Environment configurations @{
    var respectCORS = process.env.RESPECT_CORS ? true : false;
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

    //
    // Capturing wrong URLs.
    router.get('*', (req, res) => {
        res.redirect(`/${routeName}`);
    });
    router.all('*', (req, res) => {
        res.json({
            error: `Wrong request`
        });
    });

    app.use(`/${routeName}`, router);
}