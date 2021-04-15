/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        console.log('data', data);

        var vm = this;

        vm.data = data;

        vm.item = {
            name: ''
        }

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            $mdDialog.hide({
                status: 'agree', data: {
                    name: vm.item.name,
                    user_code: vm.item.user_code
                }
            });
        };
    }

}());