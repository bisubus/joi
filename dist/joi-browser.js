(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["joi"] = factory();
	else
		root["joi"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	var Any = __webpack_require__(/*! ./any */ 1);
	var Cast = __webpack_require__(/*! ./cast */ 15);
	var Ref = __webpack_require__(/*! ./ref */ 12);
	
	// Declare internals
	
	var internals = {
	    alternatives: __webpack_require__(/*! ./alternatives */ 28),
	    array: __webpack_require__(/*! ./array */ 31),
	    boolean: __webpack_require__(/*! ./boolean */ 27),
	    binary: __webpack_require__(/*! ./binary */ 32),
	    date: __webpack_require__(/*! ./date */ 16),
	    number: __webpack_require__(/*! ./number */ 26),
	    object: __webpack_require__(/*! ./object */ 29),
	    string: __webpack_require__(/*! ./string */ 18)
	};
	
	internals.root = function () {
	
	    var any = new Any();
	
	    var root = any.clone();
	    root.any = function () {
	
	        return any;
	    };
	
	    root.alternatives = root.alt = function () {
	
	        return arguments.length ? internals.alternatives['try'].apply(internals.alternatives, arguments) : internals.alternatives;
	    };
	
	    root.array = function () {
	
	        return internals.array;
	    };
	
	    root.boolean = root.bool = function () {
	
	        return internals.boolean;
	    };
	
	    root.binary = function () {
	
	        return internals.binary;
	    };
	
	    root.date = function () {
	
	        return internals.date;
	    };
	
	    root.func = function () {
	
	        return internals.object._func();
	    };
	
	    root.number = function () {
	
	        return internals.number;
	    };
	
	    root.object = function () {
	
	        return arguments.length ? internals.object.keys.apply(internals.object, arguments) : internals.object;
	    };
	
	    root.string = function () {
	
	        return internals.string;
	    };
	
	    root.ref = function () {
	
	        return Ref.create.apply(null, arguments);
	    };
	
	    root.isRef = function (ref) {
	
	        return Ref.isRef(ref);
	    };
	
	    root.validate = function (value /*, [schema], [options], callback */) {
	
	        var last = arguments[arguments.length - 1];
	        var callback = typeof last === 'function' ? last : null;
	
	        var count = arguments.length - (callback ? 1 : 0);
	        if (count === 1) {
	            return any.validate(value, callback);
	        }
	
	        var options = count === 3 ? arguments[2] : {};
	        var schema = root.compile(arguments[1]);
	
	        return schema._validateWithOptions(value, options, callback);
	    };
	
	    root.describe = function () {
	
	        var schema = arguments.length ? root.compile(arguments[0]) : any;
	        return schema.describe();
	    };
	
	    root.compile = function (schema) {
	
	        try {
	            return Cast.schema(schema);
	        } catch (err) {
	            if (err.hasOwnProperty('path')) {
	                err.message = err.message + '(' + err.path + ')';
	            }
	            throw err;
	        }
	    };
	
	    root.assert = function (value, schema, message) {
	
	        root.attempt(value, schema, message);
	    };
	
	    root.attempt = function (value, schema, message) {
	
	        var result = root.validate(value, schema);
	        var error = result.error;
	        if (error) {
	            if (!message) {
	                error.message = error.annotate();
	                throw error;
	            }
	
	            if (!(message instanceof Error)) {
	                error.message = message + ' ' + error.annotate();
	                throw error;
	            }
	
	            throw message;
	        }
	
	        return result.value;
	    };
	
	    return root;
	};
	
	module.exports = internals.root();

/***/ },
/* 1 */
/*!********************!*\
  !*** ./lib/any.js ***!
  \********************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';
	
	// Load modules
	
	var Hoek = __webpack_require__(/*! hoek */ 6);
	var Ref = __webpack_require__(/*! ./ref */ 12);
	var Errors = __webpack_require__(/*! ./errors */ 13);
	var Alternatives = null; // Delay-loaded to prevent circular dependencies
	var Cast = null;
	
	// Declare internals
	
	var internals = {};
	
	internals.defaults = {
	    abortEarly: true,
	    convert: true,
	    allowUnknown: false,
	    skipFunctions: false,
	    stripUnknown: false,
	    language: {},
	    presence: 'optional',
	    raw: false,
	    strip: false,
	    noDefaults: false
	
	    // context: null
	};
	
	internals.checkOptions = function (options) {
	
	    var optionType = {
	        abortEarly: 'boolean',
	        convert: 'boolean',
	        allowUnknown: 'boolean',
	        skipFunctions: 'boolean',
	        stripUnknown: 'boolean',
	        language: 'object',
	        presence: ['string', 'required', 'optional', 'forbidden', 'ignore'],
	        raw: 'boolean',
	        context: 'object',
	        strip: 'boolean',
	        noDefaults: 'boolean'
	    };
	
	    var keys = Object.keys(options);
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        var opt = optionType[key];
	        var type = opt;
	        var values = null;
	
	        if (Array.isArray(opt)) {
	            type = opt[0];
	            values = opt.slice(1);
	        }
	
	        Hoek.assert(type, 'unknown key ' + key);
	        Hoek.assert(typeof options[key] === type, key + ' should be of type ' + type);
	        if (values) {
	            Hoek.assert(values.indexOf(options[key]) >= 0, key + ' should be one of ' + values.join(', '));
	        }
	    }
	};
	
	module.exports = internals.Any = function () {
	
	    Cast = Cast || __webpack_require__(/*! ./cast */ 15);
	
	    this.isJoi = true;
	    this._type = 'any';
	    this._settings = null;
	    this._valids = new internals.Set();
	    this._invalids = new internals.Set();
	    this._tests = [];
	    this._refs = [];
	    this._flags = {/*
	                   presence: 'optional',                   // optional, required, forbidden, ignore
	                   allowOnly: false,
	                   allowUnknown: undefined,
	                   default: undefined,
	                   forbidden: false,
	                   encoding: undefined,
	                   insensitive: false,
	                   trim: false,
	                   case: undefined,                        // upper, lower
	                   empty: undefined,
	                   func: false
	                   */};
	
	    this._description = null;
	    this._unit = null;
	    this._notes = [];
	    this._tags = [];
	    this._examples = [];
	    this._meta = [];
	
	    this._inner = {}; // Hash of arrays of immutable objects
	};
	
	internals.Any.prototype.isImmutable = true; // Prevents Hoek from deep cloning schema objects
	
	internals.Any.prototype.clone = function () {
	
	    var obj = Object.create(Object.getPrototypeOf(this));
	
	    obj.isJoi = true;
	    obj._type = this._type;
	    obj._settings = internals.concatSettings(this._settings);
	    obj._valids = Hoek.clone(this._valids);
	    obj._invalids = Hoek.clone(this._invalids);
	    obj._tests = this._tests.slice();
	    obj._refs = this._refs.slice();
	    obj._flags = Hoek.clone(this._flags);
	
	    obj._description = this._description;
	    obj._unit = this._unit;
	    obj._notes = this._notes.slice();
	    obj._tags = this._tags.slice();
	    obj._examples = this._examples.slice();
	    obj._meta = this._meta.slice();
	
	    obj._inner = {};
	    var inners = Object.keys(this._inner);
	    for (var i = 0; i < inners.length; ++i) {
	        var key = inners[i];
	        obj._inner[key] = this._inner[key] ? this._inner[key].slice() : null;
	    }
	
	    return obj;
	};
	
	internals.Any.prototype.concat = function (schema) {
	
	    Hoek.assert(schema && schema.isJoi, 'Invalid schema object');
	    Hoek.assert(this._type === 'any' || schema._type === 'any' || schema._type === this._type, 'Cannot merge type', this._type, 'with another type:', schema._type);
	
	    var obj = this.clone();
	
	    if (this._type === 'any' && schema._type !== 'any') {
	
	        // Reset values as if we were "this"
	        var tmpObj = schema.clone();
	        var keysToRestore = ['_settings', '_valids', '_invalids', '_tests', '_refs', '_flags', '_description', '_unit', '_notes', '_tags', '_examples', '_meta', '_inner'];
	
	        for (var i = 0; i < keysToRestore.length; ++i) {
	            tmpObj[keysToRestore[i]] = obj[keysToRestore[i]];
	        }
	
	        obj = tmpObj;
	    }
	
	    obj._settings = obj._settings ? internals.concatSettings(obj._settings, schema._settings) : schema._settings;
	    obj._valids.merge(schema._valids, schema._invalids);
	    obj._invalids.merge(schema._invalids, schema._valids);
	    obj._tests = obj._tests.concat(schema._tests);
	    obj._refs = obj._refs.concat(schema._refs);
	    Hoek.merge(obj._flags, schema._flags);
	
	    obj._description = schema._description || obj._description;
	    obj._unit = schema._unit || obj._unit;
	    obj._notes = obj._notes.concat(schema._notes);
	    obj._tags = obj._tags.concat(schema._tags);
	    obj._examples = obj._examples.concat(schema._examples);
	    obj._meta = obj._meta.concat(schema._meta);
	
	    var inners = Object.keys(schema._inner);
	    var isObject = obj._type === 'object';
	    for (var i = 0; i < inners.length; ++i) {
	        var key = inners[i];
	        var source = schema._inner[key];
	        if (source) {
	            var target = obj._inner[key];
	            if (target) {
	                if (isObject && key === 'children') {
	                    var keys = {};
	
	                    for (var j = 0; j < target.length; ++j) {
	                        keys[target[j].key] = j;
	                    }
	
	                    for (var j = 0; j < source.length; ++j) {
	                        var sourceKey = source[j].key;
	                        if (keys[sourceKey] >= 0) {
	                            target[keys[sourceKey]] = {
	                                key: sourceKey,
	                                schema: target[keys[sourceKey]].schema.concat(source[j].schema)
	                            };
	                        } else {
	                            target.push(source[j]);
	                        }
	                    }
	                } else {
	                    obj._inner[key] = obj._inner[key].concat(source);
	                }
	            } else {
	                obj._inner[key] = source.slice();
	            }
	        }
	    }
	
	    return obj;
	};
	
	internals.Any.prototype._test = function (name, arg, func) {
	
	    Hoek.assert(!this._flags.allowOnly, 'Cannot define rules when valid values specified');
	
	    var obj = this.clone();
	    obj._tests.push({ func: func, name: name, arg: arg });
	    return obj;
	};
	
	internals.Any.prototype.options = function (options) {
	
	    Hoek.assert(!options.context, 'Cannot override context');
	    internals.checkOptions(options);
	
	    var obj = this.clone();
	    obj._settings = internals.concatSettings(obj._settings, options);
	    return obj;
	};
	
	internals.Any.prototype.strict = function (isStrict) {
	
	    var obj = this.clone();
	    obj._settings = obj._settings || {};
	    obj._settings.convert = isStrict === undefined ? false : !isStrict;
	    return obj;
	};
	
	internals.Any.prototype.raw = function (isRaw) {
	
	    var obj = this.clone();
	    obj._settings = obj._settings || {};
	    obj._settings.raw = isRaw === undefined ? true : isRaw;
	    return obj;
	};
	
	internals.Any.prototype._allow = function () {
	
	    var values = Hoek.flatten(Array.prototype.slice.call(arguments));
	    for (var i = 0; i < values.length; ++i) {
	        var value = values[i];
	
	        Hoek.assert(value !== undefined, 'Cannot call allow/valid/invalid with undefined');
	        this._invalids.remove(value);
	        this._valids.add(value, this._refs);
	    }
	};
	
	internals.Any.prototype.allow = function () {
	
	    var obj = this.clone();
	    obj._allow.apply(obj, arguments);
	    return obj;
	};
	
	internals.Any.prototype.valid = internals.Any.prototype.only = internals.Any.prototype.equal = function () {
	
	    Hoek.assert(!this._tests.length, 'Cannot set valid values when rules specified');
	
	    var obj = this.allow.apply(this, arguments);
	    obj._flags.allowOnly = true;
	    return obj;
	};
	
	internals.Any.prototype.invalid = internals.Any.prototype.disallow = internals.Any.prototype.not = function (value) {
	
	    var obj = this.clone();
	    var values = Hoek.flatten(Array.prototype.slice.call(arguments));
	    for (var i = 0; i < values.length; ++i) {
	        value = values[i];
	
	        Hoek.assert(value !== undefined, 'Cannot call allow/valid/invalid with undefined');
	        obj._valids.remove(value);
	        obj._invalids.add(value, this._refs);
	    }
	
	    return obj;
	};
	
	internals.Any.prototype.required = internals.Any.prototype.exist = function () {
	
	    var obj = this.clone();
	    obj._flags.presence = 'required';
	    return obj;
	};
	
	internals.Any.prototype.optional = function () {
	
	    var obj = this.clone();
	    obj._flags.presence = 'optional';
	    return obj;
	};
	
	internals.Any.prototype.forbidden = function () {
	
	    var obj = this.clone();
	    obj._flags.presence = 'forbidden';
	    return obj;
	};
	
	internals.Any.prototype.strip = function () {
	
	    var obj = this.clone();
	    obj._flags.strip = true;
	    return obj;
	};
	
	internals.Any.prototype.applyFunctionToChildren = function (children, fn, args, root) {
	
	    children = [].concat(children);
	
	    if (children.length !== 1 || children[0] !== '') {
	        root = root ? root + '.' : '';
	
	        var extraChildren = (children[0] === '' ? children.slice(1) : children).map(function (child) {
	
	            return root + child;
	        });
	
	        throw new Error('unknown key(s) ' + extraChildren.join(', '));
	    }
	
	    return this[fn].apply(this, args);
	};
	
	internals.Any.prototype['default'] = function (value, description) {
	
	    if (typeof value === 'function' && !Ref.isRef(value)) {
	
	        if (!value.description && description) {
	
	            value.description = description;
	        }
	
	        if (!this._flags.func) {
	            Hoek.assert(typeof value.description === 'string' && value.description.length > 0, 'description must be provided when default value is a function');
	        }
	    }
	
	    var obj = this.clone();
	    obj._flags['default'] = value;
	    Ref.push(obj._refs, value);
	    return obj;
	};
	
	internals.Any.prototype.empty = function (schema) {
	
	    if (schema === undefined) {
	        var _obj = this.clone();
	        _obj._flags.empty = undefined;
	        return _obj;
	    }
	
	    schema = Cast.schema(schema);
	
	    var obj = this.clone();
	    obj._flags.empty = schema;
	    return obj;
	};
	
	internals.Any.prototype.when = function (ref, options) {
	
	    Hoek.assert(options && typeof options === 'object', 'Invalid options');
	    Hoek.assert(options.then !== undefined || options.otherwise !== undefined, 'options must have at least one of "then" or "otherwise"');
	
	    var then = options.then ? this.concat(Cast.schema(options.then)) : this;
	    var otherwise = options.otherwise ? this.concat(Cast.schema(options.otherwise)) : this;
	
	    Alternatives = Alternatives || __webpack_require__(/*! ./alternatives */ 28);
	    var obj = Alternatives.when(ref, { is: options.is, then: then, otherwise: otherwise });
	    obj._flags.presence = 'ignore';
	    return obj;
	};
	
	internals.Any.prototype.description = function (desc) {
	
	    Hoek.assert(desc && typeof desc === 'string', 'Description must be a non-empty string');
	
	    var obj = this.clone();
	    obj._description = desc;
	    return obj;
	};
	
	internals.Any.prototype.notes = function (notes) {
	
	    Hoek.assert(notes && (typeof notes === 'string' || Array.isArray(notes)), 'Notes must be a non-empty string or array');
	
	    var obj = this.clone();
	    obj._notes = obj._notes.concat(notes);
	    return obj;
	};
	
	internals.Any.prototype.tags = function (tags) {
	
	    Hoek.assert(tags && (typeof tags === 'string' || Array.isArray(tags)), 'Tags must be a non-empty string or array');
	
	    var obj = this.clone();
	    obj._tags = obj._tags.concat(tags);
	    return obj;
	};
	
	internals.Any.prototype.meta = function (meta) {
	
	    Hoek.assert(meta !== undefined, 'Meta cannot be undefined');
	
	    var obj = this.clone();
	    obj._meta = obj._meta.concat(meta);
	    return obj;
	};
	
	internals.Any.prototype.example = function (value) {
	
	    Hoek.assert(arguments.length, 'Missing example');
	    var result = this._validate(value, null, internals.defaults);
	    Hoek.assert(!result.errors, 'Bad example:', result.errors && Errors.process(result.errors, value));
	
	    var obj = this.clone();
	    obj._examples = obj._examples.concat(value);
	    return obj;
	};
	
	internals.Any.prototype.unit = function (name) {
	
	    Hoek.assert(name && typeof name === 'string', 'Unit name must be a non-empty string');
	
	    var obj = this.clone();
	    obj._unit = name;
	    return obj;
	};
	
	internals._try = function (fn, arg) {
	
	    var err = undefined;
	    var result = undefined;
	
	    try {
	        result = fn.call(null, arg);
	    } catch (e) {
	        err = e;
	    }
	
	    return {
	        value: result,
	        error: err
	    };
	};
	
	internals.Any.prototype._validate = function (value, state, options, reference) {
	    var _this = this;
	
	    var originalValue = value;
	
	    // Setup state and settings
	
	    state = state || { key: '', path: '', parent: null, reference: reference };
	
	    if (this._settings) {
	        options = internals.concatSettings(options, this._settings);
	    }
	
	    var errors = [];
	    var finish = function finish() {
	
	        var finalValue = undefined;
	
	        if (!_this._flags.strip) {
	            if (value !== undefined) {
	                finalValue = options.raw ? originalValue : value;
	            } else if (options.noDefaults) {
	                finalValue = originalValue;
	            } else if (Ref.isRef(_this._flags['default'])) {
	                finalValue = _this._flags['default'](state.parent, options);
	            } else if (typeof _this._flags['default'] === 'function' && !(_this._flags.func && !_this._flags['default'].description)) {
	
	                var arg = undefined;
	
	                if (state.parent !== null && _this._flags['default'].length > 0) {
	
	                    arg = Hoek.clone(state.parent);
	                }
	
	                var defaultValue = internals._try(_this._flags['default'], arg);
	                finalValue = defaultValue.value;
	                if (defaultValue.error) {
	                    errors.push(Errors.create('any.default', defaultValue.error, state, options));
	                }
	            } else {
	                finalValue = Hoek.clone(_this._flags['default']);
	            }
	        }
	
	        return {
	            value: finalValue,
	            errors: errors.length ? errors : null
	        };
	    };
	
	    // Check presence requirements
	
	    var presence = this._flags.presence || options.presence;
	    if (presence === 'optional') {
	        if (value === undefined) {
	            var isDeepDefault = this._flags.hasOwnProperty('default') && this._flags['default'] === undefined;
	            if (isDeepDefault && this._type === 'object') {
	                value = {};
	            } else {
	                return finish();
	            }
	        }
	    } else if (presence === 'required' && value === undefined) {
	
	        errors.push(Errors.create('any.required', null, state, options));
	        return finish();
	    } else if (presence === 'forbidden') {
	        if (value === undefined) {
	            return finish();
	        }
	
	        errors.push(Errors.create('any.unknown', null, state, options));
	        return finish();
	    }
	
	    if (this._flags.empty && !this._flags.empty._validate(value, null, internals.defaults).errors) {
	        value = undefined;
	        return finish();
	    }
	
	    // Check allowed and denied values using the original value
	
	    if (this._valids.has(value, state, options, this._flags.insensitive)) {
	        return finish();
	    }
	
	    if (this._invalids.has(value, state, options, this._flags.insensitive)) {
	        errors.push(Errors.create(value === '' ? 'any.empty' : 'any.invalid', null, state, options));
	        if (options.abortEarly || value === undefined) {
	            // No reason to keep validating missing value
	
	            return finish();
	        }
	    }
	
	    // Convert value and validate type
	
	    if (this._base) {
	        var base = this._base.call(this, value, state, options);
	        if (base.errors) {
	            value = base.value;
	            errors = errors.concat(base.errors);
	            return finish(); // Base error always aborts early
	        }
	
	        if (base.value !== value) {
	            value = base.value;
	
	            // Check allowed and denied values using the converted value
	
	            if (this._valids.has(value, state, options, this._flags.insensitive)) {
	                return finish();
	            }
	
	            if (this._invalids.has(value, state, options, this._flags.insensitive)) {
	                errors.push(Errors.create('any.invalid', null, state, options));
	                if (options.abortEarly) {
	                    return finish();
	                }
	            }
	        }
	    }
	
	    // Required values did not match
	
	    if (this._flags.allowOnly) {
	        errors.push(Errors.create('any.allowOnly', { valids: this._valids.values({ stripUndefined: true }) }, state, options));
	        if (options.abortEarly) {
	            return finish();
	        }
	    }
	
	    // Helper.validate tests
	
	    for (var i = 0; i < this._tests.length; ++i) {
	        var test = this._tests[i];
	        var err = test.func.call(this, value, state, options);
	        if (err) {
	            errors.push(err);
	            if (options.abortEarly) {
	                return finish();
	            }
	        }
	    }
	
	    return finish();
	};
	
	internals.Any.prototype._validateWithOptions = function (value, options, callback) {
	
	    if (options) {
	        internals.checkOptions(options);
	    }
	
	    var settings = internals.concatSettings(internals.defaults, options);
	    var result = this._validate(value, null, settings);
	    var errors = Errors.process(result.errors, value);
	
	    if (callback) {
	        return callback(errors, result.value);
	    }
	
	    return { error: errors, value: result.value };
	};
	
	internals.Any.prototype.validate = function (value, callback) {
	
	    var result = this._validate(value, null, internals.defaults);
	    var errors = Errors.process(result.errors, value);
	
	    if (callback) {
	        return callback(errors, result.value);
	    }
	
	    return { error: errors, value: result.value };
	};
	
	internals.Any.prototype.describe = function () {
	
	    var description = {
	        type: this._type
	    };
	
	    var flags = Object.keys(this._flags);
	    if (flags.length) {
	        if (this._flags.empty) {
	            description.flags = {};
	            for (var i = 0; i < flags.length; ++i) {
	                var flag = flags[i];
	                description.flags[flag] = flag === 'empty' ? this._flags[flag].describe() : this._flags[flag];
	            }
	        } else {
	            description.flags = this._flags;
	        }
	    }
	
	    if (this._description) {
	        description.description = this._description;
	    }
	
	    if (this._notes.length) {
	        description.notes = this._notes;
	    }
	
	    if (this._tags.length) {
	        description.tags = this._tags;
	    }
	
	    if (this._meta.length) {
	        description.meta = this._meta;
	    }
	
	    if (this._examples.length) {
	        description.examples = this._examples;
	    }
	
	    if (this._unit) {
	        description.unit = this._unit;
	    }
	
	    var valids = this._valids.values();
	    if (valids.length) {
	        description.valids = valids;
	    }
	
	    var invalids = this._invalids.values();
	    if (invalids.length) {
	        description.invalids = invalids;
	    }
	
	    description.rules = [];
	
	    for (var i = 0; i < this._tests.length; ++i) {
	        var validator = this._tests[i];
	        var item = { name: validator.name };
	        if (validator.arg !== void 0) {
	            item.arg = validator.arg;
	        }
	        description.rules.push(item);
	    }
	
	    if (!description.rules.length) {
	        delete description.rules;
	    }
	
	    var label = Hoek.reach(this._settings, 'language.label');
	    if (label) {
	        description.label = label;
	    }
	
	    return description;
	};
	
	internals.Any.prototype.label = function (name) {
	
	    Hoek.assert(name && typeof name === 'string', 'Label name must be a non-empty string');
	
	    var obj = this.clone();
	    var options = { language: { label: name } };
	
	    // If language.label is set, it should override this label
	    obj._settings = internals.concatSettings(options, obj._settings);
	    return obj;
	};
	
	// Set
	
	internals.Set = function () {
	
	    this._set = [];
	};
	
	internals.Set.prototype.add = function (value, refs) {
	
	    Hoek.assert(value === null || value === undefined || value instanceof Date || Buffer.isBuffer(value) || Ref.isRef(value) || typeof value !== 'function' && typeof value !== 'object', 'Value cannot be an object or function');
	
	    if (typeof value !== 'function' && this.has(value, null, null, false)) {
	
	        return;
	    }
	
	    Ref.push(refs, value);
	    this._set.push(value);
	};
	
	internals.Set.prototype.merge = function (add, remove) {
	
	    for (var i = 0; i < add._set.length; ++i) {
	        this.add(add._set[i]);
	    }
	
	    for (var i = 0; i < remove._set.length; ++i) {
	        this.remove(remove._set[i]);
	    }
	};
	
	internals.Set.prototype.remove = function (value) {
	
	    this._set = this._set.filter(function (item) {
	        return value !== item;
	    });
	};
	
	internals.Set.prototype.has = function (value, state, options, insensitive) {
	
	    for (var i = 0; i < this._set.length; ++i) {
	        var items = this._set[i];
	
	        if (Ref.isRef(items)) {
	            items = items(state.reference || state.parent, options);
	        }
	
	        if (!Array.isArray(items)) {
	            items = [items];
	        }
	
	        for (var j = 0; j < items.length; ++j) {
	            var item = items[j];
	            if (typeof value !== typeof item) {
	                continue;
	            }
	
	            if (value === item || value instanceof Date && item instanceof Date && value.getTime() === item.getTime() || insensitive && typeof value === 'string' && value.toLowerCase() === item.toLowerCase() || Buffer.isBuffer(value) && Buffer.isBuffer(item) && value.length === item.length && value.toString('binary') === item.toString('binary')) {
	
	                return true;
	            }
	        }
	    }
	
	    return false;
	};
	
	internals.Set.prototype.values = function (options) {
	
	    if (options && options.stripUndefined) {
	        var values = [];
	
	        for (var i = 0; i < this._set.length; ++i) {
	            var item = this._set[i];
	            if (item !== undefined) {
	                values.push(item);
	            }
	        }
	
	        return values;
	    }
	
	    return this._set.slice();
	};
	
	internals.concatSettings = function (target, source) {
	
	    // Used to avoid cloning context
	
	    if (!target && !source) {
	
	        return null;
	    }
	
	    var obj = {};
	
	    if (target) {
	        var tKeys = Object.keys(target);
	        for (var i = 0; i < tKeys.length; ++i) {
	            var key = tKeys[i];
	            obj[key] = target[key];
	        }
	    }
	
	    if (source) {
	        var sKeys = Object.keys(source);
	        for (var i = 0; i < sKeys.length; ++i) {
	            var key = sKeys[i];
	            if (key !== 'language' || !obj.hasOwnProperty(key)) {
	
	                obj[key] = source[key];
	            } else {
	                obj[key] = Hoek.applyToDefaults(obj[key], source[key]);
	            }
	        }
	    }
	
	    return obj;
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./~/buffer/index.js */ 2).Buffer))

