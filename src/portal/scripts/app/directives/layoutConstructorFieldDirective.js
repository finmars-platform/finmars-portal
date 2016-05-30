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
                var attrs = scope.$parent.vm.attrs;
                var baseAttrs = scope.$parent.vm.baseAttrs[scope.$parent.vm.entityType];

                if (scope.item) {
                    var i, b;
                    for (i = 0; i < attrs.length; i = i + 1) {
                        if (attrs[i].id && scope.item.fieldId) {
                            if (attrs[i].id === scope.item.fieldId) {
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