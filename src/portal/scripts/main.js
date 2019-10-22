/**
 * Created by szhitenev on 04.05.2016.
 */
'use strict';

require('../../forum/scripts/main.js');
require('../../profile/scripts/main.js');

var app = angular.module('portal', [
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
    'ui.scroll', // Infinite scroll in Mapping Dialog

    angularDragula(angular), // Drag in Drop in Entity Viewer / Report Viewer/ View Constructor/ Form Editor

    'forum',
    'profile'
]);


app.config(['$stateProvider', '$urlRouterProvider', require('./app/router.js')]);
app.config(['$mdDateLocaleProvider', function ($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function (date) {
        return moment(date).format('YYYY-MM-DD');
    };
}]);

var metaService = require('./app/services/metaService');

app.run(['$rootScope', '$transitions', '$state', function ($rootScope, $transitions, $state) {

    console.log('Project environment: ' + '__PROJECT_ENV__');
    console.log('Project build date: ' + '__BUILD_DATE__');

    document.title = metaService.getCurrentLocation($state);

    if ('__PROJECT_ENV__' === 'development') {

        window.addEventListener('error', function (e) {
            toastr.error(e.error);
        });

    }

    $transitions.onSuccess({}, function (trans) {

        var location = metaService.getCurrentLocation($state);

        var title = 'Finmars';

        if (location !== '') {
            title = title + ' - ' + location;
        }

        document.title = title;

        setTimeout(function () {
            $(window).trigger('resize');
        }, 1000);

    });

}]);

app.factory('pickmeup', ['$window', function ($window) {
    if ($window.pickmeup) {
        return $window.pickmeup;
    }
}]);

// Dashboard

app.factory('d3Service', ['$window', function ($window) {
    if ($window.d3) {
        return $window.d3;
    }
    ;
}]);


app.controller('DashboardLayoutManagerController', ['$scope', '$mdDialog', require('./app/controllers/dashboardLayoutManagerController')]);

app.controller('DashboardConstructorController', ['$scope', '$stateParams', '$state', '$mdDialog', require('./app/controllers/dashboardConstructorController')]);

app.controller('DashboardConstructorControlComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorControlComponentDialogController')]);
app.controller('DashboardConstructorButtonSetComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorButtonSetComponentDialogController')]);
app.controller('DashboardConstructorInputFormComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorInputFormComponentDialogController')]);

app.controller('DashboardConstructorReportViewerComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', 'attributeDataService', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorReportViewerComponentDialogController')]);
app.controller('DashboardConstructorReportViewerSplitPanelComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', 'attributeDataService', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorReportViewerSplitPanelComponentDialogController')]);
app.controller('DashboardConstructorReportViewerGrandTotalComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', 'attributeDataService', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorReportViewerGrandTotalComponentDialogController')]);
app.controller('DashboardConstructorReportViewerMatrixComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', 'attributeDataService', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorReportViewerMatrixComponentDialogController')]);
app.controller('DashboardConstructorReportViewerChartsComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', 'attributeDataService', require('./app/controllers/dialogs/dashboard-constructor/DashboardConstructorReportViewerChartsComponentDialogController')]);

app.controller('DashboardConstructorEntityViewerComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorEntityViewerComponentDialogController')]);
app.controller('DashboardConstructorEntityViewerSplitPanelComponentDialogController', ['$scope', '$mdDialog', 'item', 'dataService', 'eventService', require('./app/controllers/dialogs/dashboard-constructor/dashboardConstructorEntityViewerSplitPanelComponentDialogController')]);


app.directive('dashboardConstructorField', ['$mdDialog', require('./app/directives/dashboardConstructorFieldDirective')]);
app.directive('dashboardConstructorGridAligner', [require('./app/directives/dashboardConstructorGridAlignerDirective')]);

app.controller('DashboardController', ['$scope', '$mdDialog', require('./app/controllers/dashboardController')]);

app.directive('dashboardGridAligner', [require('./app/directives/dashboard/dashboardGridAlignerDirective')]);

app.directive('dashboardButtonSet', [require('./app/directives/dashboard/dashboardButtonSetDirective')]);
app.directive('dashboardControl', [require('./app/directives/dashboard/dashboardControlDirective')]);
app.directive('dashboardEntityViewer', [require('./app/directives/dashboard/dashboardEntityViewerDirective')]);
app.directive('dashboardEntityViewerSplitPanel', [require('./app/directives/dashboard/dashboardEntityViewerSplitPanelDirective')]);
app.directive('dashboardInputForm', [require('./app/directives/dashboard/dashboardInputFormDirective')]);
app.directive('dashboardReportViewer', [require('./app/directives/dashboard/dashboardReportViewerDirective')]);
app.directive('dashboardReportViewerSplitPanel', [require('./app/directives/dashboard/dashboardReportViewerSplitPanelDirective')]);
app.directive('dashboardReportViewerGrandTotal', [require('./app/directives/dashboard/dashboardReportViewerGrandTotalDirective')]);
app.directive('dashboardReportViewerMatrix', [require('./app/directives/dashboard/dashboardReportViewerMatrixDirective')]);
app.directive('dashboardReportViewerCharts', [require('./app/directives/dashboard/dashboardReportViewerChartsDirective')]);

app.controller('DashboardReportViewerController', ['$scope', '$mdDialog', '$transitions', require('./app/controllers/entityViewer/dashboardReportViewerController')]);

app.directive('reportViewerMatrix', ['$mdDialog', require('./app/directives/reportViewerMatrixDirective')]);
app.directive('reportViewerBarsChart', ['d3Service', require('./app/directives/reportViewer/reportViewerBarsChart')]);
app.directive('reportViewerPieChart', ['d3Service', require('./app/directives/reportViewer/reportViewerPieChart')]);


app.controller('DashboardLayoutListDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/dashboardLayoutListDialogController')]);