/***/ },
/* 2 */
/*!***************************!*\
  !*** ./~/buffer/index.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */
	
	var base64 = __webpack_require__(/*! base64-js */ 3)
	var ieee754 = __webpack_require__(/*! ieee754 */ 4)
	var isArray = __webpack_require__(/*! is-array */ 5)
	
	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	Buffer.poolSize = 8192 // not used by this implementation
	
	var rootParent = {}
	
	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
	 *     on objects.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.
	
	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()
	
	function typedArraySupport () {
	  function Bar () {}
	  try {
	    var arr = new Uint8Array(1)
	    arr.foo = function () { return 42 }
	    arr.constructor = Bar
	    return arr.foo() === 42 && // typed array instances can be augmented
	        arr.constructor === Bar && // constructor can be set
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}
	
	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}
	
	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer (arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1])
	    return new Buffer(arg)
	  }
	
	  this.length = 0
	  this.parent = undefined
	
	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg)
	  }
	
	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
	  }
	
	  // Unusual.
	  return fromObject(this, arg)
	}
	
	function fromNumber (that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0
	    }
	  }
	  return that
	}
	
	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'
	
	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0
	  that = allocate(that, length)
	
	  that.write(string, encoding)
	  return that
	}
	
	function fromObject (that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object)
	
	  if (isArray(object)) return fromArray(that, object)
	
	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string')
	  }
	
	  if (typeof ArrayBuffer !== 'undefined') {
	    if (object.buffer instanceof ArrayBuffer) {
	      return fromTypedArray(that, object)
	    }
	    if (object instanceof ArrayBuffer) {
	      return fromArrayBuffer(that, object)
	    }
	  }
	
	  if (object.length) return fromArrayLike(that, object)
	
	  return fromJsonObject(that, object)
	}
	
	function fromBuffer (that, buffer) {
	  var length = checked(buffer.length) | 0
	  that = allocate(that, length)
	  buffer.copy(that, 0, 0, length)
	  return that
	}
	
	function fromArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	function fromArrayBuffer (that, array) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    array.byteLength
	    that = Buffer._augment(new Uint8Array(array))
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromTypedArray(that, new Uint8Array(array))
	  }
	  return that
	}
	
	function fromArrayLike (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject (that, object) {
	  var array
	  var length = 0
	
	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data
	    length = checked(array.length) | 0
	  }
	  that = allocate(that, length)
	
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	}
	
	function allocate (that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length))
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length
	    that._isBuffer = true
	  }
	
	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
	  if (fromPool) that.parent = rootParent
	
	  return that
	}
	
	function checked (length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}
	
	function SlowBuffer (subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)
	
	  var buf = new Buffer(subject, encoding)
	  delete buf.parent
	  return buf
	}
	
	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}
	
	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }
	
	  if (a === b) return 0
	
	  var x = a.length
	  var y = b.length
	
	  var i = 0
	  var len = Math.min(x, y)
	  while (i < len) {
	    if (a[i] !== b[i]) break
	
	    ++i
	  }
	
	  if (i !== len) {
	    x = a[i]
	    y = b[i]
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}
	
	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')
	
	  if (list.length === 0) {
	    return new Buffer(0)
	  }
	
	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length
	    }
	  }
	
	  var buf = new Buffer(length)
	  var pos = 0
	  for (i = 0; i < list.length; i++) {
	    var item = list[i]
	    item.copy(buf, pos)
	    pos += item.length
	  }
	  return buf
	}
	
	function byteLength (string, encoding) {
	  if (typeof string !== 'string') string = '' + string
	
	  var len = string.length
	  if (len === 0) return 0
	
	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'binary':
	      // Deprecated
	      case 'raw':
	      case 'raws':
	        return len
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength
	
	// pre-set for values that may exist in the future
	Buffer.prototype.length = undefined
	Buffer.prototype.parent = undefined
	
	function slowToString (encoding, start, end) {
	  var loweredCase = false
	
	  start = start | 0
	  end = end === undefined || end === Infinity ? this.length : end | 0
	
	  if (!encoding) encoding = 'utf8'
	  if (start < 0) start = 0
	  if (end > this.length) end = this.length
	  if (end <= start) return ''
	
	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)
	
	      case 'ascii':
	        return asciiSlice(this, start, end)
	
	      case 'binary':
	        return binarySlice(this, start, end)
	
	      case 'base64':
	        return base64Slice(this, start, end)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}
	
	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}
	
	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}
	
	Buffer.prototype.compare = function compare (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return 0
	  return Buffer.compare(this, b)
	}
	
	Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
	  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
	  byteOffset >>= 0
	
	  if (this.length === 0) return -1
	  if (byteOffset >= this.length) return -1
	
	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)
	
	  if (typeof val === 'string') {
	    if (val.length === 0) return -1 // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset)
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset)
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
	    }
	    return arrayIndexOf(this, [ val ], byteOffset)
	  }
	
	  function arrayIndexOf (arr, val, byteOffset) {
	    var foundIndex = -1
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
	      } else {
	        foundIndex = -1
	      }
	    }
	    return -1
	  }
	
	  throw new TypeError('val must be string, number or Buffer')
	}
	
	// `get` is deprecated
	Buffer.prototype.get = function get (offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.')
	  return this.readUInt8(offset)
	}
	
	// `set` is deprecated
	Buffer.prototype.set = function set (v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.')
	  return this.writeUInt8(v, offset)
	}
	
	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }
	
	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string')
	
	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) throw new Error('Invalid hex string')
	    buf[offset + i] = parsed
	  }
	  return i
	}
	
	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}
	
	function binaryWrite (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}
	
	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}
	
	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    var swap = encoding
	    encoding = offset
	    offset = length | 0
	    length = swap
	  }
	
	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining
	
	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds')
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)
	
	      case 'ascii':
	        return asciiWrite(this, string, offset, length)
	
	      case 'binary':
	        return binaryWrite(this, string, offset, length)
	
	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}
	
	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}
	
	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []
	
	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1
	
	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint
	
	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }
	
	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }
	
	    res.push(codePoint)
	    i += bytesPerSequence
	  }
	
	  return decodeCodePointsArray(res)
	}
	
	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000
	
	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }
	
	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}
	
	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}
	
	function binarySlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}
	
	function hexSlice (buf, start, end) {
	  var len = buf.length
	
	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len
	
	  var out = ''
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i])
	  }
	  return out
	}
	
	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}
	
	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end
	
	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }
	
	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }
	
	  if (end < start) end = start
	
	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end))
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start]
	    }
	  }
	
	  if (newBuf.length) newBuf.parent = this.parent || this
	
	  return newBuf
	}
	
	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}
	
	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }
	
	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}
	
	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}
	
	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}
	
	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}
	
	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}
	
	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}
	
	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}
	
	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}
	
	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}
	
	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}
	
	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}
	
	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}
	
	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	}
	
	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)
	
	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)
	
	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}
	
	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}
	
	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = 0
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	  if (offset < 0) throw new RangeError('index out of range')
	}
	
	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}
	
	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}
	
	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}
	
	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}
	
	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start
	
	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0
	
	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')
	
	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }
	
	  var len = end - start
	  var i
	
	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart)
	  }
	
	  return len
	}
	
	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill (value, start, end) {
	  if (!value) value = 0
	  if (!start) start = 0
	  if (!end) end = this.length
	
	  if (end < start) throw new RangeError('end < start')
	
	  // Fill 0 bytes; we're done
	  if (end === start) return
	  if (this.length === 0) return
	
	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')
	
	  var i
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString())
	    var len = bytes.length
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len]
	    }
	  }
	
	  return this
	}
	
	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return (new Buffer(this)).buffer
	    } else {
	      var buf = new Uint8Array(this.length)
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i]
	      }
	      return buf.buffer
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
	  }
	}
	
	// HELPER FUNCTIONS
	// ================
	
	var BP = Buffer.prototype
	
	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment (arr) {
	  arr.constructor = Buffer
	  arr._isBuffer = true
	
	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set
	
	  // deprecated
	  arr.get = BP.get
	  arr.set = BP.set
	
	  arr.write = BP.write
	  arr.toString = BP.toString
	  arr.toLocaleString = BP.toString
	  arr.toJSON = BP.toJSON
	  arr.equals = BP.equals
	  arr.compare = BP.compare
	  arr.indexOf = BP.indexOf
	  arr.copy = BP.copy
	  arr.slice = BP.slice
	  arr.readUIntLE = BP.readUIntLE
	  arr.readUIntBE = BP.readUIntBE
	  arr.readUInt8 = BP.readUInt8
	  arr.readUInt16LE = BP.readUInt16LE
	  arr.readUInt16BE = BP.readUInt16BE
	  arr.readUInt32LE = BP.readUInt32LE
	  arr.readUInt32BE = BP.readUInt32BE
	  arr.readIntLE = BP.readIntLE
	  arr.readIntBE = BP.readIntBE
	  arr.readInt8 = BP.readInt8
	  arr.readInt16LE = BP.readInt16LE
	  arr.readInt16BE = BP.readInt16BE
	  arr.readInt32LE = BP.readInt32LE
	  arr.readInt32BE = BP.readInt32BE
	  arr.readFloatLE = BP.readFloatLE
	  arr.readFloatBE = BP.readFloatBE
	  arr.readDoubleLE = BP.readDoubleLE
	  arr.readDoubleBE = BP.readDoubleBE
	  arr.writeUInt8 = BP.writeUInt8
	  arr.writeUIntLE = BP.writeUIntLE
	  arr.writeUIntBE = BP.writeUIntBE
	  arr.writeUInt16LE = BP.writeUInt16LE
	  arr.writeUInt16BE = BP.writeUInt16BE
	  arr.writeUInt32LE = BP.writeUInt32LE
	  arr.writeUInt32BE = BP.writeUInt32BE
	  arr.writeIntLE = BP.writeIntLE
	  arr.writeIntBE = BP.writeIntBE
	  arr.writeInt8 = BP.writeInt8
	  arr.writeInt16LE = BP.writeInt16LE
	  arr.writeInt16BE = BP.writeInt16BE
	  arr.writeInt32LE = BP.writeInt32LE
	  arr.writeInt32BE = BP.writeInt32BE
	  arr.writeFloatLE = BP.writeFloatLE
	  arr.writeFloatBE = BP.writeFloatBE
	  arr.writeDoubleLE = BP.writeDoubleLE
	  arr.writeDoubleBE = BP.writeDoubleBE
	  arr.fill = BP.fill
	  arr.inspect = BP.inspect
	  arr.toArrayBuffer = BP.toArrayBuffer
	
	  return arr
	}
	
	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g
	
	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}
	
	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}
	
	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}
	
	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []
	
	  for (var i = 0; i < length; i++) {
	    codePoint = string.charCodeAt(i)
	
	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }
	
	        // valid lead
	        leadSurrogate = codePoint
	
	        continue
	      }
	
	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }
	
	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }
	
	    leadSurrogate = null
	
	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }
	
	  return bytes
	}
	
	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}
	
	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break
	
	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }
	
	  return byteArray
	}
	
	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}
	
	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./~/buffer/index.js */ 2).Buffer, (function() { return this; }())))

/***/ },
/* 3 */
/*!*****************************************!*\
  !*** ./~/buffer/~/base64-js/lib/b64.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	
	;(function (exports) {
		'use strict';
	
	  var Arr = (typeof Uint8Array !== 'undefined')
	    ? Uint8Array
	    : Array
	
		var PLUS   = '+'.charCodeAt(0)
		var SLASH  = '/'.charCodeAt(0)
		var NUMBER = '0'.charCodeAt(0)
		var LOWER  = 'a'.charCodeAt(0)
		var UPPER  = 'A'.charCodeAt(0)
		var PLUS_URL_SAFE = '-'.charCodeAt(0)
		var SLASH_URL_SAFE = '_'.charCodeAt(0)
	
		function decode (elt) {
			var code = elt.charCodeAt(0)
			if (code === PLUS ||
			    code === PLUS_URL_SAFE)
				return 62 // '+'
			if (code === SLASH ||
			    code === SLASH_URL_SAFE)
				return 63 // '/'
			if (code < NUMBER)
				return -1 //no match
			if (code < NUMBER + 10)
				return code - NUMBER + 26 + 26
			if (code < UPPER + 26)
				return code - UPPER
			if (code < LOWER + 26)
				return code - LOWER + 26
		}
	
		function b64ToByteArray (b64) {
			var i, j, l, tmp, placeHolders, arr
	
			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4')
			}
	
			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0
	
			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders)
	
			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length
	
			var L = 0
	
			function push (v) {
				arr[L++] = v
			}
	
			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
				push((tmp & 0xFF0000) >> 16)
				push((tmp & 0xFF00) >> 8)
				push(tmp & 0xFF)
			}
	
			if (placeHolders === 2) {
				tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
				push(tmp & 0xFF)
			} else if (placeHolders === 1) {
				tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
				push((tmp >> 8) & 0xFF)
				push(tmp & 0xFF)
			}
	
			return arr
		}
	
		function uint8ToBase64 (uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length
	
			function encode (num) {
				return lookup.charAt(num)
			}
	
			function tripletToBase64 (num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
			}
	
			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
				output += tripletToBase64(temp)
			}
	
			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1]
					output += encode(temp >> 2)
					output += encode((temp << 4) & 0x3F)
					output += '=='
					break
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
					output += encode(temp >> 10)
					output += encode((temp >> 4) & 0x3F)
					output += encode((temp << 2) & 0x3F)
					output += '='
					break
			}
	
			return output
		}
	
		exports.toByteArray = b64ToByteArray
		exports.fromByteArray = uint8ToBase64
	}( false ? (this.base64js = {}) : exports))


/***/ },
/* 4 */
/*!*************************************!*\
  !*** ./~/buffer/~/ieee754/index.js ***!
  \*************************************/
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]
	
	  i += d
	
	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}
	
	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0
	
	  value = Math.abs(value)
	
	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }
	
	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }
	
	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
	
	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
	
	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 5 */
/*!**************************************!*\
  !*** ./~/buffer/~/is-array/index.js ***!
  \**************************************/
/***/ function(module, exports) {

	
	/**
	 * isArray
	 */
	
	var isArray = Array.isArray;
	
	/**
	 * toString
	 */
	
	var str = Object.prototype.toString;
	
	/**
	 * Whether or not the given `val`
	 * is an array.
	 *
	 * example:
	 *
	 *        isArray([]);
	 *        // > true
	 *        isArray(arguments);
	 *        // > false
	 *        isArray('');
	 *        // > false
	 *
	 * @param {mixed} val
	 * @return {bool}
	 */
	
	module.exports = isArray || function (val) {
	  return !! val && '[object Array]' == str.call(val);
	};


/***/ },
/* 6 */
/*!*****************************!*\
  !*** ./~/hoek/lib/index.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';
	
	// Load modules
	
	var Crypto = __webpack_require__(/*! crypto */ 7);
	var Path = __webpack_require__(/*! path */ 8);
	var Util = __webpack_require__(/*! util */ 9);
	var Escape = __webpack_require__(/*! ./escape */ 11);
	
	// Declare internals
	
	var internals = {};
	
	// Clone object or array
	
	exports.clone = function (obj, seen) {
	
	    if (typeof obj !== 'object' || obj === null) {
	
	        return obj;
	    }
	
	    seen = seen || { orig: [], copy: [] };
	
	    var lookup = seen.orig.indexOf(obj);
	    if (lookup !== -1) {
	        return seen.copy[lookup];
	    }
	
	    var newObj = undefined;
	    var cloneDeep = false;
	
	    if (!Array.isArray(obj)) {
	        if (Buffer.isBuffer(obj)) {
	            newObj = new Buffer(obj);
	        } else if (obj instanceof Date) {
	            newObj = new Date(obj.getTime());
	        } else if (obj instanceof RegExp) {
	            newObj = new RegExp(obj);
	        } else {
	            var proto = Object.getPrototypeOf(obj);
	            if (proto && proto.isImmutable) {
	
	                newObj = obj;
	            } else {
	                newObj = Object.create(proto);
	                cloneDeep = true;
	            }
	        }
	    } else {
	        newObj = [];
	        cloneDeep = true;
	    }
	
	    seen.orig.push(obj);
	    seen.copy.push(newObj);
	
	    if (cloneDeep) {
	        var keys = Object.getOwnPropertyNames(obj);
	        for (var i = 0; i < keys.length; ++i) {
	            var key = keys[i];
	            var descriptor = Object.getOwnPropertyDescriptor(obj, key);
	            if (descriptor && (descriptor.get || descriptor.set)) {
	
	                Object.defineProperty(newObj, key, descriptor);
	            } else {
	                newObj[key] = exports.clone(obj[key], seen);
	            }
	        }
	    }
	
	    return newObj;
	};
	
	// Merge all the properties of source into target, source wins in conflict, and by default null and undefined from source are applied
	
	/*eslint-disable */
	exports.merge = function (target, source, isNullOverride, /* = true */isMergeArrays /* = true */) {
	    /*eslint-enable */
	
	    exports.assert(target && typeof target === 'object', 'Invalid target value: must be an object');
	    exports.assert(source === null || source === undefined || typeof source === 'object', 'Invalid source value: must be null, undefined, or an object');
	
	    if (!source) {
	        return target;
	    }
	
	    if (Array.isArray(source)) {
	        exports.assert(Array.isArray(target), 'Cannot merge array onto an object');
	        if (isMergeArrays === false) {
	            // isMergeArrays defaults to true
	            target.length = 0; // Must not change target assignment
	        }
	
	        for (var i = 0; i < source.length; ++i) {
	            target.push(exports.clone(source[i]));
	        }
	
	        return target;
	    }
	
	    var keys = Object.keys(source);
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        var value = source[key];
	        if (value && typeof value === 'object') {
	
	            if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key]) ^ Array.isArray(value) || value instanceof Date || Buffer.isBuffer(value) || value instanceof RegExp) {
	
	                target[key] = exports.clone(value);
	            } else {
	                exports.merge(target[key], value, isNullOverride, isMergeArrays);
	            }
	        } else {
	            if (value !== null && value !== undefined) {
	                // Explicit to preserve empty strings
	
	                target[key] = value;
	            } else if (isNullOverride !== false) {
	                // Defaults to true
	                target[key] = value;
	            }
	        }
	    }
	
	    return target;
	};
	
	// Apply options to a copy of the defaults
	
	exports.applyToDefaults = function (defaults, options, isNullOverride) {
	
	    exports.assert(defaults && typeof defaults === 'object', 'Invalid defaults value: must be an object');
	    exports.assert(!options || options === true || typeof options === 'object', 'Invalid options value: must be true, falsy or an object');
	
	    if (!options) {
	        // If no options, return null
	        return null;
	    }
	
	    var copy = exports.clone(defaults);
	
	    if (options === true) {
	        // If options is set to true, use defaults
	        return copy;
	    }
	
	    return exports.merge(copy, options, isNullOverride === true, false);
	};
	
	// Clone an object except for the listed keys which are shallow copied
	
	exports.cloneWithShallow = function (source, keys) {
	
	    if (!source || typeof source !== 'object') {
	
	        return source;
	    }
	
	    var storage = internals.store(source, keys); // Move shallow copy items to storage
	    var copy = exports.clone(source); // Deep copy the rest
	    internals.restore(copy, source, storage); // Shallow copy the stored items and restore
	    return copy;
	};
	
	internals.store = function (source, keys) {
	
	    var storage = {};
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        var value = exports.reach(source, key);
	        if (value !== undefined) {
	            storage[key] = value;
	            internals.reachSet(source, key, undefined);
	        }
	    }
	
	    return storage;
	};
	
	internals.restore = function (copy, source, storage) {
	
	    var keys = Object.keys(storage);
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        internals.reachSet(copy, key, storage[key]);
	        internals.reachSet(source, key, storage[key]);
	    }
	};
	
	internals.reachSet = function (obj, key, value) {
	
	    var path = key.split('.');
	    var ref = obj;
	    for (var i = 0; i < path.length; ++i) {
	        var segment = path[i];
	        if (i + 1 === path.length) {
	            ref[segment] = value;
	        }
	
	        ref = ref[segment];
	    }
	};
	
	// Apply options to defaults except for the listed keys which are shallow copied from option without merging
	
	exports.applyToDefaultsWithShallow = function (defaults, options, keys) {
	
	    exports.assert(defaults && typeof defaults === 'object', 'Invalid defaults value: must be an object');
	    exports.assert(!options || options === true || typeof options === 'object', 'Invalid options value: must be true, falsy or an object');
	    exports.assert(keys && Array.isArray(keys), 'Invalid keys');
	
	    if (!options) {
	        // If no options, return null
	        return null;
	    }
	
	    var copy = exports.cloneWithShallow(defaults, keys);
	
	    if (options === true) {
	        // If options is set to true, use defaults
	        return copy;
	    }
	
	    var storage = internals.store(options, keys); // Move shallow copy items to storage
	    exports.merge(copy, options, false, false); // Deep copy the rest
	    internals.restore(copy, options, storage); // Shallow copy the stored items and restore
	    return copy;
	};
	
	// Deep object or array comparison
	
	exports.deepEqual = function (obj, ref, options, seen) {
	
	    options = options || { prototype: true };
	
	    var type = typeof obj;
	
	    if (type !== typeof ref) {
	        return false;
	    }
	
	    if (type !== 'object' || obj === null || ref === null) {
	
	        if (obj === ref) {
	            // Copied from Deep-eql, copyright(c) 2013 Jake Luer, jake@alogicalparadox.com, MIT Licensed, https://github.com/chaijs/deep-eql
	            return obj !== 0 || 1 / obj === 1 / ref; // -0 / +0
	        }
	
	        return obj !== obj && ref !== ref; // NaN
	    }
	
	    seen = seen || [];
	    if (seen.indexOf(obj) !== -1) {
	        return true; // If previous comparison failed, it would have stopped execution
	    }
	
	    seen.push(obj);
	
	    if (Array.isArray(obj)) {
	        if (!Array.isArray(ref)) {
	            return false;
	        }
	
	        if (!options.part && obj.length !== ref.length) {
	            return false;
	        }
	
	        for (var i = 0; i < obj.length; ++i) {
	            if (options.part) {
	                var found = false;
	                for (var j = 0; j < ref.length; ++j) {
	                    if (exports.deepEqual(obj[i], ref[j], options)) {
	                        found = true;
	                        break;
	                    }
	                }
	
	                return found;
	            }
	
	            if (!exports.deepEqual(obj[i], ref[i], options)) {
	                return false;
	            }
	        }
	
	        return true;
	    }
	
	    if (Buffer.isBuffer(obj)) {
	        if (!Buffer.isBuffer(ref)) {
	            return false;
	        }
	
	        if (obj.length !== ref.length) {
	            return false;
	        }
	
	        for (var i = 0; i < obj.length; ++i) {
	            if (obj[i] !== ref[i]) {
	                return false;
	            }
	        }
	
	        return true;
	    }
	
	    if (obj instanceof Date) {
	        return ref instanceof Date && obj.getTime() === ref.getTime();
	    }
	
	    if (obj instanceof RegExp) {
	        return ref instanceof RegExp && obj.toString() === ref.toString();
	    }
	
	    if (options.prototype) {
	        if (Object.getPrototypeOf(obj) !== Object.getPrototypeOf(ref)) {
	            return false;
	        }
	    }
	
	    var keys = Object.getOwnPropertyNames(obj);
	
	    if (!options.part && keys.length !== Object.getOwnPropertyNames(ref).length) {
	        return false;
	    }
	
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        var descriptor = Object.getOwnPropertyDescriptor(obj, key);
	        if (descriptor.get) {
	            if (!exports.deepEqual(descriptor, Object.getOwnPropertyDescriptor(ref, key), options, seen)) {
	                return false;
	            }
	        } else if (!exports.deepEqual(obj[key], ref[key], options, seen)) {
	            return false;
	        }
	    }
	
	    return true;
	};
	
	// Remove duplicate items from array
	
	exports.unique = function (array, key) {
	
	    var index = {};
	    var result = [];
	
	    for (var i = 0; i < array.length; ++i) {
	        var id = key ? array[i][key] : array[i];
	        if (index[id] !== true) {
	
	            result.push(array[i]);
	            index[id] = true;
	        }
	    }
	
	    return result;
	};
	
	// Convert array into object
	
	exports.mapToObject = function (array, key) {
	
	    if (!array) {
	        return null;
	    }
	
	    var obj = {};
	    for (var i = 0; i < array.length; ++i) {
	        if (key) {
	            if (array[i][key]) {
	                obj[array[i][key]] = true;
	            }
	        } else {
	            obj[array[i]] = true;
	        }
	    }
	
	    return obj;
	};
	
	// Find the common unique items in two arrays
	
	exports.intersect = function (array1, array2, justFirst) {
	
	    if (!array1 || !array2) {
	        return [];
	    }
	
	    var common = [];
	    var hash = Array.isArray(array1) ? exports.mapToObject(array1) : array1;
	    var found = {};
	    for (var i = 0; i < array2.length; ++i) {
	        if (hash[array2[i]] && !found[array2[i]]) {
	            if (justFirst) {
	                return array2[i];
	            }
	
	            common.push(array2[i]);
	            found[array2[i]] = true;
	        }
	    }
	
	    return justFirst ? null : common;
	};
	
	// Test if the reference contains the values
	
	exports.contain = function (ref, values, options) {
	
	    /*
	        string -> string(s)
	        array -> item(s)
	        object -> key(s)
	        object -> object (key:value)
	    */
	
	    var valuePairs = null;
	    if (typeof ref === 'object' && typeof values === 'object' && !Array.isArray(ref) && !Array.isArray(values)) {
	
	        valuePairs = values;
	        values = Object.keys(values);
	    } else {
	        values = [].concat(values);
	    }
	
	    options = options || {}; // deep, once, only, part
	
	    exports.assert(arguments.length >= 2, 'Insufficient arguments');
	    exports.assert(typeof ref === 'string' || typeof ref === 'object', 'Reference must be string or an object');
	    exports.assert(values.length, 'Values array cannot be empty');
	
	    var compare = undefined;
	    var compareFlags = undefined;
	    if (options.deep) {
	        compare = exports.deepEqual;
	
	        var hasOnly = options.hasOwnProperty('only');
	        var hasPart = options.hasOwnProperty('part');
	
	        compareFlags = {
	            prototype: hasOnly ? options.only : hasPart ? !options.part : false,
	            part: hasOnly ? !options.only : hasPart ? options.part : true
	        };
	    } else {
	        compare = function (a, b) {
	            return a === b;
	        };
	    }
	
	    var misses = false;
	    var matches = new Array(values.length);
	    for (var i = 0; i < matches.length; ++i) {
	        matches[i] = 0;
	    }
	
	    if (typeof ref === 'string') {
	        var pattern = '(';
	        for (var i = 0; i < values.length; ++i) {
	            var value = values[i];
	            exports.assert(typeof value === 'string', 'Cannot compare string reference to non-string value');
	            pattern += (i ? '|' : '') + exports.escapeRegex(value);
	        }
	
	        var regex = new RegExp(pattern + ')', 'g');
	        var leftovers = ref.replace(regex, function ($0, $1) {
	
	            var index = values.indexOf($1);
	            ++matches[index];
	            return ''; // Remove from string
	        });
	
	        misses = !!leftovers;
	    } else if (Array.isArray(ref)) {
	        for (var i = 0; i < ref.length; ++i) {
	            var matched = false;
	            for (var j = 0; j < values.length && matched === false; ++j) {
	                matched = compare(values[j], ref[i], compareFlags) && j;
	            }
	
	            if (matched !== false) {
	                ++matches[matched];
	            } else {
	                misses = true;
	            }
	        }
	    } else {
	        var keys = Object.keys(ref);
	        for (var i = 0; i < keys.length; ++i) {
	            var key = keys[i];
	            var pos = values.indexOf(key);
	            if (pos !== -1) {
	                if (valuePairs && !compare(valuePairs[key], ref[key], compareFlags)) {
	
	                    return false;
	                }
	
	                ++matches[pos];
	            } else {
	                misses = true;
	            }
	        }
	    }
	
	    var result = false;
	    for (var i = 0; i < matches.length; ++i) {
	        result = result || !!matches[i];
	        if (options.once && matches[i] > 1 || !options.part && !matches[i]) {
	
	            return false;
	        }
	    }
	
	    if (options.only && misses) {
	
	        return false;
	    }
	
	    return result;
	};
	
	// Flatten array
	
	exports.flatten = function (array, target) {
	
	    var result = target || [];
	
	    for (var i = 0; i < array.length; ++i) {
	        if (Array.isArray(array[i])) {
	            exports.flatten(array[i], result);
	        } else {
	            result.push(array[i]);
	        }
	    }
	
	    return result;
	};
	
	// Convert an object key chain string ('a.b.c') to reference (object[a][b][c])
	
	exports.reach = function (obj, chain, options) {
	
	    if (chain === false || chain === null || typeof chain === 'undefined') {
	
	        return obj;
	    }
	
	    options = options || {};
	    if (typeof options === 'string') {
	        options = { separator: options };
	    }
	
	    var path = chain.split(options.separator || '.');
	    var ref = obj;
	    for (var i = 0; i < path.length; ++i) {
	        var key = path[i];
	        if (key[0] === '-' && Array.isArray(ref)) {
	            key = key.slice(1, key.length);
	            key = ref.length - key;
	        }
	
	        if (!ref || !((typeof ref === 'object' || typeof ref === 'function') && key in ref) || typeof ref !== 'object' && options.functions === false) {
	            // Only object and function can have properties
	
	            exports.assert(!options.strict || i + 1 === path.length, 'Missing segment', key, 'in reach path ', chain);
	            exports.assert(typeof ref === 'object' || options.functions === true || typeof ref !== 'function', 'Invalid segment', key, 'in reach path ', chain);
	            ref = options['default'];
	            break;
	        }
	
	        ref = ref[key];
	    }
	
	    return ref;
	};
	
	exports.reachTemplate = function (obj, template, options) {
	
	    return template.replace(/{([^}]+)}/g, function ($0, chain) {
	
	        var value = exports.reach(obj, chain, options);
	        return value === undefined || value === null ? '' : value;
	    });
	};
	
	exports.formatStack = function (stack) {
	
	    var trace = [];
	    for (var i = 0; i < stack.length; ++i) {
	        var item = stack[i];
	        trace.push([item.getFileName(), item.getLineNumber(), item.getColumnNumber(), item.getFunctionName(), item.isConstructor()]);
	    }
	
	    return trace;
	};
	
	exports.formatTrace = function (trace) {
	
	    var display = [];
	
	    for (var i = 0; i < trace.length; ++i) {
	        var row = trace[i];
	        display.push((row[4] ? 'new ' : '') + row[3] + ' (' + row[0] + ':' + row[1] + ':' + row[2] + ')');
	    }
	
	    return display;
	};
	
	exports.callStack = function (slice) {
	
	    // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
	
	    var v8 = Error.prepareStackTrace;
	    Error.prepareStackTrace = function (err, stack) {
	
	        return stack;
	    };
	
	    var capture = {};
	    Error.captureStackTrace(capture, this); // arguments.callee is not supported in strict mode so we use this and slice the trace of this off the result
	    var stack = capture.stack;
	
	    Error.prepareStackTrace = v8;
	
	    var trace = exports.formatStack(stack);
	
	    return trace.slice(1 + slice);
	};
	
	exports.displayStack = function (slice) {
	
	    var trace = exports.callStack(slice === undefined ? 1 : slice + 1);
	
	    return exports.formatTrace(trace);
	};
	
	exports.abortThrow = false;
	
	exports.abort = function (message, hideStack) {
	
	    if (process.env.NODE_ENV === 'test' || exports.abortThrow === true) {
	        throw new Error(message || 'Unknown error');
	    }
	
	    var stack = '';
	    if (!hideStack) {
	        stack = exports.displayStack(1).join('\n\t');
	    }
	    console.log('ABORT: ' + message + '\n\t' + stack);
	    process.exit(1);
	};
	
	exports.assert = function (condition /*, msg1, msg2, msg3 */) {
	
	    if (condition) {
	        return;
	    }
	
	    if (arguments.length === 2 && arguments[1] instanceof Error) {
	        throw arguments[1];
	    }
	
	    var msgs = [];
	    for (var i = 1; i < arguments.length; ++i) {
	        if (arguments[i] !== '') {
	            msgs.push(arguments[i]); // Avoids Array.slice arguments leak, allowing for V8 optimizations
	        }
	    }
	
	    msgs = msgs.map(function (msg) {
	
	        return typeof msg === 'string' ? msg : msg instanceof Error ? msg.message : exports.stringify(msg);
	    });
	
	    throw new Error(msgs.join(' ') || 'Unknown error');
	};
	
	exports.Timer = function () {
	
	    this.ts = 0;
	    this.reset();
	};
	
	exports.Timer.prototype.reset = function () {
	
	    this.ts = Date.now();
	};
	
	exports.Timer.prototype.elapsed = function () {
	
	    return Date.now() - this.ts;
	};
	
	exports.Bench = function () {
	
	    this.ts = 0;
	    this.reset();
	};
	
	exports.Bench.prototype.reset = function () {
	
	    this.ts = exports.Bench.now();
	};
	
	exports.Bench.prototype.elapsed = function () {
	
	    return exports.Bench.now() - this.ts;
	};
	
	exports.Bench.now = function () {
	
	    var ts = process.hrtime();
	    return ts[0] * 1e3 + ts[1] / 1e6;
	};
	
	// Escape string for Regex construction
	
	exports.escapeRegex = function (string) {
	
	    // Escape ^$.*+-?=!:|\/()[]{},
	    return string.replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g, '\\$&');
	};
	
	// Base64url (RFC 4648) encode
	
	exports.base64urlEncode = function (value, encoding) {
	
	    var buf = Buffer.isBuffer(value) ? value : new Buffer(value, encoding || 'binary');
	    return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
	};
	
	// Base64url (RFC 4648) decode
	
	exports.base64urlDecode = function (value, encoding) {
	
	    if (value && !/^[\w\-]*$/.test(value)) {
	
	        return new Error('Invalid character');
	    }
	
	    try {
	        var buf = new Buffer(value, 'base64');
	        return encoding === 'buffer' ? buf : buf.toString(encoding || 'binary');
	    } catch (err) {
	        return err;
	    }
	};
	
	// Escape attribute value for use in HTTP header
	
	exports.escapeHeaderAttribute = function (attribute) {
	
	    // Allowed value characters: !#$%&'()*+,-./:;<=>?@[]^_`{|}~ and space, a-z, A-Z, 0-9, \, "
	
	    exports.assert(/^[ \w\!#\$%&'\(\)\*\+,\-\.\/\:;<\=>\?@\[\]\^`\{\|\}~\"\\]*$/.test(attribute), 'Bad attribute value (' + attribute + ')');
	
	    return attribute.replace(/\\/g, '\\\\').replace(/\"/g, '\\"'); // Escape quotes and slash
	};
	
	exports.escapeHtml = function (string) {
	
	    return Escape.escapeHtml(string);
	};
	
	exports.escapeJavaScript = function (string) {
	
	    return Escape.escapeJavaScript(string);
	};
	
	exports.nextTick = function (callback) {
	
	    return function () {
	
	        var args = arguments;
	        process.nextTick(function () {
	
	            callback.apply(null, args);
	        });
	    };
	};
	
	exports.once = function (method) {
	
	    if (method._hoekOnce) {
	        return method;
	    }
	
	    var once = false;
	    var wrapped = function wrapped() {
	
	        if (!once) {
	            once = true;
	            method.apply(null, arguments);
	        }
	    };
	
	    wrapped._hoekOnce = true;
	
	    return wrapped;
	};
	
	exports.isAbsolutePath = function (path, platform) {
	
	    if (!path) {
	        return false;
	    }
	
	    if (Path.isAbsolute) {
	        // node >= 0.11
	        return Path.isAbsolute(path);
	    }
	
	    platform = platform || process.platform;
	
	    // Unix
	
	    if (platform !== 'win32') {
	        return path[0] === '/';
	    }
	
	    // Windows
	
	    return !!/^(?:[a-zA-Z]:[\\\/])|(?:[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/])/.test(path); // C:\ or \\something\something
	};
	
	exports.isInteger = function (value) {
	
	    return typeof value === 'number' && parseFloat(value) === parseInt(value, 10) && !isNaN(value);
	};
	
	exports.ignore = function () {};
	
	exports.inherits = Util.inherits;
	
	exports.format = Util.format;
	
	exports.transform = function (source, transform, options) {
	
	    exports.assert(source === null || source === undefined || typeof source === 'object' || Array.isArray(source), 'Invalid source object: must be null, undefined, an object, or an array');
	
	    if (Array.isArray(source)) {
	        var results = [];
	        for (var i = 0; i < source.length; ++i) {
	            results.push(exports.transform(source[i], transform, options));
	        }
	        return results;
	    }
	
	    var result = {};
	    var keys = Object.keys(transform);
	
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        var path = key.split('.');
	        var sourcePath = transform[key];
	
	        exports.assert(typeof sourcePath === 'string', 'All mappings must be "." delineated strings');
	
	        var segment = undefined;
	        var res = result;
	
	        while (path.length > 1) {
	            segment = path.shift();
	            if (!res[segment]) {
	                res[segment] = {};
	            }
	            res = res[segment];
	        }
	        segment = path.shift();
	        res[segment] = exports.reach(source, sourcePath, options);
	    }
	
	    return result;
	};
	
	exports.uniqueFilename = function (path, extension) {
	
	    if (extension) {
	        extension = extension[0] !== '.' ? '.' + extension : extension;
	    } else {
	        extension = '';
	    }
	
	    path = Path.resolve(path);
	    var name = [Date.now(), process.pid, Crypto.randomBytes(8).toString('hex')].join('-') + extension;
	    return Path.join(path, name);
	};
	
	exports.stringify = function () {
	
	    try {
	        return JSON.stringify.apply(null, arguments);
	    } catch (err) {
	        return '[Cannot display object: ' + err.message + ']';
	    }
	};
	
	exports.shallow = function (source) {
	
	    var target = {};
	    var keys = Object.keys(source);
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        target[key] = source[key];
	    }
	
	    return target;
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./~/buffer/index.js */ 2).Buffer))

