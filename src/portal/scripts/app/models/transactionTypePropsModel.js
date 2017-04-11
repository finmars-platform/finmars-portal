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
                "value_type": "mc_field"
            },
            {
                "key": "portfolios",
                "name": "Portfolios",
                "value_type": "mc_field"
            },
            {
                "key": "tags",
                "name": "Tags",
                "value_type": "mc_field"
            },
            {
                "key": "tags",
                "name": "Tags",
                "value_type": "mc_field"
            },
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