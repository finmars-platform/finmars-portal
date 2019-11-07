/**
 * Created by szhitenev on 06.11.2019.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $customDialog, data) {

        console.log('data', data);

        var vm = this;

        vm.text = 'Processing';

        if (data.text) {
            vm.text = data.text;
        }

        vm.cancel = function () {

            console.log('$customDialog', $customDialog);

            $customDialog.hide({status: 'disagree'});
        };

    }

}());