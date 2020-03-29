(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var vue = createCommonjsModule(function (module, exports) {
	/*!
	 * Vue.js v2.6.11
	 * (c) 2014-2019 Evan You
	 * Released under the MIT License.
	 */
	(function (global, factory) {
	   module.exports = factory() ;
	}(commonjsGlobal, function () {
	  /*  */

	  var emptyObject = Object.freeze({});

	  // These helpers produce better VM code in JS engines due to their
	  // explicitness and function inlining.
	  function isUndef (v) {
	    return v === undefined || v === null
	  }

	  function isDef (v) {
	    return v !== undefined && v !== null
	  }

	  function isTrue (v) {
	    return v === true
	  }

	  function isFalse (v) {
	    return v === false
	  }

	  /**
	   * Check if value is primitive.
	   */
	  function isPrimitive (value) {
	    return (
	      typeof value === 'string' ||
	      typeof value === 'number' ||
	      // $flow-disable-line
	      typeof value === 'symbol' ||
	      typeof value === 'boolean'
	    )
	  }

	  /**
	   * Quick object check - this is primarily used to tell
	   * Objects from primitive values when we know the value
	   * is a JSON-compliant type.
	   */
	  function isObject (obj) {
	    return obj !== null && typeof obj === 'object'
	  }

	  /**
	   * Get the raw type string of a value, e.g., [object Object].
	   */
	  var _toString = Object.prototype.toString;

	  function toRawType (value) {
	    return _toString.call(value).slice(8, -1)
	  }

	  /**
	   * Strict object type check. Only returns true
	   * for plain JavaScript objects.
	   */
	  function isPlainObject (obj) {
	    return _toString.call(obj) === '[object Object]'
	  }

	  function isRegExp (v) {
	    return _toString.call(v) === '[object RegExp]'
	  }

	  /**
	   * Check if val is a valid array index.
	   */
	  function isValidArrayIndex (val) {
	    var n = parseFloat(String(val));
	    return n >= 0 && Math.floor(n) === n && isFinite(val)
	  }

	  function isPromise (val) {
	    return (
	      isDef(val) &&
	      typeof val.then === 'function' &&
	      typeof val.catch === 'function'
	    )
	  }

	  /**
	   * Convert a value to a string that is actually rendered.
	   */
	  function toString (val) {
	    return val == null
	      ? ''
	      : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
	        ? JSON.stringify(val, null, 2)
	        : String(val)
	  }

	  /**
	   * Convert an input value to a number for persistence.
	   * If the conversion fails, return original string.
	   */
	  function toNumber (val) {
	    var n = parseFloat(val);
	    return isNaN(n) ? val : n
	  }

	  /**
	   * Make a map and return a function for checking if a key
	   * is in that map.
	   */
	  function makeMap (
	    str,
	    expectsLowerCase
	  ) {
	    var map = Object.create(null);
	    var list = str.split(',');
	    for (var i = 0; i < list.length; i++) {
	      map[list[i]] = true;
	    }
	    return expectsLowerCase
	      ? function (val) { return map[val.toLowerCase()]; }
	      : function (val) { return map[val]; }
	  }

	  /**
	   * Check if a tag is a built-in tag.
	   */
	  var isBuiltInTag = makeMap('slot,component', true);

	  /**
	   * Check if an attribute is a reserved attribute.
	   */
	  var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

	  /**
	   * Remove an item from an array.
	   */
	  function remove (arr, item) {
	    if (arr.length) {
	      var index = arr.indexOf(item);
	      if (index > -1) {
	        return arr.splice(index, 1)
	      }
	    }
	  }

	  /**
	   * Check whether an object has the property.
	   */
	  var hasOwnProperty = Object.prototype.hasOwnProperty;
	  function hasOwn (obj, key) {
	    return hasOwnProperty.call(obj, key)
	  }

	  /**
	   * Create a cached version of a pure function.
	   */
	  function cached (fn) {
	    var cache = Object.create(null);
	    return (function cachedFn (str) {
	      var hit = cache[str];
	      return hit || (cache[str] = fn(str))
	    })
	  }

	  /**
	   * Camelize a hyphen-delimited string.
	   */
	  var camelizeRE = /-(\w)/g;
	  var camelize = cached(function (str) {
	    return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
	  });

	  /**
	   * Capitalize a string.
	   */
	  var capitalize = cached(function (str) {
	    return str.charAt(0).toUpperCase() + str.slice(1)
	  });

	  /**
	   * Hyphenate a camelCase string.
	   */
	  var hyphenateRE = /\B([A-Z])/g;
	  var hyphenate = cached(function (str) {
	    return str.replace(hyphenateRE, '-$1').toLowerCase()
	  });

	  /**
	   * Simple bind polyfill for environments that do not support it,
	   * e.g., PhantomJS 1.x. Technically, we don't need this anymore
	   * since native bind is now performant enough in most browsers.
	   * But removing it would mean breaking code that was able to run in
	   * PhantomJS 1.x, so this must be kept for backward compatibility.
	   */

	  /* istanbul ignore next */
	  function polyfillBind (fn, ctx) {
	    function boundFn (a) {
	      var l = arguments.length;
	      return l
	        ? l > 1
	          ? fn.apply(ctx, arguments)
	          : fn.call(ctx, a)
	        : fn.call(ctx)
	    }

	    boundFn._length = fn.length;
	    return boundFn
	  }

	  function nativeBind (fn, ctx) {
	    return fn.bind(ctx)
	  }

	  var bind = Function.prototype.bind
	    ? nativeBind
	    : polyfillBind;

	  /**
	   * Convert an Array-like object to a real Array.
	   */
	  function toArray (list, start) {
	    start = start || 0;
	    var i = list.length - start;
	    var ret = new Array(i);
	    while (i--) {
	      ret[i] = list[i + start];
	    }
	    return ret
	  }

	  /**
	   * Mix properties into target object.
	   */
	  function extend (to, _from) {
	    for (var key in _from) {
	      to[key] = _from[key];
	    }
	    return to
	  }

	  /**
	   * Merge an Array of Objects into a single Object.
	   */
	  function toObject (arr) {
	    var res = {};
	    for (var i = 0; i < arr.length; i++) {
	      if (arr[i]) {
	        extend(res, arr[i]);
	      }
	    }
	    return res
	  }

	  /* eslint-disable no-unused-vars */

	  /**
	   * Perform no operation.
	   * Stubbing args to make Flow happy without leaving useless transpiled code
	   * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
	   */
	  function noop (a, b, c) {}

	  /**
	   * Always return false.
	   */
	  var no = function (a, b, c) { return false; };

	  /* eslint-enable no-unused-vars */

	  /**
	   * Return the same value.
	   */
	  var identity = function (_) { return _; };

	  /**
	   * Generate a string containing static keys from compiler modules.
	   */
	  function genStaticKeys (modules) {
	    return modules.reduce(function (keys, m) {
	      return keys.concat(m.staticKeys || [])
	    }, []).join(',')
	  }

	  /**
	   * Check if two values are loosely equal - that is,
	   * if they are plain objects, do they have the same shape?
	   */
	  function looseEqual (a, b) {
	    if (a === b) { return true }
	    var isObjectA = isObject(a);
	    var isObjectB = isObject(b);
	    if (isObjectA && isObjectB) {
	      try {
	        var isArrayA = Array.isArray(a);
	        var isArrayB = Array.isArray(b);
	        if (isArrayA && isArrayB) {
	          return a.length === b.length && a.every(function (e, i) {
	            return looseEqual(e, b[i])
	          })
	        } else if (a instanceof Date && b instanceof Date) {
	          return a.getTime() === b.getTime()
	        } else if (!isArrayA && !isArrayB) {
	          var keysA = Object.keys(a);
	          var keysB = Object.keys(b);
	          return keysA.length === keysB.length && keysA.every(function (key) {
	            return looseEqual(a[key], b[key])
	          })
	        } else {
	          /* istanbul ignore next */
	          return false
	        }
	      } catch (e) {
	        /* istanbul ignore next */
	        return false
	      }
	    } else if (!isObjectA && !isObjectB) {
	      return String(a) === String(b)
	    } else {
	      return false
	    }
	  }

	  /**
	   * Return the first index at which a loosely equal value can be
	   * found in the array (if value is a plain object, the array must
	   * contain an object of the same shape), or -1 if it is not present.
	   */
	  function looseIndexOf (arr, val) {
	    for (var i = 0; i < arr.length; i++) {
	      if (looseEqual(arr[i], val)) { return i }
	    }
	    return -1
	  }

	  /**
	   * Ensure a function is called only once.
	   */
	  function once (fn) {
	    var called = false;
	    return function () {
	      if (!called) {
	        called = true;
	        fn.apply(this, arguments);
	      }
	    }
	  }

	  var SSR_ATTR = 'data-server-rendered';

	  var ASSET_TYPES = [
	    'component',
	    'directive',
	    'filter'
	  ];

	  var LIFECYCLE_HOOKS = [
	    'beforeCreate',
	    'created',
	    'beforeMount',
	    'mounted',
	    'beforeUpdate',
	    'updated',
	    'beforeDestroy',
	    'destroyed',
	    'activated',
	    'deactivated',
	    'errorCaptured',
	    'serverPrefetch'
	  ];

	  /*  */



	  var config = ({
	    /**
	     * Option merge strategies (used in core/util/options)
	     */
	    // $flow-disable-line
	    optionMergeStrategies: Object.create(null),

	    /**
	     * Whether to suppress warnings.
	     */
	    silent: false,

	    /**
	     * Show production mode tip message on boot?
	     */
	    productionTip: "development" !== 'production',

	    /**
	     * Whether to enable devtools
	     */
	    devtools: "development" !== 'production',

	    /**
	     * Whether to record perf
	     */
	    performance: false,

	    /**
	     * Error handler for watcher errors
	     */
	    errorHandler: null,

	    /**
	     * Warn handler for watcher warns
	     */
	    warnHandler: null,

	    /**
	     * Ignore certain custom elements
	     */
	    ignoredElements: [],

	    /**
	     * Custom user key aliases for v-on
	     */
	    // $flow-disable-line
	    keyCodes: Object.create(null),

	    /**
	     * Check if a tag is reserved so that it cannot be registered as a
	     * component. This is platform-dependent and may be overwritten.
	     */
	    isReservedTag: no,

	    /**
	     * Check if an attribute is reserved so that it cannot be used as a component
	     * prop. This is platform-dependent and may be overwritten.
	     */
	    isReservedAttr: no,

	    /**
	     * Check if a tag is an unknown element.
	     * Platform-dependent.
	     */
	    isUnknownElement: no,

	    /**
	     * Get the namespace of an element
	     */
	    getTagNamespace: noop,

	    /**
	     * Parse the real tag name for the specific platform.
	     */
	    parsePlatformTagName: identity,

	    /**
	     * Check if an attribute must be bound using property, e.g. value
	     * Platform-dependent.
	     */
	    mustUseProp: no,

	    /**
	     * Perform updates asynchronously. Intended to be used by Vue Test Utils
	     * This will significantly reduce performance if set to false.
	     */
	    async: true,

	    /**
	     * Exposed for legacy reasons
	     */
	    _lifecycleHooks: LIFECYCLE_HOOKS
	  });

	  /*  */

	  /**
	   * unicode letters used for parsing html tags, component names and property paths.
	   * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
	   * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
	   */
	  var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

	  /**
	   * Check if a string starts with $ or _
	   */
	  function isReserved (str) {
	    var c = (str + '').charCodeAt(0);
	    return c === 0x24 || c === 0x5F
	  }

	  /**
	   * Define a property.
	   */
	  function def (obj, key, val, enumerable) {
	    Object.defineProperty(obj, key, {
	      value: val,
	      enumerable: !!enumerable,
	      writable: true,
	      configurable: true
	    });
	  }

	  /**
	   * Parse simple path.
	   */
	  var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
	  function parsePath (path) {
	    if (bailRE.test(path)) {
	      return
	    }
	    var segments = path.split('.');
	    return function (obj) {
	      for (var i = 0; i < segments.length; i++) {
	        if (!obj) { return }
	        obj = obj[segments[i]];
	      }
	      return obj
	    }
	  }

	  /*  */

	  // can we use __proto__?
	  var hasProto = '__proto__' in {};

	  // Browser environment sniffing
	  var inBrowser = typeof window !== 'undefined';
	  var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
	  var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
	  var UA = inBrowser && window.navigator.userAgent.toLowerCase();
	  var isIE = UA && /msie|trident/.test(UA);
	  var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
	  var isEdge = UA && UA.indexOf('edge/') > 0;
	  var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
	  var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
	  var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
	  var isPhantomJS = UA && /phantomjs/.test(UA);
	  var isFF = UA && UA.match(/firefox\/(\d+)/);

	  // Firefox has a "watch" function on Object.prototype...
	  var nativeWatch = ({}).watch;

	  var supportsPassive = false;
	  if (inBrowser) {
	    try {
	      var opts = {};
	      Object.defineProperty(opts, 'passive', ({
	        get: function get () {
	          /* istanbul ignore next */
	          supportsPassive = true;
	        }
	      })); // https://github.com/facebook/flow/issues/285
	      window.addEventListener('test-passive', null, opts);
	    } catch (e) {}
	  }

	  // this needs to be lazy-evaled because vue may be required before
	  // vue-server-renderer can set VUE_ENV
	  var _isServer;
	  var isServerRendering = function () {
	    if (_isServer === undefined) {
	      /* istanbul ignore if */
	      if (!inBrowser && !inWeex && typeof commonjsGlobal !== 'undefined') {
	        // detect presence of vue-server-renderer and avoid
	        // Webpack shimming the process
	        _isServer = commonjsGlobal['process'] && commonjsGlobal['process'].env.VUE_ENV === 'server';
	      } else {
	        _isServer = false;
	      }
	    }
	    return _isServer
	  };

	  // detect devtools
	  var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

	  /* istanbul ignore next */
	  function isNative (Ctor) {
	    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
	  }

	  var hasSymbol =
	    typeof Symbol !== 'undefined' && isNative(Symbol) &&
	    typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

	  var _Set;
	  /* istanbul ignore if */ // $flow-disable-line
	  if (typeof Set !== 'undefined' && isNative(Set)) {
	    // use native Set when available.
	    _Set = Set;
	  } else {
	    // a non-standard Set polyfill that only works with primitive keys.
	    _Set = /*@__PURE__*/(function () {
	      function Set () {
	        this.set = Object.create(null);
	      }
	      Set.prototype.has = function has (key) {
	        return this.set[key] === true
	      };
	      Set.prototype.add = function add (key) {
	        this.set[key] = true;
	      };
	      Set.prototype.clear = function clear () {
	        this.set = Object.create(null);
	      };

	      return Set;
	    }());
	  }

	  /*  */

	  var warn = noop;
	  var tip = noop;
	  var generateComponentTrace = (noop); // work around flow check
	  var formatComponentName = (noop);

	  {
	    var hasConsole = typeof console !== 'undefined';
	    var classifyRE = /(?:^|[-_])(\w)/g;
	    var classify = function (str) { return str
	      .replace(classifyRE, function (c) { return c.toUpperCase(); })
	      .replace(/[-_]/g, ''); };

	    warn = function (msg, vm) {
	      var trace = vm ? generateComponentTrace(vm) : '';

	      if (config.warnHandler) {
	        config.warnHandler.call(null, msg, vm, trace);
	      } else if (hasConsole && (!config.silent)) {
	        console.error(("[Vue warn]: " + msg + trace));
	      }
	    };

	    tip = function (msg, vm) {
	      if (hasConsole && (!config.silent)) {
	        console.warn("[Vue tip]: " + msg + (
	          vm ? generateComponentTrace(vm) : ''
	        ));
	      }
	    };

	    formatComponentName = function (vm, includeFile) {
	      if (vm.$root === vm) {
	        return '<Root>'
	      }
	      var options = typeof vm === 'function' && vm.cid != null
	        ? vm.options
	        : vm._isVue
	          ? vm.$options || vm.constructor.options
	          : vm;
	      var name = options.name || options._componentTag;
	      var file = options.__file;
	      if (!name && file) {
	        var match = file.match(/([^/\\]+)\.vue$/);
	        name = match && match[1];
	      }

	      return (
	        (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
	        (file && includeFile !== false ? (" at " + file) : '')
	      )
	    };

	    var repeat = function (str, n) {
	      var res = '';
	      while (n) {
	        if (n % 2 === 1) { res += str; }
	        if (n > 1) { str += str; }
	        n >>= 1;
	      }
	      return res
	    };

	    generateComponentTrace = function (vm) {
	      if (vm._isVue && vm.$parent) {
	        var tree = [];
	        var currentRecursiveSequence = 0;
	        while (vm) {
	          if (tree.length > 0) {
	            var last = tree[tree.length - 1];
	            if (last.constructor === vm.constructor) {
	              currentRecursiveSequence++;
	              vm = vm.$parent;
	              continue
	            } else if (currentRecursiveSequence > 0) {
	              tree[tree.length - 1] = [last, currentRecursiveSequence];
	              currentRecursiveSequence = 0;
	            }
	          }
	          tree.push(vm);
	          vm = vm.$parent;
	        }
	        return '\n\nfound in\n\n' + tree
	          .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
	              ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
	              : formatComponentName(vm))); })
	          .join('\n')
	      } else {
	        return ("\n\n(found in " + (formatComponentName(vm)) + ")")
	      }
	    };
	  }

	  /*  */

	  var uid = 0;

	  /**
	   * A dep is an observable that can have multiple
	   * directives subscribing to it.
	   */
	  var Dep = function Dep () {
	    this.id = uid++;
	    this.subs = [];
	  };

	  Dep.prototype.addSub = function addSub (sub) {
	    this.subs.push(sub);
	  };

	  Dep.prototype.removeSub = function removeSub (sub) {
	    remove(this.subs, sub);
	  };

	  Dep.prototype.depend = function depend () {
	    if (Dep.target) {
	      Dep.target.addDep(this);
	    }
	  };

	  Dep.prototype.notify = function notify () {
	    // stabilize the subscriber list first
	    var subs = this.subs.slice();
	    if (!config.async) {
	      // subs aren't sorted in scheduler if not running async
	      // we need to sort them now to make sure they fire in correct
	      // order
	      subs.sort(function (a, b) { return a.id - b.id; });
	    }
	    for (var i = 0, l = subs.length; i < l; i++) {
	      subs[i].update();
	    }
	  };

	  // The current target watcher being evaluated.
	  // This is globally unique because only one watcher
	  // can be evaluated at a time.
	  Dep.target = null;
	  var targetStack = [];

	  function pushTarget (target) {
	    targetStack.push(target);
	    Dep.target = target;
	  }

	  function popTarget () {
	    targetStack.pop();
	    Dep.target = targetStack[targetStack.length - 1];
	  }

	  /*  */

	  var VNode = function VNode (
	    tag,
	    data,
	    children,
	    text,
	    elm,
	    context,
	    componentOptions,
	    asyncFactory
	  ) {
	    this.tag = tag;
	    this.data = data;
	    this.children = children;
	    this.text = text;
	    this.elm = elm;
	    this.ns = undefined;
	    this.context = context;
	    this.fnContext = undefined;
	    this.fnOptions = undefined;
	    this.fnScopeId = undefined;
	    this.key = data && data.key;
	    this.componentOptions = componentOptions;
	    this.componentInstance = undefined;
	    this.parent = undefined;
	    this.raw = false;
	    this.isStatic = false;
	    this.isRootInsert = true;
	    this.isComment = false;
	    this.isCloned = false;
	    this.isOnce = false;
	    this.asyncFactory = asyncFactory;
	    this.asyncMeta = undefined;
	    this.isAsyncPlaceholder = false;
	  };

	  var prototypeAccessors = { child: { configurable: true } };

	  // DEPRECATED: alias for componentInstance for backwards compat.
	  /* istanbul ignore next */
	  prototypeAccessors.child.get = function () {
	    return this.componentInstance
	  };

	  Object.defineProperties( VNode.prototype, prototypeAccessors );

	  var createEmptyVNode = function (text) {
	    if ( text === void 0 ) text = '';

	    var node = new VNode();
	    node.text = text;
	    node.isComment = true;
	    return node
	  };

	  function createTextVNode (val) {
	    return new VNode(undefined, undefined, undefined, String(val))
	  }

	  // optimized shallow clone
	  // used for static nodes and slot nodes because they may be reused across
	  // multiple renders, cloning them avoids errors when DOM manipulations rely
	  // on their elm reference.
	  function cloneVNode (vnode) {
	    var cloned = new VNode(
	      vnode.tag,
	      vnode.data,
	      // #7975
	      // clone children array to avoid mutating original in case of cloning
	      // a child.
	      vnode.children && vnode.children.slice(),
	      vnode.text,
	      vnode.elm,
	      vnode.context,
	      vnode.componentOptions,
	      vnode.asyncFactory
	    );
	    cloned.ns = vnode.ns;
	    cloned.isStatic = vnode.isStatic;
	    cloned.key = vnode.key;
	    cloned.isComment = vnode.isComment;
	    cloned.fnContext = vnode.fnContext;
	    cloned.fnOptions = vnode.fnOptions;
	    cloned.fnScopeId = vnode.fnScopeId;
	    cloned.asyncMeta = vnode.asyncMeta;
	    cloned.isCloned = true;
	    return cloned
	  }

	  /*
	   * not type checking this file because flow doesn't play well with
	   * dynamically accessing methods on Array prototype
	   */

	  var arrayProto = Array.prototype;
	  var arrayMethods = Object.create(arrayProto);

	  var methodsToPatch = [
	    'push',
	    'pop',
	    'shift',
	    'unshift',
	    'splice',
	    'sort',
	    'reverse'
	  ];

	  /**
	   * Intercept mutating methods and emit events
	   */
	  methodsToPatch.forEach(function (method) {
	    // cache original method
	    var original = arrayProto[method];
	    def(arrayMethods, method, function mutator () {
	      var args = [], len = arguments.length;
	      while ( len-- ) args[ len ] = arguments[ len ];

	      var result = original.apply(this, args);
	      var ob = this.__ob__;
	      var inserted;
	      switch (method) {
	        case 'push':
	        case 'unshift':
	          inserted = args;
	          break
	        case 'splice':
	          inserted = args.slice(2);
	          break
	      }
	      if (inserted) { ob.observeArray(inserted); }
	      // notify change
	      ob.dep.notify();
	      return result
	    });
	  });

	  /*  */

	  var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

	  /**
	   * In some cases we may want to disable observation inside a component's
	   * update computation.
	   */
	  var shouldObserve = true;

	  function toggleObserving (value) {
	    shouldObserve = value;
	  }

	  /**
	   * Observer class that is attached to each observed
	   * object. Once attached, the observer converts the target
	   * object's property keys into getter/setters that
	   * collect dependencies and dispatch updates.
	   */
	  var Observer = function Observer (value) {
	    this.value = value;
	    this.dep = new Dep();
	    this.vmCount = 0;
	    def(value, '__ob__', this);
	    if (Array.isArray(value)) {
	      if (hasProto) {
	        protoAugment(value, arrayMethods);
	      } else {
	        copyAugment(value, arrayMethods, arrayKeys);
	      }
	      this.observeArray(value);
	    } else {
	      this.walk(value);
	    }
	  };

	  /**
	   * Walk through all properties and convert them into
	   * getter/setters. This method should only be called when
	   * value type is Object.
	   */
	  Observer.prototype.walk = function walk (obj) {
	    var keys = Object.keys(obj);
	    for (var i = 0; i < keys.length; i++) {
	      defineReactive$$1(obj, keys[i]);
	    }
	  };

	  /**
	   * Observe a list of Array items.
	   */
	  Observer.prototype.observeArray = function observeArray (items) {
	    for (var i = 0, l = items.length; i < l; i++) {
	      observe(items[i]);
	    }
	  };

	  // helpers

	  /**
	   * Augment a target Object or Array by intercepting
	   * the prototype chain using __proto__
	   */
	  function protoAugment (target, src) {
	    /* eslint-disable no-proto */
	    target.__proto__ = src;
	    /* eslint-enable no-proto */
	  }

	  /**
	   * Augment a target Object or Array by defining
	   * hidden properties.
	   */
	  /* istanbul ignore next */
	  function copyAugment (target, src, keys) {
	    for (var i = 0, l = keys.length; i < l; i++) {
	      var key = keys[i];
	      def(target, key, src[key]);
	    }
	  }

	  /**
	   * Attempt to create an observer instance for a value,
	   * returns the new observer if successfully observed,
	   * or the existing observer if the value already has one.
	   */
	  function observe (value, asRootData) {
	    if (!isObject(value) || value instanceof VNode) {
	      return
	    }
	    var ob;
	    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
	      ob = value.__ob__;
	    } else if (
	      shouldObserve &&
	      !isServerRendering() &&
	      (Array.isArray(value) || isPlainObject(value)) &&
	      Object.isExtensible(value) &&
	      !value._isVue
	    ) {
	      ob = new Observer(value);
	    }
	    if (asRootData && ob) {
	      ob.vmCount++;
	    }
	    return ob
	  }

	  /**
	   * Define a reactive property on an Object.
	   */
	  function defineReactive$$1 (
	    obj,
	    key,
	    val,
	    customSetter,
	    shallow
	  ) {
	    var dep = new Dep();

	    var property = Object.getOwnPropertyDescriptor(obj, key);
	    if (property && property.configurable === false) {
	      return
	    }

	    // cater for pre-defined getter/setters
	    var getter = property && property.get;
	    var setter = property && property.set;
	    if ((!getter || setter) && arguments.length === 2) {
	      val = obj[key];
	    }

	    var childOb = !shallow && observe(val);
	    Object.defineProperty(obj, key, {
	      enumerable: true,
	      configurable: true,
	      get: function reactiveGetter () {
	        var value = getter ? getter.call(obj) : val;
	        if (Dep.target) {
	          dep.depend();
	          if (childOb) {
	            childOb.dep.depend();
	            if (Array.isArray(value)) {
	              dependArray(value);
	            }
	          }
	        }
	        return value
	      },
	      set: function reactiveSetter (newVal) {
	        var value = getter ? getter.call(obj) : val;
	        /* eslint-disable no-self-compare */
	        if (newVal === value || (newVal !== newVal && value !== value)) {
	          return
	        }
	        /* eslint-enable no-self-compare */
	        if (customSetter) {
	          customSetter();
	        }
	        // #7981: for accessor properties without setter
	        if (getter && !setter) { return }
	        if (setter) {
	          setter.call(obj, newVal);
	        } else {
	          val = newVal;
	        }
	        childOb = !shallow && observe(newVal);
	        dep.notify();
	      }
	    });
	  }

	  /**
	   * Set a property on an object. Adds the new property and
	   * triggers change notification if the property doesn't
	   * already exist.
	   */
	  function set (target, key, val) {
	    if (isUndef(target) || isPrimitive(target)
	    ) {
	      warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
	    }
	    if (Array.isArray(target) && isValidArrayIndex(key)) {
	      target.length = Math.max(target.length, key);
	      target.splice(key, 1, val);
	      return val
	    }
	    if (key in target && !(key in Object.prototype)) {
	      target[key] = val;
	      return val
	    }
	    var ob = (target).__ob__;
	    if (target._isVue || (ob && ob.vmCount)) {
	      warn(
	        'Avoid adding reactive properties to a Vue instance or its root $data ' +
	        'at runtime - declare it upfront in the data option.'
	      );
	      return val
	    }
	    if (!ob) {
	      target[key] = val;
	      return val
	    }
	    defineReactive$$1(ob.value, key, val);
	    ob.dep.notify();
	    return val
	  }

	  /**
	   * Delete a property and trigger change if necessary.
	   */
	  function del (target, key) {
	    if (isUndef(target) || isPrimitive(target)
	    ) {
	      warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
	    }
	    if (Array.isArray(target) && isValidArrayIndex(key)) {
	      target.splice(key, 1);
	      return
	    }
	    var ob = (target).__ob__;
	    if (target._isVue || (ob && ob.vmCount)) {
	      warn(
	        'Avoid deleting properties on a Vue instance or its root $data ' +
	        '- just set it to null.'
	      );
	      return
	    }
	    if (!hasOwn(target, key)) {
	      return
	    }
	    delete target[key];
	    if (!ob) {
	      return
	    }
	    ob.dep.notify();
	  }

	  /**
	   * Collect dependencies on array elements when the array is touched, since
	   * we cannot intercept array element access like property getters.
	   */
	  function dependArray (value) {
	    for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
	      e = value[i];
	      e && e.__ob__ && e.__ob__.dep.depend();
	      if (Array.isArray(e)) {
	        dependArray(e);
	      }
	    }
	  }

	  /*  */

	  /**
	   * Option overwriting strategies are functions that handle
	   * how to merge a parent option value and a child option
	   * value into the final value.
	   */
	  var strats = config.optionMergeStrategies;

	  /**
	   * Options with restrictions
	   */
	  {
	    strats.el = strats.propsData = function (parent, child, vm, key) {
	      if (!vm) {
	        warn(
	          "option \"" + key + "\" can only be used during instance " +
	          'creation with the `new` keyword.'
	        );
	      }
	      return defaultStrat(parent, child)
	    };
	  }

	  /**
	   * Helper that recursively merges two data objects together.
	   */
	  function mergeData (to, from) {
	    if (!from) { return to }
	    var key, toVal, fromVal;

	    var keys = hasSymbol
	      ? Reflect.ownKeys(from)
	      : Object.keys(from);

	    for (var i = 0; i < keys.length; i++) {
	      key = keys[i];
	      // in case the object is already observed...
	      if (key === '__ob__') { continue }
	      toVal = to[key];
	      fromVal = from[key];
	      if (!hasOwn(to, key)) {
	        set(to, key, fromVal);
	      } else if (
	        toVal !== fromVal &&
	        isPlainObject(toVal) &&
	        isPlainObject(fromVal)
	      ) {
	        mergeData(toVal, fromVal);
	      }
	    }
	    return to
	  }

	  /**
	   * Data
	   */
	  function mergeDataOrFn (
	    parentVal,
	    childVal,
	    vm
	  ) {
	    if (!vm) {
	      // in a Vue.extend merge, both should be functions
	      if (!childVal) {
	        return parentVal
	      }
	      if (!parentVal) {
	        return childVal
	      }
	      // when parentVal & childVal are both present,
	      // we need to return a function that returns the
	      // merged result of both functions... no need to
	      // check if parentVal is a function here because
	      // it has to be a function to pass previous merges.
	      return function mergedDataFn () {
	        return mergeData(
	          typeof childVal === 'function' ? childVal.call(this, this) : childVal,
	          typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
	        )
	      }
	    } else {
	      return function mergedInstanceDataFn () {
	        // instance merge
	        var instanceData = typeof childVal === 'function'
	          ? childVal.call(vm, vm)
	          : childVal;
	        var defaultData = typeof parentVal === 'function'
	          ? parentVal.call(vm, vm)
	          : parentVal;
	        if (instanceData) {
	          return mergeData(instanceData, defaultData)
	        } else {
	          return defaultData
	        }
	      }
	    }
	  }

	  strats.data = function (
	    parentVal,
	    childVal,
	    vm
	  ) {
	    if (!vm) {
	      if (childVal && typeof childVal !== 'function') {
	        warn(
	          'The "data" option should be a function ' +
	          'that returns a per-instance value in component ' +
	          'definitions.',
	          vm
	        );

	        return parentVal
	      }
	      return mergeDataOrFn(parentVal, childVal)
	    }

	    return mergeDataOrFn(parentVal, childVal, vm)
	  };

	  /**
	   * Hooks and props are merged as arrays.
	   */
	  function mergeHook (
	    parentVal,
	    childVal
	  ) {
	    var res = childVal
	      ? parentVal
	        ? parentVal.concat(childVal)
	        : Array.isArray(childVal)
	          ? childVal
	          : [childVal]
	      : parentVal;
	    return res
	      ? dedupeHooks(res)
	      : res
	  }

	  function dedupeHooks (hooks) {
	    var res = [];
	    for (var i = 0; i < hooks.length; i++) {
	      if (res.indexOf(hooks[i]) === -1) {
	        res.push(hooks[i]);
	      }
	    }
	    return res
	  }

	  LIFECYCLE_HOOKS.forEach(function (hook) {
	    strats[hook] = mergeHook;
	  });

	  /**
	   * Assets
	   *
	   * When a vm is present (instance creation), we need to do
	   * a three-way merge between constructor options, instance
	   * options and parent options.
	   */
	  function mergeAssets (
	    parentVal,
	    childVal,
	    vm,
	    key
	  ) {
	    var res = Object.create(parentVal || null);
	    if (childVal) {
	      assertObjectType(key, childVal, vm);
	      return extend(res, childVal)
	    } else {
	      return res
	    }
	  }

	  ASSET_TYPES.forEach(function (type) {
	    strats[type + 's'] = mergeAssets;
	  });

	  /**
	   * Watchers.
	   *
	   * Watchers hashes should not overwrite one
	   * another, so we merge them as arrays.
	   */
	  strats.watch = function (
	    parentVal,
	    childVal,
	    vm,
	    key
	  ) {
	    // work around Firefox's Object.prototype.watch...
	    if (parentVal === nativeWatch) { parentVal = undefined; }
	    if (childVal === nativeWatch) { childVal = undefined; }
	    /* istanbul ignore if */
	    if (!childVal) { return Object.create(parentVal || null) }
	    {
	      assertObjectType(key, childVal, vm);
	    }
	    if (!parentVal) { return childVal }
	    var ret = {};
	    extend(ret, parentVal);
	    for (var key$1 in childVal) {
	      var parent = ret[key$1];
	      var child = childVal[key$1];
	      if (parent && !Array.isArray(parent)) {
	        parent = [parent];
	      }
	      ret[key$1] = parent
	        ? parent.concat(child)
	        : Array.isArray(child) ? child : [child];
	    }
	    return ret
	  };

	  /**
	   * Other object hashes.
	   */
	  strats.props =
	  strats.methods =
	  strats.inject =
	  strats.computed = function (
	    parentVal,
	    childVal,
	    vm,
	    key
	  ) {
	    if (childVal && "development" !== 'production') {
	      assertObjectType(key, childVal, vm);
	    }
	    if (!parentVal) { return childVal }
	    var ret = Object.create(null);
	    extend(ret, parentVal);
	    if (childVal) { extend(ret, childVal); }
	    return ret
	  };
	  strats.provide = mergeDataOrFn;

	  /**
	   * Default strategy.
	   */
	  var defaultStrat = function (parentVal, childVal) {
	    return childVal === undefined
	      ? parentVal
	      : childVal
	  };

	  /**
	   * Validate component names
	   */
	  function checkComponents (options) {
	    for (var key in options.components) {
	      validateComponentName(key);
	    }
	  }

	  function validateComponentName (name) {
	    if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
	      warn(
	        'Invalid component name: "' + name + '". Component names ' +
	        'should conform to valid custom element name in html5 specification.'
	      );
	    }
	    if (isBuiltInTag(name) || config.isReservedTag(name)) {
	      warn(
	        'Do not use built-in or reserved HTML elements as component ' +
	        'id: ' + name
	      );
	    }
	  }

	  /**
	   * Ensure all props option syntax are normalized into the
	   * Object-based format.
	   */
	  function normalizeProps (options, vm) {
	    var props = options.props;
	    if (!props) { return }
	    var res = {};
	    var i, val, name;
	    if (Array.isArray(props)) {
	      i = props.length;
	      while (i--) {
	        val = props[i];
	        if (typeof val === 'string') {
	          name = camelize(val);
	          res[name] = { type: null };
	        } else {
	          warn('props must be strings when using array syntax.');
	        }
	      }
	    } else if (isPlainObject(props)) {
	      for (var key in props) {
	        val = props[key];
	        name = camelize(key);
	        res[name] = isPlainObject(val)
	          ? val
	          : { type: val };
	      }
	    } else {
	      warn(
	        "Invalid value for option \"props\": expected an Array or an Object, " +
	        "but got " + (toRawType(props)) + ".",
	        vm
	      );
	    }
	    options.props = res;
	  }

	  /**
	   * Normalize all injections into Object-based format
	   */
	  function normalizeInject (options, vm) {
	    var inject = options.inject;
	    if (!inject) { return }
	    var normalized = options.inject = {};
	    if (Array.isArray(inject)) {
	      for (var i = 0; i < inject.length; i++) {
	        normalized[inject[i]] = { from: inject[i] };
	      }
	    } else if (isPlainObject(inject)) {
	      for (var key in inject) {
	        var val = inject[key];
	        normalized[key] = isPlainObject(val)
	          ? extend({ from: key }, val)
	          : { from: val };
	      }
	    } else {
	      warn(
	        "Invalid value for option \"inject\": expected an Array or an Object, " +
	        "but got " + (toRawType(inject)) + ".",
	        vm
	      );
	    }
	  }

	  /**
	   * Normalize raw function directives into object format.
	   */
	  function normalizeDirectives (options) {
	    var dirs = options.directives;
	    if (dirs) {
	      for (var key in dirs) {
	        var def$$1 = dirs[key];
	        if (typeof def$$1 === 'function') {
	          dirs[key] = { bind: def$$1, update: def$$1 };
	        }
	      }
	    }
	  }

	  function assertObjectType (name, value, vm) {
	    if (!isPlainObject(value)) {
	      warn(
	        "Invalid value for option \"" + name + "\": expected an Object, " +
	        "but got " + (toRawType(value)) + ".",
	        vm
	      );
	    }
	  }

	  /**
	   * Merge two option objects into a new one.
	   * Core utility used in both instantiation and inheritance.
	   */
	  function mergeOptions (
	    parent,
	    child,
	    vm
	  ) {
	    {
	      checkComponents(child);
	    }

	    if (typeof child === 'function') {
	      child = child.options;
	    }

	    normalizeProps(child, vm);
	    normalizeInject(child, vm);
	    normalizeDirectives(child);

	    // Apply extends and mixins on the child options,
	    // but only if it is a raw options object that isn't
	    // the result of another mergeOptions call.
	    // Only merged options has the _base property.
	    if (!child._base) {
	      if (child.extends) {
	        parent = mergeOptions(parent, child.extends, vm);
	      }
	      if (child.mixins) {
	        for (var i = 0, l = child.mixins.length; i < l; i++) {
	          parent = mergeOptions(parent, child.mixins[i], vm);
	        }
	      }
	    }

	    var options = {};
	    var key;
	    for (key in parent) {
	      mergeField(key);
	    }
	    for (key in child) {
	      if (!hasOwn(parent, key)) {
	        mergeField(key);
	      }
	    }
	    function mergeField (key) {
	      var strat = strats[key] || defaultStrat;
	      options[key] = strat(parent[key], child[key], vm, key);
	    }
	    return options
	  }

	  /**
	   * Resolve an asset.
	   * This function is used because child instances need access
	   * to assets defined in its ancestor chain.
	   */
	  function resolveAsset (
	    options,
	    type,
	    id,
	    warnMissing
	  ) {
	    /* istanbul ignore if */
	    if (typeof id !== 'string') {
	      return
	    }
	    var assets = options[type];
	    // check local registration variations first
	    if (hasOwn(assets, id)) { return assets[id] }
	    var camelizedId = camelize(id);
	    if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
	    var PascalCaseId = capitalize(camelizedId);
	    if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
	    // fallback to prototype chain
	    var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
	    if (warnMissing && !res) {
	      warn(
	        'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
	        options
	      );
	    }
	    return res
	  }

	  /*  */



	  function validateProp (
	    key,
	    propOptions,
	    propsData,
	    vm
	  ) {
	    var prop = propOptions[key];
	    var absent = !hasOwn(propsData, key);
	    var value = propsData[key];
	    // boolean casting
	    var booleanIndex = getTypeIndex(Boolean, prop.type);
	    if (booleanIndex > -1) {
	      if (absent && !hasOwn(prop, 'default')) {
	        value = false;
	      } else if (value === '' || value === hyphenate(key)) {
	        // only cast empty string / same name to boolean if
	        // boolean has higher priority
	        var stringIndex = getTypeIndex(String, prop.type);
	        if (stringIndex < 0 || booleanIndex < stringIndex) {
	          value = true;
	        }
	      }
	    }
	    // check default value
	    if (value === undefined) {
	      value = getPropDefaultValue(vm, prop, key);
	      // since the default value is a fresh copy,
	      // make sure to observe it.
	      var prevShouldObserve = shouldObserve;
	      toggleObserving(true);
	      observe(value);
	      toggleObserving(prevShouldObserve);
	    }
	    {
	      assertProp(prop, key, value, vm, absent);
	    }
	    return value
	  }

	  /**
	   * Get the default value of a prop.
	   */
	  function getPropDefaultValue (vm, prop, key) {
	    // no default, return undefined
	    if (!hasOwn(prop, 'default')) {
	      return undefined
	    }
	    var def = prop.default;
	    // warn against non-factory defaults for Object & Array
	    if (isObject(def)) {
	      warn(
	        'Invalid default value for prop "' + key + '": ' +
	        'Props with type Object/Array must use a factory function ' +
	        'to return the default value.',
	        vm
	      );
	    }
	    // the raw prop value was also undefined from previous render,
	    // return previous default value to avoid unnecessary watcher trigger
	    if (vm && vm.$options.propsData &&
	      vm.$options.propsData[key] === undefined &&
	      vm._props[key] !== undefined
	    ) {
	      return vm._props[key]
	    }
	    // call factory function for non-Function types
	    // a value is Function if its prototype is function even across different execution context
	    return typeof def === 'function' && getType(prop.type) !== 'Function'
	      ? def.call(vm)
	      : def
	  }

	  /**
	   * Assert whether a prop is valid.
	   */
	  function assertProp (
	    prop,
	    name,
	    value,
	    vm,
	    absent
	  ) {
	    if (prop.required && absent) {
	      warn(
	        'Missing required prop: "' + name + '"',
	        vm
	      );
	      return
	    }
	    if (value == null && !prop.required) {
	      return
	    }
	    var type = prop.type;
	    var valid = !type || type === true;
	    var expectedTypes = [];
	    if (type) {
	      if (!Array.isArray(type)) {
	        type = [type];
	      }
	      for (var i = 0; i < type.length && !valid; i++) {
	        var assertedType = assertType(value, type[i]);
	        expectedTypes.push(assertedType.expectedType || '');
	        valid = assertedType.valid;
	      }
	    }

	    if (!valid) {
	      warn(
	        getInvalidTypeMessage(name, value, expectedTypes),
	        vm
	      );
	      return
	    }
	    var validator = prop.validator;
	    if (validator) {
	      if (!validator(value)) {
	        warn(
	          'Invalid prop: custom validator check failed for prop "' + name + '".',
	          vm
	        );
	      }
	    }
	  }

	  var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

	  function assertType (value, type) {
	    var valid;
	    var expectedType = getType(type);
	    if (simpleCheckRE.test(expectedType)) {
	      var t = typeof value;
	      valid = t === expectedType.toLowerCase();
	      // for primitive wrapper objects
	      if (!valid && t === 'object') {
	        valid = value instanceof type;
	      }
	    } else if (expectedType === 'Object') {
	      valid = isPlainObject(value);
	    } else if (expectedType === 'Array') {
	      valid = Array.isArray(value);
	    } else {
	      valid = value instanceof type;
	    }
	    return {
	      valid: valid,
	      expectedType: expectedType
	    }
	  }

	  /**
	   * Use function string name to check built-in types,
	   * because a simple equality check will fail when running
	   * across different vms / iframes.
	   */
	  function getType (fn) {
	    var match = fn && fn.toString().match(/^\s*function (\w+)/);
	    return match ? match[1] : ''
	  }

	  function isSameType (a, b) {
	    return getType(a) === getType(b)
	  }

	  function getTypeIndex (type, expectedTypes) {
	    if (!Array.isArray(expectedTypes)) {
	      return isSameType(expectedTypes, type) ? 0 : -1
	    }
	    for (var i = 0, len = expectedTypes.length; i < len; i++) {
	      if (isSameType(expectedTypes[i], type)) {
	        return i
	      }
	    }
	    return -1
	  }

	  function getInvalidTypeMessage (name, value, expectedTypes) {
	    var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
	      " Expected " + (expectedTypes.map(capitalize).join(', '));
	    var expectedType = expectedTypes[0];
	    var receivedType = toRawType(value);
	    var expectedValue = styleValue(value, expectedType);
	    var receivedValue = styleValue(value, receivedType);
	    // check if we need to specify expected value
	    if (expectedTypes.length === 1 &&
	        isExplicable(expectedType) &&
	        !isBoolean(expectedType, receivedType)) {
	      message += " with value " + expectedValue;
	    }
	    message += ", got " + receivedType + " ";
	    // check if we need to specify received value
	    if (isExplicable(receivedType)) {
	      message += "with value " + receivedValue + ".";
	    }
	    return message
	  }

	  function styleValue (value, type) {
	    if (type === 'String') {
	      return ("\"" + value + "\"")
	    } else if (type === 'Number') {
	      return ("" + (Number(value)))
	    } else {
	      return ("" + value)
	    }
	  }

	  function isExplicable (value) {
	    var explicitTypes = ['string', 'number', 'boolean'];
	    return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
	  }

	  function isBoolean () {
	    var args = [], len = arguments.length;
	    while ( len-- ) args[ len ] = arguments[ len ];

	    return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
	  }

	  /*  */

	  function handleError (err, vm, info) {
	    // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
	    // See: https://github.com/vuejs/vuex/issues/1505
	    pushTarget();
	    try {
	      if (vm) {
	        var cur = vm;
	        while ((cur = cur.$parent)) {
	          var hooks = cur.$options.errorCaptured;
	          if (hooks) {
	            for (var i = 0; i < hooks.length; i++) {
	              try {
	                var capture = hooks[i].call(cur, err, vm, info) === false;
	                if (capture) { return }
	              } catch (e) {
	                globalHandleError(e, cur, 'errorCaptured hook');
	              }
	            }
	          }
	        }
	      }
	      globalHandleError(err, vm, info);
	    } finally {
	      popTarget();
	    }
	  }

	  function invokeWithErrorHandling (
	    handler,
	    context,
	    args,
	    vm,
	    info
	  ) {
	    var res;
	    try {
	      res = args ? handler.apply(context, args) : handler.call(context);
	      if (res && !res._isVue && isPromise(res) && !res._handled) {
	        res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
	        // issue #9511
	        // avoid catch triggering multiple times when nested calls
	        res._handled = true;
	      }
	    } catch (e) {
	      handleError(e, vm, info);
	    }
	    return res
	  }

	  function globalHandleError (err, vm, info) {
	    if (config.errorHandler) {
	      try {
	        return config.errorHandler.call(null, err, vm, info)
	      } catch (e) {
	        // if the user intentionally throws the original error in the handler,
	        // do not log it twice
	        if (e !== err) {
	          logError(e, null, 'config.errorHandler');
	        }
	      }
	    }
	    logError(err, vm, info);
	  }

	  function logError (err, vm, info) {
	    {
	      warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
	    }
	    /* istanbul ignore else */
	    if ((inBrowser || inWeex) && typeof console !== 'undefined') {
	      console.error(err);
	    } else {
	      throw err
	    }
	  }

	  /*  */

	  var isUsingMicroTask = false;

	  var callbacks = [];
	  var pending = false;

	  function flushCallbacks () {
	    pending = false;
	    var copies = callbacks.slice(0);
	    callbacks.length = 0;
	    for (var i = 0; i < copies.length; i++) {
	      copies[i]();
	    }
	  }

	  // Here we have async deferring wrappers using microtasks.
	  // In 2.5 we used (macro) tasks (in combination with microtasks).
	  // However, it has subtle problems when state is changed right before repaint
	  // (e.g. #6813, out-in transitions).
	  // Also, using (macro) tasks in event handler would cause some weird behaviors
	  // that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
	  // So we now use microtasks everywhere, again.
	  // A major drawback of this tradeoff is that there are some scenarios
	  // where microtasks have too high a priority and fire in between supposedly
	  // sequential events (e.g. #4521, #6690, which have workarounds)
	  // or even between bubbling of the same event (#6566).
	  var timerFunc;

	  // The nextTick behavior leverages the microtask queue, which can be accessed
	  // via either native Promise.then or MutationObserver.
	  // MutationObserver has wider support, however it is seriously bugged in
	  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
	  // completely stops working after triggering a few times... so, if native
	  // Promise is available, we will use it:
	  /* istanbul ignore next, $flow-disable-line */
	  if (typeof Promise !== 'undefined' && isNative(Promise)) {
	    var p = Promise.resolve();
	    timerFunc = function () {
	      p.then(flushCallbacks);
	      // In problematic UIWebViews, Promise.then doesn't completely break, but
	      // it can get stuck in a weird state where callbacks are pushed into the
	      // microtask queue but the queue isn't being flushed, until the browser
	      // needs to do some other work, e.g. handle a timer. Therefore we can
	      // "force" the microtask queue to be flushed by adding an empty timer.
	      if (isIOS) { setTimeout(noop); }
	    };
	    isUsingMicroTask = true;
	  } else if (!isIE && typeof MutationObserver !== 'undefined' && (
	    isNative(MutationObserver) ||
	    // PhantomJS and iOS 7.x
	    MutationObserver.toString() === '[object MutationObserverConstructor]'
	  )) {
	    // Use MutationObserver where native Promise is not available,
	    // e.g. PhantomJS, iOS7, Android 4.4
	    // (#6466 MutationObserver is unreliable in IE11)
	    var counter = 1;
	    var observer = new MutationObserver(flushCallbacks);
	    var textNode = document.createTextNode(String(counter));
	    observer.observe(textNode, {
	      characterData: true
	    });
	    timerFunc = function () {
	      counter = (counter + 1) % 2;
	      textNode.data = String(counter);
	    };
	    isUsingMicroTask = true;
	  } else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
	    // Fallback to setImmediate.
	    // Technically it leverages the (macro) task queue,
	    // but it is still a better choice than setTimeout.
	    timerFunc = function () {
	      setImmediate(flushCallbacks);
	    };
	  } else {
	    // Fallback to setTimeout.
	    timerFunc = function () {
	      setTimeout(flushCallbacks, 0);
	    };
	  }

	  function nextTick (cb, ctx) {
	    var _resolve;
	    callbacks.push(function () {
	      if (cb) {
	        try {
	          cb.call(ctx);
	        } catch (e) {
	          handleError(e, ctx, 'nextTick');
	        }
	      } else if (_resolve) {
	        _resolve(ctx);
	      }
	    });
	    if (!pending) {
	      pending = true;
	      timerFunc();
	    }
	    // $flow-disable-line
	    if (!cb && typeof Promise !== 'undefined') {
	      return new Promise(function (resolve) {
	        _resolve = resolve;
	      })
	    }
	  }

	  /*  */

	  var mark;
	  var measure;

	  {
	    var perf = inBrowser && window.performance;
	    /* istanbul ignore if */
	    if (
	      perf &&
	      perf.mark &&
	      perf.measure &&
	      perf.clearMarks &&
	      perf.clearMeasures
	    ) {
	      mark = function (tag) { return perf.mark(tag); };
	      measure = function (name, startTag, endTag) {
	        perf.measure(name, startTag, endTag);
	        perf.clearMarks(startTag);
	        perf.clearMarks(endTag);
	        // perf.clearMeasures(name)
	      };
	    }
	  }

	  /* not type checking this file because flow doesn't play well with Proxy */

	  var initProxy;

	  {
	    var allowedGlobals = makeMap(
	      'Infinity,undefined,NaN,isFinite,isNaN,' +
	      'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
	      'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
	      'require' // for Webpack/Browserify
	    );

	    var warnNonPresent = function (target, key) {
	      warn(
	        "Property or method \"" + key + "\" is not defined on the instance but " +
	        'referenced during render. Make sure that this property is reactive, ' +
	        'either in the data option, or for class-based components, by ' +
	        'initializing the property. ' +
	        'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
	        target
	      );
	    };

	    var warnReservedPrefix = function (target, key) {
	      warn(
	        "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
	        'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
	        'prevent conflicts with Vue internals. ' +
	        'See: https://vuejs.org/v2/api/#data',
	        target
	      );
	    };

	    var hasProxy =
	      typeof Proxy !== 'undefined' && isNative(Proxy);

	    if (hasProxy) {
	      var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
	      config.keyCodes = new Proxy(config.keyCodes, {
	        set: function set (target, key, value) {
	          if (isBuiltInModifier(key)) {
	            warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
	            return false
	          } else {
	            target[key] = value;
	            return true
	          }
	        }
	      });
	    }

	    var hasHandler = {
	      has: function has (target, key) {
	        var has = key in target;
	        var isAllowed = allowedGlobals(key) ||
	          (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
	        if (!has && !isAllowed) {
	          if (key in target.$data) { warnReservedPrefix(target, key); }
	          else { warnNonPresent(target, key); }
	        }
	        return has || !isAllowed
	      }
	    };

	    var getHandler = {
	      get: function get (target, key) {
	        if (typeof key === 'string' && !(key in target)) {
	          if (key in target.$data) { warnReservedPrefix(target, key); }
	          else { warnNonPresent(target, key); }
	        }
	        return target[key]
	      }
	    };

	    initProxy = function initProxy (vm) {
	      if (hasProxy) {
	        // determine which proxy handler to use
	        var options = vm.$options;
	        var handlers = options.render && options.render._withStripped
	          ? getHandler
	          : hasHandler;
	        vm._renderProxy = new Proxy(vm, handlers);
	      } else {
	        vm._renderProxy = vm;
	      }
	    };
	  }

	  /*  */

	  var seenObjects = new _Set();

	  /**
	   * Recursively traverse an object to evoke all converted
	   * getters, so that every nested property inside the object
	   * is collected as a "deep" dependency.
	   */
	  function traverse (val) {
	    _traverse(val, seenObjects);
	    seenObjects.clear();
	  }

	  function _traverse (val, seen) {
	    var i, keys;
	    var isA = Array.isArray(val);
	    if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
	      return
	    }
	    if (val.__ob__) {
	      var depId = val.__ob__.dep.id;
	      if (seen.has(depId)) {
	        return
	      }
	      seen.add(depId);
	    }
	    if (isA) {
	      i = val.length;
	      while (i--) { _traverse(val[i], seen); }
	    } else {
	      keys = Object.keys(val);
	      i = keys.length;
	      while (i--) { _traverse(val[keys[i]], seen); }
	    }
	  }

	  /*  */

	  var normalizeEvent = cached(function (name) {
	    var passive = name.charAt(0) === '&';
	    name = passive ? name.slice(1) : name;
	    var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
	    name = once$$1 ? name.slice(1) : name;
	    var capture = name.charAt(0) === '!';
	    name = capture ? name.slice(1) : name;
	    return {
	      name: name,
	      once: once$$1,
	      capture: capture,
	      passive: passive
	    }
	  });

	  function createFnInvoker (fns, vm) {
	    function invoker () {
	      var arguments$1 = arguments;

	      var fns = invoker.fns;
	      if (Array.isArray(fns)) {
	        var cloned = fns.slice();
	        for (var i = 0; i < cloned.length; i++) {
	          invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
	        }
	      } else {
	        // return handler return value for single handlers
	        return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
	      }
	    }
	    invoker.fns = fns;
	    return invoker
	  }

	  function updateListeners (
	    on,
	    oldOn,
	    add,
	    remove$$1,
	    createOnceHandler,
	    vm
	  ) {
	    var name, def$$1, cur, old, event;
	    for (name in on) {
	      def$$1 = cur = on[name];
	      old = oldOn[name];
	      event = normalizeEvent(name);
	      if (isUndef(cur)) {
	        warn(
	          "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
	          vm
	        );
	      } else if (isUndef(old)) {
	        if (isUndef(cur.fns)) {
	          cur = on[name] = createFnInvoker(cur, vm);
	        }
	        if (isTrue(event.once)) {
	          cur = on[name] = createOnceHandler(event.name, cur, event.capture);
	        }
	        add(event.name, cur, event.capture, event.passive, event.params);
	      } else if (cur !== old) {
	        old.fns = cur;
	        on[name] = old;
	      }
	    }
	    for (name in oldOn) {
	      if (isUndef(on[name])) {
	        event = normalizeEvent(name);
	        remove$$1(event.name, oldOn[name], event.capture);
	      }
	    }
	  }

	  /*  */

	  function mergeVNodeHook (def, hookKey, hook) {
	    if (def instanceof VNode) {
	      def = def.data.hook || (def.data.hook = {});
	    }
	    var invoker;
	    var oldHook = def[hookKey];

	    function wrappedHook () {
	      hook.apply(this, arguments);
	      // important: remove merged hook to ensure it's called only once
	      // and prevent memory leak
	      remove(invoker.fns, wrappedHook);
	    }

	    if (isUndef(oldHook)) {
	      // no existing hook
	      invoker = createFnInvoker([wrappedHook]);
	    } else {
	      /* istanbul ignore if */
	      if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
	        // already a merged invoker
	        invoker = oldHook;
	        invoker.fns.push(wrappedHook);
	      } else {
	        // existing plain hook
	        invoker = createFnInvoker([oldHook, wrappedHook]);
	      }
	    }

	    invoker.merged = true;
	    def[hookKey] = invoker;
	  }

	  /*  */

	  function extractPropsFromVNodeData (
	    data,
	    Ctor,
	    tag
	  ) {
	    // we are only extracting raw values here.
	    // validation and default values are handled in the child
	    // component itself.
	    var propOptions = Ctor.options.props;
	    if (isUndef(propOptions)) {
	      return
	    }
	    var res = {};
	    var attrs = data.attrs;
	    var props = data.props;
	    if (isDef(attrs) || isDef(props)) {
	      for (var key in propOptions) {
	        var altKey = hyphenate(key);
	        {
	          var keyInLowerCase = key.toLowerCase();
	          if (
	            key !== keyInLowerCase &&
	            attrs && hasOwn(attrs, keyInLowerCase)
	          ) {
	            tip(
	              "Prop \"" + keyInLowerCase + "\" is passed to component " +
	              (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
	              " \"" + key + "\". " +
	              "Note that HTML attributes are case-insensitive and camelCased " +
	              "props need to use their kebab-case equivalents when using in-DOM " +
	              "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
	            );
	          }
	        }
	        checkProp(res, props, key, altKey, true) ||
	        checkProp(res, attrs, key, altKey, false);
	      }
	    }
	    return res
	  }

	  function checkProp (
	    res,
	    hash,
	    key,
	    altKey,
	    preserve
	  ) {
	    if (isDef(hash)) {
	      if (hasOwn(hash, key)) {
	        res[key] = hash[key];
	        if (!preserve) {
	          delete hash[key];
	        }
	        return true
	      } else if (hasOwn(hash, altKey)) {
	        res[key] = hash[altKey];
	        if (!preserve) {
	          delete hash[altKey];
	        }
	        return true
	      }
	    }
	    return false
	  }

	  /*  */

	  // The template compiler attempts to minimize the need for normalization by
	  // statically analyzing the template at compile time.
	  //
	  // For plain HTML markup, normalization can be completely skipped because the
	  // generated render function is guaranteed to return Array<VNode>. There are
	  // two cases where extra normalization is needed:

	  // 1. When the children contains components - because a functional component
	  // may return an Array instead of a single root. In this case, just a simple
	  // normalization is needed - if any child is an Array, we flatten the whole
	  // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
	  // because functional components already normalize their own children.
	  function simpleNormalizeChildren (children) {
	    for (var i = 0; i < children.length; i++) {
	      if (Array.isArray(children[i])) {
	        return Array.prototype.concat.apply([], children)
	      }
	    }
	    return children
	  }

	  // 2. When the children contains constructs that always generated nested Arrays,
	  // e.g. <template>, <slot>, v-for, or when the children is provided by user
	  // with hand-written render functions / JSX. In such cases a full normalization
	  // is needed to cater to all possible types of children values.
	  function normalizeChildren (children) {
	    return isPrimitive(children)
	      ? [createTextVNode(children)]
	      : Array.isArray(children)
	        ? normalizeArrayChildren(children)
	        : undefined
	  }

	  function isTextNode (node) {
	    return isDef(node) && isDef(node.text) && isFalse(node.isComment)
	  }

	  function normalizeArrayChildren (children, nestedIndex) {
	    var res = [];
	    var i, c, lastIndex, last;
	    for (i = 0; i < children.length; i++) {
	      c = children[i];
	      if (isUndef(c) || typeof c === 'boolean') { continue }
	      lastIndex = res.length - 1;
	      last = res[lastIndex];
	      //  nested
	      if (Array.isArray(c)) {
	        if (c.length > 0) {
	          c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
	          // merge adjacent text nodes
	          if (isTextNode(c[0]) && isTextNode(last)) {
	            res[lastIndex] = createTextVNode(last.text + (c[0]).text);
	            c.shift();
	          }
	          res.push.apply(res, c);
	        }
	      } else if (isPrimitive(c)) {
	        if (isTextNode(last)) {
	          // merge adjacent text nodes
	          // this is necessary for SSR hydration because text nodes are
	          // essentially merged when rendered to HTML strings
	          res[lastIndex] = createTextVNode(last.text + c);
	        } else if (c !== '') {
	          // convert primitive to vnode
	          res.push(createTextVNode(c));
	        }
	      } else {
	        if (isTextNode(c) && isTextNode(last)) {
	          // merge adjacent text nodes
	          res[lastIndex] = createTextVNode(last.text + c.text);
	        } else {
	          // default key for nested array children (likely generated by v-for)
	          if (isTrue(children._isVList) &&
	            isDef(c.tag) &&
	            isUndef(c.key) &&
	            isDef(nestedIndex)) {
	            c.key = "__vlist" + nestedIndex + "_" + i + "__";
	          }
	          res.push(c);
	        }
	      }
	    }
	    return res
	  }

	  /*  */

	  function initProvide (vm) {
	    var provide = vm.$options.provide;
	    if (provide) {
	      vm._provided = typeof provide === 'function'
	        ? provide.call(vm)
	        : provide;
	    }
	  }

	  function initInjections (vm) {
	    var result = resolveInject(vm.$options.inject, vm);
	    if (result) {
	      toggleObserving(false);
	      Object.keys(result).forEach(function (key) {
	        /* istanbul ignore else */
	        {
	          defineReactive$$1(vm, key, result[key], function () {
	            warn(
	              "Avoid mutating an injected value directly since the changes will be " +
	              "overwritten whenever the provided component re-renders. " +
	              "injection being mutated: \"" + key + "\"",
	              vm
	            );
	          });
	        }
	      });
	      toggleObserving(true);
	    }
	  }

	  function resolveInject (inject, vm) {
	    if (inject) {
	      // inject is :any because flow is not smart enough to figure out cached
	      var result = Object.create(null);
	      var keys = hasSymbol
	        ? Reflect.ownKeys(inject)
	        : Object.keys(inject);

	      for (var i = 0; i < keys.length; i++) {
	        var key = keys[i];
	        // #6574 in case the inject object is observed...
	        if (key === '__ob__') { continue }
	        var provideKey = inject[key].from;
	        var source = vm;
	        while (source) {
	          if (source._provided && hasOwn(source._provided, provideKey)) {
	            result[key] = source._provided[provideKey];
	            break
	          }
	          source = source.$parent;
	        }
	        if (!source) {
	          if ('default' in inject[key]) {
	            var provideDefault = inject[key].default;
	            result[key] = typeof provideDefault === 'function'
	              ? provideDefault.call(vm)
	              : provideDefault;
	          } else {
	            warn(("Injection \"" + key + "\" not found"), vm);
	          }
	        }
	      }
	      return result
	    }
	  }

	  /*  */



	  /**
	   * Runtime helper for resolving raw children VNodes into a slot object.
	   */
	  function resolveSlots (
	    children,
	    context
	  ) {
	    if (!children || !children.length) {
	      return {}
	    }
	    var slots = {};
	    for (var i = 0, l = children.length; i < l; i++) {
	      var child = children[i];
	      var data = child.data;
	      // remove slot attribute if the node is resolved as a Vue slot node
	      if (data && data.attrs && data.attrs.slot) {
	        delete data.attrs.slot;
	      }
	      // named slots should only be respected if the vnode was rendered in the
	      // same context.
	      if ((child.context === context || child.fnContext === context) &&
	        data && data.slot != null
	      ) {
	        var name = data.slot;
	        var slot = (slots[name] || (slots[name] = []));
	        if (child.tag === 'template') {
	          slot.push.apply(slot, child.children || []);
	        } else {
	          slot.push(child);
	        }
	      } else {
	        (slots.default || (slots.default = [])).push(child);
	      }
	    }
	    // ignore slots that contains only whitespace
	    for (var name$1 in slots) {
	      if (slots[name$1].every(isWhitespace)) {
	        delete slots[name$1];
	      }
	    }
	    return slots
	  }

	  function isWhitespace (node) {
	    return (node.isComment && !node.asyncFactory) || node.text === ' '
	  }

	  /*  */

	  function normalizeScopedSlots (
	    slots,
	    normalSlots,
	    prevSlots
	  ) {
	    var res;
	    var hasNormalSlots = Object.keys(normalSlots).length > 0;
	    var isStable = slots ? !!slots.$stable : !hasNormalSlots;
	    var key = slots && slots.$key;
	    if (!slots) {
	      res = {};
	    } else if (slots._normalized) {
	      // fast path 1: child component re-render only, parent did not change
	      return slots._normalized
	    } else if (
	      isStable &&
	      prevSlots &&
	      prevSlots !== emptyObject &&
	      key === prevSlots.$key &&
	      !hasNormalSlots &&
	      !prevSlots.$hasNormal
	    ) {
	      // fast path 2: stable scoped slots w/ no normal slots to proxy,
	      // only need to normalize once
	      return prevSlots
	    } else {
	      res = {};
	      for (var key$1 in slots) {
	        if (slots[key$1] && key$1[0] !== '$') {
	          res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
	        }
	      }
	    }
	    // expose normal slots on scopedSlots
	    for (var key$2 in normalSlots) {
	      if (!(key$2 in res)) {
	        res[key$2] = proxyNormalSlot(normalSlots, key$2);
	      }
	    }
	    // avoriaz seems to mock a non-extensible $scopedSlots object
	    // and when that is passed down this would cause an error
	    if (slots && Object.isExtensible(slots)) {
	      (slots)._normalized = res;
	    }
	    def(res, '$stable', isStable);
	    def(res, '$key', key);
	    def(res, '$hasNormal', hasNormalSlots);
	    return res
	  }

	  function normalizeScopedSlot(normalSlots, key, fn) {
	    var normalized = function () {
	      var res = arguments.length ? fn.apply(null, arguments) : fn({});
	      res = res && typeof res === 'object' && !Array.isArray(res)
	        ? [res] // single vnode
	        : normalizeChildren(res);
	      return res && (
	        res.length === 0 ||
	        (res.length === 1 && res[0].isComment) // #9658
	      ) ? undefined
	        : res
	    };
	    // this is a slot using the new v-slot syntax without scope. although it is
	    // compiled as a scoped slot, render fn users would expect it to be present
	    // on this.$slots because the usage is semantically a normal slot.
	    if (fn.proxy) {
	      Object.defineProperty(normalSlots, key, {
	        get: normalized,
	        enumerable: true,
	        configurable: true
	      });
	    }
	    return normalized
	  }

	  function proxyNormalSlot(slots, key) {
	    return function () { return slots[key]; }
	  }

	  /*  */

	  /**
	   * Runtime helper for rendering v-for lists.
	   */
	  function renderList (
	    val,
	    render
	  ) {
	    var ret, i, l, keys, key;
	    if (Array.isArray(val) || typeof val === 'string') {
	      ret = new Array(val.length);
	      for (i = 0, l = val.length; i < l; i++) {
	        ret[i] = render(val[i], i);
	      }
	    } else if (typeof val === 'number') {
	      ret = new Array(val);
	      for (i = 0; i < val; i++) {
	        ret[i] = render(i + 1, i);
	      }
	    } else if (isObject(val)) {
	      if (hasSymbol && val[Symbol.iterator]) {
	        ret = [];
	        var iterator = val[Symbol.iterator]();
	        var result = iterator.next();
	        while (!result.done) {
	          ret.push(render(result.value, ret.length));
	          result = iterator.next();
	        }
	      } else {
	        keys = Object.keys(val);
	        ret = new Array(keys.length);
	        for (i = 0, l = keys.length; i < l; i++) {
	          key = keys[i];
	          ret[i] = render(val[key], key, i);
	        }
	      }
	    }
	    if (!isDef(ret)) {
	      ret = [];
	    }
	    (ret)._isVList = true;
	    return ret
	  }

	  /*  */

	  /**
	   * Runtime helper for rendering <slot>
	   */
	  function renderSlot (
	    name,
	    fallback,
	    props,
	    bindObject
	  ) {
	    var scopedSlotFn = this.$scopedSlots[name];
	    var nodes;
	    if (scopedSlotFn) { // scoped slot
	      props = props || {};
	      if (bindObject) {
	        if (!isObject(bindObject)) {
	          warn(
	            'slot v-bind without argument expects an Object',
	            this
	          );
	        }
	        props = extend(extend({}, bindObject), props);
	      }
	      nodes = scopedSlotFn(props) || fallback;
	    } else {
	      nodes = this.$slots[name] || fallback;
	    }

	    var target = props && props.slot;
	    if (target) {
	      return this.$createElement('template', { slot: target }, nodes)
	    } else {
	      return nodes
	    }
	  }

	  /*  */

	  /**
	   * Runtime helper for resolving filters
	   */
	  function resolveFilter (id) {
	    return resolveAsset(this.$options, 'filters', id, true) || identity
	  }

	  /*  */

	  function isKeyNotMatch (expect, actual) {
	    if (Array.isArray(expect)) {
	      return expect.indexOf(actual) === -1
	    } else {
	      return expect !== actual
	    }
	  }

	  /**
	   * Runtime helper for checking keyCodes from config.
	   * exposed as Vue.prototype._k
	   * passing in eventKeyName as last argument separately for backwards compat
	   */
	  function checkKeyCodes (
	    eventKeyCode,
	    key,
	    builtInKeyCode,
	    eventKeyName,
	    builtInKeyName
	  ) {
	    var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
	    if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
	      return isKeyNotMatch(builtInKeyName, eventKeyName)
	    } else if (mappedKeyCode) {
	      return isKeyNotMatch(mappedKeyCode, eventKeyCode)
	    } else if (eventKeyName) {
	      return hyphenate(eventKeyName) !== key
	    }
	  }

	  /*  */

	  /**
	   * Runtime helper for merging v-bind="object" into a VNode's data.
	   */
	  function bindObjectProps (
	    data,
	    tag,
	    value,
	    asProp,
	    isSync
	  ) {
	    if (value) {
	      if (!isObject(value)) {
	        warn(
	          'v-bind without argument expects an Object or Array value',
	          this
	        );
	      } else {
	        if (Array.isArray(value)) {
	          value = toObject(value);
	        }
	        var hash;
	        var loop = function ( key ) {
	          if (
	            key === 'class' ||
	            key === 'style' ||
	            isReservedAttribute(key)
	          ) {
	            hash = data;
	          } else {
	            var type = data.attrs && data.attrs.type;
	            hash = asProp || config.mustUseProp(tag, type, key)
	              ? data.domProps || (data.domProps = {})
	              : data.attrs || (data.attrs = {});
	          }
	          var camelizedKey = camelize(key);
	          var hyphenatedKey = hyphenate(key);
	          if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
	            hash[key] = value[key];

	            if (isSync) {
	              var on = data.on || (data.on = {});
	              on[("update:" + key)] = function ($event) {
	                value[key] = $event;
	              };
	            }
	          }
	        };

	        for (var key in value) loop( key );
	      }
	    }
	    return data
	  }

	  /*  */

	  /**
	   * Runtime helper for rendering static trees.
	   */
	  function renderStatic (
	    index,
	    isInFor
	  ) {
	    var cached = this._staticTrees || (this._staticTrees = []);
	    var tree = cached[index];
	    // if has already-rendered static tree and not inside v-for,
	    // we can reuse the same tree.
	    if (tree && !isInFor) {
	      return tree
	    }
	    // otherwise, render a fresh tree.
	    tree = cached[index] = this.$options.staticRenderFns[index].call(
	      this._renderProxy,
	      null,
	      this // for render fns generated for functional component templates
	    );
	    markStatic(tree, ("__static__" + index), false);
	    return tree
	  }

	  /**
	   * Runtime helper for v-once.
	   * Effectively it means marking the node as static with a unique key.
	   */
	  function markOnce (
	    tree,
	    index,
	    key
	  ) {
	    markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
	    return tree
	  }

	  function markStatic (
	    tree,
	    key,
	    isOnce
	  ) {
	    if (Array.isArray(tree)) {
	      for (var i = 0; i < tree.length; i++) {
	        if (tree[i] && typeof tree[i] !== 'string') {
	          markStaticNode(tree[i], (key + "_" + i), isOnce);
	        }
	      }
	    } else {
	      markStaticNode(tree, key, isOnce);
	    }
	  }

	  function markStaticNode (node, key, isOnce) {
	    node.isStatic = true;
	    node.key = key;
	    node.isOnce = isOnce;
	  }

	  /*  */

	  function bindObjectListeners (data, value) {
	    if (value) {
	      if (!isPlainObject(value)) {
	        warn(
	          'v-on without argument expects an Object value',
	          this
	        );
	      } else {
	        var on = data.on = data.on ? extend({}, data.on) : {};
	        for (var key in value) {
	          var existing = on[key];
	          var ours = value[key];
	          on[key] = existing ? [].concat(existing, ours) : ours;
	        }
	      }
	    }
	    return data
	  }

	  /*  */

	  function resolveScopedSlots (
	    fns, // see flow/vnode
	    res,
	    // the following are added in 2.6
	    hasDynamicKeys,
	    contentHashKey
	  ) {
	    res = res || { $stable: !hasDynamicKeys };
	    for (var i = 0; i < fns.length; i++) {
	      var slot = fns[i];
	      if (Array.isArray(slot)) {
	        resolveScopedSlots(slot, res, hasDynamicKeys);
	      } else if (slot) {
	        // marker for reverse proxying v-slot without scope on this.$slots
	        if (slot.proxy) {
	          slot.fn.proxy = true;
	        }
	        res[slot.key] = slot.fn;
	      }
	    }
	    if (contentHashKey) {
	      (res).$key = contentHashKey;
	    }
	    return res
	  }

	  /*  */

	  function bindDynamicKeys (baseObj, values) {
	    for (var i = 0; i < values.length; i += 2) {
	      var key = values[i];
	      if (typeof key === 'string' && key) {
	        baseObj[values[i]] = values[i + 1];
	      } else if (key !== '' && key !== null) {
	        // null is a special value for explicitly removing a binding
	        warn(
	          ("Invalid value for dynamic directive argument (expected string or null): " + key),
	          this
	        );
	      }
	    }
	    return baseObj
	  }

	  // helper to dynamically append modifier runtime markers to event names.
	  // ensure only append when value is already string, otherwise it will be cast
	  // to string and cause the type check to miss.
	  function prependModifier (value, symbol) {
	    return typeof value === 'string' ? symbol + value : value
	  }

	  /*  */

	  function installRenderHelpers (target) {
	    target._o = markOnce;
	    target._n = toNumber;
	    target._s = toString;
	    target._l = renderList;
	    target._t = renderSlot;
	    target._q = looseEqual;
	    target._i = looseIndexOf;
	    target._m = renderStatic;
	    target._f = resolveFilter;
	    target._k = checkKeyCodes;
	    target._b = bindObjectProps;
	    target._v = createTextVNode;
	    target._e = createEmptyVNode;
	    target._u = resolveScopedSlots;
	    target._g = bindObjectListeners;
	    target._d = bindDynamicKeys;
	    target._p = prependModifier;
	  }

	  /*  */

	  function FunctionalRenderContext (
	    data,
	    props,
	    children,
	    parent,
	    Ctor
	  ) {
	    var this$1 = this;

	    var options = Ctor.options;
	    // ensure the createElement function in functional components
	    // gets a unique context - this is necessary for correct named slot check
	    var contextVm;
	    if (hasOwn(parent, '_uid')) {
	      contextVm = Object.create(parent);
	      // $flow-disable-line
	      contextVm._original = parent;
	    } else {
	      // the context vm passed in is a functional context as well.
	      // in this case we want to make sure we are able to get a hold to the
	      // real context instance.
	      contextVm = parent;
	      // $flow-disable-line
	      parent = parent._original;
	    }
	    var isCompiled = isTrue(options._compiled);
	    var needNormalization = !isCompiled;

	    this.data = data;
	    this.props = props;
	    this.children = children;
	    this.parent = parent;
	    this.listeners = data.on || emptyObject;
	    this.injections = resolveInject(options.inject, parent);
	    this.slots = function () {
	      if (!this$1.$slots) {
	        normalizeScopedSlots(
	          data.scopedSlots,
	          this$1.$slots = resolveSlots(children, parent)
	        );
	      }
	      return this$1.$slots
	    };

	    Object.defineProperty(this, 'scopedSlots', ({
	      enumerable: true,
	      get: function get () {
	        return normalizeScopedSlots(data.scopedSlots, this.slots())
	      }
	    }));

	    // support for compiled functional template
	    if (isCompiled) {
	      // exposing $options for renderStatic()
	      this.$options = options;
	      // pre-resolve slots for renderSlot()
	      this.$slots = this.slots();
	      this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
	    }

	    if (options._scopeId) {
	      this._c = function (a, b, c, d) {
	        var vnode = createElement(contextVm, a, b, c, d, needNormalization);
	        if (vnode && !Array.isArray(vnode)) {
	          vnode.fnScopeId = options._scopeId;
	          vnode.fnContext = parent;
	        }
	        return vnode
	      };
	    } else {
	      this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
	    }
	  }

	  installRenderHelpers(FunctionalRenderContext.prototype);

	  function createFunctionalComponent (
	    Ctor,
	    propsData,
	    data,
	    contextVm,
	    children
	  ) {
	    var options = Ctor.options;
	    var props = {};
	    var propOptions = options.props;
	    if (isDef(propOptions)) {
	      for (var key in propOptions) {
	        props[key] = validateProp(key, propOptions, propsData || emptyObject);
	      }
	    } else {
	      if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
	      if (isDef(data.props)) { mergeProps(props, data.props); }
	    }

	    var renderContext = new FunctionalRenderContext(
	      data,
	      props,
	      children,
	      contextVm,
	      Ctor
	    );

	    var vnode = options.render.call(null, renderContext._c, renderContext);

	    if (vnode instanceof VNode) {
	      return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
	    } else if (Array.isArray(vnode)) {
	      var vnodes = normalizeChildren(vnode) || [];
	      var res = new Array(vnodes.length);
	      for (var i = 0; i < vnodes.length; i++) {
	        res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
	      }
	      return res
	    }
	  }

	  function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
	    // #7817 clone node before setting fnContext, otherwise if the node is reused
	    // (e.g. it was from a cached normal slot) the fnContext causes named slots
	    // that should not be matched to match.
	    var clone = cloneVNode(vnode);
	    clone.fnContext = contextVm;
	    clone.fnOptions = options;
	    {
	      (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
	    }
	    if (data.slot) {
	      (clone.data || (clone.data = {})).slot = data.slot;
	    }
	    return clone
	  }

	  function mergeProps (to, from) {
	    for (var key in from) {
	      to[camelize(key)] = from[key];
	    }
	  }

	  /*  */

	  /*  */

	  /*  */

	  /*  */

	  // inline hooks to be invoked on component VNodes during patch
	  var componentVNodeHooks = {
	    init: function init (vnode, hydrating) {
	      if (
	        vnode.componentInstance &&
	        !vnode.componentInstance._isDestroyed &&
	        vnode.data.keepAlive
	      ) {
	        // kept-alive components, treat as a patch
	        var mountedNode = vnode; // work around flow
	        componentVNodeHooks.prepatch(mountedNode, mountedNode);
	      } else {
	        var child = vnode.componentInstance = createComponentInstanceForVnode(
	          vnode,
	          activeInstance
	        );
	        child.$mount(hydrating ? vnode.elm : undefined, hydrating);
	      }
	    },

	    prepatch: function prepatch (oldVnode, vnode) {
	      var options = vnode.componentOptions;
	      var child = vnode.componentInstance = oldVnode.componentInstance;
	      updateChildComponent(
	        child,
	        options.propsData, // updated props
	        options.listeners, // updated listeners
	        vnode, // new parent vnode
	        options.children // new children
	      );
	    },

	    insert: function insert (vnode) {
	      var context = vnode.context;
	      var componentInstance = vnode.componentInstance;
	      if (!componentInstance._isMounted) {
	        componentInstance._isMounted = true;
	        callHook(componentInstance, 'mounted');
	      }
	      if (vnode.data.keepAlive) {
	        if (context._isMounted) {
	          // vue-router#1212
	          // During updates, a kept-alive component's child components may
	          // change, so directly walking the tree here may call activated hooks
	          // on incorrect children. Instead we push them into a queue which will
	          // be processed after the whole patch process ended.
	          queueActivatedComponent(componentInstance);
	        } else {
	          activateChildComponent(componentInstance, true /* direct */);
	        }
	      }
	    },

	    destroy: function destroy (vnode) {
	      var componentInstance = vnode.componentInstance;
	      if (!componentInstance._isDestroyed) {
	        if (!vnode.data.keepAlive) {
	          componentInstance.$destroy();
	        } else {
	          deactivateChildComponent(componentInstance, true /* direct */);
	        }
	      }
	    }
	  };

	  var hooksToMerge = Object.keys(componentVNodeHooks);

	  function createComponent (
	    Ctor,
	    data,
	    context,
	    children,
	    tag
	  ) {
	    if (isUndef(Ctor)) {
	      return
	    }

	    var baseCtor = context.$options._base;

	    // plain options object: turn it into a constructor
	    if (isObject(Ctor)) {
	      Ctor = baseCtor.extend(Ctor);
	    }

	    // if at this stage it's not a constructor or an async component factory,
	    // reject.
	    if (typeof Ctor !== 'function') {
	      {
	        warn(("Invalid Component definition: " + (String(Ctor))), context);
	      }
	      return
	    }

	    // async component
	    var asyncFactory;
	    if (isUndef(Ctor.cid)) {
	      asyncFactory = Ctor;
	      Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
	      if (Ctor === undefined) {
	        // return a placeholder node for async component, which is rendered
	        // as a comment node but preserves all the raw information for the node.
	        // the information will be used for async server-rendering and hydration.
	        return createAsyncPlaceholder(
	          asyncFactory,
	          data,
	          context,
	          children,
	          tag
	        )
	      }
	    }

	    data = data || {};

	    // resolve constructor options in case global mixins are applied after
	    // component constructor creation
	    resolveConstructorOptions(Ctor);

	    // transform component v-model data into props & events
	    if (isDef(data.model)) {
	      transformModel(Ctor.options, data);
	    }

	    // extract props
	    var propsData = extractPropsFromVNodeData(data, Ctor, tag);

	    // functional component
	    if (isTrue(Ctor.options.functional)) {
	      return createFunctionalComponent(Ctor, propsData, data, context, children)
	    }

	    // extract listeners, since these needs to be treated as
	    // child component listeners instead of DOM listeners
	    var listeners = data.on;
	    // replace with listeners with .native modifier
	    // so it gets processed during parent component patch.
	    data.on = data.nativeOn;

	    if (isTrue(Ctor.options.abstract)) {
	      // abstract components do not keep anything
	      // other than props & listeners & slot

	      // work around flow
	      var slot = data.slot;
	      data = {};
	      if (slot) {
	        data.slot = slot;
	      }
	    }

	    // install component management hooks onto the placeholder node
	    installComponentHooks(data);

	    // return a placeholder vnode
	    var name = Ctor.options.name || tag;
	    var vnode = new VNode(
	      ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
	      data, undefined, undefined, undefined, context,
	      { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
	      asyncFactory
	    );

	    return vnode
	  }

	  function createComponentInstanceForVnode (
	    vnode, // we know it's MountedComponentVNode but flow doesn't
	    parent // activeInstance in lifecycle state
	  ) {
	    var options = {
	      _isComponent: true,
	      _parentVnode: vnode,
	      parent: parent
	    };
	    // check inline-template render functions
	    var inlineTemplate = vnode.data.inlineTemplate;
	    if (isDef(inlineTemplate)) {
	      options.render = inlineTemplate.render;
	      options.staticRenderFns = inlineTemplate.staticRenderFns;
	    }
	    return new vnode.componentOptions.Ctor(options)
	  }

	  function installComponentHooks (data) {
	    var hooks = data.hook || (data.hook = {});
	    for (var i = 0; i < hooksToMerge.length; i++) {
	      var key = hooksToMerge[i];
	      var existing = hooks[key];
	      var toMerge = componentVNodeHooks[key];
	      if (existing !== toMerge && !(existing && existing._merged)) {
	        hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
	      }
	    }
	  }

	  function mergeHook$1 (f1, f2) {
	    var merged = function (a, b) {
	      // flow complains about extra args which is why we use any
	      f1(a, b);
	      f2(a, b);
	    };
	    merged._merged = true;
	    return merged
	  }

	  // transform component v-model info (value and callback) into
	  // prop and event handler respectively.
	  function transformModel (options, data) {
	    var prop = (options.model && options.model.prop) || 'value';
	    var event = (options.model && options.model.event) || 'input'
	    ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
	    var on = data.on || (data.on = {});
	    var existing = on[event];
	    var callback = data.model.callback;
	    if (isDef(existing)) {
	      if (
	        Array.isArray(existing)
	          ? existing.indexOf(callback) === -1
	          : existing !== callback
	      ) {
	        on[event] = [callback].concat(existing);
	      }
	    } else {
	      on[event] = callback;
	    }
	  }

	  /*  */

	  var SIMPLE_NORMALIZE = 1;
	  var ALWAYS_NORMALIZE = 2;

	  // wrapper function for providing a more flexible interface
	  // without getting yelled at by flow
	  function createElement (
	    context,
	    tag,
	    data,
	    children,
	    normalizationType,
	    alwaysNormalize
	  ) {
	    if (Array.isArray(data) || isPrimitive(data)) {
	      normalizationType = children;
	      children = data;
	      data = undefined;
	    }
	    if (isTrue(alwaysNormalize)) {
	      normalizationType = ALWAYS_NORMALIZE;
	    }
	    return _createElement(context, tag, data, children, normalizationType)
	  }

	  function _createElement (
	    context,
	    tag,
	    data,
	    children,
	    normalizationType
	  ) {
	    if (isDef(data) && isDef((data).__ob__)) {
	      warn(
	        "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
	        'Always create fresh vnode data objects in each render!',
	        context
	      );
	      return createEmptyVNode()
	    }
	    // object syntax in v-bind
	    if (isDef(data) && isDef(data.is)) {
	      tag = data.is;
	    }
	    if (!tag) {
	      // in case of component :is set to falsy value
	      return createEmptyVNode()
	    }
	    // warn against non-primitive key
	    if (isDef(data) && isDef(data.key) && !isPrimitive(data.key)
	    ) {
	      {
	        warn(
	          'Avoid using non-primitive value as key, ' +
	          'use string/number value instead.',
	          context
	        );
	      }
	    }
	    // support single function children as default scoped slot
	    if (Array.isArray(children) &&
	      typeof children[0] === 'function'
	    ) {
	      data = data || {};
	      data.scopedSlots = { default: children[0] };
	      children.length = 0;
	    }
	    if (normalizationType === ALWAYS_NORMALIZE) {
	      children = normalizeChildren(children);
	    } else if (normalizationType === SIMPLE_NORMALIZE) {
	      children = simpleNormalizeChildren(children);
	    }
	    var vnode, ns;
	    if (typeof tag === 'string') {
	      var Ctor;
	      ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
	      if (config.isReservedTag(tag)) {
	        // platform built-in elements
	        if (isDef(data) && isDef(data.nativeOn)) {
	          warn(
	            ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
	            context
	          );
	        }
	        vnode = new VNode(
	          config.parsePlatformTagName(tag), data, children,
	          undefined, undefined, context
	        );
	      } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
	        // component
	        vnode = createComponent(Ctor, data, context, children, tag);
	      } else {
	        // unknown or unlisted namespaced elements
	        // check at runtime because it may get assigned a namespace when its
	        // parent normalizes children
	        vnode = new VNode(
	          tag, data, children,
	          undefined, undefined, context
	        );
	      }
	    } else {
	      // direct component options / constructor
	      vnode = createComponent(tag, data, context, children);
	    }
	    if (Array.isArray(vnode)) {
	      return vnode
	    } else if (isDef(vnode)) {
	      if (isDef(ns)) { applyNS(vnode, ns); }
	      if (isDef(data)) { registerDeepBindings(data); }
	      return vnode
	    } else {
	      return createEmptyVNode()
	    }
	  }

	  function applyNS (vnode, ns, force) {
	    vnode.ns = ns;
	    if (vnode.tag === 'foreignObject') {
	      // use default namespace inside foreignObject
	      ns = undefined;
	      force = true;
	    }
	    if (isDef(vnode.children)) {
	      for (var i = 0, l = vnode.children.length; i < l; i++) {
	        var child = vnode.children[i];
	        if (isDef(child.tag) && (
	          isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
	          applyNS(child, ns, force);
	        }
	      }
	    }
	  }

	  // ref #5318
	  // necessary to ensure parent re-render when deep bindings like :style and
	  // :class are used on slot nodes
	  function registerDeepBindings (data) {
	    if (isObject(data.style)) {
	      traverse(data.style);
	    }
	    if (isObject(data.class)) {
	      traverse(data.class);
	    }
	  }

	  /*  */

	  function initRender (vm) {
	    vm._vnode = null; // the root of the child tree
	    vm._staticTrees = null; // v-once cached trees
	    var options = vm.$options;
	    var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
	    var renderContext = parentVnode && parentVnode.context;
	    vm.$slots = resolveSlots(options._renderChildren, renderContext);
	    vm.$scopedSlots = emptyObject;
	    // bind the createElement fn to this instance
	    // so that we get proper render context inside it.
	    // args order: tag, data, children, normalizationType, alwaysNormalize
	    // internal version is used by render functions compiled from templates
	    vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
	    // normalization is always applied for the public version, used in
	    // user-written render functions.
	    vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

	    // $attrs & $listeners are exposed for easier HOC creation.
	    // they need to be reactive so that HOCs using them are always updated
	    var parentData = parentVnode && parentVnode.data;

	    /* istanbul ignore else */
	    {
	      defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
	        !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
	      }, true);
	      defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
	        !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
	      }, true);
	    }
	  }

	  var currentRenderingInstance = null;

	  function renderMixin (Vue) {
	    // install runtime convenience helpers
	    installRenderHelpers(Vue.prototype);

	    Vue.prototype.$nextTick = function (fn) {
	      return nextTick(fn, this)
	    };

	    Vue.prototype._render = function () {
	      var vm = this;
	      var ref = vm.$options;
	      var render = ref.render;
	      var _parentVnode = ref._parentVnode;

	      if (_parentVnode) {
	        vm.$scopedSlots = normalizeScopedSlots(
	          _parentVnode.data.scopedSlots,
	          vm.$slots,
	          vm.$scopedSlots
	        );
	      }

	      // set parent vnode. this allows render functions to have access
	      // to the data on the placeholder node.
	      vm.$vnode = _parentVnode;
	      // render self
	      var vnode;
	      try {
	        // There's no need to maintain a stack because all render fns are called
	        // separately from one another. Nested component's render fns are called
	        // when parent component is patched.
	        currentRenderingInstance = vm;
	        vnode = render.call(vm._renderProxy, vm.$createElement);
	      } catch (e) {
	        handleError(e, vm, "render");
	        // return error render result,
	        // or previous vnode to prevent render error causing blank component
	        /* istanbul ignore else */
	        if (vm.$options.renderError) {
	          try {
	            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
	          } catch (e) {
	            handleError(e, vm, "renderError");
	            vnode = vm._vnode;
	          }
	        } else {
	          vnode = vm._vnode;
	        }
	      } finally {
	        currentRenderingInstance = null;
	      }
	      // if the returned array contains only a single node, allow it
	      if (Array.isArray(vnode) && vnode.length === 1) {
	        vnode = vnode[0];
	      }
	      // return empty vnode in case the render function errored out
	      if (!(vnode instanceof VNode)) {
	        if (Array.isArray(vnode)) {
	          warn(
	            'Multiple root nodes returned from render function. Render function ' +
	            'should return a single root node.',
	            vm
	          );
	        }
	        vnode = createEmptyVNode();
	      }
	      // set parent
	      vnode.parent = _parentVnode;
	      return vnode
	    };
	  }

	  /*  */

	  function ensureCtor (comp, base) {
	    if (
	      comp.__esModule ||
	      (hasSymbol && comp[Symbol.toStringTag] === 'Module')
	    ) {
	      comp = comp.default;
	    }
	    return isObject(comp)
	      ? base.extend(comp)
	      : comp
	  }

	  function createAsyncPlaceholder (
	    factory,
	    data,
	    context,
	    children,
	    tag
	  ) {
	    var node = createEmptyVNode();
	    node.asyncFactory = factory;
	    node.asyncMeta = { data: data, context: context, children: children, tag: tag };
	    return node
	  }

	  function resolveAsyncComponent (
	    factory,
	    baseCtor
	  ) {
	    if (isTrue(factory.error) && isDef(factory.errorComp)) {
	      return factory.errorComp
	    }

	    if (isDef(factory.resolved)) {
	      return factory.resolved
	    }

	    var owner = currentRenderingInstance;
	    if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
	      // already pending
	      factory.owners.push(owner);
	    }

	    if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
	      return factory.loadingComp
	    }

	    if (owner && !isDef(factory.owners)) {
	      var owners = factory.owners = [owner];
	      var sync = true;
	      var timerLoading = null;
	      var timerTimeout = null

	      ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

	      var forceRender = function (renderCompleted) {
	        for (var i = 0, l = owners.length; i < l; i++) {
	          (owners[i]).$forceUpdate();
	        }

	        if (renderCompleted) {
	          owners.length = 0;
	          if (timerLoading !== null) {
	            clearTimeout(timerLoading);
	            timerLoading = null;
	          }
	          if (timerTimeout !== null) {
	            clearTimeout(timerTimeout);
	            timerTimeout = null;
	          }
	        }
	      };

	      var resolve = once(function (res) {
	        // cache resolved
	        factory.resolved = ensureCtor(res, baseCtor);
	        // invoke callbacks only if this is not a synchronous resolve
	        // (async resolves are shimmed as synchronous during SSR)
	        if (!sync) {
	          forceRender(true);
	        } else {
	          owners.length = 0;
	        }
	      });

	      var reject = once(function (reason) {
	        warn(
	          "Failed to resolve async component: " + (String(factory)) +
	          (reason ? ("\nReason: " + reason) : '')
	        );
	        if (isDef(factory.errorComp)) {
	          factory.error = true;
	          forceRender(true);
	        }
	      });

	      var res = factory(resolve, reject);

	      if (isObject(res)) {
	        if (isPromise(res)) {
	          // () => Promise
	          if (isUndef(factory.resolved)) {
	            res.then(resolve, reject);
	          }
	        } else if (isPromise(res.component)) {
	          res.component.then(resolve, reject);

	          if (isDef(res.error)) {
	            factory.errorComp = ensureCtor(res.error, baseCtor);
	          }

	          if (isDef(res.loading)) {
	            factory.loadingComp = ensureCtor(res.loading, baseCtor);
	            if (res.delay === 0) {
	              factory.loading = true;
	            } else {
	              timerLoading = setTimeout(function () {
	                timerLoading = null;
	                if (isUndef(factory.resolved) && isUndef(factory.error)) {
	                  factory.loading = true;
	                  forceRender(false);
	                }
	              }, res.delay || 200);
	            }
	          }

	          if (isDef(res.timeout)) {
	            timerTimeout = setTimeout(function () {
	              timerTimeout = null;
	              if (isUndef(factory.resolved)) {
	                reject(
	                  "timeout (" + (res.timeout) + "ms)"
	                );
	              }
	            }, res.timeout);
	          }
	        }
	      }

	      sync = false;
	      // return in case resolved synchronously
	      return factory.loading
	        ? factory.loadingComp
	        : factory.resolved
	    }
	  }

	  /*  */

	  function isAsyncPlaceholder (node) {
	    return node.isComment && node.asyncFactory
	  }

	  /*  */

	  function getFirstComponentChild (children) {
	    if (Array.isArray(children)) {
	      for (var i = 0; i < children.length; i++) {
	        var c = children[i];
	        if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
	          return c
	        }
	      }
	    }
	  }

	  /*  */

	  /*  */

	  function initEvents (vm) {
	    vm._events = Object.create(null);
	    vm._hasHookEvent = false;
	    // init parent attached events
	    var listeners = vm.$options._parentListeners;
	    if (listeners) {
	      updateComponentListeners(vm, listeners);
	    }
	  }

	  var target;

	  function add (event, fn) {
	    target.$on(event, fn);
	  }

	  function remove$1 (event, fn) {
	    target.$off(event, fn);
	  }

	  function createOnceHandler (event, fn) {
	    var _target = target;
	    return function onceHandler () {
	      var res = fn.apply(null, arguments);
	      if (res !== null) {
	        _target.$off(event, onceHandler);
	      }
	    }
	  }

	  function updateComponentListeners (
	    vm,
	    listeners,
	    oldListeners
	  ) {
	    target = vm;
	    updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
	    target = undefined;
	  }

	  function eventsMixin (Vue) {
	    var hookRE = /^hook:/;
	    Vue.prototype.$on = function (event, fn) {
	      var vm = this;
	      if (Array.isArray(event)) {
	        for (var i = 0, l = event.length; i < l; i++) {
	          vm.$on(event[i], fn);
	        }
	      } else {
	        (vm._events[event] || (vm._events[event] = [])).push(fn);
	        // optimize hook:event cost by using a boolean flag marked at registration
	        // instead of a hash lookup
	        if (hookRE.test(event)) {
	          vm._hasHookEvent = true;
	        }
	      }
	      return vm
	    };

	    Vue.prototype.$once = function (event, fn) {
	      var vm = this;
	      function on () {
	        vm.$off(event, on);
	        fn.apply(vm, arguments);
	      }
	      on.fn = fn;
	      vm.$on(event, on);
	      return vm
	    };

	    Vue.prototype.$off = function (event, fn) {
	      var vm = this;
	      // all
	      if (!arguments.length) {
	        vm._events = Object.create(null);
	        return vm
	      }
	      // array of events
	      if (Array.isArray(event)) {
	        for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
	          vm.$off(event[i$1], fn);
	        }
	        return vm
	      }
	      // specific event
	      var cbs = vm._events[event];
	      if (!cbs) {
	        return vm
	      }
	      if (!fn) {
	        vm._events[event] = null;
	        return vm
	      }
	      // specific handler
	      var cb;
	      var i = cbs.length;
	      while (i--) {
	        cb = cbs[i];
	        if (cb === fn || cb.fn === fn) {
	          cbs.splice(i, 1);
	          break
	        }
	      }
	      return vm
	    };

	    Vue.prototype.$emit = function (event) {
	      var vm = this;
	      {
	        var lowerCaseEvent = event.toLowerCase();
	        if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
	          tip(
	            "Event \"" + lowerCaseEvent + "\" is emitted in component " +
	            (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
	            "Note that HTML attributes are case-insensitive and you cannot use " +
	            "v-on to listen to camelCase events when using in-DOM templates. " +
	            "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
	          );
	        }
	      }
	      var cbs = vm._events[event];
	      if (cbs) {
	        cbs = cbs.length > 1 ? toArray(cbs) : cbs;
	        var args = toArray(arguments, 1);
	        var info = "event handler for \"" + event + "\"";
	        for (var i = 0, l = cbs.length; i < l; i++) {
	          invokeWithErrorHandling(cbs[i], vm, args, vm, info);
	        }
	      }
	      return vm
	    };
	  }

	  /*  */

	  var activeInstance = null;
	  var isUpdatingChildComponent = false;

	  function setActiveInstance(vm) {
	    var prevActiveInstance = activeInstance;
	    activeInstance = vm;
	    return function () {
	      activeInstance = prevActiveInstance;
	    }
	  }

	  function initLifecycle (vm) {
	    var options = vm.$options;

	    // locate first non-abstract parent
	    var parent = options.parent;
	    if (parent && !options.abstract) {
	      while (parent.$options.abstract && parent.$parent) {
	        parent = parent.$parent;
	      }
	      parent.$children.push(vm);
	    }

	    vm.$parent = parent;
	    vm.$root = parent ? parent.$root : vm;

	    vm.$children = [];
	    vm.$refs = {};

	    vm._watcher = null;
	    vm._inactive = null;
	    vm._directInactive = false;
	    vm._isMounted = false;
	    vm._isDestroyed = false;
	    vm._isBeingDestroyed = false;
	  }

	  function lifecycleMixin (Vue) {
	    Vue.prototype._update = function (vnode, hydrating) {
	      var vm = this;
	      var prevEl = vm.$el;
	      var prevVnode = vm._vnode;
	      var restoreActiveInstance = setActiveInstance(vm);
	      vm._vnode = vnode;
	      // Vue.prototype.__patch__ is injected in entry points
	      // based on the rendering backend used.
	      if (!prevVnode) {
	        // initial render
	        vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
	      } else {
	        // updates
	        vm.$el = vm.__patch__(prevVnode, vnode);
	      }
	      restoreActiveInstance();
	      // update __vue__ reference
	      if (prevEl) {
	        prevEl.__vue__ = null;
	      }
	      if (vm.$el) {
	        vm.$el.__vue__ = vm;
	      }
	      // if parent is an HOC, update its $el as well
	      if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
	        vm.$parent.$el = vm.$el;
	      }
	      // updated hook is called by the scheduler to ensure that children are
	      // updated in a parent's updated hook.
	    };

	    Vue.prototype.$forceUpdate = function () {
	      var vm = this;
	      if (vm._watcher) {
	        vm._watcher.update();
	      }
	    };

	    Vue.prototype.$destroy = function () {
	      var vm = this;
	      if (vm._isBeingDestroyed) {
	        return
	      }
	      callHook(vm, 'beforeDestroy');
	      vm._isBeingDestroyed = true;
	      // remove self from parent
	      var parent = vm.$parent;
	      if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
	        remove(parent.$children, vm);
	      }
	      // teardown watchers
	      if (vm._watcher) {
	        vm._watcher.teardown();
	      }
	      var i = vm._watchers.length;
	      while (i--) {
	        vm._watchers[i].teardown();
	      }
	      // remove reference from data ob
	      // frozen object may not have observer.
	      if (vm._data.__ob__) {
	        vm._data.__ob__.vmCount--;
	      }
	      // call the last hook...
	      vm._isDestroyed = true;
	      // invoke destroy hooks on current rendered tree
	      vm.__patch__(vm._vnode, null);
	      // fire destroyed hook
	      callHook(vm, 'destroyed');
	      // turn off all instance listeners.
	      vm.$off();
	      // remove __vue__ reference
	      if (vm.$el) {
	        vm.$el.__vue__ = null;
	      }
	      // release circular reference (#6759)
	      if (vm.$vnode) {
	        vm.$vnode.parent = null;
	      }
	    };
	  }

	  function mountComponent (
	    vm,
	    el,
	    hydrating
	  ) {
	    vm.$el = el;
	    if (!vm.$options.render) {
	      vm.$options.render = createEmptyVNode;
	      {
	        /* istanbul ignore if */
	        if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
	          vm.$options.el || el) {
	          warn(
	            'You are using the runtime-only build of Vue where the template ' +
	            'compiler is not available. Either pre-compile the templates into ' +
	            'render functions, or use the compiler-included build.',
	            vm
	          );
	        } else {
	          warn(
	            'Failed to mount component: template or render function not defined.',
	            vm
	          );
	        }
	      }
	    }
	    callHook(vm, 'beforeMount');

	    var updateComponent;
	    /* istanbul ignore if */
	    if (config.performance && mark) {
	      updateComponent = function () {
	        var name = vm._name;
	        var id = vm._uid;
	        var startTag = "vue-perf-start:" + id;
	        var endTag = "vue-perf-end:" + id;

	        mark(startTag);
	        var vnode = vm._render();
	        mark(endTag);
	        measure(("vue " + name + " render"), startTag, endTag);

	        mark(startTag);
	        vm._update(vnode, hydrating);
	        mark(endTag);
	        measure(("vue " + name + " patch"), startTag, endTag);
	      };
	    } else {
	      updateComponent = function () {
	        vm._update(vm._render(), hydrating);
	      };
	    }

	    // we set this to vm._watcher inside the watcher's constructor
	    // since the watcher's initial patch may call $forceUpdate (e.g. inside child
	    // component's mounted hook), which relies on vm._watcher being already defined
	    new Watcher(vm, updateComponent, noop, {
	      before: function before () {
	        if (vm._isMounted && !vm._isDestroyed) {
	          callHook(vm, 'beforeUpdate');
	        }
	      }
	    }, true /* isRenderWatcher */);
	    hydrating = false;

	    // manually mounted instance, call mounted on self
	    // mounted is called for render-created child components in its inserted hook
	    if (vm.$vnode == null) {
	      vm._isMounted = true;
	      callHook(vm, 'mounted');
	    }
	    return vm
	  }

	  function updateChildComponent (
	    vm,
	    propsData,
	    listeners,
	    parentVnode,
	    renderChildren
	  ) {
	    {
	      isUpdatingChildComponent = true;
	    }

	    // determine whether component has slot children
	    // we need to do this before overwriting $options._renderChildren.

	    // check if there are dynamic scopedSlots (hand-written or compiled but with
	    // dynamic slot names). Static scoped slots compiled from template has the
	    // "$stable" marker.
	    var newScopedSlots = parentVnode.data.scopedSlots;
	    var oldScopedSlots = vm.$scopedSlots;
	    var hasDynamicScopedSlot = !!(
	      (newScopedSlots && !newScopedSlots.$stable) ||
	      (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
	      (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
	    );

	    // Any static slot children from the parent may have changed during parent's
	    // update. Dynamic scoped slots may also have changed. In such cases, a forced
	    // update is necessary to ensure correctness.
	    var needsForceUpdate = !!(
	      renderChildren ||               // has new static slots
	      vm.$options._renderChildren ||  // has old static slots
	      hasDynamicScopedSlot
	    );

	    vm.$options._parentVnode = parentVnode;
	    vm.$vnode = parentVnode; // update vm's placeholder node without re-render

	    if (vm._vnode) { // update child tree's parent
	      vm._vnode.parent = parentVnode;
	    }
	    vm.$options._renderChildren = renderChildren;

	    // update $attrs and $listeners hash
	    // these are also reactive so they may trigger child update if the child
	    // used them during render
	    vm.$attrs = parentVnode.data.attrs || emptyObject;
	    vm.$listeners = listeners || emptyObject;

	    // update props
	    if (propsData && vm.$options.props) {
	      toggleObserving(false);
	      var props = vm._props;
	      var propKeys = vm.$options._propKeys || [];
	      for (var i = 0; i < propKeys.length; i++) {
	        var key = propKeys[i];
	        var propOptions = vm.$options.props; // wtf flow?
	        props[key] = validateProp(key, propOptions, propsData, vm);
	      }
	      toggleObserving(true);
	      // keep a copy of raw propsData
	      vm.$options.propsData = propsData;
	    }

	    // update listeners
	    listeners = listeners || emptyObject;
	    var oldListeners = vm.$options._parentListeners;
	    vm.$options._parentListeners = listeners;
	    updateComponentListeners(vm, listeners, oldListeners);

	    // resolve slots + force update if has children
	    if (needsForceUpdate) {
	      vm.$slots = resolveSlots(renderChildren, parentVnode.context);
	      vm.$forceUpdate();
	    }

	    {
	      isUpdatingChildComponent = false;
	    }
	  }

	  function isInInactiveTree (vm) {
	    while (vm && (vm = vm.$parent)) {
	      if (vm._inactive) { return true }
	    }
	    return false
	  }

	  function activateChildComponent (vm, direct) {
	    if (direct) {
	      vm._directInactive = false;
	      if (isInInactiveTree(vm)) {
	        return
	      }
	    } else if (vm._directInactive) {
	      return
	    }
	    if (vm._inactive || vm._inactive === null) {
	      vm._inactive = false;
	      for (var i = 0; i < vm.$children.length; i++) {
	        activateChildComponent(vm.$children[i]);
	      }
	      callHook(vm, 'activated');
	    }
	  }

	  function deactivateChildComponent (vm, direct) {
	    if (direct) {
	      vm._directInactive = true;
	      if (isInInactiveTree(vm)) {
	        return
	      }
	    }
	    if (!vm._inactive) {
	      vm._inactive = true;
	      for (var i = 0; i < vm.$children.length; i++) {
	        deactivateChildComponent(vm.$children[i]);
	      }
	      callHook(vm, 'deactivated');
	    }
	  }

	  function callHook (vm, hook) {
	    // #7573 disable dep collection when invoking lifecycle hooks
	    pushTarget();
	    var handlers = vm.$options[hook];
	    var info = hook + " hook";
	    if (handlers) {
	      for (var i = 0, j = handlers.length; i < j; i++) {
	        invokeWithErrorHandling(handlers[i], vm, null, vm, info);
	      }
	    }
	    if (vm._hasHookEvent) {
	      vm.$emit('hook:' + hook);
	    }
	    popTarget();
	  }

	  /*  */

	  var MAX_UPDATE_COUNT = 100;

	  var queue = [];
	  var activatedChildren = [];
	  var has = {};
	  var circular = {};
	  var waiting = false;
	  var flushing = false;
	  var index = 0;

	  /**
	   * Reset the scheduler's state.
	   */
	  function resetSchedulerState () {
	    index = queue.length = activatedChildren.length = 0;
	    has = {};
	    {
	      circular = {};
	    }
	    waiting = flushing = false;
	  }

	  // Async edge case #6566 requires saving the timestamp when event listeners are
	  // attached. However, calling performance.now() has a perf overhead especially
	  // if the page has thousands of event listeners. Instead, we take a timestamp
	  // every time the scheduler flushes and use that for all event listeners
	  // attached during that flush.
	  var currentFlushTimestamp = 0;

	  // Async edge case fix requires storing an event listener's attach timestamp.
	  var getNow = Date.now;

	  // Determine what event timestamp the browser is using. Annoyingly, the
	  // timestamp can either be hi-res (relative to page load) or low-res
	  // (relative to UNIX epoch), so in order to compare time we have to use the
	  // same timestamp type when saving the flush timestamp.
	  // All IE versions use low-res event timestamps, and have problematic clock
	  // implementations (#9632)
	  if (inBrowser && !isIE) {
	    var performance = window.performance;
	    if (
	      performance &&
	      typeof performance.now === 'function' &&
	      getNow() > document.createEvent('Event').timeStamp
	    ) {
	      // if the event timestamp, although evaluated AFTER the Date.now(), is
	      // smaller than it, it means the event is using a hi-res timestamp,
	      // and we need to use the hi-res version for event listener timestamps as
	      // well.
	      getNow = function () { return performance.now(); };
	    }
	  }

	  /**
	   * Flush both queues and run the watchers.
	   */
	  function flushSchedulerQueue () {
	    currentFlushTimestamp = getNow();
	    flushing = true;
	    var watcher, id;

	    // Sort queue before flush.
	    // This ensures that:
	    // 1. Components are updated from parent to child. (because parent is always
	    //    created before the child)
	    // 2. A component's user watchers are run before its render watcher (because
	    //    user watchers are created before the render watcher)
	    // 3. If a component is destroyed during a parent component's watcher run,
	    //    its watchers can be skipped.
	    queue.sort(function (a, b) { return a.id - b.id; });

	    // do not cache length because more watchers might be pushed
	    // as we run existing watchers
	    for (index = 0; index < queue.length; index++) {
	      watcher = queue[index];
	      if (watcher.before) {
	        watcher.before();
	      }
	      id = watcher.id;
	      has[id] = null;
	      watcher.run();
	      // in dev build, check and stop circular updates.
	      if (has[id] != null) {
	        circular[id] = (circular[id] || 0) + 1;
	        if (circular[id] > MAX_UPDATE_COUNT) {
	          warn(
	            'You may have an infinite update loop ' + (
	              watcher.user
	                ? ("in watcher with expression \"" + (watcher.expression) + "\"")
	                : "in a component render function."
	            ),
	            watcher.vm
	          );
	          break
	        }
	      }
	    }

	    // keep copies of post queues before resetting state
	    var activatedQueue = activatedChildren.slice();
	    var updatedQueue = queue.slice();

	    resetSchedulerState();

	    // call component updated and activated hooks
	    callActivatedHooks(activatedQueue);
	    callUpdatedHooks(updatedQueue);

	    // devtool hook
	    /* istanbul ignore if */
	    if (devtools && config.devtools) {
	      devtools.emit('flush');
	    }
	  }

	  function callUpdatedHooks (queue) {
	    var i = queue.length;
	    while (i--) {
	      var watcher = queue[i];
	      var vm = watcher.vm;
	      if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
	        callHook(vm, 'updated');
	      }
	    }
	  }

	  /**
	   * Queue a kept-alive component that was activated during patch.
	   * The queue will be processed after the entire tree has been patched.
	   */
	  function queueActivatedComponent (vm) {
	    // setting _inactive to false here so that a render function can
	    // rely on checking whether it's in an inactive tree (e.g. router-view)
	    vm._inactive = false;
	    activatedChildren.push(vm);
	  }

	  function callActivatedHooks (queue) {
	    for (var i = 0; i < queue.length; i++) {
	      queue[i]._inactive = true;
	      activateChildComponent(queue[i], true /* true */);
	    }
	  }

	  /**
	   * Push a watcher into the watcher queue.
	   * Jobs with duplicate IDs will be skipped unless it's
	   * pushed when the queue is being flushed.
	   */
	  function queueWatcher (watcher) {
	    var id = watcher.id;
	    if (has[id] == null) {
	      has[id] = true;
	      if (!flushing) {
	        queue.push(watcher);
	      } else {
	        // if already flushing, splice the watcher based on its id
	        // if already past its id, it will be run next immediately.
	        var i = queue.length - 1;
	        while (i > index && queue[i].id > watcher.id) {
	          i--;
	        }
	        queue.splice(i + 1, 0, watcher);
	      }
	      // queue the flush
	      if (!waiting) {
	        waiting = true;

	        if (!config.async) {
	          flushSchedulerQueue();
	          return
	        }
	        nextTick(flushSchedulerQueue);
	      }
	    }
	  }

	  /*  */



	  var uid$2 = 0;

	  /**
	   * A watcher parses an expression, collects dependencies,
	   * and fires callback when the expression value changes.
	   * This is used for both the $watch() api and directives.
	   */
	  var Watcher = function Watcher (
	    vm,
	    expOrFn,
	    cb,
	    options,
	    isRenderWatcher
	  ) {
	    this.vm = vm;
	    if (isRenderWatcher) {
	      vm._watcher = this;
	    }
	    vm._watchers.push(this);
	    // options
	    if (options) {
	      this.deep = !!options.deep;
	      this.user = !!options.user;
	      this.lazy = !!options.lazy;
	      this.sync = !!options.sync;
	      this.before = options.before;
	    } else {
	      this.deep = this.user = this.lazy = this.sync = false;
	    }
	    this.cb = cb;
	    this.id = ++uid$2; // uid for batching
	    this.active = true;
	    this.dirty = this.lazy; // for lazy watchers
	    this.deps = [];
	    this.newDeps = [];
	    this.depIds = new _Set();
	    this.newDepIds = new _Set();
	    this.expression = expOrFn.toString();
	    // parse expression for getter
	    if (typeof expOrFn === 'function') {
	      this.getter = expOrFn;
	    } else {
	      this.getter = parsePath(expOrFn);
	      if (!this.getter) {
	        this.getter = noop;
	        warn(
	          "Failed watching path: \"" + expOrFn + "\" " +
	          'Watcher only accepts simple dot-delimited paths. ' +
	          'For full control, use a function instead.',
	          vm
	        );
	      }
	    }
	    this.value = this.lazy
	      ? undefined
	      : this.get();
	  };

	  /**
	   * Evaluate the getter, and re-collect dependencies.
	   */
	  Watcher.prototype.get = function get () {
	    pushTarget(this);
	    var value;
	    var vm = this.vm;
	    try {
	      value = this.getter.call(vm, vm);
	    } catch (e) {
	      if (this.user) {
	        handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
	      } else {
	        throw e
	      }
	    } finally {
	      // "touch" every property so they are all tracked as
	      // dependencies for deep watching
	      if (this.deep) {
	        traverse(value);
	      }
	      popTarget();
	      this.cleanupDeps();
	    }
	    return value
	  };

	  /**
	   * Add a dependency to this directive.
	   */
	  Watcher.prototype.addDep = function addDep (dep) {
	    var id = dep.id;
	    if (!this.newDepIds.has(id)) {
	      this.newDepIds.add(id);
	      this.newDeps.push(dep);
	      if (!this.depIds.has(id)) {
	        dep.addSub(this);
	      }
	    }
	  };

	  /**
	   * Clean up for dependency collection.
	   */
	  Watcher.prototype.cleanupDeps = function cleanupDeps () {
	    var i = this.deps.length;
	    while (i--) {
	      var dep = this.deps[i];
	      if (!this.newDepIds.has(dep.id)) {
	        dep.removeSub(this);
	      }
	    }
	    var tmp = this.depIds;
	    this.depIds = this.newDepIds;
	    this.newDepIds = tmp;
	    this.newDepIds.clear();
	    tmp = this.deps;
	    this.deps = this.newDeps;
	    this.newDeps = tmp;
	    this.newDeps.length = 0;
	  };

	  /**
	   * Subscriber interface.
	   * Will be called when a dependency changes.
	   */
	  Watcher.prototype.update = function update () {
	    /* istanbul ignore else */
	    if (this.lazy) {
	      this.dirty = true;
	    } else if (this.sync) {
	      this.run();
	    } else {
	      queueWatcher(this);
	    }
	  };

	  /**
	   * Scheduler job interface.
	   * Will be called by the scheduler.
	   */
	  Watcher.prototype.run = function run () {
	    if (this.active) {
	      var value = this.get();
	      if (
	        value !== this.value ||
	        // Deep watchers and watchers on Object/Arrays should fire even
	        // when the value is the same, because the value may
	        // have mutated.
	        isObject(value) ||
	        this.deep
	      ) {
	        // set new value
	        var oldValue = this.value;
	        this.value = value;
	        if (this.user) {
	          try {
	            this.cb.call(this.vm, value, oldValue);
	          } catch (e) {
	            handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
	          }
	        } else {
	          this.cb.call(this.vm, value, oldValue);
	        }
	      }
	    }
	  };

	  /**
	   * Evaluate the value of the watcher.
	   * This only gets called for lazy watchers.
	   */
	  Watcher.prototype.evaluate = function evaluate () {
	    this.value = this.get();
	    this.dirty = false;
	  };

	  /**
	   * Depend on all deps collected by this watcher.
	   */
	  Watcher.prototype.depend = function depend () {
	    var i = this.deps.length;
	    while (i--) {
	      this.deps[i].depend();
	    }
	  };

	  /**
	   * Remove self from all dependencies' subscriber list.
	   */
	  Watcher.prototype.teardown = function teardown () {
	    if (this.active) {
	      // remove self from vm's watcher list
	      // this is a somewhat expensive operation so we skip it
	      // if the vm is being destroyed.
	      if (!this.vm._isBeingDestroyed) {
	        remove(this.vm._watchers, this);
	      }
	      var i = this.deps.length;
	      while (i--) {
	        this.deps[i].removeSub(this);
	      }
	      this.active = false;
	    }
	  };

	  /*  */

	  var sharedPropertyDefinition = {
	    enumerable: true,
	    configurable: true,
	    get: noop,
	    set: noop
	  };

	  function proxy (target, sourceKey, key) {
	    sharedPropertyDefinition.get = function proxyGetter () {
	      return this[sourceKey][key]
	    };
	    sharedPropertyDefinition.set = function proxySetter (val) {
	      this[sourceKey][key] = val;
	    };
	    Object.defineProperty(target, key, sharedPropertyDefinition);
	  }

	  function initState (vm) {
	    vm._watchers = [];
	    var opts = vm.$options;
	    if (opts.props) { initProps(vm, opts.props); }
	    if (opts.methods) { initMethods(vm, opts.methods); }
	    if (opts.data) {
	      initData(vm);
	    } else {
	      observe(vm._data = {}, true /* asRootData */);
	    }
	    if (opts.computed) { initComputed(vm, opts.computed); }
	    if (opts.watch && opts.watch !== nativeWatch) {
	      initWatch(vm, opts.watch);
	    }
	  }

	  function initProps (vm, propsOptions) {
	    var propsData = vm.$options.propsData || {};
	    var props = vm._props = {};
	    // cache prop keys so that future props updates can iterate using Array
	    // instead of dynamic object key enumeration.
	    var keys = vm.$options._propKeys = [];
	    var isRoot = !vm.$parent;
	    // root instance props should be converted
	    if (!isRoot) {
	      toggleObserving(false);
	    }
	    var loop = function ( key ) {
	      keys.push(key);
	      var value = validateProp(key, propsOptions, propsData, vm);
	      /* istanbul ignore else */
	      {
	        var hyphenatedKey = hyphenate(key);
	        if (isReservedAttribute(hyphenatedKey) ||
	            config.isReservedAttr(hyphenatedKey)) {
	          warn(
	            ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
	            vm
	          );
	        }
	        defineReactive$$1(props, key, value, function () {
	          if (!isRoot && !isUpdatingChildComponent) {
	            warn(
	              "Avoid mutating a prop directly since the value will be " +
	              "overwritten whenever the parent component re-renders. " +
	              "Instead, use a data or computed property based on the prop's " +
	              "value. Prop being mutated: \"" + key + "\"",
	              vm
	            );
	          }
	        });
	      }
	      // static props are already proxied on the component's prototype
	      // during Vue.extend(). We only need to proxy props defined at
	      // instantiation here.
	      if (!(key in vm)) {
	        proxy(vm, "_props", key);
	      }
	    };

	    for (var key in propsOptions) loop( key );
	    toggleObserving(true);
	  }

	  function initData (vm) {
	    var data = vm.$options.data;
	    data = vm._data = typeof data === 'function'
	      ? getData(data, vm)
	      : data || {};
	    if (!isPlainObject(data)) {
	      data = {};
	      warn(
	        'data functions should return an object:\n' +
	        'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
	        vm
	      );
	    }
	    // proxy data on instance
	    var keys = Object.keys(data);
	    var props = vm.$options.props;
	    var methods = vm.$options.methods;
	    var i = keys.length;
	    while (i--) {
	      var key = keys[i];
	      {
	        if (methods && hasOwn(methods, key)) {
	          warn(
	            ("Method \"" + key + "\" has already been defined as a data property."),
	            vm
	          );
	        }
	      }
	      if (props && hasOwn(props, key)) {
	        warn(
	          "The data property \"" + key + "\" is already declared as a prop. " +
	          "Use prop default value instead.",
	          vm
	        );
	      } else if (!isReserved(key)) {
	        proxy(vm, "_data", key);
	      }
	    }
	    // observe data
	    observe(data, true /* asRootData */);
	  }

	  function getData (data, vm) {
	    // #7573 disable dep collection when invoking data getters
	    pushTarget();
	    try {
	      return data.call(vm, vm)
	    } catch (e) {
	      handleError(e, vm, "data()");
	      return {}
	    } finally {
	      popTarget();
	    }
	  }

	  var computedWatcherOptions = { lazy: true };

	  function initComputed (vm, computed) {
	    // $flow-disable-line
	    var watchers = vm._computedWatchers = Object.create(null);
	    // computed properties are just getters during SSR
	    var isSSR = isServerRendering();

	    for (var key in computed) {
	      var userDef = computed[key];
	      var getter = typeof userDef === 'function' ? userDef : userDef.get;
	      if (getter == null) {
	        warn(
	          ("Getter is missing for computed property \"" + key + "\"."),
	          vm
	        );
	      }

	      if (!isSSR) {
	        // create internal watcher for the computed property.
	        watchers[key] = new Watcher(
	          vm,
	          getter || noop,
	          noop,
	          computedWatcherOptions
	        );
	      }

	      // component-defined computed properties are already defined on the
	      // component prototype. We only need to define computed properties defined
	      // at instantiation here.
	      if (!(key in vm)) {
	        defineComputed(vm, key, userDef);
	      } else {
	        if (key in vm.$data) {
	          warn(("The computed property \"" + key + "\" is already defined in data."), vm);
	        } else if (vm.$options.props && key in vm.$options.props) {
	          warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
	        }
	      }
	    }
	  }

	  function defineComputed (
	    target,
	    key,
	    userDef
	  ) {
	    var shouldCache = !isServerRendering();
	    if (typeof userDef === 'function') {
	      sharedPropertyDefinition.get = shouldCache
	        ? createComputedGetter(key)
	        : createGetterInvoker(userDef);
	      sharedPropertyDefinition.set = noop;
	    } else {
	      sharedPropertyDefinition.get = userDef.get
	        ? shouldCache && userDef.cache !== false
	          ? createComputedGetter(key)
	          : createGetterInvoker(userDef.get)
	        : noop;
	      sharedPropertyDefinition.set = userDef.set || noop;
	    }
	    if (sharedPropertyDefinition.set === noop) {
	      sharedPropertyDefinition.set = function () {
	        warn(
	          ("Computed property \"" + key + "\" was assigned to but it has no setter."),
	          this
	        );
	      };
	    }
	    Object.defineProperty(target, key, sharedPropertyDefinition);
	  }

	  function createComputedGetter (key) {
	    return function computedGetter () {
	      var watcher = this._computedWatchers && this._computedWatchers[key];
	      if (watcher) {
	        if (watcher.dirty) {
	          watcher.evaluate();
	        }
	        if (Dep.target) {
	          watcher.depend();
	        }
	        return watcher.value
	      }
	    }
	  }

	  function createGetterInvoker(fn) {
	    return function computedGetter () {
	      return fn.call(this, this)
	    }
	  }

	  function initMethods (vm, methods) {
	    var props = vm.$options.props;
	    for (var key in methods) {
	      {
	        if (typeof methods[key] !== 'function') {
	          warn(
	            "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
	            "Did you reference the function correctly?",
	            vm
	          );
	        }
	        if (props && hasOwn(props, key)) {
	          warn(
	            ("Method \"" + key + "\" has already been defined as a prop."),
	            vm
	          );
	        }
	        if ((key in vm) && isReserved(key)) {
	          warn(
	            "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
	            "Avoid defining component methods that start with _ or $."
	          );
	        }
	      }
	      vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
	    }
	  }

	  function initWatch (vm, watch) {
	    for (var key in watch) {
	      var handler = watch[key];
	      if (Array.isArray(handler)) {
	        for (var i = 0; i < handler.length; i++) {
	          createWatcher(vm, key, handler[i]);
	        }
	      } else {
	        createWatcher(vm, key, handler);
	      }
	    }
	  }

	  function createWatcher (
	    vm,
	    expOrFn,
	    handler,
	    options
	  ) {
	    if (isPlainObject(handler)) {
	      options = handler;
	      handler = handler.handler;
	    }
	    if (typeof handler === 'string') {
	      handler = vm[handler];
	    }
	    return vm.$watch(expOrFn, handler, options)
	  }

	  function stateMixin (Vue) {
	    // flow somehow has problems with directly declared definition object
	    // when using Object.defineProperty, so we have to procedurally build up
	    // the object here.
	    var dataDef = {};
	    dataDef.get = function () { return this._data };
	    var propsDef = {};
	    propsDef.get = function () { return this._props };
	    {
	      dataDef.set = function () {
	        warn(
	          'Avoid replacing instance root $data. ' +
	          'Use nested data properties instead.',
	          this
	        );
	      };
	      propsDef.set = function () {
	        warn("$props is readonly.", this);
	      };
	    }
	    Object.defineProperty(Vue.prototype, '$data', dataDef);
	    Object.defineProperty(Vue.prototype, '$props', propsDef);

	    Vue.prototype.$set = set;
	    Vue.prototype.$delete = del;

	    Vue.prototype.$watch = function (
	      expOrFn,
	      cb,
	      options
	    ) {
	      var vm = this;
	      if (isPlainObject(cb)) {
	        return createWatcher(vm, expOrFn, cb, options)
	      }
	      options = options || {};
	      options.user = true;
	      var watcher = new Watcher(vm, expOrFn, cb, options);
	      if (options.immediate) {
	        try {
	          cb.call(vm, watcher.value);
	        } catch (error) {
	          handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
	        }
	      }
	      return function unwatchFn () {
	        watcher.teardown();
	      }
	    };
	  }

	  /*  */

	  var uid$3 = 0;

	  function initMixin (Vue) {
	    Vue.prototype._init = function (options) {
	      var vm = this;
	      // a uid
	      vm._uid = uid$3++;

	      var startTag, endTag;
	      /* istanbul ignore if */
	      if (config.performance && mark) {
	        startTag = "vue-perf-start:" + (vm._uid);
	        endTag = "vue-perf-end:" + (vm._uid);
	        mark(startTag);
	      }

	      // a flag to avoid this being observed
	      vm._isVue = true;
	      // merge options
	      if (options && options._isComponent) {
	        // optimize internal component instantiation
	        // since dynamic options merging is pretty slow, and none of the
	        // internal component options needs special treatment.
	        initInternalComponent(vm, options);
	      } else {
	        vm.$options = mergeOptions(
	          resolveConstructorOptions(vm.constructor),
	          options || {},
	          vm
	        );
	      }
	      /* istanbul ignore else */
	      {
	        initProxy(vm);
	      }
	      // expose real self
	      vm._self = vm;
	      initLifecycle(vm);
	      initEvents(vm);
	      initRender(vm);
	      callHook(vm, 'beforeCreate');
	      initInjections(vm); // resolve injections before data/props
	      initState(vm);
	      initProvide(vm); // resolve provide after data/props
	      callHook(vm, 'created');

	      /* istanbul ignore if */
	      if (config.performance && mark) {
	        vm._name = formatComponentName(vm, false);
	        mark(endTag);
	        measure(("vue " + (vm._name) + " init"), startTag, endTag);
	      }

	      if (vm.$options.el) {
	        vm.$mount(vm.$options.el);
	      }
	    };
	  }

	  function initInternalComponent (vm, options) {
	    var opts = vm.$options = Object.create(vm.constructor.options);
	    // doing this because it's faster than dynamic enumeration.
	    var parentVnode = options._parentVnode;
	    opts.parent = options.parent;
	    opts._parentVnode = parentVnode;

	    var vnodeComponentOptions = parentVnode.componentOptions;
	    opts.propsData = vnodeComponentOptions.propsData;
	    opts._parentListeners = vnodeComponentOptions.listeners;
	    opts._renderChildren = vnodeComponentOptions.children;
	    opts._componentTag = vnodeComponentOptions.tag;

	    if (options.render) {
	      opts.render = options.render;
	      opts.staticRenderFns = options.staticRenderFns;
	    }
	  }

	  function resolveConstructorOptions (Ctor) {
	    var options = Ctor.options;
	    if (Ctor.super) {
	      var superOptions = resolveConstructorOptions(Ctor.super);
	      var cachedSuperOptions = Ctor.superOptions;
	      if (superOptions !== cachedSuperOptions) {
	        // super option changed,
	        // need to resolve new options.
	        Ctor.superOptions = superOptions;
	        // check if there are any late-modified/attached options (#4976)
	        var modifiedOptions = resolveModifiedOptions(Ctor);
	        // update base extend options
	        if (modifiedOptions) {
	          extend(Ctor.extendOptions, modifiedOptions);
	        }
	        options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
	        if (options.name) {
	          options.components[options.name] = Ctor;
	        }
	      }
	    }
	    return options
	  }

	  function resolveModifiedOptions (Ctor) {
	    var modified;
	    var latest = Ctor.options;
	    var sealed = Ctor.sealedOptions;
	    for (var key in latest) {
	      if (latest[key] !== sealed[key]) {
	        if (!modified) { modified = {}; }
	        modified[key] = latest[key];
	      }
	    }
	    return modified
	  }

	  function Vue (options) {
	    if (!(this instanceof Vue)
	    ) {
	      warn('Vue is a constructor and should be called with the `new` keyword');
	    }
	    this._init(options);
	  }

	  initMixin(Vue);
	  stateMixin(Vue);
	  eventsMixin(Vue);
	  lifecycleMixin(Vue);
	  renderMixin(Vue);

	  /*  */

	  function initUse (Vue) {
	    Vue.use = function (plugin) {
	      var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
	      if (installedPlugins.indexOf(plugin) > -1) {
	        return this
	      }

	      // additional parameters
	      var args = toArray(arguments, 1);
	      args.unshift(this);
	      if (typeof plugin.install === 'function') {
	        plugin.install.apply(plugin, args);
	      } else if (typeof plugin === 'function') {
	        plugin.apply(null, args);
	      }
	      installedPlugins.push(plugin);
	      return this
	    };
	  }

	  /*  */

	  function initMixin$1 (Vue) {
	    Vue.mixin = function (mixin) {
	      this.options = mergeOptions(this.options, mixin);
	      return this
	    };
	  }

	  /*  */

	  function initExtend (Vue) {
	    /**
	     * Each instance constructor, including Vue, has a unique
	     * cid. This enables us to create wrapped "child
	     * constructors" for prototypal inheritance and cache them.
	     */
	    Vue.cid = 0;
	    var cid = 1;

	    /**
	     * Class inheritance
	     */
	    Vue.extend = function (extendOptions) {
	      extendOptions = extendOptions || {};
	      var Super = this;
	      var SuperId = Super.cid;
	      var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
	      if (cachedCtors[SuperId]) {
	        return cachedCtors[SuperId]
	      }

	      var name = extendOptions.name || Super.options.name;
	      if (name) {
	        validateComponentName(name);
	      }

	      var Sub = function VueComponent (options) {
	        this._init(options);
	      };
	      Sub.prototype = Object.create(Super.prototype);
	      Sub.prototype.constructor = Sub;
	      Sub.cid = cid++;
	      Sub.options = mergeOptions(
	        Super.options,
	        extendOptions
	      );
	      Sub['super'] = Super;

	      // For props and computed properties, we define the proxy getters on
	      // the Vue instances at extension time, on the extended prototype. This
	      // avoids Object.defineProperty calls for each instance created.
	      if (Sub.options.props) {
	        initProps$1(Sub);
	      }
	      if (Sub.options.computed) {
	        initComputed$1(Sub);
	      }

	      // allow further extension/mixin/plugin usage
	      Sub.extend = Super.extend;
	      Sub.mixin = Super.mixin;
	      Sub.use = Super.use;

	      // create asset registers, so extended classes
	      // can have their private assets too.
	      ASSET_TYPES.forEach(function (type) {
	        Sub[type] = Super[type];
	      });
	      // enable recursive self-lookup
	      if (name) {
	        Sub.options.components[name] = Sub;
	      }

	      // keep a reference to the super options at extension time.
	      // later at instantiation we can check if Super's options have
	      // been updated.
	      Sub.superOptions = Super.options;
	      Sub.extendOptions = extendOptions;
	      Sub.sealedOptions = extend({}, Sub.options);

	      // cache constructor
	      cachedCtors[SuperId] = Sub;
	      return Sub
	    };
	  }

	  function initProps$1 (Comp) {
	    var props = Comp.options.props;
	    for (var key in props) {
	      proxy(Comp.prototype, "_props", key);
	    }
	  }

	  function initComputed$1 (Comp) {
	    var computed = Comp.options.computed;
	    for (var key in computed) {
	      defineComputed(Comp.prototype, key, computed[key]);
	    }
	  }

	  /*  */

	  function initAssetRegisters (Vue) {
	    /**
	     * Create asset registration methods.
	     */
	    ASSET_TYPES.forEach(function (type) {
	      Vue[type] = function (
	        id,
	        definition
	      ) {
	        if (!definition) {
	          return this.options[type + 's'][id]
	        } else {
	          /* istanbul ignore if */
	          if (type === 'component') {
	            validateComponentName(id);
	          }
	          if (type === 'component' && isPlainObject(definition)) {
	            definition.name = definition.name || id;
	            definition = this.options._base.extend(definition);
	          }
	          if (type === 'directive' && typeof definition === 'function') {
	            definition = { bind: definition, update: definition };
	          }
	          this.options[type + 's'][id] = definition;
	          return definition
	        }
	      };
	    });
	  }

	  /*  */



	  function getComponentName (opts) {
	    return opts && (opts.Ctor.options.name || opts.tag)
	  }

	  function matches (pattern, name) {
	    if (Array.isArray(pattern)) {
	      return pattern.indexOf(name) > -1
	    } else if (typeof pattern === 'string') {
	      return pattern.split(',').indexOf(name) > -1
	    } else if (isRegExp(pattern)) {
	      return pattern.test(name)
	    }
	    /* istanbul ignore next */
	    return false
	  }

	  function pruneCache (keepAliveInstance, filter) {
	    var cache = keepAliveInstance.cache;
	    var keys = keepAliveInstance.keys;
	    var _vnode = keepAliveInstance._vnode;
	    for (var key in cache) {
	      var cachedNode = cache[key];
	      if (cachedNode) {
	        var name = getComponentName(cachedNode.componentOptions);
	        if (name && !filter(name)) {
	          pruneCacheEntry(cache, key, keys, _vnode);
	        }
	      }
	    }
	  }

	  function pruneCacheEntry (
	    cache,
	    key,
	    keys,
	    current
	  ) {
	    var cached$$1 = cache[key];
	    if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
	      cached$$1.componentInstance.$destroy();
	    }
	    cache[key] = null;
	    remove(keys, key);
	  }

	  var patternTypes = [String, RegExp, Array];

	  var KeepAlive = {
	    name: 'keep-alive',
	    abstract: true,

	    props: {
	      include: patternTypes,
	      exclude: patternTypes,
	      max: [String, Number]
	    },

	    created: function created () {
	      this.cache = Object.create(null);
	      this.keys = [];
	    },

	    destroyed: function destroyed () {
	      for (var key in this.cache) {
	        pruneCacheEntry(this.cache, key, this.keys);
	      }
	    },

	    mounted: function mounted () {
	      var this$1 = this;

	      this.$watch('include', function (val) {
	        pruneCache(this$1, function (name) { return matches(val, name); });
	      });
	      this.$watch('exclude', function (val) {
	        pruneCache(this$1, function (name) { return !matches(val, name); });
	      });
	    },

	    render: function render () {
	      var slot = this.$slots.default;
	      var vnode = getFirstComponentChild(slot);
	      var componentOptions = vnode && vnode.componentOptions;
	      if (componentOptions) {
	        // check pattern
	        var name = getComponentName(componentOptions);
	        var ref = this;
	        var include = ref.include;
	        var exclude = ref.exclude;
	        if (
	          // not included
	          (include && (!name || !matches(include, name))) ||
	          // excluded
	          (exclude && name && matches(exclude, name))
	        ) {
	          return vnode
	        }

	        var ref$1 = this;
	        var cache = ref$1.cache;
	        var keys = ref$1.keys;
	        var key = vnode.key == null
	          // same constructor may get registered as different local components
	          // so cid alone is not enough (#3269)
	          ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
	          : vnode.key;
	        if (cache[key]) {
	          vnode.componentInstance = cache[key].componentInstance;
	          // make current key freshest
	          remove(keys, key);
	          keys.push(key);
	        } else {
	          cache[key] = vnode;
	          keys.push(key);
	          // prune oldest entry
	          if (this.max && keys.length > parseInt(this.max)) {
	            pruneCacheEntry(cache, keys[0], keys, this._vnode);
	          }
	        }

	        vnode.data.keepAlive = true;
	      }
	      return vnode || (slot && slot[0])
	    }
	  };

	  var builtInComponents = {
	    KeepAlive: KeepAlive
	  };

	  /*  */

	  function initGlobalAPI (Vue) {
	    // config
	    var configDef = {};
	    configDef.get = function () { return config; };
	    {
	      configDef.set = function () {
	        warn(
	          'Do not replace the Vue.config object, set individual fields instead.'
	        );
	      };
	    }
	    Object.defineProperty(Vue, 'config', configDef);

	    // exposed util methods.
	    // NOTE: these are not considered part of the public API - avoid relying on
	    // them unless you are aware of the risk.
	    Vue.util = {
	      warn: warn,
	      extend: extend,
	      mergeOptions: mergeOptions,
	      defineReactive: defineReactive$$1
	    };

	    Vue.set = set;
	    Vue.delete = del;
	    Vue.nextTick = nextTick;

	    // 2.6 explicit observable API
	    Vue.observable = function (obj) {
	      observe(obj);
	      return obj
	    };

	    Vue.options = Object.create(null);
	    ASSET_TYPES.forEach(function (type) {
	      Vue.options[type + 's'] = Object.create(null);
	    });

	    // this is used to identify the "base" constructor to extend all plain-object
	    // components with in Weex's multi-instance scenarios.
	    Vue.options._base = Vue;

	    extend(Vue.options.components, builtInComponents);

	    initUse(Vue);
	    initMixin$1(Vue);
	    initExtend(Vue);
	    initAssetRegisters(Vue);
	  }

	  initGlobalAPI(Vue);

	  Object.defineProperty(Vue.prototype, '$isServer', {
	    get: isServerRendering
	  });

	  Object.defineProperty(Vue.prototype, '$ssrContext', {
	    get: function get () {
	      /* istanbul ignore next */
	      return this.$vnode && this.$vnode.ssrContext
	    }
	  });

	  // expose FunctionalRenderContext for ssr runtime helper installation
	  Object.defineProperty(Vue, 'FunctionalRenderContext', {
	    value: FunctionalRenderContext
	  });

	  Vue.version = '2.6.11';

	  /*  */

	  // these are reserved for web because they are directly compiled away
	  // during template compilation
	  var isReservedAttr = makeMap('style,class');

	  // attributes that should be using props for binding
	  var acceptValue = makeMap('input,textarea,option,select,progress');
	  var mustUseProp = function (tag, type, attr) {
	    return (
	      (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
	      (attr === 'selected' && tag === 'option') ||
	      (attr === 'checked' && tag === 'input') ||
	      (attr === 'muted' && tag === 'video')
	    )
	  };

	  var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

	  var isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');

	  var convertEnumeratedValue = function (key, value) {
	    return isFalsyAttrValue(value) || value === 'false'
	      ? 'false'
	      // allow arbitrary string value for contenteditable
	      : key === 'contenteditable' && isValidContentEditableValue(value)
	        ? value
	        : 'true'
	  };

	  var isBooleanAttr = makeMap(
	    'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
	    'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
	    'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
	    'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
	    'required,reversed,scoped,seamless,selected,sortable,translate,' +
	    'truespeed,typemustmatch,visible'
	  );

	  var xlinkNS = 'http://www.w3.org/1999/xlink';

	  var isXlink = function (name) {
	    return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
	  };

	  var getXlinkProp = function (name) {
	    return isXlink(name) ? name.slice(6, name.length) : ''
	  };

	  var isFalsyAttrValue = function (val) {
	    return val == null || val === false
	  };

	  /*  */

	  function genClassForVnode (vnode) {
	    var data = vnode.data;
	    var parentNode = vnode;
	    var childNode = vnode;
	    while (isDef(childNode.componentInstance)) {
	      childNode = childNode.componentInstance._vnode;
	      if (childNode && childNode.data) {
	        data = mergeClassData(childNode.data, data);
	      }
	    }
	    while (isDef(parentNode = parentNode.parent)) {
	      if (parentNode && parentNode.data) {
	        data = mergeClassData(data, parentNode.data);
	      }
	    }
	    return renderClass(data.staticClass, data.class)
	  }

	  function mergeClassData (child, parent) {
	    return {
	      staticClass: concat(child.staticClass, parent.staticClass),
	      class: isDef(child.class)
	        ? [child.class, parent.class]
	        : parent.class
	    }
	  }

	  function renderClass (
	    staticClass,
	    dynamicClass
	  ) {
	    if (isDef(staticClass) || isDef(dynamicClass)) {
	      return concat(staticClass, stringifyClass(dynamicClass))
	    }
	    /* istanbul ignore next */
	    return ''
	  }

	  function concat (a, b) {
	    return a ? b ? (a + ' ' + b) : a : (b || '')
	  }

	  function stringifyClass (value) {
	    if (Array.isArray(value)) {
	      return stringifyArray(value)
	    }
	    if (isObject(value)) {
	      return stringifyObject(value)
	    }
	    if (typeof value === 'string') {
	      return value
	    }
	    /* istanbul ignore next */
	    return ''
	  }

	  function stringifyArray (value) {
	    var res = '';
	    var stringified;
	    for (var i = 0, l = value.length; i < l; i++) {
	      if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
	        if (res) { res += ' '; }
	        res += stringified;
	      }
	    }
	    return res
	  }

	  function stringifyObject (value) {
	    var res = '';
	    for (var key in value) {
	      if (value[key]) {
	        if (res) { res += ' '; }
	        res += key;
	      }
	    }
	    return res
	  }

	  /*  */

	  var namespaceMap = {
	    svg: 'http://www.w3.org/2000/svg',
	    math: 'http://www.w3.org/1998/Math/MathML'
	  };

	  var isHTMLTag = makeMap(
	    'html,body,base,head,link,meta,style,title,' +
	    'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
	    'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
	    'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
	    's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
	    'embed,object,param,source,canvas,script,noscript,del,ins,' +
	    'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
	    'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
	    'output,progress,select,textarea,' +
	    'details,dialog,menu,menuitem,summary,' +
	    'content,element,shadow,template,blockquote,iframe,tfoot'
	  );

	  // this map is intentionally selective, only covering SVG elements that may
	  // contain child elements.
	  var isSVG = makeMap(
	    'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
	    'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
	    'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
	    true
	  );

	  var isPreTag = function (tag) { return tag === 'pre'; };

	  var isReservedTag = function (tag) {
	    return isHTMLTag(tag) || isSVG(tag)
	  };

	  function getTagNamespace (tag) {
	    if (isSVG(tag)) {
	      return 'svg'
	    }
	    // basic support for MathML
	    // note it doesn't support other MathML elements being component roots
	    if (tag === 'math') {
	      return 'math'
	    }
	  }

	  var unknownElementCache = Object.create(null);
	  function isUnknownElement (tag) {
	    /* istanbul ignore if */
	    if (!inBrowser) {
	      return true
	    }
	    if (isReservedTag(tag)) {
	      return false
	    }
	    tag = tag.toLowerCase();
	    /* istanbul ignore if */
	    if (unknownElementCache[tag] != null) {
	      return unknownElementCache[tag]
	    }
	    var el = document.createElement(tag);
	    if (tag.indexOf('-') > -1) {
	      // http://stackoverflow.com/a/28210364/1070244
	      return (unknownElementCache[tag] = (
	        el.constructor === window.HTMLUnknownElement ||
	        el.constructor === window.HTMLElement
	      ))
	    } else {
	      return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
	    }
	  }

	  var isTextInputType = makeMap('text,number,password,search,email,tel,url');

	  /*  */

	  /**
	   * Query an element selector if it's not an element already.
	   */
	  function query (el) {
	    if (typeof el === 'string') {
	      var selected = document.querySelector(el);
	      if (!selected) {
	        warn(
	          'Cannot find element: ' + el
	        );
	        return document.createElement('div')
	      }
	      return selected
	    } else {
	      return el
	    }
	  }

	  /*  */

	  function createElement$1 (tagName, vnode) {
	    var elm = document.createElement(tagName);
	    if (tagName !== 'select') {
	      return elm
	    }
	    // false or null will remove the attribute but undefined will not
	    if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
	      elm.setAttribute('multiple', 'multiple');
	    }
	    return elm
	  }

	  function createElementNS (namespace, tagName) {
	    return document.createElementNS(namespaceMap[namespace], tagName)
	  }

	  function createTextNode (text) {
	    return document.createTextNode(text)
	  }

	  function createComment (text) {
	    return document.createComment(text)
	  }

	  function insertBefore (parentNode, newNode, referenceNode) {
	    parentNode.insertBefore(newNode, referenceNode);
	  }

	  function removeChild (node, child) {
	    node.removeChild(child);
	  }

	  function appendChild (node, child) {
	    node.appendChild(child);
	  }

	  function parentNode (node) {
	    return node.parentNode
	  }

	  function nextSibling (node) {
	    return node.nextSibling
	  }

	  function tagName (node) {
	    return node.tagName
	  }

	  function setTextContent (node, text) {
	    node.textContent = text;
	  }

	  function setStyleScope (node, scopeId) {
	    node.setAttribute(scopeId, '');
	  }

	  var nodeOps = /*#__PURE__*/Object.freeze({
	    createElement: createElement$1,
	    createElementNS: createElementNS,
	    createTextNode: createTextNode,
	    createComment: createComment,
	    insertBefore: insertBefore,
	    removeChild: removeChild,
	    appendChild: appendChild,
	    parentNode: parentNode,
	    nextSibling: nextSibling,
	    tagName: tagName,
	    setTextContent: setTextContent,
	    setStyleScope: setStyleScope
	  });

	  /*  */

	  var ref = {
	    create: function create (_, vnode) {
	      registerRef(vnode);
	    },
	    update: function update (oldVnode, vnode) {
	      if (oldVnode.data.ref !== vnode.data.ref) {
	        registerRef(oldVnode, true);
	        registerRef(vnode);
	      }
	    },
	    destroy: function destroy (vnode) {
	      registerRef(vnode, true);
	    }
	  };

	  function registerRef (vnode, isRemoval) {
	    var key = vnode.data.ref;
	    if (!isDef(key)) { return }

	    var vm = vnode.context;
	    var ref = vnode.componentInstance || vnode.elm;
	    var refs = vm.$refs;
	    if (isRemoval) {
	      if (Array.isArray(refs[key])) {
	        remove(refs[key], ref);
	      } else if (refs[key] === ref) {
	        refs[key] = undefined;
	      }
	    } else {
	      if (vnode.data.refInFor) {
	        if (!Array.isArray(refs[key])) {
	          refs[key] = [ref];
	        } else if (refs[key].indexOf(ref) < 0) {
	          // $flow-disable-line
	          refs[key].push(ref);
	        }
	      } else {
	        refs[key] = ref;
	      }
	    }
	  }

	  /**
	   * Virtual DOM patching algorithm based on Snabbdom by
	   * Simon Friis Vindum (@paldepind)
	   * Licensed under the MIT License
	   * https://github.com/paldepind/snabbdom/blob/master/LICENSE
	   *
	   * modified by Evan You (@yyx990803)
	   *
	   * Not type-checking this because this file is perf-critical and the cost
	   * of making flow understand it is not worth it.
	   */

	  var emptyNode = new VNode('', {}, []);

	  var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

	  function sameVnode (a, b) {
	    return (
	      a.key === b.key && (
	        (
	          a.tag === b.tag &&
	          a.isComment === b.isComment &&
	          isDef(a.data) === isDef(b.data) &&
	          sameInputType(a, b)
	        ) || (
	          isTrue(a.isAsyncPlaceholder) &&
	          a.asyncFactory === b.asyncFactory &&
	          isUndef(b.asyncFactory.error)
	        )
	      )
	    )
	  }

	  function sameInputType (a, b) {
	    if (a.tag !== 'input') { return true }
	    var i;
	    var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
	    var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
	    return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
	  }

	  function createKeyToOldIdx (children, beginIdx, endIdx) {
	    var i, key;
	    var map = {};
	    for (i = beginIdx; i <= endIdx; ++i) {
	      key = children[i].key;
	      if (isDef(key)) { map[key] = i; }
	    }
	    return map
	  }

	  function createPatchFunction (backend) {
	    var i, j;
	    var cbs = {};

	    var modules = backend.modules;
	    var nodeOps = backend.nodeOps;

	    for (i = 0; i < hooks.length; ++i) {
	      cbs[hooks[i]] = [];
	      for (j = 0; j < modules.length; ++j) {
	        if (isDef(modules[j][hooks[i]])) {
	          cbs[hooks[i]].push(modules[j][hooks[i]]);
	        }
	      }
	    }

	    function emptyNodeAt (elm) {
	      return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
	    }

	    function createRmCb (childElm, listeners) {
	      function remove$$1 () {
	        if (--remove$$1.listeners === 0) {
	          removeNode(childElm);
	        }
	      }
	      remove$$1.listeners = listeners;
	      return remove$$1
	    }

	    function removeNode (el) {
	      var parent = nodeOps.parentNode(el);
	      // element may have already been removed due to v-html / v-text
	      if (isDef(parent)) {
	        nodeOps.removeChild(parent, el);
	      }
	    }

	    function isUnknownElement$$1 (vnode, inVPre) {
	      return (
	        !inVPre &&
	        !vnode.ns &&
	        !(
	          config.ignoredElements.length &&
	          config.ignoredElements.some(function (ignore) {
	            return isRegExp(ignore)
	              ? ignore.test(vnode.tag)
	              : ignore === vnode.tag
	          })
	        ) &&
	        config.isUnknownElement(vnode.tag)
	      )
	    }

	    var creatingElmInVPre = 0;

	    function createElm (
	      vnode,
	      insertedVnodeQueue,
	      parentElm,
	      refElm,
	      nested,
	      ownerArray,
	      index
	    ) {
	      if (isDef(vnode.elm) && isDef(ownerArray)) {
	        // This vnode was used in a previous render!
	        // now it's used as a new node, overwriting its elm would cause
	        // potential patch errors down the road when it's used as an insertion
	        // reference node. Instead, we clone the node on-demand before creating
	        // associated DOM element for it.
	        vnode = ownerArray[index] = cloneVNode(vnode);
	      }

	      vnode.isRootInsert = !nested; // for transition enter check
	      if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
	        return
	      }

	      var data = vnode.data;
	      var children = vnode.children;
	      var tag = vnode.tag;
	      if (isDef(tag)) {
	        {
	          if (data && data.pre) {
	            creatingElmInVPre++;
	          }
	          if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
	            warn(
	              'Unknown custom element: <' + tag + '> - did you ' +
	              'register the component correctly? For recursive components, ' +
	              'make sure to provide the "name" option.',
	              vnode.context
	            );
	          }
	        }

	        vnode.elm = vnode.ns
	          ? nodeOps.createElementNS(vnode.ns, tag)
	          : nodeOps.createElement(tag, vnode);
	        setScope(vnode);

	        /* istanbul ignore if */
	        {
	          createChildren(vnode, children, insertedVnodeQueue);
	          if (isDef(data)) {
	            invokeCreateHooks(vnode, insertedVnodeQueue);
	          }
	          insert(parentElm, vnode.elm, refElm);
	        }

	        if (data && data.pre) {
	          creatingElmInVPre--;
	        }
	      } else if (isTrue(vnode.isComment)) {
	        vnode.elm = nodeOps.createComment(vnode.text);
	        insert(parentElm, vnode.elm, refElm);
	      } else {
	        vnode.elm = nodeOps.createTextNode(vnode.text);
	        insert(parentElm, vnode.elm, refElm);
	      }
	    }

	    function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
	      var i = vnode.data;
	      if (isDef(i)) {
	        var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
	        if (isDef(i = i.hook) && isDef(i = i.init)) {
	          i(vnode, false /* hydrating */);
	        }
	        // after calling the init hook, if the vnode is a child component
	        // it should've created a child instance and mounted it. the child
	        // component also has set the placeholder vnode's elm.
	        // in that case we can just return the element and be done.
	        if (isDef(vnode.componentInstance)) {
	          initComponent(vnode, insertedVnodeQueue);
	          insert(parentElm, vnode.elm, refElm);
	          if (isTrue(isReactivated)) {
	            reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
	          }
	          return true
	        }
	      }
	    }

	    function initComponent (vnode, insertedVnodeQueue) {
	      if (isDef(vnode.data.pendingInsert)) {
	        insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
	        vnode.data.pendingInsert = null;
	      }
	      vnode.elm = vnode.componentInstance.$el;
	      if (isPatchable(vnode)) {
	        invokeCreateHooks(vnode, insertedVnodeQueue);
	        setScope(vnode);
	      } else {
	        // empty component root.
	        // skip all element-related modules except for ref (#3455)
	        registerRef(vnode);
	        // make sure to invoke the insert hook
	        insertedVnodeQueue.push(vnode);
	      }
	    }

	    function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
	      var i;
	      // hack for #4339: a reactivated component with inner transition
	      // does not trigger because the inner node's created hooks are not called
	      // again. It's not ideal to involve module-specific logic in here but
	      // there doesn't seem to be a better way to do it.
	      var innerNode = vnode;
	      while (innerNode.componentInstance) {
	        innerNode = innerNode.componentInstance._vnode;
	        if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
	          for (i = 0; i < cbs.activate.length; ++i) {
	            cbs.activate[i](emptyNode, innerNode);
	          }
	          insertedVnodeQueue.push(innerNode);
	          break
	        }
	      }
	      // unlike a newly created component,
	      // a reactivated keep-alive component doesn't insert itself
	      insert(parentElm, vnode.elm, refElm);
	    }

	    function insert (parent, elm, ref$$1) {
	      if (isDef(parent)) {
	        if (isDef(ref$$1)) {
	          if (nodeOps.parentNode(ref$$1) === parent) {
	            nodeOps.insertBefore(parent, elm, ref$$1);
	          }
	        } else {
	          nodeOps.appendChild(parent, elm);
	        }
	      }
	    }

	    function createChildren (vnode, children, insertedVnodeQueue) {
	      if (Array.isArray(children)) {
	        {
	          checkDuplicateKeys(children);
	        }
	        for (var i = 0; i < children.length; ++i) {
	          createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
	        }
	      } else if (isPrimitive(vnode.text)) {
	        nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
	      }
	    }

	    function isPatchable (vnode) {
	      while (vnode.componentInstance) {
	        vnode = vnode.componentInstance._vnode;
	      }
	      return isDef(vnode.tag)
	    }

	    function invokeCreateHooks (vnode, insertedVnodeQueue) {
	      for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
	        cbs.create[i$1](emptyNode, vnode);
	      }
	      i = vnode.data.hook; // Reuse variable
	      if (isDef(i)) {
	        if (isDef(i.create)) { i.create(emptyNode, vnode); }
	        if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
	      }
	    }

	    // set scope id attribute for scoped CSS.
	    // this is implemented as a special case to avoid the overhead
	    // of going through the normal attribute patching process.
	    function setScope (vnode) {
	      var i;
	      if (isDef(i = vnode.fnScopeId)) {
	        nodeOps.setStyleScope(vnode.elm, i);
	      } else {
	        var ancestor = vnode;
	        while (ancestor) {
	          if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
	            nodeOps.setStyleScope(vnode.elm, i);
	          }
	          ancestor = ancestor.parent;
	        }
	      }
	      // for slot content they should also get the scopeId from the host instance.
	      if (isDef(i = activeInstance) &&
	        i !== vnode.context &&
	        i !== vnode.fnContext &&
	        isDef(i = i.$options._scopeId)
	      ) {
	        nodeOps.setStyleScope(vnode.elm, i);
	      }
	    }

	    function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
	      for (; startIdx <= endIdx; ++startIdx) {
	        createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
	      }
	    }

	    function invokeDestroyHook (vnode) {
	      var i, j;
	      var data = vnode.data;
	      if (isDef(data)) {
	        if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
	        for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
	      }
	      if (isDef(i = vnode.children)) {
	        for (j = 0; j < vnode.children.length; ++j) {
	          invokeDestroyHook(vnode.children[j]);
	        }
	      }
	    }

	    function removeVnodes (vnodes, startIdx, endIdx) {
	      for (; startIdx <= endIdx; ++startIdx) {
	        var ch = vnodes[startIdx];
	        if (isDef(ch)) {
	          if (isDef(ch.tag)) {
	            removeAndInvokeRemoveHook(ch);
	            invokeDestroyHook(ch);
	          } else { // Text node
	            removeNode(ch.elm);
	          }
	        }
	      }
	    }

	    function removeAndInvokeRemoveHook (vnode, rm) {
	      if (isDef(rm) || isDef(vnode.data)) {
	        var i;
	        var listeners = cbs.remove.length + 1;
	        if (isDef(rm)) {
	          // we have a recursively passed down rm callback
	          // increase the listeners count
	          rm.listeners += listeners;
	        } else {
	          // directly removing
	          rm = createRmCb(vnode.elm, listeners);
	        }
	        // recursively invoke hooks on child component root node
	        if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
	          removeAndInvokeRemoveHook(i, rm);
	        }
	        for (i = 0; i < cbs.remove.length; ++i) {
	          cbs.remove[i](vnode, rm);
	        }
	        if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
	          i(vnode, rm);
	        } else {
	          rm();
	        }
	      } else {
	        removeNode(vnode.elm);
	      }
	    }

	    function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
	      var oldStartIdx = 0;
	      var newStartIdx = 0;
	      var oldEndIdx = oldCh.length - 1;
	      var oldStartVnode = oldCh[0];
	      var oldEndVnode = oldCh[oldEndIdx];
	      var newEndIdx = newCh.length - 1;
	      var newStartVnode = newCh[0];
	      var newEndVnode = newCh[newEndIdx];
	      var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

	      // removeOnly is a special flag used only by <transition-group>
	      // to ensure removed elements stay in correct relative positions
	      // during leaving transitions
	      var canMove = !removeOnly;

	      {
	        checkDuplicateKeys(newCh);
	      }

	      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
	        if (isUndef(oldStartVnode)) {
	          oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
	        } else if (isUndef(oldEndVnode)) {
	          oldEndVnode = oldCh[--oldEndIdx];
	        } else if (sameVnode(oldStartVnode, newStartVnode)) {
	          patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
	          oldStartVnode = oldCh[++oldStartIdx];
	          newStartVnode = newCh[++newStartIdx];
	        } else if (sameVnode(oldEndVnode, newEndVnode)) {
	          patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
	          oldEndVnode = oldCh[--oldEndIdx];
	          newEndVnode = newCh[--newEndIdx];
	        } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
	          patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
	          canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
	          oldStartVnode = oldCh[++oldStartIdx];
	          newEndVnode = newCh[--newEndIdx];
	        } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
	          patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
	          canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
	          oldEndVnode = oldCh[--oldEndIdx];
	          newStartVnode = newCh[++newStartIdx];
	        } else {
	          if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
	          idxInOld = isDef(newStartVnode.key)
	            ? oldKeyToIdx[newStartVnode.key]
	            : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
	          if (isUndef(idxInOld)) { // New element
	            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
	          } else {
	            vnodeToMove = oldCh[idxInOld];
	            if (sameVnode(vnodeToMove, newStartVnode)) {
	              patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
	              oldCh[idxInOld] = undefined;
	              canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
	            } else {
	              // same key but different element. treat as new element
	              createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
	            }
	          }
	          newStartVnode = newCh[++newStartIdx];
	        }
	      }
	      if (oldStartIdx > oldEndIdx) {
	        refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
	        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
	      } else if (newStartIdx > newEndIdx) {
	        removeVnodes(oldCh, oldStartIdx, oldEndIdx);
	      }
	    }

	    function checkDuplicateKeys (children) {
	      var seenKeys = {};
	      for (var i = 0; i < children.length; i++) {
	        var vnode = children[i];
	        var key = vnode.key;
	        if (isDef(key)) {
	          if (seenKeys[key]) {
	            warn(
	              ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
	              vnode.context
	            );
	          } else {
	            seenKeys[key] = true;
	          }
	        }
	      }
	    }

	    function findIdxInOld (node, oldCh, start, end) {
	      for (var i = start; i < end; i++) {
	        var c = oldCh[i];
	        if (isDef(c) && sameVnode(node, c)) { return i }
	      }
	    }

	    function patchVnode (
	      oldVnode,
	      vnode,
	      insertedVnodeQueue,
	      ownerArray,
	      index,
	      removeOnly
	    ) {
	      if (oldVnode === vnode) {
	        return
	      }

	      if (isDef(vnode.elm) && isDef(ownerArray)) {
	        // clone reused vnode
	        vnode = ownerArray[index] = cloneVNode(vnode);
	      }

	      var elm = vnode.elm = oldVnode.elm;

	      if (isTrue(oldVnode.isAsyncPlaceholder)) {
	        if (isDef(vnode.asyncFactory.resolved)) {
	          hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
	        } else {
	          vnode.isAsyncPlaceholder = true;
	        }
	        return
	      }

	      // reuse element for static trees.
	      // note we only do this if the vnode is cloned -
	      // if the new node is not cloned it means the render functions have been
	      // reset by the hot-reload-api and we need to do a proper re-render.
	      if (isTrue(vnode.isStatic) &&
	        isTrue(oldVnode.isStatic) &&
	        vnode.key === oldVnode.key &&
	        (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
	      ) {
	        vnode.componentInstance = oldVnode.componentInstance;
	        return
	      }

	      var i;
	      var data = vnode.data;
	      if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
	        i(oldVnode, vnode);
	      }

	      var oldCh = oldVnode.children;
	      var ch = vnode.children;
	      if (isDef(data) && isPatchable(vnode)) {
	        for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
	        if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
	      }
	      if (isUndef(vnode.text)) {
	        if (isDef(oldCh) && isDef(ch)) {
	          if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
	        } else if (isDef(ch)) {
	          {
	            checkDuplicateKeys(ch);
	          }
	          if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
	          addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
	        } else if (isDef(oldCh)) {
	          removeVnodes(oldCh, 0, oldCh.length - 1);
	        } else if (isDef(oldVnode.text)) {
	          nodeOps.setTextContent(elm, '');
	        }
	      } else if (oldVnode.text !== vnode.text) {
	        nodeOps.setTextContent(elm, vnode.text);
	      }
	      if (isDef(data)) {
	        if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
	      }
	    }

	    function invokeInsertHook (vnode, queue, initial) {
	      // delay insert hooks for component root nodes, invoke them after the
	      // element is really inserted
	      if (isTrue(initial) && isDef(vnode.parent)) {
	        vnode.parent.data.pendingInsert = queue;
	      } else {
	        for (var i = 0; i < queue.length; ++i) {
	          queue[i].data.hook.insert(queue[i]);
	        }
	      }
	    }

	    var hydrationBailed = false;
	    // list of modules that can skip create hook during hydration because they
	    // are already rendered on the client or has no need for initialization
	    // Note: style is excluded because it relies on initial clone for future
	    // deep updates (#7063).
	    var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

	    // Note: this is a browser-only function so we can assume elms are DOM nodes.
	    function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
	      var i;
	      var tag = vnode.tag;
	      var data = vnode.data;
	      var children = vnode.children;
	      inVPre = inVPre || (data && data.pre);
	      vnode.elm = elm;

	      if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
	        vnode.isAsyncPlaceholder = true;
	        return true
	      }
	      // assert node match
	      {
	        if (!assertNodeMatch(elm, vnode, inVPre)) {
	          return false
	        }
	      }
	      if (isDef(data)) {
	        if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
	        if (isDef(i = vnode.componentInstance)) {
	          // child component. it should have hydrated its own tree.
	          initComponent(vnode, insertedVnodeQueue);
	          return true
	        }
	      }
	      if (isDef(tag)) {
	        if (isDef(children)) {
	          // empty element, allow client to pick up and populate children
	          if (!elm.hasChildNodes()) {
	            createChildren(vnode, children, insertedVnodeQueue);
	          } else {
	            // v-html and domProps: innerHTML
	            if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
	              if (i !== elm.innerHTML) {
	                /* istanbul ignore if */
	                if (typeof console !== 'undefined' &&
	                  !hydrationBailed
	                ) {
	                  hydrationBailed = true;
	                  console.warn('Parent: ', elm);
	                  console.warn('server innerHTML: ', i);
	                  console.warn('client innerHTML: ', elm.innerHTML);
	                }
	                return false
	              }
	            } else {
	              // iterate and compare children lists
	              var childrenMatch = true;
	              var childNode = elm.firstChild;
	              for (var i$1 = 0; i$1 < children.length; i$1++) {
	                if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
	                  childrenMatch = false;
	                  break
	                }
	                childNode = childNode.nextSibling;
	              }
	              // if childNode is not null, it means the actual childNodes list is
	              // longer than the virtual children list.
	              if (!childrenMatch || childNode) {
	                /* istanbul ignore if */
	                if (typeof console !== 'undefined' &&
	                  !hydrationBailed
	                ) {
	                  hydrationBailed = true;
	                  console.warn('Parent: ', elm);
	                  console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
	                }
	                return false
	              }
	            }
	          }
	        }
	        if (isDef(data)) {
	          var fullInvoke = false;
	          for (var key in data) {
	            if (!isRenderedModule(key)) {
	              fullInvoke = true;
	              invokeCreateHooks(vnode, insertedVnodeQueue);
	              break
	            }
	          }
	          if (!fullInvoke && data['class']) {
	            // ensure collecting deps for deep class bindings for future updates
	            traverse(data['class']);
	          }
	        }
	      } else if (elm.data !== vnode.text) {
	        elm.data = vnode.text;
	      }
	      return true
	    }

	    function assertNodeMatch (node, vnode, inVPre) {
	      if (isDef(vnode.tag)) {
	        return vnode.tag.indexOf('vue-component') === 0 || (
	          !isUnknownElement$$1(vnode, inVPre) &&
	          vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
	        )
	      } else {
	        return node.nodeType === (vnode.isComment ? 8 : 3)
	      }
	    }

	    return function patch (oldVnode, vnode, hydrating, removeOnly) {
	      if (isUndef(vnode)) {
	        if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
	        return
	      }

	      var isInitialPatch = false;
	      var insertedVnodeQueue = [];

	      if (isUndef(oldVnode)) {
	        // empty mount (likely as component), create new root element
	        isInitialPatch = true;
	        createElm(vnode, insertedVnodeQueue);
	      } else {
	        var isRealElement = isDef(oldVnode.nodeType);
	        if (!isRealElement && sameVnode(oldVnode, vnode)) {
	          // patch existing root node
	          patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
	        } else {
	          if (isRealElement) {
	            // mounting to a real element
	            // check if this is server-rendered content and if we can perform
	            // a successful hydration.
	            if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
	              oldVnode.removeAttribute(SSR_ATTR);
	              hydrating = true;
	            }
	            if (isTrue(hydrating)) {
	              if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
	                invokeInsertHook(vnode, insertedVnodeQueue, true);
	                return oldVnode
	              } else {
	                warn(
	                  'The client-side rendered virtual DOM tree is not matching ' +
	                  'server-rendered content. This is likely caused by incorrect ' +
	                  'HTML markup, for example nesting block-level elements inside ' +
	                  '<p>, or missing <tbody>. Bailing hydration and performing ' +
	                  'full client-side render.'
	                );
	              }
	            }
	            // either not server-rendered, or hydration failed.
	            // create an empty node and replace it
	            oldVnode = emptyNodeAt(oldVnode);
	          }

	          // replacing existing element
	          var oldElm = oldVnode.elm;
	          var parentElm = nodeOps.parentNode(oldElm);

	          // create new node
	          createElm(
	            vnode,
	            insertedVnodeQueue,
	            // extremely rare edge case: do not insert if old element is in a
	            // leaving transition. Only happens when combining transition +
	            // keep-alive + HOCs. (#4590)
	            oldElm._leaveCb ? null : parentElm,
	            nodeOps.nextSibling(oldElm)
	          );

	          // update parent placeholder node element, recursively
	          if (isDef(vnode.parent)) {
	            var ancestor = vnode.parent;
	            var patchable = isPatchable(vnode);
	            while (ancestor) {
	              for (var i = 0; i < cbs.destroy.length; ++i) {
	                cbs.destroy[i](ancestor);
	              }
	              ancestor.elm = vnode.elm;
	              if (patchable) {
	                for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
	                  cbs.create[i$1](emptyNode, ancestor);
	                }
	                // #6513
	                // invoke insert hooks that may have been merged by create hooks.
	                // e.g. for directives that uses the "inserted" hook.
	                var insert = ancestor.data.hook.insert;
	                if (insert.merged) {
	                  // start at index 1 to avoid re-invoking component mounted hook
	                  for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
	                    insert.fns[i$2]();
	                  }
	                }
	              } else {
	                registerRef(ancestor);
	              }
	              ancestor = ancestor.parent;
	            }
	          }

	          // destroy old node
	          if (isDef(parentElm)) {
	            removeVnodes([oldVnode], 0, 0);
	          } else if (isDef(oldVnode.tag)) {
	            invokeDestroyHook(oldVnode);
	          }
	        }
	      }

	      invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
	      return vnode.elm
	    }
	  }

	  /*  */

	  var directives = {
	    create: updateDirectives,
	    update: updateDirectives,
	    destroy: function unbindDirectives (vnode) {
	      updateDirectives(vnode, emptyNode);
	    }
	  };

	  function updateDirectives (oldVnode, vnode) {
	    if (oldVnode.data.directives || vnode.data.directives) {
	      _update(oldVnode, vnode);
	    }
	  }

	  function _update (oldVnode, vnode) {
	    var isCreate = oldVnode === emptyNode;
	    var isDestroy = vnode === emptyNode;
	    var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
	    var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

	    var dirsWithInsert = [];
	    var dirsWithPostpatch = [];

	    var key, oldDir, dir;
	    for (key in newDirs) {
	      oldDir = oldDirs[key];
	      dir = newDirs[key];
	      if (!oldDir) {
	        // new directive, bind
	        callHook$1(dir, 'bind', vnode, oldVnode);
	        if (dir.def && dir.def.inserted) {
	          dirsWithInsert.push(dir);
	        }
	      } else {
	        // existing directive, update
	        dir.oldValue = oldDir.value;
	        dir.oldArg = oldDir.arg;
	        callHook$1(dir, 'update', vnode, oldVnode);
	        if (dir.def && dir.def.componentUpdated) {
	          dirsWithPostpatch.push(dir);
	        }
	      }
	    }

	    if (dirsWithInsert.length) {
	      var callInsert = function () {
	        for (var i = 0; i < dirsWithInsert.length; i++) {
	          callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
	        }
	      };
	      if (isCreate) {
	        mergeVNodeHook(vnode, 'insert', callInsert);
	      } else {
	        callInsert();
	      }
	    }

	    if (dirsWithPostpatch.length) {
	      mergeVNodeHook(vnode, 'postpatch', function () {
	        for (var i = 0; i < dirsWithPostpatch.length; i++) {
	          callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
	        }
	      });
	    }

	    if (!isCreate) {
	      for (key in oldDirs) {
	        if (!newDirs[key]) {
	          // no longer present, unbind
	          callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
	        }
	      }
	    }
	  }

	  var emptyModifiers = Object.create(null);

	  function normalizeDirectives$1 (
	    dirs,
	    vm
	  ) {
	    var res = Object.create(null);
	    if (!dirs) {
	      // $flow-disable-line
	      return res
	    }
	    var i, dir;
	    for (i = 0; i < dirs.length; i++) {
	      dir = dirs[i];
	      if (!dir.modifiers) {
	        // $flow-disable-line
	        dir.modifiers = emptyModifiers;
	      }
	      res[getRawDirName(dir)] = dir;
	      dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
	    }
	    // $flow-disable-line
	    return res
	  }

	  function getRawDirName (dir) {
	    return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
	  }

	  function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
	    var fn = dir.def && dir.def[hook];
	    if (fn) {
	      try {
	        fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
	      } catch (e) {
	        handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
	      }
	    }
	  }

	  var baseModules = [
	    ref,
	    directives
	  ];

	  /*  */

	  function updateAttrs (oldVnode, vnode) {
	    var opts = vnode.componentOptions;
	    if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
	      return
	    }
	    if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
	      return
	    }
	    var key, cur, old;
	    var elm = vnode.elm;
	    var oldAttrs = oldVnode.data.attrs || {};
	    var attrs = vnode.data.attrs || {};
	    // clone observed objects, as the user probably wants to mutate it
	    if (isDef(attrs.__ob__)) {
	      attrs = vnode.data.attrs = extend({}, attrs);
	    }

	    for (key in attrs) {
	      cur = attrs[key];
	      old = oldAttrs[key];
	      if (old !== cur) {
	        setAttr(elm, key, cur);
	      }
	    }
	    // #4391: in IE9, setting type can reset value for input[type=radio]
	    // #6666: IE/Edge forces progress value down to 1 before setting a max
	    /* istanbul ignore if */
	    if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
	      setAttr(elm, 'value', attrs.value);
	    }
	    for (key in oldAttrs) {
	      if (isUndef(attrs[key])) {
	        if (isXlink(key)) {
	          elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
	        } else if (!isEnumeratedAttr(key)) {
	          elm.removeAttribute(key);
	        }
	      }
	    }
	  }

	  function setAttr (el, key, value) {
	    if (el.tagName.indexOf('-') > -1) {
	      baseSetAttr(el, key, value);
	    } else if (isBooleanAttr(key)) {
	      // set attribute for blank value
	      // e.g. <option disabled>Select one</option>
	      if (isFalsyAttrValue(value)) {
	        el.removeAttribute(key);
	      } else {
	        // technically allowfullscreen is a boolean attribute for <iframe>,
	        // but Flash expects a value of "true" when used on <embed> tag
	        value = key === 'allowfullscreen' && el.tagName === 'EMBED'
	          ? 'true'
	          : key;
	        el.setAttribute(key, value);
	      }
	    } else if (isEnumeratedAttr(key)) {
	      el.setAttribute(key, convertEnumeratedValue(key, value));
	    } else if (isXlink(key)) {
	      if (isFalsyAttrValue(value)) {
	        el.removeAttributeNS(xlinkNS, getXlinkProp(key));
	      } else {
	        el.setAttributeNS(xlinkNS, key, value);
	      }
	    } else {
	      baseSetAttr(el, key, value);
	    }
	  }

	  function baseSetAttr (el, key, value) {
	    if (isFalsyAttrValue(value)) {
	      el.removeAttribute(key);
	    } else {
	      // #7138: IE10 & 11 fires input event when setting placeholder on
	      // <textarea>... block the first input event and remove the blocker
	      // immediately.
	      /* istanbul ignore if */
	      if (
	        isIE && !isIE9 &&
	        el.tagName === 'TEXTAREA' &&
	        key === 'placeholder' && value !== '' && !el.__ieph
	      ) {
	        var blocker = function (e) {
	          e.stopImmediatePropagation();
	          el.removeEventListener('input', blocker);
	        };
	        el.addEventListener('input', blocker);
	        // $flow-disable-line
	        el.__ieph = true; /* IE placeholder patched */
	      }
	      el.setAttribute(key, value);
	    }
	  }

	  var attrs = {
	    create: updateAttrs,
	    update: updateAttrs
	  };

	  /*  */

	  function updateClass (oldVnode, vnode) {
	    var el = vnode.elm;
	    var data = vnode.data;
	    var oldData = oldVnode.data;
	    if (
	      isUndef(data.staticClass) &&
	      isUndef(data.class) && (
	        isUndef(oldData) || (
	          isUndef(oldData.staticClass) &&
	          isUndef(oldData.class)
	        )
	      )
	    ) {
	      return
	    }

	    var cls = genClassForVnode(vnode);

	    // handle transition classes
	    var transitionClass = el._transitionClasses;
	    if (isDef(transitionClass)) {
	      cls = concat(cls, stringifyClass(transitionClass));
	    }

	    // set the class
	    if (cls !== el._prevClass) {
	      el.setAttribute('class', cls);
	      el._prevClass = cls;
	    }
	  }

	  var klass = {
	    create: updateClass,
	    update: updateClass
	  };

	  /*  */

	  var validDivisionCharRE = /[\w).+\-_$\]]/;

	  function parseFilters (exp) {
	    var inSingle = false;
	    var inDouble = false;
	    var inTemplateString = false;
	    var inRegex = false;
	    var curly = 0;
	    var square = 0;
	    var paren = 0;
	    var lastFilterIndex = 0;
	    var c, prev, i, expression, filters;

	    for (i = 0; i < exp.length; i++) {
	      prev = c;
	      c = exp.charCodeAt(i);
	      if (inSingle) {
	        if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
	      } else if (inDouble) {
	        if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
	      } else if (inTemplateString) {
	        if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
	      } else if (inRegex) {
	        if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
	      } else if (
	        c === 0x7C && // pipe
	        exp.charCodeAt(i + 1) !== 0x7C &&
	        exp.charCodeAt(i - 1) !== 0x7C &&
	        !curly && !square && !paren
	      ) {
	        if (expression === undefined) {
	          // first filter, end of expression
	          lastFilterIndex = i + 1;
	          expression = exp.slice(0, i).trim();
	        } else {
	          pushFilter();
	        }
	      } else {
	        switch (c) {
	          case 0x22: inDouble = true; break         // "
	          case 0x27: inSingle = true; break         // '
	          case 0x60: inTemplateString = true; break // `
	          case 0x28: paren++; break                 // (
	          case 0x29: paren--; break                 // )
	          case 0x5B: square++; break                // [
	          case 0x5D: square--; break                // ]
	          case 0x7B: curly++; break                 // {
	          case 0x7D: curly--; break                 // }
	        }
	        if (c === 0x2f) { // /
	          var j = i - 1;
	          var p = (void 0);
	          // find first non-whitespace prev char
	          for (; j >= 0; j--) {
	            p = exp.charAt(j);
	            if (p !== ' ') { break }
	          }
	          if (!p || !validDivisionCharRE.test(p)) {
	            inRegex = true;
	          }
	        }
	      }
	    }

	    if (expression === undefined) {
	      expression = exp.slice(0, i).trim();
	    } else if (lastFilterIndex !== 0) {
	      pushFilter();
	    }

	    function pushFilter () {
	      (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
	      lastFilterIndex = i + 1;
	    }

	    if (filters) {
	      for (i = 0; i < filters.length; i++) {
	        expression = wrapFilter(expression, filters[i]);
	      }
	    }

	    return expression
	  }

	  function wrapFilter (exp, filter) {
	    var i = filter.indexOf('(');
	    if (i < 0) {
	      // _f: resolveFilter
	      return ("_f(\"" + filter + "\")(" + exp + ")")
	    } else {
	      var name = filter.slice(0, i);
	      var args = filter.slice(i + 1);
	      return ("_f(\"" + name + "\")(" + exp + (args !== ')' ? ',' + args : args))
	    }
	  }

	  /*  */



	  /* eslint-disable no-unused-vars */
	  function baseWarn (msg, range) {
	    console.error(("[Vue compiler]: " + msg));
	  }
	  /* eslint-enable no-unused-vars */

	  function pluckModuleFunction (
	    modules,
	    key
	  ) {
	    return modules
	      ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
	      : []
	  }

	  function addProp (el, name, value, range, dynamic) {
	    (el.props || (el.props = [])).push(rangeSetItem({ name: name, value: value, dynamic: dynamic }, range));
	    el.plain = false;
	  }

	  function addAttr (el, name, value, range, dynamic) {
	    var attrs = dynamic
	      ? (el.dynamicAttrs || (el.dynamicAttrs = []))
	      : (el.attrs || (el.attrs = []));
	    attrs.push(rangeSetItem({ name: name, value: value, dynamic: dynamic }, range));
	    el.plain = false;
	  }

	  // add a raw attr (use this in preTransforms)
	  function addRawAttr (el, name, value, range) {
	    el.attrsMap[name] = value;
	    el.attrsList.push(rangeSetItem({ name: name, value: value }, range));
	  }

	  function addDirective (
	    el,
	    name,
	    rawName,
	    value,
	    arg,
	    isDynamicArg,
	    modifiers,
	    range
	  ) {
	    (el.directives || (el.directives = [])).push(rangeSetItem({
	      name: name,
	      rawName: rawName,
	      value: value,
	      arg: arg,
	      isDynamicArg: isDynamicArg,
	      modifiers: modifiers
	    }, range));
	    el.plain = false;
	  }

	  function prependModifierMarker (symbol, name, dynamic) {
	    return dynamic
	      ? ("_p(" + name + ",\"" + symbol + "\")")
	      : symbol + name // mark the event as captured
	  }

	  function addHandler (
	    el,
	    name,
	    value,
	    modifiers,
	    important,
	    warn,
	    range,
	    dynamic
	  ) {
	    modifiers = modifiers || emptyObject;
	    // warn prevent and passive modifier
	    /* istanbul ignore if */
	    if (
	      warn &&
	      modifiers.prevent && modifiers.passive
	    ) {
	      warn(
	        'passive and prevent can\'t be used together. ' +
	        'Passive handler can\'t prevent default event.',
	        range
	      );
	    }

	    // normalize click.right and click.middle since they don't actually fire
	    // this is technically browser-specific, but at least for now browsers are
	    // the only target envs that have right/middle clicks.
	    if (modifiers.right) {
	      if (dynamic) {
	        name = "(" + name + ")==='click'?'contextmenu':(" + name + ")";
	      } else if (name === 'click') {
	        name = 'contextmenu';
	        delete modifiers.right;
	      }
	    } else if (modifiers.middle) {
	      if (dynamic) {
	        name = "(" + name + ")==='click'?'mouseup':(" + name + ")";
	      } else if (name === 'click') {
	        name = 'mouseup';
	      }
	    }

	    // check capture modifier
	    if (modifiers.capture) {
	      delete modifiers.capture;
	      name = prependModifierMarker('!', name, dynamic);
	    }
	    if (modifiers.once) {
	      delete modifiers.once;
	      name = prependModifierMarker('~', name, dynamic);
	    }
	    /* istanbul ignore if */
	    if (modifiers.passive) {
	      delete modifiers.passive;
	      name = prependModifierMarker('&', name, dynamic);
	    }

	    var events;
	    if (modifiers.native) {
	      delete modifiers.native;
	      events = el.nativeEvents || (el.nativeEvents = {});
	    } else {
	      events = el.events || (el.events = {});
	    }

	    var newHandler = rangeSetItem({ value: value.trim(), dynamic: dynamic }, range);
	    if (modifiers !== emptyObject) {
	      newHandler.modifiers = modifiers;
	    }

	    var handlers = events[name];
	    /* istanbul ignore if */
	    if (Array.isArray(handlers)) {
	      important ? handlers.unshift(newHandler) : handlers.push(newHandler);
	    } else if (handlers) {
	      events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
	    } else {
	      events[name] = newHandler;
	    }

	    el.plain = false;
	  }

	  function getRawBindingAttr (
	    el,
	    name
	  ) {
	    return el.rawAttrsMap[':' + name] ||
	      el.rawAttrsMap['v-bind:' + name] ||
	      el.rawAttrsMap[name]
	  }

	  function getBindingAttr (
	    el,
	    name,
	    getStatic
	  ) {
	    var dynamicValue =
	      getAndRemoveAttr(el, ':' + name) ||
	      getAndRemoveAttr(el, 'v-bind:' + name);
	    if (dynamicValue != null) {
	      return parseFilters(dynamicValue)
	    } else if (getStatic !== false) {
	      var staticValue = getAndRemoveAttr(el, name);
	      if (staticValue != null) {
	        return JSON.stringify(staticValue)
	      }
	    }
	  }

	  // note: this only removes the attr from the Array (attrsList) so that it
	  // doesn't get processed by processAttrs.
	  // By default it does NOT remove it from the map (attrsMap) because the map is
	  // needed during codegen.
	  function getAndRemoveAttr (
	    el,
	    name,
	    removeFromMap
	  ) {
	    var val;
	    if ((val = el.attrsMap[name]) != null) {
	      var list = el.attrsList;
	      for (var i = 0, l = list.length; i < l; i++) {
	        if (list[i].name === name) {
	          list.splice(i, 1);
	          break
	        }
	      }
	    }
	    if (removeFromMap) {
	      delete el.attrsMap[name];
	    }
	    return val
	  }

	  function getAndRemoveAttrByRegex (
	    el,
	    name
	  ) {
	    var list = el.attrsList;
	    for (var i = 0, l = list.length; i < l; i++) {
	      var attr = list[i];
	      if (name.test(attr.name)) {
	        list.splice(i, 1);
	        return attr
	      }
	    }
	  }

	  function rangeSetItem (
	    item,
	    range
	  ) {
	    if (range) {
	      if (range.start != null) {
	        item.start = range.start;
	      }
	      if (range.end != null) {
	        item.end = range.end;
	      }
	    }
	    return item
	  }

	  /*  */

	  /**
	   * Cross-platform code generation for component v-model
	   */
	  function genComponentModel (
	    el,
	    value,
	    modifiers
	  ) {
	    var ref = modifiers || {};
	    var number = ref.number;
	    var trim = ref.trim;

	    var baseValueExpression = '$$v';
	    var valueExpression = baseValueExpression;
	    if (trim) {
	      valueExpression =
	        "(typeof " + baseValueExpression + " === 'string'" +
	        "? " + baseValueExpression + ".trim()" +
	        ": " + baseValueExpression + ")";
	    }
	    if (number) {
	      valueExpression = "_n(" + valueExpression + ")";
	    }
	    var assignment = genAssignmentCode(value, valueExpression);

	    el.model = {
	      value: ("(" + value + ")"),
	      expression: JSON.stringify(value),
	      callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
	    };
	  }

	  /**
	   * Cross-platform codegen helper for generating v-model value assignment code.
	   */
	  function genAssignmentCode (
	    value,
	    assignment
	  ) {
	    var res = parseModel(value);
	    if (res.key === null) {
	      return (value + "=" + assignment)
	    } else {
	      return ("$set(" + (res.exp) + ", " + (res.key) + ", " + assignment + ")")
	    }
	  }

	  /**
	   * Parse a v-model expression into a base path and a final key segment.
	   * Handles both dot-path and possible square brackets.
	   *
	   * Possible cases:
	   *
	   * - test
	   * - test[key]
	   * - test[test1[key]]
	   * - test["a"][key]
	   * - xxx.test[a[a].test1[key]]
	   * - test.xxx.a["asa"][test1[key]]
	   *
	   */

	  var len, str, chr, index$1, expressionPos, expressionEndPos;



	  function parseModel (val) {
	    // Fix https://github.com/vuejs/vue/pull/7730
	    // allow v-model="obj.val " (trailing whitespace)
	    val = val.trim();
	    len = val.length;

	    if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
	      index$1 = val.lastIndexOf('.');
	      if (index$1 > -1) {
	        return {
	          exp: val.slice(0, index$1),
	          key: '"' + val.slice(index$1 + 1) + '"'
	        }
	      } else {
	        return {
	          exp: val,
	          key: null
	        }
	      }
	    }

	    str = val;
	    index$1 = expressionPos = expressionEndPos = 0;

	    while (!eof()) {
	      chr = next();
	      /* istanbul ignore if */
	      if (isStringStart(chr)) {
	        parseString(chr);
	      } else if (chr === 0x5B) {
	        parseBracket(chr);
	      }
	    }

	    return {
	      exp: val.slice(0, expressionPos),
	      key: val.slice(expressionPos + 1, expressionEndPos)
	    }
	  }

	  function next () {
	    return str.charCodeAt(++index$1)
	  }

	  function eof () {
	    return index$1 >= len
	  }

	  function isStringStart (chr) {
	    return chr === 0x22 || chr === 0x27
	  }

	  function parseBracket (chr) {
	    var inBracket = 1;
	    expressionPos = index$1;
	    while (!eof()) {
	      chr = next();
	      if (isStringStart(chr)) {
	        parseString(chr);
	        continue
	      }
	      if (chr === 0x5B) { inBracket++; }
	      if (chr === 0x5D) { inBracket--; }
	      if (inBracket === 0) {
	        expressionEndPos = index$1;
	        break
	      }
	    }
	  }

	  function parseString (chr) {
	    var stringQuote = chr;
	    while (!eof()) {
	      chr = next();
	      if (chr === stringQuote) {
	        break
	      }
	    }
	  }

	  /*  */

	  var warn$1;

	  // in some cases, the event used has to be determined at runtime
	  // so we used some reserved tokens during compile.
	  var RANGE_TOKEN = '__r';
	  var CHECKBOX_RADIO_TOKEN = '__c';

	  function model (
	    el,
	    dir,
	    _warn
	  ) {
	    warn$1 = _warn;
	    var value = dir.value;
	    var modifiers = dir.modifiers;
	    var tag = el.tag;
	    var type = el.attrsMap.type;

	    {
	      // inputs with type="file" are read only and setting the input's
	      // value will throw an error.
	      if (tag === 'input' && type === 'file') {
	        warn$1(
	          "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
	          "File inputs are read only. Use a v-on:change listener instead.",
	          el.rawAttrsMap['v-model']
	        );
	      }
	    }

	    if (el.component) {
	      genComponentModel(el, value, modifiers);
	      // component v-model doesn't need extra runtime
	      return false
	    } else if (tag === 'select') {
	      genSelect(el, value, modifiers);
	    } else if (tag === 'input' && type === 'checkbox') {
	      genCheckboxModel(el, value, modifiers);
	    } else if (tag === 'input' && type === 'radio') {
	      genRadioModel(el, value, modifiers);
	    } else if (tag === 'input' || tag === 'textarea') {
	      genDefaultModel(el, value, modifiers);
	    } else if (!config.isReservedTag(tag)) {
	      genComponentModel(el, value, modifiers);
	      // component v-model doesn't need extra runtime
	      return false
	    } else {
	      warn$1(
	        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
	        "v-model is not supported on this element type. " +
	        'If you are working with contenteditable, it\'s recommended to ' +
	        'wrap a library dedicated for that purpose inside a custom component.',
	        el.rawAttrsMap['v-model']
	      );
	    }

	    // ensure runtime directive metadata
	    return true
	  }

	  function genCheckboxModel (
	    el,
	    value,
	    modifiers
	  ) {
	    var number = modifiers && modifiers.number;
	    var valueBinding = getBindingAttr(el, 'value') || 'null';
	    var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
	    var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
	    addProp(el, 'checked',
	      "Array.isArray(" + value + ")" +
	      "?_i(" + value + "," + valueBinding + ")>-1" + (
	        trueValueBinding === 'true'
	          ? (":(" + value + ")")
	          : (":_q(" + value + "," + trueValueBinding + ")")
	      )
	    );
	    addHandler(el, 'change',
	      "var $$a=" + value + "," +
	          '$$el=$event.target,' +
	          "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
	      'if(Array.isArray($$a)){' +
	        "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
	            '$$i=_i($$a,$$v);' +
	        "if($$el.checked){$$i<0&&(" + (genAssignmentCode(value, '$$a.concat([$$v])')) + ")}" +
	        "else{$$i>-1&&(" + (genAssignmentCode(value, '$$a.slice(0,$$i).concat($$a.slice($$i+1))')) + ")}" +
	      "}else{" + (genAssignmentCode(value, '$$c')) + "}",
	      null, true
	    );
	  }

	  function genRadioModel (
	    el,
	    value,
	    modifiers
	  ) {
	    var number = modifiers && modifiers.number;
	    var valueBinding = getBindingAttr(el, 'value') || 'null';
	    valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
	    addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
	    addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
	  }

	  function genSelect (
	    el,
	    value,
	    modifiers
	  ) {
	    var number = modifiers && modifiers.number;
	    var selectedVal = "Array.prototype.filter" +
	      ".call($event.target.options,function(o){return o.selected})" +
	      ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
	      "return " + (number ? '_n(val)' : 'val') + "})";

	    var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
	    var code = "var $$selectedVal = " + selectedVal + ";";
	    code = code + " " + (genAssignmentCode(value, assignment));
	    addHandler(el, 'change', code, null, true);
	  }

	  function genDefaultModel (
	    el,
	    value,
	    modifiers
	  ) {
	    var type = el.attrsMap.type;

	    // warn if v-bind:value conflicts with v-model
	    // except for inputs with v-bind:type
	    {
	      var value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
	      var typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
	      if (value$1 && !typeBinding) {
	        var binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
	        warn$1(
	          binding + "=\"" + value$1 + "\" conflicts with v-model on the same element " +
	          'because the latter already expands to a value binding internally',
	          el.rawAttrsMap[binding]
	        );
	      }
	    }

	    var ref = modifiers || {};
	    var lazy = ref.lazy;
	    var number = ref.number;
	    var trim = ref.trim;
	    var needCompositionGuard = !lazy && type !== 'range';
	    var event = lazy
	      ? 'change'
	      : type === 'range'
	        ? RANGE_TOKEN
	        : 'input';

	    var valueExpression = '$event.target.value';
	    if (trim) {
	      valueExpression = "$event.target.value.trim()";
	    }
	    if (number) {
	      valueExpression = "_n(" + valueExpression + ")";
	    }

	    var code = genAssignmentCode(value, valueExpression);
	    if (needCompositionGuard) {
	      code = "if($event.target.composing)return;" + code;
	    }

	    addProp(el, 'value', ("(" + value + ")"));
	    addHandler(el, event, code, null, true);
	    if (trim || number) {
	      addHandler(el, 'blur', '$forceUpdate()');
	    }
	  }

	  /*  */

	  // normalize v-model event tokens that can only be determined at runtime.
	  // it's important to place the event as the first in the array because
	  // the whole point is ensuring the v-model callback gets called before
	  // user-attached handlers.
	  function normalizeEvents (on) {
	    /* istanbul ignore if */
	    if (isDef(on[RANGE_TOKEN])) {
	      // IE input[type=range] only supports `change` event
	      var event = isIE ? 'change' : 'input';
	      on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
	      delete on[RANGE_TOKEN];
	    }
	    // This was originally intended to fix #4521 but no longer necessary
	    // after 2.5. Keeping it for backwards compat with generated code from < 2.4
	    /* istanbul ignore if */
	    if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
	      on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
	      delete on[CHECKBOX_RADIO_TOKEN];
	    }
	  }

	  var target$1;

	  function createOnceHandler$1 (event, handler, capture) {
	    var _target = target$1; // save current target element in closure
	    return function onceHandler () {
	      var res = handler.apply(null, arguments);
	      if (res !== null) {
	        remove$2(event, onceHandler, capture, _target);
	      }
	    }
	  }

	  // #9446: Firefox <= 53 (in particular, ESR 52) has incorrect Event.timeStamp
	  // implementation and does not fire microtasks in between event propagation, so
	  // safe to exclude.
	  var useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);

	  function add$1 (
	    name,
	    handler,
	    capture,
	    passive
	  ) {
	    // async edge case #6566: inner click event triggers patch, event handler
	    // attached to outer element during patch, and triggered again. This
	    // happens because browsers fire microtask ticks between event propagation.
	    // the solution is simple: we save the timestamp when a handler is attached,
	    // and the handler would only fire if the event passed to it was fired
	    // AFTER it was attached.
	    if (useMicrotaskFix) {
	      var attachedTimestamp = currentFlushTimestamp;
	      var original = handler;
	      handler = original._wrapper = function (e) {
	        if (
	          // no bubbling, should always fire.
	          // this is just a safety net in case event.timeStamp is unreliable in
	          // certain weird environments...
	          e.target === e.currentTarget ||
	          // event is fired after handler attachment
	          e.timeStamp >= attachedTimestamp ||
	          // bail for environments that have buggy event.timeStamp implementations
	          // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
	          // #9681 QtWebEngine event.timeStamp is negative value
	          e.timeStamp <= 0 ||
	          // #9448 bail if event is fired in another document in a multi-page
	          // electron/nw.js app, since event.timeStamp will be using a different
	          // starting reference
	          e.target.ownerDocument !== document
	        ) {
	          return original.apply(this, arguments)
	        }
	      };
	    }
	    target$1.addEventListener(
	      name,
	      handler,
	      supportsPassive
	        ? { capture: capture, passive: passive }
	        : capture
	    );
	  }

	  function remove$2 (
	    name,
	    handler,
	    capture,
	    _target
	  ) {
	    (_target || target$1).removeEventListener(
	      name,
	      handler._wrapper || handler,
	      capture
	    );
	  }

	  function updateDOMListeners (oldVnode, vnode) {
	    if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
	      return
	    }
	    var on = vnode.data.on || {};
	    var oldOn = oldVnode.data.on || {};
	    target$1 = vnode.elm;
	    normalizeEvents(on);
	    updateListeners(on, oldOn, add$1, remove$2, createOnceHandler$1, vnode.context);
	    target$1 = undefined;
	  }

	  var events = {
	    create: updateDOMListeners,
	    update: updateDOMListeners
	  };

	  /*  */

	  var svgContainer;

	  function updateDOMProps (oldVnode, vnode) {
	    if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
	      return
	    }
	    var key, cur;
	    var elm = vnode.elm;
	    var oldProps = oldVnode.data.domProps || {};
	    var props = vnode.data.domProps || {};
	    // clone observed objects, as the user probably wants to mutate it
	    if (isDef(props.__ob__)) {
	      props = vnode.data.domProps = extend({}, props);
	    }

	    for (key in oldProps) {
	      if (!(key in props)) {
	        elm[key] = '';
	      }
	    }

	    for (key in props) {
	      cur = props[key];
	      // ignore children if the node has textContent or innerHTML,
	      // as these will throw away existing DOM nodes and cause removal errors
	      // on subsequent patches (#3360)
	      if (key === 'textContent' || key === 'innerHTML') {
	        if (vnode.children) { vnode.children.length = 0; }
	        if (cur === oldProps[key]) { continue }
	        // #6601 work around Chrome version <= 55 bug where single textNode
	        // replaced by innerHTML/textContent retains its parentNode property
	        if (elm.childNodes.length === 1) {
	          elm.removeChild(elm.childNodes[0]);
	        }
	      }

	      if (key === 'value' && elm.tagName !== 'PROGRESS') {
	        // store value as _value as well since
	        // non-string values will be stringified
	        elm._value = cur;
	        // avoid resetting cursor position when value is the same
	        var strCur = isUndef(cur) ? '' : String(cur);
	        if (shouldUpdateValue(elm, strCur)) {
	          elm.value = strCur;
	        }
	      } else if (key === 'innerHTML' && isSVG(elm.tagName) && isUndef(elm.innerHTML)) {
	        // IE doesn't support innerHTML for SVG elements
	        svgContainer = svgContainer || document.createElement('div');
	        svgContainer.innerHTML = "<svg>" + cur + "</svg>";
	        var svg = svgContainer.firstChild;
	        while (elm.firstChild) {
	          elm.removeChild(elm.firstChild);
	        }
	        while (svg.firstChild) {
	          elm.appendChild(svg.firstChild);
	        }
	      } else if (
	        // skip the update if old and new VDOM state is the same.
	        // `value` is handled separately because the DOM value may be temporarily
	        // out of sync with VDOM state due to focus, composition and modifiers.
	        // This  #4521 by skipping the unnecesarry `checked` update.
	        cur !== oldProps[key]
	      ) {
	        // some property updates can throw
	        // e.g. `value` on <progress> w/ non-finite value
	        try {
	          elm[key] = cur;
	        } catch (e) {}
	      }
	    }
	  }

	  // check platforms/web/util/attrs.js acceptValue


	  function shouldUpdateValue (elm, checkVal) {
	    return (!elm.composing && (
	      elm.tagName === 'OPTION' ||
	      isNotInFocusAndDirty(elm, checkVal) ||
	      isDirtyWithModifiers(elm, checkVal)
	    ))
	  }

	  function isNotInFocusAndDirty (elm, checkVal) {
	    // return true when textbox (.number and .trim) loses focus and its value is
	    // not equal to the updated value
	    var notInFocus = true;
	    // #6157
	    // work around IE bug when accessing document.activeElement in an iframe
	    try { notInFocus = document.activeElement !== elm; } catch (e) {}
	    return notInFocus && elm.value !== checkVal
	  }

	  function isDirtyWithModifiers (elm, newVal) {
	    var value = elm.value;
	    var modifiers = elm._vModifiers; // injected by v-model runtime
	    if (isDef(modifiers)) {
	      if (modifiers.number) {
	        return toNumber(value) !== toNumber(newVal)
	      }
	      if (modifiers.trim) {
	        return value.trim() !== newVal.trim()
	      }
	    }
	    return value !== newVal
	  }

	  var domProps = {
	    create: updateDOMProps,
	    update: updateDOMProps
	  };

	  /*  */

	  var parseStyleText = cached(function (cssText) {
	    var res = {};
	    var listDelimiter = /;(?![^(]*\))/g;
	    var propertyDelimiter = /:(.+)/;
	    cssText.split(listDelimiter).forEach(function (item) {
	      if (item) {
	        var tmp = item.split(propertyDelimiter);
	        tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
	      }
	    });
	    return res
	  });

	  // merge static and dynamic style data on the same vnode
	  function normalizeStyleData (data) {
	    var style = normalizeStyleBinding(data.style);
	    // static style is pre-processed into an object during compilation
	    // and is always a fresh object, so it's safe to merge into it
	    return data.staticStyle
	      ? extend(data.staticStyle, style)
	      : style
	  }

	  // normalize possible array / string values into Object
	  function normalizeStyleBinding (bindingStyle) {
	    if (Array.isArray(bindingStyle)) {
	      return toObject(bindingStyle)
	    }
	    if (typeof bindingStyle === 'string') {
	      return parseStyleText(bindingStyle)
	    }
	    return bindingStyle
	  }

	  /**
	   * parent component style should be after child's
	   * so that parent component's style could override it
	   */
	  function getStyle (vnode, checkChild) {
	    var res = {};
	    var styleData;

	    if (checkChild) {
	      var childNode = vnode;
	      while (childNode.componentInstance) {
	        childNode = childNode.componentInstance._vnode;
	        if (
	          childNode && childNode.data &&
	          (styleData = normalizeStyleData(childNode.data))
	        ) {
	          extend(res, styleData);
	        }
	      }
	    }

	    if ((styleData = normalizeStyleData(vnode.data))) {
	      extend(res, styleData);
	    }

	    var parentNode = vnode;
	    while ((parentNode = parentNode.parent)) {
	      if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
	        extend(res, styleData);
	      }
	    }
	    return res
	  }

	  /*  */

	  var cssVarRE = /^--/;
	  var importantRE = /\s*!important$/;
	  var setProp = function (el, name, val) {
	    /* istanbul ignore if */
	    if (cssVarRE.test(name)) {
	      el.style.setProperty(name, val);
	    } else if (importantRE.test(val)) {
	      el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
	    } else {
	      var normalizedName = normalize(name);
	      if (Array.isArray(val)) {
	        // Support values array created by autoprefixer, e.g.
	        // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
	        // Set them one by one, and the browser will only set those it can recognize
	        for (var i = 0, len = val.length; i < len; i++) {
	          el.style[normalizedName] = val[i];
	        }
	      } else {
	        el.style[normalizedName] = val;
	      }
	    }
	  };

	  var vendorNames = ['Webkit', 'Moz', 'ms'];

	  var emptyStyle;
	  var normalize = cached(function (prop) {
	    emptyStyle = emptyStyle || document.createElement('div').style;
	    prop = camelize(prop);
	    if (prop !== 'filter' && (prop in emptyStyle)) {
	      return prop
	    }
	    var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
	    for (var i = 0; i < vendorNames.length; i++) {
	      var name = vendorNames[i] + capName;
	      if (name in emptyStyle) {
	        return name
	      }
	    }
	  });

	  function updateStyle (oldVnode, vnode) {
	    var data = vnode.data;
	    var oldData = oldVnode.data;

	    if (isUndef(data.staticStyle) && isUndef(data.style) &&
	      isUndef(oldData.staticStyle) && isUndef(oldData.style)
	    ) {
	      return
	    }

	    var cur, name;
	    var el = vnode.elm;
	    var oldStaticStyle = oldData.staticStyle;
	    var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

	    // if static style exists, stylebinding already merged into it when doing normalizeStyleData
	    var oldStyle = oldStaticStyle || oldStyleBinding;

	    var style = normalizeStyleBinding(vnode.data.style) || {};

	    // store normalized style under a different key for next diff
	    // make sure to clone it if it's reactive, since the user likely wants
	    // to mutate it.
	    vnode.data.normalizedStyle = isDef(style.__ob__)
	      ? extend({}, style)
	      : style;

	    var newStyle = getStyle(vnode, true);

	    for (name in oldStyle) {
	      if (isUndef(newStyle[name])) {
	        setProp(el, name, '');
	      }
	    }
	    for (name in newStyle) {
	      cur = newStyle[name];
	      if (cur !== oldStyle[name]) {
	        // ie9 setting to null has no effect, must use empty string
	        setProp(el, name, cur == null ? '' : cur);
	      }
	    }
	  }

	  var style = {
	    create: updateStyle,
	    update: updateStyle
	  };

	  /*  */

	  var whitespaceRE = /\s+/;

	  /**
	   * Add class with compatibility for SVG since classList is not supported on
	   * SVG elements in IE
	   */
	  function addClass (el, cls) {
	    /* istanbul ignore if */
	    if (!cls || !(cls = cls.trim())) {
	      return
	    }

	    /* istanbul ignore else */
	    if (el.classList) {
	      if (cls.indexOf(' ') > -1) {
	        cls.split(whitespaceRE).forEach(function (c) { return el.classList.add(c); });
	      } else {
	        el.classList.add(cls);
	      }
	    } else {
	      var cur = " " + (el.getAttribute('class') || '') + " ";
	      if (cur.indexOf(' ' + cls + ' ') < 0) {
	        el.setAttribute('class', (cur + cls).trim());
	      }
	    }
	  }

	  /**
	   * Remove class with compatibility for SVG since classList is not supported on
	   * SVG elements in IE
	   */
	  function removeClass (el, cls) {
	    /* istanbul ignore if */
	    if (!cls || !(cls = cls.trim())) {
	      return
	    }

	    /* istanbul ignore else */
	    if (el.classList) {
	      if (cls.indexOf(' ') > -1) {
	        cls.split(whitespaceRE).forEach(function (c) { return el.classList.remove(c); });
	      } else {
	        el.classList.remove(cls);
	      }
	      if (!el.classList.length) {
	        el.removeAttribute('class');
	      }
	    } else {
	      var cur = " " + (el.getAttribute('class') || '') + " ";
	      var tar = ' ' + cls + ' ';
	      while (cur.indexOf(tar) >= 0) {
	        cur = cur.replace(tar, ' ');
	      }
	      cur = cur.trim();
	      if (cur) {
	        el.setAttribute('class', cur);
	      } else {
	        el.removeAttribute('class');
	      }
	    }
	  }

	  /*  */

	  function resolveTransition (def$$1) {
	    if (!def$$1) {
	      return
	    }
	    /* istanbul ignore else */
	    if (typeof def$$1 === 'object') {
	      var res = {};
	      if (def$$1.css !== false) {
	        extend(res, autoCssTransition(def$$1.name || 'v'));
	      }
	      extend(res, def$$1);
	      return res
	    } else if (typeof def$$1 === 'string') {
	      return autoCssTransition(def$$1)
	    }
	  }

	  var autoCssTransition = cached(function (name) {
	    return {
	      enterClass: (name + "-enter"),
	      enterToClass: (name + "-enter-to"),
	      enterActiveClass: (name + "-enter-active"),
	      leaveClass: (name + "-leave"),
	      leaveToClass: (name + "-leave-to"),
	      leaveActiveClass: (name + "-leave-active")
	    }
	  });

	  var hasTransition = inBrowser && !isIE9;
	  var TRANSITION = 'transition';
	  var ANIMATION = 'animation';

	  // Transition property/event sniffing
	  var transitionProp = 'transition';
	  var transitionEndEvent = 'transitionend';
	  var animationProp = 'animation';
	  var animationEndEvent = 'animationend';
	  if (hasTransition) {
	    /* istanbul ignore if */
	    if (window.ontransitionend === undefined &&
	      window.onwebkittransitionend !== undefined
	    ) {
	      transitionProp = 'WebkitTransition';
	      transitionEndEvent = 'webkitTransitionEnd';
	    }
	    if (window.onanimationend === undefined &&
	      window.onwebkitanimationend !== undefined
	    ) {
	      animationProp = 'WebkitAnimation';
	      animationEndEvent = 'webkitAnimationEnd';
	    }
	  }

	  // binding to window is necessary to make hot reload work in IE in strict mode
	  var raf = inBrowser
	    ? window.requestAnimationFrame
	      ? window.requestAnimationFrame.bind(window)
	      : setTimeout
	    : /* istanbul ignore next */ function (fn) { return fn(); };

	  function nextFrame (fn) {
	    raf(function () {
	      raf(fn);
	    });
	  }

	  function addTransitionClass (el, cls) {
	    var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
	    if (transitionClasses.indexOf(cls) < 0) {
	      transitionClasses.push(cls);
	      addClass(el, cls);
	    }
	  }

	  function removeTransitionClass (el, cls) {
	    if (el._transitionClasses) {
	      remove(el._transitionClasses, cls);
	    }
	    removeClass(el, cls);
	  }

	  function whenTransitionEnds (
	    el,
	    expectedType,
	    cb
	  ) {
	    var ref = getTransitionInfo(el, expectedType);
	    var type = ref.type;
	    var timeout = ref.timeout;
	    var propCount = ref.propCount;
	    if (!type) { return cb() }
	    var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
	    var ended = 0;
	    var end = function () {
	      el.removeEventListener(event, onEnd);
	      cb();
	    };
	    var onEnd = function (e) {
	      if (e.target === el) {
	        if (++ended >= propCount) {
	          end();
	        }
	      }
	    };
	    setTimeout(function () {
	      if (ended < propCount) {
	        end();
	      }
	    }, timeout + 1);
	    el.addEventListener(event, onEnd);
	  }

	  var transformRE = /\b(transform|all)(,|$)/;

	  function getTransitionInfo (el, expectedType) {
	    var styles = window.getComputedStyle(el);
	    // JSDOM may return undefined for transition properties
	    var transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
	    var transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
	    var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
	    var animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
	    var animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
	    var animationTimeout = getTimeout(animationDelays, animationDurations);

	    var type;
	    var timeout = 0;
	    var propCount = 0;
	    /* istanbul ignore if */
	    if (expectedType === TRANSITION) {
	      if (transitionTimeout > 0) {
	        type = TRANSITION;
	        timeout = transitionTimeout;
	        propCount = transitionDurations.length;
	      }
	    } else if (expectedType === ANIMATION) {
	      if (animationTimeout > 0) {
	        type = ANIMATION;
	        timeout = animationTimeout;
	        propCount = animationDurations.length;
	      }
	    } else {
	      timeout = Math.max(transitionTimeout, animationTimeout);
	      type = timeout > 0
	        ? transitionTimeout > animationTimeout
	          ? TRANSITION
	          : ANIMATION
	        : null;
	      propCount = type
	        ? type === TRANSITION
	          ? transitionDurations.length
	          : animationDurations.length
	        : 0;
	    }
	    var hasTransform =
	      type === TRANSITION &&
	      transformRE.test(styles[transitionProp + 'Property']);
	    return {
	      type: type,
	      timeout: timeout,
	      propCount: propCount,
	      hasTransform: hasTransform
	    }
	  }

	  function getTimeout (delays, durations) {
	    /* istanbul ignore next */
	    while (delays.length < durations.length) {
	      delays = delays.concat(delays);
	    }

	    return Math.max.apply(null, durations.map(function (d, i) {
	      return toMs(d) + toMs(delays[i])
	    }))
	  }

	  // Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
	  // in a locale-dependent way, using a comma instead of a dot.
	  // If comma is not replaced with a dot, the input will be rounded down (i.e. acting
	  // as a floor function) causing unexpected behaviors
	  function toMs (s) {
	    return Number(s.slice(0, -1).replace(',', '.')) * 1000
	  }

	  /*  */

	  function enter (vnode, toggleDisplay) {
	    var el = vnode.elm;

	    // call leave callback now
	    if (isDef(el._leaveCb)) {
	      el._leaveCb.cancelled = true;
	      el._leaveCb();
	    }

	    var data = resolveTransition(vnode.data.transition);
	    if (isUndef(data)) {
	      return
	    }

	    /* istanbul ignore if */
	    if (isDef(el._enterCb) || el.nodeType !== 1) {
	      return
	    }

	    var css = data.css;
	    var type = data.type;
	    var enterClass = data.enterClass;
	    var enterToClass = data.enterToClass;
	    var enterActiveClass = data.enterActiveClass;
	    var appearClass = data.appearClass;
	    var appearToClass = data.appearToClass;
	    var appearActiveClass = data.appearActiveClass;
	    var beforeEnter = data.beforeEnter;
	    var enter = data.enter;
	    var afterEnter = data.afterEnter;
	    var enterCancelled = data.enterCancelled;
	    var beforeAppear = data.beforeAppear;
	    var appear = data.appear;
	    var afterAppear = data.afterAppear;
	    var appearCancelled = data.appearCancelled;
	    var duration = data.duration;

	    // activeInstance will always be the <transition> component managing this
	    // transition. One edge case to check is when the <transition> is placed
	    // as the root node of a child component. In that case we need to check
	    // <transition>'s parent for appear check.
	    var context = activeInstance;
	    var transitionNode = activeInstance.$vnode;
	    while (transitionNode && transitionNode.parent) {
	      context = transitionNode.context;
	      transitionNode = transitionNode.parent;
	    }

	    var isAppear = !context._isMounted || !vnode.isRootInsert;

	    if (isAppear && !appear && appear !== '') {
	      return
	    }

	    var startClass = isAppear && appearClass
	      ? appearClass
	      : enterClass;
	    var activeClass = isAppear && appearActiveClass
	      ? appearActiveClass
	      : enterActiveClass;
	    var toClass = isAppear && appearToClass
	      ? appearToClass
	      : enterToClass;

	    var beforeEnterHook = isAppear
	      ? (beforeAppear || beforeEnter)
	      : beforeEnter;
	    var enterHook = isAppear
	      ? (typeof appear === 'function' ? appear : enter)
	      : enter;
	    var afterEnterHook = isAppear
	      ? (afterAppear || afterEnter)
	      : afterEnter;
	    var enterCancelledHook = isAppear
	      ? (appearCancelled || enterCancelled)
	      : enterCancelled;

	    var explicitEnterDuration = toNumber(
	      isObject(duration)
	        ? duration.enter
	        : duration
	    );

	    if (explicitEnterDuration != null) {
	      checkDuration(explicitEnterDuration, 'enter', vnode);
	    }

	    var expectsCSS = css !== false && !isIE9;
	    var userWantsControl = getHookArgumentsLength(enterHook);

	    var cb = el._enterCb = once(function () {
	      if (expectsCSS) {
	        removeTransitionClass(el, toClass);
	        removeTransitionClass(el, activeClass);
	      }
	      if (cb.cancelled) {
	        if (expectsCSS) {
	          removeTransitionClass(el, startClass);
	        }
	        enterCancelledHook && enterCancelledHook(el);
	      } else {
	        afterEnterHook && afterEnterHook(el);
	      }
	      el._enterCb = null;
	    });

	    if (!vnode.data.show) {
	      // remove pending leave element on enter by injecting an insert hook
	      mergeVNodeHook(vnode, 'insert', function () {
	        var parent = el.parentNode;
	        var pendingNode = parent && parent._pending && parent._pending[vnode.key];
	        if (pendingNode &&
	          pendingNode.tag === vnode.tag &&
	          pendingNode.elm._leaveCb
	        ) {
	          pendingNode.elm._leaveCb();
	        }
	        enterHook && enterHook(el, cb);
	      });
	    }

	    // start enter transition
	    beforeEnterHook && beforeEnterHook(el);
	    if (expectsCSS) {
	      addTransitionClass(el, startClass);
	      addTransitionClass(el, activeClass);
	      nextFrame(function () {
	        removeTransitionClass(el, startClass);
	        if (!cb.cancelled) {
	          addTransitionClass(el, toClass);
	          if (!userWantsControl) {
	            if (isValidDuration(explicitEnterDuration)) {
	              setTimeout(cb, explicitEnterDuration);
	            } else {
	              whenTransitionEnds(el, type, cb);
	            }
	          }
	        }
	      });
	    }

	    if (vnode.data.show) {
	      toggleDisplay && toggleDisplay();
	      enterHook && enterHook(el, cb);
	    }

	    if (!expectsCSS && !userWantsControl) {
	      cb();
	    }
	  }

	  function leave (vnode, rm) {
	    var el = vnode.elm;

	    // call enter callback now
	    if (isDef(el._enterCb)) {
	      el._enterCb.cancelled = true;
	      el._enterCb();
	    }

	    var data = resolveTransition(vnode.data.transition);
	    if (isUndef(data) || el.nodeType !== 1) {
	      return rm()
	    }

	    /* istanbul ignore if */
	    if (isDef(el._leaveCb)) {
	      return
	    }

	    var css = data.css;
	    var type = data.type;
	    var leaveClass = data.leaveClass;
	    var leaveToClass = data.leaveToClass;
	    var leaveActiveClass = data.leaveActiveClass;
	    var beforeLeave = data.beforeLeave;
	    var leave = data.leave;
	    var afterLeave = data.afterLeave;
	    var leaveCancelled = data.leaveCancelled;
	    var delayLeave = data.delayLeave;
	    var duration = data.duration;

	    var expectsCSS = css !== false && !isIE9;
	    var userWantsControl = getHookArgumentsLength(leave);

	    var explicitLeaveDuration = toNumber(
	      isObject(duration)
	        ? duration.leave
	        : duration
	    );

	    if (isDef(explicitLeaveDuration)) {
	      checkDuration(explicitLeaveDuration, 'leave', vnode);
	    }

	    var cb = el._leaveCb = once(function () {
	      if (el.parentNode && el.parentNode._pending) {
	        el.parentNode._pending[vnode.key] = null;
	      }
	      if (expectsCSS) {
	        removeTransitionClass(el, leaveToClass);
	        removeTransitionClass(el, leaveActiveClass);
	      }
	      if (cb.cancelled) {
	        if (expectsCSS) {
	          removeTransitionClass(el, leaveClass);
	        }
	        leaveCancelled && leaveCancelled(el);
	      } else {
	        rm();
	        afterLeave && afterLeave(el);
	      }
	      el._leaveCb = null;
	    });

	    if (delayLeave) {
	      delayLeave(performLeave);
	    } else {
	      performLeave();
	    }

	    function performLeave () {
	      // the delayed leave may have already been cancelled
	      if (cb.cancelled) {
	        return
	      }
	      // record leaving element
	      if (!vnode.data.show && el.parentNode) {
	        (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
	      }
	      beforeLeave && beforeLeave(el);
	      if (expectsCSS) {
	        addTransitionClass(el, leaveClass);
	        addTransitionClass(el, leaveActiveClass);
	        nextFrame(function () {
	          removeTransitionClass(el, leaveClass);
	          if (!cb.cancelled) {
	            addTransitionClass(el, leaveToClass);
	            if (!userWantsControl) {
	              if (isValidDuration(explicitLeaveDuration)) {
	                setTimeout(cb, explicitLeaveDuration);
	              } else {
	                whenTransitionEnds(el, type, cb);
	              }
	            }
	          }
	        });
	      }
	      leave && leave(el, cb);
	      if (!expectsCSS && !userWantsControl) {
	        cb();
	      }
	    }
	  }

	  // only used in dev mode
	  function checkDuration (val, name, vnode) {
	    if (typeof val !== 'number') {
	      warn(
	        "<transition> explicit " + name + " duration is not a valid number - " +
	        "got " + (JSON.stringify(val)) + ".",
	        vnode.context
	      );
	    } else if (isNaN(val)) {
	      warn(
	        "<transition> explicit " + name + " duration is NaN - " +
	        'the duration expression might be incorrect.',
	        vnode.context
	      );
	    }
	  }

	  function isValidDuration (val) {
	    return typeof val === 'number' && !isNaN(val)
	  }

	  /**
	   * Normalize a transition hook's argument length. The hook may be:
	   * - a merged hook (invoker) with the original in .fns
	   * - a wrapped component method (check ._length)
	   * - a plain function (.length)
	   */
	  function getHookArgumentsLength (fn) {
	    if (isUndef(fn)) {
	      return false
	    }
	    var invokerFns = fn.fns;
	    if (isDef(invokerFns)) {
	      // invoker
	      return getHookArgumentsLength(
	        Array.isArray(invokerFns)
	          ? invokerFns[0]
	          : invokerFns
	      )
	    } else {
	      return (fn._length || fn.length) > 1
	    }
	  }

	  function _enter (_, vnode) {
	    if (vnode.data.show !== true) {
	      enter(vnode);
	    }
	  }

	  var transition = inBrowser ? {
	    create: _enter,
	    activate: _enter,
	    remove: function remove$$1 (vnode, rm) {
	      /* istanbul ignore else */
	      if (vnode.data.show !== true) {
	        leave(vnode, rm);
	      } else {
	        rm();
	      }
	    }
	  } : {};

	  var platformModules = [
	    attrs,
	    klass,
	    events,
	    domProps,
	    style,
	    transition
	  ];

	  /*  */

	  // the directive module should be applied last, after all
	  // built-in modules have been applied.
	  var modules = platformModules.concat(baseModules);

	  var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

	  /**
	   * Not type checking this file because flow doesn't like attaching
	   * properties to Elements.
	   */

	  /* istanbul ignore if */
	  if (isIE9) {
	    // http://www.matts411.com/post/internet-explorer-9-oninput/
	    document.addEventListener('selectionchange', function () {
	      var el = document.activeElement;
	      if (el && el.vmodel) {
	        trigger(el, 'input');
	      }
	    });
	  }

	  var directive = {
	    inserted: function inserted (el, binding, vnode, oldVnode) {
	      if (vnode.tag === 'select') {
	        // #6903
	        if (oldVnode.elm && !oldVnode.elm._vOptions) {
	          mergeVNodeHook(vnode, 'postpatch', function () {
	            directive.componentUpdated(el, binding, vnode);
	          });
	        } else {
	          setSelected(el, binding, vnode.context);
	        }
	        el._vOptions = [].map.call(el.options, getValue);
	      } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
	        el._vModifiers = binding.modifiers;
	        if (!binding.modifiers.lazy) {
	          el.addEventListener('compositionstart', onCompositionStart);
	          el.addEventListener('compositionend', onCompositionEnd);
	          // Safari < 10.2 & UIWebView doesn't fire compositionend when
	          // switching focus before confirming composition choice
	          // this also fixes the issue where some browsers e.g. iOS Chrome
	          // fires "change" instead of "input" on autocomplete.
	          el.addEventListener('change', onCompositionEnd);
	          /* istanbul ignore if */
	          if (isIE9) {
	            el.vmodel = true;
	          }
	        }
	      }
	    },

	    componentUpdated: function componentUpdated (el, binding, vnode) {
	      if (vnode.tag === 'select') {
	        setSelected(el, binding, vnode.context);
	        // in case the options rendered by v-for have changed,
	        // it's possible that the value is out-of-sync with the rendered options.
	        // detect such cases and filter out values that no longer has a matching
	        // option in the DOM.
	        var prevOptions = el._vOptions;
	        var curOptions = el._vOptions = [].map.call(el.options, getValue);
	        if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
	          // trigger change event if
	          // no matching option found for at least one value
	          var needReset = el.multiple
	            ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
	            : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
	          if (needReset) {
	            trigger(el, 'change');
	          }
	        }
	      }
	    }
	  };

	  function setSelected (el, binding, vm) {
	    actuallySetSelected(el, binding, vm);
	    /* istanbul ignore if */
	    if (isIE || isEdge) {
	      setTimeout(function () {
	        actuallySetSelected(el, binding, vm);
	      }, 0);
	    }
	  }

	  function actuallySetSelected (el, binding, vm) {
	    var value = binding.value;
	    var isMultiple = el.multiple;
	    if (isMultiple && !Array.isArray(value)) {
	      warn(
	        "<select multiple v-model=\"" + (binding.expression) + "\"> " +
	        "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
	        vm
	      );
	      return
	    }
	    var selected, option;
	    for (var i = 0, l = el.options.length; i < l; i++) {
	      option = el.options[i];
	      if (isMultiple) {
	        selected = looseIndexOf(value, getValue(option)) > -1;
	        if (option.selected !== selected) {
	          option.selected = selected;
	        }
	      } else {
	        if (looseEqual(getValue(option), value)) {
	          if (el.selectedIndex !== i) {
	            el.selectedIndex = i;
	          }
	          return
	        }
	      }
	    }
	    if (!isMultiple) {
	      el.selectedIndex = -1;
	    }
	  }

	  function hasNoMatchingOption (value, options) {
	    return options.every(function (o) { return !looseEqual(o, value); })
	  }

	  function getValue (option) {
	    return '_value' in option
	      ? option._value
	      : option.value
	  }

	  function onCompositionStart (e) {
	    e.target.composing = true;
	  }

	  function onCompositionEnd (e) {
	    // prevent triggering an input event for no reason
	    if (!e.target.composing) { return }
	    e.target.composing = false;
	    trigger(e.target, 'input');
	  }

	  function trigger (el, type) {
	    var e = document.createEvent('HTMLEvents');
	    e.initEvent(type, true, true);
	    el.dispatchEvent(e);
	  }

	  /*  */

	  // recursively search for possible transition defined inside the component root
	  function locateNode (vnode) {
	    return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
	      ? locateNode(vnode.componentInstance._vnode)
	      : vnode
	  }

	  var show = {
	    bind: function bind (el, ref, vnode) {
	      var value = ref.value;

	      vnode = locateNode(vnode);
	      var transition$$1 = vnode.data && vnode.data.transition;
	      var originalDisplay = el.__vOriginalDisplay =
	        el.style.display === 'none' ? '' : el.style.display;
	      if (value && transition$$1) {
	        vnode.data.show = true;
	        enter(vnode, function () {
	          el.style.display = originalDisplay;
	        });
	      } else {
	        el.style.display = value ? originalDisplay : 'none';
	      }
	    },

	    update: function update (el, ref, vnode) {
	      var value = ref.value;
	      var oldValue = ref.oldValue;

	      /* istanbul ignore if */
	      if (!value === !oldValue) { return }
	      vnode = locateNode(vnode);
	      var transition$$1 = vnode.data && vnode.data.transition;
	      if (transition$$1) {
	        vnode.data.show = true;
	        if (value) {
	          enter(vnode, function () {
	            el.style.display = el.__vOriginalDisplay;
	          });
	        } else {
	          leave(vnode, function () {
	            el.style.display = 'none';
	          });
	        }
	      } else {
	        el.style.display = value ? el.__vOriginalDisplay : 'none';
	      }
	    },

	    unbind: function unbind (
	      el,
	      binding,
	      vnode,
	      oldVnode,
	      isDestroy
	    ) {
	      if (!isDestroy) {
	        el.style.display = el.__vOriginalDisplay;
	      }
	    }
	  };

	  var platformDirectives = {
	    model: directive,
	    show: show
	  };

	  /*  */

	  var transitionProps = {
	    name: String,
	    appear: Boolean,
	    css: Boolean,
	    mode: String,
	    type: String,
	    enterClass: String,
	    leaveClass: String,
	    enterToClass: String,
	    leaveToClass: String,
	    enterActiveClass: String,
	    leaveActiveClass: String,
	    appearClass: String,
	    appearActiveClass: String,
	    appearToClass: String,
	    duration: [Number, String, Object]
	  };

	  // in case the child is also an abstract component, e.g. <keep-alive>
	  // we want to recursively retrieve the real component to be rendered
	  function getRealChild (vnode) {
	    var compOptions = vnode && vnode.componentOptions;
	    if (compOptions && compOptions.Ctor.options.abstract) {
	      return getRealChild(getFirstComponentChild(compOptions.children))
	    } else {
	      return vnode
	    }
	  }

	  function extractTransitionData (comp) {
	    var data = {};
	    var options = comp.$options;
	    // props
	    for (var key in options.propsData) {
	      data[key] = comp[key];
	    }
	    // events.
	    // extract listeners and pass them directly to the transition methods
	    var listeners = options._parentListeners;
	    for (var key$1 in listeners) {
	      data[camelize(key$1)] = listeners[key$1];
	    }
	    return data
	  }

	  function placeholder (h, rawChild) {
	    if (/\d-keep-alive$/.test(rawChild.tag)) {
	      return h('keep-alive', {
	        props: rawChild.componentOptions.propsData
	      })
	    }
	  }

	  function hasParentTransition (vnode) {
	    while ((vnode = vnode.parent)) {
	      if (vnode.data.transition) {
	        return true
	      }
	    }
	  }

	  function isSameChild (child, oldChild) {
	    return oldChild.key === child.key && oldChild.tag === child.tag
	  }

	  var isNotTextNode = function (c) { return c.tag || isAsyncPlaceholder(c); };

	  var isVShowDirective = function (d) { return d.name === 'show'; };

	  var Transition = {
	    name: 'transition',
	    props: transitionProps,
	    abstract: true,

	    render: function render (h) {
	      var this$1 = this;

	      var children = this.$slots.default;
	      if (!children) {
	        return
	      }

	      // filter out text nodes (possible whitespaces)
	      children = children.filter(isNotTextNode);
	      /* istanbul ignore if */
	      if (!children.length) {
	        return
	      }

	      // warn multiple elements
	      if (children.length > 1) {
	        warn(
	          '<transition> can only be used on a single element. Use ' +
	          '<transition-group> for lists.',
	          this.$parent
	        );
	      }

	      var mode = this.mode;

	      // warn invalid mode
	      if (mode && mode !== 'in-out' && mode !== 'out-in'
	      ) {
	        warn(
	          'invalid <transition> mode: ' + mode,
	          this.$parent
	        );
	      }

	      var rawChild = children[0];

	      // if this is a component root node and the component's
	      // parent container node also has transition, skip.
	      if (hasParentTransition(this.$vnode)) {
	        return rawChild
	      }

	      // apply transition data to child
	      // use getRealChild() to ignore abstract components e.g. keep-alive
	      var child = getRealChild(rawChild);
	      /* istanbul ignore if */
	      if (!child) {
	        return rawChild
	      }

	      if (this._leaving) {
	        return placeholder(h, rawChild)
	      }

	      // ensure a key that is unique to the vnode type and to this transition
	      // component instance. This key will be used to remove pending leaving nodes
	      // during entering.
	      var id = "__transition-" + (this._uid) + "-";
	      child.key = child.key == null
	        ? child.isComment
	          ? id + 'comment'
	          : id + child.tag
	        : isPrimitive(child.key)
	          ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
	          : child.key;

	      var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
	      var oldRawChild = this._vnode;
	      var oldChild = getRealChild(oldRawChild);

	      // mark v-show
	      // so that the transition module can hand over the control to the directive
	      if (child.data.directives && child.data.directives.some(isVShowDirective)) {
	        child.data.show = true;
	      }

	      if (
	        oldChild &&
	        oldChild.data &&
	        !isSameChild(child, oldChild) &&
	        !isAsyncPlaceholder(oldChild) &&
	        // #6687 component root is a comment node
	        !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
	      ) {
	        // replace old child transition data with fresh one
	        // important for dynamic transitions!
	        var oldData = oldChild.data.transition = extend({}, data);
	        // handle transition mode
	        if (mode === 'out-in') {
	          // return placeholder node and queue update when leave finishes
	          this._leaving = true;
	          mergeVNodeHook(oldData, 'afterLeave', function () {
	            this$1._leaving = false;
	            this$1.$forceUpdate();
	          });
	          return placeholder(h, rawChild)
	        } else if (mode === 'in-out') {
	          if (isAsyncPlaceholder(child)) {
	            return oldRawChild
	          }
	          var delayedLeave;
	          var performLeave = function () { delayedLeave(); };
	          mergeVNodeHook(data, 'afterEnter', performLeave);
	          mergeVNodeHook(data, 'enterCancelled', performLeave);
	          mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
	        }
	      }

	      return rawChild
	    }
	  };

	  /*  */

	  var props = extend({
	    tag: String,
	    moveClass: String
	  }, transitionProps);

	  delete props.mode;

	  var TransitionGroup = {
	    props: props,

	    beforeMount: function beforeMount () {
	      var this$1 = this;

	      var update = this._update;
	      this._update = function (vnode, hydrating) {
	        var restoreActiveInstance = setActiveInstance(this$1);
	        // force removing pass
	        this$1.__patch__(
	          this$1._vnode,
	          this$1.kept,
	          false, // hydrating
	          true // removeOnly (!important, avoids unnecessary moves)
	        );
	        this$1._vnode = this$1.kept;
	        restoreActiveInstance();
	        update.call(this$1, vnode, hydrating);
	      };
	    },

	    render: function render (h) {
	      var tag = this.tag || this.$vnode.data.tag || 'span';
	      var map = Object.create(null);
	      var prevChildren = this.prevChildren = this.children;
	      var rawChildren = this.$slots.default || [];
	      var children = this.children = [];
	      var transitionData = extractTransitionData(this);

	      for (var i = 0; i < rawChildren.length; i++) {
	        var c = rawChildren[i];
	        if (c.tag) {
	          if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
	            children.push(c);
	            map[c.key] = c
	            ;(c.data || (c.data = {})).transition = transitionData;
	          } else {
	            var opts = c.componentOptions;
	            var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
	            warn(("<transition-group> children must be keyed: <" + name + ">"));
	          }
	        }
	      }

	      if (prevChildren) {
	        var kept = [];
	        var removed = [];
	        for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
	          var c$1 = prevChildren[i$1];
	          c$1.data.transition = transitionData;
	          c$1.data.pos = c$1.elm.getBoundingClientRect();
	          if (map[c$1.key]) {
	            kept.push(c$1);
	          } else {
	            removed.push(c$1);
	          }
	        }
	        this.kept = h(tag, null, kept);
	        this.removed = removed;
	      }

	      return h(tag, null, children)
	    },

	    updated: function updated () {
	      var children = this.prevChildren;
	      var moveClass = this.moveClass || ((this.name || 'v') + '-move');
	      if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
	        return
	      }

	      // we divide the work into three loops to avoid mixing DOM reads and writes
	      // in each iteration - which helps prevent layout thrashing.
	      children.forEach(callPendingCbs);
	      children.forEach(recordPosition);
	      children.forEach(applyTranslation);

	      // force reflow to put everything in position
	      // assign to this to avoid being removed in tree-shaking
	      // $flow-disable-line
	      this._reflow = document.body.offsetHeight;

	      children.forEach(function (c) {
	        if (c.data.moved) {
	          var el = c.elm;
	          var s = el.style;
	          addTransitionClass(el, moveClass);
	          s.transform = s.WebkitTransform = s.transitionDuration = '';
	          el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
	            if (e && e.target !== el) {
	              return
	            }
	            if (!e || /transform$/.test(e.propertyName)) {
	              el.removeEventListener(transitionEndEvent, cb);
	              el._moveCb = null;
	              removeTransitionClass(el, moveClass);
	            }
	          });
	        }
	      });
	    },

	    methods: {
	      hasMove: function hasMove (el, moveClass) {
	        /* istanbul ignore if */
	        if (!hasTransition) {
	          return false
	        }
	        /* istanbul ignore if */
	        if (this._hasMove) {
	          return this._hasMove
	        }
	        // Detect whether an element with the move class applied has
	        // CSS transitions. Since the element may be inside an entering
	        // transition at this very moment, we make a clone of it and remove
	        // all other transition classes applied to ensure only the move class
	        // is applied.
	        var clone = el.cloneNode();
	        if (el._transitionClasses) {
	          el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
	        }
	        addClass(clone, moveClass);
	        clone.style.display = 'none';
	        this.$el.appendChild(clone);
	        var info = getTransitionInfo(clone);
	        this.$el.removeChild(clone);
	        return (this._hasMove = info.hasTransform)
	      }
	    }
	  };

	  function callPendingCbs (c) {
	    /* istanbul ignore if */
	    if (c.elm._moveCb) {
	      c.elm._moveCb();
	    }
	    /* istanbul ignore if */
	    if (c.elm._enterCb) {
	      c.elm._enterCb();
	    }
	  }

	  function recordPosition (c) {
	    c.data.newPos = c.elm.getBoundingClientRect();
	  }

	  function applyTranslation (c) {
	    var oldPos = c.data.pos;
	    var newPos = c.data.newPos;
	    var dx = oldPos.left - newPos.left;
	    var dy = oldPos.top - newPos.top;
	    if (dx || dy) {
	      c.data.moved = true;
	      var s = c.elm.style;
	      s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
	      s.transitionDuration = '0s';
	    }
	  }

	  var platformComponents = {
	    Transition: Transition,
	    TransitionGroup: TransitionGroup
	  };

	  /*  */

	  // install platform specific utils
	  Vue.config.mustUseProp = mustUseProp;
	  Vue.config.isReservedTag = isReservedTag;
	  Vue.config.isReservedAttr = isReservedAttr;
	  Vue.config.getTagNamespace = getTagNamespace;
	  Vue.config.isUnknownElement = isUnknownElement;

	  // install platform runtime directives & components
	  extend(Vue.options.directives, platformDirectives);
	  extend(Vue.options.components, platformComponents);

	  // install platform patch function
	  Vue.prototype.__patch__ = inBrowser ? patch : noop;

	  // public mount method
	  Vue.prototype.$mount = function (
	    el,
	    hydrating
	  ) {
	    el = el && inBrowser ? query(el) : undefined;
	    return mountComponent(this, el, hydrating)
	  };

	  // devtools global hook
	  /* istanbul ignore next */
	  if (inBrowser) {
	    setTimeout(function () {
	      if (config.devtools) {
	        if (devtools) {
	          devtools.emit('init', Vue);
	        } else {
	          console[console.info ? 'info' : 'log'](
	            'Download the Vue Devtools extension for a better development experience:\n' +
	            'https://github.com/vuejs/vue-devtools'
	          );
	        }
	      }
	      if (config.productionTip !== false &&
	        typeof console !== 'undefined'
	      ) {
	        console[console.info ? 'info' : 'log'](
	          "You are running Vue in development mode.\n" +
	          "Make sure to turn on production mode when deploying for production.\n" +
	          "See more tips at https://vuejs.org/guide/deployment.html"
	        );
	      }
	    }, 0);
	  }

	  /*  */

	  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
	  var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

	  var buildRegex = cached(function (delimiters) {
	    var open = delimiters[0].replace(regexEscapeRE, '\\$&');
	    var close = delimiters[1].replace(regexEscapeRE, '\\$&');
	    return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
	  });



	  function parseText (
	    text,
	    delimiters
	  ) {
	    var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
	    if (!tagRE.test(text)) {
	      return
	    }
	    var tokens = [];
	    var rawTokens = [];
	    var lastIndex = tagRE.lastIndex = 0;
	    var match, index, tokenValue;
	    while ((match = tagRE.exec(text))) {
	      index = match.index;
	      // push text token
	      if (index > lastIndex) {
	        rawTokens.push(tokenValue = text.slice(lastIndex, index));
	        tokens.push(JSON.stringify(tokenValue));
	      }
	      // tag token
	      var exp = parseFilters(match[1].trim());
	      tokens.push(("_s(" + exp + ")"));
	      rawTokens.push({ '@binding': exp });
	      lastIndex = index + match[0].length;
	    }
	    if (lastIndex < text.length) {
	      rawTokens.push(tokenValue = text.slice(lastIndex));
	      tokens.push(JSON.stringify(tokenValue));
	    }
	    return {
	      expression: tokens.join('+'),
	      tokens: rawTokens
	    }
	  }

	  /*  */

	  function transformNode (el, options) {
	    var warn = options.warn || baseWarn;
	    var staticClass = getAndRemoveAttr(el, 'class');
	    if (staticClass) {
	      var res = parseText(staticClass, options.delimiters);
	      if (res) {
	        warn(
	          "class=\"" + staticClass + "\": " +
	          'Interpolation inside attributes has been removed. ' +
	          'Use v-bind or the colon shorthand instead. For example, ' +
	          'instead of <div class="{{ val }}">, use <div :class="val">.',
	          el.rawAttrsMap['class']
	        );
	      }
	    }
	    if (staticClass) {
	      el.staticClass = JSON.stringify(staticClass);
	    }
	    var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
	    if (classBinding) {
	      el.classBinding = classBinding;
	    }
	  }

	  function genData (el) {
	    var data = '';
	    if (el.staticClass) {
	      data += "staticClass:" + (el.staticClass) + ",";
	    }
	    if (el.classBinding) {
	      data += "class:" + (el.classBinding) + ",";
	    }
	    return data
	  }

	  var klass$1 = {
	    staticKeys: ['staticClass'],
	    transformNode: transformNode,
	    genData: genData
	  };

	  /*  */

	  function transformNode$1 (el, options) {
	    var warn = options.warn || baseWarn;
	    var staticStyle = getAndRemoveAttr(el, 'style');
	    if (staticStyle) {
	      /* istanbul ignore if */
	      {
	        var res = parseText(staticStyle, options.delimiters);
	        if (res) {
	          warn(
	            "style=\"" + staticStyle + "\": " +
	            'Interpolation inside attributes has been removed. ' +
	            'Use v-bind or the colon shorthand instead. For example, ' +
	            'instead of <div style="{{ val }}">, use <div :style="val">.',
	            el.rawAttrsMap['style']
	          );
	        }
	      }
	      el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
	    }

	    var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
	    if (styleBinding) {
	      el.styleBinding = styleBinding;
	    }
	  }

	  function genData$1 (el) {
	    var data = '';
	    if (el.staticStyle) {
	      data += "staticStyle:" + (el.staticStyle) + ",";
	    }
	    if (el.styleBinding) {
	      data += "style:(" + (el.styleBinding) + "),";
	    }
	    return data
	  }

	  var style$1 = {
	    staticKeys: ['staticStyle'],
	    transformNode: transformNode$1,
	    genData: genData$1
	  };

	  /*  */

	  var decoder;

	  var he = {
	    decode: function decode (html) {
	      decoder = decoder || document.createElement('div');
	      decoder.innerHTML = html;
	      return decoder.textContent
	    }
	  };

	  /*  */

	  var isUnaryTag = makeMap(
	    'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
	    'link,meta,param,source,track,wbr'
	  );

	  // Elements that you can, intentionally, leave open
	  // (and which close themselves)
	  var canBeLeftOpenTag = makeMap(
	    'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
	  );

	  // HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
	  // Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
	  var isNonPhrasingTag = makeMap(
	    'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
	    'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
	    'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
	    'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
	    'title,tr,track'
	  );

	  /**
	   * Not type-checking this file because it's mostly vendor code.
	   */

	  // Regular Expressions for parsing tags and attributes
	  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
	  var dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
	  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z" + (unicodeRegExp.source) + "]*";
	  var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
	  var startTagOpen = new RegExp(("^<" + qnameCapture));
	  var startTagClose = /^\s*(\/?)>/;
	  var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
	  var doctype = /^<!DOCTYPE [^>]+>/i;
	  // #7298: escape - to avoid being passed as HTML comment when inlined in page
	  var comment = /^<!\--/;
	  var conditionalComment = /^<!\[/;

	  // Special Elements (can contain anything)
	  var isPlainTextElement = makeMap('script,style,textarea', true);
	  var reCache = {};

	  var decodingMap = {
	    '&lt;': '<',
	    '&gt;': '>',
	    '&quot;': '"',
	    '&amp;': '&',
	    '&#10;': '\n',
	    '&#9;': '\t',
	    '&#39;': "'"
	  };
	  var encodedAttr = /&(?:lt|gt|quot|amp|#39);/g;
	  var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g;

	  // #5992
	  var isIgnoreNewlineTag = makeMap('pre,textarea', true);
	  var shouldIgnoreFirstNewline = function (tag, html) { return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'; };

	  function decodeAttr (value, shouldDecodeNewlines) {
	    var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
	    return value.replace(re, function (match) { return decodingMap[match]; })
	  }

	  function parseHTML (html, options) {
	    var stack = [];
	    var expectHTML = options.expectHTML;
	    var isUnaryTag$$1 = options.isUnaryTag || no;
	    var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
	    var index = 0;
	    var last, lastTag;
	    while (html) {
	      last = html;
	      // Make sure we're not in a plaintext content element like script/style
	      if (!lastTag || !isPlainTextElement(lastTag)) {
	        var textEnd = html.indexOf('<');
	        if (textEnd === 0) {
	          // Comment:
	          if (comment.test(html)) {
	            var commentEnd = html.indexOf('-->');

	            if (commentEnd >= 0) {
	              if (options.shouldKeepComment) {
	                options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3);
	              }
	              advance(commentEnd + 3);
	              continue
	            }
	          }

	          // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
	          if (conditionalComment.test(html)) {
	            var conditionalEnd = html.indexOf(']>');

	            if (conditionalEnd >= 0) {
	              advance(conditionalEnd + 2);
	              continue
	            }
	          }

	          // Doctype:
	          var doctypeMatch = html.match(doctype);
	          if (doctypeMatch) {
	            advance(doctypeMatch[0].length);
	            continue
	          }

	          // End tag:
	          var endTagMatch = html.match(endTag);
	          if (endTagMatch) {
	            var curIndex = index;
	            advance(endTagMatch[0].length);
	            parseEndTag(endTagMatch[1], curIndex, index);
	            continue
	          }

	          // Start tag:
	          var startTagMatch = parseStartTag();
	          if (startTagMatch) {
	            handleStartTag(startTagMatch);
	            if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
	              advance(1);
	            }
	            continue
	          }
	        }

	        var text = (void 0), rest = (void 0), next = (void 0);
	        if (textEnd >= 0) {
	          rest = html.slice(textEnd);
	          while (
	            !endTag.test(rest) &&
	            !startTagOpen.test(rest) &&
	            !comment.test(rest) &&
	            !conditionalComment.test(rest)
	          ) {
	            // < in plain text, be forgiving and treat it as text
	            next = rest.indexOf('<', 1);
	            if (next < 0) { break }
	            textEnd += next;
	            rest = html.slice(textEnd);
	          }
	          text = html.substring(0, textEnd);
	        }

	        if (textEnd < 0) {
	          text = html;
	        }

	        if (text) {
	          advance(text.length);
	        }

	        if (options.chars && text) {
	          options.chars(text, index - text.length, index);
	        }
	      } else {
	        var endTagLength = 0;
	        var stackedTag = lastTag.toLowerCase();
	        var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
	        var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
	          endTagLength = endTag.length;
	          if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
	            text = text
	              .replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
	              .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
	          }
	          if (shouldIgnoreFirstNewline(stackedTag, text)) {
	            text = text.slice(1);
	          }
	          if (options.chars) {
	            options.chars(text);
	          }
	          return ''
	        });
	        index += html.length - rest$1.length;
	        html = rest$1;
	        parseEndTag(stackedTag, index - endTagLength, index);
	      }

	      if (html === last) {
	        options.chars && options.chars(html);
	        if (!stack.length && options.warn) {
	          options.warn(("Mal-formatted tag at end of template: \"" + html + "\""), { start: index + html.length });
	        }
	        break
	      }
	    }

	    // Clean up any remaining tags
	    parseEndTag();

	    function advance (n) {
	      index += n;
	      html = html.substring(n);
	    }

	    function parseStartTag () {
	      var start = html.match(startTagOpen);
	      if (start) {
	        var match = {
	          tagName: start[1],
	          attrs: [],
	          start: index
	        };
	        advance(start[0].length);
	        var end, attr;
	        while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
	          attr.start = index;
	          advance(attr[0].length);
	          attr.end = index;
	          match.attrs.push(attr);
	        }
	        if (end) {
	          match.unarySlash = end[1];
	          advance(end[0].length);
	          match.end = index;
	          return match
	        }
	      }
	    }

	    function handleStartTag (match) {
	      var tagName = match.tagName;
	      var unarySlash = match.unarySlash;

	      if (expectHTML) {
	        if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
	          parseEndTag(lastTag);
	        }
	        if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
	          parseEndTag(tagName);
	        }
	      }

	      var unary = isUnaryTag$$1(tagName) || !!unarySlash;

	      var l = match.attrs.length;
	      var attrs = new Array(l);
	      for (var i = 0; i < l; i++) {
	        var args = match.attrs[i];
	        var value = args[3] || args[4] || args[5] || '';
	        var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
	          ? options.shouldDecodeNewlinesForHref
	          : options.shouldDecodeNewlines;
	        attrs[i] = {
	          name: args[1],
	          value: decodeAttr(value, shouldDecodeNewlines)
	        };
	        if (options.outputSourceRange) {
	          attrs[i].start = args.start + args[0].match(/^\s*/).length;
	          attrs[i].end = args.end;
	        }
	      }

	      if (!unary) {
	        stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs, start: match.start, end: match.end });
	        lastTag = tagName;
	      }

	      if (options.start) {
	        options.start(tagName, attrs, unary, match.start, match.end);
	      }
	    }

	    function parseEndTag (tagName, start, end) {
	      var pos, lowerCasedTagName;
	      if (start == null) { start = index; }
	      if (end == null) { end = index; }

	      // Find the closest opened tag of the same type
	      if (tagName) {
	        lowerCasedTagName = tagName.toLowerCase();
	        for (pos = stack.length - 1; pos >= 0; pos--) {
	          if (stack[pos].lowerCasedTag === lowerCasedTagName) {
	            break
	          }
	        }
	      } else {
	        // If no tag name is provided, clean shop
	        pos = 0;
	      }

	      if (pos >= 0) {
	        // Close all the open elements, up the stack
	        for (var i = stack.length - 1; i >= pos; i--) {
	          if (i > pos || !tagName &&
	            options.warn
	          ) {
	            options.warn(
	              ("tag <" + (stack[i].tag) + "> has no matching end tag."),
	              { start: stack[i].start, end: stack[i].end }
	            );
	          }
	          if (options.end) {
	            options.end(stack[i].tag, start, end);
	          }
	        }

	        // Remove the open elements from the stack
	        stack.length = pos;
	        lastTag = pos && stack[pos - 1].tag;
	      } else if (lowerCasedTagName === 'br') {
	        if (options.start) {
	          options.start(tagName, [], true, start, end);
	        }
	      } else if (lowerCasedTagName === 'p') {
	        if (options.start) {
	          options.start(tagName, [], false, start, end);
	        }
	        if (options.end) {
	          options.end(tagName, start, end);
	        }
	      }
	    }
	  }

	  /*  */

	  var onRE = /^@|^v-on:/;
	  var dirRE = /^v-|^@|^:|^#/;
	  var forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
	  var forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
	  var stripParensRE = /^\(|\)$/g;
	  var dynamicArgRE = /^\[.*\]$/;

	  var argRE = /:(.*)$/;
	  var bindRE = /^:|^\.|^v-bind:/;
	  var modifierRE = /\.[^.\]]+(?=[^\]]*$)/g;

	  var slotRE = /^v-slot(:|$)|^#/;

	  var lineBreakRE = /[\r\n]/;
	  var whitespaceRE$1 = /\s+/g;

	  var invalidAttributeRE = /[\s"'<>\/=]/;

	  var decodeHTMLCached = cached(he.decode);

	  var emptySlotScopeToken = "_empty_";

	  // configurable state
	  var warn$2;
	  var delimiters;
	  var transforms;
	  var preTransforms;
	  var postTransforms;
	  var platformIsPreTag;
	  var platformMustUseProp;
	  var platformGetTagNamespace;
	  var maybeComponent;

	  function createASTElement (
	    tag,
	    attrs,
	    parent
	  ) {
	    return {
	      type: 1,
	      tag: tag,
	      attrsList: attrs,
	      attrsMap: makeAttrsMap(attrs),
	      rawAttrsMap: {},
	      parent: parent,
	      children: []
	    }
	  }

	  /**
	   * Convert HTML string to AST.
	   */
	  function parse (
	    template,
	    options
	  ) {
	    warn$2 = options.warn || baseWarn;

	    platformIsPreTag = options.isPreTag || no;
	    platformMustUseProp = options.mustUseProp || no;
	    platformGetTagNamespace = options.getTagNamespace || no;
	    var isReservedTag = options.isReservedTag || no;
	    maybeComponent = function (el) { return !!el.component || !isReservedTag(el.tag); };

	    transforms = pluckModuleFunction(options.modules, 'transformNode');
	    preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
	    postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

	    delimiters = options.delimiters;

	    var stack = [];
	    var preserveWhitespace = options.preserveWhitespace !== false;
	    var whitespaceOption = options.whitespace;
	    var root;
	    var currentParent;
	    var inVPre = false;
	    var inPre = false;
	    var warned = false;

	    function warnOnce (msg, range) {
	      if (!warned) {
	        warned = true;
	        warn$2(msg, range);
	      }
	    }

	    function closeElement (element) {
	      trimEndingWhitespace(element);
	      if (!inVPre && !element.processed) {
	        element = processElement(element, options);
	      }
	      // tree management
	      if (!stack.length && element !== root) {
	        // allow root elements with v-if, v-else-if and v-else
	        if (root.if && (element.elseif || element.else)) {
	          {
	            checkRootConstraints(element);
	          }
	          addIfCondition(root, {
	            exp: element.elseif,
	            block: element
	          });
	        } else {
	          warnOnce(
	            "Component template should contain exactly one root element. " +
	            "If you are using v-if on multiple elements, " +
	            "use v-else-if to chain them instead.",
	            { start: element.start }
	          );
	        }
	      }
	      if (currentParent && !element.forbidden) {
	        if (element.elseif || element.else) {
	          processIfConditions(element, currentParent);
	        } else {
	          if (element.slotScope) {
	            // scoped slot
	            // keep it in the children list so that v-else(-if) conditions can
	            // find it as the prev node.
	            var name = element.slotTarget || '"default"'
	            ;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
	          }
	          currentParent.children.push(element);
	          element.parent = currentParent;
	        }
	      }

	      // final children cleanup
	      // filter out scoped slots
	      element.children = element.children.filter(function (c) { return !(c).slotScope; });
	      // remove trailing whitespace node again
	      trimEndingWhitespace(element);

	      // check pre state
	      if (element.pre) {
	        inVPre = false;
	      }
	      if (platformIsPreTag(element.tag)) {
	        inPre = false;
	      }
	      // apply post-transforms
	      for (var i = 0; i < postTransforms.length; i++) {
	        postTransforms[i](element, options);
	      }
	    }

	    function trimEndingWhitespace (el) {
	      // remove trailing whitespace node
	      if (!inPre) {
	        var lastNode;
	        while (
	          (lastNode = el.children[el.children.length - 1]) &&
	          lastNode.type === 3 &&
	          lastNode.text === ' '
	        ) {
	          el.children.pop();
	        }
	      }
	    }

	    function checkRootConstraints (el) {
	      if (el.tag === 'slot' || el.tag === 'template') {
	        warnOnce(
	          "Cannot use <" + (el.tag) + "> as component root element because it may " +
	          'contain multiple nodes.',
	          { start: el.start }
	        );
	      }
	      if (el.attrsMap.hasOwnProperty('v-for')) {
	        warnOnce(
	          'Cannot use v-for on stateful component root element because ' +
	          'it renders multiple elements.',
	          el.rawAttrsMap['v-for']
	        );
	      }
	    }

	    parseHTML(template, {
	      warn: warn$2,
	      expectHTML: options.expectHTML,
	      isUnaryTag: options.isUnaryTag,
	      canBeLeftOpenTag: options.canBeLeftOpenTag,
	      shouldDecodeNewlines: options.shouldDecodeNewlines,
	      shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
	      shouldKeepComment: options.comments,
	      outputSourceRange: options.outputSourceRange,
	      start: function start (tag, attrs, unary, start$1, end) {
	        // check namespace.
	        // inherit parent ns if there is one
	        var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

	        // handle IE svg bug
	        /* istanbul ignore if */
	        if (isIE && ns === 'svg') {
	          attrs = guardIESVGBug(attrs);
	        }

	        var element = createASTElement(tag, attrs, currentParent);
	        if (ns) {
	          element.ns = ns;
	        }

	        {
	          if (options.outputSourceRange) {
	            element.start = start$1;
	            element.end = end;
	            element.rawAttrsMap = element.attrsList.reduce(function (cumulated, attr) {
	              cumulated[attr.name] = attr;
	              return cumulated
	            }, {});
	          }
	          attrs.forEach(function (attr) {
	            if (invalidAttributeRE.test(attr.name)) {
	              warn$2(
	                "Invalid dynamic argument expression: attribute names cannot contain " +
	                "spaces, quotes, <, >, / or =.",
	                {
	                  start: attr.start + attr.name.indexOf("["),
	                  end: attr.start + attr.name.length
	                }
	              );
	            }
	          });
	        }

	        if (isForbiddenTag(element) && !isServerRendering()) {
	          element.forbidden = true;
	          warn$2(
	            'Templates should only be responsible for mapping the state to the ' +
	            'UI. Avoid placing tags with side-effects in your templates, such as ' +
	            "<" + tag + ">" + ', as they will not be parsed.',
	            { start: element.start }
	          );
	        }

	        // apply pre-transforms
	        for (var i = 0; i < preTransforms.length; i++) {
	          element = preTransforms[i](element, options) || element;
	        }

	        if (!inVPre) {
	          processPre(element);
	          if (element.pre) {
	            inVPre = true;
	          }
	        }
	        if (platformIsPreTag(element.tag)) {
	          inPre = true;
	        }
	        if (inVPre) {
	          processRawAttrs(element);
	        } else if (!element.processed) {
	          // structural directives
	          processFor(element);
	          processIf(element);
	          processOnce(element);
	        }

	        if (!root) {
	          root = element;
	          {
	            checkRootConstraints(root);
	          }
	        }

	        if (!unary) {
	          currentParent = element;
	          stack.push(element);
	        } else {
	          closeElement(element);
	        }
	      },

	      end: function end (tag, start, end$1) {
	        var element = stack[stack.length - 1];
	        // pop stack
	        stack.length -= 1;
	        currentParent = stack[stack.length - 1];
	        if (options.outputSourceRange) {
	          element.end = end$1;
	        }
	        closeElement(element);
	      },

	      chars: function chars (text, start, end) {
	        if (!currentParent) {
	          {
	            if (text === template) {
	              warnOnce(
	                'Component template requires a root element, rather than just text.',
	                { start: start }
	              );
	            } else if ((text = text.trim())) {
	              warnOnce(
	                ("text \"" + text + "\" outside root element will be ignored."),
	                { start: start }
	              );
	            }
	          }
	          return
	        }
	        // IE textarea placeholder bug
	        /* istanbul ignore if */
	        if (isIE &&
	          currentParent.tag === 'textarea' &&
	          currentParent.attrsMap.placeholder === text
	        ) {
	          return
	        }
	        var children = currentParent.children;
	        if (inPre || text.trim()) {
	          text = isTextTag(currentParent) ? text : decodeHTMLCached(text);
	        } else if (!children.length) {
	          // remove the whitespace-only node right after an opening tag
	          text = '';
	        } else if (whitespaceOption) {
	          if (whitespaceOption === 'condense') {
	            // in condense mode, remove the whitespace node if it contains
	            // line break, otherwise condense to a single space
	            text = lineBreakRE.test(text) ? '' : ' ';
	          } else {
	            text = ' ';
	          }
	        } else {
	          text = preserveWhitespace ? ' ' : '';
	        }
	        if (text) {
	          if (!inPre && whitespaceOption === 'condense') {
	            // condense consecutive whitespaces into single space
	            text = text.replace(whitespaceRE$1, ' ');
	          }
	          var res;
	          var child;
	          if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
	            child = {
	              type: 2,
	              expression: res.expression,
	              tokens: res.tokens,
	              text: text
	            };
	          } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
	            child = {
	              type: 3,
	              text: text
	            };
	          }
	          if (child) {
	            if (options.outputSourceRange) {
	              child.start = start;
	              child.end = end;
	            }
	            children.push(child);
	          }
	        }
	      },
	      comment: function comment (text, start, end) {
	        // adding anyting as a sibling to the root node is forbidden
	        // comments should still be allowed, but ignored
	        if (currentParent) {
	          var child = {
	            type: 3,
	            text: text,
	            isComment: true
	          };
	          if (options.outputSourceRange) {
	            child.start = start;
	            child.end = end;
	          }
	          currentParent.children.push(child);
	        }
	      }
	    });
	    return root
	  }

	  function processPre (el) {
	    if (getAndRemoveAttr(el, 'v-pre') != null) {
	      el.pre = true;
	    }
	  }

	  function processRawAttrs (el) {
	    var list = el.attrsList;
	    var len = list.length;
	    if (len) {
	      var attrs = el.attrs = new Array(len);
	      for (var i = 0; i < len; i++) {
	        attrs[i] = {
	          name: list[i].name,
	          value: JSON.stringify(list[i].value)
	        };
	        if (list[i].start != null) {
	          attrs[i].start = list[i].start;
	          attrs[i].end = list[i].end;
	        }
	      }
	    } else if (!el.pre) {
	      // non root node in pre blocks with no attributes
	      el.plain = true;
	    }
	  }

	  function processElement (
	    element,
	    options
	  ) {
	    processKey(element);

	    // determine whether this is a plain element after
	    // removing structural attributes
	    element.plain = (
	      !element.key &&
	      !element.scopedSlots &&
	      !element.attrsList.length
	    );

	    processRef(element);
	    processSlotContent(element);
	    processSlotOutlet(element);
	    processComponent(element);
	    for (var i = 0; i < transforms.length; i++) {
	      element = transforms[i](element, options) || element;
	    }
	    processAttrs(element);
	    return element
	  }

	  function processKey (el) {
	    var exp = getBindingAttr(el, 'key');
	    if (exp) {
	      {
	        if (el.tag === 'template') {
	          warn$2(
	            "<template> cannot be keyed. Place the key on real elements instead.",
	            getRawBindingAttr(el, 'key')
	          );
	        }
	        if (el.for) {
	          var iterator = el.iterator2 || el.iterator1;
	          var parent = el.parent;
	          if (iterator && iterator === exp && parent && parent.tag === 'transition-group') {
	            warn$2(
	              "Do not use v-for index as key on <transition-group> children, " +
	              "this is the same as not using keys.",
	              getRawBindingAttr(el, 'key'),
	              true /* tip */
	            );
	          }
	        }
	      }
	      el.key = exp;
	    }
	  }

	  function processRef (el) {
	    var ref = getBindingAttr(el, 'ref');
	    if (ref) {
	      el.ref = ref;
	      el.refInFor = checkInFor(el);
	    }
	  }

	  function processFor (el) {
	    var exp;
	    if ((exp = getAndRemoveAttr(el, 'v-for'))) {
	      var res = parseFor(exp);
	      if (res) {
	        extend(el, res);
	      } else {
	        warn$2(
	          ("Invalid v-for expression: " + exp),
	          el.rawAttrsMap['v-for']
	        );
	      }
	    }
	  }



	  function parseFor (exp) {
	    var inMatch = exp.match(forAliasRE);
	    if (!inMatch) { return }
	    var res = {};
	    res.for = inMatch[2].trim();
	    var alias = inMatch[1].trim().replace(stripParensRE, '');
	    var iteratorMatch = alias.match(forIteratorRE);
	    if (iteratorMatch) {
	      res.alias = alias.replace(forIteratorRE, '').trim();
	      res.iterator1 = iteratorMatch[1].trim();
	      if (iteratorMatch[2]) {
	        res.iterator2 = iteratorMatch[2].trim();
	      }
	    } else {
	      res.alias = alias;
	    }
	    return res
	  }

	  function processIf (el) {
	    var exp = getAndRemoveAttr(el, 'v-if');
	    if (exp) {
	      el.if = exp;
	      addIfCondition(el, {
	        exp: exp,
	        block: el
	      });
	    } else {
	      if (getAndRemoveAttr(el, 'v-else') != null) {
	        el.else = true;
	      }
	      var elseif = getAndRemoveAttr(el, 'v-else-if');
	      if (elseif) {
	        el.elseif = elseif;
	      }
	    }
	  }

	  function processIfConditions (el, parent) {
	    var prev = findPrevElement(parent.children);
	    if (prev && prev.if) {
	      addIfCondition(prev, {
	        exp: el.elseif,
	        block: el
	      });
	    } else {
	      warn$2(
	        "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
	        "used on element <" + (el.tag) + "> without corresponding v-if.",
	        el.rawAttrsMap[el.elseif ? 'v-else-if' : 'v-else']
	      );
	    }
	  }

	  function findPrevElement (children) {
	    var i = children.length;
	    while (i--) {
	      if (children[i].type === 1) {
	        return children[i]
	      } else {
	        if (children[i].text !== ' ') {
	          warn$2(
	            "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
	            "will be ignored.",
	            children[i]
	          );
	        }
	        children.pop();
	      }
	    }
	  }

	  function addIfCondition (el, condition) {
	    if (!el.ifConditions) {
	      el.ifConditions = [];
	    }
	    el.ifConditions.push(condition);
	  }

	  function processOnce (el) {
	    var once$$1 = getAndRemoveAttr(el, 'v-once');
	    if (once$$1 != null) {
	      el.once = true;
	    }
	  }

	  // handle content being passed to a component as slot,
	  // e.g. <template slot="xxx">, <div slot-scope="xxx">
	  function processSlotContent (el) {
	    var slotScope;
	    if (el.tag === 'template') {
	      slotScope = getAndRemoveAttr(el, 'scope');
	      /* istanbul ignore if */
	      if (slotScope) {
	        warn$2(
	          "the \"scope\" attribute for scoped slots have been deprecated and " +
	          "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " +
	          "can also be used on plain elements in addition to <template> to " +
	          "denote scoped slots.",
	          el.rawAttrsMap['scope'],
	          true
	        );
	      }
	      el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
	    } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
	      /* istanbul ignore if */
	      if (el.attrsMap['v-for']) {
	        warn$2(
	          "Ambiguous combined usage of slot-scope and v-for on <" + (el.tag) + "> " +
	          "(v-for takes higher priority). Use a wrapper <template> for the " +
	          "scoped slot to make it clearer.",
	          el.rawAttrsMap['slot-scope'],
	          true
	        );
	      }
	      el.slotScope = slotScope;
	    }

	    // slot="xxx"
	    var slotTarget = getBindingAttr(el, 'slot');
	    if (slotTarget) {
	      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
	      el.slotTargetDynamic = !!(el.attrsMap[':slot'] || el.attrsMap['v-bind:slot']);
	      // preserve slot as an attribute for native shadow DOM compat
	      // only for non-scoped slots.
	      if (el.tag !== 'template' && !el.slotScope) {
	        addAttr(el, 'slot', slotTarget, getRawBindingAttr(el, 'slot'));
	      }
	    }

	    // 2.6 v-slot syntax
	    {
	      if (el.tag === 'template') {
	        // v-slot on <template>
	        var slotBinding = getAndRemoveAttrByRegex(el, slotRE);
	        if (slotBinding) {
	          {
	            if (el.slotTarget || el.slotScope) {
	              warn$2(
	                "Unexpected mixed usage of different slot syntaxes.",
	                el
	              );
	            }
	            if (el.parent && !maybeComponent(el.parent)) {
	              warn$2(
	                "<template v-slot> can only appear at the root level inside " +
	                "the receiving component",
	                el
	              );
	            }
	          }
	          var ref = getSlotName(slotBinding);
	          var name = ref.name;
	          var dynamic = ref.dynamic;
	          el.slotTarget = name;
	          el.slotTargetDynamic = dynamic;
	          el.slotScope = slotBinding.value || emptySlotScopeToken; // force it into a scoped slot for perf
	        }
	      } else {
	        // v-slot on component, denotes default slot
	        var slotBinding$1 = getAndRemoveAttrByRegex(el, slotRE);
	        if (slotBinding$1) {
	          {
	            if (!maybeComponent(el)) {
	              warn$2(
	                "v-slot can only be used on components or <template>.",
	                slotBinding$1
	              );
	            }
	            if (el.slotScope || el.slotTarget) {
	              warn$2(
	                "Unexpected mixed usage of different slot syntaxes.",
	                el
	              );
	            }
	            if (el.scopedSlots) {
	              warn$2(
	                "To avoid scope ambiguity, the default slot should also use " +
	                "<template> syntax when there are other named slots.",
	                slotBinding$1
	              );
	            }
	          }
	          // add the component's children to its default slot
	          var slots = el.scopedSlots || (el.scopedSlots = {});
	          var ref$1 = getSlotName(slotBinding$1);
	          var name$1 = ref$1.name;
	          var dynamic$1 = ref$1.dynamic;
	          var slotContainer = slots[name$1] = createASTElement('template', [], el);
	          slotContainer.slotTarget = name$1;
	          slotContainer.slotTargetDynamic = dynamic$1;
	          slotContainer.children = el.children.filter(function (c) {
	            if (!c.slotScope) {
	              c.parent = slotContainer;
	              return true
	            }
	          });
	          slotContainer.slotScope = slotBinding$1.value || emptySlotScopeToken;
	          // remove children as they are returned from scopedSlots now
	          el.children = [];
	          // mark el non-plain so data gets generated
	          el.plain = false;
	        }
	      }
	    }
	  }

	  function getSlotName (binding) {
	    var name = binding.name.replace(slotRE, '');
	    if (!name) {
	      if (binding.name[0] !== '#') {
	        name = 'default';
	      } else {
	        warn$2(
	          "v-slot shorthand syntax requires a slot name.",
	          binding
	        );
	      }
	    }
	    return dynamicArgRE.test(name)
	      // dynamic [name]
	      ? { name: name.slice(1, -1), dynamic: true }
	      // static name
	      : { name: ("\"" + name + "\""), dynamic: false }
	  }

	  // handle <slot/> outlets
	  function processSlotOutlet (el) {
	    if (el.tag === 'slot') {
	      el.slotName = getBindingAttr(el, 'name');
	      if (el.key) {
	        warn$2(
	          "`key` does not work on <slot> because slots are abstract outlets " +
	          "and can possibly expand into multiple elements. " +
	          "Use the key on a wrapping element instead.",
	          getRawBindingAttr(el, 'key')
	        );
	      }
	    }
	  }

	  function processComponent (el) {
	    var binding;
	    if ((binding = getBindingAttr(el, 'is'))) {
	      el.component = binding;
	    }
	    if (getAndRemoveAttr(el, 'inline-template') != null) {
	      el.inlineTemplate = true;
	    }
	  }

	  function processAttrs (el) {
	    var list = el.attrsList;
	    var i, l, name, rawName, value, modifiers, syncGen, isDynamic;
	    for (i = 0, l = list.length; i < l; i++) {
	      name = rawName = list[i].name;
	      value = list[i].value;
	      if (dirRE.test(name)) {
	        // mark element as dynamic
	        el.hasBindings = true;
	        // modifiers
	        modifiers = parseModifiers(name.replace(dirRE, ''));
	        // support .foo shorthand syntax for the .prop modifier
	        if (modifiers) {
	          name = name.replace(modifierRE, '');
	        }
	        if (bindRE.test(name)) { // v-bind
	          name = name.replace(bindRE, '');
	          value = parseFilters(value);
	          isDynamic = dynamicArgRE.test(name);
	          if (isDynamic) {
	            name = name.slice(1, -1);
	          }
	          if (
	            value.trim().length === 0
	          ) {
	            warn$2(
	              ("The value for a v-bind expression cannot be empty. Found in \"v-bind:" + name + "\"")
	            );
	          }
	          if (modifiers) {
	            if (modifiers.prop && !isDynamic) {
	              name = camelize(name);
	              if (name === 'innerHtml') { name = 'innerHTML'; }
	            }
	            if (modifiers.camel && !isDynamic) {
	              name = camelize(name);
	            }
	            if (modifiers.sync) {
	              syncGen = genAssignmentCode(value, "$event");
	              if (!isDynamic) {
	                addHandler(
	                  el,
	                  ("update:" + (camelize(name))),
	                  syncGen,
	                  null,
	                  false,
	                  warn$2,
	                  list[i]
	                );
	                if (hyphenate(name) !== camelize(name)) {
	                  addHandler(
	                    el,
	                    ("update:" + (hyphenate(name))),
	                    syncGen,
	                    null,
	                    false,
	                    warn$2,
	                    list[i]
	                  );
	                }
	              } else {
	                // handler w/ dynamic event name
	                addHandler(
	                  el,
	                  ("\"update:\"+(" + name + ")"),
	                  syncGen,
	                  null,
	                  false,
	                  warn$2,
	                  list[i],
	                  true // dynamic
	                );
	              }
	            }
	          }
	          if ((modifiers && modifiers.prop) || (
	            !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
	          )) {
	            addProp(el, name, value, list[i], isDynamic);
	          } else {
	            addAttr(el, name, value, list[i], isDynamic);
	          }
	        } else if (onRE.test(name)) { // v-on
	          name = name.replace(onRE, '');
	          isDynamic = dynamicArgRE.test(name);
	          if (isDynamic) {
	            name = name.slice(1, -1);
	          }
	          addHandler(el, name, value, modifiers, false, warn$2, list[i], isDynamic);
	        } else { // normal directives
	          name = name.replace(dirRE, '');
	          // parse arg
	          var argMatch = name.match(argRE);
	          var arg = argMatch && argMatch[1];
	          isDynamic = false;
	          if (arg) {
	            name = name.slice(0, -(arg.length + 1));
	            if (dynamicArgRE.test(arg)) {
	              arg = arg.slice(1, -1);
	              isDynamic = true;
	            }
	          }
	          addDirective(el, name, rawName, value, arg, isDynamic, modifiers, list[i]);
	          if (name === 'model') {
	            checkForAliasModel(el, value);
	          }
	        }
	      } else {
	        // literal attribute
	        {
	          var res = parseText(value, delimiters);
	          if (res) {
	            warn$2(
	              name + "=\"" + value + "\": " +
	              'Interpolation inside attributes has been removed. ' +
	              'Use v-bind or the colon shorthand instead. For example, ' +
	              'instead of <div id="{{ val }}">, use <div :id="val">.',
	              list[i]
	            );
	          }
	        }
	        addAttr(el, name, JSON.stringify(value), list[i]);
	        // #6887 firefox doesn't update muted state if set via attribute
	        // even immediately after element creation
	        if (!el.component &&
	            name === 'muted' &&
	            platformMustUseProp(el.tag, el.attrsMap.type, name)) {
	          addProp(el, name, 'true', list[i]);
	        }
	      }
	    }
	  }

	  function checkInFor (el) {
	    var parent = el;
	    while (parent) {
	      if (parent.for !== undefined) {
	        return true
	      }
	      parent = parent.parent;
	    }
	    return false
	  }

	  function parseModifiers (name) {
	    var match = name.match(modifierRE);
	    if (match) {
	      var ret = {};
	      match.forEach(function (m) { ret[m.slice(1)] = true; });
	      return ret
	    }
	  }

	  function makeAttrsMap (attrs) {
	    var map = {};
	    for (var i = 0, l = attrs.length; i < l; i++) {
	      if (
	        map[attrs[i].name] && !isIE && !isEdge
	      ) {
	        warn$2('duplicate attribute: ' + attrs[i].name, attrs[i]);
	      }
	      map[attrs[i].name] = attrs[i].value;
	    }
	    return map
	  }

	  // for script (e.g. type="x/template") or style, do not decode content
	  function isTextTag (el) {
	    return el.tag === 'script' || el.tag === 'style'
	  }

	  function isForbiddenTag (el) {
	    return (
	      el.tag === 'style' ||
	      (el.tag === 'script' && (
	        !el.attrsMap.type ||
	        el.attrsMap.type === 'text/javascript'
	      ))
	    )
	  }

	  var ieNSBug = /^xmlns:NS\d+/;
	  var ieNSPrefix = /^NS\d+:/;

	  /* istanbul ignore next */
	  function guardIESVGBug (attrs) {
	    var res = [];
	    for (var i = 0; i < attrs.length; i++) {
	      var attr = attrs[i];
	      if (!ieNSBug.test(attr.name)) {
	        attr.name = attr.name.replace(ieNSPrefix, '');
	        res.push(attr);
	      }
	    }
	    return res
	  }

	  function checkForAliasModel (el, value) {
	    var _el = el;
	    while (_el) {
	      if (_el.for && _el.alias === value) {
	        warn$2(
	          "<" + (el.tag) + " v-model=\"" + value + "\">: " +
	          "You are binding v-model directly to a v-for iteration alias. " +
	          "This will not be able to modify the v-for source array because " +
	          "writing to the alias is like modifying a function local variable. " +
	          "Consider using an array of objects and use v-model on an object property instead.",
	          el.rawAttrsMap['v-model']
	        );
	      }
	      _el = _el.parent;
	    }
	  }

	  /*  */

	  function preTransformNode (el, options) {
	    if (el.tag === 'input') {
	      var map = el.attrsMap;
	      if (!map['v-model']) {
	        return
	      }

	      var typeBinding;
	      if (map[':type'] || map['v-bind:type']) {
	        typeBinding = getBindingAttr(el, 'type');
	      }
	      if (!map.type && !typeBinding && map['v-bind']) {
	        typeBinding = "(" + (map['v-bind']) + ").type";
	      }

	      if (typeBinding) {
	        var ifCondition = getAndRemoveAttr(el, 'v-if', true);
	        var ifConditionExtra = ifCondition ? ("&&(" + ifCondition + ")") : "";
	        var hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
	        var elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true);
	        // 1. checkbox
	        var branch0 = cloneASTElement(el);
	        // process for on the main node
	        processFor(branch0);
	        addRawAttr(branch0, 'type', 'checkbox');
	        processElement(branch0, options);
	        branch0.processed = true; // prevent it from double-processed
	        branch0.if = "(" + typeBinding + ")==='checkbox'" + ifConditionExtra;
	        addIfCondition(branch0, {
	          exp: branch0.if,
	          block: branch0
	        });
	        // 2. add radio else-if condition
	        var branch1 = cloneASTElement(el);
	        getAndRemoveAttr(branch1, 'v-for', true);
	        addRawAttr(branch1, 'type', 'radio');
	        processElement(branch1, options);
	        addIfCondition(branch0, {
	          exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
	          block: branch1
	        });
	        // 3. other
	        var branch2 = cloneASTElement(el);
	        getAndRemoveAttr(branch2, 'v-for', true);
	        addRawAttr(branch2, ':type', typeBinding);
	        processElement(branch2, options);
	        addIfCondition(branch0, {
	          exp: ifCondition,
	          block: branch2
	        });

	        if (hasElse) {
	          branch0.else = true;
	        } else if (elseIfCondition) {
	          branch0.elseif = elseIfCondition;
	        }

	        return branch0
	      }
	    }
	  }

	  function cloneASTElement (el) {
	    return createASTElement(el.tag, el.attrsList.slice(), el.parent)
	  }

	  var model$1 = {
	    preTransformNode: preTransformNode
	  };

	  var modules$1 = [
	    klass$1,
	    style$1,
	    model$1
	  ];

	  /*  */

	  function text (el, dir) {
	    if (dir.value) {
	      addProp(el, 'textContent', ("_s(" + (dir.value) + ")"), dir);
	    }
	  }

	  /*  */

	  function html (el, dir) {
	    if (dir.value) {
	      addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"), dir);
	    }
	  }

	  var directives$1 = {
	    model: model,
	    text: text,
	    html: html
	  };

	  /*  */

	  var baseOptions = {
	    expectHTML: true,
	    modules: modules$1,
	    directives: directives$1,
	    isPreTag: isPreTag,
	    isUnaryTag: isUnaryTag,
	    mustUseProp: mustUseProp,
	    canBeLeftOpenTag: canBeLeftOpenTag,
	    isReservedTag: isReservedTag,
	    getTagNamespace: getTagNamespace,
	    staticKeys: genStaticKeys(modules$1)
	  };

	  /*  */

	  var isStaticKey;
	  var isPlatformReservedTag;

	  var genStaticKeysCached = cached(genStaticKeys$1);

	  /**
	   * Goal of the optimizer: walk the generated template AST tree
	   * and detect sub-trees that are purely static, i.e. parts of
	   * the DOM that never needs to change.
	   *
	   * Once we detect these sub-trees, we can:
	   *
	   * 1. Hoist them into constants, so that we no longer need to
	   *    create fresh nodes for them on each re-render;
	   * 2. Completely skip them in the patching process.
	   */
	  function optimize (root, options) {
	    if (!root) { return }
	    isStaticKey = genStaticKeysCached(options.staticKeys || '');
	    isPlatformReservedTag = options.isReservedTag || no;
	    // first pass: mark all non-static nodes.
	    markStatic$1(root);
	    // second pass: mark static roots.
	    markStaticRoots(root, false);
	  }

	  function genStaticKeys$1 (keys) {
	    return makeMap(
	      'type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap' +
	      (keys ? ',' + keys : '')
	    )
	  }

	  function markStatic$1 (node) {
	    node.static = isStatic(node);
	    if (node.type === 1) {
	      // do not make component slot content static. this avoids
	      // 1. components not able to mutate slot nodes
	      // 2. static slot content fails for hot-reloading
	      if (
	        !isPlatformReservedTag(node.tag) &&
	        node.tag !== 'slot' &&
	        node.attrsMap['inline-template'] == null
	      ) {
	        return
	      }
	      for (var i = 0, l = node.children.length; i < l; i++) {
	        var child = node.children[i];
	        markStatic$1(child);
	        if (!child.static) {
	          node.static = false;
	        }
	      }
	      if (node.ifConditions) {
	        for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
	          var block = node.ifConditions[i$1].block;
	          markStatic$1(block);
	          if (!block.static) {
	            node.static = false;
	          }
	        }
	      }
	    }
	  }

	  function markStaticRoots (node, isInFor) {
	    if (node.type === 1) {
	      if (node.static || node.once) {
	        node.staticInFor = isInFor;
	      }
	      // For a node to qualify as a static root, it should have children that
	      // are not just static text. Otherwise the cost of hoisting out will
	      // outweigh the benefits and it's better off to just always render it fresh.
	      if (node.static && node.children.length && !(
	        node.children.length === 1 &&
	        node.children[0].type === 3
	      )) {
	        node.staticRoot = true;
	        return
	      } else {
	        node.staticRoot = false;
	      }
	      if (node.children) {
	        for (var i = 0, l = node.children.length; i < l; i++) {
	          markStaticRoots(node.children[i], isInFor || !!node.for);
	        }
	      }
	      if (node.ifConditions) {
	        for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
	          markStaticRoots(node.ifConditions[i$1].block, isInFor);
	        }
	      }
	    }
	  }

	  function isStatic (node) {
	    if (node.type === 2) { // expression
	      return false
	    }
	    if (node.type === 3) { // text
	      return true
	    }
	    return !!(node.pre || (
	      !node.hasBindings && // no dynamic bindings
	      !node.if && !node.for && // not v-if or v-for or v-else
	      !isBuiltInTag(node.tag) && // not a built-in
	      isPlatformReservedTag(node.tag) && // not a component
	      !isDirectChildOfTemplateFor(node) &&
	      Object.keys(node).every(isStaticKey)
	    ))
	  }

	  function isDirectChildOfTemplateFor (node) {
	    while (node.parent) {
	      node = node.parent;
	      if (node.tag !== 'template') {
	        return false
	      }
	      if (node.for) {
	        return true
	      }
	    }
	    return false
	  }

	  /*  */

	  var fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/;
	  var fnInvokeRE = /\([^)]*?\);*$/;
	  var simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;

	  // KeyboardEvent.keyCode aliases
	  var keyCodes = {
	    esc: 27,
	    tab: 9,
	    enter: 13,
	    space: 32,
	    up: 38,
	    left: 37,
	    right: 39,
	    down: 40,
	    'delete': [8, 46]
	  };

	  // KeyboardEvent.key aliases
	  var keyNames = {
	    // #7880: IE11 and Edge use `Esc` for Escape key name.
	    esc: ['Esc', 'Escape'],
	    tab: 'Tab',
	    enter: 'Enter',
	    // #9112: IE11 uses `Spacebar` for Space key name.
	    space: [' ', 'Spacebar'],
	    // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
	    up: ['Up', 'ArrowUp'],
	    left: ['Left', 'ArrowLeft'],
	    right: ['Right', 'ArrowRight'],
	    down: ['Down', 'ArrowDown'],
	    // #9112: IE11 uses `Del` for Delete key name.
	    'delete': ['Backspace', 'Delete', 'Del']
	  };

	  // #4868: modifiers that prevent the execution of the listener
	  // need to explicitly return null so that we can determine whether to remove
	  // the listener for .once
	  var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

	  var modifierCode = {
	    stop: '$event.stopPropagation();',
	    prevent: '$event.preventDefault();',
	    self: genGuard("$event.target !== $event.currentTarget"),
	    ctrl: genGuard("!$event.ctrlKey"),
	    shift: genGuard("!$event.shiftKey"),
	    alt: genGuard("!$event.altKey"),
	    meta: genGuard("!$event.metaKey"),
	    left: genGuard("'button' in $event && $event.button !== 0"),
	    middle: genGuard("'button' in $event && $event.button !== 1"),
	    right: genGuard("'button' in $event && $event.button !== 2")
	  };

	  function genHandlers (
	    events,
	    isNative
	  ) {
	    var prefix = isNative ? 'nativeOn:' : 'on:';
	    var staticHandlers = "";
	    var dynamicHandlers = "";
	    for (var name in events) {
	      var handlerCode = genHandler(events[name]);
	      if (events[name] && events[name].dynamic) {
	        dynamicHandlers += name + "," + handlerCode + ",";
	      } else {
	        staticHandlers += "\"" + name + "\":" + handlerCode + ",";
	      }
	    }
	    staticHandlers = "{" + (staticHandlers.slice(0, -1)) + "}";
	    if (dynamicHandlers) {
	      return prefix + "_d(" + staticHandlers + ",[" + (dynamicHandlers.slice(0, -1)) + "])"
	    } else {
	      return prefix + staticHandlers
	    }
	  }

	  function genHandler (handler) {
	    if (!handler) {
	      return 'function(){}'
	    }

	    if (Array.isArray(handler)) {
	      return ("[" + (handler.map(function (handler) { return genHandler(handler); }).join(',')) + "]")
	    }

	    var isMethodPath = simplePathRE.test(handler.value);
	    var isFunctionExpression = fnExpRE.test(handler.value);
	    var isFunctionInvocation = simplePathRE.test(handler.value.replace(fnInvokeRE, ''));

	    if (!handler.modifiers) {
	      if (isMethodPath || isFunctionExpression) {
	        return handler.value
	      }
	      return ("function($event){" + (isFunctionInvocation ? ("return " + (handler.value)) : handler.value) + "}") // inline statement
	    } else {
	      var code = '';
	      var genModifierCode = '';
	      var keys = [];
	      for (var key in handler.modifiers) {
	        if (modifierCode[key]) {
	          genModifierCode += modifierCode[key];
	          // left/right
	          if (keyCodes[key]) {
	            keys.push(key);
	          }
	        } else if (key === 'exact') {
	          var modifiers = (handler.modifiers);
	          genModifierCode += genGuard(
	            ['ctrl', 'shift', 'alt', 'meta']
	              .filter(function (keyModifier) { return !modifiers[keyModifier]; })
	              .map(function (keyModifier) { return ("$event." + keyModifier + "Key"); })
	              .join('||')
	          );
	        } else {
	          keys.push(key);
	        }
	      }
	      if (keys.length) {
	        code += genKeyFilter(keys);
	      }
	      // Make sure modifiers like prevent and stop get executed after key filtering
	      if (genModifierCode) {
	        code += genModifierCode;
	      }
	      var handlerCode = isMethodPath
	        ? ("return " + (handler.value) + "($event)")
	        : isFunctionExpression
	          ? ("return (" + (handler.value) + ")($event)")
	          : isFunctionInvocation
	            ? ("return " + (handler.value))
	            : handler.value;
	      return ("function($event){" + code + handlerCode + "}")
	    }
	  }

	  function genKeyFilter (keys) {
	    return (
	      // make sure the key filters only apply to KeyboardEvents
	      // #9441: can't use 'keyCode' in $event because Chrome autofill fires fake
	      // key events that do not have keyCode property...
	      "if(!$event.type.indexOf('key')&&" +
	      (keys.map(genFilterCode).join('&&')) + ")return null;"
	    )
	  }

	  function genFilterCode (key) {
	    var keyVal = parseInt(key, 10);
	    if (keyVal) {
	      return ("$event.keyCode!==" + keyVal)
	    }
	    var keyCode = keyCodes[key];
	    var keyName = keyNames[key];
	    return (
	      "_k($event.keyCode," +
	      (JSON.stringify(key)) + "," +
	      (JSON.stringify(keyCode)) + "," +
	      "$event.key," +
	      "" + (JSON.stringify(keyName)) +
	      ")"
	    )
	  }

	  /*  */

	  function on (el, dir) {
	    if (dir.modifiers) {
	      warn("v-on without argument does not support modifiers.");
	    }
	    el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
	  }

	  /*  */

	  function bind$1 (el, dir) {
	    el.wrapData = function (code) {
	      return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
	    };
	  }

	  /*  */

	  var baseDirectives = {
	    on: on,
	    bind: bind$1,
	    cloak: noop
	  };

	  /*  */





	  var CodegenState = function CodegenState (options) {
	    this.options = options;
	    this.warn = options.warn || baseWarn;
	    this.transforms = pluckModuleFunction(options.modules, 'transformCode');
	    this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
	    this.directives = extend(extend({}, baseDirectives), options.directives);
	    var isReservedTag = options.isReservedTag || no;
	    this.maybeComponent = function (el) { return !!el.component || !isReservedTag(el.tag); };
	    this.onceId = 0;
	    this.staticRenderFns = [];
	    this.pre = false;
	  };



	  function generate (
	    ast,
	    options
	  ) {
	    var state = new CodegenState(options);
	    var code = ast ? genElement(ast, state) : '_c("div")';
	    return {
	      render: ("with(this){return " + code + "}"),
	      staticRenderFns: state.staticRenderFns
	    }
	  }

	  function genElement (el, state) {
	    if (el.parent) {
	      el.pre = el.pre || el.parent.pre;
	    }

	    if (el.staticRoot && !el.staticProcessed) {
	      return genStatic(el, state)
	    } else if (el.once && !el.onceProcessed) {
	      return genOnce(el, state)
	    } else if (el.for && !el.forProcessed) {
	      return genFor(el, state)
	    } else if (el.if && !el.ifProcessed) {
	      return genIf(el, state)
	    } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
	      return genChildren(el, state) || 'void 0'
	    } else if (el.tag === 'slot') {
	      return genSlot(el, state)
	    } else {
	      // component or element
	      var code;
	      if (el.component) {
	        code = genComponent(el.component, el, state);
	      } else {
	        var data;
	        if (!el.plain || (el.pre && state.maybeComponent(el))) {
	          data = genData$2(el, state);
	        }

	        var children = el.inlineTemplate ? null : genChildren(el, state, true);
	        code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
	      }
	      // module transforms
	      for (var i = 0; i < state.transforms.length; i++) {
	        code = state.transforms[i](el, code);
	      }
	      return code
	    }
	  }

	  // hoist static sub-trees out
	  function genStatic (el, state) {
	    el.staticProcessed = true;
	    // Some elements (templates) need to behave differently inside of a v-pre
	    // node.  All pre nodes are static roots, so we can use this as a location to
	    // wrap a state change and reset it upon exiting the pre node.
	    var originalPreState = state.pre;
	    if (el.pre) {
	      state.pre = el.pre;
	    }
	    state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
	    state.pre = originalPreState;
	    return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
	  }

	  // v-once
	  function genOnce (el, state) {
	    el.onceProcessed = true;
	    if (el.if && !el.ifProcessed) {
	      return genIf(el, state)
	    } else if (el.staticInFor) {
	      var key = '';
	      var parent = el.parent;
	      while (parent) {
	        if (parent.for) {
	          key = parent.key;
	          break
	        }
	        parent = parent.parent;
	      }
	      if (!key) {
	        state.warn(
	          "v-once can only be used inside v-for that is keyed. ",
	          el.rawAttrsMap['v-once']
	        );
	        return genElement(el, state)
	      }
	      return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")")
	    } else {
	      return genStatic(el, state)
	    }
	  }

	  function genIf (
	    el,
	    state,
	    altGen,
	    altEmpty
	  ) {
	    el.ifProcessed = true; // avoid recursion
	    return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
	  }

	  function genIfConditions (
	    conditions,
	    state,
	    altGen,
	    altEmpty
	  ) {
	    if (!conditions.length) {
	      return altEmpty || '_e()'
	    }

	    var condition = conditions.shift();
	    if (condition.exp) {
	      return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
	    } else {
	      return ("" + (genTernaryExp(condition.block)))
	    }

	    // v-if with v-once should generate code like (a)?_m(0):_m(1)
	    function genTernaryExp (el) {
	      return altGen
	        ? altGen(el, state)
	        : el.once
	          ? genOnce(el, state)
	          : genElement(el, state)
	    }
	  }

	  function genFor (
	    el,
	    state,
	    altGen,
	    altHelper
	  ) {
	    var exp = el.for;
	    var alias = el.alias;
	    var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
	    var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

	    if (state.maybeComponent(el) &&
	      el.tag !== 'slot' &&
	      el.tag !== 'template' &&
	      !el.key
	    ) {
	      state.warn(
	        "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
	        "v-for should have explicit keys. " +
	        "See https://vuejs.org/guide/list.html#key for more info.",
	        el.rawAttrsMap['v-for'],
	        true /* tip */
	      );
	    }

	    el.forProcessed = true; // avoid recursion
	    return (altHelper || '_l') + "((" + exp + ")," +
	      "function(" + alias + iterator1 + iterator2 + "){" +
	        "return " + ((altGen || genElement)(el, state)) +
	      '})'
	  }

	  function genData$2 (el, state) {
	    var data = '{';

	    // directives first.
	    // directives may mutate the el's other properties before they are generated.
	    var dirs = genDirectives(el, state);
	    if (dirs) { data += dirs + ','; }

	    // key
	    if (el.key) {
	      data += "key:" + (el.key) + ",";
	    }
	    // ref
	    if (el.ref) {
	      data += "ref:" + (el.ref) + ",";
	    }
	    if (el.refInFor) {
	      data += "refInFor:true,";
	    }
	    // pre
	    if (el.pre) {
	      data += "pre:true,";
	    }
	    // record original tag name for components using "is" attribute
	    if (el.component) {
	      data += "tag:\"" + (el.tag) + "\",";
	    }
	    // module data generation functions
	    for (var i = 0; i < state.dataGenFns.length; i++) {
	      data += state.dataGenFns[i](el);
	    }
	    // attributes
	    if (el.attrs) {
	      data += "attrs:" + (genProps(el.attrs)) + ",";
	    }
	    // DOM props
	    if (el.props) {
	      data += "domProps:" + (genProps(el.props)) + ",";
	    }
	    // event handlers
	    if (el.events) {
	      data += (genHandlers(el.events, false)) + ",";
	    }
	    if (el.nativeEvents) {
	      data += (genHandlers(el.nativeEvents, true)) + ",";
	    }
	    // slot target
	    // only for non-scoped slots
	    if (el.slotTarget && !el.slotScope) {
	      data += "slot:" + (el.slotTarget) + ",";
	    }
	    // scoped slots
	    if (el.scopedSlots) {
	      data += (genScopedSlots(el, el.scopedSlots, state)) + ",";
	    }
	    // component v-model
	    if (el.model) {
	      data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
	    }
	    // inline-template
	    if (el.inlineTemplate) {
	      var inlineTemplate = genInlineTemplate(el, state);
	      if (inlineTemplate) {
	        data += inlineTemplate + ",";
	      }
	    }
	    data = data.replace(/,$/, '') + '}';
	    // v-bind dynamic argument wrap
	    // v-bind with dynamic arguments must be applied using the same v-bind object
	    // merge helper so that class/style/mustUseProp attrs are handled correctly.
	    if (el.dynamicAttrs) {
	      data = "_b(" + data + ",\"" + (el.tag) + "\"," + (genProps(el.dynamicAttrs)) + ")";
	    }
	    // v-bind data wrap
	    if (el.wrapData) {
	      data = el.wrapData(data);
	    }
	    // v-on data wrap
	    if (el.wrapListeners) {
	      data = el.wrapListeners(data);
	    }
	    return data
	  }

	  function genDirectives (el, state) {
	    var dirs = el.directives;
	    if (!dirs) { return }
	    var res = 'directives:[';
	    var hasRuntime = false;
	    var i, l, dir, needRuntime;
	    for (i = 0, l = dirs.length; i < l; i++) {
	      dir = dirs[i];
	      needRuntime = true;
	      var gen = state.directives[dir.name];
	      if (gen) {
	        // compile-time directive that manipulates AST.
	        // returns true if it also needs a runtime counterpart.
	        needRuntime = !!gen(el, dir, state.warn);
	      }
	      if (needRuntime) {
	        hasRuntime = true;
	        res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:" + (dir.isDynamicArg ? dir.arg : ("\"" + (dir.arg) + "\""))) : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
	      }
	    }
	    if (hasRuntime) {
	      return res.slice(0, -1) + ']'
	    }
	  }

	  function genInlineTemplate (el, state) {
	    var ast = el.children[0];
	    if (el.children.length !== 1 || ast.type !== 1) {
	      state.warn(
	        'Inline-template components must have exactly one child element.',
	        { start: el.start }
	      );
	    }
	    if (ast && ast.type === 1) {
	      var inlineRenderFns = generate(ast, state.options);
	      return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
	    }
	  }

	  function genScopedSlots (
	    el,
	    slots,
	    state
	  ) {
	    // by default scoped slots are considered "stable", this allows child
	    // components with only scoped slots to skip forced updates from parent.
	    // but in some cases we have to bail-out of this optimization
	    // for example if the slot contains dynamic names, has v-if or v-for on them...
	    var needsForceUpdate = el.for || Object.keys(slots).some(function (key) {
	      var slot = slots[key];
	      return (
	        slot.slotTargetDynamic ||
	        slot.if ||
	        slot.for ||
	        containsSlotChild(slot) // is passing down slot from parent which may be dynamic
	      )
	    });

	    // #9534: if a component with scoped slots is inside a conditional branch,
	    // it's possible for the same component to be reused but with different
	    // compiled slot content. To avoid that, we generate a unique key based on
	    // the generated code of all the slot contents.
	    var needsKey = !!el.if;

	    // OR when it is inside another scoped slot or v-for (the reactivity may be
	    // disconnected due to the intermediate scope variable)
	    // #9438, #9506
	    // TODO: this can be further optimized by properly analyzing in-scope bindings
	    // and skip force updating ones that do not actually use scope variables.
	    if (!needsForceUpdate) {
	      var parent = el.parent;
	      while (parent) {
	        if (
	          (parent.slotScope && parent.slotScope !== emptySlotScopeToken) ||
	          parent.for
	        ) {
	          needsForceUpdate = true;
	          break
	        }
	        if (parent.if) {
	          needsKey = true;
	        }
	        parent = parent.parent;
	      }
	    }

	    var generatedSlots = Object.keys(slots)
	      .map(function (key) { return genScopedSlot(slots[key], state); })
	      .join(',');

	    return ("scopedSlots:_u([" + generatedSlots + "]" + (needsForceUpdate ? ",null,true" : "") + (!needsForceUpdate && needsKey ? (",null,false," + (hash(generatedSlots))) : "") + ")")
	  }

	  function hash(str) {
	    var hash = 5381;
	    var i = str.length;
	    while(i) {
	      hash = (hash * 33) ^ str.charCodeAt(--i);
	    }
	    return hash >>> 0
	  }

	  function containsSlotChild (el) {
	    if (el.type === 1) {
	      if (el.tag === 'slot') {
	        return true
	      }
	      return el.children.some(containsSlotChild)
	    }
	    return false
	  }

	  function genScopedSlot (
	    el,
	    state
	  ) {
	    var isLegacySyntax = el.attrsMap['slot-scope'];
	    if (el.if && !el.ifProcessed && !isLegacySyntax) {
	      return genIf(el, state, genScopedSlot, "null")
	    }
	    if (el.for && !el.forProcessed) {
	      return genFor(el, state, genScopedSlot)
	    }
	    var slotScope = el.slotScope === emptySlotScopeToken
	      ? ""
	      : String(el.slotScope);
	    var fn = "function(" + slotScope + "){" +
	      "return " + (el.tag === 'template'
	        ? el.if && isLegacySyntax
	          ? ("(" + (el.if) + ")?" + (genChildren(el, state) || 'undefined') + ":undefined")
	          : genChildren(el, state) || 'undefined'
	        : genElement(el, state)) + "}";
	    // reverse proxy v-slot without scope on this.$slots
	    var reverseProxy = slotScope ? "" : ",proxy:true";
	    return ("{key:" + (el.slotTarget || "\"default\"") + ",fn:" + fn + reverseProxy + "}")
	  }

	  function genChildren (
	    el,
	    state,
	    checkSkip,
	    altGenElement,
	    altGenNode
	  ) {
	    var children = el.children;
	    if (children.length) {
	      var el$1 = children[0];
	      // optimize single v-for
	      if (children.length === 1 &&
	        el$1.for &&
	        el$1.tag !== 'template' &&
	        el$1.tag !== 'slot'
	      ) {
	        var normalizationType = checkSkip
	          ? state.maybeComponent(el$1) ? ",1" : ",0"
	          : "";
	        return ("" + ((altGenElement || genElement)(el$1, state)) + normalizationType)
	      }
	      var normalizationType$1 = checkSkip
	        ? getNormalizationType(children, state.maybeComponent)
	        : 0;
	      var gen = altGenNode || genNode;
	      return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType$1 ? ("," + normalizationType$1) : ''))
	    }
	  }

	  // determine the normalization needed for the children array.
	  // 0: no normalization needed
	  // 1: simple normalization needed (possible 1-level deep nested array)
	  // 2: full normalization needed
	  function getNormalizationType (
	    children,
	    maybeComponent
	  ) {
	    var res = 0;
	    for (var i = 0; i < children.length; i++) {
	      var el = children[i];
	      if (el.type !== 1) {
	        continue
	      }
	      if (needsNormalization(el) ||
	          (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
	        res = 2;
	        break
	      }
	      if (maybeComponent(el) ||
	          (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
	        res = 1;
	      }
	    }
	    return res
	  }

	  function needsNormalization (el) {
	    return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
	  }

	  function genNode (node, state) {
	    if (node.type === 1) {
	      return genElement(node, state)
	    } else if (node.type === 3 && node.isComment) {
	      return genComment(node)
	    } else {
	      return genText(node)
	    }
	  }

	  function genText (text) {
	    return ("_v(" + (text.type === 2
	      ? text.expression // no need for () because already wrapped in _s()
	      : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
	  }

	  function genComment (comment) {
	    return ("_e(" + (JSON.stringify(comment.text)) + ")")
	  }

	  function genSlot (el, state) {
	    var slotName = el.slotName || '"default"';
	    var children = genChildren(el, state);
	    var res = "_t(" + slotName + (children ? ("," + children) : '');
	    var attrs = el.attrs || el.dynamicAttrs
	      ? genProps((el.attrs || []).concat(el.dynamicAttrs || []).map(function (attr) { return ({
	          // slot props are camelized
	          name: camelize(attr.name),
	          value: attr.value,
	          dynamic: attr.dynamic
	        }); }))
	      : null;
	    var bind$$1 = el.attrsMap['v-bind'];
	    if ((attrs || bind$$1) && !children) {
	      res += ",null";
	    }
	    if (attrs) {
	      res += "," + attrs;
	    }
	    if (bind$$1) {
	      res += (attrs ? '' : ',null') + "," + bind$$1;
	    }
	    return res + ')'
	  }

	  // componentName is el.component, take it as argument to shun flow's pessimistic refinement
	  function genComponent (
	    componentName,
	    el,
	    state
	  ) {
	    var children = el.inlineTemplate ? null : genChildren(el, state, true);
	    return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
	  }

	  function genProps (props) {
	    var staticProps = "";
	    var dynamicProps = "";
	    for (var i = 0; i < props.length; i++) {
	      var prop = props[i];
	      var value = transformSpecialNewlines(prop.value);
	      if (prop.dynamic) {
	        dynamicProps += (prop.name) + "," + value + ",";
	      } else {
	        staticProps += "\"" + (prop.name) + "\":" + value + ",";
	      }
	    }
	    staticProps = "{" + (staticProps.slice(0, -1)) + "}";
	    if (dynamicProps) {
	      return ("_d(" + staticProps + ",[" + (dynamicProps.slice(0, -1)) + "])")
	    } else {
	      return staticProps
	    }
	  }

	  // #3895, #4268
	  function transformSpecialNewlines (text) {
	    return text
	      .replace(/\u2028/g, '\\u2028')
	      .replace(/\u2029/g, '\\u2029')
	  }

	  /*  */



	  // these keywords should not appear inside expressions, but operators like
	  // typeof, instanceof and in are allowed
	  var prohibitedKeywordRE = new RegExp('\\b' + (
	    'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
	    'super,throw,while,yield,delete,export,import,return,switch,default,' +
	    'extends,finally,continue,debugger,function,arguments'
	  ).split(',').join('\\b|\\b') + '\\b');

	  // these unary operators should not be used as property/method names
	  var unaryOperatorsRE = new RegExp('\\b' + (
	    'delete,typeof,void'
	  ).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

	  // strip strings in expressions
	  var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

	  // detect problematic expressions in a template
	  function detectErrors (ast, warn) {
	    if (ast) {
	      checkNode(ast, warn);
	    }
	  }

	  function checkNode (node, warn) {
	    if (node.type === 1) {
	      for (var name in node.attrsMap) {
	        if (dirRE.test(name)) {
	          var value = node.attrsMap[name];
	          if (value) {
	            var range = node.rawAttrsMap[name];
	            if (name === 'v-for') {
	              checkFor(node, ("v-for=\"" + value + "\""), warn, range);
	            } else if (name === 'v-slot' || name[0] === '#') {
	              checkFunctionParameterExpression(value, (name + "=\"" + value + "\""), warn, range);
	            } else if (onRE.test(name)) {
	              checkEvent(value, (name + "=\"" + value + "\""), warn, range);
	            } else {
	              checkExpression(value, (name + "=\"" + value + "\""), warn, range);
	            }
	          }
	        }
	      }
	      if (node.children) {
	        for (var i = 0; i < node.children.length; i++) {
	          checkNode(node.children[i], warn);
	        }
	      }
	    } else if (node.type === 2) {
	      checkExpression(node.expression, node.text, warn, node);
	    }
	  }

	  function checkEvent (exp, text, warn, range) {
	    var stripped = exp.replace(stripStringRE, '');
	    var keywordMatch = stripped.match(unaryOperatorsRE);
	    if (keywordMatch && stripped.charAt(keywordMatch.index - 1) !== '$') {
	      warn(
	        "avoid using JavaScript unary operator as property name: " +
	        "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim()),
	        range
	      );
	    }
	    checkExpression(exp, text, warn, range);
	  }

	  function checkFor (node, text, warn, range) {
	    checkExpression(node.for || '', text, warn, range);
	    checkIdentifier(node.alias, 'v-for alias', text, warn, range);
	    checkIdentifier(node.iterator1, 'v-for iterator', text, warn, range);
	    checkIdentifier(node.iterator2, 'v-for iterator', text, warn, range);
	  }

	  function checkIdentifier (
	    ident,
	    type,
	    text,
	    warn,
	    range
	  ) {
	    if (typeof ident === 'string') {
	      try {
	        new Function(("var " + ident + "=_"));
	      } catch (e) {
	        warn(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())), range);
	      }
	    }
	  }

	  function checkExpression (exp, text, warn, range) {
	    try {
	      new Function(("return " + exp));
	    } catch (e) {
	      var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
	      if (keywordMatch) {
	        warn(
	          "avoid using JavaScript keyword as property name: " +
	          "\"" + (keywordMatch[0]) + "\"\n  Raw expression: " + (text.trim()),
	          range
	        );
	      } else {
	        warn(
	          "invalid expression: " + (e.message) + " in\n\n" +
	          "    " + exp + "\n\n" +
	          "  Raw expression: " + (text.trim()) + "\n",
	          range
	        );
	      }
	    }
	  }

	  function checkFunctionParameterExpression (exp, text, warn, range) {
	    try {
	      new Function(exp, '');
	    } catch (e) {
	      warn(
	        "invalid function parameter expression: " + (e.message) + " in\n\n" +
	        "    " + exp + "\n\n" +
	        "  Raw expression: " + (text.trim()) + "\n",
	        range
	      );
	    }
	  }

	  /*  */

	  var range = 2;

	  function generateCodeFrame (
	    source,
	    start,
	    end
	  ) {
	    if ( start === void 0 ) start = 0;
	    if ( end === void 0 ) end = source.length;

	    var lines = source.split(/\r?\n/);
	    var count = 0;
	    var res = [];
	    for (var i = 0; i < lines.length; i++) {
	      count += lines[i].length + 1;
	      if (count >= start) {
	        for (var j = i - range; j <= i + range || end > count; j++) {
	          if (j < 0 || j >= lines.length) { continue }
	          res.push(("" + (j + 1) + (repeat$1(" ", 3 - String(j + 1).length)) + "|  " + (lines[j])));
	          var lineLength = lines[j].length;
	          if (j === i) {
	            // push underline
	            var pad = start - (count - lineLength) + 1;
	            var length = end > count ? lineLength - pad : end - start;
	            res.push("   |  " + repeat$1(" ", pad) + repeat$1("^", length));
	          } else if (j > i) {
	            if (end > count) {
	              var length$1 = Math.min(end - count, lineLength);
	              res.push("   |  " + repeat$1("^", length$1));
	            }
	            count += lineLength + 1;
	          }
	        }
	        break
	      }
	    }
	    return res.join('\n')
	  }

	  function repeat$1 (str, n) {
	    var result = '';
	    if (n > 0) {
	      while (true) { // eslint-disable-line
	        if (n & 1) { result += str; }
	        n >>>= 1;
	        if (n <= 0) { break }
	        str += str;
	      }
	    }
	    return result
	  }

	  /*  */



	  function createFunction (code, errors) {
	    try {
	      return new Function(code)
	    } catch (err) {
	      errors.push({ err: err, code: code });
	      return noop
	    }
	  }

	  function createCompileToFunctionFn (compile) {
	    var cache = Object.create(null);

	    return function compileToFunctions (
	      template,
	      options,
	      vm
	    ) {
	      options = extend({}, options);
	      var warn$$1 = options.warn || warn;
	      delete options.warn;

	      /* istanbul ignore if */
	      {
	        // detect possible CSP restriction
	        try {
	          new Function('return 1');
	        } catch (e) {
	          if (e.toString().match(/unsafe-eval|CSP/)) {
	            warn$$1(
	              'It seems you are using the standalone build of Vue.js in an ' +
	              'environment with Content Security Policy that prohibits unsafe-eval. ' +
	              'The template compiler cannot work in this environment. Consider ' +
	              'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
	              'templates into render functions.'
	            );
	          }
	        }
	      }

	      // check cache
	      var key = options.delimiters
	        ? String(options.delimiters) + template
	        : template;
	      if (cache[key]) {
	        return cache[key]
	      }

	      // compile
	      var compiled = compile(template, options);

	      // check compilation errors/tips
	      {
	        if (compiled.errors && compiled.errors.length) {
	          if (options.outputSourceRange) {
	            compiled.errors.forEach(function (e) {
	              warn$$1(
	                "Error compiling template:\n\n" + (e.msg) + "\n\n" +
	                generateCodeFrame(template, e.start, e.end),
	                vm
	              );
	            });
	          } else {
	            warn$$1(
	              "Error compiling template:\n\n" + template + "\n\n" +
	              compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
	              vm
	            );
	          }
	        }
	        if (compiled.tips && compiled.tips.length) {
	          if (options.outputSourceRange) {
	            compiled.tips.forEach(function (e) { return tip(e.msg, vm); });
	          } else {
	            compiled.tips.forEach(function (msg) { return tip(msg, vm); });
	          }
	        }
	      }

	      // turn code into functions
	      var res = {};
	      var fnGenErrors = [];
	      res.render = createFunction(compiled.render, fnGenErrors);
	      res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
	        return createFunction(code, fnGenErrors)
	      });

	      // check function generation errors.
	      // this should only happen if there is a bug in the compiler itself.
	      // mostly for codegen development use
	      /* istanbul ignore if */
	      {
	        if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
	          warn$$1(
	            "Failed to generate render function:\n\n" +
	            fnGenErrors.map(function (ref) {
	              var err = ref.err;
	              var code = ref.code;

	              return ((err.toString()) + " in\n\n" + code + "\n");
	          }).join('\n'),
	            vm
	          );
	        }
	      }

	      return (cache[key] = res)
	    }
	  }

	  /*  */

	  function createCompilerCreator (baseCompile) {
	    return function createCompiler (baseOptions) {
	      function compile (
	        template,
	        options
	      ) {
	        var finalOptions = Object.create(baseOptions);
	        var errors = [];
	        var tips = [];

	        var warn = function (msg, range, tip) {
	          (tip ? tips : errors).push(msg);
	        };

	        if (options) {
	          if (options.outputSourceRange) {
	            // $flow-disable-line
	            var leadingSpaceLength = template.match(/^\s*/)[0].length;

	            warn = function (msg, range, tip) {
	              var data = { msg: msg };
	              if (range) {
	                if (range.start != null) {
	                  data.start = range.start + leadingSpaceLength;
	                }
	                if (range.end != null) {
	                  data.end = range.end + leadingSpaceLength;
	                }
	              }
	              (tip ? tips : errors).push(data);
	            };
	          }
	          // merge custom modules
	          if (options.modules) {
	            finalOptions.modules =
	              (baseOptions.modules || []).concat(options.modules);
	          }
	          // merge custom directives
	          if (options.directives) {
	            finalOptions.directives = extend(
	              Object.create(baseOptions.directives || null),
	              options.directives
	            );
	          }
	          // copy other options
	          for (var key in options) {
	            if (key !== 'modules' && key !== 'directives') {
	              finalOptions[key] = options[key];
	            }
	          }
	        }

	        finalOptions.warn = warn;

	        var compiled = baseCompile(template.trim(), finalOptions);
	        {
	          detectErrors(compiled.ast, warn);
	        }
	        compiled.errors = errors;
	        compiled.tips = tips;
	        return compiled
	      }

	      return {
	        compile: compile,
	        compileToFunctions: createCompileToFunctionFn(compile)
	      }
	    }
	  }

	  /*  */

	  // `createCompilerCreator` allows creating compilers that use alternative
	  // parser/optimizer/codegen, e.g the SSR optimizing compiler.
	  // Here we just export a default compiler using the default parts.
	  var createCompiler = createCompilerCreator(function baseCompile (
	    template,
	    options
	  ) {
	    var ast = parse(template.trim(), options);
	    if (options.optimize !== false) {
	      optimize(ast, options);
	    }
	    var code = generate(ast, options);
	    return {
	      ast: ast,
	      render: code.render,
	      staticRenderFns: code.staticRenderFns
	    }
	  });

	  /*  */

	  var ref$1 = createCompiler(baseOptions);
	  var compileToFunctions = ref$1.compileToFunctions;

	  /*  */

	  // check whether current browser encodes a char inside attribute values
	  var div;
	  function getShouldDecode (href) {
	    div = div || document.createElement('div');
	    div.innerHTML = href ? "<a href=\"\n\"/>" : "<div a=\"\n\"/>";
	    return div.innerHTML.indexOf('&#10;') > 0
	  }

	  // #3663: IE encodes newlines inside attribute values while other browsers don't
	  var shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
	  // #6828: chrome encodes content in a[href]
	  var shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;

	  /*  */

	  var idToTemplate = cached(function (id) {
	    var el = query(id);
	    return el && el.innerHTML
	  });

	  var mount = Vue.prototype.$mount;
	  Vue.prototype.$mount = function (
	    el,
	    hydrating
	  ) {
	    el = el && query(el);

	    /* istanbul ignore if */
	    if (el === document.body || el === document.documentElement) {
	      warn(
	        "Do not mount Vue to <html> or <body> - mount to normal elements instead."
	      );
	      return this
	    }

	    var options = this.$options;
	    // resolve template/el and convert to render function
	    if (!options.render) {
	      var template = options.template;
	      if (template) {
	        if (typeof template === 'string') {
	          if (template.charAt(0) === '#') {
	            template = idToTemplate(template);
	            /* istanbul ignore if */
	            if (!template) {
	              warn(
	                ("Template element not found or is empty: " + (options.template)),
	                this
	              );
	            }
	          }
	        } else if (template.nodeType) {
	          template = template.innerHTML;
	        } else {
	          {
	            warn('invalid template option:' + template, this);
	          }
	          return this
	        }
	      } else if (el) {
	        template = getOuterHTML(el);
	      }
	      if (template) {
	        /* istanbul ignore if */
	        if (config.performance && mark) {
	          mark('compile');
	        }

	        var ref = compileToFunctions(template, {
	          outputSourceRange: "development" !== 'production',
	          shouldDecodeNewlines: shouldDecodeNewlines,
	          shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
	          delimiters: options.delimiters,
	          comments: options.comments
	        }, this);
	        var render = ref.render;
	        var staticRenderFns = ref.staticRenderFns;
	        options.render = render;
	        options.staticRenderFns = staticRenderFns;

	        /* istanbul ignore if */
	        if (config.performance && mark) {
	          mark('compile end');
	          measure(("vue " + (this._name) + " compile"), 'compile', 'compile end');
	        }
	      }
	    }
	    return mount.call(this, el, hydrating)
	  };

	  /**
	   * Get outerHTML of elements, taking care
	   * of SVG elements in IE as well.
	   */
	  function getOuterHTML (el) {
	    if (el.outerHTML) {
	      return el.outerHTML
	    } else {
	      var container = document.createElement('div');
	      container.appendChild(el.cloneNode(true));
	      return container.innerHTML
	    }
	  }

	  Vue.compile = compileToFunctions;

	  return Vue;

	}));
	});

	var Vue = unwrapExports(vue);

	var socket_io_slim = createCommonjsModule(function (module, exports) {
	/*!
	 * Socket.IO v2.3.0
	 * (c) 2014-2019 Guillermo Rauch
	 * Released under the MIT License.
	 */
	!function(t,e){module.exports=e();}(commonjsGlobal,function(){return function(t){function e(n){if(r[n])return r[n].exports;var o=r[n]={exports:{},id:n,loaded:!1};return t[n].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var r={};return e.m=t,e.c=r,e.p="",e(0)}([function(t,e,r){function n(t,e){"object"===("undefined"==typeof t?"undefined":o(t))&&(e=t,t=void 0),e=e||{};var r,n=i(t),s=n.source,p=n.id,h=n.path,u=c[p]&&h in c[p].nsps,f=e.forceNew||e["force new connection"]||!1===e.multiplex||u;return f?r=a(s,e):(c[p]||(c[p]=a(s,e)),r=c[p]),n.query&&!e.query&&(e.query=n.query),r.socket(n.path,e)}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=r(1),s=r(4),a=r(9);r(3)("socket.io-client");t.exports=e=n;var c=e.managers={};e.protocol=s.protocol,e.connect=n,e.Manager=r(9),e.Socket=r(33);},function(t,e,r){function n(t,e){var r=t;e=e||"undefined"!=typeof location&&location,null==t&&(t=e.protocol+"//"+e.host),"string"==typeof t&&("/"===t.charAt(0)&&(t="/"===t.charAt(1)?e.protocol+t:e.host+t),/^(https?|wss?):\/\//.test(t)||(t="undefined"!=typeof e?e.protocol+"//"+t:"https://"+t),r=o(t)),r.port||(/^(http|ws)$/.test(r.protocol)?r.port="80":/^(http|ws)s$/.test(r.protocol)&&(r.port="443")),r.path=r.path||"/";var n=r.host.indexOf(":")!==-1,i=n?"["+r.host+"]":r.host;return r.id=r.protocol+"://"+i+":"+r.port,r.href=r.protocol+"://"+i+(e&&e.port===r.port?"":":"+r.port),r}var o=r(2);r(3)("socket.io-client:url");t.exports=n;},function(t,e){var r=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,n=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];t.exports=function(t){var e=t,o=t.indexOf("["),i=t.indexOf("]");o!=-1&&i!=-1&&(t=t.substring(0,o)+t.substring(o,i).replace(/:/g,";")+t.substring(i,t.length));for(var s=r.exec(t||""),a={},c=14;c--;)a[n[c]]=s[c]||"";return o!=-1&&i!=-1&&(a.source=e,a.host=a.host.substring(1,a.host.length-1).replace(/;/g,":"),a.authority=a.authority.replace("[","").replace("]","").replace(/;/g,":"),a.ipv6uri=!0),a};},function(t,e){t.exports=function(){return function(){}};},function(t,e,r){function n(){}function o(t){var r=""+t.type;if(e.BINARY_EVENT!==t.type&&e.BINARY_ACK!==t.type||(r+=t.attachments+"-"),t.nsp&&"/"!==t.nsp&&(r+=t.nsp+","),null!=t.id&&(r+=t.id),null!=t.data){var n=i(t.data);if(n===!1)return m;r+=n;}return r}function i(t){try{return JSON.stringify(t)}catch(t){return !1}}function s(t,e){function r(t){var r=l.deconstructPacket(t),n=o(r.packet),i=r.buffers;i.unshift(n),e(i);}l.removeBlobs(t,r);}function a(){this.reconstructor=null;}function c(t){var r=0,n={type:Number(t.charAt(0))};if(null==e.types[n.type])return u("unknown packet type "+n.type);if(e.BINARY_EVENT===n.type||e.BINARY_ACK===n.type){for(var o="";"-"!==t.charAt(++r)&&(o+=t.charAt(r),r!=t.length););if(o!=Number(o)||"-"!==t.charAt(r))throw new Error("Illegal attachments");n.attachments=Number(o);}if("/"===t.charAt(r+1))for(n.nsp="";++r;){var i=t.charAt(r);if(","===i)break;if(n.nsp+=i,r===t.length)break}else n.nsp="/";var s=t.charAt(r+1);if(""!==s&&Number(s)==s){for(n.id="";++r;){var i=t.charAt(r);if(null==i||Number(i)!=i){--r;break}if(n.id+=t.charAt(r),r===t.length)break}n.id=Number(n.id);}if(t.charAt(++r)){var a=p(t.substr(r)),c=a!==!1&&(n.type===e.ERROR||d(a));if(!c)return u("invalid payload");n.data=a;}return n}function p(t){try{return JSON.parse(t)}catch(t){return !1}}function h(t){this.reconPack=t,this.buffers=[];}function u(t){return {type:e.ERROR,data:"parser error: "+t}}var f=(r(3)("socket.io-parser"),r(5)),l=r(6),d=r(7),y=r(8);e.protocol=4,e.types=["CONNECT","DISCONNECT","EVENT","ACK","ERROR","BINARY_EVENT","BINARY_ACK"],e.CONNECT=0,e.DISCONNECT=1,e.EVENT=2,e.ACK=3,e.ERROR=4,e.BINARY_EVENT=5,e.BINARY_ACK=6,e.Encoder=n,e.Decoder=a;var m=e.ERROR+'"encode error"';n.prototype.encode=function(t,r){if(e.BINARY_EVENT===t.type||e.BINARY_ACK===t.type)s(t,r);else{var n=o(t);r([n]);}},f(a.prototype),a.prototype.add=function(t){var r;if("string"==typeof t)r=c(t),e.BINARY_EVENT===r.type||e.BINARY_ACK===r.type?(this.reconstructor=new h(r),0===this.reconstructor.reconPack.attachments&&this.emit("decoded",r)):this.emit("decoded",r);else{if(!y(t)&&!t.base64)throw new Error("Unknown type: "+t);if(!this.reconstructor)throw new Error("got binary data when not reconstructing a packet");r=this.reconstructor.takeBinaryData(t),r&&(this.reconstructor=null,this.emit("decoded",r));}},a.prototype.destroy=function(){this.reconstructor&&this.reconstructor.finishedReconstruction();},h.prototype.takeBinaryData=function(t){if(this.buffers.push(t),this.buffers.length===this.reconPack.attachments){var e=l.reconstructPacket(this.reconPack,this.buffers);return this.finishedReconstruction(),e}return null},h.prototype.finishedReconstruction=function(){this.reconPack=null,this.buffers=[];};},function(t,e,r){function n(t){if(t)return o(t)}function o(t){for(var e in n.prototype)t[e]=n.prototype[e];return t}t.exports=n,n.prototype.on=n.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},n.prototype.once=function(t,e){function r(){this.off(t,r),e.apply(this,arguments);}return r.fn=e,this.on(t,r),this},n.prototype.off=n.prototype.removeListener=n.prototype.removeAllListeners=n.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var r=this._callbacks["$"+t];if(!r)return this;if(1==arguments.length)return delete this._callbacks["$"+t],this;for(var n,o=0;o<r.length;o++)if(n=r[o],n===e||n.fn===e){r.splice(o,1);break}return this},n.prototype.emit=function(t){this._callbacks=this._callbacks||{};var e=[].slice.call(arguments,1),r=this._callbacks["$"+t];if(r){r=r.slice(0);for(var n=0,o=r.length;n<o;++n)r[n].apply(this,e);}return this},n.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},n.prototype.hasListeners=function(t){return !!this.listeners(t).length};},function(t,e,r){function n(t,e){if(!t)return t;if(s(t)){var r={_placeholder:!0,num:e.length};return e.push(t),r}if(i(t)){for(var o=new Array(t.length),a=0;a<t.length;a++)o[a]=n(t[a],e);return o}if("object"==typeof t&&!(t instanceof Date)){var o={};for(var c in t)o[c]=n(t[c],e);return o}return t}function o(t,e){if(!t)return t;if(t&&t._placeholder)return e[t.num];if(i(t))for(var r=0;r<t.length;r++)t[r]=o(t[r],e);else if("object"==typeof t)for(var n in t)t[n]=o(t[n],e);return t}var i=r(7),s=r(8),a=Object.prototype.toString,c="function"==typeof Blob||"undefined"!=typeof Blob&&"[object BlobConstructor]"===a.call(Blob),p="function"==typeof File||"undefined"!=typeof File&&"[object FileConstructor]"===a.call(File);e.deconstructPacket=function(t){var e=[],r=t.data,o=t;return o.data=n(r,e),o.attachments=e.length,{packet:o,buffers:e}},e.reconstructPacket=function(t,e){return t.data=o(t.data,e),t.attachments=void 0,t},e.removeBlobs=function(t,e){function r(t,a,h){if(!t)return t;if(c&&t instanceof Blob||p&&t instanceof File){n++;var u=new FileReader;u.onload=function(){h?h[a]=this.result:o=this.result,--n||e(o);},u.readAsArrayBuffer(t);}else if(i(t))for(var f=0;f<t.length;f++)r(t[f],f,t);else if("object"==typeof t&&!s(t))for(var l in t)r(t[l],l,t);}var n=0,o=t;r(o),n||e(o);};},function(t,e){var r={}.toString;t.exports=Array.isArray||function(t){return "[object Array]"==r.call(t)};},function(t,e){function r(t){return n&&Buffer.isBuffer(t)||o&&(t instanceof ArrayBuffer||i(t))}t.exports=r;var n="function"==typeof Buffer&&"function"==typeof Buffer.isBuffer,o="function"==typeof ArrayBuffer,i=function(t){return "function"==typeof ArrayBuffer.isView?ArrayBuffer.isView(t):t.buffer instanceof ArrayBuffer};},function(t,e,r){function n(t,e){if(!(this instanceof n))return new n(t,e);t&&"object"===("undefined"==typeof t?"undefined":o(t))&&(e=t,t=void 0),e=e||{},e.path=e.path||"/socket.io",this.nsps={},this.subs=[],this.opts=e,this.reconnection(e.reconnection!==!1),this.reconnectionAttempts(e.reconnectionAttempts||1/0),this.reconnectionDelay(e.reconnectionDelay||1e3),this.reconnectionDelayMax(e.reconnectionDelayMax||5e3),this.randomizationFactor(e.randomizationFactor||.5),this.backoff=new f({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(null==e.timeout?2e4:e.timeout),this.readyState="closed",this.uri=t,this.connecting=[],this.lastPing=null,this.encoding=!1,this.packetBuffer=[];var r=e.parser||c;this.encoder=new r.Encoder,this.decoder=new r.Decoder,this.autoConnect=e.autoConnect!==!1,this.autoConnect&&this.open();}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=r(10),s=r(33),a=r(5),c=r(4),p=r(35),h=r(36),u=(r(3)("socket.io-client:manager"),r(32)),f=r(37),l=Object.prototype.hasOwnProperty;t.exports=n,n.prototype.emitAll=function(){this.emit.apply(this,arguments);for(var t in this.nsps)l.call(this.nsps,t)&&this.nsps[t].emit.apply(this.nsps[t],arguments);},n.prototype.updateSocketIds=function(){for(var t in this.nsps)l.call(this.nsps,t)&&(this.nsps[t].id=this.generateId(t));},n.prototype.generateId=function(t){return ("/"===t?"":t+"#")+this.engine.id},a(n.prototype),n.prototype.reconnection=function(t){return arguments.length?(this._reconnection=!!t,this):this._reconnection},n.prototype.reconnectionAttempts=function(t){return arguments.length?(this._reconnectionAttempts=t,this):this._reconnectionAttempts},n.prototype.reconnectionDelay=function(t){return arguments.length?(this._reconnectionDelay=t,this.backoff&&this.backoff.setMin(t),this):this._reconnectionDelay},n.prototype.randomizationFactor=function(t){return arguments.length?(this._randomizationFactor=t,this.backoff&&this.backoff.setJitter(t),this):this._randomizationFactor},n.prototype.reconnectionDelayMax=function(t){return arguments.length?(this._reconnectionDelayMax=t,this.backoff&&this.backoff.setMax(t),this):this._reconnectionDelayMax},n.prototype.timeout=function(t){return arguments.length?(this._timeout=t,this):this._timeout},n.prototype.maybeReconnectOnOpen=function(){!this.reconnecting&&this._reconnection&&0===this.backoff.attempts&&this.reconnect();},n.prototype.open=n.prototype.connect=function(t,e){if(~this.readyState.indexOf("open"))return this;this.engine=i(this.uri,this.opts);var r=this.engine,n=this;this.readyState="opening",this.skipReconnect=!1;var o=p(r,"open",function(){n.onopen(),t&&t();}),s=p(r,"error",function(e){if(n.cleanup(),n.readyState="closed",n.emitAll("connect_error",e),t){var r=new Error("Connection error");r.data=e,t(r);}else n.maybeReconnectOnOpen();});if(!1!==this._timeout){var a=this._timeout,c=setTimeout(function(){o.destroy(),r.close(),r.emit("error","timeout"),n.emitAll("connect_timeout",a);},a);this.subs.push({destroy:function(){clearTimeout(c);}});}return this.subs.push(o),this.subs.push(s),this},n.prototype.onopen=function(){this.cleanup(),this.readyState="open",this.emit("open");var t=this.engine;this.subs.push(p(t,"data",h(this,"ondata"))),this.subs.push(p(t,"ping",h(this,"onping"))),this.subs.push(p(t,"pong",h(this,"onpong"))),this.subs.push(p(t,"error",h(this,"onerror"))),this.subs.push(p(t,"close",h(this,"onclose"))),this.subs.push(p(this.decoder,"decoded",h(this,"ondecoded")));},n.prototype.onping=function(){this.lastPing=new Date,this.emitAll("ping");},n.prototype.onpong=function(){this.emitAll("pong",new Date-this.lastPing);},n.prototype.ondata=function(t){this.decoder.add(t);},n.prototype.ondecoded=function(t){this.emit("packet",t);},n.prototype.onerror=function(t){this.emitAll("error",t);},n.prototype.socket=function(t,e){function r(){~u(o.connecting,n)||o.connecting.push(n);}var n=this.nsps[t];if(!n){n=new s(this,t,e),this.nsps[t]=n;var o=this;n.on("connecting",r),n.on("connect",function(){n.id=o.generateId(t);}),this.autoConnect&&r();}return n},n.prototype.destroy=function(t){var e=u(this.connecting,t);~e&&this.connecting.splice(e,1),this.connecting.length||this.close();},n.prototype.packet=function(t){var e=this;t.query&&0===t.type&&(t.nsp+="?"+t.query),e.encoding?e.packetBuffer.push(t):(e.encoding=!0,this.encoder.encode(t,function(r){for(var n=0;n<r.length;n++)e.engine.write(r[n],t.options);e.encoding=!1,e.processPacketQueue();}));},n.prototype.processPacketQueue=function(){if(this.packetBuffer.length>0&&!this.encoding){var t=this.packetBuffer.shift();this.packet(t);}},n.prototype.cleanup=function(){for(var t=this.subs.length,e=0;e<t;e++){var r=this.subs.shift();r.destroy();}this.packetBuffer=[],this.encoding=!1,this.lastPing=null,this.decoder.destroy();},n.prototype.close=n.prototype.disconnect=function(){this.skipReconnect=!0,this.reconnecting=!1,"opening"===this.readyState&&this.cleanup(),this.backoff.reset(),this.readyState="closed",this.engine&&this.engine.close();},n.prototype.onclose=function(t){this.cleanup(),this.backoff.reset(),this.readyState="closed",this.emit("close",t),this._reconnection&&!this.skipReconnect&&this.reconnect();},n.prototype.reconnect=function(){if(this.reconnecting||this.skipReconnect)return this;var t=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitAll("reconnect_failed"),this.reconnecting=!1;else{var e=this.backoff.duration();this.reconnecting=!0;var r=setTimeout(function(){t.skipReconnect||(t.emitAll("reconnect_attempt",t.backoff.attempts),t.emitAll("reconnecting",t.backoff.attempts),t.skipReconnect||t.open(function(e){e?(t.reconnecting=!1,t.reconnect(),t.emitAll("reconnect_error",e.data)):t.onreconnect();}));},e);this.subs.push({destroy:function(){clearTimeout(r);}});}},n.prototype.onreconnect=function(){var t=this.backoff.attempts;this.reconnecting=!1,this.backoff.reset(),this.updateSocketIds(),this.emitAll("reconnect",t);};},function(t,e,r){t.exports=r(11),t.exports.parser=r(18);},function(t,e,r){function n(t,e){return this instanceof n?(e=e||{},t&&"object"==typeof t&&(e=t,t=null),t?(t=p(t),e.hostname=t.host,e.secure="https"===t.protocol||"wss"===t.protocol,e.port=t.port,t.query&&(e.query=t.query)):e.host&&(e.hostname=p(e.host).host),this.secure=null!=e.secure?e.secure:"undefined"!=typeof location&&"https:"===location.protocol,e.hostname&&!e.port&&(e.port=this.secure?"443":"80"),this.agent=e.agent||!1,this.hostname=e.hostname||("undefined"!=typeof location?location.hostname:"localhost"),this.port=e.port||("undefined"!=typeof location&&location.port?location.port:this.secure?443:80),this.query=e.query||{},"string"==typeof this.query&&(this.query=h.decode(this.query)),this.upgrade=!1!==e.upgrade,this.path=(e.path||"/engine.io").replace(/\/$/,"")+"/",this.forceJSONP=!!e.forceJSONP,this.jsonp=!1!==e.jsonp,this.forceBase64=!!e.forceBase64,this.enablesXDR=!!e.enablesXDR,this.withCredentials=!1!==e.withCredentials,this.timestampParam=e.timestampParam||"t",this.timestampRequests=e.timestampRequests,this.transports=e.transports||["polling","websocket"],this.transportOptions=e.transportOptions||{},this.readyState="",this.writeBuffer=[],this.prevBufferLen=0,this.policyPort=e.policyPort||843,this.rememberUpgrade=e.rememberUpgrade||!1,this.binaryType=null,this.onlyBinaryUpgrades=e.onlyBinaryUpgrades,this.perMessageDeflate=!1!==e.perMessageDeflate&&(e.perMessageDeflate||{}),!0===this.perMessageDeflate&&(this.perMessageDeflate={}),this.perMessageDeflate&&null==this.perMessageDeflate.threshold&&(this.perMessageDeflate.threshold=1024),this.pfx=e.pfx||null,this.key=e.key||null,this.passphrase=e.passphrase||null,this.cert=e.cert||null,this.ca=e.ca||null,this.ciphers=e.ciphers||null,this.rejectUnauthorized=void 0===e.rejectUnauthorized||e.rejectUnauthorized,this.forceNode=!!e.forceNode,this.isReactNative="undefined"!=typeof navigator&&"string"==typeof navigator.product&&"reactnative"===navigator.product.toLowerCase(),("undefined"==typeof self||this.isReactNative)&&(e.extraHeaders&&Object.keys(e.extraHeaders).length>0&&(this.extraHeaders=e.extraHeaders),e.localAddress&&(this.localAddress=e.localAddress)),this.id=null,this.upgrades=null,this.pingInterval=null,this.pingTimeout=null,this.pingIntervalTimer=null,this.pingTimeoutTimer=null,void this.open()):new n(t,e)}function o(t){var e={};for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);return e}var i=r(12),s=r(5),a=(r(3)("engine.io-client:socket"),r(32)),c=r(18),p=r(2),h=r(26);t.exports=n,n.priorWebsocketSuccess=!1,s(n.prototype),n.protocol=c.protocol,n.Socket=n,n.Transport=r(17),n.transports=r(12),n.parser=r(18),n.prototype.createTransport=function(t){var e=o(this.query);e.EIO=c.protocol,e.transport=t;var r=this.transportOptions[t]||{};this.id&&(e.sid=this.id);var n=new i[t]({query:e,socket:this,agent:r.agent||this.agent,hostname:r.hostname||this.hostname,port:r.port||this.port,secure:r.secure||this.secure,path:r.path||this.path,forceJSONP:r.forceJSONP||this.forceJSONP,jsonp:r.jsonp||this.jsonp,forceBase64:r.forceBase64||this.forceBase64,enablesXDR:r.enablesXDR||this.enablesXDR,withCredentials:r.withCredentials||this.withCredentials,timestampRequests:r.timestampRequests||this.timestampRequests,timestampParam:r.timestampParam||this.timestampParam,policyPort:r.policyPort||this.policyPort,pfx:r.pfx||this.pfx,key:r.key||this.key,passphrase:r.passphrase||this.passphrase,cert:r.cert||this.cert,ca:r.ca||this.ca,ciphers:r.ciphers||this.ciphers,rejectUnauthorized:r.rejectUnauthorized||this.rejectUnauthorized,perMessageDeflate:r.perMessageDeflate||this.perMessageDeflate,extraHeaders:r.extraHeaders||this.extraHeaders,forceNode:r.forceNode||this.forceNode,localAddress:r.localAddress||this.localAddress,requestTimeout:r.requestTimeout||this.requestTimeout,protocols:r.protocols||void 0,isReactNative:this.isReactNative});return n},n.prototype.open=function(){var t;if(this.rememberUpgrade&&n.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1)t="websocket";else{if(0===this.transports.length){var e=this;return void setTimeout(function(){e.emit("error","No transports available");},0)}t=this.transports[0];}this.readyState="opening";try{t=this.createTransport(t);}catch(t){return this.transports.shift(),void this.open()}t.open(),this.setTransport(t);},n.prototype.setTransport=function(t){var e=this;this.transport&&this.transport.removeAllListeners(),this.transport=t,t.on("drain",function(){e.onDrain();}).on("packet",function(t){e.onPacket(t);}).on("error",function(t){e.onError(t);}).on("close",function(){e.onClose("transport close");});},n.prototype.probe=function(t){function e(){if(u.onlyBinaryUpgrades){var t=!this.supportsBinary&&u.transport.supportsBinary;h=h||t;}h||(p.send([{type:"ping",data:"probe"}]),p.once("packet",function(t){if(!h)if("pong"===t.type&&"probe"===t.data){if(u.upgrading=!0,u.emit("upgrading",p),!p)return;n.priorWebsocketSuccess="websocket"===p.name,u.transport.pause(function(){h||"closed"!==u.readyState&&(c(),u.setTransport(p),p.send([{type:"upgrade"}]),u.emit("upgrade",p),p=null,u.upgrading=!1,u.flush());});}else{var e=new Error("probe error");e.transport=p.name,u.emit("upgradeError",e);}}));}function r(){h||(h=!0,c(),p.close(),p=null);}function o(t){var e=new Error("probe error: "+t);e.transport=p.name,r(),u.emit("upgradeError",e);}function i(){o("transport closed");}function s(){o("socket closed");}function a(t){p&&t.name!==p.name&&r();}function c(){p.removeListener("open",e),p.removeListener("error",o),p.removeListener("close",i),u.removeListener("close",s),u.removeListener("upgrading",a);}var p=this.createTransport(t,{probe:1}),h=!1,u=this;n.priorWebsocketSuccess=!1,p.once("open",e),p.once("error",o),p.once("close",i),this.once("close",s),this.once("upgrading",a),p.open();},n.prototype.onOpen=function(){if(this.readyState="open",n.priorWebsocketSuccess="websocket"===this.transport.name,this.emit("open"),this.flush(),"open"===this.readyState&&this.upgrade&&this.transport.pause)for(var t=0,e=this.upgrades.length;t<e;t++)this.probe(this.upgrades[t]);},n.prototype.onPacket=function(t){if("opening"===this.readyState||"open"===this.readyState||"closing"===this.readyState)switch(this.emit("packet",t),this.emit("heartbeat"),t.type){case"open":this.onHandshake(JSON.parse(t.data));break;case"pong":this.setPing(),this.emit("pong");break;case"error":var e=new Error("server error");e.code=t.data,this.onError(e);break;case"message":this.emit("data",t.data),this.emit("message",t.data);}},n.prototype.onHandshake=function(t){this.emit("handshake",t),this.id=t.sid,this.transport.query.sid=t.sid,this.upgrades=this.filterUpgrades(t.upgrades),this.pingInterval=t.pingInterval,this.pingTimeout=t.pingTimeout,this.onOpen(),"closed"!==this.readyState&&(this.setPing(),this.removeListener("heartbeat",this.onHeartbeat),this.on("heartbeat",this.onHeartbeat));},n.prototype.onHeartbeat=function(t){clearTimeout(this.pingTimeoutTimer);var e=this;e.pingTimeoutTimer=setTimeout(function(){"closed"!==e.readyState&&e.onClose("ping timeout");},t||e.pingInterval+e.pingTimeout);},n.prototype.setPing=function(){var t=this;clearTimeout(t.pingIntervalTimer),t.pingIntervalTimer=setTimeout(function(){t.ping(),t.onHeartbeat(t.pingTimeout);},t.pingInterval);},n.prototype.ping=function(){var t=this;this.sendPacket("ping",function(){t.emit("ping");});},n.prototype.onDrain=function(){this.writeBuffer.splice(0,this.prevBufferLen),this.prevBufferLen=0,0===this.writeBuffer.length?this.emit("drain"):this.flush();},n.prototype.flush=function(){"closed"!==this.readyState&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length&&(this.transport.send(this.writeBuffer),this.prevBufferLen=this.writeBuffer.length,this.emit("flush"));},n.prototype.write=n.prototype.send=function(t,e,r){return this.sendPacket("message",t,e,r),this},n.prototype.sendPacket=function(t,e,r,n){if("function"==typeof e&&(n=e,e=void 0),"function"==typeof r&&(n=r,r=null),"closing"!==this.readyState&&"closed"!==this.readyState){r=r||{},r.compress=!1!==r.compress;var o={type:t,data:e,options:r};this.emit("packetCreate",o),this.writeBuffer.push(o),n&&this.once("flush",n),this.flush();}},n.prototype.close=function(){function t(){n.onClose("forced close"),n.transport.close();}function e(){n.removeListener("upgrade",e),n.removeListener("upgradeError",e),t();}function r(){n.once("upgrade",e),n.once("upgradeError",e);}if("opening"===this.readyState||"open"===this.readyState){this.readyState="closing";var n=this;this.writeBuffer.length?this.once("drain",function(){this.upgrading?r():t();}):this.upgrading?r():t();}return this},n.prototype.onError=function(t){n.priorWebsocketSuccess=!1,this.emit("error",t),this.onClose("transport error",t);},n.prototype.onClose=function(t,e){if("opening"===this.readyState||"open"===this.readyState||"closing"===this.readyState){var r=this;clearTimeout(this.pingIntervalTimer),clearTimeout(this.pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),this.readyState="closed",this.id=null,this.emit("close",t,e),r.writeBuffer=[],r.prevBufferLen=0;}},n.prototype.filterUpgrades=function(t){for(var e=[],r=0,n=t.length;r<n;r++)~a(this.transports,t[r])&&e.push(t[r]);return e};},function(t,e,r){function n(t){var e,r=!1,n=!1,a=!1!==t.jsonp;if("undefined"!=typeof location){var c="https:"===location.protocol,p=location.port;p||(p=c?443:80),r=t.hostname!==location.hostname||p!==t.port,n=t.secure!==c;}if(t.xdomain=r,t.xscheme=n,e=new o(t),"open"in e&&!t.forceJSONP)return new i(t);if(!a)throw new Error("JSONP disabled");return new s(t)}var o=r(13),i=r(15),s=r(29),a=r(30);e.polling=n,e.websocket=a;},function(t,e,r){var n=r(14);t.exports=function(t){var e=t.xdomain,r=t.xscheme,o=t.enablesXDR;try{if("undefined"!=typeof XMLHttpRequest&&(!e||n))return new XMLHttpRequest}catch(t){}try{if("undefined"!=typeof XDomainRequest&&!r&&o)return new XDomainRequest}catch(t){}if(!e)try{return new(self[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")}catch(t){}};},function(t,e){try{t.exports="undefined"!=typeof XMLHttpRequest&&"withCredentials"in new XMLHttpRequest;}catch(e){t.exports=!1;}},function(t,e,r){function n(){}function o(t){if(c.call(this,t),this.requestTimeout=t.requestTimeout,this.extraHeaders=t.extraHeaders,"undefined"!=typeof location){var e="https:"===location.protocol,r=location.port;r||(r=e?443:80),this.xd="undefined"!=typeof location&&t.hostname!==location.hostname||r!==t.port,this.xs=t.secure!==e;}}function i(t){this.method=t.method||"GET",this.uri=t.uri,this.xd=!!t.xd,this.xs=!!t.xs,this.async=!1!==t.async,this.data=void 0!==t.data?t.data:null,this.agent=t.agent,this.isBinary=t.isBinary,this.supportsBinary=t.supportsBinary,this.enablesXDR=t.enablesXDR,this.withCredentials=t.withCredentials,this.requestTimeout=t.requestTimeout,this.pfx=t.pfx,this.key=t.key,this.passphrase=t.passphrase,this.cert=t.cert,this.ca=t.ca,this.ciphers=t.ciphers,this.rejectUnauthorized=t.rejectUnauthorized,this.extraHeaders=t.extraHeaders,this.create();}function s(){for(var t in i.requests)i.requests.hasOwnProperty(t)&&i.requests[t].abort();}var a=r(13),c=r(16),p=r(5),h=r(27);r(3)("engine.io-client:polling-xhr");if(t.exports=o,t.exports.Request=i,h(o,c),o.prototype.supportsBinary=!0,o.prototype.request=function(t){return t=t||{},t.uri=this.uri(),t.xd=this.xd,t.xs=this.xs,t.agent=this.agent||!1,t.supportsBinary=this.supportsBinary,t.enablesXDR=this.enablesXDR,t.withCredentials=this.withCredentials,t.pfx=this.pfx,t.key=this.key,t.passphrase=this.passphrase,t.cert=this.cert,t.ca=this.ca,t.ciphers=this.ciphers,t.rejectUnauthorized=this.rejectUnauthorized,t.requestTimeout=this.requestTimeout,t.extraHeaders=this.extraHeaders,new i(t)},o.prototype.doWrite=function(t,e){var r="string"!=typeof t&&void 0!==t,n=this.request({method:"POST",data:t,isBinary:r}),o=this;n.on("success",e),n.on("error",function(t){o.onError("xhr post error",t);}),this.sendXhr=n;},o.prototype.doPoll=function(){var t=this.request(),e=this;t.on("data",function(t){e.onData(t);}),t.on("error",function(t){e.onError("xhr poll error",t);}),this.pollXhr=t;},p(i.prototype),i.prototype.create=function(){var t={agent:this.agent,xdomain:this.xd,xscheme:this.xs,enablesXDR:this.enablesXDR};t.pfx=this.pfx,t.key=this.key,t.passphrase=this.passphrase,t.cert=this.cert,t.ca=this.ca,t.ciphers=this.ciphers,t.rejectUnauthorized=this.rejectUnauthorized;var e=this.xhr=new a(t),r=this;try{e.open(this.method,this.uri,this.async);try{if(this.extraHeaders){e.setDisableHeaderCheck&&e.setDisableHeaderCheck(!0);for(var n in this.extraHeaders)this.extraHeaders.hasOwnProperty(n)&&e.setRequestHeader(n,this.extraHeaders[n]);}}catch(t){}if("POST"===this.method)try{this.isBinary?e.setRequestHeader("Content-type","application/octet-stream"):e.setRequestHeader("Content-type","text/plain;charset=UTF-8");}catch(t){}try{e.setRequestHeader("Accept","*/*");}catch(t){}"withCredentials"in e&&(e.withCredentials=this.withCredentials),this.requestTimeout&&(e.timeout=this.requestTimeout),this.hasXDR()?(e.onload=function(){r.onLoad();},e.onerror=function(){r.onError(e.responseText);}):e.onreadystatechange=function(){if(2===e.readyState)try{var t=e.getResponseHeader("Content-Type");(r.supportsBinary&&"application/octet-stream"===t||"application/octet-stream; charset=UTF-8"===t)&&(e.responseType="arraybuffer");}catch(t){}4===e.readyState&&(200===e.status||1223===e.status?r.onLoad():setTimeout(function(){r.onError("number"==typeof e.status?e.status:0);},0));},e.send(this.data);}catch(t){return void setTimeout(function(){r.onError(t);},0)}"undefined"!=typeof document&&(this.index=i.requestsCount++,i.requests[this.index]=this);},i.prototype.onSuccess=function(){this.emit("success"),this.cleanup();},i.prototype.onData=function(t){this.emit("data",t),this.onSuccess();},i.prototype.onError=function(t){this.emit("error",t),this.cleanup(!0);},i.prototype.cleanup=function(t){if("undefined"!=typeof this.xhr&&null!==this.xhr){if(this.hasXDR()?this.xhr.onload=this.xhr.onerror=n:this.xhr.onreadystatechange=n,t)try{this.xhr.abort();}catch(t){}"undefined"!=typeof document&&delete i.requests[this.index],this.xhr=null;}},i.prototype.onLoad=function(){var t;try{var e;try{e=this.xhr.getResponseHeader("Content-Type");}catch(t){}t="application/octet-stream"===e||"application/octet-stream; charset=UTF-8"===e?this.xhr.response||this.xhr.responseText:this.xhr.responseText;}catch(t){this.onError(t);}null!=t&&this.onData(t);},i.prototype.hasXDR=function(){return "undefined"!=typeof XDomainRequest&&!this.xs&&this.enablesXDR},i.prototype.abort=function(){this.cleanup();},i.requestsCount=0,i.requests={},"undefined"!=typeof document)if("function"==typeof attachEvent)attachEvent("onunload",s);else if("function"==typeof addEventListener){var u="onpagehide"in self?"pagehide":"unload";addEventListener(u,s,!1);}},function(t,e,r){function n(t){var e=t&&t.forceBase64;p&&!e||(this.supportsBinary=!1),o.call(this,t);}var o=r(17),i=r(26),s=r(18),a=r(27),c=r(28);r(3)("engine.io-client:polling");t.exports=n;var p=function(){var t=r(13),e=new t({xdomain:!1});return null!=e.responseType}();a(n,o),n.prototype.name="polling",n.prototype.doOpen=function(){this.poll();},n.prototype.pause=function(t){function e(){r.readyState="paused",t();}var r=this;if(this.readyState="pausing",this.polling||!this.writable){var n=0;this.polling&&(n++,this.once("pollComplete",function(){--n||e();})),this.writable||(n++,this.once("drain",function(){--n||e();}));}else e();},n.prototype.poll=function(){this.polling=!0,this.doPoll(),this.emit("poll");},n.prototype.onData=function(t){var e=this,r=function(t,r,n){return "opening"===e.readyState&&e.onOpen(),"close"===t.type?(e.onClose(),!1):void e.onPacket(t)};s.decodePayload(t,this.socket.binaryType,r),"closed"!==this.readyState&&(this.polling=!1,this.emit("pollComplete"),"open"===this.readyState&&this.poll());},n.prototype.doClose=function(){function t(){e.write([{type:"close"}]);}var e=this;"open"===this.readyState?t():this.once("open",t);},n.prototype.write=function(t){var e=this;this.writable=!1;var r=function(){e.writable=!0,e.emit("drain");};s.encodePayload(t,this.supportsBinary,function(t){e.doWrite(t,r);});},n.prototype.uri=function(){var t=this.query||{},e=this.secure?"https":"http",r="";!1!==this.timestampRequests&&(t[this.timestampParam]=c()),this.supportsBinary||t.sid||(t.b64=1),t=i.encode(t),this.port&&("https"===e&&443!==Number(this.port)||"http"===e&&80!==Number(this.port))&&(r=":"+this.port),t.length&&(t="?"+t);var n=this.hostname.indexOf(":")!==-1;return e+"://"+(n?"["+this.hostname+"]":this.hostname)+r+this.path+t};},function(t,e,r){function n(t){this.path=t.path,this.hostname=t.hostname,this.port=t.port,this.secure=t.secure,this.query=t.query,this.timestampParam=t.timestampParam,this.timestampRequests=t.timestampRequests,this.readyState="",this.agent=t.agent||!1,this.socket=t.socket,this.enablesXDR=t.enablesXDR,this.withCredentials=t.withCredentials,this.pfx=t.pfx,this.key=t.key,this.passphrase=t.passphrase,this.cert=t.cert,this.ca=t.ca,this.ciphers=t.ciphers,this.rejectUnauthorized=t.rejectUnauthorized,this.forceNode=t.forceNode,this.isReactNative=t.isReactNative,this.extraHeaders=t.extraHeaders,this.localAddress=t.localAddress;}var o=r(18),i=r(5);t.exports=n,i(n.prototype),n.prototype.onError=function(t,e){var r=new Error(t);return r.type="TransportError",r.description=e,this.emit("error",r),this},n.prototype.open=function(){return "closed"!==this.readyState&&""!==this.readyState||(this.readyState="opening",this.doOpen()),this},n.prototype.close=function(){return "opening"!==this.readyState&&"open"!==this.readyState||(this.doClose(),this.onClose()),this},n.prototype.send=function(t){if("open"!==this.readyState)throw new Error("Transport not open");
	this.write(t);},n.prototype.onOpen=function(){this.readyState="open",this.writable=!0,this.emit("open");},n.prototype.onData=function(t){var e=o.decodePacket(t,this.socket.binaryType);this.onPacket(e);},n.prototype.onPacket=function(t){this.emit("packet",t);},n.prototype.onClose=function(){this.readyState="closed",this.emit("close");};},function(t,e,r){function n(t,r){var n="b"+e.packets[t.type]+t.data.data;return r(n)}function o(t,r,n){if(!r)return e.encodeBase64Packet(t,n);var o=t.data,i=new Uint8Array(o),s=new Uint8Array(1+o.byteLength);s[0]=v[t.type];for(var a=0;a<i.length;a++)s[a+1]=i[a];return n(s.buffer)}function i(t,r,n){if(!r)return e.encodeBase64Packet(t,n);var o=new FileReader;return o.onload=function(){e.encodePacket({type:t.type,data:o.result},r,!0,n);},o.readAsArrayBuffer(t.data)}function s(t,r,n){if(!r)return e.encodeBase64Packet(t,n);if(g)return i(t,r,n);var o=new Uint8Array(1);o[0]=v[t.type];var s=new w([o.buffer,t.data]);return n(s)}function a(t){try{t=d.decode(t,{strict:!1});}catch(t){return !1}return t}function c(t,e,r){for(var n=new Array(t.length),o=l(t.length,r),i=function(t,r,o){e(r,function(e,r){n[t]=r,o(e,n);});},s=0;s<t.length;s++)i(s,t[s],o);}var p,h=r(19),u=r(20),f=r(21),l=r(22),d=r(23);"undefined"!=typeof ArrayBuffer&&(p=r(24));var y="undefined"!=typeof navigator&&/Android/i.test(navigator.userAgent),m="undefined"!=typeof navigator&&/PhantomJS/i.test(navigator.userAgent),g=y||m;e.protocol=3;var v=e.packets={open:0,close:1,ping:2,pong:3,message:4,upgrade:5,noop:6},b=h(v),k={type:"error",data:"parser error"},w=r(25);e.encodePacket=function(t,e,r,i){"function"==typeof e&&(i=e,e=!1),"function"==typeof r&&(i=r,r=null);var a=void 0===t.data?void 0:t.data.buffer||t.data;if("undefined"!=typeof ArrayBuffer&&a instanceof ArrayBuffer)return o(t,e,i);if("undefined"!=typeof w&&a instanceof w)return s(t,e,i);if(a&&a.base64)return n(t,i);var c=v[t.type];return void 0!==t.data&&(c+=r?d.encode(String(t.data),{strict:!1}):String(t.data)),i(""+c)},e.encodeBase64Packet=function(t,r){var n="b"+e.packets[t.type];if("undefined"!=typeof w&&t.data instanceof w){var o=new FileReader;return o.onload=function(){var t=o.result.split(",")[1];r(n+t);},o.readAsDataURL(t.data)}var i;try{i=String.fromCharCode.apply(null,new Uint8Array(t.data));}catch(e){for(var s=new Uint8Array(t.data),a=new Array(s.length),c=0;c<s.length;c++)a[c]=s[c];i=String.fromCharCode.apply(null,a);}return n+=btoa(i),r(n)},e.decodePacket=function(t,r,n){if(void 0===t)return k;if("string"==typeof t){if("b"===t.charAt(0))return e.decodeBase64Packet(t.substr(1),r);if(n&&(t=a(t),t===!1))return k;var o=t.charAt(0);return Number(o)==o&&b[o]?t.length>1?{type:b[o],data:t.substring(1)}:{type:b[o]}:k}var i=new Uint8Array(t),o=i[0],s=f(t,1);return w&&"blob"===r&&(s=new w([s])),{type:b[o],data:s}},e.decodeBase64Packet=function(t,e){var r=b[t.charAt(0)];if(!p)return {type:r,data:{base64:!0,data:t.substr(1)}};var n=p.decode(t.substr(1));return "blob"===e&&w&&(n=new w([n])),{type:r,data:n}},e.encodePayload=function(t,r,n){function o(t){return t.length+":"+t}function i(t,n){e.encodePacket(t,!!s&&r,!1,function(t){n(null,o(t));});}"function"==typeof r&&(n=r,r=null);var s=u(t);return r&&s?w&&!g?e.encodePayloadAsBlob(t,n):e.encodePayloadAsArrayBuffer(t,n):t.length?void c(t,i,function(t,e){return n(e.join(""))}):n("0:")},e.decodePayload=function(t,r,n){if("string"!=typeof t)return e.decodePayloadAsBinary(t,r,n);"function"==typeof r&&(n=r,r=null);var o;if(""===t)return n(k,0,1);for(var i,s,a="",c=0,p=t.length;c<p;c++){var h=t.charAt(c);if(":"===h){if(""===a||a!=(i=Number(a)))return n(k,0,1);if(s=t.substr(c+1,i),a!=s.length)return n(k,0,1);if(s.length){if(o=e.decodePacket(s,r,!1),k.type===o.type&&k.data===o.data)return n(k,0,1);var u=n(o,c+i,p);if(!1===u)return}c+=i,a="";}else a+=h;}return ""!==a?n(k,0,1):void 0},e.encodePayloadAsArrayBuffer=function(t,r){function n(t,r){e.encodePacket(t,!0,!0,function(t){return r(null,t)});}return t.length?void c(t,n,function(t,e){var n=e.reduce(function(t,e){var r;return r="string"==typeof e?e.length:e.byteLength,t+r.toString().length+r+2},0),o=new Uint8Array(n),i=0;return e.forEach(function(t){var e="string"==typeof t,r=t;if(e){for(var n=new Uint8Array(t.length),s=0;s<t.length;s++)n[s]=t.charCodeAt(s);r=n.buffer;}e?o[i++]=0:o[i++]=1;for(var a=r.byteLength.toString(),s=0;s<a.length;s++)o[i++]=parseInt(a[s]);o[i++]=255;for(var n=new Uint8Array(r),s=0;s<n.length;s++)o[i++]=n[s];}),r(o.buffer)}):r(new ArrayBuffer(0))},e.encodePayloadAsBlob=function(t,r){function n(t,r){e.encodePacket(t,!0,!0,function(t){var e=new Uint8Array(1);if(e[0]=1,"string"==typeof t){for(var n=new Uint8Array(t.length),o=0;o<t.length;o++)n[o]=t.charCodeAt(o);t=n.buffer,e[0]=0;}for(var i=t instanceof ArrayBuffer?t.byteLength:t.size,s=i.toString(),a=new Uint8Array(s.length+1),o=0;o<s.length;o++)a[o]=parseInt(s[o]);if(a[s.length]=255,w){var c=new w([e.buffer,a.buffer,t]);r(null,c);}});}c(t,n,function(t,e){return r(new w(e))});},e.decodePayloadAsBinary=function(t,r,n){"function"==typeof r&&(n=r,r=null);for(var o=t,i=[];o.byteLength>0;){for(var s=new Uint8Array(o),a=0===s[0],c="",p=1;255!==s[p];p++){if(c.length>310)return n(k,0,1);c+=s[p];}o=f(o,2+c.length),c=parseInt(c);var h=f(o,0,c);if(a)try{h=String.fromCharCode.apply(null,new Uint8Array(h));}catch(t){var u=new Uint8Array(h);h="";for(var p=0;p<u.length;p++)h+=String.fromCharCode(u[p]);}i.push(h),o=f(o,c);}var l=i.length;i.forEach(function(t,o){n(e.decodePacket(t,r,!0),o,l);});};},function(t,e){t.exports=Object.keys||function(t){var e=[],r=Object.prototype.hasOwnProperty;for(var n in t)r.call(t,n)&&e.push(n);return e};},function(t,e,r){function n(t){if(!t||"object"!=typeof t)return !1;if(o(t)){for(var e=0,r=t.length;e<r;e++)if(n(t[e]))return !0;return !1}if("function"==typeof Buffer&&Buffer.isBuffer&&Buffer.isBuffer(t)||"function"==typeof ArrayBuffer&&t instanceof ArrayBuffer||s&&t instanceof Blob||a&&t instanceof File)return !0;if(t.toJSON&&"function"==typeof t.toJSON&&1===arguments.length)return n(t.toJSON(),!0);for(var i in t)if(Object.prototype.hasOwnProperty.call(t,i)&&n(t[i]))return !0;return !1}var o=r(7),i=Object.prototype.toString,s="function"==typeof Blob||"undefined"!=typeof Blob&&"[object BlobConstructor]"===i.call(Blob),a="function"==typeof File||"undefined"!=typeof File&&"[object FileConstructor]"===i.call(File);t.exports=n;},function(t,e){t.exports=function(t,e,r){var n=t.byteLength;if(e=e||0,r=r||n,t.slice)return t.slice(e,r);if(e<0&&(e+=n),r<0&&(r+=n),r>n&&(r=n),e>=n||e>=r||0===n)return new ArrayBuffer(0);for(var o=new Uint8Array(t),i=new Uint8Array(r-e),s=e,a=0;s<r;s++,a++)i[a]=o[s];return i.buffer};},function(t,e){function r(t,e,r){function o(t,n){if(o.count<=0)throw new Error("after called too many times");--o.count,t?(i=!0,e(t),e=r):0!==o.count||i||e(null,n);}var i=!1;return r=r||n,o.count=t,0===t?e():o}function n(){}t.exports=r;},function(t,e){function r(t){for(var e,r,n=[],o=0,i=t.length;o<i;)e=t.charCodeAt(o++),e>=55296&&e<=56319&&o<i?(r=t.charCodeAt(o++),56320==(64512&r)?n.push(((1023&e)<<10)+(1023&r)+65536):(n.push(e),o--)):n.push(e);return n}function n(t){for(var e,r=t.length,n=-1,o="";++n<r;)e=t[n],e>65535&&(e-=65536,o+=d(e>>>10&1023|55296),e=56320|1023&e),o+=d(e);return o}function o(t,e){if(t>=55296&&t<=57343){if(e)throw Error("Lone surrogate U+"+t.toString(16).toUpperCase()+" is not a scalar value");return !1}return !0}function i(t,e){return d(t>>e&63|128)}function s(t,e){if(0==(4294967168&t))return d(t);var r="";return 0==(4294965248&t)?r=d(t>>6&31|192):0==(4294901760&t)?(o(t,e)||(t=65533),r=d(t>>12&15|224),r+=i(t,6)):0==(4292870144&t)&&(r=d(t>>18&7|240),r+=i(t,12),r+=i(t,6)),r+=d(63&t|128)}function a(t,e){e=e||{};for(var n,o=!1!==e.strict,i=r(t),a=i.length,c=-1,p="";++c<a;)n=i[c],p+=s(n,o);return p}function c(){if(l>=f)throw Error("Invalid byte index");var t=255&u[l];if(l++,128==(192&t))return 63&t;throw Error("Invalid continuation byte")}function p(t){var e,r,n,i,s;if(l>f)throw Error("Invalid byte index");if(l==f)return !1;if(e=255&u[l],l++,0==(128&e))return e;if(192==(224&e)){if(r=c(),s=(31&e)<<6|r,s>=128)return s;throw Error("Invalid continuation byte")}if(224==(240&e)){if(r=c(),n=c(),s=(15&e)<<12|r<<6|n,s>=2048)return o(s,t)?s:65533;throw Error("Invalid continuation byte")}if(240==(248&e)&&(r=c(),n=c(),i=c(),s=(7&e)<<18|r<<12|n<<6|i,s>=65536&&s<=1114111))return s;throw Error("Invalid UTF-8 detected")}function h(t,e){e=e||{};var o=!1!==e.strict;u=r(t),f=u.length,l=0;for(var i,s=[];(i=p(o))!==!1;)s.push(i);return n(s)}/*! https://mths.be/utf8js v2.1.2 by @mathias */
	var u,f,l,d=String.fromCharCode;t.exports={version:"2.1.2",encode:a,decode:h};},function(t,e){!function(){for(var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",r=new Uint8Array(256),n=0;n<t.length;n++)r[t.charCodeAt(n)]=n;e.encode=function(e){var r,n=new Uint8Array(e),o=n.length,i="";for(r=0;r<o;r+=3)i+=t[n[r]>>2],i+=t[(3&n[r])<<4|n[r+1]>>4],i+=t[(15&n[r+1])<<2|n[r+2]>>6],i+=t[63&n[r+2]];return o%3===2?i=i.substring(0,i.length-1)+"=":o%3===1&&(i=i.substring(0,i.length-2)+"=="),i},e.decode=function(t){var e,n,o,i,s,a=.75*t.length,c=t.length,p=0;"="===t[t.length-1]&&(a--,"="===t[t.length-2]&&a--);var h=new ArrayBuffer(a),u=new Uint8Array(h);for(e=0;e<c;e+=4)n=r[t.charCodeAt(e)],o=r[t.charCodeAt(e+1)],i=r[t.charCodeAt(e+2)],s=r[t.charCodeAt(e+3)],u[p++]=n<<2|o>>4,u[p++]=(15&o)<<4|i>>2,u[p++]=(3&i)<<6|63&s;return h};}();},function(t,e){function r(t){return t.map(function(t){if(t.buffer instanceof ArrayBuffer){var e=t.buffer;if(t.byteLength!==e.byteLength){var r=new Uint8Array(t.byteLength);r.set(new Uint8Array(e,t.byteOffset,t.byteLength)),e=r.buffer;}return e}return t})}function n(t,e){e=e||{};var n=new i;return r(t).forEach(function(t){n.append(t);}),e.type?n.getBlob(e.type):n.getBlob()}function o(t,e){return new Blob(r(t),e||{})}var i="undefined"!=typeof i?i:"undefined"!=typeof WebKitBlobBuilder?WebKitBlobBuilder:"undefined"!=typeof MSBlobBuilder?MSBlobBuilder:"undefined"!=typeof MozBlobBuilder&&MozBlobBuilder,s=function(){try{var t=new Blob(["hi"]);return 2===t.size}catch(t){return !1}}(),a=s&&function(){try{var t=new Blob([new Uint8Array([1,2])]);return 2===t.size}catch(t){return !1}}(),c=i&&i.prototype.append&&i.prototype.getBlob;"undefined"!=typeof Blob&&(n.prototype=Blob.prototype,o.prototype=Blob.prototype),t.exports=function(){return s?a?Blob:o:c?n:void 0}();},function(t,e){e.encode=function(t){var e="";for(var r in t)t.hasOwnProperty(r)&&(e.length&&(e+="&"),e+=encodeURIComponent(r)+"="+encodeURIComponent(t[r]));return e},e.decode=function(t){for(var e={},r=t.split("&"),n=0,o=r.length;n<o;n++){var i=r[n].split("=");e[decodeURIComponent(i[0])]=decodeURIComponent(i[1]);}return e};},function(t,e){t.exports=function(t,e){var r=function(){};r.prototype=e.prototype,t.prototype=new r,t.prototype.constructor=t;};},function(t,e){function r(t){var e="";do e=s[t%a]+e,t=Math.floor(t/a);while(t>0);return e}function n(t){var e=0;for(h=0;h<t.length;h++)e=e*a+c[t.charAt(h)];return e}function o(){var t=r(+new Date);return t!==i?(p=0,i=t):t+"."+r(p++)}for(var i,s="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""),a=64,c={},p=0,h=0;h<a;h++)c[s[h]]=h;o.encode=r,o.decode=n,t.exports=o;},function(t,e,r){(function(e){function n(){}function o(){return "undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof e?e:{}}function i(t){if(s.call(this,t),this.query=this.query||{},!c){var e=o();c=e.___eio=e.___eio||[];}this.index=c.length;var r=this;c.push(function(t){r.onData(t);}),this.query.j=this.index,"function"==typeof addEventListener&&addEventListener("beforeunload",function(){r.script&&(r.script.onerror=n);},!1);}var s=r(16),a=r(27);t.exports=i;var c,p=/\n/g,h=/\\n/g;a(i,s),i.prototype.supportsBinary=!1,i.prototype.doClose=function(){this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),this.form&&(this.form.parentNode.removeChild(this.form),this.form=null,this.iframe=null),s.prototype.doClose.call(this);},i.prototype.doPoll=function(){var t=this,e=document.createElement("script");this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),e.async=!0,e.src=this.uri(),e.onerror=function(e){t.onError("jsonp poll error",e);};var r=document.getElementsByTagName("script")[0];r?r.parentNode.insertBefore(e,r):(document.head||document.body).appendChild(e),this.script=e;var n="undefined"!=typeof navigator&&/gecko/i.test(navigator.userAgent);n&&setTimeout(function(){var t=document.createElement("iframe");document.body.appendChild(t),document.body.removeChild(t);},100);},i.prototype.doWrite=function(t,e){function r(){n(),e();}function n(){if(o.iframe)try{o.form.removeChild(o.iframe);}catch(t){o.onError("jsonp polling iframe removal error",t);}try{var t='<iframe src="javascript:0" name="'+o.iframeId+'">';i=document.createElement(t);}catch(t){i=document.createElement("iframe"),i.name=o.iframeId,i.src="javascript:0";}i.id=o.iframeId,o.form.appendChild(i),o.iframe=i;}var o=this;if(!this.form){var i,s=document.createElement("form"),a=document.createElement("textarea"),c=this.iframeId="eio_iframe_"+this.index;s.className="socketio",s.style.position="absolute",s.style.top="-1000px",s.style.left="-1000px",s.target=c,s.method="POST",s.setAttribute("accept-charset","utf-8"),a.name="d",s.appendChild(a),document.body.appendChild(s),this.form=s,this.area=a;}this.form.action=this.uri(),n(),t=t.replace(h,"\\\n"),this.area.value=t.replace(p,"\\n");try{this.form.submit();}catch(t){}this.iframe.attachEvent?this.iframe.onreadystatechange=function(){"complete"===o.iframe.readyState&&r();}:this.iframe.onload=r;};}).call(e,function(){return this}());},function(t,e,r){function n(t){var e=t&&t.forceBase64;e&&(this.supportsBinary=!1),this.perMessageDeflate=t.perMessageDeflate,this.usingBrowserWebSocket=o&&!t.forceNode,this.protocols=t.protocols,this.usingBrowserWebSocket||(u=i),s.call(this,t);}var o,i,s=r(17),a=r(18),c=r(26),p=r(27),h=r(28);r(3)("engine.io-client:websocket");if("undefined"!=typeof WebSocket?o=WebSocket:"undefined"!=typeof self&&(o=self.WebSocket||self.MozWebSocket),"undefined"==typeof window)try{i=r(31);}catch(t){}var u=o||i;t.exports=n,p(n,s),n.prototype.name="websocket",n.prototype.supportsBinary=!0,n.prototype.doOpen=function(){if(this.check()){var t=this.uri(),e=this.protocols,r={agent:this.agent,perMessageDeflate:this.perMessageDeflate};r.pfx=this.pfx,r.key=this.key,r.passphrase=this.passphrase,r.cert=this.cert,r.ca=this.ca,r.ciphers=this.ciphers,r.rejectUnauthorized=this.rejectUnauthorized,this.extraHeaders&&(r.headers=this.extraHeaders),this.localAddress&&(r.localAddress=this.localAddress);try{this.ws=this.usingBrowserWebSocket&&!this.isReactNative?e?new u(t,e):new u(t):new u(t,e,r);}catch(t){return this.emit("error",t)}void 0===this.ws.binaryType&&(this.supportsBinary=!1),this.ws.supports&&this.ws.supports.binary?(this.supportsBinary=!0,this.ws.binaryType="nodebuffer"):this.ws.binaryType="arraybuffer",this.addEventListeners();}},n.prototype.addEventListeners=function(){var t=this;this.ws.onopen=function(){t.onOpen();},this.ws.onclose=function(){t.onClose();},this.ws.onmessage=function(e){t.onData(e.data);},this.ws.onerror=function(e){t.onError("websocket error",e);};},n.prototype.write=function(t){function e(){r.emit("flush"),setTimeout(function(){r.writable=!0,r.emit("drain");},0);}var r=this;this.writable=!1;for(var n=t.length,o=0,i=n;o<i;o++)!function(t){a.encodePacket(t,r.supportsBinary,function(o){if(!r.usingBrowserWebSocket){var i={};if(t.options&&(i.compress=t.options.compress),r.perMessageDeflate){var s="string"==typeof o?Buffer.byteLength(o):o.length;s<r.perMessageDeflate.threshold&&(i.compress=!1);}}try{r.usingBrowserWebSocket?r.ws.send(o):r.ws.send(o,i);}catch(t){}--n||e();});}(t[o]);},n.prototype.onClose=function(){s.prototype.onClose.call(this);},n.prototype.doClose=function(){"undefined"!=typeof this.ws&&this.ws.close();},n.prototype.uri=function(){var t=this.query||{},e=this.secure?"wss":"ws",r="";this.port&&("wss"===e&&443!==Number(this.port)||"ws"===e&&80!==Number(this.port))&&(r=":"+this.port),this.timestampRequests&&(t[this.timestampParam]=h()),this.supportsBinary||(t.b64=1),t=c.encode(t),t.length&&(t="?"+t);var n=this.hostname.indexOf(":")!==-1;return e+"://"+(n?"["+this.hostname+"]":this.hostname)+r+this.path+t},n.prototype.check=function(){return !(!u||"__initialize"in u&&this.name===n.prototype.name)};},function(t,e){},function(t,e){var r=[].indexOf;t.exports=function(t,e){if(r)return t.indexOf(e);for(var n=0;n<t.length;++n)if(t[n]===e)return n;return -1};},function(t,e,r){function n(t,e,r){this.io=t,this.nsp=e,this.json=this,this.ids=0,this.acks={},this.receiveBuffer=[],this.sendBuffer=[],this.connected=!1,this.disconnected=!0,this.flags={},r&&r.query&&(this.query=r.query),this.io.autoConnect&&this.open();}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=r(4),s=r(5),a=r(34),c=r(35),p=r(36),h=(r(3)("socket.io-client:socket"),r(26)),u=r(20);t.exports=e=n;var f={connect:1,connect_error:1,connect_timeout:1,connecting:1,disconnect:1,error:1,reconnect:1,reconnect_attempt:1,reconnect_failed:1,reconnect_error:1,reconnecting:1,ping:1,pong:1},l=s.prototype.emit;s(n.prototype),n.prototype.subEvents=function(){if(!this.subs){var t=this.io;this.subs=[c(t,"open",p(this,"onopen")),c(t,"packet",p(this,"onpacket")),c(t,"close",p(this,"onclose"))];}},n.prototype.open=n.prototype.connect=function(){return this.connected?this:(this.subEvents(),this.io.open(),"open"===this.io.readyState&&this.onopen(),this.emit("connecting"),this)},n.prototype.send=function(){var t=a(arguments);return t.unshift("message"),this.emit.apply(this,t),this},n.prototype.emit=function(t){if(f.hasOwnProperty(t))return l.apply(this,arguments),this;var e=a(arguments),r={type:(void 0!==this.flags.binary?this.flags.binary:u(e))?i.BINARY_EVENT:i.EVENT,data:e};return r.options={},r.options.compress=!this.flags||!1!==this.flags.compress,"function"==typeof e[e.length-1]&&(this.acks[this.ids]=e.pop(),r.id=this.ids++),this.connected?this.packet(r):this.sendBuffer.push(r),this.flags={},this},n.prototype.packet=function(t){t.nsp=this.nsp,this.io.packet(t);},n.prototype.onopen=function(){if("/"!==this.nsp)if(this.query){var t="object"===o(this.query)?h.encode(this.query):this.query;this.packet({type:i.CONNECT,query:t});}else this.packet({type:i.CONNECT});},n.prototype.onclose=function(t){this.connected=!1,this.disconnected=!0,delete this.id,this.emit("disconnect",t);},n.prototype.onpacket=function(t){var e=t.nsp===this.nsp,r=t.type===i.ERROR&&"/"===t.nsp;if(e||r)switch(t.type){case i.CONNECT:this.onconnect();break;case i.EVENT:this.onevent(t);break;case i.BINARY_EVENT:this.onevent(t);break;case i.ACK:this.onack(t);break;case i.BINARY_ACK:this.onack(t);break;case i.DISCONNECT:this.ondisconnect();break;case i.ERROR:this.emit("error",t.data);}},n.prototype.onevent=function(t){var e=t.data||[];null!=t.id&&e.push(this.ack(t.id)),this.connected?l.apply(this,e):this.receiveBuffer.push(e);},n.prototype.ack=function(t){var e=this,r=!1;return function(){if(!r){r=!0;var n=a(arguments);e.packet({type:u(n)?i.BINARY_ACK:i.ACK,id:t,data:n});}}},n.prototype.onack=function(t){var e=this.acks[t.id];"function"==typeof e&&(e.apply(this,t.data),delete this.acks[t.id]);},n.prototype.onconnect=function(){this.connected=!0,this.disconnected=!1,this.emit("connect"),this.emitBuffered();},n.prototype.emitBuffered=function(){var t;for(t=0;t<this.receiveBuffer.length;t++)l.apply(this,this.receiveBuffer[t]);for(this.receiveBuffer=[],t=0;t<this.sendBuffer.length;t++)this.packet(this.sendBuffer[t]);this.sendBuffer=[];},n.prototype.ondisconnect=function(){this.destroy(),this.onclose("io server disconnect");},n.prototype.destroy=function(){if(this.subs){for(var t=0;t<this.subs.length;t++)this.subs[t].destroy();this.subs=null;}this.io.destroy(this);},n.prototype.close=n.prototype.disconnect=function(){return this.connected&&this.packet({type:i.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this},n.prototype.compress=function(t){return this.flags.compress=t,this},n.prototype.binary=function(t){return this.flags.binary=t,this};},function(t,e){function r(t,e){var r=[];e=e||0;for(var n=e||0;n<t.length;n++)r[n-e]=t[n];return r}t.exports=r;},function(t,e){function r(t,e,r){return t.on(e,r),{destroy:function(){t.removeListener(e,r);}}}t.exports=r;},function(t,e){var r=[].slice;t.exports=function(t,e){if("string"==typeof e&&(e=t[e]),"function"!=typeof e)throw new Error("bind() requires a function");var n=r.call(arguments,2);return function(){return e.apply(t,n.concat(r.call(arguments)))}};},function(t,e){function r(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0;}t.exports=r,r.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),r=Math.floor(e*this.jitter*t);t=0==(1&Math.floor(10*e))?t-r:t+r;}return 0|Math.min(t,this.max)},r.prototype.reset=function(){this.attempts=0;},r.prototype.setMin=function(t){this.ms=t;},r.prototype.setMax=function(t){this.max=t;},r.prototype.setJitter=function(t){this.jitter=t;};}])});

	});
	var socket_io_slim_1 = socket_io_slim.io;

	var js_cookie = createCommonjsModule(function (module, exports) {
	(function (factory) {
		var registeredInModuleLoader;
		{
			module.exports = factory();
			registeredInModuleLoader = true;
		}
		if (!registeredInModuleLoader) {
			var OldCookies = window.Cookies;
			var api = window.Cookies = factory();
			api.noConflict = function () {
				window.Cookies = OldCookies;
				return api;
			};
		}
	}(function () {
		function extend () {
			var i = 0;
			var result = {};
			for (; i < arguments.length; i++) {
				var attributes = arguments[ i ];
				for (var key in attributes) {
					result[key] = attributes[key];
				}
			}
			return result;
		}

		function decode (s) {
			return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
		}

		function init (converter) {
			function api() {}

			function set (key, value, attributes) {
				if (typeof document === 'undefined') {
					return;
				}

				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
				}

				// We're using "expires" because "max-age" is not supported by IE
				attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

				try {
					var result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				value = converter.write ?
					converter.write(value, key) :
					encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

				key = encodeURIComponent(String(key))
					.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
					.replace(/[\(\)]/g, escape);

				var stringifiedAttributes = '';
				for (var attributeName in attributes) {
					if (!attributes[attributeName]) {
						continue;
					}
					stringifiedAttributes += '; ' + attributeName;
					if (attributes[attributeName] === true) {
						continue;
					}

					// Considers RFC 6265 section 5.2:
					// ...
					// 3.  If the remaining unparsed-attributes contains a %x3B (";")
					//     character:
					// Consume the characters of the unparsed-attributes up to,
					// not including, the first %x3B (";") character.
					// ...
					stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
				}

				return (document.cookie = key + '=' + value + stringifiedAttributes);
			}

			function get (key, json) {
				if (typeof document === 'undefined') {
					return;
				}

				var jar = {};
				// To prevent the for loop in the first place assign an empty array
				// in case there are no cookies at all.
				var cookies = document.cookie ? document.cookie.split('; ') : [];
				var i = 0;

				for (; i < cookies.length; i++) {
					var parts = cookies[i].split('=');
					var cookie = parts.slice(1).join('=');

					if (!json && cookie.charAt(0) === '"') {
						cookie = cookie.slice(1, -1);
					}

					try {
						var name = decode(parts[0]);
						cookie = (converter.read || converter)(cookie, name) ||
							decode(cookie);

						if (json) {
							try {
								cookie = JSON.parse(cookie);
							} catch (e) {}
						}

						jar[name] = cookie;

						if (key === name) {
							break;
						}
					} catch (e) {}
				}

				return key ? jar[key] : jar;
			}

			api.set = set;
			api.get = function (key) {
				return get(key, false /* read as raw */);
			};
			api.getJSON = function (key) {
				return get(key, true /* read as json */);
			};
			api.remove = function (key, attributes) {
				set(key, '', extend(attributes, {
					expires: -1
				}));
			};

			api.defaults = {};

			api.withConverter = init;

			return api;
		}

		return init(function () {});
	}));
	});

	/*
	 * anime.js v3.1.0
	 * (c) 2019 Julian Garnier
	 * Released under the MIT license
	 * animejs.com
	 */

	// Defaults

	var defaultInstanceSettings = {
	  update: null,
	  begin: null,
	  loopBegin: null,
	  changeBegin: null,
	  change: null,
	  changeComplete: null,
	  loopComplete: null,
	  complete: null,
	  loop: 1,
	  direction: 'normal',
	  autoplay: true,
	  timelineOffset: 0
	};

	var defaultTweenSettings = {
	  duration: 1000,
	  delay: 0,
	  endDelay: 0,
	  easing: 'easeOutElastic(1, .5)',
	  round: 0
	};

	var validTransforms = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'perspective'];

	// Caching

	var cache = {
	  CSS: {},
	  springs: {}
	};

	// Utils

	function minMax(val, min, max) {
	  return Math.min(Math.max(val, min), max);
	}

	function stringContains(str, text) {
	  return str.indexOf(text) > -1;
	}

	function applyArguments(func, args) {
	  return func.apply(null, args);
	}

	var is = {
	  arr: function (a) { return Array.isArray(a); },
	  obj: function (a) { return stringContains(Object.prototype.toString.call(a), 'Object'); },
	  pth: function (a) { return is.obj(a) && a.hasOwnProperty('totalLength'); },
	  svg: function (a) { return a instanceof SVGElement; },
	  inp: function (a) { return a instanceof HTMLInputElement; },
	  dom: function (a) { return a.nodeType || is.svg(a); },
	  str: function (a) { return typeof a === 'string'; },
	  fnc: function (a) { return typeof a === 'function'; },
	  und: function (a) { return typeof a === 'undefined'; },
	  hex: function (a) { return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a); },
	  rgb: function (a) { return /^rgb/.test(a); },
	  hsl: function (a) { return /^hsl/.test(a); },
	  col: function (a) { return (is.hex(a) || is.rgb(a) || is.hsl(a)); },
	  key: function (a) { return !defaultInstanceSettings.hasOwnProperty(a) && !defaultTweenSettings.hasOwnProperty(a) && a !== 'targets' && a !== 'keyframes'; }
	};

	// Easings

	function parseEasingParameters(string) {
	  var match = /\(([^)]+)\)/.exec(string);
	  return match ? match[1].split(',').map(function (p) { return parseFloat(p); }) : [];
	}

	// Spring solver inspired by Webkit Copyright © 2016 Apple Inc. All rights reserved. https://webkit.org/demos/spring/spring.js

	function spring(string, duration) {

	  var params = parseEasingParameters(string);
	  var mass = minMax(is.und(params[0]) ? 1 : params[0], .1, 100);
	  var stiffness = minMax(is.und(params[1]) ? 100 : params[1], .1, 100);
	  var damping = minMax(is.und(params[2]) ? 10 : params[2], .1, 100);
	  var velocity =  minMax(is.und(params[3]) ? 0 : params[3], .1, 100);
	  var w0 = Math.sqrt(stiffness / mass);
	  var zeta = damping / (2 * Math.sqrt(stiffness * mass));
	  var wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;
	  var a = 1;
	  var b = zeta < 1 ? (zeta * w0 + -velocity) / wd : -velocity + w0;

	  function solver(t) {
	    var progress = duration ? (duration * t) / 1000 : t;
	    if (zeta < 1) {
	      progress = Math.exp(-progress * zeta * w0) * (a * Math.cos(wd * progress) + b * Math.sin(wd * progress));
	    } else {
	      progress = (a + b * progress) * Math.exp(-progress * w0);
	    }
	    if (t === 0 || t === 1) { return t; }
	    return 1 - progress;
	  }

	  function getDuration() {
	    var cached = cache.springs[string];
	    if (cached) { return cached; }
	    var frame = 1/6;
	    var elapsed = 0;
	    var rest = 0;
	    while(true) {
	      elapsed += frame;
	      if (solver(elapsed) === 1) {
	        rest++;
	        if (rest >= 16) { break; }
	      } else {
	        rest = 0;
	      }
	    }
	    var duration = elapsed * frame * 1000;
	    cache.springs[string] = duration;
	    return duration;
	  }

	  return duration ? solver : getDuration;

	}

	// Basic steps easing implementation https://developer.mozilla.org/fr/docs/Web/CSS/transition-timing-function

	function steps(steps) {
	  if ( steps === void 0 ) steps = 10;

	  return function (t) { return Math.round(t * steps) * (1 / steps); };
	}

	// BezierEasing https://github.com/gre/bezier-easing

	var bezier = (function () {

	  var kSplineTableSize = 11;
	  var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

	  function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1 }
	  function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1 }
	  function C(aA1)      { return 3.0 * aA1 }

	  function calcBezier(aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT }
	  function getSlope(aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1) }

	  function binarySubdivide(aX, aA, aB, mX1, mX2) {
	    var currentX, currentT, i = 0;
	    do {
	      currentT = aA + (aB - aA) / 2.0;
	      currentX = calcBezier(currentT, mX1, mX2) - aX;
	      if (currentX > 0.0) { aB = currentT; } else { aA = currentT; }
	    } while (Math.abs(currentX) > 0.0000001 && ++i < 10);
	    return currentT;
	  }

	  function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
	    for (var i = 0; i < 4; ++i) {
	      var currentSlope = getSlope(aGuessT, mX1, mX2);
	      if (currentSlope === 0.0) { return aGuessT; }
	      var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
	      aGuessT -= currentX / currentSlope;
	    }
	    return aGuessT;
	  }

	  function bezier(mX1, mY1, mX2, mY2) {

	    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) { return; }
	    var sampleValues = new Float32Array(kSplineTableSize);

	    if (mX1 !== mY1 || mX2 !== mY2) {
	      for (var i = 0; i < kSplineTableSize; ++i) {
	        sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
	      }
	    }

	    function getTForX(aX) {

	      var intervalStart = 0;
	      var currentSample = 1;
	      var lastSample = kSplineTableSize - 1;

	      for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
	        intervalStart += kSampleStepSize;
	      }

	      --currentSample;

	      var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
	      var guessForT = intervalStart + dist * kSampleStepSize;
	      var initialSlope = getSlope(guessForT, mX1, mX2);

	      if (initialSlope >= 0.001) {
	        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
	      } else if (initialSlope === 0.0) {
	        return guessForT;
	      } else {
	        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
	      }

	    }

	    return function (x) {
	      if (mX1 === mY1 && mX2 === mY2) { return x; }
	      if (x === 0 || x === 1) { return x; }
	      return calcBezier(getTForX(x), mY1, mY2);
	    }

	  }

	  return bezier;

	})();

	var penner = (function () {

	  // Based on jQuery UI's implemenation of easing equations from Robert Penner (http://www.robertpenner.com/easing)

	  var eases = { linear: function () { return function (t) { return t; }; } };

	  var functionEasings = {
	    Sine: function () { return function (t) { return 1 - Math.cos(t * Math.PI / 2); }; },
	    Circ: function () { return function (t) { return 1 - Math.sqrt(1 - t * t); }; },
	    Back: function () { return function (t) { return t * t * (3 * t - 2); }; },
	    Bounce: function () { return function (t) {
	      var pow2, b = 4;
	      while (t < (( pow2 = Math.pow(2, --b)) - 1) / 11) {}
	      return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow(( pow2 * 3 - 2 ) / 22 - t, 2)
	    }; },
	    Elastic: function (amplitude, period) {
	      if ( amplitude === void 0 ) amplitude = 1;
	      if ( period === void 0 ) period = .5;

	      var a = minMax(amplitude, 1, 10);
	      var p = minMax(period, .1, 2);
	      return function (t) {
	        return (t === 0 || t === 1) ? t : 
	          -a * Math.pow(2, 10 * (t - 1)) * Math.sin((((t - 1) - (p / (Math.PI * 2) * Math.asin(1 / a))) * (Math.PI * 2)) / p);
	      }
	    }
	  };

	  var baseEasings = ['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'];

	  baseEasings.forEach(function (name, i) {
	    functionEasings[name] = function () { return function (t) { return Math.pow(t, i + 2); }; };
	  });

	  Object.keys(functionEasings).forEach(function (name) {
	    var easeIn = functionEasings[name];
	    eases['easeIn' + name] = easeIn;
	    eases['easeOut' + name] = function (a, b) { return function (t) { return 1 - easeIn(a, b)(1 - t); }; };
	    eases['easeInOut' + name] = function (a, b) { return function (t) { return t < 0.5 ? easeIn(a, b)(t * 2) / 2 : 
	      1 - easeIn(a, b)(t * -2 + 2) / 2; }; };
	  });

	  return eases;

	})();

	function parseEasings(easing, duration) {
	  if (is.fnc(easing)) { return easing; }
	  var name = easing.split('(')[0];
	  var ease = penner[name];
	  var args = parseEasingParameters(easing);
	  switch (name) {
	    case 'spring' : return spring(easing, duration);
	    case 'cubicBezier' : return applyArguments(bezier, args);
	    case 'steps' : return applyArguments(steps, args);
	    default : return applyArguments(ease, args);
	  }
	}

	// Strings

	function selectString(str) {
	  try {
	    var nodes = document.querySelectorAll(str);
	    return nodes;
	  } catch(e) {
	    return;
	  }
	}

	// Arrays

	function filterArray(arr, callback) {
	  var len = arr.length;
	  var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
	  var result = [];
	  for (var i = 0; i < len; i++) {
	    if (i in arr) {
	      var val = arr[i];
	      if (callback.call(thisArg, val, i, arr)) {
	        result.push(val);
	      }
	    }
	  }
	  return result;
	}

	function flattenArray(arr) {
	  return arr.reduce(function (a, b) { return a.concat(is.arr(b) ? flattenArray(b) : b); }, []);
	}

	function toArray(o) {
	  if (is.arr(o)) { return o; }
	  if (is.str(o)) { o = selectString(o) || o; }
	  if (o instanceof NodeList || o instanceof HTMLCollection) { return [].slice.call(o); }
	  return [o];
	}

	function arrayContains(arr, val) {
	  return arr.some(function (a) { return a === val; });
	}

	// Objects

	function cloneObject(o) {
	  var clone = {};
	  for (var p in o) { clone[p] = o[p]; }
	  return clone;
	}

	function replaceObjectProps(o1, o2) {
	  var o = cloneObject(o1);
	  for (var p in o1) { o[p] = o2.hasOwnProperty(p) ? o2[p] : o1[p]; }
	  return o;
	}

	function mergeObjects(o1, o2) {
	  var o = cloneObject(o1);
	  for (var p in o2) { o[p] = is.und(o1[p]) ? o2[p] : o1[p]; }
	  return o;
	}

	// Colors

	function rgbToRgba(rgbValue) {
	  var rgb = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(rgbValue);
	  return rgb ? ("rgba(" + (rgb[1]) + ",1)") : rgbValue;
	}

	function hexToRgba(hexValue) {
	  var rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	  var hex = hexValue.replace(rgx, function (m, r, g, b) { return r + r + g + g + b + b; } );
	  var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	  var r = parseInt(rgb[1], 16);
	  var g = parseInt(rgb[2], 16);
	  var b = parseInt(rgb[3], 16);
	  return ("rgba(" + r + "," + g + "," + b + ",1)");
	}

	function hslToRgba(hslValue) {
	  var hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hslValue) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(hslValue);
	  var h = parseInt(hsl[1], 10) / 360;
	  var s = parseInt(hsl[2], 10) / 100;
	  var l = parseInt(hsl[3], 10) / 100;
	  var a = hsl[4] || 1;
	  function hue2rgb(p, q, t) {
	    if (t < 0) { t += 1; }
	    if (t > 1) { t -= 1; }
	    if (t < 1/6) { return p + (q - p) * 6 * t; }
	    if (t < 1/2) { return q; }
	    if (t < 2/3) { return p + (q - p) * (2/3 - t) * 6; }
	    return p;
	  }
	  var r, g, b;
	  if (s == 0) {
	    r = g = b = l;
	  } else {
	    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	    var p = 2 * l - q;
	    r = hue2rgb(p, q, h + 1/3);
	    g = hue2rgb(p, q, h);
	    b = hue2rgb(p, q, h - 1/3);
	  }
	  return ("rgba(" + (r * 255) + "," + (g * 255) + "," + (b * 255) + "," + a + ")");
	}

	function colorToRgb(val) {
	  if (is.rgb(val)) { return rgbToRgba(val); }
	  if (is.hex(val)) { return hexToRgba(val); }
	  if (is.hsl(val)) { return hslToRgba(val); }
	}

	// Units

	function getUnit(val) {
	  var split = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val);
	  if (split) { return split[1]; }
	}

	function getTransformUnit(propName) {
	  if (stringContains(propName, 'translate') || propName === 'perspective') { return 'px'; }
	  if (stringContains(propName, 'rotate') || stringContains(propName, 'skew')) { return 'deg'; }
	}

	// Values

	function getFunctionValue(val, animatable) {
	  if (!is.fnc(val)) { return val; }
	  return val(animatable.target, animatable.id, animatable.total);
	}

	function getAttribute(el, prop) {
	  return el.getAttribute(prop);
	}

	function convertPxToUnit(el, value, unit) {
	  var valueUnit = getUnit(value);
	  if (arrayContains([unit, 'deg', 'rad', 'turn'], valueUnit)) { return value; }
	  var cached = cache.CSS[value + unit];
	  if (!is.und(cached)) { return cached; }
	  var baseline = 100;
	  var tempEl = document.createElement(el.tagName);
	  var parentEl = (el.parentNode && (el.parentNode !== document)) ? el.parentNode : document.body;
	  parentEl.appendChild(tempEl);
	  tempEl.style.position = 'absolute';
	  tempEl.style.width = baseline + unit;
	  var factor = baseline / tempEl.offsetWidth;
	  parentEl.removeChild(tempEl);
	  var convertedUnit = factor * parseFloat(value);
	  cache.CSS[value + unit] = convertedUnit;
	  return convertedUnit;
	}

	function getCSSValue(el, prop, unit) {
	  if (prop in el.style) {
	    var uppercasePropName = prop.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	    var value = el.style[prop] || getComputedStyle(el).getPropertyValue(uppercasePropName) || '0';
	    return unit ? convertPxToUnit(el, value, unit) : value;
	  }
	}

	function getAnimationType(el, prop) {
	  if (is.dom(el) && !is.inp(el) && (getAttribute(el, prop) || (is.svg(el) && el[prop]))) { return 'attribute'; }
	  if (is.dom(el) && arrayContains(validTransforms, prop)) { return 'transform'; }
	  if (is.dom(el) && (prop !== 'transform' && getCSSValue(el, prop))) { return 'css'; }
	  if (el[prop] != null) { return 'object'; }
	}

	function getElementTransforms(el) {
	  if (!is.dom(el)) { return; }
	  var str = el.style.transform || '';
	  var reg  = /(\w+)\(([^)]*)\)/g;
	  var transforms = new Map();
	  var m; while (m = reg.exec(str)) { transforms.set(m[1], m[2]); }
	  return transforms;
	}

	function getTransformValue(el, propName, animatable, unit) {
	  var defaultVal = stringContains(propName, 'scale') ? 1 : 0 + getTransformUnit(propName);
	  var value = getElementTransforms(el).get(propName) || defaultVal;
	  if (animatable) {
	    animatable.transforms.list.set(propName, value);
	    animatable.transforms['last'] = propName;
	  }
	  return unit ? convertPxToUnit(el, value, unit) : value;
	}

	function getOriginalTargetValue(target, propName, unit, animatable) {
	  switch (getAnimationType(target, propName)) {
	    case 'transform': return getTransformValue(target, propName, animatable, unit);
	    case 'css': return getCSSValue(target, propName, unit);
	    case 'attribute': return getAttribute(target, propName);
	    default: return target[propName] || 0;
	  }
	}

	function getRelativeValue(to, from) {
	  var operator = /^(\*=|\+=|-=)/.exec(to);
	  if (!operator) { return to; }
	  var u = getUnit(to) || 0;
	  var x = parseFloat(from);
	  var y = parseFloat(to.replace(operator[0], ''));
	  switch (operator[0][0]) {
	    case '+': return x + y + u;
	    case '-': return x - y + u;
	    case '*': return x * y + u;
	  }
	}

	function validateValue(val, unit) {
	  if (is.col(val)) { return colorToRgb(val); }
	  if (/\s/g.test(val)) { return val; }
	  var originalUnit = getUnit(val);
	  var unitLess = originalUnit ? val.substr(0, val.length - originalUnit.length) : val;
	  if (unit) { return unitLess + unit; }
	  return unitLess;
	}

	// getTotalLength() equivalent for circle, rect, polyline, polygon and line shapes
	// adapted from https://gist.github.com/SebLambla/3e0550c496c236709744

	function getDistance(p1, p2) {
	  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
	}

	function getCircleLength(el) {
	  return Math.PI * 2 * getAttribute(el, 'r');
	}

	function getRectLength(el) {
	  return (getAttribute(el, 'width') * 2) + (getAttribute(el, 'height') * 2);
	}

	function getLineLength(el) {
	  return getDistance(
	    {x: getAttribute(el, 'x1'), y: getAttribute(el, 'y1')}, 
	    {x: getAttribute(el, 'x2'), y: getAttribute(el, 'y2')}
	  );
	}

	function getPolylineLength(el) {
	  var points = el.points;
	  var totalLength = 0;
	  var previousPos;
	  for (var i = 0 ; i < points.numberOfItems; i++) {
	    var currentPos = points.getItem(i);
	    if (i > 0) { totalLength += getDistance(previousPos, currentPos); }
	    previousPos = currentPos;
	  }
	  return totalLength;
	}

	function getPolygonLength(el) {
	  var points = el.points;
	  return getPolylineLength(el) + getDistance(points.getItem(points.numberOfItems - 1), points.getItem(0));
	}

	// Path animation

	function getTotalLength(el) {
	  if (el.getTotalLength) { return el.getTotalLength(); }
	  switch(el.tagName.toLowerCase()) {
	    case 'circle': return getCircleLength(el);
	    case 'rect': return getRectLength(el);
	    case 'line': return getLineLength(el);
	    case 'polyline': return getPolylineLength(el);
	    case 'polygon': return getPolygonLength(el);
	  }
	}

	function setDashoffset(el) {
	  var pathLength = getTotalLength(el);
	  el.setAttribute('stroke-dasharray', pathLength);
	  return pathLength;
	}

	// Motion path

	function getParentSvgEl(el) {
	  var parentEl = el.parentNode;
	  while (is.svg(parentEl)) {
	    if (!is.svg(parentEl.parentNode)) { break; }
	    parentEl = parentEl.parentNode;
	  }
	  return parentEl;
	}

	function getParentSvg(pathEl, svgData) {
	  var svg = svgData || {};
	  var parentSvgEl = svg.el || getParentSvgEl(pathEl);
	  var rect = parentSvgEl.getBoundingClientRect();
	  var viewBoxAttr = getAttribute(parentSvgEl, 'viewBox');
	  var width = rect.width;
	  var height = rect.height;
	  var viewBox = svg.viewBox || (viewBoxAttr ? viewBoxAttr.split(' ') : [0, 0, width, height]);
	  return {
	    el: parentSvgEl,
	    viewBox: viewBox,
	    x: viewBox[0] / 1,
	    y: viewBox[1] / 1,
	    w: width / viewBox[2],
	    h: height / viewBox[3]
	  }
	}

	function getPath(path, percent) {
	  var pathEl = is.str(path) ? selectString(path)[0] : path;
	  var p = percent || 100;
	  return function(property) {
	    return {
	      property: property,
	      el: pathEl,
	      svg: getParentSvg(pathEl),
	      totalLength: getTotalLength(pathEl) * (p / 100)
	    }
	  }
	}

	function getPathProgress(path, progress) {
	  function point(offset) {
	    if ( offset === void 0 ) offset = 0;

	    var l = progress + offset >= 1 ? progress + offset : 0;
	    return path.el.getPointAtLength(l);
	  }
	  var svg = getParentSvg(path.el, path.svg);
	  var p = point();
	  var p0 = point(-1);
	  var p1 = point(+1);
	  switch (path.property) {
	    case 'x': return (p.x - svg.x) * svg.w;
	    case 'y': return (p.y - svg.y) * svg.h;
	    case 'angle': return Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
	  }
	}

	// Decompose value

	function decomposeValue(val, unit) {
	  // const rgx = /-?\d*\.?\d+/g; // handles basic numbers
	  // const rgx = /[+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g; // handles exponents notation
	  var rgx = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g; // handles exponents notation
	  var value = validateValue((is.pth(val) ? val.totalLength : val), unit) + '';
	  return {
	    original: value,
	    numbers: value.match(rgx) ? value.match(rgx).map(Number) : [0],
	    strings: (is.str(val) || unit) ? value.split(rgx) : []
	  }
	}

	// Animatables

	function parseTargets(targets) {
	  var targetsArray = targets ? (flattenArray(is.arr(targets) ? targets.map(toArray) : toArray(targets))) : [];
	  return filterArray(targetsArray, function (item, pos, self) { return self.indexOf(item) === pos; });
	}

	function getAnimatables(targets) {
	  var parsed = parseTargets(targets);
	  return parsed.map(function (t, i) {
	    return {target: t, id: i, total: parsed.length, transforms: { list: getElementTransforms(t) } };
	  });
	}

	// Properties

	function normalizePropertyTweens(prop, tweenSettings) {
	  var settings = cloneObject(tweenSettings);
	  // Override duration if easing is a spring
	  if (/^spring/.test(settings.easing)) { settings.duration = spring(settings.easing); }
	  if (is.arr(prop)) {
	    var l = prop.length;
	    var isFromTo = (l === 2 && !is.obj(prop[0]));
	    if (!isFromTo) {
	      // Duration divided by the number of tweens
	      if (!is.fnc(tweenSettings.duration)) { settings.duration = tweenSettings.duration / l; }
	    } else {
	      // Transform [from, to] values shorthand to a valid tween value
	      prop = {value: prop};
	    }
	  }
	  var propArray = is.arr(prop) ? prop : [prop];
	  return propArray.map(function (v, i) {
	    var obj = (is.obj(v) && !is.pth(v)) ? v : {value: v};
	    // Default delay value should only be applied to the first tween
	    if (is.und(obj.delay)) { obj.delay = !i ? tweenSettings.delay : 0; }
	    // Default endDelay value should only be applied to the last tween
	    if (is.und(obj.endDelay)) { obj.endDelay = i === propArray.length - 1 ? tweenSettings.endDelay : 0; }
	    return obj;
	  }).map(function (k) { return mergeObjects(k, settings); });
	}


	function flattenKeyframes(keyframes) {
	  var propertyNames = filterArray(flattenArray(keyframes.map(function (key) { return Object.keys(key); })), function (p) { return is.key(p); })
	  .reduce(function (a,b) { if (a.indexOf(b) < 0) { a.push(b); } return a; }, []);
	  var properties = {};
	  var loop = function ( i ) {
	    var propName = propertyNames[i];
	    properties[propName] = keyframes.map(function (key) {
	      var newKey = {};
	      for (var p in key) {
	        if (is.key(p)) {
	          if (p == propName) { newKey.value = key[p]; }
	        } else {
	          newKey[p] = key[p];
	        }
	      }
	      return newKey;
	    });
	  };

	  for (var i = 0; i < propertyNames.length; i++) loop( i );
	  return properties;
	}

	function getProperties(tweenSettings, params) {
	  var properties = [];
	  var keyframes = params.keyframes;
	  if (keyframes) { params = mergeObjects(flattenKeyframes(keyframes), params); }
	  for (var p in params) {
	    if (is.key(p)) {
	      properties.push({
	        name: p,
	        tweens: normalizePropertyTweens(params[p], tweenSettings)
	      });
	    }
	  }
	  return properties;
	}

	// Tweens

	function normalizeTweenValues(tween, animatable) {
	  var t = {};
	  for (var p in tween) {
	    var value = getFunctionValue(tween[p], animatable);
	    if (is.arr(value)) {
	      value = value.map(function (v) { return getFunctionValue(v, animatable); });
	      if (value.length === 1) { value = value[0]; }
	    }
	    t[p] = value;
	  }
	  t.duration = parseFloat(t.duration);
	  t.delay = parseFloat(t.delay);
	  return t;
	}

	function normalizeTweens(prop, animatable) {
	  var previousTween;
	  return prop.tweens.map(function (t) {
	    var tween = normalizeTweenValues(t, animatable);
	    var tweenValue = tween.value;
	    var to = is.arr(tweenValue) ? tweenValue[1] : tweenValue;
	    var toUnit = getUnit(to);
	    var originalValue = getOriginalTargetValue(animatable.target, prop.name, toUnit, animatable);
	    var previousValue = previousTween ? previousTween.to.original : originalValue;
	    var from = is.arr(tweenValue) ? tweenValue[0] : previousValue;
	    var fromUnit = getUnit(from) || getUnit(originalValue);
	    var unit = toUnit || fromUnit;
	    if (is.und(to)) { to = previousValue; }
	    tween.from = decomposeValue(from, unit);
	    tween.to = decomposeValue(getRelativeValue(to, from), unit);
	    tween.start = previousTween ? previousTween.end : 0;
	    tween.end = tween.start + tween.delay + tween.duration + tween.endDelay;
	    tween.easing = parseEasings(tween.easing, tween.duration);
	    tween.isPath = is.pth(tweenValue);
	    tween.isColor = is.col(tween.from.original);
	    if (tween.isColor) { tween.round = 1; }
	    previousTween = tween;
	    return tween;
	  });
	}

	// Tween progress

	var setProgressValue = {
	  css: function (t, p, v) { return t.style[p] = v; },
	  attribute: function (t, p, v) { return t.setAttribute(p, v); },
	  object: function (t, p, v) { return t[p] = v; },
	  transform: function (t, p, v, transforms, manual) {
	    transforms.list.set(p, v);
	    if (p === transforms.last || manual) {
	      var str = '';
	      transforms.list.forEach(function (value, prop) { str += prop + "(" + value + ") "; });
	      t.style.transform = str;
	    }
	  }
	};

	// Set Value helper

	function setTargetsValue(targets, properties) {
	  var animatables = getAnimatables(targets);
	  animatables.forEach(function (animatable) {
	    for (var property in properties) {
	      var value = getFunctionValue(properties[property], animatable);
	      var target = animatable.target;
	      var valueUnit = getUnit(value);
	      var originalValue = getOriginalTargetValue(target, property, valueUnit, animatable);
	      var unit = valueUnit || getUnit(originalValue);
	      var to = getRelativeValue(validateValue(value, unit), originalValue);
	      var animType = getAnimationType(target, property);
	      setProgressValue[animType](target, property, to, animatable.transforms, true);
	    }
	  });
	}

	// Animations

	function createAnimation(animatable, prop) {
	  var animType = getAnimationType(animatable.target, prop.name);
	  if (animType) {
	    var tweens = normalizeTweens(prop, animatable);
	    var lastTween = tweens[tweens.length - 1];
	    return {
	      type: animType,
	      property: prop.name,
	      animatable: animatable,
	      tweens: tweens,
	      duration: lastTween.end,
	      delay: tweens[0].delay,
	      endDelay: lastTween.endDelay
	    }
	  }
	}

	function getAnimations(animatables, properties) {
	  return filterArray(flattenArray(animatables.map(function (animatable) {
	    return properties.map(function (prop) {
	      return createAnimation(animatable, prop);
	    });
	  })), function (a) { return !is.und(a); });
	}

	// Create Instance

	function getInstanceTimings(animations, tweenSettings) {
	  var animLength = animations.length;
	  var getTlOffset = function (anim) { return anim.timelineOffset ? anim.timelineOffset : 0; };
	  var timings = {};
	  timings.duration = animLength ? Math.max.apply(Math, animations.map(function (anim) { return getTlOffset(anim) + anim.duration; })) : tweenSettings.duration;
	  timings.delay = animLength ? Math.min.apply(Math, animations.map(function (anim) { return getTlOffset(anim) + anim.delay; })) : tweenSettings.delay;
	  timings.endDelay = animLength ? timings.duration - Math.max.apply(Math, animations.map(function (anim) { return getTlOffset(anim) + anim.duration - anim.endDelay; })) : tweenSettings.endDelay;
	  return timings;
	}

	var instanceID = 0;

	function createNewInstance(params) {
	  var instanceSettings = replaceObjectProps(defaultInstanceSettings, params);
	  var tweenSettings = replaceObjectProps(defaultTweenSettings, params);
	  var properties = getProperties(tweenSettings, params);
	  var animatables = getAnimatables(params.targets);
	  var animations = getAnimations(animatables, properties);
	  var timings = getInstanceTimings(animations, tweenSettings);
	  var id = instanceID;
	  instanceID++;
	  return mergeObjects(instanceSettings, {
	    id: id,
	    children: [],
	    animatables: animatables,
	    animations: animations,
	    duration: timings.duration,
	    delay: timings.delay,
	    endDelay: timings.endDelay
	  });
	}

	// Core

	var activeInstances = [];
	var pausedInstances = [];
	var raf;

	var engine = (function () {
	  function play() { 
	    raf = requestAnimationFrame(step);
	  }
	  function step(t) {
	    var activeInstancesLength = activeInstances.length;
	    if (activeInstancesLength) {
	      var i = 0;
	      while (i < activeInstancesLength) {
	        var activeInstance = activeInstances[i];
	        if (!activeInstance.paused) {
	          activeInstance.tick(t);
	        } else {
	          var instanceIndex = activeInstances.indexOf(activeInstance);
	          if (instanceIndex > -1) {
	            activeInstances.splice(instanceIndex, 1);
	            activeInstancesLength = activeInstances.length;
	          }
	        }
	        i++;
	      }
	      play();
	    } else {
	      raf = cancelAnimationFrame(raf);
	    }
	  }
	  return play;
	})();

	function handleVisibilityChange() {
	  if (document.hidden) {
	    activeInstances.forEach(function (ins) { return ins.pause(); });
	    pausedInstances = activeInstances.slice(0);
	    anime.running = activeInstances = [];
	  } else {
	    pausedInstances.forEach(function (ins) { return ins.play(); });
	  }
	}

	if (typeof document !== 'undefined') {
	  document.addEventListener('visibilitychange', handleVisibilityChange);
	}

	// Public Instance

	function anime(params) {
	  if ( params === void 0 ) params = {};


	  var startTime = 0, lastTime = 0, now = 0;
	  var children, childrenLength = 0;
	  var resolve = null;

	  function makePromise(instance) {
	    var promise = window.Promise && new Promise(function (_resolve) { return resolve = _resolve; });
	    instance.finished = promise;
	    return promise;
	  }

	  var instance = createNewInstance(params);
	  var promise = makePromise(instance);

	  function toggleInstanceDirection() {
	    var direction = instance.direction;
	    if (direction !== 'alternate') {
	      instance.direction = direction !== 'normal' ? 'normal' : 'reverse';
	    }
	    instance.reversed = !instance.reversed;
	    children.forEach(function (child) { return child.reversed = instance.reversed; });
	  }

	  function adjustTime(time) {
	    return instance.reversed ? instance.duration - time : time;
	  }

	  function resetTime() {
	    startTime = 0;
	    lastTime = adjustTime(instance.currentTime) * (1 / anime.speed);
	  }

	  function seekChild(time, child) {
	    if (child) { child.seek(time - child.timelineOffset); }
	  }

	  function syncInstanceChildren(time) {
	    if (!instance.reversePlayback) {
	      for (var i = 0; i < childrenLength; i++) { seekChild(time, children[i]); }
	    } else {
	      for (var i$1 = childrenLength; i$1--;) { seekChild(time, children[i$1]); }
	    }
	  }

	  function setAnimationsProgress(insTime) {
	    var i = 0;
	    var animations = instance.animations;
	    var animationsLength = animations.length;
	    while (i < animationsLength) {
	      var anim = animations[i];
	      var animatable = anim.animatable;
	      var tweens = anim.tweens;
	      var tweenLength = tweens.length - 1;
	      var tween = tweens[tweenLength];
	      // Only check for keyframes if there is more than one tween
	      if (tweenLength) { tween = filterArray(tweens, function (t) { return (insTime < t.end); })[0] || tween; }
	      var elapsed = minMax(insTime - tween.start - tween.delay, 0, tween.duration) / tween.duration;
	      var eased = isNaN(elapsed) ? 1 : tween.easing(elapsed);
	      var strings = tween.to.strings;
	      var round = tween.round;
	      var numbers = [];
	      var toNumbersLength = tween.to.numbers.length;
	      var progress = (void 0);
	      for (var n = 0; n < toNumbersLength; n++) {
	        var value = (void 0);
	        var toNumber = tween.to.numbers[n];
	        var fromNumber = tween.from.numbers[n] || 0;
	        if (!tween.isPath) {
	          value = fromNumber + (eased * (toNumber - fromNumber));
	        } else {
	          value = getPathProgress(tween.value, eased * toNumber);
	        }
	        if (round) {
	          if (!(tween.isColor && n > 2)) {
	            value = Math.round(value * round) / round;
	          }
	        }
	        numbers.push(value);
	      }
	      // Manual Array.reduce for better performances
	      var stringsLength = strings.length;
	      if (!stringsLength) {
	        progress = numbers[0];
	      } else {
	        progress = strings[0];
	        for (var s = 0; s < stringsLength; s++) {
	          var a = strings[s];
	          var b = strings[s + 1];
	          var n$1 = numbers[s];
	          if (!isNaN(n$1)) {
	            if (!b) {
	              progress += n$1 + ' ';
	            } else {
	              progress += n$1 + b;
	            }
	          }
	        }
	      }
	      setProgressValue[anim.type](animatable.target, anim.property, progress, animatable.transforms);
	      anim.currentValue = progress;
	      i++;
	    }
	  }

	  function setCallback(cb) {
	    if (instance[cb] && !instance.passThrough) { instance[cb](instance); }
	  }

	  function countIteration() {
	    if (instance.remaining && instance.remaining !== true) {
	      instance.remaining--;
	    }
	  }

	  function setInstanceProgress(engineTime) {
	    var insDuration = instance.duration;
	    var insDelay = instance.delay;
	    var insEndDelay = insDuration - instance.endDelay;
	    var insTime = adjustTime(engineTime);
	    instance.progress = minMax((insTime / insDuration) * 100, 0, 100);
	    instance.reversePlayback = insTime < instance.currentTime;
	    if (children) { syncInstanceChildren(insTime); }
	    if (!instance.began && instance.currentTime > 0) {
	      instance.began = true;
	      setCallback('begin');
	    }
	    if (!instance.loopBegan && instance.currentTime > 0) {
	      instance.loopBegan = true;
	      setCallback('loopBegin');
	    }
	    if (insTime <= insDelay && instance.currentTime !== 0) {
	      setAnimationsProgress(0);
	    }
	    if ((insTime >= insEndDelay && instance.currentTime !== insDuration) || !insDuration) {
	      setAnimationsProgress(insDuration);
	    }
	    if (insTime > insDelay && insTime < insEndDelay) {
	      if (!instance.changeBegan) {
	        instance.changeBegan = true;
	        instance.changeCompleted = false;
	        setCallback('changeBegin');
	      }
	      setCallback('change');
	      setAnimationsProgress(insTime);
	    } else {
	      if (instance.changeBegan) {
	        instance.changeCompleted = true;
	        instance.changeBegan = false;
	        setCallback('changeComplete');
	      }
	    }
	    instance.currentTime = minMax(insTime, 0, insDuration);
	    if (instance.began) { setCallback('update'); }
	    if (engineTime >= insDuration) {
	      lastTime = 0;
	      countIteration();
	      if (!instance.remaining) {
	        instance.paused = true;
	        if (!instance.completed) {
	          instance.completed = true;
	          setCallback('loopComplete');
	          setCallback('complete');
	          if (!instance.passThrough && 'Promise' in window) {
	            resolve();
	            promise = makePromise(instance);
	          }
	        }
	      } else {
	        startTime = now;
	        setCallback('loopComplete');
	        instance.loopBegan = false;
	        if (instance.direction === 'alternate') {
	          toggleInstanceDirection();
	        }
	      }
	    }
	  }

	  instance.reset = function() {
	    var direction = instance.direction;
	    instance.passThrough = false;
	    instance.currentTime = 0;
	    instance.progress = 0;
	    instance.paused = true;
	    instance.began = false;
	    instance.loopBegan = false;
	    instance.changeBegan = false;
	    instance.completed = false;
	    instance.changeCompleted = false;
	    instance.reversePlayback = false;
	    instance.reversed = direction === 'reverse';
	    instance.remaining = instance.loop;
	    children = instance.children;
	    childrenLength = children.length;
	    for (var i = childrenLength; i--;) { instance.children[i].reset(); }
	    if (instance.reversed && instance.loop !== true || (direction === 'alternate' && instance.loop === 1)) { instance.remaining++; }
	    setAnimationsProgress(instance.reversed ? instance.duration : 0);
	  };

	  // Set Value helper

	  instance.set = function(targets, properties) {
	    setTargetsValue(targets, properties);
	    return instance;
	  };

	  instance.tick = function(t) {
	    now = t;
	    if (!startTime) { startTime = now; }
	    setInstanceProgress((now + (lastTime - startTime)) * anime.speed);
	  };

	  instance.seek = function(time) {
	    setInstanceProgress(adjustTime(time));
	  };

	  instance.pause = function() {
	    instance.paused = true;
	    resetTime();
	  };

	  instance.play = function() {
	    if (!instance.paused) { return; }
	    if (instance.completed) { instance.reset(); }
	    instance.paused = false;
	    activeInstances.push(instance);
	    resetTime();
	    if (!raf) { engine(); }
	  };

	  instance.reverse = function() {
	    toggleInstanceDirection();
	    resetTime();
	  };

	  instance.restart = function() {
	    instance.reset();
	    instance.play();
	  };

	  instance.reset();

	  if (instance.autoplay) { instance.play(); }

	  return instance;

	}

	// Remove targets from animation

	function removeTargetsFromAnimations(targetsArray, animations) {
	  for (var a = animations.length; a--;) {
	    if (arrayContains(targetsArray, animations[a].animatable.target)) {
	      animations.splice(a, 1);
	    }
	  }
	}

	function removeTargets(targets) {
	  var targetsArray = parseTargets(targets);
	  for (var i = activeInstances.length; i--;) {
	    var instance = activeInstances[i];
	    var animations = instance.animations;
	    var children = instance.children;
	    removeTargetsFromAnimations(targetsArray, animations);
	    for (var c = children.length; c--;) {
	      var child = children[c];
	      var childAnimations = child.animations;
	      removeTargetsFromAnimations(targetsArray, childAnimations);
	      if (!childAnimations.length && !child.children.length) { children.splice(c, 1); }
	    }
	    if (!animations.length && !children.length) { instance.pause(); }
	  }
	}

	// Stagger helpers

	function stagger(val, params) {
	  if ( params === void 0 ) params = {};

	  var direction = params.direction || 'normal';
	  var easing = params.easing ? parseEasings(params.easing) : null;
	  var grid = params.grid;
	  var axis = params.axis;
	  var fromIndex = params.from || 0;
	  var fromFirst = fromIndex === 'first';
	  var fromCenter = fromIndex === 'center';
	  var fromLast = fromIndex === 'last';
	  var isRange = is.arr(val);
	  var val1 = isRange ? parseFloat(val[0]) : parseFloat(val);
	  var val2 = isRange ? parseFloat(val[1]) : 0;
	  var unit = getUnit(isRange ? val[1] : val) || 0;
	  var start = params.start || 0 + (isRange ? val1 : 0);
	  var values = [];
	  var maxValue = 0;
	  return function (el, i, t) {
	    if (fromFirst) { fromIndex = 0; }
	    if (fromCenter) { fromIndex = (t - 1) / 2; }
	    if (fromLast) { fromIndex = t - 1; }
	    if (!values.length) {
	      for (var index = 0; index < t; index++) {
	        if (!grid) {
	          values.push(Math.abs(fromIndex - index));
	        } else {
	          var fromX = !fromCenter ? fromIndex%grid[0] : (grid[0]-1)/2;
	          var fromY = !fromCenter ? Math.floor(fromIndex/grid[0]) : (grid[1]-1)/2;
	          var toX = index%grid[0];
	          var toY = Math.floor(index/grid[0]);
	          var distanceX = fromX - toX;
	          var distanceY = fromY - toY;
	          var value = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
	          if (axis === 'x') { value = -distanceX; }
	          if (axis === 'y') { value = -distanceY; }
	          values.push(value);
	        }
	        maxValue = Math.max.apply(Math, values);
	      }
	      if (easing) { values = values.map(function (val) { return easing(val / maxValue) * maxValue; }); }
	      if (direction === 'reverse') { values = values.map(function (val) { return axis ? (val < 0) ? val * -1 : -val : Math.abs(maxValue - val); }); }
	    }
	    var spacing = isRange ? (val2 - val1) / maxValue : val1;
	    return start + (spacing * (Math.round(values[i] * 100) / 100)) + unit;
	  }
	}

	// Timeline

	function timeline(params) {
	  if ( params === void 0 ) params = {};

	  var tl = anime(params);
	  tl.duration = 0;
	  tl.add = function(instanceParams, timelineOffset) {
	    var tlIndex = activeInstances.indexOf(tl);
	    var children = tl.children;
	    if (tlIndex > -1) { activeInstances.splice(tlIndex, 1); }
	    function passThrough(ins) { ins.passThrough = true; }
	    for (var i = 0; i < children.length; i++) { passThrough(children[i]); }
	    var insParams = mergeObjects(instanceParams, replaceObjectProps(defaultTweenSettings, params));
	    insParams.targets = insParams.targets || params.targets;
	    var tlDuration = tl.duration;
	    insParams.autoplay = false;
	    insParams.direction = tl.direction;
	    insParams.timelineOffset = is.und(timelineOffset) ? tlDuration : getRelativeValue(timelineOffset, tlDuration);
	    passThrough(tl);
	    tl.seek(insParams.timelineOffset);
	    var ins = anime(insParams);
	    passThrough(ins);
	    children.push(ins);
	    var timings = getInstanceTimings(children, params);
	    tl.delay = timings.delay;
	    tl.endDelay = timings.endDelay;
	    tl.duration = timings.duration;
	    tl.seek(0);
	    tl.reset();
	    if (tl.autoplay) { tl.play(); }
	    return tl;
	  };
	  return tl;
	}

	anime.version = '3.1.0';
	anime.speed = 1;
	anime.running = activeInstances;
	anime.remove = removeTargets;
	anime.get = getOriginalTargetValue;
	anime.set = setTargetsValue;
	anime.convertPx = convertPxToUnit;
	anime.path = getPath;
	anime.setDashoffset = setDashoffset;
	anime.stagger = stagger;
	anime.timeline = timeline;
	anime.easing = parseEasings;
	anime.penner = penner;
	anime.random = function (min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; };

	var SocketNamespace;
	(function (SocketNamespace) {
	    SocketNamespace["Player"] = "/player";
	    SocketNamespace["Board"] = "/board";
	    SocketNamespace["Control"] = "/control";
	})(SocketNamespace || (SocketNamespace = {}));
	var SocketEvent;
	(function (SocketEvent) {
	    SocketEvent["Connect"] = "connect";
	    SocketEvent["Disconnect"] = "disconnect";
	    SocketEvent["Reconnect"] = "reconnect";
	    SocketEvent["Error"] = "error";
	})(SocketEvent || (SocketEvent = {}));
	var GameState;
	(function (GameState) {
	    GameState[GameState["Waiting"] = 0] = "Waiting";
	    GameState[GameState["Ready"] = 1] = "Ready";
	    GameState[GameState["Starting"] = 2] = "Starting";
	    GameState[GameState["Running"] = 3] = "Running";
	    GameState[GameState["Completed"] = 4] = "Completed";
	})(GameState || (GameState = {}));
	var GameEvent;
	(function (GameEvent) {
	    GameEvent["GameStateUpdated"] = "GameStateUpdated";
	    GameEvent["PlayersUpdated"] = "PlayersUpdated";
	    GameEvent["PlayerUpdated"] = "PlayerUpdated";
	    GameEvent["ButtonDown"] = "ButtonDown";
	    GameEvent["ButtonUp"] = "ButtonUp";
	    GameEvent["SequenceStarted"] = "SequenceStarted";
	    GameEvent["SequenceCompleted"] = "SequenceCompleted";
	    GameEvent["SequenceWon"] = "SequenceWon";
	    GameEvent["GameWon"] = "GameWon";
	    GameEvent["GameReset"] = "GameReset";
	})(GameEvent || (GameEvent = {}));
	var GameAction;
	(function (GameAction) {
	    GameAction["RegisterPlayer"] = "RegisterPlayer";
	    GameAction["StartGame"] = "StartGame";
	    GameAction["StartSequence"] = "StartSequence";
	    GameAction["RunSequence"] = "RunSequence";
	    GameAction["ResetGame"] = "ResetGame";
	    GameAction["ShowDebug"] = "ShowDebug";
	})(GameAction || (GameAction = {}));
	var ButtonColors;
	(function (ButtonColors) {
	    ButtonColors[ButtonColors["green"] = 1] = "green";
	    ButtonColors[ButtonColors["red"] = 2] = "red";
	    ButtonColors[ButtonColors["yellow"] = 3] = "yellow";
	    ButtonColors[ButtonColors["blue"] = 4] = "blue";
	})(ButtonColors || (ButtonColors = {}));

	class PlayerView {
	    constructor() {
	        this.animations = {};
	        this.data = {
	            buttons: {
	                "1": { color: ButtonColors[1], isActive: false },
	                "2": { color: ButtonColors[2], isActive: false },
	                "3": { color: ButtonColors[3], isActive: false },
	                "4": { color: ButtonColors[4], isActive: false }
	            },
	            player: {
	                number: 0,
	                errors: 0,
	                lastSequenceDuration: 0
	            },
	            gameState: GameState.Waiting
	        };
	        this.viewModel = new Vue({
	            el: "main",
	            data: this.data,
	            computed: {
	                isPlayerEnabled: () => {
	                    return (this.data.player.number > 0 &&
	                        this.data.player.errors < 3 &&
	                        (this.data.gameState === GameState.Waiting || this.data.gameState === GameState.Running));
	                }
	            },
	            watch: {
	                player: {
	                    handler: () => {
	                        if (this.data.player.lastSequenceDuration > 0) {
	                            this.animations.sequenceCompleteAnimation.play();
	                        }
	                    },
	                    deep: true
	                }
	            },
	            methods: {
	                noop: () => { },
	                onButtonDown: this.onButtonDown.bind(this),
	                onButtonUp: this.onButtonUp.bind(this)
	            }
	        });
	        this.socket = socket_io_slim(SocketNamespace.Player);
	        this.socket.on(SocketEvent.Connect, this.socketConnected.bind(this));
	        this.socket.on(GameEvent.GameStateUpdated, this.gameStateUpdated.bind(this));
	        this.socket.on(GameEvent.PlayerUpdated, this.playerUpdated.bind(this));
	        this.socket.on(GameEvent.GameReset, this.gameReset.bind(this));
	        this.setAnimations();
	    }
	    onButtonDown(id, e) {
	        e.target.setPointerCapture(e.pointerId);
	        this.socket.emit(GameEvent.ButtonDown, id);
	        this.data.buttons[id].isActive = true;
	    }
	    onButtonUp(id) {
	        this.data.buttons[id].isActive = false;
	    }
	    socketConnected() {
	        this.registerPlayer();
	    }
	    gameStateUpdated(gameState) {
	        this.data.gameState = gameState;
	    }
	    playerUpdated(player) {
	        this.data.player.number = player.number;
	        this.data.player.errors = player.errors;
	        this.data.player.lastSequenceDuration = player.lastSequenceDuration;
	    }
	    gameReset() {
	        this.registerPlayer();
	    }
	    registerPlayer() {
	        var _a, _b;
	        this.data.player.id = (localStorage.length > 0) ? (_a = localStorage.getItem("id"), (_a !== null && _a !== void 0 ? _a : undefined)) : (_b = js_cookie.get("id"), (_b !== null && _b !== void 0 ? _b : undefined));
	        this.socket.emit(GameAction.RegisterPlayer, this.data.player.id, (id) => {
	            this.data.player.id = id;
	            try {
	                localStorage.setItem("id", id);
	            }
	            catch (e) {
	                js_cookie.set("id", id, { expires: 1 });
	            }
	        });
	    }
	    setAnimations() {
	        this.animations.sequenceCompleteAnimation = anime({
	            targets: '#buttons button',
	            autoplay: false,
	            direction: "alternate",
	            rotate: "360deg",
	            duration: 500,
	            easing: "easeInOutCubic",
	            begin: (animation) => {
	                animation.animatables.forEach((animatable) => {
	                    animatable.target.classList.toggle("active", true);
	                });
	            },
	            complete: (animation) => {
	                animation.animatables.forEach((animatable) => {
	                    animatable.target.classList.toggle("active", false);
	                });
	            }
	        });
	    }
	}
	new PlayerView();

}());
//# sourceMappingURL=player.js.map
