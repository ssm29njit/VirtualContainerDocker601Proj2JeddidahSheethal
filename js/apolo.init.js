/*
|--------------------------------------------------------------------------
| apolo.init.js
|--------------------------------------------------------------------------
| Initialization of all vendors and modules.
*/
;(function($){
	'use strict';

	$(function(){

		/* ------------------------------------------------
				Main Navigation
		------------------------------------------------ */

			var $nav = $('.apo-navigation').not('.apo-hidden-column .apo-navigation'),
				$verticalNav = $('.apo-hidden-column .apo-navigation');

			if($nav.length){
				$nav.wtNav({
					cssPrefix: 'apo-'
				});
			}

			if( $verticalNav.length ) {
				$verticalNav.wtNav({
					cssPrefix: 'apo-',
					mobileBreakpoint: 10000
				})
			}
			
		/* ------------------------------------------------
				End of Main Navigation
		------------------------------------------------ */

		/* ------------------------------------------------
			Newsletter Form
		------------------------------------------------ */

			var newsletterForm = $('.apo-newsletter-form');

			if(newsletterForm.length) {
				$.Apolo.modules.newsletter(newsletterForm);
			}

		/* ------------------------------------------------
			End of Newsletter Form
		------------------------------------------------ */

		/* ------------------------------------------------
			Contact Form
		------------------------------------------------ */

			var contactForm = $('.apo-contact-form');

			if(contactForm.length) {
				$.Apolo.modules.contactForm(contactForm);
			}

		/* ------------------------------------------------
			End of Contact Form
		------------------------------------------------ */

		/* ------------------------------------------------
			Accordion
		------------------------------------------------ */

			var accordions = $('.apo-accordion');

			if(accordions.length){
				accordions.MadAccordion({
					easing: 'easeOutQuint',
					speed: 600,
					cssPrefix: 'apo-'
				});
			}

		/* ------------------------------------------------
			End of Accordion
		------------------------------------------------ */

		/* ------------------------------------------------
			Toggle
		------------------------------------------------ */

			var toggles = $('.apo-toggle');

			if(toggles.length){
				toggles.MadAccordion({
					hideFirst: true,
					toggle: true,
					easing: 'easeOutQuint',
					speed: 600,
					cssPrefix: 'apo-'
				});
			}

		/* ------------------------------------------------
			End of Toggle
		------------------------------------------------ */

		/* ------------------------------------------------
			Custom Select
		------------------------------------------------ */

			var $selects = $('.apo-custom-select');

			if($selects.length){
				$selects.MadCustomSelect({
					cssPrefix: 'apo-'
				});
			}

		/* ------------------------------------------------
			End of Custom Select
		------------------------------------------------ */

	});

	$(window).on('load', function(){

		/* ------------------------------------------------
			Revolution Slider
		------------------------------------------------ */

			var mainRev,
				secondaryRev,
				thumbs = $('.apo-slider-thumbs'),
				swiperInstance,
				$w = $(window),
				swiperResizeTimeoutId,
				swiperOptions,
				revControls = $('.apo-revslider-controls');
 	
 			if( $.fn.revolution ) {
				mainRev = jQuery('#rev-slider-1').show().revolution({
					delay: 9000,
		            sliderLayout: 'fullscreen',
		            disableProgressBar: "on",
		            responsiveLevels: [4096,1024,778,480],
		            navigation : {
						onHoverStop: "off",
						keyboardNavigation: 'on',
						touch:{
							touchenabled:"on",
							touchOnDesktop:"on"
						},
					}
			    });
			    secondaryRev = jQuery('#rev-slider-2').show().revolution({
					delay: 9000,
		            sliderLayout: 'fullscreen',
		            disableProgressBar: "on",
		            responsiveLevels: [4096,1281,778,480],
		            gridwidth: [1400, 900, 778, 480],
					gridheight: [900, 600, 500, 400],
		            navigation : {
						onHoverStop: "off",
						keyboardNavigation: 'on',
						touch:{
							touchenabled:"on",
							touchOnDesktop:"on"
						},
						arrows: {
							enable: false,
							tmp: '',
							style: '',
							rtl: $.Apolo.RTL,
							hide_onleave: false,
							hide_onmobile: true,
							hide_under: 0,
							hide_over: 9999,
							hide_delay: 200,
							hide_delay_mobile: 1200,
							left: {
								container: 'slider',
								h_align: 'left',
								v_align: 'bottom',
								h_offset: 200,
								v_offset: 100
							},
							right: {
								container: 'slider',
								h_align: 'left',
								v_align: 'bottom',
								h_offset: 250,
								v_offset: 100
							}
						}
					}
			    });
			    if(revControls.length) {
			    	revControls.on('click.ApoloRevSlider', '.apo-revslider-theme-nav-prev', function(e){
			    		if(secondaryRev) secondaryRev.revprev();
			    		if(mainRev) mainRev.revprev();
			    		e.preventDefault();
			    	})
			    	.on('click.ApoloRevSlider', '.apo-revslider-theme-nav-next', function(e){
			    		if(secondaryRev) secondaryRev.revnext();
			    		if(mainRev) mainRev.revnext();
			    		e.preventDefault();
			    	})
			    	.on('click.ApoloRevSlider', '.apo-revslider-control-pause', function(e){
			    		if(secondaryRev) secondaryRev.revpause();
			    		if(mainRev) mainRev.revpause();
			    		$(this).closest('.apo-revslider-controls-item').removeClass('apo-playing');
			    		e.preventDefault();	
			    	})
			    	.on('click.ApoloRevSlider', '.apo-revslider-control-play', function(e){
			    		if(secondaryRev) secondaryRev.revresume();
			    		if(mainRev) mainRev.revresume();
			    		$(this).closest('.apo-revslider-controls-item').addClass('apo-playing');
			    		e.preventDefault();	
			    	})
			    }
		   	}

		    if( thumbs.length ) {

		    	swiperOptions = {
					slidesPerView: 5,
			        spaceBetween: 10,
			        nextButton: '.swiper-button-next',
			        prevButton: '.swiper-button-prev'
				};

		    	$.Apolo.helpers.revThumbs.init( thumbs , {
			    	revAPI: mainRev,
			    	target: '.apo-slider-thumb'
			    });

			    if( thumbs.hasClass('apo-slider-thumbs-vr') ) {
			    	
			    	swiperInstance = new Swiper( thumbs.get(0), $.extend(true, {}, swiperOptions, {
			    		slidesPerView: $w.width() < 768 ? 3 : 5,
			    		direction: $w.width() < 768 ? 'horizontal' : 'vertical',
				        onInit: function() {
				        	if( $w.width() < 768 ) {
				        		thumbs.data('swiperDirection', 'horizontal');
				        	}
				        	else {
				        		thumbs.data('swiperDirection', 'vertical');
				        	}
				        }
			    	}));
			    	

				    $w.on('resize.ApoloSwiperUpdates', function(e){

				    	if(swiperResizeTimeoutId) clearTimeout(swiperResizeTimeoutId);

				    	swiperResizeTimeoutId = setTimeout(function(){
				    		if( $w.width() < 768 && thumbs.data('swiperDirection') === 'vertical' ) {
				    			swiperInstance.destroy(true, true);
				    			swiperInstance = new Swiper( thumbs.get(0), $.extend(true, {}, swiperOptions, {
				    				slidesPerView: 3,
				    				direction: 'horizontal',
				    				onInit: function() {
				    					$.Apolo.helpers.dynamicBgImage();
				    				}
				    			}) );
				    			thumbs.data('swiperDirection', 'horizontal');
				    		}
				    		else if( $w.width() >= 768 && thumbs.data('swiperDirection') === 'horizontal' ) {
				    			swiperInstance.destroy(true, true);
				    			swiperInstance = new Swiper( thumbs.get(0), $.extend(true, {}, swiperOptions, {
				    				slidesPerView: 5,
				    				direction: 'vertical',
				    				onInit: function() {
				    					if( $.Apolo.helpers.dynamicBgImage ) {
				    						$.Apolo.helpers.dynamicBgImage();
				    					}
				    				}
				    			}) );
				    			thumbs.data('swiperDirection', 'vertical');
				    		}
				    	}, 50);

				    });
			    }
			    else {
			    	swiperInstance = new Swiper( thumbs.get(0), $.extend(true, {}, swiperOptions, {
			    		slidesPerView: 7,
			    		breakpoints: {
							// when window width is <= 320px
							767: {
								slidesPerView: 2
							},
							// when window width is <= 992px
							992: {
								slidesPerView: 7
							},
							// when window width is <= 1200px
							1280: {
								slidesPerView: 5
							}
						},
			    		direction: 'horizontal',
			    		onInit: function() {
			    			if( $.Apolo.helpers.dynamicBgImage ) {
		    					$.Apolo.helpers.dynamicBgImage();
	    					}
	    				}
			    	} ) );
			    }

			}

		/* ------------------------------------------------
			Tabs
		------------------------------------------------ */

			var tabs = $('.apo-tabs');

			if(tabs.length){
				tabs.MadTabs({
					easing: 'easeOutQuint',
					speed: 600,
					cssPrefix: 'apo-'
				});
			}

		/* ------------------------------------------------
			End of Tabs
		------------------------------------------------ */

		/* ------------------------------------------------
			Counters
		------------------------------------------------ */

			var $counters = $('.apo-counter');

			if( $counters.length ) {
				$counters.WATCounters();
			}

		/* ------------------------------------------------
			End of Counters
		------------------------------------------------ */

		/* ------------------------------------------------
			Owl Carousel
		------------------------------------------------ */

			var stripedPhotosCarousel = $('.apo-striped-photos.owl-carousel');

			if(stripedPhotosCarousel.length) {

				$.Apolo.modules.OWLCarousel.init( $('.apo-striped-photos.owl-carousel'), {
					loop: true,
					nav: true,
					mouseDrag: false, // !important
					touchDrag: false,
					itemsGrow: true,
					navText: ['<span class="owl-nav-text">Prev</span> <i class="icon-arrow-left"></i>', '<span class="owl-nav-text">Next</span> <i class="icon-arrow-right"></i>'], 
					responsive: {
						0: {
							items: 1,
							itemsGrow: false // important custom option
						},
						600: {
							items: 2
						},
						768: {
							items: 2
						},
						991: {
							items: 3,
							itemsGrow: true // important custom option
						},
						1280: {
							items: 5
						}
					},
					onInitialized: function() {
						setTimeout(function(){
							stripedPhotosCarousel.trigger('refresh.owl.carousel');
							$.Apolo.helpers.stripedPhotosCarouselHover.updateItemsInfo();
						}, 100);
					}
				} );
			}

			$.Apolo.helpers.stripedPhotosCarouselHover.init( $('.apo-striped-photos.owl-carousel'), {
				duration: 500,
				easing: 'easeOutCubic',
				coefficient: 2
			} );

			$.Apolo.modules.OWLCarousel.init( $('.apo-testimonials.owl-carousel'), {
				nav: false,
				dots: true,
				autoplay: true,
				items: 1,
				animateIn: false,
				animateOut: false,
			} );

			$.Apolo.helpers.OWLImageThumbs( $('.apo-testimonials.owl-carousel.apo-style-3'), '.apo-testimonial-author-image > img' );

		/* ------------------------------------------------
			End Owl Carousel
		------------------------------------------------ */

		/* ------------------------------------------------
			Parallax
		------------------------------------------------ */

			setTimeout(function(){

				var $parallaxSections = $('.apo-section-parallax'),
					refreshParallaxTimeOutId;
				if($parallaxSections.length) {
					$parallaxSections.parallax();

					$(window).on('resize.ApoParallaxRefresh', function(e){
						if(refreshParallaxTimeOutId) clearTimeout(refreshParallaxTimeOutId);
						refreshParallaxTimeOutId = setTimeout(function(){
							$(window).trigger('resize').trigger('scroll');
						}, 100);
					});
				}

			}, 1000);

		/* ------------------------------------------------
			End of Parallax
		------------------------------------------------ */

		/* ------------------------------------------------
				Custom Scrollbar
		------------------------------------------------ */

			var $customScrollbar = $('.apo-hidden-column .apo-hidden-column-content .apo-navigation-container');
			if($customScrollbar.length) {
				$customScrollbar.mCustomScrollbar({
					scrollInertia: 120,
					contentTouchScroll: true,
					documentTouchScroll: true
				});
			}

		/* ------------------------------------------------
				End of Custom Scrollbar
		------------------------------------------------ */

	});

})(jQuery);