'use strict';

export default function ($scope, $state) {

    var vm = this;

    $scope.$state = $state;

    vm.checkProviders = function () {
        return $state.includes('app.portal.settings.general.data-providers') || $state.includes('app.portal.settings.general.data-providers-config')
    }


};