import instrumentDatabaseSearchRepository from '../../repositories/instrument/instrumentDatabaseSearchRepository';

var getList = function (name, options) {
    return instrumentDatabaseSearchRepository.getList(name, options);
};


export default {
    getList: getList
};