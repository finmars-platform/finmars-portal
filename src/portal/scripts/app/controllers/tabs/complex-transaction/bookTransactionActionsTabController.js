/**
 * Created by szhitenev on 27.09.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');

    var transactionTypeService = require('../../../services/transactionTypeService');

    module.exports = function ($scope) {
        logService.controller('BookTransactionActionsTabController', 'initialized');

        var vm = this;
        vm.entity = $scope.$parent.vm.entity;

        vm.transactionTypeId = $scope.$parent.vm.editLayoutEntityInstanceId;
        vm.readyStatus = {transactionType: false};

        transactionTypeService.getByKey(vm.transactionTypeId).then(function (data) {
            vm.transactionType = data;

            vm.transactionActions = {
                action_order: [],
                action_type: [],
                action_notes: [],

                transaction_class: [],
                portfolio: [],
                instrument: [],
                account_cash: [],
                account_interim: [],
                account_position: [],
                accounting_date: [],
                carry_amount: [],
                carry_with_sign: [],
                cash_consideration: [],
                cash_date: [],
                counterparty: [],
                factor: [],
                overheads: [],
                overheads_with_sign: [],
                position_size_with_sign: [],
                principal_amount: [],
                principal_with_sign: [],
                responsible: [],
                settlement_currency: [],
                strategy1_cash: [],
                strategy1_position: [],
                strategy2_cash: [],
                strategy2_position: [],
                strategy3_cash: [],
                strategy3_position: [],
                trade_price: [],
                transaction_currency: [],

                accrued_currency: [],
                accrued_multiplier: [],
                daily_pricing_model: [],
                default_accrued: [],
                default_price: [],
                instrument_type: [],
                maturity_date: [],
                name: [],
                notes: [],
                payment_size_detail: [],
                price_download_scheme: [],
                price_multiplier: [],
                pricing_currency: [],
                public_name: [],
                reference_for_pricing: [],
                short_name: [],
                user_code: [],
                user_text_1: [],
                user_text_2: [],
                user_text_3: []
            };

            console.log('vm.transactionType', vm.transactionType);

            vm.transactionType.actions.forEach(function (action, $index) {
                vm.transactionActions.action_order.push(action.order);
                vm.transactionActions.action_notes.push(action.action_notes);

                if (action.instrument !== null) {

                    vm.transactionActions.action_type.push('Instrument');

                    if (action.instrument.accrued_currency_object !== null) {
                        vm.transactionActions.accrued_currency.push(action.instrument.accrued_currency_object.name);
                    } else {
                        if (action.instrument.accrued_currency_input !== null) {
                            vm.transactionActions.accrued_currency.push(action.instrument.accrued_currency_input);
                        } else {
                            vm.transactionActions.accrued_currency.push('-');
                        }

                    }

                    vm.transactionActions.accrued_multiplier.push(action.instrument.accrued_multiplier);

                    if (action.instrument.daily_pricing_model_object !== null) {
                        vm.transactionActions.daily_pricing_model.push(action.instrument.daily_pricing_model_object.name);
                    } else {
                        if (action.instrument.daily_pricing_model_input !== null) {
                            vm.transactionActions.daily_pricing_model.push(action.instrument.daily_pricing_model_input);
                        } else {
                            vm.transactionActions.daily_pricing_model.push('-');
                        }
                    }

                    vm.transactionActions.default_accrued.push(action.instrument.default_accrued);
                    vm.transactionActions.default_price.push(action.instrument.default_price);

                    if (action.instrument.payment_size_detail_object !== null) {
                        vm.transactionActions.payment_size_detail.push(action.instrument.payment_size_detail_object.name);
                    } else {
                        if (action.instrument.payment_size_detail_input !== null) {
                            vm.transactionActions.payment_size_detail.push(action.instrument.payment_size_detail_input);
                        } else {
                            vm.transactionActions.payment_size_detail.push('-');
                        }
                    }

                    vm.transactionActions.maturity_date.push(action.instrument.maturity_date);
                    vm.transactionActions.name.push(action.instrument.name);
                    vm.transactionActions.notes.push(action.instrument.notes);

                    if (action.instrument.price_download_scheme_object !== null) {
                        vm.transactionActions.price_download_scheme.push(action.instrument.price_download_scheme_object.scheme_name);
                    } else {
                        if (action.instrument.price_download_scheme_input !== null) {
                            vm.transactionActions.price_download_scheme.push(action.instrument.price_download_scheme_input);
                        } else {
                            vm.transactionActions.price_download_scheme.push('-');
                        }
                    }

                    vm.transactionActions.price_multiplier.push(action.instrument.price_multiplier);

                    if (action.instrument.pricing_currency_object !== null) {
                        vm.transactionActions.pricing_currency.push(action.instrument.pricing_currency_object.name);
                    } else {
                        if (action.instrument.pricing_currency_input !== null) {
                            vm.transactionActions.pricing_currency.push(action.instrument.pricing_currency_input);
                        } else {
                            vm.transactionActions.pricing_currency.push('-');
                        }
                    }

                    vm.transactionActions.public_name.push(action.instrument.public_name);
                    vm.transactionActions.reference_for_pricing.push(action.instrument.reference_for_pricing);
                    vm.transactionActions.short_name.push(action.instrument.short_name);
                    vm.transactionActions.user_code.push(action.instrument.user_code);
                    vm.transactionActions.user_text_1.push(action.instrument.user_text_1);
                    vm.transactionActions.user_text_2.push(action.instrument.user_text_2);
                    vm.transactionActions.user_text_3.push(action.instrument.user_text_3);

                    // transaction fields

                    vm.transactionActions.transaction_class.push('-');
                    vm.transactionActions.portfolio.push('-');
                    vm.transactionActions.instrument.push('-');
                    vm.transactionActions.account_cash.push('-');
                    vm.transactionActions.account_interim.push('-');
                    vm.transactionActions.account_position.push('-');
                    vm.transactionActions.accounting_date.push('-');
                    vm.transactionActions.carry_amount.push('-');
                    vm.transactionActions.carry_with_sign.push('-');
                    vm.transactionActions.cash_consideration.push('-');
                    vm.transactionActions.cash_date.push('-');
                    vm.transactionActions.counterparty.push('-');
                    vm.transactionActions.factor.push('-');
                    vm.transactionActions.overheads.push('-');
                    vm.transactionActions.overheads_with_sign.push('-');
                    vm.transactionActions.position_size_with_sign.push('-');
                    vm.transactionActions.principal_amount.push('-');
                    vm.transactionActions.principal_with_sign.push('-');
                    vm.transactionActions.responsible.push('-');
                    vm.transactionActions.settlement_currency.push('-');

                    vm.transactionActions.strategy1_cash.push('-');
                    vm.transactionActions.strategy1_position.push('-');
                    vm.transactionActions.strategy2_cash.push('-');
                    vm.transactionActions.strategy2_position.push('-');
                    vm.transactionActions.strategy3_cash.push('-');
                    vm.transactionActions.strategy3_position.push('-');
                    vm.transactionActions.trade_price.push('-');
                    vm.transactionActions.transaction_currency.push('-');

                } else {

                    vm.transactionActions.action_type.push('Transaction');

                    if (action.transaction.transaction_class_object !== null) {
                        vm.transactionActions.transaction_class.push(action.transaction.transaction_class_object.name);
                    } else {
                        vm.transactionActions.transaction_class.push('-');
                    }

                    if (action.transaction.portfolio_object !== null) {
                        vm.transactionActions.portfolio.push(action.transaction.portfolio_object.name);
                    } else {
                        if (action.transaction.portfolio_input !== null) {
                            vm.transactionActions.portfolio.push(action.transaction.portfolio_input);
                        } else {
                            vm.transactionActions.portfolio.push('-');
                        }
                    }

                    if (action.transaction.instrument_phantom !== null) {
                        vm.transactionActions.instrument.push("Instrument Action #" + action.transaction.instrument_phantom);
                    } else {
                        if (action.transaction.instrument_object !== null) {
                            vm.transactionActions.instrument.push(action.transaction.instrument_object.name);
                        } else {
                            if (action.transaction.instrument_input !== null) {
                                vm.transactionActions.instrument.push(action.transaction.instrument_input);
                            } else {
                                vm.transactionActions.instrument.push('-');
                            }
                        }
                    }

                    if (action.transaction.account_cash_object !== null) {
                        vm.transactionActions.account_cash.push(action.transaction.account_cash_object.name);
                    } else {
                        if (action.transaction.account_cash_input !== null) {
                            vm.transactionActions.account_cash.push(action.transaction.account_cash_input);
                        } else {
                            vm.transactionActions.account_cash.push('-');
                        }
                    }

                    if (action.transaction.account_interim_object !== null) {
                        vm.transactionActions.account_interim.push(action.transaction.account_interim_object.name);
                    } else {
                        if (action.instrument.account_interim_input !== null) {
                            vm.transactionActions.account_interim.push(action.transaction.account_interim_input);
                        } else {
                            vm.transactionActions.account_interim.push('-');
                        }
                    }

                    if (action.transaction.account_position_object !== null) {
                        vm.transactionActions.account_position.push(action.transaction.account_position_object.name);
                    } else {
                        if (action.transaction.account_position_input !== null) {
                            vm.transactionActions.account_position.push(action.transaction.account_position_input);
                        } else {
                            vm.transactionActions.account_position.push('-');
                        }
                    }

                    vm.transactionActions.accounting_date.push(action.transaction.accounting_date);
                    vm.transactionActions.carry_amount.push(action.transaction.carry_amount);
                    vm.transactionActions.carry_with_sign.push(action.transaction.carry_with_sign);
                    vm.transactionActions.cash_consideration.push(action.transaction.cash_consideration);
                    vm.transactionActions.cash_date.push(action.transaction.cash_date);

                    if (action.transaction.counterparty_object !== null) {
                        vm.transactionActions.counterparty.push(action.transaction.counterparty_object.name);
                    } else {
                        if (action.transaction.counterparty_input !== null) {
                            vm.transactionActions.counterparty.push(action.transaction.counterparty_input);
                        } else {
                            vm.transactionActions.counterparty.push('-');
                        }
                    }

                    vm.transactionActions.factor.push(action.transaction.factor);
                    vm.transactionActions.overheads.push(action.transaction.overheads);
                    vm.transactionActions.overheads_with_sign.push(action.transaction.overheads_with_sign);
                    vm.transactionActions.position_size_with_sign.push(action.transaction.position_size_with_sign);
                    vm.transactionActions.principal_amount.push(action.transaction.principal_amount);
                    vm.transactionActions.principal_with_sign.push(action.transaction.principal_with_sign);

                    if (action.transaction.responsible_object !== null) {
                        vm.transactionActions.responsible.push(action.transaction.responsible_object.name);
                    } else {
                        if (action.transaction.responsible_input !== null) {
                            vm.transactionActions.responsible.push(action.transaction.responsible_input);
                        } else {
                            vm.transactionActions.responsible.push('-');
                        }
                    }

                    if (action.transaction.settlement_currency_object !== null) {
                        vm.transactionActions.settlement_currency.push(action.transaction.settlement_currency_object.name);
                    } else {
                        if (action.transaction.settlement_currency_input !== null) {
                            vm.transactionActions.settlement_currency.push(action.transaction.settlement_currency_input);
                        } else {
                            vm.transactionActions.settlement_currency.push('-');
                        }
                    }

                    if (action.transaction.strategy1_cash_object !== null) {
                        vm.transactionActions.strategy1_cash.push(action.transaction.strategy1_cash_object.name);
                    } else {
                        if (action.transaction.strategy1_cash_input !== null) {
                            vm.transactionActions.strategy1_cash.push(action.transaction.strategy1_cash_input);
                        } else {
                            vm.transactionActions.strategy1_cash.push('-');
                        }
                    }

                    if (action.transaction.strategy1_position_object !== null) {
                        vm.transactionActions.strategy1_position.push(action.transaction.strategy1_position_object.name);
                    } else {
                        if (action.transaction.strategy1_position_input !== null) {
                            vm.transactionActions.strategy1_position.push(action.transaction.strategy1_position_input);
                        } else {
                            vm.transactionActions.strategy1_position.push('-');
                        }
                    }

                    if (action.transaction.strategy2_cash_object !== null) {
                        vm.transactionActions.strategy2_cash.push(action.transaction.strategy2_cash_object.name);
                    } else {
                        if (action.transaction.strategy2_cash_input !== null) {
                            vm.transactionActions.strategy2_cash.push(action.transaction.strategy2_cash_input);
                        } else {
                            vm.transactionActions.strategy2_cash.push('-');
                        }
                    }

                    if (action.transaction.strategy2_position_object !== null) {
                        vm.transactionActions.strategy2_position.push(action.transaction.strategy2_position_object.name);
                    } else {
                        if (action.transaction.strategy2_position_input !== null) {
                            vm.transactionActions.strategy2_position.push(action.transaction.strategy2_position_input);
                        } else {
                            vm.transactionActions.strategy2_position.push('-');
                        }
                    }

                    if (action.transaction.strategy3_cash_object !== null) {
                        vm.transactionActions.strategy3_cash.push(action.transaction.strategy3_cash_object.name);
                    } else {
                        if (action.transaction.strategy3_cash_input !== null) {
                            vm.transactionActions.strategy3_cash.push(action.transaction.strategy3_cash_input);
                        } else {
                            vm.transactionActions.strategy3_cash.push('-');
                        }
                    }

                    if (action.transaction.strategy3_position_object !== null) {
                        vm.transactionActions.strategy3_position.push(action.transaction.strategy3_position_object.name);
                    } else {
                        if (action.transaction.strategy3_position_input !== null) {
                            vm.transactionActions.strategy3_position.push(action.transaction.strategy3_position_input);
                        } else {
                            vm.transactionActions.strategy3_position.push('-');
                        }
                    }

                    vm.transactionActions.trade_price.push(action.transaction.trade_price);

                    if (action.transaction.transaction_currency_object !== null) {
                        vm.transactionActions.transaction_currency.push(action.transaction.transaction_currency_object.name);
                    } else {
                        if (action.transaction.transaction_currency_input !== null) {
                            vm.transactionActions.transaction_currency.push(action.transaction.transaction_currency_input);
                        } else {
                            vm.transactionActions.transaction_currency.push('-');
                        }
                    }


                    // instrument fields

                    vm.transactionActions.accrued_currency.push('-');
                    vm.transactionActions.accrued_multiplier.push('-');
                    vm.transactionActions.daily_pricing_model.push('-');
                    vm.transactionActions.default_accrued.push('-');
                    vm.transactionActions.default_price.push('-');
                    vm.transactionActions.instrument_type.push('-');
                    vm.transactionActions.maturity_date.push('-');
                    vm.transactionActions.name.push('-');
                    vm.transactionActions.notes.push('-');
                    vm.transactionActions.payment_size_detail.push('-');
                    vm.transactionActions.price_download_scheme.push('-');
                    vm.transactionActions.price_multiplier.push('-');
                    vm.transactionActions.public_name.push('-');
                    vm.transactionActions.reference_for_pricing.push('-');
                    vm.transactionActions.short_name.push('-');
                    vm.transactionActions.user_code.push('-');
                    vm.transactionActions.user_text_1.push('-');
                    vm.transactionActions.user_text_2.push('-');
                    vm.transactionActions.user_text_3.push('-');
                    vm.transactionActions.pricing_currency.push('-');

                }
            });

            console.log('vm.transactionActions', vm.transactionActions);

            vm.readyStatus.transactionType = true;

            $scope.$apply();
        })

    }

}());