/**
 * Created by szhitenev on 03.04.2017.
 */
(function () {

    'use strict';

    var getAttributes = function () {
        return [
            {
                "key": "transaction_code",
                "name": "Transaction Code",
                "value_type": 20
            },
            {
                "key": "transaction_class",
                "name": "Transaction class",
                "value_type": "field"
            },
            {
                "key": "portfolio",
                "name": "Portfolio",
                "value_type": "field"
            },
            {
                "key": "transaction_currency",
                "name": "Transaction currency",
                "value_type": "field"
            },
            {
                "key": "instrument",
                "name": "Instrument",
                "value_type": "field"
            },
            {
                "key": "position_size_with_sign",
                "name": "Position Size with sign",
                "value_type": "float"
            },
            {
                "key": "settlement_currency",
                "name": "Settlement currency",
                "value_type": "field"
            },
            {
                "key": "cash_consideration",
                "name": "Cash consideration",
                "value_type": "float"
            },
            {
                "key": "principal_with_sign",
                "name": "Principal with sign",
                "value_type": "float"
            },
            {
                "key": "carry_with_sign",
                "name": "Carry with sign",
                "value_type": "float"
            },
            {
                "key": "overheads_with_sign",
                "name": "Overheads with sign",
                "value_type": "float"
            },
            {
                "key": "accounting_date",
                "name": "Accounting date",
                "value_type": 40
            },
            {
                "key": "cash_date",
                "name": "Cash date",
                "value_type": 40
            },
            //{
            //    "key": "transaction_date",
            //    "name": "Transaction date",
            //    "value_type": 40
            //},
            {
                "key": "account_cash",
                "name": "Account cash",
                "value_type": 'field'
            },
            {
                "key": "account_position",
                "name": "Account position",
                "value_type": 'field'
            },
            {
                "key": "account_interim",
                "name": "Account interim",
                "value_type": 'field'
            },
            {
                "key": "strategy1_position",
                "name": "Strategy1 position",
                "value_type": 'field'
            },
            {
                "key": "strategy1_cash",
                "name": "Strategy1 cash",
                "value_type": 'field'
            },
            {
                "key": "strategy2_position",
                "name": "Strategy2 position",
                "value_type": 'field'
            },
            {
                "key": "strategy2_cash",
                "name": "Strategy2 cash",
                "value_type": 'field'
            },
            {
                "key": "strategy3_position",
                "name": "Strategy3 position",
                "value_type": 'field'
            },
            {
                "key": "strategy3_cash",
                "name": "Strategy3 cash",
                "value_type": 'field'
            },
            {
                "key": "reference_fx_rate",
                "name": "Reference fx rate",
                "value_type": 'float'
            },
            {
                "key": "is_locked",
                "name": "Is locked",
                "value_type": 'boolean'
            },
            {
                "key": "is_canceled",
                "name": "Is canceled",
                "value_type": 'boolean'
            },
            {
                "key": "factor",
                "name": "Factor",
                "value_type": 'float'
            },
            {
                "key": "principal_amount",
                "name": "Principal amount",
                "value_type": 'float'
            },
            {
                "key": "carry_amount",
                "name": "Carry amount",
                "value_type": 'float'
            },
            {
                "key": "overheads",
                "name": "overheads",
                "value_type": 'float'
            },
            {
                "key": "responsible",
                "name": "Responsible",
                "value_type": 'field'
            },
            {
                "key": "counterparty",
                "name": "Counterparty",
                "value_type": 'field'
            },
            {
                "key": "trade_price",
                "name": "Trade price",
                "value_type": 'float'
            },
            {
                "key": "object_permissions_user",
                "name": "Users permissions",
                "value_type": "mc_field"
            },
            {
                "key": "object_permissions_group",
                "name": "Groups permissions",
                "value_type": "mc_field"
            }
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}())