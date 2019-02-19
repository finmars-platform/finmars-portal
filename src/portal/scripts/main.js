/**
 * Created by szhitenev on 04.05.2016.
 */
'use strict';

require('../../forum/scripts/main.js');
require('../../profile/scripts/main.js');

require('../../core/context-menu/index.js')

var app = angular.module('portal', [
    'ngAria',
    'ngMaterial',
    'ngMessages',
    'ngMdIcons',
    'ngResource',
    'ngSanitize',
    'vAccordion',
    'mdPickers',
    'ui.router',
    'bw.paging',
    'ui.select',
    'ui.scroll',
    'io.dennis.contextmenu',
    angularDragula(angular),

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

    localStorage.setItem('entityIsChanged', false);

    document.title = metaService.getCurrentLocation($state);

    // window.onerror = function (msg, url, line, col, error) {
    //
    //     console.trace(msg);
    //
    //     toastr.error(msg);
    //
    //     return false;
    // };

    window.addEventListener('error', function (e) {
        toastr.error(e.error);
    });

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


app.controller('ShellController', ['$scope', '$state', '$rootScope', '$mdDialog', '$transitions', require('./app/controllers/shellController')]);
app.controller('BookmarksController', ['$scope', '$mdDialog', '$state', require('./app/controllers/bookmarksController')]);
app.controller('SideNavController', ['$scope', '$mdDialog', require('./app/controllers/sideNavController')]);
app.controller('HomeController', ['$scope', '$mdDialog', require('./app/controllers/homeController')]);
app.controller('SetupController', ['$scope', '$state', require('./app/controllers/setupController')]);
app.controller('NotFoundPageController', ['$scope', require('./app/controllers/notFoundPageController')]);

app.controller('DashboardController', ['$scope', '$mdDialog', require('./app/controllers/dashboardController')]);
app.controller('ActionsController', ['$scope', '$mdDialog', require('./app/controllers/actionsController')]);
app.controller('SimpleEntityImportDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/simpleEntityImportDialogController')]);
app.controller('SimpleEntityImportErrorsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/simpleEntityImportErrorsDialogController')]);
app.controller('ImportInstrumentDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/importInstrumentDialogController')]);
app.controller('ImportTransactionDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/importTransactionDialogController')]);
app.controller('ImportTransactionErrorsDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/importTransactionErrorsDialogController')]);
app.controller('AutomatedUploadsHistoryDialogController', ['$scope', '$mdDialog', '$mdpTimePicker', require('./app/controllers/dialogs/automatedUploadsHistoryDialogController')]);
app.controller('FillPriceHistoryDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/fillPriceHistoryDialogController')]);
app.controller('EventScheduleConfigDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/eventScheduleConfigDialogController')]);
app.controller('FillPriceManuallyInstrumentDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/fillPriceManuallyInstrumentDialogController')]);
app.controller('PriceDownloadSchemeAddDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/priceDownloadSchemeAddDialogController')]);


// events start

app.controller('CheckEventsDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/events/checkEventsDialogController')]);
app.controller('EventWithReactDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/events/eventWithReactDialogController')]);
app.controller('EventDoNotReactDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/events/eventDoNotReactDialogController')]);
app.controller('EventApplyDefaultDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/events/eventApplyDefaultDialogController')]);

// events end

app.controller('AttributesManagerController', ['$scope', '$state', '$stateParams', '$mdDialog', require('./app/controllers/attributesManagerController')]);
app.controller('AttributesManagerEditDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/attributesManagerEditDialogController')]);
app.controller('AttributesManagerAddDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/attributesManagerAddDialogController')]);
app.controller('ClassificationEditorDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/classificationEditorDialogController')]);
app.controller('CustomFieldsConfigDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/customFieldsConfigDialogController')]);

app.controller('InstrumentMappingAddDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/instrumentMappingAddDialogController')]);
app.controller('InstrumentMappingEditDialogController', ['$scope', '$mdDialog', 'schemeId', require('./app/controllers/dialogs/instrumentMappingEditDialogController')]);
app.controller('EntityTypeMappingDialogController', ['$scope', '$mdDialog', 'mapItem', require('./app/controllers/dialogs/entityTypeMappingDialogController')]);
app.controller('EntityTypeClassifierMappingDialogController', ['$scope', '$mdDialog', 'options', require('./app/controllers/dialogs/entityTypeClassifierMappingDialogController')]);

