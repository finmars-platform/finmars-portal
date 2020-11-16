(function () {

    'use strict';

	var uiService = require('../services/uiService');

	var toastNotificationService = require('../../../../core/services/toastNotificationService');

    let componentsForLinking = [
        'report_viewer', 'report_viewer_split_panel', 'report_viewer_matrix',
        'report_viewer_bars_chart', 'report_viewer_pie_chart', 'report_viewer_grand_total'
    ];

    let getLinkingToFilters = function (layout) {

    	var linkingToFilters = [];

        layout.data.filters.forEach(function (filter) {

            if (filter.options.use_from_above) {

                if (typeof filter.options.use_from_above === 'object') {

                    if (Object.keys(filter.options.use_from_above).length) {

                        var filterObj = {
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

                    var filterObj = {
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

        var result = [];

        layouts.forEach(function (layout) {

            var layoutObj = {
                id: layout.id,
                name: layout.name,
                content: []
            };

            layoutObj.content = getLinkingToFilters(layout);

            result.push(layoutObj);

        });

        return result;

    };

    let getComponentsForLinking = function () {
        return componentsForLinking;
    };

    let saveComponentSettingsFromDashboard = function (dashboardDataService, componentData) {

		var listLayout = dashboardDataService.getListLayout();

		if (listLayout) {

			var layoutData = listLayout.data;

			for (var i = 0; i < layoutData.components_types.length; i++) {

				if (layoutData.components_types[i].id === componentData.id) {

					layoutData.components_types[i] = JSON.parse(JSON.stringify(componentData));
					dashboardDataService.setListLayout(listLayout);

					uiService.updateDashboardLayout(listLayout.id, listLayout).then(function (data) {

						listLayout.modified = data.modified
						dashboardDataService.setListLayout(listLayout);

						toastNotificationService.success('Dashboard component settings saved.');

					}).catch(function () {
						dashboardDataService.setListLayout(listLayout);
					});

					break;

				}

			}

		}

	};

    module.exports = {
        getLinkingToFilters: getLinkingToFilters,
        getDataForLayoutSelectorWithFilters: getDataForLayoutSelectorWithFilters,
        getComponentsForLinking: getComponentsForLinking,

		saveComponentSettingsFromDashboard: saveComponentSettingsFromDashboard
    };

}());