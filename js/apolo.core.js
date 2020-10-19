/*
|--------------------------------------------------------------------------
| apolo.core.js
|--------------------------------------------------------------------------
| Defines core object.
*/
;(function($){
	'use strict';

	$.Apolo = {
		RTL: getComputedStyle( document.body ).direction === 'rtl',
		isTouch: $('html').hasClass('apo-touchevents'),
		TRANSITIONEND : "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",

		modules: {
			isotopeEffect: {
				_config: {
					itemTarget: '.apo-project, .apo-entry',
					itemBaseElement: '.apo-project-media, .apo-entry-media',
					timeout: 1500,
					delayInterval: 100
				},
				init: function( containers, collection, config ) {
					var _self = this;
					if( !containers || !containers.length ) return;

					config = $.isPlainObject( config ) ? $.extend( true, {}, this._config, config ) : this._config;

					containers.each(function(index, element) {
						_self.initEffect( $(element), collection, config );
					});
				},
				initEffect: function($container, collection, config) {
					var _self = this, $targets, $baseElements;
					if( $container.data('isotopeEffect') ) return;

					if(collection && collection.length) {
						collection.each(function(index, element){
							var $element = $(element),
								$target = $element.find( config.itemTarget ),
								$baseElement = $element.find( config.itemBaseElement );

							if( $target.length && $baseElement.length ) {
								$baseElement.css('width', $baseElement.outerWidth()).addClass('apo-isotope-effect');
								if( index > 0 ) $target.css('transition-delay', index * config.delayInterval + 'ms');
								$target.addClass('apo-isotope-effect').on($.Apolo.TRANSITIONEND, function(event) {
									if(event.originalEvent.propertyName !== 'width') return;
									var $this = $(this);
									$this.removeClass('apo-isotope-effect apo-isotope-effect-loaded');
									$this.find(config.itemBaseElement).removeClass('apo-isotope-effect').css('width', 'auto');
									event.stopPropagation();
								});
								setTimeout(function(){
									$target.addClass('apo-isotope-effect-loaded');
								}, config.timeout);
							}

						});

						$container.data('isotopeEffect', true);
						return;
					}

					$targets = $container.find( config.itemTarget );
					$baseElements = $container.find( config.itemBaseElement );

					if( $baseElements.length ) {
						$baseElements.each(function(index, element){
							var $element = $(element);
							$element.css('width', $element.outerWidth());
						});
						$baseElements.addClass('apo-isotope-effect');
					}

					if( $targets.length ) {
						$targets.addClass('apo-isotope-effect').each(function(index, element){
							var $element = $(element);
							if( index > 0 ) $element.css('transition-delay', index * config.delayInterval + 'ms');
						}).on($.Apolo.TRANSITIONEND, function(event) {
							if(event.originalEvent.propertyName !== 'width') return;
							var $this = $(this);
							$this.removeClass('apo-isotope-effect apo-isotope-effect-loaded');
							$this.find(config.itemBaseElement).removeClass('apo-isotope-effect').css('width', 'auto');
						});
						setTimeout(function(){
							$targets.addClass('apo-isotope-effect-loaded');
						}, config.timeout);
					}
					$container.data('isotopeEffect', true);
				}
			},
			stickySection: {

				STICKYPADDING: 10,
				MAXSTICKYHEIGHT: 90,

				init: function(){

					this.body = $('body');
					this.sticky = $('#header').find('.apo-sticky');

					if(!this.sticky.length) return;

					this.bindEvents();
					this.updateDocumentState();

				},

				updateDocumentState: function(){
					
					var self = this;

					if(self.resizeTimeoutId) clearTimeout(self.resizeTimeoutId);

					self.resizeTimeoutId = setTimeout(function(){

						self.reset();

						self.sticky.removeAttr('style');

						if($(window).width() < 768) return;

						self.stickyHeight = self.sticky.outerHeight();

						if(self.stickyHeight > self.MAXSTICKYHEIGHT){

							self.needScale = true;

							self.defPaddingTop = parseInt(self.sticky.css('padding-top'), 10);
							self.defPaddingBottom = parseInt(self.sticky.css('padding-bottom'), 10);

							self.stickyOffset = self.sticky.offset().top + self.defPaddingTop - self.STICKYPADDING;

						}
						else{

							self.needScale = false;
							self.stickyOffset = self.sticky.offset().top;

						}					

						$(window).trigger('scroll.sticky');

					}, 120);

				},

				reset: function(){

					var $w = $(window);

					this.sticky.removeClass('apo-sticked');

					this.freeSpace();

					if($w.width() < 768 && this.hasEvents){

						var spacer = this.sticky.siblings('.apo-sticky-spacer');
						if(spacer.length) spacer.remove();

						$w.off('scroll.sticky');
						this.hasEvents = false;

						return;

					}
					else if($w.width() >= 768 && !this.hasEvents){

						$w.on('scroll.sticky', {self: this}, this.scrollHandler);
						this.hasEvents = true;

					}

				},

				bindEvents: function(){

					var $w = $(window),
						self = this;

					$w.on('scroll.sticky', {self: this}, this.scrollHandler);
					$w.on('resize.sticky', function(){

						self.updateDocumentState();

					});
					self.hasEvents = true;

				},

				scrollHandler: function(e){

					var $w = $(this),
						self = e.data.self;

					if($w.scrollTop() > self.stickyOffset && !self.sticky.hasClass('apo-sticked')){

						self.sticky.addClass('apo-sticked');

						if(self.needScale){

							self.sticky.css({
								'padding-top': self.STICKYPADDING,
								'padding-bottom': self.STICKYPADDING
							});

						}

						self.fillSpace();

					}
					else if($w.scrollTop() <= self.stickyOffset && self.sticky.hasClass('apo-sticked')){

						self.sticky.removeClass('apo-sticked');

						if(self.needScale){
						
							self.sticky.css({
								'padding-top': self.defPaddingTop,
								'padding-bottom': self.defPaddingBottom
							});

						}

						self.freeSpace();

					}

				},

				fillSpace: function(){

					var self = this,
						parent = self.sticky.parent(),
						spacer = parent.children('.apo-sticky-spacer');

					if(spacer.length){
						spacer.show().css('height', self.stickyHeight);
						return false;
					}
					else{

						spacer = $('<div></div>', {
							class: 'apo-sticky-spacer',
							style: 'height:' + self.stickyHeight + 'px'
						});

						self.sticky.before(spacer);

					}

				},

				freeSpace: function(){

					var self = this,
						parent = self.sticky.parent(),
						spacer = parent.children('.apo-sticky-spacer');

					if(spacer.length) spacer.hide();

				}

			},
			alertMessage: function(options) {
				if(!('Handlebars' in window)) return;
				var config = {
					target: $('body').children().last(),
					type: 'info',
					icon: 'icon-notification-circle',
					timeout: 4000
				};
				config = options && $.isPlainObject(options) ? $.extend(true, {}, config, options) : config;

				var template = 
					'<div class="apo-alert-box-{{type}}" style="display: none;">\
						<div class="apo-alert-box-content">\
							<i class="icon icon-{{icon}}"></i>\
							{{message}}\
						</div>\
					</div>';

				var messageBox = $(Handlebars.compile(template)(config));
				messageBox.data('timeOut', setTimeout(function(){
					messageBox.stop().slideUp({
						duration: 350,
						easing: 'linear',
						step: function() {
							var sameHeight = $(this).closest('.apo-same-height-container');
							if(sameHeight.length && sameHeight.data('SameHeight')) {
								sameHeight.data('SameHeight').setHeight();
							}
						},
						complete: function() {
							var sameHeight = $(this).closest('.apo-same-height-container');
							if(sameHeight.length && sameHeight.data('SameHeight')) {
								sameHeight.data('SameHeight').setHeight();
							}
							$(this).remove();
						}
					});
				}, config.timeout)).insertAfter(config.target).stop().slideDown({
					duration: 350,
					easing: 'linear',
					step: function() {
						var sameHeight = $(this).closest('.apo-same-height-container');
						if(sameHeight.length && sameHeight.data('SameHeight')) {
							sameHeight.data('SameHeight').setHeight();
						}
					},
					complete: function() {
						var sameHeight = $(this).closest('.apo-same-height-container');
						if(sameHeight.length && sameHeight.data('SameHeight')) {
							sameHeight.data('SameHeight').setHeight();
						}
					}
				});
			},
			pageLoader: function(customDelay) {
				var preloader = $('.apo-preloader');
				if(!preloader.length) return;
				customDelay = customDelay ? customDelay : 1500;

				setTimeout(function(){
					$('body').apoImagesLoaded().then(function(){
						preloader.fadeOut(function(){
							$(this).remove();
						});
					});
				}, customDelay);
			},
			backToTop: {
				config: {
					easing: 'linear',
					duration: 400
				},
				init: function( collection, config ) {
					if(!collection || !collection.length) {
						return;
					}
					var _self = this;
					config = config && $.isPlainObject( config ) ? $.extend(true, {}, this.config, config) : this.config;

					this.page = $('html, body');

					collection.on('click.ApoloBackToTopButton', function( event ){
						_self.movePage( config );
						event.preventDefault();
					});
				},
				movePage: function(config) {
					this.page.stop().animate({
						scrollTop: 0
					}, {
						easing: config.easing,
						duration: config.duration
					});
				}
			},
			OWLCarousel: {
				collection: $(),
				config: {
					items: 1,
					dots: false,
					navText: [],
					navElement: 'button',
					smartSpeed: 500,
					fluidSpeed: 500,
					autoplaySpeed: 500,
					navSpeed: 500,
					dotsSpeed: 500,
					dragEndSpeed: 500,
					animateIn: 'fadeIn',
					animateOut: 'fadeOut'
				},
				init: function( container, config ) {
					if( !container || !container.length ) return;
					this.collection = this.collection.add( container );

					config = $.isPlainObject( config ) ? $.extend( true, {
						rtl: $.Apolo.RTL
					}, this.config, config ) : this.config;

					container.owlCarousel( config );
				}
			},
			fullScreen: function( controls, controlsClose, selector ) {
				if( !controls || !controls.length || !selector ) return;

				var $element, element, isFullScreen = false;

				controls.on( 'click.ApoloFullScreen', function(e) {
					element = document.querySelector(selector);
					$element = $(selector);

					if ( element && element.requestFullscreen ) {
						element.requestFullscreen();
						$element.addClass('apo-fullscreen-element');
						isFullScreen = true;
					}
					else if ( element && element.webkitRequestFullscreen ) {
						element.webkitRequestFullscreen();
						$element.addClass('apo-fullscreen-element');
						isFullScreen = true;
					}
					else if ( element && element.mozRequestFullScreen ) {
						element.mozRequestFullScreen();
						$element.addClass('apo-fullscreen-element');
						isFullScreen = true;
					}
					else if ( element && element.msRequestFullscreen ) {
						element.msRequestFullscreen();
						$element.addClass('apo-fullscreen-element');
						isFullScreen = true;
					}
				});

				if(controlsClose && controlsClose.length) {
					controlsClose.on('click.ApoloFullScreen', function(e) {
						if (document.exitFullscreen) {
							document.exitFullscreen();
							$('.apo-fullscreen-element').removeClass('apo-fullscreen-element');
							isFullScreen = false;
						}
						else if (document.webkitExitFullscreen) {
							document.webkitExitFullscreen();
							$('.apo-fullscreen-element').removeClass('apo-fullscreen-element');
							isFullScreen = false;
						}
						else if (document.mozCancelFullScreen) {
							document.mozCancelFullScreen();
							$('.apo-fullscreen-element').removeClass('apo-fullscreen-element');
							isFullScreen = false;
						}
						else if (document.msExitFullscreen) {
							document.msExitFullscreen();
							$('.apo-fullscreen-element').removeClass('apo-fullscreen-element');
							isFullScreen = false;
						}
					});
				}

				// function onExit(event) {
				// 	if(isFullScreen) {
				// 		$('.apo-fullscreen-element').removeClass('apo-fullscreen-element');
				// 		isFullScreen = false;
				// 	}
				// }

				// document.addEventListener('webkitfullscreenchange', onExit, false);
			 //    document.addEventListener('mozfullscreenchange', onExit, false);
			 //    document.addEventListener('fullscreenchange', onExit, false);
			 //    document.addEventListener('MSFullscreenChange', onExit, false);
			 //    document.addEventListener('onfullscreenchange', onExit, false);
			},
			hiddenSideColumn: {
				config: {
					position: 'left',
					invokerSelector: '.apo-hidden-column-invoker',
					closingSelector: '.apo-hidden-column-closing'
				},
				init: function(config) {
					
					config = $.isPlainObject(config) ? $.extend(true, {}, this.config, config) : config;

					this.body = $('body');

					this.body
						.addClass('apo-hidden-column-initialized')
						.addClass('apo-hidden-column-' + config.position);

					this._bindEvents(config);
				},
				_bindEvents: function(config) {
					var _self = this;
					if(config.invokerSelector) {
						this.body.on('click.ApoloSideHiddenColumn', config.invokerSelector, function(e){
							_self.body.addClass('apo-hidden-column-opened');
							$(document).trigger('apo.hidden-column.opened');
							e.preventDefault();
						});
					}

					if(config.closingSelector) {
						this.body.on('click.ApoloSideHiddenColumn', config.closingSelector, function(e){
							_self.body.removeClass('apo-hidden-column-opened');
							$(document).trigger('apo.hidden-column.closed');
							e.preventDefault();
						});
					}
				}
			},
			arcticModals: {
				_config: {
					type: 'html',
					closeOnOverlayClick: true,
					overlay: {
						css: {
							opacity: .7,
							backgroundColor: '#000000'
						}
					},
					clickableElements: null
				},
				_collection: $(),
				init: function( collection, config ) {
					if( !collection || !collection.length ) return;

					config = $.isPlainObject( config ) ? $.extend(true, {}, this._config, config) : this._config;

					config = this._prepareCallbacks( config );

					if( config.clickableElements ) {
						$('body').on('click.ApoloArcticModals', '.arcticmodal-container', function(e){
							var $target = $(e.target);
							if( !$target.closest( config.clickableElements ).length ) {
								$.arcticmodal('close');
							}
						});
					}

					collection.on('click.ApoloArcticModals', function(e) {

						var $this = $(this);

						if( $this.data('arctic-modal-type') == 'ajax' ) {
							$.arcticmodal($.extend(true, {}, config, {
								type: 'ajax',
								url: $this.data('arctic-modal'),
								ajax: {
									cache: false,
									dataType: 'html',
									success: function(data, el, response) {
										data.body.html( Handlebars.compile( response )( $this.data() ) );
									}
								}
							}));
						}
						else {
							$($this.data('arctic-modal')).arcticmodal(config);
						}

						e.preventDefault();
					});
				},
				_prepareCallbacks: function(config) {
					var beforeOpenCallback = config.beforeOpen || function(){},
						beforeCloseCallback = config.beforeOpen || function(){},
						$page = $('.apo-page'),
						$header = $('#header'),
						$footer = $('#footer');

					if(!$page.length) return;

					config.beforeOpen = function() {
						$page.add($header).add($footer).addClass('apo-blured');
						beforeOpenCallback.apply(this, Array.prototype.slice(arguments, 0));
					};

					config.beforeClose = function() {
						var $openedHamburgers = $('.hamburger.is-active[data-arctic-modal]');
						$page.add($header).add($footer).removeClass('apo-blured');
						beforeCloseCallback.apply(this, Array.prototype.slice(arguments, 0));
						if($openedHamburgers.length) {
							$openedHamburgers.removeClass('is-active');
						}
					};

					return config;

				}
			}
		},
		helpers: {
			movedLabel: function(selector) {
				var collection = $(selector);
				if( !collection.length ) return;
				var fields = collection.find('input, textarea');
				if(!fields.length) return;

				fields.on('focus', function(event) {
					$(this).closest(selector).addClass('apo-label-up');
				})
				.on('focusout', function(event){
					if( !$(this).val() ) $(this).closest(selector).removeClass('apo-label-up');
				});
			},
			hamburgers: function() {
				$('body').on('click.hamburgers', '.hamburger.apo-hamburger-clickable', function(e) {
					$(this).toggleClass( 'is-active' );
					e.preventDefault();
				});
			},
			dynamicBgImage: function() {
				var collection = $('[data-bg-img-src]');
				if(!collection.length) return;

				return collection.each(function(i, el){
					var $this = $(el);
					if( !$this.data('bg-img-src') ) return;

					$this.css('background-image', 'url("'+ $this.data('bg-img-src') +'")');
				});
			},
			portfolioTriangles: {
				init: function() {
					this.collection = $('.apo-project-triangle');
					if(!this.collection.length) return;

					var _self = this;

					this.$w = $(window);

					this.$w.on( 'resize.ApoloPortfolioTriangles', function() {
						if( _self.resizeTimeOutId ) clearTimeout( _self.resizeTimeOutId );
						_self.resizeTimeOutId = setTimeout( function(){
							_self.setBorder();
						}, 150 );
					} );

					this.collection.closest('.apo-project').on('mouseenter.ApoloPortfolioTriangles', function(e) {
						var $project = $(this),
							$triangle = $project.find('.apo-project-triangle');

						$project.addClass('apo-project--hover-state');
						$triangle.css('border-bottom-width', $triangle.data('border-bottom-width'));
					})
					.on('mouseleave.ApoloPortfolioTriangles', function(e) {
						var $project = $(this),
							$triangle = $project.find('.apo-project-triangle');

						$project.removeClass('apo-project--hover-state');
						$triangle.css('border-bottom-width', 0);	
					});

					this.setBorder();
				},
				setBorder: function() {

					return this.collection.each(function( index, element ){
						var $element = $(element),
							$container = $element.closest('.apo-project'),
							containerHeight,
							containerWidth;

						if(!$container.length) return;

						containerHeight = $container.outerHeight();
						containerWidth = $container.outerWidth();

						$element.data('border-bottom-width', containerHeight * 0.9);
						$element.css( $.Apolo.RTL ? 'border-left-width' : 'border-right-width', containerWidth );
					});
				}
			},
			fixedContent: {
				init: function( column, breakpointElement ) {
					if( !column || !column.length || !breakpointElement || !breakpointElement.length) return;
					var _self = this;

					this.column = column;
					this.breakpointElement = breakpointElement;
					this.$window = $(window);

					this.updateCoords().moveColumn();

					this.$window.on('scroll.ApoloFixedContent', function() {
						_self.reset().moveColumn();
					})
					.on('resize.ApoloFixedContent', function() {
						if(_self.resizeTimeOutId) clearTimeout(_self.resizeTimeOutId);
						_self.resizeTimeOutId = setTimeout(function() {
							_self.updateCoords().moveColumn();
						}, 50);
					});
				},
				reset: function() {
					this.column.css('top', 0);
					return this;
				},
				updateCoords: function() {
					this.breakpoint = this.breakpointElement.offset().top;
					return this;
				},
				moveColumn: function() {
					var currentPoint = this.$window.scrollTop() + this.$window.height();
					if(currentPoint >= this.breakpoint) {
						this.column.css('top', (currentPoint - this.breakpoint) * -1);
					}
					return this;
				}
			},
			fullHeight: {
				collection: $(),
				init: function( collection ) {
					if(!collection || !collection.length) return;
					var _self = this;
					this.collection = this.collection.add( collection );
					this.$window = $(window);
					this.$body = $('body');
					this.updateDocumentInfo().setHeight();
					this.$window.on('resize.ApoloFullHeight', function(e) {
						if( _self.resizeTimeOutId ) clearTimeout( _self.resizeTimeOutId );
						_self.resizeTimeOutId = setTimeout( function() {
							_self.updateDocumentInfo().setHeight();
						}, 50 );
					});
				},
				updateDocumentInfo: function() {
					this.wHeight = this.$window.height();
					return this;
				},
				setHeight: function() {
					this.collection.css('height', this.wHeight);
					this.$body.addClass('apo-body-scroll-locked');
					return this;
				}
			},
			owlSingleHower: function( container ) {
				if( !container || !container.length ) return false;

				container.on('mouseenter.ApoloOwlSingleHover', '.owl-item', function(e){
					$(this)
						.removeClass('owl-item-unfocused')
						.addClass('owl-item-focused')
						.siblings('.owl-item.active')
						.addClass('owl-item-unfocused');
				}).on('mouseleave.ApoloOwlSingleHover', '.owl-item', function(e) {
					$(this)
						.removeClass('owl-item-focused')
						.siblings('.owl-item.active')
						.removeClass('owl-item-unfocused');
				});

			},
			stripedPhotosCarouselHover: {
				collection: $(),
				config: {
					easing: 'linear',
					duration: 500,
					coefficient: 2
				},
				init: function( containers, config ) {
					if( !containers || !containers.length ) return;
					var _self = this;
					this.$window = $(window);

					config = $.isPlainObject( config ) ? $.extend(true, {}, this.config, config ) : this.config;

					this.collection = this.collection.add( containers );
					this.updateItemsInfo();
					this._bindEvents( containers, config );

					this.collection.on('resized.owl.carousel', function(){
						_self.updateItemsInfo();
					});
				},
				updateItemsInfo: function() {

					this.collection.each( function(index, element) {
						var $element = $(element);
						$element.data( 'stripedItemWidth', $element.find('.owl-item:not(.active)').outerWidth() );
					} );

					return this;
				},
				_bindEvents: function( containers, config ) {
					containers.on( 'mouseenter.ApoloStripedPhotosCarouselHover', '.owl-item', function() {
						var $this = $(this),
							$container = $this.closest('.owl-carousel');

						if( !$container.data('owl.carousel').settings.itemsGrow ) return false;

						var baseWidth = $container.data('stripedItemWidth'),
							width = baseWidth * config.coefficient,
							amountOfActiveItems = $this.siblings('.owl-item.active').length;

						$this.stop().animate({
							width: width
						}, {
							easing: config.easing,
							duration: config.duration
						})
						.siblings('.owl-item.active')
						.stop()
						.animate({
							width: baseWidth - ( (width - baseWidth) / amountOfActiveItems )
						}, {
							easing: config.easing,
							duration: config.duration
						})
					} ).on('mouseleave.ApoloStripedPhotosCarouselHover', '.owl-item', function() {
						var $this = $(this),
							$container = $this.closest('.owl-carousel');

						if( !$container.data('owl.carousel').settings.itemsGrow ) return false;

						var baseWidth = $container.data('stripedItemWidth');

						$this.add($this.siblings('.owl-item')).stop().animate({
							width: baseWidth
						}, {
							duration: config.duration,
							easeing: config.easeing
						});
					} )
				}
			},
			revThumbs: {
				config: {
					revAPI: null,
					target: '.apo-slider-thumb'
				},
				_collection: $(),
				init: function( container, config ) {
					if( !container || !container.length || this._collection.has(container).length ) return;
					var _self = this;

					config = $.isPlainObject(config) ? $.extend(true, {}, this.config, config) : this.config;

					if( !config.revAPI ) return;

					container.each( function( index, element ) {
						_self.initInstance( $(element), config );
						_self._collection = _self._collection.add( $(element) );
					} );
				},
				initInstance: function($container, config) {

					var $items = $container.find( config.target );

					config.revAPI.on('revolution.slide.onchange', function(event, data) {
 						$items.closest('.swiper-slide')
 							.eq( data.slideIndex - 1 )
 							.children()
 							.addClass('apo-active')
 							.parent()
 							.siblings()
 							.children()
 							.removeClass('apo-active');
					});

					$container.on( 'click.ApoloRevThumbs', config.target, function(e) {
						var $current = $(this),
							index = $current.closest('.swiper-slide').index() + 1;

						config.revAPI.revshowslide(index);
						e.preventDefault();
					});
				}
			},
			OWLImageThumbs: function(container, imageSelector){
				if(!container || !container.length || !imageSelector) return;

				container.each(function(i, el){

					var $this = $(el),
						$dots = $this.find('.owl-dot');

					$this.find('.owl-item').each(function(i, el){

						var authorBox = $(this).find(imageSelector);
						$dots.eq(i).append(authorBox);

					});


				});

			},
			fullPageSlideNumbers: {
				init: function( $element ) {
					if( !$element || !$element.length ) return;
					this.$element = $element;
					this._generateElements();
					this._bindEvents();
				},
				_generateElements: function() {
					this.$currentSlide = $('<span></span>', {
						class: 'apo-fp-slide-numbers-current',
						text: '00'
					});
					this.$amount = $('<span></span>', {
						class: 'apo-fp-slide-numbers-amount',
						text: '00'
					});
				},
				_bindEvents: function() {
					var $d = $(document),
						_self = this;
						
					$d.on('render.apolo.fullpage', function(event, data){
						var $container = data.$container,
							sections = $container.find('.fp-section'),
							currentSection = $container.find('.fp-section.active');

						if( sections.length ) {
							_self.$currentSlide.text(_self._prepareNumber( currentSection.index() + 1) );
							_self.$amount.text( _self._prepareNumber( sections.length) );
						}
						_self.$element.append(_self.$currentSlide).append(_self.$amount);
					});

					$d.on('leave.apolo.fullpage', function(event, data){
						_self.$currentSlide.text( _self._prepareNumber( data.nextIndex) );
					});
				},
				_prepareNumber: function( number ) {
					return (('' + number).length == 1) ? '0' + number : number;
				}
			},
			fancybox: function() {
				$.fancybox.defaults.infobar = false;
				$.fancybox.defaults.afterClose = function() {
					if($.fn.fullpage) $.fn.fullpage.reBuild();
				};
			},
			photoStream: {
				init: function() {
					this.photoInfoBtn = $('.apo-photo-info-invoker');
					if(!this.photoInfoBtn.length) return;

					var _self = this,
						timeOutId;

					$(document).on('leave.apolo.fullpage', function(event, eventData){
						if(!eventData.$element || !eventData.$element) return;
						if(timeOutId) clearTimeout(timeOutId);
						timeOutId = setTimeout(function(){
							var $currentSlide = eventData.$element.siblings('.active'),
								$img = $currentSlide.find('.apo-photo-stream-hidden-img');

							if( !$img.length ) return;

							_self.photoInfoBtn.data({
								photoTitle: $img.data('photo-title'),
								photoMeta: $img.data('photo-meta'),
								photoInfo: $img.data('photo-info'),
							});
							
						}, 10)
					});
				}
			},
			touchHover: {
				_selector: null,
				_config: {
					prefix: 'apo-',
					activeClass: 'touch-state-hover'
				},
				init: function(selector, options) {
					if( !selector ) return;
					if(!this.body) this.$body = $('body');
					options = $.isPlainObject(options) ? $.extend(true, {}, this._config, options) : this._config;
					this.bindSelector(selector).bindEvent(options);
				},
				bindSelector: function(selector) {
					if( !selector ) return this;
					if( this._selector ) {
						this._selector += ',' + selector;
						this._selector = this._selector.replace(new RegExp(' ' , 'g'), '');
					}
					else {
						this._selector = selector;	
					}
					return this;
				},
				bindEvent: function(options) {
					var _self = this;
					if(!options) options = this._config;

					this.$body
						.off('.touchHover')
						.on('mouseenter.touchHover', this._selector, function(e){
							$(this).addClass(options.prefix + options.activeClass);
						}).on('mouseleave.touchHover', this._selector, function(e){
							$(this).removeClass(options.prefix + options.activeClass);
						});
				}
			}
		},
		extendjQuery: {
			apoImagesLoaded : function () {

			    var $imgs = this.find('img[src!=""]');

			    if (!$imgs.length) {return $.Deferred().resolve().promise();}

			    var dfds = [];

			    $imgs.each(function(){
			        var dfd = $.Deferred();
			        dfds.push(dfd);
			        var img = new Image();
			        img.onload = function(){dfd.resolve();};
			        img.onerror = function(){dfd.resolve();};
			        img.src = this.src;
			    });

			    return $.when.apply($,dfds);

			}
		}
	};

	$.Apolo.DOMReady = function(){
		$.Apolo.helpers.dynamicBgImage();
		$.Apolo.helpers.hamburgers();
		// back to top button init
		$.Apolo.modules.backToTop.init( $('.apo-back-to-top-button') , {
			easing: 'easeOutQuint',
			duration: 700
		});

		$.Apolo.modules.fullScreen(
			$('.apo-fullscreen-control'),
			$('.apo-fullscreen-control-close'),
			'.rev_slider_wrapper.fullscreen-container'
		);

		$.Apolo.modules.hiddenSideColumn.init({
			position: 'left',
			invokerSelector: '.apo-hidden-column-invoker',
			closingSelector: '.apo-hidden-column-closing'
		});

		$.Apolo.helpers.fullPageSlideNumbers.init( $('.apo-fp-slide-numbers') );
		$.Apolo.modules.arcticModals.init( $('[data-arctic-modal]'), {
			clickableElements: '.apo-oneline-form, .apo-fullscreen-nav-pages, .apo-modal-photo-info-title, .apo-photo-stream-category, .apo-extended-info-list-item'
		} );
		$.Apolo.helpers.fancybox();
		$.Apolo.helpers.photoStream.init();
		$.Apolo.helpers.movedLabel('.apo-moved-label');

		// sticky section init
		if($('.apo-sticky').length) $.Apolo.modules.stickySection.init();

		if( $.Apolo.isTouch ) {
			$.Apolo.helpers.touchHover.init('.apo-portfolio-container .apo-project', {
				prefix: 'apo-'
			});

			$('.apo-portfolio-container').on('click', function(e){
				$(this).css({
					'border-style': 'solid',
					'border-color': 'transparent',
					'border-width': '0 1px 0 0'
				});
			});
		}
	};

	$.Apolo.outerResourcesReady = function(){
		$.fn.extend( $.Apolo.extendjQuery );
		$.Apolo.modules.pageLoader(1500);
		$.Apolo.modules.sameHeight( $('.apo-same-height-container') );
		$.Apolo.modules.sameHeight( $('.apo-striped-photos:not(.owl-carousel)'), {
			targetSelector: '.apo-striped-photo'
		} );
		$.Apolo.helpers.owlSingleHower( $('.apo-striped-photos.owl-carousel') );
		$.Apolo.helpers.fullHeight.init( $('.apo-striped-photos.apo-full-height .apo-striped-photo') );
		if( $.Apolo.modules.isotope ) {
			$.Apolo.modules.isotope( $('.apo-isotope'), {
				itemSelector: '.apo-item'
			});
			$('.apo-isotope').on('apolo.isotopeReady', function(){
				$.Apolo.modules.isotopeEffect.init( $('.apo-isotope.apo-portfolio-container.apo-style-2, .apo-isotope.apo-portfolio-container.apo-style-3, .apo-isotope.apo-entries-container.apo-style-1'), null, {
					itemTarget: '.apo-project, .apo-entry',
					itemBaseElement: '.apo-project-media, .apo-entry-media'
				});
				$.Apolo.modules.isotopeEffect.init( $('.apo-isotope.apo-entries-container.apo-style-2, .apo-section:not(.apo-has-sidebar) .apo-isotope.apo-entries-container.apo-style-3'), null, {
					itemTarget: '.apo-entry',
					itemBaseElement: '.apo-entry-inner'
				});
			});
		}

		$(window).on('resized.apolo.sameheight', function() {
			var $isotope = $('.apo-isotope');

			if($isotope.length) {
				$isotope.each(function(index, isotope){
					$(isotope).data('IsotopeWrapper').relayout();
				});
			}
		});

		if( $.Apolo.modules.fullpage ){
			$.Apolo.modules.fullpage( $('.apo-full-page-container') );
		}
		$.Apolo.helpers.fixedContent.init( $('#apo-fixed-content-fixed-col'), $('#footer') );
		if( $.Apolo.modules.parallaxGrid ) {
			$('.apo-parallax-grid').on('apolo.parallaxGridReady', function(){
				$.Apolo.helpers.portfolioTriangles.init();
				$.Apolo.modules.isotopeEffect.init( $('.apo-parallax-grid.apo-portfolio-container.apo-style-2, .apo-parallax-grid.apo-portfolio-container.apo-style-3, .apo-parallax-grid.apo-portfolio-container.apo-style-4, .apo-parallax-grid.apo-entries-container.apo-style-1'), $('.apo-parallax-grid').data('items'), {
					itemTarget: '.apo-project, .apo-entry',
					itemBaseElement: '.apo-project-media, .apo-entry-media'
				});
			});
			$.Apolo.modules.parallaxGrid( $('.apo-parallax-grid'), {
				breakpointElement: $('#footer')
			} );
		}
	};

	$(function(){
		$.Apolo.DOMReady();
	});

	$(window).on('load', function(e){
		$.Apolo.outerResourcesReady();
	});

})(window.jQuery);