//
// Environment configurations @{
var port = process.env.PORT || 3000;
var portSSL = process.env.PORT_SSL || false;
var dbName = process.env.DB_NAME || false;
// @}

//
// Required libraries @{
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var https = require('https');
var http = require('http');
var fs = require('fs');
// @}

//
// Main application.
var app = express();

//
// Database.
if (dbName) {
    var mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/' + dbName);
    mongoose.connection.on('error', (err) => {
        console.log(err.name + ': ' + err.message);
    });
}
// @}

//
// Basic configurations @{
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
// @}

//
// Routes @{
var routeExample = require('./routes/example');
app.use('/example', routeExample);
// @}

//
// Default redirects.
app.use(function (req, res) {
    // Use res.sendfile, as it streams instead of reading the file into memory.
    res.sendFile(__dirname + '/public/index.html');
});

//
// HTTPS options.
var options = {
    key: fs.readFileSync('secure/key.pem'),
    cert: fs.readFileSync('secure/cert.pem')
};

// Create an HTTP service.
http.createServer(app).listen(port, () => {
    console.log("Server running on 'http://localhost:" + port + "'");
});
//
// Create an HTTPS service identical to the HTTP service.
if (portSSL) {
    https.createServer(options, app).listen(portSSL, () => {
        console.log("Secure Server running on 'https://localhost:" + portSSL + "'");
    });
}
