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
                "key": "accounts",
                "name": "Accounts",
                "content_type": "accounts.account",
                "entity": "account",
                "code": "user_code",
                "value_type": "mc_field"

            },
            {
                "key": "responsibles",
                "name": "Responsibles",
                "content_type": "counterparties.responsible",
                "entity": "responsible",
                "code": "user_code",
                "value_type": "mc_field"
            },
            {
                "key": "counterparties",
                "name": "Counterparties",
                "content_type": "counterparties.counterparty",
                "entity": "counterparty",
                "code": "user_code",
                "value_type": "mc_field"
            },
            {
                "key": "transaction_types",
                "name": "Transaction types",
                "content_type": "transactions.transactiontype",
                "entity": "transaction-type",
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
            }
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}())