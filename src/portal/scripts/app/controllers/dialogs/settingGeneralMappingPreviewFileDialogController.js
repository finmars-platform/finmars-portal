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

            item.content.forEach(function (child) {
                child.active = item.active;
            });

            vm.checkSelectAll();

        };

        vm.updateActiveForParent = function (parent) {

            var active = true;

            parent.content.forEach(function (item) {

                if (item.active === false) {
                    active = false;
                }

            });

            parent.active = active;

            vm.checkSelectAll();

        };

        function handleItem(entity, item) {

            return new Promise(function (resolve, reject) {

                var options = {};

                if (item.___user_code) {
                    options.filters = {
                        'user_code': item.___user_code
                    }
                }

                entityResolverService.getList(entity, options).then(function (data) {

                    if (item.___user_code) {

                        if (data.results.length) {

                            item.content_object = data.results[0].id;

                        } else {

                            console.warn('User code ' + item.___user_code + ' is not exist');

                            resolve([]);
                        }

                    } else {

                        data.forEach(function (dataItem) {

                            if (item.___system_code === dataItem.system_code) {
                                item.content_object = dataItem.id;
                            }

                        })

                    }

                    setTimeout(function () {

                        if (vm.overwriteOption) {

                            var mappingOptions = {
                                filters: {
                                    'content_object': item.content_object
                                }
                            };

                            entityTypeMappingResolveService.getList(entity, mappingOptions).then(function (data) {

                                if (data.results.length) {

                                    data.results.forEach(function (oldMappingItem) {

                                        entityTypeMappingResolveService.deleteByKey(entity, oldMappingItem.id);

                                    });

                                }

                                resolve(entityTypeMappingResolveService.create(entity, item))

                            });

                        } else {

                            try {
                                entityTypeMappingResolveService.create(entity, item).then(function (data) {

                                    resolve(data);

                                })
                            } catch (error) {
                                resolve(error)
                            }


                        }
                    }, 500)


                })


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