(function() {
// /*! Osteoporosis.js v1.0.0 By TAKANASHI Ginpei */
// /*  https://github.com/ginpei/Osteoporosis.js  * /
// var Osteoporosis=function(){var a={},b=Array.prototype.slice,c=
// "undefined"==typeof _?$.extend:_.extend,d=function(){};a.extend=
// function(b,d){function e(a){this.__osteoporosis__(a),this.
// initialize(a)}return e.extend=a.extend,c(e.prototype,this.
// prototype,b),c(e,d),e};var e=a.eventPrototype={on:function(a,b){
// var c=this._listeners;c||(c=this._listeners={});var d=c[a];d||(d
// =c[a]=[]),d.push(b)},trigger:function(a){var c=this._listeners;
// if(c&&c[a]){var d=b.call(arguments,1);c[a].forEach(function(a){a
// .apply(null,d)})}}};return a.Model=function(){},a.Model.extend=a
// .extend,c(a.Model.prototype,{__osteoporosis__:function(a){
// return this.attributes={},this.set(a)},initialize:d,set:function
// (a,b){var c;if(1===arguments.length){c=a;for(a in c)this.set(a,c
// [a]);return this}c=this.attributes;var d=c[a];b!==d&&(c[a]=b,
// this.trigger("change:"+a,this,b),this.trigger("change",this))},
// get:function(a){return this.attributes[a]},on:e.on,trigger:e.
// trigger}),a.View=function(){},a.View.extend=a.extend,c(a.View.
// prototype,{__osteoporosis__:function(a){a=a||{},this.el=(this.
// $el=$(a.el||a.$el||document))[0],this.model=a.model},initialize:
// d,$:function(a){return this.$el.find(a)},on:e.on,trigger:e.
// trigger}),a}();

	var O = Osteoporosis;

	// --------------------------------
	// The Tab Model
	var Tab = O.Model.extend({
	});

	// --------------------------------
	// The Tab View
	var TabView = O.View.extend({
		initialize: function(options) {
			// Update model's value by user operation
			// (Element -> Model)
			this.$('nav a').on('click', this.onclickButton.bind(this));

			// Update UI by model value
			// (Model -> View)
			this.model.on('change:target', this.onchangeTarget.bind(this));
		},

		/**
		 * Called when the button element is clicked.
		 * @param {Event} event
		 */
		onclickButton: function(event) {
			event.preventDefault();  // cancel changing URL hash

			var $link = $(event.currentTarget);
			var target = $link.attr('href').slice(1);  // "href=#foo" -> "foo"
			this.model.set('target', target);
		},

		/**
		 * Called when the target value in Tab model is changed.
		 * @param {Tab} tab
		 */
		onchangeTarget: function(tab) {
			// get target name
			var target = this.model.get('target');

			// unset last active styles
			this.$('nav a, article').removeClass('is-active');

			// set active style
			var $button = this.$('nav a[href=#' + target + ']');
			var $article = this.$('article#' + target);
			$button.addClass('is-active');
			$article.addClass('is-active');
		}
	});

	// --------------------------------
	// Entry point
	$(function() {
		// model
		var tab = new Tab();

		// view
		var tabView = new TabView({
			$el: $('#the-tab'),
			model: tab
		});

		// select default tab
		tab.set('target', 'item1');
	});
})();
