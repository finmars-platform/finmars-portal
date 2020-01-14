(function () {

    'use strict';

    module.exports = function ($mdDialog) {
        return {
            restriction: 'E',
            templateUrl: 'views/directives/table-attributes-menu-constructor-view.html',
            scope: {
                title: '@',
                dialogTitle: '@',
                model: '=',
                availableAttrs: '<',
                nothingSelectedText: '@',
                onChangeCallback: '&?'
            },
            link: function (scope, elem, attr) {

                var setInputAndTooltipText = function () {
                    if (scope.model && scope.model.length > 0) {

                        var selectedAttrsString = '';

                        scope.model.forEach(function (attribute) {
                            if (selectedAttrsString) {
                                selectedAttrsString += ', '
                            }

                            if (attribute.layout_name) {

                                selectedAttrsString += attribute.layout_name;

                            } else {
                                selectedAttrsString += attribute.attribute_data.name;
                            }

                        });

                        scope.inputText = '[' + selectedAttrsString + ']';
                        scope.tooltipText = "Values selected: " + selectedAttrsString;

                    } else if (scope.nothingSelectedText) {

                        scope.inputText = scope.nothingSelectedText;

                    } else {

                        scope.inputText = "[ ]";

                    }
                };

                $(elem).click(function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    $mdDialog.show({
                        controller: "TableAttributesMenuConstructorDialogController as vm",
                        templateUrl: "views/dialogs/table-attributes-menu-constructor-dialog-view.html",
                        targetEvent: event,
                        multiple: true,
                        locals: {
                            data: {
                                title: scope.dialogTitle,
                                availableAttrs: scope.availableAttrs,
                                selectedAttrs: scope.model
                            }
                        }
                    }).then(function (res) {

                        if (res.status === "agree") {

                            scope.model = res.selectedAttrs;
                            setInputAndTooltipText();

                            if (scope.onChangeCallback) {

                                setTimeout(function () {
                                    scope.onChangeCallback();
                                }, 500);

                            }


                        }

                    });
                });

                setInputAndTooltipText();

            }
        }
    }
}());