;(function($){
	'use strict';

	/**
	 * CustomSelect construct function
	 * @return undefined;
	 **/
	function CustomSelect(element, options){

		this.el = element;

		this.config = {
			cssPrefix: ''
		}

		this.select = element.find('select');

		$.extend(this.config, options);

		this.select.hide();

		this.build();
		this.bindEvents();

	}

	/**
	 * Creates necessary select elements and adds them to container element
	 * @return undefined;
	 **/
	CustomSelect.prototype.build = function(){

		var self = this,
			options = this.select.children(),
			selectedFlag = false;

		this.selectedOption = $('<div></div>', {
			class: self.config.cssPrefix + 'selected-option',
			text: self.select.data('default-text')
		});

		this.optionsList = $('<ul></ul>', {
			class: self.config.cssPrefix + 'options-list'
		});

		for(var i = 0, l = options.length; i < l; i++){

			var option = options.eq(i);

			var li = $('<li></li>', {
				'text': option.text(),
				'data-value': option.val()
			});

			if(option.attr('selected')){
				li.addClass(self.config.cssPrefix + 'active');
				this.selectedOption.text(option.text());
				selectedFlag = true;
			}

			this.optionsList.append(li);

		}

		if(!self.select.data('default-text') && !selectedFlag){

			this.selectedOption.text(options.eq(0).text());
			this.optionsList.children('li').eq(0).addClass(self.config.cssPrefix + 'active');

		}

		this.el.append(this.selectedOption);
		this.el.append(this.optionsList);

	}

	CustomSelect.prototype.toDefaultState = function(e){

		e.preventDefault();
		e.stopPropagation();

		var container = $(this),
			self = e.data.self;

		if(!container.hasClass(self.config.cssPrefix + 'opened')){

			container.removeClass(self.config.cssPrefix + 'over');

		}

	}

	/**
	 * Binds events to select elements
	 * @return undefined;
	 **/
	CustomSelect.prototype.bindEvents = function(){
		
		var self = this;

		this.selectedOption.on('click', function(e){

			self.el.addClass(self.config.cssPrefix + 'over');
			self.el.toggleClass(self.config.cssPrefix + 'opened');

			e.stopPropagation();

		});

		this.select.on('focus', function(e){

			e.preventDefault();
			self.el.addClass(self.config.cssPrefix + 'opened');

		});

		this.optionsList.on('click', 'li', function(e){

			var $this = $(this),
				value = $this.data('value');

			$this.addClass(self.config.cssPrefix + 'active').siblings().removeClass(self.config.cssPrefix + 'active');

			self.selectedOption.text($this.text());

			self.select.val(value);
			self.select.trigger('change');
			self.el.removeClass(self.config.cssPrefix + 'opened');

			e.stopPropagation();

		});

		$(document).on('click.selectFocusOut', function(e){
			e.stopPropagation();
			if(!$(e.target).closest('.' + self.config.cssPrefix + 'custom-select').length) $('.' + self.config.cssPrefix +  'custom-select').removeClass(self.config.cssPrefix + 'opened');

		});

		this.optionsList.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', {self: this},  this.toDefaultState.bind(this.el));

	}

	$.fn.MadCustomSelect = function(options){

		return this.each(function() {
			if (!$(this).data('customSelect')) {
				$(this).data('customSelect', new CustomSelect($(this), options));
			}
		});

	};

})(jQuery);