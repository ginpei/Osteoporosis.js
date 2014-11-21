(function() {
/*! Osteoporosis.js v1.0.1 By TAKANASHI Ginpei */
var Osteoporosis=function(){var t={},i="prototype",e="extend",n=
Array.prototype.slice,r="undefined"==typeof _?$[e]:_[e],o=
function(){};t[e]=function(n,o){function s(t){this.
__osteoporosis__(t),this.initialize(t)}return s[e]=t[e],r(s[i],
this[i],n),r(s,o),s};var s=t.eventPrototype={on:function(t,i){
var e=this._listeners;e||(e=this._listeners={});var n=e[t];n||(n
=e[t]=[]),n.push(i)},trigger:function(t){var i=this._listeners;
if(i&&i[t]){var e=n.call(arguments,1);i[t].forEach(function(t){t
.apply(null,e)})}}};return t.Model=function(){},t.Model[e]=t[e],
r(t.Model[i],{__osteoporosis__:function(t){return this.
attributes={},this.set(t)},initialize:o,set:function(t){var i=
this.attributes;for(var e in t){var n=t[e],r=i[e];n!==r&&(i[e]=n
,this.trigger("change:"+e,this,n),this.trigger("change",this))}
return this},get:function(t){return this.attributes[t]},on:s.on,
trigger:s.trigger}),t.View=function(){},t.View[e]=t[e],r(t.View[
i],{__osteoporosis__:function(t){t=t||{},this.$el=$(t.el||
document)},initialize:o,$:function(t){return this.$el.find(t)},
on:s.on,trigger:s.trigger}),t}();

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
