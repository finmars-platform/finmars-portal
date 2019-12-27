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

        vm.isDeleted = false;


        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.delete = function ($event) {

            var objects = evDataService.getObjects();


            var ids = objects
                .filter(function (item) {
                    return item.___is_activated
                }).map(function (item) {
                    return item.id
                });

            console.log('ids', ids);

            vm.processing = true;
            vm.isDeleted = true;

            entityResolverService.deleteBulk(vm.entityType, {ids: ids}).then(function (data) {

                vm.processing = false;

                $mdDialog.hide({status: 'agree', data: {ids: ids}});

            }).catch(function (reason) {

                $mdDialog.show({
                    controller: 'InfoDialogController as vm',
                    templateUrl: 'views/info-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true,
                    multiple: true,
                    locals: {
                        info: {
                            title: 'Warning',
                            description: "Something wrong. Please, try again later."
                        }
                    }
                }).then(function (value) {

                    $mdDialog.hide({status: 'agree', data: {ids: []}});

                })

            });


            setTimeout(function () {

                vm.processing = false;

                $mdDialog.show({
                    controller: 'InfoDialogController as vm',
                    templateUrl: 'views/info-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true,
                    multiple: true,
                    locals: {
                        info: {
                            title: 'Warning',
                            description: "Deletion in progress. Please, wait"
                        }
                    }
                });

                $scope.$apply()

            }, 60 * 1000)

        };

    }

}());