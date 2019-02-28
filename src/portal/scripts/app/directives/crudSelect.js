/**
 * Created by szhitenev on 28.06.2016.
 */
(function () {

    'use strict';

    var entityResolverService = require('../services/entityResolverService');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'E',
            templateUrl: 'views/directives/crud-select-view.html',
            scope: {
                label: '=',
                item: '=',
                options: '=',
                entityType: '='
            },
            link: function (scope, elem, attrs, ngModelCtrl) {

                console.log("crudSelect.label", scope.label);
                console.log("crudSelect.item", scope.item);
                console.log("crudSelect.options", scope.options);
                console.log("crudSelect.entityType", scope.entityType);

                scope.searchTerm = '';

                scope.addItem = function ($event) {

                    console.log('addItem');

                    scope.searchTerm = '';

                    scope.options.forEach(function (optionItem) {
                        optionItem.___edit = false;
                    });

                    scope.options.unshift({
                        name: '',
                        user_code: '',
                        ___edit: true
                    });

                    console.log('scope.options', scope.options);

                };

                scope.saveItem = function (item, $index, $event) {


                    if (item.id) {

                        entityResolverService.update(scope.entityType, item.id, item).then(function (data) {
                            item.user_code = item.name;
                            scope.options[$index] = data;
                            scope.$apply();
                        }).catch(function (reason) {
                            $mdDialog.show({
                                controller: 'InfoDialogController as vm',
                                templateUrl: 'views/info-dialog-view.html',
                                parent: angular.element(document.body),
                                targetEvent: $event,
                                clickOutsideToClose: true,
                                locals: {
                                    info: {
                                        title: 'Warning',
                                        description: "Name <b>" + item.name + "</b> already exist."
                                    }
                                },
                                preserveScope: true,
                                autoWrap: true,
                                skipHide: true,
                                multiple: true
                            })
                        })
                    } else {

                        entityResolverService.create(scope.entityType, item).then(function (data) {
                            item.user_code = item.name;
                            scope.options[$index] = data;
                            scope.$apply();
                        }).catch(function (reason) {
                            $mdDialog.show({
                                controller: 'InfoDialogController as vm',
                                templateUrl: 'views/info-dialog-view.html',
                                parent: angular.element(document.body),
                                targetEvent: $event,
                                clickOutsideToClose: true,
                                locals: {
                                    info: {
                                        title: 'Warning',
                                        description: "Name <b>" + item.name + "</b> already exist."
                                    }
                                },
                                preserveScope: true,
                                autoWrap: true,
                                skipHide: true,
                                multiple: true
                            })
                        })
                    }


                };

                scope.deleteItem = function (item, $index, $event) {

                    $mdDialog.show({
                        controller: 'WarningDialogController as vm',
                        templateUrl: 'views/warning-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        clickOutsideToClose: true,
                        locals: {
                            warning: {
                                title: 'Warning',
                                description: 'Are you sure to delete <b>' + item.name + '</b>?'
                            }
                        },
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        multiple: true
                    }).then(function (res) {
                        console.log('res', res);
                        if (res.status === 'agree') {
                            entityResolverService.deleteByKey(scope.entityType, item.id);

                            scope.options.splice($index, 1);
                        }

                    });


                };

                scope.editItem = function (item) {

                    scope.options.forEach(function (optionItem) {
                        optionItem.___edit = false;
                    });

                    item.___edit = true

                }

            }
        };
    }

}());