// Common

app.controller('ShellController', ['$scope', '$state', '$stateParams', '$rootScope', '$mdDialog', '$transitions', require('./app/controllers/shellController')]);
app.controller('BookmarksController', ['$scope', '$mdDialog', '$state', require('./app/controllers/bookmarksController')]);
app.controller('SideNavController', ['$scope', '$mdDialog', '$transitions', require('./app/controllers/sideNavController')]);
app.controller('HomeController', ['$scope', '$mdDialog', require('./app/controllers/homeController')]);
app.controller('SetupController', ['$scope', '$state', require('./app/controllers/setupController')]);
app.controller('NotFoundPageController', ['$scope', require('./app/controllers/notFoundPageController')]);
app.controller('EntityDataConstructorDialogController', ['$scope', 'data', '$stateParams', '$state', '$mdDialog', require('./app/controllers/dialogs/entityDataConstructorDialogController')]);
app.controller('ExpressionEditorDialogController', ['$scope', '$mdDialog', 'item', 'data', require('./app/controllers/dialogs/expressionEditorDialogController')]);
app.controller('UseFromAboveDialogController', ['$scope', '$mdDialog', 'data', 'attributeDataService', require('./app/controllers/dialogs/useFromAboveDialogController')]);
app.controller('InstrumentSelectDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/instrumentSelectDialogController')]);
app.controller('EntitySearchDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/entitySearchDialogController')]);
app.controller('TwoFieldsMultiselectDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/twoFieldsMultiselectDialogController')]);
app.controller('TableAttributeSelectorDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/tableAttributeSelectorDialogController')]);
app.controller('LayoutChangesLossWarningDialogController', ['$scope', 'data', '$mdDialog', require('./app/controllers/dialogs/layoutChangesLossWarningDialogController')]);
app.controller('ClassifierSelectDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/classifierSelectDialogController')]);
app.controller('SaveLayoutDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/saveLayoutDialogController')]);
app.controller('RenameDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/renameDialogController')]);
app.controller('SaveConfigurationExportLayoutDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/saveConfigurationExportLayoutDialogController')]);
app.controller('ActionsNotificationsSettingsDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/actionsNotificationsSettingsDialogController')]);
app.controller('ExportPdfDialogController', ['$scope', '$mdDialog', 'evDataService', 'evEventService', 'data', require('./app/controllers/dialogs/exportPdfDialogController')]);
app.controller('NotificationsController', ['$scope', '$state', '$stateParams', require('./app/controllers/system/notificationsController')]);
app.controller('HeaderNotificationsDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/headerNotificationsDialogController')]);
app.controller('HelpDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/helpDialogController')]);
app.controller('ValidationDialogController', ['$scope', '$mdDialog', 'validationData', require('./app/controllers/dialogs/validationDialogController')]);
app.controller('CalculatorDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/calculatorDialogController')]);


app.controller('EcosystemDefaultSettingsController', ['$scope', '$mdDialog', require('./app/controllers/pages/ecosystemDefaultSettingsController')]);

// Common - unknown
app.controller('NumberFormatSettingsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/numberFormatSettingsDialogController')]);
app.controller('ReportViewerMatrixSettingsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/reportViewerMatrixSettingsDialogController')]);

app.controller('FillPriceManuallyInstrumentDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/fillPriceManuallyInstrumentDialogController')]);
app.controller('EntityViewerPermissionEditorController', ['$scope', require('./app/controllers/entityViewer/entityViewerPermissionEditorController')]);
app.controller('FloatCustomFieldConstructorController', ['$scope', require('./app/controllers/floatCustomFieldConstructorController')]);
app.controller('DateCustomFieldConstructorController', ['$scope', require('./app/controllers/dateCustomFieldConstructorController')]);
app.controller('AuditController', ['$scope', require('./app/controllers/system/auditController')]);
app.controller('SettingsFormDesignController', ['$scope', '$state', require('./app/controllers/settings/settingsFormDesignController')]);
app.controller('SettingBloombergImportInstrumentController', ['$scope', '$state', require('./app/controllers/settings/settingBloombergImportInstrumentController')]);

