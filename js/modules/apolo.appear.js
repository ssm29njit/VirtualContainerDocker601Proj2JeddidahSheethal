/*
|--------------------------------------------------------------------------
| apolo.appear.js
|--------------------------------------------------------------------------
| Defines Appear module.
*/
;(function($){
	'use strict';

	if(!('Apolo' in $)) {
		throw new Error('apolo.core.js file must be included.');
	};

	if(!('appear' in window)) {
		throw new Error('appear.js plugin is required to correct work the appear module.');
	};

	var _config = {
		bounds: 200, 
		reappear: false,
		itemSelector: '.apo-appear',
		appearAnimationIn: 'fadeIn',
		appearAnimationOut: 'fadeOut',
		appearAnimationDuration: 1000,
		appearAnimationDelay: 0
	};

	/**
	 * Initialization of the module.
	 * @param {jQuery} collection
	 * @param {config} config
	 * @private
	 */
	$.Apolo.modules.appear = function( collection, config ) {
		if(!collection || !collection.length) return false;

		var _s = this;
		config = config && $.isPlainObject( config ) ? config : {};

		return collection.each( function( index, container ) {
			var $container = $(container),
				containerConfig = $.extend(true, {}, _config, config, $container.data() );

			if( $container.data( 'Appear' ) ) return;
			$container.data( 'Appear', new Appear( $container, containerConfig) );
		} );

	};

	/**
	 * Appear.
	 * @param {jQuery} container
	 * @param {Object} config
	 * @constructor
	 */
	function Appear(container, config) {
		this.container = container;
		this.config = config;
		this.HTMLCollection = container.get(0).querySelectorAll(config.itemSelector);

		this.init();
	};

	/**
	 * Initializes the instance.
	 * @public
	 */
	Appear.prototype.init = function() {
		var _self = this;

		this.appear = appear({
			bounds: _self.config.bounds,
			reappear: _self.config.reappear,
			elements: _self.HTMLCollection,
			init: function() {
				Array.prototype.forEach.call(_self.HTMLCollection, function( element ) {
					$(element).addClass( 'animated' ).css({
						'visibility':'hidden',
						'animation-delay': _self.config.appearAnimationDelay + 'ms',
						'animation-duration': _self.config.appearAnimationDuration + 'ms'
					});
				} );
			},
			appear: function( element ) {
				$(element).css('visibility', 'visible')
						  .removeClass(_self.config.appearAnimationOut)
						  .addClass(_self.config.appearAnimationIn);
			}
		});
	};

})(jQuery);