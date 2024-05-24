/**
 * Created by szhitenev on 03.03.2020.
 */
(function(){

    'use strict';

    module.exports = function($scope){

        var vm = this;

        vm.entityType = 'price-history-error'; // deprecated
        vm.contentType = 'pricing.pricehistoryerror';

        vm.entityRaw = [];

        vm.readyStatus = {content: false};

        vm.entityViewer = {extraFeatures: []};

        vm.init = function(){
            vm.readyStatus.content = true
        };

        vm.init()

    }

}());