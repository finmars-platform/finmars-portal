/**
 * Created by szhitenev on 08.06.2016.
 */
(function(){

    'use strict';

    module.exports = function($scope, $mdDialog, data){

        var vm = this;

        vm.complexImportScheme = data.complexImportScheme;
        vm.validationResults = data.validationResults;


        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };
    }

}());