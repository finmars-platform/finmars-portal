/**
 * Created by mevstratov on 29.01.2019.
 */
(function () {

    'use strict';

    var logService = require('../../../../core/services/logService');
    var uiService = require('../services/uiService');
    var metaContentTypesService = require('../services/metaContentTypesService');
    var bookmarkService = require('../services/bookmarkService');

    module.exports = function ($scope, $mdDialog, $state) {

        var vm = this;

        logService.controller('BookmarksController', 'initialized');

        vm.entityUpdating = false;

        vm.getBookmarks = function() {

            bookmarkService.getList().then(function (data) {
                vm.items = data.results;
                $scope.$apply();
            });

        };

        vm.getBookmarks();

        vm.setLayout = function (layoutInfo) {

            var layoutId = layoutInfo.list_layout;
            var stateToGo = layoutInfo.data.state;
            var entityType = metaContentTypesService.getContentTypeUIByState(stateToGo);
            var layoutExist = false;

            if (!vm.entityUpdating) {
                vm.entityUpdating = true;

                uiService.getListLayout(entityType).then(function (data) {
                    var layouts = data.results;

                    if (layouts && layouts.length) {
                        layouts.forEach(function (layout) { // TODO refactor active layout update mechanism
                            if (layout.id === layoutId) {
                                layout.is_default = true;
                                layoutExist = true;
                            } else {
                                layout.is_default = false;
                            }
                            ;

                        });
                    }

                    var updateDefaultLayout = function (layoutsToUpdate) {
                        var promises = [];

                        layoutsToUpdate.forEach(function (item) {
                            promises.push(uiService.updateListLayout(item.id, item));
                        });

                        Promise.all(promises).then(function () {
                            if ($state.current.name === stateToGo) {
                                $state.reload(stateToGo);
                                $scope.$apply();
                            }
                            else {
                                $state.go(stateToGo);
                                $scope.$apply();
                            }
                            vm.entityUpdating = false;
                        });
                    };

                    if (layoutExist) {
                        updateDefaultLayout(layouts);
                    } else {
                        $state.go('app.not-found');
                        vm.entityUpdating = false;
                    }

                });
            }
        };

        vm.openSettings = function ($event) {

            $mdDialog.show({
                controller: 'BookmarksWizardDialogController as vm',
                templateUrl: 'views/dialogs/bookmarks-wizard-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                multiple: true,
                autoWrap: true,
                skipHide: true
            }).then(function (res) {
                if (res.status === 'agree') {
                    vm.getBookmarks();
                }
            });

        };

        // vm.getState = function (item) {
        //
        //     var uiState = item.data;
        //
        //     return uiState.state + '({listLayout: ' + item.list_layout + '})';
        // }

    }
}());