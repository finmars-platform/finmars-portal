/**
 * Created by szhitenev on 06.05.2016.
 */
/**
 * Entity viewer helper service.
 * @module EntityViewerHelperService
 */
(function () {

    let objectComparisonHelper = require('../helpers/objectsComparisonHelper');
    let uiService = require('../services/uiService');

    var entityResolverService = require('../services/entityResolverService');

    var middlewareService = require('../services/middlewareService');
    var evRvCommonHelper = require('../helpers/ev-rv-common.helper');
    var evEvents = require('../services/entityViewerEvents');

    'use strict';

    let transformItem = function (item, attrs) {

        if (item.attributes) {

            let key;

            console.log('transformItem.item', item);
            console.log('transformItem.attrs', attrs);

            attrs.forEach(function (attributeType) {

                item.attributes.forEach(function (attribute) {

                    if (attributeType.user_code === attribute.attribute_type_object.user_code) {

                        key = attributeType.user_code;

                        if (attributeType.value_type === 10){
                            item[key] = attribute.value_string
                        }

                        if (attributeType.value_type === 20) {
                            item[key] = attribute.value_float
                        }

                        if (attributeType.value_type === 30) {
                            item[key] = attribute.classifier
                        }

                        if (attributeType.value_type === 40) {
                            item[key] = attribute.value_date
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
     * @memberOf module:EntityViewerHelperService
     * @return {boolean} Returns true if layout has been changed, otherwise false
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

        let layoutChanged = objectComparisonHelper.areObjectsTheSame(activeLayoutConfig, layoutCurrentConfig);

        return layoutChanged;
    };

    /**
     * Turn table attribute into group, column or filter
     * @param {string} form - In what form get attribute
     * @param {object} attrInstance - Object with attribute data on which attribute form will be based
     * @memberOf module:EntityViewerHelperService
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

        switch (form) {
            case 'group':
                attrTypeToAdd.groups = true;
                break;
            case 'column':
                attrTypeToAdd.columns = true;
                break;
            case 'filter':
                attrTypeToAdd.filters = true;
                break;
        }

        attrTypeToAdd.name = attrInstance.name;
        attrTypeToAdd.value_type = attrInstance.value_type;

        return attrTypeToAdd;

    };

    /**
     * Get value of dynamic attribute by it's user_code
     * @param {object} dAttrData - Data of dynamic attribute
     * @memberOf module:EntityViewerHelperService
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
     * @memberOf module:EntityViewerHelperService
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

    let getLayoutByUserCode = function (viewModel, userCode, $mdDialog, viewContext) {

    	return new Promise(function (resolve) {

    		uiService.getListLayout(viewModel.entityType, {
				pageSize: 1000,
				filters: {
					user_code: userCode
				}

			}).then(async function (activeLayoutData) {

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

    let getDefaultLayout = function (viewModel, viewContext) {

    	return new Promise(function (resolve, reject) {

    		uiService.getDefaultListLayout(viewModel.entityType).then(async function (defaultLayoutData) {

				let defaultLayout = null;
				if (defaultLayoutData.results && defaultLayoutData.results.length > 0) {

					defaultLayout = defaultLayoutData.results[0];
					if (viewContext === 'split_panel') {
						middlewareService.setNewSplitPanelLayoutName(defaultLayout.name);
					}

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
     * @memberOf module:EntityViewerHelperService
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

    }

    /**
     * Get big drawer width percentage by fixed area columns
     * @param {number} columns
     * @returns {string}
     */
    var getBigDrawerWidthPercent = function (columns) {

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

			const fields = viewModel.keysOfFixedFieldsAttrs.reduce((acc,key) => {

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
			fields.showByDefault = {key: 'Show by default', value: viewModel.showByDefault, options: viewModel.showByDefaultOptions}

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

    var insertObjectAfterCreateHandler = function (viewModel, resultItem) {

        var groups = viewModel.evDataService.getDataAsList();
        var requestParameters = viewModel.evDataService.getAllRequestParameters();
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

        viewModel.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

    };

    var duplicateEntity = async function (viewModel, $bigDrawer, entity) {

        var editLayout;
        if (viewModel.entityType === 'complex-transaction') {

            // complex transaction contain layout
            var layoutId = viewModel.transaction_type_object && viewModel.transaction_type_object.book_transaction_layout.id;
            editLayout = await uiService.getEditLayout(layoutId);

        } else {
            editLayout = await uiService.getDefaultEditLayout(viewModel.entityType);
        }

        var fixedAreaColumns = 6;

        if (editLayout.results.length) {

            var tabs = Array.isArray(editLayout.results[0].data) ? editLayout.results[0].data : editLayout.results[0].data.tabs;
            fixedAreaColumns = getEditLayoutMaxColumns(tabs);

        }

        var bigDrawerWidthPercent = getBigDrawerWidthPercent(fixedAreaColumns);

        $bigDrawer.show({
            controller: 'EntityViewerAddDialogController as viewModel',
            templateUrl: 'views/entity-viewer/entity-viewer-universal-add-drawer-view.html',
            addResizeButton: true,
            drawerWidth: bigDrawerWidthPercent,
            locals: {
                entityType: viewModel.entityType,
                entity: entity,
                data: {
                    openedIn: 'big-drawer',
                    editLayout: editLayout
                }
            }

        }).then(res => {});

    };

    var postEditionActions = function (viewModel, $bigDrawer, res, activeObject) {

        viewModel.entityViewerDataService.setActiveObjectAction(null);
        viewModel.entityViewerDataService.setActiveObjectActionData(null);

        if (res && res.res === 'agree') {

            if (res.data.action === 'delete') {

                updateTableAfterEntitiesDeletion(viewModel, [activeObject.id]);

            } else if (res.data.action === 'copy') {

                duplicateEntity(viewModel, $bigDrawer, res.data.entity);

            } else {

                updateEntityInsideTable(viewModel);

            }

        }

    };

    var openEntityViewerEditDrawer = async function (viewModel, $bigDrawer, entitytype, entityId) {
        var editLayout = await uiService.getDefaultEditLayout(entitytype);
        var bigDrawerWidthPercent;
        var fixedAreaColumns;

        if (editLayout.results.length) {

            var tabs = Array.isArray(editLayout.results[0].data) ? editLayout.results[0].data : editLayout.results[0].data.tabs;
            fixedAreaColumns = getEditLayoutMaxColumns(tabs);

            bigDrawerWidthPercent = getBigDrawerWidthPercent(fixedAreaColumns);

        }
        /* $mdDialog.show({
            controller: 'EntityViewerEditDialogController as vm',
            templateUrl: 'views/entity-viewer/entity-viewer-edit-dialog-view.html',
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
            templateUrl: 'views/entity-viewer/entity-viewer-universal-edit-drawer-view.html',
            addResizeButton: true,
            drawerWidth: bigDrawerWidthPercent,
            locals: {
                entityType: entitytype,
                entityId: entityId,
                data: {
                    openedIn: 'big-drawer',
                    editLayout: editLayout
                }
            }

        }).then(function (res) {

            postEditionActions(viewModel, $bigDrawer, res, entityId);

        });
    }

    var postAddEntityFn = function (viewModel, $bigDrawer, res) {
        if (res && res.res === 'agree') {

            insertObjectAfterCreateHandler(viewModel, res.data);

            if (res.data.action = 'edit') {
                // open edit window
                const entitytype = res.data.entityType;
                const entityId = res.data.entity.id;
                openEntityViewerEditDrawer(viewModel, $bigDrawer, entitytype, entityId)

            }
        }
    };

    var updateTableAfterEntitiesDeletion = function (viewModel, deletedEntitiesIds) {

        var evOptions = viewModel.entityViewerDataService.getEntityViewerOptions();
        var objects = viewModel.entityViewerDataService.getObjects();

        objects.forEach(function (obj) {

            if (deletedEntitiesIds.includes(obj.id)) {

                var parent = viewModel.entityViewerDataService.getData(obj.___parentId)

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

                viewModel.entityViewerDataService.setData(parent);

            }

        });

        viewModel.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

    };

    var updateEntityInsideTable = function (viewModel) {

        var objects = viewModel.entityViewerDataService.getObjects();

        objects.forEach(function (obj) {

            if (res.data.id === obj.id) {

                Object.keys(res.data).forEach(function (key) {

                    obj[key] = res.data[key]

                });

                viewModel.entityViewerDataService.setObject(obj);

            }

        });

        viewModel.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);
    };

    module.exports = {
        transformItem: transformItem,
        checkForLayoutConfigurationChanges: checkForLayoutConfigurationChanges,
        getTableAttrInFormOf: getTableAttrInFormOf,

        getDynamicAttrValue: getDynamicAttrValue,
        getLayoutByUserCode: getLayoutByUserCode,
        getDefaultLayout: getDefaultLayout,
        getValueFromDynamicAttrsByUserCode: getValueFromDynamicAttrsByUserCode,

        getFieldsForFixedAreaPopup: getFieldsForFixedAreaPopup,
        getEditLayoutMaxColumns: getEditLayoutMaxColumns,
        getBigDrawerWidthPercent: getBigDrawerWidthPercent,

        updateTableAfterEntitiesDeletion: updateTableAfterEntitiesDeletion,
        openEntityViewerEditDrawer:openEntityViewerEditDrawer,

        postAddEntityFn: postAddEntityFn

    }

}());