/**
 * Created by mevstratov on 09.08.2019
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.reportSettings = data.column.report_settings;

        if (!vm.reportSettings) {
            vm.reportSettings = {};
        };

        vm.selectZeroFormat = function (type) {

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

        };

        vm.cancel = function () {
            $mdDialog.hide();
        };

        vm.save = function () {
            $mdDialog.hide({status: 'agree', data: {report_settings: vm.reportSettings}});
        };

    };

}());