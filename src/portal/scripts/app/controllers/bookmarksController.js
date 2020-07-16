/**
 * Created by mevstratov on 29.01.2019.
 */
(function () {

    'use strict';

    var logService = require('../../../../core/services/logService');
    var toastNotificationService = require('../../../../core/services/toastNotificationService');
    var uiService = require('../services/uiService');

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
            var layoutExist = false;

            if (!vm.entityUpdating) {
                vm.entityUpdating = true;

                uiService.getListLayoutByKey(layoutId).then(function (layoutData) {
                    var layout = layoutData;

                    if (layout && layout.hasOwnProperty("id")) {
                        layoutExist = true;
                    }

                    var openActiveLayout = function () {

                        /*$state.transitionTo(stateToGo, {layoutName: layout.name});

                        vm.entityUpdating = false;*/
                        if (layout.user_code) {

                            $state.transitionTo(stateToGo, {layoutUserCode: layout.user_code});
                            vm.entityUpdating = false;

                        } else {
                            var errorText = 'Layout "' + layout.name + '" has no user code.';
                            toastNotificationService.error(errorText);
                        }

                    };

                    if (layoutExist) {
                        openActiveLayout();
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

    }
}());