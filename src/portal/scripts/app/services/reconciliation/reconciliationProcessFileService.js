import reconciliationProcessFileRepository from '../../repositories/reconciliation/reconciliationProcessFileRepository';

var process = function (config) {
    return reconciliationProcessFileRepository.process(config);
};

export default {
    process: process

};