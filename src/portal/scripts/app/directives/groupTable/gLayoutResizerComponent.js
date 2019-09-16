/**
 * Created by sergey on 11.05.16.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');

    module.exports = function () {
        return {
            restrict: 'A',
            scope: {
                evDataService: '=',
                evEventService: '='
            },
            link: function (scope, elem, attr) {

                scope.components = null;

                /*function resizeWorkarea() {

                    // var workAreaElem = elem.parents('.g-wrapper').find('.g-workarea-wrap').first();
                    var workAreaElem = elem.parents('.g-wrapper').find('.g-workarea-wrap');

                    var interfaceLayout = scope.evDataService.getInterfaceLayout();

                    var width;
                    var viewerHolder = elem.parents(".entity-viewer-holder");

                    if (viewerHolder.length === 0) {
                        viewerHolder = elem.parents(".report-viewer-holder");
                    };

                    if (scope.components.sidebar) {
                        width = viewerHolder.width() - interfaceLayout.filterArea.width;
                    } else {
                        width = viewerHolder.width()
                    }

                    workAreaElem.width(width);
                    var wrapperWidth = elem.find('.g-columns-component.g-thead').width() - $(elem).find('.g-cell-select.all').width();
                    elem.find('.g-scroll-wrapper').width(wrapperWidth);
                    elem.find('.g-scrollable-area').width(wrapperWidth);

                }*/

                function resizeWorkarea() {

                    var workAreaElem = elem.parents('.g-wrapper').find('.g-workarea-wrap');
                    console.log("resize workAreaElem", workAreaElem);
                    var interfaceLayout = scope.evDataService.getInterfaceLayout();

                    var width = document.body.clientWidth - $(document).find(".sidenav-wrapper").width() - interfaceLayout.filterArea.width;
                    console.log("resize width", width);
                    workAreaElem.width(width);
                    var wrapperWidth = elem.find('.g-columns-component.g-thead').width() - $(elem).find('.g-cell-select.all').width();
                    elem.find('.g-scroll-wrapper').width(wrapperWidth);
                    elem.find('.g-scrollable-area').width(wrapperWidth);

                };

                var init = function () {

                    scope.components = scope.evDataService.getComponents();

                    resizeWorkarea();

                    $(window).on('resize', function () {
                        resizeWorkarea();
                        // resizeSidebarHeight();
                    });

                };

                scope.evEventService.addEventListener('UPDATE_EV_UI', function () {

                    scope.components = scope.evDataService.getComponents();

                    resizeWorkarea();
                    // resizeSidebarHeight();

                });

                scope.evEventService.addEventListener(evEvents.UPDATE_TABLE_VIEWPORT, function () {

                    scope.components = scope.evDataService.getComponents();

                    resizeWorkarea();
                    // resizeSidebarHeight();



                });

                init();


            }
        }
    }

}());