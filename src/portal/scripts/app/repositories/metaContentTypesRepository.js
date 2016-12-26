/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    "use strict";

    var getListForTransactionTypeInputs = function () {
        return [
            {
                name: "Account",
                entity: 'account',
                key: "accounts.account"
            },
            {
                name: "Counterparty",
                entity: 'counterparty',
                key: "counterparties.counterparty"
            },
            {
                name: "Responsible",
                entity: 'responsible',
                key: "counterparties.responsible"
            },
            {
                name: "Currency",
                entity: 'currency',
                key: "currencies.currency"
            },
            {
                name: "Instrument",
                entity: 'instrument',
                key: "instruments.instrument"
            },
            {
                name: "Portfolio",
                entity: 'portfolio',
                key: "portfolios.portfolio"
            },
            {
                name: "Instrument Type",
                entity: 'instrument-type',
                key: "instruments.instrumenttype"
            },
            {
                name: "Strategy 1",
                entity: 'strategy-1',
                key: "strategies.strategy1"
            },
            {
                name: "Strategy 2",
                entity: 'strategy-2',
                key: "strategies.strategy2"
            },
            {
                name: "Strategy 3",
                entity: 'strategy-3',
                key: "strategies.strategy3"
            },
            {
                name: 'Daily pricing model',
                entity: 'daily-pricing-model',
                key: 'instruments.dailypricingmodel'
            },
            {
                name: 'Payment size detail',
                entity: 'payment-size-detail',
                key: 'instruments.paymentsizedetail'
            },
            {
                name: 'Price download scheme',
                entity: 'price-download-scheme',
                key: 'integrations.pricedownloadscheme'
            }
        ]
    };

    var getListForTags = function () {

        return [
            {
                name: "Account Type",
                entity: 'type',
                key: "accounts.accounttype"
            },
            {
                name: "Account",
                entity: 'account',
                key: "accounts.account"
            },
            {
                name: "Counterparty",
                entity: 'counterparty',
                key: "counterparties.counterparty"
            },
            {
                name: "Responsible",
                entity: 'responsible',
                key: "counterparties.responsible"
            },
            {
                name: "Currency",
                entity: 'currency',
                key: "currencies.currency"
            },
            {
                name: "Instrument",
                entity: 'instrument',
                key: "instruments.instrument"
            },
            {
                name: "Portfolio",
                entity: 'portfolio',
                key: "portfolios.portfolio"
            },
            {
                name: "Thread",
                entity: 'thread',
                key: "chats.thread"
            },
            {
                name: "Instrument Type",
                entity: 'instrument-type',
                key: "instruments.instrumenttype"
            },
            //{
            //    name: "Instrument Type",
            //    entity: 'instrument-types',
            //    key: "instruments.instrumenttype"
            //},
            {
                name: "Transaction Type",
                entity: 'transaction-type',
                key: "transactions.transactiontype"
            },
            {
                name: "Transaction Type Group",
                entity: 'transaction-type-group',
                key: "transactions.transactiontypegroup"
            },
            {
                name: "Strategy 1",
                entity: 'strategy-1',
                key: "strategies.strategy1"
            },
            {
                name: "Strategy 2",
                entity: 'strategy-2',
                key: "strategies.strategy2"
            },
            {
                name: "Strategy 3",
                entity: 'strategy-3',
                key: "strategies.strategy3"
            },
            {
                name: "Thread group",
                entity: 'thread-group',
                key: "chats.threadgroup"
            },
            {
                name: "Counterparty group",
                entity: 'counterparty-group',
                key: "counterparties.counterpartygroup"
            },
            {
                name: "Responsible group",
                entity: 'responsible-group',
                key: "counterparties.responsiblegroup"
            },
            {
                name: "Strategy 1 group",
                entity: 'strategy-1-group',
                key: "strategies.strategy1group"
            },
            {
                name: "Strategy 2 group",
                entity: 'strategy-2-group',
                key: "strategies.strategy2group"
            },
            {
                name: "Strategy 3 group",
                entity: 'strategy-3-group',
                key: "strategies.strategy3group"
            },
            {
                name: "Strategy 1 subgroup",
                entity: 'strategy-1-subgroup',
                key: "strategies.strategy1subgroup"
            },
            {
                name: "Strategy 2 subgroup",
                entity: 'strategy-2-subgroup',
                key: "strategies.strategy2subgroup"
            },
            {
                name: "Strategy 3 subgroup",
                entity: 'strategy-3-subgroup',
                key: "strategies.strategy3subgroup"
            }
        ]

    };

    var getListForUi = function () {
        return [
            {
                name: "Account Type",
                entity: 'account-type',
                key: "accounts.accounttype"
            },
            {
                name: "Account",
                entity: 'account',
                key: "accounts.account"
            },
            {
                name: "Counterparty",
                entity: 'counterparty',
                key: "counterparties.counterparty"
            },
            {
                name: "Responsible",
                entity: 'responsible',
                key: "counterparties.responsible"
            },
            {
                name: "Currency",
                entity: 'currency',
                key: "currencies.currency"
            },
            {
                name: "Currency history",
                entity: 'currency-history',
                key: "currencies.currencyhistory"
            },
            {
                name: "Instrument",
                entity: 'instrument',
                key: "instruments.instrument"
            },
            {
                name: 'Pricing Policy',
                entity: 'pricing-policy',
                key: 'instruments.pricingpolicy'
            },
            {
                name: 'Price History',
                entity: 'price-history',
                key: 'instruments.pricehistory'
            },
            {
                name: "Portfolio",
                entity: 'portfolio',
                key: "portfolios.portfolio"
            },
            {
                name: "Instrument Type",
                entity: 'instrument-type',
                key: "instruments.instrumenttype"
            },
            {
                name: "Transaction",
                entity: 'transaction',
                key: "transactions.transaction"
            },
            {
                name: "Transaction Type",
                entity: 'transaction-type',
                key: "transactions.transactiontype"
            },
            {
                name: "Transaction Type Group",
                entity: 'transaction-type-group',
                key: "transactions.transactiontypegroup"
            },
            {
                name: "Counterparty group",
                entity: 'counterparty-group',
                key: "counterparties.counterpartygroup"
            },
            {
                name: "Responsible group",
                entity: 'responsible-group',
                key: "counterparties.responsiblegroup"
            },
            {
                name: "Strategy 1",
                entity: 'strategy-1',
                key: "strategies.strategy1"
            },
            {
                name: "Strategy 2",
                entity: 'strategy-2',
                key: "strategies.strategy2"
            },
            {
                name: "Strategy 3",
                entity: 'strategy-3',
                key: "strategies.strategy3"
            },
            {
                name: "Strategy 1 group",
                entity: 'strategy-1-group',
                key: "strategies.strategy1group"
            },
            {
                name: "Strategy 2 group",
                entity: 'strategy-2-group',
                key: "strategies.strategy2group"
            },
            {
                name: "Strategy 3 group",
                entity: 'strategy-3-group',
                key: "strategies.strategy3group"
            },
            {
                name: "Strategy 1 subgroup",
                entity: 'strategy-1-subgroup',
                key: "strategies.strategy1subgroup"
            },
            {
                name: "Strategy 2 subgroup",
                entity: 'strategy-2-subgroup',
                key: "strategies.strategy1subgroup"
            },
            {
                name: "Strategy 3 subgroup",
                entity: 'strategy-3-subgroup',
                key: "strategies.strategy1subgroup"
            },
            {
                name: "Tag",
                entity: 'tag',
                key: "tags.tag"
            },
            {
                name: "Balance report",
                entity: 'balance-report',
                key: "reports.balancereport"
            },
            {
                name: "P&L report",
                entity: 'pnl-report',
                key: "reports.plreport"
            },
            {
                name: "Transaction report",
                entity: 'transaction-report',
                key: "reports.transactionreport"
            },
            {
                name: "Cash flow projection report",
                entity: 'cash-flow-projection-report',
                key: "reports.cashflowreport"
            },
            {
                name: "Performance report",
                entity: 'performance-report',
                key: "reports.performancereport"
            },
            {
                name: "Transaction",
                entity: 'complex-transaction',
                key: "transactions.complextransaction"
            }
        ]
    };

    module.exports = {
        getListForTags: getListForTags,
        getListForUi: getListForUi,
        getListForTransactionTypeInputs: getListForTransactionTypeInputs
    }


}());