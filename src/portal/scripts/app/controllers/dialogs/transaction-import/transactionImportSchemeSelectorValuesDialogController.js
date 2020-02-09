/**
 * Created by szhitenev on 09.12.2019.
 */
(function () {

    'use strict';

    var ScrollHelper = require('../../../helpers/scrollHelper');

    var scrollHelper = new ScrollHelper();

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.scheme = data.scheme;
        vm.dragAndDropInited = false;

        vm.filterTerms = {
            value: "",
            notes: ""
        };

        vm.deleteSelector = function($event, $index) {
            vm.scheme.selector_values.splice($index, 1);
        };

        vm.addSelector = function () {
            vm.scheme.selector_values.push({
               value: '',
               notes: '',
               order: vm.scheme.selector_values.length
            });
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

                    var rowToInsert = vm.scheme.selector_values[draggedRowOrder];
                    vm.scheme.selector_values.splice(draggedRowOrder, 1);

                    if (siblingRowOrder) {

                        for (var i = 0; i < vm.scheme.selector_values.length; i++) {
                            if (vm.scheme.selector_values[i].order === siblingRowOrder) {

                                vm.scheme.selector_values.splice(i, 0, rowToInsert);
                                break;

                            }
                        }

                    } else {
                        vm.scheme.selector_values.push(rowToInsert);
                    }

                    for (var i = 0; i < vm.scheme.selector_values.length; i++) {
                        vm.scheme.selector_values[i].order = i;
                    }

                });

                drake.on('dragend', function (elem) {
                    document.removeEventListener('wheel', scrollHelper.DnDWheelScroll);
                });
            },

            dragulaInit: function () {
                var items = [
                    document.querySelector('.transactionImportSchemeSelectorValues')
                ];

                this.dragula = dragula(items, {
                    moves: function () {
                        if (vm.dragIconGrabbed && !vm.filterTerms.value && !vm.filterTerms.notes) {
                            return true;
                        }

                        return false;
                    },
                    revertOnSpill: true
                })
            }
        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };

        var init = function () {
            var DnDScrollElem = document.querySelector('.vc-dnd-scrollable-elem');
            scrollHelper.setDnDScrollElem(DnDScrollElem);

            vm.scheme.selector_values.forEach(function (row, index) {
                if (!row.order) {
                    row.order = index;
                }
            });
        };

        init();
    }

}());