'use strict';

module.exports = ({ routeName, app }) => {
    //
    // Required libraries @{
    const configs = require('../includes/core/configs.manager');
    const express = require('express');
    const router = express.Router();
    // @}

    //
    // Environment configurations @{
    const mainConf = configs.get('main');
    // @}

    //
    // Avoid CORS validations.
    if (!mainConf.respectCORS) {
        const cors = require('cors');
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