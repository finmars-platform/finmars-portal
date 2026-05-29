import newDatabaseController from "./app/controllers/newDatabaseController";
import setupController from "./app/controllers/setupController";
import databaseRouter from './app/router';

// noinspection JSVoidFunctionReturnValueUsed
export default function () {

	let database = angular.module('finmars.database', []);

	database.config(['$stateProvider', databaseRouter])

	database.controller('NewDatabaseController', ['$scope', '$state', 'profileAuthorizerService', 'backendConfigurationImportService', 'redirectionService', newDatabaseController]);
	database.controller('SetupController', ['$scope', '$state', 'usersService', 'usersGroupService', 'backendConfigurationImportService', 'redirectionService', setupController]);

}