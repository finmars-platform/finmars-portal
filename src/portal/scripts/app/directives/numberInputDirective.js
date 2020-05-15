(function () {

    'use strict';

    var renderHelper = require('../helpers/render.helper');

    module.exports = function ($mdDialog) {

        return {
            restrict: 'E',
            scope: {
                label: '@',
                model: '=',
                onlyPositive: '<',
                numberFormat: '<',
                onChangeCallback: '&?'
            },
            templateUrl: 'views/directives/number-input-view.html',
            link: function (scope, elem, attr) {

                scope.placeholderText = "0";
                scope.error = '';

                var inputContainer = elem[0].querySelector('.numberInputContainer');
                var inputElem = elem[0].querySelector('.numberInputElem');

                // console.log("new inputs numberFormat", scope.numberFormat);
                scope.onValueChange = function () {

                    scope.error = '';
                    var changedValue = scope.numberToShow;

                    if (changedValue === '') {

                        scope.model.value = null;

                    } else if (!isNaN(changedValue) &&
                        changedValue !== null) {

                        if (Number.isInteger(changedValue)) {
                            changedValue = parseInt(changedValue);
                        } else {
                            changedValue = parseFloat(changedValue);
                        }

                        // negative numbers processing

                        if (changedValue < 0) {

                            if (scope.numberFormat && scope.numberFormat.negative_color_format_id === 1) {
                                inputElem.classList.add('red-text');
                            }

                            if (scope.onlyPositive) {
                                scope.error = 'field should have positive number';
                            } else {
                                scope.model.value = JSON.parse(JSON.stringify(changedValue));
                            }

                        } else {

                            inputContainer.classList.remove('custom-input-error');
                            inputElem.classList.remove('red-text');
                            scope.model.value = JSON.parse(JSON.stringify(changedValue));

                        }
                        // < negative numbers processing >

                    } else {

                        scope.error = 'invalid character used';
                        scope.model.value = null;

                    }

                    if (scope.onChangeCallback) {
                        scope.onChangeCallback();
                    }
                }

                var applyNumberFormatToInput = function () {

                    if (scope.numberFormat &&
                        (scope.numberToShow || scope.numberToShow === 0)) {

                        scope.numberToShow = renderHelper.formatValue({
                                                                            value: scope.model.value
                                                                        }, {
                                                                            key: 'value',
                                                                            report_settings: scope.numberFormat
                                                                        });

                        //scope.$apply();
                        // console.log("new inputs formatNumber numberToShow", scope.numberToShow);
                    }

                }

                scope.openCalculatorDialog = function ($event) {

                    var calculatorTitle = "Calculator for: " + scope.label;

                    $mdDialog.show({
                        controller: 'CalculatorDialogController as vm',
                        templateUrl: 'views/dialogs/calculator-dialog-view.html',
                        targetEvent: $event,
                        multiple: true,
                        locals: {
                            data: {
                                numberValue: scope.model.value,
                                calculatorTitle: calculatorTitle
                            }
                        }

                    }).then(function (res) {

                        if (res.status === 'agree') {
                            scope.model.value = res.numberValue;

                            scope.numberToShow = res.numberValue;
                            applyNumberFormatToInput();
                        }

                    });

                };

                var initEventListeners = function () {
                    elem[0].addEventListener('mouseover', function () {
                        inputContainer.classList.add('custom-input-hovered');
                    });

                    elem[0].addEventListener('mouseleave', function () {
                        inputContainer.classList.remove('custom-input-hovered');
                    });

                    inputElem.addEventListener('focus', function () {
                        inputContainer.classList.add('custom-input-focused');

                        if (!scope.error) {
                            scope.numberToShow = JSON.parse(JSON.stringify(scope.model.value));
                            scope.$apply();
                        }
                    });

                    inputElem.addEventListener('blur', function () {
                        inputContainer.classList.remove('custom-input-focused');

                        if (!scope.error) {
                            applyNumberFormatToInput();
                            scope.$apply();
                        }
                    });
                }

                scope.$watch('model', function () {
                    scope.numberToShow = JSON.parse(JSON.stringify(scope.model.value));

                    if (!inputContainer.classList.contains('custom-input-focused')) {
                        applyNumberFormatToInput();
                    }
                })

                initEventListeners();

            }
        }

    }

}());