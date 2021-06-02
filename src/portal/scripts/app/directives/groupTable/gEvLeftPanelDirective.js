/**
 * Created by szhitenev on 25.05.2021.
 * */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');
    var evDataHelper = require('../../helpers/ev-data.helper');


    module.exports = function ($mdDialog, $state,) {
        return {
            restrict: 'E',
            templateUrl: 'views/directives/groupTable/g-ev-left-panel-view.html',
            scope: {
                evDataService: '=',
                evEventService: '=',
                attributeDataService: '=',
                spExchangeService: '=', // TODO may be not need
            },
            link: function (scope,) {

                scope.multiselectIsActive = false;


                scope.generateGroupsTree = function () {

                    var result = evDataHelper.getGroupsAsTree(scope.evDataService);

                    console.log('generateGroupsTree.result', result)

                    return result;

                }

                scope.toggleMultiselect = function () {

                    scope.multiselectIsActive = !scope.multiselectIsActive;

                    scope.evDataService.setSelectedGroupsMultiselectState(scope.multiselectIsActive)

                }

                scope.resize = function () {
                    var table = document.querySelector('.g-table-section')

                    var leftPanel = document.querySelector('.g-ev-left-panel-holder')

                    leftPanel.style.height = table.clientHeight + 'px';
                }

                var init = async function () {

                    scope.multiselectIsActive = scope.evDataService.getSelectedGroupsMultiselectState()

                    scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                        scope.resize();

                        setTimeout(function () {
                            scope.tree = scope.generateGroupsTree();
                            scope.$apply()
                        }, 0)

                    });

                    scope.evEventService.addEventListener(evEvents.REDRAW_TABLE, function () {

                        scope.resize();

                        setTimeout(function () {
                            scope.tree = scope.generateGroupsTree();
                            scope.$apply()
                        }, 0)

                    });


                    scope.evEventService.addEventListener(evEvents.UPDATE_TABLE, function () {

                        scope.resize();

                        setTimeout(function () {
                            scope.tree = scope.generateGroupsTree();
                            scope.$apply();
                        }, 0)

                    });

                    scope.evEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {


                        setTimeout(function () {
                            scope.tree = scope.generateGroupsTree();
                            scope.$apply();
                        }, 0)

                    });

                    scope.evEventService.addEventListener(evEvents.GROUPS_CHANGE, function () {

                        setTimeout(function () {
                            scope.tree = scope.generateGroupsTree();
                            scope.$apply();
                        }, 0)

                    });

                    scope.evEventService.addEventListener(evEvents.FILTERS_CHANGE, function () {


                        setTimeout(function () {
                            scope.tree = scope.generateGroupsTree();
                            scope.$apply();
                        }, 0)

                    });


                    scope.tree = scope.generateGroupsTree()


                    setTimeout(function () {

                        scope.resize();

                    }, 100)

                    window.addEventListener('resize', function () {
                        scope.resize();
                    });

                    var slider = document.querySelector('.evLeftPanelSlider')

                    var leftPanel = document.querySelector('.g-ev-left-panel-holder')
                    var parentSection = leftPanel.parentElement
                    var tableSection = document.querySelector('.g-table-section')

                    var interfaceLayout = scope.evDataService.getInterfaceLayout();
                    var resultWidth;





                    slider.addEventListener('mousedown', function (event) {

                        console.log('mousedown event', event)

                        var clientX = event.clientX;
                        var clientY = event.clientY;

                        var originalWidth = interfaceLayout.evLeftPanel.width

                        $(window).bind('mousemove',function sliderMouseMove (event) {

                            var diffX = event.clientX - clientX;
                            // var diffY = clientY + event.clientY

                            if (originalWidth + diffX >= document.body.clientWidth) {
                                resultWidth = document.body.clientWidth;
                            } else if (originalWidth + diffX <= 33) {
                                resultWidth = 33;
                            } else {
                                resultWidth = originalWidth + diffX
                            }

                            interfaceLayout.evLeftPanel.width = resultWidth;
                            leftPanel.style.width = resultWidth + 'px';
                            tableSection.style.width = parentSection.clientWidth - resultWidth + 'px'

                            scope.evDataService.setInterfaceLayout(interfaceLayout);

                            scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                        } )

                    })

                    $(window).bind('mouseup', function () {

                        $(window).unbind('mousemove')
                    })


                };

                init();

            },
        }
    }
}());