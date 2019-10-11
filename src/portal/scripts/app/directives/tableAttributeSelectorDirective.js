/**
 * Created by mevstratov on 08.10.2019.
 */
(function () {

    'use strict';

    module.exports = function ($mdDialog) {
        return {
            restrict: 'E',
            scope: {
                title: '<',
                availableAttrs: '<',
                item: '=',
                dialogTitle: '<'
            },
            templateUrl: 'views/directives/table-attribute-selector-view.html',
            link: function (scope, elem, attr) {

                var getInputText = function () {

                    if (scope.item) {

                        for (var i = 0; i < scope.availableAttrs.length; i++) {
                            if (scope.availableAttrs[i].key === scope.item) {
                                scope.inputText = scope.availableAttrs[i].name;
                                break;
                            };
                        };

                    } else {
                        scope.inputText = '';
                    }

                };

                getInputText();

                $(elem).click(function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    var availableAttrs = null;
                    if (scope.availableAttrs) {
                        availableAttrs = JSON.parse(JSON.stringify(scope.availableAttrs));
                    };

                    $mdDialog.show({
                        controller: "TableAttributeSelectorDialogController as vm",
                        templateUrl: "views/dialogs/table-attribute-selector-dialog-view.html",
                        targetEvent: event,
                        multiple: true,
                        locals: {
                            data: {
                                item: scope.item,
                                availableAttrs: availableAttrs,
                                title: scope.dialogTitle
                            }
                        }
                    }).then(function (res) {

                        if (res && res.status === "agree") {

                            scope.inputText = res.data.name;
                            scope.item = res.data.key;

                        };

                    });
                });

            }
        };
    };

}());