/**
 * Created by szhitenev on 16.06.2016.
 */
(function () {

    'use strict';

    const metaService = require('./metaService');
	const metaContentTypesService = require('./metaContentTypesService');
	const localStorageService = require('../../../../shell/scripts/app/services/localStorageService');
    const ecosystemDefaultService = require('./ecosystemDefaultService');

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

	const getCachedLayoutObj = (cacheResponse) => {
		if (!cacheResponse || cacheResponse.hasOwnProperty('id')) {
			return cacheResponse;

		} else { // default layout returns inside results
			return cacheResponse.results[0];
		}
	};

	const getOnRejectCallback = (onRejectCallback, reject, cachedLayout) => {

		if (onRejectCallback) {

			return function (error) {

				let errorMessage = "Layout ping error";
				if (cachedLayout) errorMessage = "Id of layout to ping: " + cachedLayout.id;

				console.error(errorMessage, error);
				onRejectCallback();

			}

		} else {

			return function (error) {
				if (cachedLayout) error.___custom_message = "id of layout to get: " + cachedLayout.id;
				reject(error);
			};

		}

	}

	/**
	 * If there is actual layout in cache, return it. Otherwise resolve layout from server
	 *
	 * @param cachedLayoutResponse {*} - data about particular layout inside local storage
	 * @param fetchLayoutFn {Function} - get layout, in case there is not one in local storage
	 * @param resolve {Function} - resolve function of parent promise
	 * @param reject {Function} - reject function of parent promise
	 * @param onRejectFn {Function} - execute on layout ping reject
	 */
	const resolveLayoutByKey = function (cachedLayoutResponse, fetchLayoutFn, resolve, reject, onRejectFn) {

        const cachedLayout = getCachedLayoutObj(cachedLayoutResponse);
		const onErrorResponse = getOnRejectCallback(onRejectFn, reject, cachedLayout);

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

	const getListLayoutByKey = key => {

        return new Promise (function (resolve, reject) {

            const cachedLayout = localStorageService.getCachedLayout(key);

            const fetchLayout = function () {

                uiRepository.getListLayoutByKey(key).then(function (layoutData) {

                    if (layoutData && layoutData.id) {
                        localStorageService.cacheLayout(layoutData);
                    }

                    resolve(layoutData);

                }).catch(function (error) {
                    reject(error);
                });

            };

            resolveLayoutByKey(cachedLayout, fetchLayout, resolve, reject);

        });

        // return uiRepository.getListLayoutByKey(key);
    };

	/**
	 *
	 * @memberOf module:uiService
	 * @param entityType {string}
	 * @param userCode {string} - user code of layout
	 * @returns {Promise<any>}
	 */
	const getListLayoutByUserCode = (entityType, userCode) => {

		const contentType = metaContentTypesService.findContentTypeByEntity(entityType, 'ui');

		return getListLayout(
			null,
			{
				pageSize: 1000,
				filters: {
					content_type: contentType,
					user_code: userCode
				}
			}
		);

	}

	const createListLayout = function (entity, ui) {

        ui.content_type = metaContentTypesService.findContentTypeByEntity(entity, 'ui');

        return new Promise(function (resolve, reject) {

        	uiRepository.createListLayout(ui).then(function (data) {

				if (data.is_default) {
					localStorageService.cacheDefaultLayout(data);
				}

				resolve(data);

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
	/**
	 *
	 * @param id {number} - layout id
	 * @param xhrOptions {=Object}
	 * @returns {Promise<Object>}
	 */
	const pingListLayoutByKey = (id, xhrOptions) => {
		return uiRepository.pingListLayoutByKey(id, xhrOptions);
	}

	const getListLayoutTemplate = function (isReport) {
        return uiRepository.getListLayoutTemplate(isReport);
    };

	/**
	 * If there is actual default layout in cache, return it. Otherwise fetch layout from server.
	 *
	 * @param cachedLayoutResponse {*} - data about particular layout inside local storage
	 * @param fetchLayoutCallback {Function} - callback to fetch layout from server if default layout in local storage does not fit
	 * @param resolve - resolve function of parent promise
	 * @param reject - reject function of parent promise
	 */
	const resolveDefaultListLayout = function (cachedLayoutResponse, fetchLayoutCallback, resolve, reject) {

		const cachedLayout = getCachedLayoutObj(cachedLayoutResponse);
		const onPingRejectCallback = getOnRejectCallback(fetchLayoutCallback, reject, cachedLayout);

		if (cachedLayout) {

			uiRepository.pingListLayoutByKey(cachedLayout.id).then(function (pingData) {

				if (pingData && pingData.is_default && isCachedLayoutActual(cachedLayout, pingData)) {
					resolve(cachedLayoutResponse);

				} else {
					fetchLayoutCallback();
				}

			}).catch(onPingRejectCallback);

		} else {
			fetchLayoutCallback();
		}

	};


	const applyDefaultSettingsToLayoutTemplate = async function (layoutTemplate) {
        const ecosystemDefaultData = await ecosystemDefaultService.getList().then (res => res.results[0]);

	    const reportOptions = {
            "account_mode": 1,
            "calculationGroup": "portfolio",
            "cost_method": 1,
            "report_date" : new Date().toISOString().slice(0, 10),
            "portfolio_mode": 1,
            "strategy1_mode": 0,
            "strategy2_mode": 0,
            "strategy3_mode": 0,
            "table_font_size": "small",
            "pricing_policy": ecosystemDefaultData.pricing_policy,
        };

	    layoutTemplate[0].data.reportOptions = reportOptions;

	    return layoutTemplate;
    }

	const getDefaultListLayout = function (entityType) {

        return new Promise (function (resolve, reject) {

            const contentType = metaContentTypesService.findContentTypeByEntity(entityType, 'ui');
            const cachedLayout = localStorageService.getDefaultLayout(contentType);
            const cachedLayoutRes = {results: [cachedLayout]};

			/*uiRepository.pingListLayoutByKey(cachedLayout.id).then(function (pingData) {

				if (isCachedLayoutActual(cachedLayout, pingData) && pingData.isDefault) {

				}

			});*/
			const fetchDefaultListLayout = function () {

				uiRepository.getDefaultListLayout(entityType).then(async function (defaultLayoutData) {

					let defaultLayout = defaultLayoutData.results[0];

					if (defaultLayout) {
						localStorageService.cacheDefaultLayout(defaultLayout);

					} else {

						const isReport = metaService.isReport(entityType);

						defaultLayout = uiRepository.getListLayoutTemplate(isReport);
						defaultLayout = await applyDefaultSettingsToLayoutTemplate(defaultLayout);
						defaultLayoutData = {results: defaultLayout};

					}

					resolve(defaultLayoutData);

				}).catch(error => {
					error.___custom_message = "Failed to load default layout for entity type: " + entityType;
					reject(error);
				});

			};

			resolveDefaultListLayout(cachedLayoutRes, fetchDefaultListLayout, resolve, reject);

        });

        // return uiRepository.getDefaultListLayout(entityType);
    };

	const autosaveListLayout = function (layout) {

		layout = JSON.parse(angular.toJson(layout));

		delete layout.id;

		const userCodeText = layout.content_type.replace('.', '_');
		layout.user_code = 'system_autosave_' + userCodeText;



	};

	const getAutosaveListLayout = function (entityType) {

		return new Promise (function (resolve, reject) {

			const contentType = metaContentTypesService.findContentTypeByEntity(entityType, 'ui');
			const cachedLayout = localStorageService.getDefaultLayout(contentType);



		});

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
	/** @module uiService */
    module.exports = {

        getPortalInterfaceAccess: getPortalInterfaceAccess,

        getListLayoutTemplate: getListLayoutTemplate,
        getDefaultListLayout: getDefaultListLayout,
        // getActiveListLayout: getActiveListLayout,

        getListLayout: getListLayout,
        getListLayoutLight: getListLayoutLight,
        // getListLayoutDefault: getListLayoutDefault,
        getListLayoutByKey: getListLayoutByKey,
		getListLayoutByUserCode: getListLayoutByUserCode,
        createListLayout: createListLayout,
        updateListLayout: updateListLayout,

        deleteListLayoutByKey: deleteListLayoutByKey,

		pingListLayoutByKey: pingListLayoutByKey,

		//<editor-fold desc="Input form editor layout management">
		getListEditLayout: getListEditLayout,
        getDefaultEditLayout: getDefaultEditLayout,
        getEditLayoutByKey: getEditLayoutByKey,
		getEditLayoutByUserCode: getEditLayoutByUserCode,
        createEditLayout: createEditLayout,
        updateEditLayout: updateEditLayout,

        deleteEditLayoutByKey: deleteEditLayoutByKey,
		//</editor-fold>

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