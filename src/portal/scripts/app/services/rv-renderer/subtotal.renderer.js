(function () {

    var renderHelper = require('../../helpers/render.helper');
    var rvHelper = require('../../helpers/rv.helper');

    var evRvCommonHelper = require('../../helpers/ev-rv-common.helper');

    var checkIcon = renderHelper.getCheckIcon();

    var REPORT_BG_CSS_SELECTOR = 'report-bg-level';

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

    var getValue = function (evDataService, obj, column, columnNumber) {

        var result = '';

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
                            foldButton = '<div class="ev-fold-button" data-type="foldbutton" data-object-id="' + currentGroup.___id + '" data-parent-group-hash-id="' + currentGroup.___parentId + '">-</div>';
                        } else {
                            foldButton = '<div class="ev-fold-button" data-type="foldbutton" data-object-id="' + currentGroup.___id + '" data-parent-group-hash-id="' + currentGroup.___parentId + '">+</div>';
                        }

                        result = foldButton + '<b>' + currentGroup.group_name + '</b>';

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
                    foldButton = '<div class="ev-fold-button" data-type="foldbutton" data-object-id="' + group.___id + '" data-parent-group-hash-id="' + group.___parentId + '">-</div>';
                } else {
                    foldButton = '<div class="ev-fold-button" data-type="foldbutton" data-object-id="' + group.___id + '" data-parent-group-hash-id="' + group.___parentId + '">+</div>';
                }

                if (obj.___level - 1 === columnNumber) {
                    foldButtonStr = foldButton
                } else {
                    foldButtonStr = ''
                }

                result = foldButtonStr + '<b>' + obj.group_name + '</b>';

            }

        }

        if (columnNumber > obj.___level - 1) {

            if (column.report_settings && !column.report_settings.hide_subtotal) {

                if (obj.hasOwnProperty(column.key)) {
                    result = '<b>' + renderHelper.formatValue(obj, column) + '</b>';
                }

            }

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

        var classList = ['g-row'];

        if (obj.___subtotal_type === 'proxyline') {
            classList.push('proxyline')
        }

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

        var result = '<div class="' + classes + '" data-type="subtotal" data-object-id="' + obj.___id + '" data-parent-group-hash-id="' + obj.___parentId + '">';
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

            var value = getValue(evDataService, obj, column, columnNumber);

            obj.___cells_values.push({
                width: column.style.width,
                classList: [textAlign, colorNegative, borderBottomTransparent],
                value: value
            });

            cell = '<div class="g-cell-wrap ' + getBgColor(evDataService, obj, columnNumber) + '" style="width: ' + column.style.width + '"><div class="g-cell ' + textAlign + ' ' + colorNegative + ' ' + borderBottomTransparent + ' ">' +
                value +
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