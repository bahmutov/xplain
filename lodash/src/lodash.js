...

/**
 * Creates an array with all falsey values of `array` removed. The values
 * `false`, `null`, `0`, `""`, `undefined` and `NaN` are all falsey.
 *
 * @method compact
 */
function compact(array) {
    for (var index = -1, length = array ? array.length : 0, result = []; length > ++index; ) {
        var value = array[index];
        value && result.push(value);
    }
    return result;
}

/**
 * Creates an array of `array` elements not present in the other arrays
 * using strict equality for comparisons, i.e. `===`.
 *
 * @method difference
 */
function difference(array) {
    for (var index = -1, length = array ? array.length : 0, flattened = concat.apply(arrayRef, nativeSlice.call(arguments, 1)), contains = cachedContains(flattened), result = []; length > ++index; ) {
        var value = array[index];
        contains(value) || result.push(value);
    }
    return result;
}

/**
 * This method is similar to `_.find`, except that it returns the index of
 * the element that passes the callback check, instead of the element itself.
 *
 * @method findIndex
 */
function findIndex(array, callback, thisArg) {
    var index = -1, length = array ? array.length : 0;
    for (callback = lodash.createCallback(callback, thisArg); length > ++index; ) if (callback(array[index], index, array)) return index;
    return -1;
}
/**
 * Examines each element in a `collection`, returning the first that the `callback`
 * returns truthy for. The `callback` is bound to `thisArg` and invoked with three
 * arguments; (value, index|key, collection).
 *
 * If a property name is passed for `callback`, the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is passed for `callback`, the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @method first
 * @static
 * @memberOf _
 * @alias detect
 * @category Collections
 * @param {Array|Object|String} collection The collection to iterate over.
 * @param {Function|Object|String} [callback=identity] The function called per
 *  iteration. If a property name or object is passed, it will be used to create
 *  a "_.pluck" or "_.where" style callback, respectively.
 * @param {Mixed} [thisArg] The `this` binding of `callback`.
 * @returns {Mixed} Returns the found element, else `undefined`.
 */
function first(array, callback, thisArg) {
    if (array) {
        var n = 0, length = array.length;
        if ("number" != typeof callback && null != callback) {
            var index = -1;
            for (callback = lodash.createCallback(callback, thisArg); length > ++index && callback(array[index], index, array); ) n++;
        } else if (n = callback, null == n || thisArg) return array[0];
        return slice(array, 0, nativeMin(nativeMax(0, n), length));
    }
}

...