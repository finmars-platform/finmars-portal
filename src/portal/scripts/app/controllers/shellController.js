/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../core/services/logService');
    var cookiesService = require('../../../../core/services/cookieService');

    var usersService = require('../services/usersService');
    var metaContentTypesService = require('../services/metaContentTypesService');
    var notificationsService = require('../services/notificationsService');

    var reportCopyHelper = require('../helpers/reportCopyHelper');

    var metaService = require('../services/metaService');
    var uiService = require('../services/uiService');
    var middlewareService = require('../services/middlewareService');

    module.exports = function ($scope, $state, $rootScope, $mdDialog, $transitions) {

        var vm = this;

        vm.readyStatus = {masters: false};

        vm.currentState = 'portal';
        vm.currentMasterUser = '';

        vm.logout = function () {
            console.log('Logged out');
            usersService.logout();
            window.location.pathname = '/';
            cookiesService.deleteCookie();
            //usersService.logout();
        };

        if ('__PROJECT_ENV__' === 'development') {

            usersService.ping().then(function (data) {
                setTimeout(function () {
                    usersService.login('__LOGIN__', '__PASS__').then(function () {
                        console.log('after login', cookiesService.getCookie('csrftoken'));
                        $scope.$apply();
                    });
                }, 1000);
            });

        }

        vm.getMasterUsersList = function () {

            vm.readyStatus.masters = false;

            return usersService.getMasterList().then(function (data) {
                vm.masters = data.results;
                vm.readyStatus.masters = true;
                vm.updateCurrentMasterUser();
                $scope.$apply();

            });

        };

        vm.updateCurrentMasterUser = function () {

            vm.masters.forEach(function (item) {

                if (item.is_current) {
                    vm.currentMasterUser = item;
                }

            });

        };

        usersService.getList().then(function (data) {
            vm.user = data.results[0];
            $scope.$apply();
        });

        vm.selectMaster = function (master) {

            usersService.setMasterUser(master.id).then(function (value) {

                $state.go('app.home');

                vm.getMasterUsersList();


            })


        };

        vm.currentState = function () {
            return '';
        };

        vm.getCurrentState = function () {

            if ($state.current.name.indexOf('app.profile') !== -1) {
                return 'profile'
            }

            return 'portal';

        };

        vm.currentLocation = function () {
            return metaService.getCurrentLocation($state).toUpperCase();
        };

        // Get name of active layout in the toolbar
        vm.entityHasLayout = false;
        var previousState = '';
        var currentState = '';

        var stateOfEntity = false;

        vm.isStateOfEntity = function () {

            currentState = $state.current.name;
            var layoutSwitched = middlewareService.getData('activeLayoutSwitched');

            // Change layout information on state change
            if (currentState !== previousState) {
                previousState = currentState;

                if (currentState.indexOf('app.data.') !== -1 || vm.isReport()) {
                    stateOfEntity = true;
                    vm.getActiveLayoutName();
                } else {
                    stateOfEntity = false;
                }
            }

            // Check if layout has been switched on the same state
            if (layoutSwitched) {
                vm.getActiveLayoutName();
                middlewareService.deleteData('activeLayoutSwitched');
            }

            return stateOfEntity;
        };

        vm.activeLayoutName = '';
        vm.getActiveLayoutName = function () {

            var entityType = metaContentTypesService.getContentTypeUIByState($state.current.name);

            uiService.getListLayout(entityType).then(function (data) {

                if (data.results) {
                    var layouts = data.results;

                    if (layouts.length > 1) {

                        var i;
                        for (i = 0; i < layouts.length; i++) {

                            if (layouts[i].is_default) {
                                vm.activeLayoutName = layouts[i].name;
                                $scope.$apply();
                                break;
                            }
                        }

                    } else {
                        vm.activeLayoutName = layouts[0].name;
                        $scope.$apply();
                    }
                }
            });

        };
        // --------------------------------

        vm.showBookmarks = false;
        vm.toggleBookmarkPanel = function () {
            vm.showBookmarks = !vm.showBookmarks;
        };

        vm.openHelp = function ($event) {

            var urlPieces = $state.current.url.split('/');
            var destinationUrl = urlPieces[urlPieces.length - 1].replace('-', '_');

            var helpPageUrl = destinationUrl + '.html';

            $mdDialog.show({
                controller: 'HelpDialogController as vm',
                templateUrl: 'views/dialogs/help-dialog-view.html',
                targetEvent: $event,
                locals: {
                    data: {
                        helpPageUrl: helpPageUrl
                    }
                },
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true
            })
        };

        vm.isReport = function () {

            switch ($state.current.name) {
                case 'app.reports.balance-report':
                    return true;
                    break;
                case 'app.reports.pnl-report':
                    return true;
                    break;
                case 'app.reports.transaction-report':
                    return true;
                    break;
                case 'app.reports.cash-flow-projection-report':
                    return true;
                    break;
                case 'app.reports.performance-report':
                    return true;
                    break;
                default:
                    return false
            }

        };

        vm.copyReport = function ($event) {
            console.log('copy report');
            reportCopyHelper.copy($event);
        };

        vm.openLayoutList = function ($event) {

            var entityType = metaContentTypesService.getContentTypeUIByState($state.current.name);

            $mdDialog.show({
                controller: 'UiLayoutListDialogController as vm',
                templateUrl: 'views/dialogs/ui/ui-layout-list-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                multiple: true,
                locals: {
                    options: {
                        entityType: entityType
                    }
                }
            }).then(function (res) {
                if (res.status == 'agree') {
                    // $state.reload($state.current.name);
                    $state.reload();
                }

            })
        };

        vm.openNotificationsMenu = function ($event) {
            $mdDialog.show({
                controller: 'HeaderNotificationsDialogController as vm',
                templateUrl: 'views/dialogs/header-notifications-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event
            });
        };

        vm.getNotifications = function () {

            notificationsService.getList(1, 'unreaded').then(function (data) {
                vm.unreadedNotificationsAmount = data.count;
                $scope.$apply();
            });
        };

        $transitions.onSuccess({}, function (transition) {

            var from = transition.from();

            if (from.name === 'app.profile') {
                vm.getMasterUsersList();
            }


        });

        vm.logOutMethod = function () {
            usersService.logout().then(function (data) {
                console.log('Logged out');
                sessionStorage.removeItem('afterLoginEvents');
                window.location.pathname = '/';
                cookiesService.deleteCookie();
            });
        };

        vm.init = function () {

            vm.getMasterUsersList().then(function () {

                if (vm.masters.length) {
                    vm.getNotifications();
                }
            })

        };

        vm.init();
    }

}());