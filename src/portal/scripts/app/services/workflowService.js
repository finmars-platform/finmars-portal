import workflowRepository from '../repositories/workflowRepository';

var getList = function (options) {
    return workflowRepository.getList(options);
};

var getByKey = function (id) {
    return workflowRepository.getByKey(id);
};

var executeCode = function (data) {
    return workflowRepository.executeCode(data);
}


export default {
    getList: getList,
    getByKey: getByKey,
    executeCode: executeCode
};