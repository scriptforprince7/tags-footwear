jQuery(document).ready(function($) {

    'use strict';

    // AJax single add to cart
    $(document).on('click', 'a.zank_ajax_add_to_cart', function(e){
        e.preventDefault();

        var btn    = $(this),
            pid    = btn.attr( 'data-product_id' ),
            qty    = parseFloat( btn.data('quantity') ),
            data   = new FormData();

        data.append('add-to-cart', pid);

        if ( qty > 0 ) {
            data.append('quantity', qty);
        }

        btn.addClass('loading');
        btn.closest('.zank-product-loop-inner').addClass('loading');

        $.ajax({
            url        : zank_vars.wc_ajax_url.toString().replace( '%%endpoint%%', 'zank_ajax_add_to_cart' ),
            data       : data,
            type       : 'POST',
            processData: false,
            contentType: false,
            dataType   : 'json',
            success    : function( response ) {

                btn.removeClass('loading').addClass('added');
                btn.closest('.zank-product-loop-inner').removeClass('loading');

                var fragments = response.fragments;
                var appended  = '<div class="woocommerce-notices-wrapper">'+fragments.notices+'</div>';

                $(appended).prependTo('.zank-shop-popup-notices').delay(4000).fadeOut(300, function(){
                    $(this).remove();
                });

                // update other areas
                $('.minicart-panel').replaceWith(fragments.minicart);
                $('.zank-cart-count').html(fragments.count);
                $('.zank-side-panel').attr('data-cart-count',fragments.count);
                $('.zank-cart-total').html(fragments.total);
                $('.zank-cart-goal-text').html(fragments.shipping.message);
                $('.zank-progress-bar').css('width',fragments.shipping.value+'%');
                if ( fragments.shipping.value >= 100 ) {
                    $('.zank-cart-goal-wrapper').addClass('free-shipping-success shakeY');
                }

                // Redirect to cart option
                if ( zank_vars.cart_redirect === 'yes' ) {
                    window.location = zank_vars.cart_url;
                    return;
                }

                if ( zank_vars.minicart_open === 'yes' ) {
                    $('html,body').addClass('zank-overlay-open');
                    $('.zank-side-panel,.panel-content .cart-area').addClass('active');
                }
            },
            error: function() {
                $( document.body ).trigger( 'wc_fragments_ajax_error' );
            }
        });
    });

    $(document).on('click', '.zank_remove_from_cart_button', function(e){
        e.preventDefault();

        var $this = $(this),
            pid   = $this.data('product_id'),
            note  = zank_vars.removed,
            cart  = $this.closest('.zank-minicart'),
            row   = $this.closest('.zank-cart-item'),
            key   = $this.data( 'cart_item_key' ),
            name  = $this.data('name'),
            qty   = $this.data('qty'),
            msg   = qty ? qty+' &times '+name+' '+note : name+' '+note,
            btn   = $('.zank_ajax_add_to_cart[data-product_id="'+pid+'"]');

            msg   = '<div class="woocommerce-notices-wrapper"><div class="woocommerce-message">'+msg+'</div></div>';

        $(msg).appendTo('.zank-shop-popup-notices').delay(3000).fadeOut(300, function(){
            $(this).remove();
        });

        cart.addClass('loading');

        row.remove();

        var cartItems = cart.find('.mini-cart-item').length;

        if ( cartItems == 0 ) {
            cart.addClass('no-products');
        }

        $.ajax({
            url      : zank_vars.wc_ajax_url.toString().replace( '%%endpoint%%', 'zank_remove_from_cart' ),
            type     : 'POST',
            dataType : 'json',
            data     : {
                cart_item_key : key
            },
            success  : function( response ){
                var fragments = response.fragments;

                $('.minicart-panel').replaceWith(fragments.minicart);
                $('.zank-cart-count').html(fragments.count);
                $('.zank-side-panel').attr('data-cart-count',fragments.count);
                $('.zank-cart-total').html(fragments.total);
                $('.zank-cart-goal-text').html(fragments.shipping.message);
                $('.zank-progress-bar').css('width',fragments.shipping.value+'%');
                cart.removeClass('loading no-products');

                if ( fragments.shipping.value <= 100 ) {
                    $('.zank-cart-goal-wrapper').removeClass('free-shipping-success shakeY');
                }

                $( document.body ).trigger( 'removed_from_cart', [ fragments, response.cart_hash, btn ] );

                if ( zank_vars.is_cart == 'yes' && fragments.count == 0 ) {
                    location.reload(); // page reload
                }
				
				if ( zank_vars.is_checkout == 'yes' && fragments.count == 0 ){
					console.log('hello');
					location.reload(); // page reload
				}
            },
            error: function() {
                $( document.body ).trigger( 'wc_fragments_ajax_error' );
            }
        });
    });

	var timeout;
    // AJax cart cuantity
    $(document).on('change input', '.woocommerce-mini-cart-item .quantity .qty', function() {

        var input  = $(this),
            pid    = input.parent().data( 'product_id' ),
            qty    = input.val(),
            key    = input.parents('.woocommerce-mini-cart-item').data('key'),
            name   = input.parents('.woocommerce-mini-cart-item').find( '.cart-name' ).html();

        //btn.closest('.zank-minicart').addClass('loading');
        clearTimeout(timeout);

        timeout = setTimeout(function() {
			$.ajax({
				url      : zank_vars.ajax_url,
				data     : {
					action : 'zank_ajax_update_cart',
					//key     : key,
					qty     : qty,
					id      : key,
					is_cart : zank_vars.is_cart
				},
				type     : 'GET',
				dataType : 'json',
				success  : function( response ) {
					console.log(response);
					//btn.removeClass('loading').addClass('added');
					//btn.closest('.zank-minicart').removeClass('loading');

					var fragments = response.fragments;

					if ( fragments.count != 0 ) {
						if ( qty == 0 ) {
							var appended  = '<div class="woocommerce-notices-wrapper"><div class="woocommerce-message"><span class="update">'+zank_vars.updated+'</span> <strong>"'+name+'"</strong> '+zank_vars.removed+'</div></div>';
						} else {
							var appended  = '<div class="woocommerce-notices-wrapper"><div class="woocommerce-message"><span class="update">'+zank_vars.updated+'</span>'+qty+'&times <strong>"'+name+'"</strong> '+zank_vars.added+'</div></div>';
						}
					}

					if ( fragments.count == 0 ) {
						var appended  = '<div class="woocommerce-notices-wrapper"><div class="woocommerce-message">'+fragments.update.msg+'</div></div>';
					}

					$(appended).prependTo('.zank-shop-popup-notices').delay(4000).fadeOut(300, function(){
						$(this).remove();
					});

					// update other areas
					$('.minicart-panel').replaceWith(fragments.minicart);
					$('.zank-cart-count').html(fragments.count);
					$('.zank-side-panel').attr('data-cart-count',fragments.count);
					$('.zank-cart-total').html(fragments.total);
					$('.zank-cart-goal-text').html(fragments.shipping.message);
					$('.zank-progress-bar').css('width',fragments.shipping.value+'%');

					if ( fragments.shipping.value >= 100 ) {
						$('.zank-cart-goal-wrapper').addClass('free-shipping-success shakeY');
					} else {
						$('.zank-cart-goal-wrapper').removeClass('free-shipping-success shakeY');
					}

					if ( zank_vars.is_cart == 'yes' ) {
						$('.zank-cart-row').replaceWith(fragments.update.cart);
					}
					$('body').trigger( 'wc_fragments_refreshed' );
				},
				error: function() {
					$( document.body ).trigger( 'wc_fragments_ajax_error' );
				}
			});
		}, 500);
    });
	
    $(document).on('change input', '.cart-quantity-wrapper .qty', function(e){
        var $this = $(this),
            qty   = $this.val();

        $this.parent().next().attr( 'data-qty', qty );
    });

    $(document).on('click', '.product-remove .remove', function(e){
        var $this = $(this),
            pid   = $this.data('product_id');

        $( '.zank-minicart .zank_remove_from_cart_button[data-product_id="'+pid+'"]' ).trigger( 'click' );
    });

    $(document).on('updated_wc_div', function() {
        if ( zank_vars.is_cart == 'yes' ) {
            $.ajax({
                url: wc_add_to_cart_params.wc_ajax_url.toString().replace( '%%endpoint%%', 'zank_ajax_add_to_cart' ),
                type: 'POST',
                data: {
                    action: 'zank_ajax_add_to_cart'
                },
                success: function(response) {

                    var fragments = response.fragments;

                    $('.minicart-panel').replaceWith(fragments.minicart);
                    $('.zank-cart-count').html(fragments.count);
                    $('.zank-side-panel').attr('data-cart-count',fragments.count);
                    $('.zank-cart-total').html(fragments.total);
                    $('.zank-cart-goal-text').html(fragments.shipping.message);
                    $('.zank-progress-bar').css('width',fragments.shipping.value+'%');
                }
            });
        }
    });

    $(document).on('click', '.zank_clear_cart_button', function(e){
        var confirmMsg = zank_vars.clear;
        if ( confirm( confirmMsg ) ){
            $.ajax({
                type     : 'POST',
                dataType : 'json',
                url      : wc_add_to_cart_params.wc_ajax_url.toString().replace( '%%endpoint%%', 'zank_clear_cart' ),
                data     : {
                    action : 'zank_clear_cart'
                },
                success  : function ( response ) {

                    var fragments = response.fragments;
                    var message   = fragments.clear.msg;

                    if ( fragments.clear.status != 'success' ) {
                        alert(message);
                    } else {

                        var appended = '<div class="woocommerce-notices-wrapper"><div class="woocommerce-message">'+message+'</div></div>';
                        $(appended).appendTo('.zank-shop-popup-notices').delay(3000).fadeOut(300, function(){
                            $(this).remove();
                        });

                        // update other areas
                        $('.minicart-panel').replaceWith(fragments.minicart);
                        $('.zank-cart-count').html(fragments.count);
                        $('.zank-side-panel').attr('data-cart-count',fragments.count);
                        $('.zank-cart-total').html(fragments.total);
                        $('.zank-cart-goal-text').html(fragments.shipping.message);
                        $('.zank-progress-bar').css('width',fragments.shipping.value+'%');

                        location.reload(); // page reload

                        $(document.body).trigger('zank_reset_all_cart_btn');
                    }
                }
            });
        }
    });

});