app.controller('TransactionMappingAddDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/transactionMappingAddDialogController')]);
app.controller('TransactionMappingEditDialogController', ['$scope', '$mdDialog', 'schemeId', require('./app/controllers/dialogs/transactionMappingEditDialogController')]);
app.controller('TransactionMappingInputMappingDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/transactionMappingInputMappingDialogController')]);

app.controller('SimpleEntityImportSchemeEditDialogController', ['$scope', '$mdDialog', 'schemeId', require('./app/controllers/dialogs/simpleEntityImportSchemeEditDialogController')]);
app.controller('SimpleEntityImportSchemeCreateDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/simpleEntityImportSchemeCreateDialogController')]);

app.controller('EntityViewer2Controller', ['$scope', '$mdDialog', require('./app/controllers/entityViewer/entityViewer2Controller')]);
app.controller('ReportViewerController', ['$scope', '$mdDialog', require('./app/controllers/entityViewer/reportViewerController')]);
app.controller('EntityViewerAddDialogController', ['$scope', '$mdDialog', '$state', 'entityType', 'entity', require('./app/controllers/entityViewer/entityViewerAddDialogController')]);
app.controller('EntityViewerEditDialogController', ['$scope', '$mdDialog', '$state', 'entityType', 'entityId', require('./app/controllers/entityViewer/entityViewerEditDialogController')]);
app.controller('EntityViewerDeleteDialogController', ['$scope', '$mdDialog', 'entity', 'entityType', require('./app/controllers/entityViewer/entityViewerDeleteDialogController')]);
app.controller('ReportWizardController', ['$scope', require('./app/controllers/entityViewer/onBeforeLoadActions/reportWizardController')]);

app.controller('EntityViewerPermissionEditorController', ['$scope', require('./app/controllers/entityViewer/entityViewerPermissionEditorController')]);

app.controller('ComplexTransactionSpecialRulesController', ['$scope', require('./app/controllers/special-rules/complexTransactionSpecialRulesController')]);

app.controller('BookTransactionActionsTabController', ['$scope', require('./app/controllers/tabs/complex-transaction/bookTransactionActionsTabController')]);
app.controller('BookTransactionTransactionsTabController', ['$scope', '$mdDialog', require('./app/controllers/tabs/complex-transaction/bookTransactionTransactionsTabController')]);
app.controller('ComplexTransactionsTransactionEditDialogController', ['$scope', '$mdDialog', 'entityId', require('./app/controllers/entityViewer/complexTransactionsTransactionEditDialogController')]);

app.controller('TransactionTypeActionsTabController', ['$scope', '$mdDialog', require('./app/controllers/tabs/transaction-type/transactionTypeActionsTabController')]);
app.controller('TransactionTypeGeneralTabController', ['$scope', '$mdDialog', require('./app/controllers/tabs/transaction-type/transactionTypeGeneralTabController')]);
app.controller('TransactionTypeInputsTabController', ['$scope', '$mdDialog', require('./app/controllers/tabs/transaction-type/transactionTypeInputsTabController')]);

app.controller('AccrualCalculationSchedulesTabController', ['$scope', require('./app/controllers/tabs/instrument/accrualCalculationSchedulesController')]);
app.controller('EventSchedulesTabController', ['$scope', '$mdDialog', require('./app/controllers/tabs/instrument/eventSchedulesController')]);
app.controller('FactorScheduleTabController', ['$scope', require('./app/controllers/tabs/instrument/factorScheduleTabController')]);
app.controller('ManualPricingFormulasTabController', ['$scope', require('./app/controllers/tabs/instrument/manualPricingFormulasTabController')]);
app.controller('InstrumentEventActionsDialogController', ['$scope', '$mdDialog', 'eventActions', require('./app/controllers/dialogs/instrumentEventActionsDialogController')]);
app.controller('GenerateEventScheduleDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/generateEventScheduleDialogController')]);

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

