/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';


    var attributeTypeService = require('../../services/attributeTypeService');

    var uiService = require('../../services/uiService');

    var entityResolverService = require('../../services/entityResolverService');
    var metaService = require('../../services/metaService');

    var gridHelperService = require('../../services/gridHelperService');
    var layoutService = require('../../services/layoutService');

    module.exports = function ($scope, data, $stateParams, $state, $mdDialog) {
        console.log("forms entityDataConstructor", data);
        var vm = this;
        vm.boxColumns = [1, 2, 3, 4, 5, 6];
        vm.readyStatus = {constructor: false};
        vm.uiIsDefault = false;

        vm.attrs = [];
        vm.entityAttrs = [];
        vm.userInputs = [];

        vm.items = [];

        vm.fieldsTrees = {};

        vm.entityType = data.entityType;

        vm.instanceId = undefined;
        if (data.hasOwnProperty('instanceId')) {
            vm.instanceId = data.instanceId;
        }

        vm.fromEntityType = undefined;
        if (data.hasOwnProperty('fromEntityType')) {
            vm.fromEntityType = data.fromEntityType;
        }

        var hideManageAttributesButton = false;
        if (data.hasOwnProperty('hideManageAttributesButton')) {
            hideManageAttributesButton = data.hideManageAttributesButton;
        }

        console.log('cancel button initEntityType', $stateParams);

        var choices = metaService.getTypeCaptions();

        // weirdo stuff
        // we took edit layout by instance id instead of entity content_type
        // but it can be taken from different entity
        // e.g. transaction -> transaction-type.book_transaction_layout

        vm.getLayout = function () {

            return new Promise(function (resolve) {

                if (vm.instanceId) {

                    uiService.getEditLayoutByInstanceId(vm.entityType, vm.instanceId).then(function (data) {

                        if (data) {
                            vm.ui = data;
                        } else {
                            vm.uiIsDefault = true;
                            vm.ui = uiService.getDefaultEditLayout()[0];
                        }

                        vm.tabs = vm.ui.data || [];
                        vm.tabs.forEach(function (tab) {
                            tab.layout.fields.forEach(function (field) {
                                field.editMode = false;
                            })
                        });

                        addRowForTab();

                        resolve(vm.tabs);

                    });

                } else {
                    uiService.getEditLayout(vm.entityType).then(function (data) {

                        if (data.results.length) {
                            vm.ui = data.results[0];
                        } else {
                            vm.uiIsDefault = true;
                            vm.ui = uiService.getDefaultEditLayout()[0];
                        }
                        vm.tabs = vm.ui.data;
                        vm.tabs.forEach(function (tab) {
                            tab.layout.fields.forEach(function (field) {
                                field.editMode = false;
                            })
                        });

                        addRowForTab();

                        resolve(vm.tabs);

                    });
                }

            })

        };

        vm.cancel = function () {
            /*var entityType = vm.entityType;
            if (vm.fromEntityType) {
                entityType = vm.fromEntityType;
            }
            $state.go('app.data.' + entityType);*/
            $mdDialog.cancel();
        };

        vm.checkColspan = function (tab, row, column) {

            //console.log('VM TAB', tab);

            /*var i, c;

            var rowMap = [];
            var startColumn;
            var colspans;

            for (i = 0; i < tab.layout.fields.length; i = i + 1) {
                if (tab.layout.fields[i].row == row) {
                    startColumn = tab.layout.fields[i].column;
                    colspans = parseInt(tab.layout.fields[i].colspan, 10);
                    for (c = 0; c < colspans; c = c + 1) {
                        if (!rowMap[startColumn]) {
                            rowMap[startColumn] = [];
                        }
                        rowMap[startColumn].push(parseInt(startColumn, 10) + parseInt(c, 10));
                    }
                }
            }

            var x, z;
            var keys = Object.keys(rowMap);

            for (x = 0; x < keys.length; x = x + 1) {
                if (keys[x] === column) {
                    return true;
                } else {
                    for (z = 1; z < rowMap[keys[x]].length; z = z + 1) {
                        if (column == rowMap[keys[x]][z]) {
                            //console.log('rowMap[keys[x]][z]', rowMap[keys[x]][z]);
                            return false;
                        }
                    }
                }
            }

            return true;*/

            var fieldsTree = vm.fieldsTrees[tab.id];
            var fieldRow = fieldsTree[row];
            var colspanSizeToHide = 2;

            for (var i = column - 1; i > 0; i--) { // check if previous columns have enough colspan to cover current one

                if (fieldRow[i] && parseInt(fieldRow[i].colspan) >= parseInt(colspanSizeToHide)) {
                    return false;
                }

                colspanSizeToHide = colspanSizeToHide + 1;
            }

            return true;

        };

        vm.range = gridHelperService.range;

        function addRowForTab() {
            var i;
            for (i = 0; i < vm.tabs.length; i = i + 1) {
                addRow(vm.tabs[i]);
            }
        }

        function addRow(tab) {

            // calculating how much rows needs creating in addition to first five
            var rowsToAdd = 5 - tab.layout.rows;
            if (rowsToAdd <= 0) { // if rows already 5 or more, functions should add 1 empty row
                rowsToAdd = 1;
            }

            var r, c;
            var field = {};
            for (r = 0; r < rowsToAdd; r = r + 1) {

                tab.layout.rows = tab.layout.rows + 1;

                for (c = 0; c < tab.layout.columns; c = c + 1) {
                    field = {
                        row: tab.layout.rows,
                        column: c + 1,
                        colspan: 1,
                        type: 'empty'
                    };
                    tab.layout.fields.push(field);

                }

            }

        }

        function removeLastRow(tab) {
            var f;
            for (f = 0; f < tab.layout.fields.length; f = f + 1) {
                if (tab.layout.fields[f].row === tab.layout.rows) {
                    tab.layout.fields.splice(f, 1);
                    f = f - 1;
                }
            }

            tab.layout.rows = tab.layout.rows - 1;
        }

        vm.setLayoutColumns = function (tab, columns, ev) {

            if (columns < tab.layout.columns) {
                var losedColumns = [];
                var i;
                for (i = columns; i < tab.layout.columns; i = i + 1) {
                    losedColumns.push(i + 1);
                }
                var description;
                if (losedColumns.length > 1) {
                    description = 'If you switch to less number of columns you lose data of ' + losedColumns.join(', ') + ' columns'
                } else {
                    description = 'If you switch to less number of columns you lose data of ' + losedColumns.join(', ') + ' column'
                }
                $mdDialog.show({
                    controller: 'WarningDialogController as vm',
                    templateUrl: 'views/warning-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    locals: {
                        warning: {
                            title: 'Warning',
                            description: description
                        }
                    },
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true,
                    multiple: true
                }).then(function (res) {
                    if (res.status === 'agree') {
                        var i, r, c;
                        for (i = 0; i < tab.layout.fields.length; i = i + 1) {
                            for (r = 0; r < tab.layout.rows; r = r + 1) {
                                for (c = columns; c < tab.layout.columns; c = c + 1) {
                                    if (tab.layout.fields[i].row == r + 1 && tab.layout.fields[i].column == c + 1) {
                                        tab.layout.fields.splice(i, 1);
                                    }
                                }
                            }
                        }

                        tab.layout.columns = columns;
                    }
                });
            } else {

                var r, c;

                for (r = 1; r <= tab.layout.rows; r = r + 1) {
                    for (c = tab.layout.columns + 1; c <= columns; c = c + 1) {
                        tab.layout.fields.push({
                            row: r,
                            column: c,
                            colspan: 1,
                            type: 'empty'
                        })
                    }
                }
                tab.layout.columns = columns;
            }

            vm.updateDrakeContainers();

        };

        vm.saveLayout = function () {

            var notSavedTabExist = false;
            for (var i = 0; i < vm.tabs.length; i = i + 1) {
                if (vm.tabs[i].hasOwnProperty('editState') && vm.tabs[i].editState) {
                    notSavedTabExist = true;
                    break;
                }
            }

            if (!notSavedTabExist) {

                for (var i = 0; i < vm.tabs.length; i = i + 1) {
                    removeLastRow(vm.tabs[i]);
                }
                vm.ui.data = vm.tabs;

                if (vm.uiIsDefault) {
                    if (vm.instanceId) {
                        uiService.updateEditLayoutByInstanceId(vm.entityType, vm.instanceId, vm.ui).then(function (data) {
                            console.log('layout saved1');
                            /*var route;
                            if (vm.entityType === 'complex-transaction') {
                                route = routeResolver.findExistingState('app.data.', 'transaction-type');
                            } else {
                                route = routeResolver.findExistingState('app.data.', vm.entityType);
                            }
                            $state.go(route.state, route.options);*/
                            $scope.$apply();

                            $mdDialog.hide({status: 'agree'});
                        });
                    } else {
                        uiService.createEditLayout(vm.entityType, vm.ui).then(function () {
                            console.log('layout saved2');

                            /*var route = routeResolver.findExistingState('app.data.', vm.entityType);
                            $state.go(route.state, route.options);*/
                            $scope.$apply();

                            $mdDialog.hide({status: 'agree'});
                        });
                    }
                } else {
                    if (vm.instanceId) {
                        uiService.updateEditLayoutByInstanceId(vm.entityType, vm.instanceId, vm.ui).then(function (data) {
                            console.log('layout saved3');

                            /*var route;
                            if (vm.entityType === 'complex-transaction') {
                                route = routeResolver.findExistingState('app.data.', 'transaction-type');
                            } else {
                                route = routeResolver.findExistingState('app.data.', vm.entityType);
                            }
                             $state.go(route.state, route.options);*/
                            $scope.$apply();

                            $mdDialog.hide({status: 'agree'});
                        });
                    } else {
                        uiService.updateEditLayout(vm.ui.id, vm.ui).then(function () {
                            console.log('layout saved4');

                            /*var route = routeResolver.findExistingState('app.data.', vm.entityType);
                            $state.go(route.state, route.options);*/
                            $scope.$apply();

                            $mdDialog.hide({status: 'agree'});
                        });
                    }
                }

            } else {

                $mdDialog.show({
                    controller: 'WarningDialogController as vm',
                    templateUrl: 'views/warning-dialog-view.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: false,
                    multiple: true,
                    locals: {
                        warning: {
                            title: 'Warning',
                            description: 'There is tab that is not saved. Please, save or delete it before saving input form configuration.'
                        }
                    }
                });

            }

        };

        vm.bindFlex = function (tab, row, column) {
            var totalColspans = 0;
            var i;
            var field;
            for (i = 0; i < tab.layout.fields.length; i = i + 1) {
                if (tab.layout.fields[i].row === row) {
                    if (tab.layout.fields[i].column === column) {
                        field = tab.layout.fields[i];
                    }

                    totalColspans = totalColspans + parseInt(tab.layout.fields[i].colspan, 10);
                }
            }
            var flexUnit = 100 / tab.layout.columns;
            if (field) {
                return Math.floor(field.colspan * flexUnit);
            }
            return Math.floor(flexUnit);
        };

        vm.deleteTab = function (tab) {
            var i;
            for (i = 0; i < vm.tabs.length; i = i + 1) {
                if (tab.name === vm.tabs[i].name) {
                    vm.tabs.splice(i, 1);
                    break;
                }
            }

            vm.syncItems()
        };

        vm.addTab = function () {

            if (!vm.tabs) {
                vm.tabs = [];
            }

            if (vm.tabs.length > 0) {

                var notSavedTabExist = false;

                var i;
                for (i = 0; i < vm.tabs.length; i = i + 1) {
                    if (vm.tabs[i].hasOwnProperty('editState') && vm.tabs[i].editState) {
                        notSavedTabExist = true;
                        break;
                    }
                }

                if (!notSavedTabExist) {

                    vm.tabs.push({
                        name: '',
                        editState: true,
                        layout: {
                            rows: 0,
                            columns: 1,
                            fields: []
                        }
                    });

                    addRow(vm.tabs[vm.tabs.length - 1]);

                    vm.updateDrakeContainers();

                } else {

                    $mdDialog.show({
                        controller: 'WarningDialogController as vm',
                        templateUrl: 'views/warning-dialog-view.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: false,
                        multiple: true,
                        locals: {
                            warning: {
                                title: 'Warning',
                                description: 'There is tab that is not saved. Please, save or delete it before creating new one.'
                            }
                        }
                    });
                }

            } else {

                vm.tabs.push({
                    name: '',
                    editState: true,
                    layout: {
                        rows: 0,
                        columns: 1,
                        fields: []
                    }
                });

                addRow(vm.tabs[vm.tabs.length - 1]);

                vm.updateDrakeContainers();

            }

        };

        vm.toggleEditTab = function (tab, action, $index) {
            if (!tab.editState) {
                tab.editState = false;
            }
            if (!tab.captionName) {
                tab.captionName = tab.name;
            }
            if (action === 'back') {

                if (!tab.captionName && tab.name === '') {
                    vm.tabs.splice($index, 1);
                } else {
                    tab.captionName = tab.name;
                }
            }
            tab.editState = !tab.editState;
        };

        vm.saveEditedTab = function (tab) {

            var tabIsReadyToSave = true;

            if (tab.captionName && tab.captionName !== '') {

                vm.tabs.forEach(function (singleTab) {

                    if (tab.captionName.toLowerCase() === singleTab.name.toLowerCase()) {
                        tabIsReadyToSave = false;
                    }
                });

                if (tabIsReadyToSave) {
                    tab.name = tab.captionName;
                    tab.editState = !tab.editState;
                }
            } else {
                tabIsReadyToSave = false;
            }

            if (!tabIsReadyToSave) {

                $mdDialog.show({
                    controller: 'WarningDialogController as vm',
                    templateUrl: 'views/warning-dialog-view.html',
                    // targetEvent: $event,
                    autoWrap: true,
                    skipHide: true,
                    multiple: true,
                    locals: {
                        warning: {
                            title: 'Warning!',
                            description: 'Name of the tab must make a unique character set.'
                        }
                    }
                });
            }
        };

        vm.attributesAvailable = function (entityType) {
            if (!metaService.checkRestrictedEntityTypesForAM(entityType) || hideManageAttributesButton) {
                return false;
            }

            return true;
        };

        vm.manageAttrs = function () {
            var entityAddress = {entityType: vm.entityType};
            if (vm.fromEntityType) {
                entityAddress = {entityType: vm.fromEntityType, from: vm.fromEntityType, instanceId: vm.instanceId};
            }
            $state.go('app.attributesManager', entityAddress);
        };

        vm.editLayout = function () {
            var entityAddress = {entityType: vm.entityType};
            if (vm.fromEntityType) {

                var entityType = vm.entityType;
                if (vm.fromEntityType === 'transaction-type') {
                    entityType = 'complex-transaction'
                }
                entityAddress = {entityType: entityType, from: vm.fromEntityType, instanceId: vm.instanceId};
            }
            $state.go('app.data-constructor', entityAddress);
        };

        vm.getItems = function () {

            attributeTypeService.getList(vm.entityType).then(function (data) {

                vm.attrs = data.results;
                var doNotShowAttrs = ['code', 'date', 'status', 'text'];
                var entityAttrs = metaService.getEntityAttrs(vm.entityType);
                vm.entityAttrs = entityAttrs.filter(function (entity) {
                    return doNotShowAttrs.indexOf(entity.key) === -1;
                });

                vm.layoutAttrs = layoutService.getLayoutAttrs();

                if (vm.instanceId && vm.entityType === 'complex-transaction') {

                    entityResolverService.getByKey('transaction-type', vm.instanceId).then(function (data) {

                        var inputs = data.inputs;

                        inputs.forEach(function (input) {

                            var input_value_type = input.value_type;
                            if (input.value_type === 100) {
                                input_value_type = 'field'
                            }

                            var contentType;

                            if (input.content_type && input.content_type !== undefined) {

                                contentType = input.content_type.split('.')[1];

                                if (contentType === 'eventclass') {
                                    contentType = 'event_class';
                                }

                                if (contentType === 'notificationclass') {
                                    contentType = 'notification_class';
                                }

                                if (contentType === 'accrualcalculationmodel') {
                                    contentType = 'accrual_calculation_model';
                                }

                                if (contentType === 'pricingpolicy') {
                                    contentType = 'pricing_policy';
                                }

                            } else {

                                contentType = input.name.split(' ').join('_').toLowerCase();

                            }

                            vm.userInputs.push({
                                key: contentType,
                                name: input.name,
                                verbose_name: input.verbose_name,
                                content_type: input.content_type,
                                value_type: input_value_type
                            });

                        });

                        vm.syncItems();

                        vm.readyStatus.constructor = true;

                        $scope.$apply(function () {

                            setTimeout(function () {
                                vm.dragAndDrop.init();
                            }, 500)

                        });


                    });

                } else {

                    vm.syncItems();

                    vm.readyStatus.constructor = true;

                    $scope.$apply(function () {

                        setTimeout(function () {
                            vm.dragAndDrop.init();
                        }, 500)

                    });

                }

            });

        };

        vm.createFieldsTrees = function () {

            vm.fieldsTrees = {};

            vm.tabs.forEach(function (tab) {

                vm.fieldsTrees[tab.id] = {};
                var f;
                for (f = 0; f < tab.layout.fields.length; f++) {

                    var treeTab = vm.fieldsTrees[tab.id];

                    var field = tab.layout.fields[f];
                    var fRow = field.row;
                    var fCol = field.column;

                    if (!treeTab[fRow]) {
                        treeTab[fRow] = {};
                    }

                    if (!treeTab[fRow][fCol]) {
                        treeTab[fRow][fCol] = {};
                    }

                    treeTab[fRow][fCol] = field;
                }
            });

        };

        vm.getDrakeContainers = function () {

            var items = [];

            var emptyFieldsElem = document.querySelectorAll('.ec-attr-empty');
            for (i = 0; i < emptyFieldsElem.length; i = i + 1) {
                items.push(emptyFieldsElem[i]);
            }

            var i;
            var cardsElem = document.querySelectorAll('.form-constructor-draggable-card');
            for (i = 0; i < cardsElem.length; i = i + 1) {
                items.push(cardsElem[i]);
            }

            console.log('emptyFieldsElem', emptyFieldsElem);

            return items;

        };

        vm.dragAndDrop = {

            drake: null,

            init: function () {

                var items = vm.getDrakeContainers();

                this.drake = dragula(items,
                    {
                        accepts: function (el, target, source, sibling) {

                            if (target.classList.contains('.form-constructor-draggable-card')) {
                                return false;
                            }

                            return true;
                        },
                        copy: true
                    });

                this.eventListeners();
            },

            eventListeners: function () {
                var that = this;
                this.drake.on('over', function (elem, container, source) {
                    $(container).addClass('active');
                    $(container).on('mouseleave', function () {
                        $(this).removeClass('active');
                    })

                });

                this.drake.on('out', function (elem, container, source) {
                    $(container).removeClass('active')

                });
                this.drake.on('drop', function (elem, target) {

                    console.log('target', target);

                    var entityAttrsKeys = [];
                    vm.entityAttrs.forEach(function (entityAttr) {
                        entityAttrsKeys.push(entityAttr.key);
                    });
                    var layoutAttrsKeys = [];
                    vm.layoutAttrs.forEach(function (layoutAttr) {
                        layoutAttrsKeys.push(layoutAttr.key);
                    });

                    $(target).removeClass('active');
                    var name = $(elem).html();

                    if (target) {
                        var a;

                        var nodes = Array.prototype.slice.call(target.children);
                        var index = nodes.indexOf(elem);

                        if (target.classList.contains('ec-attr-empty')) {

                            console.log('target.data', target.dataset);
                            console.log('target.data', elem.dataset);

                            var tabIndex = 0;
                            var tabName = target.dataset.tabName;
                            var column = parseInt(target.dataset.col, 10);
                            var row = parseInt(target.dataset.row, 10);
                            var itemIndex = parseInt(elem.dataset.index, 10);

                            vm.tabs.forEach(function (tab) {

                                // if (!tab.hasOwnProperty('editState') || (tab.hasOwnProperty('editState') && tab.editState)) {
                                if (tab.name === tabName) {
                                    console.log('target active tab', tab);
                                    tab.layout.fields.forEach(function (field) {

                                        if (field.column === column && field.row === row) {

                                            field.attribute = vm.items[itemIndex];
                                            field.name = field.attribute.name;
                                            field.attribute_class = 'userInput';
                                            field.type = 'field';
                                            field.colspan = 1;

                                            if (field.attribute.hasOwnProperty('id')) {
                                                field.attribute_class = 'attr';
                                                field.id = field.attribute.id;
                                            }

                                            if (entityAttrsKeys.indexOf(field.attribute.key) !== -1) {
                                                field.attribute_class = 'entityAttr';
                                            }
                                            if (layoutAttrsKeys.indexOf(field.attribute.key) !== -1) {
                                                field.attribute_class = 'decorationAttr';
                                            }


                                        }
                                    });

                                    if (row === tab.layout.rows) {
                                        addRow(tab)
                                    }
                                }

                            });

                            vm.createFieldsTrees();
                            vm.syncItems();

                            $scope.$apply();


                        }

                    }


                    $scope.$apply();
                });

                this.drake.on('dragend', function (el) {
                    $scope.$apply();
                    $(el).remove();
                })
            },

            destroy: function () {
                // console.log('this.dragula', this.dragula)
                this.drake.destroy();

            }
        };

        vm.updateDrakeContainers = function () {

            if (vm.dragAndDrop.drake) {

                setTimeout(function () {

                    vm.dragAndDrop.drake.containers = [];
                    vm.dragAndDrop.drake.containers = vm.getDrakeContainers();

                }, 500)

            }

        };

        vm.syncItems = function () {

            vm.items = [];

            vm.items = vm.items.concat(vm.attrs);
            // if (vm.entityType === 'complex-transaction' && !vm.instanceId) {
            //    console.log('remove fields complex-transaction');
            //    var entityAttrsForCT = doNotShowAttrs.filter(function (entityAttr) {
            //        return doNotShowAttrs.indexOf(entityAttr) === -1;
            //    });
            //
            //    vm.items.concat(entityAttrsForCT);
            //
            // }
            // else {
            //     vm.items = vm.items.concat(vm.entityAttrs);
            // }
            vm.items = vm.items.concat(vm.entityAttrs);
            vm.items = vm.items.concat(vm.userInputs);
            vm.items = vm.items.concat(vm.layoutAttrs);

            console.log('syncItems.items before', JSON.parse(JSON.stringify(vm.items)));

            vm.items = vm.items.filter(function (item) {

                var result = true;

                vm.tabs.forEach(function (tab) {
                    tab.layout.fields.forEach(function (field) {
                        if (field.name === item.name) {
                            result = false;

                            if (item.hasOwnProperty('key')) {
                                if (item.key === 'layoutLine' || item.key === 'layoutLineWithLabel') {
                                    result = true;
                                }
                            }

                        }
                    })
                });

                if (item.key === 'object_permissions_user') {
                    result = false;
                }

                if (item.key === 'object_permissions_group') {
                    result = false;
                }

                return result;

            });

            console.log('vm.entityType', vm.entityType);

            if (vm.entityType === 'instrument') {

                vm.items = vm.items.filter(function (item) {

                    if (['accrued_currency', 'payment_size_detail',
                        'accrued_multiplier', 'default_accrued',
                        'pricing_currency', 'price_multiplier',
                        'default_price', 'daily_pricing_model',
                        'price_download_scheme', 'reference_for_pricing'].indexOf(item.key) === -1) {
                        return true
                    }

                    return false;

                });

            }

            if (vm.entityType === 'transaction-type' || vm.entityType === 'complex-transaction') {

                vm.items = vm.items.filter(function (item) {

                    if (['user_text_1', 'user_text_2', 'user_text_3', 'user_text_4', 'user_text_5',
                        'user_text_6', 'user_text_7', 'user_text_8', 'user_text_9', 'user_text_10',
                        'user_number_1', 'user_number_2', 'user_number_3', 'user_number_4', 'user_number_5',
                        'user_number_6', 'user_number_7', 'user_number_8', 'user_number_9', 'user_number_10',
                        'user_date_1', 'user_date_2', 'user_date_3', 'user_date_4', 'user_date_5'
                    ].indexOf(item.key) === -1) {
                        return true
                    }

                    return false;

                });


            }

            vm.updateDrakeContainers();

            console.log('syncItems.items', vm.items);

        };

        vm.getFieldName = function (item) {

            if (item.attribute.hasOwnProperty('verbose_name')) {
                return item.attribute.verbose_name;
            }

            return item.attribute.name;
        };

        vm.getFieldType = function (valueType) {

            var i;
            for (i = 0; i < choices.length; i = i + 1) {
                if (valueType === choices[i].value) {
                    return choices[i]["caption_name"];
                }
            }

        };

        vm.init = function () {

            vm.getLayout().then(function () {

                vm.getItems();
                vm.createFieldsTrees();

            });

        };

        vm.init();
    }

}());