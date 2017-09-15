'use strict';

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const configs = require('./configs.manager');

class SchemasManager {
    //
    // Constructor.
    constructor() {
        this._load();
    }
    //
    // Public methods.
    loadInternalSchemas() {
        if (!this._internalSchemasLoaded) {
            this._internalSchemasLoaded = true;

            const schemas = this._schemas.filter(x => this._hiddenSchemas.indexOf(x.name) > -1);

            if (schemas.length > 0) {
                console.log(`| Loading internal schemas:`);
                for (let i in schemas) {
                    try {
                        require(schemas[i].path);
                        console.log(`| \t- '${chalk.green(schemas[i].name)}'`);
                    } catch (e) {
                        console.error(`Unable to load schema '${schemas[i].name}'.\n\tError: ${e.message}`);
                    }
                }
                console.log(`|`);
            }
        }
    }
    loadRestfulSchemas({ app }) {
        if (!this._restfulSchemasLoaded) {
            this._restfulSchemasLoaded = true;
            //
            // Required libraries.
            const methodOverride = require('method-override');
            const restify = require('express-restify-mongoose');
            //
            // Middlewares.
            app.use(methodOverride());
            //
            // RESTful API options.
            const restOptions = {
                prefix: '/rest'
            };

            const schemas = this._schemas.filter(x => this._hiddenSchemas.indexOf(x.name) < 0);

            if (schemas.length > 0) {
                console.log(`| Exposing schemas through Restify:`);
                for (let i in schemas) {
                    try {
                        restify.serve(app, require(schemas[i].path), restOptions);
                        console.log(`| \t- '/rest/v1/${chalk.green(schemas[i].name)}'`);
                    } catch (e) {
                        console.error(`Unable to load schema '${schemas[i].name}'.\n\tError: ${e.message}`);
                    }
                }
                console.log(`|`);
            }
        }
    }
    //
    // Protected methods.
    _load() {
        this._restfulSchemasLoaded = false;
        this._internalSchemasLoaded = false;

        this._configs = configs.get('schemas');
        this._hiddenSchemas = this._configs.hiddenSchemas;

        //
        // Any file in './schema' that matches the pattern '^(.+)\.schema\.js$'
        // will be considered for loading. @{
        const pattern = /^(.+)\.schema\.js$/;
        const schemasPath = path.join(__dirname, '../schemas');
        this._schemas = fs
            .readdirSync(schemasPath)
            .filter(x => x.match(pattern))
            .map(x => {
                return {
                    name: x.replace(pattern, '$1'),
                    path: path.join(schemasPath, x)
                };
            });
        // @}
    }
}

const instance = new SchemasManager();

module.exports = instance;
