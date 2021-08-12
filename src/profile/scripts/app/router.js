/**
 * Created by szhitenev on 04.05.2016.
 */
// (function () {

    // module.exports = function ($stateProvider) {
export default function ($stateProvider) {

	$stateProvider.state('app.profile', {
		url: '/profile',
		templateUrl: 'views/profile-view.html',
		// abstract: true,
		controller: 'ProfileController as vm',
		params: {

		}
	});

	/* $stateProvider.state('app.new-database', {
		url: '/new-database',
		templateUrl: 'views/new-database-view.html',
		// abstract: true,
		controller: 'NewDatabaseController as vm'
	}) */

};

// })();