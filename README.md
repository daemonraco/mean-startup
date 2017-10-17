<img alt="MEAN" src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Meanstack-624x250.jpg" height="60px"/>

# What is it?
This is a simple [MEAN](https://en.wikipedia.org/wiki/MEAN_(software_bundle))
application that gives you a starting point to build something in using:
* [MongoDB](https://www.mongodb.com/) (optional)
* [Express](http://expressjs.com/)
* [Angular](https://angular.io/) (version 4)
* [NodeJS](https://nodejs.org)

## What do I get?
This are some of the things you get:
* A fully functional server based on NodeJS using Express.
* A fully functional client based on Angular 4.
* If you choose, it can serve both as HTTP and HTTPS with some PEMs, only setting
an environment variable.
* Automatic connection to a local MongoDB using [Mongoose](http://mongoosejs.com/)
by only setting an environment variable.
* It automatically ignores CORS issues, unless you want to disable this (that's
another environment variable).
* An API example.
* An RESTful example using [Restify](http://restify.com/) (if you choose to use
MongoDB).
* Your client already has bootstrap applyed, routes configured, a 404 page, a
simple CRUD that uses the RESTfull example on your server, etc.
* Some handy scripts to build your applicating and get it ready to deploy in
production.
* ... and more :)

## Should I use it?
Well, that's up to you.
After all, this is not the only solution to build this kind of applications.

# Installation
* Clone it
```bash
git clone https://github.com/daemonraco/mean-startup.git
cd mean-startup
```
* Initialize it
```bash
npm run init
```

# Usage
## Launching the server
```bash
npm start
```
We recommend to use [`nodemon`](https://www.npmjs.com/package/nodemon).

### Launching the server with HTTPS
```bash
PORT_SSL=3001 npm start
```
### Launching the server with MongoDB
```bash
DB_NAME=mydb npm start
```

## Launching the client
```bash
npm run start:client
```
Again, we recommend to use [`nodemon`](https://www.npmjs.com/package/nodemon).

# Build
Getting ready for production?
## Build it
```bash
npm run build
```

## Build only client
```bash
npm run build:client
```

## Licence
MIT &copy; [Alejandro Dario Simi](http://daemonraco.com)