/**
 * Created by szhitenev on 07.12.2016.
 */
(function () {

    var evRvCommonHelper = require('./ev-rv-common.helper');

    var icons = {
        'checkIcon': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></svg>',
        'lockIcon': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"></path></svg>',
        'lock2Icon': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path d="M18 20H6V10h12zM12 2.9c1.71 0 3.1 1.39 3.1 3.1v2H9V6l-.002-.008C8.998 4.282 10.29 2.9 12 2.9zM18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z"></path><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></svg>',
        'starIcon': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>',
        'cancelIcon': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"></path></svg>',
        'partiallyVisibleIcon': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path d="M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z"></path><path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>',
        'deletedIcon': '<span class="entity-viewer-table-icon material-icons">delete</span>',
        'disabledIcon': '<span class="entity-viewer-table-icon material-icons">visibility_off</span>',
        'inactiveIcon': '<span class="entity-viewer-table-icon material-icons">pause</span>'
    };

    /* var checkIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></svg>';
    var lockIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"></path></svg>';
    var lock2Icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path d="M18 20H6V10h12zM12 2.9c1.71 0 3.1 1.39 3.1 3.1v2H9V6l-.002-.008C8.998 4.282 10.29 2.9 12 2.9zM18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z"></path><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></svg>';
    var starIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>';
    var cancelIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>';
    var partiallyVisibleIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path d="M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z"></path><path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>';

    var getCheckIcon = function () {
        return checkIcon;
    };

    var getLockIcon = function () {
        return lockIcon
    };

    var getLock2Icon = function () {
        return lock2Icon
    };

    var getStarIcon = function () {
        return starIcon
    };

    var getCancelIcon = function () {
        return cancelIcon;
    };

    var getPartiallyVisibleIcon = function () {
        return partiallyVisibleIcon;
    }; */

    var getIconByKey = function (key) {
        return icons[key] || '';
    }

	/**
	 * Returns HTML for column with row settings buttons.
	 *
	 * @param color {string}
     * @param rowType {string} can be 'object', 'subtotal', 'blankLine'
	 * @returns {string} - HTML for column with row settings
	 */
    var getRowSettings = function (color, rowType) {

    	/* return '<div class="g-row-settings g-row-settings-table gRowSettings">' +
				'<button class="' + classes + '" data-click-action-type="open_row_color_picker">' +
					'<span class="material-icons label-icon">' + icon + '</span>' +
					'<span class="material-icons arrow-icon">arrow_drop_down</span>' +
				'</button>' +
			'</div>'; */

        /* return `<div class="g-row-settings g-row-settings-table gRowSettings">
            <div class="context-menu-btn-wrapper">${contextMenuBtnTemplate}</div>
            <button class="${classes}" data-click-action-type="open_row_color_picker">
                <span class="material-icons label-icon">label_outline</span>
                <span class="material-icons arrow-icon">arrow_drop_down</span>
            </button>
        </div>`; */
		let contextMenuBtn = '';

		if (rowType === 'object' || rowType === 'subtotal') {

			contextMenuBtn =
				`<div class="context-menu-btn-wrapper">
					<button class="context-menu-btn gTableActionBtn" data-click-action-type="open_context_menu">
						<span class="material-icons">more_vert</span>
					</button>
				</div>`;

		} else {
			contextMenuBtn = '<div class="context-menu-btn-wrapper"></div>';
		}

		const icon = ['red', 'yellow', 'green'].includes(color) ? 'label' : 'label_outline';

		/* let rowColorpickerClasses = "g-row-color-picker-btn gTableActionBtn";

		if (buttonClasses) {
			rowColorpickerClasses = rowColorpickerClasses + " " + buttonClasses;
		} */

		const rowColorPicker =
			`<button class="g-row-color-picker-btn gTableActionBtn" data-click-action-type="open_row_color_picker">
				<span class="material-icons label-icon">${icon}</span>
				<span class="material-icons arrow-icon">arrow_drop_down</span>
			</button>`;

		return `<div class="g-row-settings g-row-settings-table gRowSettings">
					${contextMenuBtn}
					${rowColorPicker}
				</div>`;

	};


    var formatRounding = function (value, column) {

        if (column.report_settings) {

            switch (column.report_settings.round_format_id) {
                case 0:
                    return value;
                    break;
                case 1:
                    //return parseInt(value, 10);
                    return parseFloat(value).toFixed(0);
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

            if (parseFloat(value) === 0) {

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

            if (value.toString().indexOf(" ") !== -1) {
                localValue = value.split(" ").join('')
            }

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
                /*if (parts[1]) { // fraction digits
                    parts[1] = parts[1].replace(/(\d{3})(?=\d)/g, "$1 ")
                }*/

                return parts.join(".");

            }

            if (column.report_settings.thousands_separator_format_id === 2) {

                var parts = value.toString().split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "'");

                /*if (parts[1]) { // fraction digits
                    parts[1] = parts[1].replace(/(\d{3})(?=\d)/g, "$1'")
                }*/

                return parts.join(".");

            }

        }

        return value;

    };

    var formatPercentage = function (value, column) {

        var number = value;

        if (column.report_settings) {

            if (column.report_settings.number_multiplier || column.report_settings.number_multiplier === 0) {
                number = parseFloat(number) * column.report_settings.number_multiplier;
            }

            switch (number) {

                case 1:
                case 4:
                    number = (parseFloat(number)).toFixed(0);
                    break;
                case 2:
                case 5:
                    number = (parseFloat(number)).toFixed(1);
                    break;
                case 3:
                    number = (parseFloat(number)).toFixed(2);
                    break;
            }

            /*switch (column.report_settings.percentage_format_id) {

                case 0:
                    return value;
                    break;
                case 1:
                    return (parseFloat(value) * 100).toFixed(0) + '%';
                    break;
                case 2:
                    return (parseFloat(value) * 100).toFixed(1) + '%';
                    break;
                case 3:
                    return (parseFloat(value) * 100).toFixed(2) + '%';
                    break;
                case 4:
                    return (parseFloat(value) * 10000).toFixed(0) + ' bps';
                    break;
                case 5:
                    return (parseFloat(value) * 10000).toFixed(1) + ' bps';
                    break;

            }*/

        }

        return number;

    };


    var formatValue = function (obj, column) {

        var value = obj[column.key];

        if (value === '#Error') {
            return value;
        }

        if (value === null || value === undefined || isNaN(value)) {
            value = '';
        }

        value = formatPercentage(value, column);

        value = formatRounding(value, column);

        value = formatThousandsSeparator(value, column);

        value = formatZero(value, column);

        value = formatNegative(value, column);

        if (column.report_settings) {
            if (column.report_settings.number_prefix) {
                value = column.report_settings.number_prefix + value;
            }

            if (column.report_settings.number_suffix) {
                value = value + column.report_settings.number_suffix;
            }
        }

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

    var isCellWithProxylineFoldButton = function (evDataService, obj, columnNumber) {

    	var flatList = evDataService.getFlatList();

    	for (var i = obj.___flat_list_index - 1; i >= 0; i = i - 1) {

			if (flatList[i].___type === 'object' || flatList[i].___type === 'subtotal') {

				if (flatList[i].___subtotal_type !== 'proxyline') {
					return false;
				}

			}

			if (flatList[i].___level === columnNumber + 1 && flatList[i].___subtotal_type === 'proxyline') {
				return true;
			}

		}

	};

    module.exports = {
        isFirstInWholeChain: isFirstInWholeChain,

        /* getCheckIcon: getCheckIcon,
        getLockIcon: getLockIcon,
        getLock2Icon: getLock2Icon,
        getStarIcon: getStarIcon,
        getCancelIcon: getCancelIcon,
        getPartiallyVisibleIcon: getPartiallyVisibleIcon, */
        getIconByKey: getIconByKey,

		getRowSettings: getRowSettings,

        formatRounding: formatRounding,
        formatNegative: formatNegative,
        formatZero: formatZero,
        formatValue: formatValue,

        isColumnInGroupsList: isColumnInGroupsList,
        isColumnEqualLastGroup: isColumnEqualLastGroup,
        isColumnAfterGroupsList: isColumnAfterGroupsList,

		isCellWithProxylineFoldButton: isCellWithProxylineFoldButton
    }

}());