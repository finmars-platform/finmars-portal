import profileSettingsController from "./app/controllers/profileSettingsController";
import profileDatabasesController from "./app/controllers/profileDatabasesController";
import profileBackupsController from "./app/controllers/profileBackupsController";
import createMasterUserDialogController from "./app/controllers/dialogs/createMasterUserDialogController";
import createMasterUserFromDumpDialogController from "./app/controllers/dialogs/createMasterUserFromDumpDialogController";
import copyMasterUserDialogController from "./app/controllers/dialogs/copyMasterUserDialogController";
import securitySettingsController from "./app/controllers/securitySettingsController";
import apiSettingsController from "./app/controllers/apiSettingsController";
import twoFactorSetupDialogController from "./app/controllers/dialogs/twoFactorSetupDialogController";
import infoDialogController from "./app/controllers/dialogs/infoDialogController";
import deleteMasterUserDialogController from "./app/controllers/dialogs/deleteMasterUserDialogController";
import renameMasterUserDialogController from "./app/controllers/dialogs/renameMasterUserDialogController";
import restoreMasterUserFromBackupDialogController from "./app/controllers/dialogs/restoreMasterUserFromBackupDialogController";
import rollbackMasterUserFromBackupDialogController from "./app/controllers/dialogs/rollbackMasterUserFromBackupDialogController";
import deleteMasterUserBackupDialogController from "./app/controllers/dialogs/deleteMasterUserBackupDialogController";
import renameMasterUserBackupDialogController from "./app/controllers/dialogs/renameMasterUserBackupDialogController";
/**
 * Created by sergey on 29.07.16.
 */
'use strict';

import profileRouter from "./app/router.js";

import profileAuthorizerService from "./app/services/authorizerService"; // inside for creation of database

import profileController from "./app/controllers/profileController.js";

// noinspection JSVoidFunctionReturnValueUsed
export default function () {

    let profile = angular.module('finmars.profile', []);
    profile.config(['$stateProvider', profileRouter]);

	 /* profile.run(function () {

    });*/

	 profile.service('profileAuthorizerService', ['xhrService', 'cookieService', profileAuthorizerService]);

    // profile.controller('NewDatabaseController', ['$scope', '$state', 'profileAuthorizerService', require('./app/controllers/newDatabaseController')]);
    profile.controller('ProfileController', ['$scope', 'authorizerService', 'globalDataService', 'redirectionService', profileController]);
    profile.controller('ProfileSettingsController', ['$scope', 'globalDataService', profileSettingsController]);
    profile.controller('ProfileDatabasesController', ['$scope', '$state', '$mdDialog', '$urlService', 'profileAuthorizerService', 'broadcastChannelService', 'commonDialogsService',  'globalDataService', 'redirectionService', profileDatabasesController]);
    profile.controller('ProfileBackupsController', ['$scope', '$state', '$mdDialog', 'redirectionService', profileBackupsController]);
    profile.controller('CreateMasterUserDialogController', ['$scope', '$mdDialog', 'data', 'profileAuthorizerService', createMasterUserDialogController]);
    profile.controller('CreateMasterUserFromDumpDialogController', ['$scope', '$mdDialog', 'data', 'profileAuthorizerService', createMasterUserFromDumpDialogController]);
    profile.controller('CopyMasterUserDialogController', ['$scope', '$mdDialog', '$state', 'redirectionService', 'data', 'profileAuthorizerService', copyMasterUserDialogController]);

    profile.controller('SecuritySettingsController', ['$scope', '$mdDialog', 'authorizerService', 'globalDataService', 'commonDialogsService', securitySettingsController]);
    profile.controller('APISettingsController', ['$scope', '$mdDialog', 'authorizerService', 'globalDataService', 'commonDialogsService', 'profileAuthorizerService', 'cookieService',  apiSettingsController]);
    profile.controller('TwoFactorSetupDialogController', ['$scope', '$mdDialog', 'data', 'globalDataService', twoFactorSetupDialogController]);

    profile.controller('WarningDialogController', ['$scope', '$mdDialog', 'warning', createMasterUserDialogController]);
    profile.controller('ProfileInfoDialogController', ['$scope', '$mdDialog', 'data', infoDialogController]);
    profile.controller('DeleteMasterUserDialogController', ['$scope', '$mdDialog', 'data', 'toastNotificationService', 'profileAuthorizerService', 'commonDialogsService', deleteMasterUserDialogController]);
    profile.controller('RenameMasterUserDialogController', ['$scope', '$mdDialog', 'data', 'toastNotificationService', 'profileAuthorizerService', renameMasterUserDialogController]);

    profile.controller('RestoreMasterUserFromBackupDialogController', ['$scope', '$mdDialog', 'data', restoreMasterUserFromBackupDialogController]);
    profile.controller('RollbackMasterUserFromBackupDialogController', ['$scope', '$mdDialog', 'commonDialogsService', 'data', rollbackMasterUserFromBackupDialogController]);
    profile.controller('DeleteMasterUserBackupDialogController', ['$scope', '$mdDialog', 'data', 'toastNotificationService', 'profileAuthorizerService', 'commonDialogsService', deleteMasterUserBackupDialogController]);
    profile.controller('RenameMasterUserBackupDialogController', ['$scope', '$mdDialog', 'data', 'toastNotificationService', 'profileAuthorizerService', renameMasterUserBackupDialogController]);

    // require('./templates.min.js');

}