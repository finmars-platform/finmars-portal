(function () {

    'use strict';

    module.exports = function ($mdDialog) {

        return {
            restrict: 'E',
            scope: {
                label: '@',
                placeholderText: '@',
                model: '=',
                customStyles: '<',
                eventSignal: '=',
                smallOptions: '=',
                onChangeCallback: '&?',
                onBlurCallback: '&?'
            },
            templateUrl: 'views/directives/customInputs/text-input-view.html',
            link: function (scope, elem, attr) {

                var inputContainer = elem[0].querySelector('.textInputContainer');
                var inputElem = elem[0].querySelector('.textInputElem');
                var fullTextElem = elem[0].querySelector('.customInputFullText');
                var fullTextTextarea = fullTextElem.querySelector('textarea');
                var stylePreset;

                scope.isReadonly = false;
                scope.isDisabled = false;
                scope.fullTextEnabled = false;

                // TIPS
                // scope.smallOptions probable properties
                    // tooltipText: custom tolltip text
                    // notNull: turn on error mode if field is not filled
                    // noIndicatorBtn: whether to show button at the right part of input
                    // readonly: making input readonly
                    // disabled: disabling input

                if (scope.smallOptions) {
                    if (scope.smallOptions.tooltipText) {
                        scope.tooltipText = scope.smallOptions.tooltipText;
                    }

                    if (scope.smallOptions.noIndicatorBtn) {
                        scope.noIndicatorBtn = true;
                    }

                    if (scope.smallOptions.readonly) {
                        scope.isReadonly = scope.smallOptions.readonly;
                    }

                    if (scope.smallOptions.disabled) {
                        scope.isDisabled = scope.smallOptions.disabled;
                    }
                }

                scope.getInputContainerClasses = function () {
                    var classes = '';

                    if (scope.error) {
                        classes = 'custom-input-error';

                    } else if (stylePreset) {
                        classes = 'custom-input-preset' + stylePreset;

                    } else if (scope.valueIsValid) {
                        classes = 'custom-input-is-valid';
                    }

                    if (scope.isDisabled) {
                        classes += ' custom-input-is-disabled'
                    }

                    if (scope.noIndicatorBtn) {
                        classes += ' no-indicator-btn'
                    }

                    return classes;
                };

                scope.onInputChange = function () {

                    scope.error = '';
                    stylePreset = '';
                    scope.valueIsValid = false;

                    if (scope.model) {
                        scope.valueIsValid = true;

                    } else {

                        if (scope.smallOptions && scope.smallOptions.notNull) {
                            scope.error = 'Field should not be null';
                        }

                    }

                    if (scope.onChangeCallback) {
                        setTimeout(function () {
                            scope.onChangeCallback();
                        }, 0);
                    }

                }

                var applyCustomStyles = function () {

                    // scope.customStyles should have next structure
                    /*
                        {
                          'class-of-element-to-which-styles-added': 'string with styles content',
                          'another-class-of-another-element': 'string with styles content'
                        }
                    */
                    Object.keys(scope.customStyles).forEach(function (className) {

                        var elemClass = '.' + className;
                        var elemToApplyStyles = elem[0].querySelector(elemClass);

                        if (elemToApplyStyles) {
                            elemToApplyStyles.style.cssText = scope.customStyles[className];
                        }

                    });

                };

                scope.openTextInDialog = function ($event) {

                    $mdDialog.show({
                        controller: 'TextEditorDialogController as vm',
                        templateUrl: 'views/dialogs/text-editor-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        multiple: true,
                        locals: {
                            data: {
                                title: 'Text',
                                text: scope.model
                            }
                        }

                    }).then(function (res) {

                        if (res.status === 'agree') {
                            stylePreset = '';
                            scope.model = res.text;

                            if (scope.onChangeCallback) {
                                setTimeout(function () {
                                    scope.onChangeCallback();
                                }, 0);
                            }
                        }

                    });

                };

                var initScopeWatchers = function () {

                    scope.$watch('model', function () {

                        if (scope.error && scope.model) {
                            scope.error = '';
                        }

                    });

                    if (scope.eventSignal) { // this if prevents watcher below from running without need

                        scope.$watch('eventSignal', function () {

                            if (scope.eventSignal && scope.eventSignal.key) {

                                switch (scope.eventSignal.key) {
                                    case 'mark_not_valid_fields':

                                        if (scope.smallOptions && scope.smallOptions.notNull &&
                                            !scope.model) {

                                            scope.error = 'Field should not be null';
                                        }

                                        break;

                                    case 'error':
                                        scope.error = JSON.parse(JSON.stringify(scope.eventSignal.error));
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

                };

                var initEventListeners = function () {
                    elem[0].addEventListener('mouseover', function () {
                        inputContainer.classList.add('custom-input-hovered');
                    });

                    elem[0].addEventListener('mouseleave', function () {
                        inputContainer.classList.remove('custom-input-hovered');
                    });

                    inputElem.addEventListener('focus', function () {

                        //inputContainer.classList.add('custom-input-focused');
                        fullTextElem.classList.add('custom-input-full-text-shown');
                        fullTextTextarea.focus();

                    });

                    /*inputElem.addEventListener('blur', function () {

                        inputContainer.classList.remove('custom-input-focused');

                        if (scope.onBlurCallback) {

                            setTimeout(function () { // without timeout changes will be discarded on fast blur
                                scope.onBlurCallback();
                            }, 250);

                        }

                    });*/

                    fullTextTextarea.addEventListener('blur', function () {
                        console.log("custom input fullTextElem blur", fullTextElem);
                        fullTextElem.classList.remove('custom-input-full-text-shown');

                        if (scope.onBlurCallback) {

                            setTimeout(function () { // without timeout changes will be discarded on fast blur
                                scope.onBlurCallback();
                            }, 250);

                        }
                    });

                }

                var init = function () {

                    initScopeWatchers();

                    initEventListeners();

                    if (scope.customStyles) {
                        applyCustomStyles();
                    }
                };

                init();



            }
        }

    }

}());