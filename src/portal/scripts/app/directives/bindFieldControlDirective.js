/**
 * Created by szhitenev on 16.05.2016.
 */
(function () {

    'use strict';

    module.exports = function () {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/bind-field-control-view.html',
            scope: {
                item: '='
            },
            link: function (scope, elem, attr) {

                scope.portfolio = scope.$parent.vm.portfolio;

                //Warning hardcode!
                var choices = [{
                    "value": 20,
                    "display_name": "Number"
                }, {
                    "value": 10,
                    "display_name": "String"
                }, {
                    "value": 40,
                    "display_name": "Date"
                }, {
                    "value": 30,
                    "display_name": "Classifier"
                }];

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


                scope.fieldType = null;
                scope.attribute = scope.item;

                var i;
                for (i = 0; i < choices.length; i = i + 1) {
                    if (choices[i].value === scope.attribute['value_type']) {
                        scope.fieldType = choices[i];
                    }
                }

                scope.getModelKey = function () {
                    if (scope.item.hasOwnProperty('id')) {
                        return scope.item.name
                    } else {
                        var i;
                        for(i = 0; i < baseAttrs.length; i = i + 1) {
                            if(scope.item.name === baseAttrs[i].caption) {
                                return baseAttrs[i].key;
                            }
                        }
                    }
                }

            }
        }
    }

}());