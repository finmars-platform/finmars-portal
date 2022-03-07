(function () {

	const metaService = require('../../../services/metaService');
    const uiService = require('../../../services/uiService');
	const entityResolverService = require('../../../services/entityResolverService');
    const evHelperService = require('../../../services/entityViewerHelperService');

    const instrumentService = require('../../../services/instrumentService');
    const attributeTypeService = require('../../../services/attributeTypeService');
    const instrumentTypeService = require('../../../services/instrumentTypeService');
    const fieldResolverService = require('../../../services/fieldResolverService');

    const entityEditorHelper = require('../../../helpers/entity-editor.helper');

    const evEditorEvents = require('../../../services/ev-editor/entityViewerEditorEvents');

    const metaHelper = require('../../../helpers/meta.helper');

    'use strict';

    module.exports = function (viewModel, $scope, $mdDialog, $bigDrawer) {

        let bigDrawerResizeButton;

        const readyStatusObj = {permissions: false, entity: false, layout: false};
        const typeSelectorValueEntities = {
        	'instrument': 'instrument-type',
			'account': 'account-type',
			'instrument-type': 'instrument-class',
        };

		const groupSelectorValueEntities = {
			'strategy-1': 'strategy-1-subgroup',
			'strategy-2': 'strategy-2-subgroup',
			'strategy-3': 'strategy-3-subgroup',
			'responsible': 'responsible-group',
			'counterparty': 'counterparty-group'
		};


        // let instrumentTypesList = [];

        const noEntityTabs = [''];

		//<editor-fold desc="entityTabsMenuTplt">
		const entityTabsMenuTplt =
			'<div class="ev-editor-tabs-popup-content popup-menu">' +
				'<md-button ng-repeat="tab in popupData.viewModel.entityTabs" ' +
						   'class="entity-tabs-menu-option popup-menu-option" ' +
						   'ng-class="popupData.viewModel.sharedLogic.getTabBtnClasses(tab)" ' +
						   'ng-click="popupData.viewModel.activeTab = tab">' +
					'<span>{{tab.label}}</span>' +
					'<div ng-if="popupData.viewModel.sharedLogic.isTabWithErrors(tab)" class="tab-option-error-icon">' +
						'<span class="material-icons orange-text">info<md-tooltip class="tooltip_2 error-tooltip" md-direction="top">Tab has errors</md-tooltip></span>' +
					'</div>' +
				'</md-button>' +

				'<md-button ng-if="popupData.viewModel.canManagePermissions" class="entity-tabs-menu-option popup-menu-option" ng-class="{\'active-tab-button\': popupData.viewModel.activeTab === \'permissions\'}" ng-click="popupData.viewModel.activeTab = \'permissions\'">' +
					'<span>Permissions</span>' +
				'</md-button>' +
            '</div>';
		//</editor-fold>

		const getFixedAreaPopup = function () {
			return {
				fields: {
					showByDefault: {
						value: viewModel.showByDefault
					}
				},
				entityType: viewModel.entityType,
				tabColumns: null,
				event: {}
			};
		};

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

        const onPopupSaveCallback = async function () {
			const test = viewModel.evEditorDataService.getFormErrorsList();
            const fieldsInFixedArea = viewModel.action === 'edit' ? getEditFormFieldsInFixedArea() : getAddFormFieldsInFixedArea();
            // Fixating showByDefault because viewModel.fixedAreaPopup.fields.showByDefault.value can be changed by getAndFormatUserTabs();
            const showByDefaultAfterSave = viewModel.fixedAreaPopup.fields.showByDefault.value;

			if (viewModel.entityType === 'instrument') {

				// On change of instrument type for instrument
				if (viewModel.fixedAreaPopup.tabColumns < 3 &&
					viewModel.fixedAreaPopup.fields.type.value !== viewModel.entity.instrument_type) {

					viewModel.entity.instrument_type = viewModel.fixedAreaPopup.fields.type.value;
					// const showByDefaultValue = viewModel.showByDefault;
					const formLayoutData = await getAndFormatUserTabs();

					viewModel.tabs = formLayoutData.tabs;
					viewModel.attributesLayout = formLayoutData.attributesLayout;
					$scope.$apply();
					// set 'show by default' that user saved in popup after it was changed by getAndFormatUserTabs()
					// viewModel.showByDefault = showByDefaultValue;
				}

			}

            viewModel.keysOfFixedFieldsAttrs.forEach(key => { // transfer changes from popup to entity

                if (!key || fieldsInFixedArea.includes(key)) {
                    return;
                }

                // const fieldKey = (key === 'instrument_type' || key === 'instrument_class') ? 'type' : key
				const fieldKey = entityEditorHelper.getFieldKeyForFAPopup(key, viewModel.entityType);
                viewModel.entity[key] = viewModel.fixedAreaPopup.fields[fieldKey].value;

            });

            if (viewModel.fixedAreaPopup.tabColumns <= 5) { // if status selector inside popup

                if (viewModel.entityStatus !== viewModel.fixedAreaPopup.fields.status.value) {
                    viewModel.entityStatus = viewModel.fixedAreaPopup.fields.status.value;
                    viewModel.entityStatusChanged();
                }

            }

            if (viewModel.showByDefault !== showByDefaultAfterSave) {

                viewModel.showByDefault = showByDefaultAfterSave;
				viewModel.fixedAreaPopup.fields.showByDefault.value = viewModel.showByDefault;
                // save layout settings
                viewModel.dataConstructorLayout.data.fixedArea.showByDefault = viewModel.showByDefault;
                uiService.updateEditLayout(viewModel.dataConstructorLayout.id, viewModel.dataConstructorLayout).then(layoutData => {
                	viewModel.dataConstructorLayout = JSON.parse(JSON.stringify(layoutData));
				});

            }

            if (viewModel.fixedAreaPopup.error) {

            	let popupHasNoErrors = true;

				/* const attributes = {
					entityAttrs: viewModel.entityAttrs,
					attrsTypes: viewModel.attributeTypes
				} */

            	for (const popupFieldKey in viewModel.originalFixedAreaPopupFields) {

					const fieldError = viewModel.originalFixedAreaPopupFields[popupFieldKey].error;
					const efKey = viewModel.originalFixedAreaPopupFields[popupFieldKey].entityFieldKey;

					if (fieldError) {

						// entityEditorHelper.checkTabsForErrorFields(efKey, viewModel.evEditorDataService, attributes, viewModel.entity, viewModel.entityType, viewModel.tabs);
						entityEditorHelper.checkFixedAreaForErrorFields(efKey, viewModel.evEditorDataService, viewModel.entityAttrs, viewModel.entity);
						const formErrorsList = viewModel.evEditorDataService.getFormErrorsList();
						const fieldErrorNotCorrected = formErrorsList.includes(efKey);

						if (fieldErrorNotCorrected) {

							viewModel.fixedAreaPopup.fields[popupFieldKey].event = {key: 'error', error: fieldError};
							popupHasNoErrors = false;

						} else {

							delete viewModel.fixedAreaPopup.fields[popupFieldKey].event;

							// remove error mode from Group crud selector in case of expanding drawer
							if (efKey === 'group') viewModel.groupSelectorEventObj.event = {key: 'reset'};

						}

					}

				}

            	if (popupHasNoErrors) {
            		delete viewModel.fixedAreaPopup.error;
					viewModel.fixedAreaPopup.event = {key: 'reset'};

				} else { // resending signal about error, in case of error mode was disabled inside textInputDirective
					viewModel.fixedAreaPopup.event = {key: "error", error: viewModel.fixedAreaPopup.error};
				}

			}

            viewModel.originalFixedAreaPopupFields = JSON.parse(JSON.stringify(viewModel.fixedAreaPopup.fields));

        };

        const onFixedAreaPopupCancel = function () {

        	viewModel.fixedAreaPopup.fields = JSON.parse(JSON.stringify(viewModel.originalFixedAreaPopupFields));

			for (const fieldKey in viewModel.fixedAreaPopup.fields) { // turn on error mode of fields when popup opens

				const fieldData = viewModel.fixedAreaPopup.fields[fieldKey];

				if (fieldData.error) {
					viewModel.fixedAreaPopup.fields[fieldKey].event = {key: 'error', error: fieldData.error};
				}

			}

        };

        const fixFieldsLayoutWithMissingSockets = function (tabs) {

            let socketsHasBeenAddedToTabs = entityEditorHelper.fixCustomTabs(tabs, viewModel.dataConstructorLayout);

            /* CODE FOR FIXED AREA INSIDE INPUT FORM EDITOR
            if (viewModel.fixedArea && viewModel.fixedArea.isActive) {
                var socketsHasBeenAddedToFixedArea = entityEditorHelper.fixCustomTabs(viewModel.fixedArea, viewModel.dataConstructorLayout);
            }
            < CODE FOR FIXED AREA INSIDE INPUT FORM EDITOR >
            */

            if (socketsHasBeenAddedToTabs) {
                viewModel.dcLayoutHasBeenFixed = true;
            }

        };

        const mapAttributesToLayoutFields = tabs => {

        	const entityAttrs = JSON.parse(JSON.stringify(viewModel.entityAttrs));

        	if (viewModel.entityType === 'instrument') {

        		var accrualsTableData = {
					name: 'Accruals schedules table',
					key: 'accrual_calculation_schedules',
					value_type: 'table',
				};

        		var eventsTableData = {
					name: 'Events schedules table',
					key: 'event_schedules',
					value_type: 'table',
				};

        		entityAttrs.push(accrualsTableData, eventsTableData);

			}

            const attributes = {
                entityAttrs: entityAttrs,
                dynamicAttrs: viewModel.attributeTypes,
                layoutAttrs: viewModel.layoutAttrs
            };

            const attributesLayoutData = entityEditorHelper.generateAttributesFromLayoutFields(tabs, attributes, viewModel.dataConstructorLayout, true);

            // viewModel.attributesLayout = attributesLayoutData.attributesLayout;
			const attributesLayout = attributesLayoutData.attributesLayout;

            /* CODE FOR FIXED AREA INSIDE INPUT FORM EDITOR
			if (viewModel.fixedArea && viewModel.fixedArea.isActive) {
				var fixedAreaAttributesLayoutData = entityEditorHelper.generateAttributesFromLayoutFields(viewModel.fixedArea, attributes, viewModel.dataConstructorLayout, true);

				viewModel.fixedAreaAttributesLayout = fixedAreaAttributesLayoutData.attributesLayout;
			}
            < CODE FOR FIXED AREA INSIDE INPUT FORM EDITOR >
            */

            if (attributesLayoutData.dcLayoutHasBeenFixed) {
                viewModel.dcLayoutHasBeenFixed = true;
            }

            return attributesLayout;

        };

        const mapAttributesAndFixFieldsLayout = function (tabs) {

            viewModel.dcLayoutHasBeenFixed = false;

            fixFieldsLayoutWithMissingSockets(tabs);
            return mapAttributesToLayoutFields(tabs);

        };

        const getAttributeTypes = function () { // dynamic attributes

        	return new Promise((res, rej) => {

        		const options = {page: 1, pageSize: 1000};

        		metaService.loadDataFromAllPages(attributeTypeService.getList, [viewModel.entityType, options]).then(attrTypeData => {

        			viewModel.attributeTypes = attrTypeData;
					res();

				}).catch(error => rej(error));

			});

        	/* return attributeTypeService.getList(viewModel.entityType, {pageSize: 1000}).then(data => {
                viewModel.attributeTypes = data.results;
            }); */

        };

        const checkReadyStatus = () => {

            let readyStatus = true;

            Object.keys(viewModel.readyStatus).forEach(key => { // checking that all properties of viewModel.readyStatus have value set to true
            	readyStatus = readyStatus && viewModel.readyStatus[key];
			});

            return readyStatus;

        };

        const bindFlex = (tab, field) => {

        	if (field.occupiesWholeRow) {
        		return 100;
			}

			var flexUnit = 100 / tab.layout.columns;
			return Math.floor(field.colspan * flexUnit);

		};

		const checkFieldRender = function (tab, row, field) {

			if (field.row === row) {

				if (field.type !== 'empty') {
					return true;
				} else {

					var spannedCols = [];
					var itemsInRow = tab.layout.fields.filter(function (item) {
						return item.row === row
					});

					itemsInRow.forEach(function (item) {

						if (item.type !== 'empty' && item.colspan > 1) {
							var columnsToSpan = item.column + item.colspan - 1;

							for (var i = item.column; i <= columnsToSpan; i = i + 1) {
								spannedCols.push(i);
							}

						}

					});

					if (spannedCols.indexOf(field.column) !== -1) {
						return false
					}

					return true;
				}
			}

			return false;

		};

        const applyInstrumentUserFieldsAliases = function (tabs) {

            return new Promise((resolve, reject) => {

                uiService.getInstrumentFieldList().then(function (data) {

                    data.results.forEach(function (userField) {

						tabs.forEach(function (tab) {

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
			viewModel.fixedAreaPopup.fields = getFieldsForFixedAreaPopup();
            // viewModel.fixedAreaPopup.fields.showByDefault.options = getShowByDefaultOptions(6, viewModel.entityType);

            $scope.$apply();
            const bigDrawerWidth = evHelperService.getBigDrawerWidth(6);

            $bigDrawer.setWidth(bigDrawerWidth);

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

        	console.log('getShowByDefaultOptions', columns, entityType);

            let result = viewModel.showByDefaultOptions;

            if (columns > 2 && entityType !== 'instrument' && entityType !== 'account' && entityType !== 'instrument-type') {
                result = result.filter(option => option.id !== 'short_name');
            }

            if (columns > 5) {

                if (viewModel.entityType === 'instrument' || viewModel.entityType === 'account' || viewModel.entityType === 'instrument-type') {
                    // result = result.filter(option => option.id !== 'short_name');
                    result = result
                } else {
                    result = result.filter(option => option.id !== 'user_code');
                }

            }

            return result;

        };

		/**
		 *
		 * @param entityType - entitType of relation selector (e.g. instrument type selector for instrument)
		 * @returns {Promise<unknown>} - returns array of entities on resolve and error object on reject
		 */
		const getTypeSelectorOptions = function (entityType) {

			let selectorOptions = [];
			let options = {pageSize: 1000, page: 1};
			let getOptionsPromise;

			if (viewModel.groupSelectorEntityType) {
				getOptionsPromise = entityResolverService.getList(entityType, options);

			} else {
				getOptionsPromise = entityResolverService.getListLight(entityType, options);
			}

			/* const loadAllPages = (resolve, reject) => {

				getOptionsPromise.then(function (typesData) {

					// viewModel.typeSelectorOptions = viewModel.typeSelectorOptions.concat(typesData.results);
					selectorOptions = selectorOptions.concat(typesData.results);

					if (typesData.next) {

						options.page = options.page + 1;
						loadAllPages(resolve, reject);

					} else {
						resolve(selectorOptions);
					}

				}).catch(error => {
					console.error("getFieldsForFixedAreaPopup error", error);
					resolve([]);
					// reject(error)
				});

			}; */

			return new Promise((res, rej) => {

				getOptionsPromise.then(typesData => {

					// const options = Array.isArray(typesData) ? typesData : typesData.results;
					if (Array.isArray(typesData)) {

						// viewModel.typeSelectorOptions = typesData;
						selectorOptions = typesData;
						res(selectorOptions);

					} else {

						// viewModel.typeSelectorOptions = typesData.results;
						selectorOptions = typesData.results;

						if (typesData.next) {
							options.page = options.page + 1;
							// loadAllPages(res, rej);
							metaService.loadDataFromAllPages(getOptionsPromise, [options], selectorOptions).then(selectorOptions => {
								res(selectorOptions);
							});

						} else {
							res(selectorOptions);
						}

					}

				}).catch(error => {
					console.error("getFieldsForFixedAreaPopup error", error);
					// rej(error);
					res(selectorOptions);
				});

			});

		};


		/**
		 *
		 * @param entityType - entitType of relation selector (e.g. instrument type selector for instrument)
		 * @returns {Promise<unknown>} - returns array of entities on resolve and error object on reject
		 */
		/* const getGroupSelectorOptions = function (entityType) {

			let resData = {};
			let options = {pageSize: 1000, page: 1};

			const loadAllPages = (resolve, reject) => {

				entityResolverService.getList(entityType, options).then(function (typesData) {

					viewModel.groupSelectorOptions = viewModel.groupSelectorOptions.concat(typesData.results);
					resData.groupSelectorOptions = viewModel.groupSelectorOptions;

					if (typesData.next) {

						options.page = options.page + 1;
						loadAllPages(resolve, reject);

					} else {
						resolve(resData);
					}

				}).catch(error => reject(error));

			};

			return new Promise((res, rej) => {

				entityResolverService.getList(entityType, options).then(typesData => {

					// const options = Array.isArray(typesData) ? typesData : typesData.results;
					if (Array.isArray(typesData)) {

						viewModel.typeSelectorOptions = typesData;
						resData.typeSelectorOptions = viewModel.typeSelectorOptions;

						res(resData);

					} else {

						viewModel.groupSelectorOptions = typesData.results;
						resData.groupSelectorOptions = viewModel.groupSelectorOptions;

						if (typesData.next) {
							options.page = options.page + 1;
							loadAllPages(res, rej);

						} else {
							res(resData);
						}

					}

				}).catch(error => {
					console.error("getFieldsForFixedAreaPopup error", error);
					rej(error);
				});

			});

		}; */

		const resolveEditLayout = function () {

			if (viewModel.entityType === 'instrument' &&
				viewModel.entity.instrument_type || viewModel.entity.instrument_type === 0) {

            	const activeInstrType = viewModel.typeSelectorOptions.find(instrType => {
					return instrType.id === viewModel.entity.instrument_type;
				});

				if (activeInstrType) { // if instrument type exist

					return new Promise(async (resolve, reject) => {

						let fullInstrType = viewModel.instrumentTypesList.find(instrType => instrType.id === activeInstrType.id);

						if (fullInstrType) { // full instrument type was loaded

							const editLayout = instrumentService.getEditLayoutBasedOnUserCodes(fullInstrType.instrument_form_layouts);
							resolve(editLayout);

						} else {

							instrumentTypeService.getByKey(activeInstrType.id).then(instrTypeData => {

								fullInstrType = instrTypeData;
								viewModel.instrumentTypesList.push(fullInstrType);

								const editLayout = instrumentService.getEditLayoutBasedOnUserCodes(fullInstrType.instrument_form_layouts);
								resolve(editLayout);

							});

						}

					});

				}

				/* if (viewModel.entity.instrument_type) {

					 return instrumentTypeService.getByKey(viewModel.entity.instrument_type).then(function (data) {

						if (data.instrument_form_layouts) {

							return new Promise(function (resolve, reject) {

								var layouts = data.instrument_form_layouts.split(',');

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

							});

						} else {
							return uiService.getDefaultEditLayout(viewModel.entityType);
						}
					})

				} else {
					return uiService.getDefaultEditLayout(viewModel.entityType);
				} */

			}

			return uiService.getDefaultEditLayout(viewModel.entityType);

		};

		const getUserTabsAndFixedAreaData = formLayoutFromAbove => {

        	return new Promise(async resolve => {

        		let editLayout;
				let gotEditLayout = true;
				let tabs = [];

				if (formLayoutFromAbove) {
					editLayout = formLayoutFromAbove;

				} else {

					try {
						editLayout = await resolveEditLayout();

					} catch (error) {
						console.error('resolveEditLayout error', error);
						gotEditLayout = false;
					}

				}

				if (gotEditLayout &&
					editLayout.results.length && editLayout.results[0].data) {

					viewModel.dataConstructorLayout = JSON.parse(JSON.stringify(editLayout.results[0]));

					if (Array.isArray(editLayout.results[0].data)) {
						tabs = editLayout.results[0].data;
					}
					else {

						// viewModel.tabs = editLayout.results[0].data.tabs
						tabs = editLayout.results[0].data.tabs;
						// viewModel.fixedArea = editLayout.results[0].data.fixedArea;
						viewModel.showByDefault = editLayout.results[0].data.fixedArea.showByDefault || viewModel.showByDefaultOptions[0].id;

					}

				}

				/* else {
					// viewModel.tabs = uiService.getDefaultEditLayout(viewModel.entityType)[0].data.tabs;
					tabs = uiService.getDefaultEditLayout(viewModel.entityType)[0].data.tabs;
					viewModel.fixedArea = uiService.getDefaultEditLayout(viewModel.entityType)[0].data.fixedArea;
				} */

				/* if (viewModel.tabs.length && !viewModel.tabs[0].hasOwnProperty('tabOrder')) { // for old layouts

					viewModel.tabs.forEach((tab, index) => tab.tabOrder = index);

				} */
				if (tabs.length && !tabs[0].hasOwnProperty('tabOrder')) { // for old layouts

					tabs.forEach((tab, index) => tab.tabOrder = index);

				}

				resolve(tabs);

			});

		};

        const getAndFormatUserTabs = async function () {

			viewModel.readyStatus.layout = false;

			const tabs = await getUserTabsAndFixedAreaData();

			if (viewModel.entityType === 'instrument') await applyInstrumentUserFieldsAliases(tabs);

			// evHelperService.transformItem(viewModel.entity, viewModel.attributeTypes);

			/* if (viewModel.fixedArea && viewModel.fixedArea.showByDefault) {

				viewModel.showByDefault = viewModel.fixedArea.showByDefault;
				viewModel.fixedAreaPopup.fields.showByDefault.value = viewModel.showByDefault;

			} */
			if (viewModel.showByDefault) {
				viewModel.fixedAreaPopup.fields.showByDefault.value = viewModel.showByDefault;
			}

			const attributesLayout = mapAttributesAndFixFieldsLayout(tabs);

			viewModel.readyStatus.layout = true;

			// $scope.$apply();
			return {tabs: tabs, attributesLayout: attributesLayout};

		};

		const onAccountTypeChange = function () {

			if (viewModel.isInheritRights && viewModel.entity.type) {
				viewModel.setInheritedPermissions();
			}

		};

		const typeSelectorChangeFns = {
			'instrument': getAndFormatUserTabs,
			'account': onAccountTypeChange,
		};

        const manageAttributeTypes = function (ev) {

        	$mdDialog.show({
				controller: 'AttributesManagerDialogController as vm',
				templateUrl: 'views/dialogs/attributes-manager-dialog-view.html',
				targetEvent: ev,
				multiple: true,
				locals: {
					data: {
						entityType: viewModel.entityType
					}
				}

			}).then(res => {

				if (res.status === 'agree') {

					viewModel.attributeTypes = res.attributeTypes;
					viewModel.evEditorDataService.setEntityAttributeTypes(viewModel.attributeTypes);

					viewModel.evEditorEventService.dispatchEvent(evEditorEvents.DYNAMIC_ATTRIBUTES_CHANGE);

				}

			});

		};

        const getFormLayout = async formLayoutFromAbove => {

			const hasRelationSelectorInFixedArea = typeSelectorValueEntities.hasOwnProperty(viewModel.entityType);

			if (hasRelationSelectorInFixedArea) {
				const valueEntity = typeSelectorValueEntities[viewModel.entityType];
				viewModel.typeSelectorOptions = await getTypeSelectorOptions(valueEntity);
			}
			else if (viewModel.groupSelectorEntityType) {
				viewModel.groupSelectorOptions = await getTypeSelectorOptions(viewModel.groupSelectorEntityType);
			}

			const tabs = await getUserTabsAndFixedAreaData(formLayoutFromAbove);

            if (viewModel.openedIn === 'big-drawer') {

				/* // viewModel.fixedArea received by getUserTabsAndFixedAreaData()
				if (viewModel.fixedArea && viewModel.fixedArea.showByDefault) {
					viewModel.showByDefault = viewModel.fixedArea.showByDefault;
					viewModel.fixedAreaPopup.fields.showByDefault.value = viewModel.showByDefault;
				} */
				if (viewModel.showByDefault) {
					viewModel.fixedAreaPopup.fields.showByDefault.value = viewModel.showByDefault;
				}

                // Instrument-type always open in max big drawer window
                let columns = evHelperService.getEditLayoutMaxColumns(tabs);

                if (viewModel.entityType === 'instrument-type') columns = 6;

                if (viewModel.fixedAreaPopup.tabColumns !== columns) {

                    viewModel.fixedAreaPopup.tabColumns = columns;
                    viewModel.fixedAreaPopup.fields.showByDefault.options = getShowByDefaultOptions(viewModel.fixedAreaPopup.tabColumns, viewModel.entityType);

                    const bigDrawerWidth = evHelperService.getBigDrawerWidth(viewModel.fixedAreaPopup.tabColumns);
                    $bigDrawer.setWidth(bigDrawerWidth);

                    if (viewModel.fixedAreaPopup.tabColumns !== 6) {

                        bigDrawerResizeButton && bigDrawerResizeButton.classList.remove('display-none');
                        bigDrawerResizeButton && bigDrawerResizeButton.classList.add('display-block');

                    } else {

                        bigDrawerResizeButton && bigDrawerResizeButton.classList.remove('display-block');
                        bigDrawerResizeButton && bigDrawerResizeButton.classList.add('display-none');

                    }

                }
                // <Victor 2020.11.20 #59 Fixed area popup>e

                viewModel.originalFixedAreaPopupFields = JSON.parse(JSON.stringify(viewModel.fixedAreaPopup.fields));

            } else if (viewModel.fixedAreaPopup) { // in entityViewerFormsPreviewDialogController.js there is no pricing fixed area
                viewModel.fixedAreaPopup.tabColumns = 6; // in dialog window there are always 2 fields outside of popup
            }

			const promises = [getAttributeTypes()];

			if (viewModel.entityType === 'instrument') promises.push(applyInstrumentUserFieldsAliases(tabs));

			return new Promise(resolve => {

				Promise.allSettled(promises).then(function () {

					// evHelperService.transformItem(viewModel.entity, viewModel.attributeTypes); // needed to go after synchronous getAttributeTypes()

					if (viewModel.getEntityPricingSchemes) viewModel.getEntityPricingSchemes(); // in entityViewerFormsPreviewDialogController.js there is no pricing tab

					const attributesLayout = mapAttributesAndFixFieldsLayout(tabs);

					let resolveData = {
						typeSelectorOptions: viewModel.typeSelectorOptions,
						groupSelectorOptions: viewModel.groupSelectorOptions,
						tabs: tabs,
						attributeTypes: viewModel.attributeTypes,
						attributesLayout: attributesLayout
					};

					if (viewModel.fixedAreaPopup) resolveData.fixedAreaData = getFieldsForFixedAreaPopup();  // in entityViewerFormsPreviewDialogController.js there is no pricing fixed area

					resolve(resolveData);

				});

			});

        };

		const entityTypeForGroupSelectorsData = {
			'responsible': 'responsible-group',
			'counterparty': 'counterparty-group',
			'strategy-1': 'strategy-1-subgroup',
			'strategy-2': 'strategy-2-subgroup',
			'strategy-3': 'strategy-3-subgroup',
		};

		const getFieldsForFixedAreaPopup = function () {

			// return new Promise(function (resolve, reject) {

			const fields = viewModel.keysOfFixedFieldsAttrs.reduce((acc, key) => {

				const attr = viewModel.entityAttrs.find(entityAttr => entityAttr.key === key);

				if (!attr) {
					return acc;
				}

				// let fieldKey = (key === 'instrument_type' || key === 'instrument_class') ? 'type' : key;
				const popupFieldKey = entityEditorHelper.getFieldKeyForFAPopup(key, viewModel.entityType);

				const field = {
					[popupFieldKey]: {name: attr.name, value: viewModel.entity[key], entityFieldKey: key}
				};

				if (attr.hasOwnProperty('value_entity')) { // this props need for getting field options
					field[popupFieldKey].value_entity = attr.value_entity;
				}

				return {...acc, ...field};

			}, {});

			fields.status = {key: 'Status', value: viewModel.entityStatus, options: viewModel.statusSelectorOptions}
			fields.showByDefault = {key: 'Show by default', value: viewModel.showByDefault, options: viewModel.showByDefaultOptions}

			if (fields.hasOwnProperty('type')) {
				fields.type.options = viewModel.typeSelectorOptions;

			} else if (fields.hasOwnProperty('group')) {

				fields.group.options = viewModel.groupSelectorOptions; // set by getGroupSelectorOptions()
				fields.group.entityType = entityTypeForGroupSelectorsData[viewModel.entityType];

			}

			// });
			return fields;

		};

        /* const onSuccessfulEntitySave = function (responseData, isAutoExitAfterSave) {

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

        }; */

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

        const isTabWithErrors = (tab) => {

        	const tabName = tab.label.toLowerCase();
			const locsWithErrors = viewModel.evEditorDataService.getLocationsWithErrors();

			return locsWithErrors[tab.type].hasOwnProperty(tabName);

		};

        const getTabBtnClasses = function (tab) {

			var result = [];

			if (viewModel.activeTab.label === tab.label) {
				result.push('active-tab-button');
			}

			if (isTabWithErrors(tab)) {
				result.push('error-menu-option');
			}

			return result;

		};

		/* const injectUserAttributesFromInstrumentType = async function (instrumentTypeId) {

			return await instrumentTypeService.getByKey(instrumentTypeId).then(data => {
				const attrs = data.instrument_attributes;
				attrs.forEach(attr => {
					const key = attr.attribute_type_user_code;
					const value = entityEditorHelper.instrumentTypeAttrValueMapper(attr);
					if (typeof viewModel.entity[key] === 'undefined' || viewModel.entity[key] === null) {
						viewModel.entity[key] = value;
					}
				});

			})
		}; */

        return {

			readyStatusObj: readyStatusObj,

			groupSelectorValueEntities: groupSelectorValueEntities,
            getFixedAreaPopup: getFixedAreaPopup,
            entityTabsMenuTplt: entityTabsMenuTplt,
            onPopupSaveCallback: onPopupSaveCallback,
            onFixedAreaPopupCancel: onFixedAreaPopupCancel,
			typeSelectorChangeFns: typeSelectorChangeFns,
			entityTypeForGroupSelectorsData: entityTypeForGroupSelectorsData,

            checkReadyStatus: checkReadyStatus,
			bindFlex: bindFlex,
			checkFieldRender: checkFieldRender,
			manageAttributeTypes: manageAttributeTypes,
            getFormLayout: getFormLayout,
			// getFieldsForFixedAreaPopup: getFieldsForFixedAreaPopup,
            onEditorStart: onEditorStart,

            // processTabsErrors: processTabsErrors,

            getDailyPricingModelFields: getDailyPricingModelFields,
            getCurrencyFields: getCurrencyFields,

			isTabWithErrors: isTabWithErrors,
			getTabBtnClasses: getTabBtnClasses,

			// injectUserAttributesFromInstrumentType: injectUserAttributesFromInstrumentType

        }

    };


}());