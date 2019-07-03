/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var attributeTypeService = require('../../services/attributeTypeService');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.entityType = data.entityType;
        vm.item = data.item;

        vm.filename = '';

        console.log('vm.item', vm.item);

        vm.readyStatus = {content: false};

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.setDownloadLink = function () {

            var link = document.querySelector('.export-classifier-link');

            var text = 'User Attribute: ' + vm.item.user_code + ' (' + vm.item.name + ')\n';

            vm.classifier.classifiers.forEach(function (item) {

                text = text + item.name + '\n';

            });

            var file = new Blob([text], {type: 'text/plain'});

            link.href = URL.createObjectURL(file);

            link.addEventListener('click', function () {

                if (vm.filename) {
                    link.download = vm.filename + '.csv';
                } else {
                    link.download = 'classifiers.csv';
                }

                $mdDialog.cancel();
            })

        };

        vm.getClassifier = function () {

            vm.readyStatus.content = false;

            attributeTypeService.getByKey(vm.entityType, vm.item.id).then(function (data) {

                vm.classifier = data;

                vm.readyStatus.content = true;

                $scope.$apply();

                vm.setDownloadLink();

            })
        };

        vm.init = function () {
            vm.getClassifier()
        };

        vm.init();
    }

}());