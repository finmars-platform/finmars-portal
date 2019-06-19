/* fancy-logger v1.0.0 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by szhitenev on 12.08.2016.
 */

'use strict';

var themeColors = {
    property: '216,67,21',
    collection: '46,125,50',
    event: '0,176,255',
    controller: '36,36,36',
    component: '179,157,219',
    service: '255,64,129'
};

function checkTheme() {
    if (window.fancyLoggerTheme && window.fancyLoggerTheme == 'dark') {
        themeColors = {
            property: '65,199,132',
            collection: '79,195,247',
            event: '239,83,80',
            controller: '224,224,224',
            component: '179,157,219',
            service: '236,64,122'
        }
    } else {
        themeColors = {
            property: '216,67,21',
            collection: '46,125,50',
            event: '0,176,255',
            controller: '36,36,36',
            component: '179,157,219',
            service: '255,64,129'
        };
    }
}

var importanceResolve = function (color, importance) {
    if (importance < 10) {
        return 'rgba(' + color + ' ,.' + importance + ')';
    } else {
        return 'rgba(' + color + ' , 1)';
    }
};

var property = function (name, value, importance, styles) {
    checkTheme();
    var imp = importance || 10;
    var css = styles || 'color: ' + importanceResolve(themeColors.property, imp);
    console.log('%c{"property": "' + name + '", "value": "', css, value, '"}');
};

var collection = function (name, value, importance, styles) {
    checkTheme();
    var imp = importance || 10;
    var css = styles || 'color: ' + importanceResolve(themeColors.collection, imp);
    console.log('%c{"collection": "' + name + '", "data":', css, value, '}');
};

var event = function (name, event, importance, styles) {
    checkTheme();
    var imp = importance || 10;
    var css = styles || 'color: ' + importanceResolve(themeColors.event, imp);
    console.log('%c{"event": "' + name + '", "data": "' + event + '"}', css);
};

var controller = function (name, status, importance, styles) {
    checkTheme();
    var imp = importance || 10;
    var css = styles || 'color: ' + importanceResolve(themeColors.controller, imp);
    console.log('%c{"controller": "' + name + '", "status": "' + status + '"}', css);
};

var component = function (name, status, importance, styles) {
    checkTheme();
    var imp = importance || 10;
    var css = styles || 'color: ' + importanceResolve(themeColors.component, imp);
    console.log('%c{"component": "' + name + '", "status": "' + status + '"}', css);
};

var service = function (name, status, importance, styles) {
    checkTheme();
    var imp = importance || 10;
    var css = styles || 'color: ' + importanceResolve(themeColors.service, imp);
    console.log('%c{"service": "' + name + '", "status": "' + status + '"}', css);
};

var fancyLogger = {
    property: property,
    collection: collection,
    event: event,
    controller: controller,
    component: component,
    service: service
};

module.exports = fancyLogger;


if (typeof define === 'function' && define.amd) {
    // AMD
    define(fancyLogger);
} else {
    // Add to a global object.
    window.fancyLogger = fancyLogger;
}

},{}]},{},[1]);
