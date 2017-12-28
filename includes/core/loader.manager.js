'use strict';

/**
 * Loader example:
 * <code>
 * 'use strict';
 *
 * modules.exports = () => {}
 * </code>
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class LoadersManager {
    //
    // Constructor.
    constructor() {
        this._load();
    }
    //
    // Public methods.
    /**
    * Loading loaders automatically. Any file in './includes' that matches the
    * pattern '(.+)\.loader\.js$' will be automatically required.
    */
    load({ app }) {
        if (!this._loaded) {
            this._loaded = true;

            const auxTools = { app };
            const pattern = /(.+)\.loader\.js$/;
            const loadersPath = path.join(__dirname, '..');
            const loaders = fs
                .readdirSync(loadersPath)
                .filter(x => x.match(pattern))
                .map(x => {
                    return {
                        name: x.replace(pattern, '$1'),
                        path: path.join(loadersPath, x)
                    };
                });

            if (loaders.length > 0) {
                console.log(`| Loading loaders:`);

                for (let i in loaders) {
                    try {
                        require(loaders[i].path)(auxTools);
                        console.log(`| \t- '${chalk.green(loaders[i].name)}'`);
                    } catch (e) {
                        console.error(chalk.red(`Unable to load loader '${loaders[i].name}'.\n\tError: ${e}`));
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

const instance = new LoadersManager();

module.exports = instance;
