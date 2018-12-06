/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';
    var logService = require('../../../../../core/services/logService');

    var entityResolverService = require('../../services/entityResolverService');

    var layoutService = require('../../services/layoutService');

    var metaPermissionsService = require('../../services/metaPermissionsService');

    module.exports = function ($scope, $mdDialog, entityId, $state) {

        var vm = this;

        //vm.readyStatus = {content: false, permissions: false, entity: false, me: false};
        vm.entityType = "transaction";
        console.log('entity edit dialog', parentScope);
        vm.evAction = 'update';
        vm.entityId = entityId;
        vm.saveCallback = ''; // save callback handler in inner controller;
        vm.copyCallback = ''; // copy callback handler in inner controller;

        vm.cancel = function () {
            //localStorage.setItem('entityIsChanged', false);
            $mdDialog.cancel();
        };

        vm.checkVisibility = function () {
            return true;
        };

        vm.save = function ($event) {
            if (vm.evAction == 'create') {
                vm.saveCallback().then(function (options) {

                    entityResolverService.create(options.entityType, options.entity).then(function (data) {
                        $mdDialog.hide({res: 'agree'});
                    }).catch(function (reason) {

                        $mdDialog.show({
                            controller: 'ValidationDialogController as vm',
                            templateUrl: 'views/dialogs/validation-dialog-view.html',
                            targetEvent: $event,
                            locals: {
                                validationData: reason.message
                            },
                            multiple: true,
                            preserveScope: true,
                            autoWrap: true,
                            skipHide: true
                        })

                    })

                })
            } else {
                vm.saveCallback().then(function (options) {

                    entityResolverService.update(options.entityType, options.entityId, options.entity).then(function (data) {

                        $mdDialog.hide({res: 'agree'});

                    }).catch(function (reason) {

                        $mdDialog.show({
                            controller: 'ValidationDialogController as vm',
                            templateUrl: 'views/dialogs/validation-dialog-view.html',
                            targetEvent: $event,
                            locals: {
                                validationData: reason.message
                            },
                            multiple: true,
                            preserveScope: true,
                            autoWrap: true,
                            skipHide: true
                        })

                    })
                })

            }
        };

    }

}());