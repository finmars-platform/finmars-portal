(function () {

    var md5helper = require('../../helpers/md5.helper');

    module.exports = function () {

        var layoutData = { // basically its layout that we store on backend
            name: '',
            data: {
                components: []
            }
        };

        function setData(data) {
            layoutData = data
        }

        function getData() {
            return layoutData
        }

        function setComponents(data) {

            if (!data || !Array.isArray(data)) {
                layoutData.data.components = [];
            } else {
                layoutData.data.components = data;
            }

        }

        function getComponents() {
            return layoutData.data.components;
        }

        function getComponentById (componentId) {

            for (var i = 0; i < layoutData.data.components.length; i++) {
                if (layoutData.data.components[i].id === componentId) {
                    return layoutData.data.components[i];
                }
            }

            return null;
        }

        function updateComponentById (componentData) {

            for (var i = 0; i < layoutData.data.components.length; i++) {

                if (layoutData.data.components[i].id === componentData.id) {
                    layoutData.data.components[i] = componentData;
                }

            }

        }

        function deleteComponentById (componentId) {

            for (var i = 0; i < layoutData.data.components.length; i++) {

                if (layoutData.data.components[i].id === componentId) {
                    layoutData.data.components.splice(i, 1);
                }

            }

            for (var i = 0; i < layoutData.data.components_types.length; i++) {

                if (layoutData.data.components_types[i].id === componentId) {
                    layoutData.data.components_types.splice(i, 1);
                }

            }



        }

        // non data store related methods, mostly helpers

        function ___generateId(str) {
            return md5helper.md5(str);
        }

        return {

            setData: setData,
            getData: getData,

            setComponents: setComponents,
            getComponents: getComponents,
            getComponentById: getComponentById,
            updateComponentById: updateComponentById,
            deleteComponentById: deleteComponentById,

            // non data related method, mostly helpers
            ___generateId: ___generateId
        }

    }

}());