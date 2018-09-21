(function () {

    var renderHelper = require('../../helpers/render.helper');

    var evRvCommonHelper = require('../../helpers/ev-rv-common.helper');


    var checkIcon = renderHelper.getCheckIcon();
    var REPORT_BG_CSS_SELECTOR = 'report-bg-level';

    var getDynamicAttributeValue = function (obj, column) {

        var result = '';

        if (column.id && obj.attributes) {

            obj.attributes.forEach(function (item) {

                if (item.attribute_type === column.id) {

                    if (column.value_type === 20 && item.value_float) {

                        result = item.value_float;

                    }

                    if (column.value_type === 10 && item.value_string) {

                        result = item.value_string;

                    }

                    if (column.value_type === 30 && item.classifier_object) {

                        result = item.classifier_object.name;
                    }

                    if (column.value_type === 40 && item.value_date) {

                        result = item.value_date;

                    }
                }

            });

        }

        return result;

    };


    var getEntityAttributeValue = function (obj, column) {

        var result = '';

        if (typeof obj[column.key] === 'string') {
            result = obj[column.key]
        } else {

            if (typeof obj[column.key] === 'number') {

                if (obj[column.key + '_object'] && obj[column.key + '_object'].user_code) {
                    result = obj[column.key + '_object'].user_code;
                } else {

                    result = renderHelper.formatValue(obj, column);

                }

            } else {

                if (Array.isArray(obj[column.key])) {

                    result = '[' + obj[column.key].length + ']';

                }

            }

        }

        return result;

    };

    function isColumnInGroupsList(columnNumber, groups) {

        return groups.length > columnNumber - 1;

    }

    function isColumnEqualLastGroup(columnNumber, groups) {

        return groups.length === columnNumber

    }

    function isColumnAfterGroupsList(columnNumber, groups) {

        return groups.length < columnNumber;

    }

    var getValue = function (evDataService, obj, column, columnNumber, groups) {

        var result = '';

        var areaGroupsBefore = renderHelper.getAreaGroupsBefore(evDataService, groups.length);

        if (isColumnInGroupsList(columnNumber, groups)) {

            // console.log('isColumnInGroupsList.columnNumber', columnNumber);
            // console.log('isColumnInGroupsList.areaGroupsBefore', areaGroupsBefore);

            if (areaGroupsBefore.length && areaGroupsBefore.indexOf(columnNumber) !== -1 && obj.___is_first && renderHelper.noLineGroups(evDataService)) {

                var parents = evRvCommonHelper.getParents(obj.___parentId, evDataService);

                var groups = evDataService.getGroups();

                var currentParent;
                var childOfCurrentParent;

                parents.forEach(function (parent) {

                    if (parent.___level === columnNumber) {
                        currentParent = parent
                    }

                    if (parent.___level === columnNumber + 1) {
                        childOfCurrentParent = parent;
                    }

                });

                if (childOfCurrentParent && childOfCurrentParent.___is_first && groups[columnNumber].report_settings.subtotal_type === 'area') {
                    result = currentParent.group_name
                }


            } else {

                if (columnNumber < groups.length) {
                    result = '';
                }

            }

        }

        if (isColumnEqualLastGroup(columnNumber, groups)) {

            if (groups[columnNumber - 1].report_settings.subtotal_type === 'area' && obj.___is_first) {

                var parent = evDataService.getData(obj.___parentId);

                result = parent.group_name;

            }

        }

        if (isColumnAfterGroupsList(columnNumber, groups)) {

            if (obj[column.key]) {

                result = getEntityAttributeValue(obj, column);

            } else {

                result = getDynamicAttributeValue(obj, column);

            }

        }

        return result;

    };

    var getBgColor = function (obj, columnNumber, groups) {

        var result = '';

        if (columnNumber <= groups.length && columnNumber <= obj.___level) {

            if (groups[columnNumber - 1].report_settings.subtotal_type === 'area') {

                result = REPORT_BG_CSS_SELECTOR + '-' + columnNumber;

            }
        }

        return result;

    };

    var render = function (evDataService, obj, columns, groups) {

        var classList = ['g-row'];

        var rowSelection;

        if (obj.___is_selected) {
            classList.push('selected');
            rowSelection = '<div class="g-row-selection">' + checkIcon + '</div>';
        } else {
            rowSelection = '<div class="g-row-selection"></div>';
        }

        if (obj.___is_activated) {
            classList.push('activated');
        }

        var classes = classList.join(' ');

        var result = '<div class="' + classes + '" data-type="object" data-object-id="' + obj.___id + '" data-parent-group-hash-id="' + obj.___parentId + '">';
        var cell;

        result = result + rowSelection;

        columns.forEach(function (column, index) {

            var textAlign = '';
            var colorNegative = '';

            if (column.value_type === 20) {
                textAlign = 'text-right'
            }

            if (column.report_settings && column.report_settings.negative_color_format_id === 1) {

                if (column.value_type === 20) {

                    if (parseInt(obj[column.key]) < 0) {

                        colorNegative = 'negative-red'

                    }

                }
            }

            cell = '<div class="g-cell-wrap" style="width: ' + column.style.width + '"><div class="g-cell ' + textAlign + ' ' + colorNegative + '">' + getValue(evDataService, obj, column, index + 1, groups) + '</div></div>';

            result = result + cell

        });

        result = result + '</div>';

        return result;

    };

    module.exports = {
        render: render
    }


}());