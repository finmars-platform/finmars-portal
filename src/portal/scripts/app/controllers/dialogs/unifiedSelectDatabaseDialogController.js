/**
 * Created by szhitenev on 15.04.2022.
 */
(function () {

    'use strict';


    var toastNotificationService = require('../../../../../core/services/toastNotificationService').default;
    var entityResolverService = require('../../services/entityResolverService');

    var importCurrencyCbondsService = require('../../services/import/importCurrencyCbondsService');
    var currencyDatabaseSearchService = require('../../services/currency/currencyDatabaseSearchService');


    module.exports = function ($scope, $mdDialog, finmarsDatabaseService, data) {

        var vm = this;

        vm.title = data.title || 'Select entity';

        vm.localItemsTotal = 0;
        vm.databaseItemsTotal = 0;
        vm.hoverItem = null;

        vm.databaseItems = [];
        vm.localItems = [];

        // vm.inputText = data.inputText;
        vm.inputText = '';

        vm.globalPage = 1;
        vm.totalPages = 1;
        vm.actionType = 'default';

        vm.entityType = data.entityType;

        vm.clearHoverItem = function () {

            setTimeout(function () {

                vm.hoverItem = null
                console.log('vm.hoverItem', vm.hoverItem)

                $scope.$apply();
            }, 0)

        }

        vm.setHoverItem = function ($event, option) {

            setTimeout(function () {

                vm.hoverItem = option
                console.log('scope.hoverItem', vm.hoverItem)

                $scope.$apply();
            }, 0)
        }

        var onSdiError = function (error) {

            vm.selectedItem = null;
            vm.isDisabled = false;

            toastNotificationService.error(error);

            $scope.$apply();

        }

        var selectDatabaseItem = function (selItem) {

            var promise;

            if (vm.entityType === 'currency') {

                promise = importCurrencyCbondsService.download(
                    {
                        user_code: selItem.user_code,
                        mode: 1,
                    }
                )

            }
            else if (vm.entityType === 'counterparty') {

                promise = finmarsDatabaseService.downloadCounterparty(
                    {
                        company_id: selItem.id,
                    }
                )

            }

            promise.then(function (data) {

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
            var localItemSelected = vm.localItems.find(function (item) { return item.selected });

            if (localItemSelected) {

                vm.selectedItem = localItemSelected;

                return $mdDialog.hide( { status: 'agree', data: {item: vm.selectedItem} } );

            }
            //# endregion

            //# region Database item selected
            var selectedDatabaseItem = vm.databaseItems.find(function (item) { return item.selected });

            if (selectedDatabaseItem) {
                selectDatabaseItem(selectedDatabaseItem);
            }
            //# endregion

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.onInputTextChange = function () {

            vm.getList();

        }

        vm.selectLocalItem = function (item) {

            vm.databaseItems = vm.databaseItems.map(function (item) {

                item.selected = false;
                return item
            })

            vm.localItems = vm.localItems.map(function (item) {

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

        vm.selectDatabaseItem = function (item) {

            vm.databaseItems = vm.databaseItems.map(function (item) {

                item.selected = false;
                return item
            })

            vm.localItems = vm.localItems.map(function (item) {

                item.selected = false;
                return item
            })

            item.selected = true;

        }

        vm.addEntity = function ($event) {

            var dialogParent = document.querySelector('.dialog-containers-wrap');

            $mdDialog
                .show({
                    controller: "EntityViewerAddDialogController as vm",
                    templateUrl: "views/entity-viewer/entity-viewer-add-dialog-view.html",
                    parent: dialogParent,
                    targetEvent: $event,
                    multiple: true,
                    locals: {
                        entityType: vm.entityType,
                        entity: {},
                        data: {},
                    },
                })
                .then(function (res) {

                    if (res.status === 'agree') {
                        vm.getList();
                    }

                });

        }


        vm.loadMoreGlobalItems = function () {

            vm.globalProcessing = true;

            vm.globalPage = vm.globalPage + 1

            try {

                if (vm.entityType === 'currency') {
                    // TODO replace with finmarsDatabaseService
                    currencyDatabaseSearchService.getList(vm.inputText, vm.globalPage - 1).then(function (data) {

                        vm.globalProcessing = false;

                        /*vm.databaseItemsTotal = data.resultCount;

                        vm.databaseItems = data.foundItems

                        vm.totalPages = Math.round(data.resultCount / 40)*/
                        vm.databaseItemsTotal = data.count;

                        vm.databaseItems = data.results;

                        vm.totalPages = Math.round(data.count / 40);

                        $scope.$apply();

                    })
                    .catch(function (error) {

                        vm.globalProcessing = false;

                        vm.databaseItems = []

                        console.log("Database error occurred", error)

                        $scope.$apply();

                    })
                }
                else {

                    finmarsDatabaseService.getCounterpartiesList({
                        filters: {
                            query: vm.inputText
                        }
                    })
                    .then(function (data) {

                        vm.globalProcessing = false;

                        vm.databaseItemsTotal = data.count;

                        vm.databaseItems = data.results;

                        vm.totalPages = Math.round(data.count / 40)

                        $scope.$apply();

                    })
                    .catch(function (error) {

                        vm.globalProcessing = false;

                        vm.databaseItems = []

                        console.log("Database error occurred", error)

                        $scope.$apply();

                    })
                }


            } catch (e) {

                vm.globalProcessing = false;

                vm.databaseItems = []
            }

        }

        var getDatabaseItems = function (resolve) {

            var mapItems = function (item) {

                item.frontOptions = {
                    type: 'database',
                }

                return item;

            }

            if (vm.entityType === 'currency') {

                currencyDatabaseSearchService.getList(vm.inputText, vm.globalPage - 1)
                    .then(function (data) {

                        /*vm.databaseItemsTotal = data.resultCount;

                        vm.databaseItems = data.foundItems

                        vm.totalPages = Math.round(data.resultCount / 40)*/
                        vm.databaseItemsTotal = data.count;

                        vm.databaseItems = data.results.map(mapItems);

                        vm.totalPages = Math.round(data.count / 40);

                        resolve();

                    })
                    .catch(function (error) {

                        console.log("Database error occurred", error)
                        vm.databaseItems = []

                        resolve()

                    });

            }
            else if (vm.entityType === 'counterparty') {

                finmarsDatabaseService.getCounterpartiesList({
                    filters: {
                        query: vm.inputText,
                        page: 1,
                    }
                })
                    .then(function (data) {

                        vm.databaseItemsTotal = data.count;

                        vm.databaseItems = data.results.map(mapItems);

                        vm.totalPages = Math.round(data.count / 40);

                        resolve();

                    })
                    .catch(function (error) {

                        console.log("Database error occurred", error)
                        vm.databaseItems = []

                        resolve();

                    });

            }

        };

        vm.getList = function () {

            vm.processing = true;

            var promises = []

            promises.push( new Promise( getDatabaseItems ) );

            promises.push(new Promise(function (resolve, reject) {

                entityResolverService.getListLight(vm.entityType, {
                    pageSize: 500,
                    filters: {
                        query: vm.inputText
                    }
                }).then(function (data) {

                    vm.localItemsTotal = data.count;

                    vm.localItems = data.results;

                    vm.localItems = vm.localItems.map(function (item) {

                        item.pretty_date = moment(item.modified).format("DD.MM.YYYY");

                        item.frontOptions = {
                            type: 'local',
                        }

                        return item;

                    })

                    resolve()


                })

            }))

            Promise.allSettled(promises).then(function (data) {

                vm.processing = false;

                vm.databaseItems = vm.databaseItems.filter(function (databaseItem) {

                    /* var exist = false;

                    if (vm.entityType === 'currency') {

                        vm.localItems.forEach(function (localItem) {

                            if (localItem.user_code === databaseItem.code) {
                                exist = true
                            }

                        })

                    }
                    else {

                        vm.localItems.forEach(function (localItem) {

                            if (localItem.user_code === databaseItem.user_code) {
                                exist = true
                            }

                        })

                    }

                    return !exist; */

                    // database item does not exist locally
                    return !!vm.localItems.find(function (localItem) {
                        return localItem.user_code !== databaseItem.user_code;
                    });

                });

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

            if (data.context && data.context.action) {

                vm.actionType = data.context.action;

            }

        }

        vm.init();

    };

}());