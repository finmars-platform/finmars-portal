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
                            vm.ui = uiService.getDefaultEditLayout(vm.entityType)[0];
                        }

                        vm.tabs = vm.ui.data || [];
                        vm.tabs.forEach(function (tab, index) {
                            tab.tabOrder = index;

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
                            vm.ui = uiService.getDefaultEditLayout(vm.entityType)[0];
                        }

                        vm.tabs = vm.ui.data || [];
                        vm.tabs.forEach(function (tab, index) {
                            tab.tabOrder = index;

                            tab.layout.fields.forEach(function (field) {
                                field.editMode = false;
                            })
                        });

                        addRowForTab();

                        resolve(vm.tabs);

                    });

                }

            });

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.checkColspan = function (tab, row, column) {

            var fieldsTree = vm.fieldsTree[tab.tabOrder];
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
                addRows(vm.tabs[i]);
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

            vm.createFieldsTree();

            vm.updateDrakeContainers();

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

            vm.createFieldsTree();
            vm.updateDrakeContainers();

        };

        vm.isRowEmpty = function (tabOrder, rowNumber, columnsNumber) {

            var isEmpty = true;
            for (var i = 1; i <= columnsNumber; i++) {
                var socket = vm.fieldsTree[tabOrder][rowNumber][i];

                if (socket && socket.type !== 'empty') {
                    isEmpty = false;
                    break;
                } /*else if (!socket) {
                    isEmpty = false;
                    break;
                }*/

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

            vm.createFieldsTree();
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

                if (vm.tabs) {
                    vm.ui.data = JSON.parse(angular.toJson(vm.tabs));
                } else {
                    vm.ui.data = vm.tabs;
                }


                if (vm.uiIsDefault) {
                    if (vm.instanceId) {
                        uiService.updateEditLayoutByInstanceId(vm.entityType, vm.instanceId, vm.ui).then(function (data) {
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
                        uiService.updateEditLayoutByInstanceId(vm.entityType, vm.instanceId, vm.ui).then(function (data) {
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

            /*for (i = 0; i < tab.layout.fields.length; i = i + 1) {
                if (tab.layout.fields[i].row === row) {
                    if (tab.layout.fields[i].column === column) {
                        field = tab.layout.fields[i];
                    }

                    totalColspans = totalColspans + parseInt(tab.layout.fields[i].colspan, 10);
                }
            }*/
            for (i = 0; i < vm.fieldsTree[tab.tabOrder][row].length; i++) {
                var colFromRow = vm.fieldsTree[tab.tabOrder][row][i];
                totalColspans = totalColspans + parseInt(colFromRow.colspan, 10);
            }

            field = vm.fieldsTree[tab.tabOrder][row][column];

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

            vm.createFieldsTree();
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

        vm.getItems = function () {

            attributeTypeService.getList(vm.entityType).then(function (data) {

                vm.attrs = data.results;
                var entityAttrs = metaService.getEntityAttrs(vm.entityType);

                /*if (vm.entityType === 'transaction-type') {

                    var doNotShowAttrs = ['code', 'date', 'status', 'text'];
                    vm.entityAttrs = entityAttrs.filter(function (entity) {
                        return doNotShowAttrs.indexOf(entity.key) === -1;
                    });

                } else {
                    vm.entityAttrs = entityAttrs;
                }*/

                switch (vm.entityType) {

                    case 'complex-transaction':
                    case 'transaction-type':

                        var doNotShowAttrs = ['transaction_type', 'code', 'date', 'status', 'text',
                            'user_text_1', 'user_text_2', 'user_text_3', 'user_text_4', 'user_text_5', 'user_text_6',
                            'user_text_7', 'user_text_8', 'user_text_9', 'user_text_10', 'user_text_1', 'user_text_11',
                            'user_text_12', 'user_text_13', 'user_text_14', 'user_text_15', 'user_text_16', 'user_text_17',
                            'user_text_18', 'user_text_19', 'user_text_20', 'user_number_1', 'user_number_2',
                            'user_number_3', 'user_number_4', 'user_number_5', 'user_number_6','user_number_7',
                            'user_number_8', 'user_number_9', 'user_number_10', 'user_number_11', 'user_number_12',
                            'user_number_13', 'user_number_14', 'user_number_15', 'user_number_16', 'user_number_17',
                            'user_number_18', 'user_number_19', 'user_number_20', 'user_date_1', 'user_date_2', 'user_date_3', 'user_date_4', 'user_date_5'];

                        vm.entityAttrs = entityAttrs.filter(function (entity) {
                            return doNotShowAttrs.indexOf(entity.key) === -1;
                        });

                        break;

                    case 'instrument':

                        var doNotShowAttrs = ['accrued_currency', 'payment_size_detail',
                            'accrued_multiplier', 'default_accrued',
                            'pricing_currency', 'price_multiplier',
                            'default_price', 'daily_pricing_model',
                            'price_download_scheme', 'reference_for_pricing'];

                        vm.entityAttrs = entityAttrs.filter(function (entity) {
                            return doNotShowAttrs.indexOf(entity.key) === -1;
                        });

                        break;

                    default:
                        vm.entityAttrs = entityAttrs;

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

        vm.dragAndDrop = {

            init: function () {
                this.selectDragulaContainers();
                this.eventListeners();
            },

            selectDragulaContainers: function () {
                var items = vm.getDrakeContainers();

                this.dragula = dragula(items,
                    {
                        moves: function (el, target, source, sibling) {
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

                drake.on('out', function (elem, container, source) {
                    $(container).removeClass('active');
                });

                drake.on('drop', function (elem, target) {

                    $(target).removeClass('active');

                    if (target) {

                        if (target.classList.contains('ec-attr-empty')) {

                            var targetTabName = target.dataset.tabName;
                            var targetColspan = parseInt(target.dataset.colspan, 10);
                            var targetColumn = parseInt(target.dataset.col, 10);
                            var targetRow = parseInt(target.dataset.row, 10);

                            var i, a;
                            for (i = 0; i < vm.tabs.length; i++) {
                                var tab = vm.tabs[i];

                                // if (!tab.hasOwnProperty('editState') || (tab.hasOwnProperty('editState') && tab.editState)) {
                                if (tab.name === targetTabName) {

                                    for (a = 0; a < tab.layout.fields.length; a++) {
                                        var field = tab.layout.fields[a];

                                        if (elem.classList.contains('ec-attr-occupied')) { // dragging from socket

                                            var dElemTabOrder = elem.dataset.tabOrder;
                                            var dElemColumn = parseInt(elem.dataset.col, 10);
                                            var dElemRow = parseInt(elem.dataset.row, 10);

                                            var occupiedFieldData = JSON.parse(JSON.stringify(vm.fieldsTree[dElemTabOrder][dElemRow][dElemColumn]));

                                            if (field.column === targetColumn && field.row === targetRow) {
                                                vm.tabs[i].layout.fields[a] = occupiedFieldData;
                                                vm.tabs[i].layout.fields[a].colspan = targetColspan;
                                                vm.tabs[i].layout.fields[a].column = targetColumn;
                                                vm.tabs[i].layout.fields[a].row = targetRow;
                                            }

                                            if (field.column === dElemColumn && field.row === dElemRow) { // make dragged from socket empty

                                                var emptyFieldData = {
                                                    colspan: 1,
                                                    column: dElemColumn,
                                                    editMode: false,
                                                    row: dElemRow,
                                                    type: "empty"
                                                };

                                                vm.tabs[i].layout.fields[a] = emptyFieldData;
                                            }

                                        } else { // dragging from attributes list

                                            if (field.column === targetColumn && field.row === targetRow) {

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
                                                    field.id = field.attribute.id;
                                                }
                                                if (entityAttrsKeys.indexOf(field.attribute.key) !== -1) {
                                                    field.attribute_class = 'entityAttr';
                                                }
                                                if (layoutAttrsKeys.indexOf(field.attribute.key) !== -1) {
                                                    field.attribute_class = 'decorationAttr';
                                                }

                                                break;

                                            }

                                        }

                                    }

                                    if (targetRow === tab.layout.rows) {
                                        addRows(tab);
                                    }

                                    break;
                                }
                            }

                            vm.createFieldsTree();
                            vm.syncItems();

                            $scope.$apply();

                        }

                    }

                });

                drake.on('dragend', function (el) {
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

                if (item.key === 'object_permissions_user') {
                    result = false;
                }

                if (item.key === 'object_permissions_group') {
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

            console.log('vm.items', vm.items);
            console.log('vm.entityType', vm.entityType);

            vm.updateDrakeContainers();

            console.log('syncItems.items', vm.items);

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

        vm.init = function () {

            vm.getLayout().then(function () {

                vm.getItems();
                vm.createFieldsTree();

            });

        };

        vm.init();

        $scope.$on("$destroy", function () {
            vm.dragAndDrop.destroy();
        });
    }

}());