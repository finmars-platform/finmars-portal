/**
 * Created by sergey on 11.05.16.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');
    var metaService = require('../../services/metaService');
    var utilsHelper = require('../../helpers/utils.helper');

    module.exports = function () {
        return {
            restrict: 'A',
            scope: {
                evDataService: '=',
                evEventService: '='
            },
            link: function (scope, elem, attr) {

                function resizeWorkarea() {
                    var workAreaElem = elem.parents('.g-workarea-wrap');
                    workAreaElem.width($(elem).parents('.entity-viewer-holder').width() - $(elem).parents('.g-wrapper').find('.g-filter-sidebar.main-sidebar').width());
                    var wrapperWidth = $(elem).find('.g-columns-component.g-thead').width() - $(elem).find('.g-cell-select.all').width();
                    $(elem).find('.g-scroll-wrapper').width(wrapperWidth);
                    $(elem).find('.g-scrollable-area').width(wrapperWidth);
                }

                function resizeSidebarHeight() {

                    var workAreaHeight = $(elem).parents('.entity-viewer-holder').height();
                    var upperFilterSidebar = $(elem).parents('.g-wrapper').find('.g-filter-sidebar');

                    upperFilterSidebar.height(workAreaHeight);

                }

                var init = function () {

                    resizeWorkarea();
                    resizeSidebarHeight();

                    $(window).on('resize', function () {
                        resizeWorkarea();
                        resizeSidebarHeight();
                    });

                };

                scope.evEventService.addEventListener('UPDATE_EV_UI', function () {

                    resizeWorkarea();
                    resizeSidebarHeight();

                });

                init();


            }
        }
    }

}());