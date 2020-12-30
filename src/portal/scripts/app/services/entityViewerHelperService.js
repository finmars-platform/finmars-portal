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

	/**
	 * @param {object} viewModel - view model of current reportViewerController or entityViewerController
	 * @param {string} userCode
	 * @param {obj} $mdDialog
	 * @param {string} viewContext
	 * @memberOf module:EntityViewerHelperService
	 * @return {promise}
	 */
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

	/**
	 * @param {object} viewModel - view model of current reportViewerController or entityViewerController
	 * @param {string} viewContext
	 * @memberOf module:EntityViewerHelperService
	 * @return {promise}
	 */
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
    var getFieldsForFixedAreaPopup = function (viewModel, keysOfFixedFieldsAttrs) {

        const fields = keysOfFixedFieldsAttrs.reduce((acc,key) => {

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
        fields.hasOwnProperty('type') && entityResolverService.getListLight(fields.type.value_entity).then((data) => {

        	const options = Array.isArray(data) ? data : data.results;
            fields.type.options = options;
            viewModel.setTypeSelectorOptions(options);

        });

        return fields;

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
        getBigDrawerWidthPercent: getBigDrawerWidthPercent
    }

}());