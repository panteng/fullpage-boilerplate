'use strict';

var $ = require('jquery');
var fullpage = require('fullpage.js');

var executeAnimationOfSection1 = require('./animations/section-1');
var executeAnimationOfSection2 = require('./animations/section-2');
var executeAnimationOfSection3 = require('./animations/section-3');

var hideHiddenItems = require('./controls/hide-hidden-items')

$(document).ready(function () {
    var sectionsLength = $('.section').length;
    
    $('#fullpage').fullpage({
        menu: '#menu',
        paddingTop: 60, // this value should be the same as the header's height (60px).
        afterLoad: function (anchorLink, index) {
            
            hideHiddenItems();
            
            switch (index) {
                case 1: 
                    $('#btn-next').show();
                    executeAnimationOfSection1();
                    break;
                
                case 2:
                    $('#btn-next').show();
                    executeAnimationOfSection2();
                    break;
                    
                case 3:
                    $('#btn-next').hide();
                    executeAnimationOfSection3();
                    break;
            }
            
        }
    });
    
    $('#btn-next').on('click', function () {
        $.fn.fullpage.moveSectionDown();
    });
});