/***/ },
/* 7 */
/*!*****************************!*\
  !*** ./lib/browser-stub.js ***!
  \*****************************/
/***/ function(module, exports) {

	"use strict";
	
	module.exports = {};

/***/ },
/* 8 */
/*!****************************************************************!*\
  !*** (webpack)/~/node-libs-browser/~/path-browserify/index.js ***!
  \****************************************************************/
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	'use strict';
	
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }
	
	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }
	
	  return parts;
	}
	
	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function splitPath(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};
	
	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function () {
	  var resolvedPath = '',
	      resolvedAbsolute = false;
	
	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = i >= 0 ? arguments[i] : process.cwd();
	
	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }
	
	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }
	
	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)
	
	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function (p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');
	
	  return (resolvedAbsolute ? '/' : '') + resolvedPath || '.';
	};
	
	// path.normalize(path)
	// posix version
	exports.normalize = function (path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';
	
	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function (p) {
	    return !!p;
	  }), !isAbsolute).join('/');
	
	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }
	
	  return (isAbsolute ? '/' : '') + path;
	};
	
	// posix version
	exports.isAbsolute = function (path) {
	  return path.charAt(0) === '/';
	};
	
	// posix version
	exports.join = function () {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function (p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};
	
	// path.relative(from, to)
	// posix version
	exports.relative = function (from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);
	
	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }
	
	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }
	
	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }
	
	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));
	
	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }
	
	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }
	
	  outputParts = outputParts.concat(toParts.slice(samePartsLength));
	
	  return outputParts.join('/');
	};
	
	exports.sep = '/';
	exports.delimiter = ':';
	
	exports.dirname = function (path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];
	
	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }
	
	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }
	
	  return root + dir;
	};
	
	exports.basename = function (path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};
	
	exports.extname = function (path) {
	  return splitPath(path)[3];
	};
	
	function filter(xs, f) {
	  if (xs.filter) return xs.filter(f);
	  var res = [];
	  for (var i = 0; i < xs.length; i++) {
	    if (f(xs[i], i, xs)) res.push(xs[i]);
	  }
	  return res;
	}
	
	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b' ? function (str, start, len) {
	  return str.substr(start, len);
	} : function (str, start, len) {
	  if (start < 0) start = str.length + start;
	  return str.substr(start, len);
	};

/***/ },
/* 9 */
/*!*****************************!*\
  !*** ./lib/browser-util.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = {
		inherits: __webpack_require__(/*! inherits */ 10)
	};

/***/ },
/* 10 */
/*!****************************************!*\
  !*** ./~/inherits/inherits_browser.js ***!
  \****************************************/
/***/ function(module, exports) {

	'use strict';
	
	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    var TempCtor = function TempCtor() {};
	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  };
	}

/***/ },
/* 11 */
/*!******************************!*\
  !*** ./~/hoek/lib/escape.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';
	
	// Declare internals
	
	var internals = {};
	
	exports.escapeJavaScript = function (input) {
	
	    if (!input) {
	        return '';
	    }
	
	    var escaped = '';
	
	    for (var i = 0; i < input.length; ++i) {
	
	        var charCode = input.charCodeAt(i);
	
	        if (internals.isSafe(charCode)) {
	            escaped += input[i];
	        } else {
	            escaped += internals.escapeJavaScriptChar(charCode);
	        }
	    }
	
	    return escaped;
	};
	
	exports.escapeHtml = function (input) {
	
	    if (!input) {
	        return '';
	    }
	
	    var escaped = '';
	
	    for (var i = 0; i < input.length; ++i) {
	
	        var charCode = input.charCodeAt(i);
	
	        if (internals.isSafe(charCode)) {
	            escaped += input[i];
	        } else {
	            escaped += internals.escapeHtmlChar(charCode);
	        }
	    }
	
	    return escaped;
	};
	
	internals.escapeJavaScriptChar = function (charCode) {
	
	    if (charCode >= 256) {
	        return '\\u' + internals.padLeft('' + charCode, 4);
	    }
	
	    var hexValue = new Buffer(String.fromCharCode(charCode), 'ascii').toString('hex');
	    return '\\x' + internals.padLeft(hexValue, 2);
	};
	
	internals.escapeHtmlChar = function (charCode) {
	
	    var namedEscape = internals.namedHtml[charCode];
	    if (typeof namedEscape !== 'undefined') {
	        return namedEscape;
	    }
	
	    if (charCode >= 256) {
	        return '&#' + charCode + ';';
	    }
	
	    var hexValue = new Buffer(String.fromCharCode(charCode), 'ascii').toString('hex');
	    return '&#x' + internals.padLeft(hexValue, 2) + ';';
	};
	
	internals.padLeft = function (str, len) {
	
	    while (str.length < len) {
	        str = '0' + str;
	    }
	
	    return str;
	};
	
	internals.isSafe = function (charCode) {
	
	    return typeof internals.safeCharCodes[charCode] !== 'undefined';
	};
	
	internals.namedHtml = {
	    '38': '&amp;',
	    '60': '&lt;',
	    '62': '&gt;',
	    '34': '&quot;',
	    '160': '&nbsp;',
	    '162': '&cent;',
	    '163': '&pound;',
	    '164': '&curren;',
	    '169': '&copy;',
	    '174': '&reg;'
	};
	
	internals.safeCharCodes = (function () {
	
	    var safe = {};
	
	    for (var i = 32; i < 123; ++i) {
	
	        if (i >= 97 || // a-z
	        i >= 65 && i <= 90 || // A-Z
	        i >= 48 && i <= 57 || // 0-9
	        i === 32 || // space
	        i === 46 || // .
	        i === 44 || // ,
	        i === 45 || // -
	        i === 58 || // :
	        i === 95) {
	            // _
	
	            safe[i] = null;
	        }
	    }
	
	    return safe;
	})();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./~/buffer/index.js */ 2).Buffer))

/***/ },
/* 12 */
/*!********************!*\
  !*** ./lib/ref.js ***!
  \********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	var Hoek = __webpack_require__(/*! hoek */ 6);
	
	// Declare internals
	
	var internals = {};
	
	exports.create = function (key, options) {
	
	    Hoek.assert(typeof key === 'string', 'Invalid reference key:', key);
	
	    var settings = Hoek.clone(options); // options can be reused and modified
	
	    var ref = function ref(value, validationOptions) {
	
	        return Hoek.reach(ref.isContext ? validationOptions.context : value, ref.key, settings);
	    };
	
	    ref.isContext = key[0] === (settings && settings.contextPrefix || '$');
	    ref.key = ref.isContext ? key.slice(1) : key;
	    ref.path = ref.key.split(settings && settings.separator || '.');
	    ref.depth = ref.path.length;
	    ref.root = ref.path[0];
	    ref.isJoi = true;
	
	    ref.toString = function () {
	
	        return (ref.isContext ? 'context:' : 'ref:') + ref.key;
	    };
	
	    return ref;
	};
	
	exports.isRef = function (ref) {
	
	    return typeof ref === 'function' && ref.isJoi;
	};
	
	exports.push = function (array, ref) {
	
	    if (exports.isRef(ref) && !ref.isContext) {
	
	        array.push(ref.root);
	    }
	};

/***/ },
/* 13 */
/*!***********************!*\
  !*** ./lib/errors.js ***!
  \***********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	var Hoek = __webpack_require__(/*! hoek */ 6);
	var Language = __webpack_require__(/*! ./language */ 14);
	
	// Declare internals
	
	var internals = {};
	
	internals.stringify = function (value, wrapArrays) {
	
	    var type = typeof value;
	
	    if (value === null) {
	        return 'null';
	    }
	
	    if (type === 'string') {
	        return value;
	    }
	
	    if (value instanceof internals.Err || type === 'function') {
	        return value.toString();
	    }
	
	    if (type === 'object') {
	        if (Array.isArray(value)) {
	            var partial = '';
	
	            for (var i = 0; i < value.length; ++i) {
	                partial = partial + (partial.length ? ', ' : '') + internals.stringify(value[i], wrapArrays);
	            }
	
	            return wrapArrays ? '[' + partial + ']' : partial;
	        }
	
	        return value.toString();
	    }
	
	    return JSON.stringify(value);
	};
	
	internals.Err = function (type, context, state, options) {
	
	    this.type = type;
	    this.context = context || {};
	    this.context.key = state.key;
	    this.path = state.path;
	    this.options = options;
	};
	
	internals.Err.prototype.toString = function () {
	    var _this = this;
	
	    var localized = this.options.language;
	
	    if (localized.label) {
	        this.context.key = localized.label;
	    } else if (this.context.key === '' || this.context.key === null) {
	        this.context.key = localized.root || Language.errors.root;
	    }
	
	    var format = Hoek.reach(localized, this.type) || Hoek.reach(Language.errors, this.type);
	    var hasKey = /\{\{\!?key\}\}/.test(format);
	    var skipKey = format.length > 2 && format[0] === '!' && format[1] === '!';
	
	    if (skipKey) {
	        format = format.slice(2);
	    }
	
	    if (!hasKey && !skipKey) {
	        format = (Hoek.reach(localized, 'key') || Hoek.reach(Language.errors, 'key')) + format;
	    }
	
	    var wrapArrays = Hoek.reach(localized, 'messages.wrapArrays');
	    if (typeof wrapArrays !== 'boolean') {
	        wrapArrays = Language.errors.messages.wrapArrays;
	    }
	
	    var message = format.replace(/\{\{(\!?)([^}]+)\}\}/g, function ($0, isSecure, name) {
	
	        var value = Hoek.reach(_this.context, name);
	        var normalized = internals.stringify(value, wrapArrays);
	        return isSecure ? Hoek.escapeHtml(normalized) : normalized;
	    });
	
	    return message;
	};
	
	exports.create = function (type, context, state, options) {
	
	    return new internals.Err(type, context, state, options);
	};
	
	exports.process = function (errors, object) {
	
	    if (!errors || !errors.length) {
	        return null;
	    }
	
	    // Construct error
	
	    var message = '';
	    var details = [];
	
	    var processErrors = function processErrors(localErrors, parent) {
	
	        for (var i = 0; i < localErrors.length; ++i) {
	            var item = localErrors[i];
	
	            var detail = {
	                message: item.toString(),
	                path: internals.getPath(item),
	                type: item.type,
	                context: item.context
	            };
	
	            if (!parent) {
	                message = message + (message ? '. ' : '') + detail.message;
	            }
	
	            // Do not push intermediate errors, we're only interested in leafs
	            if (item.context.reason && item.context.reason.length) {
	                processErrors(item.context.reason, item.path);
	            } else {
	                details.push(detail);
	            }
	        }
	    };
	
	    processErrors(errors);
	
	    var error = new Error(message);
	    error.name = 'ValidationError';
	    error.details = details;
	    error._object = object;
	    error.annotate = internals.annotate;
	    return error;
	};
	
	internals.getPath = function (item) {
	
	    var recursePath = function recursePath(_x) {
	        var _again = true;
	
	        _function: while (_again) {
	            var it = _x;
	            _again = false;
	
	            var reachedItem = Hoek.reach(it, 'context.reason.0');
	            if (reachedItem && reachedItem.context) {
	                _x = reachedItem;
	                _again = true;
	                reachedItem = undefined;
	                continue _function;
	            }
	
	            return it.path;
	        }
	    };
	
	    return recursePath(item) || item.context.key;
	};
	
	// Inspired by json-stringify-safe
	internals.safeStringify = function (obj, spaces) {
	
	    return JSON.stringify(obj, internals.serializer(), spaces);
	};
	
	internals.serializer = function () {
	
	    var keys = [];
	    var stack = [];
	
	    var cycleReplacer = function cycleReplacer(key, value) {
	
	        if (stack[0] === value) {
	            return '[Circular ~]';
	        }
	
	        return '[Circular ~.' + keys.slice(0, stack.indexOf(value)).join('.') + ']';
	    };
	
	    return function (key, value) {
	
	        if (stack.length > 0) {
	            var thisPos = stack.indexOf(this);
	            if (~thisPos) {
	                stack.length = thisPos + 1;
	                keys.length = thisPos + 1;
	                keys[thisPos] = key;
	            } else {
	                stack.push(this);
	                keys.push(key);
	            }
	
	            if (~stack.indexOf(value)) {
	                value = cycleReplacer.call(this, key, value);
	            }
	        } else {
	            stack.push(value);
	        }
	
	        if (Array.isArray(value) && value.placeholders) {
	            var placeholders = value.placeholders;
	            var arrWithPlaceholders = [];
	            for (var i = 0; i < value.length; ++i) {
	                if (placeholders[i]) {
	                    arrWithPlaceholders.push(placeholders[i]);
	                }
	                arrWithPlaceholders.push(value[i]);
	            }
	
	            value = arrWithPlaceholders;
	        }
	
	        return value;
	    };
	};
	
	internals.annotate = function () {
	
	    if (typeof this._object !== 'object') {
	        return this.details[0].message;
	    }
	
	    var obj = Hoek.clone(this._object || {});
	
	    var lookup = {};
	    for (var i = this.details.length - 1; i >= 0; --i) {
	        // Reverse order to process deepest child first
	        var pos = this.details.length - i;
	        var error = this.details[i];
	        var path = error.path.split('.');
	        var ref = obj;
	        for (var j = 0; j < path.length && ref; ++j) {
	            var seg = path[j];
	            if (j + 1 < path.length) {
	                ref = ref[seg];
	            } else {
	                var value = ref[seg];
	                if (Array.isArray(ref)) {
	                    var arrayLabel = '_$idx$_' + (i + 1) + '_$end$_';
	                    if (!ref.placeholders) {
	                        ref.placeholders = {};
	                    }
	
	                    if (ref.placeholders[seg]) {
	                        ref.placeholders[seg] = ref.placeholders[seg].replace('_$end$_', ', ' + (i + 1) + '_$end$_');
	                    } else {
	                        ref.placeholders[seg] = arrayLabel;
	                    }
	                } else {
	                    if (value !== undefined) {
	                        delete ref[seg];
	                        var objectLabel = seg + '_$key$_' + pos + '_$end$_';
	                        ref[objectLabel] = value;
	                        lookup[error.path] = objectLabel;
	                    } else if (lookup[error.path]) {
	                        var replacement = lookup[error.path];
	                        var appended = replacement.replace('_$end$_', ', ' + pos + '_$end$_');
	                        ref[appended] = ref[replacement];
	                        lookup[error.path] = appended;
	                        delete ref[replacement];
	                    } else {
	                        ref['_$miss$_' + seg + '|' + pos + '_$end$_'] = '__missing__';
	                    }
	                }
	            }
	        }
	    }
	
	    var message = internals.safeStringify(obj, 2).replace(/_\$key\$_([, \d]+)_\$end\$_\"/g, function ($0, $1) {
	
	        return '" \u001b[31m[' + $1 + ']\u001b[0m';
	    }).replace(/\"_\$miss\$_([^\|]+)\|(\d+)_\$end\$_\"\: \"__missing__\"/g, function ($0, $1, $2) {
	
	        return '\u001b[41m"' + $1 + '"\u001b[0m\u001b[31m [' + $2 + ']: -- missing --\u001b[0m';
	    }).replace(/\s*\"_\$idx\$_([, \d]+)_\$end\$_\",?\n(.*)/g, function ($0, $1, $2) {
	
	        return '\n' + $2 + ' \u001b[31m[' + $1 + ']\u001b[0m';
	    });
	
	    message = message + '\n\u001b[31m';
	
	    for (var i = 0; i < this.details.length; ++i) {
	        message = message + '\n[' + (i + 1) + '] ' + this.details[i].message;
	    }
	
	    message = message + '\u001b[0m';
	
	    return message;
	};

/***/ },
/* 14 */
/*!*************************!*\
  !*** ./lib/language.js ***!
  \*************************/
