/**
 * Created by mevstratov on 24.06.2019.
 */
(function () {

    'use strict';

    var referenceTablesService = require('../../services/referenceTablesService');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.referenceTables = [];

        vm.readyStatus = {referenceTables: false};

        vm.getData = function () {

            vm.readyStatus.referenceTables = false;

            referenceTablesService.getList().then(function (data) {

                vm.referenceTables = data.results;

                vm.readyStatus.referenceTables = true;

                $scope.$apply();

            })

        };

        vm.openReferenceTable = function ($event, item) {

            $mdDialog.show({
                controller: 'ReferenceTableEditDialogController as vm',
                templateUrl: 'views/dialogs/reference-table-edit-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    data: {
                        referenceTable: Object.assign({}, item)
                    }
                }
            }).then(function (res) {

                if (res.status === 'agree') {
                    vm.getData();
                }

            })

        };

        vm.renameReferenceTable = function ($event, item) {

            $mdDialog.show({
                controller: 'ReferenceTableRenameDialogController as vm',
                templateUrl: 'views/dialogs/reference-table-rename-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    data: {
                        referenceTable: Object.assign({}, item)
                    }
                }
            }).then(function (res) {

                if (res.status === 'agree') {
                    vm.getData();
                }

            })

        };

        vm.deleteReferenceTable = function ($event, item) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: 'Are you sure to delete ' + item.name + '?'
                    }
                }
            }).then(function (res) {

                if (res.status === 'agree') {
                    referenceTablesService.deleteByKey(item.id).then(function (data) {

                        vm.getData();

                    })
                }

            })

        };

        vm.getNewName = function (name, index) {

            if (!name) {
                name = "New Reference Table";
            }

            if(!index) {
                index = 1
            }

            var existing_names = [];

            existing_names = vm.referenceTables.map(function (item) {
                return item.name
            });

            if (existing_names.indexOf(name) === -1) {
                return name
            } else {
                return vm.getNewName("New Reference Table " + index, index + 1)
            }

        };

        vm.createReferenceTable = function () {

            var name = vm.getNewName();

            var referenceTable = {
                name: name,
                rows: []
            };

            referenceTablesService.create(referenceTable).then(function () {

                vm.getData()

            })

        };

        vm.init = function () {

            vm.getData();

        };

        vm.init()

    }

}());