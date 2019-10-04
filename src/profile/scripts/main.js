/**
 * Created by sergey on 29.07.16.
 */
'use strict';

(function () {

    var app = angular.module('profile', []);

    app.config(['$stateProvider', require('./app/router.js')]);

    app.run(function () {

    });

    app.controller('ProfileController', ['$scope', require('./app/controllers/profileController')]);
    app.controller('ProfileSettingsController', ['$scope', require('./app/controllers/profileSettingsController')]);
    app.controller('ProfileDatabasesController', ['$scope', '$state', '$mdDialog', require('./app/controllers/profileDatabasesController')]);
    app.controller('CreateMasterUserDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/createMasterUserDialogController')]);

    app.controller('WarningDialogController', ['$scope', '$mdDialog', 'warning', require('./app/controllers/dialogs/createMasterUserDialogController')]);
    app.controller('ProfileInfoDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/infoDialogController')]);
    app.controller('DeleteMasterUserDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/deleteMasterUserDialogController')]);

    require('./templates.min.js');

}());