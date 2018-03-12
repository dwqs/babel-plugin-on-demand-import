[![build pass](https://api.travis-ci.org/dwqs/babel-plugin-on-demand-import.svg?branch=master)](https://travis-ci.org/dwqs/babel-plugin-on-demand-import?branch=master) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) ![npm-version](https://img.shields.io/npm/v/babel-plugin-on-demand-import.svg) ![license](https://img.shields.io/npm/l/babel-plugin-on-demand-import.svg)
# babel-plugin-on-demand-import
Babel plugin for importing components on demand.

## Installation
Install the pkg with npm:

```
npm i babel-plugin-on-demand-import -D
```

or yarn

```
yarn add babel-plugin-on-demand-import -D
```

## Usage

Via `.babelrc` or babel-loader.

```
{
  "plugins": [["on-demand-import", options]]
}
```

### options

`options` can be object.

```
{
    libraryName: 'test',
    libraryPath: 'lib',  // default: lib
    stylePath: 'your-style-path', // defalut: undefined
    needImportStyle: true       // default: false
}
```

`options` can be an array.

```
[
    {
        libraryName: 'test1'
    },
    {
        libraryName: 'test2'
    }
]
```

## Example

**{ "libraryName": "test1" }**

```js
import { A } from 'test1';

↓ ↓ ↓ ↓ ↓ ↓

var a = require('test1/lib/a');
```

**{ "libraryName": "test2", libraryPath: 'dist/my-library', stylePath: 'style1', needImportStyle: true }**

```
import { B } from 'test2';

↓ ↓ ↓ ↓ ↓ ↓

var b = require('test2/dist/my-library/b');
require('test2/style1/b.css');
```

## Used Components
* [v2-datepicker](https://github.com/dwqs/v2-datepicker/)
* [vue-area-linkage](https://github.com/dwqs/vue-area-linkage)

## LICENSE
MIT