app.controller('ClassifierImportDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/classifierImportDialogController')]);
app.controller('ClassifierExportDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/classifierExportDialogController')]);


// System Dialogs

app.controller('WarningDialogController', ['$scope', '$mdDialog', 'warning', require('./app/controllers/dialogs/warningDialogController')]);
app.controller('SuccessDialogController', ['$scope', '$mdDialog', 'success', require('./app/controllers/dialogs/successDialogController')]);
app.controller('InfoDialogController', ['$scope', '$mdDialog', 'info', require('./app/controllers/dialogs/infoDialogController')]);

// Actions

app.controller('ActionsController', ['$scope', '$mdDialog', require('./app/controllers/actionsController')]);
app.controller('AutomatedUploadsHistoryDialogController', ['$scope', '$mdDialog', '$mdpTimePicker', require('./app/controllers/dialogs/automatedUploadsHistoryDialogController')]);
app.controller('FillPriceHistoryDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/fillPriceHistoryDialogController')]);
app.controller('EventScheduleConfigDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/eventScheduleConfigDialogController')]);
app.controller('PriceDownloadSchemeAddDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/priceDownloadSchemeAddDialogController')]);
app.controller('DefaultPricingConfigDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/defaultPricingConfigDialogController')]);

// Instrument Download

app.controller('InstrumentDownloadDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/instrument-download/instrumentDownloadDialogController')]);
app.controller('InstrumentDownloadSchemeAddDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/instrument-download/instrumentDownloadSchemeAddDialogController')]);
app.controller('InstrumentDownloadSchemeEditDialogController', ['$scope', '$mdDialog', 'schemeId', require('./app/controllers/dialogs/instrument-download/instrumentDownloadSchemeEditDialogController')]);

// Simple Entity Import

app.controller('SimpleEntityImportDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/simple-entity-import/simpleEntityImportDialogController')]);
app.controller('SimpleEntityImportErrorsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/simple-entity-import/simpleEntityImportErrorsDialogController')]);
app.controller('SimpleEntityImportSchemeEditDialogController', ['$scope', '$mdDialog', 'schemeId', require('./app/controllers/dialogs/simple-entity-import/simpleEntityImportSchemeEditDialogController')]);
app.controller('SimpleEntityImportSchemeCreateDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/simple-entity-import/simpleEntityImportSchemeCreateDialogController')]);

// Complex Import

app.controller('ComplexImportDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/complex-import/complexImportDialogController')]);
app.controller('ComplexImportSchemeEditDialogController', ['$scope', '$mdDialog', 'schemeId', require('./app/controllers/dialogs/complex-import/complexImportSchemeEditDialogController')]);
app.controller('ComplexImportSchemeCreateDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/complex-import/complexImportSchemeCreateDialogController')]);
app.controller('ComplexImportSchemeErrorsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/complex-import/complexImportSchemeErrorsDialogController')]);
app.controller('ComplexImportValidationErrorsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/complex-import/complexImportValidationErrorsDialogController')]);

// Transaction Import

app.controller('TransactionImportSchemeAddDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/transaction-import/transactionImportSchemeAddDialogController')]);
app.controller('TransactionImportSchemeEditDialogController', ['$scope', '$mdDialog', 'schemeId', require('./app/controllers/dialogs/transaction-import/transactionImportSchemeEditDialogController')]);
app.controller('TransactionImportSchemeInputsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/transaction-import/transactionImportSchemeInputsDialogController')]);
app.controller('TransactionImportDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/transaction-import/transactionImportDialogController')]);
app.controller('TransactionImportErrorsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/transaction-import/transactionImportErrorsDialogController')]);

// Events

app.controller('CheckEventsController', ['$scope', '$mdDialog', require('./app/controllers/checkEventsController')]);
app.controller('CheckEventsDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/events/checkEventsDialogController')]);
app.controller('EventWithReactDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/events/eventWithReactDialogController')]);
app.controller('EventWithReactApplyDefaultConfirmDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/events/eventWithReactApplyDefaultConfirmDialogController')]);
app.controller('EventDoNotReactDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/events/eventDoNotReactDialogController')]);
app.controller('EventApplyDefaultDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/events/eventApplyDefaultDialogController')]);

// Attribute Manager

app.controller('AttributesManagerController', ['$scope', '$state', '$stateParams', '$mdDialog', require('./app/controllers/attributesManagerController')]);
app.controller('AttributesManagerEditDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/attributesManagerEditDialogController')]);
app.controller('AttributesManagerAddDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/attributesManagerAddDialogController')]);
app.controller('ClassificationEditorDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/classificationEditorDialogController')]);
app.controller('CustomFieldsConfigDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/customFieldsConfigDialogController')]);

app.controller('EntityTypeMappingDialogController', ['$scope', '$mdDialog', 'mapItem', require('./app/controllers/dialogs/entityTypeMappingDialogController')]);
app.controller('EntityTypeClassifierMappingDialogController', ['$scope', '$mdDialog', 'options', require('./app/controllers/dialogs/entityTypeClassifierMappingDialogController')]);

