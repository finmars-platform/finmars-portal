/**
 * Created by vzubr on 01.06.2021.
 */
(function () {

    'use strict';

    var renderHelper = require('../../helpers/render.helper');

    module.exports = function ($scope, $element, $mdDialog, data) {

        var vm = this;

        vm.reportSettings = JSON.parse(JSON.stringify(data.report_settings));

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

        // Negative format in new design view differ from settings structure
        const getNegativeFormat = function (reportSettings) {
            // 0 0 -> 0
            // 0 1 -> 1
            // 1 0 -> 2
            // 1 1 -> 3
            const {negative_format_id, negative_color_format_id} = reportSettings;
            return parseInt('' + negative_format_id + negative_color_format_id, 2)
        };

        vm.onNegativeFormatChange = function () {
            vm.reportSettings.negative_format_id = vm.negativeFormat < 2 ? 0 : 1;
            vm.reportSettings.negative_color_format_id = vm.negativeFormat % 2;
            vm.onNumberFormatChange();
        };

        vm.onNumberFormatChange = function () {
            vm.positiveNumberExample = vm.formatValue(4878.2309);
            vm.zeroExample = vm.formatValue(0);
            vm.negativeNumberExample = vm.formatValue(-9238.1294);

            vm.negativeFormat = getNegativeFormat(vm.reportSettings);
        }

        vm.getPresetName = function () {
            const selectedPreset= vm.presetSelectorData.options.find(it => it.isActive);
            return selectedPreset ? selectedPreset.name : 'Select Preset';
        };

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

        const getNumberFormatByPreset = function (preset) {

            switch(preset) {
                case 'price':
                    return {
                        zero_format_id: 1,
                        negative_color_format_id: 0,
                        negative_format_id : 0,
                        thousands_separator_format_id: 0, // ? Victor this parameter is absent in original
                        round_format_id : 1,
                        percentage_format_id : 0,
                    };
                case 'market_value':
                    return {
                        zero_format_id: 1,
                        negative_color_format_id: 1,
                        negative_format_id : 1,
                        thousands_separator_format_id: 2,
                        round_format_id : 1,
                        percentage_format_id : 0,
                    };
                case 'amount':
                    return {
                        zero_format_id: 1,
                        negative_color_format_id: 1,
                        negative_format_id : 0,
                        thousands_separator_format_id: 2,
                        round_format_id : 3,
                        percentage_format_id : 0,
                    };
                case 'exposure':
                    return {
                        zero_format_id: 1,
                        negative_color_format_id: 1,
                        negative_format_id : 1,
                        thousands_separator_format_id: 0, // ? Victor this parameter is absent in original
                        round_format_id : 0,
                        percentage_format_id : 2,
                    };
                case 'return':
                    return {
                        zero_format_id: 1,
                        negative_color_format_id: 1,
                        negative_format_id : 0,
                        thousands_separator_format_id: 0, // ? Victor this parameter is absent in original
                        round_format_id : 0, // ? Victor this parameter is absent in original
                        percentage_format_id : 3,
                    };

            }
            
        };

        vm.presetSelectorData = {
            options: [
                {id: 'price', name: `Price (0)`, isActive: false},
                {id: 'market_value', name: `Market Value (000'000)`, isActive: false},
                {id: 'amount', name: `Amount (000'000.00)`, isActive: false},
                {id: 'exposure', name: `Exposure (0.0%)`, isActive: false},
                {id: 'return', name: `Return (0.00%)`, isActive: false},
            ],
            selectOption: (option, _$popup) => {

                _$popup.cancel();

                vm.presetSelectorData.options.forEach(it => it.isActive = it === option);

                const preset = option.id;
                vm.reportSettings = getNumberFormatByPreset(preset);

                vm.onNumberFormatChange();

            }
        }

        vm.cancel = function () {

            $mdDialog.hide({status: 'disagree'});

        };

        vm.agree = function () {

            $mdDialog.hide({status: 'agree', data: vm.reportSettings});

        };

        const init = function () {

            vm.negativeFormat = getNegativeFormat(vm.reportSettings);

            vm.onNumberFormatChange();

            const animatedContainers = $element[0].querySelectorAll('.cb1-resizing-wrap');
            setTimeout(() => setContainersHeight(animatedContainers)); // for height animation

        }

        init();
    }

}());