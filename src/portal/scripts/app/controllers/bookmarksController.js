/**
 * Created by mevstratov on 29.01.2019.
 */
(function () {

    'use strict';

    var uiService = require('../services/uiService');
    var metaContentTypesService = require('../services/metaContentTypesService');

    module.exports = function ($scope, $state) {

        var vm = this;

        vm.entityUpdating = false;

        var entityType = metaContentTypesService.getContentTypeUIByState($state.current.name);

        vm.setLayout = function (layoutId) {
            console.log('bookmarksController layout', layoutId, vm.entityUpdating);
            if (!vm.entityUpdating) {
                vm.entityUpdating = true;

                uiService.getListLayout(entityType).then(function (data) {

                    var layouts = data.results;

                    var updateDefaultLayout = function (layoutsToUpdate) {
                        var promises = [];

                        layoutsToUpdate.forEach(function (item) {
                            promises.push(uiService.updateListLayout(item.id, item));
                        });

                        Promise.all(promises).then(function () {
                            $state.reload($state.current.game);
                            vm.entityUpdating = true;
                        });
                    };

                    layouts.forEach(function (layout, index) {
                        if (layout.id === layoutId) {
                            layout.is_default = true;
                            console.log('bookmarksController default layout', layout, layoutId);
                        }
                        else {
                            layout.is_default = false;
                        };

                        if (index === layouts.length - 1) {
                            console.log('dataPortfolioController updated layout', layouts);
                            updateDefaultLayout(layouts);
                        };

                    });

                });
            }
        };
    }
}());