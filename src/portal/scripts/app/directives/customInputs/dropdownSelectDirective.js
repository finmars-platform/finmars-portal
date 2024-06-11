(function () {

    'use strict';

    const EventService = require("../../services/eventService");
	const popupEvents = require("../../services/events/popupEvents");

    const metaService = require("../../services/metaService").default;

    module.exports = function ($mdDialog, customInputsService) {

        return {
            restrict: 'E',
            scope: {
                label: '@',
                placeholderText: '@',
                model: '=',
				itemName: '=', // used to show selected option without loading menu options
                menuOptions: '=',
				groupOptions: '@',
                customButtons: '=',
                customStyles: '=',
                eventSignal: '=',
                smallOptions: '<',
                isDisabled: '=',

				sorted: '=',
				loadMenuOptions: '&?',
                onChangeCallback: '&?'
            },
            templateUrl: 'views/directives/customInputs/dropdown-select-view.html',
            link: {
                pre: function (scope) {
                    scope.popupEventService = new EventService();
                },
                post: function (scope, elem, attr) {

                    const dialogParent =  document.querySelector('.dialog-containers-wrap');

                    scope.error = '';
                    scope.inputValue = '';
                    //scope.placeholderText = 'Relation';
                    scope.dropdownMenuShown = false;
                    scope.dropdownMenuFilter = '';
                    scope.popupWidth = 'element';

                    scope.selItemName = scope.itemName || '';
                    scope.inputText = scope.selItemName;
                    let menuOptionsList = [];

                    /* TIPS
                    scope.smallOptions probable properties
                        tooltipText: custom tooltip text
                        noIndicatorBtn: whether to show button at the right part of input
                        notNull: selector should not be empty
                        popupWidth:
                    */

                    if (scope.smallOptions) {

                        scope.tooltipText = scope.smallOptions.tooltipText;

                        /* if (scope.smallOptions.indicatorBtnIcon) {
                            var indicatorBtnIcon = scope.smallOptions.indicatorBtnIcon;
                        } */

                        scope.noIndicatorBtn = scope.smallOptions.noIndicatorBtn;
                        scope.popupWidth = scope.smallOptions.popupWidth || scope.popupWidth;
                        scope.popupMinWidth = scope.smallOptions.popupMinWidth;

                    }

                    scope.menuOptionsPopupData = {
                        options: null,
                        selectOption: function (item, _$popup, $event) {

                            scope.selectOption(item);

                            // IMPORTANT: should be at the end of function because it call scope.$apply() from closeDropdownMenu()
                            _$popup.cancel();

                        },
                        focusInput: function () {
                            setTimeout(() => {
                                const filter = document.querySelector('input.popup-select-filter');
                                filter.focus();
                            }, 100);

                        },
                        onInit: async function () {

                            scope.menuOptionsPopupData.filterTerm = "";
                            inputContainer.classList.add('custom-input-focused');
                            inputElem.select();
                            inputElem.focus();
                            // scope.dropdownMenuShown = true;

                            // window.addEventListener('click', closeDDMenuOnClick);
                            document.addEventListener('keydown', closeByKeydownPress);

                            if (scope.loadMenuOptions) {
                                // scope.menuOptions = await scope.loadMenuOptions();
                                scope.menuOptionsPopupData.options = await scope.loadMenuOptions();

                                setTimeout(function () {
                                    scope.$apply();
                                }, 100);

                            }

                        },
                    };

                    if (scope.itemName) { // itemName needed for resetting selected option name
                        scope.inputText = scope.selItemName;
                    }

                    scope.popupTemplate = scope.groupOptions ? 'views/popups/custom-select-with-groups-popup-view.html' : 'views/popups/custom-select-popup-view.html';

                    var stylePreset;

                    var inputContainer = elem[0].querySelector('.dropdownSelectInputContainer');
                    var inputElem = elem[0].querySelector('.dropdownSelectInputElem');

                    const getMenuOptionsAsFlatList = function () {

                        menuOptionsList = [];

                        if (scope.groupOptions) {

                            // scope.menuOptions.forEach(function (group) {
                            scope.menuOptionsPopupData.options.forEach(function (group) {
                                menuOptionsList = menuOptionsList.concat(group.content);
                            });

                        } else {
                            // menuOptionsList = scope.menuOptions
                            menuOptionsList = scope.menuOptionsPopupData.options;
                        }

                        return menuOptionsList;

                    };

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

                    scope.onInputTextChange = function (newVal) {
                        scope.menuOptionsPopupData.filterTerm = newVal || '';
                    }

                    scope.callFnForCustomBtn = function ($event, actionData) {

                        $event.preventDefault();
                        $event.stopPropagation();

                        if (actionData.parameters) {
                            actionData.callback(actionData.parameters);
                        } else {
                            actionData.callback();
                        }

                    };

                    scope.orderOptions = null;

                    if (!scope.sorted) {

                        // scope.optionsComparator = function (o1, o2) {
                        scope.menuOptionsPopupData.optionsComparator = function (o1, o2) {

                            if (!o1.value || !o2.value) {
                                return 0;
                            }

                            let o1StartsWithDash = o1.type === 'string' && o1.value.startsWith('-');
                            let o2StartsWithDash = o2.type === 'string' && o2.value.startsWith('-');

                            if (o1StartsWithDash && o2StartsWithDash) {

                                const o1WithoutDash = o1.value.slice(1);
                                const o2WithoutDash = o2.value.slice(1);

                                if (o1WithoutDash > o2WithoutDash) {
                                    return 1;
                                }

                                if (o1WithoutDash < o2WithoutDash) {
                                    return -1;
                                }

                                return 0;

                            }

                            if (o1.value > o2.value) {
                                return 1;
                            }

                            if (o1.value < o2.value) {
                                return -1;
                            }

                        };

                    }

                    scope.selectOption = function (item) {

                        if (item.hasOwnProperty('onClick')) {
                            item.onClick();
                        }

                        if (item.id !== scope.model) {

                            stylePreset = '';
                            scope.error = '';

                            scope.model = item.id;
                            scope.valueIsValid = true;

                            scope.selItemName = item.name;
                            scope.inputText = scope.selItemName;

                            if (scope.onChangeCallback) {

                                // because of timeout scope.onChangeCallback() will be called after linked to scope.model variable is updated
                                setTimeout(function () {

                                    scope.onChangeCallback({
                                        changedValue: JSON.parse(angular.toJson(item))
                                    });
                                    // scope.$apply();

                                }, 0);

                            }

                        }

                    };

                    /*scope.onInputTextChange = function () {
                        scope.dropdownMenuFilter = scope.menuOptionsPopupData.filterTerm;
                    };*/

                    var closeDropdownMenu = function (updateScope) {

                        inputContainer.classList.remove('custom-input-focused');
                        // if (itemName) scope.inputText = itemName;

                        // scope.dropdownMenuShown = false;

                        // window.removeEventListener('click', closeDDMenuOnClick);
                        document.removeEventListener('keydown', closeByKeydownPress);
                        scope.inputText = scope.selItemName;

                        if (updateScope) {

                            setTimeout(function () {
                                scope.$apply();
                            }, 0);

                        }

                    };

                    scope.onMenuClose = function () {
                        closeDropdownMenu(true);
                    }

                    var closeByKeydownPress = function (event) {

                        /*var pressedKey = event.key;

                        switch (pressedKey) {
                            case "Tab":
                                scope.popupEventService.dispatchEvent(popupEvents.CLOSE_POPUP);
                                // closeDropdownMenu(true);
                                break;

                            case "Esc":
                            case "Escape":
                                scope.popupEventService.dispatchEvent(popupEvents.CLOSE_POPUP);
                                // closeDropdownMenu(true);
                                break;
                        }*/
                        customInputsService.closeMenuByKeydown(event, scope.popupEventService);

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

                    scope.openSelectorDialog = async function ($event) {

                        $event.stopPropagation();
                        $event.preventDefault();

                        closeDropdownMenu();

                        if (scope.loadMenuOptions) {
                            // scope.menuOptions = await scope.loadMenuOptions();
                            scope.menuOptionsPopupData.options = await scope.loadMenuOptions();
                        }

                        menuOptionsList = getMenuOptionsAsFlatList();

                        $mdDialog.show({
                            controller: "ExpandableItemsSelectorDialogController as vm",
                            templateUrl: "views/dialogs/expandable-items-selector-dialog-view.html",
                            targetEvent: $event,
                            parent: dialogParent,
                            multiple: true,
                            locals: {
                                data: {
                                    dialogTitle: scope.title,
                                    // items: scope.menuOptions
                                    items: menuOptionsList
                                }
                            }

                        }).then(function (res) {

                            if (res.status === 'agree') {
                                scope.selectOption(res.selected);
                            }

                        })

                    };

                    var getSelOptionName = function () {

                        menuOptionsList = getMenuOptionsAsFlatList();

                        for (var i = 0; i < menuOptionsList.length; i++) {
                            if (menuOptionsList[i].id === scope.model) {

                                return menuOptionsList[i].name;

                            }

                        }

                    };

                    var initScopeWatchers = function () {

                        /* IMPORTANT: item name watcher should be called before model watcher. */
                        scope.$watch('itemName', function () {

                            if (scope.itemName) {
                                scope.selItemName = scope.itemName;

                            } else {
                                scope.selItemName = '';
                            }

                            scope.inputText = scope.selItemName;

                        });

                        scope.$watch('model', function () {

                            if (scope.model || scope.model === 0) {

                                // if (scope.menuOptions) {
                                if (scope.menuOptionsPopupData.options) {

                                    menuOptionsList = getMenuOptionsAsFlatList();

                                    for (var i = 0; i < menuOptionsList.length; i++) {

                                        if (menuOptionsList[i].id === scope.model) {

                                            scope.selItemName = menuOptionsList[i].name;
                                            scope.inputText = scope.selItemName;
                                            // scope.valueIsValid = true
                                            break;

                                        }

                                    }

                                } else if (scope.selItemName) {
                                    scope.inputText = scope.selItemName;
                                }

                            } else {
                                scope.selItemName = "";
                                scope.inputText = scope.selItemName;
                            }

                        });

                        if (scope.menuOptions && Array.isArray(scope.menuOptions)) {

                            scope.$watch('menuOptions', function () {

                                if (scope.menuOptions && Array.isArray(scope.menuOptions)) {
                                    scope.menuOptionsPopupData.options = scope.menuOptions;

                                } else {
                                    scope.menuOptionsPopupData.options = [];
                                }

                            });

                        }

                        if (scope.eventSignal) {

                            scope.$watch('eventSignal', function () {

                                if (scope.eventSignal && scope.eventSignal.key) {

                                    switch (scope.eventSignal.key) {
                                        case 'mark_not_valid_fields':
                                            if (scope.smallOptions && scope.smallOptions.notNull &&
                                                !scope.model && scope.model !== 0) {

                                                scope.error = 'Field should not be null';

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

                    };

                    var initEventListeners = function () {

                        elem[0].addEventListener('mouseover', function () {
                            inputContainer.classList.add('custom-input-hovered');
                        });

                        elem[0].addEventListener('mouseleave', function () {
                            inputContainer.classList.remove('custom-input-hovered');
                        });

                        /* inputElem.addEventListener('focus', async function () {

                            scope.inputText = "";
                            inputContainer.classList.add('custom-input-focused');

                            scope.dropdownMenuShown = true;

                            window.addEventListener('click', closeDDMenuOnClick);
                            document.addEventListener('keydown', closeByKeydownPress);

                            if (scope.loadMenuOptions) {
                                scope.menuOptions = await scope.loadMenuOptions();
                                scope.menuOptionsPopupData.options = scope.menuOptions;
                            }

                            scope.$apply();

                        }, false); */

                    };

                    var init = function () {

                        if (scope.menuOptions && scope.menuOptions.length) {

                            scope.menuOptionsPopupData.options = scope.menuOptions;
                            menuOptionsList = getMenuOptionsAsFlatList();

                            for (var i = 0; i < menuOptionsList.length; i++) {
                                if (menuOptionsList[i].id === scope.model) {

                                    scope.selItemName = menuOptionsList[i].name;
                                    scope.inputText = scope.selItemName;

                                    break;

                                }

                            }

                        }

                        initScopeWatchers();
                        initEventListeners();

                        /*scope.iconData = entityIndicatorIcons[indicatorBtnIcon];*/

                        if (scope.customStyles) {
                            applyCustomStyles();
                        }

                    };

                    init();

                    scope.$on("$destroy", function () {
                        // window.removeEventListener('click', closeDDMenuOnClick);
                        document.removeEventListener('keydown', closeByKeydownPress);
                    });

                }
            }

        }

    }

}());