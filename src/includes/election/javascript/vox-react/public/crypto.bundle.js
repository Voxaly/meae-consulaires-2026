/*!
 * https://github.com/es-shims/es5-shim
 * @license es5-shim Copyright 2009-2015 by contributors, MIT License
 * see https://github.com/es-shims/es5-shim/blob/master/LICENSE
 */

// vim: ts=4 sts=4 sw=4 expandtab

// Add semicolon to prevent IIFE from being passed as argument to concatenated code.
;

// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/templates/returnExports.js
(function (root, factory) {
    'use strict';

    /* global define, exports, module */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {
    /**
     * Brings an environment as close to ECMAScript 5 compliance
     * as is possible with the facilities of erstwhile engines.
     *
     * Annotated ES5: http://es5.github.com/ (specific links below)
     * ES5 Spec: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
     * Required reading: http://javascriptweblog.wordpress.com/2011/12/05/extending-javascript-natives/
     */

    // Shortcut to an often accessed properties, in order to avoid multiple
    // dereference that costs universally. This also holds a reference to known-good
    // functions.
    var $Array = Array;
    var ArrayPrototype = $Array.prototype;
    var $Object = Object;
    var ObjectPrototype = $Object.prototype;
    var $Function = Function;
    var FunctionPrototype = $Function.prototype;
    var $String = String;
    var StringPrototype = $String.prototype;
    var $Number = Number;
    var NumberPrototype = $Number.prototype;
    var array_slice = ArrayPrototype.slice;
    var array_splice = ArrayPrototype.splice;
    var array_push = ArrayPrototype.push;
    var array_unshift = ArrayPrototype.unshift;
    var array_concat = ArrayPrototype.concat;
    var array_join = ArrayPrototype.join;
    var call = FunctionPrototype.call;
    var apply = FunctionPrototype.apply;
    var max = Math.max;
    var min = Math.min;

    // Having a toString local variable name breaks in Opera so use to_string.
    var to_string = ObjectPrototype.toString;

    /* global Symbol */
    /* eslint-disable one-var-declaration-per-line, no-redeclare, max-statements-per-line */
    var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
    var isCallable; /* inlined from https://npmjs.com/is-callable */ var fnToStr = Function.prototype.toString, constructorRegex = /^\s*class /, isES6ClassFn = function isES6ClassFn(value) { try { var fnStr = fnToStr.call(value); var singleStripped = fnStr.replace(/\/\/.*\n/g, ''); var multiStripped = singleStripped.replace(/\/\*[.\s\S]*\*\//g, ''); var spaceStripped = multiStripped.replace(/\n/mg, ' ').replace(/ {2}/g, ' '); return constructorRegex.test(spaceStripped); } catch (e) { return false; /* not a function */ } }, tryFunctionObject = function tryFunctionObject(value) { try { if (isES6ClassFn(value)) { return false; } fnToStr.call(value); return true; } catch (e) { return false; } }, fnClass = '[object Function]', genClass = '[object GeneratorFunction]', isCallable = function isCallable(value) { if (!value) { return false; } if (typeof value !== 'function' && typeof value !== 'object') { return false; } if (hasToStringTag) { return tryFunctionObject(value); } if (isES6ClassFn(value)) { return false; } var strClass = to_string.call(value); return strClass === fnClass || strClass === genClass; };

    var isRegex; /* inlined from https://npmjs.com/is-regex */ var regexExec = RegExp.prototype.exec, tryRegexExec = function tryRegexExec(value) { try { regexExec.call(value); return true; } catch (e) { return false; } }, regexClass = '[object RegExp]'; isRegex = function isRegex(value) { if (typeof value !== 'object') { return false; } return hasToStringTag ? tryRegexExec(value) : to_string.call(value) === regexClass; };
    var isString; /* inlined from https://npmjs.com/is-string */ var strValue = String.prototype.valueOf, tryStringObject = function tryStringObject(value) { try { strValue.call(value); return true; } catch (e) { return false; } }, stringClass = '[object String]'; isString = function isString(value) { if (typeof value === 'string') { return true; } if (typeof value !== 'object') { return false; } return hasToStringTag ? tryStringObject(value) : to_string.call(value) === stringClass; };
    /* eslint-enable one-var-declaration-per-line, no-redeclare, max-statements-per-line */

    /* inlined from http://npmjs.com/define-properties */
    var supportsDescriptors = $Object.defineProperty && (function () {
        try {
            var obj = {};
            $Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
            for (var _ in obj) { // jscs:ignore disallowUnusedVariables
                return false;
            }
            return obj.x === obj;
        } catch (e) { /* this is ES3 */
            return false;
        }
    }());
    var defineProperties = (function (has) {
        // Define configurable, writable, and non-enumerable props
        // if they don't exist.
        var defineProperty;
        if (supportsDescriptors) {
            defineProperty = function (object, name, method, forceAssign) {
                if (!forceAssign && (name in object)) {
                    return;
                }
                $Object.defineProperty(object, name, {
                    configurable: true,
                    enumerable: false,
                    writable: true,
                    value: method
                });
            };
        } else {
            defineProperty = function (object, name, method, forceAssign) {
                if (!forceAssign && (name in object)) {
                    return;
                }
                object[name] = method;
            };
        }
        return function defineProperties(object, map, forceAssign) {
            for (var name in map) {
                if (has.call(map, name)) {
                    defineProperty(object, name, map[name], forceAssign);
                }
            }
        };
    }(ObjectPrototype.hasOwnProperty));

    //
    // Util
    // ======
    //

    /* replaceable with https://npmjs.com/package/es-abstract /helpers/isPrimitive */
    var isPrimitive = function isPrimitive(input) {
        var type = typeof input;
        return input === null || (type !== 'object' && type !== 'function');
    };

    var isActualNaN = $Number.isNaN || function isActualNaN(x) {
        return x !== x;
    };

    var ES = {
        // ES5 9.4
        // http://es5.github.com/#x9.4
        // http://jsperf.com/to-integer
        /* replaceable with https://npmjs.com/package/es-abstract ES5.ToInteger */
        ToInteger: function ToInteger(num) {
            var n = +num;
            if (isActualNaN(n)) {
                n = 0;
            } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
            return n;
        },

        /* replaceable with https://npmjs.com/package/es-abstract ES5.ToPrimitive */
        ToPrimitive: function ToPrimitive(input) {
            var val, valueOf, toStr;
            if (isPrimitive(input)) {
                return input;
            }
            valueOf = input.valueOf;
            if (isCallable(valueOf)) {
                val = valueOf.call(input);
                if (isPrimitive(val)) {
                    return val;
                }
            }
            toStr = input.toString;
            if (isCallable(toStr)) {
                val = toStr.call(input);
                if (isPrimitive(val)) {
                    return val;
                }
            }
            throw new TypeError();
        },

        // ES5 9.9
        // http://es5.github.com/#x9.9
        /* replaceable with https://npmjs.com/package/es-abstract ES5.ToObject */
        ToObject: function (o) {
            if (o == null) { // this matches both null and undefined
                throw new TypeError("can't convert " + o + ' to object');
            }
            return $Object(o);
        },

        /* replaceable with https://npmjs.com/package/es-abstract ES5.ToUint32 */
        ToUint32: function ToUint32(x) {
            return x >>> 0;
        }
    };

    //
    // Function
    // ========
    //

    // ES-5 15.3.4.5
    // http://es5.github.com/#x15.3.4.5

    var Empty = function Empty() {};

    defineProperties(FunctionPrototype, {
        bind: function bind(that) { // .length is 1
            // 1. Let Target be the this value.
            var target = this;
            // 2. If IsCallable(Target) is false, throw a TypeError exception.
            if (!isCallable(target)) {
                throw new TypeError('Function.prototype.bind called on incompatible ' + target);
            }
            // 3. Let A be a new (possibly empty) internal list of all of the
            //   argument values provided after thisArg (arg1, arg2 etc), in order.
            // XXX slicedArgs will stand in for "A" if used
            var args = array_slice.call(arguments, 1); // for normal call
            // 4. Let F be a new native ECMAScript object.
            // 11. Set the [[Prototype]] internal property of F to the standard
            //   built-in Function prototype object as specified in 15.3.3.1.
            // 12. Set the [[Call]] internal property of F as described in
            //   15.3.4.5.1.
            // 13. Set the [[Construct]] internal property of F as described in
            //   15.3.4.5.2.
            // 14. Set the [[HasInstance]] internal property of F as described in
            //   15.3.4.5.3.
            var bound;
            var binder = function () {

                if (this instanceof bound) {
                    // 15.3.4.5.2 [[Construct]]
                    // When the [[Construct]] internal method of a function object,
                    // F that was created using the bind function is called with a
                    // list of arguments ExtraArgs, the following steps are taken:
                    // 1. Let target be the value of F's [[TargetFunction]]
                    //   internal property.
                    // 2. If target has no [[Construct]] internal method, a
                    //   TypeError exception is thrown.
                    // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                    //   property.
                    // 4. Let args be a new list containing the same values as the
                    //   list boundArgs in the same order followed by the same
                    //   values as the list ExtraArgs in the same order.
                    // 5. Return the result of calling the [[Construct]] internal
                    //   method of target providing args as the arguments.

                    var result = apply.call(
                        target,
                        this,
                        array_concat.call(args, array_slice.call(arguments))
                    );
                    if ($Object(result) === result) {
                        return result;
                    }
                    return this;

                } else {
                    // 15.3.4.5.1 [[Call]]
                    // When the [[Call]] internal method of a function object, F,
                    // which was created using the bind function is called with a
                    // this value and a list of arguments ExtraArgs, the following
                    // steps are taken:
                    // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                    //   property.
                    // 2. Let boundThis be the value of F's [[BoundThis]] internal
                    //   property.
                    // 3. Let target be the value of F's [[TargetFunction]] internal
                    //   property.
                    // 4. Let args be a new list containing the same values as the
                    //   list boundArgs in the same order followed by the same
                    //   values as the list ExtraArgs in the same order.
                    // 5. Return the result of calling the [[Call]] internal method
                    //   of target providing boundThis as the this value and
                    //   providing args as the arguments.

                    // equiv: target.call(this, ...boundArgs, ...args)
                    return apply.call(
                        target,
                        that,
                        array_concat.call(args, array_slice.call(arguments))
                    );

                }

            };

            // 15. If the [[Class]] internal property of Target is "Function", then
            //     a. Let L be the length property of Target minus the length of A.
            //     b. Set the length own property of F to either 0 or L, whichever is
            //       larger.
            // 16. Else set the length own property of F to 0.

            var boundLength = max(0, target.length - args.length);

            // 17. Set the attributes of the length own property of F to the values
            //   specified in 15.3.5.1.
            var boundArgs = [];
            for (var i = 0; i < boundLength; i++) {
                array_push.call(boundArgs, '$' + i);
            }

            // XXX Build a dynamic function with desired amount of arguments is the only
            // way to set the length property of a function.
            // In environments where Content Security Policies enabled (Chrome extensions,
            // for ex.) all use of eval or Function costructor throws an exception.
            // However in all of these environments Function.prototype.bind exists
            // and so this code will never be executed.
            bound = $Function('binder', 'return function (' + array_join.call(boundArgs, ',') + '){ return binder.apply(this, arguments); }')(binder);

            if (target.prototype) {
                Empty.prototype = target.prototype;
                bound.prototype = new Empty();
                // Clean up dangling references.
                Empty.prototype = null;
            }

            // TODO
            // 18. Set the [[Extensible]] internal property of F to true.

            // TODO
            // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
            // 20. Call the [[DefineOwnProperty]] internal method of F with
            //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
            //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
            //   false.
            // 21. Call the [[DefineOwnProperty]] internal method of F with
            //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
            //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
            //   and false.

            // TODO
            // NOTE Function objects created using Function.prototype.bind do not
            // have a prototype property or the [[Code]], [[FormalParameters]], and
            // [[Scope]] internal properties.
            // XXX can't delete prototype in pure-js.

            // 22. Return F.
            return bound;
        }
    });

    // _Please note: Shortcuts are defined after `Function.prototype.bind` as we
    // use it in defining shortcuts.
    var owns = call.bind(ObjectPrototype.hasOwnProperty);
    var toStr = call.bind(ObjectPrototype.toString);
    var arraySlice = call.bind(array_slice);
    var arraySliceApply = apply.bind(array_slice);
    /* globals document */
    if (typeof document === 'object' && document && document.documentElement) {
        try {
            arraySlice(document.documentElement.childNodes);
        } catch (e) {
            var origArraySlice = arraySlice;
            var origArraySliceApply = arraySliceApply;
            arraySlice = function arraySliceIE(arr) {
                var r = [];
                var i = arr.length;
                while (i-- > 0) {
                    r[i] = arr[i];
                }
                return origArraySliceApply(r, origArraySlice(arguments, 1));
            };
            arraySliceApply = function arraySliceApplyIE(arr, args) {
                return origArraySliceApply(arraySlice(arr), args);
            };
        }
    }
    var strSlice = call.bind(StringPrototype.slice);
    var strSplit = call.bind(StringPrototype.split);
    var strIndexOf = call.bind(StringPrototype.indexOf);
    var pushCall = call.bind(array_push);
    var isEnum = call.bind(ObjectPrototype.propertyIsEnumerable);
    var arraySort = call.bind(ArrayPrototype.sort);

    //
    // Array
    // =====
    //

    var isArray = $Array.isArray || function isArray(obj) {
        return toStr(obj) === '[object Array]';
    };

    // ES5 15.4.4.12
    // http://es5.github.com/#x15.4.4.13
    // Return len+argCount.
    // [bugfix, ielt8]
    // IE < 8 bug: [].unshift(0) === undefined but should be "1"
    var hasUnshiftReturnValueBug = [].unshift(0) !== 1;
    defineProperties(ArrayPrototype, {
        unshift: function () {
            array_unshift.apply(this, arguments);
            return this.length;
        }
    }, hasUnshiftReturnValueBug);

    // ES5 15.4.3.2
    // http://es5.github.com/#x15.4.3.2
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
    defineProperties($Array, { isArray: isArray });

    // The IsCallable() check in the Array functions
    // has been replaced with a strict check on the
    // internal class of the object to trap cases where
    // the provided function was actually a regular
    // expression literal, which in V8 and
    // JavaScriptCore is a typeof "function".  Only in
    // V8 are regular expression literals permitted as
    // reduce parameters, so it is desirable in the
    // general case for the shim to match the more
    // strict and common behavior of rejecting regular
    // expressions.

    // ES5 15.4.4.18
    // http://es5.github.com/#x15.4.4.18
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach

    // Check failure of by-index access of string characters (IE < 9)
    // and failure of `0 in boxedString` (Rhino)
    var boxedString = $Object('a');
    var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

    var properlyBoxesContext = function properlyBoxed(method) {
        // Check node 0.6.21 bug where third parameter is not boxed
        var properlyBoxesNonStrict = true;
        var properlyBoxesStrict = true;
        var threwException = false;
        if (method) {
            try {
                method.call('foo', function (_, __, context) {
                    if (typeof context !== 'object') {
                        properlyBoxesNonStrict = false;
                    }
                });

                method.call([1], function () {
                    'use strict';

                    properlyBoxesStrict = typeof this === 'string';
                }, 'x');
            } catch (e) {
                threwException = true;
            }
        }
        return !!method && !threwException && properlyBoxesNonStrict && properlyBoxesStrict;
    };

    defineProperties(ArrayPrototype, {
        forEach: function forEach(callbackfn/*, thisArg*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var i = -1;
            var length = ES.ToUint32(self.length);
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.forEach callback must be a function');
            }

            while (++i < length) {
                if (i in self) {
                    // Invoke the callback function with call, passing arguments:
                    // context, property value, property key, thisArg object
                    if (typeof T === 'undefined') {
                        callbackfn(self[i], i, object);
                    } else {
                        callbackfn.call(T, self[i], i, object);
                    }
                }
            }
        }
    }, !properlyBoxesContext(ArrayPrototype.forEach));

    // ES5 15.4.4.19
    // http://es5.github.com/#x15.4.4.19
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
    defineProperties(ArrayPrototype, {
        map: function map(callbackfn/*, thisArg*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            var result = $Array(length);
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.map callback must be a function');
            }

            for (var i = 0; i < length; i++) {
                if (i in self) {
                    if (typeof T === 'undefined') {
                        result[i] = callbackfn(self[i], i, object);
                    } else {
                        result[i] = callbackfn.call(T, self[i], i, object);
                    }
                }
            }
            return result;
        }
    }, !properlyBoxesContext(ArrayPrototype.map));

    // ES5 15.4.4.20
    // http://es5.github.com/#x15.4.4.20
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
    defineProperties(ArrayPrototype, {
        filter: function filter(callbackfn/*, thisArg*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            var result = [];
            var value;
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.filter callback must be a function');
            }

            for (var i = 0; i < length; i++) {
                if (i in self) {
                    value = self[i];
                    if (typeof T === 'undefined' ? callbackfn(value, i, object) : callbackfn.call(T, value, i, object)) {
                        pushCall(result, value);
                    }
                }
            }
            return result;
        }
    }, !properlyBoxesContext(ArrayPrototype.filter));

    // ES5 15.4.4.16
    // http://es5.github.com/#x15.4.4.16
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
    defineProperties(ArrayPrototype, {
        every: function every(callbackfn/*, thisArg*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.every callback must be a function');
            }

            for (var i = 0; i < length; i++) {
                if (i in self && !(typeof T === 'undefined' ? callbackfn(self[i], i, object) : callbackfn.call(T, self[i], i, object))) {
                    return false;
                }
            }
            return true;
        }
    }, !properlyBoxesContext(ArrayPrototype.every));

    // ES5 15.4.4.17
    // http://es5.github.com/#x15.4.4.17
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
    defineProperties(ArrayPrototype, {
        some: function some(callbackfn/*, thisArg */) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.some callback must be a function');
            }

            for (var i = 0; i < length; i++) {
                if (i in self && (typeof T === 'undefined' ? callbackfn(self[i], i, object) : callbackfn.call(T, self[i], i, object))) {
                    return true;
                }
            }
            return false;
        }
    }, !properlyBoxesContext(ArrayPrototype.some));

    // ES5 15.4.4.21
    // http://es5.github.com/#x15.4.4.21
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
    var reduceCoercesToObject = false;
    if (ArrayPrototype.reduce) {
        reduceCoercesToObject = typeof ArrayPrototype.reduce.call('es5', function (_, __, ___, list) {
            return list;
        }) === 'object';
    }
    defineProperties(ArrayPrototype, {
        reduce: function reduce(callbackfn/*, initialValue*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.reduce callback must be a function');
            }

            // no value to return if no initial value and an empty array
            if (length === 0 && arguments.length === 1) {
                throw new TypeError('reduce of empty array with no initial value');
            }

            var i = 0;
            var result;
            if (arguments.length >= 2) {
                result = arguments[1];
            } else {
                do {
                    if (i in self) {
                        result = self[i++];
                        break;
                    }

                    // if array contains no values, no initial value to return
                    if (++i >= length) {
                        throw new TypeError('reduce of empty array with no initial value');
                    }
                } while (true);
            }

            for (; i < length; i++) {
                if (i in self) {
                    result = callbackfn(result, self[i], i, object);
                }
            }

            return result;
        }
    }, !reduceCoercesToObject);

    // ES5 15.4.4.22
    // http://es5.github.com/#x15.4.4.22
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
    var reduceRightCoercesToObject = false;
    if (ArrayPrototype.reduceRight) {
        reduceRightCoercesToObject = typeof ArrayPrototype.reduceRight.call('es5', function (_, __, ___, list) {
            return list;
        }) === 'object';
    }
    defineProperties(ArrayPrototype, {
        reduceRight: function reduceRight(callbackfn/*, initial*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.reduceRight callback must be a function');
            }

            // no value to return if no initial value, empty array
            if (length === 0 && arguments.length === 1) {
                throw new TypeError('reduceRight of empty array with no initial value');
            }

            var result;
            var i = length - 1;
            if (arguments.length >= 2) {
                result = arguments[1];
            } else {
                do {
                    if (i in self) {
                        result = self[i--];
                        break;
                    }

                    // if array contains no values, no initial value to return
                    if (--i < 0) {
                        throw new TypeError('reduceRight of empty array with no initial value');
                    }
                } while (true);
            }

            if (i < 0) {
                return result;
            }

            do {
                if (i in self) {
                    result = callbackfn(result, self[i], i, object);
                }
            } while (i--);

            return result;
        }
    }, !reduceRightCoercesToObject);

    // ES5 15.4.4.14
    // http://es5.github.com/#x15.4.4.14
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
    var hasFirefox2IndexOfBug = ArrayPrototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
    defineProperties(ArrayPrototype, {
        indexOf: function indexOf(searchElement/*, fromIndex */) {
            var self = splitString && isString(this) ? strSplit(this, '') : ES.ToObject(this);
            var length = ES.ToUint32(self.length);

            if (length === 0) {
                return -1;
            }

            var i = 0;
            if (arguments.length > 1) {
                i = ES.ToInteger(arguments[1]);
            }

            // handle negative indices
            i = i >= 0 ? i : max(0, length + i);
            for (; i < length; i++) {
                if (i in self && self[i] === searchElement) {
                    return i;
                }
            }
            return -1;
        }
    }, hasFirefox2IndexOfBug);

    // ES5 15.4.4.15
    // http://es5.github.com/#x15.4.4.15
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
    var hasFirefox2LastIndexOfBug = ArrayPrototype.lastIndexOf && [0, 1].lastIndexOf(0, -3) !== -1;
    defineProperties(ArrayPrototype, {
        lastIndexOf: function lastIndexOf(searchElement/*, fromIndex */) {
            var self = splitString && isString(this) ? strSplit(this, '') : ES.ToObject(this);
            var length = ES.ToUint32(self.length);

            if (length === 0) {
                return -1;
            }
            var i = length - 1;
            if (arguments.length > 1) {
                i = min(i, ES.ToInteger(arguments[1]));
            }
            // handle negative indices
            i = i >= 0 ? i : length - Math.abs(i);
            for (; i >= 0; i--) {
                if (i in self && searchElement === self[i]) {
                    return i;
                }
            }
            return -1;
        }
    }, hasFirefox2LastIndexOfBug);

    // ES5 15.4.4.12
    // http://es5.github.com/#x15.4.4.12
    var spliceNoopReturnsEmptyArray = (function () {
        var a = [1, 2];
        var result = a.splice();
        return a.length === 2 && isArray(result) && result.length === 0;
    }());
    defineProperties(ArrayPrototype, {
        // Safari 5.0 bug where .splice() returns undefined
        splice: function splice(start, deleteCount) {
            if (arguments.length === 0) {
                return [];
            } else {
                return array_splice.apply(this, arguments);
            }
        }
    }, !spliceNoopReturnsEmptyArray);

    var spliceWorksWithEmptyObject = (function () {
        var obj = {};
        ArrayPrototype.splice.call(obj, 0, 0, 1);
        return obj.length === 1;
    }());
    defineProperties(ArrayPrototype, {
        splice: function splice(start, deleteCount) {
            if (arguments.length === 0) {
                return [];
            }
            var args = arguments;
            this.length = max(ES.ToInteger(this.length), 0);
            if (arguments.length > 0 && typeof deleteCount !== 'number') {
                args = arraySlice(arguments);
                if (args.length < 2) {
                    pushCall(args, this.length - start);
                } else {
                    args[1] = ES.ToInteger(deleteCount);
                }
            }
            return array_splice.apply(this, args);
        }
    }, !spliceWorksWithEmptyObject);
    var spliceWorksWithLargeSparseArrays = (function () {
        // Per https://github.com/es-shims/es5-shim/issues/295
        // Safari 7/8 breaks with sparse arrays of size 1e5 or greater
        var arr = new $Array(1e5);
        // note: the index MUST be 8 or larger or the test will false pass
        arr[8] = 'x';
        arr.splice(1, 1);
        // note: this test must be defined *after* the indexOf shim
        // per https://github.com/es-shims/es5-shim/issues/313
        return arr.indexOf('x') === 7;
    }());
    var spliceWorksWithSmallSparseArrays = (function () {
        // Per https://github.com/es-shims/es5-shim/issues/295
        // Opera 12.15 breaks on this, no idea why.
        var n = 256;
        var arr = [];
        arr[n] = 'a';
        arr.splice(n + 1, 0, 'b');
        return arr[n] === 'a';
    }());
    defineProperties(ArrayPrototype, {
        splice: function splice(start, deleteCount) {
            var O = ES.ToObject(this);
            var A = [];
            var len = ES.ToUint32(O.length);
            var relativeStart = ES.ToInteger(start);
            var actualStart = relativeStart < 0 ? max((len + relativeStart), 0) : min(relativeStart, len);
            var actualDeleteCount = min(max(ES.ToInteger(deleteCount), 0), len - actualStart);

            var k = 0;
            var from;
            while (k < actualDeleteCount) {
                from = $String(actualStart + k);
                if (owns(O, from)) {
                    A[k] = O[from];
                }
                k += 1;
            }

            var items = arraySlice(arguments, 2);
            var itemCount = items.length;
            var to;
            if (itemCount < actualDeleteCount) {
                k = actualStart;
                var maxK = len - actualDeleteCount;
                while (k < maxK) {
                    from = $String(k + actualDeleteCount);
                    to = $String(k + itemCount);
                    if (owns(O, from)) {
                        O[to] = O[from];
                    } else {
                        delete O[to];
                    }
                    k += 1;
                }
                k = len;
                var minK = len - actualDeleteCount + itemCount;
                while (k > minK) {
                    delete O[k - 1];
                    k -= 1;
                }
            } else if (itemCount > actualDeleteCount) {
                k = len - actualDeleteCount;
                while (k > actualStart) {
                    from = $String(k + actualDeleteCount - 1);
                    to = $String(k + itemCount - 1);
                    if (owns(O, from)) {
                        O[to] = O[from];
                    } else {
                        delete O[to];
                    }
                    k -= 1;
                }
            }
            k = actualStart;
            for (var i = 0; i < items.length; ++i) {
                O[k] = items[i];
                k += 1;
            }
            O.length = len - actualDeleteCount + itemCount;

            return A;
        }
    }, !spliceWorksWithLargeSparseArrays || !spliceWorksWithSmallSparseArrays);

    var originalJoin = ArrayPrototype.join;
    var hasStringJoinBug;
    try {
        hasStringJoinBug = Array.prototype.join.call('123', ',') !== '1,2,3';
    } catch (e) {
        hasStringJoinBug = true;
    }
    if (hasStringJoinBug) {
        defineProperties(ArrayPrototype, {
            join: function join(separator) {
                var sep = typeof separator === 'undefined' ? ',' : separator;
                return originalJoin.call(isString(this) ? strSplit(this, '') : this, sep);
            }
        }, hasStringJoinBug);
    }

    var hasJoinUndefinedBug = [1, 2].join(undefined) !== '1,2';
    if (hasJoinUndefinedBug) {
        defineProperties(ArrayPrototype, {
            join: function join(separator) {
                var sep = typeof separator === 'undefined' ? ',' : separator;
                return originalJoin.call(this, sep);
            }
        }, hasJoinUndefinedBug);
    }

    var pushShim = function push(item) {
        var O = ES.ToObject(this);
        var n = ES.ToUint32(O.length);
        var i = 0;
        while (i < arguments.length) {
            O[n + i] = arguments[i];
            i += 1;
        }
        O.length = n + i;
        return n + i;
    };

    var pushIsNotGeneric = (function () {
        var obj = {};
        var result = Array.prototype.push.call(obj, undefined);
        return result !== 1 || obj.length !== 1 || typeof obj[0] !== 'undefined' || !owns(obj, 0);
    }());
    defineProperties(ArrayPrototype, {
        push: function push(item) {
            if (isArray(this)) {
                return array_push.apply(this, arguments);
            }
            return pushShim.apply(this, arguments);
        }
    }, pushIsNotGeneric);

    // This fixes a very weird bug in Opera 10.6 when pushing `undefined
    var pushUndefinedIsWeird = (function () {
        var arr = [];
        var result = arr.push(undefined);
        return result !== 1 || arr.length !== 1 || typeof arr[0] !== 'undefined' || !owns(arr, 0);
    }());
    defineProperties(ArrayPrototype, { push: pushShim }, pushUndefinedIsWeird);

    // ES5 15.2.3.14
    // http://es5.github.io/#x15.4.4.10
    // Fix boxed string bug
    defineProperties(ArrayPrototype, {
        slice: function (start, end) {
            var arr = isString(this) ? strSplit(this, '') : this;
            return arraySliceApply(arr, arguments);
        }
    }, splitString);

    var sortIgnoresNonFunctions = (function () {
        try {
            [1, 2].sort(null);
            [1, 2].sort({});
            return true;
        } catch (e) {}
        return false;
    }());
    var sortThrowsOnRegex = (function () {
        // this is a problem in Firefox 4, in which `typeof /a/ === 'function'`
        try {
            [1, 2].sort(/a/);
            return false;
        } catch (e) {}
        return true;
    }());
    var sortIgnoresUndefined = (function () {
        // applies in IE 8, for one.
        try {
            [1, 2].sort(undefined);
            return true;
        } catch (e) {}
        return false;
    }());
    defineProperties(ArrayPrototype, {
        sort: function sort(compareFn) {
            if (typeof compareFn === 'undefined') {
                return arraySort(this);
            }
            if (!isCallable(compareFn)) {
                throw new TypeError('Array.prototype.sort callback must be a function');
            }
            return arraySort(this, compareFn);
        }
    }, sortIgnoresNonFunctions || !sortIgnoresUndefined || !sortThrowsOnRegex);

    //
    // Object
    // ======
    //

    // ES5 15.2.3.14
    // http://es5.github.com/#x15.2.3.14

    // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
    var hasDontEnumBug = !isEnum({ 'toString': null }, 'toString'); // jscs:ignore disallowQuotedKeysInObjects
    var hasProtoEnumBug = isEnum(function () {}, 'prototype');
    var hasStringEnumBug = !owns('x', '0');
    var equalsConstructorPrototype = function (o) {
        var ctor = o.constructor;
        return ctor && ctor.prototype === o;
    };
    var excludedKeys = {
        $window: true,
        $console: true,
        $parent: true,
        $self: true,
        $frame: true,
        $frames: true,
        $frameElement: true,
        $webkitIndexedDB: true,
        $webkitStorageInfo: true,
        $external: true,
        $width: true,
        $height: true,
        $top: true,
        $localStorage: true
    };
    var hasAutomationEqualityBug = (function () {
        /* globals window */
        if (typeof window === 'undefined') {
            return false;
        }
        for (var k in window) {
            try {
                if (!excludedKeys['$' + k] && owns(window, k) && window[k] !== null && typeof window[k] === 'object') {
                    equalsConstructorPrototype(window[k]);
                }
            } catch (e) {
                return true;
            }
        }
        return false;
    }());
    var equalsConstructorPrototypeIfNotBuggy = function (object) {
        if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
            return equalsConstructorPrototype(object);
        }
        try {
            return equalsConstructorPrototype(object);
        } catch (e) {
            return false;
        }
    };
    var dontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
    ];
    var dontEnumsLength = dontEnums.length;

    // taken directly from https://github.com/ljharb/is-arguments/blob/master/index.js
    // can be replaced with require('is-arguments') if we ever use a build process instead
    var isStandardArguments = function isArguments(value) {
        return toStr(value) === '[object Arguments]';
    };
    var isLegacyArguments = function isArguments(value) {
        return value !== null
            && typeof value === 'object'
            && typeof value.length === 'number'
            && value.length >= 0
            && !isArray(value)
            && isCallable(value.callee);
    };
    var isArguments = isStandardArguments(arguments) ? isStandardArguments : isLegacyArguments;

    defineProperties($Object, {
        keys: function keys(object) {
            var isFn = isCallable(object);
            var isArgs = isArguments(object);
            var isObject = object !== null && typeof object === 'object';
            var isStr = isObject && isString(object);

            if (!isObject && !isFn && !isArgs) {
                throw new TypeError('Object.keys called on a non-object');
            }

            var theKeys = [];
            var skipProto = hasProtoEnumBug && isFn;
            if ((isStr && hasStringEnumBug) || isArgs) {
                for (var i = 0; i < object.length; ++i) {
                    pushCall(theKeys, $String(i));
                }
            }

            if (!isArgs) {
                for (var name in object) {
                    if (!(skipProto && name === 'prototype') && owns(object, name)) {
                        pushCall(theKeys, $String(name));
                    }
                }
            }

            if (hasDontEnumBug) {
                var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
                for (var j = 0; j < dontEnumsLength; j++) {
                    var dontEnum = dontEnums[j];
                    if (!(skipConstructor && dontEnum === 'constructor') && owns(object, dontEnum)) {
                        pushCall(theKeys, dontEnum);
                    }
                }
            }
            return theKeys;
        }
    });

    var keysWorksWithArguments = $Object.keys && (function () {
        // Safari 5.0 bug
        return $Object.keys(arguments).length === 2;
    }(1, 2));
    var keysHasArgumentsLengthBug = $Object.keys && (function () {
        var argKeys = $Object.keys(arguments);
        return arguments.length !== 1 || argKeys.length !== 1 || argKeys[0] !== 1;
    }(1));
    var originalKeys = $Object.keys;
    defineProperties($Object, {
        keys: function keys(object) {
            if (isArguments(object)) {
                return originalKeys(arraySlice(object));
            } else {
                return originalKeys(object);
            }
        }
    }, !keysWorksWithArguments || keysHasArgumentsLengthBug);

    //
    // Date
    // ====
    //

    var hasNegativeMonthYearBug = new Date(-3509827329600292).getUTCMonth() !== 0;
    var aNegativeTestDate = new Date(-1509842289600292);
    var aPositiveTestDate = new Date(1449662400000);
    var hasToUTCStringFormatBug = aNegativeTestDate.toUTCString() !== 'Mon, 01 Jan -45875 11:59:59 GMT';
    var hasToDateStringFormatBug;
    var hasToStringFormatBug;
    var timeZoneOffset = aNegativeTestDate.getTimezoneOffset();
    if (timeZoneOffset < -720) {
        hasToDateStringFormatBug = aNegativeTestDate.toDateString() !== 'Tue Jan 02 -45875';
        hasToStringFormatBug = !(/^Thu Dec 10 2015 \d\d:\d\d:\d\d GMT[-+]\d\d\d\d(?: |$)/).test(String(aPositiveTestDate));
    } else {
        hasToDateStringFormatBug = aNegativeTestDate.toDateString() !== 'Mon Jan 01 -45875';
        hasToStringFormatBug = !(/^Wed Dec 09 2015 \d\d:\d\d:\d\d GMT[-+]\d\d\d\d(?: |$)/).test(String(aPositiveTestDate));
    }

    var originalGetFullYear = call.bind(Date.prototype.getFullYear);
    var originalGetMonth = call.bind(Date.prototype.getMonth);
    var originalGetDate = call.bind(Date.prototype.getDate);
    var originalGetUTCFullYear = call.bind(Date.prototype.getUTCFullYear);
    var originalGetUTCMonth = call.bind(Date.prototype.getUTCMonth);
    var originalGetUTCDate = call.bind(Date.prototype.getUTCDate);
    var originalGetUTCDay = call.bind(Date.prototype.getUTCDay);
    var originalGetUTCHours = call.bind(Date.prototype.getUTCHours);
    var originalGetUTCMinutes = call.bind(Date.prototype.getUTCMinutes);
    var originalGetUTCSeconds = call.bind(Date.prototype.getUTCSeconds);
    var originalGetUTCMilliseconds = call.bind(Date.prototype.getUTCMilliseconds);
    var dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var daysInMonth = function daysInMonth(month, year) {
        return originalGetDate(new Date(year, month, 0));
    };

    defineProperties(Date.prototype, {
        getFullYear: function getFullYear() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetFullYear(this);
            if (year < 0 && originalGetMonth(this) > 11) {
                return year + 1;
            }
            return year;
        },
        getMonth: function getMonth() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetFullYear(this);
            var month = originalGetMonth(this);
            if (year < 0 && month > 11) {
                return 0;
            }
            return month;
        },
        getDate: function getDate() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetFullYear(this);
            var month = originalGetMonth(this);
            var date = originalGetDate(this);
            if (year < 0 && month > 11) {
                if (month === 12) {
                    return date;
                }
                var days = daysInMonth(0, year + 1);
                return (days - date) + 1;
            }
            return date;
        },
        getUTCFullYear: function getUTCFullYear() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetUTCFullYear(this);
            if (year < 0 && originalGetUTCMonth(this) > 11) {
                return year + 1;
            }
            return year;
        },
        getUTCMonth: function getUTCMonth() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetUTCFullYear(this);
            var month = originalGetUTCMonth(this);
            if (year < 0 && month > 11) {
                return 0;
            }
            return month;
        },
        getUTCDate: function getUTCDate() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetUTCFullYear(this);
            var month = originalGetUTCMonth(this);
            var date = originalGetUTCDate(this);
            if (year < 0 && month > 11) {
                if (month === 12) {
                    return date;
                }
                var days = daysInMonth(0, year + 1);
                return (days - date) + 1;
            }
            return date;
        }
    }, hasNegativeMonthYearBug);

    defineProperties(Date.prototype, {
        toUTCString: function toUTCString() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var day = originalGetUTCDay(this);
            var date = originalGetUTCDate(this);
            var month = originalGetUTCMonth(this);
            var year = originalGetUTCFullYear(this);
            var hour = originalGetUTCHours(this);
            var minute = originalGetUTCMinutes(this);
            var second = originalGetUTCSeconds(this);
            return dayName[day] + ', '
                + (date < 10 ? '0' + date : date) + ' '
                + monthName[month] + ' '
                + year + ' '
                + (hour < 10 ? '0' + hour : hour) + ':'
                + (minute < 10 ? '0' + minute : minute) + ':'
                + (second < 10 ? '0' + second : second) + ' GMT';
        }
    }, hasNegativeMonthYearBug || hasToUTCStringFormatBug);

    // Opera 12 has `,`
    defineProperties(Date.prototype, {
        toDateString: function toDateString() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var day = this.getDay();
            var date = this.getDate();
            var month = this.getMonth();
            var year = this.getFullYear();
            return dayName[day] + ' '
                + monthName[month] + ' '
                + (date < 10 ? '0' + date : date) + ' '
                + year;
        }
    }, hasNegativeMonthYearBug || hasToDateStringFormatBug);

    // can't use defineProperties here because of toString enumeration issue in IE <= 8
    if (hasNegativeMonthYearBug || hasToStringFormatBug) {
        Date.prototype.toString = function toString() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var day = this.getDay();
            var date = this.getDate();
            var month = this.getMonth();
            var year = this.getFullYear();
            var hour = this.getHours();
            var minute = this.getMinutes();
            var second = this.getSeconds();
            var timezoneOffset = this.getTimezoneOffset();
            var hoursOffset = Math.floor(Math.abs(timezoneOffset) / 60);
            var minutesOffset = Math.floor(Math.abs(timezoneOffset) % 60);
            return dayName[day] + ' '
                + monthName[month] + ' '
                + (date < 10 ? '0' + date : date) + ' '
                + year + ' '
                + (hour < 10 ? '0' + hour : hour) + ':'
                + (minute < 10 ? '0' + minute : minute) + ':'
                + (second < 10 ? '0' + second : second) + ' GMT'
                + (timezoneOffset > 0 ? '-' : '+')
                + (hoursOffset < 10 ? '0' + hoursOffset : hoursOffset)
                + (minutesOffset < 10 ? '0' + minutesOffset : minutesOffset);
        };
        if (supportsDescriptors) {
            $Object.defineProperty(Date.prototype, 'toString', {
                configurable: true,
                enumerable: false,
                writable: true
            });
        }
    }

    // ES5 15.9.5.43
    // http://es5.github.com/#x15.9.5.43
    // This function returns a String value represent the instance in time
    // represented by this Date object. The format of the String is the Date Time
    // string format defined in 15.9.1.15. All fields are present in the String.
    // The time zone is always UTC, denoted by the suffix Z. If the time value of
    // this object is not a finite Number a RangeError exception is thrown.
    var negativeDate = -62198755200000;
    var negativeYearString = '-000001';
    var hasNegativeDateBug = Date.prototype.toISOString && new Date(negativeDate).toISOString().indexOf(negativeYearString) === -1; // eslint-disable-line max-len
    var hasSafari51DateBug = Date.prototype.toISOString && new Date(-1).toISOString() !== '1969-12-31T23:59:59.999Z';

    var getTime = call.bind(Date.prototype.getTime);

    defineProperties(Date.prototype, {
        toISOString: function toISOString() {
            if (!isFinite(this) || !isFinite(getTime(this))) {
                // Adope Photoshop requires the second check.
                throw new RangeError('Date.prototype.toISOString called on non-finite value.');
            }

            var year = originalGetUTCFullYear(this);

            var month = originalGetUTCMonth(this);
            // see https://github.com/es-shims/es5-shim/issues/111
            year += Math.floor(month / 12);
            month = ((month % 12) + 12) % 12;

            // the date time string format is specified in 15.9.1.15.
            var result = [
                month + 1,
                originalGetUTCDate(this),
                originalGetUTCHours(this),
                originalGetUTCMinutes(this),
                originalGetUTCSeconds(this)
            ];
            year = (
                (year < 0 ? '-' : (year > 9999 ? '+' : ''))
                + strSlice('00000' + Math.abs(year), (0 <= year && year <= 9999) ? -4 : -6)
            );

            for (var i = 0; i < result.length; ++i) {
                // pad months, days, hours, minutes, and seconds to have two digits.
                result[i] = strSlice('00' + result[i], -2);
            }
            // pad milliseconds to have three digits.
            return (
                year + '-' + arraySlice(result, 0, 2).join('-')
                + 'T' + arraySlice(result, 2).join(':') + '.'
                + strSlice('000' + originalGetUTCMilliseconds(this), -3) + 'Z'
            );
        }
    }, hasNegativeDateBug || hasSafari51DateBug);

    // ES5 15.9.5.44
    // http://es5.github.com/#x15.9.5.44
    // This function provides a String representation of a Date object for use by
    // JSON.stringify (15.12.3).
    var dateToJSONIsSupported = (function () {
        try {
            return Date.prototype.toJSON
                && new Date(NaN).toJSON() === null
                && new Date(negativeDate).toJSON().indexOf(negativeYearString) !== -1
                && Date.prototype.toJSON.call({ // generic
                    toISOString: function () { return true; }
                });
        } catch (e) {
            return false;
        }
    }());
    if (!dateToJSONIsSupported) {
        Date.prototype.toJSON = function toJSON(key) {
            // When the toJSON method is called with argument key, the following
            // steps are taken:

            // 1.  Let O be the result of calling ToObject, giving it the this
            // value as its argument.
            // 2. Let tv be ES.ToPrimitive(O, hint Number).
            var O = $Object(this);
            var tv = ES.ToPrimitive(O);
            // 3. If tv is a Number and is not finite, return null.
            if (typeof tv === 'number' && !isFinite(tv)) {
                return null;
            }
            // 4. Let toISO be the result of calling the [[Get]] internal method of
            // O with argument "toISOString".
            var toISO = O.toISOString;
            // 5. If IsCallable(toISO) is false, throw a TypeError exception.
            if (!isCallable(toISO)) {
                throw new TypeError('toISOString property is not callable');
            }
            // 6. Return the result of calling the [[Call]] internal method of
            //  toISO with O as the this value and an empty argument list.
            return toISO.call(O);

            // NOTE 1 The argument is ignored.

            // NOTE 2 The toJSON function is intentionally generic; it does not
            // require that its this value be a Date object. Therefore, it can be
            // transferred to other kinds of objects for use as a method. However,
            // it does require that any such object have a toISOString method. An
            // object is free to use the argument key to filter its
            // stringification.
        };
    }

    // ES5 15.9.4.2
    // http://es5.github.com/#x15.9.4.2
    // based on work shared by Daniel Friesen (dantman)
    // http://gist.github.com/303249
    var supportsExtendedYears = Date.parse('+033658-09-27T01:46:40.000Z') === 1e15;
    var acceptsInvalidDates = !isNaN(Date.parse('2012-04-04T24:00:00.500Z')) || !isNaN(Date.parse('2012-11-31T23:59:59.000Z')) || !isNaN(Date.parse('2012-12-31T23:59:60.000Z'));
    var doesNotParseY2KNewYear = isNaN(Date.parse('2000-01-01T00:00:00.000Z'));
    if (doesNotParseY2KNewYear || acceptsInvalidDates || !supportsExtendedYears) {
        // XXX global assignment won't work in embeddings that use
        // an alternate object for the context.
        /* global Date: true */
        var maxSafeUnsigned32Bit = Math.pow(2, 31) - 1;
        var hasSafariSignedIntBug = isActualNaN(new Date(1970, 0, 1, 0, 0, 0, maxSafeUnsigned32Bit + 1).getTime());
        // eslint-disable-next-line no-implicit-globals, no-global-assign
        Date = (function (NativeDate) {
            // Date.length === 7
            var DateShim = function Date(Y, M, D, h, m, s, ms) {
                var length = arguments.length;
                var date;
                if (this instanceof NativeDate) {
                    var seconds = s;
                    var millis = ms;
                    if (hasSafariSignedIntBug && length >= 7 && ms > maxSafeUnsigned32Bit) {
                        // work around a Safari 8/9 bug where it treats the seconds as signed
                        var msToShift = Math.floor(ms / maxSafeUnsigned32Bit) * maxSafeUnsigned32Bit;
                        var sToShift = Math.floor(msToShift / 1e3);
                        seconds += sToShift;
                        millis -= sToShift * 1e3;
                    }
                    date = length === 1 && $String(Y) === Y // isString(Y)
                        // We explicitly pass it through parse:
                        ? new NativeDate(DateShim.parse(Y))
                        // We have to manually make calls depending on argument
                        // length here
                        : length >= 7 ? new NativeDate(Y, M, D, h, m, seconds, millis)
                            : length >= 6 ? new NativeDate(Y, M, D, h, m, seconds)
                                : length >= 5 ? new NativeDate(Y, M, D, h, m)
                                    : length >= 4 ? new NativeDate(Y, M, D, h)
                                        : length >= 3 ? new NativeDate(Y, M, D)
                                            : length >= 2 ? new NativeDate(Y, M)
                                                : length >= 1 ? new NativeDate(Y instanceof NativeDate ? +Y : Y)
                                                    : new NativeDate();
                } else {
                    date = NativeDate.apply(this, arguments);
                }
                if (!isPrimitive(date)) {
                    // Prevent mixups with unfixed Date object
                    defineProperties(date, { constructor: DateShim }, true);
                }
                return date;
            };

            // 15.9.1.15 Date Time String Format.
            var isoDateExpression = new RegExp('^'
                + '(\\d{4}|[+-]\\d{6})' // four-digit year capture or sign + 6-digit extended year
                + '(?:-(\\d{2})' // optional month capture
                + '(?:-(\\d{2})' // optional day capture
                + '(?:' // capture hours:minutes:seconds.milliseconds
                    + 'T(\\d{2})' // hours capture
                    + ':(\\d{2})' // minutes capture
                    + '(?:' // optional :seconds.milliseconds
                        + ':(\\d{2})' // seconds capture
                        + '(?:(\\.\\d{1,}))?' // milliseconds capture
                    + ')?'
                + '(' // capture UTC offset component
                    + 'Z|' // UTC capture
                    + '(?:' // offset specifier +/-hours:minutes
                        + '([-+])' // sign capture
                        + '(\\d{2})' // hours offset capture
                        + ':(\\d{2})' // minutes offset capture
                    + ')'
                + ')?)?)?)?'
            + '$');

            var months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];

            var dayFromMonth = function dayFromMonth(year, month) {
                var t = month > 1 ? 1 : 0;
                return (
                    months[month]
                    + Math.floor((year - 1969 + t) / 4)
                    - Math.floor((year - 1901 + t) / 100)
                    + Math.floor((year - 1601 + t) / 400)
                    + (365 * (year - 1970))
                );
            };

            var toUTC = function toUTC(t) {
                var s = 0;
                var ms = t;
                if (hasSafariSignedIntBug && ms > maxSafeUnsigned32Bit) {
                    // work around a Safari 8/9 bug where it treats the seconds as signed
                    var msToShift = Math.floor(ms / maxSafeUnsigned32Bit) * maxSafeUnsigned32Bit;
                    var sToShift = Math.floor(msToShift / 1e3);
                    s += sToShift;
                    ms -= sToShift * 1e3;
                }
                return $Number(new NativeDate(1970, 0, 1, 0, 0, s, ms));
            };

            // Copy any custom methods a 3rd party library may have added
            for (var key in NativeDate) {
                if (owns(NativeDate, key)) {
                    DateShim[key] = NativeDate[key];
                }
            }

            // Copy "native" methods explicitly; they may be non-enumerable
            defineProperties(DateShim, {
                now: NativeDate.now,
                UTC: NativeDate.UTC
            }, true);
            DateShim.prototype = NativeDate.prototype;
            defineProperties(DateShim.prototype, { constructor: DateShim }, true);

            // Upgrade Date.parse to handle simplified ISO 8601 strings
            var parseShim = function parse(string) {
                var match = isoDateExpression.exec(string);
                if (match) {
                    // parse months, days, hours, minutes, seconds, and milliseconds
                    // provide default values if necessary
                    // parse the UTC offset component
                    var year = $Number(match[1]),
                        month = $Number(match[2] || 1) - 1,
                        day = $Number(match[3] || 1) - 1,
                        hour = $Number(match[4] || 0),
                        minute = $Number(match[5] || 0),
                        second = $Number(match[6] || 0),
                        millisecond = Math.floor($Number(match[7] || 0) * 1000),
                        // When time zone is missed, local offset should be used
                        // (ES 5.1 bug)
                        // see https://bugs.ecmascript.org/show_bug.cgi?id=112
                        isLocalTime = Boolean(match[4] && !match[8]),
                        signOffset = match[9] === '-' ? 1 : -1,
                        hourOffset = $Number(match[10] || 0),
                        minuteOffset = $Number(match[11] || 0),
                        result;
                    var hasMinutesOrSecondsOrMilliseconds = minute > 0 || second > 0 || millisecond > 0;
                    if (
                        hour < (hasMinutesOrSecondsOrMilliseconds ? 24 : 25)
                        && minute < 60 && second < 60 && millisecond < 1000
                        && month > -1 && month < 12 && hourOffset < 24
                        && minuteOffset < 60 // detect invalid offsets
                        && day > -1
                        && day < (dayFromMonth(year, month + 1) - dayFromMonth(year, month))
                    ) {
                        result = (
                            ((dayFromMonth(year, month) + day) * 24)
                            + hour
                            + (hourOffset * signOffset)
                        ) * 60;
                        result = ((
                            ((result + minute + (minuteOffset * signOffset)) * 60)
                            + second
                        ) * 1000) + millisecond;
                        if (isLocalTime) {
                            result = toUTC(result);
                        }
                        if (-8.64e15 <= result && result <= 8.64e15) {
                            return result;
                        }
                    }
                    return NaN;
                }
                return NativeDate.parse.apply(this, arguments);
            };
            defineProperties(DateShim, { parse: parseShim });

            return DateShim;
        }(Date));
        /* global Date: false */
    }

    // ES5 15.9.4.4
    // http://es5.github.com/#x15.9.4.4
    if (!Date.now) {
        Date.now = function now() {
            return new Date().getTime();
        };
    }

    //
    // Number
    // ======
    //

    // ES5.1 15.7.4.5
    // http://es5.github.com/#x15.7.4.5
    var hasToFixedBugs = NumberPrototype.toFixed && (
        (0.00008).toFixed(3) !== '0.000'
        || (0.9).toFixed(0) !== '1'
        || (1.255).toFixed(2) !== '1.25'
        || (1000000000000000128).toFixed(0) !== '1000000000000000128'
    );

    var toFixedHelpers = {
        base: 1e7,
        size: 6,
        data: [0, 0, 0, 0, 0, 0],
        multiply: function multiply(n, c) {
            var i = -1;
            var c2 = c;
            while (++i < toFixedHelpers.size) {
                c2 += n * toFixedHelpers.data[i];
                toFixedHelpers.data[i] = c2 % toFixedHelpers.base;
                c2 = Math.floor(c2 / toFixedHelpers.base);
            }
        },
        divide: function divide(n) {
            var i = toFixedHelpers.size;
            var c = 0;
            while (--i >= 0) {
                c += toFixedHelpers.data[i];
                toFixedHelpers.data[i] = Math.floor(c / n);
                c = (c % n) * toFixedHelpers.base;
            }
        },
        numToString: function numToString() {
            var i = toFixedHelpers.size;
            var s = '';
            while (--i >= 0) {
                if (s !== '' || i === 0 || toFixedHelpers.data[i] !== 0) {
                    var t = $String(toFixedHelpers.data[i]);
                    if (s === '') {
                        s = t;
                    } else {
                        s += strSlice('0000000', 0, 7 - t.length) + t;
                    }
                }
            }
            return s;
        },
        pow: function pow(x, n, acc) {
            return (n === 0 ? acc : (n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc)));
        },
        log: function log(x) {
            var n = 0;
            var x2 = x;
            while (x2 >= 4096) {
                n += 12;
                x2 /= 4096;
            }
            while (x2 >= 2) {
                n += 1;
                x2 /= 2;
            }
            return n;
        }
    };

    var toFixedShim = function toFixed(fractionDigits) {
        var f, x, s, m, e, z, j, k;

        // Test for NaN and round fractionDigits down
        f = $Number(fractionDigits);
        f = isActualNaN(f) ? 0 : Math.floor(f);

        if (f < 0 || f > 20) {
            throw new RangeError('Number.toFixed called with invalid number of decimals');
        }

        x = $Number(this);

        if (isActualNaN(x)) {
            return 'NaN';
        }

        // If it is too big or small, return the string value of the number
        if (x <= -1e21 || x >= 1e21) {
            return $String(x);
        }

        s = '';

        if (x < 0) {
            s = '-';
            x = -x;
        }

        m = '0';

        if (x > 1e-21) {
            // 1e-21 < x < 1e21
            // -70 < log2(x) < 70
            e = toFixedHelpers.log(x * toFixedHelpers.pow(2, 69, 1)) - 69;
            z = (e < 0 ? x * toFixedHelpers.pow(2, -e, 1) : x / toFixedHelpers.pow(2, e, 1));
            z *= 0x10000000000000; // Math.pow(2, 52);
            e = 52 - e;

            // -18 < e < 122
            // x = z / 2 ^ e
            if (e > 0) {
                toFixedHelpers.multiply(0, z);
                j = f;

                while (j >= 7) {
                    toFixedHelpers.multiply(1e7, 0);
                    j -= 7;
                }

                toFixedHelpers.multiply(toFixedHelpers.pow(10, j, 1), 0);
                j = e - 1;

                while (j >= 23) {
                    toFixedHelpers.divide(1 << 23);
                    j -= 23;
                }

                toFixedHelpers.divide(1 << j);
                toFixedHelpers.multiply(1, 1);
                toFixedHelpers.divide(2);
                m = toFixedHelpers.numToString();
            } else {
                toFixedHelpers.multiply(0, z);
                toFixedHelpers.multiply(1 << (-e), 0);
                m = toFixedHelpers.numToString() + strSlice('0.00000000000000000000', 2, 2 + f);
            }
        }

        if (f > 0) {
            k = m.length;

            if (k <= f) {
                m = s + strSlice('0.0000000000000000000', 0, f - k + 2) + m;
            } else {
                m = s + strSlice(m, 0, k - f) + '.' + strSlice(m, k - f);
            }
        } else {
            m = s + m;
        }

        return m;
    };
    defineProperties(NumberPrototype, { toFixed: toFixedShim }, hasToFixedBugs);

    var hasToPrecisionUndefinedBug = (function () {
        try {
            return 1.0.toPrecision(undefined) === '1';
        } catch (e) {
            return true;
        }
    }());
    var originalToPrecision = NumberPrototype.toPrecision;
    defineProperties(NumberPrototype, {
        toPrecision: function toPrecision(precision) {
            return typeof precision === 'undefined' ? originalToPrecision.call(this) : originalToPrecision.call(this, precision);
        }
    }, hasToPrecisionUndefinedBug);

    //
    // String
    // ======
    //

    // ES5 15.5.4.14
    // http://es5.github.com/#x15.5.4.14

    // [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
    // Many browsers do not split properly with regular expressions or they
    // do not perform the split correctly under obscure conditions.
    // See http://blog.stevenlevithan.com/archives/cross-browser-split
    // I've tested in many browsers and this seems to cover the deviant ones:
    //    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
    //    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
    //    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
    //       [undefined, "t", undefined, "e", ...]
    //    ''.split(/.?/) should be [], not [""]
    //    '.'.split(/()()/) should be ["."], not ["", "", "."]

    if (
        'ab'.split(/(?:ab)*/).length !== 2
        || '.'.split(/(.?)(.?)/).length !== 4
        || 'tesst'.split(/(s)*/)[1] === 't'
        || 'test'.split(/(?:)/, -1).length !== 4
        || ''.split(/.?/).length
        || '.'.split(/()()/).length > 1
    ) {
        (function () {
            var compliantExecNpcg = typeof (/()??/).exec('')[1] === 'undefined'; // NPCG: nonparticipating capturing group
            var maxSafe32BitInt = Math.pow(2, 32) - 1;

            StringPrototype.split = function (separator, limit) {
                var string = String(this);
                if (typeof separator === 'undefined' && limit === 0) {
                    return [];
                }

                // If `separator` is not a regex, use native split
                if (!isRegex(separator)) {
                    return strSplit(this, separator, limit);
                }

                var output = [];
                var flags = (separator.ignoreCase ? 'i' : '')
                            + (separator.multiline ? 'm' : '')
                            + (separator.unicode ? 'u' : '') // in ES6
                            + (separator.sticky ? 'y' : ''), // Firefox 3+ and ES6
                    lastLastIndex = 0,
                    // Make `global` and avoid `lastIndex` issues by working with a copy
                    separator2, match, lastIndex, lastLength;
                var separatorCopy = new RegExp(separator.source, flags + 'g');
                if (!compliantExecNpcg) {
                    // Doesn't need flags gy, but they don't hurt
                    separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
                }
                /* Values for `limit`, per the spec:
                 * If undefined: 4294967295 // maxSafe32BitInt
                 * If 0, Infinity, or NaN: 0
                 * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
                 * If negative number: 4294967296 - Math.floor(Math.abs(limit))
                 * If other: Type-convert, then use the above rules
                 */
                var splitLimit = typeof limit === 'undefined' ? maxSafe32BitInt : ES.ToUint32(limit);
                match = separatorCopy.exec(string);
                while (match) {
                    // `separatorCopy.lastIndex` is not reliable cross-browser
                    lastIndex = match.index + match[0].length;
                    if (lastIndex > lastLastIndex) {
                        pushCall(output, strSlice(string, lastLastIndex, match.index));
                        // Fix browsers whose `exec` methods don't consistently return `undefined` for
                        // nonparticipating capturing groups
                        if (!compliantExecNpcg && match.length > 1) {
                            /* eslint-disable no-loop-func */
                            match[0].replace(separator2, function () {
                                for (var i = 1; i < arguments.length - 2; i++) {
                                    if (typeof arguments[i] === 'undefined') {
                                        match[i] = void 0;
                                    }
                                }
                            });
                            /* eslint-enable no-loop-func */
                        }
                        if (match.length > 1 && match.index < string.length) {
                            array_push.apply(output, arraySlice(match, 1));
                        }
                        lastLength = match[0].length;
                        lastLastIndex = lastIndex;
                        if (output.length >= splitLimit) {
                            break;
                        }
                    }
                    if (separatorCopy.lastIndex === match.index) {
                        separatorCopy.lastIndex++; // Avoid an infinite loop
                    }
                    match = separatorCopy.exec(string);
                }
                if (lastLastIndex === string.length) {
                    if (lastLength || !separatorCopy.test('')) {
                        pushCall(output, '');
                    }
                } else {
                    pushCall(output, strSlice(string, lastLastIndex));
                }
                return output.length > splitLimit ? arraySlice(output, 0, splitLimit) : output;
            };
        }());

    // [bugfix, chrome]
    // If separator is undefined, then the result array contains just one String,
    // which is the this value (converted to a String). If limit is not undefined,
    // then the output array is truncated so that it contains no more than limit
    // elements.
    // "0".split(undefined, 0) -> []
    } else if ('0'.split(void 0, 0).length) {
        StringPrototype.split = function split(separator, limit) {
            if (typeof separator === 'undefined' && limit === 0) {
                return [];
            }
            return strSplit(this, separator, limit);
        };
    }

    var str_replace = StringPrototype.replace;
    var replaceReportsGroupsCorrectly = (function () {
        var groups = [];
        'x'.replace(/x(.)?/g, function (match, group) {
            pushCall(groups, group);
        });
        return groups.length === 1 && typeof groups[0] === 'undefined';
    }());

    if (!replaceReportsGroupsCorrectly) {
        StringPrototype.replace = function replace(searchValue, replaceValue) {
            var isFn = isCallable(replaceValue);
            var hasCapturingGroups = isRegex(searchValue) && (/\)[*?]/).test(searchValue.source);
            if (!isFn || !hasCapturingGroups) {
                return str_replace.call(this, searchValue, replaceValue);
            } else {
                var wrappedReplaceValue = function (match) {
                    var length = arguments.length;
                    var originalLastIndex = searchValue.lastIndex;
                    searchValue.lastIndex = 0;
                    var args = searchValue.exec(match) || [];
                    searchValue.lastIndex = originalLastIndex;
                    pushCall(args, arguments[length - 2], arguments[length - 1]);
                    return replaceValue.apply(this, args);
                };
                return str_replace.call(this, searchValue, wrappedReplaceValue);
            }
        };
    }

    // ECMA-262, 3rd B.2.3
    // Not an ECMAScript standard, although ECMAScript 3rd Edition has a
    // non-normative section suggesting uniform semantics and it should be
    // normalized across all browsers
    // [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
    var string_substr = StringPrototype.substr;
    var hasNegativeSubstrBug = ''.substr && '0b'.substr(-1) !== 'b';
    defineProperties(StringPrototype, {
        substr: function substr(start, length) {
            var normalizedStart = start;
            if (start < 0) {
                normalizedStart = max(this.length + start, 0);
            }
            return string_substr.call(this, normalizedStart, length);
        }
    }, hasNegativeSubstrBug);

    // ES5 15.5.4.20
    // whitespace from: http://es5.github.io/#x15.5.4.20
    var ws = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003'
        + '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028'
        + '\u2029\uFEFF';
    var zeroWidth = '\u200b';
    var wsRegexChars = '[' + ws + ']';
    var trimBeginRegexp = new RegExp('^' + wsRegexChars + wsRegexChars + '*');
    var trimEndRegexp = new RegExp(wsRegexChars + wsRegexChars + '*$');
    var hasTrimWhitespaceBug = StringPrototype.trim && (ws.trim() || !zeroWidth.trim());
    defineProperties(StringPrototype, {
        // http://blog.stevenlevithan.com/archives/faster-trim-javascript
        // http://perfectionkills.com/whitespace-deviations/
        trim: function trim() {
            if (typeof this === 'undefined' || this === null) {
                throw new TypeError("can't convert " + this + ' to object');
            }
            return $String(this).replace(trimBeginRegexp, '').replace(trimEndRegexp, '');
        }
    }, hasTrimWhitespaceBug);
    var trim = call.bind(String.prototype.trim);

    var hasLastIndexBug = StringPrototype.lastIndexOf && 'abcあい'.lastIndexOf('あい', 2) !== -1;
    defineProperties(StringPrototype, {
        lastIndexOf: function lastIndexOf(searchString) {
            if (typeof this === 'undefined' || this === null) {
                throw new TypeError("can't convert " + this + ' to object');
            }
            var S = $String(this);
            var searchStr = $String(searchString);
            var numPos = arguments.length > 1 ? $Number(arguments[1]) : NaN;
            var pos = isActualNaN(numPos) ? Infinity : ES.ToInteger(numPos);
            var start = min(max(pos, 0), S.length);
            var searchLen = searchStr.length;
            var k = start + searchLen;
            while (k > 0) {
                k = max(0, k - searchLen);
                var index = strIndexOf(strSlice(S, k, start + searchLen), searchStr);
                if (index !== -1) {
                    return k + index;
                }
            }
            return -1;
        }
    }, hasLastIndexBug);

    var originalLastIndexOf = StringPrototype.lastIndexOf;
    defineProperties(StringPrototype, {
        lastIndexOf: function lastIndexOf(searchString) {
            return originalLastIndexOf.apply(this, arguments);
        }
    }, StringPrototype.lastIndexOf.length !== 1);

    // ES-5 15.1.2.2
    // eslint-disable-next-line radix
    if (parseInt(ws + '08') !== 8 || parseInt(ws + '0x16') !== 22) {
        /* global parseInt: true */
        parseInt = (function (origParseInt) {
            var hexRegex = /^[-+]?0[xX]/;
            return function parseInt(str, radix) {
                var string = trim(String(str));
                var defaultedRadix = $Number(radix) || (hexRegex.test(string) ? 16 : 10);
                return origParseInt(string, defaultedRadix);
            };
        }(parseInt));
    }

    // https://es5.github.io/#x15.1.2.3
    if (1 / parseFloat('-0') !== -Infinity) {
        /* global parseFloat: true */
        parseFloat = (function (origParseFloat) {
            return function parseFloat(string) {
                var inputString = trim(String(string));
                var result = origParseFloat(inputString);
                return result === 0 && strSlice(inputString, 0, 1) === '-' ? -0 : result;
            };
        }(parseFloat));
    }

    if (String(new RangeError('test')) !== 'RangeError: test') {
        var errorToStringShim = function toString() {
            if (typeof this === 'undefined' || this === null) {
                throw new TypeError("can't convert " + this + ' to object');
            }
            var name = this.name;
            if (typeof name === 'undefined') {
                name = 'Error';
            } else if (typeof name !== 'string') {
                name = $String(name);
            }
            var msg = this.message;
            if (typeof msg === 'undefined') {
                msg = '';
            } else if (typeof msg !== 'string') {
                msg = $String(msg);
            }
            if (!name) {
                return msg;
            }
            if (!msg) {
                return name;
            }
            return name + ': ' + msg;
        };
        // can't use defineProperties here because of toString enumeration issue in IE <= 8
        Error.prototype.toString = errorToStringShim;
    }

    if (supportsDescriptors) {
        var ensureNonEnumerable = function (obj, prop) {
            if (isEnum(obj, prop)) {
                var desc = Object.getOwnPropertyDescriptor(obj, prop);
                if (desc.configurable) {
                    desc.enumerable = false;
                    Object.defineProperty(obj, prop, desc);
                }
            }
        };
        ensureNonEnumerable(Error.prototype, 'message');
        if (Error.prototype.message !== '') {
            Error.prototype.message = '';
        }
        ensureNonEnumerable(Error.prototype, 'name');
    }

    if (String(/a/mig) !== '/a/gim') {
        var regexToString = function toString() {
            var str = '/' + this.source + '/';
            if (this.global) {
                str += 'g';
            }
            if (this.ignoreCase) {
                str += 'i';
            }
            if (this.multiline) {
                str += 'm';
            }
            return str;
        };
        // can't use defineProperties here because of toString enumeration issue in IE <= 8
        RegExp.prototype.toString = regexToString;
    }
}));
/*
 A JavaScript implementation of the SHA family of hashes, as
 defined in FIPS PUB 180-4 and FIPS PUB 202, as well as the corresponding
 HMAC implementation as defined in FIPS PUB 198a

 Copyright Brian Turek 2008-2017
 Distributed under the BSD License
 See http://caligatio.github.com/jsSHA/ for more information
 See https://github.com/Caligatio/jsSHA for source

 Several functions taken from Paul Johnston
*/
'use strict';(function(I){function w(c,a,d){var l=0,b=[],g=0,f,n,k,e,h,q,y,p,m=!1,t=[],r=[],u,z=!1;d=d||{};f=d.encoding||"UTF8";u=d.numRounds||1;if(u!==parseInt(u,10)||1>u)throw Error("numRounds must a integer >= 1");if(0===c.lastIndexOf("SHA-",0))if(q=function(b,a){return A(b,a,c)},y=function(b,a,l,f){var g,e;if("SHA-224"===c||"SHA-256"===c)g=(a+65>>>9<<4)+15,e=16;else throw Error("Unexpected error in SHA-2 implementation");for(;b.length<=g;)b.push(0);b[a>>>5]|=128<<24-a%32;a=a+l;b[g]=a&4294967295;
b[g-1]=a/4294967296|0;l=b.length;for(a=0;a<l;a+=e)f=A(b.slice(a,a+e),f,c);if("SHA-224"===c)b=[f[0],f[1],f[2],f[3],f[4],f[5],f[6]];else if("SHA-256"===c)b=f;else throw Error("Unexpected error in SHA-2 implementation");return b},p=function(b){return b.slice()},"SHA-224"===c)h=512,e=224;else if("SHA-256"===c)h=512,e=256;else throw Error("Chosen SHA variant is not supported");else throw Error("Chosen SHA variant is not supported");k=B(a,f);n=x(c);this.setHMACKey=function(b,a,g){var e;if(!0===m)throw Error("HMAC key already set");
if(!0===z)throw Error("Cannot set HMAC key after calling update");f=(g||{}).encoding||"UTF8";a=B(a,f)(b);b=a.binLen;a=a.value;e=h>>>3;g=e/4-1;if(e<b/8){for(a=y(a,b,0,x(c));a.length<=g;)a.push(0);a[g]&=4294967040}else if(e>b/8){for(;a.length<=g;)a.push(0);a[g]&=4294967040}for(b=0;b<=g;b+=1)t[b]=a[b]^909522486,r[b]=a[b]^1549556828;n=q(t,n);l=h;m=!0};this.update=function(a){var c,f,e,d=0,p=h>>>5;c=k(a,b,g);a=c.binLen;f=c.value;c=a>>>5;for(e=0;e<c;e+=p)d+h<=a&&(n=q(f.slice(e,e+p),n),d+=h);l+=d;b=f.slice(d>>>
5);g=a%h;z=!0};this.getHash=function(a,f){var d,h,k,q;if(!0===m)throw Error("Cannot call getHash after setting HMAC key");k=C(f);switch(a){case "HEX":d=function(a){return D(a,e,k)};break;case "B64":d=function(a){return E(a,e,k)};break;case "BYTES":d=function(a){return F(a,e)};break;case "ARRAYBUFFER":try{h=new ArrayBuffer(0)}catch(v){throw Error("ARRAYBUFFER not supported by this environment");}d=function(a){return G(a,e)};break;default:throw Error("format must be HEX, B64, BYTES, or ARRAYBUFFER");
}q=y(b.slice(),g,l,p(n));for(h=1;h<u;h+=1)q=y(q,e,0,x(c));return d(q)};this.getHMAC=function(a,f){var d,k,t,u;if(!1===m)throw Error("Cannot call getHMAC without first setting HMAC key");t=C(f);switch(a){case "HEX":d=function(a){return D(a,e,t)};break;case "B64":d=function(a){return E(a,e,t)};break;case "BYTES":d=function(a){return F(a,e)};break;case "ARRAYBUFFER":try{d=new ArrayBuffer(0)}catch(v){throw Error("ARRAYBUFFER not supported by this environment");}d=function(a){return G(a,e)};break;default:throw Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER");
}k=y(b.slice(),g,l,p(n));u=q(r,x(c));u=y(k,e,h,u);return d(u)}}function m(){}function D(c,a,d){var l="";a/=8;var b,g;for(b=0;b<a;b+=1)g=c[b>>>2]>>>8*(3+b%4*-1),l+="0123456789abcdef".charAt(g>>>4&15)+"0123456789abcdef".charAt(g&15);return d.outputUpper?l.toUpperCase():l}function E(c,a,d){var l="",b=a/8,g,f,n;for(g=0;g<b;g+=3)for(f=g+1<b?c[g+1>>>2]:0,n=g+2<b?c[g+2>>>2]:0,n=(c[g>>>2]>>>8*(3+g%4*-1)&255)<<16|(f>>>8*(3+(g+1)%4*-1)&255)<<8|n>>>8*(3+(g+2)%4*-1)&255,f=0;4>f;f+=1)8*g+6*f<=a?l+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(n>>>
6*(3-f)&63):l+=d.b64Pad;return l}function F(c,a){var d="",l=a/8,b,g;for(b=0;b<l;b+=1)g=c[b>>>2]>>>8*(3+b%4*-1)&255,d+=String.fromCharCode(g);return d}function G(c,a){var d=a/8,l,b=new ArrayBuffer(d),g;g=new Uint8Array(b);for(l=0;l<d;l+=1)g[l]=c[l>>>2]>>>8*(3+l%4*-1)&255;return b}function C(c){var a={outputUpper:!1,b64Pad:"=",shakeLen:-1};c=c||{};a.outputUpper=c.outputUpper||!1;!0===c.hasOwnProperty("b64Pad")&&(a.b64Pad=c.b64Pad);if("boolean"!==typeof a.outputUpper)throw Error("Invalid outputUpper formatting option");
if("string"!==typeof a.b64Pad)throw Error("Invalid b64Pad formatting option");return a}function B(c,a){var d;switch(a){case "UTF8":case "UTF16BE":case "UTF16LE":break;default:throw Error("encoding must be UTF8, UTF16BE, or UTF16LE");}switch(c){case "HEX":d=function(a,b,c){var f=a.length,d,k,e,h,q;if(0!==f%2)throw Error("String of HEX type must be in byte increments");b=b||[0];c=c||0;q=c>>>3;for(d=0;d<f;d+=2){k=parseInt(a.substr(d,2),16);if(isNaN(k))throw Error("String of HEX type contains invalid characters");
h=(d>>>1)+q;for(e=h>>>2;b.length<=e;)b.push(0);b[e]|=k<<8*(3+h%4*-1)}return{value:b,binLen:4*f+c}};break;case "TEXT":d=function(c,b,d){var f,n,k=0,e,h,q,m,p,r;b=b||[0];d=d||0;q=d>>>3;if("UTF8"===a)for(r=3,e=0;e<c.length;e+=1)for(f=c.charCodeAt(e),n=[],128>f?n.push(f):2048>f?(n.push(192|f>>>6),n.push(128|f&63)):55296>f||57344<=f?n.push(224|f>>>12,128|f>>>6&63,128|f&63):(e+=1,f=65536+((f&1023)<<10|c.charCodeAt(e)&1023),n.push(240|f>>>18,128|f>>>12&63,128|f>>>6&63,128|f&63)),h=0;h<n.length;h+=1){p=k+
q;for(m=p>>>2;b.length<=m;)b.push(0);b[m]|=n[h]<<8*(r+p%4*-1);k+=1}else if("UTF16BE"===a||"UTF16LE"===a)for(r=2,n="UTF16LE"===a&&!0||"UTF16LE"!==a&&!1,e=0;e<c.length;e+=1){f=c.charCodeAt(e);!0===n&&(h=f&255,f=h<<8|f>>>8);p=k+q;for(m=p>>>2;b.length<=m;)b.push(0);b[m]|=f<<8*(r+p%4*-1);k+=2}return{value:b,binLen:8*k+d}};break;case "B64":d=function(a,b,c){var f=0,d,k,e,h,q,m,p;if(-1===a.search(/^[a-zA-Z0-9=+\/]+$/))throw Error("Invalid character in base-64 string");k=a.indexOf("=");a=a.replace(/\=/g,
"");if(-1!==k&&k<a.length)throw Error("Invalid '=' found in base-64 string");b=b||[0];c=c||0;m=c>>>3;for(k=0;k<a.length;k+=4){q=a.substr(k,4);for(e=h=0;e<q.length;e+=1)d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(q[e]),h|=d<<18-6*e;for(e=0;e<q.length-1;e+=1){p=f+m;for(d=p>>>2;b.length<=d;)b.push(0);b[d]|=(h>>>16-8*e&255)<<8*(3+p%4*-1);f+=1}}return{value:b,binLen:8*f+c}};break;case "BYTES":d=function(a,b,c){var d,n,k,e,h;b=b||[0];c=c||0;k=c>>>3;for(n=0;n<a.length;n+=
1)d=a.charCodeAt(n),h=n+k,e=h>>>2,b.length<=e&&b.push(0),b[e]|=d<<8*(3+h%4*-1);return{value:b,binLen:8*a.length+c}};break;case "ARRAYBUFFER":try{d=new ArrayBuffer(0)}catch(l){throw Error("ARRAYBUFFER not supported by this environment");}d=function(a,b,c){var d,n,k,e,h;b=b||[0];c=c||0;n=c>>>3;h=new Uint8Array(a);for(d=0;d<a.byteLength;d+=1)e=d+n,k=e>>>2,b.length<=k&&b.push(0),b[k]|=h[d]<<8*(3+e%4*-1);return{value:b,binLen:8*a.byteLength+c}};break;default:throw Error("format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER");
}return d}function r(c,a){return c>>>a|c<<32-a}function J(c,a,d){return c&a^~c&d}function K(c,a,d){return c&a^c&d^a&d}function L(c){return r(c,2)^r(c,13)^r(c,22)}function M(c){return r(c,6)^r(c,11)^r(c,25)}function N(c){return r(c,7)^r(c,18)^c>>>3}function O(c){return r(c,17)^r(c,19)^c>>>10}function P(c,a){var d=(c&65535)+(a&65535);return((c>>>16)+(a>>>16)+(d>>>16)&65535)<<16|d&65535}function Q(c,a,d,l){var b=(c&65535)+(a&65535)+(d&65535)+(l&65535);return((c>>>16)+(a>>>16)+(d>>>16)+(l>>>16)+(b>>>
16)&65535)<<16|b&65535}function R(c,a,d,l,b){var g=(c&65535)+(a&65535)+(d&65535)+(l&65535)+(b&65535);return((c>>>16)+(a>>>16)+(d>>>16)+(l>>>16)+(b>>>16)+(g>>>16)&65535)<<16|g&65535}function x(c){var a=[],d;if(0===c.lastIndexOf("SHA-",0))switch(a=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428],d=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],c){case "SHA-224":break;case "SHA-256":a=d;break;case "SHA-384":a=[new m,new m,
new m,new m,new m,new m,new m,new m];break;case "SHA-512":a=[new m,new m,new m,new m,new m,new m,new m,new m];break;default:throw Error("Unknown SHA variant");}else throw Error("No SHA variants supported");return a}function A(c,a,d){var l,b,g,f,n,k,e,h,m,r,p,w,t,x,u,z,A,B,C,D,E,F,v=[],G;if("SHA-224"===d||"SHA-256"===d)r=64,w=1,F=Number,t=P,x=Q,u=R,z=N,A=O,B=L,C=M,E=K,D=J,G=H;else throw Error("Unexpected error in SHA-2 implementation");d=a[0];l=a[1];b=a[2];g=a[3];f=a[4];n=a[5];k=a[6];e=a[7];for(p=
0;p<r;p+=1)16>p?(m=p*w,h=c.length<=m?0:c[m],m=c.length<=m+1?0:c[m+1],v[p]=new F(h,m)):v[p]=x(A(v[p-2]),v[p-7],z(v[p-15]),v[p-16]),h=u(e,C(f),D(f,n,k),G[p],v[p]),m=t(B(d),E(d,l,b)),e=k,k=n,n=f,f=t(g,h),g=b,b=l,l=d,d=t(h,m);a[0]=t(d,a[0]);a[1]=t(l,a[1]);a[2]=t(b,a[2]);a[3]=t(g,a[3]);a[4]=t(f,a[4]);a[5]=t(n,a[5]);a[6]=t(k,a[6]);a[7]=t(e,a[7]);return a}var H;H=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,
2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,
2756734187,3204031479,3329325298];"function"===typeof define&&define.amd?define(function(){return w}):"undefined"!==typeof exports?("undefined"!==typeof module&&module.exports&&(module.exports=w),exports=w):I.jsSHA=w})(this);
(function(){

    // Copyright (c) 2005  Tom Wu
    // All Rights Reserved.
    // See "LICENSE" for details.

    // Basic JavaScript BN library - subset useful for RSA encryption.

    // Bits per digit
    var dbits;

    // JavaScript engine analysis
    var canary = 0xdeadbeefcafe;
    var j_lm = ((canary&0xffffff)==0xefcafe);

    // (public) Constructor
    function BigInteger(a,b,c) {
      if(a != null)
        if("number" == typeof a) this.fromNumber(a,b,c);
        else if(b == null && "string" != typeof a) this.fromString(a,256);
        else this.fromString(a,b);
    }

    // return new, unset BigInteger
    function nbi() { return new BigInteger(null); }

    // am: Compute w_j += (x*this_i), propagate carries,
    // c is initial carry, returns final carry.
    // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
    // We need to select the fastest one that works in this environment.

    // am1: use a single mult and divide to get the high bits,
    // max digit bits should be 26 because
    // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
    function am1(i,x,w,j,c,n) {
      while(--n >= 0) {
        var v = x*this[i++]+w[j]+c;
        c = Math.floor(v/0x4000000);
        w[j++] = v&0x3ffffff;
      }
      return c;
    }
    // am2 avoids a big mult-and-extract completely.
    // Max digit bits should be <= 30 because we do bitwise ops
    // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
    function am2(i,x,w,j,c,n) {
      var xl = x&0x7fff, xh = x>>15;
      while(--n >= 0) {
        var l = this[i]&0x7fff;
        var h = this[i++]>>15;
        var m = xh*l+h*xl;
        l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
        c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
        w[j++] = l&0x3fffffff;
      }
      return c;
    }
    // Alternately, set max digit bits to 28 since some
    // browsers slow down when dealing with 32-bit numbers.
    function am3(i,x,w,j,c,n) {
      var xl = x&0x3fff, xh = x>>14;
      while(--n >= 0) {
        var l = this[i]&0x3fff;
        var h = this[i++]>>14;
        var m = xh*l+h*xl;
        l = xl*l+((m&0x3fff)<<14)+w[j]+c;
        c = (l>>28)+(m>>14)+xh*h;
        w[j++] = l&0xfffffff;
      }
      return c;
    }
    var inBrowser = typeof navigator !== "undefined";
    if(inBrowser && j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
      BigInteger.prototype.am = am2;
      dbits = 30;
    }
    else if(inBrowser && j_lm && (navigator.appName != "Netscape")) {
      BigInteger.prototype.am = am1;
      dbits = 26;
    }
    else { // Mozilla/Netscape seems to prefer am3
      BigInteger.prototype.am = am3;
      dbits = 28;
    }

    BigInteger.prototype.DB = dbits;
    BigInteger.prototype.DM = ((1<<dbits)-1);
    BigInteger.prototype.DV = (1<<dbits);

    var BI_FP = 52;
    BigInteger.prototype.FV = Math.pow(2,BI_FP);
    BigInteger.prototype.F1 = BI_FP-dbits;
    BigInteger.prototype.F2 = 2*dbits-BI_FP;

    // Digit conversions
    var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
    var BI_RC = new Array();
    var rr,vv;
    rr = "0".charCodeAt(0);
    for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
    rr = "a".charCodeAt(0);
    for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
    rr = "A".charCodeAt(0);
    for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

    function int2char(n) { return BI_RM.charAt(n); }
    function intAt(s,i) {
      var c = BI_RC[s.charCodeAt(i)];
      return (c==null)?-1:c;
    }

    // (protected) copy this to r
    function bnpCopyTo(r) {
      for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
      r.t = this.t;
      r.s = this.s;
    }

    // (protected) set from integer value x, -DV <= x < DV
    function bnpFromInt(x) {
      this.t = 1;
      this.s = (x<0)?-1:0;
      if(x > 0) this[0] = x;
      else if(x < -1) this[0] = x+this.DV;
      else this.t = 0;
    }

    // return bigint initialized to value
    function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

    // (protected) set from string and radix
    function bnpFromString(s,b) {
      var k;
      if(b == 16) k = 4;
      else if(b == 8) k = 3;
      else if(b == 256) k = 8; // byte array
      else if(b == 2) k = 1;
      else if(b == 32) k = 5;
      else if(b == 4) k = 2;
      else { this.fromRadix(s,b); return; }
      this.t = 0;
      this.s = 0;
      var i = s.length, mi = false, sh = 0;
      while(--i >= 0) {
        var x = (k==8)?s[i]&0xff:intAt(s,i);
        if(x < 0) {
          if(s.charAt(i) == "-") mi = true;
          continue;
        }
        mi = false;
        if(sh == 0)
          this[this.t++] = x;
        else if(sh+k > this.DB) {
          this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
          this[this.t++] = (x>>(this.DB-sh));
        }
        else
          this[this.t-1] |= x<<sh;
        sh += k;
        if(sh >= this.DB) sh -= this.DB;
      }
      if(k == 8 && (s[0]&0x80) != 0) {
        this.s = -1;
        if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
      }
      this.clamp();
      if(mi) BigInteger.ZERO.subTo(this,this);
    }

    // (protected) clamp off excess high words
    function bnpClamp() {
      var c = this.s&this.DM;
      while(this.t > 0 && this[this.t-1] == c) --this.t;
    }

    // (public) return string representation in given radix
    function bnToString(b) {
      if(this.s < 0) return "-"+this.negate().toString(b);
      var k;
      if(b == 16) k = 4;
      else if(b == 8) k = 3;
      else if(b == 2) k = 1;
      else if(b == 32) k = 5;
      else if(b == 4) k = 2;
      else return this.toRadix(b);
      var km = (1<<k)-1, d, m = false, r = "", i = this.t;
      var p = this.DB-(i*this.DB)%k;
      if(i-- > 0) {
        if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
        while(i >= 0) {
          if(p < k) {
            d = (this[i]&((1<<p)-1))<<(k-p);
            d |= this[--i]>>(p+=this.DB-k);
          }
          else {
            d = (this[i]>>(p-=k))&km;
            if(p <= 0) { p += this.DB; --i; }
          }
          if(d > 0) m = true;
          if(m) r += int2char(d);
        }
      }
      return m?r:"0";
    }

    // (public) -this
    function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

    // (public) |this|
    function bnAbs() { return (this.s<0)?this.negate():this; }

    // (public) return + if this > a, - if this < a, 0 if equal
    function bnCompareTo(a) {
      var r = this.s-a.s;
      if(r != 0) return r;
      var i = this.t;
      r = i-a.t;
      if(r != 0) return (this.s<0)?-r:r;
      while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
      return 0;
    }

    // returns bit length of the integer x
    function nbits(x) {
      var r = 1, t;
      if((t=x>>>16) != 0) { x = t; r += 16; }
      if((t=x>>8) != 0) { x = t; r += 8; }
      if((t=x>>4) != 0) { x = t; r += 4; }
      if((t=x>>2) != 0) { x = t; r += 2; }
      if((t=x>>1) != 0) { x = t; r += 1; }
      return r;
    }

    // (public) return the number of bits in "this"
    function bnBitLength() {
      if(this.t <= 0) return 0;
      return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
    }

    // (protected) r = this << n*DB
    function bnpDLShiftTo(n,r) {
      var i;
      for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
      for(i = n-1; i >= 0; --i) r[i] = 0;
      r.t = this.t+n;
      r.s = this.s;
    }

    // (protected) r = this >> n*DB
    function bnpDRShiftTo(n,r) {
      for(var i = n; i < this.t; ++i) r[i-n] = this[i];
      r.t = Math.max(this.t-n,0);
      r.s = this.s;
    }

    // (protected) r = this << n
    function bnpLShiftTo(n,r) {
      var bs = n%this.DB;
      var cbs = this.DB-bs;
      var bm = (1<<cbs)-1;
      var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
      for(i = this.t-1; i >= 0; --i) {
        r[i+ds+1] = (this[i]>>cbs)|c;
        c = (this[i]&bm)<<bs;
      }
      for(i = ds-1; i >= 0; --i) r[i] = 0;
      r[ds] = c;
      r.t = this.t+ds+1;
      r.s = this.s;
      r.clamp();
    }

    // (protected) r = this >> n
    function bnpRShiftTo(n,r) {
      r.s = this.s;
      var ds = Math.floor(n/this.DB);
      if(ds >= this.t) { r.t = 0; return; }
      var bs = n%this.DB;
      var cbs = this.DB-bs;
      var bm = (1<<bs)-1;
      r[0] = this[ds]>>bs;
      for(var i = ds+1; i < this.t; ++i) {
        r[i-ds-1] |= (this[i]&bm)<<cbs;
        r[i-ds] = this[i]>>bs;
      }
      if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
      r.t = this.t-ds;
      r.clamp();
    }

    // (protected) r = this - a
    function bnpSubTo(a,r) {
      var i = 0, c = 0, m = Math.min(a.t,this.t);
      while(i < m) {
        c += this[i]-a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      if(a.t < this.t) {
        c -= a.s;
        while(i < this.t) {
          c += this[i];
          r[i++] = c&this.DM;
          c >>= this.DB;
        }
        c += this.s;
      }
      else {
        c += this.s;
        while(i < a.t) {
          c -= a[i];
          r[i++] = c&this.DM;
          c >>= this.DB;
        }
        c -= a.s;
      }
      r.s = (c<0)?-1:0;
      if(c < -1) r[i++] = this.DV+c;
      else if(c > 0) r[i++] = c;
      r.t = i;
      r.clamp();
    }

    // (protected) r = this * a, r != this,a (HAC 14.12)
    // "this" should be the larger one if appropriate.
    function bnpMultiplyTo(a,r) {
      var x = this.abs(), y = a.abs();
      var i = x.t;
      r.t = i+y.t;
      while(--i >= 0) r[i] = 0;
      for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
      r.s = 0;
      r.clamp();
      if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
    }

    // (protected) r = this^2, r != this (HAC 14.16)
    function bnpSquareTo(r) {
      var x = this.abs();
      var i = r.t = 2*x.t;
      while(--i >= 0) r[i] = 0;
      for(i = 0; i < x.t-1; ++i) {
        var c = x.am(i,x[i],r,2*i,0,1);
        if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
          r[i+x.t] -= x.DV;
          r[i+x.t+1] = 1;
        }
      }
      if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
      r.s = 0;
      r.clamp();
    }

    // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
    // r != q, this != m.  q or r may be null.
    function bnpDivRemTo(m,q,r) {
      var pm = m.abs();
      if(pm.t <= 0) return;
      var pt = this.abs();
      if(pt.t < pm.t) {
        if(q != null) q.fromInt(0);
        if(r != null) this.copyTo(r);
        return;
      }
      if(r == null) r = nbi();
      var y = nbi(), ts = this.s, ms = m.s;
      var nsh = this.DB-nbits(pm[pm.t-1]);   // normalize modulus
      if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
      else { pm.copyTo(y); pt.copyTo(r); }
      var ys = y.t;
      var y0 = y[ys-1];
      if(y0 == 0) return;
      var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
      var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
      var i = r.t, j = i-ys, t = (q==null)?nbi():q;
      y.dlShiftTo(j,t);
      if(r.compareTo(t) >= 0) {
        r[r.t++] = 1;
        r.subTo(t,r);
      }
      BigInteger.ONE.dlShiftTo(ys,t);
      t.subTo(y,y);  // "negative" y so we can replace sub with am later
      while(y.t < ys) y[y.t++] = 0;
      while(--j >= 0) {
        // Estimate quotient digit
        var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
        if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {   // Try it out
          y.dlShiftTo(j,t);
          r.subTo(t,r);
          while(r[i] < --qd) r.subTo(t,r);
        }
      }
      if(q != null) {
        r.drShiftTo(ys,q);
        if(ts != ms) BigInteger.ZERO.subTo(q,q);
      }
      r.t = ys;
      r.clamp();
      if(nsh > 0) r.rShiftTo(nsh,r); // Denormalize remainder
      if(ts < 0) BigInteger.ZERO.subTo(r,r);
    }

    // (public) this mod a
    function bnMod(a) {
      var r = nbi();
      this.abs().divRemTo(a,null,r);
      if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
      return r;
    }

    // Modular reduction using "classic" algorithm
    function Classic(m) { this.m = m; }
    function cConvert(x) {
      if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
      else return x;
    }
    function cRevert(x) { return x; }
    function cReduce(x) { x.divRemTo(this.m,null,x); }
    function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
    function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

    Classic.prototype.convert = cConvert;
    Classic.prototype.revert = cRevert;
    Classic.prototype.reduce = cReduce;
    Classic.prototype.mulTo = cMulTo;
    Classic.prototype.sqrTo = cSqrTo;

    // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
    // justification:
    //         xy == 1 (mod m)
    //         xy =  1+km
    //   xy(2-xy) = (1+km)(1-km)
    // x[y(2-xy)] = 1-k^2m^2
    // x[y(2-xy)] == 1 (mod m^2)
    // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
    // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
    // JS multiply "overflows" differently from C/C++, so care is needed here.
    function bnpInvDigit() {
      if(this.t < 1) return 0;
      var x = this[0];
      if((x&1) == 0) return 0;
      var y = x&3;       // y == 1/x mod 2^2
      y = (y*(2-(x&0xf)*y))&0xf; // y == 1/x mod 2^4
      y = (y*(2-(x&0xff)*y))&0xff;   // y == 1/x mod 2^8
      y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;    // y == 1/x mod 2^16
      // last step - calculate inverse mod DV directly;
      // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
      y = (y*(2-x*y%this.DV))%this.DV;       // y == 1/x mod 2^dbits
      // we really want the negative inverse, and -DV < y < DV
      return (y>0)?this.DV-y:-y;
    }

    // Montgomery reduction
    function Montgomery(m) {
      this.m = m;
      this.mp = m.invDigit();
      this.mpl = this.mp&0x7fff;
      this.mph = this.mp>>15;
      this.um = (1<<(m.DB-15))-1;
      this.mt2 = 2*m.t;
    }

    // xR mod m
    function montConvert(x) {
      var r = nbi();
      x.abs().dlShiftTo(this.m.t,r);
      r.divRemTo(this.m,null,r);
      if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
      return r;
    }

    // x/R mod m
    function montRevert(x) {
      var r = nbi();
      x.copyTo(r);
      this.reduce(r);
      return r;
    }

    // x = x/R mod m (HAC 14.32)
    function montReduce(x) {
      while(x.t <= this.mt2) // pad x so am has enough room later
        x[x.t++] = 0;
      for(var i = 0; i < this.m.t; ++i) {
        // faster way of calculating u0 = x[i]*mp mod DV
        var j = x[i]&0x7fff;
        var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
        // use am to combine the multiply-shift-add into one call
        j = i+this.m.t;
        x[j] += this.m.am(0,u0,x,i,0,this.m.t);
        // propagate carry
        while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
      }
      x.clamp();
      x.drShiftTo(this.m.t,x);
      if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
    }

    // r = "x^2/R mod m"; x != r
    function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

    // r = "xy/R mod m"; x,y != r
    function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

    Montgomery.prototype.convert = montConvert;
    Montgomery.prototype.revert = montRevert;
    Montgomery.prototype.reduce = montReduce;
    Montgomery.prototype.mulTo = montMulTo;
    Montgomery.prototype.sqrTo = montSqrTo;

    // (protected) true iff this is even
    function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }

    // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
    function bnpExp(e,z) {
      if(e > 0xffffffff || e < 1) return BigInteger.ONE;
      var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
      g.copyTo(r);
      while(--i >= 0) {
        z.sqrTo(r,r2);
        if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
        else { var t = r; r = r2; r2 = t; }
      }
      return z.revert(r);
    }

    // (public) this^e % m, 0 <= e < 2^32
    function bnModPowInt(e,m) {
      var z;
      if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
      return this.exp(e,z);
    }

    // protected
    BigInteger.prototype.copyTo = bnpCopyTo;
    BigInteger.prototype.fromInt = bnpFromInt;
    BigInteger.prototype.fromString = bnpFromString;
    BigInteger.prototype.clamp = bnpClamp;
    BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
    BigInteger.prototype.drShiftTo = bnpDRShiftTo;
    BigInteger.prototype.lShiftTo = bnpLShiftTo;
    BigInteger.prototype.rShiftTo = bnpRShiftTo;
    BigInteger.prototype.subTo = bnpSubTo;
    BigInteger.prototype.multiplyTo = bnpMultiplyTo;
    BigInteger.prototype.squareTo = bnpSquareTo;
    BigInteger.prototype.divRemTo = bnpDivRemTo;
    BigInteger.prototype.invDigit = bnpInvDigit;
    BigInteger.prototype.isEven = bnpIsEven;
    BigInteger.prototype.exp = bnpExp;

    // public
    BigInteger.prototype.toString = bnToString;
    BigInteger.prototype.negate = bnNegate;
    BigInteger.prototype.abs = bnAbs;
    BigInteger.prototype.compareTo = bnCompareTo;
    BigInteger.prototype.bitLength = bnBitLength;
    BigInteger.prototype.mod = bnMod;
    BigInteger.prototype.modPowInt = bnModPowInt;

    // "constants"
    BigInteger.ZERO = nbv(0);
    BigInteger.ONE = nbv(1);

    // Copyright (c) 2005-2009  Tom Wu
    // All Rights Reserved.
    // See "LICENSE" for details.

    // Extended JavaScript BN functions, required for RSA private ops.

    // Version 1.1: new BigInteger("0", 10) returns "proper" zero
    // Version 1.2: square() API, isProbablePrime fix

    // (public)
    function bnClone() { var r = nbi(); this.copyTo(r); return r; }

    // (public) return value as integer
    function bnIntValue() {
      if(this.s < 0) {
        if(this.t == 1) return this[0]-this.DV;
        else if(this.t == 0) return -1;
      }
      else if(this.t == 1) return this[0];
      else if(this.t == 0) return 0;
      // assumes 16 < DB < 32
      return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
    }

    // (public) return value as byte
    function bnByteValue() { return (this.t==0)?this.s:(this[0]<<24)>>24; }

    // (public) return value as short (assumes DB>=16)
    function bnShortValue() { return (this.t==0)?this.s:(this[0]<<16)>>16; }

    // (protected) return x s.t. r^x < DV
    function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }

    // (public) 0 if this == 0, 1 if this > 0
    function bnSigNum() {
      if(this.s < 0) return -1;
      else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
      else return 1;
    }

    // (protected) convert to radix string
    function bnpToRadix(b) {
      if(b == null) b = 10;
      if(this.signum() == 0 || b < 2 || b > 36) return "0";
      var cs = this.chunkSize(b);
      var a = Math.pow(b,cs);
      var d = nbv(a), y = nbi(), z = nbi(), r = "";
      this.divRemTo(d,y,z);
      while(y.signum() > 0) {
        r = (a+z.intValue()).toString(b).substr(1) + r;
        y.divRemTo(d,y,z);
      }
      return z.intValue().toString(b) + r;
    }

    // (protected) convert from radix string
    function bnpFromRadix(s,b) {
      this.fromInt(0);
      if(b == null) b = 10;
      var cs = this.chunkSize(b);
      var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
      for(var i = 0; i < s.length; ++i) {
        var x = intAt(s,i);
        if(x < 0) {
          if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
          continue;
        }
        w = b*w+x;
        if(++j >= cs) {
          this.dMultiply(d);
          this.dAddOffset(w,0);
          j = 0;
          w = 0;
        }
      }
      if(j > 0) {
        this.dMultiply(Math.pow(b,j));
        this.dAddOffset(w,0);
      }
      if(mi) BigInteger.ZERO.subTo(this,this);
    }

    // (protected) alternate constructor
    function bnpFromNumber(a,b,c) {
      if("number" == typeof b) {
        // new BigInteger(int,int,RNG)
        if(a < 2) this.fromInt(1);
        else {
          this.fromNumber(a,c);
          if(!this.testBit(a-1))    // force MSB set
            this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);
          if(this.isEven()) this.dAddOffset(1,0); // force odd
          while(!this.isProbablePrime(b)) {
            this.dAddOffset(2,0);
            if(this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a-1),this);
          }
        }
      }
      else {
        // new BigInteger(int,RNG)
        var x = new Array(), t = a&7;
        x.length = (a>>3)+1;
        b.nextBytes(x);
        if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;
        this.fromString(x,256);
      }
    }

    // (public) convert to bigendian byte array
    function bnToByteArray() {
      var i = this.t, r = new Array();
      r[0] = this.s;
      var p = this.DB-(i*this.DB)%8, d, k = 0;
      if(i-- > 0) {
        if(p < this.DB && (d = this[i]>>p) != (this.s&this.DM)>>p)
          r[k++] = d|(this.s<<(this.DB-p));
        while(i >= 0) {
          if(p < 8) {
            d = (this[i]&((1<<p)-1))<<(8-p);
            d |= this[--i]>>(p+=this.DB-8);
          }
          else {
            d = (this[i]>>(p-=8))&0xff;
            if(p <= 0) { p += this.DB; --i; }
          }
          if((d&0x80) != 0) d |= -256;
          if(k == 0 && (this.s&0x80) != (d&0x80)) ++k;
          if(k > 0 || d != this.s) r[k++] = d;
        }
      }
      return r;
    }

    function bnEquals(a) { return(this.compareTo(a)==0); }
    function bnMin(a) { return(this.compareTo(a)<0)?this:a; }
    function bnMax(a) { return(this.compareTo(a)>0)?this:a; }

    // (protected) r = this op a (bitwise)
    function bnpBitwiseTo(a,op,r) {
      var i, f, m = Math.min(a.t,this.t);
      for(i = 0; i < m; ++i) r[i] = op(this[i],a[i]);
      if(a.t < this.t) {
        f = a.s&this.DM;
        for(i = m; i < this.t; ++i) r[i] = op(this[i],f);
        r.t = this.t;
      }
      else {
        f = this.s&this.DM;
        for(i = m; i < a.t; ++i) r[i] = op(f,a[i]);
        r.t = a.t;
      }
      r.s = op(this.s,a.s);
      r.clamp();
    }

    // (public) this & a
    function op_and(x,y) { return x&y; }
    function bnAnd(a) { var r = nbi(); this.bitwiseTo(a,op_and,r); return r; }

    // (public) this | a
    function op_or(x,y) { return x|y; }
    function bnOr(a) { var r = nbi(); this.bitwiseTo(a,op_or,r); return r; }

    // (public) this ^ a
    function op_xor(x,y) { return x^y; }
    function bnXor(a) { var r = nbi(); this.bitwiseTo(a,op_xor,r); return r; }

    // (public) this & ~a
    function op_andnot(x,y) { return x&~y; }
    function bnAndNot(a) { var r = nbi(); this.bitwiseTo(a,op_andnot,r); return r; }

    // (public) ~this
    function bnNot() {
      var r = nbi();
      for(var i = 0; i < this.t; ++i) r[i] = this.DM&~this[i];
      r.t = this.t;
      r.s = ~this.s;
      return r;
    }

    // (public) this << n
    function bnShiftLeft(n) {
      var r = nbi();
      if(n < 0) this.rShiftTo(-n,r); else this.lShiftTo(n,r);
      return r;
    }

    // (public) this >> n
    function bnShiftRight(n) {
      var r = nbi();
      if(n < 0) this.lShiftTo(-n,r); else this.rShiftTo(n,r);
      return r;
    }

    // return index of lowest 1-bit in x, x < 2^31
    function lbit(x) {
      if(x == 0) return -1;
      var r = 0;
      if((x&0xffff) == 0) { x >>= 16; r += 16; }
      if((x&0xff) == 0) { x >>= 8; r += 8; }
      if((x&0xf) == 0) { x >>= 4; r += 4; }
      if((x&3) == 0) { x >>= 2; r += 2; }
      if((x&1) == 0) ++r;
      return r;
    }

    // (public) returns index of lowest 1-bit (or -1 if none)
    function bnGetLowestSetBit() {
      for(var i = 0; i < this.t; ++i)
        if(this[i] != 0) return i*this.DB+lbit(this[i]);
      if(this.s < 0) return this.t*this.DB;
      return -1;
    }

    // return number of 1 bits in x
    function cbit(x) {
      var r = 0;
      while(x != 0) { x &= x-1; ++r; }
      return r;
    }

    // (public) return number of set bits
    function bnBitCount() {
      var r = 0, x = this.s&this.DM;
      for(var i = 0; i < this.t; ++i) r += cbit(this[i]^x);
      return r;
    }

    // (public) true iff nth bit is set
    function bnTestBit(n) {
      var j = Math.floor(n/this.DB);
      if(j >= this.t) return(this.s!=0);
      return((this[j]&(1<<(n%this.DB)))!=0);
    }

    // (protected) this op (1<<n)
    function bnpChangeBit(n,op) {
      var r = BigInteger.ONE.shiftLeft(n);
      this.bitwiseTo(r,op,r);
      return r;
    }

    // (public) this | (1<<n)
    function bnSetBit(n) { return this.changeBit(n,op_or); }

    // (public) this & ~(1<<n)
    function bnClearBit(n) { return this.changeBit(n,op_andnot); }

    // (public) this ^ (1<<n)
    function bnFlipBit(n) { return this.changeBit(n,op_xor); }

    // (protected) r = this + a
    function bnpAddTo(a,r) {
      var i = 0, c = 0, m = Math.min(a.t,this.t);
      while(i < m) {
        c += this[i]+a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      if(a.t < this.t) {
        c += a.s;
        while(i < this.t) {
          c += this[i];
          r[i++] = c&this.DM;
          c >>= this.DB;
        }
        c += this.s;
      }
      else {
        c += this.s;
        while(i < a.t) {
          c += a[i];
          r[i++] = c&this.DM;
          c >>= this.DB;
        }
        c += a.s;
      }
      r.s = (c<0)?-1:0;
      if(c > 0) r[i++] = c;
      else if(c < -1) r[i++] = this.DV+c;
      r.t = i;
      r.clamp();
    }

    // (public) this + a
    function bnAdd(a) { var r = nbi(); this.addTo(a,r); return r; }

    // (public) this - a
    function bnSubtract(a) { var r = nbi(); this.subTo(a,r); return r; }

    // (public) this * a
    function bnMultiply(a) { var r = nbi(); this.multiplyTo(a,r); return r; }

    // (public) this^2
    function bnSquare() { var r = nbi(); this.squareTo(r); return r; }

    // (public) this / a
    function bnDivide(a) { var r = nbi(); this.divRemTo(a,r,null); return r; }

    // (public) this % a
    function bnRemainder(a) { var r = nbi(); this.divRemTo(a,null,r); return r; }

    // (public) [this/a,this%a]
    function bnDivideAndRemainder(a) {
      var q = nbi(), r = nbi();
      this.divRemTo(a,q,r);
      return new Array(q,r);
    }

    // (protected) this *= n, this >= 0, 1 < n < DV
    function bnpDMultiply(n) {
      this[this.t] = this.am(0,n-1,this,0,0,this.t);
      ++this.t;
      this.clamp();
    }

    // (protected) this += n << w words, this >= 0
    function bnpDAddOffset(n,w) {
      if(n == 0) return;
      while(this.t <= w) this[this.t++] = 0;
      this[w] += n;
      while(this[w] >= this.DV) {
        this[w] -= this.DV;
        if(++w >= this.t) this[this.t++] = 0;
        ++this[w];
      }
    }

    // A "null" reducer
    function NullExp() {}
    function nNop(x) { return x; }
    function nMulTo(x,y,r) { x.multiplyTo(y,r); }
    function nSqrTo(x,r) { x.squareTo(r); }

    NullExp.prototype.convert = nNop;
    NullExp.prototype.revert = nNop;
    NullExp.prototype.mulTo = nMulTo;
    NullExp.prototype.sqrTo = nSqrTo;

    // (public) this^e
    function bnPow(e) { return this.exp(e,new NullExp()); }

    // (protected) r = lower n words of "this * a", a.t <= n
    // "this" should be the larger one if appropriate.
    function bnpMultiplyLowerTo(a,n,r) {
      var i = Math.min(this.t+a.t,n);
      r.s = 0; // assumes a,this >= 0
      r.t = i;
      while(i > 0) r[--i] = 0;
      var j;
      for(j = r.t-this.t; i < j; ++i) r[i+this.t] = this.am(0,a[i],r,i,0,this.t);
      for(j = Math.min(a.t,n); i < j; ++i) this.am(0,a[i],r,i,0,n-i);
      r.clamp();
    }

    // (protected) r = "this * a" without lower n words, n > 0
    // "this" should be the larger one if appropriate.
    function bnpMultiplyUpperTo(a,n,r) {
      --n;
      var i = r.t = this.t+a.t-n;
      r.s = 0; // assumes a,this >= 0
      while(--i >= 0) r[i] = 0;
      for(i = Math.max(n-this.t,0); i < a.t; ++i)
        r[this.t+i-n] = this.am(n-i,a[i],r,0,0,this.t+i-n);
      r.clamp();
      r.drShiftTo(1,r);
    }

    // Barrett modular reduction
    function Barrett(m) {
      // setup Barrett
      this.r2 = nbi();
      this.q3 = nbi();
      BigInteger.ONE.dlShiftTo(2*m.t,this.r2);
      this.mu = this.r2.divide(m);
      this.m = m;
    }

    function barrettConvert(x) {
      if(x.s < 0 || x.t > 2*this.m.t) return x.mod(this.m);
      else if(x.compareTo(this.m) < 0) return x;
      else { var r = nbi(); x.copyTo(r); this.reduce(r); return r; }
    }

    function barrettRevert(x) { return x; }

    // x = x mod m (HAC 14.42)
    function barrettReduce(x) {
      x.drShiftTo(this.m.t-1,this.r2);
      if(x.t > this.m.t+1) { x.t = this.m.t+1; x.clamp(); }
      this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);
      this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);
      while(x.compareTo(this.r2) < 0) x.dAddOffset(1,this.m.t+1);
      x.subTo(this.r2,x);
      while(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
    }

    // r = x^2 mod m; x != r
    function barrettSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

    // r = x*y mod m; x,y != r
    function barrettMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

    Barrett.prototype.convert = barrettConvert;
    Barrett.prototype.revert = barrettRevert;
    Barrett.prototype.reduce = barrettReduce;
    Barrett.prototype.mulTo = barrettMulTo;
    Barrett.prototype.sqrTo = barrettSqrTo;

    // (public) this^e % m (HAC 14.85)
    function bnModPow(e,m) {
      var i = e.bitLength(), k, r = nbv(1), z;
      if(i <= 0) return r;
      else if(i < 18) k = 1;
      else if(i < 48) k = 3;
      else if(i < 144) k = 4;
      else if(i < 768) k = 5;
      else k = 6;
      if(i < 8)
        z = new Classic(m);
      else if(m.isEven())
        z = new Barrett(m);
      else
        z = new Montgomery(m);

      // precomputation
      var g = new Array(), n = 3, k1 = k-1, km = (1<<k)-1;
      g[1] = z.convert(this);
      if(k > 1) {
        var g2 = nbi();
        z.sqrTo(g[1],g2);
        while(n <= km) {
          g[n] = nbi();
          z.mulTo(g2,g[n-2],g[n]);
          n += 2;
        }
      }

      var j = e.t-1, w, is1 = true, r2 = nbi(), t;
      i = nbits(e[j])-1;
      while(j >= 0) {
        if(i >= k1) w = (e[j]>>(i-k1))&km;
        else {
          w = (e[j]&((1<<(i+1))-1))<<(k1-i);
          if(j > 0) w |= e[j-1]>>(this.DB+i-k1);
        }

        n = k;
        while((w&1) == 0) { w >>= 1; --n; }
        if((i -= n) < 0) { i += this.DB; --j; }
        if(is1) {    // ret == 1, don't bother squaring or multiplying it
          g[w].copyTo(r);
          is1 = false;
        }
        else {
          while(n > 1) { z.sqrTo(r,r2); z.sqrTo(r2,r); n -= 2; }
          if(n > 0) z.sqrTo(r,r2); else { t = r; r = r2; r2 = t; }
          z.mulTo(r2,g[w],r);
        }

        while(j >= 0 && (e[j]&(1<<i)) == 0) {
          z.sqrTo(r,r2); t = r; r = r2; r2 = t;
          if(--i < 0) { i = this.DB-1; --j; }
        }
      }
      return z.revert(r);
    }

    // (public) gcd(this,a) (HAC 14.54)
    function bnGCD(a) {
      var x = (this.s<0)?this.negate():this.clone();
      var y = (a.s<0)?a.negate():a.clone();
      if(x.compareTo(y) < 0) { var t = x; x = y; y = t; }
      var i = x.getLowestSetBit(), g = y.getLowestSetBit();
      if(g < 0) return x;
      if(i < g) g = i;
      if(g > 0) {
        x.rShiftTo(g,x);
        y.rShiftTo(g,y);
      }
      while(x.signum() > 0) {
        if((i = x.getLowestSetBit()) > 0) x.rShiftTo(i,x);
        if((i = y.getLowestSetBit()) > 0) y.rShiftTo(i,y);
        if(x.compareTo(y) >= 0) {
          x.subTo(y,x);
          x.rShiftTo(1,x);
        }
        else {
          y.subTo(x,y);
          y.rShiftTo(1,y);
        }
      }
      if(g > 0) y.lShiftTo(g,y);
      return y;
    }

    // (protected) this % n, n < 2^26
    function bnpModInt(n) {
      if(n <= 0) return 0;
      var d = this.DV%n, r = (this.s<0)?n-1:0;
      if(this.t > 0)
        if(d == 0) r = this[0]%n;
        else for(var i = this.t-1; i >= 0; --i) r = (d*r+this[i])%n;
      return r;
    }

    // (public) 1/this % m (HAC 14.61)
    function bnModInverse(m) {
      var ac = m.isEven();
      if((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
      var u = m.clone(), v = this.clone();
      var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
      while(u.signum() != 0) {
        while(u.isEven()) {
          u.rShiftTo(1,u);
          if(ac) {
            if(!a.isEven() || !b.isEven()) { a.addTo(this,a); b.subTo(m,b); }
            a.rShiftTo(1,a);
          }
          else if(!b.isEven()) b.subTo(m,b);
          b.rShiftTo(1,b);
        }
        while(v.isEven()) {
          v.rShiftTo(1,v);
          if(ac) {
            if(!c.isEven() || !d.isEven()) { c.addTo(this,c); d.subTo(m,d); }
            c.rShiftTo(1,c);
          }
          else if(!d.isEven()) d.subTo(m,d);
          d.rShiftTo(1,d);
        }
        if(u.compareTo(v) >= 0) {
          u.subTo(v,u);
          if(ac) a.subTo(c,a);
          b.subTo(d,b);
        }
        else {
          v.subTo(u,v);
          if(ac) c.subTo(a,c);
          d.subTo(b,d);
        }
      }
      if(v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
      if(d.compareTo(m) >= 0) return d.subtract(m);
      if(d.signum() < 0) d.addTo(m,d); else return d;
      if(d.signum() < 0) return d.add(m); else return d;
    }

    var lowprimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];
    var lplim = (1<<26)/lowprimes[lowprimes.length-1];

    // (public) test primality with certainty >= 1-.5^t
    function bnIsProbablePrime(t) {
      var i, x = this.abs();
      if(x.t == 1 && x[0] <= lowprimes[lowprimes.length-1]) {
        for(i = 0; i < lowprimes.length; ++i)
          if(x[0] == lowprimes[i]) return true;
        return false;
      }
      if(x.isEven()) return false;
      i = 1;
      while(i < lowprimes.length) {
        var m = lowprimes[i], j = i+1;
        while(j < lowprimes.length && m < lplim) m *= lowprimes[j++];
        m = x.modInt(m);
        while(i < j) if(m%lowprimes[i++] == 0) return false;
      }
      return x.millerRabin(t);
    }

    // (protected) true if probably prime (HAC 4.24, Miller-Rabin)
    function bnpMillerRabin(t) {
      var n1 = this.subtract(BigInteger.ONE);
      var k = n1.getLowestSetBit();
      if(k <= 0) return false;
      var r = n1.shiftRight(k);
      t = (t+1)>>1;
      if(t > lowprimes.length) t = lowprimes.length;
      var a = nbi();
      for(var i = 0; i < t; ++i) {
        //Pick bases at random, instead of starting at 2
        a.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);
        var y = a.modPow(r,this);
        if(y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
          var j = 1;
          while(j++ < k && y.compareTo(n1) != 0) {
            y = y.modPowInt(2,this);
            if(y.compareTo(BigInteger.ONE) == 0) return false;
          }
          if(y.compareTo(n1) != 0) return false;
        }
      }
      return true;
    }

    // protected
    BigInteger.prototype.chunkSize = bnpChunkSize;
    BigInteger.prototype.toRadix = bnpToRadix;
    BigInteger.prototype.fromRadix = bnpFromRadix;
    BigInteger.prototype.fromNumber = bnpFromNumber;
    BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
    BigInteger.prototype.changeBit = bnpChangeBit;
    BigInteger.prototype.addTo = bnpAddTo;
    BigInteger.prototype.dMultiply = bnpDMultiply;
    BigInteger.prototype.dAddOffset = bnpDAddOffset;
    BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
    BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
    BigInteger.prototype.modInt = bnpModInt;
    BigInteger.prototype.millerRabin = bnpMillerRabin;

    // public
    BigInteger.prototype.clone = bnClone;
    BigInteger.prototype.intValue = bnIntValue;
    BigInteger.prototype.byteValue = bnByteValue;
    BigInteger.prototype.shortValue = bnShortValue;
    BigInteger.prototype.signum = bnSigNum;
    BigInteger.prototype.toByteArray = bnToByteArray;
    BigInteger.prototype.equals = bnEquals;
    BigInteger.prototype.min = bnMin;
    BigInteger.prototype.max = bnMax;
    BigInteger.prototype.and = bnAnd;
    BigInteger.prototype.or = bnOr;
    BigInteger.prototype.xor = bnXor;
    BigInteger.prototype.andNot = bnAndNot;
    BigInteger.prototype.not = bnNot;
    BigInteger.prototype.shiftLeft = bnShiftLeft;
    BigInteger.prototype.shiftRight = bnShiftRight;
    BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
    BigInteger.prototype.bitCount = bnBitCount;
    BigInteger.prototype.testBit = bnTestBit;
    BigInteger.prototype.setBit = bnSetBit;
    BigInteger.prototype.clearBit = bnClearBit;
    BigInteger.prototype.flipBit = bnFlipBit;
    BigInteger.prototype.add = bnAdd;
    BigInteger.prototype.subtract = bnSubtract;
    BigInteger.prototype.multiply = bnMultiply;
    BigInteger.prototype.divide = bnDivide;
    BigInteger.prototype.remainder = bnRemainder;
    BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
    BigInteger.prototype.modPow = bnModPow;
    BigInteger.prototype.modInverse = bnModInverse;
    BigInteger.prototype.pow = bnPow;
    BigInteger.prototype.gcd = bnGCD;
    BigInteger.prototype.isProbablePrime = bnIsProbablePrime;

    // JSBN-specific extension
    BigInteger.prototype.square = bnSquare;

    // Expose the Barrett function
    BigInteger.prototype.Barrett = Barrett

    // BigInteger interfaces not implemented in jsbn:

    // BigInteger(int signum, byte[] magnitude)
    // double doubleValue()
    // float floatValue()
    // int hashCode()
    // long longValue()
    // static BigInteger valueOf(long val)

    // Random number generator - requires a PRNG backend, e.g. prng4.js

    // For best results, put code like
    // <body onClick='rng_seed_time();' onKeyPress='rng_seed_time();'>
    // in your main HTML document.

    var rng_state;
    var rng_pool;
    var rng_pptr;

    // Mix in a 32-bit integer into the pool
    function rng_seed_int(x) {
      rng_pool[rng_pptr++] ^= x & 255;
      rng_pool[rng_pptr++] ^= (x >> 8) & 255;
      rng_pool[rng_pptr++] ^= (x >> 16) & 255;
      rng_pool[rng_pptr++] ^= (x >> 24) & 255;
      if(rng_pptr >= rng_psize) rng_pptr -= rng_psize;
    }

    // Mix in the current time (w/milliseconds) into the pool
    function rng_seed_time() {
      rng_seed_int(new Date().getTime());
    }

    // Initialize the pool with junk if needed.
    if(rng_pool == null) {
      rng_pool = new Array();
      rng_pptr = 0;
      var t;
      var crypto = typeof window !== "undefined" ? (window.crypto || window.msCrypto) : undefined;
      if(crypto != undefined) {
        if (crypto.getRandomValues) {
          // console.log("Random: using window.crypto.getRandomValues");
          // Use webcrypto if available
          var ua = new Uint8Array(32);
          crypto.getRandomValues(ua);
          for(t = 0; t < 32; ++t)
            rng_pool[rng_pptr++] = ua[t];
        }
        else if(navigator.appName == "Netscape" && navigator.appVersion < "5") {
          // console.log("Random: using window.crypto.random");
          // Extract entropy (256 bits) from NS4 RNG if available
          var z = crypto.random(32);
          for(t = 0; t < z.length; ++t)
            rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
        } else {
          // console.log("Random: failed to use window.crypto");
        }
      } else {
        // console.log("Random: no window.crypto");
      }
      while(rng_pptr < rng_psize) {  // extract some randomness from Math.random()
        t = Math.floor(65536 * Math.random());
        rng_pool[rng_pptr++] = t >>> 8;
        rng_pool[rng_pptr++] = t & 255;
      }
      rng_pptr = 0;
      rng_seed_time();
      //rng_seed_int(window.screenX);
      //rng_seed_int(window.screenY);
    }

    function rng_get_byte() {
      if(rng_state == null) {
        rng_seed_time();
        rng_state = prng_newstate();
        rng_state.init(rng_pool);
        for(rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
          rng_pool[rng_pptr] = 0;
        rng_pptr = 0;
        //rng_pool = null;
      }
      // TODO: allow reseeding after first request
      return rng_state.next();
    }

    function rng_get_bytes(ba) {
      var i;
      for(i = 0; i < ba.length; ++i) ba[i] = rng_get_byte();
    }

    function SecureRandom() {}

    SecureRandom.prototype.nextBytes = rng_get_bytes;

    // prng4.js - uses Arcfour as a PRNG

    function Arcfour() {
      this.i = 0;
      this.j = 0;
      this.S = new Array();
    }

    // Initialize arcfour context from key, an array of ints, each from [0..255]
    function ARC4init(key) {
      var i, j, t;
      for(i = 0; i < 256; ++i)
        this.S[i] = i;
      j = 0;
      for(i = 0; i < 256; ++i) {
        j = (j + this.S[i] + key[i % key.length]) & 255;
        t = this.S[i];
        this.S[i] = this.S[j];
        this.S[j] = t;
      }
      this.i = 0;
      this.j = 0;
    }

    function ARC4next() {
      var t;
      this.i = (this.i + 1) & 255;
      this.j = (this.j + this.S[this.i]) & 255;
      t = this.S[this.i];
      this.S[this.i] = this.S[this.j];
      this.S[this.j] = t;
      return this.S[(t + this.S[this.i]) & 255];
    }

    Arcfour.prototype.init = ARC4init;
    Arcfour.prototype.next = ARC4next;

    // Plug in your RNG constructor here
    function prng_newstate() {
      return new Arcfour();
    }

    // Pool size must be a multiple of 4 and greater than 32.
    // An array of bytes the size of the pool will be passed to init()
    var rng_psize = 256;

    if (typeof exports !== 'undefined') {
        exports = module.exports = {
            "default": BigInteger,  // "default" is a reserved keyword in IE<9
            BigInteger: BigInteger,
            SecureRandom: SecureRandom
        };
    } else {
        this.jsbn = {
          BigInteger: BigInteger,
          SecureRandom: SecureRandom
        };
    }

}).call(this);
/*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
(function(){function N(p,r){function q(a){if(q[a]!==w)return q[a];var c;if("bug-string-char-index"==a)c="a"!="a"[0];else if("json"==a)c=q("json-stringify")&&q("json-parse");else{var e;if("json-stringify"==a){c=r.stringify;var b="function"==typeof c&&s;if(b){(e=function(){return 1}).toJSON=e;try{b="0"===c(0)&&"0"===c(new t)&&'""'==c(new A)&&c(u)===w&&c(w)===w&&c()===w&&"1"===c(e)&&"[1]"==c([e])&&"[null]"==c([w])&&"null"==c(null)&&"[null,null,null]"==c([w,u,null])&&'{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}'==
c({a:[e,!0,!1,null,"\x00\b\n\f\r\t"]})&&"1"===c(null,e)&&"[\n 1,\n 2\n]"==c([1,2],null,1)&&'"-271821-04-20T00:00:00.000Z"'==c(new C(-864E13))&&'"+275760-09-13T00:00:00.000Z"'==c(new C(864E13))&&'"-000001-01-01T00:00:00.000Z"'==c(new C(-621987552E5))&&'"1969-12-31T23:59:59.999Z"'==c(new C(-1))}catch(f){b=!1}}c=b}if("json-parse"==a){c=r.parse;if("function"==typeof c)try{if(0===c("0")&&!c(!1)){e=c('{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}');var n=5==e.a.length&&1===e.a[0];if(n){try{n=!c('"\t"')}catch(d){}if(n)try{n=
1!==c("01")}catch(g){}if(n)try{n=1!==c("1.")}catch(m){}}}}catch(X){n=!1}c=n}}return q[a]=!!c}p||(p=k.Object());r||(r=k.Object());var t=p.Number||k.Number,A=p.String||k.String,H=p.Object||k.Object,C=p.Date||k.Date,G=p.SyntaxError||k.SyntaxError,K=p.TypeError||k.TypeError,L=p.Math||k.Math,I=p.JSON||k.JSON;"object"==typeof I&&I&&(r.stringify=I.stringify,r.parse=I.parse);var H=H.prototype,u=H.toString,v,B,w,s=new C(-0xc782b5b800cec);try{s=-109252==s.getUTCFullYear()&&0===s.getUTCMonth()&&1===s.getUTCDate()&&
10==s.getUTCHours()&&37==s.getUTCMinutes()&&6==s.getUTCSeconds()&&708==s.getUTCMilliseconds()}catch(Q){}if(!q("json")){var D=q("bug-string-char-index");if(!s)var x=L.floor,M=[0,31,59,90,120,151,181,212,243,273,304,334],E=function(a,c){return M[c]+365*(a-1970)+x((a-1969+(c=+(1<c)))/4)-x((a-1901+c)/100)+x((a-1601+c)/400)};(v=H.hasOwnProperty)||(v=function(a){var c={},e;(c.__proto__=null,c.__proto__={toString:1},c).toString!=u?v=function(a){var c=this.__proto__;a=a in(this.__proto__=null,this);this.__proto__=
c;return a}:(e=c.constructor,v=function(a){var c=(this.constructor||e).prototype;return a in this&&!(a in c&&this[a]===c[a])});c=null;return v.call(this,a)});B=function(a,c){var e=0,b,f,n;(b=function(){this.valueOf=0}).prototype.valueOf=0;f=new b;for(n in f)v.call(f,n)&&e++;b=f=null;e?B=2==e?function(a,c){var e={},b="[object Function]"==u.call(a),f;for(f in a)b&&"prototype"==f||v.call(e,f)||!(e[f]=1)||!v.call(a,f)||c(f)}:function(a,c){var e="[object Function]"==u.call(a),b,f;for(b in a)e&&"prototype"==
b||!v.call(a,b)||(f="constructor"===b)||c(b);(f||v.call(a,b="constructor"))&&c(b)}:(f="valueOf toString toLocaleString propertyIsEnumerable isPrototypeOf hasOwnProperty constructor".split(" "),B=function(a,c){var e="[object Function]"==u.call(a),b,h=!e&&"function"!=typeof a.constructor&&F[typeof a.hasOwnProperty]&&a.hasOwnProperty||v;for(b in a)e&&"prototype"==b||!h.call(a,b)||c(b);for(e=f.length;b=f[--e];h.call(a,b)&&c(b));});return B(a,c)};if(!q("json-stringify")){var U={92:"\\\\",34:'\\"',8:"\\b",
12:"\\f",10:"\\n",13:"\\r",9:"\\t"},y=function(a,c){return("000000"+(c||0)).slice(-a)},R=function(a){for(var c='"',b=0,h=a.length,f=!D||10<h,n=f&&(D?a.split(""):a);b<h;b++){var d=a.charCodeAt(b);switch(d){case 8:case 9:case 10:case 12:case 13:case 34:case 92:c+=U[d];break;default:if(32>d){c+="\\u00"+y(2,d.toString(16));break}c+=f?n[b]:a.charAt(b)}}return c+'"'},O=function(a,c,b,h,f,n,d){var g,m,k,l,p,r,s,t,q;try{g=c[a]}catch(z){}if("object"==typeof g&&g)if(m=u.call(g),"[object Date]"!=m||v.call(g,
"toJSON"))"function"==typeof g.toJSON&&("[object Number]"!=m&&"[object String]"!=m&&"[object Array]"!=m||v.call(g,"toJSON"))&&(g=g.toJSON(a));else if(g>-1/0&&g<1/0){if(E){l=x(g/864E5);for(m=x(l/365.2425)+1970-1;E(m+1,0)<=l;m++);for(k=x((l-E(m,0))/30.42);E(m,k+1)<=l;k++);l=1+l-E(m,k);p=(g%864E5+864E5)%864E5;r=x(p/36E5)%24;s=x(p/6E4)%60;t=x(p/1E3)%60;p%=1E3}else m=g.getUTCFullYear(),k=g.getUTCMonth(),l=g.getUTCDate(),r=g.getUTCHours(),s=g.getUTCMinutes(),t=g.getUTCSeconds(),p=g.getUTCMilliseconds();
g=(0>=m||1E4<=m?(0>m?"-":"+")+y(6,0>m?-m:m):y(4,m))+"-"+y(2,k+1)+"-"+y(2,l)+"T"+y(2,r)+":"+y(2,s)+":"+y(2,t)+"."+y(3,p)+"Z"}else g=null;b&&(g=b.call(c,a,g));if(null===g)return"null";m=u.call(g);if("[object Boolean]"==m)return""+g;if("[object Number]"==m)return g>-1/0&&g<1/0?""+g:"null";if("[object String]"==m)return R(""+g);if("object"==typeof g){for(a=d.length;a--;)if(d[a]===g)throw K();d.push(g);q=[];c=n;n+=f;if("[object Array]"==m){k=0;for(a=g.length;k<a;k++)m=O(k,g,b,h,f,n,d),q.push(m===w?"null":
m);a=q.length?f?"[\n"+n+q.join(",\n"+n)+"\n"+c+"]":"["+q.join(",")+"]":"[]"}else B(h||g,function(a){var c=O(a,g,b,h,f,n,d);c!==w&&q.push(R(a)+":"+(f?" ":"")+c)}),a=q.length?f?"{\n"+n+q.join(",\n"+n)+"\n"+c+"}":"{"+q.join(",")+"}":"{}";d.pop();return a}};r.stringify=function(a,c,b){var h,f,n,d;if(F[typeof c]&&c)if("[object Function]"==(d=u.call(c)))f=c;else if("[object Array]"==d){n={};for(var g=0,k=c.length,l;g<k;l=c[g++],(d=u.call(l),"[object String]"==d||"[object Number]"==d)&&(n[l]=1));}if(b)if("[object Number]"==
(d=u.call(b))){if(0<(b-=b%1))for(h="",10<b&&(b=10);h.length<b;h+=" ");}else"[object String]"==d&&(h=10>=b.length?b:b.slice(0,10));return O("",(l={},l[""]=a,l),f,n,h,"",[])}}if(!q("json-parse")){var V=A.fromCharCode,W={92:"\\",34:'"',47:"/",98:"\b",116:"\t",110:"\n",102:"\f",114:"\r"},b,J,l=function(){b=J=null;throw G();},z=function(){for(var a=J,c=a.length,e,h,f,k,d;b<c;)switch(d=a.charCodeAt(b),d){case 9:case 10:case 13:case 32:b++;break;case 123:case 125:case 91:case 93:case 58:case 44:return e=
D?a.charAt(b):a[b],b++,e;case 34:e="@";for(b++;b<c;)if(d=a.charCodeAt(b),32>d)l();else if(92==d)switch(d=a.charCodeAt(++b),d){case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:e+=W[d];b++;break;case 117:h=++b;for(f=b+4;b<f;b++)d=a.charCodeAt(b),48<=d&&57>=d||97<=d&&102>=d||65<=d&&70>=d||l();e+=V("0x"+a.slice(h,b));break;default:l()}else{if(34==d)break;d=a.charCodeAt(b);for(h=b;32<=d&&92!=d&&34!=d;)d=a.charCodeAt(++b);e+=a.slice(h,b)}if(34==a.charCodeAt(b))return b++,e;l();default:h=
b;45==d&&(k=!0,d=a.charCodeAt(++b));if(48<=d&&57>=d){for(48==d&&(d=a.charCodeAt(b+1),48<=d&&57>=d)&&l();b<c&&(d=a.charCodeAt(b),48<=d&&57>=d);b++);if(46==a.charCodeAt(b)){for(f=++b;f<c&&(d=a.charCodeAt(f),48<=d&&57>=d);f++);f==b&&l();b=f}d=a.charCodeAt(b);if(101==d||69==d){d=a.charCodeAt(++b);43!=d&&45!=d||b++;for(f=b;f<c&&(d=a.charCodeAt(f),48<=d&&57>=d);f++);f==b&&l();b=f}return+a.slice(h,b)}k&&l();if("true"==a.slice(b,b+4))return b+=4,!0;if("false"==a.slice(b,b+5))return b+=5,!1;if("null"==a.slice(b,
b+4))return b+=4,null;l()}return"$"},P=function(a){var c,b;"$"==a&&l();if("string"==typeof a){if("@"==(D?a.charAt(0):a[0]))return a.slice(1);if("["==a){for(c=[];;b||(b=!0)){a=z();if("]"==a)break;b&&(","==a?(a=z(),"]"==a&&l()):l());","==a&&l();c.push(P(a))}return c}if("{"==a){for(c={};;b||(b=!0)){a=z();if("}"==a)break;b&&(","==a?(a=z(),"}"==a&&l()):l());","!=a&&"string"==typeof a&&"@"==(D?a.charAt(0):a[0])&&":"==z()||l();c[a.slice(1)]=P(z())}return c}l()}return a},T=function(a,b,e){e=S(a,b,e);e===
w?delete a[b]:a[b]=e},S=function(a,b,e){var h=a[b],f;if("object"==typeof h&&h)if("[object Array]"==u.call(h))for(f=h.length;f--;)T(h,f,e);else B(h,function(a){T(h,a,e)});return e.call(a,b,h)};r.parse=function(a,c){var e,h;b=0;J=""+a;e=P(z());"$"!=z()&&l();b=J=null;return c&&"[object Function]"==u.call(c)?S((h={},h[""]=e,h),"",c):e}}}r.runInContext=N;return r}var K=typeof define==="function"&&define.amd,F={"function":!0,object:!0},G=F[typeof exports]&&exports&&!exports.nodeType&&exports,k=F[typeof window]&&
window||this,t=G&&F[typeof module]&&module&&!module.nodeType&&"object"==typeof global&&global;!t||t.global!==t&&t.window!==t&&t.self!==t||(k=t);if(G&&!K)N(k,G);else{var L=k.JSON,Q=k.JSON3,M=!1,A=N(k,k.JSON3={noConflict:function(){M||(M=!0,k.JSON=L,k.JSON3=Q,L=Q=null);return A}});k.JSON={parse:A.parse,stringify:A.stringify}}K&&define(function(){return A})}).call(this);

function ArrayFill(array, value) {
	for (var i=0; i<array.length; i++)
		array[i] = value;
	return array;
}

function ObjectKeys(object) {
	var keys = [];
	for (var i in object)
		if (object.hasOwnProperty(i))
			keys.push(i);
	return keys;
}

function HexToStr(hex) {
	return hex.match(/.{1,2}/g).map(function(v){
		return String.fromCharCode(parseInt(v, 16));
	}).join('');
}

function StrToHex(str) {
	return str.split('').map(function(v){
		var s = ('0' + v.charCodeAt(0).toString(16));
		return s.substr(s.length-2);
	}).join('');
}

function HexToArray(hex) {
	return hex.match(/.{1,2}/g).map(function(v){
		return parseInt(v, 16);
	});
}

function ArrayToHex(array) {
	return array.map(function(v){
		var s = ('0' + ((v+256) % 256).toString(16));
		return s.substr(s.length-2);
	}).join('');
}

function StrToArray(str) {
	return HexToArray(StrToHex(str));
}

function ArrayToStr(array) {
	return HexToStr(ArrayToHex(array));
}

function StringRepeat(pattern, count) {
	if (count < 1)
		return '';
	var result = '';
	while (count > 1) {
		if (count & 1)
			result += pattern;
		count >>= 1;
		pattern += pattern;
	}
	return result + pattern;
}

function hex2bin(a) {
	var out = '';
	for (var i=0; i<a.length/2; i++)
		out += String.fromCharCode(parseInt(a.substr(i*2, 2), 16));
	return out;
}

// Source: http://code.google.com/p/gflot/source/browse/trunk/flot/base64.js?r=153

/* Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.0
 * LastModified: Dec 25 1999
 * This library is free.  You can redistribute it and/or modify it.
 */

