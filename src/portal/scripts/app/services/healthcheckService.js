/**
 * Created by szhitenev on 28.07.2020.
 */
(function () {

    var healthcheckRepository = require('../repositories/healthcheckRepository');

    var getData = function () {
        return healthcheckRepository.getData();
    };


    module.exports = {
        getData: getData
    }


}());