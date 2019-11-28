/**
 * Created by szhitenev on 08.06.2016.
 */
(function(){

    'use strict';

    module.exports = function($scope, $mdDialog, warning){

        var vm = this;

        vm.warning = warning;

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };
    }

}());