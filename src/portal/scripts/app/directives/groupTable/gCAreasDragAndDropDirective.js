/**
 * Created by mevstratov on 20.06.2019.
 */
(function () {

    'use strict';

	const evEvents = require('../../services/entityViewerEvents');

	const metaService = require('../../services/metaService');
	const evHelperService = require('../../services/entityViewerHelperService');
	const evDataHelper = require('../../helpers/ev-data.helper');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'A',
            scope: {
                evDataService: '=',
                evEventService: '=',
                contentWrapElement: '='
            },
            link: function (scope, elem, attrs) {

                scope.entityType = scope.evDataService.getEntityType();
                scope.viewContext = scope.evDataService.getViewContext();

                const entityType = scope.evDataService.getEntityType();
                const isReport = metaService.isReport(entityType);

				let groups = scope.evDataService.getGroups();
                let columns = scope.evDataService.getColumns();

                let dndAreas = {};
                let hiddenDnDAreas = [];

                if (scope.viewContext !== 'dashboard') {
					hiddenDnDAreas = ['filtersHolder', 'deletionAreaHolder', 'leftSideGroupsHolder', 'rightSideColumnsHolder'];
				}

                var doesColumnHasGrouping = function (colKey) {

                    var groups = scope.evDataService.getGroups();

                    for (var i = 0; i < groups.length; i++) {
                        if (groups[i].key === colKey) {
                            return true;
                        }
                    }

                    return false;

                }

                var dragAndDrop = {

                    init: function () {
                        this.dragulaInit();
                        this.eventListeners();
                    },

                    eventListeners: function () {

                    	var areaItemsChanged;
                        var drake = this.dragula;

                        drake.on('drag', function () {
                            areaItemsChanged = false;
                        });

                        drake.on('over', function (elem, container, source) {
                            areaItemsChanged = false;
                            $(container).addClass('active');
                        });

                        drake.on('out', function (elem, container, source) {
                            $(container).removeClass('active');
                        });

                        drake.on('shadow', function (elem, container) {
                            if ($(container).attr('id') === 'gc-delete-area') { // used to prevent showing shadow of card in deletion area
                                elem.classList.add('display-none');
                            }
                        });

                        drake.on('drop', function (elem, target, source, nextSibling) {

                            $(target).removeClass('active');

                            var columnsHolder = scope.contentWrapElement.querySelector('.g-columns-holder');
                            var columnsBag = scope.contentWrapElement.querySelector('#columnsbag');
                            var groupsHolder = scope.contentWrapElement.querySelector('.g-groups-holder');
                            var groupsBag = scope.contentWrapElement.querySelector('#groupsbag');
                            var deleteArea = scope.contentWrapElement.querySelector('#gc-delete-area');
                            groups = scope.evDataService.getGroups();
                            columns = scope.evDataService.getColumns();

                            var changeOrder = function (orderOf) {

                                var htmlElems = [];
                                var GCitems = [];
                                var GCFKeyProp = '';
                                var itemsAfterDragging = [];
                                var updateGCFMethod = null;

                                switch (orderOf) {
                                    case 'groups':
                                        htmlElems = target.querySelectorAll('.g-groups-holder .group-item');
                                        GCitems = groups;
                                        GCFKeyProp = 'groupKey';
                                        updateGCFMethod = function () {
                                            scope.evDataService.setGroups(itemsAfterDragging);
                                            scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                                        };
                                        break;
                                    case 'columns':
                                        htmlElems = target.querySelectorAll('.g-columns-holder .g-cell.g-column');
                                        GCitems = columns;
                                        GCFKeyProp = 'columnKey';
                                        updateGCFMethod = function () {
                                            scope.evDataService.setColumns(itemsAfterDragging);
                                            scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                                        };
                                        break;
                                }

                                for (var i = 0; i < htmlElems.length; i = i + 1) {

                                    for (var x = 0; x < GCitems.length; x = x + 1) {

                                        if (htmlElems[i].dataset[GCFKeyProp] === GCitems[x].key) {
                                            itemsAfterDragging.push(GCitems[x]);
                                            break;
                                        }

                                    }

                                }

                                var isChanged = false;

                                for (var i = 0; i < itemsAfterDragging.length; i++) {
                                    var item = itemsAfterDragging[i];

                                    if (item.key !== GCitems[i].key) {
                                        isChanged = true;
                                        break;
                                    }
                                }

                                if (isChanged) {
                                    areaItemsChanged = true;
                                    updateGCFMethod();
                                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                                }
                            };

                            var deleteItem = function (deletionOf) {

                                var GCitems = [];
                                var identifier = '';
                                var updateGCFMethod = null;
                                var allowColDeletion = true;

                                switch (deletionOf) {
                                    case 'group':
                                        GCitems = groups;
                                        identifier = elem.dataset['groupKey'];
                                        updateGCFMethod = function () {
                                            scope.evDataService.setGroups(GCitems);
                                            scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                                        };
                                        break;
                                    case 'column':
                                        GCitems = columns;
                                        identifier = elem.dataset['columnKey'];

                                        if (isReport) { // prevent column deletion, if there is group with same attr
                                            for (var i = 0; i < groups.length; i++) {
                                                if (groups[i].key === identifier) {
                                                    allowColDeletion = false;
                                                    break;
                                                }
                                            }
                                        }

                                        updateGCFMethod = function () {
                                            scope.evDataService.setColumns(GCitems);
                                            scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                                        };
                                        break;
                                }

                                if (allowColDeletion) {

                                    for (var g = 0; 0 < GCitems.length; g++) {

                                        if (GCitems[g].key === identifier) {
                                            GCitems.splice(g, 1);
                                            break;
                                        }

                                    }

                                    drake.remove();

                                    areaItemsChanged = true;
                                    updateGCFMethod();
                                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                }

                                else {

                                    drake.cancel();

                                    $mdDialog.show({
                                        controller: 'WarningDialogController as vm',
                                        templateUrl: 'views/dialogs/warning-dialog-view.html',
                                        parent: angular.element(document.body),
                                        clickOutsideToClose: false,
                                        multiple: true,
                                        locals: {
                                            warning: {
                                                title: 'Error',
                                                description: "Can't delete column that has grouping.",
                                                actionsButtons: [{
                                                    name: "OK",
                                                    response: false
                                                }]
                                            }
                                        }
                                    });
                                }

                            };

                            // Methods for column's cards dragging
                            if (source === columnsHolder) {

                                // If column's card dragged to grouping area
                                if (target === groupsBag) {

                                    var groupExist = false;
                                    var identifier = elem.dataset.columnKey;

                                    for (var i = 0; i < groups.length; i = i + 1) {
                                        if (groups[i].key === identifier) {
                                            groupExist = true;
                                            break;
                                        }
                                    }

                                    if (!groupExist) {

                                        var activeColumn;
                                        for (var i = 0; i < columns.length; i++) {

                                            if (columns[i].key === identifier) {
                                                activeColumn = columns[i];
                                            }
                                        }

                                        var groupToAdd = evHelperService.getTableAttrInFormOf('group', activeColumn);

                                        groups.push(groupToAdd);

                                        drake.cancel();

                                        areaItemsChanged = true;
                                        scope.evDataService.setGroups(groups);

                                        scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                                        scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                    } else {

                                        drake.cancel();

                                        $mdDialog.show({
                                            controller: 'WarningDialogController as vm',
                                            templateUrl: 'views/dialogs/warning-dialog-view.html',
                                            parent: angular.element(document.body),
                                            clickOutsideToClose: false,
                                            multiple: true,
                                            locals: {
                                                warning: {
                                                    title: 'Error',
                                                    description: 'There is already such group in Grouping Area',
                                                    actionsButtons: [{
                                                        name: "OK",
                                                        response: false
                                                    }]
                                                }
                                            }
                                        });

                                    }

                                // < If column's card dragged to grouping area >

                                // If column's cards order changed
                                }

                                else if (target === columnsHolder) {

                                    changeOrder("columns");
                                // < If column's cards order changed >

                                // If column needs to be deleted
                                }

                                else if (target === deleteArea) {

                                    deleteItem("column");

                                    // < If column needs to be deleted >
                                }

                                else if (target === groupsHolder || target === columnsBag) {
                                    drake.cancel();
                                }
                            // < Methods for column's cards dragging >

                            // Methods for group's cards dragging
                            }

                            else {

                                // If group's card dragged to column area
                                if (target === columnsHolder || target === columnsBag) {

                                    var identifier = elem.dataset.groupKey;

                                    if (isReport) {

                                        var columnToAdd;
                                        var columnOfDragedGroupIndex;

                                        for (var i = 0; i < columns.length; i = i + 1) {
                                            if (columns[i].key === identifier) {
                                                columnToAdd = columns[i];
                                                columnOfDragedGroupIndex = i;
                                                break;
                                            }
                                        }

                                        if (target === columnsBag) {

                                            columns.push(columnToAdd);
                                            columns.splice(columnOfDragedGroupIndex, 1);

                                        } else {

                                            if (nextSibling.dataset.columnKey !== columnToAdd.key) { // if next column is column of dragged group

                                                columns.splice(columnOfDragedGroupIndex, 1);

                                                for (var i = 0; i < columns.length; i++) {

                                                    if (nextSibling.dataset.columnKey === columns[i].key) {

                                                        /*var indexToAddColumn = i; // we adding group's column before next column
                                                        if (indexToAddColumn < 0) {
                                                            indexToAddColumn = 0;
                                                        };*/

                                                        columns.splice(i, 0, columnToAdd);
                                                        break;
                                                    }

                                                }

                                            }

                                        }

                                    }

                                    for (var i = 0; i < groups.length; i++) {

                                        if (groups[i].key === identifier) {
                                            groups.splice(i, 1);
                                            break;
                                        }

                                    }

                                    drake.remove();

                                    areaItemsChanged = true;

                                    scope.evDataService.setColumns(columns);

                                    if (isReport) {
                                        scope.evDataService.setGroups(groups);

                                        scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                                    }

                                    scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                // < If group's card dragged to column area >

                                // If group's cards order changed
                                }

                                else if (target === groupsHolder) {

                                    changeOrder("groups");

                                // < If group's cards order changed >

                                // If group needs to be deleted
                                }

                                else if (target === deleteArea) {
                                    deleteItem("group");

                                    // < If group needs to be deleted >
                                }

                            // < Methods for group's cards dragging >
                            }

                        });

                        drake.on('dragend', function (element) {

                            if (areaItemsChanged) {
                                scope.$apply();
                            }

                        });

                    },

                    dragulaInit: function () {

                        var colsHolder = scope.contentWrapElement.querySelector('.g-columns-holder');

                        var items = [
                            colsHolder,
                            scope.contentWrapElement.querySelector('#columnsbag'),
                            scope.contentWrapElement.querySelector('.g-groups-holder'),
                            scope.contentWrapElement.querySelector('#groupsbag'),
                            scope.contentWrapElement.querySelector('#gc-delete-area')
                        ];

                        if (isReport) {

                            this.dragula = dragula(items, {
                                moves: function (elem, source, handle, sibling) { // prevents from moving columns that have groupings

                                    var colKey = elem.dataset.columnKey;

                                    if (source === colsHolder && doesColumnHasGrouping(colKey)) {
                                        return false;
                                    }

                                    return true;
                                },

                                accepts: function (elem, target, source, sibling) {

                                    if (sibling) {
                                        var colKey = sibling.dataset.columnKey;

                                        if (doesColumnHasGrouping(colKey)) {
                                            return false;
                                        }
                                    }

                                    return true;

                                },

                                revertOnSpill: true
                            });

                        } else {
                            this.dragula = dragula(items, {
                                revertOnSpill: true
                            });
                        }

                    }
                };

				/* var dragAndDropNewInterface = {

					init: function () {
						this.dragulaInit();
						this.eventListeners();
					},

					eventListeners: function () {

						const drake = this.dragula;

						let areaItemsChanged;
						let draggedOverElem;

                        let columnsHolder = scope.contentWrapElement.querySelector('.gColumnsHolder');
                        let groupsHolder = scope.contentWrapElement.querySelector('.gGroupsHolder');

						dndAreas.filtersHolder = scope.contentWrapElement.querySelector('.gFiltersHolder');
						dndAreas.removeAreaHolder = scope.contentWrapElement.querySelector('.gRemoveAreaHolder')
						dndAreas.leftSideGroupsHolder = scope.contentWrapElement.querySelector('.gLeftSideGroupsHolder');


						drake.on('drag', function () {

							areaItemsChanged = false;

                            scope.viewContext !== 'dashboard' &&
							Object.keys(dndAreas).forEach(areaProp => {

								dndAreas[areaProp].style.display = 'block';
								dndAreas[areaProp].nextSibling.style.display = 'block';

                            });

						});

						drake.on('over', function (elem, container, source) {
						 	container.classList.add('active');
						});

						drake.on('out', function (elem, container, source) {

							elem.classList.remove('display-none');
                            container.classList.remove('active');

							if (draggedOverElem) {
								draggedOverElem.classList.remove('g-dragged-over-col');
							}

						});

						drake.on('shadow', function (elem, container, source) {

							elem.classList.add('display-none');

							const nextSibling = elem.nextSibling;

							if (nextSibling) { // indicate where elem will be moved

								if (draggedOverElem) {
									draggedOverElem.classList.remove('g-dragged-over-col');
								}

								nextSibling.classList.add('g-dragged-over-col');

								draggedOverElem = nextSibling;

							}

						 	if (source === columnsHolder && container === groupsHolder) {
						 	    groupsHolder.classList.add('container-shadowed');
                            } else {
                                groupsHolder.classList.remove('container-shadowed');
                            }

                            if (source === groupsHolder && container === columnsHolder) {
                                columnsHolder.classList.add('container-shadowed');
                            } else {
                                columnsHolder.classList.remove('container-shadowed');
                            }

						});

						drake.on('drop', function (elem, target, source, nextSibling) {

							target.classList.remove('container-shadowed');

                            let groups = scope.evDataService.getGroups();
                            let columns = scope.evDataService.getColumns();

							const lastDraggedElem = scope.contentWrapElement.querySelector('last-dragged');

							if (lastDraggedElem) {
								lastDraggedElem.classList.remove('last-dragged');
							}

							groups.forEach(group => group.lastDragged = false);
							columns.forEach(col => col.lastDragged = false);

							const attrKey = elem.dataset.attrKey;

							const changeOrder = function (orderOf) {

								drake.cancel();

								let GCitems = [];
								let updateGCFMethod = null;

								switch (orderOf) {

									case 'groups':

										GCitems = groups;

										updateGCFMethod = function () {
											scope.evDataService.setGroups(GCitems);
											scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
										};

										break;

									case 'columns':

										GCitems = columns;
										/!* GCitems = columns.filter((column, index) => {

											if (index < groups.length) { // columns under groups

												allColumns.push(column);
												return false;

											}

											return true;

										}); *!/

										updateGCFMethod = function () {
											scope.evDataService.setColumns(GCitems);
											scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
										};

										break;

								}

								const draggableItem = GCitems.find((item, index) => {

									if (item.key === attrKey) {
										GCitems.splice(index, 1);
										return true;
									}

									return false;

								});

								if (nextSibling) {

									const nextItemKey = nextSibling.dataset.attrKey;
									const nextItemIndex = GCitems.findIndex(item => item.key === nextItemKey);
									GCitems.splice(nextItemIndex, 0, draggableItem);

								} else { // moved to the end
									GCitems.push(draggableItem);
								}


								/!* for (let i = 0; i < htmlElems.length; i = i + 1) {

									const elemAttrKey = htmlElems[i].dataset.attrKey;
									const GCitem = GCitems.find(item => item.key === elemAttrKey);

									if (GCitem) {

                                        itemsAfterDragging.push(GCitem);

                                    }

								}

								var isChanged = false;

								for (let i = 0; i < itemsAfterDragging.length; i++) {

									let item = itemsAfterDragging[i];

									if (item.key !== GCitems[i].key) {
										isChanged = true;
										break;
									}

								} *!/
								areaItemsChanged = true;
								updateGCFMethod();

								/!* if (isChanged) {

									areaItemsChanged = true;
									updateGCFMethod();

								} *!/

							};

                            const deleteItem = function (deletionOf) {

                                let GCitems = [];
                                let updateGCFMethod = null;

                                switch (deletionOf) {

                                	case 'group':
                                        GCitems = groups;
                                        updateGCFMethod = function () {
                                            scope.evDataService.setGroups(GCitems);
                                            scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                                        };
                                        break;

                                    case 'column':

                                    	GCitems = columns;
                                        updateGCFMethod = function () {
                                            scope.evDataService.setColumns(GCitems);
											scope.evEventService.dispatchEvent(evEvents.UPDATE_COLUMNS_SIZE);
                                            scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                                        };

                                        break;
                                }
                                // GCitems = GCitems.filter(item => item.key !== identifier);

								const deletedItemIndex = GCitems.findIndex(item => item.key === attrKey);
								GCitems.splice(deletedItemIndex, 1);

								/!* for (var g = 0; 0 < GCitems.length; g++) {

                                    if (GCitems[g].key === attrKey) {

                                    	GCitems.splice(g, 1);
                                        break;

                                    }

                                } *!/

								// drake.remove();
								drake.remove();

                                areaItemsChanged = true;
                                updateGCFMethod();

                            };

                            const moveColumnToGroups = function () {

                            	drake.cancel();
                            	areaItemsChanged = true;

                                let draggedColumn = columns.find(column => column.key === attrKey);
                                let groupToAdd = evHelperService.getTableAttrInFormOf('group', draggedColumn);

                                groupToAdd.lastDragged = true;
                                groups.push(groupToAdd);

                                scope.evDataService.setGroups(groups);

                                scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);

                            };

                            const addFilter = function () {

								drake.cancel();

								const filters = scope.evDataService.getFilters();
                                const filterAlreadyExist = filters.find(filter => filter.key === attrKey);

                                if (filterAlreadyExist) {

                                	const filterName = filterAlreadyExist.layout_name ? filterAlreadyExist.layout_name : filterAlreadyExist.name;

                                    $mdDialog.show({
                                        controller: 'WarningDialogController as vm',
                                        templateUrl: 'views/dialogs/warning-dialog-view.html',
                                        parent: angular.element(document.body),
                                        clickOutsideToClose: false,
                                        multiple: true,
                                        locals: {
                                            warning: {
                                                title: 'Error',
                                                description: "Filter " + filterName + " already exist",
                                                actionsButtons: [{
                                                    name: "OK",
                                                    response: false
                                                }]
                                            }
                                        }
                                    });

                                }

                                else {

									const column = columns.find(column => column.key === attrKey);
									const filterToAdd = evHelperService.getTableAttrInFormOf('filter', column);

                                	filters.push(filterToAdd);

									scope.evDataService.setFilters(filters);

									scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);

								}

                            };

  							// Methods for column's cards dragging
							if (source === columnsHolder) {

								if (target === groupsHolder || target === leftSideGroupsHolder) {
									moveColumnToGroups();
								}

								else if (target === columnsHolder) {
									changeOrder("columns");
								}

								else if (target === filtersHolder) {
									addFilter();
                                }

								else if (target === removeAreaHolder) {
									deleteItem("column");
                                }

							}
							//< Methods for column's cards dragging >

							// Methods for group's cards dragging >
							else if (source === groupsHolder) {

								if (target === columnsHolder) {

									drake.cancel(); // in this case drake.cancel() causes groups to disappear
									areaItemsChanged = true;

									let draggedGroupIndex;
									let draggedGroup = groups.find((column, index) => {

										if (column.key === attrKey) {

											draggedGroupIndex = index;
											return true;

										}

										return false;

									});

									groups.splice(draggedGroupIndex, 1);

									scope.evDataService.setGroups(JSON.parse(JSON.stringify(groups)));

									const firstColWithoutGroupIndex = groups.length;
									const columnToAdd = evHelperService.getTableAttrInFormOf('column', draggedGroup);

									columns.splice(draggedGroupIndex, 1);

                                    columnToAdd.lastDragged = true;
									columns.splice(firstColWithoutGroupIndex, 0, columnToAdd);

									scope.evDataService.setColumns(columns);

									scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
									scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
									scope.evEventService.dispatchEvent(evEvents.UPDATE_COLUMNS_SIZE);

								}

								else if (target === groupsHolder) {
									changeOrder("groups");
								}

								else if (target === filtersHolder) {
									addFilter();
                                }

                                else if (target === removeAreaHolder) {
                                    deleteItem("group");
                                }

                                /!* else if (target === leftSideGroupsHolder) {
                                    drake.cancel();
                                } *!/

							}
							// < Methods for group's cards dragging >

						});

						drake.on('dragend', function (elem) {

							if (draggedOverElem) {
								draggedOverElem.classList.remove('g-dragged-over-col');
								draggedOverElem = null;
							}

						    [columnsHolder, groupsHolder].forEach(holder => holder.classList.remove('container-shadowed'));

                            scope.viewContext !== 'dashboard' &&
                            [filtersHolder, removeAreaHolder, leftSideGroupsHolder].forEach(holder => {

                                holder.style.display = 'none';
                                holder.nextSibling.style.display = 'none';

                            });

							if (areaItemsChanged) {

								areaItemsChanged = false; // prevents if from executing again on multiple 'dragend' fires

								scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
								scope.$apply();

							}


						});

					},

					dragulaInit: function () {

                        const columnsHolder = scope.contentWrapElement.querySelector('.gColumnsHolder');

                        const groupsHolder = scope.contentWrapElement.querySelector('.gGroupsHolder');
                        const leftSideGroupsHolder = scope.contentWrapElement.querySelector('.gLeftSideGroupsHolder');
                        const filtersHolder = scope.contentWrapElement.querySelector('.gFiltersHolder');
                        const removeAreaHolder = scope.contentWrapElement.querySelector('.gRemoveAreaHolder');

                        let items = [columnsHolder];

                        if (scope.viewContext !== 'dashboard') {

                            items = items.concat([groupsHolder, leftSideGroupsHolder, filtersHolder, removeAreaHolder]);

                        }

						if (isReport) {

							this.dragula = dragula(items, {
							/!* moves: function (elem, source, handle, sibling) { // prevents from moving columns that have groupings

									var colKey = elem.dataset.columnKey;

									if (source === colsHolder && doesColumnHasGrouping(colKey)) {
										return false;
									}

									return true;
								}, *!/

								accepts: function (elem, target, source, nextSibling) {

									if (source === groupsHolder && target === leftSideGroupsHolder) {
										return false;
									}

									if (target === source) {

										const elemKey = elem.dataset.attrKey;
										const columns = scope.evDataService.getColumns();
										const elemIndex = columns.findIndex(col => col.key === elemKey);

										// elem is not last
										if (nextSibling) {

											const nextSiblingKey = nextSibling.dataset.attrKey;

											if (columns[elemIndex + 1].key === nextSiblingKey ||
												elemKey === nextSiblingKey) {

												return false;

											}

										}
										// elem is last && dropped after itself
										else if (elemIndex + 1 === columns.length) {
											return false;
										}

										/!* if (nextSibling) { // elem dropped not at the end

											const nextSiblingKey = nextSibling.dataset.attrKey;
											const nextSiblingIndex = columns.findIndex(col => col.key === nextSiblingKey);
											const prevIndex = nextSiblingIndex - 1;

											if (columns[prevIndex] && columns[prevIndex].key === elemKey) {
												return false;
											}

										} else if (elemIndex === columns.length - 1) { // elem located at the end of list

											return false;

										} *!/

									}

									/!*if (key1 !== key2) {
										return true;
									}*!/
									let nextSiblingKey = nextSibling ? nextSibling.dataset.attrKey : null;

									return false;

								},

								copy: true,
								copySortSource: true,
								// revertOnSpill: true

							});

						}

					}
				}; */

				let draggableAttrKey;
				let draggableColIndex;
				let draggableCol;

				let groupsElems;
				let colsElems;

				const changeOrder = function (orderOf, nextSibling) {

					const nextSiblingKey = nextSibling ? nextSibling.dataset.attrKey : null;

					if (draggableAttrKey !== nextSiblingKey) {

						let GCitems = [];
						let updateGCFMethod = null;

						switch (orderOf) {

							case 'groups':

								GCitems = groups;

								updateGCFMethod = function () {
									scope.evDataService.setGroups(GCitems);
									scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
								};

								break;

							case 'columns':

								GCitems = columns;

								updateGCFMethod = function () {
									scope.evDataService.setColumns(GCitems);
									scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
								};

								break;

						}

						const draggableItem = GCitems.find((item, index) => {

							if (item.key === draggableAttrKey) {
								GCitems.splice(index, 1);
								return true;
							}

							return false;

						});

						if (nextSiblingKey) {

							const nextSiblingIndex = GCitems.findIndex(item => item.key === nextSiblingKey);
							GCitems.splice(nextSiblingIndex, 0, draggableItem);

						} else { // moved to the end
							GCitems.push(draggableItem);
						}

						updateGCFMethod();

						scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
						scope.$apply();

					}

				};

                // Victor 2021.02.05 Add right side columns drop area
				const removeColumnToEndOfList = function () {
				    const GCitems = columns;

                    const draggableItem = GCitems.find(item => item.key === draggableAttrKey);
                    const draggableItemIndex = GCitems.indexOf(draggableItem);

                    if (draggableItemIndex === -1) {
                        return;
                    }

                    GCitems.splice(draggableItemIndex, 1);
                    GCitems.push(draggableItem);

                    scope.evDataService.setColumns(GCitems);
                    scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                    scope.$apply();

                };
                // Victor 2021.02.05 Add right side columns drop area

				const onDragstart = function (ev, itemOrigin) {

					draggableAttrKey = ev.target.dataset.attrKey;
					draggableCol = columns.find((col, index) => {

						if (col.key === draggableAttrKey) {
							draggableColIndex = index;
							return true;
						}

						return false

					});

					let dragData = {
						attrKey: draggableAttrKey,
						itemOrigin: itemOrigin
					};

					dragData = JSON.stringify(dragData);

					ev.dataTransfer.setData("attributeData", dragData);
					ev.dataTransfer.setData(draggableAttrKey, "");
					ev.dataTransfer.setData(itemOrigin, "");

					ev.dataTransfer.dropEffect = 'none';

					hiddenDnDAreas.forEach(areaProp => {
						dndAreas[areaProp].classList.remove("display-none");
					});

					scope.contentWrapElement.classList.add("g-groups-columns-dnd");

				};

				const removeDraggedOverClasses = function (ev) {

					const removeClasses = function (draggedElem) {
						draggedElem.classList.remove("drop-left", "drop-right", "container-shadowed", "draggedOver");
					};

					if (ev) {

						let leftElem = ev.target.closest(".draggedOver");

						if (leftElem) {
							removeClasses(leftElem);
						}

					} else {

						let leftElems = scope.contentWrapElement.querySelectorAll(".draggedOver");
						leftElems.forEach(removeClasses);

					}

				};

				const onDragstartListeners = function (sameHolder, anotherHolder) {

					dndAreas[sameHolder].addEventListener('dragenter', onSameHolderDragenter);
					dndAreas[anotherHolder].addEventListener('dragover', onAnotherHolderDragover);

					dndAreas[sameHolder].addEventListener('dragleave', removeDraggedOverClasses);
					dndAreas[anotherHolder].addEventListener('dragleave', onAnotherHolderDragleave);

					dndAreas.groups.addEventListener('drop', onDropToGroups, {once: true});
					dndAreas.columns.addEventListener('drop', onDropToColumns, {once: true});

					const leftSideGroupsDropArea = dndAreas.leftSideGroupsHolder.querySelector('.gDropArea');
					leftSideGroupsDropArea.addEventListener('drop', onDropToGroups);

					const filterDropArea = dndAreas.filtersHolder.querySelector('.gDropArea');
					filterDropArea.addEventListener('drop', onDropToFilters);

					const deletionDropArea = dndAreas.deletionAreaHolder.querySelector('.gDropArea');
					deletionDropArea.addEventListener('drop', onDropToDeletionArea);

                    // Victor 2021.02.05 Add right side columns drop area
                    const rightSideColumnsDropArea = dndAreas.rightSideColumnsHolder.querySelector('.gDropArea');
                    rightSideColumnsDropArea.addEventListener('drop', onDropToColumns, {once: true});
                    // <Victor 2021.02.05 Add right side columns drop area>

					hiddenDnDAreas.forEach((hiddenAreaProp) => {

						dndAreas[hiddenAreaProp].addEventListener('dragenter', onDropAreaDragenter);
						dndAreas[hiddenAreaProp].addEventListener('dragleave', onDropAreaDragleave);

					});

					let gcElems = (sameHolder === "groups") ? groupsElems : colsElems;

					gcElems.forEach(gcElem => {

						const draggableArea = gcElem.querySelector(".gDraggableHeadArea");
						draggableArea.addEventListener('dragleave', removeDraggedOverClasses);

					});

				};

				const onDragstartInsideDashboardListeners = function () {

					dndAreas.columns.addEventListener('dragenter', onSameHolderDragenter);
					dndAreas.columns.addEventListener('drop', onDropToColumns, {once: true});

					colsElems.forEach(gcElem => {

						const draggableArea = gcElem.querySelector(".gDraggableHeadArea");
						draggableArea.addEventListener('dragleave', removeDraggedOverClasses);

					});

				};

				let initListenersOnDragstart;

				if (scope.viewContext !== 'dashboard') {

					initListenersOnDragstart = onDragstartListeners;

				} else {
					initListenersOnDragstart = onDragstartInsideDashboardListeners;
				}


				const onSameHolderDragenter = function (ev) {

					ev.stopPropagation();

					const holderClass = ev.dataTransfer.types.includes('columns') ? 'gColumnsHolder' : 'gGroupsHolder';
					const draggedOverElem = ev.toElement.closest(".gcAreaDnD");

					if (draggedOverElem.classList.contains(holderClass)) {

						draggedOverElem.classList.add("drop-right", "draggedOver");
						ev.dataTransfer.dropEffect = 'move';

					} else {

						const types = ev.dataTransfer.types;
						const nextSiblingKey = draggedOverElem.dataset.attrKey;

						const nextColumn = columns[draggableColIndex + 1];
						const beforeNextCol = nextColumn && nextColumn.key === nextSiblingKey;

						if (types.includes(nextSiblingKey) || beforeNextCol) { // dragged over element itself or next element

							ev.dataTransfer.dropEffect = 'none';

						} else {

							draggedOverElem.classList.add("drop-left", "draggedOver");
							ev.dataTransfer.dropEffect = 'move';

						}

					}

				};

				const onAnotherHolderDragover = function (ev) {
					const anotherHolder = ev.dataTransfer.types.includes("columns") ? "groups": "columns";
					dndAreas[anotherHolder].classList.add("container-shadowed", "draggedOver");
				};

				const onDropAreaDragenter = function (ev) {
					ev.stopPropagation();
					ev.target.classList.add("dragged-over");
				};

				const onAnotherHolderDragleave = function (ev) {
					const anotherHolder = ev.dataTransfer.types.includes("columns") ? "groups": "columns";
					dndAreas[anotherHolder].classList.remove("container-shadowed", "draggedOver");
				};

				const onDropAreaDragleave = function (ev) {
					ev.stopPropagation();
					ev.target.classList.remove("dragged-over");
				};

				const onColumnDragstart = function (ev) {
					onDragstart(ev, "columns");
					initListenersOnDragstart("columns", "groups");
				};

				const onDropToColumns = function (ev) {

					ev.preventDefault();

					let droppedItemData = ev.dataTransfer.getData("attributeData");
					droppedItemData = JSON.parse(droppedItemData);

					if (droppedItemData.itemOrigin === 'groups') {

						const groupToDeleteIndex = groups.findIndex(group => group.key === droppedItemData.attrKey);
						groups.splice(groupToDeleteIndex, 1);

						scope.evDataService.setGroups(groups);

						scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
						scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

					}

					else if (droppedItemData.itemOrigin === 'columns') {

                        // Victor 2021.02.05 Add right side columns drop area
					    const rightSideColumnsDropArea = dndAreas.rightSideColumnsHolder.querySelector('.gDropArea');
                        const isRightSideTarget = ev.currentTarget === rightSideColumnsDropArea;


                        if (isRightSideTarget) {

                            removeColumnToEndOfList();
                            return;

                        }
                        // <Victor 2021.02.05 Add right side columns drop area>

						const nextSibling = ev.target.closest('.gDraggableHead');
						changeOrder('columns', nextSibling);

					}
				};


				const onGroupDragstart = function (ev) {
					onDragstart(ev, "groups");
					initListenersOnDragstart("groups", "columns");
				};

				const onDropToGroups = function (ev) {

					ev.preventDefault();

					let droppedItemData = ev.dataTransfer.getData("attributeData");
					droppedItemData = JSON.parse(droppedItemData);

					if (droppedItemData.itemOrigin === 'groups') {

						const nextSibling = ev.target.closest('.gDraggableHead');
						changeOrder('groups', nextSibling);

					}

					else if (droppedItemData.itemOrigin === 'columns') {

						const groupToAdd = evHelperService.getTableAttrInFormOf('groups', draggableCol);

						const groups = scope.evDataService.getGroups();
						groups.push(groupToAdd);

						scope.evDataService.setGroups(groups);

						scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
						scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

					}

				};


				const onDropToFilters = function (ev) {

					ev.stopPropagation();

					const filters = scope.evDataService.getFilters();
					const filterAlreadyExist = filters.find(filter => filter.key === draggableAttrKey);

					if (filterAlreadyExist) {

						const filterName = filterAlreadyExist.layout_name ? filterAlreadyExist.layout_name : filterAlreadyExist.name;

						$mdDialog.show({
							controller: 'WarningDialogController as vm',
							templateUrl: 'views/dialogs/warning-dialog-view.html',
							parent: angular.element(document.body),
							clickOutsideToClose: false,
							multiple: true,
							locals: {
								warning: {
									title: 'Error',
									description: "Filter " + filterName + " already exist",
									actionsButtons: [{
										name: "OK",
										response: false
									}]
								}
							}
						});

					}

					else {

						const filterToAdd = evHelperService.getTableAttrInFormOf('filter', draggableCol);

						filters.push(filterToAdd);

						scope.evDataService.setFilters(filters);

						scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);

					}

				};

				const onDropToDeletionArea = function (ev) {

					let droppedItemData = ev.dataTransfer.getData("attributeData");
					droppedItemData = JSON.parse(droppedItemData);

					let GCitems;
					let updateGCFMethod;

					switch (droppedItemData.itemOrigin) {

						case 'groups':

							GCitems = scope.evDataService.getGroups();

							updateGCFMethod = function () {
								scope.evDataService.setGroups(GCitems);
								scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
							};

							break;

						case 'columns':

							GCitems = scope.evDataService.getColumns();

							updateGCFMethod = function () {
								scope.evDataService.setColumns(GCitems);
								scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
							};
							break;
					}

					const deletedItemIndex = GCitems.findIndex(item => item.key === droppedItemData.attrKey);
					GCitems.splice(deletedItemIndex, 1);

					updateGCFMethod();
					scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

				};

				//<editor-fold desc="Dragend">

				const removeListenersOnDragend = function () {

					let elemsToRemoveListeners = [dndAreas.columns];

					const removeElemDragListeners = function (gcElem) {

						const draggableArea = gcElem.querySelector(".gDraggableHeadArea");
						draggableArea.removeEventListener('dragleave', removeDraggedOverClasses);

					};

					if (scope.viewContext !== 'dashboard') {

						elemsToRemoveListeners.push(dndAreas.groups);
						groupsElems.forEach(removeElemDragListeners);

					}

					elemsToRemoveListeners.forEach(holder => {

						holder.removeEventListener('dragenter', onSameHolderDragenter);
						holder.removeEventListener('dragleave', removeDraggedOverClasses);
						holder.removeEventListener('dragover', onAnotherHolderDragover);

						holder.removeEventListener('drop', onDropToColumns);
						holder.removeEventListener('drop', onDropToGroups);

					});

					colsElems.forEach(removeElemDragListeners);

				};

				const onDragend = function () {

					scope.contentWrapElement.classList.remove("g-groups-columns-dnd");

					draggableAttrKey = null;
					draggableColIndex = null;
					draggableCol = null;

					hiddenDnDAreas.forEach(areaProp => {
						dndAreas[areaProp].classList.add("display-none");
					});

					removeDraggedOverClasses();

					removeListenersOnDragend();
				}
				//</editor-fold>

				const initDnDFromColumns = function () {

					colsElems = dndAreas.columns.querySelectorAll(".gDraggableHead");

					colsElems.forEach(colElem => {

						colElem.addEventListener('dragstart', onColumnDragstart);
						colElem.addEventListener('dragend', onDragend);

					});

				};

				const initDnDFromGroups = function () {

					groupsElems = dndAreas.groups.querySelectorAll(".gDraggableHead");

					groupsElems.forEach(groupElem => {

						groupElem.addEventListener('dragstart', onGroupDragstart);
						groupElem.addEventListener('dragend', onDragend);

					});

				};

				if (isReport) {

					setTimeout(function () {

						dndAreas.columns = scope.contentWrapElement.querySelector(".gColumnsHolder");
						dndAreas.groups = scope.contentWrapElement.querySelector(".gGroupsHolder");

						dndAreas.filtersHolder = scope.contentWrapElement.querySelector('.gFiltersDropArea');
						dndAreas.deletionAreaHolder = scope.contentWrapElement.querySelector('.gDeletionDropArea');
						dndAreas.leftSideGroupsHolder = scope.contentWrapElement.querySelector('.gLeftSideGroupsHolder');

                        // Victor 2021.02.05 Add right side columns drop area
						dndAreas.rightSideColumnsHolder = scope.contentWrapElement.querySelector('.gRightSideColumnsHolder');
                        // <Victor 2021.02.05 Add right side columns drop area>

						initDnDFromColumns();

						scope.evEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {

							columns = scope.evDataService.getColumns();
							// wait for columns ngRepeat inside gColumnsComponent
							setTimeout(() => initDnDFromColumns(), 200);

						});

						if (scope.viewContext !== 'dashboard') {

							initDnDFromGroups();

							scope.evEventService.addEventListener(evEvents.GROUPS_CHANGE, function () {

								groups = scope.evDataService.getGroups();
								// wait for groups ngRepeat inside gColumnsComponent
								setTimeout(() => initDnDFromGroups(), 200);

							});

						}

					}, 500);

				} else {

					setTimeout(function () {
						dragAndDrop.init();
					}, 500);

				}

            }
        }
    };
}());