jQuery(document).ready(function($) {

    /*-- Strict mode enabled --*/
    'use strict';

    // quick shop start
    zankQuickShopPopup();

    $(document).on('zankShopInit', function() {
        zankQuickShopPopup();
    });
    
    $(document.body).on('trigger_quick_shop', function(e,btn) {
        $(btn).trigger('click');
    });

    function zankQuickShopPopup(){

       $( document.body ).on('click', '.zank-quick-shop-btn', function(event) {
            event.preventDefault();

            var $this = $(this),
                id    = $this.data('product_id');

            $.magnificPopup.open({
                items           : {
                    src : zank_vars.ajax_url + '?product_id=' + id
                },
                mainClass       : 'mfp-zank-quickshop zank-mfp-slide-bottom',
                removalDelay    : 160,
                overflowY       : 'scroll',
                fixedContentPos : true,
                closeBtnInside  : true,
                tClose          : '',
                closeMarkup     : '<div class="mfp-close zank-panel-close-button"></div>',
                tLoading        : '<span class="loading-wrapper"><span class="ajax-loading"></span></span>',
                type            : 'ajax',
                ajax            : {
                    settings : {
                        type : 'GET',
                        data : {
                            action : 'zank_ajax_quick_shop'
                        }
                    }
                },
                callbacks       : {
                    beforeOpen  : function() {},
                    open        : function() {
                        $('.mfp-preloader').addClass('loading');
						$('html,body').addClass('popup-open');
                    },
                    ajaxContentAdded: function() {
                        $('.mfp-preloader').removeClass('loading');

                        var variations_form = $('.zank-quickshop-form-wrapper').find('form.cart');
                        var termsWrapper    = $('.zank-quickshop-form-wrapper').find('.zank-selected-variations-terms-wrapper');

                        variations_form.wc_variation_form();

                        $(variations_form).on('show_variation', function( event, data ){
                            $('.zank-quickshop-form-wrapper').find('.zank-btn-reset-wrapper,.single_variation_wrap').addClass('active');
                        });
                        $(variations_form).on('hide_variation', function(){
                            $('.zank-quickshop-form-wrapper').find('.zank-btn-reset-wrapper,.single_variation_wrap').removeClass('active');
                        });

                        if ( $('.grouped_form').length>0 || $(variations_form).length>0 ) {
                            $(document.body).trigger('zank_on_qtybtn');
                        }

                        if ( $('.zank-selected-variations-terms-wrapper').length > 0 ) {
                            $(variations_form).on('change', function() {
                                var $this = $(this);
                                var selectedterms = '';
                                $this.find('.zank-variations-items select').each(function(){
                                    var title = $(this).parents('.zank-variations-items').find('.zank-small-title').text();
                                    var val   = $(this).val();
                                    if (val) {
                                        selectedterms += '<span class="selected-features"><span class="selected-label">'+title+': </span><span class="selected-value">'+val+'</span></span>';
                                    }
                                });
                                if (selectedterms){
                                    termsWrapper.slideDown().find('.zank-selected-variations-terms').html(selectedterms);
                                }
                            });
                        }

                        $('.zank-quickshop-form-wrapper form.cart').submit(function(e) {

                            if ( $(e.originalEvent.submitter).hasClass('zank-btn-buynow') ) {
                                return;
                            }

                            e.preventDefault();

                            var form = $(this),
                                btn  = form.find('.zank-btn.single_add_to_cart_button'),
                                data = new FormData(form[0]),
                                val  = form.find('[name=add-to-cart]').val();

                            data.append('add-to-cart',val);

                            btn.addClass('loading');

                            $.ajax({
                                url         : wc_add_to_cart_params.wc_ajax_url.toString().replace( '%%endpoint%%', 'zank_ajax_add_to_cart' ),
                                data        : data,
                                type        : 'POST',
                                processData : false,
                                contentType : false,
                                dataType    : 'json',
                                success     : function( response ) {

                                    btn.removeClass('loading');

                                    if ( ! response ) {
                                        return;
                                    }

                                    var fragments = response.fragments;

                                    $('.zank-quickshop-notices').html(fragments.notices).slideDown();

                                    // update other areas
                                    $('.minicart-panel').replaceWith(fragments.minicart);
                                    $('.zank-cart-count').html(fragments.count);
                                    $('.zank-cart-total').html(fragments.total);
                                    $('.zank-cart-goal-text').html(fragments.shipping.message);
                                    $('.zank-progress-bar').css('width',fragments.shipping.value+'%');

                                    if ( response.error && response.product_url ) {
                                        window.location = response.product_url;
                                        return;
                                    }

                                    $('.zank-quickshop-notices .close-error').on('click touch', function(e) {
                                        $('.zank-quickshop-notices').slideUp();
                                    });

                                    $('.zank-quickshop-wrapper .zank-btn-reset,.zank-quickshop-wrapper .plus,.zank-quickshop-wrapper .minus').on('click touch', function(event) {
                                        $('.zank-quickshop-notices').slideUp();
                                    });

                                    $('.zank-quickshop-buttons-wrapper').slideDown().addClass('active');

                                    $('.zank-quickshop-buttons-wrapper .zank-btn').on('click touch', function(e) {
                                        if ( $(this).hasClass('open-cart-panel') ) {
                                            $('html,body').addClass('zank-overlay-open');
                                            $('.zank-side-panel .active').removeClass('active');
                                            $('.zank-side-panel').addClass('active');
                                            $('.cart-area').addClass('active');
                                        }
                                        $.magnificPopup.close();
                                    });
                                }
                            });

                        });

                        $('body').on('click', '.zank-btn-buynow', function() {
                            if ($(this).parents('form.cart').length) {
                                return;
                            }
                            $('form.cart').find('.zank-btn-buynow').trigger('click');
                        });
                    },
                    beforeClose : function() {},
                    close : function() {},
                    afterClose : function() {
						$('html,body').removeClass('popup-open');
					}
                }
            });
        });
    }
    // quick shop end
});
