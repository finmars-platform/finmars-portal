(function () {

    'use strict';

    var importInstrumentCbondsService = require('../../services/import/importInstrumentCbondsService');
    var instrumentDatabaseSearchService = require('../../services/instrument/instrumentDatabaseSearchService');
    var tasksService = require('../../services/tasksService');

    module.exports = function ($mdDialog, toastNotificationService, instrumentService) {

        return {
            restrict: 'E',
            scope: {
                label: '@',
                placeholderText: '@',
                model: '=',
                customButtons: '=',
                customStyles: '=',
                eventSignal: '=',
                smallOptions: '=',
                sorted: '=',
                onChangeCallback: '&?',
                // used to show selected entity, if its data is not loaded
                itemName: '=',
                itemObject: '=',
            },
            templateUrl: 'views/directives/customInputs/instrument-select-view.html',
            link: function (scope, elem, attr) {

                scope.error = '';
                scope.inputValue = '';
                //scope.placeholderText = 'Relation';
                scope.dropdownMenuShown = false;
                scope.dropdownMenuFilter = '';
                scope.processing = false;
                /** For selection of database instrument */
                scope.loadingEntity = false;
                /** For updating local instrument from database */
                scope.updatingEntities = false;

                scope.localInstrumentsTotal = 0;
                scope.databaseInstrumentsTotal = 0;
                scope.hoverInstrument = null;
                scope.locateDetailsRight = false;

                /** Used to store name of selected entity and show it inside tooltip. */
                scope.selItemName = '';
                scope.inputText = '';


                if (scope.itemName) { // itemName and inputText needed for resetting selected option name
                    scope.selItemName = scope.itemName;
                    scope.inputText = scope.selItemName;
                }

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

                scope.locateDetailsLeft = false;

                var stylePreset;

                /**
                 * IMPORTANT: when changing this value,
                 * also change variable selMenuWidth inside instrument-select.less
                 */
                var selMenuWidth = 280;
                var inputContainer = elem[0].querySelector('.instrumentSelectInputContainer');
                var inputElem = elem[0].querySelector('.instrumentSelectInputElem');

                /*var entityIndicatorIcons = {
                    'type1': {
                        type: 'class',
                        icon: 'fas fa-align-justify'
                    }
                }*/


                scope.clearHoverInstrument = function () {

                    setTimeout(function () {

                        scope.hoverInstrument = null
                        console.log('scope.hoverInstrument', scope.hoverInstrument)

                        scope.$apply();
                    }, 0)

                }

                scope.setHoverInstrument = function (option) {

                    scope.dropdownMenuShown = true;

                    setTimeout(function () {

                        scope.hoverInstrument = option;
                        scope.hoverInstrument.available_for_update = false;

                        var bondOrStock = scope.hoverInstrument.instrument_type_object.user_code.endsWith('bond') ||
                            scope.hoverInstrument.instrument_type_object.user_code.endsWith('stock');

                        if (scope.hoverInstrument.frontOptions.type === 'local' && bondOrStock) {

                            scope.hoverInstrument.available_for_update = true;

                            // check whether user_code is a valid isin
                            const regexp = /^([A-Z]{2})([-]{0,1}[A-Z0-9]{9}[-]{0,1})([0-9]{1})$/g;
                            const invalidIsin = !scope.hoverInstrument.user_code.match(regexp);

                            if (invalidIsin) {
                                // can not load 'bond', 'stock' with invalid isin as user code
                                scope.hoverInstrument.available_for_update = false;
                            }

                        }

                        scope.$apply();

                    }, 100)
                }

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

                scope.selectLocalInstrument = function (item) {

                    console.log('selectLocalInstrument.item', item);

                    closeDropdownMenu();

                    // Local instrument, just put ID

                    if (item.id !== scope.model) {

                        stylePreset = '';
                        scope.error = '';

                        scope.model = item.id;
                        scope.itemObject = item;
                        scope.valueIsValid = true;

                        scope.itemName = item.name;
                        scope.selItemName = item.name;
                        scope.inputText = scope.selItemName;

                        setTimeout(function () {

                            if (scope.onChangeCallback) scope.onChangeCallback();

                            scope.$apply();

                        }, 0);

                    }

                }

                /** Called on error when executing scope.selectDatabaseInstrument() */
                var onSdiError = function (errorMessage) {

                    clearInterval(taskIntervalId);
                    toastNotificationService.error(errorMessage);
                    /*scope.model = null;

                    scope.itemName = '';
                    scope.inputText = '';*/

                    scope.processing = false;
                    scope.loadingEntity = false;
                    scope.isDisabled = false;

                    scope.updatingEntities = false;

                    setTimeout(function () {

                        if (scope.onChangeCallback) scope.onChangeCallback();
                        scope.$apply();

                    }, 100);

                };

                var applyInstrument = function (resultData) {

                    stylePreset = '';
                    scope.error = '';

                    scope.model = resultData.result_id;
                    scope.itemObject = {
                        id: resultData.result_id,
                        name: resultData.name,
                        user_code: resultData.user_code
                    };

                    scope.itemName = resultData.name;
                    scope.selItemName = resultData.name;
                    scope.inputText = scope.selItemName;

                    scope.valueIsValid = true;

                };

                var taskIntervalId;
                var intervalTime = 3000;

                var awaitInstrumentImport = function (taskId, currentName) {

                    return setInterval(function () {

                        tasksService.getByKey(taskId)
                            .then(function (taskData) {

                                var resultData = taskData.result_object;
                                var errorMsg = "Import aborted";

                                switch (taskData.status) {
                                    case 'D':

                                        scope.isDisabled = false;
                                        scope.loadingEntity = false;
                                        scope.processing = false;
                                        scope.updatingEntities = false;

                                        applyInstrument(resultData);

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

                                        applyInstrument(resultData);
                                        onSdiError(errorMsg);
                                        break;

                                    case 'E':

                                        applyInstrument(resultData);

                                        toastNotificationService.error(taskData.error);
                                        onSdiError(taskData.error);

                                        break;
                                }


                            })
                            .catch(function (error) {

                                scope.model = null;

                                scope.itemName = currentName || '';
                                scope.selItemName = currentName || '';
                                scope.inputText = scope.selItemName;

                                clearInterval(taskIntervalId);
                                toastNotificationService.error(error);

                                scope.processing = false;
                                scope.loadingEntity = false;
                                scope.isDisabled = false;

                                scope.updatingEntities = false;

                                throw error;

                            });

                    }, intervalTime);

                };

                var importInstrument = function (item) {

                    var currentName = scope.itemName || '';

                    /*var iTypeUc = null;

                    if (item.instrument_type_object) {
                        iTypeUc = item.instrument_type_object.user_code;

                    } else if (item.instrument_type && typeof item.instrument_type === 'string') { // property instrument_type contains user_code
                        // some instruments still have id as value for property instrument_type
                        iTypeUc = item.instrument_type;

                    } else {
                        console.log( "ERROR: instrument data", structuredClone(item) );
                        throw new Error("Lacking user_code of instrument type");
                    }*/

                    var config = {
                        user_code: item.reference || item.user_code, // reference for databaseInstrument user_code for local
                        name: item.name,
                        instrument_type_user_code: item.instrument_type,
                        mode: 1,
                    };

                    importInstrumentCbondsService.download(config)
                        .then(function (data) {

                            console.log('data', data);
                            if (data.errors) {

                                onSdiError( data.errors );

                            }
                            else {

                                taskIntervalId = awaitInstrumentImport(data.task, currentName);

                                /*stylePreset = '';
                                scope.error = '';

                                scope.model = data.result_id;
                                scope.itemObject = {id: data.result_id, name: data.instrument_name, user_code: data.instrument_code}

                                scope.itemName = data.instrument_name;
                                scope.inputText = data.instrument_name;

                                scope.valueIsValid = true;

                                scope.$apply();

                                setTimeout(function () {

                                    if (scope.onChangeCallback) {

                                        scope.onChangeCallback();

                                        scope.$apply();

                                    }


                                }, 1);*/

                            }

                        })
                        .catch(function (e) {

                            console.log("selectDatabaseInstrument.error ", e)

                            scope.processing = false;
                            scope.loadingEntity = false;
                            scope.isDisabled = false;

                            scope.updatingEntities = false;

                            scope.model = null;

                            scope.itemName = currentName;
                            scope.selItemName = currentName;
                            scope.inputText = scope.selItemName;

                            scope.$apply();

                        })

                }

                scope.selectDatabaseInstrument = function (item) {

                    console.log('selectDatabaseInstrument.item', item);

                    closeDropdownMenu();

                    // Download here?

                    stylePreset = '';
                    scope.error = '';

                    /*var config = {
                        instrument_code: item.referenceId,
                        instrument_name: item.issueName,
                        instrument_type_code: item.instrumentType,
                        mode: 1
                    };

                    scope.itemName = item.issueName;
                    scope.inputText = item.issueName;*/

                    scope.itemName = item.name;
                    scope.selItemName = item.name;
                    scope.inputText = scope.selItemName;

                    scope.processing = true;
                    scope.loadingEntity = true;
                    scope.isDisabled = true;

                    importInstrument(item);

                };

                scope.onInputTextChange = function () {
                    // scope.dropdownMenuFilter = scope.inputText;

                    if (!scope.dropdownMenuShown) {
                        onCustomInputFocus();
                    }

                    scope.getList();

                };

                var closeDropdownMenu = function (updateScope) {

                    inputContainer.classList.remove('custom-input-focused');

                    if (scope.itemName) {
                        scope.selItemName = scope.itemName;
                        scope.inputText = scope.selItemName;
                    }

                    scope.dropdownMenuShown = false;

                    window.removeEventListener('click', closeDDMenuOnClick);
                    document.removeEventListener('keydown', onTabKeyPress);

                    if (updateScope) scope.$apply();

                }

                var closeDDMenuOnClick = function (event) {

                    var targetElem = event.target;

                    scope.dropdownMenuFilter = null;

                    if ( !inputContainer.contains(targetElem) ) {
                        closeDropdownMenu(true);
                    }

                };

                var onTabKeyPress = function (event) {

                    // TODO fix ALT + TAB closes
                    var pressedKey = event.key;
                    console.log('pressedKey', pressedKey)

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

                scope.updateLocalInstrument = function (item) {

                    /*var config = {
                        user_code: item.user_code,
                        name: item.name,
                        instrument_type_user_code: item.instrument_type_object.user_code,
                        mode: 1
                    };

                    scope.isUpdatingInstrument = true;

                    importInstrumentCbondsService.download(config).then(function (data) {

                        scope.isUpdatingInstrument = false;

                        scope.getList();

                        scope.$apply();

                        if (data.errors) {

                            toastNotificationService.error(data.errors);

                        } else {
                            toastNotificationService.success('Instrument ' + item.reference + ' was updated');
                        }

                    })*/
                    scope.updatingEntities = true;

                    importInstrument(item);

                }

                scope.openSelectorDialog = function ($event) {

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
                        controller: "InstrumentSelectDatabaseDialogController as vm",
                        templateUrl: "views/dialogs/instrument-select-database-dialog-view.html",
                        targetEvent: $event,
                        parent: dialogParent,
                        multiple: true,
                        locals: {
                            data: {
                                inputText: scope.inputText
                            }
                        }

                    }).then(function (res) {

                        if (res.status !== 'agree') {
                            return;
                        }

                        var currentName = scope.itemName;

                        scope.itemName = res.data.item.name;
                        scope.selItemName = res.data.item.name;
                        scope.inputText = scope.selItemName;

                        if ( res.data.hasOwnProperty('task') ) { // database item selected

                            scope.processing = true;
                            scope.loadingEntity = true;
                            scope.isDisabled = true;

                            taskIntervalId = awaitInstrumentImport(res.data.task, currentName);

                        }
                        else {

                            scope.model = res.data.item.id;
                            scope.itemObject = res.data.item;

                            setTimeout(function () {

                                if (scope.onChangeCallback) scope.onChangeCallback();

                                scope.$apply();

                            }, 0);

                        }


                    })

                };

                var initScopeWatchers = function () {

                    if (scope.eventSignal) {
                        // this if prevents watcher below from running without need

                        scope.$watch("eventSignal", function () {

                            if (scope.eventSignal && scope.eventSignal.key) {

                                switch (scope.eventSignal.key) {

                                    case "mark_not_valid_fields":
                                        if (scope.smallOptions &&
                                            scope.smallOptions.notNull &&
                                            !scope.model) {

                                            scope.error = "Field should not be null";

                                        }

                                        break;

                                    case "error":
                                        scope.error = JSON.parse(JSON.stringify(scope.eventSignal.error));
                                        break;

                                    case "set_style_preset1":
                                        stylePreset = 1;
                                        break;

                                    case "set_style_preset2":
                                        stylePreset = 2;
                                        break;

                                    case "reset": // reset changes done by eventSignal

                                        scope.error = "";
                                        stylePreset = "";

                                        break;

                                }

                                scope.eventSignal = {};
                            }
                        });
                    }

                    scope.$watch('itemName', function () {

                        console.log('scope.model', scope.model);

                        if (scope.itemName) {
                            scope.selItemName = scope.itemName;
                            // scope.selectedItem = { id: scope.model, name: scope.itemName, }

                        } else {
                            // itemName = '';
                            scope.selItemName = '';
                        }

                        scope.inputText = scope.selItemName;

                    });

                };

                var onCustomInputFocus = function () {
                    // scope.inputText = "";

                    inputContainer.classList.add('custom-input-focused');

                    if (scope.dropdownMenuShown) {
                        return;
                    }

                    inputElem.select();

                    scope.dropdownMenuShown = true;

                    window.addEventListener('click', closeDDMenuOnClick);
                    // document.addEventListener('keydown', onTabKeyPress);
                    scope.getList();

                    scope.$apply();
                }

                var initEventListeners = function () {

                    elem[0].addEventListener('mouseover', function () {
                        inputContainer.classList.add('custom-input-hovered');
                    });

                    elem[0].addEventListener('mouseleave', function () {
                        inputContainer.classList.remove('custom-input-hovered');
                    });

                    inputElem.addEventListener('focus', onCustomInputFocus, false);

                    /* inputElem.addEventListener('blur', function (event) {

                        inputContainer.classList.remove('custom-input-focused');

                        if (scope.itemName) {

                        	scope.inputText = JSON.parse(JSON.stringify(scope.itemName));
                            scope.$apply();

                        }

                    }); */

                };

                scope.getHighlighted = function (value) {

                    var inputTextPieces = scope.inputText.split(' ')

                    var resultValue;

                    // Regular expression for multiple highlighting case insensitive results
                    var reg = new RegExp("(?![^<]+>)(" + inputTextPieces.join("|") + ")", "ig");

                    resultValue = value.replace(reg, '<span class="highlight">$1</span>');

                    return resultValue

                }

                scope.selectFirst = function ($event) {

                    if ($event.which === 13) {

                        if (scope.localInstruments.length) {
                            scope.selectLocalInstrument(scope.localInstruments[0])
                        } else {

                            if (scope.databaseInstruments.length) {
                                scope.selectDatabaseInstrument(scope.databaseInstruments[0])
                            }
                        }

                    }

                }

                scope.getList = function (inputText) {

                    scope.processing = true;

                    var promises = []

                    if (inputText?.length > 2) {
                        promises.push(new Promise(function (resolve, reject) {

                            instrumentDatabaseSearchService.getList(inputText)
                                .then(function (data) {

                                    scope.databaseInstrumentsTotal = data.count;

                                    scope.databaseInstruments = data.results;

                                    scope.databaseInstruments = scope.databaseInstruments.map(function (item) {

                                        item.pretty_date = moment(item.last_cbnnds_update).format("DD.MM.YYYY");

                                        item.frontOptions = {
                                            type: 'database',
                                        };

                                        return item;

                                    })

                                    resolve()

                                })
                                .catch(function (error) {

                                    scope.databaseInstruments = [];

                                    resolve();

                                });

                        }))
                    }

                    promises.push( new Promise(function (resolve, reject) {

                        var options = {
                            pageSize: 500,
                        };

                        if (inputText) {

                            options.filters = {
                                query: inputText
                            }

                        }

                        instrumentService.getListForSelect(options)
                            .then(function (data) {

                                scope.localInstrumentsTotal = data.count;

                                scope.localInstruments = data.results;

                                scope.localInstruments = scope.localInstruments.map(function (item) {

                                    item.pretty_date = moment(item.modified).format("DD.MM.YYYY");

                                    item.frontOptions = {
                                        type: 'local',
                                    };

                                    return item;

                                })

                                resolve()


                        })

                    } ))


                    Promise.all(promises).then(function (data) {

                        scope.databaseInstruments = scope.databaseInstruments.filter(function (databaseInstrument) {

                            var exist = false;

                            scope.localInstruments.forEach(function (localInstrument) {

                                if (localInstrument.user_code === databaseInstrument.reference) {
                                    exist = true;
                                }

                                if (localInstrument.reference_for_pricing === databaseInstrument.reference) {
                                    exist = true;
                                }


                            })

                            return !exist;

                        })

                        scope.processing = false;

                        scope.$apply();

                        setTimeout(function () {

                            $('.instrument-select-options-group-title').on('click', function () {

                                $(this).next()[0].scrollIntoView({block: 'start', behavior: 'smooth'});
                            });

                        }, 100)

                    })


                }

                var init = function () {

                    scope.databaseInstruments = []
                    scope.localInstruments = []

                    initScopeWatchers();
                    initEventListeners();

                    if (scope.customStyles) {
                        applyCustomStyles();
                    }

                    var rect = elem[0].getBoundingClientRect();

                    if (rect['right'] + selMenuWidth >= document.body.clientWidth + 18) { // 18px is width of the scroll
                        scope.locateDetailsLeft = true;
                    }

                };

                init();

                scope.$on("$destroy", function () {
                    window.removeEventListener('click', closeDDMenuOnClick);
                    // document.removeEventListener('keydown', onTabKeyPress);
                    clearInterval(taskIntervalId);
                });


            }
        }

    }

}());