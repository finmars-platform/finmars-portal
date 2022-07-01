/**
 * Created by szhitenev on 27.06.2022.
 */
(function () {

    var supersetRepository = require('../repositories/supersetRepository');


    var getSecurityToken = function(id) {
        return supersetRepository.getSecurityToken(id);
    };


    module.exports = {

        getSecurityToken: getSecurityToken

    }

}());