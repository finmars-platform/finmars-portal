(function () {

    'use strict';

    var utilsHelper = require('../../helpers/utils.helper');
    var evEvents = require('../../services/entityViewerEvents');


    var addScrollListener = function (elements, evDataService, evEventService) {

        var offset;
        var rowHeight = evDataService.getRowHeight();
        var viewportElem = elements.viewportElem;

        var columnBottomRow;

        var scrollYHandler = utilsHelper.debounce(function () {

            offset = Math.floor(viewportElem.scrollTop / rowHeight);
            evDataService.setVirtualScrollOffset(offset);
            evEventService.dispatchEvent(evEvents.UPDATE_PROJECTION);


        }, 50);

        var scrollXHandler = function () {

            if (!columnBottomRow) {
                columnBottomRow = document.querySelector('.g-column-bottom-row');
            }

            columnBottomRow.style.left = -viewportElem.scrollLeft + 'px';

        };

        viewportElem.addEventListener('scroll', scrollYHandler);

        viewportElem.addEventListener('scroll', scrollXHandler);

    };

    module.exports = {
        addScrollListener: addScrollListener
    }


}());