(function () {

    'use strict';

    var objectRender = require('./object.renderer');
    var subtotalRender = require('./subtotal.renderer');
    var blanlineRender = require('./blankline.renderer');

    // var localStorageService = require('../../../../../shell/scripts/app/services/localStorageService');

    var evEvents = require('../../services/entityViewerEvents');

    var render = function (elem, projection, globalDataService, evDataService, evEventService) {

        console.time("Generating projection as HTML");

        /* var columns = evDataService.getColumns();
        var groups = evDataService.getGroups();

        var nextItem;
        var previousItem; */
        var item;

        var rows = [];

        const entityType = evDataService.getEntityType();
        // const markedReportRows = localStorageService.getMarkedRows(true, entityType);
		const rvSettings = globalDataService.getMemberEntityViewersSettings(true, entityType);
		const markedReportRows = rvSettings.marked_rows;
		// console.log("testing.render markedReportRows", markedReportRows);
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

        console.log("Rendering " + rows.length + ' rows');
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