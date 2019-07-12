/**
 * Created by mevstratov on 11.07.2019.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        var entityViewerDataService = data.entityViewerDataService;

        var pagePagination = entityViewerDataService.getPagination();
        vm.itemsToLoad = pagePagination.items_per_page;

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.saveSettings = function () {
            $mdDialog.hide({status: 'agree'});
        };

    }

}());