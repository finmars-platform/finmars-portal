(function () {

    'use strict';

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
                content_type: layout.content_type,
                content: []
            };

            layoutObj.content = getLinkingToFilters(layout);

            result.push(layoutObj);

        });

        return result;

    };

    module.exports = {
        getLinkingToFilters: getLinkingToFilters,
        getDataForLayoutSelectorWithFilters: getDataForLayoutSelectorWithFilters
    }

}());