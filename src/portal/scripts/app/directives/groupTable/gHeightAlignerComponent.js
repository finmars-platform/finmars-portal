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
                evEventService: '='
            },
            link: function (scope, elem, attrs) {

                scope.additions = scope.evDataService.getAdditions();
                scope.isRootEntityViewer = scope.evDataService.isRootEntityViewer();

                var lastMouseMoveEvent = null;

                var contentWrapElem = $('.g-content-wrap').first();
                // var workAreaElem = $('.g-workarea-wrap').first();

                function activateHeightSlider() {

                    $('.g-height-slider').bind('mousedown', function (e) {

                        var interfaceLayout = scope.evDataService.getInterfaceLayout();

                        var mouseMoveY;
                        var bodyHeight = document.body.clientHeight;

                        // var wrapperElem = $('.g-wrapper');
                        // var sidebarElem = $('.g-filter-sidebar.main-sidebar').first();
                        var splitPanelElem = $('.g-additions');
                        var splitPanelWrapperElem = splitPanelElem.find('.g-content-wrap');

                        var headerHeight = interfaceLayout.headerToolbar.height;

                        var splitPanelHeight;

                        var handler = function (e) {

                            mouseMoveY = e.clientY;
                            lastMouseMoveEvent = e;

                            splitPanelHeight = bodyHeight - mouseMoveY;

                            interfaceLayout.splitPanel.height = splitPanelHeight;

                            splitPanelElem.height(splitPanelHeight);
                            if (splitPanelWrapperElem) {
                                splitPanelWrapperElem.height(splitPanelHeight);
                            }

                            /*workAreaElem.height(bodyHeight - splitPanelHeight - headerHeight);
                            sidebarElem.height(bodyHeight - splitPanelHeight - headerHeight);
                            wrapperElem.height(bodyHeight - headerHeight - headerHeight);*/
                            contentWrapElem.height(bodyHeight - headerHeight - splitPanelHeight);

                            scope.evDataService.setInterfaceLayout(interfaceLayout);

                            scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);
                            scope.evEventService.dispatchEvent(evEvents.UPDATE_SPLIT_PANEL_TABLE_VIEWPORT);

                        };

                        $(window).bind('mousemove', function (e) {
                            handler(e);
                            $(window).bind('mouseup', function () {
                                $(window).unbind('mousemove');
                            })
                        });


                    });
                };

                function setDefaultHeights() {

                    var interfaceLayout = scope.evDataService.getInterfaceLayout();
                    interfaceLayout.splitPanel.height = 0;
                    scope.evDataService.setInterfaceLayout(interfaceLayout);

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);
                };

                function setSplitHeights() {

                    var interfaceLayout = scope.evDataService.getInterfaceLayout();

                    var headerToolbarHeight = interfaceLayout.headerToolbar.height;
                    var bodyHeight = document.body.clientHeight;
                    var splitPanelHeight = Math.floor((bodyHeight - headerToolbarHeight) / 2);

                    var splitPanelElem = $('.g-additions');
                    var splitPanelWrapperElem = splitPanelElem.find('.g-content-wrap');

                    interfaceLayout.splitPanel.height = splitPanelHeight;


                    contentWrapElem.height(bodyHeight - headerToolbarHeight - splitPanelHeight);

                    splitPanelElem.height(splitPanelHeight);
                    // splitPanelWrapperElem.height(splitPanelHeight);

                    scope.evDataService.setInterfaceLayout(interfaceLayout);
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                };

                $(window).on('resize', function () {
                    // setSplitHeights();
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_ENTITY_VIEWER_CONTENT_WRAP_SIZE);
                });

                scope.evEventService.addEventListener(evEvents.ADDITIONS_CHANGE, function () {

                    scope.additions = scope.evDataService.getAdditions();

                    setSplitHeights()
                });

                scope.evEventService.addEventListener(evEvents.REDRAW_TABLE, function () {

                    setSplitHeights()
                });

                scope.evEventService.addEventListener(evEvents.UPDATE_TABLE, function () {

                    setSplitHeights()

                });

                scope.init = function () {

                    setSplitHeights();
                    activateHeightSlider();

                };

                scope.init();

                scope.$on('$destroy', function () {
                    setDefaultHeights()
                })

            }
        }
    }

}());