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
                        var columnAreaHeight = $('.g-columns-component').height();
                        var groupingAreaHeight = $('.g-grouping-component').height();

                        var tableElem = $('.g-workarea.main-area .g-table-section').first();
                        var sidebarElem = $('.g-filter-sidebar.main-sidebar').first();
                        var splitPanelElem = $('.g-additions');

                        var splitPanelHeight;

                        var handler = function (e) {

                            mouseMoveY = e.clientY;
                            lastMouseMoveEvent = e;

                            splitPanelHeight = Math.abs(bodyHeight - mouseMoveY);

                            interfaceLayout.splitPanel.height = splitPanelHeight;

                            splitPanelElem.height(splitPanelHeight);
                            tableElem.height(bodyHeight - splitPanelHeight - columnAreaHeight - groupingAreaHeight);
                            sidebarElem.height(bodyHeight - splitPanelHeight + columnAreaHeight + groupingAreaHeight);

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

                scope.$on('$destroy', function() {
                    setDefaultHeights()
                })

            }
        }
    }

}());