// Entity Viewer & Report Viewer

app.controller('EntityViewerController', ['$scope', '$mdDialog', '$state', '$transitions', require('./app/controllers/entityViewer/entityViewerController')]);
app.controller('ReportViewerController', ['$scope', '$mdDialog', '$transitions', require('./app/controllers/entityViewer/reportViewerController')]);
app.controller('SplitPanelReportViewerController', ['$scope', '$mdDialog', '$transitions', 'parentEntityViewerDataService', 'parentEntityViewerEventService', 'splitPanelExchangeService', require('./app/controllers/entityViewer/splitPanelReportViewerController')]);
app.controller('EntityViewerAddDialogController', ['$scope', '$mdDialog', '$state', 'entityType', 'entity', require('./app/controllers/entityViewer/entityViewerAddDialogController')]);
app.controller('EntityViewerEditDialogController', ['$scope', '$mdDialog', '$state', 'entityType', 'entityId', require('./app/controllers/entityViewer/entityViewerEditDialogController')]);
app.controller('EntityViewerDeleteDialogController', ['$scope', '$mdDialog', 'entity', 'entityType', require('./app/controllers/entityViewer/entityViewerDeleteDialogController')]);
app.controller('EntityViewerDeleteBulkDialogController', ['$scope', '$mdDialog', 'evDataService', 'evEventService', require('./app/controllers/entityViewer/entityViewerDeleteBulkDialogController')]);

// Transaction type form

app.controller('TransactionTypeAddDialogController', ['$scope', '$mdDialog', '$state', 'entityType', 'entity', require('./app/controllers/entityViewer/transactionTypeAddDialogController')]);
app.controller('TransactionTypeEditDialogController', ['$scope', '$mdDialog', '$state', 'entityType', 'entityId', require('./app/controllers/entityViewer/transactionTypeEditDialogController')]);
app.controller('TransactionTypeValidationErrorsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/entityViewer/transactionTypeValidationErrorsDialogController')]);

// Complex transaction form

app.controller('ComplexTransactionAddDialogController', ['$scope', '$mdDialog', '$state', 'entityType', 'entity', require('./app/controllers/entityViewer/complexTransactionAddDialogController')]);
app.controller('ComplexTransactionEditDialogController', ['$scope', '$mdDialog', '$state', 'entityType', 'entityId', require('./app/controllers/entityViewer/complexTransactionEditDialogController')]);
app.controller('BookTransactionActionsTabController', ['$scope', require('./app/controllers/tabs/complex-transaction/bookTransactionActionsTabController')]);
app.controller('BookTransactionTransactionsTabController', ['$scope', '$mdDialog', require('./app/controllers/tabs/complex-transaction/bookTransactionTransactionsTabController')]);
app.controller('ComplexTransactionsTransactionEditDialogController', ['$scope', '$mdDialog', 'entityId', require('./app/controllers/entityViewer/complexTransactionsTransactionEditDialogController')]);


// Instrument form - tabs

app.controller('AccrualCalculationSchedulesTabController', ['$scope', require('./app/controllers/tabs/instrument/accrualCalculationSchedulesController')]);
app.controller('EventSchedulesTabController', ['$scope', '$mdDialog', require('./app/controllers/tabs/instrument/eventSchedulesController')]);
app.controller('FactorScheduleTabController', ['$scope', require('./app/controllers/tabs/instrument/factorScheduleTabController')]);
app.controller('ManualPricingFormulasTabController', ['$scope', require('./app/controllers/tabs/instrument/manualPricingFormulasTabController')]);

// Currency form - tabs

app.controller('PricingTabController', ['$scope', require('./app/controllers/tabs/currency/pricingTabController')]);


app.controller('InstrumentEventActionsDialogController', ['$scope', '$mdDialog', 'eventActions', require('./app/controllers/dialogs/instrumentEventActionsDialogController')]);
app.controller('GenerateEventScheduleDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/generateEventScheduleDialogController')]);

// Data

