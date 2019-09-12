(function () {

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

        return {

            setData: setData,
            getData: getData,

            setComponentOutput: setComponentOutput,
            getComponentOutput: getComponentOutput
        }

    }

}());