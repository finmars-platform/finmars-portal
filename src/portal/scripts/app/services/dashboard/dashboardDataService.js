(function () {

    module.exports = function () {

        var layoutData = { // basically its layout that we store on backend
            name: '',
            data: {
                components_types: []
            }
        };

        var tmpData = { // data that stored only in active session
            componentsStatuses: {}
        };

        function setData(data) {
            layoutData = data
        }

        function getData() {
            return layoutData
        }

        function setAllComponentsOutputs(compsOutputs) {

            if (!layoutData.data.components) {
                layoutData.data.components = {}
            }

            layoutData.data.components = compsOutputs;
        }

        function getAllComponentsOutputs() {

            if (!layoutData.data.components) {
                layoutData.data.components = {}
            }

            return layoutData.data.components;
        }

        function setComponentOutput(componentId, data) {

            if (!layoutData.data.components) {
                layoutData.data.components = {}
            }

            layoutData.data.components[componentId] = data
        }

        function getComponentOutput(componentId) {

            if (!layoutData.data.components) {
                layoutData.data.components = {}
            }

            return layoutData.data.components[componentId]
        }

        function setComponentStatus(componentId, status) {
            tmpData.componentsStatuses[componentId] = status
        }

        function getComponentStatus(componentId) {
            return tmpData.componentsStatuses[componentId]
        }

        function getComponentStatusesAll() {
            return tmpData.componentsStatuses
        }

        function getComponents () {
            return layoutData.data.components_types;
        }

        function getComponentById (componentId) {

            for (var i = 0; i < layoutData.data.components_types.length; i++) {
                if (layoutData.data.components_types[i].id === componentId) {
                    return layoutData.data.components_types[i];
                }
            }

            return null;
        }

        function updateComponent (componentData) {

            for (var i = 0; i < layoutData.data.components_types.length; i++) {
                if (layoutData.data.components_types[i].id === componentData.id) {
                    layoutData.data.components_types[i] = componentData;
                    break;
                }
            }

        }

        function setActiveTab(tab) {
            tmpData.activeTab = tab
        }

        function getActiveTab() {
            return tmpData.activeTab
        }

        return {

            setData: setData,
            getData: getData,

            setAllComponentsOutputs: setAllComponentsOutputs,
            getAllComponentsOutputs: getAllComponentsOutputs,
            setComponentOutput: setComponentOutput,
            getComponentOutput: getComponentOutput,
            setComponentStatus: setComponentStatus,
            getComponentStatus: getComponentStatus,
            getComponents: getComponents,
            updateComponent: updateComponent,
            getComponentById: getComponentById,

            setActiveTab: setActiveTab,
            getActiveTab: getActiveTab,

            getComponentStatusesAll: getComponentStatusesAll
        }

    }

}());