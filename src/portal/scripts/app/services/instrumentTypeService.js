/**
 * Created by szhitenev on 04.05.2016.
 */
(function ($mdDialog) {

    const instrumentTypeRepository = require('../repositories/instrumentTypeRepository');

	const getList = function (options) {
        return instrumentTypeRepository.getList(options);
    };

	const getListLight = function (options) {
        return instrumentTypeRepository.getListLight(options);
    };

	const getByKey = function (id) {
        return instrumentTypeRepository.getByKey(id);
    };

	const create = function(account) {
        return instrumentTypeRepository.create(account);
    };

	const update = function(id, account) {
        return instrumentTypeRepository.update(id, account);
    };

	const deleteByKey = function (id) {
        return instrumentTypeRepository.deleteByKey(id);
    };

	const updateBulk = function (data) {
        return instrumentTypeRepository.updateBulk(data)
    };

	const deleteBulk = function(data){
        return instrumentTypeRepository.deleteBulk(data)
    };

	const updatePricing = function(id, data) {
        return instrumentTypeRepository.updatePricing(id, data)
    };

    module.exports = {
        getList: getList,
        getListLight: getListLight,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,

        updateBulk: updateBulk,
        deleteBulk: deleteBulk,

        updatePricing: updatePricing

    }


}());