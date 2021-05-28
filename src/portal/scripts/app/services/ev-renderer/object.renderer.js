(function () {

    var renderHelper = require('../../helpers/render.helper');
    var stringHelper = require('../../helpers/stringHelper');

    /* var checkIcon = renderHelper.getCheckIcon();
    var lockIcon = renderHelper.getLockIcon();
    var lock2Icon = renderHelper.getLock2Icon();
    var starIcon = renderHelper.getStarIcon();
    var cancelIcon = renderHelper.getCancelIcon();
    var partiallyVisibleIcon = renderHelper.getPartiallyVisibleIcon(); */

    var getIcon = function (obj, currentMember, classList) {

        var result = '';

        var hasChange = false;
        var hasManage = false;
        var partVisible = false;

        if (obj.object_permissions) {

            result = 'lockIcon'; // lock

            obj.object_permissions.forEach(function (perm) {

                if (currentMember.groups.indexOf(perm.group) !== -1) {

                    if (perm.permission.indexOf('change_') !== -1) {
                        hasChange = true
                    }

                    if (perm.permission.indexOf('manage_') !== -1) {
                        hasManage = true
                    }

                    if (perm.permission === 'view_complextransaction_show_parameters' ||
                        perm.permission === 'view_complextransaction_hide_parameters') {
                        partVisible = true;
                    }

                }

            });

            if (hasManage) {
                result = 'starIcon';

            } else if (hasChange) {
                result = '';

            } /*else if (partVisible) {
                result = partiallyVisibleIcon;

            }*/

            if (obj.___is_activated && result !== '') { // Be aware of specific mutation
                classList.push('selected-blue');
            }

        }

        if (obj.___is_activated) {
            result = 'checkIcon'
        }

        else if (partVisible) {
            result = 'partiallyVisibleIcon';
        }

        else if (obj.is_canceled) {
            result = 'cancelIcon';
        }

        else if (obj.is_locked) {
            result = 'lock2Icon';
        }

        else if (obj.is_deleted) {
            result = 'deletedIcon';
        }

        else if (obj.hasOwnProperty('is_enabled') && !obj.is_enabled) {
            result = 'disabledIcon';
        }

        else if (obj.hasOwnProperty('is_active') && !obj.is_active) {
            result = 'inactiveIcon';
        }

        else if (currentMember && currentMember.is_admin) {
            result = 'starIcon';
        }

        return renderHelper.getIconByKey(result);

    };

    var getValue = function (obj, column) {

        if (column.status === 'missing') {
            return "Deleted";
        }

        if (obj[column.key]) {

            if (typeof obj[column.key] === 'string') {
                return stringHelper.parseAndInsertHyperlinks(obj[column.key], "class='openLinkInNewTab'");
            }

            if (typeof obj[column.key] === 'number') {

                // if (obj[column.key + '_object'] && obj[column.key + '_object'].user_code) {
                //     return obj[column.key + '_object'].user_code;
                // }

                if (obj[column.key + '_object']) {

                    if (obj[column.key + '_object'].name) {

                        if (obj[column.key + '_object'].short_name) {

                            return obj[column.key + '_object'].short_name;

                        } else {
                            return obj[column.key + '_object'].name;
                        }

                    } else if (column.key === 'price_download_scheme') {

                        return obj[column.key + '_object'].user_code;

                    }

                }

                if (column.key === 'status') {

                	if (obj[column.key] === 1) {
                        return 'Booked'
                    }

                    if (obj[column.key] === 2) {
                        return 'Pending'
                    }

                }

                return obj[column.key]
            }

            if (Array.isArray(obj[column.key])) {

                return '[' + obj[column.key].length + ']';

            }

        }

        if (column.attribute_type) {

            var result = '';

            if (obj.attributes) {

                var pieces = column.key.split('.');

                // var id = parseInt(pieces[pieces.length - 1], 10);
                var user_code = pieces[pieces.length - 1];

                obj.attributes.forEach(function (item) {

                    if (item.attribute_type_object && item.attribute_type_object.user_code === user_code) {

                        if (column.value_type === 20 && item.value_float) {

                            result = item.value_float;

                        }

                        if (column.value_type === 10 && item.value_string) {

                            result = stringHelper.parseAndInsertHyperlinks(item.value_string, "class='openLinkInNewTab'");

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

    var addReconColorization = function (obj, classList, viewContext, verticalAdditions) {

        if (verticalAdditions.isOpen && verticalAdditions.type === 'reconciliation' || viewContext === 'reconciliation_viewer') {

            var status = 'no-recon-fields-row';

            if (obj.hasOwnProperty('fields') && obj.fields.length) {

                status = 'row-recon-matched';

                // MATCHED = 1
                // CONFLICT = 2
                // RESOLVED = 3
                // IGNORE = 4
                // AUTO_MATCHED = 5

                for (var i = 0; i < obj.fields.length; i = i + 1) {

                    if (!obj.fields[i].status) {
                        status = 'row-recon-new';
                        break;
                    }

                    if (obj.fields[i].status === 2) {
                        status = 'row-recon-conflict';
                        break;
                    }

                    if (obj.fields[i].status === 5) {
                        status = 'row-recon-auto-matched';
                        break;
                    }

                }

            }

            if (obj.hasOwnProperty('recon_fields') && obj.recon_fields.length) {

                status = 'row-recon-matched';

                // MATCHED = 1
                // UNMATCHED = 2
                // AUTO_MATCHED = 3
                // IGNORE = 4

                for (var i = 0; i < obj.recon_fields.length; i = i + 1) {

                    if (obj.recon_fields[i].status !== 1) {
                        status = 'row-recon-unmatched';
                        break;
                    }

                    if (obj.recon_fields[i].status === 3) {
                        status = 'row-recon-auto-matched';
                        break;
                    }
                }


            }

            if (obj.is_canceled) {
                status = 'row-recon-canceled';
            }

            classList.push(status)

        }

    };

    var getCellTextAlign = function (column) {

    	var result = '';

        if (column.style && column.style.text_align) {
            result = ' text-' + column.style.text_align;
        }

        return result;

    };

    var getRowGeneralClasses = function (obj, classList) {

		if (obj.___context_menu_is_opened) {
			classList.push('context-menu-opened');
		}

        if (obj.___is_last_activated) {
            classList.push('last-selected');

        } else if (obj.___is_activated) {
            classList.push('selected');

        } else if (obj.is_deleted) {
            classList.push('deleted');
        }

    }

    var render = function (evDataService, obj, columns, currentMember, viewContext, verticalAdditions) {

        var classList = ['g-row'];

        var rowSelection;
        var rowHeight = evDataService.getRowHeight();

        getRowGeneralClasses(obj, classList);

        rowSelection = '<div class="g-row-selection">' + getIcon(obj, currentMember, classList) + '</div>';

        addReconColorization(obj, classList, viewContext, verticalAdditions);

        var classes = classList.join(' ');

        var offsetTop = obj.___flat_list_offset_top_index * rowHeight;

        var result = '<div class="' + classes + '" style="top: '+ offsetTop+'px" data-type="object" data-object-id="' + obj.___id + '" data-parent-group-hash-id="' + obj.___parentId + '">';
        var cell;

        result = result + rowSelection;

        console.log('render.columns', columns);

        columns.forEach(function (column, columnIndex) {

			var columnNumber = columnIndex + 1;

			var cellValue = getValue(obj, column);
            var textAlign = getCellTextAlign(column);
            var gCellTitle = '';

            if (cellValue !== '') {
                gCellTitle = ' title="' + cellValue + '"';
                cellValue = '<span class="g-cell-content">' + cellValue + '</span>';
            }

            cell = '<div data-column="' + columnNumber + '" class="g-cell-wrap" style="width: ' + column.style.width + '">' +
                '<div class="g-cell' + textAlign + ' cell-status-' + column.status + '"' + gCellTitle + '>' +
                '<div class="g-cell-content-wrap">' +
                cellValue +
                '</div>' +
                '</div>' +
                '</div>';

            result = result + cell

        });

        result = result + '</div>';

        return result;

    };

    module.exports = {
        render: render
    }


}());