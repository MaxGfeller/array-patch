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

### The `compare` function

This module works by first building a list of unchanged couples using
[`object-hash`](https://npm.im/object-hash). This works very well for most cases
but imagine the following scenario:

```javascript
var arr1 = ['foo', 'bar', 'baz']
var arr2 = ['foo', 'blub', 'bar1', 'baz']
```

Visibly it's clear that we inserted a new entry 'blub' into the second array
and changed the value of the entry 'bar' to 'bar1'. But because the hashes
obviously change when the value changes, the result in this case would be that
we have a change from 'bar' to 'blub' and a new entry 'bar1'.

To catch those unnecessary changes you can give a `compare` function. This will
be applied for the cases where it's not entirely clear and there are multiple
possible candidates.

The arguments for the function will be the value from the initial array and the
possible value from the second array. The function must return a value between 0 and 1
representing the similarity of the two values

This example can be implemented like the following:

```javascript
var arr1 = [1, 2, 3, 4]
var arr2 = [1, 5, 2, 4]

var patch = createPatch(arr1, arr2, (val1, val2) => {
  return val2 / val1
})

console.log(patch)
// => [ { type: 'insertion', index: 1, value: 5 },
//  { type: 'deletion', index: 2 } ]
```

For a text array you could use [`similarity`](https://npm.im/similarity) like the following:

```javascript
var similarity = require('similarity')

var arr1 = ['foo', 'bar', 'baz']
var arr2 = ['foo', 'blub', 'bar1', 'baz']

var patch = createPatch(arr1, arr2, similarity)

console.log(patch)
// => [ { type: 'insertion', index: 0, value: 'blub' },
//  { type: 'change', index: 1, value: 'bar1' } ]
```

## Requirements

This module runs on `node >= 8` and modern browsers using [Browserify](http://browserify.org/)
or [Webpack](https://webpack.js.org/).

## Tests

The tests are implemented in `tests/` using [tape](https://www.npmjs.com/package/tape). Run them with `npm test`.

## Issues

If you find any issues, please file them on the [Github repo](https://github.com/MaxGfeller/array-patch). If
you submit pull requests, please make sure that the tests (`npm test`) pass.
