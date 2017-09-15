'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class ConfigsManager {
    //
    // Constructor.
    constructor() {
        this._load();
    }
    //
    // Public methods.
    configsDir() {
        return this._configsDir;
    }
    get(name) {
        return typeof this._configs[name] ? this._configs[name] : {};
    }
    //
    // Protected methods.
    _load() {
        console.log(`| Loading configs:`);

        this._configsDir = path.join(__dirname, '../configs');

        const pattern = /^(.*)\.config\.(json|js)$/;
        const files = fs
            .readdirSync(this._configsDir)
            .filter(x => x.match(pattern))
            .map(x => {
                return {
                    name: x.replace(pattern, '$1'),
                    path: path.join(this._configsDir, x)
                };
            });

        this._configs = {};
        for (let i in files) {
            try {
                this._configs[files[i].name] = require(files[i].path);
                console.log(`| \t- '${chalk.green(files[i].name)}'`);
            } catch (e) {
                console.error(`Unable to load config '${files[i].name}'.\n\tError: ${e.message}`);
            }
        }

        console.log(`|`);
    }
}

const instance = new ConfigsManager();

module.exports = instance;
