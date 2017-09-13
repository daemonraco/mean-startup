'use strict';

const fs = require('fs');
const path = require('path');

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
            this._configs[files[i].name] = require(files[i].path);
        }
    }
}

const instance = new ConfigsManager();

module.exports = instance;
