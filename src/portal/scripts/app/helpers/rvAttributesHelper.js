/**
 * Report Viewer Attributes Helper.
 * @module rvAttributesHelper
 */

(function () {

    var metaService = require('../services/metaService');
    var modelService = require('../services/modelService');

    /**
     * Get list of entity attributes and all children attributes.
     * @param {string} rootContentType - content type (e.g. instruments.instrument).
     * @param {string} rootKey - key prefix for root level attributes.
     * @param {string} rootName - name prefix for root level attributes.
     * @param {object} options - all other options.
     * @return {Object[]} Array of Attributes.
     * @memberof module:rvAttributesHelper
     */

    var getAllAttributesAsFlatList = function (rootContentType, rootKey, rootName, options) {

        var result = [];
        var defaultOptions = {
            maxDepth: 1
        };

        var _options = Object.assign({}, defaultOptions, options);

        var currentLevel = 0;

        getAttributesRecursive(result, currentLevel, rootContentType, rootKey, rootName, _options);

        // console.log('currentLevel', currentLevel);
        // console.log('result', result);

        return result;

    };

    var getAttributesRecursive = function (result, currentLevel, contentType, parentKey, parentName, options) {

        // console.log('contentType', contentType);

        var attributes = modelService.getAttributesByContentType(contentType);

        var key;
        var name;
        var resultAttr;

        if (attributes) {

            attributes.forEach(function (attribute) {

                name = parentName + '. ' + attribute.name;

                if(parentKey) {
                    key = parentKey + '.' + attribute.key;
                } else {
                    key = attribute.key;
                }

                if (attribute.value_type === 'field' && attribute.code === 'user_code') {

                    if (currentLevel < options.maxDepth) {

                        // console.log('attribute', attribute);

                        getAttributesRecursive(result, currentLevel + 1, attribute.value_content_type, key, name, options)

                    }

                } else {

                    if (attribute.value_type !== 'mc_field') {

                        resultAttr = Object.assign({}, attribute);

                        resultAttr.content_type = contentType;
                        resultAttr.name = name;
                        resultAttr.key = key;

                        result.push(resultAttr);

                    }

                }

            })

        } else {
            console.warn('Can\'t find attributes for content type: ' + contentType)
        }

    };

    module.exports = {
        getAllAttributesAsFlatList: getAllAttributesAsFlatList
    }


}());