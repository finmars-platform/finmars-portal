/**
 * Created by szhitenev on 27.09.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');
    var metaContentTypesService = require('../../../services/metaContentTypesService');
    var entityResolverService = require('../../../services/entityResolverService');

    module.exports = function ($scope) {
        logService.controller('TransactionTypeInputsTabController', 'initialized');

        var vm = this;
        vm.entity = $scope.$parent.vm.entity;

        vm.relationItems = {};

        vm.newItem = {
            content_type: null,
            account: null,
            instrument_type: null,
            instrument: null,
            currency: null,
            counterparty: null,
            responsible: null,
            portfolio: null,
            strategy1: null,
            strategy2: null,
            strategy3: null,
            daily_pricing_model: null,
            payment_size_detail: null,
            price_download_scheme: null
        };

        vm.valueTypes = [
            {
                "display_name": "Number",
                "value": 20
            },
            {
                "display_name": "String",
                "value": 10
            },
            {
                "display_name": "Date",
                "value": 40
            },
            {
                "display_name": "Relation",
                "value": 100
            }
        ];

        vm.contentTypes = metaContentTypesService.getListForTransactionTypeInputs();

        vm.bindValueType = function (row) {
            var name;
            vm.valueTypes.forEach(function (item) {
                if (row.value_type == item.value) {
                    row.value_type_name = item.display_name;
                    name = item.display_name
                }
            });
            return name;
        };

        vm.bindContentType = function (row) {
            var name;
            vm.contentTypes.forEach(function (item) {
                if (row.content_type == item.key) {
                    row.content_type_name = item.name;
                    name = item.name
                }
            });
            return name;
        };

        vm.resolveRelation = function (item) {
            var relation;

            //console.log('item', item);
            vm.contentTypes.forEach(function (contentType) {
                if (contentType.key == item.content_type) {
                    relation = contentType.entity;
                }
            });

            //console.log('relation', relation);

            return relation
        };

        vm.resolveDefaultValue = function (item) {

            var itemEntity = '';

            vm.contentTypes.forEach(function (contentType) {
                if (item.content_type == contentType.key) {
                    itemEntity = contentType.entity;
                }
            });

            if (item[itemEntity + '_object']) {
                return item[itemEntity + '_object'].name;
            } else {

                var entityName = '';

                if (vm.relationItems[itemEntity]) {
                    vm.relationItems[itemEntity].forEach(function (relationItem) {
                        if (relationItem.id == item[itemEntity]) {
                            entityName = relationItem.name;
                        }
                    });
                }

                return entityName;
            }

        };

        vm.loadRelation = function (entity) {

            //console.log('entity', entity);

            return new Promise(function (resolve, reject) {
                if (!vm.relationItems[entity]) {
                    entityResolverService.getList(entity).then(function (data) {
                        vm.relationItems[entity] = data.results;
                        resolve(vm.relationItems[entity]);
                    })
                } else {
                    resolve(vm.relationItems[entity]);
                }
            })
        };

        vm.toggleQuery = function () {
            vm.queryStatus = !vm.queryStatus;
            vm.query = {};
        };

        vm.setSort = function (propertyName) {
            vm.direction = (vm.sort === propertyName) ? !vm.direction : false;
            vm.sort = propertyName;
        };

        vm.editItem = function (item) {
            item.editStatus = true;
        };

        vm.saveItem = function (item) {
            item.editStatus = false;
        };

        vm.deleteItem = function (item, index) {
            vm.entity.inputs.splice(index, 1);
        };

        vm.addRow = function () {
            vm.entity.inputs.push({
                name: vm.newItem.name,
                verbose_name: vm.newItem.verbose_name,
                value_type: vm.newItem.value_type,
                content_type: vm.newItem.content_type,
                is_fill_from_context: vm.newItem.is_fill_from_context,
                account: vm.newItem.account,
                instrument_type: vm.newItem.instrument_type,
                instrument: vm.newItem.instrument,
                currency: vm.newItem.currency,
                counterparty: vm.newItem.counterparty,
                responsible: vm.newItem.responsible,
                portfolio: vm.newItem.portfolio,
                strategy1: vm.newItem.strategy1,
                strategy2: vm.newItem.strategy2,
                strategy3: vm.newItem.strategy3,
                daily_pricing_model: vm.newItem.daily_pricing_model,
                payment_size_detail: vm.newItem.payment_size_detail,
                price_download_scheme: vm.newItem.price_download_scheme
            });

            vm.newItem.name = null;
            vm.newItem.verbose_name = null;
            vm.newItem.value_type = null;
            vm.newItem.content_type = null;
            vm.newItem.is_fill_from_context = null;
            vm.newItem.account = null;
            vm.newItem.instrument_type = null;
            vm.newItem.instrument = null;
            vm.newItem.currency = null;
            vm.newItem.counterparty = null;
            vm.newItem.responsible = null;
            vm.newItem.portfolio = null;
            vm.newItem.strategy1 = null;
            vm.newItem.strategy2 = null;
            vm.newItem.strategy3 = null;
            vm.newItem.daily_pricing_model = null;
            vm.newItem.payment_size_detail = null;
            vm.newItem.price_download_scheme = null;
        }
    }

}());