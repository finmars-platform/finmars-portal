(function () {

    'use strict';

    var groupRender = require('./group.renderer');
    var objectRender = require('./object.renderer');
    var subtotalRender = require('./subtotal.renderer');
    var blanlineRender = require('./blankline.renderer');
    var evEvents = require('../../services/entityViewerEvents');

    var render = function (elem, projection, evDataService, evEventService) {

        // console.log('render.projection.length', projection.length);

        console.time("Rendering projection");

        var columns = evDataService.getColumns();
        var groups = evDataService.getGroups();

        var nextItem;
        var previousItem;
        var item;

        var rows = [];

        for (var i = 0; i < projection.length; i = i + 1) {

            item = projection[i];

            if (item.___type === 'placeholder_group' || item.___type === 'placeholder_object') {
                rows.push('<div class="placeholder-row"></div>')
            }

            if (item.___type === 'group') {
                rows.push(groupRender.render(item))
            }

            if (item.___type === 'blankline') {
                rows.push(blanlineRender.render(evDataService, item))
            }

            if (item.___type === 'object') {
                rows.push(objectRender.render(evDataService, item));
            }

            if (item.___type === 'subtotal' && item.___subtotal_type !== 'proxyline') {
            // if (item.___type === 'subtotal') {
                rows.push(subtotalRender.render(evDataService, item));
            }

        }

        elem.innerHTML = rows.join('');

        console.timeEnd("Rendering projection");

        evEventService.dispatchEvent(evEvents.UPDATE_COLUMNS_SIZE);

    };

    module.exports = {
        render: render
    }


}());