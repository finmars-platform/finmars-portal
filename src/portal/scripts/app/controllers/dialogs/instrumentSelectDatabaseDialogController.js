/**
 * Created by szhitenev on 09.09.2021.
 */
(function () {

    'use strict';

    var importInstrumentCbondsService = require('../../services/import/importInstrumentCbondsService').default;
    var instrumentDatabaseSearchService = require('../../services/instrument/instrumentDatabaseSearchService');
    var tasksService = require('../../services/tasksService');

    module.exports = function ($scope, $mdDialog, toastNotificationService, instrumentService, data) {

        var vm = this;

        vm.isDisabled = false;
        /** For updating local instrument from database */
        vm.updatingEntities = false;

        vm.title = data.title || 'Select instrument';
        vm.localInstrumentsTotal = 0;
        vm.databaseInstrumentsTotal = 0;
        vm.hoverInstrument = null;

        vm.databaseInstruments = [];
        vm.localInstruments = [];

        vm.inputText = '';
        // vm.inputText = data.inputText;
        vm.instrument_type = '';

        vm.globalPage = 1;
        vm.totalPages = 1;
        vm.actionType = 'default';

        vm.instrumentTypeOptions = [
            {id: 'bond', name: 'Bonds'},
            {id: 'stock', name: 'Stocks'}
        ]

        var reqPageSize = 40;

        vm.clearHoverInstrument = function () {

            setTimeout(function () {

                vm.hoverInstrument = null
                console.log('vm.hoverInstrument', vm.hoverInstrument);
                $scope.$apply();

            }, 0)

        }

        vm.setHoverInstrument = function ($event, option) {

            setTimeout(function () {

                vm.hoverInstrument = option;
                vm.hoverInstrument.available_for_update = false;

                var bondOrStock = vm.hoverInstrument.instrument_type_object.user_code.endsWith('bond') ||
                    vm.hoverInstrument.instrument_type_object.user_code.endsWith('stock');

                if (vm.hoverInstrument.frontOptions.type === 'local' && bondOrStock) {

                    vm.hoverInstrument.available_for_update = true;

                    // check whether user_code is a valid isin
                    const regexp = /^([A-Z]{2})([-]{0,1}[A-Z0-9]{9}[-]{0,1})([0-9]{1})$/g;
                    const invalidIsin = !vm.hoverInstrument.user_code.match(regexp);

                    if (invalidIsin) {
                        // can not load 'bond', 'stock' with invalid isin as user code
                        vm.hoverInstrument.available_for_update = false;
                    }

                }

                $scope.$apply();

            }, 100)
        }

        var onSdiError = function (error) {

            vm.selectedItem = null;
            vm.isDisabled = false;
            vm.updatingEntities = false;

            toastNotificationService.error(error);

            $scope.$apply();

        }

        var selectDatabaseItem = function (selItem) {

            var config = {
                user_code: selItem.reference,
                name: selItem.name,
                instrument_type_user_code: selItem.instrument_type,
                mode: 1
            };

            vm.isDisabled = true;

            importInstrumentCbondsService.download(config).then(function (data) {

                vm.isDisabled = false;

                if (data.errors) {

                    onSdiError( data.error );

                } else {

                    $mdDialog.hide({
                        status: 'agree',
                        data: {
                            task: data.task,
                            item: selItem,
                        }
                    });

                }

            }).catch(function (e){

                onSdiError(e);

            })

        };

        vm.agree = function () {

            //# region Local item selected
            var localItemSelected = vm.localInstruments.find(function (item) { return item.selected });

            if (localItemSelected) {

                vm.selectedItem = localItemSelected;

                return $mdDialog.hide( { status: 'agree', data: {item: vm.selectedItem} } );

            }
            //# endregion

            //# region Database item selected
            var selectedDatabaseInstrument = vm.databaseInstruments.find(function (item) { return item.selected });

            if (selectedDatabaseInstrument) {
                selectDatabaseItem(selectedDatabaseInstrument);
            }
            //# endregion

            /*new Promise(function (resolve, reject) {

                //# region Local item selected
                var localItemSelected = vm.localInstruments.find(function (item) { return item.selected });

                if (localItemSelected) {
                    vm.selectedItem = localItemSelected;
                    return resolve();
                }
                //# endregion

                /!*var selectedDatabaseInstrument;

                vm.databaseInstruments.forEach(function (item) {

                    if (item.selected) {
                        selectedDatabaseInstrument = item
                    }

                })*!/
                var selectedDatabaseInstrument = vm.databaseInstruments.find(function (item) { return item.selected });

                if (selectedDatabaseInstrument) {
                    selectDatabaseItem(selectedDatabaseInstrument);
                }


            })
                .then(function (data) {

                    if (vm.selectedItem) {

                        if (vm.actionType === 'add_instrument_dialog') {
                            toastNotificationService.success("Instrument has been downloaded")
                        }

                        $mdDialog.hide({status: 'agree', data: {item: vm.selectedItem}});
                    }

                })*/


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

        var taskIntervalId;
        var intervalTime = 3000;

        var awaitInstrumentImport = function (taskId) {

            return setInterval(function () {

                tasksService.getByKey(taskId)
                    .then(function (taskData) {

                        var errorMsg = "Import aborted";

                        switch (taskData.status) {
                            case 'D':

                                vm.isDisabled = false;
                                vm.processing = false;
                                vm.updatingEntities = false;

                                toastNotificationService.success("Instrument has been loaded");

                                $scope.$apply();

                                clearInterval(taskIntervalId);

                                break;

                            case 'C':
                            case 'T':
                                errorMsg = "Import timed out"

                                onSdiError(errorMsg);
                                break;

                            case 'E':

                                toastNotificationService.error(taskData.error);
                                onSdiError(taskData.error);

                                break;
                        }


                    })
                    .catch(function (error) {

                        clearInterval(taskIntervalId);
                        toastNotificationService.error(error);

                        vm.processing = false;
                        vm.isDisabled = false;
                        vm.updatingEntities = false;

                        throw error;

                    });

            }, intervalTime);

        };

        vm.updateLocalInstrument = function (item) {

            /*var config = {
                instrument_code: item.user_code,
                mode: 1
            };*/
            /*var config = {
                user_code: item.user_code,
                name: item.name,
                instrument_type_user_code: item.instrument_type_object.user_code,
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

            })*/

            /* var iTypeUc = null;

            if (item.instrument_type_object) {
                iTypeUc = item.instrument_type_object.user_code;

            } else if (item.instrument_type && typeof item.instrument_type === 'string') { // property instrument_type contains user_code
                // some instruments still have id as value for property instrument_type
                iTypeUc = item.instrument_type;

            } else {
                console.log( "ERROR: instrument data", structuredClone(item) );
                throw new Error("Lacking user_code of instrument type");
            } */

            var config = {
                user_code: item.user_code,
                name: item.name,
                instrument_type_user_code: item.instrument_type,
                mode: 1
            };

            vm.updatingEntities = true;

            importInstrumentCbondsService.download(config).then(function (data) {

                vm.isDisabled = false;

                if (data.errors) {

                    onSdiError( data.error );

                } else {
                    taskIntervalId = awaitInstrumentImport(data.task);
                }

            }).catch(function (e){

                onSdiError(e);

            })

        }

        var dialogParent = document.querySelector('.dialog-containers-wrap');

        vm.addInstrument = function ($event) {

            $mdDialog.show({
                controller: 'EntityViewerAddDialogController as vm',
                templateUrl: 'views/entity-viewer/entity-viewer-add-dialog-view.html',
                parent: document.querySelector(".dialog-containers-wrap"),
                targetEvent: $event,
                multiple: true,
                parent: dialogParent,
                locals: {
                    entityType: 'instrument',
                    entity: {},
                    data: {}
                }
            }).then(function (res) {

                if (res.status === 'agree') {
                    vm.getList();
                }

            })

        }

        vm.importBloomberg = function ($event) {

            $mdDialog.show({
                controller: 'InstrumentDownloadDialogController as vm',
                templateUrl: 'views/dialogs/instrument-download/instrument-download-dialog-view.html',
                parent: document.querySelector(".dialog-containers-wrap"),
                targetEvent: $event,
                multiple: true,
                parent: dialogParent,
                locals: {
                    data: {}
                }
            }).then(function (res) {

                if (res.status === 'agree') {
                    vm.getList();
                }

            })

        }

        vm.loadMoreGlobalInstruments = function () {

            vm.globalProcessing = true;

            vm.globalPage = vm.globalPage + 1

            // var instrumentDatabaseUrl = 'https://finmars.com/instrument-database/instr/find/name/' + vm.inputText
            //
            // if (vm.instrument_type){
            //     instrumentDatabaseUrl = instrumentDatabaseUrl + '?instrument_type=' + vm.instrument_type
            //
            //     instrumentDatabaseUrl = instrumentDatabaseUrl + '&page=' + vm.globalPage
            // } else {
            //
            //     instrumentDatabaseUrl = instrumentDatabaseUrl + '?page=' + vm.globalPage
            // }
            //
            var opts = {
                pageSize: reqPageSize,
                filters: {
                    page: vm.globalPage,
                    instrument_type: vm.instrument_type,
                }
            }

            instrumentDatabaseSearchService.getList(vm.inputText, opts).then(function (data) {

                vm.globalProcessing = false;

                vm.databaseInstrumentsTotal = data.count;

                data.results.forEach(function (item) {

                    item.pretty_date = moment(item.last_cbnnds_update).format("DD.MM.YYYY");

                    item.frontOptions = {
                        type: 'database',
                    };

                    vm.databaseInstruments.push(item)

                })

                vm.totalPages = Math.round(data.count / reqPageSize);

                $scope.$apply();

            }).catch(function (error) {

                vm.globalProcessing = false;

                console.log("Instrument Database error occurred", error)

                $scope.$apply();

            })

        }

        vm.getList = function () {

            vm.processing = true;

            var promises = []

            if (vm.inputText.length > 2) {

                promises.push(new Promise(function (resolve, reject) {

                    // var instrumentDatabaseUrl = 'https://finmars.com/instrument-database/instr/find/name/' + vm.inputText
                    //
                    // if (vm.instrument_type){
                    //     instrumentDatabaseUrl = instrumentDatabaseUrl + '?instrument_type=' + vm.instrument_type
                    // }
                    var opts = {
                        pageSize: reqPageSize,
                        filters: {
                            page: 1,
                            instrument_type: vm.instrument_type,
                        }
                    };

                    instrumentDatabaseSearchService.getList(vm.inputText, opts)
                        .then(function (data) {

                            vm.databaseInstrumentsTotal = data.count;

                            vm.databaseInstruments = data.results;

                            vm.databaseInstruments = vm.databaseInstruments.map(function (item) {

                                item.pretty_date = moment(item.last_cbnnds_update).format("DD.MM.YYYY");

                                item.frontOptions = {
                                    type: 'database',
                                };

                                return item;

                            })

                            vm.totalPages = Math.round(data.count / reqPageSize);

                            $scope.$apply();
                            resolve();

                        })
                        .catch(function (error) {

                            console.log("Instrument Database error occurred", error)

                            vm.databaseInstruments = [];

                            $scope.$apply();
                            resolve()

                        });

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

                        item.pretty_date = moment(item.modified).format("DD.MM.YYYY");

                        item.frontOptions = {
                            type: 'local',
                        };

                        return item;

                    })

                    resolve()

                })

            }))

            Promise.all(promises).then(function (data) {

                vm.databaseInstruments = vm.databaseInstruments.filter(function (databaseInstrument) {

                    var exist = false;

                    vm.localInstruments.forEach(function (localInstrument) {

                        if (localInstrument.user_code === databaseInstrument.reference) {
                            exist = true;
                        }

                        if (localInstrument.reference_for_pricing === databaseInstrument.reference) {
                            exist = true;
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

            if (data.context) {

                if (data.context.action) {

                    vm.actionType = data.context.action;

                }

            }

        }


        vm.init();

    };

}());