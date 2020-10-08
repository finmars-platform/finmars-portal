/**
 * Created by szhitenev on 28.06.2016.
 */
(function () {
    "use strict";

    var entityResolverService = require("../../services/entityResolverService");
    var metaContentTypeService = require("../../services/metaContentTypesService");

    module.exports = function ($mdDialog) {
        return {
            restrict: "E",
            scope: {
                label: "<",
                item: "=",
                itemName: "<",
                entityType: "<",
                customButtons: "=",
                customStyles: "<",
                isDisabled: "<",
                eventSignal: "=",
                smallOptions: "=",
                callback: "&",
            },
            templateUrl:
                "views/directives/customInputs/entity-search-select-view.html",
            link: function (scope, elem, attrs) {
                scope.error = "";
                scope.inputValue = "";
                scope.placeholderText = "Relation";
                //scope.tooltipText = 'Tooltip text';

                if (scope.itemName) {
                    // itemName and inputText needed for resetting selected option name
                    scope.inputText = JSON.parse(JSON.stringify(scope.itemName));
                }

                // TIPS
                // scope.smallOptions probable properties
                // tooltipText: custom tolltip text
                // notNull: turn on error mode if field is not filled

                if (scope.smallOptions) {
                    if (scope.smallOptions.tooltipText) {
                        scope.tooltipText = scope.smallOptions.tooltipText;
                    }
                }

                var stylePreset;

                var inputContainer = elem[0].querySelector(
                    ".smartSearchInputContainer"
                );
                var inputElem = elem[0].querySelector(".smartSearchInputElem");

                var entityIndicatorIcons = {
                    account: {
                        type: "class",
                        icon: "fas fa-university",
                    },
                    counterparty: {
                        type: "class",
                        icon: "far fa-id-badge",
                    },
                    responsible: {
                        type: "class",
                        icon: "far fa-user",
                    },
                    currency: {
                        type: "class",
                        icon: "far fa-money-bill-alt",
                    },
                    instrument: {
                        type: "class",
                        icon: "fas fa-money-bill-alt",
                    },
                    portfolio: {
                        type: "class",
                        icon: "fas fa-briefcase",
                    },
                    "strategy-1": {
                        type: "class",
                        icon: "fas fa-tag",
                    },
                    "strategy-2": {
                        type: "class",
                        icon: "fas fa-tag",
                    },
                    "strategy-3": {
                        type: "class",
                        icon: "fas fa-tag",
                    },
                };

                scope.getInputContainerClasses = function () {
                    var classes = "";

                    if (scope.error) {
                        classes = "custom-input-error";
                    } else if (stylePreset) {
                        classes = "custom-input-preset" + stylePreset;
                    } else if (scope.valueIsValid) {
                        classes = "custom-input-is-valid";
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
                        stylePreset = "";
                        scope.error = "";
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
                            scope.callback();
                            scope.$apply();
                        }, 0);
                    }
                };

                var getOptionsList = function () {
                    var options = {
                        page: 1,
                        pageSize: 20,
                    };

                    if (scope.inputText) {
                        var inputText = scope.inputText;

                        options.filters = {
                            short_name: inputText,
                        };
                    }

                    entityResolverService
                        .getListLight(scope.entityType, options)
                        .then(function (data) {
                            scope.selectorOptions = data.results;

                            window.addEventListener("click", closeDDMenuOnClick);
                            document.addEventListener("keydown", onTabKeyPress);

                            scope.$apply();
                        });
                };

                scope.onInputTextChange = function () {
                    getOptionsList();
                };

                var closeDropdownMenu = function (updateScope) {
                    scope.selectorOptions = null;

                    window.removeEventListener("click", closeDDMenuOnClick);
                    document.removeEventListener("keydown", onTabKeyPress);

                    if (updateScope) {
                        scope.$apply();
                    }
                };

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
                };

                scope.openSmartSearch = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    closeDropdownMenu();

                    if (!scope.isDisabled) {
                        $mdDialog
                            .show({
                                controller: "EntitySearchDialogController as vm",
                                templateUrl: "views/dialogs/entity-search-dialog-view.html",
                                parent: angular.element(document.body),
                                targetEvent: $event,
                                preserveScope: false,
                                autoWrap: true,
                                skipHide: true,
                                multiple: true,
                                clickOutsideToClose: false,
                                locals: {
                                    data: {
                                        entityType: scope.entityType,
                                        selectedItem: scope.item,
                                    },
                                },
                            })
                            .then(function (res) {
                                if (res.status === "agree") {
                                    stylePreset = "";
                                    //scope.item.value = res.data.item.id;
                                    scope.item = res.data.item.id;

                                    scope.itemName = res.data.item.short_name;
                                    scope.inputText = res.data.item.short_name;

                                    scope.error = "";
                                    scope.valueIsValid = true;

                                    setTimeout(function () {
                                        scope.callback();

                                        scope.$apply();
                                    }, 0);
                                }
                            });
                    }
                };

                /*$(elem).on('click', function (event) {

                            event.preventDefault();
                            event.stopPropagation();

                            if (!scope.isDisabled) {

                                $mdDialog.show({
                                    controller: 'EntitySearchDialogController as vm',
                                    templateUrl: 'views/dialogs/entity-search-dialog-view.html',
                                    parent: angular.element(document.body),
                                    targetEvent: event,
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

                                        scope.item = res.data.item.id;
                                        scope.inputText = res.data.item.name;

                                        console.log('res', res);

                                        setTimeout(function () {

                                            scope.callback();

                                            scope.$apply();

                                        }, 0)


                                    }
                                });

                            }

                        });*/

                var applyCustomStyles = function () {
                    Object.keys(scope.customStyles).forEach(function (className) {
                        var elemClass = "." + className;
                        var elemToApplyStyles = elem[0].querySelector(elemClass);

                        if (elemToApplyStyles) {
                            elemToApplyStyles.style.cssText = scope.customStyles[className];
                        }
                    });
                };

                var initEventListeners = function () {
                    elem[0].addEventListener("mouseover", function () {
                        inputContainer.classList.add("custom-input-hovered");
                    });

                    elem[0].addEventListener("mouseleave", function () {
                        inputContainer.classList.remove("custom-input-hovered");
                    });

                    inputElem.addEventListener("focus", function () {
                        inputContainer.classList.add("custom-input-focused");

                        getOptionsList();
                    });

                    inputElem.addEventListener("blur", function (event) {
                        inputContainer.classList.remove("custom-input-focused");

                        if (scope.itemName) {
                            scope.inputText = JSON.parse(JSON.stringify(scope.itemName));
                            scope.$apply();
                        }
                    });
                };

                var initScopeWatchers = function () {
                    if (scope.eventSignal) {
                        scope.$watch("eventSignal", function () {
                            if (scope.eventSignal && scope.eventSignal.key) {
                                switch (scope.eventSignal.key) {
                                    case "mark_not_valid_fields":
                                        if (
                                            scope.smallOptions &&
                                            scope.smallOptions.notNull &&
                                            !scope.item
                                        ) {
                                            scope.error = "Field should not be null";
                                        }

                                        break;

                                    case "set_style_preset1":
                                        stylePreset = 1;

                                        if (scope.item) {
                                            scope.error = "";
                                        }

                                        break;

                                    case "set_style_preset2":
                                        stylePreset = 2;

                                        if (scope.item) {
                                            scope.error = "";
                                        }

                                        break;
                                }

                                scope.eventSignal = {}; // reset signal
                            }
                        });
                    }

                    scope.$watch("itemName", function () {
                        if (scope.itemName) {
                            scope.inputText = JSON.parse(JSON.stringify(scope.itemName));
                        } else {
                            scope.inputText = "";
                        }
                    });
                };

                var init = function () {
                    initEventListeners();

                    scope.iconData = entityIndicatorIcons[scope.entityType];

                    var entitiesData = metaContentTypeService.getList();

                    for (var i = 0; i < entitiesData.length; i++) {
                        if (entitiesData[i].entity === scope.entityType) {
                            scope.placeholderText = entitiesData[i].name;
                            break;
                        }
                    }

                    if (scope.customStyles) {
                        applyCustomStyles();
                    }

                    initScopeWatchers();
                };

                // Victor 08.102020
                scope.createEntity = function ($event) {
                    $event.stopPropagation(); // The closeDDMenuOnClick handler should not be called if pressed Create button

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
                            if (res && res.res === "agree") {
                                var item = res.data;
                                scope.selectOption(item);
                            }
                        });
                };

                scope.downloadEntity = function ($event) {
                  $event.stopPropagation();

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

                init();

                scope.$on("$destroy", function () {
                    window.removeEventListener("click", closeDDMenuOnClick);
                    document.removeEventListener("keydown", onTabKeyPress);
                });
            },
        };
    };
})();
