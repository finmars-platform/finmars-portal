/**
 * Created by szhitenev on 20.03.2018.
 */
(function () {

    'use strict';

    var schemesFieldsRepository = require('../../repositories/import/entitySchemesFieldsRepository');

    var getSchemeFields = function (schemeId) {
        return schemesFieldsRepository.getSchemeFields(schemeId);
    };

    var deleteField = function (id) {
        return schemesFieldsRepository.deleteField(id);
    };

    module.exports = {
        getSchemeFields: getSchemeFields,
        deleteField: deleteField
    }

} ());