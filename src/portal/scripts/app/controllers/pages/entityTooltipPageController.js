/**
 * Created by szhitenev on 22.06.2020.
 */
(function () {

    var uiService = require('../../services/uiService');

    module.exports = function entityTooltipPage($scope, $mdDialog) {

        var vm = this;

        vm.readyStatus = {
            content: false
        };

        vm.tabs = [
            {
                name: "Instrument",
                content_type: 'instruments.instrument',
                items: []
            },
            {
                name: "Portfolio",
                content_type: 'portfoios.portfolio',
                items: []
            },
            {
                name: "Account",
                content_type: 'accounts.account',
                items: []
            },
            {
                name: "Responsible",
                content_type: 'counterparties.responible',
                items: []
            },
            {
                name: "Counterparty",
                content_type: 'counterparties.counterparty',
                items: []
            },
            {
                name: "Currency",
                content_type: 'currencies.currency',
                items: []
            },
            {
                name: "Strategy 1",
                content_type: 'strategies.strategy1',
                items: []
            },
            {
                name: "Strategy 2",
                content_type: 'strategies.strategy2',
                items: []
            },
            {
                name: "Strategy 3",
                content_type: 'strategies.strategy3',
                items: []
            },
            {
                name: "Account Type",
                content_type: 'accounts.accounttype',
                items: []
            },
            {
                name: "Instrument Type",
                content_type: 'instruments.instrumenttype',
                items: []
            },
            {
                name: "Transaction Type",
                content_type: 'transactions.transactiontype',
                items: []
            },
            {
                name: "Price",
                content_type: 'instruments.pricehistory',
                items: []
            },
            {
                name: "FX Rate",
                content_type: 'currency.currencyhistory',
                items: []
            }
        ];

        vm.getData = function () {

            vm.tabs = [
                {
                    name: "Instrument",
                    content_type: 'instruments.instrument',
                    items: []
                },
                {
                    name: "Portfolio",
                    content_type: 'portfoios.portfolio',
                    items: []
                },
                {
                    name: "Account",
                    content_type: 'accounts.account',
                    items: []
                },
                {
                    name: "Responsible",
                    content_type: 'counterparties.responible',
                    items: []
                },
                {
                    name: "Counterparty",
                    content_type: 'counterparties.counterparty',
                    items: []
                },
                {
                    name: "Currency",
                    content_type: 'currencies.currency',
                    items: []
                },
                {
                    name: "Strategy 1",
                    content_type: 'strategies.strategy1',
                    items: []
                },
                {
                    name: "Strategy 2",
                    content_type: 'strategies.strategy2',
                    items: []
                },
                {
                    name: "Strategy 3",
                    content_type: 'strategies.strategy3',
                    items: []
                },
                {
                    name: "Account Type",
                    content_type: 'accounts.accounttype',
                    items: []
                },
                {
                    name: "Instrument Type",
                    content_type: 'instruments.instrumenttype',
                    items: []
                },
                {
                    name: "Transaction Type",
                    content_type: 'transactions.transactiontype',
                    items: []
                },
                {
                    name: "Price",
                    content_type: 'instruments.pricehistory',
                    items: []
                },
                {
                    name: "FX Rate",
                    content_type: 'currency.currencyhistory',
                    items: []
                }
            ];

            vm.readyStatus.content = false;

            uiService.getEntityTooltipList({pageSize: 1000}).then(function (data) {

                vm.readyStatus.content = true;

                data.results.forEach(function (item) {

                    vm.tabs.forEach(function (tab) {

                        if (tab.content_type === item.content_type) {

                            tab.items.push(item);

                        }

                    })

                });

                console.log('vm.tabs', vm.tabs);

                $scope.$apply();

            });

        };

        vm.saveTooltips = function () {

            var promises = [];
            
            console.log("Save tooltip", vm.tabs);

            vm.tabs.forEach(function (tab) {

                tab.items.forEach(function (item) {

                    if (item.changed) {

                        promises.push(new Promise(function (resolve, reject) {

                            uiService.updateEntityTooltip(item.id, item).then(function (data) {
                                resolve(data)
                            })

                        }))

                    }

                })

            });

            Promise.all(promises).then(function (data) {

                vm.getData();

                $mdDialog.show({
                    controller: 'SuccessDialogController as vm',
                    templateUrl: 'views/dialogs/success-dialog-view.html',
                    locals: {
                        success: {
                            title: 'Success',
                            description: 'Changes have been saved'
                        }
                    },
                    autoWrap: true,
                    skipHide: true
                });

            }).catch(function (error) {

                $mdDialog({
                    controller: 'WarningDialogController as vm',
                    templateUrl: 'views/warning-dialog-view.html',
                    clickOutsideToClose: false,
                    locals: {
                        warning: {
                            title: 'Error',
                            description: 'Error occured while trying to save tooltips'
                        }
                    }
                });

            });

        };

        vm.init = function () {

            vm.getData();

        };

        vm.init();
    }

}());