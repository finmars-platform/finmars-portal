(function () {

    var renderHelper = require('../../helpers/render.helper');

    var evRvCommonHelper = require('../../helpers/ev-rv-common.helper');

    var checkIcon = renderHelper.getCheckIcon();

    var REPORT_BG_CSS_SELECTOR = 'report-bg-level';

    var getBorderBottomTransparent = function (obj, columnNumber, groups, nextItem) {

        var result = '';

        if (columnNumber <= groups.length && columnNumber <= obj.___level) {

            // if (groups[columnNumber - 1].report_settings.subtotal_type === 'area') {

            if (nextItem) {

                if (obj.___type === 'subtotal'
                    && columnNumber < obj.___level - 1
                    && columnNumber < nextItem.___level - 1) {
                    result = 'border-bottom-transparent';
                }

            }

            // }
        }

        return result;

    };

    var getValue = function (evDataService, obj, column, columnNumber, nextItem, previousItem) {

        var result = '';

        if (columnNumber < obj.___level - 1) {


            if (obj.___subtotal_type === 'line' || (obj.___subtotal_type === 'arealine' && obj.___subtotal_subtype === 'line')) {

                if (obj.___level > previousItem.___level) {

                    var groups = evDataService.getGroups();

                    console.log("Level (-1)", obj.___level - 1);

                    var groupLevel = obj.___level - 1;
                    var previousGroupLevel = groupLevel - 1;
                    var previousGroupIndex = previousGroupLevel - 1;

                    var resultsGroupsIndexes = [];

                    for (var i = previousGroupIndex; i >= 0; i = i - 1) {

                        if (groups[i].report_settings.subtotal_type === 'area') {
                            resultsGroupsIndexes.push(i)
                        } else {
                            break;
                        }

                    }

                    if (resultsGroupsIndexes.indexOf(columnNumber - 1) !== -1) {

                        var parents = evRvCommonHelper.getParents(obj.___parentId, evDataService);

                        parents.forEach(function (parent) {

                            if (parent.___level === columnNumber) {

                                var group = evDataService.getData(parent.___parentId);

                                var foldButton = '';

                                if (group.___is_open) {
                                    foldButton = '<div class="ev-fold-button" data-type="foldbutton" data-object-id="' + parent.___id + '" data-parent-group-hash-id="' + parent.___parentId + '">-</div>';
                                } else {
                                    foldButton = '<div class="ev-fold-button" data-type="foldbutton" data-object-id="' + parent.___id + '" data-parent-group-hash-id="' + parent.___parentId + '">+</div>';
                                }

                                result = foldButton + '<b>' + parent.group_name + '</b>'
                            }

                        })


                    }

                }

            }

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

    var render = function (evDataService, obj, columns, groups, nextItem, previousItem) {

        var foldButton = '';

        var group = evDataService.getData(obj.___parentId);

        if (group.___is_open) {
            foldButton = '<div class="ev-fold-button" data-type="foldbutton" data-object-id="' + group.___id + '" data-parent-group-hash-id="' + group.___parentId + '">-</div>';
        } else {
            foldButton = '<div class="ev-fold-button" data-type="foldbutton" data-object-id="' + group.___id + '" data-parent-group-hash-id="' + group.___parentId + '">+</div>';
        }

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

            var borderBottomTransparent = getBorderBottomTransparent(obj, columnNumber, groups, nextItem);

            var value = getValue(evDataService, obj, column, columnNumber, nextItem, previousItem);

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