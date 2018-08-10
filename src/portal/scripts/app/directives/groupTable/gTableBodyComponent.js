/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');
    var evRenderer = require('../../services/ev-renderer/ev.renderer');
    var rvRenderer = require('../../services/rv-renderer/rv.renderer');
    var evDomManager = require('../../services/ev-dom-manager/ev-dom.manager');
    var rvDomManager = require('../../services/rv-dom-manager/rv-dom.manager');
    var evDataHelper = require('../../helpers/ev-data.helper');
    var rvDataHelper = require('../../helpers/rv-data.helper');

    var metaService = require('../../services/metaService')

    module.exports = function ($mdDialog) {
        return {
            restrict: 'AE',
            scope: {
                evDataService: '=',
                evEventService: '='
            },
            template: '<div>' +
            '<div class="ev-progressbar-holder" layout="row" layout-sm="column">\n' +
            '            <md-progress-linear class="ev-progressbar"  md-mode="indeterminate"></md-progress-linear>\n' +
            '        </div>' +
            '<div class="ev-viewport">' +
            '<div class="ev-content"></div>' +
            '</div>' +
            '</div>',
            link: function (scope, elem) {

                var viewportElem = elem[0].querySelector('.ev-viewport');
                var contentElem = elem[0].querySelector('.ev-content');
                var progressBar = elem[0].querySelector('.ev-progressbar');

                var elements = {
                    viewportElem: viewportElem,
                    contentElem: contentElem
                };

                var projection;
                var entityType = scope.evDataService.getEntityType();

                var isReport = metaService.isReport(entityType);

                function renderReportViewer() {

                    console.log('renderReportViewer');

                    var flatList = rvDataHelper.getFlatStructure(scope.evDataService);
                    flatList.shift(); // remove root group

                    flatList = flatList.filter(function (item) {
                        return item.___type !== 'group';
                    });

                    scope.evDataService.setFlatList(flatList);

                    projection = evDataHelper.calculateProjection(flatList, scope.evDataService);

                    console.log('projection', projection);

                    evDomManager.calculateScroll(elements, scope.evDataService);

                    rvRenderer.render(contentElem, projection, scope.evDataService, scope.evEventService);


                }

                function renderEntityViewer() {

                    console.log('renderEntityViewer');

                    var flatList = evDataHelper.getFlatStructure(scope.evDataService);
                    flatList.shift(); // remove root group

                    scope.evDataService.setFlatList(flatList);

                    projection = evDataHelper.calculateProjection(flatList, scope.evDataService);

                    evDomManager.calculateScroll(elements, scope.evDataService);

                    console.log('projection', projection);

                    evRenderer.render(contentElem, projection, scope.evDataService, scope.evEventService);

                }

                function updateTableContent() {
                    if (isReport) {
                        renderReportViewer();
                    } else {
                        renderEntityViewer();
                    }
                }

                scope.evEventService.addEventListener(evEvents.UPDATE_PROJECTION, function () {

                    var flatList = scope.evDataService.getFlatList();

                    projection = evDataHelper.calculateProjection(flatList, scope.evDataService);
                    evDomManager.calculateScroll(elements, scope.evDataService);

                    rvRenderer.render(contentElem, projection, scope.evDataService, scope.evEventService);

                });

                scope.evEventService.addEventListener(evEvents.DATA_LOAD_START, function () {

                    progressBar.style.display = 'block';

                });

                scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                    progressBar.style.display = 'none';

                    updateTableContent();

                });

                scope.evEventService.addEventListener(evEvents.REDRAW_TABLE, function () {

                    updateTableContent();

                });

                evDomManager.initEventDelegation(contentElem, scope.evDataService, scope.evEventService);
                evDomManager.initContextMenuEventDelegation(contentElem, scope.evDataService, scope.evEventService);

                if (isReport) {
                    rvDomManager.addScrollListener(elements, scope.evDataService, scope.evEventService);
                } else {
                    evDomManager.addScrollListener(elements, scope.evDataService, scope.evEventService);
                }

            }
        }
    }


}());