/**
 * Created by mevstratov on 25.03.2019.
 */
(function () {

    'use strict';

    module.exports = function ($mdDialog) {
        return {
            restrict: 'E',
            scope: {
                getDataMethod: '&?',
                items: '=',
                model: '=',
                title: "@",
                nothingSelectedText: "@",
                nameProperty: "@"
            },
            require: '?ngModel',
            templateUrl: "views/directives/two-fields-multiselect-view.html",
            link: function (scope, elem, attr, ngModel) {

                scope.inputText = '';

                var setInputText = function () {

                    var selElemNumber = 0;
                    if (scope.model && scope.model.length > 0) {
                        selElemNumber = scope.model.length;
                    }

                    if (selElemNumber === 0 && scope.nothingSelectedText) {
                        scope.inputText = scope.nothingSelectedText;
                    } else {
                        scope.inputText = selElemNumber + " " + "items selected";
                    }

                };

                setInputText();

                $(elem).click(function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    var items = [];
                    if (scope.items) {
                        items = JSON.parse(JSON.stringify(scope.items));
                    }

                    $mdDialog.show({
                        controller: "TwoFieldsMultiselectDialogController as vm",
                        templateUrl: "views/two-fields-multiselect-dialog-view.html",
                        targetEvent: event,
                        multiple: true,
                        locals: {
                            data: {
                                getDataMethod: scope.getDataMethod,
                                items: items,
                                model: scope.model,
                                title: scope.title,
                                nameProperty: scope.nameProperty
                            }
                        }
                    }).then(function (res) {

                        if (res.status === "agree") {

                           scope.model = res.selectedItems;

                           if (ngModel) {
                               ngModel.$setViewValue(res.selectedItems);
                           }

                           setInputText();

                       }

                    });
                });
            }
        }
    };

}());