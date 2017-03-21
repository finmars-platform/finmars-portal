/**
 * Created by szhitenev on 20.02.2017.
 */
(function () {

    'use strict';

    var controller = function () {

        console.log('this', this);

        var vm = this;

        vm.dateFormats = [
            {id: 1, caption: "dd.mm.yyyy"},
            {id: 2, caption: "dd.mm.yy"},
            {id: 3, caption: "mmmm'yy"},
            {id: 4, caption: "dd-mmm-yy"}
        ];

        vm.frequencies = [
            {id: 1, caption: "Daily"},
            {id: 2, caption: "Weekly (+7d)"},
            {id: 3, caption: "Weekly (EoW)"},
            {id: 4, caption: "Bi-weekly (+14d)"},
            {id: 5, caption: "Bi-weekly (EoW)"},
            {id: 6, caption: "Monthly"},
            {id: 7, caption: "Monthly (EoM)"},
            {id: 8, caption: "Monthly (Last business day)"},
            {id: 9, caption: "Quarterly (Calendar)"},
            {id: 10, caption: "Quarterly (+3m)"},
            {id: 11, caption: "Yearly (+12m)"},
            {id: 12, caption: "Yearly (EoY)"}];


        vm.addRange = function (item, $index) {

            vm.items.splice($index + 1, 0, {})

        };

        vm.removeRange = function ($index) {

            vm.items.splice($index, 1);

        }

    };

    module.exports = {
        bindings: {
            "items": "=",
            "range": '='
        },
        templateUrl: 'views/components/date-range-custom-field-control-component.html',
        controller: controller
    }

}());