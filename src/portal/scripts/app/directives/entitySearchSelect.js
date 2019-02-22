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
                options: '=',
                entityType: '='
            },
            link: function (scope, elem, attrs, ngModelCtrl) {

                $(elem).on('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    $mdDialog.show({
                        controller: 'EntitySearchDialogController as vm',
                        templateUrl: 'views/dialogs/entity-search-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: event,
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        multiple: true,
                        clickOutsideToClose: true,
                        locals: {
                            data: {
                                entityType: scope.entityType
                            }
                        }
                    }).then(function (res) {
                        if (res.status === 'agree') {
                            scope.item = res.data.item.id;

                            console.log('res', res);

                            if (!scope.options.length) {
                                scope.options = res.data.items;
                            }

                        }
                    });

                })

            }
        };
    }

}());