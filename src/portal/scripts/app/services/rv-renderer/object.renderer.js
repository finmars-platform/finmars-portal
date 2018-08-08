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
                    result = obj[column.key]
                }
            } else {

                if (Array.isArray(obj[column.key])) {

                    result = '[' + obj[column.key].length + ']';

                }

            }

        }

        return result;

    };

    var getValue = function (evDataService, obj, column, columnNumber, groups) {

        var result = '';

        var areaGroupsBefore = renderHelper.getAreaGroupsBefore(evDataService, obj.___level - 1);

        // console.log('ObjectRender.areaGroupsBefore', areaGroupsBefore);

        if (areaGroupsBefore.length && areaGroupsBefore.indexOf(columnNumber) !== -1 && obj.___is_first) {

            var parents = evRvCommonHelper.getParents(obj.___parentId, evDataService);

            var isFirst = true;

            parents.forEach(function (parent, index) {

                if(!parent.___is_first && parent.___level >= columnNumber) {
                    isFirst = false
                }

            });

            parents.forEach(function (parent, index) {

                if (parent.___level === columnNumber && isFirst) {
                    result = parent.group_name;
                }

            });

        } else {

            if (columnNumber <= groups.length && !obj.___is_first) {
                result = '';
            } else {

                if (obj[column.key]) {

                    result = getEntityAttributeValue(obj, column);

                } else {

                    result = getDynamicAttributeValue(obj, column);

                }

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

            cell = '<div class="g-cell-wrap ' + getBgColor(obj, index + 1, groups) + '" style="width: ' + column.style.width + '"><div class="g-cell">' + getValue(evDataService, obj, column, index + 1, groups) + '</div></div>';

            result = result + cell

        });

        result = result + '</div>';

        return result;

    };

    module.exports = {
        render: render
    }


}());