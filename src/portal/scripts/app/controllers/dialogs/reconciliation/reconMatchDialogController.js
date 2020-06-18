/**
 * Created by szhitenev on 11.12.2019.
 */
(function () {

    'use strict';

    var reconciliationBankFieldService = require('../../../services/reconciliation/reconciliationBankFieldService');
    var reconciliationNewBankFieldService = require('../../../services/reconciliation/reconciliationNewBankFieldService');
    var reconciliationComplexTransactionFieldService = require('../../../services/reconciliation/reconciliationComplexTransactionFieldService');

    var reconMatchHelper = require('../../../helpers/reconMatchHelper');

    module.exports = function reconMatchDialogController($scope, $mdDialog, data) {

        var vm = this;

        vm.parentEntityViewerDataService = data.parentEntityViewerDataService;
        vm.reconViewerDataService = data.entityViewerDataService;

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

        vm.createBankField = function (bankLine, field) {

            return new Promise(function (resolve, reject) {

                // console.trace();

                var newField = Object.assign({}, field);

                delete newField.id;

                reconciliationBankFieldService.create(newField).then(function (data) {

                    console.log('bank field created', data);

                    field.processing = false;

                    field = data;

                    vm.bankLinesList = vm.bankLinesList.map(function (line) {

                        if (line.___match_index === bankLine.___match_index) {

                            line.fields = line.fields.map(function (lineField) {

                                if (lineField.reference_name === field.reference_name) {
                                    return field
                                }

                                return lineField

                            })

                        }

                        return line
                    });


                    vm.syncStatuses();

                    resolve(data);

                })

            })


        };

        vm.createNewBankField = function (bankLine, field) {

            return new Promise(function (resolve, reject) {

                var oldField = Object.assign({}, field)
                var newField = Object.assign({}, field);

                delete newField.id;
                delete newField.linked_complex_transaction_field;
                delete newField.status;

                reconciliationNewBankFieldService.create(newField).then(function (data) {

                    reconciliationBankFieldService.deleteByKey(field.id).then(function (value) {

                        field = data;
                        field.status = undefined;

                        vm.bankLinesList = vm.bankLinesList.map(function (line) {

                            if (line.___match_index === bankLine.___match_index) {

                                line.fields = line.fields.map(function (lineField) {

                                    if (lineField.id === oldField.id) {
                                        return field
                                    }

                                    return lineField

                                })

                            }

                            return line
                        });


                        vm.syncStatuses();

                        resolve(data);


                    })

                })

            })
        };

        vm.updateBankFieldStatus = function (bankLine, field) {

            return new Promise(function (resolve, reject) {

                reconciliationBankFieldService.update(field.id, field).then(function (data) {

                    console.log('bank field updated', data);

                    field.processing = false;

                    vm.bankLinesList = vm.bankLinesList.map(function (line) {

                        if (line.___match_index === bankLine.___match_index) {

                            line.fields = line.fields.map(function (lineField) {

                                if (lineField.id === field.id) {
                                    return field
                                }

                                return lineField

                            })

                        }

                        return line
                    });


                    vm.syncStatuses();


                    resolve(data);


                })

            })
        };

        vm.updateComplexTransactionFieldStatus = function (complexTransaction, field) {

            return new Promise(function (resolve, reject) {


                reconciliationComplexTransactionFieldService.update(field.id, field).then(function (data) {

                    console.log('complex transaction field updated', data);

                    field.processing = false;

                    field = data;

                    vm.complexTransactionList = vm.complexTransactionList.map(function (line) {

                        if (line.id === complexTransaction.id) {

                            line.recon_fields = line.recon_fields.map(function (lineField) {

                                if (lineField.id === field.id) {
                                    return field
                                }

                                return lineField

                            })

                        }

                        return line
                    });

                    vm.syncStatuses();

                    resolve(field);

                })

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

        vm.activateBankCard = function ($event, field, line) {

            var status = !field.active;

            vm.bankLinesList = vm.bankLinesList.map(function (line) {

                line.fields = line.fields.map(function (reconField) {

                    reconField.active = false;

                    return reconField

                });

                return line;

            });

            vm.complexTransactionList = vm.complexTransactionList.map(function (line) {

                line.recon_fields = line.recon_fields.map(function (reconField) {

                    reconField.active = false;

                    return reconField

                });

                return line;

            });

            field.active = status;

            if (field.active && field.linked_complex_transaction_field) {

                vm.complexTransactionList = vm.complexTransactionList.map(function (line) {

                    line.recon_fields = line.recon_fields.map(function (reconField) {

                        if (reconField.id === field.linked_complex_transaction_field) {
                            reconField.active = true
                        }

                        return reconField

                    });

                    return line;

                });

            }

            console.log('vm.activateBankCard.$event', $event);
            console.log('vm.activateBankCard.field', field);
            console.log('vm.activateBankCard.line', line);

        };

        vm.activateComplexTransactionCard = function ($event, field, line) {

            var status = !field.active;

            vm.bankLinesList = vm.bankLinesList.map(function (line) {

                line.fields = line.fields.map(function (reconField) {

                    reconField.active = false;

                    return reconField

                });

                return line;

            });

            vm.complexTransactionList = vm.complexTransactionList.map(function (line) {

                line.recon_fields = line.recon_fields.map(function (reconField) {

                    reconField.active = false;

                    return reconField

                });

                return line;

            });

            field.active = status;

            if (field.active) {

                vm.bankLinesList = vm.bankLinesList.map(function (line) {

                    line.fields = line.fields.map(function (reconField) {

                        if (reconField.linked_complex_transaction_field) {

                            if (reconField.linked_complex_transaction_field === field.id) {
                                reconField.active = true
                            }

                        }

                        return reconField

                    });

                    return line;

                });

            }

            console.log('vm.activateComplexTransactionCard.$event', $event);
            console.log('vm.activateComplexTransactionCard.field', field);
            console.log('vm.activateComplexTransactionCard.line', line);

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
                    entityId: item.id,
                    data: {}
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

        vm.turnOffDragging = function () {
            vm.dragIconGrabbed = false;
        };

        vm.turnOnDragging = function () {
            vm.dragIconGrabbed = true;
            document.body.addEventListener('mouseup', vm.turnOffDragging, {once: true});
        };

        // scroll while dragging
        var DnDScrollElem;
        var DnDScrollTimeOutId;
        var scrollSize = null;

        var DnDWheel = function (event) {
            event.preventDefault();

            var scrolled = DnDScrollElem.scrollTop;

            if (scrollSize === null) {
                scrollSize = scrolled
            }

            if (event.deltaY > 0) {
                scrollSize = scrollSize + 100;
            } else {
                scrollSize = scrollSize - 100;
            }

            clearTimeout(DnDScrollTimeOutId);

            DnDScrollTimeOutId = setTimeout(function () { // timeout needed for smoother scroll
                DnDScrollElem.scroll({
                    top: Math.max(0, scrollSize)
                });
                scrollSize = null;
            }, 30);

        };
        // < scroll while dragging >


        vm.initDragula = function () {

            var dragAndDropBankFileLines = {

                init: function () {
                    this.dragulaInit();
                    this.eventListeners();
                },

                eventListeners: function () {

                    var drake = this.dragula;

                    drake.on('over', function (elem, container, source) {
                        $(container).addClass('active');
                    });

                    drake.on('drag', function () {
                        document.addEventListener('wheel', DnDWheel);
                    });

                    drake.on('out', function (elem, container, source) {
                        $(container).removeClass('active');
                    });

                    drake.on('dragend', function (elem) {
                        document.removeEventListener('wheel', DnDWheel);
                    });

                },

                dragulaInit: function () {

                    var items = [];

                    var elements = document.querySelectorAll('.dialogBankLineContainerHolder');

                    for (var i = 0; i < elements.length; i = i + 1) {
                        items.push(elements[i])
                    }

                    this.dragula = dragula(items, {
                        revertOnSpill: true,
                        moves: function () {
                            return vm.dragIconGrabbed
                        }
                    });

                }
            };

            var dragAndDropComplexTransactionLines = {

                init: function () {
                    this.dragulaInit();
                    this.eventListeners();
                },

                eventListeners: function () {

                    var drake = this.dragula;

                    drake.on('over', function (elem, container, source) {
                        $(container).addClass('active');
                    });

                    drake.on('drag', function () {
                        document.addEventListener('wheel', DnDWheel);
                    });

                    drake.on('out', function (elem, container, source) {
                        $(container).removeClass('active');
                    });

                    drake.on('dragend', function (elem) {
                        document.removeEventListener('wheel', DnDWheel);
                    });

                },

                dragulaInit: function () {

                    var elements = document.querySelectorAll('.dialogComplexTransactionLineContainerHolder');
                    var items = [];

                    for (var i = 0; i < elements.length; i = i + 1) {
                        items.push(elements[i])
                    }

                    this.dragula = dragula(items, {
                        revertOnSpill: true,
                        moves: function () {
                            return vm.dragIconGrabbed
                        }
                    });

                }
            };

            var dragAndDropFields = {

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

                    drake.on('drag', function () {
                        document.addEventListener('wheel', DnDWheel);
                    });

                    drake.on('dragend', function (elem) {
                        document.removeEventListener('wheel', DnDWheel);
                    });

                    drake.on('over', function (elem, container, source) {

                        console.log('over.elem', elem);
                        console.log('over.container', container);
                        console.log('over.source', source);

                        areaItemsChanged = false;
                        $(container).addClass('active');
                    });

                    drake.on('out', function (elem, container, source) {
                        $(container).removeClass('active');
                    });

                    drake.on('shadow', function (elem, container) { // used to prevent showing shadow of card in deletion area

                        console.log('elem', {elem: elem});

                        var cardType = elem.dataset.type;
                        var containerType;

                        if (container.classList.contains('dialogComplexTransactionLineContainer')) {
                            containerType = 'complex-transaction'
                        }

                        if (container.classList.contains('dialogBankLineContainer')) {
                            containerType = 'bank-file'
                        }

                        if (cardType !== containerType) {
                            $(elem).hide();
                        } else {
                            $(elem).show();
                        }

                    });

                    drake.on('drop', function (elem, target, source, nextSibling) {

                        console.log("Here vm", vm);
                        console.log("nextSibling", nextSibling);

                        console.log('target', target);
                        console.log('elem', elem);

                        var targetStatus = target.dataset.status;
                        var targetType = target.dataset.type;

                        var elemType = elem.dataset.type;
                        var elemFieldType = elem.dataset.fieldType;
                        var elemFieldId = parseInt(elem.dataset.fieldId, 10);
                        var elemParentIndex = parseInt(elem.dataset.parentIndex, 10);

                        var nextSiblingFieldId;
                        var nextSiblingParentIndex;
                        var nextSiblingFieldType;

                        if (nextSibling) {
                            nextSiblingFieldId = parseInt(nextSibling.dataset.fieldId, 10);
                            nextSiblingParentIndex = parseInt(nextSibling.dataset.nextSibling, 10);
                            nextSiblingFieldType = nextSibling.dataset.fieldType;
                        }

                        console.log('elemType', elemType);
                        console.log('targetType', targetType);
                        console.log('targetStatus', targetStatus);
                        console.log('elemFieldId', elemFieldId);
                        console.log('elemParentIndex', elemParentIndex);

                        if (elemType === targetType) {

                            var field;
                            var complexTransaction;

                            if (elemType === 'bank-file') {

                                var bankFileLine = reconMatchHelper.getBankLineByFieldId(elemFieldId, elemFieldType, vm.bankLinesList);
                                var bankFileField = reconMatchHelper.getBankFileField(elemFieldId, elemFieldType, vm.bankLinesList);
                                var bankFileFieldStatus = reconMatchHelper.getBankFieldStatusNameById(bankFileField.status);

                                bankFileLine.linked_complex_transaction_field = null;

                                if (nextSibling) {

                                    var nextSiblingBankFileLine = reconMatchHelper.getBankLineByFieldId(nextSiblingFieldId, nextSiblingFieldType, vm.bankLinesList);
                                    var nextSiblingBankFileField = reconMatchHelper.getBankFileField(nextSiblingFieldId, nextSiblingFieldType, vm.bankLinesList);

                                    var nextSiblingBankFileFieldStatus = reconMatchHelper.getBankFieldStatusNameById(nextSiblingBankFileField.status);

                                    console.log('targetStatus', targetStatus);
                                    console.log('bankFileFieldStatus', bankFileFieldStatus);
                                    console.log('nextSiblingBankFileFieldStatus', nextSiblingBankFileFieldStatus);


                                    if (bankFileFieldStatus === 'new' && nextSiblingBankFileFieldStatus === 'new' && targetStatus === 'new') {

                                        bankFileField.status = reconMatchHelper.getBankFieldStatusIdByName('resolved');

                                        vm.createBankField(bankFileLine, bankFileField).then(function (value) {

                                            nextSiblingBankFileField.status = reconMatchHelper.getBankFieldStatusIdByName('resolved');

                                            vm.createBankField(nextSiblingBankFileLine, nextSiblingBankFileField).then(function (value1) {

                                                $scope.$apply();

                                            })

                                        })


                                    }

                                    if (['ignore', 'matched', 'auto_matched', 'resolved', 'conflict'].indexOf(bankFileFieldStatus) !== -1 && nextSiblingBankFileFieldStatus === 'new' && targetStatus === 'new') {

                                        bankFileField.status = reconMatchHelper.getBankFieldStatusIdByName('resolved');

                                        vm.updateBankFieldStatus(bankFileLine, bankFileField).then(function (value) {

                                            nextSiblingBankFileField.status = reconMatchHelper.getBankFieldStatusIdByName('resolved');

                                            vm.createBankField(nextSiblingBankFileLine, nextSiblingBankFileField).then(function (value1) {

                                                $scope.$apply();

                                            })

                                        });

                                    }

                                    if (bankFileFieldStatus === 'matched' && nextSiblingBankFileFieldStatus === 'conflict' && targetStatus === 'conflict') {

                                        bankFileField.status = reconMatchHelper.getBankFieldStatusIdByName('resolved');

                                        vm.updateBankFieldStatus(bankFileLine, bankFileField).then(function (value) {

                                            nextSiblingBankFileField.status = reconMatchHelper.getBankFieldStatusIdByName('resolved');

                                            vm.createBankField(nextSiblingBankFileLine, nextSiblingBankFileField).then(function (value1) {

                                                $scope.$apply();

                                            })

                                        });

                                    }

                                    if (bankFileFieldStatus === 'auto_matched' && nextSiblingBankFileFieldStatus === 'conflict' && targetStatus === 'conflict') {

                                        bankFileField.status = reconMatchHelper.getBankFieldStatusIdByName('resolved');

                                        vm.updateBankFieldStatus(bankFileLine, bankFileField).then(function (value) {

                                            nextSiblingBankFileField.status = reconMatchHelper.getBankFieldStatusIdByName('resolved');

                                            vm.createBankField(nextSiblingBankFileLine, nextSiblingBankFileField).then(function (value1) {

                                                $scope.$apply();

                                            })

                                        });

                                    }

                                    if (bankFileFieldStatus === 'new' && nextSiblingBankFileFieldStatus === 'conflict' && targetStatus === 'conflict') {

                                        bankFileField.status = reconMatchHelper.getBankFieldStatusIdByName('resolved');

                                        vm.updateBankFieldStatus(bankFileLine, bankFileField).then(function (value) {

                                            nextSiblingBankFileField.status = reconMatchHelper.getBankFieldStatusIdByName('resolved');

                                            vm.createBankField(nextSiblingBankFileLine, nextSiblingBankFileField).then(function (value1) {

                                                $scope.$apply();

                                            })

                                        });

                                    }

                                    if (bankFileFieldStatus === 'conflict' && nextSiblingBankFileFieldStatus === 'conflict' && targetStatus === 'conflict') {

                                        bankFileField.status = reconMatchHelper.getBankFieldStatusIdByName('resolved');

                                        vm.updateBankFieldStatus(bankFileLine, bankFileField).then(function (value) {

                                            nextSiblingBankFileField.status = reconMatchHelper.getBankFieldStatusIdByName('resolved');

                                            vm.updateBankFieldStatus(nextSiblingBankFileLine, nextSiblingBankFileField).then(function (value1) {

                                                $scope.$apply();

                                            })

                                        });

                                    }

                                    if (bankFileFieldStatus === 'ignore' && nextSiblingBankFileFieldStatus === 'conflict' && targetStatus === 'conflict') {

                                        bankFileField.status = reconMatchHelper.getBankFieldStatusIdByName('resolved');

                                        vm.updateBankFieldStatus(bankFileLine, bankFileField).then(function (value) {

                                            nextSiblingBankFileField.status = reconMatchHelper.getBankFieldStatusIdByName('resolved');

                                            vm.updateBankFieldStatus(nextSiblingBankFileLine, nextSiblingBankFileField).then(function (value1) {

                                                $scope.$apply();

                                            })

                                        });

                                    }

                                    if (targetStatus === 'ignore') {
                                        bankFileField.status = reconMatchHelper.getBankFieldStatusIdByName(targetStatus);

                                        if (bankFileFieldStatus === 'new') {
                                            vm.createBankField(bankFileLine, bankFileField).then(function (value) {
                                                $scope.$apply();
                                            })
                                        } else {
                                            vm.updateBankFieldStatus(bankFileLine, bankFileField).then(function (value) {
                                                $scope.$apply();
                                            })
                                        }

                                    }


                                } else {

                                    if (targetStatus === 'new') {

                                        vm.createNewBankField(bankFileLine, bankFileField).then(function (value) {
                                            $scope.$apply();
                                        })

                                    } else {

                                        bankFileField.status = reconMatchHelper.getBankFieldStatusIdByName(targetStatus);

                                        if (bankFileFieldStatus === 'new') {
                                            vm.createBankField(bankFileLine, bankFileField).then(function (value) {
                                                $scope.$apply();
                                            })
                                        } else {
                                            vm.updateBankFieldStatus(bankFileLine, bankFileField).then(function (value) {
                                                $scope.$apply();
                                            })
                                        }

                                    }


                                }

                            }

                            if (elemType === 'complex-transaction') {

                                var complexTransactionLine = reconMatchHelper.getComplexTransactionLineByFieldId(elemFieldId, vm.complexTransactionList);
                                var complexTransactionField = reconMatchHelper.getComplexTransactionField(elemFieldId, vm.complexTransactionList);

                                complexTransactionField.status = reconMatchHelper.getComplexTransactionFieldStatusIdByName(targetStatus);

                                vm.updateComplexTransactionFieldStatus(complexTransactionLine, complexTransactionField).then(function (value) {
                                    $scope.$apply();
                                })

                            }

                        } else {

                            console.log("Drop on other side");

                            if (nextSibling) {

                                var bankFileLine;
                                var bankFileField;
                                var complexTransactionLine;
                                var complexTransactionField;

                                if (elemType === 'complex-transaction') {

                                    bankFileLine = reconMatchHelper.getBankLineByFieldId(nextSiblingFieldId, nextSiblingFieldType, vm.bankLinesList);
                                    bankFileField = reconMatchHelper.getBankFileField(nextSiblingFieldId, nextSiblingFieldType, vm.bankLinesList);
                                    complexTransactionLine = reconMatchHelper.getComplexTransactionLineByFieldId(elemFieldId, vm.complexTransactionList);
                                    complexTransactionField = reconMatchHelper.getComplexTransactionField(elemFieldId, vm.complexTransactionList);

                                }

                                if (elemType === 'bank-file') {

                                    bankFileLine = reconMatchHelper.getBankLineByFieldId(elemFieldId, elemFieldType, vm.bankLinesList);
                                    bankFileField = reconMatchHelper.getBankFileField(elemFieldId, elemFieldType, vm.bankLinesList);
                                    complexTransactionLine = reconMatchHelper.getComplexTransactionLineByFieldId(nextSiblingFieldId, vm.complexTransactionList);
                                    complexTransactionField = reconMatchHelper.getComplexTransactionField(nextSiblingFieldId, vm.complexTransactionList);

                                }

                                var bankFileFieldStatus = reconMatchHelper.getBankFieldStatusNameById(bankFileField.status);
                                var complexTransactionFieldStatus = reconMatchHelper.getComplexTransactionFieldStatusNameById(complexTransactionField.status);


                                console.log("Result bankFileField?", bankFileField);
                                console.log("Result complexTransactionField?", complexTransactionField);

                                console.log("Result bankFileFieldStatus?", bankFileFieldStatus);
                                console.log("Result complexTransactionFieldStatus?", complexTransactionFieldStatus);


                                if (['new', 'conflict', 'resolved', 'ignore', 'matched', 'auto_matched'].indexOf(bankFileFieldStatus) !== -1 &&
                                    ['unmatched', 'ignore'].indexOf(complexTransactionFieldStatus) !== -1) {

                                    bankFileField.status = reconMatchHelper.getBankFieldStatusIdByName('matched');

                                    bankFileField.linked_complex_transaction_field = complexTransactionField.id;


                                    bankFileLine.new_fields = bankFileLine.new_fields.filter(function (item) {
                                        return item.id !== bankFileField.id
                                    });
                                    bankFileLine.conflicts_fields = bankFileLine.conflicts_fields.filter(function (item) {
                                        return item.id !== bankFileField.id
                                    });
                                    bankFileLine.resolved_fields = bankFileLine.resolved_fields.filter(function (item) {
                                        return item.id !== bankFileField.id
                                    });
                                    bankFileLine.ignore_fields = bankFileLine.ignore_fields.filter(function (item) {
                                        return item.id !== bankFileField.id
                                    });
                                    bankFileLine.auto_matched_fields = bankFileLine.auto_matched_fields.filter(function (item) {
                                        return item.id !== bankFileField.id
                                    });
                                    bankFileLine.matched_fields = bankFileLine.matched_fields.filter(function (item) {
                                        return item.id !== bankFileField.id
                                    });

                                    console.log('bankFileLine', bankFileLine);


                                    bankFileLine.matched_fields.push(bankFileField);

                                    if (bankFileFieldStatus === 'new') {
                                        vm.createBankField(bankFileLine, bankFileField).then(function (value) {
                                            $scope.$apply();
                                        })
                                    } else {
                                        vm.updateBankFieldStatus(bankFileLine, bankFileField).then(function (value) {
                                            $scope.$apply();
                                        })
                                    }


                                    complexTransactionField.status = reconMatchHelper.getComplexTransactionFieldStatusIdByName('matched');

                                    complexTransactionLine.matched_fields.push(complexTransactionField);
                                    complexTransactionLine.unmatched_fields = complexTransactionLine.unmatched_fields.filter(function (item) {
                                        return item.id !== complexTransactionField.id
                                    });

                                    complexTransactionLine.ignore_fields = complexTransactionLine.ignore_fields.filter(function (item) {
                                        return item.id !== complexTransactionField.id
                                    });

                                    vm.updateComplexTransactionFieldStatus(complexTransactionLine, complexTransactionField).then(function (value) {
                                        $scope.$apply();
                                    })

                                }


                            } else {

                                drake.cancel(true);
                                $(elem).show();

                            }

                        }

                    });

                },

                dragulaInit: function () {

                    var bankLineElements = document.querySelectorAll('.dialogBankLineContainer');

                    var complexTransactionElements = document.querySelectorAll('.dialogComplexTransactionLineContainer');

                    var items = [];

                    for (var i = 0; i < bankLineElements.length; i = i + 1) {
                        items.push(bankLineElements[i])
                    }

                    for (var i = 0; i < complexTransactionElements.length; i = i + 1) {
                        items.push(complexTransactionElements[i])
                    }

                    this.dragula = dragula(items, {
                        revertOnSpill: true,
                        accepts: function (el, target, source, sibling) {

                            var complexTransactionElClass = 'dialogComplexTransactionLineContainer-' + el.dataset.parentIndex;
                            var bankLineElClass = 'dialogBankLineContainer-' + el.dataset.parentIndex;

                            var elemType = el.dataset.type;

                            if (target.dataset.status === 'auto_matched') {
                                return false;
                            }

                            if (target.className.indexOf('dialogBankLineContainer') !== -1 && elemType === 'bank-line') {

                                // allow move bank file fields only in bank file line

                                if (target.classList.contains(bankLineElClass)) {
                                    return true
                                } else {
                                    return false
                                }

                            }


                            if (target.className.indexOf('dialogComplexTransactionLineContainer') !== -1 && elemType === 'complex-transaction') {

                                // allow move bank file fields only in bank file line

                                if (target.classList.contains(complexTransactionElClass)) {
                                    return true
                                } else {
                                    return false
                                }

                            }

                            return true;

                        }
                    });

                }
            };

            setTimeout(function () {

                DnDScrollElem = document.querySelector('.dndScrollableElem');
                dragAndDropBankFileLines.init();
                dragAndDropComplexTransactionLines.init();
                dragAndDropFields.init();

            }, 500);

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

        };

        vm.agree = function () {

            vm.complexTransactionList.forEach(function (complexTransaction) {

                var data = vm.parentEntityViewerDataService.getData(complexTransaction.___parentId);

                data.results = data.results.map(function (item) {

                    if (item.___id === complexTransaction.___id) {
                        return complexTransaction;
                    }

                    return item

                });

            });

            vm.bankLinesList.forEach(function (bankLine) {

                var data = vm.reconViewerDataService.getData(bankLine.___parentId);

                data.results = data.results.map(function (item) {

                    if (item.___id === bankLine.___id) {
                        return bankLine;
                    }

                    return item

                });

            });


            $mdDialog.hide({status: 'agree'});
        };

        vm.init = function () {

            console.log("vm", vm);

            var parentFlatList = vm.parentEntityViewerDataService.getFlatList();

            var flatList = vm.reconViewerDataService.getFlatList();

            vm.complexTransactionList = parentFlatList.filter(function (item) {
                return item.___is_activated && !item.is_canceled
            });

            vm.bankLinesList = flatList.filter(function (item) {
                return item.___is_activated;
            });


            vm.syncStatuses();

            console.log('parentSelectedList', vm.complexTransactionList);
            console.log('selectedList', vm.bankLinesList);

            vm.initDragula();

        };

        vm.init();
    }

}());