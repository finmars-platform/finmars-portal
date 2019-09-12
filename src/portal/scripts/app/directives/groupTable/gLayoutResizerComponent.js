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

                function resizeWorkarea() {

                    // var workAreaElem = elem.parents('.g-wrapper').find('.g-workarea-wrap').first();
                    var workAreaElem = elem.parents('.g-wrapper').find('.g-workarea-wrap');

                    var interfaceLayout = scope.evDataService.getInterfaceLayout();

                    var width;

                    if (scope.components.sidebar) {
                        width = elem.parents(".report-viewer-holder").width() - interfaceLayout.filterArea.width;
                    } else {
                        width = elem.parents(".report-viewer-holder").width()
                    }

                    workAreaElem.width(width);
                    var wrapperWidth = elem.find('.g-columns-component.g-thead').width() - $(elem).find('.g-cell-select.all').width();
                    elem.find('.g-scroll-wrapper').width(wrapperWidth);
                    elem.find('.g-scrollable-area').width(wrapperWidth);

                }

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