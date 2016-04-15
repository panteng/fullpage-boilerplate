var $ = window.jQuery = window.$ = require('jquery');
var velocity = require('velocity-animate');

module.exports = function () {
    $('.section-3 .text')
        .velocity({
            translateX: '-50%',
            translateY: '-50%',
            scale: 0.4,
            opacity: 0
        }, 0)
        .delay(100)
        .velocity({
            translateX: '-50%',
            translateY: '-50%',
            scale: 1,
            opacity: 1
        }, 600, 'easeOutCubic');
};