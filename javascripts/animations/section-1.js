var $ = window.jQuery = window.$ = require('jquery');
var velocity = require('velocity-animate');

module.exports = function () {
    $('.section-1 .text')
        .velocity({
            top: '60%',
            opacity: 0
        }, 0)
        .delay(100)
        .velocity({
            top: '50%',
            opacity: 1
        }, 600, 'easeOutCubic');
};