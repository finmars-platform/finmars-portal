(function () {

    'use strict';

    var groupRender = require('./group.renderer');
    var objectRender = require('./object.renderer');
    var controlRender = require('./control.renderer');
    var placeholderRender = require('./placeholder.renderer');
    var evEvents = require('../../services/entityViewerEvents');

    var render = function (elem, projection, evDataService, evEventService) {

        // console.log('render.projection.length', projection.length);
        console.log('render.projection', projection);

        console.time("Rendering projection");

        var columns = evDataService.getColumns();

        var previousRow = null;

        var rows = projection.map(function (item, index) {

            var renderedRow = null;

            switch (item.___type) {
                case 'placeholder_group':
                case 'placeholder_object':
                    renderedRow = placeholderRender.render(item, columns);
                    break;
                case 'group':
                    renderedRow = groupRender.render(item);
                    break;
                case 'object':
                    renderedRow = objectRender.render(item, columns);
                    break;
                case 'control':
                    renderedRow = controlRender.render(item, evDataService, previousRow);
                    break;
            };

            if (renderedRow) {
                previousRow = renderedRow;

                return renderedRow;
            };

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