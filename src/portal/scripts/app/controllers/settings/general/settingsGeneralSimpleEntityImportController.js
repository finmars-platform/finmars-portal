/**
 * Created by mevstratov on 02.05.2019.
 */
(function () {

    'use strict';

    var csvImportSchemeService = require('../../../services/import/csvImportSchemeService');

    module.exports = function ($scope) {

        var vm = this;

        vm.entityType = 'csv-import-scheme';
        vm.contentType = 'csv_import.csvimportscheme';
        vm.entityRaw = [];

        vm.readyStatus = {content: false};

        vm.entityViewer = {extraFeatures: []};

        vm.getList = function (options) {
            return csvImportSchemeService.getList(options).then(function (data) {
                return data;
            })
        };

        vm.init = function () {
            vm.readyStatus.content = true
        };

        vm.init()

    }

}());