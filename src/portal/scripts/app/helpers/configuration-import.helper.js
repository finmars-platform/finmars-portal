/**
 * Created by szhitenev on 12.09.2016.
 */
(function () {

    'use strict';

    var entityResolverService = require('../services/entityResolverService');
    var attributeTypeService = require('../services/attributeTypeService');

    var getEntityByUserCode = function (user_code, entity) {

        return new Promise(function (resolve, reject) {

            entityResolverService.getList(entity, {
                filters: {
                    "user_code": user_code
                }
            }).then(function (data) {

                if (data.results.length) {

                    resolve(data.results[0])

                } else {

                    if (user_code !== '-') {

                        resolve(getEntityByUserCode('-', entity))

                    } else {
                        reject("Entity with user code '-' does not exist")
                    }

                }

            })

        })

    };

    var getEntityBySystemCode = function (system_code, entity) {

        return new Promise(function (resolve, reject) {

            entityResolverService.getList(entity, {
                filters: {
                    "system_code": system_code
                }
            }).then(function (data) {

                if (data.length) {

                    resolve(data[0])

                } else {

                    reject("Entity does not exist")

                }

            })

        })

    };

    var getAttributeTypeByUserCode = function (user_code, entity) {

        return new Promise(function (resolve, reject) {

            attributeTypeService.getList(entity, {
                filters: {
                    "user_code": user_code
                }
            }).then(function (data) {

                if (data.results.length) {

                    resolve(data.results[0])

                } else {

                    reject("Attribute Type with user code " + user_code + " does not exist")

                }

            })

        })

    };

    module.exports = {
        getEntityByUserCode: getEntityByUserCode,
        getEntityBySystemCode: getEntityBySystemCode,
        getAttributeTypeByUserCode: getAttributeTypeByUserCode
    }

}());