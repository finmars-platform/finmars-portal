(function () {

    var dashboardComponentStatuses = require('./dashboardComponentStatuses');


    module.exports = function () {

        var layoutData = { // basically its dashboard layout that we store on backend
            name: '',
            data: {
                components_types: []
            }
        };

        var initializingControls = new Set(); // to keep track of controls that haven't set their value yet

        var projection;

        var data = {
            listLayout: null
        };

        var tmpData = { // data that stored only in active session
            componentsStatuses: {},
            componentsRefreshRestriction: {},
            componentsErrors: {},
            actualRvLayouts: {}, // id of layouts stored in cache that are actual
            componentsUIData: {}, // e.g. height, width of cell of component
        };

        function setData(data) {
            layoutData = data
        }

        function getData() {
            return layoutData
        }

        function setProjection(projectionData) {
            projection = projectionData
        }

        function getProjection() {
            return projection
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

        function getAllComponentsOutputsByUserCodes() {
            if (!layoutData.data.components) {
                layoutData.data.components = {}
            }

            var result = {}

            layoutData.data.components.forEach(function (component) {

                if (component.user_code) {
                    // result[component.user_code] = component // TODO WTF??????
                    if (layoutData.data.components[component.id]) {
                        if (layoutData.data.components[component.id].output) {

                            result[component.user_code] = layoutData.data.components[component.id].output

                        }
                    }
                }

            })

            return result;

        }

        /**
         * For now unnecessary because getComponentOutput are not used.
         *
         * @param componentId
         * @param {Object} output
         * @returns {*}
         * @memberof: module:dashboardDataService
         */
        function setComponentOutput(user_code, output) {

            // Probably need refactor
            if (!layoutData.data.state) {
                layoutData.data.state = {}
            }

            if (!layoutData.data.state.hasOwnProperty('meta')) {
                layoutData.data.state['meta'] = {}
            }

            layoutData.data.state['meta']['origin'] = 'finmars';

            layoutData.data.state[user_code] = output

        }

        /**
         * For now actually no used anywhere. getComponentOutputOld used.
         *
         * @param user_code
         * @returns {*}
         * @memberof: dashboardDataService
         */
        function getComponentOutput(user_code) {
            return layoutData.data.state[user_code]
        }

        function getLayoutState() {
            // since state object is not big, there is not much trouble to return new copy each time
            // needs because each component in dashboard has lastSavedOutput
            // components are using it to find out should they refresh if output changes

            if (layoutData.data.state) {
                return JSON.parse(JSON.stringify(layoutData.data.state))
            }
            return {}
        }

        function setLayoutState(data) {
            return layoutData.data.state = data
        }

        function setComponentOutputOld(componentId, data) {

            if (!layoutData.data.components) {
                layoutData.data.components = {}
            }

            console.log('layoutData.data.components[componentId]', layoutData.data.components[componentId]);

            layoutData.data.components[componentId] = data

        }

        function getComponentOutputOld(componentId) {

            if (!layoutData.data.components) {
                layoutData.data.components = {}
            }

            return layoutData.data.components[componentId]
        }

        function setComponentStatus(componentId, status) {

            var componentData = getComponentById(componentId)

            console.log("Dashboard.setComponentStatus.component " + componentData.name + " changed status: " + status)

            tmpData.componentsStatuses[componentId] = status

        }

        function getComponentStatus(componentId) {
            return tmpData.componentsStatuses[componentId]
        }

        function setComponentError(componentId, error) {
            tmpData.componentsErrors[componentId] = error;
        }

        function getComponentError(componentId) {
            return tmpData.componentsErrors[componentId];
        }

        function setComponentRefreshRestriction(componentId, restrictionStatus) {
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

        function getAllComponentsRefreshRestriction() {
            return tmpData.componentsRefreshRestriction;
        }

        function setComponentUIData(componentId, uiData) {
            tmpData.componentsUIData[componentId] = uiData;
        }

        function getComponentUIData(componentId) {
            return tmpData.componentsUIData[componentId];
        }

        function getComponentStatusesAll() {
            return tmpData.componentsStatuses
        }

        function getComponents() {
            return layoutData.data.components_types;
        }

        function setComponents(components) {
            layoutData.data.components_types = components;
        }

        function getComponentById(componentId) {

            for (var i = 0; i < layoutData.data.components_types.length; i++) {
                if (layoutData.data.components_types[i].id === componentId) {
                    return layoutData.data.components_types[i];
                }
            }

            return null;
        }

        function updateComponent(componentData) {

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

        function setListLayout(listLayout) {
            data.listLayout = listLayout;
        }

        function getListLayout() {
            return data.listLayout;
        }

        function updateModifiedDate(modifiedDate) {
            // updating listLayout prevents synchronization error when saving settings of component inside dashboard
            var listLayout = getListLayout();
            listLayout.modified_at = modifiedDate;

            var layout = getData();
            layout.modified_at = modifiedDate;

        }

        function setCachedLayoutsData(contentType, userCode, id) {

            /*if (!tmpData.actualRvLayouts.includes(layoutId)) {
                tmpData.actualRvLayouts.push(layoutId);
            }*/
            if (!tmpData.actualRvLayouts[contentType]) {
                tmpData.actualRvLayouts[contentType] = {};
            }

            tmpData.actualRvLayouts[contentType][userCode] = id;

        }

        function getCachedLayoutsData() {
            return tmpData.actualRvLayouts;
        }

        function setLayoutToOpen(layoutToOpen) {
            tmpData.layoutToOpen = layoutToOpen;
        }

        function getLayoutToOpen() {
            return tmpData.layoutToOpen;
        }

        function registerControl(componentId) {

            initializingControls.add(componentId);

        }

        function areControlsReady() {

            console.log('initializingControls', initializingControls);

            var result = true;

            initializingControls.forEach(function (componentId) {

                var status = getComponentStatus(componentId);

                if (status !== dashboardComponentStatuses.ACTIVE) {
                    result = false;
                }

            })


            return result // either there is no controls, or they all have set their value
        }

        /** @module: dashboardDataService */
        return {

            setData: setData,
            getData: getData,
            setListLayout: setListLayout,
            getListLayout: getListLayout,
            updateModifiedDate: updateModifiedDate,

            setProjection: setProjection,
            getProjection: getProjection,

            setAllComponentsOutputs: setAllComponentsOutputs,
            getAllComponentsOutputs: getAllComponentsOutputs,
            getAllComponentsOutputsByUserCodes: getAllComponentsOutputsByUserCodes,

            setComponentOutput: setComponentOutput, // szhitenev 2023-08-20
            getComponentOutput: getComponentOutput,

            setComponentOutputOld: setComponentOutputOld,
            getComponentOutputOld: getComponentOutputOld,
            setComponentStatus: setComponentStatus,
            getComponentStatus: getComponentStatus,
            setComponentError: setComponentError,
            getComponentError: getComponentError,
            setComponentRefreshRestriction: setComponentRefreshRestriction,
            /* getComponentRefreshRestriction: getComponentRefreshRestriction,
            setAllComponentsRefreshRestriction: setAllComponentsRefreshRestriction, */
            getAllComponentsRefreshRestriction: getAllComponentsRefreshRestriction,
            setComponentUIData: setComponentUIData,
            getComponentUIData: getComponentUIData,
            getComponents: getComponents,
            setComponents: setComponents,
            updateComponent: updateComponent,
            getComponentById: getComponentById,

            setActiveTab: setActiveTab,
            getActiveTab: getActiveTab,

            setCachedLayoutsData: setCachedLayoutsData,
            getCachedLayoutsData: getCachedLayoutsData,

            getComponentStatusesAll: getComponentStatusesAll,


            // REFACTOR change layout from popup
            setLayoutToOpen: setLayoutToOpen,
            getLayoutToOpen: getLayoutToOpen,


            // 2023-08-23
            registerControl: registerControl,
            areControlsReady: areControlsReady,


            // 2023-11-11
            getLayoutState: getLayoutState,
            setLayoutState: setLayoutState

        }

    }

}());