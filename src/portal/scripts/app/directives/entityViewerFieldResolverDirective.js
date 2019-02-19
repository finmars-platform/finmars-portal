/**
 * Created by szhitenev on 17.06.2016.
 */
(function () {

    'use strict';

    var fieldResolverService = require('../services/fieldResolverService');
    var bindFieldsHelper = require('../helpers/bindFieldsHelper');
    var metaService = require('../services/metaService');
    var tagService = require('../services/tagService');

    module.exports = function ($scope) {

        return {
            scope: {
                item: '=',
                entity: '=',
                content_type: '=',
                options: '=',
                entityType: '='
            },
            templateUrl: 'views/entity-viewer/field-resolver-view.html',
            link: function (scope, elem, attrs) {

                scope.readyStatus = {content: false, tags: false};
                scope.type = '';

                scope.isSpecialSearchRelation = function () {

                    return ['instrument', 'portfolio', 'account', 'responsible', 'counterparty'].indexOf(scope.getModelKeyEntity()) !== -1;

                };

                scope.getModelKeyEntity = function () {
                    var key = scope.getModelKey();
                    var result = key;

                    if (key === 'linked_instrument') {
                        result = 'instrument'
                    }

                    if (key === 'account_interim') {
                        result = 'account';
                    }

                    if (key === 'account_cash') {
                        result = 'account';
                    }

                    if (key === 'account_position') {
                        result = 'account';
                    }


                    return result;
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

                scope.changeWatcher = function () {
                    localStorage.setItem('entityIsChanged', true);
                };

                scope.bindFormFields = function () {

                    var id = scope.entity[scope.getModelKey()];
                    if (id) {
                        var i;
                        var attr;

                        for (i = 0; i < scope.fields.length; i = i + 1) {
                            if (id == scope.fields[i].id) {
                                attr = scope.fields[i]
                            }
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

                            return resultCaption
                        }

                        return attr.name
                    } else {
                        return scope.getName();
                    }
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
                    }
                    else {
                        return scope.getName();
                    }
                };

                scope.getModelKey = scope.$parent.getModelKey;

            }

        }
    }
}());