/*
 * Interfaces:
 * b64 = base64encode(data);
 * data = base64decode(b64);
 */

(function() {
	var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var base64DecodeChars = new Array(
		-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
		-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
		-1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
		-1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
	);

	function base64encode(str) {
		var out, i, len;
		var c1, c2, c3;

		len = str.length;
		i = 0;
		out = "";
		while (i < len) {
			c1 = str.charCodeAt(i++) & 0xff;
			if (i == len) {
				out += base64EncodeChars.charAt(c1 >> 2);
				out += base64EncodeChars.charAt((c1 & 0x3) << 4);
				out += "==";
				break;
			}
			c2 = str.charCodeAt(i++);
			if (i == len) {
				out += base64EncodeChars.charAt(c1 >> 2);
				out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
				out += base64EncodeChars.charAt((c2 & 0xF) << 2);
				out += "=";
				break;
			}
			c3 = str.charCodeAt(i++);
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
			out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
			out += base64EncodeChars.charAt(c3 & 0x3F);
		}
		return out;
	}

	function base64decode(str) {
		var c1, c2, c3, c4;
		var i, len, out;

		len = str.length;
		i = 0;
		out = "";
		while (i < len) {
			/* c1 */
			do {
				c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
			} while(i < len && c1 == -1);
			if(c1 == -1) break;

			/* c2 */
			do {
				c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
			} while(i < len && c2 == -1);
			if(c2 == -1) break;
			out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

			/* c3 */
			do {
				c3 = str.charCodeAt(i++) & 0xff;
				if(c3 == 61)
					return out;
				c3 = base64DecodeChars[c3];
			} while(i < len && c3 == -1);
			if(c3 == -1) break;
			out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

			/* c4 */
			do {
				c4 = str.charCodeAt(i++) & 0xff;
				if(c4 == 61)
					return out;
				c4 = base64DecodeChars[c4];
			} while(i < len && c4 == -1);
			if(c4 == -1) break;
			out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
		}
		return out;
	}

	if (typeof window != 'undefined' && !window.btoa) {
		// browser
		window.btoa = base64encode;
		window.atob = base64decode;
	} else {
		btoa = base64encode;
		atob = base64decode;
	}
})();

