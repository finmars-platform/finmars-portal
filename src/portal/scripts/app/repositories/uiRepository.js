/**
 * Created by szhitenev on 16.06.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var xhrService = require('../../../../core/services/xhrService');
    var metaContentTypesService = require('../services/metaContentTypesService');
    var metaRestrictionsRepository = require('./metaRestrictionsRepository');
    var baseUrlService = require('../services/baseUrlService');

    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');

    var baseUrl = baseUrlService.resolve();

    var getRequestParams = {
        method: 'GET',
            credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        }
    };

    var getRequestParams2 = {
        method: 'GET',
        credentials: 'include',
        headers: {
            'X-CSRFToken': cookieService.getCookie('csrftoken'),
            Accept: 'application/json',
            'Content-type': 'application/json'
        }
    };

    var getPortalInterfaceAccess = function (uiLayoutId) {
        return xhrService.fetch(baseUrl + 'ui/portal-interface-access/',
            getRequestParams2)
    };

    var getListLayout = function (entity, options) {

        /* if (entity == 'all') {

            return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'ui/list-layout/', options),
                getRequestParams)

        } else {

            if (!options) {
                options = {}
            }

            if (!options.content_type) {
                options.content_type = metaContentTypesService.findContentTypeByEntity(entity, 'ui');
            }

            return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'ui/list-layout/', options),
                getRequestParams);
        } */

        if (!options) {
            options = {}
        }

        if (entity !== 'all') {

            if (!options.filters) {
                options.filters = {}
            }

            if (!options.filters.content_type) {
                options.filters.content_type = metaContentTypesService.findContentTypeByEntity(entity, 'ui');
            }

            return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'ui/list-layout/', options),
                getRequestParams);

        }

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'ui/list-layout/', options),
            getRequestParams);

    };

    var getListLayoutLight = function (entity, options) {

        if (!options) {
            options = {}
        }

        if (entity !== 'all') {

            if (!options.filters) {
                options.filters = {}
            }

            if (!options.filters.content_type) {
                options.filters.content_type = metaContentTypesService.findContentTypeByEntity(entity, 'ui');
            }

            return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'ui/list-layout-light/', options),
                getRequestParams);

        }

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'ui/list-layout-light/', options),
            getRequestParams);

    };

    var getListLayoutByKey = function (uiLayoutId) {
        return xhrService.fetch(baseUrl + 'ui/list-layout/' + uiLayoutId + '/',
            getRequestParams2);
    };

    /* var getListLayoutDefault = function (options) {
        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'ui/list-layout/', options),
            getRequestParams);
    }; */

    /* var getActiveListLayout = function (entity) {

        var contentType = metaContentTypesService.findContentTypeByEntity(entity, 'ui');

        return xhrService.fetch(baseUrl + 'ui/list-layout/?is_active=2&content_type=' + contentType,
            getRequestParams2)
    }; */

    var getDefaultListLayout = function (entityType) {

        var contentType = metaContentTypesService.findContentTypeByEntity(entityType, 'ui');

        return xhrService.fetch(baseUrl + 'ui/list-layout/?is_default=2&content_type=' + contentType,
            getRequestParams2)
    };

    var createListLayout = function (ui) {

        return xhrService.fetch(baseUrl + 'ui/list-layout/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(ui)
            })
    };

    var updateListLayout = function (id, ui) {
        return xhrService.fetch(baseUrl + 'ui/list-layout/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(ui)
            })
    };

    var deleteListLayoutByKey = function (id) {
        return new Promise(function (resolve, reject) {
            xhrService.fetch(baseUrl + 'ui/list-layout/' + id + '/',
                {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'X-CSRFToken': cookieService.getCookie('csrftoken'),
                        Accept: 'application/json',
                        'Content-type': 'application/json'
                    }
                }).then(function (data) {
                resolve(undefined);
            })
        })
    };

    var pingListLayoutByKey = function (layoutId) {
        return xhrService.fetch(baseUrl + 'ui/list-layout/' + layoutId + '/ping/',
            getRequestParams2)
    };

    var getListLayoutTemplate = function () {
        return [{
            "name": "default",
            "data": {
                "entityType": null,
                "folding": false,
                "sorting": {
                    "group": {
                        "id": null,
                        "sort": "DESC",
                        "key": null
                    },
                    "column": {
                        "id": null,
                        "sort": "ASC",
                        "key": null
                    }
                },
                "grouping": [],
                "columns": [],
                "filters": [],
                "additions": {}
            }
        }]
    };

    // Input Form Layout

    var getListEditLayout = function (entity, options) {

        console.log('getListEditLayout.entity', entity)

        if (!options) {
            options = {}
        }

        if (entity !== 'all') {

            if (!options.filters) {
                options.filters = {}
            }

            if (!options.filters.content_type) {
                options.filters.content_type = metaContentTypesService.findContentTypeByEntity(entity, 'ui');
            }

            return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'ui/edit-layout/', options),
                getRequestParams);

        }

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'ui/edit-layout/', options),
            getRequestParams);

    };

    var getDefaultEditLayout = function (entityType) {

        var contentType = metaContentTypesService.findContentTypeByEntity(entityType, 'ui');

        return xhrService.fetch(baseUrl + 'ui/edit-layout/?is_default=2&content_type=' + contentType,
            getRequestParams2)
    };

    var getEditLayout = function (id) {

        return xhrService.fetch(baseUrl + 'ui/edit-layout/' + id + '/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var createEditLayout = function (ui) {

        return xhrService.fetch(baseUrl + 'ui/edit-layout/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(ui)
            })
    };

    var updateEditLayout = function (id, ui) {
        return xhrService.fetch(baseUrl + 'ui/edit-layout/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(ui)
            })
    };

    var deleteEditLayoutByKey = function (id) {
        return new Promise(function (resolve, reject) {
            xhrService.fetch(baseUrl + 'ui/edit-layout/' + id + '/',
                {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'X-CSRFToken': cookieService.getCookie('csrftoken'),
                        Accept: 'application/json',
                        'Content-type': 'application/json'
                    }
                }).then(function (data) {
                resolve(undefined);
            })
        })
    };


    // Configuration Layout

    var getConfigurationList = function () {

        return xhrService.fetch(baseUrl + 'ui/configuration/',
            getRequestParams)
    };

    var createConfiguration = function (data) {

        return xhrService.fetch(baseUrl + 'ui/configuration/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var updateConfiguration = function (id, data) {
        return xhrService.fetch(baseUrl + 'ui/configuration/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var deleteConfigurationByKey = function (id) {
        return new Promise(function (resolve, reject) {
            xhrService.fetch(baseUrl + 'ui/configuration/' + id + '/',
                {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'X-CSRFToken': cookieService.getCookie('csrftoken'),
                        Accept: 'application/json',
                        'Content-type': 'application/json'
                    }
                }).then(function (data) {
                resolve(undefined);
            })
        })
    };

    var getConfigurationExportLayoutList = function () {

        return xhrService.fetch(baseUrl + 'ui/configuration-export-layout/',
            getRequestParams)
    };

    var createConfigurationExportLayout = function (data) {

        return xhrService.fetch(baseUrl + 'ui/configuration-export-layout/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var updateConfigurationExportLayout = function (id, data) {
        return xhrService.fetch(baseUrl + 'ui/configuration-export-layout/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var deleteConfigurationExportLayoutByKey = function (id) {
        return new Promise(function (resolve, reject) {
            xhrService.fetch(baseUrl + 'ui/configuration-export-layout/' + id + '/',
                {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'X-CSRFToken': cookieService.getCookie('csrftoken'),
                        Accept: 'application/json',
                        'Content-type': 'application/json'
                    }
                }).then(function (data) {
                resolve(undefined);
            })
        })
    };

    var getTransactionFieldList = function (options) {

        console.log('options', options);

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'ui/transaction-user-field/', options),
            getRequestParams)

    };

    var createTransactionField = function (data) {

        return xhrService.fetch(baseUrl + 'ui/transaction-user-field/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var updateTransactionField = function (id, data) {
        return xhrService.fetch(baseUrl + 'ui/transaction-user-field/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var getInstrumentFieldList = function (options) {

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'ui/instrument-user-field/', options),
            getRequestParams)

    };

    var createInstrumentField = function (data) {

        return xhrService.fetch(baseUrl + 'ui/instrument-user-field/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var updateInstrumentField = function (id, data) {
        return xhrService.fetch(baseUrl + 'ui/instrument-user-field/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var getDashboardLayoutList = function (entity, options) {

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'ui/dashboard-layout/', options),
            getRequestParams)
    };

    var getDashboardLayoutByKey = function (id) {
        return xhrService.fetch(baseUrl + 'ui/dashboard-layout/' + id + '/',
            getRequestParams2)
    };

    var getActiveDashboardLayout = function () {

        return xhrService.fetch(baseUrl + 'ui/dashboard-layout/?is_active=2',
            getRequestParams2)
    };

    var getDefaultDashboardLayout = function () {

        return xhrService.fetch(baseUrl + 'ui/dashboard-layout/?is_default=2',
            getRequestParams2)
    };

    var createDashboardLayout = function (data) {

        return xhrService.fetch(baseUrl + 'ui/dashboard-layout/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var updateDashboardLayout = function (id, data) {
        return xhrService.fetch(baseUrl + 'ui/dashboard-layout/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var deleteDashboardLayoutByKey = function (id) {
        return new Promise(function (resolve, reject) {
            xhrService.fetch(baseUrl + 'ui/dashboard-layout/' + id + '/',
                {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'X-CSRFToken': cookieService.getCookie('csrftoken'),
                        Accept: 'application/json',
                        'Content-type': 'application/json'
                    }
                }).then(function (data) {
                resolve(undefined);
            })
        })
    };


    var getTemplateLayoutList = function (options) {

        console.log('options', options);

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'ui/template-layout/', options),
            getRequestParams)
    };

    var getTemplateLayoutByKey = function (id) {
        return xhrService.fetch(baseUrl + 'ui/template-layout/' + id + '/',
            getRequestParams2)
    };

    var getDefaultTemplateLayout = function () {

        return xhrService.fetch(baseUrl + 'ui/template-layout/?is_default=2',
            getRequestParams2)
    };

    var createTemplateLayout = function (data) {

        return xhrService.fetch(baseUrl + 'ui/template-layout/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var updateTemplateLayout = function (id, data) {
        return xhrService.fetch(baseUrl + 'ui/template-layout/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var deleteTemplateLayoutByKey = function (id) {
        return new Promise(function (resolve, reject) {
            xhrService.fetch(baseUrl + 'ui/template-layout/' + id + '/',
                {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'X-CSRFToken': cookieService.getCookie('csrftoken'),
                        Accept: 'application/json',
                        'Content-type': 'application/json'
                    }
                }).then(function (data) {
                resolve(undefined);
            })
        })
    };

    var getContextMenuLayoutList = function (options) {

        console.log('options', options);

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'ui/context-menu-layout/', options),
            getRequestParams)
    };

    var getContextMenuLayoutByKey = function (id) {
        return xhrService.fetch(baseUrl + 'ui/context-menu-layout/' + id + '/',
            getRequestParams2)
    };

    var createContextMenuLayout = function (data) {

        return xhrService.fetch(baseUrl + 'ui/context-menu-layout/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var updateContextMenuLayout = function (id, data) {
        return xhrService.fetch(baseUrl + 'ui/context-menu-layout/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var deleteContextMenuLayoutByKey = function (id) {
        return new Promise(function (resolve, reject) {
            xhrService.fetch(baseUrl + 'ui/context-menu-layout/' + id + '/',
                {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'X-CSRFToken': cookieService.getCookie('csrftoken'),
                        Accept: 'application/json',
                        'Content-type': 'application/json'
                    }
                }).then(function (data) {
                resolve(undefined);
            })
        })
    };


    var getEntityTooltipList = function (options) {

        console.log('options', options);

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'ui/entity-tooltip/', options),
            getRequestParams)
    };

    var createEntityTooltip = function (data) {

        return xhrService.fetch(baseUrl + 'ui/entity-tooltip/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var updateEntityTooltip = function (id, data) {
        return xhrService.fetch(baseUrl + 'ui/entity-tooltip/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    // Cross Entity Attribute Extension

    var getCrossEntityAttributeExtensionList = function (options) {

        console.log('options', options);

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'ui/cross-entity-attribute-extension/', options),
            getRequestParams)
    };

    var getCrossEntityAttributeExtension = function (id) {
        return xhrService.fetch(baseUrl + 'ui/cross-entity-attribute-extension/' + id + '/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var createCrossEntityAttributeExtension = function (data) {

        return xhrService.fetch(baseUrl + 'ui/cross-entity-attribute-extension/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var updateCrossEntityAttributeExtension = function (id, data) {
        return xhrService.fetch(baseUrl + 'ui/cross-entity-attribute-extension/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var deleteCrossEntityAttributeExtension = function (id) {
        return new Promise(function (resolve, reject) {
            xhrService.fetch(baseUrl + 'ui/cross-entity-attribute-extension/' + id + '/',
                {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'X-CSRFToken': cookieService.getCookie('csrftoken'),
                        Accept: 'application/json',
                        'Content-type': 'application/json'
                    }
                }).then(function (data) {
                resolve(undefined);
            })
        })
    };


    module.exports = {

        getPortalInterfaceAccess: getPortalInterfaceAccess,


        getDefaultListLayout: getDefaultListLayout,

        // getActiveListLayout: getActiveListLayout,

        getListLayoutTemplate: getListLayoutTemplate,

        getListLayout: getListLayout,
        getListLayoutLight: getListLayoutLight,
        getListLayoutByKey: getListLayoutByKey,
        // getListLayoutDefault: getListLayoutDefault,
        createListLayout: createListLayout,
        updateListLayout: updateListLayout,
        deleteListLayoutByKey: deleteListLayoutByKey,

        pingListLayoutByKey: pingListLayoutByKey,

        // Input Form Layout

        getListEditLayout: getListEditLayout,
        getDefaultEditLayout: getDefaultEditLayout,
        getEditLayout: getEditLayout,
        createEditLayout: createEditLayout,
        updateEditLayout: updateEditLayout,
        deleteEditLayoutByKey: deleteEditLayoutByKey,

        // Configuration Layout

        getConfigurationList: getConfigurationList,
        createConfiguration: createConfiguration,
        updateConfiguration: updateConfiguration,
        deleteConfigurationByKey: deleteConfigurationByKey,

        getConfigurationExportLayoutList: getConfigurationExportLayoutList,
        createConfigurationExportLayout: createConfigurationExportLayout,
        updateConfigurationExportLayout: updateConfigurationExportLayout,
        deleteConfigurationExportLayoutByKey: deleteConfigurationExportLayoutByKey,

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



    }

}());