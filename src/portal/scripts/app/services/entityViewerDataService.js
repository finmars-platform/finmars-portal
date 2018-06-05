(function () {

    module.exports = function () {

        console.log('Entity Viewer Data Service started!');

        var data = {
            columns: [],
            groups: [],
            filters: [],
            pagination: {
                page: 1,
                items_per_page: 15,
                total_items: 1
            },
            status: {
                data: null
            },
            rootEntityViewer: false,
            additions: {},
            report: {}
        };


        console.log('Entity Viewer Data Service data', data);

        function setRootEntityViewer(isRootEntityViewer) {
            data.rootEntityViewer = isRootEntityViewer;
        }

        function isRootEntityViewer() {
            return data.rootEntityViewer
        }


        function setEntityType(entityType) {
            data.entityType = entityType;
        }

        function getEntityType() {
            return data.entityType;
        }


        function setColumns(columns) {
            data.columns = columns;
        }

        function getColumns() {
            return data.columns;
        }

        function setGroups(groups) {
            data.groups = groups;
        }

        function getGroups() {
            return data.groups;
        }

        function setFilters(filters) {
            data.filters = filters;
        }

        function getFilters() {
            return data.filters;
        }

        function getPagination() {
            return data.pagination
        }

        function setPagination(pagination) {
            data.pagination = pagination;
        }

        function setAdditions(additions) {
            data.additions = additions;
        }

        function getAdditions() {
            return data.additions
        }

        function setEditorEntityId(id) {
            data.editorEntityId = id;
        }

        function getEditorEntityId() {
            return data.editorEntityId;
        }

        function setEditorTemplateUrl(templateUrl) {
            data.editorTemplateUrl = templateUrl;
        }

        function getEditorTemplateUrl() {
            return data.editorTemplateUrl;
        }

        function setComponents(components) {
            data.components = components
        }

        function getComponents() {
            return data.components
        }

        function setReportOptions(options) {
            data.reportOptions = options;
        }

        function getReportOptions() {
            return data.reportOptions
        }

        function setStatusData(status) {
            data.status.data = status
        }

        function getStatusData() {
            return data.status.data;
        }

        return {

            setRootEntityViewer: setRootEntityViewer,
            isRootEntityViewer: isRootEntityViewer,

            setEntityType: setEntityType,
            getEntityType: getEntityType,

            setColumns: setColumns,
            getColumns: getColumns,

            setGroups: setGroups,
            getGroups: getGroups,

            setFilters: setFilters,
            getFilters: getFilters,

            getPagination: getPagination,
            setPagination: setPagination,

            setAdditions: setAdditions,
            getAdditions: getAdditions,

            setEditorEntityId: setEditorEntityId,
            getEditorEntityId: getEditorEntityId,

            setEditorTemplateUrl: setEditorTemplateUrl,
            getEditorTemplateUrl: getEditorTemplateUrl,

            setComponents: setComponents,
            getComponents: getComponents,

            setReportOptions: setReportOptions,
            getReportOptions: getReportOptions,

            setStatusData: setStatusData,
            getStatusData: getStatusData

        }
    }

}());