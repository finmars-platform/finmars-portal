(function () {

    'use strict';

    module.exports = function ($mdDialog) {
        return {
            restriction: 'AE',
            templateUrl: 'controls/use-from-above-button/use-from-above-button.html',
            scope: {
                item: '=',
                data: '='
            },
            link: function (scope, elem, attr) {

                scope.openUseFromAboveDialog = function ($event) {

                    console.log('control item', scope.item);
                    console.log('control data', scope.data);

                    $mdDialog.show({
                        controller: 'UseFromAboveDialogController as vm',
                        templateUrl: 'views/dialogs/use-from-above-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        preserveScope: true,
                        multiple: true,
                        autoWrap: true,
                        skipHide: true,
                        locals: {
                            item: scope.item,
                            data: scope.data
                        }
                    }).then(function (res) {

                        if (res.status === 'agree') {

                            scope.item = res.data.item;

                        }

                    });

                };

            }
        }
    }
}());