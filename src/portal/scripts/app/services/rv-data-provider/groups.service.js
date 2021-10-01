/**
 * Report Viewer Data Provider Groups Service.
 * @module ReportViewerDataProviderGroupsService
 */

(function () {

    var filterService = require('./filter.service');
    var sortService = require('./sort.service');

    /**
     * Check if group already exists
     * @param {object} resultGroup - group for a check.
     * @param {object[]} result - groups that already exists
     * @return {boolean} return true if group exists
     * @memberof module:ReportViewerDataProviderGroupsService
     */
    function groupAlreadyExist(resultGroup, result) {

        var exist = false;

        result.forEach(function (item) {

            if (item.___group_identifier === resultGroup.___group_identifier) {
                exist = true;
            }

        });


        return exist;
    }

    var convertNameKeyToUserCodeKey = function (key) {

        var result = key

        var pieces = key.split('.');

        var last_key;
        if (pieces.length > 1) {
            last_key = pieces.pop()
        } else {
            last_key = pieces[0]
        }

        if (['short_name', 'name', 'public_name'].indexOf(last_key) !== -1) {

            pieces.push('user_code')

            result = pieces.join('.')

        }


        return result

    }

    /**
     * Get list of unique groups
     * @param {object[]} items - collection of items
     * @param {object} group - group type on which grouping is based
     * @return {object[]} return list of unique groups
     * @memberof module:ReportViewerDataProviderGroupsService
     */
    var getUniqueGroups = function (items, group) {

        var result = [];

        var resultGroup;

        items.forEach(function (item) {

            resultGroup = {
                ___group_name: null,
                ___group_identifier: null
            };

            var item_value = item[group.key];
            var identifier_value = item[group.key];
            var identifier_key = null;

            identifier_key = convertNameKeyToUserCodeKey(group.key)
            identifier_value = item[identifier_key];

            if (identifier_value !== null && identifier_value !== undefined && identifier_value !== '-') {

                resultGroup.___group_identifier = identifier_value.toString();
                resultGroup.___group_name = item_value.toString();

            }

            // console.log('resultGroup', resultGroup);

            if (!groupAlreadyExist(resultGroup, result)) {

                result.push(resultGroup)
            }

        });

        return result;

    };


    /**
     * Get list of groups
     * @param {string} entityType - string value of entity name (e.g. instrument-type)
     * @param {object} options - set of specific options
     * @param {object} entityViewerDataService - global data service
     * @return {boolean} return list of groups
     * @memberof module:ReportViewerDataProviderGroupsService
     */
    var getList = function (entityType, options, entityViewerDataService) {

        return new Promise(function (resolve, reject) {

            var result = {
                next: null,
                previous: null,
                count: 0,
                results: []
            };

            var regularFilters = filterService.getRegularFilters(options);

            var reportOptions = entityViewerDataService.getReportOptions();

            var groups = [];

            if (reportOptions.hasOwnProperty("items") && reportOptions.items.length > 0) {

                var items = reportOptions.items.concat();

                var groupTypes = entityViewerDataService.getGroups();

                items = filterService.filterTableRows(items, regularFilters);
                items = filterService.filterByGroupsFilters(items, options, groupTypes);

                // Victor 2021.02.08 filter by rows colors removed to rv-data.helper.js

                /*				const rowTypeFilters = entityViewerDataService.getRowTypeFilters();

                                if (rowTypeFilters) {

                                    items = filterService.filterByRowType(items, rowTypeFilters.markedRowFilters);

                                }*/

                var group = options.groups_types[options.groups_types.length - 1];

                var groups = getUniqueGroups(items, group);

                const groupSortProperty = options.groups_order === 'desc' ? '-___group_name' : '___group_name';

                if (options.ordering_mode === 'manual') {

                    const {key} = entityViewerDataService.getActiveGroupTypeSort();

                    const columnSortData = entityViewerDataService.getColumnSortData(key)

                    if (columnSortData) {
                        groups = sortService.sortItemsManual(groups, groupSortProperty, columnSortData);
                    }

                } else {

                    groups = sortService.sortItems(groups, groupSortProperty);

                }

                /*                if (options.groups_order === 'desc') {
                                    groups = sortService.sortItems(groups, '-___group_name');
                                } else {
                                    groups = sortService.sortItems(groups, '___group_name');
                                }*/

                result.count = groups.length;
                result.results = groups;

            } else {
                result.count = 0;
                result.results = [];
            }


            // console.log('get groups', JSON.parse(JSON.stringify(result)));

            resolve(result)

        });

    };

    module.exports = {
        getList: getList
    }

}());
