/**
 * Created by szhitenev on 10.11.2020.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.items = data.results;

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };
    }

}());