/***/ function(module, exports) {

	'use strict';
	
	// Load modules
	
	// Declare internals
	
	var internals = {};
	
	exports.errors = {
	    root: 'value',
	    key: '"{{!key}}" ',
	    messages: {
	        wrapArrays: true
	    },
	    any: {
	        unknown: 'is not allowed',
	        invalid: 'contains an invalid value',
	        empty: 'is not allowed to be empty',
	        required: 'is required',
	        allowOnly: 'must be one of {{valids}}',
	        'default': 'threw an error when running default method'
	    },
	    alternatives: {
	        base: 'not matching any of the allowed alternatives'
	    },
	    array: {
	        base: 'must be an array',
	        includes: 'at position {{pos}} does not match any of the allowed types',
	        includesSingle: 'single value of "{{!key}}" does not match any of the allowed types',
	        includesOne: 'at position {{pos}} fails because {{reason}}',
	        includesOneSingle: 'single value of "{{!key}}" fails because {{reason}}',
	        includesRequiredUnknowns: 'does not contain {{unknownMisses}} required value(s)',
	        includesRequiredKnowns: 'does not contain {{knownMisses}}',
	        includesRequiredBoth: 'does not contain {{knownMisses}} and {{unknownMisses}} other required value(s)',
	        excludes: 'at position {{pos}} contains an excluded value',
	        excludesSingle: 'single value of "{{!key}}" contains an excluded value',
	        min: 'must contain at least {{limit}} items',
	        max: 'must contain less than or equal to {{limit}} items',
	        length: 'must contain {{limit}} items',
	        ordered: 'at position {{pos}} fails because {{reason}}',
	        orderedLength: 'at position {{pos}} fails because array must contain at most {{limit}} items',
	        sparse: 'must not be a sparse array',
	        unique: 'position {{pos}} contains a duplicate value'
	    },
	    boolean: {
	        base: 'must be a boolean'
	    },
	    binary: {
	        base: 'must be a buffer or a string',
	        min: 'must be at least {{limit}} bytes',
	        max: 'must be less than or equal to {{limit}} bytes',
	        length: 'must be {{limit}} bytes'
	    },
	    date: {
	        base: 'must be a number of milliseconds or valid date string',
	        min: 'must be larger than or equal to "{{limit}}"',
	        max: 'must be less than or equal to "{{limit}}"',
	        isoDate: 'must be a valid ISO 8601 date',
	        ref: 'references "{{ref}}" which is not a date'
	    },
	    'function': {
	        base: 'must be a Function'
	    },
	    object: {
	        base: 'must be an object',
	        child: 'child "{{!key}}" fails because {{reason}}',
	        min: 'must have at least {{limit}} children',
	        max: 'must have less than or equal to {{limit}} children',
	        length: 'must have {{limit}} children',
	        allowUnknown: 'is not allowed',
	        'with': 'missing required peer "{{peer}}"',
	        without: 'conflict with forbidden peer "{{peer}}"',
	        missing: 'must contain at least one of {{peers}}',
	        xor: 'contains a conflict between exclusive peers {{peers}}',
	        or: 'must contain at least one of {{peers}}',
	        and: 'contains {{present}} without its required peers {{missing}}',
	        nand: '!!"{{main}}" must not exist simultaneously with {{peers}}',
	        assert: '!!"{{ref}}" validation failed because "{{ref}}" failed to {{message}}',
	        rename: {
	            multiple: 'cannot rename child "{{from}}" because multiple renames are disabled and another key was already renamed to "{{to}}"',
	            override: 'cannot rename child "{{from}}" because override is disabled and target "{{to}}" exists'
	        },
	        type: 'must be an instance of "{{type}}"'
	    },
	    number: {
	        base: 'must be a number',
	        min: 'must be larger than or equal to {{limit}}',
	        max: 'must be less than or equal to {{limit}}',
	        less: 'must be less than {{limit}}',
	        greater: 'must be greater than {{limit}}',
	        float: 'must be a float or double',
	        integer: 'must be an integer',
	        negative: 'must be a negative number',
	        positive: 'must be a positive number',
	        precision: 'must have no more than {{limit}} decimal places',
	        ref: 'references "{{ref}}" which is not a number',
	        multiple: 'must be a multiple of {{multiple}}'
	    },
	    string: {
	        base: 'must be a string',
	        min: 'length must be at least {{limit}} characters long',
	        max: 'length must be less than or equal to {{limit}} characters long',
	        length: 'length must be {{limit}} characters long',
	        alphanum: 'must only contain alpha-numeric characters',
	        token: 'must only contain alpha-numeric and underscore characters',
	        regex: {
	            base: 'with value "{{!value}}" fails to match the required pattern: {{pattern}}',
	            name: 'with value "{{!value}}" fails to match the {{name}} pattern'
	        },
	        email: 'must be a valid email',
	        uri: 'must be a valid uri',
	        uriCustomScheme: 'must be a valid uri with a scheme matching the {{scheme}} pattern',
	        isoDate: 'must be a valid ISO 8601 date',
	        guid: 'must be a valid GUID',
	        hex: 'must only contain hexadecimal characters',
	        hostname: 'must be a valid hostname',
	        lowercase: 'must only contain lowercase characters',
	        uppercase: 'must only contain uppercase characters',
	        trim: 'must not have leading or trailing whitespace',
	        creditCard: 'must be a credit card',
	        ref: 'references "{{ref}}" which is not a number',
	        ip: 'must be a valid ip address with a {{cidr}} CIDR',
	        ipVersion: 'must be a valid ip address of one of the following versions {{version}} with a {{cidr}} CIDR'
	    }
	};

/***/ },
/* 15 */
/*!*********************!*\
  !*** ./lib/cast.js ***!
  \*********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	var Hoek = __webpack_require__(/*! hoek */ 6);
	var Ref = __webpack_require__(/*! ./ref */ 12);
	
	// Type modules are delay-loaded to prevent circular dependencies
	
	// Declare internals
	
	var internals = {
	    any: null,
	    date: __webpack_require__(/*! ./date */ 16),
	    string: __webpack_require__(/*! ./string */ 18),
	    number: __webpack_require__(/*! ./number */ 26),
	    boolean: __webpack_require__(/*! ./boolean */ 27),
	    alt: null,
	    object: null
	};
	
	exports.schema = function (config) {
	
	    internals.any = internals.any || new (__webpack_require__(/*! ./any */ 1))();
	    internals.alt = internals.alt || __webpack_require__(/*! ./alternatives */ 28);
	    internals.object = internals.object || __webpack_require__(/*! ./object */ 29);
	
	    if (config && typeof config === 'object') {
	
	        if (config.isJoi) {
	            return config;
	        }
	
	        if (Array.isArray(config)) {
	            return internals.alt['try'](config);
	        }
	
	        if (config instanceof RegExp) {
	            return internals.string.regex(config);
	        }
	
	        if (config instanceof Date) {
	            return internals.date.valid(config);
	        }
	
	        return internals.object.keys(config);
	    }
	
	    if (typeof config === 'string') {
	        return internals.string.valid(config);
	    }
	
	    if (typeof config === 'number') {
	        return internals.number.valid(config);
	    }
	
	    if (typeof config === 'boolean') {
	        return internals.boolean.valid(config);
	    }
	
	    if (Ref.isRef(config)) {
	        return internals.any.valid(config);
	    }
	
	    Hoek.assert(config === null, 'Invalid schema content:', config);
	
	    return internals.any.valid(null);
	};
	
	exports.ref = function (id) {
	
	    return Ref.isRef(id) ? id : Ref.create(id);
	};

/***/ },
/* 16 */
/*!*********************!*\
  !*** ./lib/date.js ***!
  \*********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	var Any = __webpack_require__(/*! ./any */ 1);
	var Errors = __webpack_require__(/*! ./errors */ 13);
	var Ref = __webpack_require__(/*! ./ref */ 12);
	var Hoek = __webpack_require__(/*! hoek */ 6);
	var Moment = __webpack_require__(/*! moment */ 17);
	
	// Declare internals
	
	var internals = {};
	
	internals.isoDate = /^(?:\d{4}(?!\d{2}\b))(?:(-?)(?:(?:0[1-9]|1[0-2])(?:\1(?:[12]\d|0[1-9]|3[01]))?|W(?:[0-4]\d|5[0-2])(?:-?[1-7])?|(?:00[1-9]|0[1-9]\d|[12]\d{2}|3(?:[0-5]\d|6[1-6])))(?![T]$|[T][\d]+Z$)(?:[T\s](?:(?:(?:[01]\d|2[0-3])(?:(:?)[0-5]\d)?|24\:?00)(?:[.,]\d+(?!:))?)(?:\2[0-5]\d(?:[.,]\d+)?)?(?:[Z]|(?:[+-])(?:[01]\d|2[0-3])(?::?[0-5]\d)?)?)?)?$/;
	internals.invalidDate = new Date('');
	internals.isIsoDate = (function () {
	
	    var isoString = internals.isoDate.toString();
	
	    return function (date) {
	
	        return date && date.toString() === isoString;
	    };
	})();
	
	internals.Date = function () {
	
	    Any.call(this);
	    this._type = 'date';
	};
	
	Hoek.inherits(internals.Date, Any);
	
	internals.Date.prototype._base = function (value, state, options) {
	
	    var result = {
	        value: options.convert && internals.toDate(value, this._flags.format) || value
	    };
	
	    if (result.value instanceof Date && !isNaN(result.value.getTime())) {
	        result.errors = null;
	    } else {
	        result.errors = Errors.create(internals.isIsoDate(this._flags.format) ? 'date.isoDate' : 'date.base', null, state, options);
	    }
	
	    return result;
	};
	
	internals.toDate = function (value, format) {
	
	    if (value instanceof Date) {
	        return value;
	    }
	
	    if (typeof value === 'string' || Hoek.isInteger(value)) {
	
	        if (typeof value === 'string' && /^[+-]?\d+$/.test(value)) {
	
	            value = parseInt(value, 10);
	        }
	
	        var date = undefined;
	        if (format) {
	            if (internals.isIsoDate(format)) {
	                date = format.test(value) ? new Date(value) : internals.invalidDate;
	            } else {
	                date = Moment(value, format, true);
	                date = date.isValid() ? date.toDate() : internals.invalidDate;
	            }
	        } else {
	            date = new Date(value);
	        }
	
	        if (!isNaN(date.getTime())) {
	            return date;
	        }
	    }
	
	    return null;
	};
	
	internals.compare = function (type, compare) {
	
	    return function (date) {
	
	        var isNow = date === 'now';
	        var isRef = Ref.isRef(date);
	
	        if (!isNow && !isRef) {
	            date = internals.toDate(date);
	        }
	
	        Hoek.assert(date, 'Invalid date format');
	
	        return this._test(type, date, function (value, state, options) {
	
	            var compareTo = undefined;
	            if (isNow) {
	                compareTo = Date.now();
	            } else if (isRef) {
	                compareTo = internals.toDate(date(state.parent, options));
	
	                if (!compareTo) {
	                    return Errors.create('date.ref', { ref: date.key }, state, options);
	                }
	
	                compareTo = compareTo.getTime();
	            } else {
	                compareTo = date.getTime();
	            }
	
	            if (compare(value.getTime(), compareTo)) {
	                return null;
	            }
	
	            return Errors.create('date.' + type, { limit: new Date(compareTo) }, state, options);
	        });
	    };
	};
	
	internals.Date.prototype.min = internals.compare('min', function (value, date) {
	    return value >= date;
	});
	internals.Date.prototype.max = internals.compare('max', function (value, date) {
	    return value <= date;
	});
	
	internals.Date.prototype.format = function (format) {
	
	    Hoek.assert(typeof format === 'string' || Array.isArray(format) && format.every(function (f) {
	        return typeof f === 'string';
	    }), 'Invalid format.');
	
	    var obj = this.clone();
	    obj._flags.format = format;
	    return obj;
	};
	
	internals.Date.prototype.iso = function () {
	
	    var obj = this.clone();
	    obj._flags.format = internals.isoDate;
	    return obj;
	};
	
	internals.Date.prototype._isIsoDate = function (value) {
	
	    return internals.isoDate.test(value);
	};
	
	module.exports = new internals.Date();

/***/ },
/* 17 */
/*!*******************************!*\
  !*** ./lib/browser-moment.js ***!
  \*******************************/
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function () {
		return {
			isValid: function isValid() {
				return false;
			}
		};
	};

/***/ },
/* 18 */
/*!***********************!*\
  !*** ./lib/string.js ***!
  \***********************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';
	
	// Load modules
	
	var Net = __webpack_require__(/*! net */ 19);
	var Hoek = __webpack_require__(/*! hoek */ 6);
	var Isemail = __webpack_require__(/*! isemail */ 22);
	var Any = __webpack_require__(/*! ./any */ 1);
	var Ref = __webpack_require__(/*! ./ref */ 12);
	var JoiDate = __webpack_require__(/*! ./date */ 16);
	var Errors = __webpack_require__(/*! ./errors */ 13);
	var Uri = __webpack_require__(/*! ./string/uri */ 23);
	var Ip = __webpack_require__(/*! ./string/ip */ 25);
	
	// Declare internals
	
	var internals = {
	    uriRegex: Uri.createUriRegex(),
	    ipRegex: Ip.createIpRegex(['ipv4', 'ipv6', 'ipvfuture'], 'optional')
	};
	
	internals.String = function () {
	
	    Any.call(this);
	    this._type = 'string';
	    this._invalids.add('');
	};
	
	Hoek.inherits(internals.String, Any);
	
	internals.compare = function (type, compare) {
	
	    return function (limit, encoding) {
	
	        var isRef = Ref.isRef(limit);
	
	        Hoek.assert(Hoek.isInteger(limit) && limit >= 0 || isRef, 'limit must be a positive integer or reference');
	        Hoek.assert(!encoding || Buffer.isEncoding(encoding), 'Invalid encoding:', encoding);
	
	        return this._test(type, limit, function (value, state, options) {
	
	            var compareTo = undefined;
	            if (isRef) {
	                compareTo = limit(state.parent, options);
	
	                if (!Hoek.isInteger(compareTo)) {
	                    return Errors.create('string.ref', { ref: limit.key }, state, options);
	                }
	            } else {
	                compareTo = limit;
	            }
	
	            if (compare(value, compareTo, encoding)) {
	                return null;
	            }
	
	            return Errors.create('string.' + type, { limit: compareTo, value: value, encoding: encoding }, state, options);
	        });
	    };
	};
	
	internals.String.prototype._base = function (value, state, options) {
	
	    if (typeof value === 'string' && options.convert) {
	
	        if (this._flags['case']) {
	            value = this._flags['case'] === 'upper' ? value.toLocaleUpperCase() : value.toLocaleLowerCase();
	        }
	
	        if (this._flags.trim) {
	            value = value.trim();
	        }
	
	        if (this._inner.replacements) {
	
	            for (var i = 0; i < this._inner.replacements.length; ++i) {
	                var replacement = this._inner.replacements[i];
	                value = value.replace(replacement.pattern, replacement.replacement);
	            }
	        }
	    }
	
	    return {
	        value: value,
	        errors: typeof value === 'string' ? null : Errors.create('string.base', { value: value }, state, options)
	    };
	};
	
	internals.String.prototype.insensitive = function () {
	
	    var obj = this.clone();
	    obj._flags.insensitive = true;
	    return obj;
	};
	
	internals.String.prototype.min = internals.compare('min', function (value, limit, encoding) {
	
	    var length = encoding ? Buffer.byteLength(value, encoding) : value.length;
	    return length >= limit;
	});
	
	internals.String.prototype.max = internals.compare('max', function (value, limit, encoding) {
	
	    var length = encoding ? Buffer.byteLength(value, encoding) : value.length;
	    return length <= limit;
	});
	
	internals.String.prototype.creditCard = function () {
	
	    return this._test('creditCard', undefined, function (value, state, options) {
	
	        var i = value.length;
	        var sum = 0;
	        var mul = 1;
	
	        while (i--) {
	            var char = value.charAt(i) * mul;
	            sum = sum + (char - (char > 9) * 9);
	            mul = mul ^ 3;
	        }
	
	        var check = sum % 10 === 0 && sum > 0;
	        return check ? null : Errors.create('string.creditCard', { value: value }, state, options);
	    });
	};
	
	internals.String.prototype.length = internals.compare('length', function (value, limit, encoding) {
	
	    var length = encoding ? Buffer.byteLength(value, encoding) : value.length;
	    return length === limit;
	});
	
	internals.String.prototype.regex = function (pattern, name) {
	
	    Hoek.assert(pattern instanceof RegExp, 'pattern must be a RegExp');
	
	    pattern = new RegExp(pattern.source, pattern.ignoreCase ? 'i' : undefined); // Future version should break this and forbid unsupported regex flags
	
	    return this._test('regex', pattern, function (value, state, options) {
	
	        if (pattern.test(value)) {
	            return null;
	        }
	
	        return Errors.create(name ? 'string.regex.name' : 'string.regex.base', { name: name, pattern: pattern, value: value }, state, options);
	    });
	};
	
	internals.String.prototype.alphanum = function () {
	
	    return this._test('alphanum', undefined, function (value, state, options) {
	
	        if (/^[a-zA-Z0-9]+$/.test(value)) {
	            return null;
	        }
	
	        return Errors.create('string.alphanum', { value: value }, state, options);
	    });
	};
	
	internals.String.prototype.token = function () {
	
	    return this._test('token', undefined, function (value, state, options) {
	
	        if (/^\w+$/.test(value)) {
	            return null;
	        }
	
	        return Errors.create('string.token', { value: value }, state, options);
	    });
	};
	
	internals.String.prototype.email = function (isEmailOptions) {
	
	    if (isEmailOptions) {
	        Hoek.assert(typeof isEmailOptions === 'object', 'email options must be an object');
	        Hoek.assert(typeof isEmailOptions.checkDNS === 'undefined', 'checkDNS option is not supported');
	        Hoek.assert(typeof isEmailOptions.tldWhitelist === 'undefined' || typeof isEmailOptions.tldWhitelist === 'object', 'tldWhitelist must be an array or object');
	        Hoek.assert(typeof isEmailOptions.minDomainAtoms === 'undefined' || Hoek.isInteger(isEmailOptions.minDomainAtoms) && isEmailOptions.minDomainAtoms > 0, 'minDomainAtoms must be a positive integer');
	        Hoek.assert(typeof isEmailOptions.errorLevel === 'undefined' || typeof isEmailOptions.errorLevel === 'boolean' || Hoek.isInteger(isEmailOptions.errorLevel) && isEmailOptions.errorLevel >= 0, 'errorLevel must be a non-negative integer or boolean');
	    }
	
	    return this._test('email', isEmailOptions, function (value, state, options) {
	
	        try {
	            var result = Isemail.validate(value, isEmailOptions);
	            if (result === true || result === 0) {
	                return null;
	            }
	        } catch (e) {}
	
	        return Errors.create('string.email', { value: value }, state, options);
	    });
	};
	
	internals.String.prototype.ip = function (ipOptions) {
	
	    var regex = internals.ipRegex;
	    ipOptions = ipOptions || {};
	    Hoek.assert(typeof ipOptions === 'object', 'options must be an object');
	
	    if (ipOptions.cidr) {
	        Hoek.assert(typeof ipOptions.cidr === 'string', 'cidr must be a string');
	        ipOptions.cidr = ipOptions.cidr.toLowerCase();
	
	        Hoek.assert(ipOptions.cidr in Ip.cidrs, 'cidr must be one of ' + Object.keys(Ip.cidrs).join(', '));
	
	        // If we only received a `cidr` setting, create a regex for it. But we don't need to create one if `cidr` is "optional" since that is the default
	        if (!ipOptions.version && ipOptions.cidr !== 'optional') {
	            regex = Ip.createIpRegex(['ipv4', 'ipv6', 'ipvfuture'], ipOptions.cidr);
	        }
	    } else {
	
	        // Set our default cidr strategy
	        ipOptions.cidr = 'optional';
	    }
	
	    var versions = undefined;
	    if (ipOptions.version) {
	        if (!Array.isArray(ipOptions.version)) {
	            ipOptions.version = [ipOptions.version];
	        }
	
	        Hoek.assert(ipOptions.version.length >= 1, 'version must have at least 1 version specified');
	
	        versions = [];
	        for (var i = 0; i < ipOptions.version.length; ++i) {
	            var version = ipOptions.version[i];
	            Hoek.assert(typeof version === 'string', 'version at position ' + i + ' must be a string');
	            version = version.toLowerCase();
	            Hoek.assert(Ip.versions[version], 'version at position ' + i + ' must be one of ' + Object.keys(Ip.versions).join(', '));
	            versions.push(version);
	        }
	
	        // Make sure we have a set of versions
	        versions = Hoek.unique(versions);
	
	        regex = Ip.createIpRegex(versions, ipOptions.cidr);
	    }
	
	    return this._test('ip', ipOptions, function (value, state, options) {
	
	        if (regex.test(value)) {
	            return null;
	        }
	
	        if (versions) {
	            return Errors.create('string.ipVersion', { value: value, cidr: ipOptions.cidr, version: versions }, state, options);
	        }
	
	        return Errors.create('string.ip', { value: value, cidr: ipOptions.cidr }, state, options);
	    });
	};
	
	internals.String.prototype.uri = function (uriOptions) {
	
	    var customScheme = '';
	    var regex = internals.uriRegex;
	
	    if (uriOptions) {
	        Hoek.assert(typeof uriOptions === 'object', 'options must be an object');
	
	        if (uriOptions.scheme) {
	            Hoek.assert(uriOptions.scheme instanceof RegExp || typeof uriOptions.scheme === 'string' || Array.isArray(uriOptions.scheme), 'scheme must be a RegExp, String, or Array');
	
	            if (!Array.isArray(uriOptions.scheme)) {
	                uriOptions.scheme = [uriOptions.scheme];
	            }
	
	            Hoek.assert(uriOptions.scheme.length >= 1, 'scheme must have at least 1 scheme specified');
	
	            // Flatten the array into a string to be used to match the schemes.
	            for (var i = 0; i < uriOptions.scheme.length; ++i) {
	                var scheme = uriOptions.scheme[i];
	                Hoek.assert(scheme instanceof RegExp || typeof scheme === 'string', 'scheme at position ' + i + ' must be a RegExp or String');
	
	                // Add OR separators if a value already exists
	                customScheme = customScheme + (customScheme ? '|' : '');
	
	                // If someone wants to match HTTP or HTTPS for example then we need to support both RegExp and String so we don't escape their pattern unknowingly.
	                if (scheme instanceof RegExp) {
	                    customScheme = customScheme + scheme.source;
	                } else {
	                    Hoek.assert(/[a-zA-Z][a-zA-Z0-9+-\.]*/.test(scheme), 'scheme at position ' + i + ' must be a valid scheme');
	                    customScheme = customScheme + Hoek.escapeRegex(scheme);
	                }
	            }
	        }
	    }
	
	    if (customScheme) {
	        regex = Uri.createUriRegex(customScheme);
	    }
	
	    return this._test('uri', uriOptions, function (value, state, options) {
	
	        if (regex.test(value)) {
	            return null;
	        }
	
	        if (customScheme) {
	            return Errors.create('string.uriCustomScheme', { scheme: customScheme, value: value }, state, options);
	        }
	
	        return Errors.create('string.uri', { value: value }, state, options);
	    });
	};
	
	internals.String.prototype.isoDate = function () {
	
	    return this._test('isoDate', undefined, function (value, state, options) {
	
	        if (JoiDate._isIsoDate(value)) {
	            return null;
	        }
	
	        return Errors.create('string.isoDate', { value: value }, state, options);
	    });
	};
	
	internals.String.prototype.guid = function () {
	
	    var regex = /^[A-F0-9]{8}(?:-?[A-F0-9]{4}){3}-?[A-F0-9]{12}$/i;
	    var regex2 = /^\{[A-F0-9]{8}(?:-?[A-F0-9]{4}){3}-?[A-F0-9]{12}\}$/i;
	
	    return this._test('guid', undefined, function (value, state, options) {
	
	        if (regex.test(value) || regex2.test(value)) {
	            return null;
	        }
	
	        return Errors.create('string.guid', { value: value }, state, options);
	    });
	};
	
	internals.String.prototype.hex = function () {
	
	    var regex = /^[a-f0-9]+$/i;
	
	    return this._test('hex', regex, function (value, state, options) {
	
	        if (regex.test(value)) {
	            return null;
	        }
	
	        return Errors.create('string.hex', { value: value }, state, options);
	    });
	};
	
	internals.String.prototype.hostname = function () {
	
	    var regex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;
	
	    return this._test('hostname', undefined, function (value, state, options) {
	
	        if (value.length <= 255 && regex.test(value) || Net.isIPv6(value)) {
	
	            return null;
	        }
	
	        return Errors.create('string.hostname', { value: value }, state, options);
	    });
	};
	
	internals.String.prototype.lowercase = function () {
	
	    var obj = this._test('lowercase', undefined, function (value, state, options) {
	
	        if (options.convert || value === value.toLocaleLowerCase()) {
	
	            return null;
	        }
	
	        return Errors.create('string.lowercase', { value: value }, state, options);
	    });
	
	    obj._flags['case'] = 'lower';
	    return obj;
	};
	
	internals.String.prototype.uppercase = function () {
	
	    var obj = this._test('uppercase', undefined, function (value, state, options) {
	
	        if (options.convert || value === value.toLocaleUpperCase()) {
	
	            return null;
	        }
	
	        return Errors.create('string.uppercase', { value: value }, state, options);
	    });
	
	    obj._flags['case'] = 'upper';
	    return obj;
	};
	
	internals.String.prototype.trim = function () {
	
	    var obj = this._test('trim', undefined, function (value, state, options) {
	
	        if (options.convert || value === value.trim()) {
	
	            return null;
	        }
	
	        return Errors.create('string.trim', { value: value }, state, options);
	    });
	
	    obj._flags.trim = true;
	    return obj;
	};
	
	internals.String.prototype.replace = function (pattern, replacement) {
	
	    if (typeof pattern === 'string') {
	        pattern = new RegExp(Hoek.escapeRegex(pattern), 'g');
	    }
	
	    Hoek.assert(pattern instanceof RegExp, 'pattern must be a RegExp');
	    Hoek.assert(typeof replacement === 'string', 'replacement must be a String');
	
	    // This can not be considere a test like trim, we can't "reject"
	    // anything from this rule, so just clone the current object
	    var obj = this.clone();
	
	    if (!obj._inner.replacements) {
	        obj._inner.replacements = [];
	    }
	
	    obj._inner.replacements.push({
	        pattern: pattern,
	        replacement: replacement
	    });
	
	    return obj;
	};
	
	module.exports = new internals.String();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./~/buffer/index.js */ 2).Buffer))

/***/ },
/* 19 */
/*!****************************!*\
  !*** ./lib/browser-net.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = {
		isIPv6: __webpack_require__(/*! is-ipv6-node */ 20)
	};

/***/ },
/* 20 */
/*!*********************************!*\
  !*** ./~/is-ipv6-node/index.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @module index
	 * @description Entry point for is-ipv6-node module.
	 * @version 1.0.6
	 * @author Anatoliy Gatt [anatoliy.gatt@aol.com]
	 * @copyright Copyright (c) 2015 Anatoliy Gatt
	 * @license MIT
	 */
	
	'use strict';
	
	/**
	 * @public
	 * @description Expose function to check if {String} is an IPv6 address.
	 * @returns {Function} - Function to check if {String} is an IPv6 address.
	 */
	
	module.exports = __webpack_require__(/*! ./lib/is-ipv6 */ 21);

/***/ },
/* 21 */
/*!***************************************!*\
  !*** ./~/is-ipv6-node/lib/is-ipv6.js ***!
  \***************************************/
