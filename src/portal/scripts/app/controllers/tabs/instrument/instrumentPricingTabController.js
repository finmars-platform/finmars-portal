/**
 * Created by vzubr on 30.12.2020.
 */
(function () {

    'use strict';

    const instrumentPricingSchemeService = require('../../../services/pricing/instrumentPricingSchemeService');
    const attributeTypeService = require('../../../services/attributeTypeService');
    const evEditorEvents = require('../../../services/ev-editor/entityViewerEditorEvents');

    const GridTableDataService = require('../../../services/gridTableDataService');
    const GridTableEventService = require('../../../services/gridTableEventService');
    const gridTableEvents = require('../../../services/gridTableEvents');

    const metaHelper = require('../../../helpers/meta.helper');

    const pricingPolicyService = require('../../../services/pricingPolicyService').default;

    module.exports = function InstrmentPricingTabController($scope, $mdDialog, gridTableHelperService, configurationService) {

        var vm = this;

        vm.readyStatus = {
            content: false,
            policies: false,
            modules: false
        };
        vm.instrumentPricingSchemes = null;

        vm.entity = $scope.$parent.vm.entity;
        vm.entityType = $scope.$parent.vm.entityType; // 'instrument' or 'instrument-type'
        vm.currencies = $scope.$parent.vm.currencies;
        vm.pricingConditions = $scope.$parent.vm.pricingConditions;

        //region Inherit from a parent controller

        vm.attributeTypesByValueTypes = $scope.$parent.vm.attributeTypesByValueTypes; // Parent controller can be entityViewerEditDialogController, entityViewerAddDialogController, instrumentTypeEditDialogController, instrumentTypeAddDialogController
        vm.pricingSchemeChange = $scope.$parent.vm.pricingSchemeChange;	// Have to leave pricingSchemeChange one level above because of currency entity viewer

        vm.contextData = $scope.$parent.vm.contextData;
        vm.entityAttrs = $scope.$parent.vm.entityAttrs;

        vm.evEditorDataService = $scope.$parent.vm.evEditorDataService;
        vm.evEditorEventService = $scope.$parent.vm.evEditorEventService;
        vm.entityChange = $scope.$parent.vm.entityChange;
        //endregion
        vm.entity.pricing_policies = vm.entity.pricing_policies ?? [];

        vm.runPricingInstrument = function ($event) {

            vm.entity.isInstrument = true;

            $mdDialog.show({
                controller: 'RunPricingInstrumentDialogController as vm',
                templateUrl: 'views/dialogs/pricing/run-pricing-instrument-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                clickOutsideToClose: false,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    data: {
                        instrument: vm.entity,
                        contextData: vm.contextData
                    }

                }
            }).then(function (res) {

                if (res.status === 'agree') {

                    $mdDialog.show({
                        controller: 'InfoDialogController as vm',
                        templateUrl: 'views/info-dialog-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
                        targetEvent: $event,
                        clickOutsideToClose: false,
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        multiple: true,
                        locals: {
                            info: {
                                title: 'Success',
                                description: "Pricing Process Initialized."
                            }
                        }
                    });

                }

            });

        };

        vm.addPricingPolicy = function () {
            vm.entity.pricing_policies.push({})
        }

        vm.removePricingPolicy = function (item) {
            vm.entity.pricing_policies = vm.entity.pricing_policies.filter(function(policy) {
                return policy !== item;
            });
        }

        vm.getPricingConfigurations = function () {

            configurationService.getList({
                pageSize: 1000,
                page: 1,
                filters: {
                    type: "pricing"
                },
                sort: {
                    direction: "DESC",
                    key: "created_at"
                }
            }).then(function (data) {

                vm.pricingModules = data.results;

                vm.pricingModules = vm.pricingModules.map(function (item) {
                    item._id = item.id;
                    item.id = item.configuration_code;
                    return item
                })

                console.log('vm.pricingModules ', vm.pricingModules);

                vm.readyStatus.modules = true;

                $scope.$apply();

            });

        }

        vm.getPricingPolicies = function () {

            pricingPolicyService.getList().then(function (data) {

                vm.pricingPolicies = data.results;
                vm.readyStatus.policies = true;
                $scope.$apply();

            })

        }

        vm.configurePricingModule = function ($event, item) {

            // TODO force entity save before open module configuration iframe dialog

            $mdDialog.show({
                controller: 'ConfigurePricingModuleDialogController as vm',
                templateUrl: 'views/dialogs/configure-pricing-module-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    data: {
                        instrument: vm.entity,
                        instrumentPricingPolicy: item
                    }
                }
            })

        }

        vm.init = function () {

            vm.getPricingConfigurations();
            vm.getPricingPolicies();
            vm.readyStatus.content = true;

        };

        vm.init();


    }

}());