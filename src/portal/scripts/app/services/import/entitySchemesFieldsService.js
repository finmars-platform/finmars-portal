/**
 * Created by szhitenev on 20.03.2018.
 */
(function () {

    'use strict';

    var schemesFieldsRepository = require('../../repositories/import/entitySchemesFieldsRepository');

    var getSchemeFields = function (schemeId) {
        return schemesFieldsRepository.getSchemeFields(schemeId);
    };

    var create = function (fields) {
        return schemesFieldsRepository.create(fields);
    };

    var deleteById = function (id) {
        return schemesFieldsRepository.deleteById(id);
    };

    module.exports = {
        getSchemeFields: getSchemeFields,
        create: create,
        deleteById: deleteById
    }

} ());