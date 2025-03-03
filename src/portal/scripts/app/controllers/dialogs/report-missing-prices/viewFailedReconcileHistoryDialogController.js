/**
 * Created by szhitenev on 10.11.2020.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.items = data.results;

        vm.getStatusTitle = function(status) {
            let result = {};
            switch(status) {
                case 'error':
                    result.text = 'Error';
                    result.color = 'var(--error-color)';
                    break;
                case 'not_run_yet':
                    result.text = 'Not run yet';
                    result.color = 'var(--primary-color)';
                    break;
                case 'no_group':
                    result.text = 'No group';
                    result.color = 'var(--primary-color)';
                    break;
                case 'ok':
                    result.text = 'Ok';
                    result.color = 'var(--success-color)';
                    break;
                default:
                    result.text = status;
                    result.color = 'var(--primary-color)';
                    break;
            }
            return result;
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };
    }

}());