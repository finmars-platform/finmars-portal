/**
 * Created by szhitenev on 16.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var entityResolverService = require('../../services/entityResolverService');

    module.exports = function ($scope, $mdDialog, evDataService, evEventService) {

        logService.controller('EntityViewerDeleteDialogController', 'initialized');

        var vm = this;

        vm.entityType = evDataService.getEntityType();


        vm.cancel = function () {
            $mdDialog.hide();
        };

        vm.delete = function () {

            var objects = evDataService.getObjects();


            var ids = objects
                .filter(function (item) {
                    return item.___is_activated
                }).map(function (item) {
                    return item.id
                });

            console.log('ids', ids);

            entityResolverService.deleteBulk(vm.entityType, {ids: ids}).then(function (data) {

                $mdDialog.hide({status: 'agree', data: {}});

            });
        };

    }

}());