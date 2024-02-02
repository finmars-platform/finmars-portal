/**
 * Created by szhitenev on 02.02.2024.
 */
(function ($mdDialog) {

    const portfolioTypeRepository = require('../repositories/portfolioTypeRepository');

	const getList = function (options) {
        return portfolioTypeRepository.getList(options);
    };

	const getListLight = function (options) {
        return portfolioTypeRepository.getListLight(options);
    };

	const getByKey = function (id) {
        return portfolioTypeRepository.getByKey(id);
    };

	const create = function(account) {
        return portfolioTypeRepository.create(account);
    };

	const update = function(id, account) {
        return portfolioTypeRepository.update(id, account);
    };

	const deleteByKey = function (id) {
        return portfolioTypeRepository.deleteByKey(id);
    };

	const updateBulk = function (data) {
        return portfolioTypeRepository.updateBulk(data)
    };

	const deleteBulk = function(data){
        return portfolioTypeRepository.deleteBulk(data)
    };

    module.exports = {
        getList: getList,
        getListLight: getListLight,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,

        updateBulk: updateBulk,
        deleteBulk: deleteBulk
    }


}());