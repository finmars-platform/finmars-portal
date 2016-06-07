/**
 * Created by szhitenev on 20.05.2016.
 */
(function () {

    'use strict';

    module.exports = function () {
        return {
            restrict: 'A',
            scope: {
                additionsStatus: '='
            },
            link: function (scope, elem, attrs) {
                scope.$watchCollection('additionsStatus', function () {

                    var workAreaHeight;
                    var workAreaWithoutGrouping;

                    function setDefaultHeights() {
                        workAreaHeight = $(window).height() - $('.header').height();
                        workAreaWithoutGrouping = workAreaHeight - $('.g-wrapper .g-grouping-section').height(); // margin 4px
                        $('.g-sidebar').height(workAreaHeight);
                        $('.g-wrapper .g-table-section').height(workAreaWithoutGrouping);
                    }

                    function setSplitHeights() {
                        workAreaHeight = Math.floor(($(window).height() - $('.header').height()) / 2);
                        workAreaWithoutGrouping = Math.floor((workAreaHeight - $('.g-wrapper .g-grouping-section').height()));
                        $('.g-sidebar').height(workAreaHeight);
                        $('.g-wrapper .g-table-section').height(workAreaWithoutGrouping);


                        $('.g-additions-workarea .g-table-section').height(workAreaHeight);
                        $('.g-additions-workarea .group-table-body').height(workAreaHeight);

                        $('.g-height-slider').bind('mousedown', function (e) {

                            var mouseMoveY;
                            var spaceLeft;
                            var headerBoxHeight = $('.header').height();
                            var mainAreaBox = $('.g-workarea.main-area .g-table-section');
                            var mainAreaSidebarBox = $('.g-sidebar.main-sidebar');
                            var groupingSectionBoxHeight = $('.g-wrapper .g-grouping-section').height();

                            var additionsBox = $('.g-additions-workarea .g-table-section');
                            var additionsBoxSidebarBox = $('.g-sidebar.additions-sidebar');

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
                                additionsBoxSidebarBox.height(spaceLeft - mouseMoveY + 88);
                                $('.g-workarea.main-area .group-table-body').height(mouseMoveY - $('.header').height() - $('.g-columns-component.g-thead').height() - 88);
                                $('.g-additions-workarea .group-table-body').height($(window).height() - mouseMoveY - $('.g-additions-workarea .g-columns-component.g-thead').height());
                                mainAreaBox.height(mouseMoveY - headerBoxHeight - 88);
                                mainAreaSidebarBox.height(mouseMoveY + groupingSectionBoxHeight - headerBoxHeight - 88);



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

                    if (scope.additionsStatus.table || scope.additionsStatus.editor) {
                        setTimeout(function () {
                            setSplitHeights()
                        }, 0);
                    } else {
                        setDefaultHeights()
                    }
                });

            }
        }
    }

}());