/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var portfolioRepository = require('../repositories/portfolioRepository');

    var getClassifierNodeList = function () {
        return portfolioRepository.getClassifierNodeList();
    };

    var getClassifierNodeByKey = function (id) {
        return portfolioRepository.getClassifierNodeByKey(id);
    };

    var getClassifierList = function () {
        return portfolioRepository.getClassifierList();
    };

    var getClassifierByKey = function (id) {
        return portfolioRepository.getClassifierByKey(id);
    };

    var getAttributeTypeList = function () {
        return portfolioRepository.getAttributeTypeList();
    };

    var getAttributeTypeByKey = function (id) {
        return portfolioRepository.getAttributeTypeByKey(id);
    };

    var getList = function () {
        return portfolioRepository.getList();
    };

    var getByKey = function (id) {
        return portfolioRepository.getByKey(id);
    };


    module.exports = {
        getClassifierNodeList: getClassifierNodeList,
        getClassifierNodeByKey: getClassifierNodeByKey,

        getClassifierList: getClassifierList,
        getClassifierByKey: getClassifierByKey,

        getAttributeTypeList: getAttributeTypeList,
        getAttributeTypeByKey: getAttributeTypeByKey,

        getList: getList,
        getByKey: getByKey
    }


}());