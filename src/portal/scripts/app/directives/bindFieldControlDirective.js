/**
 * Created by szhitenev on 16.05.2016.
 */
(function () {

    'use strict';

    var metaService = require('../services/metaService');
    var layoutService = require('../services/layoutService');
    var attributeTypeService = require('../services/attributeTypeService');

    module.exports = function () {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/bind-field-control-view.html',
            scope: {
                item: '='
            },
            link: function (scope, elem, attr) {

                scope.entityType = scope.$parent.vm.entityType;
                scope.readyStatus = {classifier: false};
                scope.entity = scope.$parent.vm.entity;

                var attrs = scope.$parent.vm.attrs || [];
                var userInputs = scope.$parent.vm.userInputs || [];
                var choices = metaService.getValueTypes() || [];
                var baseAttrs = metaService.getBaseAttrs() || [];
                var entityAttrs = metaService.getEntityAttrs(scope.entityType) || [];

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

                    if (scope.attribute['value_type'] == 100) {
                        scope.fieldType = choices[5]; // relation == field, backend&frontend naming conflict
                    }

                }

                scope.getName = function () {

                    if (scope.item.hasOwnProperty('verbose_name')) {
                        return scope.item.verbose_name
                    }

                    if (scope.item.options && scope.item.options.fieldName) {
                        return scope.item.options.fieldName;
                    }

                    return scope.item.name
                };

                scope.copyFromField = function (attr) {
                    var attrObj = JSON.parse(attr);

                    if (attrObj.key) {
                        scope.entity[scope.getModelKey()] = scope.entity[attrObj.key];
                        console.log(scope.entity[scope.getModelKey()]);
                    }
                    if (attrObj.id) {
                        var resAttr = null;
                        attrs.forEach(function (item) {
                            if (item.id === attrObj.id) {
                                resAttr = item;
                            }
                        });
                        scope.entity[scope.getModelKey()] = scope.entity[resAttr.name];
                    }
                };

                scope.checkValid = function () {

                    if (scope.entity.$_isValid == false) {
                        var item = scope.entity[scope.getModelKey()];
                        if (item == null || item == '' || item == undefined) {
                            return true
                        }
                    }

                    return false

                };

                scope.dateFormatter = function () {
                    //console.log('scope.entity[scope.getModelKey()]', scope.entity[scope.getModelKey()]);

                    //scope.entity[scope.getModelKey()] = moment(new Date(scope.entity[scope.getModelKey()])).format('YYYY-MM-DD');
                };

                scope.getModelKey = function () {

                    if (scope.item) {
                        if (scope.item.hasOwnProperty('id') && scope.item.id !== null) {

                            //console.log('scope,entity', scope.entity);

                            return scope.item.name
                        } else {
                            var i, l, e, u;
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
                            for (u = 0; u < userInputs.length; u = u + 1) {
                                if (scope.item.name === userInputs[u].name) {
                                    return userInputs[u].name;
                                }
                            }
                        }
                    }
                };

                var fieldKey = scope.getModelKey();

                scope.options = {};

                if (fieldKey == 'tags') {
                    scope.options = {
                        entityType: scope.entityType
                    }
                } else {
                    if (metaService.getEntitiesWithSimpleFields().indexOf(scope.entityType) !== -1) {
                        scope.options = {
                            entityType: scope.entityType,
                            key: fieldKey
                        };
                    }
                }

                scope.setDateToday = function () {
                    //console.log('1232', scope.entity[scope.getModelKey()])
                    scope.entity[scope.getModelKey()] = new Date();
                    //console.log('1232', scope.entity[scope.getModelKey()])
                };

                scope.setDatePlus = function () {
                    scope.entity[scope.getModelKey()] = new Date(new Date().setDate(new Date(scope.entity[scope.getModelKey()]).getDate() + 1));
                };

                scope.setDateMinus = function () {
                    scope.entity[scope.getModelKey()] = new Date(new Date().setDate(new Date(scope.entity[scope.getModelKey()]).getDate() - 1));
                };

                scope.node = scope.node || null;

                function findNodeInChildren(item) {
                    if (scope.classifierId == item.id) {
                        scope.node = item;
                    } else {
                        if (item.children.length) {
                            item.children.forEach(findNodeInChildren);
                        }
                    }
                }

                var classifierTree;

                function getNode() {
                    return attributeTypeService.getByKey(scope.entityType, scope.item.id).then(function (data) {
                        classifierTree = data;
                        classifierTree.classifiers.forEach(findNodeInChildren);
                        return scope.node;
                    });
                }

                scope.findNodeItem = function () {
                    scope.readyStatus.classifier = false;
                    return new Promise(function (resolve) {
                        getNode().then(function (data) {
                            scope.readyStatus.classifier = true;
                            scope.node = data;
                            scope.entity[scope.getModelKey()] = scope.classifierId;
                            resolve(undefined)
                        });
                    })
                };

                if (scope.fieldType && scope.fieldType.value == 30) {

                    if (scope.entity) {

                        scope.classifierId = scope.entity[scope.getModelKey()];

                        scope.findNodeItem().then(function () {
                            scope.$apply();
                        })
                    }
                }

                scope.changeWatcher = function () {
                    localStorage.setItem('entityIsChanged', true);
                };

                scope.changeClassifier = function () {
                    if (classifierTree) {
                        //localStorage.setItem('entityIsChanged', true);
                        scope.classifierId = scope.entity[scope.getModelKey()];

                        scope.findNodeItem().then(function () {
                            classifierTree.classifiers.forEach(findNodeInChildren);
                            scope.$apply();
                        })
                    }
                };

            }
        }
    }

}());