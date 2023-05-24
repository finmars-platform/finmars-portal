/**
 * Created by sergey on 04.11.16.
 */
(function () {

    'use strict';

    var uiService = require('../../../services/uiService');

    module.exports = function ($scope, $mdDialog, metaContentTypesService, commonDialogsService, data) {

        const vm = this;

        vm.readyStatus = false;
        // vm.complexSaveAsLayoutDialog = false;
        vm.userCodeError = false;
        vm.label = data.label || '';
        vm.error = null;

        vm.layout = {
            name: '',
            user_code: '',
            configuration_code: '',
        }

        let offerToOverride = data.offerToOverride || false; // if layout with same user_code exist, offer to overwrite it

        let dashboardLayout = data.dashboard || false;
        const entityType = data.entityType;

        let occupiedUserCodesList = [];
        vm.occupiedUserCodes = []; // passed into usercodeInputDirecitve

        /*vm.complexSaveAsLayoutDialog = true;
        vm.entityType = data.complexSaveAsLayoutDialog.entityType;*/

        if (data.layoutName) vm.layout.name = data.layoutName;

        if (data.layoutUserCode) vm.layout.user_code = data.layoutUserCode;
        vm.layout.content_type = metaContentTypesService.findContentTypeByEntity(entityType);

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        /** @returns {Boolean} - 'true' if user code occupied */
        const checkForUserCodeUniqueness = function () {

            if ( !occupiedUserCodesList.includes(vm.layout.user_code) ) {
                return false;
            }

            commonDialogsService.warning({
                warning: {
                    title: 'Warning',
                    description: 'Layout with such user code already exists. Do you want to overwrite?',
                    actionsButtons: [
                        {
                            name: "Cancel",
                            response: {}
                        },
                        {
                            name: "Overwrite",
                            response: {status: 'overwrite'}
                        }
                    ]
                }
            })
            .then(function (res) {

                if (res.status === 'overwrite') {
                    $mdDialog.hide({
                        status: 'overwrite',
                        data: vm.layout
                    });
                }

            });

            return true;

        }

        vm.agree = function () {

            /*let userCodeOccupied = false;

            if (offerToOverride) {

                var i;
                for (i = 0; i < layoutsUserCodes.length; i++) {

                    if (layoutsUserCodes[i] === vm.layoutUserCode) {

                        userCodeOccupied = true;

                        $mdDialog.show({
                            controller: 'WarningDialogController as vm',
                            templateUrl: 'views/dialogs/warning-dialog-view.html',
                            parent: angular.element(document.body),
                            targetEvent: $event,
                            clickOutsideToClose: false,
                            multiple: true,
                            locals: {
                                warning: {
                                    title: 'Warning',
                                    description: 'Layout with such user code already exists. Do you want to overwrite?',
                                    actionsButtons: [
                                        {
                                            name: "Cancel",
                                            response: {}
                                        },
                                        {
                                            name: "Overwrite",
                                            response: {status: 'overwrite'}
                                        }
                                    ]
                                }
                            }
                        }).then(function (res) {

                            if (res.status === 'overwrite') {
                                $mdDialog.hide({
                                    status: 'overwrite',
                                    data: vm.layout
                                });
                            }

                        });

                        break;
                    }
                }
            }*/

            if ( offerToOverride && checkForUserCodeUniqueness() ) { // user code is occupied
                return;
            }

            $mdDialog.hide({status: 'agree', data: vm.layout});

        };

        // vm.change = function ($event) {
        //     if (vm.layoutName.length != 0) {
        //         vm.userCodeIsTouched = true;
        //     }
        // };

        const init = function () {

            let getLayoutsProm;

            if (dashboardLayout) {
                // TODO: check for dashboard user code uniqueness using getDashboardLayoutLight
                vm.readyStatus = true;

            } else {
                getLayoutsProm = uiService.getListLayoutLight(entityType);

                getLayoutsProm.then(function (data) {

                    data.results.map(layout => {
                        occupiedUserCodesList.push(layout.user_code);
                    })

                    if (!offerToOverride) {
                        // validate user code for uniqueness inside usercodeInputDirective
                        vm.occupiedUserCodes = occupiedUserCodesList;
                    }

                    vm.readyStatus = true;
                    $scope.$apply();

                });
            }

        };

        init();

    };

})();
