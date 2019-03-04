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
                loadOptionsMethod: '&',
                options: '=',
                entityType: '='
            },
            link: function (scope, elem, attrs, ngModelCtrl) {

                console.log('smart search data', scope.item, scope.label, scope.options, scope.entityType);
                if (scope.loadOptionsMethod()) {
                    scope.loadOptionsMethod();
                }

                $(elem).on('click', function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    // removing backdrop of select
                    setTimeout(function () {
                        $('.md-select-backdrop.md-click-catcher').trigger('click');
                    }, 1000)

                    $mdDialog.show({
                        controller: 'EntitySearchDialogController as vm',
                        templateUrl: 'views/dialogs/entity-search-dialog-view.html',
                        // parent: angular.element(document.body),
                        targetEvent: event,
                        preserveScope: false,
                        autoWrap: true,
                        skipHide: true,
                        multiple: true,
                        clickOutsideToClose: false,
                        locals: {
                            data: {
                                entityType: scope.entityType
                            }
                        }
                    }).then(function (res) {

                        if (res.status === 'agree') {
                            scope.item = res.data.item.id;

                            console.log('res', res);

                            if (!scope.options || !scope.options.length) {
                                scope.options = res.data.items;
                            }

                        }
                    });

                })

            }
        };
    }

}());