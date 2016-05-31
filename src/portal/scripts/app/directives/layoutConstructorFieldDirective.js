/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var metaService = require('../services/metaService');

    module.exports = function () {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/layout-constructor-field-view.html',
            scope: {
                item: '=',
                tab: '='
            },
            link: function (scope, elem, attr) {
                var choices = metaService.getValueTypes();

                scope.fieldType = null;
                scope.editMode = false;
                var attrs = scope.$parent.vm.attrs;
                var baseAttrs = scope.$parent.vm.baseAttrs[scope.$parent.vm.entityType];
                var tabs = scope.$parent.vm.tabs;

                scope.attrsLeft = attrs.concat(baseAttrs);

                scope.toggleEditMode = function () {
                    scope.editMode = !scope.editMode;
                };

                scope.saveLayout = function () {

                    console.log('scope.attribute', scope.attribute);
                    scope.editMode = false;
                    scope.$parent.vm.saveLayout();
                };

                scope.getCols = function () {
                    return [
                        1,
                        2
                    ]
                };

                scope.changeModel = function (item) {
                    scope.attribute = item;
                };

                if (scope.item) {
                    var i, b;
                    for (i = 0; i < attrs.length; i = i + 1) {
                        if (attrs[i].id && scope.item.id) {
                            if (attrs[i].id === scope.item.id) {
                                scope.attribute = attrs[i];
                            }
                        } else {
                            for (b = 0; b < baseAttrs.length; b = b + 1) {
                                if (baseAttrs[b].name === scope.item.name) {
                                    scope.attribute = baseAttrs[b];
                                }
                            }
                        }
                    }
                }

                function findAttrsLeft() {
                    var i, x, t;
                    for (t = 0; t < tabs.length; t = t + 1) {
                        for (i = 0; i < tabs[t].layout.fields.length; i = i + 1) {
                            for (x = 0; x < scope.attrsLeft.length; x = x + 1) {
                                if (tabs[t].layout.fields[i].id && scope.attrsLeft[x].id) {
                                    if (tabs[t].layout.fields[i].id === scope.attrsLeft[x].id) {
                                        if (scope.attribute.id !== scope.attrsLeft[x].id) {
                                            scope.attrsLeft.splice(x, 1);
                                            x = x - 1;
                                        }
                                    }
                                }
                                else {
                                    if (tabs[t].layout.fields[i].name === scope.attrsLeft[x].name) {
                                        if (scope.attribute.name !== scope.attrsLeft[x].name) {
                                            scope.attrsLeft.splice(x, 1);
                                            x = x - 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                findAttrsLeft();


                scope.bindType = function () {
                    var i;
                    for (i = 0; i < choices.length; i = i + 1) {
                        if (scope.attribute["value_type"] === choices[i].value) {
                            return choices[i]["display_name"];
                        }
                    }
                };
            }
        }
    }

}());