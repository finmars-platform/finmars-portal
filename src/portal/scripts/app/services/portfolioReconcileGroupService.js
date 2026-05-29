import portfolioReconcileGroupRepository from '../repositories/portfolioReconcileGroupRepository';

const getList = function (options) {
    return portfolioReconcileGroupRepository.getList(options);
};

const getListLight = function (options) {
    return portfolioReconcileGroupRepository.getListLight(options);
};

const getByKey = function (id) {
    return portfolioReconcileGroupRepository.getByKey(id);
};

const create = function (account) {
    return portfolioReconcileGroupRepository.create(account);
};

const update = function (id, account) {
    return portfolioReconcileGroupRepository.update(id, account);
};

const deleteByKey = function (id) {
    return portfolioReconcileGroupRepository.deleteByKey(id);
};

const updateBulk = function (data) {
    return portfolioReconcileGroupRepository.updateBulk(data)
};

const deleteBulk = function (data) {
    return portfolioReconcileGroupRepository.deleteBulk(data)
};

export default {
    getList: getList,
    getListLight: getListLight,
    getByKey: getByKey,
    create: create,
    update: update,
    deleteByKey: deleteByKey,

    updateBulk: updateBulk,
    deleteBulk: deleteBulk
};