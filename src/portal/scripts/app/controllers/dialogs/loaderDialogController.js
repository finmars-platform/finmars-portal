'use strict';

export default function ($scope, $customDialog, data) {

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

};