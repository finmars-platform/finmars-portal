/**
 * Created by szhitenev on 04.05.2016.
 */

'use strict';

/* require('../../forum/scripts/main.js');
require('../../profile/scripts/main.js'); */
/*import middlewareService from "../../shell/scripts/app/services/middlewareService";
import authorizerService from '../../shell/scripts/app/services/authorizerService.js';*/

// import uiService from "./app/services/uiService.js";

import portalController from './app/controllers/portalController.js';
import enterUserCodeDialogController from "./app/controllers/dialogs/enterUserCodeDialogController.js";
import portfolioRegisterDialogController from "./app/controllers/dialogs/portfolioRegisterDialogController";
import dialogHeaderDirective from "./app/directives/dialogHeaderDirective";

// form - tabs
import instrumentTypePricingTabController
    from "./app/controllers/tabs/instrument-type/instrumentTypePricingTabController.js";
import portfolioPerformanceTabController from "./app/controllers/tabs/portfolio/performanceTabController.js"
// < form - tabs >
import mainHeaderDirective from "./app/directives/mainHeaderDirective.js";

import complexDropdownSelectDirective from "./app/directives/customInputs/complexDropdownSelectDirective";
import complexDropdownSelectMenuDirective from "./app/directives/customInputs/complexDropdownSelectMenuDirective";
import baseInputDirective from "./app/directives/customInputs/baseInputDirective";
import multiinputFieldDirective from "./app/directives/customInputs/multiinputFieldDirective";
import entityNamesFieldDirective from "./app/directives/customInputs/entityNamesFieldDirective";
import closeDialogButtonDirective from "./app/directives/closeDialogButtonDirective";

