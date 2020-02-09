/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var referenceTablesService = require('../../services/referenceTablesService');

    var ScrollHelper = require('../../helpers/scrollHelper');

    var scrollHelper = new ScrollHelper();

    module.exports = function ($scope, $mdDialog, data) {

        console.log('data', data);

        var vm = this;

        vm.referenceTable = data.referenceTable;
        vm.validationEnabled = false;
        vm.dragAndDropInited = false;

        vm.filterTerms = {
            key: "",
            value: ""
        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.createRow = function () {

            vm.referenceTable.rows.push({
                key: '',
                value: '',
                order: vm.referenceTable.rows.length
            });

        };

        vm.deleteRow = function ($event, $index) {

            vm.referenceTable.rows.splice($index, 1);

            vm.checkForDuplicates()
        };

        vm.checkForDuplicates = function () {

            var keysCount = {};

            vm.referenceTable.rows.forEach(function (row) {

                if (!keysCount[row.key]) {
                    keysCount[row.key] = 0
                }

                keysCount[row.key] = keysCount[row.key] + 1;

            });

            vm.referenceTable.rows = vm.referenceTable.rows.map(function (row) {

                if (keysCount[row.key] > 1) {
                    row.is_duplicate = true;
                } else {
                    row.is_duplicate = false;
                }

                return row

            })

        };

        vm.dragIconGrabbed = false;

        var turnOffDragging = function () {
            vm.dragIconGrabbed = false;
        };

        vm.turnOnDragging = function () {
            vm.dragIconGrabbed = true;
            document.body.addEventListener('mouseup', turnOffDragging, {once: true});
        };

        vm.dragAndDrop = {
            init: function () {
                this.dragulaInit();
                this.eventListeners();
                vm.dragAndDropInited = true;
            },

            eventListeners: function () {
                var drake = this.dragula;

                drake.on('drag', function () {
                    document.addEventListener('wheel', scrollHelper.DnDWheelScroll);
                });

                drake.on('drop', function (elem, target, source, nextSiblings) {

                    var draggedRowOrder = parseInt(elem.dataset.rowOrder);
                    var siblingRowOrder = null;
                    if (nextSiblings) {
                        siblingRowOrder = parseInt(nextSiblings.dataset.rowOrder);
                    }

                    var rowToInsert = vm.referenceTable.rows[draggedRowOrder];
                    vm.referenceTable.rows.splice(draggedRowOrder, 1);

                    if (siblingRowOrder) {

                        for (var i = 0; i < vm.referenceTable.rows.length; i++) {
                            if (vm.referenceTable.rows[i].order === siblingRowOrder) {

                                vm.referenceTable.rows.splice(i, 0, rowToInsert);
                                break;

                            }
                        }

                    } else {
                        vm.referenceTable.rows.push(rowToInsert);
                    }

                    for (var i = 0; i < vm.referenceTable.rows.length; i++) {
                        vm.referenceTable.rows[i].order = i;
                    }

                });

                drake.on('dragend', function (elem) {
                    document.removeEventListener('wheel', scrollHelper.DnDWheelScroll);
                });
            },

            dragulaInit: function () {
                var items = [
                    document.querySelector('.referenceTableRowsHolder')
                ];

                this.dragula = dragula(items, {
                    moves: function () {
                        if (vm.dragIconGrabbed && !vm.filterTerms.key && !vm.filterTerms.value) {
                            return true;
                        }

                        return false;
                    },
                    revertOnSpill: true
                })
            }
        };

        vm.agree = function ($event) {

            vm.checkForDuplicates();

            var keysAreUnique = true;

            vm.referenceTable.rows.forEach(function (row, index) {

                if (row.is_duplicate) {
                    keysAreUnique = false;
                }

            });

            if (keysAreUnique) {

                vm.referenceTable.rows = vm.referenceTable.rows.filter(function (row) {

                    return row.key !== '' && row.value !== '';

                }).map(function (row) {

                    delete row.is_duplicate;

                    return row
                });

                referenceTablesService.update(vm.referenceTable.id, vm.referenceTable).then(function () {

                    $mdDialog.hide({status: 'agree'});

                });

            } else {

                $mdDialog.show({
                    controller: 'InfoDialogController as vm',
                    templateUrl: 'views/info-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true,
                    multiple: true,
                    locals: {
                        info: {
                            title: 'Warning',
                            description: 'The table contains duplicate Keys.'
                        }
                    }
                }).then(function (res) {

                    vm.validationEnabled = true;
                    vm.checkForDuplicates();


                })

            }

        };

        var init = function () {
            setTimeout(function () {
                var DnDScrollElem = document.querySelector('.dndScrollableElem');
                scrollHelper.setDnDScrollElem(DnDScrollElem);
            }, 500);

            vm.referenceTable.rows.forEach(function (row, index) { // TODO remove later
                if (!row.order) {
                    row.order = index;
                }
            });
        };

        init();

    }

}());