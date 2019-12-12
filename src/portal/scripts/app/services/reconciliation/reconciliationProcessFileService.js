/**
 * Created by szhitenev on 10.12.2019.
 */
(function(){

    var reconciliationProcessFileRepository = require('../../repositories/reconciliation/reconciliationProcessFileRepository');

    var process = function (config) {
        return reconciliationProcessFileRepository.process(config);
    };

    module.exports = {
        process: process

    }

}());