'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class MiddlewaresManager {
  //
  // Constructor.
  constructor() {
    this._load();
  }
  //
  // Public methods.
  /**
  * Loading middlewares automatically. Any file in './includes' that matches the
  * pattern '(.+)\.middleware\.js$' will be automatically required.
  */
  load({ app }) {
    if (!this._loaded) {
      this._loaded = true;

      const auxTools = { app };
      const pattern = /(.+)\.middleware\.js$/;
      const middlewaresPath = path.join(__dirname, '..');
      const middlewares = fs
        .readdirSync(middlewaresPath)
        .filter(x => x.match(pattern))
        .map(x => {
          return {
            name: x.replace(pattern, '$1'),
            path: path.join(middlewaresPath, x)
          };
        });

      if (middlewares.length > 0) {
        console.log(`| Loading middlewares:`);

        for (let i in middlewares) {
          try {
            app.use(require(middlewares[i].path));
            console.log(`| \t- '${chalk.green(middlewares[i].name)}'`);
          } catch (e) {
            console.error(chalk.red(`Unable to load middleware '${middlewares[i].name}'.\n\tError: ${e.message}`));
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

const instance = new MiddlewaresManager();

module.exports = instance;
