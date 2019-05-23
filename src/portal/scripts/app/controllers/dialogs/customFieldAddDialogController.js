/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var customFieldService = require('../../services/reports/customFieldService');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.entityType = data.entityType;
        vm.customField = {};

        vm.setupConfig = function ($event) {
            $mdDialog.show({
                controller: 'CustomFieldsConfigDialogController as vm',
                templateUrl: 'views/dialogs/custom-fields-config-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    data: {
                        customField: vm.attribute
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true
            }).then(function (res) {

                console.log('res', res);

                if (res.status === 'agree') {

                    vm.attribute.expr = res.data.expression;
                    vm.attribute.layout = res.data.layout;

                }
            });
        };

        vm.agree = function () {

            customFieldService.create(vm.entityType, vm.customField).then(function (value) {

                $mdDialog.hide({status: 'agree'});

            })

        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

    }

}());