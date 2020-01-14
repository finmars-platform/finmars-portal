(function () {

    module.exports = function () {

        var viewerTableData = {
            columns: null
        };

        var attributeData = {
            attributeDataService: null // inside object to create mutation
        };

        function setAttributeDataService (attrDataService) {
            attributeData.attributeDataService = attrDataService
        }

        function getAttributeDataService () {
            return attributeData.attributeDataService;
        }

        function setViewerTableColumns (columns) {
            viewerTableData.columns = columns
        }

        function getViewerTableColumns () {
            return viewerTableData.columns;
        }

        return {
            setAttributeDataService: setAttributeDataService,
            getAttributeDataService: getAttributeDataService,
            setViewerTableColumns: setViewerTableColumns,
            getViewerTableColumns: getViewerTableColumns
        }

    }

}());