(function () {

    'use strict';

    var utilsHelper = require('../../helpers/utils.helper');
    var evEvents = require('../../services/entityViewerEvents');
    var evDataHelper = require('../../helpers/ev-data.helper');
    var evRvCommonHelper = require('../../helpers/ev-rv-common.helper');

    var priceHistoryService = require('../../services/priceHistoryService'); // TODO this is temp service here

    var transactionTypeService = require('../../services/transactionTypeService');
    var uiService = require('../../services/uiService');

    var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    var RvScrollManager = require('./rv-scroll.manager');

    var rvScrollManager = new RvScrollManager();

    var calculateTotalHeight = function (evDataService) {

        var count = evDataService.getFlatList().filter(function (item) {

            if (item.___type === 'subtotal' && item.___subtotal_type === 'proxyline') {
                return false;
            }

            return true;

        }).length;

        var rowHeight = evDataService.getRowHeight();

        var extraHeight = 20 * rowHeight;

        return Math.floor(rowHeight * count) + extraHeight;

    };

    var addScrollListener = function (elements, evDataService, evEventService) {

        var offset;
        var rowHeight = evDataService.getRowHeight();
        var viewportElem = elements.viewportElem;
        var contentWrapElem = elements.contentWrapElem;

        var columnBottomRow;

        var scrollYHandler = utilsHelper.throttle(function () {

            // offset = Math.floor(viewportElem.scrollTop / rowHeight);
            // evDataService.setVirtualScrollOffset(offset);
            evDataService.setVirtualScrollOffsetPx(viewportElem.scrollTop);
            evEventService.dispatchEvent(evEvents.UPDATE_PROJECTION);

            calculateScroll(elements, evDataService)


        }, 10);

        var scrollXHandler = function () {

            if (!columnBottomRow) {
                columnBottomRow = contentWrapElem.querySelector('.g-column-bottom-row');
            }

            columnBottomRow.style.left = -viewportElem.scrollLeft + 'px';

        };

        viewportElem.addEventListener('scroll', scrollYHandler);

        viewportElem.addEventListener('scroll', scrollXHandler);

    };

    var getClickData = function (event) {

        var clickData = {};
        var rowElem = event.target.closest('.g-row');

        clickData.isShiftPressed = event.shiftKey;
        clickData.isCtrlPressed = event.ctrlKey;

        if (rowElem) {

            clickData.___type = rowElem.dataset.type;
            clickData.___id = rowElem.dataset.objectId;
            clickData.___parentId = rowElem.dataset.parentGroupHashId;


            if (event.target.classList.contains('ev-fold-button')) {
                clickData.isFoldButtonPressed = true;
            }

            if (rowElem.dataset.subtotalType) {
                clickData.___subtotal_type = rowElem.dataset.subtotalType;
            }

            if (rowElem.dataset.subtotalSubtype) {
                clickData.___subtotal_subtype = rowElem.dataset.subtotalSubtype;
            }

        }

        console.log('clickData', clickData);

        return clickData;

    };

    var foldChildGroups = function (parentGroupId, evDataService) {

        var childrens = evDataHelper.getAllChildrenGroups(parentGroupId, evDataService);

        console.log('foldChildGroups.childrens', childrens);

        var item;

        childrens.forEach(function (children) {

            if (children.___type === 'group') {

                item = evDataService.getData(children.___id);

                if (item) {
                    item.___is_open = false;
                    evDataService.setData(item);
                } else {
                    children.___is_open = false;
                    evDataService.setData(children);
                }


            }

        })

    };

    var handleFoldButtonClick = function (clickData, evDataService, evEventService) {

        var group = evDataService.getData(clickData.___parentId);

        console.log('group', group);

        if (group) { // initialized only first data request

            var groups = evDataService.getGroups();

            // console.log('group.___is_open', group.___is_open);

            console.log('handleFoldButtonClick.group type', groups[group.___level - 1])

            groups[group.___level - 1].report_settings.is_level_folded = null;

            if (group.___is_open) {

                group.___is_open = false;

                evDataService.setData(group);

                // console.log('folld?');

                foldChildGroups(group.___id, evDataService);

            } else {

                group.___is_open = true;

                evDataService.setData(group);

                evDataService.setGroups(groups);

                // evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);

            }

            evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

        }

        // console.log('group', group);

    };

    var handleShiftSelection = function (evDataService, evEventService, clickData) {

        var lastActiveRow = evDataService.getLastActivatedRow();

        console.log('lastActiveRow', lastActiveRow);

        if (!lastActiveRow) {

            if (clickData.___type === 'object') {

                var obj = Object.assign({}, evDataHelper.getObject(clickData.___id, clickData.___parentId, evDataService));

                obj.___is_activated = !obj.___is_activated;
                evDataService.setObject(obj);
                evDataService.setLastActivatedRow(obj);

            } else {

                var parent = Object.assign({}, evDataService.getData(clickData.___parentId));
                var subtotal_type;

                if (clickData.___subtotal_subtype) {
                    subtotal_type = clickData.___subtotal_subtype
                } else {
                    subtotal_type = clickData.___subtotal_type
                }

                if (subtotal_type === 'area') {
                    parent.___is_area_subtotal_activated = !parent.___is_area_subtotal_activated;
                }

                if (subtotal_type === 'line') {
                    parent.___is_line_subtotal_activated = !parent.___is_line_subtotal_activated;
                }

                evDataService.setLastActivatedRow({
                    ___id: clickData.___id,
                    ___parentId: clickData.___parentId
                });

                evDataService.setData(parent);

            }

        } else {

            var list = evDataService.getFlatList();

            var activeObjectIndex;
            var currentObjectIndex;

            var from, to;

            list.forEach(function (item, index) {

                if (item.___id === lastActiveRow.___id) {
                    activeObjectIndex = index;
                }

                if (item.___id === clickData.___id) {
                    currentObjectIndex = index;
                }


            });


            if (currentObjectIndex > activeObjectIndex) {

                from = activeObjectIndex;
                to = currentObjectIndex;

            } else {

                from = currentObjectIndex;
                to = activeObjectIndex;

            }

            var activated_ids = [];

            var activated_area_subtotals = []; // parentIds
            var activated_line_subtotals = []; // parentIds

            list.forEach(function (item, index) {

                if (index >= from && index <= to) {

                    activated_ids.push(item.___id);

                    if (item.___type === 'subtotal') {

                        // console.log('item', item);
                        // console.log('index', index);

                        if (item.___subtotal_subtype) {

                            if (item.___subtotal_subtype === 'area') {
                                activated_area_subtotals.push(item.___parentId)
                            }

                            if (item.___subtotal_subtype === 'line') {
                                activated_line_subtotals.push(item.___parentId)
                            }

                        } else {

                            if (item.___subtotal_type === 'area') {
                                activated_area_subtotals.push(item.___parentId)
                            }

                            if (item.___subtotal_type === 'line') {
                                activated_line_subtotals.push(item.___parentId)
                            }

                        }

                    }

                }

            });

            // console.log('activated_ids', activated_ids);
            // console.log('activated_area_subtotals', activated_area_subtotals);
            // console.log('activated_line_subtotals', activated_line_subtotals);

            // var objects = evDataService.getObjects();

            clearSubtotalActiveState(evDataService);
            clearObjectActiveState(evDataService);
            console.log("select row activated_ids", activated_ids);
            list.forEach(function (object) {

                if (activated_ids.indexOf(object.___id) !== -1) {

                    parent = evDataService.getData(object.___parentId);

                    if (activated_area_subtotals.indexOf(parent.___id) !== -1) {
                        parent.___is_area_subtotal_activated = true;
                    }

                    if (activated_line_subtotals.indexOf(parent.___id) !== -1) {
                        parent.___is_line_subtotal_activated = true;
                    }

                    evDataService.setData(parent);

                    object.___is_activated = true;
                    evDataService.setObject(object);

                }

            });

        }

        evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

    };

    var clearSubtotalActiveState = function (evDataService) {

        var items = evDataService.getDataAsList();

        items.forEach(function (item) {
            item.___is_area_subtotal_activated = false;
            item.___is_line_subtotal_activated = false;
            evDataService.setData(item);
        })

    };

    var clearObjectActiveState = function (evDataService) {

        var objects = evDataService.getObjects();

        objects.forEach(function (item) {
            item.___is_activated = false;
            item.___is_last_selected = false;

            evDataService.setObject(item);

        });

    };

    var handleSubtotalClick = function (clickData, evDataService, evEventService) {

        var parent = Object.assign({}, evDataService.getData(clickData.___parentId));
        //console.log("click group handleSubtotalClick data", clickData, parent);
        var subtotal_type;

        if (!clickData.isCtrlPressed && clickData.isShiftPressed) {

            handleShiftSelection(evDataService, evEventService, clickData);

        } else if (clickData.isCtrlPressed && !clickData.isShiftPressed) {

            if (clickData.___subtotal_subtype) {
                subtotal_type = clickData.___subtotal_subtype
            } else {
                subtotal_type = clickData.___subtotal_type
            }

            if (subtotal_type === 'area') {
                parent.___is_area_subtotal_activated = !parent.___is_area_subtotal_activated;
            }

            if (subtotal_type === 'line') {
                parent.___is_line_subtotal_activated = !parent.___is_line_subtotal_activated;
            }

            evDataService.setLastActivatedRow({
                ___id: clickData.___id,
                ___parentId: clickData.___parentId
            });

            if (!parent.___is_area_subtotal_activated && !parent.___is_line_subtotal_activated) {
                evDataService.setLastActivatedRow(null);
            }

            evDataService.setData(parent);

            evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

        } else if (!clickData.isCtrlPressed && !clickData.isShiftPressed) {

            clearSubtotalActiveState(evDataService);
            clearObjectActiveState(evDataService);

            if (clickData.___subtotal_subtype) {
                subtotal_type = clickData.___subtotal_subtype
            } else {
                subtotal_type = clickData.___subtotal_type
            }

            if (subtotal_type === 'area') {
                parent.___is_area_subtotal_activated = !parent.___is_area_subtotal_activated;
            }

            if (subtotal_type === 'line') {
                parent.___is_line_subtotal_activated = !parent.___is_line_subtotal_activated;
            }

            if (!parent.___is_area_subtotal_activated && !parent.___is_line_subtotal_activated) {

                evDataService.setActiveObject(null);
                evDataService.setLastActivatedRow(null);

            } else if (parent.___level > 0) {

                var groups = evDataService.getGroups();
                var groupsActiveObj = Object.assign({}, parent);

                delete groupsActiveObj.next;
                delete groupsActiveObj.previous;
                delete groupsActiveObj.count;
                delete groupsActiveObj.results;
                delete groupsActiveObj.subtotal;

                var parents = evRvCommonHelper.getParents(clickData.___parentId, evDataService);
                parents.reverse();
                parents.splice(0, 1); // removing root group

                //console.log("click group groups, parents", groups, parents);

                for (var i = 0; i < parents.length; i++) {
                    groupsActiveObj[groups[i].key] = parents[i].___group_name;
                }

                evDataService.setActiveObject(groupsActiveObj);
                evDataService.setLastActivatedRow({
                    ___id: clickData.___id,
                    ___parentId: clickData.___parentId
                });

                evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);

                //console.log("click group set group activeobj", groupsActiveObj);
            }

            evDataService.setData(parent);

            evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

        }


    };

    var handleObjectClick = function (clickData, evDataService, evEventService) {

        // console.log('handleObjectClick.clickData', clickData);

        var obj = Object.assign({}, evDataHelper.getObject(clickData.___id, clickData.___parentId, evDataService));

        if (clickData.isCtrlPressed && !clickData.isShiftPressed) {

            obj.___is_activated = !obj.___is_activated;

            if (!obj.___is_activated) {
                obj.___is_last_selected = false;
            }

            evDataService.setObject(obj);
            evDataService.setLastActivatedRow(obj);

            evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

        } else if (!clickData.isCtrlPressed && clickData.isShiftPressed) {

            handleShiftSelection(evDataService, evEventService, clickData);

        } else if (!clickData.isCtrlPressed && !clickData.isShiftPressed) {

            clearSubtotalActiveState(evDataService);
            clearObjectActiveState(evDataService);

            obj.___is_activated = !obj.___is_activated;
            obj.___is_last_selected = !obj.___is_last_selected;

            evDataService.setObject(obj);

            if (obj.___is_last_selected || obj.___is_activated) {
                obj.___is_activated = true; // in case of click on highlighted by ctrl or shift row

                evDataService.setActiveObject(obj);
                evDataService.setLastActivatedRow(obj);
                evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);

            } else {
                evDataService.setActiveObject(null);
                evDataService.setLastActivatedRow(null);
            }


            evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

        }


    };

    var updateDataFromCellEdit = function (obj, column, evDataService, evEventService) {

        var reportOptions = evDataService.getReportOptions();

        if (column.key === 'instrument_principal_price') {

            priceHistoryService.getList({
                filters: {
                    instrument: obj['instrument.id'],
                    pricing_policy: reportOptions.pricing_policy,
                    date_after: reportOptions.report_date
                }
            }).then(function (data) {

                var item;

                if (data.results.length) {

                    item = data.results[0];

                    item.principal_price = obj[column.key];

                    priceHistoryService.update(item.id, item).then(function (data) {

                        toastNotificationService.success("Price History updated");

                    })

                } else {

                    item = {
                        pricing_policy: reportOptions.pricing_policy,
                        date_after: reportOptions.report_date,
                        instrument: obj['instrument.id'],
                        accrued_price: 0,
                        principal_price: obj[column.key]
                    };

                    priceHistoryService.create(item).then(function (data) {

                        toastNotificationService.success("Price History created");

                    })


                }


            });


        }

        if (column.key === 'instrument_accrued_price') {

            priceHistoryService.getList({
                filters: {
                    instrument: obj['instrument.id'],
                    pricing_policy: reportOptions.pricing_policy,
                    date_after: reportOptions.report_date
                }
            }).then(function (data) {

                var item;

                if (data.results.length) {

                    item = data.results[0];

                    item.accrued_price = obj[column.key];

                    priceHistoryService.update(item.id, item).then(function (data) {

                        toastNotificationService.success("Price History updated");

                    })

                } else {

                    item = {
                        pricing_policy: reportOptions.pricing_policy,
                        date_after: reportOptions.report_date,
                        instrument: obj['instrument.id'],
                        accrued_price: obj[column.key],
                        principal_price: 0
                    };

                    priceHistoryService.create(item).then(function (data) {

                        toastNotificationService.success("Price History created");

                    })


                }


            });


        }


    };

    var handleCellEdit = function (cellElem, clickData, obj, column, columnNumber, evDataService, evEventService) {

        console.log('column', column);

        cellElem.classList.add('g-cell-input');
        cellElem.innerHTML = '<input value="" autofocus>';

        var input = cellElem.querySelector('input');

        input.focus();

        input.value = obj[column.key];

        input.addEventListener('blur', function (event) {

            event.preventDefault();
            event.stopPropagation();

            if (obj[column.key] !== input.value) {

                if (!obj.___modified_cells) {
                    obj.___modified_cells = []
                }

                obj.___modified_cells.push({
                    oldValue: obj[column.key],
                    newValue: input.value,
                    columnNumber: columnNumber,
                    column: column
                });
            }

            obj[column.key] = input.value;
            evDataService.setObject(obj);

            updateDataFromCellEdit(obj, column, evDataService, evEventService);

            evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

        });

        input.addEventListener("keyup", function (event) {

            if (event.keyCode === 13) {

                event.preventDefault();
                event.stopPropagation();

                if (obj[column.key] !== input.value) {

                    if (!obj.___modified_cells) {
                        obj.___modified_cells = []
                    }

                    obj.___modified_cells.push({
                        oldValue: obj[column.key],
                        newValue: input.value,
                        columnNumber: columnNumber,
                        column: column
                    });
                }

                obj[column.key] = input.value;
                evDataService.setObject(obj);

                updateDataFromCellEdit(obj, column, evDataService, evEventService);

                evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
            }
        });


    };

    var initEventDelegation = function (elem, evDataService, evEventService) {

        elem.addEventListener('click', function (event) {

            var clickData = getClickData(event);

            if (event.detail === 2) { // double click handler

                var cellElem;

                // TODO make recursive get parent of g-cell
                if (event.target.classList.contains('g-cell')) {
                    cellElem = event.target
                } else if (event.target.parentElement.classList.contains('g-cell')) {
                    cellElem = event.target.parentElement;
                } else if (event.target.parentElement.parentElement.classList.contains('g-cell')) {
                    cellElem = event.target.parentElement.parentElement;
                }

                if (cellElem) {

                    var obj = Object.assign({}, evDataHelper.getObject(clickData.___id, clickData.___parentId, evDataService));
                    var columns = evDataService.getColumns();
                    console.log('obj', obj);

                    var columnNumber = parseInt(cellElem.dataset.column, 10);

                    var column = columns[columnNumber - 1];

                    console.log('clickData', clickData);

                    if (['instrument_principal_price', 'instrument_accrued_price'].indexOf(column.key) !== -1) {

                        handleCellEdit(cellElem, clickData, obj, column, columnNumber, evDataService, evEventService)

                    }

                }

            } else if (event.detail === 1) {

                if (clickData.isFoldButtonPressed) {

                    handleFoldButtonClick(clickData, evDataService, evEventService);

                } else {

                    var selection = window.getSelection().toString();

                    console.log('selection', selection);

                    if (!selection.length) {

                        switch (clickData.___type) {

                            case 'object':
                                handleObjectClick(clickData, evDataService, evEventService);
                                break;

                            case 'subtotal':
                                handleSubtotalClick(clickData, evDataService, evEventService);
                                break;
                        }

                    }

                }

            }


        })

    };

    var calculatePaddingTop = function (evDataService) {

        return evDataService.getVirtualScrollOffsetPx();

    };

    var calculateContentWrapHeight = function (rootWrapElem, contentWrapElement, evDataService) { // Works only for contentWrap that is not from split panel

        var splitPanelIsActive = evDataService.isSplitPanelActive();

        if (splitPanelIsActive) {
            var interfaceLayout = evDataService.getInterfaceLayout();
            //var contentWrapElementHeight = document.body.clientHeight - interfaceLayout.headerToolbar.height - interfaceLayout.splitPanel.height;
            var rootWrapElemHeight = rootWrapElem.clientHeight;
            var contentWrapElementHeight = rootWrapElemHeight - interfaceLayout.splitPanel.height;

            contentWrapElement.style.height = contentWrapElementHeight + "px";
        } else {
            contentWrapElement.style.height = "";
        }

    };

    var calculateScroll = function (elements, evDataService) {

        rvScrollManager.setViewportElem(elements.viewportElem);
        rvScrollManager.setContentElem(elements.contentElem);
        rvScrollManager.setContentWrapElem(elements.contentWrapElem);
        rvScrollManager.setRootWrapElem(elements.rootWrapElem);

        var isRootEntityViewer = evDataService.isRootEntityViewer();
        var viewContext = evDataService.getViewContext();

        var interfaceLayout = evDataService.getInterfaceLayout();
        var components = evDataService.getComponents();

        var contentWrapElemHeight = rvScrollManager.getContentWrapElemHeight();
        var contentWrapElemWidth = rvScrollManager.getContentWrapElemWidth();


        var viewportTop;
        var viewportWidth;

        var viewportHeight;

        // console.log('calculateScroll components', components);
        // console.log('calculateScroll contentWrapElemWidth', contentWrapElemWidth);

        if (components.sidebar) {
            viewportWidth = contentWrapElemWidth - interfaceLayout.filterArea.width;
        } else {
            viewportWidth = contentWrapElemWidth;
        }

        // console.log('viewportWidth', viewportWidth);

        viewportTop = interfaceLayout.progressBar.height;

        if (components.columnArea) {
            viewportTop = viewportTop + interfaceLayout.columnArea.height
        }

        if (components.groupingArea) {
            viewportTop = viewportTop + interfaceLayout.groupingArea.height;
        }

        viewportHeight = Math.floor(contentWrapElemHeight - viewportTop);

        // console.log('calculateScroll.viewportHeight', viewportHeight);
        // console.log('calculateScroll.viewportWidth', viewportWidth);

        rvScrollManager.setViewportHeight(viewportHeight);
        if (viewportWidth) {
            rvScrollManager.setViewportWidth(viewportWidth);
        }

        var paddingTop = calculatePaddingTop(evDataService);
        //var totalHeight = calculateTotalHeight(evDataService);

        //rvScrollManager.setRootEntityContentWrapElemHeight(viewportHeight);
        rvScrollManager.setContentElemPaddingTop(paddingTop);

        // there is another method that calculates contentElemWidth resizeScrollableArea() form gColumnResizerComponent.js
        var areaWidth = 0;
        var i;
        var columnMargins = 16;
        var dropNewFieldWidth = 400;
        if (viewContext === 'dashboard') {
            dropNewFieldWidth = 105;
        }

        var columns = evDataService.getColumns();

        for (i = 0; i < columns.length; i = i + 1) {

            var columnWidth = parseInt(columns[i].style.width.split('px')[0], 10);

            areaWidth = areaWidth + columnWidth + columnMargins;
        }

        var resultWidth = areaWidth + dropNewFieldWidth;

        if (resultWidth > contentWrapElemWidth) {
            rvScrollManager.setContentElemWidth(resultWidth);
        }

        // console.log('resultWidth', resultWidth);

    };

    // var calculateScroll = function (elements, evDataService) {
    //
    //     rvScrollManager.setViewportElem(elements.viewportElem);
    //     rvScrollManager.setContentElem(elements.contentElem);
    //     rvScrollManager.setContentWrapElem(elements.contentWrapElem);
    //
    //     var isRootEntityViewer = evDataService.isRootEntityViewer();
    //
    //     var interfaceLayout = evDataService.getInterfaceLayout();
    //
    //     var contentWrapElemHeight = rvScrollManager.getContentWrapElemHeight();
    //
    //     var viewportTop = interfaceLayout.headerToolbar.height + interfaceLayout.groupingArea.height + interfaceLayout.columnArea.height + interfaceLayout.progressBar.height;
    //     var viewportWidth = document.body.clientWidth - interfaceLayout.sidebar.width - interfaceLayout.filterArea.width;
    //
    //     var viewportHeight;
    //
    //     if (isRootEntityViewer) {
    //
    //         viewportHeight = Math.floor(document.body.clientHeight - viewportTop - interfaceLayout.splitPanel.height);
    //
    //     } else {
    //
    //         viewportTop = interfaceLayout.groupingArea.height + interfaceLayout.columnArea.height + interfaceLayout.progressBar.height;
    //         viewportHeight = Math.floor(contentWrapElemHeight - viewportTop);
    //
    //     };
    //
    //     // console.log('calculateScroll.viewportHeight', viewportHeight);
    //     // console.log('calculateScroll.viewportWidth', viewportWidth);
    //
    //     rvScrollManager.setViewportHeight(viewportHeight);
    //     if (viewportWidth) {
    //         rvScrollManager.setViewportWidth(viewportWidth);
    //     }
    //
    //     var paddingTop = calculatePaddingTop(evDataService);
    //     var totalHeight = calculateTotalHeight(evDataService);
    //
    //     rvScrollManager.setContentElemHeight(totalHeight);
    //     rvScrollManager.setContentElemPaddingTop(paddingTop);
    //
    // };


    var clearDropdowns = function () {

        var dropdowns = document.querySelectorAll('.ev-dropdown');

        for (var i = 0; i < dropdowns.length; i = i + 1) {
            dropdowns[i].remove();
        }

    };

    /*var getTransactionTypesMenu = function (ttypes, objectId, parentGroupHashId) {

        var result = '';

        result = result + '<div class="ev-dropdown-option ev-dropdown-menu-holder"><div class="ev-dropdown-submenu">';

        result = result + '<div class="ev-dropdown-option" ' +
            ' data-ev-dropdown-action="book_transaction"' +
            ' data-object-id="' + objectId + '"' +
            ' data-parent-group-hash-id="' + parentGroupHashId + '">Open Booking Manager </div>';

        ttypes.forEach(function (item) {

            result = result + '<div class="ev-dropdown-option" ' +
                ' data-ev-dropdown-action="book_transaction_specific"' +
                ' data-ev-dropdown-action-data-id="' + item.id + '"' +
                ' data-object-id="' + objectId + '"' +
                ' data-parent-group-hash-id="' + parentGroupHashId + '">' + item.name + '</div>';

        });

        result = result + '</div></div>';

        console.log('getTransactionTypesMenu result', result);

        return result

    };*/

    var checkContextMenuOptionVisibility = function (obj, option) {

        if (obj['instrument.id'] && option.action === 'edit_instrument') {
            return true;
        }

        if (obj['account.id'] && option.action === 'edit_account') {
            return true;
        }

        if (obj['portfolio.id'] && option.action === 'edit_portfolio') {
            return true;
        }

        if (obj['instrument.id'] && option.action === 'edit_price') {
            return true;
        }

        if (obj['currency.id'] && option.action === 'edit_fx_rate') {
            return true;
        }

        if (obj['item_type'] === 1 && obj['instrument.pricing_currency.id'] && option.action === 'edit_pricing_currency') { // item_type = 1 - instrument
            return true;
        }

        if (obj['item_type'] === 1 && obj['instrument.accrued_currency.id'] && option.action === 'edit_accrued_currency') { // item_type = 1 - instrument
            return true;
        }


        if (obj['item_type'] === 1 && option.action === 'edit_pricing_currency_price') { // item_type = 1 - instrument
            return true;
        }

        if (obj['item_type'] === 1 && option.action === 'edit_accrued_currency_fx_rate') { // item_type = 1 - instrument
            return true;
        }

        if (obj['item_type'] === 2 && option.action === 'edit_currency') { // item_type = 2 - currency
            return true;
        }

        if (option.action === 'book_transaction_specific') {
            return true;
        }

        if (option.action === 'book_transaction') {
            return true;
        }

        if (obj['complex_transaction.id'] && option.action === 'rebook_transaction') {
            return true;
        }

        if (option.action === 'open_layout') {
            return true;
        }

        if (option.action === 'mark_row') {
            return true;
        }

        return false;
    };

    var getContextMenuTtypeId = function (ttypes, option) {

        var result = null;

        console.log('option.action_data', option.action_data);
        console.log('option.ttypes', ttypes);

        for (var i = 0; i < ttypes.length; i++) {

            if (ttypes[i].user_code === option.action_data) {
                result = ttypes[i].id;
                break;
            }
        }

        console.log('option.result', result);

        return result

    };

    var getContextMenuActionLink = function (evDataService, option, obj) {

        var result = '';

        console.log('getContextMenuActionLink.option', option);

        var urlMap = {

            'reports.balancereport': 'reports/balance',
            'reports.plreport': 'reports/profit-and-lost',
            'reports.transactionreport': 'reports/transaction',

            'portfolios.portfolio': 'data/portfolios',
            'accounts.account': 'data/accounts',
            'accounts.accounttype': 'data/account-types',
            'counterparties.counterparty': 'data/counterparty',
            'counterparties.responsible': 'data/responsibles',
            'instruments.instrument': 'data/instruments',
            'instruments.instrumenttype': 'data/instrument-types',
            'instruments.pricingpolicy': 'data/pricing-policy',
            'currencies.currency': 'data/currency',
            'strategies.strategy1': 'data/strategy/1',
            'strategies.strategy2': 'data/strategy/3',
            'strategies.strategy3': 'data/strategy/3',
            'transactions.complextransaction': 'data/complex-transactions',
            'transactions.transactiontype': 'data/transaction-types',
        };

        result = window.location.href.split("#!")[0];

        result = result + '#!/';
        result = result + urlMap[option.action_data.content_type];
        result = result + '?layout=' + option.action_data.name;


        if (obj) {
            Object.keys(obj).forEach(function (key) {

                var propType = typeof obj[key];

                if (['string', 'number', 'boolean'].indexOf(propType) !== -1) {
                    result = result + '&' + key + '=' + encodeURI(obj[key]);
                }

            });
        }

        return result


    };

    var composeContextMenuItem = function (result, item, evDataService, ttypes, obj, objectId, parentGroupHashId) {

        if (checkContextMenuOptionVisibility(obj, item)) {

            var ttype_specific_attr = '';
            var additional_text = '';
            var is_disabled = '';

            if (item.action === 'book_transaction_specific') {

                item.id = getContextMenuTtypeId(ttypes, item);

                if (item.id) {
                    ttype_specific_attr = ' data-ev-dropdown-action-data-id="' + item.id + '"'
                } else {
                    additional_text = ' (Not Found)';
                    is_disabled = 'disabled-btn';
                }

            }

            if (item.action === 'mark_row') {
                ttype_specific_attr = ' data-ev-dropdown-action-data-color="' + item.action_data + '"'
            }

            if (item.action === 'open_layout') {

                result = result +
                    '<div class="ev-dropdown-option' + (item.items ? ' ev-dropdown-menu-holder' : '') + '">' +
                    '<a href="' + getContextMenuActionLink(evDataService, item, obj) + '"' +
                    ' target="_blank"' +
                    ' data-ev-dropdown-action="' + item.action + '"' +
                    ' data-object-id="' + objectId + '"' +
                    ' data-parent-group-hash-id="' + parentGroupHashId + '">' +
                    '<span>' + item.name + '</span>' +
                    '</a>';

                if (item.items && item.items.length) {

                    result = result + generateContextMenuItems(item, evDataService, ttypes, obj, objectId, parentGroupHashId)

                }

                result = result + '</div>';

            } else {

                result = result + '<div class="ev-dropdown-option ' + is_disabled + (item.items ? ' ev-dropdown-menu-holder' : '') + '"' +
                    ' data-ev-dropdown-action="' + item.action + '"' +

                    ttype_specific_attr +

                    ' data-object-id="' + objectId + '"' +
                    ' data-parent-group-hash-id="' + parentGroupHashId + '">' + item.name + additional_text;

                if (item.items && item.items.length) {

                    result = result + generateContextMenuItems(item, evDataService, ttypes, obj, objectId, parentGroupHashId)

                }

                result = result + '</div>';

            }


        }

        return result;
    };

    var generateContextMenuItems = function (parentOption, evDataService, ttypes, obj, objectId, parentGroupHashId) {

        var result = '<div class="ev-dropdown-submenu">';

        parentOption.items.forEach(function (item) {

            result = composeContextMenuItem(result, item, evDataService, ttypes, obj, objectId, parentGroupHashId);

        });

        result = result + '</div>';

        return result

    };

    var generateContextMenu = function (evDataService, menu, ttypes, obj, objectId, parentGroupHashId) {

        var result = '<div>';

        menu.root.items.forEach(function (item) {
            result = composeContextMenuItem(result, item, evDataService, ttypes, obj, objectId, parentGroupHashId);
        });

        result = result + '</div>';

        return result;

    };

    var addEventListenerForContextMenu = function (contextMenuElem, evDataService, evEventService) {

        function sendContextMenuActionToActiveObj(event) {

            var objectId = event.target.dataset.objectId;
            var parentGroupHashId = event.target.dataset.parentGroupHashId;
            var dropdownAction = event.target.dataset.evDropdownAction;

            var dropdownActionData = {};

            if (event.target.dataset.hasOwnProperty('evDropdownActionDataId')) {
                dropdownActionData.id = event.target.dataset.evDropdownActionDataId
            }

            if (dropdownAction === 'mark_row') {

                var color = event.target.dataset.evDropdownActionDataColor;

                if (objectId && color && parentGroupHashId) {

                    var obj = evDataHelper.getObject(objectId, parentGroupHashId, evDataService);

                    var markedReportRows = localStorage.getItem("marked_report_rows");

                    if (markedReportRows) {
                        markedReportRows = JSON.parse(markedReportRows);
                    } else {
                        markedReportRows = {};
                    }

                    if (color === 'undo_mark_row') {
                        delete markedReportRows[obj.id]
                    } else {
                        markedReportRows[obj.id] = {
                            color: color
                        };
                    }

                    localStorage.setItem("marked_report_rows", JSON.stringify(markedReportRows));

                    evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                }

                clearDropdowns();

            } else {

                if (objectId && dropdownAction && parentGroupHashId) {

                    var obj = evDataHelper.getObject(objectId, parentGroupHashId, evDataService);

                    if (!obj) {
                        obj = {}
                    }

                    obj.event = event;

                    evDataService.setActiveObject(obj);
                    evDataService.setActiveObjectAction(dropdownAction);
                    evDataService.setActiveObjectActionData(dropdownActionData);

                    evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);

                    clearDropdowns();

                }
            }

            if (!event.target.classList.contains('ev-dropdown-option')) {
                clearDropdowns();
            }



        }

        window.addEventListener('click', sendContextMenuActionToActiveObj, {once: true});

    };

    var createPopupMenu = function (objectId, contextMenu, ttypes, parentGroupHashId, evDataService, evEventService, menuPosition) {

        clearDropdowns();

        var popup = document.createElement('div');

        clearObjectActiveState(evDataService);

        var obj = evDataHelper.getObject(objectId, parentGroupHashId, evDataService);

        obj.___is_activated = true;
        obj.___is_last_selected = true;

        evDataService.setObject(obj);

        popup.id = 'dropdown-' + objectId;
        popup.classList.add('ev-dropdown');

        popup.innerHTML = generateContextMenu(evDataService, contextMenu, ttypes, obj, objectId, parentGroupHashId);

        popup.style.cssText = menuPosition;
        popup.style.position = 'absolute';

        document.body.appendChild(popup);

        evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

        addEventListenerForContextMenu(popup, evDataService, evEventService);

    };

    var getAllTTypes = function () {

        return new Promise(function (resolve, reject) {

            var ttypes = [];
            var options = {
                pageSize: 1000,
                page: 1
            };

            var getTTypePage = function () {

                transactionTypeService.getListLight(options).then(function (data) {

                    ttypes = ttypes.concat(data.results);

                    if (data.next) {

                        options.page += 1;
                        getTTypePage();

                    } else {

                        resolve(ttypes);

                    }

                }).catch(function (error) {
                    reject(error);
                });
            }

            getTTypePage();

        });

    }

    var initContextMenuEventDelegation = function (elem, evDataService, evEventService) {

        var contextMenu = {};
        var ttypes = null;


        /*transactionTypeService.getListLight({pageSize: 1000}).then(function (data) {

            uiService.getContextMenuLayoutList().then(function (contextMenuData) {

                //var contextMenu = {};

                if (contextMenuData.results.length) {

                    var contextMenuLayout = contextMenuData.results[0];
                    contextMenu = contextMenuLayout.data.menu

                } else {
                    contextMenu = {
                        root: {
                            items: [
                                {
                                    name: 'Edit Instrument',
                                    action: 'edit_instrument'
                                },
                                {
                                    name: 'Edit Account',
                                    action: 'edit_account'
                                },
                                {
                                    name: 'Edit Portfolio',
                                    action: 'edit_portfolio'
                                },
                                {
                                    name: 'Edit Price',
                                    action: 'edit_price'
                                },
                                {
                                    name: 'Edit FX Rate',
                                    action: 'edit_fx_rate'
                                },
                                {
                                    name: 'Edit Pricing FX Rate',
                                    action: 'edit_pricing_currency'
                                },
                                {
                                    name: 'Edit Accrued FX Rate',
                                    action: 'edit_accrued_currency'
                                },
                                {
                                    name: 'Edit Currency',
                                    action: 'edit_currency'
                                },
                                {
                                    name: 'Open Book Manager',
                                    action: 'book_transaction'
                                }
                            ]
                        }
                    };
                }

                //var ttypes = data.results;
                ttypes = data.results;

                elem.addEventListener('contextmenu', function (ev) {

                    var objectId;
                    var parentGroupHashId;

                    if (event.target.offsetParent.classList.contains('ev-viewport')) {

                        objectId = event.target.dataset.objectId;
                        parentGroupHashId = event.target.dataset.parentGroupHashId;

                    } else {

                        if (event.target.offsetParent.classList.contains('g-row')) {

                            objectId = event.target.offsetParent.dataset.objectId;
                            parentGroupHashId = event.target.offsetParent.dataset.parentGroupHashId;

                        }

                    }

                    console.log('initContextMenuEventDelegation.event', event);

                    console.log('initContextMenuEventDelegation.objectId', objectId);

                    if (objectId) {

                        ev.preventDefault();
                        ev.stopPropagation();

                        var contextMenuPosition = 'top: ' + ev.pageY + 'px; ' + 'left: ' + ev.pageX + 'px';

                        createPopupMenu(objectId, contextMenu, ttypes, parentGroupHashId, evDataService, evEventService, contextMenuPosition);

                        return false;

                    }

                }, false);

                window.addEventListener('contextmenu', function () {
                    clearDropdowns();
                });

                /!*window.addEventListener('click', function (event) {

                    if (!event.target.classList.contains('viewer-table-toggle-contextmenu-btn')) {

                        var objectId = event.target.dataset.objectId;
                        var parentGroupHashId = event.target.dataset.parentGroupHashId;
                        var dropdownAction = event.target.dataset.evDropdownAction;

                        var dropdownActionData = {};

                        console.log('event.target.dataset', event.target.dataset);

                        if (event.target.dataset.hasOwnProperty('evDropdownActionDataId')) {
                            dropdownActionData.id = event.target.dataset.evDropdownActionDataId
                        }

                        if (objectId && dropdownAction && parentGroupHashId) {

                            var obj = evDataHelper.getObject(objectId, parentGroupHashId, evDataService);

                            if (!obj) {
                                obj = {}
                            }

                            obj.event = event;

                            console.log('dropdownActionData', dropdownActionData);

                            evDataService.setActiveObject(obj);
                            evDataService.setActiveObjectAction(dropdownAction);
                            evDataService.setActiveObjectActionData(dropdownActionData);

                            evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);

                            clearDropdowns();

                        } else {

                            if (!event.target.classList.contains('ev-dropdown-option')) {
                                clearDropdowns();
                            }

                        }

                    }


                });*!/

            });

        });*/

        getAllTTypes().then(function (data) {

            uiService.getContextMenuLayoutList().then(function (contextMenuData) {

                //var contextMenu = {};

                if (contextMenuData.results.length) {

                    var contextMenuLayout = contextMenuData.results[0];
                    contextMenu = contextMenuLayout.data.menu

                } else {
                    contextMenu = {
                        root: {
                            items: [
                                {
                                    name: 'Edit Instrument',
                                    action: 'edit_instrument'
                                },
                                {
                                    name: 'Edit Account',
                                    action: 'edit_account'
                                },
                                {
                                    name: 'Edit Portfolio',
                                    action: 'edit_portfolio'
                                },
                                {
                                    name: 'Edit Price',
                                    action: 'edit_price'
                                },
                                {
                                    name: 'Edit FX Rate',
                                    action: 'edit_fx_rate'
                                },
                                {
                                    name: 'Edit Pricing FX Rate',
                                    action: 'edit_pricing_currency'
                                },
                                {
                                    name: 'Edit Accrued FX Rate',
                                    action: 'edit_accrued_currency'
                                },
                                {
                                    name: 'Edit Currency',
                                    action: 'edit_currency'
                                },
                                {
                                    name: 'Open Book Manager',
                                    action: 'book_transaction'
                                }
                            ]
                        }
                    };
                }

                ttypes = data;

                elem.addEventListener('contextmenu', function (ev) {

                    var objectId;
                    var parentGroupHashId;

                    if (event.target.offsetParent.classList.contains('ev-viewport')) {

                        objectId = event.target.dataset.objectId;
                        parentGroupHashId = event.target.dataset.parentGroupHashId;

                    } else {

                        if (event.target.offsetParent.classList.contains('g-row')) {

                            objectId = event.target.offsetParent.dataset.objectId;
                            parentGroupHashId = event.target.offsetParent.dataset.parentGroupHashId;

                        }

                    }

                    console.log('initContextMenuEventDelegation.event', event);

                    console.log('initContextMenuEventDelegation.objectId', objectId);

                    if (objectId) {

                        ev.preventDefault();
                        ev.stopPropagation();

                        var contextMenuPosition = 'top: ' + ev.pageY + 'px; ' + 'left: ' + ev.pageX + 'px';

                        createPopupMenu(objectId, contextMenu, ttypes, parentGroupHashId, evDataService, evEventService, contextMenuPosition);

                        return false;

                    }

                }, false);

                window.addEventListener('contextmenu', function () {
                    clearDropdowns();
                });

                /*window.addEventListener('click', function (event) {

                    if (!event.target.classList.contains('viewer-table-toggle-contextmenu-btn')) {

                        var objectId = event.target.dataset.objectId;
                        var parentGroupHashId = event.target.dataset.parentGroupHashId;
                        var dropdownAction = event.target.dataset.evDropdownAction;

                        var dropdownActionData = {};

                        console.log('event.target.dataset', event.target.dataset);

                        if (event.target.dataset.hasOwnProperty('evDropdownActionDataId')) {
                            dropdownActionData.id = event.target.dataset.evDropdownActionDataId
                        }

                        if (objectId && dropdownAction && parentGroupHashId) {

                            var obj = evDataHelper.getObject(objectId, parentGroupHashId, evDataService);

                            if (!obj) {
                                obj = {}
                            }

                            obj.event = event;

                            console.log('dropdownActionData', dropdownActionData);

                            evDataService.setActiveObject(obj);
                            evDataService.setActiveObjectAction(dropdownAction);
                            evDataService.setActiveObjectActionData(dropdownActionData);

                            evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);

                            clearDropdowns();

                        } else {

                            if (!event.target.classList.contains('ev-dropdown-option')) {
                                clearDropdowns();
                            }

                        }

                    }


                });*/

            });
        })

    };


    module.exports = {
        initEventDelegation: initEventDelegation,
        addScrollListener: addScrollListener,
        createPopupMenu: createPopupMenu,
        initContextMenuEventDelegation: initContextMenuEventDelegation,
        calculateTotalHeight: calculateTotalHeight,
        calculateContentWrapHeight: calculateContentWrapHeight,
        calculateScroll: calculateScroll
    }


}());