// define globals if we're in a browser
if (typeof window !== "undefined") {
	var BigInteger = jsbn.BigInteger;
	var SecureRandom = jsbn.SecureRandom;
	// make serialization of BigInts an HEX string
	BigInteger.prototype.toJSON = function() {
		// return btoa(hex2bin(this.toString(16)));
		// return this.toString(16);
		return this.toString(36);
	};
	BigInteger.ZERO.name = 'Zero';
	BigInteger.ONE.name = 'One';
}

// ensure that both are "false" on Prod
var USE_FAKE_RANDOM = false;
var SHOW_TRACES = false;

// init tracer
var tracer = null;
var trace_clear = null;
var trace_remove = null;
(function() {
	function $(id) {
		var it = window[id];
		if(it) {
			var type = typeof it;
			if(type == 'object') {
				var str = it.toString();
				if(str != '[object Window]')
					return it;
			}
		}
		return document.getElementById(id);
	}

	var trace_txt = '';
	trace_clear = function() { trace_txt = ''; $('trace_text').value = trace_txt; }
	trace_remove = function() { document.body.removeChild($('trace')); }
	function trace(text) {
		var elem = $('trace');
		if(elem == null) {
			var newelem = document.createElement('div');
			newelem.id = 'trace';
			document.body.appendChild(newelem);
			newelem.innerHTML = '<input onclick="trace_clear()" type="button" value="Clear"><input onclick="trace_remove()" type="button" value="Remove"><br><textarea id="trace_text" cols="120" rows="25" spellcheck="false"></textarea>';
		}
		trace_txt += text + '\n';
		var trace_area = $('trace_text');
		trace_area.value = trace_txt;
		trace_area.scrollTop = trace_area.scrollHeight;			
	}
	var times = {};
	function chronoStart(name) {
		if (!times[name])
			times[name] = new Date().getTime();
	}
	function chronoEnd(name) {
		if (times[name]) {
			var now = new Date().getTime();
			tracer.log("\ttiming for " + name + ": " + (now - times[name]));
		}
	}
	function noop(){}

	if (!SHOW_TRACES) {
		// console.log("Traces: no traces");
		tracer = {
			log: noop,
			warn: noop,
			time: noop,
			timeEnd: noop
		};
	} else if (typeof document == 'object' && typeof console != 'object') {
		// console.log("Traces: browser with no console");
		tracer = {
			log: function(txt) { trace(txt); },
			warn: function(txt) { trace(txt); },
			time: chronoStart,
			timeEnd: chronoEnd
		};
	} else {
		// console.log("Traces: no browser or browser with console");
		// if we're not in a browser, redirect to console
		// if console.time doesn't exist (nashorn), use our own implementation
		tracer = {
			log: function(txt) { console.log(txt); },
			warn: function(txt) { console.warn(txt); },
			time: chronoStart,
			timeEnd: chronoEnd
		};
	}
})();

