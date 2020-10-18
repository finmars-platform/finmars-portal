/**
 * Created by szhitenev on 16.06.2016.
 */
(function () {

    'use strict';

    let metaContentTypesService = require('./metaContentTypesService');
    let localStorageService = require('../../../../core/services/localStorageService');

    let uiRepository = require('../repositories/uiRepository');

    let getPortalInterfaceAccess = function () {
        return uiRepository.getPortalInterfaceAccess();
    };

    let getEditLayout = function (entity) {
        return uiRepository.getEditLayout(entity);
    };

    let createEditLayout = function (entity, ui) {

        ui.content_type = metaContentTypesService.findContentTypeByEntity(entity, 'ui');

        return uiRepository.createEditLayout(ui);
    };

    let updateEditLayout = function (id, ui) {
        return uiRepository.updateEditLayout(id, ui);
    };

    let getListLayout = function (entity, options) {

        uiRepository.getListLayoutLight(entity, options).then(function (data) {

            console.log("layout caching data", data);

        });

        /* if (localStorageService.getCachedLayout()) {

        }

        return uiRepository.getListLayout(entity, options);
        */

    };

    let getListLayoutDefault = function (options) {
        return uiRepository.getListLayoutDefault(options);
    };

    let getListLayoutByKey = function (key) {
        return uiRepository.getListLayoutByKey(key);
    };

    let createListLayout = function (entity, ui) {

        ui.content_type = metaContentTypesService.findContentTypeByEntity(entity, 'ui');

        return uiRepository.createListLayout(ui);
    };

    let updateListLayout = function (id, ui) {
        return uiRepository.updateListLayout(id, ui)
    };

    let deleteListLayoutByKey = function (id) {
        return uiRepository.deleteListLayoutByKey(id);
    };

    let getListLayoutTemplate = function () {
        return uiRepository.getListLayoutTemplate();
    };

    let getDefaultListLayout = function (entityType) {

        // console.trace();
        return new Promise (function (resolve, reject) {

            uiRepository.getDefaultListLayoutLight(entityType).then(function (data) {
                console.log("layout caching getDefaultListLayoutLight data", data);
                if (data.results && data.results.length) {

                    let defaultLayoutLight = data.results[0];
                    let cachedLayout = localStorageService.getCachedLayout(defaultLayoutLight.id);
                    console.log("layout caching cachedLayout ", cachedLayout);
                    if (cachedLayout) {

                        let defLayoutModDate = new Date(defaultLayoutLight.modified).getTime();
                        let cachedLayoutModDate = new Date(cachedLayout.modified).getTime();
                        console.log("layout caching defaultLayout cachedLayoutModDate", cachedLayoutModDate);
                        console.log("layout caching defaultLayout defLayoutModDate", defLayoutModDate, defLayoutModDate > cachedLayoutModDate);
                        if (!defaultLayoutLight.modified || defLayoutModDate > cachedLayoutModDate) {

                            uiRepository.getDefaultListLayout(entityType).then(function (defaultLayoutData) {

                                let defaultLayout = defaultLayoutData.results[0];
                                console.log("layout caching defaultLayout defaultLayout", defaultLayout);
                                localStorageService.cacheLayout(defaultLayout);
                                resolve(defaultLayoutData);

                            });

                        } else {
                            resolve({results: [cachedLayout]});
                        }

                    } else {
                        console.log("layout caching defaultLayout no cacheLayout");
                        uiRepository.getDefaultListLayout(entityType).then(function (defaultLayoutData) {

                            let defaultLayout = defaultLayoutData.results[0];
                            console.log("layout caching defaultLayout defaultLayout", defaultLayout);
                            localStorageService.cacheLayout(defaultLayout);
                            resolve(defaultLayoutData);

                        });

                    }

                }

            }).catch(function (error) {
                reject(error);
            });

        })

        // return uiRepository.getDefaultListLayout(entityType);
    };

    /*let getActiveListLayout = function (entity) {
        return uiRepository.getActiveListLayout(entity);
    };*/

    let getDefaultListLayoutLight = function (entityType) {
        return uiRepository.getDefaultListLayoutLight(entityType);
    };

    let getDefaultEditLayout = function (entityType) {
        return uiRepository.getDefaultEditLayout(entityType);
    };

    let getConfigurationList = function () {
        return uiRepository.getConfigurationList();
    };

    let createConfiguration = function (data) {
        return uiRepository.createConfiguration(data)
    };

    let updateConfiguration = function (id, data) {
        return uiRepository.updateConfiguration(id, data);
    };

    let deleteConfigurationByKey = function (id) {
        return uiRepository.deleteConfigurationByKey(id);
    };


    let getTransactionFieldList = function (options) {
        return uiRepository.getTransactionFieldList(options)
    };

    let createTransactionField = function (data) {
        return uiRepository.createTransactionField(data);
    };

    let updateTransactionField = function (id, data) {
        return uiRepository.updateTransactionField(id, data);
    };

    let getInstrumentFieldList = function () {
        return uiRepository.getInstrumentFieldList()
    };

    let createInstrumentField = function (data) {
        return uiRepository.createInstrumentField(data);
    };

    let updateInstrumentField = function (id, data) {
        return uiRepository.updateInstrumentField(id, data);
    };

    // Dashboard Layout

    let getDashboardLayoutList = function (options) {
        return uiRepository.getDashboardLayoutList(options);
    };

    let getActiveDashboardLayout = function () {
        return uiRepository.getActiveDashboardLayout()
    };

    let getDefaultDashboardLayout = function () {
        return uiRepository.getDefaultDashboardLayout()
    };

    let getDashboardLayoutByKey = function (key) {
        return uiRepository.getDashboardLayoutByKey(key);
    };

    let createDashboardLayout = function (data) {

        return uiRepository.createDashboardLayout(data);
    };

    let updateDashboardLayout = function (id, data) {
        return uiRepository.updateDashboardLayout(id, data)
    };

    let deleteDashboardLayoutByKey = function (id) {
        return uiRepository.deleteDashboardLayoutByKey(id);
    };

    // Template Layout

    let getTemplateLayoutList = function (options) {
        return uiRepository.getTemplateLayoutList(options);
    };

    let getDefaultTemplateLayout = function () {
        return uiRepository.getDefaultTemplateLayout()
    };

    let getTemplateLayoutByKey = function (key) {
        return uiRepository.getTemplateLayoutByKey(key);
    };

    let createTemplateLayout = function (data) {

        return uiRepository.createTemplateLayout(data);
    };

    let updateTemplateLayout = function (id, data) {
        return uiRepository.updateTemplateLayout(id, data)
    };

    let deleteTemplateLayoutByKey = function (id) {
        return uiRepository.deleteTemplateLayoutByKey(id);
    };

    // Context Menu

    let getContextMenuLayoutList = function (options) {
        return uiRepository.getContextMenuLayoutList(options);
    };

    let getContextMenuLayoutByKey = function (key) {
        return uiRepository.getContextMenuLayoutByKey(key);
    };

    let createContextMenuLayout = function (data) {

        return uiRepository.createContextMenuLayout(data);
    };

    let updateContextMenuLayout = function (id, data) {
        return uiRepository.updateContextMenuLayout(id, data)
    };

    let deleteContextMenuLayoutByKey = function (id) {
        return uiRepository.deleteContextMenuLayoutByKey(id);
    };

    // Entity Tooltip

    let getEntityTooltipList = function (options) {
        return uiRepository.getEntityTooltipList(options);
    };

    let createEntityTooltip = function (data) {
        return uiRepository.createEntityTooltip(data);
    };

    let updateEntityTooltip = function (id, data) {

        return uiRepository.updateEntityTooltip(id, data);
    };

    module.exports = {

        getPortalInterfaceAccess: getPortalInterfaceAccess,

        getListLayoutTemplate: getListLayoutTemplate,
        getDefaultListLayout: getDefaultListLayout,
        // getActiveListLayout: getActiveListLayout,
        getDefaultEditLayout: getDefaultEditLayout,
        getEditLayout: getEditLayout,
        createEditLayout: createEditLayout,
        updateEditLayout: updateEditLayout,
        getListLayout: getListLayout,
        getListLayoutDefault: getListLayoutDefault,
        getListLayoutByKey: getListLayoutByKey,
        createListLayout: createListLayout,
        updateListLayout: updateListLayout,

        deleteListLayoutByKey: deleteListLayoutByKey,
        getDefaultListLayoutLight: getDefaultListLayoutLight,

        getConfigurationList: getConfigurationList,
        createConfiguration: createConfiguration,
        updateConfiguration: updateConfiguration,
        deleteConfigurationByKey: deleteConfigurationByKey,


        getTransactionFieldList: getTransactionFieldList,
        createTransactionField: createTransactionField,
        updateTransactionField: updateTransactionField,


        getInstrumentFieldList: getInstrumentFieldList,
        createInstrumentField: createInstrumentField,
        updateInstrumentField: updateInstrumentField,


        getDashboardLayoutList: getDashboardLayoutList,
        getDashboardLayoutByKey: getDashboardLayoutByKey,
        getActiveDashboardLayout: getActiveDashboardLayout,
        getDefaultDashboardLayout: getDefaultDashboardLayout,
        createDashboardLayout: createDashboardLayout,
        updateDashboardLayout: updateDashboardLayout,
        deleteDashboardLayoutByKey: deleteDashboardLayoutByKey,


        getTemplateLayoutList: getTemplateLayoutList,
        getTemplateLayoutByKey: getTemplateLayoutByKey,
        getDefaultTemplateLayout: getDefaultTemplateLayout,
        createTemplateLayout: createTemplateLayout,
        updateTemplateLayout: updateTemplateLayout,
        deleteTemplateLayoutByKey: deleteTemplateLayoutByKey,


        getContextMenuLayoutList: getContextMenuLayoutList,
        getContextMenuLayoutByKey: getContextMenuLayoutByKey,
        createContextMenuLayout: createContextMenuLayout,
        updateContextMenuLayout: updateContextMenuLayout,
        deleteContextMenuLayoutByKey: deleteContextMenuLayoutByKey,


        getEntityTooltipList: getEntityTooltipList,
        createEntityTooltip: createEntityTooltip,
        updateEntityTooltip: updateEntityTooltip


    }

}());