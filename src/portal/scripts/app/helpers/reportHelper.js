/**
 * Created by szhitenev on 13.02.2017.
 */
(function () {

    'use strict';

    var releaseEntityObjects = function (entity) {

        //console.log('entity', entity);

        if (entity.length) {

            entity.forEach(function (item) {

                if (item.hasOwnProperty('instrument_object')) {

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

                if (item.hasOwnProperty('account_object')) {

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

                if (item.hasOwnProperty('portfolio_object')) {

                    var portfolioObjectKeys = Object.keys(item.portfolio_object);

                    portfolioObjectKeys.forEach(function (portfolioObjectKeyItem) {
                        item['portfolio_object_' + portfolioObjectKeyItem] = item.portfolio_object[portfolioObjectKeyItem];
                    });

                }

                if (item.hasOwnProperty('strategy1_object')) {

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

                if (item.hasOwnProperty('strategy2_object')) {

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

                if (item.hasOwnProperty('strategy3_object')) {

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

                // extract dynamic attributes

                if (item.hasOwnProperty('instrument_object')) {

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
                                    item['Instrument.' + attribute.attribute_type_object.display_name] = attribute.classifier_object.name;
                                }
                            }

                        })

                    }

                }

                if (item.hasOwnProperty('account_object')) {

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
                                    item['Account.' + attribute.attribute_type_object.display_name] = attribute.classifier_object.name;
                                }
                            }

                        })

                    }

                }

                if (item.hasOwnProperty('portfolio_object')) {

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

                                    if (item['Portfolio.' + attribute.attribute_type_object.display_name] = attribute.classifier_object) {
                                        item['Portfolio.' + attribute.attribute_type_object.display_name] = attribute.classifier_object.name;
                                    }
                                }
                            }

                        })

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