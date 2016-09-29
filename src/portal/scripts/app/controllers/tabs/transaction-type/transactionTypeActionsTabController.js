/**
 * Created by szhitenev on 27.09.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');

    var fieldResolverService = require('../../../services/fieldResolverService');
    var metaContentTypesService = require('../../../services/metaContentTypesService');

    module.exports = function ($scope) {
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

        vm.resetProperty = function (item, propertyName, fieldName) {

            item[propertyName][fieldName] = null;
            item[propertyName][fieldName + '_input'] = null;

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

        vm.addAction = function (actionType) {
            if (actionType == 'instrument') {
                vm.entity.actions.push({
                    isExpanded: true,
                    instrument: {}
                })
            } else {
                vm.entity.actions.push({
                    isExpanded: true,
                    transaction: {}
                })
            }
        };

        vm.relationItems = {};

        vm.moveDown = function (item, $index) {
            var swap = JSON.parse(JSON.stringify(item));
            vm.entity.actions[$index] = vm.entity.actions[$index + 1];
            vm.entity.actions[$index + 1] = swap;
        };

        vm.moveUp = function (item, $index) {
            var swap = JSON.parse(JSON.stringify(item));
            vm.entity.actions[$index] = vm.entity.actions[$index - 1];
            vm.entity.actions[$index - 1] = swap;

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