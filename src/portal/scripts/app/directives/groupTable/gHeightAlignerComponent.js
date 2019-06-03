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

                function activateHeightSlider() {

                    $('.g-height-slider').bind('mousedown', function (e) {

                        var interfaceLayout = scope.evDataService.getInterfaceLayout();

                        var mouseMoveY;
                        var bodyHeight = document.body.clientHeight;

                        var wrapperElem = $('.g-wrapper');
                        var sidebarElem = $('.g-filter-sidebar.main-sidebar').first();
                        var splitPanelElem = $('.g-additions');
                        var workAreaElem = $('.g-workarea-wrap').first();

                        var headerHeight = interfaceLayout.headerToolbar.height;

                        var splitPanelHeight;

                        var handler = function (e) {

                            mouseMoveY = e.clientY;
                            lastMouseMoveEvent = e;

                            splitPanelHeight = bodyHeight - mouseMoveY;

                            interfaceLayout.splitPanel.height = splitPanelHeight;

                            splitPanelElem.height(splitPanelHeight);

                            workAreaElem.height(bodyHeight - splitPanelHeight - headerHeight);
                            sidebarElem.height(bodyHeight - splitPanelHeight - headerHeight);
                            wrapperElem.height(bodyHeight - headerHeight - headerHeight);

                            scope.evDataService.setInterfaceLayout(interfaceLayout);

                            scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                        };

                        $(window).bind('mousemove', function (e) {
                            handler(e);
                            $(window).bind('mouseup', function () {
                                $(window).unbind('mousemove');
                            })
                        });


                    });
                }

                function setDefaultHeights() {

                    var interfaceLayout = scope.evDataService.getInterfaceLayout();
                    interfaceLayout.splitPanel.height = 0;
                    scope.evDataService.setInterfaceLayout(interfaceLayout);

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);
                }

                function setSplitHeights() {

                    var bodyHeight = document.body.clientHeight;

                    var interfaceLayout = scope.evDataService.getInterfaceLayout();

                    var splitPanelElem = $('.g-additions');
                    var splitPanelHeight = Math.floor(bodyHeight / 2);

                    interfaceLayout.splitPanel.height = splitPanelHeight;

                    splitPanelElem.height(splitPanelHeight);

                    scope.evDataService.setInterfaceLayout(interfaceLayout);
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                }

                $(window).on('resize', function () {
                    setSplitHeights();
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