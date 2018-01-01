'use strict'
//
// Environment configurations @{
const port = process.env.PORT || 3000;
const portSSL = process.env.PORT_SSL || false;
// @}

//
// Required libraries @{
const chalk = require('chalk');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const holder = require('./includes/core/holder');
const http = require('http');
const https = require('https');
const path = require('path');
// @}

console.log(`+---------------------------------------------------`);

//
// Main application.
const app = express();
holder.register('app', app);

//
// Loading configuration manager.
const configs = require('./includes/core/configs.manager');
const mainConf = configs.get('main');
app.use(configs.publishExports());

//
// Avoid CORS validations.
if (!mainConf.respectCORS) {
    const cors = require('cors');
    app.all('*', cors());
}

//
// Database.
let activateRestify = false;
if (mainConf.db.active) {
    switch (mainConf.db.type) {
        case 'mongoose':
            const mongoose = require('mongoose');
            mongoose.Promise = global.Promise;
            mongoose.connect(mainConf.db.connectionString, {
                useMongoClient: true
            });
            mongoose.connection.on('error', (err) => {
                console.error(chalk.red(`Mongoose Error: ${err.name}: ${err.message}`));
            });
            activateRestify = true;

            holder.register(['db', 'mongoose'], app);
            break;
    }
}
// @}

//
// Basic configurations @{
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// @}

//
// Static folders @{
const specificAssetsFolder = path.join(__dirname, `assets-by-env/${configs.environmentName()}`);
if (fs.existsSync(specificAssetsFolder)) {
    console.log(`| Loading specific assets folder: '${configs.environmentName()}'\n|`);
    app.use(express.static(specificAssetsFolder));
}
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));
// @}

//
// Loading loaders.
const loaders = require('./includes/core/loader.manager');
loaders.load({ app });

//
// Loading middlewares.
const middlewares = require('./includes/core/middleware.manager');
middlewares.load({ app });

//
// Loading routes manager.
const routes = require('./includes/core/routes.manager');
routes.load({ app });

//
// Loading schemas manager.
//   @note this depends on the presence of a Mongo database.
if (mainConf.db.active && mainConf.db.type === 'mongoose') {
    const schemas = require('./includes/core/schemas.manager');
    schemas.loadRestfulSchemas({ app });
    schemas.loadInternalSchemas();
}

//
// Default redirects.
app.use(function (req, res, next) {
    if (req.xhr || req.headers['accept'] === 'application/json' || req.headers['content-type'] === 'application/json') {
        res.status(404).json({
            message: 'Not Found',
            uri: req.url,
            isAjax: req.xhr
        });
    } else {
        res.sendFile(__dirname + '/public/index.html');
    }
});

//
// HTTPS options.
const options = {
    key: fs.readFileSync('secure/key.pem'),
    cert: fs.readFileSync('secure/cert.pem')
};

//
// Create an HTTP service.
http.createServer(app).listen(port, () => {
    console.log(`+---------------------------------------------------`);
    console.log(`| Server running on '${chalk.green(`http://localhost:${port}`)}'`);

    console.log(`| \tDB: ${chalk.green(mainConf.db.active ? `In use (type: '${mainConf.db.type}')` : 'Not in use')}`);
    if (activateRestify) {
        console.log(`| \t\t${chalk.cyan(`Restify available`)}`);
    }
    console.log(`| \tCORS: ${mainConf.respectCORS ? chalk.green('Respects the protocol') : chalk.yellow('Avoiding warnings')}`);

    console.log(`+---------------------------------------------------`);
});

//
// Create an HTTPS service identical to the HTTP service.
if (portSSL) {
    https.createServer(options, app).listen(portSSL, () => {
        console.log(`| Secure Server running on '${chalk.green(`https://localhost:${portSSL}`)}'`);
        console.log(`+---------------------------------------------------`);
    });
}

//
// Process exit detection @{
const cleanUpProcess = (from, err) => {
    if (err) {
        console.error(err.stack);
    }

    process.exit();
};
process.on('SIGINT', () => cleanUpProcess('SIGINT'));
process.on('uncaughtException', (err) => cleanUpProcess('uncaughtException', err));
// @}
