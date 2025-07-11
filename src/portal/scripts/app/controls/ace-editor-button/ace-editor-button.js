(function () {

    'use strict';

    module.exports = function ($mdDialog) {
        return {
            restriction: 'AE',
            templateUrl: 'views/controls/ace-editor-button/ace-editor-button.html',
            scope: {
                item: '=',
                data: '=',
                buttonText: '@'
            },
            link: function (scope, elem, attr) {

                if (scope.buttonText === undefined) {
                    scope.buttonText = '<\>';
                }

                scope.openExpressionDialog = function ($event) {

                    $mdDialog.show({
                        controller: 'AceEditorDialogController as vm',
                        templateUrl: 'views/dialogs/ace-editor-dialog-view.html',
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

                        }

                    });

                };

            }
        }
    }
}());