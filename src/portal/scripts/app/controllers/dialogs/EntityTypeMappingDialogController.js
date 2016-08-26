/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');
    var entityTypeMappingResolveService = require('../../services/entityTypeMappingResolveService');
    var entityResolverService = require('../../services/entityResolverService');

    module.exports = function ($scope, $mdDialog, mapEntityType) {

        logService.controller('EntityTypeMappingDialogController', 'initialized');

        var vm = this;

        vm.readyStatus = {content: false};

        console.log('mapEntityType', mapEntityType);

        vm.fancyEntity = function () {
            return mapEntityType.replace('_', ' ');
        };

        entityResolverService.getList(mapEntityType).then(function (data) {
            vm.entityItems = data.results;
            entityTypeMappingResolveService.getList(mapEntityType).then(function (data) {
                vm.items = data.results;

                var i, e;
                for (e = 0; e < vm.entityItems.length; e = e + 1) {
                    for (i = 0; i < vm.items.length; i = i + 1) {
                        if (vm.items[i][mapEntityType] == vm.entityItems[e].id) {
                            vm.entityItems[e].mapping = vm.items[i]
                        }
                    }
                }

                vm.readyStatus.content = true;
                $scope.$apply();
            });
        });


        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };
    }

}());