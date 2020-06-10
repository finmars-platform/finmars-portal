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
                //setedFromOutside: '=',
                eventSignal: '=',
                smallOptions: '<',
                onChangeCallback: '&?'
            },
            templateUrl: 'views/directives/number-input-view.html',
            link: function (scope, elem, attr) {

                scope.placeholderText = "0";
                scope.error = '';
                scope.tooltipText = 'Tooltip text';

                var inputLoaded = false;  // prevents not null inputs highlight from start
                var stylePreset;

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

                var inputContainer = elem[0].querySelector('.numberInputContainer');
                var inputElem = elem[0].querySelector('.numberInputElem');

                scope.getInputContainerClasses = function () {
                    var classes = '';

                    if (scope.error) {
                        classes = 'custom-input-error';

                    } else if (stylePreset) {
                        classes = 'custom-input-preset' + stylePreset;

                    } else if (scope.valueIsValid) {
                        classes = 'custom-input-is-valid';
                    }

                    return classes;
                };

                scope.onValueChange = function () {

                    scope.setedFromOutside = false;

                    scope.error = '';
                    stylePreset = '';
                    scope.valueIsValid = false;

                    var changedValue = scope.numberToShow;

                    if (changedValue === '') {

                        scope.model = null;

                        if (scope.smallOptions && scope.smallOptions.notNull) {
                            scope.error = 'Field should not be null';
                        }

                        if (scope.smallOptions && scope.smallOptions.onlyPositive) {
                            scope.error = 'Field should have positive number';
                        }

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

                                scope.error = 'Field should have positive number';
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

                        if (elemToApplyStyles) {
                            elemToApplyStyles.style.cssText = scope.customStyles[className];
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

                        if (!scope.error && (scope.model || scope.model === 0)) {
                            scope.numberToShow = JSON.parse(JSON.stringify(scope.model));
                            scope.$apply();
                        }
                    });

                    inputElem.addEventListener('blur', function () {
                        inputContainer.classList.remove('custom-input-focused');

                        setTimeout(function () { // without timeout changes will be discarded on fast blur

                            if (!scope.error && (scope.model || scope.model === 0)) {
                                applyNumberFormatToInput();
                                scope.$apply();
                            }

                        }, 250);

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

                    /*if (scope.smallOptions && scope.smallOptions.notNull &&
                        !scope.numberToShow && scope.numberToShow !== 0) {

                        scope.error = 'Field should not be null';

                    }*/

                };

                scope.$watch('model', function () {

                    if (scope.model || scope.model === 0) {

                        scope.error = '';

                        if (isNaN(scope.model)) {
                            scope.error = 'Invalid character used';
                        }

                        scope.numberToShow = JSON.parse(JSON.stringify(scope.model));

                        if (!inputContainer.classList.contains('custom-input-focused')) {
                            applyNumberFormatToInput();
                        }

                    } else if (!scope.numberToShow && scope.numberToShow !== 0 && inputLoaded) {

                        if (scope.smallOptions && scope.smallOptions.notNull) {
                            scope.error = 'Field should not be null';
                        }

                    }

                    inputLoaded = true;

                })

                init();

                if (scope.eventSignal) { // this if prevents watcher below from running without need

                    scope.$watch('eventSignal', function () {

                        if (scope.eventSignal && scope.eventSignal.key) {

                            switch (scope.eventSignal.key) {
                                case 'mark_not_valid_fields':

                                    if (scope.smallOptions && !scope.numberToShow && scope.numberToShow !== 0) {

                                        if (scope.smallOptions.notNull) {
                                            scope.error = 'Field should not be null';

                                        } else if (scope.onlyPositive) {
                                            scope.error = 'field should have positive number';

                                        }

                                    }

                                    break;

                                case 'set_style_preset1':
                                    stylePreset = 1;
                                    break;

                                case 'set_style_preset2':
                                    stylePreset = 2;
                                    break;
                            }

                            scope.eventSignal = {};

                        }

                    });

                }

            }
        }

    }

}());