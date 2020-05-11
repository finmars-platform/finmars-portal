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
    var ScrollHelper = require('../../helpers/scrollHelper');
    var layoutService = require('../../services/layoutService');

    var transactionTypeService = require('../../services/transactionTypeService');

    var scrollHelper = new ScrollHelper();

    module.exports = function entityDataConstructorDialogController($scope, data, $stateParams, $state, $mdDialog) {

        var vm = this;
        vm.boxColumns = [1, 2, 3, 4, 5, 6];
        vm.readyStatus = {constructor: false};
        vm.uiIsDefault = false;

        vm.attrs = [];
        vm.entityAttrs = [];
        vm.userInputs = [];

        vm.items = [];

        vm.tabs = [];
        vm.fieldsTree = {};
        vm.fixedArea = null;

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

        var choices = metaService.getTypeCaptions();

        var fixTab = function (tab, numberOfRows, numberOfCols, fieldsList) {

            var i, c;
            for (i = 1; i <= numberOfRows; i++) {
                var row = tab[i];

                for (c = 1; c <= numberOfCols; c++) {

                    if (!row[c]) {

                        var missingSocket = {
                            colspan: 1,
                            column: c,
                            editMode: false,
                            row: i,
                            type: 'empty'
                        };

                        fieldsList.push(missingSocket);

                    }

                }

            }
        };

        var fixTabs = function () {

            vm.createFieldsTree();

            if (Object.keys(vm.fieldsTree).length) {
                Object.keys(vm.fieldsTree).forEach(function (tabNumber, tabIndex) {

                    var tab = vm.fieldsTree[tabIndex];
                    var numberOfRows = vm.tabs[tabIndex].layout.rows;
                    var numberOfCols = vm.tabs[tabIndex].layout.columns;

                    fixTab(tab, numberOfRows, numberOfCols, vm.tabs[tabIndex].layout.fields);

                });
            }

            if (vm.fixedArea.isActive) {
                vm.createFixedAreaFieldsTree();

                if (Object.keys(vm.fixedAreaFieldsTree).length) {
                    var numberOfRows = vm.fixedArea.layout.rows;
                    var numberOfCols = vm.fixedArea.layout.columns;

                    fixTab(vm.fixedAreaFieldsTree, numberOfRows, numberOfCols, vm.fixedArea.layout.fields);
                }

            }

        };

        // weirdo stuff
        // we took edit layout by instance id instead of entity content_type
        // but it can be taken from different entity
        // e.g. transaction -> transaction-type.book_transaction_layout

        var setDataConstructorLayout = function () {

            if (Array.isArray(vm.ui.data)) {

                vm.tabs = vm.ui.data || [];

            } else {

                vm.tabs = vm.ui.data.tabs || [];
                vm.fixedArea = vm.ui.data.fixedArea;

            }

            vm.tabs.forEach(function (tab, index) {
                tab.tabOrder = index;

                tab.layout.fields.forEach(function (field) {
                    field.editMode = false;
                })
            });

            if (!vm.fixedArea) {

                vm.fixedArea = {
                    isActive: false,
                    layout: {
                        rows: 0,
                        columns: 1,
                        fields: []
                    }
                };
            }

            fixTabs();

            addRowsForTabs();

        };

        vm.getLayout = function () {

            return new Promise(function (resolve) {

                if (vm.instanceId) {

                    transactionTypeService.getByKey(vm.instanceId).then(function (data) {

                        if (data.book_transaction_layout) {
                            vm.ui = data.book_transaction_layout;
                        } else {
                            vm.uiIsDefault = true;
                            vm.ui = uiService.getDefaultEditLayout(vm.entityType)[0];
                        }

                        setDataConstructorLayout();

                        resolve({tabs: vm.tabs, fixedArea: vm.fixedArea});


                    });

                } else {

                    uiService.getEditLayout(vm.entityType).then(function (data) {

                        if (data.results.length) {
                            vm.ui = data.results[0];
                        } else {
                            vm.uiIsDefault = true;
                            vm.ui = uiService.getDefaultEditLayout(vm.entityType)[0];
                        }

                        setDataConstructorLayout();

                        resolve({tabs: vm.tabs, fixedArea: vm.fixedArea});

                    });

                }

            });

        };

        vm.toggleFixedArea = function () {
            vm.fixedArea.isActive = !vm.fixedArea.isActive;

            if (vm.fixedArea.isActive) {
                addRows(vm.fixedArea);

                vm.createFixedAreaFieldsTree();
                vm.updateDrakeContainers();

            } else {

                vm.fixedArea.layout = {
                    rows: 0,
                    columns: 1,
                    fields: []
                };

                vm.updateDrakeContainers();
                vm.syncItems();

            }
        };

        vm.openTabsEditor = function ($event) {

            var tabs = JSON.parse(angular.toJson(vm.tabs));

            $mdDialog.show({
                controller: 'TabsEditorDialogController as vm',
                templateUrl: 'views/dialogs/tabs-editor-dialog-view.html',
                multiple: true,
                targetEvent: $event,
                locals: {
                    tabs: tabs,
                    data: {
                        trackByProp: 'name'
                    }
                }

            }).then(function (res) {

                if (res.status === 'agree') {

                    vm.tabs = [];
                    vm.tabs = res.data.tabs;

                    vm.tabs.forEach(function (tab, index) {
                        tab.tabOrder = index;
                    });

                    vm.createFieldsTree();
                    vm.updateDrakeContainers();

                }

            });
        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.checkColspan = function (tab, row, column) {

            if (tab === 'fixedArea') {

                var fieldRow = vm.fixedAreaFieldsTree[row];

            } else {
                var fieldTab = vm.fieldsTree[tab.tabOrder];
                var fieldRow = fieldTab[row];
            }

            var colspanSizeToHide = 2;

            for (var i = column - 1; i > 0; i--) { // check if previous columns have enough colspan to cover current one

                if (fieldRow[i] && parseInt(fieldRow[i].colspan) >= colspanSizeToHide) {
                    return false;
                }

                colspanSizeToHide = colspanSizeToHide + 1;
            }

            return true;

        };

        vm.range = gridHelperService.range;

        function addRowsForTabs() {
            var i;
            for (i = 0; i < vm.tabs.length; i = i + 1) {
                addRows(vm.tabs[i]);
            }

            if (vm.fixedArea.isActive) {
                addRows(vm.fixedArea);
            }
        }

        function addRows(tab) {

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

                        if (tab.isActive) { // is fixed area
                            vm.createFixedAreaFieldsTree();
                        } else {
                            vm.createFieldsTree();
                        }

                        vm.syncItems();
                        vm.updateDrakeContainers();
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

                if (tab.isActive) { // is fixed area
                    vm.createFixedAreaFieldsTree();
                } else {
                    vm.createFieldsTree();
                }

                vm.updateDrakeContainers();

            }

        };

        vm.insertRow = function (tab, row) {

            var rwoToAddNumber = row + 1;

            var r;
            for (r = 0; r < tab.layout.fields.length; r++) { // increase counts of rows that follows new one by 1

                if (tab.layout.fields[r].row > row) {
                    tab.layout.fields[r].row = tab.layout.fields[r].row + 1;
                }

            }

            tab.layout.rows = tab.layout.rows + 1;

            var field = {};

            var c;
            for (c = 0; c < tab.layout.columns; c = c + 1) {
                field = {
                    row: rwoToAddNumber,
                    column: c + 1,
                    colspan: 1,
                    type: 'empty'
                };
                tab.layout.fields.push(field);
            }

            if (tab.isActive) {
                vm.createFixedAreaFieldsTree();
            } else {
                vm.createFieldsTree();
            }

            vm.updateDrakeContainers();

        };

        vm.isFARowEmtpty = function (rowNumber) {
            var isEmpty = true;

            for (var i = 1; i <= vm.fixedArea.layout.columns; i++) {
                var socket = vm.fixedAreaFieldsTree[rowNumber][i];

                if (socket && socket.type !== 'empty') {
                    isEmpty = false;
                    break;
                }

            }

            return isEmpty;
        };

        vm.isRowEmpty = function (tabOrder, rowNumber, colsTotalNumber) {

            var isEmpty = true;

            if (tabOrder === 'fixedArea') {
                var tabLayout = vm.fixedAreaFieldsTree[rowNumber];
            } else {
                var tabLayout = vm.fieldsTree[tabOrder][rowNumber];
            }

            for (var i = 1; i <= colsTotalNumber; i++) {
                var socket = tabLayout[i];

                if (socket && socket.type !== 'empty') {
                    isEmpty = false;
                    break;
                }

            }

            return isEmpty;

        };

        vm.deleteRow = function (tab, row) {

            tab.layout.fields = tab.layout.fields.filter(function (field) {

                if (field.row > row) {

                    field.row = field.row - 1;

                } else if (field.row === row) {

                    return false;

                }

                return true;

            });

            tab.layout.rows = tab.layout.rows - 1;

            if (tab.isActive) {
                vm.createFixedAreaFieldsTree();
            } else {
                vm.createFieldsTree();
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

                if (vm.fixedArea.isActive) {
                    removeLastRow(vm.fixedArea);
                }

                vm.ui.data = {
                    tabs: [],
                    fixedArea: {}
                };

                if (vm.tabs) {
                    vm.ui.data.tabs = JSON.parse(angular.toJson(vm.tabs));
                }

                vm.ui.data.fixedArea = JSON.parse(JSON.stringify(vm.fixedArea));

                if (vm.uiIsDefault) {
                    if (vm.instanceId) {
                        transactionTypeService.patch(vm.instanceId, {book_transaction_layout: vm.ui}).then(function (data) {
                            console.log('layout saved1');

                            $scope.$apply();

                            $mdDialog.hide({status: 'agree'});
                        });
                    } else {
                        uiService.createEditLayout(vm.entityType, vm.ui).then(function () {
                            console.log('layout saved2');

                            $scope.$apply();

                            $mdDialog.hide({status: 'agree'});
                        });
                    }
                } else {
                    if (vm.instanceId) {
                        transactionTypeService.patch(vm.instanceId, {book_transaction_layout: vm.ui}).then(function (data) {
                            console.log('layout saved3');

                            $scope.$apply();

                            $mdDialog.hide({status: 'agree'});
                        });
                    } else {
                        uiService.updateEditLayout(vm.ui.id, vm.ui).then(function () {
                            console.log('layout saved4');

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

            if (tab === 'fixedArea') {

                for (i = 0; i < vm.fixedAreaFieldsTree[row].length; i++) {
                    var colFromRow = vm.fixedAreaFieldsTree[row][i];
                    totalColspans = totalColspans + parseInt(colFromRow.colspan, 10);
                }

                field = vm.fixedAreaFieldsTree[row][column];

                var flexUnit = 100 / vm.fixedArea.layout.columns;

            } else {

                for (i = 0; i < vm.fieldsTree[tab.tabOrder][row].length; i++) {
                    var colFromRow = vm.fieldsTree[tab.tabOrder][row][i];
                    totalColspans = totalColspans + parseInt(colFromRow.colspan, 10);
                }

                field = vm.fieldsTree[tab.tabOrder][row][column];

                var flexUnit = 100 / tab.layout.columns;

            }


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

            vm.createFieldsTree();
            vm.syncItems();
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
                        tabOrder: vm.tabs.length,
                        layout: {
                            rows: 0,
                            columns: 1,
                            fields: []
                        }
                    });

                    addRows(vm.tabs[vm.tabs.length - 1]);

                    vm.createFieldsTree();
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
                    tabOrder: vm.tabs.length,
                    layout: {
                        rows: 0,
                        columns: 1,
                        fields: []
                    }
                });

                addRows(vm.tabs[0]);

                vm.createFieldsTree();
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
                    entityType = 'complex-transaction';
                }
                entityAddress = {entityType: entityType, from: vm.fromEntityType, instanceId: vm.instanceId};
            }
            $state.go('app.data-constructor', entityAddress);

        };

        var emptyTabSocketsWithoutAttrs = function (tab) {
            console.log("emtpy socket vm.attrs ", vm.attrs);
            console.log("emtpy socket tab ", tab);
            var i, u;
            tab.layout.fields.forEach(function (field, fieldIndex) {

                if (field && field.type === 'field') {

                    var attrFound = false;

                    if (field.attribute_class === 'attr') {

                        for (i = 0; i < vm.attrs.length; i = i + 1) {

                            if (field.key) {

                                if (field.key === vm.attrs[i].user_code) {
                                    attrFound = true;
                                    break;
                                }

                            } else {

                                if (field.attribute.user_code) {

                                    if (field.attribute.user_code === vm.attrs[i].user_code) {
                                        attrFound = true;
                                        break;
                                    }

                                }

                            }

                        }

                        if (!attrFound) {
                            var fieldCol = field.column;
                            var fieldRow = field.row;

                            tab.layout.fields[fieldIndex] = {
                                colspan: 1,
                                column: fieldCol,
                                editMode: false,
                                row: fieldRow,
                                type: 'empty'
                            }
                        }

                    } else if (field.attribute_class === 'userInput') {

                        for (u = 0; u < vm.userInputs.length; u = u + 1) {

                            if (field.name === vm.userInputs[u].name) {
                                attrFound = true;
                                break;
                            }

                        }

                        if (!attrFound) {

                            var fieldCol = field.column;
                            var fieldRow = field.row;

                            tab.layout.fields[fieldIndex] = {
                                colspan: 1,
                                column: fieldCol,
                                editMode: false,
                                row: fieldRow,
                                type: 'empty'
                            }

                        }

                    }

                }

            });

        };

        var emptySocketsWithoutAttrFromLayout = function () {

            vm.tabs.forEach(function (tab) {

                emptyTabSocketsWithoutAttrs(tab);

            });

            if (vm.fixedArea.isActive) {
                emptyTabSocketsWithoutAttrs(vm.fixedArea);
            }

        };

        vm.getItems = function () {

            return new Promise(function (resolve, reject) {

                attributeTypeService.getList(vm.entityType).then(function (data) {

                    vm.attrs = data.results;
                    var entityAttrs = metaService.getEntityAttrs(vm.entityType);
                    var doNotShowAttrs = [];

                    switch (vm.entityType) {

                        case 'complex-transaction':
                        case 'transaction-type':

                            doNotShowAttrs = ['transaction_type', 'code', 'date', 'status', 'text',
                                'user_text_1', 'user_text_2', 'user_text_3', 'user_text_4', 'user_text_5', 'user_text_6',
                                'user_text_7', 'user_text_8', 'user_text_9', 'user_text_10', 'user_text_1', 'user_text_11',
                                'user_text_12', 'user_text_13', 'user_text_14', 'user_text_15', 'user_text_16', 'user_text_17',
                                'user_text_18', 'user_text_19', 'user_text_20', 'user_number_1', 'user_number_2',
                                'user_number_3', 'user_number_4', 'user_number_5', 'user_number_6','user_number_7',
                                'user_number_8', 'user_number_9', 'user_number_10', 'user_number_11', 'user_number_12',
                                'user_number_13', 'user_number_14', 'user_number_15', 'user_number_16', 'user_number_17',
                                'user_number_18', 'user_number_19', 'user_number_20', 'user_date_1', 'user_date_2', 'user_date_3', 'user_date_4', 'user_date_5'];

                            break;

                        case 'instrument':

                            doNotShowAttrs = ['accrued_currency', 'payment_size_detail',
                                'accrued_multiplier', 'default_accrued',
                                'pricing_currency', 'price_multiplier',
                                'default_price', 'daily_pricing_model',
                                'price_download_scheme', 'reference_for_pricing',
                                'maturity_date', 'maturity_price'];

                            break;

                        default:
                            vm.entityAttrs = entityAttrs;

                    }

                    var keysOfFixedFieldsAttrs = metaService.getEntityViewerFixedFieldsAttributes(vm.entityType);
                    doNotShowAttrs = doNotShowAttrs.concat(keysOfFixedFieldsAttrs);

                    if (doNotShowAttrs.length > 0) {
                        vm.entityAttrs = entityAttrs.filter(function (entity) {
                            return doNotShowAttrs.indexOf(entity.key) === -1;
                        });
                    }

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
                                    reference_table: input.reference_table,
                                    verbose_name: input.verbose_name,
                                    content_type: input.content_type,
                                    value_type: input_value_type
                                });

                            });

                            emptySocketsWithoutAttrFromLayout();

                            vm.syncItems();

                            vm.readyStatus.constructor = true;

                            resolve();

                        }).catch(function () {

                            reject('error on getting complex transaction');

                        });

                    } else {

                        emptySocketsWithoutAttrFromLayout();

                        vm.syncItems();

                        vm.readyStatus.constructor = true;

                        resolve();

                    }

                }).catch(function () {
                    reject('error on getting dynamic attributes');
                });

            });

        };

        vm.createFieldsTree = function () {

            var tabs = JSON.parse(JSON.stringify(vm.tabs));

            vm.fieldsTree = {};

            tabs.forEach(function (tab) {

                vm.fieldsTree[tab.tabOrder] = {};
                var f;
                for (f = 0; f < tab.layout.fields.length; f++) {

                    var treeTab = vm.fieldsTree[tab.tabOrder];

                    var field = tab.layout.fields[f];
                    var fRow = field.row;
                    var fCol = field.column;

                    if (!treeTab[fRow]) {
                        treeTab[fRow] = {};
                    }

                    treeTab[fRow][fCol] = field;

                }

            });

        };

        vm.createFixedAreaFieldsTree = function () {

            var fixedAreaFields = JSON.parse(JSON.stringify(vm.fixedArea.layout.fields));
            vm.fixedAreaFieldsTree = {};

            var i;
            for (i = 0; i < fixedAreaFields.length; i++) {

                var field = fixedAreaFields[i];
                var fRow = field.row;
                var fCol = field.column;

                if (!vm.fixedAreaFieldsTree[fRow]) {
                    vm.fixedAreaFieldsTree[fRow] = {};
                }

                vm.fixedAreaFieldsTree[fRow][fCol] = field;

            }

        };

        vm.getDrakeContainers = function () {

            var items = [];

            var emptyFieldsElem = document.querySelectorAll('.ec-attr-empty');
            for (var i = 0; i < emptyFieldsElem.length; i = i + 1) {
                items.push(emptyFieldsElem[i]);
            }

            var cardsElem = document.querySelectorAll('.form-constructor-draggable-card');
            for (var i = 0; i < cardsElem.length; i = i + 1) {
                items.push(cardsElem[i]);
            }

            console.log('emptyFieldsElem', emptyFieldsElem);

            return items;

        };

        var onDropFromSocket = function (elem, targetTab, targetRow, targetColumn, targetColspan) {

            var draggedFromTabOrder = elem.dataset.tabOrder;
            var draggedFromRow = parseInt(elem.dataset.row, 10);
            var draggedFromColumn = parseInt(elem.dataset.col, 10);

            if (draggedFromTabOrder === 'fixedArea') {
                var draggedFromTab = vm.fixedArea;
            } else {
                var draggedFromTab = vm.tabs[draggedFromTabOrder];
            }

            var a;
            for (a = 0; a < targetTab.layout.fields.length; a++) {
                var field = targetTab.layout.fields[a];

                if (field.column === targetColumn && field.row === targetRow) {

                    if (draggedFromTabOrder === 'fixedArea') {
                        var draggedFromTab = vm.fixedArea;
                        var draggedFromFieldData = JSON.parse(JSON.stringify(vm.fixedAreaFieldsTree[draggedFromRow][draggedFromColumn]));
                    } else {
                        var draggedFromTab = vm.tabs[draggedFromTabOrder];
                        var draggedFromFieldData = JSON.parse(JSON.stringify(vm.fieldsTree[draggedFromTabOrder][draggedFromRow][draggedFromColumn]));
                    }

                    targetTab.layout.fields[a] = draggedFromFieldData;
                    targetTab.layout.fields[a].colspan = targetColspan;
                    targetTab.layout.fields[a].column = targetColumn;
                    targetTab.layout.fields[a].row = targetRow;

                    break;
                }
            }

            // make socket we dragged from empty
            var i;
            for (i = 0; i < draggedFromTab.layout.fields.length; i++) {
                var field = draggedFromTab.layout.fields[i];

                if (field.column === draggedFromColumn && field.row === draggedFromRow) {

                    var emptyFieldData = {
                        colspan: 1,
                        column: draggedFromColumn,
                        editMode: false,
                        row: draggedFromRow,
                        type: "empty"
                    };

                    draggedFromTab.layout.fields[i] = emptyFieldData;

                    break;
                }
            }
            // < make socket we dragged from empty >

        };

        var onDropFromAttributesList = function (elem, targetTab, targetRow, targetColumn) {

            var a;
            for (a = 0; a < targetTab.layout.fields.length; a++) {
                var field = targetTab.layout.fields[a];

                if (field.column === targetColumn && field.row === targetRow) { // dragging from attributes list

                    var entityAttrsKeys = [];
                    vm.entityAttrs.forEach(function (entityAttr) {
                        entityAttrsKeys.push(entityAttr.key);
                    });

                    var layoutAttrsKeys = [];
                    vm.layoutAttrs.forEach(function (layoutAttr) {
                        layoutAttrsKeys.push(layoutAttr.key);
                    });

                    var itemIndex = parseInt(elem.dataset.index, 10);

                    field.attribute = vm.items[itemIndex];
                    field.editable = vm.items[itemIndex].editable;
                    field.name = field.attribute.name;
                    field.attribute_class = 'userInput';
                    field.type = 'field';
                    field.colspan = 1;

                    if (field.attribute.hasOwnProperty('id')) {

                        field.attribute_class = 'attr';
                        field.id = field.attribjute.id;

                    } else if (entityAttrsKeys.indexOf(field.attribute.key) !== -1) {

                        field.attribute_class = 'entityAttr';

                    } else if (layoutAttrsKeys.indexOf(field.attribute.key) !== -1) {
                        field.attribute_class = 'decorationAttr';
                    }

                    break;

                }
            }

        };

        vm.dragAndDrop = {

            init: function () {
                this.selectDragulaContainers();
                this.eventListeners();
            },

            selectDragulaContainers: function () {
                var items = vm.getDrakeContainers();

                this.dragula = dragula(items,
                    {
                        moves: function (el) {
                            if (el.classList.contains('ec-attr-empty-btn')) {
                                return false;
                            }

                            return true;
                        },
                        accepts: function (el, target, source, sibling) {
                            if (target.classList.contains('ec-attr-empty')) {
                                return true;
                            }

                            return false;
                        },
                        copy: function (el, source) {
                            return !el.classList.contains('ec-attr-occupied');
                        },
                        revertOnSpill: true
                    });
            },

            eventListeners: function () {

                var drake = this.dragula;

                drake.on('over', function (elem, container, source) {

                    $(container).addClass('active');
                    $(container).on('mouseleave', function () {
                        $(this).removeClass('active');
                    });

                });

                drake.on('drag', function () {
                    document.addEventListener('wheel', scrollHelper.DnDWheelScroll);
                });

                drake.on('out', function (elem, container, source) {
                    $(container).removeClass('active');
                });

                drake.on('drop', function (elem, target) {

                    $(target).removeClass('active');

                    if (target) {

                        var targetTabOrder = target.dataset.tabOrder;
                        var targetRow = parseInt(target.dataset.row, 10);
                        var targetColumn = parseInt(target.dataset.col, 10);
                        var targetColspan = parseInt(target.dataset.colspan, 10);

                        if (targetTabOrder === 'fixedArea') {
                            var targetTab = vm.fixedArea;
                        } else {
                            var targetTab = vm.tabs[targetTabOrder];
                        }

                        if (elem.classList.contains('ec-attr-occupied')) {

                            onDropFromSocket(elem, targetTab, targetRow, targetColumn, targetColspan);

                        } else {

                            onDropFromAttributesList(elem, targetTab, targetRow, targetColumn);

                        }

                        if (targetRow === targetTab.layout.rows) {
                            addRows(targetTab);
                        }

                        vm.createFieldsTree();
                        if (vm.fixedArea.isActive) {
                            vm.createFixedAreaFieldsTree();
                        }

                        vm.syncItems();

                        $scope.$apply();

                    }

                });

                drake.on('dragend', function (el) {

                    document.removeEventListener('wheel', scrollHelper.DnDWheelScroll);
                    $scope.$apply();
                    drake.remove();

                });
            },

            destroy: function () {
                // console.log('this.dragula', this.dragula)
                this.dragula.destroy();
            }
        };

        vm.updateDrakeContainers = function () {

            if (vm.dragAndDrop.dragula) {

                setTimeout(function () {

                    vm.dragAndDrop.dragula.containers = [];
                    vm.dragAndDrop.dragula.containers = vm.getDrakeContainers();

                }, 500);

            }

        };

        vm.syncItems = function () {

            vm.items = [];

            vm.items = vm.items.concat(vm.attrs);
            vm.items = vm.items.concat(vm.entityAttrs);
            vm.items = vm.items.concat(vm.userInputs);
            vm.items = vm.items.concat(vm.layoutAttrs);

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

                if (vm.fixedArea.isActive) {

                    var i;
                    for (i = 0; i < vm.fixedArea.layout.fields.length; i++) {
                        var field = vm.fixedArea.layout.fields[i];

                        if (field.type === 'field' && field.name === item.name) {
                            result = false;
                            break;
                        }

                    }

                }

                if (item.key === 'object_permissions_user' || item.key === 'object_permissions_group') {
                    result = false;
                }

                return result;

            });


            // set all items to Editable = True state by default
            vm.items = vm.items.map(function (item) {

                if (item.editable !== false) {
                    item.editable = true
                }

                return item
            });

            vm.updateDrakeContainers();

        };

        vm.getFieldName = function (item) {

            if (item.key === 'subgroup' && item.value_content_type.indexOf('strategies.strategy') !== -1) {
                return 'Group';
            }

            return item.name;
        };

        vm.getFieldType = function (valueType) {

            var i;
            for (i = 0; i < choices.length; i = i + 1) {
                if (valueType === choices[i].value) {
                    return choices[i]["caption_name"];
                }
            }

        };

        vm.openFormPreview = function ($event) {

            var tabs = JSON.parse(angular.toJson(vm.tabs));

            var previewController = 'EntityViewerFormsPreviewDialogController as vm';
            var previewData = {entityType: vm.entityType};

            if (vm.entityType === 'complex-transaction') {
                previewController = 'ComplexTransactionFormsPreviewDialogController as vm';
                previewData.transactionTypeId = vm.instanceId;
            }

            $mdDialog.show({
                controller: previewController,
                templateUrl: 'views/dialogs/data-constructor-forms-preview-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                multiple: true,
                locals: {
                    inputFormTabs: tabs,
                    data: previewData
                }

            })

        };

        vm.setTabsHolderHeight = function () {
            var elemThatSetsMaxHeight = document.querySelector('.mdDialogContent');
            var tabsHolderElem = document.querySelector('.tabsHolderElem');

            tabsHolderElem.style.height = elemThatSetsMaxHeight.clientHeight + 'px';
        };

        vm.init = function () {

            window.addEventListener('resize', vm.setTabsHolderHeight);

            vm.getLayout().then(function () {

                vm.getItems().then(function () {

                    vm.createFieldsTree();

                    if (vm.fixedArea.isActive) {
                        vm.createFixedAreaFieldsTree();
                    }

                    $scope.$apply(function () {

                        setTimeout(function () {
                            vm.dragAndDrop.init();
                        }, 500)

                    });

                    var scrollElem = document.querySelector('.entity-data-constructor-dialog .scrollElemOnDrag');
                    scrollHelper.setDnDScrollElem(scrollElem);

                });

            });

        };

        vm.init();

        $scope.$on("$destroy", function () {
            window.removeEventListener('resize', vm.setTabsHolderHeight);
            vm.dragAndDrop.destroy();
        });

    }

}());