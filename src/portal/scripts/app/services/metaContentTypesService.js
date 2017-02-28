/**
 * Created by szhitenev on 12.09.2016.
 */
(function () {

    var metaContentTypesRepository = require('../repositories/metaContentTypesRepository');

    var getListForTags = function (entity) {
        return metaContentTypesRepository.getListForTags(entity);
    };

    var getListForUi = function () {
        return metaContentTypesRepository.getListForUi();
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

    var findEntityByContentType = function (contentType, type) {

        var contentTypes;
        if (type == 'tag') {
            contentTypes = getListForTags();
        } else {
            if (type == 'ui') {
                contentTypes = getListForUi();
            }
        }

        var entity = null;

        contentTypes.forEach(function (item) {
            if (item.key == contentType) {
                entity = item.entity
            }
        });

        return entity;

    };

    var getListForTransactionTypeInputs = function () {
        return metaContentTypesRepository.getListForTransactionTypeInputs();
    };

    var getContentTypeUIByState = function (state) {

        var result = '';

        console.log('state', state);

        if (state.indexOf('app.data') !== -1 || state.indexOf('app.reports') !== -1) {

            result = state.split('.')[2];

        }

        console.log('result 3232', result);

        return result;

    };


    module.exports = {
        getListForTags: getListForTags,
        getListForUi: getListForUi,

        findContentTypeByEntity: findContentTypeByEntity,
        findEntityByContentType: findEntityByContentType,

        getListForTransactionTypeInputs: getListForTransactionTypeInputs,

        getContentTypeUIByState: getContentTypeUIByState
    }


}());