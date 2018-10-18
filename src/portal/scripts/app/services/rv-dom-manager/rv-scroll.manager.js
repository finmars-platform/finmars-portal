(function () {

    'use strict';

    module.exports = function () {

        var viewportElem;
        var viewportHeight;
        var viewportWidth;

        var contentElem;
        var contentElemHeight;
        var contentElemPaddingTop;

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
            getContentElemPaddingTop: getContentElemPaddingTop


        }

    }


}());