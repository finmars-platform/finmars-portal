(function () {

    'use strict';

    var objectRender = require('./object.renderer');
    var subtotalRender = require('./subtotal.renderer');
    var blanlineRender = require('./blankline.renderer');
    var evEvents = require('../../services/entityViewerEvents');
    const localStorageService = require('../../../../../core/services/localStorageService');

    var render = function (elem, projection, evDataService, evEventService) {

        // console.log('render.projection.length', projection.length);

        console.time("Generating projection as HTML");

        var columns = evDataService.getColumns();
        var groups = evDataService.getGroups();

        var nextItem;
        var previousItem;
        var item;

        var rows = [];

        const viewType = evDataService.getViewType();
        const entityType = evDataService.getEntityType();
        const markedReportRows = localStorageService.getMarkedRows(viewType, entityType);


        for (var i = 0; i < projection.length; i = i + 1) {

            item = projection[i];

            if (item.___type === 'placeholder_group' || item.___type === 'placeholder_object') {
                rows.push('<div class="placeholder-row"></div>')
            }

            if (item.___type === 'blankline') {
                rows.push(blanlineRender.render(evDataService, item))
            }

            if (item.___type === 'object') {
                rows.push(objectRender.render(evDataService, item, markedReportRows));
            }

            if (item.___type === 'subtotal' && item.___subtotal_type !== 'proxyline') {
                rows.push(subtotalRender.render(evDataService, item));
            }

        }

        console.timeEnd("Generating projection as HTML");

        console.time("Rendering projection");

        if (!rows.length) {
            elem.innerHTML = "<div class='no-data-block'>No data available.</div>"
        } else {
            elem.innerHTML = rows.join('');
        }

        console.timeEnd("Rendering projection");

        evEventService.dispatchEvent(evEvents.UPDATE_COLUMNS_SIZE);

    };

    module.exports = {
        render: render
    }


}());