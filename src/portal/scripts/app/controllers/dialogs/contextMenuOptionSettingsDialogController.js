/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';



    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.item = {};
        vm.transactionTypes = [];


        if (data.item) {
            vm.item = data.item
        }

        if (data.transactionTypes) {
            vm.transactionTypes = data.transactionTypes;
        }

        vm.actions = [
            {
                name: 'Edit Instrument',
                action: 'edit_instrument'
            },
            {
                name: 'Edit Account',
                action: 'edit_account'
            },
            {
                name: 'Edit Portfolio',
                action: 'edit_portfolio'
            },
            {
                name: 'Edit Price',
                action: 'edit_price'
            },
            {
                name: 'Edit FX Rate',
                action: 'edit_fx_rate'
            },
            {
                name: 'Edit Pricing FX Rate',
                action: 'edit_pricing_currency'
            },
            {
                name: 'Edit Accrued FX Rate',
                action: 'edit_accrued_currency'
            },
            {
                name: 'Edit Currency',
                action: 'edit_currency'
            },
            {
                name: 'Open Book Manager',
                action: 'book_transaction'
            },
            {
                name: 'Book Specific Transaction Type',
                action: 'book_transaction_specific'
            }
        ];



        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            $mdDialog.hide({
                status: 'agree',
                data: {
                    item: vm.item
                }
            });

        };

        vm.init = function () {

        };

        vm.init();

    }

}());