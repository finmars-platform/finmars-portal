/**
 * Created by mevstratov on 08.06.2016.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.schemeErrors = data.errorsInScheme;

        vm.close = function () {
            $mdDialog.hide();
        };

    };

}());