/**
 * Created by szhitenev on 02.08.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var timeZonesService = require('../../services/timeZonesService');

    var usersService = require('../../services/usersService');

    module.exports = function ($scope, $state) {

        logService.controller('SettingsGeneralController', 'initialized');

        var vm = this;

        $scope.$state = $state;

        vm.checkProviders = function () {
            return $state.includes('app.settings.general.data-providers') || $state.includes('app.settings.general.data-providers-config')
        }


    };

}());