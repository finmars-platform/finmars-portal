import databaseRouter from './app/router';

// noinspection JSVoidFunctionReturnValueUsed
export default (function () {

	let database = angular.module('finmars.database', []);

	database.config(['$stateProvider', databaseRouter])

	database.controller('NewDatabaseController', ['$scope', '$state', 'profileAuthorizerService', 'backendConfigurationImportService', require('./app/controllers/newDatabaseController')]);
	database.controller('SetupController', ['$scope', '$state', 'usersService', 'usersGroupService', 'backendConfigurationImportService', require('./app/controllers/setupController')]);

})();