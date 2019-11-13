/**
 * Created by szhitenev on 05.11.2019.
 */
(function () {

    'use strict';

    var metaContentTypesService = require('../../services/metaContentTypesService');


    module.exports = function ($scope, $mdDialog, data) {

        console.log('data', data);

        var vm = this;

        vm.template = JSON.parse(JSON.stringify(data.template));

        vm.template.data.inputs.forEach(function (input) {
            input.is_active = true;
        });

        vm.contentTypes = metaContentTypesService.getListForTransactionTypeInputs();

        vm.valueTypes = [
            {
                "display_name": "Number",
                "value": 20
            },
            {
                "display_name": "String",
                "value": 10
            },
            {
                "display_name": "Date",
                "value": 40
            },
            {
                "display_name": "Relation",
                "value": 100
            }
        ];

        vm.contextProperties = {

            'instruments.instrument': [
                {
                    key: 'instrument',
                    name: 'Instrument'
                }

                // TODO is not in use now
                // {
                //     id: 9,
                //     name: 'position'
                // },
                // {
                //     id: 10,
                //     name: 'effective_date'
                // }
            ],
            'currencies.currency': [
                {
                    key: 'pricing_currency',
                    name: 'Pricing Currency'
                },
                {
                    key: 'accrued_currency',
                    name: 'Accrued Currency'
                }
            ],
            'portfolios.portfolio': [
                {
                    key: 'portfolio',
                    name: 'Portfolio'
                }
            ],
            'accounts.account': [
                {
                    key: 'account',
                    name: 'Account'
                }
            ],
            'strategies.strategy1': [
                {
                    key: 'strategy1',
                    name: 'Strategy 1'
                }
            ],
            'strategies.strategy2': [
                {
                    key: 'strategy2',
                    name: 'Strategy 2'
                }
            ],
            'strategies.strategy3': [
                {
                    key: 'strategy3',
                    name: 'Strategy 3'
                }
            ]

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            vm.template.data.inputs = vm.template.data.inputs.filter(function (input) {
                return input.is_active
            });

            $mdDialog.hide({status: 'agree', data: {template: vm.template}});

        };
    }

}());