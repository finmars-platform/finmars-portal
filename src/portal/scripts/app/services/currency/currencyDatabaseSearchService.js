import currencyDatabaseSearchRepository from '../../repositories/currency/currencyDatabaseSearchRepository';

var getList = function (name, page) {
    return currencyDatabaseSearchRepository.getList(name, page);
};


export default {
    getList: getList
};