// noinspection JSVoidFunctionReturnValueUsed
export default (function () {

    let portal = angular.module('finmars.portal', [
        'ngAria',
        'ngMaterial',
        'ngMessages',
        'ngMdIcons',
        'ngResource',
        'ngSanitize',
        'mdPickers',  // Time picker in Automated upload schedule history
        'vAccordion', // Accordion in Transaction Type Actions
        'ui.router',
        'bw.paging', // Pagination in Forum
        'ui.select', // Tags control in Transaction Type
        // 'ui.scroll', // Infinite scroll in Mapping Dialog

        angularDragula(angular), // Drag in Drop in Entity Viewer / Report Viewer/ View Constructor/ Form Editor


        /*'forum',
        'profile'*/
    ]);


    portal.config(['$stateProvider', require('./app/router.js')]);
    /* portal.config(['$mdDateLocaleProvider', function ($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function (date) {
            return moment(date).format('YYYY-MM-DD');
        };
    }]); */

    portal.factory('pickmeup', ['$window', function ($window) {
        if ($window.pickmeup) {
            return $window.pickmeup;
        }
    }]);

    portal.factory('d3Service', ['$window', function ($window) {
        if ($window.d3) {
            return $window.d3;
        }
    }]);

    portal.factory('Pickr', ['$window', function ($window) {
        if ($window.Pickr) {
            return $window.Pickr;
        }
    }]);

    portal.service('$customDialog', ['$rootScope', '$templateCache', '$compile', '$controller', require('./app/services/customDialogService')]);
    portal.service('$bigDrawer', ['$rootScope', '$templateCache', '$compile', '$controller', require('./app/services/bigDrawerService')]);

    /* portal.service('authorizerService', [authorizerService]);
    portal.service('middlewareService', [middlewareService]); */

    // portal.service('uiService', ['localStorageService', uiService]);
    portal.service('multitypeFieldService', [require('./app/services/multitypeFieldService')]);
    portal.service('importSchemesMethodsService', ['$mdDialog', require('./app/services/import/importSchemesMethodsService')]);
    portal.service('evRvDomManagerService', [require('./app/services/evRvDomManagerService')]);
    portal.service('entityDataConstructorService', [require('./app/services/entity-data-constructor/entityDataConstructorService')]);

    portal.service('gFiltersHelper', [require('./app/helpers/gFiltersHelper')]);
    portal.service('gridTableHelperService', [require('./app/helpers/gridTableHelperService')]);

    //<editor-fold desc="Dashboard">
    portal.component('dashboardEntityViewer', require('./app/components/dashboardEntityViewerComponent'));

    portal.controller('DashboardLayoutManagerController', ['$scope', '$mdDialog', require('./app/controllers/dashboardLayoutManagerController')]);

    portal.controller('DashboardConstructorController', ['$scope', '$stateParams', '$state', '$mdDialog', require('./app/controllers/dashboardConstructorController')]);
    portal.controller('DashboardConstructorSocketSettingsDialogController', ['$scope', '$mdDialog', 'dashboardConstructorDataService', 'dashboardConstructorEventService', 'attributeDataService', 'data', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorSocketSettingsDialogController')]);

    // DEPRECATED SINCE 01.2021
    portal.controller('DashboardConstructorAccordionEditorDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorAccordionEditorDialogController')]);

    portal.controller('DashboardConstructorAccordionComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', 'data', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorAccordionComponentDialogController')]);
    portal.controller('DashboardConstructorControlComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'multitypeFieldService', 'data', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorControlComponentDialogController')]);
    portal.controller('DashboardConstructorButtonSetComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorButtonSetComponentDialogController')]);
    portal.controller('DashboardConstructorSupersetDashboardComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorSupersetDashboardComponentDialogController')]);
    portal.controller('DashboardConstructorInputFormComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorInputFormComponentDialogController')]);
    portal.controller('DashboardConstructorFinmarsWidgetComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorFinmarsWidgetComponentDialogController')]);


    portal.controller('DashboardConstructorReportViewerComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', 'attributeDataService', 'multitypeFieldService', 'data', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorReportViewerComponentDialogController')]);
    portal.controller('DashboardConstructorReportViewerSplitPanelComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', 'attributeDataService', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorReportViewerSplitPanelComponentDialogController')]);
    portal.controller('DashboardConstructorReportViewerGrandTotalComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', 'attributeDataService', 'multitypeFieldService', 'data', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorReportViewerGrandTotalComponentDialogController')]);
    portal.controller('DashboardConstructorReportViewerMatrixComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', 'attributeDataService', 'multitypeFieldService', 'data', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorReportViewerMatrixComponentDialogController')]);
    portal.controller('DashboardConstructorReportViewerTableChartComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', 'attributeDataService', 'multitypeFieldService', 'data', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorReportViewerTableChartComponentDialogController')]);
    portal.controller('DashboardConstructorReportViewerChartsComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', 'attributeDataService', 'multitypeFieldService', 'data', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorReportViewerChartsComponentDialogController')]);

    portal.controller('DashboardConstructorEntityViewerComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorEntityViewerComponentDialogController')]);
    portal.controller('DashboardConstructorEntityViewerSplitPanelComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorEntityViewerSplitPanelComponentDialogController')]);

    portal.controller('DashboardReportViewerComponentSettingsDialogController', ['$scope', '$mdDialog', 'item', 'data', require('./app/controllers/dialogs/dashboard/component-settings/dashboardReportViewerComponentSettingsDialogController')]);
    portal.controller('DashboardReportViewerChartsComponentSettingsDialogController', ['$scope', '$mdDialog', 'item', 'data', require('./app/controllers/dialogs/dashboard/component-settings/dashboardReportViewerChartsComponentSettingsDialogController')]);
    portal.controller('DashboardReportViewerMatrixComponentSettingsDialogController', ['$scope', '$mdDialog', 'item', 'data', require('./app/controllers/dialogs/dashboard/component-settings/dashboardReportViewerMatrixComponentSettingsDialogController')]);
    portal.controller('DashboardReportViewerTableChartComponentSettingsDialogController', ['$scope', '$mdDialog', 'item', 'data', require('./app/controllers/dialogs/dashboard/component-settings/dashboardReportViewerTableChartComponentSettingsDialogController')]);

    portal.directive('dashboardConstructorField', ['$mdDialog', require('./app/directives/dashboardConstructorFieldDirective')]);
    portal.directive('dashboardConstructorGridAligner', [require('./app/directives/dashboardConstructorGridAlignerDirective')]);

    portal.controller('DashboardController', ['$scope', '$stateParams', '$mdDialog', require('./app/controllers/dashboardController')]);

    portal.directive('dashboardGridAligner', [require('./app/directives/dashboard/dashboardGridAlignerDirective')]);

    portal.directive('dashboardAccordion', ['$mdDialog', '$state', require('./app/directives/dashboard/dashboardAccordionDirective')]);
    portal.directive('dashboardButtonSet', ['$mdDialog', '$state', require('./app/directives/dashboard/dashboardButtonSetDirective')]);
    portal.directive('dashboardControl', [require('./app/directives/dashboard/dashboardControlDirective')]);
    portal.directive('dashboardEntityViewer', [require('./app/directives/dashboard/dashboardEntityViewerDirective')]);
    portal.directive('dashboardEntityViewerSplitPanel', [require('./app/directives/dashboard/dashboardEntityViewerSplitPanelDirective')]);
    portal.directive('dashboardInputForm', [require('./app/directives/dashboard/dashboardInputFormDirective')]);
    portal.directive('dashboardReportViewer', ['$mdDialog', require('./app/directives/dashboard/dashboardReportViewerDirective')]);
    portal.directive('dashboardReportViewerSplitPanel', ['$mdDialog', require('./app/directives/dashboard/dashboardReportViewerSplitPanelDirective')]);
    portal.directive('dashboardReportViewerGrandTotal', ['$mdDialog', require('./app/directives/dashboard/dashboardReportViewerGrandTotalDirective')]);
    portal.directive('dashboardReportViewerMatrix', ['$mdDialog', require('./app/directives/dashboard/dashboardReportViewerMatrixDirective')]);
    portal.directive('dashboardReportViewerTableChart', ['$mdDialog', require('./app/directives/dashboard/dashboardReportViewerTableChartDirective')]);
    portal.directive('dashboardReportViewerCharts', ['$mdDialog', require('./app/directives/dashboard/dashboardReportViewerChartsDirective')]);
    portal.directive('dashboardSupersetDashboard', ['$mdDialog', '$state', require('./app/directives/dashboard/dashboardSupersetDashboardDirective')]);
    portal.directive('dashboardFinmarsWidget', ['$mdDialog', '$state', 'globalDataService', require('./app/directives/dashboard/dashboardFinmarsWidgetDirective')]);

    portal.controller('DashboardReportViewerController', ['$scope', '$mdDialog', 'toastNotificationService', 'usersService', 'globalDataService', 'gFiltersHelper', require('./app/controllers/entityViewer/dashboardReportViewerController')]);

    portal.directive('reportViewerMatrix', ['$mdDialog', require('./app/directives/reportViewerMatrixDirective')]);
    portal.directive('reportViewerTableChart', ['$mdDialog', require('./app/directives/reportViewerTableChartDirective')]);
    portal.directive('reportViewerBarsChart', ['d3Service', require('./app/directives/reportViewer/reportViewerBarsChart')]);
    portal.directive('reportViewerPieChart', ['d3Service', require('./app/directives/reportViewer/reportViewerPieChart')]);


    portal.controller('DashboardLayoutListDialogController', ['$scope', '$mdDialog', 'backendConfigurationImportService', 'data', require('./app/controllers/dialogs/dashboard/layoutListDialogController')]);
    portal.controller('DashboardLayoutExportDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/dashboard/dashboardLayoutExportDialogController')]);
    //</editor-fold desc="Dashboard">

    // Common

    // portal.controller('ShellController', ['$scope', '$state', '$stateParams', '$rootScope', '$mdDialog', '$transitions', require('./app/controllers/shellController')]);
    portal.controller('PortalController', ['$scope', '$state', 'authorizerService', 'usersService', 'globalDataService', 'redirectionService', 'middlewareService', portalController]);
    portal.controller('BookmarksController', ['$scope', '$mdDialog', '$state', 'toastNotificationService', require('./app/controllers/bookmarksController')]);
    portal.controller('SideNavController', ['$scope', '$mdDialog', '$transitions', 'usersService', 'globalDataService', 'redirectionService', require('./app/controllers/sideNavController')]);
    portal.controller('AlertSideNavController', ['$scope', 'globalDataService', 'systemMessageService', require('./app/controllers/alertSideNavController')]);
    portal.controller('HomeController', ['$scope', '$state', '$mdDialog', 'authorizerService', 'usersService', 'globalDataService', 'systemMessageService', 'redirectionService', require('./app/controllers/homeController')]);
    portal.controller('SystemPageController', ['$scope', '$mdDialog', 'globalDataService', require('./app/controllers/pages/systemPageController')]);
    // portal.controller('SetupController', ['$scope', '$state', 'usersService', require('./app/controllers/setupController')]);
    portal.controller('NotFoundPageController', ['$scope', require('./app/controllers/notFoundPageController')]);
    portal.controller(
        'EntityDataConstructorDialogController',
        ['$scope', '$stateParams', '$state', '$mdDialog', 'entityDataConstructorService', 'data',
            require('./app/controllers/dialogs/entityDataConstructorDialogController')]
    );
    portal.controller('EntityViewerFormsPreviewDialogController', ['$scope', '$mdDialog', 'inputFormTabs', 'data', require('./app/controllers/dialogs/entityViewerFormsPreviewDialogController')]);
    portal.controller('ComplexTransactionFormsPreviewDialogController', ['$scope', '$mdDialog', 'inputFormTabs', 'data', require('./app/controllers/dialogs/complexTransactionFormsPreviewDialogController')]);
    portal.controller('EvFormInstrumentTableSettingsDialogController', ['$scope', '$mdDialog', 'gridTableHelperService', 'data', require('./app/controllers/dialogs/evFormInstrumentTableSettingsDialogController')]);
    portal.controller('ExpressionEditorDialogController', ['$scope', '$mdDialog', 'item', 'data', require('./app/controllers/dialogs/expressionEditorDialogController')]);
    portal.controller('AceEditorDialogController', ['$scope', '$mdDialog', 'item', 'data', require('./app/controllers/dialogs/aceEditorDialogController')]);
    portal.controller('JsonEditorDialogController', ['$scope', '$mdDialog', 'item', 'data', require('./app/controllers/dialogs/jsonEditorDialogController')]);
    portal.controller('EntityAsJsonEditorDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/entityAsJsonEditorDialogController')]);
    portal.controller('ConfigurationPackageDialogController', ['$scope', '$mdDialog', 'backendConfigurationImportService', 'data', require('./app/controllers/dialogs/configurationPackageDialogController')]);
    portal.controller('UseFromAboveDialogController', ['$scope', '$mdDialog', 'data', 'attributeDataService', require('./app/controllers/dialogs/useFromAboveDialogController')]);
    portal.controller('InstrumentSelectDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/instrumentSelectDialogController')]);
    portal.controller('EntitySearchDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/entitySearchDialogController')]);
    portal.controller('TwoFieldsMultiselectDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/twoFieldsMultiselectDialogController')]);
    portal.controller('TableAttributeSelectorDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/tableAttributeSelectorDialogController')]);
    portal.controller('TableAttributesMenuConstructorDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/tableAttributesMenuConstructorDialogController')]);
    portal.controller('LayoutChangesLossWarningDialogController', ['$scope', 'data', '$mdDialog', require('./app/controllers/dialogs/layoutChangesLossWarningDialogController')]);
    portal.controller('ClassifierSelectDialogController', ['$scope', '$mdDialog', 'commonDialogsService', 'data', require('./app/controllers/dialogs/classifierSelectDialogController')]);
    portal.directive('classifierTree', [require('./app/directives/classifierTreeDirective')]);
    portal.directive('classifierTreeNode', [require('./app/directives/classifierTreeNodeDirective')]);
    portal.controller('ExpandableItemsSelectorDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/expandableItemsSelectorDialogController')]);
    portal.controller('SaveLayoutDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/saveLayoutDialogController')]);
    portal.controller('RenameFieldDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/renameFieldDialogController')]);
    portal.controller('ResizeFieldDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/resizeFieldDialogController')]);
    portal.controller('SaveConfigurationExportLayoutDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/saveConfigurationExportLayoutDialogController')]);
    portal.controller('ActionsNotificationsSettingsDialogController', ['$scope', '$mdDialog', 'usersService', 'globalDataService', require('./app/controllers/dialogs/actionsNotificationsSettingsDialogController')]);
    portal.controller('ExportPdfDialogController', ['$scope', '$mdDialog', 'globalDataService', 'evDataService', 'evEventService', 'data', require('./app/controllers/dialogs/exportPdfDialogController')]);
    portal.controller('NotificationsController', ['$scope', '$state', '$stateParams', require('./app/controllers/system/notificationsController')]);
    portal.controller('HeaderNotificationsDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/headerNotificationsDialogController')]);
    portal.controller('HelpDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/helpDialogController')]);
    portal.controller('ValidationDialogController', ['$scope', '$mdDialog', 'validationData', require('./app/controllers/dialogs/validationDialogController')]);
    portal.controller('CalculatorDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/calculatorDialogController')]);
    portal.controller('TabsEditorDialogController', ['$scope', '$mdDialog', 'tabs', 'data', require('./app/controllers/dialogs/tabsEditorDialogController')]);
    portal.controller('TextEditorDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/textEditorDialogController')]);
    portal.controller('PortfolioRegisterDialogController', ['$scope', '$mdDialog', 'data', portfolioRegisterDialogController]);

    portal.controller('InputTemplateLayoutViewerDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/inputTemplateLayoutViewerDialogController')]);
    portal.controller('TemplateLayoutManagerController', ['$scope', '$mdDialog', require('./app/controllers/pages/templateLayoutManagerController')]);
    portal.controller('NewLayoutDialogController', ['$scope', '$mdDialog', 'commonDialogsService', 'data', require('./app/controllers/dialogs/newLayoutDialogController')]);
    portal.controller('RenameDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/renameDialogController')]);
    portal.controller('SaveAsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/saveAsDialogController')]);
    portal.controller('LoaderDialogController', ['$scope', '$customDialog', 'data', require('./app/controllers/dialogs/loaderDialogController')]);

    portal.controller('ContextMenuLayoutManagerController', ['$scope', '$mdDialog', require('./app/controllers/contextMenuLayoutManagerController')]);
    portal.controller('ContextMenuConstructorController', ['$scope', '$stateParams', '$state', '$mdDialog', require('./app/controllers/contextMenuConstructorController')]);
    portal.controller('ContextMenuOptionSettingsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/contextMenuOptionSettingsDialogController')]);
    portal.directive('contextMenuConstructorOption', [require('./app/directives/contextMenuConstructorOptionDirective')]);


    portal.controller('InstrumentSelectDatabaseDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/instrumentSelectDatabaseDialogController')]);
    portal.controller('UnifiedSelectDatabaseDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/unifiedSelectDatabaseDialogController')]);


    portal.controller('EcosystemDefaultSettingsController', ['$scope', '$mdDialog', 'usersService', require('./app/controllers/pages/ecosystemDefaultSettingsController')]);

    // Dialog selectors
    portal.controller('ItemsSelectorWithGroupsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/selectors/itemsSelectorWithGroupsDialogController')]);

    // Common - unknown
    portal.controller('NumberFormatSettingsDialogController', ['$scope', '$element', '$mdDialog', 'data', require('./app/controllers/dialogs/numberFormatSettingsDialogController')]);
    // Victor 20210601 #115 new design for number format dialog
    // portal.controller('NumberFormatDialogController', ['$scope', '$element', '$mdDialog', 'data', require('./app/controllers/dialogs/numberFormatDialogController')]);
    portal.controller('ReportViewerMatrixSettingsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/reportViewerMatrixSettingsDialogController')]);
    portal.controller('EnterUserCodeDialogController', ['$scope', '$mdDialog', 'data', enterUserCodeDialogController]);

    portal.controller('FillPriceManuallyInstrumentDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/fillPriceManuallyInstrumentDialogController')]);
    portal.controller('FloatCustomFieldConstructorController', ['$scope', require('./app/controllers/floatCustomFieldConstructorController')]);
    portal.controller('DateCustomFieldConstructorController', ['$scope', require('./app/controllers/dateCustomFieldConstructorController')]);
    portal.controller('AuditController', ['$scope', require('./app/controllers/system/auditController')]);
    portal.controller('SettingsFormDesignController', ['$scope', '$state', require('./app/controllers/settings/settingsFormDesignController')]);
    portal.controller('SettingBloombergImportInstrumentController', ['$scope', '$state', require('./app/controllers/settings/settingBloombergImportInstrumentController')]);

    portal.controller('ClassifierImportDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/classifierImportDialogController')]);
    portal.controller('ClassifierExportDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/classifierExportDialogController')]);
    portal.controller('LayoutExportDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/layoutExportDialogController')]);
    portal.controller('FileReportsController', ['$scope', '$mdDialog', require('./app/controllers/pages/fileReportsController')]);
    /* Use 'app.authentication' state instead
    portal.controller('LoginDialogController', ['$scope', '$mdDialog', 'authorizerService', 'data', require('./app/controllers/dialogs/loginDialogController')]);
    */
    portal.controller('HealthcheckController', ['$scope', require('./app/controllers/pages/healthcheckController')]);

    portal.controller('TwoFactorLoginDialogController', ['$scope', '$mdDialog', 'username', 'password', require('./app/controllers/dialogs/twoFactorLoginDialogController')]);

    // System Dialogs

    // portal.controller('WarningDialogController', ['$scope', '$mdDialog', 'warning', require('./app/controllers/dialogs/warningDialogController')]);
    portal.controller('SuccessDialogController', ['$scope', '$mdDialog', 'success', require('./app/controllers/dialogs/successDialogController')]);
    portal.controller('InfoDialogController', ['$scope', '$mdDialog', 'info', require('./app/controllers/dialogs/infoDialogController')]);
    portal.controller('FilePreviewDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/filePreviewDialogController')]);
    portal.controller('FileEditDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/fileEditDialogController')]);
    portal.controller('SystemErrorLogDialogController', ['$scope', '$mdDialog', 'globalDataService', 'data', require('./app/controllers/dialogs/systemErrorLogDialogController')]);
    portal.controller('LogDialogController', ['$scope', '$mdDialog', 'globalDataService', 'data', require('./app/controllers/dialogs/logDialogController')]);
    portal.controller('HistoryDialogController', ['$scope', '$mdDialog', 'globalDataService', 'data', require('./app/controllers/dialogs/historyDialogController')]);

    // Actions

    portal.controller('ActionsController', ['$scope', '$mdDialog', require('./app/controllers/actionsController')]);
    portal.controller('FillPriceHistoryDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/fillPriceHistoryDialogController')]);
    portal.controller('EventScheduleConfigDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/eventScheduleConfigDialogController')]);
    portal.controller('PriceDownloadSchemeAddDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/priceDownloadSchemeAddDialogController')]);
    portal.controller('DefaultPricingConfigDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/defaultPricingConfigDialogController')]);

    // Instrument Download

    portal.controller('InstrumentDownloadDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/instrument-download/instrumentDownloadDialogController')]);
    portal.controller('InstrumentDownloadSchemeAddDialogController', ['$scope', '$mdDialog', 'importSchemesMethodsService', require('./app/controllers/dialogs/instrument-download/instrumentDownloadSchemeAddDialogController')]);
    portal.controller('InstrumentDownloadSchemeEditDialogController', ['$scope', '$mdDialog', 'schemeId', 'importSchemesMethodsService', require('./app/controllers/dialogs/instrument-download/instrumentDownloadSchemeEditDialogController')]);

    // Simple Entity Import

    portal.controller('SimpleEntityImportDialogController', ['$scope', '$mdDialog', 'data', 'usersService', require('./app/controllers/dialogs/simple-entity-import/simpleEntityImportDialogController')]);
    portal.controller('SimpleEntityImportErrorsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/simple-entity-import/simpleEntityImportErrorsDialogController')]);
    portal.controller('SimpleEntityImportSchemeEditDialogController', ['$scope', '$mdDialog', 'schemeId', 'importSchemesMethodsService', require('./app/controllers/dialogs/simple-entity-import/simpleEntityImportSchemeEditDialogController')]);
    portal.controller('SimpleEntityImportSchemeCreateDialogController', ['$scope', '$mdDialog', 'data', 'importSchemesMethodsService', require('./app/controllers/dialogs/simple-entity-import/simpleEntityImportSchemeCreateDialogController')]);

    // Complex Import

    portal.controller('ComplexImportDialogController', ['$scope', '$mdDialog', 'data', 'usersService', require('./app/controllers/dialogs/complex-import/complexImportDialogController')]);
    portal.controller('ComplexImportSchemeEditDialogController', ['$scope', '$mdDialog', 'schemeId', require('./app/controllers/dialogs/complex-import/complexImportSchemeEditDialogController')]);
    portal.controller('ComplexImportSchemeCreateDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/complex-import/complexImportSchemeCreateDialogController')]);
    portal.controller('ComplexImportSchemeErrorsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/complex-import/complexImportSchemeErrorsDialogController')]);
    portal.controller('ComplexImportValidationErrorsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/complex-import/complexImportValidationErrorsDialogController')]);

    // Transaction Import

    portal.controller('TransactionImportSchemeAddDialogController', ['$scope', '$mdDialog', 'data', 'importSchemesMethodsService', require('./app/controllers/dialogs/transaction-import/transactionImportSchemeAddDialogController')]);
    portal.controller('TransactionImportSchemeEditDialogController', ['$scope', '$mdDialog', 'schemeId', 'importSchemesMethodsService', require('./app/controllers/dialogs/transaction-import/transactionImportSchemeEditDialogController')]);
    portal.controller('TransactionImportSchemeV2EditDialogController', ['$scope', '$mdDialog', 'schemeId', 'importSchemesMethodsService', require('./app/controllers/dialogs/transaction-import/transactionImportSchemeV2EditDialogController')]);
    portal.controller('TransactionImportSchemeInputsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/transaction-import/transactionImportSchemeInputsDialogController')]);
    portal.controller('TransactionImportDialogController', ['$scope', '$mdDialog', 'data', 'usersService', require('./app/controllers/dialogs/transaction-import/transactionImportDialogController')]);
    portal.controller('TransactionImportErrorsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/transaction-import/transactionImportErrorsDialogController')]);
    portal.controller('TransactionImportSchemeScenarioFieldsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/transaction-import/transactionImportSchemeScenarioFieldsDialogController')]);
    portal.controller('TransactionImportSchemeSelectorValuesDialogController', ['$scope', '$mdDialog', 'commonDialogsService', 'data', require('./app/controllers/dialogs/transaction-import/transactionImportSchemeSelectorValuesDialogController')]);

    //<editor-fold desc="Color palettes">
    portal.controller('ColorPalettesSettingsController', ['$scope', '$mdDialog', 'data', require('./app/controllers/colorPicker/colorPalettesSettingsController')]);
    portal.controller('ColorPalettesSettingsDialogController', ['$scope', '$mdDialog', require('./app/controllers/colorPicker/colorPalettesSettingsDialogController')]);
    portal.controller('TwoInputsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/twoInputsDialogController')]);
    portal.controller('RenameColorDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/renameColorDialogController')]);
    portal.controller('ColorPickerDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/colorPicker/colorPickerDialogController')]);
    portal.controller('SelectColorDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/colorPicker/selectColorDialogController')]);

    portal.directive('colorPicker', ['$mdDialog', require('./app/directives/colorPickerDirective')]);
    //</editor-fold>

    //<editor-fold desc="Events">
    portal.controller('CheckEventsController', ['$scope', '$mdDialog', require('./app/controllers/checkEventsController')]);
    portal.controller('CheckEventsDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/events/checkEventsDialogController')]);
    portal.controller('EventWithReactDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/events/eventWithReactDialogController')]);
    portal.controller('EventWithReactApplyDefaultConfirmDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/events/eventWithReactApplyDefaultConfirmDialogController')]);
    portal.controller('EventDoNotReactDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/events/eventDoNotReactDialogController')]);
    portal.controller('EventApplyDefaultDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/events/eventApplyDefaultDialogController')]);
    //</editor-fold>

    // Attribute Manager

    portal.controller('AttributesManagerController', ['$scope', '$state', '$stateParams', '$mdDialog', require('./app/controllers/attributesManagerController')]);
    portal.controller('AttributesManagerDialogController', ['$scope', '$state', 'data', '$mdDialog', require('./app/controllers/dialogs/attributesManagerDialogController')]);
    portal.controller('AttributesManagerEditDialogController', ['$scope', '$mdDialog', 'usersService', 'usersGroupService', 'data', require('./app/controllers/dialogs/attributesManagerEditDialogController')]);
    portal.controller('AttributesManagerAddDialogController', ['$scope', '$mdDialog', 'usersService', 'usersGroupService', 'data', require('./app/controllers/dialogs/attributesManagerAddDialogController')]);
    portal.controller('ClassificationEditorDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/classificationEditorDialogController')]);
    portal.controller('CustomFieldsConfigDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/customFieldsConfigDialogController')]);

    portal.controller('EntityTypeMappingDialogController', ['$scope', '$mdDialog', 'mapItem', require('./app/controllers/dialogs/entityTypeMappingDialogController')]);
    portal.controller('EntityTypeClassifierMappingDialogController', ['$scope', '$mdDialog', 'options', require('./app/controllers/dialogs/entityTypeClassifierMappingDialogController')]);

    // Entity Viewer & Report Viewer

    portal.controller('EntityViewerController', ['$scope', '$mdDialog', '$state', '$transitions', '$urlService', '$customDialog', '$bigDrawer', 'middlewareService', 'globalDataService', 'toastNotificationService', require('./app/controllers/entityViewer/entityViewerController')]);
    portal.controller('ReportViewerController', ['$scope', '$mdDialog', '$stateParams', '$transitions', 'toastNotificationService', 'middlewareService', 'globalDataService', require('./app/controllers/entityViewer/reportViewerController')]);
    portal.controller('SplitPanelReportViewerController', ['$scope', '$mdDialog', '$transitions', 'globalDataService', 'parentEntityViewerDataService', 'parentEntityViewerEventService', 'splitPanelExchangeService', require('./app/controllers/entityViewer/splitPanelReportViewerController')]);
    portal.controller('ReconciliationViewerController', ['$scope', '$mdDialog', '$transitions', 'parentEntityViewerDataService', 'parentEntityViewerEventService', 'splitPanelExchangeService', require('./app/controllers/entityViewer/reconciliationViewerController')]);
    portal.controller('EntityViewerAddDialogController', ['$scope', '$mdDialog', '$bigDrawer', '$state', 'authorizerService', 'usersService', 'usersGroupService', 'globalDataService', 'entityType', 'entity', 'data', require('./app/controllers/entityViewer/entityViewerAddDialogController')]);
    portal.controller('EntityViewerEditDialogController', ['$scope', '$mdDialog', '$bigDrawer', '$state', 'authorizerService', 'usersService', 'usersGroupService', 'entityType', 'entityId', 'data', require('./app/controllers/entityViewer/entityViewerEditDialogController')]);
    portal.controller('EntityViewerDeleteDialogController', ['$scope', '$mdDialog', 'entity', 'entityType', require('./app/controllers/entityViewer/entityViewerDeleteDialogController')]);
    portal.controller('EntityViewerDeleteBulkDialogController', ['$scope', '$mdDialog', 'evDataService', 'evEventService', 'data', require('./app/controllers/entityViewer/entityViewerDeleteBulkDialogController')]);
    portal.controller('EntityViewerRestoreDeletedBulkDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/entityViewer/entityViewerRestoreDeletedBulkDialogController')]);
    portal.controller('EvAddEditValidationDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/evAddEditValidationDialogController')]);

    portal.controller('EntityViewerPermissionEditorController', ['$scope', '$mdDialog', '$transitions', 'parentEntityViewerDataService', 'parentEntityViewerEventService', 'usersService', 'usersGroupService', require('./app/controllers/entityViewer/entityViewerPermissionEditorController')]);

    portal.controller('PriceHistoryErrorEditDialogController', ['$scope', '$mdDialog', '$state', 'entityId', require('./app/controllers/entityViewer/priceHistoryErrorEditDialogController')]);
    portal.controller('CurrencyHistoryErrorEditDialogController', ['$scope', '$mdDialog', '$state', 'entityId', require('./app/controllers/entityViewer/currencyHistoryErrorEditDialogController')]);

    portal.controller('ListLayoutExportDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/listLayoutExportDialogController')]);

    portal.controller('AceEditorPageController', ['$scope', '$state', '$mdDialog', require('./app/controllers/aceEditorPageController')]);


    // Instrument Type

    portal.controller(
        'InstrumentTypeAddDialogController',
        [
            '$scope', '$mdDialog', '$bigDrawer', '$state', 'authorizerService', 'usersService', 'usersGroupService', 'entityType', 'entity', 'data',
            require('./app/controllers/entityViewer/instrumentTypeAddDialogController')
        ]
    );
    portal.controller(
        'InstrumentTypeEditDialogController',
        [
            '$scope', '$mdDialog', '$bigDrawer', '$state', 'authorizerService', 'usersService', 'usersGroupService', 'entityType', 'entityId', 'data',
            require('./app/controllers/entityViewer/instrumentTypeEditDialogController')
        ]
    );

    // Transaction type form

    portal.controller(
        'TransactionTypeAddDialogController',
        [
            '$scope', '$mdDialog', '$bigDrawer', '$state', 'entityType', 'entity', 'data', 'usersService', 'usersGroupService',
            require('./app/controllers/entityViewer/transactionTypeAddDialogController')
        ]
    );
    portal.controller(
        'TransactionTypeEditDialogController',
        [
            '$scope', '$mdDialog', '$bigDrawer', '$state', 'usersService', 'usersGroupService', 'entityType', 'entityId', 'data',
            require('./app/controllers/entityViewer/transactionTypeEditDialogController')
        ]
    );
    portal.controller('TransactionTypeValidationErrorsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/entityViewer/transactionTypeValidationErrorsDialogController')]);
    portal.controller('TransactionTypeAddInputDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/transactionTypeAddInputDialogController')]);

    // Complex transaction form

    portal.controller('ComplexTransactionAddDialogController', ['$scope', '$mdDialog', '$bigDrawer', '$state', 'usersService', 'usersGroupService', 'globalDataService', 'entityType', 'entity', 'data', require('./app/controllers/entityViewer/complexTransactionAddDialogController')]);
    portal.controller('ComplexTransactionEditDialogController', ['$scope', '$mdDialog', '$bigDrawer', '$state', 'usersService', 'usersGroupService', 'globalDataService', 'entityType', 'entityId', 'data', require('./app/controllers/entityViewer/complexTransactionEditDialogController')]);
    portal.controller('complexTransactionViewDialogController', ['$scope', '$mdDialog', '$bigDrawer', '$state', 'usersService', 'usersGroupService', 'globalDataService', 'entityType', 'entityId', 'data', require('./app/controllers/entityViewer/complexTransactionViewDialogController')]);
    portal.controller('BookTransactionTransactionsTabController', ['$scope', '$mdDialog', require('./app/controllers/tabs/complex-transaction/bookTransactionTransactionsTabController')]);
    portal.controller('ComplexTransactionsTransactionEditDialogController', ['$scope', '$mdDialog', 'entityId', require('./app/controllers/entityViewer/complexTransactionsTransactionEditDialogController')]);
    portal.controller('BookUniquenessWarningDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/bookUniquenessWarningDialogController')]);


    // Instrument form - tabs

    portal.controller('AccrualCalculationSchedulesController', ['$scope', '$mdDialog', 'gridTableHelperService', 'multitypeFieldService', require('./app/controllers/tabs/instrument/accrualCalculationSchedulesController')]);
    portal.controller('EventSchedulesTabController', ['$scope', '$mdDialog', 'gridTableHelperService', require('./app/controllers/tabs/instrument/eventSchedulesTabController')]);
    // portal.controller('PricingPoliciesTabController', ['$scope', '$mdDialog', require('./app/controllers/tabs/instrument/pricingPoliciesTabController')]);
    portal.controller('InstrumentPricingTabController', ['$scope', '$mdDialog', require('./app/controllers/tabs/instrument/instrumentPricingTabController')]);
    portal.controller('InstrumentTypePricingTabController', ['$scope', '$mdDialog', instrumentTypePricingTabController]);
    portal.controller('FactorScheduleTabController', ['$scope', require('./app/controllers/tabs/instrument/factorScheduleTabController')]);
    portal.controller('ManualPricingFormulasTabController', ['$scope', require('./app/controllers/tabs/instrument/manualPricingFormulasTabController')]);

    // Instrument type form - tabs

    portal.controller('InstrumentTypeEventSchedulesTabController', ['$scope', '$mdDialog', 'multitypeFieldService', require('./app/controllers/tabs/instrument-type/instrumentTypeEventSchedulesTabController')]);
    portal.controller('InstrumentTypeAccrualsTabController', ['$scope', '$mdDialog', 'multitypeFieldService', require('./app/controllers/tabs/instrument-type/instrumentTypeAccrualsTabController')]);
    portal.controller('InstrumentTypeUserAttributesTabController', ['$scope', '$mdDialog', require('./app/controllers/tabs/instrument-type/instrumentTypeUserAttributesTabController')]);
    portal.controller('InstrumentTypeFactorsTabController', ['$scope', '$mdDialog', 'multitypeFieldService', 'gridTableHelperService', require('./app/controllers/tabs/instrument-type/instrumentTypeFactorsTabController')]);

    // Currency form - tabs

    portal.controller('InstrumentEventActionsDialogController', ['$scope', '$mdDialog', 'eventActions', require('./app/controllers/dialogs/instrumentEventActionsDialogController')]);
    portal.controller('GenerateEventScheduleDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/generateEventScheduleDialogController')]);

    portal.controller('CalculatePortfolioRegisterRecordsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/calculatePortfolioRegisterRecordsDialogController')]);

    // Portfolio form - tabs
    portal.controller('PortfolioPerformanceTabController', ['$scope', '$state', '$mdDialog', 'commonDialogsService', 'toastNotificationService', portfolioPerformanceTabController]);

    // Data

    portal.controller('DataPortfolioController', ['$scope', require('./app/controllers/data/dataPortfolioController')]);
    portal.controller('DataPortfolioRegisterController', ['$scope', require('./app/controllers/data/dataPortfolioRegisterController')]);
    portal.controller('DataPortfolioRegisterRecordController', ['$scope', require('./app/controllers/data/dataPortfolioRegisterRecordController')]);
    portal.controller('DataAccountController', ['$scope', '$stateParams', require('./app/controllers/data/dataAccountController')]);
    portal.controller('DataAccountTypeController', ['$scope', '$stateParams', require('./app/controllers/data/dataAccountTypeController')]);
    portal.controller('DataCounterpartyController', ['$scope', '$stateParams', require('./app/controllers/data/dataCounterpartyController')]);
    portal.controller('DataCounterpartyGroupController', ['$scope', '$stateParams', require('./app/controllers/data/dataCounterpartyGroupController')]);
    portal.controller('DataResponsibleController', ['$scope', '$stateParams', require('./app/controllers/data/dataResponsibleController')]);
    portal.controller('DataResponsibleGroupController', ['$scope', '$stateParams', require('./app/controllers/data/dataResponsibleGroupController')]);
    portal.controller('DataInstrumentController', ['$scope', '$stateParams', require('./app/controllers/data/dataInstrumentController')]);
    portal.controller('DataGeneratedEventController', ['$scope', '$stateParams', require('./app/controllers/data/dataGeneratedEventController')]);
    portal.controller('DataInstrumentTypeController', ['$scope', '$stateParams', require('./app/controllers/data/dataInstrumentTypeController')]);
    portal.controller('DataPricingPolicyController', ['$scope', '$stateParams', require('./app/controllers/data/dataPricingPolicyController')]);
    portal.controller('DataTransactionController', ['$scope', '$stateParams', require('./app/controllers/data/dataTransactionController')]);
    portal.controller('DataComplexTransactionController', ['$scope', '$stateParams', require('./app/controllers/data/dataComplexTransactionController')]);
    portal.controller('DataTransactionTypeController', ['$scope', '$stateParams', require('./app/controllers/data/dataTransactionTypeController')]);
    portal.controller('DataTransactionTypeGroupController', ['$scope', '$stateParams', require('./app/controllers/data/dataTransactionTypeGroupController')]);
    portal.controller('DataPriceHistoryController', ['$scope', '$stateParams', require('./app/controllers/data/dataPriceHistoryController')]);
    portal.controller('DataCurrencyHistoryController', ['$scope', '$stateParams', require('./app/controllers/data/dataCurrencyHistoryController')]);
    portal.controller('DataCurrencyController', ['$scope', '$stateParams', require('./app/controllers/data/dataCurrencyController')]);
    portal.controller('DataStrategyController', ['$scope', '$stateParams', require('./app/controllers/data/dataStrategyController')]);
    portal.controller('DataStrategyGroupController', ['$scope', '$stateParams', require('./app/controllers/data/dataStrategyGroupController')]);
    portal.controller('DataStrategySubgroupController', ['$scope', '$stateParams', require('./app/controllers/data/dataStrategySubGroupController')]);
    portal.controller('TransactionsAuditController', ['$scope', '$stateParams', require('./app/controllers/system/auditTransactionsController')]);
    portal.controller('InstrumentsAuditController', ['$scope', '$stateParams', require('./app/controllers/system/auditInstrumentsController')]);
    portal.controller('DataCurrencyHistoryErrorController', ['$scope', '$stateParams', require('./app/controllers/data/dataCurrencyHistoryErrorController')]);
    portal.controller('DataPriceHistoryErrorController', ['$scope', '$stateParams', require('./app/controllers/data/dataPriceHistoryErrorController')]);


    // Reports

    portal.controller('BalanceReportController', ['$scope', '$stateParams', require('./app/controllers/reports/balanceReportController')]);
    portal.controller('ProfitAndLostReportController', ['$scope', '$stateParams', require('./app/controllers/reports/profitAndLostReportController')]);
    portal.controller('TransactionReportController', ['$scope', '$stateParams', require('./app/controllers/reports/transactionReportController')]);
    portal.controller('CashFlowProjectionReportController', ['$scope', '$stateParams', require('./app/controllers/reports/cashFlowProjectionReportController')]);
    portal.controller('PerformanceReportController', ['$scope', '$stateParams', require('./app/controllers/reports/performanceReportController')]);

    portal.controller('CustomFieldDialogController', ['$scope', '$mdDialog', 'attributeDataService', 'entityViewerEventService', 'data', require('./app/controllers/dialogs/customFieldDialogController')]);
    portal.controller('CustomFieldController', ['$scope', '$stateParams', '$mdDialog', require('./app/controllers/reports/customFieldController')]);
    portal.controller('CustomFieldAddDialogController', ['$scope', '$mdDialog', 'data', 'attributeDataService', require('./app/controllers/dialogs/customFieldAddDialogController')]);
    portal.controller('CustomFieldEditDialogController', ['$scope', '$mdDialog', 'data', 'attributeDataService', require('./app/controllers/dialogs/customFieldEditDialogController')]);

    portal.controller('ManualSortingSettingsDialogController', ['$scope', '$mdDialog', 'data', 'entityViewerDataService', require('./app/controllers/dialogs/manualSortingSettingsDialogController')]);
    portal.controller('ManualSortingLayoutManagerDialogController', ['$scope', '$mdDialog', 'data', 'entityViewerDataService', require('./app/controllers/dialogs/manualSortingLayoutManagerDialogController')]);
    portal.controller('ManualSortingLayoutManagerController', ['$scope', '$mdDialog', require('./app/controllers/manualSortingLayoutManagerController')]);

    // Reports Missing Prices

    portal.controller('ReportPriceCheckerDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/report-missing-prices/reportPriceCheckerDialogController')]);
    portal.controller('ViewMissingPriceHistoryDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/report-missing-prices/viewMissingPriceHistoryDialogController')]);
    portal.controller('ViewMissingFxRatesDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/report-missing-prices/viewMissingFxRatesDialogController')]);
    portal.controller('ViewMissingHistoricalFxRatesDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/report-missing-prices/viewMissingHistoricalFxRatesDialogController')]);
    portal.controller('ViewMissingPriceHistoryViewPositionsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/report-missing-prices/viewMissingPriceHistoryViewPositionsDialogController')]);
    portal.controller('ViewMissingCustomFieldsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/report-missing-prices/viewMissingCustomFieldsDialogController')]);


    // Settings

    portal.controller('SettingsGeneralController', ['$scope', '$state', require('./app/controllers/settings/settingsGeneralController')]);
    portal.controller('SettingsGeneralProfileController', ['$scope', 'usersService', 'globalDataService', require('./app/controllers/settings/general/settingsGeneralProfileController')]);
    portal.controller('SettingsGeneralInterfaceAccessController', ['$scope', '$state', 'usersService', 'globalDataService', require('./app/controllers/settings/general/settingsGeneralInterfaceAccessController')]);
    portal.controller('SettingsGeneralTransactionFieldController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralTransactionFieldController')]);
    portal.controller('SettingsGeneralInstrumentFieldController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralInstrumentFieldController')]);
    portal.controller('SettingsGeneralChangePasswordController', ['$scope', '$mdDialog', 'authorizerService', require('./app/controllers/settings/general/settingsGeneralChangePasswordController')]);
    portal.controller('SettingsGeneralDataProvidersController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralDataProvidersController')]);
    portal.controller('SettingsPersonalDataProviderController', ['$scope', '$mdDialog', 'provider', require('./app/controllers/settings/settingsPersonalDataProviderController')]);
    portal.controller('SettingsGeneralDataProvidersConfigController', ['$scope', '$stateParams', '$mdDialog', '$state', require('./app/controllers/settings/general/settingsGeneralDataProvidersConfigController')]);
    portal.controller('SettingsGeneralDataProvidersBloombergController', ['$scope', '$stateParams', '$mdDialog', '$state', require('./app/controllers/settings/general/settingsGeneralDataProvidersBloombergController')]);

    // Settings - imports

    portal.controller('SettingsGeneralInstrumentImportController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralInstrumentImportController')]);
    portal.controller('SettingsGeneralComplexImportController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralComplexImportController')]);
    portal.controller('SettingsGeneralTransactionImportController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralTransactionImportController')]);
    portal.controller('SettingsGeneralSimpleEntityImportController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralSimpleEntityImportController')]);

    // Configuration Import

    portal.controller('ConfigurationImportDialogController', ['$scope', '$mdDialog', 'usersService', 'usersGroupService', 'backendConfigurationImportService', 'systemMessageService', 'data', require('./app/controllers/dialogs/configuration-import/configurationImportDialogController')]);
    portal.controller('ConfigurationImportResultDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/configuration-import/configurationImportResultDialogController')]);

    // Configuration Export

    //portal.controller('SettingGeneralConfigurationExportFileDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/settingGeneralConfigurationExportFileDialogController')]);
    portal.controller('SettingsGeneralConfigurationController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralConfigurationController')]);
    portal.controller('SettingsGeneralInitConfigurationController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralInitConfigurationController')]);

    // Settings - Mapping Export/Import

    portal.controller('SettingGeneralMappingPreviewFileDialogController', ['$scope', '$mdDialog', 'file', require('./app/controllers/dialogs/settingGeneralMappingPreviewFileDialogController')]);
    portal.controller('SettingGeneralMappingExportFileDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/settingGeneralMappingExportFileDialogController')]);
    portal.controller('SettingGeneralMappingPreviewFileErrorsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/settingGeneralMappingPreviewFileErrorsDialogController')]);

    // Configuration

    portal.controller('CreateConfigurationDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/createConfigurationDialogController')]);
    portal.controller('EditConfigurationDialogController', ['$scope', '$mdDialog', 'item', require('./app/controllers/dialogs/editConfigurationDialogController')]);

    // Groups & Members

    portal.controller('SettingsMembersAndGroupsController', ['$scope', '$mdDialog', 'authorizerService', 'globalDataService', require('./app/controllers/settings/settingsMembersAndGroupsController')]);
    portal.controller('CreateInviteDialogController', ['$scope', '$mdDialog', 'authorizerService', 'globalDataService', require('./app/controllers/dialogs/createInviteDialogController')]);
    portal.controller('ManageMemberDialogController', ['$scope', '$mdDialog', 'memberId', 'authorizerService', require('./app/controllers/dialogs/manageMemberDialogController')]);
    portal.controller('ManageGroupDialogController', ['$scope', '$mdDialog', 'groupId', require('./app/controllers/dialogs/manageGroupDialogController')]);
    portal.controller('CreateGroupDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/createGroupDialogController')]);

    // Layouts

    portal.controller('UiLayoutListInvitesDialogController', ['$scope', '$mdDialog', 'backendConfigurationImportService', 'options', require('./app/controllers/dialogs/ui/uiLayoutListInvitesDialogController')]);
    portal.controller('UiLayoutListDialogController', ['$scope', '$mdDialog', 'backendConfigurationImportService', 'options', require('./app/controllers/dialogs/ui/uiLayoutListDialogController')]);
    portal.controller('UiShareLayoutDialogController', ['$scope', '$mdDialog', 'options', require('./app/controllers/dialogs/ui/uiShareLayoutDialogController')]);
    portal.controller('UiLayoutSaveAsDialogController', ['$scope', '$mdDialog', 'options', require('./app/controllers/dialogs/ui/uiLayoutSaveAsDialogController')]);
    portal.controller('SelectLayoutDialogController', ['$scope', '$mdDialog', 'options', require('./app/controllers/dialogs/selectLayoutDialogController')]);

    // Bookmarks

    portal.controller('BookmarksWizardDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/bookmarksWizardDialogController')]);
    portal.controller('BookmarksEditSelectedDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/bookmarksEditSelectedDialogController')]);
    portal.controller('BookmarksLayoutSelectDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/bookmarksLayoutSelectDialogController')]);

    portal.component('floatRangeCustomFieldControl', require('./app/components/floatRangeCustomFieldControlComponent'));
    portal.component('dateRangeCustomFieldControl', require('./app/components/dateRangeCustomFieldControlComponent'));

    portal.directive('menuToggle', [require('./app/directives/menuToggleDirective')]);
    portal.directive('menuLink', [require('./app/directives/menuLinkDirective')]);
    portal.directive('sidenavDropdownMenu', [require('./app/directives/sidenavDropdownMenuDirective')]);

    portal.directive('bindFieldControl', ['$mdDialog', require('./app/directives/bindFieldControlDirective')]);
    portal.directive('bindFieldTable', ['$mdDialog', 'gridTableHelperService', 'multitypeFieldService', require('./app/directives/bindFieldTableDirective')]);
    portal.directive('layoutConstructorField', ['$mdDialog', require('./app/directives/layoutConstructorFieldDirective')]);
    // portal.directive('newLayoutConstructorField', ['$mdDialog', require('./app/directives/newLayoutConstructorFieldDirective')]);
    portal.directive('addTabEc', ['$compile', require('./app/directives/addTabEcDirective')]);

    portal.directive('onFinishRender', [require('./app/directives/onFinishRenderDirective')]);

    portal.directive('progressCircular', [require('./app/directives/progressCircularDirective')]);
    portal.directive('progressLinear', [require('./app/directives/progressLinearDirective')]);

    // Pages

    portal.controller('DeveloperPanelController', ['$scope', '$mdDialog', require('./app/controllers/pages/developerPanelController')]);

    portal.controller('SimpleEntityImportController', ['$scope', '$mdDialog', 'usersService', require('./app/controllers/pages/simpleEntityImportController')]);
    portal.controller('UnifiedEntityImportController', ['$scope', '$mdDialog', 'usersService', require('./app/controllers/pages/unifiedEntityImportController')]);
    portal.controller('TransactionImportController', ['$scope', '$mdDialog', 'usersService', 'systemMessageService', require('./app/controllers/pages/transactionImportController')]);
    portal.controller('ComplexImportController', ['$scope', '$mdDialog', 'usersService', require('./app/controllers/pages/complexImportController')]);
    portal.controller('InstrumentDownloadCbondsController', ['$scope', '$mdDialog', require('./app/controllers/pages/instrumentDownloadCbondsController')]);
    portal.controller('InstrumentDownloadController', ['$scope', '$mdDialog', require('./app/controllers/pages/instrumentDownloadController')]);
    portal.controller('FillPriceHistoryController', ['$scope', '$mdDialog', require('./app/controllers/pages/fillPriceHistoryController')]);
    portal.controller('MappingTablesController', ['$scope', '$mdDialog', require('./app/controllers/pages/mappingTablesController')]);
    portal.controller('ProcessesController', ['$scope', '$mdDialog', require('./app/controllers/pages/processesController')]);
    portal.controller('UpdateCenterController', ['$scope', 'authorizerService', 'globalDataService', require('./app/controllers/pages/updateCenterController')]);
    portal.controller('SystemMessagesController', ['$scope', '$mdDialog', 'systemMessageService', require('./app/controllers/pages/systemMessagesController')]);
    portal.controller('UpdateConfigurationPageController', ['$scope', '$state', '$mdDialog', 'usersService', 'usersGroupService', 'backendConfigurationImportService', 'authorizerService', require('./app/controllers/pages/updateConfigurationPageController')]);
    portal.controller('ExplorerPageController', ['$scope', '$state', '$stateParams', '$sce', 'authorizerService', 'globalDataService', '$mdDialog', require('./app/controllers/pages/explorerPageController')]);
    portal.controller('WorkflowsPageController', ['$scope', '$sce', 'authorizerService', 'globalDataService', '$mdDialog', require('./app/controllers/pages/workflowsPageController')]);
    portal.controller('CreateFolderDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/createFolderDialogController')]);
    portal.controller('CreateFileDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/createFileDialogController')]);
    portal.controller('DataStatsPageController', ['$scope', 'authorizerService', 'globalDataService', '$mdDialog', require('./app/controllers/pages/dataStatsPageController')]);
    portal.controller('DataCalendarPageController', ['$scope', 'authorizerService', 'globalDataService', '$mdDialog', 'systemMessageService', require('./app/controllers/pages/dataCalendarPageController')]);
    portal.controller('ErrorPageController', ['$scope', 'authorizerService', 'globalDataService', '$mdDialog', 'systemMessageService', require('./app/controllers/pages/errorPageController')]);

    // Procedures

    portal.controller('PricingProcedurePageController', ['$scope', '$mdDialog', require('./app/controllers/pages/pricingProcedurePageController')]);
    portal.controller('PricingParentProcedurePageController', ['$scope', '$mdDialog', require('./app/controllers/pages/pricingParentProcedurePageController')]);

    portal.controller('PricingProcedureAddDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/procedures/pricingProcedureAddDialogController')]);
    portal.controller('PricingProcedureEditDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/procedures/pricingProcedureEditDialogController')]);
    portal.controller('RunPricingProcedurePageController', ['$scope', '$mdDialog', require('./app/controllers/pages/runPricingProcedurePageController')]);


    portal.controller('DataProcedurePageController', ['$scope', '$mdDialog', require('./app/controllers/pages/dataProcedurePageController')]);
    portal.controller('DataProcedureInstancePageController', ['$scope', '$mdDialog', require('./app/controllers/pages/dataProcedureInstancePageController')]);

    portal.controller('DataProcedureAddDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/procedures/dataProcedureAddDialogController')]);
    portal.controller('DataProcedureEditDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/procedures/dataProcedureEditDialogController')]);

    portal.controller('RunDataProcedurePageController', ['$scope', '$mdDialog', require('./app/controllers/pages/runDataProcedurePageController')]);


    portal.controller('ExpressionProcedurePageController', ['$scope', '$mdDialog', require('./app/controllers/pages/expressionProcedurePageController')]);
    portal.controller('ExpressionProcedureInstancePageController', ['$scope', '$mdDialog', require('./app/controllers/pages/expressionProcedureInstancePageController')]);

    portal.controller('ExpressionProcedureAddDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/procedures/expressionProcedureAddDialogController')]);
    portal.controller('ExpressionProcedureEditDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/procedures/expressionProcedureEditDialogController')]);

    // Pricing


    portal.controller('PricingPolicyPageController', ['$scope', '$mdDialog', require('./app/controllers/pages/pricingPolicyPageController')]);
    portal.controller('PricingSchemePageController', ['$scope', '$mdDialog', require('./app/controllers/pages/pricingSchemePageController')]);
    portal.controller('RunPricingInstrumentDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/pricing/runPricingInstrumentDialogController')]);
    portal.controller('RunPricingCurrencyDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/pricing/runPricingCurrencyDialogController')]);
    portal.controller('SingleInstrumentGenerateEventDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/singleInstrumentGenerateEventDialogController')]);
    portal.controller('SingleInstrumentAddEventToTableDialogController', ['$scope', '$mdDialog', 'gridTableHelperService', 'multitypeFieldService', 'data', require('./app/controllers/dialogs/singleInstrumentAddEventToTableDialogController')]);
    portal.controller('AddRowToTableInsideEvUserTabDialogController', ['$scope', '$mdDialog', 'gridTableHelperService', 'multitypeFieldService', 'data', require('./app/controllers/dialogs/addRowToTableInsideEvUserTabDialogController')]);

    portal.controller('InstrumentEventParameterDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/instrumentEventParameterDialogController')]);
    portal.controller('InstrumentEventActionParameterDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/instrumentEventActionParameterDialogController')]);


    portal.controller('CurrencyPricingSchemeAddDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/pricing/currencyPricingSchemeAddDialogController')]);
    portal.controller('CurrencyPricingSchemeEditDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/pricing/currencyPricingSchemeEditDialogController')]);

    portal.controller('InstrumentPricingSchemeAddDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/pricing/instrumentPricingSchemeAddDialogController')]);
    portal.controller('InstrumentPricingSchemeEditDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/pricing/instrumentPricingSchemeEditDialogController')]);

    portal.controller('PricingPolicyAddDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/pricing/pricingPolicyAddDialogController')]);
    portal.controller('PricingPolicyEditDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/pricing/pricingPolicyEditDialogController')]);


    portal.controller('PricingMultipleParametersDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/pricing/pricingMultipleParametersDialogController')]);


    // Schedules

    portal.controller('SchedulePageController', ['$scope', '$mdDialog', require('./app/controllers/pages/schedulePageController')]);

    portal.controller('ScheduleAddDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/schedules/scheduleAddDialogController')]);
    portal.controller('ScheduleEditDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/schedules/scheduleEditDialogController')]);


    // Reference Table

    portal.controller('ReferenceTablesController', ['$scope', '$mdDialog', require('./app/controllers/pages/referenceTablesController')]);
    portal.controller('ReferenceTableEditDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/referenceTableEditDialogController')]);
    portal.controller('ReferenceTableRenameDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/refereneTableRenameDialogController')]);
    portal.controller('ReferenceTableImportDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/referenceTableImportDialogController')]);
    portal.controller('ReferenceTableExportDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/referenceTableExportDialogController')]);


    portal.controller('FormsDataConstructor', ['$scope', '$mdDialog', require('./app/controllers/pages/formsDataConstructorController')]);
    portal.controller('LayoutsSettingsController', ['$scope', '$mdDialog', '$state', require('./app/controllers/pages/layoutsSettingsController')]);
    portal.controller('InputFormLayoutsSettingsController', ['$scope', '$mdDialog', '$state', require('./app/controllers/pages/inputFormLayoutsSettingsController')]);

    portal.controller('EntitiesCustomAttributesController', ['$scope', '$mdDialog', require('./app/controllers/pages/entitiesCustomAttributesController')]);
    portal.controller('PriceDownloadSchemeController', ['$scope', require('./app/controllers/pages/priceDownloadSchemeController')]);
    portal.controller('TemplateFieldsController', ['$scope', '$mdDialog', require('./app/controllers/pages/templateFieldsController')]);
    portal.controller('EntityTooltipPageController', ['$scope', '$mdDialog', require('./app/controllers/pages/entityTooltipPageController')]);
    portal.controller('CrossEntityAttributeExtensionPageController', ['$scope', '$mdDialog', require('./app/controllers/pages/crossEntityAttributeExtensionPageController')]);
    portal.controller('ImportConfigurationsController', ['$scope', '$mdDialog', 'usersService', 'usersGroupService', 'backendConfigurationImportService', 'systemMessageService', require('./app/controllers/pages/importConfigurationsController')]);
    portal.controller('ExportConfigurationsController', ['$scope', '$mdDialog', 'usersService', require('./app/controllers/pages/exportConfigurationsController')]);

    // Reconciliation

    portal.controller('ReconProcessBankFileDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/reconciliation/reconProcessBankFileDialogController')]);
    portal.controller('ReconMatchDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/reconciliation/reconMatchDialogController')]);
    portal.controller('ReconMatchViewComplexTransactionFieldDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/reconciliation/reconMatchViewComplexTransactionFieldDialogController')]);
    portal.controller('ReconMatchViewFileFieldDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/reconciliation/reconMatchViewFileFieldDialogController')]);
    portal.controller('ReconMatchViewLineDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/reconciliation/reconMatchViewLineDialogController')]);

    portal.controller('ReconciliationMatchEditorController', ['$scope', '$mdDialog', 'parentEntityViewerDataService', 'parentEntityViewerEventService', 'splitPanelExchangeService', require('./app/controllers/entityViewer/reconciliationMatchEditorController')]);


    portal.directive('matchReconCard', ['$mdDialog', require('./app/directives/reconciliation/matchReconCardDirective')]);

    // Controls

    portal.directive('expressionEditorButton', ['$mdDialog', require('./app/controls/expression-editor-button/expression-editor-button')]);
    portal.directive('aceEditorButton', ['$mdDialog', require('./app/controls/ace-editor-button/ace-editor-button')]);
    portal.directive('jsonEditorButton', ['$mdDialog', require('./app/controls/json-editor-button/json-editor-button')]);
    portal.directive('packageManagerButton', ['$mdDialog', require('./app/controls/package-manager-button/package-manager-button')]);
    portal.directive('useFromAboveButton', ['$mdDialog', require('./app/controls/use-from-above-button/use-from-above-button')]);


    //<editor-fold desc="GROUP TABLE">
    portal.directive('groupTable', [require('./app/directives/groupTable/gTableComponent')]);
    portal.directive('groupTableBody', ['usersService', 'globalDataService', 'evRvDomManagerService', require('./app/directives/groupTable/gTableBodyComponent')]);
    /* portal.directive('gSidebarFilter', ['$mdDialog', '$state', require('./app/directives/groupTable/gSidebarFilterComponent')]);
    portal.directive('rvTextFilter', ['$mdDialog', require('./app/directives/reportViewer/userFilters/rvTextFilterDirective')]);
    portal.directive('rvNumberFilter', ['$mdDialog', require('./app/directives/reportViewer/userFilters/rvNumberFilterDirective')]);
    portal.directive('rvDateFilter', ['$mdDialog', require('./app/directives/reportViewer/userFilters/rvDateFilterDirective')]); */

    portal.directive('gFilters', ['$mdDialog', 'gFiltersHelper', require('./app/directives/groupTable/filters/gFiltersDirective')]);
    portal.directive('gEvFilters', ['$mdDialog', '$state', '$bigDrawer', require('./app/directives/groupTable/filters/entityViewer/gEvFiltersDirective')]);
    portal.directive('evFilter', ['gFiltersHelper', require('./app/directives/groupTable/filters/entityViewer/evFilterDirective')]);
    portal.directive('evTextFilter', ['gFiltersHelper', require('./app/directives/groupTable/filters/entityViewer/evTextFilterDirective')]);
    portal.directive('evBooleanFilter', ['gFiltersHelper', require('./app/directives/groupTable/filters/entityViewer/evBooleanFilterDirective')]);
    portal.directive('evNumberFilter', ['gFiltersHelper', require('./app/directives/groupTable/filters/entityViewer/evNumberFilterDirective')]);
    portal.directive('evDateFilter', ['gFiltersHelper', require('./app/directives/groupTable/filters/entityViewer/evDateFilterDirective')]);
    portal.directive('gRvFilters', ['$mdDialog', 'gFiltersHelper', require('./app/directives/groupTable/filters/reportViewer/gRvFiltersDirective')]);
    portal.directive('rvFilter', ['$mdDialog', 'gFiltersHelper', require('./app/directives/groupTable/filters/reportViewer/rvFilterDirective')]);
    portal.directive('rvTextFilter', ['gFiltersHelper', require('./app/directives/groupTable/filters/reportViewer/rvTextFilterDirective')]);
    portal.directive('rvBooleanFilter', ['gFiltersHelper', require('./app/directives/groupTable/filters/reportViewer/rvBooleanFilterDirective')]);
    portal.directive('rvNumberFilter', ['gFiltersHelper', require('./app/directives/groupTable/filters/reportViewer/rvNumberFilterDirective')]);
    portal.directive('rvDateFilter', ['gFiltersHelper', require('./app/directives/groupTable/filters/reportViewer/rvDateFilterDirective')]);
    /* portal.directive('evTextFilter', ['$mdDialog', require('./app/directives/entityViewer/userFilters/evOldTextFilterDirective')]);
    portal.directive('evNumberFilter', ['$mdDialog', require('./app/directives/entityViewer/userFilters/evOldNumberFilterDirective')]);
    portal.directive('evDateFilter', ['$mdDialog', require('./app/directives/entityViewer/userFilters/evOldDateFilterDirective')]); */
    portal.directive('gRowsBulkActions', ['$mdDialog', require('./app/directives/groupTable/gRowsBulkActionsDirective')]);
    portal.directive('gEvRowsBulkActions', ['$mdDialog', require('./app/directives/groupTable/gEvRowsBulkActionsDirective')]);

    portal.directive('groupReportSettings', [require('./app/directives/groupTable/gReportSettingsComponent')]);
    portal.directive('groupGrouping', ['$mdDialog', require('./app/directives/groupTable/gGroupingComponent')]); //2021-12-17 DEPRECATED
    portal.directive('groupColumns', ['$mdDialog', 'usersService', 'globalDataService', 'evRvDomManagerService', require('./app/directives/groupTable/gColumnsComponent')]);
    // portal.directive('groupActionsBlock', ['$mdDialog', '$state', '$bigDrawer', 'usersService', require('./app/directives/groupTable/gActionsBlockComponent')]);
    // portal.directive('groupClipboardHandler', [require('./app/directives/groupTable/gClipboardHandlerComponent')]); // potentially deprecated
    portal.directive('groupColumnResizer', [require('./app/directives/groupTable/gColumnResizerComponent')]);
    portal.directive('groupLayoutResizer', [require('./app/directives/groupTable/gLayoutResizerComponent')]);
    portal.directive('gDialogDraggable', [require('./app/directives/groupTable/gDialogDraggableComponent')]);
    portal.directive('gHeightAligner', [require('./app/directives/groupTable/gHeightAlignerComponent')]);
    portal.directive('groupWidthAligner', [require('./app/directives/groupTable/gWidthAlignerComponent')]);
    portal.directive('groupEditorBinder', ['$templateCache', '$compile', '$controller', '$mdDialog', '$state', require('./app/directives/groupTable/groupEditorBinderComponent')]);
    portal.directive('groupSplitPanelReportBinder', ['$templateCache', '$compile', '$controller', '$mdDialog', '$state', '$transitions', require('./app/directives/groupTable/gSplitPanelReportBinderComponent')]);
    portal.directive('gVerticalSplitPanelReportBinder', ['$templateCache', '$compile', '$controller', '$mdDialog', '$state', '$transitions', require('./app/directives/groupTable/gVerticalSplitPanelReportBinderComponent')]);
    portal.directive('groupPermissionEditorBinder', ['$templateCache', '$compile', '$controller', '$mdDialog', '$state', '$transitions', require('./app/directives/groupTable/gPermissionEditorBinderComponent')]);
    portal.directive('groupReconciliationMatchEditorBinder', ['$templateCache', '$compile', '$controller', '$mdDialog', '$state', '$transitions', require('./app/directives/groupTable/gReconciliationMatchEditorBinderComponent')]);
    // portal.directive('gCAreasDragAndDrop', ['$mdDialog', require('./app/directives/groupTable/gCAreasDragAndDropDirective')]);
    portal.directive('rvGcfAreasDnd', ['$mdDialog', require('./app/directives/groupTable/rvGcfAreasDndDirective')]);
    portal.directive('evGcfAreasDnd', ['$mdDialog', require('./app/directives/groupTable/evGcfAreasDndDirective')]);
    portal.directive('viewConstructorDragAndDrop', ['$mdDialog', require('./app/directives/viewConstructorDragAndDropDirective')]);

    portal.directive('gColumnSettingsButton', ['$mdDialog', require('./app/directives/groupTable/attributeSettingsMenus/gColumnSettingsBtnDirective.js')]);
    portal.directive('gGroupSettingsButton', ['$mdDialog', require('./app/directives/groupTable/attributeSettingsMenus/gGroupSettingsBtnDirective.js')]);
    portal.directive('gFilterSettingsBtn', [require('./app/directives/groupTable/attributeSettingsMenus/gFilterSettingsBtnDirective.js')]);
    portal.directive('contentTitle', ['$timeout', require('./app/directives/contentTitleDirective.js')]);
    portal.directive('valueTitle', ['$timeout', require('./app/directives/valueTitleDirective.js')]);

    portal.directive('gLayoutsManager', ['$mdDialog', '$state', 'usersService', 'globalDataService', 'backendConfigurationImportService', require('./app/directives/groupTable/gLayoutsManagerComponent.js')]);
    portal.directive('dashboardLayoutsManagerComponent', ['$mdDialog', '$state', 'backendConfigurationImportService', require('./app/directives/dashboardLayoutsManagerComponent.js')]);

    portal.controller('GReportSettingsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/gReportSettingsDialogController')]);
    portal.controller('GEntityViewerSettingsDialogController', ['$scope', '$mdDialog', 'entityViewerDataService', 'entityViewerEventService', require('./app/controllers/dialogs/gEntityViewerSettingsDialogController')]);
    portal.controller('PeriodsEditorDialogController', ['$scope', '$mdDialog', 'options', require('./app/controllers/dialogs/periodsEditorDialogController')]);
    portal.controller('DateTreeDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/dateTreeDialogController')]);
    portal.controller('gColumnNumbersRenderingSettingsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/gColumnNumbersRenderingSettingsDialogController')]);

    portal.controller('gModalController', ['$scope', '$mdDialog', 'entityViewerDataService', 'entityViewerEventService', 'attributeDataService', 'contentWrapElement', require('./app/directives/groupTable/gModalComponent')]);
    portal.controller('gModalReportController', ['$scope', '$mdDialog', 'entityViewerDataService', 'entityViewerEventService', 'attributeDataService', 'contentWrapElement', require('./app/directives/groupTable/gModalReportComponent')]);
    portal.controller('gModalReportPnlController', ['$scope', '$mdDialog', 'entityViewerDataService', 'entityViewerEventService', 'attributeDataService', 'contentWrapElement', require('./app/directives/groupTable/gModalReportPnlComponent')]);
    portal.controller('gModalReportTransactionController', ['$scope', '$mdDialog', 'entityViewerDataService', 'entityViewerEventService', 'attributeDataService', 'contentWrapElement', require('./app/directives/groupTable/gModalReportTransactionComponent')]);
    portal.controller('gModalReportPerformanceController', ['$scope', '$mdDialog', 'entityViewerDataService', 'entityViewerEventService', 'attributeDataService', require('./app/directives/groupTable/gModalReportPerformanceComponent')]);
    portal.controller('gModalReportCashFlowProjectionController', ['$scope', '$mdDialog', 'entityViewerDataService', 'entityViewerEventService', 'attributeDataService', require('./app/directives/groupTable/gModalReportCashFlowProjectionComponent')]);

    // New report viewer interface
    portal.directive('gTopPart', ['$mdDialog', '$state', 'usersService', 'globalDataService', require('./app/directives/groupTable/gTopPartDirective')]);

    portal.directive('gEvLeftPanel', ['$mdDialog', '$state', require('./app/directives/groupTable/gEvLeftPanelDirective')]);
    portal.directive('gEvLeftPanelTreeElem', ['$mdDialog', '$state', require('./app/directives/groupTable/gEvLeftPanelTreeElemDirective')]);

    //</editor-fold desc="GROUP TABLE">

    portal.directive('mainHeader', ['$mdDialog', '$state', '$transitions', 'cookieService', 'broadcastChannelService', 'middlewareService', 'authorizerService', 'usersService', 'globalDataService', 'systemMessageService', 'redirectionService', mainHeaderDirective]);
    portal.directive('evFieldResolver', [require('./app/directives/entityViewerFieldResolverDirective')]);
    portal.directive('evSelectorResolver', [require('./app/directives/entityViewerSelectorResolverDirective')]);
    portal.directive('ismFieldResolver', ['$mdDialog', require('./app/directives/instrumentSchemeManagerFieldResolverDirective')]);
    portal.directive('floatNumbers', [require('./app/directives/floatNumbersDirective')]);
    portal.directive('instrumentModalResolver', ['$mdDialog', require('./app/directives/instrumentModalResolverDirective')]);
    portal.directive('commonSelect', [require('./app/directives/commonSelectDirective')]);
    portal.directive('ttypeActionsInputSelect', [require('./app/directives/ttypeActionsInputsSelectDirective')]);
    portal.directive('ttypeActionsRelationsSelect', [require('./app/directives/ttypeActionsRelationsSelectDirective')]);
    portal.directive('entitySearchSelect', ['$mdDialog', require('./app/directives/customInputs/entitySearchSelect')]);
    portal.directive('crudSelect', ['$mdDialog', require('./app/directives/crudSelect')]);
    portal.directive('usercodeInput', ['$mdDialog', 'usersService', require('./app/directives/usercodeInputDirective')]);
    portal.directive('twoFieldsMultiselect', ['$mdDialog', require('./app/directives/twoFieldsMultiselectDirective')]);
    portal.directive('twoFieldsOptions', [require('./app/directives/twoFieldsOptionsDirective')]);
    portal.directive('tableAttributeSelector', ['$mdDialog', require('./app/directives/tableAttributeSelectorDirective')]);
    portal.directive('tableAttributesMenuConstructor', ['$mdDialog', require('./app/directives/tableAttributesMenuConstructorDirective')]);
    portal.directive('expandableItemsSelector', ['$mdDialog', require('./app/directives/expandableItemsSelectorDirective')]);
    portal.directive('instrumentEventActionResolver', ['$mdDialog', require('./app/directives/instrumentEventActionResolverDirective')]);
    portal.directive('classifierModalResolver', ['$mdDialog', require('./app/directives/classifierModalResolverDirective')]);
    portal.directive('zhDatePicker', ['pickmeup', require('./app/directives/zhDatePickerDirective')]);
    portal.directive('complexZhDatepicker', ['$mdDialog', require('./app/directives/customInputs/complexDatepickers/complexZhDatePickerDirective')]);
    portal.directive('complexDatepicker', ['$mdDialog', 'pickmeup', 'toastNotificationService', require('./app/directives/customInputs/complexDatepickers/complexDatepickerDirective')]);
    portal.directive('dateTreeInput', ['$mdDialog', require('./app/directives/dateTreeInputDirective')]);
    portal.directive('dragDialog', [require('./app/directives/dragDialogDirective')]);
    portal.directive('membersGroupsTable', [require('./app/directives/membersGroupsTableDirective')]);
    portal.directive('inputFileDirective', [require('./app/directives/inputFileDirective')]);
    portal.directive('bookmarks', ['$mdDialog', require('./app/directives/bookmarksDirective')]);
    portal.directive('numberFormatMenu', ['$mdDialog', require('./app/directives/numberFormatMenuDirective')]);
    portal.directive('dialogHeader', [dialogHeaderDirective]);
    portal.directive('isDraggableSign', [require('./app/directives/isDraggableSignDirective.js')]);
    portal.directive('dialogWindowResizer', [require('./app/directives/dialogWindowResizerDirective.js')]);
    portal.directive('closeDialogButton', [closeDialogButtonDirective]);

    // portal.directive('popUp', [require('./app/directives/dialogWindowResizerDirective.js')]);
    portal.directive('customPopup', ['$rootScope', '$compile', require('./app/directives/customPopupDirective')]);
    portal.directive('chipsList', ['$filter', require('./app/directives/chipsListDirective')]);
    portal.directive('onRepeatElemInit', [require('./app/directives/onRepeatElemInit')]);

    //<editor-fold desc="Custom inputs"
    portal.directive('baseInput', [baseInputDirective]);
    portal.directive('textInput', ['$mdDialog', require('./app/directives/customInputs/textInputDirective.js')]);
    portal.directive('numberInput', ['$mdDialog', require('./app/directives/customInputs/numberInputDirective.js')]);
    portal.directive('dateInput', [require('./app/directives/customInputs/dateInputDirective.js')]);
    portal.directive('datetimeInput', [require('./app/directives/customInputs/datetimeInputDirective.js')]);
    portal.directive('expressionInput', ['$mdDialog', require('./app/directives/customInputs/expressionInputDirective')]);
    portal.directive('dropdownSelect', ['$mdDialog', require('./app/directives/customInputs/dropdownSelectDirective')]);
    portal.directive('instrumentSelect', ['$mdDialog', require('./app/directives/customInputs/instrumentSelectDirective')]);
    portal.directive('unifiedDataSelect', ['$mdDialog', require('./app/directives/customInputs/unifiedDataSelectDirective')]);
    portal.directive('classifierSelect', ['$mdDialog', require('./app/directives/customInputs/classifierSelectDirective')]);
    portal.directive('multitypeField', [require('./app/directives/customInputs/multitypeFieldDirective')]);
    portal.directive('multiinputField', [multiinputFieldDirective]);
    portal.directive('entityNamesField', [entityNamesFieldDirective]);
    portal.directive('complexDropdownSelect', [complexDropdownSelectDirective]);
    portal.directive('complexDropdownSelectMenu', [complexDropdownSelectMenuDirective]);
    portal.directive('dropdownSelect2', [require('./app/directives/customInputs/dropdownSelect2Directive')]);
    //</editor-fold>

    //<editor-fold desc="Grid Table">
    portal.directive('gridTable', [require('./app/directives/gridTable/gridTableDirective')]);
    portal.directive('gridTableTopPanel', ['gridTableHelperService', require('./app/directives/gridTable/gridTableTopPanelDirective')]);
    portal.directive('gridTableCell', ['$compile', require('./app/directives/gridTable/gridTableCellDirective')]);
    portal.directive('gridTableHeaderCell', [require('./app/directives/gridTable/cells/gridTableHeaderCellDirective')]);
    portal.directive('gridTablePopupCell', ['$compile', '$mdDialog', require('./app/directives/gridTable/cells/gridTablePopupCellDirective')]);
    portal.directive('gridTableMultiselectorCell', ['$mdDialog', require('./app/directives/gridTable/cells/gridTableMultiselectorCellDirective')]);
    //</editor-fold>

    portal.filter('trustAsHtml', ['$sce', require('./app/filters/trustAsHtmlFilter')]);
    portal.filter('trustAsUrl', ['$sce', require('./app/filters/trustAsUrlFilter')]);
    portal.filter('strLimit', ['$filter', require('./app/filters/strLimitFilter')]);
    portal.filter('propsFilter', ['$filter', require('./app/filters/propsFilter')]);

    portal.directive('ngRightClick', ['$parse', function ($parse) {
        return function (scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            element.bind('contextmenu', function (event) {
                scope.$apply(function () {
                    event.preventDefault();
                    fn(scope, {$event: event});
                });
            });
        };
    }]);

    // require('./templates.min.js');

    String.prototype.capitalizeFirstLetter = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };


    window.onerror = function (error) {

        if (!window.system_errors) {
            window.system_errors = []
        }

        window.system_errors.push({
            created: new Date().toISOString(),
            location: window.location.href,
            text: JSON.stringify(error)
        })

    }

    // var currentUrl = location.href;
    // window.addEventListener('hashchange', function() {
    // 	_paq.push(['setReferrerUrl', currentUrl]);
    // 	currentUrl = '/' + window.location.hash.substr(1);
    // 	_paq.push(['setCustomUrl', currentUrl]);
    // 	_paq.push(['setDocumentTitle', document.title]);
    //
    // 	// remove all previously assigned custom variables, requires Matomo (formerly Piwik) 3.0.2
    // 	_paq.push(['deleteCustomVariables', 'page']);
    // 	_paq.push(['trackPageView']);
    //
    // 	// make Matomo aware of newly added content
    // 	var content = document.body;
    // 	_paq.push(['MediaAnalytics::scanForMedia', content]);
    // 	_paq.push(['FormAnalytics::scanForForms', content]);
    // 	_paq.push(['trackContentImpressionsWithinNode', content]);
    // 	_paq.push(['enableLinkTracking']);
    // });


})();