(function () {

    module.exports = function () {

        var layoutData = { // basically its layout that we store on backend
            name: '',
            data: {}
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


        function setActiveTab(tab) {
            tmpData.activeTab = tab
        }

        function getActiveTab() {
            return tmpData.activeTab
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

        return {

            setData: setData,
            getData: getData,

            setComponentOutput: setComponentOutput,
            getComponentOutput: getComponentOutput,

            setActiveTab: setActiveTab,
            getActiveTab: getActiveTab,

            setComponentStatus: setComponentStatus,
            getComponentStatus: getComponentStatus,

            getComponentStatusesAll: getComponentStatusesAll
        }

    }

}());