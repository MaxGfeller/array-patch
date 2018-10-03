const hash = require('object-hash')

module.exports.createPatch = function createPatch (arr1, arr2, compareFn) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    throw Error('input objects need to be arrays')
  }

  var changes = []

  var a = Object.assign([], arr1).map(k => hash(k))
  var b = Object.assign([], arr2).map(k => hash(k))

  var map = Object.assign({}, a)
  Object.keys(map).map(k => {
    map[k] = null
  })

  Object.keys(map).map(k => {
    if (a[k] === b[k]) map[k] = k
  })

  let lastRightSideMatch = 0
  Object.keys(map).map(k => {
    if (map[k] !== null) {
      lastRightSideMatch = map[k]
      return
    }

    var nextMatch
    nextMatch = Object.keys(map).slice(parseInt(k)).find(k => map[k] !== null)

    if (nextMatch) nextMatch = parseInt(nextMatch)

    var found = null
    b.slice(parseInt(lastRightSideMatch), nextMatch).find((v, i) => {
      if (v !== a[k]) return false

      found = `${i + parseInt(lastRightSideMatch)}`
      return true
    })

    map[k] = found
  })

  lastRightSideMatch = null
  Object.keys(map).map((k, i) => {
    if (map[k] !== null) {
      lastRightSideMatch = map[k]
      return
    }

    if (i === 0) {
      map[k] = '0'
      lastRightSideMatch = map[k]
      changes.push({ type: 'change', index: parseInt(k), value: arr2[map[k]] })
      return
    }

    if (lastRightSideMatch === null) return

    if (Object.values(map).includes(`${parseInt(lastRightSideMatch) + 1}`)) return

    var possibles = []

    for (let i = parseInt(lastRightSideMatch) + 1; i < b.length; i++) {
      if (!(Object.values(map).includes(`${i}`))) possibles.push(`${i}`)
    }

    if (possibles.length === 1 || !compareFn) {
      map[k] = possibles[0]

      lastRightSideMatch = map[k]
      changes.push({ type: 'change', index: parseInt(k), value: arr2[map[k]] })
      return
    }

    let chosen = possibles[0]
    let chosenValue = 0
    possibles.map((candidate) => {
      // returns a decimal value representing the similarity between candidates
      let similarity = compareFn(arr1[k], arr2[candidate])
      if (similarity > chosenValue) {
        chosen = candidate
        chosenValue = similarity
      }
    })

    map[k] = chosen

    lastRightSideMatch = map[k]
    changes.push({ type: 'change', index: parseInt(k), value: arr2[map[k]] })
  })

  Object.keys(map).map(k => {
    if (map[k] !== null) return

    changes.push({ type: 'deletion', index: parseInt(k) })
  })

  var insertionCounter = 0
  var values = Object.values(map)
  var lastLeftSideIndex = -1
  Object.keys(b).map(k => {
    if (values.includes(k)) {
      lastLeftSideIndex = values.indexOf(k)
      return
    }

    changes.push({
      type: 'insertion',
      index: lastLeftSideIndex,
      value: arr2[k],
      count: insertionCounter++
    })
  })

  return changes.sort((a, b) => {
    if (a.index < b.index) return -1
    if (a.index > b.index) return 1
    if (a.type === 'change' && b.type === 'change') return 0
    if (a.type === 'change') return -1
    if (b.type === 'change') return -1
    if (a.type === 'deletion' && b.type === 'deletion') return 0
    if (a.type === 'deletion') return -1
    if (a.type === 'insertion' && b.type === 'insertion') {
      if (a.count < b.count) return -1
      return 1
    }
    if (a.type === 'insertion') return -1
  }).map((x) => {
    if (typeof x.count !== 'undefined') delete x.count
    return x
  })
}

module.exports.applyPatch = function applyPatch (arr, patches) {
  if (!Array.isArray(arr) || !Array.isArray(patches)) {
    throw Error('input objects need to be arrays')
  }

  var obj2 = Object.assign([], arr)
  var offset = 0

  patches.map((patch) => {
    if (patch.type === 'change') {
      obj2[patch.index + offset] = patch.value
      return
    }

    if (patch.type === 'insertion') {
      obj2.splice(patch.index + ++offset, 0, patch.value)
      return
    }

    if (patch.type === 'deletion') {
      obj2.splice(patch.index + offset, 1)
    }
  })

  return obj2
}
