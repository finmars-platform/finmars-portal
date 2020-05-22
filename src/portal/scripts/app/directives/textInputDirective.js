(function () {

    'use strict';

    module.exports = function ($mdDialog) {

        return {
            restrict: 'E',
            scope: {
                label: '@',
                model: '=',
                customStyles: '<',
                onChangeCallback: '&?'
            },
            templateUrl: 'views/directives/text-input-view.html',
            link: function (scope, elem, attr) {

                var inputContainer = elem[0].querySelector('.textInputContainer');
                var inputElem = elem[0].querySelector('.textInputElem');

                scope.initOnChangeCallback = function () {
                    if (scope.onChangeCallback) {
                        scope.onChangeCallback();
                    }
                }

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
                    });

                    inputElem.addEventListener('blur', function () {
                        inputContainer.classList.remove('custom-input-focused');
                    });
                }

                var init = function () {

                    initEventListeners();

                    if (scope.customStyles) {
                        applyCustomStyles();
                    }
                };

                scope.openTextInDialog = function ($event) {

                    $mdDialog.show({
                        controller: 'TextInputDialogController as vm',
                        templateUrl: 'views/dialogs/text-input-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        multiple: true,
                        locals: {
                            data: {
                                title: 'Text',
                                text: scope.model.value
                            }
                        }

                    }).then(function (res) {

                        if (res.status === 'agree') {
                            scope.model.value = res.text;
                        }

                    });

                };

                init();

            }
        }

    }

}());