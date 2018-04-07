const test = require('tape')
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
    'blubbi',
    'foo bar whatever'
  ]

  var patch = createPatch(obj1, obj2)
  t.ok(patch)
  t.equals(patch.length, 1, 'patch must include one change')
  t.equals(patch[0].type, 'change', 'the type must equal "change"')
  t.equals(patch[0].index, 1, 'the index must be zero')
  t.end()
})

test('one entry removed', function (t) {
  let obj1 = [
    1, 2, 3, 4, 5
  ]

  let obj2 = [
    1, 2, 4, 5
  ]

  var patch = createPatch(obj1, obj2)
  t.ok(patch)
  t.equals(patch.length, 1, 'patch must include one change')
  t.equals(patch[0].type, 'deletion', 'the type must equal "deletion"')
  t.equals(patch[0].index, 2, 'the index must be 2')
  t.end()
})
