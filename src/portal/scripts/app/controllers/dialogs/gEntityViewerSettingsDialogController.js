/**
 * Created by mevstratov on 11.07.2019.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        var entityViewerDataService = data.entityViewerDataService;

        var pagePagination = entityViewerDataService.getPagination();
        vm.itemsToLoad = pagePagination.page_size;

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.saveSettings = function () {

            pagePagination = entityViewerDataService.getPagination();
            pagePagination.page_size = vm.itemsToLoad;

            entityViewerDataService.setPagination(pagePagination);
            $mdDialog.hide({status: 'agree'});
        };

    }

}());