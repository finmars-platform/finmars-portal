/**
 * Created by mevstratov on 25.03.2019.
 */
(function () {

    'use strict';

    module.exports = function ($mdDialog) {
        return {
            restrict: 'E',
            scope: {
                getDataMethod: '&',
                selectedItems: '=',
                title: "@",
                nameProperty: "@"
            },
            templateUrl: "views/directives/two-fields-multiselect-view.html",
            link: function (scope, elem, attr) {

                scope.inputText = '';

                var setInputText = function () {

                    var selElemNumber = 0;
                    if (scope.selectedItems && scope.selectedItems.length > 0) {
                        selElemNumber = scope.selectedItems.length;
                    }

                    scope.inputText = selElemNumber + " " + "items have been selected";

                };

                setInputText();

                $(elem).click(function (event) {

                    $mdDialog.show({
                        controller: "TwoFieldsMultiselectDialogController as vm",
                        templateUrl: "views/two-fields-multiselect-dialog-view.html",
                        targetEvent: event,
                        multiple: true,
                        locals: {
                            data: {
                                getDataMethod: scope.getDataMethod,
                                selectedItems: scope.selectedItems,
                                title: scope.title,
                                nameProperty: scope.nameProperty
                            }
                        }
                    }).then(function (data) {
                       if (data.status === "agree") {

                           scope.selectedItems = data.selectedItems;
                           setInputText();

                       }
                    });
                });
            }
        }
    };

}());