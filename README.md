日本語→[README.ja.md](./README.ja.md)

# Osteoporosis.js

Minimal Model-View library for JavaScript.

## What is this?

Provides these methods:

* Event observing.
* Model with key-value storage.
* View with an element and a model.

## How to use?

* Include with `<script>` tag.
* Paste code to your JS file from [osteoporosis.min.js](osteoporosis.min.js). (See [sample JS file](https://github.com/ginpei/Osteoporosis.js/blob/master/sample/tab/tab.js) please.)

# Example: Tab

```html
<div id="the-tab">
	<nav>
		<a class="is-active" href="#item1">Item 1</a>
		<a href="#item2">Item 2</a>
		<a href="#item3">Item 3</a>
	</nav>
	<article id="item1" class="is-active">
		<h1>Item 1</h1>
		<p class="item-image">🍎</p>
	</article>
	<article id="item2">
		<h1>Item 2</h1>
		<p class="item-image">🍣</p>
	</article>
	<article id="item3">
		<h1>Item 3</h1>
		<p class="item-image">🍌</p>
	</article>
</div>
<script src="jquery.js"></script>
<script src="osteoporosis.js"></script>
<script>
(function(O) {

	// --------------------------------
	// TODO: write codes here...
	// --------------------------------

})(window.Osteoporosis);
</script>
```

## Create Model

```js
// The Tab Model
var Tab = O.Model.extend({
});
```

## Create View

```js
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
```

## Create Instances and Start

```js
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
```

# Referenses

## Event Functions

### on(type, listener)

* `type`: {String} event name
* `listener`: {Functions} callback

```js
model.on('change', function(){});
model.set('foo', 123);
```

### trigger(type [, arguments...]);

* `type`: {String} event name.
* arguments... : given for callback.

```js
model.on('poke', function(target, time) { console.log(target, time); });
model.trigger('poke', { name:'obj' }, new Date());
```

### NOT supported

* `off()`
* `listenTo()`
* `once()`
* `on()` with context: `on(type, listener, context)`

## Model

Provides:

* key-value store
* `change` event for attributes

To make an instance:

```js
var O = Osteoporosis;
var MyModel = O.Model.extend({ /* properties */ });
var model = new MyModel({ key1:'value1', key2:'value2' });
```

### initialize(attributes)

* `attributes`: {Object} To be stored values.

The instance will be created with specified attributes.

```js
var O = Osteoporosis;
var MyModel = O.Model.extend({
	initialize: function(attributes) {
		console.log(model.get('v1'));
		console.log(model.get('v2'));
	}
});
var model = new MyModel({ v1:123, v2:'foo' });
```

### get(key)

* Returns: stored value.
* `key`: {String} name of the value.

Returns the value.

### set(key, value)

* Returns: instance.
* `key`: {String} name of the value.
* `value`: {Object} any values to be stored.

Remember the value.

```js
model.set('v1', 123);
console.assert(model.get('v1') === 123);
```

### set(attributes)

* Returns: instance.
* `attributes`: {Object} key-value pairs to be stored.

```js
model.set({ v1:123, v2:'foo' });
console.assert(model.get('v1') === 123);
console.assert(model.get('v2') === 'foo');
```

### attributes

* Type: Object

The object to store values.

You can use this if you would not like to fire `change` event.

```js
model.set({ v1:123, v2:'foo' });
console.assert(model.attributes['v1'] === 123);
console.assert(model.attributes['v2'] === 'foo');
```

### Event Functions

* `on(type, listener)`
* `trigger(type [, arguments...])`

### NOT supported

* `id`
* `has()`
* `save()`

## View

Provides:

* connection to element
* connection to model

To make an instance:

```js
var O = Osteoporosis;
var MyView = O.View.extend({ /* properties */ });
var view = new MyView({ el:$('#target'), model:model });
```

### initialize(options)

`el` and `model` values in `options` are set to property automaticaly.

```js
var O = Osteoporosis;
var MyView = O.Model.extend({
	initialize: function(options) {
		console.log(this.$el);
		console.log(this.model);
	}
});
var view = new MyView({ el:$('#target'), model:model });
```

### $(selector)

* `selector`: {String}

Returns the element(s).

```html
<div id="outer">
	<div id="inner">
		<p id="p1"></p>
	</div>
	<p id="p2"></p>
</div>
```

```js
var view = new MyView({ el:$('#inner') });
var p = view.$('p');
console.assert(p.length === 1);
console.assert(p[0].id === 'p1');
```

### el

* Type: HtmlElement

Specified in `options` of constructor.

### $el

* Type: jQuery Object

Specified in `options` of constructor.

### model

* Type: Osteoporosis.Model

Specified in `options` of constructor.

### Event Functions

* `on(type, listener)`
* `trigger(type [, arguments...])`

### NOT supported

* `events`
* `ui`
* `render()`
* `setElement()`

# About

## Developed by

* TAKANASHI Ginpei
	* [@ginpei\_jp](https://twitter.com/ginpei_jp)
	* [@ginpei\_en](https://twitter.com/ginpei_en)
	* [ginpei.info](http://ginpei.info/)
* [ginpei/Osteoporosis.js](https://github.com/ginpei/Osteoporosis.js)

## License

* MIT License: [http://opensource.org/licenses/MIT](http://opensource.org/licenses/MIT)

## History

* 2014-10-19
	* First release.
