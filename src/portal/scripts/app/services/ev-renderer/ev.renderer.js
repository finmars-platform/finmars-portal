(function () {

    'use strict';

    var groupRender = require('./group.renderer');
    var objectRender = require('./object.renderer');
    var evEvents = require('../../services/entityViewerEvents');

    var render = function (elem, projection, evDataService, evEventService) {

        console.log('render.projection.length', projection.length);

        console.time("Rendering projection");

        var columns = evDataService.getColumns();

        var rows = projection.map(function (item) {

            if (item.___type === 'group') {

                return groupRender.render(item);

            }

            if (item.___type === 'object') {

                return objectRender.render(item, columns);
            }

        });

        elem.innerHTML = rows.join('');

        console.timeEnd("Rendering projection");

        evEventService.dispatchEvent(evEvents.UPDATE_COLUMNS_SIZE);

    };

    module.exports = {
        render: render
    }


}());