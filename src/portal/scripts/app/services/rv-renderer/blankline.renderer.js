(function () {

    var renderHelper = require('../../helpers/render.helper');

    var evRvCommonHelper = require('../../helpers/ev-rv-common.helper');


    var checkIcon = renderHelper.getCheckIcon();
    var REPORT_BG_CSS_SELECTOR = 'report-bg-level';

    var getBorderRightTransparent = function (obj, columnNumber) {

        var result = '';

        if (columnNumber >= obj.___level - 1) {
            result = 'border-right-transparent';
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


    var render = function (evDataService, obj) {

        var columns = evDataService.getColumns();
        var groups = evDataService.getGroups();

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

        var result = '<div class="' + classes + '" data-type="blankline" data-object-id="' + obj.___id + '" data-parent-group-hash-id="' + obj.___parentId + '">';
        var cell;

        result = result + rowSelection;

        columns.forEach(function (column, index) {

            var borderBottomTransparent = getBorderBottomTransparent(evDataService, obj, index + 1, groups);
            var borderRightTransparent = getBorderRightTransparent(obj, index + 1);

            cell = '<div class="g-cell-wrap" style="width: ' + column.style.width + '"><div class="g-cell ' + borderBottomTransparent + ' ' + borderRightTransparent + '">&nbsp;</div></div>';

            result = result + cell

        });

        result = result + '</div>';

        return result;

    };

    module.exports = {
        render: render
    }


}());