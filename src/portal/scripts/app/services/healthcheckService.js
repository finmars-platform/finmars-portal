import healthcheckRepository from '../repositories/healthcheckRepository';

var getData = function () {
    return healthcheckRepository.getData();
};


export default {
    getData: getData
};