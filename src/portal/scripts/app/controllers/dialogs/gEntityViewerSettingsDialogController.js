/**
 * Created by mevstratov on 11.07.2019.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');

    module.exports = function ($scope, $mdDialog, entityViewerDataService, entityViewerEventService) {

        var vm = this;

        var pagePagination = entityViewerDataService.getPagination();
        vm.itemsToLoad = pagePagination.page_size;

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.saveSettings = function () {

            if (pagePagination.page_size !== vm.itemsToLoad) {

                pagePagination = entityViewerDataService.getPagination();
                pagePagination.page_size = vm.itemsToLoad;

                entityViewerDataService.setPagination(pagePagination);

                entityViewerEventService.dispatchEvent(evEvents.ENTITY_VIEWER_PAGINATION_CHANGED);

            }

            $mdDialog.hide({status: 'agree'});
        };

    }

}());