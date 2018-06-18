/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');
    var evRenderer = require('../../services/ev-renderer/ev.renderer');
    var evDomManager = require('../../services/ev-dom-manager/ev-dom.manager');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'AE',
            scope: {
                evDataService: '=',
                evEventService: '='
            },
            template: '<div><div class="ev-scroll-top"></div>' +
            '<div class="ev-viewport">' +
            '<div class="ev-content"></div>' +
            '</div>' +
            '<div class="ev-scroll-bottom"></div>' +
            '</div>',
            link: function (scope, elem, attrs) {

                var vm = this;

                vm.groups = scope.evDataService.getGroups();
                vm.columns = scope.evDataService.getColumns();


                var viewportElem = elem[0].querySelector('.ev-viewport');
                var contentElem = elem[0].querySelector('.ev-content');
                var scrollTopElem = elem[0].querySelector('.ev-scroll-top');
                var scrollBottomElem = elem[0].querySelector('.ev-scroll-bottom');

                scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                    vm.data = scope.evDataService.getData();

                    console.log('vm.data', vm.data);
                    console.log('evRenderer', evRenderer);

                    evDomManager.calculateScroll(viewportElem, scrollTopElem, scrollBottomElem, scope.evDataService);
                    evRenderer.render(contentElem, vm.data.results);

                });

                evDomManager.initEventDelegation(contentElem, scope.evDataService, scope.evEventService);
                evDomManager.calculateScroll(viewportElem, scrollTopElem, scrollBottomElem, scope.evDataService);

            }
        }
    }


}());