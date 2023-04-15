/**
 * Created by szhitenev on 04.05.2016.
 */
// (function () {

    // module.exports = function ($stateProvider) {
export default function ($stateProvider) {

	$stateProvider.state('app.profile', {
		url: '/profile?state&code&session_state&kc_action_status',
		templateUrl: 'views/profile-view.html',
		// abstract: true,
		controller: 'ProfileController as vm',
		params: {
			state: null,
			code: null,
			session_state: null,
			kc_action_status: null
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