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

                function setDefaultHeights() {
                    workAreaHeight = $(window).height() - $('.header').first().height();
                    workAreaWithoutGrouping = workAreaHeight - $('.g-wrapper .g-grouping-section').first().height(); // margin 4px
                    $('.g-filter-sidebar').first().height(workAreaHeight);
                    $('.g-wrapper .g-table-section').first().height(workAreaWithoutGrouping);
                    $('.g-additions').first().height($(window).height() - workAreaHeight);

                }

                function setSplitHeights() {
                    workAreaHeight = Math.floor(($(window).height() - $('.header').height()) / 2);
                    workAreaWithoutGrouping = Math.floor((workAreaHeight - $('.g-wrapper .g-grouping-section').first().height()));
                    $('.g-filter-sidebar').first().height(workAreaHeight);
                    $('.g-wrapper .g-table-section').first().height(workAreaWithoutGrouping);


                    $('.g-additions').height(workAreaHeight);
                    $('.g-additions-workarea .g-table-section').last().height(workAreaHeight);
                    $('.g-additions-workarea .group-table-body').last().height(workAreaHeight);

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

                        $(window).bind('mousemove', function (e) {

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

                            //console.log('mouseMoveY', mouseMoveY);
                            //console.log('spaceLeft', spaceLeft);
                            //
                            //console.log('Main area box height', mouseMoveY - headerBoxHeight);
                            //console.log('Main sidebar box height', mouseMoveY + groupingSectionBoxHeight - headerBoxHeight);
                            //
                            //console.log('additions area box height', spaceLeft - mouseMoveY);
                            //console.log('additions sidebar box height', spaceLeft - mouseMoveY);


                        });

                        $(window).bind('mouseup', function () {
                            $(window).unbind('mousemove');
                        })

                    })
                }

                if (scope.options.isRootEntityViewer == true) { // only root entityViewer has gHeightSlider

                    scope.additionsStatus = scope.options.additionsStatus;

                    logService.component('groupHeightAligner', 'initialized');

                    var workAreaHeight;
                    var workAreaWithoutGrouping;

                    scope.$watchCollection('additionsStatus', function () {

                        if (scope.additionsStatus.reportWizard || scope.additionsStatus.editor) {
                            setTimeout(function () {
                                setSplitHeights()
                            }, 100);
                        } else {
                            if (!scope.additionsStatus.reportWizard && !scope.additionsStatus.editor) {
                                setDefaultHeights()
                            }
                        }
                    });


                    $(window).on('resize', function () {
                        if (scope.additionsStatus.reportWizard || scope.additionsStatus.editor) {
                            setSplitHeights()
                        } else {
                            if (!scope.additionsStatus.reportWizard && !scope.additionsStatus.editor) {
                                setDefaultHeights()
                            }
                        }
                    });

                    //console.log('scope.additionsStatus.reportWizard', scope.additionsStatus.reportWizard);
                    //console.log('scope.additionsStatus.editor', scope.additionsStatus.editor);
                    //
                    //if (!scope.additionsStatus.reportWizard && !scope.additionsStatus.editor) {
                    //    setDefaultHeights()
                    //}

                }
            }
        }
    }

}());