// Wrapper for SHA generation
// typical call: 	var sha = SHA.create("SHA-256", "TEXT", "HEX").hash("This is a test");
var SHA = {
	// input can be HEX, B64, BYTES, ARRAYBUFFER or TEXT
	// output can be HEX, B64, BYTES or ARRAYBUFFER
	create: function(type, input, output){
		if (type != "SHA-256")
			throw "Only SHA-256 is supported";
		var shaobj = new jsSHA(type, input);
		var outputformat = output;
		return {
			hash: function(data) {
				shaobj.update(data);
				return shaobj.getHash(outputformat);
			}
		};
	}
};

//-------------------------- RandomizeUtils ----------------------------------------------
// !!! TODO: remove the whole concept of fake random
/** @this {RandomizeUtils} */
function RandomizeUtils() {

	// this is JSBN random.
	// BigInteger use it by calling "nextBytes" with an array to fill with random byte values
	this._rnd = new SecureRandom();

	this._strongCrypto = (typeof window !== "undefined" && (window.crypto || window.msCrypto)) ? true : false;
	// console.log("Strong crypto: " + this._strongCrypto);
	this._xorPool = null;
	this._poolIndex = 0;
	this.setRandomPool = function(pool) {
		if (pool)
			this._xorPool = pool.map(function(str){ return new BigInteger(str, 16); });
	}

	// Returns a random BigInteger between 0 et b
	this.randomize_real = function(max, randsource) {
		var maxB = typeof max == "number" ? new BigInteger('' + max) : max;
		var rnd = randsource || this._rnd;
		var k = maxB.subtract(BigInteger.ONE).bitLength();
		// pick a xor value from the pool if needed and available
		var xor = BigInteger.ZERO;
		if (!this._strongCrypto && this._xorPool && this._xorPool.length > 0)
			xor = this._xorPool[(this._poolIndex++) % this._xorPool.length].mod(max);
		var r;
		do {
			// BigInteger random number generation constructor takes (bit number, random generator)
			r = new BigInteger(k, rnd);
			r = r.xor(xor);
			// we have a random number with the right bit number, but may still be > max, so retry if it happens
		} while (r.compareTo(maxB) >= 0 || r.equals(BigInteger.ZERO));
		// ensuring that output is not zero gets us real (not null) proofs
		// tracer.log("randomize_real: max=" + max.toString() + " => " + r.toString());
		return r;
	};

	// this.randomize_fake = function(b, rnd) {
	// 	return new BigInteger("c318ba4e9bf89be87b1df6348e2088d03cac88de60db6441fb2e6badd355778", 16);
	// };

	// random is always forced to fake if we're not in a browser
	// this.randomize = (USE_FAKE_RANDOM || typeof window == "undefined") ? this.randomize_fake : this.randomize_real;
	this.randomize = this.randomize_real;
}
var randomizeUtils = new RandomizeUtils();

