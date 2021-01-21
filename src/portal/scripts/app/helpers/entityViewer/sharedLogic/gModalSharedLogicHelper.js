(function () {

    'use strict';


    module.exports = function (viewModel, $scope, $mdDialog) {
        const vm = viewModel;

        let groups, columns, filters;

        // format data for SELECTED tab
        // Victor 2020.11.30 This block transferred from gModalReportComponent to use in gModalReportTransactionComponent and gModalReportPnlComponent (DRY)
        var selectedGroups = [];
        var selectedColumns = [];
        var selectedFilters = [];

        var updateSelectedAttr = function (attr, selectedAttrs) {

            const existingAttrIndex = selectedAttrs.findIndex(selAttr => attr.key === selAttr.key);

            if (existingAttrIndex < 0) {
                selectedAttrs.push(attr);
            } else {
                selectedAttrs[existingAttrIndex] = attr
            }

        };

        var separateSelectedAttrs = function (attributes, attrsVmKey) {

            for (var i = 0; i < attributes.length; i++) {

                var attribute = JSON.parse(angular.toJson(attributes[i]));
                attribute['attrsVmKey'] = attrsVmKey;

                if (attribute.groups) {
                    updateSelectedAttr(attribute, selectedGroups);
                }

                if (attribute.columns) {
                    updateSelectedAttr(attribute, selectedColumns);
                }

                if (attribute.filters) {
                    updateSelectedAttr(attribute, selectedFilters);
                }

            }

        };

        var isAttrInsideOfAnotherGroup = function (attrKey, groupType) {

            const areasGroups = {groups, columns, filters};
            const anotherGroups = Object.keys(areasGroups).filter(group => group !== groupType);

            return anotherGroups.some(key => {

                    return areasGroups[key].find(attr => attr.key === attrKey);

            });

/*            let group1, group2;

            switch (groupType) {
                case 'groups':
                    group1 = columns;
                    group2 = filters;
                    break;

                case 'columns':
                    group1 = groups;
                    group2 = filters;
                    break;

                case 'filters':
                    group1 = groups;
                    group2 = columns;
                    break;
            }

            let attrIndex = group1.findIndex(attr => {return attr.key === attrKey});

            if (attrIndex < 0) {
                attrIndex = group2.findIndex(attr => {return attr.key === attrKey});
            }

            return attrIndex > -1;*/

        }

        var organizeSelectedAttrs = function (insideTable, selectedAttrs, groupType) { // putting selected attributes in the same order as in the table

            // All items from insideTable starts the array in Order by insideTable, other items from selectedAttrs adds to end of array
            let selectedAttrsObj = {};
            let inactiveAttrs = [];

            selectedAttrs.forEach((attr) => {

                if (attr[groupType]) {
                    selectedAttrsObj[attr.key] = attr

                } else if (!isAttrInsideOfAnotherGroup(attr.key, groupType)) {

                    inactiveAttrs.push(attr);

                }

            });

            let orderedAttrs = insideTable.map(function (attr) {

                return selectedAttrsObj[attr.key];

            });

            orderedAttrs = orderedAttrs.concat(inactiveAttrs);

            return orderedAttrs;

        };

        var getSelectedAttrs = function (attributes, attrGroups) {
            groups = attrGroups.groups;
            columns = attrGroups.columns;
            filters = attrGroups.filters;

            // Victor 2020.11.30 #66 If user uncheck item, it doesn't disappear from view constructor
            selectedGroups = vm.selectedGroups;
            selectedColumns = vm.selectedColumns;
            selectedFilters = vm.selectedFilters;

            attributes.forEach(attribute => separateSelectedAttrs(vm[attribute], attribute))

            // Order selected as they are inside the table
            vm.selectedGroups = organizeSelectedAttrs(groups, selectedGroups, 'groups');
            vm.selectedColumns = organizeSelectedAttrs(columns, selectedColumns, 'columns');
            vm.selectedFilters = organizeSelectedAttrs(filters, selectedFilters, 'filters');

        };
        // < format data for SELECTED tab >
        return {
            getSelectedAttrs: getSelectedAttrs
        }
    }
}());