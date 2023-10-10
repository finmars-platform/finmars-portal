/**
 * Created by szhitenev on 28.06.2016.
 */
(function () {

    'use strict';

    const EventService = require("../../services/eventService");
    const popupEvents = require("../../services/events/popupEvents");

    const entityResolverService = require('../../services/entityResolverService');

    module.exports = function ($mdDialog, metaContentTypesService) {
        return {
            restrict: 'E',
            scope: {
                label: '=',
                /*
                 * Should contain 'id' or 'user_code' of entity.
                 * Based on scope.itemProperty.
                 */
                item: '=',
                itemName: '=',
                /*
                 * Property whose value will be assigned to scope.item.
                 * 'id' by default
                 */
				itemProperty: '@',
                itemObject: '=',
                entityType: '=',
                customButtons: '=',
                customStyles: '=',
                eventSignal: '=',
                smallOptions: '=',
                isDisabled: '=',

				onMenuOpen: '&?',
				onMenuClose: '&?',
				onChangeCallback: '&?',
            },
            templateUrl: 'views/directives/customInputs/entity-search-select-view.html',
            link: function (scope, elem, attrs) {

                scope.error = '';
                scope.inputValue = '';
                scope.placeholderText = 'Relation';
                //scope.tooltipText = 'Tooltip text';
				if (!scope.itemProperty) scope.itemProperty = 'id';

                /** Used to store name of selected entity and show it inside tooltip. */
                scope.selItemName = scope.itemName || '';

                if (scope.itemName) { // itemName and inputText needed for resetting selected option name
                    scope.selItemName = scope.itemName;
                    scope.inputText = scope.selItemName;
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

                scope.popupEventService = new EventService();

                let stylePreset;

                const inputContainer = elem[0].querySelector('.smartSearchInputContainer');
                const inputElem = elem[0].querySelector('.smartSearchInputElem');

                scope.getInputContainerClasses = function () {
                    var classes = '';

                    if (scope.isDisabled) {
                        classes = "custom-input-is-disabled";

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

                scope.selectOption = function (item, _$popup) {

                    if (_$popup) _$popup.cancel();

                    if (item[scope.itemProperty] !== scope.item) {

                        stylePreset = '';
                        scope.error = '';
                        //scope.item.value = item.id;
                        scope.item = item[scope.itemProperty];

                        if (scope.itemObject !== undefined) scope.itemObject = item;

                        scope.valueIsValid = true;

                        if (item.short_name) {
                            scope.selItemName = item.short_name;

                        } else {
                            scope.selItemName = item.name;
                        }

                        scope.inputText = scope.selItemName;

                        setTimeout(function () {

                            if (scope.onChangeCallback) scope.onChangeCallback();
                            scope.$apply();

                        }, 0);

                    }

                };

                var getOptionsList = function (inputText) {

                    var options = {
                        page: 1,
                        pageSize: 1000,
                    };

                    /*if (scope.inputText) {

                        var inputText = scope.inputText;

                        options.filters = {
                            'short_name': inputText
                        }

                    }*/

                    if (inputText) {

                        options.filters = {
                            'short_name': inputText
                        }

                    }

                    scope.menuOptionsPopupData.loadingOptions = true;

                    entityResolverService.getListLight(scope.entityType, options).then(function (data) {

                        // scope.selectorOptions = data.results;
						scope.menuOptionsPopupData.selectorOptions = data.results;
                        scope.popupEventService.dispatchEvent(popupEvents.OPEN_POPUP);

                        document.addEventListener('keydown', onTabKeyPress);

                        scope.menuOptionsPopupData.loadingOptions = false;

                        scope.$apply();

                    });

                }

                scope.onInputTextChange = function () {
                    getOptionsList(scope.inputText);
                };

                scope.onMenuPopupClose = function () {

                    document.removeEventListener('keydown', onTabKeyPress);

                    if (scope.onMenuClose) {
                        scope.onMenuClose();
                    }

                };

                const onTabKeyPress = function (event) {

                    var pressedKey = event.key;

                    if (pressedKey === "Tab") {
                        scope.onMenuPopupClose();
                        scope.popupEventService.dispatchEvent(popupEvents.CLOSE_POPUP);
                    }
                };

                scope.openSmartSearch = function ($event) {

                    $event.preventDefault();
                    $event.stopPropagation();

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
                                scope.item = res.data.item[scope.itemProperty];

                                if (scope.itemObject !== undefined) {
                                    scope.itemObject = res.data.item;
                                }

								scope.selItemName = res.data.item.short_name;
                                scope.inputText = scope.selItemName;

                                scope.error = '';
                                scope.valueIsValid = true;

                                setTimeout(function () {

                                    if (scope.onChangeCallback) scope.onChangeCallback();

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

                        // scope.inputText = "";
                        inputContainer.classList.add('custom-input-focused');

                        inputElem.select();
                        getOptionsList();

						if (scope.onMenuOpen) {
							scope.onMenuOpen();
						}

                    });

                    inputElem.addEventListener('blur', function (event) {

                        inputContainer.classList.remove('custom-input-focused');

                        if (scope.selItemName) {
                            scope.inputText = scope.selItemName;
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

                                    case "error":
                                        scope.error = scope.eventSignal.error;
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
                            scope.selItemName = scope.itemName;

                        } else {
                            scope.selItemName = '';
                        }

                        scope.inputText = scope.selItemName;

                    });

                    scope.$watch('entityType', function () {
                        changeIconAndPlaceholder(scope.entityType);
                    })

                };

                var changeIconAndPlaceholder = function (entityType) {

                    // scope.iconData = entityIndicatorIcons[scope.entityType];

                    var entitiesData = metaContentTypesService.getList();

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

                // Victor 08.10.2020
                scope.createEntity = function (_$popup, $event) {
                    $event.stopPropagation();

                    if (_$popup) _$popup.cancel();

                    $mdDialog
                        .show({
                            controller: "EntityViewerAddDialogController as vm",
                            templateUrl: "views/entity-viewer/entity-viewer-add-dialog-view.html",
                            parent: angular.element(document.body),
                            targetEvent: $event,
                            multiple: true,
                            locals: {
                                entityType: scope.entityType,
                                entity: {},
                                data: {},
                            },
                        })
                        .then(function (res) {
                            if (res && res.status === "agree") {
                                var item = res.data;
                                scope.selectOption(item);
                            }
                        });
                };

                scope.downloadEntity = function (_$popup, $event) {
                    $event.stopPropagation();

                    if (_$popup) _$popup.cancel();

                    console.log('scope.downloadEntity');

                    $mdDialog.show({
                        controller: 'InstrumentDownloadDialogController as vm',
                        templateUrl: 'views/dialogs/instrument-download/instrument-download-dialog-view.html',
                        targetEvent: $event,
                        multiple: true,
                        locals: {
                            data: {}
                        }
                    }).then(function (res) {
                        var item = res.data;
                        scope.selectOption(item);
                    })
                };

                scope.menuOptionsPopupData = {
                    entityType: scope.entityType,
                    selectorOptions: [],

                    selectOption: scope.selectOption,
                    createEntity: scope.createEntity,
                    downloadEntity: scope.downloadEntity,
                };

                scope.selectFirst = function ($event) {

                    if ($event.which === 13) {
                        scope.selectOption(scope.menuOptionsPopupData.selectorOptions[0])
                    }
                }

                init();

                scope.$on("$destroy", function () {
                    document.removeEventListener('keydown', onTabKeyPress);
                });

            }
        };
    }

}());