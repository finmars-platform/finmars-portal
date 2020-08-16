/**
 * Created by szhitenev on 06.05.2016.
 */
/**
 * Entity viewer helper service.
 * @module EntityViewerHelperService
 */
(function () {

    var objectComparisonHelper = require('../helpers/objectsComparisonHelper');

    'use strict';

    var transformItem = function (item, attrs) {

        if (item.attributes) {

            var key;

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
    var checkForLayoutConfigurationChanges = function (activeLayoutConfig, layoutCurrentConfig, isReport) {

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

        var layoutChanged = objectComparisonHelper.areObjectsTheSame(activeLayoutConfig, layoutCurrentConfig);

        return layoutChanged;
    };

    /**
     * Turn table attribute into group, column or filter
     * @param {string} form - In what form get attribute
     * @param {object} attrInstance - Object with attribute data on which attribute form will be based
     * @memberOf module:EntityViewerHelperService
     * @return {object} Return attribute in form of group, column or filter
     */
    var getTableAttrInFormOf = function (form, attrInstance) {
        console.log("add filter getTableAttrInFormOf attrInstance", attrInstance);
        var attrTypeToAdd = {};

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
    var getDynamicAttrValue = function (dAttrData) {

        var attrVal;

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
    var getValueFromDynamicAttrsByUserCode = function (userCode, dAttrsList) {

        var cellValue;

        for (var da = 0; da < dAttrsList.length; da++) {
            var dynamicAttributeData = dAttrsList[da];

            if (dynamicAttributeData.attribute_type_object.user_code === userCode) {

                cellValue = getDynamicAttrValue(dynamicAttributeData);
                break;

            }

        }

        return cellValue;

    };

    module.exports = {
        transformItem: transformItem,
        checkForLayoutConfigurationChanges: checkForLayoutConfigurationChanges,
        getTableAttrInFormOf: getTableAttrInFormOf,

        getDynamicAttrValue: getDynamicAttrValue,
        getValueFromDynamicAttrsByUserCode: getValueFromDynamicAttrsByUserCode
    }

}());