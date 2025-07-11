(function () {

    'use strict';

    module.exports = function ($mdDialog) {
        return {
            restriction: 'AE',
            templateUrl: 'views/controls/json-editor-button/json-editor-button.html',
            scope: {
                item: '=',
                data: '=',
                buttonText: '@',
                onChangeCallback: '&?'
            },
            link: function (scope, elem, attr) {

                if (!scope.buttonText) {
                    scope.buttonText = 'JSON';
                }

                scope.openExpressionDialog = function ($event) {

                    $mdDialog.show({
                        controller: 'JsonEditorDialogController as vm',
                        templateUrl: 'views/dialogs/json-editor-dialog-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
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

                            if(scope.onChangeCallback) {
                                scope.onChangeCallback();
                            }

                        }

                    });

                };

            }
        }
    }
}());