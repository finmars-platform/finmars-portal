'use strict';

import metaService from '../../services/metaService';
import pricingPolicyService from '../../services/pricingPolicyService';
import currencyService from '../../services/currencyService';
import toastNotificationService from '../../../../../core/services/toastNotificationService';
import instrumentTypeService from '../../services/instrumentTypeService';

export default function ($scope, $mdDialog, instrumentService) {

    var vm = this;

    vm.readyStatus = {content: false};
    vm.items = [];

    vm.pricingModel = [];
    vm.currencyModel = [];
    vm.instrumentModel = [];
    vm.instrumentTypeModel = [];

    /**
     *
     * @param {Function} requestMethod - Method to request entities to use inside multiselector. Returns Promise.
     * @returns {Promise<*>}
     */
    const getItemsForMultiselector = async function (requestMethod) {

        const argsList = [{
            page: 1,
            pageSize: 1000,
        }];

        try {

            const res = await metaService.loadDataFromAllPages(
                requestMethod,
                argsList
            );

            return res.map(entity => {
                return {
                    id: entity.user_code,
                    name: entity.name
                };
            });

        } catch (e) {
            throw e;
        }

    };

    /**
     *
     * @param {Function} requestMethod - returns Promise
     * @returns {Promise<*>}
     */
    vm.getPricingPolicies = function () {
        return getItemsForMultiselector(pricingPolicyService.getListLight);
    };

    vm.getInstruments = function () {
        return getItemsForMultiselector(instrumentService.getListLight);
    }

    vm.getCurrencies = function () {
        return getItemsForMultiselector(currencyService.getListLight);
    }

    vm.getInstrumentTypes = function () {
        return getItemsForMultiselector(instrumentTypeService.getListLight);
    };

    vm.runPricing = function () {
        vm.data = {}
        vm.data.date_from = vm.item.date_from;
        vm.data.date_to = vm.item.date_to;
        vm.data.pricing_policies = vm.pricingModel;
        vm.data.currencies = vm.currencyModel;
        vm.data.instruments = vm.instrumentModel;
        vm.data.instrument_types = vm.instrumentTypeModel;

        pricingPolicyService.runPricing(vm.data).then(function (data) {
            // TODO pricingv2 task card to show progress
            toastNotificationService.success('Success. Schedule  is being processed');

            $mdDialog.hide({status: 'disagree'});
        })
    }

};