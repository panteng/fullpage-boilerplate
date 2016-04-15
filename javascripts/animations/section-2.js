var $ = window.jQuery = window.$ = require('jquery');
var velocity = require('velocity-animate');

module.exports = function () {
    $('.section-2 .text')
        .velocity({
            left: '40%',
            opacity: 0
        }, 0)
        .delay(100)
        .velocity({
            left: '50%',
            opacity: 1
        }, 600, 'easeOutCubic');
};