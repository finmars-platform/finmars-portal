/**
 * Created by szhitenev on 28.06.2016.
 */
(function () {

    'use strict';

    var entityResolverService = require('../services/entityResolverService');
    var metaContentTypeService = require('../services/metaContentTypesService');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'E',
            scope: {
                label: '<',
                item: '=',
                itemName: '<',
                entityType: '<',
                customStyles: '<',
                isDisabled: '<',
                smallOptions: '=',
                callback: '&'
            },
            templateUrl: 'views/directives/entity-search-select-view.html',
            link: function (scope, elem, attrs) {

                scope.error = '';
                scope.inputValue = '';
                scope.placeholderText = 'Relation';

                if (scope.itemName) {
                    scope.inputText = JSON.parse(JSON.stringify(scope.itemName));
                }

                if (scope.smallOptions) {
                    if (scope.smallOptions.tooltipText) {
                        scope.tooltipText = scope.smallOptions.tooltipText;
                    }
                }

                var inputContainer = elem[0].querySelector('.smartSearchInputContainer');
                var inputElem = elem[0].querySelector('.smartSearchInputElem');

                var entityIndicatorIcons = {
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
                        icon: 'fas fa-money-bill'
                    },
                    'instrument': {
                        type: 'class',
                        icon: 'far fa-money-bill-alt'
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

                }

                scope.selectOption = function (item) {

                    //scope.item.value = item.id;
                    scope.item = item.id;

                    if (item.short_name) {

                        scope.itemName = item.short_name;
                        scope.inputText = item.short_name;

                    } else {
                        scope.itemName = item.name;
                        scope.inputText = item.name;
                    }

                    closeDropdownMenu(true);

                    setTimeout(function () {

                        scope.callback();
                        scope.$apply();

                    }, 0);


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

                        $mdDialog.show({
                            controller: 'EntitySearchDialogController as vm',
                            templateUrl: 'views/dialogs/entity-search-dialog-view.html',
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
                                    selectedItem: scope.item.value
                                }
                            }
                        }).then(function (res) {

                            if (res.status === 'agree') {

                                //scope.item.value = res.data.item.id;
                                scope.item = res.data.item.id;

                                scope.itemName = res.data.item.short_name;
                                scope.inputText = res.data.item.short_name;

                                setTimeout(function () {

                                    scope.callback();

                                    scope.$apply();

                                }, 0)


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

                        var elemClass = '.' + className;
                        var elemToApplyStyles = elem[0].querySelector(elemClass);

                        elemToApplyStyles.style.cssText = scope.customStyles[className];

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

                        getOptionsList();
                    });

                    inputElem.addEventListener('blur', function (event) {

                        inputContainer.classList.remove('custom-input-focused');
                        scope.$apply();

                    });
                }

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

                }

                init();

                scope.$on("$destroy", function () {
                    window.removeEventListener('click', closeDDMenuOnClick);
                    document.removeEventListener('keydown', onTabKeyPress);
                });

            }
        };
    }

}());