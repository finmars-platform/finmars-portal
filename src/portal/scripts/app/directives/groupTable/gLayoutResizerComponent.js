/**
 * Created by sergey on 11.05.16.
 */
(function () {

    'use strict';

    // TO DELETE: after making report viewer and entity viewer use new interface

    var evEvents = require('../../services/entityViewerEvents');

    module.exports = function () {
        return {
            restrict: 'A',
            scope: {
                evDataService: '=',
                evEventService: '=',
                contentWrapElement: '=',
                workareaWrapElement: '='
            },
            link: function (scope, elem, attr) {

                scope.components = null;

                function resizeWorkarea() {

                    if (scope.components) {

                        // var workAreaElem = $(elem).parents('.g-wrapper').find('.g-workarea-wrap').first();
                        // var workAreaElem = $(elem).parents('.g-wrapper').find('.g-workarea-wrap');
                        // var workAreaElem = scope.rootWrapElement

                        var interfaceLayout = scope.evDataService.getInterfaceLayout();

                        var width;
                        /*var viewerHolder = $(elem).parents(".entity-viewer-holder");

                        if (viewerHolder.length === 0) {
                            viewerHolder = $(elem).parents(".report-viewer-holder");
                        }


                        var viewerHolderWidth = viewerHolder.width();

                        if (scope.components.sidebar) {
                            width = viewerHolderWidth - interfaceLayout.filterArea.width;
                        } else {
                            width = viewerHolderWidth
                        }*/

                        var contentWrapWidth = scope.contentWrapElement.clientWidth;

                        if (scope.components.sidebar) {
                            width = contentWrapWidth - interfaceLayout.filterArea.width;
                        } else {
                            width = contentWrapWidth;
                        }

                        // console.log('width', width);
                        $(scope.workareaWrapElement).width(width);
                        var wrapperWidth = $(elem).find('.g-columns-component.g-thead').width() - $(elem).find('.g-cell-select.all').width();
                        $(elem).find('.g-scroll-wrapper').width(wrapperWidth);
                        $(elem).find('.g-scrollable-area').width(wrapperWidth);
                    }

                }


                var init = function () {

                    scope.components = scope.evDataService.getComponents();

                    /*setTimeout(function () {
                        resizeWorkarea();
                    }, 0);*/

                    /*window.addEventListener('resize', function () {
                        resizeWorkarea();

                    });*/

                    /* scope.evEventService.addEventListener('UPDATE_EV_UI', function () {

                        scope.components = scope.evDataService.getComponents();

                        resizeWorkarea();

                    }); */

                    /*scope.evEventService.addEventListener(evEvents.UPDATE_TABLE_VIEWPORT, function () {

                        scope.components = scope.evDataService.getComponents();

                        resizeWorkarea();

                    });*/

                };


                init();


            }
        }
    }

}());