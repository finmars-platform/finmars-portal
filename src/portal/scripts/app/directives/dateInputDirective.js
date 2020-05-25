(function () {

    'use strict';

    module.exports = function () {

        return {
            restrict: 'E',
            scope: {
                label: '@',
                model: '=',
                customButtons: '=',
                customStyles: '<',
                elemsStyles: '<',
                smallOptions: '=',
                onChangeCallback: '&?'
            },
            templateUrl: 'views/directives/date-input-view.html',
            link: function (scope, elem, attr) {

                scope.error = '';
                scope.placeholderText = 'dd-mm-yyyy';
                scope.dateValue = ''; // prevents from calling on change method when date changed to the same date
                scope.tooltipText = 'Tooltip text';

                var inputContainer = elem[0].querySelector('.numberInputContainer');
                var inputElem = elem[0].querySelector('.numberInputElem');

                var doNotShowDatepicker = true; // used to prevent datepicker show on click
                var position = 'right';
                var defaultDate = false;

                if (scope.smallOptions) {
                    if (scope.smallOptions.tooltipText) {
                        scope.tooltipText = scope.smallOptions.tooltipText;
                    }

                    if (scope.smallOptions.position) {
                        position = scope.position;
                    }

                    if (scope.smallOptions.defaultDate) {
                        defaultDate = scope.defaultDate;
                    }
                }

                var onDateBlur = function () {

                    scope.error = '';

                    if (scope.dateValue) {

                        if (scope.dateValue !== scope.model) {

                            if (moment(scope.dateValue, 'YYYY-MM-DD', true).isValid()) {

                                if (scope.model !== scope.dateValue) {
                                    scope.model = JSON.parse(JSON.stringify(scope.dateValue));
                                }

                            } else {

                                scope.error = 'Date has wrong format. Use one of these formats instead: YYYY-MM-DD.';
                                scope.model = null;

                            }

                            if (scope.onChangeCallback) {

                                setTimeout(function () {
                                    scope.onChangeCallback();
                                }, 0);

                            }

                        }

                    } else if (scope.dateValue !== scope.model) {
                        scope.model = JSON.parse(JSON.stringify(scope.dateValue));

                        if (scope.onChangeCallback) {
                            setTimeout(function () {
                                scope.onChangeCallback();
                            }, 0);
                        }
                    }

                }

                scope.callFnForCustomBtn = function (actionData) {

                    if (actionData.parameters) {
                        actionData.callback(actionData.parameters);
                    } else {
                        actionData.callback();
                    }

                };

                scope.focusDateInput = function () {
                    inputElem.focus();
                    doNotShowDatepicker = false;
                    pickmeup(inputElem).show();
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
                        doNotShowDatepicker = true;
                        inputContainer.classList.add('custom-input-focused');
                    });

                    inputElem.addEventListener('blur', function () {

                        inputContainer.classList.remove('custom-input-focused');
                        onDateBlur();
                        scope.$apply();

                    });

                    inputElem.addEventListener('pickmeup-show', function (event) {
                        if (doNotShowDatepicker) {
                            event.preventDefault();
                        }
                    });

                    inputElem.addEventListener('pickmeup-change', function (event) {
                        scope.dateValue = event.detail.formatted_date;
                        scope.$apply();
                    });

                    inputElem.addEventListener('pickmeup-hide', function (event) {
                        doNotShowDatepicker = true;
                    });

                };

                var init = function () {

                    if (scope.dateValue) {

                        pickmeup(inputElem, {
                            date: new Date(scope.dateValue),
                            current: new Date(scope.dateValue),
                            position: position,
                            default_date: defaultDate,
                            hide_on_select: true,
                            format: 'Y-m-d'
                        });

                    } else {

                        pickmeup(inputElem, {
                            position: position,
                            default_date: defaultDate,
                            hide_on_select: true,
                            format: 'Y-m-d'
                        });

                    }

                    initEventListeners();

                    if (scope.customStyles) {
                        applyCustomStyles();
                    }

                };

                scope.$watch('model', function () {

                    //if (scope.model && scope.model.value) {
                    if (scope.model) {
                        if (scope.model !== scope.dateValue) {
                            scope.dateValue = JSON.parse(JSON.stringify(scope.model));
                        }

                    } else if (scope.dateValue && !scope.error) {
                        scope.dateValue = '';
                    }

                })

                init();

            }
        }

    }

}());