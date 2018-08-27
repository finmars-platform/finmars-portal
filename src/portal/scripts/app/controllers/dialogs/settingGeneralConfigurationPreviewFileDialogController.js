/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var entitySchemeService = require('../../services/import/entitySchemeService');
    var priceDownloadSchemeService = require('../../services/import/priceDownloadSchemeService');
    var instrumentSchemeService = require('../../services/import/instrumentSchemeService');
    var entityResolverService = require('../../services/entityResolverService');
    var transactionSchemeService = require('../../services/import/transactionSchemeService');
    var md5helper = require('../../helpers/md5.helper');
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
                case 'integrations.complextransactionimportscheme':
                    return "Complex Transaction Import Scheme";
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

            if (item.hasOwnProperty('scheme_name')) {
                return item.scheme_name;
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

        function handleTransactionTypeDependency(entity, dependency) {

            return new Promise(function (resolve, reject) {

                resolveTransactionTypeDependencies(dependency).then(function (data) {

                    var depTransactionTypes = dependency.content;

                    entityResolverService.getList('transaction-type').then(function (data) {

                        var transactionTypes = data.results;

                        var transactionTypesExists = [];

                        depTransactionTypes.forEach(function (dep_transaction_type) {

                            transactionTypes.forEach(function (transaction_type) {

                                if (transaction_type.user_code === dep_transaction_type.user_code) {
                                    transactionTypesExists.push(md5helper.md5(dep_transaction_type.user_code))
                                }

                            })

                        });

                        var promises = [];

                        // console.log('groupsExists', groupsExists);

                        var transactionTypesToCreate = depTransactionTypes.filter(function (transaction_type) {
                            return transactionTypesExists.indexOf(md5helper.md5(transaction_type.user_code)) === -1
                        });

                        // console.log('groupsToCreate', groupsToCreate);

                        transactionTypesToCreate.forEach(function (depTransactionType) {

                            var itemIsSelected = false;

                            dependency.content.forEach(function (item) {

                                if (item.hasOwnProperty('___transaction_type_user_code')) {

                                    if (depTransactionType.user_code === item.___transaction_type_user_code) {

                                        if (!itemIsSelected) {
                                            itemIsSelected = item.active;
                                        }

                                    }

                                }
                            });

                            if (itemIsSelected) {

                                promises.push(entityResolverService.create('transaction-type', depTransactionType))

                            }

                        });

                        Promise.all(promises).then(function (data) {

                            entityResolverService.getList('transaction-type').then(function (data) {

                                var transactionTypes = data.results;

                                console.log('Transaction Type groups created');
                                console.log('Transaction Types created');

                                if (entity.entity === 'integrations.complextransactionimportscheme') {

                                    entity.content.forEach(function (entityItem) {

                                        entityItem.rules.forEach(function (rule) {

                                            transactionTypes.forEach(function (transactionType) {

                                                if (rule.___transaction_type_user_code === transactionType.user_code) {
                                                    rule.transaction_type = transactionType.id;

                                                    rule.fields.forEach(function (field) {

                                                        transactionType.inputs.forEach(function (input) {

                                                            if (field.___input_name === input.name) {
                                                                field.transaction_type_input = input.id;
                                                            }

                                                        })


                                                    })

                                                }

                                            })


                                        })

                                    });

                                }

                                resolve(entity);

                            });

                        });


                    });

                })

            })

        }

        function handleTransactionTypeGroupDependency(transactionTypeEntity, dependency) {

            return new Promise(function (resolve, reject) {

                var depGroups = dependency.content;

                entityResolverService.getList('transaction-type-group').then(function (data) {

                    var groups = data.results;

                    console.log('transactionTypeEntity', transactionTypeEntity);
                    console.log('depGroups', depGroups);

                    var groupsExists = [];

                    depGroups.forEach(function (depGroup) {

                        groups.forEach(function (group) {

                            if (group.user_code === depGroup.user_code) {
                                groupsExists.push(md5helper.md5(depGroup.user_code))
                            }

                        })

                    });

                    var promises = [];

                    // console.log('groupsExists', groupsExists);

                    var groupsToCreate = depGroups.filter(function (group) {
                        return groupsExists.indexOf(md5helper.md5(group.user_code)) === -1
                    });

                    // console.log('groupsToCreate', groupsToCreate);

                    groupsToCreate.forEach(function (depGroup) {

                        var itemIsSelected = false;

                        transactionTypeEntity.content.forEach(function (item) {

                            if (item.hasOwnProperty('___group_user_code')) {

                                if (depGroup.user_code === item.___group_user_code) {

                                    if (!itemIsSelected) {
                                        itemIsSelected = item.active;
                                    }

                                }

                            }
                        });

                        if (itemIsSelected) {

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

        function handleComplexTransactionImportScheme(item) {
            return new Promise(function (resolve) {
                resolve(transactionSchemeService.create(item))
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
                                case 'integrations.complextransactionimportscheme':
                                    promises.push(handleComplexTransactionImportScheme(item));
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

        function resolveTransactionTypeDependencies(transactionTypeEntity) {

            console.time("Transaction Type dependencies resolved");

            return new Promise(function (resolve, reject) {

                var promises = [];

                transactionTypeEntity.dependencies.forEach(function (dependency) {

                    switch (dependency.entity) {

                        case 'transactions.transactiontypegroup':
                            promises.push(handleTransactionTypeGroupDependency(transactionTypeEntity, dependency));
                            break;
                    }

                });

                Promise.all(promises).then(function (data) {

                    console.timeEnd("Transaction Type dependencies resolved");

                    resolve(data);

                })

            })

        }

        function resolveComplexTransactionImportSchemeDependencies(complexTransactionImportSchemeEntity) {

            console.time("Complex Transaction Import Scheme dependencies resolved");

            return new Promise(function (resolve, reject) {

                var promises = [];

                complexTransactionImportSchemeEntity.dependencies.forEach(function (dependency) {

                    switch (dependency.entity) {

                        case 'transactions.transactiontype':
                            promises.push(handleTransactionTypeDependency(complexTransactionImportSchemeEntity, dependency));
                            break;
                    }

                });

                Promise.all(promises).then(function (data) {

                    console.timeEnd("Complex Transaction Import Scheme dependencies resolved");

                    resolve(data);

                })

            });

        }

        function initPreparations(items) {

            return new Promise(function (resolve, reject) {

                var transactionTypeEntity = findEntity(items, 'transactions.transactiontype');

                var complexTransactionImportSchemeEntity = findEntity(items, 'integrations.complextransactionimportscheme');

                var promises = [];

                if (isEntitySelected(transactionTypeEntity) && transactionTypeEntity.dependencies.length) {
                    promises.push(resolveTransactionTypeDependencies(transactionTypeEntity));
                }

                if (isEntitySelected(complexTransactionImportSchemeEntity) && complexTransactionImportSchemeEntity.dependencies.length) {
                    promises.push(resolveComplexTransactionImportSchemeDependencies(complexTransactionImportSchemeEntity));
                }

                Promise.all(promises).then(function (data) {
                    resolve(data);
                })

            })

        }

        vm.agree = function () {

            initPreparations(vm.items).then(function (value) {

                importConfiguration(vm.items).then(function (value) {
                    $mdDialog.hide({status: 'agree', data: {}});
                })

            })

        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

    }

}());