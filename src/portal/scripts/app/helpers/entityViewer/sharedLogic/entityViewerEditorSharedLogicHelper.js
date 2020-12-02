(function () {

	let uiService = require('../../../services/uiService');
	let entityViewerHelperService = require('../../../services/entityViewerHelperService');

	var attributeTypeService = require('../../../services/attributeTypeService');

	let entityEditorHelper = require('../../../helpers/entity-editor.helper');

	'use strict';

	module.exports = function (viewModel, $scope, $mdDialog) {

		let fixFieldsLayoutWithMissingSockets = function () {

			let socketsHasBeenAddedToTabs = entityEditorHelper.fixCustomTabs(viewModel.tabs, viewModel.dataConstructorLayout);

			if (viewModel.fixedArea && viewModel.fixedArea.isActive) {
				var socketsHasBeenAddedToFixedArea = entityEditorHelper.fixCustomTabs(viewModel.fixedArea, viewModel.dataConstructorLayout);
			}

			if (socketsHasBeenAddedToTabs || socketsHasBeenAddedToFixedArea) {
				viewModel.dcLayoutHasBeenFixed = true;
			}

		};

		let mapAttributesToLayoutFields = function () {

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

		let mapAttributesAndFixFieldsLayout = function () {
			viewModel.dcLayoutHasBeenFixed = false;

			fixFieldsLayoutWithMissingSockets();
			mapAttributesToLayoutFields();
		};

		let getAttributeTypes = function () {
			return attributeTypeService.getList(viewModel.entityType, {pageSize: 1000}).then(function (data) {
				viewModel.attributeTypes = data.results;
			});
		};

		let getInstrumentUserFields = function () {

			uiService.getInstrumentFieldList().then(function (data) {

				data.results.forEach(function (userField) {

					viewModel.tabs.forEach(function (tab) {

						tab.layout.fields.forEach(function (field) {

							if (field.attribute && field.attribute.key) {

								if (field.attribute.key === userField.key) {


									if (!field.options) {
										field.options = {};
									}

									field.options.fieldName = userField.name;
								}

							}

						})

					})

				});

				viewModel.readyStatus.userFields = true;

				$scope.$apply();

			})

		};

		/**
		 *
		 * @param editorType: string - indicates whether function called from entityViewerEditDialogController.js or entityViewerAddDialogController.js
		 */
		let getFormLayout = function (editorType) {

			uiService.getEditLayout(viewModel.entityType).then(function (data) {

				if (data.results.length && data.results.length > 0 && data.results[0].data) {

					viewModel.dataConstructorLayout = data.results[0];

					if (Array.isArray(data.results[0].data)) {
						viewModel.tabs = data.results[0].data;

					} else {

						viewModel.tabs = data.results[0].data.tabs;
						viewModel.fixedArea = data.results[0].data.fixedArea;

					}

				} else {
					viewModel.tabs = uiService.getDefaultEditLayout(viewModel.entityType)[0].data.tabs;
					viewModel.fixedArea = uiService.getDefaultEditLayout(viewModel.entityType)[0].data.fixedArea;
				}

				if (viewModel.tabs.length && !viewModel.tabs[0].hasOwnProperty('tabOrder')) {

					viewModel.tabs.forEach(function (tab, index) {
						tab.tabOrder = index;
					});

				}

				getAttributeTypes().then(function () {

					entityViewerHelperService.transformItem(viewModel.entity, viewModel.attributeTypes);

					viewModel.getEntityPricingSchemes();
					mapAttributesAndFixFieldsLayout();

					if (editorType === 'addition') {

						viewModel.readyStatus.content = true;
						viewModel.readyStatus.entity = true;

					} else {
						viewModel.readyStatus.layout = true;
						viewModel.readyStatus.attributeTypes = true;
					}


					if (viewModel.entityType === 'instrument') {
						getInstrumentUserFields();

					} else {
						viewModel.readyStatus.userFields = true;
					}

					$scope.$apply();

				});

			});

		};

		return {
			getFormLayout: getFormLayout
		}

	};

}());