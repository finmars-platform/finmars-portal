/**
 * Created by szhitenev on 09.07.2024.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, $sce, globalDataService, data) {

        console.log('data', data);

        var vm = this;

        vm.data = data;

        const currentMasterUser = globalDataService.getMasterUser();

        //com.finmars.standard-pricing-roll:run_pricing
        // data.instrumentPricingPolicy.target_pricing_schema_user_code
        var configuration_code = data.instrumentPricingPolicy.target_pricing_schema_user_code.split(':')[0];
        var configuration_path = configuration_code.split('.').join('/')
        vm.iframeUrl = '/' + currentMasterUser.realm_code + '/' + currentMasterUser.space_code + '/api/storage/workflows/' + configuration_path + '/setup.html'

        vm.iframeUrl = vm.iframeUrl + '?instrument=' + data.instrument.id;

        vm.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

    }

}());