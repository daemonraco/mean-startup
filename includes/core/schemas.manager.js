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
    get(name) {
        let schema = null;

        for (let i in this._schemas) {
            const entry = this._schemas[i];
            if (entry.name === name) {
                if (entry.loaded) {
                    schema = mongoose.model('examples');
                } else {
                    schema = require(entry.path);
                    entry.loaded = true;
                }
                break;
            }
        }

        return schema;
    }
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
                        schemas[i].loaded = true;
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
                        const callbacks = {};
                        for (let k in schemas[i].callbacks) {
                            callbacks[k] = require(schemas[i].callbacks[k]);
                        }

                        restify.serve(app, require(schemas[i].path), Object.assign(callbacks, restOptions));
                        console.log(`| \t- '/rest/v1/${chalk.green(schemas[i].name)}'`);
                        schemas[i].loaded = true;
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
        // Any file in 'ROOTDIR/schema' that matches the pattern
        // '^(.+)\.schema\.js$' will be considered for loading. @{
        const pattern = /^(.+)\.schema\.js$/;
        const schemasPath = path.join(__dirname, '../../schemas');
        this._schemas = fs
            .readdirSync(schemasPath)
            .filter(x => x.match(pattern))
            .map(x => {
                return {
                    name: x.replace(pattern, '$1'),
                    path: path.join(schemasPath, x),
                    callbacks: {},
                    loaded: false
                };
            });
        // @}

        //
        // Any file in 'ROOTDIR/schema/_middleware' will be considered as schema callbacks.
        // check https://florianholzapfel.github.io/express-restify-mongoose/#reference
        // for more information.
        // Each file name should match the pattern '^(.+)\.(.+)\.js$' where the
        // first parameter is the name of your schema and the second is the name
        // of a callback. @{
        const schemasMWPath = path.join(schemasPath, '_middleware');
        const patternMW = /^(.+)\.(.+)\.js$/;
        this._schemasMiddlewares = fs
            .readdirSync(schemasMWPath)
            .filter(x => x.match(patternMW))
            .map(x => {
                return {
                    schema: x.replace(pattern, '$1'),
                    callback: x.replace(pattern, '$1'),
                    path: path.join(schemasMWPath, x),
                };
            });
        // @}

        //
        // Merging schemas and middlewares. @{
        for (let ks in this._schemas) {
            const schemaName = this._schemas[ks].name;

            for (let km in this._schemasMiddlewares) {
                if (this._schemasMiddlewares[km].schema == schemaName) {
                    this._schemas[ks].callbacks[this._schemasMiddlewares[km].callback] = this._schemasMiddlewares[km].path;
                }
            }
        }
        // @}
    }
}

const instance = new SchemasManager();

module.exports = instance;
