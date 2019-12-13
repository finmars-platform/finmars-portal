/**
 * Created by szhitenev on 20.05.2016.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');

    module.exports = function () {
        return {
            restrict: 'A',
            scope: {
                evDataService: '=',
                evEventService: '=',
                rootWrapElem: '=',
                contentWrapElem: '='
            },
            link: function (scope, elem, attrs) {

                scope.additions = scope.evDataService.getAdditions();
                scope.isRootEntityViewer = scope.evDataService.isRootEntityViewer();

                scope.activateWidthSlider = function() {

                    console.log('activateWidthSlider');

                    var splitPanelResizer = $('.g-width-slider')

                    $(splitPanelResizer).bind('mousedown', function (e) {

                        e.stopPropagation();
                        e.preventDefault();

                        var mouseMoveX;

                        var verticalSplitPanelElem = $('.g-recon');

                        var verticalSplitPanelWidth;

                        var rootWidth = $(scope.rootWrapElem).width();

                        var windowXcorrection = document.body.clientWidth - rootWidth;

                        var handler = function (e) {

                            mouseMoveX = e.clientX - windowXcorrection;

                            verticalSplitPanelWidth = rootWidth - mouseMoveX;

                            $(verticalSplitPanelElem).width(verticalSplitPanelWidth);
                            $(verticalSplitPanelElem)[0].style.left = (rootWidth - verticalSplitPanelWidth) + 'px';
                            $(scope.contentWrapElem).width(rootWidth - verticalSplitPanelWidth);

                            window.dispatchEvent(new Event('resize'))


                        };

                        $(window).bind('mousemove', function (e) {
                            handler(e);
                            $(window).bind('mouseup', function () {
                                $(window).unbind('mousemove');
                            })
                        });


                    });
                };


                scope.defaultWidths = function(){

                    console.log('Width Aligner - Set Default Width');

                    var rootWidth = $(scope.rootWrapElem).width();

                    $(scope.contentWrapElem)[0].style.width = Math.floor(rootWidth) + 'px';

                };

                scope.defaultSplitWidths = function(){

                    console.log('Width Aligner - Set Split Width');

                    var rootWidth = $(scope.rootWrapElem).width();

                    $(scope.contentWrapElem)[0].style.width = Math.floor(rootWidth / 2) + 'px';

                };



                scope.init = function () {

                    scope.defaultSplitWidths();
                    scope.activateWidthSlider();

                    scope.evEventService.addEventListener(evEvents.VERTICAL_ADDITIONS_CHANGE, function () {

                        scope.defaultWidths();

                    })
                };

                scope.init()
            }
        }
    }

}());