app.controller('DataPortfolioController', ['$scope', require('./app/controllers/data/dataPortfolioController')]);
app.controller('DataTagController', ['$scope', '$stateParams', require('./app/controllers/data/dataTagController')]);
app.controller('DataAccountController', ['$scope', '$stateParams', require('./app/controllers/data/dataAccountController')]);
app.controller('DataAccountTypeController', ['$scope', '$stateParams', require('./app/controllers/data/dataAccountTypeController')]);
app.controller('DataCounterpartyController', ['$scope', '$stateParams', require('./app/controllers/data/dataCounterpartyController')]);
app.controller('DataCounterpartyGroupController', ['$scope', '$stateParams', require('./app/controllers/data/dataCounterpartyGroupController')]);
app.controller('DataResponsibleController', ['$scope', '$stateParams', require('./app/controllers/data/dataResponsibleController')]);
app.controller('DataResponsibleGroupController', ['$scope', '$stateParams', require('./app/controllers/data/dataResponsibleGroupController')]);
app.controller('DataInstrumentController', ['$scope', '$stateParams', require('./app/controllers/data/dataInstrumentController')]);
app.controller('DataInstrumentTypeController', ['$scope', '$stateParams', require('./app/controllers/data/dataInstrumentTypeController')]);
app.controller('DataPricingPolicyController', ['$scope', '$stateParams', require('./app/controllers/data/dataPricingPolicyController')]);
app.controller('DataTransactionController', ['$scope', '$stateParams', require('./app/controllers/data/dataTransactionController')]);
app.controller('DataComplexTransactionController', ['$scope', '$stateParams', require('./app/controllers/data/dataComplexTransactionController')]);
app.controller('DataTransactionTypeController', ['$scope', '$stateParams', require('./app/controllers/data/dataTransactionTypeController')]);
app.controller('DataTransactionTypeGroupController', ['$scope', '$stateParams', require('./app/controllers/data/dataTransactionTypeGroupController')]);
app.controller('DataPriceHistoryController', ['$scope', '$stateParams', require('./app/controllers/data/dataPriceHistoryController')]);
app.controller('DataCurrencyHistoryController', ['$scope', '$stateParams', require('./app/controllers/data/dataCurrencyHistoryController')]);
app.controller('DataCurrencyController', ['$scope', '$stateParams', require('./app/controllers/data/dataCurrencyController')]);
app.controller('DataStrategyController', ['$scope', '$stateParams', require('./app/controllers/data/dataStrategyController')]);
app.controller('DataStrategyGroupController', ['$scope', '$stateParams', require('./app/controllers/data/dataStrategyGroupController')]);
app.controller('DataStrategySubgroupController', ['$scope', '$stateParams', require('./app/controllers/data/dataStrategySubGroupController')]);
app.controller('TransactionsAuditController', ['$scope', '$stateParams', require('./app/controllers/system/auditTransactionsController')]);
app.controller('InstrumentsAuditController', ['$scope', '$stateParams', require('./app/controllers/system/auditInstrumentsController')]);

// Reports

app.controller('BalanceReportController', ['$scope', '$stateParams', require('./app/controllers/reports/balanceReportController')]);
app.controller('ProfitAndLostReportController', ['$scope', '$stateParams', require('./app/controllers/reports/profitAndLostReportController')]);
app.controller('TransactionReportController', ['$scope', '$stateParams', require('./app/controllers/reports/transactionReportController')]);
app.controller('CashFlowProjectionReportController', ['$scope', '$stateParams', require('./app/controllers/reports/cashFlowProjectionReportController')]);
app.controller('PerformanceReportController', ['$scope', '$stateParams', require('./app/controllers/reports/performanceReportController')]);

app.controller('CustomFieldDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/customFieldDialogController')]);
app.controller('CustomFieldController', ['$scope', '$stateParams', '$mdDialog', require('./app/controllers/reports/customFieldController')]);
app.controller('CustomFieldAddDialogController', ['$scope', '$mdDialog', 'data', 'attributeDataService', require('./app/controllers/dialogs/customFieldAddDialogController')]);
app.controller('CustomFieldEditDialogController', ['$scope', '$mdDialog', 'data', 'attributeDataService',  require('./app/controllers/dialogs/customFieldEditDialogController')]);


// Settings

app.controller('SettingsGeneralController', ['$scope', '$state', require('./app/controllers/settings/settingsGeneralController')]);
app.controller('SettingsGeneralProfileController', ['$scope', require('./app/controllers/settings/general/settingsGeneralProfileController')]);
app.controller('SettingsGeneralInterfaceAccessController', ['$scope', '$state', require('./app/controllers/settings/general/settingsGeneralInterfaceAccessController')]);
app.controller('SettingsGeneralTransactionFieldController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralTransactionFieldController')]);
app.controller('SettingsGeneralInstrumentFieldController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralInstrumentFieldController')]);
app.controller('SettingsGeneralChangePasswordController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralChangePasswordController')]);
app.controller('SettingsGeneralDataProvidersController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralDataProvidersController')]);
app.controller('SettingsGeneralDataProvidersConfigController', ['$scope', '$stateParams', '$mdDialog', '$state', require('./app/controllers/settings/general/settingsGeneralDataProvidersConfigController')]);

// Settings - imports

app.controller('SettingsGeneralInstrumentImportController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralInstrumentImportController')]);
app.controller('SettingsGeneralComplexImportController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralComplexImportController')]);
app.controller('SettingsGeneralTransactionImportController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralTransactionImportController')]);
app.controller('SettingsGeneralSimpleEntityImportController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralSimpleEntityImportController')]);

// Settings - Configuration Export/Import

app.controller('SettingGeneralConfigurationPreviewFileDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/settingGeneralConfigurationPreviewFileDialogController')]);
app.controller('SettingGeneralConfigurationPreviewFileErrorsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/settingGeneralConfigurationPreviewFileErrorsDialogController')]);
//app.controller('SettingGeneralConfigurationExportFileDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/settingGeneralConfigurationExportFileDialogController')]);
app.controller('SettingsGeneralConfigurationController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralConfigurationController')]);
app.controller('SettingsGeneralInitConfigurationController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralInitConfigurationController')]);

