/**
 * Created by mevstratov on 27.05.2019.
 */
(function () {

    'use strict';

    var evEvents = require('../../../services/entityViewerEvents');

    var userFilterService = require('../../../services/rv-data-provider/user-filter.service');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'E',
            scope: {
                filter: '=',
                evDataService: '=',
                evEventService: '='
            },
            templateUrl: 'views/directives/reportViewer/userFilters/rv-text-filter-view.html',
            link: function (scope, elem, attrs) {

                console.log("filter filterTextData", scope.filter);

                scope.filters = scope.evDataService.getFilters();

                scope.filterValue = undefined;
                scope.columnRowsContent = [];
                scope.showSelectMenu = false;

                scope.isRootEntityViewer = scope.evDataService.isRootEntityViewer();
                scope.attributesFromAbove = [];

                scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                    var columnRowsContent = userFilterService.getDataByKey(scope.evDataService, scope.filter.key);

                    scope.columnRowsContent = columnRowsContent.map(function (cRowsContent) {
                        return {id: cRowsContent, name: cRowsContent}
                    });

                    // scope.columnRowsContent = [{name: "lorem"}, {name: "ipsum"}, {name: "dolor"}, {name: "sit"}, {name: "amet"}, {name: "lorem ipsum"}, {name: "dolorsit"}, {name: "ametlorem"}, {name: "ipsumdolor"}, {name: "sitamet"}, {name: "loremipsum"}, {name: "dolor sit amet"}, {name: "111111111"}, {name: "2222222"}]; //
                    // console.log("filter select options", scope.filterSelectOptions, columnRowsContent);

                    if (!scope.isRootEntityViewer) {
                        scope.attributesFromAbove = scope.evDataService.getAttributesFromAbove();
                    }

                    scope.$apply();

                });

                if (!scope.filter.options) {
                    scope.filter.options = {};
                }

                if (!scope.filter.options.filter_type) {
                    scope.filter.options.filter_type = "contain";
                }

                if (!scope.filter.options.filter_values) {

                    scope.filter.options.filter_values = [];

                }

                scope.getFilterRegime = function () {

                    var filterRegime = "";

                    switch (scope.filter.options.filter_type) {
                        case "contain":
                            filterRegime = "Contains";
                            break;
                        case "does_not_contain":
                            filterRegime = "Does not contains";
                            break;
                        case "selector":
                            filterRegime = "Selector";
                            break;
                        case "multiselector":
                            filterRegime = "Multiple selector";
                            break;
                    }

                    return filterRegime;

                };

                scope.getMultiselectorName = function () {
                    var multiselectorName = scope.filter.name + ". " + "Regime = " + scope.filter.filter_type;

                    return multiselectorName;
                };

                scope.changeFilterType = function (filterType) {
                    scope.filter.options.filter_type = filterType;
                    scope.filter.options.filter_values = [];
                    scope.filterSettingsChange();
                };

                scope.filterSettingsChange = function () {
                    console.log("filter filterSettingsChange", scope.filter.options.filter_values);

                    /*if (scope.filter.options.filter_type === "contain" || scope.filter.option.filter_type === "does_not_contain") {
                        scope.filter.options.filter_values = scope.filter.options.filter_values.toLowerCase();
                    }*/

                    scope.evDataService.resetData();
                    scope.evDataService.resetRequestParameters();

                    var rootGroup = scope.evDataService.getRootGroupData();

                    scope.evDataService.setActiveRequestParametersId(rootGroup.___id);

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)

                };

                /*scope.toggleFilterSelectMenu = function (action) {
                    console.log("filter toggleFilterSelectMenu", action);
                    var selectMenu = elem[0].querySelector(".text-filter-select-menu");
                    var selectFilterContainer = elem[0].querySelector(".text-filter-select");

                    if (action === 'show') {

                        selectMenu.classList.remove("visibility-hidden");
                        selectFilterContainer.classList.add("select-menu-visible");

                        setTimeout(function () {
                            window.addEventListener('click', selectClickOutsideToClose);
                        }, 100);

                    } else {
                        selectMenu.classList.add("visibility-hidden");
                        selectFilterContainer.classList.remove("select-menu-visible");
                    }
                };*/

                scope.selectFilterOption = function (selectOption) {

                    /*var selectMenu = elem[0].querySelector(".text-filter-select-menu");
                    selectMenu.classList.add('visibility-hidden');
                    window.removeEventListener('click', selectClickOutsideToClose);*/

                    scope.filter.options.filter_values[0] = selectOption;
                    scope.filterSettingsChange();
                };

                var selectClickOutsideToClose = function (event) {
                    console.log("filter clicked");
                    var clickedElement = event.target;

                    var i;
                    for (i = 0; i < 7; i++) {

                        clickedElement = clickedElement.parentNode;

                        if (clickedElement.classList.contains("text-filter-select")) {
                            return;
                        } else if (clickedElement.tagName === "HTML") {
                            break;
                        }

                    }

                    var selectMenu = elem[0].querySelector(".text-filter-select-menu");
                    selectMenu.classList.add('visibility-hidden');
                    window.removeEventListener('click', selectClickOutsideToClose);
                };

                scope.renameFilter = function (filter, $mdMenu, $event) {

                    $mdMenu.close($event);

                    $mdDialog.show({
                        controller: 'RenameDialogController as vm',
                        templateUrl: 'views/dialogs/rename-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            data: filter
                        }
                    })

                };

                scope.removeFilter = function (filter) {
                    scope.filters = scope.evDataService.getFilters();
                    /*console.log('filter scope.filters', scope.filters);
                    scope.filters = scope.filters.map(function (item) {
                        // if (item.id === filter.id || item.name === filter.name) {
                        if (item.name === filter.name) {
                            // return undefined;
                            item = undefined;
                        }
                        //console.log('filter in filters list', item);
                        return item;
                    }).filter(function (item) {
                        return !!item;
                    });*/
                    scope.filters.map(function (item, index) {
                        if (item.key === filter.key) {
                            scope.filters.splice(index, 1);
                        }
                    });

                    scope.evDataService.setFilters(scope.filters);
                    scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)
                };


                scope.updateFilters = function(){

                    var filters = scope.evDataService.getFilters();

                    filters.forEach(function (item) {

                        if (scope.filter.key === item.key || scope.filter.id === item.id) {
                            item = Object.assign({}, scope.filter)
                        }

                    });

                    scope.evDataService.setFilters(scope.filters);

                };


                scope.initSplitPanelMode = function () {

                    if (!scope.isRootEntityViewer) {

                        scope.evEventService.addEventListener(evEvents.ACTIVE_OBJECT_FROM_ABOVE_CHANGE, function () {

                            if (['multiselector', 'date_tree', 'from_to'].indexOf(scope.filter.filter_type) === -1) {

                                var activeObjectFromAbove = scope.evDataService.getActiveObjectFromAbove();

                                scope.attributesFromAbove = scope.evDataService.getAttributesFromAbove();

                                var key = scope.filter.options.use_from_above;
                                var value = activeObjectFromAbove[key];

                                scope.filter.options.filter_values = [value]; // example value 'Bank 1 Notes 4% USD'

                                scope.updateFilters();

                                scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

                            }

                        })

                    }

                };


                scope.init = function () {

                    scope.initSplitPanelMode();


                };

                scope.init()

            }
        }
    }

}());