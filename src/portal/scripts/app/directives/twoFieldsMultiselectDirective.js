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
            templateUrl: "views/directives/two-fields-multiselect-view.html",
            link: function (scope, elem, attr) {

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
                    }).then(function (data) {
                       if (data.status === "agree") {

                           scope.model = data.selectedItems;
                           setInputText();

                       }
                    });
                });
            }
        }
    };

}());