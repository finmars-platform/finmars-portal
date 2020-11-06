/**
 * Created by szhitenev on 06.11.2020.
 */
(function () {

    var pricesCheckerRepository = require('../../repositories/reports/pricesCheckerRepository');

    var check = function (data) {
        return pricesCheckerRepository.check(data);
    };

    module.exports = {
        check: check
    }


}());