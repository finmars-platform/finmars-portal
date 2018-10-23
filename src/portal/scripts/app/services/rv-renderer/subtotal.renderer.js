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

        }

        if (columnNumber === obj.___level - 1) {

            result = obj.group_name;

        }

        if (columnNumber > obj.___level - 1) {

            if (column.report_settings && !column.report_settings.hide_subtotal) {

                if (obj.hasOwnProperty(column.key)) {
                    result = renderHelper.formatValue(obj, column);
                }

            }

        }

        return result;

    };

    var getBgColor = function (obj, columnNumber, groups) {

        var result = '';

        if (columnNumber >= obj.___level - 1) {

            result = REPORT_BG_CSS_SELECTOR + '-' + (obj.___level - 1);

        }


        return result;

    };

    var render = function (evDataService, obj) {

        var columns = evDataService.getColumns();
        var groups = evDataService.getGroups();

        var foldButton = '';

        var group = evDataService.getData(obj.___parentId);

        if (group.___is_open) {
            foldButton = '<div class="ev-fold-button" data-type="foldbutton" data-object-id="' + group.___id + '" data-parent-group-hash-id="' + group.___parentId + '">-</div>';
        } else {
            foldButton = '<div class="ev-fold-button" data-type="foldbutton" data-object-id="' + group.___id + '" data-parent-group-hash-id="' + group.___parentId + '">+</div>';
        }

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
            var foldButtonStr = '';

            if (column.value_type === 20) {
                textAlign = 'text-right'
            }

            if (obj.___level - 1 === columnNumber) {
                foldButtonStr = foldButton
            } else {
                foldButtonStr = ''
            }

            var borderBottomTransparent = getBorderBottomTransparent(evDataService, obj, columnNumber, groups);

            var value = getValue(evDataService, obj, column, columnNumber);

            obj.___cells_values.push(value);

            cell = '<div class="g-cell-wrap ' + getBgColor(obj, columnNumber, groups) + '" style="width: ' + column.style.width + '"><div class="g-cell ' + textAlign + ' ' + borderBottomTransparent + ' ">' +
                foldButtonStr + '<b>' + value + '</b>' +
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