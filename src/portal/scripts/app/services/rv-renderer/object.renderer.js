(function () {

    var renderHelper = require('../../helpers/render.helper');
    var rvHelper = require('../../helpers/rv.helper');

    var evRvCommonHelper = require('../../helpers/ev-rv-common.helper');

    var checkIcon = renderHelper.getCheckIcon();
    var REPORT_BG_CSS_SELECTOR = 'report-bg-level';

    var getDynamicAttributeValue = function (obj, column) {

        var result = {
            'html_result': '',
            'numeric_result': null
        };

        if (column.id && obj[column.entity + '_object']) {

            obj[column.entity + '_object'].attributes.forEach(function (item) {

                if (item.attribute_type === column.id) {

                    if (column.value_type === 20 && item.value_float) {

                        result.html_result = item.value_float.toString();
                        result.numeric_result = item.value_float;

                    }

                    if (column.value_type === 10 && item.value_string) {

                        result.html_result = item.value_string;

                    }

                    if (column.value_type === 30 && item.classifier_object) {

                        result.html_result = item.classifier_object.name;
                    }

                    if (column.value_type === 40 && item.value_date) {

                        result.html_result = item.value_date;

                    }
                }

            });

        }


        return result;

    };

    var getEntityAttributeValue = function (obj, column) {

        var result = {
            'html_result': '',
            'numeric_result': null
        };

        if (typeof obj[column.key] === 'string') {
            result.html_result = obj[column.key]
        } else {

            if (typeof obj[column.key] === 'number') {

                if (obj[column.key + '_object'] && obj[column.key + '_object'].name) {

                    result.html_result = obj[column.key + '_object'].name;

                } else {

                    result.html_result = renderHelper.formatValue(obj, column);
                    result.numeric_result = obj[column.key];

                }

            } else {

                if (Array.isArray(obj[column.key])) {

                    result.html_result = '[' + obj[column.key].length + ']';

                }

            }

        }

        return result;

    };

    var handleColumnInGroupList = function (evDataService, obj, column, columnNumber) {

        var result = {
            html_result: '',
            numeric_result: null
        };
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

                var currentGroup = evDataService.getData(proxyLineSubtotal.___parentId);
                var parentGroup = evDataService.getData(currentGroup.___parentId);

                if (parentGroup.___is_open) {

                    var foldButton = '';

                    if (currentGroup.___is_open) {
                        foldButton = '<div class="ev-fold-button" data-type="foldbutton" data-object-id="' + currentGroup.___id + '" data-parent-group-hash-id="' + currentGroup.___parentId + '">-</div>';
                    } else {
                        foldButton = '<div class="ev-fold-button" data-type="foldbutton" data-object-id="' + currentGroup.___id + '" data-parent-group-hash-id="' + currentGroup.___parentId + '">+</div>';
                    }

                    result.html_result = foldButton + '<b>' + currentGroup.group_name + '</b>';

                }
            }

        }

        return result;

    };

    var getValue = function (evDataService, obj, column, columnNumber, groups) {

        var result = {
            html_result: '',
            numeric_result: null
        };


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

                    subtotal = rvHelper.lookUpForSubtotal(evDataService, obj, column, columnNumber);

                    if (obj.hasOwnProperty(column.key)) {
                        result.html_result = '<b>' + renderHelper.formatValue(subtotal, column) + '</b>';
                        result.numeric_result = subtotal[column.key];
                    }

                }

            }

        }

        return result;

    };

    var getBgColor = function (evDataService, obj, columnNumber) {

        var result = '';

        var parents = evRvCommonHelper.getParents(obj.___parentId, evDataService);

        var foldedParents = [];
        var i;

        for (i = 0; i < parents.length; i = i + 1) {

            if (parents[i].___is_open === false) {
                foldedParents.push(parents[i]);
            }

        }

        var firstFoldedParent = foldedParents[foldedParents.length - 1];

        // console.log('firstFoldedParent', firstFoldedParent);

        if (firstFoldedParent && columnNumber >= firstFoldedParent.___level) {
            result = REPORT_BG_CSS_SELECTOR + '-' + (firstFoldedParent.___level);
        }

        return result;

    };

    var getTextAlign = function (column) {

        var result = '';

        if (column.value_type === 20) {
            result = 'text-right'
        }

        return result

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

    var getColorNegativeNumber = function (val, column) {

        var result = '';

        if (column.report_settings && column.report_settings.negative_color_format_id === 1) {

            if (column.value_type === 20) {

                if (parseInt(val) < 0) {

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

        var textAlign;
        var columnNumber;
        var colorNegative = '';
        var borderBottomTransparent = '';
        var value_obj;
        var resultValue;

        result = result + rowSelection;

        obj.___cells_values = [];

        columns.forEach(function (column, columnIndex) {

            columnNumber = columnIndex + 1;

            borderBottomTransparent = getBorderBottomTransparent(evDataService, obj, columnNumber, groups);
            textAlign = getTextAlign(column);
            value_obj = getValue(evDataService, obj, column, columnNumber, groups);

            if (value_obj.numeric_result !== null && value_obj.numeric_result !== undefined) {
                colorNegative = getColorNegativeNumber(value_obj.numeric_result, column);
            }

            obj.___cells_values.push({
                width: column.style.width,
                classList: [textAlign, colorNegative, borderBottomTransparent],
                value: value_obj.html_result
            });

            resultValue = '';

            if (value_obj.html_result) {
                resultValue = value_obj.html_result;
            }

            cell = '<div class="g-cell-wrap ' + getBgColor(evDataService, obj, columnNumber) + '" style="width: ' + column.style.width + '"><div class="g-cell ' + textAlign + ' ' + colorNegative + ' ' + borderBottomTransparent + '">' + resultValue + '</div></div>';

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