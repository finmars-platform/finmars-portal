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

                var entityType = scope.evDataService.getEntityType();
                var isReport = metaService.isReport(entityType);

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

                        drake.on('shadow', function (elem, container) { // used to prevent showing shadow of card in deletion area
                            if ($(container).attr('id') === 'gc-delete-area') {
                                $(elem).remove(); // removing only shadow of the dragged element
                            }
                        });

                        drake.on('drop', function (elem, target, source, nextSibling) {

                            $(target).removeClass('active');

                            var columnsHolder = scope.contentWrapElement.querySelector('.g-columns-holder');
                            var columnsBag = scope.contentWrapElement.querySelector('#columnsbag');
                            var groupsHolder = scope.contentWrapElement.querySelector('.g-groups-holder');
                            var groupsBag = scope.contentWrapElement.querySelector('#groupsbag');
                            var deleteArea = scope.contentWrapElement.querySelector('#gc-delete-area');
                            var groups = scope.evDataService.getGroups();
                            var columns = scope.evDataService.getColumns();

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
                                        templateUrl: 'views/warning-dialog-view.html',
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
                                            templateUrl: 'views/warning-dialog-view.html',
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
                                } else if (target === columnsHolder) {

                                    changeOrder("columns");

                                // < If column's cards order changed >

                                // If column needs to be deleted
                                } else if (target === deleteArea) {

                                    deleteItem("column");

                                    // < If column needs to be deleted >
                                } else if (target === groupsHolder || target === columnsBag) {
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

				var dragAndDropNewInterface = {

					init: function () {
						this.dragulaInit();
						this.eventListeners();
					},

					eventListeners: function () {

						let areaItemsChanged;
						const drake = this.dragula;

                        let columnsHolder = scope.contentWrapElement.querySelector('.gColumnsHolder');
                        let groupsHolder = scope.contentWrapElement.querySelector('.gGroupsHolder');

						const filtersHolder = scope.contentWrapElement.querySelector('.gFiltersHolder');
						const removeAreaHolder = scope.contentWrapElement.querySelector('.gRemoveAreaHolder')
						const leftSideGroupsHolder = scope.contentWrapElement.querySelector('.gLeftSideGroupsHolder');


						drake.on('drag', function () {

							areaItemsChanged = false;

                            scope.viewContext !== 'dashboard' &&
                            [filtersHolder, removeAreaHolder, leftSideGroupsHolder].forEach(holder => {

                                holder.style.display = 'block';
                                holder.nextSibling.style.display = 'block';

                            });

						});

						 drake.on('over', function (elem, container, source) {
                             container.classList.add('active')
						});

						drake.on('out', function (elem, container, source) {
                            elem.classList.remove('display-none');
                            container.classList.remove('active');
						});

						drake.on('shadow', function (elem, container, source) { // used to prevent showing shadow of card in deletion area

						 	if (container !== source) {
						 		elem.classList.add('display-none');
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

						    elem.classList.remove('last-dragged');
						    target.classList.remove('container-shadowed');

                            let groups = scope.evDataService.getGroups();
                            let columns = scope.evDataService.getColumns();

							let attrKey = elem.dataset.attrKey;

							let changeOrder = function (orderOf) {

								let htmlElems = [];
								let GCitems = [];
								let itemsAfterDragging = [];
								let updateGCFMethod = null;

								switch (orderOf) {

									case 'groups':

										htmlElems = target.querySelectorAll('.gDraggableHead');
										GCitems = groups;

										updateGCFMethod = function () {
											scope.evDataService.setGroups(itemsAfterDragging);
											scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
										};

										break;

									case 'columns':

										htmlElems = target.querySelectorAll('.gDraggableHead');

										let allColumns = [];

										GCitems = columns.filter((column, index) => {

											if (index < groups.length) { // columns under groups

												allColumns.push(column);
												return false;

											}

											return true;

										});

										updateGCFMethod = function () {

											allColumns = allColumns.concat(itemsAfterDragging);

											scope.evDataService.setColumns(allColumns);
											scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);

										};

										break;

								}

								for (let i = 0; i < htmlElems.length; i = i + 1) {

									let elemAttrKey = htmlElems[i].dataset.attrKey;
									let GCitem = GCitems.find(item => item.key === elemAttrKey);

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

								}

								if (isChanged) {

									areaItemsChanged = true;
									updateGCFMethod();

									scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

								}

							};

                            const deleteItem = function (deletionOf) {

                                drake.remove();

                                let GCitems = [];
                                const identifier = attrKey;
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
                                            console.log('#69 GCitems, identifier', GCitems, identifier)
                                            scope.evDataService.setColumns(GCitems);
                                            scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                                        };
                                        break;
                                }


                                // GCitems = GCitems.filter(item => item.key !== identifier);

                                for (var g = 0; 0 < GCitems.length; g++) {

                                    if (GCitems[g].key === identifier) {
                                        GCitems.splice(g, 1);
                                        break;
                                    }

                                }

                                areaItemsChanged = true;
                                updateGCFMethod();
                                scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                            };

                            const removeColumnToGroups = function () {
                                areaItemsChanged = true;

                                let draggedColumn = columns.find(column => column.key === attrKey);
                                let groupToAdd = evHelperService.getTableAttrInFormOf('group', draggedColumn);

                                groups.forEach(group => group.lastDragged = false);
                                columns.forEach(col => col.lastDragged = false);

                                groupToAdd.lastDragged = true;
                                groups.push(groupToAdd);

                                scope.evDataService.setGroups(groups);

                                scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                                scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                            };

                            const addFilter = function (elem) {

                                const attrKey = elem.dataset.attrKey;

                                const columns = scope.evDataService.getColumns();
                                const column = columns.find(column => column.key === attrKey)

                                const filters = scope.evDataService.getFilters();
                                const filterToAdd = evHelperService.getTableAttrInFormOf('filter', column);

                                if (filters.find(filter => filter.key === filterToAdd.key)) {

                                    return $mdDialog.show({
                                        controller: 'WarningDialogController as vm',
                                        templateUrl: 'views/dialogs/warning-dialog-view.html',
                                        parent: angular.element(document.body),
                                        clickOutsideToClose: false,
                                        multiple: true,
                                        locals: {
                                            warning: {
                                                title: 'Error',
                                                description: `Filter "${filterToAdd.name}" already exist`,
                                                actionsButtons: [{
                                                    name: "OK",
                                                    response: false
                                                }]
                                            }
                                        }
                                    });

                                }

                                filters.push(filterToAdd);

                                scope.evDataService.setFilters(filters);

                                scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);

                            };

  							// Methods for column's cards dragging
							if (source === columnsHolder) {

								if (target === groupsHolder || target === leftSideGroupsHolder) {

                                    removeColumnToGroups();

								}

								else if (target === columnsHolder) {

									changeOrder("columns");

								}

								else if (target === filtersHolder) {
                                    drake.cancel();
                                    addFilter(elem)


                                }

								else if (target === removeAreaHolder) {

                                    deleteItem("column");

                                }

							}
							// < Methods for column's cards dragging >
							else if (source === groupsHolder) {

								if (target === columnsHolder) {

									drake.remove(); // in this case drake.cancel() causes groups to disappear
									areaItemsChanged = true;

									let draggedGroupIndex;
									let draggedGroup = groups.find((column, index) => {

										if (column.key === attrKey) {
											draggedGroupIndex = index;
										}

										return column.key === attrKey;

									});

									groups.splice(draggedGroupIndex, 1);

									scope.evDataService.setGroups(JSON.parse(JSON.stringify(groups)));

									const firstColWithoutGroupIndex = groups.length;
									const columnToAdd = evHelperService.getTableAttrInFormOf('column', draggedGroup);

									columns.splice(draggedGroupIndex, 1);

									groups.forEach(group => group.lastDragged = false);
									columns.forEach(col => col.lastDragged = false);

                                    columnToAdd.lastDragged = true;
									columns.splice(firstColWithoutGroupIndex, 0, columnToAdd);

									scope.evDataService.setColumns(columns);

									scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
									scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
									scope.evEventService.dispatchEvent(evEvents.UPDATE_COLUMNS_SIZE);

									scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

								}

								else if (target === groupsHolder) {
									changeOrder("groups");
								}

								else if (target === filtersHolder) {
                                    drake.cancel();
                                    addFilter(elem);
                                }

                                else if (target === removeAreaHolder) {
                                    deleteItem("group");
                                }

                                else if (target === leftSideGroupsHolder) {
                                    drake.cancel();
                                }

							}

						});

						drake.on('dragend', function () {

						    [columnsHolder, groupsHolder].forEach(holder => holder.classList.remove('container-shadowed'));

                            scope.viewContext !== 'dashboard' &&
                            [filtersHolder, removeAreaHolder, leftSideGroupsHolder].forEach(holder => {

                                holder.style.display = 'none';
                                holder.nextSibling.style.display = 'none';

                            });

							if (areaItemsChanged) {
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
/*								 moves: function (elem, source, handle, sibling) { // prevents from moving columns that have groupings

									var colKey = elem.dataset.columnKey;

									if (source === colsHolder && doesColumnHasGrouping(colKey)) {
										return false;
									}

									return true;
								},*/

								accepts: function (elem, target, source, sibling) {

                                    return source !== groupsHolder || target !== leftSideGroupsHolder;

								},

								revertOnSpill: true
							});

						}

					}
				};

				if (isReport) {

					setTimeout(function () {
						dragAndDropNewInterface.init();
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