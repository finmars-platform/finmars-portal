(function () {

    'use strict';

    var renderHelper = require('../helpers/render.helper');

    module.exports = function ($mdDialog) {

        return {
            restrict: 'E',
            scope: {
                label: '@',
                model: '=',
                numberFormat: '<',
                customButtons: '=',
                customStyles: '<',
                setedFromOutside: '=',
                smallOptions: '<',
                onChangeCallback: '&?'
            },
            templateUrl: 'views/directives/number-input-view.html',
            link: function (scope, elem, attr) {

                scope.placeholderText = "0";
                scope.error = '';
                scope.tooltipText = 'Tooltip text';

                // TIPS
                // scope.smallOptions probable properties
                    // onlyPositive: whether field should accept only positive number
                    // tooltipText: custom tolltip text
                    // notNull: turn on error mode if field is not filled

                if (scope.smallOptions) {
                    scope.onlyPositive = scope.smallOptions.onlyPositive;

                    if (scope.smallOptions.tooltipText) {
                        scope.tooltipText = scope.smallOptions.tooltipText;
                    }
                }
                console.log("new inputs smallOptions", scope.smallOptions);
                var inputContainer = elem[0].querySelector('.numberInputContainer');
                var inputElem = elem[0].querySelector('.numberInputElem');

                scope.getInputContainerClasses = function () {
                    var classes = '';

                    if (scope.error) {
                        classes = 'custom-input-error';

                    } else if (scope.setedFromOutside) {

                        if (scope.setedFromOutside === 'input') {
                            classes = 'custom-input-preset1';

                        } else if (scope.setedFromOutside === 'linked_inputs') {
                            classes = 'custom-input-preset2';
                        }

                    } else if (scope.valueIsValid) {
                        classes = 'custom-input-is-valid';
                    }

                    return classes;
                };

                scope.onValueChange = function () {

                    if (scope.setedFromOutside) {
                        scope.setedFromOutside = false;
                    }

                    scope.error = '';
                    scope.valueIsValid = false;
                    var changedValue = scope.numberToShow;

                    if (changedValue === '') {

                        scope.model = null;

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
                                scope.model = null;

                            } else {

                                scope.model = JSON.parse(JSON.stringify(changedValue));

                            }

                        } else {

                            inputContainer.classList.remove('custom-input-error');
                            inputElem.classList.remove('red-text');
                            scope.model = JSON.parse(JSON.stringify(changedValue));

                        }
                        // < negative numbers processing >

                    } else {

                        scope.error = 'Invalid character used';
                        scope.model = null;

                    }

                    if ((scope.model || scope.model === 0) && !scope.error) {
                        scope.valueIsValid = true;
                    }

                    if (scope.onChangeCallback) {

                        setTimeout(function () {
                            scope.onChangeCallback();
                        }, 0);

                    }
                }

                var applyNumberFormatToInput = function () {

                    if (scope.numberFormat &&
                        (scope.numberToShow || scope.numberToShow === 0)) {

                        scope.numberToShow = renderHelper.formatValue({
                                                                            value: scope.model
                                                                        }, {
                                                                            key: 'value',
                                                                            report_settings: scope.numberFormat
                                                                        });

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
                                numberValue: scope.model,
                                calculatorTitle: calculatorTitle
                            }
                        }

                    }).then(function (res) {

                        if (res.status === 'agree') {
                            scope.model = res.numberValue;

                            scope.numberToShow = res.numberValue;
                            applyNumberFormatToInput();
                        }

                    });

                };

                scope.callFnForCustomBtn = function (actionData) {

                    if (actionData.parameters) {
                        actionData.callback(actionData.parameters);
                    } else {
                        actionData.callback();
                    }

                };

                var applyCustomStyles = function () {

                    Object.keys(scope.customStyles).forEach(function (className) {

                        var elemClass = '.' + className;
                        var elemToApplyStyles = elem[0].querySelector(elemClass);

                        elemToApplyStyles.style.cssText = scope.customStyles[className];

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
                            scope.numberToShow = JSON.parse(JSON.stringify(scope.model));
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
                };

                var init = function () {

                    initEventListeners();

                    if (scope.numberFormat) {

                        switch (scope.numberFormat.round_format_id) {
                            case 0:
                            case 1:
                                scope.placeholderText = "0"
                                break;

                            case 2:
                                scope.placeholderText = "0.0"
                                break;

                            case 3:
                                scope.placeholderText = "0.00"
                                break;

                            case 4:
                                scope.placeholderText = "0.0000"
                                break;
                        }

                        if (scope.numberFormat.number_prefix) {
                            scope.placeholderText  = scope.numberFormat.number_prefix + scope.placeholderText;
                        }

                        if (scope.numberFormat.number_suffix) {
                            scope.placeholderText = scope.placeholderText + scope.numberFormat.number_suffix;
                        }

                    }

                    if (scope.customStyles) {
                        applyCustomStyles();
                    }

                };

                scope.$watch('model', function () {

                    if (scope.model || scope.model === 0) {

                        if (!isNaN(scope.model)) {
                            scope.valueIsValid = true;
                        } else {
                            scope.error = 'Invalid character used';
                        }

                        scope.numberToShow = JSON.parse(JSON.stringify(scope.model));

                        if (!inputContainer.classList.contains('custom-input-focused')) {
                            applyNumberFormatToInput();
                        }

                    }

                })

                init();

            }
        }

    }

}());