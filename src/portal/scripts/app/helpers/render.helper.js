/**
 * Created by szhitenev on 07.12.2016.
 */
(function () {

    var evRvCommonHelper = require('./ev-rv-common.helper');

    var checkIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></svg>';

    var getCheckIcon = function () {
        return checkIcon;
    };


    var formatRounding = function (value, column) {

        if (column.report_settings) {

            switch (column.report_settings.round_format_id) {
                case 0:
                    return value;
                    break;
                case 1:
                    return parseInt(value, 10);
                    break;
                case 2:
                    return parseFloat(value).toFixed(1);
                    break;
                case 3:
                    return parseFloat(value).toFixed(2);
                    break;
                case 4:
                    return parseFloat(value).toFixed(4);
                    break;
            }

            /*if (column.report_settings.round_format_id === 0) {
                return value
            }

            if (column.report_settings.round_format_id === 1) {
                return parseInt(value, 10);
            }

            if (column.report_settings.round_format_id === 3) {
                return parseFloat(value).toFixed(2);
            }*/

        }

        return value

    };

    var formatZero = function (value, column) {

        if (column.report_settings) {

            if (parseInt(value, 10) === 0) {

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

            var localValue = value;

            if (value.toString().indexOf("'") !== -1) {
                localValue = value.split("'").join('')
            }

            if (value.toString().indexOf("%") !== -1) {
                localValue = value.slice(0, value.length - 1);
            }

            if (value.toString().indexOf("bps") !== -1) {
                localValue = value.slice(0, value.length - 3);
            }

            if (localValue < 0) {

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

        if (column.report_settings) {

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

        }

        return value;

    };

    var formatPercentage = function (value, column) {

        if (column.report_settings) {

            switch (column.report_settings.percentage_format_id) {

                case 0:
                    return value;
                    break;
                case 1:
                    return (parseInt(value) * 100) + '%';
                    break;
                case 2:
                    return (parseFloat(value) * 100).toFixed(1) + '%';
                    break;
                case 3:
                    return (parseFloat(value) * 100).toFixed(2) + '%';
                    break;
                case 4:
                    return parseInt(value) * 10000 + ' bps';
                    break;
                case 5:
                    return (parseFloat(value) * 10000).toFixed(1) + ' bps';
                    break;

            }
            ;

        }
        ;

        return value;

    };


    var formatValue = function (obj, column) {

        var value = obj[column.key];

        if (value === null || value === undefined) {
            value = '';
        }

        value = formatPercentage(value, column);

        value = formatRounding(value, column);

        value = formatThousandsSeparator(value, column);

        value = formatZero(value, column);

        value = formatNegative(value, column);


        return value;

    };


    var isFirstInWholeChain = function (evDataService, obj, levelFrom) {

        var result = true;

        var parents = evRvCommonHelper.getParents(obj.___parentId, evDataService);

        var relativeRootParent = parents.find(function (item) {
            return item.___level === levelFrom
        });

        result = _checkChildInWholeChain(evDataService, obj, relativeRootParent, result);

        return result;

    };

    var _checkChildInWholeChain = function (evDataService, obj, relativeRootParent, result) {

        if (obj.___level - relativeRootParent.___level === 1) {

            if (relativeRootParent.results[0].___id === obj.___id) {

                result = true;

            } else {

                result = false;

            }

        } else {

            var firstChild = evDataService.getData(relativeRootParent.results[0].___id);

            var parents = evRvCommonHelper.getParents(obj.___parentId, evDataService);

            var newRelativeParent = parents.find(function (item) {
                return item.___level === relativeRootParent.___level + 1
            });

            if (newRelativeParent.___id === firstChild.___id) {

                if (newRelativeParent !== obj.___level + 1) {
                    result = _checkChildInWholeChain(evDataService, obj, newRelativeParent, result);
                }


            } else {

                result = false;
            }

        }

        return result

    };

    var isColumnInGroupsList = function (columnNumber, groups) {

        return groups.length >= columnNumber;

    };

    var isColumnEqualLastGroup = function (columnNumber, groups) {

        return groups.length === columnNumber

    };

    var isColumnAfterGroupsList = function (columnNumber, groups) {

        return groups.length < columnNumber;

    };

    module.exports = {
        isFirstInWholeChain: isFirstInWholeChain,

        getCheckIcon: getCheckIcon,
        formatRounding: formatRounding,
        formatNegative: formatNegative,
        formatZero: formatZero,
        formatValue: formatValue,

        isColumnInGroupsList: isColumnInGroupsList,
        isColumnEqualLastGroup: isColumnEqualLastGroup,
        isColumnAfterGroupsList: isColumnAfterGroupsList
    }

}());