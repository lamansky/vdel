'use strict'

const canDeleteProp = require('can-delete-prop')
const equals = require('equals')
const is = require('is-instance-of')
const isObject = require('is-object')
const keysOf = require('keys-of')
const purge = require('purge')
const xfn = require('xfn')

module.exports = xfn({
  pluralArg: 1,
  pluralProp: 'all',
}, function del (collection, valuesToDelete, options = {}) {
  const {arrays = [], loose, looselyEquals = equals, maps = [], sets = [], weakSets = []} = options

  let itemsDeleted = 0

  if (!isObject(collection)) throw new TypeError('Cannot delete value of a non-object')

  if (is(collection, ['Array', arrays])) {
    const oldSize = collection.length
    purge(collection, loose ? v => valuesToDelete.some(d => looselyEquals(v, d)) : v => valuesToDelete.includes(v))
    return oldSize - collection.length
  } else if (is(collection, ['WeakSet', weakSets]) || (!loose && is(collection, ['Set', sets]))) {
    for (const d of valuesToDelete) {
      if (collection.has(d)) {
        collection.delete(d)
        itemsDeleted++
      }
    }
  } else if (is(collection, ['Set', sets])) {
    const oldSize = collection.size
    const values = Array.from(collection).filter(v => !valuesToDelete.some(d => looselyEquals(v, d)))
    collection.clear()
    for (const v of values) collection.add(v)
    return oldSize - collection.size
  } else {
    const keysToDelete = keysOf.any(collection, valuesToDelete, {...options, inObj: false, reflectObj: true})
    if (is(collection, ['Map', maps])) {
      for (const keyToDelete of keysToDelete) {
        if (collection.has(keyToDelete)) {
          collection.delete(keyToDelete)
          itemsDeleted++
        }
      }
    } else {
      for (const keyToDelete of keysToDelete) {
        if (canDeleteProp(collection, keyToDelete)) {
          delete collection[keyToDelete]
          itemsDeleted++
        }
      }
    }
  }
  return itemsDeleted
})
