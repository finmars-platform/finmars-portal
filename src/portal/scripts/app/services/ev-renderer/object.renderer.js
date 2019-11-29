(function () {

    var renderHelper = require('../../helpers/render.helper');

    var checkIcon = renderHelper.getCheckIcon();
    var lockIcon = renderHelper.getLockIcon();
    var starIcon = renderHelper.getStarIcon();

    var getIcon = function (obj, currentMember, classList) {

        var result = '';

        if (obj.object_permissions) {

            var hasChange = false;
            var hasManage = false;

            result = lockIcon; // lock

            obj.object_permissions.forEach(function (perm) {

                if (currentMember.groups.indexOf(perm.group) !== -1) {

                    if (perm.permission.indexOf('change_') !== -1) {
                        hasChange = true
                    }

                    if (perm.permission.indexOf('manage_') !== -1) {
                        hasManage = true
                    }

                }

            });

            if (hasChange) {
                result = ''
            }

            if (hasManage) {
                result = starIcon
            }

            if (obj.___is_activated && result !== '') { // Be aware of specific mutation
                classList.push('selected-blue')
            }

        }

        // if (currentMember.is_admin) {
        //     result = starIcon
        // }

        if (obj.___is_activated) {
            result = checkIcon
        }

        return result

    };

    var getValue = function (obj, column) {

        if (obj[column.key]) {

            if (typeof obj[column.key] === 'string') {
                return obj[column.key]
            }

            if (typeof obj[column.key] === 'number') {

                // if (obj[column.key + '_object'] && obj[column.key + '_object'].user_code) {
                //     return obj[column.key + '_object'].user_code;
                // }

                if (obj[column.key + '_object']) {

                    if (obj[column.key + '_object'].name) {

                        return obj[column.key + '_object'].name;

                    } else if (column.key === 'price_download_scheme') {

                        return obj[column.key + '_object'].scheme_name;

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

                    if (item.attribute_type_object.user_code === user_code) {

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

    var render = function (obj, columns, currentMember) {

        var classList = ['g-row'];

        var rowSelection;

        if (obj.___is_activated) {
            classList.push('selected');
        }

        rowSelection = '<div class="g-row-selection">' + getIcon(obj, currentMember, classList) + '</div>';

        if (obj.___is_activated) {
            classList.push('activated');
        }

        var classes = classList.join(' ');

        var result = '<div class="' + classes + '" data-type="object" data-object-id="' + obj.___id + '" data-parent-group-hash-id="' + obj.___parentId + '">';
        var cell;

        result = result + rowSelection;

        columns.forEach(function (column) {

            var cellValue = getValue(obj, column);

            if (cellValue !== '') {
                cellValue = '<span class="g-cell-content">' + cellValue + '</span>'
            }

            cell = '<div class="g-cell-wrap" style="width: ' + column.style.width + '"><div class="g-cell"><div class="g-cell-content-wrap">' + cellValue + '</div></div></div>';

            result = result + cell

        });

        result = result + '</div>';

        return result;

    };

    module.exports = {
        render: render
    }


}());