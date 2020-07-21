/**
 * Created by szhitenev on 20.07.2020.
 */
(function(){

    'use strict';

    var usersService = require('../../services/usersService');

    module.exports = function LoginDialogController($scope, $mdDialog, data){

        var vm = this;

        vm.data = data;

        vm.processing = false;
        vm.error = false;

        vm.agree = function ($event) {

            vm.processing = true;

            usersService.login(vm.username, vm.password).then(function (data) {

                $mdDialog.hide({status: 'agree'});

            }).catch(function(error){

                vm.processing = false;

                vm.error = true;

                $scope.$apply();


            })


        };
    }

}());