(function () {

    'use strict';

    var componentsForLinking = [
        'report_viewer', 'report_viewer_split_panel', 'report_viewer_matrix',
        'report_viewer_bars_chart', 'report_viewer_pie_chart', 'report_viewer_grand_total'
    ];

    var getLinkingToFilters = function (layout) {
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

    var getDataForLayoutSelectorWithFilters = function (layouts) {

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

    var getComponentsForLinking = function () {
        return componentsForLinking;
    };

    module.exports = {
        getLinkingToFilters: getLinkingToFilters,
        getDataForLayoutSelectorWithFilters: getDataForLayoutSelectorWithFilters,
        getComponentsForLinking: getComponentsForLinking
    };

}());