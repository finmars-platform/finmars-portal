import supersetRepository from '../repositories/supersetRepository';


var getSecurityToken = function(id) {
    return supersetRepository.getSecurityToken(id);
};


export default {

    getSecurityToken: getSecurityToken

};