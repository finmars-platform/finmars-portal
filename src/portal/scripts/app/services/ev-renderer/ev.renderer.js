(function () {

    'use strict';

    // var groupRender = require('./group.renderer');
    var objectRender = require('./object.renderer');
    var controlRender = require('./control.renderer');
    var placeholderRender = require('./placeholder.renderer');

	var localStorageService = require('../../../../../shell/scripts/app/services/localStorageService');

    var evEvents = require('../../services/entityViewerEvents');

    var render = function (elem, projection, globalDataService, evDataService, evEventService) {

        // console.log('render.projection.length', projection.length);
        console.log('render.projection', projection);

        console.time("Rendering projection");

        var columns = evDataService.getColumns();
        var groups = evDataService.getGroups();
        var currentMember = evDataService.getCurrentMember();

        // var previousRow = null;
		var previousItem = null;

        var verticalAdditions = evDataService.getVerticalAdditions();
        var viewContext = evDataService.getViewContext();

        var entityType = evDataService.getEntityType();
		// var markedRows = localStorageService.getMarkedRows(false, entityType);
		const evSettings = globalDataService.getMemberEntityViewersSettings(false, entityType);
		const markedRows = evSettings.marked_rows;

        var columnsWidthSum = 0;
		columns.forEach(function (column) {

			if (column.style && column.style.width) {
				columnsWidthSum += parseFloat(column.style.width);
			}

		});

        var rows = projection.map(function (item, index) {

            var renderedRow = null;

            switch (item.___type) {
                case 'placeholder_group':
                case 'placeholder_object':
                    renderedRow = placeholderRender.render(evDataService, item, columns);
                    break;
                // case 'group':
                //     renderedRow = groupRender.render(evDataService, item, groups);
                //     break;
                case 'object':
                    renderedRow = objectRender.render(evDataService, item, columns, currentMember, viewContext, verticalAdditions, markedRows);
                    break;
                case 'control':
                    renderedRow = controlRender.render(evDataService, item, previousItem, columnsWidthSum);
                    break;
            }

            if (renderedRow) {
                // previousRow = renderedRow;
				previousItem = item;

                return renderedRow;
            }

            /*if (item.___type === 'placeholder_group' || item.___type === 'placeholder_object') {
                return placeholderRender.render(item, columns)
            }

            if (item.___type === 'group') {

                return groupRender.render(item);

            }

            if (item.___type === 'object') {

                return objectRender.render(item, columns);
            }

            if (item.___type === 'control') {

                return controlRender.render(item, evDataService);
            }*/

        });

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