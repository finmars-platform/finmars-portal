(function () {

    'use strict';

    var toastNotificationService = require('../../../../../core/services/toastNotificationService');
    var entityResolverService = require('../../services/entityResolverService');

    var unifiedDataService = require('../../services/unifiedDataService')
    var importUnifiedDataService = require('../../services/import/importUnifiedDataService');


    module.exports = function ($mdDialog) {

        return {
            restrict: 'E',
            scope: {
                label: '@',
                placeholderText: '@',
                model: '=',
                customStyles: '=',
                eventSignal: '=',
                smallOptions: '=',
                sorted: '=',
                onChangeCallback: '&?',
                itemName: '=',
                itemObject: '=',
                entityType: '='
            },
            templateUrl: 'views/directives/customInputs/unified-data-select-view.html',
            link: function (scope, elem, attr) {

                scope.error = '';
                scope.inputValue = '';
                //scope.placeholderText = 'Relation';
                scope.dropdownMenuShown = false;
                scope.dropdownMenuFilter = '';
                scope.processing = false;

                scope.localItemsTotal = 0;
                scope.databaseItemsTotal = 0;
                scope.hoverItem = null;

                scope.inputText = '';

                if (scope.itemName) { // itemName and inputText needed for resetting selected option name
                    scope.inputText = JSON.parse(JSON.stringify(scope.itemName));
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

                var stylePreset;

                var inputContainer = elem[0].querySelector('.unifiedDataSelectInputContainer');
                var inputElem = elem[0].querySelector('.unifiedDataSelectInputElem');

                /*var entityIndicatorIcons = {
                    'type1': {
                        type: 'class',
                        icon: 'fas fa-align-justify'
                    }
                }*/


                scope.clearHoverItem = function () {

                    setTimeout(function () {

                        scope.hoverItem = null
                        console.log('scope.hoverItem', scope.hoverItem)

                        scope.$apply();
                    }, 0)

                }

                scope.setHoverItem = function ($event, option) {

                    setTimeout(function () {

                        scope.hoverItem = option
                        console.log('scope.hoverItem', scope.hoverItem)

                        scope.$apply();
                    }, 0)
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

                scope.selectLocalItem = function (item) {

                    console.log('selectLocalItem.item', item);

                    closeDropdownMenu();

                    // Local item, just put ID

                    if (item.id !== scope.model) {

                        stylePreset = '';
                        scope.error = '';

                        scope.model = item.id;
                        scope.itemObject = item;
                        scope.valueIsValid = true;

                        scope.itemName = item.name;
                        scope.inputText = item.name;

                        setTimeout(function () {

                            if (scope.onChangeCallback) scope.onChangeCallback();

                            scope.$apply();

                        }, 0);

                    }

                }

                scope.selectDatabaseItem = function (item) {

                    console.log('selectDatabaseItem.item', item);

                    closeDropdownMenu();

                    // Download here?

                    stylePreset = '';
                    scope.error = '';


                    var config = {
                        user_code: item.user_code,
                        entityType: scope.entityType
                    };

                    scope.itemName = item.user_code;
                    scope.inputText = item.user_code;

                    scope.processing = true;
                    scope.isDisabled = true;

                    importUnifiedDataService.download(config).then(function (data) {

                        scope.isDisabled = false;

                        if (data.errors.length) {

                            toastNotificationService.error(data.errors[0])

                            scope.model = null;

                            scope.itemName = ''
                            scope.inputText = ''

                            setTimeout(function () {

                                if (scope.onChangeCallback) scope.onChangeCallback();

                                scope.$apply();

                            }, 0);


                        } else {

                            scope.model = data.id;
                            scope.itemObject = {id: data.id, name: item.mame, user_code: item.user_code}

                            scope.processing = false;

                            scope.valueIsValid = true;

                            setTimeout(function () {

                                if (scope.onChangeCallback) scope.onChangeCallback();

                                scope.$apply();

                            }, 0);

                        }

                    })


                };

                scope.onInputTextChange = function () {
                    // scope.dropdownMenuFilter = scope.inputText;

                    scope.getList();

                };

                var closeDropdownMenu = function (updateScope) {

                    console.trace();

                    inputContainer.classList.remove('custom-input-focused');

                    if (scope.itemName) scope.inputText = JSON.parse(JSON.stringify(scope.itemName));

                    scope.dropdownMenuShown = false;

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

                    // TODO fix ALT + TAB closes
                    // var pressedKey = event.key;
                    // console.log('pressedKey', pressedKey)
                    //
                    // if (pressedKey === "Tab") {
                    //     closeDropdownMenu(true);
                    // }

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

                        scope.dropdownMenuShown = true;

                        window.addEventListener('click', closeDDMenuOnClick);
                        document.addEventListener('keydown', onTabKeyPress);

                        scope.$apply();

                    }, false);

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

                        if (scope.localItems.length) {
                            scope.selectLocalItem(scope.localItems[0])
                        } else {

                            if (scope.databaseItems.length) {
                                scope.selectDatabaseItem(scope.databaseItems[0])
                            }
                        }

                    }

                }

                scope.getList = function () {

                    scope.processing = true;

                    var promises = []

                    if (scope.inputText.length > 2) {
                        promises.push(new Promise(function (resolve, reject) {

                            unifiedDataService.getList(scope.entityType, {
                                filters: {
                                    user_code: scope.inputText
                                }
                            }).then(function (data) {

                                scope.databaseItemsTotal = data.count;

                                scope.databaseItems = data.results;

                                resolve()

                            }).catch(function (error) {

                                console.log("Unified Database error occurred", error)

                                scope.databaseItems = []

                                resolve()

                            })

                        }))
                    }

                    promises.push(new Promise(function (resolve, reject) {


                        entityResolverService.getListLight(scope.entityType, {
                            pageSize: 500,
                            filters: {
                                query: scope.inputText
                            }
                        }).then(function (data) {

                            scope.localItemsTotal = data.count;

                            scope.localItems = data.results;

                            resolve()


                        })

                    }))


                    Promise.all(promises).then(function (data) {

                        scope.databaseItems = scope.databaseItems.filter(function (databaseItem) {

                            var exist = false;

                            scope.localItems.forEach(function (localItem) {

                                if (localItem.user_code === databaseItem.user_code) {
                                    exist = true
                                }

                            })

                            return !exist;

                        })

                        scope.processing = false;

                        scope.$apply();

                        setTimeout(function () {

                            $('.unified-data-select-options-group-title').on('click', function () {

                                $(this).next()[0].scrollIntoView({block: 'start', behavior: 'smooth'});
                            });

                        }, 100)

                    }).catch(function () {

                        vm.processing = false;
                        scope.$apply();

                    })


                }

                var init = function () {

                    scope.databaseItems = []
                    scope.localItems = []

                    initEventListeners();

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