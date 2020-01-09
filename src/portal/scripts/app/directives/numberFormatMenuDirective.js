(function () {

    'use strict';

    module.exports = function ($mdDialog) {
        return {
            restriction: 'E',
            templateUrl: 'views/directives/number-format-menu-view.html',
            scope: {
                formatSettings: '=',
                buttonName: '@',
                buttonClasses: '@'
            },
            link: function (scope, elem, attr) {

                if (!scope.numberFormatSettings) {
                    scope.numberFormatSettings = {}
                }

                scope.getButtonClasses = function () {
                    return scope.buttonClasses;
                };

                scope.setNumberFormatPreset = function (preset) {

                    switch (preset) {

                        case 'price':
                            scope.numberFormatSettings.zero_format_id = 1;
                            scope.numberFormatSettings.negative_color_format_id = 0;
                            scope.numberFormatSettings.negative_format_id = 0;
                            scope.numberFormatSettings.round_format_id = 1;
                            scope.numberFormatSettings.percentage_format_id = 0;
                            break;
                        case 'market_value':
                            scope.numberFormatSettings.zero_format_id = 1;
                            scope.numberFormatSettings.negative_color_format_id = 1;
                            scope.numberFormatSettings.negative_format_id = 1;
                            scope.numberFormatSettings.thousands_separator_format_id = 2;
                            scope.numberFormatSettings.round_format_id = 1;
                            scope.numberFormatSettings.percentage_format_id = 0;
                            break;
                        case 'amount':
                            scope.numberFormatSettings.zero_format_id = 1;
                            scope.numberFormatSettings.negative_color_format_id = 1;
                            scope.numberFormatSettings.negative_format_id = 0;
                            scope.numberFormatSettings.thousands_separator_format_id = 2;
                            scope.numberFormatSettings.round_format_id = 3;
                            scope.numberFormatSettings.percentage_format_id = 0;
                            break;
                        case 'exposure':
                            scope.numberFormatSettings.zero_format_id = 1;
                            scope.numberFormatSettings.negative_color_format_id = 1;
                            scope.numberFormatSettings.negative_format_id = 1;
                            scope.numberFormatSettings.round_format_id = 0;
                            scope.numberFormatSettings.percentage_format_id = 2;
                            break;
                        case 'return':
                            scope.numberFormatSettings.zero_format_id = 1;
                            scope.numberFormatSettings.negative_color_format_id = 1;
                            scope.numberFormatSettings.negative_format_id = 0;
                            scope.numberFormatSettings.percentage_format_id = 3;
                            break;
                    }

                };

                scope.openNumberFormatSettings = function($event) {

                    $mdDialog.show({
                        controller: 'NumberFormatSettingsDialogController as vm',
                        templateUrl: 'views/dialogs/number-format-settings-dialog-view.html',
                        targetEvent: $event,
                        multiple: true,
                        locals: {
                            data: {
                                settings: scope.numberFormatSettings
                            }
                        }

                    }).then(function (res) {

                        if (res.status === 'agree') {
                            scope.formatSettings = res.data.settings;
                        }

                    });

                };

            }
        }
    }
}());