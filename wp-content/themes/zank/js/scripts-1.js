/*-----------------------------------------------------------------------------------

    Theme Name: Zank
    Description: WordPress Theme
    Author: Ninetheme
    Author URI: https://ninetheme.com/
    Version: 1.0

-----------------------------------------------------------------------------------*/

(function(window, document, $) {

    "use strict";

    $.fn.sameSize = function( width, max ) {
        var prop = width ? 'width' : 'height',
        size = Math.max.apply( null, $.map( this, function( elem ) {
            return $( elem )[ prop ]();
        })),
        max = size < max ? size : max;
        return this[ prop ]( max || size );
    };

    jQuery.event.special.touchstart = {
        setup: function( _, ns, handle ) {
            this.addEventListener("touchstart", handle, { passive: !ns.includes("noPreventDefault") });
        }
    };
    jQuery.event.special.touchmove = {
        setup: function( _, ns, handle ) {
            this.addEventListener("touchmove", handle, { passive: !ns.includes("noPreventDefault") });
        }
    };
    jQuery.event.special.wheel = {
        setup: function( _, ns, handle ){
            this.addEventListener("wheel", handle, { passive: true });
        }
    };
    jQuery.event.special.mousewheel = {
        setup: function( _, ns, handle ){
            this.addEventListener("mousewheel", handle, { passive: true });
        }
    };

    var doc         = $(document),
        win         = $(window),
        body        = $('body'),
        winw        = $(window).outerWidth(),
        megasubmenu = $('.elementor-top-section .zank-header-top-menu-area li.menu-item-mega-parent > ul.submenu');

    function bodyResize(winw) {
        if ( winw <= 1024 ) {
            body.removeClass('nt-desktop').addClass('nt-mobile');
        } else {
            body.removeClass('nt-mobile').addClass('nt-desktop');
        }
    }

    function sideMainHeader() {
        $('.zank-main-sidebar-header .dropdown-btn').on('click',function(e){
            e.preventDefault();
            var $this    = $(this),
                $parent  = $this.parent().parent(),
                $submenu = $this.parent().next();

            if ( $parent.hasClass('zank-active') ) {
                $parent.removeClass('zank-active');
                $submenu.slideUp();
            } else {
                $parent.siblings('.zank-active').removeClass('zank-active').find('.submenu').slideUp();
                $parent.addClass('zank-active');
                $submenu.slideDown();
            }
        });

        $('.zank-mobile-menu-trigger').on('click',function(e){
            e.preventDefault();
            var $this = $(this);

            if ( $this.hasClass('zank-active') ) {
                $('html,body').removeClass('zank-overlay-open sidebar-menu-active');
                $this.removeClass('zank-active');
                $('.zank-main-sidebar-header').removeClass('zank-active');
            } else {
                $('html,body').addClass('zank-overlay-open sidebar-menu-active');
                $this.addClass('zank-active');
                $('.zank-main-sidebar-header').addClass('zank-active');
            }
        });

        $('.zank-mobile-menu-close-trigger').on('click',function(e){
            $('html,body').removeClass('zank-overlay-open sidebar-menu-active');
            $('.zank-mobile-menu-trigger,.zank-main-sidebar-header').removeClass('zank-active');
        });
    }

    function topMainHeader() {
        megasubmenu.each( function() {
            var cont     = $( this ),
                wrap     = cont.closest( '.navigation' ),
                wrapoff  = wrap.offset(),
                wrapleft = wrapoff.left,
                parentw  = cont.closest( '.elementor-top-section' ).outerWidth();

            if ( winw > 1024 ) {
                cont.css({
                    'left':'-'+ ( wrapleft ) +'px',
                    'width': parentw+'px',
                });
            } else {
                cont.removeAttr('style');
            }
        });
    }

    function topMainHeaderResize(winw) {
        if ( winw <= 1024 ) {
            megasubmenu.each( function() {
                var cont = $( this );
                cont.removeAttr('style');
            });
        } else {
            megasubmenu.each( function() {
                var cont     = $( this ),
                    wrap     = cont.closest( '.navigation' ),
                    wrapoff  = wrap.offset(),
                    wrapleft = wrapoff.left,
                    parentw  = cont.closest('.elementor-top-section').outerWidth();
                cont.css({
                    'left':'-'+ ( wrapleft ) +'px',
                    'width': parentw+'px',
                });
            });
        }
    }

    function mobileSlidingMenu() {

        if ( $('.zank-header-mobile-slide-menu').length ){
            $('.zank-header-mobile-slide-menu').slidingMenu({
                className : "zank-header-mobile-slide-menu",
                transitionDuration : 250,
                dataJSON : false,
                initHref : false,
                backLabel: 'Back'
            });
        }
        if ( $('.zank-header-lang-slide-menu').length ){
            $('.zank-header-lang-slide-menu').slidingMenu({
                className : "zank-header-lang-slide-menu",
                transitionDuration : 250,
                dataJSON : false,
                initHref : false,
                backLabel: 'Back'
            });
        }

        $('.sliding-menu .menu-item-has-children>.sliding-menu__nav').each( function() {
            var $this = $( this ),
                id = $this.data( 'id' ),
                parentTitle = $this.text(),
                parents = $this.parents( '.sliding-menu' ),
                subBack = parents.find( '.sliding-menu__panel[data-id="'+id+'"] .sliding-menu__back' );
            subBack.text(parentTitle);
        });

        $('.sliding-menu__panel:not(.shortcode_panel)').each( function() {
            $( '<li class="sliding-menu-inner"><ul></ul></li>' ).appendTo($(this ));
        });
        $('.sliding-menu__panel .menu-item').each( function() {
            $( this ).appendTo($( this ).parents('.sliding-menu__panel').find('.sliding-menu-inner>ul'));
        });
        $('.sliding-menu').each( function() {
            var height = $( this ).find('.sliding-menu__panel-root').outerHeight();
            $( this ).css('height',height);
        });
    }

    $('.header-top-buttons .top-action-btn:not(.has-custom-action)[data-name], .zank-header-mobile-top-actions .top-action-btn:not(.has-custom-action)[data-name]').on('click',function(e){
        var $this = $(this),
            $name = $this.data('name');

        $('html,body').addClass('zank-overlay-open');
        $('.top-action-btn:not([data-name="'+$name+'"],.panel-header-btn').removeClass('active');
        $('.zank-side-panel .panel-content-item:not([data-name="'+$name+'"]),.panel-header-btn:not([data-name="'+$name+'"])').removeClass('active');
        $('.zank-side-panel,.zank-side-panel [data-name="'+$name+'"],.panel-header-btn[data-name="'+$name+'"]').addClass('active');
    });

    $('[data-name="search-popup"], .popup-search, a[href="#zank-popup-search"],.zank-mobile-search-trigger').on('click',function(e){
        $('html,body').addClass('zank-overlay-open');
        $('.zank-popup-search-panel').addClass('active');
        $('.top-action-btn:not([data-name="search"]),.panel-header-btn').removeClass('active');
        $('.zank-side-panel .panel-content-item,.panel-header-btn').removeClass('active');
    });

    $('.zank-bottom-mobile-nav [data-name="search-cats"]').on('click',function(e){
        $('html,body').addClass('zank-overlay-open');
        $('.zank-header-mobile').addClass('active');
        $('.zank-header-mobile .action-content:not([data-target-name="search-cats"])').removeClass('active');
        $('.zank-header-mobile .action-content[data-target-name="search-cats"]').addClass('active');
        $('.zank-header-mobile .top-action-btn').removeClass('active');
        $('.zank-header-mobile [data-name="search-cats"]').addClass('active');
    });

    $('[data-account-action="account"]').on('click',function(e){
        $('html,body').addClass('zank-overlay-open');
        $('.account-area-form-wrapper .active').removeClass('active');
        $('.zank-header-mobile, .zank-header-mobile .account-area, .zank-header-mobile-content .login-form-content').addClass('active');
        $('.top-action-btn[data-name="account"]').trigger('click');
    });

    $('.zank-open-popup').on('click',function(e){
        $('html,body').removeClass('zank-overlay-open');
        $('.zank-header-mobile, .zank-side-panel .panel-content-item,.panel-header-btn').removeClass('active');
    });

    $('.open-minicart').on('click',function(e){
        $('.zank-header-mobile').removeClass('active');
        $('html,body').addClass('zank-overlay-open');
        $('.zank-side-panel,.zank-side-panel [data-name="cart"]').addClass('active');
    });

    $('.has-default-header-type-trans .zank-header-default .navigation.primary-menu').hover(
        function(){
            $('.zank-header-default').addClass('trans-hover');
        },
        function(){
            $('.zank-header-default').removeClass('trans-hover');
        }
    );

    function mobileHeaderActions() {
        $('.top-action-btn:not(.has-custom-action)[data-name]').each( function(){
            var $this = $(this),
                $name = $this.data('name');

            $this.on('click',function(e){
                var $thiss = $(this);
                $('.top-action-btn:not([data-name="'+$name+'"]').removeClass('active');

                $('[data-target-name]').removeClass('active');
                if ( $thiss.hasClass('active') ) {
                    $thiss.removeClass('active');
                    $('.zank-header-slide-menu,.search-area-top').addClass('active');
                    $('[data-target-name="'+$name+'"]').removeClass('active');
                } else {
                    $thiss.addClass('active');
                    $('.zank-header-slide-menu,.search-area-top').removeClass('active');
                    $('[data-target-name="'+$name+'"]').addClass('active');
                }
                if ( !($('[data-target-name="'+$name+'"]').length) ) {
                    $('.search-area-top,.zank-header-slide-menu').addClass('active');
                }
                if ( $('.zank-header-mobile-content div[data-name="checkout"]').hasClass('active') ) {
                    $('.zank-header-mobile-content div[data-name="checkout"]').removeClass('active');
                }
                e.preventDefault();
            });
        });

        $('.mobile-toggle').on('click',function(e){

            $('.zank-header-mobile-content .active, .sidebar-top-action .active, .zank-side-panel').removeClass('active');
            $('.search-area-top').addClass('active');
            $('.account-area .login-form-content').addClass('active');
            if ( $('.zank-header-mobile').hasClass('active') ) {
                $('html,body').removeClass('zank-overlay-open');
                $('.zank-header-mobile').removeClass('active');
            } else {
                $('html,body').addClass('zank-overlay-open');
                $('.zank-header-mobile,.menu-area').addClass('active');
            }
            e.preventDefault();
        });

        $('.account-area .signin-title').on('click',function(){
            $('.form-action-btn').removeClass('active');
            $(this).addClass('active');
            $('.account-area .register-form-content').removeClass('active');
            $('.account-area .login-form-content').addClass('active');
        });
        $('.account-area .register-title').on('click',function(){
            $('.form-action-btn').removeClass('active');
            $(this).addClass('active');
            $('.account-area .login-form-content').removeClass('active');
            $('.account-area .register-form-content').addClass('active');
        });
        if ( $('.account-area.action-content .account-area-social-form-wrapper').length ) {
            $('.account-area-form-wrapper').css('min-height', $('.account-area-form-wrapper .woocommerce-form-login').height()+50);
        }
    }

    $('.zank-panel-close,.zank-header-overlay').on('click',function(){
    	$('.zank-main-sidebar-header, .zank-mobile-menu-trigger').removeClass('zank-active');
        $('html,body').removeClass('zank-overlay-open');
        $('.zank-header-mobile, .zank-side-panel, .zank-popup-search-panel, .nt-sidebar').removeClass('active');
        $('.zank-header-mobile-content .active, .zank-header-mobile-sidebar-bottom, .sidebar-top-action .active').removeClass('active');
        $('.zank-header-slide-menu').addClass('active');
        $('.zank-shop-popup-notices').removeClass('active');
        $('.zank-shop-popup-notices').removeClass('zank-notices-has-error');
    });


    $('.panel-header-wishlist,.panel-header-compare').on('click',function(){
        $('.zank-side-panel').removeClass('active');
        $('html,body').removeClass('zank-overlay-open');
    });

    $(".zank-header-top-menu-area .menu-item-has-children").hover(
        function(){
            $(this).addClass('on-hover');
        },
        function(){
            $(this).removeClass('on-hover');
        }
    );


    function mobileHeaderResize(winw) {
        if ( winw >= 490 ) {
            if ( $('.top-action-btn.share').hasClass('active') ) {
                $('.top-action-btn.share,.zank-header-mobile-content').removeClass('active');
            }
        }
        if ( winw > 992 ) {
            $('html,body').removeClass('zank-overlay-open');
            $('.zank-header-mobile').removeClass('active');
            $('.zank-popup-search-panel').removeClass('active');
        }
    }

    /*=============================================
    Mobile Menu
    =============================================*/
    //SubMenu Dropdown Toggle
    if ( $('.header-widget').length ) {
        $('.header-widget.header-style-two').parents('.elementor-top-section').addClass('big-index has-header-style-two');
    }

    // set height for header spacer
    function headerSpacerHeight(winw) {
        if ( $('.zank-header-default').length ) {
            var height;
            if ( winw > 992 ) {
                height = $('.zank-header-default').height();
            } else {
                height = $('.zank-header-mobile-top').height();
            }
            $('.header-spacer').css('height', height );
        }
    }


    function zankHeaderCatMenu() {
        $('.zank-vertical-menu-wrapper').each(function () {
            const $this = $(this);
            const menu = $this.find('.zank-vertical-menu');
            const toggle = $this.find('.zank-vertical-menu-toggle');
            const more = $this.find('.zank-more-item-open');
            const morecats = $this.find('.zank-more-categories');
            /*=============================================
            Toggle Active
            =============================================*/
            $(toggle).on('click', function () {
                $(menu).slideToggle(500);
                return false;
            });
            $(more).slideUp();
            $(morecats).on('click', function () {
                $(this).toggleClass('show');
                $(more).slideToggle();
            });
        });
    }

    /*=============================================
    Menu sticky & Scroll to top
    =============================================*/
    function scrollToTopBtnClick() {
        if ( $(".scroll-to-target").length ) {
            $( ".scroll-to-target" ).on("click", function () {
                var target = $(this).attr("data-target");
                // animate
                $("html, body").animate({scrollTop: $(target).offset().top},1000);
                return false;
            });
        }
    }

    if ( $(".scroll-to-target").length ) {
        $( ".scroll-to-target" ).on("click", function () {
            var target = $(this).attr("data-target");
            // animate
            $("html, body").animate({scrollTop: $(target).offset().top},1000);
            return false;
        });
    }

    /*=============================================
    Menu sticky & Scroll to top
    =============================================*/
    function scrollToTopBtnHide() {
        var offset = 100;
        if ( $(".scroll-to-target").length ) {
            if ( $(window).scrollTop() > offset ) {
                $(".scroll-to-top").fadeIn(500);
            } else if ( $(".scroll-to-top").scrollTop() <= offset ) {
                $(".scroll-to-top").fadeOut(500);
            }
        }
    }

    /*=============================================
    Data Background
    =============================================*/
    $("[data-background]").each(function () {
        $(this).css("background-image", "url(" + $(this).attr("data-background") + ")")
    });


    /* zankSwiperSlider */
    function zankSwiperSlider() {
        if ( $(".zank-swiper-slider").length ) {
            $('.zank-swiper-slider').each(function () {
            	var container  = $(this);
                const options  = $(this).data('swiper-options');
                const mySlider = new NTSwiper(this, options );
                mySlider.on('transitionEnd', function () {
                    var animIn = $(container).find('.swiper-slide').data('anim-in');
                    var active = $(container).find('.swiper-slide-active');
                    var inactive = $(container).find('.swiper-slide:not(.swiper-slide-active)');

                    if( typeof animIn != 'undefined' ) {
                        inactive.find('.has-animation').each(function(e){
                            $(this).removeClass('animated '+animIn);
                        });
                        active.find('.has-animation').each(function(e){
                            $(this).addClass('animated '+animIn);
                        });
                    }
                });
            });
        }
    }

    /* zankSlickSlider */
    function zankSlickSlider() {
        $('.zank-slick-slider').each(function () {
            $(this).not('.slick-initialized').slick();
        });
    }

    // agrikonVegasSlider Preview function
    function zankVegasSlider() {

        $(".home-slider-vegas-wrapper").each(function (i, el) {
            var myEl       = jQuery(el),
                myVegasId  = myEl.find('.nt-home-slider-vegas').attr('id'),
                myVegas    = $( '#' + myVegasId ),
                myPrev     = myEl.find('.vegas-control-prev'),
                myNext     = myEl.find('.vegas-control-next'),
                mySettings = myEl.find('.nt-home-slider-vegas').data('slider-settings'),
                myContent  = myEl.find('.nt-vegas-slide-content'),
                myCounter  = myEl.find('.nt-vegas-slide-counter'),
                myTitle    = myEl.find('.slider_title'),
                myDesc     = myEl.find('.slider_desc'),
                myBtn      = myEl.find('.btn'),
                myCounter  = myEl.find('.nt-vegas-slide-counter');

            myEl.parents('.elementor-widget-agrikon-vegas-slider').removeClass('elementor-invisible');

            if( mySettings.slides.length ) {
                var slides = mySettings.slides,
                    anim   = mySettings.animation ? mySettings.animation : 'kenburns',
                    trans  = mySettings.transition ? mySettings.transition : 'slideLeft',
                    delay  = mySettings.delay ? mySettings.delay : 7000,
                    dur    = mySettings.duration ? mySettings.duration : 2000,
                    autoply= mySettings.autoplay,
                    shuf   = 'yes' == mySettings.shuffle ? true : false,
                    timer  = 'yes' == mySettings.timer ? true : false,
                    over   = 'none' != mySettings.overlay ? true : false;

                myVegas.vegas({
                    autoplay: autoply,
                    delay: delay,
                    timer: timer,
                    shuffle: shuf,
                    animation: anim,
                    transition: trans,
                    transitionDuration: dur,
                    overlay: over,
                    slides: mySettings.slides,
                    init: function (globalSettings) {
                        myContent.eq(0).addClass('active');
                        myTitle.eq(0).addClass('fadeInLeft');
                        myDesc.eq(0).addClass('fadeInLeft');
                        myBtn.eq(0).addClass('fadeInLeft');
                        var total = myContent.size();
                        myCounter.find('.total').html(total);
                    },
                    walk: function (index, slideSettings) {
                        myContent.removeClass('active').eq(index).addClass('active');
                        myTitle.removeClass('fadeInLeft').addClass('fadeOutLeft').eq(index).addClass('fadeInLeft').removeClass('fadeOutLeft');
                        myDesc.removeClass('fadeInLeft').addClass('fadeOutLeft').eq(index).addClass('fadeInLeft').removeClass('fadeOutLeft');
                        myBtn.removeClass('fadeInLeft').addClass('fadeOutLeft').eq(index).addClass('fadeInLeft').removeClass('fadeOutLeft');
                        var current = index +1;
                        myCounter.find('.current').html(current);
                    },
                    end: function (index, slideSettings) {
                    }
                });

                myPrev.on('click', function () {
                    myVegas.vegas('previous');
                });

                myNext.on('click', function () {
                    myVegas.vegas('next');
                });
            }
        });
        // add video support on mobile device for vegas slider
        if( $(".home-slider-vegas-wrapper").length ) {
            $.vegas.isVideoCompatible = function () {
                return true;
            }
        }
    }

   // zankJarallax
    function zankJarallax() {
        var myParallaxs = $('.zank-parallax');
        myParallaxs.each(function (i, el) {

            var myParallax = $(el),
                myData     = myParallax.data('zankParallax');

            if (!myData) {
                return true; // next iteration
            }

             myParallax.jarallax({
                type            : myData.type,
                speed           : myData.speed,
                imgSize         : myData.imgsize,
                imgSrc          : myData.imgsrc,
                disableParallax : myData.mobile ? /iPad|iPhone|iPod|Android/ : null,
                keepImg         : false,
            });
        });

    }



   // zankFixedSection
    function zankFixedSection() {
        var myFixedSection = $( '.zank-section-fixed-yes' );
        if ( myFixedSection.length ) {
            myFixedSection.parents( '[data-elementor-type="section"]' ).addClass( 'zank-section-fixed zank-custom-header' );
            win.on( "scroll", function () {
                var bodyScroll = win.scrollTop();
                if ( bodyScroll > 100 ) {
                    myFixedSection.parents( '[data-elementor-type="section"]' ).addClass( 'section-fixed-active' );
                } else {
                   myFixedSection.parents( '[data-elementor-type="section"]' ).removeClass( 'section-fixed-active' );
                }
            });
        }
    }

    // zankPopup
    function zankPopupTemplate() {
        var myPopups = $('.zank-popup-item');
        myPopups.each(function (i, el) {
            var myPopup = $(el),
                myId    = myPopup.attr('id'),
                myEl    = $('body a[href="#'+myId+'"]' );

            if ( myEl.length ) {
                myEl.addClass('zank-open-popup');
            }
        });

        if ( $(".zank-open-popup").length ) {
            $(".zank-open-popup").magnificPopup({
                type            : 'inline',
                fixedContentPos : false,
                fixedBgPos      : true,
                overflowY       : 'scroll',
                closeBtnInside  : true,
                preloader       : false,
                midClick        : true,
                removalDelay    : 0,
                mainClass       : 'zank-mfp-slide-bottom',
                tClose          : '',
                tLoading        : '<span class="loading-wrapper"><span class="ajax-loading"></span></span>',
                closeMarkup     : '<div title="%title%" class="mfp-close zank-mfp-close"></div>',
                callbacks       : {
                    open : function() {
                        $("html,body").addClass('zank-popup-open');
                        if ( $('.zank-popup-item .zank-slick-slider').length ) {
                            $('.zank-popup-item .zank-slick-slider').each(function () {
                                $(this).slick('refresh');
                            });
                        }
                    },
                    close : function() {
                        $("html,body").removeClass('zank-popup-open');
                    }
                }
            });
        }
    }



    /*=============================================
    Theme WooCommerce
    =============================================*/
    /* added_to_cart
    *  updated_cart_totals
    */

    // none elementor page fix some js
    function noneElementorPageFix() {
        if ( !$('body').hasClass('archive') ) {
            return;
        }
        $('[data-widget_type="accordion.default"] .elementor-accordion-item .elementor-tab-title').each(function(e){
            $( this ).on('click',function(e){
                var $this = $( this );
                var $parent = $this.parent();

                $this.toggleClass('elementor-active');
                $parent.find('.elementor-tab-content').slideToggle();
                $parent.siblings().find('.elementor-tab-title').removeClass('elementor-active');
                $parent.siblings().find('.elementor-tab-content').slideUp();
            });
        });
    }

    // zankCf7Form
    function zankCf7Form() {
        $('.zank-cf7-form-wrapper.form_front').each( function(){
            $(this).find('form>*').each( function(index,el){
                $(this).addClass('child-'+index);
            });
        });
    }


    // popupNewsletter
    function popupNewsletter() {
        if ( !$('body').hasClass('newsletter-popup-visible') ) {
            return;
        }

        var expires = $( '.zank-newsletter' ).data( 'expires' );

        if (!( Cookies.get( 'newsletter-popup-visible' ) ) ) {
            $( window ).on( 'load', function() {
                $('.zank-newsletter').trigger( 'click' );
            });
        }

        $(".zank-newsletter .dontshow").click(function() {
            if ($(this).is(":checked")) {
                Cookies.set( 'newsletter-popup-visible', 'disable', { expires: expires, path: '/' });
            } else {
                Cookies.remove('newsletter-popup-visible')
            }
        });
    }


    function zankLightbox() {
        var myLightboxes = $('[data-zank-lightbox]');
        if (myLightboxes.length) {
            myLightboxes.each(function(i, el) {
                var myLightbox = $(el);
                var myData = myLightbox.data('zankLightbox');
                var myOptions = {};
                if (!myData || !myData.type) {
                    return true; // next iteration
                }
                if (myData.type === 'gallery') {
                    if (!myData.selector) {
                        return true; // next iteration
                    }
                    myOptions = {
                        delegate: myData.selector,
                        type: 'image',
                        gallery: {
                            enabled: true
                        }
                    };
                }
                if (myData.type === 'image') {
                    myOptions = {
                        type: 'image'
                    };
                }
                if (myData.type === 'iframe') {
                    myOptions = {
                        type: 'iframe'
                    };
                }
                if (myData.type === 'inline') {
                    myOptions = {
                        type: 'inline',
                    };
                }
                if (myData.type === 'modal') {
                    myOptions = {
                        type: 'inline',
                        modal: false
                    };
                }
                if (myData.type === 'ajax') {
                    myOptions = {
                        type: 'ajax',
                        overflowY: 'scroll'
                    };
                }
                myLightbox.magnificPopup(myOptions);
            });
        }
    }

    // popupGdpr
    function popupGdpr() {
        if ( !$('body').hasClass('gdpr-popup-visible') ) {
            return;
        }

        var body        = $('body'),
            popup       = $('.site-gdpr'),
            popupClose  = $('.site-gdpr .gdpr-button a'),
            expiresDate = popup.data('expires');

        if ( !( Cookies.get( 'gdpr-popup-visible' ) ) ) {
            setTimeout(function(){
                popup.addClass( 'active' );
            },1000);
        }

        popupClose.on( 'click', function(e) {
            e.preventDefault();
            Cookies.set( 'gdpr-popup-visible', 'disable', { expires: expiresDate, path: '/' });
            popup.removeClass( 'active' );
            $.cookie("ninetheme_gdpr", 'accepted');
        });
    }

    // product list type masonry for mobile
    function masonryInit(winw) {
        var masonry = $('.zank-products.zank-product-list');
        if ( masonry.length && winw <= 1200 ) {
            //set the container that Masonry will be inside of in a var
            var container = document.querySelector('.zank-products.zank-product-list');
            //create empty var msnry
            var msnry;
            // initialize Masonry after all images have loaded
            imagesLoaded( container, function() {
               msnry = new Masonry( container, {
                   itemSelector: '.zank-product-list>div.product'
               });
            });
        }
    }


    function zankGallery() {
        if ( $('.gallery_front').length > 0 ){
            const $this     = $('.gallery_front');
            const gallery   = $this.find('.zank-wc-gallery .row');
            const filter    = $this.find('.gallery-menu');
            const filterbtn = $this.find('.gallery-menu span');
            gallery.imagesLoaded(function () {
                // init Isotope
                var $grid = gallery.isotope({
                    itemSelector    : '.grid-item',
                    percentPosition : true,
                    masonry         : {
                        columnWidth : '.grid-sizer'
                    }
                });
                // filter items on button click
                filter.on('click', 'span', function () {
                    var filterValue = $(this).attr('data-filter');
                    $grid.isotope({ filter: filterValue });
                });
            });
            //for menu active class
            filterbtn.on('click', function (event) {
                $(this).siblings('.active').removeClass('active');
                $(this).addClass('active');
                event.preventDefault();
            });
        }
    }

    // sidebar-widget-toggle
    $( document.body ).on('click', '.nt-sidebar-widget-toggle', function() {
        var $this = $(this);
        $this.toggleClass('active');
        $this.parents('.nt-sidebar-inner-widget').toggleClass('zank-widget-show zank-widget-hide');
        $this.parent().next().slideToggle('fast');

        if ( $('.nt-sidebar-inner-wrapper .zank-widget-show').length ) {
            $this.parents('.nt-sidebar-inner-wrapper').removeClass('all-closed');
        } else {
            $this.parents('.nt-sidebar-inner-wrapper').addClass('all-closed');
        }
    });


    function bannerBgVideo(){

        var iframeWrapper      = $('.zank-loop-product-iframe-wrapper'),
            iframeWrapper2     = $('.zank-woo-banner-iframe-wrapper'),
            videoid            = iframeWrapper2.data('zank-bg-video'),
            aspectRatioSetting = iframeWrapper2.find('iframe').data('bg-aspect-ratio');

        if ( iframeWrapper2.hasClass('zank-video-calculate') ) {
            var containerWidth   = iframeWrapper2.outerWidth(),
                containerHeight  = iframeWrapper2.outerHeight(),
                aspectRatioArray = aspectRatioSetting.split(':'),
                aspectRatio      = aspectRatioArray[0] / aspectRatioArray[1],
                ratioWidth       = containerWidth / aspectRatio,
                ratioHeight      = containerHeight * aspectRatio,
                isWidthFixed     = containerWidth / containerHeight > aspectRatio,
                size             = {
                    w: isWidthFixed ? containerWidth : ratioHeight,
                    h: isWidthFixed ? ratioWidth : containerHeight
                };

            iframeWrapper2.find('iframe').css({
                width: size.w + 100,
                height: size.h + 100
            });
        }
        if ( winw <= 1024 && ( iframeWrapper.length || iframeWrapper2.length ) ) {
            var iframe = iframeWrapper.find('iframe');
            if ( iframeWrapper.length ) {
                iframe[0].contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
            }
            if ( iframeWrapper2.hasClass('zank-video-youtube') ) {
                iframe[0].contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
            }
            if ( iframeWrapper2.hasClass('zank-video-vimeo') ) {
                iframe[0].contentWindow.postMessage('{"method":"play"}', '*');
            }
            if ( iframeWrapper.hasClass('zank-video-local') ) {
                iframe.get(0).play();
            }
        }
    }

    function ninethemeCountDown() {
        $('[data-countdown]').each(function () {
            var self      = $(this),
                data      = self.data('countdown'),
                countDate = data.date,
                expired   = data.expired,
                update    = data.update;

            if (!countDate) {
               return;
            }

            let countDownDate = new Date( countDate ).getTime();

            const d = self.find( '.days' );
            const h = self.find( '.hours' );
            const m = self.find( '.minutes' );
            const s = self.find( '.second' );

            var x = setInterval(function() {

                var now = new Date().getTime();

                var distance = countDownDate - now;

                var days    = (Math.floor(distance / (1000 * 60 * 60 * 24)));
                var hours   = ('0' + Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).slice(-2);
                var minutes = ('0' + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).slice(-2);
                var seconds = ('0' + Math.floor((distance % (1000 * 60)) / 1000)).slice(-2);

                d.text( days<10 ? '0'+days : days );
                h.text( hours );
                m.text( minutes );
                s.text( seconds );

                if ( distance < 0 ) {
                    clearInterval(x);
                    self.html('<div class="expired">' + expired + '</div>');
                }
            }, 1000);
        });
    }

    // masonry reinit
    $(document.body).on('zank_masonry_init', function() {
        masonryInit(winw);
    });
	
    function isLocalStorageSupported() {
        try {
            const testKey = 'test';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }
	

	function loadFooterTemplate() {
	    var saveFooter     = zank_vars.save_footer;
	    var isLocalStorage = isLocalStorageSupported();

	    if ( isLocalStorage && saveFooter == "no" ) {
	        localStorage.removeItem('zankFooterTemplate');
	    }

	    if ( isLocalStorage && saveFooter == "yes" ) {
    		var localStorageKey = 'zankFooterTemplate';
    		var storedData      = false;
    		var storedContent   = localStorage.getItem(localStorageKey);

    		try {
    			storedData = JSON.parse(storedContent);
    		}
    		catch (e) {
    			console.log('cant parse Json', e);
    		}
	    }

		if ( isLocalStorage && storedData && saveFooter == "yes" ) {
			$('.zank-elementor-footer').replaceWith(storedData);
		} else {
			$.ajax({
				url: zank_vars.ajax_url,
				type: 'POST',
				data: {
					action: 'load_footer_template'
				},
				success: function(response) {
					$('.zank-elementor-footer').replaceWith(response);
					if ( isLocalStorage && saveFooter == "yes" ) {
					    localStorage.setItem(localStorageKey, JSON.stringify(response));
					}
				}
			});
		}
	}
	
	function loadMegamenuContent() {
	    var saveMegamenu   = zank_vars.save_megamenu;
	    var isLocalStorage = isLocalStorageSupported();
	    
	    if ( isLocalStorage && saveMegamenu == "no" ) {
	        localStorage.removeItem('megaMenuContent');
	    }
	    
	    if ( isLocalStorage && saveMegamenu == "yes" ) {
    		var localStorageKey = 'megaMenuContent';
    		var storedContent   = localStorage.getItem('megaMenuContent');
    		var ids             = [];
    		var storedData      = false;
    		
    		$('.menu-load-ajax:not(.menu-loaded)').each(function() {
    			ids.push($(this).data('id'));
    		});
    		
    		try {
    			storedData = JSON.parse(storedContent);
    		}
    		catch (e) {
    			console.log('cant parse Json', e);
    		}
    	}

		if ( isLocalStorage && storedData && saveMegamenu == "yes" ) {

			$('.menu-load-ajax:not(.menu-loaded)').each(function() {

				var id       = $(this).data('id');
				var content  = storedData.data[id].shortcode;
				var content2 = storedData.data[id].shortcode2;
				
				if ( content ) {
					$('.menu-load-ajax:not(.menu-loaded)[data-id="'+id+'"]').html(content).addClass('menu-loaded');
				}
				
				if ( content2 ) {
					$('.sliding-menu-load-ajax:not(.menu-loaded)[data-id="'+id+'"]').html(content2).addClass('menu-loaded');
				} else {
				    $('.sliding-menu-load-ajax:not(.menu-loaded)[data-id="'+id+'"]').html(content).addClass('menu-loaded');
				}
			});
			
		} else {

			$.ajax({
				url      : zank_vars.ajax_url,
				type     : 'POST',
				dataType : 'json',
				data     : {
					action  : 'get_mega_menu_content',
					ids     : ids
				},
				success  : function(response) {

					$('.menu-load-ajax:not(.menu-loaded)').each(function() {
						var id       = $(this).data('id');
						var content  = response.data[id].shortcode;
						var content2 = response.data[id].shortcode2;
						
						if ( content ) {
							$('.menu-load-ajax:not(.menu-loaded)[data-id="'+id+'"]').html(content).addClass('menu-loaded');
						}
						
						if ( content2 ) {
							$('.sliding-menu-load-ajax:not(.menu-loaded)[data-id="'+id+'"]').html(content2).addClass('menu-loaded');
						} else {
						    $('.sliding-menu-load-ajax:not(.menu-loaded)[data-id="'+id+'"]').html(content).addClass('menu-loaded');
						}
					});
					
					if ( isLocalStorage && saveMegamenu == "yes" ) {
					    localStorage.setItem('megaMenuContent', JSON.stringify(response));
					}
				},
				error: function() {
					console.log('loading html dropdowns ajax error');
				}
			});
		}
		
	}
	
    doc.ready( function() {
        if ( zank_vars.megamenu_ajax == "yes" ) {
		    loadMegamenuContent();
        }
		if ( zank_vars.footer_ajax == "yes" ) {
		    loadFooterTemplate();
		}
        winw = $(window).outerWidth();
        bodyResize();
        headerSpacerHeight(winw);
        sideMainHeader();
        topMainHeader();
        mobileSlidingMenu();
        mobileHeaderActions();
        zankHeaderCatMenu();
        zankSwiperSlider();
        zankSlickSlider();
        zankVegasSlider();
        zankFixedSection();
        zankPopupTemplate();
        scrollToTopBtnClick();
        noneElementorPageFix();
        popupNewsletter();
        popupGdpr();
        zankCf7Form();
        zankJarallax();
        bannerBgVideo();
        zankLightbox();
        ninethemeCountDown();
        // WooCommerce
        zankGallery();
        masonryInit(winw);

        $('.zank-header-bottom-bar .zank-shop-filter-top-area').removeClass('zank-shop-filter-top-area');
        if ( $('.zank-header-content>div').length == 3 ) {
            $('div.header-top-side').sameSize(true);
        }

        // masonry
        var masonry = $('.zank-masonry-container');
        if ( masonry.length ) {
            //set the container that Masonry will be inside of in a var
            var container = document.querySelector('.zank-masonry-container');
            //create empty var msnry
            var msnry;
            // initialize Masonry after all images have loaded
            imagesLoaded( container, function() {
               msnry = new Masonry( container, {
                   itemSelector: '.zank-masonry-container>div'
               });
            });
        }

        var block_check = $('.nt-single-has-block');
        if ( block_check.length ) {
            $( ".nt-zank-content ul" ).addClass( "nt-zank-content-list" );
            $( ".nt-zank-content ol" ).addClass( "nt-zank-content-number-list" );
        }
        $( ".zank-post-content-wrapper>*:last-child" ).addClass( "zank-last-child" );


        // add class for bootstrap table
        $( ".menu-item-has-shortcode" ).parent().parent().addClass( "menu-item-has-shortcode-parent" );
        $( ".nt-zank-content table, #wp-calendar" ).addClass( "table table-striped" );
        $( ".woocommerce-order-received .nt-zank-content table" ).removeClass( "table table-striped" );
        // CF7 remove error message
        $('.wpcf7-response-output').ajaxComplete(function(){
            window.setTimeout(function(){
                $('.wpcf7-response-output').addClass('display-none');
            }, 4000); //<-- Delay in milliseconds
            window.setTimeout(function(){
                $('.wpcf7-response-output').removeClass('wpcf7-validation-errors display-none');
                $('.wpcf7-response-output').removeAttr('style');
            }, 4500); //<-- Delay in milliseconds
        });


        if ( typeof elementorFrontend != 'undefined' ) {
            var deviceMode = elementorFrontend.getCurrentDeviceMode();

            $('[data-bg]').each( function(index, el) {
                var $this = $(el);
                var elBg  = $this.data('bg');

                if ( typeof elBg != 'undefined' ) {
                    var desktop = elBg;

                    var widescreen   = typeof elBg[deviceMode] != 'undefined' ? elBg[deviceMode] : desktop;
                    var laptop       = typeof elBg[deviceMode] != 'undefined' ? elBg[deviceMode] : desktop;
                    var tablet_extra = typeof elBg[deviceMode] != 'undefined' ? elBg[deviceMode] : laptop;
                    var tablet       = typeof elBg[deviceMode] != 'undefined' ? elBg[deviceMode] : tablet_extra;
                    var mobile_extra = typeof elBg[deviceMode] != 'undefined' ? elBg[deviceMode] : tablet;
                    var mobile       = typeof elBg[deviceMode] != 'undefined' ? elBg[deviceMode] : mobile_extra;
                    var bgUrl        = mobile;

                    if ( bgUrl ) {
                        $this.css('background-image', 'url(' + bgUrl + ')' );
                    }
                }
            });
        }

    });

    // === window When resize === //
    win.resize( function() {
        winw = $(window).outerWidth();
        bodyResize(winw);
        topMainHeaderResize(winw);
        mobileHeaderResize(winw);
        headerSpacerHeight(winw);
        masonryInit(winw);
        if ( $('.zank-header-content>div').length == 3 ) {
            $('div.header-top-side').sameSize(true);
        }
        body.addClass("zank-on-resize");
        body.attr("data-zank-resize", winw);

        if ( typeof elementorFrontend != 'undefined' ) {
            var deviceMode = elementorFrontend.getCurrentDeviceMode();

            $('[data-bg-responsive]').each( function(index, el) {
                var $this = $(el);
                var elBg  = $this.data('bg-responsive');

                if ( typeof elBg != 'undefined' ) {
                    var desktop = $(el).data('bg');

                    var widescreen   = typeof elBg[deviceMode] != 'undefined' ? elBg[deviceMode] : desktop;
                    var laptop       = typeof elBg[deviceMode] != 'undefined' ? elBg[deviceMode] : desktop;
                    var tablet_extra = typeof elBg[deviceMode] != 'undefined' ? elBg[deviceMode] : laptop;
                    var tablet       = typeof elBg[deviceMode] != 'undefined' ? elBg[deviceMode] : tablet_extra;
                    var mobile_extra = typeof elBg[deviceMode] != 'undefined' ? elBg[deviceMode] : tablet;
                    var mobile       = typeof elBg[deviceMode] != 'undefined' ? elBg[deviceMode] : mobile_extra;
                    var bgUrl        = mobile;

                    if ( bgUrl ) {
                        $this.css('background-image', 'url(' + bgUrl + ')' );
                    }
                }
            });
        }
    });

    var headerH = $('.has-sticky-header .zank-header-default').height(),
        headerP = $('.has-sticky-header .zank-header-default').offset(),
        headerP = typeof headerP != 'undefined' ? headerP.top + 100 : 0,
        topbarH = $('.zank-header-top-area').height(),
        offSetH = headerH + topbarH;

    var headerMh = $('.has-sticky-header .zank-header-mobile-top').height(),
        headerMp = $('.has-sticky-header .zank-header-mobile-top').offset(),
        headerMp = typeof headerMp != 'undefined' ? headerMp.top + 100 : 0,
        topbarMh = $('.zank-header-top-area').height(),
        offSetMh = headerMh + topbarMh;

    // === window When scroll === //

    win.on("scroll", function () {
        var bodyScroll = win.scrollTop();

        if ( bodyScroll > ( headerP + 50 ) ) {
            $('.has-sticky-header .zank-header-default').addClass("sticky-ready");
        } else {
            $('.has-sticky-header .zank-header-default').removeClass("sticky-ready");
        }
        if ( bodyScroll > ( headerP + 100 ) ) {
            $('.has-sticky-header .zank-header-default').addClass("sticky-start");
        } else {
            $('.has-sticky-header .zank-header-default').removeClass("sticky-start");
        }

        if ( bodyScroll > ( headerMp + 80 ) ) {
            $('.has-sticky-header .zank-header-mobile-top').addClass("sticky-ready");
        } else {
            $('.has-sticky-header .zank-header-mobile-top').removeClass("sticky-ready");
        }
        if ( bodyScroll > ( headerMp + 160 ) ) {
            $('.has-sticky-header .zank-header-mobile-top').addClass("sticky-start");
        } else {
            $('.has-sticky-header .zank-header-mobile-top').removeClass("sticky-start");
        }

        if ( bodyScroll > 0 ) {
            body.addClass("scroll-start");
        } else {
            body.removeClass("scroll-start");
        }

        var filterArea = $('.zank-products-column .zank-before-loop.zank-shop-filter-top-area');

        if ( filterArea.length ) {
            var filterAreaPos = filterArea.offset(),
                topoffset = $('.zank-header-bottom-bar').hasClass('zank-elementor-template') ? 10 : filterAreaPos.top-62;
            if ( bodyScroll > topoffset ) {
                $('.zank-header-bottom-bar').addClass('sticky-filter-active');
            } else {
                $('.zank-header-bottom-bar').removeClass('sticky-filter-active');
            }
        }

        scrollToTopBtnHide();

    });

    // === window When Loading === //
    win.on("load", function () {
        var bodyScroll = win.scrollTop();

        if ( bodyScroll > 10 ) {
            body.addClass("scroll-start");
            $('.has-sticky-header .zank-header-default').addClass("sticky-start");
        } else {
            body.removeClass("scroll-start");
            $('.has-sticky-header .zank-header-default').removeClass("sticky-start");
        }

        if ( $(".preloader").length || $("#nt-preloader").length ) {
            $('.preloader,#nt-preloader').fadeOut(1000);
        }

        body.addClass("page-loaded");

    });

    win.on('orientationchange', function(event) {
        body.addClass("zank-orientation-changed");

        win.height() > win.width() ? body.removeClass("zank-portrait").addClass("zank-landscape") : body.removeClass("zank-landscape").addClass("zank-portrait");

    });

})(window, document, jQuery);
