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
    app.controller('CreateMasterUserDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/createMasterUserDialogController')]);

    app.controller('WarningDialogController', ['$scope', '$mdDialog', 'warning', require('./app/controllers/dialogs/createMasterUserDialogController')]);

    require('./templates.min.js');

}());