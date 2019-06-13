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

                function resizeWorkarea() {

                    var workAreaElem = elem.parents('.g-wrapper').find('.g-workarea-wrap').first();

                    workAreaElem.width(elem.parents('.entity-viewer-holder').width() - $(elem).parents('.g-wrapper').find('.g-filter-sidebar.main-sidebar').width());
                    var wrapperWidth = elem.find('.g-columns-component.g-thead').width() - $(elem).find('.g-cell-select.all').width();
                    elem.find('.g-scroll-wrapper').width(wrapperWidth);
                    elem.find('.g-scrollable-area').width(wrapperWidth);

                }

                /*function resizeSidebarHeight() {

                    var workAreaHeight = elem.parents('.g-wrapper').find('.g-workarea-wrap').height();

                    var upperFilterSidebar = elem.parents('.g-wrapper').find('.g-filter-sidebar');

                    upperFilterSidebar.height(workAreaHeight);

                }*/

                var init = function () {

                    resizeWorkarea();

                    $(window).on('resize', function () {
                        resizeWorkarea();
                        // resizeSidebarHeight();
                    });

                };

                scope.evEventService.addEventListener('UPDATE_EV_UI', function () {

                    resizeWorkarea();
                    // resizeSidebarHeight();

                });

                scope.evEventService.addEventListener(evEvents.UPDATE_TABLE_VIEWPORT, function () {

                    resizeWorkarea();
                    // resizeSidebarHeight();

                });

                init();


            }
        }
    }

}());