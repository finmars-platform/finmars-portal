/**
 * Created by mevstratov on 09.08.2019
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.reportSettings = data.column.report_settings;
        vm.modalName = data.column.name;

        if (data.column.layout_name) {
            vm.modalName = data.column.layout_name;
        }

        if (!vm.reportSettings) {
            vm.reportSettings = {};
        }

        if (!vm.reportSettings.zero_format_id) {
            vm.reportSettings.zero_format_id = 0;
        }

        if (!vm.reportSettings.negative_format_id) {
            vm.reportSettings.negative_format_id = 0;
        }

        if (!vm.reportSettings.negative_color_format_id) {
            vm.reportSettings.negative_color_format_id = 0;
        }

        if (!vm.reportSettings.round_format_id) {
            vm.reportSettings.round_format_id = 0;
        }

        if (!vm.reportSettings.thousands_separator_format_id) {
            vm.reportSettings.thousands_separator_format_id = 0;
        }

        if (!vm.reportSettings.percentage_format_id) {
            vm.reportSettings.percentage_format_id = 0;
        }

        vm.onRoundingChange = function () {
            if (vm.reportSettings.round_format_id !== 0) {
                vm.reportSettings.percentage_format_id = 0;
            }
        };

        vm.onPercentageChange = function () {
            if (vm.reportSettings.percentage_format_id !== 0) {
                vm.reportSettings.round_format_id = 0
            }
        };

        /*vm.selectZeroFormat = function (type) {

            if (vm.reportSettings.zero_format_id === type) {
                vm.reportSettings.zero_format_id = null;
            } else {
                vm.reportSettings.zero_format_id = type;
            };

        };

        vm.selectNegativeColor = function (type) {

            if (vm.reportSettings.negative_color_format_id === type) {
                vm.reportSettings.negative_color_format_id = null;
            } else {
                vm.reportSettings.negative_color_format_id = type;
            };

        };

        vm.selectNegativeFormat = function (type) {

            if (vm.reportSettings.negative_format_id === type) {
                vm.reportSettings.netgative_format_id = null;
            } else {
                vm.reportSettings.negative_format_id = type;
            };

        };

        vm.selectRoundFormat = function (type) {

            if (vm.reportSettings.round_format_id === type) {
                vm.reportSettings.round_format_id = null;
            } else {
                vm.reportSettings.round_format_id = type;
            };

        };

        vm.selectThousandsSeparatorFormat = function (type) {

            if (vm.reportSettings.thousands_separator_format_id === type) {
                vm.reportSettings.thousands_separator_format_id = null;
            } else {
                vm.reportSettings.thousands_separator_format_id = type;
            };

        };

        vm.selectPercentageFormat = function (type) {

            if (vm.reportSettings.percentage_format_id === type) {
                vm.reportSettings.percentage_format_id = null;
            } else {
                vm.reportSettings.percentage_format_id = type;
            };

        };*/

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.save = function () {
            $mdDialog.hide({status: 'agree', data: {report_settings: vm.reportSettings}});
        };

    };

}());