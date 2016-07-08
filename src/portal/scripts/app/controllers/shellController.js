/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

	'use strict';

	var logService = require('../services/logService');
	var cookiesService = require('../services/cookieService');

	var usersService = require('../services/usersService');

	module.exports = function ($scope, $state) {

		logService.controller('ShellController', 'initialized');

		var vm = this;

		vm.logout = function () {
			console.log('Logged out');
			usersService.logout();
		};

		window.fetch('/api/v1/users/ping/').then(function (data) {
			return data.json()
		}).then(function (data) {
			setTimeout(function () {
				usersService.login('dev1', 'Uethohk0').then(function () {
					console.log('after login', cookiesService.getCookie('csrftoken'));
					$scope.$apply();
				});
			}, 1000)
		});

		usersService.getList().then(function (data) {
			vm.user = data.results[0];
			$scope.$apply();
		});

		vm.currentState = function () {
			return '';
		}

		vm.currentLocation = function () {
			switch ($state.current.name) {
				case 'app.data.portfolio':
					return "PORTFOLIO"
					break;
				case 'app.data.account':
					return "ACCOUNT"
					break;
				case 'app.data.counterparty':
					return "COUNTERPARTY"
					break;
				case 'app.data.responsible':
					return "RESPONSIBLE"
					break;
				case 'app.data.instrument':
					return "INSTRUMENT"
					break;
				case 'app.data.transaction':
					return "TRANSACTION"
					break;
				case 'app.data.price-history':
					return "PRICE HISTORY"
					break;
				case 'app.data.currency-history':
					return "CURRENCY HISTORY"
					break;
				default:
					return "";
					break;
			}
		}

		console.log("Curent state is ", $state.current);

	}

}());