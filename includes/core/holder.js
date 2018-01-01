'use strict';

const chalk = require('chalk');

class Holder {
    constructor() {
        this._pointers = {};
    }

    //
    // Public methods.
    access(key) {
        return this._pointers[key];
    }
    register(key, pointer) {
        if (Array.isArray(key)) {
            key.forEach(k => this.register(k, pointer));
        } else {
            if (typeof this._pointers[key] === 'undefined') {
                this._pointers[key] = pointer;
            } else {
                console.error(chalk.red(`Holder::register() Error: Key ${key} is already registered.`));
            }
        }
    }
}

const instance = new Holder();

module.exports = instance;