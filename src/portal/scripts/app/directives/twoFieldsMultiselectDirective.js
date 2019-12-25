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
                selectedItemsIndication: "@",
                nameProperty: "@",
                onChangeCallback: '&?'
            },
            require: '?ngModel',
            templateUrl: "views/directives/two-fields-multiselect-view.html",
            link: function (scope, elem, attr, ngModel) {

                scope.inputText = '';

                if (!scope.nameProperty) {
                    scope.nameProperty = 'name';
                }

                scope.$watch('model', function () {
                    setInputText();
                });

                var defaultInputText = function () {

                    var selElemNumber = 0;
                    if (scope.model && scope.model.length > 0) {
                        selElemNumber = scope.model.length;
                    }

                    if (selElemNumber === 0) {

                        scope.inputText = "";

                        if (scope.nothingSelectedText || typeof scope.nothingSelectedText === "string") {
                            scope.inputText = scope.nothingSelectedText;
                        } else {
                            scope.inputText = "0 items selected"
                        }

                    } else {
                        scope.inputText = selElemNumber + " " + "items selected";
                    }

                };

                var arrayLikeInputText = function () {

                    if (scope.model && scope.model.length > 0) {

                        scope.inputText = '[' + scope.model.join(', ') + ']';

                    } else if (scope.nothingSelectedText) {

                        scope.inputText = scope.nothingSelectedText;

                    } else {

                        scope.inputText = "[ ]";

                    }

                };

                var setInputText = function () {

                    if (scope.selectedItemsIndication) {

                        switch (scope.selectedItemsIndication) {
                            case "array":
                                arrayLikeInputText();
                                break;
                        }

                    } else {
                        defaultInputText();
                    }

                };

                //setInputText();

                $(elem).click(function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    var items = [];
                    if (scope.items) {
                        items = JSON.parse(JSON.stringify(scope.items));
                    }

                    $mdDialog.show({
                        controller: "TwoFieldsMultiselectDialogController as vm",
                        templateUrl: "views/dialogs/two-fields-multiselect-dialog-view.html",
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

                           if (scope.onChangeCallback) {
                               scope.model = res.selectedItems;

                               setTimeout(function () {
                                   scope.onChangeCallback();
                               }, 500);

                           } else if (ngModel) {
                               ngModel.$setViewValue(res.selectedItems);
                           }


                           //setInputText();

                       }

                    });
                });
            }
        }
    };

}());