(function () {

    module.exports = function () {

        var viewerTableData = {
            entityViewerDataService: null,
            attributeDataService: null,
            columns: null
        };

        function setViewerTableColumns (columns) {
            viewerTableData.columns = columns
        }

        function getViewerTableColumns () {
            return viewerTableData.columns;
        }

        function setEntityViewerDataService (entityViewerDataService) {
            viewerTableData.entityViewerDataService = entityViewerDataService;
        }

        function getEntityViewerDataService () {
            return viewerTableData.entityViewerDataService;
        }

        function setAttributeDataService (attrDataService) {
            viewerTableData.attributeDataService = attrDataService
        }

        function getAttributeDataService () {
            return viewerTableData.attributeDataService;
        }

        return {
            setEntityViewerDataService: setEntityViewerDataService,
            getEntityViewerDataService: getEntityViewerDataService,
            setAttributeDataService: setAttributeDataService,
            getAttributeDataService: getAttributeDataService,
            setViewerTableColumns: setViewerTableColumns,
            getViewerTableColumns: getViewerTableColumns
        }

    }

}());