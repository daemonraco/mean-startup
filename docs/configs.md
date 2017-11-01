# Configuration files

## Create a new configuration
If you need to place a bunch of configuration values somewhere with easy access,
you can create a JSON file inside `configs`.
Let's say you want to create a configuration called `my-conf`, you can create a
file at `configs/my-conf.config.json` with something like this:
```json
{
    "somevalue": true,
    "template": {
        "height": 10.4,
        "width": 12.9
    }
}
```

If you do this, you may write something like this in your modules (we'll suppose
this code is inside `includes`):
```js
'use strict';

const Configs = require('./core/configs.manager');
const myConf = Configs.get('my-conf');

// This prompts:
//    Geometry: 12.9 x 10.4
console.log(`Geometry: ${myConf.template.width} x ${myConf.template.height}`);
```

## Configuration by environment
Now let's say you run your code as `ENV_NAME=my_env npm run start:live` and in
that particular environment your __template__ __height__ is different.
Well you can create a JSON file at `configs/my-conf.config.my_env.json` with something like this:
```json
{
    "template": {
        "height": 20.4
    }
}
```
With this, your `console.log` will prompt `Geometry: 12.9 x 20.4`.

## Exported values
By default this mean implementation provides an open route that allows you to
access config vaules from a url.
Something like this:
>http://localhost:3000/public-configs

This url will return a simple JSON with a list of configuration files that export some value:
```json
{
    "configs": [
        "example",
        "main"
    ]
}
```

Then you can access to something like this:
>http://localhost:3000/public-configs/example

And get a JSON reponse looking like:
```json
{
    "field": "value",
        "anotherExample": {
        "aBoolean": false
    }
}
```

### Security
If you are concerned about the security of your configuration values, they won't
be accessible unless you specify it.

### How to export values
Let's say you want to export the value of __height__ from your config file, for
that you can change `my-conf.config.js` into something like this:
```json
{
    "somevalue": true,
    "template": {
        "height": 10.4,
        "width": 12.9
    },
    "$pathExports": {
        "defaultTemplateHeight": "$.template.height"
    },
    "$exports": {
        "somevalue": 32
    }
}
```
_Note_: `$.template.height` is written using JSONPath.

The section `$exports` let's you export any other value that doesn't require to
be in a specific path inside your configuration file.

At this point, if you go to:
>http://localhost:3000/public-configs/my-conf

You'll get something like this:
```json
{
    "somevalue": 32,
    "defaultTemplateHeight": 20.4
}
```

## Main configurations
As expected, this _MEAN_ implementation already has a required configuration
file called `main`.

Such configuration holds some values that change the behavior of your server:
* `db`: Mongoose configuration
    * `active` (boolean): Indicates if a mongo database connection has to be
    used or not.
    * `connectionString` (string): Database connection url.
* `respectCORS` (boolean): When `false`, your server won't enforce CORS checks.
* `hiddenSchemas` (string[]): By default, all your schemas are published through
[restify](https://florianholzapfel.github.io/express-restify-mongoose/), but if
you want to hide some of them from the internet, you may add their names into
this list.

---
[Back](_contents.md)