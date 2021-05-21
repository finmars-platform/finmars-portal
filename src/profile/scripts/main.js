/**
 * Created by sergey on 29.07.16.
 */
'use strict';

(function () {

    let profile = angular.module('finmars.profile', []);

	profile.config(['$stateProvider', require('./app/router.js')]);

	/* profile.run(function () {

    });*/

    profile.controller('NewDatabaseController', ['$scope', '$state', require('./app/controllers/newDatabaseController')]);
    profile.controller('ProfileController', ['$scope', require('./app/controllers/profileController')]);
    profile.controller('ProfileSettingsController', ['$scope', require('./app/controllers/profileSettingsController')]);
    profile.controller('ProfileDatabasesController', ['$scope', '$state', '$mdDialog', require('./app/controllers/profileDatabasesController')]);
    profile.controller('CreateMasterUserDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/createMasterUserDialogController')]);
    profile.controller('CreateMasterUserFromDumpDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/createMasterUserFromDumpDialogController')]);
    profile.controller('CopyMasterUserDialogController', ['$scope', '$mdDialog', '$state', 'data', require('./app/controllers/dialogs/copyMasterUserDialogController')]);

    profile.controller('SecuritySettingsController', ['$scope', '$mdDialog', require('./app/controllers/securitySettingsController')]);
    profile.controller('TwoFactorSetupDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/twoFactorSetupDialogController')]);

    profile.controller('WarningDialogController', ['$scope', '$mdDialog', 'warning', require('./app/controllers/dialogs/createMasterUserDialogController')]);
    profile.controller('ProfileInfoDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/infoDialogController')]);
    profile.controller('DeleteMasterUserDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/deleteMasterUserDialogController')]);
    profile.controller('RenameMasterUserDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/renameMasterUserDialogController')]);

    // require('./templates.min.js');

})();