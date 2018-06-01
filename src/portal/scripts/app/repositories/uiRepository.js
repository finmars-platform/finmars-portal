/**
 * Created by szhitenev on 16.06.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var metaContentTypesService = require('../services/metaContentTypesService');
    var metaRestrictionsRepository = require('./metaRestrictionsRepository');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getEditLayout = function (entity) {

        var contentType = metaContentTypesService.findContentTypeByEntity(entity, 'ui');

        return window.fetch(baseUrl + 'ui/edit-layout/?content_type=' + contentType,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return data.json();
        })
    };

    var createEditLayout = function (entity, ui) {

        ui.content_type = metaContentTypesService.findContentTypeByEntity(entity, 'ui');

        return window.fetch(baseUrl + 'ui/edit-layout/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(ui)
            }).then(function (data) {
            return data.json();
        })
    };

    var updateEditLayout = function (id, ui) {
        return window.fetch(baseUrl + 'ui/edit-layout/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(ui)
            }).then(function (data) {
            return data.json();
        })
    };


    var getListLayout = function (entity) {

        if (entity == 'all') {
            return window.fetch(baseUrl + 'ui/list-layout/',
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        Accept: 'application/json',
                        'Content-type': 'application/json'
                    }
                }).then(function (data) {
                return data.json();
            })
        } else {

            var contentType = metaContentTypesService.findContentTypeByEntity(entity, 'ui');

            return window.fetch(baseUrl + 'ui/list-layout/?content_type=' + contentType,
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'X-CSRFToken': cookieService.getCookie('csrftoken'),
                        Accept: 'application/json',
                        'Content-type': 'application/json'
                    }
                }).then(function (data) {
                return data.json();
            })
        }
    };

    var getListLayoutByKey = function (uiLayoutId) {
        return window.fetch(baseUrl + 'ui/list-layout/' + uiLayoutId + '/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return data.json();
        })
    };

    var getActiveListLayout = function (entity) {

        var contentType = metaContentTypesService.findContentTypeByEntity(entity, 'ui');

        return window.fetch(baseUrl + 'ui/list-layout/?is_default=2&content_type=' + contentType,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            console.log('ui repository data', data);
            return data.json();
        })
    };

    var createListLayout = function (entity, ui) {

        ui.content_type = metaContentTypesService.findContentTypeByEntity(entity, 'ui');

        return window.fetch(baseUrl + 'ui/list-layout/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(ui)
            }).then(function (data) {
            return data.json();
        })
    };

    var updateListLayout = function (id, ui) {
        return window.fetch(baseUrl + 'ui/list-layout/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(ui)
            }).then(function (data) {
            return data.json();
        })
    };

    var deleteListLayoutByKey = function (id) {
        return new Promise(function (resolve, reject) {
            window.fetch(baseUrl + 'ui/list-layout/' + id + '/',
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
                "columnsWidth": [
                    238
                ],
                "additionsType": ""
            }
        }]
    };

    var getEditLayoutByInstanceId = function (entityType, id) {
        if (entityType == 'complex-transaction') {
            return window.fetch(baseUrl + 'transactions/transaction-type/' + id + '/',
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'X-CSRFToken': cookieService.getCookie('csrftoken'),
                        Accept: 'application/json',
                        'Content-type': 'application/json'
                    }
                }).then(function (data) {
                return data.json();
            })
        }
    };

    var updateEditLayoutByInstanceId = function (entityType, id, editLayout) {

        if (entityType == 'complex-transaction') {
            return window.fetch(baseUrl + 'transactions/transaction-type/' + id + '/',
                {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: {
                        'X-CSRFToken': cookieService.getCookie('csrftoken'),
                        Accept: 'application/json',
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(editLayout)
                }).then(function (data) {
                return data.json();
            })
        }
    };

    module.exports = {

        getDefaultEditLayout: getDefaultEditLayout,
        getDefaultListLayout: getDefaultListLayout,

        getEditLayout: getEditLayout,
        createEditLayout: createEditLayout,
        updateEditLayout: updateEditLayout,

        getListLayout: getListLayout,
        getListLayoutByKey: getListLayoutByKey,
        createListLayout: createListLayout,
        updateListLayout: updateListLayout,
        deleteListLayoutByKey: deleteListLayoutByKey,

        getEditLayoutByInstanceId: getEditLayoutByInstanceId,
        updateEditLayoutByInstanceId: updateEditLayoutByInstanceId,

        getActiveListLayout: getActiveListLayout

    }

}());