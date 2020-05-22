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
                indicatorIcon: '<',
                isDisabled: '<',
                callback: '&'
            },
            templateUrl: 'views/directives/entity-search-select-view.html',
            link: function (scope, elem, attrs) {

                scope.error = '';
                scope.inputValue = '';
                scope.placeholderText = '';

                if (scope.itemName) {
                    scope.inputText = JSON.parse(JSON.stringify(scope.itemName));
                }

                var inputContainer = elem[0].querySelector('.smartSearchInputContainer');
                var inputElem = elem[0].querySelector('.smartSearchInputElem');

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

                    scope.selectorOptions = null;

                    setTimeout(function () {

                        scope.callback();
                        scope.$apply();

                    }, 0)


                };

                scope.onInputTextChange = function () {

                    scope.selectorOptions = null;

                    if (scope.inputText) {

                        var inputText = scope.inputText;

                        var options = {
                            page: 1,
                            pageSize: 20,
                            filters: {
                                'short_name': inputText
                            }
                        }

                        entityResolverService.getList(scope.entityType, options).then(function (data) {

                            scope.selectorOptions = data.results;

                            scope.$apply();

                        });
                    }

                };

                scope.openSmartSearch = function ($event) {

                    $event.preventDefault();
                    $event.stopPropagation();

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

                                console.log('res', res);

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

                var initEventListeners = function () {
                    elem[0].addEventListener('mouseover', function () {
                        inputContainer.classList.add('custom-input-hovered');
                    });

                    elem[0].addEventListener('mouseleave', function () {
                        inputContainer.classList.remove('custom-input-hovered');
                    });

                    inputElem.addEventListener('focus', function () {
                        inputContainer.classList.add('custom-input-focused');
                    });

                    inputElem.addEventListener('blur', function (event) {

                        inputContainer.classList.remove('custom-input-focused');

                        scope.inputText = '';
                        if (scope.itemName) {
                            scope.inputText = JSON.parse(JSON.stringify(scope.itemName));
                        }

                        scope.selectorOptions = null;
                        scope.$apply();

                    });
                }

                var init = function () {

                    initEventListeners();

                    var entitiesData = metaContentTypeService.getList();

                    for (var i = 0; i < entitiesData.length; i++) {

                        if (entitiesData[i].entity === scope.entityType) {
                            scope.placeholderText = entitiesData[i].name;
                            break;
                        }

                    }

                }

                init();

            }
        };
    }

}());