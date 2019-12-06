/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var referenceTablesService = require('../../services/referenceTablesService');

    module.exports = function ($scope, $mdDialog, data) {

        console.log('data', data);

        var vm = this;

        vm.referenceTable = data.referenceTable;
        vm.validationEnabled = false;
        vm.dragAndDropInited = false;

        vm.cancel = function () {
            $mdDialog.hide();
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
                    document.addEventListener('wheel', DnDWheel);
                });

                drake.on('drop', function (elem, target, source, nextSiblings) {
                    //var refTableRows = document.querySelectorAll('.e-reference-table-row-card');
                    var draggedRowOrder = parseInt(elem.dataset.rowOrder);
                    var siblingRowOrder = null;
                    if (nextSiblings) {
                        siblingRowOrder = parseInt(nextSiblings.dataset.rowOrder);
                    }

                    //var rowToInsert = null;

                    var rowToInsert = vm.referenceTable.rows[draggedRowOrder];
                    vm.referenceTable.rows.splice(draggedRowOrder, 1);

                    /*for (var i = 0; i < vm.referenceTable.rows.length; i++) {
                        if (vm.referenceTable.rows[i].order === draggedRowOrder) {

                            rowToInsert = vm.referenceTable.rows[i];
                            vm.referenceTable.rows.splice(i, 1);
                            break;

                        }
                    }*/

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
                    document.removeEventListener('wheel', DnDWheel);
                });
            },

            dragulaInit: function () {
                var items = [
                    document.querySelector('.referenceTableRowsHolder')
                ];

                this.dragula = dragula(items, {
                    moves: function (elem, target, source, sibling) {
                        return vm.dragIconGrabbed;
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
                DnDScrollElem = document.querySelector('.dndScrollableElem');
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