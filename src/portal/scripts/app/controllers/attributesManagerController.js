/**
 * Created by szhitenev on 14.06.2016.
 */
(function () {

    'use strict';
    var logService = require('../services/logService');

    var attributeTypeService = require('../services/attributeTypeService');

    var metaService = require('../services/metaService');

    module.exports = function ($scope, $state, $stateParams, $mdDialog) {

        logService.controller('AttributesManagerController', 'initialized');

        var vm = this;

        var choices = metaService.getValueTypes();
        vm.attrs = [];

        vm.entityType = $stateParams.entityType;

        var getList = function(){
            attributeTypeService.getList(vm.entityType).then(function (data) {
                vm.attrs = data.results;
                $scope.$apply();
            });
        };

        getList();

        vm.addAttribute = function (ev) {
            $mdDialog.show({
                controller: 'AttributesManagerAddDialogController as vm',
                templateUrl: 'views/attribute-manager-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: ev
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log("res", res.data);
                    attributeTypeService.create(vm.entityType, res.data.attribute).then(getList);
                }
            });
        };

        vm.bindType = function (item) {
            var i;
            for (i = 0; i < choices.length; i = i + 1) {
                if (item["value_type"] === choices[i].value) {
                    return choices[i]["display_name"];
                }
            }
        };

        vm.editAttr = function (item, ev) {
            $mdDialog.show({
                controller: 'AttributesManagerEditDialogController as vm',
                templateUrl: 'views/attribute-manager-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    attribute: item
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log("res", res.data);
                    attributeTypeService.update(vm.entityType, res.data.attribute.id, res.data.attribute).then(getList);
                }
            });
        };

        vm.deleteAttr = function (item, ev) {

            var description = 'Are you sure to delete attribute ' + item.name + ' ?';

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: description
                    }
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    attributeTypeService.deleteByKey(vm.entityType, item.id);
                    getList();
                }
            });
        };

    }

}());