/***/ function(module, exports) {

	/**
	 * @module is-ipv6
	 * @description Provides function to check if {String} is an IPv6 address.
	 * @version 1.0.6
	 * @author Anatoliy Gatt [anatoliy.gatt@aol.com]
	 * @copyright Copyright (c) 2015 Anatoliy Gatt
	 * @license MIT
	 */
	
	'use strict';
	
	/**
	 * @public
	 * @function isIPv6
	 * @description Check if {String} is an IPv6 address.
	 * @param {String} string - String to check.
	 * @returns {Boolean} - Determine whether a {String} is an IPv6 address.
	 */
	
	function isIPv6(string) {
	  return !!/(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/.test(string);
	}
	
	/**
	 * @public
	 * @description Expose function to check if {String} is an IPv6 address.
	 * @param {String} string - String to check.
	 * @returns {Boolean} - Determine whether a {String} is an IPv6 address.
	 */
	
	module.exports = function (string) {
	  return isIPv6(string);
	};

/***/ },
/* 22 */
/*!********************************!*\
  !*** ./~/isemail/lib/index.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	var Dns = __webpack_require__(/*! dns */ 7);
	
	// Declare internals
	
	var internals = {
	    hasOwn: Object.prototype.hasOwnProperty,
	    indexOf: Array.prototype.indexOf,
	    defaultThreshold: 16,
	    maxIPv6Groups: 8,
	
	    categories: {
	        valid: 1,
	        dnsWarn: 7,
	        rfc5321: 15,
	        cfws: 31,
	        deprecated: 63,
	        rfc5322: 127,
	        error: 255
	    },
	
	    diagnoses: {
	
	        // Address is valid
	
	        valid: 0,
	
	        // Address is valid, but the DNS check failed
	
	        dnsWarnNoMXRecord: 5,
	        dnsWarnNoRecord: 6,
	
	        // Address is valid for SMTP but has unusual elements
	
	        rfc5321TLD: 9,
	        rfc5321TLDNumeric: 10,
	        rfc5321QuotedString: 11,
	        rfc5321AddressLiteral: 12,
	
	        // Address is valid for message, but must be modified for envelope
	
	        cfwsComment: 17,
	        cfwsFWS: 18,
	
	        // Address contains deprecated elements, but may still be valid in some contexts
	
	        deprecatedLocalPart: 33,
	        deprecatedFWS: 34,
	        deprecatedQTEXT: 35,
	        deprecatedQP: 36,
	        deprecatedComment: 37,
	        deprecatedCTEXT: 38,
	        deprecatedIPv6: 39,
	        deprecatedCFWSNearAt: 49,
	
	        // Address is only valid according to broad definition in RFC 5322, but is otherwise invalid
	
	        rfc5322Domain: 65,
	        rfc5322TooLong: 66,
	        rfc5322LocalTooLong: 67,
	        rfc5322DomainTooLong: 68,
	        rfc5322LabelTooLong: 69,
	        rfc5322DomainLiteral: 70,
	        rfc5322DomainLiteralOBSDText: 71,
	        rfc5322IPv6GroupCount: 72,
	        rfc5322IPv62x2xColon: 73,
	        rfc5322IPv6BadCharacter: 74,
	        rfc5322IPv6MaxGroups: 75,
	        rfc5322IPv6ColonStart: 76,
	        rfc5322IPv6ColonEnd: 77,
	
	        // Address is invalid for any purpose
	
	        errExpectingDTEXT: 129,
	        errNoLocalPart: 130,
	        errNoDomain: 131,
	        errConsecutiveDots: 132,
	        errATEXTAfterCFWS: 133,
	        errATEXTAfterQS: 134,
	        errATEXTAfterDomainLiteral: 135,
	        errExpectingQPair: 136,
	        errExpectingATEXT: 137,
	        errExpectingQTEXT: 138,
	        errExpectingCTEXT: 139,
	        errBackslashEnd: 140,
	        errDotStart: 141,
	        errDotEnd: 142,
	        errDomainHyphenStart: 143,
	        errDomainHyphenEnd: 144,
	        errUnclosedQuotedString: 145,
	        errUnclosedComment: 146,
	        errUnclosedDomainLiteral: 147,
	        errFWSCRLFx2: 148,
	        errFWSCRLFEnd: 149,
	        errCRNoLF: 150,
	        errUnknownTLD: 160,
	        errDomainTooShort: 161
	    },
	
	    components: {
	        localpart: 0,
	        domain: 1,
	        literal: 2,
	        contextComment: 3,
	        contextFWS: 4,
	        contextQuotedString: 5,
	        contextQuotedPair: 6
	    }
	};
	
	// $lab:coverage:off$
	internals.defer = typeof process !== 'undefined' && process && typeof process.nextTick === 'function' ? process.nextTick.bind(process) : function (callback) {
	
	    return setTimeout(callback, 0);
	};
	// $lab:coverage:on$
	
	internals.specials = (function () {
	
	    var specials = '()<>[]:;@\\,."'; // US-ASCII visible characters not valid for atext (http://tools.ietf.org/html/rfc5322#section-3.2.3)
	    var lookup = new Array(0x100);
	    for (var i = 0xff; i >= 0; --i) {
	        lookup[i] = false;
	    }
	
	    for (var i = 0; i < specials.length; ++i) {
	        lookup[specials.charCodeAt(i)] = true;
	    }
	
	    var body = 'return function (code) {\n  return lookup[code];\n}';
	    return new Function('lookup', body)(lookup);
	})();
	
	internals.regex = {
	    ipV4: /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
	    ipV6: /^[a-fA-F\d]{0,4}$/
	};
	
	internals.checkIpV6 = function (items) {
	
	    return items.every(function (value) {
	        return internals.regex.ipV6.test(value);
	    });
	};
	
	internals.validDomain = function (tldAtom, options) {
	
	    if (options.tldBlacklist) {
	        if (Array.isArray(options.tldBlacklist)) {
	            return internals.indexOf.call(options.tldBlacklist, tldAtom) === -1;
	        }
	
	        return !internals.hasOwn.call(options.tldBlacklist, tldAtom);
	    }
	
	    if (Array.isArray(options.tldWhitelist)) {
	        return internals.indexOf.call(options.tldWhitelist, tldAtom) !== -1;
	    }
	
	    return internals.hasOwn.call(options.tldWhitelist, tldAtom);
	};
	
	/**
	 * Check that an email address conforms to RFCs 5321, 5322 and others
	 *
	 * We distinguish clearly between a Mailbox as defined by RFC 5321 and an
	 * addr-spec as defined by RFC 5322. Depending on the context, either can be
	 * regarded as a valid email address. The RFC 5321 Mailbox specification is
	 * more restrictive (comments, white space and obsolete forms are not allowed).
	 *
	 * @param {string} email The email address to check. See README for specifics.
	 * @param {Object} options The (optional) options:
	 *   {boolean} checkDNS If true then will check DNS for MX records. If
	 *     true this call to isEmail _will_ be asynchronous.
	 *   {*} errorLevel Determines the boundary between valid and invalid
	 *     addresses.
	 *   {*} tldBlacklist The set of domains to consider invalid.
	 *   {*} tldWhitelist The set of domains to consider valid.
	 *   {*} minDomainAtoms The minimum number of domain atoms which must be present
	 *     for the address to be valid.
	 * @param {function(number|boolean)} callback The (optional) callback handler.
	 * @return {*}
	 */
	
	exports.validate = internals.validate = function (email, options, callback) {
	
	    options = options || {};
	
	    if (typeof options === 'function') {
	        callback = options;
	        options = {};
	    }
	
	    if (typeof callback !== 'function') {
	        if (options.checkDNS) {
	            throw new TypeError('expected callback function for checkDNS option');
	        }
	
	        callback = null;
	    }
	
	    var diagnose = undefined;
	    var threshold = undefined;
	
	    if (typeof options.errorLevel === 'number') {
	        diagnose = true;
	        threshold = options.errorLevel;
	    } else {
	        diagnose = !!options.errorLevel;
	        threshold = internals.diagnoses.valid;
	    }
	
	    if (options.tldWhitelist) {
	        if (typeof options.tldWhitelist === 'string') {
	            options.tldWhitelist = [options.tldWhitelist];
	        } else if (typeof options.tldWhitelist !== 'object') {
	            throw new TypeError('expected array or object tldWhitelist');
	        }
	    }
	
	    if (options.tldBlacklist) {
	        if (typeof options.tldBlacklist === 'string') {
	            options.tldBlacklist = [options.tldBlacklist];
	        } else if (typeof options.tldBlacklist !== 'object') {
	            throw new TypeError('expected array or object tldBlacklist');
	        }
	    }
	
	    if (options.minDomainAtoms && (options.minDomainAtoms !== (+options.minDomainAtoms | 0) || options.minDomainAtoms < 0)) {
	        throw new TypeError('expected positive integer minDomainAtoms');
	    }
	
	    var maxResult = internals.diagnoses.valid;
	    var updateResult = function updateResult(value) {
	
	        if (value > maxResult) {
	            maxResult = value;
	        }
	    };
	
	    var context = {
	        now: internals.components.localpart,
	        prev: internals.components.localpart,
	        stack: [internals.components.localpart]
	    };
	
	    var prevToken = '';
	
	    var parseData = {
	        local: '',
	        domain: ''
	    };
	    var atomData = {
	        locals: [''],
	        domains: ['']
	    };
	
	    var elementCount = 0;
	    var elementLength = 0;
	    var crlfCount = 0;
	    var charCode = undefined;
	
	    var hyphenFlag = false;
	    var assertEnd = false;
	
	    var emailLength = email.length;
	
	    var token = undefined; // Token is used outside the loop, must declare similarly
	    for (var i = 0; i < emailLength; ++i) {
	        token = email[i];
	
	        switch (context.now) {
	            // Local-part
	            case internals.components.localpart:
	                // http://tools.ietf.org/html/rfc5322#section-3.4.1
	                //   local-part      =   dot-atom / quoted-string / obs-local-part
	                //
	                //   dot-atom        =   [CFWS] dot-atom-text [CFWS]
	                //
	                //   dot-atom-text   =   1*atext *("." 1*atext)
	                //
	                //   quoted-string   =   [CFWS]
	                //                       DQUOTE *([FWS] qcontent) [FWS] DQUOTE
	                //                       [CFWS]
	                //
	                //   obs-local-part  =   word *("." word)
	                //
	                //   word            =   atom / quoted-string
	                //
	                //   atom            =   [CFWS] 1*atext [CFWS]
	                switch (token) {
	                    // Comment
	                    case '(':
	                        if (elementLength === 0) {
	                            // Comments are OK at the beginning of an element
	                            updateResult(elementCount === 0 ? internals.diagnoses.cfwsComment : internals.diagnoses.deprecatedComment);
	                        } else {
	                            updateResult(internals.diagnoses.cfwsComment);
	                            // Cannot start a comment in an element, should be end
	                            assertEnd = true;
	                        }
	
	                        context.stack.push(context.now);
	                        context.now = internals.components.contextComment;
	                        break;
	
	                    // Next dot-atom element
	                    case '.':
	                        if (elementLength === 0) {
	                            // Another dot, already?
	                            updateResult(elementCount === 0 ? internals.diagnoses.errDotStart : internals.diagnoses.errConsecutiveDots);
	                        } else {
	                            // The entire local-part can be a quoted string for RFC 5321; if one atom is quoted it's an RFC 5322 obsolete form
	                            if (assertEnd) {
	                                updateResult(internals.diagnoses.deprecatedLocalPart);
	                            }
	
	                            // CFWS & quoted strings are OK again now we're at the beginning of an element (although they are obsolete forms)
	                            assertEnd = false;
	                            elementLength = 0;
	                            ++elementCount;
	                            parseData.local += token;
	                            atomData.locals[elementCount] = '';
	                        }
	
	                        break;
	
	                    // Quoted string
	                    case '"':
	                        if (elementLength === 0) {
	                            // The entire local-part can be a quoted string for RFC 5321; if one atom is quoted it's an RFC 5322 obsolete form
	                            updateResult(elementCount === 0 ? internals.diagnoses.rfc5321QuotedString : internals.diagnoses.deprecatedLocalPart);
	
	                            parseData.local += token;
	                            atomData.locals[elementCount] += token;
	                            ++elementLength;
	
	                            // Quoted string must be the entire element
	                            assertEnd = true;
	                            context.stack.push(context.now);
	                            context.now = internals.components.contextQuotedString;
	                        } else {
	                            updateResult(internals.diagnoses.errExpectingATEXT);
	                        }
	
	                        break;
	
	                    // Folding white space
	                    case '\r':
	                        if (emailLength === ++i || email[i] !== '\n') {
	                            // Fatal error
	                            updateResult(internals.diagnoses.errCRNoLF);
	                            break;
	                        }
	
	                    // Fallthrough
	
	                    case ' ':
	                    case '\t':
	                        if (elementLength === 0) {
	                            updateResult(elementCount === 0 ? internals.diagnoses.cfwsFWS : internals.diagnoses.deprecatedFWS);
	                        } else {
	                            // We can't start FWS in the middle of an element, better be end
	                            assertEnd = true;
	                        }
	
	                        context.stack.push(context.now);
	                        context.now = internals.components.contextFWS;
	                        prevToken = token;
	                        break;
	
	                    case '@':
	                        // At this point we should have a valid local-part
	                        // $lab:coverage:off$
	                        if (context.stack.length !== 1) {
	                            throw new Error('unexpected item on context stack');
	                        }
	                        // $lab:coverage:on$
	
	                        if (parseData.local.length === 0) {
	                            // Fatal error
	                            updateResult(internals.diagnoses.errNoLocalPart);
	                        } else if (elementLength === 0) {
	                            // Fatal error
	                            updateResult(internals.diagnoses.errDotEnd);
	                        }
	                        // http://tools.ietf.org/html/rfc5321#section-4.5.3.1.1 the maximum total length of a user name or other local-part is 64
	                        //    octets
	                        else if (parseData.local.length > 64) {
	                                updateResult(internals.diagnoses.rfc5322LocalTooLong);
	                            }
	                            // http://tools.ietf.org/html/rfc5322#section-3.4.1 comments and folding white space SHOULD NOT be used around "@" in the
	                            //    addr-spec
	                            //
	                            // http://tools.ietf.org/html/rfc2119
	                            // 4. SHOULD NOT this phrase, or the phrase "NOT RECOMMENDED" mean that there may exist valid reasons in particular
	                            //    circumstances when the particular behavior is acceptable or even useful, but the full implications should be understood
	                            //    and the case carefully weighed before implementing any behavior described with this label.
	                            else if (context.prev === internals.components.contextComment || context.prev === internals.components.contextFWS) {
	                                    updateResult(internals.diagnoses.deprecatedCFWSNearAt);
	                                }
	
	                        // Clear everything down for the domain parsing
	                        context.now = internals.components.domain;
	                        context.stack[0] = internals.components.domain;
	                        elementCount = 0;
	                        elementLength = 0;
	                        assertEnd = false; // CFWS can only appear at the end of the element
	                        break;
	
	                    // ATEXT
	                    default:
	                        // http://tools.ietf.org/html/rfc5322#section-3.2.3
	                        //    atext = ALPHA / DIGIT / ; Printable US-ASCII
	                        //            "!" / "#" /     ;  characters not including
	                        //            "$" / "%" /     ;  specials.  Used for atoms.
	                        //            "&" / "'" /
	                        //            "*" / "+" /
	                        //            "-" / "/" /
	                        //            "=" / "?" /
	                        //            "^" / "_" /
	                        //            "`" / "{" /
	                        //            "|" / "}" /
	                        //            "~"
	                        if (assertEnd) {
	                            // We have encountered atext where it is no longer valid
	                            switch (context.prev) {
	                                case internals.components.contextComment:
	                                case internals.components.contextFWS:
	                                    updateResult(internals.diagnoses.errATEXTAfterCFWS);
	                                    break;
	
	                                case internals.components.contextQuotedString:
	                                    updateResult(internals.diagnoses.errATEXTAfterQS);
	                                    break;
	
	                                // $lab:coverage:off$
	                                default:
	                                    throw new Error('more atext found where none is allowed, but unrecognized prev context: ' + context.prev);
	                                // $lab:coverage:on$
	                            }
	                        } else {
	                                context.prev = context.now;
	                                charCode = token.charCodeAt(0);
	
	                                // Especially if charCode == 10
	                                if (charCode < 33 || charCode > 126 || internals.specials(charCode)) {
	
	                                    // Fatal error
	                                    updateResult(internals.diagnoses.errExpectingATEXT);
	                                }
	
	                                parseData.local += token;
	                                atomData.locals[elementCount] += token;
	                                ++elementLength;
	                            }
	                }
	
	                break;
	
	            case internals.components.domain:
	                // http://tools.ietf.org/html/rfc5322#section-3.4.1
	                //   domain          =   dot-atom / domain-literal / obs-domain
	                //
	                //   dot-atom        =   [CFWS] dot-atom-text [CFWS]
	                //
	                //   dot-atom-text   =   1*atext *("." 1*atext)
	                //
	                //   domain-literal  =   [CFWS] "[" *([FWS] dtext) [FWS] "]" [CFWS]
	                //
	                //   dtext           =   %d33-90 /          ; Printable US-ASCII
	                //                       %d94-126 /         ;  characters not including
	                //                       obs-dtext          ;  "[", "]", or "\"
	                //
	                //   obs-domain      =   atom *("." atom)
	                //
	                //   atom            =   [CFWS] 1*atext [CFWS]
	
	                // http://tools.ietf.org/html/rfc5321#section-4.1.2
	                //   Mailbox        = Local-part "@" ( Domain / address-literal )
	                //
	                //   Domain         = sub-domain *("." sub-domain)
	                //
	                //   address-literal  = "[" ( IPv4-address-literal /
	                //                    IPv6-address-literal /
	                //                    General-address-literal ) "]"
	                //                    ; See Section 4.1.3
	
	                // http://tools.ietf.org/html/rfc5322#section-3.4.1
	                //      Note: A liberal syntax for the domain portion of addr-spec is
	                //      given here.  However, the domain portion contains addressing
	                //      information specified by and used in other protocols (e.g.,
	                //      [RFC1034], [RFC1035], [RFC1123], [RFC5321]).  It is therefore
	                //      incumbent upon implementations to conform to the syntax of
	                //      addresses for the context in which they are used.
	                //
	                // is_email() author's note: it's not clear how to interpret this in
	                // he context of a general email address validator. The conclusion I
	                // have reached is this: "addressing information" must comply with
	                // RFC 5321 (and in turn RFC 1035), anything that is "semantically
	                // invisible" must comply only with RFC 5322.
	                switch (token) {
	                    // Comment
	                    case '(':
	                        if (elementLength === 0) {
	                            // Comments at the start of the domain are deprecated in the text, comments at the start of a subdomain are obs-domain
	                            // http://tools.ietf.org/html/rfc5322#section-3.4.1
	                            updateResult(elementCount === 0 ? internals.diagnoses.deprecatedCFWSNearAt : internals.diagnoses.deprecatedComment);
	                        } else {
	                            // We can't start a comment mid-element, better be at the end
	                            assertEnd = true;
	                            updateResult(internals.diagnoses.cfwsComment);
	                        }
	
	                        context.stack.push(context.now);
	                        context.now = internals.components.contextComment;
	                        break;
	
	                    // Next dot-atom element
	                    case '.':
	                        if (elementLength === 0) {
	                            // Another dot, already? Fatal error.
	                            updateResult(elementCount === 0 ? internals.diagnoses.errDotStart : internals.diagnoses.errConsecutiveDots);
	                        } else if (hyphenFlag) {
	                            // Previous subdomain ended in a hyphen. Fatal error.
	                            updateResult(internals.diagnoses.errDomainHyphenEnd);
	                        } else if (elementLength > 63) {
	                            // Nowhere in RFC 5321 does it say explicitly that the domain part of a Mailbox must be a valid domain according to the
	                            // DNS standards set out in RFC 1035, but this *is* implied in several places. For instance, wherever the idea of host
	                            // routing is discussed the RFC says that the domain must be looked up in the DNS. This would be nonsense unless the
	                            // domain was designed to be a valid DNS domain. Hence we must conclude that the RFC 1035 restriction on label length
	                            // also applies to RFC 5321 domains.
	                            //
	                            // http://tools.ietf.org/html/rfc1035#section-2.3.4
	                            // labels          63 octets or less
	
	                            updateResult(internals.diagnoses.rfc5322LabelTooLong);
	                        }
	
	                        // CFWS is OK again now we're at the beginning of an element (although
	                        // it may be obsolete CFWS)
	                        assertEnd = false;
	                        elementLength = 0;
	                        ++elementCount;
	                        atomData.domains[elementCount] = '';
	                        parseData.domain += token;
	
	                        break;
	
	                    // Domain literal
	                    case '[':
	                        if (parseData.domain.length === 0) {
	                            // Domain literal must be the only component
	                            assertEnd = true;
	                            ++elementLength;
	                            context.stack.push(context.now);
	                            context.now = internals.components.literal;
	                            parseData.domain += token;
	                            atomData.domains[elementCount] += token;
	                            parseData.literal = '';
	                        } else {
	                            // Fatal error
	                            updateResult(internals.diagnoses.errExpectingATEXT);
	                        }
	
	                        break;
	
	                    // Folding white space
	                    case '\r':
	                        if (emailLength === ++i || email[i] !== '\n') {
	                            // Fatal error
	                            updateResult(internals.diagnoses.errCRNoLF);
	                            break;
	                        }
	
	                    // Fallthrough
	
	                    case ' ':
	                    case '\t':
	                        if (elementLength === 0) {
	                            updateResult(elementCount === 0 ? internals.diagnoses.deprecatedCFWSNearAt : internals.diagnoses.deprecatedFWS);
	                        } else {
	                            // We can't start FWS in the middle of an element, so this better be the end
	                            updateResult(internals.diagnoses.cfwsFWS);
	                            assertEnd = true;
	                        }
	
	                        context.stack.push(context.now);
	                        context.now = internals.components.contextFWS;
	                        prevToken = token;
	                        break;
	
	                    // This must be ATEXT
	                    default:
	                        // RFC 5322 allows any atext...
	                        // http://tools.ietf.org/html/rfc5322#section-3.2.3
	                        //    atext = ALPHA / DIGIT / ; Printable US-ASCII
	                        //            "!" / "#" /     ;  characters not including
	                        //            "$" / "%" /     ;  specials.  Used for atoms.
	                        //            "&" / "'" /
	                        //            "*" / "+" /
	                        //            "-" / "/" /
	                        //            "=" / "?" /
	                        //            "^" / "_" /
	                        //            "`" / "{" /
	                        //            "|" / "}" /
	                        //            "~"
	
	                        // But RFC 5321 only allows letter-digit-hyphen to comply with DNS rules
	                        //   (RFCs 1034 & 1123)
	                        // http://tools.ietf.org/html/rfc5321#section-4.1.2
	                        //   sub-domain     = Let-dig [Ldh-str]
	                        //
	                        //   Let-dig        = ALPHA / DIGIT
	                        //
	                        //   Ldh-str        = *( ALPHA / DIGIT / "-" ) Let-dig
	                        //
	                        if (assertEnd) {
	                            // We have encountered ATEXT where it is no longer valid
	                            switch (context.prev) {
	                                case internals.components.contextComment:
	                                case internals.components.contextFWS:
	                                    updateResult(internals.diagnoses.errATEXTAfterCFWS);
	                                    break;
	
	                                case internals.components.literal:
	                                    updateResult(internals.diagnoses.errATEXTAfterDomainLiteral);
	                                    break;
	
	                                // $lab:coverage:off$
	                                default:
	                                    throw new Error('more atext found where none is allowed, but unrecognized prev context: ' + context.prev);
	                                // $lab:coverage:on$
	                            }
	                        }
	
	                        charCode = token.charCodeAt(0);
	                        // Assume this token isn't a hyphen unless we discover it is
	                        hyphenFlag = false;
	
	                        if (charCode < 33 || charCode > 126 || internals.specials(charCode)) {
	                            // Fatal error
	                            updateResult(internals.diagnoses.errExpectingATEXT);
	                        } else if (token === '-') {
	                            if (elementLength === 0) {
	                                // Hyphens cannot be at the beginning of a subdomain, fatal error
	                                updateResult(internals.diagnoses.errDomainHyphenStart);
	                            }
	
	                            hyphenFlag = true;
	                        }
	                        // Check if it's a neither a number nor a latin letter
	                        else if (charCode < 48 || charCode > 122 || charCode > 57 && charCode < 65 || charCode > 90 && charCode < 97) {
	                                // This is not an RFC 5321 subdomain, but still OK by RFC 5322
	                                updateResult(internals.diagnoses.rfc5322Domain);
	                            }
	
	                        parseData.domain += token;
	                        atomData.domains[elementCount] += token;
	                        ++elementLength;
	                }
	
	                break;
	
	            // Domain literal
	            case internals.components.literal:
	                // http://tools.ietf.org/html/rfc5322#section-3.4.1
	                //   domain-literal  =   [CFWS] "[" *([FWS] dtext) [FWS] "]" [CFWS]
	                //
	                //   dtext           =   %d33-90 /          ; Printable US-ASCII
	                //                       %d94-126 /         ;  characters not including
	                //                       obs-dtext          ;  "[", "]", or "\"
	                //
	                //   obs-dtext       =   obs-NO-WS-CTL / quoted-pair
	                switch (token) {
	                    // End of domain literal
	                    case ']':
	                        if (maxResult < internals.categories.deprecated) {
	                            // Could be a valid RFC 5321 address literal, so let's check
	
	                            // http://tools.ietf.org/html/rfc5321#section-4.1.2
	                            //   address-literal  = "[" ( IPv4-address-literal /
	                            //                    IPv6-address-literal /
	                            //                    General-address-literal ) "]"
	                            //                    ; See Section 4.1.3
	                            //
	                            // http://tools.ietf.org/html/rfc5321#section-4.1.3
	                            //   IPv4-address-literal  = Snum 3("."  Snum)
	                            //
	                            //   IPv6-address-literal  = "IPv6:" IPv6-addr
	                            //
	                            //   General-address-literal  = Standardized-tag ":" 1*dcontent
	                            //
	                            //   Standardized-tag  = Ldh-str
	                            //                     ; Standardized-tag MUST be specified in a
	                            //                     ; Standards-Track RFC and registered with IANA
	                            //
	                            //   dcontent      = %d33-90 / ; Printable US-ASCII
	                            //                 %d94-126 ; excl. "[", "\", "]"
	                            //
	                            //   Snum          = 1*3DIGIT
	                            //                 ; representing a decimal integer
	                            //                 ; value in the range 0 through 255
	                            //
	                            //   IPv6-addr     = IPv6-full / IPv6-comp / IPv6v4-full / IPv6v4-comp
	                            //
	                            //   IPv6-hex      = 1*4HEXDIG
	                            //
	                            //   IPv6-full     = IPv6-hex 7(":" IPv6-hex)
	                            //
	                            //   IPv6-comp     = [IPv6-hex *5(":" IPv6-hex)] "::"
	                            //                 [IPv6-hex *5(":" IPv6-hex)]
	                            //                 ; The "::" represents at least 2 16-bit groups of
	                            //                 ; zeros.  No more than 6 groups in addition to the
	                            //                 ; "::" may be present.
	                            //
	                            //   IPv6v4-full   = IPv6-hex 5(":" IPv6-hex) ":" IPv4-address-literal
	                            //
	                            //   IPv6v4-comp   = [IPv6-hex *3(":" IPv6-hex)] "::"
	                            //                 [IPv6-hex *3(":" IPv6-hex) ":"]
	                            //                 IPv4-address-literal
	                            //                 ; The "::" represents at least 2 16-bit groups of
	                            //                 ; zeros.  No more than 4 groups in addition to the
	                            //                 ; "::" and IPv4-address-literal may be present.
	
	                            var index = -1;
	                            var addressLiteral = parseData.literal;
	                            var matchesIP = internals.regex.ipV4.exec(addressLiteral);
	
	                            // Maybe extract IPv4 part from the end of the address-literal
	                            if (matchesIP) {
	                                index = matchesIP.index;
	                                if (index !== 0) {
	                                    // Convert IPv4 part to IPv6 format for futher testing
	                                    addressLiteral = addressLiteral.slice(0, index) + '0:0';
	                                }
	                            }
	
	                            if (index === 0) {
	                                // Nothing there except a valid IPv4 address, so...
	                                updateResult(internals.diagnoses.rfc5321AddressLiteral);
	                            } else if (addressLiteral.slice(0, 5).toLowerCase() !== 'ipv6:') {
	                                updateResult(internals.diagnoses.rfc5322DomainLiteral);
	                            } else {
	                                var match = addressLiteral.slice(5);
	                                var maxGroups = internals.maxIPv6Groups;
	                                var groups = match.split(':');
	                                index = match.indexOf('::');
	
	                                if (! ~index) {
	                                    // Need exactly the right number of groups
	                                    if (groups.length !== maxGroups) {
	                                        updateResult(internals.diagnoses.rfc5322IPv6GroupCount);
	                                    }
	                                } else if (index !== match.lastIndexOf('::')) {
	                                    updateResult(internals.diagnoses.rfc5322IPv62x2xColon);
	                                } else {
	                                    if (index === 0 || index === match.length - 2) {
	                                        // RFC 4291 allows :: at the start or end of an address with 7 other groups in addition
	                                        ++maxGroups;
	                                    }
	
	                                    if (groups.length > maxGroups) {
	                                        updateResult(internals.diagnoses.rfc5322IPv6MaxGroups);
	                                    } else if (groups.length === maxGroups) {
	                                        // Eliding a single "::"
	                                        updateResult(internals.diagnoses.deprecatedIPv6);
	                                    }
	                                }
	
	                                // IPv6 testing strategy
	                                if (match[0] === ':' && match[1] !== ':') {
	                                    updateResult(internals.diagnoses.rfc5322IPv6ColonStart);
	                                } else if (match[match.length - 1] === ':' && match[match.length - 2] !== ':') {
	                                    updateResult(internals.diagnoses.rfc5322IPv6ColonEnd);
	                                } else if (internals.checkIpV6(groups)) {
	                                    updateResult(internals.diagnoses.rfc5321AddressLiteral);
	                                } else {
	                                    updateResult(internals.diagnoses.rfc5322IPv6BadCharacter);
	                                }
	                            }
	                        } else {
	                            updateResult(internals.diagnoses.rfc5322DomainLiteral);
	                        }
	
	                        parseData.domain += token;
	                        atomData.domains[elementCount] += token;
	                        ++elementLength;
	                        context.prev = context.now;
	                        context.now = context.stack.pop();
	                        break;
	
	                    case '\\':
	                        updateResult(internals.diagnoses.rfc5322DomainLiteralOBSDText);
	                        context.stack.push(context.now);
	                        context.now = internals.components.contextQuotedPair;
	                        break;
	
	                    // Folding white space
	                    case '\r':
	                        if (emailLength === ++i || email[i] !== '\n') {
	                            updateResult(internals.diagnoses.errCRNoLF);
	                            break;
	                        }
	
	                    // Fallthrough
	
	                    case ' ':
	                    case '\t':
	                        updateResult(internals.diagnoses.cfwsFWS);
	
	                        context.stack.push(context.now);
	                        context.now = internals.components.contextFWS;
	                        prevToken = token;
	                        break;
	
	                    // DTEXT
	                    default:
	                        // http://tools.ietf.org/html/rfc5322#section-3.4.1
	                        //   dtext         =   %d33-90 /  ; Printable US-ASCII
	                        //                     %d94-126 / ;  characters not including
	                        //                     obs-dtext  ;  "[", "]", or "\"
	                        //
	                        //   obs-dtext     =   obs-NO-WS-CTL / quoted-pair
	                        //
	                        //   obs-NO-WS-CTL =   %d1-8 /    ; US-ASCII control
	                        //                     %d11 /     ;  characters that do not
	                        //                     %d12 /     ;  include the carriage
	                        //                     %d14-31 /  ;  return, line feed, and
	                        //                     %d127      ;  white space characters
	                        charCode = token.charCodeAt(0);
	
	                        // '\r', '\n', ' ', and '\t' have already been parsed above
	                        if (charCode > 127 || charCode === 0 || token === '[') {
	                            // Fatal error
	                            updateResult(internals.diagnoses.errExpectingDTEXT);
	                            break;
	                        } else if (charCode < 33 || charCode === 127) {
	                            updateResult(internals.diagnoses.rfc5322DomainLiteralOBSDText);
	                        }
	
	                        parseData.literal += token;
	                        parseData.domain += token;
	                        atomData.domains[elementCount] += token;
	                        ++elementLength;
	                }
	
	                break;
	
	            // Quoted string
	            case internals.components.contextQuotedString:
	                // http://tools.ietf.org/html/rfc5322#section-3.2.4
	                //   quoted-string = [CFWS]
	                //                   DQUOTE *([FWS] qcontent) [FWS] DQUOTE
	                //                   [CFWS]
	                //
	                //   qcontent      = qtext / quoted-pair
	                switch (token) {
	                    // Quoted pair
	                    case '\\':
	                        context.stack.push(context.now);
	                        context.now = internals.components.contextQuotedPair;
	                        break;
	
	                    // Folding white space. Spaces are allowed as regular characters inside a quoted string - it's only FWS if we include '\t' or '\r\n'
	                    case '\r':
	                        if (emailLength === ++i || email[i] !== '\n') {
	                            // Fatal error
	                            updateResult(internals.diagnoses.errCRNoLF);
	                            break;
	                        }
	
	                    // Fallthrough
	
	                    case '\t':
	                        // http://tools.ietf.org/html/rfc5322#section-3.2.2
	                        //   Runs of FWS, comment, or CFWS that occur between lexical tokens in
	                        //   a structured header field are semantically interpreted as a single
	                        //   space character.
	
	                        // http://tools.ietf.org/html/rfc5322#section-3.2.4
	                        //   the CRLF in any FWS/CFWS that appears within the quoted-string [is]
	                        //   semantically "invisible" and therefore not part of the
	                        //   quoted-string
	
	                        parseData.local += ' ';
	                        atomData.locals[elementCount] += ' ';
	                        ++elementLength;
	
	                        updateResult(internals.diagnoses.cfwsFWS);
	                        context.stack.push(context.now);
	                        context.now = internals.components.contextFWS;
	                        prevToken = token;
	                        break;
	
	                    // End of quoted string
	                    case '"':
	                        parseData.local += token;
	                        atomData.locals[elementCount] += token;
	                        ++elementLength;
	                        context.prev = context.now;
	                        context.now = context.stack.pop();
	                        break;
	
	                    // QTEXT
	                    default:
	                        // http://tools.ietf.org/html/rfc5322#section-3.2.4
	                        //   qtext          =   %d33 /             ; Printable US-ASCII
	                        //                      %d35-91 /          ;  characters not including
	                        //                      %d93-126 /         ;  "\" or the quote character
	                        //                      obs-qtext
	                        //
	                        //   obs-qtext      =   obs-NO-WS-CTL
	                        //
	                        //   obs-NO-WS-CTL  =   %d1-8 /            ; US-ASCII control
	                        //                      %d11 /             ;  characters that do not
	                        //                      %d12 /             ;  include the carriage
	                        //                      %d14-31 /          ;  return, line feed, and
	                        //                      %d127              ;  white space characters
	                        charCode = token.charCodeAt(0);
	
	                        if (charCode > 127 || charCode === 0 || charCode === 10) {
	                            updateResult(internals.diagnoses.errExpectingQTEXT);
	                        } else if (charCode < 32 || charCode === 127) {
	                            updateResult(internals.diagnoses.deprecatedQTEXT);
	                        }
	
	                        parseData.local += token;
	                        atomData.locals[elementCount] += token;
	                        ++elementLength;
	                }
	
	                // http://tools.ietf.org/html/rfc5322#section-3.4.1
	                //   If the string can be represented as a dot-atom (that is, it contains
	                //   no characters other than atext characters or "." surrounded by atext
	                //   characters), then the dot-atom form SHOULD be used and the quoted-
	                //   string form SHOULD NOT be used.
	
	                break;
	            // Quoted pair
	            case internals.components.contextQuotedPair:
	                // http://tools.ietf.org/html/rfc5322#section-3.2.1
	                //   quoted-pair     =   ("\" (VCHAR / WSP)) / obs-qp
	                //
	                //   VCHAR           =  %d33-126   ; visible (printing) characters
	                //   WSP             =  SP / HTAB  ; white space
	                //
	                //   obs-qp          =   "\" (%d0 / obs-NO-WS-CTL / LF / CR)
	                //
	                //   obs-NO-WS-CTL   =   %d1-8 /   ; US-ASCII control
	                //                       %d11 /    ;  characters that do not
	                //                       %d12 /    ;  include the carriage
	                //                       %d14-31 / ;  return, line feed, and
	                //                       %d127     ;  white space characters
	                //
	                // i.e. obs-qp       =  "\" (%d0-8, %d10-31 / %d127)
	                charCode = token.charCodeAt(0);
	
	                if (charCode > 127) {
	                    // Fatal error
	                    updateResult(internals.diagnoses.errExpectingQPair);
	                } else if (charCode < 31 && charCode !== 9 || charCode === 127) {
	                    // ' ' and '\t' are allowed
	                    updateResult(internals.diagnoses.deprecatedQP);
	                }
	
	                // At this point we know where this qpair occurred so we could check to see if the character actually needed to be quoted at all.
	                // http://tools.ietf.org/html/rfc5321#section-4.1.2
	                //   the sending system SHOULD transmit the form that uses the minimum quoting possible.
	
	                context.prev = context.now;
	                // End of qpair
	                context.now = context.stack.pop();
	                token = '\\' + token;
	
	                switch (context.now) {
	                    case internals.components.contextComment:
	                        break;
	
	                    case internals.components.contextQuotedString:
	                        parseData.local += token;
	                        atomData.locals[elementCount] += token;
	
	                        // The maximum sizes specified by RFC 5321 are octet counts, so we must include the backslash
	                        elementLength += 2;
	                        break;
	
	                    case internals.components.literal:
	                        parseData.domain += token;
	                        atomData.domains[elementCount] += token;
	
	                        // The maximum sizes specified by RFC 5321 are octet counts, so we must include the backslash
	                        elementLength += 2;
	                        break;
	
	                    // $lab:coverage:off$
	                    default:
	                        throw new Error('quoted pair logic invoked in an invalid context: ' + context.now);
	                    // $lab:coverage:on$
	                }
	                break;
	
	            // Comment
	            case internals.components.contextComment:
	                // http://tools.ietf.org/html/rfc5322#section-3.2.2
	                //   comment  = "(" *([FWS] ccontent) [FWS] ")"
	                //
	                //   ccontent = ctext / quoted-pair / comment
	                switch (token) {
	                    // Nested comment
	                    case '(':
	                        // Nested comments are ok
	                        context.stack.push(context.now);
	                        context.now = internals.components.contextComment;
	                        break;
	
	                    // End of comment
	                    case ')':
	                        context.prev = context.now;
	                        context.now = context.stack.pop();
	                        break;
	
	                    // Quoted pair
	                    case '\\':
	                        context.stack.push(context.now);
	                        context.now = internals.components.contextQuotedPair;
	                        break;
	
	                    // Folding white space
	                    case '\r':
	                        if (emailLength === ++i || email[i] !== '\n') {
	                            // Fatal error
	                            updateResult(internals.diagnoses.errCRNoLF);
	                            break;
	                        }
	
	                    // Fallthrough
	
	                    case ' ':
	                    case '\t':
	                        updateResult(internals.diagnoses.cfwsFWS);
	
	                        context.stack.push(context.now);
	                        context.now = internals.components.contextFWS;
	                        prevToken = token;
	                        break;
	
	                    // CTEXT
	                    default:
	                        // http://tools.ietf.org/html/rfc5322#section-3.2.3
	                        //   ctext         = %d33-39 /  ; Printable US-ASCII
	                        //                   %d42-91 /  ;  characters not including
	                        //                   %d93-126 / ;  "(", ")", or "\"
	                        //                   obs-ctext
	                        //
	                        //   obs-ctext     = obs-NO-WS-CTL
	                        //
	                        //   obs-NO-WS-CTL = %d1-8 /    ; US-ASCII control
	                        //                   %d11 /     ;  characters that do not
	                        //                   %d12 /     ;  include the carriage
	                        //                   %d14-31 /  ;  return, line feed, and
	                        //                   %d127      ;  white space characters
	                        charCode = token.charCodeAt(0);
	
	                        if (charCode > 127 || charCode === 0 || charCode === 10) {
	                            // Fatal error
	                            updateResult(internals.diagnoses.errExpectingCTEXT);
	                            break;
	                        } else if (charCode < 32 || charCode === 127) {
	                            updateResult(internals.diagnoses.deprecatedCTEXT);
	                        }
	                }
	
	                break;
	
	            // Folding white space
	            case internals.components.contextFWS:
	                // http://tools.ietf.org/html/rfc5322#section-3.2.2
	                //   FWS     =   ([*WSP CRLF] 1*WSP) /  obs-FWS
	                //                                   ; Folding white space
	
	                // But note the erratum:
	                // http://www.rfc-editor.org/errata_search.php?rfc=5322&eid=1908:
	                //   In the obsolete syntax, any amount of folding white space MAY be
	                //   inserted where the obs-FWS rule is allowed.  This creates the
	                //   possibility of having two consecutive "folds" in a line, and
	                //   therefore the possibility that a line which makes up a folded header
	                //   field could be composed entirely of white space.
	                //
	                //   obs-FWS =   1*([CRLF] WSP)
	
	                if (prevToken === '\r') {
	                    if (token === '\r') {
	                        // Fatal error
	                        updateResult(internals.diagnoses.errFWSCRLFx2);
	                        break;
	                    }
	
	                    if (++crlfCount > 1) {
	                        // Multiple folds => obsolete FWS
	                        updateResult(internals.diagnoses.deprecatedFWS);
	                    } else {
	                        crlfCount = 1;
	                    }
	                }
	
	                switch (token) {
	                    case '\r':
	                        if (emailLength === ++i || email[i] !== '\n') {
	                            // Fatal error
	                            updateResult(internals.diagnoses.errCRNoLF);
	                        }
	
	                        break;
	
	                    case ' ':
	                    case '\t':
	                        break;
	
	                    default:
	                        if (prevToken === '\r') {
	                            // Fatal error
	                            updateResult(internals.diagnoses.errFWSCRLFEnd);
	                        }
	
	                        crlfCount = 0;
	
	                        // End of FWS
	                        context.prev = context.now;
	                        context.now = context.stack.pop();
	
	                        // Look at this token again in the parent context
	                        --i;
	                }
	
	                prevToken = token;
	                break;
	
	            // Unexpected context
	            // $lab:coverage:off$
	            default:
	                throw new Error('unknown context: ' + context.now);
	            // $lab:coverage:on$
	        } // Primary state machine
	
	        if (maxResult > internals.categories.rfc5322) {
	            // Fatal error, no point continuing
	            break;
	        }
	    } // Token loop
	
	    // Check for errors
	    if (maxResult < internals.categories.rfc5322) {
	        // Fatal errors
	        if (context.now === internals.components.contextQuotedString) {
	            updateResult(internals.diagnoses.errUnclosedQuotedString);
	        } else if (context.now === internals.components.contextQuotedPair) {
	            updateResult(internals.diagnoses.errBackslashEnd);
	        } else if (context.now === internals.components.contextComment) {
	            updateResult(internals.diagnoses.errUnclosedComment);
	        } else if (context.now === internals.components.literal) {
	            updateResult(internals.diagnoses.errUnclosedDomainLiteral);
	        } else if (token === '\r') {
	            updateResult(internals.diagnoses.errFWSCRLFEnd);
	        } else if (parseData.domain.length === 0) {
	            updateResult(internals.diagnoses.errNoDomain);
	        } else if (elementLength === 0) {
	            updateResult(internals.diagnoses.errDotEnd);
	        } else if (hyphenFlag) {
	            updateResult(internals.diagnoses.errDomainHyphenEnd);
	        }
	
	        // Other errors
	        else if (parseData.domain.length > 255) {
	                // http://tools.ietf.org/html/rfc5321#section-4.5.3.1.2
	                //   The maximum total length of a domain name or number is 255 octets.
	                updateResult(internals.diagnoses.rfc5322DomainTooLong);
	            } else if (parseData.local.length + parseData.domain.length + /* '@' */1 > 254) {
	                // http://tools.ietf.org/html/rfc5321#section-4.1.2
	                //   Forward-path   = Path
	                //
	                //   Path           = "<" [ A-d-l ":" ] Mailbox ">"
	                //
	                // http://tools.ietf.org/html/rfc5321#section-4.5.3.1.3
	                //   The maximum total length of a reverse-path or forward-path is 256 octets (including the punctuation and element separators).
	                //
	                // Thus, even without (obsolete) routing information, the Mailbox can only be 254 characters long. This is confirmed by this verified
	                // erratum to RFC 3696:
	                //
	                // http://www.rfc-editor.org/errata_search.php?rfc=3696&eid=1690
	                //   However, there is a restriction in RFC 2821 on the length of an address in MAIL and RCPT commands of 254 characters.  Since
	                //   addresses that do not fit in those fields are not normally useful, the upper limit on address lengths should normally be considered
	                //   to be 254.
	                updateResult(internals.diagnoses.rfc5322TooLong);
	            } else if (elementLength > 63) {
	                // http://tools.ietf.org/html/rfc1035#section-2.3.4
	                // labels   63 octets or less
	                updateResult(internals.diagnoses.rfc5322LabelTooLong);
	            } else if (options.minDomainAtoms && atomData.domains.length < options.minDomainAtoms) {
	                updateResult(internals.diagnoses.errDomainTooShort);
	            } else if (options.tldWhitelist || options.tldBlacklist) {
	                var tldAtom = atomData.domains[elementCount];
	
	                if (!internals.validDomain(tldAtom, options)) {
	                    updateResult(internals.diagnoses.errUnknownTLD);
	                }
	            }
	    } // Check for errors
	
	    var dnsPositive = false;
	    var finishImmediately = false;
	
	    var finish = function finish() {
	
	        if (!dnsPositive && maxResult < internals.categories.dnsWarn) {
	            // Per RFC 5321, domain atoms are limited to letter-digit-hyphen, so we only need to check code <= 57 to check for a digit
	            var code = atomData.domains[elementCount].charCodeAt(0);
	            if (code <= 57) {
	                updateResult(internals.diagnoses.rfc5321TLDNumeric);
	            } else if (elementCount === 0) {
	                updateResult(internals.diagnoses.rfc5321TLD);
	            }
	        }
	
	        if (maxResult < threshold) {
	            maxResult = internals.diagnoses.valid;
	        }
	
	        var finishResult = diagnose ? maxResult : maxResult < internals.defaultThreshold;
	
	        if (callback) {
	            if (finishImmediately) {
	                callback(finishResult);
	            } else {
	                internals.defer(callback.bind(null, finishResult));
	            }
	        }
	
	        return finishResult;
	    }; // Finish
	
	    if (options.checkDNS && maxResult < internals.categories.dnsWarn) {
	        (function () {
	            // http://tools.ietf.org/html/rfc5321#section-2.3.5
	            //   Names that can be resolved to MX RRs or address (i.e., A or AAAA) RRs (as discussed in Section 5) are permitted, as are CNAME RRs whose
	            //   targets can be resolved, in turn, to MX or address RRs.
	            //
	            // http://tools.ietf.org/html/rfc5321#section-5.1
	            //   The lookup first attempts to locate an MX record associated with the name.  If a CNAME record is found, the resulting name is processed
	            //   as if it were the initial name. ... If an empty list of MXs is returned, the address is treated as if it was associated with an implicit
	            //   MX RR, with a preference of 0, pointing to that host.
	            //
	            // isEmail() author's note: We will regard the existence of a CNAME to be sufficient evidence of the domain's existence. For performance
	            // reasons we will not repeat the DNS lookup for the CNAME's target, but we will raise a warning because we didn't immediately find an MX
	            // record.
	            if (elementCount === 0) {
	                // Checking TLD DNS only works if you explicitly check from the root
	                parseData.domain += '.';
	            }
	
	            var dnsDomain = parseData.domain;
	            Dns.resolveMx(dnsDomain, function (err, mxRecords) {
	
	                // If we have a fatal error, then we must assume that there are no records
	                if (err && err.code !== Dns.NODATA) {
	                    updateResult(internals.diagnoses.dnsWarnNoRecord);
	                    return finish();
	                }
	
	                if (mxRecords && mxRecords.length) {
	                    dnsPositive = true;
	                    return finish();
	                }
	
	                var count = 3;
	                var done = false;
	                updateResult(internals.diagnoses.dnsWarnNoMXRecord);
	
	                var handleRecords = function handleRecords(err, records) {
	
	                    if (done) {
	                        return;
	                    }
	
	                    --count;
	
	                    if (records && records.length) {
	                        done = true;
	                        return finish();
	                    }
	
	                    if (count === 0) {
	                        // No usable records for the domain can be found
	                        updateResult(internals.diagnoses.dnsWarnNoRecord);
	                        done = true;
	                        finish();
	                    }
	                };
	
	                Dns.resolveCname(dnsDomain, handleRecords);
	                Dns.resolve4(dnsDomain, handleRecords);
	                Dns.resolve6(dnsDomain, handleRecords);
	            });
	
	            finishImmediately = true;
	        })();
	    } else {
	        var result = finish();
	        finishImmediately = true;
	        return result;
	    } // CheckDNS
	};
	
	exports.diagnoses = internals.validate.diagnoses = (function () {
	
	    var diag = {};
	    var keys = Object.keys(internals.diagnoses);
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        diag[key] = internals.diagnoses[key];
	    }
	
	    return diag;
	})();

