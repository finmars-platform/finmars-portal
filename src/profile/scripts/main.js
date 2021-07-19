/**
 * Created by sergey on 29.07.16.
 */
'use strict';

import profileRouter from './app/router.js';

import profileAuthorizerService from './app/services/authorizerService'; // inside for creation of database

import profileController from './app/controllers/profileController.js';

// noinspection JSVoidFunctionReturnValueUsed
export default (function () {

    let profile = angular.module('finmars.profile', []);

	profile.config(['$stateProvider', profileRouter]);

	/* profile.run(function () {

    });*/

	profile.service('profileAuthorizerService', ['xhrService', 'cookieService', profileAuthorizerService]);

    profile.controller('NewDatabaseController', ['$scope', '$state', 'profileAuthorizerService', require('./app/controllers/newDatabaseController')]);
    profile.controller('ProfileController', ['$scope', 'authorizerService', 'globalDataService', profileController]);
    profile.controller('ProfileSettingsController', ['$scope', 'globalDataService', require('./app/controllers/profileSettingsController')]);
    profile.controller('ProfileDatabasesController', ['$scope', '$state', '$mdDialog', 'profileAuthorizerService', 'broadcastChannelService', 'commonDialogsService', require('./app/controllers/profileDatabasesController')]);
    profile.controller('CreateMasterUserDialogController', ['$scope', '$mdDialog', 'data', 'profileAuthorizerService', require('./app/controllers/dialogs/createMasterUserDialogController')]);
    profile.controller('CreateMasterUserFromDumpDialogController', ['$scope', '$mdDialog', 'data', 'profileAuthorizerService', require('./app/controllers/dialogs/createMasterUserFromDumpDialogController')]);
    profile.controller('CopyMasterUserDialogController', ['$scope', '$mdDialog', '$state', 'data', 'profileAuthorizerService', require('./app/controllers/dialogs/copyMasterUserDialogController')]);

    profile.controller('SecuritySettingsController', ['$scope', '$mdDialog', 'authorizerService', 'globalDataService', 'commonDialogsService', require('./app/controllers/securitySettingsController')]);
    profile.controller('TwoFactorSetupDialogController', ['$scope', '$mdDialog', 'data', 'globalDataService', require('./app/controllers/dialogs/twoFactorSetupDialogController')]);

    profile.controller('WarningDialogController', ['$scope', '$mdDialog', 'warning', require('./app/controllers/dialogs/createMasterUserDialogController')]);
    profile.controller('ProfileInfoDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/infoDialogController')]);
    profile.controller('DeleteMasterUserDialogController', ['$scope', '$mdDialog', 'data', 'toastNotificationService', 'profileAuthorizerService', 'commonDialogsService', require('./app/controllers/dialogs/deleteMasterUserDialogController')]);
    profile.controller('RenameMasterUserDialogController', ['$scope', '$mdDialog', 'data', 'toastNotificationService', 'profileAuthorizerService', require('./app/controllers/dialogs/renameMasterUserDialogController')]);

    // require('./templates.min.js');

})();