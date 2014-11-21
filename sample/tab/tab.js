(function() {
/*! Osteoporosis.js v1.0.1 By TAKANASHI Ginpei */
var Osteoporosis=function(){var t={},i="prototype",n="extend",e=
"trigger",r=Array.prototype.slice,o="undefined"==typeof _?$[n]:_
[n],s=function(){};t[n]=function(e,r){function s(t){this.
__osteoporosis__(t),this.initialize(t)}return s[n]=t[n],o(s[i],
this[i],e),o(s,r),s};var u=t.eventPrototype={on:function(t,i){
var n=this._listeners;n||(n=this._listeners={});var e=n[t];e||(e
=n[t]=[]),e.push(i)},trigger:function(t){var i=this._listeners;
if(i&&i[t]){var n=r.call(arguments,1);i[t].forEach(function(t){t
.apply(null,n)})}}};return t.Model=function(){},t.Model[n]=t[n],
o(t.Model[i],{__osteoporosis__:function(t){return this.
attributes={},this.set(t)},initialize:s,set:function(t){var i=
this.attributes;for(var n in t){var r=t[n],o=i[n];r!==o&&(i[n]=r
,this[e]("change:"+n,this,r),this[e]("change",this))}return this
},get:function(t){return this.attributes[t]},on:u.on,trigger:u[e
]}),t.View=function(){},t.View[n]=t[n],o(t.View[i],{
__osteoporosis__:function(t){t=t||{},this.$el=$(t.el||document)}
,initialize:s,$:function(t){return this.$el.find(t)},on:u.on,
trigger:u[e]}),t}();

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
