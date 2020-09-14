(function () {

    'use strict';

    module.exports = function ($mdDialog) {

        return {
            restrict: 'E',
            scope: {
                label: '@',
                placeholderText: '@',
                model: '=',
                menuOptions: '<',
                customStyles: '<',
                eventSignal: '=',
                smallOptions: '=',
                onChangeCallback: '&?'
            },
            templateUrl: 'views/directives/customInputs/dropdown-select-view.html',
            link: function (scope, elem, attr) {

                scope.error = '';
                scope.inputValue = '';
                //scope.placeholderText = 'Relation';
                scope.dropdownMenuHidden = false;
                scope.dropdownMenuFilter = '';

                if (scope.itemName) { // itemName and inputText needed for resetting selected option name
                    scope.inputText = JSON.parse(JSON.stringify(scope.itemName));
                }

                // TIPS
                // scope.smallOptions probable properties
                    // tooltipText: custom tolltip text
                    // indicatorBtnIcon: sets icon for indicator button

                if (scope.smallOptions) {
                    if (scope.smallOptions.tooltipText) {
                        scope.tooltipText = scope.smallOptions.tooltipText;
                    }

                    if (scope.smallOptions.indicatorBtnIcon) {
                        var indicatorBtnIcon = scope.smallOptions.indicatorBtnIcon;
                    }
                }

                var stylePreset;

                var inputContainer = elem[0].querySelector('.dropdownSelectInputContainer');
                var inputElem = elem[0].querySelector('.dropdownSelectInputElem');

                var entityIndicatorIcons = {
                    'type1': {
                        type: 'class',
                        icon: 'fas fa-align-justify'
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

                    return classes;
                };

                scope.callFnForCustomBtn = function (actionData) {

                    if (actionData.parameters) {
                        actionData.callback(actionData.parameters);
                    } else {
                        actionData.callback();
                    }

                };

                scope.selectOption = function (item) {

                    if (item.id !== scope.model) {

                        stylePreset = '';
                        scope.error = '';

                        scope.model = item.id;
                        scope.valueIsValid = true;

                        scope.itemName = item.name;
                        scope.inputText = item.name;

                        closeDropdownMenu();

                        setTimeout(function () {

                            if (scope.onChangeCallback) {
                                scope.onChangeCallback();
                            }

                            scope.$apply();

                        }, 0);

                    }

                };

                scope.onInputTextChange = function () {
                    scope.dropdownMenuFilter = scope.inputText;
                };

                var closeDropdownMenu = function (updateScope) {

                    scope.dropdownMenuHidden = false;

                    window.removeEventListener('click', closeDDMenuOnClick);
                    document.removeEventListener('keydown', onTabKeyPress);

                    if (updateScope) {
                        scope.$apply();
                    }

                }

                var closeDDMenuOnClick = function (event) {
                    var targetElem = event.target;

                    if (!inputContainer.contains(targetElem)) {
                        closeDropdownMenu(true);
                    }
                };

                var onTabKeyPress = function (event) {

                    var pressedKey = event.key;

                    if (pressedKey === "Tab") {
                        closeDropdownMenu(true);
                    }

                }

                var applyCustomStyles = function () {

                    Object.keys(scope.customStyles).forEach(function (className) {

                        var elemClass = "." + className;
                        var elemToApplyStyles = elem[0].querySelectorAll(elemClass);

                        if (elemToApplyStyles.length) {

                            elemToApplyStyles.forEach(function (htmlNode) {
                                htmlNode.style.cssText = scope.customStyles[className];
                            })

                        }

                    });

                };

                scope.openSelectorDialog = function ($event) {

                    $mdDialog.show({
                        controller: "ExpandableItemsSelectorDialogController as vm",
                        templateUrl: "views/dialogs/expandable-items-selector-dialog-view.html",
                        targetEvent: $event,
                        multiple: true,
                        locals: {
                            data: {
                                dialogTitle: 'Choose layout to open Split Panel with',
                                items: scope.menuOptions
                            }
                        }

                    }).then(function (res) {

                        if (res.status === 'agree') {
                            scope.selectOption(res.selected);
                        }

                    })

                };


                var initScopeWatchers = function () {

                    if (scope.eventSignal) {

                        scope.$watch('eventSignal', function () {

                            if (scope.eventSignal && scope.eventSignal.key) {

                                switch (scope.eventSignal.key) {
                                    case 'mark_not_valid_fields':
                                        if (scope.smallOptions && scope.smallOptions.notNull && !scope.item) {
                                            scope.error = 'Field should not be null';
                                        }

                                        break;

                                    case 'set_style_preset1':
                                        stylePreset = 1;

                                        if (scope.item) {
                                            scope.error = '';
                                        }

                                        break;

                                    case 'set_style_preset2':
                                        stylePreset = 2;

                                        if (scope.item) {
                                            scope.error = '';
                                        }

                                        break;
                                }

                                scope.eventSignal = {}; // reset signal

                            }

                        });

                    }

                    scope.$watch('itemName', function () {

                        if (scope.itemName) {
                            scope.inputText = JSON.parse(JSON.stringify(scope.itemName));

                        } else {
                            scope.inputText = '';

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

                        scope.dropdownMenuHidden = true;

                        window.addEventListener('click', closeDDMenuOnClick);
                        document.addEventListener('keydown', onTabKeyPress);

                        scope.$apply();

                    });

                    inputElem.addEventListener('blur', function (event) {

                        inputContainer.classList.remove('custom-input-focused');

                        if (scope.itemName) {
                            scope.inputText = JSON.parse(JSON.stringify(scope.itemName));
                            scope.$apply();
                        }

                    });

                };

                var init = function () {

                    for (var i = 0; i < scope.menuOptions.length; i++) {
                        if (scope.menuOptions[i].id === scope.model) {

                            scope.itemName = scope.menuOptions[i].name;
                            scope.inputText = scope.menuOptions[i].name;

                            break;

                        }

                    }

                    initScopeWatchers();

                    initEventListeners();

                    scope.iconData = entityIndicatorIcons[indicatorBtnIcon];

                    if (scope.customStyles) {
                        applyCustomStyles();
                    }
                };

                init();

                scope.$on("$destroy", function () {
                    window.removeEventListener('click', closeDDMenuOnClick);
                    document.removeEventListener('keydown', onTabKeyPress);
                });


            }
        }

    }

}());