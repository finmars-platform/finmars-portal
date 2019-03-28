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

        vm.relationItems = {};

        vm.contentTypes = metaContentTypesService.getListForTransactionTypeInputs();

        vm.toggleItem = function (pane, item) {
            pane.toggle();

            item.isPaneExpanded = !item.isPaneExpanded;

        };

        vm.preventSpace = function ($event) {

            $event.stopPropagation();

        };

        vm.rebookInstrumentReactions = [
            {
                name: "Proceed (Overwrite if exists)",
                id: 2
            },
            {
                name: "Skip",
                id: 1
            },
            {
                name: "Proceed (Skip if exists)",
                id: 4
            }
        ];

        vm.rebookOtherReactions = [
            {
                name: "Append",
                id: 0
            },
            {
                name: "Skip",
                id: 1
            },
            {
                name: "Clear & Append",
                id: 3
            }
        ];

        vm.instrumentTypeTransactionTypes = [
            {
                name: 'One Off Event',
                value: 'one_off_event'
            },
            {
                name: 'Regular Event',
                value: 'regular_event'
            },
            {
                name: 'Factor up',
                value: 'factor_up'
            },
            {
                name: 'Factor same',
                value: 'factor_same'
            },
            {
                name: 'Factor down',
                value: 'factor_down'
            }
        ];

        vm.actionsKeysList = [
            'instrument',
            'transaction',
            'instrument_factor_schedule',
            'instrument_manual_pricing_formula',
            'instrument_accrual_calculation_schedules',
            'instrument_event_schedule',
            'instrument_event_schedule_action'
        ];

        vm.checkActionsIsNotNull = function () {
            return false;
        };

        vm.entity.actions.forEach(function (action) {

            var keys;

            vm.actionsKeysList.forEach(function (actionKey) {

                if (action[actionKey] !== null) {
                    keys = Object.keys(action[actionKey]);

                    keys.forEach(function (key) {
                        if (action[actionKey].hasOwnProperty(key + '_input')) {
                            if (action[actionKey][key] !== null) {
                                action[actionKey][key + '_toggle'] = true;
                            }
                        }
                    })
                }

            })

        });

        vm.resetProperty = function (item, propertyName, fieldName) {

            item[propertyName][fieldName] = null;
            item[propertyName][fieldName + '_input'] = null;

        };

        vm.resetPropertyBtn = function (item, propertyName, fieldName) {

            item[propertyName][fieldName] = null;
            item[propertyName][fieldName + '_input'] = null;

            if (item[propertyName].hasOwnProperty(fieldName + '_phantom')) {
                item[propertyName][fieldName + '_phantom'] = null;
            }

            item[propertyName][fieldName + '_toggle'] = !item[propertyName][fieldName + '_toggle'];

            if (item[propertyName][fieldName + '_toggle'] && !item[propertyName][fieldName]) {

                var relationType = '';
                switch (fieldName) {
                    case 'linked_instrument':
                    case 'allocation_pl':
                    case 'allocation_balance':
                        relationType = 'instrument';
                        break;
                    default:
                        relationType = fieldName;
                }

                vm.loadRelation(relationType).then(function (data) {

                    var defaultPropertyName = 'name';
                    if (fieldName === 'price_download_scheme') {
                        defaultPropertyName = 'scheme_name';
                    }

                    vm.relationItems[relationType].forEach(function (relation) {

                        if (relation[defaultPropertyName] === "-" || relation[defaultPropertyName] === 'Default') {
                            item[propertyName][fieldName] = relation.id;
                        }

                    });

                    $scope.$apply(function () {
                        setTimeout(function () {
                            $('body').find('.md-select-search-pattern').on('keydown', function (ev) {
                                ev.stopPropagation();
                            });
                        }, 100);
                    });

                });

            }

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

            var result = {
                isPaneExpanded: true
            };

            result[actionType] = {};

            vm.entity.actions.push(result);

            vm.findPhantoms();
        };

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

        vm.resolveInstrumentProp = function (item, key, prop) {

            if (prop === 'instrument') {
                if (item[key].instrument_input !== null) {
                    return 'instrument_input'
                }
                return 'instrument_phantom'
            }

            if (prop === 'linked_instrument') {
                if (item[key].linked_instrument_input !== null) {
                    return 'linked_instrument_input'
                }
                return 'linked_instrument_phantom'
            }
            if (prop === 'allocation_pl') {
                if (item[key].allocation_pl_input !== null) {
                    return 'allocation_pl_input'
                }
                return 'allocation_pl_phantom'
            }

            if (prop === 'allocation_balance') {
                if (item[key].allocation_balance_input !== null) {
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

        vm.setItemInstrumentInput = function (item, key, name, prop) {

            if (prop === 'instrument') {
                item[key].instrument_input = name;
                item[key].instrument_phantom = null;
                item[key].instrument = null;
            }
        };

        vm.setItemInstrumentPhantom = function (item, key, positionOrder, prop) {

            if (prop === 'instrument') {
                item[key].instrument_input = null;
                item[key].instrument_phantom = positionOrder;
                item[key].instrument = null;
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

        vm.findEventSchedulePhantoms = function () {
            var result = [];
            vm.entity.actions.forEach(function (action, $index) {
                action.positionOrder = $index;
                if (action.instrument_event_schedule !== null) {
                    result.push(action);
                }
            });
            return result;
        };

        vm.loadRelation = function (field) {

            console.log('field', field);

            return new Promise(function (resolve, reject) {
                if (!vm.relationItems[field]) {
                    fieldResolverService.getFields(field).then(function (data) {
                        vm.relationItems[field] = data.data;

                        $scope.$apply(function () {
                            setTimeout(function () {
                                $('body').find('.md-select-search-pattern').on('keydown', function (ev) {
                                    ev.stopPropagation();
                                });
                            }, 100);
                        });

                        resolve(vm.relationItems[field]);
                    })
                } else {

                    resolve(vm.relationItems[field]);
                }

            })
        };
    }

}());