(function () {

    module.exports = function () {

        var data = {
            components: {}
        };

        function updateComponentOutput(componentId, output) {
            data.components[componentId] = output
        }

        function getComponentOutput(componentId) {
            return data.components[componentId]
        }

        return {
            updateComponentOutput: updateComponentOutput,
            getComponentOutput: getComponentOutput
        }

    }

}());