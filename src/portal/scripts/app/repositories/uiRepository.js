/**
 * Created by szhitenev on 16.06.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var metaContentTypesService = require('../services/metaContentTypesService');
    var baseUrl = '/api/v1/';

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


    var getListLayout = function (entity, name) {

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

    var getDefaultEditLayout = function () {
        return [
            {
                data: [
                    {
                        "name": "General",
                        "id": 1,
                        "layout": {
                            "fields": [
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
                            ],
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
                "tableAdditions": {
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
                    "additionsType": "",
                    "entityType": null
                },
                "table": {
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
                    ]
                },
                "additionsType": ""
            }
        }]
    };

    module.exports = {

        getDefaultEditLayout: getDefaultEditLayout,
        getDefaultListLayout: getDefaultListLayout,

        getEditLayout: getEditLayout,
        createEditLayout: createEditLayout,
        updateEditLayout: updateEditLayout,

        getListLayout: getListLayout,
        updateListLayout: updateListLayout

    }

}());