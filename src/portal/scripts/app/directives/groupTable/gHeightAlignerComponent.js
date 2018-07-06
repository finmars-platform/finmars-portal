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

                        var mouseMoveY;
                        var spaceLeft;
                        var headerBoxHeight = $('.header').height();
                        var mainAreaBox = $('.g-workarea.main-area .g-table-section').first();
                        var mainAreaSidebarBox = $('.g-filter-sidebar.main-sidebar').first();
                        var groupingSectionBoxHeight = $('.g-wrapper .g-grouping-section').height();

                        var additionsBox = $('.g-additions');
                        var additionsBoxTableSection = $('.g-additions-workarea .g-table-section').last();
                        var additionsBoxSidebarBox = $('.g-additions-workarea .g-filter-sidebar').last();

                        var handler = function (e) {

                            lastMouseMoveEvent = e;

                            spaceLeft = $(window).height() - headerBoxHeight;
                            mouseMoveY = e.clientY;

                            $(elem).find('.mCSB_scrollTools_vertical').css({
                                position: 'absolute',
                                top: 0,
                                left: 'auto'
                            });


                            // WTF IS 88???

                            additionsBox.height(spaceLeft - mouseMoveY + 88 - 15);
                            additionsBoxTableSection.height(spaceLeft - mouseMoveY + 88);
                            additionsBoxSidebarBox.height(spaceLeft - mouseMoveY + 88);
                            // $('.g-workarea.main-area .group-table-body').first().height(mouseMoveY - $('.header').height() - $('.g-columns-component.g-thead').height() - 88);
                            // $('.g-additions-workarea .group-table-body').last().height($(window).height() - mouseMoveY - $('.g-additions-workarea .g-columns-component.g-thead').height());
                            mainAreaBox.height(mouseMoveY - headerBoxHeight - 88);
                            if (groupingSectionBoxHeight < (mouseMoveY + groupingSectionBoxHeight - headerBoxHeight - 88)) {
                                mainAreaSidebarBox.height(mouseMoveY + groupingSectionBoxHeight - headerBoxHeight - 88);
                            }
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

                    var upperFilterSidebar = $(elem).find('.g-filter-sidebar').first();
                    var upperTableSection = $(elem).find('.g-table-section').first();
                    // var upperGroupTableBody = $(elem).find('.group-table-body').first();
                    var upperGroupSection = $(elem).find('.g-grouping-section').first();

                    workAreaHeight = $(elem).parents('.entity-viewer-holder').height();
                    workAreaWithoutGrouping = workAreaHeight - upperGroupSection.height();

                    upperFilterSidebar.height(workAreaHeight);
                    upperTableSection.height(workAreaWithoutGrouping);

                    // upperGroupTableBody.height(workAreaWithoutGrouping - 76);

                }

                function setSplitHeights() {

                    var upperGroupSection = $(elem).find('.g-grouping-section').first();
                    var upperFilterSidebar = $(elem).find('.g-filter-sidebar').first();
                    var upperTableSection = $(elem).find('.g-table-section').first();
                    var additions = $(elem).find('.g-additions').first();
                    var additionsTableSection = $(elem).find('.g-additions-workarea .g-table-section').last();
                    var additionsAdditionsTableBody = $(elem).find('.g-additions-workarea .g-table-section').last();

                    workAreaHeight = Math.floor($(elem).parents('.entity-viewer-holder').height() / 2);
                    workAreaWithoutGrouping = Math.floor((workAreaHeight - upperGroupSection.height()));

                    upperFilterSidebar.height(workAreaHeight);
                    upperTableSection.height(workAreaWithoutGrouping);

                    additions.height(workAreaHeight);
                    additionsTableSection.height(workAreaHeight);
                    additionsAdditionsTableBody.height(workAreaHeight);

                }

                function resolveHeight() {

                    if (scope.additions.reportWizard || scope.additions.editor || scope.additions.permissionEditor) {

                        setSplitHeights();

                    } else {

                        setDefaultHeights()
                    }
                }

                if (scope.isRootEntityViewer === true) { // only root entityViewer has gHeightSlider

                    var workAreaHeight;
                    var workAreaWithoutGrouping;

                    $(window).on('resize', function () {
                        resolveHeight();
                    });

                    resolveHeight();

                    scope.evEventService.addEventListener(evEvents.ADDITIONS_CHANGE, function () {

                        scope.additions = scope.evDataService.getAdditions();

                        resolveHeight()
                    });

                    scope.evEventService.addEventListener(evEvents.REDRAW_TABLE, function () {

                        resolveHeight()
                    });

                    scope.evEventService.addEventListener(evEvents.UPDATE_TABLE, function () {

                        resolveHeight()

                    })

                }
                
                scope.evEventService.addEventListener(evEvents.ADDITIONS_RENDER, function () {

                    scope.additions = scope.evDataService.getAdditions();
                    
                    if(scope.additions.additionsState === true) {

                        activateHeightSlider()
                    }
                    
                });

            }
        }
    }

}());