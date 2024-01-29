/**
 * Created by szhitenev on 06.11.2019.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $customDialog, data) {

        console.log('data', data);

        var vm = this;

        vm.title = 'Processing';

        if (data.title) {
            vm.title = data.title;
        }

        vm.cancel = function () {

            console.log('$customDialog', $customDialog);

            $customDialog.hide({status: 'disagree'});
        };

    }

}());