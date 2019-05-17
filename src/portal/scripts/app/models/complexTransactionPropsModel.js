/**
 * Created by szhitenev on 03.04.2017.
 */
(function () {

    'use strict';

    var getAttributes = function () {
        return [
            {
                "key": "code",
                "name": "Code",
                "value_type": 20
            },
            {
                "key": "date",
                "name": "Date",
                "value_type": 40
            },
            {
                "key": "status",
                "name": "Status",
                "value_type": 10 // actually field
            },
            {
                "key": "text",
                "name": "Description",
                "value_type": 10
            },
            {
                "key": "transaction_type",
                "name": "Transaction Type",
                "value_type": "field",
                "value_entity": "transaction-type",
                "code": "user_code",
                "value_content_type": "transactions.transactiontype",
                "allow_null": false
            },

            {
                "key": "user_text_1",
                "name": "User Text 1",
                "value_type": 10
            },
            {
                "key": "user_text_2",
                "name": "User Text 2",
                "value_type": 10
            },

            {
                "key": "user_text_3",
                "name": "User Text 3",
                "value_type": 10
            },

            {
                "key": "user_text_4",
                "name": "User Text 4",
                "value_type": 10
            },

            {
                "key": "user_text_5",
                "name": "User Text 5",
                "value_type": 10
            },

            {
                "key": "user_text_6",
                "name": "User Text 6",
                "value_type": 10
            },

            {
                "key": "user_text_7",
                "name": "User Text 7",
                "value_type": 10
            },

            {
                "key": "user_text_8",
                "name": "User Text 8",
                "value_type": 10
            },

            {
                "key": "user_text_9",
                "name": "User Text 9",
                "value_type": 10
            },

            {
                "key": "user_text_10",
                "name": "User Text 10",
                "value_type": 10
            },

            {
                "key": "user_number_1",
                "name": "User Number 1",
                "value_type": 20
            },
            {
                "key": "user_number_2",
                "name": "User Number 2",
                "value_type": 20
            },

            {
                "key": "user_number_3",
                "name": "User Number 3",
                "value_type": 20
            },

            {
                "key": "user_number_4",
                "name": "User Number 4",
                "value_type": 20
            },

            {
                "key": "user_number_5",
                "name": "User Number 5",
                "value_type": 20
            },

            {
                "key": "user_number_6",
                "name": "User Number 6",
                "value_type": 20
            },

            {
                "key": "user_number_7",
                "name": "User Number 7",
                "value_type": 20
            },

            {
                "key": "user_number_8",
                "name": "User Number 8",
                "value_type": 20
            },

            {
                "key": "user_number_9",
                "name": "User Number 9",
                "value_type": 20
            },

            {
                "key": "user_number_10",
                "name": "User Number 10",
                "value_type": 20
            },

            {
                "key": "user_date_1",
                "name": "User Date 1",
                "value_type": 40
            },
            {
                "key": "user_date_2",
                "name": "User Date 2",
                "value_type": 40
            },
            {
                "key": "user_date_3",
                "name": "User Date 3",
                "value_type": 40
            },
            {
                "key": "user_date_4",
                "name": "User Date 4",
                "value_type": 40
            },
            {
                "key": "user_date_5",
                "name": "User Date 5",
                "value_type": 40
            }
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}())