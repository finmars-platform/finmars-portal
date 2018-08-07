(function () {

    var renderHelper = require('../../helpers/render.helper');

    var checkIcon = renderHelper.getCheckIcon();

    var REPORT_BG_CSS_SELECTOR = 'report-bg-level';

    var getValue = function (obj, column, columnNumber) {

        if (columnNumber < obj.___level) {
            return '';
        }

        var result = '';

        if (obj.hasOwnProperty(column.key)) {
            result = obj[column.key];
        }

        return result;

    };

    var getBgColor = function (obj, columnNumber, groups) {


        var result = '';

        if (columnNumber < groups.length && columnNumber < obj.___level) {

            if (groups[columnNumber - 1].report_settings.subtotal_type === 'area') {
                result = REPORT_BG_CSS_SELECTOR + '-' + columnNumber;

            }

        } else {
            result = REPORT_BG_CSS_SELECTOR + '-' + (obj.___level - 1);
        }

        return result;

    };

    var render = function (obj, columns, groups) {

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

            cell = '<div class="g-cell-wrap ' + getBgColor(obj, index + 1, groups) + '" style="width: ' + column.style.width + '"><div class="g-cell">' + getValue(obj, column, index + 1) + '</div></div>';

            result = result + cell

        });

        result = result + '</div>';

        return result;

    };

    module.exports = {
        render: render
    }


}());