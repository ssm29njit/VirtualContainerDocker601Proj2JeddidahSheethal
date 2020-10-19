;(function($){
	'use strict';

	function Accordion(element, options){

		this.el = element;

		this.config = {
			toggle: false,
			easing: 'linear',
			speed: 350,
			hideFirst: false,
			afterOpen: function(){},
			afterClose: function(){},
			cssPrefix: ''
		}

		options = options || {};

		$.extend(this.config, options);

		this.titleClass = this.config.toggle ? this.config.cssPrefix + 'toggle-title' : this.config.cssPrefix + 'accordion-title';
		this.defClass = this.config.toggle ? this.config.cssPrefix + 'toggle-definition' : this.config.cssPrefix + 'accordion-definition';
		this.activeClass = this.config.cssPrefix + 'active';

		this.toDefaultState();
		this.bindEvents();

	}

	Accordion.prototype.toDefaultState = function(){

		var active = this.el.find('.' + this.activeClass);

		if(!active.length){
			active = this.el.find('.' + this.titleClass).eq(0);
			if(!this.config.hideFirst) {
				active.addClass(this.activeClass);
			}
		}

		if(this.config.toggle){

			this.el.find('.' + this.titleClass)
				.next('.' + this.defClass)
				.hide();

			if(!this.config.hideFirst) {
				active
					.next('.' + this.defClass)
					.show();
			}

			return false;
		}

		active
			.next('.' + this.defClass)
			.siblings('.' + this.defClass)
			.hide();

	}

	Accordion.prototype.bindEvents = function(){

		var self = this;

		this.el.on('click', '.' + self.titleClass, function(e){

			var title = $(this);

			e.preventDefault();

			if(self.config.toggle){
				self.toggleHandler(title);
			}
			else{
				self.accordionHandler(title);
			}

		});

	}

	Accordion.prototype.accordionHandler = function(title){

		var $this = title,
			self = this;

		if($this.hasClass(self.activeClass)){

			$this
				.removeClass(self.activeClass)
				.next('.'+ self.defClass)
				.stop()
				.slideUp({
					duration: self.config.speed,
					easing: self.config.easing,
					complete: self.config.afterClose.bind($this.next('.' + self.defClass))
				});

			return false;
		}

		$this
			.addClass(self.activeClass)
			.next('.' + self.defClass)
			.stop()
			.slideDown({
				duration: self.config.speed,
				easing: self.config.easing,
				complete: self.config.afterOpen.bind($this.next('.' + self.defClass))
			})
			.siblings('.' + self.defClass)
			.stop()
			.slideUp({
				duration: self.config.speed,
				easing: self.config.easing,
				complete: self.config.afterClose.bind($this.next('.' + self.defClass))
			})
			.prev('.' + self.titleClass)
			.removeClass(self.activeClass);

	}

	Accordion.prototype.toggleHandler = function(title){

		var $this = title,
			self = this;

		if($this.hasClass(self.activeClass)){

			$this
				.removeClass(self.activeClass)
				.next('.' + self.defClass)
				.stop()
				.slideUp({
					duration: self.config.speed,
					easing: self.config.easing,
					complete: self.config.afterClose.bind($this.next('.' + self.defClass))
				});

		}
		else{
			$this
				.addClass(self.activeClass)
				.next('.' + self.defClass)
				.stop()
				.slideDown({
					duration: self.config.speed,
					easing: self.config.easing,
					complete: self.config.afterOpen.bind($this.next(self.defClass))
				});
		}

	}

	$.fn.MadAccordion = function(options){

		return this.each(function(){

			var $this = $(this);

			if(!$this.data('accordion')){
				$this.data('accordion', new Accordion($this, options));
			}

		});

	}

}(jQuery));