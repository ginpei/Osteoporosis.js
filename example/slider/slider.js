(function($, O) {
	var Range = O.Model.extend({
		proofread: function(original) {
			var value = Number(original);
			var max = this.get('max');
			var min = this.get('min');
			if (value < min) {
				value = min;
			}
			else if (value > max) {
				value = max;
			}
			return value;
		},

		setValueByProgress: function(progress) {
			var max = this.get('max');
			var min = this.get('min');

			var value = (max - min) * progress + min;
			this.set({ value:value });
		}
	});

	var SliderView = O.View.extend({
		initialize: function(options) {
			var model = this.model = options.model;
			this._initModel(this.$el, model);
			this._initElem(this.$el, model);

			this.update(model);

			// this.model.on('change', $.proxy(this.update, this));
			this.$el
				.on('mousedown', $.proxy(this.onmousedown, this))
			$(document)
				.on('mouseup', $.proxy(this.onmouseup, this))
				.on('mousemove', $.proxy(this.onmousemove, this));
		},

		_initModel: function($el, model) {
			model.set({
				max: Number($el.attr('data-max')),
				min: Number($el.attr('data-min')),
				value: Number($el.attr('data-value'))
			});
		},

		_initElem: function($el, model) {
			$el.html(
				'<span class="ui-range-bar"></span>' +
				'<span class="ui-range-knob"></span>');

			this.$knob = $el.find('.ui-range-knob');
			this._knobWidth = this.$knob.outerWidth();
		},

		update: function(model) {
			var value = model.get('value');
			var max = model.get('max');
			var min = model.get('min');

			var progress = value / (max - min);
			var range = this.$el.width() - this._knobWidth;
			var left = range * progress;

			this.$knob.css({ left:left });
		},

		_startGrabbing: function() {
			this.$el.addClass('ui-active');
			this._grabbing = true;

			this._left = this.$el.offset().left;
			this._width = this.$el.width() - this._knobWidth;
		},

		_stopGrabbing: function() {
			this.$el.removeClass('ui-active');
			this._grabbing = false;
		},

		_moveKnob: function(progress) {
			var pos = this._width * progress;
			this.$knob.css({ left:pos });

			var model = this.model;
			model.setValueByProgress(progress);
		},

		_getKnobProgress: function(event) {
			var progress = (event.clientX - this._left) / this._width;
			if (progress < 0) {
				progress = 0;
			}
			else if (progress > 1) {
				progress = 1;
			}
			return progress;
		},

		onmousedown: function(event) {
			event.preventDefault();
			this._startGrabbing();

			var progress = this._getKnobProgress(event);
			this._moveKnob(progress);
		},

		onmouseup: function(event) {
			this._stopGrabbing();
		},

		onmousemove: function(event) {
			if (this._grabbing) {
				event.preventDefault();

				var progress = this._getKnobProgress(event);
				this._moveKnob(progress);
			}
		}
	});

	var NumberView = O.View.extend({
		initialize: function(options) {
			this.model = options.model;

			this.$el
				.on('change', $.proxy(function(event) {
					var originalValue = $(event.currentTarget).val();
					var value = this.model.proofread(originalValue);
					this.model.set({ value:value });
				}, this))
				.on('blur', $.proxy(function(event) {
					this.$el.val(this.model.get('value'));
				}, this));
		},

		update: function(model) {
			this.$el.val(Math.floor(model.get('value')));
		}
	});

	function RangeUI(options) {
		var range = new Range();

		var vSlider = new SliderView({
			el: options.$slider,
			model: range
		});

		var vNumber = new NumberView({
			el: options.$number,
			model: range
		});

		range.on('change', function(range) {
			vSlider.update(range);
			vNumber.update(range);
		});

		this.range = range;
		this.vSlider = vSlider;
		this.vNumber = vNumber;
	}

	$(function() {
		// "slider/?range=74" -> "74"
		var formValue = (location.search.slice(1).match(/(?:^|&)range=(\d+)(?:&|$)/) || [])[1];
		if (formValue) {
			$('#formValue')
				.text('Value = ' + formValue)
				.show();
			$('#the-slider2').attr('data-value', formValue);
		}

		var slider1 = new RangeUI({
			$slider: $('#the-slider1'),
			$number: $('#the-number1')
		});

		var slider2 = new RangeUI({
			$slider: $('#the-slider2'),
			$number: $('#the-number2')
		});
	});
})(window.jQuery, window.Osteoporosis);