/***/ },
/* 23 */
/*!***************************!*\
  !*** ./lib/string/uri.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load Modules
	
	var RFC3986 = __webpack_require__(/*! ./rfc3986 */ 24);
	
	// Declare internals
	
	var internals = {
	    Uri: {
	        createUriRegex: function createUriRegex(optionalScheme) {
	
	            var scheme = RFC3986.scheme;
	
	            // If we were passed a scheme, use it instead of the generic one
	            if (optionalScheme) {
	
	                // Have to put this in a non-capturing group to handle the OR statements
	                scheme = '(?:' + optionalScheme + ')';
	            }
	
	            /**
	             * URI = scheme ":" hier-part [ "?" query ] [ "#" fragment ]
	             */
	            return new RegExp('^' + scheme + ':' + RFC3986.hierPart + '(?:\\?' + RFC3986.query + ')?' + '(?:#' + RFC3986.fragment + ')?$');
	        }
	    }
	};
	
	module.exports = internals.Uri;

/***/ },
/* 24 */
/*!*******************************!*\
  !*** ./lib/string/rfc3986.js ***!
  \*******************************/
/***/ function(module, exports) {

	'use strict';
	
	// Load modules
	
	// Delcare internals
	
	var internals = {
	  rfc3986: {}
	};
	
	internals.generate = function () {
	
	  /**
	   * elements separated by forward slash ("/") are alternatives.
	   */
	  var or = '|';
	
	  /**
	   * DIGIT = %x30-39 ; 0-9
	   */
	  var digit = '0-9';
	  var digitOnly = '[' + digit + ']';
	
	  /**
	   * ALPHA = %x41-5A / %x61-7A   ; A-Z / a-z
	   */
	  var alpha = 'a-zA-Z';
	  var alphaOnly = '[' + alpha + ']';
	
	  /**
	   * cidr       = DIGIT                ; 0-9
	   *            / %x31-32 DIGIT         ; 10-29
	   *            / "3" %x30-32           ; 30-32
	   */
	  internals.rfc3986.cidr = digitOnly + or + '[1-2]' + digitOnly + or + '3' + '[0-2]';
	
	  /**
	   * HEXDIG = DIGIT / "A" / "B" / "C" / "D" / "E" / "F"
	   */
	  var hexDigit = digit + 'A-Fa-f';
	  var hexDigitOnly = '[' + hexDigit + ']';
	
	  /**
	   * unreserved = ALPHA / DIGIT / "-" / "." / "_" / "~"
	   */
	  var unreserved = alpha + digit + '-\\._~';
	
	  /**
	   * sub-delims = "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
	   */
	  var subDelims = '!\\$&\'\\(\\)\\*\\+,;=';
	
	  /**
	   * pct-encoded = "%" HEXDIG HEXDIG
	   */
	  var pctEncoded = '%' + hexDigit;
	
	  /**
	   * pchar = unreserved / pct-encoded / sub-delims / ":" / "@"
	   */
	  var pchar = unreserved + pctEncoded + subDelims + ':@';
	  var pcharOnly = '[' + pchar + ']';
	
	  /**
	   * Rule to support zero-padded addresses.
	   */
	  var zeroPad = '0?';
	
	  /**
	   * dec-octet   = DIGIT                 ; 0-9
	   *            / %x31-39 DIGIT         ; 10-99
	   *            / "1" 2DIGIT            ; 100-199
	   *            / "2" %x30-34 DIGIT     ; 200-249
	   *            / "25" %x30-35          ; 250-255
	   */
	  var decOctect = '(?:' + zeroPad + zeroPad + digitOnly + or + zeroPad + '[1-9]' + digitOnly + or + '1' + digitOnly + digitOnly + or + '2' + '[0-4]' + digitOnly + or + '25' + '[0-5])';
	
	  /**
	   * IPv4address = dec-octet "." dec-octet "." dec-octet "." dec-octet
	   */
	  internals.rfc3986.IPv4address = '(?:' + decOctect + '\\.){3}' + decOctect;
	
	  /**
	   * h16 = 1*4HEXDIG ; 16 bits of address represented in hexadecimal
	   * ls32 = ( h16 ":" h16 ) / IPv4address ; least-significant 32 bits of address
	   * IPv6address =                            6( h16 ":" ) ls32
	   *             /                       "::" 5( h16 ":" ) ls32
	   *             / [               h16 ] "::" 4( h16 ":" ) ls32
	   *             / [ *1( h16 ":" ) h16 ] "::" 3( h16 ":" ) ls32
	   *             / [ *2( h16 ":" ) h16 ] "::" 2( h16 ":" ) ls32
	   *             / [ *3( h16 ":" ) h16 ] "::"    h16 ":"   ls32
	   *             / [ *4( h16 ":" ) h16 ] "::"              ls32
	   *             / [ *5( h16 ":" ) h16 ] "::"              h16
	   *             / [ *6( h16 ":" ) h16 ] "::"
	   */
	  var h16 = hexDigitOnly + '{1,4}';
	  var ls32 = '(?:' + h16 + ':' + h16 + '|' + internals.rfc3986.IPv4address + ')';
	  var IPv6SixHex = '(?:' + h16 + ':){6}' + ls32;
	  var IPv6FiveHex = '::(?:' + h16 + ':){5}' + ls32;
	  var IPv6FourHex = h16 + '::(?:' + h16 + ':){4}' + ls32;
	  var IPv6ThreeHex = '(?:' + h16 + ':){0,1}' + h16 + '::(?:' + h16 + ':){3}' + ls32;
	  var IPv6TwoHex = '(?:' + h16 + ':){0,2}' + h16 + '::(?:' + h16 + ':){2}' + ls32;
	  var IPv6OneHex = '(?:' + h16 + ':){0,3}' + h16 + '::' + h16 + ':' + ls32;
	  var IPv6NoneHex = '(?:' + h16 + ':){0,4}' + h16 + '::' + ls32;
	  var IPv6NoneHex2 = '(?:' + h16 + ':){0,5}' + h16 + '::' + h16;
	  var IPv6NoneHex3 = '(?:' + h16 + ':){0,6}' + h16 + '::';
	  internals.rfc3986.IPv6address = '(?:' + IPv6SixHex + or + IPv6FiveHex + or + IPv6FourHex + or + IPv6ThreeHex + or + IPv6TwoHex + or + IPv6OneHex + or + IPv6NoneHex + or + IPv6NoneHex2 + or + IPv6NoneHex3 + ')';
	
	  /**
	   * IPvFuture = "v" 1*HEXDIG "." 1*( unreserved / sub-delims / ":" )
	   */
	  internals.rfc3986.IPvFuture = 'v' + hexDigitOnly + '+\\.[' + unreserved + subDelims + ':]+';
	
	  /**
	   * scheme = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
	   */
	  internals.rfc3986.scheme = alphaOnly + '[' + alpha + digit + '+-\\.]*';
	
	  /**
	   * userinfo = *( unreserved / pct-encoded / sub-delims / ":" )
	   */
	  var userinfo = '[' + unreserved + pctEncoded + subDelims + ':]*';
	
	  /**
	   * IP-literal = "[" ( IPv6address / IPvFuture  ) "]"
	   */
	  var IPLiteral = '\\[(?:' + internals.rfc3986.IPv6address + or + internals.rfc3986.IPvFuture + ')\\]';
	
	  /**
	   * reg-name = *( unreserved / pct-encoded / sub-delims )
	   */
	  var regName = '[' + unreserved + pctEncoded + subDelims + ']{0,255}';
	
	  /**
	   * host = IP-literal / IPv4address / reg-name
	   */
	  var host = '(?:' + IPLiteral + or + internals.rfc3986.IPv4address + or + regName + ')';
	
	  /**
	   * port = *DIGIT
	   */
	  var port = digitOnly + '*';
	
	  /**
	   * authority   = [ userinfo "@" ] host [ ":" port ]
	   */
	  var authority = '(?:' + userinfo + '@)?' + host + '(?::' + port + ')?';
	
	  /**
	   * segment       = *pchar
	   * segment-nz    = 1*pchar
	   * path          = path-abempty    ; begins with "/" or is empty
	   *               / path-absolute   ; begins with "/" but not "//"
	   *               / path-noscheme   ; begins with a non-colon segment
	   *               / path-rootless   ; begins with a segment
	   *               / path-empty      ; zero characters
	   * path-abempty  = *( "/" segment )
	   * path-absolute = "/" [ segment-nz *( "/" segment ) ]
	   * path-rootless = segment-nz *( "/" segment )
	   */
	  var segment = pcharOnly + '*';
	  var segmentNz = pcharOnly + '+';
	  var pathAbEmpty = '(?:\\/' + segment + ')*';
	  var pathAbsolute = '\\/(?:' + segmentNz + pathAbEmpty + ')?';
	  var pathRootless = segmentNz + pathAbEmpty;
	
	  /**
	   * hier-part = "//" authority path
	   */
	  internals.rfc3986.hierPart = '(?:\\/\\/' + authority + pathAbEmpty + or + pathAbsolute + or + pathRootless + ')';
	
	  /**
	   * query = *( pchar / "/" / "?" )
	   */
	  internals.rfc3986.query = '[' + pchar + '\\/\\?]*(?=#|$)'; //Finish matching either at the fragment part or end of the line.
	
	  /**
	   * fragment = *( pchar / "/" / "?" )
	   */
	  internals.rfc3986.fragment = '[' + pchar + '\\/\\?]*';
	};
	
	internals.generate();
	
	module.exports = internals.rfc3986;

/***/ },
/* 25 */
/*!**************************!*\
  !*** ./lib/string/ip.js ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	var RFC3986 = __webpack_require__(/*! ./rfc3986 */ 24);
	
	// Declare internals
	
	var internals = {
	    Ip: {
	        cidrs: {
	            required: '\\/(?:' + RFC3986.cidr + ')',
	            optional: '(?:\\/(?:' + RFC3986.cidr + '))?',
	            forbidden: ''
	        },
	        versions: {
	            ipv4: RFC3986.IPv4address,
	            ipv6: RFC3986.IPv6address,
	            ipvfuture: RFC3986.IPvFuture
	        }
	    }
	};
	
	internals.Ip.createIpRegex = function (versions, cidr) {
	
	    var regex = undefined;
	    for (var i = 0; i < versions.length; ++i) {
	        var version = versions[i];
	        if (!regex) {
	            regex = '^(?:' + internals.Ip.versions[version];
	        }
	        regex = regex + '|' + internals.Ip.versions[version];
	    }
	
	    return new RegExp(regex + ')' + internals.Ip.cidrs[cidr] + '$');
	};
	
	module.exports = internals.Ip;