app.controller('BalanceReportController', ['$scope', '$stateParams', require('./app/controllers/reports/balanceReportController')]);
app.controller('BalanceReportControllerOld', ['$scope', '$stateParams', require('./app/controllers/reports/balanceReportController-old')]);
app.controller('ReportCustomAttrController', ['$scope', '$stateParams', '$mdDialog', require('./app/controllers/reports/reportCustomAttrController')]);
app.controller('BalanceReportDialogCustomAttrController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/balanceReportAddDialogCustomAttrController')]);

app.controller('ProfitAndLostReportController', ['$scope', '$stateParams', require('./app/controllers/reports/profitAndLostReportController')]);
app.controller('TransactionReportController', ['$scope', '$stateParams', require('./app/controllers/reports/transactionReportController')]);
app.controller('CashFlowProjectionReportController', ['$scope', '$stateParams', require('./app/controllers/reports/cashFlowProjectionReportController')]);
app.controller('PerformanceReportController', ['$scope', '$stateParams', require('./app/controllers/reports/performanceReportController')]);

app.controller('EntityDataConstructorController', ['$scope', '$stateParams', '$state', '$mdDialog', require('./app/controllers/entityDataConstructorController')]);

app.controller('AdditionsEditorEntityEditController', ['$scope', '$state', '$mdDialog', require('./app/controllers/additionsEditorEntityEditController')]);

app.controller('WarningDialogController', ['$scope', '$mdDialog', 'warning', require('./app/controllers/dialogs/warningDialogController')]);
app.controller('HelpDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/helpDialogController')]);
app.controller('SuccessDialogController', ['$scope', '$mdDialog', 'success', require('./app/controllers/dialogs/successDialogController')]);
app.controller('ValidationDialogController', ['$scope', '$mdDialog', 'validationData', require('./app/controllers/dialogs/validationDialogController')]);
app.controller('ExpressionEditorDialogController', ['$scope', '$mdDialog', 'item', require('./app/controllers/dialogs/expressionEditorDialogController')]);
app.controller('InfoDialogController', ['$scope', '$mdDialog', 'info', require('./app/controllers/dialogs/infoDialogController')]);
app.controller('InstrumentSelectDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/instrumentSelectDialogController')]);
app.controller('EntitySearchDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/entitySearchDialogController')]);


app.controller('ClassifierSelectDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/classifierSelectDialogController')]);
app.controller('SaveLayoutDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/saveLayoutDialogController')]);
app.controller('RenameDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/renameDialogController')]);
app.controller('SaveConfigurationExportLayoutDialogController', ['$scope', '$mdDialog', 'data', require('./app/controllers/dialogs/saveConfigurationExportLayoutDialogController')]);


app.controller('ExportPdfDialogController', ['$scope', '$mdDialog', 'evDataService', 'evEventService', require('./app/controllers/dialogs/exportPdfDialogController')]);

app.controller('AuditController', ['$scope', require('./app/controllers/system/auditController')]);
app.controller('NotificationsController', ['$scope', '$state', '$stateParams', require('./app/controllers/system/notificationsController')]);
app.controller('HeaderNotificationsDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/headerNotificationsDialogController')]);

app.controller('SettingsGeneralController', ['$scope', '$state', require('./app/controllers/settings/settingsGeneralController')]);
app.controller('SettingsGeneralProfileController', ['$scope', require('./app/controllers/settings/general/settingsGeneralProfileController')]);
app.controller('SettingsGeneralChangePasswordController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralChangePasswordController')]);
app.controller('SettingsGeneralDataProvidersController', ['$scope', require('./app/controllers/settings/general/settingsGeneralDataProvidersController')]);
app.controller('SettingsGeneralDataProvidersConfigController', ['$scope', '$stateParams', '$mdDialog', '$state', require('./app/controllers/settings/general/settingsGeneralDataProvidersConfigController')]);
app.controller('SettingsGeneralInstrumentImportController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralInstrumentImportController')]);
app.controller('SettingsGeneralTransactionImportController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralTransactionImportController')]);
app.controller('SettingsGeneralConfigurationController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralConfigurationController')]);
app.controller('SettingsGeneralInitConfigurationController', ['$scope', '$mdDialog', require('./app/controllers/settings/general/settingsGeneralInitConfigurationController')]);
app.controller('SettingGeneralConfigurationPreviewFileDialogController', ['$scope', '$mdDialog', 'file', require('./app/controllers/dialogs/settingGeneralConfigurationPreviewFileDialogController')]);
app.controller('SettingGeneralConfigurationExportFileDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/settingGeneralConfigurationExportFileDialogController')]);
app.controller('SettingGeneralMappingPreviewFileDialogController', ['$scope', '$mdDialog', 'file', require('./app/controllers/dialogs/settingGeneralMappingPreviewFileDialogController')]);
app.controller('SettingGeneralMappingExportFileDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/settingGeneralMappingExportFileDialogController')]);
app.controller('CreateConfigurationDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/createConfigurationDialogController')]);
app.controller('EditConfigurationDialogController', ['$scope', '$mdDialog', 'item', require('./app/controllers/dialogs/editConfigurationDialogController')]);

