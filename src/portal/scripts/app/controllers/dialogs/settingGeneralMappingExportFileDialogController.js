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
    var md5helper = require('../../helpers/md5.helper');
    var uiRepository = require('../../repositories/uiRepository');
    var configurationService = require('../../services/configurationService');


    module.exports = function ($scope, $mdDialog, file) {

        var vm = this;

        vm.readyStatus = {content: false};

        vm.selectAllState = false;

        vm.getFile = function () {

            configurationService.getMappingData().then(function (data) {

                console.log('configurationService.getConfigurationData', data);

                vm.file = data;

                vm.items = data.body;

                vm.items.forEach(function (parent) {

                    parent.content = parent.content.filter(function (child) {

                        if (child.hasOwnProperty('user_code') && child.user_code === '-') {
                            return false
                        }

                        if (child.hasOwnProperty('scheme_name') && child.scheme_name === '-') {
                            return false
                        }

                        return true;

                    })

                });

                vm.readyStatus.content = true;

                $scope.$apply();

            });

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

        function exportConfiguration(items) {

            return new Promise(function (resolve, reject) {

                var results = [];

                vm.items.forEach(function (item) {

                    var result = {
                        entity: item.entity,
                        content: [],
                        dependencies: item.dependencies,
                        count: 0
                    };

                    item.content.forEach(function (child) {

                        if (child.active) {
                            result.content.push(child)
                        }

                    });

                    result.count = result.content.length;

                    if (result.count > 0) {
                        results.push(result)
                    }


                });

                vm.file.body = results;

                var resultFile = JSON.stringify(vm.file);

                var a = document.getElementById("exportButton");
                var result = new File([resultFile], {type: 'text/json;charset=utf-8'});

                a.href = URL.createObjectURL(result);
                a.download = vm.filename ? vm.filename + '.json' : "mapping.json";

                resolve(vm.file);


            })

        }

        vm.agree = function ($event) {

            exportConfiguration(vm.items).then(function (data) {

                $mdDialog.hide({status: 'agree', data: {}});

            })

        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.init = function () {

            vm.getFile();

        };

        vm.init();

    }

}());