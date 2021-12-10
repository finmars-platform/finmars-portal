/**
 * Created by szhitenev on 03.04.2017.
 */
(function () {

    'use strict';

    var getAttributes = function () {
        return [
            {
                "key": "notes",
                "name": "Notes",
                "value_type": 10
            },
            {
                "key": "transaction_code",
                "name": "Transaction Code",
                "value_type": 20
            },
            {
                "key": "transaction_class",
                "name": "Transaction class",
                "value_type": "field",
                "value_entity": "transaction-class",
                "code": "user_code",
                "value_content_type": "transactions.transactionclass",
                "allow_null": false
            },
            {
                "key": "position_size_with_sign",
                "name": "Position Size with sign",
                "value_type": 20
            },
            {
                "key": "cash_consideration",
                "name": "Cash consideration",
                "value_type": 20
            },
            {
                "key": "principal_with_sign",
                "name": "Principal with sign",
                "value_type": 20
            },
            {
                "key": "carry_with_sign",
                "name": "Carry with sign",
                "value_type": 20
            },
            {
                "key": "overheads_with_sign",
                "name": "Overheads with sign",
                "value_type": 20
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
                "value_type": 20
            },
            {
                "key": "is_locked",
                "name": "Is locked",
                "value_type": 50
            },
            {
                "key": "is_canceled",
                "name": "Is canceled",
                "value_type": 50
            },
            {
                "key": "factor",
                "name": "Factor",
                "value_type": 20
            },
            // {
            //     "key": "principal_amount",
            //     "name": "Principal amount",
            //     "value_type": 20
            // },
            // {
            //     "key": "carry_amount",
            //     "name": "Carry amount",
            //     "value_type": 20
            // },
            // {
            //     "key": "overheads",
            //     "name": "overheads",
            //     "value_type": 20
            // },
            {
                "key": "trade_price",
                "name": "Trade price",
                "value_type": 20
            }
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}())