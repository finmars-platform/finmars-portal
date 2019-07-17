/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.masterUser = data.masterUser;

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function ($event) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: angular.element(document.body),
                locals: {
                    warning: {
                        title: 'Confirmation',
                        description: 'Database ' + vm.masterUser.name + ' is going to be deleted.'
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                targetEvent: $event
            }).then(function (res) {

                if (res.status === 'agree') {

                    $mdDialog.hide({status: 'agree'});
                }

            })


        };
    }

}());