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
    environmentName() {
        return this._environmentName;
    }
    get(name) {
        return typeof this._configs[name] ? this._configs[name] : {};
    }
    publishExports() {
        const pattern = /^\/public-configs([\/]?)(.*)$/;
        return (req, res, next) => {
            let responded = false;
            if (req.originalUrl.match(pattern)) {
                const name = req.originalUrl.replace(pattern, '$2');
                if (name) {
                    if (typeof this._configs[name] !== 'undefined' && typeof this._configs[name].$exports !== 'undefined') {
                        res.json(this._configs[name].$exports);
                    } else {
                        if (typeof this._configs[name] !== 'undefined') {
                            res.status(404).json({
                                error: true,
                                message: `Configurations file '${name}' has no exports.`
                            });
                        } else {
                            res.status(404).json({
                                error: true,
                                message: `Unknown configurations file '${name}'.`
                            });
                        }
                    }
                } else {
                    res.json({
                        configs: Object.keys(this._configs)
                    });
                }

                responded = true;
            }

            if (!responded) {
                next();
            }
        };
    }
    //
    // Protected methods.
    _load() {
        this._environmentName = process.env.ENV_NAME || 'develpment';

        console.log(`| Loading configs (environment: ${chalk.green(this._environmentName)}):`);

        this._configsDir = path.join(__dirname, '../configs');

        const pattern = /^(.*)\.config\.(json|js)$/;
        const envPattern = new RegExp(`^(.*)\.config\.${this._environmentName}\.(json|js)$`);

        //
        // Loading basic configuration files.
        const files = fs
            .readdirSync(this._configsDir)
            .filter(x => x.match(pattern))
            .map(x => {
                return {
                    name: x.replace(pattern, '$1'),
                    path: path.join(this._configsDir, x)
                };
            });

        //
        // Loading evironment specific configuration files.
        const envFiles = fs
            .readdirSync(this._configsDir)
            .filter(x => x.match(envPattern))
            .map(x => {
                return {
                    name: x.replace(envPattern, '$1'),
                    path: path.join(this._configsDir, x)
                };
            });

        //
        // Merging lists.
        for (let i in files) {
            for (let j in envFiles) {
                if (files[i].name === envFiles[j].name) {
                    files[i].specific = envFiles[j];
                    break;
                }
            }
        }

        this._configs = {};
        for (let i in files) {
            try {
                console.log(`| \t- '${chalk.green(files[i].name)}'${files[i].specific ? ` (has environment specific)` : ''}`);
                //
                // Loading basic configuration.
                this._configs[files[i].name] = require(files[i].path);
                //
                // Mergin with the environment specific configuration.
                if (files[i].specific) {
                    this._configs[files[i].name] = Object.assign(this._configs[files[i].name], require(files[i].specific.path));
                }
            } catch (e) {
                console.error(`Unable to load config '${files[i].name}'.\n\tError: ${e.message}`);
            }
        }

        console.log(`|`);
    }
}

const instance = new ConfigsManager();

module.exports = instance;
