/**
 * Created by szhitenev on 17.06.2016.
 */
(function () {

    'use strict';

    var evEditorEvents = require('../services/ev-editor/entityViewerEditorEvents');

    var fieldResolverService = require('../services/fieldResolverService');
    var bindFieldsHelper = require('../helpers/bindFieldsHelper');
    var metaService = require('../services/metaService');
    var tagService = require('../services/tagService');
    var metaContentTypesService = require('../services/metaContentTypesService');

    module.exports = function () {

        return {
            scope: {
                item: '=',
                entity: '=',
                content_type: '=',
                options: '=',
                entityType: '=',
                evEditorDataService: '=',
                evEditorEventService: '=',
                itemChange: '&'
            },
            templateUrl: 'views/directives/entity-viewer-field-resolver-view.html',
            link: function (scope, elem, attrs) {

                scope.readyStatus = {content: false, tags: false};
                scope.type = 'id';
                scope.fields = [];
                scope.ciEventObj = {
                    event: {}
                };

                var fieldsDataIsLoaded = false;
                // console.log('scope.item.name', scope.item);
                // console.log('scope.entity', scope.entity);

                if (['counterparties', 'accounts', 'responsibles', 'transaction_types', 'tags'].indexOf(scope.item.key) !== -1) {
                    scope.type = 'multiple-ids';
                }

                // console.log('scope.type', scope.type);

                scope.isSpecialSearchRelation = function () {
                    return [
                        'instrument', 'portfolio', 'account', 'responsible', 'counterparty', 'strategy-1', 'strategy-2', 'strategy-3',
                        'currency'
                    ].indexOf(scope.getModelKeyEntity()) !== -1;
                };

                scope.getModelKeyEntity = function () {
                    //var key;
                    var modelKeyEntity;

                    if (scope.entityType === 'complex-transaction') {

                        modelKeyEntity = metaContentTypesService.findEntityByContentType(scope.item.content_type);

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

                            scope.$apply();
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

                scope.inputBackgroundColor = function () {
                    var backgroundColor = '';

                    if (scope.options.backgroundColor) {
                        backgroundColor = 'background-color: ' + scope.options.backgroundColor + ';';
                    }

                    return backgroundColor;
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

                    var id = scope.entity[scope.fieldKey];
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

                            result = resultCaption;

                        }


                    } else {
                        result = scope.getName();
                    }

                    return result
                };

                scope.bindListFields = function (field) {

                    if (scope.item.options && scope.item.options.fieldsList) {
                        var resultCaption = '';
                        scope.item.options.fieldsList.forEach(function (item, index) {
                            if (index + 1 === scope.item.options.fieldsList.length) {
                                resultCaption = resultCaption + field[item];
                            } else {
                                resultCaption = resultCaption + field[item] + ' / ';
                            }
                        });

                        return resultCaption;
                    }

                    return field.name;
                };

                scope.bindMCField = function (model) {
                    if (scope.entity[scope.fieldKey] && scope.entity[scope.fieldKey].length > 0) {
                        return '[' + scope.entity[scope.fieldKey].length + '] selected';
                    } else {
                        return scope.getName();
                    }
                };

                scope.getInputTextForEntitySearch = function () {

                    var result = '';

                    /*if (scope.fields[0]) {
                        if (scope.fields[0].name) {
                            result = scope.fields[0].name;
                        } else {
                            result = scope.fields[0].public_name;
                        }
                    }*/
                    if (scope.fields[0]) {

                        if (scope.fields[0].short_name) {
                            result = scope.fields[0].short_name;

                        } else if (scope.fields[0].name) {
                            result = scope.fields[0].name;

                        } else {
                            result = scope.fields[0].public_name;
                        }

                    }

                    return result;
                };

                //scope.getModelKey = scope.$parent.getModelKey;
                scope.fieldKey = scope.$parent.fieldKey;

                if (scope.item.value_entity) {
                    scope.crudEntityType = scope.item.value_entity;
                } else {
                    scope.crudEntityType = scope.item.entity;
                }

                scope.checkForCrudSelects = function () {

                    if (['group', 'subgroup'].indexOf(scope.fieldKey) !== -1) {
                        return true;
                    }

                    return false
                };

                scope.getData = function () {
                    console.log('getData.key', scope.item.key);
                    if (!fieldsDataIsLoaded) {
                        var options = {};

                        if (scope.options.entityType) {
                            options.entityType = scope.options.entityType;
                        }

                        if (scope.options.key) {
                            options.key = scope.options.key;
                        }

                        if (scope.entityType === 'complex-transaction') {

                            fieldResolverService.getFieldsByContentType(scope.item.content_type, options).then(function (res) {

                                scope.type = res.type;
                                scope.fields = res.data;
                                scope.readyStatus.content = true;
                                fieldsDataIsLoaded = true;

                                scope.getFieldsGrouped();

                                scope.$apply();
                            });

                        } else {

                            fieldResolverService.getFields(scope.item.key, options).then(function (res) {

                                scope.type = res.type;
                                scope.fields = res.data;
                                scope.readyStatus.content = true;
                                fieldsDataIsLoaded = true;

                                scope.getFieldsGrouped();

                                scope.$apply();
                            });

                        }

                    }

                };

                scope.$watch('item', function () {

                    fieldsDataIsLoaded = false;

                    //if (scope.fields.length === 1) { // only for smart search

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

                    //}

                    scope.inputText = scope.getInputTextForEntitySearch()

                });

                scope.changeHandler = function () {
                    if (scope.itemChange) {
                        scope.itemChange()
                    }
                };

                var setItemSpecificSettings = function () {

                    if (scope.options.backgroundColor) {

                        scope.customStyles = {
                            'custom-input-main-container': 'background-color: ' + scope.options.backgroundColor + ';',
                            'custom-input-custom-btns-holder': 'background-color: ' + scope.options.backgroundColor + ';'
                        }

                    }

                    if (scope.item.frontOptions) {
                        /*if (scope.item.frontOptions.recalculated === 'input' || scope.item.frontOptions.autocalculated) {
                            scope.ciEventObj.event = {key: 'set_style_preset1'};

                        } else if (scope.item.frontOptions.recalculated === 'linked_inputs') {
                            scope.ciEventObj.event = {key: 'set_style_preset2'};

                        }*/
                        if (scope.item.frontOptions.recalculated || scope.item.frontOptions.autocalculated) {
                            scope.ciEventObj.event = {key: 'set_style_preset1'};
                        }

                    }

                    scope.tooltipText = scope.getName();

                    if (scope.item.options) {

                        if (scope.item.options.tooltipValue) {
                            scope.tooltipText = scope.item.options.tooltipValue;
                        }

                    }

                }

                var initListeners = function () {
                    scope.evEditorEventService.addEventListener(evEditorEvents.MARK_FIELDS_WITH_ERRORS, function () {
                        scope.ciEventObj.event = {key: 'mark_not_valid_fields'};
                    });

                    scope.evEditorEventService.addEventListener(evEditorEvents.FIELDS_RECALCULATED, function () {

                        if (scope.item && scope.item.frontOptions &&
                            (scope.entity[scope.fieldKey] || scope.entity[scope.fieldKey] === 0)) {

                            setItemSpecificSettings();
                            /*if (scope.item.frontOptions.recalculated === 'input') {
                                scope.ciEventObj.event = {key: 'set_style_preset1'};

                            } else if (scope.item.frontOptions.recalculated === 'linked_inputs') {
                                scope.ciEventObj.event = {key: 'set_style_preset2'};

                            }*/
                            if (scope.item.frontOptions.recalculated || scope.item.frontOptions.autocalculated) {
                                scope.ciEventObj.event = {key: 'set_style_preset1'};
                            }

                        }

                    });

                    scope.evEditorEventService.addEventListener(evEditorEvents.FIELD_CHANGED, function () {

                        var changedUserInputData = scope.evEditorDataService.getChangedUserInputData();

                        if (changedUserInputData && changedUserInputData.frontOptions &&
                            changedUserInputData.frontOptions.linked_inputs_names) {

                            if (changedUserInputData.frontOptions.linked_inputs_names.indexOf(scope.fieldKey) > -1) {
                                scope.ciEventObj.event = {key: 'set_style_preset2'};
                            }

                        }

                    });
                };

                scope.init = function () {

                    if (scope.evEditorEventService) {
                        initListeners();
                    }

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

                    var tooltipsList = scope.evEditorDataService.getTooltipsData();

                    for (var i = 0; i < tooltipsList.length; i++) {

                        if (tooltipsList[i].key === scope.fieldKey) {

                            scope.tooltipText = tooltipsList[i].text;
                            break;

                        }

                    }

                    if (scope.item) {
                        setItemSpecificSettings();
                    }

                    scope.fieldValue = {value: scope.entity[scope.fieldKey]};
                    scope.inputText = scope.getInputTextForEntitySearch()

                };

                scope.init()

            }

        }
    }
}());