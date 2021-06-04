/**
 * Created by vzubr on 01.06.2021.
 */
(function () {

    'use strict';

    var renderHelper = require('../../helpers/render.helper');

    module.exports = function ($scope, $element, $mdDialog, data) {

        var vm = this;

        vm.data = data;
        vm.reportSettings = JSON.parse(JSON.stringify(data.report_settings));
        console.log('#115 vm.reportSetting', vm.reportSettings)

        vm.zeroFormats = [
            {id: 0, name: '0'},
            {id: 1, name: '-'},
            {id: 2, name: '(empty)'},
        ];

        vm.negativeFormats = [
            {id: 0, name: '-100', color: 'black'},
            {id: 1, name: '-100', color: 'red'},
            {id: 2, name: '(100)', color: 'black'},
            {id: 3, name: '(100)', color: 'red'},
        ];

        vm.separationFormats = [
            {id: 0, name: 'No separation'},
            {id: 1, name: 'Space'},
            {id: 2, name: 'Apostrophe'},
        ];

        vm.percentageFormats = [
            {id: 0, name: 'N/A'},
            {id: 1, name: '0%'},
            {id: 2, name: '0.0%'},
            {id: 3, name: '0.00%'},
            {id: 4, name: '0 bps'},
            {id: 5, name: '0.0 bps'},
        ];

        const getNegativeFormat = function (reportSettings) {
            const {negative_format_id, negative_color_format_id} = reportSettings;
            return negative_format_id + negative_color_format_id;
        };

        vm.negativeFormat = getNegativeFormat(vm.reportSettings);

        vm.onNegativeFormatChange = function () {
            vm.reportSettings.negative_format_id = vm.negativeFormat < 2 ? 0 : 1;
            vm.reportSettings.negative_color_format_id = vm.negativeFormat % 2;
            vm.onNumberFormatChange();
        };

        vm.onNumberFormatChange = function () {
            vm.positiveNumberExample = vm.formatValue(4878.2309);
            vm.zeroExample = vm.formatValue(0);
            vm.negativeNumberExample = vm.formatValue(-9238.1294);
        }

        vm.getZeroName = function () {
            return vm.zeroFormats[vm.reportSettings.zero_format_id].name;
        };

        vm.getNegativeName = function () {
            return vm.negativeFormats[vm.negativeFormat].name;
        };

        vm.getRoundingName = function () {
            return vm.reportSettings.round_format_id === 0 ? 'No rounding' : vm.formatRounding(0)
        };

        vm.getSeparationName = function () {
            return vm.separationFormats[vm.reportSettings.thousands_separator_format_id].name;
        };

        vm.getPercentageName = function () {
            return vm.percentageFormats[vm.reportSettings.percentage_format_id].name;
        };

        const setContainersHeight = function (containers) { // for collapse animation

            containers.forEach(container => {

                const contentElement = container.querySelector('.ALS-layout-group-container');

                if(contentElement) {

                    container.style.height = contentElement.clientHeight + 'px';

                }

            })

        };

        vm.formatRounding = value => renderHelper.formatRounding(value, {report_settings: vm.reportSettings});
        vm.formatValue = value => renderHelper.formatValue({example: value}, {key: 'example', report_settings: vm.reportSettings});

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            $mdDialog.hide({status: 'agree', data: vm.reportSettings});
        };

        const init = () => {

            vm.onNumberFormatChange();

            const animatedContainers = $element[0].querySelectorAll('.cb1-resizing-wrap');
            setTimeout(() => setContainersHeight(animatedContainers));

        }

        init();
    }

}());