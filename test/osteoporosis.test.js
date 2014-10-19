var expect = chai.expect;
var O = Osteoporosis;

describe('Event', function() {
	function MyEvent(){}
	MyEvent.prototype = O.eventPrototype;

	var eventObj;
	beforeEach(function() {
		eventObj = new MyEvent();
	});

	it('fires event with arguments', function() {
		var argValue1, argValue2;
		eventObj.on('foo', function(arg1, arg2) {
			argValue1 = arg1;
			argValue2 = arg2;
		});
		eventObj.trigger('foo', 123, 234);

		expect(argValue1).to.eql(123);
		expect(argValue2).to.eql(234);
	});

	it('calls all listeners', function() {
		var called1, called2;
		eventObj.on('foo', function(value) {
			called1 = value;
		});
		eventObj.on('foo', function(value) {
			called2 = value;
		});
		eventObj.trigger('foo', 123);

		expect(called1).to.eql(123);
		expect(called2).to.eql(123);
	});
});

describe('Model', function() {
	var MyModel = O.Model.extend();

	var model;
	beforeEach(function() {
		model = new MyModel();
	});

	describe('inheritance', function() {
		it('creates child', function() {
			var Child = MyModel.extend({ foo:123, child:1 });

			var child = new Child();
			expect(child.foo).to.eql(123);
			expect(child.child).to.eql(1);
		});

		it('creates descendant', function() {
			var Child = MyModel.extend({ foo:123, child:1 });
			var Granchild = Child.extend({ foo:234, granchild:1 });

			var child = new Child();
			expect(child.granchild).to.eql(undefined);

			var granchild = new Granchild();
			expect(granchild.foo).to.eql(234);
			expect(granchild.child).to.eql(1);
			expect(granchild.granchild).to.eql(1);
		});
	});

	describe('attributes', function() {
		it('sets attributes', function() {
			var model = new MyModel({ foo:123, bar:234 });
			expect(model.get('foo')).to.eql(123);
			expect(model.get('bar')).to.eql(234);
		});

		it('stores a value', function() {
			model.set('foo', 123);
			expect(model.get('foo')).to.eql(123);
		});

		it('fires the change event', function() {
			var called = false;
			model.on('change', function() {
				called = true;
			});
			model.set('foo', 123);
			expect(called).to.eql(true);
		});

		it('does not fire the change event for same value', function() {
			model.set('foo', 123);

			var called = false;
			model.on('change', function() {
				called = true;
			});
			model.set('foo', 123);
			expect(called).to.eql(false);
		});

		it('fires event named as changed key', function() {
			var called = false;
			model.on('change:foo', function() {
				called = true;
			});
			model.set('foo', 123);
			expect(called).to.eql(true);
		});
	});
});

describe('View', function() {
	var MyView = O.View.extend();

	var view;
	beforeEach(function() {
		view = new MyView();

		// mock for jQuery
		$ = function(el) {
			var obj = {
				'0': el,
				find: function() {}
			};
			return obj;
		};
	});

	describe('elements', function() {
		it('stores a jQuery object by the el option', function() {
			var el = {};
			view = new MyView({ el:el });
			expect(view.$el[0]).to.equal(el);
		});

		it('stores a jQuery object by the $el option', function() {
			var el = {};
			view = new MyView({ $el:el });
			expect(view.$el[0]).to.equal(el);
		});

		it('stores an element object by the el option', function() {
			var el = {};
			view = new MyView({ el:el });
			expect(view.el).to.equal(el);
		});

		it('stores an element object by the $el option', function() {
			var el = {};
			view = new MyView({ $el:el });
			expect(view.el).to.equal(el);
		});

		it('finds any elements under its own element', function() {
			view = new MyView({ $el:{} });

			var called;
			view.$el.find = function(selector) {  // a mock to "finds any elements under its own element"
				called = selector;
			};

			view.$('#foo');
			expect(called).to.eql('#foo');
		});
	});

	describe('model', function() {
		it('stores a model in initialize option', function() {
			var model = {};
			view = new MyView({ model:model });
			expect(view.model).to.equal(model);
		});
	});
});