// Settings - Mapping Export/Import

app.controller('SettingGeneralMappingPreviewFileDialogController', ['$scope', '$mdDialog', 'file', require('./app/controllers/dialogs/settingGeneralMappingPreviewFileDialogController')]);
app.controller('SettingGeneralMappingExportFileDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/settingGeneralMappingExportFileDialogController')]);
app.controller('SettingGeneralMappingPreviewFileErrorsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/settingGeneralMappingPreviewFileErrorsDialogController')]);

// Configuration

app.controller('CreateConfigurationDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/createConfigurationDialogController')]);
app.controller('EditConfigurationDialogController', ['$scope', '$mdDialog', 'item', require('./app/controllers/dialogs/editConfigurationDialogController')]);

// Groups & Members

app.controller('SettingsMembersAndGroupsController', ['$scope', '$mdDialog', require('./app/controllers/settings/settingsMembersAndGroupsController')]);
app.controller('CreateMemberDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/createMemberDialogController')]);
app.controller('ManageMemberDialogController', ['$scope', '$mdDialog', 'memberId', require('./app/controllers/dialogs/manageMemberDialogController')]);
app.controller('ManageGroupDialogController', ['$scope', '$mdDialog', 'groupId', require('./app/controllers/dialogs/manageGroupDialogController')]);
app.controller('CreateGroupDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/createGroupDialogController')]);

// Layouts

app.controller('UiLayoutListDialogController', ['$scope', '$mdDialog', 'options', require('./app/controllers/dialogs/ui/uiLayoutListDialogController')]);
app.controller('UiLayoutSaveAsDialogController', ['$scope', '$mdDialog', 'options', require('./app/controllers/dialogs/ui/uiLayoutSaveAsDialogController')]);
app.controller('SelectLayoutDialogController', ['$scope', '$mdDialog', 'options', require('./app/controllers/dialogs/selectLayoutDialogController')]);

// Bookmarks

app.controller('BookmarksWizardDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/bookmarksWizardDialogController')]);
app.controller('BookmarksEditSelectedDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/bookmarksEditSelectedDialogController')]);
app.controller('BookmarksLayoutSelectDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/bookmarksLayoutSelectDialogController')]);

app.component('floatRangeCustomFieldControl', require('./app/components/floatRangeCustomFieldControlComponent'));
app.component('dateRangeCustomFieldControl', require('./app/components/dateRangeCustomFieldControlComponent'));
app.component('dashboardEntityViewer', require('./app/components/dashboardEntityViewerComponent'));

app.directive('menuToggle', [require('./app/directives/menuToggleDirective')]);
app.directive('menuLink', [require('./app/directives/menuLinkDirective')]);
app.directive('sidenavDropdownMenu', [require('./app/directives/sidenavDropdownMenuDirective')]);

app.directive('bindFieldControl', ['$mdDialog', require('./app/directives/bindFieldControlDirective')]);
app.directive('layoutConstructorField', [require('./app/directives/layoutConstructorFieldDirective')]);
app.directive('addTabEc', ['$compile', require('./app/directives/addTabEcDirective')]);

app.directive('onFinishRender', [require('./app/directives/onFinishRenderDirective')]);

app.directive('progressCircular', [require('./app/directives/progressCircularDirective')]);

// Pages

app.controller('DeveloperPanelController', ['$scope', '$mdDialog', require('./app/controllers/pages/developerPanelController')]);

app.controller('SimpleEntityImportController', ['$scope', '$mdDialog', require('./app/controllers/pages/simpleEntityImportController')]);
app.controller('TransactionImportController', ['$scope', '$mdDialog', require('./app/controllers/pages/transactionImportController')]);
app.controller('ComplexImportController', ['$scope', '$mdDialog', require('./app/controllers/pages/complexImportController')]);
app.controller('InstrumentDownloadController', ['$scope', '$mdDialog', require('./app/controllers/pages/instrumentDownloadController')]);
app.controller('FillPriceHistoryController', ['$scope', '$mdDialog', require('./app/controllers/pages/fillPriceHistoryController')]);
app.controller('MappingTablesController', ['$scope', '$mdDialog', require('./app/controllers/pages/mappingTablesController')]);
app.controller('ProcessesController', ['$scope', '$mdDialog', require('./app/controllers/pages/processesController')]);


// Reference Table

app.controller('ReferenceTablesController', ['$scope', '$mdDialog', require('./app/controllers/pages/referenceTablesController')]);
app.controller('ReferenceTableEditDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/refereneTableEditDialogController')]);
app.controller('ReferenceTableRenameDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/refereneTableRenameDialogController')]);
app.controller('ReferenceTableImportDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/referenceTableImportDialogController')]);
app.controller('ReferenceTableExportDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/referenceTableExportDialogController')]);


