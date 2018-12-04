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
    var pricingAutomatedScheduleService = require('../../services/import/pricingAutomatedScheduleService');
    var metaContentTypesService = require('../../services/metaContentTypesService');
    var attributeTypeService = require('../../services/attributeTypeService');
    var md5helper = require('../../helpers/md5.helper');
    var uiRepository = require('../../repositories/uiRepository');

    module.exports = function ($scope, $mdDialog, file) {

        console.log("file", file);

        var vm = this;

        vm.items = file.body;

        vm.items.forEach(function (item) {

            item.active = false;

            item.content.forEach(function (child) {
                child.active = false;
            });

        });

        vm.getEntityName = function (item) {

            switch (item.entity) {
                case 'transactions.transactiontype':
                    return "Transaction Types";
                case 'accounts.accounttype':
                    return "Account Types";
                case 'instruments.instrumenttype':
                    return "Instrument Types";
                case 'import.pricingautomatedschedule':
                    return 'Automated uploads schedule ';
                case 'ui.editlayout':
                    return "Input form layouts";
                case 'ui.listlayout':
                    return "Entity viewer layouts";
                case 'ui.reportlayout':
                    return "Report builder layouts";
                case 'csv_import.scheme':
                    return "Data import from CSV schemes";
                case 'integrations.instrumentdownloadscheme':
                    return "Instrument Download Schemes";
                case 'integrations.pricedownloadscheme':
                    return "Price Download Schemes";
                case 'integrations.complextransactionimportscheme':
                    return "Complex Transaction Import Scheme";
                case 'obj_attrs.portfolioattributetype':
                    return "Portfolio Dynamic Attributes";
                case 'obj_attrs.accountattributetype':
                    return "Account Dynamic Attributes";
                case 'obj_attrs.accounttypeattributetype':
                    return "Account Type Dynamic Attributes";
                case 'obj_attrs.responsibleattributetype':
                    return "Responsible Dynamic Attributes";
                case 'obj_attrs.counterpartyattributetype':
                    return "Counterparty Dynamic Attributes";
                case 'obj_attrs.instrumentattributetype':
                    return "Instrument Dynamic Attributes";
                case 'obj_attrs.instrumenttypeattributetype':
                    return "Instrument Type Dynamic Attributes";
                default:
                    return "Unknown"
            }

        };

        vm.getItemName = function (item) {

            if (item.hasOwnProperty('user_code')) {
                return item.user_code
            }

            if (item.hasOwnProperty('scheme_name')) {
                return item.scheme_name;
            }

            if (item.hasOwnProperty('name')) {

                if (item.hasOwnProperty('csv_fields')) {
                    return item.name + ' (' + metaContentTypesService.getEntityNameByContentType(item.content_type) + ')'
                }

                if (item.hasOwnProperty('data')) {
                    return item.name + ' (' + metaContentTypesService.getEntityNameByContentType(item.content_type) + ')'
                }

                return item.name
            }

            if (item.hasOwnProperty('content_type')) {
                return metaContentTypesService.getEntityNameByContentType(item.content_type)
            }

            if (item.hasOwnProperty('last_run_at')) { // import.pricingautomatedschedule
                return "Schedule"
            }

        };

        vm.toggleActiveForChilds = function (item) {

            item.active = !item.active;

            item.content.forEach(function (child) {
                child.active = item.active;
            })

        };

        vm.updateActiveForParent = function (item, parent) {

            item.active = !item.active;

            var active = true;

            parent.content.forEach(function (item) {

                if (item.active === false) {
                    active = false;
                }

            });

            parent.active = active;


        };

        vm.getEntityDependenciesCaptions = function (entity) {

            var result = '';

            if (entity.dependencies && entity.dependencies.length) {

                result = result + '(Depends on: ';

                var dependenciesList = [];

                entity.dependencies.forEach(function (dependency) {

                    dependenciesList.push(metaContentTypesService.getEntityNameByContentType(dependency.entity))

                });

                result = result + dependenciesList.join(', ');

                result = result + ')';

            }


            return result;

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

                        console.log('transactionTypesExists', transactionTypesExists);

                        var transactionTypesToCreate = depTransactionTypes.filter(function (transaction_type) {
                            return transactionTypesExists.indexOf(md5helper.md5(transaction_type.user_code)) === -1
                        });

                        console.log('transactionTypesToCreate', transactionTypesToCreate);

                        transactionTypesToCreate.forEach(function (depTransactionType) {

                            promises.push(entityResolverService.create('transaction-type', depTransactionType))

                        });

                        Promise.all(promises).then(function (data) {

                            resolve(data);

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

                        promises.push(entityResolverService.create('transaction-type-group', depGroup))

                    });

                    Promise.all(promises).then(function (data) {

                        entityResolverService.getList('transaction-type-group').then(function (data) {

                            var groups = data.results;

                            transactionTypeEntity.content.forEach(function (item) {

                                groups.forEach(function (group) {

                                    if (item.hasOwnProperty('___group__user_code')) {

                                        if (item.___group__user_code === group.user_code) {
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

        function handlePriceDownloadSchemeDependency(entity, dependency) {

            return new Promise(function (resolve, reject) {

                var depItems = dependency.content;

                priceDownloadSchemeService.getList().then(function (data) {

                    var items = data.results;

                    var itemsExists = [];

                    depItems.forEach(function (depItem) {

                        items.forEach(function (item) {

                            if (item.scheme_name === depItem.scheme_name) {
                                itemsExists.push(md5helper.md5(depItem.scheme_name))
                            }

                        })

                    });

                    var promises = [];

                    var itemsToCreate = depItems.filter(function (group) {
                        return itemsExists.indexOf(md5helper.md5(group.scheme_name)) === -1
                    });

                    itemsToCreate.forEach(function (item) {

                        promises.push(priceDownloadSchemeService.create(item))

                    });

                    Promise.all(promises).then(function (data) {

                        resolve(data);

                    });

                });

            })


        }

        function mapTransactionTypeToComplexTransactionImportScheme(complexTransactionImportSchemeEntity) {

            return new Promise(function (resolve, reject) {

                entityResolverService.getList('transaction-type').then(function (data) {

                    var transactionTypes = data.results;

                    console.log('Transaction Type groups created');
                    console.log('Transaction Types created');

                    complexTransactionImportSchemeEntity.content.forEach(function (entityItem) {

                        entityItem.rules.forEach(function (rule) {

                            transactionTypes.forEach(function (transactionType) {

                                if (rule.___transaction_type__user_code === transactionType.user_code) {
                                    rule.transaction_type = transactionType.id;

                                    rule.fields.forEach(function (field) {

                                        transactionType.inputs.forEach(function (input) {

                                            if (field.___input__name === input.name) {
                                                field.transaction_type_input = input.id;
                                            }

                                        })


                                    })

                                }

                            })


                        })

                    });

                    resolve(complexTransactionImportSchemeEntity);

                });

            });

        }

        function mapPriceDownloadSchemeToInstrumentDownloadScheme(instrumentDownloadSchemeEntity) {

            return new Promise(function (resolve, reject) {

                priceDownloadSchemeService.getList().then(function (data) {

                    var schemes = data.results;

                    instrumentDownloadSchemeEntity.content.forEach(function (entityItem) {

                        schemes.forEach(function (scheme) {

                            if (entityItem.___price_download_scheme__scheme_name === scheme.scheme_name) {
                                entityItem.price_download_scheme = scheme.id;
                            }

                        })

                    });

                    resolve(instrumentDownloadSchemeEntity);

                });

            })

        }

        function mapTransactionTypeEventsToInstrumentType(instrumentTypeEntity) {

            return new Promise(function (resolve, reject) {

                entityResolverService.getList('transaction-type').then(function (data) {

                    var transactionTypes = data.results;

                    console.log('Transaction Type groups created');
                    console.log('Transaction Types created');

                    instrumentTypeEntity.content.forEach(function (entityItem) {

                        transactionTypes.forEach(function (transactionType) {


                            if (entityItem.hasOwnProperty('___one_off_event__user_code')) {

                                if (entityItem.___one_off_event__user_code === transactionType.user_code) {
                                    entityItem.one_off_event = transactionType.id;
                                }

                            }

                            if (entityItem.hasOwnProperty('___regular_event__user_code')) {

                                if (entityItem.___regular_event__user_code === transactionType.user_code) {
                                    entityItem.regular_event = transactionType.id;
                                }

                            }

                            if (entityItem.hasOwnProperty('___factor_same__user_code')) {

                                if (entityItem.___factor_same__user_code === transactionType.user_code) {
                                    entityItem.factor_same = transactionType.id;
                                }

                            }

                            if (entityItem.hasOwnProperty('___factor_up__user_code')) {

                                if (entityItem.___factor_up__user_code === transactionType.user_code) {
                                    entityItem.factor_up = transactionType.id;
                                }
                            }

                            if (entityItem.hasOwnProperty('___factor_down__user_code')) {

                                if (entityItem.___factor_down__user_code === transactionType.user_code) {
                                    entityItem.factor_down = transactionType.id;
                                }
                            }


                        });

                    });

                    resolve(instrumentTypeEntity);

                });

            });

        }

        function importConfiguration(items) {

            return new Promise(function (resolve, reject) {

                var promises = [];

                items.forEach(function (entityItem) {


                    entityItem.content.forEach(function (item) {

                        if (item.active) {

                            switch (entityItem.entity) {

                                case 'transactions.transactiontype':
                                    promises.push(entityResolverService.create('transaction-type', item));
                                    break;
                                case 'accounts.accounttype':
                                    promises.push(entityResolverService.create('account-type', item));
                                    break;
                                case 'instruments.instrumenttype':
                                    promises.push(entityResolverService.create('instrument-type', item));
                                    break;
                                case 'import.pricingautomatedschedule':
                                    promises.push(pricingAutomatedScheduleService.updateSchedule(item));
                                    break;
                                case 'ui.editlayout':

                                    var entityType = metaContentTypesService.findEntityByContentType(item.content_type, 'ui');

                                    var promise = new Promise(function (resolve, reject) {

                                        uiRepository.getEditLayout(entityType).then(function (data) {

                                            if (data.results.length) {
                                                uiRepository.updateEditLayout(data.results[0].id, item).then(function (item) {
                                                    resolve({})
                                                })
                                            } else {
                                                uiRepository.createEditLayout(item).then(function (item) {
                                                    resolve({})
                                                })
                                            }

                                        });

                                    });

                                    promises.push(promise);

                                    break;
                                case 'ui.listlayout':
                                    promises.push(uiRepository.createListLayout(item));
                                    break;
                                case 'ui.reportlayout':
                                    promises.push(uiRepository.createListLayout(item));
                                    break;
                                case 'csv_import.scheme':
                                    promises.push(entitySchemeService.create(item));
                                    break;
                                case 'integrations.instrumentdownloadscheme':
                                    promises.push(instrumentSchemeService.create(item));
                                    break;
                                case 'integrations.pricedownloadscheme':
                                    promises.push(priceDownloadSchemeService.create(item));
                                    break;
                                case 'integrations.complextransactionimportscheme':
                                    promises.push(transactionSchemeService.create(item));
                                    break;
                                case 'obj_attrs.portfolioattributetype':
                                    promises.push(attributeTypeService.create('portfolio', item));
                                    break;
                                case 'obj_attrs.accountattributetype':
                                    promises.push(attributeTypeService.create('account', item));
                                    break;
                                case 'obj_attrs.accounttypeattributetype':
                                    promises.push(attributeTypeService.create('account-type', item));
                                    break;
                                case 'obj_attrs.responsibleattributetype':
                                    promises.push(attributeTypeService.create('responsible', item));
                                    break;
                                case 'obj_attrs.counterpartyattributetype':
                                    promises.push(attributeTypeService.create('counterparty', item));
                                    break;
                                case 'obj_attrs.instrumentattributetype':
                                    promises.push(attributeTypeService.create('instrument', item));
                                    break;
                                case 'obj_attrs.instrumenttypeattributetype':
                                    promises.push(attributeTypeService.create('instrument-type', item));
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

        function resolveInstrumentDownloadSchemeDependencies(instrumentDownloadSchemeEntity) {

            console.time("Instrument download scheme dependencies resolved");

            return new Promise(function (resolve, reject) {

                var promises = [];

                instrumentDownloadSchemeEntity.dependencies.forEach(function (dependency) {

                    switch (dependency.entity) {

                        case 'integrations.pricedownloadscheme':
                            promises.push(handlePriceDownloadSchemeDependency(instrumentDownloadSchemeEntity, dependency));
                            break;
                    }

                });

                Promise.all(promises).then(function (data) {

                    mapPriceDownloadSchemeToInstrumentDownloadScheme(instrumentDownloadSchemeEntity).then(function () {

                        console.timeEnd("Instrument download scheme dependencies resolved");

                        resolve(data);

                    });

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

                    mapTransactionTypeToComplexTransactionImportScheme(complexTransactionImportSchemeEntity).then(function (value) {

                        resolve(data);

                    })

                })

            });

        }

        function resolveInstrumentTypeDependencies(instrumentTypeEntity) {

            console.time("Instrument type dependencies resolved");

            return new Promise(function (resolve, reject) {

                var promises = [];

                instrumentTypeEntity.dependencies.forEach(function (dependency) {

                    switch (dependency.entity) {

                        case 'transactions.transactiontype':
                            promises.push(handleTransactionTypeDependency(instrumentTypeEntity, dependency));
                            break;
                    }

                });

                Promise.all(promises).then(function (data) {

                    mapTransactionTypeEventsToInstrumentType(instrumentTypeEntity).then(function () {

                        console.timeEnd("Instrument type dependencies resolved");

                        resolve(data);

                    });

                })

            })

        }

        function handleEditLayoutMap(layout) {

            return new Promise(function (resolve) {

                var entityType = metaContentTypesService.findEntityByContentType(layout.content_type, 'ui');

                attributeTypeService.getList(entityType).then(function (data) {

                    var layoutAttrs = data.results;

                    layout.data.forEach(function (tab) {

                        tab.layout.fields.forEach(function (field) {

                            if (field.attribute && field.attribute.id) {

                                var mapped = false;

                                layoutAttrs.forEach(function (layoutAttr) {

                                    if (layoutAttr.user_code === field.attribute.user_code) {
                                        field.attribute = layoutAttr;
                                        field.id = layoutAttr.id;
                                        mapped = true;
                                    }

                                });

                                if (mapped === false) {
                                    field.attribute = null;
                                    field.id = null;
                                    field.attribute_class = null;
                                    field.type = "empty"
                                }


                            }

                        })

                    });

                    resolve(layout);

                });

            })

        }

        function handleListLayoutMap(layout) {

            return new Promise(function (resolve) {
                resolve(layout);
            })

        }

        function mapLayouts(entity) {
            return new Promise(function (resolve) {

                var promises = [];

                entity.content.forEach(function (item) {

                    if (item.active) {
                        console.log("things to map", item.data);

                        if (entity.entity === 'ui.editlayout') {

                            promises.push(handleEditLayoutMap(item));

                        } else {

                            promises.push(handleListLayoutMap(item));

                        }

                    }

                });

                Promise.all(promises).then(function (data) {
                    console.log("Update Mappings to local master user data", entity);

                    resolve({});

                })

            })

        }

        function initPreparations(items) {


            return new Promise(function (resolve, reject) {

                var transactionTypeEntity = findEntity(items, 'transactions.transactiontype');
                var complexTransactionImportSchemeEntity = findEntity(items, 'integrations.complextransactionimportscheme');
                var instrumentDownloadSchemeEntity = findEntity(items, 'integrations.instrumentdownloadscheme');
                var instrumentTypeEntity = findEntity(items, 'instruments.instrumenttype');

                var listLayoutEntity = findEntity(items, 'ui.listlayout');
                var reportLayoutEntity = findEntity(items, 'ui.reportlayout');
                var editLayoutEntity = findEntity(items, 'ui.editlayout');

                var promises = [];

                if (transactionTypeEntity) {
                    if (isEntitySelected(transactionTypeEntity) && transactionTypeEntity.dependencies.length) {
                        promises.push(resolveTransactionTypeDependencies(transactionTypeEntity));
                    }
                }

                if (complexTransactionImportSchemeEntity) {
                    if (isEntitySelected(complexTransactionImportSchemeEntity) && complexTransactionImportSchemeEntity.dependencies.length) {
                        promises.push(resolveComplexTransactionImportSchemeDependencies(complexTransactionImportSchemeEntity));
                    }
                }

                if (instrumentDownloadSchemeEntity) {
                    if (isEntitySelected(instrumentDownloadSchemeEntity) && instrumentDownloadSchemeEntity.dependencies.length) {
                        promises.push(resolveInstrumentDownloadSchemeDependencies(instrumentDownloadSchemeEntity));
                    }
                }

                if (instrumentTypeEntity) {
                    if (isEntitySelected(instrumentTypeEntity) && instrumentTypeEntity.dependencies.length) {
                        promises.push(resolveInstrumentTypeDependencies(instrumentTypeEntity));
                    }
                }

                if (listLayoutEntity && isEntitySelected(listLayoutEntity)) {
                    promises.push(mapLayouts(listLayoutEntity))
                }

                if (reportLayoutEntity && isEntitySelected(reportLayoutEntity)) {
                    promises.push(mapLayouts(reportLayoutEntity))
                }

                if (editLayoutEntity && isEntitySelected(editLayoutEntity)) {
                    promises.push(mapLayouts(editLayoutEntity))
                }

                Promise.all(promises).then(function (data) {
                    resolve(data);
                })

            })

        }

        vm.agree = function ($event) {

            initPreparations(vm.items).then(function (value) {

                // $mdDialog.hide({status: 'agree', data: {}});
                // return;

                importConfiguration(vm.items).then(function (data) {

                    var allSuccess = true;

                    if (data.length) {
                        data.forEach(function (dataItem) {

                            if (dataItem.status === 400) {
                                allSuccess = false;
                            }

                        })
                    }

                    if (allSuccess) {
                        $mdDialog.hide({status: 'agree', data: {}});
                    } else {

                        var errorMessage = {};

                        $mdDialog.show({
                            controller: 'ValidationDialogController as vm',
                            templateUrl: 'views/dialogs/validation-dialog-view.html',
                            targetEvent: $event,
                            locals: {
                                validationData: data
                            },
                            preserveScope: true,
                            autoWrap: true,
                            skipHide: true
                        })

                    }


                })

            })

        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

    }

}());