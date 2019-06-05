/**
 * Created by mevstratov on 31.05.2019.
 */
(function () {

    'use strict';

    module.exports = function ($mdDialog) {
        return {
            restrict: 'E',
            scope: {
                title: '@',
                datesList: '=',
                datesTree: '=',
                callbackMethod: '&'
            },
            templateUrl: 'views/directives/date-tree-input-view.html',
            link: function (scope, elem, attrs) {

                if (!scope.title) {
                    scope.title = 'Date tree'
                }

                $(elem).click(function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    $mdDialog.show({
                        controller: 'DateTreeDialogController as vm',
                        templateUrl: 'views/dialogs/date-tree-dialog-view.html',
                        targetEvent: event,
                        bindToController: false,
                        preserveScope: false,
                        locals: {
                            data: {
                                title: scope.title,
                                datesList: scope.datesList,
                                datesTree: scope.datesTree
                            }
                        }
                    }).then(function (res) {

                        if (res.status === 'agree') {

                            scope.datesTree = res.data.datesTree;

                            setTimeout(function () {
                                scope.callbackMethod();
                            }, 500);

                        }

                    });

                });

            }
        }
    }

}());