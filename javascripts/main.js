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