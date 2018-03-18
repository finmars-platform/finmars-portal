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

        if(state == 'app.dashboard') {
            result = state.split('.')[1];
        }


        console.log('result 3232', result);

        return result;

    };

    var getContentTypeList = function () {
        return metaContentTypesRepository.getContentTypeList();
    };

    var findEntityByAPIContentType = function () {
        return metaContentTypesRepository.getContentTypeList().then(function (data) {
            var contentTypeList = data.results,
                listForUi = getListForUi(),
                entities = [];

            if (contentTypeList && contentTypeList.length > 0) {
                contentTypeList.forEach(function (type) {
                    var typeKey,
                        entityFound = false;
                    // Create key property for content type from api
                    typeKey = type.app_label + '.' + type.model;

                    for (var a = 0; a < listForUi.length; a++) {
                        var UiType = listForUi[a],
                            APIEntity = {};
                        if (entityFound == true) {
                            break;
                        }
                        else if (typeKey == UiType.key) {
                            APIEntity.id = type.id;
                            APIEntity.name = UiType.name;
                            entities.push(APIEntity);
                            entityFound = true;
                        }
                    }
                });
            }

            return entities;
        });
    };

    module.exports = {
        getListForTags: getListForTags,
        getListForUi: getListForUi,

        findContentTypeByEntity: findContentTypeByEntity,
        findEntityByContentType: findEntityByContentType,
        findEntityByAPIContentType: findEntityByAPIContentType,

        getListForTransactionTypeInputs: getListForTransactionTypeInputs,

        getContentTypeUIByState: getContentTypeUIByState,

        getContentTypeList: getContentTypeList
    }


}());