/**
 * Created by szhitenev on 25.05.2021.
 * */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');
    var evDataHelper = require('../../helpers/ev-data.helper').default;
    var evRvCommonHelper = require('../../helpers/ev-rv-common.helper').default;
    var evFilterService = require('../../services/ev-data-provider/filter.service');
    var evHelperService = require('../../services/entityViewerHelperService');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'E',
            templateUrl: 'views/directives/groupTable/g-ev-left-panel-view.html',
            scope: {
                evDataService: '=',
                evEventService: '=',
                attributeDataService: '=',
                spExchangeService: '=', // TODO may be not need
                contentWrapElement: '='
            },
            link: function (scope,) {

                scope.multiselectIsActive = false;
                scope.groupTypes = [];

                scope.sliderButtonState = 'unfolded';

                const entityType = scope.evDataService.getEntityType();
                const contentType = scope.evDataService.getContentType();
                let finishRenderIndex;

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

                    if (tree.___type === "group" && tree.results.length) {

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

                        var originalWidth = interfaceLayout.evLeftPanel.width;

                        $(window).bind('mousemove', function sliderMouseMove(event) {

                            var diffX = event.clientX - clientX;

                            resultWidth = Math.max(230, originalWidth + diffX);

                            interfaceLayout.evLeftPanel.width = resultWidth;

                            leftPanel.style["flex-basis"] = resultWidth + 'px';
                            leftPanel.style.width = resultWidth + 'px';

                            scope.evDataService.setInterfaceLayout(interfaceLayout);

                            scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                        });

                    })

                    $(window).bind('mouseup', function () {

                        $(window).unbind('mousemove');
                        setTimeout(function () {
                            scope.$apply(); // apply scope.sliderButtonState change right away
                        }, 100)
                    });

                    evLeftPanelSliderButton.addEventListener('click', function (event) {

                        if (scope.sliderButtonState === 'unfolded') {

                            resultWidth = 33;
                            scope.sliderButtonState = 'folded';
                            slider.classList.add('display-none');

                            scope.groupSectionState = false;

                        } else {

                            resultWidth = 230;
                            scope.sliderButtonState = 'unfolded';
                            slider.classList.remove('display-none');

                        }

                        interfaceLayout.evLeftPanel.width = resultWidth;

                        leftPanel.style["flex-basis"] = resultWidth + 'px';
                        leftPanel.style.width = resultWidth + 'px';

                        scope.evDataService.setInterfaceLayout(interfaceLayout);

                        scope.$apply();

                        scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                    });

                }

                scope.initEventListeners = function () {

                    scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                        // scope.resize();

                        setTimeout(function () {
                            scope.tree = JSON.parse(JSON.stringify(scope.generateGroupsTree()));
                            scope.$apply()
                        }, 0)

                    });

                    scope.evEventService.addEventListener(evEvents.REDRAW_TABLE, function () {

                        // scope.resize();

                        setTimeout(function () {
                            scope.tree = JSON.parse(JSON.stringify(scope.generateGroupsTree()));
                            scope.$apply()
                        }, 0)

                    });


                    scope.evEventService.addEventListener(evEvents.UPDATE_TABLE, function () {

                        // scope.resize();

                        setTimeout(function () {
                            scope.tree = JSON.parse(JSON.stringify(scope.generateGroupsTree()));
                            scope.$apply();
                        }, 0)

                    });

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

                            scope.groupTypes.forEach(function (item, index) {
                                if (item.key === elemKey) {
                                    elemItem = item
                                }

                            })

                            scope.groupTypes = scope.groupTypes.filter(function (item) {
                                return item.key !== elemKey
                            })

                            scope.groupTypes.forEach(function (item, index) {

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

                        const items = [
                            document.querySelector('.evLeftPanelGroupingDndArea')
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

                scope.sortGroupType = function ($index, type) {

                    let groupTypes = scope.evDataService.getGroups();

                    /*
                    // reset sorting for other groups
                    var i;
                    for (i = 0; i < scope.groupTypes.length; i = i + 1) {
                        if (!scope.groupTypes[i].options) {
                            scope.groupTypes[i].options = {};
                        }
                    }*/

                    groupTypes = groupTypes.map(gType => {

                        if (!gType.options) {
                            gType.options = {};
                        }

                        return gType;

                    })

                    var group = groupTypes[$index];
                    group.options.sort = type;

                    scope.evDataService.setGroups(groupTypes);
                    scope.evDataService.setActiveGroupTypeSort(group);

                    scope.groupTypes = scope.evDataService.getGroups();

                    scope.evEventService.dispatchEvent(evEvents.GROUP_TYPE_SORT_CHANGE);

                }

                scope.deleteGroupType = function ($event, item, $index) {

                    scope.groupTypes = scope.groupTypes.filter(function (item, index) {
                        return index !== $index
                    })

                    scope.evDataService.setSelectedGroups([])
                    scope.evDataService.setGroups(scope.groupTypes)

                    scope.evDataService.resetData();
                    scope.evDataService.resetRequestParameters();

                    var rootGroup = scope.evDataService.getRootGroupData();

                    scope.evDataService.setActiveRequestParametersId(rootGroup.___id);

                    scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);

                }

                // const getAttributes = () => {
                //
                //     var allAttrsList;
                //
                //
                //     var entityType = scope.evDataService.getEntityType();
                //
                //     if (scope.viewContext === 'reconciliation_viewer') {
                //         allAttrsList = scope.attributeDataService.getReconciliationAttributes();
                //     } else {
                //
                //         switch (entityType) {
                //             case 'balance-report':
                //                 allAttrsList = scope.attributeDataService.getBalanceReportAttributes();
                //                 break;
                //
                //             case 'pl-report':
                //                 allAttrsList = scope.attributeDataService.getPlReportAttributes();
                //                 break;
                //
                //             case 'transaction-report':
                //                 allAttrsList = scope.attributeDataService.getTransactionReportAttributes();
                //                 break;
                //
                //             default:
                //                 var entityAttrs = [];
                //                 var dynamicAttrs = [];
                //                 allAttrsList = [];
                //
                //                 entityAttrs = scope.attributeDataService.getEntityAttributesByEntityType(entityType);
                //
                //                 entityAttrs.forEach(function (item) {
                //                     if (item.key === 'subgroup' && item.value_entity.indexOf('strategy') !== -1) {
                //                         item.name = 'Group';
                //                     }
                //                     item.entity = entityType;
                //                 });
                //
                //                /* let instrumentUserFields = scope.attributeDataService.getInstrumentUserFields();
                //                 let transactionUserFields = scope.attributeDataService.getTransactionUserFields();
                //
                //                 instrumentUserFields.forEach(function (field) {
                //
                //                     entityAttrs.forEach(function (entityAttr) {
                //
                //                         if (entityAttr.key === field.key) {
                //                             entityAttr.name = field.name;
                //                         }
                //
                //                     })
                //
                //                 });
                //
                //                 transactionUserFields.forEach(function (field) {
                //
                //                     entityAttrs.forEach(function (entityAttr) {
                //
                //                         if (entityAttr.key === field.key) {
                //                             entityAttr.name = field.name;
                //                         }
                //
                //                     })
                //
                //                 }); */
                //
                //                 dynamicAttrs = scope.attributeDataService.getDynamicAttributesByEntityType(entityType);
                //
                //
                //                 dynamicAttrs = dynamicAttrs.map(function (attribute) {
                //
                //                     let result = {};
                //
                //                     result.attribute_type = Object.assign({}, attribute);
                //                     result.value_type = attribute.value_type;
                //                     result.content_type = scope.contentType;
                //                     result.key = 'attributes.' + attribute.user_code;
                //                     result.name = attribute.name;
                //
                //                     return result
                //
                //                 });
                //
                //                 allAttrsList = allAttrsList.concat(entityAttrs);
                //                 allAttrsList = allAttrsList.concat(dynamicAttrs);
                //
                //                 break;
                //         }
                //
                //     }
                //
                //     return allAttrsList;
                //
                // };

                scope.addGroupType = function ($event) {

                    /*const allAttrsList = scope.attributeDataService.getAllAttributesByEntityType(entityType);

                    const availableAttrs = allAttrsList.filter(function (attr) {

                        if (attr.value_type === "mc_field" || attr.key === "notes") return false;

                        for (var i = 0; i < scope.groupTypes.length; i++) {
                            if (scope.groupTypes[i].key === attr.key) {
                                return false;
                            }
                        }
                        return true;
                    });*/

                    const allAttrs = scope.attributeDataService.getForAttributesSelector(entityType);
                    const columns = scope.evDataService.getColumns();
                    const selectedAttrs = scope.groupTypes.map( col => col.key );

                    /*$mdDialog.show({
                        controller: "TableAttributeSelectorDialogController as vm",
                        templateUrl: "views/dialogs/table-attribute-selector-dialog-view.html",
                        targetEvent: $event,
                        multiple: true,
                        locals: {
                            data: {
                                availableAttrs: availableAttrs,
                                title: 'Choose group to add',
                                isReport: false,
                                multiselector: true
                            }
                        }
                    })*/
                    $mdDialog.show({
                        controller: "AttributesSelectorDialogController as vm",
                        templateUrl: "views/dialogs/attributes-selector-dialog-view.html",
                        targetEvent: $event,
                        multiple: true,
                        locals: {
                            data: {
                                title: "Add groups",
                                attributes: allAttrs,
                                layoutNames: evHelperService.getAttributesLayoutNames(columns),
                                selectedAttributes: selectedAttrs,
                                contentType: contentType,
                            }
                        }
                    })
                    .then(function (res) {

                        if (res && res.status === "agree") {

                            for (var i = 0; i < res.data.items.length; i = i + 1) {

                                var groupType = evHelperService.getTableAttrInFormOf( 'group', res.data.items[i] );
                                scope.groupTypes.push(groupType);

                            }

                            scope.evDataService.setSelectedGroups([]);
                            scope.evDataService.setGroups(scope.groupTypes);

                            scope.evDataService.resetData();
                            scope.evDataService.resetRequestParameters();

                            var rootGroup = scope.evDataService.getRootGroupData();

                            scope.evDataService.setActiveRequestParametersId(rootGroup.___id);

                            scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);

                        }

                    });

                }

                var init = async function () {

                    scope.multiselectIsActive = scope.evDataService.getSelectedGroupsMultiselectState()

                    scope.initEventListeners();

                    scope.groupTypes = scope.evDataService.getGroups()

                    console.log('scope.groupTypes', scope.groupTypes)

                    scope.tree = JSON.parse(JSON.stringify(scope.generateGroupsTree()));

                    scope.handleSlider();
                    scope.drake.init();


                    finishRenderIndex = scope.evEventService.addEventListener(evEvents.FINISH_RENDER, function () {

                        scope.evContentElement = scope.contentWrapElement.querySelector('.ev-viewport');
                        scope.evEventService.removeEventListener(evEvents.FINISH_RENDER, finishRenderIndex);

                    });

                };

                init();

                scope.$on('$destroy', function () {
                    $(window).unbind('mouseup');
                });

            },
        }
    }
}());