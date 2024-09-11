/**
 * Created by szhitenev on 10.02.2023.
 */

/**
 * Simple Entity Import Edit Dialog Controller.
 * @module SimpleEntityImportEitDialogController
 */

(function () {

    'use strict';

    var csvImportSchemeService = require('../../../services/import/csvImportSchemeService');
    var metaHelper = require('../../../helpers/meta.helper');

    var ScrollHelper = require('../../../helpers/scrollHelper').default;


    var modelService = require('../../../services/modelService');

    module.exports = function simpleEntityImportSchemeEditDialogController($scope, $mdDialog, toastNotificationService, metaContentTypesService, attributeTypeService, importSchemesMethodsService, data) {

        var vm = this;

        const schemeTabScrollHelper = new ScrollHelper();

        vm.entityType = undefined;

        vm.processing = false;

        vm.scheme = {};
        vm.readyStatus = {scheme: false, entitySchemeAttributes: false};
        vm.contentTypes = metaContentTypesService.getListForSimpleEntityImport();
        vm.editingScheme = false;

        vm.dynamicAttributes = [];

        //TODO really bad implementation, dialog renders too long
        vm.instrumentGeneralAttributes = [
            'instrument_type',
            'maturity_date',
            'maturity_price',
            'name',
            'user_code',
            'short_name',
            'public_name',
            'notes',
            'country',
            'pricing_condition'
        ]

        vm.instrumentPricingAttributes = [
            'pricing_currency',
            'price_multiplier',
            'default_price',
            'reference_for_pricing'
        ]

        vm.instrumentAccrualsAttributes = [
            'accrued_currency',
            'accrued_multiplier',
            'default_accrued'
        ]

        vm.instrumentExposureAttributes = [
            'position_reporting',
            'exposure_calculation_model',
            'long_underlying_instrument',
            'underlying_long_multiplier',
            'short_underlying_instrument',
            'underlying_short_multiplier',
            'long_underlying_exposure',
            'short_underlying_exposure',

            'co_directional_exposure_currency',
            'counter_directional_exposure_currency'
        ]

        vm.isInsideTab = function (tab, key) {
            return tab.indexOf(key) !== -1
        }

        vm.inputsGroup = {
            "name": "<b>Imported</b>",
            "key": 'input'
        };

        vm.dynamicAttrPicked = true;

        vm.inputsFunctions = [];

        /**
         * Get list of expressions for Expression Builder.
         * @return {Object[]} Array of Expressions.
         * @memberof module:SimpleEntityImportEitDialogController
         */
        vm.getFunctions = function () {

            return vm.scheme.csv_fields.map(function (input) {

                return {
                    "name": "Imported: " + input.name + " (column # " + input.column + ")",
                    "description": "Imported: " + input.name + " (column #" + input.column + ") " + "-> " + input.name_expr,
                    "groups": "input",
                    "func": input.name,
                    "validation": {
                        "func": input.name
                    }
                }

            })

        };

        function formatFieldsForFrontEnd(fieldsList) {

            fieldsList.sort(function (a, b) {
                if (a.column > b.column) {
                    return 1;
                }

                if (a.column < b.column) {
                    return -1;
                }

                return 0;
            })

            fieldsList = fieldsList.map(function (field, index) {

                field.frontOptions = {
                    key: metaHelper.generateUniqueId(index),
                }

                return field;
            })

            return fieldsList;

        }

        vm.getItem = function () {

            csvImportSchemeService.getByKey(vm.schemeId).then(function (data) {

                vm.scheme = data;

                vm.readyStatus.scheme = true;

                if (vm.scheme.content_type !== 'instruments.pricehistory' && vm.scheme.content_type !== 'currencyhistorys.currencyhistory') {

                    vm.getAttrs();
                }

                /*vm.scheme.csv_fields = vm.scheme.csv_fields.sort(function (a, b) {
                    if (a.column > b.column) {
                        return 1;
                    }
                    if (a.column < b.column) {
                        return -1;
                    }

                    return 0;
                });*/
                vm.scheme.calculated_inputs = formatFieldsForFrontEnd(
                    vm.scheme.calculated_inputs
                )

                vm.scheme.csv_fields = formatFieldsForFrontEnd(
                    vm.scheme.csv_fields
                )

                var attrTypes = modelService.getAttributesByContentType(vm.scheme.content_type);


                var deprecated_fields = {
                    'instruments.instrument': ['price_download_scheme']
                }

                if (deprecated_fields.hasOwnProperty(vm.scheme.content_type)) {

                    vm.scheme.entity_fields = vm.scheme.entity_fields.filter(function (field) {

                        return deprecated_fields[vm.scheme.content_type].indexOf(field.system_property_key) === -1;

                    })

                }

                vm.scheme.entity_fields = vm.scheme.entity_fields
                    .map(function (field, index) {

                        if (!field.system_property_key) {
                            return field;
                        }

                        var attrTypeForTheField = attrTypes.find(function (aType) {
                            return aType.key === field.system_property_key;
                        })

                        if (attrTypeForTheField.value_type === "mc_field") {
                            // remove fields containing multiple relations
                            return null;
                        }

                        field.value_type = attrTypeForTheField.value_type;
                        field.entity = attrTypeForTheField.value_entity;
                        field.content_type = attrTypeForTheField.content_type;
                        field.code = attrTypeForTheField.code;

                        return field;

                    });

                vm.scheme.entity_fields = vm.scheme.entity_fields
                    .filter(function (field) {
                        return field;
                    });

                vm.inputsFunctions = vm.getFunctions();

                vm.draftUserCode = vm.generateUserCodeForDraft();
                $scope.$apply();

            });

        };

        /**
         * Get list of dynamic attributes .
         *
         * @memberof module:SimpleEntityImportEitDialogController
         */
        vm.getAttrs = function () {

            var entity = metaContentTypesService.findEntityByContentType(vm.scheme.content_type);
            vm.entityType = entity;

            attributeTypeService.getList(entity, {
                pageSize: 1000
            }).then(function (data) {

                vm.dynamicAttributes = data.results;

                vm.extendEntityFields();

                $scope.$apply();
            });
        };

        vm.extendEntityFields = function () {

            vm.scheme.entity_fields.forEach(function (item) {

                if (item.dynamic_attribute_id !== null) {

                    vm.dynamicAttributes.forEach(function (attribute) {

                        if (item.dynamic_attribute_id === attribute.id) {
                            item.value_type = attribute.value_type;

                        }

                    })

                }

            })

        };

        vm.getContentTypeName = function (valueType) {

            var valueTypeName = "";
            switch (valueType) {
                case 10:
                    valueTypeName = "Text";
                    break;
                case 20:
                    valueTypeName = "Number";
                    break;
                case 30:
                case "field":
                case "mc_field":
                    valueTypeName = "Classificator";
                    break;
                case 40:
                    valueTypeName = "Date";
                    break;
            }

            return valueTypeName;
        };

        vm.checkReadyStatus = function () {
            return vm.readyStatus.scheme;
        };

        vm.exprInputOpts = {
            readonly: true
        }

        vm.addCsvField = function () {

            vm.scheme.csv_fields.push({
                name: '',
                column: vm.scheme.csv_fields.length,
                frontOptions: {
                    key: metaHelper.generateUniqueId(vm.scheme.csv_fields.length),
                }
            });

            vm.inputsFunctions = vm.getFunctions();

        };

        vm.removeCsvField = function (item, $index) {
            vm.scheme.csv_fields.splice($index, 1);

            vm.inputsFunctions = vm.getFunctions();
        };

        vm.setProviderFieldExpression = function (item) {
            importSchemesMethodsService.setProviderFieldExpression(vm, item);
        }

        vm.openProviderFieldExpressionBuilder = function (item, $event) {
            importSchemesMethodsService.openFxBtnExprBuilder(item, vm, $event);
        }

        vm.openEntityFieldExpressionBuilder = function (item, $event) {
            importSchemesMethodsService.openExprBuilder(item, 'expression', vm, $event);
        }

        vm.openItemPostProcessScriptExpressionBuilder = function (item, $event) {
            importSchemesMethodsService.openExprBuilder(vm.scheme, 'item_post_process_script', vm, $event);
        }

        vm.makeCopy = function ($event) {

            var scheme = JSON.parse(JSON.stringify(vm.scheme));

            delete scheme.id;
            scheme["user_code"] = scheme["user_code"] + '_copy';

            $mdDialog.show({
                controller: 'SimpleEntityImportSchemeCreateDialogController as vm',
                templateUrl: 'views/dialogs/simple-entity-import/simple-entity-import-scheme-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                locals: {
                    data: {
                        scheme: scheme
                    }
                }
            });

            $mdDialog.hide({status: 'disagree'});

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function ($event) {

            vm.scheme.entity_fields.forEach(function (item) {

                vm.dynamicAttributes.forEach(function (attr) {

                    if (item.dynamic_attribute_id === attr.id) {
                        item.name = attr.name
                    }

                })

            });

            var warningMessage = '';
            var warningTitle = '';

            var importedColumnsNumberZero = false;
            var importedColumnsNumberEmpty = false;


            for (var i = 0; i < vm.scheme.csv_fields.length; i++) {
                var field = vm.scheme.csv_fields[i];

                if (field.column === 0 && !importedColumnsNumberZero) {
                    warningMessage = "should not have value 0 (column's count starts from 1)";
                    importedColumnsNumberZero = true;
                }

                if (field.column === null && !importedColumnsNumberEmpty) {

                    if (importedColumnsNumberZero) {
                        warningMessage = warningMessage + ', should not be empty'
                    } else {
                        warningMessage = 'should not be empty'
                    }

                    importedColumnsNumberEmpty = true;
                }

                if (!importedColumnsNumberZero &&
                    !importedColumnsNumberEmpty &&
                    !field.name_expr) {

                    warningMessage += '<p>Imported Columns Field # ' + field.column + ' has no F(X) expression</p>';

                }
            }

            if (warningMessage) {

                if (importedColumnsNumberZero || importedColumnsNumberEmpty) {

                    warningTitle = 'Incorrect Imported Columns field #';
                    warningMessage = 'Imported Columns Field #: ' + warningMessage + '.';

                } else { // if number of column correct but F(X) expression not
                    warningTitle = 'Incorrect Imported Columns F(X)';
                }

                $mdDialog.show({
                    controller: 'WarningDialogController as vm',
                    templateUrl: 'views/dialogs/warning-dialog-view.html',
                    parent: document.querySelector('.dialog-containers-wrap'),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    locals: {
                        warning: {
                            title: warningTitle,
                            description: warningMessage,
                            actionsButtons: [
                                {
                                    name: 'CLOSE',
                                    response: false
                                }
                            ]
                        }
                    },
                    multiple: true
                })

            }
            else {

                vm.processing = true;

                var dataToSend = structuredClone(vm.scheme);
                dataToSend = metaHelper.clearFrontendOptions(dataToSend);

                if (dataToSend.id) {

                    csvImportSchemeService.update(dataToSend.id, dataToSend).then(function (data) {

                        toastNotificationService.success("Simple Import Scheme " + dataToSend.user_code + ' was successfully saved');

                        vm.processing = false;

                        $mdDialog.hide({status: 'agree'});

                    }).catch(function (reason) {

                        vm.processing = false;

                        $mdDialog.show({
                            controller: 'ValidationDialogController as vm',
                            templateUrl: 'views/dialogs/validation-dialog-view.html',
                            parent: document.querySelector('.dialog-containers-wrap'),
                            targetEvent: $event,
                            locals: {
                                validationData: reason.message
                            },
                            multiple: true,
                            preserveScope: true,
                            autoWrap: true,
                            skipHide: true
                        })

                    });

                }
                else {

                    csvImportSchemeService.create(dataToSend).then(function (data) {

                        vm.schemeId = data.id;

                        toastNotificationService.success("Simple Import Scheme " + dataToSend.user_code + ' was successfully created');

                        vm.processing = false;

                        vm.getItem();

                    }).catch(function (reason) {

                        vm.processing = false;

                        $mdDialog.show({
                            controller: 'ValidationDialogController as vm',
                            templateUrl: 'views/dialogs/validation-dialog-view.html',
                            parent: document.querySelector('.dialog-containers-wrap'),
                            targetEvent: $event,
                            locals: {
                                validationData: reason.message
                            },
                            multiple: true,
                            preserveScope: true,
                            autoWrap: true,
                            skipHide: true
                        })

                    });

                }
            }
        };


        vm.openMapping = function ($event, item) {
            var locals = {mapItem: {complexExpressionEntity: item.entity}}
            importSchemesMethodsService.openMappingDialog(locals, $event);
        };

        vm.checkForClassifierMapping = function (classifierId) {
            importSchemesMethodsService.checkForClassifierMapping(vm.dynamicAttributes, classifierId);
        };

        vm.openClassifierMapping = function (classifierId, $event) {
            var localsObj = {
                options: {
                    entityType: vm.entityType,
                    id: classifierId
                }
            }

            importSchemesMethodsService.openClassifierMapping(localsObj, $event);
        }

        function setName(item) {
            item.name = item.text;
            if (item.id.indexOf('j') !== -1) {
                delete item['li_attr'];
                delete item['state'];
                delete item['icon'];
                delete item['a_attr'];
                delete item['data'];
                delete item['text'];
                delete item['type'];
                delete item.id;
            }
            item.children = item.children.map(setName);
            return item;
        }

        vm.editTreeAttr = function (attrId, ev) {

            var classifierObject = {};

            for (var i = 0; i < vm.dynamicAttributes.length; i++) {

                if (vm.dynamicAttributes[i].id === attrId) {
                    classifierObject = Object.assign({}, vm.dynamicAttributes[i]);
                    break;
                }

            }

            /*classifierObject.id = classifierObject.dynamic_attribute_id;
            delete classifierObject.dynamic_attribute_id;*/

            $mdDialog.show({
                controller: 'ClassificationEditorDialogController as vm',
                templateUrl: 'views/classification-editor-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: ev,
                multiple: true,
                locals: {
                    data: {
                        entityType: vm.entityType,
                        classifier: classifierObject
                    }
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log("res", res.data);

                    res.data.classifier.classifiers = res.data.classifier.children.map(setName);

                    attributeTypeService.update(vm.entityType, res.data.classifier.id, res.data.classifier);
                }
            });
        };

        vm.openCalcFieldFxBtnExprBuilder = function (item, $event) {
            importSchemesMethodsService.openCalcFieldFxBtnExprBuilder(item, vm, $event);
        }

        vm.onCalculatedFieldNameBlur = function (item) {
            importSchemesMethodsService.onTTypeCalcFielNamedBlur(item);
        }

        vm.getCalcFieldFxBtnClasses = function (item) {
            return importSchemesMethodsService.getCalcFieldFxBtnClasses(item);
        }

        vm.removeCalculatedField = function (item, $index) {
            vm.scheme.calculated_inputs.splice($index, 1);
        };


        vm.addCalculatedField = function () {

            vm.scheme.calculated_inputs.push({
                name: '',
                column: vm.scheme.calculated_inputs.length,
                frontOptions: {
                    key: metaHelper.generateUniqueId(vm.scheme.calculated_inputs.length),
                }
            })

        };

        vm.editAsJson = function (ev) {

            $mdDialog.show({
                controller: 'EntityAsJsonEditorDialogController as vm',
                templateUrl: 'views/dialogs/entity-as-json-editor-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: ev,
                multiple: true,
                locals: {
                    data: {
                        item: vm.scheme,
                        entityType: 'csv-import-scheme',
                    }
                }
            }).then(function (res) {

                if (res.status === "agree") {

                    vm.getItem();

                }
            })

        }

        //# region Drag and drop
        let dragIconGrabbed = false;

        var turnOffDragging = function () {
            dragIconGrabbed = false;
        };

        vm.turnOnDragging = function () {
            dragIconGrabbed = true;
            document.body.addEventListener('mouseup', turnOffDragging, {once: true});
        };

        /** @return {boolean} */
        var canRowBeMoved = function () {
            // Drag and drop forbidden while filter is active
            if (dragIconGrabbed) {
                return true;
            }

            return false;
        };

        vm.calculatedInputsDragAndDrop = {
            init: function () {

                schemeTabScrollHelper.setDnDScrollElem(
                    document.querySelector('.schemeTabScrollableElem')
                );

                this.dragulaInit();
                this.initEventListeners();

            },

            initEventListeners: function () {
                const drake = this.dragula;
                function onDropHandler (elem, target, source, nextSiblings) {
                    vm.scheme.calculated_inputs = importSchemesMethodsService.drakeDropHandler(
                        elem, nextSiblings, vm.scheme.calculated_inputs
                    );
                }

                importSchemesMethodsService.initDrakeEventListeners(
                    drake, schemeTabScrollHelper, onDropHandler
                );

            },

            dragulaInit: function () {

                const containers = [
                    document.querySelector('.calculatedInputsDragulaContainer')
                ];

                this.dragula = dragula(containers, {
                    moves: function () {
                        return canRowBeMoved();
                    },
                    revertOnSpill: true
                })
            },

            destroy: function() {
                this.dragula.destroy();
            }
        };

        vm.csvFieldsDragAndDrop = {
            init: function () {

                schemeTabScrollHelper.setDnDScrollElem(
                    document.querySelector('.schemeTabScrollableElem')
                );

                this.dragulaInit();
                this.initEventListeners();

            },

            initEventListeners: function () {
                const drake = this.dragula;
                function onDropHandler (elem, target, source, nextSiblings) {
                    vm.scheme.csv_fields = importSchemesMethodsService.drakeDropHandler(
                        elem, nextSiblings, vm.scheme.csv_fields
                    );
                }

                importSchemesMethodsService.initDrakeEventListeners(
                    drake, schemeTabScrollHelper, onDropHandler
                );

            },

            dragulaInit: function () {

                const containers = [
                    document.querySelector('.csvFieldsDragulaContainer')
                ];

                this.dragula = dragula(containers, {
                    moves: function () {
                        return canRowBeMoved();
                    },
                    revertOnSpill: true
                })
            },

            destroy: function() {
                this.dragula.destroy();
            }
        };
        //# endregion Drag and drop

        // DRAFT STARTED

        vm.generateUserCodeForDraft = function (){

            if (!vm.scheme.id) {
                return 'csv_import.csvimportscheme.new'
            }

            return 'csv_import.csvimportscheme.' + vm.scheme.user_code

        }

        vm.exportToDraft = function ($event) {

            return JSON.parse(JSON.stringify(vm.scheme))

        }

        vm.applyDraft = function ($event, data) {

            console.log('applyDraft', data);

            vm.scheme = data;

        }

        // DRAFT ENDED

        vm.init = function () {

            vm.schemeId = data.schemeId

            if (vm.schemeId) {
                vm.editingScheme = true;

                vm.getItem();
            } else {
                vm.scheme = {

                    entity_fields: [],
                    csv_fields: []

                }
                vm.draftUserCode = vm.generateUserCodeForDraft();
                vm.readyStatus.scheme = true;


            }

        };

        vm.init()

    };

}());