/**
 * Created by szhitenev on 22.12.2020.
 */
(function () {

    var specificDataRepository = require('../repositories/specificDataRepository');

    var getValuesForSelect = function (contentType, key, valueType) {
        return specificDataRepository.getValuesForSelect(contentType, key, valueType);
    };

    module.exports = {
        getValuesForSelect: getValuesForSelect,
    }


}());