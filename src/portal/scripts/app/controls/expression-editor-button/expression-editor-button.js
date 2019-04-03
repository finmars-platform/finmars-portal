(function () {

    'use strict';

    module.exports = function ($mdDialog) {
        return {
            restriction: 'AE',
            templateUrl: 'controls/expression-editor-button/expression-editor-button.html',
            scope: {
                item: '=',
                data: '='
            },
            link: function (scope, elem, attr) {

                scope.openExpressionDialog = function ($event) {

                    $mdDialog.show({
                        controller: 'ExpressionEditorDialogController as vm',
                        templateUrl: 'views/dialogs/expression-editor-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        preserveScope: true,
                        multiple: true,
                        autoWrap: true,
                        skipHide: true,
                        locals: {
                            item: {expression: scope.item},
                            data: scope.data
                        }
                    }).then(function (res) {

                        if (res.status === 'agree') {

                            scope.item = res.data.item.expression;

                        }

                    });

                };

            }
        }
    }
}());