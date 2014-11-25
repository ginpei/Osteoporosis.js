/*! Osteoporosis.js v1.0.1 By TAKANASHI Ginpei */
/*  https://github.com/ginpei/Osteoporosis.js  */
var Osteoporosis = (function() {
	var O = {};

	// make codes more short when minimized
	var S_PROTOTYPE = 'prototype';
	var S_EXTEND = 'extend';
	var S_TRIGGER = 'trigger';
	var S_ATTRIBUTES = 'attributes';
	var S__LISTENERS = '_listeners';
	var S__OSTEOPOROSIS__ = '__osteoporosis__';
	var S_INITIALIZE = 'initialize';

	var slice = [].slice;
	var extend = $[S_EXTEND];
	var noop = function() { };

	// ----------------------------------------------------------------

	O[S_EXTEND] = function(prototype, statics) {
		function Child(attributes) {
			this[S__OSTEOPOROSIS__](attributes);
			this[S_INITIALIZE](attributes);
		}
		Child[S_EXTEND] = O[S_EXTEND];
		extend(Child[S_PROTOTYPE], this[S_PROTOTYPE], prototype);
		extend(Child, statics);
		return Child;
	};

	// ----------------------------------------------------------------

	/**
	 * Event
	 */
	var eventPrototype = O.eventPrototype = {
		/**
		 * Binds `listener` to this object as a callback function.
		 * FYI: `off()` is not provided.
		 * @param {String} type
		 * @param {Function} listener
		 */
		on: function(type, listener) {
			var allListeners = this[S__LISTENERS];
			if (!allListeners) {
				allListeners = this[S__LISTENERS] = {};
			}

			var listeners = allListeners[type];
			if (!listeners) {
				listeners = allListeners[type] = [];
			}

			listeners.push(listener);
		},

		/**
		 * Fires an event named `type`.
		 * @param {String} type
		 */
		trigger: function(type) {
			var allListeners = this[S__LISTENERS];
			if (allListeners && allListeners[type]) {
				var args = slice.call(arguments, 1);
				allListeners[type].forEach(function(listener) {
					listener.apply(null, args);
				});
			}
		}
	};

	// ----------------------------------------------------------------

	/**
	 * Model
	 */
	var Model = O.Model = function Model() {}
	Model[S_EXTEND] = O[S_EXTEND];
	var modelPrototype = Model[S_PROTOTYPE];

	/**
	 * The constructor for model.
	 * @param {Object} attributes Key-value pairs to be set.
	 */
	modelPrototype[S__OSTEOPOROSIS__] = function(attributes) {
		this[S_ATTRIBUTES] = {};
		return this.set(attributes);
	};

	modelPrototype[S_INITIALIZE] = noop;
	modelPrototype[S_TRIGGER] = eventPrototype[S_TRIGGER];

	extend(modelPrototype, {
		/**
		 * Sets a storage value.
		 * @param {Object} attributes Pairs of keys and values to be stored.
		 */
		set: function(attributes) {
			var storage = this[S_ATTRIBUTES];
			for (var key in attributes) {
				var value = attributes[key];
				var lastValue = storage[key];
				if (value !== lastValue) {
					storage[key] = value;
					this[S_TRIGGER]('change:'+key, this, value);
					this[S_TRIGGER]('change', this);
				}
			}
			return this;
		},

		/**
		 * Gives a storage value.
		 * @param {String} key Name of the storage value.
		 * @returns {Object} The content of storaged value.
		 */
		get: function(key) {
			return this[S_ATTRIBUTES][key];
		},

		// event methods
		on: eventPrototype.on,
	});

	// ----------------------------------------------------------------

	/**
	 * View
	 */
	var View = O.View = function View() {};
	View[S_EXTEND] = O[S_EXTEND];
	var viewPrototype = View[S_PROTOTYPE];

	/**
	 * The constructor for view.
	 * @param {Object} options Any options within `el`.
	 */
	viewPrototype[S__OSTEOPOROSIS__] = function(options) {
		options = options || {};
		this.$el = $(options.el);
	};

	viewPrototype[S_INITIALIZE] = noop;
	viewPrototype[S_TRIGGER] = eventPrototype[S_TRIGGER];

	extend(viewPrototype, {
		/**
		 * Finds element(s) under own element by specified selector.
		 * @param {String} selector
		 * @returns {Element}
		 */
		$: function(selector) {
			return this.$el.find(selector);
		},

		// event methods
		on: eventPrototype.on,
	});

	return O;
})();
