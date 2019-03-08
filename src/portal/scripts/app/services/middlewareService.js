/**
 * Created by mevstratov on 08.03.2019
 */
(function () {

    'use strict';

    var data = {};

    var setData = function (propertyName, propertyValue) {
        data[propertyName] = propertyValue;
    };

    var getData = function (propertyName) {

        if (data.hasOwnProperty(propertyName)) {
            return data[propertyName];
        } else {
            return false;
        }

    };

    var deleteData = function (propertyName) {
        if (data.hasOwnProperty(propertyName)) {
            delete data[propertyName];
        }
    };

    module.exports = {
        setData: setData,
        getData: getData,
        deleteData: deleteData
    }

}());