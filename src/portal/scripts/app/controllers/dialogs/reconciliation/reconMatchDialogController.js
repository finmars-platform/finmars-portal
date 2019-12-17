/**
 * Created by szhitenev on 11.12.2019.
 */
(function () {

    'use strict';

    var reconciliationBankFieldService = require('../../../services/reconciliation/reconciliationBankFieldService');
    var reconciliationComplexTransactionFieldService = require('../../../services/reconciliation/reconciliationComplexTransactionFieldService');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.parentEntityViewerDataService = data.parentEntityViewerDataService;
        vm.entityViewerDataService = data.entityViewerDataService;

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

        vm.createBankField = function (field) {

            delete field.id;

            reconciliationBankFieldService.create(field).then(function (data) {

                console.log('bank field created', data);

                field.processing = false;

                field = data;

                $scope.$apply();

            })


        };

        vm.updateBankFieldStatus = function (field) {

            reconciliationBankFieldService.update(field.id, field).then(function (data) {

                console.log('bank field updated', data);

                field.processing = false;

                $scope.$apply();

            })

        };

        vm.updateComplexTransactionFieldStatus = function(field) {

            reconciliationComplexTransactionFieldService.update(field.id, field).then(function (data) {

                console.log('complex transaction field updated', data);

                field.processing = false;

                $scope.$apply();

            })

        }

        vm.initDragula = function () {

            var dragAndDropBankFile = {

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
                        var fieldType = elem.dataset.fieldType;
                        var parentIndex = parseInt(elem.dataset.parentIndex, 10);

                        console.log('status', status);
                        console.log('fieldId', fieldId);
                        console.log('fieldType', fieldType);
                        console.log('parentIndex', parentIndex);

                        var field;

                        vm.bankLinesList.forEach(function (item) {

                            if (item.___match_index === parentIndex) {
                                item.fields.forEach(function (itemField) {

                                    if (itemField.id === fieldId) {
                                        field = itemField;
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
                                vm.createBankField(field)
                            } else {
                                vm.updateBankFieldStatus(field)
                            }
                        }


                    });

                    drake.on('dragend', function (element) {

                        if (areaItemsChanged) {
                            $scope.$apply();
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

                            if (target.classList.contains(elClass)) {
                                return true;
                            }

                            return false;
                        }
                    });

                }
            };
            var dragAndDropComplexTransaction = {

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

                        vm.complexTransactionList.forEach(function (item) {

                            if (item.___match_index === parentIndex) {
                                item.recon_fields.forEach(function (itemField) {

                                    if (itemField.id === fieldId) {
                                        field = itemField;
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

                            vm.updateComplexTransactionFieldStatus(field)
                        }

                    });

                    drake.on('dragend', function (element) {

                        if (areaItemsChanged) {
                            $scope.$apply();
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

                            if (target.classList.contains(elClass)) {
                                return true;
                            }

                            return false;
                        }
                    });

                }
            };

            setTimeout(function () {
                dragAndDropBankFile.init();
                dragAndDropComplexTransaction.init();
            }, 500);

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };

        vm.init = function () {

            console.log("vm", vm);

            var parentFlatList = vm.parentEntityViewerDataService.getFlatList();

            var flatList = vm.entityViewerDataService.getFlatList();

            console.log('parentFlatList', parentFlatList);
            console.log('flatList', flatList);


            vm.complexTransactionList = parentFlatList.filter(function (item) {
                return item.___is_activated
            });

            vm.bankLinesList = flatList.filter(function (item) {
                return item.___is_activated;
            });

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

            console.log('parentSelectedList', vm.complexTransactionList);
            console.log('selectedList', vm.bankLinesList);

            vm.initDragula();

        };

        vm.init();
    }

}());