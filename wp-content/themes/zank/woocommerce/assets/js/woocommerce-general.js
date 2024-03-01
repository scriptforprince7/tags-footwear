(function(window, document, $) {

"use strict";

jQuery(document).ready(function($) {

    /*-- Strict mode enabled --*/
    'use strict';

    var scrollOffset = $('.zank-header-default').height();

    if ( $('body').hasClass('admin-bar') ) {
        scrollOffset = scrollOffset + 32;
    }


    /**
    * scrollToTop
    */
    function scrollToTop(target,delay,timeout) {
        setTimeout(function(){
            $('html, body').stop().animate({
                scrollTop: target.offset().top - scrollOffset
            }, delay);
        }, timeout );
    }

	$('.woocommerce-message').hide();

    /***** shop sidebar *****/

    var scrollToTopSidebar = function() {
        var shopP = 30;

        if ( $('body').hasClass('admin-bar') ) {
            shopP = 32;
        }

        $('html, body').stop().animate({
            scrollTop: $('.shop-area').offset().top - shopP
        }, 400);
    };

    $(document.body).on('click','.zank-open-fixed-sidebar,.zank-close-sidebar', function () {
        $('body').toggleClass('zank-overlay-open');
        $('.nt-sidebar').toggleClass('active');
    });

    $(document.body).on('click','.zank-toggle-hidden-sidebar', function (e) {
        $('.zank-toggle-hidden-sidebar').toggleClass('active');
        $('.nt-sidebar').toggleClass('active').slideToggle();

        setTimeout(function(){
            scrollToTopSidebar();
        }, 100 );
    });

    $('.nt-sidebar ul.product-categories li.cat-parent> ul.children').each( function (e) {
        $(this).before('<span class="subDropdown"></span>');
        $(this).slideUp();
    });

    zankWcProductCats();

    $(document).on('zankShopInit', function() {
        zankWcProductCats();
    });

    function zankWcProductCats() {
        $('.widget_zank_product_categories ul.children input[checked]').closest('li.cat-parent').addClass("current-cat");
    }

    $(document.body).on('click','.nt-sidebar ul li.cat-parent .subDropdown', function (e) {
        e.preventDefault();
        if ( $(this).hasClass('active') ) {
            $(this).removeClass('active minus').addClass("plus");
            $(this).next('.children').slideUp('slow');
        } else {
            $(this).removeClass('plus').addClass("active minus");
            $(this).next('.children').slideDown('slow');
        }
    });

    if ( typeof zank_vars !== 'undefined' && zank_vars ) {
        var colors = zank_vars.swatches;

        $('.woocommerce-widget-layered-nav-list li a').each(function () {
            var $this = $(this);
            var title = $this.html();
            for (var i in colors) {
                if ( title == i ) {
                    var is_white = color == '#fff' || color == '#FFF' || color == '#ffffff' || color == '#FFFFFF' ? 'is_white' : '';
                    var color = '<span class="zank-swatches-widget-color-item'+is_white+'" style="background-color: '+colors[i]+';"></span>';
                    $this.prepend(color);
                }
            }
        });
    }

    if ( $(window).width() < 992 ) {
        var columnSize = $('.zank-shop-hidden-top-sidebar').data('column');
        $('.zank-shop-hidden-top-sidebar').removeClass('d-none active').removeAttr('style');
        $('.zank-toggle-hidden-sidebar').removeClass('active');
        $('.zank-shop-hidden-top-sidebar:not(.d-none) .nt-sidebar-inner').removeClass(columnSize);
    }

    $(window).on('resize', function(){
        var columnSize = $('.zank-shop-hidden-top-sidebar').data('column');
        if ( $(window).width() >= 992 ) {
            if ( $('body').hasClass('zank-overlay-open') ) {
                $('body').removeClass('zank-overlay-open');
                $('.zank-shop-hidden-top-sidebar').removeClass('active');
            }
            $('.zank-shop-hidden-top-sidebar').addClass('d-none');
            $('.zank-shop-hidden-top-sidebar .nt-sidebar-inner').addClass(columnSize);
        }
        if ( $(window).width() < 992 ) {
            $('.zank-shop-hidden-top-sidebar').removeClass('d-none active').removeAttr('style');
            $('.zank-toggle-hidden-sidebar').removeClass('active');
            $('.zank-shop-hidden-top-sidebar:not(.d-none) .nt-sidebar-inner').removeClass(columnSize);
        }
    });

    /***** shop sidebar *****/


    /***** cart shipping form show-hide start *****/

    $(document.body).on('click','.zank-shipping-calculator-button', function (e) {
        e.preventDefault();
        var cartTotals = $('.zank-cart-totals'),
            form       = $('.shipping-calculator-form');

        if ( cartTotals.hasClass('active')) {
            cartTotals.removeClass('active');
            form.slideUp('slow');
        } else {
            cartTotals.addClass('active');
            form.slideDown('slow');
            setTimeout(function(){
                $('html, body').stop().animate({
                    scrollTop: cartTotals.offset().top - scrollOffset
                }, 400);
            }, 300 );
        }
    });

    /***** cart shipping form show-hide end *****/


    /***** panel Cart Content Height start *****/

    panelCartContentHeight();
    function panelCartContentHeight() {
        if ( $('.zank-side-panel .cart-area').length ) {
            var cartPos          = $('.zank-side-panel .panel-content').position();
            var cartFooterHeight = $('.zank-side-panel .header-cart-footer').height();
            var cartMaxHeight    = cartPos.top + cartFooterHeight + 40;

            $('.zank-side-panel .cart-area .zank-scrollbar').css('max-height',cartMaxHeight);
        }
    }

    $(document.body).on('added_to_cart removed_from_cart updated_cart_totals', function(){
        setTimeout( function(){
            panelCartContentHeight();
        },500)
    });

    /***** panel Cart Content Height *****/


    /***** shop-popup-notices close trigger *****/

    $(document.body).on('click', '.zank-shop-popup-notices .close-error', function() {
        $('.zank-shop-popup-notices').removeClass('active');
        setTimeout(function(){
            $('.zank-shop-popup-notices').removeClass('zank-notices-has-error');
        }, 1000 );
    });

    /***** shop-popup-notices close trigger *****/


    /***** label-color *****/

    $('[data-label-color]').each( function() {
        var $this = $(this);
        var $color = $this.data('label-color');
        $this.css( {'background-color': $color,'border-color': $color } );
    });

    /***** label-color *****/


    /***** woocommerce-ordering *****/

    if ( $('.woocommerce-ordering select').length ) {
        $('.woocommerce-ordering select').niceSelect();
    }

    /***** woocommerce-ordering *****/


    /***** update swatches color filters *****/

    if ( typeof zank_vars !== 'undefined' && zank_vars ) {
        var colors = zank_vars.swatches;

        $('.woocommerce-widget-layered-nav-list li a').each(function () {
            var $this = $(this);
            var title = $this.html();
            for (var i in colors) {
                if ( title == i ) {
                    var is_white = color == '#fff' || color == '#FFF' || color == '#ffffff' || color == '#FFFFFF' ? 'is_white' : '';
                    var color = '<span class="zank-swatches-widget-color-item'+is_white+'" style="background-color: '+colors[i]+';"></span>';
                    $this.prepend(color);
                }
            }
        });

        $('.zank-fast-filters-submenu span[data-color]').each(function () {
            var $this    = $(this);
            var color    = $this.data('color');
            var is_white = color == '#fff' || color == '#FFF' || color == '#ffffff' || color == '#FFFFFF' ? 'is_white' : '';
            $this.css('background-color',color);
            if (is_white) {
                $this.addClass(is_white);
            }
        });
    }

    /***** update swatches color filters *****/


    /***** my account page multisteps slider *****/

    if ( $('.zank-myaccount-steps-register').length>0 ) {
        var myAccountFormSteps = new NTSwiper('.zank-myaccount-steps-register', {
            loop          : false,
            speed         : 500,
            spaceBetween  : 0,
            autoHeight    : false,
            simulateTouch : false,
            observer      : true,
            observerChildren      : true,
            navigation    : {
                nextEl: '.zank-myaccount-steps-register .zank-myaccount-form-button-register',
                prevEl: '.zank-myaccount-steps-register .zank-myaccount-form-button-login'
            },
            on: {
                resize: function () {
                    var swiper = this;
                    swiper.update();
                }
            },
            effect: 'slide'
        });
    }

    /***** my account page multisteps slider *****/

    /***** compare button fix *****/

    if ( $('#woosc-area').length> 0) {
        var woosc = $('#woosc-area').data('count');
        $('.zank-compare-count').html(woosc);
        $('.woosc-bar-item').each(function () {
            var $id = $(this).attr('data-id');
            $('.woosc-btn-icon-only[data-id="'+$id+'"]').addClass('woosc-added added');
        });
    }

    $(document.body).on('woosc_change_count', function(){
	     var woosc_count = $('#woosc-area').attr('data-count');
	     $('.zank-compare-count').html(woosc_count);
    });

    /***** compare button fix *****/

    /***** wishlist button fix *****/

    var wl_dcount  = $('.open-wishlist-btn .woosw-menu-item-inner').attr('data-count');
    var wl_counter = $('.zank-wishlist-count');
    var wl_table   = $('.woosw-items.table .woosw-item');
    var wl_count   = typeof wl_dcount != 'undefined' ? wl_dcount : "0";

    wl_counter.html(wl_count);

    if ( $('table.woosw-items').length > 0 ) {
        $('body').addClass('woosw-page');
    }

    $(document.body).on('woosw_fragments_refreshed', function(){
        wl_count = $('.woosw-count').html();
        wl_counter.html(wl_count);

        if ( $('body').hasClass('woosw-page') ) {
            wl_count = wl_table.length > 0 ? wl_table.length : "0";
            wl_counter.html(wl_count);
        }
    });

    /***** wishlist button fix *****/


    /***** change sku *****/

    var $mainSkuHtml = $('.zank-sku-wrapper .sku'),
        $mainSku     = $mainSkuHtml.html();

    $('.zank-product-summary form.variations_form').on('show_variation', function( event, data ){
        $mainSkuHtml.html(data.sku);
        $('.zank-btn-reset-wrapper,.zank-product-info').addClass('active');
    });
    $('.zank-product-summary form.variations_form').on('hide_variation', function(){
        $mainSkuHtml.html($mainSku);
        $('.zank-btn-reset-wrapper,.zank-product-info').removeClass('active');
    });

    /***** change sku *****/

    $('.woocommerce-product-rating').addClass('zank-summary-item');

    if ($('body').hasClass('woocommerce-checkout') || $('body').hasClass('woocommerce-cart')) {
        $(document.body).on('click touch', '.zank-woocommerce-cart-form .product-remove', function(event) {
            $(this).addClass('loading');
        });
    }

    $('.zank-shop-filter-top-area .zank-block-right>div:last-child').addClass('last-child');

});

})(window, document, jQuery);
