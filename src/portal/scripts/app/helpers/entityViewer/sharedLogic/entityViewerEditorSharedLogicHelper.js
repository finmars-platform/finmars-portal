(function () {

    const uiService = require('../../../services/uiService');
    const entityViewerHelperService = require('../../../services/entityViewerHelperService');

    const attributeTypeService = require('../../../services/attributeTypeService');
    const instrumentTypeService = require('../../../services/instrumentTypeService');
    const fieldResolverService = require('../../../services/fieldResolverService');

    const entityEditorHelper = require('../../../helpers/entity-editor.helper');

    const evEditorEvents = require('../../../services/ev-editor/entityViewerEditorEvents');

    const metaHelper = require('../../../helpers/meta.helper');

    'use strict';

    module.exports = function (viewModel, $scope, $mdDialog, $bigDrawer) {

        let bigDrawerResizeButton;

        const getFixedAreaPopup = function () {
            return {
                fields: {
                    showByDefault: {
                        value: viewModel.showByDefault
                    }
                },
                entityType: viewModel.entityType,
                tabColumns: null
            };
        };

        const entityTabsMenuTplt = '<div class="ev-editor-tabs-popup-content popup-menu">' +
            '<md-button ng-repeat="tab in popupData.viewModel.entityTabs" class="entity-tabs-menu-option popup-menu-option" ng-class="popupData.viewModel.getTabBtnClasses(tab)" ng-click="popupData.viewModel.activeTab = tab">' +
            '<span>{{tab.label}}</span>' +
            '<div ng-if="popupData.viewModel.tabWithErrors(tab)" class="tab-option-error-icon">' +
            '<span class="material-icons orange-text">info<md-tooltip class="tooltip_2 error-tooltip" md-direction="top">Tab has errors</md-tooltip></span>' +
            '</div>' +
            '</md-button>' +
            '<md-button ng-if="popupData.viewModel.canManagePermissions" class="entity-tabs-menu-option popup-menu-option" ng-class="{\'active-tab-button\': popupData.viewModel.activeTab === \'permissions\'}" ng-click="popupData.viewModel.activeTab = \'permissions\'">' +
            '<span>Permissions</span>' +
            '</md-button>' +
            '</div>';

        const getEditFormFieldsInFixedArea = function () {

            const fieldsInFixedArea = [];

            if (viewModel.fixedAreaPopup.tabColumns > 2) {

                if (viewModel.entityType === 'instrument' || viewModel.entityType === 'account' || viewModel.entityType === 'instrument-type') {

                    fieldsInFixedArea.push(viewModel.typeFieldName);

                } else {

                    fieldsInFixedArea.push('short_name');
                }

            }

            return fieldsInFixedArea;

        };

        const getAddFormFieldsInFixedArea = function () {
            const fieldsInFixedArea = [];

            if (viewModel.fixedAreaPopup.tabColumns > 2) {

                if (viewModel.entityType === 'instrument' || viewModel.entityType === 'account' || viewModel.entityType === 'instrument-type') {

                    fieldsInFixedArea.push(viewModel.typeFieldName);

                } else {

                    fieldsInFixedArea.push('short_name');
                }

            }


            if (viewModel.fixedAreaPopup.tabColumns > 5) {

                if (viewModel.entityType === 'instrument' || viewModel.entityType === 'account' || viewModel.entityType === 'instrument-type') {

                    fieldsInFixedArea.push('short_name');

                } else {

                    fieldsInFixedArea.push('user_code');
                }

            }

            return fieldsInFixedArea;
        }

        const onPopupSaveCallback = function () {

            const fieldsInFixedArea = viewModel.action === 'edit' ? getEditFormFieldsInFixedArea() : getAddFormFieldsInFixedArea();

            viewModel.keysOfFixedFieldsAttrs.forEach(key => {

                if (!key || fieldsInFixedArea.includes(key)) {
                    return;
                }

                const fieldKey = (key === 'instrument_type' || key === 'instrument_class') ? 'type' : key
                viewModel.entity[key] = viewModel.fixedAreaPopup.fields[fieldKey].value; // save from popup to fixed area

            });

            if (viewModel.fixedAreaPopup.tabColumns <= 5) {

                if (viewModel.entityStatus !== viewModel.fixedAreaPopup.fields.status.value) {
                    viewModel.entityStatus = viewModel.fixedAreaPopup.fields.status.value;
                    viewModel.entityStatusChanged();
                }

            }

            if (viewModel.showByDefault !== viewModel.fixedAreaPopup.fields.showByDefault.value) {

                viewModel.showByDefault = viewModel.fixedAreaPopup.fields.showByDefault.value;
                // save layout settings
                viewModel.dataConstructorLayout.data.fixedArea.showByDefault = viewModel.showByDefault;
                uiService.updateEditLayout(viewModel.dataConstructorLayout.id, viewModel.dataConstructorLayout);

            }

            viewModel.originalFixedAreaPopupFields = JSON.parse(JSON.stringify(viewModel.fixedAreaPopup.fields));

        };

        const onFixedAreaPopupCancel = function () {
            viewModel.fixedAreaPopup.fields = JSON.parse(JSON.stringify(viewModel.originalFixedAreaPopupFields));
        };

        const fixFieldsLayoutWithMissingSockets = function () {

            let socketsHasBeenAddedToTabs = entityEditorHelper.fixCustomTabs(viewModel.tabs, viewModel.dataConstructorLayout);

            if (viewModel.fixedArea && viewModel.fixedArea.isActive) {
                var socketsHasBeenAddedToFixedArea = entityEditorHelper.fixCustomTabs(viewModel.fixedArea, viewModel.dataConstructorLayout);
            }

            if (socketsHasBeenAddedToTabs || socketsHasBeenAddedToFixedArea) {
                viewModel.dcLayoutHasBeenFixed = true;
            }

        };

        const mapAttributesToLayoutFields = function () {

            let attributes = {
                entityAttrs: viewModel.entityAttrs,
                dynamicAttrs: viewModel.attributeTypes,
                layoutAttrs: viewModel.layoutAttrs
            };

            let attributesLayoutData = entityEditorHelper.generateAttributesFromLayoutFields(viewModel.tabs, attributes, viewModel.dataConstructorLayout, true);

            viewModel.attributesLayout = attributesLayoutData.attributesLayout;

            if (viewModel.fixedArea && viewModel.fixedArea.isActive) {
                var fixedAreaAttributesLayoutData = entityEditorHelper.generateAttributesFromLayoutFields(viewModel.fixedArea, attributes, viewModel.dataConstructorLayout, true);

                viewModel.fixedAreaAttributesLayout = fixedAreaAttributesLayoutData.attributesLayout;
            }

            if (attributesLayoutData.dcLayoutHasBeenFixed || (fixedAreaAttributesLayoutData && fixedAreaAttributesLayoutData.dcLayoutHasBeenFixed)) {
                viewModel.dcLayoutHasBeenFixed = true;
            }

        };

        const mapAttributesAndFixFieldsLayout = function () {

            viewModel.dcLayoutHasBeenFixed = false;

            fixFieldsLayoutWithMissingSockets();
            mapAttributesToLayoutFields();

        };

        const getAttributeTypes = function () {
            return attributeTypeService.getList(viewModel.entityType, {pageSize: 1000}).then(function (data) {
                viewModel.attributeTypes = data.results;
            });
        };

        const checkReadyStatus = () => {

            let readyStatus = true;

            Object.keys(viewModel.readyStatus).forEach(key => readyStatus = readyStatus && viewModel.readyStatus[key]);

            return readyStatus;

        };

        const applyInstrumentUserFieldsAliases = function () {

            return new Promise((resolve, reject) => {

                uiService.getInstrumentFieldList().then(function (data) {

                    data.results.forEach(function (userField) {

                        viewModel.tabs.forEach(function (tab) {

                            tab.layout.fields.forEach(function (field) {

                                if (field.attribute && field.attribute.key && field.attribute.key === userField.key) {

                                    if (!field.options) {
                                        field.options = {};
                                    }

                                    field.options.fieldName = userField.name;

                                }

                            })

                        })

                    });

                    resolve();

                }).catch(() => resolve());

            });

        };

        const onBigDrawerResizeButtonClick = function () {
            viewModel.fixedAreaPopup.tabColumns = 6;
            viewModel.fixedAreaPopup.fields.showByDefault.options = getShowByDefaultOptions(6, viewModel.entityType);

            $scope.$apply();
            const bigDrawerWidthPercent = entityViewerHelperService.getBigDrawerWidthPercent(6);

            $bigDrawer.setWidth(bigDrawerWidthPercent);

            bigDrawerResizeButton.classList.add('display-none');
            bigDrawerResizeButton.classList.remove('display-block');

        };

        const onEditorStart = function () {

            if (viewModel.openedIn === 'big-drawer') {

                bigDrawerResizeButton = document.querySelector('.onResizeButtonClick');

                if (bigDrawerResizeButton) {
                    bigDrawerResizeButton.addEventListener('click', onBigDrawerResizeButtonClick);
                }

                return false;

            } else {
                return document.querySelector('.evEditorDialogElemToResize');
            }

        };

        const getShowByDefaultOptions = function (columns, entityType) {

            let result = viewModel.showByDefaultOptions;

            if (columns > 2 && entityType !== 'instrument' && entityType !== 'account' && entityType !== 'instrument-type') {
                result = result.filter(option => option.id !== 'short_name')
            }

            if (columns > 5) {

                if (viewModel.entityType === 'instrument' || viewModel.entityType === 'account' || viewModel.entityType === 'instrument-type') {
                    result = result.filter(option => option.id !== 'short_name');
                } else {
                    result = result.filter(option => option.id !== 'user_code')
                }

            }

            return result;

        };

        const resolveEditLayout = async function (viewModel) {

            if (viewModel.entityType === 'instrument') {

                if (viewModel.entity.instrument_type) {

                    return instrumentTypeService.getByKey(viewModel.entity.instrument_type).then(function (data) {

                        if (data.instrument_form_layouts) {

                            return new Promise(function (resolve, reject) {

                                var layouts = data.instrument_form_layouts.split(',')

                                console.log('Resolving Edit Layout. Layouts', layouts)

                                uiService.getListEditLayout(viewModel.entityType).then(function (data) {

                                    var result;
                                    var lastMatchedIndex;

                                    data.results.forEach(function (item) {

                                        if (layouts.indexOf(item.user_code) !== -1) {

                                            if (!lastMatchedIndex && lastMatchedIndex !== 0) {
                                                lastMatchedIndex = layouts.indexOf(item.user_code)
                                                result = item
                                            }

                                            if (layouts.indexOf(item.user_code) < lastMatchedIndex) {
                                                lastMatchedIndex = layouts.indexOf(item.user_code)
                                                result = item
                                            }

                                        }

                                    })

                                    console.log('result', result);

                                    if (result) {
                                        resolve({ // Array?
                                            results: [
                                                result
                                            ]
                                        })
                                    } else {
                                        resolve(uiService.getDefaultEditLayout(viewModel.entityType))
                                    }

                                })

                            })

                        } else {
                            return uiService.getDefaultEditLayout(viewModel.entityType);
                        }
                    })

                } else {
                    return uiService.getDefaultEditLayout(viewModel.entityType);
                }


            } else {
                return uiService.getDefaultEditLayout(viewModel.entityType);
            }

        }

        /**
         *
         * @param editorType: string - indicates whether function called from entityViewerEditDialogController.js or entityViewerAddDialogController.js
         */
        const getFormLayout = async function (editorType, formLayoutFromAbove) {

            let editLayout;
            let gotEditLayout = true;

            if (formLayoutFromAbove) {
                editLayout = formLayoutFromAbove;

            } else {

                try {
                    editLayout = await resolveEditLayout(viewModel);

                } catch (error) {

                    сonsole.error('resolveEditLayout error', error)

                    gotEditLayout = false;
                }

            }

            if (gotEditLayout &&
                editLayout.results.length && editLayout.results[0].data) {

                viewModel.dataConstructorLayout = JSON.parse(JSON.stringify(editLayout.results[0]));

                if (Array.isArray(editLayout.results[0].data)) {

                    viewModel.tabs = editLayout.results[0].data

                } else {

                    viewModel.tabs = editLayout.results[0].data.tabs
                    viewModel.fixedArea = editLayout.results[0].data.fixedArea

                }

            } else {

                viewModel.tabs = uiService.getDefaultEditLayout(viewModel.entityType)[0].data.tabs;
                viewModel.fixedArea = uiService.getDefaultEditLayout(viewModel.entityType)[0].data.fixedArea;

            }

            if (viewModel.tabs.length && !viewModel.tabs[0].hasOwnProperty('tabOrder')) { // for old layouts
                viewModel.tabs.forEach(function (tab, index) {
                    tab.tabOrder = index;
                });
            }

            if (viewModel.openedIn === 'big-drawer') {

                // Victor 2020.11.20 #59 Fixed area popup
                if (viewModel.fixedArea && viewModel.fixedArea.showByDefault) {
                    viewModel.showByDefault = viewModel.fixedArea.showByDefault;
                    viewModel.fixedAreaPopup.fields.showByDefault.value = viewModel.showByDefault;
                }

                console.log('#78 viewModel.entityType', viewModel.entityType)

                // Instrument-type always open in max big drawer window
                const columns = viewModel.entityType === 'instrument-type'? 6 : entityViewerHelperService.getEditLayoutMaxColumns(viewModel.tabs);

                if (viewModel.fixedAreaPopup.tabColumns !== columns) {

                    viewModel.fixedAreaPopup.tabColumns = columns;
                    viewModel.fixedAreaPopup.fields.showByDefault.options = getShowByDefaultOptions(viewModel.fixedAreaPopup.tabColumns, viewModel.entityType);

                    const bigDrawerWidthPercent = entityViewerHelperService.getBigDrawerWidthPercent(viewModel.fixedAreaPopup.tabColumns);
                    $bigDrawer.setWidth(bigDrawerWidthPercent);

                    if (viewModel.fixedAreaPopup.tabColumns !== 6) {

                        bigDrawerResizeButton && bigDrawerResizeButton.classList.remove('display-none');
                        bigDrawerResizeButton && bigDrawerResizeButton.classList.add('display-block');

                    } else {

                        bigDrawerResizeButton && bigDrawerResizeButton.classList.remove('display-block');
                        bigDrawerResizeButton && bigDrawerResizeButton.classList.add('display-none');

                    }

                }
                // <Victor 2020.11.20 #59 Fixed area popup>

                viewModel.originalFixedAreaPopupFields = JSON.parse(JSON.stringify(viewModel.fixedAreaPopup.fields));

            } else {
                viewModel.fixedAreaPopup.tabColumns = 6 // in dialog window there are always 2 fields outside of popup
            }

            getAttributeTypes().then(async function () {

                entityViewerHelperService.transformItem(viewModel.entity, viewModel.attributeTypes);

                viewModel.getEntityPricingSchemes();

                if (viewModel.entityType === 'instrument') {
                    await applyInstrumentUserFieldsAliases();
                }

                mapAttributesAndFixFieldsLayout();

                if (editorType === 'addition') {

                    viewModel.readyStatus.content = true;
                    viewModel.readyStatus.entity = true;

                } else {
                    viewModel.readyStatus.layout = true;
                    viewModel.readyStatus.attributeTypes = true;
                }

                $scope.$apply();

            });

        };

        const processTabsErrors = function (errors, tabsWithErrors, errorFieldsList, $event) {

            const entityTabsMenuBtn = document.querySelector('.entityTabsMenu');

            errors.forEach(function (errorObj) {

                if (errorObj.locationData &&
                    errorObj.locationData.type === 'tab') {

                    const tabName = errorObj.locationData.name.toLowerCase();

                    const selectorString = ".tab-name-elem[data-tab-name='" + tabName + "']";
                    const tabNameElem = document.querySelector(selectorString);

                    if (tabNameElem) {
                        tabNameElem.classList.add('error-tab');

                    } else {
                        entityTabsMenuBtn.classList.add('error-tab');
                    }

                    if (!tabsWithErrors.hasOwnProperty(tabName)) {
                        tabsWithErrors[tabName] = [errorObj.key];

                    } else if (tabsWithErrors[tabName].includes(errorObj.key)) {

                        tabsWithErrors[tabName].push(errorObj.key);

                    }

                    errorFieldsList.push(errorObj.key);

                }

            });

            viewModel.evEditorEventService.dispatchEvent(evEditorEvents.MARK_FIELDS_WITH_ERRORS);

            $mdDialog.show({
                controller: 'EvAddEditValidationDialogController as vm',
                templateUrl: 'views/dialogs/ev-add-edit-validation-dialog-view.html',
                targetEvent: $event,
                multiple: true,
                locals: {
                    data: {
                        errorsList: errors
                    }
                }
            });

        };

        const onSuccessfulEntitySave = function (responseData, isAutoExitAfterSave) {

            viewModel.processing = false;

            if (responseData.status === 400) {
                viewModel.handleErrors(responseData);

            } else {

                var entityTypeVerbose = viewModel.entityType.split('-').join(' ').capitalizeFirstLetter();
                toastNotificationService.success(entityTypeVerbose + " " + viewModel.entity.name + ' was successfully saved');

                if (isAutoExitAfterSave) {

                    let responseObj = {res: 'agree', data: responseData};
                    metaHelper.closeComponent(viewModel.openedIn, $mdDialog, $bigDrawer, responseObj);

                } else {
                    viewModel.entity = {...viewModel.entity, ...responseData};
                    viewModel.entity.$_isValid = true;
                }


            }

        };

        const getAccrualsGridTableData = function () {

            const rows = [
                {key: 'notes', name: 'Notes', toShow: true, defaultValueType: 'text', options: false},
                {key: 'first_accrual_date', name: 'First accrual date', toShow: true, defaultValueType: 'date', options: false},
                {key: 'first_payment_date', name: 'First payment date', toShow: true,  defaultValueType: 'date', options: false},
                {key: 'accrual_size', name: 'Accrual size', toShow: true, defaultValueType: 'number', options: false},
                {key: 'periodicity', name: 'Periodicity', toShow: true, defaultValueType: 'selector', selectorOptions: viewModel.periodicityItems, options: true},
                {key: 'accrual_model', name: 'Accrual model', toShow: true, defaultValueType: 'selector', selectorOptions: viewModel.accrualModels, options: true},
                {key: 'periodic_n', name: 'Periodic N', toShow: true, defaultValueType: 'number', options: false},
            ];

            const accrualsGridTableData = {
                header: {
                    order: 'header',
                    columns: []
                },
                body: [],
                templateRow: {
                    order: 'newRow',
                    isActive: false,
                    columns: [
                        {
                            key: 'name',
                            // objPath: ['name'],
                            columnName: 'Name',
                            order: 0,
                            cellType: 'text',
                            settings: {
                                value: null,
                                closeOnMouseOut: false,
                                isDisabled: true
                            },
                            styles: {
                                'grid-table-cell': {'width': '165px'}
                            }
                        },
                        {
                            key: 'to_show',
                            columnName: 'To Show',
                            order: 1,
                            cellType: 'checkbox',
                            settings: {
                                value: null
                            },
                            styles: {
                                'grid-table-cell': {'width': '165px'}
                            }

                        },
                        {
                            key: 'default_value',
                            // objPath: ['name'],
                            columnName: 'Default Value',
                            order: 2,
                            cellType: 'selector',
                            settings: {
                                value: null,
                                selectorOptions: []
                            },
                            styles: {
                                'grid-table-cell': {'width': '165px'}
                            }
                        },
                        {
                            key: 'override_name',
                            // objPath: ['name'],
                            columnName: 'Override Name',
                            order: 3,
                            cellType: 'text',
                            settings: {
                                value: null,
                                closeOnMouseOut: false,
                                isDisabled: false
                            },
                            styles: {
                                'grid-table-cell': {'width': '165px'}
                            }
                        },
                        {
                            key: 'options',
                            // objPath: ['name'],
                            columnName: 'Options',
                            order: 4,
                            cellType: 'text',
                            settings: {
                                value: null,
                                closeOnMouseOut: false,
                                isDisabled: true
                            },
                            styles: {
                                'grid-table-cell': {'width': '165px'}
                            }
                        },
/*                        {
                            key: 'options',
                            objPaths: [['accrual_calculation_model'], ['periodicity_n'], ['periodicity']],
                            columnName: 'Options',
                            order: 4,
                            cellType: 'custom_popup',
                            settings: {
                                value: [
                                    null, // for accrual_calculation_model
                                    null, // for periodicity_n
                                    null // for periodicity
                                ],
                                cellText: '',
                                closeOnMouseOut: false,
                                popupSettings: {
                                    contentHtml: {
                                        main: "<div ng-include src=\"'views/directives/gridTable/cells/popups/instrument-accrual-schedules-periodicity-view.html'\"></div>"
                                    },
/!*                                    fieldsData: [
                                        {selectorOptions: vm.periodicityItems},
                                        null,
                                        {selectorOptions: vm.accrualModels}
                                    ]*!/
                                }
                            },
                            methods: {
/!*                                onChange: function (rowData, colData, gtDataService, gtEventService) {

                                    var periodicityCell = gtDataService.getCellByKey(rowData.order, 'periodicity');

                                    periodicityCell.settings.cellText = '';

                                    if (periodicityCell.settings.value[2]) {

                                        const selectedPeriodicity = vm.periodicityItems.find(item => {
                                            return item.id === periodicityCell.settings.value[2];
                                        });
                                        periodicityCell.settings.cellText = selectedPeriodicity.name

                                    }

                                }*!/
                            },
                            styles: {
                                'grid-table-cell': {'width': '115px'}
                            }
                        },*/

                    ],
                },
                components: {
                    topPanel: {
                        inactive: true,
/*                        filters: false,
                        columns: false,
                        search: false*/
                    }
                }
            };

            const optionCellSettings = {
                value: [],
                cellText: 'Options...',
                closeOnMouseOut: false,
                popupSettings: {
                    contentHtml: {
                        main: "<div ng-include src=\"'views/directives/gridTable/cells/popups/instrument-type-accruals-options-view.html'\"></div>"
                    },
                    /*                                    fieldsData: [
                                                            {selectorOptions: vm.periodicityItems},
                                                            null,
                                                            {selectorOptions: vm.accrualModels}
                                                        ]*/
                }
            };

            const rowObj = metaHelper.recursiveDeepCopy(accrualsGridTableData.templateRow, true);
            accrualsGridTableData.header.columns = rowObj.columns.map(column => {

                return {
                    key: column.key,
                    columnName: column.columnName,
                    order: column.order,
                    styles: {
                        'grid-table-cell': {'width': column.styles['grid-table-cell'].width}
                    }
                };
            })

            accrualsGridTableData.body = rows.map((row, index) => {
                const rowObj = metaHelper.recursiveDeepCopy(accrualsGridTableData.templateRow, true);

                rowObj.order = index;
                rowObj.key = row.key;

                rowObj.columns[0].settings.value = row.name;
                rowObj.columns[1].settings.value = row.toShow;
                rowObj.columns[2].cellType = row.defaultValueType;

                if (row.defaultValueType === 'selector') {
                    rowObj.columns[2].settings.selectorOptions = row.selectorOptions;
                }

                if (row.options) {

                    const cell = rowObj.columns[4];

                    cell.cellType = 'custom_popup';
                    cell.cellType.objPaths = [
                        ['annual_to_show'], ['annual_override_name'],
                        ['semi-annual_to_show'], ['semi-annual_override_name'],
                        ['quarterly-annual_to_show'], ['quarterly-annual_override_name'],
                        ['monthly-annual_to_show'], ['monthly-annual_override_name'],
                    ];

                    cell.settings = metaHelper.recursiveDeepCopy(optionCellSettings, false);
                    cell.settings.value = [
                        true, 'Annual ON',
                        true, 'Semi-annual ON',
                        true, 'Quarterly ON',
                        true, 'Monthly ON',
                    ];

                    cell.methods ={
                        onChange: function (rowData, colData, gtDataService, gtEventService) {
                            const cell = gtDataService.getCellByKey(rowData.order, colData.key);
                            cell.settings.cellText = 'Options changed';
                            // Victor 2021.02.18 TODO here i will collect model for options of accrual model and periodicity
                        }
                    }

                }

                return rowObj

            })

            return accrualsGridTableData;
        };

        const getDailyPricingModelFields = async function () {

            const {data}  = await fieldResolverService.getFields('payment_size_detail', {
                entityType: 'instrument',
                key: 'payment_size_detail'
            });
            const dailyPricingModelFields = metaHelper.textWithDashSort(data);

            return dailyPricingModelFields;

        };

        const getCurrencyFields = async function () {
            const {data} = await fieldResolverService.getFields('accrued_currency', {
                entityType: 'instrument',
                key: 'accrued_currency'
            });
            const currencyFields = metaHelper.textWithDashSort(data);

            return currencyFields;
        }

        return {

            getFixedAreaPopup: getFixedAreaPopup,
            entityTabsMenuTplt: entityTabsMenuTplt,

            onPopupSaveCallback: onPopupSaveCallback,
            onFixedAreaPopupCancel: onFixedAreaPopupCancel,

            checkReadyStatus: checkReadyStatus,
            getFormLayout: getFormLayout,
            onEditorStart: onEditorStart,

            processTabsErrors: processTabsErrors,

            getAccrualsGridTableData: getAccrualsGridTableData,
            getDailyPricingModelFields: getDailyPricingModelFields,
            getCurrencyFields: getCurrencyFields,

        }

    };


}());