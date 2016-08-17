/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var metaService = require('../../services/metaService');

    module.exports = function ($scope, $mdDialog) {

        logService.controller('InstrumentMappingDialogController', 'initialized');

        var vm = this;

        vm.baseAttrs = metaService.getBaseAttrs();
        vm.entityAttrs = metaService.getEntityAttrs("instrument-scheme");

        vm.mapFields = [
            {
                key: 'name',
                caption: 'Name',
                required: true,
                expression: ''
            },
            {
                key: 'user_code',
                caption: 'User code',
                required: true,
                expression: ''
            },
            {
                key: 'instrument_type',
                caption: 'Instrument type',
                required: true,
                expression: ''
            },
            {
                key: 'reference_for_pricing',
                caption: 'Reference for pricing',
                required: true,
                expression: ''
            },
            {
                key: 'short_name',
                caption: 'Short name',
                required: true,
                expression: ''
            },
            {
                key: 'public_name',
                caption: 'Public name',
                required: true,
                expression: ''
            }
        ]

    };

}());