//-------------------------- OO tools shim ----------------------------------------------
function createObject(proto) {
	function ctor() { }
	ctor.prototype = proto;
	return new ctor();
}

function extend(base, sub) {
	// Avoid instantiating the base class just to setup inheritance
	// Also, do a recursive merge of two prototypes, so we don't overwrite the existing prototype, but still maintain the inheritance chain
	var origProto = sub.prototype;
	sub.prototype = createObject(base.prototype);
	for (var key in origProto)
		sub.prototype[key] = origProto[key];

	// The constructor property was set wrong, let's fix it
	// Not possible on IE7-8, so never mind, constructor will be enumerable
	// Object.defineProperty(sub.prototype, 'constructor', { enumerable: false, value: sub });
}
/** @this {FPfast} */
function FPfast() {
	// taken from nacl-fast: car25519, sel25519, packTo25519, A, Z, M, S, I

	// typed arrays are not available on IE 7-9. But a plain array of Numbers works too (with abysmal perfs on Floor).
	var numcls = (typeof Float64Array != "undefined") ? Float64Array : Array;

	this.ZERO = ArrayFill(new numcls(16), 0);

	this.ONE = ArrayFill(new numcls(16), 0);
	this.ONE[0] = 1;

	this.TWO = ArrayFill(new numcls(16), 0);
	this.TWO[0] = 2;
	
	//pour optimiser le calcul Math.floor(x) remplacé par  (floorC + (x - floorhalf))) attention parenthésage important 
	var floorC = 6755399441055744.0;       // 2^52+2^51 
    var floorhalf = 0.5 - 1/131072.0;      // 2^(-1) - 2^(-17) 


	this.check = function(a) {
		var i;
		// 1. Check if all slices do not flow out of 16 bits
		for (i = 0; i < 16; i++)
			if (a[i] < 0 || a[i] >= 65536)
				return false;
		// 2-3-4 just check that we're < P  (=2^255-19)
		// 2. if a[15] < a^15-1, already ok
		if (a[15] < 32767)
			return true;
		// 3. if any [1-14] slice is not 0xffff, it's ok
		for (i=14; i>0; i--)
			if (a[i] < 65535)
				return true;
		// 4. if last slice is < 65517, it ok
		if (a[0] < 65517)
			return true;
		return false;
	};
	

	function car25519(o) {
		var i, v, c = 1;
		for (i = 0; i < 16; i++) {
			v = o[i] + c + 65535;
			c = Math.floor(v / 65536);
			o[i] = v - c * 65536;
		}
		o[0] += c-1 + 37 * (c-1);
	}

	function sel25519(p, q, b) {
		var t, c = ~(b-1);
		for (var i = 0; i < 16; i++) {
			t = c & (p[i] ^ q[i]);
			p[i] ^= t;
			q[i] ^= t;
		}
	}

	// this is the pack25519 function, modified to output into a given number, not a byte array
	function reduce25519(n) {
		car25519(n);
		car25519(n);
		car25519(n);
		var b, m = new numcls(16);
		for (var j = 0; j < 2; j++) {
			m[0] = n[0] - 0xffed;
			for (var i = 1; i < 15; i++) {
				m[i] = n[i] - 0xffff - ((m[i-1]>>16) & 1);
				m[i-1] &= 0xffff;
			}
			m[15] = n[15] - 0x7fff - ((m[14]>>16) & 1);
			b = (m[15]>>16) & 1;
			m[14] &= 0xffff;
			sel25519(n, m, 1-b);
		}
	}

	this.toHexString = function(a, noreduction) {
		var str = '';
		if (!noreduction)
			reduce25519(a);
		for (var i=15; i>=0; i--) {
			var b = '000' + a[i].toString(16);
			str += b.substr(b.length-4);
		}
		return str;
	};
	// probably costly, but we only do it for proof generation
	this.toStringBase = function(a, radix) {
		var s = this.toHexString(a);
		if (radix !== 16)
			s = (new BigInteger(s, 16)).toString(radix);
		return s;
	};

	this.fromHexString = function(str, radix, nocheck) {
		var rdx = radix || 16;
		// convert to base 16 if not already
		var str1 = rdx === 16 ? str : (new BigInteger(str, radix)).toString(16);
		var str2 = '0000000000000000000000000000000000000000000000000000000000000000' + str1;
		str2 = str2.substr(str2.length - 64);
		var o = new numcls(16);
		for (var i=0; i<16; i++)
			o[15-i] = parseInt(str2.substr(i*4, 4), 16);
		if (!nocheck && !this.check(o))
			throw new Error("This number is to large: " + str);
		return o;
	};
	this.d = this.fromHexString("52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3");
	// p is only used for external reference, we never use it directly. It is hardcoded in the functions whenever useful (eg: check)
	this.p = this.fromHexString("7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed", null, true);

	function addTo(a, b, o) {
		for (var i = 0; i < 16; i++)
			o[i] = a[i] + b[i];
		return o;
	}
	function add(a, b) {
		return addTo(a, b, new numcls(16));
	}

	function subtractTo(a, b, o) {
		for (var i = 0; i < 16; i++)
			o[i] = a[i] - b[i];
		return o;
	}
	function subtract(a, b) {
		return subtractTo(a, b, new numcls(16));
	}

	function squareTo(a, o) {
		var v, c, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15,
		a00 = a[0],  a01 = a[1],  a02 = a[2],  a03 = a[3],
		a04 = a[4],  a05 = a[5],  a06 = a[6],  a07 = a[7],
		a08 = a[8],  a09 = a[9],  a10 = a[10], a11 = a[11],
		a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];

		t0  = a00*a00+38*(2*(a01*a15+a02*a14+a03*a13+a04*a12+a05*a11+a06*a10+a07*a09)+a08*a08);
		t1  = 2*a00*a01+38*(2*(a02*a15+a03*a14+a04*a13+a05*a12+a06*a11+a07*a10+a08*a09));
		t2  = 2*(a00*a02)+a01*a01+38*(2*(a03*a15+a04*a14+a05*a13+a06*a12+a07*a11+a08*a10)+a09*a09);
		t3  = 2*(a00*a03+a01*a02)+38*(2*(a04*a15+a05*a14+a06*a13+a07*a12+a08*a11+a09*a10));
		t4  = 2*(a00*a04+a01*a03)+a02*a02+38*(2*(a05*a15+a06*a14+a07*a13+a08*a12+a09*a11)+a10*a10);
		t5  = 2*(a00*a05+a01*a04+a02*a03)+38*(2*(a06*a15+a07*a14+a08*a13+a09*a12+a10*a11));
		t6  = 2*(a00*a06+a01*a05+a02*a04)+a03*a03+38*(2*(a07*a15+a08*a14+a09*a13+a10*a12)+a11*a11);
		t7  = 2*(a00*a07+a01*a06+a02*a05+a03*a04)+38*(2*(a08*a15+a09*a14+a10*a13+a11*a12));
		t8  = 2*(a00*a08+a01*a07+a02*a06+a03*a05)+a04*a04+38*(2*(a09*a15+a10*a14+a11*a13)+a12*a12);
		t9  = 2*(a00*a09+a01*a08+a02*a07+a03*a06+a04*a05)+38*(2*(a10*a15+a11*a14+a12*a13));
		t10 = 2*(a00*a10+a01*a09+a02*a08+a03*a07+a04*a06)+a05*a05+38*(2*(a11*a15+a12*a14)+a13*a13);
		t11 = 2*(a00*a11+a01*a10+a02*a09+a03*a08+a04*a07+a05*a06)+38*(2*(a12*a15+a13*a14));
		t12 = 2*(a00*a12+a01*a11+a02*a10+a03*a09+a04*a08+a05*a07)+a06*a06+38*(2*(a13*a15)+a14*a14);
		t13 = 2*(a00*a13+a01*a12+a02*a11+a03*a10+a04*a09+a05*a08+a06*a07)+38*(2*(a14*a15));
		t14 = 2*(a00*a14+a01*a13+a02*a12+a03*a11+a04*a10+a05*a09+a06*a08)+a07*a07+38*(a15*a15);
		t15 = 2*(a00*a15+a01*a14+a02*a13+a03*a12+a04*a11+a05*a10+a06*a09+a07*a08);

		// car:
		// var i, v, c = 1;
		// for (i = 0; i < 16; i++) {
		// 	v = o[i] + c + 65535;
		// 	c = Math.floor(v / 65536);
		// 	o[i] = v - c * 65536;
		// }
		// o[0] += c-1 + 37 * (c-1);

		
		/**
		 * Le math.floor() a été remplacé par un 0 | pour des raisons de performances.
		 * Voir document de pierrick Gaudry - EVOTE_APP_SPEC_CRY_analyseJSMathFloor.pdf
		 */
		
		// first car
		c = 1;
		v =  t0 + c + 65535; c = 0|(v / 65536);  t0 = v - c * 65536;
		v =  t1 + c + 65535; c = 0|(v / 65536);  t1 = v - c * 65536;
		v =  t2 + c + 65535; c = 0|(v / 65536);  t2 = v - c * 65536;
		v =  t3 + c + 65535; c = 0|(v / 65536);  t3 = v - c * 65536;
		v =  t4 + c + 65535; c = 0|(v / 65536);  t4 = v - c * 65536;
		v =  t5 + c + 65535; c = 0|(v / 65536);  t5 = v - c * 65536;
		v =  t6 + c + 65535; c = 0|(v / 65536);  t6 = v - c * 65536;
		v =  t7 + c + 65535; c = 0|(v / 65536);  t7 = v - c * 65536;
		v =  t8 + c + 65535; c = 0|(v / 65536);  t8 = v - c * 65536;
		v =  t9 + c + 65535; c = 0|(v / 65536);  t9 = v - c * 65536;
		v = t10 + c + 65535; c = 0|(v / 65536); t10 = v - c * 65536;
		v = t11 + c + 65535; c = 0|(v / 65536); t11 = v - c * 65536;
		v = t12 + c + 65535; c = 0|(v / 65536); t12 = v - c * 65536;
		v = t13 + c + 65535; c = 0|(v / 65536); t13 = v - c * 65536;
		v = t14 + c + 65535; c = 0|(v / 65536); t14 = v - c * 65536;
		v = t15 + c + 65535; c = 0|(v / 65536); t15 = v - c * 65536;
		t0 += 38 * (c-1);

		// second car
		c = 1;
		v =  t0 + c + 65535; c = 0|(v / 65536);  t0 = v - c * 65536;
		v =  t1 + c + 65535; c = 0|(v / 65536);  t1 = v - c * 65536;
		v =  t2 + c + 65535; c = 0|(v / 65536);  t2 = v - c * 65536;
		v =  t3 + c + 65535; c = 0|(v / 65536);  t3 = v - c * 65536;
		v =  t4 + c + 65535; c = 0|(v / 65536);  t4 = v - c * 65536;
		v =  t5 + c + 65535; c = 0|(v / 65536);  t5 = v - c * 65536;
		v =  t6 + c + 65535; c = 0|(v / 65536);  t6 = v - c * 65536;
		v =  t7 + c + 65535; c = 0|(v / 65536);  t7 = v - c * 65536;
		v =  t8 + c + 65535; c = 0|(v / 65536);  t8 = v - c * 65536;
		v =  t9 + c + 65535; c = 0|(v / 65536);  t9 = v - c * 65536;
		v = t10 + c + 65535; c = 0|(v / 65536); t10 = v - c * 65536;
		v = t11 + c + 65535; c = 0|(v / 65536); t11 = v - c * 65536;
		v = t12 + c + 65535; c = 0|(v / 65536); t12 = v - c * 65536;
		v = t13 + c + 65535; c = 0|(v / 65536); t13 = v - c * 65536;
		v = t14 + c + 65535; c = 0|(v / 65536); t14 = v - c * 65536;
		v = t15 + c + 65535; c = 0|(v / 65536); t15 = v - c * 65536;
  		t0 += 38 * (c-1);

		o[ 0] = t0;  o[ 1] = t1;  o[ 2] = t2;  o[ 3] = t3;
		o[ 4] = t4;  o[ 5] = t5;  o[ 6] = t6;  o[ 7] = t7;
		o[ 8] = t8;  o[ 9] = t9;  o[10] = t10; o[11] = t11;
		o[12] = t12; o[13] = t13; o[14] = t14; o[15] = t15;
		return o;
	}
	function square(a) {
		return multiplyTo(a, a, new numcls(16));
	}

	function multiplyTo(a, b, o) {

		// rewrite of the core multiplication to have far less statements (16 instead of 240)
		// it has the same number of local variables (16 more a[0-15], 16 less t[16-31])
		// same number of lookups on a[] (=16)

		var v, c, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15,
		a0 = a[0], a1 = a[1], a2 = a[2],   a3 = a[3], 	a4 = a[4],   a5 = a[5],   a6 = a[6],   a7 = a[7],
		a8 = a[8], a9 = a[9], a10 = a[10], a11 = a[11], a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15],
		b0 = b[0], b1 = b[1], b2 = b[2],   b3 = b[3], 	b4 = b[4],   b5 = b[5],   b6 = b[6],   b7 = b[7],
		b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];

		t0 = a0*b0+38*(a1*b15+a10*b6+a11*b5+a12*b4+a13*b3+a14*b2+a15*b1+a2*b14+a3*b13+a4*b12+a5*b11+a6*b10+a7*b9+a8*b8+a9*b7);
		t1 = a0*b1+a1*b0+38*(a10*b7+a11*b6+a12*b5+a13*b4+a14*b3+a15*b2+a2*b15+a3*b14+a4*b13+a5*b12+a6*b11+a7*b10+a8*b9+a9*b8);
		t2 = a0*b2+a1*b1+a2*b0+38*(a10*b8+a11*b7+a12*b6+a13*b5+a14*b4+a15*b3+a3*b15+a4*b14+a5*b13+a6*b12+a7*b11+a8*b10+a9*b9);
		t3 = a0*b3+a1*b2+a2*b1+a3*b0+38*(a10*b9+a11*b8+a12*b7+a13*b6+a14*b5+a15*b4+a4*b15+a5*b14+a6*b13+a7*b12+a8*b11+a9*b10);
		t4 = a0*b4+a1*b3+a2*b2+a3*b1+a4*b0+38*(a10*b10+a11*b9+a12*b8+a13*b7+a14*b6+a15*b5+a5*b15+a6*b14+a7*b13+a8*b12+a9*b11);
		t5 = a0*b5+a1*b4+a2*b3+a3*b2+a4*b1+a5*b0+38*(a10*b11+a11*b10+a12*b9+a13*b8+a14*b7+a15*b6+a6*b15+a7*b14+a8*b13+a9*b12);
		t6 = a0*b6+a1*b5+a2*b4+a3*b3+a4*b2+a5*b1+a6*b0+38*(a10*b12+a11*b11+a12*b10+a13*b9+a14*b8+a15*b7+a7*b15+a8*b14+a9*b13);
		t7 = a0*b7+a1*b6+a2*b5+a3*b4+a4*b3+a5*b2+a6*b1+a7*b0+38*(a10*b13+a11*b12+a12*b11+a13*b10+a14*b9+a15*b8+a8*b15+a9*b14);
		t8 = a0*b8+a1*b7+a2*b6+a3*b5+a4*b4+a5*b3+a6*b2+a7*b1+a8*b0+38*(a10*b14+a11*b13+a12*b12+a13*b11+a14*b10+a15*b9+a9*b15);
		t9 = a0*b9+a1*b8+a2*b7+a3*b6+a4*b5+a5*b4+a6*b3+a7*b2+a8*b1+a9*b0+38*(a10*b15+a11*b14+a12*b13+a13*b12+a14*b11+a15*b10);
		t10 = a0*b10+a1*b9+a10*b0+a2*b8+a3*b7+a4*b6+a5*b5+a6*b4+a7*b3+a8*b2+a9*b1+38*(a11*b15+a12*b14+a13*b13+a14*b12+a15*b11);
		t11 = a0*b11+a1*b10+a10*b1+a11*b0+a2*b9+a3*b8+a4*b7+a5*b6+a6*b5+a7*b4+a8*b3+a9*b2+38*(a12*b15+a13*b14+a14*b13+a15*b12);
		t12 = a0*b12+a1*b11+a10*b2+a11*b1+a12*b0+a2*b10+a3*b9+a4*b8+a5*b7+a6*b6+a7*b5+a8*b4+a9*b3+38*(a13*b15+a14*b14+a15*b13);
		t13 = a0*b13+a1*b12+a10*b3+a11*b2+a12*b1+a13*b0+a2*b11+a3*b10+a4*b9+a5*b8+a6*b7+a7*b6+a8*b5+a9*b4+38*(a14*b15+a15*b14);
		t14 = a0*b14+a1*b13+a10*b4+a11*b3+a12*b2+a13*b1+a14*b0+a2*b12+a3*b11+a4*b10+a5*b9+a6*b8+a7*b7+a8*b6+a9*b5+38*(a15*b15);
		t15 = a0*b15+a1*b14+a10*b5+a11*b4+a12*b3+a13*b2+a14*b1+a15*b0+a2*b13+a3*b12+a4*b11+a5*b10+a6*b9+a7*b8+a8*b7+a9*b6;

		/**
		 * Le math.floor() a été remplacé par un 0 | pour des raisons de performances.
		 * Voir document de pierrick Gaudry - EVOTE_APP_SPEC_CRY_analyseJSMathFloor.pdf
		 */
		
		// first car
		c = 1;
		v =  t0 + c + 65535; c = 0|(v / 65536);  t0 = v - c * 65536;
		v =  t1 + c + 65535; c = 0|(v / 65536);  t1 = v - c * 65536;
		v =  t2 + c + 65535; c = 0|(v / 65536);  t2 = v - c * 65536;
		v =  t3 + c + 65535; c = 0|(v / 65536);  t3 = v - c * 65536;
		v =  t4 + c + 65535; c = 0|(v / 65536);  t4 = v - c * 65536;
		v =  t5 + c + 65535; c = 0|(v / 65536);  t5 = v - c * 65536;
		v =  t6 + c + 65535; c = 0|(v / 65536);  t6 = v - c * 65536;
		v =  t7 + c + 65535; c = 0|(v / 65536);  t7 = v - c * 65536;
		v =  t8 + c + 65535; c = 0|(v / 65536);  t8 = v - c * 65536;
		v =  t9 + c + 65535; c = 0|(v / 65536);  t9 = v - c * 65536;
		v = t10 + c + 65535; c = 0|(v / 65536); t10 = v - c * 65536;
		v = t11 + c + 65535; c = 0|(v / 65536); t11 = v - c * 65536;
		v = t12 + c + 65535; c = 0|(v / 65536); t12 = v - c * 65536;
		v = t13 + c + 65535; c = 0|(v / 65536); t13 = v - c * 65536;
		v = t14 + c + 65535; c = 0|(v / 65536); t14 = v - c * 65536;
		v = t15 + c + 65535; c = 0|(v / 65536); t15 = v - c * 65536;
		t0 += 38 * (c-1);

		// second car
		c = 1;
		v =  t0 + c + 65535; c = 0|(v / 65536);  t0 = v - c * 65536;
		v =  t1 + c + 65535; c = 0|(v / 65536);  t1 = v - c * 65536;
		v =  t2 + c + 65535; c = 0|(v / 65536);  t2 = v - c * 65536;
		v =  t3 + c + 65535; c = 0|(v / 65536);  t3 = v - c * 65536;
		v =  t4 + c + 65535; c = 0|(v / 65536);  t4 = v - c * 65536;
		v =  t5 + c + 65535; c = 0|(v / 65536);  t5 = v - c * 65536;
		v =  t6 + c + 65535; c = 0|(v / 65536);  t6 = v - c * 65536;
		v =  t7 + c + 65535; c = 0|(v / 65536);  t7 = v - c * 65536;
		v =  t8 + c + 65535; c = 0|(v / 65536);  t8 = v - c * 65536;
		v =  t9 + c + 65535; c = 0|(v / 65536);  t9 = v - c * 65536;
		v = t10 + c + 65535; c = 0|(v / 65536); t10 = v - c * 65536;
		v = t11 + c + 65535; c = 0|(v / 65536); t11 = v - c * 65536;
		v = t12 + c + 65535; c = 0|(v / 65536); t12 = v - c * 65536;
		v = t13 + c + 65535; c = 0|(v / 65536); t13 = v - c * 65536;
		v = t14 + c + 65535; c = 0|(v / 65536); t14 = v - c * 65536;
		v = t15 + c + 65535; c = 0|(v / 65536); t15 = v - c * 65536;
		t0 += 38 * (c-1);

		o[ 0] = t0;  o[ 1] = t1;  o[ 2] = t2;  o[ 3] = t3;
		o[ 4] = t4;  o[ 5] = t5;  o[ 6] = t6;  o[ 7] = t7;
		o[ 8] = t8;  o[ 9] = t9;  o[10] = t10; o[11] = t11;
		o[12] = t12; o[13] = t13; o[14] = t14; o[15] = t15;
		return o;
	}
	function multiply(a, b) {
		return multiplyTo(a, b, new numcls(16));
	}

	// Warning: in the original code from inv25519, argument was i and the loop counter was a. Changed for consistency.
	// also removed number allocation for temporary term
	function invertTo(a, o) {
		for (var i = 0; i < 16; i++) o[i] = a[i];
		for (var i = 253; i >= 0; i--) {
			squareTo(o, o);
			if(i !== 2 && i !== 4)
				multiplyTo(o, a, o);
		}
		return o;
	}
	function invert(a) {
		return invertTo(a, new numcls(16));
	}
	// END OF NACL-FAST LOOTING

	function negateTo(a, o) {
		for (var i = 0; i < 16; i++)
			o[i] = -a[i];
		return o;
	}
	function negate(a) {
		return negateTo(a, new numcls(16));
	}

	function divideTo(a, b, o) {
		// 1. If b = 0, error
		var isZero = true;
		for (var i = 0; i < 16; i++)
			if (b[i] != 0) {
				isZero = false;
				break;
			}
		if (isZero)
			throw new Error("Dividing by Zero is bad");

		// 2. Multiply by inverse
		return multiplyTo(a, invert(b), o);
	}
	function divide(a, b) {
		return divideTo(a, b, new numcls(16));
	}

	function equal(a, b) {
		reduce25519(a);
		reduce25519(b);
		for (var i = 0; i < 16; i++)
			if (a[i] != b[i])
				return false;
		return true;
	}

	// check that all values are zero
	function isOne(a) {
		for (var i = 15; i > 0; i--)
			if (a[i] != 0)
				return false;
		if (a[0] != 1)
			return false;
		return true;
	}

	this.A = add;
	this.Z = subtract;
	this.N = negate;
	this.M = multiply;
	this.S = square;
	this.I = invert;
	this.D = divide;
	this.E = equal;
	this.isOne = isOne;

	this.A2 = addTo;
	this.Z2 = subtractTo;
	this.N2 = negateTo;
	this.M2 = multiplyTo;
	this.S2 = squareTo;
	this.I2 = invertTo;
	this.D2 = divideTo;

	this.baseclass = numcls;
}

