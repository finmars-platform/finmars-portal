(function () {

    'use strict';

    module.exports = function ($mdDialog) {
        return {
            restriction: 'AE',
            templateUrl: 'controls/package-manager-button/package-manager-button.html',
            scope: {
                contentType: '=',
                buttonText: '@',
                callbackFn: '&'
            },
            link: function (scope, elem, attr) {

                if (scope.buttonText === undefined) {
                    scope.buttonText = 'Select from List';
                }

                scope.openExpressionDialog = function ($event) {

                    $mdDialog.show({
                        controller: 'ConfigurationPackageDialogController as vm',
                        templateUrl: 'views/dialogs/configuration-package-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        preserveScope: true,
                        multiple: true,
                        autoWrap: true,
                        skipHide: true,
                        locals: {
                            data: {
                                contentType: scope.contentType
                            }
                        }
                    }).then(function (res) {

                        if (res.status === 'agree') {

                            scope.callbackFn()

                        }

                    });

                };

            }
        }
    }
}());