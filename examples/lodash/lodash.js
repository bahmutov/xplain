(function (window) {
    function runInContext(context) {
        function lodash(value) {
            return value && "object" == typeof value && !isArray(value) && hasOwnProperty.call(value, "__wrapped__") ? value : new lodashWrapper(value);
        }
        function cachedContains(array) {
            var length = array.length, isLarge = length >= largeArraySize;
            if (isLarge) for (var cache = {}, index = -1; length > ++index; ) {
                var key = keyPrefix + array[index];
                (cache[key] || (cache[key] = [])).push(array[index]);
            }
            return function(value) {
                if (isLarge) {
                    var key = keyPrefix + value;
                    return cache[key] && indexOf(cache[key], value) > -1;
                }
                return indexOf(array, value) > -1;
            };
        }
        function charAtCallback(value) {
            return value.charCodeAt(0);
        }
        function compareAscending(a, b) {
            var ai = a.index, bi = b.index;
            if (a = a.criteria, b = b.criteria, a !== b) {
                if (a > b || a === undefined) return 1;
                if (b > a || b === undefined) return -1;
            }
            return bi > ai ? -1 : 1;
        }
        function createBound(func, thisArg, partialArgs, indicator) {
            function bound() {
                var args = arguments, thisBinding = isPartial ? this : thisArg;
                if (isFunc || (func = thisArg[key]), partialArgs.length && (args = args.length ? (args = nativeSlice.call(args),
                rightIndicator ? args.concat(partialArgs) : partialArgs.concat(args)) : partialArgs),
                this instanceof bound) {
                    noop.prototype = func.prototype, thisBinding = new noop(), noop.prototype = null;
                    var result = func.apply(thisBinding, args);
                    return isObject(result) ? result : thisBinding;
                }
                return func.apply(thisBinding, args);
            }
            var isFunc = isFunction(func), isPartial = !partialArgs, key = thisArg;
            if (isPartial) {
                var rightIndicator = indicator;
                partialArgs = thisArg;
            } else if (!isFunc) {
                if (!indicator) throw new TypeError();
                thisArg = func;
            }
            return bound;
        }
        function escapeStringChar(match) {
            return "\\" + stringEscapes[match];
        }
        function escapeHtmlChar(match) {
            return htmlEscapes[match];
        }
        function lodashWrapper(value) {
            this.__wrapped__ = value;
        }
        function noop() {}
        function shimIsPlainObject(value) {
            var result = !1;
            if (!value || toString.call(value) != objectClass) return result;
            var ctor = value.constructor;
            return (isFunction(ctor) ? ctor instanceof ctor : !0) ? (forIn(value, function(value, key) {
                result = key;
            }), result === !1 || hasOwnProperty.call(value, result)) : result;
        }
        function slice(array, start, end) {
            start || (start = 0), end === undefined && (end = array ? array.length : 0);
            for (var index = -1, length = end - start || 0, result = Array(0 > length ? 0 : length); length > ++index; ) result[index] = array[start + index];
            return result;
        }
        function unescapeHtmlChar(match) {
            return htmlUnescapes[match];
        }
        function isArguments(value) {
            return toString.call(value) == argsClass;
        }
        function clone(value, deep, callback, thisArg, stackA, stackB) {
            var result = value;
            if ("function" == typeof deep && (thisArg = callback, callback = deep, deep = !1),
            "function" == typeof callback) {
                if (callback = thisArg === undefined ? callback : lodash.createCallback(callback, thisArg, 1),
                result = callback(result), result !== undefined) return result;
                result = value;
            }
            var isObj = isObject(result);
            if (isObj) {
                var className = toString.call(result);
                if (!cloneableClasses[className]) return result;
                var isArr = isArray(result);
            }
            if (!isObj || !deep) return isObj ? isArr ? slice(result) : assign({}, result) : result;
            var ctor = ctorByClass[className];
            switch (className) {
              case boolClass:
              case dateClass:
                return new ctor(+result);

              case numberClass:
              case stringClass:
                return new ctor(result);

              case regexpClass:
                return ctor(result.source, reFlags.exec(result));
            }
            stackA || (stackA = []), stackB || (stackB = []);
            for (var length = stackA.length; length--; ) if (stackA[length] == value) return stackB[length];
            return result = isArr ? ctor(result.length) : {}, isArr && (hasOwnProperty.call(value, "index") && (result.index = value.index),
            hasOwnProperty.call(value, "input") && (result.input = value.input)), stackA.push(value),
            stackB.push(result), (isArr ? forEach : forOwn)(value, function(objValue, key) {
                result[key] = clone(objValue, deep, callback, undefined, stackA, stackB);
            }), result;
        }
        function cloneDeep(value, callback, thisArg) {
            return clone(value, !0, callback, thisArg);
        }
        function findKey(object, callback, thisArg) {
            var result;
            return callback = lodash.createCallback(callback, thisArg), forOwn(object, function(value, key, object) {
                return callback(value, key, object) ? (result = key, !1) : undefined;
            }), result;
        }
        function functions(object) {
            var result = [];
            return forIn(object, function(value, key) {
                isFunction(value) && result.push(key);
            }), result.sort();
        }
        function has(object, property) {
            return object ? hasOwnProperty.call(object, property) : !1;
        }
        function invert(object) {
            for (var index = -1, props = keys(object), length = props.length, result = {}; length > ++index; ) {
                var key = props[index];
                result[object[key]] = key;
            }
            return result;
        }
        function isBoolean(value) {
            return value === !0 || value === !1 || toString.call(value) == boolClass;
        }
        function isDate(value) {
            return value ? "object" == typeof value && toString.call(value) == dateClass : !1;
        }
        function isElement(value) {
            return value ? 1 === value.nodeType : !1;
        }
        function isEmpty(value) {
            var result = !0;
            if (!value) return result;
            var className = toString.call(value), length = value.length;
            return className == arrayClass || className == stringClass || className == argsClass || className == objectClass && "number" == typeof length && isFunction(value.splice) ? !length : (forOwn(value, function() {
                return result = !1;
            }), result);
        }
        function isEqual(a, b, callback, thisArg, stackA, stackB) {
            var whereIndicator = callback === indicatorObject;
            if ("function" == typeof callback && !whereIndicator) {
                callback = lodash.createCallback(callback, thisArg, 2);
                var result = callback(a, b);
                if (result !== undefined) return !!result;
            }
            if (a === b) return 0 !== a || 1 / a == 1 / b;
            var type = typeof a, otherType = typeof b;
            if (a === a && (!a || "function" != type && "object" != type) && (!b || "function" != otherType && "object" != otherType)) return !1;
            if (null == a || null == b) return a === b;
            var className = toString.call(a), otherClass = toString.call(b);
            if (className == argsClass && (className = objectClass), otherClass == argsClass && (otherClass = objectClass),
            className != otherClass) return !1;
            switch (className) {
              case boolClass:
              case dateClass:
                return +a == +b;

              case numberClass:
                return a != +a ? b != +b : 0 == a ? 1 / a == 1 / b : a == +b;

              case regexpClass:
              case stringClass:
                return a == String(b);
            }
            var isArr = className == arrayClass;
            if (!isArr) {
                if (hasOwnProperty.call(a, "__wrapped__ ") || hasOwnProperty.call(b, "__wrapped__")) return isEqual(a.__wrapped__ || a, b.__wrapped__ || b, callback, thisArg, stackA, stackB);
                if (className != objectClass) return !1;
                var ctorA = a.constructor, ctorB = b.constructor;
                if (ctorA != ctorB && !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB)) return !1;
            }
            stackA || (stackA = []), stackB || (stackB = []);
            for (var length = stackA.length; length--; ) if (stackA[length] == a) return stackB[length] == b;
            var size = 0;
            if (result = !0, stackA.push(a), stackB.push(b), isArr) {
                if (length = a.length, size = b.length, result = size == a.length, !result && !whereIndicator) return result;
                for (;size--; ) {
                    var index = length, value = b[size];
                    if (whereIndicator) for (;index-- && !(result = isEqual(a[index], value, callback, thisArg, stackA, stackB)); ) ; else if (!(result = isEqual(a[size], value, callback, thisArg, stackA, stackB))) break;
                }
                return result;
            }
            return forIn(b, function(value, key, b) {
                return hasOwnProperty.call(b, key) ? (size++, result = hasOwnProperty.call(a, key) && isEqual(a[key], value, callback, thisArg, stackA, stackB)) : undefined;
            }), result && !whereIndicator && forIn(a, function(value, key, a) {
                return hasOwnProperty.call(a, key) ? result = --size > -1 : undefined;
            }), result;
        }
        function isFinite(value) {
            return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
        }
        function isFunction(value) {
            return "function" == typeof value;
        }
        function isObject(value) {
            return value ? objectTypes[typeof value] : !1;
        }
        function isNaN(value) {
            return isNumber(value) && value != +value;
        }
        function isNull(value) {
            return null === value;
        }
        function isNumber(value) {
            return "number" == typeof value || toString.call(value) == numberClass;
        }
        function isRegExp(value) {
            return value ? "object" == typeof value && toString.call(value) == regexpClass : !1;
        }
        function isString(value) {
            return "string" == typeof value || toString.call(value) == stringClass;
        }
        function isUndefined(value) {
            return value === undefined;
        }
        function merge(object, source, deepIndicator) {
            var args = arguments, index = 0, length = 2;
            if (!isObject(object)) return object;
            if (deepIndicator === indicatorObject) var callback = args[3], stackA = args[4], stackB = args[5]; else stackA = [],
            stackB = [], "number" != typeof deepIndicator && (length = args.length), length > 3 && "function" == typeof args[length - 2] ? callback = lodash.createCallback(args[--length - 1], args[length--], 2) : length > 2 && "function" == typeof args[length - 1] && (callback = args[--length]);
            for (;length > ++index; ) (isArray(args[index]) ? forEach : forOwn)(args[index], function(source, key) {
                var found, isArr, result = source, value = object[key];
                if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
                    for (var stackLength = stackA.length; stackLength--; ) if (found = stackA[stackLength] == source) {
                        value = stackB[stackLength];
                        break;
                    }
                    if (!found) {
                        var isShallow;
                        callback && (result = callback(value, source), (isShallow = result !== undefined) && (value = result)),
                        isShallow || (value = isArr ? isArray(value) ? value : [] : isPlainObject(value) ? value : {}),
                        stackA.push(source), stackB.push(value), isShallow || (value = merge(value, source, indicatorObject, callback, stackA, stackB));
                    }
                } else callback && (result = callback(value, source), result === undefined && (result = source)),
                result !== undefined && (value = result);
                object[key] = value;
            });
            return object;
        }
        function omit(object, callback, thisArg) {
            var isFunc = "function" == typeof callback, result = {};
            if (isFunc) callback = lodash.createCallback(callback, thisArg); else var props = concat.apply(arrayRef, nativeSlice.call(arguments, 1));
            return forIn(object, function(value, key, object) {
                (isFunc ? !callback(value, key, object) : 0 > indexOf(props, key)) && (result[key] = value);
            }), result;
        }
        function pairs(object) {
            for (var index = -1, props = keys(object), length = props.length, result = Array(length); length > ++index; ) {
                var key = props[index];
                result[index] = [ key, object[key] ];
            }
            return result;
        }
        function pick(object, callback, thisArg) {
            var result = {};
            if ("function" != typeof callback) for (var index = -1, props = concat.apply(arrayRef, nativeSlice.call(arguments, 1)), length = isObject(object) ? props.length : 0; length > ++index; ) {
                var key = props[index];
                key in object && (result[key] = object[key]);
            } else callback = lodash.createCallback(callback, thisArg), forIn(object, function(value, key, object) {
                callback(value, key, object) && (result[key] = value);
            });
            return result;
        }
        function values(object) {
            for (var index = -1, props = keys(object), length = props.length, result = Array(length); length > ++index; ) result[index] = object[props[index]];
            return result;
        }
        function at(collection) {
            for (var index = -1, props = concat.apply(arrayRef, nativeSlice.call(arguments, 1)), length = props.length, result = Array(length); length > ++index; ) result[index] = collection[props[index]];
            return result;
        }
        function contains(collection, target, fromIndex) {
            var index = -1, length = collection ? collection.length : 0, result = !1;
            return fromIndex = (0 > fromIndex ? nativeMax(0, length + fromIndex) : fromIndex) || 0,
            "number" == typeof length ? result = (isString(collection) ? collection.indexOf(target, fromIndex) : indexOf(collection, target, fromIndex)) > -1 : forOwn(collection, function(value) {
                return ++index >= fromIndex ? !(result = value === target) : undefined;
            }), result;
        }
        function countBy(collection, callback, thisArg) {
            var result = {};
            return callback = lodash.createCallback(callback, thisArg), forEach(collection, function(value, key, collection) {
                key = String(callback(value, key, collection)), hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1;
            }), result;
        }
        function every(collection, callback, thisArg) {
            var result = !0;
            callback = lodash.createCallback(callback, thisArg);
            var index = -1, length = collection ? collection.length : 0;
            if ("number" == typeof length) for (;length > ++index && (result = !!callback(collection[index], index, collection)); ) ; else forOwn(collection, function(value, index, collection) {
                return result = !!callback(value, index, collection);
            });
            return result;
        }
        function filter(collection, callback, thisArg) {
            var result = [];
            callback = lodash.createCallback(callback, thisArg);
            var index = -1, length = collection ? collection.length : 0;
            if ("number" == typeof length) for (;length > ++index; ) {
                var value = collection[index];
                callback(value, index, collection) && result.push(value);
            } else forOwn(collection, function(value, index, collection) {
                callback(value, index, collection) && result.push(value);
            });
            return result;
        }
        function find(collection, callback, thisArg) {
            callback = lodash.createCallback(callback, thisArg);
            var index = -1, length = collection ? collection.length : 0;
            if ("number" != typeof length) {
                var result;
                return forOwn(collection, function(value, index, collection) {
                    return callback(value, index, collection) ? (result = value, !1) : undefined;
                }), result;
            }
            for (;length > ++index; ) {
                var value = collection[index];
                if (callback(value, index, collection)) return value;
            }
        }
        function forEach(collection, callback, thisArg) {
            var index = -1, length = collection ? collection.length : 0;
            if (callback = callback && thisArg === undefined ? callback : lodash.createCallback(callback, thisArg),
            "number" == typeof length) for (;length > ++index && callback(collection[index], index, collection) !== !1; ) ; else forOwn(collection, callback);
            return collection;
        }
        function groupBy(collection, callback, thisArg) {
            var result = {};
            return callback = lodash.createCallback(callback, thisArg), forEach(collection, function(value, key, collection) {
                key = String(callback(value, key, collection)), (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
            }), result;
        }
        function invoke(collection, methodName) {
            var args = nativeSlice.call(arguments, 2), index = -1, isFunc = "function" == typeof methodName, length = collection ? collection.length : 0, result = Array("number" == typeof length ? length : 0);
            return forEach(collection, function(value) {
                result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
            }), result;
        }
        function map(collection, callback, thisArg) {
            var index = -1, length = collection ? collection.length : 0;
            if (callback = lodash.createCallback(callback, thisArg), "number" == typeof length) for (var result = Array(length); length > ++index; ) result[index] = callback(collection[index], index, collection); else result = [],
            forOwn(collection, function(value, key, collection) {
                result[++index] = callback(value, key, collection);
            });
            return result;
        }
        function max(collection, callback, thisArg) {
            var computed = -1 / 0, result = computed;
            if (!callback && isArray(collection)) for (var index = -1, length = collection.length; length > ++index; ) {
                var value = collection[index];
                value > result && (result = value);
            } else callback = !callback && isString(collection) ? charAtCallback : lodash.createCallback(callback, thisArg),
            forEach(collection, function(value, index, collection) {
                var current = callback(value, index, collection);
                current > computed && (computed = current, result = value);
            });
            return result;
        }
        function min(collection, callback, thisArg) {
            var computed = 1 / 0, result = computed;
            if (!callback && isArray(collection)) for (var index = -1, length = collection.length; length > ++index; ) {
                var value = collection[index];
                result > value && (result = value);
            } else callback = !callback && isString(collection) ? charAtCallback : lodash.createCallback(callback, thisArg),
            forEach(collection, function(value, index, collection) {
                var current = callback(value, index, collection);
                computed > current && (computed = current, result = value);
            });
            return result;
        }
        function pluck(collection, property) {
            var index = -1, length = collection ? collection.length : 0;
            if ("number" == typeof length) for (var result = Array(length); length > ++index; ) result[index] = collection[index][property];
            return result || map(collection, property);
        }
        function reduce(collection, callback, accumulator, thisArg) {
            if (!collection) return accumulator;
            var noaccum = 3 > arguments.length;
            callback = lodash.createCallback(callback, thisArg, 4);
            var index = -1, length = collection.length;
            if ("number" == typeof length) for (noaccum && (accumulator = collection[++index]); length > ++index; ) accumulator = callback(accumulator, collection[index], index, collection); else forOwn(collection, function(value, index, collection) {
                accumulator = noaccum ? (noaccum = !1, value) : callback(accumulator, value, index, collection);
            });
            return accumulator;
        }
        function reduceRight(collection, callback, accumulator, thisArg) {
            var iterable = collection, length = collection ? collection.length : 0, noaccum = 3 > arguments.length;
            if ("number" != typeof length) {
                var props = keys(collection);
                length = props.length;
            }
            return callback = lodash.createCallback(callback, thisArg, 4), forEach(collection, function(value, index, collection) {
                index = props ? props[--length] : --length, accumulator = noaccum ? (noaccum = !1,
                iterable[index]) : callback(accumulator, iterable[index], index, collection);
            }), accumulator;
        }
        function reject(collection, callback, thisArg) {
            return callback = lodash.createCallback(callback, thisArg), filter(collection, function(value, index, collection) {
                return !callback(value, index, collection);
            });
        }
        function shuffle(collection) {
            var index = -1, length = collection ? collection.length : 0, result = Array("number" == typeof length ? length : 0);
            return forEach(collection, function(value) {
                var rand = floor(nativeRandom() * (++index + 1));
                result[index] = result[rand], result[rand] = value;
            }), result;
        }
        function size(collection) {
            var length = collection ? collection.length : 0;
            return "number" == typeof length ? length : keys(collection).length;
        }
        function some(collection, callback, thisArg) {
            var result;
            callback = lodash.createCallback(callback, thisArg);
            var index = -1, length = collection ? collection.length : 0;
            if ("number" == typeof length) for (;length > ++index && !(result = callback(collection[index], index, collection)); ) ; else forOwn(collection, function(value, index, collection) {
                return !(result = callback(value, index, collection));
            });
            return !!result;
        }
        function sortBy(collection, callback, thisArg) {
            var index = -1, length = collection ? collection.length : 0, result = Array("number" == typeof length ? length : 0);
            for (callback = lodash.createCallback(callback, thisArg), forEach(collection, function(value, key, collection) {
                result[++index] = {
                    criteria: callback(value, key, collection),
                    index: index,
                    value: value
                };
            }), length = result.length, result.sort(compareAscending); length--; ) result[length] = result[length].value;
            return result;
        }
        function toArray(collection) {
            return collection && "number" == typeof collection.length ? slice(collection) : values(collection);
        }

        /**
         * Creates an array with all falsey values of `array` removed. The values
         * `false`, `null`, `0`, `""`, `undefined` and `NaN` are all falsey.
         *
         * @method compact
         * @memberOf _
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
         * @memberOf _
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
         * @memberOf _
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

        /** */
        function flatten(array, isShallow, callback, thisArg) {
            var index = -1, length = array ? array.length : 0, result = [];
            for ("boolean" != typeof isShallow && null != isShallow && (thisArg = callback,
            callback = isShallow, isShallow = !1), null != callback && (callback = lodash.createCallback(callback, thisArg)); length > ++index; ) {
                var value = array[index];
                callback && (value = callback(value, index, array)), isArray(value) ? push.apply(result, isShallow ? value : flatten(value)) : result.push(value);
            }
            return result;
        }
        function indexOf(array, value, fromIndex) {
            var index = -1, length = array ? array.length : 0;
            if ("number" == typeof fromIndex) index = (0 > fromIndex ? nativeMax(0, length + fromIndex) : fromIndex || 0) - 1; else if (fromIndex) return index = sortedIndex(array, value),
            array[index] === value ? index : -1;
            for (;length > ++index; ) if (array[index] === value) return index;
            return -1;
        }
        function initial(array, callback, thisArg) {
            if (!array) return [];
            var n = 0, length = array.length;
            if ("number" != typeof callback && null != callback) {
                var index = length;
                for (callback = lodash.createCallback(callback, thisArg); index-- && callback(array[index], index, array); ) n++;
            } else n = null == callback || thisArg ? 1 : callback || n;
            return slice(array, 0, nativeMin(nativeMax(0, length - n), length));
        }
        function intersection(array) {
            var args = arguments, argsLength = args.length, cache = {
                0: {}
            }, index = -1, length = array ? array.length : 0, isLarge = length >= largeArraySize, result = [], seen = result;
            outer: for (;length > ++index; ) {
                var value = array[index];
                if (isLarge) var key = keyPrefix + value, inited = cache[0][key] ? !(seen = cache[0][key]) : seen = cache[0][key] = [];
                if (inited || 0 > indexOf(seen, value)) {
                    isLarge && seen.push(value);
                    for (var argsIndex = argsLength; --argsIndex; ) if (!(cache[argsIndex] || (cache[argsIndex] = cachedContains(args[argsIndex])))(value)) continue outer;
                    result.push(value);
                }
            }
            return result;
        }
        function last(array, callback, thisArg) {
            if (array) {
                var n = 0, length = array.length;
                if ("number" != typeof callback && null != callback) {
                    var index = length;
                    for (callback = lodash.createCallback(callback, thisArg); index-- && callback(array[index], index, array); ) n++;
                } else if (n = callback, null == n || thisArg) return array[length - 1];
                return slice(array, nativeMax(0, length - n));
            }
        }
        function lastIndexOf(array, value, fromIndex) {
            var index = array ? array.length : 0;
            for ("number" == typeof fromIndex && (index = (0 > fromIndex ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1); index--; ) if (array[index] === value) return index;
            return -1;
        }
        function range(start, end, step) {
            start = +start || 0, step = +step || 1, null == end && (end = start, start = 0);
            for (var index = -1, length = nativeMax(0, ceil((end - start) / step)), result = Array(length); length > ++index; ) result[index] = start,
            start += step;
            return result;
        }
        function rest(array, callback, thisArg) {
            if ("number" != typeof callback && null != callback) {
                var n = 0, index = -1, length = array ? array.length : 0;
                for (callback = lodash.createCallback(callback, thisArg); length > ++index && callback(array[index], index, array); ) n++;
            } else n = null == callback || thisArg ? 1 : nativeMax(0, callback);
            return slice(array, n);
        }
        function sortedIndex(array, value, callback, thisArg) {
            var low = 0, high = array ? array.length : low;
            for (callback = callback ? lodash.createCallback(callback, thisArg, 1) : identity,
            value = callback(value); high > low; ) {
                var mid = low + high >>> 1;
                value > callback(array[mid]) ? low = mid + 1 : high = mid;
            }
            return low;
        }
        function union(array) {
            return isArray(array) || (arguments[0] = array ? nativeSlice.call(array) : arrayRef),
            uniq(concat.apply(arrayRef, arguments));
        }
        function uniq(array, isSorted, callback, thisArg) {
            var index = -1, length = array ? array.length : 0, result = [], seen = result;
            "boolean" != typeof isSorted && null != isSorted && (thisArg = callback, callback = isSorted,
            isSorted = !1);
            var isLarge = !isSorted && length >= largeArraySize;
            if (isLarge) var cache = {};
            for (null != callback && (seen = [], callback = lodash.createCallback(callback, thisArg)); length > ++index; ) {
                var value = array[index], computed = callback ? callback(value, index, array) : value;
                if (isLarge) var key = keyPrefix + computed, inited = cache[key] ? !(seen = cache[key]) : seen = cache[key] = [];
                (isSorted ? !index || seen[seen.length - 1] !== computed : inited || 0 > indexOf(seen, computed)) && ((callback || isLarge) && seen.push(computed),
                result.push(value));
            }
            return result;
        }
        function unzip(array) {
            for (var index = -1, length = array ? array.length : 0, tupleLength = length ? max(pluck(array, "length")) : 0, result = Array(tupleLength); length > ++index; ) for (var tupleIndex = -1, tuple = array[index]; tupleLength > ++tupleIndex; ) (result[tupleIndex] || (result[tupleIndex] = Array(length)))[index] = tuple[tupleIndex];
            return result;
        }
        function without(array) {
            return difference(array, nativeSlice.call(arguments, 1));
        }
        function zip(array) {
            for (var index = -1, length = array ? max(pluck(arguments, "length")) : 0, result = Array(length); length > ++index; ) result[index] = pluck(arguments, index);
            return result;
        }
        function zipObject(keys, values) {
            for (var index = -1, length = keys ? keys.length : 0, result = {}; length > ++index; ) {
                var key = keys[index];
                values ? result[key] = values[index] : result[key[0]] = key[1];
            }
            return result;
        }
        function after(n, func) {
            return 1 > n ? func() : function() {
                return 1 > --n ? func.apply(this, arguments) : undefined;
            };
        }
        function bind(func, thisArg) {
            return support.fastBind || nativeBind && arguments.length > 2 ? nativeBind.call.apply(nativeBind, arguments) : createBound(func, thisArg, nativeSlice.call(arguments, 2));
        }
        function bindAll(object) {
            for (var funcs = arguments.length > 1 ? concat.apply(arrayRef, nativeSlice.call(arguments, 1)) : functions(object), index = -1, length = funcs.length; length > ++index; ) {
                var key = funcs[index];
                object[key] = bind(object[key], object);
            }
            return object;
        }
        function bindKey(object, key) {
            return createBound(object, key, nativeSlice.call(arguments, 2), indicatorObject);
        }
        function compose() {
            var funcs = arguments;
            return function() {
                for (var args = arguments, length = funcs.length; length--; ) args = [ funcs[length].apply(this, args) ];
                return args[0];
            };
        }
        function createCallback(func, thisArg, argCount) {
            if (null == func) return identity;
            var type = typeof func;
            if ("function" != type) {
                if ("object" != type) return function(object) {
                    return object[func];
                };
                var props = keys(func);
                return function(object) {
                    for (var length = props.length, result = !1; length-- && (result = isEqual(object[props[length]], func[props[length]], indicatorObject)); ) ;
                    return result;
                };
            }
            return thisArg !== undefined ? 1 === argCount ? function(value) {
                return func.call(thisArg, value);
            } : 2 === argCount ? function(a, b) {
                return func.call(thisArg, a, b);
            } : 4 === argCount ? function(accumulator, value, index, collection) {
                return func.call(thisArg, accumulator, value, index, collection);
            } : function(value, index, collection) {
                return func.call(thisArg, value, index, collection);
            } : func;
        }
        function debounce(func, wait, options) {
            function delayed() {
                inited = timeoutId = null, trailing && (result = func.apply(thisArg, args));
            }
            var args, inited, result, thisArg, timeoutId, trailing = !0;
            if (options === !0) {
                var leading = !0;
                trailing = !1;
            } else options && objectTypes[typeof options] && (leading = options.leading, trailing = "trailing" in options ? options.trailing : trailing);
            return function() {
                return args = arguments, thisArg = this, clearTimeout(timeoutId), !inited && leading ? (inited = !0,
                result = func.apply(thisArg, args)) : timeoutId = setTimeout(delayed, wait), result;
            };
        }
        function defer(func) {
            var args = nativeSlice.call(arguments, 1);
            return setTimeout(function() {
                func.apply(undefined, args);
            }, 1);
        }
        function delay(func, wait) {
            var args = nativeSlice.call(arguments, 2);
            return setTimeout(function() {
                func.apply(undefined, args);
            }, wait);
        }
        function memoize(func, resolver) {
            var cache = {};
            return function() {
                var key = keyPrefix + (resolver ? resolver.apply(this, arguments) : arguments[0]);
                return hasOwnProperty.call(cache, key) ? cache[key] : cache[key] = func.apply(this, arguments);
            };
        }
        function once(func) {
            var ran, result;
            return function() {
                return ran ? result : (ran = !0, result = func.apply(this, arguments), func = null,
                result);
            };
        }
        function partial(func) {
            return createBound(func, nativeSlice.call(arguments, 1));
        }
        function partialRight(func) {
            return createBound(func, nativeSlice.call(arguments, 1), null, indicatorObject);
        }
        function throttle(func, wait, options) {
            function trailingCall() {
                timeoutId = null, trailing && (lastCalled = new Date(), result = func.apply(thisArg, args));
            }
            var args, result, thisArg, timeoutId, lastCalled = 0, leading = !0, trailing = !0;
            return options === !1 ? leading = !1 : options && objectTypes[typeof options] && (leading = "leading" in options ? options.leading : leading,
            trailing = "trailing" in options ? options.trailing : trailing), function() {
                var now = new Date();
                timeoutId || leading || (lastCalled = now);
                var remaining = wait - (now - lastCalled);
                return args = arguments, thisArg = this, 0 >= remaining ? (clearTimeout(timeoutId),
                timeoutId = null, lastCalled = now, result = func.apply(thisArg, args)) : timeoutId || (timeoutId = setTimeout(trailingCall, remaining)),
                result;
            };
        }
        function wrap(value, wrapper) {
            return function() {
                var args = [ value ];
                return push.apply(args, arguments), wrapper.apply(this, args);
            };
        }
        function escape(string) {
            return null == string ? "" : String(string).replace(reUnescapedHtml, escapeHtmlChar);
        }
        function identity(value) {
            return value;
        }
        function mixin(object) {
            forEach(functions(object), function(methodName) {
                var func = lodash[methodName] = object[methodName];
                lodash.prototype[methodName] = function() {
                    var value = this.__wrapped__, args = [ value ];
                    push.apply(args, arguments);
                    var result = func.apply(lodash, args);
                    return value && "object" == typeof value && value == result ? this : new lodashWrapper(result);
                };
            });
        }
        function noConflict() {
            return context._ = oldDash, this;
        }
        function random(min, max) {
            return null == min && null == max && (max = 1), min = +min || 0, null == max && (max = min,
            min = 0), min + floor(nativeRandom() * ((+max || 0) - min + 1));
        }
        function result(object, property) {
            var value = object ? object[property] : undefined;
            return isFunction(value) ? object[property]() : value;
        }
        function template(text, data, options) {
            var settings = lodash.templateSettings;
            text || (text = ""), options = defaults({}, options, settings);
            var isEvaluating, imports = defaults({}, options.imports, settings.imports), importsKeys = keys(imports), importsValues = values(imports), index = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '", reDelimiters = RegExp((options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g");
            text.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
                return interpolateValue || (interpolateValue = esTemplateValue), source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar),
                escapeValue && (source += "' +\n__e(" + escapeValue + ") +\n'"), evaluateValue && (isEvaluating = !0,
                source += "';\n" + evaluateValue + ";\n__p += '"), interpolateValue && (source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'"),
                index = offset + match.length, match;
            }), source += "';\n";
            var variable = options.variable, hasVariable = variable;
            hasVariable || (variable = "obj", source = "with (" + variable + ") {\n" + source + "\n}\n"),
            source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;"),
            source = "function(" + variable + ") {\n" + (hasVariable ? "" : variable + " || (" + variable + " = {});\n") + "var __t, __p = '', __e = _.escape" + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
            var sourceURL = "\n/*\n//@ sourceURL=" + (options.sourceURL || "/lodash/template/source[" + templateCounter++ + "]") + "\n*/";
            try {
                var result = Function(importsKeys, "return " + source + sourceURL).apply(undefined, importsValues);
            } catch (e) {
                throw e.source = source, e;
            }
            return data ? result(data) : (result.source = source, result);
        }
        function times(n, callback, thisArg) {
            n = (n = +n) > -1 ? n : 0;
            var index = -1, result = Array(n);
            for (callback = lodash.createCallback(callback, thisArg, 1); n > ++index; ) result[index] = callback(index);
            return result;
        }
        function unescape(string) {
            return null == string ? "" : String(string).replace(reEscapedHtml, unescapeHtmlChar);
        }
        function uniqueId(prefix) {
            var id = ++idCounter;
            return String(null == prefix ? "" : prefix) + id;
        }
        function tap(value, interceptor) {
            return interceptor(value), value;
        }
        function wrapperToString() {
            return String(this.__wrapped__);
        }
        function wrapperValueOf() {
            return this.__wrapped__;
        }
        context = context ? _.defaults(window.Object(), context, _.pick(window, contextProps)) : window;
        var Array = context.Array, Boolean = context.Boolean, Date = context.Date, Function = context.Function, Math = context.Math, Number = context.Number, Object = context.Object, RegExp = context.RegExp, String = context.String, TypeError = context.TypeError, arrayRef = Array(), objectRef = Object(), oldDash = context._, reNative = RegExp("^" + String(objectRef.valueOf).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/valueOf|for [^\]]+/g, ".+?") + "$"), ceil = Math.ceil, clearTimeout = context.clearTimeout, concat = arrayRef.concat, floor = Math.floor, getPrototypeOf = reNative.test(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf, hasOwnProperty = objectRef.hasOwnProperty, push = arrayRef.push, setImmediate = context.setImmediate, setTimeout = context.setTimeout, toString = objectRef.toString, nativeBind = reNative.test(nativeBind = toString.bind) && nativeBind, nativeIsArray = reNative.test(nativeIsArray = Array.isArray) && nativeIsArray, nativeIsFinite = context.isFinite, nativeIsNaN = context.isNaN, nativeKeys = reNative.test(nativeKeys = Object.keys) && nativeKeys, nativeMax = Math.max, nativeMin = Math.min, nativeParseInt = context.parseInt, nativeRandom = Math.random, nativeSlice = arrayRef.slice, isIeOpera = reNative.test(context.attachEvent), isV8 = nativeBind && !/\n|true/.test(nativeBind + isIeOpera), ctorByClass = {};
        ctorByClass[arrayClass] = Array, ctorByClass[boolClass] = Boolean, ctorByClass[dateClass] = Date,
        ctorByClass[objectClass] = Object, ctorByClass[numberClass] = Number, ctorByClass[regexpClass] = RegExp,
        ctorByClass[stringClass] = String;
        var support = lodash.support = {};
        support.fastBind = nativeBind && !isV8, lodash.templateSettings = {
            escape: /<%-([\s\S]+?)%>/g,
            evaluate: /<%([\s\S]+?)%>/g,
            interpolate: reInterpolate,
            variable: "",
            imports: {
                _: lodash
            }
        }, lodashWrapper.prototype = lodash.prototype;
        var isArray = nativeIsArray, shimKeys = function(object) {
            var index, iterable = object, result = [];
            if (!iterable) return result;
            if (!objectTypes[typeof object]) return result;
            for (index in iterable) hasOwnProperty.call(iterable, index) && result.push(index);
            return result;
        }, keys = nativeKeys ? function(object) {
            return isObject(object) ? nativeKeys(object) : [];
        } : shimKeys, htmlEscapes = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }, htmlUnescapes = invert(htmlEscapes), assign = function(object, source, guard) {
            var index, iterable = object, result = iterable;
            if (!iterable) return result;
            var args = arguments, argsIndex = 0, argsLength = "number" == typeof guard ? 2 : args.length;
            if (argsLength > 3 && "function" == typeof args[argsLength - 2]) var callback = lodash.createCallback(args[--argsLength - 1], args[argsLength--], 2); else argsLength > 2 && "function" == typeof args[argsLength - 1] && (callback = args[--argsLength]);
            for (;argsLength > ++argsIndex; ) if (iterable = args[argsIndex], iterable && objectTypes[typeof iterable]) {
                var length = iterable.length;
                if (index = -1, isArray(iterable)) for (;length > ++index; ) result[index] = callback ? callback(result[index], iterable[index]) : iterable[index]; else for (var ownIndex = -1, ownProps = objectTypes[typeof iterable] ? keys(iterable) : [], length = ownProps.length; length > ++ownIndex; ) index = ownProps[ownIndex],
                result[index] = callback ? callback(result[index], iterable[index]) : iterable[index];
            }
            return result;
        }, defaults = function(object, source, guard) {
            var index, iterable = object, result = iterable;
            if (!iterable) return result;
            for (var args = arguments, argsIndex = 0, argsLength = "number" == typeof guard ? 2 : args.length; argsLength > ++argsIndex; ) if (iterable = args[argsIndex],
            iterable && objectTypes[typeof iterable]) {
                var length = iterable.length;
                if (index = -1, isArray(iterable)) for (;length > ++index; ) result[index] === undefined && (result[index] = iterable[index]); else for (var ownIndex = -1, ownProps = objectTypes[typeof iterable] ? keys(iterable) : [], length = ownProps.length; length > ++ownIndex; ) index = ownProps[ownIndex],
                result[index] === undefined && (result[index] = iterable[index]);
            }
            return result;
        }, forIn = function(collection, callback, thisArg) {
            var index, iterable = collection, result = iterable;
            if (!iterable) return result;
            if (!objectTypes[typeof iterable]) return result;
            callback = callback && thisArg === undefined ? callback : lodash.createCallback(callback, thisArg);
            for (index in iterable) if (callback(iterable[index], index, collection) === !1) return result;
            return result;
        }, forOwn = function(collection, callback, thisArg) {
            var index, iterable = collection, result = iterable;
            if (!iterable) return result;
            if (!objectTypes[typeof iterable]) return result;
            callback = callback && thisArg === undefined ? callback : lodash.createCallback(callback, thisArg);
            for (var ownIndex = -1, ownProps = objectTypes[typeof iterable] ? keys(iterable) : [], length = ownProps.length; length > ++ownIndex; ) if (index = ownProps[ownIndex],
            callback(iterable[index], index, collection) === !1) return result;
            return result;
        }, isPlainObject = function(value) {
            if (!value || toString.call(value) != objectClass) return !1;
            var valueOf = value.valueOf, objProto = "function" == typeof valueOf && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);
            return objProto ? value == objProto || getPrototypeOf(value) == objProto : shimIsPlainObject(value);
        }, where = filter;
        isV8 && freeModule && "function" == typeof setImmediate && (defer = bind(setImmediate, context));
        var parseInt = 8 == nativeParseInt(whitespace + "08") ? nativeParseInt : function(value, radix) {
            return nativeParseInt(isString(value) ? value.replace(reLeadingSpacesAndZeros, "") : value, radix || 0);
        };
        return lodash.after = after, lodash.assign = assign, lodash.at = at, lodash.bind = bind,
        lodash.bindAll = bindAll, lodash.bindKey = bindKey, lodash.compact = compact, lodash.compose = compose,
        lodash.countBy = countBy, lodash.createCallback = createCallback, lodash.debounce = debounce,
        lodash.defaults = defaults, lodash.defer = defer, lodash.delay = delay, lodash.difference = difference,
        lodash.filter = filter, lodash.flatten = flatten, lodash.forEach = forEach, lodash.forIn = forIn,
        lodash.forOwn = forOwn, lodash.functions = functions, lodash.groupBy = groupBy,
        lodash.initial = initial, lodash.intersection = intersection, lodash.invert = invert,
        lodash.invoke = invoke, lodash.keys = keys, lodash.map = map, lodash.max = max,
        lodash.memoize = memoize, lodash.merge = merge, lodash.min = min, lodash.omit = omit,
        lodash.once = once, lodash.pairs = pairs, lodash.partial = partial, lodash.partialRight = partialRight,
        lodash.pick = pick, lodash.pluck = pluck, lodash.range = range, lodash.reject = reject,
        lodash.rest = rest, lodash.shuffle = shuffle, lodash.sortBy = sortBy, lodash.tap = tap,
        lodash.throttle = throttle, lodash.times = times, lodash.toArray = toArray, lodash.union = union,
        lodash.uniq = uniq, lodash.unzip = unzip, lodash.values = values, lodash.where = where,
        lodash.without = without, lodash.wrap = wrap, lodash.zip = zip, lodash.zipObject = zipObject,
        lodash.collect = map, lodash.drop = rest, lodash.each = forEach, lodash.extend = assign,
        lodash.methods = functions, lodash.object = zipObject, lodash.select = filter, lodash.tail = rest,
        lodash.unique = uniq, mixin(lodash), lodash.clone = clone, lodash.cloneDeep = cloneDeep,
        lodash.contains = contains, lodash.escape = escape, lodash.every = every, lodash.find = find,
        lodash.findIndex = findIndex, lodash.findKey = findKey, lodash.has = has, lodash.identity = identity,
        lodash.indexOf = indexOf, lodash.isArguments = isArguments, lodash.isArray = isArray,
        lodash.isBoolean = isBoolean, lodash.isDate = isDate, lodash.isElement = isElement,
        lodash.isEmpty = isEmpty, lodash.isEqual = isEqual, lodash.isFinite = isFinite,
        lodash.isFunction = isFunction, lodash.isNaN = isNaN, lodash.isNull = isNull, lodash.isNumber = isNumber,
        lodash.isObject = isObject, lodash.isPlainObject = isPlainObject, lodash.isRegExp = isRegExp,
        lodash.isString = isString, lodash.isUndefined = isUndefined, lodash.lastIndexOf = lastIndexOf,
        lodash.mixin = mixin, lodash.noConflict = noConflict, lodash.parseInt = parseInt,
        lodash.random = random, lodash.reduce = reduce, lodash.reduceRight = reduceRight,
        lodash.result = result, lodash.runInContext = runInContext, lodash.size = size,
        lodash.some = some, lodash.sortedIndex = sortedIndex, lodash.template = template,
        lodash.unescape = unescape, lodash.uniqueId = uniqueId, lodash.all = every, lodash.any = some,
        lodash.detect = find, lodash.foldl = reduce, lodash.foldr = reduceRight, lodash.include = contains,
        lodash.inject = reduce, forOwn(lodash, function(func, methodName) {
            lodash.prototype[methodName] || (lodash.prototype[methodName] = function() {
                var args = [ this.__wrapped__ ];
                return push.apply(args, arguments), func.apply(lodash, args);
            });
        }), lodash.first = first, lodash.last = last, lodash.take = first, lodash.head = first,
        forOwn(lodash, function(func, methodName) {
            lodash.prototype[methodName] || (lodash.prototype[methodName] = function(callback, thisArg) {
                var result = func(this.__wrapped__, callback, thisArg);
                return null == callback || thisArg && "function" != typeof callback ? result : new lodashWrapper(result);
            });
        }), lodash.VERSION = "1.2.1", lodash.prototype.toString = wrapperToString, lodash.prototype.value = wrapperValueOf,
        lodash.prototype.valueOf = wrapperValueOf, forEach([ "join", "pop", "shift" ], function(methodName) {
            var func = arrayRef[methodName];
            lodash.prototype[methodName] = function() {
                return func.apply(this.__wrapped__, arguments);
            };
        }), forEach([ "push", "reverse", "sort", "unshift" ], function(methodName) {
            var func = arrayRef[methodName];
            lodash.prototype[methodName] = function() {
                return func.apply(this.__wrapped__, arguments), this;
            };
        }), forEach([ "concat", "slice", "splice" ], function(methodName) {
            var func = arrayRef[methodName];
            lodash.prototype[methodName] = function() {
                return new lodashWrapper(func.apply(this.__wrapped__, arguments));
            };
        }), lodash;
    }
    var undefined, freeExports = "object" == typeof exports && exports, freeModule = "object" == typeof module && module && module.exports == freeExports && module, freeGlobal = "object" == typeof global && global;
    (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) && (window = freeGlobal);
    var idCounter = 0, indicatorObject = {}, keyPrefix = +new Date() + "", largeArraySize = 200, reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g, reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g, reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, reFlags = /\w*$/, reInterpolate = /<%=([\s\S]+?)%>/g, whitespace = " 	\f \n\r\u2028\u2029 ᠎             　", reLeadingSpacesAndZeros = RegExp("^[" + whitespace + "]*0+(?=.$)"), reNoMatch = /($^)/, reUnescapedHtml = /[&<>"']/g, reUnescapedString = /['\n\r\t\u2028\u2029\\]/g, contextProps = [ "Array", "Boolean", "Date", "Function", "Math", "Number", "Object", "RegExp", "String", "_", "attachEvent", "clearTimeout", "isFinite", "isNaN", "parseInt", "setImmediate", "setTimeout" ], templateCounter = 0, argsClass = "[object Arguments]", arrayClass = "[object Array]", boolClass = "[object Boolean]", dateClass = "[object Date]", funcClass = "[object Function]", numberClass = "[object Number]", objectClass = "[object Object]", regexpClass = "[object RegExp]", stringClass = "[object String]", cloneableClasses = {};
    cloneableClasses[funcClass] = !1, cloneableClasses[argsClass] = cloneableClasses[arrayClass] = cloneableClasses[boolClass] = cloneableClasses[dateClass] = cloneableClasses[numberClass] = cloneableClasses[objectClass] = cloneableClasses[regexpClass] = cloneableClasses[stringClass] = !0;
    var objectTypes = {
        "boolean": !1,
        "function": !0,
        object: !0,
        number: !1,
        string: !1,
        undefined: !1
    }, stringEscapes = {
        "\\": "\\",
        "'": "'",
        "\n": "n",
        "\r": "r",
        "	": "t",
        "\u2028": "u2028",
        "\u2029": "u2029"
    }, _ = runInContext();
    "function" == typeof define && "object" == typeof define.amd && define.amd ? (window._ = _,
    define(function() {
        return _;
    })) : freeExports && !freeExports.nodeType ? freeModule ? (freeModule.exports = _)._ = _ : freeExports._ = _ : window._ = _;
})(this);