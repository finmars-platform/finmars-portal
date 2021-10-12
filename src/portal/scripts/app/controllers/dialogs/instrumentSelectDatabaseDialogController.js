/**
 * Created by szhitenev on 09.09.2021.
 */
(function () {

    'use strict';

    var instrumentService = require('../../services/instrumentService');
    var importInstrumentCbondsService = require('../../services/import/importInstrumentCbondsService');
    var toastNotificationService = require('../../../../../core/services/toastNotificationService');


    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.localInstrumentsTotal = 0;
        vm.databaseInstrumentsTotal = 0;
        vm.hoverInstrument = null;

        vm.databaseInstruments = [];
        vm.localInstruments = [];

        vm.inputText = data.inputText;
        vm.instrument_type = '';

        vm.instrumentTypeOptions = [
            {id: 'bonds', name: 'Bonds'},
            {id: 'stocks', name: 'Stocks'}
        ]


        vm.clearHoverInstrument = function () {

            setTimeout(function () {

                vm.hoverInstrument = null
                console.log('vm.hoverInstrument', vm.hoverInstrument)

                $scope.$apply();
            }, 0)

        }

        vm.setHoverInstrument = function ($event, option) {

            setTimeout(function () {

                vm.hoverInstrument = option
                console.log('scope.hoverInstrument', vm.hoverInstrument)

                $scope.$apply();
            }, 0)
        }

        vm.agree = function () {


            new Promise(function (resolve, reject) {


                vm.localInstruments.forEach(function (item) {

                    if (item.selected) {
                        vm.selectedItem = item;
                        resolve()
                    }

                })

                var selectedDatabaseInstrument;

                vm.databaseInstruments.forEach(function (item) {

                    if (item.selected) {
                        selectedDatabaseInstrument = item
                    }

                })

                if (selectedDatabaseInstrument) {
                    var config = {
                        instrument_code: selectedDatabaseInstrument.referenceId,
                        mode: 1
                    };


                    vm.isDisabled = true;

                    importInstrumentCbondsService.download(config).then(function (data) {


                        if (data.errors.length) {

                            vm.isDisabled = false;

                            vm.selectedItem = null;

                            toastNotificationService.error(data.errors[0])

                            $scope.$apply();

                            resolve()

                        } else {

                            vm.selectedItem = {
                                id: data.result_id,
                                name: selectedDatabaseInstrument.issueName,
                                user_code: selectedDatabaseInstrument.referenceId
                            }

                            resolve()


                        }

                    })


                }


            }).then(function (data) {

                if (vm.selectedItem) {
                    $mdDialog.hide({status: 'agree', data: {item: vm.selectedItem}});
                }

            })


        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.onInputTextChange = function () {

            vm.getList();

        }

        vm.selectLocalInstrument = function (item) {

            vm.databaseInstruments = vm.databaseInstruments.map(function (item) {

                item.selected = false;
                return item
            })

            vm.localInstruments = vm.localInstruments.map(function (item) {

                item.selected = false;
                return item
            })

            item.selected = true;

        }

        vm.getHighlighted = function (value) {

            var inputTextPieces = vm.inputText.split(' ')

            var resultValue;

            // Regular expression for multiple highlighting case insensitive results
            var reg = new RegExp("(?![^<]+>)(" + inputTextPieces.join("|") + ")", "ig");

            resultValue = value.replace(reg, '<span class="highlight">$1</span>');

            return resultValue

        }

        vm.selectDatabaseInstrument = function (item) {

            vm.databaseInstruments = vm.databaseInstruments.map(function (item) {

                item.selected = false;
                return item
            })

            vm.localInstruments = vm.localInstruments.map(function (item) {

                item.selected = false;
                return item
            })

            item.selected = true;

        }

        vm.updateLocalInstrument = function (item) {

            var config = {
                instrument_code: item.user_code,
                mode: 1
            };

            vm.isUpdatingInstrument = true;

            importInstrumentCbondsService.download(config).then(function (data) {

                vm.isUpdatingInstrument = false;

                $scope.$apply();


                if (data.errors.length) {

                    toastNotificationService.error(data.errors[0])


                } else {

                    toastNotificationService.success('Instrument ' + item.user_code + ' was updated')

                }

            })

        }

        vm.addInstrument = function ($event) {

            var dialogParent = document.querySelector('.dialog-containers-wrap');

            $mdDialog.show({
                controller: 'EntityViewerAddDialogController as vm',
                templateUrl: 'views/entity-viewer/entity-viewer-add-dialog-view.html',
                targetEvent: $event,
                multiple: true,
                parent: dialogParent,
                locals: {
                    entityType: 'instrument',
                    entity: {},
                    data: {}
                }
            }).then(function (data) {

                vm.getList();

            })

        }

        vm.importBloomberg = function ($event) {

            var dialogParent = document.querySelector('.dialog-containers-wrap');

            $mdDialog.show({
                controller: 'InstrumentDownloadDialogController as vm',
                templateUrl: 'views/dialogs/instrument-download/instrument-download-dialog-view.html',
                targetEvent: $event,
                multiple: true,
                parent: dialogParent,
                locals: {
                    data: {}
                }
            }).then(function (data) {

                vm.getList();

            })

        }

        vm.getList = function () {

            vm.processing = true;

            var promises = []

            if (vm.inputText.length > 2) {

                promises.push(new Promise(function (resolve, reject) {

                    fetch('https://finmars.com/instrument-database/instr/find/name/' + vm.inputText + '?instrument_type=' + vm.instrument_type).then(function (data) {
                        return data.json()
                    }).then(function (data) {

                        vm.databaseInstrumentsTotal = data.resultCount

                        vm.databaseInstruments = data.foundItems

                        vm.databaseInstruments = vm.databaseInstruments.map(function (item) {

                            item.pretty_date = moment(item.last_cbnnds_update).format("DD.MM.YYYY")

                            return item;

                        })

                        resolve()

                    }).catch(function (error) {

                        console.log("Instrument Database error occurred", error)

                        vm.databaseInstruments = []

                        resolve()

                    })

                }))

            }

            promises.push(new Promise(function (resolve, reject) {


                instrumentService.getListForSelect({
                    pageSize: 1000,
                    filters: {
                        query: vm.inputText,
                        instrument_type: vm.instrument_type
                    }

                }).then(function (data) {

                    vm.localInstrumentsTotal = data.count;

                    vm.localInstruments = data.results;

                    vm.localInstruments = vm.localInstruments.map(function (item) {

                        item.pretty_date = moment(item.modified).format("DD.MM.YYYY")

                        return item;

                    })

                    resolve()


                })

            }))

            Promise.all(promises).then(function (data) {

                vm.databaseInstruments = vm.databaseInstruments.filter(function (databaseInstrument) {

                    var exist = false;

                    vm.localInstruments.forEach(function (localInstrument) {

                        if (localInstrument.user_code === databaseInstrument.referenceId) {
                            exist = true
                        }

                        if (localInstrument.reference_for_pricing === databaseInstrument.referenceId) {
                            exist = true
                        }


                    })

                    return !exist;

                })

                vm.processing = false;

                $scope.$apply();

                setTimeout(function () {

                    $('.instrument-select-options-group-title').on('click', function () {

                        $(this).next()[0].scrollIntoView({block: 'start', behavior: 'smooth'});
                    });

                }, 100)

            })


        }

        vm.init = function () {

            vm.getList();

        }


        vm.init();

    };

}());