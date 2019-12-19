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

                // var contentWrapElem = $('.g-content-wrap').first();
                var contentWrapElem = $('.g-root-content-wrap').first();
                var verticalSPElem = document.querySelector('.verticalSplitPanelWrapper');

                function activateHeightSlider() {

                    console.log('activateHeightSlider');

                    var splitPanelResizer = $('.g-height-slider');

                    $(splitPanelResizer).bind('mousedown', function (e) {

                        e.stopPropagation();
                        e.preventDefault();

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

                            contentWrapElem.height(bodyHeight - headerHeight - splitPanelHeight);

                            if (verticalSPElem) {
                                verticalSPElem.style.height = (bodyHeight - headerHeight - splitPanelHeight) + 'px';
                            }

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
                }

                function setDefaultHeights() {

                    var interfaceLayout = scope.evDataService.getInterfaceLayout();
                    interfaceLayout.splitPanel.height = 0;
                    scope.evDataService.setInterfaceLayout(interfaceLayout);

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);
                }

                function setSplitHeights() {

                    var interfaceLayout = scope.evDataService.getInterfaceLayout();

                    var headerToolbarHeight = interfaceLayout.headerToolbar.height;
                    var bodyHeight = document.body.clientHeight;
                    var splitPanelHeight = interfaceLayout.splitPanel.height;
                    if (!splitPanelHeight || splitPanelHeight === 0) {
                        splitPanelHeight = Math.floor((bodyHeight - headerToolbarHeight) / 2);
                    }

                    var splitPanelElem = $('.g-additions');

                    interfaceLayout.splitPanel.height = splitPanelHeight;

                    contentWrapElem.height(bodyHeight - headerToolbarHeight - splitPanelHeight);
                    splitPanelElem.height(splitPanelHeight);

                    if (verticalSPElem) {
                        verticalSPElem.style.height = (bodyHeight - headerToolbarHeight - splitPanelHeight) + 'px';
                    }

                    scope.evDataService.setInterfaceLayout(interfaceLayout);

                }

                function gHeightAlignerMethodToTriggerOnWindowResize() {
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_ENTITY_VIEWER_CONTENT_WRAP_SIZE);
                }

                window.addEventListener('resize', gHeightAlignerMethodToTriggerOnWindowResize);

                var additionsChangeCallbackIndex = scope.evEventService.addEventListener(evEvents.ADDITIONS_CHANGE, function () {
                    scope.additions = scope.evDataService.getAdditions();

                    if (verticalSPElem) {
                        scope.verticalAdditions = scope.evDataService.getVerticalAdditions();

                        console.log('VERTICAL_ADDITIONS_CHANGE', scope.verticalAdditions)

                        if (!scope.additions.isOpen) {
                            verticalSPElem.style.height = '100%'
                        }

                    } else {
                        setSplitHeights()
                    }


                });

                var verticalAdditionsChangeCallbackIndex = scope.evEventService.addEventListener(evEvents.VERTICAL_ADDITIONS_CHANGE, function () {

                    setTimeout(function () { // wait for angular to remove or add vertical split panel
                        verticalSPElem = document.querySelector('.verticalSplitPanelWrapper');
                    }, 100);


                });

                scope.init = function () {

                    setSplitHeights();
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);
                    activateHeightSlider();

                };

                scope.init();

                scope.$on('$destroy', function () {

                    window.removeEventListener('resize', gHeightAlignerMethodToTriggerOnWindowResize);
                    scope.evEventService.removeEventListener(evEvents.ADDITIONS_CHANGE, additionsChangeCallbackIndex);
                    scope.evEventService.removeEventListener(evEvents.VERTICAL_ADDITIONS_CHANGE, verticalAdditionsChangeCallbackIndex);

                    setDefaultHeights();
                })

            }
        }
    }

}());