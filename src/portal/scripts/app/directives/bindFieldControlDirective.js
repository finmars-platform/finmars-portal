/**
 * Created by szhitenev on 16.05.2016.
 */
(function () {

    'use strict';

    var metaService = require('../services/metaService');
    var layoutService = require('../services/layoutService');

    module.exports = function () {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/bind-field-control-view.html',
            scope: {
                item: '='
            },
            link: function (scope, elem, attr) {

                scope.portfolio = scope.$parent.vm.portfolio;

                var choices = metaService.getValueTypes();

                var baseAttrs = [{
                    "key": "name",
                    "caption": "Name"
                }, {
                    "key": "short_name",
                    "caption": "Short name"
                }, {
                    "key": "notes",
                    "caption": "Notes"
                }];

                scope.layoutAttrs = layoutService.getLayoutAttrs();

                console.log('12321321x',scope.item);
                if(scope.item) {
                    scope.fieldType = null;
                    console.log(scope.item);
                    scope.attribute = scope.item;

                    var i;
                    for (i = 0; i < choices.length; i = i + 1) {
                        if (choices[i].value === scope.attribute['value_type']) {
                            scope.fieldType = choices[i];
                        }
                    }
                }

                scope.getModelKey = function () {
                    if (scope.item.hasOwnProperty('id')) {
                        return scope.item.name
                    } else {
                        var i, l;
                        for(i = 0; i < baseAttrs.length; i = i + 1) {
                            if(scope.item.name === baseAttrs[i].caption) {
                                return baseAttrs[i].key;
                            }
                        }
                        for(l = 0; l < scope.layoutAttrs.length; l = l + 1) {
                            if(scope.item.name === scope.layoutAttrs[l].name) {
                                return scope.layoutAttrs[l].key;
                            }
                        }
                    }
                }

            }
        }
    }

}());