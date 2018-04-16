# array-patch

[![build status](https://secure.travis-ci.org/MaxGfeller/array-patch.png)](http://travis-ci.org/MaxGfeller/array-patch)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

When given two arrays, this module creates patches that let you modify the first
array into the second one. This is especially useful for [`HTTP PATCH`](https://tools.ietf.org/html/rfc5789) methods (when
you only want to send the changes) or just to get a overview of what changed between
two given arrays.

## Usage

```javascript
const { createPatch, applyPatch } = require('array-patch')

var arr1 = [1, 2, 3, 4, 5]
var arr2 = [1, 3, 4, 6]

var patch = createPatch(arr1, arr2)
console.log(applyPatch(arr1, patch))
// => [1, 3, 4, 6]
```

Applying a produced patch always transforms the first array into the second. If you
find a case where the resulting patched array is not equal to the given second array,
please file an issue.

## Requirements

This module runs on `node >= 8` and modern browsers using [Browserify](http://browserify.org/)
or [Webpack](https://webpack.js.org/).

## Tests

The tests are implemented in `tests/` using [tape](https://www.npmjs.com/package/tape). Run them with `npm test`.

## Issues

If you find any issues, please file them on the [Github repo](https://github.com/MaxGfeller/array-patch). If
you submit pull requests, please make sure that the tests (`npm test`) pass.
