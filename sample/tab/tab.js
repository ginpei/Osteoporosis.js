(function() {
/*! Osteoporosis.js v1.0.1 By TAKANASHI Ginpei */
var Osteoporosis=function(){var t={},i="prototype",n="extend",e=
"trigger",r="attributes",o="_listeners",s=Array.prototype.slice,
u="undefined"==typeof _?$[n]:_[n],a=function(){};t[n]=function(e
,r){function o(t){this.__osteoporosis__(t),this.initialize(t)}
return o[n]=t[n],u(o[i],this[i],e),u(o,r),o};var h=t.
eventPrototype={on:function(t,i){var n=this[o];n||(n=this[o]={})
;var e=n[t];e||(e=n[t]=[]),e.push(i)},trigger:function(t){var i=
this[o];if(i&&i[t]){var n=s.call(arguments,1);i[t].forEach(
function(t){t.apply(null,n)})}}};return t.Model=function(){},t.
Model[n]=t[n],u(t.Model[i],{__osteoporosis__:function(t){
return this[r]={},this.set(t)},initialize:a,set:function(t){var
i=this[r];for(var n in t){var o=t[n],s=i[n];o!==s&&(i[n]=o,this[
e]("change:"+n,this,o),this[e]("change",this))}return this},get:
function(t){return this[r][t]},on:h.on,trigger:h[e]}),t.View=
function(){},t.View[n]=t[n],u(t.View[i],{__osteoporosis__:
function(t){t=t||{},this.$el=$(t.el||document)},initialize:a,$:
function(t){return this.$el.find(t)},on:h.on,trigger:h[e]}),t}()
;

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
