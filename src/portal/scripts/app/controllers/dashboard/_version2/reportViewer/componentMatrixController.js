const DashboardDataService = require('../../../../services/dashboard/dashboardDataService');
const DashboardEventService = require('../../../../services/eventService');

const dashboardEvents = require('../../../../services/dashboard/dashboardEvents');
const dashboardComponentStatuses = require('../../../../services/dashboard/dashboardComponentStatuses');

export default function ($scope, $uiRouterGlobals, iframeService) {

    const vm = this;

    vm.readyStatus = false;

    const windowOrigin = window.origin;
    // const windowOrigin = 'http://localhost:3000'; // for development
    let iframeId = $uiRouterGlobals.params.iframeId;


    /*const componentId = $uiRouterGlobals.params.componentId;
    const reportLayoutId = $uiRouterGlobals.params.reportLayoutId;
    const abscissa = $uiRouterGlobals.params.abscissa;
    const ordinate = $uiRouterGlobals.params.ordinate;
    const value_key = $uiRouterGlobals.params.value_key;*/

    vm.dashboardDataService = null;
    vm.dashboardEventService = null;

    vm.itemData = {data: {}};

    vm.tabNumber = 1;
    vm.rowNumber = 1;
    vm.colNumber = 1;

    let componentDataMockup = {
        "id": $uiRouterGlobals.params.componentId,
        "name": "",
        "settings": {
            "abscissa": $uiRouterGlobals.params.abscissa,
            "auto_refresh": false,
            "auto_scaling": false,
            "calculate_name_column_width": false,
            "content_type": "reports.balancereport",
            "entity_type": "balance-report",
            "filters": {
                "show_filters_area": false,
                "show_use_from_above_filters": false
            },
            "hide_empty_lines": "",
            "layout": $uiRouterGlobals.params.reportLayoutId,
            "layout_name": "",
            "linked_components": {},
            "matrix_view": "usual",
            "ordinate": $uiRouterGlobals.params.ordinate,
            "styles": {
                "cell": {
                    "text_align": "center"
                }
            },
            "subtotal_formula_id": 1,
            "value_key": $uiRouterGlobals.params.value_key,
        },
        "type": "report_viewer_matrix",
        "user_settings": {
            "available_abscissa_keys": [
                /*{
                    "attribute_data": {
                        "content_type": "reports.balancereport",
                        "key": "name",
                        "name": "Balance. Name",
                        "value_type": 10
                    },
                    "is_default": true,
                    "layout_name": ""
                }*/
            ],
            "available_ordinate_keys": [
                /*{
                    "attribute_data": {
                        "content_type": "currencies.currency",
                        "key": "currency.name",
                        "name": "Currency. Name",
                        "value_type": 10
                    },
                    "is_default": true,
                    "layout_name": ""
                }*/
            ],
            "available_value_keys": [
                /*{
                    "attribute_data": {
                        "content_type": "reports.balancereport",
                        "key": "market_value",
                        "name": "Balance. Market value",
                        "value_type": 20
                    },
                    "is_default": true,
                    "layout_name": ""
                }*/
            ]
        },
        "inside_iframe": true,
    };

    vm.itemData.data.id = componentDataMockup.id;

    let layoutMockup = {
        data: {
            components_types: []
        }
    };

    function send( data ) {

        const dataObj = Object.assign(data, {
            iframeId: iframeId,
        })

        window.parent.postMessage( dataObj, windowOrigin )

    }

    function initMatrix (data) {

        if (event.data.settings) {
            componentDataMockup.settings = { ...componentDataMockup.settings, ...data.settings };
        }

        if (event.data.user_settings) {
            componentDataMockup.settings = { ...componentDataMockup.user_settings, ...data.user_settings };
        }
        console.log("testing880 componentDataMockup", componentDataMockup);
        layoutMockup.data.components_types.push(componentDataMockup);

        vm.dashboardDataService.setData(layoutMockup);

        vm.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

            const status = vm.dashboardDataService.getComponentStatus(componentId);

            if (status === dashboardComponentStatuses.INIT) {
                vm.dashboardDataService.setComponentStatus(componentId, dashboardComponentStatuses.START);
                vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
            }

        });

    }

    const onMessageStack = {
        'INITIALIZATION_SETTINGS_TRANSMISSION': initMatrix,
    };

    function onMessage (event) {

        if ( !event.data.action ) {
            console.warn('Message without action sent');
            return false;
        }

        if ( event.origin !== windowOrigin) {
            console.error('Received message from a different origin', event.origin);
            return false;
        }

        if ( onMessageStack[event.data.action] ) {
            onMessageStack[event.data.action](event.data.payload)
        }
        else console.log('event.data.action:', event.data)

    }

    const init = function () {

        vm.dashboardDataService = new DashboardDataService();
        vm.dashboardEventService = new DashboardEventService();

        // vm.dashboardDataService.setData(layoutMockup);

        window.addEventListener("message", onMessage);

        send( {action: 'IFRAME_READY'} );



        // uiService.getDashboard2LayoutByKey().then(
        // uiService.getDashboardLayoutByKey(layoutId)
    }

    init();

}