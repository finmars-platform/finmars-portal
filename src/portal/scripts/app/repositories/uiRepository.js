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

    var getEditLayout = function (entity) {

        var contentType = metaContentTypesService.findContentTypeByEntity(entity, 'ui');

        return xhrService.fetch(baseUrl + 'ui/edit-layout/?content_type=' + contentType,
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

    var getListLayout = function (entity, options) {

        if (entity == 'all') {
            // return xhrService.fetch(baseUrl + 'ui/list-layout/',
            //     {
            //         method: 'GET',
            //         credentials: 'include',
            //         headers: {
            //             Accept: 'application/json',
            //             'Content-type': 'application/json'
            //         }
            //     })
            return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'ui/list-layout/', options),
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        Accept: 'application/json',
                        'Content-type': 'application/json'
                    }
                })
        } else {

            var contentType = metaContentTypesService.findContentTypeByEntity(entity, 'ui');

            return xhrService.fetch(baseUrl + 'ui/list-layout/?content_type=' + contentType,
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'X-CSRFToken': cookieService.getCookie('csrftoken'),
                        Accept: 'application/json',
                        'Content-type': 'application/json'
                    }
                })
        }
    };

    var getListLayoutDefault = function (options) {

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'ui/list-layout/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })

    };

    var getListLayoutByKey = function (uiLayoutId) {
        return xhrService.fetch(baseUrl + 'ui/list-layout/' + uiLayoutId + '/',
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

    var getActiveListLayout = function (entity) {

        var contentType = metaContentTypesService.findContentTypeByEntity(entity, 'ui');

        return xhrService.fetch(baseUrl + 'ui/list-layout/?is_default=2&content_type=' + contentType,
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

    var getDefaultEditLayout = function (entityType) {

        var fields;

        if (metaRestrictionsRepository.getEntitiesWithoutBaseAttrsList().indexOf(entityType) !== -1) {
            fields = []
        } else {
            fields = [
                {
                    "row": 1,
                    "colspan": "1",
                    "column": 1,
                    "editMode": false,
                    "id": null,
                    "name": "Name",
                    "disabled": false,
                    "options": {
                        "notNull": true
                    },
                    "attribute": {
                        "value_type": 10,
                        "name": "Name",
                        "key": "name",
                        "disabled": true
                    },
                    "type": "field",
                    "key": null
                }
            ];
        }

        return [
            {
                data: [
                    {
                        "name": "General",
                        "id": 1,
                        "layout": {
                            "fields": fields,
                            "rows": 1,
                            "columns": 1
                        }
                    }
                ]
            }
        ]
    };

    var getDefaultListLayout = function () {
        return [{
            "name": "default",
            "data": {
                "foreignEntityId": null,
                "table": {
                    "sorting": {
                        "column": {
                            "sort": null,
                            "key": null
                        }
                    },
                    "columns": [],
                    "filters": []
                },
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
                "columns": [
                    {
                        "value_type": 10,
                        "name": "Name",
                        "key": "name"
                    }
                ],
                "filters": [],
                "additionsType": ""
            }
        }]
    };

    var getEditLayoutByInstanceId = function (entityType, id) {
        if (entityType == 'complex-transaction') {
            return xhrService.fetch(baseUrl + 'transactions/transaction-type/' + id + '/',
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'X-CSRFToken': cookieService.getCookie('csrftoken'),
                        Accept: 'application/json',
                        'Content-type': 'application/json'
                    }
                })
        }
    };

    var updateEditLayoutByInstanceId = function (entityType, id, editLayout) {

        if (entityType == 'complex-transaction') {
            return xhrService.fetch(baseUrl + 'transactions/transaction-type/' + id + '/',
                {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: {
                        'X-CSRFToken': cookieService.getCookie('csrftoken'),
                        Accept: 'application/json',
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(editLayout)
                })
        }
    };

    var getConfigurationList = function () {

        return xhrService.fetch(baseUrl + 'ui/configuration/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
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
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
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

    module.exports = {

        getDefaultEditLayout: getDefaultEditLayout,
        getDefaultListLayout: getDefaultListLayout,

        getEditLayout: getEditLayout,
        createEditLayout: createEditLayout,
        updateEditLayout: updateEditLayout,

        getListLayout: getListLayout,
        getListLayoutByKey: getListLayoutByKey,
        getListLayoutDefault: getListLayoutDefault,
        createListLayout: createListLayout,
        updateListLayout: updateListLayout,
        deleteListLayoutByKey: deleteListLayoutByKey,

        getEditLayoutByInstanceId: getEditLayoutByInstanceId,
        updateEditLayoutByInstanceId: updateEditLayoutByInstanceId,

        getActiveListLayout: getActiveListLayout,

        getConfigurationList: getConfigurationList,
        createConfiguration: createConfiguration,
        updateConfiguration: updateConfiguration,
        deleteConfigurationByKey: deleteConfigurationByKey,

        getConfigurationExportLayoutList: getConfigurationExportLayoutList,
        createConfigurationExportLayout: createConfigurationExportLayout,
        updateConfigurationExportLayout: updateConfigurationExportLayout,
        deleteConfigurationExportLayoutByKey: deleteConfigurationExportLayoutByKey

    }

}());