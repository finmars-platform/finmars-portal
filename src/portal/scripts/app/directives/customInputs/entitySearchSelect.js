/**
 * Created by szhitenev on 28.06.2016.
 */
(function () {

    'use strict';

    var entityResolverService = require('../../services/entityResolverService');
    var metaContentTypeService = require('../../services/metaContentTypesService');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'E',
            scope: {
                label: '=',
                item: '=',
                itemName: '=',
                entityType: '=',
                customButtons: '=',
                customStyles: '=',
                eventSignal: '=',
                smallOptions: '=',
                isDisabled: '=',
                onChangeCallback: '&'
            },
            templateUrl: 'views/directives/customInputs/entity-search-select-view.html',
            link: function (scope, elem, attrs) {

                scope.error = '';
                scope.inputValue = '';
                scope.placeholderText = 'Relation';
                //scope.tooltipText = 'Tooltip text';

                if (scope.itemName) { // itemName and inputText needed for resetting selected option name
                    scope.inputText = JSON.parse(JSON.stringify(scope.itemName));
                }

                // TIPS
                // scope.smallOptions probable properties
                    // tooltipText: custom tolltip text
                    // notNull: turn on error mode if field is not filled
                    // dialogParent: 'string' - querySelector content for element to insert mdDialog into

                if (scope.smallOptions) {

                    scope.tooltipText = scope.smallOptions.tooltipText
                    scope.dialogParent = scope.smallOptions.dialogParent

                }

                var stylePreset;

                var inputContainer = elem[0].querySelector('.smartSearchInputContainer');
                var inputElem = elem[0].querySelector('.smartSearchInputElem');

                /*var entityIndicatorIcons = {
                    'account': {
                        type: 'class',
                        icon: 'fas fa-university'
                    },
                    'counterparty': {
                        type: 'class',
                        icon: 'far fa-id-badge'
                    },
                    'responsible': {
                        type: 'class',
                        icon: 'far fa-user'
                    },
                    'currency': {
                        type: 'class',
                        icon: 'far fa-money-bill-alt'
                    },
                    'instrument': {
                        type: 'class',
                        icon: 'fas fa-money-bill-alt'
                    },
                    'portfolio': {
                        type: 'class',
                        icon: 'fas fa-briefcase'
                    },
                    'strategy-1': {
                        type: 'class',
                        icon: 'fas fa-tag'
                    },
                    'strategy-2': {
                        type: 'class',
                        icon: 'fas fa-tag'
                    },
                    'strategy-3': {
                        type: 'class',
                        icon: 'fas fa-tag'
                    }

                }*/

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

                    if (item.id !== scope.item) {

                        stylePreset = '';
                        scope.error = '';
                        //scope.item.value = item.id;
                        scope.item = item.id;
                        scope.valueIsValid = true;

                        if (item.short_name) {
                            scope.itemName = item.short_name;
                            scope.inputText = item.short_name;

                        } else {
                            scope.itemName = item.name;
                            scope.inputText = item.name;
                        }

                        closeDropdownMenu();

                        setTimeout(function () {

                            scope.onChangeCallback();
                            scope.$apply();

                        }, 0);

                    }

                };

                var getOptionsList = function () {

                    var options = {
                        page: 1,
                        pageSize: 20,
                    }

                	if (scope.inputText) {

                        var inputText = scope.inputText;

                        options.filters = {
                            'short_name': inputText
                        }

                	}

                    entityResolverService.getListLight(scope.entityType, options).then(function (data) {

                        scope.selectorOptions = data.results;

                        window.addEventListener('click', closeDDMenuOnClick);
                        document.addEventListener('keydown', onTabKeyPress);

                        scope.$apply();

                    });

                }

                scope.onInputTextChange = function () {
                    getOptionsList();
                };

                var closeDropdownMenu = function (updateScope) {

                    scope.selectorOptions = null;

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

                scope.openSmartSearch = function ($event) {

                    $event.preventDefault();
                    $event.stopPropagation();

                    closeDropdownMenu();

                    if (!scope.isDisabled) {

                        var dialogParent = angular.element(document.body);

                        if (scope.dialogParent) {

                            var dialogParentElem = document.querySelector(scope.dialogParent);

                            if (dialogParentElem) {
                                dialogParent = dialogParentElem
                            }

                        }

                        $mdDialog.show({
                            controller: 'EntitySearchDialogController as vm',
                            templateUrl: 'views/dialogs/entity-search-dialog-view.html',
                            parent: dialogParent,
                            targetEvent: $event,
                            preserveScope: false,
                            autoWrap: true,
                            skipHide: true,
                            multiple: true,
                            clickOutsideToClose: false,
                            locals: {
                                data: {
                                    entityType: scope.entityType,
                                    selectedItem: scope.item
                                }
                            }
                        }).then(function (res) {

                            if (res.status === 'agree') {

                                stylePreset = '';
                                //scope.item.value = res.data.item.id;
                                scope.item = res.data.item.id;

                                scope.itemName = res.data.item.short_name;
                                scope.inputText = res.data.item.short_name;

                                scope.error = '';
                                scope.valueIsValid = true;

                                setTimeout(function () {

                                    scope.onChangeCallback();

                                    scope.$apply();

                                }, 0)


                            }
                        });

                    }

                };

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

                        getOptionsList();

                    });

                    inputElem.addEventListener('blur', function (event) {

                        inputContainer.classList.remove('custom-input-focused');

                        if (scope.itemName) {
                            scope.inputText = JSON.parse(JSON.stringify(scope.itemName));
                            scope.$apply();
                        }

                    });

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

                    scope.$watch('entityType', function () {
                        changeIconAndPlaceholder(scope.entityType);
                    })

                };

                var changeIconAndPlaceholder = function (entityType) {

                    // scope.iconData = entityIndicatorIcons[scope.entityType];

                    var entitiesData = metaContentTypeService.getList();

                    for (var i = 0; i < entitiesData.length; i++) {

                        if (entitiesData[i].entity === entityType) {
                            scope.placeholderText = entitiesData[i].name;
                            break;
                        }

                    }

                };

                var init = function () {

                    initEventListeners();

                    changeIconAndPlaceholder(scope.entityType);

                    if (scope.customStyles) {
                        applyCustomStyles();
                    }

                    initScopeWatchers();

                };

                init();

                scope.$on("$destroy", function () {
                    window.removeEventListener('click', closeDDMenuOnClick);
                    document.removeEventListener('keydown', onTabKeyPress);
                });

            }
        };
    }

}());