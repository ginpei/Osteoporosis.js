(function() {
/*! Osteoporosis.js v1.0.1 By TAKANASHI Ginpei */
var Osteoporosis=function(){var t={},n="prototype",i="extend",r=
"trigger",o="attributes",e="_listeners",s="__osteoporosis__",u=
"initialize",a=[].slice,h=$[i],c=function(){};t[i]=function(r,o)
{function e(t){this[s](t),this[u](t)}return e[i]=t[i],h(e[n],
this[n],r),h(e,o),e};var f=t.eventPrototype={on:function(t,n){
var i=this[e];i||(i=this[e]={});var r=i[t];r||(r=i[t]=[]),r.push
(n)},trigger:function(t){var n=this[e];if(n&&n[t]){var i=a.call(
arguments,1);n[t].forEach(function(t){t.apply(null,i)})}}},v=t.
Model=function(){};v[i]=t[i];var l=v[n];l[s]=function(t){
return this[o]={},this.set(t)},l[u]=c,l[r]=f[r],h(l,{set:
function(t){var n=this[o];for(var i in t){var e=t[i],s=n[i];e!==
s&&(n[i]=e,this[r]("change:"+i,this,e),this[r]("change",this))}
return this},get:function(t){return this[o][t]},on:f.on});var g=
t.View=function(){};g[i]=t[i];var p=g[n];return p[s]=function(t)
{t=t||{},this.$el=$(t.el)},p[u]=c,p[r]=f[r],h(p,{$:function(t){
return this.$el.find(t)},on:f.on}),t}();

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
			el: $('#the-tab'),
			model: tab
		});

		// select default tab
		tab.set({ target:'item1' });
	});
})();
