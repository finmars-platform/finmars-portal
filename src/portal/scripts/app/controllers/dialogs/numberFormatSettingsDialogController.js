/**
 * Created by mevstratov on 09.08.2019
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.settings = data.settings;
        vm.title = data.title;

        if (!vm.settings) {
            vm.settings = {};
        }

        if (!vm.settings.zero_format_id) {
            vm.settings.zero_format_id = 0;
        }

        if (!vm.settings.negative_format_id) {
            vm.settings.negative_format_id = 0;
        }

        if (!vm.settings.negative_color_format_id) {
            vm.settings.negative_color_format_id = 0;
        }

        if (!vm.settings.round_format_id) {
            vm.settings.round_format_id = 0;
        }

        if (!vm.settings.thousands_separator_format_id) {
            vm.settings.thousands_separator_format_id = 0;
        }

        if (!vm.settings.percentage_format_id) {
            vm.settings.percentage_format_id = 0;
        }

        vm.onRoundingChange = function () {
            if (vm.settings.round_format_id !== 0) {
                vm.settings.percentage_format_id = 0;
            }
        };

        vm.onPercentageChange = function () {
            if (vm.settings.percentage_format_id !== 0) {
                vm.settings.round_format_id = 0
            }
        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.save = function () {
            $mdDialog.hide({status: 'agree', data: {settings: vm.settings}});
        };

    };

}());