var fp = new FPfast();

// Point operation is almost never used anymore, all internal computations are done on PointExt

// called with two FP values
/** @this {Point} */
function Point(x, y) {
	this.x = x;
	this.y = y;
}
// Point.prototype.copy = function(point) {
// 	return new Point(this.x, this.y);
// };
// Point.prototype.toString = function() {
// 	// used only during proof computing, for serialization before SHA
// 	return fp.toStringBase(this.x, 10) + '-' + fp.toStringBase(this.y, 10);
// 	// return "[Point: x=" + fp.toHexString(this.x) + ", y=" + fp.toHexString(this.y) + "]";
// };
// Point.prototype.toJSON = function() {
// 	return {x:this.x, y:this.y};
// };
// Point.prototype.isEqual = function(point) {
// 	return fp.E(point.x, this.x) && fp.E(point.y, this.y);
// };
// Point.prototype.compareTo = function(point) {
// 	return this.isEqual(point) ? 0 : 1;
// };
// Point.prototype.multiply = function(p) {
// 	return PointExt.prototype.buildFromPoint(this).multiply(PointExt.prototype.buildFromPoint(p)).toPoint();
// };
// Point.prototype.square = function() {
// 	return PointExt.prototype.buildFromPoint(this).square().toPoint();
// };
// Point.prototype.invert = function() {
// 	return new Point(fp.N(this.x), this.y);
// };
// Point.prototype.divide = function(p) {
// 	return PointExt.prototype.buildFromPoint(this).multiply(PointExt.prototype.buildFromPoint(this.invert())).toPoint();
// };
// Point.prototype.exponentiate = function(exp) {
// 	return PointExt.prototype.buildFromPoint(this).exponentiate(exp).toPoint();
// };
// called with an object with x and y as strings
Point.prototype.buildFromCoords = function(coords) {
	return new Point(fp.fromHexString(coords.x, 36), fp.fromHexString(coords.y, 36));
};

/** @this {PointExt} */
function PointExt(x, y, z, t, point) {
	// all point coordinates are constants (set at creation, never updated)
	this.x = x;
	this.y = y;
	this.z = z;
	this.t = t;
	// cache for the Point value, computed once, if needed.
	this.point = point;
}
PointExt.prototype.copy = function() {
	return new PointExt(this.x, this.y, this.z, this.t);
};
PointExt.prototype.toString = function() {
	// makes sure that we have a point representation ready
	this.toPoint();
	return fp.toStringBase(this.point.x, 10) + '-' + fp.toStringBase(this.point.y, 10);
};
PointExt.prototype.compareTo = function(p) {
	var p1 = this.toPoint();
	var p2 = p.toPoint();
	return fp.E(p1.x, p2.x) && fp.E(p1.y, p2.y) ? 0 : 1;
};
PointExt.prototype.toJSON = function() {
	return {x:this.x, y:this.y, z:this.z, t:this.t};
};
PointExt.prototype.toPoint = function() {
	if (!this.point) {
		// tracer.log("toPoint: run");
		var z = fp.I(this.z);
		this.point = new Point(fp.M(z, this.x), fp.M(z, this.y));
	}
	// else
	// 	tracer.log("toPoint: optimized !");
	return this.point;
};
PointExt.prototype.multiply = function(p) {
	var s = this.staticFp;
	var A = s.A;
	var B = s.B;
	var C = s.C;
	var D = s.D;
	var E = s.E;
	var F = s.F;
	var G = s.G;
	var H = s.H;
	var tmp = s.tmp;
	var f = fp;
	var num = f.baseclass;
	var i;

	// A = (Y1 − X1)(Y2 − X2)
	// f.Z2(this.y, this.x, A);
	// f.Z2(p.y, p.x, tmp);
	for (i = 0; i < 16; i++) {
		A[i] = this.y[i] - this.x[i];
		tmp[i] = p.y[i] - p.x[i];
	}
	f.M2(A, tmp, A);

	// B = (Y1 + X1)(Y2 + X2)
	// f.A2(this.y, this.x, B);
	// f.A2(p.y, p.x, tmp);
	for (i = 0; i < 16; i++) {
		B[i] = this.y[i] + this.x[i];
		tmp[i] = p.y[i] + p.x[i];
	}
	f.M2(B, tmp, B);

	// C = 2 * d * T1 * T2
	f.M2(f.d, this.t, C);
	f.M2(C, p.t, C);
	// f.A2(C, C, C);
	for (i = 0; i < 16; i++)
		C[i] += C[i];

	// D = 2 * Z1 * Z2
	f.M2(this.z, p.z, D);
	// f.A2(D, D, D);
	// E = B − A
	// f.Z2(B, A, E);
	// F = D − C
	// f.Z2(D, C, F);
	// G = D + C
	// f.A2(D, C, G);
	// H = B + A
	// f.A2(B, A, H);
	for (i = 0; i < 16; i++) {
		D[i] += D[i];
		E[i] = B[i] - A[i];
		F[i] = D[i] - C[i];
		G[i] = D[i] + C[i];
		H[i] = B[i] + A[i];
	}

	// 5. R.X = EF, R.Y = GH, R.Z = FG, R.T = EH
	return new PointExt(f.M2(E, F, new num(16)), f.M2(G, H, new num(16)), f.M2(F, G, new num(16)), f.M2(E, H, new num(16)));
};
PointExt.prototype.square = function() {
	var s = this.staticFp;
	var A = s.A;
	var B = s.B;
	var D = s.D;
	var E = s.E;
	var F = s.F;
	var G = s.G;
	var H = s.H;
	var f = fp;
	var num = f.baseclass;
	var i;

	// 2. A = X1²
	f.S2(this.x, A);

	// B = Y1²
	f.S2(this.y, B);

	// D = −A
	// f.N2(A, D);
	// 3. E = (X1 + Y1)² − A − B
	// f.A2(this.x, this.y, E);
	for (i = 0; i < 16; i++) {
		D[i] = -A[i];
		E[i] = this.x[i] + this.y[i];
	}
	f.S2(E, E);
	// f.Z2(E, A, E);
	// f.Z2(E, B, E);
	// 3.1 G = D + B
	// f.A2(D, B, G);
	// 3.3 H = D − B
	// f.Z2(D, B, H);

	for (i = 0; i < 16; i++) {
		E[i] -= A[i] + B[i];
		G[i] = D[i] + B[i];
		H[i] = D[i] - B[i];
	}

	// isOne is a specialized (and much cheaper) version of f.E
	if (f.isOne(this.z)) {
		var tmp = s.tmp;

		// 3.2 G2 = G - 2
		// f.Z2(G, f.TWO, tmp);
		for (i = 0; i < 16; i++)
			tmp[i] = G[i] - f.TWO[i];

		// 4. X3 = E*(G-2), Y3 = G*H, Z3 = G*(G-2), T3 = E*H,
		return new PointExt(f.M2(E, tmp, new num(16)), f.M2(G, H, new num(16)), f.M2(G, tmp, new num(16)), f.M2(E, H, new num(16)));
	} else {
		var C = s.C;

		// C = 2*Z1²
		f.S2(this.z, C);
		// f.A2(C, C, C);
		// 3.2 F = G − C
		// f.Z2(G, C, F);
		for (i = 0; i < 16; i++) {
			C[i] += C[i];
			F[i] = G[i] - C[i];
		}

		// 4. R.X = EF, R.Y = GH, R.Z = FG, R.T = EH
		return new PointExt(f.M2(E, F, new num(16)), f.M2(G, H, new num(16)), f.M2(F, G, new num(16)), f.M2(E, H, new num(16)));
	}
};

