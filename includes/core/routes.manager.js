'use strict';

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const configs = require('./configs.manager');

class RoutesManager {
    //
    // Constructor.
    constructor() {
        this._load();
    }
    //
    // Public methods.
    /**
    * Loading routes automatically. Any file in './routes' that matches the
    * pattern '(.+)\.route\.js$' will be automatically required.
    */
    load({ app }) {
        if (!this._loaded) {
            this._loaded = true;

            const auxTools = { app };
            const pattern = /(.+)\.route\.js$/;
            const routesPath = path.join(__dirname, '../../routes');
            const routes = fs
                .readdirSync(routesPath)
                .filter(x => x.match(pattern))
                .map(x => {
                    return {
                        name: x.replace(pattern, '$1'),
                        path: path.join(routesPath, x)
                    };
                });

            if (routes.length > 0) {
                console.log(`| Loading routes:`);

                for (let i in routes) {
                    try {
                        auxTools.routeName = routes[i].name;
                        require(routes[i].path)(auxTools);
                        console.log(`| \t- '${chalk.green(routes[i].name)}'`);
                    } catch (e) {
                        console.error(chalk.red(`Unable to load route '${routes[i].name}'.\n\tError: ${e.message}`));
                    }
                }

                console.log(`|`);
            }
        }
    }
    //
    // Protected methods.
    _load() {
        this._loaded = false;
    }
}

const instance = new RoutesManager();

module.exports = instance;
