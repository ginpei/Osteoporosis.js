English -> [README.md](./README.md)

# Osteoporosis.js

最小構成のJavaScript Model-Viewライブラリー。

## なにこれ

こんな機能があります。

* イベント監視
* key-valueストレージを備えたModel
* 要素とモデルに紐づいたView

## どうやって使うの

* `<script>`タグで読み込む
* [osteoporosis.min.js](osteoporosis.min.js)からコピペしてJSファイルに貼り付ける（[サンプルのJSファイル](https://github.com/ginpei/Osteoporosis.js/blob/master/sample/tab/tab.js)を見てね）

# 例: タブ

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
	// TODO: ここにコードを書く
	// --------------------------------

})(window.Osteoporosis);
</script>
```

## モデル作成

```js
// タブモデル
var Tab = O.Model.extend({
});
```

## ビュー作成

```js
// タブビュー
var TabView = O.View.extend({
	initialize: function(options) {
		// ユーザー操作からモデルの値を更新
		// （要素→モデル）
		this.$('nav a').on('click', this.onclickButton.bind(this));

		// モデルの値からUIを更新
		// （モデル→ビュー）
		this.model.on('change:target', this.onchangeTarget.bind(this));
	},

	/**
	 * 要素がクリックされた際に呼ばれる。
	 * @param {Event} event
	 */
	onclickButton: function(event) {
		event.preventDefault();  // URLハッシュ変更させない

		var $link = $(event.currentTarget);
		var target = $link.attr('href').slice(1);  // "href=#foo" -> "foo"
		this.model.set('target', target);
	},

	/**
	 * タブモデルのtarget値が変更された際に呼ばれる。
	 * @param {Tab} tab
	 */
	onchangeTarget: function(tab) {
		// 対象の名前を取得
		var target = this.model.get('target');

		// 現時点の活性スタイルを除去
		this.$('nav a, article').removeClass('is-active');

		// 活性スタイルを設定
		var $button = this.$('nav a[href=#' + target + ']');
		var $article = this.$('article#' + target);
		$button.addClass('is-active');
		$article.addClass('is-active');
	}
});
```

## インスタンス生成して開始

```js
// 開始点
$(function() {
	// モデル
	var tab = new Tab();

	// ビュー
	var tabView = new TabView({
		$el: $('#the-tab'),
		model: tab
	});

	// 初期のタブを選択
	tab.set('target', 'item1');
});
```

# リファレンス

## イベント関連

### on(type, listener)

* `type`: {String} イベント名
* `listener`: {Functions} コールバック

```js
model.on('change', function(){});
model.set('foo', 123);
```

### trigger(type [, arguments...]);

* `type`: {String} イベント名
* arguments... : コールバックへ与えられる

```js
model.on('poke', function(target, time) { console.log(target, time); });
model.trigger('poke', { name:'obj' }, new Date());
```

### 非サポート

* `off()`
* `listenTo()`
* `once()`
* コンテキスト付きの`on()` … `on(type, listener, context)`

## Model

こんな機能です。

* key-valueストレージ
* 値変更時の`change`イベント

インスタンス作成の例:

```js
var O = Osteoporosis;
var MyModel = O.Model.extend({ /* properties */ });
var model = new MyModel({ key1:'value1', key2:'value2' });
```

### initialize(attributes)

* `attributes`: {Object} 保存される値。

指定の値を格納した状態でインスタンス生成されます。

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

* 戻り値: 保存された値。
* `key`: {String} 値の名前。

値を返します。

### set(key, value)

* 戻り値: インスタンス。
* `key`: {String} 値の名前。
* `value`: {Object} 保存される任意の値。

値を保存します。

```js
model.set('v1', 123);
console.assert(model.get('v1') === 123);
```

### set(attributes)

* 戻り値: インスタンス。
* `attributes`: {Object} 保存されるkey-valueの組み合わせ。

```js
model.set({ v1:123, v2:'foo' });
console.assert(model.get('v1') === 123);
console.assert(model.get('v2') === 'foo');
```

### attributes

* 型: Object

値を保存するオブジェクト。

`change`イベントを発火せずに値を設定する事ができます。

```js
model.set({ v1:123, v2:'foo' });
console.assert(model.attributes['v1'] === 123);
console.assert(model.attributes['v2'] === 'foo');
```

### Event機能

* `on(type, listener)`
* `trigger(type [, arguments...])`

### 非サポート

* `id`
* `has()`
* `save()`

## View

こんな機能です。

* 要素と連携
* モデルと連携

インスタンス作成の例:

```js
var O = Osteoporosis;
var MyView = O.View.extend({ /* properties */ });
var view = new MyView({ el:$('#target'), model:model });
```

### initialize(options)

`options`の`el`, `model`は自動的にプロパティに保存されます。

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

* `selector`: {String} セレクター。

要素を返します。

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

* 型: HtmlElement

コンストラクターの`options`で指定されたもの。

### $el

* 型: jQuery Object

コンストラクターの`options`で指定されたもの。

### model

* 型: Osteoporosis.Model

コンストラクターの`options`で指定されたもの。

### Event機能

* `on(type, listener)`
* `trigger(type [, arguments...])`

### 非サポート

* `events`
* `ui`
* `render()`
* `setElement()`

# このソフトウェアについて

## 開発

* 高梨ギンペイ
	* [@ginpei\_jp](https://twitter.com/ginpei_jp)
	* [@ginpei\_en](https://twitter.com/ginpei_en)
	* [ginpei.info](http://ginpei.info/)
* [ginpei/Osteoporosis.js](https://github.com/ginpei/Osteoporosis.js)

## ライセンス

* MIT License: [http://opensource.org/licenses/MIT](http://opensource.org/licenses/MIT)

## 履歴

* 2014-10-19
	* 最初のリリース。
