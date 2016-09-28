/**
 * Created by szhitenev on 12.09.2016.
 */
(function () {

    var metaContentTypesRepository = require('../repositories/metaContentTypesRepository');

    var getListForTags = function (entity) {
        return metaContentTypesRepository.getListForTags(entity);
    };

    var getListForUi = function (entity) {
        return metaContentTypesRepository.getListForUi(entity);
    };

    var findContentTypeByEntity = function (entity, type) {

        var contentTypes;
        if (type == 'tag') {
            contentTypes = getListForTags();
        } else {
            if (type == 'ui') {
                contentTypes = getListForUi();
            }
        }

        var contentType = null;

        contentTypes.forEach(function (item) {
            if (item.entity == entity) {
                contentType = item.key
            }
        });

        return contentType;
    };

    var getListForTransactionTypeInputs = function () {
        return metaContentTypesRepository.getListForTransactionTypeInputs();
    };


    module.exports = {
        getListForTags: getListForTags,
        getListForUi: getListForUi,
        findContentTypeByEntity: findContentTypeByEntity,
        getListForTransactionTypeInputs: getListForTransactionTypeInputs
    }


}());