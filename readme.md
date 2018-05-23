# vdel

Deletes one or more values from an Array, Map, Object, Set, or other collection.

## Installation

Requires [Node.js](https://nodejs.org/) 8.3.0 or above.

```bash
npm i vdel
```

## API

The module exports a `del()` function that has one other function attached to it as a method: `del.all()`.

### `del()`

#### Parameters

1. Bindable: `collection` (Array, Map, Object, Set, or WeakSet): The collection from which to possibly remove a value.
2. `valueToDelete` (any): The value to be removed (if found).
3. Optional: Object argument:
    * `arrays` / `maps` / `sets` / `weakSets` (arrays of classes/strings): Arrays of classes and/or string names of classes that should be treated as equivalent to `Array`/`Map`/`Set`/`WeakSet` (respectively).
    * `loose` (boolean): Whether or not to identify values loosely (as defined by `looselyEquals`). Defaults to `false`.
    * `looselyEquals` (function): A callback that accepts two values and returns `true` if they are to be considered equivalent or `false` otherwise. This argument is only used if `loose` is `true`. If omitted, the default behavior will, among other things, consider arrays/objects to be equal if they have the same entries.

#### Return Value

The number of items deleted.

#### Example

```javascript
const del = require('vdel')

const arr = [0, 1, 0, 1]
del(arr, 0) // 2
arr // [1, 1]

const obj = {str: 'test', arr: []}
del(obj, [], {loose: true}) // 1
obj // {str: 'test'}
```

### `del.all()`

Use this function if you want to remove multiple values from a collection all at once. The signature is the same as the main function except that the second parameter is called `valuesToDelete` and takes an iterable (such as an array). The return value is the total number of items deleted.

#### Example

```javascript
const del = require('vdel')

const set = new Set([1, 2, 3])
del.all(set, [1, 2]) // 2
Array.from(set) // [3]
```

## Related

The “k” family of modules works on keyed/indexed collections.

* [khas](https://github.com/lamansky/khas)
* [kget](https://github.com/lamansky/kget)
* [kedit](https://github.com/lamansky/kedit)
* [kset](https://github.com/lamansky/kset)
* [kinc](https://github.com/lamansky/kinc)
* [kdel](https://github.com/lamansky/kdel)

The “v” family of modules works on any collection of values.

* [vhas](https://github.com/lamansky/vhas)
* [vget](https://github.com/lamansky/vget)
* [vsize](https://github.com/lamansky/vsize)
* [vadd](https://github.com/lamansky/vadd)
