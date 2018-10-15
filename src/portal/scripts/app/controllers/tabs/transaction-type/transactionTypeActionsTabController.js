/**
 * Created by szhitenev on 27.09.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');

    var fieldResolverService = require('../../../services/fieldResolverService');
    var metaContentTypesService = require('../../../services/metaContentTypesService');

    module.exports = function ($scope, $mdDialog) {
        logService.controller('TransactionTypeActionsTabController', 'initialized');

        var vm = this;
        vm.entity = $scope.$parent.vm.entity;

        vm.contentTypes = metaContentTypesService.getListForTransactionTypeInputs();

        vm.toggleItem = function (pane, item) {
            pane.toggle();
            if (item.isPaneExpanded == true) {
                item.isPaneExpanded = false;
            } else {
                item.isPaneExpanded = true;
            }
        };

        vm.preventSpace = function ($event) {
            //$event.preventDefault();
            $event.stopPropagation();
            //return false;
        };

        vm.entity.actions.forEach(function (action) {
            var keys;
            if (action.instrument !== null) {
                keys = Object.keys(action.instrument);

                keys.forEach(function (key) {
                    if (action.instrument.hasOwnProperty(key + '_input')) {
                        if (action.instrument[key] !== null) {
                            action.instrument[key + '_toggle'] = true;
                        }
                    }
                })
            } else {
                keys = Object.keys(action.transaction);
                keys.forEach(function (key) {
                    if (action.transaction.hasOwnProperty(key + '_input')) {
                        if (action.transaction[key] !== null) {
                            action.transaction[key + '_toggle'] = true;
                        }
                    }
                })
            }
        });

        vm.resetProperty = function (item, propertyName, fieldName) {

            item[propertyName][fieldName] = null;
            item[propertyName][fieldName + '_input'] = null;

        };

        vm.resetPropertyBtn = function (item, propertyName, fieldName) {

            item[propertyName][fieldName] = null;
            item[propertyName][fieldName + '_input'] = null;

            item[propertyName][fieldName + '_toggle'] = !item[propertyName][fieldName + '_toggle'];

        };

        vm.findInputs = function (entity) {

            var content_type = '';
            var result = [];

            vm.contentTypes.forEach(function (contentTypeItem) {
                if (contentTypeItem.entity === entity) {
                    content_type = contentTypeItem.key
                }
            });

            vm.entity.inputs.forEach(function (input) {
                if (input.content_type === content_type) {
                    result.push(input);
                }
            });

            return result;

        };

        vm.deletePane = function (item, $index, $event) {

            var description = 'Are you sure to delete this action?';

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                multiple: true,
                skipHide: true,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: description
                    }
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    vm.entity.actions.splice($index, 1);
                }
                $scope.$apply();
            });
        };

        vm.addAction = function (actionType) {
            $scope.accordion.collapseAll();
            if (actionType == 'instrument') {
                vm.entity.actions.push({
                    isPaneExpanded: true,
                    instrument: {}
                })
            } else {
                vm.entity.actions.push({
                    isPaneExpanded: true,
                    transaction: {}
                })
            }
            vm.findPhantoms();
        };

        vm.relationItems = {};

        vm.moveDown = function (item, $index) {
            var swap = JSON.parse(JSON.stringify(item));
            vm.entity.actions[$index] = vm.entity.actions[$index + 1];
            vm.entity.actions[$index + 1] = swap;
            vm.findPhantoms();
        };

        vm.moveUp = function (item, $index) {
            var swap = JSON.parse(JSON.stringify(item));
            vm.entity.actions[$index] = vm.entity.actions[$index - 1];
            vm.entity.actions[$index - 1] = swap;
            vm.findPhantoms();

        };

        vm.resolveInstrumentProp = function (item, prop) {

            if (prop == 'instrument') {
                if (item.transaction.instrument_input !== null) {
                    return 'instrument_input'
                }
                return 'instrument_phantom'
            }

            if (prop == 'linked_instrument') {
                if (item.transaction.linked_instrument_input !== null) {
                    return 'linked_instrument_input'
                }
                return 'linked_instrument_phantom'
            }
            if (prop == 'allocation_pl') {
                if (item.transaction.allocation_pl_input !== null) {
                    return 'allocation_pl_input'
                }
                return 'allocation_pl_phantom'
            }

            if (prop == 'allocation_balance') {
                if (item.transaction.allocation_balance_input !== null) {
                    return 'allocation_balance_input'
                }
                return 'allocation_balance_phantom'
            }

        };

        vm.setTransactionInstrumentInput = function (item, name, prop) {

            if (prop == 'instrument') {
                item.transaction.instrument_input = name;
                item.transaction.instrument_phantom = null;
                item.transaction.instrument = null;
            }

            if (prop == 'linked_instrument') {
                item.transaction.linked_instrument_input = name;
                item.transaction.linked_instrument_phantom = null;
                item.transaction.linked_instrument = null;
            }

            if (prop == 'allocation_pl') {
                item.transaction.allocation_pl_input = name;
                item.transaction.allocation_pl_phantom = null;
                item.transaction.allocation_pl = null;
            }

            if (prop == 'allocation_balance') {
                item.transaction.allocation_balance_input = name;
                item.transaction.allocation_balance_phantom = null;
                item.transaction.allocation_balance = null;
            }
        };

        vm.setTransactionInstrumentPhantom = function (item, positionOrder, prop) {

            if (prop == 'instrument') {
                item.transaction.instrument_input = null;
                item.transaction.instrument_phantom = positionOrder;
                item.transaction.instrument = null;
            }

            if (prop == 'linked_instrument') {
                item.transaction.linked_instrument_input = null;
                item.transaction.linked_instrument_phantom = positionOrder;
                item.transaction.linked_instrument = null;
            }

            if (prop == 'allocation_pl') {
                item.transaction.allocation_pl_input = null;
                item.transaction.allocation_pl_phantom = positionOrder;
                item.transaction.allocation_pl = null;
            }

            if (prop == 'allocation_balance') {
                item.transaction.allocation_balance_input = null;
                item.transaction.allocation_balance_phantom = positionOrder;
                item.transaction.allocation_balance = null;
            }

        };

        vm.findPhantoms = function () {
            var result = [];
            vm.entity.actions.forEach(function (action, $index) {
                action.positionOrder = $index;
                if (action.instrument !== null) {
                    result.push(action);
                }
            });
            return result;
        };

        vm.loadRelation = function (field) {

            //console.log('entity', entity);

            return new Promise(function (resolve, reject) {
                if (!vm.relationItems[field]) {
                    fieldResolverService.getFields(field).then(function (data) {
                        vm.relationItems[field] = data.data;
                        resolve(vm.relationItems[field]);
                    })
                } else {
                    resolve(vm.relationItems[field]);
                }
            })
        };
    }

}());