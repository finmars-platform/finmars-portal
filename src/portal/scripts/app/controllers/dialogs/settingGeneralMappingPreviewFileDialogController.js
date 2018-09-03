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

        function handleItem(entity, item) {

            return new Promise(function (resolve, reject) {

                var options = {
                    filters: {
                        'user_code': item.___user_code
                    }
                };

                entityResolverService.getList(entity, options).then(function (data) {

                    if (data.results.length) {

                        item.content_object = data.results[0].id;

                        setTimeout(function () {

                            resolve(entityTypeMappingResolveService.create(entity, item))

                        }, 500)

                    } else {

                        console.warn('User code ' + item.___user_code + ' is not exist');

                        resolve([]);
                    }

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

        vm.agree = function () {

            importConfiguration(vm.items).then(function (value) {
                $mdDialog.hide({status: 'agree', data: {}});
            })

        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

    }

}());