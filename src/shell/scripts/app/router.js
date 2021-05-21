/**
 * Created by mevstratov on 18.05.2021
 */
(function () {

	'use strict';

	module.exports = function ($stateProvider, $urlServiceProvider) {
		console.log("testing shell router11 intitialized", $urlServiceProvider);
		$urlServiceProvider.rules.otherwise('app.home');

		$stateProvider.state('app', {
			url: '',
			abstract: true,
			templateUrl: 'views/shell-view.html',
			controller: 'ShellController as vm'
		});

		$stateProvider.state('app.authentication', {
			url: '/authentication',
			templateUrl: 'views/login-view.html',
			// controller: 'AuthenticationController as vm'
		});

	};

})();