/***/ },
/* 26 */
/*!***********************!*\
  !*** ./lib/number.js ***!
  \***********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	var Any = __webpack_require__(/*! ./any */ 1);
	var Ref = __webpack_require__(/*! ./ref */ 12);
	var Errors = __webpack_require__(/*! ./errors */ 13);
	var Hoek = __webpack_require__(/*! hoek */ 6);
	
	// Declare internals
	
	var internals = {};
	
	internals.Number = function () {
	
	    Any.call(this);
	    this._type = 'number';
	    this._invalids.add(Infinity);
	    this._invalids.add(-Infinity);
	};
	
	Hoek.inherits(internals.Number, Any);
	
	internals.compare = function (type, compare) {
	
	    return function (limit) {
	
	        var isRef = Ref.isRef(limit);
	        var isNumber = typeof limit === 'number' && !isNaN(limit);
	
	        Hoek.assert(isNumber || isRef, 'limit must be a number or reference');
	
	        return this._test(type, limit, function (value, state, options) {
	
	            var compareTo = undefined;
	            if (isRef) {
	                compareTo = limit(state.parent, options);
	
	                if (!(typeof compareTo === 'number' && !isNaN(compareTo))) {
	                    return Errors.create('number.ref', { ref: limit.key }, state, options);
	                }
	            } else {
	                compareTo = limit;
	            }
	
	            if (compare(value, compareTo)) {
	                return null;
	            }
	
	            return Errors.create('number.' + type, { limit: compareTo, value: value }, state, options);
	        });
	    };
	};
	
	internals.Number.prototype._base = function (value, state, options) {
	
	    var result = {
	        errors: null,
	        value: value
	    };
	
	    if (typeof value === 'string' && options.convert) {
	
	        var number = parseFloat(value);
	        result.value = isNaN(number) || !isFinite(value) ? NaN : number;
	    }
	
	    var isNumber = typeof result.value === 'number' && !isNaN(result.value);
	
	    if (options.convert && 'precision' in this._flags && isNumber) {
	
	        // This is conceptually equivalent to using toFixed but it should be much faster
	        var precision = Math.pow(10, this._flags.precision);
	        result.value = Math.round(result.value * precision) / precision;
	    }
	
	    result.errors = isNumber ? null : Errors.create('number.base', null, state, options);
	    return result;
	};
	
	internals.Number.prototype.min = internals.compare('min', function (value, limit) {
	    return value >= limit;
	});
	internals.Number.prototype.max = internals.compare('max', function (value, limit) {
	    return value <= limit;
	});
	internals.Number.prototype.greater = internals.compare('greater', function (value, limit) {
	    return value > limit;
	});
	internals.Number.prototype.less = internals.compare('less', function (value, limit) {
	    return value < limit;
	});
	
	internals.Number.prototype.multiple = function (base) {
	
	    Hoek.assert(Hoek.isInteger(base), 'multiple must be an integer');
	    Hoek.assert(base > 0, 'multiple must be greater than 0');
	
	    return this._test('multiple', base, function (value, state, options) {
	
	        if (value % base === 0) {
	            return null;
	        }
	
	        return Errors.create('number.multiple', { multiple: base, value: value }, state, options);
	    });
	};
	
	internals.Number.prototype.integer = function () {
	
	    return this._test('integer', undefined, function (value, state, options) {
	
	        return Hoek.isInteger(value) ? null : Errors.create('number.integer', { value: value }, state, options);
	    });
	};
	
	internals.Number.prototype.negative = function () {
	
	    return this._test('negative', undefined, function (value, state, options) {
	
	        if (value < 0) {
	            return null;
	        }
	
	        return Errors.create('number.negative', { value: value }, state, options);
	    });
	};
	
	internals.Number.prototype.positive = function () {
	
	    return this._test('positive', undefined, function (value, state, options) {
	
	        if (value > 0) {
	            return null;
	        }
	
	        return Errors.create('number.positive', { value: value }, state, options);
	    });
	};
	
	internals.precisionRx = /(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/;
	
	internals.Number.prototype.precision = function (limit) {
	
	    Hoek.assert(Hoek.isInteger(limit), 'limit must be an integer');
	    Hoek.assert(!('precision' in this._flags), 'precision already set');
	
	    var obj = this._test('precision', limit, function (value, state, options) {
	
	        var places = value.toString().match(internals.precisionRx);
	        var decimals = Math.max((places[1] ? places[1].length : 0) - (places[2] ? parseInt(places[2], 10) : 0), 0);
	        if (decimals <= limit) {
	            return null;
	        }
	
	        return Errors.create('number.precision', { limit: limit, value: value }, state, options);
	    });
	
	    obj._flags.precision = limit;
	    return obj;
	};
	
	module.exports = new internals.Number();

/***/ },
/* 27 */
/*!************************!*\
  !*** ./lib/boolean.js ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	var Any = __webpack_require__(/*! ./any */ 1);
	var Errors = __webpack_require__(/*! ./errors */ 13);
	var Hoek = __webpack_require__(/*! hoek */ 6);
	
	// Declare internals
	
	var internals = {};
	
	internals.Boolean = function () {
	
	    Any.call(this);
	    this._type = 'boolean';
	};
	
	Hoek.inherits(internals.Boolean, Any);
	
	internals.Boolean.prototype._base = function (value, state, options) {
	
	    var result = {
	        value: value
	    };
	
	    if (typeof value === 'string' && options.convert) {
	
	        var lower = value.toLowerCase();
	        result.value = lower === 'true' || lower === 'yes' || lower === 'on' ? true : lower === 'false' || lower === 'no' || lower === 'off' ? false : value;
	    }
	
	    result.errors = typeof result.value === 'boolean' ? null : Errors.create('boolean.base', null, state, options);
	    return result;
	};
	
	module.exports = new internals.Boolean();

/***/ },
/* 28 */
/*!*****************************!*\
  !*** ./lib/alternatives.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	var Hoek = __webpack_require__(/*! hoek */ 6);
	var Any = __webpack_require__(/*! ./any */ 1);
	var Cast = __webpack_require__(/*! ./cast */ 15);
	var Ref = __webpack_require__(/*! ./ref */ 12);
	var Errors = __webpack_require__(/*! ./errors */ 13);
	
	// Declare internals
	
	var internals = {};
	
	internals.Alternatives = function () {
	
	    Any.call(this);
	    this._type = 'alternatives';
	    this._invalids.remove(null);
	
	    this._inner.matches = [];
	};
	
	Hoek.inherits(internals.Alternatives, Any);
	
	internals.Alternatives.prototype._base = function (value, state, options) {
	
	    var errors = [];
	    for (var i = 0; i < this._inner.matches.length; ++i) {
	        var item = this._inner.matches[i];
	        var schema = item.schema;
	        if (!schema) {
	            var failed = item.is._validate(item.ref(state.parent, options), null, options, state.parent).errors;
	            schema = failed ? item.otherwise : item.then;
	            if (!schema) {
	                continue;
	            }
	        }
	
	        var result = schema._validate(value, state, options);
	        if (!result.errors) {
	            // Found a valid match
	            return result;
	        }
	
	        errors = errors.concat(result.errors);
	    }
	
	    return { errors: errors.length ? errors : Errors.create('alternatives.base', null, state, options) };
	};
	
	internals.Alternatives.prototype['try'] = function () /* schemas */{
	
	    var schemas = Hoek.flatten(Array.prototype.slice.call(arguments));
	    Hoek.assert(schemas.length, 'Cannot add other alternatives without at least one schema');
	
	    var obj = this.clone();
	
	    for (var i = 0; i < schemas.length; ++i) {
	        var cast = Cast.schema(schemas[i]);
	        if (cast._refs.length) {
	            obj._refs = obj._refs.concat(cast._refs);
	        }
	        obj._inner.matches.push({ schema: cast });
	    }
	
	    return obj;
	};
	
	internals.Alternatives.prototype.when = function (ref, options) {
	
	    Hoek.assert(Ref.isRef(ref) || typeof ref === 'string', 'Invalid reference:', ref);
	    Hoek.assert(options, 'Missing options');
	    Hoek.assert(typeof options === 'object', 'Invalid options');
	    Hoek.assert(options.hasOwnProperty('is'), 'Missing "is" directive');
	    Hoek.assert(options.then !== undefined || options.otherwise !== undefined, 'options must have at least one of "then" or "otherwise"');
	
	    var obj = this.clone();
	    var is = Cast.schema(options.is);
	
	    if (options.is === null || !options.is.isJoi) {
	
	        // Only apply required if this wasn't already a schema, we'll suppose people know what they're doing
	        is = is.required();
	    }
	
	    var item = {
	        ref: Cast.ref(ref),
	        is: is,
	        then: options.then !== undefined ? Cast.schema(options.then) : undefined,
	        otherwise: options.otherwise !== undefined ? Cast.schema(options.otherwise) : undefined
	    };
	
	    Ref.push(obj._refs, item.ref);
	    obj._refs = obj._refs.concat(item.is._refs);
	
	    if (item.then && item.then._refs) {
	        obj._refs = obj._refs.concat(item.then._refs);
	    }
	
	    if (item.otherwise && item.otherwise._refs) {
	        obj._refs = obj._refs.concat(item.otherwise._refs);
	    }
	
	    obj._inner.matches.push(item);
	
	    return obj;
	};
	
	internals.Alternatives.prototype.describe = function () {
	
	    var description = Any.prototype.describe.call(this);
	    var alternatives = [];
	    for (var i = 0; i < this._inner.matches.length; ++i) {
	        var item = this._inner.matches[i];
	        if (item.schema) {
	
	            // try()
	
	            alternatives.push(item.schema.describe());
	        } else {
	
	            // when()
	
	            var when = {
	                ref: item.ref.toString(),
	                is: item.is.describe()
	            };
	
	            if (item.then) {
	                when.then = item.then.describe();
	            }
	
	            if (item.otherwise) {
	                when.otherwise = item.otherwise.describe();
	            }
	
	            alternatives.push(when);
	        }
	    }
	
	    description.alternatives = alternatives;
	    return description;
	};
	
	module.exports = new internals.Alternatives();

/***/ },
/* 29 */
/*!***********************!*\
  !*** ./lib/object.js ***!
  \***********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	var Hoek = __webpack_require__(/*! hoek */ 6);
	var Topo = __webpack_require__(/*! topo */ 30);
	var Any = __webpack_require__(/*! ./any */ 1);
	var Cast = __webpack_require__(/*! ./cast */ 15);
	var Errors = __webpack_require__(/*! ./errors */ 13);
	
	// Declare internals
	
	var internals = {};
	
	internals.Object = function () {
	
	    Any.call(this);
	    this._type = 'object';
	    this._inner.children = null;
	    this._inner.renames = [];
	    this._inner.dependencies = [];
	    this._inner.patterns = [];
	};
	
	Hoek.inherits(internals.Object, Any);
	
	internals.Object.prototype._base = function (value, state, options) {
	
	    var target = value;
	    var errors = [];
	    var finish = function finish() {
	
	        return {
	            value: target,
	            errors: errors.length ? errors : null
	        };
	    };
	
	    if (typeof value === 'string' && options.convert) {
	
	        try {
	            value = JSON.parse(value);
	        } catch (parseErr) {}
	    }
	
	    var type = this._flags.func ? 'function' : 'object';
	    if (!value || typeof value !== type || Array.isArray(value)) {
	
	        errors.push(Errors.create(type + '.base', null, state, options));
	        return finish();
	    }
	
	    // Skip if there are no other rules to test
	
	    if (!this._inner.renames.length && !this._inner.dependencies.length && !this._inner.children && // null allows any keys
	    !this._inner.patterns.length) {
	
	        target = value;
	        return finish();
	    }
	
	    // Ensure target is a local copy (parsed) or shallow copy
	
	    if (target === value) {
	        if (type === 'object') {
	            target = Object.create(Object.getPrototypeOf(value));
	        } else {
	            target = function () {
	
	                return value.apply(this, arguments);
	            };
	
	            target.prototype = Hoek.clone(value.prototype);
	        }
	
	        var valueKeys = Object.keys(value);
	        for (var i = 0; i < valueKeys.length; ++i) {
	            target[valueKeys[i]] = value[valueKeys[i]];
	        }
	    } else {
	        target = value;
	    }
	
	    // Rename keys
	
	    var renamed = {};
	    for (var i = 0; i < this._inner.renames.length; ++i) {
	        var item = this._inner.renames[i];
	
	        if (item.options.ignoreUndefined && target[item.from] === undefined) {
	            continue;
	        }
	
	        if (!item.options.multiple && renamed[item.to]) {
	
	            errors.push(Errors.create('object.rename.multiple', { from: item.from, to: item.to }, state, options));
	            if (options.abortEarly) {
	                return finish();
	            }
	        }
	
	        if (Object.prototype.hasOwnProperty.call(target, item.to) && !item.options.override && !renamed[item.to]) {
	
	            errors.push(Errors.create('object.rename.override', { from: item.from, to: item.to }, state, options));
	            if (options.abortEarly) {
	                return finish();
	            }
	        }
	
	        if (target[item.from] === undefined) {
	            delete target[item.to];
	        } else {
	            target[item.to] = target[item.from];
	        }
	
	        renamed[item.to] = true;
	
	        if (!item.options.alias) {
	            delete target[item.from];
	        }
	    }
	
	    // Validate schema
	
	    if (!this._inner.children && // null allows any keys
	    !this._inner.patterns.length && !this._inner.dependencies.length) {
	
	        return finish();
	    }
	
	    var unprocessed = Hoek.mapToObject(Object.keys(target));
	
	    if (this._inner.children) {
	        for (var i = 0; i < this._inner.children.length; ++i) {
	            var child = this._inner.children[i];
	            var key = child.key;
	            var item = target[key];
	
	            delete unprocessed[key];
	
	            var localState = { key: key, path: (state.path || '') + (state.path && key ? '.' : '') + key, parent: target, reference: state.reference };
	            var result = child.schema._validate(item, localState, options);
	            if (result.errors) {
	                errors.push(Errors.create('object.child', { key: key, reason: result.errors }, localState, options));
	
	                if (options.abortEarly) {
	                    return finish();
	                }
	            }
	
	            if (child.schema._flags.strip || result.value === undefined && result.value !== item) {
	                delete target[key];
	            } else if (result.value !== undefined) {
	                target[key] = result.value;
	            }
	        }
	    }
	
	    // Unknown keys
	
	    var unprocessedKeys = Object.keys(unprocessed);
	    if (unprocessedKeys.length && this._inner.patterns.length) {
	
	        for (var i = 0; i < unprocessedKeys.length; ++i) {
	            var key = unprocessedKeys[i];
	
	            for (var j = 0; j < this._inner.patterns.length; ++j) {
	                var pattern = this._inner.patterns[j];
	
	                if (pattern.regex.test(key)) {
	                    delete unprocessed[key];
	
	                    var item = target[key];
	                    var localState = { key: key, path: (state.path ? state.path + '.' : '') + key, parent: target, reference: state.reference };
	                    var result = pattern.rule._validate(item, localState, options);
	                    if (result.errors) {
	                        errors.push(Errors.create('object.child', { key: key, reason: result.errors }, localState, options));
	
	                        if (options.abortEarly) {
	                            return finish();
	                        }
	                    }
	
	                    if (result.value !== undefined) {
	                        target[key] = result.value;
	                    }
	                }
	            }
	        }
	
	        unprocessedKeys = Object.keys(unprocessed);
	    }
	
	    if ((this._inner.children || this._inner.patterns.length) && unprocessedKeys.length) {
	        if (options.stripUnknown || options.skipFunctions) {
	
	            for (var i = 0; i < unprocessedKeys.length; ++i) {
	                var key = unprocessedKeys[i];
	
	                if (options.stripUnknown) {
	                    delete target[key];
	                    delete unprocessed[key];
	                } else if (typeof target[key] === 'function') {
	                    delete unprocessed[key];
	                }
	            }
	
	            unprocessedKeys = Object.keys(unprocessed);
	        }
	
	        if (unprocessedKeys.length && (this._flags.allowUnknown !== undefined ? !this._flags.allowUnknown : !options.allowUnknown)) {
	
	            for (var i = 0; i < unprocessedKeys.length; ++i) {
	                errors.push(Errors.create('object.allowUnknown', null, { key: unprocessedKeys[i], path: state.path + (state.path ? '.' : '') + unprocessedKeys[i] }, options));
	            }
	        }
	    }
	
	    // Validate dependencies
	
	    for (var i = 0; i < this._inner.dependencies.length; ++i) {
	        var dep = this._inner.dependencies[i];
	        var err = internals[dep.type](dep.key !== null && value[dep.key], dep.peers, target, { key: dep.key, path: (state.path || '') + (dep.key ? '.' + dep.key : '') }, options);
	        if (err) {
	            errors.push(err);
	            if (options.abortEarly) {
	                return finish();
	            }
	        }
	    }
	
	    return finish();
	};
	
	internals.Object.prototype._func = function () {
	
	    var obj = this.clone();
	    obj._flags.func = true;
	    return obj;
	};
	
	internals.Object.prototype.keys = function (schema) {
	
	    Hoek.assert(schema === null || schema === undefined || typeof schema === 'object', 'Object schema must be a valid object');
	    Hoek.assert(!schema || !schema.isJoi, 'Object schema cannot be a joi schema');
	
	    var obj = this.clone();
	
	    if (!schema) {
	        obj._inner.children = null;
	        return obj;
	    }
	
	    var children = Object.keys(schema);
	
	    if (!children.length) {
	        obj._inner.children = [];
	        return obj;
	    }
	
	    var topo = new Topo();
	    if (obj._inner.children) {
	        for (var i = 0; i < obj._inner.children.length; ++i) {
	            var child = obj._inner.children[i];
	
	            // Only add the key if we are not going to replace it later
	            if (children.indexOf(child.key) === -1) {
	                topo.add(child, { after: child._refs, group: child.key });
	            }
	        }
	    }
	
	    for (var i = 0; i < children.length; ++i) {
	        var key = children[i];
	        var child = schema[key];
	        try {
	            var cast = Cast.schema(child);
	            topo.add({ key: key, schema: cast }, { after: cast._refs, group: key });
	        } catch (castErr) {
	            if (castErr.hasOwnProperty('path')) {
	                castErr.path = key + '.' + castErr.path;
	            } else {
	                castErr.path = key;
	            }
	            throw castErr;
	        }
	    }
	
	    obj._inner.children = topo.nodes;
	
	    return obj;
	};
	
	internals.Object.prototype.unknown = function (allow) {
	
	    var obj = this.clone();
	    obj._flags.allowUnknown = allow !== false;
	    return obj;
	};
	
	internals.Object.prototype.length = function (limit) {
	
	    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');
	
	    return this._test('length', limit, function (value, state, options) {
	
	        if (Object.keys(value).length === limit) {
	            return null;
	        }
	
	        return Errors.create('object.length', { limit: limit }, state, options);
	    });
	};
	
	internals.Object.prototype.min = function (limit) {
	
	    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');
	
	    return this._test('min', limit, function (value, state, options) {
	
	        if (Object.keys(value).length >= limit) {
	            return null;
	        }
	
	        return Errors.create('object.min', { limit: limit }, state, options);
	    });
	};
	
	internals.Object.prototype.max = function (limit) {
	
	    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');
	
	    return this._test('max', limit, function (value, state, options) {
	
	        if (Object.keys(value).length <= limit) {
	            return null;
	        }
	
	        return Errors.create('object.max', { limit: limit }, state, options);
	    });
	};
	
	internals.Object.prototype.pattern = function (pattern, schema) {
	
	    Hoek.assert(pattern instanceof RegExp, 'Invalid regular expression');
	    Hoek.assert(schema !== undefined, 'Invalid rule');
	
	    pattern = new RegExp(pattern.source, pattern.ignoreCase ? 'i' : undefined); // Future version should break this and forbid unsupported regex flags
	
	    try {
	        schema = Cast.schema(schema);
	    } catch (castErr) {
	        if (castErr.hasOwnProperty('path')) {
	            castErr.message = castErr.message + '(' + castErr.path + ')';
	        }
	
	        throw castErr;
	    }
	
	    var obj = this.clone();
	    obj._inner.patterns.push({ regex: pattern, rule: schema });
	    return obj;
	};
	
	internals.Object.prototype['with'] = function (key, peers) {
	
	    return this._dependency('with', key, peers);
	};
	
	internals.Object.prototype.without = function (key, peers) {
	
	    return this._dependency('without', key, peers);
	};
	
	internals.Object.prototype.xor = function () {
	
	    var peers = Hoek.flatten(Array.prototype.slice.call(arguments));
	    return this._dependency('xor', null, peers);
	};
	
	internals.Object.prototype.or = function () {
	
	    var peers = Hoek.flatten(Array.prototype.slice.call(arguments));
	    return this._dependency('or', null, peers);
	};
	
	internals.Object.prototype.and = function () {
	
	    var peers = Hoek.flatten(Array.prototype.slice.call(arguments));
	    return this._dependency('and', null, peers);
	};
	
	internals.Object.prototype.nand = function () {
	
	    var peers = Hoek.flatten(Array.prototype.slice.call(arguments));
	    return this._dependency('nand', null, peers);
	};
	
	internals.Object.prototype.requiredKeys = function (children) {
	
	    children = Hoek.flatten(Array.prototype.slice.call(arguments));
	    return this.applyFunctionToChildren(children, 'required');
	};
	
	internals.Object.prototype.optionalKeys = function (children) {
	
	    children = Hoek.flatten(Array.prototype.slice.call(arguments));
	    return this.applyFunctionToChildren(children, 'optional');
	};
	
	internals.renameDefaults = {
	    alias: false, // Keep old value in place
	    multiple: false, // Allow renaming multiple keys into the same target
	    override: false // Overrides an existing key
	};
	
	internals.Object.prototype.rename = function (from, to, options) {
	
	    Hoek.assert(typeof from === 'string', 'Rename missing the from argument');
	    Hoek.assert(typeof to === 'string', 'Rename missing the to argument');
	    Hoek.assert(to !== from, 'Cannot rename key to same name:', from);
	
	    for (var i = 0; i < this._inner.renames.length; ++i) {
	        Hoek.assert(this._inner.renames[i].from !== from, 'Cannot rename the same key multiple times');
	    }
	
	    var obj = this.clone();
	
	    obj._inner.renames.push({
	        from: from,
	        to: to,
	        options: Hoek.applyToDefaults(internals.renameDefaults, options || {})
	    });
	
	    return obj;
	};
	
	internals.groupChildren = function (children) {
	
	    children.sort();
	
	    var grouped = {};
	
	    for (var i = 0; i < children.length; ++i) {
	        var child = children[i];
	        Hoek.assert(typeof child === 'string', 'children must be strings');
	        var group = child.split('.')[0];
	        var childGroup = grouped[group] = grouped[group] || [];
	        childGroup.push(child.substring(group.length + 1));
	    }
	
	    return grouped;
	};
	
	internals.Object.prototype.applyFunctionToChildren = function (children, fn, args, root) {
	
	    children = [].concat(children);
	    Hoek.assert(children.length > 0, 'expected at least one children');
	
	    var groupedChildren = internals.groupChildren(children);
	    var obj = undefined;
	
	    if ('' in groupedChildren) {
	        obj = this[fn].apply(this, args);
	        delete groupedChildren[''];
	    } else {
	        obj = this.clone();
	    }
	
	    if (obj._inner.children) {
	        root = root ? root + '.' : '';
	
	        for (var i = 0; i < obj._inner.children.length; ++i) {
	            var child = obj._inner.children[i];
	            var group = groupedChildren[child.key];
	
	            if (group) {
	                obj._inner.children[i] = {
	                    key: child.key,
	                    _refs: child._refs,
	                    schema: child.schema.applyFunctionToChildren(group, fn, args, root + child.key)
	                };
	
	                delete groupedChildren[child.key];
	            }
	        }
	    }
	
	    var remaining = Object.keys(groupedChildren);
	    Hoek.assert(remaining.length === 0, 'unknown key(s)', remaining.join(', '));
	
	    return obj;
	};
	
	internals.Object.prototype._dependency = function (type, key, peers) {
	
	    peers = [].concat(peers);
	    for (var i = 0; i < peers.length; ++i) {
	        Hoek.assert(typeof peers[i] === 'string', type, 'peers must be a string or array of strings');
	    }
	
	    var obj = this.clone();
	    obj._inner.dependencies.push({ type: type, key: key, peers: peers });
	    return obj;
	};
	
	internals['with'] = function (value, peers, parent, state, options) {
	
	    if (value === undefined) {
	        return null;
	    }
	
	    for (var i = 0; i < peers.length; ++i) {
	        var peer = peers[i];
	        if (!Object.prototype.hasOwnProperty.call(parent, peer) || parent[peer] === undefined) {
	
	            return Errors.create('object.with', { peer: peer }, state, options);
	        }
	    }
	
	    return null;
	};
	
	internals.without = function (value, peers, parent, state, options) {
	
	    if (value === undefined) {
	        return null;
	    }
	
	    for (var i = 0; i < peers.length; ++i) {
	        var peer = peers[i];
	        if (Object.prototype.hasOwnProperty.call(parent, peer) && parent[peer] !== undefined) {
	
	            return Errors.create('object.without', { peer: peer }, state, options);
	        }
	    }
	
	    return null;
	};
	
	internals.xor = function (value, peers, parent, state, options) {
	
	    var present = [];
	    for (var i = 0; i < peers.length; ++i) {
	        var peer = peers[i];
	        if (Object.prototype.hasOwnProperty.call(parent, peer) && parent[peer] !== undefined) {
	
	            present.push(peer);
	        }
	    }
	
	    if (present.length === 1) {
	        return null;
	    }
	
	    if (present.length === 0) {
	        return Errors.create('object.missing', { peers: peers }, state, options);
	    }
	
	    return Errors.create('object.xor', { peers: peers }, state, options);
	};
	
	internals.or = function (value, peers, parent, state, options) {
	
	    for (var i = 0; i < peers.length; ++i) {
	        var peer = peers[i];
	        if (Object.prototype.hasOwnProperty.call(parent, peer) && parent[peer] !== undefined) {
	            return null;
	        }
	    }
	
	    return Errors.create('object.missing', { peers: peers }, state, options);
	};
	
	internals.and = function (value, peers, parent, state, options) {
	
	    var missing = [];
	    var present = [];
	    var count = peers.length;
	    for (var i = 0; i < count; ++i) {
	        var peer = peers[i];
	        if (!Object.prototype.hasOwnProperty.call(parent, peer) || parent[peer] === undefined) {
	
	            missing.push(peer);
	        } else {
	            present.push(peer);
	        }
	    }
	
	    var aon = missing.length === count || present.length === count;
	    return !aon ? Errors.create('object.and', { present: present, missing: missing }, state, options) : null;
	};
	
	internals.nand = function (value, peers, parent, state, options) {
	
	    var present = [];
	    for (var i = 0; i < peers.length; ++i) {
	        var peer = peers[i];
	        if (Object.prototype.hasOwnProperty.call(parent, peer) && parent[peer] !== undefined) {
	
	            present.push(peer);
	        }
	    }
	
	    var values = Hoek.clone(peers);
	    var main = values.splice(0, 1)[0];
	    var allPresent = present.length === peers.length;
	    return allPresent ? Errors.create('object.nand', { main: main, peers: values }, state, options) : null;
	};
	
	internals.Object.prototype.describe = function (shallow) {
	
	    var description = Any.prototype.describe.call(this);
	
	    if (this._inner.children && !shallow) {
	
	        description.children = {};
	        for (var i = 0; i < this._inner.children.length; ++i) {
	            var child = this._inner.children[i];
	            description.children[child.key] = child.schema.describe();
	        }
	    }
	
	    if (this._inner.dependencies.length) {
	        description.dependencies = Hoek.clone(this._inner.dependencies);
	    }
	
	    if (this._inner.patterns.length) {
	        description.patterns = [];
	
	        for (var i = 0; i < this._inner.patterns.length; ++i) {
	            var pattern = this._inner.patterns[i];
	            description.patterns.push({ regex: pattern.regex.toString(), rule: pattern.rule.describe() });
	        }
	    }
	
	    return description;
	};
	
	internals.Object.prototype.assert = function (ref, schema, message) {
	
	    ref = Cast.ref(ref);
	    Hoek.assert(ref.isContext || ref.depth > 1, 'Cannot use assertions for root level references - use direct key rules instead');
	    message = message || 'pass the assertion test';
	
	    var cast = undefined;
	    try {
	        cast = Cast.schema(schema);
	    } catch (castErr) {
	        if (castErr.hasOwnProperty('path')) {
	            castErr.message = castErr.message + '(' + castErr.path + ')';
	        }
	
	        throw castErr;
	    }
	
	    var key = ref.path[ref.path.length - 1];
	    var path = ref.path.join('.');
	
	    return this._test('assert', { cast: cast, ref: ref }, function (value, state, options) {
	
	        var result = cast._validate(ref(value), null, options, value);
	        if (!result.errors) {
	            return null;
	        }
	
	        var localState = Hoek.merge({}, state);
	        localState.key = key;
	        localState.path = path;
	        return Errors.create('object.assert', { ref: localState.path, message: message }, localState, options);
	    });
	};
	
	internals.Object.prototype.type = function (constructor, name) {
	
	    Hoek.assert(typeof constructor === 'function', 'type must be a constructor function');
	    name = name || constructor.name;
	
	    return this._test('type', name, function (value, state, options) {
	
	        if (value instanceof constructor) {
	            return null;
	        }
	
	        return Errors.create('object.type', { type: name }, state, options);
	    });
	};
	
	module.exports = new internals.Object();

