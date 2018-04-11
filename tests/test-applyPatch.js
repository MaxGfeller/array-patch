const test = require('tape')
const hash = require('object-hash')
const { createPatch, applyPatch } = require('../')

test('patch for one deletion', function (t) {
  let obj1 = [1, 2, 3, 4, 5]
  let obj2 = [1, 3, 4, 5]

  let patch = createPatch(obj1, obj2)
  t.ok(patch)
  let patchedObj = applyPatch(obj1, patch)
  t.equals(hash(obj2), hash(patchedObj))
  t.end()
})

test('patch for one change', function (t) {
  let obj1 = [1, 2, 3, 4, 5]
  let obj2 = [1, 2, 3, 4, 5]

  let patch = createPatch(obj1, obj2)
  t.ok(patch)
  let patchedObj = applyPatch(obj1, patch)
  t.equals(hash(obj2), hash(patchedObj))
  t.end()
})

test('patch for one insertion', function (t) {
  let obj1 = [1, 2, 4, 5]
  let obj2 = [1, 2, 3, 4, 5]

  let patch = createPatch(obj1, obj2)
  t.ok(patch)
  let patchedObj = applyPatch(obj1, patch)
  t.equals(hash(obj2), hash(patchedObj))
  t.end()
})

test('patch for a lot of changes', function (t) {
  let obj1 = [1, 3, 4, 5, 6, 9, 10]
  let obj2 = [1, 2, 3, 4, 4, 9, 10, 11]

  let patch = createPatch(obj1, obj2)
  t.ok(patch)
  let patchedObj = applyPatch(obj1, patch)
  t.equals(hash(obj2), hash(patchedObj))
  t.end()
})

test('patching two completely different arrays', function (t) {
  let obj1 = ['foo', 'bar', 'baz']
  let obj2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

  let patch = createPatch(obj1, obj2)
  t.ok(patch)
  let patchedObj = applyPatch(obj1, patch)
  t.equals(hash(obj2), hash(patchedObj))
  t.end()
})

test('throws when arguments are not arrays', function (t) {
  t.throws(() => {
    applyPatch({}, [])
  })
  t.end()
})
