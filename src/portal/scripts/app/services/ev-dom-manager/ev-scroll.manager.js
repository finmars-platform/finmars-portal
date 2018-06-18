(function () {

    'use strict';

    var evDataHelper = require('../../helpers/ev-data.helper');
    var evEvents = require('../../services/entityViewerEvents');

    var ROW_HEIGHT = 24;

    module.exports = function () {

        var viewportElem;
        var viewportHeight;
        var viewportWidth;

        var scrollTopElem;
        var scrollTopElemHeight;

        var scrollBottomElem;
        var scrollBottomElemHeight;


        function setViewportElem(elem) {
            viewportElem = elem
        }

        function getViewportElem() {
            return viewportElem
        }

        function setViewportHeight(height) {
            viewportHeight = height;
            viewportElem.style.height = height + 'px';
        }

        function getViewportHeight() {
            return viewportHeight;
        }

        function setViewportWidth(width) {
            viewportWidth = width;
            viewportElem.style.height = width + 'px';
        }

        function getViewportWidth() {
            return viewportWidth;
        }

        function setScrollTopElem(elem) {
            scrollTopElem = elem
        }

        function getScrollTopElem() {
            return scrollTopElem;
        }

        function setScrollTopElemHeight(height) {
            scrollTopElemHeight = height;
            scrollTopElem.style.height = height + 'px';
        }

        function getScrollTopElemHeight() {
            return scrollTopElemHeight;
        }

        function setScrollBottomElem(elem) {
            scrollBottomElem = elem
        }

        function getScrollBottomElem() {
            return scrollBottomElem;
        }

        function setScrollBottomElemHeight(height) {
            scrollBottomElem = height;
            scrollBottomElemHeight.style.height = height + 'px';
        }

        function getScrollBottomElemHeight() {
            return scrollBottomElemHeight;
        }


        return {

            setViewportElem: setViewportElem,
            getViewportElem: getViewportElem,

            setViewportHeight: setViewportHeight,
            getViewportHeight: getViewportHeight,

            setViewportWidth: setViewportWidth,
            getViewportWidth: getViewportWidth,
            
            setScrollTopElem: setScrollTopElem,
            getScrollTopElem: getScrollTopElem,

            setScrollTopElemHeight: setScrollTopElemHeight,
            getScrollTopElemHeight: getScrollTopElemHeight,

            setScrollBottomElem: setScrollBottomElem,
            getScrollBottomElem: getScrollBottomElem,

            setScrollBottomElemHeight: setScrollBottomElemHeight,
            getScrollBottomElemHeight: getScrollBottomElemHeight

        }

    }


}());