app.controller('SettingsFormDesignController', ['$scope', '$state', require('./app/controllers/settings/settingsFormDesignController')]);
app.controller('SettingBloombergImportInstrumentController', ['$scope', '$state', require('./app/controllers/settings/settingBloombergImportInstrumentController')]);

app.controller('SettingsMembersAndGroupsController', ['$scope', '$mdDialog', require('./app/controllers/settings/settingsMembersAndGroupsController')]);
app.controller('CreateMemberDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/createMemberDialogController')]);
app.controller('ManageMemberDialogController', ['$scope', '$mdDialog', 'memberId', require('./app/controllers/dialogs/manageMemberDialogController')]);
app.controller('ManageGroupDialogController', ['$scope', '$mdDialog', 'groupId', require('./app/controllers/dialogs/manageGroupDialogController')]);
app.controller('CreateGroupDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/createGroupDialogController')]);

app.controller('UiLayoutListDialogController', ['$scope', '$mdDialog', 'options', require('./app/controllers/dialogs/ui/uiLayoutListDialogController')]);
app.controller('UiLayoutSaveAsDialogController', ['$scope', '$mdDialog', 'options', require('./app/controllers/dialogs/ui/uiLayoutSaveAsDialogController')]);

app.controller('BookmarksWizardDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/bookmarksWizardDialogController')]);
app.controller('BookmarksLayoutSelectDialogController', ['$scope', '$mdDialog', require('./app/controllers/dialogs/bookmarksLayoutSelectDialogController')]);


app.controller('FloatCustomFieldConstructorController', ['$scope', require('./app/controllers/floatCustomFieldConstructorController')]);
app.controller('DateCustomFieldConstructorController', ['$scope', require('./app/controllers/dateCustomFieldConstructorController')]);

app.component('floatRangeCustomFieldControl', require('./app/components/floatRangeCustomFieldControlComponent'));
app.component('dateRangeCustomFieldControl', require('./app/components/dateRangeCustomFieldControlComponent'));
app.component('dashboardEntityViewer', require('./app/components/dashboardEntityViewerComponent'));

app.directive('menuToggle', [require('./app/directives/menuToggleDirective')]);
app.directive('menuLink', [require('./app/directives/menuLinkDirective')]);

app.directive('bindFieldControl', [require('./app/directives/bindFieldControlDirective')]);
app.directive('layoutConstructorField', [require('./app/directives/layoutConstructorFieldDirective')]);
app.directive('addTabEc', ['$compile', require('./app/directives/addTabEcDirective')]);

app.directive('fileRead', [require('./app/directives/fileReadDirective')]);
app.directive('onFinishRender', [require('./app/directives/onFinishRenderDirective')]);

// Controls

app.directive('expressionEditorButton', ['$mdDialog', require('./app/controls/expression-editor-button/expression-editor-button')]);

// GROUP TABLE START

