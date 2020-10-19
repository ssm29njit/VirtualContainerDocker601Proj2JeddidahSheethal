/*
|--------------------------------------------------------------------------
| apolo.contact-form.js
|--------------------------------------------------------------------------
| Defines contact form module.
*/
;(function($){
	'use strict';

	if(!('Apolo' in $)) {
		throw new Error('apolo.core.js file must be included.');
	};

	var _config = {
		url: 'php/contact.php',
		onSuccess: function(data){},
		onError: function(data){}
	};

	$.Apolo.modules.contactForm = function( collection, config ) {
		if(!collection || !collection.length) return false;
		config = config && $.isPlainObject(config) ? $.extend(true, {}, _config, config) : _config;

		return collection.each(function(i, el){
			var $this = $(el);
			if($this.data('ContactForm')) return;
			$this.data('ContactForm', new ContactForm($this, config));
		});
	};

	function ContactForm(form, config) {
		var self = this;

		this.form = form;
		this.config = config;

		this.initValidator();
		form.data('config', config);
	};

	ContactForm.prototype.initValidator = function(){

		var self = this,
			form = this.form.get(0);

		if(!(form instanceof HTMLFormElement) || !window.Validator) return;

		this.form.data('validator', new Validator({
			form: form,
			cssPrefix: 'apo-',
			incorrectClass: 'invalid',
			correctClass: 'valid',
			rules: [
				{
					element: form.elements.cf_name,
					name: 'Name',
					rules: {
						empty: null
					}
				},
				{
					element: form.elements.cf_message,
					name: 'Message',
					rules: {
						empty: null,
						min: 10
					}
				},
				{
					element: form.elements.cf_email,
					name: 'Email',
					rules: {
						empty: null,
						pattern: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
					}
				}
			],
			onIncorrect: function(errorsList){
				var previousMessage = $(form).siblings('.apo-alert-box-error');

				$.Apolo.modules.alertMessage({
					target: self.form,
					type: 'error',
					icon: 'warning',
					message: errorsList
				});
			},
			onCorrect: self.send
		}));

	};

	ContactForm.prototype.send = function() {
		var $form = $(this),
			config = $form.data('config');

		$.ajax({
			url: config.url,
			type: 'POST',
			dataType: 'json',
			data: $form.serialize(),
			success: function(data){
				if(data.status && data.status == 'fail') {
					$.Apolo.modules.alertMessage({
						target: $form,
						type: 'error',
						message: data.errors,
						icon: 'warning'
					});
					$form.trigger('apolo.contactFormMessage');
					config.onError.call($form, data);
				}
				else if(data.status && data.status == 'success') {
					$.Apolo.modules.alertMessage({
						target: $form,
						type: 'success',
						message: data.statusText,
						icon: 'check'
					});
					$form.find('input, textarea').val('');
					$form.trigger('apolo.contactFormMessage');
					config.onSuccess.call($form, data);
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				$.Apolo.modules.alertMessage({
					target: $form,
					type: 'error',
					message: errorThrown,
					icon: 'warning'
				});
				$form.trigger('apolo.contactFormMessage');
				config.onError.call($form, arguments);
			}
		});
	}


})(jQuery);