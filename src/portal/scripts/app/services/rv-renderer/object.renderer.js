(function () {

    var renderHelper = require('../../helpers/render.helper');

    var checkIcon = renderHelper.getCheckIcon();
    var REPORT_BG_CSS_SELECTOR = 'report-bg-level';

    var getValue = function (obj, column, index, groups) {

        if (index < groups.length) {
            return '';
        }


        if (obj[column.key]) {

            if (typeof obj[column.key] === 'string') {
                return obj[column.key]
            }

            if (typeof obj[column.key] === 'number') {

                if (obj[column.key + '_object'] && obj[column.key + '_object'].user_code) {
                    return obj[column.key + '_object'].user_code;
                }

                return obj[column.key]
            }

            if (Array.isArray(obj[column.key])) {

                return '[' + obj[column.key].length + ']';

            }

        }

        if (column.id) {

            var result = '';

            if (obj.attributes) {

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

                return result;

            }

        }

        return '';

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

            cell = '<div class="g-cell-wrap ' + getBgColor(obj, index + 1, groups) + '" style="width: ' + column.style.width + '"><div class="g-cell">' + getValue(obj, column, index, groups) + '</div></div>';

            result = result + cell

        });

        result = result + '</div>';

        return result;

    };

    module.exports = {
        render: render
    }


}());