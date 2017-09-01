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
const tools = {
    app
};

//
// Database.
tools.mongoose = undefined;
if (dbName) {
    tools.mongoose = require('mongoose');
    tools.mongoose.Promise = global.Promise;
    tools.mongoose.connect(`mongodb://localhost/${dbName}`, {
        useMongoClient: true
    });
    tools.mongoose.connection.on('error', (err) => {
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
// Loading routes automatically. Any file in './routes' that matches the pattern
// '(.*)\.route\.js' will automatically required. @{
{
    const routesPath = path.join(__dirname, 'routes');
    const routes = fs.readdirSync(routesPath);
    const pattern = /(.*)\.route\.js$/;
    const auxTools = Object.assign({}, tools);
    for (let i in routes) {
        if (routes[i].match(pattern)) {
            try {
                auxTools.routeName = routes[i].replace(pattern, '$1');
                require(path.join(routesPath, routes[i]))(auxTools);
            } catch (e) {
                console.error(`Unable to load route '${routes[i]}'.\n\tError: ${e.message}`);
            }
        }
    }
}
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
    if (err) {
        console.error(err.stack);
    }

    process.exit();
};
process.on('SIGINT', () => cleanUpProcess('SIGINT'));
process.on('uncaughtException', (err) => cleanUpProcess('uncaughtException', err));
// @}
