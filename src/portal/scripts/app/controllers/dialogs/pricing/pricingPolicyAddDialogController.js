'use strict';

import pricingPolicyService from '../../../services/pricingPolicyService';
import currencyPricingSchemeService from '../../../services/pricing/currencyPricingSchemeService';
import instrumentPricingSchemeService from '../../../services/pricing/instrumentPricingSchemeService';

export default function($scope, $mdDialog, data){

    var vm = this;

    vm.item = {};
    vm.types = [];

    vm.currencyPricingSchemes = [];
    vm.instrumentPricingSchemes = [];

    vm.readyStatus = {content: false, currencyPricingSchemes: false, instrumentPricingSchemes: false};




    vm.cancel = function () {
        $mdDialog.hide({status: 'disagree'});
    };

    vm.agree = function () {

        pricingPolicyService.create(vm.item).then(function (data) {

            vm.item = data;

            $mdDialog.hide({status: 'agree', data: {item: vm.item}});

        });

    };

    vm.init = function () {

    };

    vm.init();

};