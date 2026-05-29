'use strict';

export default function ($scope, $mdDialog, data) {

    var vm = this;

    vm.draft = JSON.parse(JSON.stringify(data.draft));

    vm.dataPretty = JSON.stringify(vm.draft.data, null, 4);

    // console.log('draft', vm.draft);

    vm.cancel = function () {
        $mdDialog.hide({status: 'disagree'});
    };

    vm.agree = function (responseData) {

        // console.log('vm.dataPretty', vm.dataPretty)

        $mdDialog.hide({status: 'agree', data: {data: JSON.parse(vm.dataPretty)}});

    };
};