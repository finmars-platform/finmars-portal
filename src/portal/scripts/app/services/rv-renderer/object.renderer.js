(function () {

    var renderHelper = require('../../helpers/render.helper');
    var rvHelper = require('../../helpers/rv.helper');

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

    var handleColumnInGroupList = function (evDataService, obj, column, columnNumber) {

        var result = '';
        var groups = evDataService.getGroups();

        if (groups[columnNumber - 1].report_settings.subtotal_type === 'area') {

            var flatList = evDataService.getFlatList();
            var proxyLineSubtotal;

            var skip = false;

            for (var i = obj.___flat_list_index - 1; i >= 0; i = i - 1) {

                if (flatList[i].___type === 'object' || flatList[i].___type === 'subtotal') {

                    if (flatList[i].___subtotal_type !== 'proxyline') {

                        skip = true;
                        break;
                    }

                }

                if (flatList[i].___level === columnNumber + 1 && flatList[i].___subtotal_type === 'proxyline') {

                    proxyLineSubtotal = flatList[i];

                    break;
                }


            }

            if (skip === false) {

                var foldButton = '';

                var currentGroup = evDataService.getData(proxyLineSubtotal.___parentId);
                var group = evDataService.getData(currentGroup.___parentId);

                if (group.___is_open) {
                    foldButton = '<div class="ev-fold-button" data-type="foldbutton" data-object-id="' + currentGroup.___id + '" data-parent-group-hash-id="' + currentGroup.___parentId + '">-</div>';
                } else {
                    foldButton = '<div class="ev-fold-button" data-type="foldbutton" data-object-id="' + currentGroup.___id + '" data-parent-group-hash-id="' + currentGroup.___parentId + '">+</div>';
                }

                result = foldButton + '<b>' + currentGroup.group_name + '</b>';

            }

        }

        return result;

    };

    var getValue = function (evDataService, obj, column, columnNumber, groups) {

        var result = '';


        if (renderHelper.isColumnInGroupsList(columnNumber, groups)) {

            result = handleColumnInGroupList(evDataService, obj, column, columnNumber);

        }

        if (renderHelper.isColumnAfterGroupsList(columnNumber, groups)) {

            var parent = evDataService.getData(obj.___parentId);

            if (parent.___is_open) {

                if (obj[column.key]) {

                    result = getEntityAttributeValue(obj, column);

                } else {

                    result = getDynamicAttributeValue(obj, column);

                }


            } else {

                if (column.report_settings && !column.report_settings.hide_subtotal) {

                    var subtotal;

                    var flatList = evDataService.getFlatList();

                    for (var i = 0; i < flatList.length; i = i + 1) {

                        if (flatList[i].___level === obj.___level &&
                            flatList[i].___parentId === obj.___parentId &&
                            flatList[i].___type === 'subtotal') {
                            subtotal = flatList[i];
                            break;
                        }

                    }

                    if (obj.hasOwnProperty(column.key)) {
                        result = renderHelper.formatValue(subtotal, column);
                    }

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

    var getBorderBottomTransparent = function (evDataService, obj, columnNumber, groups) {

        var result = '';
        var nextItem = null;
        var flatList = evDataService.getFlatList();

        if (flatList.length > obj.___flat_list_index + 1) {
            nextItem = flatList[obj.___flat_list_index + 1]
        }

        if (columnNumber <= groups.length && columnNumber <= obj.___level) {

            if (nextItem && nextItem.___type !== 'subtotal' && nextItem.___level === obj.___level) {
                result = 'border-bottom-transparent';
            }

            if (nextItem && nextItem.___type === 'subtotal' && columnNumber < obj.___level - 1) {
                result = 'border-bottom-transparent';
            }

            if (obj.___type === 'subtotal' && columnNumber < obj.___level - 1) {
                result = 'border-bottom-transparent';
            }

        }

        return result;

    };

    var getColorNegativeNumber = function (obj, column) {

        var result = '';

        if (column.report_settings && column.report_settings.negative_color_format_id === 1) {

            if (column.value_type === 20) {

                if (parseInt(obj[column.key]) < 0) {

                    result = 'negative-red'

                }

            }
        }

        return result;

    };

    var render = function (evDataService, obj) {

        var classList = ['g-row'];

        var columns = evDataService.getColumns();
        var groups = evDataService.getGroups();

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

        obj.___cells_values = [];

        columns.forEach(function (column, columnIndex) {

            var textAlign = '';
            var colorNegative = getColorNegativeNumber(obj, column);
            var borderBottomTransparent = getBorderBottomTransparent(evDataService, obj, columnIndex + 1, groups);

            if (column.value_type === 20) {
                textAlign = 'text-right'
            }

            var value = getValue(evDataService, obj, column, columnIndex + 1, groups);

            obj.___cells_values.push({
                width: column.style.width,
                classList: [textAlign, colorNegative, borderBottomTransparent],
                value: value
            });

            cell = '<div class="g-cell-wrap" style="width: ' + column.style.width + '"><div class="g-cell ' + textAlign + ' ' + colorNegative + ' ' + borderBottomTransparent + '">' + value + '</div></div>';

            result = result + cell

        });

        evDataService.updateItemInFlatList(obj);

        result = result + '</div>';

        return result;

    };

    module.exports = {
        render: render
    }


}());