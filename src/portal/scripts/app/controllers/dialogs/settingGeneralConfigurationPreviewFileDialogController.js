/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';


    var entityResolverService = require('../../services/entityResolverService');

    module.exports = function ($scope, $mdDialog, file) {

        console.log("file", file);

        var vm = this;

        vm.items = file.body;

        vm.resolveName = function (item) {

            switch (item.entity) {
                case 'transactions.transactiontype':
                    return "Transaction Types";
                default:
                    return "Unknown"
            }

        };

        vm.toggleActiveForChilds = function (item) {

            item.content.forEach(function (child) {
                child.active = item.active;
            })

        };

        vm.updateActiveForParent = function (parent) {

            var active = true;

            parent.content.forEach(function (item) {

                if (item.active === false) {
                    active = false;
                }

            });

            parent.active = active;


        };

        function handleTransactionType(item) {

            return new Promise(function (resolve, reject) {

                console.log('handle transaction type', item);

                // var obj = Object.assign({}, item.fields);
                //
                // obj.inputs = item.inputs.map(function (item) {
                //     return item.fields
                // });
                //
                // obj.actions = [];
                //
                // var order = item.actions_order.map(function (item) {
                //     return item.fields
                // });
                // var instruments = item.actions_instrument.map(function (item) {
                //     return item.fields
                // });
                // var transactions = item.actions_transaction.map(function (item) {
                //     return item.fields
                // });
                //
                // order.forEach(function (orderItem) {
                //
                //     var result;
                //
                //     instruments.forEach(function (actionInstrument) {
                //
                //         if (orderItem.action_notes === actionInstrument.action_notes) {
                //             result = actionInstrument
                //         }
                //
                //     });
                //
                //     transactions.forEach(function (actionTransaction) {
                //
                //         if (orderItem.action_notes === actionTransaction.action_notes) {
                //             result = actionTransaction
                //         }
                //
                //     });
                //
                //     if (result) {
                //
                //         var action = {
                //             action_notes: orderItem.action_notes,
                //             order: orderItem.order,
                //             instrument: null,
                //             transaction: null
                //         };
                //
                //         if (result.hasOwnProperty('transaction_class')) {
                //             action.transaction = result;
                //         } else {
                //             action.instrument = result;
                //         }
                //
                //         obj.actions[orderItem.order] = action;
                //
                //
                //     }
                //
                // });
                //
                // Object.keys(obj).forEach(function (key) {
                //
                //     if (obj[key] === null || obj[key] === undefined) {
                //         delete obj[key]
                //     }
                //
                // });
                //
                // console.log('result obj', obj);

                resolve(entityResolverService.create('transaction-type', item))

            })

        }

        vm.agree = function () {

            var promises = [];

            vm.items.forEach(function (entityItem) {

                entityItem.content.forEach(function (item) {

                    if (item.active) {

                        switch (entityItem.entity) {

                            case 'transactions.transactiontype':
                                promises.push(handleTransactionType(item));
                                break;

                        }

                    }

                })

            });

            Promise.all(promises).then(function (data) {

                console.log("import success", data);

                $mdDialog.hide({status: 'agree', data: {}});

            })

        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

    }

}());