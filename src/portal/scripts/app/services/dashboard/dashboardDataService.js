(function () {

    module.exports = function () {

        var layoutData = { // basically its dashboard layout that we store on backend
            name: '',
            data: {
                components_types: []
            }
        };

        var data = {
            listLayout: null
        };

        var tmpData = { // data that stored only in active session
            componentsStatuses: {},
            componentsRefreshRestriction: {},
            componentsErrors: {},
            actualRvLayouts: [] // id of layouts stored in cache that are actual
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

        function setComponentError (componentId, error) {
            tmpData.componentsErrors[componentId] = error;
        }

        function getComponentError (componentId) {
            return tmpData.componentsErrors[componentId];
        }

        function setComponentRefreshRestriction (componentId, restrictionStatus) {
            tmpData.componentsRefreshRestriction[componentId] = restrictionStatus;
        }

        /*function getComponentRefreshRestriction (componentId) {
            return tmpData.componentsRefreshRestriction[componentId];
        }

        function setAllComponentsRefreshRestriction (restrictionStatus) {
            Object.keys(tmpData.componentsRefreshRestriction).forEach(function (componentId) {
                tmpData.componentsRefreshRestriction[componentId] = restrictionStatus;
            });
        }*/

        function getAllComponentsRefreshRestriction () {
            return tmpData.componentsRefreshRestriction;
        }

        function getComponentStatusesAll() {
            return tmpData.componentsStatuses
        }

        function getComponents () {
            return layoutData.data.components_types;
        }

        function setComponents (components) {
            layoutData.data.components_types = components;
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

        function setListLayout (listLayout) {
            data.listLayout = listLayout;
        }

        function getListLayout () {
            return data.listLayout;
        }

        function pushToActualRvLayoutsInCache (layoutId) {

            if (!tmpData.actualRvLayouts.includes(layoutId)) {
                tmpData.actualRvLayouts.push(layoutId);
            }

        }

        function getActualRvLayoutsInCache () {
            return tmpData.actualRvLayouts;
        }

        return {

            setData: setData,
            getData: getData,
            setListLayout: setListLayout,
            getListLayout: getListLayout,

            setAllComponentsOutputs: setAllComponentsOutputs,
            getAllComponentsOutputs: getAllComponentsOutputs,
            setComponentOutput: setComponentOutput,
            getComponentOutput: getComponentOutput,
            setComponentStatus: setComponentStatus,
            getComponentStatus: getComponentStatus,
            setComponentError: setComponentError,
            getComponentError: getComponentError,
            setComponentRefreshRestriction: setComponentRefreshRestriction,
            /* getComponentRefreshRestriction: getComponentRefreshRestriction,
            setAllComponentsRefreshRestriction: setAllComponentsRefreshRestriction, */
            getAllComponentsRefreshRestriction: getAllComponentsRefreshRestriction,
            getComponents: getComponents,
            setComponents: setComponents,
            updateComponent: updateComponent,
            getComponentById: getComponentById,

            setActiveTab: setActiveTab,
            getActiveTab: getActiveTab,

            pushToActualRvLayoutsInCache: pushToActualRvLayoutsInCache,
            getActualRvLayoutsInCache: getActualRvLayoutsInCache,

            getComponentStatusesAll: getComponentStatusesAll
        }

    }

}());