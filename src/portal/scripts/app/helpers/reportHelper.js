/**
 * Created by szhitenev on 13.02.2017.
 */
(function () {

    'use strict';

    var releaseEntityObjects = function (entity) {

        //console.log('entity', entity);

        if (entity.length) {

            entity.forEach(function (item) {

                if (item.hasOwnProperty('instrument_object') && item.instrument_object) {

                    var instrumentObjectKeys = Object.keys(item.instrument_object);

                    instrumentObjectKeys.forEach(function (instrumentObjectKeyItem) {
                        item['instrument_object_' + instrumentObjectKeyItem] = item.instrument_object[instrumentObjectKeyItem];
                    });

                    if (item.instrument_object.hasOwnProperty('instrument_type_object')) {
                        var instrumentTypeObjectKeys = Object.keys(item.instrument_object.instrument_type_object);

                        instrumentTypeObjectKeys.forEach(function (instrumentObjectKeyItem) {
                            item['instrument_type_object_' + instrumentObjectKeyItem] = item.instrument_object.instrument_type_object[instrumentObjectKeyItem];
                        })
                    }

                }

                if (item.hasOwnProperty('allocation_balance_object') && item.allocation_balance_object) {

                    var instrumentBalanceObjectKeys = Object.keys(item.allocation_balance_object);

                    instrumentBalanceObjectKeys.forEach(function (instrumentObjectKeyItem) {
                        item['allocation_balance_object_' + instrumentObjectKeyItem] = item.allocation_balance_object[instrumentObjectKeyItem];
                    });

                    if (item.allocation_balance_object.hasOwnProperty('instrument_type_object')) {
                        var instrumentBalanceTypeObjectKeys = Object.keys(item.allocation_balance_object.instrument_type_object);

                        instrumentBalanceTypeObjectKeys.forEach(function (instrumentObjectKeyItem) {
                            item['allocation_balance_type_object_' + instrumentObjectKeyItem] = item.allocation_balance_object.instrument_type_object[instrumentObjectKeyItem];
                        })
                    }

                }

                if (item.hasOwnProperty('allocation_pl_object') && item.allocation_pl_object) {

                    var instrumentPlObjectKeys = Object.keys(item.allocation_pl_object);

                    instrumentPlObjectKeys.forEach(function (instrumentObjectKeyItem) {
                        item['allocation_pl_object_' + instrumentObjectKeyItem] = item.allocation_pl_object[instrumentObjectKeyItem];
                    });

                    if (item.allocation_pl_object.hasOwnProperty('instrument_type_object')) {
                        var instrumentPlTypeObjectKeys = Object.keys(item.allocation_pl_object.instrument_type_object);

                        instrumentPlTypeObjectKeys.forEach(function (instrumentObjectKeyItem) {
                            item['allocation_pl_type_object_' + instrumentObjectKeyItem] = item.allocation_pl_object.instrument_type_object[instrumentObjectKeyItem];
                        })
                    }

                }

                if (item.hasOwnProperty('linked_instrument_object') && item.linked_instrument_object) {

                    var linkedInstrumentObjectKeys = Object.keys(item.linked_instrument_object);

                    linkedInstrumentObjectKeys.forEach(function (instrumentObjectKeyItem) {
                        item['linked_instrument_object_' + instrumentObjectKeyItem] = item.linked_instrument_object[instrumentObjectKeyItem];
                    });

                    if (item.linked_instrument_object.hasOwnProperty('instrument_type_object')) {
                        var linkedInstrumentTypeObjectKeys = Object.keys(item.linked_instrument_object.instrument_type_object);

                        linkedInstrumentTypeObjectKeys.forEach(function (instrumentObjectKeyItem) {
                            item['linked_instrument_object_type_object_' + instrumentObjectKeyItem] = item.linked_instrument_object.instrument_type_object[instrumentObjectKeyItem];
                        })
                    }

                }

                if (item.hasOwnProperty('responsible_object') && item.responsible_object) {

                    var responsibleObjectKeys = Object.keys(item.responsible_object);

                    responsibleObjectKeys.forEach(function (responsibleObjectKeyItem) {
                        item['responsible_object_' + responsibleObjectKeyItem] = item.responsible_object[responsibleObjectKeyItem];
                    });

                }

                if (item.hasOwnProperty('counterparty_object') && item.counterparty_object) {

                    var counterpartyObjectKeys = Object.keys(item.counterparty_object);

                    counterpartyObjectKeys.forEach(function (counterPartyObjectKeyItem) {
                        item['counterparty_object_' + counterPartyObjectKeyItem] = item.counterparty_object[counterPartyObjectKeyItem];
                    });

                }

                if (item.hasOwnProperty('account_object') && item.account_object) {

                    var accountObjectKeys = Object.keys(item.account_object);

                    accountObjectKeys.forEach(function (accountObjectKeyItem) {
                        item['account_object_' + accountObjectKeyItem] = item.account_object[accountObjectKeyItem];
                    });

                    if (item.account_object.hasOwnProperty('type_object')) {
                        var accountTypeObjectKeys = Object.keys(item.account_object.type_object);

                        accountTypeObjectKeys.forEach(function (accountTypeObjectKeyItem) {
                            item['account_type_object_' + accountTypeObjectKeyItem] = item.account_object.type_object[accountTypeObjectKeyItem];
                        })
                    }

                }

                if (item.hasOwnProperty('account_position_object') && item.account_position_object) {

                    var accountPositionObjectKeys = Object.keys(item.account_position_object);

                    accountPositionObjectKeys.forEach(function (accountObjectKeyItem) {
                        item['account_position_object_' + accountObjectKeyItem] = item.account_position_object[accountObjectKeyItem];
                    });

                    if (item.account_position_object.hasOwnProperty('type_object')) {
                        var accountPositionTypeObjectKeys = Object.keys(item.account_position_object.type_object);

                        accountPositionTypeObjectKeys.forEach(function (accountTypeObjectKeyItem) {
                            item['account_position_type_object_' + accountTypeObjectKeyItem] = item.account_position_object.type_object[accountTypeObjectKeyItem];
                        })
                    }

                }

                if (item.hasOwnProperty('account_cash_object') && item.account_cash_object) {

                    var accountCashObjectKeys = Object.keys(item.account_cash_object);

                    accountCashObjectKeys.forEach(function (accountObjectKeyItem) {
                        item['account_cash_object_' + accountObjectKeyItem] = item.account_cash_object[accountObjectKeyItem];
                    });

                    if (item.account_cash_object.hasOwnProperty('type_object')) {
                        var accountCashTypeObjectKeys = Object.keys(item.account_cash_object.type_object);

                        accountCashTypeObjectKeys.forEach(function (accountTypeObjectKeyItem) {
                            item['account_cash_type_object_' + accountTypeObjectKeyItem] = item.account_cash_object.type_object[accountTypeObjectKeyItem];
                        })
                    }

                }

                if (item.hasOwnProperty('account_interim_object') && item.account_interim_object) {

                    var accountInterimObjectKeys = Object.keys(item.account_interim_object);

                    accountInterimObjectKeys.forEach(function (accountObjectKeyItem) {
                        item['account_interim_object_' + accountObjectKeyItem] = item.account_interim_object[accountObjectKeyItem];
                    });

                    if (item.account_interim_object.hasOwnProperty('type_object')) {
                        var accountInterimTypeObjectKeys = Object.keys(item.account_interim_object.type_object);

                        accountInterimTypeObjectKeys.forEach(function (accountTypeObjectKeyItem) {
                            item['account_interim_type_object_' + accountTypeObjectKeyItem] = item.account_interim_object.type_object[accountTypeObjectKeyItem];
                        })
                    }

                }

                if (item.hasOwnProperty('portfolio_object') && item.portfolio_object) {

                    var portfolioObjectKeys = Object.keys(item.portfolio_object);

                    portfolioObjectKeys.forEach(function (portfolioObjectKeyItem) {
                        item['portfolio_object_' + portfolioObjectKeyItem] = item.portfolio_object[portfolioObjectKeyItem];
                    });

                }

                if (item.hasOwnProperty('transaction_currency_object') && item.transaction_currency_object) {

                    var transactionCurrencyObjectKeys = Object.keys(item.transaction_currency_object);

                    transactionCurrencyObjectKeys.forEach(function (transactionCurrencyObjectKeyItem) {
                        item['transaction_currency_object_' + transactionCurrencyObjectKeyItem] = item.transaction_currency_object[transactionCurrencyObjectKeyItem];
                    });

                }

                if (item.hasOwnProperty('settlement_currency_object') && item.settlement_currency_object) {

                    var settlementCurrencyObjectKeys = Object.keys(item.settlement_currency_object);

                    settlementCurrencyObjectKeys.forEach(function (settlementCurrencyObjectKeyItem) {
                        item['settlement_currency_object_' + settlementCurrencyObjectKeyItem] = item.settlement_currency_object[settlementCurrencyObjectKeyItem];
                    });

                }

                if (item.hasOwnProperty('strategy1_object') && item.strategy1_object) {

                    var strategy1ObjectKeys = Object.keys(item.strategy1_object);

                    strategy1ObjectKeys.forEach(function (strategy1ObjectKeyItem) {
                        item['strategy1_object_' + strategy1ObjectKeyItem] = item.strategy1_object[strategy1ObjectKeyItem];
                    });

                    if (item.strategy1_object.hasOwnProperty('subgroup_object')) {
                        var strategy1subgroupObjectKeys = Object.keys(item.strategy1_object.subgroup_object);

                        strategy1subgroupObjectKeys.forEach(function (strategy1subgroupObjectKeyItem) {
                            item['strategy1_subgroup_object_' + strategy1subgroupObjectKeyItem] = item.strategy1_object.subgroup_object[strategy1subgroupObjectKeyItem];
                        });

                        if (item.strategy1_object.subgroup_object.hasOwnProperty('group_object')) {
                            var strategy1groupObjectKeys = Object.keys(item.strategy1_object.subgroup_object.group_object);

                            strategy1groupObjectKeys.forEach(function (strategy1groupObjectKeyItem) {
                                item['strategy1_group_object_' + strategy1groupObjectKeyItem] = item.strategy1_object.subgroup_object.group_object[strategy1groupObjectKeyItem];
                            })
                        }

                    }

                }

                if (item.hasOwnProperty('strategy1_cash_object') && item.strategy1_cash_object) {

                    var strategy1cashObjectKeys = Object.keys(item.strategy1_cash_object);

                    strategy1cashObjectKeys.forEach(function (strategy1ObjectKeyItem) {
                        item['strategy1_cash_object_' + strategy1ObjectKeyItem] = item.strategy1_cash_object[strategy1ObjectKeyItem];
                    });

                }

                if (item.hasOwnProperty('strategy1_position_object') && item.strategy1_position_object) {

                    var strategy1positionObjectKeys = Object.keys(item.strategy1_position_object);

                    strategy1positionObjectKeys.forEach(function (strategy1ObjectKeyItem) {
                        item['strategy1_position_object_' + strategy1ObjectKeyItem] = item.strategy1_position_object[strategy1ObjectKeyItem];
                    });

                }

                if (item.hasOwnProperty('strategy2_object') && item.strategy2_object) {

                    var strategy2ObjectKeys = Object.keys(item.strategy2_object);

                    strategy2ObjectKeys.forEach(function (strategy2ObjectKeyItem) {
                        item['strategy2_object_' + strategy2ObjectKeyItem] = item.strategy2_object[strategy2ObjectKeyItem];
                    });

                    if (item.strategy2_object.hasOwnProperty('subgroup_object')) {
                        var strategy2subgroupObjectKeys = Object.keys(item.strategy2_object.subgroup_object);

                        strategy2subgroupObjectKeys.forEach(function (strategy2subgroupObjectKeyItem) {
                            item['strategy2_subgroup_object_' + strategy2subgroupObjectKeyItem] = item.strategy2_object.subgroup_object[strategy2subgroupObjectKeyItem];
                        });

                        if (item.strategy2_object.subgroup_object.hasOwnProperty('group_object')) {
                            var strategy2groupObjectKeys = Object.keys(item.strategy2_object.subgroup_object.group_object);

                            strategy2groupObjectKeys.forEach(function (strategy2groupObjectKeyItem) {
                                item['strategy2_group_object_' + strategy2groupObjectKeyItem] = item.strategy2_object.subgroup_object.group_object[strategy2groupObjectKeyItem];
                            })
                        }
                    }

                }

                if (item.hasOwnProperty('strategy2_cash_object') && item.strategy2_cash_object) {

                    var strategy2cashObjectKeys = Object.keys(item.strategy2_cash_object);

                    strategy2cashObjectKeys.forEach(function (strategy2ObjectKeyItem) {
                        item['strategy2_cash_object_' + strategy2ObjectKeyItem] = item.strategy2_cash_object[strategy2ObjectKeyItem];
                    });

                }

                if (item.hasOwnProperty('strategy2_position_object') && item.strategy2_position_object) {

                    var strategy2positionObjectKeys = Object.keys(item.strategy2_position_object);

                    strategy2positionObjectKeys.forEach(function (strategy2ObjectKeyItem) {
                        item['strategy2_position_object_' + strategy2ObjectKeyItem] = item.strategy2_position_object[strategy2ObjectKeyItem];
                    });

                }

                if (item.hasOwnProperty('strategy3_object') && item.strategy3_object) {

                    var strategy3ObjectKeys = Object.keys(item.strategy3_object);

                    strategy3ObjectKeys.forEach(function (strategy3ObjectKeyItem) {
                        item['strategy3_object_' + strategy3ObjectKeyItem] = item.strategy3_object[strategy3ObjectKeyItem];
                    });

                    if (item.strategy3_object.hasOwnProperty('subgroup_object')) {
                        var strategy3subgroupObjectKeys = Object.keys(item.strategy3_object.subgroup_object);

                        strategy3subgroupObjectKeys.forEach(function (strategy3subgroupObjectKeyItem) {
                            item['strategy3_subgroup_object_' + strategy3subgroupObjectKeyItem] = item.strategy3_object.subgroup_object[strategy3subgroupObjectKeyItem];
                        });

                        if (item.strategy3_object.subgroup_object.hasOwnProperty('group_object')) {
                            var strategy3groupObjectKeys = Object.keys(item.strategy3_object.subgroup_object.group_object);

                            strategy3groupObjectKeys.forEach(function (strategy3groupObjectKeyItem) {
                                item['strategy3_group_object_' + strategy3groupObjectKeyItem] = item.strategy3_object.subgroup_object.group_object[strategy3groupObjectKeyItem];
                            })
                        }
                    }

                }

                if (item.hasOwnProperty('strategy3_cash_object') && item.strategy3_cash_object) {

                    var strategy3cashObjectKeys = Object.keys(item.strategy3_cash_object);

                    strategy3cashObjectKeys.forEach(function (strategy3ObjectKeyItem) {
                        item['strategy3_cash_object_' + strategy3ObjectKeyItem] = item.strategy3_cash_object[strategy3ObjectKeyItem];
                    });

                }

                if (item.hasOwnProperty('strategy3_position_object') && item.strategy3_cash_object) {

                    var strategy3positionObjectKeys = Object.keys(item.strategy3_position_object);

                    strategy3positionObjectKeys.forEach(function (strategy3ObjectKeyItem) {
                        item['strategy3_position_object_' + strategy3ObjectKeyItem] = item.strategy3_position_object[strategy3ObjectKeyItem];
                    });

                }

                // custom fields

                if (item.hasOwnProperty('custom_fields')) {
                    item.custom_fields.forEach(function (customField) {
                        item[customField.custom_field_object.name] = customField.value;
                    })
                }

                // extract dynamic attributes

                if (item.hasOwnProperty('instrument_object') && item.instrument_object) {

                    if (item.instrument_object.hasOwnProperty('attributes')) {
                        if (item.instrument_object.attributes.length) {

                            item.instrument_object.attributes.forEach(function (attribute) {

                                if (attribute.hasOwnProperty('attribute_type_object')) {

                                    if (attribute.attribute_type_object.value_type == 10) {
                                        item['Instrument.' + attribute.attribute_type_object.display_name] = attribute.value_string;
                                    }
                                    if (attribute.attribute_type_object.value_type == 20) {
                                        item['Instrument.' + attribute.attribute_type_object.display_name] = attribute.value_float;
                                    }
                                    if (attribute.attribute_type_object.value_type == 40) {
                                        item['Instrument.' + attribute.attribute_type_object.display_name] = attribute.value_date;
                                    }
                                    if (attribute.attribute_type_object.value_type == 30) {
                                        if (attribute.classifier_object) {
                                            item['Instrument.' + attribute.attribute_type_object.display_name] = attribute.classifier_object.name;
                                        }
                                    }
                                }

                            })

                        }
                    }

                }

                if (item.hasOwnProperty('account_object') && item.account_object) {

                    if (item.account_object.hasOwnProperty('attributes')) {

                        if (item.account_object.attributes.length) {

                            item.account_object.attributes.forEach(function (attribute) {

                                if (attribute.hasOwnProperty('attribute_type_object')) {

                                    if (attribute.attribute_type_object.value_type == 10) {
                                        item['Account.' + attribute.attribute_type_object.display_name] = attribute.value_string;
                                    }
                                    if (attribute.attribute_type_object.value_type == 20) {
                                        item['Account.' + attribute.attribute_type_object.display_name] = attribute.value_float;
                                    }
                                    if (attribute.attribute_type_object.value_type == 40) {
                                        item['Account.' + attribute.attribute_type_object.display_name] = attribute.value_date;
                                    }
                                    if (attribute.attribute_type_object.value_type == 30) {
                                        if (attribute.classifier_object) {
                                            item['Account.' + attribute.attribute_type_object.display_name] = attribute.classifier_object.name;
                                        }
                                    }
                                }

                            })

                        }
                    }

                }

                if (item.hasOwnProperty('account_position_object') && item.account_position_object) {

                    if (item.account_position_object.hasOwnProperty('attributes')) {

                        if (item.account_position_object.attributes.length) {

                            item.account_position_object.attributes.forEach(function (attribute) {

                                if (attribute.hasOwnProperty('attribute_type_object')) {

                                    if (attribute.attribute_type_object.value_type == 10) {
                                        item['Account Position.' + attribute.attribute_type_object.display_name] = attribute.value_string;
                                    }
                                    if (attribute.attribute_type_object.value_type == 20) {
                                        item['Account Position.' + attribute.attribute_type_object.display_name] = attribute.value_float;
                                    }
                                    if (attribute.attribute_type_object.value_type == 40) {
                                        item['Account Position.' + attribute.attribute_type_object.display_name] = attribute.value_date;
                                    }
                                    if (attribute.attribute_type_object.value_type == 30) {
                                        if (attribute.classifier_object) {
                                            item['Account Position.' + attribute.attribute_type_object.display_name] = attribute.classifier_object.name;
                                        }
                                    }
                                }

                            })

                        }

                    }

                }

                if (item.hasOwnProperty('account_cash_object') && item.account_cash_object) {

                    if (item.account_cash_object.hasOwnProperty('attributes')) {

                        if (item.account_cash_object.attributes.length) {

                            item.account_cash_object.attributes.forEach(function (attribute) {

                                if (attribute.hasOwnProperty('attribute_type_object')) {

                                    if (attribute.attribute_type_object.value_type == 10) {
                                        item['Account Cash.' + attribute.attribute_type_object.display_name] = attribute.value_string;
                                    }
                                    if (attribute.attribute_type_object.value_type == 20) {
                                        item['Account Cash.' + attribute.attribute_type_object.display_name] = attribute.value_float;
                                    }
                                    if (attribute.attribute_type_object.value_type == 40) {
                                        item['Account Cash.' + attribute.attribute_type_object.display_name] = attribute.value_date;
                                    }
                                    if (attribute.attribute_type_object.value_type == 30) {
                                        if (attribute.classifier_object) {
                                            item['Account Cash.' + attribute.attribute_type_object.display_name] = attribute.classifier_object.name;
                                        }
                                    }
                                }

                            })

                        }

                    }

                }

                if (item.hasOwnProperty('account_interim_object') && item.account_interim_object) {

                    if (item.account_interim_object.hasOwnProperty('attributes')) {

                        if (item.account_interim_object.attributes.length) {

                            item.account_interim_object.attributes.forEach(function (attribute) {

                                if (attribute.hasOwnProperty('attribute_type_object')) {

                                    if (attribute.attribute_type_object.value_type == 10) {
                                        item['Account interim.' + attribute.attribute_type_object.display_name] = attribute.value_string;
                                    }
                                    if (attribute.attribute_type_object.value_type == 20) {
                                        item['Account interim.' + attribute.attribute_type_object.display_name] = attribute.value_float;
                                    }
                                    if (attribute.attribute_type_object.value_type == 40) {
                                        item['Account interim.' + attribute.attribute_type_object.display_name] = attribute.value_date;
                                    }
                                    if (attribute.attribute_type_object.value_type == 30) {
                                        if (attribute.classifier_object) {
                                            item['Account interim.' + attribute.attribute_type_object.display_name] = attribute.classifier_object.name;
                                        }
                                    }
                                }

                            })

                        }

                    }

                }

                if (item.hasOwnProperty('portfolio_object') && item.portfolio_object) {

                    if (item.portfolio_object.hasOwnProperty('attributes')) {

                        if (item.portfolio_object.attributes.length) {

                            item.portfolio_object.attributes.forEach(function (attribute) {

                                if (attribute.hasOwnProperty('attribute_type_object')) {

                                    if (attribute.attribute_type_object.value_type == 10) {
                                        item['Portfolio.' + attribute.attribute_type_object.display_name] = attribute.value_string;
                                    }
                                    if (attribute.attribute_type_object.value_type == 20) {
                                        item['Portfolio.' + attribute.attribute_type_object.display_name] = attribute.value_float;
                                    }
                                    if (attribute.attribute_type_object.value_type == 40) {
                                        item['Portfolio.' + attribute.attribute_type_object.display_name] = attribute.value_date;
                                    }
                                    if (attribute.attribute_type_object.value_type == 30) {

                                        if (attribute.classifier_object) {
                                            //if (item['Portfolio.' + attribute.attribute_type_object.display_name] = attribute.classifier_object) {
                                                item['Portfolio.' + attribute.attribute_type_object.display_name] = attribute.classifier_object.name;
                                            //}
                                        }
                                    }
                                }

                            })

                        }

                    }

                }

                item['instrument_accrual_object_accrual_size'] = undefined;
                item['instrument_accrual_object_periodicity_object_name'] = undefined;
                item['instrument_accrual_object_periodicity_n'] = undefined;
                if (item.instrument_accrual_object) {

                    item['instrument_accrual_object_accrual_size'] = item.instrument_accrual_object.accrual_size;

                    if (item.instrument_accrual_object.periodicity_object) {
                        item['instrument_accrual_object_periodicity_object_name'] = item.instrument_accrual_object.periodicity_object.name;
                    }
                    item['instrument_accrual_object_periodicity_n'] = item.instrument_accrual_object.periodicity_n;

                }

            });
        }

        return entity;

    };


    module.exports = {
        releaseEntityObjects: releaseEntityObjects
    }

}());