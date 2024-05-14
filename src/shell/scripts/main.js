/**
 * Created by mevstratov on 18.05.2021
 */

'use strict';

/** fixes angular module import error */
// require('../../forum/scripts/main.js');
import angular from 'angular';



import profile from '../../profile/scripts/main.js';
import database from '../../database/scripts/main.js';
import portal from '../../portal/scripts/main.js';

// 2024-01-12 szhitenev update end

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
import systemMessageService from "../../portal/scripts/app/services/systemMessageService";
import redirectionService from "./app/services/redirectionService";

import commonDialogsService from "./app/services/commonDialogsService.js";

import shellController from "./app/controllers/shellController.js";
import warningDialogController from "./app/controllers/dialogs/warningDialogController.js";
import inputsDialogController from "./app/controllers/dialogs/inputsDialogController.js";

import dndFilesOnPageDirective from "./app/directives/dndFilesOnPageDirective.js";

const PROJECT_ENV = '__PROJECT_ENV__'; // changed when building project by minAllScripts()

console.log("Shell Module inited")

const app = angular.module('finmars', [
    'ngAria',
    'ngMaterial',
    'ngMessages',
    'ngMdIcons',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    'ui.router',

    'finmars.profile',
    'finmars.database',
    'finmars.portal',
]);

// app.config(['$stateProvider', '$urlServiceProvider', require('./app/router.js')]);
app.config(['$stateProvider', '$urlServiceProvider', router]);
app.config(['$mdDateLocaleProvider', function ($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = date => {
        return moment(date).format('YYYY-MM-DD');
    };
}]);

app.factory('$exceptionHandler', [function () {
    return function myExceptionHandler(exception, cause) {

        if (!window.system_errors) {
            window.system_errors = []
        }
        
        console.error('exception', exception);
        console.log('cause', cause);

        window.system_errors.push({
            created: new Date().toISOString(),
            location: window.location.href,
            data: {
                exception: exception,
                cause: cause
            },
            text: exception.toString()
        })


    };
}]);

// app.config(function($provide) {
//     $provide.decorator('$rootScope', function($delegate) {
//
//         // Save a reference to the original $apply
//         const originalApply = $delegate.constructor.prototype.$apply;
//
//         // Override $apply
//         $delegate.constructor.prototype.$apply = function(expr) {
//             // console.log('Custom $apply logic here');
//
//             // Call the original $apply
//             return originalApply.apply(this, arguments);
//         };
//
//         return $delegate;
//     });
// });

//<editor-fold desc="Websocket initialization">
app.run(['$rootScope', function ($rootScope) {

    console.log('Project environment: ' + '__PROJECT_ENV__');
    console.log('Project build date: ' + '__BUILD_DATE__');

    let controllersCount = 0;
    let directivesCount = 0;

    console.log('$rootScope', $rootScope);

    let activeNoteTimeout = null;

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

        console.log("State changed")

        // szhitenev 2024-04-28 tmp disabled
        /*if (window.activeNote) {

            clearTimeout(activeNoteTimeout);

            activeNoteTimeout = setTimeout(function () {
                try {
                    window.activeNote.getNotes();
                } catch (e) {
                    console.error("Could not fetch notes from ActiveNote", e)
                }
            }, 5000)
        }*/

        // called every time the state transition is attempted

    });

    /*setTimeout(function () {
        try {
            window.activeNote.getNotes();
        } catch (e) {
            console.error("Could not fetch notes from ActiveNote", e)
        }
    }, 5000)

    setInterval(function () {

        if (window.activeNote) {
            window.activeNote.renderNotes();
        }

    }, 6000)*/

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

    // if (PROJECT_ENV !== 'local') {

        // DEPRECATED
        // websocketService.connect();
        // websocketService.reconnectIfError();
        //
        // websocketService.addEventListener('simple_message', function (data) {
        //     toastNotificationService.info(data.message)
        // })

    // }

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
app.service('xhrService', ['errorService', 'cookieService', xhrService]);
app.service('broadcastChannelService', [broadcastChannelService]);
app.service('globalDataService', [globalDataService]);
app.service('authorizerService', ['cookieService', 'globalDataService', 'xhrService', authorizerService]);
app.service('middlewareService', [middlewareService]);
app.service('usersService', ['cookieService', 'globalDataService', 'xhrService', usersService]);
app.service('usersGroupService', ['globalDataService', usersGroupService]);
app.service('backendConfigurationImportService', ['cookieService', backendConfigurationImportService]);
app.service('systemMessageService', [systemMessageService]);

app.service('redirectionService', [redirectionService]);
app.service('commonDialogsService', ['$mdDialog', commonDialogsService]);

app.controller('ShellController', ['$scope', '$state', '$transitions', '$urlService', '$uiRouterGlobals', '$mdDialog', 'toastNotificationService', 'cookieService', 'broadcastChannelService', 'middlewareService', 'authorizerService', 'globalDataService', 'redirectionService', shellController]);

app.controller('WarningDialogController', ['$scope', '$mdDialog', 'warning', warningDialogController]);
app.controller('InputsDialogController', ['$scope', '$mdDialog', 'data', inputsDialogController]);

app.directive('dndFilesOnPage', ['$state', 'commonDialogsService', dndFilesOnPageDirective]);


export default app;