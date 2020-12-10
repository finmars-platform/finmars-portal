/**
 * Created by szhitenev on 10.12.2020.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.layout = data.layout;

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            $mdDialog.hide({status: 'agree', data: {layout: vm.layout}});
        }

        vm.addAccordion = function ($event, tab, row, name, $index) {

            console.log('vm.layout', vm.layout);
            console.log('tab', tab);
            console.log('row', row);



            if (!tab.accordions) {
                tab.accordions = []
            }

            tab.accordions.push({
                name: name,
                index: $index,
                from: $index,
                to: $index
            })

            delete row.accordionName;

        };

        vm.increaseAccordion = function ($event, item) {
            item.to = item.to + 1;
        }
        vm.decreaseAccordion = function ($event, item) {
            item.to = item.to - 1;
        }

        vm.deleteAccordion = function ($event, tab, $index) {

            tab.accordions.splice($index, 1);

        }

        vm.canCreateAccordion = function (tab, $index) {

            var result = true;

            if (tab.accordions) {

                tab.accordions.forEach(function (item){

                    if(item.index === $index) {
                        result = false;
                    }

                })


            }

            return result;

        };

        vm.init = function () {

            console.log(' vm.layout', vm.layout);


        };

        vm.init();
    }

}());