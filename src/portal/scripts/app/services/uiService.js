/**
 * Created by szhitenev on 16.06.2016.
 */
(function () {

    'use strict';

    let metaContentTypesService = require('./metaContentTypesService');
    let localStorageService = require('../../../../core/services/localStorageService');

    let uiRepository = require('../repositories/uiRepository');

    let isCachedLayoutActual = function (cachedLayout, layoutData) {

        if (cachedLayout && cachedLayout.modified) {

            let cachedLayoutModDate = new Date(cachedLayout.modified).getTime();
            let layoutModDate = new Date(layoutData.modified).getTime();

            if (cachedLayoutModDate >= layoutModDate) {
                return true;
            }

        }

        return false;

    };

    let getPortalInterfaceAccess = function () {
        return uiRepository.getPortalInterfaceAccess();
    };

    // If there is actual layout in cache, resolve it. Otherwise resolve layout from server.
    let resolveLayoutByKey = function (cachedLayoutResponse, fetchLayoutFn, resolve, reject) {

        let cachedLayout;

        if (!cachedLayoutResponse || cachedLayoutResponse.hasOwnProperty('id')) {
            cachedLayout = cachedLayoutResponse;

        } else { // default layout returns inside results
            cachedLayout = cachedLayoutResponse.results[0];
        }

        if (cachedLayout) {

            uiRepository.pingListLayoutByKey(cachedLayout.id).then(function (pingData) {

                if (isCachedLayoutActual(cachedLayout, pingData)) {
                    resolve(cachedLayoutResponse);

                } else {
                    fetchLayoutFn();
                }

            }).catch(function (error) {
                reject(error);
            });

        } else {
            fetchLayoutFn();
        }

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

    let getListLayout = function (entityType, options) {

        // get content_type by entityType when getting layout by user_code
        if (options && options.filters && options.filters.user_code && entityType) {
            options.filters.content_type = metaContentTypesService.findContentTypeByEntity(entityType, 'ui');
        }

        if (options && options.filters &&
            options.filters.content_type && options.filters.user_code) { // if getting one layout by user_code

            return new Promise (function (resolve, reject) {

                uiRepository.getListLayoutLight(entityType, options).then(function (data) {

                    let lightLayout = data.results[0];

                    if (lightLayout) {

                        let cachedLayout = localStorageService.getCachedLayout(lightLayout.id);

                        if (isCachedLayoutActual(cachedLayout, lightLayout)) {
                            resolve({results: [cachedLayout]});

                        } else {

                            uiRepository.getListLayout(entityType, options).then(function (listLayoutData) {

                                let listLayout = listLayoutData.results[0];

                                localStorageService.cacheLayout(listLayout);
                                resolve(listLayoutData);

                            }).catch(function (error) {
                                reject(error);
                            });

                        }

                    } else {
                        resolve(data);
                    }

                }).catch(function (error) {
                    reject(error);
                });

            });

        }

        return uiRepository.getListLayout(entityType, options);

    };

    let getListLayoutLight = function (options) {
        return uiRepository.getListLayoutLight(options);
    };

    /* let getListLayoutDefault = function (options) {
        return uiRepository.getListLayoutDefault(options);
    }; */

    let getListLayoutByKey = function (key) {

        return new Promise (function (resolve, reject) {

            let cachedLayout = localStorageService.getCachedLayout(key);

            let fetchDefaultLayout = function () {

                uiRepository.getListLayoutByKey(key).then(function (layoutData) {

                    if (layoutData && layoutData.id) {
                        localStorageService.cacheLayout(layoutData);
                    }

                    resolve(layoutData);

                }).catch(function (error) {
                    reject(error);
                });

            };

            resolveLayoutByKey(cachedLayout, fetchDefaultLayout, resolve, reject);

        });

        // return uiRepository.getListLayoutByKey(key);
    };

    let createListLayout = function (entity, ui) {

        ui.content_type = metaContentTypesService.findContentTypeByEntity(entity, 'ui');

        return new Promise(function (resolve, reject) {

        	uiRepository.createListLayout(ui).then(function (data) {

				if (data.is_default) {
					localStorageService.cacheDefaultLayout(data);
				}

			}).catch(function (error) {
				reject(error);
			});

		});

    };

    let updateListLayout = function (id, ui) {

    	return new Promise(function (resolve, reject) {

			uiRepository.updateListLayout(id, ui).then(function (data) {

				ui.modified = data.modified

				if (ui.is_default) {
					localStorageService.cacheDefaultLayout(ui);

				} else {
					localStorageService.cacheLayout(ui);
				}

				resolve(ui);

			}).catch(function (error) {
				reject(error);
			});

		});

    };

    let deleteListLayoutByKey = function (id) {

    	return new Promise(function (resolve, reject) {

    		uiRepository.deleteListLayoutByKey(id).then(function (data) {

    			localStorageService.deleteLayoutFromCache(id);
    			resolve(data);

			}).catch(function (error) {
				reject(error);
			});

		});

    };

    let getListLayoutTemplate = function () {
        return uiRepository.getListLayoutTemplate();
    };

    let getDefaultListLayout = function (entityType) {

        // console.trace();
        return new Promise (function (resolve, reject) {

            var contentType = metaContentTypesService.findContentTypeByEntity(entityType, 'ui');
            let cachedLayout = localStorageService.getDefaultLayout(contentType);
            let cachedLayoutRes = {results: [cachedLayout]};

            let fetchDefaultLayout = function () {

                uiRepository.getDefaultListLayout(entityType).then(function (defaultLayoutData) {

                    let defaultLayout = defaultLayoutData.results[0];

                    if (defaultLayout) {
                        localStorageService.cacheDefaultLayout(defaultLayout);

                    } else {

                    	defaultLayout = uiRepository.getListLayoutTemplate();
                        defaultLayoutData = {results: defaultLayout};

                    }

                    resolve(defaultLayoutData);

                }).catch(function (error) {
                    reject(error);
                });

            };

            resolveLayoutByKey(cachedLayoutRes, fetchDefaultLayout, resolve, reject);

        });

        // return uiRepository.getDefaultListLayout(entityType);
    };

    /*let getActiveListLayout = function (entity) {
        return uiRepository.getActiveListLayout(entity);
    };*/

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

    var updateDashboardLayout = function (id, data) {

    	return new Promise(function (resolve, reject) {

    		uiRepository.updateDashboardLayout(id, data).then(function (updatedLayoutData) {

    			data.modified = updatedLayoutData.modified // prevents synchronization error

				resolve(updatedLayoutData);

    		}).catch(function (error) {
    			reject(error);
			});

		});

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
        getListLayoutLight: getListLayoutLight,
        // getListLayoutDefault: getListLayoutDefault,
        getListLayoutByKey: getListLayoutByKey,
        createListLayout: createListLayout,
        updateListLayout: updateListLayout,

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