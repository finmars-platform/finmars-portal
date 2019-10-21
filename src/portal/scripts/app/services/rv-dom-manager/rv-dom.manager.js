(function () {

    'use strict';

    var utilsHelper = require('../../helpers/utils.helper');
    var evEvents = require('../../services/entityViewerEvents');
    var evDataHelper = require('../../helpers/ev-data.helper');

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

        var scrollYHandler = utilsHelper.debounce(function () {

            // offset = Math.floor(viewportElem.scrollTop / rowHeight);
            // evDataService.setVirtualScrollOffset(offset);
            evDataService.setVirtualScrollOffsetPx(viewportElem.scrollTop);
            evEventService.dispatchEvent(evEvents.UPDATE_PROJECTION);

            calculateScroll(elements, evDataService)


        }, 25);

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
                    activeObjectIndex = index
                }

                if (item.___id === clickData.___id) {
                    currentObjectIndex = index
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

            clearSubtotalActiveState(evDataService, evEventService);
            clearObjectActiveState(evDataService, evEventService);

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

    var handleObjectClick = function (clickData, evDataService, evEventService) {

        // console.log('handleObjectClick.clickData', clickData);

        var obj = Object.assign({}, evDataHelper.getObject(clickData.___id, clickData.___parentId, evDataService));
        var count = evDataService.getActiveObjectsCount();


        if (clickData.isCtrlPressed && !clickData.isShiftPressed) {

            obj.___is_activated = !obj.___is_activated;
            evDataService.setObject(obj);

            count = count + 1;

            evDataService.setLastActivatedRow(obj);
            evDataService.setActiveObjectsCount(count);

            // evDataService.setActiveObject(obj);
            // evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);

            evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

        }

        if (clickData.isShiftPressed) {

            handleShiftSelection(evDataService, evEventService, clickData);

        }

        if (!clickData.isCtrlPressed && !clickData.isShiftPressed) {

            clearSubtotalActiveState(evDataService, evEventService);
            clearObjectActiveState(evDataService, evEventService);

            obj.___is_activated = !obj.___is_activated;

            evDataService.setObject(obj);

            if (obj.___is_activated) {
                evDataService.setActiveObject(obj);
                evDataService.setLastActivatedRow(obj);
                evDataService.setActiveObjectsCount(1);
                evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);
            } else {

                evDataService.setActiveObjectsCount(0);
                evDataService.setActiveObject(null);
                evDataService.setLastActivatedRow(null);
            }


            evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

        }


    };

    var clearSubtotalActiveState = function (evDataService, evEventService) {

        var items = evDataService.getDataAsList();

        items.forEach(function (item) {
            item.___is_area_subtotal_activated = false;
            item.___is_line_subtotal_activated = false;
            evDataService.setData(item);
        })

    };

    var clearObjectActiveState = function (evDataService, evEventService) {

        var objects = evDataService.getObjects();

        objects.forEach(function (item) {
            item.___is_activated = false;
            evDataService.setObject(item);
        });

    };

    var handleSubtotalClick = function (clickData, evDataService, evEventService) {

        var parent = Object.assign({}, evDataService.getData(clickData.___parentId));
        var subtotal_type;

        if (clickData.isShiftPressed) {
            handleShiftSelection(evDataService, evEventService, clickData);
        }

        if (clickData.isCtrlPressed && !clickData.isShiftPressed) {

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

        }

        if (!clickData.isCtrlPressed && !clickData.isShiftPressed) {

            clearSubtotalActiveState(evDataService, evEventService);
            clearObjectActiveState(evDataService, evEventService);

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

        }


    };

    var initEventDelegation = function (elem, evDataService, evEventService) {

        elem.addEventListener('click', function (event) {

            var clickData = getClickData(event);

            console.log('clickData', clickData);

            if (clickData.isFoldButtonPressed) {

                handleFoldButtonClick(clickData, evDataService, evEventService);

            } else {

                if (clickData.___type === 'object') {

                    handleObjectClick(clickData, evDataService, evEventService);

                }


                if (clickData.___type === 'subtotal') {

                    handleSubtotalClick(clickData, evDataService, evEventService);

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

        var interfaceLayout = evDataService.getInterfaceLayout();
        var components = evDataService.getComponents();

        var contentWrapElemHeight = rvScrollManager.getContentWrapElemHeight();
        var contentWrapElemWidth = rvScrollManager.getContentWrapElemWidth();

        var rootEntityContentWrapElemHeight = rvScrollManager.getRootWrapElemHeight();
        //var rootEntityContentWrapElemWidth = rvScrollManager.getRootEntityContentWrapElemWidth();


        var viewportTop;
        var viewportWidth;
        // var viewportHeight = Math.floor(document.body.clientHeight - interfaceLayout.columnArea.top - interfaceLayout.columnArea.height);
        var viewportHeight;

        // console.log('calculateScroll components', components);
        // console.log('calculateScroll contentWrapElemWidth', contentWrapElemWidth);

        if (components.sidebar) {
            viewportWidth = contentWrapElemWidth - interfaceLayout.filterArea.width;
        } else {
            viewportWidth = contentWrapElemWidth
        }

        // console.log('viewportWidth', viewportWidth);

        viewportTop = interfaceLayout.progressBar.height;

        if (isRootEntityViewer) {

            if (components.groupingArea) {
                viewportTop = viewportTop + interfaceLayout.groupingArea.height
            }

            if (components.columnArea) {
                viewportTop = viewportTop + interfaceLayout.columnArea.height
            }

            // console.log('contentWrapElemHeight', contentWrapElemHeight);
            // console.log('viewportTop', viewportTop);
            // console.log('interfaceLayout.splitPanel.height', interfaceLayout.splitPanel.height);


            // viewportHeight = Math.floor(contentWrapElemHeight - viewportTop - interfaceLayout.splitPanel.height);
            viewportHeight = Math.floor(contentWrapElemHeight - viewportTop);

        } else {

            if (components.columnArea) {
                viewportTop = viewportTop + interfaceLayout.columnArea.height
            }

            if (components.groupingArea) {
                viewportTop = viewportTop + interfaceLayout.groupingArea.height;
            }

            console.log('rootviewer split', viewportTop);

            viewportHeight = Math.floor(contentWrapElemHeight - viewportTop);

        }

        // console.log('calculateScroll.viewportHeight', viewportHeight);
        // console.log('calculateScroll.viewportWidth', viewportWidth);

        rvScrollManager.setViewportHeight(viewportHeight);
        if (viewportWidth) {
            rvScrollManager.setViewportWidth(viewportWidth);
        };

        var paddingTop = calculatePaddingTop(evDataService);
        var totalHeight = calculateTotalHeight(evDataService);

        //rvScrollManager.setRootEntityContentWrapElemHeight(viewportHeight);
        rvScrollManager.setContentElemPaddingTop(paddingTop);


        var areaWidth = 0;
        var i;
        var columnMargins = 16;
        var dropNewFieldWidth = 400;
        var columns = evDataService.getColumns();

        for (i = 0; i < columns.length; i = i + 1) {

            var columnWidth = parseInt(columns[i].style.width.split('px')[0], 10);

            areaWidth = areaWidth + columnWidth + columnMargins;
        }

        var resultWidth = areaWidth + dropNewFieldWidth;

        if (resultWidth < contentWrapElemWidth) {
            resultWidth = contentWrapElemWidth;
        }

        // console.log('resultWidth', resultWidth);

        rvScrollManager.setContentElemWidth(resultWidth);

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

    var clearActivated = function (evDataService) {

        var objects = evDataService.getObjects();

        objects.forEach(function (item) {

            item.___is_activated = false;

            evDataService.setObject(item);

        });

    };

    var initContextMenuEventDelegation = function (elem, evDataService, evEventService) {

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

                clearDropdowns();

                var popup = document.createElement('div');

                clearActivated(evDataService);

                var obj = evDataHelper.getObject(objectId, parentGroupHashId, evDataService);

                obj.___is_activated = true;

                evDataService.setObject(obj);

                console.log('obj', obj);


                popup.id = 'dropdown-' + objectId;
                popup.classList.add('ev-dropdown');

                popup.innerHTML = '<div>';


                if (obj['instrument.id']) {
                    popup.innerHTML = popup.innerHTML + '<div>' +
                        '<div class="ev-dropdown-option"' +
                        ' data-ev-dropdown-action="edit_instrument"' +
                        ' data-object-id="' + objectId + '"' +
                        ' data-parent-group-hash-id="' + parentGroupHashId + '">Edit Instrument</div>'
                }

                if (obj['account.id']) {
                    popup.innerHTML = popup.innerHTML +
                        '<div class="ev-dropdown-option"' +
                        ' data-ev-dropdown-action="edit_account"' +
                        ' data-object-id="' + objectId + '"' +
                        ' data-parent-group-hash-id="' + parentGroupHashId + '">Edit Account</div>'
                }

                if (obj['portfolio.id']) {
                    popup.innerHTML = popup.innerHTML +
                        '<div class="ev-dropdown-option"' +
                        ' data-ev-dropdown-action="edit_portfolio"' +
                        ' data-object-id="' + objectId + '"' +
                        ' data-parent-group-hash-id="' + parentGroupHashId + '">Edit Portfolio</div>';
                }

                if (obj['instrument.id']) {
                    popup.innerHTML = popup.innerHTML +
                        '<div class="ev-dropdown-option"' +
                        ' data-ev-dropdown-action="edit_price"' +
                        ' data-object-id="' + objectId + '"' +
                        ' data-parent-group-hash-id="' + parentGroupHashId + '">Edit Price</div>'
                }

                if (obj['currency.id']) {
                    popup.innerHTML = popup.innerHTML +
                        '<div class="ev-dropdown-option"' +
                        ' data-ev-dropdown-action="edit_fx_rate"' +
                        ' data-object-id="' + objectId + '"' +
                        ' data-parent-group-hash-id="' + parentGroupHashId + '">Edit FX Rate</div>'
                }

                if(obj['item_type'] === 1) { // item_type: 1 == Instrument

                    popup.innerHTML = popup.innerHTML +
                        '<div class="ev-dropdown-option"' +
                        ' data-ev-dropdown-action="edit_pricing_currency"' +
                        ' data-object-id="' + objectId + '"' +
                        ' data-parent-group-hash-id="' + parentGroupHashId + '">Edit Pricing FX Rate</div>';

                    popup.innerHTML = popup.innerHTML +
                        '<div class="ev-dropdown-option"' +
                        ' data-ev-dropdown-action="edit_accrued_currency"' +
                        ' data-object-id="' + objectId + '"' +
                        ' data-parent-group-hash-id="' + parentGroupHashId + '">Edit Accrued FX Rate</div>';

                }

                popup.innerHTML = popup.innerHTML + '<div class="ev-dropdown-option"' +
                    ' data-ev-dropdown-action="book_transaction"' +
                    ' data-object-id="' + objectId + '"' +
                    ' data-parent-group-hash-id="' + parentGroupHashId + '">Book Transaction</div>' +
                    '</div>';

                popup.style.position = 'absolute';
                popup.style.left = event.pageX + 'px';
                popup.style.top = event.pageY + 'px';

                document.body.appendChild(popup);

                evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                return false;

            }

        }, false);

        window.addEventListener('contextmenu', function () {
            clearDropdowns();
        });

        window.addEventListener('click', function (event) {

            var objectId = event.target.dataset.objectId;
            var parentGroupHashId = event.target.dataset.parentGroupHashId;
            var dropdownAction = event.target.dataset.evDropdownAction;

            if (objectId && dropdownAction && parentGroupHashId) {

                var obj = evDataHelper.getObject(objectId, parentGroupHashId, evDataService);

                if (!obj) {
                    obj = {}
                }

                obj.event = event;

                evDataService.setActiveObject(obj);
                evDataService.setActiveObjectAction(dropdownAction);

                evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);

                clearDropdowns();

            } else {

                if (!event.target.classList.contains('ev-dropdown-option')) {
                    clearDropdowns();
                }

            }

        });

    };


    module.exports = {
        initEventDelegation: initEventDelegation,
        addScrollListener: addScrollListener,
        initContextMenuEventDelegation: initContextMenuEventDelegation,
        calculateTotalHeight: calculateTotalHeight,
        calculateContentWrapHeight: calculateContentWrapHeight,
        calculateScroll: calculateScroll
    }


}());