/**
 * Created by szhitenev on 17.06.2016.
 */
(function () {

    'use strict';

    var fieldResolverService = require('../services/fieldResolverService');
    var bindFieldsHelper = require('../helpers/bindFieldsHelper');
    var metaService = require('../services/metaService');
    var tagService = require('../services/tagService');
    var metaContentTypesService = require('../services/metaContentTypesService');

    module.exports = function ($scope) {

        return {
            scope: {
                item: '=',
                entity: '=',
                content_type: '=',
                options: '=',
                entityType: '=',
                itemChange: '&'
            },
            templateUrl: 'views/directives/entity-viewer-field-resolver-view.html',
            link: function (scope, elem, attrs) {

                scope.readyStatus = {content: false, tags: false};
                scope.type = 'id';
                scope.fields = [];

                // console.log('scope.item.name', scope.item);
                // console.log('scope.entity', scope.entity);

                if (['counterparties', 'accounts', 'responsibles', 'transaction_types', 'tags'].indexOf(scope.item.key) !== -1) {
                    scope.type = 'multiple-ids';
                }

                // console.log('scope.type', scope.type);

                scope.isSpecialSearchRelation = function () {

                    return ['instrument', 'portfolio', 'account', 'responsible', 'counterparty', 'strategy-1', 'strategy-2', 'strategy-3'].indexOf(scope.getModelKeyEntity()) !== -1;

                };

                scope.getModelKeyEntity = function () {
                    //var key;
                    var modelKeyEntity;

                    if (scope.entityType === 'complex-transaction') {

                        modelKeyEntity = metaContentTypesService.findEntityByContentType(scope.item.content_type)

                        // console.log('modelKeyEntity', modelKeyEntity);

                    } else {

                        if (scope.item.key && ['linked_instrument', 'allocation_balance', 'allocation_pl'].indexOf(scope.item.key) !== -1) {
                            modelKeyEntity = 'instrument';
                        } else {

                            switch (scope.item.name) {
                                case 'account_interim':
                                case 'account_cash':
                                case 'account_position':
                                    modelKeyEntity = 'account';
                                    break;
                            }

                        }
                    }

                    return modelKeyEntity;
                };

                scope.resolveMultiple = function () {
                    if (scope.$parent.entityType !== 'instrument-type') { // refactor this
                        return true
                    }
                    if (scope.item.key == 'tags') {
                        return true;
                    }
                    return false;
                };

                scope.getFieldsGrouped = function () {

                    if (metaService.getFieldsWithTagGrouping().indexOf(scope.item.key) !== -1) {

                        var entityType = scope.item.key.replace('_', '-'); // refactor this

                        if (entityType === 'transaction-types') {
                            entityType = 'transaction-type'
                        }

                        if (scope.item.key === 'type') {
                            entityType = 'account-type';
                        }

                        console.log('getFieldsGrouped.entityType', entityType);

                        tagService.getListByContentType(entityType).then(function (data) { //refactor entityType getter
                            scope.tags = data.results;

                            scope.groups = bindFieldsHelper.groupFieldsByTagsWithDuplicates(scope.fields, scope.tags);

                            scope.readyStatus.tags = true;

                            scope.$apply(function () {

                                setTimeout(function () {
                                    $(elem).find('.md-select-search-pattern').on('keydown', function (ev) {
                                        ev.stopPropagation();
                                    });
                                }, 100);
                            })
                        })
                    }
                };

                scope.searchTerm = '';

                scope.resolveSort = function (field) {
                    if (field) {
                        if (field.hasOwnProperty('name')) {
                            return field.name
                        }
                        if (field.hasOwnProperty('user_code')) {
                            return field.user_code
                        }
                        if (field.hasOwnProperty('public_name')) {
                            return field.public_name
                        }
                    }
                };

                scope.checkComplexEntityType = function () {
                    if (metaService.getFieldsWithTagGrouping().indexOf(scope.item.key) !== -1) {
                        return true
                    }
                    return false
                };

                scope.getName = function () {

                    if (scope.item.hasOwnProperty('verbose_name')) {
                        return scope.item.verbose_name
                    }

                    if (scope.item.options && scope.item.options.fieldName) {
                        return scope.item.options.fieldName;
                    }
                    return scope.item.name
                };

                scope.bindFormFields = function () {

                    var result = '';

                    var id = scope.entity[scope.getModelKey()];
                    if (id) {
                        var i;
                        var attr;

                        for (i = 0; i < scope.fields.length; i = i + 1) {
                            if (id === scope.fields[i].id) {
                                attr = scope.fields[i]
                            }
                        }

                        if (attr) {
                            result = attr.name;
                        }

                        if (scope.item.options && scope.item.options.fieldsForm) {
                            var resultCaption = '';
                            scope.item.options.fieldsForm.forEach(function (item, index) {
                                if (index + 1 === scope.item.options.fieldsForm.length) {
                                    resultCaption = resultCaption + attr[item];
                                } else {
                                    resultCaption = resultCaption + attr[item] + ' / ';
                                }
                            });

                            result = resultCaption
                        }


                    } else {
                        result = scope.getName();
                    }

                    return result
                };

                scope.bindListFields = function (field) {
                    //console.log('scope.item.options', scope.item.options);
                    if (scope.item.options && scope.item.options.fieldsList) {
                        var resultCaption = '';
                        scope.item.options.fieldsList.forEach(function (item, index) {
                            if (index + 1 === scope.item.options.fieldsList.length) {
                                resultCaption = resultCaption + field[item];
                            } else {
                                resultCaption = resultCaption + field[item] + ' / ';
                            }
                        });

                        return resultCaption
                    }

                    return field.name
                };

                scope.bindMCField = function (model) {
                    if (scope.entity[scope.getModelKey()] && scope.entity[scope.getModelKey()].length > 0) {
                        return '[' + scope.entity[scope.getModelKey()].length + '] selected';
                    } else {
                        return scope.getName();
                    }
                };

                scope.getInputTextForEntitySearch = function () {

                    var result = '';

                    if (scope.fields[0]) {
                        result = scope.fields[0].name;
                    }

                    return result
                };

                scope.getModelKey = scope.$parent.getModelKey;

                if (scope.item.value_entity) {
                    scope.crudEntityType = scope.item.value_entity;
                } else {
                    scope.crudEntityType = scope.item.entity;
                }

                scope.checkForCrudSelects = function () {

                    if (['group', 'subgroup'].indexOf(scope.getModelKey()) !== -1) {
                        return true;
                    }

                    return false
                };

                scope.getData = function () {

                    console.log('getData.key', scope.item.key);
                    console.log('getData.scope', scope);

                    if (scope.entityType === 'complex-transaction') {

                        fieldResolverService.getFieldsByContentType(scope.item.content_type, scope.options).then(function (res) {

                            scope.type = res.type;
                            scope.fields = res.data;
                            scope.readyStatus.content = true;

                            console.log('getData', res);

                            scope.getFieldsGrouped();

                            scope.$apply(function () {

                                setTimeout(function () {
                                    $(elem).find('.md-select-search-pattern').on('keydown', function (ev) {
                                        ev.stopPropagation();
                                    });
                                }, 100);
                            });
                        });

                    } else {

                        fieldResolverService.getFields(scope.item.key, scope.options).then(function (res) {

                            scope.type = res.type;
                            scope.fields = res.data;
                            scope.readyStatus.content = true;

                            scope.getFieldsGrouped();

                            scope.$apply(function () {

                                setTimeout(function () {
                                    $(elem).find('.md-select-search-pattern').on('keydown', function (ev) {
                                        ev.stopPropagation();
                                    });
                                }, 100);
                            });
                        });

                    }
                };

                scope.$watch('item', function () {

                    if (scope.fields.length === 1) { // only for smart search

                        scope.fields = [];

                        var item_object;

                        if (scope.entityType === 'complex-transaction') {
                            item_object = scope.entity[scope.item.name + '_object'];
                        } else {
                            item_object = scope.entity[scope.item.key + '_object'];
                        }

                        if (item_object) {

                            if (Array.isArray(item_object)) {
                                scope.fields = item_object;
                            } else {
                                scope.fields.push(item_object);
                            }
                        }

                    }

                    scope.inputText = scope.getInputTextForEntitySearch()

                });

                scope.changeHandler = function () {
                    if (scope.itemChange) {
                        scope.itemChange()
                    }
                };


                scope.init = function () {

                    var item_object;

                    if (scope.entityType === 'complex-transaction') {
                        item_object = scope.entity[scope.item.name + '_object'];
                    } else {
                        item_object = scope.entity[scope.item.key + '_object'];
                    }

                    if (item_object) {

                        if (Array.isArray(item_object)) {
                            scope.fields = item_object;
                        } else {
                            scope.fields.push(item_object);
                        }
                    }


                    scope.inputText = scope.getInputTextForEntitySearch()

                };

                scope.init()

            }

        }
    }
}());