(function () {

    var md5helper = require('../../helpers/md5.helper')

    module.exports = function () {

        var layoutData = { // basically its layout that we store on backend
            name: '',
            data: {}
        };

        function setData(data) {
            layoutData = data
        }

        function getData() {
            return layoutData
        }

        function setComponentsTypes(data) {
            layoutData.data.components_types = data;
        }

        function getComponentsTypes() {
            return layoutData.data.components_types
        }

        // non data store related methods, mostly helpers

        function ___generateId(str) {
            return md5helper.md5(str);
        }

        return {

            setData: setData,
            getData: getData,

            setComponentsTypes: setComponentsTypes,
            getComponentsTypes: getComponentsTypes,

            // non data related method, mostly helpers
            ___generateId: ___generateId
        }

    }

}());