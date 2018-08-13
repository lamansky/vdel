'use strict'

const assert = require('assert')
const del = require('.')
const equals = require('equals')
const isArrayWith = require('is-array-with')

describe('del()', function () {
  it('should remove a value from an Array', function () {
    const arr = [1, 2, 3]
    del(arr, 2)
    assert(isArrayWith(arr, 1, 3))
  })

  it('should remove a value from a Set', function () {
    const set = new Set([1, 2, 3])
    del(set, 2)
    assert(isArrayWith(Array.from(set), 1, 3))
  })

  it('should remove a value from a WeakSet', function () {
    const obj = {}
    const set = new WeakSet()
    set.add(obj)
    assert(set.has(obj))
    del(set, obj)
    assert(!set.has(obj))
  })

  it('should remove all Map entries with a given value', function () {
    const map = new Map([['a', 1], ['b', 1], ['c', 2]])
    assert.strictEqual(map.size, 3)
    assert.strictEqual(del(map, 1), 2)
    assert.strictEqual(map.size, 1)
    assert(equals(Array.from(map.entries()), [['c', 2]]))
  })

  it('should remove all Object entries with a given value', function () {
    const obj = {a: 1, b: 1, c: 2}
    assert.strictEqual(del(obj, 1), 2)
    assert(equals(Object.entries(obj), [['c', 2]]))
  })

  it('should not delete inherited Object properties', function () {
    class A {}
    A.prototype.key = 'value'
    const obj = new A()
    assert.strictEqual(del(obj, 'value'), 0)
  })

  it('should not delete non-configurable Object properties', function () {
    const obj = {}
    Object.defineProperty(obj, 'key1', {value: 1, enumerable: true, configurable: true})
    Object.defineProperty(obj, 'key2', {value: 2, enumerable: true, configurable: false})
    assert.strictEqual(del(obj, 1), 1)
    assert.strictEqual(typeof obj.key1, 'undefined')
    assert.strictEqual(del(obj, 2), 0)
    assert.strictEqual(obj.key2, 2)
  })

  it('should treat an array as a single value', function () {
    const arr = [1]
    assert.strictEqual(del([arr], arr), 1)
  })

  it('should remove an equivalent Object value if `loose` is true', function () {
    const obj1 = {a: {b: 1}}
    del(obj1, {b: 1})
    assert(isArrayWith(Object.keys(obj1), 'a'))

    const obj2 = {a: {b: 1}}
    del(obj2, {b: 2}, {loose: true})
    assert(isArrayWith(Object.keys(obj2), 'a'))

    const obj3 = {a: {b: 1}}
    del(obj3, {b: 1}, {loose: true})
    assert(isArrayWith(Object.keys(obj3)))
  })

  it('should remove an equivalent Set value if `loose` is true', function () {
    const set = new Set([1, 2, 3])
    assert.strictEqual(del(set, 2, {loose: true, looselyEquals: (a, b) => a !== b}), 2)
    assert(isArrayWith(Array.from(set), 2))
  })

  it('should transform existing Array values if `compareAs` is set', function () {
    const arr = [1, 3]
    del(arr, 2, {compareAs: x => x * 2})
    assert(isArrayWith(arr, 3))
  })

  it('should transform existing Set values if `compareAs` is set', function () {
    const set = new Set(['a', 'b'])
    del(set, 'A', {compareAs: x => x.toUpperCase()})
    assert(isArrayWith(Array.from(set), 'b'))
  })

  it('should transform existing Map values if `compareAs` is set', function () {
    const map = new Map([['a', 1], ['b', 1], ['c', 2]])
    assert.strictEqual(map.size, 3)
    assert.strictEqual(del(map, 2, {compareAs: x => x * 2}), 2)
    assert.strictEqual(map.size, 1)
    assert(equals(Array.from(map.entries()), [['c', 2]]))
  })

  it('should transform existing Object values if `compareAs` is set', function () {
    const obj = {a: 1, b: 1, c: 2}
    assert.strictEqual(del(obj, 1, {compareAs: x => x * 2}), 0)
    assert.strictEqual(del(obj, 2, {compareAs: x => x * 2}), 2)
    assert(equals(Object.entries(obj), [['c', 2]]))
  })

  it('should retrieve `compareBy` key from existing Array values', function () {
    const arr = ['example', 'test']
    del(arr, 'x', {compareBy: 1})
    assert(isArrayWith(arr, 'test'))
  })

  it('should retrieve `compareBy` key from existing Set values', function () {
    const set = new Set(['example', 'test'])
    del(set, 'x', {compareBy: 1})
    assert(isArrayWith(Array.from(set), 'test'))
  })

  it('should retrieve `compareBy` key from existing Map values', function () {
    const map = new Map([['a', [1, 2]], ['b', [1, 2]], ['c', [2, 1]]])
    assert.strictEqual(map.size, 3)
    assert.strictEqual(del(map, 1), 0)
    assert.strictEqual(del(map, 1, {compareBy: 0}), 2)
    assert.strictEqual(map.size, 1)
    assert(equals(Array.from(map.entries()), [['c', [2, 1]]]))
  })

  it('should retrieve `compareBy` key from existing Object values', function () {
    const obj = {a: [1, 2], b: [1, 2], c: [2, 1]}
    assert.strictEqual(del(obj, 1), 0)
    assert.strictEqual(del(obj, 1, {compareBy: 0}), 2)
    assert(equals(Object.entries(obj), [['c', [2, 1]]]))
  })

  it('should return the number of items deleted', function () {
    assert.strictEqual(del([1], 1), 1)
  })

  it('should support the bind operator', function () {
    const arr = [1, 2, 3]
    del.call(arr, 2)
    assert(isArrayWith(arr, 1, 3))
  })

  describe('#all()', function () {
    it('should remove multiple values from an Array', function () {
      const arr = [1, 2, 3]
      assert.strictEqual(del.all(arr, [2, 3]), 2)
      assert(isArrayWith(arr, 1))
    })

    it('should remove all Map entries with the given values', function () {
      const map = new Map([['a', 1], ['b', 2], ['c', 3]])
      assert.strictEqual(map.size, 3)
      assert.strictEqual(del.all(map, [1, 2]), 2)
      assert.strictEqual(map.size, 1)
      assert(equals(Array.from(map.entries()), [['c', 3]]))
    })

    it('should return the number of items deleted', function () {
      assert.strictEqual(del.all([1, 2], [1, 2]), 2)
    })

    it('should support the bind operator', function () {
      const arr = [1, 2, 3]
      assert.strictEqual(del.all.call(arr, [2, 3]), 2)
      assert(isArrayWith(arr, 1))
    })
  })
})
