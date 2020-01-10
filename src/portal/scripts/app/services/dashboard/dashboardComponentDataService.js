(function () {

    module.exports = function () {

        var attributeData = {
            attributeDataService :null // inside object to create mutation
        };

        function setAttributeDataService (attrDataService) {
            attributeData.attributeDataService = attrDataService
        }

        function getAttributeDataService (attrDataService) {
            return attributeData.attributeDataService;
        }

        return {
            setAttributeDataService: setAttributeDataService,
            getAttributeDataService: getAttributeDataService
        }

    }

}());