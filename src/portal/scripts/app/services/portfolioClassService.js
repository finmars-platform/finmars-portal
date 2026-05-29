import portfolioClassRepository from '../repositories/portfolioClassRepository';

var getList = function (options) {
    return portfolioClassRepository.getList(options);
};

var getByKey = function (id) {
    return portfolioClassRepository.getByKey(id);
};

var create = function(account) {
    return portfolioClassRepository.create(account);
};

var update = function(id, account) {
    return portfolioClassRepository.update(id, account);
};

var deleteByKey = function (id) {
    return portfolioClassRepository.deleteByKey(id);
};


export default {
    getList: getList,
    getByKey: getByKey,
    create: create,
    update: update,
    deleteByKey: deleteByKey
};