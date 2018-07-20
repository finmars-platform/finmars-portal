/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');
    var evRenderer = require('../../services/ev-renderer/ev.renderer');
    var evDomManager = require('../../services/ev-dom-manager/ev-dom.manager');
    var evDataHelper = require('../../helpers/ev-data.helper');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'AE',
            scope: {
                evDataService: '=',
                evEventService: '='
            },
            template: '<div>' +
            '<div class="ev-viewport">' +
            '<div class="ev-content"></div>' +
            '</div>' +
            '</div>',
            link: function (scope, elem) {

                var viewportElem = elem[0].querySelector('.ev-viewport');
                var contentElem = elem[0].querySelector('.ev-content');

                var elements = {
                    viewportElem: viewportElem,
                    contentElem: contentElem
                };

                var projection;

                scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                    var flatList = evDataHelper.getFlatStructure(scope.evDataService);
                    flatList.shift(); // remove root group

                    scope.evDataService.setFlatList(flatList);

                    projection = evDataHelper.calculateProjection(flatList, scope.evDataService);

                    evDomManager.calculateScroll(elements, scope.evDataService);

                    console.log('projection', projection);

                    evRenderer.render(contentElem, projection, scope.evDataService, scope.evEventService);

                });

                scope.evEventService.addEventListener(evEvents.REDRAW_TABLE, function () {

                    var flatList = evDataHelper.getFlatStructure(scope.evDataService);
                    flatList.shift(); // remove root group

                    scope.evDataService.setFlatList(flatList);

                    projection = evDataHelper.calculateProjection(flatList, scope.evDataService);

                    console.log('projection', projection);

                    evDomManager.calculateScroll(elements, scope.evDataService);

                    evRenderer.render(contentElem, projection, scope.evDataService, scope.evEventService);

                });

                evDomManager.initEventDelegation(contentElem, scope.evDataService, scope.evEventService);
                evDomManager.initContextMenuEventDelegation(contentElem, scope.evDataService, scope.evEventService);

                evDomManager.addScrollListener(elements, scope.evDataService, scope.evEventService);

            }
        }
    }


}());