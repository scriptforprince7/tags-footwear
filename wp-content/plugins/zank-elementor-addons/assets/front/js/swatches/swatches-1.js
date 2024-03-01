'use strict';

window.zank = {};

(
function(zank, $) {
    zank = zank || {};

    $.extend(zank, {
        Swatches: {
            init: function() {
                var $term = $('.zank-term'),
                $active_term = $('.zank-term:not(.zank-disabled)');

                // load default value
                $term.each(function() {
                    var $this       = $(this),
                        term        = $this.attr('data-term'),
                        attr        = $this.closest('.zank-terms').attr('data-attribute'),
                        $select_box = $this.closest('.zank-terms').parent().find('select#' + attr),
                        val         = $select_box.val();

                    if ( val != '' && term == val ) {
                        $(this).addClass('zank-selected').find('input[type="radio"]').prop('checked', true);
                    }
                });

                $active_term.unbind('click touch').on('click touch', function(e) {
                    var $this       = $(this),
                        term        = $this.attr('data-term'),
                        title       = $this.attr('title'),
                        attr        = $this.closest('.zank-terms').attr('data-attribute'),
                        $select_box = $this.closest('.zank-terms').parent().find('select#' + attr);

                    if ( $this.hasClass('zank-disabled') ) {
                        return false;
                    }

                    if ( !$this.hasClass('zank-selected') ) {
                        $select_box.val(term).trigger('change');

                        $this.closest('.zank-terms').find('.zank-selected').removeClass('zank-selected').find('input[type="radio"]').prop('checked', false);

                        $this.addClass('zank-selected').find('input[type="radio"]').prop('checked', true);

                        $(document).trigger('zank_selected', [attr, term, title]);
                    }

                    e.preventDefault();
                });

                $(document).on('woocommerce_update_variation_values', function(e) {
                    $(e['target']).find('select').each(function() {
                        var $this = $(this);
                        var $terms = $this.parent().parent().find('.zank-terms');

                        $terms.find('.zank-term').removeClass('zank-enabled').addClass('zank-disabled');

                        $this.find('option.enabled').each(function() {
                            var val = $(this).val();

                            $terms.find('.zank-term[data-term="' + val + '"]').removeClass('zank-disabled').addClass('zank-enabled');
                        });
                    });
                });

                $(document).on('reset_data', function(e) {
                    $(document).trigger('zank_reset');
                    var $this = $(e['target']);

                    $this.find('.zank-selected').removeClass('zank-selected').find('input[type="radio"]').prop('checked', false);

                    $this.find('select').each(function() {
                        var attr = $(this).attr('id');
                        var title = $(this).find('option:selected').text();
                        var term = $(this).val();

                        if ( term != '' ) {
                            $(this).parent().parent().
                            find('.zank-term[data-term="' + term + '"]').
                            addClass('zank-selected').find('input[type="radio"]').
                            prop('checked', true);

                            $(document).trigger('zank_reset', [attr, term, title]);
                        }
                    });
                });
            }
        }
    });

}).apply(this, [window.zank, jQuery]);

(
function(zank, $) {

    $(document).on('wc_variation_form', function() {
        if ( typeof zank.Swatches !== 'undefined' ) {
            zank.Swatches.init();
        }
    });
    $(document.body).on('zank_variations_init', function() {
        if ( typeof zank.Swatches !== 'undefined' ) {
            zank.Swatches.init();
        }
        $('.zank-products-wrapper .variations_form').each(function () {
            $(this).wc_variation_form();
        });
    });

    $(document).on('found_variation', function(e, t) {
        if ( $(e['target']).closest('.zank-loop-swatches').length ) {
            var $product  = $(e['target']).closest('.zank-product-loop-inner'),
                $atc      = $product.find('.add_to_cart_button'),
                $image    = $product.find('.zank-product-thumb img'),
                $price    = $product.find('.price');

                console.log($price);
            if ( $atc.length ) {
                $atc.addClass('zank_add_to_cart').removeClass('zank-quick-shop-btn').attr('data-variation_id', t['variation_id']).attr('data-product_sku', t['sku']);

                if ( !t['is_purchasable'] || !t['is_in_stock'] ) {
                    $atc.addClass('disabled wc-variation-is-unavailable');
                } else {
                    $atc.removeClass('disabled wc-variation-is-unavailable');
                }

                $atc.removeClass('added error loading');
            }

            $product.find('a.added_to_cart').remove();

            // add to cart button text
            if ( $atc.length ) {
                $atc.text(zank_vars.strings.button.add_to_cart);
            }

            // product image
            if ( $image.length ) {

                if ( $image.attr('data-src') == undefined ) {
                    $image.attr('data-src', $image.attr('src'));
                }

                if ( t['image']['thumb_src'] != undefined && t['image']['thumb_src'] != '' ) {
                    $image.attr('src', t['image']['thumb_src']);
                } else {
                    if ( t['image']['src'] != undefined && t['image']['src'] != '' ) {
                        $image.attr('src', t['image']['src']);
                    }
                }
            }

            // product price
            if ( $price.length ) {
                if ( $price.attr('data-price') == undefined ) {
                    $price.attr('data-price', $price.html());
                }

                if ( t['price_html'] ) {
                    $price.html( t['price_html'] );
                }
            }

            $(document).trigger('zank_archive_found_variation', [t]);
        }
    });

    $(document).on('reset_data', function(e) {
        if ( $(e['target']).closest('.zank-loop-swatches').length ) {
            var $product  = $(e['target']).closest('.zank-product-loop-inner'),
                $atc      = $product.find('.add_to_cart_button'),
                $image    = $product.find('img'),
                $price    = $product.find('.price');

            if ( $atc.length ) {
                $atc.removeClass('zank_add_to_cart disabled wc-variation-is-unavailable').addClass('zank-quick-shop-btn').attr('data-variation_id', '0').attr('data-product_sku', '');
                    $product.removeClass('added error loading');
                }

                $product.find('a.added_to_cart').remove();

                // add to cart button text
                if ( $atc.length ) {
                    $atc.text(zank_vars.strings.button.select_options);
                }

                // product image
                if ( $image.length ) {
                    $image.attr('src', $image.attr('data-src'));
                    $image.attr('srcset', $image.attr('data-srcset'));
                    $image.attr('sizes', $image.attr('data-sizes'));
                }

                // product price
                if ( $price.length ) {
                    $price.html($price.attr('data-price'));
                }

                $(document).trigger('zank_archive_reset_data');
            }
        });

        $(document).on('click touch', '.zank_add_to_cart', function(e) {
            e.preventDefault();
            var $this = $(this);
            var $product = $this.closest('.zank-product-loop-inner');
            var attributes = {};

            $product.removeClass('added error').addClass('loading');

            if ($product.length) {
                $product.find('a.added_to_cart').remove();

                $product.find('[name^="attribute"]').each(function() {
                    attributes[$(this).attr('data-attribute_name')] = $(this).val();
                });

                var data = {
                    action       : 'zank_swatches_add_to_cart',
                    nonce        : zank_vars.security,
                    product_id   : $this.attr('data-product_id'),
                    variation_id : $this.attr('data-variation_id'),
                    quantity     : $this.attr('data-quantity'),
                    attributes   : JSON.stringify(attributes),
                };

                $.post(zank_vars.ajax_url, data, function(response) {
                    if (response) {
                        $product.removeClass('loading').addClass('added');
                        $(document.body).trigger('added_to_cart').trigger('wc_fragment_refresh');
                    } else {
                        $product.removeClass('loading').addClass('error');
                    }
                });
            }
        });

    }
).apply(this, [window.zank, jQuery]);
