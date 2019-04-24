/**
 * Created by mevstratov on 22.04.2019.
 */
(function(){

    'use strict';

    module.exports = function($scope, $mdDialog){

        var vm = this;

        vm.saveLayout = function () {
            $mdDialog.hide({status: 'save_layout'});
        };

        vm.dontSave = function () {
            $mdDialog.hide({status: 'do_not_save_layout'});
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };
    }

}());