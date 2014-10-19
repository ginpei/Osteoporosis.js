/*! Osteoporosis.js v1.0.0 By TAKANASHI Ginpei */
/*  https://github.com/ginpei/Osteoporosis.js  */
var Osteoporosis = (function() {
	var O = {};

	var slice = Array.prototype.slice;
	var extend = (typeof _ === 'undefined' ? $.extend : _.extend);
	var noop = function() { };

	// ----------------------------------------------------------------

	O.extend = function(prototype, statics) {
		function Child(attributes) {
			this.__osteoporosis__(attributes);
			this.initialize(attributes);
		}
		Child.extend = O.extend;
		extend(Child.prototype, this.prototype, prototype);
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
			var allListeners = this._listeners;
			if (!allListeners) {
				allListeners = this._listeners = {};
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
			var allListeners = this._listeners;
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
	O.Model = function Model() {}

	O.Model.extend = O.extend;

	extend(O.Model.prototype, {
		/**
		 * The constructor for model.
		 * @param {Object} attributes Key-value pairs to be set.
		 */
		__osteoporosis__: function(attributes) {
			this.attributes = {};
			return this.set(attributes);
		},

		initialize: noop,

		/**
		 * Sets a storage value.
		 * @param {String} key Name of the storage value.
		 * @param {Object} value Content of the storage value.
		 */
		set: function(key, value) {
			var attributes;

			if (arguments.length === 1) {
				attributes = key;
				for (key in attributes) {
					this.set(key, attributes[key]);
				}
				return this;
			}

			attributes = this.attributes;
			var lastValue = attributes[key];
			if (value !== lastValue) {
				attributes[key] = value;
				this.trigger('change:'+key, this, value);
				this.trigger('change', this);
			}
		},

		/**
		 * Gives a storage value.
		 * @param {String} key Name of the storage value.
		 * @returns {Object} The content of storaged value.
		 */
		get: function(key) {
			return this.attributes[key];
		},

		// event methods
		on: eventPrototype.on,
		trigger: eventPrototype.trigger
	});

	// ----------------------------------------------------------------

	/**
	 * View
	 */
	O.View = function View() {};

	O.View.extend = O.extend;

	extend(O.View.prototype, {
		/**
		 * The constructor for view.
		 * @param {Object} options Any options within `el`.
		 */
		__osteoporosis__: function(options) {
			options = options || {};
			this.el = (this.$el = $(options.el || options.$el || document))[0];
			this.model = options.model;
		},

		initialize: noop,

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
		trigger: eventPrototype.trigger
	});

	return O;
})();