/***/ },
/* 30 */
/*!*****************************!*\
  !*** ./~/topo/lib/index.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	var Hoek = __webpack_require__(/*! hoek */ 6);
	
	// Declare internals
	
	var internals = {};
	
	exports = module.exports = internals.Topo = function () {
	
	    this._items = [];
	    this.nodes = [];
	};
	
	internals.Topo.prototype.add = function (nodes, options) {
	    var _this = this;
	
	    options = options || {};
	
	    // Validate rules
	
	    var before = [].concat(options.before || []);
	    var after = [].concat(options.after || []);
	    var group = options.group || '?';
	    var sort = options.sort || 0; // Used for merging only
	
	    Hoek.assert(before.indexOf(group) === -1, 'Item cannot come before itself:', group);
	    Hoek.assert(before.indexOf('?') === -1, 'Item cannot come before unassociated items');
	    Hoek.assert(after.indexOf(group) === -1, 'Item cannot come after itself:', group);
	    Hoek.assert(after.indexOf('?') === -1, 'Item cannot come after unassociated items');
	
	    [].concat(nodes).forEach(function (node, i) {
	
	        var item = {
	            seq: _this._items.length,
	            sort: sort,
	            before: before,
	            after: after,
	            group: group,
	            node: node
	        };
	
	        _this._items.push(item);
	    });
	
	    // Insert event
	
	    var error = this._sort();
	    Hoek.assert(!error, 'item', group !== '?' ? 'added into group ' + group : '', 'created a dependencies error');
	
	    return this.nodes;
	};
	
	internals.Topo.prototype.merge = function (others) {
	
	    others = [].concat(others);
	    for (var i = 0; i < others.length; ++i) {
	        var other = others[i];
	        if (other) {
	            for (var j = 0; j < other._items.length; ++j) {
	                var item = Hoek.shallow(other._items[j]);
	                this._items.push(item);
	            }
	        }
	    }
	
	    // Sort items
	
	    this._items.sort(internals.mergeSort);
	    for (var i = 0; i < this._items.length; ++i) {
	        this._items[i].seq = i;
	    }
	
	    var error = this._sort();
	    Hoek.assert(!error, 'merge created a dependencies error');
	
	    return this.nodes;
	};
	
	internals.mergeSort = function (a, b) {
	
	    return a.sort === b.sort ? 0 : a.sort < b.sort ? -1 : 1;
	};
	
	internals.Topo.prototype._sort = function () {
	
	    // Construct graph
	
	    var groups = {};
	    var graph = {};
	    var graphAfters = {};
	
	    for (var i = 0; i < this._items.length; ++i) {
	        var item = this._items[i];
	        var seq = item.seq; // Unique across all items
	        var group = item.group;
	
	        // Determine Groups
	
	        groups[group] = groups[group] || [];
	        groups[group].push(seq);
	
	        // Build intermediary graph using 'before'
	
	        graph[seq] = item.before;
	
	        // Build second intermediary graph with 'after'
	
	        var after = item.after;
	        for (var j = 0; j < after.length; ++j) {
	            graphAfters[after[j]] = (graphAfters[after[j]] || []).concat(seq);
	        }
	    }
	
	    // Expand intermediary graph
	
	    var graphNodes = Object.keys(graph);
	    for (var i = 0; i < graphNodes.length; ++i) {
	        var node = graphNodes[i];
	        var expandedGroups = [];
	
	        var graphNodeItems = Object.keys(graph[node]);
	        for (var j = 0; j < graphNodeItems.length; ++j) {
	            var group = graph[node][graphNodeItems[j]];
	            groups[group] = groups[group] || [];
	
	            for (var k = 0; k < groups[group].length; ++k) {
	
	                expandedGroups.push(groups[group][k]);
	            }
	        }
	        graph[node] = expandedGroups;
	    }
	
	    // Merge intermediary graph using graphAfters into final graph
	
	    var afterNodes = Object.keys(graphAfters);
	    for (var i = 0; i < afterNodes.length; ++i) {
	        var group = afterNodes[i];
	
	        if (groups[group]) {
	            for (var j = 0; j < groups[group].length; ++j) {
	                var node = groups[group][j];
	                graph[node] = graph[node].concat(graphAfters[group]);
	            }
	        }
	    }
	
	    // Compile ancestors
	
	    var children = undefined;
	    var ancestors = {};
	    graphNodes = Object.keys(graph);
	    for (var i = 0; i < graphNodes.length; ++i) {
	        var node = graphNodes[i];
	        children = graph[node];
	
	        for (var j = 0; j < children.length; ++j) {
	            ancestors[children[j]] = (ancestors[children[j]] || []).concat(node);
	        }
	    }
	
	    // Topo sort
	
	    var visited = {};
	    var sorted = [];
	
	    for (var i = 0; i < this._items.length; ++i) {
	        var next = i;
	
	        if (ancestors[i]) {
	            next = null;
	            for (var j = 0; j < this._items.length; ++j) {
	                if (visited[j] === true) {
	                    continue;
	                }
	
	                if (!ancestors[j]) {
	                    ancestors[j] = [];
	                }
	
	                var shouldSeeCount = ancestors[j].length;
	                var seenCount = 0;
	                for (var k = 0; k < shouldSeeCount; ++k) {
	                    if (sorted.indexOf(ancestors[j][k]) >= 0) {
	                        ++seenCount;
	                    }
	                }
	
	                if (seenCount === shouldSeeCount) {
	                    next = j;
	                    break;
	                }
	            }
	        }
	
	        if (next !== null) {
	            next = next.toString(); // Normalize to string TODO: replace with seq
	            visited[next] = true;
	            sorted.push(next);
	        }
	    }
	
	    if (sorted.length !== this._items.length) {
	        return new Error('Invalid dependencies');
	    }
	
	    var seqIndex = {};
	    for (var i = 0; i < this._items.length; ++i) {
	        var item = this._items[i];
	        seqIndex[item.seq] = item;
	    }
	
	    var sortedNodes = [];
	    this._items = sorted.map(function (value) {
	
	        var sortedItem = seqIndex[value];
	        sortedNodes.push(sortedItem.node);
	        return sortedItem;
	    });
	
	    this.nodes = sortedNodes;
	};

/***/ },
/* 31 */
/*!**********************!*\
  !*** ./lib/array.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	var Any = __webpack_require__(/*! ./any */ 1);
	var Cast = __webpack_require__(/*! ./cast */ 15);
	var Errors = __webpack_require__(/*! ./errors */ 13);
	var Hoek = __webpack_require__(/*! hoek */ 6);
	
	// Declare internals
	
	var internals = {};
	
	internals.fastSplice = function (arr, i) {
	
	    var pos = i;
	    while (pos < arr.length) {
	        arr[pos++] = arr[pos];
	    }
	
	    --arr.length;
	};
	
	internals.Array = function () {
	
	    Any.call(this);
	    this._type = 'array';
	    this._inner.items = [];
	    this._inner.ordereds = [];
	    this._inner.inclusions = [];
	    this._inner.exclusions = [];
	    this._inner.requireds = [];
	    this._flags.sparse = false;
	};
	
	Hoek.inherits(internals.Array, Any);
	
	internals.Array.prototype._base = function (value, state, options) {
	
	    var result = {
	        value: value
	    };
	
	    if (typeof value === 'string' && options.convert) {
	
	        try {
	            var converted = JSON.parse(value);
	            if (Array.isArray(converted)) {
	                result.value = converted;
	            }
	        } catch (e) {}
	    }
	
	    var isArray = Array.isArray(result.value);
	    var wasArray = isArray;
	    if (options.convert && this._flags.single && !isArray) {
	        result.value = [result.value];
	        isArray = true;
	    }
	
	    if (!isArray) {
	        result.errors = Errors.create('array.base', null, state, options);
	        return result;
	    }
	
	    if (this._inner.inclusions.length || this._inner.exclusions.length || !this._flags.sparse) {
	
	        // Clone the array so that we don't modify the original
	        if (wasArray) {
	            result.value = result.value.slice(0);
	        }
	
	        result.errors = internals.checkItems.call(this, result.value, wasArray, state, options);
	
	        if (result.errors && wasArray && options.convert && this._flags.single) {
	
	            // Attempt a 2nd pass by putting the array inside one.
	            var previousErrors = result.errors;
	
	            result.value = [result.value];
	            result.errors = internals.checkItems.call(this, result.value, wasArray, state, options);
	
	            if (result.errors) {
	
	                // Restore previous errors and value since this didn't validate either.
	                result.errors = previousErrors;
	                result.value = result.value[0];
	            }
	        }
	    }
	
	    return result;
	};
	
	internals.checkItems = function (items, wasArray, state, options) {
	
	    var errors = [];
	    var errored = undefined;
	
	    var requireds = this._inner.requireds.slice();
	    var ordereds = this._inner.ordereds.slice();
	    var inclusions = this._inner.inclusions.concat(requireds);
	
	    var il = items.length;
	    for (var i = 0; i < il; ++i) {
	        errored = false;
	        var item = items[i];
	        var isValid = false;
	        var localState = { key: i, path: (state.path ? state.path + '.' : '') + i, parent: items, reference: state.reference };
	        var res = undefined;
	
	        // Sparse
	
	        if (!this._flags.sparse && item === undefined) {
	            errors.push(Errors.create('array.sparse', null, { key: state.key, path: localState.path }, options));
	
	            if (options.abortEarly) {
	                return errors;
	            }
	
	            continue;
	        }
	
	        // Exclusions
	
	        for (var j = 0; j < this._inner.exclusions.length; ++j) {
	            res = this._inner.exclusions[j]._validate(item, localState, {}); // Not passing options to use defaults
	
	            if (!res.errors) {
	                errors.push(Errors.create(wasArray ? 'array.excludes' : 'array.excludesSingle', { pos: i, value: item }, { key: state.key, path: localState.path }, options));
	                errored = true;
	
	                if (options.abortEarly) {
	                    return errors;
	                }
	
	                break;
	            }
	        }
	
	        if (errored) {
	            continue;
	        }
	
	        // Ordered
	        if (this._inner.ordereds.length) {
	            if (ordereds.length > 0) {
	                var ordered = ordereds.shift();
	                res = ordered._validate(item, localState, options);
	                if (!res.errors) {
	                    if (ordered._flags.strip) {
	                        internals.fastSplice(items, i);
	                        --i;
	                        --il;
	                    } else {
	                        items[i] = res.value;
	                    }
	                } else {
	                    errors.push(Errors.create('array.ordered', { pos: i, reason: res.errors, value: item }, { key: state.key, path: localState.path }, options));
	                    if (options.abortEarly) {
	                        return errors;
	                    }
	                }
	                continue;
	            } else if (!this._inner.items.length) {
	                errors.push(Errors.create('array.orderedLength', { pos: i, limit: this._inner.ordereds.length }, { key: state.key, path: localState.path }, options));
	                if (options.abortEarly) {
	                    return errors;
	                }
	                continue;
	            }
	        }
	
	        // Requireds
	
	        var requiredChecks = [];
	        var jl = requireds.length;
	        for (var j = 0; j < jl; ++j) {
	            res = requiredChecks[j] = requireds[j]._validate(item, localState, options);
	            if (!res.errors) {
	                items[i] = res.value;
	                isValid = true;
	                internals.fastSplice(requireds, j);
	                --j;
	                --jl;
	                break;
	            }
	        }
	
	        if (isValid) {
	            continue;
	        }
	
	        // Inclusions
	
	        jl = inclusions.length;
	        for (var j = 0; j < jl; ++j) {
	            var inclusion = inclusions[j];
	
	            // Avoid re-running requireds that already didn't match in the previous loop
	            var previousCheck = requireds.indexOf(inclusion);
	            if (previousCheck !== -1) {
	                res = requiredChecks[previousCheck];
	            } else {
	                res = inclusion._validate(item, localState, options);
	
	                if (!res.errors) {
	                    if (inclusion._flags.strip) {
	                        internals.fastSplice(items, i);
	                        --i;
	                        --il;
	                    } else {
	                        items[i] = res.value;
	                    }
	                    isValid = true;
	                    break;
	                }
	            }
	
	            // Return the actual error if only one inclusion defined
	            if (jl === 1) {
	                if (options.stripUnknown) {
	                    internals.fastSplice(items, i);
	                    --i;
	                    --il;
	                    isValid = true;
	                    break;
	                }
	
	                errors.push(Errors.create(wasArray ? 'array.includesOne' : 'array.includesOneSingle', { pos: i, reason: res.errors, value: item }, { key: state.key, path: localState.path }, options));
	                errored = true;
	
	                if (options.abortEarly) {
	                    return errors;
	                }
	
	                break;
	            }
	        }
	
	        if (errored) {
	            continue;
	        }
	
	        if (this._inner.inclusions.length && !isValid) {
	            if (options.stripUnknown) {
	                internals.fastSplice(items, i);
	                --i;
	                --il;
	                continue;
	            }
	
	            errors.push(Errors.create(wasArray ? 'array.includes' : 'array.includesSingle', { pos: i, value: item }, { key: state.key, path: localState.path }, options));
	
	            if (options.abortEarly) {
	                return errors;
	            }
	        }
	    }
	
	    if (requireds.length) {
	        internals.fillMissedErrors(errors, requireds, state, options);
	    }
	
	    if (ordereds.length) {
	        internals.fillOrderedErrors(errors, ordereds, state, options);
	    }
	
	    return errors.length ? errors : null;
	};
	
	internals.fillMissedErrors = function (errors, requireds, state, options) {
	
	    var knownMisses = [];
	    var unknownMisses = 0;
	    for (var i = 0; i < requireds.length; ++i) {
	        var label = Hoek.reach(requireds[i], '_settings.language.label');
	        if (label) {
	            knownMisses.push(label);
	        } else {
	            ++unknownMisses;
	        }
	    }
	
	    if (knownMisses.length) {
	        if (unknownMisses) {
	            errors.push(Errors.create('array.includesRequiredBoth', { knownMisses: knownMisses, unknownMisses: unknownMisses }, { key: state.key, path: state.patk }, options));
	        } else {
	            errors.push(Errors.create('array.includesRequiredKnowns', { knownMisses: knownMisses }, { key: state.key, path: state.path }, options));
	        }
	    } else {
	        errors.push(Errors.create('array.includesRequiredUnknowns', { unknownMisses: unknownMisses }, { key: state.key, path: state.path }, options));
	    }
	};
	
	internals.fillOrderedErrors = function (errors, ordereds, state, options) {
	
	    var requiredOrdereds = [];
	
	    for (var i = 0; i < ordereds.length; ++i) {
	        var presence = Hoek.reach(ordereds[i], '_flags.presence');
	        if (presence === 'required') {
	            requiredOrdereds.push(ordereds[i]);
	        }
	    }
	
	    if (requiredOrdereds.length) {
	        internals.fillMissedErrors(errors, requiredOrdereds, state, options);
	    }
	};
	
	internals.Array.prototype.describe = function () {
	
	    var description = Any.prototype.describe.call(this);
	
	    if (this._inner.ordereds.length) {
	        description.orderedItems = [];
	
	        for (var i = 0; i < this._inner.ordereds.length; ++i) {
	            description.orderedItems.push(this._inner.ordereds[i].describe());
	        }
	    }
	
	    if (this._inner.items.length) {
	        description.items = [];
	
	        for (var i = 0; i < this._inner.items.length; ++i) {
	            description.items.push(this._inner.items[i].describe());
	        }
	    }
	
	    return description;
	};
	
	internals.Array.prototype.items = function () {
	
	    var obj = this.clone();
	
	    Hoek.flatten(Array.prototype.slice.call(arguments)).forEach(function (type, index) {
	
	        try {
	            type = Cast.schema(type);
	        } catch (castErr) {
	            if (castErr.hasOwnProperty('path')) {
	                castErr.path = index + '.' + castErr.path;
	            } else {
	                castErr.path = index;
	            }
	            castErr.message = castErr.message + '(' + castErr.path + ')';
	            throw castErr;
	        }
	
	        obj._inner.items.push(type);
	
	        if (type._flags.presence === 'required') {
	            obj._inner.requireds.push(type);
	        } else if (type._flags.presence === 'forbidden') {
	            obj._inner.exclusions.push(type.optional());
	        } else {
	            obj._inner.inclusions.push(type);
	        }
	    });
	
	    return obj;
	};
	
	internals.Array.prototype.ordered = function () {
	
	    var obj = this.clone();
	
	    Hoek.flatten(Array.prototype.slice.call(arguments)).forEach(function (type, index) {
	
	        try {
	            type = Cast.schema(type);
	        } catch (castErr) {
	            if (castErr.hasOwnProperty('path')) {
	                castErr.path = index + '.' + castErr.path;
	            } else {
	                castErr.path = index;
	            }
	            castErr.message = castErr.message + '(' + castErr.path + ')';
	            throw castErr;
	        }
	        obj._inner.ordereds.push(type);
	    });
	
	    return obj;
	};
	
	internals.Array.prototype.min = function (limit) {
	
	    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');
	
	    return this._test('min', limit, function (value, state, options) {
	
	        if (value.length >= limit) {
	            return null;
	        }
	
	        return Errors.create('array.min', { limit: limit, value: value }, state, options);
	    });
	};
	
	internals.Array.prototype.max = function (limit) {
	
	    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');
	
	    return this._test('max', limit, function (value, state, options) {
	
	        if (value.length <= limit) {
	            return null;
	        }
	
	        return Errors.create('array.max', { limit: limit, value: value }, state, options);
	    });
	};
	
	internals.Array.prototype.length = function (limit) {
	
	    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');
	
	    return this._test('length', limit, function (value, state, options) {
	
	        if (value.length === limit) {
	            return null;
	        }
	
	        return Errors.create('array.length', { limit: limit, value: value }, state, options);
	    });
	};
	
	internals.Array.prototype.unique = function () {
	
	    return this._test('unique', undefined, function (value, state, options) {
	
	        var found = {
	            string: {},
	            number: {},
	            undefined: {},
	            boolean: {},
	            object: [],
	            'function': []
	        };
	
	        for (var i = 0; i < value.length; ++i) {
	            var item = value[i];
	            var type = typeof item;
	            var records = found[type];
	
	            // All available types are supported, so it's not possible to reach 100% coverage without ignoring this line.
	            // I still want to keep the test for future js versions with new types (eg. Symbol).
	            if ( /* $lab:coverage:off$ */records /* $lab:coverage:on$ */) {
	                    if (Array.isArray(records)) {
	                        for (var j = 0; j < records.length; ++j) {
	                            if (Hoek.deepEqual(records[j], item)) {
	                                return Errors.create('array.unique', { pos: i, value: item }, state, options);
	                            }
	                        }
	
	                        records.push(item);
	                    } else {
	                        if (records[item]) {
	                            return Errors.create('array.unique', { pos: i, value: item }, state, options);
	                        }
	
	                        records[item] = true;
	                    }
	                }
	        }
	    });
	};
	
	internals.Array.prototype.sparse = function (enabled) {
	
	    var obj = this.clone();
	    obj._flags.sparse = enabled === undefined ? true : !!enabled;
	    return obj;
	};
	
	internals.Array.prototype.single = function (enabled) {
	
	    var obj = this.clone();
	    obj._flags.single = enabled === undefined ? true : !!enabled;
	    return obj;
	};
	
	module.exports = new internals.Array();

/***/ },
/* 32 */
/*!***********************!*\
  !*** ./lib/binary.js ***!
  \***********************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';
	
	// Load modules
	
	var Any = __webpack_require__(/*! ./any */ 1);
	var Errors = __webpack_require__(/*! ./errors */ 13);
	var Hoek = __webpack_require__(/*! hoek */ 6);
	
	// Declare internals
	
	var internals = {};
	
	internals.Binary = function () {
	
	    Any.call(this);
	    this._type = 'binary';
	};
	
	Hoek.inherits(internals.Binary, Any);
	
	internals.Binary.prototype._base = function (value, state, options) {
	
	    var result = {
	        value: value
	    };
	
	    if (typeof value === 'string' && options.convert) {
	
	        try {
	            var converted = new Buffer(value, this._flags.encoding);
	            result.value = converted;
	        } catch (e) {}
	    }
	
	    result.errors = Buffer.isBuffer(result.value) ? null : Errors.create('binary.base', null, state, options);
	    return result;
	};
	
	internals.Binary.prototype.encoding = function (encoding) {
	
	    Hoek.assert(Buffer.isEncoding(encoding), 'Invalid encoding:', encoding);
	
	    var obj = this.clone();
	    obj._flags.encoding = encoding;
	    return obj;
	};
	
	internals.Binary.prototype.min = function (limit) {
	
	    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');
	
	    return this._test('min', limit, function (value, state, options) {
	
	        if (value.length >= limit) {
	            return null;
	        }
	
	        return Errors.create('binary.min', { limit: limit, value: value }, state, options);
	    });
	};
	
	internals.Binary.prototype.max = function (limit) {
	
	    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');
	
	    return this._test('max', limit, function (value, state, options) {
	
	        if (value.length <= limit) {
	            return null;
	        }
	
	        return Errors.create('binary.max', { limit: limit, value: value }, state, options);
	    });
	};
	
	internals.Binary.prototype.length = function (limit) {
	
	    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');
	
	    return this._test('length', limit, function (value, state, options) {
	
	        if (value.length === limit) {
	            return null;
	        }
	
	        return Errors.create('binary.length', { limit: limit, value: value }, state, options);
	    });
	};
	
	module.exports = new internals.Binary();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./~/buffer/index.js */ 2).Buffer))

/***/ }
/******/ ])
});
;
//# sourceMappingURL=joi-browser.js.map