/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';



    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.data = data;

        vm.getName = function (item) {

            if (item.scheme_name) {
                return item.scheme_name
            }

            return item.name;

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };
    }

}());