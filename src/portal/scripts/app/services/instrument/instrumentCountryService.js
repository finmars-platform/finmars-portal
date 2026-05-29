import instrumentCountryRepository from '../../repositories/instrument/instrumentCountryRepository';

var getList = function (options) {
    return instrumentCountryRepository.getList(options);
};

var getByKey = function (id) {
    return instrumentCountryRepository.getByKey(id);
};

export default {
    getList: getList,
    getByKey: getByKey
};