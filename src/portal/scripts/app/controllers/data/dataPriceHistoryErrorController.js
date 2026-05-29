'use strict';

export default function($scope){

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

};