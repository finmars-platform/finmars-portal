/**
 * Created by szhitenev on 18.12.2019.
 */
(function () {

    'use strict';

    var reconciliationBankFieldService = require('../../services/reconciliation/reconciliationBankFieldService');
    var reconciliationComplexTransactionFieldService = require('../../services/reconciliation/reconciliationComplexTransactionFieldService');

    var evEvents = require('../../services/entityViewerEvents');

    module.exports = function ($scope, $mdDialog, parentEntityViewerDataService, parentEntityViewerEventService, splitPanelExchangeService) {

        var vm = this;

        vm.parentEntityViewerDataService = parentEntityViewerDataService;
        vm.parentEntityViewerEventService = parentEntityViewerEventService;
        vm.reconViewerDataService = parentEntityViewerDataService.getReconciliationDataService();
        vm.reconciliationEventService = parentEntityViewerDataService.getReconciliationEventService();

        vm.dragIconGrabbed = false;

        vm.bankFieldStatuses = [
            {
                name: 'Conflicts',
                id: 2
            },
            {
                name: 'Resolved Conflicts',
                id: 3
            },
            {
                name: 'Matched',
                id: 1
            },
            {
                name: 'Ignore',
                id: 4
            },
            {
                name: 'Auto Matched',
                id: 5
            }
        ];

        vm.complexTransactionFieldStatus = [
            {
                name: 'Matched',
                id: 1
            },
            {
                name: 'Unmatched',
                id: 2
            },
            {
                name: 'Auto Matched',
                id: 3
            },
            {
                name: 'Ignore',
                id: 4
            }
        ];

        vm.complexTransactionStatusChange = function ($event, field) {

            console.log('vm.complexTransactionStatusChange.field', field);

            field.processing = true;

            reconciliationComplexTransactionFieldService.update(field.id, field).then(function (data) {

                console.log('complex transaction field updated', data);

                field.processing = false;

                $scope.$apply();

            })

        };

        vm.bankFieldStatusChange = function ($event, field) {

            console.log('vm.bankFieldStatusChange.field', field);

            field.processing = true;

            if (field.type === 'new') {

                delete field.id;

                reconciliationBankFieldService.create(field).then(function (data) {

                    console.log('bank field created', data);

                    field.processing = false;

                    field = data;

                    $scope.$apply();

                })
            } else {

                reconciliationBankFieldService.update(field.id, field).then(function (data) {

                    console.log('bank field updated', data);

                    field.processing = false;

                    $scope.$apply();

                })
            }


        };

        vm.createBankField = function (bankLine, field) {

            delete field.id;

            reconciliationBankFieldService.create(field).then(function (data) {

                console.log('bank field created', data);

                field.processing = false;

                field = data;

                var data = vm.reconViewerDataService.getData(bankLine.___parentId);

                data.results = data.results.map(function (item) {

                    if(item.___id === bankLine.___id) {
                        return bankLine;
                    }

                    return item

                });

                vm.reconViewerDataService.setData(data);

                $scope.$apply();

            })


        };

        vm.updateBankFieldStatus = function (bankLine, field) {

            reconciliationBankFieldService.update(field.id, field).then(function (data) {

                console.log('bank field updated', data);

                field.processing = false;

                var data = vm.reconViewerDataService.getData(bankLine.___parentId);

                data.results = data.results.map(function (item) {

                    if(item.___id === bankLine.___id) {
                        return bankLine;
                    }

                    return item

                });

                vm.reconViewerDataService.setData(data);

                vm.reconciliationEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                $scope.$apply();

            })

        };

        vm.updateComplexTransactionFieldStatus = function (complexTransaction, field) {

            reconciliationComplexTransactionFieldService.update(field.id, field).then(function (data) {

                console.log('complex transaction field updated', data);

                field.processing = false;

                var data = vm.parentEntityViewerDataService.getData(complexTransaction.___parentId);

                data.results = data.results.map(function (item) {

                    if(item.___id === complexTransaction.___id) {
                        return complexTransaction;
                    }

                    return item

                });

                $scope.$apply();

            })

        };

        vm.viewBankLine = function ($event, item) {

            $mdDialog.show({
                controller: 'ReconMatchViewLineDialogController as vm',
                templateUrl: 'views/dialogs/reconciliation/recon-match-view-line-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    data: {
                        item: item
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            })

        };

        vm.removeBankLine = function ($event, item) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: "Are you sure you want to delete this line?"
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    item.fields.forEach(function (field) {

                        if (field.type === 'existing') {
                            reconciliationBankFieldService.deleteByKey(field.id)
                        }

                    });

                    vm.bankLinesList = vm.bankLinesList.filter(function (line) {

                        return item.___match_index !== line.___match_index

                    })

                }

            })

        };

        vm.viewComplexTransaction = function ($event, item) {

            $mdDialog.show({
                controller: 'ComplexTransactionEditDialogController as vm',
                templateUrl: 'views/entity-viewer/complex-transaction-edit-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    entityType: 'complex-transaction',
                    entityId: item.id
                }
            })

        };

        vm.setAllMatchedComplexTransaction = function ($event, item) {

            var promises = [];

            item.recon_fields.forEach(function (field) {

                field.status = 1;

                promises.push(reconciliationComplexTransactionFieldService.update(field.id, field))

            });

            Promise.all(promises).then(function (value) {

                vm.complexTransactionList = vm.complexTransactionList.map(function (item, index) {

                    item.recon_fields = item.recon_fields.map(function (field) {

                        field.status = 1;

                        return field;

                    });

                    return item

                });

                vm.syncStatuses();

                $scope.$apply();

            })

        };

        vm.setAllUnmatchedComplexTransaction = function ($event, item) {

            var promises = [];

            item.recon_fields.forEach(function (field) {

                field.status = 2;

                promises.push(reconciliationComplexTransactionFieldService.update(field.id, field))

            });

            Promise.all(promises).then(function (value) {

                vm.complexTransactionList = vm.complexTransactionList.map(function (item, index) {

                    item.recon_fields = item.recon_fields.map(function (field) {

                        field.status = 2;

                        return field;

                    });

                    return item

                });

                vm.syncStatuses();

            });

        };


        var turnOffDragging = function () {
            vm.dragIconGrabbed = false;
        };

        vm.turnOnDragging = function () {
            vm.dragIconGrabbed = true;
            document.body.addEventListener('mouseup', turnOffDragging, {once: true});
        };

        vm.initDragula = function () {

            vm.dragAndDropBankFileLines = {

                init: function () {
                    this.dragulaInit();
                    this.eventListeners();
                },

                eventListeners: function () {

                    var drake = this.dragula;

                    drake.on('over', function (elem, container, source) {
                        $(container).addClass('active');
                    });

                    drake.on('out', function (elem, container, source) {
                        $(container).removeClass('active');
                    });


                },

                dragulaInit: function () {

                    var items = [];

                    var elements = document.querySelectorAll('.bankLineContainerHolder');

                    for (var i = 0; i < elements.length; i = i + 1) {
                        items.push(elements[i])
                    }

                    this.dragula = dragula(items, {
                        revertOnSpill: true,
                        moves: function (elem, target, source, sibling) {
                            return vm.dragIconGrabbed
                        }
                    });

                },

                destroy: function () {
                    if (this.dragula) {
                        this.dragula.destroy();
                    }
                }
            };

            vm.dragAndDropBankFileFields = {

                init: function () {
                    this.dragulaInit();
                    this.eventListeners();
                },

                eventListeners: function () {

                    var drake = this.dragula;

                    drake.on('over', function (elem, container, source) {

                        $(container).addClass('active');
                    });

                    drake.on('out', function (elem, container, source) {
                        $(container).removeClass('active');
                    });

                    drake.on('drop', function (elem, target, source, nextSibling) {
                        console.log("Here vm", vm);

                        console.log('target', target);
                        console.log('elem', elem);

                        var status = target.dataset.status;


                        var fieldId = parseInt(elem.dataset.fieldId, 10);
                        var fieldType = elem.dataset.fieldType;
                        var parentIndex = parseInt(elem.dataset.parentIndex, 10);

                        console.log('status', status);
                        console.log('fieldId', fieldId);
                        console.log('fieldType', fieldType);
                        console.log('parentIndex', parentIndex);

                        var field;
                        var bankLine;

                        vm.bankLinesList.forEach(function (item) {

                            if (item.___match_index === parentIndex) {
                                item.fields.forEach(function (itemField) {

                                    if (itemField.id === fieldId) {
                                        field = itemField;
                                        bankLine = item
                                    }

                                })

                            }

                        });

                        if (status !== 'new' && field) {

                            console.log('field', field);

                            var statusInt;

                            // MATCHED = 1
                            // CONFLICT = 2
                            // RESOLVED = 3
                            // IGNORE = 4
                            // AUTO_MATCHED = 5

                            if (status === 'ignore') {
                                statusInt = 4
                            } else if (status === 'auto_matched') {
                                statusInt = 5
                            } else if (status === 'matched') {
                                statusInt = 1
                            } else if (status === 'resolved') {
                                statusInt = 3
                            } else if (status === 'conflict') {
                                statusInt = 2
                            }

                            field.status = statusInt;

                            if (fieldType === 'new') {
                                vm.createBankField(bankLine, field)
                            } else {
                                vm.updateBankFieldStatus(bankLine, field)
                            }
                        }


                    });

                },

                dragulaInit: function () {

                    var items = [];

                    var elements = document.querySelectorAll('.bankLineContainer');

                    for (var i = 0; i < elements.length; i = i + 1) {
                        items.push(elements[i])
                    }

                    this.dragula = dragula(items, {
                        revertOnSpill: true,
                        accepts: function (el, target, source, sibling) {

                            var elClass = 'bankLineContainer-' + el.dataset.parentIndex;

                            if (target.dataset.status === 'new') {
                                return false;
                            }

                            if (target.dataset.status === 'auto_matched') {
                                return false;
                            }

                            if (target.classList.contains(elClass)) {
                                return true;
                            }

                            return false;
                        }
                    });

                },

                destroy: function () {
                    if (this.dragula) {
                        this.dragula.destroy();
                    }
                }
            };

            vm.dragAndDropComplexTransactionLines = {

                init: function () {
                    this.dragulaInit();
                    this.eventListeners();
                },

                eventListeners: function () {

                    var drake = this.dragula;

                    drake.on('over', function (elem, container, source) {
                        $(container).addClass('active');
                    });

                    drake.on('out', function (elem, container, source) {
                        $(container).removeClass('active');
                    });

                },

                dragulaInit: function () {

                    var elements = document.querySelectorAll('.complexTransactionLineContainerHolder');
                    var items = [];

                    for (var i = 0; i < elements.length; i = i + 1) {
                        items.push(elements[i])
                    }

                    this.dragula = dragula(items, {
                        revertOnSpill: true,
                        moves: function (elem, target, source, sibling) {
                            return vm.dragIconGrabbed
                        }
                    });

                },

                destroy: function () {
                    if (this.dragula) {
                        this.dragula.destroy();
                    }
                }
            };

            vm.dragAndDropComplexTransactionFields = {

                init: function () {
                    this.dragulaInit();
                    this.eventListeners();
                },

                eventListeners: function () {
                    var areaItemsChanged;
                    var drake = this.dragula;

                    drake.on('dragstart', function () {
                        areaItemsChanged = false;
                    });

                    drake.on('over', function (elem, container, source) {
                        areaItemsChanged = false;
                        $(container).addClass('active');
                    });

                    drake.on('out', function (elem, container, source) {
                        $(container).removeClass('active');
                    });

                    drake.on('drop', function (elem, target, source, nextSibling) {

                        console.log("Here vm", vm);

                        console.log('target', target);
                        console.log('elem', elem);

                        var status = target.dataset.status;

                        var fieldId = parseInt(elem.dataset.fieldId, 10);
                        var parentIndex = parseInt(elem.dataset.parentIndex, 10);

                        console.log('status', status);
                        console.log('fieldId', fieldId);
                        console.log('parentIndex', parentIndex);

                        var field;
                        var complexTransaction;

                        vm.complexTransactionList.forEach(function (item) {

                            if (item.___match_index === parentIndex) {
                                item.recon_fields.forEach(function (itemField) {

                                    if (itemField.id === fieldId) {
                                        field = itemField;
                                        complexTransaction = item
                                    }

                                })

                            }

                        });

                        if (field) {

                            console.log('field', field);

                            var statusInt;

                            // MATCHED = 1
                            // UNMATCHED = 2
                            // AUTO_MATCHED = 3
                            // IGNORE = 4

                            if (status === 'unmatched') {
                                statusInt = 2
                            } else if (status === 'matched') {
                                statusInt = 1
                            } else if (status === 'auto_matched') {
                                statusInt = 3
                            } else if (status === 'ignore') {
                                statusInt = 4
                            }

                            field.status = statusInt;

                            vm.updateComplexTransactionFieldStatus(complexTransaction, field)
                        }

                    });
                },

                dragulaInit: function () {

                    var elements = document.querySelectorAll('.complexTransactionLineContainer');
                    var items = [];

                    for (var i = 0; i < elements.length; i = i + 1) {
                        items.push(elements[i])
                    }

                    this.dragula = dragula(items, {
                        revertOnSpill: true,
                        accepts: function (el, target, source, sibling) {

                            var elClass = 'complexTransactionLineContainer-' + el.dataset.parentIndex;

                            if (target.dataset.status === 'auto_matched') {
                                return false;
                            }

                            if (target.classList.contains(elClass)) {
                                return true;
                            }

                            return false;
                        }
                    });

                },

                destroy: function () {
                    if (this.dragula) {
                        this.dragula.destroy();
                    }
                }
            };

            setTimeout(function () {
                vm.dragAndDropBankFileLines.init();
                vm.dragAndDropBankFileFields.init();
                vm.dragAndDropComplexTransactionLines.init();
                vm.dragAndDropComplexTransactionFields.init();
            }, 500);

        };

        vm.destroyDragula = function () {

            if (vm.dragAndDropBankFileLines) {
                vm.dragAndDropBankFileLines.destroy()
            }

            if (vm.dragAndDropBankFileFields) {
                vm.dragAndDropBankFileFields.destroy()
            }

            if (vm.dragAndDropComplexTransactionLines) {
                vm.dragAndDropComplexTransactionLines.destroy()
            }

            if (vm.dragAndDropComplexTransactionFields) {
                vm.dragAndDropComplexTransactionFields.destroy()
            }

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };

        vm.syncStatuses = function () {

            vm.complexTransactionList = vm.complexTransactionList.map(function (item, index) {

                // MATCHED = 1
                // UNMATCHED = 2
                // AUTO_MATCHED = 3
                // IGNORE = 4

                item.unmatched_fields = item.recon_fields.filter(function (item) {
                    return item.status === 2
                });

                item.matched_fields = item.recon_fields.filter(function (item) {
                    return item.status === 1
                });

                item.auto_matched_fields = item.recon_fields.filter(function (item) {
                    return item.status === 3
                });

                item.ignore_fields = item.recon_fields.filter(function (item) {
                    return item.status === 4
                });

                item.___match_index = index;

                return item;

            });

            vm.bankLinesList = vm.bankLinesList.map(function (item, index) {

                // MATCHED = 1
                // CONFLICT = 2
                // RESOLVED = 3
                // IGNORE = 4
                // AUTO_MATCHED = 5

                item.ignore_fields = item.fields.filter(function (item) {
                    return item.status === 4
                });

                item.auto_matched_fields = item.fields.filter(function (item) {
                    return item.status === 5
                });

                item.matched_fields = item.fields.filter(function (item) {
                    return item.status === 1
                });

                item.resolved_fields = item.fields.filter(function (item) {
                    return item.status === 3
                });

                item.conflicts_fields = item.fields.filter(function (item) {
                    return item.status === 2
                });

                item.new_fields = item.fields.filter(function (item) {
                    return !item.status
                });

                item.___match_index = index;

                return item;
            });

            vm.initDragula();

        };

        vm.getLists = function () {

            var parentFlatList = vm.parentEntityViewerDataService.getFlatList();

            var flatList = vm.reconViewerDataService.getFlatList();

            console.log('parentFlatList', parentFlatList);
            console.log('flatList', flatList);


            vm.complexTransactionList = parentFlatList.filter(function (item) {
                return item.___is_activated
            });

            vm.bankLinesList = flatList.filter(function (item) {
                return item.___is_activated;
            });

            vm.syncStatuses();

        };

        vm.init = function () {

            vm.parentEntityViewerEventService.addEventListener(evEvents.REDRAW_TABLE, function () {

                vm.destroyDragula();

                vm.getLists();
            });

            vm.reconciliationEventService.addEventListener(evEvents.REDRAW_TABLE, function () {

                vm.destroyDragula();

                vm.getLists();
            });

            vm.getLists();

            console.log("vm", vm);

            console.log('parentSelectedList', vm.complexTransactionList);
            console.log('selectedList', vm.bankLinesList);


        };

        vm.init();
    }

}());