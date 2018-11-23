/**
 * Created by sergey on 30.07.16.
 */
(function () {

    'use strict';

    var usersService = require('../services/usersService');

    module.exports = function ($scope, $state, $mdDialog) {

        var vm = this;

        vm.readyStatus = {content: false};

        vm.getMasterUsersList = function () {

            usersService.getMasterList().then(function (data) {
                vm.masters = data.results;
                vm.readyStatus.content = true;
                $scope.$apply();
            });

        };

        vm.createDatabase = function ($event) {

            $mdDialog.show({
                controller: 'CreateMasterUserDialogController as vm',
                templateUrl: 'views/dialogs/create-master-user-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
            }).then(function (value) {

                vm.getMasterUsersList();

            })

        };

        vm.activateDatabase = function (item) {

            console.log('item', item);

            usersService.setMasterUser(item.id);
            $state.go('app.data.portfolio');

        };

        vm.getMasterUsersList();


    }

}());