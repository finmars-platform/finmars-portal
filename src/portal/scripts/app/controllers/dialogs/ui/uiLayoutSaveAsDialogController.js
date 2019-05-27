/**
 * Created by sergey on 04.11.16.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');

    var uiService = require('../../../services/uiService');

    module.exports = function ($scope, $mdDialog, options) {

        logService.controller('UiLayoutSaveAsDialogController', 'initialized');

        var vm = this;

        vm.complexSaveAsLayoutDialog = false;

        var layoutsNames = ["New Layout"];

        if (options) {

            if (options.complexSaveAsLayoutDialog) {

                vm.complexSaveAsLayoutDialog = true;
                vm.entityType = options.complexSaveAsLayoutDialog.entityType;

                uiService.getListLayout(vm.entityType).then(function (data) {

                    var layouts = data.results;

                    layouts.map(function (layout) {
                        layoutsNames.push(layout.name);
                    });

                });

            }

            if (options.layoutName) {

                vm.layoutName = options.layoutName;

            }

        }

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function ($event) {

            var layoutNameOccupied = false;

            if (vm.complexSaveAsLayoutDialog) {

                var i;
                for (i = 0; i < layoutsNames.length; i++) {

                    if (layoutsNames[i] == vm.layoutName) {
                        layoutNameOccupied = true;

                        $mdDialog.show({
                            controller: 'WarningDialogController as vm',
                            templateUrl: 'views/warning-dialog-view.html',
                            parent: angular.element(document.body),
                            targetEvent: $event,
                            clickOutsideToClose: false,
                            multiple: true,
                            locals: {
                                warning: {
                                    title: 'Warning',
                                    description: 'There is already layout with such name. Layouts should have unique names.'
                                }
                            }
                        });

                        break;
                    }
                }
            }

            if (!layoutNameOccupied) {
                $mdDialog.hide({status: 'agree', data: {name: vm.layoutName}});
            }

        };

    }

}());