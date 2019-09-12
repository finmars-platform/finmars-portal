(function () {

    'use strict';

    module.exports = function () {

        var viewportElem;
        var viewportHeight;
        var viewportWidth;

        var contentElem;
        var contentElemHeight;
        var contentElemPaddingTop;

        var contentWrapElem;
        var contentWrapElemHeight;
        var contentWrapElemWidth;

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
            viewportElem.style.width = width + 'px';
        }

        function getViewportWidth() {
            return viewportWidth;
        }

        function setContentElem(elem) {
            contentElem = elem
        }

        function getContentElem() {
            return contentElem
        }

        function setContentElemHeight(height) {

            contentElemHeight = height;
            contentElem.style.height = height + 'px';
        }

        function getContentElemHeight() {
            return contentElemHeight;
        }

        function setContentElemPaddingTop(padding) {

            contentElemPaddingTop = padding;
            contentElem.style.paddingTop = padding + 'px';
        }

        function getContentElemPaddingTop() {
            return contentElemPaddingTop;
        }

        function setContentWrapElem(elem) {
            contentWrapElem = elem;
            contentWrapElemHeight = elem.clientHeight;
            contentWrapElemWidth = elem.clientWidth;
        }

        function getContentWrapElem() {
            return contentWrapElem;
        }

        function setContentWrapElemHeight(height) {

            contentWrapElemHeight = height;
            contentWrapElem.style.height = height + 'px';
        }

        function getContentWrapElemHeight() {
            return contentWrapElemHeight;
        }

        function setContentWrapElemWidth(width) {

            contentWrapElemWidth = width;
            contentWrapElem.style.width = width + 'px';
        }

        function getContentWrapElemWidth() {
            return contentWrapElemWidth;
        }

        return {

            // viewport elem

            setViewportElem: setViewportElem,
            getViewportElem: getViewportElem,

            setViewportHeight: setViewportHeight,
            getViewportHeight: getViewportHeight,

            setViewportWidth: setViewportWidth,
            getViewportWidth: getViewportWidth,


            // content elem

            setContentElem: setContentElem,
            getContentElem: getContentElem,

            setContentElemHeight: setContentElemHeight,
            getContentElemHeight: getContentElemHeight,

            setContentElemPaddingTop: setContentElemPaddingTop,
            getContentElemPaddingTop: getContentElemPaddingTop,

            // content wrap elem

            setContentWrapElem: setContentWrapElem,
            getContentWrapElem: getContentWrapElem,

            setContentWrapElemHeight: setContentWrapElemHeight,
            getContentWrapElemHeight: getContentWrapElemHeight,

            setContentWrapElemWidth: setContentWrapElemWidth,
            getContentWrapElemWidth: getContentWrapElemWidth

        }

    }


}());