/**
 * Created by mevstratov on 08.10.2019.
 */
(function () {

    'use strict';

    module.exports = function ($mdDialog) {
        return {
            restrict: 'E',
            scope: {
                title: '@',
                dialogTitle: '@',
                availableAttrs: '<',
                item: '=', // contains 'key' of selected attribute
				contentType: '=',

                /*
                 * @type {Number|Array<Number>}
                 * value types to filter attributes by
                 * */
                valueType: '=',

                isReport: '@', // whether available attributes are from report ['true', 'false']
                isDisabled: '=',
                onChangeCallback: '&?'
            },
            templateUrl: 'views/directives/table-attribute-selector-view.html',
            link: function (scope, elem, attr) {

            	scope.isReport = !!scope.isReport;
                let selAttr = null;

                const getSelectedAttr = function () {

                    if (!scope.availableAttrs || !scope.availableAttrs.length) {
                        console.warn("tableAttributeSelectorDirective: no available attributes have passed")
                    }

                    if (!scope.item) {
                        return null;
                    }

                    const sAttr = scope.availableAttrs.find(
                        attr => attr.key === scope.item
                    );

                    if (sAttr) {
                        return sAttr;

                    } else {
                        console.error("tableAttributeSelectorDirective: selected attribute not found among available")
                        return null;
                    }

                }

                const getInputText = function () {

                    if (scope.item) {

                        /*for (var i = 0; i < scope.availableAttrs.length; i++) {
                            if (scope.availableAttrs[i].key === scope.item) {
                                scope.inputText = scope.availableAttrs[i].name;
                                break;
                            }
                        }*/
                        return selAttr.name;

                    }

                    return '';

                };

                scope.$watch('availableAttrs', function () {
                    selAttr = getSelectedAttr();
                });

                scope.$watch('item', function () {
                    selAttr = getSelectedAttr();
                    scope.inputText = getInputText();
                });

                const dialogParent = document.querySelector('.dialog-containers-wrap');

                elem[0].addEventListener('click', async function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    if (scope.isDisabled) {
                        return;
                    }

                    let availableAttrs = null;

                    if (scope.availableAttrs) {
                        availableAttrs = structuredClone(scope.availableAttrs);
                    }

                    const selectedAttrs = [];

                    if (selAttr) {
                        selectedAttrs.push( structuredClone(selAttr) );
                    }

                    /*$mdDialog.show({
                        controller: "TableAttributeSelectorDialogController as vm",
                        templateUrl: "views/dialogs/table-attribute-selector-dialog-view.html",
                        parent: dialogParent,
                        targetEvent: event,
                        multiple: true,
                        locals: {
                            data: {
                                availableAttrs: availableAttrs,
                                title: scope.dialogTitle,
								isReport: scope.isReport
                            }
                        }
                    })*/
                    const res = await $mdDialog.show({
                        controller: "AttributesSelectorDialogController as vm",
                        templateUrl: "views/dialogs/attributes-selector-dialog-view.html",
                        targetEvent: event,
                        parent: dialogParent,
                        multiple: true,
                        locals: {
                            data: {
                                title: scope.dialogTitle,
                                attributes: availableAttrs,
                                selectedAttributes: selectedAttrs,
                                valueType: scope.valueType,
                                contentType: scope.contentType,
                            }
                        }
                    });

                    if (res && res.status === "agree") {

                        if (res.data.items.length) {

                            scope.inputText = res.data.items[0].name;
                            scope.item = res.data.items[0].key;
                            selAttr = res.data.items[0];

                        }

                        if (scope.onChangeCallback) {

                            setTimeout(function () {

                                scope.onChangeCallback( structuredClone(selAttr) );

                            }, 0);

                        }

                    }

                });

                const init = function () {

                    selAttr = getSelectedAttr();

                };

                init();

            }
        };
    };

}());