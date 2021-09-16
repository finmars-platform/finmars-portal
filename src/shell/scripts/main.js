/**
 * Created by mevstratov on 18.05.2021
 */

'use strict';

// fixes angular module import error
// require('../../forum/scripts/main.js');
import profile from '../../profile/scripts/main.js';
import database from '../../database/scripts/main.js';
import portal from '../../portal/scripts/main.js';


import router from "./app/router.js";

import websocketService from "./app/services/websocketService";

import cookieService from "./app/services/cookieService.js";
// import localStorageService from "./app/services/localStorageService";
import toastNotificationService from "./app/services/toastNotificationService.js";
import errorService from "./app/services/errorService.js";
import xhrService from "./app/services/xhrService.js";
import broadcastChannelService from "./app/services/broadcastChannelService.js";
import globalDataService from "./app/services/globalDataService.js";
import authorizerService from "./app/services/authorizerService.js";
import middlewareService from "./app/services/middlewareService.js";
import usersService from "./app/services/usersService.js";
import usersGroupService from "./app/services/usersGroupService";
import backendConfigurationImportService from "../../portal/scripts/app/services/backendConfigurationImportService";

import commonDialogsService from "./app/services/commonDialogsService.js";

import shellController from "./app/controllers/shellController.js";
import warningDialogController from "./app/controllers/dialogs/warningDialogController.js";

import dndFilesOnPageDirective from "./app/directives/dndFilesOnPageDirective.js";

const app = angular.module('finmars', [
	'ngAria',
	'ngMaterial',
	'ngMessages',
	'ngMdIcons',
	'ngResource',
	'ngSanitize',
	'ui.router',

	'finmars.profile',
	'finmars.database',
	'finmars.portal',
	// 'finmars.forum'
]);

// app.config(['$stateProvider', '$urlServiceProvider', require('./app/router.js')]);
app.config(['$stateProvider', '$urlServiceProvider', router]);
app.config(['$mdDateLocaleProvider', function ($mdDateLocaleProvider) {
	$mdDateLocaleProvider.formatDate = date => {
		return moment(date).format('YYYY-MM-DD');
	};
}]);

//<editor-fold desc="Websocket initialization">
app.run([function () {

	console.log('Project environment: ' + '__PROJECT_ENV__');
	console.log('Project build date: ' + '__BUILD_DATE__');

	let controllersCount = 0;
	let directivesCount = 0;

	app._invokeQueue.forEach(function (item) {

		if (item[0] === '$controllerProvider') {
			controllersCount = controllersCount + 1;
		}

		if (item[0] === '$compileProvider' && item[1] === 'directive') {
			directivesCount = directivesCount + 1;
		}

	});

	console.log("angular.js info: " + controllersCount + ' controllers registered');
	console.log("angular.js info: " + directivesCount + ' directives registered');

	// const developerConsoleService = require('../../portal/scripts/app/services/developerConsoleService');
	// const websocketService = require('./app/services/websocketService');
	const toastNotificationService = require('../../core/services/toastNotificationService');


	// window.developerConsoleService = developerConsoleService;

	// developerConsoleService.init();

	// try {

		// window.ws = new WebSocket("__WS_HOST__");

	websocketService.connect();
	websocketService.reconnectIfError();

	websocketService.addEventListener('simple_message', function (data) {
		toastNotificationService.info(data.message)
	})

		// window.ws.onopen = function () {
		// 	console.log("Websocket. Initial Auth");
		// 	window.ws.send(JSON.stringify({action: "initial_auth"}));
		// }

	// } catch (error) {
	//
	// 	console.error("Can't connect to Websocket server. Error ", error);
	//
	// 	window.ws = null;
	//
	// }



}]);
//</editor-fold>

app.service('cookieService', [cookieService]);
// app.service('localStorageService', ['globalDataService', localStorageService]);
app.service('toastNotificationService', [toastNotificationService]);
app.service('errorService', ['toastNotificationService', errorService]);
app.service('xhrService', ['errorService', xhrService]);
app.service('broadcastChannelService', [broadcastChannelService]);
app.service('globalDataService', [globalDataService]);
app.service('authorizerService', ['globalDataService', authorizerService]);
app.service('middlewareService', [middlewareService]);
app.service('usersService', ['globalDataService', usersService]);
app.service('usersGroupService', ['globalDataService', usersGroupService]);
app.service('backendConfigurationImportService', ['cookieService', backendConfigurationImportService]);

app.service('commonDialogsService', ['$mdDialog', commonDialogsService]);

app.controller('ShellController', ['$scope', '$state', '$transitions', '$urlService', '$mdDialog', 'cookieService', 'broadcastChannelService', 'middlewareService', 'authorizerService', 'globalDataService', shellController]);

app.controller('WarningDialogController', ['$scope', '$mdDialog', 'warning', warningDialogController]);

app.directive('dndFilesOnPage', ['$state', 'commonDialogsService', dndFilesOnPageDirective]);