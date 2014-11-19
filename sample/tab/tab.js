(function() {
/*! Osteoporosis.js v1.0.1 By TAKANASHI Ginpei */
var Osteoporosis=function(){var t={},e=Array.prototype.slice,i=
"undefined"==typeof _?$.extend:_.extend,n=function(){};t.extend=
function(e,n){function r(t){this.__osteoporosis__(t),this.
initialize(t)}return r.extend=t.extend,i(r.prototype,this.
prototype,e),i(r,n),r};var r=t.eventPrototype={on:function(t,e){
var i=this._listeners;i||(i=this._listeners={});var n=i[t];n||(n
=i[t]=[]),n.push(e)},trigger:function(t){var i=this._listeners;
if(i&&i[t]){var n=e.call(arguments,1);i[t].forEach(function(t){t
.apply(null,n)})}}};return t.Model=function(){},t.Model.extend=t
.extend,i(t.Model.prototype,{__osteoporosis__:function(t){
return this.attributes={},this.set(t)},initialize:n,set:function
(t){var e=this.attributes;for(var i in t){var n=t[i],r=e[i];n!==
r&&(e[i]=n,this.trigger("change:"+i,this,n),this.trigger(
"change",this))}return this},get:function(t){return this.
attributes[t]},on:r.on,trigger:r.trigger}),t.View=function(){},t
.View.extend=t.extend,i(t.View.prototype,{__osteoporosis__:
function(t){t=t||{},this.$el=$(t.el||document)},initialize:n,$:
function(t){return this.$el.find(t)},on:r.on,trigger:r.trigger})
,t}();

	var O = Osteoporosis;

	// --------------------------------
	// The Tab Model
	var Tab = O.Model.extend({
	});

	// --------------------------------
	// The Tab View
	var TabView = O.View.extend({
		initialize: function(options) {
			this.model = options.model;

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
			this.model.set({ target:target });
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
		tab.set({ target:'item1' });
	});
})();
