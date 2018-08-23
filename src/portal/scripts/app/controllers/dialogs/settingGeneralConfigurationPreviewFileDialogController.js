/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var entitySchemeService = require('../../services/import/entitySchemeService');
    var priceDownloadSchemeService = require('../../services/import/priceDownloadSchemeService');
    var instrumentSchemeService = require('../../services/import/instrumentSchemeService');
    var entityResolverService = require('../../services/entityResolverService');
    var uiRepository = require('../../repositories/uiRepository');

    module.exports = function ($scope, $mdDialog, file) {

        console.log("file", file);

        var vm = this;

        vm.items = file.body;

        vm.getEntityName = function (item) {

            switch (item.entity) {
                case 'transactions.transactiontype':
                    return "Transaction Types";
                case 'ui.editlayout':
                    return "Edit Layouts";
                case 'ui.listlayout':
                    return "List Layouts";
                case 'csv_import.scheme':
                    return "CSV Import Schemes";
                case 'integrations.instrumentdownloadscheme':
                    return "Instrument Download Schemes";
                case 'integrations.pricedownloadscheme':
                    return "Price Download Schemes";
                default:
                    return "Unknown"
            }

        };

        vm.getItemName = function (item) {

            if (item.hasOwnProperty('user_code')) {
                return item.user_code
            }

            if (item.hasOwnProperty('name')) {
                return item.name
            }

            if (item.hasOwnProperty('content_type')) {
                return item.content_type
            }

        };

        vm.toggleActiveForChilds = function (item) {

            item.content.forEach(function (child) {
                child.active = item.active;
            })

        };

        vm.updateActiveForParent = function (parent) {

            var active = true;

            parent.content.forEach(function (item) {

                if (item.active === false) {
                    active = false;
                }

            });

            parent.active = active;


        };

        function isEntitySelected(entity) {

            var result = false;

            entity.content.forEach(function (item) {

                if (item.active) {
                    result = true;
                }

            });

            return result;

        }

        function findEntity(items, entityName) {

            var result;

            items.forEach(function (item) {

                if (item.entity === entityName) {
                    result = item;
                }

            });

            return result;

        }

        function handleTransactionTypeGroupDependency(transactionTypeEntity, depGroups) {

            return new Promise(function (resolve, reject) {

                entityResolverService.getList('transaction-type-group').then(function (data) {

                    var groups = data.results;

                    console.log('transactionTypeEntity', transactionTypeEntity);
                    console.log('depGroups', depGroups);

                    var groupsExists = [];

                    depGroups.forEach(function (depGroup) {

                        groups.forEach(function (group) {

                            if (group.user_code === depGroup.user_code) {
                                groupsExists.push(depGroup.user_code)
                            }

                        })

                    });

                    var promises = [];

                    depGroups.forEach(function (depGroup) {

                        if (groupsExists.indexOf(depGroup.user_code) === -1) {
                            promises.push(entityResolverService.create('transaction-type-group', depGroup))
                        }

                    });

                    Promise.all(promises).then(function (data) {

                        entityResolverService.getList('transaction-type-group').then(function (data) {

                            var groups = data.results;

                            transactionTypeEntity.content.forEach(function (item) {

                                groups.forEach(function (group) {

                                    if (item.hasOwnProperty('___group_user_code')) {

                                        if (item.___group_user_code === group.user_code) {
                                            item.group = group.id;
                                        }

                                    }

                                })

                            });

                            console.log(transactionTypeEntity);

                            resolve(transactionTypeEntity);

                        });

                    });


                });

            })

        }

        function handleTransactionType(item) {
            return new Promise(function (resolve, reject) {
                resolve(entityResolverService.create('transaction-type', item))
            })

        }

        function handleListLayout(item) {
            return new Promise(function (resolve) {
                resolve(uiRepository.createListLayout(item))
            })
        }

        function handleEditLayout(item) {
            return new Promise(function (resolve) {
                resolve(uiRepository.createEditLayout(item))
            })
        }

        function handleCsvImportScheme(item) {
            return new Promise(function (resolve) {
                resolve(entitySchemeService.create(item))
            })
        }

        function handleInstrumentDownloadScheme(item) {
            return new Promise(function (resolve) {
                resolve(instrumentSchemeService.create(item))
            })
        }

        function handlePriceDownloadScheme(item) {
            return new Promise(function (resolve) {
                resolve(priceDownloadSchemeService.create(item))
            })
        }

        function importConfiguration(items) {

            return new Promise(function (resolve, reject) {

                var promises = [];

                items.forEach(function (entityItem) {

                    entityItem.content.forEach(function (item) {

                        if (item.active) {

                            switch (entityItem.entity) {

                                case 'transactions.transactiontype':
                                    promises.push(handleTransactionType(item));
                                    break;
                                case 'ui.editlayout':
                                    promises.push(handleEditLayout(item));
                                    break;
                                case 'ui.listlayout':
                                    promises.push(handleListLayout(item));
                                    break;
                                case 'csv_import.scheme':
                                    promises.push(handleCsvImportScheme(item));
                                    break;
                                case 'integrations.instrumentdownloadscheme':
                                    promises.push(handleInstrumentDownloadScheme(item));
                                    break;
                                case 'integrations.pricedownloadscheme':
                                    promises.push(handlePriceDownloadScheme(item));
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

        function initPreparations(items) {

            return new Promise(function (resolve, reject) {

                var transactionTypeEntity = findEntity(items, 'transactions.transactiontype');

                var promises = [];

                if (isEntitySelected(transactionTypeEntity) && transactionTypeEntity.dependencies.length) {

                    transactionTypeEntity.dependencies.forEach(function (dependency) {

                        switch (dependency.entity) {

                            case 'transactions.transactiontypegroup':
                                promises.push(handleTransactionTypeGroupDependency(transactionTypeEntity, dependency.content));
                                break;
                        }

                    });

                }

                Promise.all(promises).then(function (data) {
                    resolve(data);
                })

            })

        }

        vm.agree = function () {

            initPreparations(vm.items).then(function (value) {

                // importConfiguration(vm.items).then(function (value) {
                //     $mdDialog.hide({status: 'agree', data: {}});
                // })

            })

        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

    }

}());