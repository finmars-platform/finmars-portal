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

    module.exports = function ($scope, $state, $rootScope, $mdDialog) {

        logService.controller('ShellController', 'initialized', 1);
        logService.controller('ShellController', 'working', 1);

        var vm = this;

        vm.readyStatus = {masters: false};

        vm.logout = function () {
            console.log('Logged out');
            usersService.logout();
            window.location.pathname = '/';
            cookiesService.deleteCookie();
            //usersService.logout();
        };

        usersService.ping().then(function (data) {
            setTimeout(function () {
                //usersService.login('dev1', 'Itein9Ha4eige6Aiph5a').then(function () {
                usersService.login('admin', 'superuser').then(function () {
                // usersService.login('mars1', 'superuser').then(function () {
                    // usersService.login('admin_dev', 'superuser').then(function () {


                    //usersService.login('dev1', 'Uethohk0').then(function () {
                    //usersService.login('dev2', 'ceechohf8Eexue6u').then(function () {
                    //usersService.login('dev11', 'cheeL1ei').then(function () {
                    console.log('after login', cookiesService.getCookie('csrftoken'));
                    $scope.$apply();
                });
            }, 1000);
        });

        usersService.getMasterList().then(function (data) {
            vm.masters = data.results;
            vm.readyStatus.masters = true;
            $scope.$apply();
        });

        usersService.getList().then(function (data) {
            vm.user = data.results[0];
            $scope.$apply();
        });

        vm.selectMaster = function (master) {

            usersService.setMasterUser(master.id);
            setTimeout(function () {
                $state.reload();
            }, 300);

        };

        vm.currentState = function () {
            return '';
        };

        vm.currentLocation = function () {
            vm.currentLocationShowBtns = true;

            if ($state.current.name.indexOf('app.forum') !== -1) {

                vm.currentLocationShowBtns = false;

                return 'FORUM';

            }

            if ($state.current.name.indexOf('app.settings') !== -1) {

                vm.currentLocationShowBtns = false;

                return 'SETTINGS';
            }

            switch ($state.current.name) {
                case 'app.dashboard':
                    return "DASHBOARD";
                    break;
                case 'app.data.portfolio':
                    return "PORTFOLIO";
                    break;
                case 'app.data.account':
                    return "ACCOUNT";
                    break;
                case 'app.data.counterparty':
                    return "COUNTERPARTY";
                    break;
                case 'app.data.counterparty-group':
                    return "COUNTERPARTY GROUP";
                    break;
                case 'app.data.responsible':
                    return "RESPONSIBLE";
                    break;
                case 'app.data.responsible-group':
                    return "RESPONSIBLE GROUP";
                    break;
                case 'app.data.instrument':
                    return "INSTRUMENT";
                    break;
                case 'app.data.transaction':
                    return "TRANSACTION";
                    break;
                case 'app.data.price-history':
                    return "PRICE HISTORY";
                    break;
                case 'app.data.currency-history':
                    return "CURRENCY HISTORY";
                    break;
                case 'app.data.strategy':
                    return "STRATEGY";
                    break;
                case 'app.data.strategy-subgroup':
                    return "STRATEGY SUBGROUP";
                    break;
                case 'app.data.strategy-group':
                    return "STRATEGY GROUP";
                    break;
                case 'app.data.account-type':
                    return "ACCOUNT TYPES";
                    break;
                case 'app.data.instrument-type':
                    return "INSTRUMENT TYPES";
                    break;
                case 'app.data.pricing-policy':
                    return "PRICING POLICY";
                    break;
                case 'app.data.transaction-type':
                    return "TRANSACTION TYPE";
                    break;
                case 'app.data.transaction-type-group':
                    return "TRANSACTION TYPE GROUPS";
                    break;
                case 'app.data.currency':
                    return "CURRENCY";
                    break;
                case 'app.data.complex-transaction':
                    return "Transaction";
                    break;
                case 'app.data.tag':
                    return "Tags";
                    break;
                case 'app.reports.balance-report':
                    return "BALANCE REPORT";
                    break;
                case 'app.reports.pnl-report':
                    return "P&L REPORT";
                    break;
                case 'app.reports.transaction-report':
                    return "TRANSACTION REPORT";
                    break;
                case 'app.reports.cash-flow-projection-report':
                    return "CASH FLOW PROJECTION REPORT";
                    break;
                case 'app.reports.performance-report':
                    return "PERFORMANCE REPORT";
                    break;
                case 'app.actions':
                    vm.currentLocationShowBtns = false;
                    return 'ACTIONS';
                    break;
                case 'app.system.notifications':
                    vm.currentLocationShowBtns = false;
                    return 'NOTIFICATIONS';
                    break;
                case 'app.system.transactions':
                    vm.currentLocationShowBtns = false;
                    return 'AUDIT TRANSACTIONS';
                    break;
                case 'app.system.instruments':
                    vm.currentLocationShowBtns = false;
                    return 'AUDIT INSTRUMENTS';
                    break;
                case 'app.settings.users-groups':
                    vm.currentLocationShowBtns = false;
                    return 'USERS & GROUPS';
                    break;
                default:
                    vm.currentLocationShowBtns = false;
                    return "";
                    break;
            }
        };

        vm.openHelp = function ($event) {

            //console.log('$state', $state);

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
                locals: {
                    options: {
                        entityType: entityType
                    }
                }
            }).then(function (res) {
                if (res.status == 'agree') {
                    $state.reload($state.current.name);
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

        notificationsService.getList(1, 'unreaded').then(function (data) {
            vm.unreadedNotificationsAmount = data.count;
            $scope.$apply();
        });

        $rootScope.$on('$stateChangeSuccess', function () {
            $mdDialog.cancel();
        });

        // console.log('root scope is ', $rootScope);
        console.log("Curent state is ", $state.current);

        vm.logOutMethod = function () {
            usersService.logout().then(function (data) {
                console.log('Logged out');
                window.location.pathname = '/';
                cookiesService.deleteCookie();
            });
        }
    }

}());