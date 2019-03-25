/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var uiService = require('../services/uiService');

    var configurationImportService = require('../services/configuration-import/configurationImportService');

    module.exports = function ($scope, $state) {

        var vm = this;

        vm.readyStatus = {content: false};

        vm.getList = function () {

            vm.readyStatus.content = false;

            uiService.getConfigurationList().then(function (data) {

                vm.items = data.results;

                vm.readyStatus.content = true;

            })

        };

        vm.applyItem = function ($event, item) {

            var items = item.data.body;

            configurationImportService.importConfiguration(items).then(function () {

                $state.go('app.home');
            })


        };

        vm.ownSetup = function () {
            $state.go('app.home');
        };

        vm.init = function () {

            vm.getList();

        };

        vm.init();

    }

}());