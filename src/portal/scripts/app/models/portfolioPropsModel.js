/**
 * Created by szhitenev on 03.04.2017.
 */
(function () {

    'use strict';

    var getAttributes = function () {
        return [
            {
                "key": "id",
                "name": "ID",
                "value_type": 20
            },
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
                "key": "user_code",
                "name": "User code",
                "value_type": 10
            },
            {
                "key": "public_name",
                "name": "Public name",
                "value_type": 10,
                "allow_null": true
            },
            {
                "key": "notes",
                "name": "Notes",
                "value_type": 10
            },
            {
                "key": "accounts",
                "name": "Accounts",
                "value_content_type": "accounts.account",
                "value_entity": "account",
                "code": "user_code",
                "value_type": "mc_field"

            },
            {
                "key": "responsibles",
                "name": "Responsibles",
                "value_content_type": "counterparties.responsible",
                "value_entity": "responsible",
                "code": "user_code",
                "value_type": "mc_field"
            },
            {
                "key": "counterparties",
                "name": "Counterparties",
                "value_content_type": "counterparties.counterparty",
                "value_entity": "counterparty",
                "code": "user_code",
                "value_type": "mc_field"
            },
            {
                "key": "transaction_types",
                "name": "Transaction types",
                "value_content_type": "transactions.transactiontype",
                "value_entity": "transaction-type",
                "code": "user_code",
                "value_type": "mc_field"
            },
            {
                "key": "object_permissions",
                "name": "Object permissions",
                "value_type": "mc_field"
            },
            {
                "key": "first_transaction_date",
                "name": "First Transaction Date",
                "value_type": 40,
                "allow_null": true
            },
            {
                "key": "first_cash_flow_date",
                "name": "First Cash Flow Date",
                "value_type": 40,
                "allow_null": true
            },
            {
                "key": "portfolio_type",
                "name": "Portfolio type",
                "value_type": "field",
                "value_content_type": "portfolios.portfoliotype",
                "value_entity": "portfolio-type",
                "code": "user_code"
            },
            {
                "key": "created_at",
                "name": "Created At",
                "value_type": 80,
                "readonly": true
            },
            {
                "key": "modified_at",
                "name": "Modified At",
                "value_type": 80,
                "readonly": true
            },
            {
                "key": "deleted_at",
                "name": "Delete At",
                "value_type": 40,
                "readonly": true
            },
            {
                "key": "resource_groups",
                "name": "Resource Groups",
                "value_type": "mc_field",
                "value_content_type": "iam.resourcegroup",
                "value_entity": "resource-group",
                "code": "user_code"
            },

            {
                "key": "register_currency",
                "name": "Register currency",
                "value_content_type": "currencies.currency",
                "value_entity": "currency",
                "code": "user_code",
                "value_type": "field"
            },

            {
                "key": "register_instrument_type",
                "name": "Register Instrument Type",
                "value_type": "field",
                "value_content_type": "instruments.instrumenttype",
                "value_entity": "instrument-type",
                "code": "user_code"
            },

            {
                "key": "register_pricing_policy",
                "name": "Register Pricing policy",
                "value_content_type": "instruments.pricingpolicy",
                "value_entity": "pricing_policy",
                "code": "user_code",
                "value_type": "field"
            },
            {
                "key": "source",
                "name": "Source",
                "value_type": "field",
                "value_content_type": "provenance.source",
                "value_entity": "source",
                "code": "user_code"
            },
            {
                "key": "source_version",
                "name": "Source Version",
                "value_type": "field",
                "value_content_type": "provenance.sourceversion",
                "value_entity": "source-version",
                "code": "user_code"
            },
            {
                "key": "provider",
                "name": "Provider",
                "value_type": "field",
                "value_content_type": "provenance.provider",
                "value_entity": "provider",
                "code": "user_code"
            },
            {
                "key": "provider_version",
                "name": "Provider Version",
                "value_type": "field",
                "value_content_type": "provenance.providerversion",
                "value_entity": "provider-version",
                "code": "user_code"
            },
            {
                "key": "platform_version",
                "name": "Platform Version",
                "value_type": "field",
                "value_content_type": "provenance.platform_version",
                "value_entity": "platform-version",
                "code": "user_code"
            }


        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}());