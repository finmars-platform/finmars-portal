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

        if (!vm.reportSettings.number_multiplier) {
            vm.reportSettings.number_multiplier = null;
        }

        if (!vm.reportSettings.number_suffix) {
            vm.reportSettings.number_suffix = "";
        }

        if (!vm.reportSettings.number_prefix) {
            vm.reportSettings.number_prefix = "";
        }

        vm.onRoundingChange = function () {
            if (vm.reportSettings.round_format_id !== 0) {
                vm.reportSettings.percentage_format_id = 0;

                vm.reportSettings.number_multiplier = null;
                vm.reportSettings.number_suffix = "";
                vm.reportSettings.number_prefix = "";
            }
        };

        vm.onPercentageChange = function () {
            if (vm.reportSettings.percentage_format_id !== 0) {
                vm.reportSettings.round_format_id = 0;
            } else {
                vm.reportSettings.number_multiplier = null;
                vm.reportSettings.number_suffix = "";
                vm.reportSettings.number_prefix = "";
            }

            if (vm.reportSettings.percentage_format_id > 0 &&
                vm.reportSettings.percentage_format_id < 4) {
                vm.reportSettings.number_multiplier = 100;
                vm.reportSettings.number_suffix = "%";
                vm.reportSettings.number_prefix = "";
            }

            if (vm.reportSettings.percentage_format_id > 3) {
                vm.reportSettings.number_multiplier = 10000;
                vm.reportSettings.number_suffix = "bps";
                vm.reportSettings.number_prefix = "";
            }
        };

        vm.onInputsChange = function () {

            if (vm.reportSettings.number_multiplier === 100 &&
                vm.reportSettings.number_prefix === "" &&
                vm.reportSettings.number_suffix === "%") {

                vm.reportSettings.percentage_format_id = 1;

            } else if (vm.reportSettings.number_multiplier === 10000 &&
                       vm.reportSettings.number_prefix === "" &&
                       vm.reportSettings.number_suffix === "bps") {

                vm.reportSettings.percentage_format_id = 4;

            } else {
                vm.reportSettings.percentage_format_id = 0;
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