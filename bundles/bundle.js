(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var fullpage = require('fullpage.js');

$(document).ready(function () {
    var sectionsLength = $('.section').length;
    
    $('#fullpage').fullpage({
        menu: '#menu',
        paddingTop: 60, // this value should be the same as the header's height (60px).
        afterLoad: function (anchorLink, index) {
            switch (index) {
                case 1: 
                    $('#btn-next').show();
                    break;
                
                case 2:
                    $('#btn-next').show();
                    break;
                    
                case 3:
                    $('#btn-next').hide();
                    break;
            }
        }
    });
    
    $('#btn-next').on('click', function () {
        $.fn.fullpage.moveSectionDown();
    });
});
},{"fullpage.js":2,"jquery":4}],2:[function(require,module,exports){
/*!
 * fullPage 2.7.9
 * https://github.com/alvarotrigo/fullPage.js
 * @license MIT licensed
 *
 * Copyright (C) 2015 alvarotrigo.com - A project by Alvaro Trigo
 */
(function(global, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function($) {
          return factory($, global, global.document, global.Math);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'), global, global.document, global.Math);
    } else {
        factory(jQuery, global, global.document, global.Math);
    }
})(typeof window !== 'undefined' ? window : this, function($, window, document, Math, undefined) {
    'use strict';

    // keeping central set of classnames and selectors
    var WRAPPER =               'fullpage-wrapper';
    var WRAPPER_SEL =           '.' + WRAPPER;

    // slimscroll
    var SCROLLABLE =            'fp-scrollable';
    var SCROLLABLE_SEL =        '.' + SCROLLABLE;
    var SLIMSCROLL_BAR_SEL =    '.slimScrollBar';
    var SLIMSCROLL_RAIL_SEL =   '.slimScrollRail';

    // util
    var RESPONSIVE =            'fp-responsive';
    var NO_TRANSITION =         'fp-notransition';
    var DESTROYED =             'fp-destroyed';
    var ENABLED =               'fp-enabled';
    var VIEWING_PREFIX =        'fp-viewing';
    var ACTIVE =                'active';
    var ACTIVE_SEL =            '.' + ACTIVE;
    var COMPLETELY =            'fp-completely';
    var COMPLETELY_SEL =        '.' + COMPLETELY;

    // section
    var SECTION_DEFAULT_SEL =   '.section';
    var SECTION =               'fp-section';
    var SECTION_SEL =           '.' + SECTION;
    var SECTION_ACTIVE_SEL =    SECTION_SEL + ACTIVE_SEL;
    var SECTION_FIRST_SEL =     SECTION_SEL + ':first';
    var SECTION_LAST_SEL =      SECTION_SEL + ':last';
    var TABLE_CELL =            'fp-tableCell';
    var TABLE_CELL_SEL =        '.' + TABLE_CELL;
    var AUTO_HEIGHT =           'fp-auto-height';
    var AUTO_HEIGHT_SEL =       '.fp-auto-height';
    var NORMAL_SCROLL =         'fp-normal-scroll';
    var NORMAL_SCROLL_SEL =     '.fp-normal-scroll';

    // section nav
    var SECTION_NAV =           'fp-nav';
    var SECTION_NAV_SEL =       '#' + SECTION_NAV;
    var SECTION_NAV_TOOLTIP =   'fp-tooltip';
    var SECTION_NAV_TOOLTIP_SEL='.'+SECTION_NAV_TOOLTIP;
    var SHOW_ACTIVE_TOOLTIP =   'fp-show-active';

    // slide
    var SLIDE_DEFAULT_SEL =     '.slide';
    var SLIDE =                 'fp-slide';
    var SLIDE_SEL =             '.' + SLIDE;
    var SLIDE_ACTIVE_SEL =      SLIDE_SEL + ACTIVE_SEL;
    var SLIDES_WRAPPER =        'fp-slides';
    var SLIDES_WRAPPER_SEL =    '.' + SLIDES_WRAPPER;
    var SLIDES_CONTAINER =      'fp-slidesContainer';
    var SLIDES_CONTAINER_SEL =  '.' + SLIDES_CONTAINER;
    var TABLE =                 'fp-table';

    // slide nav
    var SLIDES_NAV =            'fp-slidesNav';
    var SLIDES_NAV_SEL =        '.' + SLIDES_NAV;
    var SLIDES_NAV_LINK_SEL =   SLIDES_NAV_SEL + ' a';
    var SLIDES_ARROW =          'fp-controlArrow';
    var SLIDES_ARROW_SEL =      '.' + SLIDES_ARROW;
    var SLIDES_PREV =           'fp-prev';
    var SLIDES_PREV_SEL =       '.' + SLIDES_PREV;
    var SLIDES_ARROW_PREV =     SLIDES_ARROW + ' ' + SLIDES_PREV;
    var SLIDES_ARROW_PREV_SEL = SLIDES_ARROW_SEL + SLIDES_PREV_SEL;
    var SLIDES_NEXT =           'fp-next';
    var SLIDES_NEXT_SEL =       '.' + SLIDES_NEXT;
    var SLIDES_ARROW_NEXT =     SLIDES_ARROW + ' ' + SLIDES_NEXT;
    var SLIDES_ARROW_NEXT_SEL = SLIDES_ARROW_SEL + SLIDES_NEXT_SEL;

    var $window = $(window);
    var $document = $(document);

    var defaultScrollHandler;

    $.fn.fullpage = function(options) {
        //only once my friend!
        if($('html').hasClass(ENABLED)){ displayWarnings(); return };

        // common jQuery objects
        var $htmlBody = $('html, body');
        var $body = $('body');

        var FP = $.fn.fullpage;
        // Create some defaults, extending them with any options that were provided
        options = $.extend({
            //navigation
            menu: false,
            anchors:[],
            lockAnchors: false,
            navigation: false,
            navigationPosition: 'right',
            navigationTooltips: [],
            showActiveTooltip: false,
            slidesNavigation: false,
            slidesNavPosition: 'bottom',
            scrollBar: false,
            hybrid: false,

            //scrolling
            css3: true,
            scrollingSpeed: 700,
            autoScrolling: true,
            fitToSection: true,
            fitToSectionDelay: 1000,
            easing: 'easeInOutCubic',
            easingcss3: 'ease',
            loopBottom: false,
            loopTop: false,
            loopHorizontal: true,
            continuousVertical: false,
            normalScrollElements: null,
            scrollOverflow: false,
            scrollOverflowHandler: defaultScrollHandler,
            touchSensitivity: 5,
            normalScrollElementTouchThreshold: 5,

            //Accessibility
            keyboardScrolling: true,
            animateAnchor: true,
            recordHistory: true,

            //design
            controlArrows: true,
            controlArrowColor: '#fff',
            verticalCentered: true,
            resize: false,
            sectionsColor : [],
            paddingTop: 0,
            paddingBottom: 0,
            fixedElements: null,
            responsive: 0, //backwards compabitility with responsiveWiddth
            responsiveWidth: 0,
            responsiveHeight: 0,

            //Custom selectors
            sectionSelector: SECTION_DEFAULT_SEL,
            slideSelector: SLIDE_DEFAULT_SEL,


            //events
            afterLoad: null,
            onLeave: null,
            afterRender: null,
            afterResize: null,
            afterReBuild: null,
            afterSlideLoad: null,
            onSlideLeave: null
        }, options);

        displayWarnings();

        //easeInOutCubic animation included in the plugin
        $.extend($.easing,{ easeInOutCubic: function (x, t, b, c, d) {if ((t/=d/2) < 1) return c/2*t*t*t + b;return c/2*((t-=2)*t*t + 2) + b;}});

        /**
        * Sets the autoScroll option.
        * It changes the scroll bar visibility and the history of the site as a result.
        */
        FP.setAutoScrolling = function(value, type){
            setVariableState('autoScrolling', value, type);

            var element = $(SECTION_ACTIVE_SEL);

            if(options.autoScrolling && !options.scrollBar){
                $htmlBody.css({
                    'overflow' : 'hidden',
                    'height' : '100%'
                });

                FP.setRecordHistory(originals.recordHistory, 'internal');

                //for IE touch devices
                container.css({
                    '-ms-touch-action': 'none',
                    'touch-action': 'none'
                });

                if(element.length){
                    //moving the container up
                    silentScroll(element.position().top);
                }

            }else{
                $htmlBody.css({
                    'overflow' : 'visible',
                    'height' : 'initial'
                });

                FP.setRecordHistory(false, 'internal');

                //for IE touch devices
                container.css({
                    '-ms-touch-action': '',
                    'touch-action': ''
                });

                silentScroll(0);

                //scrolling the page to the section with no animation
                if (element.length) {
                    $htmlBody.scrollTop(element.position().top);
                }
            }
        };

        /**
        * Defines wheter to record the history for each hash change in the URL.
        */
        FP.setRecordHistory = function(value, type){
            setVariableState('recordHistory', value, type);
        };

        /**
        * Defines the scrolling speed
        */
        FP.setScrollingSpeed = function(value, type){
            setVariableState('scrollingSpeed', value, type);
        };

        /**
        * Sets fitToSection
        */
        FP.setFitToSection = function(value, type){
            setVariableState('fitToSection', value, type);
        };

        /**
        * Sets lockAnchors
        */
        FP.setLockAnchors = function(value){
            options.lockAnchors = value;
        };

        /**
        * Adds or remove the possiblity of scrolling through sections by using the mouse wheel or the trackpad.
        */
        FP.setMouseWheelScrolling = function (value){
            if(value){
                addMouseWheelHandler();
                addMiddleWheelHandler();
            }else{
                removeMouseWheelHandler();
                removeMiddleWheelHandler();
            }
        };

        /**
        * Adds or remove the possiblity of scrolling through sections by using the mouse wheel/trackpad or touch gestures.
        * Optionally a second parameter can be used to specify the direction for which the action will be applied.
        *
        * @param directions string containing the direction or directions separated by comma.
        */
        FP.setAllowScrolling = function (value, directions){
            if(typeof directions !== 'undefined'){
                directions = directions.replace(/ /g,'').split(',');

                $.each(directions, function (index, direction){
                    setIsScrollAllowed(value, direction, 'm');
                });
            }
            else if(value){
                FP.setMouseWheelScrolling(true);
                addTouchHandler();
            }else{
                FP.setMouseWheelScrolling(false);
                removeTouchHandler();
            }
        };

        /**
        * Adds or remove the possiblity of scrolling through sections by using the keyboard arrow keys
        */
        FP.setKeyboardScrolling = function (value, directions){
            if(typeof directions !== 'undefined'){
                directions = directions.replace(/ /g,'').split(',');

                $.each(directions, function (index, direction){
                    setIsScrollAllowed(value, direction, 'k');
                });
            }else{
                options.keyboardScrolling = value;
            }
        };

        /**
        * Moves the page up one section.
        */
        FP.moveSectionUp = function(){
            var prev = $(SECTION_ACTIVE_SEL).prev(SECTION_SEL);

            //looping to the bottom if there's no more sections above
            if (!prev.length && (options.loopTop || options.continuousVertical)) {
                prev = $(SECTION_SEL).last();
            }

            if (prev.length) {
                scrollPage(prev, null, true);
            }
        };

        /**
        * Moves the page down one section.
        */
        FP.moveSectionDown = function (){
            var next = $(SECTION_ACTIVE_SEL).next(SECTION_SEL);

            //looping to the top if there's no more sections below
            if(!next.length &&
                (options.loopBottom || options.continuousVertical)){
                next = $(SECTION_SEL).first();
            }

            if(next.length){
                scrollPage(next, null, false);
            }
        };

        /**
        * Moves the page to the given section and slide with no animation.
        * Anchors or index positions can be used as params.
        */
        FP.silentMoveTo = function(sectionAnchor, slideAnchor){
            FP.setScrollingSpeed (0, 'internal');
            FP.moveTo(sectionAnchor, slideAnchor)
            FP.setScrollingSpeed (originals.scrollingSpeed, 'internal');
        };

        /**
        * Moves the page to the given section and slide.
        * Anchors or index positions can be used as params.
        */
        FP.moveTo = function (sectionAnchor, slideAnchor){
            var destiny = getSectionByAnchor(sectionAnchor);

            if (typeof slideAnchor !== 'undefined'){
                scrollPageAndSlide(sectionAnchor, slideAnchor);
            }else if(destiny.length > 0){
                scrollPage(destiny);
            }
        };

        /**
        * Slides right the slider of the active section.
        * Optional `section` param.
        */
        FP.moveSlideRight = function(section){
            moveSlide('next', section);
        };

        /**
        * Slides left the slider of the active section.
        * Optional `section` param.
        */
        FP.moveSlideLeft = function(section){
            moveSlide('prev', section);
        };

        /**
         * When resizing is finished, we adjust the slides sizes and positions
         */
        FP.reBuild = function(resizing){
            if(container.hasClass(DESTROYED)){ return; }  //nothing to do if the plugin was destroyed

            isResizing = true;

            var windowsWidth = $window.outerWidth();
            windowsHeight = $window.height();  //updating global var

            //text resizing
            if (options.resize) {
                resizeMe(windowsHeight, windowsWidth);
            }

            $(SECTION_SEL).each(function(){
                var slidesWrap = $(this).find(SLIDES_WRAPPER_SEL);
                var slides = $(this).find(SLIDE_SEL);

                //adjusting the height of the table-cell for IE and Firefox
                if(options.verticalCentered){
                    $(this).find(TABLE_CELL_SEL).css('height', getTableHeight($(this)) + 'px');
                }

                $(this).css('height', windowsHeight + 'px');

                //resizing the scrolling divs
                if(options.scrollOverflow){
                    if(slides.length){
                        slides.each(function(){
                            createSlimScrolling($(this));
                        });
                    }else{
                        createSlimScrolling($(this));
                    }
                }

                //adjusting the position fo the FULL WIDTH slides...
                if (slides.length > 1) {
                    landscapeScroll(slidesWrap, slidesWrap.find(SLIDE_ACTIVE_SEL));
                }
            });

            var activeSection = $(SECTION_ACTIVE_SEL);
            var sectionIndex = activeSection.index(SECTION_SEL);

            //isn't it the first section?
            if(sectionIndex){
                //adjusting the position for the current section
                FP.silentMoveTo(sectionIndex + 1);
            }

            isResizing = false;
            $.isFunction( options.afterResize ) && resizing && options.afterResize.call(container);
            $.isFunction( options.afterReBuild ) && !resizing && options.afterReBuild.call(container);
        };

        /**
        * Turns fullPage.js to normal scrolling mode when the viewport `width` or `height`
        * are smaller than the set limit values.
        */
        FP.setResponsive = function (active){
            var isResponsive = $body.hasClass(RESPONSIVE);

            if(active){
                if(!isResponsive){
                    FP.setAutoScrolling(false, 'internal');
                    FP.setFitToSection(false, 'internal');
                    $(SECTION_NAV_SEL).hide();
                    $body.addClass(RESPONSIVE);
                }
            }
            else if(isResponsive){
                FP.setAutoScrolling(originals.autoScrolling, 'internal');
                FP.setFitToSection(originals.autoScrolling, 'internal');
                $(SECTION_NAV_SEL).show();
                $body.removeClass(RESPONSIVE);
            }
        }

        //flag to avoid very fast sliding for landscape sliders
        var slideMoving = false;

        var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/);
        var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints));
        var container = $(this);
        var windowsHeight = $window.height();
        var isResizing = false;
        var isWindowFocused = true;
        var lastScrolledDestiny;
        var lastScrolledSlide;
        var canScroll = true;
        var scrollings = [];
        var nav;
        var controlPressed;
        var isScrollAllowed = {};
        isScrollAllowed.m = {  'up':true, 'down':true, 'left':true, 'right':true };
        isScrollAllowed.k = $.extend(true,{}, isScrollAllowed.m);
        var originals = $.extend(true, {}, options); //deep copy

        //timeouts
        var resizeId;
        var afterSectionLoadsId;
        var afterSlideLoadsId;
        var scrollId;
        var scrollId2;
        var keydownId;

        if($(this).length){
            init();
            bindEvents();
        }

        function init(){
            //if css3 is not supported, it will use jQuery animations
            if(options.css3){
                options.css3 = support3d();
            }

            options.scrollBar = options.scrollBar || options.hybrid;


            setOptionsFromDOM();

            prepareDom();
            FP.setAllowScrolling(true);

            FP.setAutoScrolling(options.autoScrolling, 'internal');

            //the starting point is a slide?
            var activeSlide = $(SECTION_ACTIVE_SEL).find(SLIDE_ACTIVE_SEL);

            //the active section isn't the first one? Is not the first slide of the first section? Then we load that section/slide by default.
            if( activeSlide.length &&  ($(SECTION_ACTIVE_SEL).index(SECTION_SEL) !== 0 || ($(SECTION_ACTIVE_SEL).index(SECTION_SEL) === 0 && activeSlide.index() !== 0))){
                silentLandscapeScroll(activeSlide);
            }

            responsive();

            //setting the class for the body element
            setBodyClass();

            $window.on('load', function() {
                scrollToAnchor();
            });
        }

        function bindEvents(){
            $window
                //when scrolling...
                .on('scroll', scrollHandler)

                //detecting any change on the URL to scroll to the given anchor link
                //(a way to detect back history button as we play with the hashes on the URL)
                .on('hashchange', hashChangeHandler)

                //when opening a new tab (ctrl + t), `control` won't be pressed when comming back.
                .blur(blurHandler)

                //when resizing the site, we adjust the heights of the sections, slimScroll...
                .resize(resizeHandler);

            $document
                //Sliding with arrow keys, both, vertical and horizontal
                .keydown(keydownHandler)

                //to prevent scrolling while zooming
                .keyup(keyUpHandler)

                //Scrolls to the section when clicking the navigation bullet
                .on('click touchstart', SECTION_NAV_SEL + ' a', sectionBulletHandler)

                //Scrolls the slider to the given slide destination for the given section
                .on('click touchstart', SLIDES_NAV_LINK_SEL, slideBulletHandler)

                .on('click', SECTION_NAV_TOOLTIP_SEL, tooltipTextHandler);

            //Scrolling horizontally when clicking on the slider controls.
            $(SECTION_SEL).on('click touchstart', SLIDES_ARROW_SEL, slideArrowHandler);

            /**
            * Applying normalScroll elements.
            * Ignoring the scrolls over the specified selectors.
            */
            if(options.normalScrollElements){
                $document.on('mouseenter', options.normalScrollElements, function () {
                    FP.setMouseWheelScrolling(false);
                });

                $document.on('mouseleave', options.normalScrollElements, function(){
                    FP.setMouseWheelScrolling(true);
                });
            }
        }

        /**
        * Setting options from DOM elements if they are not provided.
        */
        function setOptionsFromDOM(){
            //no anchors option? Checking for them in the DOM attributes
            if(!options.anchors.length){
                options.anchors = $(options.sectionSelector + '[data-anchor]').map(function(){
                    return $(this).data('anchor').toString();
                }).get();
            }

            //no tooltipos option? Checking for them in the DOM attributes
            if(!options.navigationTooltips.length){
                options.navigationTooltips = $(options.sectionSelector + '[data-tooltip]').map(function(){
                    return $(this).data('tooltip').toString();
                }).get();
            }
        }

        /**
        * Works over the DOM structure to set it up for the current fullpage optionss.
        */
        function prepareDom(){
            container.css({
                'height': '100%',
                'position': 'relative'
            });

            //adding a class to recognize the container internally in the code
            container.addClass(WRAPPER);
            $('html').addClass(ENABLED);

            //due to https://github.com/alvarotrigo/fullPage.js/issues/1502
            windowsHeight = $window.height();

            container.removeClass(DESTROYED); //in case it was destroyed before initilizing it again

            addInternalSelectors();

             //styling the sections / slides / menu
            $(SECTION_SEL).each(function(index){
                var section = $(this);
                var slides = section.find(SLIDE_SEL);
                var numSlides = slides.length;

                styleSection(section, index);
                styleMenu(section, index);

                // if there's any slide
                if (numSlides > 0) {
                    styleSlides(section, slides, numSlides);
                }else{
                    if(options.verticalCentered){
                        addTableClass(section);
                    }
                }
            });

            //fixed elements need to be moved out of the plugin container due to problems with CSS3.
            if(options.fixedElements && options.css3){
                $(options.fixedElements).appendTo($body);
            }

            //vertical centered of the navigation + active bullet
            if(options.navigation){
                addVerticalNavigation();
            }

            if(options.scrollOverflow){
                if(document.readyState === 'complete'){
                    createSlimScrollingHandler();
                }
                //after DOM and images are loaded
                $window.on('load', createSlimScrollingHandler);
            }else{
                afterRenderActions();
            }
        }

        /**
        * Styles the horizontal slides for a section.
        */
        function styleSlides(section, slides, numSlides){
            var sliderWidth = numSlides * 100;
            var slideWidth = 100 / numSlides;

            slides.wrapAll('<div class="' + SLIDES_CONTAINER + '" />');
            slides.parent().wrap('<div class="' + SLIDES_WRAPPER + '" />');

            section.find(SLIDES_CONTAINER_SEL).css('width', sliderWidth + '%');

            if(numSlides > 1){
                if(options.controlArrows){
                    createSlideArrows(section);
                }

                if(options.slidesNavigation){
                    addSlidesNavigation(section, numSlides);
                }
            }

            slides.each(function(index) {
                $(this).css('width', slideWidth + '%');

                if(options.verticalCentered){
                    addTableClass($(this));
                }
            });

            var startingSlide = section.find(SLIDE_ACTIVE_SEL);

            //if the slide won't be an starting point, the default will be the first one
            //the active section isn't the first one? Is not the first slide of the first section? Then we load that section/slide by default.
            if( startingSlide.length &&  ($(SECTION_ACTIVE_SEL).index(SECTION_SEL) !== 0 || ($(SECTION_ACTIVE_SEL).index(SECTION_SEL) === 0 && startingSlide.index() !== 0))){
                silentLandscapeScroll(startingSlide);
            }else{
                slides.eq(0).addClass(ACTIVE);
            }
        }

        /**
        * Styling vertical sections
        */
        function styleSection(section, index){
            //if no active section is defined, the 1st one will be the default one
            if(!index && $(SECTION_ACTIVE_SEL).length === 0) {
                section.addClass(ACTIVE);
            }

            section.css('height', windowsHeight + 'px');

            if(options.paddingTop){
                section.css('padding-top', options.paddingTop);
            }

            if(options.paddingBottom){
                section.css('padding-bottom', options.paddingBottom);
            }

            if (typeof options.sectionsColor[index] !==  'undefined') {
                section.css('background-color', options.sectionsColor[index]);
            }

            if (typeof options.anchors[index] !== 'undefined') {
                section.attr('data-anchor', options.anchors[index]);
            }
        }

        /**
        * Sets the data-anchor attributes to the menu elements and activates the current one.
        */
        function styleMenu(section, index){
            if (typeof options.anchors[index] !== 'undefined') {
                //activating the menu / nav element on load
                if(section.hasClass(ACTIVE)){
                    activateMenuAndNav(options.anchors[index], index);
                }
            }

            //moving the menu outside the main container if it is inside (avoid problems with fixed positions when using CSS3 tranforms)
            if(options.menu && options.css3 && $(options.menu).closest(WRAPPER_SEL).length){
                $(options.menu).appendTo($body);
            }
        }

        /**
        * Adds internal classes to be able to provide customizable selectors
        * keeping the link with the style sheet.
        */
        function addInternalSelectors(){
            //adding internal class names to void problem with common ones
            $(options.sectionSelector).each(function(){
                $(this).addClass(SECTION);
            });
            $(options.slideSelector).each(function(){
                $(this).addClass(SLIDE);
            });
        }

        /**
        * Creates the control arrows for the given section
        */
        function createSlideArrows(section){
            section.find(SLIDES_WRAPPER_SEL).after('<div class="' + SLIDES_ARROW_PREV + '"></div><div class="' + SLIDES_ARROW_NEXT + '"></div>');

            if(options.controlArrowColor!='#fff'){
                section.find(SLIDES_ARROW_NEXT_SEL).css('border-color', 'transparent transparent transparent '+options.controlArrowColor);
                section.find(SLIDES_ARROW_PREV_SEL).css('border-color', 'transparent '+ options.controlArrowColor + ' transparent transparent');
            }

            if(!options.loopHorizontal){
                section.find(SLIDES_ARROW_PREV_SEL).hide();
            }
        }

        /**
        * Creates a vertical navigation bar.
        */
        function addVerticalNavigation(){
            $body.append('<div id="' + SECTION_NAV + '"><ul></ul></div>');
            var nav = $(SECTION_NAV_SEL);

            nav.addClass(function() {
                return options.showActiveTooltip ? SHOW_ACTIVE_TOOLTIP + ' ' + options.navigationPosition : options.navigationPosition;
            });

            for (var i = 0; i < $(SECTION_SEL).length; i++) {
                var link = '';
                if (options.anchors.length) {
                    link = options.anchors[i];
                }

                var li = '<li><a href="#' + link + '"><span></span></a>';

                // Only add tooltip if needed (defined by user)
                var tooltip = options.navigationTooltips[i];

                if (typeof tooltip !== 'undefined' && tooltip !== '') {
                    li += '<div class="' + SECTION_NAV_TOOLTIP + ' ' + options.navigationPosition + '">' + tooltip + '</div>';
                }

                li += '</li>';

                nav.find('ul').append(li);
            }

            //centering it vertically
            $(SECTION_NAV_SEL).css('margin-top', '-' + ($(SECTION_NAV_SEL).height()/2) + 'px');

            //activating the current active section
            $(SECTION_NAV_SEL).find('li').eq($(SECTION_ACTIVE_SEL).index(SECTION_SEL)).find('a').addClass(ACTIVE);
        }

        /**
        * Creates the slim scroll scrollbar for the sections and slides inside them.
        */
        function createSlimScrollingHandler(){
            $(SECTION_SEL).each(function(){
                var slides = $(this).find(SLIDE_SEL);

                if(slides.length){
                    slides.each(function(){
                        createSlimScrolling($(this));
                    });
                }else{
                    createSlimScrolling($(this));
                }

            });
            afterRenderActions();
        }

        /**
        * Actions and callbacks to fire afterRender
        */
        function afterRenderActions(){
            var section = $(SECTION_ACTIVE_SEL);

            section.addClass(COMPLETELY);

            if(options.scrollOverflowHandler.afterRender){
                options.scrollOverflowHandler.afterRender(section);
            }
            lazyLoad(section);
            playMedia(section);

            $.isFunction( options.afterLoad ) && options.afterLoad.call(section, section.data('anchor'), (section.index(SECTION_SEL) + 1));
            $.isFunction( options.afterRender ) && options.afterRender.call(container);
        }


        var isScrolling = false;
        var lastScroll = 0;

        //when scrolling...
        function scrollHandler(){
            var currentSection;

            if(!options.autoScrolling || options.scrollBar){
                var currentScroll = $window.scrollTop();
                var scrollDirection = getScrollDirection(currentScroll);
                var visibleSectionIndex = 0;
                var screen_mid = currentScroll + ($window.height() / 2.0);

                //taking the section which is showing more content in the viewport
                var sections =  document.querySelectorAll(SECTION_SEL);
                for (var i = 0; i < sections.length; ++i) {
                    var section = sections[i];

                    // Pick the the last section which passes the middle line of the screen.
                    if (section.offsetTop <= screen_mid)
                    {
                        visibleSectionIndex = i;
                    }
                }

                if(isCompletelyInViewPort(scrollDirection)){
                    if(!$(SECTION_ACTIVE_SEL).hasClass(COMPLETELY)){
                        $(SECTION_ACTIVE_SEL).addClass(COMPLETELY).siblings().removeClass(COMPLETELY);
                    }
                }

                //geting the last one, the current one on the screen
                currentSection = $(sections).eq(visibleSectionIndex);

                //setting the visible section as active when manually scrolling
                //executing only once the first time we reach the section
                if(!currentSection.hasClass(ACTIVE)){
                    isScrolling = true;
                    var leavingSection = $(SECTION_ACTIVE_SEL);
                    var leavingSectionIndex = leavingSection.index(SECTION_SEL) + 1;
                    var yMovement = getYmovement(currentSection);
                    var anchorLink  = currentSection.data('anchor');
                    var sectionIndex = currentSection.index(SECTION_SEL) + 1;
                    var activeSlide = currentSection.find(SLIDE_ACTIVE_SEL);

                    if(activeSlide.length){
                        var slideAnchorLink = activeSlide.data('anchor');
                        var slideIndex = activeSlide.index();
                    }

                    if(canScroll){
                        currentSection.addClass(ACTIVE).siblings().removeClass(ACTIVE);

                        $.isFunction( options.onLeave ) && options.onLeave.call( leavingSection, leavingSectionIndex, sectionIndex, yMovement);

                        $.isFunction( options.afterLoad ) && options.afterLoad.call( currentSection, anchorLink, sectionIndex);
                        lazyLoad(currentSection);

                        activateMenuAndNav(anchorLink, sectionIndex - 1);

                        if(options.anchors.length){
                            //needed to enter in hashChange event when using the menu with anchor links
                            lastScrolledDestiny = anchorLink;

                            setState(slideIndex, slideAnchorLink, anchorLink, sectionIndex);
                        }
                    }

                    //small timeout in order to avoid entering in hashChange event when scrolling is not finished yet
                    clearTimeout(scrollId);
                    scrollId = setTimeout(function(){
                        isScrolling = false;
                    }, 100);
                }

                if(options.fitToSection){
                    //for the auto adjust of the viewport to fit a whole section
                    clearTimeout(scrollId2);

                    scrollId2 = setTimeout(function(){
                        //checking fitToSection again in case it was set to false before the timeout delay
                        if(canScroll && options.fitToSection){
                            //allows to scroll to an active section and
                            //if the section is already active, we prevent firing callbacks
                            if($(SECTION_ACTIVE_SEL).is(currentSection)){
                                isResizing = true;
                            }
                            scrollPage($(SECTION_ACTIVE_SEL));

                            isResizing = false;
                        }
                    }, options.fitToSectionDelay);
                }
            }
        }

        /**
        * Determines whether the active section has seen in its whole or not.
        */
        function isCompletelyInViewPort(movement){
            var top = $(SECTION_ACTIVE_SEL).position().top;
            var bottom = top + $window.height();

            if(movement == 'up'){
                return bottom >= ($window.scrollTop() + $window.height());
            }
            return top <= $window.scrollTop();
        }

        /**
        * Gets the directon of the the scrolling fired by the scroll event.
        */
        function getScrollDirection(currentScroll){
            var direction = currentScroll > lastScroll ? 'down' : 'up';

            lastScroll = currentScroll;

            return direction;
        }

        /**
        * Determines the way of scrolling up or down:
        * by 'automatically' scrolling a section or by using the default and normal scrolling.
        */
        function scrolling(type, scrollable){
            if (!isScrollAllowed.m[type]){
                return;
            }
            var check, scrollSection;

            if(type == 'down'){
                check = 'bottom';
                scrollSection = FP.moveSectionDown;
            }else{
                check = 'top';
                scrollSection = FP.moveSectionUp;
            }

            if(scrollable.length > 0 ){
                //is the scrollbar at the start/end of the scroll?
                if(options.scrollOverflowHandler.isScrolled(check, scrollable)){
                    scrollSection();
                }else{
                    return true;
                }
            }else{
                // moved up/down
                scrollSection();
            }
        }


        var touchStartY = 0;
        var touchStartX = 0;
        var touchEndY = 0;
        var touchEndX = 0;

        /* Detecting touch events

        * As we are changing the top property of the page on scrolling, we can not use the traditional way to detect it.
        * This way, the touchstart and the touch moves shows an small difference between them which is the
        * used one to determine the direction.
        */
        function touchMoveHandler(event){
            var e = event.originalEvent;

            // additional: if one of the normalScrollElements isn't within options.normalScrollElementTouchThreshold hops up the DOM chain
            if (!checkParentForNormalScrollElement(event.target) && isReallyTouch(e) ) {

                if(options.autoScrolling){
                    //preventing the easing on iOS devices
                    event.preventDefault();
                }

                var activeSection = $(SECTION_ACTIVE_SEL);
                var scrollable = options.scrollOverflowHandler.scrollable(activeSection);

                if (canScroll && !slideMoving) { //if theres any #
                    var touchEvents = getEventsPage(e);

                    touchEndY = touchEvents.y;
                    touchEndX = touchEvents.x;

                    //if movement in the X axys is greater than in the Y and the currect section has slides...
                    if (activeSection.find(SLIDES_WRAPPER_SEL).length && Math.abs(touchStartX - touchEndX) > (Math.abs(touchStartY - touchEndY))) {

                        //is the movement greater than the minimum resistance to scroll?
                        if (Math.abs(touchStartX - touchEndX) > ($window.outerWidth() / 100 * options.touchSensitivity)) {
                            if (touchStartX > touchEndX) {
                                if(isScrollAllowed.m.right){
                                    FP.moveSlideRight(); //next
                                }
                            } else {
                                if(isScrollAllowed.m.left){
                                    FP.moveSlideLeft(); //prev
                                }
                            }
                        }
                    }

                    //vertical scrolling (only when autoScrolling is enabled)
                    else if(options.autoScrolling){

                        //is the movement greater than the minimum resistance to scroll?
                        if (Math.abs(touchStartY - touchEndY) > ($window.height() / 100 * options.touchSensitivity)) {
                            if (touchStartY > touchEndY) {
                                scrolling('down', scrollable);
                            } else if (touchEndY > touchStartY) {
                                scrolling('up', scrollable);
                            }
                        }
                    }
                }
            }

        }

        /**
         * recursive function to loop up the parent nodes to check if one of them exists in options.normalScrollElements
         * Currently works well for iOS - Android might need some testing
         * @param  {Element} el  target element / jquery selector (in subsequent nodes)
         * @param  {int}     hop current hop compared to options.normalScrollElementTouchThreshold
         * @return {boolean} true if there is a match to options.normalScrollElements
         */
        function checkParentForNormalScrollElement (el, hop) {
            hop = hop || 0;
            var parent = $(el).parent();

            if (hop < options.normalScrollElementTouchThreshold &&
                parent.is(options.normalScrollElements) ) {
                return true;
            } else if (hop == options.normalScrollElementTouchThreshold) {
                return false;
            } else {
                return checkParentForNormalScrollElement(parent, ++hop);
            }
        }

        /**
        * As IE >= 10 fires both touch and mouse events when using a mouse in a touchscreen
        * this way we make sure that is really a touch event what IE is detecting.
        */
        function isReallyTouch(e){
            //if is not IE   ||  IE is detecting `touch` or `pen`
            return typeof e.pointerType === 'undefined' || e.pointerType != 'mouse';
        }

        /**
        * Handler for the touch start event.
        */
        function touchStartHandler(event){
            var e = event.originalEvent;

            //stopping the auto scroll to adjust to a section
            if(options.fitToSection){
                $htmlBody.stop();
            }

            if(isReallyTouch(e)){
                var touchEvents = getEventsPage(e);
                touchStartY = touchEvents.y;
                touchStartX = touchEvents.x;
            }
        }

        /**
        * Gets the average of the last `number` elements of the given array.
        */
        function getAverage(elements, number){
            var sum = 0;

            //taking `number` elements from the end to make the average, if there are not enought, 1
            var lastElements = elements.slice(Math.max(elements.length - number, 1));

            for(var i = 0; i < lastElements.length; i++){
                sum = sum + lastElements[i];
            }

            return Math.ceil(sum/number);
        }

        /**
         * Detecting mousewheel scrolling
         *
         * http://blogs.sitepointstatic.com/examples/tech/mouse-wheel/index.html
         * http://www.sitepoint.com/html5-javascript-mouse-wheel/
         */
        var prevTime = new Date().getTime();

        function MouseWheelHandler(e) {
            var curTime = new Date().getTime();
            var isNormalScroll = $(COMPLETELY_SEL).hasClass(NORMAL_SCROLL);

            //autoscrolling and not zooming?
            if(options.autoScrolling && !controlPressed && !isNormalScroll){
                // cross-browser wheel delta
                e = e || window.event;
                var value = e.wheelDelta || -e.deltaY || -e.detail;
                var delta = Math.max(-1, Math.min(1, value));

                var horizontalDetection = typeof e.wheelDeltaX !== 'undefined' || typeof e.deltaX !== 'undefined';
                var isScrollingVertically = (Math.abs(e.wheelDeltaX) < Math.abs(e.wheelDelta)) || (Math.abs(e.deltaX ) < Math.abs(e.deltaY) || !horizontalDetection);

                //Limiting the array to 150 (lets not waste memory!)
                if(scrollings.length > 149){
                    scrollings.shift();
                }

                //keeping record of the previous scrollings
                scrollings.push(Math.abs(value));

                //preventing to scroll the site on mouse wheel when scrollbar is present
                if(options.scrollBar){
                    e.preventDefault ? e.preventDefault() : e.returnValue = false;
                }

                var activeSection = $(SECTION_ACTIVE_SEL);
                var scrollable = options.scrollOverflowHandler.scrollable(activeSection);

                //time difference between the last scroll and the current one
                var timeDiff = curTime-prevTime;
                prevTime = curTime;

                //haven't they scrolled in a while?
                //(enough to be consider a different scrolling action to scroll another section)
                if(timeDiff > 200){
                    //emptying the array, we dont care about old scrollings for our averages
                    scrollings = [];
                }

                if(canScroll){
                    var averageEnd = getAverage(scrollings, 10);
                    var averageMiddle = getAverage(scrollings, 70);
                    var isAccelerating = averageEnd >= averageMiddle;

                    //to avoid double swipes...
                    if(isAccelerating && isScrollingVertically){
                        //scrolling down?
                        if (delta < 0) {
                            scrolling('down', scrollable);

                        //scrolling up?
                        }else {
                            scrolling('up', scrollable);
                        }
                    }
                }

                return false;
            }

            if(options.fitToSection){
                //stopping the auto scroll to adjust to a section
                $htmlBody.stop();
            }
        }

        /**
        * Slides a slider to the given direction.
        * Optional `section` param.
        */
        function moveSlide(direction, section){
            var activeSection = typeof section === 'undefined' ? $(SECTION_ACTIVE_SEL) : section;
            var slides = activeSection.find(SLIDES_WRAPPER_SEL);
            var numSlides = slides.find(SLIDE_SEL).length;

            // more than one slide needed and nothing should be sliding
            if (!slides.length || slideMoving || numSlides < 2) {
                return;
            }

            var currentSlide = slides.find(SLIDE_ACTIVE_SEL);
            var destiny = null;

            if(direction === 'prev'){
                destiny = currentSlide.prev(SLIDE_SEL);
            }else{
                destiny = currentSlide.next(SLIDE_SEL);
            }

            //isn't there a next slide in the secuence?
            if(!destiny.length){
                //respect loopHorizontal settin
                if (!options.loopHorizontal) return;

                if(direction === 'prev'){
                    destiny = currentSlide.siblings(':last');
                }else{
                    destiny = currentSlide.siblings(':first');
                }
            }

            slideMoving = true;

            landscapeScroll(slides, destiny);
        }

        /**
        * Maintains the active slides in the viewport
        * (Because he `scroll` animation might get lost with some actions, such as when using continuousVertical)
        */
        function keepSlidesPosition(){
            $(SLIDE_ACTIVE_SEL).each(function(){
                silentLandscapeScroll($(this), 'internal');
            });
        }

        var previousDestTop = 0;
        /**
        * Returns the destination Y position based on the scrolling direction and
        * the height of the section.
        */
        function getDestinationPosition(element){
            var elemPosition = element.position();

            //top of the desination will be at the top of the viewport
            var position = elemPosition.top;
            var isScrollingDown =  elemPosition.top > previousDestTop;
            var sectionBottom = position - windowsHeight + element.outerHeight();

            //is the destination element bigger than the viewport?
            if(element.outerHeight() > windowsHeight){
                //scrolling up?
                if(!isScrollingDown){
                    position = sectionBottom;
                }
            }

            //sections equal or smaller than the viewport height && scrolling down? ||  is resizing and its in the last section
            else if(isScrollingDown || (isResizing && element.is(':last-child')) ){
                //The bottom of the destination will be at the bottom of the viewport
                position = sectionBottom;
            }

            /*
            Keeping record of the last scrolled position to determine the scrolling direction.
            No conventional methods can be used as the scroll bar might not be present
            AND the section might not be active if it is auto-height and didnt reach the middle
            of the viewport.
            */
            previousDestTop = position;
            return position;
        }

        /**
        * Scrolls the site to the given element and scrolls to the slide if a callback is given.
        */
        function scrollPage(element, callback, isMovementUp){
            if(typeof element === 'undefined'){ return; } //there's no element to scroll, leaving the function

            var dtop = getDestinationPosition(element);

            //local variables
            var v = {
                element: element,
                callback: callback,
                isMovementUp: isMovementUp,
                dtop: dtop,
                yMovement: getYmovement(element),
                anchorLink: element.data('anchor'),
                sectionIndex: element.index(SECTION_SEL),
                activeSlide: element.find(SLIDE_ACTIVE_SEL),
                activeSection: $(SECTION_ACTIVE_SEL),
                leavingSection: $(SECTION_ACTIVE_SEL).index(SECTION_SEL) + 1,

                //caching the value of isResizing at the momment the function is called
                //because it will be checked later inside a setTimeout and the value might change
                localIsResizing: isResizing
            };

            //quiting when destination scroll is the same as the current one
            if((v.activeSection.is(element) && !isResizing) || (options.scrollBar && $window.scrollTop() === v.dtop && !element.hasClass(AUTO_HEIGHT) )){ return; }

            if(v.activeSlide.length){
                var slideAnchorLink = v.activeSlide.data('anchor');
                var slideIndex = v.activeSlide.index();
            }

            // If continuousVertical && we need to wrap around
            if (options.autoScrolling && options.continuousVertical && typeof (v.isMovementUp) !== "undefined" &&
                ((!v.isMovementUp && v.yMovement == 'up') || // Intending to scroll down but about to go up or
                (v.isMovementUp && v.yMovement == 'down'))) { // intending to scroll up but about to go down

                v = createInfiniteSections(v);
            }

            //callback (onLeave) if the site is not just resizing and readjusting the slides
            if($.isFunction(options.onLeave) && !v.localIsResizing){
                if(options.onLeave.call(v.activeSection, v.leavingSection, (v.sectionIndex + 1), v.yMovement) === false){
                    return;
                }
            }
            stopMedia(v.activeSection);

            element.addClass(ACTIVE).siblings().removeClass(ACTIVE);
            lazyLoad(element);

            //preventing from activating the MouseWheelHandler event
            //more than once if the page is scrolling
            canScroll = false;

            setState(slideIndex, slideAnchorLink, v.anchorLink, v.sectionIndex);

            performMovement(v);

            //flag to avoid callingn `scrollPage()` twice in case of using anchor links
            lastScrolledDestiny = v.anchorLink;

            //avoid firing it twice (as it does also on scroll)
            activateMenuAndNav(v.anchorLink, v.sectionIndex);
        }

        /**
        * Performs the movement (by CSS3 or by jQuery)
        */
        function performMovement(v){
            // using CSS3 translate functionality
            if (options.css3 && options.autoScrolling && !options.scrollBar) {
                var translate3d = 'translate3d(0px, -' + v.dtop + 'px, 0px)';
                transformContainer(translate3d, true);

                //even when the scrollingSpeed is 0 there's a little delay, which might cause the
                //scrollingSpeed to change in case of using silentMoveTo();
                if(options.scrollingSpeed){
                    afterSectionLoadsId = setTimeout(function () {
                        afterSectionLoads(v);
                    }, options.scrollingSpeed);
                }else{
                    afterSectionLoads(v);
                }
            }

            // using jQuery animate
            else{
                var scrollSettings = getScrollSettings(v);

                $(scrollSettings.element).animate(
                    scrollSettings.options,
                options.scrollingSpeed, options.easing).promise().done(function () { //only one single callback in case of animating  `html, body`
                    if(options.scrollBar){

                        /* Hack!
                        The timeout prevents setting the most dominant section in the viewport as "active" when the user
                        scrolled to a smaller section by using the mousewheel (auto scrolling) rather than draging the scroll bar.

                        When using scrollBar:true It seems like the scroll events still getting propagated even after the scrolling animation has finished.
                        */
                        setTimeout(function(){
                            afterSectionLoads(v);
                        },30);
                    }else{
                        afterSectionLoads(v);
                    }
                });
            }
        }

        /**
        * Gets the scrolling settings depending on the plugin autoScrolling option
        */
        function getScrollSettings(v){
            var scroll = {};

            if(options.autoScrolling && !options.scrollBar){
                scroll.options = { 'top': -v.dtop};
                scroll.element = WRAPPER_SEL;
            }else{
                scroll.options = { 'scrollTop': v.dtop};
                scroll.element = 'html, body';
            }

            return scroll;
        }

        /**
        * Adds sections before or after the current one to create the infinite effect.
        */
        function createInfiniteSections(v){
            // Scrolling down
            if (!v.isMovementUp) {
                // Move all previous sections to after the active section
                $(SECTION_ACTIVE_SEL).after(v.activeSection.prevAll(SECTION_SEL).get().reverse());
            }
            else { // Scrolling up
                // Move all next sections to before the active section
                $(SECTION_ACTIVE_SEL).before(v.activeSection.nextAll(SECTION_SEL));
            }

            // Maintain the displayed position (now that we changed the element order)
            silentScroll($(SECTION_ACTIVE_SEL).position().top);

            // Maintain the active slides visible in the viewport
            keepSlidesPosition();

            // save for later the elements that still need to be reordered
            v.wrapAroundElements = v.activeSection;

            // Recalculate animation variables
            v.dtop = v.element.position().top;
            v.yMovement = getYmovement(v.element);

            return v;
        }

        /**
        * Fix section order after continuousVertical changes have been animated
        */
        function continuousVerticalFixSectionOrder (v) {
            // If continuousVertical is in effect (and autoScrolling would also be in effect then),
            // finish moving the elements around so the direct navigation will function more simply
            if (!v.wrapAroundElements || !v.wrapAroundElements.length) {
                return;
            }

            if (v.isMovementUp) {
                $(SECTION_FIRST_SEL).before(v.wrapAroundElements);
            }
            else {
                $(SECTION_LAST_SEL).after(v.wrapAroundElements);
            }

            silentScroll($(SECTION_ACTIVE_SEL).position().top);

            // Maintain the active slides visible in the viewport
            keepSlidesPosition();
        }


        /**
        * Actions to do once the section is loaded.
        */
        function afterSectionLoads (v){
            continuousVerticalFixSectionOrder(v);

            v.element.find('.fp-scrollable').mouseover();

            //callback (afterLoad) if the site is not just resizing and readjusting the slides
            $.isFunction(options.afterLoad) && !v.localIsResizing && options.afterLoad.call(v.element, v.anchorLink, (v.sectionIndex + 1));

            playMedia(v.element);
            v.element.addClass(COMPLETELY).siblings().removeClass(COMPLETELY);

            canScroll = true;

            $.isFunction(v.callback) && v.callback.call(this);
        }

        /**
        * Lazy loads image, video and audio elements.
        */
        function lazyLoad(destiny){
            var destiny = getSlideOrSection(destiny);

            destiny.find('img[data-src], source[data-src], audio[data-src]').each(function(){
                $(this).attr('src', $(this).data('src'));
                $(this).removeAttr('data-src');

                if($(this).is('source')){
                    $(this).closest('video').get(0).load();
                }
            });
        }

        /**
        * Plays video and audio elements.
        */
        function playMedia(destiny){
            var destiny = getSlideOrSection(destiny);

            //playing HTML5 media elements
            destiny.find('video, audio').each(function(){
                var element = $(this).get(0);

                if( element.hasAttribute('autoplay') && typeof element.play === 'function' ) {
                    element.play();
                }
            });
        }

        /**
        * Stops video and audio elements.
        */
        function stopMedia(destiny){
            var destiny = getSlideOrSection(destiny);

            //stopping HTML5 media elements
            destiny.find('video, audio').each(function(){
                var element = $(this).get(0);

                if( !element.hasAttribute('data-ignore') && typeof element.pause === 'function' ) {
                    element.pause();
                }
            });
        }

        /**
        * Gets the active slide (or section) for the given section
        */
        function getSlideOrSection(destiny){
            var slide = destiny.find(SLIDE_ACTIVE_SEL);
            if( slide.length ) {
                destiny = $(slide);
            }

            return destiny;
        }

        /**
        * Scrolls to the anchor in the URL when loading the site
        */
        function scrollToAnchor(){
            //getting the anchor link in the URL and deleting the `#`
            var value =  window.location.hash.replace('#', '').split('/');
            var section = value[0];
            var slide = value[1];

            if(section){  //if theres any #
                if(options.animateAnchor){
                    scrollPageAndSlide(section, slide);
                }else{
                    FP.silentMoveTo(section, slide);
                }
            }
        }

        /**
        * Detecting any change on the URL to scroll to the given anchor link
        * (a way to detect back history button as we play with the hashes on the URL)
        */
        function hashChangeHandler(){
            if(!isScrolling && !options.lockAnchors){
                var value =  window.location.hash.replace('#', '').split('/');
                var section = value[0];
                var slide = value[1];

                    //when moving to a slide in the first section for the first time (first time to add an anchor to the URL)
                    var isFirstSlideMove =  (typeof lastScrolledDestiny === 'undefined');
                    var isFirstScrollMove = (typeof lastScrolledDestiny === 'undefined' && typeof slide === 'undefined' && !slideMoving);


                if(section.length){
                    /*in order to call scrollpage() only once for each destination at a time
                    It is called twice for each scroll otherwise, as in case of using anchorlinks `hashChange`
                    event is fired on every scroll too.*/
                    if ((section && section !== lastScrolledDestiny) && !isFirstSlideMove || isFirstScrollMove || (!slideMoving && lastScrolledSlide != slide ))  {
                        scrollPageAndSlide(section, slide);
                    }
                }
            }
        }

        //Sliding with arrow keys, both, vertical and horizontal
        function keydownHandler(e) {

            clearTimeout(keydownId);

            var activeElement = $(':focus');

            if(!activeElement.is('textarea') && !activeElement.is('input') && !activeElement.is('select') &&
                activeElement.attr('contentEditable') !== "true" && activeElement.attr('contentEditable') !== '' &&
                options.keyboardScrolling && options.autoScrolling){
                var keyCode = e.which;

                //preventing the scroll with arrow keys & spacebar & Page Up & Down keys
                var keyControls = [40, 38, 32, 33, 34];
                if($.inArray(keyCode, keyControls) > -1){
                    e.preventDefault();
                }

                controlPressed = e.ctrlKey;

                keydownId = setTimeout(function(){
                    onkeydown(e);
                },150);
            }
        }

        function tooltipTextHandler(){
            $(this).prev().trigger('click');
        }

        //to prevent scrolling while zooming
        function keyUpHandler(e){
            if(isWindowFocused){ //the keyup gets fired on new tab ctrl + t in Firefox
                controlPressed = e.ctrlKey;
            }
        }

        //binding the mousemove when the mouse's middle button is released
        function mouseDownHandler(e){
            //middle button
            if (e.which == 2){
                oldPageY = e.pageY;
                container.on('mousemove', mouseMoveHandler);
            }
        }

        //unbinding the mousemove when the mouse's middle button is released
        function mouseUpHandler(e){
            //middle button
            if (e.which == 2){
                container.off('mousemove');
            }
        }

        //Scrolling horizontally when clicking on the slider controls.
        function slideArrowHandler(){
            var section = $(this).closest(SECTION_SEL);

            if ($(this).hasClass(SLIDES_PREV)) {
                if(isScrollAllowed.m.left){
                    FP.moveSlideLeft(section);
                }
            } else {
                if(isScrollAllowed.m.right){
                    FP.moveSlideRight(section);
                }
            }
        }

        //when opening a new tab (ctrl + t), `control` won't be pressed when comming back.
        function blurHandler(){
            isWindowFocused = false;
            controlPressed = false;
        }

        //Scrolls to the section when clicking the navigation bullet
        function sectionBulletHandler(e){
            e.preventDefault();
            var index = $(this).parent().index();
            scrollPage($(SECTION_SEL).eq(index));
        }

        //Scrolls the slider to the given slide destination for the given section
        function slideBulletHandler(e){
            e.preventDefault();
            var slides = $(this).closest(SECTION_SEL).find(SLIDES_WRAPPER_SEL);
            var destiny = slides.find(SLIDE_SEL).eq($(this).closest('li').index());

            landscapeScroll(slides, destiny);
        }

        /**
        * Keydown event
        */
        function onkeydown(e){
            var shiftPressed = e.shiftKey;

            switch (e.which) {
                //up
                case 38:
                case 33:
                    if(isScrollAllowed.k.up){
                        FP.moveSectionUp();
                    }
                    break;

                //down
                case 32: //spacebar
                    if(shiftPressed && isScrollAllowed.k.up){
                        FP.moveSectionUp();
                        break;
                    }
                case 40:
                case 34:
                    if(isScrollAllowed.k.down){
                        FP.moveSectionDown();
                    }
                    break;

                //Home
                case 36:
                    if(isScrollAllowed.k.up){
                        FP.moveTo(1);
                    }
                    break;

                //End
                case 35:
                     if(isScrollAllowed.k.down){
                        FP.moveTo( $(SECTION_SEL).length );
                    }
                    break;

                //left
                case 37:
                    if(isScrollAllowed.k.left){
                        FP.moveSlideLeft();
                    }
                    break;

                //right
                case 39:
                    if(isScrollAllowed.k.right){
                        FP.moveSlideRight();
                    }
                    break;

                default:
                    return; // exit this handler for other keys
            }
        }

        /**
        * Detecting the direction of the mouse movement.
        * Used only for the middle button of the mouse.
        */
        var oldPageY = 0;
        function mouseMoveHandler(e){
            if(canScroll){
                // moving up
                if (e.pageY < oldPageY && isScrollAllowed.m.up){
                    FP.moveSectionUp();
                }

                // moving down
                else if(e.pageY > oldPageY && isScrollAllowed.m.down){
                    FP.moveSectionDown();
                }
            }
            oldPageY = e.pageY;
        }

        /**
        * Scrolls horizontal sliders.
        */
        function landscapeScroll(slides, destiny){
            var destinyPos = destiny.position();
            var slideIndex = destiny.index();
            var section = slides.closest(SECTION_SEL);
            var sectionIndex = section.index(SECTION_SEL);
            var anchorLink = section.data('anchor');
            var slidesNav = section.find(SLIDES_NAV_SEL);
            var slideAnchor = getAnchor(destiny);
            var prevSlide = section.find(SLIDE_ACTIVE_SEL);

            //caching the value of isResizing at the momment the function is called
            //because it will be checked later inside a setTimeout and the value might change
            var localIsResizing = isResizing;

            if(options.onSlideLeave){
                var prevSlideIndex = prevSlide.index();
                var xMovement = getXmovement(prevSlideIndex, slideIndex);

                //if the site is not just resizing and readjusting the slides
                if(!localIsResizing && xMovement!=='none'){
                    if($.isFunction( options.onSlideLeave )){
                        if(options.onSlideLeave.call( prevSlide, anchorLink, (sectionIndex + 1), prevSlideIndex, xMovement, slideIndex ) === false){
                            slideMoving = false;
                            return;
                        }
                    }
                }
            }
            stopMedia(prevSlide);

            destiny.addClass(ACTIVE).siblings().removeClass(ACTIVE);
            if(!localIsResizing){
                lazyLoad(destiny);
            }

            if(!options.loopHorizontal && options.controlArrows){
                //hidding it for the fist slide, showing for the rest
                section.find(SLIDES_ARROW_PREV_SEL).toggle(slideIndex!==0);

                //hidding it for the last slide, showing for the rest
                section.find(SLIDES_ARROW_NEXT_SEL).toggle(!destiny.is(':last-child'));
            }

            //only changing the URL if the slides are in the current section (not for resize re-adjusting)
            if(section.hasClass(ACTIVE)){
                setState(slideIndex, slideAnchor, anchorLink, sectionIndex);
            }

            var afterSlideLoads = function(){
                //if the site is not just resizing and readjusting the slides
                if(!localIsResizing){
                    $.isFunction( options.afterSlideLoad ) && options.afterSlideLoad.call( destiny, anchorLink, (sectionIndex + 1), slideAnchor, slideIndex);
                }
                playMedia(destiny);

                //letting them slide again
                slideMoving = false;
            };

            if(options.css3){
                var translate3d = 'translate3d(-' + Math.round(destinyPos.left) + 'px, 0px, 0px)';

                addAnimation(slides.find(SLIDES_CONTAINER_SEL), options.scrollingSpeed>0).css(getTransforms(translate3d));

                afterSlideLoadsId = setTimeout(function(){
                    afterSlideLoads();
                }, options.scrollingSpeed, options.easing);
            }else{
                slides.animate({
                    scrollLeft : Math.round(destinyPos.left)
                }, options.scrollingSpeed, options.easing, function() {

                    afterSlideLoads();
                });
            }

            slidesNav.find(ACTIVE_SEL).removeClass(ACTIVE);
            slidesNav.find('li').eq(slideIndex).find('a').addClass(ACTIVE);
        }

        var previousHeight = windowsHeight;

        //when resizing the site, we adjust the heights of the sections, slimScroll...
        function resizeHandler(){
            //checking if it needs to get responsive
            responsive();

            // rebuild immediately on touch devices
            if (isTouchDevice) {
                var activeElement = $(document.activeElement);

                //if the keyboard is NOT visible
                if (!activeElement.is('textarea') && !activeElement.is('input') && !activeElement.is('select')) {
                    var currentHeight = $window.height();

                    //making sure the change in the viewport size is enough to force a rebuild. (20 % of the window to avoid problems when hidding scroll bars)
                    if( Math.abs(currentHeight - previousHeight) > (20 * Math.max(previousHeight, currentHeight) / 100) ){
                        FP.reBuild(true);
                        previousHeight = currentHeight;
                    }
                }
            }else{
                //in order to call the functions only when the resize is finished
                //http://stackoverflow.com/questions/4298612/jquery-how-to-call-resize-event-only-once-its-finished-resizing
                clearTimeout(resizeId);

                resizeId = setTimeout(function(){
                    FP.reBuild(true);
                }, 350);
            }
        }

        /**
        * Checks if the site needs to get responsive and disables autoScrolling if so.
        * A class `fp-responsive` is added to the plugin's container in case the user wants to use it for his own responsive CSS.
        */
        function responsive(){
            var widthLimit = options.responsive || options.responsiveWidth; //backwards compatiblity
            var heightLimit = options.responsiveHeight;

            //only calculating what we need. Remember its called on the resize event.
            var isBreakingPointWidth = widthLimit && $window.outerWidth() < widthLimit;
            var isBreakingPointHeight = heightLimit && $window.height() < heightLimit;

            if(widthLimit && heightLimit){
                FP.setResponsive(isBreakingPointWidth || isBreakingPointHeight);
            }
            else if(widthLimit){
                FP.setResponsive(isBreakingPointWidth);
            }
            else if(heightLimit){
                FP.setResponsive(isBreakingPointHeight);
            }
        }

        /**
        * Adds transition animations for the given element
        */
        function addAnimation(element){
            var transition = 'all ' + options.scrollingSpeed + 'ms ' + options.easingcss3;

            element.removeClass(NO_TRANSITION);
            return element.css({
                '-webkit-transition': transition,
                'transition': transition
            });
        }

        /**
        * Remove transition animations for the given element
        */
        function removeAnimation(element){
            return element.addClass(NO_TRANSITION);
        }

        /**
         * Resizing of the font size depending on the window size as well as some of the images on the site.
         */
        function resizeMe(displayHeight, displayWidth) {
            //Standard dimensions, for which the body font size is correct
            var preferredHeight = 825;
            var preferredWidth = 900;

            if (displayHeight < preferredHeight || displayWidth < preferredWidth) {
                var heightPercentage = (displayHeight * 100) / preferredHeight;
                var widthPercentage = (displayWidth * 100) / preferredWidth;
                var percentage = Math.min(heightPercentage, widthPercentage);
                var newFontSize = percentage.toFixed(2);

                $body.css('font-size', newFontSize + '%');
            } else {
                $body.css('font-size', '100%');
            }
        }

        /**
         * Activating the website navigation dots according to the given slide name.
         */
        function activateNavDots(name, sectionIndex){
            if(options.navigation){
                $(SECTION_NAV_SEL).find(ACTIVE_SEL).removeClass(ACTIVE);
                if(name){
                    $(SECTION_NAV_SEL).find('a[href="#' + name + '"]').addClass(ACTIVE);
                }else{
                    $(SECTION_NAV_SEL).find('li').eq(sectionIndex).find('a').addClass(ACTIVE);
                }
            }
        }

        /**
         * Activating the website main menu elements according to the given slide name.
         */
        function activateMenuElement(name){
            if(options.menu){
                $(options.menu).find(ACTIVE_SEL).removeClass(ACTIVE);
                $(options.menu).find('[data-menuanchor="'+name+'"]').addClass(ACTIVE);
            }
        }

        /**
        * Sets to active the current menu and vertical nav items.
        */
        function activateMenuAndNav(anchor, index){
            activateMenuElement(anchor);
            activateNavDots(anchor, index);
        }

        /**
        * Retuns `up` or `down` depending on the scrolling movement to reach its destination
        * from the current section.
        */
        function getYmovement(destiny){
            var fromIndex = $(SECTION_ACTIVE_SEL).index(SECTION_SEL);
            var toIndex = destiny.index(SECTION_SEL);
            if( fromIndex == toIndex){
                return 'none';
            }
            if(fromIndex > toIndex){
                return 'up';
            }
            return 'down';
        }

        /**
        * Retuns `right` or `left` depending on the scrolling movement to reach its destination
        * from the current slide.
        */
        function getXmovement(fromIndex, toIndex){
            if( fromIndex == toIndex){
                return 'none';
            }
            if(fromIndex > toIndex){
                return 'left';
            }
            return 'right';
        }


        function createSlimScrolling(element){
            //needed to make `scrollHeight` work under Opera 12
            element.css('overflow', 'hidden');

            var scrollOverflowHandler = options.scrollOverflowHandler;
            var wrap = scrollOverflowHandler.wrapContent();
            //in case element is a slide
            var section = element.closest(SECTION_SEL);
            var scrollable = scrollOverflowHandler.scrollable(element);
            var contentHeight;

            //if there was scroll, the contentHeight will be the one in the scrollable section
            if(scrollable.length){
                contentHeight = scrollOverflowHandler.scrollHeight(element);
            }else{
                contentHeight = element.get(0).scrollHeight;
                if(options.verticalCentered){
                    contentHeight = element.find(TABLE_CELL_SEL).get(0).scrollHeight;
                }
            }

            var scrollHeight = windowsHeight - parseInt(section.css('padding-bottom')) - parseInt(section.css('padding-top'));

            //needs scroll?
            if ( contentHeight > scrollHeight) {
                //was there already an scroll ? Updating it
                if(scrollable.length){
                    scrollOverflowHandler.update(element, scrollHeight);
                }
                //creating the scrolling
                else{
                    if(options.verticalCentered){
                        element.find(TABLE_CELL_SEL).wrapInner(wrap);
                    }else{
                        element.wrapInner(wrap);
                    }
                    scrollOverflowHandler.create(element, scrollHeight);
                }
            }
            //removing the scrolling when it is not necessary anymore
            else{
                scrollOverflowHandler.remove(element);
            }

            //undo
            element.css('overflow', '');
        }

        function addTableClass(element){
            element.addClass(TABLE).wrapInner('<div class="' + TABLE_CELL + '" style="height:' + getTableHeight(element) + 'px;" />');
        }

        function getTableHeight(element){
            var sectionHeight = windowsHeight;

            if(options.paddingTop || options.paddingBottom){
                var section = element;
                if(!section.hasClass(SECTION)){
                    section = element.closest(SECTION_SEL);
                }

                var paddings = parseInt(section.css('padding-top')) + parseInt(section.css('padding-bottom'));
                sectionHeight = (windowsHeight - paddings);
            }

            return sectionHeight;
        }

        /**
        * Adds a css3 transform property to the container class with or without animation depending on the animated param.
        */
        function transformContainer(translate3d, animated){
            if(animated){
                addAnimation(container);
            }else{
                removeAnimation(container);
            }

            container.css(getTransforms(translate3d));

            //syncronously removing the class after the animation has been applied.
            setTimeout(function(){
                container.removeClass(NO_TRANSITION);
            },10);
        }

        /**
        * Gets a section by its anchor / index
        */
        function getSectionByAnchor(sectionAnchor){
            //section
            var section = container.find(SECTION_SEL + '[data-anchor="'+sectionAnchor+'"]');
            if(!section.length){
                section = $(SECTION_SEL).eq( (sectionAnchor -1) );
            }

            return section;
        }

        /**
        * Gets a slide inside a given section by its anchor / index
        */
        function getSlideByAnchor(slideAnchor, section){
            var slides = section.find(SLIDES_WRAPPER_SEL);
            var slide =  slides.find(SLIDE_SEL + '[data-anchor="'+slideAnchor+'"]');

            if(!slide.length){
                slide = slides.find(SLIDE_SEL).eq(slideAnchor);
            }

            return slide;
        }

        /**
        * Scrolls to the given section and slide anchors
        */
        function scrollPageAndSlide(destiny, slide){
            var section = getSectionByAnchor(destiny);

            //default slide
            if (typeof slide === 'undefined') {
                slide = 0;
            }

            //we need to scroll to the section and then to the slide
            if (destiny !== lastScrolledDestiny && !section.hasClass(ACTIVE)){
                scrollPage(section, function(){
                    scrollSlider(section, slide);
                });
            }
            //if we were already in the section
            else{
                scrollSlider(section, slide);
            }
        }

        /**
        * Scrolls the slider to the given slide destination for the given section
        */
        function scrollSlider(section, slideAnchor){
            if(typeof slideAnchor !== 'undefined'){
                var slides = section.find(SLIDES_WRAPPER_SEL);
                var destiny =  getSlideByAnchor(slideAnchor, section);

                if(destiny.length){
                    landscapeScroll(slides, destiny);
                }
            }
        }

        /**
        * Creates a landscape navigation bar with dots for horizontal sliders.
        */
        function addSlidesNavigation(section, numSlides){
            section.append('<div class="' + SLIDES_NAV + '"><ul></ul></div>');
            var nav = section.find(SLIDES_NAV_SEL);

            //top or bottom
            nav.addClass(options.slidesNavPosition);

            for(var i=0; i< numSlides; i++){
                nav.find('ul').append('<li><a href="#"><span></span></a></li>');
            }

            //centering it
            nav.css('margin-left', '-' + (nav.width()/2) + 'px');

            nav.find('li').first().find('a').addClass(ACTIVE);
        }


        /**
        * Sets the state of the website depending on the active section/slide.
        * It changes the URL hash when needed and updates the body class.
        */
        function setState(slideIndex, slideAnchor, anchorLink, sectionIndex){
            var sectionHash = '';

            if(options.anchors.length && !options.lockAnchors){

                //isn't it the first slide?
                if(slideIndex){
                    if(typeof anchorLink !== 'undefined'){
                        sectionHash = anchorLink;
                    }

                    //slide without anchor link? We take the index instead.
                    if(typeof slideAnchor === 'undefined'){
                        slideAnchor = slideIndex;
                    }

                    lastScrolledSlide = slideAnchor;
                    setUrlHash(sectionHash + '/' + slideAnchor);

                //first slide won't have slide anchor, just the section one
                }else if(typeof slideIndex !== 'undefined'){
                    lastScrolledSlide = slideAnchor;
                    setUrlHash(anchorLink);
                }

                //section without slides
                else{
                    setUrlHash(anchorLink);
                }
            }

            setBodyClass();
        }

        /**
        * Sets the URL hash.
        */
        function setUrlHash(url){
            if(options.recordHistory){
                location.hash = url;
            }else{
                //Mobile Chrome doesn't work the normal way, so... lets use HTML5 for phones :)
                if(isTouchDevice || isTouch){
                    window.history.replaceState(undefined, undefined, '#' + url);
                }else{
                    var baseUrl = window.location.href.split('#')[0];
                    window.location.replace( baseUrl + '#' + url );
                }
            }
        }

        /**
        * Gets the anchor for the given slide / section. Its index will be used if there's none.
        */
        function getAnchor(element){
            var anchor = element.data('anchor');
            var index = element.index();

            //Slide without anchor link? We take the index instead.
            if(typeof anchor === 'undefined'){
                anchor = index;
            }

            return anchor;
        }

        /**
        * Sets a class for the body of the page depending on the active section / slide
        */
        function setBodyClass(){
            var section = $(SECTION_ACTIVE_SEL);
            var slide = section.find(SLIDE_ACTIVE_SEL);

            var sectionAnchor = getAnchor(section);
            var slideAnchor = getAnchor(slide);

            var sectionIndex = section.index(SECTION_SEL);

            var text = String(sectionAnchor);

            if(slide.length){
                text = text + '-' + slideAnchor;
            }

            //changing slash for dash to make it a valid CSS style
            text = text.replace('/', '-').replace('#','');

            //removing previous anchor classes
            var classRe = new RegExp('\\b\\s?' + VIEWING_PREFIX + '-[^\\s]+\\b', "g");
            $body[0].className = $body[0].className.replace(classRe, '');

            //adding the current anchor
            $body.addClass(VIEWING_PREFIX + '-' + text);
        }

        /**
        * Checks for translate3d support
        * @return boolean
        * http://stackoverflow.com/questions/5661671/detecting-transform-translate3d-support
        */
        function support3d() {
            var el = document.createElement('p'),
                has3d,
                transforms = {
                    'webkitTransform':'-webkit-transform',
                    'OTransform':'-o-transform',
                    'msTransform':'-ms-transform',
                    'MozTransform':'-moz-transform',
                    'transform':'transform'
                };

            // Add it to the body to get the computed style.
            document.body.insertBefore(el, null);

            for (var t in transforms) {
                if (el.style[t] !== undefined) {
                    el.style[t] = 'translate3d(1px,1px,1px)';
                    has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                }
            }

            document.body.removeChild(el);

            return (has3d !== undefined && has3d.length > 0 && has3d !== 'none');
        }

        /**
        * Removes the auto scrolling action fired by the mouse wheel and trackpad.
        * After this function is called, the mousewheel and trackpad movements won't scroll through sections.
        */
        function removeMouseWheelHandler(){
            if (document.addEventListener) {
                document.removeEventListener('mousewheel', MouseWheelHandler, false); //IE9, Chrome, Safari, Oper
                document.removeEventListener('wheel', MouseWheelHandler, false); //Firefox
                document.removeEventListener('MozMousePixelScroll', MouseWheelHandler, false); //old Firefox
            } else {
                document.detachEvent('onmousewheel', MouseWheelHandler); //IE 6/7/8
            }
        }

        /**
        * Adds the auto scrolling action for the mouse wheel and trackpad.
        * After this function is called, the mousewheel and trackpad movements will scroll through sections
        * https://developer.mozilla.org/en-US/docs/Web/Events/wheel
        */
        function addMouseWheelHandler(){
            var prefix = '';
            var _addEventListener;

            if (window.addEventListener){
                _addEventListener = "addEventListener";
            }else{
                _addEventListener = "attachEvent";
                prefix = 'on';
            }

             // detect available wheel event
            var support = 'onwheel' in document.createElement('div') ? 'wheel' : // Modern browsers support "wheel"
                      document.onmousewheel !== undefined ? 'mousewheel' : // Webkit and IE support at least "mousewheel"
                      'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox


            if(support == 'DOMMouseScroll'){
                document[ _addEventListener ](prefix + 'MozMousePixelScroll', MouseWheelHandler, false);
            }

            //handle MozMousePixelScroll in older Firefox
            else{
                document[ _addEventListener ](prefix + support, MouseWheelHandler, false);
            }
        }

        /**
        * Binding the mousemove when the mouse's middle button is pressed
        */
        function addMiddleWheelHandler(){
            container
                .on('mousedown', mouseDownHandler)
                .on('mouseup', mouseUpHandler);
        }

        /**
        * Unbinding the mousemove when the mouse's middle button is released
        */
        function removeMiddleWheelHandler(){
            container
                .off('mousedown', mouseDownHandler)
                .off('mouseup', mouseUpHandler);
        }

        /**
        * Adds the possibility to auto scroll through sections on touch devices.
        */
        function addTouchHandler(){
            if(isTouchDevice || isTouch){
                //Microsoft pointers
                var MSPointer = getMSPointer();

                $(WRAPPER_SEL).off('touchstart ' +  MSPointer.down).on('touchstart ' + MSPointer.down, touchStartHandler);
                $(WRAPPER_SEL).off('touchmove ' + MSPointer.move).on('touchmove ' + MSPointer.move, touchMoveHandler);
            }
        }

        /**
        * Removes the auto scrolling for touch devices.
        */
        function removeTouchHandler(){
            if(isTouchDevice || isTouch){
                //Microsoft pointers
                var MSPointer = getMSPointer();

                $(WRAPPER_SEL).off('touchstart ' + MSPointer.down);
                $(WRAPPER_SEL).off('touchmove ' + MSPointer.move);
            }
        }

        /*
        * Returns and object with Microsoft pointers (for IE<11 and for IE >= 11)
        * http://msdn.microsoft.com/en-us/library/ie/dn304886(v=vs.85).aspx
        */
        function getMSPointer(){
            var pointer;

            //IE >= 11 & rest of browsers
            if(window.PointerEvent){
                pointer = { down: 'pointerdown', move: 'pointermove'};
            }

            //IE < 11
            else{
                pointer = { down: 'MSPointerDown', move: 'MSPointerMove'};
            }

            return pointer;
        }

        /**
        * Gets the pageX and pageY properties depending on the browser.
        * https://github.com/alvarotrigo/fullPage.js/issues/194#issuecomment-34069854
        */
        function getEventsPage(e){
            var events = [];

            events.y = (typeof e.pageY !== 'undefined' && (e.pageY || e.pageX) ? e.pageY : e.touches[0].pageY);
            events.x = (typeof e.pageX !== 'undefined' && (e.pageY || e.pageX) ? e.pageX : e.touches[0].pageX);

            //in touch devices with scrollBar:true, e.pageY is detected, but we have to deal with touch events. #1008
            if(isTouch && isReallyTouch(e) && options.scrollBar){
                events.y = e.touches[0].pageY;
                events.x = e.touches[0].pageX;
            }

            return events;
        }

        /**
        * Slides silently (with no animation) the active slider to the given slide.
        */
        function silentLandscapeScroll(activeSlide, noCallbacks){
            FP.setScrollingSpeed (0, 'internal');

            if(typeof noCallbacks !== 'undefined'){
                //preventing firing callbacks afterSlideLoad etc.
                isResizing = true;
            }

            landscapeScroll(activeSlide.closest(SLIDES_WRAPPER_SEL), activeSlide);

            if(typeof noCallbacks !== 'undefined'){
                isResizing = false;
            }

            FP.setScrollingSpeed(originals.scrollingSpeed, 'internal');
        }

        /**
        * Scrolls silently (with no animation) the page to the given Y position.
        */
        function silentScroll(top){
            if(options.scrollBar){
                container.scrollTop(top);
            }
            else if (options.css3) {
                var translate3d = 'translate3d(0px, -' + top + 'px, 0px)';
                transformContainer(translate3d, false);
            }
            else {
                container.css('top', -top);
            }
        }

        /**
        * Returns the cross-browser transform string.
        */
        function getTransforms(translate3d){
            return {
                '-webkit-transform': translate3d,
                '-moz-transform': translate3d,
                '-ms-transform':translate3d,
                'transform': translate3d
            };
        }

        /**
        * Allowing or disallowing the mouse/swipe scroll in a given direction. (not for keyboard)
        * @type  m (mouse) or k (keyboard)
        */
        function setIsScrollAllowed(value, direction, type){
            switch (direction){
                case 'up': isScrollAllowed[type].up = value; break;
                case 'down': isScrollAllowed[type].down = value; break;
                case 'left': isScrollAllowed[type].left = value; break;
                case 'right': isScrollAllowed[type].right = value; break;
                case 'all':
                    if(type == 'm'){
                        FP.setAllowScrolling(value);
                    }else{
                        FP.setKeyboardScrolling(value);
                    }
            }
        }

        /*
        * Destroys fullpage.js plugin events and optinally its html markup and styles
        */
        FP.destroy = function(all){
            FP.setAutoScrolling(false, 'internal');
            FP.setAllowScrolling(false);
            FP.setKeyboardScrolling(false);
            container.addClass(DESTROYED);

            clearTimeout(afterSlideLoadsId);
            clearTimeout(afterSectionLoadsId);
            clearTimeout(resizeId);
            clearTimeout(scrollId);
            clearTimeout(scrollId2);

            $window
                .off('scroll', scrollHandler)
                .off('hashchange', hashChangeHandler)
                .off('resize', resizeHandler);

            $document
                .off('click', SECTION_NAV_SEL + ' a')
                .off('mouseenter', SECTION_NAV_SEL + ' li')
                .off('mouseleave', SECTION_NAV_SEL + ' li')
                .off('click', SLIDES_NAV_LINK_SEL)
                .off('mouseover', options.normalScrollElements)
                .off('mouseout', options.normalScrollElements);

            $(SECTION_SEL)
                .off('click', SLIDES_ARROW_SEL);

            clearTimeout(afterSlideLoadsId);
            clearTimeout(afterSectionLoadsId);

            //lets make a mess!
            if(all){
                destroyStructure();
            }
        };

        /*
        * Removes inline styles added by fullpage.js
        */
        function destroyStructure(){
            //reseting the `top` or `translate` properties to 0
            silentScroll(0);

            $(SECTION_NAV_SEL + ', ' + SLIDES_NAV_SEL +  ', ' + SLIDES_ARROW_SEL).remove();

            //removing inline styles
            $(SECTION_SEL).css( {
                'height': '',
                'background-color' : '',
                'padding': ''
            });

            $(SLIDE_SEL).css( {
                'width': ''
            });

            container.css({
                'height': '',
                'position': '',
                '-ms-touch-action': '',
                'touch-action': ''
            });

            $htmlBody.css({
                'overflow': '',
                'height': ''
            });

            // remove .fp-enabled class
            $('html').removeClass(ENABLED);

            // remove all of the .fp-viewing- classes
            $.each($body.get(0).className.split(/\s+/), function (index, className) {
                if (className.indexOf(VIEWING_PREFIX) === 0) {
                    $body.removeClass(className);
                }
            });

            //removing added classes
            $(SECTION_SEL + ', ' + SLIDE_SEL).each(function(){
                options.scrollOverflowHandler.remove($(this));
                $(this).removeClass(TABLE + ' ' + ACTIVE);
            });

            removeAnimation(container);

            //Unwrapping content
            container.find(TABLE_CELL_SEL + ', ' + SLIDES_CONTAINER_SEL + ', ' + SLIDES_WRAPPER_SEL).each(function(){
                //unwrap not being use in case there's no child element inside and its just text
                $(this).replaceWith(this.childNodes);
            });

            //scrolling the page to the top with no animation
            $htmlBody.scrollTop(0);

            //removing selectors
            var usedSelectors = [SECTION, SLIDE, SLIDES_CONTAINER];
            $.each(usedSelectors, function(index, value){
                $('.' + value).removeClass(value);
            });
        }

        /*
        * Sets the state for a variable with multiple states (original, and temporal)
        * Some variables such as `autoScrolling` or `recordHistory` might change automatically its state when using `responsive` or `autoScrolling:false`.
        * This function is used to keep track of both states, the original and the temporal one.
        * If type is not 'internal', then we assume the user is globally changing the variable.
        */
        function setVariableState(variable, value, type){
            options[variable] = value;
            if(type !== 'internal'){
                originals[variable] = value;
            }
        }

        /**
        * Displays warnings
        */
        function displayWarnings(){
            if($('html').hasClass(ENABLED)){
                showError('error', 'Fullpage.js can only be initialized once and you are doing it multiple times!');
                return;
            }

            // Disable mutually exclusive settings
            if (options.continuousVertical &&
                (options.loopTop || options.loopBottom)) {
                options.continuousVertical = false;
                showError('warn', 'Option `loopTop/loopBottom` is mutually exclusive with `continuousVertical`; `continuousVertical` disabled');
            }

            if(options.scrollBar && options.scrollOverflow){
                showError('warn', 'Option `scrollBar` is mutually exclusive with `scrollOverflow`. Sections with scrollOverflow might not work well in Firefox');
            }

            if(options.continuousVertical && options.scrollBar){
                options.continuousVertical = false;
                showError('warn', 'Option `scrollBar` is mutually exclusive with `continuousVertical`; `continuousVertical` disabled');
            }

            //anchors can not have the same value as any element ID or NAME
            $.each(options.anchors, function(index, name){

                //case insensitive selectors (http://stackoverflow.com/a/19465187/1081396)
                var nameAttr = $document.find('[name]').filter(function() {
                    return $(this).attr('name') && $(this).attr('name').toLowerCase() == name.toLowerCase();
                });

                var idAttr = $document.find('[id]').filter(function() {
                    return $(this).attr('id') && $(this).attr('id').toLowerCase() == name.toLowerCase();
                });

                if(idAttr.length || nameAttr.length ){
                    showError('error', 'data-anchor tags can not have the same value as any `id` element on the site (or `name` element for IE).');
                    idAttr.length && showError('error', '"' + name + '" is is being used by another element `id` property');
                    nameAttr.length && showError('error', '"' + name + '" is is being used by another element `name` property');
                }
            });
        }

        /**
        * Shows a message in the console of the given type.
        */
        function showError(type, text){
            console && console[type] && console[type]('fullPage: ' + text);
        }
    };

    /**
     * An object to handle overflow scrolling.
     * This uses jquery.slimScroll to accomplish overflow scrolling.
     * It is possible to pass in an alternate scrollOverflowHandler
     * to the fullpage.js option that implements the same functions
     * as this handler.
     *
     * @type {Object}
     */
    var slimScrollHandler = {
        /**
         * Optional function called after each render.
         *
         * Solves a bug with slimScroll vendor library #1037, #553
         *
         * @param  {object} section jQuery object containing rendered section
         */
        afterRender: function(section){
            var slides = section.find(SLIDES_WRAPPER);
            var scrollableWrap = section.find(SCROLLABLE_SEL);

            if(slides.length){
                scrollableWrap = slides.find(SLIDE_ACTIVE_SEL);
            }

            scrollableWrap.mouseover();
        },

        /**
         * Called when overflow scrolling is needed for a section.
         *
         * @param  {Object} element      jQuery object containing current section
         * @param  {Number} scrollHeight Current window height in pixels
         */
        create: function(element, scrollHeight){
            element.find(SCROLLABLE_SEL).slimScroll({
                allowPageScroll: true,
                height: scrollHeight + 'px',
                size: '10px',
                alwaysVisible: true
            });
        },

        /**
         * Return a boolean depending on whether the scrollable element is a
         * the end or at the start of the scrolling depending on the given type.
         *
         * @param  {String}  type       Either 'top' or 'bottom'
         * @param  {Object}  scrollable jQuery object for the scrollable element
         * @return {Boolean}
         */
        isScrolled: function(type, scrollable){
            if(type === 'top'){
                return !scrollable.scrollTop();
            }else if(type === 'bottom'){
                return scrollable.scrollTop() + 1 + scrollable.innerHeight() >= scrollable[0].scrollHeight;
            }
        },

        /**
         * Returns the scrollable element for the given section.
         * If there are landscape slides, will only return a scrollable element
         * if it is in the active slide.
         *
         * @param  {Object}  activeSection jQuery object containing current section
         * @return {Boolean}
         */
        scrollable: function(activeSection){
            // if there are landscape slides, we check if the scrolling bar is in the current one or not
            if(activeSection.find(SLIDES_WRAPPER_SEL).length){
                return activeSection.find(SLIDE_ACTIVE_SEL).find(SCROLLABLE_SEL);
            }
            return activeSection.find(SCROLLABLE_SEL);
        },

        /**
         * Returns the scroll height of the wrapped content.
         * If this is larger than the window height minus section padding,
         * overflow scrolling is needed.
         *
         * @param  {Object} element jQuery object containing current section
         * @return {Number}
         */
        scrollHeight: function(element){
            return element.find(SCROLLABLE_SEL).get(0).scrollHeight;
        },

        /**
         * Called when overflow scrolling is no longer needed for a section.
         *
         * @param  {Object} element      jQuery object containing current section
         */
        remove: function(element){
            element.find(SCROLLABLE_SEL).children().first().unwrap().unwrap();
            element.find(SLIMSCROLL_BAR_SEL).remove();
            element.find(SLIMSCROLL_RAIL_SEL).remove();
        },

        /**
         * Called when overflow scrolling has already been setup but the
         * window height has potentially changed.
         *
         * @param  {Object} element      jQuery object containing current section
         * @param  {Number} scrollHeight Current window height in pixels
         */
        update: function(element, scrollHeight){
            element.find(SCROLLABLE_SEL).css('height', scrollHeight + 'px').parent().css('height', scrollHeight + 'px');
        },

        /**
         * Called to get any additional elements needed to wrap the section
         * content in order to facilitate overflow scrolling.
         *
         * @return {String|Object} Can be a string containing HTML,
         *                         a DOM element, or jQuery object.
         */
        wrapContent: function(){
            return '<div class="' + SCROLLABLE + '"></div>';
        }
    };

    defaultScrollHandler = slimScrollHandler;

});

},{"jquery":3}],3:[function(require,module,exports){
/*!
 * jQuery JavaScript Library v2.2.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-04-05T19:26Z
 */

(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//"use strict";
var arr = [];

var document = window.document;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	version = "2.2.3",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = jQuery.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// adding 1 corrects loss of precision from parseFloat (#15100)
		var realStringObj = obj && obj.toString();
		return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
	},

	isPlainObject: function( obj ) {
		var key;

		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Not own constructor property must be Object
		if ( obj.constructor &&
				!hasOwn.call( obj, "constructor" ) &&
				!hasOwn.call( obj.constructor.prototype || {}, "isPrototypeOf" ) ) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android<4.0, iOS<6 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
			indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {

			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf( "use strict" ) === 1 ) {
				script = document.createElement( "script" );
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {

				// Otherwise, avoid the DOM node creation, insertion
				// and removal by using an indirect global eval

				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE9-11+
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

// JSHint would error on this code due to the Symbol not being defined in ES5.
// Defining this global in .jshintrc would create a danger of using the global
// unguarded in another place, it seems safer to just disable JSHint for these
// three lines.
/* jshint ignore: start */
if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}
/* jshint ignore: end */

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: iOS 8.2 (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.1
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-10-17
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, nidselect, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
					while ( i-- ) {
						groups[i] = nidselect + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( (parent = document.defaultView) && parent.top !== parent ) {
		// Support: IE 11
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				return m ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( (oldCache = uniqueCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		} );

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i,
			len = this.length,
			ret = [],
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					// Support: Blackberry 4.6
					// gEBID returns nodes no longer in the document (#6963)
					if ( elem && elem.parentNode ) {

						// Inject the element directly into the jQuery object
						this.length = 1;
						this[ 0 ] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

				// Always skip document fragments
				if ( cur.nodeType < 11 && ( pos ?
					pos.index( cur ) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector( cur, selectors ) ) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnotwhite = ( /\S+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];

							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this === promise ? newDefer.promise() : this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add( function() {

					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 ||
				( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred.
			// If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// Add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.progress( updateFunc( i, progressContexts, progressValues ) )
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject );
				} else {
					--remaining;
				}
			}
		}

		// If we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
} );


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {

	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
} );

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called
		// after the browser event has already occurred.
		// Support: IE9-10 only
		// Older IE sometimes signals "interactive" too soon
		if ( document.readyState === "complete" ||
			( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

			// Handle it asynchronously to allow scripts the opportunity to delay ready
			window.setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed );
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			len ? fn( elems[ 0 ], key ) : emptyGet;
};
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	/* jshint -W018 */
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	register: function( owner, initial ) {
		var value = initial || {};

		// If it is a node unlikely to be stringify-ed or looped over
		// use plain assignment
		if ( owner.nodeType ) {
			owner[ this.expando ] = value;

		// Otherwise secure it in a non-enumerable, non-writable property
		// configurability must be true to allow the property to be
		// deleted with the delete operator
		} else {
			Object.defineProperty( owner, this.expando, {
				value: value,
				writable: true,
				configurable: true
			} );
		}
		return owner[ this.expando ];
	},
	cache: function( owner ) {

		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return an empty object.
		if ( !acceptData( owner ) ) {
			return {};
		}

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ prop ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :
			owner[ this.expando ] && owner[ this.expando ][ key ];
	},
	access: function( owner, key, value ) {
		var stored;

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase( key ) );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i, name, camel,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key === undefined ) {
			this.register( owner );

		} else {

			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {

				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );

				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {

					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( rnotwhite ) || [] );
				}
			}

			i = name.length;

			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <= 35-45+
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://code.google.com/p/chromium/issues/detail?id=378607
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :

					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data, camelKey;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// with the key as-is
				data = dataUser.get( elem, key ) ||

					// Try to find dashed key if it exists (gh-2779)
					// This is for 2.2.x only
					dataUser.get( elem, key.replace( rmultiDash, "-$&" ).toLowerCase() );

				if ( data !== undefined ) {
					return data;
				}

				camelKey = jQuery.camelCase( key );

				// Attempt to get data from the cache
				// with the key camelized
				data = dataUser.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			camelKey = jQuery.camelCase( key );
			this.each( function() {

				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = dataUser.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				dataUser.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf( "-" ) > -1 && data !== undefined ) {
					dataUser.set( this, key, value );
				}
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {

		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" ||
			!jQuery.contains( elem.ownerDocument, elem );
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() { return tween.cur(); } :
			function() { return jQuery.css( elem, prop, "" ); },
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([\w:-]+)/ );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE9
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE9-11+
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== "undefined" ?
				context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android<4.1, PhantomJS<2
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android<4.1, PhantomJS<2
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0-4.3, Safari<=5.1
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari<=5.1, Android<4.2
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<=11+
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE9
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Support (at least): Chrome, IE9
		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		//
		// Support: Firefox<=42+
		// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
		if ( delegateCount && cur.nodeType &&
			( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push( { elem: cur, handlers: matches } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
		"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split( " " ),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: ( "button buttons clientX clientY offsetX offsetY pageX pageY " +
			"screenX screenY toElement" ).split( " " ),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX +
					( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
					( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY +
					( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
					( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome<28
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android<4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://code.google.com/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {
	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,

	// Support: IE 10-11, Edge 10240+
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName( "tbody" )[ 0 ] ||
			elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android<4.1, PhantomJS<2
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <= 35-45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <= 35-45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {

	// Keep domManip exposed until 3.0 (gh-2225)
	domManip: domManip,

	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because push.apply(_, arraylike) throws
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );


var iframe,
	elemdisplay = {

		// Support: Firefox
		// We have to pre-define these values for FF (#10227)
		HTML: "block",
		BODY: "block"
	};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */

// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		display = jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
				.appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = iframe[ 0 ].contentDocument;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var documentElement = document.documentElement;



( function() {
	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE9-11+
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container.appendChild( div );

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {
		div.style.cssText =

			// Support: Firefox<29, Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";
		div.innerHTML = "";
		documentElement.appendChild( container );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle.width === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div.style.marginRight = "50%";
		pixelMarginRightVal = divStyle.marginRight === "4px";

		documentElement.removeChild( container );
	}

	jQuery.extend( support, {
		pixelPosition: function() {

			// This test is executed only once but we still do memoizing
			// since we can use the boxSizingReliable pre-computing.
			// No need to check if the test was already performed, though.
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {

			// Support: Android 4.0-4.3
			// We're checking for boxSizingReliableVal here instead of pixelMarginRightVal
			// since that compresses better and they're computed together anyway.
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {

			// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return reliableMarginLeftVal;
		},
		reliableMarginRight: function() {

			// Support: Android 2.3
			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			// This support function is only executed once so no memoizing is needed.
			var ret,
				marginDiv = div.appendChild( document.createElement( "div" ) );

			// Reset CSS: box-sizing; display; margin; border; padding
			marginDiv.style.cssText = div.style.cssText =

				// Support: Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;box-sizing:content-box;" +
				"display:block;margin:0;border:0;padding:0";
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";
			documentElement.appendChild( container );

			ret = !parseFloat( window.getComputedStyle( marginDiv ).marginRight );

			documentElement.removeChild( container );
			div.removeChild( marginDiv );

			return ret;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		style = elem.style;

	computed = computed || getStyles( elem );
	ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

	// Support: Opera 12.1x only
	// Fall back to style even without computed
	// computed is undefined for elems on document fragments
	if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
		ret = jQuery.style( elem, name );
	}

	// Support: IE9
	// getPropertyValue is only needed for .css('filter') (#12537)
	if ( computed ) {

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// http://dev.w3.org/csswg/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE9-11+
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?

		// If we already have the right measurement, avoid augmentation
		4 :

		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Support: IE11 only
	// In IE 11 fullscreen elements inside of an iframe have
	// 100x too small dimensions (gh-1764).
	if ( document.msFullscreenElement && window.top !== window ) {

		// Support: IE11 only
		// Running getBoundingClientRect on a disconnected node
		// in IE throws an error.
		if ( elem.getClientRects().length ) {
			val = Math.round( elem.getBoundingClientRect()[ name ] * 100 );
		}
	}

	// Some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {

		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test( val ) ) {
			return val;
		}

		// Check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = dataPriv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {

			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = dataPriv.access(
					elem,
					"olddisplay",
					defaultDisplay( elem.nodeName )
				);
			}
		} else {
			hidden = isHidden( elem );

			if ( display !== "none" || !hidden ) {
				dataPriv.set(
					elem,
					"olddisplay",
					hidden ? display : jQuery.css( elem, "display" )
				);
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// Support: IE9-11+
			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				style[ name ] = value;
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}
		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
					elem.offsetWidth === 0 ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// Support: Android 2.3
jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			return swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {

		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			dataPriv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show
				// and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = dataPriv.access( elem, "fxshow", {} );
		}

		// Store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done( function() {
				jQuery( elem ).hide();
			} );
		}
		anim.done( function() {
			var prop;

			dataPriv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		} );
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {
	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnotwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ?
		opt.duration : opt.duration in jQuery.fx.speeds ?
			jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	window.clearInterval( timerId );

	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: iOS<=5.1, Android<=4.2+
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE<=11+
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: Android<=2.3
	// Options inside disabled selects are incorrectly marked as disabled
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<=11+
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {

					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle;
		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ name ];
			attrHandle[ name ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				name.toLowerCase() :
				null;
			attrHandle[ name ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) ||
						rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							-1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {
			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




var rclass = /[\t\r\n\f]/g;

function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnotwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + getClass( elem ) + " " ).replace( rclass, " " )
					.indexOf( className ) > -1
			) {
				return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g,
	rspaces = /[\x20\t\r\n\f]+/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?

					// Handle most common string cases
					ret.replace( rreturn, "" ) :

					// Handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					jQuery.trim( jQuery.text( elem ) ).replace( rspaces, " " );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ?
								!option.disabled : option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled ||
								!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true

				// Previously, `originalEvent: {}` was set here, so stopPropagation call
				// would not be triggered on donor event, since in our own
				// jQuery.event.stopPropagation function we had a check for existence of
				// originalEvent.stopPropagation method, so, consequently it would be a noop.
				//
				// But now, this "simulate" function is used only for events
				// for which stopPropagation() is noop, so there is no need for that anymore.
				//
				// For the 1.x branch though, guard for "click" and "submit"
				// events is still used, but was moved to jQuery.event.stopPropagation function
				// because `originalEvent` should point to the original event for the constancy
				// with other events and for more focused logic
			}
		);

		jQuery.event.trigger( e, null, elem );

		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




support.focusin = "onfocusin" in window;


// Support: Firefox
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome, Safari
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



// Support: Android 2.3
// Workaround failure to string-cast null input
jQuery.parseJSON = function( data ) {
	return JSON.parse( data + "" );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE9
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// The jqXHR state
			state = 0,

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {

								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" ).replace( rhash, "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE8-11+
			// IE throws exception if url is malformed, e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE8-11+
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( state === 2 ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );

				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapAll( html.call( this, i ) );
			} );
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function() {
		return this.parent().each( function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		} ).end();
	}
} );


jQuery.expr.filters.hidden = function( elem ) {
	return !jQuery.expr.filters.visible( elem );
};
jQuery.expr.filters.visible = function( elem ) {

	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	// Use OR instead of AND as the element is not visible if either is true
	// See tickets #10406 and #13132
	return elem.offsetWidth > 0 || elem.offsetHeight > 0 || elem.getClientRects().length > 0;
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {

			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					} ) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE9
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = callback( "error" );

				// Support: IE9
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = jQuery.trim( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var docElem, win,
			elem = this[ 0 ],
			box = { top: 0, left: 0 },
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		box = elem.getBoundingClientRect();
		win = getWindow( doc );
		return {
			top: box.top + win.pageYOffset - docElem.clientTop,
			left: box.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari<7-8+, Chrome<37-44+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},
	size: function() {
		return this.length;
	}
} );

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}



var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}

return jQuery;
}));

},{}],4:[function(require,module,exports){
module.exports=require(3)
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxnaXRodWJcXGZ1bGxwYWdlLWJvaWxlcnBsYXRlXFxub2RlX21vZHVsZXNcXGd1bHAtYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJFOi9naXRodWIvZnVsbHBhZ2UtYm9pbGVycGxhdGUvamF2YXNjcmlwdHMvZmFrZV9lMzJhNjk1OC5qcyIsIkU6L2dpdGh1Yi9mdWxscGFnZS1ib2lsZXJwbGF0ZS9ub2RlX21vZHVsZXMvZnVsbHBhZ2UuanMvanF1ZXJ5LmZ1bGxQYWdlLmpzIiwiRTovZ2l0aHViL2Z1bGxwYWdlLWJvaWxlcnBsYXRlL25vZGVfbW9kdWxlcy9mdWxscGFnZS5qcy9ub2RlX21vZHVsZXMvanF1ZXJ5L2Rpc3QvanF1ZXJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2p2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XHJcbnZhciBmdWxscGFnZSA9IHJlcXVpcmUoJ2Z1bGxwYWdlLmpzJyk7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgc2VjdGlvbnNMZW5ndGggPSAkKCcuc2VjdGlvbicpLmxlbmd0aDtcclxuICAgIFxyXG4gICAgJCgnI2Z1bGxwYWdlJykuZnVsbHBhZ2Uoe1xyXG4gICAgICAgIG1lbnU6ICcjbWVudScsXHJcbiAgICAgICAgcGFkZGluZ1RvcDogNjAsIC8vIHRoaXMgdmFsdWUgc2hvdWxkIGJlIHRoZSBzYW1lIGFzIHRoZSBoZWFkZXIncyBoZWlnaHQgKDYwcHgpLlxyXG4gICAgICAgIGFmdGVyTG9hZDogZnVuY3Rpb24gKGFuY2hvckxpbmssIGluZGV4KSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMTogXHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI2J0bi1uZXh0Jykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI2J0bi1uZXh0Jykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgICAgICQoJyNidG4tbmV4dCcpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICAkKCcjYnRuLW5leHQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJC5mbi5mdWxscGFnZS5tb3ZlU2VjdGlvbkRvd24oKTtcclxuICAgIH0pO1xyXG59KTsiLCIvKiFcclxuICogZnVsbFBhZ2UgMi43LjlcclxuICogaHR0cHM6Ly9naXRodWIuY29tL2FsdmFyb3RyaWdvL2Z1bGxQYWdlLmpzXHJcbiAqIEBsaWNlbnNlIE1JVCBsaWNlbnNlZFxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTUgYWx2YXJvdHJpZ28uY29tIC0gQSBwcm9qZWN0IGJ5IEFsdmFybyBUcmlnb1xyXG4gKi9cclxuKGZ1bmN0aW9uKGdsb2JhbCwgZmFjdG9yeSkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgICAgIGRlZmluZShbJ2pxdWVyeSddLCBmdW5jdGlvbigkKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFjdG9yeSgkLCBnbG9iYWwsIGdsb2JhbC5kb2N1bWVudCwgZ2xvYmFsLk1hdGgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZSgnanF1ZXJ5JyksIGdsb2JhbCwgZ2xvYmFsLmRvY3VtZW50LCBnbG9iYWwuTWF0aCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZhY3RvcnkoalF1ZXJ5LCBnbG9iYWwsIGdsb2JhbC5kb2N1bWVudCwgZ2xvYmFsLk1hdGgpO1xyXG4gICAgfVxyXG59KSh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHRoaXMsIGZ1bmN0aW9uKCQsIHdpbmRvdywgZG9jdW1lbnQsIE1hdGgsIHVuZGVmaW5lZCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIC8vIGtlZXBpbmcgY2VudHJhbCBzZXQgb2YgY2xhc3NuYW1lcyBhbmQgc2VsZWN0b3JzXHJcbiAgICB2YXIgV1JBUFBFUiA9ICAgICAgICAgICAgICAgJ2Z1bGxwYWdlLXdyYXBwZXInO1xyXG4gICAgdmFyIFdSQVBQRVJfU0VMID0gICAgICAgICAgICcuJyArIFdSQVBQRVI7XHJcblxyXG4gICAgLy8gc2xpbXNjcm9sbFxyXG4gICAgdmFyIFNDUk9MTEFCTEUgPSAgICAgICAgICAgICdmcC1zY3JvbGxhYmxlJztcclxuICAgIHZhciBTQ1JPTExBQkxFX1NFTCA9ICAgICAgICAnLicgKyBTQ1JPTExBQkxFO1xyXG4gICAgdmFyIFNMSU1TQ1JPTExfQkFSX1NFTCA9ICAgICcuc2xpbVNjcm9sbEJhcic7XHJcbiAgICB2YXIgU0xJTVNDUk9MTF9SQUlMX1NFTCA9ICAgJy5zbGltU2Nyb2xsUmFpbCc7XHJcblxyXG4gICAgLy8gdXRpbFxyXG4gICAgdmFyIFJFU1BPTlNJVkUgPSAgICAgICAgICAgICdmcC1yZXNwb25zaXZlJztcclxuICAgIHZhciBOT19UUkFOU0lUSU9OID0gICAgICAgICAnZnAtbm90cmFuc2l0aW9uJztcclxuICAgIHZhciBERVNUUk9ZRUQgPSAgICAgICAgICAgICAnZnAtZGVzdHJveWVkJztcclxuICAgIHZhciBFTkFCTEVEID0gICAgICAgICAgICAgICAnZnAtZW5hYmxlZCc7XHJcbiAgICB2YXIgVklFV0lOR19QUkVGSVggPSAgICAgICAgJ2ZwLXZpZXdpbmcnO1xyXG4gICAgdmFyIEFDVElWRSA9ICAgICAgICAgICAgICAgICdhY3RpdmUnO1xyXG4gICAgdmFyIEFDVElWRV9TRUwgPSAgICAgICAgICAgICcuJyArIEFDVElWRTtcclxuICAgIHZhciBDT01QTEVURUxZID0gICAgICAgICAgICAnZnAtY29tcGxldGVseSc7XHJcbiAgICB2YXIgQ09NUExFVEVMWV9TRUwgPSAgICAgICAgJy4nICsgQ09NUExFVEVMWTtcclxuXHJcbiAgICAvLyBzZWN0aW9uXHJcbiAgICB2YXIgU0VDVElPTl9ERUZBVUxUX1NFTCA9ICAgJy5zZWN0aW9uJztcclxuICAgIHZhciBTRUNUSU9OID0gICAgICAgICAgICAgICAnZnAtc2VjdGlvbic7XHJcbiAgICB2YXIgU0VDVElPTl9TRUwgPSAgICAgICAgICAgJy4nICsgU0VDVElPTjtcclxuICAgIHZhciBTRUNUSU9OX0FDVElWRV9TRUwgPSAgICBTRUNUSU9OX1NFTCArIEFDVElWRV9TRUw7XHJcbiAgICB2YXIgU0VDVElPTl9GSVJTVF9TRUwgPSAgICAgU0VDVElPTl9TRUwgKyAnOmZpcnN0JztcclxuICAgIHZhciBTRUNUSU9OX0xBU1RfU0VMID0gICAgICBTRUNUSU9OX1NFTCArICc6bGFzdCc7XHJcbiAgICB2YXIgVEFCTEVfQ0VMTCA9ICAgICAgICAgICAgJ2ZwLXRhYmxlQ2VsbCc7XHJcbiAgICB2YXIgVEFCTEVfQ0VMTF9TRUwgPSAgICAgICAgJy4nICsgVEFCTEVfQ0VMTDtcclxuICAgIHZhciBBVVRPX0hFSUdIVCA9ICAgICAgICAgICAnZnAtYXV0by1oZWlnaHQnO1xyXG4gICAgdmFyIEFVVE9fSEVJR0hUX1NFTCA9ICAgICAgICcuZnAtYXV0by1oZWlnaHQnO1xyXG4gICAgdmFyIE5PUk1BTF9TQ1JPTEwgPSAgICAgICAgICdmcC1ub3JtYWwtc2Nyb2xsJztcclxuICAgIHZhciBOT1JNQUxfU0NST0xMX1NFTCA9ICAgICAnLmZwLW5vcm1hbC1zY3JvbGwnO1xyXG5cclxuICAgIC8vIHNlY3Rpb24gbmF2XHJcbiAgICB2YXIgU0VDVElPTl9OQVYgPSAgICAgICAgICAgJ2ZwLW5hdic7XHJcbiAgICB2YXIgU0VDVElPTl9OQVZfU0VMID0gICAgICAgJyMnICsgU0VDVElPTl9OQVY7XHJcbiAgICB2YXIgU0VDVElPTl9OQVZfVE9PTFRJUCA9ICAgJ2ZwLXRvb2x0aXAnO1xyXG4gICAgdmFyIFNFQ1RJT05fTkFWX1RPT0xUSVBfU0VMPScuJytTRUNUSU9OX05BVl9UT09MVElQO1xyXG4gICAgdmFyIFNIT1dfQUNUSVZFX1RPT0xUSVAgPSAgICdmcC1zaG93LWFjdGl2ZSc7XHJcblxyXG4gICAgLy8gc2xpZGVcclxuICAgIHZhciBTTElERV9ERUZBVUxUX1NFTCA9ICAgICAnLnNsaWRlJztcclxuICAgIHZhciBTTElERSA9ICAgICAgICAgICAgICAgICAnZnAtc2xpZGUnO1xyXG4gICAgdmFyIFNMSURFX1NFTCA9ICAgICAgICAgICAgICcuJyArIFNMSURFO1xyXG4gICAgdmFyIFNMSURFX0FDVElWRV9TRUwgPSAgICAgIFNMSURFX1NFTCArIEFDVElWRV9TRUw7XHJcbiAgICB2YXIgU0xJREVTX1dSQVBQRVIgPSAgICAgICAgJ2ZwLXNsaWRlcyc7XHJcbiAgICB2YXIgU0xJREVTX1dSQVBQRVJfU0VMID0gICAgJy4nICsgU0xJREVTX1dSQVBQRVI7XHJcbiAgICB2YXIgU0xJREVTX0NPTlRBSU5FUiA9ICAgICAgJ2ZwLXNsaWRlc0NvbnRhaW5lcic7XHJcbiAgICB2YXIgU0xJREVTX0NPTlRBSU5FUl9TRUwgPSAgJy4nICsgU0xJREVTX0NPTlRBSU5FUjtcclxuICAgIHZhciBUQUJMRSA9ICAgICAgICAgICAgICAgICAnZnAtdGFibGUnO1xyXG5cclxuICAgIC8vIHNsaWRlIG5hdlxyXG4gICAgdmFyIFNMSURFU19OQVYgPSAgICAgICAgICAgICdmcC1zbGlkZXNOYXYnO1xyXG4gICAgdmFyIFNMSURFU19OQVZfU0VMID0gICAgICAgICcuJyArIFNMSURFU19OQVY7XHJcbiAgICB2YXIgU0xJREVTX05BVl9MSU5LX1NFTCA9ICAgU0xJREVTX05BVl9TRUwgKyAnIGEnO1xyXG4gICAgdmFyIFNMSURFU19BUlJPVyA9ICAgICAgICAgICdmcC1jb250cm9sQXJyb3cnO1xyXG4gICAgdmFyIFNMSURFU19BUlJPV19TRUwgPSAgICAgICcuJyArIFNMSURFU19BUlJPVztcclxuICAgIHZhciBTTElERVNfUFJFViA9ICAgICAgICAgICAnZnAtcHJldic7XHJcbiAgICB2YXIgU0xJREVTX1BSRVZfU0VMID0gICAgICAgJy4nICsgU0xJREVTX1BSRVY7XHJcbiAgICB2YXIgU0xJREVTX0FSUk9XX1BSRVYgPSAgICAgU0xJREVTX0FSUk9XICsgJyAnICsgU0xJREVTX1BSRVY7XHJcbiAgICB2YXIgU0xJREVTX0FSUk9XX1BSRVZfU0VMID0gU0xJREVTX0FSUk9XX1NFTCArIFNMSURFU19QUkVWX1NFTDtcclxuICAgIHZhciBTTElERVNfTkVYVCA9ICAgICAgICAgICAnZnAtbmV4dCc7XHJcbiAgICB2YXIgU0xJREVTX05FWFRfU0VMID0gICAgICAgJy4nICsgU0xJREVTX05FWFQ7XHJcbiAgICB2YXIgU0xJREVTX0FSUk9XX05FWFQgPSAgICAgU0xJREVTX0FSUk9XICsgJyAnICsgU0xJREVTX05FWFQ7XHJcbiAgICB2YXIgU0xJREVTX0FSUk9XX05FWFRfU0VMID0gU0xJREVTX0FSUk9XX1NFTCArIFNMSURFU19ORVhUX1NFTDtcclxuXHJcbiAgICB2YXIgJHdpbmRvdyA9ICQod2luZG93KTtcclxuICAgIHZhciAkZG9jdW1lbnQgPSAkKGRvY3VtZW50KTtcclxuXHJcbiAgICB2YXIgZGVmYXVsdFNjcm9sbEhhbmRsZXI7XHJcblxyXG4gICAgJC5mbi5mdWxscGFnZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICAgICAgICAvL29ubHkgb25jZSBteSBmcmllbmQhXHJcbiAgICAgICAgaWYoJCgnaHRtbCcpLmhhc0NsYXNzKEVOQUJMRUQpKXsgZGlzcGxheVdhcm5pbmdzKCk7IHJldHVybiB9O1xyXG5cclxuICAgICAgICAvLyBjb21tb24galF1ZXJ5IG9iamVjdHNcclxuICAgICAgICB2YXIgJGh0bWxCb2R5ID0gJCgnaHRtbCwgYm9keScpO1xyXG4gICAgICAgIHZhciAkYm9keSA9ICQoJ2JvZHknKTtcclxuXHJcbiAgICAgICAgdmFyIEZQID0gJC5mbi5mdWxscGFnZTtcclxuICAgICAgICAvLyBDcmVhdGUgc29tZSBkZWZhdWx0cywgZXh0ZW5kaW5nIHRoZW0gd2l0aCBhbnkgb3B0aW9ucyB0aGF0IHdlcmUgcHJvdmlkZWRcclxuICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoe1xyXG4gICAgICAgICAgICAvL25hdmlnYXRpb25cclxuICAgICAgICAgICAgbWVudTogZmFsc2UsXHJcbiAgICAgICAgICAgIGFuY2hvcnM6W10sXHJcbiAgICAgICAgICAgIGxvY2tBbmNob3JzOiBmYWxzZSxcclxuICAgICAgICAgICAgbmF2aWdhdGlvbjogZmFsc2UsXHJcbiAgICAgICAgICAgIG5hdmlnYXRpb25Qb3NpdGlvbjogJ3JpZ2h0JyxcclxuICAgICAgICAgICAgbmF2aWdhdGlvblRvb2x0aXBzOiBbXSxcclxuICAgICAgICAgICAgc2hvd0FjdGl2ZVRvb2x0aXA6IGZhbHNlLFxyXG4gICAgICAgICAgICBzbGlkZXNOYXZpZ2F0aW9uOiBmYWxzZSxcclxuICAgICAgICAgICAgc2xpZGVzTmF2UG9zaXRpb246ICdib3R0b20nLFxyXG4gICAgICAgICAgICBzY3JvbGxCYXI6IGZhbHNlLFxyXG4gICAgICAgICAgICBoeWJyaWQ6IGZhbHNlLFxyXG5cclxuICAgICAgICAgICAgLy9zY3JvbGxpbmdcclxuICAgICAgICAgICAgY3NzMzogdHJ1ZSxcclxuICAgICAgICAgICAgc2Nyb2xsaW5nU3BlZWQ6IDcwMCxcclxuICAgICAgICAgICAgYXV0b1Njcm9sbGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgZml0VG9TZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICBmaXRUb1NlY3Rpb25EZWxheTogMTAwMCxcclxuICAgICAgICAgICAgZWFzaW5nOiAnZWFzZUluT3V0Q3ViaWMnLFxyXG4gICAgICAgICAgICBlYXNpbmdjc3MzOiAnZWFzZScsXHJcbiAgICAgICAgICAgIGxvb3BCb3R0b206IGZhbHNlLFxyXG4gICAgICAgICAgICBsb29wVG9wOiBmYWxzZSxcclxuICAgICAgICAgICAgbG9vcEhvcml6b250YWw6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbnRpbnVvdXNWZXJ0aWNhbDogZmFsc2UsXHJcbiAgICAgICAgICAgIG5vcm1hbFNjcm9sbEVsZW1lbnRzOiBudWxsLFxyXG4gICAgICAgICAgICBzY3JvbGxPdmVyZmxvdzogZmFsc2UsXHJcbiAgICAgICAgICAgIHNjcm9sbE92ZXJmbG93SGFuZGxlcjogZGVmYXVsdFNjcm9sbEhhbmRsZXIsXHJcbiAgICAgICAgICAgIHRvdWNoU2Vuc2l0aXZpdHk6IDUsXHJcbiAgICAgICAgICAgIG5vcm1hbFNjcm9sbEVsZW1lbnRUb3VjaFRocmVzaG9sZDogNSxcclxuXHJcbiAgICAgICAgICAgIC8vQWNjZXNzaWJpbGl0eVxyXG4gICAgICAgICAgICBrZXlib2FyZFNjcm9sbGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgYW5pbWF0ZUFuY2hvcjogdHJ1ZSxcclxuICAgICAgICAgICAgcmVjb3JkSGlzdG9yeTogdHJ1ZSxcclxuXHJcbiAgICAgICAgICAgIC8vZGVzaWduXHJcbiAgICAgICAgICAgIGNvbnRyb2xBcnJvd3M6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbnRyb2xBcnJvd0NvbG9yOiAnI2ZmZicsXHJcbiAgICAgICAgICAgIHZlcnRpY2FsQ2VudGVyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHJlc2l6ZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHNlY3Rpb25zQ29sb3IgOiBbXSxcclxuICAgICAgICAgICAgcGFkZGluZ1RvcDogMCxcclxuICAgICAgICAgICAgcGFkZGluZ0JvdHRvbTogMCxcclxuICAgICAgICAgICAgZml4ZWRFbGVtZW50czogbnVsbCxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZTogMCwgLy9iYWNrd2FyZHMgY29tcGFiaXRpbGl0eSB3aXRoIHJlc3BvbnNpdmVXaWRkdGhcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZVdpZHRoOiAwLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlSGVpZ2h0OiAwLFxyXG5cclxuICAgICAgICAgICAgLy9DdXN0b20gc2VsZWN0b3JzXHJcbiAgICAgICAgICAgIHNlY3Rpb25TZWxlY3RvcjogU0VDVElPTl9ERUZBVUxUX1NFTCxcclxuICAgICAgICAgICAgc2xpZGVTZWxlY3RvcjogU0xJREVfREVGQVVMVF9TRUwsXHJcblxyXG5cclxuICAgICAgICAgICAgLy9ldmVudHNcclxuICAgICAgICAgICAgYWZ0ZXJMb2FkOiBudWxsLFxyXG4gICAgICAgICAgICBvbkxlYXZlOiBudWxsLFxyXG4gICAgICAgICAgICBhZnRlclJlbmRlcjogbnVsbCxcclxuICAgICAgICAgICAgYWZ0ZXJSZXNpemU6IG51bGwsXHJcbiAgICAgICAgICAgIGFmdGVyUmVCdWlsZDogbnVsbCxcclxuICAgICAgICAgICAgYWZ0ZXJTbGlkZUxvYWQ6IG51bGwsXHJcbiAgICAgICAgICAgIG9uU2xpZGVMZWF2ZTogbnVsbFxyXG4gICAgICAgIH0sIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICBkaXNwbGF5V2FybmluZ3MoKTtcclxuXHJcbiAgICAgICAgLy9lYXNlSW5PdXRDdWJpYyBhbmltYXRpb24gaW5jbHVkZWQgaW4gdGhlIHBsdWdpblxyXG4gICAgICAgICQuZXh0ZW5kKCQuZWFzaW5nLHsgZWFzZUluT3V0Q3ViaWM6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7aWYgKCh0Lz1kLzIpIDwgMSkgcmV0dXJuIGMvMip0KnQqdCArIGI7cmV0dXJuIGMvMiooKHQtPTIpKnQqdCArIDIpICsgYjt9fSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogU2V0cyB0aGUgYXV0b1Njcm9sbCBvcHRpb24uXHJcbiAgICAgICAgKiBJdCBjaGFuZ2VzIHRoZSBzY3JvbGwgYmFyIHZpc2liaWxpdHkgYW5kIHRoZSBoaXN0b3J5IG9mIHRoZSBzaXRlIGFzIGEgcmVzdWx0LlxyXG4gICAgICAgICovXHJcbiAgICAgICAgRlAuc2V0QXV0b1Njcm9sbGluZyA9IGZ1bmN0aW9uKHZhbHVlLCB0eXBlKXtcclxuICAgICAgICAgICAgc2V0VmFyaWFibGVTdGF0ZSgnYXV0b1Njcm9sbGluZycsIHZhbHVlLCB0eXBlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gJChTRUNUSU9OX0FDVElWRV9TRUwpO1xyXG5cclxuICAgICAgICAgICAgaWYob3B0aW9ucy5hdXRvU2Nyb2xsaW5nICYmICFvcHRpb25zLnNjcm9sbEJhcil7XHJcbiAgICAgICAgICAgICAgICAkaHRtbEJvZHkuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAnb3ZlcmZsb3cnIDogJ2hpZGRlbicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCcgOiAnMTAwJSdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIEZQLnNldFJlY29yZEhpc3Rvcnkob3JpZ2luYWxzLnJlY29yZEhpc3RvcnksICdpbnRlcm5hbCcpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vZm9yIElFIHRvdWNoIGRldmljZXNcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICctbXMtdG91Y2gtYWN0aW9uJzogJ25vbmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICd0b3VjaC1hY3Rpb24nOiAnbm9uZSdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGVsZW1lbnQubGVuZ3RoKXtcclxuICAgICAgICAgICAgICAgICAgICAvL21vdmluZyB0aGUgY29udGFpbmVyIHVwXHJcbiAgICAgICAgICAgICAgICAgICAgc2lsZW50U2Nyb2xsKGVsZW1lbnQucG9zaXRpb24oKS50b3ApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAkaHRtbEJvZHkuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAnb3ZlcmZsb3cnIDogJ3Zpc2libGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICdoZWlnaHQnIDogJ2luaXRpYWwnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBGUC5zZXRSZWNvcmRIaXN0b3J5KGZhbHNlLCAnaW50ZXJuYWwnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL2ZvciBJRSB0b3VjaCBkZXZpY2VzXHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAnLW1zLXRvdWNoLWFjdGlvbic6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICd0b3VjaC1hY3Rpb24nOiAnJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgc2lsZW50U2Nyb2xsKDApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vc2Nyb2xsaW5nIHRoZSBwYWdlIHRvIHRoZSBzZWN0aW9uIHdpdGggbm8gYW5pbWF0aW9uXHJcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkaHRtbEJvZHkuc2Nyb2xsVG9wKGVsZW1lbnQucG9zaXRpb24oKS50b3ApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBEZWZpbmVzIHdoZXRlciB0byByZWNvcmQgdGhlIGhpc3RvcnkgZm9yIGVhY2ggaGFzaCBjaGFuZ2UgaW4gdGhlIFVSTC5cclxuICAgICAgICAqL1xyXG4gICAgICAgIEZQLnNldFJlY29yZEhpc3RvcnkgPSBmdW5jdGlvbih2YWx1ZSwgdHlwZSl7XHJcbiAgICAgICAgICAgIHNldFZhcmlhYmxlU3RhdGUoJ3JlY29yZEhpc3RvcnknLCB2YWx1ZSwgdHlwZSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBEZWZpbmVzIHRoZSBzY3JvbGxpbmcgc3BlZWRcclxuICAgICAgICAqL1xyXG4gICAgICAgIEZQLnNldFNjcm9sbGluZ1NwZWVkID0gZnVuY3Rpb24odmFsdWUsIHR5cGUpe1xyXG4gICAgICAgICAgICBzZXRWYXJpYWJsZVN0YXRlKCdzY3JvbGxpbmdTcGVlZCcsIHZhbHVlLCB0eXBlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIFNldHMgZml0VG9TZWN0aW9uXHJcbiAgICAgICAgKi9cclxuICAgICAgICBGUC5zZXRGaXRUb1NlY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSwgdHlwZSl7XHJcbiAgICAgICAgICAgIHNldFZhcmlhYmxlU3RhdGUoJ2ZpdFRvU2VjdGlvbicsIHZhbHVlLCB0eXBlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIFNldHMgbG9ja0FuY2hvcnNcclxuICAgICAgICAqL1xyXG4gICAgICAgIEZQLnNldExvY2tBbmNob3JzID0gZnVuY3Rpb24odmFsdWUpe1xyXG4gICAgICAgICAgICBvcHRpb25zLmxvY2tBbmNob3JzID0gdmFsdWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBBZGRzIG9yIHJlbW92ZSB0aGUgcG9zc2libGl0eSBvZiBzY3JvbGxpbmcgdGhyb3VnaCBzZWN0aW9ucyBieSB1c2luZyB0aGUgbW91c2Ugd2hlZWwgb3IgdGhlIHRyYWNrcGFkLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgRlAuc2V0TW91c2VXaGVlbFNjcm9sbGluZyA9IGZ1bmN0aW9uICh2YWx1ZSl7XHJcbiAgICAgICAgICAgIGlmKHZhbHVlKXtcclxuICAgICAgICAgICAgICAgIGFkZE1vdXNlV2hlZWxIYW5kbGVyKCk7XHJcbiAgICAgICAgICAgICAgICBhZGRNaWRkbGVXaGVlbEhhbmRsZXIoKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICByZW1vdmVNb3VzZVdoZWVsSGFuZGxlcigpO1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlTWlkZGxlV2hlZWxIYW5kbGVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIEFkZHMgb3IgcmVtb3ZlIHRoZSBwb3NzaWJsaXR5IG9mIHNjcm9sbGluZyB0aHJvdWdoIHNlY3Rpb25zIGJ5IHVzaW5nIHRoZSBtb3VzZSB3aGVlbC90cmFja3BhZCBvciB0b3VjaCBnZXN0dXJlcy5cclxuICAgICAgICAqIE9wdGlvbmFsbHkgYSBzZWNvbmQgcGFyYW1ldGVyIGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgdGhlIGRpcmVjdGlvbiBmb3Igd2hpY2ggdGhlIGFjdGlvbiB3aWxsIGJlIGFwcGxpZWQuXHJcbiAgICAgICAgKlxyXG4gICAgICAgICogQHBhcmFtIGRpcmVjdGlvbnMgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIGRpcmVjdGlvbiBvciBkaXJlY3Rpb25zIHNlcGFyYXRlZCBieSBjb21tYS5cclxuICAgICAgICAqL1xyXG4gICAgICAgIEZQLnNldEFsbG93U2Nyb2xsaW5nID0gZnVuY3Rpb24gKHZhbHVlLCBkaXJlY3Rpb25zKXtcclxuICAgICAgICAgICAgaWYodHlwZW9mIGRpcmVjdGlvbnMgIT09ICd1bmRlZmluZWQnKXtcclxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbnMgPSBkaXJlY3Rpb25zLnJlcGxhY2UoLyAvZywnJykuc3BsaXQoJywnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkLmVhY2goZGlyZWN0aW9ucywgZnVuY3Rpb24gKGluZGV4LCBkaXJlY3Rpb24pe1xyXG4gICAgICAgICAgICAgICAgICAgIHNldElzU2Nyb2xsQWxsb3dlZCh2YWx1ZSwgZGlyZWN0aW9uLCAnbScpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih2YWx1ZSl7XHJcbiAgICAgICAgICAgICAgICBGUC5zZXRNb3VzZVdoZWVsU2Nyb2xsaW5nKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgYWRkVG91Y2hIYW5kbGVyKCk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgRlAuc2V0TW91c2VXaGVlbFNjcm9sbGluZyhmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICByZW1vdmVUb3VjaEhhbmRsZXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogQWRkcyBvciByZW1vdmUgdGhlIHBvc3NpYmxpdHkgb2Ygc2Nyb2xsaW5nIHRocm91Z2ggc2VjdGlvbnMgYnkgdXNpbmcgdGhlIGtleWJvYXJkIGFycm93IGtleXNcclxuICAgICAgICAqL1xyXG4gICAgICAgIEZQLnNldEtleWJvYXJkU2Nyb2xsaW5nID0gZnVuY3Rpb24gKHZhbHVlLCBkaXJlY3Rpb25zKXtcclxuICAgICAgICAgICAgaWYodHlwZW9mIGRpcmVjdGlvbnMgIT09ICd1bmRlZmluZWQnKXtcclxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbnMgPSBkaXJlY3Rpb25zLnJlcGxhY2UoLyAvZywnJykuc3BsaXQoJywnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkLmVhY2goZGlyZWN0aW9ucywgZnVuY3Rpb24gKGluZGV4LCBkaXJlY3Rpb24pe1xyXG4gICAgICAgICAgICAgICAgICAgIHNldElzU2Nyb2xsQWxsb3dlZCh2YWx1ZSwgZGlyZWN0aW9uLCAnaycpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5rZXlib2FyZFNjcm9sbGluZyA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBNb3ZlcyB0aGUgcGFnZSB1cCBvbmUgc2VjdGlvbi5cclxuICAgICAgICAqL1xyXG4gICAgICAgIEZQLm1vdmVTZWN0aW9uVXAgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB2YXIgcHJldiA9ICQoU0VDVElPTl9BQ1RJVkVfU0VMKS5wcmV2KFNFQ1RJT05fU0VMKTtcclxuXHJcbiAgICAgICAgICAgIC8vbG9vcGluZyB0byB0aGUgYm90dG9tIGlmIHRoZXJlJ3Mgbm8gbW9yZSBzZWN0aW9ucyBhYm92ZVxyXG4gICAgICAgICAgICBpZiAoIXByZXYubGVuZ3RoICYmIChvcHRpb25zLmxvb3BUb3AgfHwgb3B0aW9ucy5jb250aW51b3VzVmVydGljYWwpKSB7XHJcbiAgICAgICAgICAgICAgICBwcmV2ID0gJChTRUNUSU9OX1NFTCkubGFzdCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocHJldi5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFBhZ2UocHJldiwgbnVsbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIE1vdmVzIHRoZSBwYWdlIGRvd24gb25lIHNlY3Rpb24uXHJcbiAgICAgICAgKi9cclxuICAgICAgICBGUC5tb3ZlU2VjdGlvbkRvd24gPSBmdW5jdGlvbiAoKXtcclxuICAgICAgICAgICAgdmFyIG5leHQgPSAkKFNFQ1RJT05fQUNUSVZFX1NFTCkubmV4dChTRUNUSU9OX1NFTCk7XHJcblxyXG4gICAgICAgICAgICAvL2xvb3BpbmcgdG8gdGhlIHRvcCBpZiB0aGVyZSdzIG5vIG1vcmUgc2VjdGlvbnMgYmVsb3dcclxuICAgICAgICAgICAgaWYoIW5leHQubGVuZ3RoICYmXHJcbiAgICAgICAgICAgICAgICAob3B0aW9ucy5sb29wQm90dG9tIHx8IG9wdGlvbnMuY29udGludW91c1ZlcnRpY2FsKSl7XHJcbiAgICAgICAgICAgICAgICBuZXh0ID0gJChTRUNUSU9OX1NFTCkuZmlyc3QoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYobmV4dC5sZW5ndGgpe1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsUGFnZShuZXh0LCBudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIE1vdmVzIHRoZSBwYWdlIHRvIHRoZSBnaXZlbiBzZWN0aW9uIGFuZCBzbGlkZSB3aXRoIG5vIGFuaW1hdGlvbi5cclxuICAgICAgICAqIEFuY2hvcnMgb3IgaW5kZXggcG9zaXRpb25zIGNhbiBiZSB1c2VkIGFzIHBhcmFtcy5cclxuICAgICAgICAqL1xyXG4gICAgICAgIEZQLnNpbGVudE1vdmVUbyA9IGZ1bmN0aW9uKHNlY3Rpb25BbmNob3IsIHNsaWRlQW5jaG9yKXtcclxuICAgICAgICAgICAgRlAuc2V0U2Nyb2xsaW5nU3BlZWQgKDAsICdpbnRlcm5hbCcpO1xyXG4gICAgICAgICAgICBGUC5tb3ZlVG8oc2VjdGlvbkFuY2hvciwgc2xpZGVBbmNob3IpXHJcbiAgICAgICAgICAgIEZQLnNldFNjcm9sbGluZ1NwZWVkIChvcmlnaW5hbHMuc2Nyb2xsaW5nU3BlZWQsICdpbnRlcm5hbCcpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogTW92ZXMgdGhlIHBhZ2UgdG8gdGhlIGdpdmVuIHNlY3Rpb24gYW5kIHNsaWRlLlxyXG4gICAgICAgICogQW5jaG9ycyBvciBpbmRleCBwb3NpdGlvbnMgY2FuIGJlIHVzZWQgYXMgcGFyYW1zLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgRlAubW92ZVRvID0gZnVuY3Rpb24gKHNlY3Rpb25BbmNob3IsIHNsaWRlQW5jaG9yKXtcclxuICAgICAgICAgICAgdmFyIGRlc3RpbnkgPSBnZXRTZWN0aW9uQnlBbmNob3Ioc2VjdGlvbkFuY2hvcik7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHNsaWRlQW5jaG9yICE9PSAndW5kZWZpbmVkJyl7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxQYWdlQW5kU2xpZGUoc2VjdGlvbkFuY2hvciwgc2xpZGVBbmNob3IpO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZihkZXN0aW55Lmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsUGFnZShkZXN0aW55KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogU2xpZGVzIHJpZ2h0IHRoZSBzbGlkZXIgb2YgdGhlIGFjdGl2ZSBzZWN0aW9uLlxyXG4gICAgICAgICogT3B0aW9uYWwgYHNlY3Rpb25gIHBhcmFtLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgRlAubW92ZVNsaWRlUmlnaHQgPSBmdW5jdGlvbihzZWN0aW9uKXtcclxuICAgICAgICAgICAgbW92ZVNsaWRlKCduZXh0Jywgc2VjdGlvbik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBTbGlkZXMgbGVmdCB0aGUgc2xpZGVyIG9mIHRoZSBhY3RpdmUgc2VjdGlvbi5cclxuICAgICAgICAqIE9wdGlvbmFsIGBzZWN0aW9uYCBwYXJhbS5cclxuICAgICAgICAqL1xyXG4gICAgICAgIEZQLm1vdmVTbGlkZUxlZnQgPSBmdW5jdGlvbihzZWN0aW9uKXtcclxuICAgICAgICAgICAgbW92ZVNsaWRlKCdwcmV2Jywgc2VjdGlvbik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogV2hlbiByZXNpemluZyBpcyBmaW5pc2hlZCwgd2UgYWRqdXN0IHRoZSBzbGlkZXMgc2l6ZXMgYW5kIHBvc2l0aW9uc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEZQLnJlQnVpbGQgPSBmdW5jdGlvbihyZXNpemluZyl7XHJcbiAgICAgICAgICAgIGlmKGNvbnRhaW5lci5oYXNDbGFzcyhERVNUUk9ZRUQpKXsgcmV0dXJuOyB9ICAvL25vdGhpbmcgdG8gZG8gaWYgdGhlIHBsdWdpbiB3YXMgZGVzdHJveWVkXHJcblxyXG4gICAgICAgICAgICBpc1Jlc2l6aW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHZhciB3aW5kb3dzV2lkdGggPSAkd2luZG93Lm91dGVyV2lkdGgoKTtcclxuICAgICAgICAgICAgd2luZG93c0hlaWdodCA9ICR3aW5kb3cuaGVpZ2h0KCk7ICAvL3VwZGF0aW5nIGdsb2JhbCB2YXJcclxuXHJcbiAgICAgICAgICAgIC8vdGV4dCByZXNpemluZ1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5yZXNpemUpIHtcclxuICAgICAgICAgICAgICAgIHJlc2l6ZU1lKHdpbmRvd3NIZWlnaHQsIHdpbmRvd3NXaWR0aCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQoU0VDVElPTl9TRUwpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHZhciBzbGlkZXNXcmFwID0gJCh0aGlzKS5maW5kKFNMSURFU19XUkFQUEVSX1NFTCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2xpZGVzID0gJCh0aGlzKS5maW5kKFNMSURFX1NFTCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9hZGp1c3RpbmcgdGhlIGhlaWdodCBvZiB0aGUgdGFibGUtY2VsbCBmb3IgSUUgYW5kIEZpcmVmb3hcclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnMudmVydGljYWxDZW50ZXJlZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKFRBQkxFX0NFTExfU0VMKS5jc3MoJ2hlaWdodCcsIGdldFRhYmxlSGVpZ2h0KCQodGhpcykpICsgJ3B4Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ2hlaWdodCcsIHdpbmRvd3NIZWlnaHQgKyAncHgnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL3Jlc2l6aW5nIHRoZSBzY3JvbGxpbmcgZGl2c1xyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9ucy5zY3JvbGxPdmVyZmxvdyl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc2xpZGVzLmxlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlcy5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVTbGltU2Nyb2xsaW5nKCQodGhpcykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlU2xpbVNjcm9sbGluZygkKHRoaXMpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy9hZGp1c3RpbmcgdGhlIHBvc2l0aW9uIGZvIHRoZSBGVUxMIFdJRFRIIHNsaWRlcy4uLlxyXG4gICAgICAgICAgICAgICAgaWYgKHNsaWRlcy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFuZHNjYXBlU2Nyb2xsKHNsaWRlc1dyYXAsIHNsaWRlc1dyYXAuZmluZChTTElERV9BQ1RJVkVfU0VMKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFjdGl2ZVNlY3Rpb24gPSAkKFNFQ1RJT05fQUNUSVZFX1NFTCk7XHJcbiAgICAgICAgICAgIHZhciBzZWN0aW9uSW5kZXggPSBhY3RpdmVTZWN0aW9uLmluZGV4KFNFQ1RJT05fU0VMKTtcclxuXHJcbiAgICAgICAgICAgIC8vaXNuJ3QgaXQgdGhlIGZpcnN0IHNlY3Rpb24/XHJcbiAgICAgICAgICAgIGlmKHNlY3Rpb25JbmRleCl7XHJcbiAgICAgICAgICAgICAgICAvL2FkanVzdGluZyB0aGUgcG9zaXRpb24gZm9yIHRoZSBjdXJyZW50IHNlY3Rpb25cclxuICAgICAgICAgICAgICAgIEZQLnNpbGVudE1vdmVUbyhzZWN0aW9uSW5kZXggKyAxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaXNSZXNpemluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAkLmlzRnVuY3Rpb24oIG9wdGlvbnMuYWZ0ZXJSZXNpemUgKSAmJiByZXNpemluZyAmJiBvcHRpb25zLmFmdGVyUmVzaXplLmNhbGwoY29udGFpbmVyKTtcclxuICAgICAgICAgICAgJC5pc0Z1bmN0aW9uKCBvcHRpb25zLmFmdGVyUmVCdWlsZCApICYmICFyZXNpemluZyAmJiBvcHRpb25zLmFmdGVyUmVCdWlsZC5jYWxsKGNvbnRhaW5lcik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBUdXJucyBmdWxsUGFnZS5qcyB0byBub3JtYWwgc2Nyb2xsaW5nIG1vZGUgd2hlbiB0aGUgdmlld3BvcnQgYHdpZHRoYCBvciBgaGVpZ2h0YFxyXG4gICAgICAgICogYXJlIHNtYWxsZXIgdGhhbiB0aGUgc2V0IGxpbWl0IHZhbHVlcy5cclxuICAgICAgICAqL1xyXG4gICAgICAgIEZQLnNldFJlc3BvbnNpdmUgPSBmdW5jdGlvbiAoYWN0aXZlKXtcclxuICAgICAgICAgICAgdmFyIGlzUmVzcG9uc2l2ZSA9ICRib2R5Lmhhc0NsYXNzKFJFU1BPTlNJVkUpO1xyXG5cclxuICAgICAgICAgICAgaWYoYWN0aXZlKXtcclxuICAgICAgICAgICAgICAgIGlmKCFpc1Jlc3BvbnNpdmUpe1xyXG4gICAgICAgICAgICAgICAgICAgIEZQLnNldEF1dG9TY3JvbGxpbmcoZmFsc2UsICdpbnRlcm5hbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIEZQLnNldEZpdFRvU2VjdGlvbihmYWxzZSwgJ2ludGVybmFsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJChTRUNUSU9OX05BVl9TRUwpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAkYm9keS5hZGRDbGFzcyhSRVNQT05TSVZFKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKGlzUmVzcG9uc2l2ZSl7XHJcbiAgICAgICAgICAgICAgICBGUC5zZXRBdXRvU2Nyb2xsaW5nKG9yaWdpbmFscy5hdXRvU2Nyb2xsaW5nLCAnaW50ZXJuYWwnKTtcclxuICAgICAgICAgICAgICAgIEZQLnNldEZpdFRvU2VjdGlvbihvcmlnaW5hbHMuYXV0b1Njcm9sbGluZywgJ2ludGVybmFsJyk7XHJcbiAgICAgICAgICAgICAgICAkKFNFQ1RJT05fTkFWX1NFTCkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgJGJvZHkucmVtb3ZlQ2xhc3MoUkVTUE9OU0lWRSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vZmxhZyB0byBhdm9pZCB2ZXJ5IGZhc3Qgc2xpZGluZyBmb3IgbGFuZHNjYXBlIHNsaWRlcnNcclxuICAgICAgICB2YXIgc2xpZGVNb3ZpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdmFyIGlzVG91Y2hEZXZpY2UgPSBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC8oaVBob25lfGlQb2R8aVBhZHxBbmRyb2lkfHBsYXlib29rfHNpbGt8QmxhY2tCZXJyeXxCQjEwfFdpbmRvd3MgUGhvbmV8VGl6ZW58QmFkYXx3ZWJPU3xJRU1vYmlsZXxPcGVyYSBNaW5pKS8pO1xyXG4gICAgICAgIHZhciBpc1RvdWNoID0gKCgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpIHx8IChuYXZpZ2F0b3IubXNNYXhUb3VjaFBvaW50cyA+IDApIHx8IChuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMpKTtcclxuICAgICAgICB2YXIgY29udGFpbmVyID0gJCh0aGlzKTtcclxuICAgICAgICB2YXIgd2luZG93c0hlaWdodCA9ICR3aW5kb3cuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIGlzUmVzaXppbmcgPSBmYWxzZTtcclxuICAgICAgICB2YXIgaXNXaW5kb3dGb2N1c2VkID0gdHJ1ZTtcclxuICAgICAgICB2YXIgbGFzdFNjcm9sbGVkRGVzdGlueTtcclxuICAgICAgICB2YXIgbGFzdFNjcm9sbGVkU2xpZGU7XHJcbiAgICAgICAgdmFyIGNhblNjcm9sbCA9IHRydWU7XHJcbiAgICAgICAgdmFyIHNjcm9sbGluZ3MgPSBbXTtcclxuICAgICAgICB2YXIgbmF2O1xyXG4gICAgICAgIHZhciBjb250cm9sUHJlc3NlZDtcclxuICAgICAgICB2YXIgaXNTY3JvbGxBbGxvd2VkID0ge307XHJcbiAgICAgICAgaXNTY3JvbGxBbGxvd2VkLm0gPSB7ICAndXAnOnRydWUsICdkb3duJzp0cnVlLCAnbGVmdCc6dHJ1ZSwgJ3JpZ2h0Jzp0cnVlIH07XHJcbiAgICAgICAgaXNTY3JvbGxBbGxvd2VkLmsgPSAkLmV4dGVuZCh0cnVlLHt9LCBpc1Njcm9sbEFsbG93ZWQubSk7XHJcbiAgICAgICAgdmFyIG9yaWdpbmFscyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBvcHRpb25zKTsgLy9kZWVwIGNvcHlcclxuXHJcbiAgICAgICAgLy90aW1lb3V0c1xyXG4gICAgICAgIHZhciByZXNpemVJZDtcclxuICAgICAgICB2YXIgYWZ0ZXJTZWN0aW9uTG9hZHNJZDtcclxuICAgICAgICB2YXIgYWZ0ZXJTbGlkZUxvYWRzSWQ7XHJcbiAgICAgICAgdmFyIHNjcm9sbElkO1xyXG4gICAgICAgIHZhciBzY3JvbGxJZDI7XHJcbiAgICAgICAgdmFyIGtleWRvd25JZDtcclxuXHJcbiAgICAgICAgaWYoJCh0aGlzKS5sZW5ndGgpe1xyXG4gICAgICAgICAgICBpbml0KCk7XHJcbiAgICAgICAgICAgIGJpbmRFdmVudHMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoKXtcclxuICAgICAgICAgICAgLy9pZiBjc3MzIGlzIG5vdCBzdXBwb3J0ZWQsIGl0IHdpbGwgdXNlIGpRdWVyeSBhbmltYXRpb25zXHJcbiAgICAgICAgICAgIGlmKG9wdGlvbnMuY3NzMyl7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLmNzczMgPSBzdXBwb3J0M2QoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgb3B0aW9ucy5zY3JvbGxCYXIgPSBvcHRpb25zLnNjcm9sbEJhciB8fCBvcHRpb25zLmh5YnJpZDtcclxuXHJcblxyXG4gICAgICAgICAgICBzZXRPcHRpb25zRnJvbURPTSgpO1xyXG5cclxuICAgICAgICAgICAgcHJlcGFyZURvbSgpO1xyXG4gICAgICAgICAgICBGUC5zZXRBbGxvd1Njcm9sbGluZyh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIEZQLnNldEF1dG9TY3JvbGxpbmcob3B0aW9ucy5hdXRvU2Nyb2xsaW5nLCAnaW50ZXJuYWwnKTtcclxuXHJcbiAgICAgICAgICAgIC8vdGhlIHN0YXJ0aW5nIHBvaW50IGlzIGEgc2xpZGU/XHJcbiAgICAgICAgICAgIHZhciBhY3RpdmVTbGlkZSA9ICQoU0VDVElPTl9BQ1RJVkVfU0VMKS5maW5kKFNMSURFX0FDVElWRV9TRUwpO1xyXG5cclxuICAgICAgICAgICAgLy90aGUgYWN0aXZlIHNlY3Rpb24gaXNuJ3QgdGhlIGZpcnN0IG9uZT8gSXMgbm90IHRoZSBmaXJzdCBzbGlkZSBvZiB0aGUgZmlyc3Qgc2VjdGlvbj8gVGhlbiB3ZSBsb2FkIHRoYXQgc2VjdGlvbi9zbGlkZSBieSBkZWZhdWx0LlxyXG4gICAgICAgICAgICBpZiggYWN0aXZlU2xpZGUubGVuZ3RoICYmICAoJChTRUNUSU9OX0FDVElWRV9TRUwpLmluZGV4KFNFQ1RJT05fU0VMKSAhPT0gMCB8fCAoJChTRUNUSU9OX0FDVElWRV9TRUwpLmluZGV4KFNFQ1RJT05fU0VMKSA9PT0gMCAmJiBhY3RpdmVTbGlkZS5pbmRleCgpICE9PSAwKSkpe1xyXG4gICAgICAgICAgICAgICAgc2lsZW50TGFuZHNjYXBlU2Nyb2xsKGFjdGl2ZVNsaWRlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVzcG9uc2l2ZSgpO1xyXG5cclxuICAgICAgICAgICAgLy9zZXR0aW5nIHRoZSBjbGFzcyBmb3IgdGhlIGJvZHkgZWxlbWVudFxyXG4gICAgICAgICAgICBzZXRCb2R5Q2xhc3MoKTtcclxuXHJcbiAgICAgICAgICAgICR3aW5kb3cub24oJ2xvYWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvQW5jaG9yKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYmluZEV2ZW50cygpe1xyXG4gICAgICAgICAgICAkd2luZG93XHJcbiAgICAgICAgICAgICAgICAvL3doZW4gc2Nyb2xsaW5nLi4uXHJcbiAgICAgICAgICAgICAgICAub24oJ3Njcm9sbCcsIHNjcm9sbEhhbmRsZXIpXHJcblxyXG4gICAgICAgICAgICAgICAgLy9kZXRlY3RpbmcgYW55IGNoYW5nZSBvbiB0aGUgVVJMIHRvIHNjcm9sbCB0byB0aGUgZ2l2ZW4gYW5jaG9yIGxpbmtcclxuICAgICAgICAgICAgICAgIC8vKGEgd2F5IHRvIGRldGVjdCBiYWNrIGhpc3RvcnkgYnV0dG9uIGFzIHdlIHBsYXkgd2l0aCB0aGUgaGFzaGVzIG9uIHRoZSBVUkwpXHJcbiAgICAgICAgICAgICAgICAub24oJ2hhc2hjaGFuZ2UnLCBoYXNoQ2hhbmdlSGFuZGxlcilcclxuXHJcbiAgICAgICAgICAgICAgICAvL3doZW4gb3BlbmluZyBhIG5ldyB0YWIgKGN0cmwgKyB0KSwgYGNvbnRyb2xgIHdvbid0IGJlIHByZXNzZWQgd2hlbiBjb21taW5nIGJhY2suXHJcbiAgICAgICAgICAgICAgICAuYmx1cihibHVySGFuZGxlcilcclxuXHJcbiAgICAgICAgICAgICAgICAvL3doZW4gcmVzaXppbmcgdGhlIHNpdGUsIHdlIGFkanVzdCB0aGUgaGVpZ2h0cyBvZiB0aGUgc2VjdGlvbnMsIHNsaW1TY3JvbGwuLi5cclxuICAgICAgICAgICAgICAgIC5yZXNpemUocmVzaXplSGFuZGxlcik7XHJcblxyXG4gICAgICAgICAgICAkZG9jdW1lbnRcclxuICAgICAgICAgICAgICAgIC8vU2xpZGluZyB3aXRoIGFycm93IGtleXMsIGJvdGgsIHZlcnRpY2FsIGFuZCBob3Jpem9udGFsXHJcbiAgICAgICAgICAgICAgICAua2V5ZG93bihrZXlkb3duSGFuZGxlcilcclxuXHJcbiAgICAgICAgICAgICAgICAvL3RvIHByZXZlbnQgc2Nyb2xsaW5nIHdoaWxlIHpvb21pbmdcclxuICAgICAgICAgICAgICAgIC5rZXl1cChrZXlVcEhhbmRsZXIpXHJcblxyXG4gICAgICAgICAgICAgICAgLy9TY3JvbGxzIHRvIHRoZSBzZWN0aW9uIHdoZW4gY2xpY2tpbmcgdGhlIG5hdmlnYXRpb24gYnVsbGV0XHJcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCBTRUNUSU9OX05BVl9TRUwgKyAnIGEnLCBzZWN0aW9uQnVsbGV0SGFuZGxlcilcclxuXHJcbiAgICAgICAgICAgICAgICAvL1Njcm9sbHMgdGhlIHNsaWRlciB0byB0aGUgZ2l2ZW4gc2xpZGUgZGVzdGluYXRpb24gZm9yIHRoZSBnaXZlbiBzZWN0aW9uXHJcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCBTTElERVNfTkFWX0xJTktfU0VMLCBzbGlkZUJ1bGxldEhhbmRsZXIpXHJcblxyXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIFNFQ1RJT05fTkFWX1RPT0xUSVBfU0VMLCB0b29sdGlwVGV4dEhhbmRsZXIpO1xyXG5cclxuICAgICAgICAgICAgLy9TY3JvbGxpbmcgaG9yaXpvbnRhbGx5IHdoZW4gY2xpY2tpbmcgb24gdGhlIHNsaWRlciBjb250cm9scy5cclxuICAgICAgICAgICAgJChTRUNUSU9OX1NFTCkub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCBTTElERVNfQVJST1dfU0VMLCBzbGlkZUFycm93SGFuZGxlcik7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgKiBBcHBseWluZyBub3JtYWxTY3JvbGwgZWxlbWVudHMuXHJcbiAgICAgICAgICAgICogSWdub3JpbmcgdGhlIHNjcm9sbHMgb3ZlciB0aGUgc3BlY2lmaWVkIHNlbGVjdG9ycy5cclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYob3B0aW9ucy5ub3JtYWxTY3JvbGxFbGVtZW50cyl7XHJcbiAgICAgICAgICAgICAgICAkZG9jdW1lbnQub24oJ21vdXNlZW50ZXInLCBvcHRpb25zLm5vcm1hbFNjcm9sbEVsZW1lbnRzLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgRlAuc2V0TW91c2VXaGVlbFNjcm9sbGluZyhmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAkZG9jdW1lbnQub24oJ21vdXNlbGVhdmUnLCBvcHRpb25zLm5vcm1hbFNjcm9sbEVsZW1lbnRzLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIEZQLnNldE1vdXNlV2hlZWxTY3JvbGxpbmcodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBTZXR0aW5nIG9wdGlvbnMgZnJvbSBET00gZWxlbWVudHMgaWYgdGhleSBhcmUgbm90IHByb3ZpZGVkLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0T3B0aW9uc0Zyb21ET00oKXtcclxuICAgICAgICAgICAgLy9ubyBhbmNob3JzIG9wdGlvbj8gQ2hlY2tpbmcgZm9yIHRoZW0gaW4gdGhlIERPTSBhdHRyaWJ1dGVzXHJcbiAgICAgICAgICAgIGlmKCFvcHRpb25zLmFuY2hvcnMubGVuZ3RoKXtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMuYW5jaG9ycyA9ICQob3B0aW9ucy5zZWN0aW9uU2VsZWN0b3IgKyAnW2RhdGEtYW5jaG9yXScpLm1hcChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkKHRoaXMpLmRhdGEoJ2FuY2hvcicpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICB9KS5nZXQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9ubyB0b29sdGlwb3Mgb3B0aW9uPyBDaGVja2luZyBmb3IgdGhlbSBpbiB0aGUgRE9NIGF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgaWYoIW9wdGlvbnMubmF2aWdhdGlvblRvb2x0aXBzLmxlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLm5hdmlnYXRpb25Ub29sdGlwcyA9ICQob3B0aW9ucy5zZWN0aW9uU2VsZWN0b3IgKyAnW2RhdGEtdG9vbHRpcF0nKS5tYXAoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJCh0aGlzKS5kYXRhKCd0b29sdGlwJykudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgIH0pLmdldCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIFdvcmtzIG92ZXIgdGhlIERPTSBzdHJ1Y3R1cmUgdG8gc2V0IGl0IHVwIGZvciB0aGUgY3VycmVudCBmdWxscGFnZSBvcHRpb25zcy5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHByZXBhcmVEb20oKXtcclxuICAgICAgICAgICAgY29udGFpbmVyLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxyXG4gICAgICAgICAgICAgICAgJ3Bvc2l0aW9uJzogJ3JlbGF0aXZlJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vYWRkaW5nIGEgY2xhc3MgdG8gcmVjb2duaXplIHRoZSBjb250YWluZXIgaW50ZXJuYWxseSBpbiB0aGUgY29kZVxyXG4gICAgICAgICAgICBjb250YWluZXIuYWRkQ2xhc3MoV1JBUFBFUik7XHJcbiAgICAgICAgICAgICQoJ2h0bWwnKS5hZGRDbGFzcyhFTkFCTEVEKTtcclxuXHJcbiAgICAgICAgICAgIC8vZHVlIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9hbHZhcm90cmlnby9mdWxsUGFnZS5qcy9pc3N1ZXMvMTUwMlxyXG4gICAgICAgICAgICB3aW5kb3dzSGVpZ2h0ID0gJHdpbmRvdy5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5yZW1vdmVDbGFzcyhERVNUUk9ZRUQpOyAvL2luIGNhc2UgaXQgd2FzIGRlc3Ryb3llZCBiZWZvcmUgaW5pdGlsaXppbmcgaXQgYWdhaW5cclxuXHJcbiAgICAgICAgICAgIGFkZEludGVybmFsU2VsZWN0b3JzKCk7XHJcblxyXG4gICAgICAgICAgICAgLy9zdHlsaW5nIHRoZSBzZWN0aW9ucyAvIHNsaWRlcyAvIG1lbnVcclxuICAgICAgICAgICAgJChTRUNUSU9OX1NFTCkuZWFjaChmdW5jdGlvbihpbmRleCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VjdGlvbiA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2xpZGVzID0gc2VjdGlvbi5maW5kKFNMSURFX1NFTCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbnVtU2xpZGVzID0gc2xpZGVzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgICBzdHlsZVNlY3Rpb24oc2VjdGlvbiwgaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgc3R5bGVNZW51KHNlY3Rpb24sIGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGVyZSdzIGFueSBzbGlkZVxyXG4gICAgICAgICAgICAgICAgaWYgKG51bVNsaWRlcyA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZVNsaWRlcyhzZWN0aW9uLCBzbGlkZXMsIG51bVNsaWRlcyk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBpZihvcHRpb25zLnZlcnRpY2FsQ2VudGVyZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRUYWJsZUNsYXNzKHNlY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvL2ZpeGVkIGVsZW1lbnRzIG5lZWQgdG8gYmUgbW92ZWQgb3V0IG9mIHRoZSBwbHVnaW4gY29udGFpbmVyIGR1ZSB0byBwcm9ibGVtcyB3aXRoIENTUzMuXHJcbiAgICAgICAgICAgIGlmKG9wdGlvbnMuZml4ZWRFbGVtZW50cyAmJiBvcHRpb25zLmNzczMpe1xyXG4gICAgICAgICAgICAgICAgJChvcHRpb25zLmZpeGVkRWxlbWVudHMpLmFwcGVuZFRvKCRib2R5KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy92ZXJ0aWNhbCBjZW50ZXJlZCBvZiB0aGUgbmF2aWdhdGlvbiArIGFjdGl2ZSBidWxsZXRcclxuICAgICAgICAgICAgaWYob3B0aW9ucy5uYXZpZ2F0aW9uKXtcclxuICAgICAgICAgICAgICAgIGFkZFZlcnRpY2FsTmF2aWdhdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihvcHRpb25zLnNjcm9sbE92ZXJmbG93KXtcclxuICAgICAgICAgICAgICAgIGlmKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZVNsaW1TY3JvbGxpbmdIYW5kbGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvL2FmdGVyIERPTSBhbmQgaW1hZ2VzIGFyZSBsb2FkZWRcclxuICAgICAgICAgICAgICAgICR3aW5kb3cub24oJ2xvYWQnLCBjcmVhdGVTbGltU2Nyb2xsaW5nSGFuZGxlcik7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgYWZ0ZXJSZW5kZXJBY3Rpb25zKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogU3R5bGVzIHRoZSBob3Jpem9udGFsIHNsaWRlcyBmb3IgYSBzZWN0aW9uLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gc3R5bGVTbGlkZXMoc2VjdGlvbiwgc2xpZGVzLCBudW1TbGlkZXMpe1xyXG4gICAgICAgICAgICB2YXIgc2xpZGVyV2lkdGggPSBudW1TbGlkZXMgKiAxMDA7XHJcbiAgICAgICAgICAgIHZhciBzbGlkZVdpZHRoID0gMTAwIC8gbnVtU2xpZGVzO1xyXG5cclxuICAgICAgICAgICAgc2xpZGVzLndyYXBBbGwoJzxkaXYgY2xhc3M9XCInICsgU0xJREVTX0NPTlRBSU5FUiArICdcIiAvPicpO1xyXG4gICAgICAgICAgICBzbGlkZXMucGFyZW50KCkud3JhcCgnPGRpdiBjbGFzcz1cIicgKyBTTElERVNfV1JBUFBFUiArICdcIiAvPicpO1xyXG5cclxuICAgICAgICAgICAgc2VjdGlvbi5maW5kKFNMSURFU19DT05UQUlORVJfU0VMKS5jc3MoJ3dpZHRoJywgc2xpZGVyV2lkdGggKyAnJScpO1xyXG5cclxuICAgICAgICAgICAgaWYobnVtU2xpZGVzID4gMSl7XHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zLmNvbnRyb2xBcnJvd3Mpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZVNsaWRlQXJyb3dzKHNlY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnMuc2xpZGVzTmF2aWdhdGlvbil7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkU2xpZGVzTmF2aWdhdGlvbihzZWN0aW9uLCBudW1TbGlkZXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzbGlkZXMuZWFjaChmdW5jdGlvbihpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ3dpZHRoJywgc2xpZGVXaWR0aCArICclJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9ucy52ZXJ0aWNhbENlbnRlcmVkKXtcclxuICAgICAgICAgICAgICAgICAgICBhZGRUYWJsZUNsYXNzKCQodGhpcykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzdGFydGluZ1NsaWRlID0gc2VjdGlvbi5maW5kKFNMSURFX0FDVElWRV9TRUwpO1xyXG5cclxuICAgICAgICAgICAgLy9pZiB0aGUgc2xpZGUgd29uJ3QgYmUgYW4gc3RhcnRpbmcgcG9pbnQsIHRoZSBkZWZhdWx0IHdpbGwgYmUgdGhlIGZpcnN0IG9uZVxyXG4gICAgICAgICAgICAvL3RoZSBhY3RpdmUgc2VjdGlvbiBpc24ndCB0aGUgZmlyc3Qgb25lPyBJcyBub3QgdGhlIGZpcnN0IHNsaWRlIG9mIHRoZSBmaXJzdCBzZWN0aW9uPyBUaGVuIHdlIGxvYWQgdGhhdCBzZWN0aW9uL3NsaWRlIGJ5IGRlZmF1bHQuXHJcbiAgICAgICAgICAgIGlmKCBzdGFydGluZ1NsaWRlLmxlbmd0aCAmJiAgKCQoU0VDVElPTl9BQ1RJVkVfU0VMKS5pbmRleChTRUNUSU9OX1NFTCkgIT09IDAgfHwgKCQoU0VDVElPTl9BQ1RJVkVfU0VMKS5pbmRleChTRUNUSU9OX1NFTCkgPT09IDAgJiYgc3RhcnRpbmdTbGlkZS5pbmRleCgpICE9PSAwKSkpe1xyXG4gICAgICAgICAgICAgICAgc2lsZW50TGFuZHNjYXBlU2Nyb2xsKHN0YXJ0aW5nU2xpZGUpO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHNsaWRlcy5lcSgwKS5hZGRDbGFzcyhBQ1RJVkUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIFN0eWxpbmcgdmVydGljYWwgc2VjdGlvbnNcclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHN0eWxlU2VjdGlvbihzZWN0aW9uLCBpbmRleCl7XHJcbiAgICAgICAgICAgIC8vaWYgbm8gYWN0aXZlIHNlY3Rpb24gaXMgZGVmaW5lZCwgdGhlIDFzdCBvbmUgd2lsbCBiZSB0aGUgZGVmYXVsdCBvbmVcclxuICAgICAgICAgICAgaWYoIWluZGV4ICYmICQoU0VDVElPTl9BQ1RJVkVfU0VMKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHNlY3Rpb24uYWRkQ2xhc3MoQUNUSVZFKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2VjdGlvbi5jc3MoJ2hlaWdodCcsIHdpbmRvd3NIZWlnaHQgKyAncHgnKTtcclxuXHJcbiAgICAgICAgICAgIGlmKG9wdGlvbnMucGFkZGluZ1RvcCl7XHJcbiAgICAgICAgICAgICAgICBzZWN0aW9uLmNzcygncGFkZGluZy10b3AnLCBvcHRpb25zLnBhZGRpbmdUb3ApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihvcHRpb25zLnBhZGRpbmdCb3R0b20pe1xyXG4gICAgICAgICAgICAgICAgc2VjdGlvbi5jc3MoJ3BhZGRpbmctYm90dG9tJywgb3B0aW9ucy5wYWRkaW5nQm90dG9tKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnNlY3Rpb25zQ29sb3JbaW5kZXhdICE9PSAgJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHNlY3Rpb24uY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgb3B0aW9ucy5zZWN0aW9uc0NvbG9yW2luZGV4XSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5hbmNob3JzW2luZGV4XSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHNlY3Rpb24uYXR0cignZGF0YS1hbmNob3InLCBvcHRpb25zLmFuY2hvcnNbaW5kZXhdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBTZXRzIHRoZSBkYXRhLWFuY2hvciBhdHRyaWJ1dGVzIHRvIHRoZSBtZW51IGVsZW1lbnRzIGFuZCBhY3RpdmF0ZXMgdGhlIGN1cnJlbnQgb25lLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gc3R5bGVNZW51KHNlY3Rpb24sIGluZGV4KXtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmFuY2hvcnNbaW5kZXhdICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgLy9hY3RpdmF0aW5nIHRoZSBtZW51IC8gbmF2IGVsZW1lbnQgb24gbG9hZFxyXG4gICAgICAgICAgICAgICAgaWYoc2VjdGlvbi5oYXNDbGFzcyhBQ1RJVkUpKXtcclxuICAgICAgICAgICAgICAgICAgICBhY3RpdmF0ZU1lbnVBbmROYXYob3B0aW9ucy5hbmNob3JzW2luZGV4XSwgaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL21vdmluZyB0aGUgbWVudSBvdXRzaWRlIHRoZSBtYWluIGNvbnRhaW5lciBpZiBpdCBpcyBpbnNpZGUgKGF2b2lkIHByb2JsZW1zIHdpdGggZml4ZWQgcG9zaXRpb25zIHdoZW4gdXNpbmcgQ1NTMyB0cmFuZm9ybXMpXHJcbiAgICAgICAgICAgIGlmKG9wdGlvbnMubWVudSAmJiBvcHRpb25zLmNzczMgJiYgJChvcHRpb25zLm1lbnUpLmNsb3Nlc3QoV1JBUFBFUl9TRUwpLmxlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICAkKG9wdGlvbnMubWVudSkuYXBwZW5kVG8oJGJvZHkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIEFkZHMgaW50ZXJuYWwgY2xhc3NlcyB0byBiZSBhYmxlIHRvIHByb3ZpZGUgY3VzdG9taXphYmxlIHNlbGVjdG9yc1xyXG4gICAgICAgICoga2VlcGluZyB0aGUgbGluayB3aXRoIHRoZSBzdHlsZSBzaGVldC5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGFkZEludGVybmFsU2VsZWN0b3JzKCl7XHJcbiAgICAgICAgICAgIC8vYWRkaW5nIGludGVybmFsIGNsYXNzIG5hbWVzIHRvIHZvaWQgcHJvYmxlbSB3aXRoIGNvbW1vbiBvbmVzXHJcbiAgICAgICAgICAgICQob3B0aW9ucy5zZWN0aW9uU2VsZWN0b3IpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoU0VDVElPTik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKG9wdGlvbnMuc2xpZGVTZWxlY3RvcikuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhTTElERSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBDcmVhdGVzIHRoZSBjb250cm9sIGFycm93cyBmb3IgdGhlIGdpdmVuIHNlY3Rpb25cclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZVNsaWRlQXJyb3dzKHNlY3Rpb24pe1xyXG4gICAgICAgICAgICBzZWN0aW9uLmZpbmQoU0xJREVTX1dSQVBQRVJfU0VMKS5hZnRlcignPGRpdiBjbGFzcz1cIicgKyBTTElERVNfQVJST1dfUFJFViArICdcIj48L2Rpdj48ZGl2IGNsYXNzPVwiJyArIFNMSURFU19BUlJPV19ORVhUICsgJ1wiPjwvZGl2PicpO1xyXG5cclxuICAgICAgICAgICAgaWYob3B0aW9ucy5jb250cm9sQXJyb3dDb2xvciE9JyNmZmYnKXtcclxuICAgICAgICAgICAgICAgIHNlY3Rpb24uZmluZChTTElERVNfQVJST1dfTkVYVF9TRUwpLmNzcygnYm9yZGVyLWNvbG9yJywgJ3RyYW5zcGFyZW50IHRyYW5zcGFyZW50IHRyYW5zcGFyZW50ICcrb3B0aW9ucy5jb250cm9sQXJyb3dDb2xvcik7XHJcbiAgICAgICAgICAgICAgICBzZWN0aW9uLmZpbmQoU0xJREVTX0FSUk9XX1BSRVZfU0VMKS5jc3MoJ2JvcmRlci1jb2xvcicsICd0cmFuc3BhcmVudCAnKyBvcHRpb25zLmNvbnRyb2xBcnJvd0NvbG9yICsgJyB0cmFuc3BhcmVudCB0cmFuc3BhcmVudCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZighb3B0aW9ucy5sb29wSG9yaXpvbnRhbCl7XHJcbiAgICAgICAgICAgICAgICBzZWN0aW9uLmZpbmQoU0xJREVTX0FSUk9XX1BSRVZfU0VMKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogQ3JlYXRlcyBhIHZlcnRpY2FsIG5hdmlnYXRpb24gYmFyLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkVmVydGljYWxOYXZpZ2F0aW9uKCl7XHJcbiAgICAgICAgICAgICRib2R5LmFwcGVuZCgnPGRpdiBpZD1cIicgKyBTRUNUSU9OX05BViArICdcIj48dWw+PC91bD48L2Rpdj4nKTtcclxuICAgICAgICAgICAgdmFyIG5hdiA9ICQoU0VDVElPTl9OQVZfU0VMKTtcclxuXHJcbiAgICAgICAgICAgIG5hdi5hZGRDbGFzcyhmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvcHRpb25zLnNob3dBY3RpdmVUb29sdGlwID8gU0hPV19BQ1RJVkVfVE9PTFRJUCArICcgJyArIG9wdGlvbnMubmF2aWdhdGlvblBvc2l0aW9uIDogb3B0aW9ucy5uYXZpZ2F0aW9uUG9zaXRpb247XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkKFNFQ1RJT05fU0VMKS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxpbmsgPSAnJztcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmFuY2hvcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluayA9IG9wdGlvbnMuYW5jaG9yc1tpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbGkgPSAnPGxpPjxhIGhyZWY9XCIjJyArIGxpbmsgKyAnXCI+PHNwYW4+PC9zcGFuPjwvYT4nO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIE9ubHkgYWRkIHRvb2x0aXAgaWYgbmVlZGVkIChkZWZpbmVkIGJ5IHVzZXIpXHJcbiAgICAgICAgICAgICAgICB2YXIgdG9vbHRpcCA9IG9wdGlvbnMubmF2aWdhdGlvblRvb2x0aXBzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdG9vbHRpcCAhPT0gJ3VuZGVmaW5lZCcgJiYgdG9vbHRpcCAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaSArPSAnPGRpdiBjbGFzcz1cIicgKyBTRUNUSU9OX05BVl9UT09MVElQICsgJyAnICsgb3B0aW9ucy5uYXZpZ2F0aW9uUG9zaXRpb24gKyAnXCI+JyArIHRvb2x0aXAgKyAnPC9kaXY+JztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsaSArPSAnPC9saT4nO1xyXG5cclxuICAgICAgICAgICAgICAgIG5hdi5maW5kKCd1bCcpLmFwcGVuZChsaSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vY2VudGVyaW5nIGl0IHZlcnRpY2FsbHlcclxuICAgICAgICAgICAgJChTRUNUSU9OX05BVl9TRUwpLmNzcygnbWFyZ2luLXRvcCcsICctJyArICgkKFNFQ1RJT05fTkFWX1NFTCkuaGVpZ2h0KCkvMikgKyAncHgnKTtcclxuXHJcbiAgICAgICAgICAgIC8vYWN0aXZhdGluZyB0aGUgY3VycmVudCBhY3RpdmUgc2VjdGlvblxyXG4gICAgICAgICAgICAkKFNFQ1RJT05fTkFWX1NFTCkuZmluZCgnbGknKS5lcSgkKFNFQ1RJT05fQUNUSVZFX1NFTCkuaW5kZXgoU0VDVElPTl9TRUwpKS5maW5kKCdhJykuYWRkQ2xhc3MoQUNUSVZFKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogQ3JlYXRlcyB0aGUgc2xpbSBzY3JvbGwgc2Nyb2xsYmFyIGZvciB0aGUgc2VjdGlvbnMgYW5kIHNsaWRlcyBpbnNpZGUgdGhlbS5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZVNsaW1TY3JvbGxpbmdIYW5kbGVyKCl7XHJcbiAgICAgICAgICAgICQoU0VDVElPTl9TRUwpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHZhciBzbGlkZXMgPSAkKHRoaXMpLmZpbmQoU0xJREVfU0VMKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihzbGlkZXMubGVuZ3RoKXtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXMuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVTbGltU2Nyb2xsaW5nKCQodGhpcykpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlU2xpbVNjcm9sbGluZygkKHRoaXMpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBhZnRlclJlbmRlckFjdGlvbnMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogQWN0aW9ucyBhbmQgY2FsbGJhY2tzIHRvIGZpcmUgYWZ0ZXJSZW5kZXJcclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGFmdGVyUmVuZGVyQWN0aW9ucygpe1xyXG4gICAgICAgICAgICB2YXIgc2VjdGlvbiA9ICQoU0VDVElPTl9BQ1RJVkVfU0VMKTtcclxuXHJcbiAgICAgICAgICAgIHNlY3Rpb24uYWRkQ2xhc3MoQ09NUExFVEVMWSk7XHJcblxyXG4gICAgICAgICAgICBpZihvcHRpb25zLnNjcm9sbE92ZXJmbG93SGFuZGxlci5hZnRlclJlbmRlcil7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLnNjcm9sbE92ZXJmbG93SGFuZGxlci5hZnRlclJlbmRlcihzZWN0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsYXp5TG9hZChzZWN0aW9uKTtcclxuICAgICAgICAgICAgcGxheU1lZGlhKHNlY3Rpb24pO1xyXG5cclxuICAgICAgICAgICAgJC5pc0Z1bmN0aW9uKCBvcHRpb25zLmFmdGVyTG9hZCApICYmIG9wdGlvbnMuYWZ0ZXJMb2FkLmNhbGwoc2VjdGlvbiwgc2VjdGlvbi5kYXRhKCdhbmNob3InKSwgKHNlY3Rpb24uaW5kZXgoU0VDVElPTl9TRUwpICsgMSkpO1xyXG4gICAgICAgICAgICAkLmlzRnVuY3Rpb24oIG9wdGlvbnMuYWZ0ZXJSZW5kZXIgKSAmJiBvcHRpb25zLmFmdGVyUmVuZGVyLmNhbGwoY29udGFpbmVyKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB2YXIgaXNTY3JvbGxpbmcgPSBmYWxzZTtcclxuICAgICAgICB2YXIgbGFzdFNjcm9sbCA9IDA7XHJcblxyXG4gICAgICAgIC8vd2hlbiBzY3JvbGxpbmcuLi5cclxuICAgICAgICBmdW5jdGlvbiBzY3JvbGxIYW5kbGVyKCl7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50U2VjdGlvbjtcclxuXHJcbiAgICAgICAgICAgIGlmKCFvcHRpb25zLmF1dG9TY3JvbGxpbmcgfHwgb3B0aW9ucy5zY3JvbGxCYXIpe1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRTY3JvbGwgPSAkd2luZG93LnNjcm9sbFRvcCgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNjcm9sbERpcmVjdGlvbiA9IGdldFNjcm9sbERpcmVjdGlvbihjdXJyZW50U2Nyb2xsKTtcclxuICAgICAgICAgICAgICAgIHZhciB2aXNpYmxlU2VjdGlvbkluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgIHZhciBzY3JlZW5fbWlkID0gY3VycmVudFNjcm9sbCArICgkd2luZG93LmhlaWdodCgpIC8gMi4wKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL3Rha2luZyB0aGUgc2VjdGlvbiB3aGljaCBpcyBzaG93aW5nIG1vcmUgY29udGVudCBpbiB0aGUgdmlld3BvcnRcclxuICAgICAgICAgICAgICAgIHZhciBzZWN0aW9ucyA9ICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNFQ1RJT05fU0VMKTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VjdGlvbnMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2VjdGlvbiA9IHNlY3Rpb25zW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBQaWNrIHRoZSB0aGUgbGFzdCBzZWN0aW9uIHdoaWNoIHBhc3NlcyB0aGUgbWlkZGxlIGxpbmUgb2YgdGhlIHNjcmVlbi5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VjdGlvbi5vZmZzZXRUb3AgPD0gc2NyZWVuX21pZClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpc2libGVTZWN0aW9uSW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZihpc0NvbXBsZXRlbHlJblZpZXdQb3J0KHNjcm9sbERpcmVjdGlvbikpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCEkKFNFQ1RJT05fQUNUSVZFX1NFTCkuaGFzQ2xhc3MoQ09NUExFVEVMWSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKFNFQ1RJT05fQUNUSVZFX1NFTCkuYWRkQ2xhc3MoQ09NUExFVEVMWSkuc2libGluZ3MoKS5yZW1vdmVDbGFzcyhDT01QTEVURUxZKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy9nZXRpbmcgdGhlIGxhc3Qgb25lLCB0aGUgY3VycmVudCBvbmUgb24gdGhlIHNjcmVlblxyXG4gICAgICAgICAgICAgICAgY3VycmVudFNlY3Rpb24gPSAkKHNlY3Rpb25zKS5lcSh2aXNpYmxlU2VjdGlvbkluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL3NldHRpbmcgdGhlIHZpc2libGUgc2VjdGlvbiBhcyBhY3RpdmUgd2hlbiBtYW51YWxseSBzY3JvbGxpbmdcclxuICAgICAgICAgICAgICAgIC8vZXhlY3V0aW5nIG9ubHkgb25jZSB0aGUgZmlyc3QgdGltZSB3ZSByZWFjaCB0aGUgc2VjdGlvblxyXG4gICAgICAgICAgICAgICAgaWYoIWN1cnJlbnRTZWN0aW9uLmhhc0NsYXNzKEFDVElWRSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlzU2Nyb2xsaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbGVhdmluZ1NlY3Rpb24gPSAkKFNFQ1RJT05fQUNUSVZFX1NFTCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxlYXZpbmdTZWN0aW9uSW5kZXggPSBsZWF2aW5nU2VjdGlvbi5pbmRleChTRUNUSU9OX1NFTCkgKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB5TW92ZW1lbnQgPSBnZXRZbW92ZW1lbnQoY3VycmVudFNlY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhbmNob3JMaW5rICA9IGN1cnJlbnRTZWN0aW9uLmRhdGEoJ2FuY2hvcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWN0aW9uSW5kZXggPSBjdXJyZW50U2VjdGlvbi5pbmRleChTRUNUSU9OX1NFTCkgKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhY3RpdmVTbGlkZSA9IGN1cnJlbnRTZWN0aW9uLmZpbmQoU0xJREVfQUNUSVZFX1NFTCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGFjdGl2ZVNsaWRlLmxlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzbGlkZUFuY2hvckxpbmsgPSBhY3RpdmVTbGlkZS5kYXRhKCdhbmNob3InKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNsaWRlSW5kZXggPSBhY3RpdmVTbGlkZS5pbmRleCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoY2FuU2Nyb2xsKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFNlY3Rpb24uYWRkQ2xhc3MoQUNUSVZFKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKEFDVElWRSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkLmlzRnVuY3Rpb24oIG9wdGlvbnMub25MZWF2ZSApICYmIG9wdGlvbnMub25MZWF2ZS5jYWxsKCBsZWF2aW5nU2VjdGlvbiwgbGVhdmluZ1NlY3Rpb25JbmRleCwgc2VjdGlvbkluZGV4LCB5TW92ZW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJC5pc0Z1bmN0aW9uKCBvcHRpb25zLmFmdGVyTG9hZCApICYmIG9wdGlvbnMuYWZ0ZXJMb2FkLmNhbGwoIGN1cnJlbnRTZWN0aW9uLCBhbmNob3JMaW5rLCBzZWN0aW9uSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXp5TG9hZChjdXJyZW50U2VjdGlvbik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmF0ZU1lbnVBbmROYXYoYW5jaG9yTGluaywgc2VjdGlvbkluZGV4IC0gMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihvcHRpb25zLmFuY2hvcnMubGVuZ3RoKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vbmVlZGVkIHRvIGVudGVyIGluIGhhc2hDaGFuZ2UgZXZlbnQgd2hlbiB1c2luZyB0aGUgbWVudSB3aXRoIGFuY2hvciBsaW5rc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFNjcm9sbGVkRGVzdGlueSA9IGFuY2hvckxpbms7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0U3RhdGUoc2xpZGVJbmRleCwgc2xpZGVBbmNob3JMaW5rLCBhbmNob3JMaW5rLCBzZWN0aW9uSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL3NtYWxsIHRpbWVvdXQgaW4gb3JkZXIgdG8gYXZvaWQgZW50ZXJpbmcgaW4gaGFzaENoYW5nZSBldmVudCB3aGVuIHNjcm9sbGluZyBpcyBub3QgZmluaXNoZWQgeWV0XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHNjcm9sbElkKTtcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNTY3JvbGxpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnMuZml0VG9TZWN0aW9uKXtcclxuICAgICAgICAgICAgICAgICAgICAvL2ZvciB0aGUgYXV0byBhZGp1c3Qgb2YgdGhlIHZpZXdwb3J0IHRvIGZpdCBhIHdob2xlIHNlY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoc2Nyb2xsSWQyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsSWQyID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NoZWNraW5nIGZpdFRvU2VjdGlvbiBhZ2FpbiBpbiBjYXNlIGl0IHdhcyBzZXQgdG8gZmFsc2UgYmVmb3JlIHRoZSB0aW1lb3V0IGRlbGF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNhblNjcm9sbCAmJiBvcHRpb25zLmZpdFRvU2VjdGlvbil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2FsbG93cyB0byBzY3JvbGwgdG8gYW4gYWN0aXZlIHNlY3Rpb24gYW5kXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2lmIHRoZSBzZWN0aW9uIGlzIGFscmVhZHkgYWN0aXZlLCB3ZSBwcmV2ZW50IGZpcmluZyBjYWxsYmFja3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCQoU0VDVElPTl9BQ1RJVkVfU0VMKS5pcyhjdXJyZW50U2VjdGlvbikpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUmVzaXppbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUGFnZSgkKFNFQ1RJT05fQUNUSVZFX1NFTCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUmVzaXppbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIG9wdGlvbnMuZml0VG9TZWN0aW9uRGVsYXkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIERldGVybWluZXMgd2hldGhlciB0aGUgYWN0aXZlIHNlY3Rpb24gaGFzIHNlZW4gaW4gaXRzIHdob2xlIG9yIG5vdC5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGlzQ29tcGxldGVseUluVmlld1BvcnQobW92ZW1lbnQpe1xyXG4gICAgICAgICAgICB2YXIgdG9wID0gJChTRUNUSU9OX0FDVElWRV9TRUwpLnBvc2l0aW9uKCkudG9wO1xyXG4gICAgICAgICAgICB2YXIgYm90dG9tID0gdG9wICsgJHdpbmRvdy5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmKG1vdmVtZW50ID09ICd1cCcpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJvdHRvbSA+PSAoJHdpbmRvdy5zY3JvbGxUb3AoKSArICR3aW5kb3cuaGVpZ2h0KCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0b3AgPD0gJHdpbmRvdy5zY3JvbGxUb3AoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogR2V0cyB0aGUgZGlyZWN0b24gb2YgdGhlIHRoZSBzY3JvbGxpbmcgZmlyZWQgYnkgdGhlIHNjcm9sbCBldmVudC5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldFNjcm9sbERpcmVjdGlvbihjdXJyZW50U2Nyb2xsKXtcclxuICAgICAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGN1cnJlbnRTY3JvbGwgPiBsYXN0U2Nyb2xsID8gJ2Rvd24nIDogJ3VwJztcclxuXHJcbiAgICAgICAgICAgIGxhc3RTY3JvbGwgPSBjdXJyZW50U2Nyb2xsO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRpcmVjdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogRGV0ZXJtaW5lcyB0aGUgd2F5IG9mIHNjcm9sbGluZyB1cCBvciBkb3duOlxyXG4gICAgICAgICogYnkgJ2F1dG9tYXRpY2FsbHknIHNjcm9sbGluZyBhIHNlY3Rpb24gb3IgYnkgdXNpbmcgdGhlIGRlZmF1bHQgYW5kIG5vcm1hbCBzY3JvbGxpbmcuXHJcbiAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBzY3JvbGxpbmcodHlwZSwgc2Nyb2xsYWJsZSl7XHJcbiAgICAgICAgICAgIGlmICghaXNTY3JvbGxBbGxvd2VkLm1bdHlwZV0pe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBjaGVjaywgc2Nyb2xsU2VjdGlvbjtcclxuXHJcbiAgICAgICAgICAgIGlmKHR5cGUgPT0gJ2Rvd24nKXtcclxuICAgICAgICAgICAgICAgIGNoZWNrID0gJ2JvdHRvbSc7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxTZWN0aW9uID0gRlAubW92ZVNlY3Rpb25Eb3duO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGNoZWNrID0gJ3RvcCc7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxTZWN0aW9uID0gRlAubW92ZVNlY3Rpb25VcDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoc2Nyb2xsYWJsZS5sZW5ndGggPiAwICl7XHJcbiAgICAgICAgICAgICAgICAvL2lzIHRoZSBzY3JvbGxiYXIgYXQgdGhlIHN0YXJ0L2VuZCBvZiB0aGUgc2Nyb2xsP1xyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9ucy5zY3JvbGxPdmVyZmxvd0hhbmRsZXIuaXNTY3JvbGxlZChjaGVjaywgc2Nyb2xsYWJsZSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFNlY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIC8vIG1vdmVkIHVwL2Rvd25cclxuICAgICAgICAgICAgICAgIHNjcm9sbFNlY3Rpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHZhciB0b3VjaFN0YXJ0WSA9IDA7XHJcbiAgICAgICAgdmFyIHRvdWNoU3RhcnRYID0gMDtcclxuICAgICAgICB2YXIgdG91Y2hFbmRZID0gMDtcclxuICAgICAgICB2YXIgdG91Y2hFbmRYID0gMDtcclxuXHJcbiAgICAgICAgLyogRGV0ZWN0aW5nIHRvdWNoIGV2ZW50c1xyXG5cclxuICAgICAgICAqIEFzIHdlIGFyZSBjaGFuZ2luZyB0aGUgdG9wIHByb3BlcnR5IG9mIHRoZSBwYWdlIG9uIHNjcm9sbGluZywgd2UgY2FuIG5vdCB1c2UgdGhlIHRyYWRpdGlvbmFsIHdheSB0byBkZXRlY3QgaXQuXHJcbiAgICAgICAgKiBUaGlzIHdheSwgdGhlIHRvdWNoc3RhcnQgYW5kIHRoZSB0b3VjaCBtb3ZlcyBzaG93cyBhbiBzbWFsbCBkaWZmZXJlbmNlIGJldHdlZW4gdGhlbSB3aGljaCBpcyB0aGVcclxuICAgICAgICAqIHVzZWQgb25lIHRvIGRldGVybWluZSB0aGUgZGlyZWN0aW9uLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gdG91Y2hNb3ZlSGFuZGxlcihldmVudCl7XHJcbiAgICAgICAgICAgIHZhciBlID0gZXZlbnQub3JpZ2luYWxFdmVudDtcclxuXHJcbiAgICAgICAgICAgIC8vIGFkZGl0aW9uYWw6IGlmIG9uZSBvZiB0aGUgbm9ybWFsU2Nyb2xsRWxlbWVudHMgaXNuJ3Qgd2l0aGluIG9wdGlvbnMubm9ybWFsU2Nyb2xsRWxlbWVudFRvdWNoVGhyZXNob2xkIGhvcHMgdXAgdGhlIERPTSBjaGFpblxyXG4gICAgICAgICAgICBpZiAoIWNoZWNrUGFyZW50Rm9yTm9ybWFsU2Nyb2xsRWxlbWVudChldmVudC50YXJnZXQpICYmIGlzUmVhbGx5VG91Y2goZSkgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9ucy5hdXRvU2Nyb2xsaW5nKXtcclxuICAgICAgICAgICAgICAgICAgICAvL3ByZXZlbnRpbmcgdGhlIGVhc2luZyBvbiBpT1MgZGV2aWNlc1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGFjdGl2ZVNlY3Rpb24gPSAkKFNFQ1RJT05fQUNUSVZFX1NFTCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2Nyb2xsYWJsZSA9IG9wdGlvbnMuc2Nyb2xsT3ZlcmZsb3dIYW5kbGVyLnNjcm9sbGFibGUoYWN0aXZlU2VjdGlvbik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNhblNjcm9sbCAmJiAhc2xpZGVNb3ZpbmcpIHsgLy9pZiB0aGVyZXMgYW55ICNcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdG91Y2hFdmVudHMgPSBnZXRFdmVudHNQYWdlKGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0b3VjaEVuZFkgPSB0b3VjaEV2ZW50cy55O1xyXG4gICAgICAgICAgICAgICAgICAgIHRvdWNoRW5kWCA9IHRvdWNoRXZlbnRzLng7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vaWYgbW92ZW1lbnQgaW4gdGhlIFggYXh5cyBpcyBncmVhdGVyIHRoYW4gaW4gdGhlIFkgYW5kIHRoZSBjdXJyZWN0IHNlY3Rpb24gaGFzIHNsaWRlcy4uLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVTZWN0aW9uLmZpbmQoU0xJREVTX1dSQVBQRVJfU0VMKS5sZW5ndGggJiYgTWF0aC5hYnModG91Y2hTdGFydFggLSB0b3VjaEVuZFgpID4gKE1hdGguYWJzKHRvdWNoU3RhcnRZIC0gdG91Y2hFbmRZKSkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vaXMgdGhlIG1vdmVtZW50IGdyZWF0ZXIgdGhhbiB0aGUgbWluaW11bSByZXNpc3RhbmNlIHRvIHNjcm9sbD9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHRvdWNoU3RhcnRYIC0gdG91Y2hFbmRYKSA+ICgkd2luZG93Lm91dGVyV2lkdGgoKSAvIDEwMCAqIG9wdGlvbnMudG91Y2hTZW5zaXRpdml0eSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b3VjaFN0YXJ0WCA+IHRvdWNoRW5kWCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGlzU2Nyb2xsQWxsb3dlZC5tLnJpZ2h0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRlAubW92ZVNsaWRlUmlnaHQoKTsgLy9uZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihpc1Njcm9sbEFsbG93ZWQubS5sZWZ0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRlAubW92ZVNsaWRlTGVmdCgpOyAvL3ByZXZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vdmVydGljYWwgc2Nyb2xsaW5nIChvbmx5IHdoZW4gYXV0b1Njcm9sbGluZyBpcyBlbmFibGVkKVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYob3B0aW9ucy5hdXRvU2Nyb2xsaW5nKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vaXMgdGhlIG1vdmVtZW50IGdyZWF0ZXIgdGhhbiB0aGUgbWluaW11bSByZXNpc3RhbmNlIHRvIHNjcm9sbD9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHRvdWNoU3RhcnRZIC0gdG91Y2hFbmRZKSA+ICgkd2luZG93LmhlaWdodCgpIC8gMTAwICogb3B0aW9ucy50b3VjaFNlbnNpdGl2aXR5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRvdWNoU3RhcnRZID4gdG91Y2hFbmRZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsaW5nKCdkb3duJywgc2Nyb2xsYWJsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRvdWNoRW5kWSA+IHRvdWNoU3RhcnRZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsaW5nKCd1cCcsIHNjcm9sbGFibGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogcmVjdXJzaXZlIGZ1bmN0aW9uIHRvIGxvb3AgdXAgdGhlIHBhcmVudCBub2RlcyB0byBjaGVjayBpZiBvbmUgb2YgdGhlbSBleGlzdHMgaW4gb3B0aW9ucy5ub3JtYWxTY3JvbGxFbGVtZW50c1xyXG4gICAgICAgICAqIEN1cnJlbnRseSB3b3JrcyB3ZWxsIGZvciBpT1MgLSBBbmRyb2lkIG1pZ2h0IG5lZWQgc29tZSB0ZXN0aW5nXHJcbiAgICAgICAgICogQHBhcmFtICB7RWxlbWVudH0gZWwgIHRhcmdldCBlbGVtZW50IC8ganF1ZXJ5IHNlbGVjdG9yIChpbiBzdWJzZXF1ZW50IG5vZGVzKVxyXG4gICAgICAgICAqIEBwYXJhbSAge2ludH0gICAgIGhvcCBjdXJyZW50IGhvcCBjb21wYXJlZCB0byBvcHRpb25zLm5vcm1hbFNjcm9sbEVsZW1lbnRUb3VjaFRocmVzaG9sZFxyXG4gICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhlcmUgaXMgYSBtYXRjaCB0byBvcHRpb25zLm5vcm1hbFNjcm9sbEVsZW1lbnRzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tQYXJlbnRGb3JOb3JtYWxTY3JvbGxFbGVtZW50IChlbCwgaG9wKSB7XHJcbiAgICAgICAgICAgIGhvcCA9IGhvcCB8fCAwO1xyXG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gJChlbCkucGFyZW50KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaG9wIDwgb3B0aW9ucy5ub3JtYWxTY3JvbGxFbGVtZW50VG91Y2hUaHJlc2hvbGQgJiZcclxuICAgICAgICAgICAgICAgIHBhcmVudC5pcyhvcHRpb25zLm5vcm1hbFNjcm9sbEVsZW1lbnRzKSApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGhvcCA9PSBvcHRpb25zLm5vcm1hbFNjcm9sbEVsZW1lbnRUb3VjaFRocmVzaG9sZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoZWNrUGFyZW50Rm9yTm9ybWFsU2Nyb2xsRWxlbWVudChwYXJlbnQsICsraG9wKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBBcyBJRSA+PSAxMCBmaXJlcyBib3RoIHRvdWNoIGFuZCBtb3VzZSBldmVudHMgd2hlbiB1c2luZyBhIG1vdXNlIGluIGEgdG91Y2hzY3JlZW5cclxuICAgICAgICAqIHRoaXMgd2F5IHdlIG1ha2Ugc3VyZSB0aGF0IGlzIHJlYWxseSBhIHRvdWNoIGV2ZW50IHdoYXQgSUUgaXMgZGV0ZWN0aW5nLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gaXNSZWFsbHlUb3VjaChlKXtcclxuICAgICAgICAgICAgLy9pZiBpcyBub3QgSUUgICB8fCAgSUUgaXMgZGV0ZWN0aW5nIGB0b3VjaGAgb3IgYHBlbmBcclxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBlLnBvaW50ZXJUeXBlID09PSAndW5kZWZpbmVkJyB8fCBlLnBvaW50ZXJUeXBlICE9ICdtb3VzZSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIEhhbmRsZXIgZm9yIHRoZSB0b3VjaCBzdGFydCBldmVudC5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHRvdWNoU3RhcnRIYW5kbGVyKGV2ZW50KXtcclxuICAgICAgICAgICAgdmFyIGUgPSBldmVudC5vcmlnaW5hbEV2ZW50O1xyXG5cclxuICAgICAgICAgICAgLy9zdG9wcGluZyB0aGUgYXV0byBzY3JvbGwgdG8gYWRqdXN0IHRvIGEgc2VjdGlvblxyXG4gICAgICAgICAgICBpZihvcHRpb25zLmZpdFRvU2VjdGlvbil7XHJcbiAgICAgICAgICAgICAgICAkaHRtbEJvZHkuc3RvcCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihpc1JlYWxseVRvdWNoKGUpKXtcclxuICAgICAgICAgICAgICAgIHZhciB0b3VjaEV2ZW50cyA9IGdldEV2ZW50c1BhZ2UoZSk7XHJcbiAgICAgICAgICAgICAgICB0b3VjaFN0YXJ0WSA9IHRvdWNoRXZlbnRzLnk7XHJcbiAgICAgICAgICAgICAgICB0b3VjaFN0YXJ0WCA9IHRvdWNoRXZlbnRzLng7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogR2V0cyB0aGUgYXZlcmFnZSBvZiB0aGUgbGFzdCBgbnVtYmVyYCBlbGVtZW50cyBvZiB0aGUgZ2l2ZW4gYXJyYXkuXHJcbiAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXRBdmVyYWdlKGVsZW1lbnRzLCBudW1iZXIpe1xyXG4gICAgICAgICAgICB2YXIgc3VtID0gMDtcclxuXHJcbiAgICAgICAgICAgIC8vdGFraW5nIGBudW1iZXJgIGVsZW1lbnRzIGZyb20gdGhlIGVuZCB0byBtYWtlIHRoZSBhdmVyYWdlLCBpZiB0aGVyZSBhcmUgbm90IGVub3VnaHQsIDFcclxuICAgICAgICAgICAgdmFyIGxhc3RFbGVtZW50cyA9IGVsZW1lbnRzLnNsaWNlKE1hdGgubWF4KGVsZW1lbnRzLmxlbmd0aCAtIG51bWJlciwgMSkpO1xyXG5cclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGxhc3RFbGVtZW50cy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBzdW0gPSBzdW0gKyBsYXN0RWxlbWVudHNbaV07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwoc3VtL251bWJlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEZXRlY3RpbmcgbW91c2V3aGVlbCBzY3JvbGxpbmdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIGh0dHA6Ly9ibG9ncy5zaXRlcG9pbnRzdGF0aWMuY29tL2V4YW1wbGVzL3RlY2gvbW91c2Utd2hlZWwvaW5kZXguaHRtbFxyXG4gICAgICAgICAqIGh0dHA6Ly93d3cuc2l0ZXBvaW50LmNvbS9odG1sNS1qYXZhc2NyaXB0LW1vdXNlLXdoZWVsL1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBwcmV2VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBNb3VzZVdoZWVsSGFuZGxlcihlKSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgIHZhciBpc05vcm1hbFNjcm9sbCA9ICQoQ09NUExFVEVMWV9TRUwpLmhhc0NsYXNzKE5PUk1BTF9TQ1JPTEwpO1xyXG5cclxuICAgICAgICAgICAgLy9hdXRvc2Nyb2xsaW5nIGFuZCBub3Qgem9vbWluZz9cclxuICAgICAgICAgICAgaWYob3B0aW9ucy5hdXRvU2Nyb2xsaW5nICYmICFjb250cm9sUHJlc3NlZCAmJiAhaXNOb3JtYWxTY3JvbGwpe1xyXG4gICAgICAgICAgICAgICAgLy8gY3Jvc3MtYnJvd3NlciB3aGVlbCBkZWx0YVxyXG4gICAgICAgICAgICAgICAgZSA9IGUgfHwgd2luZG93LmV2ZW50O1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gZS53aGVlbERlbHRhIHx8IC1lLmRlbHRhWSB8fCAtZS5kZXRhaWw7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGVsdGEgPSBNYXRoLm1heCgtMSwgTWF0aC5taW4oMSwgdmFsdWUpKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaG9yaXpvbnRhbERldGVjdGlvbiA9IHR5cGVvZiBlLndoZWVsRGVsdGFYICE9PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgZS5kZWx0YVggIT09ICd1bmRlZmluZWQnO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlzU2Nyb2xsaW5nVmVydGljYWxseSA9IChNYXRoLmFicyhlLndoZWVsRGVsdGFYKSA8IE1hdGguYWJzKGUud2hlZWxEZWx0YSkpIHx8IChNYXRoLmFicyhlLmRlbHRhWCApIDwgTWF0aC5hYnMoZS5kZWx0YVkpIHx8ICFob3Jpem9udGFsRGV0ZWN0aW9uKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL0xpbWl0aW5nIHRoZSBhcnJheSB0byAxNTAgKGxldHMgbm90IHdhc3RlIG1lbW9yeSEpXHJcbiAgICAgICAgICAgICAgICBpZihzY3JvbGxpbmdzLmxlbmd0aCA+IDE0OSl7XHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsaW5ncy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8va2VlcGluZyByZWNvcmQgb2YgdGhlIHByZXZpb3VzIHNjcm9sbGluZ3NcclxuICAgICAgICAgICAgICAgIHNjcm9sbGluZ3MucHVzaChNYXRoLmFicyh2YWx1ZSkpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vcHJldmVudGluZyB0byBzY3JvbGwgdGhlIHNpdGUgb24gbW91c2Ugd2hlZWwgd2hlbiBzY3JvbGxiYXIgaXMgcHJlc2VudFxyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9ucy5zY3JvbGxCYXIpe1xyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQgPyBlLnByZXZlbnREZWZhdWx0KCkgOiBlLnJldHVyblZhbHVlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGFjdGl2ZVNlY3Rpb24gPSAkKFNFQ1RJT05fQUNUSVZFX1NFTCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2Nyb2xsYWJsZSA9IG9wdGlvbnMuc2Nyb2xsT3ZlcmZsb3dIYW5kbGVyLnNjcm9sbGFibGUoYWN0aXZlU2VjdGlvbik7XHJcblxyXG4gICAgICAgICAgICAgICAgLy90aW1lIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgbGFzdCBzY3JvbGwgYW5kIHRoZSBjdXJyZW50IG9uZVxyXG4gICAgICAgICAgICAgICAgdmFyIHRpbWVEaWZmID0gY3VyVGltZS1wcmV2VGltZTtcclxuICAgICAgICAgICAgICAgIHByZXZUaW1lID0gY3VyVGltZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL2hhdmVuJ3QgdGhleSBzY3JvbGxlZCBpbiBhIHdoaWxlP1xyXG4gICAgICAgICAgICAgICAgLy8oZW5vdWdoIHRvIGJlIGNvbnNpZGVyIGEgZGlmZmVyZW50IHNjcm9sbGluZyBhY3Rpb24gdG8gc2Nyb2xsIGFub3RoZXIgc2VjdGlvbilcclxuICAgICAgICAgICAgICAgIGlmKHRpbWVEaWZmID4gMjAwKXtcclxuICAgICAgICAgICAgICAgICAgICAvL2VtcHR5aW5nIHRoZSBhcnJheSwgd2UgZG9udCBjYXJlIGFib3V0IG9sZCBzY3JvbGxpbmdzIGZvciBvdXIgYXZlcmFnZXNcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxpbmdzID0gW107XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoY2FuU2Nyb2xsKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYXZlcmFnZUVuZCA9IGdldEF2ZXJhZ2Uoc2Nyb2xsaW5ncywgMTApO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhdmVyYWdlTWlkZGxlID0gZ2V0QXZlcmFnZShzY3JvbGxpbmdzLCA3MCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzQWNjZWxlcmF0aW5nID0gYXZlcmFnZUVuZCA+PSBhdmVyYWdlTWlkZGxlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL3RvIGF2b2lkIGRvdWJsZSBzd2lwZXMuLi5cclxuICAgICAgICAgICAgICAgICAgICBpZihpc0FjY2VsZXJhdGluZyAmJiBpc1Njcm9sbGluZ1ZlcnRpY2FsbHkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3Njcm9sbGluZyBkb3duP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVsdGEgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxpbmcoJ2Rvd24nLCBzY3JvbGxhYmxlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc2Nyb2xsaW5nIHVwP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxpbmcoJ3VwJywgc2Nyb2xsYWJsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihvcHRpb25zLmZpdFRvU2VjdGlvbil7XHJcbiAgICAgICAgICAgICAgICAvL3N0b3BwaW5nIHRoZSBhdXRvIHNjcm9sbCB0byBhZGp1c3QgdG8gYSBzZWN0aW9uXHJcbiAgICAgICAgICAgICAgICAkaHRtbEJvZHkuc3RvcCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIFNsaWRlcyBhIHNsaWRlciB0byB0aGUgZ2l2ZW4gZGlyZWN0aW9uLlxyXG4gICAgICAgICogT3B0aW9uYWwgYHNlY3Rpb25gIHBhcmFtLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gbW92ZVNsaWRlKGRpcmVjdGlvbiwgc2VjdGlvbil7XHJcbiAgICAgICAgICAgIHZhciBhY3RpdmVTZWN0aW9uID0gdHlwZW9mIHNlY3Rpb24gPT09ICd1bmRlZmluZWQnID8gJChTRUNUSU9OX0FDVElWRV9TRUwpIDogc2VjdGlvbjtcclxuICAgICAgICAgICAgdmFyIHNsaWRlcyA9IGFjdGl2ZVNlY3Rpb24uZmluZChTTElERVNfV1JBUFBFUl9TRUwpO1xyXG4gICAgICAgICAgICB2YXIgbnVtU2xpZGVzID0gc2xpZGVzLmZpbmQoU0xJREVfU0VMKS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAvLyBtb3JlIHRoYW4gb25lIHNsaWRlIG5lZWRlZCBhbmQgbm90aGluZyBzaG91bGQgYmUgc2xpZGluZ1xyXG4gICAgICAgICAgICBpZiAoIXNsaWRlcy5sZW5ndGggfHwgc2xpZGVNb3ZpbmcgfHwgbnVtU2xpZGVzIDwgMikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgY3VycmVudFNsaWRlID0gc2xpZGVzLmZpbmQoU0xJREVfQUNUSVZFX1NFTCk7XHJcbiAgICAgICAgICAgIHZhciBkZXN0aW55ID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmKGRpcmVjdGlvbiA9PT0gJ3ByZXYnKXtcclxuICAgICAgICAgICAgICAgIGRlc3RpbnkgPSBjdXJyZW50U2xpZGUucHJldihTTElERV9TRUwpO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGRlc3RpbnkgPSBjdXJyZW50U2xpZGUubmV4dChTTElERV9TRUwpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2lzbid0IHRoZXJlIGEgbmV4dCBzbGlkZSBpbiB0aGUgc2VjdWVuY2U/XHJcbiAgICAgICAgICAgIGlmKCFkZXN0aW55Lmxlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICAvL3Jlc3BlY3QgbG9vcEhvcml6b250YWwgc2V0dGluXHJcbiAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMubG9vcEhvcml6b250YWwpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihkaXJlY3Rpb24gPT09ICdwcmV2Jyl7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdGlueSA9IGN1cnJlbnRTbGlkZS5zaWJsaW5ncygnOmxhc3QnKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc3RpbnkgPSBjdXJyZW50U2xpZGUuc2libGluZ3MoJzpmaXJzdCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzbGlkZU1vdmluZyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBsYW5kc2NhcGVTY3JvbGwoc2xpZGVzLCBkZXN0aW55KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogTWFpbnRhaW5zIHRoZSBhY3RpdmUgc2xpZGVzIGluIHRoZSB2aWV3cG9ydFxyXG4gICAgICAgICogKEJlY2F1c2UgaGUgYHNjcm9sbGAgYW5pbWF0aW9uIG1pZ2h0IGdldCBsb3N0IHdpdGggc29tZSBhY3Rpb25zLCBzdWNoIGFzIHdoZW4gdXNpbmcgY29udGludW91c1ZlcnRpY2FsKVxyXG4gICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24ga2VlcFNsaWRlc1Bvc2l0aW9uKCl7XHJcbiAgICAgICAgICAgICQoU0xJREVfQUNUSVZFX1NFTCkuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgc2lsZW50TGFuZHNjYXBlU2Nyb2xsKCQodGhpcyksICdpbnRlcm5hbCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBwcmV2aW91c0Rlc3RUb3AgPSAwO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogUmV0dXJucyB0aGUgZGVzdGluYXRpb24gWSBwb3NpdGlvbiBiYXNlZCBvbiB0aGUgc2Nyb2xsaW5nIGRpcmVjdGlvbiBhbmRcclxuICAgICAgICAqIHRoZSBoZWlnaHQgb2YgdGhlIHNlY3Rpb24uXHJcbiAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXREZXN0aW5hdGlvblBvc2l0aW9uKGVsZW1lbnQpe1xyXG4gICAgICAgICAgICB2YXIgZWxlbVBvc2l0aW9uID0gZWxlbWVudC5wb3NpdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgLy90b3Agb2YgdGhlIGRlc2luYXRpb24gd2lsbCBiZSBhdCB0aGUgdG9wIG9mIHRoZSB2aWV3cG9ydFxyXG4gICAgICAgICAgICB2YXIgcG9zaXRpb24gPSBlbGVtUG9zaXRpb24udG9wO1xyXG4gICAgICAgICAgICB2YXIgaXNTY3JvbGxpbmdEb3duID0gIGVsZW1Qb3NpdGlvbi50b3AgPiBwcmV2aW91c0Rlc3RUb3A7XHJcbiAgICAgICAgICAgIHZhciBzZWN0aW9uQm90dG9tID0gcG9zaXRpb24gLSB3aW5kb3dzSGVpZ2h0ICsgZWxlbWVudC5vdXRlckhlaWdodCgpO1xyXG5cclxuICAgICAgICAgICAgLy9pcyB0aGUgZGVzdGluYXRpb24gZWxlbWVudCBiaWdnZXIgdGhhbiB0aGUgdmlld3BvcnQ/XHJcbiAgICAgICAgICAgIGlmKGVsZW1lbnQub3V0ZXJIZWlnaHQoKSA+IHdpbmRvd3NIZWlnaHQpe1xyXG4gICAgICAgICAgICAgICAgLy9zY3JvbGxpbmcgdXA/XHJcbiAgICAgICAgICAgICAgICBpZighaXNTY3JvbGxpbmdEb3duKXtcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IHNlY3Rpb25Cb3R0b207XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vc2VjdGlvbnMgZXF1YWwgb3Igc21hbGxlciB0aGFuIHRoZSB2aWV3cG9ydCBoZWlnaHQgJiYgc2Nyb2xsaW5nIGRvd24/IHx8ICBpcyByZXNpemluZyBhbmQgaXRzIGluIHRoZSBsYXN0IHNlY3Rpb25cclxuICAgICAgICAgICAgZWxzZSBpZihpc1Njcm9sbGluZ0Rvd24gfHwgKGlzUmVzaXppbmcgJiYgZWxlbWVudC5pcygnOmxhc3QtY2hpbGQnKSkgKXtcclxuICAgICAgICAgICAgICAgIC8vVGhlIGJvdHRvbSBvZiB0aGUgZGVzdGluYXRpb24gd2lsbCBiZSBhdCB0aGUgYm90dG9tIG9mIHRoZSB2aWV3cG9ydFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSBzZWN0aW9uQm90dG9tO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICBLZWVwaW5nIHJlY29yZCBvZiB0aGUgbGFzdCBzY3JvbGxlZCBwb3NpdGlvbiB0byBkZXRlcm1pbmUgdGhlIHNjcm9sbGluZyBkaXJlY3Rpb24uXHJcbiAgICAgICAgICAgIE5vIGNvbnZlbnRpb25hbCBtZXRob2RzIGNhbiBiZSB1c2VkIGFzIHRoZSBzY3JvbGwgYmFyIG1pZ2h0IG5vdCBiZSBwcmVzZW50XHJcbiAgICAgICAgICAgIEFORCB0aGUgc2VjdGlvbiBtaWdodCBub3QgYmUgYWN0aXZlIGlmIGl0IGlzIGF1dG8taGVpZ2h0IGFuZCBkaWRudCByZWFjaCB0aGUgbWlkZGxlXHJcbiAgICAgICAgICAgIG9mIHRoZSB2aWV3cG9ydC5cclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgcHJldmlvdXNEZXN0VG9wID0gcG9zaXRpb247XHJcbiAgICAgICAgICAgIHJldHVybiBwb3NpdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogU2Nyb2xscyB0aGUgc2l0ZSB0byB0aGUgZ2l2ZW4gZWxlbWVudCBhbmQgc2Nyb2xscyB0byB0aGUgc2xpZGUgaWYgYSBjYWxsYmFjayBpcyBnaXZlbi5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHNjcm9sbFBhZ2UoZWxlbWVudCwgY2FsbGJhY2ssIGlzTW92ZW1lbnRVcCl7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlbGVtZW50ID09PSAndW5kZWZpbmVkJyl7IHJldHVybjsgfSAvL3RoZXJlJ3Mgbm8gZWxlbWVudCB0byBzY3JvbGwsIGxlYXZpbmcgdGhlIGZ1bmN0aW9uXHJcblxyXG4gICAgICAgICAgICB2YXIgZHRvcCA9IGdldERlc3RpbmF0aW9uUG9zaXRpb24oZWxlbWVudCk7XHJcblxyXG4gICAgICAgICAgICAvL2xvY2FsIHZhcmlhYmxlc1xyXG4gICAgICAgICAgICB2YXIgdiA9IHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQ6IGVsZW1lbnQsXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2ssXHJcbiAgICAgICAgICAgICAgICBpc01vdmVtZW50VXA6IGlzTW92ZW1lbnRVcCxcclxuICAgICAgICAgICAgICAgIGR0b3A6IGR0b3AsXHJcbiAgICAgICAgICAgICAgICB5TW92ZW1lbnQ6IGdldFltb3ZlbWVudChlbGVtZW50KSxcclxuICAgICAgICAgICAgICAgIGFuY2hvckxpbms6IGVsZW1lbnQuZGF0YSgnYW5jaG9yJyksXHJcbiAgICAgICAgICAgICAgICBzZWN0aW9uSW5kZXg6IGVsZW1lbnQuaW5kZXgoU0VDVElPTl9TRUwpLFxyXG4gICAgICAgICAgICAgICAgYWN0aXZlU2xpZGU6IGVsZW1lbnQuZmluZChTTElERV9BQ1RJVkVfU0VMKSxcclxuICAgICAgICAgICAgICAgIGFjdGl2ZVNlY3Rpb246ICQoU0VDVElPTl9BQ1RJVkVfU0VMKSxcclxuICAgICAgICAgICAgICAgIGxlYXZpbmdTZWN0aW9uOiAkKFNFQ1RJT05fQUNUSVZFX1NFTCkuaW5kZXgoU0VDVElPTl9TRUwpICsgMSxcclxuXHJcbiAgICAgICAgICAgICAgICAvL2NhY2hpbmcgdGhlIHZhbHVlIG9mIGlzUmVzaXppbmcgYXQgdGhlIG1vbW1lbnQgdGhlIGZ1bmN0aW9uIGlzIGNhbGxlZFxyXG4gICAgICAgICAgICAgICAgLy9iZWNhdXNlIGl0IHdpbGwgYmUgY2hlY2tlZCBsYXRlciBpbnNpZGUgYSBzZXRUaW1lb3V0IGFuZCB0aGUgdmFsdWUgbWlnaHQgY2hhbmdlXHJcbiAgICAgICAgICAgICAgICBsb2NhbElzUmVzaXppbmc6IGlzUmVzaXppbmdcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8vcXVpdGluZyB3aGVuIGRlc3RpbmF0aW9uIHNjcm9sbCBpcyB0aGUgc2FtZSBhcyB0aGUgY3VycmVudCBvbmVcclxuICAgICAgICAgICAgaWYoKHYuYWN0aXZlU2VjdGlvbi5pcyhlbGVtZW50KSAmJiAhaXNSZXNpemluZykgfHwgKG9wdGlvbnMuc2Nyb2xsQmFyICYmICR3aW5kb3cuc2Nyb2xsVG9wKCkgPT09IHYuZHRvcCAmJiAhZWxlbWVudC5oYXNDbGFzcyhBVVRPX0hFSUdIVCkgKSl7IHJldHVybjsgfVxyXG5cclxuICAgICAgICAgICAgaWYodi5hY3RpdmVTbGlkZS5sZW5ndGgpe1xyXG4gICAgICAgICAgICAgICAgdmFyIHNsaWRlQW5jaG9yTGluayA9IHYuYWN0aXZlU2xpZGUuZGF0YSgnYW5jaG9yJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2xpZGVJbmRleCA9IHYuYWN0aXZlU2xpZGUuaW5kZXgoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gSWYgY29udGludW91c1ZlcnRpY2FsICYmIHdlIG5lZWQgdG8gd3JhcCBhcm91bmRcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuYXV0b1Njcm9sbGluZyAmJiBvcHRpb25zLmNvbnRpbnVvdXNWZXJ0aWNhbCAmJiB0eXBlb2YgKHYuaXNNb3ZlbWVudFVwKSAhPT0gXCJ1bmRlZmluZWRcIiAmJlxyXG4gICAgICAgICAgICAgICAgKCghdi5pc01vdmVtZW50VXAgJiYgdi55TW92ZW1lbnQgPT0gJ3VwJykgfHwgLy8gSW50ZW5kaW5nIHRvIHNjcm9sbCBkb3duIGJ1dCBhYm91dCB0byBnbyB1cCBvclxyXG4gICAgICAgICAgICAgICAgKHYuaXNNb3ZlbWVudFVwICYmIHYueU1vdmVtZW50ID09ICdkb3duJykpKSB7IC8vIGludGVuZGluZyB0byBzY3JvbGwgdXAgYnV0IGFib3V0IHRvIGdvIGRvd25cclxuXHJcbiAgICAgICAgICAgICAgICB2ID0gY3JlYXRlSW5maW5pdGVTZWN0aW9ucyh2KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9jYWxsYmFjayAob25MZWF2ZSkgaWYgdGhlIHNpdGUgaXMgbm90IGp1c3QgcmVzaXppbmcgYW5kIHJlYWRqdXN0aW5nIHRoZSBzbGlkZXNcclxuICAgICAgICAgICAgaWYoJC5pc0Z1bmN0aW9uKG9wdGlvbnMub25MZWF2ZSkgJiYgIXYubG9jYWxJc1Jlc2l6aW5nKXtcclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnMub25MZWF2ZS5jYWxsKHYuYWN0aXZlU2VjdGlvbiwgdi5sZWF2aW5nU2VjdGlvbiwgKHYuc2VjdGlvbkluZGV4ICsgMSksIHYueU1vdmVtZW50KSA9PT0gZmFsc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdG9wTWVkaWEodi5hY3RpdmVTZWN0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoQUNUSVZFKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKEFDVElWRSk7XHJcbiAgICAgICAgICAgIGxhenlMb2FkKGVsZW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgLy9wcmV2ZW50aW5nIGZyb20gYWN0aXZhdGluZyB0aGUgTW91c2VXaGVlbEhhbmRsZXIgZXZlbnRcclxuICAgICAgICAgICAgLy9tb3JlIHRoYW4gb25jZSBpZiB0aGUgcGFnZSBpcyBzY3JvbGxpbmdcclxuICAgICAgICAgICAgY2FuU2Nyb2xsID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBzZXRTdGF0ZShzbGlkZUluZGV4LCBzbGlkZUFuY2hvckxpbmssIHYuYW5jaG9yTGluaywgdi5zZWN0aW9uSW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgcGVyZm9ybU1vdmVtZW50KHYpO1xyXG5cclxuICAgICAgICAgICAgLy9mbGFnIHRvIGF2b2lkIGNhbGxpbmduIGBzY3JvbGxQYWdlKClgIHR3aWNlIGluIGNhc2Ugb2YgdXNpbmcgYW5jaG9yIGxpbmtzXHJcbiAgICAgICAgICAgIGxhc3RTY3JvbGxlZERlc3RpbnkgPSB2LmFuY2hvckxpbms7XHJcblxyXG4gICAgICAgICAgICAvL2F2b2lkIGZpcmluZyBpdCB0d2ljZSAoYXMgaXQgZG9lcyBhbHNvIG9uIHNjcm9sbClcclxuICAgICAgICAgICAgYWN0aXZhdGVNZW51QW5kTmF2KHYuYW5jaG9yTGluaywgdi5zZWN0aW9uSW5kZXgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBQZXJmb3JtcyB0aGUgbW92ZW1lbnQgKGJ5IENTUzMgb3IgYnkgalF1ZXJ5KVxyXG4gICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gcGVyZm9ybU1vdmVtZW50KHYpe1xyXG4gICAgICAgICAgICAvLyB1c2luZyBDU1MzIHRyYW5zbGF0ZSBmdW5jdGlvbmFsaXR5XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmNzczMgJiYgb3B0aW9ucy5hdXRvU2Nyb2xsaW5nICYmICFvcHRpb25zLnNjcm9sbEJhcikge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRyYW5zbGF0ZTNkID0gJ3RyYW5zbGF0ZTNkKDBweCwgLScgKyB2LmR0b3AgKyAncHgsIDBweCknO1xyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtQ29udGFpbmVyKHRyYW5zbGF0ZTNkLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL2V2ZW4gd2hlbiB0aGUgc2Nyb2xsaW5nU3BlZWQgaXMgMCB0aGVyZSdzIGEgbGl0dGxlIGRlbGF5LCB3aGljaCBtaWdodCBjYXVzZSB0aGVcclxuICAgICAgICAgICAgICAgIC8vc2Nyb2xsaW5nU3BlZWQgdG8gY2hhbmdlIGluIGNhc2Ugb2YgdXNpbmcgc2lsZW50TW92ZVRvKCk7XHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zLnNjcm9sbGluZ1NwZWVkKXtcclxuICAgICAgICAgICAgICAgICAgICBhZnRlclNlY3Rpb25Mb2Fkc0lkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFmdGVyU2VjdGlvbkxvYWRzKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIG9wdGlvbnMuc2Nyb2xsaW5nU3BlZWQpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgYWZ0ZXJTZWN0aW9uTG9hZHModik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHVzaW5nIGpRdWVyeSBhbmltYXRlXHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2Nyb2xsU2V0dGluZ3MgPSBnZXRTY3JvbGxTZXR0aW5ncyh2KTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKHNjcm9sbFNldHRpbmdzLmVsZW1lbnQpLmFuaW1hdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsU2V0dGluZ3Mub3B0aW9ucyxcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMuc2Nyb2xsaW5nU3BlZWQsIG9wdGlvbnMuZWFzaW5nKS5wcm9taXNlKCkuZG9uZShmdW5jdGlvbiAoKSB7IC8vb25seSBvbmUgc2luZ2xlIGNhbGxiYWNrIGluIGNhc2Ugb2YgYW5pbWF0aW5nICBgaHRtbCwgYm9keWBcclxuICAgICAgICAgICAgICAgICAgICBpZihvcHRpb25zLnNjcm9sbEJhcil7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBIYWNrIVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBUaGUgdGltZW91dCBwcmV2ZW50cyBzZXR0aW5nIHRoZSBtb3N0IGRvbWluYW50IHNlY3Rpb24gaW4gdGhlIHZpZXdwb3J0IGFzIFwiYWN0aXZlXCIgd2hlbiB0aGUgdXNlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxlZCB0byBhIHNtYWxsZXIgc2VjdGlvbiBieSB1c2luZyB0aGUgbW91c2V3aGVlbCAoYXV0byBzY3JvbGxpbmcpIHJhdGhlciB0aGFuIGRyYWdpbmcgdGhlIHNjcm9sbCBiYXIuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBXaGVuIHVzaW5nIHNjcm9sbEJhcjp0cnVlIEl0IHNlZW1zIGxpa2UgdGhlIHNjcm9sbCBldmVudHMgc3RpbGwgZ2V0dGluZyBwcm9wYWdhdGVkIGV2ZW4gYWZ0ZXIgdGhlIHNjcm9sbGluZyBhbmltYXRpb24gaGFzIGZpbmlzaGVkLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZnRlclNlY3Rpb25Mb2Fkcyh2KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwzMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFmdGVyU2VjdGlvbkxvYWRzKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIEdldHMgdGhlIHNjcm9sbGluZyBzZXR0aW5ncyBkZXBlbmRpbmcgb24gdGhlIHBsdWdpbiBhdXRvU2Nyb2xsaW5nIG9wdGlvblxyXG4gICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0U2Nyb2xsU2V0dGluZ3Modil7XHJcbiAgICAgICAgICAgIHZhciBzY3JvbGwgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIGlmKG9wdGlvbnMuYXV0b1Njcm9sbGluZyAmJiAhb3B0aW9ucy5zY3JvbGxCYXIpe1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsLm9wdGlvbnMgPSB7ICd0b3AnOiAtdi5kdG9wfTtcclxuICAgICAgICAgICAgICAgIHNjcm9sbC5lbGVtZW50ID0gV1JBUFBFUl9TRUw7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsLm9wdGlvbnMgPSB7ICdzY3JvbGxUb3AnOiB2LmR0b3B9O1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsLmVsZW1lbnQgPSAnaHRtbCwgYm9keSc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzY3JvbGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIEFkZHMgc2VjdGlvbnMgYmVmb3JlIG9yIGFmdGVyIHRoZSBjdXJyZW50IG9uZSB0byBjcmVhdGUgdGhlIGluZmluaXRlIGVmZmVjdC5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUluZmluaXRlU2VjdGlvbnModil7XHJcbiAgICAgICAgICAgIC8vIFNjcm9sbGluZyBkb3duXHJcbiAgICAgICAgICAgIGlmICghdi5pc01vdmVtZW50VXApIHtcclxuICAgICAgICAgICAgICAgIC8vIE1vdmUgYWxsIHByZXZpb3VzIHNlY3Rpb25zIHRvIGFmdGVyIHRoZSBhY3RpdmUgc2VjdGlvblxyXG4gICAgICAgICAgICAgICAgJChTRUNUSU9OX0FDVElWRV9TRUwpLmFmdGVyKHYuYWN0aXZlU2VjdGlvbi5wcmV2QWxsKFNFQ1RJT05fU0VMKS5nZXQoKS5yZXZlcnNlKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgeyAvLyBTY3JvbGxpbmcgdXBcclxuICAgICAgICAgICAgICAgIC8vIE1vdmUgYWxsIG5leHQgc2VjdGlvbnMgdG8gYmVmb3JlIHRoZSBhY3RpdmUgc2VjdGlvblxyXG4gICAgICAgICAgICAgICAgJChTRUNUSU9OX0FDVElWRV9TRUwpLmJlZm9yZSh2LmFjdGl2ZVNlY3Rpb24ubmV4dEFsbChTRUNUSU9OX1NFTCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBNYWludGFpbiB0aGUgZGlzcGxheWVkIHBvc2l0aW9uIChub3cgdGhhdCB3ZSBjaGFuZ2VkIHRoZSBlbGVtZW50IG9yZGVyKVxyXG4gICAgICAgICAgICBzaWxlbnRTY3JvbGwoJChTRUNUSU9OX0FDVElWRV9TRUwpLnBvc2l0aW9uKCkudG9wKTtcclxuXHJcbiAgICAgICAgICAgIC8vIE1haW50YWluIHRoZSBhY3RpdmUgc2xpZGVzIHZpc2libGUgaW4gdGhlIHZpZXdwb3J0XHJcbiAgICAgICAgICAgIGtlZXBTbGlkZXNQb3NpdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgLy8gc2F2ZSBmb3IgbGF0ZXIgdGhlIGVsZW1lbnRzIHRoYXQgc3RpbGwgbmVlZCB0byBiZSByZW9yZGVyZWRcclxuICAgICAgICAgICAgdi53cmFwQXJvdW5kRWxlbWVudHMgPSB2LmFjdGl2ZVNlY3Rpb247XHJcblxyXG4gICAgICAgICAgICAvLyBSZWNhbGN1bGF0ZSBhbmltYXRpb24gdmFyaWFibGVzXHJcbiAgICAgICAgICAgIHYuZHRvcCA9IHYuZWxlbWVudC5wb3NpdGlvbigpLnRvcDtcclxuICAgICAgICAgICAgdi55TW92ZW1lbnQgPSBnZXRZbW92ZW1lbnQodi5lbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB2O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBGaXggc2VjdGlvbiBvcmRlciBhZnRlciBjb250aW51b3VzVmVydGljYWwgY2hhbmdlcyBoYXZlIGJlZW4gYW5pbWF0ZWRcclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGNvbnRpbnVvdXNWZXJ0aWNhbEZpeFNlY3Rpb25PcmRlciAodikge1xyXG4gICAgICAgICAgICAvLyBJZiBjb250aW51b3VzVmVydGljYWwgaXMgaW4gZWZmZWN0IChhbmQgYXV0b1Njcm9sbGluZyB3b3VsZCBhbHNvIGJlIGluIGVmZmVjdCB0aGVuKSxcclxuICAgICAgICAgICAgLy8gZmluaXNoIG1vdmluZyB0aGUgZWxlbWVudHMgYXJvdW5kIHNvIHRoZSBkaXJlY3QgbmF2aWdhdGlvbiB3aWxsIGZ1bmN0aW9uIG1vcmUgc2ltcGx5XHJcbiAgICAgICAgICAgIGlmICghdi53cmFwQXJvdW5kRWxlbWVudHMgfHwgIXYud3JhcEFyb3VuZEVsZW1lbnRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodi5pc01vdmVtZW50VXApIHtcclxuICAgICAgICAgICAgICAgICQoU0VDVElPTl9GSVJTVF9TRUwpLmJlZm9yZSh2LndyYXBBcm91bmRFbGVtZW50cyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKFNFQ1RJT05fTEFTVF9TRUwpLmFmdGVyKHYud3JhcEFyb3VuZEVsZW1lbnRzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2lsZW50U2Nyb2xsKCQoU0VDVElPTl9BQ1RJVkVfU0VMKS5wb3NpdGlvbigpLnRvcCk7XHJcblxyXG4gICAgICAgICAgICAvLyBNYWludGFpbiB0aGUgYWN0aXZlIHNsaWRlcyB2aXNpYmxlIGluIHRoZSB2aWV3cG9ydFxyXG4gICAgICAgICAgICBrZWVwU2xpZGVzUG9zaXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIEFjdGlvbnMgdG8gZG8gb25jZSB0aGUgc2VjdGlvbiBpcyBsb2FkZWQuXHJcbiAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBhZnRlclNlY3Rpb25Mb2FkcyAodil7XHJcbiAgICAgICAgICAgIGNvbnRpbnVvdXNWZXJ0aWNhbEZpeFNlY3Rpb25PcmRlcih2KTtcclxuXHJcbiAgICAgICAgICAgIHYuZWxlbWVudC5maW5kKCcuZnAtc2Nyb2xsYWJsZScpLm1vdXNlb3ZlcigpO1xyXG5cclxuICAgICAgICAgICAgLy9jYWxsYmFjayAoYWZ0ZXJMb2FkKSBpZiB0aGUgc2l0ZSBpcyBub3QganVzdCByZXNpemluZyBhbmQgcmVhZGp1c3RpbmcgdGhlIHNsaWRlc1xyXG4gICAgICAgICAgICAkLmlzRnVuY3Rpb24ob3B0aW9ucy5hZnRlckxvYWQpICYmICF2LmxvY2FsSXNSZXNpemluZyAmJiBvcHRpb25zLmFmdGVyTG9hZC5jYWxsKHYuZWxlbWVudCwgdi5hbmNob3JMaW5rLCAodi5zZWN0aW9uSW5kZXggKyAxKSk7XHJcblxyXG4gICAgICAgICAgICBwbGF5TWVkaWEodi5lbGVtZW50KTtcclxuICAgICAgICAgICAgdi5lbGVtZW50LmFkZENsYXNzKENPTVBMRVRFTFkpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoQ09NUExFVEVMWSk7XHJcblxyXG4gICAgICAgICAgICBjYW5TY3JvbGwgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgJC5pc0Z1bmN0aW9uKHYuY2FsbGJhY2spICYmIHYuY2FsbGJhY2suY2FsbCh0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogTGF6eSBsb2FkcyBpbWFnZSwgdmlkZW8gYW5kIGF1ZGlvIGVsZW1lbnRzLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gbGF6eUxvYWQoZGVzdGlueSl7XHJcbiAgICAgICAgICAgIHZhciBkZXN0aW55ID0gZ2V0U2xpZGVPclNlY3Rpb24oZGVzdGlueSk7XHJcblxyXG4gICAgICAgICAgICBkZXN0aW55LmZpbmQoJ2ltZ1tkYXRhLXNyY10sIHNvdXJjZVtkYXRhLXNyY10sIGF1ZGlvW2RhdGEtc3JjXScpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignc3JjJywgJCh0aGlzKS5kYXRhKCdzcmMnKSk7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUF0dHIoJ2RhdGEtc3JjJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJCh0aGlzKS5pcygnc291cmNlJykpe1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgndmlkZW8nKS5nZXQoMCkubG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogUGxheXMgdmlkZW8gYW5kIGF1ZGlvIGVsZW1lbnRzLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gcGxheU1lZGlhKGRlc3Rpbnkpe1xyXG4gICAgICAgICAgICB2YXIgZGVzdGlueSA9IGdldFNsaWRlT3JTZWN0aW9uKGRlc3RpbnkpO1xyXG5cclxuICAgICAgICAgICAgLy9wbGF5aW5nIEhUTUw1IG1lZGlhIGVsZW1lbnRzXHJcbiAgICAgICAgICAgIGRlc3RpbnkuZmluZCgndmlkZW8sIGF1ZGlvJykuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSAkKHRoaXMpLmdldCgwKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiggZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2F1dG9wbGF5JykgJiYgdHlwZW9mIGVsZW1lbnQucGxheSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnBsYXkoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIFN0b3BzIHZpZGVvIGFuZCBhdWRpbyBlbGVtZW50cy5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHN0b3BNZWRpYShkZXN0aW55KXtcclxuICAgICAgICAgICAgdmFyIGRlc3RpbnkgPSBnZXRTbGlkZU9yU2VjdGlvbihkZXN0aW55KTtcclxuXHJcbiAgICAgICAgICAgIC8vc3RvcHBpbmcgSFRNTDUgbWVkaWEgZWxlbWVudHNcclxuICAgICAgICAgICAgZGVzdGlueS5maW5kKCd2aWRlbywgYXVkaW8nKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9ICQodGhpcykuZ2V0KDApO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCAhZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2RhdGEtaWdub3JlJykgJiYgdHlwZW9mIGVsZW1lbnQucGF1c2UgPT09ICdmdW5jdGlvbicgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5wYXVzZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogR2V0cyB0aGUgYWN0aXZlIHNsaWRlIChvciBzZWN0aW9uKSBmb3IgdGhlIGdpdmVuIHNlY3Rpb25cclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldFNsaWRlT3JTZWN0aW9uKGRlc3Rpbnkpe1xyXG4gICAgICAgICAgICB2YXIgc2xpZGUgPSBkZXN0aW55LmZpbmQoU0xJREVfQUNUSVZFX1NFTCk7XHJcbiAgICAgICAgICAgIGlmKCBzbGlkZS5sZW5ndGggKSB7XHJcbiAgICAgICAgICAgICAgICBkZXN0aW55ID0gJChzbGlkZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkZXN0aW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBTY3JvbGxzIHRvIHRoZSBhbmNob3IgaW4gdGhlIFVSTCB3aGVuIGxvYWRpbmcgdGhlIHNpdGVcclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHNjcm9sbFRvQW5jaG9yKCl7XHJcbiAgICAgICAgICAgIC8vZ2V0dGluZyB0aGUgYW5jaG9yIGxpbmsgaW4gdGhlIFVSTCBhbmQgZGVsZXRpbmcgdGhlIGAjYFxyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSAgd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKS5zcGxpdCgnLycpO1xyXG4gICAgICAgICAgICB2YXIgc2VjdGlvbiA9IHZhbHVlWzBdO1xyXG4gICAgICAgICAgICB2YXIgc2xpZGUgPSB2YWx1ZVsxXTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlY3Rpb24peyAgLy9pZiB0aGVyZXMgYW55ICNcclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnMuYW5pbWF0ZUFuY2hvcil7XHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUGFnZUFuZFNsaWRlKHNlY3Rpb24sIHNsaWRlKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIEZQLnNpbGVudE1vdmVUbyhzZWN0aW9uLCBzbGlkZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogRGV0ZWN0aW5nIGFueSBjaGFuZ2Ugb24gdGhlIFVSTCB0byBzY3JvbGwgdG8gdGhlIGdpdmVuIGFuY2hvciBsaW5rXHJcbiAgICAgICAgKiAoYSB3YXkgdG8gZGV0ZWN0IGJhY2sgaGlzdG9yeSBidXR0b24gYXMgd2UgcGxheSB3aXRoIHRoZSBoYXNoZXMgb24gdGhlIFVSTClcclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGhhc2hDaGFuZ2VIYW5kbGVyKCl7XHJcbiAgICAgICAgICAgIGlmKCFpc1Njcm9sbGluZyAmJiAhb3B0aW9ucy5sb2NrQW5jaG9ycyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSAgd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKS5zcGxpdCgnLycpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlY3Rpb24gPSB2YWx1ZVswXTtcclxuICAgICAgICAgICAgICAgIHZhciBzbGlkZSA9IHZhbHVlWzFdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL3doZW4gbW92aW5nIHRvIGEgc2xpZGUgaW4gdGhlIGZpcnN0IHNlY3Rpb24gZm9yIHRoZSBmaXJzdCB0aW1lIChmaXJzdCB0aW1lIHRvIGFkZCBhbiBhbmNob3IgdG8gdGhlIFVSTClcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaXNGaXJzdFNsaWRlTW92ZSA9ICAodHlwZW9mIGxhc3RTY3JvbGxlZERlc3RpbnkgPT09ICd1bmRlZmluZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaXNGaXJzdFNjcm9sbE1vdmUgPSAodHlwZW9mIGxhc3RTY3JvbGxlZERlc3RpbnkgPT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBzbGlkZSA9PT0gJ3VuZGVmaW5lZCcgJiYgIXNsaWRlTW92aW5nKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgaWYoc2VjdGlvbi5sZW5ndGgpe1xyXG4gICAgICAgICAgICAgICAgICAgIC8qaW4gb3JkZXIgdG8gY2FsbCBzY3JvbGxwYWdlKCkgb25seSBvbmNlIGZvciBlYWNoIGRlc3RpbmF0aW9uIGF0IGEgdGltZVxyXG4gICAgICAgICAgICAgICAgICAgIEl0IGlzIGNhbGxlZCB0d2ljZSBmb3IgZWFjaCBzY3JvbGwgb3RoZXJ3aXNlLCBhcyBpbiBjYXNlIG9mIHVzaW5nIGFuY2hvcmxpbmtzIGBoYXNoQ2hhbmdlYFxyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50IGlzIGZpcmVkIG9uIGV2ZXJ5IHNjcm9sbCB0b28uKi9cclxuICAgICAgICAgICAgICAgICAgICBpZiAoKHNlY3Rpb24gJiYgc2VjdGlvbiAhPT0gbGFzdFNjcm9sbGVkRGVzdGlueSkgJiYgIWlzRmlyc3RTbGlkZU1vdmUgfHwgaXNGaXJzdFNjcm9sbE1vdmUgfHwgKCFzbGlkZU1vdmluZyAmJiBsYXN0U2Nyb2xsZWRTbGlkZSAhPSBzbGlkZSApKSAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxQYWdlQW5kU2xpZGUoc2VjdGlvbiwgc2xpZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9TbGlkaW5nIHdpdGggYXJyb3cga2V5cywgYm90aCwgdmVydGljYWwgYW5kIGhvcml6b250YWxcclxuICAgICAgICBmdW5jdGlvbiBrZXlkb3duSGFuZGxlcihlKSB7XHJcblxyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoa2V5ZG93bklkKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhY3RpdmVFbGVtZW50ID0gJCgnOmZvY3VzJyk7XHJcblxyXG4gICAgICAgICAgICBpZighYWN0aXZlRWxlbWVudC5pcygndGV4dGFyZWEnKSAmJiAhYWN0aXZlRWxlbWVudC5pcygnaW5wdXQnKSAmJiAhYWN0aXZlRWxlbWVudC5pcygnc2VsZWN0JykgJiZcclxuICAgICAgICAgICAgICAgIGFjdGl2ZUVsZW1lbnQuYXR0cignY29udGVudEVkaXRhYmxlJykgIT09IFwidHJ1ZVwiICYmIGFjdGl2ZUVsZW1lbnQuYXR0cignY29udGVudEVkaXRhYmxlJykgIT09ICcnICYmXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLmtleWJvYXJkU2Nyb2xsaW5nICYmIG9wdGlvbnMuYXV0b1Njcm9sbGluZyl7XHJcbiAgICAgICAgICAgICAgICB2YXIga2V5Q29kZSA9IGUud2hpY2g7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9wcmV2ZW50aW5nIHRoZSBzY3JvbGwgd2l0aCBhcnJvdyBrZXlzICYgc3BhY2ViYXIgJiBQYWdlIFVwICYgRG93biBrZXlzXHJcbiAgICAgICAgICAgICAgICB2YXIga2V5Q29udHJvbHMgPSBbNDAsIDM4LCAzMiwgMzMsIDM0XTtcclxuICAgICAgICAgICAgICAgIGlmKCQuaW5BcnJheShrZXlDb2RlLCBrZXlDb250cm9scykgPiAtMSl7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnRyb2xQcmVzc2VkID0gZS5jdHJsS2V5O1xyXG5cclxuICAgICAgICAgICAgICAgIGtleWRvd25JZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBvbmtleWRvd24oZSk7XHJcbiAgICAgICAgICAgICAgICB9LDE1MCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRvb2x0aXBUZXh0SGFuZGxlcigpe1xyXG4gICAgICAgICAgICAkKHRoaXMpLnByZXYoKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy90byBwcmV2ZW50IHNjcm9sbGluZyB3aGlsZSB6b29taW5nXHJcbiAgICAgICAgZnVuY3Rpb24ga2V5VXBIYW5kbGVyKGUpe1xyXG4gICAgICAgICAgICBpZihpc1dpbmRvd0ZvY3VzZWQpeyAvL3RoZSBrZXl1cCBnZXRzIGZpcmVkIG9uIG5ldyB0YWIgY3RybCArIHQgaW4gRmlyZWZveFxyXG4gICAgICAgICAgICAgICAgY29udHJvbFByZXNzZWQgPSBlLmN0cmxLZXk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vYmluZGluZyB0aGUgbW91c2Vtb3ZlIHdoZW4gdGhlIG1vdXNlJ3MgbWlkZGxlIGJ1dHRvbiBpcyByZWxlYXNlZFxyXG4gICAgICAgIGZ1bmN0aW9uIG1vdXNlRG93bkhhbmRsZXIoZSl7XHJcbiAgICAgICAgICAgIC8vbWlkZGxlIGJ1dHRvblxyXG4gICAgICAgICAgICBpZiAoZS53aGljaCA9PSAyKXtcclxuICAgICAgICAgICAgICAgIG9sZFBhZ2VZID0gZS5wYWdlWTtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5vbignbW91c2Vtb3ZlJywgbW91c2VNb3ZlSGFuZGxlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vdW5iaW5kaW5nIHRoZSBtb3VzZW1vdmUgd2hlbiB0aGUgbW91c2UncyBtaWRkbGUgYnV0dG9uIGlzIHJlbGVhc2VkXHJcbiAgICAgICAgZnVuY3Rpb24gbW91c2VVcEhhbmRsZXIoZSl7XHJcbiAgICAgICAgICAgIC8vbWlkZGxlIGJ1dHRvblxyXG4gICAgICAgICAgICBpZiAoZS53aGljaCA9PSAyKXtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5vZmYoJ21vdXNlbW92ZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1Njcm9sbGluZyBob3Jpem9udGFsbHkgd2hlbiBjbGlja2luZyBvbiB0aGUgc2xpZGVyIGNvbnRyb2xzLlxyXG4gICAgICAgIGZ1bmN0aW9uIHNsaWRlQXJyb3dIYW5kbGVyKCl7XHJcbiAgICAgICAgICAgIHZhciBzZWN0aW9uID0gJCh0aGlzKS5jbG9zZXN0KFNFQ1RJT05fU0VMKTtcclxuXHJcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKFNMSURFU19QUkVWKSkge1xyXG4gICAgICAgICAgICAgICAgaWYoaXNTY3JvbGxBbGxvd2VkLm0ubGVmdCl7XHJcbiAgICAgICAgICAgICAgICAgICAgRlAubW92ZVNsaWRlTGVmdChzZWN0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmKGlzU2Nyb2xsQWxsb3dlZC5tLnJpZ2h0KXtcclxuICAgICAgICAgICAgICAgICAgICBGUC5tb3ZlU2xpZGVSaWdodChzZWN0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy93aGVuIG9wZW5pbmcgYSBuZXcgdGFiIChjdHJsICsgdCksIGBjb250cm9sYCB3b24ndCBiZSBwcmVzc2VkIHdoZW4gY29tbWluZyBiYWNrLlxyXG4gICAgICAgIGZ1bmN0aW9uIGJsdXJIYW5kbGVyKCl7XHJcbiAgICAgICAgICAgIGlzV2luZG93Rm9jdXNlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjb250cm9sUHJlc3NlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9TY3JvbGxzIHRvIHRoZSBzZWN0aW9uIHdoZW4gY2xpY2tpbmcgdGhlIG5hdmlnYXRpb24gYnVsbGV0XHJcbiAgICAgICAgZnVuY3Rpb24gc2VjdGlvbkJ1bGxldEhhbmRsZXIoZSl7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gJCh0aGlzKS5wYXJlbnQoKS5pbmRleCgpO1xyXG4gICAgICAgICAgICBzY3JvbGxQYWdlKCQoU0VDVElPTl9TRUwpLmVxKGluZGV4KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1Njcm9sbHMgdGhlIHNsaWRlciB0byB0aGUgZ2l2ZW4gc2xpZGUgZGVzdGluYXRpb24gZm9yIHRoZSBnaXZlbiBzZWN0aW9uXHJcbiAgICAgICAgZnVuY3Rpb24gc2xpZGVCdWxsZXRIYW5kbGVyKGUpe1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHZhciBzbGlkZXMgPSAkKHRoaXMpLmNsb3Nlc3QoU0VDVElPTl9TRUwpLmZpbmQoU0xJREVTX1dSQVBQRVJfU0VMKTtcclxuICAgICAgICAgICAgdmFyIGRlc3RpbnkgPSBzbGlkZXMuZmluZChTTElERV9TRUwpLmVxKCQodGhpcykuY2xvc2VzdCgnbGknKS5pbmRleCgpKTtcclxuXHJcbiAgICAgICAgICAgIGxhbmRzY2FwZVNjcm9sbChzbGlkZXMsIGRlc3RpbnkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBLZXlkb3duIGV2ZW50XHJcbiAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBvbmtleWRvd24oZSl7XHJcbiAgICAgICAgICAgIHZhciBzaGlmdFByZXNzZWQgPSBlLnNoaWZ0S2V5O1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoIChlLndoaWNoKSB7XHJcbiAgICAgICAgICAgICAgICAvL3VwXHJcbiAgICAgICAgICAgICAgICBjYXNlIDM4OlxyXG4gICAgICAgICAgICAgICAgY2FzZSAzMzpcclxuICAgICAgICAgICAgICAgICAgICBpZihpc1Njcm9sbEFsbG93ZWQuay51cCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEZQLm1vdmVTZWN0aW9uVXAoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9kb3duXHJcbiAgICAgICAgICAgICAgICBjYXNlIDMyOiAvL3NwYWNlYmFyXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc2hpZnRQcmVzc2VkICYmIGlzU2Nyb2xsQWxsb3dlZC5rLnVwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRlAubW92ZVNlY3Rpb25VcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQwOlxyXG4gICAgICAgICAgICAgICAgY2FzZSAzNDpcclxuICAgICAgICAgICAgICAgICAgICBpZihpc1Njcm9sbEFsbG93ZWQuay5kb3duKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRlAubW92ZVNlY3Rpb25Eb3duKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vSG9tZVxyXG4gICAgICAgICAgICAgICAgY2FzZSAzNjpcclxuICAgICAgICAgICAgICAgICAgICBpZihpc1Njcm9sbEFsbG93ZWQuay51cCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEZQLm1vdmVUbygxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9FbmRcclxuICAgICAgICAgICAgICAgIGNhc2UgMzU6XHJcbiAgICAgICAgICAgICAgICAgICAgIGlmKGlzU2Nyb2xsQWxsb3dlZC5rLmRvd24pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBGUC5tb3ZlVG8oICQoU0VDVElPTl9TRUwpLmxlbmd0aCApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAvL2xlZnRcclxuICAgICAgICAgICAgICAgIGNhc2UgMzc6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaXNTY3JvbGxBbGxvd2VkLmsubGVmdCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEZQLm1vdmVTbGlkZUxlZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9yaWdodFxyXG4gICAgICAgICAgICAgICAgY2FzZSAzOTpcclxuICAgICAgICAgICAgICAgICAgICBpZihpc1Njcm9sbEFsbG93ZWQuay5yaWdodCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEZQLm1vdmVTbGlkZVJpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAvLyBleGl0IHRoaXMgaGFuZGxlciBmb3Igb3RoZXIga2V5c1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIERldGVjdGluZyB0aGUgZGlyZWN0aW9uIG9mIHRoZSBtb3VzZSBtb3ZlbWVudC5cclxuICAgICAgICAqIFVzZWQgb25seSBmb3IgdGhlIG1pZGRsZSBidXR0b24gb2YgdGhlIG1vdXNlLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgdmFyIG9sZFBhZ2VZID0gMDtcclxuICAgICAgICBmdW5jdGlvbiBtb3VzZU1vdmVIYW5kbGVyKGUpe1xyXG4gICAgICAgICAgICBpZihjYW5TY3JvbGwpe1xyXG4gICAgICAgICAgICAgICAgLy8gbW92aW5nIHVwXHJcbiAgICAgICAgICAgICAgICBpZiAoZS5wYWdlWSA8IG9sZFBhZ2VZICYmIGlzU2Nyb2xsQWxsb3dlZC5tLnVwKXtcclxuICAgICAgICAgICAgICAgICAgICBGUC5tb3ZlU2VjdGlvblVwKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gbW92aW5nIGRvd25cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYoZS5wYWdlWSA+IG9sZFBhZ2VZICYmIGlzU2Nyb2xsQWxsb3dlZC5tLmRvd24pe1xyXG4gICAgICAgICAgICAgICAgICAgIEZQLm1vdmVTZWN0aW9uRG93bigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9sZFBhZ2VZID0gZS5wYWdlWTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogU2Nyb2xscyBob3Jpem9udGFsIHNsaWRlcnMuXHJcbiAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBsYW5kc2NhcGVTY3JvbGwoc2xpZGVzLCBkZXN0aW55KXtcclxuICAgICAgICAgICAgdmFyIGRlc3RpbnlQb3MgPSBkZXN0aW55LnBvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgIHZhciBzbGlkZUluZGV4ID0gZGVzdGlueS5pbmRleCgpO1xyXG4gICAgICAgICAgICB2YXIgc2VjdGlvbiA9IHNsaWRlcy5jbG9zZXN0KFNFQ1RJT05fU0VMKTtcclxuICAgICAgICAgICAgdmFyIHNlY3Rpb25JbmRleCA9IHNlY3Rpb24uaW5kZXgoU0VDVElPTl9TRUwpO1xyXG4gICAgICAgICAgICB2YXIgYW5jaG9yTGluayA9IHNlY3Rpb24uZGF0YSgnYW5jaG9yJyk7XHJcbiAgICAgICAgICAgIHZhciBzbGlkZXNOYXYgPSBzZWN0aW9uLmZpbmQoU0xJREVTX05BVl9TRUwpO1xyXG4gICAgICAgICAgICB2YXIgc2xpZGVBbmNob3IgPSBnZXRBbmNob3IoZGVzdGlueSk7XHJcbiAgICAgICAgICAgIHZhciBwcmV2U2xpZGUgPSBzZWN0aW9uLmZpbmQoU0xJREVfQUNUSVZFX1NFTCk7XHJcblxyXG4gICAgICAgICAgICAvL2NhY2hpbmcgdGhlIHZhbHVlIG9mIGlzUmVzaXppbmcgYXQgdGhlIG1vbW1lbnQgdGhlIGZ1bmN0aW9uIGlzIGNhbGxlZFxyXG4gICAgICAgICAgICAvL2JlY2F1c2UgaXQgd2lsbCBiZSBjaGVja2VkIGxhdGVyIGluc2lkZSBhIHNldFRpbWVvdXQgYW5kIHRoZSB2YWx1ZSBtaWdodCBjaGFuZ2VcclxuICAgICAgICAgICAgdmFyIGxvY2FsSXNSZXNpemluZyA9IGlzUmVzaXppbmc7XHJcblxyXG4gICAgICAgICAgICBpZihvcHRpb25zLm9uU2xpZGVMZWF2ZSl7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJldlNsaWRlSW5kZXggPSBwcmV2U2xpZGUuaW5kZXgoKTtcclxuICAgICAgICAgICAgICAgIHZhciB4TW92ZW1lbnQgPSBnZXRYbW92ZW1lbnQocHJldlNsaWRlSW5kZXgsIHNsaWRlSW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vaWYgdGhlIHNpdGUgaXMgbm90IGp1c3QgcmVzaXppbmcgYW5kIHJlYWRqdXN0aW5nIHRoZSBzbGlkZXNcclxuICAgICAgICAgICAgICAgIGlmKCFsb2NhbElzUmVzaXppbmcgJiYgeE1vdmVtZW50IT09J25vbmUnKXtcclxuICAgICAgICAgICAgICAgICAgICBpZigkLmlzRnVuY3Rpb24oIG9wdGlvbnMub25TbGlkZUxlYXZlICkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihvcHRpb25zLm9uU2xpZGVMZWF2ZS5jYWxsKCBwcmV2U2xpZGUsIGFuY2hvckxpbmssIChzZWN0aW9uSW5kZXggKyAxKSwgcHJldlNsaWRlSW5kZXgsIHhNb3ZlbWVudCwgc2xpZGVJbmRleCApID09PSBmYWxzZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGlkZU1vdmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN0b3BNZWRpYShwcmV2U2xpZGUpO1xyXG5cclxuICAgICAgICAgICAgZGVzdGlueS5hZGRDbGFzcyhBQ1RJVkUpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoQUNUSVZFKTtcclxuICAgICAgICAgICAgaWYoIWxvY2FsSXNSZXNpemluZyl7XHJcbiAgICAgICAgICAgICAgICBsYXp5TG9hZChkZXN0aW55KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoIW9wdGlvbnMubG9vcEhvcml6b250YWwgJiYgb3B0aW9ucy5jb250cm9sQXJyb3dzKXtcclxuICAgICAgICAgICAgICAgIC8vaGlkZGluZyBpdCBmb3IgdGhlIGZpc3Qgc2xpZGUsIHNob3dpbmcgZm9yIHRoZSByZXN0XHJcbiAgICAgICAgICAgICAgICBzZWN0aW9uLmZpbmQoU0xJREVTX0FSUk9XX1BSRVZfU0VMKS50b2dnbGUoc2xpZGVJbmRleCE9PTApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vaGlkZGluZyBpdCBmb3IgdGhlIGxhc3Qgc2xpZGUsIHNob3dpbmcgZm9yIHRoZSByZXN0XHJcbiAgICAgICAgICAgICAgICBzZWN0aW9uLmZpbmQoU0xJREVTX0FSUk9XX05FWFRfU0VMKS50b2dnbGUoIWRlc3RpbnkuaXMoJzpsYXN0LWNoaWxkJykpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL29ubHkgY2hhbmdpbmcgdGhlIFVSTCBpZiB0aGUgc2xpZGVzIGFyZSBpbiB0aGUgY3VycmVudCBzZWN0aW9uIChub3QgZm9yIHJlc2l6ZSByZS1hZGp1c3RpbmcpXHJcbiAgICAgICAgICAgIGlmKHNlY3Rpb24uaGFzQ2xhc3MoQUNUSVZFKSl7XHJcbiAgICAgICAgICAgICAgICBzZXRTdGF0ZShzbGlkZUluZGV4LCBzbGlkZUFuY2hvciwgYW5jaG9yTGluaywgc2VjdGlvbkluZGV4KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGFmdGVyU2xpZGVMb2FkcyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAvL2lmIHRoZSBzaXRlIGlzIG5vdCBqdXN0IHJlc2l6aW5nIGFuZCByZWFkanVzdGluZyB0aGUgc2xpZGVzXHJcbiAgICAgICAgICAgICAgICBpZighbG9jYWxJc1Jlc2l6aW5nKXtcclxuICAgICAgICAgICAgICAgICAgICAkLmlzRnVuY3Rpb24oIG9wdGlvbnMuYWZ0ZXJTbGlkZUxvYWQgKSAmJiBvcHRpb25zLmFmdGVyU2xpZGVMb2FkLmNhbGwoIGRlc3RpbnksIGFuY2hvckxpbmssIChzZWN0aW9uSW5kZXggKyAxKSwgc2xpZGVBbmNob3IsIHNsaWRlSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcGxheU1lZGlhKGRlc3RpbnkpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vbGV0dGluZyB0aGVtIHNsaWRlIGFnYWluXHJcbiAgICAgICAgICAgICAgICBzbGlkZU1vdmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYob3B0aW9ucy5jc3MzKXtcclxuICAgICAgICAgICAgICAgIHZhciB0cmFuc2xhdGUzZCA9ICd0cmFuc2xhdGUzZCgtJyArIE1hdGgucm91bmQoZGVzdGlueVBvcy5sZWZ0KSArICdweCwgMHB4LCAwcHgpJztcclxuXHJcbiAgICAgICAgICAgICAgICBhZGRBbmltYXRpb24oc2xpZGVzLmZpbmQoU0xJREVTX0NPTlRBSU5FUl9TRUwpLCBvcHRpb25zLnNjcm9sbGluZ1NwZWVkPjApLmNzcyhnZXRUcmFuc2Zvcm1zKHRyYW5zbGF0ZTNkKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgYWZ0ZXJTbGlkZUxvYWRzSWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgYWZ0ZXJTbGlkZUxvYWRzKCk7XHJcbiAgICAgICAgICAgICAgICB9LCBvcHRpb25zLnNjcm9sbGluZ1NwZWVkLCBvcHRpb25zLmVhc2luZyk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgc2xpZGVzLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbExlZnQgOiBNYXRoLnJvdW5kKGRlc3RpbnlQb3MubGVmdClcclxuICAgICAgICAgICAgICAgIH0sIG9wdGlvbnMuc2Nyb2xsaW5nU3BlZWQsIG9wdGlvbnMuZWFzaW5nLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYWZ0ZXJTbGlkZUxvYWRzKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2xpZGVzTmF2LmZpbmQoQUNUSVZFX1NFTCkucmVtb3ZlQ2xhc3MoQUNUSVZFKTtcclxuICAgICAgICAgICAgc2xpZGVzTmF2LmZpbmQoJ2xpJykuZXEoc2xpZGVJbmRleCkuZmluZCgnYScpLmFkZENsYXNzKEFDVElWRSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcHJldmlvdXNIZWlnaHQgPSB3aW5kb3dzSGVpZ2h0O1xyXG5cclxuICAgICAgICAvL3doZW4gcmVzaXppbmcgdGhlIHNpdGUsIHdlIGFkanVzdCB0aGUgaGVpZ2h0cyBvZiB0aGUgc2VjdGlvbnMsIHNsaW1TY3JvbGwuLi5cclxuICAgICAgICBmdW5jdGlvbiByZXNpemVIYW5kbGVyKCl7XHJcbiAgICAgICAgICAgIC8vY2hlY2tpbmcgaWYgaXQgbmVlZHMgdG8gZ2V0IHJlc3BvbnNpdmVcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZSgpO1xyXG5cclxuICAgICAgICAgICAgLy8gcmVidWlsZCBpbW1lZGlhdGVseSBvbiB0b3VjaCBkZXZpY2VzXHJcbiAgICAgICAgICAgIGlmIChpc1RvdWNoRGV2aWNlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYWN0aXZlRWxlbWVudCA9ICQoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9pZiB0aGUga2V5Ym9hcmQgaXMgTk9UIHZpc2libGVcclxuICAgICAgICAgICAgICAgIGlmICghYWN0aXZlRWxlbWVudC5pcygndGV4dGFyZWEnKSAmJiAhYWN0aXZlRWxlbWVudC5pcygnaW5wdXQnKSAmJiAhYWN0aXZlRWxlbWVudC5pcygnc2VsZWN0JykpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudEhlaWdodCA9ICR3aW5kb3cuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vbWFraW5nIHN1cmUgdGhlIGNoYW5nZSBpbiB0aGUgdmlld3BvcnQgc2l6ZSBpcyBlbm91Z2ggdG8gZm9yY2UgYSByZWJ1aWxkLiAoMjAgJSBvZiB0aGUgd2luZG93IHRvIGF2b2lkIHByb2JsZW1zIHdoZW4gaGlkZGluZyBzY3JvbGwgYmFycylcclxuICAgICAgICAgICAgICAgICAgICBpZiggTWF0aC5hYnMoY3VycmVudEhlaWdodCAtIHByZXZpb3VzSGVpZ2h0KSA+ICgyMCAqIE1hdGgubWF4KHByZXZpb3VzSGVpZ2h0LCBjdXJyZW50SGVpZ2h0KSAvIDEwMCkgKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRlAucmVCdWlsZCh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNIZWlnaHQgPSBjdXJyZW50SGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAvL2luIG9yZGVyIHRvIGNhbGwgdGhlIGZ1bmN0aW9ucyBvbmx5IHdoZW4gdGhlIHJlc2l6ZSBpcyBmaW5pc2hlZFxyXG4gICAgICAgICAgICAgICAgLy9odHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQyOTg2MTIvanF1ZXJ5LWhvdy10by1jYWxsLXJlc2l6ZS1ldmVudC1vbmx5LW9uY2UtaXRzLWZpbmlzaGVkLXJlc2l6aW5nXHJcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQocmVzaXplSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlc2l6ZUlkID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIEZQLnJlQnVpbGQodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9LCAzNTApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIENoZWNrcyBpZiB0aGUgc2l0ZSBuZWVkcyB0byBnZXQgcmVzcG9uc2l2ZSBhbmQgZGlzYWJsZXMgYXV0b1Njcm9sbGluZyBpZiBzby5cclxuICAgICAgICAqIEEgY2xhc3MgYGZwLXJlc3BvbnNpdmVgIGlzIGFkZGVkIHRvIHRoZSBwbHVnaW4ncyBjb250YWluZXIgaW4gY2FzZSB0aGUgdXNlciB3YW50cyB0byB1c2UgaXQgZm9yIGhpcyBvd24gcmVzcG9uc2l2ZSBDU1MuXHJcbiAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiByZXNwb25zaXZlKCl7XHJcbiAgICAgICAgICAgIHZhciB3aWR0aExpbWl0ID0gb3B0aW9ucy5yZXNwb25zaXZlIHx8IG9wdGlvbnMucmVzcG9uc2l2ZVdpZHRoOyAvL2JhY2t3YXJkcyBjb21wYXRpYmxpdHlcclxuICAgICAgICAgICAgdmFyIGhlaWdodExpbWl0ID0gb3B0aW9ucy5yZXNwb25zaXZlSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgLy9vbmx5IGNhbGN1bGF0aW5nIHdoYXQgd2UgbmVlZC4gUmVtZW1iZXIgaXRzIGNhbGxlZCBvbiB0aGUgcmVzaXplIGV2ZW50LlxyXG4gICAgICAgICAgICB2YXIgaXNCcmVha2luZ1BvaW50V2lkdGggPSB3aWR0aExpbWl0ICYmICR3aW5kb3cub3V0ZXJXaWR0aCgpIDwgd2lkdGhMaW1pdDtcclxuICAgICAgICAgICAgdmFyIGlzQnJlYWtpbmdQb2ludEhlaWdodCA9IGhlaWdodExpbWl0ICYmICR3aW5kb3cuaGVpZ2h0KCkgPCBoZWlnaHRMaW1pdDtcclxuXHJcbiAgICAgICAgICAgIGlmKHdpZHRoTGltaXQgJiYgaGVpZ2h0TGltaXQpe1xyXG4gICAgICAgICAgICAgICAgRlAuc2V0UmVzcG9uc2l2ZShpc0JyZWFraW5nUG9pbnRXaWR0aCB8fCBpc0JyZWFraW5nUG9pbnRIZWlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYod2lkdGhMaW1pdCl7XHJcbiAgICAgICAgICAgICAgICBGUC5zZXRSZXNwb25zaXZlKGlzQnJlYWtpbmdQb2ludFdpZHRoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKGhlaWdodExpbWl0KXtcclxuICAgICAgICAgICAgICAgIEZQLnNldFJlc3BvbnNpdmUoaXNCcmVha2luZ1BvaW50SGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBBZGRzIHRyYW5zaXRpb24gYW5pbWF0aW9ucyBmb3IgdGhlIGdpdmVuIGVsZW1lbnRcclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGFkZEFuaW1hdGlvbihlbGVtZW50KXtcclxuICAgICAgICAgICAgdmFyIHRyYW5zaXRpb24gPSAnYWxsICcgKyBvcHRpb25zLnNjcm9sbGluZ1NwZWVkICsgJ21zICcgKyBvcHRpb25zLmVhc2luZ2NzczM7XHJcblxyXG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKE5PX1RSQU5TSVRJT04pO1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgJy13ZWJraXQtdHJhbnNpdGlvbic6IHRyYW5zaXRpb24sXHJcbiAgICAgICAgICAgICAgICAndHJhbnNpdGlvbic6IHRyYW5zaXRpb25cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIFJlbW92ZSB0cmFuc2l0aW9uIGFuaW1hdGlvbnMgZm9yIHRoZSBnaXZlbiBlbGVtZW50XHJcbiAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiByZW1vdmVBbmltYXRpb24oZWxlbWVudCl7XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50LmFkZENsYXNzKE5PX1RSQU5TSVRJT04pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmVzaXppbmcgb2YgdGhlIGZvbnQgc2l6ZSBkZXBlbmRpbmcgb24gdGhlIHdpbmRvdyBzaXplIGFzIHdlbGwgYXMgc29tZSBvZiB0aGUgaW1hZ2VzIG9uIHRoZSBzaXRlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHJlc2l6ZU1lKGRpc3BsYXlIZWlnaHQsIGRpc3BsYXlXaWR0aCkge1xyXG4gICAgICAgICAgICAvL1N0YW5kYXJkIGRpbWVuc2lvbnMsIGZvciB3aGljaCB0aGUgYm9keSBmb250IHNpemUgaXMgY29ycmVjdFxyXG4gICAgICAgICAgICB2YXIgcHJlZmVycmVkSGVpZ2h0ID0gODI1O1xyXG4gICAgICAgICAgICB2YXIgcHJlZmVycmVkV2lkdGggPSA5MDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoZGlzcGxheUhlaWdodCA8IHByZWZlcnJlZEhlaWdodCB8fCBkaXNwbGF5V2lkdGggPCBwcmVmZXJyZWRXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodFBlcmNlbnRhZ2UgPSAoZGlzcGxheUhlaWdodCAqIDEwMCkgLyBwcmVmZXJyZWRIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgd2lkdGhQZXJjZW50YWdlID0gKGRpc3BsYXlXaWR0aCAqIDEwMCkgLyBwcmVmZXJyZWRXaWR0aDtcclxuICAgICAgICAgICAgICAgIHZhciBwZXJjZW50YWdlID0gTWF0aC5taW4oaGVpZ2h0UGVyY2VudGFnZSwgd2lkdGhQZXJjZW50YWdlKTtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdGb250U2l6ZSA9IHBlcmNlbnRhZ2UudG9GaXhlZCgyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkYm9keS5jc3MoJ2ZvbnQtc2l6ZScsIG5ld0ZvbnRTaXplICsgJyUnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRib2R5LmNzcygnZm9udC1zaXplJywgJzEwMCUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQWN0aXZhdGluZyB0aGUgd2Vic2l0ZSBuYXZpZ2F0aW9uIGRvdHMgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiBzbGlkZSBuYW1lLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlTmF2RG90cyhuYW1lLCBzZWN0aW9uSW5kZXgpe1xyXG4gICAgICAgICAgICBpZihvcHRpb25zLm5hdmlnYXRpb24pe1xyXG4gICAgICAgICAgICAgICAgJChTRUNUSU9OX05BVl9TRUwpLmZpbmQoQUNUSVZFX1NFTCkucmVtb3ZlQ2xhc3MoQUNUSVZFKTtcclxuICAgICAgICAgICAgICAgIGlmKG5hbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICQoU0VDVElPTl9OQVZfU0VMKS5maW5kKCdhW2hyZWY9XCIjJyArIG5hbWUgKyAnXCJdJykuYWRkQ2xhc3MoQUNUSVZFKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICQoU0VDVElPTl9OQVZfU0VMKS5maW5kKCdsaScpLmVxKHNlY3Rpb25JbmRleCkuZmluZCgnYScpLmFkZENsYXNzKEFDVElWRSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFjdGl2YXRpbmcgdGhlIHdlYnNpdGUgbWFpbiBtZW51IGVsZW1lbnRzIGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gc2xpZGUgbmFtZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZU1lbnVFbGVtZW50KG5hbWUpe1xyXG4gICAgICAgICAgICBpZihvcHRpb25zLm1lbnUpe1xyXG4gICAgICAgICAgICAgICAgJChvcHRpb25zLm1lbnUpLmZpbmQoQUNUSVZFX1NFTCkucmVtb3ZlQ2xhc3MoQUNUSVZFKTtcclxuICAgICAgICAgICAgICAgICQob3B0aW9ucy5tZW51KS5maW5kKCdbZGF0YS1tZW51YW5jaG9yPVwiJytuYW1lKydcIl0nKS5hZGRDbGFzcyhBQ1RJVkUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIFNldHMgdG8gYWN0aXZlIHRoZSBjdXJyZW50IG1lbnUgYW5kIHZlcnRpY2FsIG5hdiBpdGVtcy5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlTWVudUFuZE5hdihhbmNob3IsIGluZGV4KXtcclxuICAgICAgICAgICAgYWN0aXZhdGVNZW51RWxlbWVudChhbmNob3IpO1xyXG4gICAgICAgICAgICBhY3RpdmF0ZU5hdkRvdHMoYW5jaG9yLCBpbmRleCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIFJldHVucyBgdXBgIG9yIGBkb3duYCBkZXBlbmRpbmcgb24gdGhlIHNjcm9sbGluZyBtb3ZlbWVudCB0byByZWFjaCBpdHMgZGVzdGluYXRpb25cclxuICAgICAgICAqIGZyb20gdGhlIGN1cnJlbnQgc2VjdGlvbi5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldFltb3ZlbWVudChkZXN0aW55KXtcclxuICAgICAgICAgICAgdmFyIGZyb21JbmRleCA9ICQoU0VDVElPTl9BQ1RJVkVfU0VMKS5pbmRleChTRUNUSU9OX1NFTCk7XHJcbiAgICAgICAgICAgIHZhciB0b0luZGV4ID0gZGVzdGlueS5pbmRleChTRUNUSU9OX1NFTCk7XHJcbiAgICAgICAgICAgIGlmKCBmcm9tSW5kZXggPT0gdG9JbmRleCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ25vbmUnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKGZyb21JbmRleCA+IHRvSW5kZXgpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICd1cCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICdkb3duJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogUmV0dW5zIGByaWdodGAgb3IgYGxlZnRgIGRlcGVuZGluZyBvbiB0aGUgc2Nyb2xsaW5nIG1vdmVtZW50IHRvIHJlYWNoIGl0cyBkZXN0aW5hdGlvblxyXG4gICAgICAgICogZnJvbSB0aGUgY3VycmVudCBzbGlkZS5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldFhtb3ZlbWVudChmcm9tSW5kZXgsIHRvSW5kZXgpe1xyXG4gICAgICAgICAgICBpZiggZnJvbUluZGV4ID09IHRvSW5kZXgpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICdub25lJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihmcm9tSW5kZXggPiB0b0luZGV4KXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnbGVmdCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICdyaWdodCc7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlU2xpbVNjcm9sbGluZyhlbGVtZW50KXtcclxuICAgICAgICAgICAgLy9uZWVkZWQgdG8gbWFrZSBgc2Nyb2xsSGVpZ2h0YCB3b3JrIHVuZGVyIE9wZXJhIDEyXHJcbiAgICAgICAgICAgIGVsZW1lbnQuY3NzKCdvdmVyZmxvdycsICdoaWRkZW4nKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzY3JvbGxPdmVyZmxvd0hhbmRsZXIgPSBvcHRpb25zLnNjcm9sbE92ZXJmbG93SGFuZGxlcjtcclxuICAgICAgICAgICAgdmFyIHdyYXAgPSBzY3JvbGxPdmVyZmxvd0hhbmRsZXIud3JhcENvbnRlbnQoKTtcclxuICAgICAgICAgICAgLy9pbiBjYXNlIGVsZW1lbnQgaXMgYSBzbGlkZVxyXG4gICAgICAgICAgICB2YXIgc2VjdGlvbiA9IGVsZW1lbnQuY2xvc2VzdChTRUNUSU9OX1NFTCk7XHJcbiAgICAgICAgICAgIHZhciBzY3JvbGxhYmxlID0gc2Nyb2xsT3ZlcmZsb3dIYW5kbGVyLnNjcm9sbGFibGUoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIHZhciBjb250ZW50SGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgLy9pZiB0aGVyZSB3YXMgc2Nyb2xsLCB0aGUgY29udGVudEhlaWdodCB3aWxsIGJlIHRoZSBvbmUgaW4gdGhlIHNjcm9sbGFibGUgc2VjdGlvblxyXG4gICAgICAgICAgICBpZihzY3JvbGxhYmxlLmxlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50SGVpZ2h0ID0gc2Nyb2xsT3ZlcmZsb3dIYW5kbGVyLnNjcm9sbEhlaWdodChlbGVtZW50KTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50SGVpZ2h0ID0gZWxlbWVudC5nZXQoMCkuc2Nyb2xsSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9ucy52ZXJ0aWNhbENlbnRlcmVkKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50SGVpZ2h0ID0gZWxlbWVudC5maW5kKFRBQkxFX0NFTExfU0VMKS5nZXQoMCkuc2Nyb2xsSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgc2Nyb2xsSGVpZ2h0ID0gd2luZG93c0hlaWdodCAtIHBhcnNlSW50KHNlY3Rpb24uY3NzKCdwYWRkaW5nLWJvdHRvbScpKSAtIHBhcnNlSW50KHNlY3Rpb24uY3NzKCdwYWRkaW5nLXRvcCcpKTtcclxuXHJcbiAgICAgICAgICAgIC8vbmVlZHMgc2Nyb2xsP1xyXG4gICAgICAgICAgICBpZiAoIGNvbnRlbnRIZWlnaHQgPiBzY3JvbGxIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIC8vd2FzIHRoZXJlIGFscmVhZHkgYW4gc2Nyb2xsID8gVXBkYXRpbmcgaXRcclxuICAgICAgICAgICAgICAgIGlmKHNjcm9sbGFibGUubGVuZ3RoKXtcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxPdmVyZmxvd0hhbmRsZXIudXBkYXRlKGVsZW1lbnQsIHNjcm9sbEhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvL2NyZWF0aW5nIHRoZSBzY3JvbGxpbmdcclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYob3B0aW9ucy52ZXJ0aWNhbENlbnRlcmVkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5maW5kKFRBQkxFX0NFTExfU0VMKS53cmFwSW5uZXIod3JhcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQud3JhcElubmVyKHdyYXApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxPdmVyZmxvd0hhbmRsZXIuY3JlYXRlKGVsZW1lbnQsIHNjcm9sbEhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9yZW1vdmluZyB0aGUgc2Nyb2xsaW5nIHdoZW4gaXQgaXMgbm90IG5lY2Vzc2FyeSBhbnltb3JlXHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxPdmVyZmxvd0hhbmRsZXIucmVtb3ZlKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL3VuZG9cclxuICAgICAgICAgICAgZWxlbWVudC5jc3MoJ292ZXJmbG93JywgJycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkVGFibGVDbGFzcyhlbGVtZW50KXtcclxuICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcyhUQUJMRSkud3JhcElubmVyKCc8ZGl2IGNsYXNzPVwiJyArIFRBQkxFX0NFTEwgKyAnXCIgc3R5bGU9XCJoZWlnaHQ6JyArIGdldFRhYmxlSGVpZ2h0KGVsZW1lbnQpICsgJ3B4O1wiIC8+Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRUYWJsZUhlaWdodChlbGVtZW50KXtcclxuICAgICAgICAgICAgdmFyIHNlY3Rpb25IZWlnaHQgPSB3aW5kb3dzSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgaWYob3B0aW9ucy5wYWRkaW5nVG9wIHx8IG9wdGlvbnMucGFkZGluZ0JvdHRvbSl7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VjdGlvbiA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICBpZighc2VjdGlvbi5oYXNDbGFzcyhTRUNUSU9OKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VjdGlvbiA9IGVsZW1lbnQuY2xvc2VzdChTRUNUSU9OX1NFTCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHBhZGRpbmdzID0gcGFyc2VJbnQoc2VjdGlvbi5jc3MoJ3BhZGRpbmctdG9wJykpICsgcGFyc2VJbnQoc2VjdGlvbi5jc3MoJ3BhZGRpbmctYm90dG9tJykpO1xyXG4gICAgICAgICAgICAgICAgc2VjdGlvbkhlaWdodCA9ICh3aW5kb3dzSGVpZ2h0IC0gcGFkZGluZ3MpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc2VjdGlvbkhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogQWRkcyBhIGNzczMgdHJhbnNmb3JtIHByb3BlcnR5IHRvIHRoZSBjb250YWluZXIgY2xhc3Mgd2l0aCBvciB3aXRob3V0IGFuaW1hdGlvbiBkZXBlbmRpbmcgb24gdGhlIGFuaW1hdGVkIHBhcmFtLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gdHJhbnNmb3JtQ29udGFpbmVyKHRyYW5zbGF0ZTNkLCBhbmltYXRlZCl7XHJcbiAgICAgICAgICAgIGlmKGFuaW1hdGVkKXtcclxuICAgICAgICAgICAgICAgIGFkZEFuaW1hdGlvbihjb250YWluZXIpO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHJlbW92ZUFuaW1hdGlvbihjb250YWluZXIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb250YWluZXIuY3NzKGdldFRyYW5zZm9ybXModHJhbnNsYXRlM2QpKTtcclxuXHJcbiAgICAgICAgICAgIC8vc3luY3Jvbm91c2x5IHJlbW92aW5nIHRoZSBjbGFzcyBhZnRlciB0aGUgYW5pbWF0aW9uIGhhcyBiZWVuIGFwcGxpZWQuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5yZW1vdmVDbGFzcyhOT19UUkFOU0lUSU9OKTtcclxuICAgICAgICAgICAgfSwxMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIEdldHMgYSBzZWN0aW9uIGJ5IGl0cyBhbmNob3IgLyBpbmRleFxyXG4gICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0U2VjdGlvbkJ5QW5jaG9yKHNlY3Rpb25BbmNob3Ipe1xyXG4gICAgICAgICAgICAvL3NlY3Rpb25cclxuICAgICAgICAgICAgdmFyIHNlY3Rpb24gPSBjb250YWluZXIuZmluZChTRUNUSU9OX1NFTCArICdbZGF0YS1hbmNob3I9XCInK3NlY3Rpb25BbmNob3IrJ1wiXScpO1xyXG4gICAgICAgICAgICBpZighc2VjdGlvbi5sZW5ndGgpe1xyXG4gICAgICAgICAgICAgICAgc2VjdGlvbiA9ICQoU0VDVElPTl9TRUwpLmVxKCAoc2VjdGlvbkFuY2hvciAtMSkgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHNlY3Rpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIEdldHMgYSBzbGlkZSBpbnNpZGUgYSBnaXZlbiBzZWN0aW9uIGJ5IGl0cyBhbmNob3IgLyBpbmRleFxyXG4gICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0U2xpZGVCeUFuY2hvcihzbGlkZUFuY2hvciwgc2VjdGlvbil7XHJcbiAgICAgICAgICAgIHZhciBzbGlkZXMgPSBzZWN0aW9uLmZpbmQoU0xJREVTX1dSQVBQRVJfU0VMKTtcclxuICAgICAgICAgICAgdmFyIHNsaWRlID0gIHNsaWRlcy5maW5kKFNMSURFX1NFTCArICdbZGF0YS1hbmNob3I9XCInK3NsaWRlQW5jaG9yKydcIl0nKTtcclxuXHJcbiAgICAgICAgICAgIGlmKCFzbGlkZS5sZW5ndGgpe1xyXG4gICAgICAgICAgICAgICAgc2xpZGUgPSBzbGlkZXMuZmluZChTTElERV9TRUwpLmVxKHNsaWRlQW5jaG9yKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHNsaWRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBTY3JvbGxzIHRvIHRoZSBnaXZlbiBzZWN0aW9uIGFuZCBzbGlkZSBhbmNob3JzXHJcbiAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBzY3JvbGxQYWdlQW5kU2xpZGUoZGVzdGlueSwgc2xpZGUpe1xyXG4gICAgICAgICAgICB2YXIgc2VjdGlvbiA9IGdldFNlY3Rpb25CeUFuY2hvcihkZXN0aW55KTtcclxuXHJcbiAgICAgICAgICAgIC8vZGVmYXVsdCBzbGlkZVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHNsaWRlID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgc2xpZGUgPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL3dlIG5lZWQgdG8gc2Nyb2xsIHRvIHRoZSBzZWN0aW9uIGFuZCB0aGVuIHRvIHRoZSBzbGlkZVxyXG4gICAgICAgICAgICBpZiAoZGVzdGlueSAhPT0gbGFzdFNjcm9sbGVkRGVzdGlueSAmJiAhc2VjdGlvbi5oYXNDbGFzcyhBQ1RJVkUpKXtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFBhZ2Uoc2VjdGlvbiwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxTbGlkZXIoc2VjdGlvbiwgc2xpZGUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9pZiB3ZSB3ZXJlIGFscmVhZHkgaW4gdGhlIHNlY3Rpb25cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFNsaWRlcihzZWN0aW9uLCBzbGlkZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogU2Nyb2xscyB0aGUgc2xpZGVyIHRvIHRoZSBnaXZlbiBzbGlkZSBkZXN0aW5hdGlvbiBmb3IgdGhlIGdpdmVuIHNlY3Rpb25cclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHNjcm9sbFNsaWRlcihzZWN0aW9uLCBzbGlkZUFuY2hvcil7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBzbGlkZUFuY2hvciAhPT0gJ3VuZGVmaW5lZCcpe1xyXG4gICAgICAgICAgICAgICAgdmFyIHNsaWRlcyA9IHNlY3Rpb24uZmluZChTTElERVNfV1JBUFBFUl9TRUwpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlc3RpbnkgPSAgZ2V0U2xpZGVCeUFuY2hvcihzbGlkZUFuY2hvciwgc2VjdGlvbik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoZGVzdGlueS5sZW5ndGgpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxhbmRzY2FwZVNjcm9sbChzbGlkZXMsIGRlc3RpbnkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIENyZWF0ZXMgYSBsYW5kc2NhcGUgbmF2aWdhdGlvbiBiYXIgd2l0aCBkb3RzIGZvciBob3Jpem9udGFsIHNsaWRlcnMuXHJcbiAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBhZGRTbGlkZXNOYXZpZ2F0aW9uKHNlY3Rpb24sIG51bVNsaWRlcyl7XHJcbiAgICAgICAgICAgIHNlY3Rpb24uYXBwZW5kKCc8ZGl2IGNsYXNzPVwiJyArIFNMSURFU19OQVYgKyAnXCI+PHVsPjwvdWw+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAgIHZhciBuYXYgPSBzZWN0aW9uLmZpbmQoU0xJREVTX05BVl9TRUwpO1xyXG5cclxuICAgICAgICAgICAgLy90b3Agb3IgYm90dG9tXHJcbiAgICAgICAgICAgIG5hdi5hZGRDbGFzcyhvcHRpb25zLnNsaWRlc05hdlBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPCBudW1TbGlkZXM7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBuYXYuZmluZCgndWwnKS5hcHBlbmQoJzxsaT48YSBocmVmPVwiI1wiPjxzcGFuPjwvc3Bhbj48L2E+PC9saT4nKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9jZW50ZXJpbmcgaXRcclxuICAgICAgICAgICAgbmF2LmNzcygnbWFyZ2luLWxlZnQnLCAnLScgKyAobmF2LndpZHRoKCkvMikgKyAncHgnKTtcclxuXHJcbiAgICAgICAgICAgIG5hdi5maW5kKCdsaScpLmZpcnN0KCkuZmluZCgnYScpLmFkZENsYXNzKEFDVElWRSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBTZXRzIHRoZSBzdGF0ZSBvZiB0aGUgd2Vic2l0ZSBkZXBlbmRpbmcgb24gdGhlIGFjdGl2ZSBzZWN0aW9uL3NsaWRlLlxyXG4gICAgICAgICogSXQgY2hhbmdlcyB0aGUgVVJMIGhhc2ggd2hlbiBuZWVkZWQgYW5kIHVwZGF0ZXMgdGhlIGJvZHkgY2xhc3MuXHJcbiAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBzZXRTdGF0ZShzbGlkZUluZGV4LCBzbGlkZUFuY2hvciwgYW5jaG9yTGluaywgc2VjdGlvbkluZGV4KXtcclxuICAgICAgICAgICAgdmFyIHNlY3Rpb25IYXNoID0gJyc7XHJcblxyXG4gICAgICAgICAgICBpZihvcHRpb25zLmFuY2hvcnMubGVuZ3RoICYmICFvcHRpb25zLmxvY2tBbmNob3JzKXtcclxuXHJcbiAgICAgICAgICAgICAgICAvL2lzbid0IGl0IHRoZSBmaXJzdCBzbGlkZT9cclxuICAgICAgICAgICAgICAgIGlmKHNsaWRlSW5kZXgpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBhbmNob3JMaW5rICE9PSAndW5kZWZpbmVkJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlY3Rpb25IYXNoID0gYW5jaG9yTGluaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vc2xpZGUgd2l0aG91dCBhbmNob3IgbGluaz8gV2UgdGFrZSB0aGUgaW5kZXggaW5zdGVhZC5cclxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2Ygc2xpZGVBbmNob3IgPT09ICd1bmRlZmluZWQnKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVBbmNob3IgPSBzbGlkZUluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdFNjcm9sbGVkU2xpZGUgPSBzbGlkZUFuY2hvcjtcclxuICAgICAgICAgICAgICAgICAgICBzZXRVcmxIYXNoKHNlY3Rpb25IYXNoICsgJy8nICsgc2xpZGVBbmNob3IpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vZmlyc3Qgc2xpZGUgd29uJ3QgaGF2ZSBzbGlkZSBhbmNob3IsIGp1c3QgdGhlIHNlY3Rpb24gb25lXHJcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZih0eXBlb2Ygc2xpZGVJbmRleCAhPT0gJ3VuZGVmaW5lZCcpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RTY3JvbGxlZFNsaWRlID0gc2xpZGVBbmNob3I7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VXJsSGFzaChhbmNob3JMaW5rKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvL3NlY3Rpb24gd2l0aG91dCBzbGlkZXNcclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VXJsSGFzaChhbmNob3JMaW5rKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2V0Qm9keUNsYXNzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIFNldHMgdGhlIFVSTCBoYXNoLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0VXJsSGFzaCh1cmwpe1xyXG4gICAgICAgICAgICBpZihvcHRpb25zLnJlY29yZEhpc3Rvcnkpe1xyXG4gICAgICAgICAgICAgICAgbG9jYXRpb24uaGFzaCA9IHVybDtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAvL01vYmlsZSBDaHJvbWUgZG9lc24ndCB3b3JrIHRoZSBub3JtYWwgd2F5LCBzby4uLiBsZXRzIHVzZSBIVE1MNSBmb3IgcGhvbmVzIDopXHJcbiAgICAgICAgICAgICAgICBpZihpc1RvdWNoRGV2aWNlIHx8IGlzVG91Y2gpe1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgJyMnICsgdXJsKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBiYXNlVXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVswXTtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSggYmFzZVVybCArICcjJyArIHVybCApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIEdldHMgdGhlIGFuY2hvciBmb3IgdGhlIGdpdmVuIHNsaWRlIC8gc2VjdGlvbi4gSXRzIGluZGV4IHdpbGwgYmUgdXNlZCBpZiB0aGVyZSdzIG5vbmUuXHJcbiAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXRBbmNob3IoZWxlbWVudCl7XHJcbiAgICAgICAgICAgIHZhciBhbmNob3IgPSBlbGVtZW50LmRhdGEoJ2FuY2hvcicpO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBlbGVtZW50LmluZGV4KCk7XHJcblxyXG4gICAgICAgICAgICAvL1NsaWRlIHdpdGhvdXQgYW5jaG9yIGxpbms/IFdlIHRha2UgdGhlIGluZGV4IGluc3RlYWQuXHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBhbmNob3IgPT09ICd1bmRlZmluZWQnKXtcclxuICAgICAgICAgICAgICAgIGFuY2hvciA9IGluZGV4O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYW5jaG9yO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBTZXRzIGEgY2xhc3MgZm9yIHRoZSBib2R5IG9mIHRoZSBwYWdlIGRlcGVuZGluZyBvbiB0aGUgYWN0aXZlIHNlY3Rpb24gLyBzbGlkZVxyXG4gICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0Qm9keUNsYXNzKCl7XHJcbiAgICAgICAgICAgIHZhciBzZWN0aW9uID0gJChTRUNUSU9OX0FDVElWRV9TRUwpO1xyXG4gICAgICAgICAgICB2YXIgc2xpZGUgPSBzZWN0aW9uLmZpbmQoU0xJREVfQUNUSVZFX1NFTCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2VjdGlvbkFuY2hvciA9IGdldEFuY2hvcihzZWN0aW9uKTtcclxuICAgICAgICAgICAgdmFyIHNsaWRlQW5jaG9yID0gZ2V0QW5jaG9yKHNsaWRlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWN0aW9uSW5kZXggPSBzZWN0aW9uLmluZGV4KFNFQ1RJT05fU0VMKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0ZXh0ID0gU3RyaW5nKHNlY3Rpb25BbmNob3IpO1xyXG5cclxuICAgICAgICAgICAgaWYoc2xpZGUubGVuZ3RoKXtcclxuICAgICAgICAgICAgICAgIHRleHQgPSB0ZXh0ICsgJy0nICsgc2xpZGVBbmNob3I7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vY2hhbmdpbmcgc2xhc2ggZm9yIGRhc2ggdG8gbWFrZSBpdCBhIHZhbGlkIENTUyBzdHlsZVxyXG4gICAgICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKCcvJywgJy0nKS5yZXBsYWNlKCcjJywnJyk7XHJcblxyXG4gICAgICAgICAgICAvL3JlbW92aW5nIHByZXZpb3VzIGFuY2hvciBjbGFzc2VzXHJcbiAgICAgICAgICAgIHZhciBjbGFzc1JlID0gbmV3IFJlZ0V4cCgnXFxcXGJcXFxccz8nICsgVklFV0lOR19QUkVGSVggKyAnLVteXFxcXHNdK1xcXFxiJywgXCJnXCIpO1xyXG4gICAgICAgICAgICAkYm9keVswXS5jbGFzc05hbWUgPSAkYm9keVswXS5jbGFzc05hbWUucmVwbGFjZShjbGFzc1JlLCAnJyk7XHJcblxyXG4gICAgICAgICAgICAvL2FkZGluZyB0aGUgY3VycmVudCBhbmNob3JcclxuICAgICAgICAgICAgJGJvZHkuYWRkQ2xhc3MoVklFV0lOR19QUkVGSVggKyAnLScgKyB0ZXh0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogQ2hlY2tzIGZvciB0cmFuc2xhdGUzZCBzdXBwb3J0XHJcbiAgICAgICAgKiBAcmV0dXJuIGJvb2xlYW5cclxuICAgICAgICAqIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTY2MTY3MS9kZXRlY3RpbmctdHJhbnNmb3JtLXRyYW5zbGF0ZTNkLXN1cHBvcnRcclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHN1cHBvcnQzZCgpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpLFxyXG4gICAgICAgICAgICAgICAgaGFzM2QsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICd3ZWJraXRUcmFuc2Zvcm0nOictd2Via2l0LXRyYW5zZm9ybScsXHJcbiAgICAgICAgICAgICAgICAgICAgJ09UcmFuc2Zvcm0nOictby10cmFuc2Zvcm0nLFxyXG4gICAgICAgICAgICAgICAgICAgICdtc1RyYW5zZm9ybSc6Jy1tcy10cmFuc2Zvcm0nLFxyXG4gICAgICAgICAgICAgICAgICAgICdNb3pUcmFuc2Zvcm0nOictbW96LXRyYW5zZm9ybScsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3RyYW5zZm9ybSc6J3RyYW5zZm9ybSdcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgaXQgdG8gdGhlIGJvZHkgdG8gZ2V0IHRoZSBjb21wdXRlZCBzdHlsZS5cclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUoZWwsIG51bGwpO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgdCBpbiB0cmFuc2Zvcm1zKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZWwuc3R5bGVbdF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlW3RdID0gJ3RyYW5zbGF0ZTNkKDFweCwxcHgsMXB4KSc7XHJcbiAgICAgICAgICAgICAgICAgICAgaGFzM2QgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZ2V0UHJvcGVydHlWYWx1ZSh0cmFuc2Zvcm1zW3RdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChlbCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gKGhhczNkICE9PSB1bmRlZmluZWQgJiYgaGFzM2QubGVuZ3RoID4gMCAmJiBoYXMzZCAhPT0gJ25vbmUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogUmVtb3ZlcyB0aGUgYXV0byBzY3JvbGxpbmcgYWN0aW9uIGZpcmVkIGJ5IHRoZSBtb3VzZSB3aGVlbCBhbmQgdHJhY2twYWQuXHJcbiAgICAgICAgKiBBZnRlciB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCwgdGhlIG1vdXNld2hlZWwgYW5kIHRyYWNrcGFkIG1vdmVtZW50cyB3b24ndCBzY3JvbGwgdGhyb3VnaCBzZWN0aW9ucy5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZU1vdXNlV2hlZWxIYW5kbGVyKCl7XHJcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXdoZWVsJywgTW91c2VXaGVlbEhhbmRsZXIsIGZhbHNlKTsgLy9JRTksIENocm9tZSwgU2FmYXJpLCBPcGVyXHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd3aGVlbCcsIE1vdXNlV2hlZWxIYW5kbGVyLCBmYWxzZSk7IC8vRmlyZWZveFxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignTW96TW91c2VQaXhlbFNjcm9sbCcsIE1vdXNlV2hlZWxIYW5kbGVyLCBmYWxzZSk7IC8vb2xkIEZpcmVmb3hcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRldGFjaEV2ZW50KCdvbm1vdXNld2hlZWwnLCBNb3VzZVdoZWVsSGFuZGxlcik7IC8vSUUgNi83LzhcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBBZGRzIHRoZSBhdXRvIHNjcm9sbGluZyBhY3Rpb24gZm9yIHRoZSBtb3VzZSB3aGVlbCBhbmQgdHJhY2twYWQuXHJcbiAgICAgICAgKiBBZnRlciB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCwgdGhlIG1vdXNld2hlZWwgYW5kIHRyYWNrcGFkIG1vdmVtZW50cyB3aWxsIHNjcm9sbCB0aHJvdWdoIHNlY3Rpb25zXHJcbiAgICAgICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9FdmVudHMvd2hlZWxcclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGFkZE1vdXNlV2hlZWxIYW5kbGVyKCl7XHJcbiAgICAgICAgICAgIHZhciBwcmVmaXggPSAnJztcclxuICAgICAgICAgICAgdmFyIF9hZGRFdmVudExpc3RlbmVyO1xyXG5cclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKXtcclxuICAgICAgICAgICAgICAgIF9hZGRFdmVudExpc3RlbmVyID0gXCJhZGRFdmVudExpc3RlbmVyXCI7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgX2FkZEV2ZW50TGlzdGVuZXIgPSBcImF0dGFjaEV2ZW50XCI7XHJcbiAgICAgICAgICAgICAgICBwcmVmaXggPSAnb24nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgLy8gZGV0ZWN0IGF2YWlsYWJsZSB3aGVlbCBldmVudFxyXG4gICAgICAgICAgICB2YXIgc3VwcG9ydCA9ICdvbndoZWVsJyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSA/ICd3aGVlbCcgOiAvLyBNb2Rlcm4gYnJvd3NlcnMgc3VwcG9ydCBcIndoZWVsXCJcclxuICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50Lm9ubW91c2V3aGVlbCAhPT0gdW5kZWZpbmVkID8gJ21vdXNld2hlZWwnIDogLy8gV2Via2l0IGFuZCBJRSBzdXBwb3J0IGF0IGxlYXN0IFwibW91c2V3aGVlbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAnRE9NTW91c2VTY3JvbGwnOyAvLyBsZXQncyBhc3N1bWUgdGhhdCByZW1haW5pbmcgYnJvd3NlcnMgYXJlIG9sZGVyIEZpcmVmb3hcclxuXHJcblxyXG4gICAgICAgICAgICBpZihzdXBwb3J0ID09ICdET01Nb3VzZVNjcm9sbCcpe1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRbIF9hZGRFdmVudExpc3RlbmVyIF0ocHJlZml4ICsgJ01vek1vdXNlUGl4ZWxTY3JvbGwnLCBNb3VzZVdoZWVsSGFuZGxlciwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2hhbmRsZSBNb3pNb3VzZVBpeGVsU2Nyb2xsIGluIG9sZGVyIEZpcmVmb3hcclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50WyBfYWRkRXZlbnRMaXN0ZW5lciBdKHByZWZpeCArIHN1cHBvcnQsIE1vdXNlV2hlZWxIYW5kbGVyLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogQmluZGluZyB0aGUgbW91c2Vtb3ZlIHdoZW4gdGhlIG1vdXNlJ3MgbWlkZGxlIGJ1dHRvbiBpcyBwcmVzc2VkXHJcbiAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBhZGRNaWRkbGVXaGVlbEhhbmRsZXIoKXtcclxuICAgICAgICAgICAgY29udGFpbmVyXHJcbiAgICAgICAgICAgICAgICAub24oJ21vdXNlZG93bicsIG1vdXNlRG93bkhhbmRsZXIpXHJcbiAgICAgICAgICAgICAgICAub24oJ21vdXNldXAnLCBtb3VzZVVwSGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIFVuYmluZGluZyB0aGUgbW91c2Vtb3ZlIHdoZW4gdGhlIG1vdXNlJ3MgbWlkZGxlIGJ1dHRvbiBpcyByZWxlYXNlZFxyXG4gICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlTWlkZGxlV2hlZWxIYW5kbGVyKCl7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lclxyXG4gICAgICAgICAgICAgICAgLm9mZignbW91c2Vkb3duJywgbW91c2VEb3duSGFuZGxlcilcclxuICAgICAgICAgICAgICAgIC5vZmYoJ21vdXNldXAnLCBtb3VzZVVwSGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIEFkZHMgdGhlIHBvc3NpYmlsaXR5IHRvIGF1dG8gc2Nyb2xsIHRocm91Z2ggc2VjdGlvbnMgb24gdG91Y2ggZGV2aWNlcy5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGFkZFRvdWNoSGFuZGxlcigpe1xyXG4gICAgICAgICAgICBpZihpc1RvdWNoRGV2aWNlIHx8IGlzVG91Y2gpe1xyXG4gICAgICAgICAgICAgICAgLy9NaWNyb3NvZnQgcG9pbnRlcnNcclxuICAgICAgICAgICAgICAgIHZhciBNU1BvaW50ZXIgPSBnZXRNU1BvaW50ZXIoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKFdSQVBQRVJfU0VMKS5vZmYoJ3RvdWNoc3RhcnQgJyArICBNU1BvaW50ZXIuZG93bikub24oJ3RvdWNoc3RhcnQgJyArIE1TUG9pbnRlci5kb3duLCB0b3VjaFN0YXJ0SGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICAkKFdSQVBQRVJfU0VMKS5vZmYoJ3RvdWNobW92ZSAnICsgTVNQb2ludGVyLm1vdmUpLm9uKCd0b3VjaG1vdmUgJyArIE1TUG9pbnRlci5tb3ZlLCB0b3VjaE1vdmVIYW5kbGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBSZW1vdmVzIHRoZSBhdXRvIHNjcm9sbGluZyBmb3IgdG91Y2ggZGV2aWNlcy5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZVRvdWNoSGFuZGxlcigpe1xyXG4gICAgICAgICAgICBpZihpc1RvdWNoRGV2aWNlIHx8IGlzVG91Y2gpe1xyXG4gICAgICAgICAgICAgICAgLy9NaWNyb3NvZnQgcG9pbnRlcnNcclxuICAgICAgICAgICAgICAgIHZhciBNU1BvaW50ZXIgPSBnZXRNU1BvaW50ZXIoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKFdSQVBQRVJfU0VMKS5vZmYoJ3RvdWNoc3RhcnQgJyArIE1TUG9pbnRlci5kb3duKTtcclxuICAgICAgICAgICAgICAgICQoV1JBUFBFUl9TRUwpLm9mZigndG91Y2htb3ZlICcgKyBNU1BvaW50ZXIubW92ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgKiBSZXR1cm5zIGFuZCBvYmplY3Qgd2l0aCBNaWNyb3NvZnQgcG9pbnRlcnMgKGZvciBJRTwxMSBhbmQgZm9yIElFID49IDExKVxyXG4gICAgICAgICogaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2RuMzA0ODg2KHY9dnMuODUpLmFzcHhcclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldE1TUG9pbnRlcigpe1xyXG4gICAgICAgICAgICB2YXIgcG9pbnRlcjtcclxuXHJcbiAgICAgICAgICAgIC8vSUUgPj0gMTEgJiByZXN0IG9mIGJyb3dzZXJzXHJcbiAgICAgICAgICAgIGlmKHdpbmRvdy5Qb2ludGVyRXZlbnQpe1xyXG4gICAgICAgICAgICAgICAgcG9pbnRlciA9IHsgZG93bjogJ3BvaW50ZXJkb3duJywgbW92ZTogJ3BvaW50ZXJtb3ZlJ307XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vSUUgPCAxMVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgcG9pbnRlciA9IHsgZG93bjogJ01TUG9pbnRlckRvd24nLCBtb3ZlOiAnTVNQb2ludGVyTW92ZSd9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcG9pbnRlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogR2V0cyB0aGUgcGFnZVggYW5kIHBhZ2VZIHByb3BlcnRpZXMgZGVwZW5kaW5nIG9uIHRoZSBicm93c2VyLlxyXG4gICAgICAgICogaHR0cHM6Ly9naXRodWIuY29tL2FsdmFyb3RyaWdvL2Z1bGxQYWdlLmpzL2lzc3Vlcy8xOTQjaXNzdWVjb21tZW50LTM0MDY5ODU0XHJcbiAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXRFdmVudHNQYWdlKGUpe1xyXG4gICAgICAgICAgICB2YXIgZXZlbnRzID0gW107XHJcblxyXG4gICAgICAgICAgICBldmVudHMueSA9ICh0eXBlb2YgZS5wYWdlWSAhPT0gJ3VuZGVmaW5lZCcgJiYgKGUucGFnZVkgfHwgZS5wYWdlWCkgPyBlLnBhZ2VZIDogZS50b3VjaGVzWzBdLnBhZ2VZKTtcclxuICAgICAgICAgICAgZXZlbnRzLnggPSAodHlwZW9mIGUucGFnZVggIT09ICd1bmRlZmluZWQnICYmIChlLnBhZ2VZIHx8IGUucGFnZVgpID8gZS5wYWdlWCA6IGUudG91Y2hlc1swXS5wYWdlWCk7XHJcblxyXG4gICAgICAgICAgICAvL2luIHRvdWNoIGRldmljZXMgd2l0aCBzY3JvbGxCYXI6dHJ1ZSwgZS5wYWdlWSBpcyBkZXRlY3RlZCwgYnV0IHdlIGhhdmUgdG8gZGVhbCB3aXRoIHRvdWNoIGV2ZW50cy4gIzEwMDhcclxuICAgICAgICAgICAgaWYoaXNUb3VjaCAmJiBpc1JlYWxseVRvdWNoKGUpICYmIG9wdGlvbnMuc2Nyb2xsQmFyKXtcclxuICAgICAgICAgICAgICAgIGV2ZW50cy55ID0gZS50b3VjaGVzWzBdLnBhZ2VZO1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzLnggPSBlLnRvdWNoZXNbMF0ucGFnZVg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBldmVudHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIFNsaWRlcyBzaWxlbnRseSAod2l0aCBubyBhbmltYXRpb24pIHRoZSBhY3RpdmUgc2xpZGVyIHRvIHRoZSBnaXZlbiBzbGlkZS5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHNpbGVudExhbmRzY2FwZVNjcm9sbChhY3RpdmVTbGlkZSwgbm9DYWxsYmFja3Mpe1xyXG4gICAgICAgICAgICBGUC5zZXRTY3JvbGxpbmdTcGVlZCAoMCwgJ2ludGVybmFsJyk7XHJcblxyXG4gICAgICAgICAgICBpZih0eXBlb2Ygbm9DYWxsYmFja3MgIT09ICd1bmRlZmluZWQnKXtcclxuICAgICAgICAgICAgICAgIC8vcHJldmVudGluZyBmaXJpbmcgY2FsbGJhY2tzIGFmdGVyU2xpZGVMb2FkIGV0Yy5cclxuICAgICAgICAgICAgICAgIGlzUmVzaXppbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsYW5kc2NhcGVTY3JvbGwoYWN0aXZlU2xpZGUuY2xvc2VzdChTTElERVNfV1JBUFBFUl9TRUwpLCBhY3RpdmVTbGlkZSk7XHJcblxyXG4gICAgICAgICAgICBpZih0eXBlb2Ygbm9DYWxsYmFja3MgIT09ICd1bmRlZmluZWQnKXtcclxuICAgICAgICAgICAgICAgIGlzUmVzaXppbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgRlAuc2V0U2Nyb2xsaW5nU3BlZWQob3JpZ2luYWxzLnNjcm9sbGluZ1NwZWVkLCAnaW50ZXJuYWwnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogU2Nyb2xscyBzaWxlbnRseSAod2l0aCBubyBhbmltYXRpb24pIHRoZSBwYWdlIHRvIHRoZSBnaXZlbiBZIHBvc2l0aW9uLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gc2lsZW50U2Nyb2xsKHRvcCl7XHJcbiAgICAgICAgICAgIGlmKG9wdGlvbnMuc2Nyb2xsQmFyKXtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5zY3JvbGxUb3AodG9wKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChvcHRpb25zLmNzczMpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0cmFuc2xhdGUzZCA9ICd0cmFuc2xhdGUzZCgwcHgsIC0nICsgdG9wICsgJ3B4LCAwcHgpJztcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybUNvbnRhaW5lcih0cmFuc2xhdGUzZCwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmNzcygndG9wJywgLXRvcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogUmV0dXJucyB0aGUgY3Jvc3MtYnJvd3NlciB0cmFuc2Zvcm0gc3RyaW5nLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0VHJhbnNmb3Jtcyh0cmFuc2xhdGUzZCl7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAnLXdlYmtpdC10cmFuc2Zvcm0nOiB0cmFuc2xhdGUzZCxcclxuICAgICAgICAgICAgICAgICctbW96LXRyYW5zZm9ybSc6IHRyYW5zbGF0ZTNkLFxyXG4gICAgICAgICAgICAgICAgJy1tcy10cmFuc2Zvcm0nOnRyYW5zbGF0ZTNkLFxyXG4gICAgICAgICAgICAgICAgJ3RyYW5zZm9ybSc6IHRyYW5zbGF0ZTNkXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIEFsbG93aW5nIG9yIGRpc2FsbG93aW5nIHRoZSBtb3VzZS9zd2lwZSBzY3JvbGwgaW4gYSBnaXZlbiBkaXJlY3Rpb24uIChub3QgZm9yIGtleWJvYXJkKVxyXG4gICAgICAgICogQHR5cGUgIG0gKG1vdXNlKSBvciBrIChrZXlib2FyZClcclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHNldElzU2Nyb2xsQWxsb3dlZCh2YWx1ZSwgZGlyZWN0aW9uLCB0eXBlKXtcclxuICAgICAgICAgICAgc3dpdGNoIChkaXJlY3Rpb24pe1xyXG4gICAgICAgICAgICAgICAgY2FzZSAndXAnOiBpc1Njcm9sbEFsbG93ZWRbdHlwZV0udXAgPSB2YWx1ZTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdkb3duJzogaXNTY3JvbGxBbGxvd2VkW3R5cGVdLmRvd24gPSB2YWx1ZTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdsZWZ0JzogaXNTY3JvbGxBbGxvd2VkW3R5cGVdLmxlZnQgPSB2YWx1ZTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdyaWdodCc6IGlzU2Nyb2xsQWxsb3dlZFt0eXBlXS5yaWdodCA9IHZhbHVlOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2FsbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZSA9PSAnbScpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBGUC5zZXRBbGxvd1Njcm9sbGluZyh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEZQLnNldEtleWJvYXJkU2Nyb2xsaW5nKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgKiBEZXN0cm95cyBmdWxscGFnZS5qcyBwbHVnaW4gZXZlbnRzIGFuZCBvcHRpbmFsbHkgaXRzIGh0bWwgbWFya3VwIGFuZCBzdHlsZXNcclxuICAgICAgICAqL1xyXG4gICAgICAgIEZQLmRlc3Ryb3kgPSBmdW5jdGlvbihhbGwpe1xyXG4gICAgICAgICAgICBGUC5zZXRBdXRvU2Nyb2xsaW5nKGZhbHNlLCAnaW50ZXJuYWwnKTtcclxuICAgICAgICAgICAgRlAuc2V0QWxsb3dTY3JvbGxpbmcoZmFsc2UpO1xyXG4gICAgICAgICAgICBGUC5zZXRLZXlib2FyZFNjcm9sbGluZyhmYWxzZSk7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyhERVNUUk9ZRUQpO1xyXG5cclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGFmdGVyU2xpZGVMb2Fkc0lkKTtcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGFmdGVyU2VjdGlvbkxvYWRzSWQpO1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQocmVzaXplSWQpO1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoc2Nyb2xsSWQpO1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoc2Nyb2xsSWQyKTtcclxuXHJcbiAgICAgICAgICAgICR3aW5kb3dcclxuICAgICAgICAgICAgICAgIC5vZmYoJ3Njcm9sbCcsIHNjcm9sbEhhbmRsZXIpXHJcbiAgICAgICAgICAgICAgICAub2ZmKCdoYXNoY2hhbmdlJywgaGFzaENoYW5nZUhhbmRsZXIpXHJcbiAgICAgICAgICAgICAgICAub2ZmKCdyZXNpemUnLCByZXNpemVIYW5kbGVyKTtcclxuXHJcbiAgICAgICAgICAgICRkb2N1bWVudFxyXG4gICAgICAgICAgICAgICAgLm9mZignY2xpY2snLCBTRUNUSU9OX05BVl9TRUwgKyAnIGEnKVxyXG4gICAgICAgICAgICAgICAgLm9mZignbW91c2VlbnRlcicsIFNFQ1RJT05fTkFWX1NFTCArICcgbGknKVxyXG4gICAgICAgICAgICAgICAgLm9mZignbW91c2VsZWF2ZScsIFNFQ1RJT05fTkFWX1NFTCArICcgbGknKVxyXG4gICAgICAgICAgICAgICAgLm9mZignY2xpY2snLCBTTElERVNfTkFWX0xJTktfU0VMKVxyXG4gICAgICAgICAgICAgICAgLm9mZignbW91c2VvdmVyJywgb3B0aW9ucy5ub3JtYWxTY3JvbGxFbGVtZW50cylcclxuICAgICAgICAgICAgICAgIC5vZmYoJ21vdXNlb3V0Jywgb3B0aW9ucy5ub3JtYWxTY3JvbGxFbGVtZW50cyk7XHJcblxyXG4gICAgICAgICAgICAkKFNFQ1RJT05fU0VMKVxyXG4gICAgICAgICAgICAgICAgLm9mZignY2xpY2snLCBTTElERVNfQVJST1dfU0VMKTtcclxuXHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChhZnRlclNsaWRlTG9hZHNJZCk7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChhZnRlclNlY3Rpb25Mb2Fkc0lkKTtcclxuXHJcbiAgICAgICAgICAgIC8vbGV0cyBtYWtlIGEgbWVzcyFcclxuICAgICAgICAgICAgaWYoYWxsKXtcclxuICAgICAgICAgICAgICAgIGRlc3Ryb3lTdHJ1Y3R1cmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgKiBSZW1vdmVzIGlubGluZSBzdHlsZXMgYWRkZWQgYnkgZnVsbHBhZ2UuanNcclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3lTdHJ1Y3R1cmUoKXtcclxuICAgICAgICAgICAgLy9yZXNldGluZyB0aGUgYHRvcGAgb3IgYHRyYW5zbGF0ZWAgcHJvcGVydGllcyB0byAwXHJcbiAgICAgICAgICAgIHNpbGVudFNjcm9sbCgwKTtcclxuXHJcbiAgICAgICAgICAgICQoU0VDVElPTl9OQVZfU0VMICsgJywgJyArIFNMSURFU19OQVZfU0VMICsgICcsICcgKyBTTElERVNfQVJST1dfU0VMKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICAgIC8vcmVtb3ZpbmcgaW5saW5lIHN0eWxlc1xyXG4gICAgICAgICAgICAkKFNFQ1RJT05fU0VMKS5jc3MoIHtcclxuICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnJyxcclxuICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJyA6ICcnLFxyXG4gICAgICAgICAgICAgICAgJ3BhZGRpbmcnOiAnJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICQoU0xJREVfU0VMKS5jc3MoIHtcclxuICAgICAgICAgICAgICAgICd3aWR0aCc6ICcnXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29udGFpbmVyLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJycsXHJcbiAgICAgICAgICAgICAgICAncG9zaXRpb24nOiAnJyxcclxuICAgICAgICAgICAgICAgICctbXMtdG91Y2gtYWN0aW9uJzogJycsXHJcbiAgICAgICAgICAgICAgICAndG91Y2gtYWN0aW9uJzogJydcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkaHRtbEJvZHkuY3NzKHtcclxuICAgICAgICAgICAgICAgICdvdmVyZmxvdyc6ICcnLFxyXG4gICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcnXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gcmVtb3ZlIC5mcC1lbmFibGVkIGNsYXNzXHJcbiAgICAgICAgICAgICQoJ2h0bWwnKS5yZW1vdmVDbGFzcyhFTkFCTEVEKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHJlbW92ZSBhbGwgb2YgdGhlIC5mcC12aWV3aW5nLSBjbGFzc2VzXHJcbiAgICAgICAgICAgICQuZWFjaCgkYm9keS5nZXQoMCkuY2xhc3NOYW1lLnNwbGl0KC9cXHMrLyksIGZ1bmN0aW9uIChpbmRleCwgY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2xhc3NOYW1lLmluZGV4T2YoVklFV0lOR19QUkVGSVgpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGJvZHkucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvL3JlbW92aW5nIGFkZGVkIGNsYXNzZXNcclxuICAgICAgICAgICAgJChTRUNUSU9OX1NFTCArICcsICcgKyBTTElERV9TRUwpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMuc2Nyb2xsT3ZlcmZsb3dIYW5kbGVyLnJlbW92ZSgkKHRoaXMpKTtcclxuICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoVEFCTEUgKyAnICcgKyBBQ1RJVkUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlbW92ZUFuaW1hdGlvbihjb250YWluZXIpO1xyXG5cclxuICAgICAgICAgICAgLy9VbndyYXBwaW5nIGNvbnRlbnRcclxuICAgICAgICAgICAgY29udGFpbmVyLmZpbmQoVEFCTEVfQ0VMTF9TRUwgKyAnLCAnICsgU0xJREVTX0NPTlRBSU5FUl9TRUwgKyAnLCAnICsgU0xJREVTX1dSQVBQRVJfU0VMKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAvL3Vud3JhcCBub3QgYmVpbmcgdXNlIGluIGNhc2UgdGhlcmUncyBubyBjaGlsZCBlbGVtZW50IGluc2lkZSBhbmQgaXRzIGp1c3QgdGV4dFxyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5yZXBsYWNlV2l0aCh0aGlzLmNoaWxkTm9kZXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vc2Nyb2xsaW5nIHRoZSBwYWdlIHRvIHRoZSB0b3Agd2l0aCBubyBhbmltYXRpb25cclxuICAgICAgICAgICAgJGh0bWxCb2R5LnNjcm9sbFRvcCgwKTtcclxuXHJcbiAgICAgICAgICAgIC8vcmVtb3Zpbmcgc2VsZWN0b3JzXHJcbiAgICAgICAgICAgIHZhciB1c2VkU2VsZWN0b3JzID0gW1NFQ1RJT04sIFNMSURFLCBTTElERVNfQ09OVEFJTkVSXTtcclxuICAgICAgICAgICAgJC5lYWNoKHVzZWRTZWxlY3RvcnMsIGZ1bmN0aW9uKGluZGV4LCB2YWx1ZSl7XHJcbiAgICAgICAgICAgICAgICAkKCcuJyArIHZhbHVlKS5yZW1vdmVDbGFzcyh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAqIFNldHMgdGhlIHN0YXRlIGZvciBhIHZhcmlhYmxlIHdpdGggbXVsdGlwbGUgc3RhdGVzIChvcmlnaW5hbCwgYW5kIHRlbXBvcmFsKVxyXG4gICAgICAgICogU29tZSB2YXJpYWJsZXMgc3VjaCBhcyBgYXV0b1Njcm9sbGluZ2Agb3IgYHJlY29yZEhpc3RvcnlgIG1pZ2h0IGNoYW5nZSBhdXRvbWF0aWNhbGx5IGl0cyBzdGF0ZSB3aGVuIHVzaW5nIGByZXNwb25zaXZlYCBvciBgYXV0b1Njcm9sbGluZzpmYWxzZWAuXHJcbiAgICAgICAgKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8ga2VlcCB0cmFjayBvZiBib3RoIHN0YXRlcywgdGhlIG9yaWdpbmFsIGFuZCB0aGUgdGVtcG9yYWwgb25lLlxyXG4gICAgICAgICogSWYgdHlwZSBpcyBub3QgJ2ludGVybmFsJywgdGhlbiB3ZSBhc3N1bWUgdGhlIHVzZXIgaXMgZ2xvYmFsbHkgY2hhbmdpbmcgdGhlIHZhcmlhYmxlLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0VmFyaWFibGVTdGF0ZSh2YXJpYWJsZSwgdmFsdWUsIHR5cGUpe1xyXG4gICAgICAgICAgICBvcHRpb25zW3ZhcmlhYmxlXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBpZih0eXBlICE9PSAnaW50ZXJuYWwnKXtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsc1t2YXJpYWJsZV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBEaXNwbGF5cyB3YXJuaW5nc1xyXG4gICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZGlzcGxheVdhcm5pbmdzKCl7XHJcbiAgICAgICAgICAgIGlmKCQoJ2h0bWwnKS5oYXNDbGFzcyhFTkFCTEVEKSl7XHJcbiAgICAgICAgICAgICAgICBzaG93RXJyb3IoJ2Vycm9yJywgJ0Z1bGxwYWdlLmpzIGNhbiBvbmx5IGJlIGluaXRpYWxpemVkIG9uY2UgYW5kIHlvdSBhcmUgZG9pbmcgaXQgbXVsdGlwbGUgdGltZXMhJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIERpc2FibGUgbXV0dWFsbHkgZXhjbHVzaXZlIHNldHRpbmdzXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmNvbnRpbnVvdXNWZXJ0aWNhbCAmJlxyXG4gICAgICAgICAgICAgICAgKG9wdGlvbnMubG9vcFRvcCB8fCBvcHRpb25zLmxvb3BCb3R0b20pKSB7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLmNvbnRpbnVvdXNWZXJ0aWNhbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgc2hvd0Vycm9yKCd3YXJuJywgJ09wdGlvbiBgbG9vcFRvcC9sb29wQm90dG9tYCBpcyBtdXR1YWxseSBleGNsdXNpdmUgd2l0aCBgY29udGludW91c1ZlcnRpY2FsYDsgYGNvbnRpbnVvdXNWZXJ0aWNhbGAgZGlzYWJsZWQnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYob3B0aW9ucy5zY3JvbGxCYXIgJiYgb3B0aW9ucy5zY3JvbGxPdmVyZmxvdyl7XHJcbiAgICAgICAgICAgICAgICBzaG93RXJyb3IoJ3dhcm4nLCAnT3B0aW9uIGBzY3JvbGxCYXJgIGlzIG11dHVhbGx5IGV4Y2x1c2l2ZSB3aXRoIGBzY3JvbGxPdmVyZmxvd2AuIFNlY3Rpb25zIHdpdGggc2Nyb2xsT3ZlcmZsb3cgbWlnaHQgbm90IHdvcmsgd2VsbCBpbiBGaXJlZm94Jyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKG9wdGlvbnMuY29udGludW91c1ZlcnRpY2FsICYmIG9wdGlvbnMuc2Nyb2xsQmFyKXtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMuY29udGludW91c1ZlcnRpY2FsID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBzaG93RXJyb3IoJ3dhcm4nLCAnT3B0aW9uIGBzY3JvbGxCYXJgIGlzIG11dHVhbGx5IGV4Y2x1c2l2ZSB3aXRoIGBjb250aW51b3VzVmVydGljYWxgOyBgY29udGludW91c1ZlcnRpY2FsYCBkaXNhYmxlZCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2FuY2hvcnMgY2FuIG5vdCBoYXZlIHRoZSBzYW1lIHZhbHVlIGFzIGFueSBlbGVtZW50IElEIG9yIE5BTUVcclxuICAgICAgICAgICAgJC5lYWNoKG9wdGlvbnMuYW5jaG9ycywgZnVuY3Rpb24oaW5kZXgsIG5hbWUpe1xyXG5cclxuICAgICAgICAgICAgICAgIC8vY2FzZSBpbnNlbnNpdGl2ZSBzZWxlY3RvcnMgKGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE5NDY1MTg3LzEwODEzOTYpXHJcbiAgICAgICAgICAgICAgICB2YXIgbmFtZUF0dHIgPSAkZG9jdW1lbnQuZmluZCgnW25hbWVdJykuZmlsdGVyKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkKHRoaXMpLmF0dHIoJ25hbWUnKSAmJiAkKHRoaXMpLmF0dHIoJ25hbWUnKS50b0xvd2VyQ2FzZSgpID09IG5hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpZEF0dHIgPSAkZG9jdW1lbnQuZmluZCgnW2lkXScpLmZpbHRlcihmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJCh0aGlzKS5hdHRyKCdpZCcpICYmICQodGhpcykuYXR0cignaWQnKS50b0xvd2VyQ2FzZSgpID09IG5hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGlkQXR0ci5sZW5ndGggfHwgbmFtZUF0dHIubGVuZ3RoICl7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0Vycm9yKCdlcnJvcicsICdkYXRhLWFuY2hvciB0YWdzIGNhbiBub3QgaGF2ZSB0aGUgc2FtZSB2YWx1ZSBhcyBhbnkgYGlkYCBlbGVtZW50IG9uIHRoZSBzaXRlIChvciBgbmFtZWAgZWxlbWVudCBmb3IgSUUpLicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlkQXR0ci5sZW5ndGggJiYgc2hvd0Vycm9yKCdlcnJvcicsICdcIicgKyBuYW1lICsgJ1wiIGlzIGlzIGJlaW5nIHVzZWQgYnkgYW5vdGhlciBlbGVtZW50IGBpZGAgcHJvcGVydHknKTtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lQXR0ci5sZW5ndGggJiYgc2hvd0Vycm9yKCdlcnJvcicsICdcIicgKyBuYW1lICsgJ1wiIGlzIGlzIGJlaW5nIHVzZWQgYnkgYW5vdGhlciBlbGVtZW50IGBuYW1lYCBwcm9wZXJ0eScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogU2hvd3MgYSBtZXNzYWdlIGluIHRoZSBjb25zb2xlIG9mIHRoZSBnaXZlbiB0eXBlLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gc2hvd0Vycm9yKHR5cGUsIHRleHQpe1xyXG4gICAgICAgICAgICBjb25zb2xlICYmIGNvbnNvbGVbdHlwZV0gJiYgY29uc29sZVt0eXBlXSgnZnVsbFBhZ2U6ICcgKyB0ZXh0KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQW4gb2JqZWN0IHRvIGhhbmRsZSBvdmVyZmxvdyBzY3JvbGxpbmcuXHJcbiAgICAgKiBUaGlzIHVzZXMganF1ZXJ5LnNsaW1TY3JvbGwgdG8gYWNjb21wbGlzaCBvdmVyZmxvdyBzY3JvbGxpbmcuXHJcbiAgICAgKiBJdCBpcyBwb3NzaWJsZSB0byBwYXNzIGluIGFuIGFsdGVybmF0ZSBzY3JvbGxPdmVyZmxvd0hhbmRsZXJcclxuICAgICAqIHRvIHRoZSBmdWxscGFnZS5qcyBvcHRpb24gdGhhdCBpbXBsZW1lbnRzIHRoZSBzYW1lIGZ1bmN0aW9uc1xyXG4gICAgICogYXMgdGhpcyBoYW5kbGVyLlxyXG4gICAgICpcclxuICAgICAqIEB0eXBlIHtPYmplY3R9XHJcbiAgICAgKi9cclxuICAgIHZhciBzbGltU2Nyb2xsSGFuZGxlciA9IHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBPcHRpb25hbCBmdW5jdGlvbiBjYWxsZWQgYWZ0ZXIgZWFjaCByZW5kZXIuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBTb2x2ZXMgYSBidWcgd2l0aCBzbGltU2Nyb2xsIHZlbmRvciBsaWJyYXJ5ICMxMDM3LCAjNTUzXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gIHtvYmplY3R9IHNlY3Rpb24galF1ZXJ5IG9iamVjdCBjb250YWluaW5nIHJlbmRlcmVkIHNlY3Rpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBhZnRlclJlbmRlcjogZnVuY3Rpb24oc2VjdGlvbil7XHJcbiAgICAgICAgICAgIHZhciBzbGlkZXMgPSBzZWN0aW9uLmZpbmQoU0xJREVTX1dSQVBQRVIpO1xyXG4gICAgICAgICAgICB2YXIgc2Nyb2xsYWJsZVdyYXAgPSBzZWN0aW9uLmZpbmQoU0NST0xMQUJMRV9TRUwpO1xyXG5cclxuICAgICAgICAgICAgaWYoc2xpZGVzLmxlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxhYmxlV3JhcCA9IHNsaWRlcy5maW5kKFNMSURFX0FDVElWRV9TRUwpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzY3JvbGxhYmxlV3JhcC5tb3VzZW92ZXIoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDYWxsZWQgd2hlbiBvdmVyZmxvdyBzY3JvbGxpbmcgaXMgbmVlZGVkIGZvciBhIHNlY3Rpb24uXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGVsZW1lbnQgICAgICBqUXVlcnkgb2JqZWN0IGNvbnRhaW5pbmcgY3VycmVudCBzZWN0aW9uXHJcbiAgICAgICAgICogQHBhcmFtICB7TnVtYmVyfSBzY3JvbGxIZWlnaHQgQ3VycmVudCB3aW5kb3cgaGVpZ2h0IGluIHBpeGVsc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNyZWF0ZTogZnVuY3Rpb24oZWxlbWVudCwgc2Nyb2xsSGVpZ2h0KXtcclxuICAgICAgICAgICAgZWxlbWVudC5maW5kKFNDUk9MTEFCTEVfU0VMKS5zbGltU2Nyb2xsKHtcclxuICAgICAgICAgICAgICAgIGFsbG93UGFnZVNjcm9sbDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogc2Nyb2xsSGVpZ2h0ICsgJ3B4JyxcclxuICAgICAgICAgICAgICAgIHNpemU6ICcxMHB4JyxcclxuICAgICAgICAgICAgICAgIGFsd2F5c1Zpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmV0dXJuIGEgYm9vbGVhbiBkZXBlbmRpbmcgb24gd2hldGhlciB0aGUgc2Nyb2xsYWJsZSBlbGVtZW50IGlzIGFcclxuICAgICAgICAgKiB0aGUgZW5kIG9yIGF0IHRoZSBzdGFydCBvZiB0aGUgc2Nyb2xsaW5nIGRlcGVuZGluZyBvbiB0aGUgZ2l2ZW4gdHlwZS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gIHR5cGUgICAgICAgRWl0aGVyICd0b3AnIG9yICdib3R0b20nXHJcbiAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSAgc2Nyb2xsYWJsZSBqUXVlcnkgb2JqZWN0IGZvciB0aGUgc2Nyb2xsYWJsZSBlbGVtZW50XHJcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn1cclxuICAgICAgICAgKi9cclxuICAgICAgICBpc1Njcm9sbGVkOiBmdW5jdGlvbih0eXBlLCBzY3JvbGxhYmxlKXtcclxuICAgICAgICAgICAgaWYodHlwZSA9PT0gJ3RvcCcpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICFzY3JvbGxhYmxlLnNjcm9sbFRvcCgpO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZih0eXBlID09PSAnYm90dG9tJyl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2Nyb2xsYWJsZS5zY3JvbGxUb3AoKSArIDEgKyBzY3JvbGxhYmxlLmlubmVySGVpZ2h0KCkgPj0gc2Nyb2xsYWJsZVswXS5zY3JvbGxIZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBzY3JvbGxhYmxlIGVsZW1lbnQgZm9yIHRoZSBnaXZlbiBzZWN0aW9uLlxyXG4gICAgICAgICAqIElmIHRoZXJlIGFyZSBsYW5kc2NhcGUgc2xpZGVzLCB3aWxsIG9ubHkgcmV0dXJuIGEgc2Nyb2xsYWJsZSBlbGVtZW50XHJcbiAgICAgICAgICogaWYgaXQgaXMgaW4gdGhlIGFjdGl2ZSBzbGlkZS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gIGFjdGl2ZVNlY3Rpb24galF1ZXJ5IG9iamVjdCBjb250YWluaW5nIGN1cnJlbnQgc2VjdGlvblxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc2Nyb2xsYWJsZTogZnVuY3Rpb24oYWN0aXZlU2VjdGlvbil7XHJcbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGFyZSBsYW5kc2NhcGUgc2xpZGVzLCB3ZSBjaGVjayBpZiB0aGUgc2Nyb2xsaW5nIGJhciBpcyBpbiB0aGUgY3VycmVudCBvbmUgb3Igbm90XHJcbiAgICAgICAgICAgIGlmKGFjdGl2ZVNlY3Rpb24uZmluZChTTElERVNfV1JBUFBFUl9TRUwpLmxlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWN0aXZlU2VjdGlvbi5maW5kKFNMSURFX0FDVElWRV9TRUwpLmZpbmQoU0NST0xMQUJMRV9TRUwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhY3RpdmVTZWN0aW9uLmZpbmQoU0NST0xMQUJMRV9TRUwpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJldHVybnMgdGhlIHNjcm9sbCBoZWlnaHQgb2YgdGhlIHdyYXBwZWQgY29udGVudC5cclxuICAgICAgICAgKiBJZiB0aGlzIGlzIGxhcmdlciB0aGFuIHRoZSB3aW5kb3cgaGVpZ2h0IG1pbnVzIHNlY3Rpb24gcGFkZGluZyxcclxuICAgICAgICAgKiBvdmVyZmxvdyBzY3JvbGxpbmcgaXMgbmVlZGVkLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBlbGVtZW50IGpRdWVyeSBvYmplY3QgY29udGFpbmluZyBjdXJyZW50IHNlY3Rpb25cclxuICAgICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc2Nyb2xsSGVpZ2h0OiBmdW5jdGlvbihlbGVtZW50KXtcclxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQuZmluZChTQ1JPTExBQkxFX1NFTCkuZ2V0KDApLnNjcm9sbEhlaWdodDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDYWxsZWQgd2hlbiBvdmVyZmxvdyBzY3JvbGxpbmcgaXMgbm8gbG9uZ2VyIG5lZWRlZCBmb3IgYSBzZWN0aW9uLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBlbGVtZW50ICAgICAgalF1ZXJ5IG9iamVjdCBjb250YWluaW5nIGN1cnJlbnQgc2VjdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24oZWxlbWVudCl7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuZmluZChTQ1JPTExBQkxFX1NFTCkuY2hpbGRyZW4oKS5maXJzdCgpLnVud3JhcCgpLnVud3JhcCgpO1xyXG4gICAgICAgICAgICBlbGVtZW50LmZpbmQoU0xJTVNDUk9MTF9CQVJfU0VMKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgZWxlbWVudC5maW5kKFNMSU1TQ1JPTExfUkFJTF9TRUwpLnJlbW92ZSgpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENhbGxlZCB3aGVuIG92ZXJmbG93IHNjcm9sbGluZyBoYXMgYWxyZWFkeSBiZWVuIHNldHVwIGJ1dCB0aGVcclxuICAgICAgICAgKiB3aW5kb3cgaGVpZ2h0IGhhcyBwb3RlbnRpYWxseSBjaGFuZ2VkLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBlbGVtZW50ICAgICAgalF1ZXJ5IG9iamVjdCBjb250YWluaW5nIGN1cnJlbnQgc2VjdGlvblxyXG4gICAgICAgICAqIEBwYXJhbSAge051bWJlcn0gc2Nyb2xsSGVpZ2h0IEN1cnJlbnQgd2luZG93IGhlaWdodCBpbiBwaXhlbHNcclxuICAgICAgICAgKi9cclxuICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKGVsZW1lbnQsIHNjcm9sbEhlaWdodCl7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuZmluZChTQ1JPTExBQkxFX1NFTCkuY3NzKCdoZWlnaHQnLCBzY3JvbGxIZWlnaHQgKyAncHgnKS5wYXJlbnQoKS5jc3MoJ2hlaWdodCcsIHNjcm9sbEhlaWdodCArICdweCcpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENhbGxlZCB0byBnZXQgYW55IGFkZGl0aW9uYWwgZWxlbWVudHMgbmVlZGVkIHRvIHdyYXAgdGhlIHNlY3Rpb25cclxuICAgICAgICAgKiBjb250ZW50IGluIG9yZGVyIHRvIGZhY2lsaXRhdGUgb3ZlcmZsb3cgc2Nyb2xsaW5nLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfE9iamVjdH0gQ2FuIGJlIGEgc3RyaW5nIGNvbnRhaW5pbmcgSFRNTCxcclxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICBhIERPTSBlbGVtZW50LCBvciBqUXVlcnkgb2JqZWN0LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHdyYXBDb250ZW50OiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCInICsgU0NST0xMQUJMRSArICdcIj48L2Rpdj4nO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZGVmYXVsdFNjcm9sbEhhbmRsZXIgPSBzbGltU2Nyb2xsSGFuZGxlcjtcclxuXHJcbn0pO1xyXG4iLCIvKiFcbiAqIGpRdWVyeSBKYXZhU2NyaXB0IExpYnJhcnkgdjIuMi4zXG4gKiBodHRwOi8vanF1ZXJ5LmNvbS9cbiAqXG4gKiBJbmNsdWRlcyBTaXp6bGUuanNcbiAqIGh0dHA6Ly9zaXp6bGVqcy5jb20vXG4gKlxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnNcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogaHR0cDovL2pxdWVyeS5vcmcvbGljZW5zZVxuICpcbiAqIERhdGU6IDIwMTYtMDQtMDVUMTk6MjZaXG4gKi9cblxuKGZ1bmN0aW9uKCBnbG9iYWwsIGZhY3RvcnkgKSB7XG5cblx0aWYgKCB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gXCJvYmplY3RcIiApIHtcblx0XHQvLyBGb3IgQ29tbW9uSlMgYW5kIENvbW1vbkpTLWxpa2UgZW52aXJvbm1lbnRzIHdoZXJlIGEgcHJvcGVyIGB3aW5kb3dgXG5cdFx0Ly8gaXMgcHJlc2VudCwgZXhlY3V0ZSB0aGUgZmFjdG9yeSBhbmQgZ2V0IGpRdWVyeS5cblx0XHQvLyBGb3IgZW52aXJvbm1lbnRzIHRoYXQgZG8gbm90IGhhdmUgYSBgd2luZG93YCB3aXRoIGEgYGRvY3VtZW50YFxuXHRcdC8vIChzdWNoIGFzIE5vZGUuanMpLCBleHBvc2UgYSBmYWN0b3J5IGFzIG1vZHVsZS5leHBvcnRzLlxuXHRcdC8vIFRoaXMgYWNjZW50dWF0ZXMgdGhlIG5lZWQgZm9yIHRoZSBjcmVhdGlvbiBvZiBhIHJlYWwgYHdpbmRvd2AuXG5cdFx0Ly8gZS5nLiB2YXIgalF1ZXJ5ID0gcmVxdWlyZShcImpxdWVyeVwiKSh3aW5kb3cpO1xuXHRcdC8vIFNlZSB0aWNrZXQgIzE0NTQ5IGZvciBtb3JlIGluZm8uXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBnbG9iYWwuZG9jdW1lbnQgP1xuXHRcdFx0ZmFjdG9yeSggZ2xvYmFsLCB0cnVlICkgOlxuXHRcdFx0ZnVuY3Rpb24oIHcgKSB7XG5cdFx0XHRcdGlmICggIXcuZG9jdW1lbnQgKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCBcImpRdWVyeSByZXF1aXJlcyBhIHdpbmRvdyB3aXRoIGEgZG9jdW1lbnRcIiApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBmYWN0b3J5KCB3ICk7XG5cdFx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdGZhY3RvcnkoIGdsb2JhbCApO1xuXHR9XG5cbi8vIFBhc3MgdGhpcyBpZiB3aW5kb3cgaXMgbm90IGRlZmluZWQgeWV0XG59KHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB0aGlzLCBmdW5jdGlvbiggd2luZG93LCBub0dsb2JhbCApIHtcblxuLy8gU3VwcG9ydDogRmlyZWZveCAxOCtcbi8vIENhbid0IGJlIGluIHN0cmljdCBtb2RlLCBzZXZlcmFsIGxpYnMgaW5jbHVkaW5nIEFTUC5ORVQgdHJhY2Vcbi8vIHRoZSBzdGFjayB2aWEgYXJndW1lbnRzLmNhbGxlci5jYWxsZWUgYW5kIEZpcmVmb3ggZGllcyBpZlxuLy8geW91IHRyeSB0byB0cmFjZSB0aHJvdWdoIFwidXNlIHN0cmljdFwiIGNhbGwgY2hhaW5zLiAoIzEzMzM1KVxuLy9cInVzZSBzdHJpY3RcIjtcbnZhciBhcnIgPSBbXTtcblxudmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG52YXIgc2xpY2UgPSBhcnIuc2xpY2U7XG5cbnZhciBjb25jYXQgPSBhcnIuY29uY2F0O1xuXG52YXIgcHVzaCA9IGFyci5wdXNoO1xuXG52YXIgaW5kZXhPZiA9IGFyci5pbmRleE9mO1xuXG52YXIgY2xhc3MydHlwZSA9IHt9O1xuXG52YXIgdG9TdHJpbmcgPSBjbGFzczJ0eXBlLnRvU3RyaW5nO1xuXG52YXIgaGFzT3duID0gY2xhc3MydHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxudmFyIHN1cHBvcnQgPSB7fTtcblxuXG5cbnZhclxuXHR2ZXJzaW9uID0gXCIyLjIuM1wiLFxuXG5cdC8vIERlZmluZSBhIGxvY2FsIGNvcHkgb2YgalF1ZXJ5XG5cdGpRdWVyeSA9IGZ1bmN0aW9uKCBzZWxlY3RvciwgY29udGV4dCApIHtcblxuXHRcdC8vIFRoZSBqUXVlcnkgb2JqZWN0IGlzIGFjdHVhbGx5IGp1c3QgdGhlIGluaXQgY29uc3RydWN0b3IgJ2VuaGFuY2VkJ1xuXHRcdC8vIE5lZWQgaW5pdCBpZiBqUXVlcnkgaXMgY2FsbGVkIChqdXN0IGFsbG93IGVycm9yIHRvIGJlIHRocm93biBpZiBub3QgaW5jbHVkZWQpXG5cdFx0cmV0dXJuIG5ldyBqUXVlcnkuZm4uaW5pdCggc2VsZWN0b3IsIGNvbnRleHQgKTtcblx0fSxcblxuXHQvLyBTdXBwb3J0OiBBbmRyb2lkPDQuMVxuXHQvLyBNYWtlIHN1cmUgd2UgdHJpbSBCT00gYW5kIE5CU1Bcblx0cnRyaW0gPSAvXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskL2csXG5cblx0Ly8gTWF0Y2hlcyBkYXNoZWQgc3RyaW5nIGZvciBjYW1lbGl6aW5nXG5cdHJtc1ByZWZpeCA9IC9eLW1zLS8sXG5cdHJkYXNoQWxwaGEgPSAvLShbXFxkYS16XSkvZ2ksXG5cblx0Ly8gVXNlZCBieSBqUXVlcnkuY2FtZWxDYXNlIGFzIGNhbGxiYWNrIHRvIHJlcGxhY2UoKVxuXHRmY2FtZWxDYXNlID0gZnVuY3Rpb24oIGFsbCwgbGV0dGVyICkge1xuXHRcdHJldHVybiBsZXR0ZXIudG9VcHBlckNhc2UoKTtcblx0fTtcblxualF1ZXJ5LmZuID0galF1ZXJ5LnByb3RvdHlwZSA9IHtcblxuXHQvLyBUaGUgY3VycmVudCB2ZXJzaW9uIG9mIGpRdWVyeSBiZWluZyB1c2VkXG5cdGpxdWVyeTogdmVyc2lvbixcblxuXHRjb25zdHJ1Y3RvcjogalF1ZXJ5LFxuXG5cdC8vIFN0YXJ0IHdpdGggYW4gZW1wdHkgc2VsZWN0b3Jcblx0c2VsZWN0b3I6IFwiXCIsXG5cblx0Ly8gVGhlIGRlZmF1bHQgbGVuZ3RoIG9mIGEgalF1ZXJ5IG9iamVjdCBpcyAwXG5cdGxlbmd0aDogMCxcblxuXHR0b0FycmF5OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gc2xpY2UuY2FsbCggdGhpcyApO1xuXHR9LFxuXG5cdC8vIEdldCB0aGUgTnRoIGVsZW1lbnQgaW4gdGhlIG1hdGNoZWQgZWxlbWVudCBzZXQgT1Jcblx0Ly8gR2V0IHRoZSB3aG9sZSBtYXRjaGVkIGVsZW1lbnQgc2V0IGFzIGEgY2xlYW4gYXJyYXlcblx0Z2V0OiBmdW5jdGlvbiggbnVtICkge1xuXHRcdHJldHVybiBudW0gIT0gbnVsbCA/XG5cblx0XHRcdC8vIFJldHVybiBqdXN0IHRoZSBvbmUgZWxlbWVudCBmcm9tIHRoZSBzZXRcblx0XHRcdCggbnVtIDwgMCA/IHRoaXNbIG51bSArIHRoaXMubGVuZ3RoIF0gOiB0aGlzWyBudW0gXSApIDpcblxuXHRcdFx0Ly8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgaW4gYSBjbGVhbiBhcnJheVxuXHRcdFx0c2xpY2UuY2FsbCggdGhpcyApO1xuXHR9LFxuXG5cdC8vIFRha2UgYW4gYXJyYXkgb2YgZWxlbWVudHMgYW5kIHB1c2ggaXQgb250byB0aGUgc3RhY2tcblx0Ly8gKHJldHVybmluZyB0aGUgbmV3IG1hdGNoZWQgZWxlbWVudCBzZXQpXG5cdHB1c2hTdGFjazogZnVuY3Rpb24oIGVsZW1zICkge1xuXG5cdFx0Ly8gQnVpbGQgYSBuZXcgalF1ZXJ5IG1hdGNoZWQgZWxlbWVudCBzZXRcblx0XHR2YXIgcmV0ID0galF1ZXJ5Lm1lcmdlKCB0aGlzLmNvbnN0cnVjdG9yKCksIGVsZW1zICk7XG5cblx0XHQvLyBBZGQgdGhlIG9sZCBvYmplY3Qgb250byB0aGUgc3RhY2sgKGFzIGEgcmVmZXJlbmNlKVxuXHRcdHJldC5wcmV2T2JqZWN0ID0gdGhpcztcblx0XHRyZXQuY29udGV4dCA9IHRoaXMuY29udGV4dDtcblxuXHRcdC8vIFJldHVybiB0aGUgbmV3bHktZm9ybWVkIGVsZW1lbnQgc2V0XG5cdFx0cmV0dXJuIHJldDtcblx0fSxcblxuXHQvLyBFeGVjdXRlIGEgY2FsbGJhY2sgZm9yIGV2ZXJ5IGVsZW1lbnQgaW4gdGhlIG1hdGNoZWQgc2V0LlxuXHRlYWNoOiBmdW5jdGlvbiggY2FsbGJhY2sgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5lYWNoKCB0aGlzLCBjYWxsYmFjayApO1xuXHR9LFxuXG5cdG1hcDogZnVuY3Rpb24oIGNhbGxiYWNrICkge1xuXHRcdHJldHVybiB0aGlzLnB1c2hTdGFjayggalF1ZXJ5Lm1hcCggdGhpcywgZnVuY3Rpb24oIGVsZW0sIGkgKSB7XG5cdFx0XHRyZXR1cm4gY2FsbGJhY2suY2FsbCggZWxlbSwgaSwgZWxlbSApO1xuXHRcdH0gKSApO1xuXHR9LFxuXG5cdHNsaWNlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5wdXNoU3RhY2soIHNsaWNlLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKSApO1xuXHR9LFxuXG5cdGZpcnN0OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5lcSggMCApO1xuXHR9LFxuXG5cdGxhc3Q6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmVxKCAtMSApO1xuXHR9LFxuXG5cdGVxOiBmdW5jdGlvbiggaSApIHtcblx0XHR2YXIgbGVuID0gdGhpcy5sZW5ndGgsXG5cdFx0XHRqID0gK2kgKyAoIGkgPCAwID8gbGVuIDogMCApO1xuXHRcdHJldHVybiB0aGlzLnB1c2hTdGFjayggaiA+PSAwICYmIGogPCBsZW4gPyBbIHRoaXNbIGogXSBdIDogW10gKTtcblx0fSxcblxuXHRlbmQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLnByZXZPYmplY3QgfHwgdGhpcy5jb25zdHJ1Y3RvcigpO1xuXHR9LFxuXG5cdC8vIEZvciBpbnRlcm5hbCB1c2Ugb25seS5cblx0Ly8gQmVoYXZlcyBsaWtlIGFuIEFycmF5J3MgbWV0aG9kLCBub3QgbGlrZSBhIGpRdWVyeSBtZXRob2QuXG5cdHB1c2g6IHB1c2gsXG5cdHNvcnQ6IGFyci5zb3J0LFxuXHRzcGxpY2U6IGFyci5zcGxpY2Vcbn07XG5cbmpRdWVyeS5leHRlbmQgPSBqUXVlcnkuZm4uZXh0ZW5kID0gZnVuY3Rpb24oKSB7XG5cdHZhciBvcHRpb25zLCBuYW1lLCBzcmMsIGNvcHksIGNvcHlJc0FycmF5LCBjbG9uZSxcblx0XHR0YXJnZXQgPSBhcmd1bWVudHNbIDAgXSB8fCB7fSxcblx0XHRpID0gMSxcblx0XHRsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLFxuXHRcdGRlZXAgPSBmYWxzZTtcblxuXHQvLyBIYW5kbGUgYSBkZWVwIGNvcHkgc2l0dWF0aW9uXG5cdGlmICggdHlwZW9mIHRhcmdldCA9PT0gXCJib29sZWFuXCIgKSB7XG5cdFx0ZGVlcCA9IHRhcmdldDtcblxuXHRcdC8vIFNraXAgdGhlIGJvb2xlYW4gYW5kIHRoZSB0YXJnZXRcblx0XHR0YXJnZXQgPSBhcmd1bWVudHNbIGkgXSB8fCB7fTtcblx0XHRpKys7XG5cdH1cblxuXHQvLyBIYW5kbGUgY2FzZSB3aGVuIHRhcmdldCBpcyBhIHN0cmluZyBvciBzb21ldGhpbmcgKHBvc3NpYmxlIGluIGRlZXAgY29weSlcblx0aWYgKCB0eXBlb2YgdGFyZ2V0ICE9PSBcIm9iamVjdFwiICYmICFqUXVlcnkuaXNGdW5jdGlvbiggdGFyZ2V0ICkgKSB7XG5cdFx0dGFyZ2V0ID0ge307XG5cdH1cblxuXHQvLyBFeHRlbmQgalF1ZXJ5IGl0c2VsZiBpZiBvbmx5IG9uZSBhcmd1bWVudCBpcyBwYXNzZWRcblx0aWYgKCBpID09PSBsZW5ndGggKSB7XG5cdFx0dGFyZ2V0ID0gdGhpcztcblx0XHRpLS07XG5cdH1cblxuXHRmb3IgKCA7IGkgPCBsZW5ndGg7IGkrKyApIHtcblxuXHRcdC8vIE9ubHkgZGVhbCB3aXRoIG5vbi1udWxsL3VuZGVmaW5lZCB2YWx1ZXNcblx0XHRpZiAoICggb3B0aW9ucyA9IGFyZ3VtZW50c1sgaSBdICkgIT0gbnVsbCApIHtcblxuXHRcdFx0Ly8gRXh0ZW5kIHRoZSBiYXNlIG9iamVjdFxuXHRcdFx0Zm9yICggbmFtZSBpbiBvcHRpb25zICkge1xuXHRcdFx0XHRzcmMgPSB0YXJnZXRbIG5hbWUgXTtcblx0XHRcdFx0Y29weSA9IG9wdGlvbnNbIG5hbWUgXTtcblxuXHRcdFx0XHQvLyBQcmV2ZW50IG5ldmVyLWVuZGluZyBsb29wXG5cdFx0XHRcdGlmICggdGFyZ2V0ID09PSBjb3B5ICkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gUmVjdXJzZSBpZiB3ZSdyZSBtZXJnaW5nIHBsYWluIG9iamVjdHMgb3IgYXJyYXlzXG5cdFx0XHRcdGlmICggZGVlcCAmJiBjb3B5ICYmICggalF1ZXJ5LmlzUGxhaW5PYmplY3QoIGNvcHkgKSB8fFxuXHRcdFx0XHRcdCggY29weUlzQXJyYXkgPSBqUXVlcnkuaXNBcnJheSggY29weSApICkgKSApIHtcblxuXHRcdFx0XHRcdGlmICggY29weUlzQXJyYXkgKSB7XG5cdFx0XHRcdFx0XHRjb3B5SXNBcnJheSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0Y2xvbmUgPSBzcmMgJiYgalF1ZXJ5LmlzQXJyYXkoIHNyYyApID8gc3JjIDogW107XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y2xvbmUgPSBzcmMgJiYgalF1ZXJ5LmlzUGxhaW5PYmplY3QoIHNyYyApID8gc3JjIDoge307XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gTmV2ZXIgbW92ZSBvcmlnaW5hbCBvYmplY3RzLCBjbG9uZSB0aGVtXG5cdFx0XHRcdFx0dGFyZ2V0WyBuYW1lIF0gPSBqUXVlcnkuZXh0ZW5kKCBkZWVwLCBjbG9uZSwgY29weSApO1xuXG5cdFx0XHRcdC8vIERvbid0IGJyaW5nIGluIHVuZGVmaW5lZCB2YWx1ZXNcblx0XHRcdFx0fSBlbHNlIGlmICggY29weSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdHRhcmdldFsgbmFtZSBdID0gY29weTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFJldHVybiB0aGUgbW9kaWZpZWQgb2JqZWN0XG5cdHJldHVybiB0YXJnZXQ7XG59O1xuXG5qUXVlcnkuZXh0ZW5kKCB7XG5cblx0Ly8gVW5pcXVlIGZvciBlYWNoIGNvcHkgb2YgalF1ZXJ5IG9uIHRoZSBwYWdlXG5cdGV4cGFuZG86IFwialF1ZXJ5XCIgKyAoIHZlcnNpb24gKyBNYXRoLnJhbmRvbSgpICkucmVwbGFjZSggL1xcRC9nLCBcIlwiICksXG5cblx0Ly8gQXNzdW1lIGpRdWVyeSBpcyByZWFkeSB3aXRob3V0IHRoZSByZWFkeSBtb2R1bGVcblx0aXNSZWFkeTogdHJ1ZSxcblxuXHRlcnJvcjogZnVuY3Rpb24oIG1zZyApIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoIG1zZyApO1xuXHR9LFxuXG5cdG5vb3A6IGZ1bmN0aW9uKCkge30sXG5cblx0aXNGdW5jdGlvbjogZnVuY3Rpb24oIG9iaiApIHtcblx0XHRyZXR1cm4galF1ZXJ5LnR5cGUoIG9iaiApID09PSBcImZ1bmN0aW9uXCI7XG5cdH0sXG5cblx0aXNBcnJheTogQXJyYXkuaXNBcnJheSxcblxuXHRpc1dpbmRvdzogZnVuY3Rpb24oIG9iaiApIHtcblx0XHRyZXR1cm4gb2JqICE9IG51bGwgJiYgb2JqID09PSBvYmoud2luZG93O1xuXHR9LFxuXG5cdGlzTnVtZXJpYzogZnVuY3Rpb24oIG9iaiApIHtcblxuXHRcdC8vIHBhcnNlRmxvYXQgTmFOcyBudW1lcmljLWNhc3QgZmFsc2UgcG9zaXRpdmVzIChudWxsfHRydWV8ZmFsc2V8XCJcIilcblx0XHQvLyAuLi5idXQgbWlzaW50ZXJwcmV0cyBsZWFkaW5nLW51bWJlciBzdHJpbmdzLCBwYXJ0aWN1bGFybHkgaGV4IGxpdGVyYWxzIChcIjB4Li4uXCIpXG5cdFx0Ly8gc3VidHJhY3Rpb24gZm9yY2VzIGluZmluaXRpZXMgdG8gTmFOXG5cdFx0Ly8gYWRkaW5nIDEgY29ycmVjdHMgbG9zcyBvZiBwcmVjaXNpb24gZnJvbSBwYXJzZUZsb2F0ICgjMTUxMDApXG5cdFx0dmFyIHJlYWxTdHJpbmdPYmogPSBvYmogJiYgb2JqLnRvU3RyaW5nKCk7XG5cdFx0cmV0dXJuICFqUXVlcnkuaXNBcnJheSggb2JqICkgJiYgKCByZWFsU3RyaW5nT2JqIC0gcGFyc2VGbG9hdCggcmVhbFN0cmluZ09iaiApICsgMSApID49IDA7XG5cdH0sXG5cblx0aXNQbGFpbk9iamVjdDogZnVuY3Rpb24oIG9iaiApIHtcblx0XHR2YXIga2V5O1xuXG5cdFx0Ly8gTm90IHBsYWluIG9iamVjdHM6XG5cdFx0Ly8gLSBBbnkgb2JqZWN0IG9yIHZhbHVlIHdob3NlIGludGVybmFsIFtbQ2xhc3NdXSBwcm9wZXJ0eSBpcyBub3QgXCJbb2JqZWN0IE9iamVjdF1cIlxuXHRcdC8vIC0gRE9NIG5vZGVzXG5cdFx0Ly8gLSB3aW5kb3dcblx0XHRpZiAoIGpRdWVyeS50eXBlKCBvYmogKSAhPT0gXCJvYmplY3RcIiB8fCBvYmoubm9kZVR5cGUgfHwgalF1ZXJ5LmlzV2luZG93KCBvYmogKSApIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBOb3Qgb3duIGNvbnN0cnVjdG9yIHByb3BlcnR5IG11c3QgYmUgT2JqZWN0XG5cdFx0aWYgKCBvYmouY29uc3RydWN0b3IgJiZcblx0XHRcdFx0IWhhc093bi5jYWxsKCBvYmosIFwiY29uc3RydWN0b3JcIiApICYmXG5cdFx0XHRcdCFoYXNPd24uY2FsbCggb2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSB8fCB7fSwgXCJpc1Byb3RvdHlwZU9mXCIgKSApIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBPd24gcHJvcGVydGllcyBhcmUgZW51bWVyYXRlZCBmaXJzdGx5LCBzbyB0byBzcGVlZCB1cCxcblx0XHQvLyBpZiBsYXN0IG9uZSBpcyBvd24sIHRoZW4gYWxsIHByb3BlcnRpZXMgYXJlIG93blxuXHRcdGZvciAoIGtleSBpbiBvYmogKSB7fVxuXG5cdFx0cmV0dXJuIGtleSA9PT0gdW5kZWZpbmVkIHx8IGhhc093bi5jYWxsKCBvYmosIGtleSApO1xuXHR9LFxuXG5cdGlzRW1wdHlPYmplY3Q6IGZ1bmN0aW9uKCBvYmogKSB7XG5cdFx0dmFyIG5hbWU7XG5cdFx0Zm9yICggbmFtZSBpbiBvYmogKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9LFxuXG5cdHR5cGU6IGZ1bmN0aW9uKCBvYmogKSB7XG5cdFx0aWYgKCBvYmogPT0gbnVsbCApIHtcblx0XHRcdHJldHVybiBvYmogKyBcIlwiO1xuXHRcdH1cblxuXHRcdC8vIFN1cHBvcnQ6IEFuZHJvaWQ8NC4wLCBpT1M8NiAoZnVuY3Rpb25pc2ggUmVnRXhwKVxuXHRcdHJldHVybiB0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBvYmogPT09IFwiZnVuY3Rpb25cIiA/XG5cdFx0XHRjbGFzczJ0eXBlWyB0b1N0cmluZy5jYWxsKCBvYmogKSBdIHx8IFwib2JqZWN0XCIgOlxuXHRcdFx0dHlwZW9mIG9iajtcblx0fSxcblxuXHQvLyBFdmFsdWF0ZXMgYSBzY3JpcHQgaW4gYSBnbG9iYWwgY29udGV4dFxuXHRnbG9iYWxFdmFsOiBmdW5jdGlvbiggY29kZSApIHtcblx0XHR2YXIgc2NyaXB0LFxuXHRcdFx0aW5kaXJlY3QgPSBldmFsO1xuXG5cdFx0Y29kZSA9IGpRdWVyeS50cmltKCBjb2RlICk7XG5cblx0XHRpZiAoIGNvZGUgKSB7XG5cblx0XHRcdC8vIElmIHRoZSBjb2RlIGluY2x1ZGVzIGEgdmFsaWQsIHByb2xvZ3VlIHBvc2l0aW9uXG5cdFx0XHQvLyBzdHJpY3QgbW9kZSBwcmFnbWEsIGV4ZWN1dGUgY29kZSBieSBpbmplY3RpbmcgYVxuXHRcdFx0Ly8gc2NyaXB0IHRhZyBpbnRvIHRoZSBkb2N1bWVudC5cblx0XHRcdGlmICggY29kZS5pbmRleE9mKCBcInVzZSBzdHJpY3RcIiApID09PSAxICkge1xuXHRcdFx0XHRzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcInNjcmlwdFwiICk7XG5cdFx0XHRcdHNjcmlwdC50ZXh0ID0gY29kZTtcblx0XHRcdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZCggc2NyaXB0ICkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggc2NyaXB0ICk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdC8vIE90aGVyd2lzZSwgYXZvaWQgdGhlIERPTSBub2RlIGNyZWF0aW9uLCBpbnNlcnRpb25cblx0XHRcdFx0Ly8gYW5kIHJlbW92YWwgYnkgdXNpbmcgYW4gaW5kaXJlY3QgZ2xvYmFsIGV2YWxcblxuXHRcdFx0XHRpbmRpcmVjdCggY29kZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHQvLyBDb252ZXJ0IGRhc2hlZCB0byBjYW1lbENhc2U7IHVzZWQgYnkgdGhlIGNzcyBhbmQgZGF0YSBtb2R1bGVzXG5cdC8vIFN1cHBvcnQ6IElFOS0xMStcblx0Ly8gTWljcm9zb2Z0IGZvcmdvdCB0byBodW1wIHRoZWlyIHZlbmRvciBwcmVmaXggKCM5NTcyKVxuXHRjYW1lbENhc2U6IGZ1bmN0aW9uKCBzdHJpbmcgKSB7XG5cdFx0cmV0dXJuIHN0cmluZy5yZXBsYWNlKCBybXNQcmVmaXgsIFwibXMtXCIgKS5yZXBsYWNlKCByZGFzaEFscGhhLCBmY2FtZWxDYXNlICk7XG5cdH0sXG5cblx0bm9kZU5hbWU6IGZ1bmN0aW9uKCBlbGVtLCBuYW1lICkge1xuXHRcdHJldHVybiBlbGVtLm5vZGVOYW1lICYmIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuXHR9LFxuXG5cdGVhY2g6IGZ1bmN0aW9uKCBvYmosIGNhbGxiYWNrICkge1xuXHRcdHZhciBsZW5ndGgsIGkgPSAwO1xuXG5cdFx0aWYgKCBpc0FycmF5TGlrZSggb2JqICkgKSB7XG5cdFx0XHRsZW5ndGggPSBvYmoubGVuZ3RoO1xuXHRcdFx0Zm9yICggOyBpIDwgbGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdGlmICggY2FsbGJhY2suY2FsbCggb2JqWyBpIF0sIGksIG9ialsgaSBdICkgPT09IGZhbHNlICkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZvciAoIGkgaW4gb2JqICkge1xuXHRcdFx0XHRpZiAoIGNhbGxiYWNrLmNhbGwoIG9ialsgaSBdLCBpLCBvYmpbIGkgXSApID09PSBmYWxzZSApIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBvYmo7XG5cdH0sXG5cblx0Ly8gU3VwcG9ydDogQW5kcm9pZDw0LjFcblx0dHJpbTogZnVuY3Rpb24oIHRleHQgKSB7XG5cdFx0cmV0dXJuIHRleHQgPT0gbnVsbCA/XG5cdFx0XHRcIlwiIDpcblx0XHRcdCggdGV4dCArIFwiXCIgKS5yZXBsYWNlKCBydHJpbSwgXCJcIiApO1xuXHR9LFxuXG5cdC8vIHJlc3VsdHMgaXMgZm9yIGludGVybmFsIHVzYWdlIG9ubHlcblx0bWFrZUFycmF5OiBmdW5jdGlvbiggYXJyLCByZXN1bHRzICkge1xuXHRcdHZhciByZXQgPSByZXN1bHRzIHx8IFtdO1xuXG5cdFx0aWYgKCBhcnIgIT0gbnVsbCApIHtcblx0XHRcdGlmICggaXNBcnJheUxpa2UoIE9iamVjdCggYXJyICkgKSApIHtcblx0XHRcdFx0alF1ZXJ5Lm1lcmdlKCByZXQsXG5cdFx0XHRcdFx0dHlwZW9mIGFyciA9PT0gXCJzdHJpbmdcIiA/XG5cdFx0XHRcdFx0WyBhcnIgXSA6IGFyclxuXHRcdFx0XHQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHVzaC5jYWxsKCByZXQsIGFyciApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiByZXQ7XG5cdH0sXG5cblx0aW5BcnJheTogZnVuY3Rpb24oIGVsZW0sIGFyciwgaSApIHtcblx0XHRyZXR1cm4gYXJyID09IG51bGwgPyAtMSA6IGluZGV4T2YuY2FsbCggYXJyLCBlbGVtLCBpICk7XG5cdH0sXG5cblx0bWVyZ2U6IGZ1bmN0aW9uKCBmaXJzdCwgc2Vjb25kICkge1xuXHRcdHZhciBsZW4gPSArc2Vjb25kLmxlbmd0aCxcblx0XHRcdGogPSAwLFxuXHRcdFx0aSA9IGZpcnN0Lmxlbmd0aDtcblxuXHRcdGZvciAoIDsgaiA8IGxlbjsgaisrICkge1xuXHRcdFx0Zmlyc3RbIGkrKyBdID0gc2Vjb25kWyBqIF07XG5cdFx0fVxuXG5cdFx0Zmlyc3QubGVuZ3RoID0gaTtcblxuXHRcdHJldHVybiBmaXJzdDtcblx0fSxcblxuXHRncmVwOiBmdW5jdGlvbiggZWxlbXMsIGNhbGxiYWNrLCBpbnZlcnQgKSB7XG5cdFx0dmFyIGNhbGxiYWNrSW52ZXJzZSxcblx0XHRcdG1hdGNoZXMgPSBbXSxcblx0XHRcdGkgPSAwLFxuXHRcdFx0bGVuZ3RoID0gZWxlbXMubGVuZ3RoLFxuXHRcdFx0Y2FsbGJhY2tFeHBlY3QgPSAhaW52ZXJ0O1xuXG5cdFx0Ly8gR28gdGhyb3VnaCB0aGUgYXJyYXksIG9ubHkgc2F2aW5nIHRoZSBpdGVtc1xuXHRcdC8vIHRoYXQgcGFzcyB0aGUgdmFsaWRhdG9yIGZ1bmN0aW9uXG5cdFx0Zm9yICggOyBpIDwgbGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRjYWxsYmFja0ludmVyc2UgPSAhY2FsbGJhY2soIGVsZW1zWyBpIF0sIGkgKTtcblx0XHRcdGlmICggY2FsbGJhY2tJbnZlcnNlICE9PSBjYWxsYmFja0V4cGVjdCApIHtcblx0XHRcdFx0bWF0Y2hlcy5wdXNoKCBlbGVtc1sgaSBdICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG1hdGNoZXM7XG5cdH0sXG5cblx0Ly8gYXJnIGlzIGZvciBpbnRlcm5hbCB1c2FnZSBvbmx5XG5cdG1hcDogZnVuY3Rpb24oIGVsZW1zLCBjYWxsYmFjaywgYXJnICkge1xuXHRcdHZhciBsZW5ndGgsIHZhbHVlLFxuXHRcdFx0aSA9IDAsXG5cdFx0XHRyZXQgPSBbXTtcblxuXHRcdC8vIEdvIHRocm91Z2ggdGhlIGFycmF5LCB0cmFuc2xhdGluZyBlYWNoIG9mIHRoZSBpdGVtcyB0byB0aGVpciBuZXcgdmFsdWVzXG5cdFx0aWYgKCBpc0FycmF5TGlrZSggZWxlbXMgKSApIHtcblx0XHRcdGxlbmd0aCA9IGVsZW1zLmxlbmd0aDtcblx0XHRcdGZvciAoIDsgaSA8IGxlbmd0aDsgaSsrICkge1xuXHRcdFx0XHR2YWx1ZSA9IGNhbGxiYWNrKCBlbGVtc1sgaSBdLCBpLCBhcmcgKTtcblxuXHRcdFx0XHRpZiAoIHZhbHVlICE9IG51bGwgKSB7XG5cdFx0XHRcdFx0cmV0LnB1c2goIHZhbHVlICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdC8vIEdvIHRocm91Z2ggZXZlcnkga2V5IG9uIHRoZSBvYmplY3QsXG5cdFx0fSBlbHNlIHtcblx0XHRcdGZvciAoIGkgaW4gZWxlbXMgKSB7XG5cdFx0XHRcdHZhbHVlID0gY2FsbGJhY2soIGVsZW1zWyBpIF0sIGksIGFyZyApO1xuXG5cdFx0XHRcdGlmICggdmFsdWUgIT0gbnVsbCApIHtcblx0XHRcdFx0XHRyZXQucHVzaCggdmFsdWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIEZsYXR0ZW4gYW55IG5lc3RlZCBhcnJheXNcblx0XHRyZXR1cm4gY29uY2F0LmFwcGx5KCBbXSwgcmV0ICk7XG5cdH0sXG5cblx0Ly8gQSBnbG9iYWwgR1VJRCBjb3VudGVyIGZvciBvYmplY3RzXG5cdGd1aWQ6IDEsXG5cblx0Ly8gQmluZCBhIGZ1bmN0aW9uIHRvIGEgY29udGV4dCwgb3B0aW9uYWxseSBwYXJ0aWFsbHkgYXBwbHlpbmcgYW55XG5cdC8vIGFyZ3VtZW50cy5cblx0cHJveHk6IGZ1bmN0aW9uKCBmbiwgY29udGV4dCApIHtcblx0XHR2YXIgdG1wLCBhcmdzLCBwcm94eTtcblxuXHRcdGlmICggdHlwZW9mIGNvbnRleHQgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHR0bXAgPSBmblsgY29udGV4dCBdO1xuXHRcdFx0Y29udGV4dCA9IGZuO1xuXHRcdFx0Zm4gPSB0bXA7XG5cdFx0fVxuXG5cdFx0Ly8gUXVpY2sgY2hlY2sgdG8gZGV0ZXJtaW5lIGlmIHRhcmdldCBpcyBjYWxsYWJsZSwgaW4gdGhlIHNwZWNcblx0XHQvLyB0aGlzIHRocm93cyBhIFR5cGVFcnJvciwgYnV0IHdlIHdpbGwganVzdCByZXR1cm4gdW5kZWZpbmVkLlxuXHRcdGlmICggIWpRdWVyeS5pc0Z1bmN0aW9uKCBmbiApICkge1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHQvLyBTaW11bGF0ZWQgYmluZFxuXHRcdGFyZ3MgPSBzbGljZS5jYWxsKCBhcmd1bWVudHMsIDIgKTtcblx0XHRwcm94eSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGZuLmFwcGx5KCBjb250ZXh0IHx8IHRoaXMsIGFyZ3MuY29uY2F0KCBzbGljZS5jYWxsKCBhcmd1bWVudHMgKSApICk7XG5cdFx0fTtcblxuXHRcdC8vIFNldCB0aGUgZ3VpZCBvZiB1bmlxdWUgaGFuZGxlciB0byB0aGUgc2FtZSBvZiBvcmlnaW5hbCBoYW5kbGVyLCBzbyBpdCBjYW4gYmUgcmVtb3ZlZFxuXHRcdHByb3h5Lmd1aWQgPSBmbi5ndWlkID0gZm4uZ3VpZCB8fCBqUXVlcnkuZ3VpZCsrO1xuXG5cdFx0cmV0dXJuIHByb3h5O1xuXHR9LFxuXG5cdG5vdzogRGF0ZS5ub3csXG5cblx0Ly8galF1ZXJ5LnN1cHBvcnQgaXMgbm90IHVzZWQgaW4gQ29yZSBidXQgb3RoZXIgcHJvamVjdHMgYXR0YWNoIHRoZWlyXG5cdC8vIHByb3BlcnRpZXMgdG8gaXQgc28gaXQgbmVlZHMgdG8gZXhpc3QuXG5cdHN1cHBvcnQ6IHN1cHBvcnRcbn0gKTtcblxuLy8gSlNIaW50IHdvdWxkIGVycm9yIG9uIHRoaXMgY29kZSBkdWUgdG8gdGhlIFN5bWJvbCBub3QgYmVpbmcgZGVmaW5lZCBpbiBFUzUuXG4vLyBEZWZpbmluZyB0aGlzIGdsb2JhbCBpbiAuanNoaW50cmMgd291bGQgY3JlYXRlIGEgZGFuZ2VyIG9mIHVzaW5nIHRoZSBnbG9iYWxcbi8vIHVuZ3VhcmRlZCBpbiBhbm90aGVyIHBsYWNlLCBpdCBzZWVtcyBzYWZlciB0byBqdXN0IGRpc2FibGUgSlNIaW50IGZvciB0aGVzZVxuLy8gdGhyZWUgbGluZXMuXG4vKiBqc2hpbnQgaWdub3JlOiBzdGFydCAqL1xuaWYgKCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgKSB7XG5cdGpRdWVyeS5mblsgU3ltYm9sLml0ZXJhdG9yIF0gPSBhcnJbIFN5bWJvbC5pdGVyYXRvciBdO1xufVxuLyoganNoaW50IGlnbm9yZTogZW5kICovXG5cbi8vIFBvcHVsYXRlIHRoZSBjbGFzczJ0eXBlIG1hcFxualF1ZXJ5LmVhY2goIFwiQm9vbGVhbiBOdW1iZXIgU3RyaW5nIEZ1bmN0aW9uIEFycmF5IERhdGUgUmVnRXhwIE9iamVjdCBFcnJvciBTeW1ib2xcIi5zcGxpdCggXCIgXCIgKSxcbmZ1bmN0aW9uKCBpLCBuYW1lICkge1xuXHRjbGFzczJ0eXBlWyBcIltvYmplY3QgXCIgKyBuYW1lICsgXCJdXCIgXSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcbn0gKTtcblxuZnVuY3Rpb24gaXNBcnJheUxpa2UoIG9iaiApIHtcblxuXHQvLyBTdXBwb3J0OiBpT1MgOC4yIChub3QgcmVwcm9kdWNpYmxlIGluIHNpbXVsYXRvcilcblx0Ly8gYGluYCBjaGVjayB1c2VkIHRvIHByZXZlbnQgSklUIGVycm9yIChnaC0yMTQ1KVxuXHQvLyBoYXNPd24gaXNuJ3QgdXNlZCBoZXJlIGR1ZSB0byBmYWxzZSBuZWdhdGl2ZXNcblx0Ly8gcmVnYXJkaW5nIE5vZGVsaXN0IGxlbmd0aCBpbiBJRVxuXHR2YXIgbGVuZ3RoID0gISFvYmogJiYgXCJsZW5ndGhcIiBpbiBvYmogJiYgb2JqLmxlbmd0aCxcblx0XHR0eXBlID0galF1ZXJ5LnR5cGUoIG9iaiApO1xuXG5cdGlmICggdHlwZSA9PT0gXCJmdW5jdGlvblwiIHx8IGpRdWVyeS5pc1dpbmRvdyggb2JqICkgKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cmV0dXJuIHR5cGUgPT09IFwiYXJyYXlcIiB8fCBsZW5ndGggPT09IDAgfHxcblx0XHR0eXBlb2YgbGVuZ3RoID09PSBcIm51bWJlclwiICYmIGxlbmd0aCA+IDAgJiYgKCBsZW5ndGggLSAxICkgaW4gb2JqO1xufVxudmFyIFNpenpsZSA9XG4vKiFcbiAqIFNpenpsZSBDU1MgU2VsZWN0b3IgRW5naW5lIHYyLjIuMVxuICogaHR0cDovL3NpenpsZWpzLmNvbS9cbiAqXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9yc1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwOi8vanF1ZXJ5Lm9yZy9saWNlbnNlXG4gKlxuICogRGF0ZTogMjAxNS0xMC0xN1xuICovXG4oZnVuY3Rpb24oIHdpbmRvdyApIHtcblxudmFyIGksXG5cdHN1cHBvcnQsXG5cdEV4cHIsXG5cdGdldFRleHQsXG5cdGlzWE1MLFxuXHR0b2tlbml6ZSxcblx0Y29tcGlsZSxcblx0c2VsZWN0LFxuXHRvdXRlcm1vc3RDb250ZXh0LFxuXHRzb3J0SW5wdXQsXG5cdGhhc0R1cGxpY2F0ZSxcblxuXHQvLyBMb2NhbCBkb2N1bWVudCB2YXJzXG5cdHNldERvY3VtZW50LFxuXHRkb2N1bWVudCxcblx0ZG9jRWxlbSxcblx0ZG9jdW1lbnRJc0hUTUwsXG5cdHJidWdneVFTQSxcblx0cmJ1Z2d5TWF0Y2hlcyxcblx0bWF0Y2hlcyxcblx0Y29udGFpbnMsXG5cblx0Ly8gSW5zdGFuY2Utc3BlY2lmaWMgZGF0YVxuXHRleHBhbmRvID0gXCJzaXp6bGVcIiArIDEgKiBuZXcgRGF0ZSgpLFxuXHRwcmVmZXJyZWREb2MgPSB3aW5kb3cuZG9jdW1lbnQsXG5cdGRpcnJ1bnMgPSAwLFxuXHRkb25lID0gMCxcblx0Y2xhc3NDYWNoZSA9IGNyZWF0ZUNhY2hlKCksXG5cdHRva2VuQ2FjaGUgPSBjcmVhdGVDYWNoZSgpLFxuXHRjb21waWxlckNhY2hlID0gY3JlYXRlQ2FjaGUoKSxcblx0c29ydE9yZGVyID0gZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0aWYgKCBhID09PSBiICkge1xuXHRcdFx0aGFzRHVwbGljYXRlID0gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIDA7XG5cdH0sXG5cblx0Ly8gR2VuZXJhbC1wdXJwb3NlIGNvbnN0YW50c1xuXHRNQVhfTkVHQVRJVkUgPSAxIDw8IDMxLFxuXG5cdC8vIEluc3RhbmNlIG1ldGhvZHNcblx0aGFzT3duID0gKHt9KS5oYXNPd25Qcm9wZXJ0eSxcblx0YXJyID0gW10sXG5cdHBvcCA9IGFyci5wb3AsXG5cdHB1c2hfbmF0aXZlID0gYXJyLnB1c2gsXG5cdHB1c2ggPSBhcnIucHVzaCxcblx0c2xpY2UgPSBhcnIuc2xpY2UsXG5cdC8vIFVzZSBhIHN0cmlwcGVkLWRvd24gaW5kZXhPZiBhcyBpdCdzIGZhc3RlciB0aGFuIG5hdGl2ZVxuXHQvLyBodHRwOi8vanNwZXJmLmNvbS90aG9yLWluZGV4b2YtdnMtZm9yLzVcblx0aW5kZXhPZiA9IGZ1bmN0aW9uKCBsaXN0LCBlbGVtICkge1xuXHRcdHZhciBpID0gMCxcblx0XHRcdGxlbiA9IGxpc3QubGVuZ3RoO1xuXHRcdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFx0aWYgKCBsaXN0W2ldID09PSBlbGVtICkge1xuXHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIC0xO1xuXHR9LFxuXG5cdGJvb2xlYW5zID0gXCJjaGVja2VkfHNlbGVjdGVkfGFzeW5jfGF1dG9mb2N1c3xhdXRvcGxheXxjb250cm9sc3xkZWZlcnxkaXNhYmxlZHxoaWRkZW58aXNtYXB8bG9vcHxtdWx0aXBsZXxvcGVufHJlYWRvbmx5fHJlcXVpcmVkfHNjb3BlZFwiLFxuXG5cdC8vIFJlZ3VsYXIgZXhwcmVzc2lvbnNcblxuXHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLXNlbGVjdG9ycy8jd2hpdGVzcGFjZVxuXHR3aGl0ZXNwYWNlID0gXCJbXFxcXHgyMFxcXFx0XFxcXHJcXFxcblxcXFxmXVwiLFxuXG5cdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL0NTUzIxL3N5bmRhdGEuaHRtbCN2YWx1ZS1kZWYtaWRlbnRpZmllclxuXHRpZGVudGlmaWVyID0gXCIoPzpcXFxcXFxcXC58W1xcXFx3LV18W15cXFxceDAwLVxcXFx4YTBdKStcIixcblxuXHQvLyBBdHRyaWJ1dGUgc2VsZWN0b3JzOiBodHRwOi8vd3d3LnczLm9yZy9UUi9zZWxlY3RvcnMvI2F0dHJpYnV0ZS1zZWxlY3RvcnNcblx0YXR0cmlidXRlcyA9IFwiXFxcXFtcIiArIHdoaXRlc3BhY2UgKyBcIiooXCIgKyBpZGVudGlmaWVyICsgXCIpKD86XCIgKyB3aGl0ZXNwYWNlICtcblx0XHQvLyBPcGVyYXRvciAoY2FwdHVyZSAyKVxuXHRcdFwiKihbKl4kfCF+XT89KVwiICsgd2hpdGVzcGFjZSArXG5cdFx0Ly8gXCJBdHRyaWJ1dGUgdmFsdWVzIG11c3QgYmUgQ1NTIGlkZW50aWZpZXJzIFtjYXB0dXJlIDVdIG9yIHN0cmluZ3MgW2NhcHR1cmUgMyBvciBjYXB0dXJlIDRdXCJcblx0XHRcIiooPzonKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcJ10pKiknfFxcXCIoKD86XFxcXFxcXFwufFteXFxcXFxcXFxcXFwiXSkqKVxcXCJ8KFwiICsgaWRlbnRpZmllciArIFwiKSl8KVwiICsgd2hpdGVzcGFjZSArXG5cdFx0XCIqXFxcXF1cIixcblxuXHRwc2V1ZG9zID0gXCI6KFwiICsgaWRlbnRpZmllciArIFwiKSg/OlxcXFwoKFwiICtcblx0XHQvLyBUbyByZWR1Y2UgdGhlIG51bWJlciBvZiBzZWxlY3RvcnMgbmVlZGluZyB0b2tlbml6ZSBpbiB0aGUgcHJlRmlsdGVyLCBwcmVmZXIgYXJndW1lbnRzOlxuXHRcdC8vIDEuIHF1b3RlZCAoY2FwdHVyZSAzOyBjYXB0dXJlIDQgb3IgY2FwdHVyZSA1KVxuXHRcdFwiKCcoKD86XFxcXFxcXFwufFteXFxcXFxcXFwnXSkqKSd8XFxcIigoPzpcXFxcXFxcXC58W15cXFxcXFxcXFxcXCJdKSopXFxcIil8XCIgK1xuXHRcdC8vIDIuIHNpbXBsZSAoY2FwdHVyZSA2KVxuXHRcdFwiKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcKClbXFxcXF1dfFwiICsgYXR0cmlidXRlcyArIFwiKSopfFwiICtcblx0XHQvLyAzLiBhbnl0aGluZyBlbHNlIChjYXB0dXJlIDIpXG5cdFx0XCIuKlwiICtcblx0XHRcIilcXFxcKXwpXCIsXG5cblx0Ly8gTGVhZGluZyBhbmQgbm9uLWVzY2FwZWQgdHJhaWxpbmcgd2hpdGVzcGFjZSwgY2FwdHVyaW5nIHNvbWUgbm9uLXdoaXRlc3BhY2UgY2hhcmFjdGVycyBwcmVjZWRpbmcgdGhlIGxhdHRlclxuXHRyd2hpdGVzcGFjZSA9IG5ldyBSZWdFeHAoIHdoaXRlc3BhY2UgKyBcIitcIiwgXCJnXCIgKSxcblx0cnRyaW0gPSBuZXcgUmVnRXhwKCBcIl5cIiArIHdoaXRlc3BhY2UgKyBcIit8KCg/Ol58W15cXFxcXFxcXF0pKD86XFxcXFxcXFwuKSopXCIgKyB3aGl0ZXNwYWNlICsgXCIrJFwiLCBcImdcIiApLFxuXG5cdHJjb21tYSA9IG5ldyBSZWdFeHAoIFwiXlwiICsgd2hpdGVzcGFjZSArIFwiKixcIiArIHdoaXRlc3BhY2UgKyBcIipcIiApLFxuXHRyY29tYmluYXRvcnMgPSBuZXcgUmVnRXhwKCBcIl5cIiArIHdoaXRlc3BhY2UgKyBcIiooWz4rfl18XCIgKyB3aGl0ZXNwYWNlICsgXCIpXCIgKyB3aGl0ZXNwYWNlICsgXCIqXCIgKSxcblxuXHRyYXR0cmlidXRlUXVvdGVzID0gbmV3IFJlZ0V4cCggXCI9XCIgKyB3aGl0ZXNwYWNlICsgXCIqKFteXFxcXF0nXFxcIl0qPylcIiArIHdoaXRlc3BhY2UgKyBcIipcXFxcXVwiLCBcImdcIiApLFxuXG5cdHJwc2V1ZG8gPSBuZXcgUmVnRXhwKCBwc2V1ZG9zICksXG5cdHJpZGVudGlmaWVyID0gbmV3IFJlZ0V4cCggXCJeXCIgKyBpZGVudGlmaWVyICsgXCIkXCIgKSxcblxuXHRtYXRjaEV4cHIgPSB7XG5cdFx0XCJJRFwiOiBuZXcgUmVnRXhwKCBcIl4jKFwiICsgaWRlbnRpZmllciArIFwiKVwiICksXG5cdFx0XCJDTEFTU1wiOiBuZXcgUmVnRXhwKCBcIl5cXFxcLihcIiArIGlkZW50aWZpZXIgKyBcIilcIiApLFxuXHRcdFwiVEFHXCI6IG5ldyBSZWdFeHAoIFwiXihcIiArIGlkZW50aWZpZXIgKyBcInxbKl0pXCIgKSxcblx0XHRcIkFUVFJcIjogbmV3IFJlZ0V4cCggXCJeXCIgKyBhdHRyaWJ1dGVzICksXG5cdFx0XCJQU0VVRE9cIjogbmV3IFJlZ0V4cCggXCJeXCIgKyBwc2V1ZG9zICksXG5cdFx0XCJDSElMRFwiOiBuZXcgUmVnRXhwKCBcIl46KG9ubHl8Zmlyc3R8bGFzdHxudGh8bnRoLWxhc3QpLShjaGlsZHxvZi10eXBlKSg/OlxcXFwoXCIgKyB3aGl0ZXNwYWNlICtcblx0XHRcdFwiKihldmVufG9kZHwoKFsrLV18KShcXFxcZCopbnwpXCIgKyB3aGl0ZXNwYWNlICsgXCIqKD86KFsrLV18KVwiICsgd2hpdGVzcGFjZSArXG5cdFx0XHRcIiooXFxcXGQrKXwpKVwiICsgd2hpdGVzcGFjZSArIFwiKlxcXFwpfClcIiwgXCJpXCIgKSxcblx0XHRcImJvb2xcIjogbmV3IFJlZ0V4cCggXCJeKD86XCIgKyBib29sZWFucyArIFwiKSRcIiwgXCJpXCIgKSxcblx0XHQvLyBGb3IgdXNlIGluIGxpYnJhcmllcyBpbXBsZW1lbnRpbmcgLmlzKClcblx0XHQvLyBXZSB1c2UgdGhpcyBmb3IgUE9TIG1hdGNoaW5nIGluIGBzZWxlY3RgXG5cdFx0XCJuZWVkc0NvbnRleHRcIjogbmV3IFJlZ0V4cCggXCJeXCIgKyB3aGl0ZXNwYWNlICsgXCIqWz4rfl18OihldmVufG9kZHxlcXxndHxsdHxudGh8Zmlyc3R8bGFzdCkoPzpcXFxcKFwiICtcblx0XHRcdHdoaXRlc3BhY2UgKyBcIiooKD86LVxcXFxkKT9cXFxcZCopXCIgKyB3aGl0ZXNwYWNlICsgXCIqXFxcXCl8KSg/PVteLV18JClcIiwgXCJpXCIgKVxuXHR9LFxuXG5cdHJpbnB1dHMgPSAvXig/OmlucHV0fHNlbGVjdHx0ZXh0YXJlYXxidXR0b24pJC9pLFxuXHRyaGVhZGVyID0gL15oXFxkJC9pLFxuXG5cdHJuYXRpdmUgPSAvXltee10rXFx7XFxzKlxcW25hdGl2ZSBcXHcvLFxuXG5cdC8vIEVhc2lseS1wYXJzZWFibGUvcmV0cmlldmFibGUgSUQgb3IgVEFHIG9yIENMQVNTIHNlbGVjdG9yc1xuXHRycXVpY2tFeHByID0gL14oPzojKFtcXHctXSspfChcXHcrKXxcXC4oW1xcdy1dKykpJC8sXG5cblx0cnNpYmxpbmcgPSAvWyt+XS8sXG5cdHJlc2NhcGUgPSAvJ3xcXFxcL2csXG5cblx0Ly8gQ1NTIGVzY2FwZXMgaHR0cDovL3d3dy53My5vcmcvVFIvQ1NTMjEvc3luZGF0YS5odG1sI2VzY2FwZWQtY2hhcmFjdGVyc1xuXHRydW5lc2NhcGUgPSBuZXcgUmVnRXhwKCBcIlxcXFxcXFxcKFtcXFxcZGEtZl17MSw2fVwiICsgd2hpdGVzcGFjZSArIFwiP3woXCIgKyB3aGl0ZXNwYWNlICsgXCIpfC4pXCIsIFwiaWdcIiApLFxuXHRmdW5lc2NhcGUgPSBmdW5jdGlvbiggXywgZXNjYXBlZCwgZXNjYXBlZFdoaXRlc3BhY2UgKSB7XG5cdFx0dmFyIGhpZ2ggPSBcIjB4XCIgKyBlc2NhcGVkIC0gMHgxMDAwMDtcblx0XHQvLyBOYU4gbWVhbnMgbm9uLWNvZGVwb2ludFxuXHRcdC8vIFN1cHBvcnQ6IEZpcmVmb3g8MjRcblx0XHQvLyBXb3JrYXJvdW5kIGVycm9uZW91cyBudW1lcmljIGludGVycHJldGF0aW9uIG9mICtcIjB4XCJcblx0XHRyZXR1cm4gaGlnaCAhPT0gaGlnaCB8fCBlc2NhcGVkV2hpdGVzcGFjZSA/XG5cdFx0XHRlc2NhcGVkIDpcblx0XHRcdGhpZ2ggPCAwID9cblx0XHRcdFx0Ly8gQk1QIGNvZGVwb2ludFxuXHRcdFx0XHRTdHJpbmcuZnJvbUNoYXJDb2RlKCBoaWdoICsgMHgxMDAwMCApIDpcblx0XHRcdFx0Ly8gU3VwcGxlbWVudGFsIFBsYW5lIGNvZGVwb2ludCAoc3Vycm9nYXRlIHBhaXIpXG5cdFx0XHRcdFN0cmluZy5mcm9tQ2hhckNvZGUoIGhpZ2ggPj4gMTAgfCAweEQ4MDAsIGhpZ2ggJiAweDNGRiB8IDB4REMwMCApO1xuXHR9LFxuXG5cdC8vIFVzZWQgZm9yIGlmcmFtZXNcblx0Ly8gU2VlIHNldERvY3VtZW50KClcblx0Ly8gUmVtb3ZpbmcgdGhlIGZ1bmN0aW9uIHdyYXBwZXIgY2F1c2VzIGEgXCJQZXJtaXNzaW9uIERlbmllZFwiXG5cdC8vIGVycm9yIGluIElFXG5cdHVubG9hZEhhbmRsZXIgPSBmdW5jdGlvbigpIHtcblx0XHRzZXREb2N1bWVudCgpO1xuXHR9O1xuXG4vLyBPcHRpbWl6ZSBmb3IgcHVzaC5hcHBseSggXywgTm9kZUxpc3QgKVxudHJ5IHtcblx0cHVzaC5hcHBseShcblx0XHQoYXJyID0gc2xpY2UuY2FsbCggcHJlZmVycmVkRG9jLmNoaWxkTm9kZXMgKSksXG5cdFx0cHJlZmVycmVkRG9jLmNoaWxkTm9kZXNcblx0KTtcblx0Ly8gU3VwcG9ydDogQW5kcm9pZDw0LjBcblx0Ly8gRGV0ZWN0IHNpbGVudGx5IGZhaWxpbmcgcHVzaC5hcHBseVxuXHRhcnJbIHByZWZlcnJlZERvYy5jaGlsZE5vZGVzLmxlbmd0aCBdLm5vZGVUeXBlO1xufSBjYXRjaCAoIGUgKSB7XG5cdHB1c2ggPSB7IGFwcGx5OiBhcnIubGVuZ3RoID9cblxuXHRcdC8vIExldmVyYWdlIHNsaWNlIGlmIHBvc3NpYmxlXG5cdFx0ZnVuY3Rpb24oIHRhcmdldCwgZWxzICkge1xuXHRcdFx0cHVzaF9uYXRpdmUuYXBwbHkoIHRhcmdldCwgc2xpY2UuY2FsbChlbHMpICk7XG5cdFx0fSA6XG5cblx0XHQvLyBTdXBwb3J0OiBJRTw5XG5cdFx0Ly8gT3RoZXJ3aXNlIGFwcGVuZCBkaXJlY3RseVxuXHRcdGZ1bmN0aW9uKCB0YXJnZXQsIGVscyApIHtcblx0XHRcdHZhciBqID0gdGFyZ2V0Lmxlbmd0aCxcblx0XHRcdFx0aSA9IDA7XG5cdFx0XHQvLyBDYW4ndCB0cnVzdCBOb2RlTGlzdC5sZW5ndGhcblx0XHRcdHdoaWxlICggKHRhcmdldFtqKytdID0gZWxzW2krK10pICkge31cblx0XHRcdHRhcmdldC5sZW5ndGggPSBqIC0gMTtcblx0XHR9XG5cdH07XG59XG5cbmZ1bmN0aW9uIFNpenpsZSggc2VsZWN0b3IsIGNvbnRleHQsIHJlc3VsdHMsIHNlZWQgKSB7XG5cdHZhciBtLCBpLCBlbGVtLCBuaWQsIG5pZHNlbGVjdCwgbWF0Y2gsIGdyb3VwcywgbmV3U2VsZWN0b3IsXG5cdFx0bmV3Q29udGV4dCA9IGNvbnRleHQgJiYgY29udGV4dC5vd25lckRvY3VtZW50LFxuXG5cdFx0Ly8gbm9kZVR5cGUgZGVmYXVsdHMgdG8gOSwgc2luY2UgY29udGV4dCBkZWZhdWx0cyB0byBkb2N1bWVudFxuXHRcdG5vZGVUeXBlID0gY29udGV4dCA/IGNvbnRleHQubm9kZVR5cGUgOiA5O1xuXG5cdHJlc3VsdHMgPSByZXN1bHRzIHx8IFtdO1xuXG5cdC8vIFJldHVybiBlYXJseSBmcm9tIGNhbGxzIHdpdGggaW52YWxpZCBzZWxlY3RvciBvciBjb250ZXh0XG5cdGlmICggdHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiIHx8ICFzZWxlY3RvciB8fFxuXHRcdG5vZGVUeXBlICE9PSAxICYmIG5vZGVUeXBlICE9PSA5ICYmIG5vZGVUeXBlICE9PSAxMSApIHtcblxuXHRcdHJldHVybiByZXN1bHRzO1xuXHR9XG5cblx0Ly8gVHJ5IHRvIHNob3J0Y3V0IGZpbmQgb3BlcmF0aW9ucyAoYXMgb3Bwb3NlZCB0byBmaWx0ZXJzKSBpbiBIVE1MIGRvY3VtZW50c1xuXHRpZiAoICFzZWVkICkge1xuXG5cdFx0aWYgKCAoIGNvbnRleHQgPyBjb250ZXh0Lm93bmVyRG9jdW1lbnQgfHwgY29udGV4dCA6IHByZWZlcnJlZERvYyApICE9PSBkb2N1bWVudCApIHtcblx0XHRcdHNldERvY3VtZW50KCBjb250ZXh0ICk7XG5cdFx0fVxuXHRcdGNvbnRleHQgPSBjb250ZXh0IHx8IGRvY3VtZW50O1xuXG5cdFx0aWYgKCBkb2N1bWVudElzSFRNTCApIHtcblxuXHRcdFx0Ly8gSWYgdGhlIHNlbGVjdG9yIGlzIHN1ZmZpY2llbnRseSBzaW1wbGUsIHRyeSB1c2luZyBhIFwiZ2V0KkJ5KlwiIERPTSBtZXRob2Rcblx0XHRcdC8vIChleGNlcHRpbmcgRG9jdW1lbnRGcmFnbWVudCBjb250ZXh0LCB3aGVyZSB0aGUgbWV0aG9kcyBkb24ndCBleGlzdClcblx0XHRcdGlmICggbm9kZVR5cGUgIT09IDExICYmIChtYXRjaCA9IHJxdWlja0V4cHIuZXhlYyggc2VsZWN0b3IgKSkgKSB7XG5cblx0XHRcdFx0Ly8gSUQgc2VsZWN0b3Jcblx0XHRcdFx0aWYgKCAobSA9IG1hdGNoWzFdKSApIHtcblxuXHRcdFx0XHRcdC8vIERvY3VtZW50IGNvbnRleHRcblx0XHRcdFx0XHRpZiAoIG5vZGVUeXBlID09PSA5ICkge1xuXHRcdFx0XHRcdFx0aWYgKCAoZWxlbSA9IGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQoIG0gKSkgKSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUsIE9wZXJhLCBXZWJraXRcblx0XHRcdFx0XHRcdFx0Ly8gVE9ETzogaWRlbnRpZnkgdmVyc2lvbnNcblx0XHRcdFx0XHRcdFx0Ly8gZ2V0RWxlbWVudEJ5SWQgY2FuIG1hdGNoIGVsZW1lbnRzIGJ5IG5hbWUgaW5zdGVhZCBvZiBJRFxuXHRcdFx0XHRcdFx0XHRpZiAoIGVsZW0uaWQgPT09IG0gKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRWxlbWVudCBjb250ZXh0XG5cdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUsIE9wZXJhLCBXZWJraXRcblx0XHRcdFx0XHRcdC8vIFRPRE86IGlkZW50aWZ5IHZlcnNpb25zXG5cdFx0XHRcdFx0XHQvLyBnZXRFbGVtZW50QnlJZCBjYW4gbWF0Y2ggZWxlbWVudHMgYnkgbmFtZSBpbnN0ZWFkIG9mIElEXG5cdFx0XHRcdFx0XHRpZiAoIG5ld0NvbnRleHQgJiYgKGVsZW0gPSBuZXdDb250ZXh0LmdldEVsZW1lbnRCeUlkKCBtICkpICYmXG5cdFx0XHRcdFx0XHRcdGNvbnRhaW5zKCBjb250ZXh0LCBlbGVtICkgJiZcblx0XHRcdFx0XHRcdFx0ZWxlbS5pZCA9PT0gbSApIHtcblxuXHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFR5cGUgc2VsZWN0b3Jcblx0XHRcdFx0fSBlbHNlIGlmICggbWF0Y2hbMl0gKSB7XG5cdFx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSggc2VsZWN0b3IgKSApO1xuXHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXG5cdFx0XHRcdC8vIENsYXNzIHNlbGVjdG9yXG5cdFx0XHRcdH0gZWxzZSBpZiAoIChtID0gbWF0Y2hbM10pICYmIHN1cHBvcnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSAmJlxuXHRcdFx0XHRcdGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSApIHtcblxuXHRcdFx0XHRcdHB1c2guYXBwbHkoIHJlc3VsdHMsIGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggbSApICk7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gVGFrZSBhZHZhbnRhZ2Ugb2YgcXVlcnlTZWxlY3RvckFsbFxuXHRcdFx0aWYgKCBzdXBwb3J0LnFzYSAmJlxuXHRcdFx0XHQhY29tcGlsZXJDYWNoZVsgc2VsZWN0b3IgKyBcIiBcIiBdICYmXG5cdFx0XHRcdCghcmJ1Z2d5UVNBIHx8ICFyYnVnZ3lRU0EudGVzdCggc2VsZWN0b3IgKSkgKSB7XG5cblx0XHRcdFx0aWYgKCBub2RlVHlwZSAhPT0gMSApIHtcblx0XHRcdFx0XHRuZXdDb250ZXh0ID0gY29udGV4dDtcblx0XHRcdFx0XHRuZXdTZWxlY3RvciA9IHNlbGVjdG9yO1xuXG5cdFx0XHRcdC8vIHFTQSBsb29rcyBvdXRzaWRlIEVsZW1lbnQgY29udGV4dCwgd2hpY2ggaXMgbm90IHdoYXQgd2Ugd2FudFxuXHRcdFx0XHQvLyBUaGFua3MgdG8gQW5kcmV3IER1cG9udCBmb3IgdGhpcyB3b3JrYXJvdW5kIHRlY2huaXF1ZVxuXHRcdFx0XHQvLyBTdXBwb3J0OiBJRSA8PThcblx0XHRcdFx0Ly8gRXhjbHVkZSBvYmplY3QgZWxlbWVudHNcblx0XHRcdFx0fSBlbHNlIGlmICggY29udGV4dC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9PSBcIm9iamVjdFwiICkge1xuXG5cdFx0XHRcdFx0Ly8gQ2FwdHVyZSB0aGUgY29udGV4dCBJRCwgc2V0dGluZyBpdCBmaXJzdCBpZiBuZWNlc3Nhcnlcblx0XHRcdFx0XHRpZiAoIChuaWQgPSBjb250ZXh0LmdldEF0dHJpYnV0ZSggXCJpZFwiICkpICkge1xuXHRcdFx0XHRcdFx0bmlkID0gbmlkLnJlcGxhY2UoIHJlc2NhcGUsIFwiXFxcXCQmXCIgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29udGV4dC5zZXRBdHRyaWJ1dGUoIFwiaWRcIiwgKG5pZCA9IGV4cGFuZG8pICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gUHJlZml4IGV2ZXJ5IHNlbGVjdG9yIGluIHRoZSBsaXN0XG5cdFx0XHRcdFx0Z3JvdXBzID0gdG9rZW5pemUoIHNlbGVjdG9yICk7XG5cdFx0XHRcdFx0aSA9IGdyb3Vwcy5sZW5ndGg7XG5cdFx0XHRcdFx0bmlkc2VsZWN0ID0gcmlkZW50aWZpZXIudGVzdCggbmlkICkgPyBcIiNcIiArIG5pZCA6IFwiW2lkPSdcIiArIG5pZCArIFwiJ11cIjtcblx0XHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRcdGdyb3Vwc1tpXSA9IG5pZHNlbGVjdCArIFwiIFwiICsgdG9TZWxlY3RvciggZ3JvdXBzW2ldICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5ld1NlbGVjdG9yID0gZ3JvdXBzLmpvaW4oIFwiLFwiICk7XG5cblx0XHRcdFx0XHQvLyBFeHBhbmQgY29udGV4dCBmb3Igc2libGluZyBzZWxlY3RvcnNcblx0XHRcdFx0XHRuZXdDb250ZXh0ID0gcnNpYmxpbmcudGVzdCggc2VsZWN0b3IgKSAmJiB0ZXN0Q29udGV4dCggY29udGV4dC5wYXJlbnROb2RlICkgfHxcblx0XHRcdFx0XHRcdGNvbnRleHQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIG5ld1NlbGVjdG9yICkge1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRwdXNoLmFwcGx5KCByZXN1bHRzLFxuXHRcdFx0XHRcdFx0XHRuZXdDb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoIG5ld1NlbGVjdG9yIClcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHRcdFx0XHR9IGNhdGNoICggcXNhRXJyb3IgKSB7XG5cdFx0XHRcdFx0fSBmaW5hbGx5IHtcblx0XHRcdFx0XHRcdGlmICggbmlkID09PSBleHBhbmRvICkge1xuXHRcdFx0XHRcdFx0XHRjb250ZXh0LnJlbW92ZUF0dHJpYnV0ZSggXCJpZFwiICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gQWxsIG90aGVyc1xuXHRyZXR1cm4gc2VsZWN0KCBzZWxlY3Rvci5yZXBsYWNlKCBydHJpbSwgXCIkMVwiICksIGNvbnRleHQsIHJlc3VsdHMsIHNlZWQgKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUga2V5LXZhbHVlIGNhY2hlcyBvZiBsaW1pdGVkIHNpemVcbiAqIEByZXR1cm5zIHtmdW5jdGlvbihzdHJpbmcsIG9iamVjdCl9IFJldHVybnMgdGhlIE9iamVjdCBkYXRhIGFmdGVyIHN0b3JpbmcgaXQgb24gaXRzZWxmIHdpdGhcbiAqXHRwcm9wZXJ0eSBuYW1lIHRoZSAoc3BhY2Utc3VmZml4ZWQpIHN0cmluZyBhbmQgKGlmIHRoZSBjYWNoZSBpcyBsYXJnZXIgdGhhbiBFeHByLmNhY2hlTGVuZ3RoKVxuICpcdGRlbGV0aW5nIHRoZSBvbGRlc3QgZW50cnlcbiAqL1xuZnVuY3Rpb24gY3JlYXRlQ2FjaGUoKSB7XG5cdHZhciBrZXlzID0gW107XG5cblx0ZnVuY3Rpb24gY2FjaGUoIGtleSwgdmFsdWUgKSB7XG5cdFx0Ly8gVXNlIChrZXkgKyBcIiBcIikgdG8gYXZvaWQgY29sbGlzaW9uIHdpdGggbmF0aXZlIHByb3RvdHlwZSBwcm9wZXJ0aWVzIChzZWUgSXNzdWUgIzE1Nylcblx0XHRpZiAoIGtleXMucHVzaCgga2V5ICsgXCIgXCIgKSA+IEV4cHIuY2FjaGVMZW5ndGggKSB7XG5cdFx0XHQvLyBPbmx5IGtlZXAgdGhlIG1vc3QgcmVjZW50IGVudHJpZXNcblx0XHRcdGRlbGV0ZSBjYWNoZVsga2V5cy5zaGlmdCgpIF07XG5cdFx0fVxuXHRcdHJldHVybiAoY2FjaGVbIGtleSArIFwiIFwiIF0gPSB2YWx1ZSk7XG5cdH1cblx0cmV0dXJuIGNhY2hlO1xufVxuXG4vKipcbiAqIE1hcmsgYSBmdW5jdGlvbiBmb3Igc3BlY2lhbCB1c2UgYnkgU2l6emxlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gbWFya1xuICovXG5mdW5jdGlvbiBtYXJrRnVuY3Rpb24oIGZuICkge1xuXHRmblsgZXhwYW5kbyBdID0gdHJ1ZTtcblx0cmV0dXJuIGZuO1xufVxuXG4vKipcbiAqIFN1cHBvcnQgdGVzdGluZyB1c2luZyBhbiBlbGVtZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBQYXNzZWQgdGhlIGNyZWF0ZWQgZGl2IGFuZCBleHBlY3RzIGEgYm9vbGVhbiByZXN1bHRcbiAqL1xuZnVuY3Rpb24gYXNzZXJ0KCBmbiApIHtcblx0dmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cblx0dHJ5IHtcblx0XHRyZXR1cm4gISFmbiggZGl2ICk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0gZmluYWxseSB7XG5cdFx0Ly8gUmVtb3ZlIGZyb20gaXRzIHBhcmVudCBieSBkZWZhdWx0XG5cdFx0aWYgKCBkaXYucGFyZW50Tm9kZSApIHtcblx0XHRcdGRpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCBkaXYgKTtcblx0XHR9XG5cdFx0Ly8gcmVsZWFzZSBtZW1vcnkgaW4gSUVcblx0XHRkaXYgPSBudWxsO1xuXHR9XG59XG5cbi8qKlxuICogQWRkcyB0aGUgc2FtZSBoYW5kbGVyIGZvciBhbGwgb2YgdGhlIHNwZWNpZmllZCBhdHRyc1xuICogQHBhcmFtIHtTdHJpbmd9IGF0dHJzIFBpcGUtc2VwYXJhdGVkIGxpc3Qgb2YgYXR0cmlidXRlc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlciBUaGUgbWV0aG9kIHRoYXQgd2lsbCBiZSBhcHBsaWVkXG4gKi9cbmZ1bmN0aW9uIGFkZEhhbmRsZSggYXR0cnMsIGhhbmRsZXIgKSB7XG5cdHZhciBhcnIgPSBhdHRycy5zcGxpdChcInxcIiksXG5cdFx0aSA9IGFyci5sZW5ndGg7XG5cblx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0RXhwci5hdHRySGFuZGxlWyBhcnJbaV0gXSA9IGhhbmRsZXI7XG5cdH1cbn1cblxuLyoqXG4gKiBDaGVja3MgZG9jdW1lbnQgb3JkZXIgb2YgdHdvIHNpYmxpbmdzXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGFcbiAqIEBwYXJhbSB7RWxlbWVudH0gYlxuICogQHJldHVybnMge051bWJlcn0gUmV0dXJucyBsZXNzIHRoYW4gMCBpZiBhIHByZWNlZGVzIGIsIGdyZWF0ZXIgdGhhbiAwIGlmIGEgZm9sbG93cyBiXG4gKi9cbmZ1bmN0aW9uIHNpYmxpbmdDaGVjayggYSwgYiApIHtcblx0dmFyIGN1ciA9IGIgJiYgYSxcblx0XHRkaWZmID0gY3VyICYmIGEubm9kZVR5cGUgPT09IDEgJiYgYi5ub2RlVHlwZSA9PT0gMSAmJlxuXHRcdFx0KCB+Yi5zb3VyY2VJbmRleCB8fCBNQVhfTkVHQVRJVkUgKSAtXG5cdFx0XHQoIH5hLnNvdXJjZUluZGV4IHx8IE1BWF9ORUdBVElWRSApO1xuXG5cdC8vIFVzZSBJRSBzb3VyY2VJbmRleCBpZiBhdmFpbGFibGUgb24gYm90aCBub2Rlc1xuXHRpZiAoIGRpZmYgKSB7XG5cdFx0cmV0dXJuIGRpZmY7XG5cdH1cblxuXHQvLyBDaGVjayBpZiBiIGZvbGxvd3MgYVxuXHRpZiAoIGN1ciApIHtcblx0XHR3aGlsZSAoIChjdXIgPSBjdXIubmV4dFNpYmxpbmcpICkge1xuXHRcdFx0aWYgKCBjdXIgPT09IGIgKSB7XG5cdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gYSA/IDEgOiAtMTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gdXNlIGluIHBzZXVkb3MgZm9yIGlucHV0IHR5cGVzXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICovXG5mdW5jdGlvbiBjcmVhdGVJbnB1dFBzZXVkbyggdHlwZSApIHtcblx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHZhciBuYW1lID0gZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcdHJldHVybiBuYW1lID09PSBcImlucHV0XCIgJiYgZWxlbS50eXBlID09PSB0eXBlO1xuXHR9O1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0byB1c2UgaW4gcHNldWRvcyBmb3IgYnV0dG9uc1xuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqL1xuZnVuY3Rpb24gY3JlYXRlQnV0dG9uUHNldWRvKCB0eXBlICkge1xuXHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0dmFyIG5hbWUgPSBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0cmV0dXJuIChuYW1lID09PSBcImlucHV0XCIgfHwgbmFtZSA9PT0gXCJidXR0b25cIikgJiYgZWxlbS50eXBlID09PSB0eXBlO1xuXHR9O1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0byB1c2UgaW4gcHNldWRvcyBmb3IgcG9zaXRpb25hbHNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZuICkge1xuXHRyZXR1cm4gbWFya0Z1bmN0aW9uKGZ1bmN0aW9uKCBhcmd1bWVudCApIHtcblx0XHRhcmd1bWVudCA9ICthcmd1bWVudDtcblx0XHRyZXR1cm4gbWFya0Z1bmN0aW9uKGZ1bmN0aW9uKCBzZWVkLCBtYXRjaGVzICkge1xuXHRcdFx0dmFyIGosXG5cdFx0XHRcdG1hdGNoSW5kZXhlcyA9IGZuKCBbXSwgc2VlZC5sZW5ndGgsIGFyZ3VtZW50ICksXG5cdFx0XHRcdGkgPSBtYXRjaEluZGV4ZXMubGVuZ3RoO1xuXG5cdFx0XHQvLyBNYXRjaCBlbGVtZW50cyBmb3VuZCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4ZXNcblx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRpZiAoIHNlZWRbIChqID0gbWF0Y2hJbmRleGVzW2ldKSBdICkge1xuXHRcdFx0XHRcdHNlZWRbal0gPSAhKG1hdGNoZXNbal0gPSBzZWVkW2pdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcbn1cblxuLyoqXG4gKiBDaGVja3MgYSBub2RlIGZvciB2YWxpZGl0eSBhcyBhIFNpenpsZSBjb250ZXh0XG4gKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0PX0gY29udGV4dFxuICogQHJldHVybnMge0VsZW1lbnR8T2JqZWN0fEJvb2xlYW59IFRoZSBpbnB1dCBub2RlIGlmIGFjY2VwdGFibGUsIG90aGVyd2lzZSBhIGZhbHN5IHZhbHVlXG4gKi9cbmZ1bmN0aW9uIHRlc3RDb250ZXh0KCBjb250ZXh0ICkge1xuXHRyZXR1cm4gY29udGV4dCAmJiB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb250ZXh0O1xufVxuXG4vLyBFeHBvc2Ugc3VwcG9ydCB2YXJzIGZvciBjb252ZW5pZW5jZVxuc3VwcG9ydCA9IFNpenpsZS5zdXBwb3J0ID0ge307XG5cbi8qKlxuICogRGV0ZWN0cyBYTUwgbm9kZXNcbiAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IGVsZW0gQW4gZWxlbWVudCBvciBhIGRvY3VtZW50XG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZmYgZWxlbSBpcyBhIG5vbi1IVE1MIFhNTCBub2RlXG4gKi9cbmlzWE1MID0gU2l6emxlLmlzWE1MID0gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdC8vIGRvY3VtZW50RWxlbWVudCBpcyB2ZXJpZmllZCBmb3IgY2FzZXMgd2hlcmUgaXQgZG9lc24ndCB5ZXQgZXhpc3Rcblx0Ly8gKHN1Y2ggYXMgbG9hZGluZyBpZnJhbWVzIGluIElFIC0gIzQ4MzMpXG5cdHZhciBkb2N1bWVudEVsZW1lbnQgPSBlbGVtICYmIChlbGVtLm93bmVyRG9jdW1lbnQgfHwgZWxlbSkuZG9jdW1lbnRFbGVtZW50O1xuXHRyZXR1cm4gZG9jdW1lbnRFbGVtZW50ID8gZG9jdW1lbnRFbGVtZW50Lm5vZGVOYW1lICE9PSBcIkhUTUxcIiA6IGZhbHNlO1xufTtcblxuLyoqXG4gKiBTZXRzIGRvY3VtZW50LXJlbGF0ZWQgdmFyaWFibGVzIG9uY2UgYmFzZWQgb24gdGhlIGN1cnJlbnQgZG9jdW1lbnRcbiAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IFtkb2NdIEFuIGVsZW1lbnQgb3IgZG9jdW1lbnQgb2JqZWN0IHRvIHVzZSB0byBzZXQgdGhlIGRvY3VtZW50XG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjdXJyZW50IGRvY3VtZW50XG4gKi9cbnNldERvY3VtZW50ID0gU2l6emxlLnNldERvY3VtZW50ID0gZnVuY3Rpb24oIG5vZGUgKSB7XG5cdHZhciBoYXNDb21wYXJlLCBwYXJlbnQsXG5cdFx0ZG9jID0gbm9kZSA/IG5vZGUub3duZXJEb2N1bWVudCB8fCBub2RlIDogcHJlZmVycmVkRG9jO1xuXG5cdC8vIFJldHVybiBlYXJseSBpZiBkb2MgaXMgaW52YWxpZCBvciBhbHJlYWR5IHNlbGVjdGVkXG5cdGlmICggZG9jID09PSBkb2N1bWVudCB8fCBkb2Mubm9kZVR5cGUgIT09IDkgfHwgIWRvYy5kb2N1bWVudEVsZW1lbnQgKSB7XG5cdFx0cmV0dXJuIGRvY3VtZW50O1xuXHR9XG5cblx0Ly8gVXBkYXRlIGdsb2JhbCB2YXJpYWJsZXNcblx0ZG9jdW1lbnQgPSBkb2M7XG5cdGRvY0VsZW0gPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cdGRvY3VtZW50SXNIVE1MID0gIWlzWE1MKCBkb2N1bWVudCApO1xuXG5cdC8vIFN1cHBvcnQ6IElFIDktMTEsIEVkZ2Vcblx0Ly8gQWNjZXNzaW5nIGlmcmFtZSBkb2N1bWVudHMgYWZ0ZXIgdW5sb2FkIHRocm93cyBcInBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3JzIChqUXVlcnkgIzEzOTM2KVxuXHRpZiAoIChwYXJlbnQgPSBkb2N1bWVudC5kZWZhdWx0VmlldykgJiYgcGFyZW50LnRvcCAhPT0gcGFyZW50ICkge1xuXHRcdC8vIFN1cHBvcnQ6IElFIDExXG5cdFx0aWYgKCBwYXJlbnQuYWRkRXZlbnRMaXN0ZW5lciApIHtcblx0XHRcdHBhcmVudC5hZGRFdmVudExpc3RlbmVyKCBcInVubG9hZFwiLCB1bmxvYWRIYW5kbGVyLCBmYWxzZSApO1xuXG5cdFx0Ly8gU3VwcG9ydDogSUUgOSAtIDEwIG9ubHlcblx0XHR9IGVsc2UgaWYgKCBwYXJlbnQuYXR0YWNoRXZlbnQgKSB7XG5cdFx0XHRwYXJlbnQuYXR0YWNoRXZlbnQoIFwib251bmxvYWRcIiwgdW5sb2FkSGFuZGxlciApO1xuXHRcdH1cblx0fVxuXG5cdC8qIEF0dHJpYnV0ZXNcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5cdC8vIFN1cHBvcnQ6IElFPDhcblx0Ly8gVmVyaWZ5IHRoYXQgZ2V0QXR0cmlidXRlIHJlYWxseSByZXR1cm5zIGF0dHJpYnV0ZXMgYW5kIG5vdCBwcm9wZXJ0aWVzXG5cdC8vIChleGNlcHRpbmcgSUU4IGJvb2xlYW5zKVxuXHRzdXBwb3J0LmF0dHJpYnV0ZXMgPSBhc3NlcnQoZnVuY3Rpb24oIGRpdiApIHtcblx0XHRkaXYuY2xhc3NOYW1lID0gXCJpXCI7XG5cdFx0cmV0dXJuICFkaXYuZ2V0QXR0cmlidXRlKFwiY2xhc3NOYW1lXCIpO1xuXHR9KTtcblxuXHQvKiBnZXRFbGVtZW50KHMpQnkqXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXHQvLyBDaGVjayBpZiBnZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIikgcmV0dXJucyBvbmx5IGVsZW1lbnRzXG5cdHN1cHBvcnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUgPSBhc3NlcnQoZnVuY3Rpb24oIGRpdiApIHtcblx0XHRkaXYuYXBwZW5kQ2hpbGQoIGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoXCJcIikgKTtcblx0XHRyZXR1cm4gIWRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIikubGVuZ3RoO1xuXHR9KTtcblxuXHQvLyBTdXBwb3J0OiBJRTw5XG5cdHN1cHBvcnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSA9IHJuYXRpdmUudGVzdCggZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSApO1xuXG5cdC8vIFN1cHBvcnQ6IElFPDEwXG5cdC8vIENoZWNrIGlmIGdldEVsZW1lbnRCeUlkIHJldHVybnMgZWxlbWVudHMgYnkgbmFtZVxuXHQvLyBUaGUgYnJva2VuIGdldEVsZW1lbnRCeUlkIG1ldGhvZHMgZG9uJ3QgcGljayB1cCBwcm9ncmFtYXRpY2FsbHktc2V0IG5hbWVzLFxuXHQvLyBzbyB1c2UgYSByb3VuZGFib3V0IGdldEVsZW1lbnRzQnlOYW1lIHRlc3Rcblx0c3VwcG9ydC5nZXRCeUlkID0gYXNzZXJ0KGZ1bmN0aW9uKCBkaXYgKSB7XG5cdFx0ZG9jRWxlbS5hcHBlbmRDaGlsZCggZGl2ICkuaWQgPSBleHBhbmRvO1xuXHRcdHJldHVybiAhZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUgfHwgIWRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCBleHBhbmRvICkubGVuZ3RoO1xuXHR9KTtcblxuXHQvLyBJRCBmaW5kIGFuZCBmaWx0ZXJcblx0aWYgKCBzdXBwb3J0LmdldEJ5SWQgKSB7XG5cdFx0RXhwci5maW5kW1wiSURcIl0gPSBmdW5jdGlvbiggaWQsIGNvbnRleHQgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiBjb250ZXh0LmdldEVsZW1lbnRCeUlkICE9PSBcInVuZGVmaW5lZFwiICYmIGRvY3VtZW50SXNIVE1MICkge1xuXHRcdFx0XHR2YXIgbSA9IGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQoIGlkICk7XG5cdFx0XHRcdHJldHVybiBtID8gWyBtIF0gOiBbXTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdEV4cHIuZmlsdGVyW1wiSURcIl0gPSBmdW5jdGlvbiggaWQgKSB7XG5cdFx0XHR2YXIgYXR0cklkID0gaWQucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKTtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0cmV0dXJuIGVsZW0uZ2V0QXR0cmlidXRlKFwiaWRcIikgPT09IGF0dHJJZDtcblx0XHRcdH07XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHQvLyBTdXBwb3J0OiBJRTYvN1xuXHRcdC8vIGdldEVsZW1lbnRCeUlkIGlzIG5vdCByZWxpYWJsZSBhcyBhIGZpbmQgc2hvcnRjdXRcblx0XHRkZWxldGUgRXhwci5maW5kW1wiSURcIl07XG5cblx0XHRFeHByLmZpbHRlcltcIklEXCJdID0gIGZ1bmN0aW9uKCBpZCApIHtcblx0XHRcdHZhciBhdHRySWQgPSBpZC5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHR2YXIgbm9kZSA9IHR5cGVvZiBlbGVtLmdldEF0dHJpYnV0ZU5vZGUgIT09IFwidW5kZWZpbmVkXCIgJiZcblx0XHRcdFx0XHRlbGVtLmdldEF0dHJpYnV0ZU5vZGUoXCJpZFwiKTtcblx0XHRcdFx0cmV0dXJuIG5vZGUgJiYgbm9kZS52YWx1ZSA9PT0gYXR0cklkO1xuXHRcdFx0fTtcblx0XHR9O1xuXHR9XG5cblx0Ly8gVGFnXG5cdEV4cHIuZmluZFtcIlRBR1wiXSA9IHN1cHBvcnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUgP1xuXHRcdGZ1bmN0aW9uKCB0YWcsIGNvbnRleHQgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lICE9PSBcInVuZGVmaW5lZFwiICkge1xuXHRcdFx0XHRyZXR1cm4gY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSggdGFnICk7XG5cblx0XHRcdC8vIERvY3VtZW50RnJhZ21lbnQgbm9kZXMgZG9uJ3QgaGF2ZSBnRUJUTlxuXHRcdFx0fSBlbHNlIGlmICggc3VwcG9ydC5xc2EgKSB7XG5cdFx0XHRcdHJldHVybiBjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoIHRhZyApO1xuXHRcdFx0fVxuXHRcdH0gOlxuXG5cdFx0ZnVuY3Rpb24oIHRhZywgY29udGV4dCApIHtcblx0XHRcdHZhciBlbGVtLFxuXHRcdFx0XHR0bXAgPSBbXSxcblx0XHRcdFx0aSA9IDAsXG5cdFx0XHRcdC8vIEJ5IGhhcHB5IGNvaW5jaWRlbmNlLCBhIChicm9rZW4pIGdFQlROIGFwcGVhcnMgb24gRG9jdW1lbnRGcmFnbWVudCBub2RlcyB0b29cblx0XHRcdFx0cmVzdWx0cyA9IGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIHRhZyApO1xuXG5cdFx0XHQvLyBGaWx0ZXIgb3V0IHBvc3NpYmxlIGNvbW1lbnRzXG5cdFx0XHRpZiAoIHRhZyA9PT0gXCIqXCIgKSB7XG5cdFx0XHRcdHdoaWxlICggKGVsZW0gPSByZXN1bHRzW2krK10pICkge1xuXHRcdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSApIHtcblx0XHRcdFx0XHRcdHRtcC5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRtcDtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdH07XG5cblx0Ly8gQ2xhc3Ncblx0RXhwci5maW5kW1wiQ0xBU1NcIl0gPSBzdXBwb3J0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgJiYgZnVuY3Rpb24oIGNsYXNzTmFtZSwgY29udGV4dCApIHtcblx0XHRpZiAoIHR5cGVvZiBjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgIT09IFwidW5kZWZpbmVkXCIgJiYgZG9jdW1lbnRJc0hUTUwgKSB7XG5cdFx0XHRyZXR1cm4gY29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBjbGFzc05hbWUgKTtcblx0XHR9XG5cdH07XG5cblx0LyogUVNBL21hdGNoZXNTZWxlY3RvclxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblx0Ly8gUVNBIGFuZCBtYXRjaGVzU2VsZWN0b3Igc3VwcG9ydFxuXG5cdC8vIG1hdGNoZXNTZWxlY3Rvcig6YWN0aXZlKSByZXBvcnRzIGZhbHNlIHdoZW4gdHJ1ZSAoSUU5L09wZXJhIDExLjUpXG5cdHJidWdneU1hdGNoZXMgPSBbXTtcblxuXHQvLyBxU2EoOmZvY3VzKSByZXBvcnRzIGZhbHNlIHdoZW4gdHJ1ZSAoQ2hyb21lIDIxKVxuXHQvLyBXZSBhbGxvdyB0aGlzIGJlY2F1c2Ugb2YgYSBidWcgaW4gSUU4LzkgdGhhdCB0aHJvd3MgYW4gZXJyb3Jcblx0Ly8gd2hlbmV2ZXIgYGRvY3VtZW50LmFjdGl2ZUVsZW1lbnRgIGlzIGFjY2Vzc2VkIG9uIGFuIGlmcmFtZVxuXHQvLyBTbywgd2UgYWxsb3cgOmZvY3VzIHRvIHBhc3MgdGhyb3VnaCBRU0EgYWxsIHRoZSB0aW1lIHRvIGF2b2lkIHRoZSBJRSBlcnJvclxuXHQvLyBTZWUgaHR0cDovL2J1Z3MuanF1ZXJ5LmNvbS90aWNrZXQvMTMzNzhcblx0cmJ1Z2d5UVNBID0gW107XG5cblx0aWYgKCAoc3VwcG9ydC5xc2EgPSBybmF0aXZlLnRlc3QoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwgKSkgKSB7XG5cdFx0Ly8gQnVpbGQgUVNBIHJlZ2V4XG5cdFx0Ly8gUmVnZXggc3RyYXRlZ3kgYWRvcHRlZCBmcm9tIERpZWdvIFBlcmluaVxuXHRcdGFzc2VydChmdW5jdGlvbiggZGl2ICkge1xuXHRcdFx0Ly8gU2VsZWN0IGlzIHNldCB0byBlbXB0eSBzdHJpbmcgb24gcHVycG9zZVxuXHRcdFx0Ly8gVGhpcyBpcyB0byB0ZXN0IElFJ3MgdHJlYXRtZW50IG9mIG5vdCBleHBsaWNpdGx5XG5cdFx0XHQvLyBzZXR0aW5nIGEgYm9vbGVhbiBjb250ZW50IGF0dHJpYnV0ZSxcblx0XHRcdC8vIHNpbmNlIGl0cyBwcmVzZW5jZSBzaG91bGQgYmUgZW5vdWdoXG5cdFx0XHQvLyBodHRwOi8vYnVncy5qcXVlcnkuY29tL3RpY2tldC8xMjM1OVxuXHRcdFx0ZG9jRWxlbS5hcHBlbmRDaGlsZCggZGl2ICkuaW5uZXJIVE1MID0gXCI8YSBpZD0nXCIgKyBleHBhbmRvICsgXCInPjwvYT5cIiArXG5cdFx0XHRcdFwiPHNlbGVjdCBpZD0nXCIgKyBleHBhbmRvICsgXCItXFxyXFxcXCcgbXNhbGxvd2NhcHR1cmU9Jyc+XCIgK1xuXHRcdFx0XHRcIjxvcHRpb24gc2VsZWN0ZWQ9Jyc+PC9vcHRpb24+PC9zZWxlY3Q+XCI7XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFOCwgT3BlcmEgMTEtMTIuMTZcblx0XHRcdC8vIE5vdGhpbmcgc2hvdWxkIGJlIHNlbGVjdGVkIHdoZW4gZW1wdHkgc3RyaW5ncyBmb2xsb3cgXj0gb3IgJD0gb3IgKj1cblx0XHRcdC8vIFRoZSB0ZXN0IGF0dHJpYnV0ZSBtdXN0IGJlIHVua25vd24gaW4gT3BlcmEgYnV0IFwic2FmZVwiIGZvciBXaW5SVFxuXHRcdFx0Ly8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2hoNDY1Mzg4LmFzcHgjYXR0cmlidXRlX3NlY3Rpb25cblx0XHRcdGlmICggZGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbbXNhbGxvd2NhcHR1cmVePScnXVwiKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIlsqXiRdPVwiICsgd2hpdGVzcGFjZSArIFwiKig/OicnfFxcXCJcXFwiKVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFOFxuXHRcdFx0Ly8gQm9vbGVhbiBhdHRyaWJ1dGVzIGFuZCBcInZhbHVlXCIgYXJlIG5vdCB0cmVhdGVkIGNvcnJlY3RseVxuXHRcdFx0aWYgKCAhZGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbc2VsZWN0ZWRdXCIpLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiXFxcXFtcIiArIHdoaXRlc3BhY2UgKyBcIiooPzp2YWx1ZXxcIiArIGJvb2xlYW5zICsgXCIpXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogQ2hyb21lPDI5LCBBbmRyb2lkPDQuNCwgU2FmYXJpPDcuMCssIGlPUzw3LjArLCBQaGFudG9tSlM8MS45LjgrXG5cdFx0XHRpZiAoICFkaXYucXVlcnlTZWxlY3RvckFsbCggXCJbaWR+PVwiICsgZXhwYW5kbyArIFwiLV1cIiApLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goXCJ+PVwiKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gV2Via2l0L09wZXJhIC0gOmNoZWNrZWQgc2hvdWxkIHJldHVybiBzZWxlY3RlZCBvcHRpb24gZWxlbWVudHNcblx0XHRcdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMTEvUkVDLWNzczMtc2VsZWN0b3JzLTIwMTEwOTI5LyNjaGVja2VkXG5cdFx0XHQvLyBJRTggdGhyb3dzIGVycm9yIGhlcmUgYW5kIHdpbGwgbm90IHNlZSBsYXRlciB0ZXN0c1xuXHRcdFx0aWYgKCAhZGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCI6Y2hlY2tlZFwiKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKFwiOmNoZWNrZWRcIik7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IFNhZmFyaSA4KywgaU9TIDgrXG5cdFx0XHQvLyBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTM2ODUxXG5cdFx0XHQvLyBJbi1wYWdlIGBzZWxlY3RvciNpZCBzaWJpbmctY29tYmluYXRvciBzZWxlY3RvcmAgZmFpbHNcblx0XHRcdGlmICggIWRpdi5xdWVyeVNlbGVjdG9yQWxsKCBcImEjXCIgKyBleHBhbmRvICsgXCIrKlwiICkubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaChcIi4jLitbK35dXCIpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0YXNzZXJ0KGZ1bmN0aW9uKCBkaXYgKSB7XG5cdFx0XHQvLyBTdXBwb3J0OiBXaW5kb3dzIDggTmF0aXZlIEFwcHNcblx0XHRcdC8vIFRoZSB0eXBlIGFuZCBuYW1lIGF0dHJpYnV0ZXMgYXJlIHJlc3RyaWN0ZWQgZHVyaW5nIC5pbm5lckhUTUwgYXNzaWdubWVudFxuXHRcdFx0dmFyIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuXHRcdFx0aW5wdXQuc2V0QXR0cmlidXRlKCBcInR5cGVcIiwgXCJoaWRkZW5cIiApO1xuXHRcdFx0ZGl2LmFwcGVuZENoaWxkKCBpbnB1dCApLnNldEF0dHJpYnV0ZSggXCJuYW1lXCIsIFwiRFwiICk7XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFOFxuXHRcdFx0Ly8gRW5mb3JjZSBjYXNlLXNlbnNpdGl2aXR5IG9mIG5hbWUgYXR0cmlidXRlXG5cdFx0XHRpZiAoIGRpdi5xdWVyeVNlbGVjdG9yQWxsKFwiW25hbWU9ZF1cIikubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCJuYW1lXCIgKyB3aGl0ZXNwYWNlICsgXCIqWypeJHwhfl0/PVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZGIDMuNSAtIDplbmFibGVkLzpkaXNhYmxlZCBhbmQgaGlkZGVuIGVsZW1lbnRzIChoaWRkZW4gZWxlbWVudHMgYXJlIHN0aWxsIGVuYWJsZWQpXG5cdFx0XHQvLyBJRTggdGhyb3dzIGVycm9yIGhlcmUgYW5kIHdpbGwgbm90IHNlZSBsYXRlciB0ZXN0c1xuXHRcdFx0aWYgKCAhZGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCI6ZW5hYmxlZFwiKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIjplbmFibGVkXCIsIFwiOmRpc2FibGVkXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gT3BlcmEgMTAtMTEgZG9lcyBub3QgdGhyb3cgb24gcG9zdC1jb21tYSBpbnZhbGlkIHBzZXVkb3Ncblx0XHRcdGRpdi5xdWVyeVNlbGVjdG9yQWxsKFwiKiw6eFwiKTtcblx0XHRcdHJidWdneVFTQS5wdXNoKFwiLC4qOlwiKTtcblx0XHR9KTtcblx0fVxuXG5cdGlmICggKHN1cHBvcnQubWF0Y2hlc1NlbGVjdG9yID0gcm5hdGl2ZS50ZXN0KCAobWF0Y2hlcyA9IGRvY0VsZW0ubWF0Y2hlcyB8fFxuXHRcdGRvY0VsZW0ud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8XG5cdFx0ZG9jRWxlbS5tb3pNYXRjaGVzU2VsZWN0b3IgfHxcblx0XHRkb2NFbGVtLm9NYXRjaGVzU2VsZWN0b3IgfHxcblx0XHRkb2NFbGVtLm1zTWF0Y2hlc1NlbGVjdG9yKSApKSApIHtcblxuXHRcdGFzc2VydChmdW5jdGlvbiggZGl2ICkge1xuXHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIGl0J3MgcG9zc2libGUgdG8gZG8gbWF0Y2hlc1NlbGVjdG9yXG5cdFx0XHQvLyBvbiBhIGRpc2Nvbm5lY3RlZCBub2RlIChJRSA5KVxuXHRcdFx0c3VwcG9ydC5kaXNjb25uZWN0ZWRNYXRjaCA9IG1hdGNoZXMuY2FsbCggZGl2LCBcImRpdlwiICk7XG5cblx0XHRcdC8vIFRoaXMgc2hvdWxkIGZhaWwgd2l0aCBhbiBleGNlcHRpb25cblx0XHRcdC8vIEdlY2tvIGRvZXMgbm90IGVycm9yLCByZXR1cm5zIGZhbHNlIGluc3RlYWRcblx0XHRcdG1hdGNoZXMuY2FsbCggZGl2LCBcIltzIT0nJ106eFwiICk7XG5cdFx0XHRyYnVnZ3lNYXRjaGVzLnB1c2goIFwiIT1cIiwgcHNldWRvcyApO1xuXHRcdH0pO1xuXHR9XG5cblx0cmJ1Z2d5UVNBID0gcmJ1Z2d5UVNBLmxlbmd0aCAmJiBuZXcgUmVnRXhwKCByYnVnZ3lRU0Euam9pbihcInxcIikgKTtcblx0cmJ1Z2d5TWF0Y2hlcyA9IHJidWdneU1hdGNoZXMubGVuZ3RoICYmIG5ldyBSZWdFeHAoIHJidWdneU1hdGNoZXMuam9pbihcInxcIikgKTtcblxuXHQvKiBDb250YWluc1xuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cdGhhc0NvbXBhcmUgPSBybmF0aXZlLnRlc3QoIGRvY0VsZW0uY29tcGFyZURvY3VtZW50UG9zaXRpb24gKTtcblxuXHQvLyBFbGVtZW50IGNvbnRhaW5zIGFub3RoZXJcblx0Ly8gUHVycG9zZWZ1bGx5IHNlbGYtZXhjbHVzaXZlXG5cdC8vIEFzIGluLCBhbiBlbGVtZW50IGRvZXMgbm90IGNvbnRhaW4gaXRzZWxmXG5cdGNvbnRhaW5zID0gaGFzQ29tcGFyZSB8fCBybmF0aXZlLnRlc3QoIGRvY0VsZW0uY29udGFpbnMgKSA/XG5cdFx0ZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0XHR2YXIgYWRvd24gPSBhLm5vZGVUeXBlID09PSA5ID8gYS5kb2N1bWVudEVsZW1lbnQgOiBhLFxuXHRcdFx0XHRidXAgPSBiICYmIGIucGFyZW50Tm9kZTtcblx0XHRcdHJldHVybiBhID09PSBidXAgfHwgISEoIGJ1cCAmJiBidXAubm9kZVR5cGUgPT09IDEgJiYgKFxuXHRcdFx0XHRhZG93bi5jb250YWlucyA/XG5cdFx0XHRcdFx0YWRvd24uY29udGFpbnMoIGJ1cCApIDpcblx0XHRcdFx0XHRhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uICYmIGEuY29tcGFyZURvY3VtZW50UG9zaXRpb24oIGJ1cCApICYgMTZcblx0XHRcdCkpO1xuXHRcdH0gOlxuXHRcdGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdFx0aWYgKCBiICkge1xuXHRcdFx0XHR3aGlsZSAoIChiID0gYi5wYXJlbnROb2RlKSApIHtcblx0XHRcdFx0XHRpZiAoIGIgPT09IGEgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xuXG5cdC8qIFNvcnRpbmdcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5cdC8vIERvY3VtZW50IG9yZGVyIHNvcnRpbmdcblx0c29ydE9yZGVyID0gaGFzQ29tcGFyZSA/XG5cdGZ1bmN0aW9uKCBhLCBiICkge1xuXG5cdFx0Ly8gRmxhZyBmb3IgZHVwbGljYXRlIHJlbW92YWxcblx0XHRpZiAoIGEgPT09IGIgKSB7XG5cdFx0XHRoYXNEdXBsaWNhdGUgPSB0cnVlO1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXG5cdFx0Ly8gU29ydCBvbiBtZXRob2QgZXhpc3RlbmNlIGlmIG9ubHkgb25lIGlucHV0IGhhcyBjb21wYXJlRG9jdW1lbnRQb3NpdGlvblxuXHRcdHZhciBjb21wYXJlID0gIWEuY29tcGFyZURvY3VtZW50UG9zaXRpb24gLSAhYi5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbjtcblx0XHRpZiAoIGNvbXBhcmUgKSB7XG5cdFx0XHRyZXR1cm4gY29tcGFyZTtcblx0XHR9XG5cblx0XHQvLyBDYWxjdWxhdGUgcG9zaXRpb24gaWYgYm90aCBpbnB1dHMgYmVsb25nIHRvIHRoZSBzYW1lIGRvY3VtZW50XG5cdFx0Y29tcGFyZSA9ICggYS5vd25lckRvY3VtZW50IHx8IGEgKSA9PT0gKCBiLm93bmVyRG9jdW1lbnQgfHwgYiApID9cblx0XHRcdGEuY29tcGFyZURvY3VtZW50UG9zaXRpb24oIGIgKSA6XG5cblx0XHRcdC8vIE90aGVyd2lzZSB3ZSBrbm93IHRoZXkgYXJlIGRpc2Nvbm5lY3RlZFxuXHRcdFx0MTtcblxuXHRcdC8vIERpc2Nvbm5lY3RlZCBub2Rlc1xuXHRcdGlmICggY29tcGFyZSAmIDEgfHxcblx0XHRcdCghc3VwcG9ydC5zb3J0RGV0YWNoZWQgJiYgYi5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiggYSApID09PSBjb21wYXJlKSApIHtcblxuXHRcdFx0Ly8gQ2hvb3NlIHRoZSBmaXJzdCBlbGVtZW50IHRoYXQgaXMgcmVsYXRlZCB0byBvdXIgcHJlZmVycmVkIGRvY3VtZW50XG5cdFx0XHRpZiAoIGEgPT09IGRvY3VtZW50IHx8IGEub3duZXJEb2N1bWVudCA9PT0gcHJlZmVycmVkRG9jICYmIGNvbnRhaW5zKHByZWZlcnJlZERvYywgYSkgKSB7XG5cdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdH1cblx0XHRcdGlmICggYiA9PT0gZG9jdW1lbnQgfHwgYi5vd25lckRvY3VtZW50ID09PSBwcmVmZXJyZWREb2MgJiYgY29udGFpbnMocHJlZmVycmVkRG9jLCBiKSApIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cblx0XHRcdC8vIE1haW50YWluIG9yaWdpbmFsIG9yZGVyXG5cdFx0XHRyZXR1cm4gc29ydElucHV0ID9cblx0XHRcdFx0KCBpbmRleE9mKCBzb3J0SW5wdXQsIGEgKSAtIGluZGV4T2YoIHNvcnRJbnB1dCwgYiApICkgOlxuXHRcdFx0XHQwO1xuXHRcdH1cblxuXHRcdHJldHVybiBjb21wYXJlICYgNCA/IC0xIDogMTtcblx0fSA6XG5cdGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdC8vIEV4aXQgZWFybHkgaWYgdGhlIG5vZGVzIGFyZSBpZGVudGljYWxcblx0XHRpZiAoIGEgPT09IGIgKSB7XG5cdFx0XHRoYXNEdXBsaWNhdGUgPSB0cnVlO1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXG5cdFx0dmFyIGN1cixcblx0XHRcdGkgPSAwLFxuXHRcdFx0YXVwID0gYS5wYXJlbnROb2RlLFxuXHRcdFx0YnVwID0gYi5wYXJlbnROb2RlLFxuXHRcdFx0YXAgPSBbIGEgXSxcblx0XHRcdGJwID0gWyBiIF07XG5cblx0XHQvLyBQYXJlbnRsZXNzIG5vZGVzIGFyZSBlaXRoZXIgZG9jdW1lbnRzIG9yIGRpc2Nvbm5lY3RlZFxuXHRcdGlmICggIWF1cCB8fCAhYnVwICkge1xuXHRcdFx0cmV0dXJuIGEgPT09IGRvY3VtZW50ID8gLTEgOlxuXHRcdFx0XHRiID09PSBkb2N1bWVudCA/IDEgOlxuXHRcdFx0XHRhdXAgPyAtMSA6XG5cdFx0XHRcdGJ1cCA/IDEgOlxuXHRcdFx0XHRzb3J0SW5wdXQgP1xuXHRcdFx0XHQoIGluZGV4T2YoIHNvcnRJbnB1dCwgYSApIC0gaW5kZXhPZiggc29ydElucHV0LCBiICkgKSA6XG5cdFx0XHRcdDA7XG5cblx0XHQvLyBJZiB0aGUgbm9kZXMgYXJlIHNpYmxpbmdzLCB3ZSBjYW4gZG8gYSBxdWljayBjaGVja1xuXHRcdH0gZWxzZSBpZiAoIGF1cCA9PT0gYnVwICkge1xuXHRcdFx0cmV0dXJuIHNpYmxpbmdDaGVjayggYSwgYiApO1xuXHRcdH1cblxuXHRcdC8vIE90aGVyd2lzZSB3ZSBuZWVkIGZ1bGwgbGlzdHMgb2YgdGhlaXIgYW5jZXN0b3JzIGZvciBjb21wYXJpc29uXG5cdFx0Y3VyID0gYTtcblx0XHR3aGlsZSAoIChjdXIgPSBjdXIucGFyZW50Tm9kZSkgKSB7XG5cdFx0XHRhcC51bnNoaWZ0KCBjdXIgKTtcblx0XHR9XG5cdFx0Y3VyID0gYjtcblx0XHR3aGlsZSAoIChjdXIgPSBjdXIucGFyZW50Tm9kZSkgKSB7XG5cdFx0XHRicC51bnNoaWZ0KCBjdXIgKTtcblx0XHR9XG5cblx0XHQvLyBXYWxrIGRvd24gdGhlIHRyZWUgbG9va2luZyBmb3IgYSBkaXNjcmVwYW5jeVxuXHRcdHdoaWxlICggYXBbaV0gPT09IGJwW2ldICkge1xuXHRcdFx0aSsrO1xuXHRcdH1cblxuXHRcdHJldHVybiBpID9cblx0XHRcdC8vIERvIGEgc2libGluZyBjaGVjayBpZiB0aGUgbm9kZXMgaGF2ZSBhIGNvbW1vbiBhbmNlc3RvclxuXHRcdFx0c2libGluZ0NoZWNrKCBhcFtpXSwgYnBbaV0gKSA6XG5cblx0XHRcdC8vIE90aGVyd2lzZSBub2RlcyBpbiBvdXIgZG9jdW1lbnQgc29ydCBmaXJzdFxuXHRcdFx0YXBbaV0gPT09IHByZWZlcnJlZERvYyA/IC0xIDpcblx0XHRcdGJwW2ldID09PSBwcmVmZXJyZWREb2MgPyAxIDpcblx0XHRcdDA7XG5cdH07XG5cblx0cmV0dXJuIGRvY3VtZW50O1xufTtcblxuU2l6emxlLm1hdGNoZXMgPSBmdW5jdGlvbiggZXhwciwgZWxlbWVudHMgKSB7XG5cdHJldHVybiBTaXp6bGUoIGV4cHIsIG51bGwsIG51bGwsIGVsZW1lbnRzICk7XG59O1xuXG5TaXp6bGUubWF0Y2hlc1NlbGVjdG9yID0gZnVuY3Rpb24oIGVsZW0sIGV4cHIgKSB7XG5cdC8vIFNldCBkb2N1bWVudCB2YXJzIGlmIG5lZWRlZFxuXHRpZiAoICggZWxlbS5vd25lckRvY3VtZW50IHx8IGVsZW0gKSAhPT0gZG9jdW1lbnQgKSB7XG5cdFx0c2V0RG9jdW1lbnQoIGVsZW0gKTtcblx0fVxuXG5cdC8vIE1ha2Ugc3VyZSB0aGF0IGF0dHJpYnV0ZSBzZWxlY3RvcnMgYXJlIHF1b3RlZFxuXHRleHByID0gZXhwci5yZXBsYWNlKCByYXR0cmlidXRlUXVvdGVzLCBcIj0nJDEnXVwiICk7XG5cblx0aWYgKCBzdXBwb3J0Lm1hdGNoZXNTZWxlY3RvciAmJiBkb2N1bWVudElzSFRNTCAmJlxuXHRcdCFjb21waWxlckNhY2hlWyBleHByICsgXCIgXCIgXSAmJlxuXHRcdCggIXJidWdneU1hdGNoZXMgfHwgIXJidWdneU1hdGNoZXMudGVzdCggZXhwciApICkgJiZcblx0XHQoICFyYnVnZ3lRU0EgICAgIHx8ICFyYnVnZ3lRU0EudGVzdCggZXhwciApICkgKSB7XG5cblx0XHR0cnkge1xuXHRcdFx0dmFyIHJldCA9IG1hdGNoZXMuY2FsbCggZWxlbSwgZXhwciApO1xuXG5cdFx0XHQvLyBJRSA5J3MgbWF0Y2hlc1NlbGVjdG9yIHJldHVybnMgZmFsc2Ugb24gZGlzY29ubmVjdGVkIG5vZGVzXG5cdFx0XHRpZiAoIHJldCB8fCBzdXBwb3J0LmRpc2Nvbm5lY3RlZE1hdGNoIHx8XG5cdFx0XHRcdFx0Ly8gQXMgd2VsbCwgZGlzY29ubmVjdGVkIG5vZGVzIGFyZSBzYWlkIHRvIGJlIGluIGEgZG9jdW1lbnRcblx0XHRcdFx0XHQvLyBmcmFnbWVudCBpbiBJRSA5XG5cdFx0XHRcdFx0ZWxlbS5kb2N1bWVudCAmJiBlbGVtLmRvY3VtZW50Lm5vZGVUeXBlICE9PSAxMSApIHtcblx0XHRcdFx0cmV0dXJuIHJldDtcblx0XHRcdH1cblx0XHR9IGNhdGNoIChlKSB7fVxuXHR9XG5cblx0cmV0dXJuIFNpenpsZSggZXhwciwgZG9jdW1lbnQsIG51bGwsIFsgZWxlbSBdICkubGVuZ3RoID4gMDtcbn07XG5cblNpenpsZS5jb250YWlucyA9IGZ1bmN0aW9uKCBjb250ZXh0LCBlbGVtICkge1xuXHQvLyBTZXQgZG9jdW1lbnQgdmFycyBpZiBuZWVkZWRcblx0aWYgKCAoIGNvbnRleHQub3duZXJEb2N1bWVudCB8fCBjb250ZXh0ICkgIT09IGRvY3VtZW50ICkge1xuXHRcdHNldERvY3VtZW50KCBjb250ZXh0ICk7XG5cdH1cblx0cmV0dXJuIGNvbnRhaW5zKCBjb250ZXh0LCBlbGVtICk7XG59O1xuXG5TaXp6bGUuYXR0ciA9IGZ1bmN0aW9uKCBlbGVtLCBuYW1lICkge1xuXHQvLyBTZXQgZG9jdW1lbnQgdmFycyBpZiBuZWVkZWRcblx0aWYgKCAoIGVsZW0ub3duZXJEb2N1bWVudCB8fCBlbGVtICkgIT09IGRvY3VtZW50ICkge1xuXHRcdHNldERvY3VtZW50KCBlbGVtICk7XG5cdH1cblxuXHR2YXIgZm4gPSBFeHByLmF0dHJIYW5kbGVbIG5hbWUudG9Mb3dlckNhc2UoKSBdLFxuXHRcdC8vIERvbid0IGdldCBmb29sZWQgYnkgT2JqZWN0LnByb3RvdHlwZSBwcm9wZXJ0aWVzIChqUXVlcnkgIzEzODA3KVxuXHRcdHZhbCA9IGZuICYmIGhhc093bi5jYWxsKCBFeHByLmF0dHJIYW5kbGUsIG5hbWUudG9Mb3dlckNhc2UoKSApID9cblx0XHRcdGZuKCBlbGVtLCBuYW1lLCAhZG9jdW1lbnRJc0hUTUwgKSA6XG5cdFx0XHR1bmRlZmluZWQ7XG5cblx0cmV0dXJuIHZhbCAhPT0gdW5kZWZpbmVkID9cblx0XHR2YWwgOlxuXHRcdHN1cHBvcnQuYXR0cmlidXRlcyB8fCAhZG9jdW1lbnRJc0hUTUwgP1xuXHRcdFx0ZWxlbS5nZXRBdHRyaWJ1dGUoIG5hbWUgKSA6XG5cdFx0XHQodmFsID0gZWxlbS5nZXRBdHRyaWJ1dGVOb2RlKG5hbWUpKSAmJiB2YWwuc3BlY2lmaWVkID9cblx0XHRcdFx0dmFsLnZhbHVlIDpcblx0XHRcdFx0bnVsbDtcbn07XG5cblNpenpsZS5lcnJvciA9IGZ1bmN0aW9uKCBtc2cgKSB7XG5cdHRocm93IG5ldyBFcnJvciggXCJTeW50YXggZXJyb3IsIHVucmVjb2duaXplZCBleHByZXNzaW9uOiBcIiArIG1zZyApO1xufTtcblxuLyoqXG4gKiBEb2N1bWVudCBzb3J0aW5nIGFuZCByZW1vdmluZyBkdXBsaWNhdGVzXG4gKiBAcGFyYW0ge0FycmF5TGlrZX0gcmVzdWx0c1xuICovXG5TaXp6bGUudW5pcXVlU29ydCA9IGZ1bmN0aW9uKCByZXN1bHRzICkge1xuXHR2YXIgZWxlbSxcblx0XHRkdXBsaWNhdGVzID0gW10sXG5cdFx0aiA9IDAsXG5cdFx0aSA9IDA7XG5cblx0Ly8gVW5sZXNzIHdlICprbm93KiB3ZSBjYW4gZGV0ZWN0IGR1cGxpY2F0ZXMsIGFzc3VtZSB0aGVpciBwcmVzZW5jZVxuXHRoYXNEdXBsaWNhdGUgPSAhc3VwcG9ydC5kZXRlY3REdXBsaWNhdGVzO1xuXHRzb3J0SW5wdXQgPSAhc3VwcG9ydC5zb3J0U3RhYmxlICYmIHJlc3VsdHMuc2xpY2UoIDAgKTtcblx0cmVzdWx0cy5zb3J0KCBzb3J0T3JkZXIgKTtcblxuXHRpZiAoIGhhc0R1cGxpY2F0ZSApIHtcblx0XHR3aGlsZSAoIChlbGVtID0gcmVzdWx0c1tpKytdKSApIHtcblx0XHRcdGlmICggZWxlbSA9PT0gcmVzdWx0c1sgaSBdICkge1xuXHRcdFx0XHRqID0gZHVwbGljYXRlcy5wdXNoKCBpICk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHdoaWxlICggai0tICkge1xuXHRcdFx0cmVzdWx0cy5zcGxpY2UoIGR1cGxpY2F0ZXNbIGogXSwgMSApO1xuXHRcdH1cblx0fVxuXG5cdC8vIENsZWFyIGlucHV0IGFmdGVyIHNvcnRpbmcgdG8gcmVsZWFzZSBvYmplY3RzXG5cdC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L3NpenpsZS9wdWxsLzIyNVxuXHRzb3J0SW5wdXQgPSBudWxsO1xuXG5cdHJldHVybiByZXN1bHRzO1xufTtcblxuLyoqXG4gKiBVdGlsaXR5IGZ1bmN0aW9uIGZvciByZXRyaWV2aW5nIHRoZSB0ZXh0IHZhbHVlIG9mIGFuIGFycmF5IG9mIERPTSBub2Rlc1xuICogQHBhcmFtIHtBcnJheXxFbGVtZW50fSBlbGVtXG4gKi9cbmdldFRleHQgPSBTaXp6bGUuZ2V0VGV4dCA9IGZ1bmN0aW9uKCBlbGVtICkge1xuXHR2YXIgbm9kZSxcblx0XHRyZXQgPSBcIlwiLFxuXHRcdGkgPSAwLFxuXHRcdG5vZGVUeXBlID0gZWxlbS5ub2RlVHlwZTtcblxuXHRpZiAoICFub2RlVHlwZSApIHtcblx0XHQvLyBJZiBubyBub2RlVHlwZSwgdGhpcyBpcyBleHBlY3RlZCB0byBiZSBhbiBhcnJheVxuXHRcdHdoaWxlICggKG5vZGUgPSBlbGVtW2krK10pICkge1xuXHRcdFx0Ly8gRG8gbm90IHRyYXZlcnNlIGNvbW1lbnQgbm9kZXNcblx0XHRcdHJldCArPSBnZXRUZXh0KCBub2RlICk7XG5cdFx0fVxuXHR9IGVsc2UgaWYgKCBub2RlVHlwZSA9PT0gMSB8fCBub2RlVHlwZSA9PT0gOSB8fCBub2RlVHlwZSA9PT0gMTEgKSB7XG5cdFx0Ly8gVXNlIHRleHRDb250ZW50IGZvciBlbGVtZW50c1xuXHRcdC8vIGlubmVyVGV4dCB1c2FnZSByZW1vdmVkIGZvciBjb25zaXN0ZW5jeSBvZiBuZXcgbGluZXMgKGpRdWVyeSAjMTExNTMpXG5cdFx0aWYgKCB0eXBlb2YgZWxlbS50ZXh0Q29udGVudCA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdHJldHVybiBlbGVtLnRleHRDb250ZW50O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBUcmF2ZXJzZSBpdHMgY2hpbGRyZW5cblx0XHRcdGZvciAoIGVsZW0gPSBlbGVtLmZpcnN0Q2hpbGQ7IGVsZW07IGVsZW0gPSBlbGVtLm5leHRTaWJsaW5nICkge1xuXHRcdFx0XHRyZXQgKz0gZ2V0VGV4dCggZWxlbSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIGlmICggbm9kZVR5cGUgPT09IDMgfHwgbm9kZVR5cGUgPT09IDQgKSB7XG5cdFx0cmV0dXJuIGVsZW0ubm9kZVZhbHVlO1xuXHR9XG5cdC8vIERvIG5vdCBpbmNsdWRlIGNvbW1lbnQgb3IgcHJvY2Vzc2luZyBpbnN0cnVjdGlvbiBub2Rlc1xuXG5cdHJldHVybiByZXQ7XG59O1xuXG5FeHByID0gU2l6emxlLnNlbGVjdG9ycyA9IHtcblxuXHQvLyBDYW4gYmUgYWRqdXN0ZWQgYnkgdGhlIHVzZXJcblx0Y2FjaGVMZW5ndGg6IDUwLFxuXG5cdGNyZWF0ZVBzZXVkbzogbWFya0Z1bmN0aW9uLFxuXG5cdG1hdGNoOiBtYXRjaEV4cHIsXG5cblx0YXR0ckhhbmRsZToge30sXG5cblx0ZmluZDoge30sXG5cblx0cmVsYXRpdmU6IHtcblx0XHRcIj5cIjogeyBkaXI6IFwicGFyZW50Tm9kZVwiLCBmaXJzdDogdHJ1ZSB9LFxuXHRcdFwiIFwiOiB7IGRpcjogXCJwYXJlbnROb2RlXCIgfSxcblx0XHRcIitcIjogeyBkaXI6IFwicHJldmlvdXNTaWJsaW5nXCIsIGZpcnN0OiB0cnVlIH0sXG5cdFx0XCJ+XCI6IHsgZGlyOiBcInByZXZpb3VzU2libGluZ1wiIH1cblx0fSxcblxuXHRwcmVGaWx0ZXI6IHtcblx0XHRcIkFUVFJcIjogZnVuY3Rpb24oIG1hdGNoICkge1xuXHRcdFx0bWF0Y2hbMV0gPSBtYXRjaFsxXS5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApO1xuXG5cdFx0XHQvLyBNb3ZlIHRoZSBnaXZlbiB2YWx1ZSB0byBtYXRjaFszXSB3aGV0aGVyIHF1b3RlZCBvciB1bnF1b3RlZFxuXHRcdFx0bWF0Y2hbM10gPSAoIG1hdGNoWzNdIHx8IG1hdGNoWzRdIHx8IG1hdGNoWzVdIHx8IFwiXCIgKS5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApO1xuXG5cdFx0XHRpZiAoIG1hdGNoWzJdID09PSBcIn49XCIgKSB7XG5cdFx0XHRcdG1hdGNoWzNdID0gXCIgXCIgKyBtYXRjaFszXSArIFwiIFwiO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbWF0Y2guc2xpY2UoIDAsIDQgKTtcblx0XHR9LFxuXG5cdFx0XCJDSElMRFwiOiBmdW5jdGlvbiggbWF0Y2ggKSB7XG5cdFx0XHQvKiBtYXRjaGVzIGZyb20gbWF0Y2hFeHByW1wiQ0hJTERcIl1cblx0XHRcdFx0MSB0eXBlIChvbmx5fG50aHwuLi4pXG5cdFx0XHRcdDIgd2hhdCAoY2hpbGR8b2YtdHlwZSlcblx0XHRcdFx0MyBhcmd1bWVudCAoZXZlbnxvZGR8XFxkKnxcXGQqbihbKy1dXFxkKyk/fC4uLilcblx0XHRcdFx0NCB4bi1jb21wb25lbnQgb2YgeG4reSBhcmd1bWVudCAoWystXT9cXGQqbnwpXG5cdFx0XHRcdDUgc2lnbiBvZiB4bi1jb21wb25lbnRcblx0XHRcdFx0NiB4IG9mIHhuLWNvbXBvbmVudFxuXHRcdFx0XHQ3IHNpZ24gb2YgeS1jb21wb25lbnRcblx0XHRcdFx0OCB5IG9mIHktY29tcG9uZW50XG5cdFx0XHQqL1xuXHRcdFx0bWF0Y2hbMV0gPSBtYXRjaFsxXS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0XHRpZiAoIG1hdGNoWzFdLnNsaWNlKCAwLCAzICkgPT09IFwibnRoXCIgKSB7XG5cdFx0XHRcdC8vIG50aC0qIHJlcXVpcmVzIGFyZ3VtZW50XG5cdFx0XHRcdGlmICggIW1hdGNoWzNdICkge1xuXHRcdFx0XHRcdFNpenpsZS5lcnJvciggbWF0Y2hbMF0gKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIG51bWVyaWMgeCBhbmQgeSBwYXJhbWV0ZXJzIGZvciBFeHByLmZpbHRlci5DSElMRFxuXHRcdFx0XHQvLyByZW1lbWJlciB0aGF0IGZhbHNlL3RydWUgY2FzdCByZXNwZWN0aXZlbHkgdG8gMC8xXG5cdFx0XHRcdG1hdGNoWzRdID0gKyggbWF0Y2hbNF0gPyBtYXRjaFs1XSArIChtYXRjaFs2XSB8fCAxKSA6IDIgKiAoIG1hdGNoWzNdID09PSBcImV2ZW5cIiB8fCBtYXRjaFszXSA9PT0gXCJvZGRcIiApICk7XG5cdFx0XHRcdG1hdGNoWzVdID0gKyggKCBtYXRjaFs3XSArIG1hdGNoWzhdICkgfHwgbWF0Y2hbM10gPT09IFwib2RkXCIgKTtcblxuXHRcdFx0Ly8gb3RoZXIgdHlwZXMgcHJvaGliaXQgYXJndW1lbnRzXG5cdFx0XHR9IGVsc2UgaWYgKCBtYXRjaFszXSApIHtcblx0XHRcdFx0U2l6emxlLmVycm9yKCBtYXRjaFswXSApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbWF0Y2g7XG5cdFx0fSxcblxuXHRcdFwiUFNFVURPXCI6IGZ1bmN0aW9uKCBtYXRjaCApIHtcblx0XHRcdHZhciBleGNlc3MsXG5cdFx0XHRcdHVucXVvdGVkID0gIW1hdGNoWzZdICYmIG1hdGNoWzJdO1xuXG5cdFx0XHRpZiAoIG1hdGNoRXhwcltcIkNISUxEXCJdLnRlc3QoIG1hdGNoWzBdICkgKSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBY2NlcHQgcXVvdGVkIGFyZ3VtZW50cyBhcy1pc1xuXHRcdFx0aWYgKCBtYXRjaFszXSApIHtcblx0XHRcdFx0bWF0Y2hbMl0gPSBtYXRjaFs0XSB8fCBtYXRjaFs1XSB8fCBcIlwiO1xuXG5cdFx0XHQvLyBTdHJpcCBleGNlc3MgY2hhcmFjdGVycyBmcm9tIHVucXVvdGVkIGFyZ3VtZW50c1xuXHRcdFx0fSBlbHNlIGlmICggdW5xdW90ZWQgJiYgcnBzZXVkby50ZXN0KCB1bnF1b3RlZCApICYmXG5cdFx0XHRcdC8vIEdldCBleGNlc3MgZnJvbSB0b2tlbml6ZSAocmVjdXJzaXZlbHkpXG5cdFx0XHRcdChleGNlc3MgPSB0b2tlbml6ZSggdW5xdW90ZWQsIHRydWUgKSkgJiZcblx0XHRcdFx0Ly8gYWR2YW5jZSB0byB0aGUgbmV4dCBjbG9zaW5nIHBhcmVudGhlc2lzXG5cdFx0XHRcdChleGNlc3MgPSB1bnF1b3RlZC5pbmRleE9mKCBcIilcIiwgdW5xdW90ZWQubGVuZ3RoIC0gZXhjZXNzICkgLSB1bnF1b3RlZC5sZW5ndGgpICkge1xuXG5cdFx0XHRcdC8vIGV4Y2VzcyBpcyBhIG5lZ2F0aXZlIGluZGV4XG5cdFx0XHRcdG1hdGNoWzBdID0gbWF0Y2hbMF0uc2xpY2UoIDAsIGV4Y2VzcyApO1xuXHRcdFx0XHRtYXRjaFsyXSA9IHVucXVvdGVkLnNsaWNlKCAwLCBleGNlc3MgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmV0dXJuIG9ubHkgY2FwdHVyZXMgbmVlZGVkIGJ5IHRoZSBwc2V1ZG8gZmlsdGVyIG1ldGhvZCAodHlwZSBhbmQgYXJndW1lbnQpXG5cdFx0XHRyZXR1cm4gbWF0Y2guc2xpY2UoIDAsIDMgKTtcblx0XHR9XG5cdH0sXG5cblx0ZmlsdGVyOiB7XG5cblx0XHRcIlRBR1wiOiBmdW5jdGlvbiggbm9kZU5hbWVTZWxlY3RvciApIHtcblx0XHRcdHZhciBub2RlTmFtZSA9IG5vZGVOYW1lU2VsZWN0b3IucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0cmV0dXJuIG5vZGVOYW1lU2VsZWN0b3IgPT09IFwiKlwiID9cblx0XHRcdFx0ZnVuY3Rpb24oKSB7IHJldHVybiB0cnVlOyB9IDpcblx0XHRcdFx0ZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVsZW0ubm9kZU5hbWUgJiYgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBub2RlTmFtZTtcblx0XHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0XCJDTEFTU1wiOiBmdW5jdGlvbiggY2xhc3NOYW1lICkge1xuXHRcdFx0dmFyIHBhdHRlcm4gPSBjbGFzc0NhY2hlWyBjbGFzc05hbWUgKyBcIiBcIiBdO1xuXG5cdFx0XHRyZXR1cm4gcGF0dGVybiB8fFxuXHRcdFx0XHQocGF0dGVybiA9IG5ldyBSZWdFeHAoIFwiKF58XCIgKyB3aGl0ZXNwYWNlICsgXCIpXCIgKyBjbGFzc05hbWUgKyBcIihcIiArIHdoaXRlc3BhY2UgKyBcInwkKVwiICkpICYmXG5cdFx0XHRcdGNsYXNzQ2FjaGUoIGNsYXNzTmFtZSwgZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHBhdHRlcm4udGVzdCggdHlwZW9mIGVsZW0uY2xhc3NOYW1lID09PSBcInN0cmluZ1wiICYmIGVsZW0uY2xhc3NOYW1lIHx8IHR5cGVvZiBlbGVtLmdldEF0dHJpYnV0ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBlbGVtLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCIgKTtcblx0XHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdFwiQVRUUlwiOiBmdW5jdGlvbiggbmFtZSwgb3BlcmF0b3IsIGNoZWNrICkge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gU2l6emxlLmF0dHIoIGVsZW0sIG5hbWUgKTtcblxuXHRcdFx0XHRpZiAoIHJlc3VsdCA9PSBudWxsICkge1xuXHRcdFx0XHRcdHJldHVybiBvcGVyYXRvciA9PT0gXCIhPVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICggIW9wZXJhdG9yICkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmVzdWx0ICs9IFwiXCI7XG5cblx0XHRcdFx0cmV0dXJuIG9wZXJhdG9yID09PSBcIj1cIiA/IHJlc3VsdCA9PT0gY2hlY2sgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcIiE9XCIgPyByZXN1bHQgIT09IGNoZWNrIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCJePVwiID8gY2hlY2sgJiYgcmVzdWx0LmluZGV4T2YoIGNoZWNrICkgPT09IDAgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcIio9XCIgPyBjaGVjayAmJiByZXN1bHQuaW5kZXhPZiggY2hlY2sgKSA+IC0xIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCIkPVwiID8gY2hlY2sgJiYgcmVzdWx0LnNsaWNlKCAtY2hlY2subGVuZ3RoICkgPT09IGNoZWNrIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCJ+PVwiID8gKCBcIiBcIiArIHJlc3VsdC5yZXBsYWNlKCByd2hpdGVzcGFjZSwgXCIgXCIgKSArIFwiIFwiICkuaW5kZXhPZiggY2hlY2sgKSA+IC0xIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCJ8PVwiID8gcmVzdWx0ID09PSBjaGVjayB8fCByZXN1bHQuc2xpY2UoIDAsIGNoZWNrLmxlbmd0aCArIDEgKSA9PT0gY2hlY2sgKyBcIi1cIiA6XG5cdFx0XHRcdFx0ZmFsc2U7XG5cdFx0XHR9O1xuXHRcdH0sXG5cblx0XHRcIkNISUxEXCI6IGZ1bmN0aW9uKCB0eXBlLCB3aGF0LCBhcmd1bWVudCwgZmlyc3QsIGxhc3QgKSB7XG5cdFx0XHR2YXIgc2ltcGxlID0gdHlwZS5zbGljZSggMCwgMyApICE9PSBcIm50aFwiLFxuXHRcdFx0XHRmb3J3YXJkID0gdHlwZS5zbGljZSggLTQgKSAhPT0gXCJsYXN0XCIsXG5cdFx0XHRcdG9mVHlwZSA9IHdoYXQgPT09IFwib2YtdHlwZVwiO1xuXG5cdFx0XHRyZXR1cm4gZmlyc3QgPT09IDEgJiYgbGFzdCA9PT0gMCA/XG5cblx0XHRcdFx0Ly8gU2hvcnRjdXQgZm9yIDpudGgtKihuKVxuXHRcdFx0XHRmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0XHRyZXR1cm4gISFlbGVtLnBhcmVudE5vZGU7XG5cdFx0XHRcdH0gOlxuXG5cdFx0XHRcdGZ1bmN0aW9uKCBlbGVtLCBjb250ZXh0LCB4bWwgKSB7XG5cdFx0XHRcdFx0dmFyIGNhY2hlLCB1bmlxdWVDYWNoZSwgb3V0ZXJDYWNoZSwgbm9kZSwgbm9kZUluZGV4LCBzdGFydCxcblx0XHRcdFx0XHRcdGRpciA9IHNpbXBsZSAhPT0gZm9yd2FyZCA/IFwibmV4dFNpYmxpbmdcIiA6IFwicHJldmlvdXNTaWJsaW5nXCIsXG5cdFx0XHRcdFx0XHRwYXJlbnQgPSBlbGVtLnBhcmVudE5vZGUsXG5cdFx0XHRcdFx0XHRuYW1lID0gb2ZUeXBlICYmIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSxcblx0XHRcdFx0XHRcdHVzZUNhY2hlID0gIXhtbCAmJiAhb2ZUeXBlLFxuXHRcdFx0XHRcdFx0ZGlmZiA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0aWYgKCBwYXJlbnQgKSB7XG5cblx0XHRcdFx0XHRcdC8vIDooZmlyc3R8bGFzdHxvbmx5KS0oY2hpbGR8b2YtdHlwZSlcblx0XHRcdFx0XHRcdGlmICggc2ltcGxlICkge1xuXHRcdFx0XHRcdFx0XHR3aGlsZSAoIGRpciApIHtcblx0XHRcdFx0XHRcdFx0XHRub2RlID0gZWxlbTtcblx0XHRcdFx0XHRcdFx0XHR3aGlsZSAoIChub2RlID0gbm9kZVsgZGlyIF0pICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCBvZlR5cGUgP1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5hbWUgOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRub2RlLm5vZGVUeXBlID09PSAxICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0Ly8gUmV2ZXJzZSBkaXJlY3Rpb24gZm9yIDpvbmx5LSogKGlmIHdlIGhhdmVuJ3QgeWV0IGRvbmUgc28pXG5cdFx0XHRcdFx0XHRcdFx0c3RhcnQgPSBkaXIgPSB0eXBlID09PSBcIm9ubHlcIiAmJiAhc3RhcnQgJiYgXCJuZXh0U2libGluZ1wiO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRzdGFydCA9IFsgZm9yd2FyZCA/IHBhcmVudC5maXJzdENoaWxkIDogcGFyZW50Lmxhc3RDaGlsZCBdO1xuXG5cdFx0XHRcdFx0XHQvLyBub24teG1sIDpudGgtY2hpbGQoLi4uKSBzdG9yZXMgY2FjaGUgZGF0YSBvbiBgcGFyZW50YFxuXHRcdFx0XHRcdFx0aWYgKCBmb3J3YXJkICYmIHVzZUNhY2hlICkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIFNlZWsgYGVsZW1gIGZyb20gYSBwcmV2aW91c2x5LWNhY2hlZCBpbmRleFxuXG5cdFx0XHRcdFx0XHRcdC8vIC4uLmluIGEgZ3ppcC1mcmllbmRseSB3YXlcblx0XHRcdFx0XHRcdFx0bm9kZSA9IHBhcmVudDtcblx0XHRcdFx0XHRcdFx0b3V0ZXJDYWNoZSA9IG5vZGVbIGV4cGFuZG8gXSB8fCAobm9kZVsgZXhwYW5kbyBdID0ge30pO1xuXG5cdFx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDw5IG9ubHlcblx0XHRcdFx0XHRcdFx0Ly8gRGVmZW5kIGFnYWluc3QgY2xvbmVkIGF0dHJvcGVydGllcyAoalF1ZXJ5IGdoLTE3MDkpXG5cdFx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlID0gb3V0ZXJDYWNoZVsgbm9kZS51bmlxdWVJRCBdIHx8XG5cdFx0XHRcdFx0XHRcdFx0KG91dGVyQ2FjaGVbIG5vZGUudW5pcXVlSUQgXSA9IHt9KTtcblxuXHRcdFx0XHRcdFx0XHRjYWNoZSA9IHVuaXF1ZUNhY2hlWyB0eXBlIF0gfHwgW107XG5cdFx0XHRcdFx0XHRcdG5vZGVJbmRleCA9IGNhY2hlWyAwIF0gPT09IGRpcnJ1bnMgJiYgY2FjaGVbIDEgXTtcblx0XHRcdFx0XHRcdFx0ZGlmZiA9IG5vZGVJbmRleCAmJiBjYWNoZVsgMiBdO1xuXHRcdFx0XHRcdFx0XHRub2RlID0gbm9kZUluZGV4ICYmIHBhcmVudC5jaGlsZE5vZGVzWyBub2RlSW5kZXggXTtcblxuXHRcdFx0XHRcdFx0XHR3aGlsZSAoIChub2RlID0gKytub2RlSW5kZXggJiYgbm9kZSAmJiBub2RlWyBkaXIgXSB8fFxuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gRmFsbGJhY2sgdG8gc2Vla2luZyBgZWxlbWAgZnJvbSB0aGUgc3RhcnRcblx0XHRcdFx0XHRcdFx0XHQoZGlmZiA9IG5vZGVJbmRleCA9IDApIHx8IHN0YXJ0LnBvcCgpKSApIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIFdoZW4gZm91bmQsIGNhY2hlIGluZGV4ZXMgb24gYHBhcmVudGAgYW5kIGJyZWFrXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCBub2RlLm5vZGVUeXBlID09PSAxICYmICsrZGlmZiAmJiBub2RlID09PSBlbGVtICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGVbIHR5cGUgXSA9IFsgZGlycnVucywgbm9kZUluZGV4LCBkaWZmIF07XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Ly8gVXNlIHByZXZpb3VzbHktY2FjaGVkIGVsZW1lbnQgaW5kZXggaWYgYXZhaWxhYmxlXG5cdFx0XHRcdFx0XHRcdGlmICggdXNlQ2FjaGUgKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gLi4uaW4gYSBnemlwLWZyaWVuZGx5IHdheVxuXHRcdFx0XHRcdFx0XHRcdG5vZGUgPSBlbGVtO1xuXHRcdFx0XHRcdFx0XHRcdG91dGVyQ2FjaGUgPSBub2RlWyBleHBhbmRvIF0gfHwgKG5vZGVbIGV4cGFuZG8gXSA9IHt9KTtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDw5IG9ubHlcblx0XHRcdFx0XHRcdFx0XHQvLyBEZWZlbmQgYWdhaW5zdCBjbG9uZWQgYXR0cm9wZXJ0aWVzIChqUXVlcnkgZ2gtMTcwOSlcblx0XHRcdFx0XHRcdFx0XHR1bmlxdWVDYWNoZSA9IG91dGVyQ2FjaGVbIG5vZGUudW5pcXVlSUQgXSB8fFxuXHRcdFx0XHRcdFx0XHRcdFx0KG91dGVyQ2FjaGVbIG5vZGUudW5pcXVlSUQgXSA9IHt9KTtcblxuXHRcdFx0XHRcdFx0XHRcdGNhY2hlID0gdW5pcXVlQ2FjaGVbIHR5cGUgXSB8fCBbXTtcblx0XHRcdFx0XHRcdFx0XHRub2RlSW5kZXggPSBjYWNoZVsgMCBdID09PSBkaXJydW5zICYmIGNhY2hlWyAxIF07XG5cdFx0XHRcdFx0XHRcdFx0ZGlmZiA9IG5vZGVJbmRleDtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdC8vIHhtbCA6bnRoLWNoaWxkKC4uLilcblx0XHRcdFx0XHRcdFx0Ly8gb3IgOm50aC1sYXN0LWNoaWxkKC4uLikgb3IgOm50aCgtbGFzdCk/LW9mLXR5cGUoLi4uKVxuXHRcdFx0XHRcdFx0XHRpZiAoIGRpZmYgPT09IGZhbHNlICkge1xuXHRcdFx0XHRcdFx0XHRcdC8vIFVzZSB0aGUgc2FtZSBsb29wIGFzIGFib3ZlIHRvIHNlZWsgYGVsZW1gIGZyb20gdGhlIHN0YXJ0XG5cdFx0XHRcdFx0XHRcdFx0d2hpbGUgKCAobm9kZSA9ICsrbm9kZUluZGV4ICYmIG5vZGUgJiYgbm9kZVsgZGlyIF0gfHxcblx0XHRcdFx0XHRcdFx0XHRcdChkaWZmID0gbm9kZUluZGV4ID0gMCkgfHwgc3RhcnQucG9wKCkpICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoICggb2ZUeXBlID9cblx0XHRcdFx0XHRcdFx0XHRcdFx0bm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBuYW1lIDpcblx0XHRcdFx0XHRcdFx0XHRcdFx0bm9kZS5ub2RlVHlwZSA9PT0gMSApICYmXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsrZGlmZiApIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBDYWNoZSB0aGUgaW5kZXggb2YgZWFjaCBlbmNvdW50ZXJlZCBlbGVtZW50XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICggdXNlQ2FjaGUgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b3V0ZXJDYWNoZSA9IG5vZGVbIGV4cGFuZG8gXSB8fCAobm9kZVsgZXhwYW5kbyBdID0ge30pO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgPDkgb25seVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIERlZmVuZCBhZ2FpbnN0IGNsb25lZCBhdHRyb3BlcnRpZXMgKGpRdWVyeSBnaC0xNzA5KVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlID0gb3V0ZXJDYWNoZVsgbm9kZS51bmlxdWVJRCBdIHx8XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQob3V0ZXJDYWNoZVsgbm9kZS51bmlxdWVJRCBdID0ge30pO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGVbIHR5cGUgXSA9IFsgZGlycnVucywgZGlmZiBdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCBub2RlID09PSBlbGVtICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEluY29ycG9yYXRlIHRoZSBvZmZzZXQsIHRoZW4gY2hlY2sgYWdhaW5zdCBjeWNsZSBzaXplXG5cdFx0XHRcdFx0XHRkaWZmIC09IGxhc3Q7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZGlmZiA9PT0gZmlyc3QgfHwgKCBkaWZmICUgZmlyc3QgPT09IDAgJiYgZGlmZiAvIGZpcnN0ID49IDAgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0fSxcblxuXHRcdFwiUFNFVURPXCI6IGZ1bmN0aW9uKCBwc2V1ZG8sIGFyZ3VtZW50ICkge1xuXHRcdFx0Ly8gcHNldWRvLWNsYXNzIG5hbWVzIGFyZSBjYXNlLWluc2Vuc2l0aXZlXG5cdFx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9zZWxlY3RvcnMvI3BzZXVkby1jbGFzc2VzXG5cdFx0XHQvLyBQcmlvcml0aXplIGJ5IGNhc2Ugc2Vuc2l0aXZpdHkgaW4gY2FzZSBjdXN0b20gcHNldWRvcyBhcmUgYWRkZWQgd2l0aCB1cHBlcmNhc2UgbGV0dGVyc1xuXHRcdFx0Ly8gUmVtZW1iZXIgdGhhdCBzZXRGaWx0ZXJzIGluaGVyaXRzIGZyb20gcHNldWRvc1xuXHRcdFx0dmFyIGFyZ3MsXG5cdFx0XHRcdGZuID0gRXhwci5wc2V1ZG9zWyBwc2V1ZG8gXSB8fCBFeHByLnNldEZpbHRlcnNbIHBzZXVkby50b0xvd2VyQ2FzZSgpIF0gfHxcblx0XHRcdFx0XHRTaXp6bGUuZXJyb3IoIFwidW5zdXBwb3J0ZWQgcHNldWRvOiBcIiArIHBzZXVkbyApO1xuXG5cdFx0XHQvLyBUaGUgdXNlciBtYXkgdXNlIGNyZWF0ZVBzZXVkbyB0byBpbmRpY2F0ZSB0aGF0XG5cdFx0XHQvLyBhcmd1bWVudHMgYXJlIG5lZWRlZCB0byBjcmVhdGUgdGhlIGZpbHRlciBmdW5jdGlvblxuXHRcdFx0Ly8ganVzdCBhcyBTaXp6bGUgZG9lc1xuXHRcdFx0aWYgKCBmblsgZXhwYW5kbyBdICkge1xuXHRcdFx0XHRyZXR1cm4gZm4oIGFyZ3VtZW50ICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEJ1dCBtYWludGFpbiBzdXBwb3J0IGZvciBvbGQgc2lnbmF0dXJlc1xuXHRcdFx0aWYgKCBmbi5sZW5ndGggPiAxICkge1xuXHRcdFx0XHRhcmdzID0gWyBwc2V1ZG8sIHBzZXVkbywgXCJcIiwgYXJndW1lbnQgXTtcblx0XHRcdFx0cmV0dXJuIEV4cHIuc2V0RmlsdGVycy5oYXNPd25Qcm9wZXJ0eSggcHNldWRvLnRvTG93ZXJDYXNlKCkgKSA/XG5cdFx0XHRcdFx0bWFya0Z1bmN0aW9uKGZ1bmN0aW9uKCBzZWVkLCBtYXRjaGVzICkge1xuXHRcdFx0XHRcdFx0dmFyIGlkeCxcblx0XHRcdFx0XHRcdFx0bWF0Y2hlZCA9IGZuKCBzZWVkLCBhcmd1bWVudCApLFxuXHRcdFx0XHRcdFx0XHRpID0gbWF0Y2hlZC5sZW5ndGg7XG5cdFx0XHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRcdFx0aWR4ID0gaW5kZXhPZiggc2VlZCwgbWF0Y2hlZFtpXSApO1xuXHRcdFx0XHRcdFx0XHRzZWVkWyBpZHggXSA9ICEoIG1hdGNoZXNbIGlkeCBdID0gbWF0Y2hlZFtpXSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pIDpcblx0XHRcdFx0XHRmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0XHRcdHJldHVybiBmbiggZWxlbSwgMCwgYXJncyApO1xuXHRcdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmbjtcblx0XHR9XG5cdH0sXG5cblx0cHNldWRvczoge1xuXHRcdC8vIFBvdGVudGlhbGx5IGNvbXBsZXggcHNldWRvc1xuXHRcdFwibm90XCI6IG1hcmtGdW5jdGlvbihmdW5jdGlvbiggc2VsZWN0b3IgKSB7XG5cdFx0XHQvLyBUcmltIHRoZSBzZWxlY3RvciBwYXNzZWQgdG8gY29tcGlsZVxuXHRcdFx0Ly8gdG8gYXZvaWQgdHJlYXRpbmcgbGVhZGluZyBhbmQgdHJhaWxpbmdcblx0XHRcdC8vIHNwYWNlcyBhcyBjb21iaW5hdG9yc1xuXHRcdFx0dmFyIGlucHV0ID0gW10sXG5cdFx0XHRcdHJlc3VsdHMgPSBbXSxcblx0XHRcdFx0bWF0Y2hlciA9IGNvbXBpbGUoIHNlbGVjdG9yLnJlcGxhY2UoIHJ0cmltLCBcIiQxXCIgKSApO1xuXG5cdFx0XHRyZXR1cm4gbWF0Y2hlclsgZXhwYW5kbyBdID9cblx0XHRcdFx0bWFya0Z1bmN0aW9uKGZ1bmN0aW9uKCBzZWVkLCBtYXRjaGVzLCBjb250ZXh0LCB4bWwgKSB7XG5cdFx0XHRcdFx0dmFyIGVsZW0sXG5cdFx0XHRcdFx0XHR1bm1hdGNoZWQgPSBtYXRjaGVyKCBzZWVkLCBudWxsLCB4bWwsIFtdICksXG5cdFx0XHRcdFx0XHRpID0gc2VlZC5sZW5ndGg7XG5cblx0XHRcdFx0XHQvLyBNYXRjaCBlbGVtZW50cyB1bm1hdGNoZWQgYnkgYG1hdGNoZXJgXG5cdFx0XHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdFx0XHRpZiAoIChlbGVtID0gdW5tYXRjaGVkW2ldKSApIHtcblx0XHRcdFx0XHRcdFx0c2VlZFtpXSA9ICEobWF0Y2hlc1tpXSA9IGVsZW0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSkgOlxuXHRcdFx0XHRmdW5jdGlvbiggZWxlbSwgY29udGV4dCwgeG1sICkge1xuXHRcdFx0XHRcdGlucHV0WzBdID0gZWxlbTtcblx0XHRcdFx0XHRtYXRjaGVyKCBpbnB1dCwgbnVsbCwgeG1sLCByZXN1bHRzICk7XG5cdFx0XHRcdFx0Ly8gRG9uJ3Qga2VlcCB0aGUgZWxlbWVudCAoaXNzdWUgIzI5OSlcblx0XHRcdFx0XHRpbnB1dFswXSA9IG51bGw7XG5cdFx0XHRcdFx0cmV0dXJuICFyZXN1bHRzLnBvcCgpO1xuXHRcdFx0XHR9O1xuXHRcdH0pLFxuXG5cdFx0XCJoYXNcIjogbWFya0Z1bmN0aW9uKGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0cmV0dXJuIFNpenpsZSggc2VsZWN0b3IsIGVsZW0gKS5sZW5ndGggPiAwO1xuXHRcdFx0fTtcblx0XHR9KSxcblxuXHRcdFwiY29udGFpbnNcIjogbWFya0Z1bmN0aW9uKGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHRcdFx0dGV4dCA9IHRleHQucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKTtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0cmV0dXJuICggZWxlbS50ZXh0Q29udGVudCB8fCBlbGVtLmlubmVyVGV4dCB8fCBnZXRUZXh0KCBlbGVtICkgKS5pbmRleE9mKCB0ZXh0ICkgPiAtMTtcblx0XHRcdH07XG5cdFx0fSksXG5cblx0XHQvLyBcIldoZXRoZXIgYW4gZWxlbWVudCBpcyByZXByZXNlbnRlZCBieSBhIDpsYW5nKCkgc2VsZWN0b3Jcblx0XHQvLyBpcyBiYXNlZCBzb2xlbHkgb24gdGhlIGVsZW1lbnQncyBsYW5ndWFnZSB2YWx1ZVxuXHRcdC8vIGJlaW5nIGVxdWFsIHRvIHRoZSBpZGVudGlmaWVyIEMsXG5cdFx0Ly8gb3IgYmVnaW5uaW5nIHdpdGggdGhlIGlkZW50aWZpZXIgQyBpbW1lZGlhdGVseSBmb2xsb3dlZCBieSBcIi1cIi5cblx0XHQvLyBUaGUgbWF0Y2hpbmcgb2YgQyBhZ2FpbnN0IHRoZSBlbGVtZW50J3MgbGFuZ3VhZ2UgdmFsdWUgaXMgcGVyZm9ybWVkIGNhc2UtaW5zZW5zaXRpdmVseS5cblx0XHQvLyBUaGUgaWRlbnRpZmllciBDIGRvZXMgbm90IGhhdmUgdG8gYmUgYSB2YWxpZCBsYW5ndWFnZSBuYW1lLlwiXG5cdFx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvc2VsZWN0b3JzLyNsYW5nLXBzZXVkb1xuXHRcdFwibGFuZ1wiOiBtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBsYW5nICkge1xuXHRcdFx0Ly8gbGFuZyB2YWx1ZSBtdXN0IGJlIGEgdmFsaWQgaWRlbnRpZmllclxuXHRcdFx0aWYgKCAhcmlkZW50aWZpZXIudGVzdChsYW5nIHx8IFwiXCIpICkge1xuXHRcdFx0XHRTaXp6bGUuZXJyb3IoIFwidW5zdXBwb3J0ZWQgbGFuZzogXCIgKyBsYW5nICk7XG5cdFx0XHR9XG5cdFx0XHRsYW5nID0gbGFuZy5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHZhciBlbGVtTGFuZztcblx0XHRcdFx0ZG8ge1xuXHRcdFx0XHRcdGlmICggKGVsZW1MYW5nID0gZG9jdW1lbnRJc0hUTUwgP1xuXHRcdFx0XHRcdFx0ZWxlbS5sYW5nIDpcblx0XHRcdFx0XHRcdGVsZW0uZ2V0QXR0cmlidXRlKFwieG1sOmxhbmdcIikgfHwgZWxlbS5nZXRBdHRyaWJ1dGUoXCJsYW5nXCIpKSApIHtcblxuXHRcdFx0XHRcdFx0ZWxlbUxhbmcgPSBlbGVtTGFuZy50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGVsZW1MYW5nID09PSBsYW5nIHx8IGVsZW1MYW5nLmluZGV4T2YoIGxhbmcgKyBcIi1cIiApID09PSAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSB3aGlsZSAoIChlbGVtID0gZWxlbS5wYXJlbnROb2RlKSAmJiBlbGVtLm5vZGVUeXBlID09PSAxICk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH07XG5cdFx0fSksXG5cblx0XHQvLyBNaXNjZWxsYW5lb3VzXG5cdFx0XCJ0YXJnZXRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHR2YXIgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbiAmJiB3aW5kb3cubG9jYXRpb24uaGFzaDtcblx0XHRcdHJldHVybiBoYXNoICYmIGhhc2guc2xpY2UoIDEgKSA9PT0gZWxlbS5pZDtcblx0XHR9LFxuXG5cdFx0XCJyb290XCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0gPT09IGRvY0VsZW07XG5cdFx0fSxcblxuXHRcdFwiZm9jdXNcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbSA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiAoIWRvY3VtZW50Lmhhc0ZvY3VzIHx8IGRvY3VtZW50Lmhhc0ZvY3VzKCkpICYmICEhKGVsZW0udHlwZSB8fCBlbGVtLmhyZWYgfHwgfmVsZW0udGFiSW5kZXgpO1xuXHRcdH0sXG5cblx0XHQvLyBCb29sZWFuIHByb3BlcnRpZXNcblx0XHRcImVuYWJsZWRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5kaXNhYmxlZCA9PT0gZmFsc2U7XG5cdFx0fSxcblxuXHRcdFwiZGlzYWJsZWRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5kaXNhYmxlZCA9PT0gdHJ1ZTtcblx0XHR9LFxuXG5cdFx0XCJjaGVja2VkXCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0Ly8gSW4gQ1NTMywgOmNoZWNrZWQgc2hvdWxkIHJldHVybiBib3RoIGNoZWNrZWQgYW5kIHNlbGVjdGVkIGVsZW1lbnRzXG5cdFx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi8yMDExL1JFQy1jc3MzLXNlbGVjdG9ycy0yMDExMDkyOS8jY2hlY2tlZFxuXHRcdFx0dmFyIG5vZGVOYW1lID0gZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0cmV0dXJuIChub2RlTmFtZSA9PT0gXCJpbnB1dFwiICYmICEhZWxlbS5jaGVja2VkKSB8fCAobm9kZU5hbWUgPT09IFwib3B0aW9uXCIgJiYgISFlbGVtLnNlbGVjdGVkKTtcblx0XHR9LFxuXG5cdFx0XCJzZWxlY3RlZFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdC8vIEFjY2Vzc2luZyB0aGlzIHByb3BlcnR5IG1ha2VzIHNlbGVjdGVkLWJ5LWRlZmF1bHRcblx0XHRcdC8vIG9wdGlvbnMgaW4gU2FmYXJpIHdvcmsgcHJvcGVybHlcblx0XHRcdGlmICggZWxlbS5wYXJlbnROb2RlICkge1xuXHRcdFx0XHRlbGVtLnBhcmVudE5vZGUuc2VsZWN0ZWRJbmRleDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGVsZW0uc2VsZWN0ZWQgPT09IHRydWU7XG5cdFx0fSxcblxuXHRcdC8vIENvbnRlbnRzXG5cdFx0XCJlbXB0eVwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL3NlbGVjdG9ycy8jZW1wdHktcHNldWRvXG5cdFx0XHQvLyA6ZW1wdHkgaXMgbmVnYXRlZCBieSBlbGVtZW50ICgxKSBvciBjb250ZW50IG5vZGVzICh0ZXh0OiAzOyBjZGF0YTogNDsgZW50aXR5IHJlZjogNSksXG5cdFx0XHQvLyAgIGJ1dCBub3QgYnkgb3RoZXJzIChjb21tZW50OiA4OyBwcm9jZXNzaW5nIGluc3RydWN0aW9uOiA3OyBldGMuKVxuXHRcdFx0Ly8gbm9kZVR5cGUgPCA2IHdvcmtzIGJlY2F1c2UgYXR0cmlidXRlcyAoMikgZG8gbm90IGFwcGVhciBhcyBjaGlsZHJlblxuXHRcdFx0Zm9yICggZWxlbSA9IGVsZW0uZmlyc3RDaGlsZDsgZWxlbTsgZWxlbSA9IGVsZW0ubmV4dFNpYmxpbmcgKSB7XG5cdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA8IDYgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9LFxuXG5cdFx0XCJwYXJlbnRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gIUV4cHIucHNldWRvc1tcImVtcHR5XCJdKCBlbGVtICk7XG5cdFx0fSxcblxuXHRcdC8vIEVsZW1lbnQvaW5wdXQgdHlwZXNcblx0XHRcImhlYWRlclwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiByaGVhZGVyLnRlc3QoIGVsZW0ubm9kZU5hbWUgKTtcblx0XHR9LFxuXG5cdFx0XCJpbnB1dFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiByaW5wdXRzLnRlc3QoIGVsZW0ubm9kZU5hbWUgKTtcblx0XHR9LFxuXG5cdFx0XCJidXR0b25cIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHR2YXIgbmFtZSA9IGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRcdHJldHVybiBuYW1lID09PSBcImlucHV0XCIgJiYgZWxlbS50eXBlID09PSBcImJ1dHRvblwiIHx8IG5hbWUgPT09IFwiYnV0dG9uXCI7XG5cdFx0fSxcblxuXHRcdFwidGV4dFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHZhciBhdHRyO1xuXHRcdFx0cmV0dXJuIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJpbnB1dFwiICYmXG5cdFx0XHRcdGVsZW0udHlwZSA9PT0gXCJ0ZXh0XCIgJiZcblxuXHRcdFx0XHQvLyBTdXBwb3J0OiBJRTw4XG5cdFx0XHRcdC8vIE5ldyBIVE1MNSBhdHRyaWJ1dGUgdmFsdWVzIChlLmcuLCBcInNlYXJjaFwiKSBhcHBlYXIgd2l0aCBlbGVtLnR5cGUgPT09IFwidGV4dFwiXG5cdFx0XHRcdCggKGF0dHIgPSBlbGVtLmdldEF0dHJpYnV0ZShcInR5cGVcIikpID09IG51bGwgfHwgYXR0ci50b0xvd2VyQ2FzZSgpID09PSBcInRleHRcIiApO1xuXHRcdH0sXG5cblx0XHQvLyBQb3NpdGlvbi1pbi1jb2xsZWN0aW9uXG5cdFx0XCJmaXJzdFwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIFsgMCBdO1xuXHRcdH0pLFxuXG5cdFx0XCJsYXN0XCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oZnVuY3Rpb24oIG1hdGNoSW5kZXhlcywgbGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuIFsgbGVuZ3RoIC0gMSBdO1xuXHRcdH0pLFxuXG5cdFx0XCJlcVwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKGZ1bmN0aW9uKCBtYXRjaEluZGV4ZXMsIGxlbmd0aCwgYXJndW1lbnQgKSB7XG5cdFx0XHRyZXR1cm4gWyBhcmd1bWVudCA8IDAgPyBhcmd1bWVudCArIGxlbmd0aCA6IGFyZ3VtZW50IF07XG5cdFx0fSksXG5cblx0XHRcImV2ZW5cIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyhmdW5jdGlvbiggbWF0Y2hJbmRleGVzLCBsZW5ndGggKSB7XG5cdFx0XHR2YXIgaSA9IDA7XG5cdFx0XHRmb3IgKCA7IGkgPCBsZW5ndGg7IGkgKz0gMiApIHtcblx0XHRcdFx0bWF0Y2hJbmRleGVzLnB1c2goIGkgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtYXRjaEluZGV4ZXM7XG5cdFx0fSksXG5cblx0XHRcIm9kZFwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKGZ1bmN0aW9uKCBtYXRjaEluZGV4ZXMsIGxlbmd0aCApIHtcblx0XHRcdHZhciBpID0gMTtcblx0XHRcdGZvciAoIDsgaSA8IGxlbmd0aDsgaSArPSAyICkge1xuXHRcdFx0XHRtYXRjaEluZGV4ZXMucHVzaCggaSApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1hdGNoSW5kZXhlcztcblx0XHR9KSxcblxuXHRcdFwibHRcIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyhmdW5jdGlvbiggbWF0Y2hJbmRleGVzLCBsZW5ndGgsIGFyZ3VtZW50ICkge1xuXHRcdFx0dmFyIGkgPSBhcmd1bWVudCA8IDAgPyBhcmd1bWVudCArIGxlbmd0aCA6IGFyZ3VtZW50O1xuXHRcdFx0Zm9yICggOyAtLWkgPj0gMDsgKSB7XG5cdFx0XHRcdG1hdGNoSW5kZXhlcy5wdXNoKCBpICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbWF0Y2hJbmRleGVzO1xuXHRcdH0pLFxuXG5cdFx0XCJndFwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKGZ1bmN0aW9uKCBtYXRjaEluZGV4ZXMsIGxlbmd0aCwgYXJndW1lbnQgKSB7XG5cdFx0XHR2YXIgaSA9IGFyZ3VtZW50IDwgMCA/IGFyZ3VtZW50ICsgbGVuZ3RoIDogYXJndW1lbnQ7XG5cdFx0XHRmb3IgKCA7ICsraSA8IGxlbmd0aDsgKSB7XG5cdFx0XHRcdG1hdGNoSW5kZXhlcy5wdXNoKCBpICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbWF0Y2hJbmRleGVzO1xuXHRcdH0pXG5cdH1cbn07XG5cbkV4cHIucHNldWRvc1tcIm50aFwiXSA9IEV4cHIucHNldWRvc1tcImVxXCJdO1xuXG4vLyBBZGQgYnV0dG9uL2lucHV0IHR5cGUgcHNldWRvc1xuZm9yICggaSBpbiB7IHJhZGlvOiB0cnVlLCBjaGVja2JveDogdHJ1ZSwgZmlsZTogdHJ1ZSwgcGFzc3dvcmQ6IHRydWUsIGltYWdlOiB0cnVlIH0gKSB7XG5cdEV4cHIucHNldWRvc1sgaSBdID0gY3JlYXRlSW5wdXRQc2V1ZG8oIGkgKTtcbn1cbmZvciAoIGkgaW4geyBzdWJtaXQ6IHRydWUsIHJlc2V0OiB0cnVlIH0gKSB7XG5cdEV4cHIucHNldWRvc1sgaSBdID0gY3JlYXRlQnV0dG9uUHNldWRvKCBpICk7XG59XG5cbi8vIEVhc3kgQVBJIGZvciBjcmVhdGluZyBuZXcgc2V0RmlsdGVyc1xuZnVuY3Rpb24gc2V0RmlsdGVycygpIHt9XG5zZXRGaWx0ZXJzLnByb3RvdHlwZSA9IEV4cHIuZmlsdGVycyA9IEV4cHIucHNldWRvcztcbkV4cHIuc2V0RmlsdGVycyA9IG5ldyBzZXRGaWx0ZXJzKCk7XG5cbnRva2VuaXplID0gU2l6emxlLnRva2VuaXplID0gZnVuY3Rpb24oIHNlbGVjdG9yLCBwYXJzZU9ubHkgKSB7XG5cdHZhciBtYXRjaGVkLCBtYXRjaCwgdG9rZW5zLCB0eXBlLFxuXHRcdHNvRmFyLCBncm91cHMsIHByZUZpbHRlcnMsXG5cdFx0Y2FjaGVkID0gdG9rZW5DYWNoZVsgc2VsZWN0b3IgKyBcIiBcIiBdO1xuXG5cdGlmICggY2FjaGVkICkge1xuXHRcdHJldHVybiBwYXJzZU9ubHkgPyAwIDogY2FjaGVkLnNsaWNlKCAwICk7XG5cdH1cblxuXHRzb0ZhciA9IHNlbGVjdG9yO1xuXHRncm91cHMgPSBbXTtcblx0cHJlRmlsdGVycyA9IEV4cHIucHJlRmlsdGVyO1xuXG5cdHdoaWxlICggc29GYXIgKSB7XG5cblx0XHQvLyBDb21tYSBhbmQgZmlyc3QgcnVuXG5cdFx0aWYgKCAhbWF0Y2hlZCB8fCAobWF0Y2ggPSByY29tbWEuZXhlYyggc29GYXIgKSkgKSB7XG5cdFx0XHRpZiAoIG1hdGNoICkge1xuXHRcdFx0XHQvLyBEb24ndCBjb25zdW1lIHRyYWlsaW5nIGNvbW1hcyBhcyB2YWxpZFxuXHRcdFx0XHRzb0ZhciA9IHNvRmFyLnNsaWNlKCBtYXRjaFswXS5sZW5ndGggKSB8fCBzb0Zhcjtcblx0XHRcdH1cblx0XHRcdGdyb3Vwcy5wdXNoKCAodG9rZW5zID0gW10pICk7XG5cdFx0fVxuXG5cdFx0bWF0Y2hlZCA9IGZhbHNlO1xuXG5cdFx0Ly8gQ29tYmluYXRvcnNcblx0XHRpZiAoIChtYXRjaCA9IHJjb21iaW5hdG9ycy5leGVjKCBzb0ZhciApKSApIHtcblx0XHRcdG1hdGNoZWQgPSBtYXRjaC5zaGlmdCgpO1xuXHRcdFx0dG9rZW5zLnB1c2goe1xuXHRcdFx0XHR2YWx1ZTogbWF0Y2hlZCxcblx0XHRcdFx0Ly8gQ2FzdCBkZXNjZW5kYW50IGNvbWJpbmF0b3JzIHRvIHNwYWNlXG5cdFx0XHRcdHR5cGU6IG1hdGNoWzBdLnJlcGxhY2UoIHJ0cmltLCBcIiBcIiApXG5cdFx0XHR9KTtcblx0XHRcdHNvRmFyID0gc29GYXIuc2xpY2UoIG1hdGNoZWQubGVuZ3RoICk7XG5cdFx0fVxuXG5cdFx0Ly8gRmlsdGVyc1xuXHRcdGZvciAoIHR5cGUgaW4gRXhwci5maWx0ZXIgKSB7XG5cdFx0XHRpZiAoIChtYXRjaCA9IG1hdGNoRXhwclsgdHlwZSBdLmV4ZWMoIHNvRmFyICkpICYmICghcHJlRmlsdGVyc1sgdHlwZSBdIHx8XG5cdFx0XHRcdChtYXRjaCA9IHByZUZpbHRlcnNbIHR5cGUgXSggbWF0Y2ggKSkpICkge1xuXHRcdFx0XHRtYXRjaGVkID0gbWF0Y2guc2hpZnQoKTtcblx0XHRcdFx0dG9rZW5zLnB1c2goe1xuXHRcdFx0XHRcdHZhbHVlOiBtYXRjaGVkLFxuXHRcdFx0XHRcdHR5cGU6IHR5cGUsXG5cdFx0XHRcdFx0bWF0Y2hlczogbWF0Y2hcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHNvRmFyID0gc29GYXIuc2xpY2UoIG1hdGNoZWQubGVuZ3RoICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCAhbWF0Y2hlZCApIHtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJldHVybiB0aGUgbGVuZ3RoIG9mIHRoZSBpbnZhbGlkIGV4Y2Vzc1xuXHQvLyBpZiB3ZSdyZSBqdXN0IHBhcnNpbmdcblx0Ly8gT3RoZXJ3aXNlLCB0aHJvdyBhbiBlcnJvciBvciByZXR1cm4gdG9rZW5zXG5cdHJldHVybiBwYXJzZU9ubHkgP1xuXHRcdHNvRmFyLmxlbmd0aCA6XG5cdFx0c29GYXIgP1xuXHRcdFx0U2l6emxlLmVycm9yKCBzZWxlY3RvciApIDpcblx0XHRcdC8vIENhY2hlIHRoZSB0b2tlbnNcblx0XHRcdHRva2VuQ2FjaGUoIHNlbGVjdG9yLCBncm91cHMgKS5zbGljZSggMCApO1xufTtcblxuZnVuY3Rpb24gdG9TZWxlY3RvciggdG9rZW5zICkge1xuXHR2YXIgaSA9IDAsXG5cdFx0bGVuID0gdG9rZW5zLmxlbmd0aCxcblx0XHRzZWxlY3RvciA9IFwiXCI7XG5cdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdHNlbGVjdG9yICs9IHRva2Vuc1tpXS52YWx1ZTtcblx0fVxuXHRyZXR1cm4gc2VsZWN0b3I7XG59XG5cbmZ1bmN0aW9uIGFkZENvbWJpbmF0b3IoIG1hdGNoZXIsIGNvbWJpbmF0b3IsIGJhc2UgKSB7XG5cdHZhciBkaXIgPSBjb21iaW5hdG9yLmRpcixcblx0XHRjaGVja05vbkVsZW1lbnRzID0gYmFzZSAmJiBkaXIgPT09IFwicGFyZW50Tm9kZVwiLFxuXHRcdGRvbmVOYW1lID0gZG9uZSsrO1xuXG5cdHJldHVybiBjb21iaW5hdG9yLmZpcnN0ID9cblx0XHQvLyBDaGVjayBhZ2FpbnN0IGNsb3Nlc3QgYW5jZXN0b3IvcHJlY2VkaW5nIGVsZW1lbnRcblx0XHRmdW5jdGlvbiggZWxlbSwgY29udGV4dCwgeG1sICkge1xuXHRcdFx0d2hpbGUgKCAoZWxlbSA9IGVsZW1bIGRpciBdKSApIHtcblx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxIHx8IGNoZWNrTm9uRWxlbWVudHMgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG1hdGNoZXIoIGVsZW0sIGNvbnRleHQsIHhtbCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSA6XG5cblx0XHQvLyBDaGVjayBhZ2FpbnN0IGFsbCBhbmNlc3Rvci9wcmVjZWRpbmcgZWxlbWVudHNcblx0XHRmdW5jdGlvbiggZWxlbSwgY29udGV4dCwgeG1sICkge1xuXHRcdFx0dmFyIG9sZENhY2hlLCB1bmlxdWVDYWNoZSwgb3V0ZXJDYWNoZSxcblx0XHRcdFx0bmV3Q2FjaGUgPSBbIGRpcnJ1bnMsIGRvbmVOYW1lIF07XG5cblx0XHRcdC8vIFdlIGNhbid0IHNldCBhcmJpdHJhcnkgZGF0YSBvbiBYTUwgbm9kZXMsIHNvIHRoZXkgZG9uJ3QgYmVuZWZpdCBmcm9tIGNvbWJpbmF0b3IgY2FjaGluZ1xuXHRcdFx0aWYgKCB4bWwgKSB7XG5cdFx0XHRcdHdoaWxlICggKGVsZW0gPSBlbGVtWyBkaXIgXSkgKSB7XG5cdFx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxIHx8IGNoZWNrTm9uRWxlbWVudHMgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIG1hdGNoZXIoIGVsZW0sIGNvbnRleHQsIHhtbCApICkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdoaWxlICggKGVsZW0gPSBlbGVtWyBkaXIgXSkgKSB7XG5cdFx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxIHx8IGNoZWNrTm9uRWxlbWVudHMgKSB7XG5cdFx0XHRcdFx0XHRvdXRlckNhY2hlID0gZWxlbVsgZXhwYW5kbyBdIHx8IChlbGVtWyBleHBhbmRvIF0gPSB7fSk7XG5cblx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDw5IG9ubHlcblx0XHRcdFx0XHRcdC8vIERlZmVuZCBhZ2FpbnN0IGNsb25lZCBhdHRyb3BlcnRpZXMgKGpRdWVyeSBnaC0xNzA5KVxuXHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGUgPSBvdXRlckNhY2hlWyBlbGVtLnVuaXF1ZUlEIF0gfHwgKG91dGVyQ2FjaGVbIGVsZW0udW5pcXVlSUQgXSA9IHt9KTtcblxuXHRcdFx0XHRcdFx0aWYgKCAob2xkQ2FjaGUgPSB1bmlxdWVDYWNoZVsgZGlyIF0pICYmXG5cdFx0XHRcdFx0XHRcdG9sZENhY2hlWyAwIF0gPT09IGRpcnJ1bnMgJiYgb2xkQ2FjaGVbIDEgXSA9PT0gZG9uZU5hbWUgKSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gQXNzaWduIHRvIG5ld0NhY2hlIHNvIHJlc3VsdHMgYmFjay1wcm9wYWdhdGUgdG8gcHJldmlvdXMgZWxlbWVudHNcblx0XHRcdFx0XHRcdFx0cmV0dXJuIChuZXdDYWNoZVsgMiBdID0gb2xkQ2FjaGVbIDIgXSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHQvLyBSZXVzZSBuZXdjYWNoZSBzbyByZXN1bHRzIGJhY2stcHJvcGFnYXRlIHRvIHByZXZpb3VzIGVsZW1lbnRzXG5cdFx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlWyBkaXIgXSA9IG5ld0NhY2hlO1xuXG5cdFx0XHRcdFx0XHRcdC8vIEEgbWF0Y2ggbWVhbnMgd2UncmUgZG9uZTsgYSBmYWlsIG1lYW5zIHdlIGhhdmUgdG8ga2VlcCBjaGVja2luZ1xuXHRcdFx0XHRcdFx0XHRpZiAoIChuZXdDYWNoZVsgMiBdID0gbWF0Y2hlciggZWxlbSwgY29udGV4dCwgeG1sICkpICkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcbn1cblxuZnVuY3Rpb24gZWxlbWVudE1hdGNoZXIoIG1hdGNoZXJzICkge1xuXHRyZXR1cm4gbWF0Y2hlcnMubGVuZ3RoID4gMSA/XG5cdFx0ZnVuY3Rpb24oIGVsZW0sIGNvbnRleHQsIHhtbCApIHtcblx0XHRcdHZhciBpID0gbWF0Y2hlcnMubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdGlmICggIW1hdGNoZXJzW2ldKCBlbGVtLCBjb250ZXh0LCB4bWwgKSApIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gOlxuXHRcdG1hdGNoZXJzWzBdO1xufVxuXG5mdW5jdGlvbiBtdWx0aXBsZUNvbnRleHRzKCBzZWxlY3RvciwgY29udGV4dHMsIHJlc3VsdHMgKSB7XG5cdHZhciBpID0gMCxcblx0XHRsZW4gPSBjb250ZXh0cy5sZW5ndGg7XG5cdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFNpenpsZSggc2VsZWN0b3IsIGNvbnRleHRzW2ldLCByZXN1bHRzICk7XG5cdH1cblx0cmV0dXJuIHJlc3VsdHM7XG59XG5cbmZ1bmN0aW9uIGNvbmRlbnNlKCB1bm1hdGNoZWQsIG1hcCwgZmlsdGVyLCBjb250ZXh0LCB4bWwgKSB7XG5cdHZhciBlbGVtLFxuXHRcdG5ld1VubWF0Y2hlZCA9IFtdLFxuXHRcdGkgPSAwLFxuXHRcdGxlbiA9IHVubWF0Y2hlZC5sZW5ndGgsXG5cdFx0bWFwcGVkID0gbWFwICE9IG51bGw7XG5cblx0Zm9yICggOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0aWYgKCAoZWxlbSA9IHVubWF0Y2hlZFtpXSkgKSB7XG5cdFx0XHRpZiAoICFmaWx0ZXIgfHwgZmlsdGVyKCBlbGVtLCBjb250ZXh0LCB4bWwgKSApIHtcblx0XHRcdFx0bmV3VW5tYXRjaGVkLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0aWYgKCBtYXBwZWQgKSB7XG5cdFx0XHRcdFx0bWFwLnB1c2goIGkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiBuZXdVbm1hdGNoZWQ7XG59XG5cbmZ1bmN0aW9uIHNldE1hdGNoZXIoIHByZUZpbHRlciwgc2VsZWN0b3IsIG1hdGNoZXIsIHBvc3RGaWx0ZXIsIHBvc3RGaW5kZXIsIHBvc3RTZWxlY3RvciApIHtcblx0aWYgKCBwb3N0RmlsdGVyICYmICFwb3N0RmlsdGVyWyBleHBhbmRvIF0gKSB7XG5cdFx0cG9zdEZpbHRlciA9IHNldE1hdGNoZXIoIHBvc3RGaWx0ZXIgKTtcblx0fVxuXHRpZiAoIHBvc3RGaW5kZXIgJiYgIXBvc3RGaW5kZXJbIGV4cGFuZG8gXSApIHtcblx0XHRwb3N0RmluZGVyID0gc2V0TWF0Y2hlciggcG9zdEZpbmRlciwgcG9zdFNlbGVjdG9yICk7XG5cdH1cblx0cmV0dXJuIG1hcmtGdW5jdGlvbihmdW5jdGlvbiggc2VlZCwgcmVzdWx0cywgY29udGV4dCwgeG1sICkge1xuXHRcdHZhciB0ZW1wLCBpLCBlbGVtLFxuXHRcdFx0cHJlTWFwID0gW10sXG5cdFx0XHRwb3N0TWFwID0gW10sXG5cdFx0XHRwcmVleGlzdGluZyA9IHJlc3VsdHMubGVuZ3RoLFxuXG5cdFx0XHQvLyBHZXQgaW5pdGlhbCBlbGVtZW50cyBmcm9tIHNlZWQgb3IgY29udGV4dFxuXHRcdFx0ZWxlbXMgPSBzZWVkIHx8IG11bHRpcGxlQ29udGV4dHMoIHNlbGVjdG9yIHx8IFwiKlwiLCBjb250ZXh0Lm5vZGVUeXBlID8gWyBjb250ZXh0IF0gOiBjb250ZXh0LCBbXSApLFxuXG5cdFx0XHQvLyBQcmVmaWx0ZXIgdG8gZ2V0IG1hdGNoZXIgaW5wdXQsIHByZXNlcnZpbmcgYSBtYXAgZm9yIHNlZWQtcmVzdWx0cyBzeW5jaHJvbml6YXRpb25cblx0XHRcdG1hdGNoZXJJbiA9IHByZUZpbHRlciAmJiAoIHNlZWQgfHwgIXNlbGVjdG9yICkgP1xuXHRcdFx0XHRjb25kZW5zZSggZWxlbXMsIHByZU1hcCwgcHJlRmlsdGVyLCBjb250ZXh0LCB4bWwgKSA6XG5cdFx0XHRcdGVsZW1zLFxuXG5cdFx0XHRtYXRjaGVyT3V0ID0gbWF0Y2hlciA/XG5cdFx0XHRcdC8vIElmIHdlIGhhdmUgYSBwb3N0RmluZGVyLCBvciBmaWx0ZXJlZCBzZWVkLCBvciBub24tc2VlZCBwb3N0RmlsdGVyIG9yIHByZWV4aXN0aW5nIHJlc3VsdHMsXG5cdFx0XHRcdHBvc3RGaW5kZXIgfHwgKCBzZWVkID8gcHJlRmlsdGVyIDogcHJlZXhpc3RpbmcgfHwgcG9zdEZpbHRlciApID9cblxuXHRcdFx0XHRcdC8vIC4uLmludGVybWVkaWF0ZSBwcm9jZXNzaW5nIGlzIG5lY2Vzc2FyeVxuXHRcdFx0XHRcdFtdIDpcblxuXHRcdFx0XHRcdC8vIC4uLm90aGVyd2lzZSB1c2UgcmVzdWx0cyBkaXJlY3RseVxuXHRcdFx0XHRcdHJlc3VsdHMgOlxuXHRcdFx0XHRtYXRjaGVySW47XG5cblx0XHQvLyBGaW5kIHByaW1hcnkgbWF0Y2hlc1xuXHRcdGlmICggbWF0Y2hlciApIHtcblx0XHRcdG1hdGNoZXIoIG1hdGNoZXJJbiwgbWF0Y2hlck91dCwgY29udGV4dCwgeG1sICk7XG5cdFx0fVxuXG5cdFx0Ly8gQXBwbHkgcG9zdEZpbHRlclxuXHRcdGlmICggcG9zdEZpbHRlciApIHtcblx0XHRcdHRlbXAgPSBjb25kZW5zZSggbWF0Y2hlck91dCwgcG9zdE1hcCApO1xuXHRcdFx0cG9zdEZpbHRlciggdGVtcCwgW10sIGNvbnRleHQsIHhtbCApO1xuXG5cdFx0XHQvLyBVbi1tYXRjaCBmYWlsaW5nIGVsZW1lbnRzIGJ5IG1vdmluZyB0aGVtIGJhY2sgdG8gbWF0Y2hlckluXG5cdFx0XHRpID0gdGVtcC5sZW5ndGg7XG5cdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0aWYgKCAoZWxlbSA9IHRlbXBbaV0pICkge1xuXHRcdFx0XHRcdG1hdGNoZXJPdXRbIHBvc3RNYXBbaV0gXSA9ICEobWF0Y2hlckluWyBwb3N0TWFwW2ldIF0gPSBlbGVtKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICggc2VlZCApIHtcblx0XHRcdGlmICggcG9zdEZpbmRlciB8fCBwcmVGaWx0ZXIgKSB7XG5cdFx0XHRcdGlmICggcG9zdEZpbmRlciApIHtcblx0XHRcdFx0XHQvLyBHZXQgdGhlIGZpbmFsIG1hdGNoZXJPdXQgYnkgY29uZGVuc2luZyB0aGlzIGludGVybWVkaWF0ZSBpbnRvIHBvc3RGaW5kZXIgY29udGV4dHNcblx0XHRcdFx0XHR0ZW1wID0gW107XG5cdFx0XHRcdFx0aSA9IG1hdGNoZXJPdXQubGVuZ3RoO1xuXHRcdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdFx0aWYgKCAoZWxlbSA9IG1hdGNoZXJPdXRbaV0pICkge1xuXHRcdFx0XHRcdFx0XHQvLyBSZXN0b3JlIG1hdGNoZXJJbiBzaW5jZSBlbGVtIGlzIG5vdCB5ZXQgYSBmaW5hbCBtYXRjaFxuXHRcdFx0XHRcdFx0XHR0ZW1wLnB1c2goIChtYXRjaGVySW5baV0gPSBlbGVtKSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwb3N0RmluZGVyKCBudWxsLCAobWF0Y2hlck91dCA9IFtdKSwgdGVtcCwgeG1sICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBNb3ZlIG1hdGNoZWQgZWxlbWVudHMgZnJvbSBzZWVkIHRvIHJlc3VsdHMgdG8ga2VlcCB0aGVtIHN5bmNocm9uaXplZFxuXHRcdFx0XHRpID0gbWF0Y2hlck91dC5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdGlmICggKGVsZW0gPSBtYXRjaGVyT3V0W2ldKSAmJlxuXHRcdFx0XHRcdFx0KHRlbXAgPSBwb3N0RmluZGVyID8gaW5kZXhPZiggc2VlZCwgZWxlbSApIDogcHJlTWFwW2ldKSA+IC0xICkge1xuXG5cdFx0XHRcdFx0XHRzZWVkW3RlbXBdID0gIShyZXN1bHRzW3RlbXBdID0gZWxlbSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHQvLyBBZGQgZWxlbWVudHMgdG8gcmVzdWx0cywgdGhyb3VnaCBwb3N0RmluZGVyIGlmIGRlZmluZWRcblx0XHR9IGVsc2Uge1xuXHRcdFx0bWF0Y2hlck91dCA9IGNvbmRlbnNlKFxuXHRcdFx0XHRtYXRjaGVyT3V0ID09PSByZXN1bHRzID9cblx0XHRcdFx0XHRtYXRjaGVyT3V0LnNwbGljZSggcHJlZXhpc3RpbmcsIG1hdGNoZXJPdXQubGVuZ3RoICkgOlxuXHRcdFx0XHRcdG1hdGNoZXJPdXRcblx0XHRcdCk7XG5cdFx0XHRpZiAoIHBvc3RGaW5kZXIgKSB7XG5cdFx0XHRcdHBvc3RGaW5kZXIoIG51bGwsIHJlc3VsdHMsIG1hdGNoZXJPdXQsIHhtbCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgbWF0Y2hlck91dCApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXJGcm9tVG9rZW5zKCB0b2tlbnMgKSB7XG5cdHZhciBjaGVja0NvbnRleHQsIG1hdGNoZXIsIGosXG5cdFx0bGVuID0gdG9rZW5zLmxlbmd0aCxcblx0XHRsZWFkaW5nUmVsYXRpdmUgPSBFeHByLnJlbGF0aXZlWyB0b2tlbnNbMF0udHlwZSBdLFxuXHRcdGltcGxpY2l0UmVsYXRpdmUgPSBsZWFkaW5nUmVsYXRpdmUgfHwgRXhwci5yZWxhdGl2ZVtcIiBcIl0sXG5cdFx0aSA9IGxlYWRpbmdSZWxhdGl2ZSA/IDEgOiAwLFxuXG5cdFx0Ly8gVGhlIGZvdW5kYXRpb25hbCBtYXRjaGVyIGVuc3VyZXMgdGhhdCBlbGVtZW50cyBhcmUgcmVhY2hhYmxlIGZyb20gdG9wLWxldmVsIGNvbnRleHQocylcblx0XHRtYXRjaENvbnRleHQgPSBhZGRDb21iaW5hdG9yKCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtID09PSBjaGVja0NvbnRleHQ7XG5cdFx0fSwgaW1wbGljaXRSZWxhdGl2ZSwgdHJ1ZSApLFxuXHRcdG1hdGNoQW55Q29udGV4dCA9IGFkZENvbWJpbmF0b3IoIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGluZGV4T2YoIGNoZWNrQ29udGV4dCwgZWxlbSApID4gLTE7XG5cdFx0fSwgaW1wbGljaXRSZWxhdGl2ZSwgdHJ1ZSApLFxuXHRcdG1hdGNoZXJzID0gWyBmdW5jdGlvbiggZWxlbSwgY29udGV4dCwgeG1sICkge1xuXHRcdFx0dmFyIHJldCA9ICggIWxlYWRpbmdSZWxhdGl2ZSAmJiAoIHhtbCB8fCBjb250ZXh0ICE9PSBvdXRlcm1vc3RDb250ZXh0ICkgKSB8fCAoXG5cdFx0XHRcdChjaGVja0NvbnRleHQgPSBjb250ZXh0KS5ub2RlVHlwZSA/XG5cdFx0XHRcdFx0bWF0Y2hDb250ZXh0KCBlbGVtLCBjb250ZXh0LCB4bWwgKSA6XG5cdFx0XHRcdFx0bWF0Y2hBbnlDb250ZXh0KCBlbGVtLCBjb250ZXh0LCB4bWwgKSApO1xuXHRcdFx0Ly8gQXZvaWQgaGFuZ2luZyBvbnRvIGVsZW1lbnQgKGlzc3VlICMyOTkpXG5cdFx0XHRjaGVja0NvbnRleHQgPSBudWxsO1xuXHRcdFx0cmV0dXJuIHJldDtcblx0XHR9IF07XG5cblx0Zm9yICggOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0aWYgKCAobWF0Y2hlciA9IEV4cHIucmVsYXRpdmVbIHRva2Vuc1tpXS50eXBlIF0pICkge1xuXHRcdFx0bWF0Y2hlcnMgPSBbIGFkZENvbWJpbmF0b3IoZWxlbWVudE1hdGNoZXIoIG1hdGNoZXJzICksIG1hdGNoZXIpIF07XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1hdGNoZXIgPSBFeHByLmZpbHRlclsgdG9rZW5zW2ldLnR5cGUgXS5hcHBseSggbnVsbCwgdG9rZW5zW2ldLm1hdGNoZXMgKTtcblxuXHRcdFx0Ly8gUmV0dXJuIHNwZWNpYWwgdXBvbiBzZWVpbmcgYSBwb3NpdGlvbmFsIG1hdGNoZXJcblx0XHRcdGlmICggbWF0Y2hlclsgZXhwYW5kbyBdICkge1xuXHRcdFx0XHQvLyBGaW5kIHRoZSBuZXh0IHJlbGF0aXZlIG9wZXJhdG9yIChpZiBhbnkpIGZvciBwcm9wZXIgaGFuZGxpbmdcblx0XHRcdFx0aiA9ICsraTtcblx0XHRcdFx0Zm9yICggOyBqIDwgbGVuOyBqKysgKSB7XG5cdFx0XHRcdFx0aWYgKCBFeHByLnJlbGF0aXZlWyB0b2tlbnNbal0udHlwZSBdICkge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBzZXRNYXRjaGVyKFxuXHRcdFx0XHRcdGkgPiAxICYmIGVsZW1lbnRNYXRjaGVyKCBtYXRjaGVycyApLFxuXHRcdFx0XHRcdGkgPiAxICYmIHRvU2VsZWN0b3IoXG5cdFx0XHRcdFx0XHQvLyBJZiB0aGUgcHJlY2VkaW5nIHRva2VuIHdhcyBhIGRlc2NlbmRhbnQgY29tYmluYXRvciwgaW5zZXJ0IGFuIGltcGxpY2l0IGFueS1lbGVtZW50IGAqYFxuXHRcdFx0XHRcdFx0dG9rZW5zLnNsaWNlKCAwLCBpIC0gMSApLmNvbmNhdCh7IHZhbHVlOiB0b2tlbnNbIGkgLSAyIF0udHlwZSA9PT0gXCIgXCIgPyBcIipcIiA6IFwiXCIgfSlcblx0XHRcdFx0XHQpLnJlcGxhY2UoIHJ0cmltLCBcIiQxXCIgKSxcblx0XHRcdFx0XHRtYXRjaGVyLFxuXHRcdFx0XHRcdGkgPCBqICYmIG1hdGNoZXJGcm9tVG9rZW5zKCB0b2tlbnMuc2xpY2UoIGksIGogKSApLFxuXHRcdFx0XHRcdGogPCBsZW4gJiYgbWF0Y2hlckZyb21Ub2tlbnMoICh0b2tlbnMgPSB0b2tlbnMuc2xpY2UoIGogKSkgKSxcblx0XHRcdFx0XHRqIDwgbGVuICYmIHRvU2VsZWN0b3IoIHRva2VucyApXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHRtYXRjaGVycy5wdXNoKCBtYXRjaGVyICk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGVsZW1lbnRNYXRjaGVyKCBtYXRjaGVycyApO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVyRnJvbUdyb3VwTWF0Y2hlcnMoIGVsZW1lbnRNYXRjaGVycywgc2V0TWF0Y2hlcnMgKSB7XG5cdHZhciBieVNldCA9IHNldE1hdGNoZXJzLmxlbmd0aCA+IDAsXG5cdFx0YnlFbGVtZW50ID0gZWxlbWVudE1hdGNoZXJzLmxlbmd0aCA+IDAsXG5cdFx0c3VwZXJNYXRjaGVyID0gZnVuY3Rpb24oIHNlZWQsIGNvbnRleHQsIHhtbCwgcmVzdWx0cywgb3V0ZXJtb3N0ICkge1xuXHRcdFx0dmFyIGVsZW0sIGosIG1hdGNoZXIsXG5cdFx0XHRcdG1hdGNoZWRDb3VudCA9IDAsXG5cdFx0XHRcdGkgPSBcIjBcIixcblx0XHRcdFx0dW5tYXRjaGVkID0gc2VlZCAmJiBbXSxcblx0XHRcdFx0c2V0TWF0Y2hlZCA9IFtdLFxuXHRcdFx0XHRjb250ZXh0QmFja3VwID0gb3V0ZXJtb3N0Q29udGV4dCxcblx0XHRcdFx0Ly8gV2UgbXVzdCBhbHdheXMgaGF2ZSBlaXRoZXIgc2VlZCBlbGVtZW50cyBvciBvdXRlcm1vc3QgY29udGV4dFxuXHRcdFx0XHRlbGVtcyA9IHNlZWQgfHwgYnlFbGVtZW50ICYmIEV4cHIuZmluZFtcIlRBR1wiXSggXCIqXCIsIG91dGVybW9zdCApLFxuXHRcdFx0XHQvLyBVc2UgaW50ZWdlciBkaXJydW5zIGlmZiB0aGlzIGlzIHRoZSBvdXRlcm1vc3QgbWF0Y2hlclxuXHRcdFx0XHRkaXJydW5zVW5pcXVlID0gKGRpcnJ1bnMgKz0gY29udGV4dEJhY2t1cCA9PSBudWxsID8gMSA6IE1hdGgucmFuZG9tKCkgfHwgMC4xKSxcblx0XHRcdFx0bGVuID0gZWxlbXMubGVuZ3RoO1xuXG5cdFx0XHRpZiAoIG91dGVybW9zdCApIHtcblx0XHRcdFx0b3V0ZXJtb3N0Q29udGV4dCA9IGNvbnRleHQgPT09IGRvY3VtZW50IHx8IGNvbnRleHQgfHwgb3V0ZXJtb3N0O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBZGQgZWxlbWVudHMgcGFzc2luZyBlbGVtZW50TWF0Y2hlcnMgZGlyZWN0bHkgdG8gcmVzdWx0c1xuXHRcdFx0Ly8gU3VwcG9ydDogSUU8OSwgU2FmYXJpXG5cdFx0XHQvLyBUb2xlcmF0ZSBOb2RlTGlzdCBwcm9wZXJ0aWVzIChJRTogXCJsZW5ndGhcIjsgU2FmYXJpOiA8bnVtYmVyPikgbWF0Y2hpbmcgZWxlbWVudHMgYnkgaWRcblx0XHRcdGZvciAoIDsgaSAhPT0gbGVuICYmIChlbGVtID0gZWxlbXNbaV0pICE9IG51bGw7IGkrKyApIHtcblx0XHRcdFx0aWYgKCBieUVsZW1lbnQgJiYgZWxlbSApIHtcblx0XHRcdFx0XHRqID0gMDtcblx0XHRcdFx0XHRpZiAoICFjb250ZXh0ICYmIGVsZW0ub3duZXJEb2N1bWVudCAhPT0gZG9jdW1lbnQgKSB7XG5cdFx0XHRcdFx0XHRzZXREb2N1bWVudCggZWxlbSApO1xuXHRcdFx0XHRcdFx0eG1sID0gIWRvY3VtZW50SXNIVE1MO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR3aGlsZSAoIChtYXRjaGVyID0gZWxlbWVudE1hdGNoZXJzW2orK10pICkge1xuXHRcdFx0XHRcdFx0aWYgKCBtYXRjaGVyKCBlbGVtLCBjb250ZXh0IHx8IGRvY3VtZW50LCB4bWwpICkge1xuXHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggb3V0ZXJtb3N0ICkge1xuXHRcdFx0XHRcdFx0ZGlycnVucyA9IGRpcnJ1bnNVbmlxdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVHJhY2sgdW5tYXRjaGVkIGVsZW1lbnRzIGZvciBzZXQgZmlsdGVyc1xuXHRcdFx0XHRpZiAoIGJ5U2V0ICkge1xuXHRcdFx0XHRcdC8vIFRoZXkgd2lsbCBoYXZlIGdvbmUgdGhyb3VnaCBhbGwgcG9zc2libGUgbWF0Y2hlcnNcblx0XHRcdFx0XHRpZiAoIChlbGVtID0gIW1hdGNoZXIgJiYgZWxlbSkgKSB7XG5cdFx0XHRcdFx0XHRtYXRjaGVkQ291bnQtLTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBMZW5ndGhlbiB0aGUgYXJyYXkgZm9yIGV2ZXJ5IGVsZW1lbnQsIG1hdGNoZWQgb3Igbm90XG5cdFx0XHRcdFx0aWYgKCBzZWVkICkge1xuXHRcdFx0XHRcdFx0dW5tYXRjaGVkLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gYGlgIGlzIG5vdyB0aGUgY291bnQgb2YgZWxlbWVudHMgdmlzaXRlZCBhYm92ZSwgYW5kIGFkZGluZyBpdCB0byBgbWF0Y2hlZENvdW50YFxuXHRcdFx0Ly8gbWFrZXMgdGhlIGxhdHRlciBub25uZWdhdGl2ZS5cblx0XHRcdG1hdGNoZWRDb3VudCArPSBpO1xuXG5cdFx0XHQvLyBBcHBseSBzZXQgZmlsdGVycyB0byB1bm1hdGNoZWQgZWxlbWVudHNcblx0XHRcdC8vIE5PVEU6IFRoaXMgY2FuIGJlIHNraXBwZWQgaWYgdGhlcmUgYXJlIG5vIHVubWF0Y2hlZCBlbGVtZW50cyAoaS5lLiwgYG1hdGNoZWRDb3VudGBcblx0XHRcdC8vIGVxdWFscyBgaWApLCB1bmxlc3Mgd2UgZGlkbid0IHZpc2l0IF9hbnlfIGVsZW1lbnRzIGluIHRoZSBhYm92ZSBsb29wIGJlY2F1c2Ugd2UgaGF2ZVxuXHRcdFx0Ly8gbm8gZWxlbWVudCBtYXRjaGVycyBhbmQgbm8gc2VlZC5cblx0XHRcdC8vIEluY3JlbWVudGluZyBhbiBpbml0aWFsbHktc3RyaW5nIFwiMFwiIGBpYCBhbGxvd3MgYGlgIHRvIHJlbWFpbiBhIHN0cmluZyBvbmx5IGluIHRoYXRcblx0XHRcdC8vIGNhc2UsIHdoaWNoIHdpbGwgcmVzdWx0IGluIGEgXCIwMFwiIGBtYXRjaGVkQ291bnRgIHRoYXQgZGlmZmVycyBmcm9tIGBpYCBidXQgaXMgYWxzb1xuXHRcdFx0Ly8gbnVtZXJpY2FsbHkgemVyby5cblx0XHRcdGlmICggYnlTZXQgJiYgaSAhPT0gbWF0Y2hlZENvdW50ICkge1xuXHRcdFx0XHRqID0gMDtcblx0XHRcdFx0d2hpbGUgKCAobWF0Y2hlciA9IHNldE1hdGNoZXJzW2orK10pICkge1xuXHRcdFx0XHRcdG1hdGNoZXIoIHVubWF0Y2hlZCwgc2V0TWF0Y2hlZCwgY29udGV4dCwgeG1sICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHNlZWQgKSB7XG5cdFx0XHRcdFx0Ly8gUmVpbnRlZ3JhdGUgZWxlbWVudCBtYXRjaGVzIHRvIGVsaW1pbmF0ZSB0aGUgbmVlZCBmb3Igc29ydGluZ1xuXHRcdFx0XHRcdGlmICggbWF0Y2hlZENvdW50ID4gMCApIHtcblx0XHRcdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICEodW5tYXRjaGVkW2ldIHx8IHNldE1hdGNoZWRbaV0pICkge1xuXHRcdFx0XHRcdFx0XHRcdHNldE1hdGNoZWRbaV0gPSBwb3AuY2FsbCggcmVzdWx0cyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRGlzY2FyZCBpbmRleCBwbGFjZWhvbGRlciB2YWx1ZXMgdG8gZ2V0IG9ubHkgYWN0dWFsIG1hdGNoZXNcblx0XHRcdFx0XHRzZXRNYXRjaGVkID0gY29uZGVuc2UoIHNldE1hdGNoZWQgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEFkZCBtYXRjaGVzIHRvIHJlc3VsdHNcblx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgc2V0TWF0Y2hlZCApO1xuXG5cdFx0XHRcdC8vIFNlZWRsZXNzIHNldCBtYXRjaGVzIHN1Y2NlZWRpbmcgbXVsdGlwbGUgc3VjY2Vzc2Z1bCBtYXRjaGVycyBzdGlwdWxhdGUgc29ydGluZ1xuXHRcdFx0XHRpZiAoIG91dGVybW9zdCAmJiAhc2VlZCAmJiBzZXRNYXRjaGVkLmxlbmd0aCA+IDAgJiZcblx0XHRcdFx0XHQoIG1hdGNoZWRDb3VudCArIHNldE1hdGNoZXJzLmxlbmd0aCApID4gMSApIHtcblxuXHRcdFx0XHRcdFNpenpsZS51bmlxdWVTb3J0KCByZXN1bHRzICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gT3ZlcnJpZGUgbWFuaXB1bGF0aW9uIG9mIGdsb2JhbHMgYnkgbmVzdGVkIG1hdGNoZXJzXG5cdFx0XHRpZiAoIG91dGVybW9zdCApIHtcblx0XHRcdFx0ZGlycnVucyA9IGRpcnJ1bnNVbmlxdWU7XG5cdFx0XHRcdG91dGVybW9zdENvbnRleHQgPSBjb250ZXh0QmFja3VwO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdW5tYXRjaGVkO1xuXHRcdH07XG5cblx0cmV0dXJuIGJ5U2V0ID9cblx0XHRtYXJrRnVuY3Rpb24oIHN1cGVyTWF0Y2hlciApIDpcblx0XHRzdXBlck1hdGNoZXI7XG59XG5cbmNvbXBpbGUgPSBTaXp6bGUuY29tcGlsZSA9IGZ1bmN0aW9uKCBzZWxlY3RvciwgbWF0Y2ggLyogSW50ZXJuYWwgVXNlIE9ubHkgKi8gKSB7XG5cdHZhciBpLFxuXHRcdHNldE1hdGNoZXJzID0gW10sXG5cdFx0ZWxlbWVudE1hdGNoZXJzID0gW10sXG5cdFx0Y2FjaGVkID0gY29tcGlsZXJDYWNoZVsgc2VsZWN0b3IgKyBcIiBcIiBdO1xuXG5cdGlmICggIWNhY2hlZCApIHtcblx0XHQvLyBHZW5lcmF0ZSBhIGZ1bmN0aW9uIG9mIHJlY3Vyc2l2ZSBmdW5jdGlvbnMgdGhhdCBjYW4gYmUgdXNlZCB0byBjaGVjayBlYWNoIGVsZW1lbnRcblx0XHRpZiAoICFtYXRjaCApIHtcblx0XHRcdG1hdGNoID0gdG9rZW5pemUoIHNlbGVjdG9yICk7XG5cdFx0fVxuXHRcdGkgPSBtYXRjaC5sZW5ndGg7XG5cdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRjYWNoZWQgPSBtYXRjaGVyRnJvbVRva2VucyggbWF0Y2hbaV0gKTtcblx0XHRcdGlmICggY2FjaGVkWyBleHBhbmRvIF0gKSB7XG5cdFx0XHRcdHNldE1hdGNoZXJzLnB1c2goIGNhY2hlZCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZWxlbWVudE1hdGNoZXJzLnB1c2goIGNhY2hlZCApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIENhY2hlIHRoZSBjb21waWxlZCBmdW5jdGlvblxuXHRcdGNhY2hlZCA9IGNvbXBpbGVyQ2FjaGUoIHNlbGVjdG9yLCBtYXRjaGVyRnJvbUdyb3VwTWF0Y2hlcnMoIGVsZW1lbnRNYXRjaGVycywgc2V0TWF0Y2hlcnMgKSApO1xuXG5cdFx0Ly8gU2F2ZSBzZWxlY3RvciBhbmQgdG9rZW5pemF0aW9uXG5cdFx0Y2FjaGVkLnNlbGVjdG9yID0gc2VsZWN0b3I7XG5cdH1cblx0cmV0dXJuIGNhY2hlZDtcbn07XG5cbi8qKlxuICogQSBsb3ctbGV2ZWwgc2VsZWN0aW9uIGZ1bmN0aW9uIHRoYXQgd29ya3Mgd2l0aCBTaXp6bGUncyBjb21waWxlZFxuICogIHNlbGVjdG9yIGZ1bmN0aW9uc1xuICogQHBhcmFtIHtTdHJpbmd8RnVuY3Rpb259IHNlbGVjdG9yIEEgc2VsZWN0b3Igb3IgYSBwcmUtY29tcGlsZWRcbiAqICBzZWxlY3RvciBmdW5jdGlvbiBidWlsdCB3aXRoIFNpenpsZS5jb21waWxlXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGNvbnRleHRcbiAqIEBwYXJhbSB7QXJyYXl9IFtyZXN1bHRzXVxuICogQHBhcmFtIHtBcnJheX0gW3NlZWRdIEEgc2V0IG9mIGVsZW1lbnRzIHRvIG1hdGNoIGFnYWluc3RcbiAqL1xuc2VsZWN0ID0gU2l6emxlLnNlbGVjdCA9IGZ1bmN0aW9uKCBzZWxlY3RvciwgY29udGV4dCwgcmVzdWx0cywgc2VlZCApIHtcblx0dmFyIGksIHRva2VucywgdG9rZW4sIHR5cGUsIGZpbmQsXG5cdFx0Y29tcGlsZWQgPSB0eXBlb2Ygc2VsZWN0b3IgPT09IFwiZnVuY3Rpb25cIiAmJiBzZWxlY3Rvcixcblx0XHRtYXRjaCA9ICFzZWVkICYmIHRva2VuaXplKCAoc2VsZWN0b3IgPSBjb21waWxlZC5zZWxlY3RvciB8fCBzZWxlY3RvcikgKTtcblxuXHRyZXN1bHRzID0gcmVzdWx0cyB8fCBbXTtcblxuXHQvLyBUcnkgdG8gbWluaW1pemUgb3BlcmF0aW9ucyBpZiB0aGVyZSBpcyBvbmx5IG9uZSBzZWxlY3RvciBpbiB0aGUgbGlzdCBhbmQgbm8gc2VlZFxuXHQvLyAodGhlIGxhdHRlciBvZiB3aGljaCBndWFyYW50ZWVzIHVzIGNvbnRleHQpXG5cdGlmICggbWF0Y2gubGVuZ3RoID09PSAxICkge1xuXG5cdFx0Ly8gUmVkdWNlIGNvbnRleHQgaWYgdGhlIGxlYWRpbmcgY29tcG91bmQgc2VsZWN0b3IgaXMgYW4gSURcblx0XHR0b2tlbnMgPSBtYXRjaFswXSA9IG1hdGNoWzBdLnNsaWNlKCAwICk7XG5cdFx0aWYgKCB0b2tlbnMubGVuZ3RoID4gMiAmJiAodG9rZW4gPSB0b2tlbnNbMF0pLnR5cGUgPT09IFwiSURcIiAmJlxuXHRcdFx0XHRzdXBwb3J0LmdldEJ5SWQgJiYgY29udGV4dC5ub2RlVHlwZSA9PT0gOSAmJiBkb2N1bWVudElzSFRNTCAmJlxuXHRcdFx0XHRFeHByLnJlbGF0aXZlWyB0b2tlbnNbMV0udHlwZSBdICkge1xuXG5cdFx0XHRjb250ZXh0ID0gKCBFeHByLmZpbmRbXCJJRFwiXSggdG9rZW4ubWF0Y2hlc1swXS5yZXBsYWNlKHJ1bmVzY2FwZSwgZnVuZXNjYXBlKSwgY29udGV4dCApIHx8IFtdIClbMF07XG5cdFx0XHRpZiAoICFjb250ZXh0ICkge1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblxuXHRcdFx0Ly8gUHJlY29tcGlsZWQgbWF0Y2hlcnMgd2lsbCBzdGlsbCB2ZXJpZnkgYW5jZXN0cnksIHNvIHN0ZXAgdXAgYSBsZXZlbFxuXHRcdFx0fSBlbHNlIGlmICggY29tcGlsZWQgKSB7XG5cdFx0XHRcdGNvbnRleHQgPSBjb250ZXh0LnBhcmVudE5vZGU7XG5cdFx0XHR9XG5cblx0XHRcdHNlbGVjdG9yID0gc2VsZWN0b3Iuc2xpY2UoIHRva2Vucy5zaGlmdCgpLnZhbHVlLmxlbmd0aCApO1xuXHRcdH1cblxuXHRcdC8vIEZldGNoIGEgc2VlZCBzZXQgZm9yIHJpZ2h0LXRvLWxlZnQgbWF0Y2hpbmdcblx0XHRpID0gbWF0Y2hFeHByW1wibmVlZHNDb250ZXh0XCJdLnRlc3QoIHNlbGVjdG9yICkgPyAwIDogdG9rZW5zLmxlbmd0aDtcblx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdHRva2VuID0gdG9rZW5zW2ldO1xuXG5cdFx0XHQvLyBBYm9ydCBpZiB3ZSBoaXQgYSBjb21iaW5hdG9yXG5cdFx0XHRpZiAoIEV4cHIucmVsYXRpdmVbICh0eXBlID0gdG9rZW4udHlwZSkgXSApIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIChmaW5kID0gRXhwci5maW5kWyB0eXBlIF0pICkge1xuXHRcdFx0XHQvLyBTZWFyY2gsIGV4cGFuZGluZyBjb250ZXh0IGZvciBsZWFkaW5nIHNpYmxpbmcgY29tYmluYXRvcnNcblx0XHRcdFx0aWYgKCAoc2VlZCA9IGZpbmQoXG5cdFx0XHRcdFx0dG9rZW4ubWF0Y2hlc1swXS5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApLFxuXHRcdFx0XHRcdHJzaWJsaW5nLnRlc3QoIHRva2Vuc1swXS50eXBlICkgJiYgdGVzdENvbnRleHQoIGNvbnRleHQucGFyZW50Tm9kZSApIHx8IGNvbnRleHRcblx0XHRcdFx0KSkgKSB7XG5cblx0XHRcdFx0XHQvLyBJZiBzZWVkIGlzIGVtcHR5IG9yIG5vIHRva2VucyByZW1haW4sIHdlIGNhbiByZXR1cm4gZWFybHlcblx0XHRcdFx0XHR0b2tlbnMuc3BsaWNlKCBpLCAxICk7XG5cdFx0XHRcdFx0c2VsZWN0b3IgPSBzZWVkLmxlbmd0aCAmJiB0b1NlbGVjdG9yKCB0b2tlbnMgKTtcblx0XHRcdFx0XHRpZiAoICFzZWxlY3RvciApIHtcblx0XHRcdFx0XHRcdHB1c2guYXBwbHkoIHJlc3VsdHMsIHNlZWQgKTtcblx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gQ29tcGlsZSBhbmQgZXhlY3V0ZSBhIGZpbHRlcmluZyBmdW5jdGlvbiBpZiBvbmUgaXMgbm90IHByb3ZpZGVkXG5cdC8vIFByb3ZpZGUgYG1hdGNoYCB0byBhdm9pZCByZXRva2VuaXphdGlvbiBpZiB3ZSBtb2RpZmllZCB0aGUgc2VsZWN0b3IgYWJvdmVcblx0KCBjb21waWxlZCB8fCBjb21waWxlKCBzZWxlY3RvciwgbWF0Y2ggKSApKFxuXHRcdHNlZWQsXG5cdFx0Y29udGV4dCxcblx0XHQhZG9jdW1lbnRJc0hUTUwsXG5cdFx0cmVzdWx0cyxcblx0XHQhY29udGV4dCB8fCByc2libGluZy50ZXN0KCBzZWxlY3RvciApICYmIHRlc3RDb250ZXh0KCBjb250ZXh0LnBhcmVudE5vZGUgKSB8fCBjb250ZXh0XG5cdCk7XG5cdHJldHVybiByZXN1bHRzO1xufTtcblxuLy8gT25lLXRpbWUgYXNzaWdubWVudHNcblxuLy8gU29ydCBzdGFiaWxpdHlcbnN1cHBvcnQuc29ydFN0YWJsZSA9IGV4cGFuZG8uc3BsaXQoXCJcIikuc29ydCggc29ydE9yZGVyICkuam9pbihcIlwiKSA9PT0gZXhwYW5kbztcblxuLy8gU3VwcG9ydDogQ2hyb21lIDE0LTM1K1xuLy8gQWx3YXlzIGFzc3VtZSBkdXBsaWNhdGVzIGlmIHRoZXkgYXJlbid0IHBhc3NlZCB0byB0aGUgY29tcGFyaXNvbiBmdW5jdGlvblxuc3VwcG9ydC5kZXRlY3REdXBsaWNhdGVzID0gISFoYXNEdXBsaWNhdGU7XG5cbi8vIEluaXRpYWxpemUgYWdhaW5zdCB0aGUgZGVmYXVsdCBkb2N1bWVudFxuc2V0RG9jdW1lbnQoKTtcblxuLy8gU3VwcG9ydDogV2Via2l0PDUzNy4zMiAtIFNhZmFyaSA2LjAuMy9DaHJvbWUgMjUgKGZpeGVkIGluIENocm9tZSAyNylcbi8vIERldGFjaGVkIG5vZGVzIGNvbmZvdW5kaW5nbHkgZm9sbG93ICplYWNoIG90aGVyKlxuc3VwcG9ydC5zb3J0RGV0YWNoZWQgPSBhc3NlcnQoZnVuY3Rpb24oIGRpdjEgKSB7XG5cdC8vIFNob3VsZCByZXR1cm4gMSwgYnV0IHJldHVybnMgNCAoZm9sbG93aW5nKVxuXHRyZXR1cm4gZGl2MS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiggZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSApICYgMTtcbn0pO1xuXG4vLyBTdXBwb3J0OiBJRTw4XG4vLyBQcmV2ZW50IGF0dHJpYnV0ZS9wcm9wZXJ0eSBcImludGVycG9sYXRpb25cIlxuLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L21zNTM2NDI5JTI4VlMuODUlMjkuYXNweFxuaWYgKCAhYXNzZXJ0KGZ1bmN0aW9uKCBkaXYgKSB7XG5cdGRpdi5pbm5lckhUTUwgPSBcIjxhIGhyZWY9JyMnPjwvYT5cIjtcblx0cmV0dXJuIGRpdi5maXJzdENoaWxkLmdldEF0dHJpYnV0ZShcImhyZWZcIikgPT09IFwiI1wiIDtcbn0pICkge1xuXHRhZGRIYW5kbGUoIFwidHlwZXxocmVmfGhlaWdodHx3aWR0aFwiLCBmdW5jdGlvbiggZWxlbSwgbmFtZSwgaXNYTUwgKSB7XG5cdFx0aWYgKCAhaXNYTUwgKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5nZXRBdHRyaWJ1dGUoIG5hbWUsIG5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJ0eXBlXCIgPyAxIDogMiApO1xuXHRcdH1cblx0fSk7XG59XG5cbi8vIFN1cHBvcnQ6IElFPDlcbi8vIFVzZSBkZWZhdWx0VmFsdWUgaW4gcGxhY2Ugb2YgZ2V0QXR0cmlidXRlKFwidmFsdWVcIilcbmlmICggIXN1cHBvcnQuYXR0cmlidXRlcyB8fCAhYXNzZXJ0KGZ1bmN0aW9uKCBkaXYgKSB7XG5cdGRpdi5pbm5lckhUTUwgPSBcIjxpbnB1dC8+XCI7XG5cdGRpdi5maXJzdENoaWxkLnNldEF0dHJpYnV0ZSggXCJ2YWx1ZVwiLCBcIlwiICk7XG5cdHJldHVybiBkaXYuZmlyc3RDaGlsZC5nZXRBdHRyaWJ1dGUoIFwidmFsdWVcIiApID09PSBcIlwiO1xufSkgKSB7XG5cdGFkZEhhbmRsZSggXCJ2YWx1ZVwiLCBmdW5jdGlvbiggZWxlbSwgbmFtZSwgaXNYTUwgKSB7XG5cdFx0aWYgKCAhaXNYTUwgJiYgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImlucHV0XCIgKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5kZWZhdWx0VmFsdWU7XG5cdFx0fVxuXHR9KTtcbn1cblxuLy8gU3VwcG9ydDogSUU8OVxuLy8gVXNlIGdldEF0dHJpYnV0ZU5vZGUgdG8gZmV0Y2ggYm9vbGVhbnMgd2hlbiBnZXRBdHRyaWJ1dGUgbGllc1xuaWYgKCAhYXNzZXJ0KGZ1bmN0aW9uKCBkaXYgKSB7XG5cdHJldHVybiBkaXYuZ2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIikgPT0gbnVsbDtcbn0pICkge1xuXHRhZGRIYW5kbGUoIGJvb2xlYW5zLCBmdW5jdGlvbiggZWxlbSwgbmFtZSwgaXNYTUwgKSB7XG5cdFx0dmFyIHZhbDtcblx0XHRpZiAoICFpc1hNTCApIHtcblx0XHRcdHJldHVybiBlbGVtWyBuYW1lIF0gPT09IHRydWUgPyBuYW1lLnRvTG93ZXJDYXNlKCkgOlxuXHRcdFx0XHRcdCh2YWwgPSBlbGVtLmdldEF0dHJpYnV0ZU5vZGUoIG5hbWUgKSkgJiYgdmFsLnNwZWNpZmllZCA/XG5cdFx0XHRcdFx0dmFsLnZhbHVlIDpcblx0XHRcdFx0bnVsbDtcblx0XHR9XG5cdH0pO1xufVxuXG5yZXR1cm4gU2l6emxlO1xuXG59KSggd2luZG93ICk7XG5cblxuXG5qUXVlcnkuZmluZCA9IFNpenpsZTtcbmpRdWVyeS5leHByID0gU2l6emxlLnNlbGVjdG9ycztcbmpRdWVyeS5leHByWyBcIjpcIiBdID0galF1ZXJ5LmV4cHIucHNldWRvcztcbmpRdWVyeS51bmlxdWVTb3J0ID0galF1ZXJ5LnVuaXF1ZSA9IFNpenpsZS51bmlxdWVTb3J0O1xualF1ZXJ5LnRleHQgPSBTaXp6bGUuZ2V0VGV4dDtcbmpRdWVyeS5pc1hNTERvYyA9IFNpenpsZS5pc1hNTDtcbmpRdWVyeS5jb250YWlucyA9IFNpenpsZS5jb250YWlucztcblxuXG5cbnZhciBkaXIgPSBmdW5jdGlvbiggZWxlbSwgZGlyLCB1bnRpbCApIHtcblx0dmFyIG1hdGNoZWQgPSBbXSxcblx0XHR0cnVuY2F0ZSA9IHVudGlsICE9PSB1bmRlZmluZWQ7XG5cblx0d2hpbGUgKCAoIGVsZW0gPSBlbGVtWyBkaXIgXSApICYmIGVsZW0ubm9kZVR5cGUgIT09IDkgKSB7XG5cdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxICkge1xuXHRcdFx0aWYgKCB0cnVuY2F0ZSAmJiBqUXVlcnkoIGVsZW0gKS5pcyggdW50aWwgKSApIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRtYXRjaGVkLnB1c2goIGVsZW0gKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG1hdGNoZWQ7XG59O1xuXG5cbnZhciBzaWJsaW5ncyA9IGZ1bmN0aW9uKCBuLCBlbGVtICkge1xuXHR2YXIgbWF0Y2hlZCA9IFtdO1xuXG5cdGZvciAoIDsgbjsgbiA9IG4ubmV4dFNpYmxpbmcgKSB7XG5cdFx0aWYgKCBuLm5vZGVUeXBlID09PSAxICYmIG4gIT09IGVsZW0gKSB7XG5cdFx0XHRtYXRjaGVkLnB1c2goIG4gKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gbWF0Y2hlZDtcbn07XG5cblxudmFyIHJuZWVkc0NvbnRleHQgPSBqUXVlcnkuZXhwci5tYXRjaC5uZWVkc0NvbnRleHQ7XG5cbnZhciByc2luZ2xlVGFnID0gKCAvXjwoW1xcdy1dKylcXHMqXFwvPz4oPzo8XFwvXFwxPnwpJC8gKTtcblxuXG5cbnZhciByaXNTaW1wbGUgPSAvXi5bXjojXFxbXFwuLF0qJC87XG5cbi8vIEltcGxlbWVudCB0aGUgaWRlbnRpY2FsIGZ1bmN0aW9uYWxpdHkgZm9yIGZpbHRlciBhbmQgbm90XG5mdW5jdGlvbiB3aW5ub3coIGVsZW1lbnRzLCBxdWFsaWZpZXIsIG5vdCApIHtcblx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggcXVhbGlmaWVyICkgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5ncmVwKCBlbGVtZW50cywgZnVuY3Rpb24oIGVsZW0sIGkgKSB7XG5cdFx0XHQvKiBqc2hpbnQgLVcwMTggKi9cblx0XHRcdHJldHVybiAhIXF1YWxpZmllci5jYWxsKCBlbGVtLCBpLCBlbGVtICkgIT09IG5vdDtcblx0XHR9ICk7XG5cblx0fVxuXG5cdGlmICggcXVhbGlmaWVyLm5vZGVUeXBlICkge1xuXHRcdHJldHVybiBqUXVlcnkuZ3JlcCggZWxlbWVudHMsIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuICggZWxlbSA9PT0gcXVhbGlmaWVyICkgIT09IG5vdDtcblx0XHR9ICk7XG5cblx0fVxuXG5cdGlmICggdHlwZW9mIHF1YWxpZmllciA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRpZiAoIHJpc1NpbXBsZS50ZXN0KCBxdWFsaWZpZXIgKSApIHtcblx0XHRcdHJldHVybiBqUXVlcnkuZmlsdGVyKCBxdWFsaWZpZXIsIGVsZW1lbnRzLCBub3QgKTtcblx0XHR9XG5cblx0XHRxdWFsaWZpZXIgPSBqUXVlcnkuZmlsdGVyKCBxdWFsaWZpZXIsIGVsZW1lbnRzICk7XG5cdH1cblxuXHRyZXR1cm4galF1ZXJ5LmdyZXAoIGVsZW1lbnRzLCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRyZXR1cm4gKCBpbmRleE9mLmNhbGwoIHF1YWxpZmllciwgZWxlbSApID4gLTEgKSAhPT0gbm90O1xuXHR9ICk7XG59XG5cbmpRdWVyeS5maWx0ZXIgPSBmdW5jdGlvbiggZXhwciwgZWxlbXMsIG5vdCApIHtcblx0dmFyIGVsZW0gPSBlbGVtc1sgMCBdO1xuXG5cdGlmICggbm90ICkge1xuXHRcdGV4cHIgPSBcIjpub3QoXCIgKyBleHByICsgXCIpXCI7XG5cdH1cblxuXHRyZXR1cm4gZWxlbXMubGVuZ3RoID09PSAxICYmIGVsZW0ubm9kZVR5cGUgPT09IDEgP1xuXHRcdGpRdWVyeS5maW5kLm1hdGNoZXNTZWxlY3RvciggZWxlbSwgZXhwciApID8gWyBlbGVtIF0gOiBbXSA6XG5cdFx0alF1ZXJ5LmZpbmQubWF0Y2hlcyggZXhwciwgalF1ZXJ5LmdyZXAoIGVsZW1zLCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtLm5vZGVUeXBlID09PSAxO1xuXHRcdH0gKSApO1xufTtcblxualF1ZXJ5LmZuLmV4dGVuZCgge1xuXHRmaW5kOiBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XG5cdFx0dmFyIGksXG5cdFx0XHRsZW4gPSB0aGlzLmxlbmd0aCxcblx0XHRcdHJldCA9IFtdLFxuXHRcdFx0c2VsZiA9IHRoaXM7XG5cblx0XHRpZiAoIHR5cGVvZiBzZWxlY3RvciAhPT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdHJldHVybiB0aGlzLnB1c2hTdGFjayggalF1ZXJ5KCBzZWxlY3RvciApLmZpbHRlciggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGZvciAoIGkgPSAwOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0XHRcdFx0aWYgKCBqUXVlcnkuY29udGFpbnMoIHNlbGZbIGkgXSwgdGhpcyApICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9ICkgKTtcblx0XHR9XG5cblx0XHRmb3IgKCBpID0gMDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFx0alF1ZXJ5LmZpbmQoIHNlbGVjdG9yLCBzZWxmWyBpIF0sIHJldCApO1xuXHRcdH1cblxuXHRcdC8vIE5lZWRlZCBiZWNhdXNlICQoIHNlbGVjdG9yLCBjb250ZXh0ICkgYmVjb21lcyAkKCBjb250ZXh0ICkuZmluZCggc2VsZWN0b3IgKVxuXHRcdHJldCA9IHRoaXMucHVzaFN0YWNrKCBsZW4gPiAxID8galF1ZXJ5LnVuaXF1ZSggcmV0ICkgOiByZXQgKTtcblx0XHRyZXQuc2VsZWN0b3IgPSB0aGlzLnNlbGVjdG9yID8gdGhpcy5zZWxlY3RvciArIFwiIFwiICsgc2VsZWN0b3IgOiBzZWxlY3Rvcjtcblx0XHRyZXR1cm4gcmV0O1xuXHR9LFxuXHRmaWx0ZXI6IGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcblx0XHRyZXR1cm4gdGhpcy5wdXNoU3RhY2soIHdpbm5vdyggdGhpcywgc2VsZWN0b3IgfHwgW10sIGZhbHNlICkgKTtcblx0fSxcblx0bm90OiBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XG5cdFx0cmV0dXJuIHRoaXMucHVzaFN0YWNrKCB3aW5ub3coIHRoaXMsIHNlbGVjdG9yIHx8IFtdLCB0cnVlICkgKTtcblx0fSxcblx0aXM6IGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcblx0XHRyZXR1cm4gISF3aW5ub3coXG5cdFx0XHR0aGlzLFxuXG5cdFx0XHQvLyBJZiB0aGlzIGlzIGEgcG9zaXRpb25hbC9yZWxhdGl2ZSBzZWxlY3RvciwgY2hlY2sgbWVtYmVyc2hpcCBpbiB0aGUgcmV0dXJuZWQgc2V0XG5cdFx0XHQvLyBzbyAkKFwicDpmaXJzdFwiKS5pcyhcInA6bGFzdFwiKSB3b24ndCByZXR1cm4gdHJ1ZSBmb3IgYSBkb2Mgd2l0aCB0d28gXCJwXCIuXG5cdFx0XHR0eXBlb2Ygc2VsZWN0b3IgPT09IFwic3RyaW5nXCIgJiYgcm5lZWRzQ29udGV4dC50ZXN0KCBzZWxlY3RvciApID9cblx0XHRcdFx0alF1ZXJ5KCBzZWxlY3RvciApIDpcblx0XHRcdFx0c2VsZWN0b3IgfHwgW10sXG5cdFx0XHRmYWxzZVxuXHRcdCkubGVuZ3RoO1xuXHR9XG59ICk7XG5cblxuLy8gSW5pdGlhbGl6ZSBhIGpRdWVyeSBvYmplY3RcblxuXG4vLyBBIGNlbnRyYWwgcmVmZXJlbmNlIHRvIHRoZSByb290IGpRdWVyeShkb2N1bWVudClcbnZhciByb290alF1ZXJ5LFxuXG5cdC8vIEEgc2ltcGxlIHdheSB0byBjaGVjayBmb3IgSFRNTCBzdHJpbmdzXG5cdC8vIFByaW9yaXRpemUgI2lkIG92ZXIgPHRhZz4gdG8gYXZvaWQgWFNTIHZpYSBsb2NhdGlvbi5oYXNoICgjOTUyMSlcblx0Ly8gU3RyaWN0IEhUTUwgcmVjb2duaXRpb24gKCMxMTI5MDogbXVzdCBzdGFydCB3aXRoIDwpXG5cdHJxdWlja0V4cHIgPSAvXig/OlxccyooPFtcXHdcXFddKz4pW14+XSp8IyhbXFx3LV0qKSkkLyxcblxuXHRpbml0ID0galF1ZXJ5LmZuLmluaXQgPSBmdW5jdGlvbiggc2VsZWN0b3IsIGNvbnRleHQsIHJvb3QgKSB7XG5cdFx0dmFyIG1hdGNoLCBlbGVtO1xuXG5cdFx0Ly8gSEFORExFOiAkKFwiXCIpLCAkKG51bGwpLCAkKHVuZGVmaW5lZCksICQoZmFsc2UpXG5cdFx0aWYgKCAhc2VsZWN0b3IgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cblx0XHQvLyBNZXRob2QgaW5pdCgpIGFjY2VwdHMgYW4gYWx0ZXJuYXRlIHJvb3RqUXVlcnlcblx0XHQvLyBzbyBtaWdyYXRlIGNhbiBzdXBwb3J0IGpRdWVyeS5zdWIgKGdoLTIxMDEpXG5cdFx0cm9vdCA9IHJvb3QgfHwgcm9vdGpRdWVyeTtcblxuXHRcdC8vIEhhbmRsZSBIVE1MIHN0cmluZ3Ncblx0XHRpZiAoIHR5cGVvZiBzZWxlY3RvciA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdGlmICggc2VsZWN0b3JbIDAgXSA9PT0gXCI8XCIgJiZcblx0XHRcdFx0c2VsZWN0b3JbIHNlbGVjdG9yLmxlbmd0aCAtIDEgXSA9PT0gXCI+XCIgJiZcblx0XHRcdFx0c2VsZWN0b3IubGVuZ3RoID49IDMgKSB7XG5cblx0XHRcdFx0Ly8gQXNzdW1lIHRoYXQgc3RyaW5ncyB0aGF0IHN0YXJ0IGFuZCBlbmQgd2l0aCA8PiBhcmUgSFRNTCBhbmQgc2tpcCB0aGUgcmVnZXggY2hlY2tcblx0XHRcdFx0bWF0Y2ggPSBbIG51bGwsIHNlbGVjdG9yLCBudWxsIF07XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1hdGNoID0gcnF1aWNrRXhwci5leGVjKCBzZWxlY3RvciApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBNYXRjaCBodG1sIG9yIG1ha2Ugc3VyZSBubyBjb250ZXh0IGlzIHNwZWNpZmllZCBmb3IgI2lkXG5cdFx0XHRpZiAoIG1hdGNoICYmICggbWF0Y2hbIDEgXSB8fCAhY29udGV4dCApICkge1xuXG5cdFx0XHRcdC8vIEhBTkRMRTogJChodG1sKSAtPiAkKGFycmF5KVxuXHRcdFx0XHRpZiAoIG1hdGNoWyAxIF0gKSB7XG5cdFx0XHRcdFx0Y29udGV4dCA9IGNvbnRleHQgaW5zdGFuY2VvZiBqUXVlcnkgPyBjb250ZXh0WyAwIF0gOiBjb250ZXh0O1xuXG5cdFx0XHRcdFx0Ly8gT3B0aW9uIHRvIHJ1biBzY3JpcHRzIGlzIHRydWUgZm9yIGJhY2stY29tcGF0XG5cdFx0XHRcdFx0Ly8gSW50ZW50aW9uYWxseSBsZXQgdGhlIGVycm9yIGJlIHRocm93biBpZiBwYXJzZUhUTUwgaXMgbm90IHByZXNlbnRcblx0XHRcdFx0XHRqUXVlcnkubWVyZ2UoIHRoaXMsIGpRdWVyeS5wYXJzZUhUTUwoXG5cdFx0XHRcdFx0XHRtYXRjaFsgMSBdLFxuXHRcdFx0XHRcdFx0Y29udGV4dCAmJiBjb250ZXh0Lm5vZGVUeXBlID8gY29udGV4dC5vd25lckRvY3VtZW50IHx8IGNvbnRleHQgOiBkb2N1bWVudCxcblx0XHRcdFx0XHRcdHRydWVcblx0XHRcdFx0XHQpICk7XG5cblx0XHRcdFx0XHQvLyBIQU5ETEU6ICQoaHRtbCwgcHJvcHMpXG5cdFx0XHRcdFx0aWYgKCByc2luZ2xlVGFnLnRlc3QoIG1hdGNoWyAxIF0gKSAmJiBqUXVlcnkuaXNQbGFpbk9iamVjdCggY29udGV4dCApICkge1xuXHRcdFx0XHRcdFx0Zm9yICggbWF0Y2ggaW4gY29udGV4dCApIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBQcm9wZXJ0aWVzIG9mIGNvbnRleHQgYXJlIGNhbGxlZCBhcyBtZXRob2RzIGlmIHBvc3NpYmxlXG5cdFx0XHRcdFx0XHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIHRoaXNbIG1hdGNoIF0gKSApIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzWyBtYXRjaCBdKCBjb250ZXh0WyBtYXRjaCBdICk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gLi4uYW5kIG90aGVyd2lzZSBzZXQgYXMgYXR0cmlidXRlc1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuYXR0ciggbWF0Y2gsIGNvbnRleHRbIG1hdGNoIF0gKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiB0aGlzO1xuXG5cdFx0XHRcdC8vIEhBTkRMRTogJCgjaWQpXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBtYXRjaFsgMiBdICk7XG5cblx0XHRcdFx0XHQvLyBTdXBwb3J0OiBCbGFja2JlcnJ5IDQuNlxuXHRcdFx0XHRcdC8vIGdFQklEIHJldHVybnMgbm9kZXMgbm8gbG9uZ2VyIGluIHRoZSBkb2N1bWVudCAoIzY5NjMpXG5cdFx0XHRcdFx0aWYgKCBlbGVtICYmIGVsZW0ucGFyZW50Tm9kZSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gSW5qZWN0IHRoZSBlbGVtZW50IGRpcmVjdGx5IGludG8gdGhlIGpRdWVyeSBvYmplY3Rcblx0XHRcdFx0XHRcdHRoaXMubGVuZ3RoID0gMTtcblx0XHRcdFx0XHRcdHRoaXNbIDAgXSA9IGVsZW07XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0ID0gZG9jdW1lbnQ7XG5cdFx0XHRcdFx0dGhpcy5zZWxlY3RvciA9IHNlbGVjdG9yO1xuXHRcdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0XHR9XG5cblx0XHRcdC8vIEhBTkRMRTogJChleHByLCAkKC4uLikpXG5cdFx0XHR9IGVsc2UgaWYgKCAhY29udGV4dCB8fCBjb250ZXh0LmpxdWVyeSApIHtcblx0XHRcdFx0cmV0dXJuICggY29udGV4dCB8fCByb290ICkuZmluZCggc2VsZWN0b3IgKTtcblxuXHRcdFx0Ly8gSEFORExFOiAkKGV4cHIsIGNvbnRleHQpXG5cdFx0XHQvLyAod2hpY2ggaXMganVzdCBlcXVpdmFsZW50IHRvOiAkKGNvbnRleHQpLmZpbmQoZXhwcilcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvbnN0cnVjdG9yKCBjb250ZXh0ICkuZmluZCggc2VsZWN0b3IgKTtcblx0XHRcdH1cblxuXHRcdC8vIEhBTkRMRTogJChET01FbGVtZW50KVxuXHRcdH0gZWxzZSBpZiAoIHNlbGVjdG9yLm5vZGVUeXBlICkge1xuXHRcdFx0dGhpcy5jb250ZXh0ID0gdGhpc1sgMCBdID0gc2VsZWN0b3I7XG5cdFx0XHR0aGlzLmxlbmd0aCA9IDE7XG5cdFx0XHRyZXR1cm4gdGhpcztcblxuXHRcdC8vIEhBTkRMRTogJChmdW5jdGlvbilcblx0XHQvLyBTaG9ydGN1dCBmb3IgZG9jdW1lbnQgcmVhZHlcblx0XHR9IGVsc2UgaWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggc2VsZWN0b3IgKSApIHtcblx0XHRcdHJldHVybiByb290LnJlYWR5ICE9PSB1bmRlZmluZWQgP1xuXHRcdFx0XHRyb290LnJlYWR5KCBzZWxlY3RvciApIDpcblxuXHRcdFx0XHQvLyBFeGVjdXRlIGltbWVkaWF0ZWx5IGlmIHJlYWR5IGlzIG5vdCBwcmVzZW50XG5cdFx0XHRcdHNlbGVjdG9yKCBqUXVlcnkgKTtcblx0XHR9XG5cblx0XHRpZiAoIHNlbGVjdG9yLnNlbGVjdG9yICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHR0aGlzLnNlbGVjdG9yID0gc2VsZWN0b3Iuc2VsZWN0b3I7XG5cdFx0XHR0aGlzLmNvbnRleHQgPSBzZWxlY3Rvci5jb250ZXh0O1xuXHRcdH1cblxuXHRcdHJldHVybiBqUXVlcnkubWFrZUFycmF5KCBzZWxlY3RvciwgdGhpcyApO1xuXHR9O1xuXG4vLyBHaXZlIHRoZSBpbml0IGZ1bmN0aW9uIHRoZSBqUXVlcnkgcHJvdG90eXBlIGZvciBsYXRlciBpbnN0YW50aWF0aW9uXG5pbml0LnByb3RvdHlwZSA9IGpRdWVyeS5mbjtcblxuLy8gSW5pdGlhbGl6ZSBjZW50cmFsIHJlZmVyZW5jZVxucm9vdGpRdWVyeSA9IGpRdWVyeSggZG9jdW1lbnQgKTtcblxuXG52YXIgcnBhcmVudHNwcmV2ID0gL14oPzpwYXJlbnRzfHByZXYoPzpVbnRpbHxBbGwpKS8sXG5cblx0Ly8gTWV0aG9kcyBndWFyYW50ZWVkIHRvIHByb2R1Y2UgYSB1bmlxdWUgc2V0IHdoZW4gc3RhcnRpbmcgZnJvbSBhIHVuaXF1ZSBzZXRcblx0Z3VhcmFudGVlZFVuaXF1ZSA9IHtcblx0XHRjaGlsZHJlbjogdHJ1ZSxcblx0XHRjb250ZW50czogdHJ1ZSxcblx0XHRuZXh0OiB0cnVlLFxuXHRcdHByZXY6IHRydWVcblx0fTtcblxualF1ZXJ5LmZuLmV4dGVuZCgge1xuXHRoYXM6IGZ1bmN0aW9uKCB0YXJnZXQgKSB7XG5cdFx0dmFyIHRhcmdldHMgPSBqUXVlcnkoIHRhcmdldCwgdGhpcyApLFxuXHRcdFx0bCA9IHRhcmdldHMubGVuZ3RoO1xuXG5cdFx0cmV0dXJuIHRoaXMuZmlsdGVyKCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBpID0gMDtcblx0XHRcdGZvciAoIDsgaSA8IGw7IGkrKyApIHtcblx0XHRcdFx0aWYgKCBqUXVlcnkuY29udGFpbnMoIHRoaXMsIHRhcmdldHNbIGkgXSApICkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9LFxuXG5cdGNsb3Nlc3Q6IGZ1bmN0aW9uKCBzZWxlY3RvcnMsIGNvbnRleHQgKSB7XG5cdFx0dmFyIGN1cixcblx0XHRcdGkgPSAwLFxuXHRcdFx0bCA9IHRoaXMubGVuZ3RoLFxuXHRcdFx0bWF0Y2hlZCA9IFtdLFxuXHRcdFx0cG9zID0gcm5lZWRzQ29udGV4dC50ZXN0KCBzZWxlY3RvcnMgKSB8fCB0eXBlb2Ygc2VsZWN0b3JzICE9PSBcInN0cmluZ1wiID9cblx0XHRcdFx0alF1ZXJ5KCBzZWxlY3RvcnMsIGNvbnRleHQgfHwgdGhpcy5jb250ZXh0ICkgOlxuXHRcdFx0XHQwO1xuXG5cdFx0Zm9yICggOyBpIDwgbDsgaSsrICkge1xuXHRcdFx0Zm9yICggY3VyID0gdGhpc1sgaSBdOyBjdXIgJiYgY3VyICE9PSBjb250ZXh0OyBjdXIgPSBjdXIucGFyZW50Tm9kZSApIHtcblxuXHRcdFx0XHQvLyBBbHdheXMgc2tpcCBkb2N1bWVudCBmcmFnbWVudHNcblx0XHRcdFx0aWYgKCBjdXIubm9kZVR5cGUgPCAxMSAmJiAoIHBvcyA/XG5cdFx0XHRcdFx0cG9zLmluZGV4KCBjdXIgKSA+IC0xIDpcblxuXHRcdFx0XHRcdC8vIERvbid0IHBhc3Mgbm9uLWVsZW1lbnRzIHRvIFNpenpsZVxuXHRcdFx0XHRcdGN1ci5ub2RlVHlwZSA9PT0gMSAmJlxuXHRcdFx0XHRcdFx0alF1ZXJ5LmZpbmQubWF0Y2hlc1NlbGVjdG9yKCBjdXIsIHNlbGVjdG9ycyApICkgKSB7XG5cblx0XHRcdFx0XHRtYXRjaGVkLnB1c2goIGN1ciApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMucHVzaFN0YWNrKCBtYXRjaGVkLmxlbmd0aCA+IDEgPyBqUXVlcnkudW5pcXVlU29ydCggbWF0Y2hlZCApIDogbWF0Y2hlZCApO1xuXHR9LFxuXG5cdC8vIERldGVybWluZSB0aGUgcG9zaXRpb24gb2YgYW4gZWxlbWVudCB3aXRoaW4gdGhlIHNldFxuXHRpbmRleDogZnVuY3Rpb24oIGVsZW0gKSB7XG5cblx0XHQvLyBObyBhcmd1bWVudCwgcmV0dXJuIGluZGV4IGluIHBhcmVudFxuXHRcdGlmICggIWVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gKCB0aGlzWyAwIF0gJiYgdGhpc1sgMCBdLnBhcmVudE5vZGUgKSA/IHRoaXMuZmlyc3QoKS5wcmV2QWxsKCkubGVuZ3RoIDogLTE7XG5cdFx0fVxuXG5cdFx0Ly8gSW5kZXggaW4gc2VsZWN0b3Jcblx0XHRpZiAoIHR5cGVvZiBlbGVtID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0cmV0dXJuIGluZGV4T2YuY2FsbCggalF1ZXJ5KCBlbGVtICksIHRoaXNbIDAgXSApO1xuXHRcdH1cblxuXHRcdC8vIExvY2F0ZSB0aGUgcG9zaXRpb24gb2YgdGhlIGRlc2lyZWQgZWxlbWVudFxuXHRcdHJldHVybiBpbmRleE9mLmNhbGwoIHRoaXMsXG5cblx0XHRcdC8vIElmIGl0IHJlY2VpdmVzIGEgalF1ZXJ5IG9iamVjdCwgdGhlIGZpcnN0IGVsZW1lbnQgaXMgdXNlZFxuXHRcdFx0ZWxlbS5qcXVlcnkgPyBlbGVtWyAwIF0gOiBlbGVtXG5cdFx0KTtcblx0fSxcblxuXHRhZGQ6IGZ1bmN0aW9uKCBzZWxlY3RvciwgY29udGV4dCApIHtcblx0XHRyZXR1cm4gdGhpcy5wdXNoU3RhY2soXG5cdFx0XHRqUXVlcnkudW5pcXVlU29ydChcblx0XHRcdFx0alF1ZXJ5Lm1lcmdlKCB0aGlzLmdldCgpLCBqUXVlcnkoIHNlbGVjdG9yLCBjb250ZXh0ICkgKVxuXHRcdFx0KVxuXHRcdCk7XG5cdH0sXG5cblx0YWRkQmFjazogZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXHRcdHJldHVybiB0aGlzLmFkZCggc2VsZWN0b3IgPT0gbnVsbCA/XG5cdFx0XHR0aGlzLnByZXZPYmplY3QgOiB0aGlzLnByZXZPYmplY3QuZmlsdGVyKCBzZWxlY3RvciApXG5cdFx0KTtcblx0fVxufSApO1xuXG5mdW5jdGlvbiBzaWJsaW5nKCBjdXIsIGRpciApIHtcblx0d2hpbGUgKCAoIGN1ciA9IGN1clsgZGlyIF0gKSAmJiBjdXIubm9kZVR5cGUgIT09IDEgKSB7fVxuXHRyZXR1cm4gY3VyO1xufVxuXG5qUXVlcnkuZWFjaCgge1xuXHRwYXJlbnQ6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHZhciBwYXJlbnQgPSBlbGVtLnBhcmVudE5vZGU7XG5cdFx0cmV0dXJuIHBhcmVudCAmJiBwYXJlbnQubm9kZVR5cGUgIT09IDExID8gcGFyZW50IDogbnVsbDtcblx0fSxcblx0cGFyZW50czogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0cmV0dXJuIGRpciggZWxlbSwgXCJwYXJlbnROb2RlXCIgKTtcblx0fSxcblx0cGFyZW50c1VudGlsOiBmdW5jdGlvbiggZWxlbSwgaSwgdW50aWwgKSB7XG5cdFx0cmV0dXJuIGRpciggZWxlbSwgXCJwYXJlbnROb2RlXCIsIHVudGlsICk7XG5cdH0sXG5cdG5leHQ6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHJldHVybiBzaWJsaW5nKCBlbGVtLCBcIm5leHRTaWJsaW5nXCIgKTtcblx0fSxcblx0cHJldjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0cmV0dXJuIHNpYmxpbmcoIGVsZW0sIFwicHJldmlvdXNTaWJsaW5nXCIgKTtcblx0fSxcblx0bmV4dEFsbDogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0cmV0dXJuIGRpciggZWxlbSwgXCJuZXh0U2libGluZ1wiICk7XG5cdH0sXG5cdHByZXZBbGw6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHJldHVybiBkaXIoIGVsZW0sIFwicHJldmlvdXNTaWJsaW5nXCIgKTtcblx0fSxcblx0bmV4dFVudGlsOiBmdW5jdGlvbiggZWxlbSwgaSwgdW50aWwgKSB7XG5cdFx0cmV0dXJuIGRpciggZWxlbSwgXCJuZXh0U2libGluZ1wiLCB1bnRpbCApO1xuXHR9LFxuXHRwcmV2VW50aWw6IGZ1bmN0aW9uKCBlbGVtLCBpLCB1bnRpbCApIHtcblx0XHRyZXR1cm4gZGlyKCBlbGVtLCBcInByZXZpb3VzU2libGluZ1wiLCB1bnRpbCApO1xuXHR9LFxuXHRzaWJsaW5nczogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0cmV0dXJuIHNpYmxpbmdzKCAoIGVsZW0ucGFyZW50Tm9kZSB8fCB7fSApLmZpcnN0Q2hpbGQsIGVsZW0gKTtcblx0fSxcblx0Y2hpbGRyZW46IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHJldHVybiBzaWJsaW5ncyggZWxlbS5maXJzdENoaWxkICk7XG5cdH0sXG5cdGNvbnRlbnRzOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRyZXR1cm4gZWxlbS5jb250ZW50RG9jdW1lbnQgfHwgalF1ZXJ5Lm1lcmdlKCBbXSwgZWxlbS5jaGlsZE5vZGVzICk7XG5cdH1cbn0sIGZ1bmN0aW9uKCBuYW1lLCBmbiApIHtcblx0alF1ZXJ5LmZuWyBuYW1lIF0gPSBmdW5jdGlvbiggdW50aWwsIHNlbGVjdG9yICkge1xuXHRcdHZhciBtYXRjaGVkID0galF1ZXJ5Lm1hcCggdGhpcywgZm4sIHVudGlsICk7XG5cblx0XHRpZiAoIG5hbWUuc2xpY2UoIC01ICkgIT09IFwiVW50aWxcIiApIHtcblx0XHRcdHNlbGVjdG9yID0gdW50aWw7XG5cdFx0fVxuXG5cdFx0aWYgKCBzZWxlY3RvciAmJiB0eXBlb2Ygc2VsZWN0b3IgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRtYXRjaGVkID0galF1ZXJ5LmZpbHRlciggc2VsZWN0b3IsIG1hdGNoZWQgKTtcblx0XHR9XG5cblx0XHRpZiAoIHRoaXMubGVuZ3RoID4gMSApIHtcblxuXHRcdFx0Ly8gUmVtb3ZlIGR1cGxpY2F0ZXNcblx0XHRcdGlmICggIWd1YXJhbnRlZWRVbmlxdWVbIG5hbWUgXSApIHtcblx0XHRcdFx0alF1ZXJ5LnVuaXF1ZVNvcnQoIG1hdGNoZWQgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmV2ZXJzZSBvcmRlciBmb3IgcGFyZW50cyogYW5kIHByZXYtZGVyaXZhdGl2ZXNcblx0XHRcdGlmICggcnBhcmVudHNwcmV2LnRlc3QoIG5hbWUgKSApIHtcblx0XHRcdFx0bWF0Y2hlZC5yZXZlcnNlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMucHVzaFN0YWNrKCBtYXRjaGVkICk7XG5cdH07XG59ICk7XG52YXIgcm5vdHdoaXRlID0gKCAvXFxTKy9nICk7XG5cblxuXG4vLyBDb252ZXJ0IFN0cmluZy1mb3JtYXR0ZWQgb3B0aW9ucyBpbnRvIE9iamVjdC1mb3JtYXR0ZWQgb25lc1xuZnVuY3Rpb24gY3JlYXRlT3B0aW9ucyggb3B0aW9ucyApIHtcblx0dmFyIG9iamVjdCA9IHt9O1xuXHRqUXVlcnkuZWFjaCggb3B0aW9ucy5tYXRjaCggcm5vdHdoaXRlICkgfHwgW10sIGZ1bmN0aW9uKCBfLCBmbGFnICkge1xuXHRcdG9iamVjdFsgZmxhZyBdID0gdHJ1ZTtcblx0fSApO1xuXHRyZXR1cm4gb2JqZWN0O1xufVxuXG4vKlxuICogQ3JlYXRlIGEgY2FsbGJhY2sgbGlzdCB1c2luZyB0aGUgZm9sbG93aW5nIHBhcmFtZXRlcnM6XG4gKlxuICpcdG9wdGlvbnM6IGFuIG9wdGlvbmFsIGxpc3Qgb2Ygc3BhY2Utc2VwYXJhdGVkIG9wdGlvbnMgdGhhdCB3aWxsIGNoYW5nZSBob3dcbiAqXHRcdFx0dGhlIGNhbGxiYWNrIGxpc3QgYmVoYXZlcyBvciBhIG1vcmUgdHJhZGl0aW9uYWwgb3B0aW9uIG9iamVjdFxuICpcbiAqIEJ5IGRlZmF1bHQgYSBjYWxsYmFjayBsaXN0IHdpbGwgYWN0IGxpa2UgYW4gZXZlbnQgY2FsbGJhY2sgbGlzdCBhbmQgY2FuIGJlXG4gKiBcImZpcmVkXCIgbXVsdGlwbGUgdGltZXMuXG4gKlxuICogUG9zc2libGUgb3B0aW9uczpcbiAqXG4gKlx0b25jZTpcdFx0XHR3aWxsIGVuc3VyZSB0aGUgY2FsbGJhY2sgbGlzdCBjYW4gb25seSBiZSBmaXJlZCBvbmNlIChsaWtlIGEgRGVmZXJyZWQpXG4gKlxuICpcdG1lbW9yeTpcdFx0XHR3aWxsIGtlZXAgdHJhY2sgb2YgcHJldmlvdXMgdmFsdWVzIGFuZCB3aWxsIGNhbGwgYW55IGNhbGxiYWNrIGFkZGVkXG4gKlx0XHRcdFx0XHRhZnRlciB0aGUgbGlzdCBoYXMgYmVlbiBmaXJlZCByaWdodCBhd2F5IHdpdGggdGhlIGxhdGVzdCBcIm1lbW9yaXplZFwiXG4gKlx0XHRcdFx0XHR2YWx1ZXMgKGxpa2UgYSBEZWZlcnJlZClcbiAqXG4gKlx0dW5pcXVlOlx0XHRcdHdpbGwgZW5zdXJlIGEgY2FsbGJhY2sgY2FuIG9ubHkgYmUgYWRkZWQgb25jZSAobm8gZHVwbGljYXRlIGluIHRoZSBsaXN0KVxuICpcbiAqXHRzdG9wT25GYWxzZTpcdGludGVycnVwdCBjYWxsaW5ncyB3aGVuIGEgY2FsbGJhY2sgcmV0dXJucyBmYWxzZVxuICpcbiAqL1xualF1ZXJ5LkNhbGxiYWNrcyA9IGZ1bmN0aW9uKCBvcHRpb25zICkge1xuXG5cdC8vIENvbnZlcnQgb3B0aW9ucyBmcm9tIFN0cmluZy1mb3JtYXR0ZWQgdG8gT2JqZWN0LWZvcm1hdHRlZCBpZiBuZWVkZWRcblx0Ly8gKHdlIGNoZWNrIGluIGNhY2hlIGZpcnN0KVxuXHRvcHRpb25zID0gdHlwZW9mIG9wdGlvbnMgPT09IFwic3RyaW5nXCIgP1xuXHRcdGNyZWF0ZU9wdGlvbnMoIG9wdGlvbnMgKSA6XG5cdFx0alF1ZXJ5LmV4dGVuZCgge30sIG9wdGlvbnMgKTtcblxuXHR2YXIgLy8gRmxhZyB0byBrbm93IGlmIGxpc3QgaXMgY3VycmVudGx5IGZpcmluZ1xuXHRcdGZpcmluZyxcblxuXHRcdC8vIExhc3QgZmlyZSB2YWx1ZSBmb3Igbm9uLWZvcmdldHRhYmxlIGxpc3RzXG5cdFx0bWVtb3J5LFxuXG5cdFx0Ly8gRmxhZyB0byBrbm93IGlmIGxpc3Qgd2FzIGFscmVhZHkgZmlyZWRcblx0XHRmaXJlZCxcblxuXHRcdC8vIEZsYWcgdG8gcHJldmVudCBmaXJpbmdcblx0XHRsb2NrZWQsXG5cblx0XHQvLyBBY3R1YWwgY2FsbGJhY2sgbGlzdFxuXHRcdGxpc3QgPSBbXSxcblxuXHRcdC8vIFF1ZXVlIG9mIGV4ZWN1dGlvbiBkYXRhIGZvciByZXBlYXRhYmxlIGxpc3RzXG5cdFx0cXVldWUgPSBbXSxcblxuXHRcdC8vIEluZGV4IG9mIGN1cnJlbnRseSBmaXJpbmcgY2FsbGJhY2sgKG1vZGlmaWVkIGJ5IGFkZC9yZW1vdmUgYXMgbmVlZGVkKVxuXHRcdGZpcmluZ0luZGV4ID0gLTEsXG5cblx0XHQvLyBGaXJlIGNhbGxiYWNrc1xuXHRcdGZpcmUgPSBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gRW5mb3JjZSBzaW5nbGUtZmlyaW5nXG5cdFx0XHRsb2NrZWQgPSBvcHRpb25zLm9uY2U7XG5cblx0XHRcdC8vIEV4ZWN1dGUgY2FsbGJhY2tzIGZvciBhbGwgcGVuZGluZyBleGVjdXRpb25zLFxuXHRcdFx0Ly8gcmVzcGVjdGluZyBmaXJpbmdJbmRleCBvdmVycmlkZXMgYW5kIHJ1bnRpbWUgY2hhbmdlc1xuXHRcdFx0ZmlyZWQgPSBmaXJpbmcgPSB0cnVlO1xuXHRcdFx0Zm9yICggOyBxdWV1ZS5sZW5ndGg7IGZpcmluZ0luZGV4ID0gLTEgKSB7XG5cdFx0XHRcdG1lbW9yeSA9IHF1ZXVlLnNoaWZ0KCk7XG5cdFx0XHRcdHdoaWxlICggKytmaXJpbmdJbmRleCA8IGxpc3QubGVuZ3RoICkge1xuXG5cdFx0XHRcdFx0Ly8gUnVuIGNhbGxiYWNrIGFuZCBjaGVjayBmb3IgZWFybHkgdGVybWluYXRpb25cblx0XHRcdFx0XHRpZiAoIGxpc3RbIGZpcmluZ0luZGV4IF0uYXBwbHkoIG1lbW9yeVsgMCBdLCBtZW1vcnlbIDEgXSApID09PSBmYWxzZSAmJlxuXHRcdFx0XHRcdFx0b3B0aW9ucy5zdG9wT25GYWxzZSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gSnVtcCB0byBlbmQgYW5kIGZvcmdldCB0aGUgZGF0YSBzbyAuYWRkIGRvZXNuJ3QgcmUtZmlyZVxuXHRcdFx0XHRcdFx0ZmlyaW5nSW5kZXggPSBsaXN0Lmxlbmd0aDtcblx0XHRcdFx0XHRcdG1lbW9yeSA9IGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JnZXQgdGhlIGRhdGEgaWYgd2UncmUgZG9uZSB3aXRoIGl0XG5cdFx0XHRpZiAoICFvcHRpb25zLm1lbW9yeSApIHtcblx0XHRcdFx0bWVtb3J5ID0gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdGZpcmluZyA9IGZhbHNlO1xuXG5cdFx0XHQvLyBDbGVhbiB1cCBpZiB3ZSdyZSBkb25lIGZpcmluZyBmb3IgZ29vZFxuXHRcdFx0aWYgKCBsb2NrZWQgKSB7XG5cblx0XHRcdFx0Ly8gS2VlcCBhbiBlbXB0eSBsaXN0IGlmIHdlIGhhdmUgZGF0YSBmb3IgZnV0dXJlIGFkZCBjYWxsc1xuXHRcdFx0XHRpZiAoIG1lbW9yeSApIHtcblx0XHRcdFx0XHRsaXN0ID0gW107XG5cblx0XHRcdFx0Ly8gT3RoZXJ3aXNlLCB0aGlzIG9iamVjdCBpcyBzcGVudFxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGxpc3QgPSBcIlwiO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdC8vIEFjdHVhbCBDYWxsYmFja3Mgb2JqZWN0XG5cdFx0c2VsZiA9IHtcblxuXHRcdFx0Ly8gQWRkIGEgY2FsbGJhY2sgb3IgYSBjb2xsZWN0aW9uIG9mIGNhbGxiYWNrcyB0byB0aGUgbGlzdFxuXHRcdFx0YWRkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCBsaXN0ICkge1xuXG5cdFx0XHRcdFx0Ly8gSWYgd2UgaGF2ZSBtZW1vcnkgZnJvbSBhIHBhc3QgcnVuLCB3ZSBzaG91bGQgZmlyZSBhZnRlciBhZGRpbmdcblx0XHRcdFx0XHRpZiAoIG1lbW9yeSAmJiAhZmlyaW5nICkge1xuXHRcdFx0XHRcdFx0ZmlyaW5nSW5kZXggPSBsaXN0Lmxlbmd0aCAtIDE7XG5cdFx0XHRcdFx0XHRxdWV1ZS5wdXNoKCBtZW1vcnkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQoIGZ1bmN0aW9uIGFkZCggYXJncyApIHtcblx0XHRcdFx0XHRcdGpRdWVyeS5lYWNoKCBhcmdzLCBmdW5jdGlvbiggXywgYXJnICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBhcmcgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoICFvcHRpb25zLnVuaXF1ZSB8fCAhc2VsZi5oYXMoIGFyZyApICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0bGlzdC5wdXNoKCBhcmcgKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoIGFyZyAmJiBhcmcubGVuZ3RoICYmIGpRdWVyeS50eXBlKCBhcmcgKSAhPT0gXCJzdHJpbmdcIiApIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIEluc3BlY3QgcmVjdXJzaXZlbHlcblx0XHRcdFx0XHRcdFx0XHRhZGQoIGFyZyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdFx0fSApKCBhcmd1bWVudHMgKTtcblxuXHRcdFx0XHRcdGlmICggbWVtb3J5ICYmICFmaXJpbmcgKSB7XG5cdFx0XHRcdFx0XHRmaXJlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fSxcblxuXHRcdFx0Ly8gUmVtb3ZlIGEgY2FsbGJhY2sgZnJvbSB0aGUgbGlzdFxuXHRcdFx0cmVtb3ZlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0alF1ZXJ5LmVhY2goIGFyZ3VtZW50cywgZnVuY3Rpb24oIF8sIGFyZyApIHtcblx0XHRcdFx0XHR2YXIgaW5kZXg7XG5cdFx0XHRcdFx0d2hpbGUgKCAoIGluZGV4ID0galF1ZXJ5LmluQXJyYXkoIGFyZywgbGlzdCwgaW5kZXggKSApID4gLTEgKSB7XG5cdFx0XHRcdFx0XHRsaXN0LnNwbGljZSggaW5kZXgsIDEgKTtcblxuXHRcdFx0XHRcdFx0Ly8gSGFuZGxlIGZpcmluZyBpbmRleGVzXG5cdFx0XHRcdFx0XHRpZiAoIGluZGV4IDw9IGZpcmluZ0luZGV4ICkge1xuXHRcdFx0XHRcdFx0XHRmaXJpbmdJbmRleC0tO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH0sXG5cblx0XHRcdC8vIENoZWNrIGlmIGEgZ2l2ZW4gY2FsbGJhY2sgaXMgaW4gdGhlIGxpc3QuXG5cdFx0XHQvLyBJZiBubyBhcmd1bWVudCBpcyBnaXZlbiwgcmV0dXJuIHdoZXRoZXIgb3Igbm90IGxpc3QgaGFzIGNhbGxiYWNrcyBhdHRhY2hlZC5cblx0XHRcdGhhczogZnVuY3Rpb24oIGZuICkge1xuXHRcdFx0XHRyZXR1cm4gZm4gP1xuXHRcdFx0XHRcdGpRdWVyeS5pbkFycmF5KCBmbiwgbGlzdCApID4gLTEgOlxuXHRcdFx0XHRcdGxpc3QubGVuZ3RoID4gMDtcblx0XHRcdH0sXG5cblx0XHRcdC8vIFJlbW92ZSBhbGwgY2FsbGJhY2tzIGZyb20gdGhlIGxpc3Rcblx0XHRcdGVtcHR5OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCBsaXN0ICkge1xuXHRcdFx0XHRcdGxpc3QgPSBbXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH0sXG5cblx0XHRcdC8vIERpc2FibGUgLmZpcmUgYW5kIC5hZGRcblx0XHRcdC8vIEFib3J0IGFueSBjdXJyZW50L3BlbmRpbmcgZXhlY3V0aW9uc1xuXHRcdFx0Ly8gQ2xlYXIgYWxsIGNhbGxiYWNrcyBhbmQgdmFsdWVzXG5cdFx0XHRkaXNhYmxlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0bG9ja2VkID0gcXVldWUgPSBbXTtcblx0XHRcdFx0bGlzdCA9IG1lbW9yeSA9IFwiXCI7XG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fSxcblx0XHRcdGRpc2FibGVkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuICFsaXN0O1xuXHRcdFx0fSxcblxuXHRcdFx0Ly8gRGlzYWJsZSAuZmlyZVxuXHRcdFx0Ly8gQWxzbyBkaXNhYmxlIC5hZGQgdW5sZXNzIHdlIGhhdmUgbWVtb3J5IChzaW5jZSBpdCB3b3VsZCBoYXZlIG5vIGVmZmVjdClcblx0XHRcdC8vIEFib3J0IGFueSBwZW5kaW5nIGV4ZWN1dGlvbnNcblx0XHRcdGxvY2s6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRsb2NrZWQgPSBxdWV1ZSA9IFtdO1xuXHRcdFx0XHRpZiAoICFtZW1vcnkgKSB7XG5cdFx0XHRcdFx0bGlzdCA9IG1lbW9yeSA9IFwiXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9LFxuXHRcdFx0bG9ja2VkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuICEhbG9ja2VkO1xuXHRcdFx0fSxcblxuXHRcdFx0Ly8gQ2FsbCBhbGwgY2FsbGJhY2tzIHdpdGggdGhlIGdpdmVuIGNvbnRleHQgYW5kIGFyZ3VtZW50c1xuXHRcdFx0ZmlyZVdpdGg6IGZ1bmN0aW9uKCBjb250ZXh0LCBhcmdzICkge1xuXHRcdFx0XHRpZiAoICFsb2NrZWQgKSB7XG5cdFx0XHRcdFx0YXJncyA9IGFyZ3MgfHwgW107XG5cdFx0XHRcdFx0YXJncyA9IFsgY29udGV4dCwgYXJncy5zbGljZSA/IGFyZ3Muc2xpY2UoKSA6IGFyZ3MgXTtcblx0XHRcdFx0XHRxdWV1ZS5wdXNoKCBhcmdzICk7XG5cdFx0XHRcdFx0aWYgKCAhZmlyaW5nICkge1xuXHRcdFx0XHRcdFx0ZmlyZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH0sXG5cblx0XHRcdC8vIENhbGwgYWxsIHRoZSBjYWxsYmFja3Mgd2l0aCB0aGUgZ2l2ZW4gYXJndW1lbnRzXG5cdFx0XHRmaXJlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0c2VsZi5maXJlV2l0aCggdGhpcywgYXJndW1lbnRzICk7XG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fSxcblxuXHRcdFx0Ly8gVG8ga25vdyBpZiB0aGUgY2FsbGJhY2tzIGhhdmUgYWxyZWFkeSBiZWVuIGNhbGxlZCBhdCBsZWFzdCBvbmNlXG5cdFx0XHRmaXJlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiAhIWZpcmVkO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0cmV0dXJuIHNlbGY7XG59O1xuXG5cbmpRdWVyeS5leHRlbmQoIHtcblxuXHREZWZlcnJlZDogZnVuY3Rpb24oIGZ1bmMgKSB7XG5cdFx0dmFyIHR1cGxlcyA9IFtcblxuXHRcdFx0XHQvLyBhY3Rpb24sIGFkZCBsaXN0ZW5lciwgbGlzdGVuZXIgbGlzdCwgZmluYWwgc3RhdGVcblx0XHRcdFx0WyBcInJlc29sdmVcIiwgXCJkb25lXCIsIGpRdWVyeS5DYWxsYmFja3MoIFwib25jZSBtZW1vcnlcIiApLCBcInJlc29sdmVkXCIgXSxcblx0XHRcdFx0WyBcInJlamVjdFwiLCBcImZhaWxcIiwgalF1ZXJ5LkNhbGxiYWNrcyggXCJvbmNlIG1lbW9yeVwiICksIFwicmVqZWN0ZWRcIiBdLFxuXHRcdFx0XHRbIFwibm90aWZ5XCIsIFwicHJvZ3Jlc3NcIiwgalF1ZXJ5LkNhbGxiYWNrcyggXCJtZW1vcnlcIiApIF1cblx0XHRcdF0sXG5cdFx0XHRzdGF0ZSA9IFwicGVuZGluZ1wiLFxuXHRcdFx0cHJvbWlzZSA9IHtcblx0XHRcdFx0c3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiBzdGF0ZTtcblx0XHRcdFx0fSxcblx0XHRcdFx0YWx3YXlzOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRkZWZlcnJlZC5kb25lKCBhcmd1bWVudHMgKS5mYWlsKCBhcmd1bWVudHMgKTtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdFx0fSxcblx0XHRcdFx0dGhlbjogZnVuY3Rpb24oIC8qIGZuRG9uZSwgZm5GYWlsLCBmblByb2dyZXNzICovICkge1xuXHRcdFx0XHRcdHZhciBmbnMgPSBhcmd1bWVudHM7XG5cdFx0XHRcdFx0cmV0dXJuIGpRdWVyeS5EZWZlcnJlZCggZnVuY3Rpb24oIG5ld0RlZmVyICkge1xuXHRcdFx0XHRcdFx0alF1ZXJ5LmVhY2goIHR1cGxlcywgZnVuY3Rpb24oIGksIHR1cGxlICkge1xuXHRcdFx0XHRcdFx0XHR2YXIgZm4gPSBqUXVlcnkuaXNGdW5jdGlvbiggZm5zWyBpIF0gKSAmJiBmbnNbIGkgXTtcblxuXHRcdFx0XHRcdFx0XHQvLyBkZWZlcnJlZFsgZG9uZSB8IGZhaWwgfCBwcm9ncmVzcyBdIGZvciBmb3J3YXJkaW5nIGFjdGlvbnMgdG8gbmV3RGVmZXJcblx0XHRcdFx0XHRcdFx0ZGVmZXJyZWRbIHR1cGxlWyAxIF0gXSggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIHJldHVybmVkID0gZm4gJiYgZm4uYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXHRcdFx0XHRcdFx0XHRcdGlmICggcmV0dXJuZWQgJiYgalF1ZXJ5LmlzRnVuY3Rpb24oIHJldHVybmVkLnByb21pc2UgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybmVkLnByb21pc2UoKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQucHJvZ3Jlc3MoIG5ld0RlZmVyLm5vdGlmeSApXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5kb25lKCBuZXdEZWZlci5yZXNvbHZlIClcblx0XHRcdFx0XHRcdFx0XHRcdFx0LmZhaWwoIG5ld0RlZmVyLnJlamVjdCApO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRuZXdEZWZlclsgdHVwbGVbIDAgXSArIFwiV2l0aFwiIF0oXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMgPT09IHByb21pc2UgPyBuZXdEZWZlci5wcm9taXNlKCkgOiB0aGlzLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmbiA/IFsgcmV0dXJuZWQgXSA6IGFyZ3VtZW50c1xuXHRcdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0XHRcdGZucyA9IG51bGw7XG5cdFx0XHRcdFx0fSApLnByb21pc2UoKTtcblx0XHRcdFx0fSxcblxuXHRcdFx0XHQvLyBHZXQgYSBwcm9taXNlIGZvciB0aGlzIGRlZmVycmVkXG5cdFx0XHRcdC8vIElmIG9iaiBpcyBwcm92aWRlZCwgdGhlIHByb21pc2UgYXNwZWN0IGlzIGFkZGVkIHRvIHRoZSBvYmplY3Rcblx0XHRcdFx0cHJvbWlzZTogZnVuY3Rpb24oIG9iaiApIHtcblx0XHRcdFx0XHRyZXR1cm4gb2JqICE9IG51bGwgPyBqUXVlcnkuZXh0ZW5kKCBvYmosIHByb21pc2UgKSA6IHByb21pc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRkZWZlcnJlZCA9IHt9O1xuXG5cdFx0Ly8gS2VlcCBwaXBlIGZvciBiYWNrLWNvbXBhdFxuXHRcdHByb21pc2UucGlwZSA9IHByb21pc2UudGhlbjtcblxuXHRcdC8vIEFkZCBsaXN0LXNwZWNpZmljIG1ldGhvZHNcblx0XHRqUXVlcnkuZWFjaCggdHVwbGVzLCBmdW5jdGlvbiggaSwgdHVwbGUgKSB7XG5cdFx0XHR2YXIgbGlzdCA9IHR1cGxlWyAyIF0sXG5cdFx0XHRcdHN0YXRlU3RyaW5nID0gdHVwbGVbIDMgXTtcblxuXHRcdFx0Ly8gcHJvbWlzZVsgZG9uZSB8IGZhaWwgfCBwcm9ncmVzcyBdID0gbGlzdC5hZGRcblx0XHRcdHByb21pc2VbIHR1cGxlWyAxIF0gXSA9IGxpc3QuYWRkO1xuXG5cdFx0XHQvLyBIYW5kbGUgc3RhdGVcblx0XHRcdGlmICggc3RhdGVTdHJpbmcgKSB7XG5cdFx0XHRcdGxpc3QuYWRkKCBmdW5jdGlvbigpIHtcblxuXHRcdFx0XHRcdC8vIHN0YXRlID0gWyByZXNvbHZlZCB8IHJlamVjdGVkIF1cblx0XHRcdFx0XHRzdGF0ZSA9IHN0YXRlU3RyaW5nO1xuXG5cdFx0XHRcdC8vIFsgcmVqZWN0X2xpc3QgfCByZXNvbHZlX2xpc3QgXS5kaXNhYmxlOyBwcm9ncmVzc19saXN0LmxvY2tcblx0XHRcdFx0fSwgdHVwbGVzWyBpIF4gMSBdWyAyIF0uZGlzYWJsZSwgdHVwbGVzWyAyIF1bIDIgXS5sb2NrICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGRlZmVycmVkWyByZXNvbHZlIHwgcmVqZWN0IHwgbm90aWZ5IF1cblx0XHRcdGRlZmVycmVkWyB0dXBsZVsgMCBdIF0gPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZGVmZXJyZWRbIHR1cGxlWyAwIF0gKyBcIldpdGhcIiBdKCB0aGlzID09PSBkZWZlcnJlZCA/IHByb21pc2UgOiB0aGlzLCBhcmd1bWVudHMgKTtcblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9O1xuXHRcdFx0ZGVmZXJyZWRbIHR1cGxlWyAwIF0gKyBcIldpdGhcIiBdID0gbGlzdC5maXJlV2l0aDtcblx0XHR9ICk7XG5cblx0XHQvLyBNYWtlIHRoZSBkZWZlcnJlZCBhIHByb21pc2Vcblx0XHRwcm9taXNlLnByb21pc2UoIGRlZmVycmVkICk7XG5cblx0XHQvLyBDYWxsIGdpdmVuIGZ1bmMgaWYgYW55XG5cdFx0aWYgKCBmdW5jICkge1xuXHRcdFx0ZnVuYy5jYWxsKCBkZWZlcnJlZCwgZGVmZXJyZWQgKTtcblx0XHR9XG5cblx0XHQvLyBBbGwgZG9uZSFcblx0XHRyZXR1cm4gZGVmZXJyZWQ7XG5cdH0sXG5cblx0Ly8gRGVmZXJyZWQgaGVscGVyXG5cdHdoZW46IGZ1bmN0aW9uKCBzdWJvcmRpbmF0ZSAvKiAsIC4uLiwgc3Vib3JkaW5hdGVOICovICkge1xuXHRcdHZhciBpID0gMCxcblx0XHRcdHJlc29sdmVWYWx1ZXMgPSBzbGljZS5jYWxsKCBhcmd1bWVudHMgKSxcblx0XHRcdGxlbmd0aCA9IHJlc29sdmVWYWx1ZXMubGVuZ3RoLFxuXG5cdFx0XHQvLyB0aGUgY291bnQgb2YgdW5jb21wbGV0ZWQgc3Vib3JkaW5hdGVzXG5cdFx0XHRyZW1haW5pbmcgPSBsZW5ndGggIT09IDEgfHxcblx0XHRcdFx0KCBzdWJvcmRpbmF0ZSAmJiBqUXVlcnkuaXNGdW5jdGlvbiggc3Vib3JkaW5hdGUucHJvbWlzZSApICkgPyBsZW5ndGggOiAwLFxuXG5cdFx0XHQvLyB0aGUgbWFzdGVyIERlZmVycmVkLlxuXHRcdFx0Ly8gSWYgcmVzb2x2ZVZhbHVlcyBjb25zaXN0IG9mIG9ubHkgYSBzaW5nbGUgRGVmZXJyZWQsIGp1c3QgdXNlIHRoYXQuXG5cdFx0XHRkZWZlcnJlZCA9IHJlbWFpbmluZyA9PT0gMSA/IHN1Ym9yZGluYXRlIDogalF1ZXJ5LkRlZmVycmVkKCksXG5cblx0XHRcdC8vIFVwZGF0ZSBmdW5jdGlvbiBmb3IgYm90aCByZXNvbHZlIGFuZCBwcm9ncmVzcyB2YWx1ZXNcblx0XHRcdHVwZGF0ZUZ1bmMgPSBmdW5jdGlvbiggaSwgY29udGV4dHMsIHZhbHVlcyApIHtcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHRcdFx0XHRjb250ZXh0c1sgaSBdID0gdGhpcztcblx0XHRcdFx0XHR2YWx1ZXNbIGkgXSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gc2xpY2UuY2FsbCggYXJndW1lbnRzICkgOiB2YWx1ZTtcblx0XHRcdFx0XHRpZiAoIHZhbHVlcyA9PT0gcHJvZ3Jlc3NWYWx1ZXMgKSB7XG5cdFx0XHRcdFx0XHRkZWZlcnJlZC5ub3RpZnlXaXRoKCBjb250ZXh0cywgdmFsdWVzICk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggISggLS1yZW1haW5pbmcgKSApIHtcblx0XHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmVXaXRoKCBjb250ZXh0cywgdmFsdWVzICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0fSxcblxuXHRcdFx0cHJvZ3Jlc3NWYWx1ZXMsIHByb2dyZXNzQ29udGV4dHMsIHJlc29sdmVDb250ZXh0cztcblxuXHRcdC8vIEFkZCBsaXN0ZW5lcnMgdG8gRGVmZXJyZWQgc3Vib3JkaW5hdGVzOyB0cmVhdCBvdGhlcnMgYXMgcmVzb2x2ZWRcblx0XHRpZiAoIGxlbmd0aCA+IDEgKSB7XG5cdFx0XHRwcm9ncmVzc1ZhbHVlcyA9IG5ldyBBcnJheSggbGVuZ3RoICk7XG5cdFx0XHRwcm9ncmVzc0NvbnRleHRzID0gbmV3IEFycmF5KCBsZW5ndGggKTtcblx0XHRcdHJlc29sdmVDb250ZXh0cyA9IG5ldyBBcnJheSggbGVuZ3RoICk7XG5cdFx0XHRmb3IgKCA7IGkgPCBsZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0aWYgKCByZXNvbHZlVmFsdWVzWyBpIF0gJiYgalF1ZXJ5LmlzRnVuY3Rpb24oIHJlc29sdmVWYWx1ZXNbIGkgXS5wcm9taXNlICkgKSB7XG5cdFx0XHRcdFx0cmVzb2x2ZVZhbHVlc1sgaSBdLnByb21pc2UoKVxuXHRcdFx0XHRcdFx0LnByb2dyZXNzKCB1cGRhdGVGdW5jKCBpLCBwcm9ncmVzc0NvbnRleHRzLCBwcm9ncmVzc1ZhbHVlcyApIClcblx0XHRcdFx0XHRcdC5kb25lKCB1cGRhdGVGdW5jKCBpLCByZXNvbHZlQ29udGV4dHMsIHJlc29sdmVWYWx1ZXMgKSApXG5cdFx0XHRcdFx0XHQuZmFpbCggZGVmZXJyZWQucmVqZWN0ICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0LS1yZW1haW5pbmc7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBJZiB3ZSdyZSBub3Qgd2FpdGluZyBvbiBhbnl0aGluZywgcmVzb2x2ZSB0aGUgbWFzdGVyXG5cdFx0aWYgKCAhcmVtYWluaW5nICkge1xuXHRcdFx0ZGVmZXJyZWQucmVzb2x2ZVdpdGgoIHJlc29sdmVDb250ZXh0cywgcmVzb2x2ZVZhbHVlcyApO1xuXHRcdH1cblxuXHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlKCk7XG5cdH1cbn0gKTtcblxuXG4vLyBUaGUgZGVmZXJyZWQgdXNlZCBvbiBET00gcmVhZHlcbnZhciByZWFkeUxpc3Q7XG5cbmpRdWVyeS5mbi5yZWFkeSA9IGZ1bmN0aW9uKCBmbiApIHtcblxuXHQvLyBBZGQgdGhlIGNhbGxiYWNrXG5cdGpRdWVyeS5yZWFkeS5wcm9taXNlKCkuZG9uZSggZm4gKTtcblxuXHRyZXR1cm4gdGhpcztcbn07XG5cbmpRdWVyeS5leHRlbmQoIHtcblxuXHQvLyBJcyB0aGUgRE9NIHJlYWR5IHRvIGJlIHVzZWQ/IFNldCB0byB0cnVlIG9uY2UgaXQgb2NjdXJzLlxuXHRpc1JlYWR5OiBmYWxzZSxcblxuXHQvLyBBIGNvdW50ZXIgdG8gdHJhY2sgaG93IG1hbnkgaXRlbXMgdG8gd2FpdCBmb3IgYmVmb3JlXG5cdC8vIHRoZSByZWFkeSBldmVudCBmaXJlcy4gU2VlICM2NzgxXG5cdHJlYWR5V2FpdDogMSxcblxuXHQvLyBIb2xkIChvciByZWxlYXNlKSB0aGUgcmVhZHkgZXZlbnRcblx0aG9sZFJlYWR5OiBmdW5jdGlvbiggaG9sZCApIHtcblx0XHRpZiAoIGhvbGQgKSB7XG5cdFx0XHRqUXVlcnkucmVhZHlXYWl0Kys7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGpRdWVyeS5yZWFkeSggdHJ1ZSApO1xuXHRcdH1cblx0fSxcblxuXHQvLyBIYW5kbGUgd2hlbiB0aGUgRE9NIGlzIHJlYWR5XG5cdHJlYWR5OiBmdW5jdGlvbiggd2FpdCApIHtcblxuXHRcdC8vIEFib3J0IGlmIHRoZXJlIGFyZSBwZW5kaW5nIGhvbGRzIG9yIHdlJ3JlIGFscmVhZHkgcmVhZHlcblx0XHRpZiAoIHdhaXQgPT09IHRydWUgPyAtLWpRdWVyeS5yZWFkeVdhaXQgOiBqUXVlcnkuaXNSZWFkeSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBSZW1lbWJlciB0aGF0IHRoZSBET00gaXMgcmVhZHlcblx0XHRqUXVlcnkuaXNSZWFkeSA9IHRydWU7XG5cblx0XHQvLyBJZiBhIG5vcm1hbCBET00gUmVhZHkgZXZlbnQgZmlyZWQsIGRlY3JlbWVudCwgYW5kIHdhaXQgaWYgbmVlZCBiZVxuXHRcdGlmICggd2FpdCAhPT0gdHJ1ZSAmJiAtLWpRdWVyeS5yZWFkeVdhaXQgPiAwICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIElmIHRoZXJlIGFyZSBmdW5jdGlvbnMgYm91bmQsIHRvIGV4ZWN1dGVcblx0XHRyZWFkeUxpc3QucmVzb2x2ZVdpdGgoIGRvY3VtZW50LCBbIGpRdWVyeSBdICk7XG5cblx0XHQvLyBUcmlnZ2VyIGFueSBib3VuZCByZWFkeSBldmVudHNcblx0XHRpZiAoIGpRdWVyeS5mbi50cmlnZ2VySGFuZGxlciApIHtcblx0XHRcdGpRdWVyeSggZG9jdW1lbnQgKS50cmlnZ2VySGFuZGxlciggXCJyZWFkeVwiICk7XG5cdFx0XHRqUXVlcnkoIGRvY3VtZW50ICkub2ZmKCBcInJlYWR5XCIgKTtcblx0XHR9XG5cdH1cbn0gKTtcblxuLyoqXG4gKiBUaGUgcmVhZHkgZXZlbnQgaGFuZGxlciBhbmQgc2VsZiBjbGVhbnVwIG1ldGhvZFxuICovXG5mdW5jdGlvbiBjb21wbGV0ZWQoKSB7XG5cdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoIFwiRE9NQ29udGVudExvYWRlZFwiLCBjb21wbGV0ZWQgKTtcblx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoIFwibG9hZFwiLCBjb21wbGV0ZWQgKTtcblx0alF1ZXJ5LnJlYWR5KCk7XG59XG5cbmpRdWVyeS5yZWFkeS5wcm9taXNlID0gZnVuY3Rpb24oIG9iaiApIHtcblx0aWYgKCAhcmVhZHlMaXN0ICkge1xuXG5cdFx0cmVhZHlMaXN0ID0galF1ZXJ5LkRlZmVycmVkKCk7XG5cblx0XHQvLyBDYXRjaCBjYXNlcyB3aGVyZSAkKGRvY3VtZW50KS5yZWFkeSgpIGlzIGNhbGxlZFxuXHRcdC8vIGFmdGVyIHRoZSBicm93c2VyIGV2ZW50IGhhcyBhbHJlYWR5IG9jY3VycmVkLlxuXHRcdC8vIFN1cHBvcnQ6IElFOS0xMCBvbmx5XG5cdFx0Ly8gT2xkZXIgSUUgc29tZXRpbWVzIHNpZ25hbHMgXCJpbnRlcmFjdGl2ZVwiIHRvbyBzb29uXG5cdFx0aWYgKCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIgfHxcblx0XHRcdCggZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gXCJsb2FkaW5nXCIgJiYgIWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5kb1Njcm9sbCApICkge1xuXG5cdFx0XHQvLyBIYW5kbGUgaXQgYXN5bmNocm9ub3VzbHkgdG8gYWxsb3cgc2NyaXB0cyB0aGUgb3Bwb3J0dW5pdHkgdG8gZGVsYXkgcmVhZHlcblx0XHRcdHdpbmRvdy5zZXRUaW1lb3V0KCBqUXVlcnkucmVhZHkgKTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdC8vIFVzZSB0aGUgaGFuZHkgZXZlbnQgY2FsbGJhY2tcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwiRE9NQ29udGVudExvYWRlZFwiLCBjb21wbGV0ZWQgKTtcblxuXHRcdFx0Ly8gQSBmYWxsYmFjayB0byB3aW5kb3cub25sb2FkLCB0aGF0IHdpbGwgYWx3YXlzIHdvcmtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCBcImxvYWRcIiwgY29tcGxldGVkICk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZWFkeUxpc3QucHJvbWlzZSggb2JqICk7XG59O1xuXG4vLyBLaWNrIG9mZiB0aGUgRE9NIHJlYWR5IGNoZWNrIGV2ZW4gaWYgdGhlIHVzZXIgZG9lcyBub3RcbmpRdWVyeS5yZWFkeS5wcm9taXNlKCk7XG5cblxuXG5cbi8vIE11bHRpZnVuY3Rpb25hbCBtZXRob2QgdG8gZ2V0IGFuZCBzZXQgdmFsdWVzIG9mIGEgY29sbGVjdGlvblxuLy8gVGhlIHZhbHVlL3MgY2FuIG9wdGlvbmFsbHkgYmUgZXhlY3V0ZWQgaWYgaXQncyBhIGZ1bmN0aW9uXG52YXIgYWNjZXNzID0gZnVuY3Rpb24oIGVsZW1zLCBmbiwga2V5LCB2YWx1ZSwgY2hhaW5hYmxlLCBlbXB0eUdldCwgcmF3ICkge1xuXHR2YXIgaSA9IDAsXG5cdFx0bGVuID0gZWxlbXMubGVuZ3RoLFxuXHRcdGJ1bGsgPSBrZXkgPT0gbnVsbDtcblxuXHQvLyBTZXRzIG1hbnkgdmFsdWVzXG5cdGlmICggalF1ZXJ5LnR5cGUoIGtleSApID09PSBcIm9iamVjdFwiICkge1xuXHRcdGNoYWluYWJsZSA9IHRydWU7XG5cdFx0Zm9yICggaSBpbiBrZXkgKSB7XG5cdFx0XHRhY2Nlc3MoIGVsZW1zLCBmbiwgaSwga2V5WyBpIF0sIHRydWUsIGVtcHR5R2V0LCByYXcgKTtcblx0XHR9XG5cblx0Ly8gU2V0cyBvbmUgdmFsdWVcblx0fSBlbHNlIGlmICggdmFsdWUgIT09IHVuZGVmaW5lZCApIHtcblx0XHRjaGFpbmFibGUgPSB0cnVlO1xuXG5cdFx0aWYgKCAhalF1ZXJ5LmlzRnVuY3Rpb24oIHZhbHVlICkgKSB7XG5cdFx0XHRyYXcgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICggYnVsayApIHtcblxuXHRcdFx0Ly8gQnVsayBvcGVyYXRpb25zIHJ1biBhZ2FpbnN0IHRoZSBlbnRpcmUgc2V0XG5cdFx0XHRpZiAoIHJhdyApIHtcblx0XHRcdFx0Zm4uY2FsbCggZWxlbXMsIHZhbHVlICk7XG5cdFx0XHRcdGZuID0gbnVsbDtcblxuXHRcdFx0Ly8gLi4uZXhjZXB0IHdoZW4gZXhlY3V0aW5nIGZ1bmN0aW9uIHZhbHVlc1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YnVsayA9IGZuO1xuXHRcdFx0XHRmbiA9IGZ1bmN0aW9uKCBlbGVtLCBrZXksIHZhbHVlICkge1xuXHRcdFx0XHRcdHJldHVybiBidWxrLmNhbGwoIGpRdWVyeSggZWxlbSApLCB2YWx1ZSApO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICggZm4gKSB7XG5cdFx0XHRmb3IgKCA7IGkgPCBsZW47IGkrKyApIHtcblx0XHRcdFx0Zm4oXG5cdFx0XHRcdFx0ZWxlbXNbIGkgXSwga2V5LCByYXcgP1xuXHRcdFx0XHRcdHZhbHVlIDpcblx0XHRcdFx0XHR2YWx1ZS5jYWxsKCBlbGVtc1sgaSBdLCBpLCBmbiggZWxlbXNbIGkgXSwga2V5ICkgKVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiBjaGFpbmFibGUgP1xuXHRcdGVsZW1zIDpcblxuXHRcdC8vIEdldHNcblx0XHRidWxrID9cblx0XHRcdGZuLmNhbGwoIGVsZW1zICkgOlxuXHRcdFx0bGVuID8gZm4oIGVsZW1zWyAwIF0sIGtleSApIDogZW1wdHlHZXQ7XG59O1xudmFyIGFjY2VwdERhdGEgPSBmdW5jdGlvbiggb3duZXIgKSB7XG5cblx0Ly8gQWNjZXB0cyBvbmx5OlxuXHQvLyAgLSBOb2RlXG5cdC8vICAgIC0gTm9kZS5FTEVNRU5UX05PREVcblx0Ly8gICAgLSBOb2RlLkRPQ1VNRU5UX05PREVcblx0Ly8gIC0gT2JqZWN0XG5cdC8vICAgIC0gQW55XG5cdC8qIGpzaGludCAtVzAxOCAqL1xuXHRyZXR1cm4gb3duZXIubm9kZVR5cGUgPT09IDEgfHwgb3duZXIubm9kZVR5cGUgPT09IDkgfHwgISggK293bmVyLm5vZGVUeXBlICk7XG59O1xuXG5cblxuXG5mdW5jdGlvbiBEYXRhKCkge1xuXHR0aGlzLmV4cGFuZG8gPSBqUXVlcnkuZXhwYW5kbyArIERhdGEudWlkKys7XG59XG5cbkRhdGEudWlkID0gMTtcblxuRGF0YS5wcm90b3R5cGUgPSB7XG5cblx0cmVnaXN0ZXI6IGZ1bmN0aW9uKCBvd25lciwgaW5pdGlhbCApIHtcblx0XHR2YXIgdmFsdWUgPSBpbml0aWFsIHx8IHt9O1xuXG5cdFx0Ly8gSWYgaXQgaXMgYSBub2RlIHVubGlrZWx5IHRvIGJlIHN0cmluZ2lmeS1lZCBvciBsb29wZWQgb3ZlclxuXHRcdC8vIHVzZSBwbGFpbiBhc3NpZ25tZW50XG5cdFx0aWYgKCBvd25lci5ub2RlVHlwZSApIHtcblx0XHRcdG93bmVyWyB0aGlzLmV4cGFuZG8gXSA9IHZhbHVlO1xuXG5cdFx0Ly8gT3RoZXJ3aXNlIHNlY3VyZSBpdCBpbiBhIG5vbi1lbnVtZXJhYmxlLCBub24td3JpdGFibGUgcHJvcGVydHlcblx0XHQvLyBjb25maWd1cmFiaWxpdHkgbXVzdCBiZSB0cnVlIHRvIGFsbG93IHRoZSBwcm9wZXJ0eSB0byBiZVxuXHRcdC8vIGRlbGV0ZWQgd2l0aCB0aGUgZGVsZXRlIG9wZXJhdG9yXG5cdFx0fSBlbHNlIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggb3duZXIsIHRoaXMuZXhwYW5kbywge1xuXHRcdFx0XHR2YWx1ZTogdmFsdWUsXG5cdFx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWVcblx0XHRcdH0gKTtcblx0XHR9XG5cdFx0cmV0dXJuIG93bmVyWyB0aGlzLmV4cGFuZG8gXTtcblx0fSxcblx0Y2FjaGU6IGZ1bmN0aW9uKCBvd25lciApIHtcblxuXHRcdC8vIFdlIGNhbiBhY2NlcHQgZGF0YSBmb3Igbm9uLWVsZW1lbnQgbm9kZXMgaW4gbW9kZXJuIGJyb3dzZXJzLFxuXHRcdC8vIGJ1dCB3ZSBzaG91bGQgbm90LCBzZWUgIzgzMzUuXG5cdFx0Ly8gQWx3YXlzIHJldHVybiBhbiBlbXB0eSBvYmplY3QuXG5cdFx0aWYgKCAhYWNjZXB0RGF0YSggb3duZXIgKSApIHtcblx0XHRcdHJldHVybiB7fTtcblx0XHR9XG5cblx0XHQvLyBDaGVjayBpZiB0aGUgb3duZXIgb2JqZWN0IGFscmVhZHkgaGFzIGEgY2FjaGVcblx0XHR2YXIgdmFsdWUgPSBvd25lclsgdGhpcy5leHBhbmRvIF07XG5cblx0XHQvLyBJZiBub3QsIGNyZWF0ZSBvbmVcblx0XHRpZiAoICF2YWx1ZSApIHtcblx0XHRcdHZhbHVlID0ge307XG5cblx0XHRcdC8vIFdlIGNhbiBhY2NlcHQgZGF0YSBmb3Igbm9uLWVsZW1lbnQgbm9kZXMgaW4gbW9kZXJuIGJyb3dzZXJzLFxuXHRcdFx0Ly8gYnV0IHdlIHNob3VsZCBub3QsIHNlZSAjODMzNS5cblx0XHRcdC8vIEFsd2F5cyByZXR1cm4gYW4gZW1wdHkgb2JqZWN0LlxuXHRcdFx0aWYgKCBhY2NlcHREYXRhKCBvd25lciApICkge1xuXG5cdFx0XHRcdC8vIElmIGl0IGlzIGEgbm9kZSB1bmxpa2VseSB0byBiZSBzdHJpbmdpZnktZWQgb3IgbG9vcGVkIG92ZXJcblx0XHRcdFx0Ly8gdXNlIHBsYWluIGFzc2lnbm1lbnRcblx0XHRcdFx0aWYgKCBvd25lci5ub2RlVHlwZSApIHtcblx0XHRcdFx0XHRvd25lclsgdGhpcy5leHBhbmRvIF0gPSB2YWx1ZTtcblxuXHRcdFx0XHQvLyBPdGhlcndpc2Ugc2VjdXJlIGl0IGluIGEgbm9uLWVudW1lcmFibGUgcHJvcGVydHlcblx0XHRcdFx0Ly8gY29uZmlndXJhYmxlIG11c3QgYmUgdHJ1ZSB0byBhbGxvdyB0aGUgcHJvcGVydHkgdG8gYmVcblx0XHRcdFx0Ly8gZGVsZXRlZCB3aGVuIGRhdGEgaXMgcmVtb3ZlZFxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggb3duZXIsIHRoaXMuZXhwYW5kbywge1xuXHRcdFx0XHRcdFx0dmFsdWU6IHZhbHVlLFxuXHRcdFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlXG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9LFxuXHRzZXQ6IGZ1bmN0aW9uKCBvd25lciwgZGF0YSwgdmFsdWUgKSB7XG5cdFx0dmFyIHByb3AsXG5cdFx0XHRjYWNoZSA9IHRoaXMuY2FjaGUoIG93bmVyICk7XG5cblx0XHQvLyBIYW5kbGU6IFsgb3duZXIsIGtleSwgdmFsdWUgXSBhcmdzXG5cdFx0aWYgKCB0eXBlb2YgZGF0YSA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdGNhY2hlWyBkYXRhIF0gPSB2YWx1ZTtcblxuXHRcdC8vIEhhbmRsZTogWyBvd25lciwgeyBwcm9wZXJ0aWVzIH0gXSBhcmdzXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0Ly8gQ29weSB0aGUgcHJvcGVydGllcyBvbmUtYnktb25lIHRvIHRoZSBjYWNoZSBvYmplY3Rcblx0XHRcdGZvciAoIHByb3AgaW4gZGF0YSApIHtcblx0XHRcdFx0Y2FjaGVbIHByb3AgXSA9IGRhdGFbIHByb3AgXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGNhY2hlO1xuXHR9LFxuXHRnZXQ6IGZ1bmN0aW9uKCBvd25lciwga2V5ICkge1xuXHRcdHJldHVybiBrZXkgPT09IHVuZGVmaW5lZCA/XG5cdFx0XHR0aGlzLmNhY2hlKCBvd25lciApIDpcblx0XHRcdG93bmVyWyB0aGlzLmV4cGFuZG8gXSAmJiBvd25lclsgdGhpcy5leHBhbmRvIF1bIGtleSBdO1xuXHR9LFxuXHRhY2Nlc3M6IGZ1bmN0aW9uKCBvd25lciwga2V5LCB2YWx1ZSApIHtcblx0XHR2YXIgc3RvcmVkO1xuXG5cdFx0Ly8gSW4gY2FzZXMgd2hlcmUgZWl0aGVyOlxuXHRcdC8vXG5cdFx0Ly8gICAxLiBObyBrZXkgd2FzIHNwZWNpZmllZFxuXHRcdC8vICAgMi4gQSBzdHJpbmcga2V5IHdhcyBzcGVjaWZpZWQsIGJ1dCBubyB2YWx1ZSBwcm92aWRlZFxuXHRcdC8vXG5cdFx0Ly8gVGFrZSB0aGUgXCJyZWFkXCIgcGF0aCBhbmQgYWxsb3cgdGhlIGdldCBtZXRob2QgdG8gZGV0ZXJtaW5lXG5cdFx0Ly8gd2hpY2ggdmFsdWUgdG8gcmV0dXJuLCByZXNwZWN0aXZlbHkgZWl0aGVyOlxuXHRcdC8vXG5cdFx0Ly8gICAxLiBUaGUgZW50aXJlIGNhY2hlIG9iamVjdFxuXHRcdC8vICAgMi4gVGhlIGRhdGEgc3RvcmVkIGF0IHRoZSBrZXlcblx0XHQvL1xuXHRcdGlmICgga2V5ID09PSB1bmRlZmluZWQgfHxcblx0XHRcdFx0KCAoIGtleSAmJiB0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiICkgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCApICkge1xuXG5cdFx0XHRzdG9yZWQgPSB0aGlzLmdldCggb3duZXIsIGtleSApO1xuXG5cdFx0XHRyZXR1cm4gc3RvcmVkICE9PSB1bmRlZmluZWQgP1xuXHRcdFx0XHRzdG9yZWQgOiB0aGlzLmdldCggb3duZXIsIGpRdWVyeS5jYW1lbENhc2UoIGtleSApICk7XG5cdFx0fVxuXG5cdFx0Ly8gV2hlbiB0aGUga2V5IGlzIG5vdCBhIHN0cmluZywgb3IgYm90aCBhIGtleSBhbmQgdmFsdWVcblx0XHQvLyBhcmUgc3BlY2lmaWVkLCBzZXQgb3IgZXh0ZW5kIChleGlzdGluZyBvYmplY3RzKSB3aXRoIGVpdGhlcjpcblx0XHQvL1xuXHRcdC8vICAgMS4gQW4gb2JqZWN0IG9mIHByb3BlcnRpZXNcblx0XHQvLyAgIDIuIEEga2V5IGFuZCB2YWx1ZVxuXHRcdC8vXG5cdFx0dGhpcy5zZXQoIG93bmVyLCBrZXksIHZhbHVlICk7XG5cblx0XHQvLyBTaW5jZSB0aGUgXCJzZXRcIiBwYXRoIGNhbiBoYXZlIHR3byBwb3NzaWJsZSBlbnRyeSBwb2ludHNcblx0XHQvLyByZXR1cm4gdGhlIGV4cGVjdGVkIGRhdGEgYmFzZWQgb24gd2hpY2ggcGF0aCB3YXMgdGFrZW5bKl1cblx0XHRyZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDoga2V5O1xuXHR9LFxuXHRyZW1vdmU6IGZ1bmN0aW9uKCBvd25lciwga2V5ICkge1xuXHRcdHZhciBpLCBuYW1lLCBjYW1lbCxcblx0XHRcdGNhY2hlID0gb3duZXJbIHRoaXMuZXhwYW5kbyBdO1xuXG5cdFx0aWYgKCBjYWNoZSA9PT0gdW5kZWZpbmVkICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICgga2V5ID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHR0aGlzLnJlZ2lzdGVyKCBvd25lciApO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0Ly8gU3VwcG9ydCBhcnJheSBvciBzcGFjZSBzZXBhcmF0ZWQgc3RyaW5nIG9mIGtleXNcblx0XHRcdGlmICggalF1ZXJ5LmlzQXJyYXkoIGtleSApICkge1xuXG5cdFx0XHRcdC8vIElmIFwibmFtZVwiIGlzIGFuIGFycmF5IG9mIGtleXMuLi5cblx0XHRcdFx0Ly8gV2hlbiBkYXRhIGlzIGluaXRpYWxseSBjcmVhdGVkLCB2aWEgKFwia2V5XCIsIFwidmFsXCIpIHNpZ25hdHVyZSxcblx0XHRcdFx0Ly8ga2V5cyB3aWxsIGJlIGNvbnZlcnRlZCB0byBjYW1lbENhc2UuXG5cdFx0XHRcdC8vIFNpbmNlIHRoZXJlIGlzIG5vIHdheSB0byB0ZWxsIF9ob3dfIGEga2V5IHdhcyBhZGRlZCwgcmVtb3ZlXG5cdFx0XHRcdC8vIGJvdGggcGxhaW4ga2V5IGFuZCBjYW1lbENhc2Uga2V5LiAjMTI3ODZcblx0XHRcdFx0Ly8gVGhpcyB3aWxsIG9ubHkgcGVuYWxpemUgdGhlIGFycmF5IGFyZ3VtZW50IHBhdGguXG5cdFx0XHRcdG5hbWUgPSBrZXkuY29uY2F0KCBrZXkubWFwKCBqUXVlcnkuY2FtZWxDYXNlICkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNhbWVsID0galF1ZXJ5LmNhbWVsQ2FzZSgga2V5ICk7XG5cblx0XHRcdFx0Ly8gVHJ5IHRoZSBzdHJpbmcgYXMgYSBrZXkgYmVmb3JlIGFueSBtYW5pcHVsYXRpb25cblx0XHRcdFx0aWYgKCBrZXkgaW4gY2FjaGUgKSB7XG5cdFx0XHRcdFx0bmFtZSA9IFsga2V5LCBjYW1lbCBdO1xuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0Ly8gSWYgYSBrZXkgd2l0aCB0aGUgc3BhY2VzIGV4aXN0cywgdXNlIGl0LlxuXHRcdFx0XHRcdC8vIE90aGVyd2lzZSwgY3JlYXRlIGFuIGFycmF5IGJ5IG1hdGNoaW5nIG5vbi13aGl0ZXNwYWNlXG5cdFx0XHRcdFx0bmFtZSA9IGNhbWVsO1xuXHRcdFx0XHRcdG5hbWUgPSBuYW1lIGluIGNhY2hlID9cblx0XHRcdFx0XHRcdFsgbmFtZSBdIDogKCBuYW1lLm1hdGNoKCBybm90d2hpdGUgKSB8fCBbXSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGkgPSBuYW1lLmxlbmd0aDtcblxuXHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdGRlbGV0ZSBjYWNoZVsgbmFtZVsgaSBdIF07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gUmVtb3ZlIHRoZSBleHBhbmRvIGlmIHRoZXJlJ3Mgbm8gbW9yZSBkYXRhXG5cdFx0aWYgKCBrZXkgPT09IHVuZGVmaW5lZCB8fCBqUXVlcnkuaXNFbXB0eU9iamVjdCggY2FjaGUgKSApIHtcblxuXHRcdFx0Ly8gU3VwcG9ydDogQ2hyb21lIDw9IDM1LTQ1K1xuXHRcdFx0Ly8gV2Via2l0ICYgQmxpbmsgcGVyZm9ybWFuY2Ugc3VmZmVycyB3aGVuIGRlbGV0aW5nIHByb3BlcnRpZXNcblx0XHRcdC8vIGZyb20gRE9NIG5vZGVzLCBzbyBzZXQgdG8gdW5kZWZpbmVkIGluc3RlYWRcblx0XHRcdC8vIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0zNzg2MDdcblx0XHRcdGlmICggb3duZXIubm9kZVR5cGUgKSB7XG5cdFx0XHRcdG93bmVyWyB0aGlzLmV4cGFuZG8gXSA9IHVuZGVmaW5lZDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRlbGV0ZSBvd25lclsgdGhpcy5leHBhbmRvIF07XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRoYXNEYXRhOiBmdW5jdGlvbiggb3duZXIgKSB7XG5cdFx0dmFyIGNhY2hlID0gb3duZXJbIHRoaXMuZXhwYW5kbyBdO1xuXHRcdHJldHVybiBjYWNoZSAhPT0gdW5kZWZpbmVkICYmICFqUXVlcnkuaXNFbXB0eU9iamVjdCggY2FjaGUgKTtcblx0fVxufTtcbnZhciBkYXRhUHJpdiA9IG5ldyBEYXRhKCk7XG5cbnZhciBkYXRhVXNlciA9IG5ldyBEYXRhKCk7XG5cblxuXG4vL1x0SW1wbGVtZW50YXRpb24gU3VtbWFyeVxuLy9cbi8vXHQxLiBFbmZvcmNlIEFQSSBzdXJmYWNlIGFuZCBzZW1hbnRpYyBjb21wYXRpYmlsaXR5IHdpdGggMS45LnggYnJhbmNoXG4vL1x0Mi4gSW1wcm92ZSB0aGUgbW9kdWxlJ3MgbWFpbnRhaW5hYmlsaXR5IGJ5IHJlZHVjaW5nIHRoZSBzdG9yYWdlXG4vL1x0XHRwYXRocyB0byBhIHNpbmdsZSBtZWNoYW5pc20uXG4vL1x0My4gVXNlIHRoZSBzYW1lIHNpbmdsZSBtZWNoYW5pc20gdG8gc3VwcG9ydCBcInByaXZhdGVcIiBhbmQgXCJ1c2VyXCIgZGF0YS5cbi8vXHQ0LiBfTmV2ZXJfIGV4cG9zZSBcInByaXZhdGVcIiBkYXRhIHRvIHVzZXIgY29kZSAoVE9ETzogRHJvcCBfZGF0YSwgX3JlbW92ZURhdGEpXG4vL1x0NS4gQXZvaWQgZXhwb3NpbmcgaW1wbGVtZW50YXRpb24gZGV0YWlscyBvbiB1c2VyIG9iamVjdHMgKGVnLiBleHBhbmRvIHByb3BlcnRpZXMpXG4vL1x0Ni4gUHJvdmlkZSBhIGNsZWFyIHBhdGggZm9yIGltcGxlbWVudGF0aW9uIHVwZ3JhZGUgdG8gV2Vha01hcCBpbiAyMDE0XG5cbnZhciByYnJhY2UgPSAvXig/Olxce1tcXHdcXFddKlxcfXxcXFtbXFx3XFxXXSpcXF0pJC8sXG5cdHJtdWx0aURhc2ggPSAvW0EtWl0vZztcblxuZnVuY3Rpb24gZGF0YUF0dHIoIGVsZW0sIGtleSwgZGF0YSApIHtcblx0dmFyIG5hbWU7XG5cblx0Ly8gSWYgbm90aGluZyB3YXMgZm91bmQgaW50ZXJuYWxseSwgdHJ5IHRvIGZldGNoIGFueVxuXHQvLyBkYXRhIGZyb20gdGhlIEhUTUw1IGRhdGEtKiBhdHRyaWJ1dGVcblx0aWYgKCBkYXRhID09PSB1bmRlZmluZWQgJiYgZWxlbS5ub2RlVHlwZSA9PT0gMSApIHtcblx0XHRuYW1lID0gXCJkYXRhLVwiICsga2V5LnJlcGxhY2UoIHJtdWx0aURhc2gsIFwiLSQmXCIgKS50b0xvd2VyQ2FzZSgpO1xuXHRcdGRhdGEgPSBlbGVtLmdldEF0dHJpYnV0ZSggbmFtZSApO1xuXG5cdFx0aWYgKCB0eXBlb2YgZGF0YSA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGRhdGEgPSBkYXRhID09PSBcInRydWVcIiA/IHRydWUgOlxuXHRcdFx0XHRcdGRhdGEgPT09IFwiZmFsc2VcIiA/IGZhbHNlIDpcblx0XHRcdFx0XHRkYXRhID09PSBcIm51bGxcIiA/IG51bGwgOlxuXG5cdFx0XHRcdFx0Ly8gT25seSBjb252ZXJ0IHRvIGEgbnVtYmVyIGlmIGl0IGRvZXNuJ3QgY2hhbmdlIHRoZSBzdHJpbmdcblx0XHRcdFx0XHQrZGF0YSArIFwiXCIgPT09IGRhdGEgPyArZGF0YSA6XG5cdFx0XHRcdFx0cmJyYWNlLnRlc3QoIGRhdGEgKSA/IGpRdWVyeS5wYXJzZUpTT04oIGRhdGEgKSA6XG5cdFx0XHRcdFx0ZGF0YTtcblx0XHRcdH0gY2F0Y2ggKCBlICkge31cblxuXHRcdFx0Ly8gTWFrZSBzdXJlIHdlIHNldCB0aGUgZGF0YSBzbyBpdCBpc24ndCBjaGFuZ2VkIGxhdGVyXG5cdFx0XHRkYXRhVXNlci5zZXQoIGVsZW0sIGtleSwgZGF0YSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkYXRhID0gdW5kZWZpbmVkO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gZGF0YTtcbn1cblxualF1ZXJ5LmV4dGVuZCgge1xuXHRoYXNEYXRhOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRyZXR1cm4gZGF0YVVzZXIuaGFzRGF0YSggZWxlbSApIHx8IGRhdGFQcml2Lmhhc0RhdGEoIGVsZW0gKTtcblx0fSxcblxuXHRkYXRhOiBmdW5jdGlvbiggZWxlbSwgbmFtZSwgZGF0YSApIHtcblx0XHRyZXR1cm4gZGF0YVVzZXIuYWNjZXNzKCBlbGVtLCBuYW1lLCBkYXRhICk7XG5cdH0sXG5cblx0cmVtb3ZlRGF0YTogZnVuY3Rpb24oIGVsZW0sIG5hbWUgKSB7XG5cdFx0ZGF0YVVzZXIucmVtb3ZlKCBlbGVtLCBuYW1lICk7XG5cdH0sXG5cblx0Ly8gVE9ETzogTm93IHRoYXQgYWxsIGNhbGxzIHRvIF9kYXRhIGFuZCBfcmVtb3ZlRGF0YSBoYXZlIGJlZW4gcmVwbGFjZWRcblx0Ly8gd2l0aCBkaXJlY3QgY2FsbHMgdG8gZGF0YVByaXYgbWV0aG9kcywgdGhlc2UgY2FuIGJlIGRlcHJlY2F0ZWQuXG5cdF9kYXRhOiBmdW5jdGlvbiggZWxlbSwgbmFtZSwgZGF0YSApIHtcblx0XHRyZXR1cm4gZGF0YVByaXYuYWNjZXNzKCBlbGVtLCBuYW1lLCBkYXRhICk7XG5cdH0sXG5cblx0X3JlbW92ZURhdGE6IGZ1bmN0aW9uKCBlbGVtLCBuYW1lICkge1xuXHRcdGRhdGFQcml2LnJlbW92ZSggZWxlbSwgbmFtZSApO1xuXHR9XG59ICk7XG5cbmpRdWVyeS5mbi5leHRlbmQoIHtcblx0ZGF0YTogZnVuY3Rpb24oIGtleSwgdmFsdWUgKSB7XG5cdFx0dmFyIGksIG5hbWUsIGRhdGEsXG5cdFx0XHRlbGVtID0gdGhpc1sgMCBdLFxuXHRcdFx0YXR0cnMgPSBlbGVtICYmIGVsZW0uYXR0cmlidXRlcztcblxuXHRcdC8vIEdldHMgYWxsIHZhbHVlc1xuXHRcdGlmICgga2V5ID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRpZiAoIHRoaXMubGVuZ3RoICkge1xuXHRcdFx0XHRkYXRhID0gZGF0YVVzZXIuZ2V0KCBlbGVtICk7XG5cblx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxICYmICFkYXRhUHJpdi5nZXQoIGVsZW0sIFwiaGFzRGF0YUF0dHJzXCIgKSApIHtcblx0XHRcdFx0XHRpID0gYXR0cnMubGVuZ3RoO1xuXHRcdFx0XHRcdHdoaWxlICggaS0tICkge1xuXG5cdFx0XHRcdFx0XHQvLyBTdXBwb3J0OiBJRTExK1xuXHRcdFx0XHRcdFx0Ly8gVGhlIGF0dHJzIGVsZW1lbnRzIGNhbiBiZSBudWxsICgjMTQ4OTQpXG5cdFx0XHRcdFx0XHRpZiAoIGF0dHJzWyBpIF0gKSB7XG5cdFx0XHRcdFx0XHRcdG5hbWUgPSBhdHRyc1sgaSBdLm5hbWU7XG5cdFx0XHRcdFx0XHRcdGlmICggbmFtZS5pbmRleE9mKCBcImRhdGEtXCIgKSA9PT0gMCApIHtcblx0XHRcdFx0XHRcdFx0XHRuYW1lID0galF1ZXJ5LmNhbWVsQ2FzZSggbmFtZS5zbGljZSggNSApICk7XG5cdFx0XHRcdFx0XHRcdFx0ZGF0YUF0dHIoIGVsZW0sIG5hbWUsIGRhdGFbIG5hbWUgXSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGRhdGFQcml2LnNldCggZWxlbSwgXCJoYXNEYXRhQXR0cnNcIiwgdHJ1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBkYXRhO1xuXHRcdH1cblxuXHRcdC8vIFNldHMgbXVsdGlwbGUgdmFsdWVzXG5cdFx0aWYgKCB0eXBlb2Yga2V5ID09PSBcIm9iamVjdFwiICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGRhdGFVc2VyLnNldCggdGhpcywga2V5ICk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFjY2VzcyggdGhpcywgZnVuY3Rpb24oIHZhbHVlICkge1xuXHRcdFx0dmFyIGRhdGEsIGNhbWVsS2V5O1xuXG5cdFx0XHQvLyBUaGUgY2FsbGluZyBqUXVlcnkgb2JqZWN0IChlbGVtZW50IG1hdGNoZXMpIGlzIG5vdCBlbXB0eVxuXHRcdFx0Ly8gKGFuZCB0aGVyZWZvcmUgaGFzIGFuIGVsZW1lbnQgYXBwZWFycyBhdCB0aGlzWyAwIF0pIGFuZCB0aGVcblx0XHRcdC8vIGB2YWx1ZWAgcGFyYW1ldGVyIHdhcyBub3QgdW5kZWZpbmVkLiBBbiBlbXB0eSBqUXVlcnkgb2JqZWN0XG5cdFx0XHQvLyB3aWxsIHJlc3VsdCBpbiBgdW5kZWZpbmVkYCBmb3IgZWxlbSA9IHRoaXNbIDAgXSB3aGljaCB3aWxsXG5cdFx0XHQvLyB0aHJvdyBhbiBleGNlcHRpb24gaWYgYW4gYXR0ZW1wdCB0byByZWFkIGEgZGF0YSBjYWNoZSBpcyBtYWRlLlxuXHRcdFx0aWYgKCBlbGVtICYmIHZhbHVlID09PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdFx0Ly8gQXR0ZW1wdCB0byBnZXQgZGF0YSBmcm9tIHRoZSBjYWNoZVxuXHRcdFx0XHQvLyB3aXRoIHRoZSBrZXkgYXMtaXNcblx0XHRcdFx0ZGF0YSA9IGRhdGFVc2VyLmdldCggZWxlbSwga2V5ICkgfHxcblxuXHRcdFx0XHRcdC8vIFRyeSB0byBmaW5kIGRhc2hlZCBrZXkgaWYgaXQgZXhpc3RzIChnaC0yNzc5KVxuXHRcdFx0XHRcdC8vIFRoaXMgaXMgZm9yIDIuMi54IG9ubHlcblx0XHRcdFx0XHRkYXRhVXNlci5nZXQoIGVsZW0sIGtleS5yZXBsYWNlKCBybXVsdGlEYXNoLCBcIi0kJlwiICkudG9Mb3dlckNhc2UoKSApO1xuXG5cdFx0XHRcdGlmICggZGF0YSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdHJldHVybiBkYXRhO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y2FtZWxLZXkgPSBqUXVlcnkuY2FtZWxDYXNlKCBrZXkgKTtcblxuXHRcdFx0XHQvLyBBdHRlbXB0IHRvIGdldCBkYXRhIGZyb20gdGhlIGNhY2hlXG5cdFx0XHRcdC8vIHdpdGggdGhlIGtleSBjYW1lbGl6ZWRcblx0XHRcdFx0ZGF0YSA9IGRhdGFVc2VyLmdldCggZWxlbSwgY2FtZWxLZXkgKTtcblx0XHRcdFx0aWYgKCBkYXRhICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBBdHRlbXB0IHRvIFwiZGlzY292ZXJcIiB0aGUgZGF0YSBpblxuXHRcdFx0XHQvLyBIVE1MNSBjdXN0b20gZGF0YS0qIGF0dHJzXG5cdFx0XHRcdGRhdGEgPSBkYXRhQXR0ciggZWxlbSwgY2FtZWxLZXksIHVuZGVmaW5lZCApO1xuXHRcdFx0XHRpZiAoIGRhdGEgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0XHRyZXR1cm4gZGF0YTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFdlIHRyaWVkIHJlYWxseSBoYXJkLCBidXQgdGhlIGRhdGEgZG9lc24ndCBleGlzdC5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTZXQgdGhlIGRhdGEuLi5cblx0XHRcdGNhbWVsS2V5ID0galF1ZXJ5LmNhbWVsQ2FzZSgga2V5ICk7XG5cdFx0XHR0aGlzLmVhY2goIGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRcdC8vIEZpcnN0LCBhdHRlbXB0IHRvIHN0b3JlIGEgY29weSBvciByZWZlcmVuY2Ugb2YgYW55XG5cdFx0XHRcdC8vIGRhdGEgdGhhdCBtaWdodCd2ZSBiZWVuIHN0b3JlIHdpdGggYSBjYW1lbENhc2VkIGtleS5cblx0XHRcdFx0dmFyIGRhdGEgPSBkYXRhVXNlci5nZXQoIHRoaXMsIGNhbWVsS2V5ICk7XG5cblx0XHRcdFx0Ly8gRm9yIEhUTUw1IGRhdGEtKiBhdHRyaWJ1dGUgaW50ZXJvcCwgd2UgaGF2ZSB0b1xuXHRcdFx0XHQvLyBzdG9yZSBwcm9wZXJ0eSBuYW1lcyB3aXRoIGRhc2hlcyBpbiBhIGNhbWVsQ2FzZSBmb3JtLlxuXHRcdFx0XHQvLyBUaGlzIG1pZ2h0IG5vdCBhcHBseSB0byBhbGwgcHJvcGVydGllcy4uLipcblx0XHRcdFx0ZGF0YVVzZXIuc2V0KCB0aGlzLCBjYW1lbEtleSwgdmFsdWUgKTtcblxuXHRcdFx0XHQvLyAqLi4uIEluIHRoZSBjYXNlIG9mIHByb3BlcnRpZXMgdGhhdCBtaWdodCBfYWN0dWFsbHlfXG5cdFx0XHRcdC8vIGhhdmUgZGFzaGVzLCB3ZSBuZWVkIHRvIGFsc28gc3RvcmUgYSBjb3B5IG9mIHRoYXRcblx0XHRcdFx0Ly8gdW5jaGFuZ2VkIHByb3BlcnR5LlxuXHRcdFx0XHRpZiAoIGtleS5pbmRleE9mKCBcIi1cIiApID4gLTEgJiYgZGF0YSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdGRhdGFVc2VyLnNldCggdGhpcywga2V5LCB2YWx1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSwgbnVsbCwgdmFsdWUsIGFyZ3VtZW50cy5sZW5ndGggPiAxLCBudWxsLCB0cnVlICk7XG5cdH0sXG5cblx0cmVtb3ZlRGF0YTogZnVuY3Rpb24oIGtleSApIHtcblx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGRhdGFVc2VyLnJlbW92ZSggdGhpcywga2V5ICk7XG5cdFx0fSApO1xuXHR9XG59ICk7XG5cblxualF1ZXJ5LmV4dGVuZCgge1xuXHRxdWV1ZTogZnVuY3Rpb24oIGVsZW0sIHR5cGUsIGRhdGEgKSB7XG5cdFx0dmFyIHF1ZXVlO1xuXG5cdFx0aWYgKCBlbGVtICkge1xuXHRcdFx0dHlwZSA9ICggdHlwZSB8fCBcImZ4XCIgKSArIFwicXVldWVcIjtcblx0XHRcdHF1ZXVlID0gZGF0YVByaXYuZ2V0KCBlbGVtLCB0eXBlICk7XG5cblx0XHRcdC8vIFNwZWVkIHVwIGRlcXVldWUgYnkgZ2V0dGluZyBvdXQgcXVpY2tseSBpZiB0aGlzIGlzIGp1c3QgYSBsb29rdXBcblx0XHRcdGlmICggZGF0YSApIHtcblx0XHRcdFx0aWYgKCAhcXVldWUgfHwgalF1ZXJ5LmlzQXJyYXkoIGRhdGEgKSApIHtcblx0XHRcdFx0XHRxdWV1ZSA9IGRhdGFQcml2LmFjY2VzcyggZWxlbSwgdHlwZSwgalF1ZXJ5Lm1ha2VBcnJheSggZGF0YSApICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cXVldWUucHVzaCggZGF0YSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcXVldWUgfHwgW107XG5cdFx0fVxuXHR9LFxuXG5cdGRlcXVldWU6IGZ1bmN0aW9uKCBlbGVtLCB0eXBlICkge1xuXHRcdHR5cGUgPSB0eXBlIHx8IFwiZnhcIjtcblxuXHRcdHZhciBxdWV1ZSA9IGpRdWVyeS5xdWV1ZSggZWxlbSwgdHlwZSApLFxuXHRcdFx0c3RhcnRMZW5ndGggPSBxdWV1ZS5sZW5ndGgsXG5cdFx0XHRmbiA9IHF1ZXVlLnNoaWZ0KCksXG5cdFx0XHRob29rcyA9IGpRdWVyeS5fcXVldWVIb29rcyggZWxlbSwgdHlwZSApLFxuXHRcdFx0bmV4dCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRqUXVlcnkuZGVxdWV1ZSggZWxlbSwgdHlwZSApO1xuXHRcdFx0fTtcblxuXHRcdC8vIElmIHRoZSBmeCBxdWV1ZSBpcyBkZXF1ZXVlZCwgYWx3YXlzIHJlbW92ZSB0aGUgcHJvZ3Jlc3Mgc2VudGluZWxcblx0XHRpZiAoIGZuID09PSBcImlucHJvZ3Jlc3NcIiApIHtcblx0XHRcdGZuID0gcXVldWUuc2hpZnQoKTtcblx0XHRcdHN0YXJ0TGVuZ3RoLS07XG5cdFx0fVxuXG5cdFx0aWYgKCBmbiApIHtcblxuXHRcdFx0Ly8gQWRkIGEgcHJvZ3Jlc3Mgc2VudGluZWwgdG8gcHJldmVudCB0aGUgZnggcXVldWUgZnJvbSBiZWluZ1xuXHRcdFx0Ly8gYXV0b21hdGljYWxseSBkZXF1ZXVlZFxuXHRcdFx0aWYgKCB0eXBlID09PSBcImZ4XCIgKSB7XG5cdFx0XHRcdHF1ZXVlLnVuc2hpZnQoIFwiaW5wcm9ncmVzc1wiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIENsZWFyIHVwIHRoZSBsYXN0IHF1ZXVlIHN0b3AgZnVuY3Rpb25cblx0XHRcdGRlbGV0ZSBob29rcy5zdG9wO1xuXHRcdFx0Zm4uY2FsbCggZWxlbSwgbmV4dCwgaG9va3MgKTtcblx0XHR9XG5cblx0XHRpZiAoICFzdGFydExlbmd0aCAmJiBob29rcyApIHtcblx0XHRcdGhvb2tzLmVtcHR5LmZpcmUoKTtcblx0XHR9XG5cdH0sXG5cblx0Ly8gTm90IHB1YmxpYyAtIGdlbmVyYXRlIGEgcXVldWVIb29rcyBvYmplY3QsIG9yIHJldHVybiB0aGUgY3VycmVudCBvbmVcblx0X3F1ZXVlSG9va3M6IGZ1bmN0aW9uKCBlbGVtLCB0eXBlICkge1xuXHRcdHZhciBrZXkgPSB0eXBlICsgXCJxdWV1ZUhvb2tzXCI7XG5cdFx0cmV0dXJuIGRhdGFQcml2LmdldCggZWxlbSwga2V5ICkgfHwgZGF0YVByaXYuYWNjZXNzKCBlbGVtLCBrZXksIHtcblx0XHRcdGVtcHR5OiBqUXVlcnkuQ2FsbGJhY2tzKCBcIm9uY2UgbWVtb3J5XCIgKS5hZGQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRkYXRhUHJpdi5yZW1vdmUoIGVsZW0sIFsgdHlwZSArIFwicXVldWVcIiwga2V5IF0gKTtcblx0XHRcdH0gKVxuXHRcdH0gKTtcblx0fVxufSApO1xuXG5qUXVlcnkuZm4uZXh0ZW5kKCB7XG5cdHF1ZXVlOiBmdW5jdGlvbiggdHlwZSwgZGF0YSApIHtcblx0XHR2YXIgc2V0dGVyID0gMjtcblxuXHRcdGlmICggdHlwZW9mIHR5cGUgIT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRkYXRhID0gdHlwZTtcblx0XHRcdHR5cGUgPSBcImZ4XCI7XG5cdFx0XHRzZXR0ZXItLTtcblx0XHR9XG5cblx0XHRpZiAoIGFyZ3VtZW50cy5sZW5ndGggPCBzZXR0ZXIgKSB7XG5cdFx0XHRyZXR1cm4galF1ZXJ5LnF1ZXVlKCB0aGlzWyAwIF0sIHR5cGUgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGF0YSA9PT0gdW5kZWZpbmVkID9cblx0XHRcdHRoaXMgOlxuXHRcdFx0dGhpcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIHF1ZXVlID0galF1ZXJ5LnF1ZXVlKCB0aGlzLCB0eXBlLCBkYXRhICk7XG5cblx0XHRcdFx0Ly8gRW5zdXJlIGEgaG9va3MgZm9yIHRoaXMgcXVldWVcblx0XHRcdFx0alF1ZXJ5Ll9xdWV1ZUhvb2tzKCB0aGlzLCB0eXBlICk7XG5cblx0XHRcdFx0aWYgKCB0eXBlID09PSBcImZ4XCIgJiYgcXVldWVbIDAgXSAhPT0gXCJpbnByb2dyZXNzXCIgKSB7XG5cdFx0XHRcdFx0alF1ZXJ5LmRlcXVldWUoIHRoaXMsIHR5cGUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHR9LFxuXHRkZXF1ZXVlOiBmdW5jdGlvbiggdHlwZSApIHtcblx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGpRdWVyeS5kZXF1ZXVlKCB0aGlzLCB0eXBlICk7XG5cdFx0fSApO1xuXHR9LFxuXHRjbGVhclF1ZXVlOiBmdW5jdGlvbiggdHlwZSApIHtcblx0XHRyZXR1cm4gdGhpcy5xdWV1ZSggdHlwZSB8fCBcImZ4XCIsIFtdICk7XG5cdH0sXG5cblx0Ly8gR2V0IGEgcHJvbWlzZSByZXNvbHZlZCB3aGVuIHF1ZXVlcyBvZiBhIGNlcnRhaW4gdHlwZVxuXHQvLyBhcmUgZW1wdGllZCAoZnggaXMgdGhlIHR5cGUgYnkgZGVmYXVsdClcblx0cHJvbWlzZTogZnVuY3Rpb24oIHR5cGUsIG9iaiApIHtcblx0XHR2YXIgdG1wLFxuXHRcdFx0Y291bnQgPSAxLFxuXHRcdFx0ZGVmZXIgPSBqUXVlcnkuRGVmZXJyZWQoKSxcblx0XHRcdGVsZW1lbnRzID0gdGhpcyxcblx0XHRcdGkgPSB0aGlzLmxlbmd0aCxcblx0XHRcdHJlc29sdmUgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCAhKCAtLWNvdW50ICkgKSB7XG5cdFx0XHRcdFx0ZGVmZXIucmVzb2x2ZVdpdGgoIGVsZW1lbnRzLCBbIGVsZW1lbnRzIF0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdGlmICggdHlwZW9mIHR5cGUgIT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRvYmogPSB0eXBlO1xuXHRcdFx0dHlwZSA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdFx0dHlwZSA9IHR5cGUgfHwgXCJmeFwiO1xuXG5cdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHR0bXAgPSBkYXRhUHJpdi5nZXQoIGVsZW1lbnRzWyBpIF0sIHR5cGUgKyBcInF1ZXVlSG9va3NcIiApO1xuXHRcdFx0aWYgKCB0bXAgJiYgdG1wLmVtcHR5ICkge1xuXHRcdFx0XHRjb3VudCsrO1xuXHRcdFx0XHR0bXAuZW1wdHkuYWRkKCByZXNvbHZlICk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJlc29sdmUoKTtcblx0XHRyZXR1cm4gZGVmZXIucHJvbWlzZSggb2JqICk7XG5cdH1cbn0gKTtcbnZhciBwbnVtID0gKCAvWystXT8oPzpcXGQqXFwufClcXGQrKD86W2VFXVsrLV0/XFxkK3wpLyApLnNvdXJjZTtcblxudmFyIHJjc3NOdW0gPSBuZXcgUmVnRXhwKCBcIl4oPzooWystXSk9fCkoXCIgKyBwbnVtICsgXCIpKFthLXolXSopJFwiLCBcImlcIiApO1xuXG5cbnZhciBjc3NFeHBhbmQgPSBbIFwiVG9wXCIsIFwiUmlnaHRcIiwgXCJCb3R0b21cIiwgXCJMZWZ0XCIgXTtcblxudmFyIGlzSGlkZGVuID0gZnVuY3Rpb24oIGVsZW0sIGVsICkge1xuXG5cdFx0Ly8gaXNIaWRkZW4gbWlnaHQgYmUgY2FsbGVkIGZyb20galF1ZXJ5I2ZpbHRlciBmdW5jdGlvbjtcblx0XHQvLyBpbiB0aGF0IGNhc2UsIGVsZW1lbnQgd2lsbCBiZSBzZWNvbmQgYXJndW1lbnRcblx0XHRlbGVtID0gZWwgfHwgZWxlbTtcblx0XHRyZXR1cm4galF1ZXJ5LmNzcyggZWxlbSwgXCJkaXNwbGF5XCIgKSA9PT0gXCJub25lXCIgfHxcblx0XHRcdCFqUXVlcnkuY29udGFpbnMoIGVsZW0ub3duZXJEb2N1bWVudCwgZWxlbSApO1xuXHR9O1xuXG5cblxuZnVuY3Rpb24gYWRqdXN0Q1NTKCBlbGVtLCBwcm9wLCB2YWx1ZVBhcnRzLCB0d2VlbiApIHtcblx0dmFyIGFkanVzdGVkLFxuXHRcdHNjYWxlID0gMSxcblx0XHRtYXhJdGVyYXRpb25zID0gMjAsXG5cdFx0Y3VycmVudFZhbHVlID0gdHdlZW4gP1xuXHRcdFx0ZnVuY3Rpb24oKSB7IHJldHVybiB0d2Vlbi5jdXIoKTsgfSA6XG5cdFx0XHRmdW5jdGlvbigpIHsgcmV0dXJuIGpRdWVyeS5jc3MoIGVsZW0sIHByb3AsIFwiXCIgKTsgfSxcblx0XHRpbml0aWFsID0gY3VycmVudFZhbHVlKCksXG5cdFx0dW5pdCA9IHZhbHVlUGFydHMgJiYgdmFsdWVQYXJ0c1sgMyBdIHx8ICggalF1ZXJ5LmNzc051bWJlclsgcHJvcCBdID8gXCJcIiA6IFwicHhcIiApLFxuXG5cdFx0Ly8gU3RhcnRpbmcgdmFsdWUgY29tcHV0YXRpb24gaXMgcmVxdWlyZWQgZm9yIHBvdGVudGlhbCB1bml0IG1pc21hdGNoZXNcblx0XHRpbml0aWFsSW5Vbml0ID0gKCBqUXVlcnkuY3NzTnVtYmVyWyBwcm9wIF0gfHwgdW5pdCAhPT0gXCJweFwiICYmICtpbml0aWFsICkgJiZcblx0XHRcdHJjc3NOdW0uZXhlYyggalF1ZXJ5LmNzcyggZWxlbSwgcHJvcCApICk7XG5cblx0aWYgKCBpbml0aWFsSW5Vbml0ICYmIGluaXRpYWxJblVuaXRbIDMgXSAhPT0gdW5pdCApIHtcblxuXHRcdC8vIFRydXN0IHVuaXRzIHJlcG9ydGVkIGJ5IGpRdWVyeS5jc3Ncblx0XHR1bml0ID0gdW5pdCB8fCBpbml0aWFsSW5Vbml0WyAzIF07XG5cblx0XHQvLyBNYWtlIHN1cmUgd2UgdXBkYXRlIHRoZSB0d2VlbiBwcm9wZXJ0aWVzIGxhdGVyIG9uXG5cdFx0dmFsdWVQYXJ0cyA9IHZhbHVlUGFydHMgfHwgW107XG5cblx0XHQvLyBJdGVyYXRpdmVseSBhcHByb3hpbWF0ZSBmcm9tIGEgbm9uemVybyBzdGFydGluZyBwb2ludFxuXHRcdGluaXRpYWxJblVuaXQgPSAraW5pdGlhbCB8fCAxO1xuXG5cdFx0ZG8ge1xuXG5cdFx0XHQvLyBJZiBwcmV2aW91cyBpdGVyYXRpb24gemVyb2VkIG91dCwgZG91YmxlIHVudGlsIHdlIGdldCAqc29tZXRoaW5nKi5cblx0XHRcdC8vIFVzZSBzdHJpbmcgZm9yIGRvdWJsaW5nIHNvIHdlIGRvbid0IGFjY2lkZW50YWxseSBzZWUgc2NhbGUgYXMgdW5jaGFuZ2VkIGJlbG93XG5cdFx0XHRzY2FsZSA9IHNjYWxlIHx8IFwiLjVcIjtcblxuXHRcdFx0Ly8gQWRqdXN0IGFuZCBhcHBseVxuXHRcdFx0aW5pdGlhbEluVW5pdCA9IGluaXRpYWxJblVuaXQgLyBzY2FsZTtcblx0XHRcdGpRdWVyeS5zdHlsZSggZWxlbSwgcHJvcCwgaW5pdGlhbEluVW5pdCArIHVuaXQgKTtcblxuXHRcdC8vIFVwZGF0ZSBzY2FsZSwgdG9sZXJhdGluZyB6ZXJvIG9yIE5hTiBmcm9tIHR3ZWVuLmN1cigpXG5cdFx0Ly8gQnJlYWsgdGhlIGxvb3AgaWYgc2NhbGUgaXMgdW5jaGFuZ2VkIG9yIHBlcmZlY3QsIG9yIGlmIHdlJ3ZlIGp1c3QgaGFkIGVub3VnaC5cblx0XHR9IHdoaWxlIChcblx0XHRcdHNjYWxlICE9PSAoIHNjYWxlID0gY3VycmVudFZhbHVlKCkgLyBpbml0aWFsICkgJiYgc2NhbGUgIT09IDEgJiYgLS1tYXhJdGVyYXRpb25zXG5cdFx0KTtcblx0fVxuXG5cdGlmICggdmFsdWVQYXJ0cyApIHtcblx0XHRpbml0aWFsSW5Vbml0ID0gK2luaXRpYWxJblVuaXQgfHwgK2luaXRpYWwgfHwgMDtcblxuXHRcdC8vIEFwcGx5IHJlbGF0aXZlIG9mZnNldCAoKz0vLT0pIGlmIHNwZWNpZmllZFxuXHRcdGFkanVzdGVkID0gdmFsdWVQYXJ0c1sgMSBdID9cblx0XHRcdGluaXRpYWxJblVuaXQgKyAoIHZhbHVlUGFydHNbIDEgXSArIDEgKSAqIHZhbHVlUGFydHNbIDIgXSA6XG5cdFx0XHQrdmFsdWVQYXJ0c1sgMiBdO1xuXHRcdGlmICggdHdlZW4gKSB7XG5cdFx0XHR0d2Vlbi51bml0ID0gdW5pdDtcblx0XHRcdHR3ZWVuLnN0YXJ0ID0gaW5pdGlhbEluVW5pdDtcblx0XHRcdHR3ZWVuLmVuZCA9IGFkanVzdGVkO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gYWRqdXN0ZWQ7XG59XG52YXIgcmNoZWNrYWJsZVR5cGUgPSAoIC9eKD86Y2hlY2tib3h8cmFkaW8pJC9pICk7XG5cbnZhciBydGFnTmFtZSA9ICggLzwoW1xcdzotXSspLyApO1xuXG52YXIgcnNjcmlwdFR5cGUgPSAoIC9eJHxcXC8oPzpqYXZhfGVjbWEpc2NyaXB0L2kgKTtcblxuXG5cbi8vIFdlIGhhdmUgdG8gY2xvc2UgdGhlc2UgdGFncyB0byBzdXBwb3J0IFhIVE1MICgjMTMyMDApXG52YXIgd3JhcE1hcCA9IHtcblxuXHQvLyBTdXBwb3J0OiBJRTlcblx0b3B0aW9uOiBbIDEsIFwiPHNlbGVjdCBtdWx0aXBsZT0nbXVsdGlwbGUnPlwiLCBcIjwvc2VsZWN0PlwiIF0sXG5cblx0Ly8gWEhUTUwgcGFyc2VycyBkbyBub3QgbWFnaWNhbGx5IGluc2VydCBlbGVtZW50cyBpbiB0aGVcblx0Ly8gc2FtZSB3YXkgdGhhdCB0YWcgc291cCBwYXJzZXJzIGRvLiBTbyB3ZSBjYW5ub3Qgc2hvcnRlblxuXHQvLyB0aGlzIGJ5IG9taXR0aW5nIDx0Ym9keT4gb3Igb3RoZXIgcmVxdWlyZWQgZWxlbWVudHMuXG5cdHRoZWFkOiBbIDEsIFwiPHRhYmxlPlwiLCBcIjwvdGFibGU+XCIgXSxcblx0Y29sOiBbIDIsIFwiPHRhYmxlPjxjb2xncm91cD5cIiwgXCI8L2NvbGdyb3VwPjwvdGFibGU+XCIgXSxcblx0dHI6IFsgMiwgXCI8dGFibGU+PHRib2R5PlwiLCBcIjwvdGJvZHk+PC90YWJsZT5cIiBdLFxuXHR0ZDogWyAzLCBcIjx0YWJsZT48dGJvZHk+PHRyPlwiLCBcIjwvdHI+PC90Ym9keT48L3RhYmxlPlwiIF0sXG5cblx0X2RlZmF1bHQ6IFsgMCwgXCJcIiwgXCJcIiBdXG59O1xuXG4vLyBTdXBwb3J0OiBJRTlcbndyYXBNYXAub3B0Z3JvdXAgPSB3cmFwTWFwLm9wdGlvbjtcblxud3JhcE1hcC50Ym9keSA9IHdyYXBNYXAudGZvb3QgPSB3cmFwTWFwLmNvbGdyb3VwID0gd3JhcE1hcC5jYXB0aW9uID0gd3JhcE1hcC50aGVhZDtcbndyYXBNYXAudGggPSB3cmFwTWFwLnRkO1xuXG5cbmZ1bmN0aW9uIGdldEFsbCggY29udGV4dCwgdGFnICkge1xuXG5cdC8vIFN1cHBvcnQ6IElFOS0xMStcblx0Ly8gVXNlIHR5cGVvZiB0byBhdm9pZCB6ZXJvLWFyZ3VtZW50IG1ldGhvZCBpbnZvY2F0aW9uIG9uIGhvc3Qgb2JqZWN0cyAoIzE1MTUxKVxuXHR2YXIgcmV0ID0gdHlwZW9mIGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUgIT09IFwidW5kZWZpbmVkXCIgP1xuXHRcdFx0Y29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSggdGFnIHx8IFwiKlwiICkgOlxuXHRcdFx0dHlwZW9mIGNvbnRleHQucXVlcnlTZWxlY3RvckFsbCAhPT0gXCJ1bmRlZmluZWRcIiA/XG5cdFx0XHRcdGNvbnRleHQucXVlcnlTZWxlY3RvckFsbCggdGFnIHx8IFwiKlwiICkgOlxuXHRcdFx0W107XG5cblx0cmV0dXJuIHRhZyA9PT0gdW5kZWZpbmVkIHx8IHRhZyAmJiBqUXVlcnkubm9kZU5hbWUoIGNvbnRleHQsIHRhZyApID9cblx0XHRqUXVlcnkubWVyZ2UoIFsgY29udGV4dCBdLCByZXQgKSA6XG5cdFx0cmV0O1xufVxuXG5cbi8vIE1hcmsgc2NyaXB0cyBhcyBoYXZpbmcgYWxyZWFkeSBiZWVuIGV2YWx1YXRlZFxuZnVuY3Rpb24gc2V0R2xvYmFsRXZhbCggZWxlbXMsIHJlZkVsZW1lbnRzICkge1xuXHR2YXIgaSA9IDAsXG5cdFx0bCA9IGVsZW1zLmxlbmd0aDtcblxuXHRmb3IgKCA7IGkgPCBsOyBpKysgKSB7XG5cdFx0ZGF0YVByaXYuc2V0KFxuXHRcdFx0ZWxlbXNbIGkgXSxcblx0XHRcdFwiZ2xvYmFsRXZhbFwiLFxuXHRcdFx0IXJlZkVsZW1lbnRzIHx8IGRhdGFQcml2LmdldCggcmVmRWxlbWVudHNbIGkgXSwgXCJnbG9iYWxFdmFsXCIgKVxuXHRcdCk7XG5cdH1cbn1cblxuXG52YXIgcmh0bWwgPSAvPHwmIz9cXHcrOy87XG5cbmZ1bmN0aW9uIGJ1aWxkRnJhZ21lbnQoIGVsZW1zLCBjb250ZXh0LCBzY3JpcHRzLCBzZWxlY3Rpb24sIGlnbm9yZWQgKSB7XG5cdHZhciBlbGVtLCB0bXAsIHRhZywgd3JhcCwgY29udGFpbnMsIGosXG5cdFx0ZnJhZ21lbnQgPSBjb250ZXh0LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxcblx0XHRub2RlcyA9IFtdLFxuXHRcdGkgPSAwLFxuXHRcdGwgPSBlbGVtcy5sZW5ndGg7XG5cblx0Zm9yICggOyBpIDwgbDsgaSsrICkge1xuXHRcdGVsZW0gPSBlbGVtc1sgaSBdO1xuXG5cdFx0aWYgKCBlbGVtIHx8IGVsZW0gPT09IDAgKSB7XG5cblx0XHRcdC8vIEFkZCBub2RlcyBkaXJlY3RseVxuXHRcdFx0aWYgKCBqUXVlcnkudHlwZSggZWxlbSApID09PSBcIm9iamVjdFwiICkge1xuXG5cdFx0XHRcdC8vIFN1cHBvcnQ6IEFuZHJvaWQ8NC4xLCBQaGFudG9tSlM8MlxuXHRcdFx0XHQvLyBwdXNoLmFwcGx5KF8sIGFycmF5bGlrZSkgdGhyb3dzIG9uIGFuY2llbnQgV2ViS2l0XG5cdFx0XHRcdGpRdWVyeS5tZXJnZSggbm9kZXMsIGVsZW0ubm9kZVR5cGUgPyBbIGVsZW0gXSA6IGVsZW0gKTtcblxuXHRcdFx0Ly8gQ29udmVydCBub24taHRtbCBpbnRvIGEgdGV4dCBub2RlXG5cdFx0XHR9IGVsc2UgaWYgKCAhcmh0bWwudGVzdCggZWxlbSApICkge1xuXHRcdFx0XHRub2Rlcy5wdXNoKCBjb250ZXh0LmNyZWF0ZVRleHROb2RlKCBlbGVtICkgKTtcblxuXHRcdFx0Ly8gQ29udmVydCBodG1sIGludG8gRE9NIG5vZGVzXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0bXAgPSB0bXAgfHwgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoIGNvbnRleHQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApICk7XG5cblx0XHRcdFx0Ly8gRGVzZXJpYWxpemUgYSBzdGFuZGFyZCByZXByZXNlbnRhdGlvblxuXHRcdFx0XHR0YWcgPSAoIHJ0YWdOYW1lLmV4ZWMoIGVsZW0gKSB8fCBbIFwiXCIsIFwiXCIgXSApWyAxIF0udG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0d3JhcCA9IHdyYXBNYXBbIHRhZyBdIHx8IHdyYXBNYXAuX2RlZmF1bHQ7XG5cdFx0XHRcdHRtcC5pbm5lckhUTUwgPSB3cmFwWyAxIF0gKyBqUXVlcnkuaHRtbFByZWZpbHRlciggZWxlbSApICsgd3JhcFsgMiBdO1xuXG5cdFx0XHRcdC8vIERlc2NlbmQgdGhyb3VnaCB3cmFwcGVycyB0byB0aGUgcmlnaHQgY29udGVudFxuXHRcdFx0XHRqID0gd3JhcFsgMCBdO1xuXHRcdFx0XHR3aGlsZSAoIGotLSApIHtcblx0XHRcdFx0XHR0bXAgPSB0bXAubGFzdENoaWxkO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gU3VwcG9ydDogQW5kcm9pZDw0LjEsIFBoYW50b21KUzwyXG5cdFx0XHRcdC8vIHB1c2guYXBwbHkoXywgYXJyYXlsaWtlKSB0aHJvd3Mgb24gYW5jaWVudCBXZWJLaXRcblx0XHRcdFx0alF1ZXJ5Lm1lcmdlKCBub2RlcywgdG1wLmNoaWxkTm9kZXMgKTtcblxuXHRcdFx0XHQvLyBSZW1lbWJlciB0aGUgdG9wLWxldmVsIGNvbnRhaW5lclxuXHRcdFx0XHR0bXAgPSBmcmFnbWVudC5maXJzdENoaWxkO1xuXG5cdFx0XHRcdC8vIEVuc3VyZSB0aGUgY3JlYXRlZCBub2RlcyBhcmUgb3JwaGFuZWQgKCMxMjM5Milcblx0XHRcdFx0dG1wLnRleHRDb250ZW50ID0gXCJcIjtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBSZW1vdmUgd3JhcHBlciBmcm9tIGZyYWdtZW50XG5cdGZyYWdtZW50LnRleHRDb250ZW50ID0gXCJcIjtcblxuXHRpID0gMDtcblx0d2hpbGUgKCAoIGVsZW0gPSBub2Rlc1sgaSsrIF0gKSApIHtcblxuXHRcdC8vIFNraXAgZWxlbWVudHMgYWxyZWFkeSBpbiB0aGUgY29udGV4dCBjb2xsZWN0aW9uICh0cmFjLTQwODcpXG5cdFx0aWYgKCBzZWxlY3Rpb24gJiYgalF1ZXJ5LmluQXJyYXkoIGVsZW0sIHNlbGVjdGlvbiApID4gLTEgKSB7XG5cdFx0XHRpZiAoIGlnbm9yZWQgKSB7XG5cdFx0XHRcdGlnbm9yZWQucHVzaCggZWxlbSApO1xuXHRcdFx0fVxuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0Y29udGFpbnMgPSBqUXVlcnkuY29udGFpbnMoIGVsZW0ub3duZXJEb2N1bWVudCwgZWxlbSApO1xuXG5cdFx0Ly8gQXBwZW5kIHRvIGZyYWdtZW50XG5cdFx0dG1wID0gZ2V0QWxsKCBmcmFnbWVudC5hcHBlbmRDaGlsZCggZWxlbSApLCBcInNjcmlwdFwiICk7XG5cblx0XHQvLyBQcmVzZXJ2ZSBzY3JpcHQgZXZhbHVhdGlvbiBoaXN0b3J5XG5cdFx0aWYgKCBjb250YWlucyApIHtcblx0XHRcdHNldEdsb2JhbEV2YWwoIHRtcCApO1xuXHRcdH1cblxuXHRcdC8vIENhcHR1cmUgZXhlY3V0YWJsZXNcblx0XHRpZiAoIHNjcmlwdHMgKSB7XG5cdFx0XHRqID0gMDtcblx0XHRcdHdoaWxlICggKCBlbGVtID0gdG1wWyBqKysgXSApICkge1xuXHRcdFx0XHRpZiAoIHJzY3JpcHRUeXBlLnRlc3QoIGVsZW0udHlwZSB8fCBcIlwiICkgKSB7XG5cdFx0XHRcdFx0c2NyaXB0cy5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gZnJhZ21lbnQ7XG59XG5cblxuKCBmdW5jdGlvbigpIHtcblx0dmFyIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLFxuXHRcdGRpdiA9IGZyYWdtZW50LmFwcGVuZENoaWxkKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICkgKSxcblx0XHRpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiaW5wdXRcIiApO1xuXG5cdC8vIFN1cHBvcnQ6IEFuZHJvaWQgNC4wLTQuMywgU2FmYXJpPD01LjFcblx0Ly8gQ2hlY2sgc3RhdGUgbG9zdCBpZiB0aGUgbmFtZSBpcyBzZXQgKCMxMTIxNylcblx0Ly8gU3VwcG9ydDogV2luZG93cyBXZWIgQXBwcyAoV1dBKVxuXHQvLyBgbmFtZWAgYW5kIGB0eXBlYCBtdXN0IHVzZSAuc2V0QXR0cmlidXRlIGZvciBXV0EgKCMxNDkwMSlcblx0aW5wdXQuc2V0QXR0cmlidXRlKCBcInR5cGVcIiwgXCJyYWRpb1wiICk7XG5cdGlucHV0LnNldEF0dHJpYnV0ZSggXCJjaGVja2VkXCIsIFwiY2hlY2tlZFwiICk7XG5cdGlucHV0LnNldEF0dHJpYnV0ZSggXCJuYW1lXCIsIFwidFwiICk7XG5cblx0ZGl2LmFwcGVuZENoaWxkKCBpbnB1dCApO1xuXG5cdC8vIFN1cHBvcnQ6IFNhZmFyaTw9NS4xLCBBbmRyb2lkPDQuMlxuXHQvLyBPbGRlciBXZWJLaXQgZG9lc24ndCBjbG9uZSBjaGVja2VkIHN0YXRlIGNvcnJlY3RseSBpbiBmcmFnbWVudHNcblx0c3VwcG9ydC5jaGVja0Nsb25lID0gZGl2LmNsb25lTm9kZSggdHJ1ZSApLmNsb25lTm9kZSggdHJ1ZSApLmxhc3RDaGlsZC5jaGVja2VkO1xuXG5cdC8vIFN1cHBvcnQ6IElFPD0xMStcblx0Ly8gTWFrZSBzdXJlIHRleHRhcmVhIChhbmQgY2hlY2tib3gpIGRlZmF1bHRWYWx1ZSBpcyBwcm9wZXJseSBjbG9uZWRcblx0ZGl2LmlubmVySFRNTCA9IFwiPHRleHRhcmVhPng8L3RleHRhcmVhPlwiO1xuXHRzdXBwb3J0Lm5vQ2xvbmVDaGVja2VkID0gISFkaXYuY2xvbmVOb2RlKCB0cnVlICkubGFzdENoaWxkLmRlZmF1bHRWYWx1ZTtcbn0gKSgpO1xuXG5cbnZhclxuXHRya2V5RXZlbnQgPSAvXmtleS8sXG5cdHJtb3VzZUV2ZW50ID0gL14oPzptb3VzZXxwb2ludGVyfGNvbnRleHRtZW51fGRyYWd8ZHJvcCl8Y2xpY2svLFxuXHRydHlwZW5hbWVzcGFjZSA9IC9eKFteLl0qKSg/OlxcLiguKyl8KS87XG5cbmZ1bmN0aW9uIHJldHVyblRydWUoKSB7XG5cdHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiByZXR1cm5GYWxzZSgpIHtcblx0cmV0dXJuIGZhbHNlO1xufVxuXG4vLyBTdXBwb3J0OiBJRTlcbi8vIFNlZSAjMTMzOTMgZm9yIG1vcmUgaW5mb1xuZnVuY3Rpb24gc2FmZUFjdGl2ZUVsZW1lbnQoKSB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG5cdH0gY2F0Y2ggKCBlcnIgKSB7IH1cbn1cblxuZnVuY3Rpb24gb24oIGVsZW0sIHR5cGVzLCBzZWxlY3RvciwgZGF0YSwgZm4sIG9uZSApIHtcblx0dmFyIG9yaWdGbiwgdHlwZTtcblxuXHQvLyBUeXBlcyBjYW4gYmUgYSBtYXAgb2YgdHlwZXMvaGFuZGxlcnNcblx0aWYgKCB0eXBlb2YgdHlwZXMgPT09IFwib2JqZWN0XCIgKSB7XG5cblx0XHQvLyAoIHR5cGVzLU9iamVjdCwgc2VsZWN0b3IsIGRhdGEgKVxuXHRcdGlmICggdHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiICkge1xuXG5cdFx0XHQvLyAoIHR5cGVzLU9iamVjdCwgZGF0YSApXG5cdFx0XHRkYXRhID0gZGF0YSB8fCBzZWxlY3Rvcjtcblx0XHRcdHNlbGVjdG9yID0gdW5kZWZpbmVkO1xuXHRcdH1cblx0XHRmb3IgKCB0eXBlIGluIHR5cGVzICkge1xuXHRcdFx0b24oIGVsZW0sIHR5cGUsIHNlbGVjdG9yLCBkYXRhLCB0eXBlc1sgdHlwZSBdLCBvbmUgKTtcblx0XHR9XG5cdFx0cmV0dXJuIGVsZW07XG5cdH1cblxuXHRpZiAoIGRhdGEgPT0gbnVsbCAmJiBmbiA9PSBudWxsICkge1xuXG5cdFx0Ly8gKCB0eXBlcywgZm4gKVxuXHRcdGZuID0gc2VsZWN0b3I7XG5cdFx0ZGF0YSA9IHNlbGVjdG9yID0gdW5kZWZpbmVkO1xuXHR9IGVsc2UgaWYgKCBmbiA9PSBudWxsICkge1xuXHRcdGlmICggdHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiICkge1xuXG5cdFx0XHQvLyAoIHR5cGVzLCBzZWxlY3RvciwgZm4gKVxuXHRcdFx0Zm4gPSBkYXRhO1xuXHRcdFx0ZGF0YSA9IHVuZGVmaW5lZDtcblx0XHR9IGVsc2Uge1xuXG5cdFx0XHQvLyAoIHR5cGVzLCBkYXRhLCBmbiApXG5cdFx0XHRmbiA9IGRhdGE7XG5cdFx0XHRkYXRhID0gc2VsZWN0b3I7XG5cdFx0XHRzZWxlY3RvciA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdH1cblx0aWYgKCBmbiA9PT0gZmFsc2UgKSB7XG5cdFx0Zm4gPSByZXR1cm5GYWxzZTtcblx0fSBlbHNlIGlmICggIWZuICkge1xuXHRcdHJldHVybiBlbGVtO1xuXHR9XG5cblx0aWYgKCBvbmUgPT09IDEgKSB7XG5cdFx0b3JpZ0ZuID0gZm47XG5cdFx0Zm4gPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cblx0XHRcdC8vIENhbiB1c2UgYW4gZW1wdHkgc2V0LCBzaW5jZSBldmVudCBjb250YWlucyB0aGUgaW5mb1xuXHRcdFx0alF1ZXJ5KCkub2ZmKCBldmVudCApO1xuXHRcdFx0cmV0dXJuIG9yaWdGbi5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cdFx0fTtcblxuXHRcdC8vIFVzZSBzYW1lIGd1aWQgc28gY2FsbGVyIGNhbiByZW1vdmUgdXNpbmcgb3JpZ0ZuXG5cdFx0Zm4uZ3VpZCA9IG9yaWdGbi5ndWlkIHx8ICggb3JpZ0ZuLmd1aWQgPSBqUXVlcnkuZ3VpZCsrICk7XG5cdH1cblx0cmV0dXJuIGVsZW0uZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0alF1ZXJ5LmV2ZW50LmFkZCggdGhpcywgdHlwZXMsIGZuLCBkYXRhLCBzZWxlY3RvciApO1xuXHR9ICk7XG59XG5cbi8qXG4gKiBIZWxwZXIgZnVuY3Rpb25zIGZvciBtYW5hZ2luZyBldmVudHMgLS0gbm90IHBhcnQgb2YgdGhlIHB1YmxpYyBpbnRlcmZhY2UuXG4gKiBQcm9wcyB0byBEZWFuIEVkd2FyZHMnIGFkZEV2ZW50IGxpYnJhcnkgZm9yIG1hbnkgb2YgdGhlIGlkZWFzLlxuICovXG5qUXVlcnkuZXZlbnQgPSB7XG5cblx0Z2xvYmFsOiB7fSxcblxuXHRhZGQ6IGZ1bmN0aW9uKCBlbGVtLCB0eXBlcywgaGFuZGxlciwgZGF0YSwgc2VsZWN0b3IgKSB7XG5cblx0XHR2YXIgaGFuZGxlT2JqSW4sIGV2ZW50SGFuZGxlLCB0bXAsXG5cdFx0XHRldmVudHMsIHQsIGhhbmRsZU9iaixcblx0XHRcdHNwZWNpYWwsIGhhbmRsZXJzLCB0eXBlLCBuYW1lc3BhY2VzLCBvcmlnVHlwZSxcblx0XHRcdGVsZW1EYXRhID0gZGF0YVByaXYuZ2V0KCBlbGVtICk7XG5cblx0XHQvLyBEb24ndCBhdHRhY2ggZXZlbnRzIHRvIG5vRGF0YSBvciB0ZXh0L2NvbW1lbnQgbm9kZXMgKGJ1dCBhbGxvdyBwbGFpbiBvYmplY3RzKVxuXHRcdGlmICggIWVsZW1EYXRhICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIENhbGxlciBjYW4gcGFzcyBpbiBhbiBvYmplY3Qgb2YgY3VzdG9tIGRhdGEgaW4gbGlldSBvZiB0aGUgaGFuZGxlclxuXHRcdGlmICggaGFuZGxlci5oYW5kbGVyICkge1xuXHRcdFx0aGFuZGxlT2JqSW4gPSBoYW5kbGVyO1xuXHRcdFx0aGFuZGxlciA9IGhhbmRsZU9iakluLmhhbmRsZXI7XG5cdFx0XHRzZWxlY3RvciA9IGhhbmRsZU9iakluLnNlbGVjdG9yO1xuXHRcdH1cblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBoYW5kbGVyIGhhcyBhIHVuaXF1ZSBJRCwgdXNlZCB0byBmaW5kL3JlbW92ZSBpdCBsYXRlclxuXHRcdGlmICggIWhhbmRsZXIuZ3VpZCApIHtcblx0XHRcdGhhbmRsZXIuZ3VpZCA9IGpRdWVyeS5ndWlkKys7XG5cdFx0fVxuXG5cdFx0Ly8gSW5pdCB0aGUgZWxlbWVudCdzIGV2ZW50IHN0cnVjdHVyZSBhbmQgbWFpbiBoYW5kbGVyLCBpZiB0aGlzIGlzIHRoZSBmaXJzdFxuXHRcdGlmICggISggZXZlbnRzID0gZWxlbURhdGEuZXZlbnRzICkgKSB7XG5cdFx0XHRldmVudHMgPSBlbGVtRGF0YS5ldmVudHMgPSB7fTtcblx0XHR9XG5cdFx0aWYgKCAhKCBldmVudEhhbmRsZSA9IGVsZW1EYXRhLmhhbmRsZSApICkge1xuXHRcdFx0ZXZlbnRIYW5kbGUgPSBlbGVtRGF0YS5oYW5kbGUgPSBmdW5jdGlvbiggZSApIHtcblxuXHRcdFx0XHQvLyBEaXNjYXJkIHRoZSBzZWNvbmQgZXZlbnQgb2YgYSBqUXVlcnkuZXZlbnQudHJpZ2dlcigpIGFuZFxuXHRcdFx0XHQvLyB3aGVuIGFuIGV2ZW50IGlzIGNhbGxlZCBhZnRlciBhIHBhZ2UgaGFzIHVubG9hZGVkXG5cdFx0XHRcdHJldHVybiB0eXBlb2YgalF1ZXJ5ICE9PSBcInVuZGVmaW5lZFwiICYmIGpRdWVyeS5ldmVudC50cmlnZ2VyZWQgIT09IGUudHlwZSA/XG5cdFx0XHRcdFx0alF1ZXJ5LmV2ZW50LmRpc3BhdGNoLmFwcGx5KCBlbGVtLCBhcmd1bWVudHMgKSA6IHVuZGVmaW5lZDtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Ly8gSGFuZGxlIG11bHRpcGxlIGV2ZW50cyBzZXBhcmF0ZWQgYnkgYSBzcGFjZVxuXHRcdHR5cGVzID0gKCB0eXBlcyB8fCBcIlwiICkubWF0Y2goIHJub3R3aGl0ZSApIHx8IFsgXCJcIiBdO1xuXHRcdHQgPSB0eXBlcy5sZW5ndGg7XG5cdFx0d2hpbGUgKCB0LS0gKSB7XG5cdFx0XHR0bXAgPSBydHlwZW5hbWVzcGFjZS5leGVjKCB0eXBlc1sgdCBdICkgfHwgW107XG5cdFx0XHR0eXBlID0gb3JpZ1R5cGUgPSB0bXBbIDEgXTtcblx0XHRcdG5hbWVzcGFjZXMgPSAoIHRtcFsgMiBdIHx8IFwiXCIgKS5zcGxpdCggXCIuXCIgKS5zb3J0KCk7XG5cblx0XHRcdC8vIFRoZXJlICptdXN0KiBiZSBhIHR5cGUsIG5vIGF0dGFjaGluZyBuYW1lc3BhY2Utb25seSBoYW5kbGVyc1xuXHRcdFx0aWYgKCAhdHlwZSApIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIGV2ZW50IGNoYW5nZXMgaXRzIHR5cGUsIHVzZSB0aGUgc3BlY2lhbCBldmVudCBoYW5kbGVycyBmb3IgdGhlIGNoYW5nZWQgdHlwZVxuXHRcdFx0c3BlY2lhbCA9IGpRdWVyeS5ldmVudC5zcGVjaWFsWyB0eXBlIF0gfHwge307XG5cblx0XHRcdC8vIElmIHNlbGVjdG9yIGRlZmluZWQsIGRldGVybWluZSBzcGVjaWFsIGV2ZW50IGFwaSB0eXBlLCBvdGhlcndpc2UgZ2l2ZW4gdHlwZVxuXHRcdFx0dHlwZSA9ICggc2VsZWN0b3IgPyBzcGVjaWFsLmRlbGVnYXRlVHlwZSA6IHNwZWNpYWwuYmluZFR5cGUgKSB8fCB0eXBlO1xuXG5cdFx0XHQvLyBVcGRhdGUgc3BlY2lhbCBiYXNlZCBvbiBuZXdseSByZXNldCB0eXBlXG5cdFx0XHRzcGVjaWFsID0galF1ZXJ5LmV2ZW50LnNwZWNpYWxbIHR5cGUgXSB8fCB7fTtcblxuXHRcdFx0Ly8gaGFuZGxlT2JqIGlzIHBhc3NlZCB0byBhbGwgZXZlbnQgaGFuZGxlcnNcblx0XHRcdGhhbmRsZU9iaiA9IGpRdWVyeS5leHRlbmQoIHtcblx0XHRcdFx0dHlwZTogdHlwZSxcblx0XHRcdFx0b3JpZ1R5cGU6IG9yaWdUeXBlLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHRoYW5kbGVyOiBoYW5kbGVyLFxuXHRcdFx0XHRndWlkOiBoYW5kbGVyLmd1aWQsXG5cdFx0XHRcdHNlbGVjdG9yOiBzZWxlY3Rvcixcblx0XHRcdFx0bmVlZHNDb250ZXh0OiBzZWxlY3RvciAmJiBqUXVlcnkuZXhwci5tYXRjaC5uZWVkc0NvbnRleHQudGVzdCggc2VsZWN0b3IgKSxcblx0XHRcdFx0bmFtZXNwYWNlOiBuYW1lc3BhY2VzLmpvaW4oIFwiLlwiIClcblx0XHRcdH0sIGhhbmRsZU9iakluICk7XG5cblx0XHRcdC8vIEluaXQgdGhlIGV2ZW50IGhhbmRsZXIgcXVldWUgaWYgd2UncmUgdGhlIGZpcnN0XG5cdFx0XHRpZiAoICEoIGhhbmRsZXJzID0gZXZlbnRzWyB0eXBlIF0gKSApIHtcblx0XHRcdFx0aGFuZGxlcnMgPSBldmVudHNbIHR5cGUgXSA9IFtdO1xuXHRcdFx0XHRoYW5kbGVycy5kZWxlZ2F0ZUNvdW50ID0gMDtcblxuXHRcdFx0XHQvLyBPbmx5IHVzZSBhZGRFdmVudExpc3RlbmVyIGlmIHRoZSBzcGVjaWFsIGV2ZW50cyBoYW5kbGVyIHJldHVybnMgZmFsc2Vcblx0XHRcdFx0aWYgKCAhc3BlY2lhbC5zZXR1cCB8fFxuXHRcdFx0XHRcdHNwZWNpYWwuc2V0dXAuY2FsbCggZWxlbSwgZGF0YSwgbmFtZXNwYWNlcywgZXZlbnRIYW5kbGUgKSA9PT0gZmFsc2UgKSB7XG5cblx0XHRcdFx0XHRpZiAoIGVsZW0uYWRkRXZlbnRMaXN0ZW5lciApIHtcblx0XHRcdFx0XHRcdGVsZW0uYWRkRXZlbnRMaXN0ZW5lciggdHlwZSwgZXZlbnRIYW5kbGUgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBzcGVjaWFsLmFkZCApIHtcblx0XHRcdFx0c3BlY2lhbC5hZGQuY2FsbCggZWxlbSwgaGFuZGxlT2JqICk7XG5cblx0XHRcdFx0aWYgKCAhaGFuZGxlT2JqLmhhbmRsZXIuZ3VpZCApIHtcblx0XHRcdFx0XHRoYW5kbGVPYmouaGFuZGxlci5ndWlkID0gaGFuZGxlci5ndWlkO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEFkZCB0byB0aGUgZWxlbWVudCdzIGhhbmRsZXIgbGlzdCwgZGVsZWdhdGVzIGluIGZyb250XG5cdFx0XHRpZiAoIHNlbGVjdG9yICkge1xuXHRcdFx0XHRoYW5kbGVycy5zcGxpY2UoIGhhbmRsZXJzLmRlbGVnYXRlQ291bnQrKywgMCwgaGFuZGxlT2JqICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRoYW5kbGVycy5wdXNoKCBoYW5kbGVPYmogKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gS2VlcCB0cmFjayBvZiB3aGljaCBldmVudHMgaGF2ZSBldmVyIGJlZW4gdXNlZCwgZm9yIGV2ZW50IG9wdGltaXphdGlvblxuXHRcdFx0alF1ZXJ5LmV2ZW50Lmdsb2JhbFsgdHlwZSBdID0gdHJ1ZTtcblx0XHR9XG5cblx0fSxcblxuXHQvLyBEZXRhY2ggYW4gZXZlbnQgb3Igc2V0IG9mIGV2ZW50cyBmcm9tIGFuIGVsZW1lbnRcblx0cmVtb3ZlOiBmdW5jdGlvbiggZWxlbSwgdHlwZXMsIGhhbmRsZXIsIHNlbGVjdG9yLCBtYXBwZWRUeXBlcyApIHtcblxuXHRcdHZhciBqLCBvcmlnQ291bnQsIHRtcCxcblx0XHRcdGV2ZW50cywgdCwgaGFuZGxlT2JqLFxuXHRcdFx0c3BlY2lhbCwgaGFuZGxlcnMsIHR5cGUsIG5hbWVzcGFjZXMsIG9yaWdUeXBlLFxuXHRcdFx0ZWxlbURhdGEgPSBkYXRhUHJpdi5oYXNEYXRhKCBlbGVtICkgJiYgZGF0YVByaXYuZ2V0KCBlbGVtICk7XG5cblx0XHRpZiAoICFlbGVtRGF0YSB8fCAhKCBldmVudHMgPSBlbGVtRGF0YS5ldmVudHMgKSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBPbmNlIGZvciBlYWNoIHR5cGUubmFtZXNwYWNlIGluIHR5cGVzOyB0eXBlIG1heSBiZSBvbWl0dGVkXG5cdFx0dHlwZXMgPSAoIHR5cGVzIHx8IFwiXCIgKS5tYXRjaCggcm5vdHdoaXRlICkgfHwgWyBcIlwiIF07XG5cdFx0dCA9IHR5cGVzLmxlbmd0aDtcblx0XHR3aGlsZSAoIHQtLSApIHtcblx0XHRcdHRtcCA9IHJ0eXBlbmFtZXNwYWNlLmV4ZWMoIHR5cGVzWyB0IF0gKSB8fCBbXTtcblx0XHRcdHR5cGUgPSBvcmlnVHlwZSA9IHRtcFsgMSBdO1xuXHRcdFx0bmFtZXNwYWNlcyA9ICggdG1wWyAyIF0gfHwgXCJcIiApLnNwbGl0KCBcIi5cIiApLnNvcnQoKTtcblxuXHRcdFx0Ly8gVW5iaW5kIGFsbCBldmVudHMgKG9uIHRoaXMgbmFtZXNwYWNlLCBpZiBwcm92aWRlZCkgZm9yIHRoZSBlbGVtZW50XG5cdFx0XHRpZiAoICF0eXBlICkge1xuXHRcdFx0XHRmb3IgKCB0eXBlIGluIGV2ZW50cyApIHtcblx0XHRcdFx0XHRqUXVlcnkuZXZlbnQucmVtb3ZlKCBlbGVtLCB0eXBlICsgdHlwZXNbIHQgXSwgaGFuZGxlciwgc2VsZWN0b3IsIHRydWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0c3BlY2lhbCA9IGpRdWVyeS5ldmVudC5zcGVjaWFsWyB0eXBlIF0gfHwge307XG5cdFx0XHR0eXBlID0gKCBzZWxlY3RvciA/IHNwZWNpYWwuZGVsZWdhdGVUeXBlIDogc3BlY2lhbC5iaW5kVHlwZSApIHx8IHR5cGU7XG5cdFx0XHRoYW5kbGVycyA9IGV2ZW50c1sgdHlwZSBdIHx8IFtdO1xuXHRcdFx0dG1wID0gdG1wWyAyIF0gJiZcblx0XHRcdFx0bmV3IFJlZ0V4cCggXCIoXnxcXFxcLilcIiArIG5hbWVzcGFjZXMuam9pbiggXCJcXFxcLig/Oi4qXFxcXC58KVwiICkgKyBcIihcXFxcLnwkKVwiICk7XG5cblx0XHRcdC8vIFJlbW92ZSBtYXRjaGluZyBldmVudHNcblx0XHRcdG9yaWdDb3VudCA9IGogPSBoYW5kbGVycy5sZW5ndGg7XG5cdFx0XHR3aGlsZSAoIGotLSApIHtcblx0XHRcdFx0aGFuZGxlT2JqID0gaGFuZGxlcnNbIGogXTtcblxuXHRcdFx0XHRpZiAoICggbWFwcGVkVHlwZXMgfHwgb3JpZ1R5cGUgPT09IGhhbmRsZU9iai5vcmlnVHlwZSApICYmXG5cdFx0XHRcdFx0KCAhaGFuZGxlciB8fCBoYW5kbGVyLmd1aWQgPT09IGhhbmRsZU9iai5ndWlkICkgJiZcblx0XHRcdFx0XHQoICF0bXAgfHwgdG1wLnRlc3QoIGhhbmRsZU9iai5uYW1lc3BhY2UgKSApICYmXG5cdFx0XHRcdFx0KCAhc2VsZWN0b3IgfHwgc2VsZWN0b3IgPT09IGhhbmRsZU9iai5zZWxlY3RvciB8fFxuXHRcdFx0XHRcdFx0c2VsZWN0b3IgPT09IFwiKipcIiAmJiBoYW5kbGVPYmouc2VsZWN0b3IgKSApIHtcblx0XHRcdFx0XHRoYW5kbGVycy5zcGxpY2UoIGosIDEgKTtcblxuXHRcdFx0XHRcdGlmICggaGFuZGxlT2JqLnNlbGVjdG9yICkge1xuXHRcdFx0XHRcdFx0aGFuZGxlcnMuZGVsZWdhdGVDb3VudC0tO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoIHNwZWNpYWwucmVtb3ZlICkge1xuXHRcdFx0XHRcdFx0c3BlY2lhbC5yZW1vdmUuY2FsbCggZWxlbSwgaGFuZGxlT2JqICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlbW92ZSBnZW5lcmljIGV2ZW50IGhhbmRsZXIgaWYgd2UgcmVtb3ZlZCBzb21ldGhpbmcgYW5kIG5vIG1vcmUgaGFuZGxlcnMgZXhpc3Rcblx0XHRcdC8vIChhdm9pZHMgcG90ZW50aWFsIGZvciBlbmRsZXNzIHJlY3Vyc2lvbiBkdXJpbmcgcmVtb3ZhbCBvZiBzcGVjaWFsIGV2ZW50IGhhbmRsZXJzKVxuXHRcdFx0aWYgKCBvcmlnQ291bnQgJiYgIWhhbmRsZXJzLmxlbmd0aCApIHtcblx0XHRcdFx0aWYgKCAhc3BlY2lhbC50ZWFyZG93biB8fFxuXHRcdFx0XHRcdHNwZWNpYWwudGVhcmRvd24uY2FsbCggZWxlbSwgbmFtZXNwYWNlcywgZWxlbURhdGEuaGFuZGxlICkgPT09IGZhbHNlICkge1xuXG5cdFx0XHRcdFx0alF1ZXJ5LnJlbW92ZUV2ZW50KCBlbGVtLCB0eXBlLCBlbGVtRGF0YS5oYW5kbGUgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGRlbGV0ZSBldmVudHNbIHR5cGUgXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBSZW1vdmUgZGF0YSBhbmQgdGhlIGV4cGFuZG8gaWYgaXQncyBubyBsb25nZXIgdXNlZFxuXHRcdGlmICggalF1ZXJ5LmlzRW1wdHlPYmplY3QoIGV2ZW50cyApICkge1xuXHRcdFx0ZGF0YVByaXYucmVtb3ZlKCBlbGVtLCBcImhhbmRsZSBldmVudHNcIiApO1xuXHRcdH1cblx0fSxcblxuXHRkaXNwYXRjaDogZnVuY3Rpb24oIGV2ZW50ICkge1xuXG5cdFx0Ly8gTWFrZSBhIHdyaXRhYmxlIGpRdWVyeS5FdmVudCBmcm9tIHRoZSBuYXRpdmUgZXZlbnQgb2JqZWN0XG5cdFx0ZXZlbnQgPSBqUXVlcnkuZXZlbnQuZml4KCBldmVudCApO1xuXG5cdFx0dmFyIGksIGosIHJldCwgbWF0Y2hlZCwgaGFuZGxlT2JqLFxuXHRcdFx0aGFuZGxlclF1ZXVlID0gW10sXG5cdFx0XHRhcmdzID0gc2xpY2UuY2FsbCggYXJndW1lbnRzICksXG5cdFx0XHRoYW5kbGVycyA9ICggZGF0YVByaXYuZ2V0KCB0aGlzLCBcImV2ZW50c1wiICkgfHwge30gKVsgZXZlbnQudHlwZSBdIHx8IFtdLFxuXHRcdFx0c3BlY2lhbCA9IGpRdWVyeS5ldmVudC5zcGVjaWFsWyBldmVudC50eXBlIF0gfHwge307XG5cblx0XHQvLyBVc2UgdGhlIGZpeC1lZCBqUXVlcnkuRXZlbnQgcmF0aGVyIHRoYW4gdGhlIChyZWFkLW9ubHkpIG5hdGl2ZSBldmVudFxuXHRcdGFyZ3NbIDAgXSA9IGV2ZW50O1xuXHRcdGV2ZW50LmRlbGVnYXRlVGFyZ2V0ID0gdGhpcztcblxuXHRcdC8vIENhbGwgdGhlIHByZURpc3BhdGNoIGhvb2sgZm9yIHRoZSBtYXBwZWQgdHlwZSwgYW5kIGxldCBpdCBiYWlsIGlmIGRlc2lyZWRcblx0XHRpZiAoIHNwZWNpYWwucHJlRGlzcGF0Y2ggJiYgc3BlY2lhbC5wcmVEaXNwYXRjaC5jYWxsKCB0aGlzLCBldmVudCApID09PSBmYWxzZSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBEZXRlcm1pbmUgaGFuZGxlcnNcblx0XHRoYW5kbGVyUXVldWUgPSBqUXVlcnkuZXZlbnQuaGFuZGxlcnMuY2FsbCggdGhpcywgZXZlbnQsIGhhbmRsZXJzICk7XG5cblx0XHQvLyBSdW4gZGVsZWdhdGVzIGZpcnN0OyB0aGV5IG1heSB3YW50IHRvIHN0b3AgcHJvcGFnYXRpb24gYmVuZWF0aCB1c1xuXHRcdGkgPSAwO1xuXHRcdHdoaWxlICggKCBtYXRjaGVkID0gaGFuZGxlclF1ZXVlWyBpKysgXSApICYmICFldmVudC5pc1Byb3BhZ2F0aW9uU3RvcHBlZCgpICkge1xuXHRcdFx0ZXZlbnQuY3VycmVudFRhcmdldCA9IG1hdGNoZWQuZWxlbTtcblxuXHRcdFx0aiA9IDA7XG5cdFx0XHR3aGlsZSAoICggaGFuZGxlT2JqID0gbWF0Y2hlZC5oYW5kbGVyc1sgaisrIF0gKSAmJlxuXHRcdFx0XHQhZXZlbnQuaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQoKSApIHtcblxuXHRcdFx0XHQvLyBUcmlnZ2VyZWQgZXZlbnQgbXVzdCBlaXRoZXIgMSkgaGF2ZSBubyBuYW1lc3BhY2UsIG9yIDIpIGhhdmUgbmFtZXNwYWNlKHMpXG5cdFx0XHRcdC8vIGEgc3Vic2V0IG9yIGVxdWFsIHRvIHRob3NlIGluIHRoZSBib3VuZCBldmVudCAoYm90aCBjYW4gaGF2ZSBubyBuYW1lc3BhY2UpLlxuXHRcdFx0XHRpZiAoICFldmVudC5ybmFtZXNwYWNlIHx8IGV2ZW50LnJuYW1lc3BhY2UudGVzdCggaGFuZGxlT2JqLm5hbWVzcGFjZSApICkge1xuXG5cdFx0XHRcdFx0ZXZlbnQuaGFuZGxlT2JqID0gaGFuZGxlT2JqO1xuXHRcdFx0XHRcdGV2ZW50LmRhdGEgPSBoYW5kbGVPYmouZGF0YTtcblxuXHRcdFx0XHRcdHJldCA9ICggKCBqUXVlcnkuZXZlbnQuc3BlY2lhbFsgaGFuZGxlT2JqLm9yaWdUeXBlIF0gfHwge30gKS5oYW5kbGUgfHxcblx0XHRcdFx0XHRcdGhhbmRsZU9iai5oYW5kbGVyICkuYXBwbHkoIG1hdGNoZWQuZWxlbSwgYXJncyApO1xuXG5cdFx0XHRcdFx0aWYgKCByZXQgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0XHRcdGlmICggKCBldmVudC5yZXN1bHQgPSByZXQgKSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIENhbGwgdGhlIHBvc3REaXNwYXRjaCBob29rIGZvciB0aGUgbWFwcGVkIHR5cGVcblx0XHRpZiAoIHNwZWNpYWwucG9zdERpc3BhdGNoICkge1xuXHRcdFx0c3BlY2lhbC5wb3N0RGlzcGF0Y2guY2FsbCggdGhpcywgZXZlbnQgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZXZlbnQucmVzdWx0O1xuXHR9LFxuXG5cdGhhbmRsZXJzOiBmdW5jdGlvbiggZXZlbnQsIGhhbmRsZXJzICkge1xuXHRcdHZhciBpLCBtYXRjaGVzLCBzZWwsIGhhbmRsZU9iaixcblx0XHRcdGhhbmRsZXJRdWV1ZSA9IFtdLFxuXHRcdFx0ZGVsZWdhdGVDb3VudCA9IGhhbmRsZXJzLmRlbGVnYXRlQ291bnQsXG5cdFx0XHRjdXIgPSBldmVudC50YXJnZXQ7XG5cblx0XHQvLyBTdXBwb3J0IChhdCBsZWFzdCk6IENocm9tZSwgSUU5XG5cdFx0Ly8gRmluZCBkZWxlZ2F0ZSBoYW5kbGVyc1xuXHRcdC8vIEJsYWNrLWhvbGUgU1ZHIDx1c2U+IGluc3RhbmNlIHRyZWVzICgjMTMxODApXG5cdFx0Ly9cblx0XHQvLyBTdXBwb3J0OiBGaXJlZm94PD00Mitcblx0XHQvLyBBdm9pZCBub24tbGVmdC1jbGljayBpbiBGRiBidXQgZG9uJ3QgYmxvY2sgSUUgcmFkaW8gZXZlbnRzICgjMzg2MSwgZ2gtMjM0Mylcblx0XHRpZiAoIGRlbGVnYXRlQ291bnQgJiYgY3VyLm5vZGVUeXBlICYmXG5cdFx0XHQoIGV2ZW50LnR5cGUgIT09IFwiY2xpY2tcIiB8fCBpc05hTiggZXZlbnQuYnV0dG9uICkgfHwgZXZlbnQuYnV0dG9uIDwgMSApICkge1xuXG5cdFx0XHRmb3IgKCA7IGN1ciAhPT0gdGhpczsgY3VyID0gY3VyLnBhcmVudE5vZGUgfHwgdGhpcyApIHtcblxuXHRcdFx0XHQvLyBEb24ndCBjaGVjayBub24tZWxlbWVudHMgKCMxMzIwOClcblx0XHRcdFx0Ly8gRG9uJ3QgcHJvY2VzcyBjbGlja3Mgb24gZGlzYWJsZWQgZWxlbWVudHMgKCM2OTExLCAjODE2NSwgIzExMzgyLCAjMTE3NjQpXG5cdFx0XHRcdGlmICggY3VyLm5vZGVUeXBlID09PSAxICYmICggY3VyLmRpc2FibGVkICE9PSB0cnVlIHx8IGV2ZW50LnR5cGUgIT09IFwiY2xpY2tcIiApICkge1xuXHRcdFx0XHRcdG1hdGNoZXMgPSBbXTtcblx0XHRcdFx0XHRmb3IgKCBpID0gMDsgaSA8IGRlbGVnYXRlQ291bnQ7IGkrKyApIHtcblx0XHRcdFx0XHRcdGhhbmRsZU9iaiA9IGhhbmRsZXJzWyBpIF07XG5cblx0XHRcdFx0XHRcdC8vIERvbid0IGNvbmZsaWN0IHdpdGggT2JqZWN0LnByb3RvdHlwZSBwcm9wZXJ0aWVzICgjMTMyMDMpXG5cdFx0XHRcdFx0XHRzZWwgPSBoYW5kbGVPYmouc2VsZWN0b3IgKyBcIiBcIjtcblxuXHRcdFx0XHRcdFx0aWYgKCBtYXRjaGVzWyBzZWwgXSA9PT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdFx0XHRtYXRjaGVzWyBzZWwgXSA9IGhhbmRsZU9iai5uZWVkc0NvbnRleHQgP1xuXHRcdFx0XHRcdFx0XHRcdGpRdWVyeSggc2VsLCB0aGlzICkuaW5kZXgoIGN1ciApID4gLTEgOlxuXHRcdFx0XHRcdFx0XHRcdGpRdWVyeS5maW5kKCBzZWwsIHRoaXMsIG51bGwsIFsgY3VyIF0gKS5sZW5ndGg7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoIG1hdGNoZXNbIHNlbCBdICkge1xuXHRcdFx0XHRcdFx0XHRtYXRjaGVzLnB1c2goIGhhbmRsZU9iaiApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoIG1hdGNoZXMubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0aGFuZGxlclF1ZXVlLnB1c2goIHsgZWxlbTogY3VyLCBoYW5kbGVyczogbWF0Y2hlcyB9ICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gQWRkIHRoZSByZW1haW5pbmcgKGRpcmVjdGx5LWJvdW5kKSBoYW5kbGVyc1xuXHRcdGlmICggZGVsZWdhdGVDb3VudCA8IGhhbmRsZXJzLmxlbmd0aCApIHtcblx0XHRcdGhhbmRsZXJRdWV1ZS5wdXNoKCB7IGVsZW06IHRoaXMsIGhhbmRsZXJzOiBoYW5kbGVycy5zbGljZSggZGVsZWdhdGVDb3VudCApIH0gKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gaGFuZGxlclF1ZXVlO1xuXHR9LFxuXG5cdC8vIEluY2x1ZGVzIHNvbWUgZXZlbnQgcHJvcHMgc2hhcmVkIGJ5IEtleUV2ZW50IGFuZCBNb3VzZUV2ZW50XG5cdHByb3BzOiAoIFwiYWx0S2V5IGJ1YmJsZXMgY2FuY2VsYWJsZSBjdHJsS2V5IGN1cnJlbnRUYXJnZXQgZGV0YWlsIGV2ZW50UGhhc2UgXCIgK1xuXHRcdFwibWV0YUtleSByZWxhdGVkVGFyZ2V0IHNoaWZ0S2V5IHRhcmdldCB0aW1lU3RhbXAgdmlldyB3aGljaFwiICkuc3BsaXQoIFwiIFwiICksXG5cblx0Zml4SG9va3M6IHt9LFxuXG5cdGtleUhvb2tzOiB7XG5cdFx0cHJvcHM6IFwiY2hhciBjaGFyQ29kZSBrZXkga2V5Q29kZVwiLnNwbGl0KCBcIiBcIiApLFxuXHRcdGZpbHRlcjogZnVuY3Rpb24oIGV2ZW50LCBvcmlnaW5hbCApIHtcblxuXHRcdFx0Ly8gQWRkIHdoaWNoIGZvciBrZXkgZXZlbnRzXG5cdFx0XHRpZiAoIGV2ZW50LndoaWNoID09IG51bGwgKSB7XG5cdFx0XHRcdGV2ZW50LndoaWNoID0gb3JpZ2luYWwuY2hhckNvZGUgIT0gbnVsbCA/IG9yaWdpbmFsLmNoYXJDb2RlIDogb3JpZ2luYWwua2V5Q29kZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGV2ZW50O1xuXHRcdH1cblx0fSxcblxuXHRtb3VzZUhvb2tzOiB7XG5cdFx0cHJvcHM6ICggXCJidXR0b24gYnV0dG9ucyBjbGllbnRYIGNsaWVudFkgb2Zmc2V0WCBvZmZzZXRZIHBhZ2VYIHBhZ2VZIFwiICtcblx0XHRcdFwic2NyZWVuWCBzY3JlZW5ZIHRvRWxlbWVudFwiICkuc3BsaXQoIFwiIFwiICksXG5cdFx0ZmlsdGVyOiBmdW5jdGlvbiggZXZlbnQsIG9yaWdpbmFsICkge1xuXHRcdFx0dmFyIGV2ZW50RG9jLCBkb2MsIGJvZHksXG5cdFx0XHRcdGJ1dHRvbiA9IG9yaWdpbmFsLmJ1dHRvbjtcblxuXHRcdFx0Ly8gQ2FsY3VsYXRlIHBhZ2VYL1kgaWYgbWlzc2luZyBhbmQgY2xpZW50WC9ZIGF2YWlsYWJsZVxuXHRcdFx0aWYgKCBldmVudC5wYWdlWCA9PSBudWxsICYmIG9yaWdpbmFsLmNsaWVudFggIT0gbnVsbCApIHtcblx0XHRcdFx0ZXZlbnREb2MgPSBldmVudC50YXJnZXQub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudDtcblx0XHRcdFx0ZG9jID0gZXZlbnREb2MuZG9jdW1lbnRFbGVtZW50O1xuXHRcdFx0XHRib2R5ID0gZXZlbnREb2MuYm9keTtcblxuXHRcdFx0XHRldmVudC5wYWdlWCA9IG9yaWdpbmFsLmNsaWVudFggK1xuXHRcdFx0XHRcdCggZG9jICYmIGRvYy5zY3JvbGxMZWZ0IHx8IGJvZHkgJiYgYm9keS5zY3JvbGxMZWZ0IHx8IDAgKSAtXG5cdFx0XHRcdFx0KCBkb2MgJiYgZG9jLmNsaWVudExlZnQgfHwgYm9keSAmJiBib2R5LmNsaWVudExlZnQgfHwgMCApO1xuXHRcdFx0XHRldmVudC5wYWdlWSA9IG9yaWdpbmFsLmNsaWVudFkgK1xuXHRcdFx0XHRcdCggZG9jICYmIGRvYy5zY3JvbGxUb3AgIHx8IGJvZHkgJiYgYm9keS5zY3JvbGxUb3AgIHx8IDAgKSAtXG5cdFx0XHRcdFx0KCBkb2MgJiYgZG9jLmNsaWVudFRvcCAgfHwgYm9keSAmJiBib2R5LmNsaWVudFRvcCAgfHwgMCApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBZGQgd2hpY2ggZm9yIGNsaWNrOiAxID09PSBsZWZ0OyAyID09PSBtaWRkbGU7IDMgPT09IHJpZ2h0XG5cdFx0XHQvLyBOb3RlOiBidXR0b24gaXMgbm90IG5vcm1hbGl6ZWQsIHNvIGRvbid0IHVzZSBpdFxuXHRcdFx0aWYgKCAhZXZlbnQud2hpY2ggJiYgYnV0dG9uICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdGV2ZW50LndoaWNoID0gKCBidXR0b24gJiAxID8gMSA6ICggYnV0dG9uICYgMiA/IDMgOiAoIGJ1dHRvbiAmIDQgPyAyIDogMCApICkgKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGV2ZW50O1xuXHRcdH1cblx0fSxcblxuXHRmaXg6IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRpZiAoIGV2ZW50WyBqUXVlcnkuZXhwYW5kbyBdICkge1xuXHRcdFx0cmV0dXJuIGV2ZW50O1xuXHRcdH1cblxuXHRcdC8vIENyZWF0ZSBhIHdyaXRhYmxlIGNvcHkgb2YgdGhlIGV2ZW50IG9iamVjdCBhbmQgbm9ybWFsaXplIHNvbWUgcHJvcGVydGllc1xuXHRcdHZhciBpLCBwcm9wLCBjb3B5LFxuXHRcdFx0dHlwZSA9IGV2ZW50LnR5cGUsXG5cdFx0XHRvcmlnaW5hbEV2ZW50ID0gZXZlbnQsXG5cdFx0XHRmaXhIb29rID0gdGhpcy5maXhIb29rc1sgdHlwZSBdO1xuXG5cdFx0aWYgKCAhZml4SG9vayApIHtcblx0XHRcdHRoaXMuZml4SG9va3NbIHR5cGUgXSA9IGZpeEhvb2sgPVxuXHRcdFx0XHRybW91c2VFdmVudC50ZXN0KCB0eXBlICkgPyB0aGlzLm1vdXNlSG9va3MgOlxuXHRcdFx0XHRya2V5RXZlbnQudGVzdCggdHlwZSApID8gdGhpcy5rZXlIb29rcyA6XG5cdFx0XHRcdHt9O1xuXHRcdH1cblx0XHRjb3B5ID0gZml4SG9vay5wcm9wcyA/IHRoaXMucHJvcHMuY29uY2F0KCBmaXhIb29rLnByb3BzICkgOiB0aGlzLnByb3BzO1xuXG5cdFx0ZXZlbnQgPSBuZXcgalF1ZXJ5LkV2ZW50KCBvcmlnaW5hbEV2ZW50ICk7XG5cblx0XHRpID0gY29weS5sZW5ndGg7XG5cdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRwcm9wID0gY29weVsgaSBdO1xuXHRcdFx0ZXZlbnRbIHByb3AgXSA9IG9yaWdpbmFsRXZlbnRbIHByb3AgXTtcblx0XHR9XG5cblx0XHQvLyBTdXBwb3J0OiBDb3Jkb3ZhIDIuNSAoV2ViS2l0KSAoIzEzMjU1KVxuXHRcdC8vIEFsbCBldmVudHMgc2hvdWxkIGhhdmUgYSB0YXJnZXQ7IENvcmRvdmEgZGV2aWNlcmVhZHkgZG9lc24ndFxuXHRcdGlmICggIWV2ZW50LnRhcmdldCApIHtcblx0XHRcdGV2ZW50LnRhcmdldCA9IGRvY3VtZW50O1xuXHRcdH1cblxuXHRcdC8vIFN1cHBvcnQ6IFNhZmFyaSA2LjArLCBDaHJvbWU8Mjhcblx0XHQvLyBUYXJnZXQgc2hvdWxkIG5vdCBiZSBhIHRleHQgbm9kZSAoIzUwNCwgIzEzMTQzKVxuXHRcdGlmICggZXZlbnQudGFyZ2V0Lm5vZGVUeXBlID09PSAzICkge1xuXHRcdFx0ZXZlbnQudGFyZ2V0ID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZpeEhvb2suZmlsdGVyID8gZml4SG9vay5maWx0ZXIoIGV2ZW50LCBvcmlnaW5hbEV2ZW50ICkgOiBldmVudDtcblx0fSxcblxuXHRzcGVjaWFsOiB7XG5cdFx0bG9hZDoge1xuXG5cdFx0XHQvLyBQcmV2ZW50IHRyaWdnZXJlZCBpbWFnZS5sb2FkIGV2ZW50cyBmcm9tIGJ1YmJsaW5nIHRvIHdpbmRvdy5sb2FkXG5cdFx0XHRub0J1YmJsZTogdHJ1ZVxuXHRcdH0sXG5cdFx0Zm9jdXM6IHtcblxuXHRcdFx0Ly8gRmlyZSBuYXRpdmUgZXZlbnQgaWYgcG9zc2libGUgc28gYmx1ci9mb2N1cyBzZXF1ZW5jZSBpcyBjb3JyZWN0XG5cdFx0XHR0cmlnZ2VyOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCB0aGlzICE9PSBzYWZlQWN0aXZlRWxlbWVudCgpICYmIHRoaXMuZm9jdXMgKSB7XG5cdFx0XHRcdFx0dGhpcy5mb2N1cygpO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGRlbGVnYXRlVHlwZTogXCJmb2N1c2luXCJcblx0XHR9LFxuXHRcdGJsdXI6IHtcblx0XHRcdHRyaWdnZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoIHRoaXMgPT09IHNhZmVBY3RpdmVFbGVtZW50KCkgJiYgdGhpcy5ibHVyICkge1xuXHRcdFx0XHRcdHRoaXMuYmx1cigpO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGRlbGVnYXRlVHlwZTogXCJmb2N1c291dFwiXG5cdFx0fSxcblx0XHRjbGljazoge1xuXG5cdFx0XHQvLyBGb3IgY2hlY2tib3gsIGZpcmUgbmF0aXZlIGV2ZW50IHNvIGNoZWNrZWQgc3RhdGUgd2lsbCBiZSByaWdodFxuXHRcdFx0dHJpZ2dlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggdGhpcy50eXBlID09PSBcImNoZWNrYm94XCIgJiYgdGhpcy5jbGljayAmJiBqUXVlcnkubm9kZU5hbWUoIHRoaXMsIFwiaW5wdXRcIiApICkge1xuXHRcdFx0XHRcdHRoaXMuY2xpY2soKTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdC8vIEZvciBjcm9zcy1icm93c2VyIGNvbnNpc3RlbmN5LCBkb24ndCBmaXJlIG5hdGl2ZSAuY2xpY2soKSBvbiBsaW5rc1xuXHRcdFx0X2RlZmF1bHQ6IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0cmV0dXJuIGpRdWVyeS5ub2RlTmFtZSggZXZlbnQudGFyZ2V0LCBcImFcIiApO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRiZWZvcmV1bmxvYWQ6IHtcblx0XHRcdHBvc3REaXNwYXRjaDogZnVuY3Rpb24oIGV2ZW50ICkge1xuXG5cdFx0XHRcdC8vIFN1cHBvcnQ6IEZpcmVmb3ggMjArXG5cdFx0XHRcdC8vIEZpcmVmb3ggZG9lc24ndCBhbGVydCBpZiB0aGUgcmV0dXJuVmFsdWUgZmllbGQgaXMgbm90IHNldC5cblx0XHRcdFx0aWYgKCBldmVudC5yZXN1bHQgIT09IHVuZGVmaW5lZCAmJiBldmVudC5vcmlnaW5hbEV2ZW50ICkge1xuXHRcdFx0XHRcdGV2ZW50Lm9yaWdpbmFsRXZlbnQucmV0dXJuVmFsdWUgPSBldmVudC5yZXN1bHQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn07XG5cbmpRdWVyeS5yZW1vdmVFdmVudCA9IGZ1bmN0aW9uKCBlbGVtLCB0eXBlLCBoYW5kbGUgKSB7XG5cblx0Ly8gVGhpcyBcImlmXCIgaXMgbmVlZGVkIGZvciBwbGFpbiBvYmplY3RzXG5cdGlmICggZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyICkge1xuXHRcdGVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lciggdHlwZSwgaGFuZGxlICk7XG5cdH1cbn07XG5cbmpRdWVyeS5FdmVudCA9IGZ1bmN0aW9uKCBzcmMsIHByb3BzICkge1xuXG5cdC8vIEFsbG93IGluc3RhbnRpYXRpb24gd2l0aG91dCB0aGUgJ25ldycga2V5d29yZFxuXHRpZiAoICEoIHRoaXMgaW5zdGFuY2VvZiBqUXVlcnkuRXZlbnQgKSApIHtcblx0XHRyZXR1cm4gbmV3IGpRdWVyeS5FdmVudCggc3JjLCBwcm9wcyApO1xuXHR9XG5cblx0Ly8gRXZlbnQgb2JqZWN0XG5cdGlmICggc3JjICYmIHNyYy50eXBlICkge1xuXHRcdHRoaXMub3JpZ2luYWxFdmVudCA9IHNyYztcblx0XHR0aGlzLnR5cGUgPSBzcmMudHlwZTtcblxuXHRcdC8vIEV2ZW50cyBidWJibGluZyB1cCB0aGUgZG9jdW1lbnQgbWF5IGhhdmUgYmVlbiBtYXJrZWQgYXMgcHJldmVudGVkXG5cdFx0Ly8gYnkgYSBoYW5kbGVyIGxvd2VyIGRvd24gdGhlIHRyZWU7IHJlZmxlY3QgdGhlIGNvcnJlY3QgdmFsdWUuXG5cdFx0dGhpcy5pc0RlZmF1bHRQcmV2ZW50ZWQgPSBzcmMuZGVmYXVsdFByZXZlbnRlZCB8fFxuXHRcdFx0XHRzcmMuZGVmYXVsdFByZXZlbnRlZCA9PT0gdW5kZWZpbmVkICYmXG5cblx0XHRcdFx0Ly8gU3VwcG9ydDogQW5kcm9pZDw0LjBcblx0XHRcdFx0c3JjLnJldHVyblZhbHVlID09PSBmYWxzZSA/XG5cdFx0XHRyZXR1cm5UcnVlIDpcblx0XHRcdHJldHVybkZhbHNlO1xuXG5cdC8vIEV2ZW50IHR5cGVcblx0fSBlbHNlIHtcblx0XHR0aGlzLnR5cGUgPSBzcmM7XG5cdH1cblxuXHQvLyBQdXQgZXhwbGljaXRseSBwcm92aWRlZCBwcm9wZXJ0aWVzIG9udG8gdGhlIGV2ZW50IG9iamVjdFxuXHRpZiAoIHByb3BzICkge1xuXHRcdGpRdWVyeS5leHRlbmQoIHRoaXMsIHByb3BzICk7XG5cdH1cblxuXHQvLyBDcmVhdGUgYSB0aW1lc3RhbXAgaWYgaW5jb21pbmcgZXZlbnQgZG9lc24ndCBoYXZlIG9uZVxuXHR0aGlzLnRpbWVTdGFtcCA9IHNyYyAmJiBzcmMudGltZVN0YW1wIHx8IGpRdWVyeS5ub3coKTtcblxuXHQvLyBNYXJrIGl0IGFzIGZpeGVkXG5cdHRoaXNbIGpRdWVyeS5leHBhbmRvIF0gPSB0cnVlO1xufTtcblxuLy8galF1ZXJ5LkV2ZW50IGlzIGJhc2VkIG9uIERPTTMgRXZlbnRzIGFzIHNwZWNpZmllZCBieSB0aGUgRUNNQVNjcmlwdCBMYW5ndWFnZSBCaW5kaW5nXG4vLyBodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAzL1dELURPTS1MZXZlbC0zLUV2ZW50cy0yMDAzMDMzMS9lY21hLXNjcmlwdC1iaW5kaW5nLmh0bWxcbmpRdWVyeS5FdmVudC5wcm90b3R5cGUgPSB7XG5cdGNvbnN0cnVjdG9yOiBqUXVlcnkuRXZlbnQsXG5cdGlzRGVmYXVsdFByZXZlbnRlZDogcmV0dXJuRmFsc2UsXG5cdGlzUHJvcGFnYXRpb25TdG9wcGVkOiByZXR1cm5GYWxzZSxcblx0aXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQ6IHJldHVybkZhbHNlLFxuXG5cdHByZXZlbnREZWZhdWx0OiBmdW5jdGlvbigpIHtcblx0XHR2YXIgZSA9IHRoaXMub3JpZ2luYWxFdmVudDtcblxuXHRcdHRoaXMuaXNEZWZhdWx0UHJldmVudGVkID0gcmV0dXJuVHJ1ZTtcblxuXHRcdGlmICggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHR9XG5cdH0sXG5cdHN0b3BQcm9wYWdhdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGUgPSB0aGlzLm9yaWdpbmFsRXZlbnQ7XG5cblx0XHR0aGlzLmlzUHJvcGFnYXRpb25TdG9wcGVkID0gcmV0dXJuVHJ1ZTtcblxuXHRcdGlmICggZSApIHtcblx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0fVxuXHR9LFxuXHRzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBlID0gdGhpcy5vcmlnaW5hbEV2ZW50O1xuXG5cdFx0dGhpcy5pc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCA9IHJldHVyblRydWU7XG5cblx0XHRpZiAoIGUgKSB7XG5cdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdH1cblxuXHRcdHRoaXMuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdH1cbn07XG5cbi8vIENyZWF0ZSBtb3VzZWVudGVyL2xlYXZlIGV2ZW50cyB1c2luZyBtb3VzZW92ZXIvb3V0IGFuZCBldmVudC10aW1lIGNoZWNrc1xuLy8gc28gdGhhdCBldmVudCBkZWxlZ2F0aW9uIHdvcmtzIGluIGpRdWVyeS5cbi8vIERvIHRoZSBzYW1lIGZvciBwb2ludGVyZW50ZXIvcG9pbnRlcmxlYXZlIGFuZCBwb2ludGVyb3Zlci9wb2ludGVyb3V0XG4vL1xuLy8gU3VwcG9ydDogU2FmYXJpIDcgb25seVxuLy8gU2FmYXJpIHNlbmRzIG1vdXNlZW50ZXIgdG9vIG9mdGVuOyBzZWU6XG4vLyBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NDcwMjU4XG4vLyBmb3IgdGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBidWcgKGl0IGV4aXN0ZWQgaW4gb2xkZXIgQ2hyb21lIHZlcnNpb25zIGFzIHdlbGwpLlxualF1ZXJ5LmVhY2goIHtcblx0bW91c2VlbnRlcjogXCJtb3VzZW92ZXJcIixcblx0bW91c2VsZWF2ZTogXCJtb3VzZW91dFwiLFxuXHRwb2ludGVyZW50ZXI6IFwicG9pbnRlcm92ZXJcIixcblx0cG9pbnRlcmxlYXZlOiBcInBvaW50ZXJvdXRcIlxufSwgZnVuY3Rpb24oIG9yaWcsIGZpeCApIHtcblx0alF1ZXJ5LmV2ZW50LnNwZWNpYWxbIG9yaWcgXSA9IHtcblx0XHRkZWxlZ2F0ZVR5cGU6IGZpeCxcblx0XHRiaW5kVHlwZTogZml4LFxuXG5cdFx0aGFuZGxlOiBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHR2YXIgcmV0LFxuXHRcdFx0XHR0YXJnZXQgPSB0aGlzLFxuXHRcdFx0XHRyZWxhdGVkID0gZXZlbnQucmVsYXRlZFRhcmdldCxcblx0XHRcdFx0aGFuZGxlT2JqID0gZXZlbnQuaGFuZGxlT2JqO1xuXG5cdFx0XHQvLyBGb3IgbW91c2VlbnRlci9sZWF2ZSBjYWxsIHRoZSBoYW5kbGVyIGlmIHJlbGF0ZWQgaXMgb3V0c2lkZSB0aGUgdGFyZ2V0LlxuXHRcdFx0Ly8gTkI6IE5vIHJlbGF0ZWRUYXJnZXQgaWYgdGhlIG1vdXNlIGxlZnQvZW50ZXJlZCB0aGUgYnJvd3NlciB3aW5kb3dcblx0XHRcdGlmICggIXJlbGF0ZWQgfHwgKCByZWxhdGVkICE9PSB0YXJnZXQgJiYgIWpRdWVyeS5jb250YWlucyggdGFyZ2V0LCByZWxhdGVkICkgKSApIHtcblx0XHRcdFx0ZXZlbnQudHlwZSA9IGhhbmRsZU9iai5vcmlnVHlwZTtcblx0XHRcdFx0cmV0ID0gaGFuZGxlT2JqLmhhbmRsZXIuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXHRcdFx0XHRldmVudC50eXBlID0gZml4O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJldDtcblx0XHR9XG5cdH07XG59ICk7XG5cbmpRdWVyeS5mbi5leHRlbmQoIHtcblx0b246IGZ1bmN0aW9uKCB0eXBlcywgc2VsZWN0b3IsIGRhdGEsIGZuICkge1xuXHRcdHJldHVybiBvbiggdGhpcywgdHlwZXMsIHNlbGVjdG9yLCBkYXRhLCBmbiApO1xuXHR9LFxuXHRvbmU6IGZ1bmN0aW9uKCB0eXBlcywgc2VsZWN0b3IsIGRhdGEsIGZuICkge1xuXHRcdHJldHVybiBvbiggdGhpcywgdHlwZXMsIHNlbGVjdG9yLCBkYXRhLCBmbiwgMSApO1xuXHR9LFxuXHRvZmY6IGZ1bmN0aW9uKCB0eXBlcywgc2VsZWN0b3IsIGZuICkge1xuXHRcdHZhciBoYW5kbGVPYmosIHR5cGU7XG5cdFx0aWYgKCB0eXBlcyAmJiB0eXBlcy5wcmV2ZW50RGVmYXVsdCAmJiB0eXBlcy5oYW5kbGVPYmogKSB7XG5cblx0XHRcdC8vICggZXZlbnQgKSAgZGlzcGF0Y2hlZCBqUXVlcnkuRXZlbnRcblx0XHRcdGhhbmRsZU9iaiA9IHR5cGVzLmhhbmRsZU9iajtcblx0XHRcdGpRdWVyeSggdHlwZXMuZGVsZWdhdGVUYXJnZXQgKS5vZmYoXG5cdFx0XHRcdGhhbmRsZU9iai5uYW1lc3BhY2UgP1xuXHRcdFx0XHRcdGhhbmRsZU9iai5vcmlnVHlwZSArIFwiLlwiICsgaGFuZGxlT2JqLm5hbWVzcGFjZSA6XG5cdFx0XHRcdFx0aGFuZGxlT2JqLm9yaWdUeXBlLFxuXHRcdFx0XHRoYW5kbGVPYmouc2VsZWN0b3IsXG5cdFx0XHRcdGhhbmRsZU9iai5oYW5kbGVyXG5cdFx0XHQpO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXHRcdGlmICggdHlwZW9mIHR5cGVzID09PSBcIm9iamVjdFwiICkge1xuXG5cdFx0XHQvLyAoIHR5cGVzLW9iamVjdCBbLCBzZWxlY3Rvcl0gKVxuXHRcdFx0Zm9yICggdHlwZSBpbiB0eXBlcyApIHtcblx0XHRcdFx0dGhpcy5vZmYoIHR5cGUsIHNlbGVjdG9yLCB0eXBlc1sgdHlwZSBdICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdFx0aWYgKCBzZWxlY3RvciA9PT0gZmFsc2UgfHwgdHlwZW9mIHNlbGVjdG9yID09PSBcImZ1bmN0aW9uXCIgKSB7XG5cblx0XHRcdC8vICggdHlwZXMgWywgZm5dIClcblx0XHRcdGZuID0gc2VsZWN0b3I7XG5cdFx0XHRzZWxlY3RvciA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdFx0aWYgKCBmbiA9PT0gZmFsc2UgKSB7XG5cdFx0XHRmbiA9IHJldHVybkZhbHNlO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGpRdWVyeS5ldmVudC5yZW1vdmUoIHRoaXMsIHR5cGVzLCBmbiwgc2VsZWN0b3IgKTtcblx0XHR9ICk7XG5cdH1cbn0gKTtcblxuXG52YXJcblx0cnhodG1sVGFnID0gLzwoPyFhcmVhfGJyfGNvbHxlbWJlZHxocnxpbWd8aW5wdXR8bGlua3xtZXRhfHBhcmFtKSgoW1xcdzotXSspW14+XSopXFwvPi9naSxcblxuXHQvLyBTdXBwb3J0OiBJRSAxMC0xMSwgRWRnZSAxMDI0MCtcblx0Ly8gSW4gSUUvRWRnZSB1c2luZyByZWdleCBncm91cHMgaGVyZSBjYXVzZXMgc2V2ZXJlIHNsb3dkb3ducy5cblx0Ly8gU2VlIGh0dHBzOi8vY29ubmVjdC5taWNyb3NvZnQuY29tL0lFL2ZlZWRiYWNrL2RldGFpbHMvMTczNjUxMi9cblx0cm5vSW5uZXJodG1sID0gLzxzY3JpcHR8PHN0eWxlfDxsaW5rL2ksXG5cblx0Ly8gY2hlY2tlZD1cImNoZWNrZWRcIiBvciBjaGVja2VkXG5cdHJjaGVja2VkID0gL2NoZWNrZWRcXHMqKD86W149XXw9XFxzKi5jaGVja2VkLikvaSxcblx0cnNjcmlwdFR5cGVNYXNrZWQgPSAvXnRydWVcXC8oLiopLyxcblx0cmNsZWFuU2NyaXB0ID0gL15cXHMqPCEoPzpcXFtDREFUQVxcW3wtLSl8KD86XFxdXFxdfC0tKT5cXHMqJC9nO1xuXG4vLyBNYW5pcHVsYXRpbmcgdGFibGVzIHJlcXVpcmVzIGEgdGJvZHlcbmZ1bmN0aW9uIG1hbmlwdWxhdGlvblRhcmdldCggZWxlbSwgY29udGVudCApIHtcblx0cmV0dXJuIGpRdWVyeS5ub2RlTmFtZSggZWxlbSwgXCJ0YWJsZVwiICkgJiZcblx0XHRqUXVlcnkubm9kZU5hbWUoIGNvbnRlbnQubm9kZVR5cGUgIT09IDExID8gY29udGVudCA6IGNvbnRlbnQuZmlyc3RDaGlsZCwgXCJ0clwiICkgP1xuXG5cdFx0ZWxlbS5nZXRFbGVtZW50c0J5VGFnTmFtZSggXCJ0Ym9keVwiIClbIDAgXSB8fFxuXHRcdFx0ZWxlbS5hcHBlbmRDaGlsZCggZWxlbS5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwidGJvZHlcIiApICkgOlxuXHRcdGVsZW07XG59XG5cbi8vIFJlcGxhY2UvcmVzdG9yZSB0aGUgdHlwZSBhdHRyaWJ1dGUgb2Ygc2NyaXB0IGVsZW1lbnRzIGZvciBzYWZlIERPTSBtYW5pcHVsYXRpb25cbmZ1bmN0aW9uIGRpc2FibGVTY3JpcHQoIGVsZW0gKSB7XG5cdGVsZW0udHlwZSA9ICggZWxlbS5nZXRBdHRyaWJ1dGUoIFwidHlwZVwiICkgIT09IG51bGwgKSArIFwiL1wiICsgZWxlbS50eXBlO1xuXHRyZXR1cm4gZWxlbTtcbn1cbmZ1bmN0aW9uIHJlc3RvcmVTY3JpcHQoIGVsZW0gKSB7XG5cdHZhciBtYXRjaCA9IHJzY3JpcHRUeXBlTWFza2VkLmV4ZWMoIGVsZW0udHlwZSApO1xuXG5cdGlmICggbWF0Y2ggKSB7XG5cdFx0ZWxlbS50eXBlID0gbWF0Y2hbIDEgXTtcblx0fSBlbHNlIHtcblx0XHRlbGVtLnJlbW92ZUF0dHJpYnV0ZSggXCJ0eXBlXCIgKTtcblx0fVxuXG5cdHJldHVybiBlbGVtO1xufVxuXG5mdW5jdGlvbiBjbG9uZUNvcHlFdmVudCggc3JjLCBkZXN0ICkge1xuXHR2YXIgaSwgbCwgdHlwZSwgcGRhdGFPbGQsIHBkYXRhQ3VyLCB1ZGF0YU9sZCwgdWRhdGFDdXIsIGV2ZW50cztcblxuXHRpZiAoIGRlc3Qubm9kZVR5cGUgIT09IDEgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gMS4gQ29weSBwcml2YXRlIGRhdGE6IGV2ZW50cywgaGFuZGxlcnMsIGV0Yy5cblx0aWYgKCBkYXRhUHJpdi5oYXNEYXRhKCBzcmMgKSApIHtcblx0XHRwZGF0YU9sZCA9IGRhdGFQcml2LmFjY2Vzcyggc3JjICk7XG5cdFx0cGRhdGFDdXIgPSBkYXRhUHJpdi5zZXQoIGRlc3QsIHBkYXRhT2xkICk7XG5cdFx0ZXZlbnRzID0gcGRhdGFPbGQuZXZlbnRzO1xuXG5cdFx0aWYgKCBldmVudHMgKSB7XG5cdFx0XHRkZWxldGUgcGRhdGFDdXIuaGFuZGxlO1xuXHRcdFx0cGRhdGFDdXIuZXZlbnRzID0ge307XG5cblx0XHRcdGZvciAoIHR5cGUgaW4gZXZlbnRzICkge1xuXHRcdFx0XHRmb3IgKCBpID0gMCwgbCA9IGV2ZW50c1sgdHlwZSBdLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcblx0XHRcdFx0XHRqUXVlcnkuZXZlbnQuYWRkKCBkZXN0LCB0eXBlLCBldmVudHNbIHR5cGUgXVsgaSBdICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyAyLiBDb3B5IHVzZXIgZGF0YVxuXHRpZiAoIGRhdGFVc2VyLmhhc0RhdGEoIHNyYyApICkge1xuXHRcdHVkYXRhT2xkID0gZGF0YVVzZXIuYWNjZXNzKCBzcmMgKTtcblx0XHR1ZGF0YUN1ciA9IGpRdWVyeS5leHRlbmQoIHt9LCB1ZGF0YU9sZCApO1xuXG5cdFx0ZGF0YVVzZXIuc2V0KCBkZXN0LCB1ZGF0YUN1ciApO1xuXHR9XG59XG5cbi8vIEZpeCBJRSBidWdzLCBzZWUgc3VwcG9ydCB0ZXN0c1xuZnVuY3Rpb24gZml4SW5wdXQoIHNyYywgZGVzdCApIHtcblx0dmFyIG5vZGVOYW1lID0gZGVzdC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG5cdC8vIEZhaWxzIHRvIHBlcnNpc3QgdGhlIGNoZWNrZWQgc3RhdGUgb2YgYSBjbG9uZWQgY2hlY2tib3ggb3IgcmFkaW8gYnV0dG9uLlxuXHRpZiAoIG5vZGVOYW1lID09PSBcImlucHV0XCIgJiYgcmNoZWNrYWJsZVR5cGUudGVzdCggc3JjLnR5cGUgKSApIHtcblx0XHRkZXN0LmNoZWNrZWQgPSBzcmMuY2hlY2tlZDtcblxuXHQvLyBGYWlscyB0byByZXR1cm4gdGhlIHNlbGVjdGVkIG9wdGlvbiB0byB0aGUgZGVmYXVsdCBzZWxlY3RlZCBzdGF0ZSB3aGVuIGNsb25pbmcgb3B0aW9uc1xuXHR9IGVsc2UgaWYgKCBub2RlTmFtZSA9PT0gXCJpbnB1dFwiIHx8IG5vZGVOYW1lID09PSBcInRleHRhcmVhXCIgKSB7XG5cdFx0ZGVzdC5kZWZhdWx0VmFsdWUgPSBzcmMuZGVmYXVsdFZhbHVlO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGRvbU1hbmlwKCBjb2xsZWN0aW9uLCBhcmdzLCBjYWxsYmFjaywgaWdub3JlZCApIHtcblxuXHQvLyBGbGF0dGVuIGFueSBuZXN0ZWQgYXJyYXlzXG5cdGFyZ3MgPSBjb25jYXQuYXBwbHkoIFtdLCBhcmdzICk7XG5cblx0dmFyIGZyYWdtZW50LCBmaXJzdCwgc2NyaXB0cywgaGFzU2NyaXB0cywgbm9kZSwgZG9jLFxuXHRcdGkgPSAwLFxuXHRcdGwgPSBjb2xsZWN0aW9uLmxlbmd0aCxcblx0XHRpTm9DbG9uZSA9IGwgLSAxLFxuXHRcdHZhbHVlID0gYXJnc1sgMCBdLFxuXHRcdGlzRnVuY3Rpb24gPSBqUXVlcnkuaXNGdW5jdGlvbiggdmFsdWUgKTtcblxuXHQvLyBXZSBjYW4ndCBjbG9uZU5vZGUgZnJhZ21lbnRzIHRoYXQgY29udGFpbiBjaGVja2VkLCBpbiBXZWJLaXRcblx0aWYgKCBpc0Z1bmN0aW9uIHx8XG5cdFx0XHQoIGwgPiAxICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJlxuXHRcdFx0XHQhc3VwcG9ydC5jaGVja0Nsb25lICYmIHJjaGVja2VkLnRlc3QoIHZhbHVlICkgKSApIHtcblx0XHRyZXR1cm4gY29sbGVjdGlvbi5lYWNoKCBmdW5jdGlvbiggaW5kZXggKSB7XG5cdFx0XHR2YXIgc2VsZiA9IGNvbGxlY3Rpb24uZXEoIGluZGV4ICk7XG5cdFx0XHRpZiAoIGlzRnVuY3Rpb24gKSB7XG5cdFx0XHRcdGFyZ3NbIDAgXSA9IHZhbHVlLmNhbGwoIHRoaXMsIGluZGV4LCBzZWxmLmh0bWwoKSApO1xuXHRcdFx0fVxuXHRcdFx0ZG9tTWFuaXAoIHNlbGYsIGFyZ3MsIGNhbGxiYWNrLCBpZ25vcmVkICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aWYgKCBsICkge1xuXHRcdGZyYWdtZW50ID0gYnVpbGRGcmFnbWVudCggYXJncywgY29sbGVjdGlvblsgMCBdLm93bmVyRG9jdW1lbnQsIGZhbHNlLCBjb2xsZWN0aW9uLCBpZ25vcmVkICk7XG5cdFx0Zmlyc3QgPSBmcmFnbWVudC5maXJzdENoaWxkO1xuXG5cdFx0aWYgKCBmcmFnbWVudC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMSApIHtcblx0XHRcdGZyYWdtZW50ID0gZmlyc3Q7XG5cdFx0fVxuXG5cdFx0Ly8gUmVxdWlyZSBlaXRoZXIgbmV3IGNvbnRlbnQgb3IgYW4gaW50ZXJlc3QgaW4gaWdub3JlZCBlbGVtZW50cyB0byBpbnZva2UgdGhlIGNhbGxiYWNrXG5cdFx0aWYgKCBmaXJzdCB8fCBpZ25vcmVkICkge1xuXHRcdFx0c2NyaXB0cyA9IGpRdWVyeS5tYXAoIGdldEFsbCggZnJhZ21lbnQsIFwic2NyaXB0XCIgKSwgZGlzYWJsZVNjcmlwdCApO1xuXHRcdFx0aGFzU2NyaXB0cyA9IHNjcmlwdHMubGVuZ3RoO1xuXG5cdFx0XHQvLyBVc2UgdGhlIG9yaWdpbmFsIGZyYWdtZW50IGZvciB0aGUgbGFzdCBpdGVtXG5cdFx0XHQvLyBpbnN0ZWFkIG9mIHRoZSBmaXJzdCBiZWNhdXNlIGl0IGNhbiBlbmQgdXBcblx0XHRcdC8vIGJlaW5nIGVtcHRpZWQgaW5jb3JyZWN0bHkgaW4gY2VydGFpbiBzaXR1YXRpb25zICgjODA3MCkuXG5cdFx0XHRmb3IgKCA7IGkgPCBsOyBpKysgKSB7XG5cdFx0XHRcdG5vZGUgPSBmcmFnbWVudDtcblxuXHRcdFx0XHRpZiAoIGkgIT09IGlOb0Nsb25lICkge1xuXHRcdFx0XHRcdG5vZGUgPSBqUXVlcnkuY2xvbmUoIG5vZGUsIHRydWUsIHRydWUgKTtcblxuXHRcdFx0XHRcdC8vIEtlZXAgcmVmZXJlbmNlcyB0byBjbG9uZWQgc2NyaXB0cyBmb3IgbGF0ZXIgcmVzdG9yYXRpb25cblx0XHRcdFx0XHRpZiAoIGhhc1NjcmlwdHMgKSB7XG5cblx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IEFuZHJvaWQ8NC4xLCBQaGFudG9tSlM8MlxuXHRcdFx0XHRcdFx0Ly8gcHVzaC5hcHBseShfLCBhcnJheWxpa2UpIHRocm93cyBvbiBhbmNpZW50IFdlYktpdFxuXHRcdFx0XHRcdFx0alF1ZXJ5Lm1lcmdlKCBzY3JpcHRzLCBnZXRBbGwoIG5vZGUsIFwic2NyaXB0XCIgKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNhbGxiYWNrLmNhbGwoIGNvbGxlY3Rpb25bIGkgXSwgbm9kZSwgaSApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGhhc1NjcmlwdHMgKSB7XG5cdFx0XHRcdGRvYyA9IHNjcmlwdHNbIHNjcmlwdHMubGVuZ3RoIC0gMSBdLm93bmVyRG9jdW1lbnQ7XG5cblx0XHRcdFx0Ly8gUmVlbmFibGUgc2NyaXB0c1xuXHRcdFx0XHRqUXVlcnkubWFwKCBzY3JpcHRzLCByZXN0b3JlU2NyaXB0ICk7XG5cblx0XHRcdFx0Ly8gRXZhbHVhdGUgZXhlY3V0YWJsZSBzY3JpcHRzIG9uIGZpcnN0IGRvY3VtZW50IGluc2VydGlvblxuXHRcdFx0XHRmb3IgKCBpID0gMDsgaSA8IGhhc1NjcmlwdHM7IGkrKyApIHtcblx0XHRcdFx0XHRub2RlID0gc2NyaXB0c1sgaSBdO1xuXHRcdFx0XHRcdGlmICggcnNjcmlwdFR5cGUudGVzdCggbm9kZS50eXBlIHx8IFwiXCIgKSAmJlxuXHRcdFx0XHRcdFx0IWRhdGFQcml2LmFjY2Vzcyggbm9kZSwgXCJnbG9iYWxFdmFsXCIgKSAmJlxuXHRcdFx0XHRcdFx0alF1ZXJ5LmNvbnRhaW5zKCBkb2MsIG5vZGUgKSApIHtcblxuXHRcdFx0XHRcdFx0aWYgKCBub2RlLnNyYyApIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBPcHRpb25hbCBBSkFYIGRlcGVuZGVuY3ksIGJ1dCB3b24ndCBydW4gc2NyaXB0cyBpZiBub3QgcHJlc2VudFxuXHRcdFx0XHRcdFx0XHRpZiAoIGpRdWVyeS5fZXZhbFVybCApIHtcblx0XHRcdFx0XHRcdFx0XHRqUXVlcnkuX2V2YWxVcmwoIG5vZGUuc3JjICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGpRdWVyeS5nbG9iYWxFdmFsKCBub2RlLnRleHRDb250ZW50LnJlcGxhY2UoIHJjbGVhblNjcmlwdCwgXCJcIiApICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGNvbGxlY3Rpb247XG59XG5cbmZ1bmN0aW9uIHJlbW92ZSggZWxlbSwgc2VsZWN0b3IsIGtlZXBEYXRhICkge1xuXHR2YXIgbm9kZSxcblx0XHRub2RlcyA9IHNlbGVjdG9yID8galF1ZXJ5LmZpbHRlciggc2VsZWN0b3IsIGVsZW0gKSA6IGVsZW0sXG5cdFx0aSA9IDA7XG5cblx0Zm9yICggOyAoIG5vZGUgPSBub2Rlc1sgaSBdICkgIT0gbnVsbDsgaSsrICkge1xuXHRcdGlmICggIWtlZXBEYXRhICYmIG5vZGUubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHRqUXVlcnkuY2xlYW5EYXRhKCBnZXRBbGwoIG5vZGUgKSApO1xuXHRcdH1cblxuXHRcdGlmICggbm9kZS5wYXJlbnROb2RlICkge1xuXHRcdFx0aWYgKCBrZWVwRGF0YSAmJiBqUXVlcnkuY29udGFpbnMoIG5vZGUub3duZXJEb2N1bWVudCwgbm9kZSApICkge1xuXHRcdFx0XHRzZXRHbG9iYWxFdmFsKCBnZXRBbGwoIG5vZGUsIFwic2NyaXB0XCIgKSApO1xuXHRcdFx0fVxuXHRcdFx0bm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCBub2RlICk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGVsZW07XG59XG5cbmpRdWVyeS5leHRlbmQoIHtcblx0aHRtbFByZWZpbHRlcjogZnVuY3Rpb24oIGh0bWwgKSB7XG5cdFx0cmV0dXJuIGh0bWwucmVwbGFjZSggcnhodG1sVGFnLCBcIjwkMT48LyQyPlwiICk7XG5cdH0sXG5cblx0Y2xvbmU6IGZ1bmN0aW9uKCBlbGVtLCBkYXRhQW5kRXZlbnRzLCBkZWVwRGF0YUFuZEV2ZW50cyApIHtcblx0XHR2YXIgaSwgbCwgc3JjRWxlbWVudHMsIGRlc3RFbGVtZW50cyxcblx0XHRcdGNsb25lID0gZWxlbS5jbG9uZU5vZGUoIHRydWUgKSxcblx0XHRcdGluUGFnZSA9IGpRdWVyeS5jb250YWlucyggZWxlbS5vd25lckRvY3VtZW50LCBlbGVtICk7XG5cblx0XHQvLyBGaXggSUUgY2xvbmluZyBpc3N1ZXNcblx0XHRpZiAoICFzdXBwb3J0Lm5vQ2xvbmVDaGVja2VkICYmICggZWxlbS5ub2RlVHlwZSA9PT0gMSB8fCBlbGVtLm5vZGVUeXBlID09PSAxMSApICYmXG5cdFx0XHRcdCFqUXVlcnkuaXNYTUxEb2MoIGVsZW0gKSApIHtcblxuXHRcdFx0Ly8gV2UgZXNjaGV3IFNpenpsZSBoZXJlIGZvciBwZXJmb3JtYW5jZSByZWFzb25zOiBodHRwOi8vanNwZXJmLmNvbS9nZXRhbGwtdnMtc2l6emxlLzJcblx0XHRcdGRlc3RFbGVtZW50cyA9IGdldEFsbCggY2xvbmUgKTtcblx0XHRcdHNyY0VsZW1lbnRzID0gZ2V0QWxsKCBlbGVtICk7XG5cblx0XHRcdGZvciAoIGkgPSAwLCBsID0gc3JjRWxlbWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuXHRcdFx0XHRmaXhJbnB1dCggc3JjRWxlbWVudHNbIGkgXSwgZGVzdEVsZW1lbnRzWyBpIF0gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBDb3B5IHRoZSBldmVudHMgZnJvbSB0aGUgb3JpZ2luYWwgdG8gdGhlIGNsb25lXG5cdFx0aWYgKCBkYXRhQW5kRXZlbnRzICkge1xuXHRcdFx0aWYgKCBkZWVwRGF0YUFuZEV2ZW50cyApIHtcblx0XHRcdFx0c3JjRWxlbWVudHMgPSBzcmNFbGVtZW50cyB8fCBnZXRBbGwoIGVsZW0gKTtcblx0XHRcdFx0ZGVzdEVsZW1lbnRzID0gZGVzdEVsZW1lbnRzIHx8IGdldEFsbCggY2xvbmUgKTtcblxuXHRcdFx0XHRmb3IgKCBpID0gMCwgbCA9IHNyY0VsZW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcblx0XHRcdFx0XHRjbG9uZUNvcHlFdmVudCggc3JjRWxlbWVudHNbIGkgXSwgZGVzdEVsZW1lbnRzWyBpIF0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2xvbmVDb3B5RXZlbnQoIGVsZW0sIGNsb25lICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gUHJlc2VydmUgc2NyaXB0IGV2YWx1YXRpb24gaGlzdG9yeVxuXHRcdGRlc3RFbGVtZW50cyA9IGdldEFsbCggY2xvbmUsIFwic2NyaXB0XCIgKTtcblx0XHRpZiAoIGRlc3RFbGVtZW50cy5sZW5ndGggPiAwICkge1xuXHRcdFx0c2V0R2xvYmFsRXZhbCggZGVzdEVsZW1lbnRzLCAhaW5QYWdlICYmIGdldEFsbCggZWxlbSwgXCJzY3JpcHRcIiApICk7XG5cdFx0fVxuXG5cdFx0Ly8gUmV0dXJuIHRoZSBjbG9uZWQgc2V0XG5cdFx0cmV0dXJuIGNsb25lO1xuXHR9LFxuXG5cdGNsZWFuRGF0YTogZnVuY3Rpb24oIGVsZW1zICkge1xuXHRcdHZhciBkYXRhLCBlbGVtLCB0eXBlLFxuXHRcdFx0c3BlY2lhbCA9IGpRdWVyeS5ldmVudC5zcGVjaWFsLFxuXHRcdFx0aSA9IDA7XG5cblx0XHRmb3IgKCA7ICggZWxlbSA9IGVsZW1zWyBpIF0gKSAhPT0gdW5kZWZpbmVkOyBpKysgKSB7XG5cdFx0XHRpZiAoIGFjY2VwdERhdGEoIGVsZW0gKSApIHtcblx0XHRcdFx0aWYgKCAoIGRhdGEgPSBlbGVtWyBkYXRhUHJpdi5leHBhbmRvIF0gKSApIHtcblx0XHRcdFx0XHRpZiAoIGRhdGEuZXZlbnRzICkge1xuXHRcdFx0XHRcdFx0Zm9yICggdHlwZSBpbiBkYXRhLmV2ZW50cyApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCBzcGVjaWFsWyB0eXBlIF0gKSB7XG5cdFx0XHRcdFx0XHRcdFx0alF1ZXJ5LmV2ZW50LnJlbW92ZSggZWxlbSwgdHlwZSApO1xuXG5cdFx0XHRcdFx0XHRcdC8vIFRoaXMgaXMgYSBzaG9ydGN1dCB0byBhdm9pZCBqUXVlcnkuZXZlbnQucmVtb3ZlJ3Mgb3ZlcmhlYWRcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRqUXVlcnkucmVtb3ZlRXZlbnQoIGVsZW0sIHR5cGUsIGRhdGEuaGFuZGxlICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBTdXBwb3J0OiBDaHJvbWUgPD0gMzUtNDUrXG5cdFx0XHRcdFx0Ly8gQXNzaWduIHVuZGVmaW5lZCBpbnN0ZWFkIG9mIHVzaW5nIGRlbGV0ZSwgc2VlIERhdGEjcmVtb3ZlXG5cdFx0XHRcdFx0ZWxlbVsgZGF0YVByaXYuZXhwYW5kbyBdID0gdW5kZWZpbmVkO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICggZWxlbVsgZGF0YVVzZXIuZXhwYW5kbyBdICkge1xuXG5cdFx0XHRcdFx0Ly8gU3VwcG9ydDogQ2hyb21lIDw9IDM1LTQ1K1xuXHRcdFx0XHRcdC8vIEFzc2lnbiB1bmRlZmluZWQgaW5zdGVhZCBvZiB1c2luZyBkZWxldGUsIHNlZSBEYXRhI3JlbW92ZVxuXHRcdFx0XHRcdGVsZW1bIGRhdGFVc2VyLmV4cGFuZG8gXSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufSApO1xuXG5qUXVlcnkuZm4uZXh0ZW5kKCB7XG5cblx0Ly8gS2VlcCBkb21NYW5pcCBleHBvc2VkIHVudGlsIDMuMCAoZ2gtMjIyNSlcblx0ZG9tTWFuaXA6IGRvbU1hbmlwLFxuXG5cdGRldGFjaDogZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXHRcdHJldHVybiByZW1vdmUoIHRoaXMsIHNlbGVjdG9yLCB0cnVlICk7XG5cdH0sXG5cblx0cmVtb3ZlOiBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XG5cdFx0cmV0dXJuIHJlbW92ZSggdGhpcywgc2VsZWN0b3IgKTtcblx0fSxcblxuXHR0ZXh0OiBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0cmV0dXJuIGFjY2VzcyggdGhpcywgZnVuY3Rpb24oIHZhbHVlICkge1xuXHRcdFx0cmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgP1xuXHRcdFx0XHRqUXVlcnkudGV4dCggdGhpcyApIDpcblx0XHRcdFx0dGhpcy5lbXB0eSgpLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmICggdGhpcy5ub2RlVHlwZSA9PT0gMSB8fCB0aGlzLm5vZGVUeXBlID09PSAxMSB8fCB0aGlzLm5vZGVUeXBlID09PSA5ICkge1xuXHRcdFx0XHRcdFx0dGhpcy50ZXh0Q29udGVudCA9IHZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdH0sIG51bGwsIHZhbHVlLCBhcmd1bWVudHMubGVuZ3RoICk7XG5cdH0sXG5cblx0YXBwZW5kOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZG9tTWFuaXAoIHRoaXMsIGFyZ3VtZW50cywgZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRpZiAoIHRoaXMubm9kZVR5cGUgPT09IDEgfHwgdGhpcy5ub2RlVHlwZSA9PT0gMTEgfHwgdGhpcy5ub2RlVHlwZSA9PT0gOSApIHtcblx0XHRcdFx0dmFyIHRhcmdldCA9IG1hbmlwdWxhdGlvblRhcmdldCggdGhpcywgZWxlbSApO1xuXHRcdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoIGVsZW0gKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH0sXG5cblx0cHJlcGVuZDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGRvbU1hbmlwKCB0aGlzLCBhcmd1bWVudHMsIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0aWYgKCB0aGlzLm5vZGVUeXBlID09PSAxIHx8IHRoaXMubm9kZVR5cGUgPT09IDExIHx8IHRoaXMubm9kZVR5cGUgPT09IDkgKSB7XG5cdFx0XHRcdHZhciB0YXJnZXQgPSBtYW5pcHVsYXRpb25UYXJnZXQoIHRoaXMsIGVsZW0gKTtcblx0XHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZSggZWxlbSwgdGFyZ2V0LmZpcnN0Q2hpbGQgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH0sXG5cblx0YmVmb3JlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZG9tTWFuaXAoIHRoaXMsIGFyZ3VtZW50cywgZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRpZiAoIHRoaXMucGFyZW50Tm9kZSApIHtcblx0XHRcdFx0dGhpcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSggZWxlbSwgdGhpcyApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fSxcblxuXHRhZnRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGRvbU1hbmlwKCB0aGlzLCBhcmd1bWVudHMsIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0aWYgKCB0aGlzLnBhcmVudE5vZGUgKSB7XG5cdFx0XHRcdHRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoIGVsZW0sIHRoaXMubmV4dFNpYmxpbmcgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH0sXG5cblx0ZW1wdHk6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBlbGVtLFxuXHRcdFx0aSA9IDA7XG5cblx0XHRmb3IgKCA7ICggZWxlbSA9IHRoaXNbIGkgXSApICE9IG51bGw7IGkrKyApIHtcblx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSApIHtcblxuXHRcdFx0XHQvLyBQcmV2ZW50IG1lbW9yeSBsZWFrc1xuXHRcdFx0XHRqUXVlcnkuY2xlYW5EYXRhKCBnZXRBbGwoIGVsZW0sIGZhbHNlICkgKTtcblxuXHRcdFx0XHQvLyBSZW1vdmUgYW55IHJlbWFpbmluZyBub2Rlc1xuXHRcdFx0XHRlbGVtLnRleHRDb250ZW50ID0gXCJcIjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHRjbG9uZTogZnVuY3Rpb24oIGRhdGFBbmRFdmVudHMsIGRlZXBEYXRhQW5kRXZlbnRzICkge1xuXHRcdGRhdGFBbmRFdmVudHMgPSBkYXRhQW5kRXZlbnRzID09IG51bGwgPyBmYWxzZSA6IGRhdGFBbmRFdmVudHM7XG5cdFx0ZGVlcERhdGFBbmRFdmVudHMgPSBkZWVwRGF0YUFuZEV2ZW50cyA9PSBudWxsID8gZGF0YUFuZEV2ZW50cyA6IGRlZXBEYXRhQW5kRXZlbnRzO1xuXG5cdFx0cmV0dXJuIHRoaXMubWFwKCBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBqUXVlcnkuY2xvbmUoIHRoaXMsIGRhdGFBbmRFdmVudHMsIGRlZXBEYXRhQW5kRXZlbnRzICk7XG5cdFx0fSApO1xuXHR9LFxuXG5cdGh0bWw6IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHRyZXR1cm4gYWNjZXNzKCB0aGlzLCBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0XHR2YXIgZWxlbSA9IHRoaXNbIDAgXSB8fCB7fSxcblx0XHRcdFx0aSA9IDAsXG5cdFx0XHRcdGwgPSB0aGlzLmxlbmd0aDtcblxuXHRcdFx0aWYgKCB2YWx1ZSA9PT0gdW5kZWZpbmVkICYmIGVsZW0ubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHRcdHJldHVybiBlbGVtLmlubmVySFRNTDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU2VlIGlmIHdlIGNhbiB0YWtlIGEgc2hvcnRjdXQgYW5kIGp1c3QgdXNlIGlubmVySFRNTFxuXHRcdFx0aWYgKCB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgJiYgIXJub0lubmVyaHRtbC50ZXN0KCB2YWx1ZSApICYmXG5cdFx0XHRcdCF3cmFwTWFwWyAoIHJ0YWdOYW1lLmV4ZWMoIHZhbHVlICkgfHwgWyBcIlwiLCBcIlwiIF0gKVsgMSBdLnRvTG93ZXJDYXNlKCkgXSApIHtcblxuXHRcdFx0XHR2YWx1ZSA9IGpRdWVyeS5odG1sUHJlZmlsdGVyKCB2YWx1ZSApO1xuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Zm9yICggOyBpIDwgbDsgaSsrICkge1xuXHRcdFx0XHRcdFx0ZWxlbSA9IHRoaXNbIGkgXSB8fCB7fTtcblxuXHRcdFx0XHRcdFx0Ly8gUmVtb3ZlIGVsZW1lbnQgbm9kZXMgYW5kIHByZXZlbnQgbWVtb3J5IGxlYWtzXG5cdFx0XHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHRcdFx0XHRcdGpRdWVyeS5jbGVhbkRhdGEoIGdldEFsbCggZWxlbSwgZmFsc2UgKSApO1xuXHRcdFx0XHRcdFx0XHRlbGVtLmlubmVySFRNTCA9IHZhbHVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGVsZW0gPSAwO1xuXG5cdFx0XHRcdC8vIElmIHVzaW5nIGlubmVySFRNTCB0aHJvd3MgYW4gZXhjZXB0aW9uLCB1c2UgdGhlIGZhbGxiYWNrIG1ldGhvZFxuXHRcdFx0XHR9IGNhdGNoICggZSApIHt9XG5cdFx0XHR9XG5cblx0XHRcdGlmICggZWxlbSApIHtcblx0XHRcdFx0dGhpcy5lbXB0eSgpLmFwcGVuZCggdmFsdWUgKTtcblx0XHRcdH1cblx0XHR9LCBudWxsLCB2YWx1ZSwgYXJndW1lbnRzLmxlbmd0aCApO1xuXHR9LFxuXG5cdHJlcGxhY2VXaXRoOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgaWdub3JlZCA9IFtdO1xuXG5cdFx0Ly8gTWFrZSB0aGUgY2hhbmdlcywgcmVwbGFjaW5nIGVhY2ggbm9uLWlnbm9yZWQgY29udGV4dCBlbGVtZW50IHdpdGggdGhlIG5ldyBjb250ZW50XG5cdFx0cmV0dXJuIGRvbU1hbmlwKCB0aGlzLCBhcmd1bWVudHMsIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0dmFyIHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcblxuXHRcdFx0aWYgKCBqUXVlcnkuaW5BcnJheSggdGhpcywgaWdub3JlZCApIDwgMCApIHtcblx0XHRcdFx0alF1ZXJ5LmNsZWFuRGF0YSggZ2V0QWxsKCB0aGlzICkgKTtcblx0XHRcdFx0aWYgKCBwYXJlbnQgKSB7XG5cdFx0XHRcdFx0cGFyZW50LnJlcGxhY2VDaGlsZCggZWxlbSwgdGhpcyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHQvLyBGb3JjZSBjYWxsYmFjayBpbnZvY2F0aW9uXG5cdFx0fSwgaWdub3JlZCApO1xuXHR9XG59ICk7XG5cbmpRdWVyeS5lYWNoKCB7XG5cdGFwcGVuZFRvOiBcImFwcGVuZFwiLFxuXHRwcmVwZW5kVG86IFwicHJlcGVuZFwiLFxuXHRpbnNlcnRCZWZvcmU6IFwiYmVmb3JlXCIsXG5cdGluc2VydEFmdGVyOiBcImFmdGVyXCIsXG5cdHJlcGxhY2VBbGw6IFwicmVwbGFjZVdpdGhcIlxufSwgZnVuY3Rpb24oIG5hbWUsIG9yaWdpbmFsICkge1xuXHRqUXVlcnkuZm5bIG5hbWUgXSA9IGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcblx0XHR2YXIgZWxlbXMsXG5cdFx0XHRyZXQgPSBbXSxcblx0XHRcdGluc2VydCA9IGpRdWVyeSggc2VsZWN0b3IgKSxcblx0XHRcdGxhc3QgPSBpbnNlcnQubGVuZ3RoIC0gMSxcblx0XHRcdGkgPSAwO1xuXG5cdFx0Zm9yICggOyBpIDw9IGxhc3Q7IGkrKyApIHtcblx0XHRcdGVsZW1zID0gaSA9PT0gbGFzdCA/IHRoaXMgOiB0aGlzLmNsb25lKCB0cnVlICk7XG5cdFx0XHRqUXVlcnkoIGluc2VydFsgaSBdIClbIG9yaWdpbmFsIF0oIGVsZW1zICk7XG5cblx0XHRcdC8vIFN1cHBvcnQ6IFF0V2ViS2l0XG5cdFx0XHQvLyAuZ2V0KCkgYmVjYXVzZSBwdXNoLmFwcGx5KF8sIGFycmF5bGlrZSkgdGhyb3dzXG5cdFx0XHRwdXNoLmFwcGx5KCByZXQsIGVsZW1zLmdldCgpICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMucHVzaFN0YWNrKCByZXQgKTtcblx0fTtcbn0gKTtcblxuXG52YXIgaWZyYW1lLFxuXHRlbGVtZGlzcGxheSA9IHtcblxuXHRcdC8vIFN1cHBvcnQ6IEZpcmVmb3hcblx0XHQvLyBXZSBoYXZlIHRvIHByZS1kZWZpbmUgdGhlc2UgdmFsdWVzIGZvciBGRiAoIzEwMjI3KVxuXHRcdEhUTUw6IFwiYmxvY2tcIixcblx0XHRCT0RZOiBcImJsb2NrXCJcblx0fTtcblxuLyoqXG4gKiBSZXRyaWV2ZSB0aGUgYWN0dWFsIGRpc3BsYXkgb2YgYSBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBub2RlTmFtZSBvZiB0aGUgZWxlbWVudFxuICogQHBhcmFtIHtPYmplY3R9IGRvYyBEb2N1bWVudCBvYmplY3RcbiAqL1xuXG4vLyBDYWxsZWQgb25seSBmcm9tIHdpdGhpbiBkZWZhdWx0RGlzcGxheVxuZnVuY3Rpb24gYWN0dWFsRGlzcGxheSggbmFtZSwgZG9jICkge1xuXHR2YXIgZWxlbSA9IGpRdWVyeSggZG9jLmNyZWF0ZUVsZW1lbnQoIG5hbWUgKSApLmFwcGVuZFRvKCBkb2MuYm9keSApLFxuXG5cdFx0ZGlzcGxheSA9IGpRdWVyeS5jc3MoIGVsZW1bIDAgXSwgXCJkaXNwbGF5XCIgKTtcblxuXHQvLyBXZSBkb24ndCBoYXZlIGFueSBkYXRhIHN0b3JlZCBvbiB0aGUgZWxlbWVudCxcblx0Ly8gc28gdXNlIFwiZGV0YWNoXCIgbWV0aG9kIGFzIGZhc3Qgd2F5IHRvIGdldCByaWQgb2YgdGhlIGVsZW1lbnRcblx0ZWxlbS5kZXRhY2goKTtcblxuXHRyZXR1cm4gZGlzcGxheTtcbn1cblxuLyoqXG4gKiBUcnkgdG8gZGV0ZXJtaW5lIHRoZSBkZWZhdWx0IGRpc3BsYXkgdmFsdWUgb2YgYW4gZWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IG5vZGVOYW1lXG4gKi9cbmZ1bmN0aW9uIGRlZmF1bHREaXNwbGF5KCBub2RlTmFtZSApIHtcblx0dmFyIGRvYyA9IGRvY3VtZW50LFxuXHRcdGRpc3BsYXkgPSBlbGVtZGlzcGxheVsgbm9kZU5hbWUgXTtcblxuXHRpZiAoICFkaXNwbGF5ICkge1xuXHRcdGRpc3BsYXkgPSBhY3R1YWxEaXNwbGF5KCBub2RlTmFtZSwgZG9jICk7XG5cblx0XHQvLyBJZiB0aGUgc2ltcGxlIHdheSBmYWlscywgcmVhZCBmcm9tIGluc2lkZSBhbiBpZnJhbWVcblx0XHRpZiAoIGRpc3BsYXkgPT09IFwibm9uZVwiIHx8ICFkaXNwbGF5ICkge1xuXG5cdFx0XHQvLyBVc2UgdGhlIGFscmVhZHktY3JlYXRlZCBpZnJhbWUgaWYgcG9zc2libGVcblx0XHRcdGlmcmFtZSA9ICggaWZyYW1lIHx8IGpRdWVyeSggXCI8aWZyYW1lIGZyYW1lYm9yZGVyPScwJyB3aWR0aD0nMCcgaGVpZ2h0PScwJy8+XCIgKSApXG5cdFx0XHRcdC5hcHBlbmRUbyggZG9jLmRvY3VtZW50RWxlbWVudCApO1xuXG5cdFx0XHQvLyBBbHdheXMgd3JpdGUgYSBuZXcgSFRNTCBza2VsZXRvbiBzbyBXZWJraXQgYW5kIEZpcmVmb3ggZG9uJ3QgY2hva2Ugb24gcmV1c2Vcblx0XHRcdGRvYyA9IGlmcmFtZVsgMCBdLmNvbnRlbnREb2N1bWVudDtcblxuXHRcdFx0Ly8gU3VwcG9ydDogSUVcblx0XHRcdGRvYy53cml0ZSgpO1xuXHRcdFx0ZG9jLmNsb3NlKCk7XG5cblx0XHRcdGRpc3BsYXkgPSBhY3R1YWxEaXNwbGF5KCBub2RlTmFtZSwgZG9jICk7XG5cdFx0XHRpZnJhbWUuZGV0YWNoKCk7XG5cdFx0fVxuXG5cdFx0Ly8gU3RvcmUgdGhlIGNvcnJlY3QgZGVmYXVsdCBkaXNwbGF5XG5cdFx0ZWxlbWRpc3BsYXlbIG5vZGVOYW1lIF0gPSBkaXNwbGF5O1xuXHR9XG5cblx0cmV0dXJuIGRpc3BsYXk7XG59XG52YXIgcm1hcmdpbiA9ICggL15tYXJnaW4vICk7XG5cbnZhciBybnVtbm9ucHggPSBuZXcgUmVnRXhwKCBcIl4oXCIgKyBwbnVtICsgXCIpKD8hcHgpW2EteiVdKyRcIiwgXCJpXCIgKTtcblxudmFyIGdldFN0eWxlcyA9IGZ1bmN0aW9uKCBlbGVtICkge1xuXG5cdFx0Ly8gU3VwcG9ydDogSUU8PTExKywgRmlyZWZveDw9MzArICgjMTUwOTgsICMxNDE1MClcblx0XHQvLyBJRSB0aHJvd3Mgb24gZWxlbWVudHMgY3JlYXRlZCBpbiBwb3B1cHNcblx0XHQvLyBGRiBtZWFud2hpbGUgdGhyb3dzIG9uIGZyYW1lIGVsZW1lbnRzIHRocm91Z2ggXCJkZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlXCJcblx0XHR2YXIgdmlldyA9IGVsZW0ub3duZXJEb2N1bWVudC5kZWZhdWx0VmlldztcblxuXHRcdGlmICggIXZpZXcgfHwgIXZpZXcub3BlbmVyICkge1xuXHRcdFx0dmlldyA9IHdpbmRvdztcblx0XHR9XG5cblx0XHRyZXR1cm4gdmlldy5nZXRDb21wdXRlZFN0eWxlKCBlbGVtICk7XG5cdH07XG5cbnZhciBzd2FwID0gZnVuY3Rpb24oIGVsZW0sIG9wdGlvbnMsIGNhbGxiYWNrLCBhcmdzICkge1xuXHR2YXIgcmV0LCBuYW1lLFxuXHRcdG9sZCA9IHt9O1xuXG5cdC8vIFJlbWVtYmVyIHRoZSBvbGQgdmFsdWVzLCBhbmQgaW5zZXJ0IHRoZSBuZXcgb25lc1xuXHRmb3IgKCBuYW1lIGluIG9wdGlvbnMgKSB7XG5cdFx0b2xkWyBuYW1lIF0gPSBlbGVtLnN0eWxlWyBuYW1lIF07XG5cdFx0ZWxlbS5zdHlsZVsgbmFtZSBdID0gb3B0aW9uc1sgbmFtZSBdO1xuXHR9XG5cblx0cmV0ID0gY2FsbGJhY2suYXBwbHkoIGVsZW0sIGFyZ3MgfHwgW10gKTtcblxuXHQvLyBSZXZlcnQgdGhlIG9sZCB2YWx1ZXNcblx0Zm9yICggbmFtZSBpbiBvcHRpb25zICkge1xuXHRcdGVsZW0uc3R5bGVbIG5hbWUgXSA9IG9sZFsgbmFtZSBdO1xuXHR9XG5cblx0cmV0dXJuIHJldDtcbn07XG5cblxudmFyIGRvY3VtZW50RWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblxuXG5cbiggZnVuY3Rpb24oKSB7XG5cdHZhciBwaXhlbFBvc2l0aW9uVmFsLCBib3hTaXppbmdSZWxpYWJsZVZhbCwgcGl4ZWxNYXJnaW5SaWdodFZhbCwgcmVsaWFibGVNYXJnaW5MZWZ0VmFsLFxuXHRcdGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKSxcblx0XHRkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICk7XG5cblx0Ly8gRmluaXNoIGVhcmx5IGluIGxpbWl0ZWQgKG5vbi1icm93c2VyKSBlbnZpcm9ubWVudHNcblx0aWYgKCAhZGl2LnN0eWxlICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIFN1cHBvcnQ6IElFOS0xMStcblx0Ly8gU3R5bGUgb2YgY2xvbmVkIGVsZW1lbnQgYWZmZWN0cyBzb3VyY2UgZWxlbWVudCBjbG9uZWQgKCM4OTA4KVxuXHRkaXYuc3R5bGUuYmFja2dyb3VuZENsaXAgPSBcImNvbnRlbnQtYm94XCI7XG5cdGRpdi5jbG9uZU5vZGUoIHRydWUgKS5zdHlsZS5iYWNrZ3JvdW5kQ2xpcCA9IFwiXCI7XG5cdHN1cHBvcnQuY2xlYXJDbG9uZVN0eWxlID0gZGl2LnN0eWxlLmJhY2tncm91bmRDbGlwID09PSBcImNvbnRlbnQtYm94XCI7XG5cblx0Y29udGFpbmVyLnN0eWxlLmNzc1RleHQgPSBcImJvcmRlcjowO3dpZHRoOjhweDtoZWlnaHQ6MDt0b3A6MDtsZWZ0Oi05OTk5cHg7XCIgK1xuXHRcdFwicGFkZGluZzowO21hcmdpbi10b3A6MXB4O3Bvc2l0aW9uOmFic29sdXRlXCI7XG5cdGNvbnRhaW5lci5hcHBlbmRDaGlsZCggZGl2ICk7XG5cblx0Ly8gRXhlY3V0aW5nIGJvdGggcGl4ZWxQb3NpdGlvbiAmIGJveFNpemluZ1JlbGlhYmxlIHRlc3RzIHJlcXVpcmUgb25seSBvbmUgbGF5b3V0XG5cdC8vIHNvIHRoZXkncmUgZXhlY3V0ZWQgYXQgdGhlIHNhbWUgdGltZSB0byBzYXZlIHRoZSBzZWNvbmQgY29tcHV0YXRpb24uXG5cdGZ1bmN0aW9uIGNvbXB1dGVTdHlsZVRlc3RzKCkge1xuXHRcdGRpdi5zdHlsZS5jc3NUZXh0ID1cblxuXHRcdFx0Ly8gU3VwcG9ydDogRmlyZWZveDwyOSwgQW5kcm9pZCAyLjNcblx0XHRcdC8vIFZlbmRvci1wcmVmaXggYm94LXNpemluZ1xuXHRcdFx0XCItd2Via2l0LWJveC1zaXppbmc6Ym9yZGVyLWJveDstbW96LWJveC1zaXppbmc6Ym9yZGVyLWJveDtib3gtc2l6aW5nOmJvcmRlci1ib3g7XCIgK1xuXHRcdFx0XCJwb3NpdGlvbjpyZWxhdGl2ZTtkaXNwbGF5OmJsb2NrO1wiICtcblx0XHRcdFwibWFyZ2luOmF1dG87Ym9yZGVyOjFweDtwYWRkaW5nOjFweDtcIiArXG5cdFx0XHRcInRvcDoxJTt3aWR0aDo1MCVcIjtcblx0XHRkaXYuaW5uZXJIVE1MID0gXCJcIjtcblx0XHRkb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoIGNvbnRhaW5lciApO1xuXG5cdFx0dmFyIGRpdlN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoIGRpdiApO1xuXHRcdHBpeGVsUG9zaXRpb25WYWwgPSBkaXZTdHlsZS50b3AgIT09IFwiMSVcIjtcblx0XHRyZWxpYWJsZU1hcmdpbkxlZnRWYWwgPSBkaXZTdHlsZS5tYXJnaW5MZWZ0ID09PSBcIjJweFwiO1xuXHRcdGJveFNpemluZ1JlbGlhYmxlVmFsID0gZGl2U3R5bGUud2lkdGggPT09IFwiNHB4XCI7XG5cblx0XHQvLyBTdXBwb3J0OiBBbmRyb2lkIDQuMCAtIDQuMyBvbmx5XG5cdFx0Ly8gU29tZSBzdHlsZXMgY29tZSBiYWNrIHdpdGggcGVyY2VudGFnZSB2YWx1ZXMsIGV2ZW4gdGhvdWdoIHRoZXkgc2hvdWxkbid0XG5cdFx0ZGl2LnN0eWxlLm1hcmdpblJpZ2h0ID0gXCI1MCVcIjtcblx0XHRwaXhlbE1hcmdpblJpZ2h0VmFsID0gZGl2U3R5bGUubWFyZ2luUmlnaHQgPT09IFwiNHB4XCI7XG5cblx0XHRkb2N1bWVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoIGNvbnRhaW5lciApO1xuXHR9XG5cblx0alF1ZXJ5LmV4dGVuZCggc3VwcG9ydCwge1xuXHRcdHBpeGVsUG9zaXRpb246IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQvLyBUaGlzIHRlc3QgaXMgZXhlY3V0ZWQgb25seSBvbmNlIGJ1dCB3ZSBzdGlsbCBkbyBtZW1vaXppbmdcblx0XHRcdC8vIHNpbmNlIHdlIGNhbiB1c2UgdGhlIGJveFNpemluZ1JlbGlhYmxlIHByZS1jb21wdXRpbmcuXG5cdFx0XHQvLyBObyBuZWVkIHRvIGNoZWNrIGlmIHRoZSB0ZXN0IHdhcyBhbHJlYWR5IHBlcmZvcm1lZCwgdGhvdWdoLlxuXHRcdFx0Y29tcHV0ZVN0eWxlVGVzdHMoKTtcblx0XHRcdHJldHVybiBwaXhlbFBvc2l0aW9uVmFsO1xuXHRcdH0sXG5cdFx0Ym94U2l6aW5nUmVsaWFibGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCBib3hTaXppbmdSZWxpYWJsZVZhbCA9PSBudWxsICkge1xuXHRcdFx0XHRjb21wdXRlU3R5bGVUZXN0cygpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGJveFNpemluZ1JlbGlhYmxlVmFsO1xuXHRcdH0sXG5cdFx0cGl4ZWxNYXJnaW5SaWdodDogZnVuY3Rpb24oKSB7XG5cblx0XHRcdC8vIFN1cHBvcnQ6IEFuZHJvaWQgNC4wLTQuM1xuXHRcdFx0Ly8gV2UncmUgY2hlY2tpbmcgZm9yIGJveFNpemluZ1JlbGlhYmxlVmFsIGhlcmUgaW5zdGVhZCBvZiBwaXhlbE1hcmdpblJpZ2h0VmFsXG5cdFx0XHQvLyBzaW5jZSB0aGF0IGNvbXByZXNzZXMgYmV0dGVyIGFuZCB0aGV5J3JlIGNvbXB1dGVkIHRvZ2V0aGVyIGFueXdheS5cblx0XHRcdGlmICggYm94U2l6aW5nUmVsaWFibGVWYWwgPT0gbnVsbCApIHtcblx0XHRcdFx0Y29tcHV0ZVN0eWxlVGVzdHMoKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBwaXhlbE1hcmdpblJpZ2h0VmFsO1xuXHRcdH0sXG5cdFx0cmVsaWFibGVNYXJnaW5MZWZ0OiBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gU3VwcG9ydDogSUUgPD04IG9ubHksIEFuZHJvaWQgNC4wIC0gNC4zIG9ubHksIEZpcmVmb3ggPD0zIC0gMzdcblx0XHRcdGlmICggYm94U2l6aW5nUmVsaWFibGVWYWwgPT0gbnVsbCApIHtcblx0XHRcdFx0Y29tcHV0ZVN0eWxlVGVzdHMoKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZWxpYWJsZU1hcmdpbkxlZnRWYWw7XG5cdFx0fSxcblx0XHRyZWxpYWJsZU1hcmdpblJpZ2h0OiBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gU3VwcG9ydDogQW5kcm9pZCAyLjNcblx0XHRcdC8vIENoZWNrIGlmIGRpdiB3aXRoIGV4cGxpY2l0IHdpZHRoIGFuZCBubyBtYXJnaW4tcmlnaHQgaW5jb3JyZWN0bHlcblx0XHRcdC8vIGdldHMgY29tcHV0ZWQgbWFyZ2luLXJpZ2h0IGJhc2VkIG9uIHdpZHRoIG9mIGNvbnRhaW5lci4gKCMzMzMzKVxuXHRcdFx0Ly8gV2ViS2l0IEJ1ZyAxMzM0MyAtIGdldENvbXB1dGVkU3R5bGUgcmV0dXJucyB3cm9uZyB2YWx1ZSBmb3IgbWFyZ2luLXJpZ2h0XG5cdFx0XHQvLyBUaGlzIHN1cHBvcnQgZnVuY3Rpb24gaXMgb25seSBleGVjdXRlZCBvbmNlIHNvIG5vIG1lbW9pemluZyBpcyBuZWVkZWQuXG5cdFx0XHR2YXIgcmV0LFxuXHRcdFx0XHRtYXJnaW5EaXYgPSBkaXYuYXBwZW5kQ2hpbGQoIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKSApO1xuXG5cdFx0XHQvLyBSZXNldCBDU1M6IGJveC1zaXppbmc7IGRpc3BsYXk7IG1hcmdpbjsgYm9yZGVyOyBwYWRkaW5nXG5cdFx0XHRtYXJnaW5EaXYuc3R5bGUuY3NzVGV4dCA9IGRpdi5zdHlsZS5jc3NUZXh0ID1cblxuXHRcdFx0XHQvLyBTdXBwb3J0OiBBbmRyb2lkIDIuM1xuXHRcdFx0XHQvLyBWZW5kb3ItcHJlZml4IGJveC1zaXppbmdcblx0XHRcdFx0XCItd2Via2l0LWJveC1zaXppbmc6Y29udGVudC1ib3g7Ym94LXNpemluZzpjb250ZW50LWJveDtcIiArXG5cdFx0XHRcdFwiZGlzcGxheTpibG9jazttYXJnaW46MDtib3JkZXI6MDtwYWRkaW5nOjBcIjtcblx0XHRcdG1hcmdpbkRpdi5zdHlsZS5tYXJnaW5SaWdodCA9IG1hcmdpbkRpdi5zdHlsZS53aWR0aCA9IFwiMFwiO1xuXHRcdFx0ZGl2LnN0eWxlLndpZHRoID0gXCIxcHhcIjtcblx0XHRcdGRvY3VtZW50RWxlbWVudC5hcHBlbmRDaGlsZCggY29udGFpbmVyICk7XG5cblx0XHRcdHJldCA9ICFwYXJzZUZsb2F0KCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSggbWFyZ2luRGl2ICkubWFyZ2luUmlnaHQgKTtcblxuXHRcdFx0ZG9jdW1lbnRFbGVtZW50LnJlbW92ZUNoaWxkKCBjb250YWluZXIgKTtcblx0XHRcdGRpdi5yZW1vdmVDaGlsZCggbWFyZ2luRGl2ICk7XG5cblx0XHRcdHJldHVybiByZXQ7XG5cdFx0fVxuXHR9ICk7XG59ICkoKTtcblxuXG5mdW5jdGlvbiBjdXJDU1MoIGVsZW0sIG5hbWUsIGNvbXB1dGVkICkge1xuXHR2YXIgd2lkdGgsIG1pbldpZHRoLCBtYXhXaWR0aCwgcmV0LFxuXHRcdHN0eWxlID0gZWxlbS5zdHlsZTtcblxuXHRjb21wdXRlZCA9IGNvbXB1dGVkIHx8IGdldFN0eWxlcyggZWxlbSApO1xuXHRyZXQgPSBjb21wdXRlZCA/IGNvbXB1dGVkLmdldFByb3BlcnR5VmFsdWUoIG5hbWUgKSB8fCBjb21wdXRlZFsgbmFtZSBdIDogdW5kZWZpbmVkO1xuXG5cdC8vIFN1cHBvcnQ6IE9wZXJhIDEyLjF4IG9ubHlcblx0Ly8gRmFsbCBiYWNrIHRvIHN0eWxlIGV2ZW4gd2l0aG91dCBjb21wdXRlZFxuXHQvLyBjb21wdXRlZCBpcyB1bmRlZmluZWQgZm9yIGVsZW1zIG9uIGRvY3VtZW50IGZyYWdtZW50c1xuXHRpZiAoICggcmV0ID09PSBcIlwiIHx8IHJldCA9PT0gdW5kZWZpbmVkICkgJiYgIWpRdWVyeS5jb250YWlucyggZWxlbS5vd25lckRvY3VtZW50LCBlbGVtICkgKSB7XG5cdFx0cmV0ID0galF1ZXJ5LnN0eWxlKCBlbGVtLCBuYW1lICk7XG5cdH1cblxuXHQvLyBTdXBwb3J0OiBJRTlcblx0Ly8gZ2V0UHJvcGVydHlWYWx1ZSBpcyBvbmx5IG5lZWRlZCBmb3IgLmNzcygnZmlsdGVyJykgKCMxMjUzNylcblx0aWYgKCBjb21wdXRlZCApIHtcblxuXHRcdC8vIEEgdHJpYnV0ZSB0byB0aGUgXCJhd2Vzb21lIGhhY2sgYnkgRGVhbiBFZHdhcmRzXCJcblx0XHQvLyBBbmRyb2lkIEJyb3dzZXIgcmV0dXJucyBwZXJjZW50YWdlIGZvciBzb21lIHZhbHVlcyxcblx0XHQvLyBidXQgd2lkdGggc2VlbXMgdG8gYmUgcmVsaWFibHkgcGl4ZWxzLlxuXHRcdC8vIFRoaXMgaXMgYWdhaW5zdCB0aGUgQ1NTT00gZHJhZnQgc3BlYzpcblx0XHQvLyBodHRwOi8vZGV2LnczLm9yZy9jc3N3Zy9jc3NvbS8jcmVzb2x2ZWQtdmFsdWVzXG5cdFx0aWYgKCAhc3VwcG9ydC5waXhlbE1hcmdpblJpZ2h0KCkgJiYgcm51bW5vbnB4LnRlc3QoIHJldCApICYmIHJtYXJnaW4udGVzdCggbmFtZSApICkge1xuXG5cdFx0XHQvLyBSZW1lbWJlciB0aGUgb3JpZ2luYWwgdmFsdWVzXG5cdFx0XHR3aWR0aCA9IHN0eWxlLndpZHRoO1xuXHRcdFx0bWluV2lkdGggPSBzdHlsZS5taW5XaWR0aDtcblx0XHRcdG1heFdpZHRoID0gc3R5bGUubWF4V2lkdGg7XG5cblx0XHRcdC8vIFB1dCBpbiB0aGUgbmV3IHZhbHVlcyB0byBnZXQgYSBjb21wdXRlZCB2YWx1ZSBvdXRcblx0XHRcdHN0eWxlLm1pbldpZHRoID0gc3R5bGUubWF4V2lkdGggPSBzdHlsZS53aWR0aCA9IHJldDtcblx0XHRcdHJldCA9IGNvbXB1dGVkLndpZHRoO1xuXG5cdFx0XHQvLyBSZXZlcnQgdGhlIGNoYW5nZWQgdmFsdWVzXG5cdFx0XHRzdHlsZS53aWR0aCA9IHdpZHRoO1xuXHRcdFx0c3R5bGUubWluV2lkdGggPSBtaW5XaWR0aDtcblx0XHRcdHN0eWxlLm1heFdpZHRoID0gbWF4V2lkdGg7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHJldCAhPT0gdW5kZWZpbmVkID9cblxuXHRcdC8vIFN1cHBvcnQ6IElFOS0xMStcblx0XHQvLyBJRSByZXR1cm5zIHpJbmRleCB2YWx1ZSBhcyBhbiBpbnRlZ2VyLlxuXHRcdHJldCArIFwiXCIgOlxuXHRcdHJldDtcbn1cblxuXG5mdW5jdGlvbiBhZGRHZXRIb29rSWYoIGNvbmRpdGlvbkZuLCBob29rRm4gKSB7XG5cblx0Ly8gRGVmaW5lIHRoZSBob29rLCB3ZSdsbCBjaGVjayBvbiB0aGUgZmlyc3QgcnVuIGlmIGl0J3MgcmVhbGx5IG5lZWRlZC5cblx0cmV0dXJuIHtcblx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCBjb25kaXRpb25GbigpICkge1xuXG5cdFx0XHRcdC8vIEhvb2sgbm90IG5lZWRlZCAob3IgaXQncyBub3QgcG9zc2libGUgdG8gdXNlIGl0IGR1ZVxuXHRcdFx0XHQvLyB0byBtaXNzaW5nIGRlcGVuZGVuY3kpLCByZW1vdmUgaXQuXG5cdFx0XHRcdGRlbGV0ZSB0aGlzLmdldDtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBIb29rIG5lZWRlZDsgcmVkZWZpbmUgaXQgc28gdGhhdCB0aGUgc3VwcG9ydCB0ZXN0IGlzIG5vdCBleGVjdXRlZCBhZ2Fpbi5cblx0XHRcdHJldHVybiAoIHRoaXMuZ2V0ID0gaG9va0ZuICkuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXHRcdH1cblx0fTtcbn1cblxuXG52YXJcblxuXHQvLyBTd2FwcGFibGUgaWYgZGlzcGxheSBpcyBub25lIG9yIHN0YXJ0cyB3aXRoIHRhYmxlXG5cdC8vIGV4Y2VwdCBcInRhYmxlXCIsIFwidGFibGUtY2VsbFwiLCBvciBcInRhYmxlLWNhcHRpb25cIlxuXHQvLyBTZWUgaGVyZSBmb3IgZGlzcGxheSB2YWx1ZXM6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvQ1NTL2Rpc3BsYXlcblx0cmRpc3BsYXlzd2FwID0gL14obm9uZXx0YWJsZSg/IS1jW2VhXSkuKykvLFxuXG5cdGNzc1Nob3cgPSB7IHBvc2l0aW9uOiBcImFic29sdXRlXCIsIHZpc2liaWxpdHk6IFwiaGlkZGVuXCIsIGRpc3BsYXk6IFwiYmxvY2tcIiB9LFxuXHRjc3NOb3JtYWxUcmFuc2Zvcm0gPSB7XG5cdFx0bGV0dGVyU3BhY2luZzogXCIwXCIsXG5cdFx0Zm9udFdlaWdodDogXCI0MDBcIlxuXHR9LFxuXG5cdGNzc1ByZWZpeGVzID0gWyBcIldlYmtpdFwiLCBcIk9cIiwgXCJNb3pcIiwgXCJtc1wiIF0sXG5cdGVtcHR5U3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICkuc3R5bGU7XG5cbi8vIFJldHVybiBhIGNzcyBwcm9wZXJ0eSBtYXBwZWQgdG8gYSBwb3RlbnRpYWxseSB2ZW5kb3IgcHJlZml4ZWQgcHJvcGVydHlcbmZ1bmN0aW9uIHZlbmRvclByb3BOYW1lKCBuYW1lICkge1xuXG5cdC8vIFNob3J0Y3V0IGZvciBuYW1lcyB0aGF0IGFyZSBub3QgdmVuZG9yIHByZWZpeGVkXG5cdGlmICggbmFtZSBpbiBlbXB0eVN0eWxlICkge1xuXHRcdHJldHVybiBuYW1lO1xuXHR9XG5cblx0Ly8gQ2hlY2sgZm9yIHZlbmRvciBwcmVmaXhlZCBuYW1lc1xuXHR2YXIgY2FwTmFtZSA9IG5hbWVbIDAgXS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSggMSApLFxuXHRcdGkgPSBjc3NQcmVmaXhlcy5sZW5ndGg7XG5cblx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0bmFtZSA9IGNzc1ByZWZpeGVzWyBpIF0gKyBjYXBOYW1lO1xuXHRcdGlmICggbmFtZSBpbiBlbXB0eVN0eWxlICkge1xuXHRcdFx0cmV0dXJuIG5hbWU7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIHNldFBvc2l0aXZlTnVtYmVyKCBlbGVtLCB2YWx1ZSwgc3VidHJhY3QgKSB7XG5cblx0Ly8gQW55IHJlbGF0aXZlICgrLy0pIHZhbHVlcyBoYXZlIGFscmVhZHkgYmVlblxuXHQvLyBub3JtYWxpemVkIGF0IHRoaXMgcG9pbnRcblx0dmFyIG1hdGNoZXMgPSByY3NzTnVtLmV4ZWMoIHZhbHVlICk7XG5cdHJldHVybiBtYXRjaGVzID9cblxuXHRcdC8vIEd1YXJkIGFnYWluc3QgdW5kZWZpbmVkIFwic3VidHJhY3RcIiwgZS5nLiwgd2hlbiB1c2VkIGFzIGluIGNzc0hvb2tzXG5cdFx0TWF0aC5tYXgoIDAsIG1hdGNoZXNbIDIgXSAtICggc3VidHJhY3QgfHwgMCApICkgKyAoIG1hdGNoZXNbIDMgXSB8fCBcInB4XCIgKSA6XG5cdFx0dmFsdWU7XG59XG5cbmZ1bmN0aW9uIGF1Z21lbnRXaWR0aE9ySGVpZ2h0KCBlbGVtLCBuYW1lLCBleHRyYSwgaXNCb3JkZXJCb3gsIHN0eWxlcyApIHtcblx0dmFyIGkgPSBleHRyYSA9PT0gKCBpc0JvcmRlckJveCA/IFwiYm9yZGVyXCIgOiBcImNvbnRlbnRcIiApID9cblxuXHRcdC8vIElmIHdlIGFscmVhZHkgaGF2ZSB0aGUgcmlnaHQgbWVhc3VyZW1lbnQsIGF2b2lkIGF1Z21lbnRhdGlvblxuXHRcdDQgOlxuXG5cdFx0Ly8gT3RoZXJ3aXNlIGluaXRpYWxpemUgZm9yIGhvcml6b250YWwgb3IgdmVydGljYWwgcHJvcGVydGllc1xuXHRcdG5hbWUgPT09IFwid2lkdGhcIiA/IDEgOiAwLFxuXG5cdFx0dmFsID0gMDtcblxuXHRmb3IgKCA7IGkgPCA0OyBpICs9IDIgKSB7XG5cblx0XHQvLyBCb3RoIGJveCBtb2RlbHMgZXhjbHVkZSBtYXJnaW4sIHNvIGFkZCBpdCBpZiB3ZSB3YW50IGl0XG5cdFx0aWYgKCBleHRyYSA9PT0gXCJtYXJnaW5cIiApIHtcblx0XHRcdHZhbCArPSBqUXVlcnkuY3NzKCBlbGVtLCBleHRyYSArIGNzc0V4cGFuZFsgaSBdLCB0cnVlLCBzdHlsZXMgKTtcblx0XHR9XG5cblx0XHRpZiAoIGlzQm9yZGVyQm94ICkge1xuXG5cdFx0XHQvLyBib3JkZXItYm94IGluY2x1ZGVzIHBhZGRpbmcsIHNvIHJlbW92ZSBpdCBpZiB3ZSB3YW50IGNvbnRlbnRcblx0XHRcdGlmICggZXh0cmEgPT09IFwiY29udGVudFwiICkge1xuXHRcdFx0XHR2YWwgLT0galF1ZXJ5LmNzcyggZWxlbSwgXCJwYWRkaW5nXCIgKyBjc3NFeHBhbmRbIGkgXSwgdHJ1ZSwgc3R5bGVzICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEF0IHRoaXMgcG9pbnQsIGV4dHJhIGlzbid0IGJvcmRlciBub3IgbWFyZ2luLCBzbyByZW1vdmUgYm9yZGVyXG5cdFx0XHRpZiAoIGV4dHJhICE9PSBcIm1hcmdpblwiICkge1xuXHRcdFx0XHR2YWwgLT0galF1ZXJ5LmNzcyggZWxlbSwgXCJib3JkZXJcIiArIGNzc0V4cGFuZFsgaSBdICsgXCJXaWR0aFwiLCB0cnVlLCBzdHlsZXMgKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHQvLyBBdCB0aGlzIHBvaW50LCBleHRyYSBpc24ndCBjb250ZW50LCBzbyBhZGQgcGFkZGluZ1xuXHRcdFx0dmFsICs9IGpRdWVyeS5jc3MoIGVsZW0sIFwicGFkZGluZ1wiICsgY3NzRXhwYW5kWyBpIF0sIHRydWUsIHN0eWxlcyApO1xuXG5cdFx0XHQvLyBBdCB0aGlzIHBvaW50LCBleHRyYSBpc24ndCBjb250ZW50IG5vciBwYWRkaW5nLCBzbyBhZGQgYm9yZGVyXG5cdFx0XHRpZiAoIGV4dHJhICE9PSBcInBhZGRpbmdcIiApIHtcblx0XHRcdFx0dmFsICs9IGpRdWVyeS5jc3MoIGVsZW0sIFwiYm9yZGVyXCIgKyBjc3NFeHBhbmRbIGkgXSArIFwiV2lkdGhcIiwgdHJ1ZSwgc3R5bGVzICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHZhbDtcbn1cblxuZnVuY3Rpb24gZ2V0V2lkdGhPckhlaWdodCggZWxlbSwgbmFtZSwgZXh0cmEgKSB7XG5cblx0Ly8gU3RhcnQgd2l0aCBvZmZzZXQgcHJvcGVydHksIHdoaWNoIGlzIGVxdWl2YWxlbnQgdG8gdGhlIGJvcmRlci1ib3ggdmFsdWVcblx0dmFyIHZhbHVlSXNCb3JkZXJCb3ggPSB0cnVlLFxuXHRcdHZhbCA9IG5hbWUgPT09IFwid2lkdGhcIiA/IGVsZW0ub2Zmc2V0V2lkdGggOiBlbGVtLm9mZnNldEhlaWdodCxcblx0XHRzdHlsZXMgPSBnZXRTdHlsZXMoIGVsZW0gKSxcblx0XHRpc0JvcmRlckJveCA9IGpRdWVyeS5jc3MoIGVsZW0sIFwiYm94U2l6aW5nXCIsIGZhbHNlLCBzdHlsZXMgKSA9PT0gXCJib3JkZXItYm94XCI7XG5cblx0Ly8gU3VwcG9ydDogSUUxMSBvbmx5XG5cdC8vIEluIElFIDExIGZ1bGxzY3JlZW4gZWxlbWVudHMgaW5zaWRlIG9mIGFuIGlmcmFtZSBoYXZlXG5cdC8vIDEwMHggdG9vIHNtYWxsIGRpbWVuc2lvbnMgKGdoLTE3NjQpLlxuXHRpZiAoIGRvY3VtZW50Lm1zRnVsbHNjcmVlbkVsZW1lbnQgJiYgd2luZG93LnRvcCAhPT0gd2luZG93ICkge1xuXG5cdFx0Ly8gU3VwcG9ydDogSUUxMSBvbmx5XG5cdFx0Ly8gUnVubmluZyBnZXRCb3VuZGluZ0NsaWVudFJlY3Qgb24gYSBkaXNjb25uZWN0ZWQgbm9kZVxuXHRcdC8vIGluIElFIHRocm93cyBhbiBlcnJvci5cblx0XHRpZiAoIGVsZW0uZ2V0Q2xpZW50UmVjdHMoKS5sZW5ndGggKSB7XG5cdFx0XHR2YWwgPSBNYXRoLnJvdW5kKCBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpWyBuYW1lIF0gKiAxMDAgKTtcblx0XHR9XG5cdH1cblxuXHQvLyBTb21lIG5vbi1odG1sIGVsZW1lbnRzIHJldHVybiB1bmRlZmluZWQgZm9yIG9mZnNldFdpZHRoLCBzbyBjaGVjayBmb3IgbnVsbC91bmRlZmluZWRcblx0Ly8gc3ZnIC0gaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NjQ5Mjg1XG5cdC8vIE1hdGhNTCAtIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTQ5MTY2OFxuXHRpZiAoIHZhbCA8PSAwIHx8IHZhbCA9PSBudWxsICkge1xuXG5cdFx0Ly8gRmFsbCBiYWNrIHRvIGNvbXB1dGVkIHRoZW4gdW5jb21wdXRlZCBjc3MgaWYgbmVjZXNzYXJ5XG5cdFx0dmFsID0gY3VyQ1NTKCBlbGVtLCBuYW1lLCBzdHlsZXMgKTtcblx0XHRpZiAoIHZhbCA8IDAgfHwgdmFsID09IG51bGwgKSB7XG5cdFx0XHR2YWwgPSBlbGVtLnN0eWxlWyBuYW1lIF07XG5cdFx0fVxuXG5cdFx0Ly8gQ29tcHV0ZWQgdW5pdCBpcyBub3QgcGl4ZWxzLiBTdG9wIGhlcmUgYW5kIHJldHVybi5cblx0XHRpZiAoIHJudW1ub25weC50ZXN0KCB2YWwgKSApIHtcblx0XHRcdHJldHVybiB2YWw7XG5cdFx0fVxuXG5cdFx0Ly8gQ2hlY2sgZm9yIHN0eWxlIGluIGNhc2UgYSBicm93c2VyIHdoaWNoIHJldHVybnMgdW5yZWxpYWJsZSB2YWx1ZXNcblx0XHQvLyBmb3IgZ2V0Q29tcHV0ZWRTdHlsZSBzaWxlbnRseSBmYWxscyBiYWNrIHRvIHRoZSByZWxpYWJsZSBlbGVtLnN0eWxlXG5cdFx0dmFsdWVJc0JvcmRlckJveCA9IGlzQm9yZGVyQm94ICYmXG5cdFx0XHQoIHN1cHBvcnQuYm94U2l6aW5nUmVsaWFibGUoKSB8fCB2YWwgPT09IGVsZW0uc3R5bGVbIG5hbWUgXSApO1xuXG5cdFx0Ly8gTm9ybWFsaXplIFwiXCIsIGF1dG8sIGFuZCBwcmVwYXJlIGZvciBleHRyYVxuXHRcdHZhbCA9IHBhcnNlRmxvYXQoIHZhbCApIHx8IDA7XG5cdH1cblxuXHQvLyBVc2UgdGhlIGFjdGl2ZSBib3gtc2l6aW5nIG1vZGVsIHRvIGFkZC9zdWJ0cmFjdCBpcnJlbGV2YW50IHN0eWxlc1xuXHRyZXR1cm4gKCB2YWwgK1xuXHRcdGF1Z21lbnRXaWR0aE9ySGVpZ2h0KFxuXHRcdFx0ZWxlbSxcblx0XHRcdG5hbWUsXG5cdFx0XHRleHRyYSB8fCAoIGlzQm9yZGVyQm94ID8gXCJib3JkZXJcIiA6IFwiY29udGVudFwiICksXG5cdFx0XHR2YWx1ZUlzQm9yZGVyQm94LFxuXHRcdFx0c3R5bGVzXG5cdFx0KVxuXHQpICsgXCJweFwiO1xufVxuXG5mdW5jdGlvbiBzaG93SGlkZSggZWxlbWVudHMsIHNob3cgKSB7XG5cdHZhciBkaXNwbGF5LCBlbGVtLCBoaWRkZW4sXG5cdFx0dmFsdWVzID0gW10sXG5cdFx0aW5kZXggPSAwLFxuXHRcdGxlbmd0aCA9IGVsZW1lbnRzLmxlbmd0aDtcblxuXHRmb3IgKCA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrICkge1xuXHRcdGVsZW0gPSBlbGVtZW50c1sgaW5kZXggXTtcblx0XHRpZiAoICFlbGVtLnN0eWxlICkge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0dmFsdWVzWyBpbmRleCBdID0gZGF0YVByaXYuZ2V0KCBlbGVtLCBcIm9sZGRpc3BsYXlcIiApO1xuXHRcdGRpc3BsYXkgPSBlbGVtLnN0eWxlLmRpc3BsYXk7XG5cdFx0aWYgKCBzaG93ICkge1xuXG5cdFx0XHQvLyBSZXNldCB0aGUgaW5saW5lIGRpc3BsYXkgb2YgdGhpcyBlbGVtZW50IHRvIGxlYXJuIGlmIGl0IGlzXG5cdFx0XHQvLyBiZWluZyBoaWRkZW4gYnkgY2FzY2FkZWQgcnVsZXMgb3Igbm90XG5cdFx0XHRpZiAoICF2YWx1ZXNbIGluZGV4IF0gJiYgZGlzcGxheSA9PT0gXCJub25lXCIgKSB7XG5cdFx0XHRcdGVsZW0uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNldCBlbGVtZW50cyB3aGljaCBoYXZlIGJlZW4gb3ZlcnJpZGRlbiB3aXRoIGRpc3BsYXk6IG5vbmVcblx0XHRcdC8vIGluIGEgc3R5bGVzaGVldCB0byB3aGF0ZXZlciB0aGUgZGVmYXVsdCBicm93c2VyIHN0eWxlIGlzXG5cdFx0XHQvLyBmb3Igc3VjaCBhbiBlbGVtZW50XG5cdFx0XHRpZiAoIGVsZW0uc3R5bGUuZGlzcGxheSA9PT0gXCJcIiAmJiBpc0hpZGRlbiggZWxlbSApICkge1xuXHRcdFx0XHR2YWx1ZXNbIGluZGV4IF0gPSBkYXRhUHJpdi5hY2Nlc3MoXG5cdFx0XHRcdFx0ZWxlbSxcblx0XHRcdFx0XHRcIm9sZGRpc3BsYXlcIixcblx0XHRcdFx0XHRkZWZhdWx0RGlzcGxheSggZWxlbS5ub2RlTmFtZSApXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGhpZGRlbiA9IGlzSGlkZGVuKCBlbGVtICk7XG5cblx0XHRcdGlmICggZGlzcGxheSAhPT0gXCJub25lXCIgfHwgIWhpZGRlbiApIHtcblx0XHRcdFx0ZGF0YVByaXYuc2V0KFxuXHRcdFx0XHRcdGVsZW0sXG5cdFx0XHRcdFx0XCJvbGRkaXNwbGF5XCIsXG5cdFx0XHRcdFx0aGlkZGVuID8gZGlzcGxheSA6IGpRdWVyeS5jc3MoIGVsZW0sIFwiZGlzcGxheVwiIClcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBTZXQgdGhlIGRpc3BsYXkgb2YgbW9zdCBvZiB0aGUgZWxlbWVudHMgaW4gYSBzZWNvbmQgbG9vcFxuXHQvLyB0byBhdm9pZCB0aGUgY29uc3RhbnQgcmVmbG93XG5cdGZvciAoIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KysgKSB7XG5cdFx0ZWxlbSA9IGVsZW1lbnRzWyBpbmRleCBdO1xuXHRcdGlmICggIWVsZW0uc3R5bGUgKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cdFx0aWYgKCAhc2hvdyB8fCBlbGVtLnN0eWxlLmRpc3BsYXkgPT09IFwibm9uZVwiIHx8IGVsZW0uc3R5bGUuZGlzcGxheSA9PT0gXCJcIiApIHtcblx0XHRcdGVsZW0uc3R5bGUuZGlzcGxheSA9IHNob3cgPyB2YWx1ZXNbIGluZGV4IF0gfHwgXCJcIiA6IFwibm9uZVwiO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBlbGVtZW50cztcbn1cblxualF1ZXJ5LmV4dGVuZCgge1xuXG5cdC8vIEFkZCBpbiBzdHlsZSBwcm9wZXJ0eSBob29rcyBmb3Igb3ZlcnJpZGluZyB0aGUgZGVmYXVsdFxuXHQvLyBiZWhhdmlvciBvZiBnZXR0aW5nIGFuZCBzZXR0aW5nIGEgc3R5bGUgcHJvcGVydHlcblx0Y3NzSG9va3M6IHtcblx0XHRvcGFjaXR5OiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCBlbGVtLCBjb21wdXRlZCApIHtcblx0XHRcdFx0aWYgKCBjb21wdXRlZCApIHtcblxuXHRcdFx0XHRcdC8vIFdlIHNob3VsZCBhbHdheXMgZ2V0IGEgbnVtYmVyIGJhY2sgZnJvbSBvcGFjaXR5XG5cdFx0XHRcdFx0dmFyIHJldCA9IGN1ckNTUyggZWxlbSwgXCJvcGFjaXR5XCIgKTtcblx0XHRcdFx0XHRyZXR1cm4gcmV0ID09PSBcIlwiID8gXCIxXCIgOiByZXQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0Ly8gRG9uJ3QgYXV0b21hdGljYWxseSBhZGQgXCJweFwiIHRvIHRoZXNlIHBvc3NpYmx5LXVuaXRsZXNzIHByb3BlcnRpZXNcblx0Y3NzTnVtYmVyOiB7XG5cdFx0XCJhbmltYXRpb25JdGVyYXRpb25Db3VudFwiOiB0cnVlLFxuXHRcdFwiY29sdW1uQ291bnRcIjogdHJ1ZSxcblx0XHRcImZpbGxPcGFjaXR5XCI6IHRydWUsXG5cdFx0XCJmbGV4R3Jvd1wiOiB0cnVlLFxuXHRcdFwiZmxleFNocmlua1wiOiB0cnVlLFxuXHRcdFwiZm9udFdlaWdodFwiOiB0cnVlLFxuXHRcdFwibGluZUhlaWdodFwiOiB0cnVlLFxuXHRcdFwib3BhY2l0eVwiOiB0cnVlLFxuXHRcdFwib3JkZXJcIjogdHJ1ZSxcblx0XHRcIm9ycGhhbnNcIjogdHJ1ZSxcblx0XHRcIndpZG93c1wiOiB0cnVlLFxuXHRcdFwiekluZGV4XCI6IHRydWUsXG5cdFx0XCJ6b29tXCI6IHRydWVcblx0fSxcblxuXHQvLyBBZGQgaW4gcHJvcGVydGllcyB3aG9zZSBuYW1lcyB5b3Ugd2lzaCB0byBmaXggYmVmb3JlXG5cdC8vIHNldHRpbmcgb3IgZ2V0dGluZyB0aGUgdmFsdWVcblx0Y3NzUHJvcHM6IHtcblx0XHRcImZsb2F0XCI6IFwiY3NzRmxvYXRcIlxuXHR9LFxuXG5cdC8vIEdldCBhbmQgc2V0IHRoZSBzdHlsZSBwcm9wZXJ0eSBvbiBhIERPTSBOb2RlXG5cdHN0eWxlOiBmdW5jdGlvbiggZWxlbSwgbmFtZSwgdmFsdWUsIGV4dHJhICkge1xuXG5cdFx0Ly8gRG9uJ3Qgc2V0IHN0eWxlcyBvbiB0ZXh0IGFuZCBjb21tZW50IG5vZGVzXG5cdFx0aWYgKCAhZWxlbSB8fCBlbGVtLm5vZGVUeXBlID09PSAzIHx8IGVsZW0ubm9kZVR5cGUgPT09IDggfHwgIWVsZW0uc3R5bGUgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gTWFrZSBzdXJlIHRoYXQgd2UncmUgd29ya2luZyB3aXRoIHRoZSByaWdodCBuYW1lXG5cdFx0dmFyIHJldCwgdHlwZSwgaG9va3MsXG5cdFx0XHRvcmlnTmFtZSA9IGpRdWVyeS5jYW1lbENhc2UoIG5hbWUgKSxcblx0XHRcdHN0eWxlID0gZWxlbS5zdHlsZTtcblxuXHRcdG5hbWUgPSBqUXVlcnkuY3NzUHJvcHNbIG9yaWdOYW1lIF0gfHxcblx0XHRcdCggalF1ZXJ5LmNzc1Byb3BzWyBvcmlnTmFtZSBdID0gdmVuZG9yUHJvcE5hbWUoIG9yaWdOYW1lICkgfHwgb3JpZ05hbWUgKTtcblxuXHRcdC8vIEdldHMgaG9vayBmb3IgdGhlIHByZWZpeGVkIHZlcnNpb24sIHRoZW4gdW5wcmVmaXhlZCB2ZXJzaW9uXG5cdFx0aG9va3MgPSBqUXVlcnkuY3NzSG9va3NbIG5hbWUgXSB8fCBqUXVlcnkuY3NzSG9va3NbIG9yaWdOYW1lIF07XG5cblx0XHQvLyBDaGVjayBpZiB3ZSdyZSBzZXR0aW5nIGEgdmFsdWVcblx0XHRpZiAoIHZhbHVlICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHR0eXBlID0gdHlwZW9mIHZhbHVlO1xuXG5cdFx0XHQvLyBDb252ZXJ0IFwiKz1cIiBvciBcIi09XCIgdG8gcmVsYXRpdmUgbnVtYmVycyAoIzczNDUpXG5cdFx0XHRpZiAoIHR5cGUgPT09IFwic3RyaW5nXCIgJiYgKCByZXQgPSByY3NzTnVtLmV4ZWMoIHZhbHVlICkgKSAmJiByZXRbIDEgXSApIHtcblx0XHRcdFx0dmFsdWUgPSBhZGp1c3RDU1MoIGVsZW0sIG5hbWUsIHJldCApO1xuXG5cdFx0XHRcdC8vIEZpeGVzIGJ1ZyAjOTIzN1xuXHRcdFx0XHR0eXBlID0gXCJudW1iZXJcIjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gTWFrZSBzdXJlIHRoYXQgbnVsbCBhbmQgTmFOIHZhbHVlcyBhcmVuJ3Qgc2V0ICgjNzExNilcblx0XHRcdGlmICggdmFsdWUgPT0gbnVsbCB8fCB2YWx1ZSAhPT0gdmFsdWUgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSWYgYSBudW1iZXIgd2FzIHBhc3NlZCBpbiwgYWRkIHRoZSB1bml0IChleGNlcHQgZm9yIGNlcnRhaW4gQ1NTIHByb3BlcnRpZXMpXG5cdFx0XHRpZiAoIHR5cGUgPT09IFwibnVtYmVyXCIgKSB7XG5cdFx0XHRcdHZhbHVlICs9IHJldCAmJiByZXRbIDMgXSB8fCAoIGpRdWVyeS5jc3NOdW1iZXJbIG9yaWdOYW1lIF0gPyBcIlwiIDogXCJweFwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFOS0xMStcblx0XHRcdC8vIGJhY2tncm91bmQtKiBwcm9wcyBhZmZlY3Qgb3JpZ2luYWwgY2xvbmUncyB2YWx1ZXNcblx0XHRcdGlmICggIXN1cHBvcnQuY2xlYXJDbG9uZVN0eWxlICYmIHZhbHVlID09PSBcIlwiICYmIG5hbWUuaW5kZXhPZiggXCJiYWNrZ3JvdW5kXCIgKSA9PT0gMCApIHtcblx0XHRcdFx0c3R5bGVbIG5hbWUgXSA9IFwiaW5oZXJpdFwiO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiBhIGhvb2sgd2FzIHByb3ZpZGVkLCB1c2UgdGhhdCB2YWx1ZSwgb3RoZXJ3aXNlIGp1c3Qgc2V0IHRoZSBzcGVjaWZpZWQgdmFsdWVcblx0XHRcdGlmICggIWhvb2tzIHx8ICEoIFwic2V0XCIgaW4gaG9va3MgKSB8fFxuXHRcdFx0XHQoIHZhbHVlID0gaG9va3Muc2V0KCBlbGVtLCB2YWx1ZSwgZXh0cmEgKSApICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdFx0c3R5bGVbIG5hbWUgXSA9IHZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0Ly8gSWYgYSBob29rIHdhcyBwcm92aWRlZCBnZXQgdGhlIG5vbi1jb21wdXRlZCB2YWx1ZSBmcm9tIHRoZXJlXG5cdFx0XHRpZiAoIGhvb2tzICYmIFwiZ2V0XCIgaW4gaG9va3MgJiZcblx0XHRcdFx0KCByZXQgPSBob29rcy5nZXQoIGVsZW0sIGZhbHNlLCBleHRyYSApICkgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0XHRyZXR1cm4gcmV0O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBPdGhlcndpc2UganVzdCBnZXQgdGhlIHZhbHVlIGZyb20gdGhlIHN0eWxlIG9iamVjdFxuXHRcdFx0cmV0dXJuIHN0eWxlWyBuYW1lIF07XG5cdFx0fVxuXHR9LFxuXG5cdGNzczogZnVuY3Rpb24oIGVsZW0sIG5hbWUsIGV4dHJhLCBzdHlsZXMgKSB7XG5cdFx0dmFyIHZhbCwgbnVtLCBob29rcyxcblx0XHRcdG9yaWdOYW1lID0galF1ZXJ5LmNhbWVsQ2FzZSggbmFtZSApO1xuXG5cdFx0Ly8gTWFrZSBzdXJlIHRoYXQgd2UncmUgd29ya2luZyB3aXRoIHRoZSByaWdodCBuYW1lXG5cdFx0bmFtZSA9IGpRdWVyeS5jc3NQcm9wc1sgb3JpZ05hbWUgXSB8fFxuXHRcdFx0KCBqUXVlcnkuY3NzUHJvcHNbIG9yaWdOYW1lIF0gPSB2ZW5kb3JQcm9wTmFtZSggb3JpZ05hbWUgKSB8fCBvcmlnTmFtZSApO1xuXG5cdFx0Ly8gVHJ5IHByZWZpeGVkIG5hbWUgZm9sbG93ZWQgYnkgdGhlIHVucHJlZml4ZWQgbmFtZVxuXHRcdGhvb2tzID0galF1ZXJ5LmNzc0hvb2tzWyBuYW1lIF0gfHwgalF1ZXJ5LmNzc0hvb2tzWyBvcmlnTmFtZSBdO1xuXG5cdFx0Ly8gSWYgYSBob29rIHdhcyBwcm92aWRlZCBnZXQgdGhlIGNvbXB1dGVkIHZhbHVlIGZyb20gdGhlcmVcblx0XHRpZiAoIGhvb2tzICYmIFwiZ2V0XCIgaW4gaG9va3MgKSB7XG5cdFx0XHR2YWwgPSBob29rcy5nZXQoIGVsZW0sIHRydWUsIGV4dHJhICk7XG5cdFx0fVxuXG5cdFx0Ly8gT3RoZXJ3aXNlLCBpZiBhIHdheSB0byBnZXQgdGhlIGNvbXB1dGVkIHZhbHVlIGV4aXN0cywgdXNlIHRoYXRcblx0XHRpZiAoIHZhbCA9PT0gdW5kZWZpbmVkICkge1xuXHRcdFx0dmFsID0gY3VyQ1NTKCBlbGVtLCBuYW1lLCBzdHlsZXMgKTtcblx0XHR9XG5cblx0XHQvLyBDb252ZXJ0IFwibm9ybWFsXCIgdG8gY29tcHV0ZWQgdmFsdWVcblx0XHRpZiAoIHZhbCA9PT0gXCJub3JtYWxcIiAmJiBuYW1lIGluIGNzc05vcm1hbFRyYW5zZm9ybSApIHtcblx0XHRcdHZhbCA9IGNzc05vcm1hbFRyYW5zZm9ybVsgbmFtZSBdO1xuXHRcdH1cblxuXHRcdC8vIE1ha2UgbnVtZXJpYyBpZiBmb3JjZWQgb3IgYSBxdWFsaWZpZXIgd2FzIHByb3ZpZGVkIGFuZCB2YWwgbG9va3MgbnVtZXJpY1xuXHRcdGlmICggZXh0cmEgPT09IFwiXCIgfHwgZXh0cmEgKSB7XG5cdFx0XHRudW0gPSBwYXJzZUZsb2F0KCB2YWwgKTtcblx0XHRcdHJldHVybiBleHRyYSA9PT0gdHJ1ZSB8fCBpc0Zpbml0ZSggbnVtICkgPyBudW0gfHwgMCA6IHZhbDtcblx0XHR9XG5cdFx0cmV0dXJuIHZhbDtcblx0fVxufSApO1xuXG5qUXVlcnkuZWFjaCggWyBcImhlaWdodFwiLCBcIndpZHRoXCIgXSwgZnVuY3Rpb24oIGksIG5hbWUgKSB7XG5cdGpRdWVyeS5jc3NIb29rc1sgbmFtZSBdID0ge1xuXHRcdGdldDogZnVuY3Rpb24oIGVsZW0sIGNvbXB1dGVkLCBleHRyYSApIHtcblx0XHRcdGlmICggY29tcHV0ZWQgKSB7XG5cblx0XHRcdFx0Ly8gQ2VydGFpbiBlbGVtZW50cyBjYW4gaGF2ZSBkaW1lbnNpb24gaW5mbyBpZiB3ZSBpbnZpc2libHkgc2hvdyB0aGVtXG5cdFx0XHRcdC8vIGJ1dCBpdCBtdXN0IGhhdmUgYSBjdXJyZW50IGRpc3BsYXkgc3R5bGUgdGhhdCB3b3VsZCBiZW5lZml0XG5cdFx0XHRcdHJldHVybiByZGlzcGxheXN3YXAudGVzdCggalF1ZXJ5LmNzcyggZWxlbSwgXCJkaXNwbGF5XCIgKSApICYmXG5cdFx0XHRcdFx0ZWxlbS5vZmZzZXRXaWR0aCA9PT0gMCA/XG5cdFx0XHRcdFx0XHRzd2FwKCBlbGVtLCBjc3NTaG93LCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGdldFdpZHRoT3JIZWlnaHQoIGVsZW0sIG5hbWUsIGV4dHJhICk7XG5cdFx0XHRcdFx0XHR9ICkgOlxuXHRcdFx0XHRcdFx0Z2V0V2lkdGhPckhlaWdodCggZWxlbSwgbmFtZSwgZXh0cmEgKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0c2V0OiBmdW5jdGlvbiggZWxlbSwgdmFsdWUsIGV4dHJhICkge1xuXHRcdFx0dmFyIG1hdGNoZXMsXG5cdFx0XHRcdHN0eWxlcyA9IGV4dHJhICYmIGdldFN0eWxlcyggZWxlbSApLFxuXHRcdFx0XHRzdWJ0cmFjdCA9IGV4dHJhICYmIGF1Z21lbnRXaWR0aE9ySGVpZ2h0KFxuXHRcdFx0XHRcdGVsZW0sXG5cdFx0XHRcdFx0bmFtZSxcblx0XHRcdFx0XHRleHRyYSxcblx0XHRcdFx0XHRqUXVlcnkuY3NzKCBlbGVtLCBcImJveFNpemluZ1wiLCBmYWxzZSwgc3R5bGVzICkgPT09IFwiYm9yZGVyLWJveFwiLFxuXHRcdFx0XHRcdHN0eWxlc1xuXHRcdFx0XHQpO1xuXG5cdFx0XHQvLyBDb252ZXJ0IHRvIHBpeGVscyBpZiB2YWx1ZSBhZGp1c3RtZW50IGlzIG5lZWRlZFxuXHRcdFx0aWYgKCBzdWJ0cmFjdCAmJiAoIG1hdGNoZXMgPSByY3NzTnVtLmV4ZWMoIHZhbHVlICkgKSAmJlxuXHRcdFx0XHQoIG1hdGNoZXNbIDMgXSB8fCBcInB4XCIgKSAhPT0gXCJweFwiICkge1xuXG5cdFx0XHRcdGVsZW0uc3R5bGVbIG5hbWUgXSA9IHZhbHVlO1xuXHRcdFx0XHR2YWx1ZSA9IGpRdWVyeS5jc3MoIGVsZW0sIG5hbWUgKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHNldFBvc2l0aXZlTnVtYmVyKCBlbGVtLCB2YWx1ZSwgc3VidHJhY3QgKTtcblx0XHR9XG5cdH07XG59ICk7XG5cbmpRdWVyeS5jc3NIb29rcy5tYXJnaW5MZWZ0ID0gYWRkR2V0SG9va0lmKCBzdXBwb3J0LnJlbGlhYmxlTWFyZ2luTGVmdCxcblx0ZnVuY3Rpb24oIGVsZW0sIGNvbXB1dGVkICkge1xuXHRcdGlmICggY29tcHV0ZWQgKSB7XG5cdFx0XHRyZXR1cm4gKCBwYXJzZUZsb2F0KCBjdXJDU1MoIGVsZW0sIFwibWFyZ2luTGVmdFwiICkgKSB8fFxuXHRcdFx0XHRlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgLVxuXHRcdFx0XHRcdHN3YXAoIGVsZW0sIHsgbWFyZ2luTGVmdDogMCB9LCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHJldHVybiBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQ7XG5cdFx0XHRcdFx0fSApXG5cdFx0XHRcdCkgKyBcInB4XCI7XG5cdFx0fVxuXHR9XG4pO1xuXG4vLyBTdXBwb3J0OiBBbmRyb2lkIDIuM1xualF1ZXJ5LmNzc0hvb2tzLm1hcmdpblJpZ2h0ID0gYWRkR2V0SG9va0lmKCBzdXBwb3J0LnJlbGlhYmxlTWFyZ2luUmlnaHQsXG5cdGZ1bmN0aW9uKCBlbGVtLCBjb21wdXRlZCApIHtcblx0XHRpZiAoIGNvbXB1dGVkICkge1xuXHRcdFx0cmV0dXJuIHN3YXAoIGVsZW0sIHsgXCJkaXNwbGF5XCI6IFwiaW5saW5lLWJsb2NrXCIgfSxcblx0XHRcdFx0Y3VyQ1NTLCBbIGVsZW0sIFwibWFyZ2luUmlnaHRcIiBdICk7XG5cdFx0fVxuXHR9XG4pO1xuXG4vLyBUaGVzZSBob29rcyBhcmUgdXNlZCBieSBhbmltYXRlIHRvIGV4cGFuZCBwcm9wZXJ0aWVzXG5qUXVlcnkuZWFjaCgge1xuXHRtYXJnaW46IFwiXCIsXG5cdHBhZGRpbmc6IFwiXCIsXG5cdGJvcmRlcjogXCJXaWR0aFwiXG59LCBmdW5jdGlvbiggcHJlZml4LCBzdWZmaXggKSB7XG5cdGpRdWVyeS5jc3NIb29rc1sgcHJlZml4ICsgc3VmZml4IF0gPSB7XG5cdFx0ZXhwYW5kOiBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0XHR2YXIgaSA9IDAsXG5cdFx0XHRcdGV4cGFuZGVkID0ge30sXG5cblx0XHRcdFx0Ly8gQXNzdW1lcyBhIHNpbmdsZSBudW1iZXIgaWYgbm90IGEgc3RyaW5nXG5cdFx0XHRcdHBhcnRzID0gdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiID8gdmFsdWUuc3BsaXQoIFwiIFwiICkgOiBbIHZhbHVlIF07XG5cblx0XHRcdGZvciAoIDsgaSA8IDQ7IGkrKyApIHtcblx0XHRcdFx0ZXhwYW5kZWRbIHByZWZpeCArIGNzc0V4cGFuZFsgaSBdICsgc3VmZml4IF0gPVxuXHRcdFx0XHRcdHBhcnRzWyBpIF0gfHwgcGFydHNbIGkgLSAyIF0gfHwgcGFydHNbIDAgXTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGV4cGFuZGVkO1xuXHRcdH1cblx0fTtcblxuXHRpZiAoICFybWFyZ2luLnRlc3QoIHByZWZpeCApICkge1xuXHRcdGpRdWVyeS5jc3NIb29rc1sgcHJlZml4ICsgc3VmZml4IF0uc2V0ID0gc2V0UG9zaXRpdmVOdW1iZXI7XG5cdH1cbn0gKTtcblxualF1ZXJ5LmZuLmV4dGVuZCgge1xuXHRjc3M6IGZ1bmN0aW9uKCBuYW1lLCB2YWx1ZSApIHtcblx0XHRyZXR1cm4gYWNjZXNzKCB0aGlzLCBmdW5jdGlvbiggZWxlbSwgbmFtZSwgdmFsdWUgKSB7XG5cdFx0XHR2YXIgc3R5bGVzLCBsZW4sXG5cdFx0XHRcdG1hcCA9IHt9LFxuXHRcdFx0XHRpID0gMDtcblxuXHRcdFx0aWYgKCBqUXVlcnkuaXNBcnJheSggbmFtZSApICkge1xuXHRcdFx0XHRzdHlsZXMgPSBnZXRTdHlsZXMoIGVsZW0gKTtcblx0XHRcdFx0bGVuID0gbmFtZS5sZW5ndGg7XG5cblx0XHRcdFx0Zm9yICggOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0XHRcdFx0bWFwWyBuYW1lWyBpIF0gXSA9IGpRdWVyeS5jc3MoIGVsZW0sIG5hbWVbIGkgXSwgZmFsc2UsIHN0eWxlcyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIG1hcDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHZhbHVlICE9PSB1bmRlZmluZWQgP1xuXHRcdFx0XHRqUXVlcnkuc3R5bGUoIGVsZW0sIG5hbWUsIHZhbHVlICkgOlxuXHRcdFx0XHRqUXVlcnkuY3NzKCBlbGVtLCBuYW1lICk7XG5cdFx0fSwgbmFtZSwgdmFsdWUsIGFyZ3VtZW50cy5sZW5ndGggPiAxICk7XG5cdH0sXG5cdHNob3c6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBzaG93SGlkZSggdGhpcywgdHJ1ZSApO1xuXHR9LFxuXHRoaWRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gc2hvd0hpZGUoIHRoaXMgKTtcblx0fSxcblx0dG9nZ2xlOiBmdW5jdGlvbiggc3RhdGUgKSB7XG5cdFx0aWYgKCB0eXBlb2Ygc3RhdGUgPT09IFwiYm9vbGVhblwiICkge1xuXHRcdFx0cmV0dXJuIHN0YXRlID8gdGhpcy5zaG93KCkgOiB0aGlzLmhpZGUoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggaXNIaWRkZW4oIHRoaXMgKSApIHtcblx0XHRcdFx0alF1ZXJ5KCB0aGlzICkuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0alF1ZXJ5KCB0aGlzICkuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxufSApO1xuXG5cbmZ1bmN0aW9uIFR3ZWVuKCBlbGVtLCBvcHRpb25zLCBwcm9wLCBlbmQsIGVhc2luZyApIHtcblx0cmV0dXJuIG5ldyBUd2Vlbi5wcm90b3R5cGUuaW5pdCggZWxlbSwgb3B0aW9ucywgcHJvcCwgZW5kLCBlYXNpbmcgKTtcbn1cbmpRdWVyeS5Ud2VlbiA9IFR3ZWVuO1xuXG5Ud2Vlbi5wcm90b3R5cGUgPSB7XG5cdGNvbnN0cnVjdG9yOiBUd2Vlbixcblx0aW5pdDogZnVuY3Rpb24oIGVsZW0sIG9wdGlvbnMsIHByb3AsIGVuZCwgZWFzaW5nLCB1bml0ICkge1xuXHRcdHRoaXMuZWxlbSA9IGVsZW07XG5cdFx0dGhpcy5wcm9wID0gcHJvcDtcblx0XHR0aGlzLmVhc2luZyA9IGVhc2luZyB8fCBqUXVlcnkuZWFzaW5nLl9kZWZhdWx0O1xuXHRcdHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cdFx0dGhpcy5zdGFydCA9IHRoaXMubm93ID0gdGhpcy5jdXIoKTtcblx0XHR0aGlzLmVuZCA9IGVuZDtcblx0XHR0aGlzLnVuaXQgPSB1bml0IHx8ICggalF1ZXJ5LmNzc051bWJlclsgcHJvcCBdID8gXCJcIiA6IFwicHhcIiApO1xuXHR9LFxuXHRjdXI6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBob29rcyA9IFR3ZWVuLnByb3BIb29rc1sgdGhpcy5wcm9wIF07XG5cblx0XHRyZXR1cm4gaG9va3MgJiYgaG9va3MuZ2V0ID9cblx0XHRcdGhvb2tzLmdldCggdGhpcyApIDpcblx0XHRcdFR3ZWVuLnByb3BIb29rcy5fZGVmYXVsdC5nZXQoIHRoaXMgKTtcblx0fSxcblx0cnVuOiBmdW5jdGlvbiggcGVyY2VudCApIHtcblx0XHR2YXIgZWFzZWQsXG5cdFx0XHRob29rcyA9IFR3ZWVuLnByb3BIb29rc1sgdGhpcy5wcm9wIF07XG5cblx0XHRpZiAoIHRoaXMub3B0aW9ucy5kdXJhdGlvbiApIHtcblx0XHRcdHRoaXMucG9zID0gZWFzZWQgPSBqUXVlcnkuZWFzaW5nWyB0aGlzLmVhc2luZyBdKFxuXHRcdFx0XHRwZXJjZW50LCB0aGlzLm9wdGlvbnMuZHVyYXRpb24gKiBwZXJjZW50LCAwLCAxLCB0aGlzLm9wdGlvbnMuZHVyYXRpb25cblx0XHRcdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMucG9zID0gZWFzZWQgPSBwZXJjZW50O1xuXHRcdH1cblx0XHR0aGlzLm5vdyA9ICggdGhpcy5lbmQgLSB0aGlzLnN0YXJ0ICkgKiBlYXNlZCArIHRoaXMuc3RhcnQ7XG5cblx0XHRpZiAoIHRoaXMub3B0aW9ucy5zdGVwICkge1xuXHRcdFx0dGhpcy5vcHRpb25zLnN0ZXAuY2FsbCggdGhpcy5lbGVtLCB0aGlzLm5vdywgdGhpcyApO1xuXHRcdH1cblxuXHRcdGlmICggaG9va3MgJiYgaG9va3Muc2V0ICkge1xuXHRcdFx0aG9va3Muc2V0KCB0aGlzICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdFR3ZWVuLnByb3BIb29rcy5fZGVmYXVsdC5zZXQoIHRoaXMgKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn07XG5cblR3ZWVuLnByb3RvdHlwZS5pbml0LnByb3RvdHlwZSA9IFR3ZWVuLnByb3RvdHlwZTtcblxuVHdlZW4ucHJvcEhvb2tzID0ge1xuXHRfZGVmYXVsdDoge1xuXHRcdGdldDogZnVuY3Rpb24oIHR3ZWVuICkge1xuXHRcdFx0dmFyIHJlc3VsdDtcblxuXHRcdFx0Ly8gVXNlIGEgcHJvcGVydHkgb24gdGhlIGVsZW1lbnQgZGlyZWN0bHkgd2hlbiBpdCBpcyBub3QgYSBET00gZWxlbWVudCxcblx0XHRcdC8vIG9yIHdoZW4gdGhlcmUgaXMgbm8gbWF0Y2hpbmcgc3R5bGUgcHJvcGVydHkgdGhhdCBleGlzdHMuXG5cdFx0XHRpZiAoIHR3ZWVuLmVsZW0ubm9kZVR5cGUgIT09IDEgfHxcblx0XHRcdFx0dHdlZW4uZWxlbVsgdHdlZW4ucHJvcCBdICE9IG51bGwgJiYgdHdlZW4uZWxlbS5zdHlsZVsgdHdlZW4ucHJvcCBdID09IG51bGwgKSB7XG5cdFx0XHRcdHJldHVybiB0d2Vlbi5lbGVtWyB0d2Vlbi5wcm9wIF07XG5cdFx0XHR9XG5cblx0XHRcdC8vIFBhc3NpbmcgYW4gZW1wdHkgc3RyaW5nIGFzIGEgM3JkIHBhcmFtZXRlciB0byAuY3NzIHdpbGwgYXV0b21hdGljYWxseVxuXHRcdFx0Ly8gYXR0ZW1wdCBhIHBhcnNlRmxvYXQgYW5kIGZhbGxiYWNrIHRvIGEgc3RyaW5nIGlmIHRoZSBwYXJzZSBmYWlscy5cblx0XHRcdC8vIFNpbXBsZSB2YWx1ZXMgc3VjaCBhcyBcIjEwcHhcIiBhcmUgcGFyc2VkIHRvIEZsb2F0O1xuXHRcdFx0Ly8gY29tcGxleCB2YWx1ZXMgc3VjaCBhcyBcInJvdGF0ZSgxcmFkKVwiIGFyZSByZXR1cm5lZCBhcy1pcy5cblx0XHRcdHJlc3VsdCA9IGpRdWVyeS5jc3MoIHR3ZWVuLmVsZW0sIHR3ZWVuLnByb3AsIFwiXCIgKTtcblxuXHRcdFx0Ly8gRW1wdHkgc3RyaW5ncywgbnVsbCwgdW5kZWZpbmVkIGFuZCBcImF1dG9cIiBhcmUgY29udmVydGVkIHRvIDAuXG5cdFx0XHRyZXR1cm4gIXJlc3VsdCB8fCByZXN1bHQgPT09IFwiYXV0b1wiID8gMCA6IHJlc3VsdDtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24oIHR3ZWVuICkge1xuXG5cdFx0XHQvLyBVc2Ugc3RlcCBob29rIGZvciBiYWNrIGNvbXBhdC5cblx0XHRcdC8vIFVzZSBjc3NIb29rIGlmIGl0cyB0aGVyZS5cblx0XHRcdC8vIFVzZSAuc3R5bGUgaWYgYXZhaWxhYmxlIGFuZCB1c2UgcGxhaW4gcHJvcGVydGllcyB3aGVyZSBhdmFpbGFibGUuXG5cdFx0XHRpZiAoIGpRdWVyeS5meC5zdGVwWyB0d2Vlbi5wcm9wIF0gKSB7XG5cdFx0XHRcdGpRdWVyeS5meC5zdGVwWyB0d2Vlbi5wcm9wIF0oIHR3ZWVuICk7XG5cdFx0XHR9IGVsc2UgaWYgKCB0d2Vlbi5lbGVtLm5vZGVUeXBlID09PSAxICYmXG5cdFx0XHRcdCggdHdlZW4uZWxlbS5zdHlsZVsgalF1ZXJ5LmNzc1Byb3BzWyB0d2Vlbi5wcm9wIF0gXSAhPSBudWxsIHx8XG5cdFx0XHRcdFx0alF1ZXJ5LmNzc0hvb2tzWyB0d2Vlbi5wcm9wIF0gKSApIHtcblx0XHRcdFx0alF1ZXJ5LnN0eWxlKCB0d2Vlbi5lbGVtLCB0d2Vlbi5wcm9wLCB0d2Vlbi5ub3cgKyB0d2Vlbi51bml0ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0d2Vlbi5lbGVtWyB0d2Vlbi5wcm9wIF0gPSB0d2Vlbi5ub3c7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59O1xuXG4vLyBTdXBwb3J0OiBJRTlcbi8vIFBhbmljIGJhc2VkIGFwcHJvYWNoIHRvIHNldHRpbmcgdGhpbmdzIG9uIGRpc2Nvbm5lY3RlZCBub2Rlc1xuVHdlZW4ucHJvcEhvb2tzLnNjcm9sbFRvcCA9IFR3ZWVuLnByb3BIb29rcy5zY3JvbGxMZWZ0ID0ge1xuXHRzZXQ6IGZ1bmN0aW9uKCB0d2VlbiApIHtcblx0XHRpZiAoIHR3ZWVuLmVsZW0ubm9kZVR5cGUgJiYgdHdlZW4uZWxlbS5wYXJlbnROb2RlICkge1xuXHRcdFx0dHdlZW4uZWxlbVsgdHdlZW4ucHJvcCBdID0gdHdlZW4ubm93O1xuXHRcdH1cblx0fVxufTtcblxualF1ZXJ5LmVhc2luZyA9IHtcblx0bGluZWFyOiBmdW5jdGlvbiggcCApIHtcblx0XHRyZXR1cm4gcDtcblx0fSxcblx0c3dpbmc6IGZ1bmN0aW9uKCBwICkge1xuXHRcdHJldHVybiAwLjUgLSBNYXRoLmNvcyggcCAqIE1hdGguUEkgKSAvIDI7XG5cdH0sXG5cdF9kZWZhdWx0OiBcInN3aW5nXCJcbn07XG5cbmpRdWVyeS5meCA9IFR3ZWVuLnByb3RvdHlwZS5pbml0O1xuXG4vLyBCYWNrIENvbXBhdCA8MS44IGV4dGVuc2lvbiBwb2ludFxualF1ZXJ5LmZ4LnN0ZXAgPSB7fTtcblxuXG5cblxudmFyXG5cdGZ4Tm93LCB0aW1lcklkLFxuXHRyZnh0eXBlcyA9IC9eKD86dG9nZ2xlfHNob3d8aGlkZSkkLyxcblx0cnJ1biA9IC9xdWV1ZUhvb2tzJC87XG5cbi8vIEFuaW1hdGlvbnMgY3JlYXRlZCBzeW5jaHJvbm91c2x5IHdpbGwgcnVuIHN5bmNocm9ub3VzbHlcbmZ1bmN0aW9uIGNyZWF0ZUZ4Tm93KCkge1xuXHR3aW5kb3cuc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0ZnhOb3cgPSB1bmRlZmluZWQ7XG5cdH0gKTtcblx0cmV0dXJuICggZnhOb3cgPSBqUXVlcnkubm93KCkgKTtcbn1cblxuLy8gR2VuZXJhdGUgcGFyYW1ldGVycyB0byBjcmVhdGUgYSBzdGFuZGFyZCBhbmltYXRpb25cbmZ1bmN0aW9uIGdlbkZ4KCB0eXBlLCBpbmNsdWRlV2lkdGggKSB7XG5cdHZhciB3aGljaCxcblx0XHRpID0gMCxcblx0XHRhdHRycyA9IHsgaGVpZ2h0OiB0eXBlIH07XG5cblx0Ly8gSWYgd2UgaW5jbHVkZSB3aWR0aCwgc3RlcCB2YWx1ZSBpcyAxIHRvIGRvIGFsbCBjc3NFeHBhbmQgdmFsdWVzLFxuXHQvLyBvdGhlcndpc2Ugc3RlcCB2YWx1ZSBpcyAyIHRvIHNraXAgb3ZlciBMZWZ0IGFuZCBSaWdodFxuXHRpbmNsdWRlV2lkdGggPSBpbmNsdWRlV2lkdGggPyAxIDogMDtcblx0Zm9yICggOyBpIDwgNCA7IGkgKz0gMiAtIGluY2x1ZGVXaWR0aCApIHtcblx0XHR3aGljaCA9IGNzc0V4cGFuZFsgaSBdO1xuXHRcdGF0dHJzWyBcIm1hcmdpblwiICsgd2hpY2ggXSA9IGF0dHJzWyBcInBhZGRpbmdcIiArIHdoaWNoIF0gPSB0eXBlO1xuXHR9XG5cblx0aWYgKCBpbmNsdWRlV2lkdGggKSB7XG5cdFx0YXR0cnMub3BhY2l0eSA9IGF0dHJzLndpZHRoID0gdHlwZTtcblx0fVxuXG5cdHJldHVybiBhdHRycztcbn1cblxuZnVuY3Rpb24gY3JlYXRlVHdlZW4oIHZhbHVlLCBwcm9wLCBhbmltYXRpb24gKSB7XG5cdHZhciB0d2Vlbixcblx0XHRjb2xsZWN0aW9uID0gKCBBbmltYXRpb24udHdlZW5lcnNbIHByb3AgXSB8fCBbXSApLmNvbmNhdCggQW5pbWF0aW9uLnR3ZWVuZXJzWyBcIipcIiBdICksXG5cdFx0aW5kZXggPSAwLFxuXHRcdGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoO1xuXHRmb3IgKCA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrICkge1xuXHRcdGlmICggKCB0d2VlbiA9IGNvbGxlY3Rpb25bIGluZGV4IF0uY2FsbCggYW5pbWF0aW9uLCBwcm9wLCB2YWx1ZSApICkgKSB7XG5cblx0XHRcdC8vIFdlJ3JlIGRvbmUgd2l0aCB0aGlzIHByb3BlcnR5XG5cdFx0XHRyZXR1cm4gdHdlZW47XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRQcmVmaWx0ZXIoIGVsZW0sIHByb3BzLCBvcHRzICkge1xuXHQvKiBqc2hpbnQgdmFsaWR0aGlzOiB0cnVlICovXG5cdHZhciBwcm9wLCB2YWx1ZSwgdG9nZ2xlLCB0d2VlbiwgaG9va3MsIG9sZGZpcmUsIGRpc3BsYXksIGNoZWNrRGlzcGxheSxcblx0XHRhbmltID0gdGhpcyxcblx0XHRvcmlnID0ge30sXG5cdFx0c3R5bGUgPSBlbGVtLnN0eWxlLFxuXHRcdGhpZGRlbiA9IGVsZW0ubm9kZVR5cGUgJiYgaXNIaWRkZW4oIGVsZW0gKSxcblx0XHRkYXRhU2hvdyA9IGRhdGFQcml2LmdldCggZWxlbSwgXCJmeHNob3dcIiApO1xuXG5cdC8vIEhhbmRsZSBxdWV1ZTogZmFsc2UgcHJvbWlzZXNcblx0aWYgKCAhb3B0cy5xdWV1ZSApIHtcblx0XHRob29rcyA9IGpRdWVyeS5fcXVldWVIb29rcyggZWxlbSwgXCJmeFwiICk7XG5cdFx0aWYgKCBob29rcy51bnF1ZXVlZCA9PSBudWxsICkge1xuXHRcdFx0aG9va3MudW5xdWV1ZWQgPSAwO1xuXHRcdFx0b2xkZmlyZSA9IGhvb2tzLmVtcHR5LmZpcmU7XG5cdFx0XHRob29rcy5lbXB0eS5maXJlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggIWhvb2tzLnVucXVldWVkICkge1xuXHRcdFx0XHRcdG9sZGZpcmUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0aG9va3MudW5xdWV1ZWQrKztcblxuXHRcdGFuaW0uYWx3YXlzKCBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gRW5zdXJlIHRoZSBjb21wbGV0ZSBoYW5kbGVyIGlzIGNhbGxlZCBiZWZvcmUgdGhpcyBjb21wbGV0ZXNcblx0XHRcdGFuaW0uYWx3YXlzKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0aG9va3MudW5xdWV1ZWQtLTtcblx0XHRcdFx0aWYgKCAhalF1ZXJ5LnF1ZXVlKCBlbGVtLCBcImZ4XCIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aG9va3MuZW1wdHkuZmlyZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0Ly8gSGVpZ2h0L3dpZHRoIG92ZXJmbG93IHBhc3Ncblx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxICYmICggXCJoZWlnaHRcIiBpbiBwcm9wcyB8fCBcIndpZHRoXCIgaW4gcHJvcHMgKSApIHtcblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IG5vdGhpbmcgc25lYWtzIG91dFxuXHRcdC8vIFJlY29yZCBhbGwgMyBvdmVyZmxvdyBhdHRyaWJ1dGVzIGJlY2F1c2UgSUU5LTEwIGRvIG5vdFxuXHRcdC8vIGNoYW5nZSB0aGUgb3ZlcmZsb3cgYXR0cmlidXRlIHdoZW4gb3ZlcmZsb3dYIGFuZFxuXHRcdC8vIG92ZXJmbG93WSBhcmUgc2V0IHRvIHRoZSBzYW1lIHZhbHVlXG5cdFx0b3B0cy5vdmVyZmxvdyA9IFsgc3R5bGUub3ZlcmZsb3csIHN0eWxlLm92ZXJmbG93WCwgc3R5bGUub3ZlcmZsb3dZIF07XG5cblx0XHQvLyBTZXQgZGlzcGxheSBwcm9wZXJ0eSB0byBpbmxpbmUtYmxvY2sgZm9yIGhlaWdodC93aWR0aFxuXHRcdC8vIGFuaW1hdGlvbnMgb24gaW5saW5lIGVsZW1lbnRzIHRoYXQgYXJlIGhhdmluZyB3aWR0aC9oZWlnaHQgYW5pbWF0ZWRcblx0XHRkaXNwbGF5ID0galF1ZXJ5LmNzcyggZWxlbSwgXCJkaXNwbGF5XCIgKTtcblxuXHRcdC8vIFRlc3QgZGVmYXVsdCBkaXNwbGF5IGlmIGRpc3BsYXkgaXMgY3VycmVudGx5IFwibm9uZVwiXG5cdFx0Y2hlY2tEaXNwbGF5ID0gZGlzcGxheSA9PT0gXCJub25lXCIgP1xuXHRcdFx0ZGF0YVByaXYuZ2V0KCBlbGVtLCBcIm9sZGRpc3BsYXlcIiApIHx8IGRlZmF1bHREaXNwbGF5KCBlbGVtLm5vZGVOYW1lICkgOiBkaXNwbGF5O1xuXG5cdFx0aWYgKCBjaGVja0Rpc3BsYXkgPT09IFwiaW5saW5lXCIgJiYgalF1ZXJ5LmNzcyggZWxlbSwgXCJmbG9hdFwiICkgPT09IFwibm9uZVwiICkge1xuXHRcdFx0c3R5bGUuZGlzcGxheSA9IFwiaW5saW5lLWJsb2NrXCI7XG5cdFx0fVxuXHR9XG5cblx0aWYgKCBvcHRzLm92ZXJmbG93ICkge1xuXHRcdHN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcblx0XHRhbmltLmFsd2F5cyggZnVuY3Rpb24oKSB7XG5cdFx0XHRzdHlsZS5vdmVyZmxvdyA9IG9wdHMub3ZlcmZsb3dbIDAgXTtcblx0XHRcdHN0eWxlLm92ZXJmbG93WCA9IG9wdHMub3ZlcmZsb3dbIDEgXTtcblx0XHRcdHN0eWxlLm92ZXJmbG93WSA9IG9wdHMub3ZlcmZsb3dbIDIgXTtcblx0XHR9ICk7XG5cdH1cblxuXHQvLyBzaG93L2hpZGUgcGFzc1xuXHRmb3IgKCBwcm9wIGluIHByb3BzICkge1xuXHRcdHZhbHVlID0gcHJvcHNbIHByb3AgXTtcblx0XHRpZiAoIHJmeHR5cGVzLmV4ZWMoIHZhbHVlICkgKSB7XG5cdFx0XHRkZWxldGUgcHJvcHNbIHByb3AgXTtcblx0XHRcdHRvZ2dsZSA9IHRvZ2dsZSB8fCB2YWx1ZSA9PT0gXCJ0b2dnbGVcIjtcblx0XHRcdGlmICggdmFsdWUgPT09ICggaGlkZGVuID8gXCJoaWRlXCIgOiBcInNob3dcIiApICkge1xuXG5cdFx0XHRcdC8vIElmIHRoZXJlIGlzIGRhdGFTaG93IGxlZnQgb3ZlciBmcm9tIGEgc3RvcHBlZCBoaWRlIG9yIHNob3dcblx0XHRcdFx0Ly8gYW5kIHdlIGFyZSBnb2luZyB0byBwcm9jZWVkIHdpdGggc2hvdywgd2Ugc2hvdWxkIHByZXRlbmQgdG8gYmUgaGlkZGVuXG5cdFx0XHRcdGlmICggdmFsdWUgPT09IFwic2hvd1wiICYmIGRhdGFTaG93ICYmIGRhdGFTaG93WyBwcm9wIF0gIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0XHRoaWRkZW4gPSB0cnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRvcmlnWyBwcm9wIF0gPSBkYXRhU2hvdyAmJiBkYXRhU2hvd1sgcHJvcCBdIHx8IGpRdWVyeS5zdHlsZSggZWxlbSwgcHJvcCApO1xuXG5cdFx0Ly8gQW55IG5vbi1meCB2YWx1ZSBzdG9wcyB1cyBmcm9tIHJlc3RvcmluZyB0aGUgb3JpZ2luYWwgZGlzcGxheSB2YWx1ZVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRkaXNwbGF5ID0gdW5kZWZpbmVkO1xuXHRcdH1cblx0fVxuXG5cdGlmICggIWpRdWVyeS5pc0VtcHR5T2JqZWN0KCBvcmlnICkgKSB7XG5cdFx0aWYgKCBkYXRhU2hvdyApIHtcblx0XHRcdGlmICggXCJoaWRkZW5cIiBpbiBkYXRhU2hvdyApIHtcblx0XHRcdFx0aGlkZGVuID0gZGF0YVNob3cuaGlkZGVuO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRkYXRhU2hvdyA9IGRhdGFQcml2LmFjY2VzcyggZWxlbSwgXCJmeHNob3dcIiwge30gKTtcblx0XHR9XG5cblx0XHQvLyBTdG9yZSBzdGF0ZSBpZiBpdHMgdG9nZ2xlIC0gZW5hYmxlcyAuc3RvcCgpLnRvZ2dsZSgpIHRvIFwicmV2ZXJzZVwiXG5cdFx0aWYgKCB0b2dnbGUgKSB7XG5cdFx0XHRkYXRhU2hvdy5oaWRkZW4gPSAhaGlkZGVuO1xuXHRcdH1cblx0XHRpZiAoIGhpZGRlbiApIHtcblx0XHRcdGpRdWVyeSggZWxlbSApLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YW5pbS5kb25lKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0alF1ZXJ5KCBlbGVtICkuaGlkZSgpO1xuXHRcdFx0fSApO1xuXHRcdH1cblx0XHRhbmltLmRvbmUoIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHByb3A7XG5cblx0XHRcdGRhdGFQcml2LnJlbW92ZSggZWxlbSwgXCJmeHNob3dcIiApO1xuXHRcdFx0Zm9yICggcHJvcCBpbiBvcmlnICkge1xuXHRcdFx0XHRqUXVlcnkuc3R5bGUoIGVsZW0sIHByb3AsIG9yaWdbIHByb3AgXSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0XHRmb3IgKCBwcm9wIGluIG9yaWcgKSB7XG5cdFx0XHR0d2VlbiA9IGNyZWF0ZVR3ZWVuKCBoaWRkZW4gPyBkYXRhU2hvd1sgcHJvcCBdIDogMCwgcHJvcCwgYW5pbSApO1xuXG5cdFx0XHRpZiAoICEoIHByb3AgaW4gZGF0YVNob3cgKSApIHtcblx0XHRcdFx0ZGF0YVNob3dbIHByb3AgXSA9IHR3ZWVuLnN0YXJ0O1xuXHRcdFx0XHRpZiAoIGhpZGRlbiApIHtcblx0XHRcdFx0XHR0d2Vlbi5lbmQgPSB0d2Vlbi5zdGFydDtcblx0XHRcdFx0XHR0d2Vlbi5zdGFydCA9IHByb3AgPT09IFwid2lkdGhcIiB8fCBwcm9wID09PSBcImhlaWdodFwiID8gMSA6IDA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0Ly8gSWYgdGhpcyBpcyBhIG5vb3AgbGlrZSAuaGlkZSgpLmhpZGUoKSwgcmVzdG9yZSBhbiBvdmVyd3JpdHRlbiBkaXNwbGF5IHZhbHVlXG5cdH0gZWxzZSBpZiAoICggZGlzcGxheSA9PT0gXCJub25lXCIgPyBkZWZhdWx0RGlzcGxheSggZWxlbS5ub2RlTmFtZSApIDogZGlzcGxheSApID09PSBcImlubGluZVwiICkge1xuXHRcdHN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xuXHR9XG59XG5cbmZ1bmN0aW9uIHByb3BGaWx0ZXIoIHByb3BzLCBzcGVjaWFsRWFzaW5nICkge1xuXHR2YXIgaW5kZXgsIG5hbWUsIGVhc2luZywgdmFsdWUsIGhvb2tzO1xuXG5cdC8vIGNhbWVsQ2FzZSwgc3BlY2lhbEVhc2luZyBhbmQgZXhwYW5kIGNzc0hvb2sgcGFzc1xuXHRmb3IgKCBpbmRleCBpbiBwcm9wcyApIHtcblx0XHRuYW1lID0galF1ZXJ5LmNhbWVsQ2FzZSggaW5kZXggKTtcblx0XHRlYXNpbmcgPSBzcGVjaWFsRWFzaW5nWyBuYW1lIF07XG5cdFx0dmFsdWUgPSBwcm9wc1sgaW5kZXggXTtcblx0XHRpZiAoIGpRdWVyeS5pc0FycmF5KCB2YWx1ZSApICkge1xuXHRcdFx0ZWFzaW5nID0gdmFsdWVbIDEgXTtcblx0XHRcdHZhbHVlID0gcHJvcHNbIGluZGV4IF0gPSB2YWx1ZVsgMCBdO1xuXHRcdH1cblxuXHRcdGlmICggaW5kZXggIT09IG5hbWUgKSB7XG5cdFx0XHRwcm9wc1sgbmFtZSBdID0gdmFsdWU7XG5cdFx0XHRkZWxldGUgcHJvcHNbIGluZGV4IF07XG5cdFx0fVxuXG5cdFx0aG9va3MgPSBqUXVlcnkuY3NzSG9va3NbIG5hbWUgXTtcblx0XHRpZiAoIGhvb2tzICYmIFwiZXhwYW5kXCIgaW4gaG9va3MgKSB7XG5cdFx0XHR2YWx1ZSA9IGhvb2tzLmV4cGFuZCggdmFsdWUgKTtcblx0XHRcdGRlbGV0ZSBwcm9wc1sgbmFtZSBdO1xuXG5cdFx0XHQvLyBOb3QgcXVpdGUgJC5leHRlbmQsIHRoaXMgd29uJ3Qgb3ZlcndyaXRlIGV4aXN0aW5nIGtleXMuXG5cdFx0XHQvLyBSZXVzaW5nICdpbmRleCcgYmVjYXVzZSB3ZSBoYXZlIHRoZSBjb3JyZWN0IFwibmFtZVwiXG5cdFx0XHRmb3IgKCBpbmRleCBpbiB2YWx1ZSApIHtcblx0XHRcdFx0aWYgKCAhKCBpbmRleCBpbiBwcm9wcyApICkge1xuXHRcdFx0XHRcdHByb3BzWyBpbmRleCBdID0gdmFsdWVbIGluZGV4IF07XG5cdFx0XHRcdFx0c3BlY2lhbEVhc2luZ1sgaW5kZXggXSA9IGVhc2luZztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRzcGVjaWFsRWFzaW5nWyBuYW1lIF0gPSBlYXNpbmc7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIEFuaW1hdGlvbiggZWxlbSwgcHJvcGVydGllcywgb3B0aW9ucyApIHtcblx0dmFyIHJlc3VsdCxcblx0XHRzdG9wcGVkLFxuXHRcdGluZGV4ID0gMCxcblx0XHRsZW5ndGggPSBBbmltYXRpb24ucHJlZmlsdGVycy5sZW5ndGgsXG5cdFx0ZGVmZXJyZWQgPSBqUXVlcnkuRGVmZXJyZWQoKS5hbHdheXMoIGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQvLyBEb24ndCBtYXRjaCBlbGVtIGluIHRoZSA6YW5pbWF0ZWQgc2VsZWN0b3Jcblx0XHRcdGRlbGV0ZSB0aWNrLmVsZW07XG5cdFx0fSApLFxuXHRcdHRpY2sgPSBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggc3RvcHBlZCApIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGN1cnJlbnRUaW1lID0gZnhOb3cgfHwgY3JlYXRlRnhOb3coKSxcblx0XHRcdFx0cmVtYWluaW5nID0gTWF0aC5tYXgoIDAsIGFuaW1hdGlvbi5zdGFydFRpbWUgKyBhbmltYXRpb24uZHVyYXRpb24gLSBjdXJyZW50VGltZSApLFxuXG5cdFx0XHRcdC8vIFN1cHBvcnQ6IEFuZHJvaWQgMi4zXG5cdFx0XHRcdC8vIEFyY2hhaWMgY3Jhc2ggYnVnIHdvbid0IGFsbG93IHVzIHRvIHVzZSBgMSAtICggMC41IHx8IDAgKWAgKCMxMjQ5Nylcblx0XHRcdFx0dGVtcCA9IHJlbWFpbmluZyAvIGFuaW1hdGlvbi5kdXJhdGlvbiB8fCAwLFxuXHRcdFx0XHRwZXJjZW50ID0gMSAtIHRlbXAsXG5cdFx0XHRcdGluZGV4ID0gMCxcblx0XHRcdFx0bGVuZ3RoID0gYW5pbWF0aW9uLnR3ZWVucy5sZW5ndGg7XG5cblx0XHRcdGZvciAoIDsgaW5kZXggPCBsZW5ndGggOyBpbmRleCsrICkge1xuXHRcdFx0XHRhbmltYXRpb24udHdlZW5zWyBpbmRleCBdLnJ1biggcGVyY2VudCApO1xuXHRcdFx0fVxuXG5cdFx0XHRkZWZlcnJlZC5ub3RpZnlXaXRoKCBlbGVtLCBbIGFuaW1hdGlvbiwgcGVyY2VudCwgcmVtYWluaW5nIF0gKTtcblxuXHRcdFx0aWYgKCBwZXJjZW50IDwgMSAmJiBsZW5ndGggKSB7XG5cdFx0XHRcdHJldHVybiByZW1haW5pbmc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlV2l0aCggZWxlbSwgWyBhbmltYXRpb24gXSApO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRhbmltYXRpb24gPSBkZWZlcnJlZC5wcm9taXNlKCB7XG5cdFx0XHRlbGVtOiBlbGVtLFxuXHRcdFx0cHJvcHM6IGpRdWVyeS5leHRlbmQoIHt9LCBwcm9wZXJ0aWVzICksXG5cdFx0XHRvcHRzOiBqUXVlcnkuZXh0ZW5kKCB0cnVlLCB7XG5cdFx0XHRcdHNwZWNpYWxFYXNpbmc6IHt9LFxuXHRcdFx0XHRlYXNpbmc6IGpRdWVyeS5lYXNpbmcuX2RlZmF1bHRcblx0XHRcdH0sIG9wdGlvbnMgKSxcblx0XHRcdG9yaWdpbmFsUHJvcGVydGllczogcHJvcGVydGllcyxcblx0XHRcdG9yaWdpbmFsT3B0aW9uczogb3B0aW9ucyxcblx0XHRcdHN0YXJ0VGltZTogZnhOb3cgfHwgY3JlYXRlRnhOb3coKSxcblx0XHRcdGR1cmF0aW9uOiBvcHRpb25zLmR1cmF0aW9uLFxuXHRcdFx0dHdlZW5zOiBbXSxcblx0XHRcdGNyZWF0ZVR3ZWVuOiBmdW5jdGlvbiggcHJvcCwgZW5kICkge1xuXHRcdFx0XHR2YXIgdHdlZW4gPSBqUXVlcnkuVHdlZW4oIGVsZW0sIGFuaW1hdGlvbi5vcHRzLCBwcm9wLCBlbmQsXG5cdFx0XHRcdFx0XHRhbmltYXRpb24ub3B0cy5zcGVjaWFsRWFzaW5nWyBwcm9wIF0gfHwgYW5pbWF0aW9uLm9wdHMuZWFzaW5nICk7XG5cdFx0XHRcdGFuaW1hdGlvbi50d2VlbnMucHVzaCggdHdlZW4gKTtcblx0XHRcdFx0cmV0dXJuIHR3ZWVuO1xuXHRcdFx0fSxcblx0XHRcdHN0b3A6IGZ1bmN0aW9uKCBnb3RvRW5kICkge1xuXHRcdFx0XHR2YXIgaW5kZXggPSAwLFxuXG5cdFx0XHRcdFx0Ly8gSWYgd2UgYXJlIGdvaW5nIHRvIHRoZSBlbmQsIHdlIHdhbnQgdG8gcnVuIGFsbCB0aGUgdHdlZW5zXG5cdFx0XHRcdFx0Ly8gb3RoZXJ3aXNlIHdlIHNraXAgdGhpcyBwYXJ0XG5cdFx0XHRcdFx0bGVuZ3RoID0gZ290b0VuZCA/IGFuaW1hdGlvbi50d2VlbnMubGVuZ3RoIDogMDtcblx0XHRcdFx0aWYgKCBzdG9wcGVkICkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHN0b3BwZWQgPSB0cnVlO1xuXHRcdFx0XHRmb3IgKCA7IGluZGV4IDwgbGVuZ3RoIDsgaW5kZXgrKyApIHtcblx0XHRcdFx0XHRhbmltYXRpb24udHdlZW5zWyBpbmRleCBdLnJ1biggMSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gUmVzb2x2ZSB3aGVuIHdlIHBsYXllZCB0aGUgbGFzdCBmcmFtZTsgb3RoZXJ3aXNlLCByZWplY3Rcblx0XHRcdFx0aWYgKCBnb3RvRW5kICkge1xuXHRcdFx0XHRcdGRlZmVycmVkLm5vdGlmeVdpdGgoIGVsZW0sIFsgYW5pbWF0aW9uLCAxLCAwIF0gKTtcblx0XHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlV2l0aCggZWxlbSwgWyBhbmltYXRpb24sIGdvdG9FbmQgXSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGRlZmVycmVkLnJlamVjdFdpdGgoIGVsZW0sIFsgYW5pbWF0aW9uLCBnb3RvRW5kIF0gKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH1cblx0XHR9ICksXG5cdFx0cHJvcHMgPSBhbmltYXRpb24ucHJvcHM7XG5cblx0cHJvcEZpbHRlciggcHJvcHMsIGFuaW1hdGlvbi5vcHRzLnNwZWNpYWxFYXNpbmcgKTtcblxuXHRmb3IgKCA7IGluZGV4IDwgbGVuZ3RoIDsgaW5kZXgrKyApIHtcblx0XHRyZXN1bHQgPSBBbmltYXRpb24ucHJlZmlsdGVyc1sgaW5kZXggXS5jYWxsKCBhbmltYXRpb24sIGVsZW0sIHByb3BzLCBhbmltYXRpb24ub3B0cyApO1xuXHRcdGlmICggcmVzdWx0ICkge1xuXHRcdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggcmVzdWx0LnN0b3AgKSApIHtcblx0XHRcdFx0alF1ZXJ5Ll9xdWV1ZUhvb2tzKCBhbmltYXRpb24uZWxlbSwgYW5pbWF0aW9uLm9wdHMucXVldWUgKS5zdG9wID1cblx0XHRcdFx0XHRqUXVlcnkucHJveHkoIHJlc3VsdC5zdG9wLCByZXN1bHQgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXHR9XG5cblx0alF1ZXJ5Lm1hcCggcHJvcHMsIGNyZWF0ZVR3ZWVuLCBhbmltYXRpb24gKTtcblxuXHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBhbmltYXRpb24ub3B0cy5zdGFydCApICkge1xuXHRcdGFuaW1hdGlvbi5vcHRzLnN0YXJ0LmNhbGwoIGVsZW0sIGFuaW1hdGlvbiApO1xuXHR9XG5cblx0alF1ZXJ5LmZ4LnRpbWVyKFxuXHRcdGpRdWVyeS5leHRlbmQoIHRpY2ssIHtcblx0XHRcdGVsZW06IGVsZW0sXG5cdFx0XHRhbmltOiBhbmltYXRpb24sXG5cdFx0XHRxdWV1ZTogYW5pbWF0aW9uLm9wdHMucXVldWVcblx0XHR9IClcblx0KTtcblxuXHQvLyBhdHRhY2ggY2FsbGJhY2tzIGZyb20gb3B0aW9uc1xuXHRyZXR1cm4gYW5pbWF0aW9uLnByb2dyZXNzKCBhbmltYXRpb24ub3B0cy5wcm9ncmVzcyApXG5cdFx0LmRvbmUoIGFuaW1hdGlvbi5vcHRzLmRvbmUsIGFuaW1hdGlvbi5vcHRzLmNvbXBsZXRlIClcblx0XHQuZmFpbCggYW5pbWF0aW9uLm9wdHMuZmFpbCApXG5cdFx0LmFsd2F5cyggYW5pbWF0aW9uLm9wdHMuYWx3YXlzICk7XG59XG5cbmpRdWVyeS5BbmltYXRpb24gPSBqUXVlcnkuZXh0ZW5kKCBBbmltYXRpb24sIHtcblx0dHdlZW5lcnM6IHtcblx0XHRcIipcIjogWyBmdW5jdGlvbiggcHJvcCwgdmFsdWUgKSB7XG5cdFx0XHR2YXIgdHdlZW4gPSB0aGlzLmNyZWF0ZVR3ZWVuKCBwcm9wLCB2YWx1ZSApO1xuXHRcdFx0YWRqdXN0Q1NTKCB0d2Vlbi5lbGVtLCBwcm9wLCByY3NzTnVtLmV4ZWMoIHZhbHVlICksIHR3ZWVuICk7XG5cdFx0XHRyZXR1cm4gdHdlZW47XG5cdFx0fSBdXG5cdH0sXG5cblx0dHdlZW5lcjogZnVuY3Rpb24oIHByb3BzLCBjYWxsYmFjayApIHtcblx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBwcm9wcyApICkge1xuXHRcdFx0Y2FsbGJhY2sgPSBwcm9wcztcblx0XHRcdHByb3BzID0gWyBcIipcIiBdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwcm9wcyA9IHByb3BzLm1hdGNoKCBybm90d2hpdGUgKTtcblx0XHR9XG5cblx0XHR2YXIgcHJvcCxcblx0XHRcdGluZGV4ID0gMCxcblx0XHRcdGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuXHRcdGZvciAoIDsgaW5kZXggPCBsZW5ndGggOyBpbmRleCsrICkge1xuXHRcdFx0cHJvcCA9IHByb3BzWyBpbmRleCBdO1xuXHRcdFx0QW5pbWF0aW9uLnR3ZWVuZXJzWyBwcm9wIF0gPSBBbmltYXRpb24udHdlZW5lcnNbIHByb3AgXSB8fCBbXTtcblx0XHRcdEFuaW1hdGlvbi50d2VlbmVyc1sgcHJvcCBdLnVuc2hpZnQoIGNhbGxiYWNrICk7XG5cdFx0fVxuXHR9LFxuXG5cdHByZWZpbHRlcnM6IFsgZGVmYXVsdFByZWZpbHRlciBdLFxuXG5cdHByZWZpbHRlcjogZnVuY3Rpb24oIGNhbGxiYWNrLCBwcmVwZW5kICkge1xuXHRcdGlmICggcHJlcGVuZCApIHtcblx0XHRcdEFuaW1hdGlvbi5wcmVmaWx0ZXJzLnVuc2hpZnQoIGNhbGxiYWNrICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdEFuaW1hdGlvbi5wcmVmaWx0ZXJzLnB1c2goIGNhbGxiYWNrICk7XG5cdFx0fVxuXHR9XG59ICk7XG5cbmpRdWVyeS5zcGVlZCA9IGZ1bmN0aW9uKCBzcGVlZCwgZWFzaW5nLCBmbiApIHtcblx0dmFyIG9wdCA9IHNwZWVkICYmIHR5cGVvZiBzcGVlZCA9PT0gXCJvYmplY3RcIiA/IGpRdWVyeS5leHRlbmQoIHt9LCBzcGVlZCApIDoge1xuXHRcdGNvbXBsZXRlOiBmbiB8fCAhZm4gJiYgZWFzaW5nIHx8XG5cdFx0XHRqUXVlcnkuaXNGdW5jdGlvbiggc3BlZWQgKSAmJiBzcGVlZCxcblx0XHRkdXJhdGlvbjogc3BlZWQsXG5cdFx0ZWFzaW5nOiBmbiAmJiBlYXNpbmcgfHwgZWFzaW5nICYmICFqUXVlcnkuaXNGdW5jdGlvbiggZWFzaW5nICkgJiYgZWFzaW5nXG5cdH07XG5cblx0b3B0LmR1cmF0aW9uID0galF1ZXJ5LmZ4Lm9mZiA/IDAgOiB0eXBlb2Ygb3B0LmR1cmF0aW9uID09PSBcIm51bWJlclwiID9cblx0XHRvcHQuZHVyYXRpb24gOiBvcHQuZHVyYXRpb24gaW4galF1ZXJ5LmZ4LnNwZWVkcyA/XG5cdFx0XHRqUXVlcnkuZnguc3BlZWRzWyBvcHQuZHVyYXRpb24gXSA6IGpRdWVyeS5meC5zcGVlZHMuX2RlZmF1bHQ7XG5cblx0Ly8gTm9ybWFsaXplIG9wdC5xdWV1ZSAtIHRydWUvdW5kZWZpbmVkL251bGwgLT4gXCJmeFwiXG5cdGlmICggb3B0LnF1ZXVlID09IG51bGwgfHwgb3B0LnF1ZXVlID09PSB0cnVlICkge1xuXHRcdG9wdC5xdWV1ZSA9IFwiZnhcIjtcblx0fVxuXG5cdC8vIFF1ZXVlaW5nXG5cdG9wdC5vbGQgPSBvcHQuY29tcGxldGU7XG5cblx0b3B0LmNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggb3B0Lm9sZCApICkge1xuXHRcdFx0b3B0Lm9sZC5jYWxsKCB0aGlzICk7XG5cdFx0fVxuXG5cdFx0aWYgKCBvcHQucXVldWUgKSB7XG5cdFx0XHRqUXVlcnkuZGVxdWV1ZSggdGhpcywgb3B0LnF1ZXVlICk7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBvcHQ7XG59O1xuXG5qUXVlcnkuZm4uZXh0ZW5kKCB7XG5cdGZhZGVUbzogZnVuY3Rpb24oIHNwZWVkLCB0bywgZWFzaW5nLCBjYWxsYmFjayApIHtcblxuXHRcdC8vIFNob3cgYW55IGhpZGRlbiBlbGVtZW50cyBhZnRlciBzZXR0aW5nIG9wYWNpdHkgdG8gMFxuXHRcdHJldHVybiB0aGlzLmZpbHRlciggaXNIaWRkZW4gKS5jc3MoIFwib3BhY2l0eVwiLCAwICkuc2hvdygpXG5cblx0XHRcdC8vIEFuaW1hdGUgdG8gdGhlIHZhbHVlIHNwZWNpZmllZFxuXHRcdFx0LmVuZCgpLmFuaW1hdGUoIHsgb3BhY2l0eTogdG8gfSwgc3BlZWQsIGVhc2luZywgY2FsbGJhY2sgKTtcblx0fSxcblx0YW5pbWF0ZTogZnVuY3Rpb24oIHByb3AsIHNwZWVkLCBlYXNpbmcsIGNhbGxiYWNrICkge1xuXHRcdHZhciBlbXB0eSA9IGpRdWVyeS5pc0VtcHR5T2JqZWN0KCBwcm9wICksXG5cdFx0XHRvcHRhbGwgPSBqUXVlcnkuc3BlZWQoIHNwZWVkLCBlYXNpbmcsIGNhbGxiYWNrICksXG5cdFx0XHRkb0FuaW1hdGlvbiA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRcdC8vIE9wZXJhdGUgb24gYSBjb3B5IG9mIHByb3Agc28gcGVyLXByb3BlcnR5IGVhc2luZyB3b24ndCBiZSBsb3N0XG5cdFx0XHRcdHZhciBhbmltID0gQW5pbWF0aW9uKCB0aGlzLCBqUXVlcnkuZXh0ZW5kKCB7fSwgcHJvcCApLCBvcHRhbGwgKTtcblxuXHRcdFx0XHQvLyBFbXB0eSBhbmltYXRpb25zLCBvciBmaW5pc2hpbmcgcmVzb2x2ZXMgaW1tZWRpYXRlbHlcblx0XHRcdFx0aWYgKCBlbXB0eSB8fCBkYXRhUHJpdi5nZXQoIHRoaXMsIFwiZmluaXNoXCIgKSApIHtcblx0XHRcdFx0XHRhbmltLnN0b3AoIHRydWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdGRvQW5pbWF0aW9uLmZpbmlzaCA9IGRvQW5pbWF0aW9uO1xuXG5cdFx0cmV0dXJuIGVtcHR5IHx8IG9wdGFsbC5xdWV1ZSA9PT0gZmFsc2UgP1xuXHRcdFx0dGhpcy5lYWNoKCBkb0FuaW1hdGlvbiApIDpcblx0XHRcdHRoaXMucXVldWUoIG9wdGFsbC5xdWV1ZSwgZG9BbmltYXRpb24gKTtcblx0fSxcblx0c3RvcDogZnVuY3Rpb24oIHR5cGUsIGNsZWFyUXVldWUsIGdvdG9FbmQgKSB7XG5cdFx0dmFyIHN0b3BRdWV1ZSA9IGZ1bmN0aW9uKCBob29rcyApIHtcblx0XHRcdHZhciBzdG9wID0gaG9va3Muc3RvcDtcblx0XHRcdGRlbGV0ZSBob29rcy5zdG9wO1xuXHRcdFx0c3RvcCggZ290b0VuZCApO1xuXHRcdH07XG5cblx0XHRpZiAoIHR5cGVvZiB0eXBlICE9PSBcInN0cmluZ1wiICkge1xuXHRcdFx0Z290b0VuZCA9IGNsZWFyUXVldWU7XG5cdFx0XHRjbGVhclF1ZXVlID0gdHlwZTtcblx0XHRcdHR5cGUgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXHRcdGlmICggY2xlYXJRdWV1ZSAmJiB0eXBlICE9PSBmYWxzZSApIHtcblx0XHRcdHRoaXMucXVldWUoIHR5cGUgfHwgXCJmeFwiLCBbXSApO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGRlcXVldWUgPSB0cnVlLFxuXHRcdFx0XHRpbmRleCA9IHR5cGUgIT0gbnVsbCAmJiB0eXBlICsgXCJxdWV1ZUhvb2tzXCIsXG5cdFx0XHRcdHRpbWVycyA9IGpRdWVyeS50aW1lcnMsXG5cdFx0XHRcdGRhdGEgPSBkYXRhUHJpdi5nZXQoIHRoaXMgKTtcblxuXHRcdFx0aWYgKCBpbmRleCApIHtcblx0XHRcdFx0aWYgKCBkYXRhWyBpbmRleCBdICYmIGRhdGFbIGluZGV4IF0uc3RvcCApIHtcblx0XHRcdFx0XHRzdG9wUXVldWUoIGRhdGFbIGluZGV4IF0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9yICggaW5kZXggaW4gZGF0YSApIHtcblx0XHRcdFx0XHRpZiAoIGRhdGFbIGluZGV4IF0gJiYgZGF0YVsgaW5kZXggXS5zdG9wICYmIHJydW4udGVzdCggaW5kZXggKSApIHtcblx0XHRcdFx0XHRcdHN0b3BRdWV1ZSggZGF0YVsgaW5kZXggXSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKCBpbmRleCA9IHRpbWVycy5sZW5ndGg7IGluZGV4LS07ICkge1xuXHRcdFx0XHRpZiAoIHRpbWVyc1sgaW5kZXggXS5lbGVtID09PSB0aGlzICYmXG5cdFx0XHRcdFx0KCB0eXBlID09IG51bGwgfHwgdGltZXJzWyBpbmRleCBdLnF1ZXVlID09PSB0eXBlICkgKSB7XG5cblx0XHRcdFx0XHR0aW1lcnNbIGluZGV4IF0uYW5pbS5zdG9wKCBnb3RvRW5kICk7XG5cdFx0XHRcdFx0ZGVxdWV1ZSA9IGZhbHNlO1xuXHRcdFx0XHRcdHRpbWVycy5zcGxpY2UoIGluZGV4LCAxICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gU3RhcnQgdGhlIG5leHQgaW4gdGhlIHF1ZXVlIGlmIHRoZSBsYXN0IHN0ZXAgd2Fzbid0IGZvcmNlZC5cblx0XHRcdC8vIFRpbWVycyBjdXJyZW50bHkgd2lsbCBjYWxsIHRoZWlyIGNvbXBsZXRlIGNhbGxiYWNrcywgd2hpY2hcblx0XHRcdC8vIHdpbGwgZGVxdWV1ZSBidXQgb25seSBpZiB0aGV5IHdlcmUgZ290b0VuZC5cblx0XHRcdGlmICggZGVxdWV1ZSB8fCAhZ290b0VuZCApIHtcblx0XHRcdFx0alF1ZXJ5LmRlcXVldWUoIHRoaXMsIHR5cGUgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH0sXG5cdGZpbmlzaDogZnVuY3Rpb24oIHR5cGUgKSB7XG5cdFx0aWYgKCB0eXBlICE9PSBmYWxzZSApIHtcblx0XHRcdHR5cGUgPSB0eXBlIHx8IFwiZnhcIjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgaW5kZXgsXG5cdFx0XHRcdGRhdGEgPSBkYXRhUHJpdi5nZXQoIHRoaXMgKSxcblx0XHRcdFx0cXVldWUgPSBkYXRhWyB0eXBlICsgXCJxdWV1ZVwiIF0sXG5cdFx0XHRcdGhvb2tzID0gZGF0YVsgdHlwZSArIFwicXVldWVIb29rc1wiIF0sXG5cdFx0XHRcdHRpbWVycyA9IGpRdWVyeS50aW1lcnMsXG5cdFx0XHRcdGxlbmd0aCA9IHF1ZXVlID8gcXVldWUubGVuZ3RoIDogMDtcblxuXHRcdFx0Ly8gRW5hYmxlIGZpbmlzaGluZyBmbGFnIG9uIHByaXZhdGUgZGF0YVxuXHRcdFx0ZGF0YS5maW5pc2ggPSB0cnVlO1xuXG5cdFx0XHQvLyBFbXB0eSB0aGUgcXVldWUgZmlyc3Rcblx0XHRcdGpRdWVyeS5xdWV1ZSggdGhpcywgdHlwZSwgW10gKTtcblxuXHRcdFx0aWYgKCBob29rcyAmJiBob29rcy5zdG9wICkge1xuXHRcdFx0XHRob29rcy5zdG9wLmNhbGwoIHRoaXMsIHRydWUgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gTG9vayBmb3IgYW55IGFjdGl2ZSBhbmltYXRpb25zLCBhbmQgZmluaXNoIHRoZW1cblx0XHRcdGZvciAoIGluZGV4ID0gdGltZXJzLmxlbmd0aDsgaW5kZXgtLTsgKSB7XG5cdFx0XHRcdGlmICggdGltZXJzWyBpbmRleCBdLmVsZW0gPT09IHRoaXMgJiYgdGltZXJzWyBpbmRleCBdLnF1ZXVlID09PSB0eXBlICkge1xuXHRcdFx0XHRcdHRpbWVyc1sgaW5kZXggXS5hbmltLnN0b3AoIHRydWUgKTtcblx0XHRcdFx0XHR0aW1lcnMuc3BsaWNlKCBpbmRleCwgMSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIExvb2sgZm9yIGFueSBhbmltYXRpb25zIGluIHRoZSBvbGQgcXVldWUgYW5kIGZpbmlzaCB0aGVtXG5cdFx0XHRmb3IgKCBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrICkge1xuXHRcdFx0XHRpZiAoIHF1ZXVlWyBpbmRleCBdICYmIHF1ZXVlWyBpbmRleCBdLmZpbmlzaCApIHtcblx0XHRcdFx0XHRxdWV1ZVsgaW5kZXggXS5maW5pc2guY2FsbCggdGhpcyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIFR1cm4gb2ZmIGZpbmlzaGluZyBmbGFnXG5cdFx0XHRkZWxldGUgZGF0YS5maW5pc2g7XG5cdFx0fSApO1xuXHR9XG59ICk7XG5cbmpRdWVyeS5lYWNoKCBbIFwidG9nZ2xlXCIsIFwic2hvd1wiLCBcImhpZGVcIiBdLCBmdW5jdGlvbiggaSwgbmFtZSApIHtcblx0dmFyIGNzc0ZuID0galF1ZXJ5LmZuWyBuYW1lIF07XG5cdGpRdWVyeS5mblsgbmFtZSBdID0gZnVuY3Rpb24oIHNwZWVkLCBlYXNpbmcsIGNhbGxiYWNrICkge1xuXHRcdHJldHVybiBzcGVlZCA9PSBudWxsIHx8IHR5cGVvZiBzcGVlZCA9PT0gXCJib29sZWFuXCIgP1xuXHRcdFx0Y3NzRm4uYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApIDpcblx0XHRcdHRoaXMuYW5pbWF0ZSggZ2VuRngoIG5hbWUsIHRydWUgKSwgc3BlZWQsIGVhc2luZywgY2FsbGJhY2sgKTtcblx0fTtcbn0gKTtcblxuLy8gR2VuZXJhdGUgc2hvcnRjdXRzIGZvciBjdXN0b20gYW5pbWF0aW9uc1xualF1ZXJ5LmVhY2goIHtcblx0c2xpZGVEb3duOiBnZW5GeCggXCJzaG93XCIgKSxcblx0c2xpZGVVcDogZ2VuRngoIFwiaGlkZVwiICksXG5cdHNsaWRlVG9nZ2xlOiBnZW5GeCggXCJ0b2dnbGVcIiApLFxuXHRmYWRlSW46IHsgb3BhY2l0eTogXCJzaG93XCIgfSxcblx0ZmFkZU91dDogeyBvcGFjaXR5OiBcImhpZGVcIiB9LFxuXHRmYWRlVG9nZ2xlOiB7IG9wYWNpdHk6IFwidG9nZ2xlXCIgfVxufSwgZnVuY3Rpb24oIG5hbWUsIHByb3BzICkge1xuXHRqUXVlcnkuZm5bIG5hbWUgXSA9IGZ1bmN0aW9uKCBzcGVlZCwgZWFzaW5nLCBjYWxsYmFjayApIHtcblx0XHRyZXR1cm4gdGhpcy5hbmltYXRlKCBwcm9wcywgc3BlZWQsIGVhc2luZywgY2FsbGJhY2sgKTtcblx0fTtcbn0gKTtcblxualF1ZXJ5LnRpbWVycyA9IFtdO1xualF1ZXJ5LmZ4LnRpY2sgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRpbWVyLFxuXHRcdGkgPSAwLFxuXHRcdHRpbWVycyA9IGpRdWVyeS50aW1lcnM7XG5cblx0ZnhOb3cgPSBqUXVlcnkubm93KCk7XG5cblx0Zm9yICggOyBpIDwgdGltZXJzLmxlbmd0aDsgaSsrICkge1xuXHRcdHRpbWVyID0gdGltZXJzWyBpIF07XG5cblx0XHQvLyBDaGVja3MgdGhlIHRpbWVyIGhhcyBub3QgYWxyZWFkeSBiZWVuIHJlbW92ZWRcblx0XHRpZiAoICF0aW1lcigpICYmIHRpbWVyc1sgaSBdID09PSB0aW1lciApIHtcblx0XHRcdHRpbWVycy5zcGxpY2UoIGktLSwgMSApO1xuXHRcdH1cblx0fVxuXG5cdGlmICggIXRpbWVycy5sZW5ndGggKSB7XG5cdFx0alF1ZXJ5LmZ4LnN0b3AoKTtcblx0fVxuXHRmeE5vdyA9IHVuZGVmaW5lZDtcbn07XG5cbmpRdWVyeS5meC50aW1lciA9IGZ1bmN0aW9uKCB0aW1lciApIHtcblx0alF1ZXJ5LnRpbWVycy5wdXNoKCB0aW1lciApO1xuXHRpZiAoIHRpbWVyKCkgKSB7XG5cdFx0alF1ZXJ5LmZ4LnN0YXJ0KCk7XG5cdH0gZWxzZSB7XG5cdFx0alF1ZXJ5LnRpbWVycy5wb3AoKTtcblx0fVxufTtcblxualF1ZXJ5LmZ4LmludGVydmFsID0gMTM7XG5qUXVlcnkuZnguc3RhcnQgPSBmdW5jdGlvbigpIHtcblx0aWYgKCAhdGltZXJJZCApIHtcblx0XHR0aW1lcklkID0gd2luZG93LnNldEludGVydmFsKCBqUXVlcnkuZngudGljaywgalF1ZXJ5LmZ4LmludGVydmFsICk7XG5cdH1cbn07XG5cbmpRdWVyeS5meC5zdG9wID0gZnVuY3Rpb24oKSB7XG5cdHdpbmRvdy5jbGVhckludGVydmFsKCB0aW1lcklkICk7XG5cblx0dGltZXJJZCA9IG51bGw7XG59O1xuXG5qUXVlcnkuZnguc3BlZWRzID0ge1xuXHRzbG93OiA2MDAsXG5cdGZhc3Q6IDIwMCxcblxuXHQvLyBEZWZhdWx0IHNwZWVkXG5cdF9kZWZhdWx0OiA0MDBcbn07XG5cblxuLy8gQmFzZWQgb2ZmIG9mIHRoZSBwbHVnaW4gYnkgQ2xpbnQgSGVsZmVycywgd2l0aCBwZXJtaXNzaW9uLlxuLy8gaHR0cDovL3dlYi5hcmNoaXZlLm9yZy93ZWIvMjAxMDAzMjQwMTQ3NDcvaHR0cDovL2JsaW5kc2lnbmFscy5jb20vaW5kZXgucGhwLzIwMDkvMDcvanF1ZXJ5LWRlbGF5L1xualF1ZXJ5LmZuLmRlbGF5ID0gZnVuY3Rpb24oIHRpbWUsIHR5cGUgKSB7XG5cdHRpbWUgPSBqUXVlcnkuZnggPyBqUXVlcnkuZnguc3BlZWRzWyB0aW1lIF0gfHwgdGltZSA6IHRpbWU7XG5cdHR5cGUgPSB0eXBlIHx8IFwiZnhcIjtcblxuXHRyZXR1cm4gdGhpcy5xdWV1ZSggdHlwZSwgZnVuY3Rpb24oIG5leHQsIGhvb2tzICkge1xuXHRcdHZhciB0aW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoIG5leHQsIHRpbWUgKTtcblx0XHRob29rcy5zdG9wID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR3aW5kb3cuY2xlYXJUaW1lb3V0KCB0aW1lb3V0ICk7XG5cdFx0fTtcblx0fSApO1xufTtcblxuXG4oIGZ1bmN0aW9uKCkge1xuXHR2YXIgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImlucHV0XCIgKSxcblx0XHRzZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcInNlbGVjdFwiICksXG5cdFx0b3B0ID0gc2VsZWN0LmFwcGVuZENoaWxkKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcIm9wdGlvblwiICkgKTtcblxuXHRpbnB1dC50eXBlID0gXCJjaGVja2JveFwiO1xuXG5cdC8vIFN1cHBvcnQ6IGlPUzw9NS4xLCBBbmRyb2lkPD00LjIrXG5cdC8vIERlZmF1bHQgdmFsdWUgZm9yIGEgY2hlY2tib3ggc2hvdWxkIGJlIFwib25cIlxuXHRzdXBwb3J0LmNoZWNrT24gPSBpbnB1dC52YWx1ZSAhPT0gXCJcIjtcblxuXHQvLyBTdXBwb3J0OiBJRTw9MTErXG5cdC8vIE11c3QgYWNjZXNzIHNlbGVjdGVkSW5kZXggdG8gbWFrZSBkZWZhdWx0IG9wdGlvbnMgc2VsZWN0XG5cdHN1cHBvcnQub3B0U2VsZWN0ZWQgPSBvcHQuc2VsZWN0ZWQ7XG5cblx0Ly8gU3VwcG9ydDogQW5kcm9pZDw9Mi4zXG5cdC8vIE9wdGlvbnMgaW5zaWRlIGRpc2FibGVkIHNlbGVjdHMgYXJlIGluY29ycmVjdGx5IG1hcmtlZCBhcyBkaXNhYmxlZFxuXHRzZWxlY3QuZGlzYWJsZWQgPSB0cnVlO1xuXHRzdXBwb3J0Lm9wdERpc2FibGVkID0gIW9wdC5kaXNhYmxlZDtcblxuXHQvLyBTdXBwb3J0OiBJRTw9MTErXG5cdC8vIEFuIGlucHV0IGxvc2VzIGl0cyB2YWx1ZSBhZnRlciBiZWNvbWluZyBhIHJhZGlvXG5cdGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJpbnB1dFwiICk7XG5cdGlucHV0LnZhbHVlID0gXCJ0XCI7XG5cdGlucHV0LnR5cGUgPSBcInJhZGlvXCI7XG5cdHN1cHBvcnQucmFkaW9WYWx1ZSA9IGlucHV0LnZhbHVlID09PSBcInRcIjtcbn0gKSgpO1xuXG5cbnZhciBib29sSG9vayxcblx0YXR0ckhhbmRsZSA9IGpRdWVyeS5leHByLmF0dHJIYW5kbGU7XG5cbmpRdWVyeS5mbi5leHRlbmQoIHtcblx0YXR0cjogZnVuY3Rpb24oIG5hbWUsIHZhbHVlICkge1xuXHRcdHJldHVybiBhY2Nlc3MoIHRoaXMsIGpRdWVyeS5hdHRyLCBuYW1lLCB2YWx1ZSwgYXJndW1lbnRzLmxlbmd0aCA+IDEgKTtcblx0fSxcblxuXHRyZW1vdmVBdHRyOiBmdW5jdGlvbiggbmFtZSApIHtcblx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGpRdWVyeS5yZW1vdmVBdHRyKCB0aGlzLCBuYW1lICk7XG5cdFx0fSApO1xuXHR9XG59ICk7XG5cbmpRdWVyeS5leHRlbmQoIHtcblx0YXR0cjogZnVuY3Rpb24oIGVsZW0sIG5hbWUsIHZhbHVlICkge1xuXHRcdHZhciByZXQsIGhvb2tzLFxuXHRcdFx0blR5cGUgPSBlbGVtLm5vZGVUeXBlO1xuXG5cdFx0Ly8gRG9uJ3QgZ2V0L3NldCBhdHRyaWJ1dGVzIG9uIHRleHQsIGNvbW1lbnQgYW5kIGF0dHJpYnV0ZSBub2Rlc1xuXHRcdGlmICggblR5cGUgPT09IDMgfHwgblR5cGUgPT09IDggfHwgblR5cGUgPT09IDIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gRmFsbGJhY2sgdG8gcHJvcCB3aGVuIGF0dHJpYnV0ZXMgYXJlIG5vdCBzdXBwb3J0ZWRcblx0XHRpZiAoIHR5cGVvZiBlbGVtLmdldEF0dHJpYnV0ZSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRcdHJldHVybiBqUXVlcnkucHJvcCggZWxlbSwgbmFtZSwgdmFsdWUgKTtcblx0XHR9XG5cblx0XHQvLyBBbGwgYXR0cmlidXRlcyBhcmUgbG93ZXJjYXNlXG5cdFx0Ly8gR3JhYiBuZWNlc3NhcnkgaG9vayBpZiBvbmUgaXMgZGVmaW5lZFxuXHRcdGlmICggblR5cGUgIT09IDEgfHwgIWpRdWVyeS5pc1hNTERvYyggZWxlbSApICkge1xuXHRcdFx0bmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRcdGhvb2tzID0galF1ZXJ5LmF0dHJIb29rc1sgbmFtZSBdIHx8XG5cdFx0XHRcdCggalF1ZXJ5LmV4cHIubWF0Y2guYm9vbC50ZXN0KCBuYW1lICkgPyBib29sSG9vayA6IHVuZGVmaW5lZCApO1xuXHRcdH1cblxuXHRcdGlmICggdmFsdWUgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdGlmICggdmFsdWUgPT09IG51bGwgKSB7XG5cdFx0XHRcdGpRdWVyeS5yZW1vdmVBdHRyKCBlbGVtLCBuYW1lICk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBob29rcyAmJiBcInNldFwiIGluIGhvb2tzICYmXG5cdFx0XHRcdCggcmV0ID0gaG9va3Muc2V0KCBlbGVtLCB2YWx1ZSwgbmFtZSApICkgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0cmV0dXJuIHJldDtcblx0XHRcdH1cblxuXHRcdFx0ZWxlbS5zZXRBdHRyaWJ1dGUoIG5hbWUsIHZhbHVlICsgXCJcIiApO1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH1cblxuXHRcdGlmICggaG9va3MgJiYgXCJnZXRcIiBpbiBob29rcyAmJiAoIHJldCA9IGhvb2tzLmdldCggZWxlbSwgbmFtZSApICkgIT09IG51bGwgKSB7XG5cdFx0XHRyZXR1cm4gcmV0O1xuXHRcdH1cblxuXHRcdHJldCA9IGpRdWVyeS5maW5kLmF0dHIoIGVsZW0sIG5hbWUgKTtcblxuXHRcdC8vIE5vbi1leGlzdGVudCBhdHRyaWJ1dGVzIHJldHVybiBudWxsLCB3ZSBub3JtYWxpemUgdG8gdW5kZWZpbmVkXG5cdFx0cmV0dXJuIHJldCA9PSBudWxsID8gdW5kZWZpbmVkIDogcmV0O1xuXHR9LFxuXG5cdGF0dHJIb29rczoge1xuXHRcdHR5cGU6IHtcblx0XHRcdHNldDogZnVuY3Rpb24oIGVsZW0sIHZhbHVlICkge1xuXHRcdFx0XHRpZiAoICFzdXBwb3J0LnJhZGlvVmFsdWUgJiYgdmFsdWUgPT09IFwicmFkaW9cIiAmJlxuXHRcdFx0XHRcdGpRdWVyeS5ub2RlTmFtZSggZWxlbSwgXCJpbnB1dFwiICkgKSB7XG5cdFx0XHRcdFx0dmFyIHZhbCA9IGVsZW0udmFsdWU7XG5cdFx0XHRcdFx0ZWxlbS5zZXRBdHRyaWJ1dGUoIFwidHlwZVwiLCB2YWx1ZSApO1xuXHRcdFx0XHRcdGlmICggdmFsICkge1xuXHRcdFx0XHRcdFx0ZWxlbS52YWx1ZSA9IHZhbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdHJlbW92ZUF0dHI6IGZ1bmN0aW9uKCBlbGVtLCB2YWx1ZSApIHtcblx0XHR2YXIgbmFtZSwgcHJvcE5hbWUsXG5cdFx0XHRpID0gMCxcblx0XHRcdGF0dHJOYW1lcyA9IHZhbHVlICYmIHZhbHVlLm1hdGNoKCBybm90d2hpdGUgKTtcblxuXHRcdGlmICggYXR0ck5hbWVzICYmIGVsZW0ubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHR3aGlsZSAoICggbmFtZSA9IGF0dHJOYW1lc1sgaSsrIF0gKSApIHtcblx0XHRcdFx0cHJvcE5hbWUgPSBqUXVlcnkucHJvcEZpeFsgbmFtZSBdIHx8IG5hbWU7XG5cblx0XHRcdFx0Ly8gQm9vbGVhbiBhdHRyaWJ1dGVzIGdldCBzcGVjaWFsIHRyZWF0bWVudCAoIzEwODcwKVxuXHRcdFx0XHRpZiAoIGpRdWVyeS5leHByLm1hdGNoLmJvb2wudGVzdCggbmFtZSApICkge1xuXG5cdFx0XHRcdFx0Ly8gU2V0IGNvcnJlc3BvbmRpbmcgcHJvcGVydHkgdG8gZmFsc2Vcblx0XHRcdFx0XHRlbGVtWyBwcm9wTmFtZSBdID0gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRlbGVtLnJlbW92ZUF0dHJpYnV0ZSggbmFtZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufSApO1xuXG4vLyBIb29rcyBmb3IgYm9vbGVhbiBhdHRyaWJ1dGVzXG5ib29sSG9vayA9IHtcblx0c2V0OiBmdW5jdGlvbiggZWxlbSwgdmFsdWUsIG5hbWUgKSB7XG5cdFx0aWYgKCB2YWx1ZSA9PT0gZmFsc2UgKSB7XG5cblx0XHRcdC8vIFJlbW92ZSBib29sZWFuIGF0dHJpYnV0ZXMgd2hlbiBzZXQgdG8gZmFsc2Vcblx0XHRcdGpRdWVyeS5yZW1vdmVBdHRyKCBlbGVtLCBuYW1lICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGVsZW0uc2V0QXR0cmlidXRlKCBuYW1lLCBuYW1lICk7XG5cdFx0fVxuXHRcdHJldHVybiBuYW1lO1xuXHR9XG59O1xualF1ZXJ5LmVhY2goIGpRdWVyeS5leHByLm1hdGNoLmJvb2wuc291cmNlLm1hdGNoKCAvXFx3Ky9nICksIGZ1bmN0aW9uKCBpLCBuYW1lICkge1xuXHR2YXIgZ2V0dGVyID0gYXR0ckhhbmRsZVsgbmFtZSBdIHx8IGpRdWVyeS5maW5kLmF0dHI7XG5cblx0YXR0ckhhbmRsZVsgbmFtZSBdID0gZnVuY3Rpb24oIGVsZW0sIG5hbWUsIGlzWE1MICkge1xuXHRcdHZhciByZXQsIGhhbmRsZTtcblx0XHRpZiAoICFpc1hNTCApIHtcblxuXHRcdFx0Ly8gQXZvaWQgYW4gaW5maW5pdGUgbG9vcCBieSB0ZW1wb3JhcmlseSByZW1vdmluZyB0aGlzIGZ1bmN0aW9uIGZyb20gdGhlIGdldHRlclxuXHRcdFx0aGFuZGxlID0gYXR0ckhhbmRsZVsgbmFtZSBdO1xuXHRcdFx0YXR0ckhhbmRsZVsgbmFtZSBdID0gcmV0O1xuXHRcdFx0cmV0ID0gZ2V0dGVyKCBlbGVtLCBuYW1lLCBpc1hNTCApICE9IG51bGwgP1xuXHRcdFx0XHRuYW1lLnRvTG93ZXJDYXNlKCkgOlxuXHRcdFx0XHRudWxsO1xuXHRcdFx0YXR0ckhhbmRsZVsgbmFtZSBdID0gaGFuZGxlO1xuXHRcdH1cblx0XHRyZXR1cm4gcmV0O1xuXHR9O1xufSApO1xuXG5cblxuXG52YXIgcmZvY3VzYWJsZSA9IC9eKD86aW5wdXR8c2VsZWN0fHRleHRhcmVhfGJ1dHRvbikkL2ksXG5cdHJjbGlja2FibGUgPSAvXig/OmF8YXJlYSkkL2k7XG5cbmpRdWVyeS5mbi5leHRlbmQoIHtcblx0cHJvcDogZnVuY3Rpb24oIG5hbWUsIHZhbHVlICkge1xuXHRcdHJldHVybiBhY2Nlc3MoIHRoaXMsIGpRdWVyeS5wcm9wLCBuYW1lLCB2YWx1ZSwgYXJndW1lbnRzLmxlbmd0aCA+IDEgKTtcblx0fSxcblxuXHRyZW1vdmVQcm9wOiBmdW5jdGlvbiggbmFtZSApIHtcblx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyBqUXVlcnkucHJvcEZpeFsgbmFtZSBdIHx8IG5hbWUgXTtcblx0XHR9ICk7XG5cdH1cbn0gKTtcblxualF1ZXJ5LmV4dGVuZCgge1xuXHRwcm9wOiBmdW5jdGlvbiggZWxlbSwgbmFtZSwgdmFsdWUgKSB7XG5cdFx0dmFyIHJldCwgaG9va3MsXG5cdFx0XHRuVHlwZSA9IGVsZW0ubm9kZVR5cGU7XG5cblx0XHQvLyBEb24ndCBnZXQvc2V0IHByb3BlcnRpZXMgb24gdGV4dCwgY29tbWVudCBhbmQgYXR0cmlidXRlIG5vZGVzXG5cdFx0aWYgKCBuVHlwZSA9PT0gMyB8fCBuVHlwZSA9PT0gOCB8fCBuVHlwZSA9PT0gMiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIG5UeXBlICE9PSAxIHx8ICFqUXVlcnkuaXNYTUxEb2MoIGVsZW0gKSApIHtcblxuXHRcdFx0Ly8gRml4IG5hbWUgYW5kIGF0dGFjaCBob29rc1xuXHRcdFx0bmFtZSA9IGpRdWVyeS5wcm9wRml4WyBuYW1lIF0gfHwgbmFtZTtcblx0XHRcdGhvb2tzID0galF1ZXJ5LnByb3BIb29rc1sgbmFtZSBdO1xuXHRcdH1cblxuXHRcdGlmICggdmFsdWUgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdGlmICggaG9va3MgJiYgXCJzZXRcIiBpbiBob29rcyAmJlxuXHRcdFx0XHQoIHJldCA9IGhvb2tzLnNldCggZWxlbSwgdmFsdWUsIG5hbWUgKSApICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdHJldHVybiByZXQ7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAoIGVsZW1bIG5hbWUgXSA9IHZhbHVlICk7XG5cdFx0fVxuXG5cdFx0aWYgKCBob29rcyAmJiBcImdldFwiIGluIGhvb2tzICYmICggcmV0ID0gaG9va3MuZ2V0KCBlbGVtLCBuYW1lICkgKSAhPT0gbnVsbCApIHtcblx0XHRcdHJldHVybiByZXQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGVsZW1bIG5hbWUgXTtcblx0fSxcblxuXHRwcm9wSG9va3M6IHtcblx0XHR0YWJJbmRleDoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbiggZWxlbSApIHtcblxuXHRcdFx0XHQvLyBlbGVtLnRhYkluZGV4IGRvZXNuJ3QgYWx3YXlzIHJldHVybiB0aGVcblx0XHRcdFx0Ly8gY29ycmVjdCB2YWx1ZSB3aGVuIGl0IGhhc24ndCBiZWVuIGV4cGxpY2l0bHkgc2V0XG5cdFx0XHRcdC8vIGh0dHA6Ly9mbHVpZHByb2plY3Qub3JnL2Jsb2cvMjAwOC8wMS8wOS9nZXR0aW5nLXNldHRpbmctYW5kLXJlbW92aW5nLXRhYmluZGV4LXZhbHVlcy13aXRoLWphdmFzY3JpcHQvXG5cdFx0XHRcdC8vIFVzZSBwcm9wZXIgYXR0cmlidXRlIHJldHJpZXZhbCgjMTIwNzIpXG5cdFx0XHRcdHZhciB0YWJpbmRleCA9IGpRdWVyeS5maW5kLmF0dHIoIGVsZW0sIFwidGFiaW5kZXhcIiApO1xuXG5cdFx0XHRcdHJldHVybiB0YWJpbmRleCA/XG5cdFx0XHRcdFx0cGFyc2VJbnQoIHRhYmluZGV4LCAxMCApIDpcblx0XHRcdFx0XHRyZm9jdXNhYmxlLnRlc3QoIGVsZW0ubm9kZU5hbWUgKSB8fFxuXHRcdFx0XHRcdFx0cmNsaWNrYWJsZS50ZXN0KCBlbGVtLm5vZGVOYW1lICkgJiYgZWxlbS5ocmVmID9cblx0XHRcdFx0XHRcdFx0MCA6XG5cdFx0XHRcdFx0XHRcdC0xO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRwcm9wRml4OiB7XG5cdFx0XCJmb3JcIjogXCJodG1sRm9yXCIsXG5cdFx0XCJjbGFzc1wiOiBcImNsYXNzTmFtZVwiXG5cdH1cbn0gKTtcblxuLy8gU3VwcG9ydDogSUUgPD0xMSBvbmx5XG4vLyBBY2Nlc3NpbmcgdGhlIHNlbGVjdGVkSW5kZXggcHJvcGVydHlcbi8vIGZvcmNlcyB0aGUgYnJvd3NlciB0byByZXNwZWN0IHNldHRpbmcgc2VsZWN0ZWRcbi8vIG9uIHRoZSBvcHRpb25cbi8vIFRoZSBnZXR0ZXIgZW5zdXJlcyBhIGRlZmF1bHQgb3B0aW9uIGlzIHNlbGVjdGVkXG4vLyB3aGVuIGluIGFuIG9wdGdyb3VwXG5pZiAoICFzdXBwb3J0Lm9wdFNlbGVjdGVkICkge1xuXHRqUXVlcnkucHJvcEhvb2tzLnNlbGVjdGVkID0ge1xuXHRcdGdldDogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHR2YXIgcGFyZW50ID0gZWxlbS5wYXJlbnROb2RlO1xuXHRcdFx0aWYgKCBwYXJlbnQgJiYgcGFyZW50LnBhcmVudE5vZGUgKSB7XG5cdFx0XHRcdHBhcmVudC5wYXJlbnROb2RlLnNlbGVjdGVkSW5kZXg7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHR2YXIgcGFyZW50ID0gZWxlbS5wYXJlbnROb2RlO1xuXHRcdFx0aWYgKCBwYXJlbnQgKSB7XG5cdFx0XHRcdHBhcmVudC5zZWxlY3RlZEluZGV4O1xuXG5cdFx0XHRcdGlmICggcGFyZW50LnBhcmVudE5vZGUgKSB7XG5cdFx0XHRcdFx0cGFyZW50LnBhcmVudE5vZGUuc2VsZWN0ZWRJbmRleDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn1cblxualF1ZXJ5LmVhY2goIFtcblx0XCJ0YWJJbmRleFwiLFxuXHRcInJlYWRPbmx5XCIsXG5cdFwibWF4TGVuZ3RoXCIsXG5cdFwiY2VsbFNwYWNpbmdcIixcblx0XCJjZWxsUGFkZGluZ1wiLFxuXHRcInJvd1NwYW5cIixcblx0XCJjb2xTcGFuXCIsXG5cdFwidXNlTWFwXCIsXG5cdFwiZnJhbWVCb3JkZXJcIixcblx0XCJjb250ZW50RWRpdGFibGVcIlxuXSwgZnVuY3Rpb24oKSB7XG5cdGpRdWVyeS5wcm9wRml4WyB0aGlzLnRvTG93ZXJDYXNlKCkgXSA9IHRoaXM7XG59ICk7XG5cblxuXG5cbnZhciByY2xhc3MgPSAvW1xcdFxcclxcblxcZl0vZztcblxuZnVuY3Rpb24gZ2V0Q2xhc3MoIGVsZW0gKSB7XG5cdHJldHVybiBlbGVtLmdldEF0dHJpYnV0ZSAmJiBlbGVtLmdldEF0dHJpYnV0ZSggXCJjbGFzc1wiICkgfHwgXCJcIjtcbn1cblxualF1ZXJ5LmZuLmV4dGVuZCgge1xuXHRhZGRDbGFzczogZnVuY3Rpb24oIHZhbHVlICkge1xuXHRcdHZhciBjbGFzc2VzLCBlbGVtLCBjdXIsIGN1clZhbHVlLCBjbGF6eiwgaiwgZmluYWxWYWx1ZSxcblx0XHRcdGkgPSAwO1xuXG5cdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggdmFsdWUgKSApIHtcblx0XHRcdHJldHVybiB0aGlzLmVhY2goIGZ1bmN0aW9uKCBqICkge1xuXHRcdFx0XHRqUXVlcnkoIHRoaXMgKS5hZGRDbGFzcyggdmFsdWUuY2FsbCggdGhpcywgaiwgZ2V0Q2xhc3MoIHRoaXMgKSApICk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0aWYgKCB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgJiYgdmFsdWUgKSB7XG5cdFx0XHRjbGFzc2VzID0gdmFsdWUubWF0Y2goIHJub3R3aGl0ZSApIHx8IFtdO1xuXG5cdFx0XHR3aGlsZSAoICggZWxlbSA9IHRoaXNbIGkrKyBdICkgKSB7XG5cdFx0XHRcdGN1clZhbHVlID0gZ2V0Q2xhc3MoIGVsZW0gKTtcblx0XHRcdFx0Y3VyID0gZWxlbS5ub2RlVHlwZSA9PT0gMSAmJlxuXHRcdFx0XHRcdCggXCIgXCIgKyBjdXJWYWx1ZSArIFwiIFwiICkucmVwbGFjZSggcmNsYXNzLCBcIiBcIiApO1xuXG5cdFx0XHRcdGlmICggY3VyICkge1xuXHRcdFx0XHRcdGogPSAwO1xuXHRcdFx0XHRcdHdoaWxlICggKCBjbGF6eiA9IGNsYXNzZXNbIGorKyBdICkgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIGN1ci5pbmRleE9mKCBcIiBcIiArIGNsYXp6ICsgXCIgXCIgKSA8IDAgKSB7XG5cdFx0XHRcdFx0XHRcdGN1ciArPSBjbGF6eiArIFwiIFwiO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIE9ubHkgYXNzaWduIGlmIGRpZmZlcmVudCB0byBhdm9pZCB1bm5lZWRlZCByZW5kZXJpbmcuXG5cdFx0XHRcdFx0ZmluYWxWYWx1ZSA9IGpRdWVyeS50cmltKCBjdXIgKTtcblx0XHRcdFx0XHRpZiAoIGN1clZhbHVlICE9PSBmaW5hbFZhbHVlICkge1xuXHRcdFx0XHRcdFx0ZWxlbS5zZXRBdHRyaWJ1dGUoIFwiY2xhc3NcIiwgZmluYWxWYWx1ZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdHJlbW92ZUNsYXNzOiBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFyIGNsYXNzZXMsIGVsZW0sIGN1ciwgY3VyVmFsdWUsIGNsYXp6LCBqLCBmaW5hbFZhbHVlLFxuXHRcdFx0aSA9IDA7XG5cblx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCB2YWx1ZSApICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZWFjaCggZnVuY3Rpb24oIGogKSB7XG5cdFx0XHRcdGpRdWVyeSggdGhpcyApLnJlbW92ZUNsYXNzKCB2YWx1ZS5jYWxsKCB0aGlzLCBqLCBnZXRDbGFzcyggdGhpcyApICkgKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpZiAoICFhcmd1bWVudHMubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuYXR0ciggXCJjbGFzc1wiLCBcIlwiICk7XG5cdFx0fVxuXG5cdFx0aWYgKCB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgJiYgdmFsdWUgKSB7XG5cdFx0XHRjbGFzc2VzID0gdmFsdWUubWF0Y2goIHJub3R3aGl0ZSApIHx8IFtdO1xuXG5cdFx0XHR3aGlsZSAoICggZWxlbSA9IHRoaXNbIGkrKyBdICkgKSB7XG5cdFx0XHRcdGN1clZhbHVlID0gZ2V0Q2xhc3MoIGVsZW0gKTtcblxuXHRcdFx0XHQvLyBUaGlzIGV4cHJlc3Npb24gaXMgaGVyZSBmb3IgYmV0dGVyIGNvbXByZXNzaWJpbGl0eSAoc2VlIGFkZENsYXNzKVxuXHRcdFx0XHRjdXIgPSBlbGVtLm5vZGVUeXBlID09PSAxICYmXG5cdFx0XHRcdFx0KCBcIiBcIiArIGN1clZhbHVlICsgXCIgXCIgKS5yZXBsYWNlKCByY2xhc3MsIFwiIFwiICk7XG5cblx0XHRcdFx0aWYgKCBjdXIgKSB7XG5cdFx0XHRcdFx0aiA9IDA7XG5cdFx0XHRcdFx0d2hpbGUgKCAoIGNsYXp6ID0gY2xhc3Nlc1sgaisrIF0gKSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gUmVtb3ZlICphbGwqIGluc3RhbmNlc1xuXHRcdFx0XHRcdFx0d2hpbGUgKCBjdXIuaW5kZXhPZiggXCIgXCIgKyBjbGF6eiArIFwiIFwiICkgPiAtMSApIHtcblx0XHRcdFx0XHRcdFx0Y3VyID0gY3VyLnJlcGxhY2UoIFwiIFwiICsgY2xhenogKyBcIiBcIiwgXCIgXCIgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBPbmx5IGFzc2lnbiBpZiBkaWZmZXJlbnQgdG8gYXZvaWQgdW5uZWVkZWQgcmVuZGVyaW5nLlxuXHRcdFx0XHRcdGZpbmFsVmFsdWUgPSBqUXVlcnkudHJpbSggY3VyICk7XG5cdFx0XHRcdFx0aWYgKCBjdXJWYWx1ZSAhPT0gZmluYWxWYWx1ZSApIHtcblx0XHRcdFx0XHRcdGVsZW0uc2V0QXR0cmlidXRlKCBcImNsYXNzXCIsIGZpbmFsVmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHR0b2dnbGVDbGFzczogZnVuY3Rpb24oIHZhbHVlLCBzdGF0ZVZhbCApIHtcblx0XHR2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcblxuXHRcdGlmICggdHlwZW9mIHN0YXRlVmFsID09PSBcImJvb2xlYW5cIiAmJiB0eXBlID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0cmV0dXJuIHN0YXRlVmFsID8gdGhpcy5hZGRDbGFzcyggdmFsdWUgKSA6IHRoaXMucmVtb3ZlQ2xhc3MoIHZhbHVlICk7XG5cdFx0fVxuXG5cdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggdmFsdWUgKSApIHtcblx0XHRcdHJldHVybiB0aGlzLmVhY2goIGZ1bmN0aW9uKCBpICkge1xuXHRcdFx0XHRqUXVlcnkoIHRoaXMgKS50b2dnbGVDbGFzcyhcblx0XHRcdFx0XHR2YWx1ZS5jYWxsKCB0aGlzLCBpLCBnZXRDbGFzcyggdGhpcyApLCBzdGF0ZVZhbCApLFxuXHRcdFx0XHRcdHN0YXRlVmFsXG5cdFx0XHRcdCk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgY2xhc3NOYW1lLCBpLCBzZWxmLCBjbGFzc05hbWVzO1xuXG5cdFx0XHRpZiAoIHR5cGUgPT09IFwic3RyaW5nXCIgKSB7XG5cblx0XHRcdFx0Ly8gVG9nZ2xlIGluZGl2aWR1YWwgY2xhc3MgbmFtZXNcblx0XHRcdFx0aSA9IDA7XG5cdFx0XHRcdHNlbGYgPSBqUXVlcnkoIHRoaXMgKTtcblx0XHRcdFx0Y2xhc3NOYW1lcyA9IHZhbHVlLm1hdGNoKCBybm90d2hpdGUgKSB8fCBbXTtcblxuXHRcdFx0XHR3aGlsZSAoICggY2xhc3NOYW1lID0gY2xhc3NOYW1lc1sgaSsrIF0gKSApIHtcblxuXHRcdFx0XHRcdC8vIENoZWNrIGVhY2ggY2xhc3NOYW1lIGdpdmVuLCBzcGFjZSBzZXBhcmF0ZWQgbGlzdFxuXHRcdFx0XHRcdGlmICggc2VsZi5oYXNDbGFzcyggY2xhc3NOYW1lICkgKSB7XG5cdFx0XHRcdFx0XHRzZWxmLnJlbW92ZUNsYXNzKCBjbGFzc05hbWUgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c2VsZi5hZGRDbGFzcyggY2xhc3NOYW1lICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdC8vIFRvZ2dsZSB3aG9sZSBjbGFzcyBuYW1lXG5cdFx0XHR9IGVsc2UgaWYgKCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHR5cGUgPT09IFwiYm9vbGVhblwiICkge1xuXHRcdFx0XHRjbGFzc05hbWUgPSBnZXRDbGFzcyggdGhpcyApO1xuXHRcdFx0XHRpZiAoIGNsYXNzTmFtZSApIHtcblxuXHRcdFx0XHRcdC8vIFN0b3JlIGNsYXNzTmFtZSBpZiBzZXRcblx0XHRcdFx0XHRkYXRhUHJpdi5zZXQoIHRoaXMsIFwiX19jbGFzc05hbWVfX1wiLCBjbGFzc05hbWUgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIElmIHRoZSBlbGVtZW50IGhhcyBhIGNsYXNzIG5hbWUgb3IgaWYgd2UncmUgcGFzc2VkIGBmYWxzZWAsXG5cdFx0XHRcdC8vIHRoZW4gcmVtb3ZlIHRoZSB3aG9sZSBjbGFzc25hbWUgKGlmIHRoZXJlIHdhcyBvbmUsIHRoZSBhYm92ZSBzYXZlZCBpdCkuXG5cdFx0XHRcdC8vIE90aGVyd2lzZSBicmluZyBiYWNrIHdoYXRldmVyIHdhcyBwcmV2aW91c2x5IHNhdmVkIChpZiBhbnl0aGluZyksXG5cdFx0XHRcdC8vIGZhbGxpbmcgYmFjayB0byB0aGUgZW1wdHkgc3RyaW5nIGlmIG5vdGhpbmcgd2FzIHN0b3JlZC5cblx0XHRcdFx0aWYgKCB0aGlzLnNldEF0dHJpYnV0ZSApIHtcblx0XHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggXCJjbGFzc1wiLFxuXHRcdFx0XHRcdFx0Y2xhc3NOYW1lIHx8IHZhbHVlID09PSBmYWxzZSA/XG5cdFx0XHRcdFx0XHRcIlwiIDpcblx0XHRcdFx0XHRcdGRhdGFQcml2LmdldCggdGhpcywgXCJfX2NsYXNzTmFtZV9fXCIgKSB8fCBcIlwiXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gKTtcblx0fSxcblxuXHRoYXNDbGFzczogZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXHRcdHZhciBjbGFzc05hbWUsIGVsZW0sXG5cdFx0XHRpID0gMDtcblxuXHRcdGNsYXNzTmFtZSA9IFwiIFwiICsgc2VsZWN0b3IgKyBcIiBcIjtcblx0XHR3aGlsZSAoICggZWxlbSA9IHRoaXNbIGkrKyBdICkgKSB7XG5cdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgJiZcblx0XHRcdFx0KCBcIiBcIiArIGdldENsYXNzKCBlbGVtICkgKyBcIiBcIiApLnJlcGxhY2UoIHJjbGFzcywgXCIgXCIgKVxuXHRcdFx0XHRcdC5pbmRleE9mKCBjbGFzc05hbWUgKSA+IC0xXG5cdFx0XHQpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59ICk7XG5cblxuXG5cbnZhciBycmV0dXJuID0gL1xcci9nLFxuXHRyc3BhY2VzID0gL1tcXHgyMFxcdFxcclxcblxcZl0rL2c7XG5cbmpRdWVyeS5mbi5leHRlbmQoIHtcblx0dmFsOiBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFyIGhvb2tzLCByZXQsIGlzRnVuY3Rpb24sXG5cdFx0XHRlbGVtID0gdGhpc1sgMCBdO1xuXG5cdFx0aWYgKCAhYXJndW1lbnRzLmxlbmd0aCApIHtcblx0XHRcdGlmICggZWxlbSApIHtcblx0XHRcdFx0aG9va3MgPSBqUXVlcnkudmFsSG9va3NbIGVsZW0udHlwZSBdIHx8XG5cdFx0XHRcdFx0alF1ZXJ5LnZhbEhvb2tzWyBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgXTtcblxuXHRcdFx0XHRpZiAoIGhvb2tzICYmXG5cdFx0XHRcdFx0XCJnZXRcIiBpbiBob29rcyAmJlxuXHRcdFx0XHRcdCggcmV0ID0gaG9va3MuZ2V0KCBlbGVtLCBcInZhbHVlXCIgKSApICE9PSB1bmRlZmluZWRcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJldDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldCA9IGVsZW0udmFsdWU7XG5cblx0XHRcdFx0cmV0dXJuIHR5cGVvZiByZXQgPT09IFwic3RyaW5nXCIgP1xuXG5cdFx0XHRcdFx0Ly8gSGFuZGxlIG1vc3QgY29tbW9uIHN0cmluZyBjYXNlc1xuXHRcdFx0XHRcdHJldC5yZXBsYWNlKCBycmV0dXJuLCBcIlwiICkgOlxuXG5cdFx0XHRcdFx0Ly8gSGFuZGxlIGNhc2VzIHdoZXJlIHZhbHVlIGlzIG51bGwvdW5kZWYgb3IgbnVtYmVyXG5cdFx0XHRcdFx0cmV0ID09IG51bGwgPyBcIlwiIDogcmV0O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aXNGdW5jdGlvbiA9IGpRdWVyeS5pc0Z1bmN0aW9uKCB2YWx1ZSApO1xuXG5cdFx0cmV0dXJuIHRoaXMuZWFjaCggZnVuY3Rpb24oIGkgKSB7XG5cdFx0XHR2YXIgdmFsO1xuXG5cdFx0XHRpZiAoIHRoaXMubm9kZVR5cGUgIT09IDEgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBpc0Z1bmN0aW9uICkge1xuXHRcdFx0XHR2YWwgPSB2YWx1ZS5jYWxsKCB0aGlzLCBpLCBqUXVlcnkoIHRoaXMgKS52YWwoKSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFsID0gdmFsdWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRyZWF0IG51bGwvdW5kZWZpbmVkIGFzIFwiXCI7IGNvbnZlcnQgbnVtYmVycyB0byBzdHJpbmdcblx0XHRcdGlmICggdmFsID09IG51bGwgKSB7XG5cdFx0XHRcdHZhbCA9IFwiXCI7XG5cblx0XHRcdH0gZWxzZSBpZiAoIHR5cGVvZiB2YWwgPT09IFwibnVtYmVyXCIgKSB7XG5cdFx0XHRcdHZhbCArPSBcIlwiO1xuXG5cdFx0XHR9IGVsc2UgaWYgKCBqUXVlcnkuaXNBcnJheSggdmFsICkgKSB7XG5cdFx0XHRcdHZhbCA9IGpRdWVyeS5tYXAoIHZhbCwgZnVuY3Rpb24oIHZhbHVlICkge1xuXHRcdFx0XHRcdHJldHVybiB2YWx1ZSA9PSBudWxsID8gXCJcIiA6IHZhbHVlICsgXCJcIjtcblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXG5cdFx0XHRob29rcyA9IGpRdWVyeS52YWxIb29rc1sgdGhpcy50eXBlIF0gfHwgalF1ZXJ5LnZhbEhvb2tzWyB0aGlzLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgXTtcblxuXHRcdFx0Ly8gSWYgc2V0IHJldHVybnMgdW5kZWZpbmVkLCBmYWxsIGJhY2sgdG8gbm9ybWFsIHNldHRpbmdcblx0XHRcdGlmICggIWhvb2tzIHx8ICEoIFwic2V0XCIgaW4gaG9va3MgKSB8fCBob29rcy5zZXQoIHRoaXMsIHZhbCwgXCJ2YWx1ZVwiICkgPT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cbn0gKTtcblxualF1ZXJ5LmV4dGVuZCgge1xuXHR2YWxIb29rczoge1xuXHRcdG9wdGlvbjoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbiggZWxlbSApIHtcblxuXHRcdFx0XHR2YXIgdmFsID0galF1ZXJ5LmZpbmQuYXR0ciggZWxlbSwgXCJ2YWx1ZVwiICk7XG5cdFx0XHRcdHJldHVybiB2YWwgIT0gbnVsbCA/XG5cdFx0XHRcdFx0dmFsIDpcblxuXHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFMTAtMTErXG5cdFx0XHRcdFx0Ly8gb3B0aW9uLnRleHQgdGhyb3dzIGV4Y2VwdGlvbnMgKCMxNDY4NiwgIzE0ODU4KVxuXHRcdFx0XHRcdC8vIFN0cmlwIGFuZCBjb2xsYXBzZSB3aGl0ZXNwYWNlXG5cdFx0XHRcdFx0Ly8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy8jc3RyaXAtYW5kLWNvbGxhcHNlLXdoaXRlc3BhY2Vcblx0XHRcdFx0XHRqUXVlcnkudHJpbSggalF1ZXJ5LnRleHQoIGVsZW0gKSApLnJlcGxhY2UoIHJzcGFjZXMsIFwiIFwiICk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRzZWxlY3Q6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHZhciB2YWx1ZSwgb3B0aW9uLFxuXHRcdFx0XHRcdG9wdGlvbnMgPSBlbGVtLm9wdGlvbnMsXG5cdFx0XHRcdFx0aW5kZXggPSBlbGVtLnNlbGVjdGVkSW5kZXgsXG5cdFx0XHRcdFx0b25lID0gZWxlbS50eXBlID09PSBcInNlbGVjdC1vbmVcIiB8fCBpbmRleCA8IDAsXG5cdFx0XHRcdFx0dmFsdWVzID0gb25lID8gbnVsbCA6IFtdLFxuXHRcdFx0XHRcdG1heCA9IG9uZSA/IGluZGV4ICsgMSA6IG9wdGlvbnMubGVuZ3RoLFxuXHRcdFx0XHRcdGkgPSBpbmRleCA8IDAgP1xuXHRcdFx0XHRcdFx0bWF4IDpcblx0XHRcdFx0XHRcdG9uZSA/IGluZGV4IDogMDtcblxuXHRcdFx0XHQvLyBMb29wIHRocm91Z2ggYWxsIHRoZSBzZWxlY3RlZCBvcHRpb25zXG5cdFx0XHRcdGZvciAoIDsgaSA8IG1heDsgaSsrICkge1xuXHRcdFx0XHRcdG9wdGlvbiA9IG9wdGlvbnNbIGkgXTtcblxuXHRcdFx0XHRcdC8vIElFOC05IGRvZXNuJ3QgdXBkYXRlIHNlbGVjdGVkIGFmdGVyIGZvcm0gcmVzZXQgKCMyNTUxKVxuXHRcdFx0XHRcdGlmICggKCBvcHRpb24uc2VsZWN0ZWQgfHwgaSA9PT0gaW5kZXggKSAmJlxuXG5cdFx0XHRcdFx0XHRcdC8vIERvbid0IHJldHVybiBvcHRpb25zIHRoYXQgYXJlIGRpc2FibGVkIG9yIGluIGEgZGlzYWJsZWQgb3B0Z3JvdXBcblx0XHRcdFx0XHRcdFx0KCBzdXBwb3J0Lm9wdERpc2FibGVkID9cblx0XHRcdFx0XHRcdFx0XHQhb3B0aW9uLmRpc2FibGVkIDogb3B0aW9uLmdldEF0dHJpYnV0ZSggXCJkaXNhYmxlZFwiICkgPT09IG51bGwgKSAmJlxuXHRcdFx0XHRcdFx0XHQoICFvcHRpb24ucGFyZW50Tm9kZS5kaXNhYmxlZCB8fFxuXHRcdFx0XHRcdFx0XHRcdCFqUXVlcnkubm9kZU5hbWUoIG9wdGlvbi5wYXJlbnROb2RlLCBcIm9wdGdyb3VwXCIgKSApICkge1xuXG5cdFx0XHRcdFx0XHQvLyBHZXQgdGhlIHNwZWNpZmljIHZhbHVlIGZvciB0aGUgb3B0aW9uXG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGpRdWVyeSggb3B0aW9uICkudmFsKCk7XG5cblx0XHRcdFx0XHRcdC8vIFdlIGRvbid0IG5lZWQgYW4gYXJyYXkgZm9yIG9uZSBzZWxlY3RzXG5cdFx0XHRcdFx0XHRpZiAoIG9uZSApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBNdWx0aS1TZWxlY3RzIHJldHVybiBhbiBhcnJheVxuXHRcdFx0XHRcdFx0dmFsdWVzLnB1c2goIHZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHZhbHVlcztcblx0XHRcdH0sXG5cblx0XHRcdHNldDogZnVuY3Rpb24oIGVsZW0sIHZhbHVlICkge1xuXHRcdFx0XHR2YXIgb3B0aW9uU2V0LCBvcHRpb24sXG5cdFx0XHRcdFx0b3B0aW9ucyA9IGVsZW0ub3B0aW9ucyxcblx0XHRcdFx0XHR2YWx1ZXMgPSBqUXVlcnkubWFrZUFycmF5KCB2YWx1ZSApLFxuXHRcdFx0XHRcdGkgPSBvcHRpb25zLmxlbmd0aDtcblxuXHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRvcHRpb24gPSBvcHRpb25zWyBpIF07XG5cdFx0XHRcdFx0aWYgKCBvcHRpb24uc2VsZWN0ZWQgPVxuXHRcdFx0XHRcdFx0alF1ZXJ5LmluQXJyYXkoIGpRdWVyeS52YWxIb29rcy5vcHRpb24uZ2V0KCBvcHRpb24gKSwgdmFsdWVzICkgPiAtMVxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0b3B0aW9uU2V0ID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBGb3JjZSBicm93c2VycyB0byBiZWhhdmUgY29uc2lzdGVudGx5IHdoZW4gbm9uLW1hdGNoaW5nIHZhbHVlIGlzIHNldFxuXHRcdFx0XHRpZiAoICFvcHRpb25TZXQgKSB7XG5cdFx0XHRcdFx0ZWxlbS5zZWxlY3RlZEluZGV4ID0gLTE7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHZhbHVlcztcblx0XHRcdH1cblx0XHR9XG5cdH1cbn0gKTtcblxuLy8gUmFkaW9zIGFuZCBjaGVja2JveGVzIGdldHRlci9zZXR0ZXJcbmpRdWVyeS5lYWNoKCBbIFwicmFkaW9cIiwgXCJjaGVja2JveFwiIF0sIGZ1bmN0aW9uKCkge1xuXHRqUXVlcnkudmFsSG9va3NbIHRoaXMgXSA9IHtcblx0XHRzZXQ6IGZ1bmN0aW9uKCBlbGVtLCB2YWx1ZSApIHtcblx0XHRcdGlmICggalF1ZXJ5LmlzQXJyYXkoIHZhbHVlICkgKSB7XG5cdFx0XHRcdHJldHVybiAoIGVsZW0uY2hlY2tlZCA9IGpRdWVyeS5pbkFycmF5KCBqUXVlcnkoIGVsZW0gKS52YWwoKSwgdmFsdWUgKSA+IC0xICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRpZiAoICFzdXBwb3J0LmNoZWNrT24gKSB7XG5cdFx0alF1ZXJ5LnZhbEhvb2tzWyB0aGlzIF0uZ2V0ID0gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5nZXRBdHRyaWJ1dGUoIFwidmFsdWVcIiApID09PSBudWxsID8gXCJvblwiIDogZWxlbS52YWx1ZTtcblx0XHR9O1xuXHR9XG59ICk7XG5cblxuXG5cbi8vIFJldHVybiBqUXVlcnkgZm9yIGF0dHJpYnV0ZXMtb25seSBpbmNsdXNpb25cblxuXG52YXIgcmZvY3VzTW9ycGggPSAvXig/OmZvY3VzaW5mb2N1c3xmb2N1c291dGJsdXIpJC87XG5cbmpRdWVyeS5leHRlbmQoIGpRdWVyeS5ldmVudCwge1xuXG5cdHRyaWdnZXI6IGZ1bmN0aW9uKCBldmVudCwgZGF0YSwgZWxlbSwgb25seUhhbmRsZXJzICkge1xuXG5cdFx0dmFyIGksIGN1ciwgdG1wLCBidWJibGVUeXBlLCBvbnR5cGUsIGhhbmRsZSwgc3BlY2lhbCxcblx0XHRcdGV2ZW50UGF0aCA9IFsgZWxlbSB8fCBkb2N1bWVudCBdLFxuXHRcdFx0dHlwZSA9IGhhc093bi5jYWxsKCBldmVudCwgXCJ0eXBlXCIgKSA/IGV2ZW50LnR5cGUgOiBldmVudCxcblx0XHRcdG5hbWVzcGFjZXMgPSBoYXNPd24uY2FsbCggZXZlbnQsIFwibmFtZXNwYWNlXCIgKSA/IGV2ZW50Lm5hbWVzcGFjZS5zcGxpdCggXCIuXCIgKSA6IFtdO1xuXG5cdFx0Y3VyID0gdG1wID0gZWxlbSA9IGVsZW0gfHwgZG9jdW1lbnQ7XG5cblx0XHQvLyBEb24ndCBkbyBldmVudHMgb24gdGV4dCBhbmQgY29tbWVudCBub2Rlc1xuXHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMyB8fCBlbGVtLm5vZGVUeXBlID09PSA4ICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIGZvY3VzL2JsdXIgbW9ycGhzIHRvIGZvY3VzaW4vb3V0OyBlbnN1cmUgd2UncmUgbm90IGZpcmluZyB0aGVtIHJpZ2h0IG5vd1xuXHRcdGlmICggcmZvY3VzTW9ycGgudGVzdCggdHlwZSArIGpRdWVyeS5ldmVudC50cmlnZ2VyZWQgKSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGUuaW5kZXhPZiggXCIuXCIgKSA+IC0xICkge1xuXG5cdFx0XHQvLyBOYW1lc3BhY2VkIHRyaWdnZXI7IGNyZWF0ZSBhIHJlZ2V4cCB0byBtYXRjaCBldmVudCB0eXBlIGluIGhhbmRsZSgpXG5cdFx0XHRuYW1lc3BhY2VzID0gdHlwZS5zcGxpdCggXCIuXCIgKTtcblx0XHRcdHR5cGUgPSBuYW1lc3BhY2VzLnNoaWZ0KCk7XG5cdFx0XHRuYW1lc3BhY2VzLnNvcnQoKTtcblx0XHR9XG5cdFx0b250eXBlID0gdHlwZS5pbmRleE9mKCBcIjpcIiApIDwgMCAmJiBcIm9uXCIgKyB0eXBlO1xuXG5cdFx0Ly8gQ2FsbGVyIGNhbiBwYXNzIGluIGEgalF1ZXJ5LkV2ZW50IG9iamVjdCwgT2JqZWN0LCBvciBqdXN0IGFuIGV2ZW50IHR5cGUgc3RyaW5nXG5cdFx0ZXZlbnQgPSBldmVudFsgalF1ZXJ5LmV4cGFuZG8gXSA/XG5cdFx0XHRldmVudCA6XG5cdFx0XHRuZXcgalF1ZXJ5LkV2ZW50KCB0eXBlLCB0eXBlb2YgZXZlbnQgPT09IFwib2JqZWN0XCIgJiYgZXZlbnQgKTtcblxuXHRcdC8vIFRyaWdnZXIgYml0bWFzazogJiAxIGZvciBuYXRpdmUgaGFuZGxlcnM7ICYgMiBmb3IgalF1ZXJ5IChhbHdheXMgdHJ1ZSlcblx0XHRldmVudC5pc1RyaWdnZXIgPSBvbmx5SGFuZGxlcnMgPyAyIDogMztcblx0XHRldmVudC5uYW1lc3BhY2UgPSBuYW1lc3BhY2VzLmpvaW4oIFwiLlwiICk7XG5cdFx0ZXZlbnQucm5hbWVzcGFjZSA9IGV2ZW50Lm5hbWVzcGFjZSA/XG5cdFx0XHRuZXcgUmVnRXhwKCBcIihefFxcXFwuKVwiICsgbmFtZXNwYWNlcy5qb2luKCBcIlxcXFwuKD86LipcXFxcLnwpXCIgKSArIFwiKFxcXFwufCQpXCIgKSA6XG5cdFx0XHRudWxsO1xuXG5cdFx0Ly8gQ2xlYW4gdXAgdGhlIGV2ZW50IGluIGNhc2UgaXQgaXMgYmVpbmcgcmV1c2VkXG5cdFx0ZXZlbnQucmVzdWx0ID0gdW5kZWZpbmVkO1xuXHRcdGlmICggIWV2ZW50LnRhcmdldCApIHtcblx0XHRcdGV2ZW50LnRhcmdldCA9IGVsZW07XG5cdFx0fVxuXG5cdFx0Ly8gQ2xvbmUgYW55IGluY29taW5nIGRhdGEgYW5kIHByZXBlbmQgdGhlIGV2ZW50LCBjcmVhdGluZyB0aGUgaGFuZGxlciBhcmcgbGlzdFxuXHRcdGRhdGEgPSBkYXRhID09IG51bGwgP1xuXHRcdFx0WyBldmVudCBdIDpcblx0XHRcdGpRdWVyeS5tYWtlQXJyYXkoIGRhdGEsIFsgZXZlbnQgXSApO1xuXG5cdFx0Ly8gQWxsb3cgc3BlY2lhbCBldmVudHMgdG8gZHJhdyBvdXRzaWRlIHRoZSBsaW5lc1xuXHRcdHNwZWNpYWwgPSBqUXVlcnkuZXZlbnQuc3BlY2lhbFsgdHlwZSBdIHx8IHt9O1xuXHRcdGlmICggIW9ubHlIYW5kbGVycyAmJiBzcGVjaWFsLnRyaWdnZXIgJiYgc3BlY2lhbC50cmlnZ2VyLmFwcGx5KCBlbGVtLCBkYXRhICkgPT09IGZhbHNlICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIERldGVybWluZSBldmVudCBwcm9wYWdhdGlvbiBwYXRoIGluIGFkdmFuY2UsIHBlciBXM0MgZXZlbnRzIHNwZWMgKCM5OTUxKVxuXHRcdC8vIEJ1YmJsZSB1cCB0byBkb2N1bWVudCwgdGhlbiB0byB3aW5kb3c7IHdhdGNoIGZvciBhIGdsb2JhbCBvd25lckRvY3VtZW50IHZhciAoIzk3MjQpXG5cdFx0aWYgKCAhb25seUhhbmRsZXJzICYmICFzcGVjaWFsLm5vQnViYmxlICYmICFqUXVlcnkuaXNXaW5kb3coIGVsZW0gKSApIHtcblxuXHRcdFx0YnViYmxlVHlwZSA9IHNwZWNpYWwuZGVsZWdhdGVUeXBlIHx8IHR5cGU7XG5cdFx0XHRpZiAoICFyZm9jdXNNb3JwaC50ZXN0KCBidWJibGVUeXBlICsgdHlwZSApICkge1xuXHRcdFx0XHRjdXIgPSBjdXIucGFyZW50Tm9kZTtcblx0XHRcdH1cblx0XHRcdGZvciAoIDsgY3VyOyBjdXIgPSBjdXIucGFyZW50Tm9kZSApIHtcblx0XHRcdFx0ZXZlbnRQYXRoLnB1c2goIGN1ciApO1xuXHRcdFx0XHR0bXAgPSBjdXI7XG5cdFx0XHR9XG5cblx0XHRcdC8vIE9ubHkgYWRkIHdpbmRvdyBpZiB3ZSBnb3QgdG8gZG9jdW1lbnQgKGUuZy4sIG5vdCBwbGFpbiBvYmogb3IgZGV0YWNoZWQgRE9NKVxuXHRcdFx0aWYgKCB0bXAgPT09ICggZWxlbS5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50ICkgKSB7XG5cdFx0XHRcdGV2ZW50UGF0aC5wdXNoKCB0bXAuZGVmYXVsdFZpZXcgfHwgdG1wLnBhcmVudFdpbmRvdyB8fCB3aW5kb3cgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBGaXJlIGhhbmRsZXJzIG9uIHRoZSBldmVudCBwYXRoXG5cdFx0aSA9IDA7XG5cdFx0d2hpbGUgKCAoIGN1ciA9IGV2ZW50UGF0aFsgaSsrIF0gKSAmJiAhZXZlbnQuaXNQcm9wYWdhdGlvblN0b3BwZWQoKSApIHtcblxuXHRcdFx0ZXZlbnQudHlwZSA9IGkgPiAxID9cblx0XHRcdFx0YnViYmxlVHlwZSA6XG5cdFx0XHRcdHNwZWNpYWwuYmluZFR5cGUgfHwgdHlwZTtcblxuXHRcdFx0Ly8galF1ZXJ5IGhhbmRsZXJcblx0XHRcdGhhbmRsZSA9ICggZGF0YVByaXYuZ2V0KCBjdXIsIFwiZXZlbnRzXCIgKSB8fCB7fSApWyBldmVudC50eXBlIF0gJiZcblx0XHRcdFx0ZGF0YVByaXYuZ2V0KCBjdXIsIFwiaGFuZGxlXCIgKTtcblx0XHRcdGlmICggaGFuZGxlICkge1xuXHRcdFx0XHRoYW5kbGUuYXBwbHkoIGN1ciwgZGF0YSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBOYXRpdmUgaGFuZGxlclxuXHRcdFx0aGFuZGxlID0gb250eXBlICYmIGN1clsgb250eXBlIF07XG5cdFx0XHRpZiAoIGhhbmRsZSAmJiBoYW5kbGUuYXBwbHkgJiYgYWNjZXB0RGF0YSggY3VyICkgKSB7XG5cdFx0XHRcdGV2ZW50LnJlc3VsdCA9IGhhbmRsZS5hcHBseSggY3VyLCBkYXRhICk7XG5cdFx0XHRcdGlmICggZXZlbnQucmVzdWx0ID09PSBmYWxzZSApIHtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGV2ZW50LnR5cGUgPSB0eXBlO1xuXG5cdFx0Ly8gSWYgbm9ib2R5IHByZXZlbnRlZCB0aGUgZGVmYXVsdCBhY3Rpb24sIGRvIGl0IG5vd1xuXHRcdGlmICggIW9ubHlIYW5kbGVycyAmJiAhZXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkgKSB7XG5cblx0XHRcdGlmICggKCAhc3BlY2lhbC5fZGVmYXVsdCB8fFxuXHRcdFx0XHRzcGVjaWFsLl9kZWZhdWx0LmFwcGx5KCBldmVudFBhdGgucG9wKCksIGRhdGEgKSA9PT0gZmFsc2UgKSAmJlxuXHRcdFx0XHRhY2NlcHREYXRhKCBlbGVtICkgKSB7XG5cblx0XHRcdFx0Ly8gQ2FsbCBhIG5hdGl2ZSBET00gbWV0aG9kIG9uIHRoZSB0YXJnZXQgd2l0aCB0aGUgc2FtZSBuYW1lIG5hbWUgYXMgdGhlIGV2ZW50LlxuXHRcdFx0XHQvLyBEb24ndCBkbyBkZWZhdWx0IGFjdGlvbnMgb24gd2luZG93LCB0aGF0J3Mgd2hlcmUgZ2xvYmFsIHZhcmlhYmxlcyBiZSAoIzYxNzApXG5cdFx0XHRcdGlmICggb250eXBlICYmIGpRdWVyeS5pc0Z1bmN0aW9uKCBlbGVtWyB0eXBlIF0gKSAmJiAhalF1ZXJ5LmlzV2luZG93KCBlbGVtICkgKSB7XG5cblx0XHRcdFx0XHQvLyBEb24ndCByZS10cmlnZ2VyIGFuIG9uRk9PIGV2ZW50IHdoZW4gd2UgY2FsbCBpdHMgRk9PKCkgbWV0aG9kXG5cdFx0XHRcdFx0dG1wID0gZWxlbVsgb250eXBlIF07XG5cblx0XHRcdFx0XHRpZiAoIHRtcCApIHtcblx0XHRcdFx0XHRcdGVsZW1bIG9udHlwZSBdID0gbnVsbDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBQcmV2ZW50IHJlLXRyaWdnZXJpbmcgb2YgdGhlIHNhbWUgZXZlbnQsIHNpbmNlIHdlIGFscmVhZHkgYnViYmxlZCBpdCBhYm92ZVxuXHRcdFx0XHRcdGpRdWVyeS5ldmVudC50cmlnZ2VyZWQgPSB0eXBlO1xuXHRcdFx0XHRcdGVsZW1bIHR5cGUgXSgpO1xuXHRcdFx0XHRcdGpRdWVyeS5ldmVudC50cmlnZ2VyZWQgPSB1bmRlZmluZWQ7XG5cblx0XHRcdFx0XHRpZiAoIHRtcCApIHtcblx0XHRcdFx0XHRcdGVsZW1bIG9udHlwZSBdID0gdG1wO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBldmVudC5yZXN1bHQ7XG5cdH0sXG5cblx0Ly8gUGlnZ3liYWNrIG9uIGEgZG9ub3IgZXZlbnQgdG8gc2ltdWxhdGUgYSBkaWZmZXJlbnQgb25lXG5cdHNpbXVsYXRlOiBmdW5jdGlvbiggdHlwZSwgZWxlbSwgZXZlbnQgKSB7XG5cdFx0dmFyIGUgPSBqUXVlcnkuZXh0ZW5kKFxuXHRcdFx0bmV3IGpRdWVyeS5FdmVudCgpLFxuXHRcdFx0ZXZlbnQsXG5cdFx0XHR7XG5cdFx0XHRcdHR5cGU6IHR5cGUsXG5cdFx0XHRcdGlzU2ltdWxhdGVkOiB0cnVlXG5cblx0XHRcdFx0Ly8gUHJldmlvdXNseSwgYG9yaWdpbmFsRXZlbnQ6IHt9YCB3YXMgc2V0IGhlcmUsIHNvIHN0b3BQcm9wYWdhdGlvbiBjYWxsXG5cdFx0XHRcdC8vIHdvdWxkIG5vdCBiZSB0cmlnZ2VyZWQgb24gZG9ub3IgZXZlbnQsIHNpbmNlIGluIG91ciBvd25cblx0XHRcdFx0Ly8galF1ZXJ5LmV2ZW50LnN0b3BQcm9wYWdhdGlvbiBmdW5jdGlvbiB3ZSBoYWQgYSBjaGVjayBmb3IgZXhpc3RlbmNlIG9mXG5cdFx0XHRcdC8vIG9yaWdpbmFsRXZlbnQuc3RvcFByb3BhZ2F0aW9uIG1ldGhvZCwgc28sIGNvbnNlcXVlbnRseSBpdCB3b3VsZCBiZSBhIG5vb3AuXG5cdFx0XHRcdC8vXG5cdFx0XHRcdC8vIEJ1dCBub3csIHRoaXMgXCJzaW11bGF0ZVwiIGZ1bmN0aW9uIGlzIHVzZWQgb25seSBmb3IgZXZlbnRzXG5cdFx0XHRcdC8vIGZvciB3aGljaCBzdG9wUHJvcGFnYXRpb24oKSBpcyBub29wLCBzbyB0aGVyZSBpcyBubyBuZWVkIGZvciB0aGF0IGFueW1vcmUuXG5cdFx0XHRcdC8vXG5cdFx0XHRcdC8vIEZvciB0aGUgMS54IGJyYW5jaCB0aG91Z2gsIGd1YXJkIGZvciBcImNsaWNrXCIgYW5kIFwic3VibWl0XCJcblx0XHRcdFx0Ly8gZXZlbnRzIGlzIHN0aWxsIHVzZWQsIGJ1dCB3YXMgbW92ZWQgdG8galF1ZXJ5LmV2ZW50LnN0b3BQcm9wYWdhdGlvbiBmdW5jdGlvblxuXHRcdFx0XHQvLyBiZWNhdXNlIGBvcmlnaW5hbEV2ZW50YCBzaG91bGQgcG9pbnQgdG8gdGhlIG9yaWdpbmFsIGV2ZW50IGZvciB0aGUgY29uc3RhbmN5XG5cdFx0XHRcdC8vIHdpdGggb3RoZXIgZXZlbnRzIGFuZCBmb3IgbW9yZSBmb2N1c2VkIGxvZ2ljXG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdGpRdWVyeS5ldmVudC50cmlnZ2VyKCBlLCBudWxsLCBlbGVtICk7XG5cblx0XHRpZiAoIGUuaXNEZWZhdWx0UHJldmVudGVkKCkgKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH1cblx0fVxuXG59ICk7XG5cbmpRdWVyeS5mbi5leHRlbmQoIHtcblxuXHR0cmlnZ2VyOiBmdW5jdGlvbiggdHlwZSwgZGF0YSApIHtcblx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGpRdWVyeS5ldmVudC50cmlnZ2VyKCB0eXBlLCBkYXRhLCB0aGlzICk7XG5cdFx0fSApO1xuXHR9LFxuXHR0cmlnZ2VySGFuZGxlcjogZnVuY3Rpb24oIHR5cGUsIGRhdGEgKSB7XG5cdFx0dmFyIGVsZW0gPSB0aGlzWyAwIF07XG5cdFx0aWYgKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGpRdWVyeS5ldmVudC50cmlnZ2VyKCB0eXBlLCBkYXRhLCBlbGVtLCB0cnVlICk7XG5cdFx0fVxuXHR9XG59ICk7XG5cblxualF1ZXJ5LmVhY2goICggXCJibHVyIGZvY3VzIGZvY3VzaW4gZm9jdXNvdXQgbG9hZCByZXNpemUgc2Nyb2xsIHVubG9hZCBjbGljayBkYmxjbGljayBcIiArXG5cdFwibW91c2Vkb3duIG1vdXNldXAgbW91c2Vtb3ZlIG1vdXNlb3ZlciBtb3VzZW91dCBtb3VzZWVudGVyIG1vdXNlbGVhdmUgXCIgK1xuXHRcImNoYW5nZSBzZWxlY3Qgc3VibWl0IGtleWRvd24ga2V5cHJlc3Mga2V5dXAgZXJyb3IgY29udGV4dG1lbnVcIiApLnNwbGl0KCBcIiBcIiApLFxuXHRmdW5jdGlvbiggaSwgbmFtZSApIHtcblxuXHQvLyBIYW5kbGUgZXZlbnQgYmluZGluZ1xuXHRqUXVlcnkuZm5bIG5hbWUgXSA9IGZ1bmN0aW9uKCBkYXRhLCBmbiApIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA+IDAgP1xuXHRcdFx0dGhpcy5vbiggbmFtZSwgbnVsbCwgZGF0YSwgZm4gKSA6XG5cdFx0XHR0aGlzLnRyaWdnZXIoIG5hbWUgKTtcblx0fTtcbn0gKTtcblxualF1ZXJ5LmZuLmV4dGVuZCgge1xuXHRob3ZlcjogZnVuY3Rpb24oIGZuT3ZlciwgZm5PdXQgKSB7XG5cdFx0cmV0dXJuIHRoaXMubW91c2VlbnRlciggZm5PdmVyICkubW91c2VsZWF2ZSggZm5PdXQgfHwgZm5PdmVyICk7XG5cdH1cbn0gKTtcblxuXG5cblxuc3VwcG9ydC5mb2N1c2luID0gXCJvbmZvY3VzaW5cIiBpbiB3aW5kb3c7XG5cblxuLy8gU3VwcG9ydDogRmlyZWZveFxuLy8gRmlyZWZveCBkb2Vzbid0IGhhdmUgZm9jdXMoaW4gfCBvdXQpIGV2ZW50c1xuLy8gUmVsYXRlZCB0aWNrZXQgLSBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02ODc3ODdcbi8vXG4vLyBTdXBwb3J0OiBDaHJvbWUsIFNhZmFyaVxuLy8gZm9jdXMoaW4gfCBvdXQpIGV2ZW50cyBmaXJlIGFmdGVyIGZvY3VzICYgYmx1ciBldmVudHMsXG4vLyB3aGljaCBpcyBzcGVjIHZpb2xhdGlvbiAtIGh0dHA6Ly93d3cudzMub3JnL1RSL0RPTS1MZXZlbC0zLUV2ZW50cy8jZXZlbnRzLWZvY3VzZXZlbnQtZXZlbnQtb3JkZXJcbi8vIFJlbGF0ZWQgdGlja2V0IC0gaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTQ0OTg1N1xuaWYgKCAhc3VwcG9ydC5mb2N1c2luICkge1xuXHRqUXVlcnkuZWFjaCggeyBmb2N1czogXCJmb2N1c2luXCIsIGJsdXI6IFwiZm9jdXNvdXRcIiB9LCBmdW5jdGlvbiggb3JpZywgZml4ICkge1xuXG5cdFx0Ly8gQXR0YWNoIGEgc2luZ2xlIGNhcHR1cmluZyBoYW5kbGVyIG9uIHRoZSBkb2N1bWVudCB3aGlsZSBzb21lb25lIHdhbnRzIGZvY3VzaW4vZm9jdXNvdXRcblx0XHR2YXIgaGFuZGxlciA9IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGpRdWVyeS5ldmVudC5zaW11bGF0ZSggZml4LCBldmVudC50YXJnZXQsIGpRdWVyeS5ldmVudC5maXgoIGV2ZW50ICkgKTtcblx0XHR9O1xuXG5cdFx0alF1ZXJ5LmV2ZW50LnNwZWNpYWxbIGZpeCBdID0ge1xuXHRcdFx0c2V0dXA6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgZG9jID0gdGhpcy5vd25lckRvY3VtZW50IHx8IHRoaXMsXG5cdFx0XHRcdFx0YXR0YWNoZXMgPSBkYXRhUHJpdi5hY2Nlc3MoIGRvYywgZml4ICk7XG5cblx0XHRcdFx0aWYgKCAhYXR0YWNoZXMgKSB7XG5cdFx0XHRcdFx0ZG9jLmFkZEV2ZW50TGlzdGVuZXIoIG9yaWcsIGhhbmRsZXIsIHRydWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkYXRhUHJpdi5hY2Nlc3MoIGRvYywgZml4LCAoIGF0dGFjaGVzIHx8IDAgKSArIDEgKTtcblx0XHRcdH0sXG5cdFx0XHR0ZWFyZG93bjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBkb2MgPSB0aGlzLm93bmVyRG9jdW1lbnQgfHwgdGhpcyxcblx0XHRcdFx0XHRhdHRhY2hlcyA9IGRhdGFQcml2LmFjY2VzcyggZG9jLCBmaXggKSAtIDE7XG5cblx0XHRcdFx0aWYgKCAhYXR0YWNoZXMgKSB7XG5cdFx0XHRcdFx0ZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIoIG9yaWcsIGhhbmRsZXIsIHRydWUgKTtcblx0XHRcdFx0XHRkYXRhUHJpdi5yZW1vdmUoIGRvYywgZml4ICk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRkYXRhUHJpdi5hY2Nlc3MoIGRvYywgZml4LCBhdHRhY2hlcyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0fSApO1xufVxudmFyIGxvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uO1xuXG52YXIgbm9uY2UgPSBqUXVlcnkubm93KCk7XG5cbnZhciBycXVlcnkgPSAoIC9cXD8vICk7XG5cblxuXG4vLyBTdXBwb3J0OiBBbmRyb2lkIDIuM1xuLy8gV29ya2Fyb3VuZCBmYWlsdXJlIHRvIHN0cmluZy1jYXN0IG51bGwgaW5wdXRcbmpRdWVyeS5wYXJzZUpTT04gPSBmdW5jdGlvbiggZGF0YSApIHtcblx0cmV0dXJuIEpTT04ucGFyc2UoIGRhdGEgKyBcIlwiICk7XG59O1xuXG5cbi8vIENyb3NzLWJyb3dzZXIgeG1sIHBhcnNpbmdcbmpRdWVyeS5wYXJzZVhNTCA9IGZ1bmN0aW9uKCBkYXRhICkge1xuXHR2YXIgeG1sO1xuXHRpZiAoICFkYXRhIHx8IHR5cGVvZiBkYXRhICE9PSBcInN0cmluZ1wiICkge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Ly8gU3VwcG9ydDogSUU5XG5cdHRyeSB7XG5cdFx0eG1sID0gKCBuZXcgd2luZG93LkRPTVBhcnNlcigpICkucGFyc2VGcm9tU3RyaW5nKCBkYXRhLCBcInRleHQveG1sXCIgKTtcblx0fSBjYXRjaCAoIGUgKSB7XG5cdFx0eG1sID0gdW5kZWZpbmVkO1xuXHR9XG5cblx0aWYgKCAheG1sIHx8IHhtbC5nZXRFbGVtZW50c0J5VGFnTmFtZSggXCJwYXJzZXJlcnJvclwiICkubGVuZ3RoICkge1xuXHRcdGpRdWVyeS5lcnJvciggXCJJbnZhbGlkIFhNTDogXCIgKyBkYXRhICk7XG5cdH1cblx0cmV0dXJuIHhtbDtcbn07XG5cblxudmFyXG5cdHJoYXNoID0gLyMuKiQvLFxuXHRydHMgPSAvKFs/Jl0pXz1bXiZdKi8sXG5cdHJoZWFkZXJzID0gL14oLio/KTpbIFxcdF0qKFteXFxyXFxuXSopJC9tZyxcblxuXHQvLyAjNzY1MywgIzgxMjUsICM4MTUyOiBsb2NhbCBwcm90b2NvbCBkZXRlY3Rpb25cblx0cmxvY2FsUHJvdG9jb2wgPSAvXig/OmFib3V0fGFwcHxhcHAtc3RvcmFnZXwuKy1leHRlbnNpb258ZmlsZXxyZXN8d2lkZ2V0KTokLyxcblx0cm5vQ29udGVudCA9IC9eKD86R0VUfEhFQUQpJC8sXG5cdHJwcm90b2NvbCA9IC9eXFwvXFwvLyxcblxuXHQvKiBQcmVmaWx0ZXJzXG5cdCAqIDEpIFRoZXkgYXJlIHVzZWZ1bCB0byBpbnRyb2R1Y2UgY3VzdG9tIGRhdGFUeXBlcyAoc2VlIGFqYXgvanNvbnAuanMgZm9yIGFuIGV4YW1wbGUpXG5cdCAqIDIpIFRoZXNlIGFyZSBjYWxsZWQ6XG5cdCAqICAgIC0gQkVGT1JFIGFza2luZyBmb3IgYSB0cmFuc3BvcnRcblx0ICogICAgLSBBRlRFUiBwYXJhbSBzZXJpYWxpemF0aW9uIChzLmRhdGEgaXMgYSBzdHJpbmcgaWYgcy5wcm9jZXNzRGF0YSBpcyB0cnVlKVxuXHQgKiAzKSBrZXkgaXMgdGhlIGRhdGFUeXBlXG5cdCAqIDQpIHRoZSBjYXRjaGFsbCBzeW1ib2wgXCIqXCIgY2FuIGJlIHVzZWRcblx0ICogNSkgZXhlY3V0aW9uIHdpbGwgc3RhcnQgd2l0aCB0cmFuc3BvcnQgZGF0YVR5cGUgYW5kIFRIRU4gY29udGludWUgZG93biB0byBcIipcIiBpZiBuZWVkZWRcblx0ICovXG5cdHByZWZpbHRlcnMgPSB7fSxcblxuXHQvKiBUcmFuc3BvcnRzIGJpbmRpbmdzXG5cdCAqIDEpIGtleSBpcyB0aGUgZGF0YVR5cGVcblx0ICogMikgdGhlIGNhdGNoYWxsIHN5bWJvbCBcIipcIiBjYW4gYmUgdXNlZFxuXHQgKiAzKSBzZWxlY3Rpb24gd2lsbCBzdGFydCB3aXRoIHRyYW5zcG9ydCBkYXRhVHlwZSBhbmQgVEhFTiBnbyB0byBcIipcIiBpZiBuZWVkZWRcblx0ICovXG5cdHRyYW5zcG9ydHMgPSB7fSxcblxuXHQvLyBBdm9pZCBjb21tZW50LXByb2xvZyBjaGFyIHNlcXVlbmNlICgjMTAwOTgpOyBtdXN0IGFwcGVhc2UgbGludCBhbmQgZXZhZGUgY29tcHJlc3Npb25cblx0YWxsVHlwZXMgPSBcIiovXCIuY29uY2F0KCBcIipcIiApLFxuXG5cdC8vIEFuY2hvciB0YWcgZm9yIHBhcnNpbmcgdGhlIGRvY3VtZW50IG9yaWdpblxuXHRvcmlnaW5BbmNob3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImFcIiApO1xuXHRvcmlnaW5BbmNob3IuaHJlZiA9IGxvY2F0aW9uLmhyZWY7XG5cbi8vIEJhc2UgXCJjb25zdHJ1Y3RvclwiIGZvciBqUXVlcnkuYWpheFByZWZpbHRlciBhbmQgalF1ZXJ5LmFqYXhUcmFuc3BvcnRcbmZ1bmN0aW9uIGFkZFRvUHJlZmlsdGVyc09yVHJhbnNwb3J0cyggc3RydWN0dXJlICkge1xuXG5cdC8vIGRhdGFUeXBlRXhwcmVzc2lvbiBpcyBvcHRpb25hbCBhbmQgZGVmYXVsdHMgdG8gXCIqXCJcblx0cmV0dXJuIGZ1bmN0aW9uKCBkYXRhVHlwZUV4cHJlc3Npb24sIGZ1bmMgKSB7XG5cblx0XHRpZiAoIHR5cGVvZiBkYXRhVHlwZUV4cHJlc3Npb24gIT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRmdW5jID0gZGF0YVR5cGVFeHByZXNzaW9uO1xuXHRcdFx0ZGF0YVR5cGVFeHByZXNzaW9uID0gXCIqXCI7XG5cdFx0fVxuXG5cdFx0dmFyIGRhdGFUeXBlLFxuXHRcdFx0aSA9IDAsXG5cdFx0XHRkYXRhVHlwZXMgPSBkYXRhVHlwZUV4cHJlc3Npb24udG9Mb3dlckNhc2UoKS5tYXRjaCggcm5vdHdoaXRlICkgfHwgW107XG5cblx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBmdW5jICkgKSB7XG5cblx0XHRcdC8vIEZvciBlYWNoIGRhdGFUeXBlIGluIHRoZSBkYXRhVHlwZUV4cHJlc3Npb25cblx0XHRcdHdoaWxlICggKCBkYXRhVHlwZSA9IGRhdGFUeXBlc1sgaSsrIF0gKSApIHtcblxuXHRcdFx0XHQvLyBQcmVwZW5kIGlmIHJlcXVlc3RlZFxuXHRcdFx0XHRpZiAoIGRhdGFUeXBlWyAwIF0gPT09IFwiK1wiICkge1xuXHRcdFx0XHRcdGRhdGFUeXBlID0gZGF0YVR5cGUuc2xpY2UoIDEgKSB8fCBcIipcIjtcblx0XHRcdFx0XHQoIHN0cnVjdHVyZVsgZGF0YVR5cGUgXSA9IHN0cnVjdHVyZVsgZGF0YVR5cGUgXSB8fCBbXSApLnVuc2hpZnQoIGZ1bmMgKTtcblxuXHRcdFx0XHQvLyBPdGhlcndpc2UgYXBwZW5kXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0KCBzdHJ1Y3R1cmVbIGRhdGFUeXBlIF0gPSBzdHJ1Y3R1cmVbIGRhdGFUeXBlIF0gfHwgW10gKS5wdXNoKCBmdW5jICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH07XG59XG5cbi8vIEJhc2UgaW5zcGVjdGlvbiBmdW5jdGlvbiBmb3IgcHJlZmlsdGVycyBhbmQgdHJhbnNwb3J0c1xuZnVuY3Rpb24gaW5zcGVjdFByZWZpbHRlcnNPclRyYW5zcG9ydHMoIHN0cnVjdHVyZSwgb3B0aW9ucywgb3JpZ2luYWxPcHRpb25zLCBqcVhIUiApIHtcblxuXHR2YXIgaW5zcGVjdGVkID0ge30sXG5cdFx0c2Vla2luZ1RyYW5zcG9ydCA9ICggc3RydWN0dXJlID09PSB0cmFuc3BvcnRzICk7XG5cblx0ZnVuY3Rpb24gaW5zcGVjdCggZGF0YVR5cGUgKSB7XG5cdFx0dmFyIHNlbGVjdGVkO1xuXHRcdGluc3BlY3RlZFsgZGF0YVR5cGUgXSA9IHRydWU7XG5cdFx0alF1ZXJ5LmVhY2goIHN0cnVjdHVyZVsgZGF0YVR5cGUgXSB8fCBbXSwgZnVuY3Rpb24oIF8sIHByZWZpbHRlck9yRmFjdG9yeSApIHtcblx0XHRcdHZhciBkYXRhVHlwZU9yVHJhbnNwb3J0ID0gcHJlZmlsdGVyT3JGYWN0b3J5KCBvcHRpb25zLCBvcmlnaW5hbE9wdGlvbnMsIGpxWEhSICk7XG5cdFx0XHRpZiAoIHR5cGVvZiBkYXRhVHlwZU9yVHJhbnNwb3J0ID09PSBcInN0cmluZ1wiICYmXG5cdFx0XHRcdCFzZWVraW5nVHJhbnNwb3J0ICYmICFpbnNwZWN0ZWRbIGRhdGFUeXBlT3JUcmFuc3BvcnQgXSApIHtcblxuXHRcdFx0XHRvcHRpb25zLmRhdGFUeXBlcy51bnNoaWZ0KCBkYXRhVHlwZU9yVHJhbnNwb3J0ICk7XG5cdFx0XHRcdGluc3BlY3QoIGRhdGFUeXBlT3JUcmFuc3BvcnQgKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSBlbHNlIGlmICggc2Vla2luZ1RyYW5zcG9ydCApIHtcblx0XHRcdFx0cmV0dXJuICEoIHNlbGVjdGVkID0gZGF0YVR5cGVPclRyYW5zcG9ydCApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0XHRyZXR1cm4gc2VsZWN0ZWQ7XG5cdH1cblxuXHRyZXR1cm4gaW5zcGVjdCggb3B0aW9ucy5kYXRhVHlwZXNbIDAgXSApIHx8ICFpbnNwZWN0ZWRbIFwiKlwiIF0gJiYgaW5zcGVjdCggXCIqXCIgKTtcbn1cblxuLy8gQSBzcGVjaWFsIGV4dGVuZCBmb3IgYWpheCBvcHRpb25zXG4vLyB0aGF0IHRha2VzIFwiZmxhdFwiIG9wdGlvbnMgKG5vdCB0byBiZSBkZWVwIGV4dGVuZGVkKVxuLy8gRml4ZXMgIzk4ODdcbmZ1bmN0aW9uIGFqYXhFeHRlbmQoIHRhcmdldCwgc3JjICkge1xuXHR2YXIga2V5LCBkZWVwLFxuXHRcdGZsYXRPcHRpb25zID0galF1ZXJ5LmFqYXhTZXR0aW5ncy5mbGF0T3B0aW9ucyB8fCB7fTtcblxuXHRmb3IgKCBrZXkgaW4gc3JjICkge1xuXHRcdGlmICggc3JjWyBrZXkgXSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0KCBmbGF0T3B0aW9uc1sga2V5IF0gPyB0YXJnZXQgOiAoIGRlZXAgfHwgKCBkZWVwID0ge30gKSApIClbIGtleSBdID0gc3JjWyBrZXkgXTtcblx0XHR9XG5cdH1cblx0aWYgKCBkZWVwICkge1xuXHRcdGpRdWVyeS5leHRlbmQoIHRydWUsIHRhcmdldCwgZGVlcCApO1xuXHR9XG5cblx0cmV0dXJuIHRhcmdldDtcbn1cblxuLyogSGFuZGxlcyByZXNwb25zZXMgdG8gYW4gYWpheCByZXF1ZXN0OlxuICogLSBmaW5kcyB0aGUgcmlnaHQgZGF0YVR5cGUgKG1lZGlhdGVzIGJldHdlZW4gY29udGVudC10eXBlIGFuZCBleHBlY3RlZCBkYXRhVHlwZSlcbiAqIC0gcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyByZXNwb25zZVxuICovXG5mdW5jdGlvbiBhamF4SGFuZGxlUmVzcG9uc2VzKCBzLCBqcVhIUiwgcmVzcG9uc2VzICkge1xuXG5cdHZhciBjdCwgdHlwZSwgZmluYWxEYXRhVHlwZSwgZmlyc3REYXRhVHlwZSxcblx0XHRjb250ZW50cyA9IHMuY29udGVudHMsXG5cdFx0ZGF0YVR5cGVzID0gcy5kYXRhVHlwZXM7XG5cblx0Ly8gUmVtb3ZlIGF1dG8gZGF0YVR5cGUgYW5kIGdldCBjb250ZW50LXR5cGUgaW4gdGhlIHByb2Nlc3Ncblx0d2hpbGUgKCBkYXRhVHlwZXNbIDAgXSA9PT0gXCIqXCIgKSB7XG5cdFx0ZGF0YVR5cGVzLnNoaWZ0KCk7XG5cdFx0aWYgKCBjdCA9PT0gdW5kZWZpbmVkICkge1xuXHRcdFx0Y3QgPSBzLm1pbWVUeXBlIHx8IGpxWEhSLmdldFJlc3BvbnNlSGVhZGVyKCBcIkNvbnRlbnQtVHlwZVwiICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gQ2hlY2sgaWYgd2UncmUgZGVhbGluZyB3aXRoIGEga25vd24gY29udGVudC10eXBlXG5cdGlmICggY3QgKSB7XG5cdFx0Zm9yICggdHlwZSBpbiBjb250ZW50cyApIHtcblx0XHRcdGlmICggY29udGVudHNbIHR5cGUgXSAmJiBjb250ZW50c1sgdHlwZSBdLnRlc3QoIGN0ICkgKSB7XG5cdFx0XHRcdGRhdGFUeXBlcy51bnNoaWZ0KCB0eXBlICk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIENoZWNrIHRvIHNlZSBpZiB3ZSBoYXZlIGEgcmVzcG9uc2UgZm9yIHRoZSBleHBlY3RlZCBkYXRhVHlwZVxuXHRpZiAoIGRhdGFUeXBlc1sgMCBdIGluIHJlc3BvbnNlcyApIHtcblx0XHRmaW5hbERhdGFUeXBlID0gZGF0YVR5cGVzWyAwIF07XG5cdH0gZWxzZSB7XG5cblx0XHQvLyBUcnkgY29udmVydGlibGUgZGF0YVR5cGVzXG5cdFx0Zm9yICggdHlwZSBpbiByZXNwb25zZXMgKSB7XG5cdFx0XHRpZiAoICFkYXRhVHlwZXNbIDAgXSB8fCBzLmNvbnZlcnRlcnNbIHR5cGUgKyBcIiBcIiArIGRhdGFUeXBlc1sgMCBdIF0gKSB7XG5cdFx0XHRcdGZpbmFsRGF0YVR5cGUgPSB0eXBlO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGlmICggIWZpcnN0RGF0YVR5cGUgKSB7XG5cdFx0XHRcdGZpcnN0RGF0YVR5cGUgPSB0eXBlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIE9yIGp1c3QgdXNlIGZpcnN0IG9uZVxuXHRcdGZpbmFsRGF0YVR5cGUgPSBmaW5hbERhdGFUeXBlIHx8IGZpcnN0RGF0YVR5cGU7XG5cdH1cblxuXHQvLyBJZiB3ZSBmb3VuZCBhIGRhdGFUeXBlXG5cdC8vIFdlIGFkZCB0aGUgZGF0YVR5cGUgdG8gdGhlIGxpc3QgaWYgbmVlZGVkXG5cdC8vIGFuZCByZXR1cm4gdGhlIGNvcnJlc3BvbmRpbmcgcmVzcG9uc2Vcblx0aWYgKCBmaW5hbERhdGFUeXBlICkge1xuXHRcdGlmICggZmluYWxEYXRhVHlwZSAhPT0gZGF0YVR5cGVzWyAwIF0gKSB7XG5cdFx0XHRkYXRhVHlwZXMudW5zaGlmdCggZmluYWxEYXRhVHlwZSApO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzcG9uc2VzWyBmaW5hbERhdGFUeXBlIF07XG5cdH1cbn1cblxuLyogQ2hhaW4gY29udmVyc2lvbnMgZ2l2ZW4gdGhlIHJlcXVlc3QgYW5kIHRoZSBvcmlnaW5hbCByZXNwb25zZVxuICogQWxzbyBzZXRzIHRoZSByZXNwb25zZVhYWCBmaWVsZHMgb24gdGhlIGpxWEhSIGluc3RhbmNlXG4gKi9cbmZ1bmN0aW9uIGFqYXhDb252ZXJ0KCBzLCByZXNwb25zZSwganFYSFIsIGlzU3VjY2VzcyApIHtcblx0dmFyIGNvbnYyLCBjdXJyZW50LCBjb252LCB0bXAsIHByZXYsXG5cdFx0Y29udmVydGVycyA9IHt9LFxuXG5cdFx0Ly8gV29yayB3aXRoIGEgY29weSBvZiBkYXRhVHlwZXMgaW4gY2FzZSB3ZSBuZWVkIHRvIG1vZGlmeSBpdCBmb3IgY29udmVyc2lvblxuXHRcdGRhdGFUeXBlcyA9IHMuZGF0YVR5cGVzLnNsaWNlKCk7XG5cblx0Ly8gQ3JlYXRlIGNvbnZlcnRlcnMgbWFwIHdpdGggbG93ZXJjYXNlZCBrZXlzXG5cdGlmICggZGF0YVR5cGVzWyAxIF0gKSB7XG5cdFx0Zm9yICggY29udiBpbiBzLmNvbnZlcnRlcnMgKSB7XG5cdFx0XHRjb252ZXJ0ZXJzWyBjb252LnRvTG93ZXJDYXNlKCkgXSA9IHMuY29udmVydGVyc1sgY29udiBdO1xuXHRcdH1cblx0fVxuXG5cdGN1cnJlbnQgPSBkYXRhVHlwZXMuc2hpZnQoKTtcblxuXHQvLyBDb252ZXJ0IHRvIGVhY2ggc2VxdWVudGlhbCBkYXRhVHlwZVxuXHR3aGlsZSAoIGN1cnJlbnQgKSB7XG5cblx0XHRpZiAoIHMucmVzcG9uc2VGaWVsZHNbIGN1cnJlbnQgXSApIHtcblx0XHRcdGpxWEhSWyBzLnJlc3BvbnNlRmllbGRzWyBjdXJyZW50IF0gXSA9IHJlc3BvbnNlO1xuXHRcdH1cblxuXHRcdC8vIEFwcGx5IHRoZSBkYXRhRmlsdGVyIGlmIHByb3ZpZGVkXG5cdFx0aWYgKCAhcHJldiAmJiBpc1N1Y2Nlc3MgJiYgcy5kYXRhRmlsdGVyICkge1xuXHRcdFx0cmVzcG9uc2UgPSBzLmRhdGFGaWx0ZXIoIHJlc3BvbnNlLCBzLmRhdGFUeXBlICk7XG5cdFx0fVxuXG5cdFx0cHJldiA9IGN1cnJlbnQ7XG5cdFx0Y3VycmVudCA9IGRhdGFUeXBlcy5zaGlmdCgpO1xuXG5cdFx0aWYgKCBjdXJyZW50ICkge1xuXG5cdFx0Ly8gVGhlcmUncyBvbmx5IHdvcmsgdG8gZG8gaWYgY3VycmVudCBkYXRhVHlwZSBpcyBub24tYXV0b1xuXHRcdFx0aWYgKCBjdXJyZW50ID09PSBcIipcIiApIHtcblxuXHRcdFx0XHRjdXJyZW50ID0gcHJldjtcblxuXHRcdFx0Ly8gQ29udmVydCByZXNwb25zZSBpZiBwcmV2IGRhdGFUeXBlIGlzIG5vbi1hdXRvIGFuZCBkaWZmZXJzIGZyb20gY3VycmVudFxuXHRcdFx0fSBlbHNlIGlmICggcHJldiAhPT0gXCIqXCIgJiYgcHJldiAhPT0gY3VycmVudCApIHtcblxuXHRcdFx0XHQvLyBTZWVrIGEgZGlyZWN0IGNvbnZlcnRlclxuXHRcdFx0XHRjb252ID0gY29udmVydGVyc1sgcHJldiArIFwiIFwiICsgY3VycmVudCBdIHx8IGNvbnZlcnRlcnNbIFwiKiBcIiArIGN1cnJlbnQgXTtcblxuXHRcdFx0XHQvLyBJZiBub25lIGZvdW5kLCBzZWVrIGEgcGFpclxuXHRcdFx0XHRpZiAoICFjb252ICkge1xuXHRcdFx0XHRcdGZvciAoIGNvbnYyIGluIGNvbnZlcnRlcnMgKSB7XG5cblx0XHRcdFx0XHRcdC8vIElmIGNvbnYyIG91dHB1dHMgY3VycmVudFxuXHRcdFx0XHRcdFx0dG1wID0gY29udjIuc3BsaXQoIFwiIFwiICk7XG5cdFx0XHRcdFx0XHRpZiAoIHRtcFsgMSBdID09PSBjdXJyZW50ICkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIElmIHByZXYgY2FuIGJlIGNvbnZlcnRlZCB0byBhY2NlcHRlZCBpbnB1dFxuXHRcdFx0XHRcdFx0XHRjb252ID0gY29udmVydGVyc1sgcHJldiArIFwiIFwiICsgdG1wWyAwIF0gXSB8fFxuXHRcdFx0XHRcdFx0XHRcdGNvbnZlcnRlcnNbIFwiKiBcIiArIHRtcFsgMCBdIF07XG5cdFx0XHRcdFx0XHRcdGlmICggY29udiApIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIENvbmRlbnNlIGVxdWl2YWxlbmNlIGNvbnZlcnRlcnNcblx0XHRcdFx0XHRcdFx0XHRpZiAoIGNvbnYgPT09IHRydWUgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb252ID0gY29udmVydGVyc1sgY29udjIgXTtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIE90aGVyd2lzZSwgaW5zZXJ0IHRoZSBpbnRlcm1lZGlhdGUgZGF0YVR5cGVcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCBjb252ZXJ0ZXJzWyBjb252MiBdICE9PSB0cnVlICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudCA9IHRtcFsgMCBdO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YVR5cGVzLnVuc2hpZnQoIHRtcFsgMSBdICk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQXBwbHkgY29udmVydGVyIChpZiBub3QgYW4gZXF1aXZhbGVuY2UpXG5cdFx0XHRcdGlmICggY29udiAhPT0gdHJ1ZSApIHtcblxuXHRcdFx0XHRcdC8vIFVubGVzcyBlcnJvcnMgYXJlIGFsbG93ZWQgdG8gYnViYmxlLCBjYXRjaCBhbmQgcmV0dXJuIHRoZW1cblx0XHRcdFx0XHRpZiAoIGNvbnYgJiYgcy50aHJvd3MgKSB7XG5cdFx0XHRcdFx0XHRyZXNwb25zZSA9IGNvbnYoIHJlc3BvbnNlICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdHJlc3BvbnNlID0gY29udiggcmVzcG9uc2UgKTtcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKCBlICkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRcdHN0YXRlOiBcInBhcnNlcmVycm9yXCIsXG5cdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGNvbnYgPyBlIDogXCJObyBjb252ZXJzaW9uIGZyb20gXCIgKyBwcmV2ICsgXCIgdG8gXCIgKyBjdXJyZW50XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHsgc3RhdGU6IFwic3VjY2Vzc1wiLCBkYXRhOiByZXNwb25zZSB9O1xufVxuXG5qUXVlcnkuZXh0ZW5kKCB7XG5cblx0Ly8gQ291bnRlciBmb3IgaG9sZGluZyB0aGUgbnVtYmVyIG9mIGFjdGl2ZSBxdWVyaWVzXG5cdGFjdGl2ZTogMCxcblxuXHQvLyBMYXN0LU1vZGlmaWVkIGhlYWRlciBjYWNoZSBmb3IgbmV4dCByZXF1ZXN0XG5cdGxhc3RNb2RpZmllZDoge30sXG5cdGV0YWc6IHt9LFxuXG5cdGFqYXhTZXR0aW5nczoge1xuXHRcdHVybDogbG9jYXRpb24uaHJlZixcblx0XHR0eXBlOiBcIkdFVFwiLFxuXHRcdGlzTG9jYWw6IHJsb2NhbFByb3RvY29sLnRlc3QoIGxvY2F0aW9uLnByb3RvY29sICksXG5cdFx0Z2xvYmFsOiB0cnVlLFxuXHRcdHByb2Nlc3NEYXRhOiB0cnVlLFxuXHRcdGFzeW5jOiB0cnVlLFxuXHRcdGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOFwiLFxuXHRcdC8qXG5cdFx0dGltZW91dDogMCxcblx0XHRkYXRhOiBudWxsLFxuXHRcdGRhdGFUeXBlOiBudWxsLFxuXHRcdHVzZXJuYW1lOiBudWxsLFxuXHRcdHBhc3N3b3JkOiBudWxsLFxuXHRcdGNhY2hlOiBudWxsLFxuXHRcdHRocm93czogZmFsc2UsXG5cdFx0dHJhZGl0aW9uYWw6IGZhbHNlLFxuXHRcdGhlYWRlcnM6IHt9LFxuXHRcdCovXG5cblx0XHRhY2NlcHRzOiB7XG5cdFx0XHRcIipcIjogYWxsVHlwZXMsXG5cdFx0XHR0ZXh0OiBcInRleHQvcGxhaW5cIixcblx0XHRcdGh0bWw6IFwidGV4dC9odG1sXCIsXG5cdFx0XHR4bWw6IFwiYXBwbGljYXRpb24veG1sLCB0ZXh0L3htbFwiLFxuXHRcdFx0anNvbjogXCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L2phdmFzY3JpcHRcIlxuXHRcdH0sXG5cblx0XHRjb250ZW50czoge1xuXHRcdFx0eG1sOiAvXFxieG1sXFxiLyxcblx0XHRcdGh0bWw6IC9cXGJodG1sLyxcblx0XHRcdGpzb246IC9cXGJqc29uXFxiL1xuXHRcdH0sXG5cblx0XHRyZXNwb25zZUZpZWxkczoge1xuXHRcdFx0eG1sOiBcInJlc3BvbnNlWE1MXCIsXG5cdFx0XHR0ZXh0OiBcInJlc3BvbnNlVGV4dFwiLFxuXHRcdFx0anNvbjogXCJyZXNwb25zZUpTT05cIlxuXHRcdH0sXG5cblx0XHQvLyBEYXRhIGNvbnZlcnRlcnNcblx0XHQvLyBLZXlzIHNlcGFyYXRlIHNvdXJjZSAob3IgY2F0Y2hhbGwgXCIqXCIpIGFuZCBkZXN0aW5hdGlvbiB0eXBlcyB3aXRoIGEgc2luZ2xlIHNwYWNlXG5cdFx0Y29udmVydGVyczoge1xuXG5cdFx0XHQvLyBDb252ZXJ0IGFueXRoaW5nIHRvIHRleHRcblx0XHRcdFwiKiB0ZXh0XCI6IFN0cmluZyxcblxuXHRcdFx0Ly8gVGV4dCB0byBodG1sICh0cnVlID0gbm8gdHJhbnNmb3JtYXRpb24pXG5cdFx0XHRcInRleHQgaHRtbFwiOiB0cnVlLFxuXG5cdFx0XHQvLyBFdmFsdWF0ZSB0ZXh0IGFzIGEganNvbiBleHByZXNzaW9uXG5cdFx0XHRcInRleHQganNvblwiOiBqUXVlcnkucGFyc2VKU09OLFxuXG5cdFx0XHQvLyBQYXJzZSB0ZXh0IGFzIHhtbFxuXHRcdFx0XCJ0ZXh0IHhtbFwiOiBqUXVlcnkucGFyc2VYTUxcblx0XHR9LFxuXG5cdFx0Ly8gRm9yIG9wdGlvbnMgdGhhdCBzaG91bGRuJ3QgYmUgZGVlcCBleHRlbmRlZDpcblx0XHQvLyB5b3UgY2FuIGFkZCB5b3VyIG93biBjdXN0b20gb3B0aW9ucyBoZXJlIGlmXG5cdFx0Ly8gYW5kIHdoZW4geW91IGNyZWF0ZSBvbmUgdGhhdCBzaG91bGRuJ3QgYmVcblx0XHQvLyBkZWVwIGV4dGVuZGVkIChzZWUgYWpheEV4dGVuZClcblx0XHRmbGF0T3B0aW9uczoge1xuXHRcdFx0dXJsOiB0cnVlLFxuXHRcdFx0Y29udGV4dDogdHJ1ZVxuXHRcdH1cblx0fSxcblxuXHQvLyBDcmVhdGVzIGEgZnVsbCBmbGVkZ2VkIHNldHRpbmdzIG9iamVjdCBpbnRvIHRhcmdldFxuXHQvLyB3aXRoIGJvdGggYWpheFNldHRpbmdzIGFuZCBzZXR0aW5ncyBmaWVsZHMuXG5cdC8vIElmIHRhcmdldCBpcyBvbWl0dGVkLCB3cml0ZXMgaW50byBhamF4U2V0dGluZ3MuXG5cdGFqYXhTZXR1cDogZnVuY3Rpb24oIHRhcmdldCwgc2V0dGluZ3MgKSB7XG5cdFx0cmV0dXJuIHNldHRpbmdzID9cblxuXHRcdFx0Ly8gQnVpbGRpbmcgYSBzZXR0aW5ncyBvYmplY3Rcblx0XHRcdGFqYXhFeHRlbmQoIGFqYXhFeHRlbmQoIHRhcmdldCwgalF1ZXJ5LmFqYXhTZXR0aW5ncyApLCBzZXR0aW5ncyApIDpcblxuXHRcdFx0Ly8gRXh0ZW5kaW5nIGFqYXhTZXR0aW5nc1xuXHRcdFx0YWpheEV4dGVuZCggalF1ZXJ5LmFqYXhTZXR0aW5ncywgdGFyZ2V0ICk7XG5cdH0sXG5cblx0YWpheFByZWZpbHRlcjogYWRkVG9QcmVmaWx0ZXJzT3JUcmFuc3BvcnRzKCBwcmVmaWx0ZXJzICksXG5cdGFqYXhUcmFuc3BvcnQ6IGFkZFRvUHJlZmlsdGVyc09yVHJhbnNwb3J0cyggdHJhbnNwb3J0cyApLFxuXG5cdC8vIE1haW4gbWV0aG9kXG5cdGFqYXg6IGZ1bmN0aW9uKCB1cmwsIG9wdGlvbnMgKSB7XG5cblx0XHQvLyBJZiB1cmwgaXMgYW4gb2JqZWN0LCBzaW11bGF0ZSBwcmUtMS41IHNpZ25hdHVyZVxuXHRcdGlmICggdHlwZW9mIHVybCA9PT0gXCJvYmplY3RcIiApIHtcblx0XHRcdG9wdGlvbnMgPSB1cmw7XG5cdFx0XHR1cmwgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0Ly8gRm9yY2Ugb3B0aW9ucyB0byBiZSBhbiBvYmplY3Rcblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRcdHZhciB0cmFuc3BvcnQsXG5cblx0XHRcdC8vIFVSTCB3aXRob3V0IGFudGktY2FjaGUgcGFyYW1cblx0XHRcdGNhY2hlVVJMLFxuXG5cdFx0XHQvLyBSZXNwb25zZSBoZWFkZXJzXG5cdFx0XHRyZXNwb25zZUhlYWRlcnNTdHJpbmcsXG5cdFx0XHRyZXNwb25zZUhlYWRlcnMsXG5cblx0XHRcdC8vIHRpbWVvdXQgaGFuZGxlXG5cdFx0XHR0aW1lb3V0VGltZXIsXG5cblx0XHRcdC8vIFVybCBjbGVhbnVwIHZhclxuXHRcdFx0dXJsQW5jaG9yLFxuXG5cdFx0XHQvLyBUbyBrbm93IGlmIGdsb2JhbCBldmVudHMgYXJlIHRvIGJlIGRpc3BhdGNoZWRcblx0XHRcdGZpcmVHbG9iYWxzLFxuXG5cdFx0XHQvLyBMb29wIHZhcmlhYmxlXG5cdFx0XHRpLFxuXG5cdFx0XHQvLyBDcmVhdGUgdGhlIGZpbmFsIG9wdGlvbnMgb2JqZWN0XG5cdFx0XHRzID0galF1ZXJ5LmFqYXhTZXR1cCgge30sIG9wdGlvbnMgKSxcblxuXHRcdFx0Ly8gQ2FsbGJhY2tzIGNvbnRleHRcblx0XHRcdGNhbGxiYWNrQ29udGV4dCA9IHMuY29udGV4dCB8fCBzLFxuXG5cdFx0XHQvLyBDb250ZXh0IGZvciBnbG9iYWwgZXZlbnRzIGlzIGNhbGxiYWNrQ29udGV4dCBpZiBpdCBpcyBhIERPTSBub2RlIG9yIGpRdWVyeSBjb2xsZWN0aW9uXG5cdFx0XHRnbG9iYWxFdmVudENvbnRleHQgPSBzLmNvbnRleHQgJiZcblx0XHRcdFx0KCBjYWxsYmFja0NvbnRleHQubm9kZVR5cGUgfHwgY2FsbGJhY2tDb250ZXh0LmpxdWVyeSApID9cblx0XHRcdFx0XHRqUXVlcnkoIGNhbGxiYWNrQ29udGV4dCApIDpcblx0XHRcdFx0XHRqUXVlcnkuZXZlbnQsXG5cblx0XHRcdC8vIERlZmVycmVkc1xuXHRcdFx0ZGVmZXJyZWQgPSBqUXVlcnkuRGVmZXJyZWQoKSxcblx0XHRcdGNvbXBsZXRlRGVmZXJyZWQgPSBqUXVlcnkuQ2FsbGJhY2tzKCBcIm9uY2UgbWVtb3J5XCIgKSxcblxuXHRcdFx0Ly8gU3RhdHVzLWRlcGVuZGVudCBjYWxsYmFja3Ncblx0XHRcdHN0YXR1c0NvZGUgPSBzLnN0YXR1c0NvZGUgfHwge30sXG5cblx0XHRcdC8vIEhlYWRlcnMgKHRoZXkgYXJlIHNlbnQgYWxsIGF0IG9uY2UpXG5cdFx0XHRyZXF1ZXN0SGVhZGVycyA9IHt9LFxuXHRcdFx0cmVxdWVzdEhlYWRlcnNOYW1lcyA9IHt9LFxuXG5cdFx0XHQvLyBUaGUganFYSFIgc3RhdGVcblx0XHRcdHN0YXRlID0gMCxcblxuXHRcdFx0Ly8gRGVmYXVsdCBhYm9ydCBtZXNzYWdlXG5cdFx0XHRzdHJBYm9ydCA9IFwiY2FuY2VsZWRcIixcblxuXHRcdFx0Ly8gRmFrZSB4aHJcblx0XHRcdGpxWEhSID0ge1xuXHRcdFx0XHRyZWFkeVN0YXRlOiAwLFxuXG5cdFx0XHRcdC8vIEJ1aWxkcyBoZWFkZXJzIGhhc2h0YWJsZSBpZiBuZWVkZWRcblx0XHRcdFx0Z2V0UmVzcG9uc2VIZWFkZXI6IGZ1bmN0aW9uKCBrZXkgKSB7XG5cdFx0XHRcdFx0dmFyIG1hdGNoO1xuXHRcdFx0XHRcdGlmICggc3RhdGUgPT09IDIgKSB7XG5cdFx0XHRcdFx0XHRpZiAoICFyZXNwb25zZUhlYWRlcnMgKSB7XG5cdFx0XHRcdFx0XHRcdHJlc3BvbnNlSGVhZGVycyA9IHt9O1xuXHRcdFx0XHRcdFx0XHR3aGlsZSAoICggbWF0Y2ggPSByaGVhZGVycy5leGVjKCByZXNwb25zZUhlYWRlcnNTdHJpbmcgKSApICkge1xuXHRcdFx0XHRcdFx0XHRcdHJlc3BvbnNlSGVhZGVyc1sgbWF0Y2hbIDEgXS50b0xvd2VyQ2FzZSgpIF0gPSBtYXRjaFsgMiBdO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRtYXRjaCA9IHJlc3BvbnNlSGVhZGVyc1sga2V5LnRvTG93ZXJDYXNlKCkgXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIG1hdGNoID09IG51bGwgPyBudWxsIDogbWF0Y2g7XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0Ly8gUmF3IHN0cmluZ1xuXHRcdFx0XHRnZXRBbGxSZXNwb25zZUhlYWRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiBzdGF0ZSA9PT0gMiA/IHJlc3BvbnNlSGVhZGVyc1N0cmluZyA6IG51bGw7XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0Ly8gQ2FjaGVzIHRoZSBoZWFkZXJcblx0XHRcdFx0c2V0UmVxdWVzdEhlYWRlcjogZnVuY3Rpb24oIG5hbWUsIHZhbHVlICkge1xuXHRcdFx0XHRcdHZhciBsbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XHRpZiAoICFzdGF0ZSApIHtcblx0XHRcdFx0XHRcdG5hbWUgPSByZXF1ZXN0SGVhZGVyc05hbWVzWyBsbmFtZSBdID0gcmVxdWVzdEhlYWRlcnNOYW1lc1sgbG5hbWUgXSB8fCBuYW1lO1xuXHRcdFx0XHRcdFx0cmVxdWVzdEhlYWRlcnNbIG5hbWUgXSA9IHZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdFx0fSxcblxuXHRcdFx0XHQvLyBPdmVycmlkZXMgcmVzcG9uc2UgY29udGVudC10eXBlIGhlYWRlclxuXHRcdFx0XHRvdmVycmlkZU1pbWVUeXBlOiBmdW5jdGlvbiggdHlwZSApIHtcblx0XHRcdFx0XHRpZiAoICFzdGF0ZSApIHtcblx0XHRcdFx0XHRcdHMubWltZVR5cGUgPSB0eXBlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdFx0fSxcblxuXHRcdFx0XHQvLyBTdGF0dXMtZGVwZW5kZW50IGNhbGxiYWNrc1xuXHRcdFx0XHRzdGF0dXNDb2RlOiBmdW5jdGlvbiggbWFwICkge1xuXHRcdFx0XHRcdHZhciBjb2RlO1xuXHRcdFx0XHRcdGlmICggbWFwICkge1xuXHRcdFx0XHRcdFx0aWYgKCBzdGF0ZSA8IDIgKSB7XG5cdFx0XHRcdFx0XHRcdGZvciAoIGNvZGUgaW4gbWFwICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gTGF6eS1hZGQgdGhlIG5ldyBjYWxsYmFjayBpbiBhIHdheSB0aGF0IHByZXNlcnZlcyBvbGQgb25lc1xuXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGVbIGNvZGUgXSA9IFsgc3RhdHVzQ29kZVsgY29kZSBdLCBtYXBbIGNvZGUgXSBdO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHRcdC8vIEV4ZWN1dGUgdGhlIGFwcHJvcHJpYXRlIGNhbGxiYWNrc1xuXHRcdFx0XHRcdFx0XHRqcVhIUi5hbHdheXMoIG1hcFsganFYSFIuc3RhdHVzIF0gKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0Ly8gQ2FuY2VsIHRoZSByZXF1ZXN0XG5cdFx0XHRcdGFib3J0OiBmdW5jdGlvbiggc3RhdHVzVGV4dCApIHtcblx0XHRcdFx0XHR2YXIgZmluYWxUZXh0ID0gc3RhdHVzVGV4dCB8fCBzdHJBYm9ydDtcblx0XHRcdFx0XHRpZiAoIHRyYW5zcG9ydCApIHtcblx0XHRcdFx0XHRcdHRyYW5zcG9ydC5hYm9ydCggZmluYWxUZXh0ICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGRvbmUoIDAsIGZpbmFsVGV4dCApO1xuXHRcdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0Ly8gQXR0YWNoIGRlZmVycmVkc1xuXHRcdGRlZmVycmVkLnByb21pc2UoIGpxWEhSICkuY29tcGxldGUgPSBjb21wbGV0ZURlZmVycmVkLmFkZDtcblx0XHRqcVhIUi5zdWNjZXNzID0ganFYSFIuZG9uZTtcblx0XHRqcVhIUi5lcnJvciA9IGpxWEhSLmZhaWw7XG5cblx0XHQvLyBSZW1vdmUgaGFzaCBjaGFyYWN0ZXIgKCM3NTMxOiBhbmQgc3RyaW5nIHByb21vdGlvbilcblx0XHQvLyBBZGQgcHJvdG9jb2wgaWYgbm90IHByb3ZpZGVkIChwcmVmaWx0ZXJzIG1pZ2h0IGV4cGVjdCBpdClcblx0XHQvLyBIYW5kbGUgZmFsc3kgdXJsIGluIHRoZSBzZXR0aW5ncyBvYmplY3QgKCMxMDA5MzogY29uc2lzdGVuY3kgd2l0aCBvbGQgc2lnbmF0dXJlKVxuXHRcdC8vIFdlIGFsc28gdXNlIHRoZSB1cmwgcGFyYW1ldGVyIGlmIGF2YWlsYWJsZVxuXHRcdHMudXJsID0gKCAoIHVybCB8fCBzLnVybCB8fCBsb2NhdGlvbi5ocmVmICkgKyBcIlwiICkucmVwbGFjZSggcmhhc2gsIFwiXCIgKVxuXHRcdFx0LnJlcGxhY2UoIHJwcm90b2NvbCwgbG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKTtcblxuXHRcdC8vIEFsaWFzIG1ldGhvZCBvcHRpb24gdG8gdHlwZSBhcyBwZXIgdGlja2V0ICMxMjAwNFxuXHRcdHMudHlwZSA9IG9wdGlvbnMubWV0aG9kIHx8IG9wdGlvbnMudHlwZSB8fCBzLm1ldGhvZCB8fCBzLnR5cGU7XG5cblx0XHQvLyBFeHRyYWN0IGRhdGFUeXBlcyBsaXN0XG5cdFx0cy5kYXRhVHlwZXMgPSBqUXVlcnkudHJpbSggcy5kYXRhVHlwZSB8fCBcIipcIiApLnRvTG93ZXJDYXNlKCkubWF0Y2goIHJub3R3aGl0ZSApIHx8IFsgXCJcIiBdO1xuXG5cdFx0Ly8gQSBjcm9zcy1kb21haW4gcmVxdWVzdCBpcyBpbiBvcmRlciB3aGVuIHRoZSBvcmlnaW4gZG9lc24ndCBtYXRjaCB0aGUgY3VycmVudCBvcmlnaW4uXG5cdFx0aWYgKCBzLmNyb3NzRG9tYWluID09IG51bGwgKSB7XG5cdFx0XHR1cmxBbmNob3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImFcIiApO1xuXG5cdFx0XHQvLyBTdXBwb3J0OiBJRTgtMTErXG5cdFx0XHQvLyBJRSB0aHJvd3MgZXhjZXB0aW9uIGlmIHVybCBpcyBtYWxmb3JtZWQsIGUuZy4gaHR0cDovL2V4YW1wbGUuY29tOjgweC9cblx0XHRcdHRyeSB7XG5cdFx0XHRcdHVybEFuY2hvci5ocmVmID0gcy51cmw7XG5cblx0XHRcdFx0Ly8gU3VwcG9ydDogSUU4LTExK1xuXHRcdFx0XHQvLyBBbmNob3IncyBob3N0IHByb3BlcnR5IGlzbid0IGNvcnJlY3RseSBzZXQgd2hlbiBzLnVybCBpcyByZWxhdGl2ZVxuXHRcdFx0XHR1cmxBbmNob3IuaHJlZiA9IHVybEFuY2hvci5ocmVmO1xuXHRcdFx0XHRzLmNyb3NzRG9tYWluID0gb3JpZ2luQW5jaG9yLnByb3RvY29sICsgXCIvL1wiICsgb3JpZ2luQW5jaG9yLmhvc3QgIT09XG5cdFx0XHRcdFx0dXJsQW5jaG9yLnByb3RvY29sICsgXCIvL1wiICsgdXJsQW5jaG9yLmhvc3Q7XG5cdFx0XHR9IGNhdGNoICggZSApIHtcblxuXHRcdFx0XHQvLyBJZiB0aGVyZSBpcyBhbiBlcnJvciBwYXJzaW5nIHRoZSBVUkwsIGFzc3VtZSBpdCBpcyBjcm9zc0RvbWFpbixcblx0XHRcdFx0Ly8gaXQgY2FuIGJlIHJlamVjdGVkIGJ5IHRoZSB0cmFuc3BvcnQgaWYgaXQgaXMgaW52YWxpZFxuXHRcdFx0XHRzLmNyb3NzRG9tYWluID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBDb252ZXJ0IGRhdGEgaWYgbm90IGFscmVhZHkgYSBzdHJpbmdcblx0XHRpZiAoIHMuZGF0YSAmJiBzLnByb2Nlc3NEYXRhICYmIHR5cGVvZiBzLmRhdGEgIT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRzLmRhdGEgPSBqUXVlcnkucGFyYW0oIHMuZGF0YSwgcy50cmFkaXRpb25hbCApO1xuXHRcdH1cblxuXHRcdC8vIEFwcGx5IHByZWZpbHRlcnNcblx0XHRpbnNwZWN0UHJlZmlsdGVyc09yVHJhbnNwb3J0cyggcHJlZmlsdGVycywgcywgb3B0aW9ucywganFYSFIgKTtcblxuXHRcdC8vIElmIHJlcXVlc3Qgd2FzIGFib3J0ZWQgaW5zaWRlIGEgcHJlZmlsdGVyLCBzdG9wIHRoZXJlXG5cdFx0aWYgKCBzdGF0ZSA9PT0gMiApIHtcblx0XHRcdHJldHVybiBqcVhIUjtcblx0XHR9XG5cblx0XHQvLyBXZSBjYW4gZmlyZSBnbG9iYWwgZXZlbnRzIGFzIG9mIG5vdyBpZiBhc2tlZCB0b1xuXHRcdC8vIERvbid0IGZpcmUgZXZlbnRzIGlmIGpRdWVyeS5ldmVudCBpcyB1bmRlZmluZWQgaW4gYW4gQU1ELXVzYWdlIHNjZW5hcmlvICgjMTUxMTgpXG5cdFx0ZmlyZUdsb2JhbHMgPSBqUXVlcnkuZXZlbnQgJiYgcy5nbG9iYWw7XG5cblx0XHQvLyBXYXRjaCBmb3IgYSBuZXcgc2V0IG9mIHJlcXVlc3RzXG5cdFx0aWYgKCBmaXJlR2xvYmFscyAmJiBqUXVlcnkuYWN0aXZlKysgPT09IDAgKSB7XG5cdFx0XHRqUXVlcnkuZXZlbnQudHJpZ2dlciggXCJhamF4U3RhcnRcIiApO1xuXHRcdH1cblxuXHRcdC8vIFVwcGVyY2FzZSB0aGUgdHlwZVxuXHRcdHMudHlwZSA9IHMudHlwZS50b1VwcGVyQ2FzZSgpO1xuXG5cdFx0Ly8gRGV0ZXJtaW5lIGlmIHJlcXVlc3QgaGFzIGNvbnRlbnRcblx0XHRzLmhhc0NvbnRlbnQgPSAhcm5vQ29udGVudC50ZXN0KCBzLnR5cGUgKTtcblxuXHRcdC8vIFNhdmUgdGhlIFVSTCBpbiBjYXNlIHdlJ3JlIHRveWluZyB3aXRoIHRoZSBJZi1Nb2RpZmllZC1TaW5jZVxuXHRcdC8vIGFuZC9vciBJZi1Ob25lLU1hdGNoIGhlYWRlciBsYXRlciBvblxuXHRcdGNhY2hlVVJMID0gcy51cmw7XG5cblx0XHQvLyBNb3JlIG9wdGlvbnMgaGFuZGxpbmcgZm9yIHJlcXVlc3RzIHdpdGggbm8gY29udGVudFxuXHRcdGlmICggIXMuaGFzQ29udGVudCApIHtcblxuXHRcdFx0Ly8gSWYgZGF0YSBpcyBhdmFpbGFibGUsIGFwcGVuZCBkYXRhIHRvIHVybFxuXHRcdFx0aWYgKCBzLmRhdGEgKSB7XG5cdFx0XHRcdGNhY2hlVVJMID0gKCBzLnVybCArPSAoIHJxdWVyeS50ZXN0KCBjYWNoZVVSTCApID8gXCImXCIgOiBcIj9cIiApICsgcy5kYXRhICk7XG5cblx0XHRcdFx0Ly8gIzk2ODI6IHJlbW92ZSBkYXRhIHNvIHRoYXQgaXQncyBub3QgdXNlZCBpbiBhbiBldmVudHVhbCByZXRyeVxuXHRcdFx0XHRkZWxldGUgcy5kYXRhO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBZGQgYW50aS1jYWNoZSBpbiB1cmwgaWYgbmVlZGVkXG5cdFx0XHRpZiAoIHMuY2FjaGUgPT09IGZhbHNlICkge1xuXHRcdFx0XHRzLnVybCA9IHJ0cy50ZXN0KCBjYWNoZVVSTCApID9cblxuXHRcdFx0XHRcdC8vIElmIHRoZXJlIGlzIGFscmVhZHkgYSAnXycgcGFyYW1ldGVyLCBzZXQgaXRzIHZhbHVlXG5cdFx0XHRcdFx0Y2FjaGVVUkwucmVwbGFjZSggcnRzLCBcIiQxXz1cIiArIG5vbmNlKysgKSA6XG5cblx0XHRcdFx0XHQvLyBPdGhlcndpc2UgYWRkIG9uZSB0byB0aGUgZW5kXG5cdFx0XHRcdFx0Y2FjaGVVUkwgKyAoIHJxdWVyeS50ZXN0KCBjYWNoZVVSTCApID8gXCImXCIgOiBcIj9cIiApICsgXCJfPVwiICsgbm9uY2UrKztcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBTZXQgdGhlIElmLU1vZGlmaWVkLVNpbmNlIGFuZC9vciBJZi1Ob25lLU1hdGNoIGhlYWRlciwgaWYgaW4gaWZNb2RpZmllZCBtb2RlLlxuXHRcdGlmICggcy5pZk1vZGlmaWVkICkge1xuXHRcdFx0aWYgKCBqUXVlcnkubGFzdE1vZGlmaWVkWyBjYWNoZVVSTCBdICkge1xuXHRcdFx0XHRqcVhIUi5zZXRSZXF1ZXN0SGVhZGVyKCBcIklmLU1vZGlmaWVkLVNpbmNlXCIsIGpRdWVyeS5sYXN0TW9kaWZpZWRbIGNhY2hlVVJMIF0gKTtcblx0XHRcdH1cblx0XHRcdGlmICggalF1ZXJ5LmV0YWdbIGNhY2hlVVJMIF0gKSB7XG5cdFx0XHRcdGpxWEhSLnNldFJlcXVlc3RIZWFkZXIoIFwiSWYtTm9uZS1NYXRjaFwiLCBqUXVlcnkuZXRhZ1sgY2FjaGVVUkwgXSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFNldCB0aGUgY29ycmVjdCBoZWFkZXIsIGlmIGRhdGEgaXMgYmVpbmcgc2VudFxuXHRcdGlmICggcy5kYXRhICYmIHMuaGFzQ29udGVudCAmJiBzLmNvbnRlbnRUeXBlICE9PSBmYWxzZSB8fCBvcHRpb25zLmNvbnRlbnRUeXBlICkge1xuXHRcdFx0anFYSFIuc2V0UmVxdWVzdEhlYWRlciggXCJDb250ZW50LVR5cGVcIiwgcy5jb250ZW50VHlwZSApO1xuXHRcdH1cblxuXHRcdC8vIFNldCB0aGUgQWNjZXB0cyBoZWFkZXIgZm9yIHRoZSBzZXJ2ZXIsIGRlcGVuZGluZyBvbiB0aGUgZGF0YVR5cGVcblx0XHRqcVhIUi5zZXRSZXF1ZXN0SGVhZGVyKFxuXHRcdFx0XCJBY2NlcHRcIixcblx0XHRcdHMuZGF0YVR5cGVzWyAwIF0gJiYgcy5hY2NlcHRzWyBzLmRhdGFUeXBlc1sgMCBdIF0gP1xuXHRcdFx0XHRzLmFjY2VwdHNbIHMuZGF0YVR5cGVzWyAwIF0gXSArXG5cdFx0XHRcdFx0KCBzLmRhdGFUeXBlc1sgMCBdICE9PSBcIipcIiA/IFwiLCBcIiArIGFsbFR5cGVzICsgXCI7IHE9MC4wMVwiIDogXCJcIiApIDpcblx0XHRcdFx0cy5hY2NlcHRzWyBcIipcIiBdXG5cdFx0KTtcblxuXHRcdC8vIENoZWNrIGZvciBoZWFkZXJzIG9wdGlvblxuXHRcdGZvciAoIGkgaW4gcy5oZWFkZXJzICkge1xuXHRcdFx0anFYSFIuc2V0UmVxdWVzdEhlYWRlciggaSwgcy5oZWFkZXJzWyBpIF0gKTtcblx0XHR9XG5cblx0XHQvLyBBbGxvdyBjdXN0b20gaGVhZGVycy9taW1ldHlwZXMgYW5kIGVhcmx5IGFib3J0XG5cdFx0aWYgKCBzLmJlZm9yZVNlbmQgJiZcblx0XHRcdCggcy5iZWZvcmVTZW5kLmNhbGwoIGNhbGxiYWNrQ29udGV4dCwganFYSFIsIHMgKSA9PT0gZmFsc2UgfHwgc3RhdGUgPT09IDIgKSApIHtcblxuXHRcdFx0Ly8gQWJvcnQgaWYgbm90IGRvbmUgYWxyZWFkeSBhbmQgcmV0dXJuXG5cdFx0XHRyZXR1cm4ganFYSFIuYWJvcnQoKTtcblx0XHR9XG5cblx0XHQvLyBBYm9ydGluZyBpcyBubyBsb25nZXIgYSBjYW5jZWxsYXRpb25cblx0XHRzdHJBYm9ydCA9IFwiYWJvcnRcIjtcblxuXHRcdC8vIEluc3RhbGwgY2FsbGJhY2tzIG9uIGRlZmVycmVkc1xuXHRcdGZvciAoIGkgaW4geyBzdWNjZXNzOiAxLCBlcnJvcjogMSwgY29tcGxldGU6IDEgfSApIHtcblx0XHRcdGpxWEhSWyBpIF0oIHNbIGkgXSApO1xuXHRcdH1cblxuXHRcdC8vIEdldCB0cmFuc3BvcnRcblx0XHR0cmFuc3BvcnQgPSBpbnNwZWN0UHJlZmlsdGVyc09yVHJhbnNwb3J0cyggdHJhbnNwb3J0cywgcywgb3B0aW9ucywganFYSFIgKTtcblxuXHRcdC8vIElmIG5vIHRyYW5zcG9ydCwgd2UgYXV0by1hYm9ydFxuXHRcdGlmICggIXRyYW5zcG9ydCApIHtcblx0XHRcdGRvbmUoIC0xLCBcIk5vIFRyYW5zcG9ydFwiICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGpxWEhSLnJlYWR5U3RhdGUgPSAxO1xuXG5cdFx0XHQvLyBTZW5kIGdsb2JhbCBldmVudFxuXHRcdFx0aWYgKCBmaXJlR2xvYmFscyApIHtcblx0XHRcdFx0Z2xvYmFsRXZlbnRDb250ZXh0LnRyaWdnZXIoIFwiYWpheFNlbmRcIiwgWyBqcVhIUiwgcyBdICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIHJlcXVlc3Qgd2FzIGFib3J0ZWQgaW5zaWRlIGFqYXhTZW5kLCBzdG9wIHRoZXJlXG5cdFx0XHRpZiAoIHN0YXRlID09PSAyICkge1xuXHRcdFx0XHRyZXR1cm4ganFYSFI7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRpbWVvdXRcblx0XHRcdGlmICggcy5hc3luYyAmJiBzLnRpbWVvdXQgPiAwICkge1xuXHRcdFx0XHR0aW1lb3V0VGltZXIgPSB3aW5kb3cuc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0anFYSFIuYWJvcnQoIFwidGltZW91dFwiICk7XG5cdFx0XHRcdH0sIHMudGltZW91dCApO1xuXHRcdFx0fVxuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRzdGF0ZSA9IDE7XG5cdFx0XHRcdHRyYW5zcG9ydC5zZW5kKCByZXF1ZXN0SGVhZGVycywgZG9uZSApO1xuXHRcdFx0fSBjYXRjaCAoIGUgKSB7XG5cblx0XHRcdFx0Ly8gUHJvcGFnYXRlIGV4Y2VwdGlvbiBhcyBlcnJvciBpZiBub3QgZG9uZVxuXHRcdFx0XHRpZiAoIHN0YXRlIDwgMiApIHtcblx0XHRcdFx0XHRkb25lKCAtMSwgZSApO1xuXG5cdFx0XHRcdC8vIFNpbXBseSByZXRocm93IG90aGVyd2lzZVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRocm93IGU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBDYWxsYmFjayBmb3Igd2hlbiBldmVyeXRoaW5nIGlzIGRvbmVcblx0XHRmdW5jdGlvbiBkb25lKCBzdGF0dXMsIG5hdGl2ZVN0YXR1c1RleHQsIHJlc3BvbnNlcywgaGVhZGVycyApIHtcblx0XHRcdHZhciBpc1N1Y2Nlc3MsIHN1Y2Nlc3MsIGVycm9yLCByZXNwb25zZSwgbW9kaWZpZWQsXG5cdFx0XHRcdHN0YXR1c1RleHQgPSBuYXRpdmVTdGF0dXNUZXh0O1xuXG5cdFx0XHQvLyBDYWxsZWQgb25jZVxuXHRcdFx0aWYgKCBzdGF0ZSA9PT0gMiApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdGF0ZSBpcyBcImRvbmVcIiBub3dcblx0XHRcdHN0YXRlID0gMjtcblxuXHRcdFx0Ly8gQ2xlYXIgdGltZW91dCBpZiBpdCBleGlzdHNcblx0XHRcdGlmICggdGltZW91dFRpbWVyICkge1xuXHRcdFx0XHR3aW5kb3cuY2xlYXJUaW1lb3V0KCB0aW1lb3V0VGltZXIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRGVyZWZlcmVuY2UgdHJhbnNwb3J0IGZvciBlYXJseSBnYXJiYWdlIGNvbGxlY3Rpb25cblx0XHRcdC8vIChubyBtYXR0ZXIgaG93IGxvbmcgdGhlIGpxWEhSIG9iamVjdCB3aWxsIGJlIHVzZWQpXG5cdFx0XHR0cmFuc3BvcnQgPSB1bmRlZmluZWQ7XG5cblx0XHRcdC8vIENhY2hlIHJlc3BvbnNlIGhlYWRlcnNcblx0XHRcdHJlc3BvbnNlSGVhZGVyc1N0cmluZyA9IGhlYWRlcnMgfHwgXCJcIjtcblxuXHRcdFx0Ly8gU2V0IHJlYWR5U3RhdGVcblx0XHRcdGpxWEhSLnJlYWR5U3RhdGUgPSBzdGF0dXMgPiAwID8gNCA6IDA7XG5cblx0XHRcdC8vIERldGVybWluZSBpZiBzdWNjZXNzZnVsXG5cdFx0XHRpc1N1Y2Nlc3MgPSBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMCB8fCBzdGF0dXMgPT09IDMwNDtcblxuXHRcdFx0Ly8gR2V0IHJlc3BvbnNlIGRhdGFcblx0XHRcdGlmICggcmVzcG9uc2VzICkge1xuXHRcdFx0XHRyZXNwb25zZSA9IGFqYXhIYW5kbGVSZXNwb25zZXMoIHMsIGpxWEhSLCByZXNwb25zZXMgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQ29udmVydCBubyBtYXR0ZXIgd2hhdCAodGhhdCB3YXkgcmVzcG9uc2VYWFggZmllbGRzIGFyZSBhbHdheXMgc2V0KVxuXHRcdFx0cmVzcG9uc2UgPSBhamF4Q29udmVydCggcywgcmVzcG9uc2UsIGpxWEhSLCBpc1N1Y2Nlc3MgKTtcblxuXHRcdFx0Ly8gSWYgc3VjY2Vzc2Z1bCwgaGFuZGxlIHR5cGUgY2hhaW5pbmdcblx0XHRcdGlmICggaXNTdWNjZXNzICkge1xuXG5cdFx0XHRcdC8vIFNldCB0aGUgSWYtTW9kaWZpZWQtU2luY2UgYW5kL29yIElmLU5vbmUtTWF0Y2ggaGVhZGVyLCBpZiBpbiBpZk1vZGlmaWVkIG1vZGUuXG5cdFx0XHRcdGlmICggcy5pZk1vZGlmaWVkICkge1xuXHRcdFx0XHRcdG1vZGlmaWVkID0ganFYSFIuZ2V0UmVzcG9uc2VIZWFkZXIoIFwiTGFzdC1Nb2RpZmllZFwiICk7XG5cdFx0XHRcdFx0aWYgKCBtb2RpZmllZCApIHtcblx0XHRcdFx0XHRcdGpRdWVyeS5sYXN0TW9kaWZpZWRbIGNhY2hlVVJMIF0gPSBtb2RpZmllZDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bW9kaWZpZWQgPSBqcVhIUi5nZXRSZXNwb25zZUhlYWRlciggXCJldGFnXCIgKTtcblx0XHRcdFx0XHRpZiAoIG1vZGlmaWVkICkge1xuXHRcdFx0XHRcdFx0alF1ZXJ5LmV0YWdbIGNhY2hlVVJMIF0gPSBtb2RpZmllZDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBpZiBubyBjb250ZW50XG5cdFx0XHRcdGlmICggc3RhdHVzID09PSAyMDQgfHwgcy50eXBlID09PSBcIkhFQURcIiApIHtcblx0XHRcdFx0XHRzdGF0dXNUZXh0ID0gXCJub2NvbnRlbnRcIjtcblxuXHRcdFx0XHQvLyBpZiBub3QgbW9kaWZpZWRcblx0XHRcdFx0fSBlbHNlIGlmICggc3RhdHVzID09PSAzMDQgKSB7XG5cdFx0XHRcdFx0c3RhdHVzVGV4dCA9IFwibm90bW9kaWZpZWRcIjtcblxuXHRcdFx0XHQvLyBJZiB3ZSBoYXZlIGRhdGEsIGxldCdzIGNvbnZlcnQgaXRcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzdGF0dXNUZXh0ID0gcmVzcG9uc2Uuc3RhdGU7XG5cdFx0XHRcdFx0c3VjY2VzcyA9IHJlc3BvbnNlLmRhdGE7XG5cdFx0XHRcdFx0ZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcblx0XHRcdFx0XHRpc1N1Y2Nlc3MgPSAhZXJyb3I7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0Ly8gRXh0cmFjdCBlcnJvciBmcm9tIHN0YXR1c1RleHQgYW5kIG5vcm1hbGl6ZSBmb3Igbm9uLWFib3J0c1xuXHRcdFx0XHRlcnJvciA9IHN0YXR1c1RleHQ7XG5cdFx0XHRcdGlmICggc3RhdHVzIHx8ICFzdGF0dXNUZXh0ICkge1xuXHRcdFx0XHRcdHN0YXR1c1RleHQgPSBcImVycm9yXCI7XG5cdFx0XHRcdFx0aWYgKCBzdGF0dXMgPCAwICkge1xuXHRcdFx0XHRcdFx0c3RhdHVzID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gU2V0IGRhdGEgZm9yIHRoZSBmYWtlIHhociBvYmplY3Rcblx0XHRcdGpxWEhSLnN0YXR1cyA9IHN0YXR1cztcblx0XHRcdGpxWEhSLnN0YXR1c1RleHQgPSAoIG5hdGl2ZVN0YXR1c1RleHQgfHwgc3RhdHVzVGV4dCApICsgXCJcIjtcblxuXHRcdFx0Ly8gU3VjY2Vzcy9FcnJvclxuXHRcdFx0aWYgKCBpc1N1Y2Nlc3MgKSB7XG5cdFx0XHRcdGRlZmVycmVkLnJlc29sdmVXaXRoKCBjYWxsYmFja0NvbnRleHQsIFsgc3VjY2Vzcywgc3RhdHVzVGV4dCwganFYSFIgXSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0V2l0aCggY2FsbGJhY2tDb250ZXh0LCBbIGpxWEhSLCBzdGF0dXNUZXh0LCBlcnJvciBdICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN0YXR1cy1kZXBlbmRlbnQgY2FsbGJhY2tzXG5cdFx0XHRqcVhIUi5zdGF0dXNDb2RlKCBzdGF0dXNDb2RlICk7XG5cdFx0XHRzdGF0dXNDb2RlID0gdW5kZWZpbmVkO1xuXG5cdFx0XHRpZiAoIGZpcmVHbG9iYWxzICkge1xuXHRcdFx0XHRnbG9iYWxFdmVudENvbnRleHQudHJpZ2dlciggaXNTdWNjZXNzID8gXCJhamF4U3VjY2Vzc1wiIDogXCJhamF4RXJyb3JcIixcblx0XHRcdFx0XHRbIGpxWEhSLCBzLCBpc1N1Y2Nlc3MgPyBzdWNjZXNzIDogZXJyb3IgXSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDb21wbGV0ZVxuXHRcdFx0Y29tcGxldGVEZWZlcnJlZC5maXJlV2l0aCggY2FsbGJhY2tDb250ZXh0LCBbIGpxWEhSLCBzdGF0dXNUZXh0IF0gKTtcblxuXHRcdFx0aWYgKCBmaXJlR2xvYmFscyApIHtcblx0XHRcdFx0Z2xvYmFsRXZlbnRDb250ZXh0LnRyaWdnZXIoIFwiYWpheENvbXBsZXRlXCIsIFsganFYSFIsIHMgXSApO1xuXG5cdFx0XHRcdC8vIEhhbmRsZSB0aGUgZ2xvYmFsIEFKQVggY291bnRlclxuXHRcdFx0XHRpZiAoICEoIC0talF1ZXJ5LmFjdGl2ZSApICkge1xuXHRcdFx0XHRcdGpRdWVyeS5ldmVudC50cmlnZ2VyKCBcImFqYXhTdG9wXCIgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBqcVhIUjtcblx0fSxcblxuXHRnZXRKU09OOiBmdW5jdGlvbiggdXJsLCBkYXRhLCBjYWxsYmFjayApIHtcblx0XHRyZXR1cm4galF1ZXJ5LmdldCggdXJsLCBkYXRhLCBjYWxsYmFjaywgXCJqc29uXCIgKTtcblx0fSxcblxuXHRnZXRTY3JpcHQ6IGZ1bmN0aW9uKCB1cmwsIGNhbGxiYWNrICkge1xuXHRcdHJldHVybiBqUXVlcnkuZ2V0KCB1cmwsIHVuZGVmaW5lZCwgY2FsbGJhY2ssIFwic2NyaXB0XCIgKTtcblx0fVxufSApO1xuXG5qUXVlcnkuZWFjaCggWyBcImdldFwiLCBcInBvc3RcIiBdLCBmdW5jdGlvbiggaSwgbWV0aG9kICkge1xuXHRqUXVlcnlbIG1ldGhvZCBdID0gZnVuY3Rpb24oIHVybCwgZGF0YSwgY2FsbGJhY2ssIHR5cGUgKSB7XG5cblx0XHQvLyBTaGlmdCBhcmd1bWVudHMgaWYgZGF0YSBhcmd1bWVudCB3YXMgb21pdHRlZFxuXHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIGRhdGEgKSApIHtcblx0XHRcdHR5cGUgPSB0eXBlIHx8IGNhbGxiYWNrO1xuXHRcdFx0Y2FsbGJhY2sgPSBkYXRhO1xuXHRcdFx0ZGF0YSA9IHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHQvLyBUaGUgdXJsIGNhbiBiZSBhbiBvcHRpb25zIG9iamVjdCAod2hpY2ggdGhlbiBtdXN0IGhhdmUgLnVybClcblx0XHRyZXR1cm4galF1ZXJ5LmFqYXgoIGpRdWVyeS5leHRlbmQoIHtcblx0XHRcdHVybDogdXJsLFxuXHRcdFx0dHlwZTogbWV0aG9kLFxuXHRcdFx0ZGF0YVR5cGU6IHR5cGUsXG5cdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0c3VjY2VzczogY2FsbGJhY2tcblx0XHR9LCBqUXVlcnkuaXNQbGFpbk9iamVjdCggdXJsICkgJiYgdXJsICkgKTtcblx0fTtcbn0gKTtcblxuXG5qUXVlcnkuX2V2YWxVcmwgPSBmdW5jdGlvbiggdXJsICkge1xuXHRyZXR1cm4galF1ZXJ5LmFqYXgoIHtcblx0XHR1cmw6IHVybCxcblxuXHRcdC8vIE1ha2UgdGhpcyBleHBsaWNpdCwgc2luY2UgdXNlciBjYW4gb3ZlcnJpZGUgdGhpcyB0aHJvdWdoIGFqYXhTZXR1cCAoIzExMjY0KVxuXHRcdHR5cGU6IFwiR0VUXCIsXG5cdFx0ZGF0YVR5cGU6IFwic2NyaXB0XCIsXG5cdFx0YXN5bmM6IGZhbHNlLFxuXHRcdGdsb2JhbDogZmFsc2UsXG5cdFx0XCJ0aHJvd3NcIjogdHJ1ZVxuXHR9ICk7XG59O1xuXG5cbmpRdWVyeS5mbi5leHRlbmQoIHtcblx0d3JhcEFsbDogZnVuY3Rpb24oIGh0bWwgKSB7XG5cdFx0dmFyIHdyYXA7XG5cblx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBodG1sICkgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbiggaSApIHtcblx0XHRcdFx0alF1ZXJ5KCB0aGlzICkud3JhcEFsbCggaHRtbC5jYWxsKCB0aGlzLCBpICkgKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpZiAoIHRoaXNbIDAgXSApIHtcblxuXHRcdFx0Ly8gVGhlIGVsZW1lbnRzIHRvIHdyYXAgdGhlIHRhcmdldCBhcm91bmRcblx0XHRcdHdyYXAgPSBqUXVlcnkoIGh0bWwsIHRoaXNbIDAgXS5vd25lckRvY3VtZW50ICkuZXEoIDAgKS5jbG9uZSggdHJ1ZSApO1xuXG5cdFx0XHRpZiAoIHRoaXNbIDAgXS5wYXJlbnROb2RlICkge1xuXHRcdFx0XHR3cmFwLmluc2VydEJlZm9yZSggdGhpc1sgMCBdICk7XG5cdFx0XHR9XG5cblx0XHRcdHdyYXAubWFwKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIGVsZW0gPSB0aGlzO1xuXG5cdFx0XHRcdHdoaWxlICggZWxlbS5maXJzdEVsZW1lbnRDaGlsZCApIHtcblx0XHRcdFx0XHRlbGVtID0gZWxlbS5maXJzdEVsZW1lbnRDaGlsZDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBlbGVtO1xuXHRcdFx0fSApLmFwcGVuZCggdGhpcyApO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdHdyYXBJbm5lcjogZnVuY3Rpb24oIGh0bWwgKSB7XG5cdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggaHRtbCApICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZWFjaCggZnVuY3Rpb24oIGkgKSB7XG5cdFx0XHRcdGpRdWVyeSggdGhpcyApLndyYXBJbm5lciggaHRtbC5jYWxsKCB0aGlzLCBpICkgKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzZWxmID0galF1ZXJ5KCB0aGlzICksXG5cdFx0XHRcdGNvbnRlbnRzID0gc2VsZi5jb250ZW50cygpO1xuXG5cdFx0XHRpZiAoIGNvbnRlbnRzLmxlbmd0aCApIHtcblx0XHRcdFx0Y29udGVudHMud3JhcEFsbCggaHRtbCApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWxmLmFwcGVuZCggaHRtbCApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fSxcblxuXHR3cmFwOiBmdW5jdGlvbiggaHRtbCApIHtcblx0XHR2YXIgaXNGdW5jdGlvbiA9IGpRdWVyeS5pc0Z1bmN0aW9uKCBodG1sICk7XG5cblx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbiggaSApIHtcblx0XHRcdGpRdWVyeSggdGhpcyApLndyYXBBbGwoIGlzRnVuY3Rpb24gPyBodG1sLmNhbGwoIHRoaXMsIGkgKSA6IGh0bWwgKTtcblx0XHR9ICk7XG5cdH0sXG5cblx0dW53cmFwOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5wYXJlbnQoKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggIWpRdWVyeS5ub2RlTmFtZSggdGhpcywgXCJib2R5XCIgKSApIHtcblx0XHRcdFx0alF1ZXJ5KCB0aGlzICkucmVwbGFjZVdpdGgoIHRoaXMuY2hpbGROb2RlcyApO1xuXHRcdFx0fVxuXHRcdH0gKS5lbmQoKTtcblx0fVxufSApO1xuXG5cbmpRdWVyeS5leHByLmZpbHRlcnMuaGlkZGVuID0gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdHJldHVybiAhalF1ZXJ5LmV4cHIuZmlsdGVycy52aXNpYmxlKCBlbGVtICk7XG59O1xualF1ZXJ5LmV4cHIuZmlsdGVycy52aXNpYmxlID0gZnVuY3Rpb24oIGVsZW0gKSB7XG5cblx0Ly8gU3VwcG9ydDogT3BlcmEgPD0gMTIuMTJcblx0Ly8gT3BlcmEgcmVwb3J0cyBvZmZzZXRXaWR0aHMgYW5kIG9mZnNldEhlaWdodHMgbGVzcyB0aGFuIHplcm8gb24gc29tZSBlbGVtZW50c1xuXHQvLyBVc2UgT1IgaW5zdGVhZCBvZiBBTkQgYXMgdGhlIGVsZW1lbnQgaXMgbm90IHZpc2libGUgaWYgZWl0aGVyIGlzIHRydWVcblx0Ly8gU2VlIHRpY2tldHMgIzEwNDA2IGFuZCAjMTMxMzJcblx0cmV0dXJuIGVsZW0ub2Zmc2V0V2lkdGggPiAwIHx8IGVsZW0ub2Zmc2V0SGVpZ2h0ID4gMCB8fCBlbGVtLmdldENsaWVudFJlY3RzKCkubGVuZ3RoID4gMDtcbn07XG5cblxuXG5cbnZhciByMjAgPSAvJTIwL2csXG5cdHJicmFja2V0ID0gL1xcW1xcXSQvLFxuXHRyQ1JMRiA9IC9cXHI/XFxuL2csXG5cdHJzdWJtaXR0ZXJUeXBlcyA9IC9eKD86c3VibWl0fGJ1dHRvbnxpbWFnZXxyZXNldHxmaWxlKSQvaSxcblx0cnN1Ym1pdHRhYmxlID0gL14oPzppbnB1dHxzZWxlY3R8dGV4dGFyZWF8a2V5Z2VuKS9pO1xuXG5mdW5jdGlvbiBidWlsZFBhcmFtcyggcHJlZml4LCBvYmosIHRyYWRpdGlvbmFsLCBhZGQgKSB7XG5cdHZhciBuYW1lO1xuXG5cdGlmICggalF1ZXJ5LmlzQXJyYXkoIG9iaiApICkge1xuXG5cdFx0Ly8gU2VyaWFsaXplIGFycmF5IGl0ZW0uXG5cdFx0alF1ZXJ5LmVhY2goIG9iaiwgZnVuY3Rpb24oIGksIHYgKSB7XG5cdFx0XHRpZiAoIHRyYWRpdGlvbmFsIHx8IHJicmFja2V0LnRlc3QoIHByZWZpeCApICkge1xuXG5cdFx0XHRcdC8vIFRyZWF0IGVhY2ggYXJyYXkgaXRlbSBhcyBhIHNjYWxhci5cblx0XHRcdFx0YWRkKCBwcmVmaXgsIHYgKTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHQvLyBJdGVtIGlzIG5vbi1zY2FsYXIgKGFycmF5IG9yIG9iamVjdCksIGVuY29kZSBpdHMgbnVtZXJpYyBpbmRleC5cblx0XHRcdFx0YnVpbGRQYXJhbXMoXG5cdFx0XHRcdFx0cHJlZml4ICsgXCJbXCIgKyAoIHR5cGVvZiB2ID09PSBcIm9iamVjdFwiICYmIHYgIT0gbnVsbCA/IGkgOiBcIlwiICkgKyBcIl1cIixcblx0XHRcdFx0XHR2LFxuXHRcdFx0XHRcdHRyYWRpdGlvbmFsLFxuXHRcdFx0XHRcdGFkZFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHR9IGVsc2UgaWYgKCAhdHJhZGl0aW9uYWwgJiYgalF1ZXJ5LnR5cGUoIG9iaiApID09PSBcIm9iamVjdFwiICkge1xuXG5cdFx0Ly8gU2VyaWFsaXplIG9iamVjdCBpdGVtLlxuXHRcdGZvciAoIG5hbWUgaW4gb2JqICkge1xuXHRcdFx0YnVpbGRQYXJhbXMoIHByZWZpeCArIFwiW1wiICsgbmFtZSArIFwiXVwiLCBvYmpbIG5hbWUgXSwgdHJhZGl0aW9uYWwsIGFkZCApO1xuXHRcdH1cblxuXHR9IGVsc2Uge1xuXG5cdFx0Ly8gU2VyaWFsaXplIHNjYWxhciBpdGVtLlxuXHRcdGFkZCggcHJlZml4LCBvYmogKTtcblx0fVxufVxuXG4vLyBTZXJpYWxpemUgYW4gYXJyYXkgb2YgZm9ybSBlbGVtZW50cyBvciBhIHNldCBvZlxuLy8ga2V5L3ZhbHVlcyBpbnRvIGEgcXVlcnkgc3RyaW5nXG5qUXVlcnkucGFyYW0gPSBmdW5jdGlvbiggYSwgdHJhZGl0aW9uYWwgKSB7XG5cdHZhciBwcmVmaXgsXG5cdFx0cyA9IFtdLFxuXHRcdGFkZCA9IGZ1bmN0aW9uKCBrZXksIHZhbHVlICkge1xuXG5cdFx0XHQvLyBJZiB2YWx1ZSBpcyBhIGZ1bmN0aW9uLCBpbnZva2UgaXQgYW5kIHJldHVybiBpdHMgdmFsdWVcblx0XHRcdHZhbHVlID0galF1ZXJ5LmlzRnVuY3Rpb24oIHZhbHVlICkgPyB2YWx1ZSgpIDogKCB2YWx1ZSA9PSBudWxsID8gXCJcIiA6IHZhbHVlICk7XG5cdFx0XHRzWyBzLmxlbmd0aCBdID0gZW5jb2RlVVJJQ29tcG9uZW50KCBrZXkgKSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KCB2YWx1ZSApO1xuXHRcdH07XG5cblx0Ly8gU2V0IHRyYWRpdGlvbmFsIHRvIHRydWUgZm9yIGpRdWVyeSA8PSAxLjMuMiBiZWhhdmlvci5cblx0aWYgKCB0cmFkaXRpb25hbCA9PT0gdW5kZWZpbmVkICkge1xuXHRcdHRyYWRpdGlvbmFsID0galF1ZXJ5LmFqYXhTZXR0aW5ncyAmJiBqUXVlcnkuYWpheFNldHRpbmdzLnRyYWRpdGlvbmFsO1xuXHR9XG5cblx0Ly8gSWYgYW4gYXJyYXkgd2FzIHBhc3NlZCBpbiwgYXNzdW1lIHRoYXQgaXQgaXMgYW4gYXJyYXkgb2YgZm9ybSBlbGVtZW50cy5cblx0aWYgKCBqUXVlcnkuaXNBcnJheSggYSApIHx8ICggYS5qcXVlcnkgJiYgIWpRdWVyeS5pc1BsYWluT2JqZWN0KCBhICkgKSApIHtcblxuXHRcdC8vIFNlcmlhbGl6ZSB0aGUgZm9ybSBlbGVtZW50c1xuXHRcdGpRdWVyeS5lYWNoKCBhLCBmdW5jdGlvbigpIHtcblx0XHRcdGFkZCggdGhpcy5uYW1lLCB0aGlzLnZhbHVlICk7XG5cdFx0fSApO1xuXG5cdH0gZWxzZSB7XG5cblx0XHQvLyBJZiB0cmFkaXRpb25hbCwgZW5jb2RlIHRoZSBcIm9sZFwiIHdheSAodGhlIHdheSAxLjMuMiBvciBvbGRlclxuXHRcdC8vIGRpZCBpdCksIG90aGVyd2lzZSBlbmNvZGUgcGFyYW1zIHJlY3Vyc2l2ZWx5LlxuXHRcdGZvciAoIHByZWZpeCBpbiBhICkge1xuXHRcdFx0YnVpbGRQYXJhbXMoIHByZWZpeCwgYVsgcHJlZml4IF0sIHRyYWRpdGlvbmFsLCBhZGQgKTtcblx0XHR9XG5cdH1cblxuXHQvLyBSZXR1cm4gdGhlIHJlc3VsdGluZyBzZXJpYWxpemF0aW9uXG5cdHJldHVybiBzLmpvaW4oIFwiJlwiICkucmVwbGFjZSggcjIwLCBcIitcIiApO1xufTtcblxualF1ZXJ5LmZuLmV4dGVuZCgge1xuXHRzZXJpYWxpemU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBqUXVlcnkucGFyYW0oIHRoaXMuc2VyaWFsaXplQXJyYXkoKSApO1xuXHR9LFxuXHRzZXJpYWxpemVBcnJheTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKCBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gQ2FuIGFkZCBwcm9wSG9vayBmb3IgXCJlbGVtZW50c1wiIHRvIGZpbHRlciBvciBhZGQgZm9ybSBlbGVtZW50c1xuXHRcdFx0dmFyIGVsZW1lbnRzID0galF1ZXJ5LnByb3AoIHRoaXMsIFwiZWxlbWVudHNcIiApO1xuXHRcdFx0cmV0dXJuIGVsZW1lbnRzID8galF1ZXJ5Lm1ha2VBcnJheSggZWxlbWVudHMgKSA6IHRoaXM7XG5cdFx0fSApXG5cdFx0LmZpbHRlciggZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgdHlwZSA9IHRoaXMudHlwZTtcblxuXHRcdFx0Ly8gVXNlIC5pcyggXCI6ZGlzYWJsZWRcIiApIHNvIHRoYXQgZmllbGRzZXRbZGlzYWJsZWRdIHdvcmtzXG5cdFx0XHRyZXR1cm4gdGhpcy5uYW1lICYmICFqUXVlcnkoIHRoaXMgKS5pcyggXCI6ZGlzYWJsZWRcIiApICYmXG5cdFx0XHRcdHJzdWJtaXR0YWJsZS50ZXN0KCB0aGlzLm5vZGVOYW1lICkgJiYgIXJzdWJtaXR0ZXJUeXBlcy50ZXN0KCB0eXBlICkgJiZcblx0XHRcdFx0KCB0aGlzLmNoZWNrZWQgfHwgIXJjaGVja2FibGVUeXBlLnRlc3QoIHR5cGUgKSApO1xuXHRcdH0gKVxuXHRcdC5tYXAoIGZ1bmN0aW9uKCBpLCBlbGVtICkge1xuXHRcdFx0dmFyIHZhbCA9IGpRdWVyeSggdGhpcyApLnZhbCgpO1xuXG5cdFx0XHRyZXR1cm4gdmFsID09IG51bGwgP1xuXHRcdFx0XHRudWxsIDpcblx0XHRcdFx0alF1ZXJ5LmlzQXJyYXkoIHZhbCApID9cblx0XHRcdFx0XHRqUXVlcnkubWFwKCB2YWwsIGZ1bmN0aW9uKCB2YWwgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4geyBuYW1lOiBlbGVtLm5hbWUsIHZhbHVlOiB2YWwucmVwbGFjZSggckNSTEYsIFwiXFxyXFxuXCIgKSB9O1xuXHRcdFx0XHRcdH0gKSA6XG5cdFx0XHRcdFx0eyBuYW1lOiBlbGVtLm5hbWUsIHZhbHVlOiB2YWwucmVwbGFjZSggckNSTEYsIFwiXFxyXFxuXCIgKSB9O1xuXHRcdH0gKS5nZXQoKTtcblx0fVxufSApO1xuXG5cbmpRdWVyeS5hamF4U2V0dGluZ3MueGhyID0gZnVuY3Rpb24oKSB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIG5ldyB3aW5kb3cuWE1MSHR0cFJlcXVlc3QoKTtcblx0fSBjYXRjaCAoIGUgKSB7fVxufTtcblxudmFyIHhoclN1Y2Nlc3NTdGF0dXMgPSB7XG5cblx0XHQvLyBGaWxlIHByb3RvY29sIGFsd2F5cyB5aWVsZHMgc3RhdHVzIGNvZGUgMCwgYXNzdW1lIDIwMFxuXHRcdDA6IDIwMCxcblxuXHRcdC8vIFN1cHBvcnQ6IElFOVxuXHRcdC8vICMxNDUwOiBzb21ldGltZXMgSUUgcmV0dXJucyAxMjIzIHdoZW4gaXQgc2hvdWxkIGJlIDIwNFxuXHRcdDEyMjM6IDIwNFxuXHR9LFxuXHR4aHJTdXBwb3J0ZWQgPSBqUXVlcnkuYWpheFNldHRpbmdzLnhocigpO1xuXG5zdXBwb3J0LmNvcnMgPSAhIXhoclN1cHBvcnRlZCAmJiAoIFwid2l0aENyZWRlbnRpYWxzXCIgaW4geGhyU3VwcG9ydGVkICk7XG5zdXBwb3J0LmFqYXggPSB4aHJTdXBwb3J0ZWQgPSAhIXhoclN1cHBvcnRlZDtcblxualF1ZXJ5LmFqYXhUcmFuc3BvcnQoIGZ1bmN0aW9uKCBvcHRpb25zICkge1xuXHR2YXIgY2FsbGJhY2ssIGVycm9yQ2FsbGJhY2s7XG5cblx0Ly8gQ3Jvc3MgZG9tYWluIG9ubHkgYWxsb3dlZCBpZiBzdXBwb3J0ZWQgdGhyb3VnaCBYTUxIdHRwUmVxdWVzdFxuXHRpZiAoIHN1cHBvcnQuY29ycyB8fCB4aHJTdXBwb3J0ZWQgJiYgIW9wdGlvbnMuY3Jvc3NEb21haW4gKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNlbmQ6IGZ1bmN0aW9uKCBoZWFkZXJzLCBjb21wbGV0ZSApIHtcblx0XHRcdFx0dmFyIGksXG5cdFx0XHRcdFx0eGhyID0gb3B0aW9ucy54aHIoKTtcblxuXHRcdFx0XHR4aHIub3Blbihcblx0XHRcdFx0XHRvcHRpb25zLnR5cGUsXG5cdFx0XHRcdFx0b3B0aW9ucy51cmwsXG5cdFx0XHRcdFx0b3B0aW9ucy5hc3luYyxcblx0XHRcdFx0XHRvcHRpb25zLnVzZXJuYW1lLFxuXHRcdFx0XHRcdG9wdGlvbnMucGFzc3dvcmRcblx0XHRcdFx0KTtcblxuXHRcdFx0XHQvLyBBcHBseSBjdXN0b20gZmllbGRzIGlmIHByb3ZpZGVkXG5cdFx0XHRcdGlmICggb3B0aW9ucy54aHJGaWVsZHMgKSB7XG5cdFx0XHRcdFx0Zm9yICggaSBpbiBvcHRpb25zLnhockZpZWxkcyApIHtcblx0XHRcdFx0XHRcdHhoclsgaSBdID0gb3B0aW9ucy54aHJGaWVsZHNbIGkgXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBPdmVycmlkZSBtaW1lIHR5cGUgaWYgbmVlZGVkXG5cdFx0XHRcdGlmICggb3B0aW9ucy5taW1lVHlwZSAmJiB4aHIub3ZlcnJpZGVNaW1lVHlwZSApIHtcblx0XHRcdFx0XHR4aHIub3ZlcnJpZGVNaW1lVHlwZSggb3B0aW9ucy5taW1lVHlwZSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gWC1SZXF1ZXN0ZWQtV2l0aCBoZWFkZXJcblx0XHRcdFx0Ly8gRm9yIGNyb3NzLWRvbWFpbiByZXF1ZXN0cywgc2VlaW5nIGFzIGNvbmRpdGlvbnMgZm9yIGEgcHJlZmxpZ2h0IGFyZVxuXHRcdFx0XHQvLyBha2luIHRvIGEgamlnc2F3IHB1enpsZSwgd2Ugc2ltcGx5IG5ldmVyIHNldCBpdCB0byBiZSBzdXJlLlxuXHRcdFx0XHQvLyAoaXQgY2FuIGFsd2F5cyBiZSBzZXQgb24gYSBwZXItcmVxdWVzdCBiYXNpcyBvciBldmVuIHVzaW5nIGFqYXhTZXR1cClcblx0XHRcdFx0Ly8gRm9yIHNhbWUtZG9tYWluIHJlcXVlc3RzLCB3b24ndCBjaGFuZ2UgaGVhZGVyIGlmIGFscmVhZHkgcHJvdmlkZWQuXG5cdFx0XHRcdGlmICggIW9wdGlvbnMuY3Jvc3NEb21haW4gJiYgIWhlYWRlcnNbIFwiWC1SZXF1ZXN0ZWQtV2l0aFwiIF0gKSB7XG5cdFx0XHRcdFx0aGVhZGVyc1sgXCJYLVJlcXVlc3RlZC1XaXRoXCIgXSA9IFwiWE1MSHR0cFJlcXVlc3RcIjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFNldCBoZWFkZXJzXG5cdFx0XHRcdGZvciAoIGkgaW4gaGVhZGVycyApIHtcblx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggaSwgaGVhZGVyc1sgaSBdICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBDYWxsYmFja1xuXHRcdFx0XHRjYWxsYmFjayA9IGZ1bmN0aW9uKCB0eXBlICkge1xuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGlmICggY2FsbGJhY2sgKSB7XG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrID0gZXJyb3JDYWxsYmFjayA9IHhoci5vbmxvYWQgPVxuXHRcdFx0XHRcdFx0XHRcdHhoci5vbmVycm9yID0geGhyLm9uYWJvcnQgPSB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcblxuXHRcdFx0XHRcdFx0XHRpZiAoIHR5cGUgPT09IFwiYWJvcnRcIiApIHtcblx0XHRcdFx0XHRcdFx0XHR4aHIuYWJvcnQoKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICggdHlwZSA9PT0gXCJlcnJvclwiICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUU5XG5cdFx0XHRcdFx0XHRcdFx0Ly8gT24gYSBtYW51YWwgbmF0aXZlIGFib3J0LCBJRTkgdGhyb3dzXG5cdFx0XHRcdFx0XHRcdFx0Ly8gZXJyb3JzIG9uIGFueSBwcm9wZXJ0eSBhY2Nlc3MgdGhhdCBpcyBub3QgcmVhZHlTdGF0ZVxuXHRcdFx0XHRcdFx0XHRcdGlmICggdHlwZW9mIHhoci5zdGF0dXMgIT09IFwibnVtYmVyXCIgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb21wbGV0ZSggMCwgXCJlcnJvclwiICk7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbXBsZXRlKFxuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEZpbGU6IHByb3RvY29sIGFsd2F5cyB5aWVsZHMgc3RhdHVzIDA7IHNlZSAjODYwNSwgIzE0MjA3XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHhoci5zdGF0dXMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHhoci5zdGF0dXNUZXh0XG5cdFx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRjb21wbGV0ZShcblx0XHRcdFx0XHRcdFx0XHRcdHhoclN1Y2Nlc3NTdGF0dXNbIHhoci5zdGF0dXMgXSB8fCB4aHIuc3RhdHVzLFxuXHRcdFx0XHRcdFx0XHRcdFx0eGhyLnN0YXR1c1RleHQsXG5cblx0XHRcdFx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFOSBvbmx5XG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBJRTkgaGFzIG5vIFhIUjIgYnV0IHRocm93cyBvbiBiaW5hcnkgKHRyYWMtMTE0MjYpXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBGb3IgWEhSMiBub24tdGV4dCwgbGV0IHRoZSBjYWxsZXIgaGFuZGxlIGl0IChnaC0yNDk4KVxuXHRcdFx0XHRcdFx0XHRcdFx0KCB4aHIucmVzcG9uc2VUeXBlIHx8IFwidGV4dFwiICkgIT09IFwidGV4dFwiICB8fFxuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZW9mIHhoci5yZXNwb25zZVRleHQgIT09IFwic3RyaW5nXCIgP1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR7IGJpbmFyeTogeGhyLnJlc3BvbnNlIH0gOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHR7IHRleHQ6IHhoci5yZXNwb25zZVRleHQgfSxcblx0XHRcdFx0XHRcdFx0XHRcdHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKVxuXHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdC8vIExpc3RlbiB0byBldmVudHNcblx0XHRcdFx0eGhyLm9ubG9hZCA9IGNhbGxiYWNrKCk7XG5cdFx0XHRcdGVycm9yQ2FsbGJhY2sgPSB4aHIub25lcnJvciA9IGNhbGxiYWNrKCBcImVycm9yXCIgKTtcblxuXHRcdFx0XHQvLyBTdXBwb3J0OiBJRTlcblx0XHRcdFx0Ly8gVXNlIG9ucmVhZHlzdGF0ZWNoYW5nZSB0byByZXBsYWNlIG9uYWJvcnRcblx0XHRcdFx0Ly8gdG8gaGFuZGxlIHVuY2F1Z2h0IGFib3J0c1xuXHRcdFx0XHRpZiAoIHhoci5vbmFib3J0ICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdFx0eGhyLm9uYWJvcnQgPSBlcnJvckNhbGxiYWNrO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcblxuXHRcdFx0XHRcdFx0Ly8gQ2hlY2sgcmVhZHlTdGF0ZSBiZWZvcmUgdGltZW91dCBhcyBpdCBjaGFuZ2VzXG5cdFx0XHRcdFx0XHRpZiAoIHhoci5yZWFkeVN0YXRlID09PSA0ICkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIEFsbG93IG9uZXJyb3IgdG8gYmUgY2FsbGVkIGZpcnN0LFxuXHRcdFx0XHRcdFx0XHQvLyBidXQgdGhhdCB3aWxsIG5vdCBoYW5kbGUgYSBuYXRpdmUgYWJvcnRcblx0XHRcdFx0XHRcdFx0Ly8gQWxzbywgc2F2ZSBlcnJvckNhbGxiYWNrIHRvIGEgdmFyaWFibGVcblx0XHRcdFx0XHRcdFx0Ly8gYXMgeGhyLm9uZXJyb3IgY2Fubm90IGJlIGFjY2Vzc2VkXG5cdFx0XHRcdFx0XHRcdHdpbmRvdy5zZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoIGNhbGxiYWNrICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JDYWxsYmFjaygpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBDcmVhdGUgdGhlIGFib3J0IGNhbGxiYWNrXG5cdFx0XHRcdGNhbGxiYWNrID0gY2FsbGJhY2soIFwiYWJvcnRcIiApO1xuXG5cdFx0XHRcdHRyeSB7XG5cblx0XHRcdFx0XHQvLyBEbyBzZW5kIHRoZSByZXF1ZXN0ICh0aGlzIG1heSByYWlzZSBhbiBleGNlcHRpb24pXG5cdFx0XHRcdFx0eGhyLnNlbmQoIG9wdGlvbnMuaGFzQ29udGVudCAmJiBvcHRpb25zLmRhdGEgfHwgbnVsbCApO1xuXHRcdFx0XHR9IGNhdGNoICggZSApIHtcblxuXHRcdFx0XHRcdC8vICMxNDY4MzogT25seSByZXRocm93IGlmIHRoaXMgaGFzbid0IGJlZW4gbm90aWZpZWQgYXMgYW4gZXJyb3IgeWV0XG5cdFx0XHRcdFx0aWYgKCBjYWxsYmFjayApIHtcblx0XHRcdFx0XHRcdHRocm93IGU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHRhYm9ydDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggY2FsbGJhY2sgKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2soKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdH1cbn0gKTtcblxuXG5cblxuLy8gSW5zdGFsbCBzY3JpcHQgZGF0YVR5cGVcbmpRdWVyeS5hamF4U2V0dXAoIHtcblx0YWNjZXB0czoge1xuXHRcdHNjcmlwdDogXCJ0ZXh0L2phdmFzY3JpcHQsIGFwcGxpY2F0aW9uL2phdmFzY3JpcHQsIFwiICtcblx0XHRcdFwiYXBwbGljYXRpb24vZWNtYXNjcmlwdCwgYXBwbGljYXRpb24veC1lY21hc2NyaXB0XCJcblx0fSxcblx0Y29udGVudHM6IHtcblx0XHRzY3JpcHQ6IC9cXGIoPzpqYXZhfGVjbWEpc2NyaXB0XFxiL1xuXHR9LFxuXHRjb252ZXJ0ZXJzOiB7XG5cdFx0XCJ0ZXh0IHNjcmlwdFwiOiBmdW5jdGlvbiggdGV4dCApIHtcblx0XHRcdGpRdWVyeS5nbG9iYWxFdmFsKCB0ZXh0ICk7XG5cdFx0XHRyZXR1cm4gdGV4dDtcblx0XHR9XG5cdH1cbn0gKTtcblxuLy8gSGFuZGxlIGNhY2hlJ3Mgc3BlY2lhbCBjYXNlIGFuZCBjcm9zc0RvbWFpblxualF1ZXJ5LmFqYXhQcmVmaWx0ZXIoIFwic2NyaXB0XCIsIGZ1bmN0aW9uKCBzICkge1xuXHRpZiAoIHMuY2FjaGUgPT09IHVuZGVmaW5lZCApIHtcblx0XHRzLmNhY2hlID0gZmFsc2U7XG5cdH1cblx0aWYgKCBzLmNyb3NzRG9tYWluICkge1xuXHRcdHMudHlwZSA9IFwiR0VUXCI7XG5cdH1cbn0gKTtcblxuLy8gQmluZCBzY3JpcHQgdGFnIGhhY2sgdHJhbnNwb3J0XG5qUXVlcnkuYWpheFRyYW5zcG9ydCggXCJzY3JpcHRcIiwgZnVuY3Rpb24oIHMgKSB7XG5cblx0Ly8gVGhpcyB0cmFuc3BvcnQgb25seSBkZWFscyB3aXRoIGNyb3NzIGRvbWFpbiByZXF1ZXN0c1xuXHRpZiAoIHMuY3Jvc3NEb21haW4gKSB7XG5cdFx0dmFyIHNjcmlwdCwgY2FsbGJhY2s7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNlbmQ6IGZ1bmN0aW9uKCBfLCBjb21wbGV0ZSApIHtcblx0XHRcdFx0c2NyaXB0ID0galF1ZXJ5KCBcIjxzY3JpcHQ+XCIgKS5wcm9wKCB7XG5cdFx0XHRcdFx0Y2hhcnNldDogcy5zY3JpcHRDaGFyc2V0LFxuXHRcdFx0XHRcdHNyYzogcy51cmxcblx0XHRcdFx0fSApLm9uKFxuXHRcdFx0XHRcdFwibG9hZCBlcnJvclwiLFxuXHRcdFx0XHRcdGNhbGxiYWNrID0gZnVuY3Rpb24oIGV2dCApIHtcblx0XHRcdFx0XHRcdHNjcmlwdC5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdGNhbGxiYWNrID0gbnVsbDtcblx0XHRcdFx0XHRcdGlmICggZXZ0ICkge1xuXHRcdFx0XHRcdFx0XHRjb21wbGV0ZSggZXZ0LnR5cGUgPT09IFwiZXJyb3JcIiA/IDQwNCA6IDIwMCwgZXZ0LnR5cGUgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0Ly8gVXNlIG5hdGl2ZSBET00gbWFuaXB1bGF0aW9uIHRvIGF2b2lkIG91ciBkb21NYW5pcCBBSkFYIHRyaWNrZXJ5XG5cdFx0XHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoIHNjcmlwdFsgMCBdICk7XG5cdFx0XHR9LFxuXHRcdFx0YWJvcnQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoIGNhbGxiYWNrICkge1xuXHRcdFx0XHRcdGNhbGxiYWNrKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHR9XG59ICk7XG5cblxuXG5cbnZhciBvbGRDYWxsYmFja3MgPSBbXSxcblx0cmpzb25wID0gLyg9KVxcPyg/PSZ8JCl8XFw/XFw/LztcblxuLy8gRGVmYXVsdCBqc29ucCBzZXR0aW5nc1xualF1ZXJ5LmFqYXhTZXR1cCgge1xuXHRqc29ucDogXCJjYWxsYmFja1wiLFxuXHRqc29ucENhbGxiYWNrOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgY2FsbGJhY2sgPSBvbGRDYWxsYmFja3MucG9wKCkgfHwgKCBqUXVlcnkuZXhwYW5kbyArIFwiX1wiICsgKCBub25jZSsrICkgKTtcblx0XHR0aGlzWyBjYWxsYmFjayBdID0gdHJ1ZTtcblx0XHRyZXR1cm4gY2FsbGJhY2s7XG5cdH1cbn0gKTtcblxuLy8gRGV0ZWN0LCBub3JtYWxpemUgb3B0aW9ucyBhbmQgaW5zdGFsbCBjYWxsYmFja3MgZm9yIGpzb25wIHJlcXVlc3RzXG5qUXVlcnkuYWpheFByZWZpbHRlciggXCJqc29uIGpzb25wXCIsIGZ1bmN0aW9uKCBzLCBvcmlnaW5hbFNldHRpbmdzLCBqcVhIUiApIHtcblxuXHR2YXIgY2FsbGJhY2tOYW1lLCBvdmVyd3JpdHRlbiwgcmVzcG9uc2VDb250YWluZXIsXG5cdFx0anNvblByb3AgPSBzLmpzb25wICE9PSBmYWxzZSAmJiAoIHJqc29ucC50ZXN0KCBzLnVybCApID9cblx0XHRcdFwidXJsXCIgOlxuXHRcdFx0dHlwZW9mIHMuZGF0YSA9PT0gXCJzdHJpbmdcIiAmJlxuXHRcdFx0XHQoIHMuY29udGVudFR5cGUgfHwgXCJcIiApXG5cdFx0XHRcdFx0LmluZGV4T2YoIFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIgKSA9PT0gMCAmJlxuXHRcdFx0XHRyanNvbnAudGVzdCggcy5kYXRhICkgJiYgXCJkYXRhXCJcblx0XHQpO1xuXG5cdC8vIEhhbmRsZSBpZmYgdGhlIGV4cGVjdGVkIGRhdGEgdHlwZSBpcyBcImpzb25wXCIgb3Igd2UgaGF2ZSBhIHBhcmFtZXRlciB0byBzZXRcblx0aWYgKCBqc29uUHJvcCB8fCBzLmRhdGFUeXBlc1sgMCBdID09PSBcImpzb25wXCIgKSB7XG5cblx0XHQvLyBHZXQgY2FsbGJhY2sgbmFtZSwgcmVtZW1iZXJpbmcgcHJlZXhpc3RpbmcgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIGl0XG5cdFx0Y2FsbGJhY2tOYW1lID0gcy5qc29ucENhbGxiYWNrID0galF1ZXJ5LmlzRnVuY3Rpb24oIHMuanNvbnBDYWxsYmFjayApID9cblx0XHRcdHMuanNvbnBDYWxsYmFjaygpIDpcblx0XHRcdHMuanNvbnBDYWxsYmFjaztcblxuXHRcdC8vIEluc2VydCBjYWxsYmFjayBpbnRvIHVybCBvciBmb3JtIGRhdGFcblx0XHRpZiAoIGpzb25Qcm9wICkge1xuXHRcdFx0c1sganNvblByb3AgXSA9IHNbIGpzb25Qcm9wIF0ucmVwbGFjZSggcmpzb25wLCBcIiQxXCIgKyBjYWxsYmFja05hbWUgKTtcblx0XHR9IGVsc2UgaWYgKCBzLmpzb25wICE9PSBmYWxzZSApIHtcblx0XHRcdHMudXJsICs9ICggcnF1ZXJ5LnRlc3QoIHMudXJsICkgPyBcIiZcIiA6IFwiP1wiICkgKyBzLmpzb25wICsgXCI9XCIgKyBjYWxsYmFja05hbWU7XG5cdFx0fVxuXG5cdFx0Ly8gVXNlIGRhdGEgY29udmVydGVyIHRvIHJldHJpZXZlIGpzb24gYWZ0ZXIgc2NyaXB0IGV4ZWN1dGlvblxuXHRcdHMuY29udmVydGVyc1sgXCJzY3JpcHQganNvblwiIF0gPSBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggIXJlc3BvbnNlQ29udGFpbmVyICkge1xuXHRcdFx0XHRqUXVlcnkuZXJyb3IoIGNhbGxiYWNrTmFtZSArIFwiIHdhcyBub3QgY2FsbGVkXCIgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXNwb25zZUNvbnRhaW5lclsgMCBdO1xuXHRcdH07XG5cblx0XHQvLyBGb3JjZSBqc29uIGRhdGFUeXBlXG5cdFx0cy5kYXRhVHlwZXNbIDAgXSA9IFwianNvblwiO1xuXG5cdFx0Ly8gSW5zdGFsbCBjYWxsYmFja1xuXHRcdG92ZXJ3cml0dGVuID0gd2luZG93WyBjYWxsYmFja05hbWUgXTtcblx0XHR3aW5kb3dbIGNhbGxiYWNrTmFtZSBdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXNwb25zZUNvbnRhaW5lciA9IGFyZ3VtZW50cztcblx0XHR9O1xuXG5cdFx0Ly8gQ2xlYW4tdXAgZnVuY3Rpb24gKGZpcmVzIGFmdGVyIGNvbnZlcnRlcnMpXG5cdFx0anFYSFIuYWx3YXlzKCBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gSWYgcHJldmlvdXMgdmFsdWUgZGlkbid0IGV4aXN0IC0gcmVtb3ZlIGl0XG5cdFx0XHRpZiAoIG92ZXJ3cml0dGVuID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdGpRdWVyeSggd2luZG93ICkucmVtb3ZlUHJvcCggY2FsbGJhY2tOYW1lICk7XG5cblx0XHRcdC8vIE90aGVyd2lzZSByZXN0b3JlIHByZWV4aXN0aW5nIHZhbHVlXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR3aW5kb3dbIGNhbGxiYWNrTmFtZSBdID0gb3ZlcndyaXR0ZW47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNhdmUgYmFjayBhcyBmcmVlXG5cdFx0XHRpZiAoIHNbIGNhbGxiYWNrTmFtZSBdICkge1xuXG5cdFx0XHRcdC8vIE1ha2Ugc3VyZSB0aGF0IHJlLXVzaW5nIHRoZSBvcHRpb25zIGRvZXNuJ3Qgc2NyZXcgdGhpbmdzIGFyb3VuZFxuXHRcdFx0XHRzLmpzb25wQ2FsbGJhY2sgPSBvcmlnaW5hbFNldHRpbmdzLmpzb25wQ2FsbGJhY2s7XG5cblx0XHRcdFx0Ly8gU2F2ZSB0aGUgY2FsbGJhY2sgbmFtZSBmb3IgZnV0dXJlIHVzZVxuXHRcdFx0XHRvbGRDYWxsYmFja3MucHVzaCggY2FsbGJhY2tOYW1lICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIENhbGwgaWYgaXQgd2FzIGEgZnVuY3Rpb24gYW5kIHdlIGhhdmUgYSByZXNwb25zZVxuXHRcdFx0aWYgKCByZXNwb25zZUNvbnRhaW5lciAmJiBqUXVlcnkuaXNGdW5jdGlvbiggb3ZlcndyaXR0ZW4gKSApIHtcblx0XHRcdFx0b3ZlcndyaXR0ZW4oIHJlc3BvbnNlQ29udGFpbmVyWyAwIF0gKTtcblx0XHRcdH1cblxuXHRcdFx0cmVzcG9uc2VDb250YWluZXIgPSBvdmVyd3JpdHRlbiA9IHVuZGVmaW5lZDtcblx0XHR9ICk7XG5cblx0XHQvLyBEZWxlZ2F0ZSB0byBzY3JpcHRcblx0XHRyZXR1cm4gXCJzY3JpcHRcIjtcblx0fVxufSApO1xuXG5cblxuXG4vLyBBcmd1bWVudCBcImRhdGFcIiBzaG91bGQgYmUgc3RyaW5nIG9mIGh0bWxcbi8vIGNvbnRleHQgKG9wdGlvbmFsKTogSWYgc3BlY2lmaWVkLCB0aGUgZnJhZ21lbnQgd2lsbCBiZSBjcmVhdGVkIGluIHRoaXMgY29udGV4dCxcbi8vIGRlZmF1bHRzIHRvIGRvY3VtZW50XG4vLyBrZWVwU2NyaXB0cyAob3B0aW9uYWwpOiBJZiB0cnVlLCB3aWxsIGluY2x1ZGUgc2NyaXB0cyBwYXNzZWQgaW4gdGhlIGh0bWwgc3RyaW5nXG5qUXVlcnkucGFyc2VIVE1MID0gZnVuY3Rpb24oIGRhdGEsIGNvbnRleHQsIGtlZXBTY3JpcHRzICkge1xuXHRpZiAoICFkYXRhIHx8IHR5cGVvZiBkYXRhICE9PSBcInN0cmluZ1wiICkge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGlmICggdHlwZW9mIGNvbnRleHQgPT09IFwiYm9vbGVhblwiICkge1xuXHRcdGtlZXBTY3JpcHRzID0gY29udGV4dDtcblx0XHRjb250ZXh0ID0gZmFsc2U7XG5cdH1cblx0Y29udGV4dCA9IGNvbnRleHQgfHwgZG9jdW1lbnQ7XG5cblx0dmFyIHBhcnNlZCA9IHJzaW5nbGVUYWcuZXhlYyggZGF0YSApLFxuXHRcdHNjcmlwdHMgPSAha2VlcFNjcmlwdHMgJiYgW107XG5cblx0Ly8gU2luZ2xlIHRhZ1xuXHRpZiAoIHBhcnNlZCApIHtcblx0XHRyZXR1cm4gWyBjb250ZXh0LmNyZWF0ZUVsZW1lbnQoIHBhcnNlZFsgMSBdICkgXTtcblx0fVxuXG5cdHBhcnNlZCA9IGJ1aWxkRnJhZ21lbnQoIFsgZGF0YSBdLCBjb250ZXh0LCBzY3JpcHRzICk7XG5cblx0aWYgKCBzY3JpcHRzICYmIHNjcmlwdHMubGVuZ3RoICkge1xuXHRcdGpRdWVyeSggc2NyaXB0cyApLnJlbW92ZSgpO1xuXHR9XG5cblx0cmV0dXJuIGpRdWVyeS5tZXJnZSggW10sIHBhcnNlZC5jaGlsZE5vZGVzICk7XG59O1xuXG5cbi8vIEtlZXAgYSBjb3B5IG9mIHRoZSBvbGQgbG9hZCBtZXRob2RcbnZhciBfbG9hZCA9IGpRdWVyeS5mbi5sb2FkO1xuXG4vKipcbiAqIExvYWQgYSB1cmwgaW50byBhIHBhZ2VcbiAqL1xualF1ZXJ5LmZuLmxvYWQgPSBmdW5jdGlvbiggdXJsLCBwYXJhbXMsIGNhbGxiYWNrICkge1xuXHRpZiAoIHR5cGVvZiB1cmwgIT09IFwic3RyaW5nXCIgJiYgX2xvYWQgKSB7XG5cdFx0cmV0dXJuIF9sb2FkLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcblx0fVxuXG5cdHZhciBzZWxlY3RvciwgdHlwZSwgcmVzcG9uc2UsXG5cdFx0c2VsZiA9IHRoaXMsXG5cdFx0b2ZmID0gdXJsLmluZGV4T2YoIFwiIFwiICk7XG5cblx0aWYgKCBvZmYgPiAtMSApIHtcblx0XHRzZWxlY3RvciA9IGpRdWVyeS50cmltKCB1cmwuc2xpY2UoIG9mZiApICk7XG5cdFx0dXJsID0gdXJsLnNsaWNlKCAwLCBvZmYgKTtcblx0fVxuXG5cdC8vIElmIGl0J3MgYSBmdW5jdGlvblxuXHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBwYXJhbXMgKSApIHtcblxuXHRcdC8vIFdlIGFzc3VtZSB0aGF0IGl0J3MgdGhlIGNhbGxiYWNrXG5cdFx0Y2FsbGJhY2sgPSBwYXJhbXM7XG5cdFx0cGFyYW1zID0gdW5kZWZpbmVkO1xuXG5cdC8vIE90aGVyd2lzZSwgYnVpbGQgYSBwYXJhbSBzdHJpbmdcblx0fSBlbHNlIGlmICggcGFyYW1zICYmIHR5cGVvZiBwYXJhbXMgPT09IFwib2JqZWN0XCIgKSB7XG5cdFx0dHlwZSA9IFwiUE9TVFwiO1xuXHR9XG5cblx0Ly8gSWYgd2UgaGF2ZSBlbGVtZW50cyB0byBtb2RpZnksIG1ha2UgdGhlIHJlcXVlc3Rcblx0aWYgKCBzZWxmLmxlbmd0aCA+IDAgKSB7XG5cdFx0alF1ZXJ5LmFqYXgoIHtcblx0XHRcdHVybDogdXJsLFxuXG5cdFx0XHQvLyBJZiBcInR5cGVcIiB2YXJpYWJsZSBpcyB1bmRlZmluZWQsIHRoZW4gXCJHRVRcIiBtZXRob2Qgd2lsbCBiZSB1c2VkLlxuXHRcdFx0Ly8gTWFrZSB2YWx1ZSBvZiB0aGlzIGZpZWxkIGV4cGxpY2l0IHNpbmNlXG5cdFx0XHQvLyB1c2VyIGNhbiBvdmVycmlkZSBpdCB0aHJvdWdoIGFqYXhTZXR1cCBtZXRob2Rcblx0XHRcdHR5cGU6IHR5cGUgfHwgXCJHRVRcIixcblx0XHRcdGRhdGFUeXBlOiBcImh0bWxcIixcblx0XHRcdGRhdGE6IHBhcmFtc1xuXHRcdH0gKS5kb25lKCBmdW5jdGlvbiggcmVzcG9uc2VUZXh0ICkge1xuXG5cdFx0XHQvLyBTYXZlIHJlc3BvbnNlIGZvciB1c2UgaW4gY29tcGxldGUgY2FsbGJhY2tcblx0XHRcdHJlc3BvbnNlID0gYXJndW1lbnRzO1xuXG5cdFx0XHRzZWxmLmh0bWwoIHNlbGVjdG9yID9cblxuXHRcdFx0XHQvLyBJZiBhIHNlbGVjdG9yIHdhcyBzcGVjaWZpZWQsIGxvY2F0ZSB0aGUgcmlnaHQgZWxlbWVudHMgaW4gYSBkdW1teSBkaXZcblx0XHRcdFx0Ly8gRXhjbHVkZSBzY3JpcHRzIHRvIGF2b2lkIElFICdQZXJtaXNzaW9uIERlbmllZCcgZXJyb3JzXG5cdFx0XHRcdGpRdWVyeSggXCI8ZGl2PlwiICkuYXBwZW5kKCBqUXVlcnkucGFyc2VIVE1MKCByZXNwb25zZVRleHQgKSApLmZpbmQoIHNlbGVjdG9yICkgOlxuXG5cdFx0XHRcdC8vIE90aGVyd2lzZSB1c2UgdGhlIGZ1bGwgcmVzdWx0XG5cdFx0XHRcdHJlc3BvbnNlVGV4dCApO1xuXG5cdFx0Ly8gSWYgdGhlIHJlcXVlc3Qgc3VjY2VlZHMsIHRoaXMgZnVuY3Rpb24gZ2V0cyBcImRhdGFcIiwgXCJzdGF0dXNcIiwgXCJqcVhIUlwiXG5cdFx0Ly8gYnV0IHRoZXkgYXJlIGlnbm9yZWQgYmVjYXVzZSByZXNwb25zZSB3YXMgc2V0IGFib3ZlLlxuXHRcdC8vIElmIGl0IGZhaWxzLCB0aGlzIGZ1bmN0aW9uIGdldHMgXCJqcVhIUlwiLCBcInN0YXR1c1wiLCBcImVycm9yXCJcblx0XHR9ICkuYWx3YXlzKCBjYWxsYmFjayAmJiBmdW5jdGlvbigganFYSFIsIHN0YXR1cyApIHtcblx0XHRcdHNlbGYuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNhbGxiYWNrLmFwcGx5KCB0aGlzLCByZXNwb25zZSB8fCBbIGpxWEhSLnJlc3BvbnNlVGV4dCwgc3RhdHVzLCBqcVhIUiBdICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG5cblxuXG4vLyBBdHRhY2ggYSBidW5jaCBvZiBmdW5jdGlvbnMgZm9yIGhhbmRsaW5nIGNvbW1vbiBBSkFYIGV2ZW50c1xualF1ZXJ5LmVhY2goIFtcblx0XCJhamF4U3RhcnRcIixcblx0XCJhamF4U3RvcFwiLFxuXHRcImFqYXhDb21wbGV0ZVwiLFxuXHRcImFqYXhFcnJvclwiLFxuXHRcImFqYXhTdWNjZXNzXCIsXG5cdFwiYWpheFNlbmRcIlxuXSwgZnVuY3Rpb24oIGksIHR5cGUgKSB7XG5cdGpRdWVyeS5mblsgdHlwZSBdID0gZnVuY3Rpb24oIGZuICkge1xuXHRcdHJldHVybiB0aGlzLm9uKCB0eXBlLCBmbiApO1xuXHR9O1xufSApO1xuXG5cblxuXG5qUXVlcnkuZXhwci5maWx0ZXJzLmFuaW1hdGVkID0gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdHJldHVybiBqUXVlcnkuZ3JlcCggalF1ZXJ5LnRpbWVycywgZnVuY3Rpb24oIGZuICkge1xuXHRcdHJldHVybiBlbGVtID09PSBmbi5lbGVtO1xuXHR9ICkubGVuZ3RoO1xufTtcblxuXG5cblxuLyoqXG4gKiBHZXRzIGEgd2luZG93IGZyb20gYW4gZWxlbWVudFxuICovXG5mdW5jdGlvbiBnZXRXaW5kb3coIGVsZW0gKSB7XG5cdHJldHVybiBqUXVlcnkuaXNXaW5kb3coIGVsZW0gKSA/IGVsZW0gOiBlbGVtLm5vZGVUeXBlID09PSA5ICYmIGVsZW0uZGVmYXVsdFZpZXc7XG59XG5cbmpRdWVyeS5vZmZzZXQgPSB7XG5cdHNldE9mZnNldDogZnVuY3Rpb24oIGVsZW0sIG9wdGlvbnMsIGkgKSB7XG5cdFx0dmFyIGN1clBvc2l0aW9uLCBjdXJMZWZ0LCBjdXJDU1NUb3AsIGN1clRvcCwgY3VyT2Zmc2V0LCBjdXJDU1NMZWZ0LCBjYWxjdWxhdGVQb3NpdGlvbixcblx0XHRcdHBvc2l0aW9uID0galF1ZXJ5LmNzcyggZWxlbSwgXCJwb3NpdGlvblwiICksXG5cdFx0XHRjdXJFbGVtID0galF1ZXJ5KCBlbGVtICksXG5cdFx0XHRwcm9wcyA9IHt9O1xuXG5cdFx0Ly8gU2V0IHBvc2l0aW9uIGZpcnN0LCBpbi1jYXNlIHRvcC9sZWZ0IGFyZSBzZXQgZXZlbiBvbiBzdGF0aWMgZWxlbVxuXHRcdGlmICggcG9zaXRpb24gPT09IFwic3RhdGljXCIgKSB7XG5cdFx0XHRlbGVtLnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiO1xuXHRcdH1cblxuXHRcdGN1ck9mZnNldCA9IGN1ckVsZW0ub2Zmc2V0KCk7XG5cdFx0Y3VyQ1NTVG9wID0galF1ZXJ5LmNzcyggZWxlbSwgXCJ0b3BcIiApO1xuXHRcdGN1ckNTU0xlZnQgPSBqUXVlcnkuY3NzKCBlbGVtLCBcImxlZnRcIiApO1xuXHRcdGNhbGN1bGF0ZVBvc2l0aW9uID0gKCBwb3NpdGlvbiA9PT0gXCJhYnNvbHV0ZVwiIHx8IHBvc2l0aW9uID09PSBcImZpeGVkXCIgKSAmJlxuXHRcdFx0KCBjdXJDU1NUb3AgKyBjdXJDU1NMZWZ0ICkuaW5kZXhPZiggXCJhdXRvXCIgKSA+IC0xO1xuXG5cdFx0Ly8gTmVlZCB0byBiZSBhYmxlIHRvIGNhbGN1bGF0ZSBwb3NpdGlvbiBpZiBlaXRoZXJcblx0XHQvLyB0b3Agb3IgbGVmdCBpcyBhdXRvIGFuZCBwb3NpdGlvbiBpcyBlaXRoZXIgYWJzb2x1dGUgb3IgZml4ZWRcblx0XHRpZiAoIGNhbGN1bGF0ZVBvc2l0aW9uICkge1xuXHRcdFx0Y3VyUG9zaXRpb24gPSBjdXJFbGVtLnBvc2l0aW9uKCk7XG5cdFx0XHRjdXJUb3AgPSBjdXJQb3NpdGlvbi50b3A7XG5cdFx0XHRjdXJMZWZ0ID0gY3VyUG9zaXRpb24ubGVmdDtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjdXJUb3AgPSBwYXJzZUZsb2F0KCBjdXJDU1NUb3AgKSB8fCAwO1xuXHRcdFx0Y3VyTGVmdCA9IHBhcnNlRmxvYXQoIGN1ckNTU0xlZnQgKSB8fCAwO1xuXHRcdH1cblxuXHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIG9wdGlvbnMgKSApIHtcblxuXHRcdFx0Ly8gVXNlIGpRdWVyeS5leHRlbmQgaGVyZSB0byBhbGxvdyBtb2RpZmljYXRpb24gb2YgY29vcmRpbmF0ZXMgYXJndW1lbnQgKGdoLTE4NDgpXG5cdFx0XHRvcHRpb25zID0gb3B0aW9ucy5jYWxsKCBlbGVtLCBpLCBqUXVlcnkuZXh0ZW5kKCB7fSwgY3VyT2Zmc2V0ICkgKTtcblx0XHR9XG5cblx0XHRpZiAoIG9wdGlvbnMudG9wICE9IG51bGwgKSB7XG5cdFx0XHRwcm9wcy50b3AgPSAoIG9wdGlvbnMudG9wIC0gY3VyT2Zmc2V0LnRvcCApICsgY3VyVG9wO1xuXHRcdH1cblx0XHRpZiAoIG9wdGlvbnMubGVmdCAhPSBudWxsICkge1xuXHRcdFx0cHJvcHMubGVmdCA9ICggb3B0aW9ucy5sZWZ0IC0gY3VyT2Zmc2V0LmxlZnQgKSArIGN1ckxlZnQ7XG5cdFx0fVxuXG5cdFx0aWYgKCBcInVzaW5nXCIgaW4gb3B0aW9ucyApIHtcblx0XHRcdG9wdGlvbnMudXNpbmcuY2FsbCggZWxlbSwgcHJvcHMgKTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjdXJFbGVtLmNzcyggcHJvcHMgKTtcblx0XHR9XG5cdH1cbn07XG5cbmpRdWVyeS5mbi5leHRlbmQoIHtcblx0b2Zmc2V0OiBmdW5jdGlvbiggb3B0aW9ucyApIHtcblx0XHRpZiAoIGFyZ3VtZW50cy5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm4gb3B0aW9ucyA9PT0gdW5kZWZpbmVkID9cblx0XHRcdFx0dGhpcyA6XG5cdFx0XHRcdHRoaXMuZWFjaCggZnVuY3Rpb24oIGkgKSB7XG5cdFx0XHRcdFx0alF1ZXJ5Lm9mZnNldC5zZXRPZmZzZXQoIHRoaXMsIG9wdGlvbnMsIGkgKTtcblx0XHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdHZhciBkb2NFbGVtLCB3aW4sXG5cdFx0XHRlbGVtID0gdGhpc1sgMCBdLFxuXHRcdFx0Ym94ID0geyB0b3A6IDAsIGxlZnQ6IDAgfSxcblx0XHRcdGRvYyA9IGVsZW0gJiYgZWxlbS5vd25lckRvY3VtZW50O1xuXG5cdFx0aWYgKCAhZG9jICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGRvY0VsZW0gPSBkb2MuZG9jdW1lbnRFbGVtZW50O1xuXG5cdFx0Ly8gTWFrZSBzdXJlIGl0J3Mgbm90IGEgZGlzY29ubmVjdGVkIERPTSBub2RlXG5cdFx0aWYgKCAhalF1ZXJ5LmNvbnRhaW5zKCBkb2NFbGVtLCBlbGVtICkgKSB7XG5cdFx0XHRyZXR1cm4gYm94O1xuXHRcdH1cblxuXHRcdGJveCA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0d2luID0gZ2V0V2luZG93KCBkb2MgKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dG9wOiBib3gudG9wICsgd2luLnBhZ2VZT2Zmc2V0IC0gZG9jRWxlbS5jbGllbnRUb3AsXG5cdFx0XHRsZWZ0OiBib3gubGVmdCArIHdpbi5wYWdlWE9mZnNldCAtIGRvY0VsZW0uY2xpZW50TGVmdFxuXHRcdH07XG5cdH0sXG5cblx0cG9zaXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdGlmICggIXRoaXNbIDAgXSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgb2Zmc2V0UGFyZW50LCBvZmZzZXQsXG5cdFx0XHRlbGVtID0gdGhpc1sgMCBdLFxuXHRcdFx0cGFyZW50T2Zmc2V0ID0geyB0b3A6IDAsIGxlZnQ6IDAgfTtcblxuXHRcdC8vIEZpeGVkIGVsZW1lbnRzIGFyZSBvZmZzZXQgZnJvbSB3aW5kb3cgKHBhcmVudE9mZnNldCA9IHt0b3A6MCwgbGVmdDogMH0sXG5cdFx0Ly8gYmVjYXVzZSBpdCBpcyBpdHMgb25seSBvZmZzZXQgcGFyZW50XG5cdFx0aWYgKCBqUXVlcnkuY3NzKCBlbGVtLCBcInBvc2l0aW9uXCIgKSA9PT0gXCJmaXhlZFwiICkge1xuXG5cdFx0XHQvLyBBc3N1bWUgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGlzIHRoZXJlIHdoZW4gY29tcHV0ZWQgcG9zaXRpb24gaXMgZml4ZWRcblx0XHRcdG9mZnNldCA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHQvLyBHZXQgKnJlYWwqIG9mZnNldFBhcmVudFxuXHRcdFx0b2Zmc2V0UGFyZW50ID0gdGhpcy5vZmZzZXRQYXJlbnQoKTtcblxuXHRcdFx0Ly8gR2V0IGNvcnJlY3Qgb2Zmc2V0c1xuXHRcdFx0b2Zmc2V0ID0gdGhpcy5vZmZzZXQoKTtcblx0XHRcdGlmICggIWpRdWVyeS5ub2RlTmFtZSggb2Zmc2V0UGFyZW50WyAwIF0sIFwiaHRtbFwiICkgKSB7XG5cdFx0XHRcdHBhcmVudE9mZnNldCA9IG9mZnNldFBhcmVudC5vZmZzZXQoKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQWRkIG9mZnNldFBhcmVudCBib3JkZXJzXG5cdFx0XHRwYXJlbnRPZmZzZXQudG9wICs9IGpRdWVyeS5jc3MoIG9mZnNldFBhcmVudFsgMCBdLCBcImJvcmRlclRvcFdpZHRoXCIsIHRydWUgKTtcblx0XHRcdHBhcmVudE9mZnNldC5sZWZ0ICs9IGpRdWVyeS5jc3MoIG9mZnNldFBhcmVudFsgMCBdLCBcImJvcmRlckxlZnRXaWR0aFwiLCB0cnVlICk7XG5cdFx0fVxuXG5cdFx0Ly8gU3VidHJhY3QgcGFyZW50IG9mZnNldHMgYW5kIGVsZW1lbnQgbWFyZ2luc1xuXHRcdHJldHVybiB7XG5cdFx0XHR0b3A6IG9mZnNldC50b3AgLSBwYXJlbnRPZmZzZXQudG9wIC0galF1ZXJ5LmNzcyggZWxlbSwgXCJtYXJnaW5Ub3BcIiwgdHJ1ZSApLFxuXHRcdFx0bGVmdDogb2Zmc2V0LmxlZnQgLSBwYXJlbnRPZmZzZXQubGVmdCAtIGpRdWVyeS5jc3MoIGVsZW0sIFwibWFyZ2luTGVmdFwiLCB0cnVlIClcblx0XHR9O1xuXHR9LFxuXG5cdC8vIFRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIGRvY3VtZW50RWxlbWVudCBpbiB0aGUgZm9sbG93aW5nIGNhc2VzOlxuXHQvLyAxKSBGb3IgdGhlIGVsZW1lbnQgaW5zaWRlIHRoZSBpZnJhbWUgd2l0aG91dCBvZmZzZXRQYXJlbnQsIHRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuXG5cdC8vICAgIGRvY3VtZW50RWxlbWVudCBvZiB0aGUgcGFyZW50IHdpbmRvd1xuXHQvLyAyKSBGb3IgdGhlIGhpZGRlbiBvciBkZXRhY2hlZCBlbGVtZW50XG5cdC8vIDMpIEZvciBib2R5IG9yIGh0bWwgZWxlbWVudCwgaS5lLiBpbiBjYXNlIG9mIHRoZSBodG1sIG5vZGUgLSBpdCB3aWxsIHJldHVybiBpdHNlbGZcblx0Ly9cblx0Ly8gYnV0IHRob3NlIGV4Y2VwdGlvbnMgd2VyZSBuZXZlciBwcmVzZW50ZWQgYXMgYSByZWFsIGxpZmUgdXNlLWNhc2VzXG5cdC8vIGFuZCBtaWdodCBiZSBjb25zaWRlcmVkIGFzIG1vcmUgcHJlZmVyYWJsZSByZXN1bHRzLlxuXHQvL1xuXHQvLyBUaGlzIGxvZ2ljLCBob3dldmVyLCBpcyBub3QgZ3VhcmFudGVlZCBhbmQgY2FuIGNoYW5nZSBhdCBhbnkgcG9pbnQgaW4gdGhlIGZ1dHVyZVxuXHRvZmZzZXRQYXJlbnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLm1hcCggZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgb2Zmc2V0UGFyZW50ID0gdGhpcy5vZmZzZXRQYXJlbnQ7XG5cblx0XHRcdHdoaWxlICggb2Zmc2V0UGFyZW50ICYmIGpRdWVyeS5jc3MoIG9mZnNldFBhcmVudCwgXCJwb3NpdGlvblwiICkgPT09IFwic3RhdGljXCIgKSB7XG5cdFx0XHRcdG9mZnNldFBhcmVudCA9IG9mZnNldFBhcmVudC5vZmZzZXRQYXJlbnQ7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBvZmZzZXRQYXJlbnQgfHwgZG9jdW1lbnRFbGVtZW50O1xuXHRcdH0gKTtcblx0fVxufSApO1xuXG4vLyBDcmVhdGUgc2Nyb2xsTGVmdCBhbmQgc2Nyb2xsVG9wIG1ldGhvZHNcbmpRdWVyeS5lYWNoKCB7IHNjcm9sbExlZnQ6IFwicGFnZVhPZmZzZXRcIiwgc2Nyb2xsVG9wOiBcInBhZ2VZT2Zmc2V0XCIgfSwgZnVuY3Rpb24oIG1ldGhvZCwgcHJvcCApIHtcblx0dmFyIHRvcCA9IFwicGFnZVlPZmZzZXRcIiA9PT0gcHJvcDtcblxuXHRqUXVlcnkuZm5bIG1ldGhvZCBdID0gZnVuY3Rpb24oIHZhbCApIHtcblx0XHRyZXR1cm4gYWNjZXNzKCB0aGlzLCBmdW5jdGlvbiggZWxlbSwgbWV0aG9kLCB2YWwgKSB7XG5cdFx0XHR2YXIgd2luID0gZ2V0V2luZG93KCBlbGVtICk7XG5cblx0XHRcdGlmICggdmFsID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdHJldHVybiB3aW4gPyB3aW5bIHByb3AgXSA6IGVsZW1bIG1ldGhvZCBdO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHdpbiApIHtcblx0XHRcdFx0d2luLnNjcm9sbFRvKFxuXHRcdFx0XHRcdCF0b3AgPyB2YWwgOiB3aW4ucGFnZVhPZmZzZXQsXG5cdFx0XHRcdFx0dG9wID8gdmFsIDogd2luLnBhZ2VZT2Zmc2V0XG5cdFx0XHRcdCk7XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGVsZW1bIG1ldGhvZCBdID0gdmFsO1xuXHRcdFx0fVxuXHRcdH0sIG1ldGhvZCwgdmFsLCBhcmd1bWVudHMubGVuZ3RoICk7XG5cdH07XG59ICk7XG5cbi8vIFN1cHBvcnQ6IFNhZmFyaTw3LTgrLCBDaHJvbWU8MzctNDQrXG4vLyBBZGQgdGhlIHRvcC9sZWZ0IGNzc0hvb2tzIHVzaW5nIGpRdWVyeS5mbi5wb3NpdGlvblxuLy8gV2Via2l0IGJ1ZzogaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTI5MDg0XG4vLyBCbGluayBidWc6IGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0yMjkyODBcbi8vIGdldENvbXB1dGVkU3R5bGUgcmV0dXJucyBwZXJjZW50IHdoZW4gc3BlY2lmaWVkIGZvciB0b3AvbGVmdC9ib3R0b20vcmlnaHQ7XG4vLyByYXRoZXIgdGhhbiBtYWtlIHRoZSBjc3MgbW9kdWxlIGRlcGVuZCBvbiB0aGUgb2Zmc2V0IG1vZHVsZSwganVzdCBjaGVjayBmb3IgaXQgaGVyZVxualF1ZXJ5LmVhY2goIFsgXCJ0b3BcIiwgXCJsZWZ0XCIgXSwgZnVuY3Rpb24oIGksIHByb3AgKSB7XG5cdGpRdWVyeS5jc3NIb29rc1sgcHJvcCBdID0gYWRkR2V0SG9va0lmKCBzdXBwb3J0LnBpeGVsUG9zaXRpb24sXG5cdFx0ZnVuY3Rpb24oIGVsZW0sIGNvbXB1dGVkICkge1xuXHRcdFx0aWYgKCBjb21wdXRlZCApIHtcblx0XHRcdFx0Y29tcHV0ZWQgPSBjdXJDU1MoIGVsZW0sIHByb3AgKTtcblxuXHRcdFx0XHQvLyBJZiBjdXJDU1MgcmV0dXJucyBwZXJjZW50YWdlLCBmYWxsYmFjayB0byBvZmZzZXRcblx0XHRcdFx0cmV0dXJuIHJudW1ub25weC50ZXN0KCBjb21wdXRlZCApID9cblx0XHRcdFx0XHRqUXVlcnkoIGVsZW0gKS5wb3NpdGlvbigpWyBwcm9wIF0gKyBcInB4XCIgOlxuXHRcdFx0XHRcdGNvbXB1dGVkO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcbn0gKTtcblxuXG4vLyBDcmVhdGUgaW5uZXJIZWlnaHQsIGlubmVyV2lkdGgsIGhlaWdodCwgd2lkdGgsIG91dGVySGVpZ2h0IGFuZCBvdXRlcldpZHRoIG1ldGhvZHNcbmpRdWVyeS5lYWNoKCB7IEhlaWdodDogXCJoZWlnaHRcIiwgV2lkdGg6IFwid2lkdGhcIiB9LCBmdW5jdGlvbiggbmFtZSwgdHlwZSApIHtcblx0alF1ZXJ5LmVhY2goIHsgcGFkZGluZzogXCJpbm5lclwiICsgbmFtZSwgY29udGVudDogdHlwZSwgXCJcIjogXCJvdXRlclwiICsgbmFtZSB9LFxuXHRcdGZ1bmN0aW9uKCBkZWZhdWx0RXh0cmEsIGZ1bmNOYW1lICkge1xuXG5cdFx0Ly8gTWFyZ2luIGlzIG9ubHkgZm9yIG91dGVySGVpZ2h0LCBvdXRlcldpZHRoXG5cdFx0alF1ZXJ5LmZuWyBmdW5jTmFtZSBdID0gZnVuY3Rpb24oIG1hcmdpbiwgdmFsdWUgKSB7XG5cdFx0XHR2YXIgY2hhaW5hYmxlID0gYXJndW1lbnRzLmxlbmd0aCAmJiAoIGRlZmF1bHRFeHRyYSB8fCB0eXBlb2YgbWFyZ2luICE9PSBcImJvb2xlYW5cIiApLFxuXHRcdFx0XHRleHRyYSA9IGRlZmF1bHRFeHRyYSB8fCAoIG1hcmdpbiA9PT0gdHJ1ZSB8fCB2YWx1ZSA9PT0gdHJ1ZSA/IFwibWFyZ2luXCIgOiBcImJvcmRlclwiICk7XG5cblx0XHRcdHJldHVybiBhY2Nlc3MoIHRoaXMsIGZ1bmN0aW9uKCBlbGVtLCB0eXBlLCB2YWx1ZSApIHtcblx0XHRcdFx0dmFyIGRvYztcblxuXHRcdFx0XHRpZiAoIGpRdWVyeS5pc1dpbmRvdyggZWxlbSApICkge1xuXG5cdFx0XHRcdFx0Ly8gQXMgb2YgNS84LzIwMTIgdGhpcyB3aWxsIHlpZWxkIGluY29ycmVjdCByZXN1bHRzIGZvciBNb2JpbGUgU2FmYXJpLCBidXQgdGhlcmVcblx0XHRcdFx0XHQvLyBpc24ndCBhIHdob2xlIGxvdCB3ZSBjYW4gZG8uIFNlZSBwdWxsIHJlcXVlc3QgYXQgdGhpcyBVUkwgZm9yIGRpc2N1c3Npb246XG5cdFx0XHRcdFx0Ly8gaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9qcXVlcnkvcHVsbC83NjRcblx0XHRcdFx0XHRyZXR1cm4gZWxlbS5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnRbIFwiY2xpZW50XCIgKyBuYW1lIF07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBHZXQgZG9jdW1lbnQgd2lkdGggb3IgaGVpZ2h0XG5cdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gOSApIHtcblx0XHRcdFx0XHRkb2MgPSBlbGVtLmRvY3VtZW50RWxlbWVudDtcblxuXHRcdFx0XHRcdC8vIEVpdGhlciBzY3JvbGxbV2lkdGgvSGVpZ2h0XSBvciBvZmZzZXRbV2lkdGgvSGVpZ2h0XSBvciBjbGllbnRbV2lkdGgvSGVpZ2h0XSxcblx0XHRcdFx0XHQvLyB3aGljaGV2ZXIgaXMgZ3JlYXRlc3Rcblx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgoXG5cdFx0XHRcdFx0XHRlbGVtLmJvZHlbIFwic2Nyb2xsXCIgKyBuYW1lIF0sIGRvY1sgXCJzY3JvbGxcIiArIG5hbWUgXSxcblx0XHRcdFx0XHRcdGVsZW0uYm9keVsgXCJvZmZzZXRcIiArIG5hbWUgXSwgZG9jWyBcIm9mZnNldFwiICsgbmFtZSBdLFxuXHRcdFx0XHRcdFx0ZG9jWyBcImNsaWVudFwiICsgbmFtZSBdXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID9cblxuXHRcdFx0XHRcdC8vIEdldCB3aWR0aCBvciBoZWlnaHQgb24gdGhlIGVsZW1lbnQsIHJlcXVlc3RpbmcgYnV0IG5vdCBmb3JjaW5nIHBhcnNlRmxvYXRcblx0XHRcdFx0XHRqUXVlcnkuY3NzKCBlbGVtLCB0eXBlLCBleHRyYSApIDpcblxuXHRcdFx0XHRcdC8vIFNldCB3aWR0aCBvciBoZWlnaHQgb24gdGhlIGVsZW1lbnRcblx0XHRcdFx0XHRqUXVlcnkuc3R5bGUoIGVsZW0sIHR5cGUsIHZhbHVlLCBleHRyYSApO1xuXHRcdFx0fSwgdHlwZSwgY2hhaW5hYmxlID8gbWFyZ2luIDogdW5kZWZpbmVkLCBjaGFpbmFibGUsIG51bGwgKTtcblx0XHR9O1xuXHR9ICk7XG59ICk7XG5cblxualF1ZXJ5LmZuLmV4dGVuZCgge1xuXG5cdGJpbmQ6IGZ1bmN0aW9uKCB0eXBlcywgZGF0YSwgZm4gKSB7XG5cdFx0cmV0dXJuIHRoaXMub24oIHR5cGVzLCBudWxsLCBkYXRhLCBmbiApO1xuXHR9LFxuXHR1bmJpbmQ6IGZ1bmN0aW9uKCB0eXBlcywgZm4gKSB7XG5cdFx0cmV0dXJuIHRoaXMub2ZmKCB0eXBlcywgbnVsbCwgZm4gKTtcblx0fSxcblxuXHRkZWxlZ2F0ZTogZnVuY3Rpb24oIHNlbGVjdG9yLCB0eXBlcywgZGF0YSwgZm4gKSB7XG5cdFx0cmV0dXJuIHRoaXMub24oIHR5cGVzLCBzZWxlY3RvciwgZGF0YSwgZm4gKTtcblx0fSxcblx0dW5kZWxlZ2F0ZTogZnVuY3Rpb24oIHNlbGVjdG9yLCB0eXBlcywgZm4gKSB7XG5cblx0XHQvLyAoIG5hbWVzcGFjZSApIG9yICggc2VsZWN0b3IsIHR5cGVzIFssIGZuXSApXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgP1xuXHRcdFx0dGhpcy5vZmYoIHNlbGVjdG9yLCBcIioqXCIgKSA6XG5cdFx0XHR0aGlzLm9mZiggdHlwZXMsIHNlbGVjdG9yIHx8IFwiKipcIiwgZm4gKTtcblx0fSxcblx0c2l6ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMubGVuZ3RoO1xuXHR9XG59ICk7XG5cbmpRdWVyeS5mbi5hbmRTZWxmID0galF1ZXJ5LmZuLmFkZEJhY2s7XG5cblxuXG5cbi8vIFJlZ2lzdGVyIGFzIGEgbmFtZWQgQU1EIG1vZHVsZSwgc2luY2UgalF1ZXJ5IGNhbiBiZSBjb25jYXRlbmF0ZWQgd2l0aCBvdGhlclxuLy8gZmlsZXMgdGhhdCBtYXkgdXNlIGRlZmluZSwgYnV0IG5vdCB2aWEgYSBwcm9wZXIgY29uY2F0ZW5hdGlvbiBzY3JpcHQgdGhhdFxuLy8gdW5kZXJzdGFuZHMgYW5vbnltb3VzIEFNRCBtb2R1bGVzLiBBIG5hbWVkIEFNRCBpcyBzYWZlc3QgYW5kIG1vc3Qgcm9idXN0XG4vLyB3YXkgdG8gcmVnaXN0ZXIuIExvd2VyY2FzZSBqcXVlcnkgaXMgdXNlZCBiZWNhdXNlIEFNRCBtb2R1bGUgbmFtZXMgYXJlXG4vLyBkZXJpdmVkIGZyb20gZmlsZSBuYW1lcywgYW5kIGpRdWVyeSBpcyBub3JtYWxseSBkZWxpdmVyZWQgaW4gYSBsb3dlcmNhc2Vcbi8vIGZpbGUgbmFtZS4gRG8gdGhpcyBhZnRlciBjcmVhdGluZyB0aGUgZ2xvYmFsIHNvIHRoYXQgaWYgYW4gQU1EIG1vZHVsZSB3YW50c1xuLy8gdG8gY2FsbCBub0NvbmZsaWN0IHRvIGhpZGUgdGhpcyB2ZXJzaW9uIG9mIGpRdWVyeSwgaXQgd2lsbCB3b3JrLlxuXG4vLyBOb3RlIHRoYXQgZm9yIG1heGltdW0gcG9ydGFiaWxpdHksIGxpYnJhcmllcyB0aGF0IGFyZSBub3QgalF1ZXJ5IHNob3VsZFxuLy8gZGVjbGFyZSB0aGVtc2VsdmVzIGFzIGFub255bW91cyBtb2R1bGVzLCBhbmQgYXZvaWQgc2V0dGluZyBhIGdsb2JhbCBpZiBhblxuLy8gQU1EIGxvYWRlciBpcyBwcmVzZW50LiBqUXVlcnkgaXMgYSBzcGVjaWFsIGNhc2UuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWVcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9qcmJ1cmtlL3JlcXVpcmVqcy93aWtpL1VwZGF0aW5nLWV4aXN0aW5nLWxpYnJhcmllcyN3aWtpLWFub25cblxuaWYgKCB0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCApIHtcblx0ZGVmaW5lKCBcImpxdWVyeVwiLCBbXSwgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGpRdWVyeTtcblx0fSApO1xufVxuXG5cblxudmFyXG5cblx0Ly8gTWFwIG92ZXIgalF1ZXJ5IGluIGNhc2Ugb2Ygb3ZlcndyaXRlXG5cdF9qUXVlcnkgPSB3aW5kb3cualF1ZXJ5LFxuXG5cdC8vIE1hcCBvdmVyIHRoZSAkIGluIGNhc2Ugb2Ygb3ZlcndyaXRlXG5cdF8kID0gd2luZG93LiQ7XG5cbmpRdWVyeS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oIGRlZXAgKSB7XG5cdGlmICggd2luZG93LiQgPT09IGpRdWVyeSApIHtcblx0XHR3aW5kb3cuJCA9IF8kO1xuXHR9XG5cblx0aWYgKCBkZWVwICYmIHdpbmRvdy5qUXVlcnkgPT09IGpRdWVyeSApIHtcblx0XHR3aW5kb3cualF1ZXJ5ID0gX2pRdWVyeTtcblx0fVxuXG5cdHJldHVybiBqUXVlcnk7XG59O1xuXG4vLyBFeHBvc2UgalF1ZXJ5IGFuZCAkIGlkZW50aWZpZXJzLCBldmVuIGluIEFNRFxuLy8gKCM3MTAyI2NvbW1lbnQ6MTAsIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnkvanF1ZXJ5L3B1bGwvNTU3KVxuLy8gYW5kIENvbW1vbkpTIGZvciBicm93c2VyIGVtdWxhdG9ycyAoIzEzNTY2KVxuaWYgKCAhbm9HbG9iYWwgKSB7XG5cdHdpbmRvdy5qUXVlcnkgPSB3aW5kb3cuJCA9IGpRdWVyeTtcbn1cblxucmV0dXJuIGpRdWVyeTtcbn0pKTtcbiJdfQ==