PointExt.prototype.invert = function() {
	return new PointExt(fp.N(this.x), this.y, this.z, fp.N(this.t));
};

// exp is a BigInteger
PointExt.prototype.exponentiate = function(exp) {
	// array of 2^windowsize (=16) PointExt
	var t = new Array(this.expwindowmask + 1);
	// 4. T = [one_ext,Q]
	t[0] = this.ONE;
	t[1] = this;

	// 5. Pour i de 2 à 1 << windowsize − 2 par pas de 2 :
	for (var i=2; i <= (this.expwindowmask - 1); i += 2) {
		// (a) sqr_ext(T[i], T[i/2])
		t[i] = t[i/2].square();

		// (b) mul_ext(T[i + 1], T[i],Q)
		t[i+1] = t[i].multiply(this);
	}

	// 6. S = one_ext
	var s = this.ONE;

	// 7. Pour i allant de dbitzise(n)/windowsizee − 1 à 0 par pas de -1 :
	var l = Math.ceil(exp.bitLength() / this.expwindowsize);
	for (var i=l-1; i >= 0; i -= 1) {
		// (a) mul_ext(S, S, T[n >> (i * windowsize)&windowmask])
		var index = exp.shiftRight(i * this.expwindowsize).and(this.expwindowmaskBn);
		s = s.multiply(t[index.byteValue()]);

		// Si i !=0, répéter windowsize fois : sqr_ext(S, S)
		if (i != 0)
			for (var j = 0; j < this.expwindowsize; j++)
				s = s.square();
	}
	return s;
};

// static allocation for intermediate results
// used by multiply and square, which are mutually exclusive and don't call each other
PointExt.prototype.staticFp = {
	A: new fp.baseclass(16),
	B: new fp.baseclass(16),
	C: new fp.baseclass(16),
	D: new fp.baseclass(16),
	E: new fp.baseclass(16),
	F: new fp.baseclass(16),
	G: new fp.baseclass(16),
	H: new fp.baseclass(16),
	tmp: new fp.baseclass(16)
};

PointExt.prototype.buildFromPoint = function(point) {
	return new PointExt(point.x, point.y, fp.ONE, fp.M(point.x, point.y), point);
};

PointExt.prototype.ONE = PointExt.prototype.buildFromPoint({x:fp.ZERO, y:fp.ONE})
PointExt.prototype.expwindowsize = 4;
PointExt.prototype.expwindowmask = (1 << PointExt.prototype.expwindowsize) - 1;
PointExt.prototype.expwindowmaskBn = new BigInteger('' + PointExt.prototype.expwindowmask);

// an Operand can be resolved (= numerical value is available) or not (operations still pending)

// Operand is abstract. child classes are:
//	- GroupElement
//		- invert / multiply / divide / exponentiate
//  - OperandBigNum
//		- add / subtract / multiply / mod
//	- OperandString
//		- concat (will add all supplied string at the end)
//		- SHA256

// Operand operations always return a new Operand.
//   they call chooseDelay to choose wether it will be a resolved one or not on the basis of
//		- if the operands passed are resolved or not
//		- if 'immediate' mode is forced (passed as an optional 'true' argument)

var OperandSerial = 1;
/** @this {Operand} */
function Operand(value, operation, op1, op2) {
	this.serial = OperandSerial++;

	// if the operation is resolved, 'operation' is undefined and the value is set
	this._operation = undefined;
	this._operand1 = undefined;
	this._operand2 = undefined;
	this._value = undefined;

	// sorted list of operations to run to resolve us
	this.resolutionQueue = null;

	if (value != null && value != undefined) {
		// Operand is already resolved
		this._value = value;
	} else {
		// op1 must be an Operand. op2 can be a raw value, it will be simply fed to the operation
		this._operation = operation;
		this._operand1 = op1;
		this._operand2 = op2 || undefined;
	}
}

Operand.prototype.delayed = true;

Operand.prototype.clearStats = function() {
	throw new Error("No stats at Operand root level");
}

Operand.prototype.isResolved = function() {
	return this._value !== undefined;
};

Operand.prototype.value = function() {
	if (this._value === undefined)
		throw new Error("this operation is not resolved yet");
	return this._value;
};
Operand.prototype.toJSON = function() {
	if (this._value === undefined)
		throw new Error("this operation is not resolved yet");
	return this._value.toJSON();
};

// try to run the operation, throws if operands are not resolved yet
Operand.prototype.resolve = function() {
	if (this.isResolved())
		throw new Error("this operation is already resolved");
	if (!this._operand1.isResolved())
		throw new Error("operand1 is not resolved yet");
	if (this._operand2 !== undefined && this._operand2.constructor === GroupElement && !this._operand2.isResolved())
		throw new Error("operand2 is not resolved yet");

	var val = undefined;
	var op1 = this._operand1;
	var op2 = this._operand2;

	// call the operation, forcing immediate resolution
	try {
		var args = op2 !== undefined ? [op2, true] : [true];
		val = this._operation.apply(op1, args).value();
	} catch(e) {
		throw new Error("error running " + this._operation.name + " operation available on operand " + op1.toString() + ": " + e);
	}

	this._value = val;
	// nil the operational arguments
	this._operation = this._operand1 = this._operand2 = undefined;
	return this;
};

// lists the resolutions that need to be done
Operand.prototype.buildResolutionQueue = function() {

	this.resolutionQueue = [];

	if (this.isResolved())
		return

	// !!! move to support list of operands ? the list is different for each operation (1 (invert, sha), 2 (add, ...), n (build string))

	// iteratively walk the whole tree, keep links to all unresolved nodes
	var stack = [this];
	var alreadyadded = {};

	// for each operand on the stack
	while (stack.length >0) {
		var op = stack.pop();

		// else add to resolve list
		this.resolutionQueue.push(op);

		function add(op) {
			if (op !== undefined && op.constructor === Operand && !op.isResolved() && !alreadyadded[op.serial]) {
				alreadyadded[op.serial] = 1;
				stack.push(op);
			}
		}

		// operands
		var oplist = [op._operand1, op._operand2];
		for (var i=0; i<oplist.length; i++)
			add(oplist[i]);
	}

	// sort them in ascending order of serial
	this.resolutionQueue.sort(function(a, b) { return a.serial - b.serial; });
	return this;
};

Operand.prototype.resolveFull = function() {
	this.buildResolutionQueue();

	this.resolutionQueue.forEach(function(op) {
		op.resolve();
	});
	return this;
};

Operand.prototype.isLong = function() {
	if (this.isResolved())
		throw new Error("this operation is already resolved");
	// "this" operand is of the result type, only _operand1 knows if the _operation will be long
	return this._operand1.isLongOperation ? this._operand1.isLongOperation(this._operation) : false;
};

Operand.prototype.chooseDelay = function(immediate, op) {

	// can we run it immediately ? no if some operand is not resolved yet
	var needDelay = !this.isResolved() || (op && !op.isResolved());
	if (needDelay && immediate)
		throw new Error("Attempt to run immediate operation with unresolved operands");

	// should we run it immediately ? yes if it is needed or explicitely required
	if (needDelay || (this.delayed && !immediate)) {
		return true;
	}
	return false;
};

/** @this {OperandBignum} */
function OperandBignum(value, name, operation, op1, op2) {
	// build a resolved Operand
	Operand.call(this, value, operation, op1, op2);
	this.name = name || null;
}
extend(Operand, OperandBignum);

// only implements the operations needed for proof challenge/response

// modulo is a OperandBignum too (it's always Q anyway)
OperandBignum.prototype.mod = function(modulo, immediate) {
	if (modulo.constructor === BigInteger)
		modulo = new OperandBignum(modulo);

	if (this.chooseDelay(immediate, modulo)) {
		// tracer.log("Delaying OperandBignum/mod");
		return new OperandBignum(null, null, OperandBignum.prototype.mod, this, modulo);
	} else {
		this.stats.mod += 1;
		// tracer.log("Processing immediate OperandBignum/mod: " + this._value.toString());
		return new OperandBignum(this._value.mod(modulo.value()));
	}
};
OperandBignum.prototype.add = function(op, immediate) {
	if (op.constructor === BigInteger)
		op = new OperandBignum(op);

	if (this.chooseDelay(immediate, op)) {
		// tracer.log("Delaying OperandBignum/add");
		return new OperandBignum(null, null, OperandBignum.prototype.add, this, op);
	} else {
		this.stats.add += 1;
		// tracer.log("Processing immediate OperandBignum/add: " + this._value.toString() + " and " + op._value.toString());
		return new OperandBignum(this._value.add(op.value()));
	}
};
OperandBignum.prototype.subtract = function(op, immediate) {
	if (op.constructor === BigInteger)
		op = new OperandBignum(op);

	if (this.chooseDelay(immediate, op)) {
		// tracer.log("Delaying OperandBignum/subtract");
		return new OperandBignum(null, null, OperandBignum.prototype.subtract, this, op);
	} else {
		this.stats.subtract += 1;
		// tracer.log("Processing immediate OperandBignum/subtract: " + this._value.toString() + " and " + op._value.toString());
		return new OperandBignum(this._value.subtract(op.value()));
	}
};
OperandBignum.prototype.multiply = function(op, immediate) {
	if (op.constructor === BigInteger)
		op = new OperandBignum(op);

	if (this.chooseDelay(immediate, op)) {
		// tracer.log("Delaying OperandBignum/multiply");
		return new OperandBignum(null, null, OperandBignum.prototype.multiply, this, op);
	} else {
		this.stats.multiply += 1;
		// tracer.log("Processing immediate OperandBignum/multiply: " + this._value.toString() + " and " + op._value.toString());
		return new OperandBignum(this._value.multiply(op.value()));
	}
};

OperandBignum.prototype.clearStats = function() {
	OperandBignum.prototype.stats = {
		add: 0,
		subtract: 0,
		multiply: 0,
		mod: 0,
		toJSON: function() {
			return {
				"add": this.add,
				"subtract": this.subtract,
				"multiply": this.multiply,
				"mod": this.mod
			};
		}
	};
};
OperandBignum.prototype.clearStats();

/** @this {OperandString} */
function OperandString(value, operation, op1, op2) {
	// build a resolved Operand
	Operand.call(this, value, operation, op1, op2);
}
extend(Operand, OperandString);

// str is supposed to be an OperandString too (but is converted on the fly if needed)
OperandString.prototype.concat = function(str, immediate) {
	if (typeof str === 'string')
		str = new OperandString(str);

	if (this.chooseDelay(immediate, str)) {
		// tracer.log("Delaying OperandString/concat");
		return new OperandString(null, OperandString.prototype.concat, this, str);
	} else {
		this.stats.concat += 1;
		// tracer.log("Processing immediate OperandString/concat: " + this._value + " and " + str._value);
		return new OperandString(this._value + str._value);
	}
};
// !!! for later, an operation that takes a template (with _ to be replaced) and a list of operands
// this implies that "buildResolutionQueue" needs to be smarter to retrieve the actual list of operands

// sha256 returns a BigInteger
OperandString.prototype.sha256 = function(immediate) {
	if (this.chooseDelay(immediate)) {
		// tracer.log("Delaying OperandString/sha256");
		return new OperandBignum(null, null, OperandString.prototype.sha256, this);
	} else {
		this.stats.sha256 += 1;
		// tracer.log("Processing immediate OperandString/sha256: " + this._value);
		return new OperandBignum(new BigInteger(SHA.create("SHA-256", "TEXT", "HEX").hash(this._value), 16));
	}
};

OperandString.prototype.clearStats = function() {
	OperandString.prototype.stats = {
		sha256: 0,
		concat: 0,
		toJSON: function() {
			return {
				"sha256": this.sha256,
				"concat": this.concat
			};
		}
	};
};
OperandString.prototype.clearStats();

//---------------------- abstract GroupCyclic --------------------------------------------------
/** @this {GroupCyclic} */
function GroupCyclic(neutral, params) {
	// P is the modulo of the group
	this.modulo = new BigInteger(params.p, 36);
	// Q is the number of elements in the group (order)
	this.order = new BigInteger(params.q, 36);
	// one is the neutral element
	this.neutral = this.newElement(this.buildValueFromObject(neutral, true), 'ONE');
	// G is the generator. G.exponentiate(n) will generate the nth element of the group
	this.generator = this.newElement(this.buildValueFromObject(params.g, true), 'G');
	this.generatorInverse = this.generator.invert(true);
	this.generatorInverse.name = '1/G';

	// convenience aliases
	this.Q = this.order;
	this.P = this.modulo;
	this.G = this.generator;
	this.invG = this.generatorInverse;
	this.one = this.neutral;
}

GroupCyclic.prototype.toString = function() {
	return "[group neutral: " + this.neutral.toString() + "]";
};
GroupCyclic.prototype.buildJSONelement = function(value) {
	return value.toJSON();
};

// deserialize a "value" from an input (typically JSON). Nocheck is necessary to avoid calling isMember on G and one during setup
GroupCyclic.prototype.buildValueFromObject = function(serialized, nocheck) {
	throw new Error("Called buildValueFromObject on an abstract group");
};
// checks is an element is a member of that group
GroupCyclic.prototype.isMember = function(value) {
	// check Lagrange theorem
	if (this.composeSelfN(value, this.order).compareTo(this.neutral._value) != 0)
		return false;
	return true;
};
GroupCyclic.prototype.compare = function(valueA, valueB) {
	throw new Error("Called areEquals on an abstract group");
};
GroupCyclic.prototype.areEquals = function(valueA, valueB) {
	return this.compare(valueA, valueB) == 0;
};
// returns the result of composition of A with B
GroupCyclic.prototype.compose = function(valueA, valueB) {
	throw new Error("Called compose on an abstract group");
};
// returns the result of composition of A with the invert of B (aka. divide)
GroupCyclic.prototype.composeInvert = function(valueA, valueB) {
	return this.compose(valueA, this.invert(valueB));
};

// returns the result of composition of A with itself, N times
GroupCyclic.prototype.composeSelfN = function(valueA, times) {
	// naive implementation, should hopefully be replaced with optimized one
	if (times == 0)
		return this.neutral;
	var acc = valueA;
	for (var i=1; i<times; i++)
		acc = this.compose(acc, valueA);
	return acc;
};
GroupCyclic.prototype.newElement = function(value, name) {
	return new GroupElement(this, value, name);
};

GroupCyclic.prototype.invert = function(value) {
	throw new Error("Called invert on an abstract group");
};

GroupCyclic.prototype.isLongOperation = function(operation, value) {
	return false;
};

//---------------------- GroupElement --------------------------------------------------
/** @this {GroupElement} */
function GroupElement(group, value, name, operation, op1, op2) {
	if (!group.constructor == GroupCyclic)
		throw new Error("Group element must be supplied with a valid group");

	// build a resolved Operand
	Operand.call(this, value, operation, op1, op2);

	this._group = group;
	this.name = name || null;
}
extend(Operand, GroupElement);

// set new value
GroupElement.prototype.set = function(value) {
	if (!this._group.isMember(value)) 
		throw new Error("Attempt to set a group element with a invalid value !");
	this._value = value;
	return this;
};
GroupElement.prototype.toJSON = function() {
	if (this._value !== undefined)
		return this._group.buildJSONelement(this._value);
	else
		return "<unresolved operand>";
};

GroupElement.prototype.isNeutral = function() {
	return this._group.compare(this._value, this._group.neutral) == 0;
};

GroupElement.prototype.getGroup = function() {
	return this._group;
};

GroupElement.prototype.compareTo = function(element) {
	if (element.getGroup() != this._group)
		throw new Error("Attempt to compare elements from different groups !");
	return this._group.compare(this._value, element.value());
};

GroupElement.prototype.equals = function(element) {
	if (element.getGroup() != this._group)
		throw new Error("Attempt to compare elements from different groups !");
	return this._group.areEquals(this._value, element.value())
};

// checks that this element actually belongs to the group
GroupElement.prototype.check = function() {
	return this._group.isMember(this._value);
};

GroupElement.prototype.toString = function(nosymbolic, immediate) {
	if (this.chooseDelay(immediate)) {
		// tracer.log("Delaying GroupElement/toString");
		return new OperandString(null, GroupElement.prototype.toString, this, nosymbolic);
	} else {
		this.stats.toString += 1;
		// tracer.log("Processing immediate GroupElement/toString");
		return new OperandString((!nosymbolic && this.name) || this._value.toString());
	}
};

GroupElement.prototype.compose = function(element, immediate) {
	// groups must be the same
	if (element.getGroup() != this._group)
		throw new Error("Attempt to do group compose between elements of different groups !");
	// if (!this.check())
	// 	throw new Error("Attempt to do group compose on an invalid group member !");
	// if (!element.check())
	// 	throw new Error("Attempt to do group compose with an invalid group member !");

	// quick response: compose with neutral does nothing
	if (element === this._group.neutral)
		return this;

	if (this.chooseDelay(immediate, element)) {
		// tracer.log("Delaying GroupElement/compose");
		return new GroupElement(this._group, null, null, GroupElement.prototype.compose, this, element);
	} else {
		this.stats.compose += 1;
		// tracer.log("Processing immediate GroupElement/compose: " + this.toString(false, true) + " and " + element.toString(false, true));
		return this._group.newElement(this._group.compose(this._value, element.value()));
	}
};

GroupElement.prototype.composeInvert = function(element, immediate) {
	// groups must be the same
	if (element.getGroup() != this._group)
		throw new Error("Attempt to do group compose between elements of different groups !");
	// if (!this.check())
	// 	throw new Error("Attempt to do group compose on an invalid group member !");
	// if (!element.check())
	// 	throw new Error("Attempt to do group compose with an invalid group member !");

	// quick response: composeInvert with neutral does nothing
	if (element === this._group.neutral)
		return this;

	if (this.chooseDelay(immediate, element)) {
		// tracer.log("Delaying GroupElement/composeInvert");
		return new GroupElement(this._group, null, null, GroupElement.prototype.composeInvert, this, element);
	} else {
		this.stats.composeInvert += 1;
		// tracer.log("Processing immediate GroupElement/composeInvert: " + this.toString(false, true) + " and " + element.toString(false, true));
		return this._group.newElement(this._group.composeInvert(this._value, element.value()));
	}
};

// exp is a OperandBignum or a BigInteger (that we'll wrap)
GroupElement.prototype.composeSelfN = function(exp, immediate) {
	if (exp.constructor === BigInteger)
		exp = new OperandBignum(exp);
	// groups must be the same
	// if (!this.check())
	// 	throw new Error("Attempt to do group composeSelfN on an invalid group member !");

	// quick response for exp=0, as it is not supported by at least a BigInteger lib.
	if (exp.value().compareTo(BigInteger.ZERO) == 0)
		return this._group.neutral;
	if (exp.value().compareTo(BigInteger.ONE) == 0)
		return this;

	if (this.chooseDelay(immediate, exp)) {
		// tracer.log("Delaying GroupElement/composeSelfN");
		return new GroupElement(this._group, null, null, GroupElement.prototype.composeSelfN, this, exp);
	} else {
		this.stats.composeSelfN += 1;
		// tracer.log("Processing immediate GroupElement/composeSelfN: " + this.toString(false, true) + " and " + exp.value().toString());
		return this._group.newElement(this._group.composeSelfN(this._value, exp.value()));
	}
};
GroupElement.prototype.invert = function(immediate) {
	// if (!this.check())
	// 	throw new Error("Attempt to do group invert on an invalid group member !");

	if (this.chooseDelay(immediate)) {
		// tracer.log("Delaying GroupElement/invert");
		return new GroupElement(this._group, null, null, GroupElement.prototype.invert, this);
	} else {
		this.stats.invert += 1;
		// tracer.log("Processing immediate GroupElement/invert: " + this.toString(false, true));
		return this._group.newElement(this._group.invert(this._value));
	}
};

GroupElement.prototype.isLongOperation = function(operation) {
	return this._group.isLongOperation(operation, this._value);
};

// operation aliases for multiply notation
GroupElement.prototype.multiply = GroupElement.prototype.compose;
GroupElement.prototype.divide = GroupElement.prototype.composeInvert;
GroupElement.prototype.exponentiate = GroupElement.prototype.composeSelfN;

GroupElement.prototype.clearStats = function() {
	GroupElement.prototype.stats = {
		compose: 0,
		composeSelfN: 0,
		composeInvert: 0,
		invert: 0,
		toString: 0,
		toJSON: function() {
			return {
				"compose": this.compose,
				"composeSelfN": this.composeSelfN,
				"composeInvert": this.composeInvert,
				"invert": this.invert,
				"toString": this.toString
			};
		}
	};
};
GroupElement.prototype.clearStats();

//------------------------------------------------------------------------
// the constructor expects the modulo as a BigInteger
/** @this {GroupBigIntMod} */
function GroupBigIntMod(params) {
	// p is the modulo
	GroupCyclic.call(this, "1", params);
}
extend(GroupCyclic, GroupBigIntMod);

GroupBigIntMod.prototype.buildValueFromObject = function(serialized) {
	if (typeof serialized != 'string')
		throw new Error("Can't build a BigIntMod group element value from a " + (typeof serialized));
	// group members are serialized as hex strings, values are BigInteger
	return new BigInteger(serialized, 36);
}
// not sure how to check if a given value is a member of that group. Check that < modulo is not enough
GroupBigIntMod.prototype.isMember = function(value) { return true; }
// GroupBigIntMod.prototype.isMember = function(value) {
// 	if (value.compareTo(this.modulo) > 0)
// 		return false;
// 	return GroupCyclic.prototype.isMember.call(this, value);
// }
GroupBigIntMod.prototype.compare = function(valueA, valueB) {
	return valueA.compareTo(valueB);
}
GroupBigIntMod.prototype.compose = function(valueA, valueB) {
	// tracer.log(`Calling multiply with\n- ${valueA.toString()}\n- ${valueB.toString()}\n- ${this.modulo.toString()}`);
	return valueA.multiply(valueB).mod(this.modulo);
}
GroupBigIntMod.prototype.composeSelfN = function(valueA, times) {
	// tracer.log(`Calling modPow with\n- value ${valueA.toString()}\n- times ${times}\n- mod ${this.modulo.toString()}`);
	return valueA.modPow(times, this.modulo);
}
GroupBigIntMod.prototype.invert = function(value) {
	return value.modInverse(this.modulo);
}

// values are Point

function GroupECC(params) {
	GroupCyclic.call(this, {x:"0", y:"1"}, {
		p: 'not used',
		q: params.q,
		g: params.g
	});
}
extend(GroupCyclic, GroupECC);

GroupECC.prototype.buildJSONelement = function(value) {
	// value is a PointExt, convert to Point
	var p = value.toPoint();
	return {
		// x: btoa(hex2bin(fp.toHexString(value.x))),
		// y: btoa(hex2bin(fp.toHexString(value.y)))
		"x": fp.toStringBase(p.x, 36), // or 16 for hexa (or 32 for double hexa)
		"y": fp.toStringBase(p.y, 36)
	};
};

GroupECC.prototype.buildValueFromObject = function(serialized, nocheck) {
	// check container and coordinates type
	if (typeof serialized != 'object' || typeof serialized.x != 'string' || typeof serialized.y != 'string')
		throw new Error("Can't build an ECC group element value from a " + (typeof serialized));

	var newValue = PointExt.prototype.buildFromPoint(Point.prototype.buildFromCoords(serialized));
	// var newValue = Point.prototype.buildFromCoords(serialized);
	if (!nocheck && !this.isMember(newValue))
		throw new Error("This value is not a member of the group");

	return newValue;
};
GroupECC.prototype.isMember = function(value) {
	// check that x and y are > 0 and < P
	// check the Twisted Edward equation -x2 + y2 = 1 + d*x2*y2
	var x2 = fp.S(value.x);
	var y2 = fp.S(value.y);
	if (!fp.E(fp.A(fp.Z(fp.A(fp.M(fp.d, x2, y2), x2), y2), fp.ONE), fp.ZERO))
		return false;
	// check Lagrange
	return GroupCyclic.prototype.isMember.call(this, value);
};
GroupECC.prototype.compare = function(valueA, valueB) {
	// we have no "order in the plane", so just return 0 if equal, 1 else
	return valueA.isEqual(valueB) ? 0 : 1;
};
GroupECC.prototype.compose = function(valueA, valueB) {
	// Mult
	return valueA.multiply(valueB);
};
GroupECC.prototype.composeSelfN = function(valueA, times) {
	// Exp
	return valueA.exponentiate(times);
};
GroupECC.prototype.invert = function(value) {
	// invert y coordinate !
	return value.invert();
};

GroupECC.prototype.isLongOperation = function(operation, value) {
	// the only long operations are exponentiates and serialization of points that don't have a cached point already
	return operation === 'composeSelfN' || (operation === 'toString' && value.point === null);
};
/** @this {Proof} */
function Proof(challenge, response) {
	this.challenge = challenge;
	this.response = response;

	this.toString = function() {
		return "Proof [challenge=" + challenge + ", response=" + response + "]";
	};
	this.copy = function() {
		return new Proof(this.challenge, this.response);
	};
	// this.toJSON = function() {
	// 	return {
	// 		"challenge": this.challenge,
	// 		"response": this.response
	// 	};
	// };
}

function elGamalCipherSingle(G, Y, choice, random) {
	// 1. pick a random r € Zq
	// 2. alpha = g^r
	var alpha = G.exponentiate(random);
	// 3. beta = y^r . g^m
	var beta = Y.exponentiate(random).multiply(G.exponentiate(new BigInteger(choice + '')));

	return new CipherText(alpha, beta, choice, random);
}
/** @this {CipherText} */
function CipherText(alpha, beta, choice, random) {
	// alpha & beta are GroupMembers
	this.alpha = alpha;
	this.beta = beta;
	// choice and random used to compute alpha/beta
	this.choice = choice;
	this.random = random;
	this.proof = null;

	// multiply this CipherText with another, outputs a new CipherText
	this.multiply = function(b) {
		return new CipherText(this.alpha.multiply(b.alpha), this.beta.multiply(b.beta), this.choice + b.choice, this.random.add(b.random));
	}
	this.copy = function() {
		return new CipherText(this.alpha, this.beta, this.choice, this.random);
	}
	this.equals = function(ct) {
		if (!ct)
			return false;
		if (this == ct)
			return true;
		if (this.alpha.equals(ct.alpha) && this.beta.equals(ct.beta))
			return true;
		return false;
	}
	this.toString = function() {
		return "CipherText [alpha=" + this.alpha + ", beta=" + this.beta + ", choice=" + this.choice + ", random=" + this.random.toString(36) + "]";
	}
	this.toJSON = function() {
		return {
			alpha: this.alpha,
			beta: this.beta,
			choice: this.choice,
			proof: this.proof
		};
	}
}
/** @this {IndividualProofGenerator} */
function IndividualProofGenerator(Q, G, Y, min, max, zkp) {

	// precompute 1/g^n (disjunctions)
	// init the first element with [min, 1/g^min]
	var invg = G.getGroup().invG;
	var disjuncts = {};
	disjuncts[min] = invg.exponentiate(new BigInteger('' + min));

	// add elements up to max, multiplying by 1/g each time
	for (var i = 1; i <= max-min; i++)
		disjuncts[min+i] = disjuncts[min+i-1].multiply(invg);

	this.iprove = function(alpha, beta, elements) {

		// building the proof string one step at a time
		var proofStr = new OperandString('prove|' + zkp + '|');
		proofStr = proofStr.concat(alpha.toString(true));
		proofStr = proofStr.concat(',');
		proofStr = proofStr.concat(beta.toString(true));
		proofStr = proofStr.concat('|');
		for (var i=0; i<elements.length; i++) {
			proofStr = proofStr.concat(elements[i].A.toString(true));
			proofStr = proofStr.concat(',');
			proofStr = proofStr.concat(elements[i].B.toString(true));
			if (i !== elements.length-1)
				proofStr = proofStr.concat(',');
		}
		var hashbe = proofStr.sha256();
		return hashbe.mod(Q);

		// var listABs = [];
		// for (var i=0; i<elements.length; i++)
		// 	listABs.push(elements[i].A.toString(true) + ',' + elements[i].B.toString(true));
		// var proofStr = 'prove|' + zkp + '|' + alpha.toString(true) + ',' + beta.toString(true) + '|' + listABs.join(',');
		// tracer.log("proofStr: " + proofStr);

		// var hash = SHA.create("SHA-256", "TEXT", "HEX").hash(proofStr);
		// var hashbe = new BigInteger(hash, 16);
		// return hashbe.mod(Q);
	};

	// this is used to identify the group of randoms (incremented each time we compute a proof)
	var randomGroupIndex = 0;

	this.compute = function(ct) {

		// we will have a Proof (=challenge/response pair) for each possible value
		var proof = new Array(max-min+1);

		// prepare commitments (2 * n * GroupElement)
		var commitments = new Array(max-min+1);

		// total_challenges
		var total_challenges = new OperandBignum(BigInteger.ZERO);

		randomGroupIndex++;

		// pour chaque disjunction ou plutot pour avoir un membre de l'intervalle en résumé, on calcul le 1. de la Proofs of interval membership à savoir:
		// 1. for j!=i
		// (a) create pij with a random challenge and a random response
		// (b) compute Aj = g^response / alpha^challenge and Bj = y^response / (beta/g^Mj)^challenge where g^Mj is a disjunction = 1/g^Mj
		// fill proof & commitment for i != choices[index]
		for(var i=min; i<=max; i++) {
			if (i != ct.choice) {
				var challenge = new OperandBignum(randomizeUtils.randomize(Q), 'iproof_rand_challenge_choice:' + randomGroupIndex + '_value:' + i);
				var response = new OperandBignum(randomizeUtils.randomize(Q), 'iproof_rand_response_choice:' + randomGroupIndex + '_value:' + i);
				proof[i-min] = new Proof(challenge, response);
				commitments[i-min] = {
					A: G.exponentiate(response).divide(ct.alpha.exponentiate(challenge)),
					B: Y.exponentiate(response).divide(ct.beta.multiply(disjuncts[i]).exponentiate(challenge))
				};
				total_challenges = total_challenges.add(challenge);
			}
		}

		// 2. pii is created as follows
		// compute proof for i = choices[index]

		// (a) pick a random w € Zq
		var w = new OperandBignum(randomizeUtils.randomize(Q), 'iproof_rand_w_choice:' + randomGroupIndex);
		// (b) compute Ai = g^w and Bi = y^w
		commitments[ct.choice-min] = {
			A: G.exponentiate(w),
			B: Y.exponentiate(w)
		};

		// (c) challenge(pii) = Hiprove(S,alpha,beta,A0,B0,...,Ak,Bk) - SIGMA(j!=i) challenge(pij) mod q
		var hiprove = this.iprove(ct.alpha, ct.beta, commitments);
		var challenge = hiprove.subtract(total_challenges).mod(Q);
		// (d) response(pii) = w + r x challenge(pii) mod q
		var response = w.add(ct.random.multiply(challenge)).mod(Q);

		proof[ct.choice-min] = new Proof(challenge, response);

		ct.proof = proof;
	}
}

