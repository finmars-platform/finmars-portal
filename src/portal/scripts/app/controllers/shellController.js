/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../core/services/logService');
    var cookiesService = require('../../../../core/services/cookieService');

    var entityViwerDataService = require('../services/entityViewerDataService');

    var usersService = require('../services/usersService');
    var metaContentTypesService = require('../services/metaContentTypesService');
    var notificationsService = require('../services/notificationsService');

    var reportCopyHelper = require('../helpers/reportCopyHelper');

    var metaService = require('../services/metaService');
    var uiService = require('../services/uiService');
    var middlewareService = require('../services/middlewareService');

    var crossTabEvents = {
        'MASTER_USER_CHANGED': 'MASTER_USER_CHANGED',
        'LOGOUT': 'LOGOUT'
    };

    module.exports = function ($scope, $state, $rootScope, $mdDialog, $transitions) {

        var vm = this;

        vm.readyStatus = {masters: false};

        vm.currentState = 'portal';
        vm.currentMasterUser = '';

        vm.broadcastManager = null;

        vm.logout = function () {
            console.log('Logged out');

            usersService.logout();

            if (vm.broadcastManager) {
                vm.broadcastManager.postMessage({event: crossTabEvents.LOGOUT});
            }

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

        $transitions.onStart({}, function () {
            $mdDialog.cancel();
        });

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

        vm.initCrossTabBroadcast = function () {

            vm.broadcastManager = new BroadcastChannel('finmars_broadcast');

            vm.broadcastManager.onmessage = function (ev) {

                console.log(ev);

                if (event.data.event === crossTabEvents.MASTER_USER_CHANGED) {
                    $state.go('app.home');
                    vm.getMasterUsersList();
                }

                if (event.data.event === crossTabEvents.LOGOUT) {
                    window.location.href = '/';
                }


            }
        };

        vm.selectMaster = function (master) {

            usersService.setMasterUser(master.id).then(function (value) {

                $state.go('app.home');

                if (vm.broadcastManager) {
                    vm.broadcastManager.postMessage({event: crossTabEvents.MASTER_USER_CHANGED});
                }

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

        /*vm.currentLocation = function () {
            return metaService.getCurrentLocation($state).toUpperCase();
        };*/
        vm.currentLocation = function () {
            return metaService.getHeaderTitleForCurrentLocation($state);
        };

        // Get name of active layout in the toolbar

        var previousState = '';
        var currentState = '';

        var showLayoutName = false;

        vm.isStateOfEntity = function () {

            currentState = $state.current.name;
            var layoutSwitched = middlewareService.getData('entityActiveLayoutSwitched');

            // Change layout information on state change
            if (currentState !== previousState) {
                previousState = currentState;

                if (currentState.indexOf('app.data.') !== -1 || vm.isReport()) {
                    showLayoutName = true;
                    vm.getActiveLayoutName();
                } else {
                    showLayoutName = false;
                }
            }

            // Check if layout has been switched on the same state
            if (layoutSwitched) {
                vm.getActiveLayoutName(layoutSwitched);
                middlewareService.deleteData('entityActiveLayoutSwitched');
            }

            return showLayoutName;
        };

        vm.activeLayoutName = '';
        vm.getActiveLayoutName = function (newLayoutName) {

            if (typeof newLayoutName === "string") {

                vm.activeLayoutName = newLayoutName;

            } else {

                var entityType = metaContentTypesService.getContentTypeUIByState($state.current.name);

                uiService.getDefaultListLayout(entityType).then(function (data) {

                    var activeLayoutRes = data.results;
                    if (activeLayoutRes && activeLayoutRes.length) {
                        vm.activeLayoutName = activeLayoutRes[0].name;
                    }

                    $scope.$apply();
                });

            }

        };
        // < Get name of active layout in the toolbar >

        vm.showBookmarks = false;
        vm.toggleBookmarksPanel = function () {

            var mdContent = document.querySelector('md-content');
            mdContent.classList.add('overflow-hidden');

            vm.showBookmarks = !vm.showBookmarks;

            setTimeout(function () {
                mdContent.classList.remove('overflow-hidden');
            }, 100);

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
                case 'app.reports.pl-report':
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

            });

            if (window.BroadcastChannel) {
                vm.initCrossTabBroadcast();
            }

        };

        vm.init();
    }

}());