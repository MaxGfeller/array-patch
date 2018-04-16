const test = require('tape')
const hash = require('object-hash')
const { createPatch } = require('../')

test('one entry changed', function (t) {
  let obj1 = [
    'aaa bbb ccc',
    'a b c',
    'foo bar whatever'
  ]

  let obj2 = [
    'aaa bbb ccc',
    'a b c d',
    'foo bar whatever'
  ]

  let patch = createPatch(obj1, obj2)
  t.ok(patch)
  t.equals(patch.length, 1, 'patch must include one change')
  t.equals(patch[0].type, 'change', 'the type must equal "change"')
  t.equals(patch[0].index, 1, 'the index must be zero')
  t.end()
})

test('one entry removed', function (t) {
  let obj1 = [1, 2, 3, 4, 5]

  let obj2 = [1, 2, 4, 5]

  let patch = createPatch(obj1, obj2)
  t.ok(patch)
  t.equals(patch.length, 1, 'patch must include one change')
  t.equals(patch[0].type, 'deletion', 'the type must equal "deletion"')
  t.equals(patch[0].index, 2, 'the index must be 2')
  t.end()
})

test('one entry added', function (t) {
  let obj1 = [1, 2, 4, 5]
  let obj2 = [1, 2, 3, 4, 5]

  let patch = createPatch(obj1, obj2)
  t.ok(patch)
  t.equals(patch.length, 1, 'patch must include one change')
  t.equals(patch[0].type, 'insertion', 'the type must equal "insertion"')
  t.equals(patch[0].index, 1, 'the index must be 1')
  t.end()
})

test('multiple changes', function (t) {
  let obj1 = [1, 2, 3, 6, 7]
  let obj2 = [1, 3, 4, 5, 7]

  let patch = createPatch(obj1, obj2)
  t.ok(patch)
  t.equals(patch.length, 3, '2 changes must be included')
  t.equals(patch[0].index, 1, 'first one first')
  t.equals(patch[1].index, 3, 'correct order')
  t.end()
})

test('calling createPatch with anything other than an array should throw', function (t) {
  t.throws(() => {
    createPatch({}, [])
  }, 'input objects need to be arrays')
  t.throws(() => {
    createPatch({}, false)
  }, 'input objects need to be arrays')
  t.throws(() => {
    createPatch([], 1)
  }, 'input objects need to be arrays')
  t.end()
})

test('pass a compare function and see if gets called', function (t) {
  let obj1 = ['foo', 'bar', 'baz']
  let obj2 = ['foo', 'blub', 'bar1', 'baz']

  let comparisons = []
  createPatch(obj1, obj2, (val1, val2) => {
    comparisons.push([val1, val2])
    return false
  })
  t.equals(comparisons.length, 2, 'compare function has been called twice')
  t.equals(hash(comparisons[0]), hash(['bar', 'blub']))
  t.equals(hash(comparisons[1]), hash(['bar', 'bar1']))
  t.end()
})

test('pass a compare function and see if gets called', function (t) {
  let obj1 = ['foo', 'bar', 'baz']
  let obj2 = ['foo', 'blub', 'bar1', 'baz']

  let patch = createPatch(obj1, obj2, (val1, val2) => {
    if (val2.indexOf(val1) > -1) return true
    return false
  })

  t.equals(patch.length, 2)
  t.equals(patch[0].type, 'insertion')
  t.equals(patch[1].type, 'change')
  t.equals(patch[1].index, 1)
  t.equals(patch[1].value, 'bar1')
  t.end()
})
