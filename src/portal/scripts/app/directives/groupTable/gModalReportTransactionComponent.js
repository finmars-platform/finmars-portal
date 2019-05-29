/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var uiService = require('../../services/uiService');

    var evEvents = require('../../services/entityViewerEvents');

    var metaService = require('../../services/metaService');
    var attributeTypeService = require('../../services/attributeTypeService');
    var customFieldService = require('../../services/reports/customFieldService');
    var dynamicAttributesForReportsService = require('../../services/groupTable/dynamicAttributesForReportsService');

    var evDataHelper = require('../../helpers/ev-data.helper');

    var rvAttributesHelper = require('../../helpers/rvAttributesHelper');

    module.exports = function ($scope, $mdDialog, entityViewerDataService, entityViewerEventService) {

        logService.controller('gModalController', 'initialized');

        var vm = this;
        vm.readyStatus = {content: false};

        vm.entityType = entityViewerDataService.getEntityType();

        logService.property('vm.entityType', vm.entityType);

        vm.general = [];
        vm.attrs = [];
        vm.custom = [];

        vm.instrumentDynamicAttrs = [];
        vm.accountDynamicAttrs = [];
        vm.portfolioDynamicAttrs = [];

        var columns = entityViewerDataService.getColumns();
        var filters = entityViewerDataService.getFilters();
        var grouping = entityViewerDataService.getGroups();

        var attrsList = [];

        $('body').addClass('drag-dialog'); // hide backdrop

        vm.getAttributes = function () {

            //vm.entityAttrs = metaService.getEntityAttrs(vm.entityType);

            vm.transactionAttrs = rvAttributesHelper.getAllAttributesAsFlatList('reports.transactionreport', '', 'Transaction', {maxDepth: 1});

            vm.complexTransactionAttrs = rvAttributesHelper.getAllAttributesAsFlatList('transactions.complextransaction', 'complex_transaction', 'Complex Transaction', {maxDepth: 1});

            vm.portfolioAttrs = rvAttributesHelper.getAllAttributesAsFlatList('portfolios.portfolio', 'portfolio', 'Portfolio', {maxDepth: 1});

            vm.instrumentAttrs = rvAttributesHelper.getAllAttributesAsFlatList('instruments.instrument', 'instrument', 'Instrument', {maxDepth: 1});

            vm.responsibleAttrs = rvAttributesHelper.getAllAttributesAsFlatList('counterparties.responsible', 'responsible', 'Responsible', {maxDepth: 1});

            vm.counterpartyAttrs = rvAttributesHelper.getAllAttributesAsFlatList('counterparties.counterparty', 'counterparty', 'Counterparty', {maxDepth: 1});


            // instruments

            vm.linkedInstrumentAttrs = rvAttributesHelper.getAllAttributesAsFlatList('instruments.instrument', 'linked_instrument', 'Linked Instrument', {maxDepth: 1});

            vm.allocationBalanceAttrs = rvAttributesHelper.getAllAttributesAsFlatList('instruments.instrument', 'allocation_balance', 'Allocation balance', {maxDepth: 1});

            vm.allocationPlAttrs = rvAttributesHelper.getAllAttributesAsFlatList('instruments.instrument', 'allocation_pl', 'Allocation P&L', {maxDepth: 1});

            // currencies

            vm.transactionCurrencyAttrs = rvAttributesHelper.getAllAttributesAsFlatList('currencies.currency', 'transaction_currency', 'Transaction currency', {maxDepth: 1});

            vm.settlementCurrencyAttrs = rvAttributesHelper.getAllAttributesAsFlatList('currencies.currency', 'settlement_currency', 'Settlement currency', {maxDepth: 1});

            // accounts

            vm.accountPositionAttrs = rvAttributesHelper.getAllAttributesAsFlatList('accounts.account', 'account_position', 'Account Position', {maxDepth: 1});

            vm.accountCashAttrs = rvAttributesHelper.getAllAttributesAsFlatList('accounts.account', 'account_cash', 'Account Cash', {maxDepth: 1});

            vm.accountInterimAttrs = rvAttributesHelper.getAllAttributesAsFlatList('accounts.account', 'account_interim', 'Account Interim', {maxDepth: 1});

            // strategies

            vm.strategy1cashAttrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy1', 'strategy1_cash', 'Strategy 1 Cash', {maxDepth: 1});

            vm.strategy1positionAttrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy1', 'strategy1_position', 'Strategy 1 Position', {maxDepth: 1});

            vm.strategy2cashAttrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy2', 'strategy2_cash', 'Strategy 2 Cash', {maxDepth: 1});

            vm.strategy2positionAttrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy2', 'strategy2_position', 'Strategy 2 Position', {maxDepth: 1});

            vm.strategy3cashAttrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy3', 'strategy3_cash', 'Strategy 3 Cash', {maxDepth: 1});

            vm.strategy3positionAttrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy3', 'strategy3_position', 'Strategy 3 Position', {maxDepth: 1});

            uiService.getTransactionFieldList().then(function (data) {

                data.results.forEach(function (field) {

                    vm.complexTransactionAttrs.map(function (entityAttr, index) {

                        if (entityAttr.key === 'complex_transaction.' + field.key) {
                            entityAttr.name = 'Complex Transaction. ' + field.name
                        }

                        // if (entityAttr.key === 'complex_transaction.transaction_type.' + field.key) {
                        //     entityAttr.name = 'Complex Transaction. Transaction Type. ' + field.name
                        // }
                        if (entityAttr.key.indexOf('complex_transaction.transaction_type.') !== -1) {
                            vm.complexTransactionAttrs.splice(index, 1);
                        }

                    })

                });

                customFieldService.getList(vm.entityType).then(function (data) {

                    vm.custom = data.results;

                    vm.custom.forEach(function (customItem) {
                        customItem.key = 'custom_fields.' + customItem.id;
                        customItem.name = 'Custom Field. ' + customItem.name;
                    });

                    dynamicAttributesForReportsService.getDynamicAttributes().then(function (data) {

                        vm.portfolioDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['portfolios.portfolio'], 'portfolios.portfolio', 'portfolio', 'Portfolio');
                        vm.complexTransactionDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['transactions.complextransaction'], 'transactions.complextransaction', 'complex_transaction', 'Complex Transaction');
                        vm.responsibleDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['counterparties.responsible'], 'counterparties.responsible', 'responsible', 'Responsible');
                        vm.counterpartyDynmicAttrs = rvAttributesHelper.formatAttributeTypes(data['counterparties.counterparty'], 'counterparties.counterparty', 'counterparty', 'Counterparty');

                        vm.instrumentDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['instruments.instrument'], 'instruments.instrument', 'instrument', 'Instrument');
                        vm.linkedInstrumentDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['instruments.instrument'], 'instruments.instrument', 'linked_instrument', 'Linked Instrument');
                        vm.allocationBalanceDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['instruments.instrument'], 'instruments.instrument', 'allocation_balance', 'Allocation Balance');
                        vm.allocationPlDnymaicAttrs = rvAttributesHelper.formatAttributeTypes(data['instruments.instrument'], 'instruments.instrument', 'allocation_pl', 'Allocation PL');

                        vm.accountPositionDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['accounts.account'], 'accounts.account', 'account_position', 'Account Position');
                        vm.accountCashDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['accounts.account'], 'accounts.account', 'account_cash', 'Account Cash');
                        vm.accountInterimDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['accounts.account'], 'accounts.account', 'account_interim', 'Account Interim');

                        //vm.entityAttrs = metaService.getEntityAttrs(vm.entityType);

                        attrsList = attrsList.concat(vm.transactionAttrs);
                        attrsList = attrsList.concat(vm.complexTransactionAttrs);
                        attrsList = attrsList.concat(vm.portfolioAttrs);
                        attrsList = attrsList.concat(vm.instrumentAttrs);
                        attrsList = attrsList.concat(vm.responsibleAttrs);
                        attrsList = attrsList.concat(vm.counterpartyAttrs);

                        attrsList = attrsList.concat(vm.portfolioDynamicAttrs);
                        attrsList = attrsList.concat(vm.complexTransactionDynamicAttrs);
                        attrsList = attrsList.concat(vm.responsibleDynamicAttrs);
                        attrsList = attrsList.concat(vm.counterpartyDynmicAttrs);


                        // instruments

                        attrsList = attrsList.concat(vm.linkedInstrumentAttrs);
                        attrsList = attrsList.concat(vm.allocationBalanceAttrs);
                        attrsList = attrsList.concat(vm.allocationPlAttrs);

                        attrsList = attrsList.concat(vm.instrumentDynamicAttrs);
                        attrsList = attrsList.concat(vm.linkedInstrumentDynamicAttrs);
                        attrsList = attrsList.concat(vm.allocationBalanceDynamicAttrs);
                        attrsList = attrsList.concat(vm.allocationPlDnymaicAttrs);

                        // currencies

                        attrsList = attrsList.concat(vm.transactionCurrencyAttrs);
                        attrsList = attrsList.concat(vm.settlementCurrencyAttrs);

                        // accounts

                        attrsList = attrsList.concat(vm.accountPositionAttrs);
                        attrsList = attrsList.concat(vm.accountCashAttrs);
                        attrsList = attrsList.concat(vm.accountInterimAttrs);

                        attrsList = attrsList.concat(vm.accountPositionDynamicAttrs);
                        attrsList = attrsList.concat(vm.accountCashDynamicAttrs);
                        attrsList = attrsList.concat(vm.accountInterimDynamicAttrs);

                        // strategies

                        attrsList = attrsList.concat(vm.strategy1cashAttrs);
                        attrsList = attrsList.concat(vm.strategy1positionAttrs);
                        attrsList = attrsList.concat(vm.strategy2cashAttrs);
                        attrsList = attrsList.concat(vm.strategy2positionAttrs);
                        attrsList = attrsList.concat(vm.strategy3cashAttrs);
                        attrsList = attrsList.concat(vm.strategy3positionAttrs);

                        syncAttrs();

                        vm.readyStatus.content = true;
                        $scope.$apply();

                    });

                });

            });

        };

        vm.getAttributes();

        vm.checkAreaAccessibility = function (item, type) {
            if (type === 'group') {
                if (['notes', 'accounts', 'responsibles', 'counterparties', 'transaction_types', 'portfolios', 'tags', 'content_types'].indexOf(item.key) !== -1) {
                    return true;
                }
                return false;
            } else {
                if (['notes'].indexOf(item.key) !== -1) {
                    return true;
                }
                return false;
            }
        };

        vm.bindReportItemName = function (item) {

            return item.name;
        };

        var syncAttrs = function () {

            syncTypeAttrs(vm.transactionAttrs);
            syncTypeAttrs(vm.complexTransactionAttrs);
            syncTypeAttrs(vm.complexTransactionDynamicAttrs);

            syncTypeAttrs(vm.portfolioAttrs);
            syncTypeAttrs(vm.portfolioDynamicAttrs);

            syncTypeAttrs(vm.instrumentAttrs);
            syncTypeAttrs(vm.instrumentDynamicAttrs);

            syncTypeAttrs(vm.responsibleAttrs);
            syncTypeAttrs(vm.responsibleDynamicAttrs);

            syncTypeAttrs(vm.counterpartyAttrs);
            syncTypeAttrs(vm.counterpartyDynmicAttrs);

            syncTypeAttrs(vm.linkedInstrumentAttrs);
            syncTypeAttrs(vm.linkedInstrumentDynamicAttrs);

            syncTypeAttrs(vm.allocationBalanceAttrs);
            syncTypeAttrs(vm.allocationBalanceDynamicAttrs);

            syncTypeAttrs(vm.allocationPlAttrs);
            syncTypeAttrs(vm.allocationPlDnymaicAttrs);

            syncTypeAttrs(vm.transactionCurrencyAttrs);
            syncTypeAttrs(vm.settlementCurrencyAttrs);

            syncTypeAttrs(vm.accountPositionAttrs);
            syncTypeAttrs(vm.accountPositionDynamicAttrs);

            syncTypeAttrs(vm.accountCashAttrs);
            syncTypeAttrs(vm.accountCashDynamicAttrs);

            syncTypeAttrs(vm.accountInterimAttrs);
            syncTypeAttrs(vm.accountInterimDynamicAttrs);

            syncTypeAttrs(vm.strategy1cashAttrs);
            syncTypeAttrs(vm.strategy1positionAttrs);

            syncTypeAttrs(vm.strategy2cashAttrs);
            syncTypeAttrs(vm.strategy2positionAttrs);

            syncTypeAttrs(vm.strategy3cashAttrs);
            syncTypeAttrs(vm.strategy3positionAttrs);

            syncTypeAttrs(vm.custom);

        };

        function syncTypeAttrs(attrs) {

            var i;
            for (i = 0; i < attrs.length; i = i + 1) {

                attrs[i].columns = false;
                attrs[i].filters = false;
                attrs[i].groups = false;

                columns.forEach(function (item) {

                    if (attrs[i].entity === item.entity) {

                        if (item.hasOwnProperty('key')) {

                            if (attrs[i].key === item.key) {
                                attrs[i].columns = true;
                            }
                        }

                        if (item.hasOwnProperty('id')) {

                            if (attrs[i].id === item.id) {
                                attrs[i].columns = true;
                            }
                        }

                    }

                });

                filters.forEach(function (item) {

                    if (attrs[i].entity === item.entity) {

                        if (item.hasOwnProperty('key')) {

                            if (attrs[i].key === item.key) {
                                attrs[i].filters = true;
                            }
                        }

                        if (item.hasOwnProperty('id')) {

                            if (attrs[i].id === item.id) {
                                attrs[i].filters = true;
                            }
                        }

                    }

                });

                grouping.forEach(function (item) {

                    if (attrs[i].entity === item.entity) {

                        if (item.hasOwnProperty('key')) {
                            if (attrs[i].key === item.key) {
                                attrs[i].groups = true;
                            }
                        }

                        if (item.hasOwnProperty('id')) {

                            if (attrs[i].id === item.id) {
                                attrs[i].groups = true;
                            }
                        }

                    }

                });
            }
        }

        function updateTypeAttrs(attrs) {
            var c, g, f;
            var columnExist, groupExist, filterExist;

            attrs.forEach(function (attr) {

                columnExist = false;
                groupExist = false;
                filterExist = false;

                for (c = 0; c < columns.length; c = c + 1) {

                    if (attr.entity === columns[c].entity) {

                        if (attr.hasOwnProperty('key')) {
                            if (attr.key === columns[c].key) {
                                columnExist = true;
                                if (attr.columns === false) {
                                    columns.splice(c, 1);
                                    c = c - 1;
                                }
                            }
                        }

                        if (attr.hasOwnProperty('id')) {

                            if (attr.id === columns[c].id) {
                                columnExist = true;
                                if (attr.columns === false) {
                                    columns.splice(c, 1);
                                    c = c - 1;
                                }
                            }

                        }

                    }

                }


                /////// GROUPING

                for (g = 0; g < grouping.length; g = g + 1) {

                    if (attr.entity === grouping[g].entity) {

                        if (attr.hasOwnProperty('key')) {
                            if (attr.key === grouping[g].key) {
                                groupExist = true;
                                if (attr.groups === false) {
                                    grouping.splice(g, 1);
                                    g = g - 1;
                                }
                            }
                        }

                        if (attr.hasOwnProperty('id')) {

                            if (attr.id === grouping[g].id) {
                                groupExist = true;
                                if (attr.groups === false) {
                                    grouping.splice(g, 1);
                                    g = g - 1;
                                }
                            }

                        }

                    }

                }


                /////// FILTERING

                for (f = 0; f < filters.length; f = f + 1) {

                    if (attr.entity === filters[f].entity) {

                        if (attr.hasOwnProperty('key')) {
                            if (attr.key === filters[f].key) {
                                filterExist = true;
                                if (attr.filters === false) {
                                    filters.splice(f, 1);
                                    f = f - 1;
                                }
                            }
                        }

                        if (attr.hasOwnProperty('id')) {

                            if (attr.id === filters[f].id) {
                                filterExist = true;
                                if (attr.filters === false) {
                                    filters.splice(f, 1);
                                    f = f - 1;
                                }
                            }
                        }

                    }

                }

                if (!columnExist && attr.columns === true) {
                    columns.push(attr);
                }

                if (!groupExist && attr.groups === true) {
                    grouping.push(attr);
                }

                if (!filterExist && attr.filters === true) {
                    filters.push(attr);
                }

            });

            entityViewerDataService.setColumns(columns);
            entityViewerDataService.setGroups(grouping);
            entityViewerDataService.setFilters(filters);

        }

        vm.updateAttrs = function (attrs) {

            updateTypeAttrs(attrs);

            evDataHelper.updateColumnsIds(entityViewerDataService);
            evDataHelper.setColumnsDefaultWidth(entityViewerDataService);

            entityViewerEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
            entityViewerEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
            entityViewerEventService.dispatchEvent(evEvents.GROUPS_CHANGE);

            entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

        };

        vm.cancel = function () {
            $('body').removeClass('drag-dialog');
            dragAndDrop.destroy();
            $mdDialog.cancel();
        };

        var dragAndDrop = {

            init: function () {
                this.dragula();
                this.eventListeners();
            },

            eventListeners: function () {

                var exist = false;
                var columnExist = false;
                var groupExist = false;
                var filterExist = false;

                this.dragula.on('over', function (elem, container, source) {
                    $(container).addClass('active');
                    $(container).on('mouseleave', function () {
                        $(this).removeClass('active');
                    })

                });
                this.dragula.on('drop', function (elem, target) {
                    // console.log('here?', target, elem); //TODO fallback to ids instead of name/key
                    $(target).removeClass('active');
                    var name = $(elem).html();
                    var i;

                    var identifier;
                    identifier = $(elem).attr('data-key-identifier');

                    /*if ($(elem).attr('data-key-identifier')) {
                        identifier = $(elem).attr('data-key-identifier');
                    } else {
                        identifier = $(elem).html();
                    }*/

                    exist = false;
                    if (target === document.querySelector('#columnsbag') ||
                        target === document.querySelector('.g-columns-holder')) {
                        for (i = 0; i < columns.length; i = i + 1) {

                            if (columns[i].key === identifier) {
                                exist = true;
                                columnExist = true;
                            }

                            /*if (columns[i].name === identifier) {
                                exist = true;
                                columnExist = true;
                            }*/
                        }
                    }
                    if (target === document.querySelector('#groupsbag') ||
                        target === document.querySelector('.g-groups-holder')) {
                        for (i = 0; i < grouping.length; i = i + 1) {
                            if (grouping[i].key === identifier) {
                                exist = true;
                                groupExist = true;
                            }

                            /*if (grouping[i].name === identifier) {
                                exist = true;
                                groupExist = true;
                            }*/
                        }
                    }
                    if (target === document.querySelector('#filtersbag .drop-new-filter') ||
                        target === document.querySelector('.g-filters-holder')) {
                        for (i = 0; i < filters.length; i = i + 1) {
                            if (filters[i].key === identifier) {
                                exist = true;
                                filterExist = true;
                            }

                            /*if (filters[i].name === identifier) {
                                exist = true;
                                filterExist = true;
                            }*/
                        }
                    }

                    if (!exist && target) {
                        var a;
                        //console.log('target', {target: target});
                        //console.log('elem', {elem: elem});

                        var nodes = Array.prototype.slice.call(target.children);
                        var index = nodes.indexOf(elem);

                        // .g-columns-holder
                        //if (target === document.querySelector('#columnsbag')) {
                        if (target === document.querySelector('.g-columns-holder') ||
                            target === document.querySelector('#columnsbag')) {

                            for (a = 0; a < attrsList.length; a = a + 1) {

                                if (attrsList[a].key === identifier) {

                                    if (target === document.querySelector('#columnsbag')) {
                                        columns.push(attrsList[a]);
                                    } else {
                                        columns.splice(index, 0, attrsList[a]);
                                    }

                                    //columns.push(attrsList[a]);
                                }

                                /*if (attrsList[a].name === identifier) {

                                    if (target === document.querySelector('#columnsbag')) {
                                        columns.push(attrsList[a]);
                                    } else {
                                        columns.splice(index, 0, attrsList[a]);
                                    }

                                    //columns.push(attrsList[a]);
                                }*/
                            }
                            syncAttrs();
                            evDataHelper.updateColumnsIds(entityViewerDataService);
                            evDataHelper.setColumnsDefaultWidth(entityViewerDataService);

                            entityViewerEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                            entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                        }
                        if (target === document.querySelector('#groupsbag') ||
                            target === document.querySelector('.g-groups-holder')) {

                            for (a = 0; a < attrsList.length; a = a + 1) {

                                if (attrsList[a].key === identifier) {

                                    if (target === document.querySelector('#groupsbag')) {
                                        grouping.push(attrsList[a]);
                                    } else {
                                        grouping.splice(index, 0, attrsList[a]);
                                    }

                                    //columns.push(attrsList[a]);
                                }

                                /*if (attrsList[a].name === identifier) {

                                    if (target === document.querySelector('#groupsbag')) {
                                        grouping.push(attrsList[a]);
                                    } else {
                                        grouping.splice(index, 0, attrsList[a]);
                                    }

                                }*/
                            }
                            syncAttrs();
                            evDataHelper.updateColumnsIds(entityViewerDataService);
                            evDataHelper.setColumnsDefaultWidth(entityViewerDataService);

                            entityViewerEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                            entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                        }
                        if (target === document.querySelector('#filtersbag .drop-new-filter') ||
                            target === document.querySelector('.g-filters-holder')) {

                            for (a = 0; a < attrsList.length; a = a + 1) {

                                if (attrsList[a].key === identifier) {

                                    if (target === document.querySelector('#filtersbag .drop-new-filter')) {
                                        filters.push(attrsList[a]);
                                    } else {
                                        filters.splice(index, 0, attrsList[a]);
                                    }

                                    //columns.push(attrsList[a]);
                                }

                                /*if (attrsList[a].name === identifier) {

                                    if (target === document.querySelector('#filtersbag .drop-new-filter')) {
                                        filters.push(attrsList[a]);
                                    } else {
                                        filters.splice(index, 0, attrsList[a]);
                                    }

                                }*/
                            }
                            syncAttrs();
                            evDataHelper.updateColumnsIds(entityViewerDataService);
                            evDataHelper.setColumnsDefaultWidth(entityViewerDataService);

                            entityViewerEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
                            entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                        }

                        // $scope.$apply();

                    } else if (exist && target) {

                        var errorMessage = 'Item should be unique'

                        if (columnExist) {
                            errorMessage = 'There is already such column in Column Area';
                        } else if (groupExist) {
                            errorMessage = 'There is already such group in Grouping Area';
                        } else if (filterExist) {
                            errorMessage = 'There is already such filter in Filter Area';
                        }

                        $mdDialog.show({
                            controller: 'WarningDialogController as vm',
                            templateUrl: 'views/warning-dialog-view.html',
                            parent: angular.element(document.body),
                            clickOutsideToClose: false,
                            multiple: true,
                            locals: {
                                warning: {
                                    title: 'Error',
                                    description: errorMessage
                                },
                                data: {
                                    actionsButtons: [{
                                        name: "OK",
                                        response: false
                                    }]
                                }
                            }
                        });

                    }

                    $scope.$apply();
                });

                this.dragula.on('dragend', function (el) {
                    $scope.$apply();
                    $(el).remove();
                })
            },

            dragula: function () {

                var items = [
                    document.querySelector('.g-columns-holder'),
                    document.querySelector('#columnsbag'),
                    document.querySelector('.g-groups-holder'),
                    document.querySelector('#groupsbag'),
                    document.querySelector('.g-filters-holder'),
                    document.querySelector('#filtersbag .drop-new-filter')
                ];

                var i;
                var itemsElem = document.querySelectorAll('#dialogbag .g-modal-draggable-card');
                for (i = 0; i < itemsElem.length; i = i + 1) {
                    items.push(itemsElem[i]);
                }

                this.dragula = dragula(items,
                    {
                        accepts: function (el, target, source, sibling) {

                            //console.log('el', el, target, source);

                            if (target.classList.contains('g-modal-draggable-card')) {
                                return false;
                            }

                            return true;
                        },
                        copy: true
                    });
            },

            destroy: function () {
                // console.log('this.dragula', this.dragula);
                this.dragula.destroy();
            }
        };

        vm.openCustomFieldsManager = function () {

            $mdDialog.show({
                controller: 'CustomFieldDialogController as vm',
                templateUrl: 'views/dialogs/custom-field-dialog-view.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                preserveScope: true,
                multiple: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    data: {
                        entityType: vm.entityType
                    }
                }
            })

        };

        vm.initDnD = function () {
            setTimeout(function () {
                dragAndDrop.init()
            }, 500);
        };

        vm.MABtnVisibility = function (entityType) {
            return metaService.checkRestrictedEntityTypesForAM(entityType);
        }

        var init = function () {

            entityViewerEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {

                columns = entityViewerDataService.getColumns();
                syncAttrs();

            });

            entityViewerEventService.addEventListener(evEvents.GROUPS_CHANGE, function () {

                grouping = entityViewerDataService.getGroups();
                syncAttrs();

            });

            entityViewerEventService.addEventListener(evEvents.FILTERS_CHANGE, function () {

                filters = entityViewerDataService.getFilters();
                syncAttrs();

            });

        };

        init();

    }

}());