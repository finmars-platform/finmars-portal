/**
 * Created by sergey on 29.07.16.
 */
'use strict';

import profileRouter from './app/router.js';

import profileController from './app/controllers/profileController.js';

export default (function () {

    let profile = angular.module('finmars.profile', []);

	profile.config(['$stateProvider', profileRouter]);

	/* profile.run(function () {

    });*/

    profile.controller('NewDatabaseController', ['$scope', '$state', require('./app/controllers/newDatabaseController')]);
    profile.controller('ProfileController', ['$scope', '$mdDialog', 'authorizerService', 'globalDataService', profileController]);
    profile.controller('ProfileSettingsController', ['$scope', 'authorizerService', require('./app/controllers/profileSettingsController')]);
    profile.controller('ProfileDatabasesController', ['$scope', '$state', '$mdDialog', 'usersService', require('./app/controllers/profileDatabasesController')]);
    profile.controller('CreateMasterUserDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/createMasterUserDialogController')]);
    profile.controller('CreateMasterUserFromDumpDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/createMasterUserFromDumpDialogController')]);
    profile.controller('CopyMasterUserDialogController', ['$scope', '$mdDialog', '$state', 'data', require('./app/controllers/dialogs/copyMasterUserDialogController')]);

    profile.controller('SecuritySettingsController', ['$scope', '$mdDialog', 'authorizerService', require('./app/controllers/securitySettingsController')]);
    profile.controller('TwoFactorSetupDialogController', ['$scope', '$mdDialog', 'data', 'authorizerService', require('./app/controllers/dialogs/twoFactorSetupDialogController')]);

    profile.controller('WarningDialogController', ['$scope', '$mdDialog', 'warning', require('./app/controllers/dialogs/createMasterUserDialogController')]);
    profile.controller('ProfileInfoDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/infoDialogController')]);
    profile.controller('DeleteMasterUserDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/deleteMasterUserDialogController')]);
    profile.controller('RenameMasterUserDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/renameMasterUserDialogController')]);

    // require('./templates.min.js');

})();