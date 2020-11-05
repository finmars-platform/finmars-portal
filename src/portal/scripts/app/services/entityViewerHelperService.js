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

    let getLayoutByUserCode = function (viewModel, userCode, $mdDialog) {

        uiService.getListLayout(viewModel.entityType, {
            pageSize: 1000,
            filters: {
                user_code: userCode
            }

        }).then(function (activeLayoutData) {

            let activeLayout = null;

            if (activeLayoutData.hasOwnProperty('results') && activeLayoutData.results[0]) {
                activeLayout = activeLayoutData.results[0];
            }

            if (activeLayout) {
                viewModel.setLayout(activeLayout);

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
                }).then(function (value) {

                    viewModel.getDefaultLayout()

                })

            }

        });

    };

    let getDefaultLayout = function (viewModel, viewContext) {

        uiService.getDefaultListLayout(viewModel.entityType).then(function (defaultLayoutData) {

            var defaultLayout = null;
            if (defaultLayoutData.results && defaultLayoutData.results.length > 0) {

                defaultLayout = defaultLayoutData.results[0];
                if (viewContext === 'split_panel') {
                    middlewareService.setNewSplitPanelLayoutName(defaultLayout.name);
                }

            }

            viewModel.setLayout(defaultLayout);

        });

    };

    module.exports = {
        transformItem: transformItem,
        checkForLayoutConfigurationChanges: checkForLayoutConfigurationChanges,
        getTableAttrInFormOf: getTableAttrInFormOf,

        getDynamicAttrValue: getDynamicAttrValue,
        getValueFromDynamicAttrsByUserCode: getValueFromDynamicAttrsByUserCode,
        getLayoutByUserCode: getLayoutByUserCode,
        getDefaultLayout: getDefaultLayout
    }

}());