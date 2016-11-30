/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../core/services/logService');
    var cookiesService = require('../../../../core/services/cookieService');

    var usersService = require('../services/usersService');
    var metaContentTypesService = require('../services/metaContentTypesService');

    module.exports = function ($scope, $state, $rootScope, $mdDialog) {

        logService.controller('ShellController', 'initialized', 1);

        var vm = this;

        vm.logout = function () {
            console.log('Logged out');
            window.location.pathname = '/';
            cookiesService.deleteCookie();
            //usersService.logout();
        };

         //window.fetch('/api/v1/users/ping/').then(function (data) {
         //	return data.json()
         //}).then(function (data) {
         //	setTimeout(function () {
         //		usersService.login('dev1', 'Uethohk0').then(function () {
         //		//usersService.login('dev2', 'ceechohf8Eexue6u').then(function () {
         //		//usersService.login('dev11', 'cheeL1ei').then(function () {
         //		//	console.log('after login', cookiesService.getCookie('csrftoken'));
         //			$scope.$apply();
         //		});
         //	}, 1000)
         //});

        usersService.getList().then(function (data) {
            vm.user = data.results[0];
            $scope.$apply();
        });

        vm.currentState = function () {
            return '';
        };

        vm.currentLocation = function () {
            vm.currentLocationShowBtns = true;

            switch ($state.current.name) {
                case 'app.data.portfolio':
                    return "PORTFOLIO";
                    break;
                case 'app.data.account':
                    return "ACCOUNT";
                    break;
                case 'app.data.counterparty':
                    return "COUNTERPARTY";
                    break;
                case 'app.data.responsible':
                    return "RESPONSIBLE";
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
                case 'app.data.currency':
                    return "CURRENCY";
                    break;
                case 'app.data.complex-transaction':
                    return "Transaction";
                    break;
                case 'app.reports.balance-report':
                    return "BALANCE REPORT";
                    break;
                case 'app.reports.pnl-report':
                    return "P&L REPORT";
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