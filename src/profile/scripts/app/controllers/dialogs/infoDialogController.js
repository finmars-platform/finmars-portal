/**
 * Created by szhitenev on 08.06.2016.
 */
(function(){

    'use strict';

    module.exports = function($scope, $mdDialog, data){

        var vm = this;

        vm.info = data;

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };
    }

}());