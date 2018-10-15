(function () {

    var renderHelper = require('../../helpers/render.helper');

    var evRvCommonHelper = require('../../helpers/ev-rv-common.helper');

    var checkIcon = renderHelper.getCheckIcon();

    var REPORT_BG_CSS_SELECTOR = 'report-bg-level';

    var getBorderBottomTransparent = function (obj, columnNumber, groups, nextItem) {

        var result = '';

        if (columnNumber <= groups.length && columnNumber <= obj.___level) {

            if (groups[columnNumber - 1].report_settings.subtotal_type === 'area') {

                if (obj.___type === 'subtotal' && columnNumber < obj.___level - 1
                    && columnNumber < nextItem.___level - 1) {
                    result = 'border-bottom-transparent';
                }

            }
        }

        return result;

    };

    var getValue = function (evDataService, obj, column, columnNumber) {

        var result = '';

        if (columnNumber === obj.___level - 1) {

            result = obj.group_name;

        } else {

            if (column.report_settings && !column.report_settings.hide_subtotal) {

                if (obj.___subtotal_type === 'line') {

                    var areaGroupsBefore = renderHelper.getAreaGroupsBefore(evDataService, obj.___level - 1);

                    // console.log('areaGroupsBefore', areaGroupsBefore);

                    if (areaGroupsBefore.length && areaGroupsBefore.indexOf(columnNumber) !== -1) {

                        var parents = evRvCommonHelper.getParents(obj.___parentId, evDataService);

                        parents.forEach(function (parent) {
                            if (parent.___level === columnNumber) {
                                result = parent.group_name;
                            }
                        });

                    } else {

                        if (columnNumber === obj.___level - 1) {

                            var parent = evDataService.getData(obj.___parentId);

                            result = parent.group_name;

                        } else {

                            if (columnNumber < obj.___level) {
                                result = '';
                            }


                            if (obj.hasOwnProperty(column.key)) {
                                result = renderHelper.formatValue(obj, column);
                            }
                        }

                    }

                } else {

                    if (columnNumber < obj.___level) {
                        result = '';
                    }

                    if (obj.hasOwnProperty(column.key)) {
                        result = renderHelper.formatValue(obj, column);
                    }

                }

            }

        }

        return result;

    };

    var getBgColor = function (obj, columnNumber, groups) {

        var result = '';

        // if (columnNumber < groups.length && columnNumber < obj.___level - 1) {
        //
        //     if (groups[columnNumber - 1].report_settings.subtotal_type === 'area') {
        //         result = REPORT_BG_CSS_SELECTOR + '-' + columnNumber;
        //
        //     }
        //
        // } else {

        if (columnNumber >= obj.___level - 1) {

            result = REPORT_BG_CSS_SELECTOR + '-' + (obj.___level - 1);

        }

        // }

        return result;

    };

    var render = function (evDataService, obj, columns, groups, nextItem) {

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

            if (column.value_type === 20) {
                textAlign = 'text-right'
            }

            var borderBottomTransparent = getBorderBottomTransparent(obj, index + 1, groups, nextItem);

            cell = '<div class="g-cell-wrap ' + getBgColor(obj, index + 1, groups) + '" style="width: ' + column.style.width + '"><div class="g-cell ' + textAlign + ' ' + borderBottomTransparent + ' "><b>' + getValue(evDataService, obj, column, index + 1) + '</b></div></div>';

            result = result + cell

        });

        result = result + '</div>';

        return result;

    };

    module.exports = {
        render: render
    }


}());