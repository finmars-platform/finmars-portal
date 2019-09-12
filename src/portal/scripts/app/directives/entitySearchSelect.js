/**
 * Created by szhitenev on 28.06.2016.
 */
(function () {

    'use strict';

    module.exports = function ($mdDialog) {
        return {
            restrict: 'E',
            templateUrl: 'views/directives/entity-search-select-view.html',
            scope: {
                label: '=',
                item: '=',
                inputText: '<',
                entityType: '=',
                callback: '&'
            },
            link: function (scope, elem, attrs) {


                $(elem).on('click', function (event) {

                    event.preventDefault();
                    event.stopPropagation();

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

                });


            }
        };
    }

}());