/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var metaContentTypesService = require('../../services/metaContentTypesService');

    var entityTypeMappingResolveService = require('../../services/entityTypeMappingResolveService');
    var entityResolverService = require('../../services/entityResolverService');

    module.exports = function ($scope, $mdDialog, file) {

        console.log("file", file);

        var vm = this;

        vm.items = file.body;

        vm.overwriteOption = false;

        vm.items.forEach(function (item) {

            item.active = false;

            item.content.forEach(function (child) {
                child.active = false;
            });

        });

        vm.getEntityName = function (item) {

            return metaContentTypesService.getEntityNameByContentType(item.entity)

        };

        vm.getItemName = function (item) {

            if (item.hasOwnProperty('user_code')) {
                return item.user_code
            }

            if (item.hasOwnProperty('name')) {

                if (item.hasOwnProperty('csv_fields')) {
                    return item.name + ' (' + metaContentTypesService.getEntityNameByContentType(item.content_type) + ')'
                }


                return item.name
            }

            if (item.hasOwnProperty('content_type')) {
                return metaContentTypesService.getEntityNameByContentType(item.content_type)
            }

            if (item.hasOwnProperty('scheme_name')) {
                return item.scheme_name;
            }

            if (item.hasOwnProperty('last_run_at')) { // import.pricingautomatedschedule
                return "Schedule"
            }

        };

        vm.toggleSelectAll = function () {

            vm.selectAllState = !vm.selectAllState;

            vm.items.forEach(function (item) {
                item.someChildsActive = false;
                item.active = vm.selectAllState;

                item.content.forEach(function (child) {
                    child.active = vm.selectAllState;
                })

            })

        };

        vm.checkSelectAll = function () {

            var active = true;

            vm.items.forEach(function (item) {

                if (!item.active) {
                    active = false;
                }

                item.content.forEach(function (child) {

                    if (!child.active) {
                        active = false;
                    }

                })

            });

            vm.selectAllState = active;

        };

        vm.toggleActiveForChilds = function (item) {
            item.active = !item.active;
            item.someChildsActive = false;
            item.content.forEach(function (child) {
                child.active = item.active;
            });

            vm.checkSelectAll();

        };

        vm.updateActiveForParent = function (child, parent) {

            child.active = !child.active;

            var ChildIsActive = false;
            var ChildIsNotActive = false;
            var parentIsActive = false;

            parent.content.forEach(function (item) {
                if (item.active) {
                    ChildIsActive = true;
                }
                else {
                    ChildIsNotActive = true;
                }

                if (ChildIsActive && !ChildIsNotActive) {
                    parentIsActive = true;
                }
                else if (!ChildIsActive && ChildIsNotActive) {
                    parent.someChildsActive = false;
                }
                else {
                    parentIsActive = false;
                    parent.someChildsActive = true;
                }
            });

            parent.active = parentIsActive;

            vm.checkSelectAll();

        };

        function handleItem(entity, item) {

            return new Promise(function (resolve, reject) {

                mapContentObj(entity, item).then(function (item) {

                    createIfNotExists(entity, item).then(function () {

                        console.log('entity', entity);
                        console.log('item', item);

                        resolve();

                    })
                })


            })

        }

        function mapContentObj(entity, item) {

            return new Promise(function (resolve, reject) {

                var options = {};

                if (item.___user_code) {
                    options.filters = {
                        'user_code': item.___user_code
                    }
                }

                if (item.___system_code) {
                    options.filters = {
                        'system_code': item.___system_code
                    }
                }

                if (item.___scheme_name) {
                    options.filters = {
                        'scheme_name': item.___scheme_name
                    }
                }

                entityResolverService.getList(entity, options).then(function (data) {

                    if (item.___user_code) {

                        if (data.results.length) {

                            data.results.forEach(function (dataItem) {

                                item.content_object = dataItem.id;

                            });

                        } else {

                            console.warn('User code ' + item.___user_code + ' is not exist');
                        }

                    }

                    if (item.___scheme_name) {

                        if (data.results.length) {

                            item.content_object = data.results[0].id;

                        } else {

                            console.warn('Scheme name ' + item.___scheme_name + ' is not exist');

                        }

                    }


                    if (item.___system_code) {

                        data.forEach(function (dataItem) {

                            if (item.___system_code === dataItem.system_code) {
                                item.content_object = dataItem.id;
                            }

                        })

                    }

                    resolve(item);

                });

            })
        }

        function createIfNotExists(entity, item) {

            return new Promise(function (resolve, reject) {

                var mappingOptions = {
                    filters: {
                        'content_object': item.content_object,
                        'value': item.value
                    }
                };

                entityTypeMappingResolveService.getList(entity, mappingOptions).then(function (data) {

                    var exist = false;

                    if (data.results.length) {

                        data.results.forEach(function (serverItem) {

                            if (serverItem.value === item.value) {
                                exist = true;
                            }

                        })

                    }

                    if (!exist) {

                        entityTypeMappingResolveService.create(entity, item).then(function (data) {

                            resolve(data);

                        })

                    } else {

                        resolve();

                    }


                });

            })

        }

        function importConfiguration(items) {

            return new Promise(function (resolve, reject) {

                var promises = [];

                items.forEach(function (entityItem) {

                    entityItem.content.forEach(function (item) {

                        if (item.active) {

                            switch (entityItem.entity) {

                                case 'integrations.portfoliomapping':
                                    promises.push(handleItem('portfolio', item));
                                    break;
                                case 'integrations.currencymapping':
                                    promises.push(handleItem('currency', item));
                                    break;
                                case 'integrations.instrumenttypemapping':
                                    promises.push(handleItem('instrument-type', item));
                                    break;
                                case 'integrations.accountmapping':
                                    promises.push(handleItem('account', item));
                                    break;
                                case 'integrations.instrumentmapping':
                                    promises.push(handleItem('instrument', item));
                                    break;
                                case 'integrations.counterpartymapping':
                                    promises.push(handleItem('counterparty', item));
                                    break;
                                case 'integrations.responsiblemapping':
                                    promises.push(handleItem('responsible', item));
                                    break;
                                case 'integrations.strategy1mapping':
                                    promises.push(handleItem('strategy-1', item));
                                    break;
                                case 'integrations.strategy2mapping':
                                    promises.push(handleItem('strategy-2', item));
                                    break;
                                case 'integrations.strategy3mapping':
                                    promises.push(handleItem('strategy-3', item));
                                    break;
                                case 'integrations.periodicitymapping':
                                    promises.push(handleItem('periodicity', item));
                                    break;
                                case 'integrations.dailypricingmodelmapping':
                                    promises.push(handleItem('daily-pricing-model', item));
                                    break;
                                case 'integrations.paymentsizedetailmapping':
                                    promises.push(handleItem('payment-size-detail', item));
                                    break;
                                case 'integrations.accrualcalculationmodelmapping':
                                    promises.push(handleItem('accrual-calculation-model', item));
                                    break;
                                case 'integrations.pricedownloadschememapping':
                                    promises.push(handleItem('price-download-scheme', item));
                                    break;

                            }

                        }

                    })

                });

                Promise.all(promises).then(function (data) {

                    console.log("import success", data);

                    resolve(data);


                })

            })

        }

        vm.agree = function ($event) {

            importConfiguration(vm.items).then(function (value) {

                $mdDialog.hide({status: 'agree', data: {}});

                $mdDialog.show({
                    controller: 'SuccessDialogController as vm',
                    templateUrl: 'views/dialogs/success-dialog-view.html',
                    targetEvent: $event,
                    preserveScope: true,
                    multiple: true,
                    autoWrap: true,
                    skipHide: true,
                    locals: {
                        success: {
                            title: "",
                            description: "You have successfully imported mapping file"
                        }
                    }

                });


            })

        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

    }

}());