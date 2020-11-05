(function () {

    'use strict';

	let uiService = require('../services/uiService');
	var toastNotificationService = require('../../../../core/services/toastNotificationService');

    let getLinkingToFilters = function (layout) {

        let linkingToFilters = [];

        layout.data.filters.forEach(function (filter) {

            if (filter.options.use_from_above) {

                if (typeof filter.options.use_from_above === 'object') {

                    if (Object.keys(filter.options.use_from_above).length) {

                        let filterObj = {
                            key: filter.options.use_from_above.key,
                            name: filter.name,
                            filter_type: filter.options.filter_type
                        };

                        if (filter.layout_name) {
                            filterObj.layout_name = filter.layout_name;
                        }

                        linkingToFilters.push(filterObj);

                    }


                } else {

                    let filterObj = {
                        key: filter.options.use_from_above,
                        name: filter.name,
                        filter_type: filter.options.filter_type
                    };

                    if (filter.layout_name) {
                        filterObj.layout_name = filter.layout_name;
                    }

                    linkingToFilters.push(filterObj);

                }

            }

        });

        return linkingToFilters;
    };

    let getDataForLayoutSelectorWithFilters = function (layouts) {

        let result = [];

        layouts.forEach(function (layout) {

            let layoutObj = {
                id: layout.id,
                name: layout.name,
                //content_type: layout.content_type,
                content: []
            };

            layoutObj.content = getLinkingToFilters(layout);

            result.push(layoutObj);

        });

        return result;

    };


    let saveLayoutList = function (entityViewerDataService, isReport) {

    	var currentLayoutConfig = entityViewerDataService.getLayoutCurrentConfiguration(isReport);

		if (currentLayoutConfig.hasOwnProperty('id')) {

			uiService.updateListLayout(currentLayoutConfig.id, currentLayoutConfig).then(function (updatedLayoutData) {

				let listLayout = entityViewerDataService.getListLayout();
				listLayout.modified = updatedLayoutData.modified

				entityViewerDataService.setActiveLayoutConfiguration({layoutConfig: currentLayoutConfig});
				entityViewerDataService.setListLayout(listLayout);

				toastNotificationService.success("Success. Page was saved.");

			});

		}

	};

    module.exports = {
        getLinkingToFilters: getLinkingToFilters,
        getDataForLayoutSelectorWithFilters: getDataForLayoutSelectorWithFilters,

		saveLayoutList: saveLayoutList
    }

}());