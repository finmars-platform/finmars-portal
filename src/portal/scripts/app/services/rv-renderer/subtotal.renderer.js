(function () {

    var renderHelper = require('../../helpers/render.helper');
    var rvHelper = require('../../helpers/rv.helper');
    var evDataHelper = require('../../helpers/ev-data.helper');

    var evRvCommonHelper = require('../../helpers/ev-rv-common.helper');

    var checkIcon = renderHelper.getCheckIcon();

    var REPORT_BG_CSS_SELECTOR = 'report-bg-level';
    var REPORT_GRAND_TOTAL_CSS_SELECTOR = 'report-grand-total-bg';

    var getBorderBottomTransparent = function (evDataService, obj, columnNumber, groups) {

        var result = '';

        var nextItem = null;
        var flatList = evDataService.getFlatList();

        if (flatList.length > obj.___flat_list_index + 1) {
            nextItem = flatList[obj.___flat_list_index + 1]
        }

        if (columnNumber <= groups.length && columnNumber <= obj.___level) {

            if (nextItem) {

                if (obj.___type === 'subtotal'
                    && columnNumber < obj.___level - 1
                    && columnNumber < nextItem.___level - 1) {
                    result = 'border-bottom-transparent';
                }

            }

        }

        return result;

    };

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

    var getValue = function (evDataService, obj, column, columnNumber) {

        var result = {
            html_result: '',
            numeric_result: null
        };

        var isFirst = rvHelper.isFirst(evDataService, obj);

        if (columnNumber < obj.___level - 1) {

            var groups = evDataService.getGroups();

            if (groups[columnNumber - 1].report_settings.subtotal_type === 'area') {

                var flatList = evDataService.getFlatList();
                var proxyLineSubtotal;

                var skip = false;

                for (var i = obj.___flat_list_index - 1; i >= 0; i = i - 1) {

                    if (flatList[i].___type === 'subtotal') {

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

                if (proxyLineSubtotal && proxyLineSubtotal.___level < obj.___level && obj.___type === 'subtotal' && obj.___subtotal_type === 'area') {
                    skip = true;
                }

                if (skip === false) {

                    var currentGroup = evDataService.getData(proxyLineSubtotal.___parentId);
                    var parentGroup = evDataService.getData(currentGroup.___parentId);

                    if (parentGroup.___is_open) {

                        var foldButton = '';

                        if (currentGroup.___is_open) {
                            foldButton = '<div class="g-group-fold-button"><div class="ev-fold-button" data-type="foldbutton" data-object-id="' + currentGroup.___id + '" data-parent-group-hash-id="' + currentGroup.___parentId + '"><div>-</div></div>';
                        } else {
                            foldButton = '<div class="g-group-fold-button"><div class="ev-fold-button" data-type="foldbutton" data-object-id="' + currentGroup.___id + '" data-parent-group-hash-id="' + currentGroup.___parentId + '"><div>+</div></div>';
                        }

                        result.html_result = foldButton + '<span class="text-bold">' + currentGroup.___group_name + '</span>';

                    }

                }

            }

            return result;

        }

        if (columnNumber === obj.___level - 1) {

            var foldButton = '';
            var foldButtonStr = '';

            var group = evDataService.getData(obj.___parentId);
            var parentGroup = evDataService.getData(group.___parentId);

            if (parentGroup.___is_open) {

                if (group.___is_open) {
                    foldButton = '<div class="g-group-fold-button"><div class="ev-fold-button" data-type="foldbutton" data-object-id="' + group.___id + '" data-parent-group-hash-id="' + group.___parentId + '">-</div></div>';
                } else {
                    foldButton = '<div class="g-group-fold-button"><div class="ev-fold-button" data-type="foldbutton" data-object-id="' + group.___id + '" data-parent-group-hash-id="' + group.___parentId + '">+</div></div>';
                }

                if (obj.___level - 1 === columnNumber) {
                    foldButtonStr = foldButton
                } else {
                    foldButtonStr = ''
                }

                result.html_result = '<span class="g-cell-content">' + foldButtonStr + '<span class="text-bold">' + obj.___group_name + '</span></span>';

            }

        }

        if (columnNumber > obj.___level - 1) {

            if (column.report_settings && column.report_settings.subtotal_formula_id && !column.report_settings.hide_subtotal) {

                if (obj.hasOwnProperty(column.key)) {
                    result.html_result = '<span class="text-bold">' + renderHelper.formatValue(obj, column) + '</span>';
                    result.numeric_result = obj[column.key];
                } else {
                    result = getDynamicAttributeValue(obj, column);
                }

            }

        }

        /* Insert 'Grand Total' text inside first cell of the row */
        var rootGroupOptions = evDataService.getRootGroupOptions();
        var grandTotalIsActive = rootGroupOptions.subtotal_type;

        if (obj.___level === 0 && grandTotalIsActive && columnNumber === 1) {
            result.html_result = '<span class="text-bold">Grand Total</span>'
        }

        return result;

    };

    var getBgColor = function (evDataService, obj, columnNumber) {

        // var result = '';
        //
        // if (columnNumber >= obj.___level - 1) {
        //
        //     result = REPORT_BG_CSS_SELECTOR + '-' + (obj.___level - 1);
        //
        // }
        //
        //
        // return result;

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
        } else {

            if (columnNumber >= obj.___level - 1) {

                result = REPORT_BG_CSS_SELECTOR + '-' + (obj.___level - 1);

            }

        }

        /* For Grand Total background */
        var rootGroupOptions = evDataService.getRootGroupOptions();

        if (obj.___level === 0 && rootGroupOptions.subtotal_type) {
            result = REPORT_GRAND_TOTAL_CSS_SELECTOR;
        }
        /* < For Grand Total background > */

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

        var columns = evDataService.getColumns();
        var groups = evDataService.getGroups();

        var parent = evDataService.getData(obj.___parentId);

        var classList = ['g-row'];

        if (obj.___subtotal_type === 'proxyline') {
            classList.push('proxyline')
        }

        var is_activated = false;
        var subtotal_type;

        if (obj.___subtotal_subtype) {
            subtotal_type = obj.___subtotal_subtype
        } else {
            subtotal_type = obj.___subtotal_type
        }

        if(subtotal_type === 'line') {
            is_activated = parent.___is_line_subtotal_activated
        }

        if(subtotal_type === 'area') {
            is_activated = parent.___is_area_subtotal_activated
        }

        var rowSelection;

        if (is_activated) {
            classList.push('selected');
            rowSelection = '<div class="g-row-selection">' + checkIcon + '</div>';
        } else {
            rowSelection = '<div class="g-row-selection"></div>';
        }

        if (is_activated) {
            classList.push('activated');
        }

        var classes = classList.join(' ');

        var result;

        if (obj.___subtotal_subtype) {
            result = '<div class="' + classes + '" data-type="subtotal" data-subtotal-type="' + obj.___subtotal_type + '" data-subtotal-subtype="' + obj.___subtotal_subtype + '" data-object-id="' + obj.___id + '" data-parent-group-hash-id="' + obj.___parentId + '">';
        } else {

            result = '<div class="' + classes + '" data-type="subtotal" data-subtotal-type="' + obj.___subtotal_type + '" data-object-id="' + obj.___id + '" data-parent-group-hash-id="' + obj.___parentId + '">';
        }
        var cell;

        result = result + rowSelection;

        obj.___cells_values = [];

        columns.forEach(function (column, index) {

            var textAlign = '';
            var columnNumber = index + 1;
            var colorNegative = getColorNegativeNumber(obj, column);

            if (column.value_type === 20) {
                textAlign = 'text-right'
            }

            var borderBottomTransparent = getBorderBottomTransparent(evDataService, obj, columnNumber, groups);

            var value_obj = getValue(evDataService, obj, column, columnNumber);

            obj.___cells_values.push({
                width: column.style.width,
                classList: [textAlign, colorNegative, borderBottomTransparent],
                value: value_obj.html_result
            });

            var resultValue = '';

            if (value_obj.html_result) {
                resultValue = '<span class="g-cell-content">' + value_obj.html_result + '</span>';
            }

            cell = '<div class="g-cell-wrap ' + getBgColor(evDataService, obj, columnNumber) + '" style="width: ' + column.style.width + '">' +
                '<div class="g-cell ' + textAlign + ' ' + colorNegative + ' ' + borderBottomTransparent + ' ">' +
                '<div class="g-cell-content-wrap">' +
                resultValue +
                '</div>' +
                '</div>' +
                '</div>';

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