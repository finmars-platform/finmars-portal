/**
 * Created by szhitenev on 02.08.2016.
 */
(function () {

    'use strict';

    var timeZonesService = require('../../services/timeZonesService');

    var usersService = require('../../services/usersService');

    module.exports = function ($scope, $state) {

        var vm = this;

        $scope.$state = $state;

        vm.checkProviders = function () {
            return $state.includes('app.settings.general.data-providers') || $state.includes('app.settings.general.data-providers-config')
        }


    };

}());