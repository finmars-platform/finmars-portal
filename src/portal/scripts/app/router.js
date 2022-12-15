/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    module.exports = function ($stateProvider) {

		/* $urlRouterProvider.otherwise('/');

		$stateProvider.state('app', {
			url: '',
			abstract: true,
			templateUrl: 'views/shell-view.html',
			controller: 'ShellController as vm'
		}); */

		$stateProvider.state('app.portal', {
			url: '',
			abstract: true,
			templateUrl: 'views/portal-view.html',
			controller: 'PortalController as vm'
		});

        $stateProvider.state('app.portal.healthcheck', {
            url: '/healthcheck',
            templateUrl: 'views/pages/healthcheck-view.html',
            controller: 'HealthcheckController as vm'
        });

        $stateProvider.state('app.portal.attributesManager', {
            url: '/attributes/:entityType?from=?instanceId=',
            templateUrl: 'views/attributes-manager-view.html',
            controller: 'AttributesManagerController as vm'
        });


        $stateProvider.state('app.portal.dashboard', {
            url: '/dashboard?layoutUserCode',
            templateUrl: 'views/dashboard-view.html',
            controller: 'DashboardController as vm'
        });

        $stateProvider.state('app.portal.dashboard-constructor', {
            url: '/dashboard-constructor/:id',
            templateUrl: 'views/dashboard-constructor-view.html',
            controller: 'DashboardConstructorController as vm'
        });

        $stateProvider.state('app.portal.dashboard-layout-manager', {
            url: '/dashboard-layouts',
            templateUrl: 'views/dashboard-layout-manager-view.html',
            controller: 'DashboardLayoutManagerController as vm'
        });

        $stateProvider.state('app.portal.context-menu-constructor', {
            url: '/context-menu-constructor/:id',
            templateUrl: 'views/context-menu-constructor-view.html',
            controller: 'ContextMenuConstructorController as vm'
        });

        $stateProvider.state('app.portal.context-menu-layout-manager', {
            url: '/context-menu-layouts',
            templateUrl: 'views/context-menu-layout-manager-view.html',
            controller: 'ContextMenuLayoutManagerController as vm'
        });

        $stateProvider.state('app.portal.manual-sorting-layout-manager', {
            url: '/manual-sorting-layouts',
            templateUrl: 'views/manual-sorting-layout-manager-view.html',
            controller: 'ManualSortingLayoutManagerController as vm'
        });

        $stateProvider.state('app.portal.home', {
            url: '/',
            templateUrl: 'views/home-view.html',
            controller: 'HomeController as vm'
        });

        $stateProvider.state('app.portal.actions', {
            url: '/actions',
            templateUrl: 'views/actions-view.html',
            controller: 'ActionsController as vm'
        });

        $stateProvider.state('app.portal.developer-panel', {
            url: '/developer-panel',
            templateUrl: 'views/pages/developer-panel-view.html',
            controller: 'DeveloperPanelController as vm'
        });

        $stateProvider.state('app.portal.not-found', {
            url: '/layout-not-found',
            templateUrl: 'views/not-found-page-view.html',
            controller: 'NotFoundPageController as vm'
        });

        $stateProvider.state('app.portal.template-layout-manager', {
            url: '/template-layouts',
            templateUrl: 'views/pages/template-layout-manager-view.html',
            controller: 'TemplateLayoutManagerController as vm'
        });

        $stateProvider
            .state('app.portal.data', {
                url: '/data',
                abstract: true,
                template: '<div data-ui-view class="ev-abstract-elem"></div>'
            })
            .state('app.portal.data.portfolio', {
                url: '/portfolios',
                templateUrl: 'views/data/data-portfolio-view.html',
                controller: 'DataPortfolioController as vm',
                params: {
                    layoutUserCode: null
                }
            })
            .state('app.portal.data.portfolio-register', {
                url: '/portfolio-registers',
                templateUrl: 'views/data/data-portfolio-register-view.html',
                controller: 'DataPortfolioRegisterController as vm',
                params: {
                    layoutUserCode: null
                }
            })
            .state('app.portal.data.portfolio-register-record', {
                url: '/portfolio-register-records',
                templateUrl: 'views/data/data-portfolio-register-record-view.html',
                controller: 'DataPortfolioRegisterRecordController as vm',
                params: {
                    layoutUserCode: null
                }
            })
            .state('app.portal.data.account', {
                url: '/accounts',
                templateUrl: 'views/data/data-account-view.html',
                controller: 'DataAccountController as vm',
                params: {
                    layoutUserCode: null
                }
            })
            .state('app.portal.data.account-type', {
                url: '/account-types',
                templateUrl: 'views/data/data-account-type-view.html',
                controller: 'DataAccountTypeController as vm',
                params: {
                    layoutUserCode: null
                }
            })
            .state('app.portal.data.counterparty-group', {
                url: '/counterparty-group',
                templateUrl: 'views/data/data-counterparty-group-view.html',
                controller: 'DataCounterpartyGroupController as vm',
                params: {
                    layoutUserCode: null
                }
            })
            .state('app.portal.data.counterparty', {
                url: '/counterparties',
                templateUrl: 'views/data/data-counterparty-view.html',
                controller: 'DataCounterpartyController as vm',
                params: {
                    layoutUserCode: null
                }
            })
            .state('app.portal.data.responsible-group', {
                url: '/responsible-group',
                templateUrl: 'views/data/data-responsible-group-view.html',
                controller: 'DataResponsibleGroupController as vm',
                params: {
                    layoutUserCode: null
                }
            })
            .state('app.portal.data.responsible', {
                url: '/responsibles',
                templateUrl: 'views/data/data-responsible-view.html',
                controller: 'DataResponsibleController as vm',
                params: {
                    layoutUserCode: null
                }
            })
            .state('app.portal.data.instrument', {
                url: '/instruments?entity',
                templateUrl: 'views/data/data-instrument-view.html',
                controller: 'DataInstrumentController as vm',
                params: {
                    layoutUserCode: null,
                }
            })
            .state('app.portal.data.generated-event', {
                url: '/generated-events',
                templateUrl: 'views/data/data-generated-event-view.html',
                controller: 'DataGeneratedEventController as vm',
                params: {
                    layoutUserCode: null
                }
            })
            .state('app.portal.data.instrument-type', {
                url: '/instrument-types',
                templateUrl: 'views/data/data-instrument-type-view.html',
                controller: 'DataInstrumentTypeController as vm',
                params: {
                    layoutUserCode: null
                }
            })
			/* .state('app.portal.data.pricing-policy', {
                url: '/pricing-policy',
                templateUrl: 'views/data/data-pricing-policy-view.html',
                controller: 'DataPricingPolicyController as vm',
                params: {
                    layoutUserCode: null
                }
            }) */
            .state('app.portal.data.complex-transaction', {
                url: '/complex-transactions',
                templateUrl: 'views/data/data-complex-transaction-view.html',
                controller: 'DataComplexTransactionController as vm',
                params: {
                    layoutUserCode: null
                }
            })
            .state('app.portal.data.transaction', {
                url: '/transactions',
                templateUrl: 'views/data/data-transaction-view.html',
                controller: 'DataTransactionController as vm',
                params: {
                    layoutUserCode: null
                }
            })
            .state('app.portal.data.transaction-type', {
                url: '/transaction-types',
                templateUrl: 'views/data/data-transaction-type-view.html',
                controller: 'DataTransactionTypeController as vm',
                params: {
                    layoutUserCode: null
                }
            })
            .state('app.portal.data.transaction-type-group', {
                url: '/transaction-type-group',
                templateUrl: 'views/data/data-transaction-type-group-view.html',
                controller: 'DataTransactionTypeGroupController as vm',
                params: {
                    layoutUserCode: null
                }
            })
            .state('app.portal.data.currency-history', {
                url: '/currencies',
                templateUrl: 'views/data/data-currency-history-view.html',
                controller: 'DataCurrencyHistoryController as vm',
                params: {
                    layoutUserCode: null
                }
            })
            .state('app.portal.data.price-history', {
                url: '/pricing',
                templateUrl: 'views/data/data-price-history-view.html',
                controller: 'DataPriceHistoryController as vm',
                params: {
                    layoutUserCode: null
                }
            })
			//.state('app.portal.data.pricing', {
            //    url: '/pricing',
            //    templateUrl: 'views/data/data-pricing-view.html',
            //    controller: 'DataPortfolioController as vm'
            //})
            .state('app.portal.data.currency', {
                url: '/currency',
                templateUrl: 'views/data/data-currency-view.html',
                controller: 'DataCurrencyController as vm',
                params: {
                    layoutUserCode: null
                }
            })
            .state('app.portal.data.strategy-group', {
                url: '/strategy/:strategyNumber/group',
                templateUrl: 'views/data/data-strategy-group-view.html',
                controller: 'DataStrategyGroupController as vm'
            })
            .state('app.portal.data.strategy-subgroup', {
                url: '/strategy/:strategyNumber/subgroup',
                templateUrl: 'views/data/data-strategy-subgroup-view.html',
                controller: 'DataStrategySubgroupController as vm'
            })
            .state('app.portal.data.strategy', {
                url: '/strategy/:strategyNumber',
                templateUrl: 'views/data/data-strategy-view.html',
                controller: 'DataStrategyController as vm',
                params: {
                    layoutUserCode: null
                }
            })

            .state('app.portal.data.currency-history-error', {
                url: '/currencies-errors',
                templateUrl: 'views/data/data-currency-history-error-view.html',
                controller: 'DataCurrencyHistoryErrorController as vm',
                params: {
                    layoutUserCode: null
                }
            })
            .state('app.portal.data.price-history-error', {
                url: '/pricing-errors',
                templateUrl: 'views/data/data-price-history-error-view.html',
                controller: 'DataPriceHistoryErrorController as vm',
                params: {
                    layoutUserCode: null
                }
            })

            .state('app.portal.reports', {
                url: '/reports',
                abstract: true,
                template: '<div data-ui-view class="ev-abstract-elem"></div>'
            })
            .state('app.portal.reports.balance-report', {
                url: '/balance',
                templateUrl: 'views/reports/reports-balance-view.html',
                controller: 'BalanceReportController as vm',
                params: {
                    layoutUserCode: null
                }
            })
            .state('app.portal.reports.customFieldManager', {
                url: '/:entityType/custom-field',
                templateUrl: 'views/reports/custom-field-view.html',
                controller: 'CustomFieldController as vm',
                params: {
                    prevState: ''
                }
            })
            .state('app.portal.reports.pl-report', {
                url: '/profit-and-lost',
                templateUrl: 'views/reports/reports-profit-and-lost-view.html',
                controller: 'ProfitAndLostReportController as vm',
                params: {
                    layoutUserCode: null
                }
            })
            .state('app.portal.reports.transaction-report', {
                url: '/transaction',
                templateUrl: 'views/reports/reports-transaction-view.html',
                controller: 'TransactionReportController as vm',
                params: {
                    layoutUserCode: null
                }
            })
            .state('app.portal.reports.cash-flow-projection-report', {
                url: '/cash-flow-projection',
                templateUrl: 'views/reports/reports-cash-flow-projection-view.html',
                controller: 'CashFlowProjectionReportController as vm',
                params: {
                    layoutUserCode: null
                }
            })
            .state('app.portal.reports.performance-report', {
                url: '/performance',
                templateUrl: 'views/reports/reports-performance-view.html',
                controller: 'PerformanceReportController as vm',
                params: {
                    layoutUserCode: null
                }
            })
            .state('app.portal.reports.check-for-events', {
                url: '/check-for-events',
                templateUrl: 'views/pages/check-for-events-view.html',
                controller: 'CheckEventsController as vm'
            })

            .state('app.portal.update-configuration', {
                url: '/update-configuration',
                templateUrl: 'views/pages/update-configuration-page-view.html',
                controller: 'UpdateConfigurationPageController as vm'
            })

            .state('app.portal.processes', {
                url: '/processes',
                templateUrl: 'views/pages/processes-view.html',
                controller: 'ProcessesController as vm'
            })

            .state('app.portal.explorer', {
                url: '/explorer',
                templateUrl: 'views/pages/explorer-page-view.html',
                controller: 'ExplorerPageController as vm'
            })


            .state('app.portal.data-stats', {
                url: '/data-stats',
                templateUrl: 'views/pages/data-stats-page-view.html',
                controller: 'DataStatsPageController as vm'
            })

            .state('app.portal.error-page', {
                url: '/error-page',
                templateUrl: 'views/pages/error-page-view.html',
                controller: 'ErrorPageController as vm'
            })

            .state('app.portal.data-calendar', {
                url: '/calendar',
                templateUrl: 'views/pages/data-calendar-page-view.html',
                controller: 'DataCalendarPageController as vm'
            })


            .state('app.portal.update-center', {
                url: '/update-center',
                templateUrl: 'views/pages/update-center-view.html',
                controller: 'UpdateCenterController as vm'
            })

            .state('app.portal.system-messages', {
                url: '/system-messages',
                templateUrl: 'views/pages/system-messages-view.html',
                controller: 'SystemMessagesController as vm'
            })

            .state('app.portal.pricing-policy', {
                url: '/pricing-policies',
                templateUrl: 'views/pages/pricing-policy-page-view.html',
                controller: 'PricingPolicyPageController as vm'
            })

            .state('app.portal.pricing-schemes', {
                url: '/pricing-schemes',
                templateUrl: 'views/pages/pricing-scheme-page-view.html',
                controller: 'PricingSchemePageController as vm'
            })

            .state('app.portal.schedules', {
                url: '/schedules',
                templateUrl: 'views/pages/schedule-page-view.html',
                controller: 'SchedulePageController as vm'
            })

            .state('app.portal.pricing-procedure', {
                url: '/pricing-procedures',
                templateUrl: 'views/pages/pricing-procedure-page-view.html',
                controller: 'PricingProcedurePageController as vm'
            })

            .state('app.portal.data-procedure', {
                url: '/data-procedures',
                templateUrl: 'views/pages/data-procedure-page-view.html',
                controller: 'DataProcedurePageController as vm'
            })

            .state('app.portal.expression-procedure', {
                url: '/expression-procedures',
                templateUrl: 'views/pages/expression-procedure-page-view.html',
                controller: 'ExpressionProcedurePageController as vm'
            })

            .state('app.portal.ace-editor', {
                url: '/editor',
                templateUrl: 'views/pages/ace-editor-page-view.html',
                controller: 'AceEditorPageController as vm'
            })

            .state('app.portal.pricing-parent-procedure', {
                url: '/pricing-parent-procedures',
                templateUrl: 'views/pages/pricing-parent-procedure-page-view.html',
                controller: 'PricingParentProcedurePageController as vm'
            })

            .state('app.portal.run-pricing-procedure', {
                url: '/run-pricing-procedures',
                templateUrl: 'views/pages/run-pricing-procedure-page-view.html',
                controller: 'RunPricingProcedurePageController as vm'
            })
            .state('app.portal.run-data-procedure', {
                url: '/run-data-procedures',
                templateUrl: 'views/pages/run-data-procedure-page-view.html',
                controller: 'RunDataProcedurePageController as vm'
            })
            .state('app.portal.data-procedure-instance', {
                url: '/data-procedure-instance',
                templateUrl: 'views/pages/data-procedure-instance-page-view.html',
                controller: 'DataProcedureInstancePageController as vm'
            })
            .state('app.portal.expression-procedure-instance', {
                url: '/expression-procedure-instance',
                templateUrl: 'views/pages/expression-procedure-instance-page-view.html',
                controller: 'ExpressionProcedureInstancePageController as vm'
            })
            .state('app.portal.import', {
                url: '/import',
                abstract: true,
                template: '<div data-ui-view></div>'
            })
            .state('app.portal.import.simple-entity', {
                url: '/simple-entity-import',
                templateUrl: 'views/pages/simple-entity-import-view.html',
                controller: 'SimpleEntityImportController as vm'
            })
            .state('app.portal.import.unified-entity', {
                url: '/unified-entity-import',
                templateUrl: 'views/pages/unified-entity-import-view.html',
                controller: 'UnifiedEntityImportController as vm'
            })
            .state('app.portal.import.transaction', {
                url: '/transaction-import',
                templateUrl: 'views/pages/transaction-import-view.html',
                controller: 'TransactionImportController as vm'
            })
            .state('app.portal.import.complex-import', {
                url: '/complex-import',
                templateUrl: 'views/pages/complex-import-view.html',
                controller: 'ComplexImportController as vm'
            })
            .state('app.portal.import.instrument', {
                url: '/instrument-import',
                templateUrl: 'views/pages/instrument-download-view.html',
                controller: 'InstrumentDownloadController as vm'
            })
            .state('app.portal.import.instrument-cbonds', {
                url: '/instrument-import-cbonds',
                templateUrl: 'views/pages/instrument-download-cbonds-view.html',
                controller: 'InstrumentDownloadCbondsController as vm'
            })
            .state('app.portal.import.prices', {
                url: '/prices-import',
                templateUrl: 'views/pages/fill-price-history-view.html',
                controller: 'FillPriceHistoryController as vm'
            })
            .state('app.portal.import.mapping-tables', {
                url: '/mapping-tables-import',
                templateUrl: 'views/pages/mapping-table-view.html',
                controller: 'MappingTablesController as vm'
            })
            .state('app.portal.import.reference-tables', {
                url: '/reference-tables',
                templateUrl: 'views/pages/reference-tables-view.html',
                controller: 'ReferenceTablesController as vm'
            })
            .state('app.portal.settings', {
                abstract: true,
                url: '/settings',
                template: '<div data-ui-view></div>'
            })
            .state('app.portal.settings.general', {
                abstract: true,
                url: '/general',
                templateUrl: 'views/settings/general-view.html',
                controller: 'SettingsGeneralController as vm'
            })
            .state('app.portal.settings.general.profile', {
                url: '/profile',
                views: {
                    profile: {
                        templateUrl: 'views/settings/profile-settings-view.html',
                        controller: 'SettingsGeneralProfileController as vm'
                    }
                }
            })
            .state('app.portal.settings.general.transaction-field', {
                url: '/transaction-field',
                views: {
                    'transaction-field': {
                        templateUrl: 'views/settings/transaction-field-settings-view.html',
                        controller: 'SettingsGeneralTransactionFieldController as vm'
                    }
                }
            })
            .state('app.portal.settings.general.instrument-field', {
                url: '/instrument-field',
                views: {
                    'instrument-field': {
                        templateUrl: 'views/settings/instrument-field-settings-view.html',
                        controller: 'SettingsGeneralInstrumentFieldController as vm'
                    }
                }
            })
            .state('app.portal.settings.general.change-password', {
                url: '/change-password',
                views: {
                    'change-password': {
                        templateUrl: 'views/settings/change-password-settings-view.html',
                        controller: 'SettingsGeneralChangePasswordController as vm'
                    }
                }
            })
            .state('app.portal.settings.general.data-providers', {
                url: '/data-providers',
                views: {
                    'data-providers': {
                        templateUrl: 'views/settings/data-providers-settings-view.html',
                        controller: 'SettingsGeneralDataProvidersController as vm'
                    }
                }
            })
            .state('app.portal.settings.general.data-providers-config', {
                url: '/data-providers/:dataProviderId',
                views: {
                    'data-providers': {
                        templateUrl: 'views/settings/data-providers-config-settings-view.html',
                        controller: 'SettingsGeneralDataProvidersConfigController as vm'
                    }
                }
            })

            .state('app.portal.settings.general.data-providers-bloomberg', {
                url: '/data-providers/bloomberg/:id',
                views: {
                    'data-providers': {
                        templateUrl: 'views/settings/data-providers-bloomberg-settings-view.html',
                        controller: 'SettingsGeneralDataProvidersBloombergController as vm'
                    }
                }
            })

            .state('app.portal.settings.general.instrument-import', {
                url: '/instrument-import',
                views: {
                    'instrument-import': {
                        templateUrl: 'views/settings/instrument-import-settings-view.html',
                        controller: 'SettingsGeneralInstrumentImportController as vm'
                    }
                }
            })
            .state('app.portal.settings.general.simple-entity-import', {
                url: '/simple-entity-import',
                views: {
                    'simple-entity-import': {
                        templateUrl: 'views/settings/simple-entity-import-settings-view.html',
                        controller: 'SettingsGeneralSimpleEntityImportController as vm'
                    }
                }
            })
            .state('app.portal.settings.general.transaction-import', {
                url: '/transaction-import',
                views: {
                    'transaction-import': {
                        templateUrl: 'views/settings/transaction-import-settings-view.html',
                        controller: 'SettingsGeneralTransactionImportController as vm'
                    }
                }
            })
            .state('app.portal.settings.general.complex-import', {
                url: '/complex-import',
                views: {
                    'complex-import': {
                        templateUrl: 'views/settings/complex-import-settings-view.html',
                        controller: 'SettingsGeneralComplexImportController as vm'
                    }
                }
            })
            .state('app.portal.settings.general.configuration', {
                url: '/configuration',
                views: {
                    'configuration': {
                        templateUrl: 'views/settings/configuration-settings-view.html',
                        controller: 'SettingsGeneralConfigurationController as vm'
                    }
                }
            })
            .state('app.portal.settings.general.init-configuration', {
                url: '/init-configuration',
                views: {
                    'init-configuration': {
                        templateUrl: 'views/settings/init-configuration-settings-view.html',
                        controller: 'SettingsGeneralInitConfigurationController as vm'
                    }
                }
            })
            .state('app.portal.settings.form-design', {
                url: '/form',
                templateUrl: 'views/settings/form-design-view.html',
                controller: 'SettingsFormDesignController as vm'
            })
            .state('app.portal.settings.users-groups', {
                url: '/users-and-groups',
                templateUrl: 'views/settings/users-and-groups-view.html',
                controller: 'SettingsMembersAndGroupsController as vm'
            })
            .state('app.portal.settings.ecosystem-default-settings', {
                url: '/default-settings',
                templateUrl: 'views/pages/ecosystem-default-settings-view.html',
                controller: 'EcosystemDefaultSettingsController as vm'
            })

            .state('app.portal.settings.forms', {
                url: '/forms',
                templateUrl: 'views/pages/forms-data-constructor-view.html',
                controller: 'FormsDataConstructor as vm'
            })
            .state('app.portal.settings.layouts', {
                url: '/layouts',
                templateUrl: 'views/pages/layouts-settings-view.html',
                controller: 'LayoutsSettingsController as vm'
            })
            .state('app.portal.settings.input-form-layouts', {
                url: '/input-form-layouts',
                templateUrl: 'views/pages/input-form-layouts-settings-view.html',
                controller: 'InputFormLayoutsSettingsController as vm'
            })
            .state('app.portal.settings.notifications', {
                url: '/notifications',
                templateUrl: 'views/settings/profile-settings-view.html',
                controller: 'SettingsGeneralProfileController as vm'
            })
            .state('app.portal.settings.interface-access', {
                url: '/interface',
                templateUrl: 'views/settings/interface-access-settings-view.html',
                controller: 'SettingsGeneralInterfaceAccessController as vm'
            })
            .state('app.portal.settings.entities-custom-attributes', {
                url: '/entities-custom-attributes',
                templateUrl: 'views/pages/entities-custom-attributes-view.html',
                controller: 'EntitiesCustomAttributesController as vm'
            })
            .state('app.portal.settings.price-download-scheme', {
                url: '/price-download-scheme',
                templateUrl: 'views/pages/price-download-scheme-view.html',
                controller: 'PriceDownloadSchemeController as vm'
            })
            .state('app.portal.settings.instrument-import', {
                url: '/instrument-import',
                templateUrl: 'views/settings/instrument-import-settings-view.html',
                controller: 'SettingsGeneralInstrumentImportController as vm'
            })
            .state('app.portal.settings.simple-entity-import', {
                url: '/data-import',
                templateUrl: 'views/settings/simple-entity-import-settings-view.html',
                controller: 'SettingsGeneralSimpleEntityImportController as vm'
            })
            .state('app.portal.settings.transaction-import', {
                url: '/transaction-import',
                templateUrl: 'views/settings/transaction-import-settings-view.html',
                controller: 'SettingsGeneralTransactionImportController as vm'
            })
            .state('app.portal.settings.complex-import', {
                url: '/complex-import',
                templateUrl: 'views/settings/complex-import-settings-view.html',
                controller: 'SettingsGeneralComplexImportController as vm'
            })
            .state('app.portal.settings.template-fields', {
                url: '/aliases',
                templateUrl: 'views/pages/template-fields-view.html',
                controller: 'TemplateFieldsController as vm'
            })
            .state('app.portal.settings.tooltips', {
                url: '/tooltips',
                templateUrl: 'views/pages/entity-tooltip-page-view.html',
                controller: 'EntityTooltipPageController as vm'
            })

            .state('app.portal.settings.cross-entity-attribute-extensions', {
                url: '/cross-entity-attribute-extension',
                templateUrl: 'views/pages/cross-entity-attribute-extension-page-view.html',
                controller: 'CrossEntityAttributeExtensionPageController as vm'
            })
            .state('app.portal.settings.color-palettes', {
                url: '/palettes',
                templateUrl: 'views/colorPicker/color-palettes-settings-view.html',
                controller: 'ColorPalettesSettingsController as vm',
				resolve: {
                	data: function() { // setting 'data' dependency
                		return '';
					}
				}
            })
            .state('app.portal.settings.import-configuration', {
                url: '/import-configuration',
                templateUrl: 'views/pages/import-configurations-view.html',
                controller: 'ImportConfigurationsController as vm'
            })
            .state('app.portal.settings.export-configuration', {
                url: '/export-configuration',
                templateUrl: 'views/pages/export-configurations-view.html',
                controller: 'ExportConfigurationsController as vm'
            })
            .state('app.portal.settings.data-providers', {
                url: '/data-providers',
                templateUrl: 'views/settings/data-providers-settings-view.html',
                controller: 'SettingsGeneralDataProvidersController as vm'
            })
            .state('app.portal.settings.data-providers-config', {
                url: '/data-providers/:dataProviderId',
                templateUrl: 'views/settings/data-providers-config-settings-view.html',
                controller: 'SettingsGeneralDataProvidersConfigController as vm'
            })
            .state('app.portal.settings.data-providers-bloomberg', {
                url: '/data-providers/bloomberg/:id',
                templateUrl: 'views/settings/data-providers-bloomberg-settings-view.html',
                controller: 'SettingsGeneralDataProvidersBloombergController as vm'
            })
            .state('app.portal.settings.init-configuration', {
                url: '/init-configuration',
                templateUrl: 'views/settings/init-configuration-settings-view.html',
                controller: 'SettingsGeneralInitConfigurationController as vm'
            })
            .state('app.portal.settings.users-and-groups', {
                url: '/data-providers',
                templateUrl: 'views/settings/data-providers-settings-view.html',
                controller: 'SettingsGeneralDataProvidersController as vm'
            })

            .state('app.portal.system', {
                abstract: true,
                url: '/system',
                template: '<div data-ui-view></div>'
            })
            .state('app.portal.system.notifications', {
                url: '/notifications',
                templateUrl: 'views/system/notifications-view.html',
                controller: 'NotificationsController as vm',
                params: {
                    notificationsListType: 'all'
                }
            })
            .state('app.portal.data.transactions', {
                url: '/audit/transactions',
                templateUrl: 'views/system/audit-transactions-view.html',
                controller: 'TransactionsAuditController as vm'
            })
            .state('app.portal.data.instruments', {
                url: '/audit/instruments',
                templateUrl: 'views/system/audit-instruments-view.html',
                controller: 'InstrumentsAuditController as vm'
            })
            .state('app.portal.system.audit', {
                url: '/audit',
                templateUrl: 'views/system/audit-view.html',
                controller: 'AuditController as vm'
            })
            .state('app.portal.system.file-reports', {
                url: '/file-reports',
                templateUrl: 'views/pages/file-reports-view.html',
                controller: 'FileReportsController as vm'
            });

    }

}());