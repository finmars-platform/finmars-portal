/**
 * Created by szhitenev on 25.08.2016.
 */
(function () {

    'use strict';

    var pricingProcedureRepository = require('../../repositories/procedures/pricingProcedureRepository');

    var portfolioService = require('../portfolioService').default;
    var instrumentTypeService = require('../instrumentTypeService').default;
    var pricingPolicyService = require('../pricingPolicyService').default;;

    var instrumentPricingSchemeService = require('../pricing/instrumentPricingSchemeService');
    var currencyPricingSchemeService = require('../pricing/currencyPricingSchemeService');

    var getList = function (options) {
        return pricingProcedureRepository.getList(options);
    };

    var getByKey = function (id) {
        return pricingProcedureRepository.getByKey(id);
    };

    var create = function (account) {
        return pricingProcedureRepository.create(account);
    };

    var update = function (id, account) {
        return pricingProcedureRepository.update(id, account);
    };

    var deleteByKey = function (id) {
        return pricingProcedureRepository.deleteByKey(id);
    };

    var runProcedure = function (id, data) {
        return pricingProcedureRepository.runProcedure(id, data);
    };

    var loadRelatedData = function () {

        var promisesList = [
            instrumentTypeService.getList({ pageSize: 1000 }),
            pricingPolicyService.getList({ pageSize: 1000 }),
            portfolioService.getList({ pageSize: 1000 }),

            instrumentPricingSchemeService.getList({ pageSize: 1000 }),
            currencyPricingSchemeService.getList({ pageSize: 1000 }),
        ];

        var mapOpts = function (promiseRes) {
            return promiseRes.results.map(function (item) {
                return {
                    id: item.user_code,
                    name: item.user_code
                }
            })
        };

        return new Promise(function (resolve, reject) {

            Promise.all(promisesList).then(function (data) {

                resolve({
                    instrumentTypes: mapOpts(data[0]),
                    pricingPolicies: mapOpts(data[1]),
                    portfolios: mapOpts(data[2]),

                    instrumentPricingSchemes: mapOpts(data[3]),
                    currencyPricingSchemes: mapOpts(data[4]),
                })

            }).catch(function (e) { reject(e) });

        });


    }

    module.exports = {

        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,

        loadRelatedData: loadRelatedData,
        runProcedure: runProcedure,
    }

}());