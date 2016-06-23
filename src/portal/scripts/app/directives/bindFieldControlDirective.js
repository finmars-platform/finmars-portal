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

                scope.entityType = scope.$parent.vm.entityType;

                scope.entity = scope.$parent.vm.entity;

                var attrs = scope.$parent.vm.attrs;
                var choices = metaService.getValueTypes();
                var baseAttrs = metaService.getBaseAttrs();
                var entityAttrs = metaService.getEntityAttrs(scope.entityType);

                scope.layoutAttrs = layoutService.getLayoutAttrs();

                if (scope.item) {
                    scope.fieldType = null;
                    //console.log(scope.item);
                    scope.attribute = scope.item;

                    var i;
                    for (i = 0; i < choices.length; i = i + 1) {
                        if (choices[i].value === scope.attribute['value_type']) {
                            scope.fieldType = choices[i];
                        }
                    }
                }

                scope.getName = function(){
                    if(scope.item.options && scope.item.options.fieldName) {
                        return scope.item.options.fieldName;
                    }
                    return scope.item.name
                };

                scope.copyFromField = function(attr){
                    var attrObj = JSON.parse(attr);

                    if(attrObj.key) {
                        scope.entity[scope.getModelKey()] = scope.entity[attrObj.key];
                        console.log(scope.entity[scope.getModelKey()]);
                    }
                    if(attrObj.id) {
                        var resAttr = null;
                        attrs.forEach(function(item){
                            if(item.id === attrObj.id) {
                                resAttr = item;
                            }
                        });
                        scope.entity[scope.getModelKey()] = scope.entity[resAttr.name];
                    }
                };


                scope.dateFormatter = function () {
                    console.log('scope.entity[scope.getModelKey()]', scope.entity[scope.getModelKey()]);

                    //scope.entity[scope.getModelKey()] = moment(new Date(scope.entity[scope.getModelKey()])).format('YYYY-MM-DD');
                };

                scope.getModelKey = function () {
                    if (scope.item.hasOwnProperty('id') && scope.item.id !== null) {
                        return scope.item.name
                    } else {
                        var i, l, e;
                        for (i = 0; i < baseAttrs.length; i = i + 1) {
                            if (scope.item.name === baseAttrs[i].name) {
                                return baseAttrs[i].key;
                            }
                        }
                        for (l = 0; l < scope.layoutAttrs.length; l = l + 1) {
                            if (scope.item.name === scope.layoutAttrs[l].name) {

                                return scope.layoutAttrs[l].key;
                            }
                        }
                        for (e = 0; e < entityAttrs.length; e = e + 1) {
                            if (scope.item.name === entityAttrs[e].name) {
                                return entityAttrs[e].key;
                            }
                        }
                    }
                };

                scope.setDateToday = function () {
                    console.log('1232', scope.entity[scope.getModelKey()])
                    scope.entity[scope.getModelKey()] = new Date();
                    console.log('1232', scope.entity[scope.getModelKey()])
                };

                scope.setDatePlus = function () {
                    scope.entity[scope.getModelKey()] = new Date(new Date().setDate(new Date(scope.entity[scope.getModelKey()]).getDate() + 1));
                };

                scope.setDateMinus = function () {
                    scope.entity[scope.getModelKey()] =  new Date(new Date().setDate(new Date(scope.entity[scope.getModelKey()]).getDate() - 1));
                };

            }
        }
    }

}());