/**
 * Created by szhitenev on 06.05.2016.
 */
/**
 * Entity viewer helper service.
 * @module entityViewerHelperService
 */
(function () {

    const objectComparisonHelper = require('../helpers/objectsComparisonHelper');
    const uiService = require('../services/uiService');

    const entityResolverService = require('../services/entityResolverService');

    // const middlewareService = require('../services/middlewareService');
    const evEvents = require('../services/entityViewerEvents');
    const evDataHelper = require('../helpers/ev-data.helper');
    const evRvCommonHelper = require('../helpers/ev-rv-common.helper');
    const metaHelper = require('../helpers/meta.helper');

    'use strict';
    /**
     * Insert dynamic attributes' values into entity's root level
     *
     * @param entity {Object}
     * @param attrs {Array}
     */
    let transformItem = function (entity, attrs) {

        if (entity.attributes) {

            let key;

            attrs.forEach(function (attributeType) {

                entity.attributes.forEach(function (attribute) {

                    if (attributeType.user_code === attribute.attribute_type_object.user_code) {

                        key = attributeType.user_code;

                        if (attributeType.value_type === 10) {
                            entity[key] = attribute.value_string
                        }

                        if (attributeType.value_type === 20) {
                            entity[key] = attribute.value_float
                        }

                        if (attributeType.value_type === 30) {
                            entity[key] = attribute.classifier
                        }

                        if (attributeType.value_type === 40) {
                            entity[key] = attribute.value_date
                        }

                    }

                })

            });


        }

    };

    /**
     * Check if layout has been changed before changing masteruser
     * @param {object} activeLayoutConfig - Object with configuration of layout saved on server
     * @param {object} layoutCurrentConfig - Object with current
     * @param {boolean} isReport
     * @memberOf module:entityViewerHelperService
     * @return {boolean} Returns true if layout has not been changed, otherwise false
     */
    let checkForLayoutConfigurationChanges = function (activeLayoutConfig, layoutCurrentConfig, isReport) {

        if (isReport) {

            activeLayoutConfig.data

            if (activeLayoutConfig.data.reportOptions) {
                delete activeLayoutConfig.data.reportOptions.task_id;
                delete activeLayoutConfig.data.reportOptions.recieved_at;
                delete activeLayoutConfig.data.reportOptions.task_status;
            }

            if (activeLayoutConfig.data.hasOwnProperty('reportLayoutOptions') && activeLayoutConfig.data.reportLayoutOptions.hasOwnProperty('datepickerOptions')) {

                if (activeLayoutConfig.data.reportLayoutOptions.datepickerOptions.reportFirstDatepicker.datepickerMode !== 'datepicker') {
                    delete activeLayoutConfig.data.reportOptions.pl_first_date;
                    delete activeLayoutConfig.data.reportOptions.begin_date;
                }

                if (activeLayoutConfig.data.reportLayoutOptions.datepickerOptions.reportLastDatepicker.datepickerMode !== 'datepicker') {
                    delete activeLayoutConfig.data.reportOptions.report_date;
                    delete activeLayoutConfig.data.reportOptions.end_date;
                }

            }

            if (layoutCurrentConfig.data.reportOptions) {
                delete layoutCurrentConfig.data.reportOptions.task_id;
                delete layoutCurrentConfig.data.reportOptions.recieved_at;
                delete layoutCurrentConfig.data.reportOptions.task_status;
            }

            if (layoutCurrentConfig.data.hasOwnProperty('reportLayoutOptions') && layoutCurrentConfig.data.reportLayoutOptions.hasOwnProperty('datepickerOptions')) {

                if (layoutCurrentConfig.data.reportLayoutOptions.datepickerOptions.reportFirstDatepicker.datepickerMode !== 'datepicker') {
                    delete layoutCurrentConfig.data.reportOptions.pl_first_date;
                    delete layoutCurrentConfig.data.reportOptions.begin_date;
                }

                if (layoutCurrentConfig.data.reportLayoutOptions.datepickerOptions.reportLastDatepicker.datepickerMode !== 'datepicker') {
                    delete layoutCurrentConfig.data.reportOptions.report_date;
                    delete layoutCurrentConfig.data.reportOptions.end_date;
                }

            }

        }

        let layoutIsNotChanged = objectComparisonHelper.areObjectsTheSame(activeLayoutConfig, layoutCurrentConfig);

        return layoutIsNotChanged;
    };

    /**
     * Turn table attribute into group, column or filter
     * @param {string} form - In what form get attribute
     * @param {object} attrInstance - Object with attribute data on which attribute form will be based
     * @memberOf module:entityViewerHelperService
     * @return {object} Return attribute in form of group, column or filter
     */
    let getTableAttrInFormOf = function (form, attrInstance) {
        console.log("add filter getTableAttrInFormOf attrInstance", attrInstance);
        let attrTypeToAdd = {};

        attrTypeToAdd.key = attrInstance.key;

        if (form === 'group' || form === 'column') {

            if (attrInstance.hasOwnProperty('entity')) {
                attrTypeToAdd.entity = attrInstance.entity;
            }

            if (attrInstance.hasOwnProperty('id')) {
                attrTypeToAdd.id = attrInstance.id;
            }

        }

        if (attrInstance.hasOwnProperty('groups')) {
            attrTypeToAdd.groups = attrInstance.groups;
        }

        if (attrInstance.hasOwnProperty('columns')) {
            attrTypeToAdd.columns = attrInstance.columns;
        }

        if (attrInstance.hasOwnProperty('filters')) {
            attrTypeToAdd.filters = attrInstance.filters;
        }

        attrTypeToAdd.name = attrInstance.name;
        attrTypeToAdd.value_type = attrInstance.value_type;

        if (attrInstance.layout_name) {
            attrTypeToAdd.layout_name = attrInstance.layout_name;
        }

        switch (form) {

            case 'group':
                attrTypeToAdd.groups = true;
                break;

            case 'column':
                attrTypeToAdd.columns = true;
                break;

            case 'filter':

                attrTypeToAdd.filters = true;

                if (!attrTypeToAdd.options) {
                    attrTypeToAdd.options = {};
                }

                if (!attrTypeToAdd.options.filter_type) {
                    attrTypeToAdd.options.filter_type = metaHelper.getDefaultFilterType(attrTypeToAdd.value_type);
                }

                if (!attrTypeToAdd.options.filter_values) {
                    attrTypeToAdd.options.filter_values = [];
                }

                if (!attrTypeToAdd.options.hasOwnProperty('exclude_empty_cells')) {
                    attrTypeToAdd.options.exclude_empty_cells = false;
                }

                break;
        }

        if (form === 'group' || form === 'column') {

            attrTypeToAdd.style = {
                width: evDataHelper.getColumnWidth(attrTypeToAdd)
            }

        }

        return attrTypeToAdd;

    };

    /**
     * Get value of dynamic attribute by it's user_code
     * @param {object} dAttrData - Data of dynamic attribute
     * @memberOf module:entityViewerHelperService
     * @return {string|float|date} Return value of dynamic attribute
     */
    let getDynamicAttrValue = function (dAttrData) {

        let attrVal;

        if (dAttrData.attribute_type_object.value_type === 30) {

            if (dAttrData.classifier_object) {
                attrVal = dAttrData.classifier_object.name;
            } else {
                attrVal = '';
            }

        } else {

            switch (dAttrData.attribute_type_object.value_type) {
                case 10:
                    attrVal = dAttrData.value_string;
                    break;
                case 20:
                    attrVal = dAttrData.value_float;
                    break;
                case 40:
                    attrVal = dAttrData.value_date;
                    break;
            }

        }

        return attrVal;

    };

    /**
     * Get value of dynamic attribute by it's user_code
     * @param {string} userCode - Dynamic attribute user code
     * @param {array} dAttrsList - Array of objects with data of dynamic attribute
     * @memberOf module:entityViewerHelperService
     * @return {string|float|date} Return value of dynamic attribute
     */
    let getValueFromDynamicAttrsByUserCode = function (userCode, dAttrsList) {

        let cellValue;

        for (let da = 0; da < dAttrsList.length; da++) {
            let dynamicAttributeData = dAttrsList[da];

            if (dynamicAttributeData.attribute_type_object.user_code === userCode) {

                cellValue = getDynamicAttrValue(dynamicAttributeData);
                break;

            }

        }

        return cellValue;

    };

    /**
     * Try to get layout by user code and use it. If no layout with such user code was found, get default layout.
     * @memberOf module:entityViewerHelperService
     *
     * @param {object} viewModel - view model of current reportViewerController or entityViewerController
     * @param {string} userCode
     * @param {obj} $mdDialog
     * @param {string} viewContext
     * @return {Promise<any>}
     */
    let getLayoutByUserCode = function (viewModel, userCode, $mdDialog, viewContext) {

        return new Promise(function (resolve) {
            /* uiService.getListLayout(viewModel.entityType, {
                pageSize: 1000,
                filters: {
                    user_code: userCode
                }

            }) */
            uiService.getListLayoutByUserCode(viewModel.entityType, userCode).then(async function (activeLayoutData) {

                let activeLayout = null;

                if (activeLayoutData.hasOwnProperty('results') && activeLayoutData.results[0]) {
                    activeLayout = activeLayoutData.results[0];
                }

                if (activeLayout) {

                    await viewModel.setLayout(activeLayout);
                    resolve();

                } else {

                    $mdDialog.show({
                        controller: 'InfoDialogController as vm',
                        templateUrl: 'views/info-dialog-view.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: false,
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        multiple: true,
                        locals: {
                            info: {
                                title: 'Warning',
                                description: "Layout " + name + " is not found. Switching back to Default Layout."
                            }
                        }

                    }).then(async function (value) {

                        await getDefaultLayout(viewModel, viewContext);

                        resolve();

                    })

                }

            });

        });

    };

    /**
     * @param {object} viewModel - view model of current reportViewerController or entityViewerController
     * @param {string} viewContext
     * @memberOf module:entityViewerHelperService
     * @return {promise}
     */
    let getDefaultLayout = function (viewModel, viewContext) {

        return new Promise(function (resolve, reject) {

            uiService.getDefaultListLayout(viewModel.entityType).then(async function (defaultLayoutData) {

                let defaultLayout = null;
                if (defaultLayoutData.results && defaultLayoutData.results.length > 0) {

                    defaultLayout = defaultLayoutData.results[0];
                    /* if (viewContext === 'split_panel') {
                        middlewareService.setNewSplitPanelLayoutName(defaultLayout.name);
                    } */

                }

                await viewModel.setLayout(defaultLayout);

                resolve();

            }).catch(function (error) {
                reject(error);
            });

        });

    };


    /**
     * Get max columns from tabs of Edit Layout
     * @param {Array} editLayoutTabs
     * @memberOf module:entityViewerHelperService
     * @returns {number}
     */
    var getEditLayoutMaxColumns = function (editLayoutTabs) {

        let maxCols = 0;

        editLayoutTabs.forEach(function (tab) {

            if (tab.layout && tab.layout.columns &&
                tab.layout.columns > maxCols) {

                maxCols = tab.layout.columns;

            }

        })

        /* const widths = editLayoutTabs
            .map(tab => tab.layout && tab.layout.columns)
            .filter(num => Boolean(Number(num)));

        const maxWidth = Math.max(...widths) */

        return maxCols ? maxCols : 6;

    };

    /**
     * Get big drawer width percentage by fixed area columns
     * @param {number} columns
     * @returns {string}
     */
    var getBigDrawerWidth = function (columns) {

        let viewportWidth = window.innerWidth;

        let widthPercent = 75;

        switch (columns) {
            case 5:
            case 4:
                widthPercent = 49;
                break;
            case 3:
                widthPercent = 39;
                break;
            case 2:
            case 1:
                widthPercent = 27;
                break;

        }

        let drawerWidth = (viewportWidth * widthPercent / 100) + 'px';

        return drawerWidth;

    }

    /**
     * Format data for popupDirective in fixed area
     * @param {object} viewModel - of add / edit controller
     * @param {array} keysOfFixedFieldsAttrs - array of strings that are keys of entity attributes
     * @returns {object} object where each property corresponding to field inside popup
     */
    var getFieldsForFixedAreaPopup = function (viewModel) {

        return new Promise(function (resolve, reject) {

            const fields = viewModel.keysOfFixedFieldsAttrs.reduce((acc, key) => {

                const attr = viewModel.entityAttrs.find(entityAttr => entityAttr.key === key);

                if (!attr) {
                    return acc;
                }

                const fieldKey = (key === 'instrument_type' || key === 'instrument_class') ? 'type' : key;
                const field = {
                    [fieldKey]: {name: attr.name, value: viewModel.entity[key]}
                };

                if (attr.hasOwnProperty('value_entity')) { // this props need for getting field options
                    field[fieldKey].value_entity = attr.value_entity;
                }

                return {...acc, ...field};

            }, {});

            fields.status = {key: 'Status', value: viewModel.entityStatus, options: viewModel.statusSelectorOptions}
            fields.showByDefault = {
                key: 'Show by default',
                value: viewModel.showByDefault,
                options: viewModel.showByDefaultOptions
            }

            // get options for 'type' or 'instrument type' fields
            if (fields.hasOwnProperty('type')) {

                entityResolverService.getListLight(fields.type.value_entity).then((data) => {

                    const options = Array.isArray(data) ? data : data.results;
                    fields.type.options = options;
                    viewModel.setTypeSelectorOptions(options);

                    resolve(fields);

                }).catch(error => reject(error));

            } else {
                resolve(fields);
            }

        });

    };

    var getBigDrawerOptions = function (layout, entityType) {

        var fixedAreaColumns = 6;

        if (layout.results.length) {

            var tabs = Array.isArray(layout.results[0].data) ? layout.results[0].data : layout.results[0].data.tabs;

            if (entityType !== 'instrument-type') {
                fixedAreaColumns = getEditLayoutMaxColumns(tabs);
            }

        }

        var bigDrawerWidth = getBigDrawerWidth(fixedAreaColumns);

        return {
            width: bigDrawerWidth,
            editLayout: layout
        }
    };

    var insertObjectAfterCreateHandler = function (evDataService, evEventService, resultItem) {

        var groups = evDataService.getDataAsList();
        var requestParameters = evDataService.getAllRequestParameters();
        var requestParametersKeys = Object.keys(requestParameters);

        var matchedRequestParameter;

        for (var i = 0; i < requestParametersKeys.length; i = i + 1) {

            var key = requestParametersKeys[i];

            var match = true;

            var filter_types = requestParameters[key].body.groups_types.map(function (item) {
                return item.key
            });

            var filter_values = requestParameters[key].body.groups_values;

            if (filter_values.length) {
                filter_values.forEach(function (value, index) {

                    if (resultItem[filter_types[index]] !== value) {
                        match = false
                    }


                })
            } else {

                if (filter_types.length) {
                    match = false;
                }
            }

            if (match) {
                matchedRequestParameter = requestParameters[key];
                break;
            }

        }

        if (matchedRequestParameter) {

            groups.forEach(function (group) {

                if (group.___id === matchedRequestParameter.id) {

                    var exampleItem = group.results[0]; // copying of ___type, ___parentId and etc fields

                    var result = Object.assign({}, exampleItem, resultItem);

                    result.___id = evRvCommonHelper.getId(result);
                    var beforeControlRowIndex = group.results.length - 1;

                    group.results.splice(beforeControlRowIndex, 0, result);

                }


            })

        }

        evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

    };

    var postEditionActions = function (evDataService, evEventService, layout, $bigDrawer, res, entityId) {

        /* evDataService.setActiveObjectAction(null);
        evDataService.setActiveObjectActionData(null); */
        evDataService.setRowsActionData(null);

        if (res.status === 'agree') {
            updateEntityInsideTable(evDataService, evEventService, res);

        } else if (res.status === 'copy') {

            const entitytype = res.data.entityType;
            const entity = res.data.entity;

            openEntityViewerAddDrawer(evDataService, evEventService, layout, $bigDrawer, entitytype, entity);

        } else if (res.status === 'delete') {
            updateTableAfterEntitiesDeletion(evDataService, evEventService, [entityId]);
        }

    };

    var postAdditionActions = function (evDataService, evEventService, layout, $bigDrawer, res, resultItem) { // resultItem need because complex transaction have different data

        if (res.status === 'agree') {
            insertObjectAfterCreateHandler(evDataService, evEventService, resultItem);
        } else if (res.status === 'edit') {

            insertObjectAfterCreateHandler(evDataService, evEventService, resultItem);
            // open edit window
            const entitytype = resultItem.entityType;
            const entityId = resultItem.entity.id;
            openEntityViewerEditDrawer(evDataService, evEventService, layout, $bigDrawer, entitytype, entityId);

        }

    };

    var postTTypeEditionActions = function (evDataService, evEventService, layout, $bigDrawer, res, entityId) {

        /* evDataService.setActiveObjectAction(null);
        evDataService.setActiveObjectActionData(null); */
        evDataService.setRowsActionData(null);

        if (res.status === 'agree') {
            updateEntityInsideTable(evDataService, evEventService, res);
        } else if (res.status === 'delete') {

            var objects = evDataService.getObjects();

            objects.forEach(function (obj) {

                if (entityId === obj.id) {

                    var parent = evDataService.getData(obj.___parentId);

                    parent.results = parent.results.filter(function (resultItem) {
                        return resultItem.id !== entityId
                    });

                    evDataService.setData(parent)

                }

            });

            evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
            updateTableAfterEntitiesDeletion(evDataService, evEventService, [entityId]);

        } else if (res.status === 'copy') {

            const entitytype = res.data.entityType;
            const entity = res.data.entity;

            openTTypeAddDrawer(evDataService, evEventService, layout, $bigDrawer, entitytype, entity);

        }

    };

    var postTTypeAdditionActions = function (evDataService, evEventService, layout, $bigDrawer, res) {

        if (res.status === 'agree') {
            insertObjectAfterCreateHandler(evDataService, evEventService, res.data);
        } else if (res.status === 'edit') {

            insertObjectAfterCreateHandler(evDataService, evEventService, res.data);
            // open edit window
            const entitytype = res.data.entityType;
            const entityId = res.data.entity.id;
            openTTypeEditDrawer(
                evDataService,
                evEventService,
                layout,
                $bigDrawer,
                entitytype,
                entityId
            );

        }
    };

    var postInstrumentTypeEditionActions = function (evDataService, evEventService, layout, $bigDrawer, res, entityId) {

        /* evDataService.setActiveObjectAction(null);
        evDataService.setActiveObjectActionData(null); */
        evDataService.setRowsActionData(null);

        if (res.status === 'agree') {
            updateEntityInsideTable(evDataService, evEventService, res);
        } else if (res.status === 'delete') {

            var objects = evDataService.getObjects();

            objects.forEach(function (obj) {

                if (entityId === obj.id) {

                    var parent = evDataService.getData(obj.___parentId);

                    parent.results = parent.results.filter(function (resultItem) {
                        return resultItem.id !== entityId
                    });

                    evDataService.setData(parent)

                }

            });

            evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
            updateTableAfterEntitiesDeletion(evDataService, evEventService, [entityId]);

        } else if (res.status === 'copy') {

            const entitytype = res.data.entityType;
            const entity = res.data.entity;

            openInstrumentTypeAddDrawer(evDataService, evEventService, layout, $bigDrawer, entitytype, entity);

        }

    };

    var postInstrumentTypeAdditionActions = function (evDataService, evEventService, layout, $bigDrawer, res) {

        if (res.status === 'agree') {
            insertObjectAfterCreateHandler(evDataService, evEventService, res.data);
        } else if (res.status === 'edit') {

            insertObjectAfterCreateHandler(evDataService, evEventService, res.data);
            // open edit window
            const entitytype = res.data.entityType;
            const entityId = res.data.entity.id;
            openInstrumentTypeEditDrawer(
                evDataService,
                evEventService,
                layout,
                $bigDrawer,
                entitytype,
                entityId
            );

        }
    };

    var postComplexTransactionEditionAction = function (evDataService, evEventService, layout, $bigDrawer, res, entityId) {

        /* evDataService.setActiveObjectAction(null);
        evDataService.setActiveObjectActionData(null); */
        evDataService.setRowsActionData(null);

        if (res.status === 'agree') {

            var objects = evDataService.getObjects();

            objects.forEach(function (obj) {

                if (res.data.complex_transaction.id === obj.id) {

                    Object.keys(res.data.complex_transaction).forEach(function (key) {

                        obj[key] = res.data.complex_transaction[key]

                    });

                    evDataService.setObject(obj);

                }

            });

            evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

        } else if (res.status === 'delete') {

            updateTableAfterEntitiesDeletion(evDataService, evEventService, [entityId]);

        } else if (res.status === 'copy') {

            const entitytype = res.data.entityType;
            const entity = res.data.entity;
            const isCopy = true;

            const originalComplexTransaction = res.data.originalComplexTransaction

            openComplexTransactionAddDrawer(evDataService, evEventService, layout, $bigDrawer, entitytype, entity, isCopy, originalComplexTransaction)

        } else if (res.status === 'disagree' &&
            res.data && res.data.updateRowIcon) {

            var tIsLocked = res.data.updateRowIcon.is_locked;
            var tIsCanceled = res.data.updateRowIcon.is_canceled;
            var activeObject = evDataService.getActiveObject();
            var transactionObj = evDataService.getObject(activeObject.___id, activeObject.___parentId);

            transactionObj.is_locked = tIsLocked;
            transactionObj.is_canceled = tIsCanceled;
            evDataService.setObject(transactionObj);

            evEventService.dispatchEvent(evEvents.UPDATE_PROJECTION);

        }

    };

    var openComplexTransactionAddDrawer = function (
        evDataService,
        evEventService,
        layout,
        $bigDrawer,
        entityType,
        entity,
        isCopy,
        originalComplexTransaction
    ) {

        /* $mdDialog.show({
            controller: 'ComplexTransactionAddDialogController as vm',
            templateUrl: 'views/entity-viewer/complex-transaction-add-dialog-view.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                entityType: scope.entityType,
                entity: {},
                data: {}
            }
        }).then(function (res) {

            if (res && res.res === 'agree') {
                scope.insertObjectAfterCreateHandler(res.data.complex_transaction);
            }

        }) */
        var bigDrawerWidth = getBigDrawerWidth(6);

        $bigDrawer.show({
            controller: 'ComplexTransactionAddDialogController as vm',
            templateUrl: 'views/entity-viewer/complex-transaction-add-drawer-view.html',
            addResizeButton: false,
            drawerWidth: bigDrawerWidth,
            locals: {
                entityType: entityType,
                entity: entity,
                data: {
                    openedIn: 'big-drawer',
                    editLayout: layout,
                    isCopy: isCopy,
                    originalComplexTransaction: originalComplexTransaction
                }
            }

        }).then(function (res) {

            var resultItem = null;
            if (res.data) {
                resultItem = res.data.complex_transaction;
            }

            postAdditionActions(evDataService, evEventService, layout, $bigDrawer, res, resultItem);

        });
    };

    /**
     *
     * @param evDataService {Object} - entityViewerDataService
     * @param evEventService {Object} - entityViewerEventService
     * @param $bigDrawer {Object} - bigDrawer module
     * @param entityId {number} - complex transaction id
     * @param layout {Object=} - layout of form
     */
    var openComplexTransactionEditDrawer = function (evDataService, evEventService, $bigDrawer, entityId, layout) {

        /* $mdDialog.show({
                    controller: 'ComplexTransactionEditDialogController as vm',
                    templateUrl: 'views/entity-viewer/complex-transaction-edit-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: activeObject.event,
                    //clickOutsideToClose: false,
                    locals: {
                        entityType: entitytype,
                        entityId: activeObject.id,
                        data: {}
                    }
                }).then(function (res) {

                    vm.entityViewerDataService.setActiveObjectAction(null);
                    vm.entityViewerDataService.setActiveObjectActionData(null);

                    if (res && res.res === 'agree') {

                        if (res.data.action === 'delete') {

                            var objects = vm.entityViewerDataService.getObjects();

                            objects.forEach(function (obj) {

                                if (activeObject.id === obj.id) {

                                    var parent = vm.entityViewerDataService.getData(obj.___parentId);

                                    parent.results = parent.results.filter(function (resultItem) {
                                        return resultItem.id !== activeObject.id
                                    });

                                    vm.entityViewerDataService.setData(parent)

                                }

                            });

                            vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                        } else {

                            var objects = vm.entityViewerDataService.getObjects();

                            objects.forEach(function (obj) {

                                if (res.data.complex_transaction.id === obj.id) {

                                    Object.keys(res.data.complex_transaction).forEach(function (key) {

                                        obj[key] = res.data.complex_transaction[key]

                                    });

                                    vm.entityViewerDataService.setObject(obj);

                                }

                            });

                            vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                        }

                    } else if (res && res.status === 'disagree' && res.data.updateRowIcon) {

                        var tIsLocked = res.data.updateRowIcon.is_locked;
                        var tIsCanceled = res.data.updateRowIcon.is_canceled;
                        var activeObject = vm.entityViewerDataService.getActiveObject();
                        var transactionObj = vm.entityViewerDataService.getObject(activeObject.___id, activeObject.___parentId);

                        transactionObj.is_locked = tIsLocked;
                        transactionObj.is_canceled = tIsCanceled;
                        vm.entityViewerDataService.setObject(transactionObj);

                        vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_PROJECTION);
                    }

                });*/

        var bigDrawerWidth = getBigDrawerWidth(6);

        $bigDrawer.show({
            controller: 'ComplexTransactionEditDialogController as vm',
            templateUrl: 'views/entity-viewer/complex-transaction-edit-drawer-view.html',
            addResizeButton: false,
            drawerWidth: bigDrawerWidth,
            locals: {
                entityType: 'complex-transaction',
                entityId: entityId,
                data: {
                    openedIn: 'big-drawer',
                    editLayout: layout
                }
            }

        }).then(function (res) {

            postComplexTransactionEditionAction(evDataService, evEventService, layout, $bigDrawer, res, entityId);

        });

    }

    var openTTypeAddDrawer = function (
        evDataService,
        evEventService,
        layout,
        $bigDrawer,
        entityType,
        entity
    ) {

        /*							$mdDialog.show({
                                        controller: 'TransactionTypeAddDialogController as vm',
                                        templateUrl: 'views/entity-viewer/transaction-type-add-dialog-view.html',
                                        parent: angular.element(document.body),
                                        targetEvent: ev,
                                        locals: {
                                            entityType: scope.entityType,
                                            entity: {}
                                        }

                                    }).then(postAddEntityFn);*/

        var bigDrawerWidth = getBigDrawerWidth(6);

        $bigDrawer.show({
            controller: 'TransactionTypeAddDialogController as vm',
            templateUrl: 'views/entity-viewer/transaction-type-add-drawer-view.html',
            addResizeButton: false, // ttype always have max width without resize button
            drawerWidth: bigDrawerWidth,
            locals: {
                entityType: entityType,
                entity: entity,
                data: {
                    openedIn: 'big-drawer',
                    editLayout: layout
                }
            }

        }).then(function (res) {

            postTTypeAdditionActions(evDataService, evEventService, layout, $bigDrawer, res);

        });

    };


    var openTTypeEditDrawer = function (
        evDataService,
        evEventService,
        layout,
        $bigDrawer,
        entitytype,
        entityId
    ) {

        var bigDrawerWidth = getBigDrawerWidth(6);

        /*						$mdDialog.show({
                                    controller: 'TransactionTypeEditDialogController as vm',
                                    templateUrl: 'views/entity-viewer/transaction-type-edit-dialog-view.html',
                                    parent: angular.element(document.body),
                                    targetEvent: activeObject.event,
                                    //clickOutsideToClose: false,
                                    locals: {
                                        entityType: entitytype,
                                        entityId: activeObject.id,
                                        openedIn: 'dialog'
                                    }
                                })
                                    .then(function (res) {

                                    vm.entityViewerDataService.setActiveObjectAction(null);
                                    vm.entityViewerDataService.setActiveObjectActionData(null);

                                    if (res && res.res === 'agree') {

                                        if (res.data.action === 'delete') {

                                            var objects = vm.entityViewerDataService.getObjects();

                                            objects.forEach(function (obj) {

                                                if (activeObject.id === obj.id) {

                                                    var parent = vm.entityViewerDataService.getData(obj.___parentId);

                                                    parent.results = parent.results.filter(function (resultItem) {
                                                        return resultItem.id !== activeObject.id
                                                    });

                                                    vm.entityViewerDataService.setData(parent)

                                                }

                                            });

                                            vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                                            updateTableAfterEntitiesDeletion([activeObject.id]);

                                        } else {

                                            console.log('res', res);

                                            var objects = vm.entityViewerDataService.getObjects();

                                            objects.forEach(function (obj) {

                                                if (res.data.id === obj.id) {

                                                    Object.keys(res.data).forEach(function (key) {

                                                        obj[key] = res.data[key]

                                                    });

                                                    vm.entityViewerDataService.setObject(obj);

                                                }

                                            });

                                            vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                        }

                                    }
                                });*/
        $bigDrawer.show({
            controller: 'TransactionTypeEditDialogController as vm',
            templateUrl: 'views/entity-viewer/transaction-type-edit-drawer-view.html',
            addResizeButton: false, // ttype always have max width without resize button
            drawerWidth: bigDrawerWidth,
            locals: {
                entityType: entitytype,
                entityId: entityId,
                data: {
                    openedIn: 'big-drawer',
                    editLayout: layout
                }
            }

        }).then(function (res) {

            postTTypeEditionActions(evDataService, evEventService, layout, $bigDrawer, res, entityId);

            /*                            vm.entityViewerDataService.setActiveObjectAction(null);
                                        vm.entityViewerDataService.setActiveObjectActionData(null);

                                        if (res && res.res === 'agree') {

                                            if (res.data.action === 'delete') {

                                                var objects = vm.entityViewerDataService.getObjects();

                                                objects.forEach(function (obj) {

                                                    if (activeObject.id === obj.id) {

                                                        var parent = vm.entityViewerDataService.getData(obj.___parentId);

                                                        parent.results = parent.results.filter(function (resultItem) {
                                                            return resultItem.id !== activeObject.id
                                                        });

                                                        vm.entityViewerDataService.setData(parent)

                                                    }

                                                });

                                                vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                                                evHelperService.updateTableAfterEntitiesDeletion(vm, [activeObject.id]);

                                            } else {

                                                console.log('res', res);

                                                var objects = vm.entityViewerDataService.getObjects();

                                                objects.forEach(function (obj) {

                                                    if (res.data.id === obj.id) {

                                                        Object.keys(res.data).forEach(function (key) {

                                                            obj[key] = res.data[key]

                                                        });

                                                        vm.entityViewerDataService.setObject(obj);

                                                    }

                                                });

                                                vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                            }

                                        }*/

        });
    };


    var openInstrumentTypeAddDrawer = function (
        evDataService,
        evEventService,
        layout,
        $bigDrawer,
        entityType,
        entity
    ) {

        var bigDrawerWidth = getBigDrawerWidth(6);

        $bigDrawer.show({
            controller: 'InstrumentTypeAddDialogController as vm',
            templateUrl: 'views/entity-viewer/instrument-type-add-drawer-view.html',
            addResizeButton: false, // ttype always have max width without resize button
            drawerWidth: bigDrawerWidth,
            locals: {
                entityType: entityType,
                entity: entity,
                data: {
                    openedIn: 'big-drawer',
                    editLayout: layout
                }
            }

        }).then(function (res) {

            postInstrumentTypeAdditionActions(evDataService, evEventService, layout, $bigDrawer, res, res.data);

        });

    };


    var openInstrumentTypeEditDrawer = function (
        evDataService,
        evEventService,
        layout,
        $bigDrawer,
        entitytype,
        entityId
    ) {

        var bigDrawerWidth = getBigDrawerWidth(6);

        $bigDrawer.show({
            controller: 'InstrumentTypeEditDialogController as vm',
            templateUrl: 'views/entity-viewer/instrument-type-edit-drawer-view.html',
            addResizeButton: false, // ttype always have max width without resize button
            drawerWidth: bigDrawerWidth,
            locals: {
                entityType: entitytype,
                entityId: entityId,
                data: {
                    openedIn: 'big-drawer',
                    editLayout: layout
                }
            }

        }).then(function (res) {

            postInstrumentTypeEditionActions(evDataService, evEventService, layout, $bigDrawer, res, entityId);


        });
    };


    var openEntityViewerAddDrawer = function (
        evDataService,
        evEventService,
        layout,
        $bigDrawer,
        entityType,
        entity
    ) {

        /* $mdDialog.show({
            controller: 'EntityViewerAddDialogController as vm',
            templateUrl: 'views/entity-viewer/entity-viewer-add-dialog-view.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                entityType: scope.entityType,
                entity: {},
                data: {
                    openedIn: 'modal-dialog'
                }
            }

        }).then(postAddEntityFn); */

        var bigDrawerOptions = getBigDrawerOptions(layout, entityType);

        $bigDrawer.show({
            controller: 'EntityViewerAddDialogController as vm',
            templateUrl: 'views/entity-viewer/entity-viewer-universal-add-drawer-view.html',
            addResizeButton: true,
            drawerWidth: bigDrawerOptions.width,
            locals: {
                entityType: entityType,
                entity: entity,
                data: {
                    openedIn: 'big-drawer',
                    editLayout: bigDrawerOptions.editLayout
                }
            }

        }).then(function (res) {

            postAdditionActions(evDataService, evEventService, layout, $bigDrawer, res, res.data);

        });

    };


    var openEntityViewerEditDrawer = function (
        evDataService,
        evEventService,
        layout,
        $bigDrawer,
        entityType,
        entityId
    ) {

        var bigDrawerOptions = getBigDrawerOptions(layout, entityType);

        /* $mdDialog.show({
            controller: 'EntityViewerEditDialogController as vm',
            templateUrl: 'views/entity-viewer/entity-viewer-edit-dialog-view.html',
            parent: angular.element(document.body),
            targetEvent: activeObject.event,
            //clickOutsideToClose: false,
            locals: {
                entityType: entityType,
                entityId: activeObject.id,
                data: {}
            }
        }).then(function (res) {

            vm.entityViewerDataService.setActiveObjectAction(null);
            vm.entityViewerDataService.setActiveObjectActionData(null);

            if (res && res.res === 'agree') {

                if (res.data.action === 'delete') {

                    var objects = vm.entityViewerDataService.getObjects();

                    objects.forEach(function (obj) {

                        if (activeObject.id === obj.id) {

                            var parent = vm.entityViewerDataService.getData(obj.___parentId);

                            parent.results = parent.results.filter(function (resultItem) {
                                return resultItem.id !== activeObject.id
                            });

                            vm.entityViewerDataService.setData(parent)

                        }

                    });

                    vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                } else {

                    var objects = vm.entityViewerDataService.getObjects();

                    objects.forEach(function (obj) {

                        if (res.data.id === obj.id) {

                            Object.keys(res.data).forEach(function (key) {

                                obj[key] = res.data[key]

                            });

                            vm.entityViewerDataService.setObject(obj);

                        }

                    });

                    vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                }

            }

        }); */
        $bigDrawer.show({
            controller: 'EntityViewerEditDialogController as vm',
            templateUrl: 'views/entity-viewer/entity-viewer-edit-drawer-view.html',
            addResizeButton: true,
            drawerWidth: bigDrawerOptions.width,
            locals: {
                entityType: entityType,
                entityId: entityId,
                data: {
                    openedIn: 'big-drawer',
                    editLayout: bigDrawerOptions.editLayout
                }
            }

        }).then(function (res) {

            postEditionActions(evDataService, evEventService, layout, $bigDrawer, res, entityId);

        });
    };

    var updateTableAfterEntitiesDeletion = function (evDataService, evEventService, deletedEntitiesIds) {

        var evOptions = evDataService.getEntityViewerOptions();
        var objects = evDataService.getObjects();

        objects.forEach(function (obj) {

            if (deletedEntitiesIds.includes(obj.id)) {

                var parent = evDataService.getData(obj.___parentId)

                // if deleted entities shown, mark them
                if (evOptions.entity_filters && evOptions.entity_filters.includes('deleted')) {

                    parent.results.forEach(function (resultItem) {

                        if (deletedEntitiesIds.includes(resultItem.id)) {
                            resultItem.is_deleted = true
                        }

                    });

                } else { // if deleted entities hidden, remove them

                    parent.results = parent.results.filter(function (resultItem) {
                        return !deletedEntitiesIds.includes(resultItem.id);
                    });

                }

                evDataService.setData(parent);

            }

        });

        evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

    };

    var updateEntityInsideTable = function (evDataService, evEventService, res) {

        var objects = evDataService.getObjects();

        objects.forEach(function (obj) {

            if (res.data.id === obj.id) {

                Object.keys(res.data).forEach(function (key) {

                    obj[key] = res.data[key]

                });

                evDataService.setObject(obj);

            }

        });

        evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

    };

    module.exports = {
        transformItem: transformItem,
        checkForLayoutConfigurationChanges: checkForLayoutConfigurationChanges,
        getTableAttrInFormOf: getTableAttrInFormOf,

        getDynamicAttrValue: getDynamicAttrValue,
        getLayoutByUserCode: getLayoutByUserCode,
        getDefaultLayout: getDefaultLayout,
        getValueFromDynamicAttrsByUserCode: getValueFromDynamicAttrsByUserCode,

        getEditLayoutMaxColumns: getEditLayoutMaxColumns,
        getBigDrawerWidth: getBigDrawerWidth,

        updateTableAfterEntitiesDeletion: updateTableAfterEntitiesDeletion,

        openEntityViewerEditDrawer: openEntityViewerEditDrawer,
        openEntityViewerAddDrawer: openEntityViewerAddDrawer,

        openTTypeEditDrawer: openTTypeEditDrawer,
        openTTypeAddDrawer: openTTypeAddDrawer,

        openInstrumentTypeEditDrawer: openInstrumentTypeEditDrawer,
        openInstrumentTypeAddDrawer: openInstrumentTypeAddDrawer,

        openComplexTransactionEditDrawer: openComplexTransactionEditDrawer,
        openComplexTransactionAddDrawer: openComplexTransactionAddDrawer,

        postAdditionActions: postAdditionActions,
    }

}());