(function () {

    'use strict';

    var attributeTypeService = require('../../services/attributeTypeService');

    module.exports = function ($mdDialog) {

        return {
            restrict: 'E',
            require: '?ngModel',
            scope: {
                label: '@',
                placeholderText: '@',
                model: '=',
                //menuOptions: '=',
                customStyles: '=',
                eventSignal: '=',
                smallOptions: '=',
                isDisabled: '=',
                // Victor 2020.10.23 Next fields setting up classifiers properties
                classifierAttr: '=',
                classifierValue: '=',
                entityType: '=',
				// < Victor 2020.10.23 Next fields setting up classifiers properties >
				onChangeCallback: '&?',
            },
            templateUrl: 'views/directives/customInputs/classifier-select-view.html',
            link: function (scope, elem, attr) {

                scope.error = '';
                scope.inputValue = '';
                scope.dropdownMenuHidden = false;
                scope.dropdownMenuFilter = '';
                scope.menuOptions = [];

                if (scope.itemName) { // itemName and inputText needed for resetting selected option name
                    scope.inputText = JSON.parse(JSON.stringify(scope.itemName));
                }

				/*
				TIPS
				scope.smallOptions probable properties
					tooltipText: custom tooltip text
					notNull: turn on error mode if field is not filled
					noIndicatorBtn: whether to show button at the right part of input
					readonly: making input readonly
					dialogParent: 'string' - querySelector content for element to insert mdDialog into
				*/
                if (scope.smallOptions) {

                	scope.tooltipText = scope.smallOptions.tooltipText;
                    scope.dialogParent = scope.smallOptions.dialogParent;
					scope.noIndicatorBtn = scope.smallOptions.noIndicatorBtn;

                }

                var stylePreset;

                var inputContainer = elem[0].querySelector('.classifierInputContainer');
                var inputElem = elem[0].querySelector('.dropdownSelectInputElem');

                scope.getInputContainerClasses = function () {
                    var classes = '';

                    if (scope.isDisabled) {
                        classes += "custom-input-is-disabled";

                    } else if (scope.error) {
                        classes = 'custom-input-error';

                    } else if (stylePreset) {
                        classes = 'custom-input-preset' + stylePreset;

                    } else if (scope.valueIsValid) {
                        classes = 'custom-input-is-valid';

                    }

                    if (scope.noIndicatorBtn) {
                        classes += " no-indicator-btn";
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

					inputContainer.classList.remove('custom-input-focused');

					if (scope.itemName) scope.inputText = JSON.parse(JSON.stringify(scope.itemName));

                    scope.dropdownMenuHidden = false;

                    window.removeEventListener('click', closeDDMenuOnClick);
                    document.removeEventListener('keydown', onTabKeyPress);

                    if (updateScope) scope.$apply();

                }

                var closeDDMenuOnClick = function (event) {

                	var targetElem = event.target;

					scope.dropdownMenuFilter = null;

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

                    var dialogParent = angular.element(document.body);

                    if (scope.dialogParent) {

                        var dialogParentElem = document.querySelector(scope.dialogParent);

                        if (dialogParentElem) {
                            dialogParent = dialogParentElem
                        }

                    }

                    $mdDialog.show({
                        controller: 'ClassifierSelectDialogController as vm',
                        templateUrl: 'views/classifier-select-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        preserveScope: true,
                        autoWrap: true,
                        multiple: true,
                        skipHide: true,
                        locals: {
                            data: {
                                classifier: scope.classifierAttr,
                                classifierId: scope.classifierValue,
                                entityType: scope.entityType
                            }
                        }
                    }).then(function (res) {
                        if (res.status === 'agree') {
                            scope.model = +res.data.item;
                            console.log('scope.model', scope.model)
                            getTree();
                        }
                    });
                };

                var initScopeWatchers = function () {

                    scope.$watch('model', function () {

                        if (scope.model && scope.menuOptions) {

                            for (var i = 0; i < scope.menuOptions.length; i++) {

                                if (scope.menuOptions[i].id === scope.model) {

                                    scope.inputText = scope.menuOptions[i].name
                                    scope.valueIsValid = true
                                    break;

                                }

                            }

                        } else {
                            scope.inputText = ""
                            scope.valueIsValid = false
                        }

                    });

                    if (scope.eventSignal) {

                        scope.$watch('eventSignal', function () {

                            if (scope.eventSignal && scope.eventSignal.key) {

                                switch (scope.eventSignal.key) {
                                    case 'mark_not_valid_fields':
                                        if (scope.smallOptions && scope.smallOptions.notNull && !scope.item) {
                                            scope.error = 'Field should not be null'
                                        }

                                        break;

                                    case "error":
                                        scope.error = JSON.parse(JSON.stringify(scope.eventSignal.error))
                                        break;

                                    case 'set_style_preset1':
                                        stylePreset = 1;

                                        if (scope.item) {
                                            scope.error = ''
                                        }

                                        break;

                                    case 'set_style_preset2':
                                        stylePreset = 2;

                                        if (scope.item) {
                                            scope.error = ''
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

						scope.inputText = "";
                        inputContainer.classList.add('custom-input-focused');

                        scope.dropdownMenuHidden = true;

                        window.addEventListener('click', closeDDMenuOnClick);
                        document.addEventListener('keydown', onTabKeyPress);

                        scope.$apply();

                    });

                    /* inputElem.addEventListener('blur', function (event) {

                        inputContainer.classList.remove('custom-input-focused');

                        if (scope.itemName) {
                            scope.inputText = JSON.parse(JSON.stringify(scope.itemName));
                            scope.$apply();
                        }

                    }); */

                };

				/**
				 * Convert classifier data tree into flat list
				 *
				 * @param classifiers {Array}
				 */
				const recursiveFlat = (classifiers) => {

                	return classifiers.reduce((acc, classifier) => {

                		if (classifier.children.length > 0) {
							return [...acc, classifier, ...recursiveFlat(classifier.children)];
						}

                		return [...acc, classifier];

					}, []);

				}

                var getTree = function () {

					var classifierId = scope.classifierAttr.id

					attributeTypeService.getByKey(scope.entityType, classifierId).then(function (data) {

                        scope.menuOptions = recursiveFlat(data.classifiers);

                        for (var i = 0; i < scope.menuOptions.length; i++) {
                            if (scope.menuOptions[i].id === scope.model) {

                                scope.itemName = scope.menuOptions[i].name;
                                scope.inputText = scope.menuOptions[i].name;

                                break;

                            }

                        }

                        scope.$apply();

                    });

                }

                var init = function () {
                    getTree();

                    initScopeWatchers();

                    initEventListeners();

                    /*scope.iconData = entityIndicatorIcons[indicatorBtnIcon];*/

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