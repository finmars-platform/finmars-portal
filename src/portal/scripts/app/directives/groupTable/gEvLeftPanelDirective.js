/**
 * Created by szhitenev on 25.05.2021.
 * */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');
    var evDataHelper = require('../../helpers/ev-data.helper');
    var evRvCommonHelper = require('../../helpers/ev-rv-common.helper');
	var evFilterService = require('../../services/ev-data-provider/filter.service');

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
                scope.groupTypes = [];

                scope.sliderButtonState = 'unfolded';


                scope.recursiveMarkHasSelected = function (tree, selectedGroups) {

                    tree.___has_selected_child = false;

                    selectedGroups.forEach(function (item) {

                        var parents = evRvCommonHelper.getParents(item.___parentId, scope.evDataService);

                        parents.forEach(function (parent) {
                            if (parent.___id === tree.___id) {
                                tree.___has_selected_child = true;
                            }
                        })

                    })

                    if (tree.results.length) {
                        tree.results.forEach(function (branch) {
                            scope.recursiveMarkHasSelected(branch, selectedGroups)

                        })
                    }

                }


                scope.generateGroupsTree = function () {

                    var result = evDataHelper.getGroupsAsTree(scope.evDataService);

                    console.log('generateGroupsTree.result', result);
                    var selectedGroups = scope.evDataService.getSelectedGroups();

                    scope.recursiveMarkHasSelected(result, selectedGroups);

					// result = evFilterService.filterTableTree(result, scope.evDataService);

                    return result;

                }

                scope.toggleMultiselect = function () {

                    scope.multiselectIsActive = !scope.multiselectIsActive;

                    scope.evDataService.setSelectedGroupsMultiselectState(scope.multiselectIsActive)

                }

                /* scope.resize = function () {
                    var table = document.querySelector('.g-table-section')

                    var leftPanel = document.querySelector('.g-ev-left-panel-holder')

                    leftPanel.style.height = (table.clientHeight - 15) + 'px'; // todo 10?
                } */

                scope.handleSlider = function () {

                    var slider = document.querySelector('.evLeftPanelSlider')

                    var leftPanel = document.querySelector('.g-ev-left-panel-holder')
                    var parentSection = leftPanel.parentElement
                    // var tableSection = document.querySelector('.g-table-section')

                    var interfaceLayout = scope.evDataService.getInterfaceLayout();
                    var resultWidth;

                    var evLeftPanelSliderButton = document.querySelector('.evLeftPanelSliderButton')

                    slider.addEventListener('mousedown', function (event) {

                        console.log('mousedown event', event)

                        var clientX = event.clientX;
                        var clientY = event.clientY;

                        var originalWidth = interfaceLayout.evLeftPanel.width;

						$(window).bind('mousemove', function sliderMouseMove(event) {

							var diffX = event.clientX - clientX;
							// var diffY = clientY + event.clientY
							resultWidth = Math.max(230, originalWidth + diffX);

							interfaceLayout.evLeftPanel.width = resultWidth;
							// leftPanel.style.width = resultWidth + 'px';
							// tableSection.style.width = parentSection.clientWidth - (resultWidth +1) + 'px'
							leftPanel.style["flex-basis"] = resultWidth + 'px';
							leftPanel.style.width = resultWidth + 'px';

							scope.evDataService.setInterfaceLayout(interfaceLayout);

							scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

						});

                    })

                    $(window).bind('mouseup', function () {

                        $(window).unbind('mousemove');
                        scope.$apply(); // apply scope.sliderButtonState change right away

                    });

                    evLeftPanelSliderButton.addEventListener('click', function (event){

                        if (scope.sliderButtonState === 'unfolded') {

                            resultWidth = 33;
                            scope.sliderButtonState = 'folded';
							slider.classList.add('display-none');

                        } else {

                        	resultWidth = 230;
                            scope.sliderButtonState = 'unfolded';
							slider.classList.remove('display-none');

                        }

                        interfaceLayout.evLeftPanel.width = resultWidth;
                        // leftPanel.style.width = resultWidth + 'px';
                        // tableSection.style.width = parentSection.clientWidth - (resultWidth +1) + 'px'
						leftPanel.style["flex-basis"] = resultWidth + 'px';
						leftPanel.style.width = resultWidth + 'px';

                        scope.evDataService.setInterfaceLayout(interfaceLayout);

                        scope.$apply();

                        scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                    });

                }

                scope.initEventListeners = function () {

                    /* scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                        // scope.resize();

                        setTimeout(function () {
                            scope.tree = scope.generateGroupsTree();
                            scope.$apply()
                        }, 0)

                    }); */

                    scope.evEventService.addEventListener(evEvents.REDRAW_TABLE, function () {

                        // scope.resize();

                        setTimeout(function () {
                            scope.tree = scope.generateGroupsTree();
                            scope.$apply()
                        }, 0)

                    });


                    scope.evEventService.addEventListener(evEvents.UPDATE_TABLE, function () {

                        // scope.resize();

                        setTimeout(function () {
                            scope.tree = scope.generateGroupsTree();
                            scope.$apply();
                        }, 0)

                    });

                    /* scope.evEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {


                        setTimeout(function () {
                            scope.tree = scope.generateGroupsTree();
                            scope.$apply();
                        }, 0)

                    }); */

                    /* In one of GROUPS_CHANGE listeners, update table called
                    scope.evEventService.addEventListener(evEvents.GROUPS_CHANGE, function () {

                        scope.groupTypes = scope.evDataService.getGroups()

                        setTimeout(function () {
                            scope.tree = scope.generateGroupsTree();
                            scope.$apply();
                        }, 0)

                    }); */

                    /* REDRAW_TABLE called after entity viewer's front filters changed
                    scope.evEventService.addEventListener(evEvents.FILTERS_CHANGE, function () {


                        setTimeout(function () {
                            scope.tree = scope.generateGroupsTree();
                            scope.$apply();
                        }, 0)

                    }); */

                }

                scope.drake = {

                    init: function () {
                        this.dragulaInit();
                        this.eventListeners();
                    },

                    eventListeners: function () {

                        var drake = this.dragula;

                        drake.on('drop', function (elem, target, source, nextSibling) {
                            console.log('scope.elem', elem);

                            var elemKey = elem.dataset.key;
                            var nextSiblingKey;

                            if (nextSibling) {
                                nextSiblingKey = nextSibling.dataset.key
                            }

                            var elemItem;
                            var elemNextSiblingIndex;

                            scope.groupTypes.forEach(function (item, index){
                                if(item.key === elemKey) {
                                    elemItem = item
                                }

                            })

                            scope.groupTypes = scope.groupTypes.filter(function (item){
                                return item.key !== elemKey
                            })

                            scope.groupTypes.forEach(function (item, index){

                                if (item.key === nextSiblingKey) {
                                    elemNextSiblingIndex = index
                                }
                            })


                            console.log('dragPanelLeft.elemNextSiblingIndex', elemNextSiblingIndex);

                            if (elemNextSiblingIndex !== null && elemNextSiblingIndex !== undefined) {
                                scope.groupTypes.splice(elemNextSiblingIndex, 0, elemItem);
                            } else {
                                scope.groupTypes.push(elemItem)
                            }

                            scope.evDataService.setSelectedGroups([])
                            scope.evDataService.setGroups(scope.groupTypes)

                            scope.evDataService.resetData();
                            scope.evDataService.resetRequestParameters();

                            var rootGroup = scope.evDataService.getRootGroupData();

                            scope.evDataService.setActiveRequestParametersId(rootGroup.___id);

                            scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);

                            console.log('dragPanelLeft.nextSibling', nextSibling);
                            console.log('dragPanelLeft.groupTypes', scope.groupTypes);
                        });

                    },

                    dragulaInit: function () {

                        var items = [
                            document.querySelector('.evLeftPanelGroupingSection')
                        ];

                        this.dragula = dragula(items, {
                            revertOnSpill: true,
                        });

                    },

                    destroy: function () {
                        if (this.dragula) {
                            this.dragula.destroy();
                        }
                    }
                };

                var init = async function () {

                    scope.multiselectIsActive = scope.evDataService.getSelectedGroupsMultiselectState()

                    scope.initEventListeners();

                    scope.groupTypes = scope.evDataService.getGroups()

                    console.log('scope.groupTypes', scope.groupTypes)

                    scope.tree = scope.generateGroupsTree()

					/* setTimeout(function () {

						scope.resize();

					}, 100)

					window.addEventListener('resize', function () {
						scope.resize();
					}); */

                    scope.handleSlider();
                    scope.drake.init();


                };

                init();

                scope.$on('$destroy', function () {
					$(window).unbind('mouseup');
				});

            },
        }
    }
}());