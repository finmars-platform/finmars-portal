(function () {

    'use strict';

    var toastNotificationService = require('../../../../../core/services/toastNotificationService');
    var entityResolverService = require('../../services/entityResolverService');

    var importCurrencyCbondsService = require('../../services/import/importCurrencyCbondsService');
    var currencyDatabaseSearchService = require('../../services/currency/currencyDatabaseSearchService');

    const EventService = require('../../services/eventService');
    const popupEvents = require('../../services/events/popupEvents');

    var tasksService = require('../../services/tasksService');

    module.exports = function ($mdDialog, finmarsDatabaseService, customInputsService) {

        return {
            restrict: 'E',
            scope: {
                label: '@',
                placeholderText: '@',
                model: '=',
                modelValue: '@',
                customButtons: '=',
                customStyles: '=',
                eventSignal: '=',
                smallOptions: '=',
                sorted: '=',
                itemName: '=',
                itemObject: '=',
                entityType: '=',

                onChangeCallback: '&?',
            },
            templateUrl: 'views/directives/customInputs/unified-data-select-view.html',
            link: {
                pre: function (scope) {
                    scope.popupEventService = new EventService();
                },
                post: function (scope, elem, attr) {

                    scope.error = '';
                    scope.inputValue = '';
                    //scope.placeholderText = 'Relation';
                    /*scope.dropdownMenuShown = false;
                    scope.dropdownMenuFilter = '';
                    scope.processing = false;
                    scope.loadingEntity = false;

                    scope.menuPopupData.localItemsTotal = 0;
                    scope.databaseItemsTotal = 0;
                    scope.selectedItem = null;*/
                    /** For selection of database instrument */
                    scope.loadingEntity = false;

                    var itemName = scope.itemName || '';
                    scope.inputText = itemName;
                    /*scope.inputText = '';

                    if (itemName) { // itemName and inputText needed for resetting selected option name
                        scope.inputText = itemName;
                    }*/

                    /* TIPS
                    scope.smallOptions probable properties
                        tooltipText: custom tolltip text
                        indicatorBtnIcon: sets icon for indicator button
                        dialogParent: 'string' - querySelector content for element to insert mdDialog into */

                    if (scope.smallOptions) {

                        scope.tooltipText = scope.smallOptions.tooltipText

                        /* if (scope.smallOptions.indicatorBtnIcon) {
                            var indicatorBtnIcon = scope.smallOptions.indicatorBtnIcon;
                        } */

                        scope.dialogParent = scope.smallOptions.dialogParent
                    }

                    var modelValue = scope.modelValue || 'id';

                    var stylePreset;

                    var inputContainer = elem[0].querySelector('.unifiedDataSelectInputContainer');
                    var inputElem = elem[0].querySelector('.unifiedDataSelectInputElem');

                    /*var entityIndicatorIcons = {
                        'type1': {
                            type: 'class',
                            icon: 'fas fa-align-justify'
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

                    const selectLocalItem = function (item) {

                        console.log('selectLocalItem.item', item);

                        closeDropdownMenu();

                        // Local item, just put ID

                        if (item[modelValue] !== scope.model) {

                            stylePreset = '';
                            scope.error = '';

                            scope.selectedItem = item;

                            scope.model = item[modelValue];
                            scope.itemObject = item;
                            scope.valueIsValid = true;

                            itemName = item.name;
                            scope.inputText = item.name;

                            if (scope.onChangeCallback) {

                                setTimeout(function () {

                                    scope.onChangeCallback();

                                    scope.$apply();

                                }, 0);

                            }

                        } else {
                            scope.model = item[modelValue];
                            scope.itemObject = item;
                            itemName = item.name;
                            scope.inputText = item.name;
                        }

                    }

                    /** Called on error when executing scope.menuPopupData.selectDatabaseItem() */
                    var onSdiError = function (errorMessage) {

                        clearInterval(taskIntervalId);
                        toastNotificationService.error(errorMessage);
                        /*scope.model = null;

                        scope.itemName = '';
                        scope.inputText = '';*/

                        scope.menuPopupData.processing = false;
                        scope.loadingEntity = false;
                        scope.isDisabled = false;

                        setTimeout(function () {

                            if (scope.onChangeCallback) scope.onChangeCallback();
                            scope.$apply();

                        }, 100);

                    };

                    var applyItem = function (resultData) {

                        stylePreset = '';
                        scope.error = '';
                        var prop = modelValue === 'id' ? 'result_id' : modelValue;

                        /*if (scope.entityType === 'currency') {
                            scope.model = resultData.user_code;

                        }
                        else if (scope.entityType === 'counterparty') {
                            scope.model = resultData.result_id;
                        }*/
                        scope.model = resultData[prop];

                        scope.itemObject = {
                            id: resultData.result_id,
                            name: resultData.name,
                            user_code: resultData.user_code,
                        };

                        scope.itemName = resultData.name;
                        scope.inputText = resultData.name;

                        scope.valueIsValid = true;

                    };

                    var taskIntervalId;
                    var intervalTime = 5000;

                    var awaitItemImport = function (taskId, currentName) {

                        return setInterval(function () {

                            tasksService.getByKey(taskId)
                                .then(function (taskData) {

                                    var resultData = taskData.result_object;
                                    var errorMsg = "Import aborted";

                                    switch (taskData.status) {

                                        case 'D':

                                            scope.isDisabled = false;
                                            scope.loadingEntity = false;
                                            scope.menuPopupData.processing = false;

                                            applyItem(resultData);

                                            toastNotificationService.success("Instrument has been loaded");

                                            scope.$apply();

                                            if (scope.onChangeCallback) {

                                                setTimeout(function () {

                                                    scope.onChangeCallback();

                                                    scope.$apply();

                                                }, 0);

                                            }

                                            clearInterval(taskIntervalId);

                                            break;

                                        case 'C':
                                        case 'T':
                                            errorMsg = "Import timed out"

                                            applyItem(resultData);
                                            onSdiError(errorMsg);
                                            break;

                                        case 'E':

                                            applyItem(resultData);

                                            toastNotificationService.error(taskData.error);
                                            onSdiError(taskData.error);

                                            break;

                                    }

                                })
                                .catch(function (error) {

                                    scope.model = null;

                                    scope.itemName = currentName || '';
                                    scope.inputText = currentName || '';

                                    clearInterval(taskIntervalId);
                                    toastNotificationService.error(error);

                                    scope.menuPopupData.processing = false;
                                    scope.loadingEntity = false;
                                    scope.isDisabled = false;

                                    throw error;

                                });

                        }, intervalTime);

                    };

                    const selectDatabaseItem = function (item) {

                        console.log('selectDatabaseItem.item', item);
                        var currentName = scope.itemName || '';

                        closeDropdownMenu();

                        scope.itemName = item.name;
                        scope.inputText = item.name;

                        scope.menuPopupData.processing = true;
                        scope.loadingEntity = true;
                        scope.isDisabled = true;

                        /*if (scope.entityType === 'currency') {

                            var config = {
                                currency_code: item.code,
                                mode: 1
                            };

                            importCurrencyCbondsService.download(config).then(function (data) {

                                scope.isDisabled = false;

                                if (data.errors.length) {

                                    toastNotificationService.error(data.errors[0])

                                    scope.model = null;

                                    itemName = ''
                                    scope.inputText = ''

                                    scope.menuPopupData.processing = false;

                                    setTimeout(function () {

                                        if (scope.onChangeCallback) scope.onChangeCallback();

                                        scope.$apply();

                                    }, 0);


                                }
                                else {

                                    scope.model = data.result_id;
                                    scope.itemObject = {id: data.result_id, name: item.name, user_code: item.code}

                                    scope.menuPopupData.processing = false;

                                    scope.valueIsValid = true;

                                    setTimeout(function () {

                                        if (scope.onChangeCallback) scope.onChangeCallback();

                                        scope.$apply();

                                    }, 0);

                                }

                            })

                        }
                        else if (scope.entityType === 'counterparty') {

                            finmarsDatabaseService.downloadCounterparty(config).then(function (data) {

                                scope.isDisabled = false;

                                if (data.errors.length) {

                                    toastNotificationService.error(data.errors[0])

                                    scope.model = null;

                                    itemName = ''
                                    scope.inputText = ''

                                    setTimeout(function () {

                                        if (scope.onChangeCallback) scope.onChangeCallback();

                                        scope.$apply();

                                    }, 0);


                                } else {

                                    scope.model = data.id;
                                    scope.itemObject = {id: data.id, name: item.name, user_code: item.user_code}

                                    scope.menuPopupData.processing = false;

                                    scope.valueIsValid = true;

                                    setTimeout(function () {

                                        if (scope.onChangeCallback) scope.onChangeCallback();

                                        scope.$apply();

                                    }, 0);

                                }

                            })

                        }*/
                        var promise;

                        if (scope.entityType === 'currency') {

                            promise = importCurrencyCbondsService.download(
                                {
                                    user_code: item.user_code,
                                    mode: 1,
                                }
                            )

                        }
                        else if (scope.entityType === 'counterparty') {

                            promise = finmarsDatabaseService.downloadCounterparty(
                                {
                                    company_id: item.id,
                                }
                            )

                        }

                        promise.then(function (data) {

                            if (data.errors) {

                                onSdiError( data.errors );

                            }
                            else {

                                /*scope.model = data.id;

                                scope.itemObject = { id: data.id, name: item.name, user_code: item.user_code };

                                scope.menuPopupData.processing = false;

                                scope.valueIsValid = true;

                                setTimeout(function () {

                                    if (scope.onChangeCallback) scope.onChangeCallback();

                                    scope.$apply();

                                }, 0);*/
                                taskIntervalId = awaitItemImport(data.task, currentName);

                            }

                        })

                    };

                    scope.onInputTextChange = function (inputText) {

                        if ( !scope.menuPopupData.isOpened ) {
                            /*
                             * If mouse button released outside select
                             * while highlighting text. Popup will be closed
                             * but text still can be changed.
                             */
                            scope.popupEventService.dispatchEvent(popupEvents.OPEN_POPUP);
                        }

                        scope.getList(inputText);

                    };

                    /*scope.onInputFocus = function () {
                        scope.getList();
                    }*/

                    /*scope.onInputBlur = function () {

                        if (!scope.selectedItem) {
                            scope.model = null;
                            scope.inputText = '';
                            itemName = '';
                        } else {
                            scope.inputText = scope.selectedItem.name
                            itemName = scope.selectedItem.name
                        }

                    }*/

                    scope.openSelectorDialog = function ($event) {

                        $event.preventDefault();
                        $event.stopPropagation();

                        closeDropdownMenu();
                        // Victor 2020.11.09 If body is parent, then modal window under popup
                        // var dialogParent = angular.element(document.body);
                        var dialogParent = document.querySelector('.dialog-containers-wrap');

                        if (scope.dialogParent) {

                            var dialogParentElem = document.querySelector(scope.dialogParent);

                            if (dialogParentElem) {
                                dialogParent = dialogParentElem
                            }

                        }

                        $mdDialog.show({
                            controller: "UnifiedSelectDatabaseDialogController as vm",
                            templateUrl: "views/dialogs/unified-select-database-dialog-view.html",
                            targetEvent: $event,
                            parent: dialogParent,
                            multiple: true,
                            locals: {
                                data: {
                                    title: scope.label,
                                    inputText: scope.inputText,
                                    entityType: scope.entityType
                                }
                            }

                        }).then(function (res) {

                            if (res.status !== 'agree') {
                                return;
                            }

                            var currentName = itemName;

                            itemName = res.data.item.name;
                            scope.inputText = res.data.item.name;

                            if ( res.data.hasOwnProperty('task') ) { // database item selected

                                scope.menuPopupData.processing = true;
                                scope.loadingEntity = true;
                                scope.isDisabled = true;

                                taskIntervalId = awaitItemImport(res.data.task, currentName);

                            }
                            else {

                                /*if (scope.entityType === 'currency') {
                                    scope.model = res.data.item.user_code;

                                }
                                else if (scope.entityType === 'counterparty') {
                                    scope.model = res.data.item.id;
                                }*/
                                scope.model = res.data.item[modelValue];

                                scope.itemObject = res.data.item;

                                setTimeout(function () {

                                    if (scope.onChangeCallback) scope.onChangeCallback();

                                    scope.$apply();

                                }, 0);

                            }

                        })

                    };

                    var closeDropdownMenu = function (updateScope) {

                        inputContainer.classList.remove('custom-input-focused');

                        if (itemName) scope.inputText = itemName;

                        scope.menuPopupData.isOpened = false;
                        scope.popupEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                        document.removeEventListener('click', closePopupOnClickOutside);
                        document.removeEventListener('keydown', closeByKeydownPress);

                        if (updateScope) {

                            setTimeout(function () {
                                scope.$apply();
                            }, 0);

                        }

                    }

                    scope.onMenuClose = function () {
                        closeDropdownMenu(true);
                    }

                    /*var onTabKeyPress = function (event) {

                        // TODO fix ALT + TAB closes
                        var pressedKey = event.key;
                        console.log('pressedKey', pressedKey)

                        if (pressedKey === "Tab") {
                            closeDropdownMenu(true);
                        }

                    }*/
                    function closePopupOnClickOutside (event) {
                        customInputsService.closeMenuOnClickOutside(elem, event, '.unifiedDataSelectMenuContainer', scope.popupEventService);
                    }

                    function closeByKeydownPress (event) {
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

                            console.log('scope.model', scope.model);

                            if (scope.itemName) {
                                itemName = scope.itemName;
                                scope.selectedItem = { id: scope.model, name: itemName };

                            } else {
                                itemName = '';
                            }

                            scope.inputText = itemName;

                        });

                    };

                    var initEventListeners = function () {


                        elem[0].addEventListener('mouseover', function () {
                            inputContainer.classList.add('custom-input-hovered');
                        });

                        elem[0].addEventListener('mouseleave', function () {
                            inputContainer.classList.remove('custom-input-hovered');
                        });

                        /* inputElem.addEventListener('blur', function (event) {

                            inputContainer.classList.remove('custom-input-focused');

                            if (itemName) {

                                scope.inputText = JSON.parse(JSON.stringify(itemName));
                                scope.$apply();

                            }

                        }); */

                    };

                    const getHighlighted = function (value) {

                        var inputTextPieces = scope.inputText.split(' ');

                        var resultValue;

                        // Regular expression for multiple highlighting case insensitive results
                        var reg = new RegExp("(?![^<]+>)(" + inputTextPieces.join("|") + ")", "ig");

                        resultValue = value.replace(reg, '<span class="highlight">$1</span>');

                        return resultValue

                    }

                    scope.selectFirst = function ($event) {

                        if ($event.which === 13) {

                            if (scope.menuPopupData.localItems.length) {
                                scope.menuPopupData.selectLocalItem( scope.menuPopupData.localItems[0] );

                            } else {

                                if (scope.menuPopupData.databaseItems.length) {
                                    scope.menuPopupData.selectDatabaseItem( scope.menuPopupData.databaseItems[0] );
                                }
                            }

                        }

                    }

                    var getDatabaseItems = function (resolve, inputText) {

                        var getListProm;

                        if (scope.entityType === 'currency') {
                            getListProm = currencyDatabaseSearchService.getList(inputText, 0);
                        }
                        else if (scope.entityType === 'counterparty') {

                            let options = {
                                pageSize: 500,
                                filters: {
                                    page: 1,
                                }
                            };

                            if (inputText) {
                                options.filters.query = inputText;
                            }

                            getListProm = finmarsDatabaseService.getCounterpartiesList(options);

                        }

                        getListProm
                            .then(function (data) {

                                scope.menuPopupData.databaseItemsTotal = data.count;

                                scope.menuPopupData.databaseItems = data.results.map(function (item) {

                                    item.frontOptions = {
                                        type: 'database',
                                    }

                                    return item;

                                });

                                resolve();
                            })
                            .catch(function (error) {
                                scope.menuPopupData.databaseItems = [];
                                resolve();
                            });

                    };

                    scope.getList = async function (inputText) {

                        scope.menuPopupData.processing = true;

                        var promises = []

                        promises.push( new Promise( resolve => {
                            getDatabaseItems(resolve, inputText);
                        }) );

                        promises.push( new Promise(function (resolve) {

                            var options = {
                                pageSize: 500,
                            };

                            if (inputText) {

                                options.filters = {
                                    query: scope.inputText
                                }

                            }

                            entityResolverService.getListLight(scope.entityType, options)
                                .then(function (data) {

                                    scope.menuPopupData.localItemsTotal = data.count;

                                    scope.menuPopupData.localItems = data.results.map(function (item) {

                                        item.frontOptions = {
                                            type: 'local',
                                        }

                                        return item;

                                    });

                                    resolve();


                                })

                        }) );

                        try {

                            await Promise.allSettled(promises);

                        } catch (error) {

                            scope.menuPopupData.processing = false;
                            scope.$apply();

                            throw error;

                        }

                        scope.menuPopupData.databaseItems = scope.menuPopupData.databaseItems.filter(function (databaseItem) {

                            // database item does not exist locally
                            return !scope.menuPopupData.localItems.find(function (localItem) {
                                return localItem.user_code === databaseItem.user_code;
                            });

                        })

                        scope.menuPopupData.processing = false;
                        scope.$apply();


                        /*setTimeout(function () {

                            $('.unified-data-select-options-group-title').on('click', function () {

                                $(this).next()[0].scrollIntoView({block: 'start', behavior: 'smooth'});
                            });

                        }, 100)*/


                    };

                    scope.menuPopupData = {
                        isOpened: false,
                        processing: false,

                        localItems: [],
                        localItemsTotal: 0,
                        selectLocalItem: selectLocalItem,

                        databaseItems: [],
                        databaseItemsTotal: 0,
                        selectDatabaseItem: selectDatabaseItem,

                        getHighlighted: getHighlighted,

                        onInit: async function () {

                            scope.menuPopupData.isOpened = true;

                            customInputsService.onMenuInit(inputContainer, inputElem, closePopupOnClickOutside, closeByKeydownPress);

                            await scope.getList();

                        },
                    }

                    var init = function () {

                        if ( ['currency', 'counterparty'].indexOf(scope.entityType) < 0 ) {

                            scope.error = 'Unknown entity type';
                            throw new Error(`Wrong entity type of unifiedDataSelectDirective: ${scope.entityType}`);

                        }

                        scope.menuPopupData.databaseItems = [];
                        scope.menuPopupData.localItems = [];

                        initScopeWatchers();
                        initEventListeners();

                        if (scope.customStyles) {
                            applyCustomStyles();
                        }

                        scope.selectedItem = {id: scope.model, name: itemName }

                    };

                    init();

                    scope.$on("$destroy", function () {

                        document.removeEventListener('click', closePopupOnClickOutside);
                        document.removeEventListener('keydown', closeByKeydownPress);

                    });


                }
            }

        }

    }

}());