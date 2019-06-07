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

                    scope.inputText = selElemNumber + " " + "items selected";

                };

                setInputText();

                $(elem).click(function (event) {
                    console.log("filter twoFieldsMultiselect scope", scope.items, scope.model);
                    event.preventDefault();
                    event.stopPropagation();

                    $mdDialog.show({
                        controller: "TwoFieldsMultiselectDialogController as vm",
                        templateUrl: "views/two-fields-multiselect-dialog-view.html",
                        targetEvent: event,
                        multiple: true,
                        locals: {
                            data: {
                                getDataMethod: scope.getDataMethod,
                                items: scope.items,
                                model: scope.model,
                                title: scope.title,
                                nameProperty: scope.nameProperty
                            }
                        }
                    }).then(function (res) {
                       if (res.status === "agree") {

                           scope.model = res.selectedItems;
                           ngModel.$setViewValue(res.selectedItems);
                           console.log("filter twoFiieldsMutliselect", res);
                           setInputText();

                       }
                    });
                });
            }
        }
    };

}());