app.directive('groupTable', [require('./app/directives/groupTable/gTableComponent')]);
app.directive('groupTableBody', ['$mdDialog', require('./app/directives/groupTable/gTableBodyComponent')]);
app.directive('groupSidebarFilter', ['$mdDialog', require('./app/directives/groupTable/gSidebarFilterComponent')]);
app.directive('groupReportSettings', [require('./app/directives/groupTable/gReportSettingsComponent')]);
app.directive('groupGrouping', ['$mdDialog', require('./app/directives/groupTable/gGroupingComponent')]);
app.directive('groupColumns', ['$mdDialog', require('./app/directives/groupTable/gColumnsComponent')]);
app.directive('groupActionsBlock', ['$mdDialog', '$state', require('./app/directives/groupTable/gActionsBlockComponent')]);
app.directive('groupClipboardHandler', [require('./app/directives/groupTable/gClipboardHandlerComponent')]);
app.directive('groupColumnResizer', [require('./app/directives/groupTable/gColumnResizerComponent')]);
app.directive('groupLayoutResizer', [require('./app/directives/groupTable/gLayoutResizerComponent')]);
app.directive('gDialogDraggable', [require('./app/directives/groupTable/gDialogDraggableComponent')]);
app.directive('groupHeightAligner', [require('./app/directives/groupTable/gHeightAlignerComponent')]);
app.directive('groupEditorBinder', ['$templateCache', '$compile', require('./app/directives/groupTable/groupEditorBinderComponent')]);

app.directive('groupBindReportRow', [require('./app/directives/groupTable/gBindReportRowDirective.js')]);
app.directive('contentTitle', ['$timeout', require('./app/directives/contentTitleDirective.js')]);
app.directive('valueTitle', ['$timeout', require('./app/directives/valueTitleDirective.js')]);

app.controller('GReportSettingsDialogController', ['$scope', '$mdDialog', 'reportOptions', 'options', require('./app/controllers/dialogs/gReportSettingsDialogController')]);
app.controller('PeriodsEditorDialogController', ['$scope', '$mdDialog', 'options', require('./app/controllers/dialogs/periodsEditorDialogController')]);


app.controller('gModalController', ['$scope', '$mdDialog', 'entityViewerDataService', 'entityViewerEventService', require('./app/directives/groupTable/gModalComponent')]);
app.controller('gModalReportController', ['$scope', '$mdDialog', 'entityViewerDataService', 'entityViewerEventService', require('./app/directives/groupTable/gModalReportComponent')]);
app.controller('gModalReportPnlController', ['$scope', '$mdDialog', 'entityViewerDataService', 'entityViewerEventService', require('./app/directives/groupTable/gModalReportPnlComponent')]);
app.controller('gModalReportTransactionController', ['$scope', '$mdDialog', 'entityViewerDataService', 'entityViewerEventService', require('./app/directives/groupTable/gModalReportTransactionComponent')]);
app.controller('gModalReportPerformanceController', ['$scope', '$mdDialog', 'entityViewerDataService', 'entityViewerEventService', require('./app/directives/groupTable/gModalReportPerformanceComponent')]);
app.controller('gModalReportCashFlowProjectionController', ['$scope', '$mdDialog', 'entityViewerDataService', 'entityViewerEventService', require('./app/directives/groupTable/gModalReportCashFlowProjectionComponent')]);

// GROUP TABLE END


app.directive('evFieldResolver', [require('./app/directives/entityViewerFieldResolverDirective')]);
app.directive('ismFieldResolver', ['$mdDialog', require('./app/directives/instrumentSchemeManagerFieldResolverDirective')]);
app.directive('floatNumbers', [require('./app/directives/floatNumbersDirective')]);
app.directive('instrumentModalResolver', ['$mdDialog', require('./app/directives/instrumentModalResolverDirective')]);
app.directive('entitySearchSelect', ['$mdDialog', require('./app/directives/entitySearchSelect')]);
app.directive('instrumentEventActionResolver', ['$mdDialog', require('./app/directives/instrumentEventActionResolverDirective')]);
app.directive('classifierModalResolver', ['$mdDialog', require('./app/directives/classifierModalResolverDirective')]);
app.directive('zhDatePicker', ['$mdDialog', require('./app/directives/zhDatePickerDirective')]);
app.directive('customScroll', [require('./app/directives/customScrollDirective')]);
app.directive('dragDialog', [require('./app/directives/dragDialogDirective')]);
app.directive('membersGroupsTable', [require('./app/directives/membersGroupsTableDirective')]);
app.directive('twoFieldsOptions', [require('./app/directives/twoFieldsOptionsDirective')]);
app.directive('inputFileDirective', [require('./app/directives/inputFileDirective')]);
app.directive('bookmarks', ['$mdDialog', require('./app/directives/bookmarksDirective')]);

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
}