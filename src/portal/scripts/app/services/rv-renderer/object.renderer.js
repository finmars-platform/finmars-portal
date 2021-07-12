/**
 * Report Viewer Object Renderer.
 * @module ReportViewerRendererObjectRenderer
 */

(function () {

    var renderHelper = require('../../helpers/render.helper');
    var rvHelper = require('../../helpers/rv.helper');
	var stringHelper = require('../../helpers/stringHelper');

    var evRvCommonHelper = require('../../helpers/ev-rv-common.helper');

    var checkIcon = renderHelper.getIconByKey('checkIcon');
    var REPORT_BG_CSS_SELECTOR = 'report-bg-level';


    /**
     * Get Dynamic attribute value
     * @return {Object} Return html_result and number result (optional)
     * @memberof module:ReportViewerRendererObjectRenderer
     */
    var getDynamicAttributeValue = function (obj, column) {

        var result = {
            'html_result': '',
            'numeric_result': null,
            'raw_text_result': ''
        };

        if (column.id && obj[column.entity + '_object']) {

            obj[column.entity + '_object'].attributes.forEach(function (item) {

                if (item.attribute_type === column.id) {

                    if (column.value_type === 20 && item.value_float) {

                        result.html_result = item.value_float.toString();
                        result.numeric_result = item.value_float;
                        result.raw_text_result = item.value_float.toString();

                    }

                    else if (column.value_type === 10 && item.value_string) {

                        result.html_result = stringHelper.parseAndInsertHyperlinks(item.value_string, "class='openLinkInNewTab'");
                        result.raw_text_result = item.value_string;

                    }

                    else if (column.value_type === 30 && item.classifier_object) {

                        result.html_result = item.classifier_object.name;
                        result.raw_text_result = item.classifier_object.name;
                    }

                    else if (column.value_type === 40 && item.value_date) {

                        result.html_result = item.value_date;
                        result.raw_text_result = item.value_date;

                    }
                }

            });

        }


        return result;

    };

    /**
     * Get Entity attribute value
     * @return {Object} Return html_result and number result (optional)
     * @memberof module:ReportViewerRendererObjectRenderer
     */
    var getEntityAttributeValue = function (obj, column) {

        var result = {
            'html_result': '',
            'numeric_result': null,
            'raw_text_result': ''
        };

        if (typeof obj[column.key] === 'string') {

			result.html_result = stringHelper.parseAndInsertHyperlinks(obj[column.key], "class='openLinkInNewTab'");
            result.raw_text_result = obj[column.key];

        } else {

            // Works only for 1 level entities
            // Example:
            // For instrument_object.instrument_type_object.name it won't work

            if (typeof obj[column.key] === 'number') {

                if (obj[column.key + '_object'] && obj[column.key + '_object'].name) {

                    result.html_result = stringHelper.parseAndInsertHyperlinks(
                    	obj[column.key + '_object'].name,
						"class='openLinkInNewTab'"
					);

                    result.raw_text_result = obj[column.key + '_object'].name;

                } else {

                    result.html_result = renderHelper.formatValue(obj, column);
                    result.numeric_result = obj[column.key];
                    result.raw_text_result = renderHelper.formatValue(obj, column);

                }

            } else {

                if (Array.isArray(obj[column.key])) {

                    result.html_result = '[' + obj[column.key].length + ']';
                    result.raw_text_result = '[' + obj[column.key].length + ']';

                }

            }

        }

        return result;

    };

    var handleColumnInGroupList = function (evDataService, obj, column, columnNumber) {

        var result = {
            html_result: '',
            numeric_result: null,
            raw_text_result: ''
        };

        var groups = evDataService.getGroups();
        // var reportOptions = evDataService.getReportOptions();

        var proxylineIsActive = function () {

        	/*if (reportOptions.subtotals_options) {
        		return reportOptions.subtotals_options.type === 'area';

			} else { // for old layouts
        		return groups[columnNumber - 1].report_settings.subtotal_type === 'area';
			}*/
			return groups[columnNumber - 1].report_settings.subtotal_type === 'area';

		};

        if (proxylineIsActive()) {

            var flatList = evDataService.getFlatList();
            var proxyLineSubtotal;

            var skip = false;

            for (var i = obj.___flat_list_index - 1; i >= 0; i = i - 1) {

                if (flatList[i].___type === 'object' || flatList[i].___type === 'subtotal') {

                    if (flatList[i].___subtotal_type !== 'proxyline') {

                        skip = true;
                        break;

                    }

                }

                if (flatList[i].___level === columnNumber + 1 && flatList[i].___subtotal_type === 'proxyline') {

                    proxyLineSubtotal = flatList[i];
                    break;

                }


            }

            if (skip === false) {

                var currentGroup = evDataService.getData(proxyLineSubtotal.___parentId);
                var parentGroup = evDataService.getData(currentGroup.___parentId);

                if (parentGroup.___is_open) {

					var foldButtonSign = currentGroup.___is_open ? '-': '+';

					var foldButton = '<div class="g-group-fold-button"><div class="ev-fold-button" data-type="foldbutton" data-object-id="' + currentGroup.___id + '" data-parent-group-hash-id="' + currentGroup.___parentId + '">' + foldButtonSign + '</div></div>';

					var groupName = currentGroup.___group_name;

					if (groupName && typeof groupName === 'string') {

						groupName = stringHelper.parseAndInsertHyperlinks(groupName, "class='openLinkInNewTab'");

					}

                    result.html_result = foldButton + '<span class="text-bold">' + groupName + '</span>';
                    result.raw_text_result = currentGroup.___group_name;

                }
            }

        }

        return result;

    };

    var getValue = function (evDataService, obj, column, columnNumber, groups) {

        var result = {
            html_result: '',
            numeric_result: null,
            raw_text_result: ''
        };


        if (renderHelper.isColumnInGroupsList(columnNumber, groups)) {

            result = handleColumnInGroupList(evDataService, obj, column, columnNumber);

        }

        if (renderHelper.isColumnAfterGroupsList(columnNumber, groups)) {

            var parent = evDataService.getData(obj.___parentId);

            if (parent.___is_open) {

                if (obj[column.key]) {
                    result = getEntityAttributeValue(obj, column);

                } else {
                    result = getDynamicAttributeValue(obj, column);

                }


            } else {

                // if (column.report_settings && !column.report_settings.hide_subtotal) {
				if (column.report_settings) {

                    var subtotal;

                    subtotal = rvHelper.lookUpForSubtotal(evDataService, obj, column, columnNumber);

                    if (obj.hasOwnProperty(column.key)) {

                        var subtotalValue = renderHelper.formatValue(subtotal, column);

                        if (!isNaN(subtotalValue)) {
                            result.html_result = '<span class="text-bold">' + subtotalValue + '</span>';
                            result.raw_text_result = subtotalValue;
                        }

                        result.numeric_result = subtotal[column.key];
                    }

                }

            }

            if (column.status === 'missing') {
                return {
                    html_result: 'Deleted',
                    numeric_result: null,
                    raw_text_result: 'Deleted'
                };
            }


        }

        return result;

    };

    var getBgColor = function (evDataService, obj, columnNumber) {

        var result = '';

        var parents = evRvCommonHelper.getParents(obj.___parentId, evDataService);

        var foldedParents = [];
        var i;

        for (i = 0; i < parents.length; i = i + 1) {

            if (parents[i].___is_open === false) {
                foldedParents.push(parents[i]);
            }

        }

        var firstFoldedParent = foldedParents[foldedParents.length - 1];

        // console.log('firstFoldedParent', firstFoldedParent);

        if (firstFoldedParent && columnNumber >= firstFoldedParent.___level) {
            result = REPORT_BG_CSS_SELECTOR + '-' + (firstFoldedParent.___level);
        }

        return result;

    };

    var getCellTextAlign = function (evDataService, column, columnNumber, groups) {

        var result = '';
        var dashboardCellAlign = evDataService.dashboard.getColumnsTextAlign();

        if (!groups.length || groups.length < columnNumber) { // if column is not grouping column

            if (column.style && column.style.text_align) {

                result = 'text-' + column.style.text_align;

            } else if (dashboardCellAlign) {

                result = 'text-' + dashboardCellAlign;

            } else if (column.value_type === 20) {
                result = 'text-right';
            }

            return result;

        }

    };

    var getBorderBottomTransparent = function (evDataService, obj, columnNumber, groups) {

        var result = '';
        /* var nextItem = null;
        var flatList = evDataService.getFlatList();

        if (flatList.length > obj.___flat_list_index + 1) {
            nextItem = flatList[obj.___flat_list_index + 1]
        } */

        if (columnNumber <= groups.length && columnNumber <= obj.___level) {

            /* Part of group
            if (nextItem && nextItem.___type !== 'subtotal' && nextItem.___level === obj.___level) {
                result = 'border-bottom-transparent';
            } */

            /* if (nextItem && nextItem.___type === 'subtotal' && columnNumber < obj.___level - 1) {
                result = 'border-bottom-transparent';
            } */

            if (obj.___type === 'subtotal' && columnNumber < obj.___level - 1) {
                result = 'border-bottom-transparent';
            }

        }

        return result;

    };

    var getBorderClasses = function (evDataService, obj, columnNumber, groups) {

    	var results = [];

    	var borderBottomTransparent = getBorderBottomTransparent(evDataService, obj, columnNumber, groups);

    	if (borderBottomTransparent) {
			results.push(borderBottomTransparent);
		}



		// grouping columns cells except last
    	if (groups.length && columnNumber < groups.length) {

    		// unless next cell is cell with group name
    		if (!renderHelper.isCellWithProxylineFoldButton(evDataService, obj, columnNumber)) {

    			results.push('border-right-transparent');

			}

		}

    	return results;

	};

    var getColorNegativeNumber = function (val, column) {

        var result = '';

        if (column.report_settings && column.report_settings.negative_color_format_id === 1) {

            if (column.value_type === 20) {

                if (val % 1 === 0) { // check whether number is float or integer
                    if (parseInt(val) < 0) {
                        result = 'negative-red'
                    }
                } else {
                    if (parseFloat(val) < 0) {
                        result = 'negative-red'
                    }
                }
            }
        }

        return result;

    };

    var getCellClasses = function (evDataService, obj, column, columnNumber, groups, valueObj) {

    	var result = [];

		var borderClasses = getBorderClasses(evDataService, obj, columnNumber, groups);

		if (borderClasses.length) {
			result = result.concat(borderClasses);
		}

		var textAlign = getCellTextAlign(evDataService, column, columnNumber, groups);

		if (textAlign) {
			result.push(textAlign);
		}

		if (valueObj.numeric_result !== null && valueObj.numeric_result !== undefined) {

			var colorNegative = getColorNegativeNumber(valueObj.numeric_result, column);

			if (colorNegative) {
				result.push(colorNegative);
			}

		}

		if (column.isHidden) {
			result.push('display-none');
		}

    	return result;

	};

    var isCellModified = function (obj, column, columnIndex) {

        var columnNumber = columnIndex + 1;

        var result = false;

        if (obj.___modified_cells) {

            obj.___modified_cells.forEach(function (item) {

                if (item.columnNumber === columnNumber) {
                    result = true;
                }

            })

        }

        return result

    };

    var render = function (evDataService, obj, markedReportRows) {

        var classList = ['g-row'];

        var columns = evDataService.getColumns();
        var groups = evDataService.getGroups();
        var rowHeight = evDataService.getRowHeight();

        var rowSelection;
		var rowSelectionBtnContent = '';
		var rowSelectionBtnClasses = 'g-row-selection-button';

		if (obj.___is_active_object || obj.___is_activated) {

			var className = obj.___is_active_object ? 'is-active-object': 'selected';
            classList.push(className);

			rowSelectionBtnClasses += ' checked';
			rowSelectionBtnContent = checkIcon;

        }

		if (obj.___context_menu_is_opened) {
			classList.push('context-menu-opened');
		}

		rowSelection = '<div class="g-row-selection"><div class="' + rowSelectionBtnClasses + '">' + rowSelectionBtnContent + '</div></div>';

        let color = 'none';
        if (markedReportRows.hasOwnProperty(obj.id)) {
            color = markedReportRows[obj.id].color
            classList.push('g-row-marked-' + color);
        }

        var rowSettings = renderHelper.getRowSettings(color, obj.___type);

        var classes = classList.join(' ');
        var offsetTop = obj.___flat_list_offset_top_index * rowHeight;

        var result = '<div class="' + classes + '" style="top: '+ offsetTop+'px" data-type="object" data-object-id="' + obj.___id + '" data-parent-group-hash-id="' + obj.___parentId + '">';
        var cell;

        /* var textAlign;
        var colorNegative = '';
        var borderBottomTransparent = ''; */
		var columnNumber;
        var value_obj;
        var gCellTitle = '';
        var resultValue;
        var cellModified = '';

        result = result + rowSelection + rowSettings;

        obj.___cells_values = [];

        columns.forEach(function (column, columnIndex) {

            columnNumber = columnIndex + 1;

            value_obj = getValue(evDataService, obj, column, columnNumber, groups);

            cellModified = isCellModified(obj, column, columnIndex) ? 'g-cell-modified' : ''; // why cell modified is not inside class list

			var cellClassesList = getCellClasses(evDataService, obj, column, columnNumber, groups, value_obj);
			var cellClasses = cellClassesList.join(' ');

            obj.___cells_values.push({
                width: column.style.width,
                classList: cellClassesList,
                value: value_obj.html_result
            });

            resultValue = '';

            if (value_obj.html_result) {
                resultValue = '<span class="g-cell-content">' + value_obj.html_result + '</span>';
            }

            if (value_obj.raw_text_result) {
                gCellTitle = ' title="' + value_obj.raw_text_result + '"'
            }

            cell = '<div data-column="' + columnNumber + '" class="g-cell-wrap ' + getBgColor(evDataService, obj, columnNumber) + '" style="width: ' + column.style.width + '">' +
					'<div class="g-cell ' + cellModified + ' cell-status-' + column.status + ' ' + cellClasses + '"' + gCellTitle + '>' +
						'<div class="g-cell-content-wrap">' +
							resultValue +
						'</div>' +
					'</div>' +
                '</div>';

            result = result + cell;

        });

        evDataService.updateItemInFlatList(obj);

        result = result + '</div>';

        return result;

    };

    module.exports = {
        render: render
    }


}());