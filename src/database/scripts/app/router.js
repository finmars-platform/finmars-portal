export default function ($stateProvider) {

	$stateProvider.state('app.new-database', {
		url: '/new-database',
		templateUrl: 'views/new-database-view.html',
		// abstract: true,
		controller: 'NewDatabaseController as vm'
	})

	$stateProvider.state('app.setup', {
		url: '/setup',
		templateUrl: 'views/setup-view.html',
		controller: 'SetupController as vm'
	});

};