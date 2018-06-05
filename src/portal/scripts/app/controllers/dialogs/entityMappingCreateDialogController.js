/**
 * Created by szhitenev on 19.03.2018.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');
    var entitySchemeService = require('../../services/import/entitySchemeService');
    var metaContentTypesService = require('../../services/metaContentTypesService');
    var metaService = require('../../services/metaService');
    var attributeTypeService = require('../../services/attributeTypeService');

    module.exports = function ($scope, $mdDialog) {

        logService.controller('EntityMappingCreateDialogController', 'initialized');

        var vm = this;
        vm.scheme = {

            csv_fields: [],
            entity_fields: []

        };

        vm.getAttrs = function () {

            var entity = vm.scheme.content_type.split('.')[1];

            attributeTypeService.getList(entity).then(function (data) {

                vm.dynamicAttributes = data.results;

                $scope.$apply();
            });
        };

        vm.readyStatus = {scheme: true, entitySchemeAttributes: false};

        vm.contentTypes = metaContentTypesService.getListForTransactionTypeInputs();

        vm.scheme.content_type = vm.contentTypes[0].key;
        vm.getAttrs();

        vm.updateEntityFields = function () {

            var parts = vm.scheme.content_type.split('.');
            var entity = parts[1];

            vm.scheme.entity_fields = metaService.getEntityAttrs(entity).filter(function (item) {

                return ['tags', 'transaction_types', 'object_permissions_user', 'object_permissions_group'].indexOf(item.key) === -1

            }).map(function (item) {

                return {
                    expression: '',
                    system_property_key: item.key,
                    name: item.name
                }

            });

            vm.getAttrs();

        };

        vm.updateEntityFields();

        vm.checkReadyStatus = function () {
            return vm.readyStatus.scheme;
        };

        vm.addCsvField = function () {
            vm.scheme.csv_fields.push({
                name: '',
                column: vm.scheme.csv_fields.length
            })
        };

        vm.addDynamicAttribute = function () {
            vm.scheme.entity_fields.push({
                expression: '',
                name: ''
            })
        };

        vm.removeCsvField = function (item, $index) {
            vm.scheme.csv_fields.splice($index, 1);
        };

        vm.removeDynamicAttribute = function (item, $index) {
            vm.scheme.entity_fields.splice($index, 1);
        };

        vm.hasMapping = function (item) {

            // if (item.hasOwnProperty('system_property_key')) {
            //     return ['accounts', 'responsibles', 'counterparties', 'transaction_types', 'portfolios'].indexOf(item.system_property_key) !== -1
            // }

            if (item.hasOwnProperty('value_type')) {
                return item.value_type == 30;
            }

        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function ($event) {

            vm.scheme.entity_fields.forEach(function (item) {

                vm.dynamicAttributes.forEach(function (attr) {

                    if (item.dynamic_attribute_id === attr.id) {
                        item.name = attr.name
                    }

                })

            });

            entitySchemeService.create(vm.scheme).then(function (data) {
                console.log('DATA', data);
                if (data.status == 200 || data.status == 201) {
                    $mdDialog.hide({res: 'agree'});
                }
                if (data.status == 400) {
                    $mdDialog.show({
                        controller: 'ValidationDialogController as vm',
                        templateUrl: 'views/dialogs/validation-dialog-view.html',
                        targetEvent: $event,
                        locals: {
                            validationData: data.response
                        },
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true
                    })
                }
            });
        };

        vm.openMapping = function ($event, item) {

            var entity = '';

            if (item.system_property_key === 'accounts') {
                entity = 'account'
            }

            if (item.system_property_key === 'responsibles') {
                entity = 'responsible'
            }

            if (item.system_property_key === 'counterparties') {
                entity = 'counterparty'
            }

            $mdDialog.show({
                controller: 'EntityTypeMappingDialogController as vm',
                templateUrl: 'views/dialogs/entity-type-mapping-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                multiple: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    mapItem: {complexExpressionEntity: entity}
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log("res", res.data);
                }
            });
        };

        vm.openExpressionDialog = function ($event, item) {
            $mdDialog.show({
                controller: 'ExpressionEditorDialogController as vm',
                templateUrl: 'views/dialogs/expression-editor-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                multiple: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    item: {
                        expression: item.expression
                    }
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log("res", res.data);
                    if (res.data) {
                        item.expression = res.data.item.expression;
                    }
                    $scope.$apply();
                }
            });
        };

    };

}());