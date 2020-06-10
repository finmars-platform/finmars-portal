/**
 * Created by mevstratov on 11.07.2019.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');

    module.exports = function ($scope, $mdDialog, entityViewerDataService, entityViewerEventService) {

        var vm = this;

        vm.entityType = entityViewerDataService.getEntityType();

        var pagePagination = entityViewerDataService.getPagination();

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

            var entityViewerOptions = {};
            entityViewerOptions.complex_transaction_filters = vm.complexTransactionFilters;
            entityViewerOptions.entity_filters = vm.entityFilters;

            entityViewerDataService.setEntityViewerOptions(entityViewerOptions);

            $mdDialog.hide({status: 'agree'});
        };

        var init = function () {

            var entityViewerOptions = entityViewerDataService.getEntityViewerOptions();

            vm.complexTransactionFilters = entityViewerOptions.complex_transaction_filters;
            vm.entityFilters = entityViewerOptions.entity_filters;

            vm.itemsToLoad = pagePagination.page_size;

        };

        init();

    }

}());