'use strict'
//
// Environment configurations @{
const port = process.env.PORT || 3000;
const portSSL = process.env.PORT_SSL || false;
const dbName = process.env.DB_NAME || false;
const respectCORS = process.env.RESPECT_CORS ? true : false;
// @}

//
// Required libraries @{
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');
// @}

//
// Main application.
const app = express();

//
// Database.
let mongoose = undefined;
if (dbName) {
    mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
    mongoose.connect(`mongodb://localhost/${dbName}`, {
        useMongoClient: true
    });
    mongoose.connection.on('error', (err) => {
        console.log(err.name + ': ' + err.message);
    });
}
// @}

//
// Basic configurations @{
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));
// @}

//
// Routes @{
const routeExample = require('./routes/example');
app.use('/example', routeExample);
// @}

//
// Avoid CORS validations.
if (!respectCORS) {
    const cors = require('cors');
    app.all('*', cors());
}

//
// RESTful imports.
//  @note this depends on the presence of a Mongo database.
if (dbName) {
    //
    // Required libraries.
    let methodOverride = require('method-override');
    let restify = require('express-restify-mongoose');
    //
    // Middlewares.
    app.use(methodOverride());
    //
    // RESTful API options.
    let restOptions = {
        prefix: '/rest'
    };
    //
    // Exposing models.
    restify.serve(app, require('./schemas/example'), restOptions); // URI: /rest/v1/examples
}
// @}

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

// Create an HTTP service.
http.createServer(app).listen(port, () => {
    console.log("+--------------------------------------------------");
    console.log(`| Server running on 'http://localhost:${port}'`);

    console.log("| \tDB: " + (dbName ? dbName : 'Not in use'));
    if (dbName) {
        console.log("| \t\tRestify available");
    }
    console.log("| \tCORS: " + (respectCORS ? 'Respects the protocol' : 'Avoiding warnings'));

    console.log("+--------------------------------------------------");
});
//
// Create an HTTPS service identical to the HTTP service.
if (portSSL) {
    https.createServer(options, app).listen(portSSL, () => {
        console.log(`| Secure Server running on 'https://localhost:${portSSL}'`);
        console.log("+--------------------------------------------------");
    });
}

//
// Process exit detection @{
const cleanUpProcess = (from, err) => {
    tracker.logSummary();

    if (err) {
        console.error(err.stack);
    }

    process.exit();
};
process.on('SIGINT', () => cleanUpProcess('SIGINT'));
process.on('uncaughtException', (err) => cleanUpProcess('uncaughtException', err));
// @}
