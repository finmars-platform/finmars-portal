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
                "key": "position_size_with_sign",
                "name": "Position Size with sign",
                "value_type": "float"
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
            }
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}())