function Hproof(Q, prefix, zkp, elements, commitments) {

	// building the proof string one step at a time
	var proofStr = new OperandString(prefix + '|' + zkp + '|');
	for (var i=0; i<elements.length; i++) {
		proofStr = proofStr.concat(elements[i].toString(true));
		if (i !== elements.length-1)
			proofStr = proofStr.concat(',');
	}
	proofStr = proofStr.concat('|');
	for (var i=0; i<commitments.length; i++) {
		proofStr = proofStr.concat(commitments[i].A.toString(true));
		proofStr = proofStr.concat(',');
		proofStr = proofStr.concat(commitments[i].B.toString(true));
		if (i !== commitments.length-1)
			proofStr = proofStr.concat(',');
	}
	var hashbe = proofStr.sha256();
	return hashbe.mod(Q);

	// tracer.log('prefix: ' + prefix);
	// tracer.log('elements: ' + JSON.stringify(elements));
	// tracer.log('commitments: ' + JSON.stringify(commitments));
	// var proofStr = prefix + '|' + zkp;
	// proofStr += '|' + elements.map(function(ge) { return ge.toString(true); }).join(',');
	// proofStr += '|' + commitments.map(function(c) { return c.A.toString(true) + ',' + c.B.toString(true); }).join(',');
	// tracer.log("proofStr: " + proofStr);

	// var hash = SHA.create("SHA-256", "TEXT", "HEX").hash(proofStr);
	// var hashbe = new BigInteger(hash, 16);
	// return hashbe.mod(Q);
}

function makeProofsPossiblyBlankProof(groupParameters, zkp, min, max, c0, cS) {
	// zkp: groupMember
	// min/max: int
	// ms: int
	// c0/cs: cipherText
	var Q = groupParameters.Q;
	var G = groupParameters.G;
	var Y = groupParameters.Y;

	// all group members
	var P = [G, Y, c0.alpha, c0.beta, cS.alpha, cS.beta];

	var overallProofs = new Array(max - min + 2); // elements: Proof
	var blankProofs;

	if (c0.choice == 0) {
		// c0.choice = 0 -> NOT BLANK

		// 1. pick random challenge(pisgma) and response(pisigma) in Zq
		var challenge1 = new OperandBignum(randomizeUtils.randomize(Q), 'oproof_rand_challenge1');
		var response1 = new OperandBignum(randomizeUtils.randomize(Q), 'oproof_rand_response1');
		// 2. compute Asigma = g^response(pisigma) x alphasigma^challenge(pisigma) and Bsigma = y^response(pisigma) ×
		// betasigma^challenge(pisigma)
		var commitment1 = {
			A: G.exponentiate(response1).multiply(cS.alpha.exponentiate(challenge1)),
			B: Y.exponentiate(response1).multiply(cS.beta.exponentiate(challenge1))
		};
		// 3. pick a random w1 in Zq
		var w1 = new OperandBignum(randomizeUtils.randomize(Q), 'oproof_rand_w1');
		// 4. compute A0 = g^w1 and B0 = y^w1
		var commitment0 = {
			A: G.exponentiate(w1),
			B: Y.exponentiate(w1)
		};
		// 5. compute challenge(pi0) = Hbproof0(S, P,A0,B0,Asigma,Bsigma) − challenge(pisigma) mod q
		var h = Hproof(Q, 'bproof0', zkp, P, [commitment0, commitment1]);
		var challenge0 = h.subtract(challenge1).mod(Q);
		// 6. compute response(pi0) = w1 − c0.random × challenge(pi0) mod q
		var response0 = w1.subtract(c0.random.multiply(challenge0)).mod(Q);

		blankProofs = [new Proof(challenge0, response0), new Proof(challenge1, response1)];

		if(cS.choice < min || cS.choice > max)
			throw new Error("Bad number of set choices");

		var commitments = new Array(max - min + 2); // elements: hash with A & B

		// 1. pick random challenge(pi0) and response(pi0) in Zq
		challenge0 = new OperandBignum(randomizeUtils.randomize(Q), 'oproof_rand_challenge0');
		response0 = new OperandBignum(randomizeUtils.randomize(Q), 'oproof_rand_response0');

		// 2. compute A0 = g^response(pi0) × alpha^challenge(pi0) and B0 = y^response(pi0) × (beta0/g)^challenge(pi0)
		commitments[0] = {
			A: G.exponentiate(response0).multiply(c0.alpha.exponentiate(challenge0)),
			B: Y.exponentiate(response0).multiply(c0.beta.divide(G).exponentiate(challenge0))
		};
		var total_challenges = challenge0;
		overallProofs[0] = new Proof(challenge0, response0);

		// 3. for j > 0 and j != i:
		for (var i=1; i < max-min+2; i++) {
			// tracer.log("otherproofs for i=" + i);
			if (i != cS.choice-min+1) {
				// (a) create pij with a random challenge and a random response in Zq
				var challenge = new OperandBignum(randomizeUtils.randomize(Q), 'oproof_rand_challenge_' + i);
				var response = new OperandBignum(randomizeUtils.randomize(Q), 'oproof_rand_response_' + i);
				var nbeta = cS.beta.divide(G.exponentiate(new BigInteger('' + (min+i-1))));
				overallProofs[i] = new Proof(challenge, response);
				// (b) compute Aj = g^response × alphasigma^challenge and Bj = y^response × (betasigma/g^Mj)challenge
				commitments[i] = {
					A: G.exponentiate(response).multiply(cS.alpha.exponentiate(challenge)),
					B: Y.exponentiate(response).multiply(nbeta.exponentiate(challenge))
				};
				total_challenges = total_challenges.add(challenge);
			}
		}

		// 4. pick a random w2 € Zq
		var w2 = new OperandBignum(randomizeUtils.randomize(Q), 'oproof_rand_w2');
		// 5. compute Ai = g^w2 and Bi = y^w2
		commitments[cS.choice - min + 1] = {
			A: G.exponentiate(w2),
			B: Y.exponentiate(w2)
		};
		// 6. compute challenge(pii) = Hbproof1(S, P,A0,B0, . . . ,Ak,Bk) − SIGMA(j!=i) challenge(pij) mod q
		h = Hproof(Q, 'bproof1', zkp, P, commitments);
		var challenge = h.subtract(total_challenges).mod(Q);
		// 7. compute response(pii) = w2 − rsigma × challenge(pii) mod q
		var response = w2.subtract(cS.random.multiply(challenge)).mod(Q);
		overallProofs[cS.choice-min+1] = new Proof(challenge, response);
	} else {
		// c0.choice = 1 ->  BLANK

		// proof of c0.choice = 0 \/ cS.choice = 0 (second is true)
		if (cS.choice != 0)
			throw new Error("cS.choice > 0 on a blank vote ?");

		// The proof blank_proof of the whole statement is the couple of proofs (pi0, pisigma) built as in section
		// 4.9.1, but exchanging
		// subscripts 0 and SIGMA everywhere except in the call to Hbproof0.
		var challenge0 = new OperandBignum(randomizeUtils.randomize(Q), 'oproof_rand_challenge0');
		var response0 = new OperandBignum(randomizeUtils.randomize(Q), 'oproof_rand_response0');
		var commitment0 = {
			A: G.exponentiate(response0).multiply(c0.alpha.exponentiate(challenge0)),
			B: Y.exponentiate(response0).multiply(c0.beta.exponentiate(challenge0))
		};
		var w1 = new OperandBignum(randomizeUtils.randomize(Q), 'oproof_rand_w1');
		var commitment1 = {
			A: G.exponentiate(w1),
			B: Y.exponentiate(w1)
		};
		var h = Hproof(Q, 'bproof0', zkp, P, [commitment0, commitment1]);
		var challenge1 = h.subtract(challenge0).mod(Q);
		var response1 = w1.subtract(cS.random.multiply(challenge1)).mod(Q);
		blankProofs = [new Proof(challenge0, response0), new Proof(challenge1, response1)];

		var commitments = new Array(max - min + 2); // elements: hash with A & B

		// * proof of c0.choice = 1 \/ min <= cS.choice <= max (first is true) *
		var total_challenges = new OperandBignum(BigInteger.ZERO);
		// 1. for j > 0:
		for (var i=1; i < max-min+2; i++) {
			// tracer.log("otherproofs for i=" + i);
			// (a) create pij with a random challenge and a random response in Zq
			var challenge = new OperandBignum(randomizeUtils.randomize(Q), 'oproof_rand_challenge');
			var response = new OperandBignum(randomizeUtils.randomize(Q), 'oproof_rand_response');
			// (b) compute Aj = g^response × alphasigma^challenge and Bj = y^response × (betasigma/g^Mj )^challenge
			var nbeta = cS.beta.divide(G.exponentiate(new BigInteger('' + (min+i-1))));
			overallProofs[i] = new Proof(challenge, response);
			commitments[i] = {
				A: G.exponentiate(response).multiply(cS.alpha.exponentiate(challenge)),
				B: Y.exponentiate(response).multiply(nbeta.exponentiate(challenge))
			};
			total_challenges = total_challenges.add(challenge);
		}

		// 2. pick a random w2 € Zq
		var w2 = new OperandBignum(randomizeUtils.randomize(Q), 'oproof_rand_w2');
		// 3. compute A0 = g^w2 and B0 = y^w2
		commitments[0] = {
			A: G.exponentiate(w2),
			B: Y.exponentiate(w2)
		};
		// 4. compute challenge(pi0) = Hbproof1(S, P,A0,B0, . . . ,Ak,Bk) − SIGMA(j>0) challenge(pij) mod q
		h = Hproof(Q, 'bproof1', zkp, P, commitments);
		var challenge = h.subtract(total_challenges).mod(Q);
		// 5. compute response(pi0) = w2 − c0.random × challenge(pi0) mod q
		var response = w2.subtract(c0.random.multiply(challenge)).mod(Q);
		overallProofs[0] = new Proof(challenge, response);
	}
	return {
		"blankProofs": blankProofs,
		"overallProofs": overallProofs
	};
}

function generateOtherProofs(group, question, zkp, ciphered) {
	var nbChoices = ciphered.length;
	var min = question.minSelection;
	var max = question.maxSelection;
	// computing blank proof
	// les preuves ne sont pas calculés de la même façon si blanc autorisé ou pas.
	if (question.blankAllowed) {
		tracer.log("otherproofs with BLANK");
		// first bit is for the blank, skip it
		var ctSumc = ciphered.slice(1).reduce(function(t, u) { return t.multiply(u); });
		var sum1 = ctSumc.choice + ciphered[0].choice;
		if (sum1.choice < min || sum1.choice > max)
			throw new Error("Bad number of set choices (min:" + min + ", max:" + max + ", got:" + sum1.choice + ")");

		// we should probably check the min < iSumm < max
		return makeProofsPossiblyBlankProof(group, zkp, min, max, ciphered[0], ctSumc);

	} else {
		// blank not allowed
		tracer.log("otherproofs no BLANK");

		// proof is about the sums of choices belongs to the min/max range
		// build a fake ciphertext that is the "sum" of all the others
		var ctSumc = ciphered.reduce(function(t, u) { return t.multiply(u); });
		if (ctSumc.choice < min || ctSumc.choice > max)
			throw new Error("Bad number of set choices (min:" + min + ", max:" + max + ", got:" + ctSumc.choice + ")");

		var individualProofGenerator = new IndividualProofGenerator(group.Q, group.G, group.Y, min, max, zkp);
		individualProofGenerator.compute(ctSumc);

		return {
			"blankProofs": [],
			"overallProofs": ctSumc.proof
		};
	}
}
/** @this {GroupParameters} */
function GroupParameters(groupParameters, publicKey) {

	// numeric parameters, represented as hex strings
	// Q: order of the group -> BigInteger
	// P: modulo of the group -> BigInteger
	// G: generator -> GroupElement
	// Y: public key of election -> GroupElement

	switch(groupParameters.type) {
		case 'ZpZ':
		case 'Z/pZ':
			this.group = new GroupBigIntMod(groupParameters);
			break;
		case 'ECC':
		case 'ECC25519':
			this.group = new GroupECC(groupParameters);
			break;
		default:
			throw new Error("Missing group definition for " + groupParameters.type)
	}

	this.G = this.group.generator;
	this.Q = this.group.order;
	this.P = this.group.modulo;
	this.Y = this.group.newElement(this.group.buildValueFromObject(publicKey, true), 'Y');
}
/** @this {Question} */
function Question(text, parameters) {

	this.blankAllowed = parameters.isBlankAllowed;
	this.minSelection = parameters.minSelection;
	this.maxSelection = parameters.maxSelection;
	this.minmaxdiff = parameters.maxSelection - parameters.minSelection;
	this.text = text;

	this.poolsCiphered = [[], []];
	this.choices = null;
	this.choicesNbOne = null;

	this.answersNb = parameters.nbElements;
	this.ciphered = [];

	this.answer = {
		choices: null,
		othersProofs: null
		// toJSON: function() {
		// 	return {
		// 		"choices": this.choices,
		// 		"othersProofs": this.othersProofs
		// 	};
		// }
	};
}
/** @this {Election} */
function Election(description, name, groupParameters, questions, uuid) {
	this.description = description;
	this.name = name;
	this.groupParameters = groupParameters;
	this.uuid = uuid;
	// list of Question
	this.questions = [];

	for (var i=0; i<questions.length; i++) {
		var question = questions[i];
		this.questions.push(new Question(question.text, question));
	}

	this.toJSON = function() {
		return {
			description: this.description,
			name: this.name,
			uuid: this.uuid
		};
	}
}
/** @this {Ballot} */
function Ballot(election, tokenId) {
	this.election = election;
	var token = tokenId;
	var zkp = this.election.uuid + token;
	this.finished = false;
	var progressTotal = 0;		// total number of exponentiations that we'll do
	var progressStart = null;	// how many exps we did before the votes are submitted
	this.stats = {
		tasksTotal: 0,
		taskSkipped: 0,
		resolve: 0,
		toJSON: function() {
			return {
				"tasksTotal": this.tasksTotal,
				"taskSkipped": this.taskSkipped,
				"resolve": this.resolve
			};
		}
	};
	// force clean global (!) stats
	OperandBignum.prototype.clearStats();
	OperandString.prototype.clearStats();
	GroupElement.prototype.clearStats();

	var self = this;

	if (navigator)
		tracer.log("UserAgent: " + navigator.userAgent);
	if (window) {
		tracer.log("window.crypto: " + (window.crypto !== undefined));
		tracer.log("window.msCrypto: " + (window.msCrypto !== undefined));
	}

	//--------------------------- tasks management ---------------------------

	var tasks = [];
	this.listTasks = function() {
		return tasks.map(function(t){ return t.title; });
	};
	function addTask(title, funcname, args, first) {
		self.stats.tasksTotal += 1;
		if (first)
			tasks.unshift({title: title, func: funcname, args: args});
		else
			tasks.push({title: title, func: funcname, args: args});
	}
	function addResolve(name, operand) {
		if (!operand.isResolved())
			addTask(name, self.resolveOperand, [operand], true);
	}

	this.processTask = function() {
		if(tasks.length == 0) {
			// nothing to do, schedule another try in half a second
			setTimeout(function() { self.processTask(); }, 500);
			return;
		}

		var task = tasks.shift();

		// tracer.log("running task: " + task.title);
		// var start = new Date().getTime();
		task.func.apply(this, task.args);
		// var end = new Date().getTime();
		// tracer.log("spent " + (end - start) + "ms");

		// schedule next task processing for soon
		setTimeout(function() { self.processTask(); }, 10);
	};

	//--------------------------- tasks functions ---------------------------

	this.computeBit = function(question, value, num) {
		// if the vote is started, we know the votes so don't compute extraneous bits
		if (question.choicesNbOne) {
			var needed = value == 0 ? question.answersNb - question.choicesNbOne : question.choicesNbOne;
			// tracer.log("value: " + value + ", needed: " + needed + ", num: " + num);
			if (num+1 > needed) {
				this.stats.taskSkipped += 1;
				tracer.log("We already have enough " + value + "s (needed: " + needed + "), skipping " + (num+1) + "th");
				progressTotal -= (2 + 6);
				return;
			}
		}
		var params = this.election.groupParameters;
		var r = new OperandBignum(randomizeUtils.randomize(params.Q));
		var ct = elGamalCipherSingle(params.G, params.Y, value, r);
		question.poolsCiphered[value].push(ct);

		// resolve the new ct
		addTask("Resolve ElGamal beta v=" + value + ", n=" + num, this.resolveOperand, [ct.beta], true);
		addTask("Resolve ElGamal alpha v=" + value + ", n=" + num, this.resolveOperand, [ct.alpha], true);

		this.individualProofGenerator.compute(ct);

		// resolve the proofs challenge/response
		addResolve("Resolve iproof 1 response, v=" + value + ", n=" + num, ct.proof[1].response);
		addResolve("Resolve iproof 1 challenge, v=" + value + ", n=" + num, ct.proof[1].challenge);
		addResolve("Resolve iproof 0 response, v=" + value + ", n=" + num, ct.proof[0].response);
		addResolve("Resolve iproof 0 challenge, v=" + value + ", n=" + num, ct.proof[0].challenge);
	};

	this.fillAnswers = function(question) {
		// tracer.log("Picking " + (question.answersNb - question.choicesNbOne) + "x0s and " + question.choicesNbOne + "x1s from pools");

		tracer.timeEnd("compute bits");

		// pick pre-computed ciphered from the pools into a simple list of the cipherTexts, to be used for otherProof.
		for (var i=0; i<question.answersNb; i++)
			question.ciphered.push(question.poolsCiphered[question.choices[i]].pop());

		// build the view that will be actually sent
		question.answer.choices = question.ciphered.map(function(ct) {
			return {
				"cipherText": { "alpha": ct.alpha, "beta": ct.beta },
				"individualProofs": ct.proof
			};
		})
		// tracer.log("Discarding " + question.poolsCiphered[0].length + "x0s and " + question.poolsCiphered[1].length + "x1s");
		question.poolsCiphered = [];
	};

	this.generateOtherProof = function(question) {
		tracer.time("otherproof");
		question.answer.othersProofs = generateOtherProofs(this.election.groupParameters, question, zkp, question.ciphered);
		// empty the list, won't be used again
		question.ciphered = null;

		var ovs = question.answer.othersProofs["overallProofs"];
		for (var i=ovs.length-1; i>=0; i--) {
			addResolve("Resolve oproof overall " + i + " response", ovs[i].response);
			addResolve("Resolve oproof overall " + i + " challenge", ovs[i].challenge);
		}
		var bps = question.answer.othersProofs["blankProofs"];
		if (bps.length > 0) {
			addResolve("Resolve oproof blank 1 response", bps[1].response);
			addResolve("Resolve oproof blank 1 challenge", bps[1].challenge);
			addResolve("Resolve oproof blank 0 response",  bps[0].response);
			addResolve("Resolve oproof blank 0 challenge", bps[0].challenge);
		}
	};

	this.finish = function(question) {
		tracer.timeEnd("otherproof");
		this.finished = true;
	};

	// resolve an operand, a few operations at a time. Push itself first in the queue until it has finished.
	this.resolveOperand = function(operand) {
		this.stats.resolve += 1;

		// first run, build the ordered list of operations to run
		if (!operand.resolutionQueue)
			operand.buildResolutionQueue();

		if (operand.resolutionQueue.length === 0)
			return;

		// we run operations until the next one is a long one (exponentiate)
		var maxOp = 5;
		var nbOp = 0;
		var breakAfter = false;
		do {
			var op = operand.resolutionQueue.shift();
			// tracer.log("Running " + op._operation);
			// also break after long operations
			breakAfter = op.isLong();
			op.resolve();
			nbOp++;
		} while (operand.resolutionQueue.length > 0 && !operand.resolutionQueue[0].isLong() && !breakAfter && nbOp < maxOp);
		// tracer.log("Ran " + nbOp + " operations on this task");

		if (operand.resolutionQueue.length > 0)
			addTask("Resolve... (" + operand.resolutionQueue.length + " operations pending)", this.resolveOperand, [operand], true);
	};

	//--------------------------- tasks scheduling ---------------------------

	var questionsNb = election.questions.length;
	var params = election.groupParameters;
	this.individualProofGenerator = new IndividualProofGenerator(params.Q, params.G, params.Y, 0, 1, zkp);

	tracer.time("compute bits");

	// enqueue tasks to precompute ciphered and proofs
	for (var i=0; i<questionsNb; i++) {
		var question = election.questions[i];

		// we will have between "nb-max" and "nb-min" zeroes
		// first enqueue all the mandatory bits (total-max 0, min 1)
		for (var j=0; j<question.answersNb - question.maxSelection; j++)
			addTask("Precompute mandatory bit 0 (q" + i + "/" + j + ") ElGamal", this.computeBit, [question, 0, j]);
		for (var j=0; j<question.minSelection; j++)
			addTask("Precompute mandatory bit 1 (q" + i + "/" + j + ") ElGamal", this.computeBit, [question, 1, j]);

		// then the max-min putative ones, alternated
		for (var j=0; j<question.minmaxdiff; j++) {
			var offset0 = question.answersNb - question.maxSelection + j;
			var offset1 = question.minSelection + j;
			addTask("Precompute optional bit 0 (q" + i + "/" + offset0 + ") ElGamal", this.computeBit, [question, 0, offset0]);
			addTask("Precompute optional bit 1 (q" + i + "/" + offset1 + ") ElGamal", this.computeBit, [question, 1, offset1]);
		}	

		// if blank is allowed and set, we will need 0s up to answersNb - 1
		if (question.blankAllowed)
			for (var j=question.answersNb - question.minSelection; j < question.answersNb - 1; j++)
				addTask("Precompute additional bit 0 (q" + i + "/" + j + ") ElGamal", this.computeBit, [question, 0, j]);
	}
	// Estimation of the total number of exponentiations that we'll need to do
	// - elgamal takes 2 (plus 1 trivial 0-1)
	// - iproof takes 6
	// - oproof takes 
	//   - blankAllowed == true  => 12 + (max-min)*5   (-1 if min=1 and choicesNbOne=1, but we don't know that in advance)
	//   - blankAllowed == false => 2 + (max-min)*4
	for (var i=0; i<questionsNb; i++) {
		var question = this.election.questions[i];
		progressTotal += (2 + 6) * (question.answersNb + question.minmaxdiff);

		if (question.blankAllowed)
			progressTotal += 12 + (question.minmaxdiff) * 5;
		else
			progressTotal += 2 + (question.minmaxdiff) * 4;
	}
	tracer.log("Total number of exponentiate to do: " + progressTotal);

	// start the task runner
	this.processTask();

	//--------------------------- methods for external use ---------------------------

	this.getProgress = function() {

		// The only timewise significant operations are the exponentiations
		// so the progress is an estimation of the remaining ones over the total

		// progressTotal is sometime "off by one" (if min=1 and nbChoice > min), so force 100% when finished to avoir stalling at ~98%
		if (progressStart === null)
			return 0;
		if (this.finished)
			return 1;

		// We can check on stats.operandGroup.composeSelfN how any we have done yet
		// 'vote' action sets the starting point of progress (this.startProgress)
		// Computations that we skip are added the number of spared exp to the counter

		var expDone = GroupElement.prototype.stats.composeSelfN;
		// tracer.log("exponentiate done: " + expDone);

		var percent = (expDone - progressStart) / (progressTotal - progressStart);
		// tracer.log("progress: " + percent + "%");
		return percent < 1 ? percent : 1;
	};

	this.fill = function(votes) {

		// check that we got the right number of choice bits
		if (votes.length != this.election.questions.length)
			throw new Error("Bad votes number, got " + votes.length + " while election had " + questionsNb + " questions");

		// tell each question the answer it got
		for (var i=0; i<questionsNb; i++) {
			var question = this.election.questions[i];
			question.choices = votes[i];
			question.choicesNbOne = votes[i].reduce(function(s, v) { return s+v; });

			// check that the submitted vote for this question has the right number of bits
			if (question.choices.length !== question.answersNb)
				throw new Error("Bad number of vote bits for question " + i + ", got " + question.choices.length + " while question had " + question.answersNb + " options");

			if (question.blankAllowed && question.choices[0] === 1) {
				// blank is allowed and the blank bit is set, check that no other one is
				if (question.choicesNbOne !== 1)
					throw new Error("Blank bit is exclusive");
			} else {
				// blank is not allowed or the blank bit is not set, check that the number of 1s is between bounds
				if (question.choicesNbOne < question.minSelection || question.choicesNbOne > question.maxSelection)
					throw new Error("Bad number of set choices (min:" + question.minSelection + ", max:" + question.maxSelection + ", got:" + question.choicesNbOne + ")");
			}

			// fill the 'answers' with pre-computed ciphered+proof for the choices
			addTask("Fill answers with pre-computed bits", this.fillAnswers, [question]);

			// compute other_proof
			addTask("Compute the overall proof", this.generateOtherProof, [question]);
		}
		addTask("Finish", this.finish, []);

		progressStart = GroupElement.prototype.stats.composeSelfN;
		// tracer.log("Progress will start at " + progressStart);
	};

	this.get = function() {
		var ret = {};

		ret["answers"] = [];
		for (var i=0; i<this.election.questions.length; i++)
			ret["answers"].push(this.election.questions[i].answer);

		// Hash is probably not used (yet?), there's no concensus on the representation of election. This is the only Base64 field.
		ret["electionHash"] = SHA.create("SHA-256", "TEXT", "B64").hash(JSON.stringify(this.election));
		ret["electionUUID"] = this.election.uuid;
		ret["tokenId"] = token;
		return ret;
	};
}
// Store the function in a global property referenced by a string:
window['JsEncryptionEngine'] = JsEncryptionEngine;

/** @this {JsEncryptionEngine} */
function JsEncryptionEngine() {

	var self = this;

	self.ballot = null;

	this.init = function(parameters) {
		var groupParameters = new GroupParameters(parameters.groupParameters, parameters.electionPublicKey);
		randomizeUtils.setRandomPool(parameters.bigIntegerRndPool);

		// ciphering only requires the self.election's public key
		var election = new Election("Election's description", "Election's name", groupParameters, parameters.questions, parameters.uuidString);
		self.ballot = new Ballot(election, parameters.tokenId);
	};

	this.setVote = function(voteList) {
		self.ballot.fill(voteList);
	};

	this.startUserProgressBar = function() {
	};

	this.getUserProgression = function(real) {
		return self.ballot === null ? 0 : self.ballot.getProgress();
	};

	this.isFinished = function() {
		return self.ballot ? self.ballot.finished : false;
	};

	this.getRemainingTime = function() {
		return (self.ballot && self.ballot.finished) ? 0 : 10;
	};

	/**
	 * JSON ##SHA256(ballotJSON/64secretCode)
	 */
	// credentials is the SHA256(login + secretCode)
	this.getBallot = function(userSecretCode) {
		var th = this;
		var slf = self;
		var ballotStr = JSON.stringify(self.ballot.get());
		var secret = SHA.create("SHA-256", "TEXT", "HEX").hash(ballotStr + userSecretCode);
		var hash = SHA.create("SHA-256", "TEXT", "B64").hash(ballotStr);
		return {
			"ballot": ballotStr,
			"secret": '##' + secret,
			"hash": hash
		};
	};

	// ----------- Dans un 2eme temps ------------
	this.ballotTypeSwitch = function() {
		// Should we switch to NH ? For now, we'll ignore the opportunity
	};

	this.getStatistics = function() {
		return {
			"operandBignum": OperandBignum.prototype.stats,
			"operandString": OperandString.prototype.stats,
			"operandGroup": GroupElement.prototype.stats,
			"ballot": self.ballot.stats
		};
	};
}

//# sourceMappingURL=crypto.bundle.js.map