(function () {

    'use strict';

    module.exports = function () {

        return {
            restrict: 'E',
            scope: {
                label: '@',
                model: '=',
                customButtons: '=',
                position: '@',
                defaultDate: '=',
                elemsStyles: '<',
                onChangeCallback: '&?'
            },
            templateUrl: 'views/directives/date-input-view.html',
            link: function (scope, elem, attr) {

                scope.error = '';
                scope.placeholderText = 'dd-mm-yyyy';
                scope.dateValue = ''; // prevents from calling on change method when date changed to the same date

                var inputContainer = elem[0].querySelector('.numberInputContainer');
                var inputElem = elem[0].querySelector('.numberInputElem');

                var position = 'right';
                var defaultDate = false;

                if (scope.position) {
                    position = scope.position;
                }

                if (scope.defaultDate) {
                    defaultDate = scope.defaultDate;
                }

                var onDateBlur = function () {

                    scope.error = '';

                    if (scope.dateValue) {

                        if (scope.dateValue !== scope.model.value) {

                            if (moment(scope.dateValue, 'YYYY-MM-DD', true).isValid()) {

                                if (scope.model.value !== scope.dateValue) {
                                    scope.model.value = JSON.parse(JSON.stringify(scope.dateValue));
                                }

                            } else {

                                scope.error = 'Date has wrong format. Use one of these formats instead: YYYY-MM-DD.';
                                scope.model.value = null;

                            }

                            if (scope.onChangeCallback) {
                                scope.onChangeCallback();
                            }

                        }

                    } else if (scope.dateValue !== scope.model.value) {
                        scope.model.value = JSON.parse(JSON.stringify(scope.dateValue));

                        if (scope.onChangeCallback) {
                            scope.onChangeCallback();
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
                    pickmeup(inputElem).show();
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
                    });

                    inputElem.addEventListener('blur', function () {

                        inputContainer.classList.remove('custom-input-focused');
                        onDateBlur();
                        scope.$apply();

                    });

                    inputElem.addEventListener('pickmeup-change', function (event) {
                        scope.dateValue = event.detail.formatted_date;
                        scope.$apply();
                    });

                };

                var applyCustomStyles = function () {

                    Object.keys(scope.customStyles).forEach(function (className) {

                        var elemClass = '.' + className;
                        var elemToApplyStyles = elem[0].querySelector(elemClass);

                        elemToApplyStyles.style.cssText = scope.customStyles[className];

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

                    if (scope.model && scope.model.value) {

                        if (scope.model.value !== scope.dateValue) {
                            scope.dateValue = JSON.parse(JSON.stringify(scope.model.value));
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