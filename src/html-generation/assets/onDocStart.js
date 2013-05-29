/*global $:true, document:true*/
$(document).ready(function () {
    'use strict';
    /*global initToggle:true*/
    initToggle('.toggle');
    $('.tooltip').tooltipster({
        theme: '.tooltip-theme'
    });
});