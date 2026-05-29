import portfolioBundleRepository from '../repositories/portfolioBundleRepository';


var getList = function (options) {
    return portfolioBundleRepository.getList(options);
};

var getByKey = function (id) {
    return portfolioBundleRepository.getByKey(id);
};

var create = function (portfolio) {
    return portfolioBundleRepository.create(portfolio);
};

var update = function (id, portfolio) {
    return portfolioBundleRepository.update(id, portfolio);
};

var deleteByKey = function (id) {
    return portfolioBundleRepository.deleteByKey(id);
};


export default {
    getList: getList,
    getByKey: getByKey,
    create: create,
    update: update,
    deleteByKey: deleteByKey
};