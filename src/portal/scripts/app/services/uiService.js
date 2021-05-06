/**
 * Created by szhitenev on 16.06.2016.
 */
(function () {

    'use strict';

	const metaContentTypesService = require('./metaContentTypesService');
	const localStorageService = require('../../../../core/services/localStorageService');

	const uiRepository = require('../repositories/uiRepository');

	const isCachedLayoutActual = function (cachedLayout, layoutData) {

        if (cachedLayout && cachedLayout.modified) {

            let cachedLayoutModDate = new Date(cachedLayout.modified).getTime();
            let layoutModDate = new Date(layoutData.modified).getTime();

            if (cachedLayoutModDate >= layoutModDate) {
                return true;
            }

        }

        return false;

    };

	const getPortalInterfaceAccess = function () {
        return uiRepository.getPortalInterfaceAccess();
    };

    // If there is actual layout in cache, resolve it. Otherwise resolve layout from server.
	const resolveLayoutByKey = function (cachedLayoutResponse, fetchLayoutFn, resolve, reject, onRejectFn) {

        let cachedLayout;

        if (!cachedLayoutResponse || cachedLayoutResponse.hasOwnProperty('id')) {
            cachedLayout = cachedLayoutResponse;

        } else { // default layout returns inside results
            cachedLayout = cachedLayoutResponse.results[0];
        }

		let onErrorResponse;

        if (onRejectFn) {
			onErrorResponse = onRejectFn;

        } else {
			onErrorResponse = (error) => reject(error);
		}

        if (cachedLayout) {

            uiRepository.pingListLayoutByKey(cachedLayout.id).then(function (pingData) {

                if (isCachedLayoutActual(cachedLayout, pingData)) {
                    resolve(cachedLayoutResponse);

                } else {
                    fetchLayoutFn();
                }

            }).catch(onErrorResponse);

        } else {
            fetchLayoutFn();
        }

    };

	const getListLayout = function (entityType, options) {

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

	const getListLayoutLight = function (options) {
        return uiRepository.getListLayoutLight(options);
    };

    /* let getListLayoutDefault = function (options) {
        return uiRepository.getListLayoutDefault(options);
    }; */

	const getListLayoutByKey = function (key) {

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

	const createListLayout = function (entity, ui) {

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

	const updateListLayout = function (id, ui) {

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

	const deleteListLayoutByKey = function (id) {

    	return new Promise(function (resolve, reject) {

    		uiRepository.deleteListLayoutByKey(id).then(function (data) {

    			localStorageService.deleteLayoutFromCache(id);
    			resolve(data);

			}).catch(function (error) {
				reject(error);
			});

		});

    };

	const getListLayoutTemplate = function () {
        return uiRepository.getListLayoutTemplate();
    };

	const getDefaultListLayout = function (entityType) {

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

            resolveLayoutByKey(cachedLayoutRes, fetchDefaultLayout, resolve, reject, fetchDefaultLayout);

        });

        // return uiRepository.getDefaultListLayout(entityType);
    };

    /*let getActiveListLayout = function (entity) {
        return uiRepository.getActiveListLayout(entity);
    };*/

    // Input Form Layouts

    const getListEditLayout = function (entityType, options) {

        // get content_type by entityType when getting layout by user_code
        if (options && options.filters && options.filters.user_code && entityType) {
            options.filters.content_type = metaContentTypesService.findContentTypeByEntity(entityType, 'ui');
        }

        if (options && options.filters &&
            options.filters.content_type && options.filters.user_code) { // if getting one layout by user_code

            return new Promise (function (resolve, reject) {

                uiRepository.getListEditLayout(entityType, options).then(function (listLayoutData) {

                    resolve(listLayoutData);

                }).catch(function (error) {
                    reject(error);
                });


            });

        }

        return uiRepository.getListEditLayout(entityType, options);

    };

	const getDefaultEditLayout = function (entityType) {

		return new Promise((resolve, reject) => {

			uiRepository.getDefaultEditLayout(entityType).then(defaultLayoutData => {

				if (defaultLayoutData.results.length) {
					resolve(defaultLayoutData);

				} else {

					uiRepository.getListEditLayout(entityType).then(layoutsList => {

						const resolveObj = {results: []};

						if (layoutsList.results.length) {

							let defaultLayout = layoutsList.results.find(layout => layout.is_default);

							if (!defaultLayout) {
								defaultLayout = layoutsList.results[0];
								defaultLayout.is_default = true;
							}

							resolveObj.results.push(defaultLayout);

						}


						resolve(resolveObj)

					}).catch(error => reject(error));

				}

			}).catch(error => reject(error));

		});

		// return uiRepository.getDefaultEditLayout(entityType);
	};

    let getEditLayoutByKey = function (id) {
        return uiRepository.getEditLayoutByKey(id);
    };

	let getEditLayoutByUserCode = function (entityType, userCode) {
		return uiRepository.getEditLayoutByUserCode(entityType, userCode);
	};

    const createEditLayout = function (entity, ui) {

        ui.content_type = metaContentTypesService.findContentTypeByEntity(entity, 'ui');

        return uiRepository.createEditLayout(ui);
    };

	const updateEditLayout = function (id, ui) {
        return uiRepository.updateEditLayout(id, ui);
    };

	const deleteEditLayoutByKey = function (id) {

        return new Promise(function (resolve, reject) {

            uiRepository.deleteEditLayoutByKey(id).then(function (data) {

                resolve(data);

            }).catch(function (error) {
                reject(error);
            });

        });

    };



    // Configuration Layouts

	const getConfigurationList = function () {
        return uiRepository.getConfigurationList();
    };

	const createConfiguration = function (data) {
        return uiRepository.createConfiguration(data)
    };

	const updateConfiguration = function (id, data) {
        return uiRepository.updateConfiguration(id, data);
    };

	const deleteConfigurationByKey = function (id) {
        return uiRepository.deleteConfigurationByKey(id);
    };


	const getTransactionFieldList = function (options) {
        return uiRepository.getTransactionFieldList(options)
    };

	const createTransactionField = function (data) {
        return uiRepository.createTransactionField(data);
    };

	const updateTransactionField = function (id, data) {
        return uiRepository.updateTransactionField(id, data);
    };

	const getInstrumentFieldList = function () {
        return uiRepository.getInstrumentFieldList()
    };

	const createInstrumentField = function (data) {
        return uiRepository.createInstrumentField(data);
    };

	const updateInstrumentField = function (id, data) {
        return uiRepository.updateInstrumentField(id, data);
    };

    // Dashboard Layout

	const getDashboardLayoutList = function (options) {
        return uiRepository.getDashboardLayoutList(options);
    };

	const getActiveDashboardLayout = function () {
        return uiRepository.getActiveDashboardLayout()
    };

	const getDefaultDashboardLayout = function () {
        return uiRepository.getDefaultDashboardLayout()
    };

	const getDashboardLayoutByKey = function (key) {
        return uiRepository.getDashboardLayoutByKey(key);
    };

	const createDashboardLayout = function (data) {

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

	const deleteDashboardLayoutByKey = function (id) {
        return uiRepository.deleteDashboardLayoutByKey(id);
    };

    // Template Layout

	const getTemplateLayoutList = function (options) {
        return uiRepository.getTemplateLayoutList(options);
    };

	const getDefaultTemplateLayout = function () {
        return uiRepository.getDefaultTemplateLayout()
    };

	const getTemplateLayoutByKey = function (key) {
        return uiRepository.getTemplateLayoutByKey(key);
    };

	const createTemplateLayout = function (data) {

        return uiRepository.createTemplateLayout(data);
    };

	const updateTemplateLayout = function (id, data) {
        return uiRepository.updateTemplateLayout(id, data)
    };

	const deleteTemplateLayoutByKey = function (id) {
        return uiRepository.deleteTemplateLayoutByKey(id);
    };

    // Context Menu

	const getContextMenuLayoutList = function (options) {
        return uiRepository.getContextMenuLayoutList(options);
    };

	const getContextMenuLayoutByKey = function (key) {
        return uiRepository.getContextMenuLayoutByKey(key);
    };

	const createContextMenuLayout = function (data) {

        return uiRepository.createContextMenuLayout(data);
    };

	const updateContextMenuLayout = function (id, data) {
        return uiRepository.updateContextMenuLayout(id, data)
    };

	const deleteContextMenuLayoutByKey = function (id) {
        return uiRepository.deleteContextMenuLayoutByKey(id);
    };

    // Entity Tooltip

	const getEntityTooltipList = function (options) {
        return uiRepository.getEntityTooltipList(options);
    };

	const createEntityTooltip = function (data) {
        return uiRepository.createEntityTooltip(data);
    };

	const updateEntityTooltip = function (id, data) {
        return uiRepository.updateEntityTooltip(id, data);
    };

    // Cross Entity Attribute Extension

	const getCrossEntityAttributeExtensionList = function (options) {

        return uiRepository.getCrossEntityAttributeExtensionList( options);
    };

	const getCrossEntityAttributeExtension = function (id) {
        return uiRepository.getCrossEntityAttributeExtension(id);
    };

	const createCrossEntityAttributeExtension = function (item) {

        return uiRepository.createCrossEntityAttributeExtension(item);
    };

	const updateCrossEntityAttributeExtension = function (id, item) {
        return uiRepository.updateCrossEntityAttributeExtension(id, item);
    };

	const deleteCrossEntityAttributeExtension = function (id) {

        return new Promise(function (resolve, reject) {

            uiRepository.deleteCrossEntityAttributeExtension(id).then(function (data) {

                resolve(data);

            }).catch(function (error) {
                reject(error);
            });

        });

    };

    // Column Sort Data

	const getColumnSortDataList = function (options) {

        return uiRepository.getColumnSortDataList( options);
    };

	const getColumnSortData = function (id) {
        return uiRepository.getColumnSortData(id);
    };

	const createColumnSortData = function (item) {

        return uiRepository.createColumnSortData(item);
    };

	const updateColumnSortData = function (id, item) {
        return uiRepository.updateColumnSortData(id, item);
    };

	const deleteColumnSortData = function (id) {

        return new Promise(function (resolve, reject) {

            uiRepository.deleteColumnSortData(id).then(function (data) {

                resolve(data);

            }).catch(function (error) {
                reject(error);
            });

        });

    };

    module.exports = {

        getPortalInterfaceAccess: getPortalInterfaceAccess,

        getListLayoutTemplate: getListLayoutTemplate,
        getDefaultListLayout: getDefaultListLayout,
        // getActiveListLayout: getActiveListLayout,

        getListLayout: getListLayout,
        getListLayoutLight: getListLayoutLight,
        // getListLayoutDefault: getListLayoutDefault,
        getListLayoutByKey: getListLayoutByKey,
        createListLayout: createListLayout,
        updateListLayout: updateListLayout,

        deleteListLayoutByKey: deleteListLayoutByKey,

        // Input Form Layouts

        getListEditLayout: getListEditLayout,
        getDefaultEditLayout: getDefaultEditLayout,
        getEditLayoutByKey: getEditLayoutByKey,
		getEditLayoutByUserCode: getEditLayoutByUserCode,
        createEditLayout: createEditLayout,
        updateEditLayout: updateEditLayout,

        deleteEditLayoutByKey: deleteEditLayoutByKey,

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
        updateEntityTooltip: updateEntityTooltip,

        getCrossEntityAttributeExtensionList: getCrossEntityAttributeExtensionList,
        getCrossEntityAttributeExtension: getCrossEntityAttributeExtension,
        createCrossEntityAttributeExtension: createCrossEntityAttributeExtension,
        updateCrossEntityAttributeExtension: updateCrossEntityAttributeExtension,
        deleteCrossEntityAttributeExtension: deleteCrossEntityAttributeExtension,

        getColumnSortDataList: getColumnSortDataList,
        getColumnSortData: getColumnSortData,
        createColumnSortData: createColumnSortData,
        updateColumnSortData: updateColumnSortData,
        deleteColumnSortData: deleteColumnSortData,


    }

}());