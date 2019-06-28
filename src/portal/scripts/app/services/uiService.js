/**
 * Created by szhitenev on 16.06.2016.
 */
(function () {

    'use strict';

    var metaContentTypesService = require('./metaContentTypesService');

    var uiRepository = require('../repositories/uiRepository');

    var getEditLayout = function (entity) {
        return uiRepository.getEditLayout(entity);
    };

    var createEditLayout = function (entity, ui) {

        ui.content_type = metaContentTypesService.findContentTypeByEntity(entity, 'ui');

        return uiRepository.createEditLayout(ui);
    };

    var updateEditLayout = function (id, ui) {
        return uiRepository.updateEditLayout(id, ui);
    };

    var getListLayout = function (entity, options) {
        return uiRepository.getListLayout(entity, options);
    };

    var getListLayoutByKey = function (key) {
        return uiRepository.getListLayoutByKey(key);
    };

    var getActiveListLayout = function (entity) {
        return uiRepository.getActiveListLayout(entity);
    };

    var createListLayout = function (entity, ui) {

        ui.content_type = metaContentTypesService.findContentTypeByEntity(entity, 'ui');

        return uiRepository.createListLayout(ui);
    };

    var updateListLayout = function (id, ui) {
        return uiRepository.updateListLayout(id, ui)
    };

    var deleteListLayoutByKey = function (id) {
        return uiRepository.deleteListLayoutByKey(id);
    };

    var getDefaultListLayout = function () {
        return uiRepository.getDefaultListLayout();
    };

    var getDefaultEditLayout = function (entityType) {
        return uiRepository.getDefaultEditLayout(entityType);
    };

    var getEditLayoutByInstanceId = function (entityType, id) {
        console.log("forms getEditLayoutByInstanceId", entityType, id);
        return uiRepository.getEditLayoutByInstanceId(entityType, id).then(function (data) {
            if (entityType == 'complex-transaction') {
                return data.book_transaction_layout;
            }
        });
    };

    var updateEditLayoutByInstanceId = function (entityType, id, editLayout) {

        if (entityType == 'complex-transaction') {
            return uiRepository.updateEditLayoutByInstanceId(entityType, id, {book_transaction_layout: editLayout})
        }

    };

    var getConfigurationList = function () {
        return uiRepository.getConfigurationList();
    };

    var createConfiguration = function (data) {
        return uiRepository.createConfiguration(data)
    };

    var updateConfiguration = function (id, data) {
        return uiRepository.updateConfiguration(id, data);
    };

    var deleteConfigurationByKey = function (id) {
        return uiRepository.deleteConfigurationByKey(id);
    };


    var getTransactionFieldList = function () {
        return uiRepository.getTransactionFieldList()
    };

    var createTransactionField = function (data) {
        return uiRepository.createTransactionField(data);
    };

    var updateTransactionField = function (id, data) {
        return uiRepository.updateTransactionField(id, data);
    };

    var getInstrumentFieldList = function () {
        return uiRepository.getInstrumentFieldList()
    };

    var createInstrumentField = function (data) {
        return uiRepository.createInstrumentField(data);
    };

    var updateInstrumentField = function (id, data) {
        return uiRepository.updateInstrumentField(id, data);
    };

    module.exports = {
        getDefaultListLayout: getDefaultListLayout,
        getDefaultEditLayout: getDefaultEditLayout,
        getEditLayout: getEditLayout,
        createEditLayout: createEditLayout,
        updateEditLayout: updateEditLayout,
        getListLayout: getListLayout,
        getListLayoutByKey: getListLayoutByKey,
        createListLayout: createListLayout,
        updateListLayout: updateListLayout,
        getEditLayoutByInstanceId: getEditLayoutByInstanceId,
        updateEditLayoutByInstanceId: updateEditLayoutByInstanceId,
        getActiveListLayout: getActiveListLayout,

        deleteListLayoutByKey: deleteListLayoutByKey,


        getConfigurationList: getConfigurationList,
        createConfiguration: createConfiguration,
        updateConfiguration: updateConfiguration,
        deleteConfigurationByKey: deleteConfigurationByKey,


        getTransactionFieldList: getTransactionFieldList,
        createTransactionField: createTransactionField,
        updateTransactionField: updateTransactionField,


        getInstrumentFieldList: getInstrumentFieldList,
        createInstrumentField: createInstrumentField,
        updateInstrumentField: updateInstrumentField
    }

}());