app.controller('FormsDataConstructor', ['$scope', '$mdDialog', require('./app/controllers/pages/formsDataConstructorController')]);
app.controller('LayoutsSettingsController', ['$scope', '$mdDialog', '$state', require('./app/controllers/pages/layoutsSettingsController')]);

app.controller('LayoutsListDialogController', ['$scope', '$mdDialog', '$state', 'data', require('./app/controllers/dialogs/layoutsListDialogController')]);
app.controller('EntitiesCustomAttributesController', ['$scope', '$mdDialog', require('./app/controllers/pages/entitiesCustomAttributesController')]);
app.controller('PriceDownloadSchemeController', ['$scope', require('./app/controllers/pages/priceDownloadSchemeController')]);
app.controller('AutomatedUploadsHistoryController', ['$scope', '$mdDialog', require('./app/controllers/pages/automatedUploadsHistoryController')]);
app.controller('TemplateFieldsController', ['$scope', '$mdDialog', require('./app/controllers/pages/templateFieldsController')]);
app.controller('ImportConfigurationsController', ['$scope', '$mdDialog', require('./app/controllers/pages/importConfigurationsController')]);
app.controller('ExportConfigurationsController', ['$scope', '$mdDialog', require('./app/controllers/pages/exportConfigurationsController')]);

// Controls

app.directive('expressionEditorButton', ['$mdDialog', require('./app/controls/expression-editor-button/expression-editor-button')]);
app.directive('useFromAboveButton', ['$mdDialog', require('./app/controls/use-from-above-button/use-from-above-button')]);

// GROUP TABLE START

app.directive('groupTable', [require('./app/directives/groupTable/gTableComponent')]);
app.directive('groupTableBody', [require('./app/directives/groupTable/gTableBodyComponent')]);
app.directive('groupSidebarFilter', ['$mdDialog', require('./app/directives/groupTable/gSidebarFilterComponent')]);
app.directive('groupDashboardFilter', ['$mdDialog', require('./app/directives/groupTable/gDashboardFilterComponent')]);
app.directive('rvTextFilter', ['$mdDialog', require('./app/directives/reportViewer/userFilters/rvTextFilterDirective')]);
app.directive('rvNumberFilter', ['$mdDialog', require('./app/directives/reportViewer/userFilters/rvNumberFilterDirective')]);
app.directive('rvDateFilter', ['$mdDialog', require('./app/directives/reportViewer/userFilters/rvDateFilterDirective')]);
app.directive('groupReportSettings', [require('./app/directives/groupTable/gReportSettingsComponent')]);
app.directive('evTextFilter', ['$mdDialog', require('./app/directives/entityViewer/userFilters/evTextFilterDirective')]);
app.directive('evNumberFilter', ['$mdDialog', require('./app/directives/entityViewer/userFilters/evNumberFilterDirective')]);
app.directive('evDateFilter', ['$mdDialog', require('./app/directives/entityViewer/userFilters/evDateFilterDirective')]);
app.directive('groupGrouping', ['$mdDialog', require('./app/directives/groupTable/gGroupingComponent')]);
app.directive('groupColumns', ['$mdDialog', require('./app/directives/groupTable/gColumnsComponent')]);
app.directive('groupActionsBlock', ['$mdDialog', '$state', require('./app/directives/groupTable/gActionsBlockComponent')]);
// app.directive('groupClipboardHandler', [require('./app/directives/groupTable/gClipboardHandlerComponent')]); // potentially deprecated
app.directive('groupColumnResizer', [require('./app/directives/groupTable/gColumnResizerComponent')]);
app.directive('groupLayoutResizer', [require('./app/directives/groupTable/gLayoutResizerComponent')]);
app.directive('gDialogDraggable', [require('./app/directives/groupTable/gDialogDraggableComponent')]);
app.directive('groupHeightAligner', [require('./app/directives/groupTable/gHeightAlignerComponent')]);
app.directive('groupEditorBinder', ['$templateCache', '$compile', '$controller', '$mdDialog', '$state', require('./app/directives/groupTable/groupEditorBinderComponent')]);
app.directive('groupSplitPanelReportBinder', ['$templateCache', '$compile', '$controller', '$mdDialog', '$state', '$transitions', require('./app/directives/groupTable/gSplitPanelReportBinderComponent')]);
app.directive('groupingAndColumnAreaDragAndDrop', ['$mdDialog', require('./app/directives/groupTable/gGroupingAndColumnAreaDragAndDrop')]);

app.directive('groupBindReportRow', [require('./app/directives/groupTable/gBindReportRowDirective.js')]);
app.directive('gColumnSettingsButton', ['$mdDialog', require('./app/directives/groupTable/attributeSettingsMenus/gColumnSettingsBtnDirective.js')]);
app.directive('gGroupSettingsButton', ['$mdDialog', require('./app/directives/groupTable/attributeSettingsMenus/gGroupSettingsBtnDirective.js')]);
app.directive('contentTitle', ['$timeout', require('./app/directives/contentTitleDirective.js')]);
app.directive('valueTitle', ['$timeout', require('./app/directives/valueTitleDirective.js')]);

