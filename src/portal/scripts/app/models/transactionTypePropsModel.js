/**
 * Created by szhitenev on 03.04.2017.
 */
(function () {

    'use strict';

    var getAttributes = function () {
        return [
            {
                "key": "name",
                "name": "Name",
                "value_type": 10
            },
            {
                "key": "short_name",
                "name": "Short name",
                "value_type": 10
            },
            {
                "key": "notes",
                "name": "Notes",
                "value_type": 10
            },
            {
                "key": "user_code",
                "name": "User code",
                "value_type": 10
            },
            {
                "key": "group",
                "name": "Group",
                "value_type": "field"
            },
            {
                "key": "display_expr",
                "name": "Display Expression",
                "value_type": 10
            },
            {
                "key": "instrument_types",
                "name": "Instrument types",
                "value_content_type": "instruments.instrumenttype",
                "value_entity": "instrument-type",
                "code": "user_code",
                "value_type": "mc_field"
            },
            {
                "key": "portfolios",
                "name": "Portfolios",
                "value_content_type": "portfolios.portfolio",
                "value_entity": "portfolio",
                "code": "user_code",
                "value_type": "mc_field"
            },
            {
                "key": "tags",
                "name": "Tags",
                "value_type": "mc_field"
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
                "value_type": 10
            },
            {
                "key": "user_number_2",
                "name": "User Number 2",
                "value_type": 10
            },

            {
                "key": "user_number_3",
                "name": "User Number 3",
                "value_type": 10
            },

            {
                "key": "user_number_4",
                "name": "User Number 4",
                "value_type": 10
            },

            {
                "key": "user_number_5",
                "name": "User Number 5",
                "value_type": 10
            },

            {
                "key": "user_number_6",
                "name": "User Number 6",
                "value_type": 10
            },

            {
                "key": "user_number_7",
                "name": "User Number 7",
                "value_type": 10
            },

            {
                "key": "user_number_8",
                "name": "User Number 8",
                "value_type": 10
            },

            {
                "key": "user_number_9",
                "name": "User Number 9",
                "value_type": 10
            },

            {
                "key": "user_number_10",
                "name": "User Number 10",
                "value_type": 10
            },

            {
                "key": "user_date_1",
                "name": "User Date 1",
                "value_type": 10
            },
            {
                "key": "user_date_2",
                "name": "User Date 2",
                "value_type": 10
            },
            {
                "key": "user_date_3",
                "name": "User Date 3",
                "value_type": 10
            },
            {
                "key": "user_date_4",
                "name": "User Date 4",
                "value_type": 10
            },
            {
                "key": "user_date_5",
                "name": "User Date 5",
                "value_type": 10
            }

            //{
            //    "key": "book_transaction_layout",
            //    "name": "Book transaction Layout",
            //    "value_type": 10
            //}
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}())