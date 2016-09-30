/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    "use strict";

    var getMenu = function () {
        return window.fetch("portal/content/json/menu.json").then(function (data) {
            return data.json();
        });
    };

    var getBaseAttrs = function () {
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
            }
        ];
    };

    var getEntitiesWithoutBaseAttrsList = function () {
        return ['price-history', 'currency-history', 'transaction'];
    };
    var getEntitiesWithoutDynAttrsList = function () {
        return ['price-history', 'currency-history', 'transaction', 'pricing-policy','strategy-1', 'strategy-2', 'strategy-3',
            'strategy-1-group', 'strategy-2-group', 'strategy-3-group',
            'strategy-1-subgroup', 'strategy-2-subgroup', 'strategy-3-subgroup'];
    };

    var getEntityAttrs = function (entity) {
        var entityAttrs = {
            "portfolio": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "accounts",
                    "name": "Accounts",
                    "value_type": "mc_field"

                },
                {
                    "key": "responsibles",
                    "name": "Responsibles",
                    "value_type": "mc_field"
                },
                {
                    "key": "counterparties",
                    "name": "Counterparties",
                    "value_type": "mc_field"
                },
                {
                    "key": "transaction_types",
                    "name": "Transaction types",
                    "value_type": "mc_field"
                }
            ],
            "account": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "portfolios",
                    "name": "Portfolios",
                    "value_type": "mc_field"

                },
                {
                    "key": "type",
                    "name": "Type",
                    "value_type": "field"
                },
                {
                    "key": "public_name",
                    "name": "Public name",
                    "value_type": 10
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                }
            ],
            "tag": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "public_name",
                    "name": "Public name",
                    "value_type": 10
                },
                {
                    "key": "content_types",
                    "name": "Content Types",
                    "value_type": 'mc_field'
                }
            ],
            "account-type": [
                {
                    "key": "public_name",
                    "name": "Public name",
                    "value_type": 10
                },
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "show_transaction_details",
                    "name": "Show transaction details",
                    "value_type": "boolean"
                },
                {
                    "key": "transaction_details_expr",
                    "name": "Transaction details expr",
                    "value_type": 10
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                }
            ],
            "counterparty": [
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
                    "key": "portfolios",
                    "name": "Portfolios",
                    "value_type": "mc_field"

                }
            ],
            "counterparty-group": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "public_name",
                    "name": "Public name",
                    "value_type": 10
                }
            ],
            "responsible": [
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
                    "key": "portfolios",
                    "name": "Portfolios",
                    "value_type": "mc_field"
                }
            ],
            "responsible-group": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "public_name",
                    "name": "Public name",
                    "value_type": 10
                }
            ],
            "pricing-policy": [
                {
                    "key": "expr",
                    "name": "Expression",
                    "value_type": 10
                },
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                }
            ],
            "instrument-type": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "public_name",
                    "name": "Public name",
                    "value_type": 10
                },
                {
                    "key": "is_active",
                    "name": "Is active",
                    "value_type": "boolean"
                },
                {
                    "key": "reference_for_pricing",
                    "name": "Reference for pricing",
                    "value_type": 10
                },
                {
                    "key": "instrument_class",
                    "name": "Instrument class",
                    "value_type": "field"
                },
                {
                    "key": "one_off_event",
                    "name": "One off event",
                    "value_type": "field"
                },
                {
                    "key": "regular_event",
                    "name": "Regular event",
                    "value_type": "field"
                },
                {
                    "key": "factor_same",
                    "name": "Factor same",
                    "value_type": "field"
                },
                {
                    "key": "factor_up",
                    "name": "Factor up",
                    "value_type": "field"
                },
                {
                    "key": "factor_down",
                    "name": "Factor down",
                    "value_type": "field"
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                }
            ],
            "instrument": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "instrument_type",
                    "name": "Instrument type",
                    "value_type": "field"
                },
                {
                    "key": "is_active",
                    "name": "Is active",
                    "value_type": "boolean"
                },
                {
                    "key": "price_download_scheme",
                    "name": "Price download scheme",
                    "value_type": "field"
                },
                {
                    "key": "pricing_currency",
                    "name": "Pricing currency",
                    "value_type": "field"
                },
                {
                    "key": "price_multiplier",
                    "name": "Price multiplier",
                    "value_type": "float"
                },
                {
                    "key": "accrued_currency",
                    "name": "Accrued currency",
                    "value_type": "field"
                },
                {
                    "key": "accrued_multiplier",
                    "name": "Accrued multiplier",
                    "value_type": "float"
                },
                {
                    "key": "daily_pricing_model",
                    "name": "Daily pricing model",
                    "value_type": "field"
                },
                {
                    "key": "payment_size_detail",
                    "name": "Payment size detail",
                    "value_type": "field"
                },
                {
                    "key": "default_price",
                    "name": "Default price",
                    "value_type": "float"
                },
                {
                    "key": "default_accrued",
                    "name": "Default accrued",
                    "value_type": "float"
                },
                {
                    "key": "user_text_1",
                    "name": "User text 1",
                    "value_type": 10
                },
                {
                    "key": "user_text_2",
                    "name": "User text 2",
                    "value_type": 10
                },
                {
                    "key": "user_text_3",
                    "name": "User text 3",
                    "value_type": 10
                }
            ],
            "transaction": [
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
                }
            ],
            "transaction-type-group": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "public_name",
                    "name": "Public name",
                    "value_type": 10
                }
            ],
            "transaction-type": [
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
                }
            ],
            "currency": [
                {
                    "key": "reference_for_pricing",
                    "name": "Reference for pricing",
                    "value_type": 10
                },
                {
                    "key": "daily_pricing_model",
                    "name": "Daily pricing model",
                    "value_type": "field"
                },
                {
                    "key": "price_download_scheme",
                    "name": "Price download scheme",
                    "value_type": "field"
                }
            ],
            "currency-history": [
                {
                    "key": "currency",
                    "name": "Currency",
                    "value_type": "field"
                },
                {
                    "key": "date",
                    "name": "Date",
                    "value_type": 40
                },
                {
                    "key": "fx_rate",
                    "name": "Fx rate",
                    "value_type": "float"
                },
                {
                    "key": "pricing_policy",
                    "name": "Pricing policy",
                    "value_type": "field"
                }
                //{
                //    "key": "fx_rate_expr",
                //    "name": "fx_rate_expr",
                //    "value_type": 10
                //}
            ],
            "price-history": [
                {
                    "key": "instrument",
                    "name": "Instrument",
                    "value_type": "field"
                },
                {
                    "key": "date",
                    "name": "Date",
                    "value_type": 40
                },
                {
                    "key": "pricing_policy",
                    "name": "Pricing policy",
                    "value_type": "field"
                },
                {
                    "key": "principal_price",
                    "name": "Principal price",
                    "value_type": "float"
                },
                {
                    "key": "accrued_price",
                    "name": "Accrued price",
                    "value_type": "float"
                }
                //{
                //    "key": "factor",
                //    "name": "Factor",
                //    "value_type": "float"
                //}
            ],
            "strategy-1": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "subgroup",
                    "name": "Sub Group",
                    "value_type": "field"
                }
            ],
            "strategy-2": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "subgroup",
                    "name": "Sub Group",
                    "value_type": "field"
                }
            ],
            "strategy-3": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "subgroup",
                    "name": "Sub Group",
                    "value_type": "field"
                }
            ],
            "strategy-1-subgroup": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "group",
                    "name": "Group",
                    "value_type": "field"
                }
            ],
            "strategy-2-subgroup": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "group",
                    "name": "Group",
                    "value_type": "field"
                }
            ],
            "strategy-3-subgroup": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "group",
                    "name": "Group",
                    "value_type": "field"
                }
            ],
            "strategy-1-group": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                }
            ],
            "strategy-2-group": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                }
            ],
            "strategy-3-group": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                }
            ],
            "instrument-scheme": [
                {
                    key: 'reference_for_pricing',
                    name: 'Reference for pricing',
                    "value_type": 10
                },
                {
                    key: 'factor_schedule_method',
                    name: 'Factor schedule method',
                    type: 'field'
                },
                {
                    key: 'accrual_calculation_schedule_method',
                    name: 'Accrual calculation schedule method',
                    type: 'field'
                },
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "public_name",
                    "name": "Public name",
                    "value_type": 10
                },
                {
                    "key": "instrument_type",
                    "name": "Instrument type",
                    "value_type": 10
                },
                {
                    "key": "pricing_currency",
                    "name": "Pricing currency",
                    "value_type": 10
                },
                {
                    "key": "price_multiplier",
                    "name": "Price multiplier",
                    "value_type": 10
                },
                {
                    "key": "accrued_currency",
                    "name": "Accrued currency",
                    "value_type": 10
                },
                {
                    "key": "accrued_multiplier",
                    "name": "Accrued multiplier",
                    "value_type": 10
                },
                {
                    "key": "user_text_1",
                    "name": "User text 1",
                    "value_type": 10
                },
                {
                    "key": "user_text_2",
                    "name": "User text 2",
                    "value_type": 10
                },
                {
                    "key": "user_text_3",
                    "name": "User text 3",
                    "value_type": 10
                },
                {
                    "key": "maturity_date",
                    "name": "Maturity date",
                    "value_type": 10
                },
                {
                    "key": "payment_size_detail",
                    "name": "Payment size detail",
                    "value_type": 'field'
                },
                {
                    "key": "daily_pricing_model",
                    "name": "Daily pricing model",
                    "value_type": 'field'
                },
                {
                    "key": "price_download_scheme",
                    "name": "Price download scheme",
                    "value_type": 'field'
                },
                {
                    "key": "default_price",
                    "name": "Default price",
                    "value_type": 10
                },
                {
                    "key": "default_accrued",
                    "name": "Default accrued",
                    "value_type": 10
                }
            ]
        };

        return entityAttrs[entity];
    };

    var getValueTypes = function () {
        return [{
            "value": 20,
            "display_name": "Number"
        }, {
            "value": 10,
            "display_name": "String"
        }, {
            "value": 40,
            "display_name": "Date"
        }, {
            "value": 30,
            "display_name": "Classifier"
        }, {
            "value": "decoration",
            "display_name": "Decoration"
        }, {
            "value": "field",
            "display_name": "Field"
        }, {
            "value": "mc_field",
            "display_name": "Multiple choice field"
        }, {
            "value": "boolean",
            "display_name": "Boolean"
        }, {
            "value": "float",
            "display_name": "Float"
        }
        ];
    };

    var getDynamicAttrsValueTypes = function () {
        return [
            {
                "value": 20,
                "display_name": "Number"
            }, {
                "value": 10,
                "display_name": "String"
            }, {
                "value": 40,
                "display_name": "Date"
            }, {
                "value": 30,
                "display_name": "Classifier"
            }
        ]
    };

    var getRestrictedEntitiesWithTypeField = function () {
        return ['daily_pricing_model', 'payment_size_detail', 'accrued_currency', 'pricing_currency'];
    };

    var getEntityTabs = function (entityType) {
        switch (entityType) {
            case 'instrument':
                return [
                    {
                        label: 'Accruals',
                        templateUrl: 'views/tabs/instrument/accrual-calculation-schedules-view.html'
                    },
                    {
                        label: 'Events',
                        templateUrl: 'views/tabs/instrument/events-view.html'
                    },
                    {
                        label: 'Pricing',
                        templateUrl: 'views/tabs/instrument/manual-pricing-formulas-view.html'
                    },
                    {
                        label: 'Factors',
                        templateUrl: 'views/tabs/instrument/factor-schedule-view.html'
                    }
                ];
                break;
            case 'transaction':
                return [
                    {
                        label: 'Actions',
                        templateUrl: 'views/tabs/transaction/book-transaction-actions-tab-view.html'
                    }
                ];
                break;
            case 'transaction-type':
                return [
                    {
                        label: 'General',
                        templateUrl: 'views/tabs/transaction-type/transaction-type-general-tab-view.html'
                    },
                    {
                        label: 'Inputs',
                        templateUrl: 'views/tabs/transaction-type/transaction-type-inputs-tab-view.html'
                    },
                    {
                        label: 'Actions',
                        templateUrl: 'views/tabs/transaction-type/transaction-type-actions-tab-view.html'
                    }
                ];
                break;
        }
    };

    var getEntitiesWithSimpleFields = function () {
        // e.g. both of responsible-group, counterparty group
        // have save property group, so its hard to resolve proper service
        return ["responsible", 'counterparty',
            'strategy-1', 'strategy-2', 'strategy-3',
            'transaction-type', 'transaction-type-group',
            'strategy-1-group', 'strategy-2-group', 'strategy-3-group',
            'strategy-1-subgroup', 'strategy-2-subgroup', 'strategy-3-subgroup']
    };

    var getFieldsWithTagGrouping = function(){
        return ['instrument_type', 'type', 'transaction_type', 'instrument_types',  'transaction_types', 'account_types'];
    };

    module.exports = {
        getMenu: getMenu,
        getBaseAttrs: getBaseAttrs,
        getEntityAttrs: getEntityAttrs,
        getValueTypes: getValueTypes,
        getDynamicAttrsValueTypes: getDynamicAttrsValueTypes,
        getEntitiesWithoutDynAttrsList: getEntitiesWithoutDynAttrsList,
        getEntityTabs: getEntityTabs,
        getEntitiesWithoutBaseAttrsList: getEntitiesWithoutBaseAttrsList,
        getRestrictedEntitiesWithTypeField: getRestrictedEntitiesWithTypeField,
        getEntitiesWithSimpleFields: getEntitiesWithSimpleFields,
        getFieldsWithTagGrouping: getFieldsWithTagGrouping
    }


}());