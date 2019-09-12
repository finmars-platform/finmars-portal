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

    var transformItems = function (items, attrs) {
        return new Promise(function (resolve, reject) {
            var transformedItems = [];
            var i, x;
            //console.log('attrs', attrs);
            if (items && items.length) {
                transformedItems = items.map(function (item) {
                    if (item.attributes) {
                        for (i = 0; i < attrs.length; i = i + 1) {
                            for (x = 0; x < item.attributes.length; x = x + 1) {
                                if (item.attributes[x]['attribute_type'] === attrs[i].id) {
                                    item.attributes[x]['attribute_name'] = attrs[i].name;
                                    if (item.attributes[x]['attribute_type_object'].value_type == 30) {
                                        item[attrs[i].name] = item.attributes[x]['classifier'];
                                        //console.log('item!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', item);
                                    } else {
                                        if (item.attributes[x]['attribute_type_object'].value_type == 40) {
                                            item[attrs[i].name] = item.attributes[x]['value_date'];
                                        } else {
                                            if (item.attributes[x]['attribute_type_object'].value_type == 20) {
                                                item[attrs[i].name] = item.attributes[x]['value_float'];
                                            } else {
                                                item[attrs[i].name] = item.attributes[x]['value_string'];
                                            }
                                        }

                                    }

                                }
                            }
                        }
                    }

                    return item;
                });
            }
            ;
            // console.log('Items transformed', transformedItems);
            resolve(transformedItems);

        });

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

            if (activeLayoutConfig.data.reportOptions) {
                delete activeLayoutConfig.data.reportOptions.task_id;
                delete activeLayoutConfig.data.reportOptions.recieved_at;
                delete activeLayoutConfig.data.reportOptions.task_status;
            }

            if (activeLayoutConfig.data.hasOwnProperty('reportLayoutOptions') && activeLayoutConfig.data.reportLayoutOptions.hasOwnProperty('datepickerOptions')) {

                if (activeLayoutConfig.data.reportLayoutOptions.datepickerOptions.reportFirstDatepicker.datepickerMode !== 'datepicker') {
                    delete activeLayoutConfig.data.reportOptions.pl_first_date;
                }

                if (activeLayoutConfig.data.reportLayoutOptions.datepickerOptions.reportLastDatepicker.datepickerMode !== 'datepicker') {
                    delete activeLayoutConfig.data.reportOptions.report_date;
                }

            }

			delete layoutCurrentConfig.data.reportOptions.task_id;
			delete layoutCurrentConfig.data.reportOptions.recieved_at;
			delete layoutCurrentConfig.data.reportOptions.task_status;

            if (layoutCurrentConfig.data.hasOwnProperty('reportLayoutOptions') && layoutCurrentConfig.data.reportLayoutOptions.hasOwnProperty('datepickerOptions')) {

                if (layoutCurrentConfig.data.reportLayoutOptions.datepickerOptions.reportFirstDatepicker.datepickerMode !== 'datepicker') {
                    delete layoutCurrentConfig.data.reportOptions.pl_first_date;
                }

                if (layoutCurrentConfig.data.reportLayoutOptions.datepickerOptions.reportLastDatepicker.datepickerMode !== 'datepicker') {
                    delete layoutCurrentConfig.data.reportOptions.report_date;
                }

            }

        }

        var layoutChanged = objectComparisonHelper.comparePropertiesOfObjects(activeLayoutConfig, layoutCurrentConfig);

        return layoutChanged;
    };

    module.exports = {
        transformItems: transformItems,
        checkForLayoutConfigurationChanges: checkForLayoutConfigurationChanges
    }

}());