app.controller('GReportSettingsDialogController', ['$scope', '$mdDialog', 'reportOptions', 'options', require('./app/controllers/dialogs/gReportSettingsDialogController')]);
app.controller('GEntityViewerSettingsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/gEntityViewerSettingsDialogController')]);
app.controller('PeriodsEditorDialogController', ['$scope', '$mdDialog', 'options', require('./app/controllers/dialogs/periodsEditorDialogController')]);
app.controller('DateTreeDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/dateTreeDialogController')]);
app.controller('gColumnNumbersRenderingSettingsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/gColumnNumbersRenderingSettingsDialogController')]);

app.controller('gModalController', ['$scope', '$mdDialog', 'entityViewerDataService', 'entityViewerEventService', 'attributeDataService', 'contentWrapElement', require('./app/directives/groupTable/gModalComponent')]);
app.controller('gModalReportController', ['$scope', '$mdDialog', 'entityViewerDataService', 'entityViewerEventService', 'attributeDataService', 'contentWrapElement', require('./app/directives/groupTable/gModalReportComponent')]);
app.controller('gModalReportPnlController', ['$scope', '$mdDialog', 'entityViewerDataService', 'entityViewerEventService', 'attributeDataService', require('./app/directives/groupTable/gModalReportPnlComponent')]);
app.controller('gModalReportTransactionController', ['$scope', '$mdDialog', 'entityViewerDataService', 'entityViewerEventService', 'attributeDataService', require('./app/directives/groupTable/gModalReportTransactionComponent')]);
app.controller('gModalReportPerformanceController', ['$scope', '$mdDialog', 'entityViewerDataService', 'entityViewerEventService', 'attributeDataService', require('./app/directives/groupTable/gModalReportPerformanceComponent')]);
app.controller('gModalReportCashFlowProjectionController', ['$scope', '$mdDialog', 'entityViewerDataService', 'entityViewerEventService', 'attributeDataService', require('./app/directives/groupTable/gModalReportCashFlowProjectionComponent')]);

// GROUP TABLE END


app.directive('evFieldResolver', [require('./app/directives/entityViewerFieldResolverDirective')]);
app.directive('evSelectorResolver', [require('./app/directives/entityViewerSelectorResolverDirective')]);
app.directive('ismFieldResolver', ['$mdDialog', require('./app/directives/instrumentSchemeManagerFieldResolverDirective')]);
app.directive('floatNumbers', [require('./app/directives/floatNumbersDirective')]);
app.directive('instrumentModalResolver', ['$mdDialog', require('./app/directives/instrumentModalResolverDirective')]);
app.directive('commonSelect', [require('./app/directives/commonSelectDirective')]);
app.directive('ttypeActionsInputSelect', [require('./app/directives/ttypeActionsInputsSelectDirective')]);
app.directive('ttypeActionsRelationsSelect', [require('./app/directives/ttypeActionsRelationsSelectDirective')]);
app.directive('entitySearchSelect', ['$mdDialog', require('./app/directives/entitySearchSelect')]);
app.directive('crudSelect', ['$mdDialog', require('./app/directives/crudSelect')]);
app.directive('twoFieldsMultiselect', ['$mdDialog', require('./app/directives/twoFieldsMultiselectDirective')]);
app.directive('twoFieldsOptions', [require('./app/directives/twoFieldsOptionsDirective')]);
app.directive('tableAttributeSelector', ['$mdDialog', require('./app/directives/tableAttributeSelectorDirective')]);
app.directive('instrumentEventActionResolver', ['$mdDialog', require('./app/directives/instrumentEventActionResolverDirective')]);
app.directive('classifierModalResolver', ['$mdDialog', require('./app/directives/classifierModalResolverDirective')]);
app.directive('zhDatePicker', ['pickmeup', require('./app/directives/zhDatePickerDirective')]);
app.directive('complexZhDatePicker', ['$mdDialog', 'pickmeup', require('./app/directives/complexZhDatePickerDirective')]);
app.directive('dateTreeInput', ['$mdDialog', require('./app/directives/dateTreeInputDirective')]);
app.directive('dragDialog', [require('./app/directives/dragDialogDirective')]);
app.directive('membersGroupsTable', [require('./app/directives/membersGroupsTableDirective')]);
app.directive('inputFileDirective', [require('./app/directives/inputFileDirective')]);
app.directive('bookmarks', ['$mdDialog', require('./app/directives/bookmarksDirective')]);

app.directive('postNgRepeat', ['$mdDialog', require('./app/directives/postNgRepeatDirective')]);

app.filter('trustAsHtml', ['$sce', require('./app/filters/trustAsHtmlFilter')]);
app.filter('trustAsUrl', ['$sce', require('./app/filters/trustAsUrlFilter')]);
app.filter('strLimit', ['$filter', require('./app/filters/strLimitFilter')]);
app.filter('propsFilter', ['$filter', require('./app/filters/propsFilter')]);

app.directive('ngRightClick', ['$parse', function ($parse) {
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

require('./templates.min.js');

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};