/**
 * Created by szhitenev on 07.12.2016.
 */
(function () {

    var checkIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></svg>';

    var getCheckIcon = function () {
        return checkIcon;
    };

    var getAreaGroupsBefore = function (evDataService, level) {

        var groups = evDataService.getGroups();

        // console.log('getAreaGroupsBefore.groups', groups);

        var groupsBefore = groups.filter(function (group, index) {
            return index + 1 < level;
        });

        var areaGroupsBefore = [];
        var i;

        // console.log('getAreaGroupsBefore.groupsBefore', groupsBefore);

        for (i = groupsBefore.length - 1; i >= 0; i = i - 1) {

            if (groupsBefore[i].report_settings.subtotal_type === 'line') {
                break;
            }

            if (groupsBefore[i].report_settings.subtotal_type === 'area') {
                areaGroupsBefore.push(i + 1)
            }

        }

        return areaGroupsBefore;

    };

    var noLineGroups = function (evDataService) {

        var groups = evDataService.getGroups();

        var result = true;

        groups.forEach(function (group) {

            if (group.report_settings.subtotal_type === 'line') {
                result = false;
            }

        });

        return result

    };

    var anyLineGroupsBefore = function (evDataService, level) {

        var lineGroupExist = false;
        var groups = evDataService.getGroups();

        var groupsBefore = groups.filter(function (group) {
            return group.___level < level;
        });

        // console.log('anyLineGroupsBefore.level', level);
        // console.log('anyLineGroupsBefore.groupsBefore', groupsBefore);

        groupsBefore.forEach(function (group) {

            if (group.___subtotal_type === 'line') {
                lineGroupExist = true;
            }

        });

        return lineGroupExist;


    };

    var formatRounding = function (value, column) {

        if (column.report_settings) {

            if (column.report_settings.round_format_id === 0) {
                return value
            }

            if (column.report_settings.round_format_id === 1) {
                return parseInt(value, 10);
            }

            if (column.report_settings.round_format_id === 2) {
                return parseFloat(value).toFixed(2);
            }

        }

        return value

    };

    var formatZero = function (value, column) {

        if (column.report_settings) {

            if (value === 0) {

                if (column.report_settings.zero_format_id === 0) {
                    return value
                }

                if (column.report_settings.zero_format_id === 1) {
                    return '-'
                }

                if (column.report_settings.zero_format_id === 2) {
                    return ''
                }

            }

        }

        return value;

    };

    var formatNegative = function (value, column) {

        if (column.report_settings) {


            if (value < 0) {

                if (column.report_settings.negative_format_id === 0) {
                    return value;
                }

                if (column.report_settings.negative_format_id === 1) {

                    value = value + '';

                    value = '(' + value.slice(1, value.length) + ')';

                    return value;
                }


            }

        }

        return value

    };


    var formatThousandsSeparator = function (value, column) {

        if (column.report_settings.thousands_separator_format_id === 0) {
            return value
        }

        if (column.report_settings.thousands_separator_format_id === 1) {

            var parts = value.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            return parts.join(".");

        }

        if (column.report_settings.thousands_separator_format_id === 2) {

            var parts = value.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "'");
            return parts.join(".");

        }

        return value;

    };

    var formatValue = function (obj, column) {

        var value = obj[column.key];

        value = formatRounding(value, column);

        value = formatThousandsSeparator(value, column);

        value = formatZero(value, column);

        value = formatNegative(value, column);

        return value;

    };

    module.exports = {
        getCheckIcon: getCheckIcon,
        noLineGroups: noLineGroups,
        anyLineGroupsBefore: anyLineGroupsBefore,
        getAreaGroupsBefore: getAreaGroupsBefore,
        formatRounding: formatRounding,
        formatNegative: formatNegative,
        formatZero: formatZero,
        formatValue: formatValue
    }

}());