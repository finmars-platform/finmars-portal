/**
 * Created by szhitenev on 22.08.2018.
 */
(function () {

    'use strict';

    var getRelatedAttributesList = function () {
        return [
            {
                key: 'portfolios',
                attributeName: 'Portfolios',
                name: 'portfolio'
            },
            {
                key: 'accounts',
                attributeName: 'Accounts',
                name: 'account'
            },
            {
                key: 'counterparties',
                attributeName: 'Counterparties',
                name: 'counterparty'
            },
            {
                key: 'responsibles',
                attributeName: 'Responsibles',
                name: 'responsible'
            }
        ]
    };

    module.exports = {
        getRelatedAttributesList: getRelatedAttributesList
    }

}());