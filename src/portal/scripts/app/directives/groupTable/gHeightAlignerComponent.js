/**
 * Created by szhitenev on 20.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    module.exports = function () {
        return {
            restrict: 'A',
            scope: {
                options: '='
            },
            link: function (scope, elem, attrs) {

                var lastMouseMoveEvent = null;

                function setDefaultHeights() {

                    console.log('SET DEFAULT HEGIHT');

                    //workAreaHeight = $(window).height() - $('.header').first().height();
                    //workAreaWithoutGrouping = workAreaHeight - $('.g-wrapper .g-grouping-section').first().height(); // margin 4px
                    //$('.g-filter-sidebar').first().height(workAreaHeight);
                    //$('.g-wrapper .g-table-section').first().height(workAreaWithoutGrouping);
                    //$('.g-additions').first().height($(window).height() - workAreaHeight);
                    //$('group-table-body').first().css('height', 'auto');

                    var upperFilterSidebar = $(elem).find('.g-filter-sidebar').first();
                    var upperTableSection = $(elem).find('.g-table-section').first();
                    //var additions = $(elem).find('.g-additions').first();
                    var upperGroupTableBody = $(elem).find('.group-table-body').first();
                    //var upperGroupTableBody = $('.g-workarea.main-area .group-table-body').first();
                    var upperGroupSection = $(elem).find('.g-grouping-section').first();

                    workAreaHeight = $(elem).parents('.entity-viewer-holder').height();
                    workAreaWithoutGrouping = workAreaHeight - upperGroupSection.height();

                    upperFilterSidebar.height(workAreaHeight);
                    upperTableSection.height(workAreaWithoutGrouping);
                    //additions.height($(window).height() - workAreaHeight);

                    console.log('upperGroupTableBody', upperGroupTableBody);
                    console.log('workAreaHeight', workAreaHeight);

                    upperGroupTableBody.css('height', 'auto');
                    //upperGroupTableBody.height(workAreaHeight);


                }

                function setSplitHeights() {

                    //workAreaHeight = Math.floor(($(window).height() - $('.header').height()) / 2);
                    //workAreaWithoutGrouping = Math.floor((workAreaHeight - $('.g-wrapper .g-grouping-section').first().height()));

                    //$('.g-filter-sidebar').first().height(workAreaHeight);
                    //$('.g-wrapper .g-table-section').first().height(workAreaWithoutGrouping);


                    //$('.g-additions').height(workAreaHeight);
                    //$('.g-additions-workarea .g-table-section').last().height(workAreaHeight);
                    //$('.g-additions-workarea .group-table-body').last().height(workAreaHeight);

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
                            $('.g-workarea.main-area .group-table-body').first().height(mouseMoveY - $('.header').height() - $('.g-columns-component.g-thead').height() - 88);
                            $('.g-additions-workarea .group-table-body').last().height($(window).height() - mouseMoveY - $('.g-additions-workarea .g-columns-component.g-thead').height());
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

                    })


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

                    console.log('scope.options.additionsStatus', scope.options.additionsStatus);

                    if (scope.options.additionsStatus.reportWizard || scope.options.additionsStatus.editor || scope.options.additionsStatus.permissionEditor) {
                        //setTimeout(function () {
                        setSplitHeights();
                        //}, 100);
                    } else {
                        if (!scope.options.additionsStatus.reportWizard && !scope.options.additionsStatus.editor && !scope.options.additionsStatus.permissionEditor) {
                            //setTimeout(function () {
                                setDefaultHeights()
                            //}, 100);
                        }
                    }
                }

                if (scope.options.isRootEntityViewer == true) { // only root entityViewer has gHeightSlider

                    scope.additionsStatus = scope.options.additionsStatus;

                    logService.component('groupHeightAligner', 'initialized');

                    var workAreaHeight;
                    var workAreaWithoutGrouping;


                    scope.$watch('options.lastUpdate', function () {

                        resolveHeight()

                    });

                    // THAT DUPLICATED NEEDS FOR SPLIT PANEL PROPER HEIGHT CALCULATION
                    //
                    //setInterval(function () {
                    //
                    //    //if ($('.g-additions-workarea .g-filter-sidebar').length) {
                    //
                    //    var mouseMoveY;
                    //    var spaceLeft;
                    //    var headerBoxHeight = $('.header').height();
                    //    var mainAreaBox = $('.g-workarea.main-area .g-table-section').first();
                    //    var mainAreaSidebarBox = $('.g-filter-sidebar.main-sidebar').first();
                    //    var groupingSectionBoxHeight = $('.g-wrapper .g-grouping-section').height();
                    //
                    //    var additionsBox = $('.g-additions');
                    //    var additionsBoxTableSection = $('.g-additions-workarea .g-table-section').last();
                    //    var additionsBoxSidebarBox = $('.g-additions-workarea .g-filter-sidebar').last();
                    //
                    //    var handler = function (e) {
                    //
                    //        spaceLeft = $(window).height() - headerBoxHeight;
                    //        mouseMoveY = e.clientY;
                    //
                    //        $(elem).find('.mCSB_scrollTools_vertical').css({
                    //            position: 'absolute',
                    //            top: 0,
                    //            left: 'auto'
                    //        });
                    //
                    //        // WTF IS 88???
                    //
                    //        additionsBox.height(spaceLeft - mouseMoveY + 88 - 15);
                    //        additionsBoxTableSection.height(spaceLeft - mouseMoveY + 88);
                    //        $('.g-additions-workarea .g-filter-sidebar').last().height(spaceLeft - mouseMoveY + 88);
                    //        $('.g-workarea.main-area .group-table-body').first().height(mouseMoveY - $('.header').height() - $('.g-columns-component.g-thead').height() - 88);
                    //        $('.g-additions-workarea .group-table-body').last().height($(window).height() - mouseMoveY - $('.g-additions-workarea .g-columns-component.g-thead').height());
                    //        mainAreaBox.height(mouseMoveY - headerBoxHeight - 88);
                    //        if (groupingSectionBoxHeight < (mouseMoveY + groupingSectionBoxHeight - headerBoxHeight - 88)) {
                    //            mainAreaSidebarBox.height(mouseMoveY + groupingSectionBoxHeight - headerBoxHeight - 88);
                    //        }
                    //
                    //    };
                    //
                    //    if (lastMouseMoveEvent == null) {
                    //        lastMouseMoveEvent = new Event('mousemove');
                    //        lastMouseMoveEvent._is_default_event = true;
                    //    }
                    //
                    //    if (lastMouseMoveEvent.hasOwnProperty('_is_default_event')) {
                    //        if ($('.g-additions-workarea .g-filter-sidebar').length) {
                    //            lastMouseMoveEvent.clientY = Math.floor(($(window).height() - $('.header').height()) / 2);
                    //        }
                    //    }
                    //
                    //    handler(lastMouseMoveEvent);
                    //    //} else {
                    //    //    lastMouseMoveEvent = null;
                    //    //}
                    //
                    //}, 100);


                    $(window).on('resize', function () {
                        resolveHeight();
                    });

                }
            }
        }
    }

}());