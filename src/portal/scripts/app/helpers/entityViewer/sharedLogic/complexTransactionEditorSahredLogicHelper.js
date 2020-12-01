(function () {

	'use strict';

	let entityEditorHelper = require('../../../helpers/entity-editor.helper');

	module.exports = function (viewModel, $scope, $mdDialog) {

		let onFieldChange = function (fieldKey) {

			if (fieldKey) {

				/* Mark linked inputs that are recalculated on parent input change
				if (inputsWithCalculations) {

					var i, a;
					for (i = 0; i < viewModel.userInputs.length; i++) {

						if (viewModel.userInputs[i].key === fieldKey) {

							var uInputName = viewModel.userInputs[i].name;

							for (a = 0; a < inputsWithCalculations.length; a++) {

								var inputWithCalc = inputsWithCalculations[a];

								if (inputWithCalc.name === uInputName &&
									inputWithCalc.settings) {

									var changedUserInputData = JSON.parse(JSON.stringify(viewModel.userInputs[i]));

									if (inputWithCalc.settings.linked_inputs_names) {

										changedUserInputData.frontOptions.linked_inputs_names = JSON.parse(JSON.stringify(
											inputWithCalc.settings.linked_inputs_names.split(",")
										));

									}

									if (inputWithCalc.settings.recalc_on_change_linked_inputs) {

										changedUserInputData.frontOptions.recalc_on_change_linked_inputs = JSON.parse(JSON.stringify(
											inputWithCalc.settings.recalc_on_change_linked_inputs.split(",")
										));

									}

									viewModel.evEditorDataService.setChangedUserInputData(changedUserInputData);

									viewModel.evEditorEventService.dispatchEvent(evEditorEvents.FIELD_CHANGED);

									break;

								}

							}

							break;
						}

					}

				} */

				let userInput = viewModel.userInputs.find(function (input) {
					return input.key === fieldKey;
				});

				if (userInput) {

					let calcInput = viewModel.inputsWithCalculations && viewModel.inputsWithCalculations.find(function (input) {
						return input.name === userInput.name &&
						       input.settings &&
						       input.settings.recalc_on_change_linked_inputs;
					});

					if (calcInput) {

						let linkedInputsNames = calcInput.settings.recalc_on_change_linked_inputs.split(',');

						viewModel.recalculate({
								inputs: linkedInputsNames,
								recalculationData: "linked_inputs"
							});

					}

				}


				// When all faulty fields corrected, remove tab's error indicator.
				var attributes = {
					entityAttrs: viewModel.entityAttrs,
					attrsTypes: viewModel.attrs,
					userInputs: viewModel.userInputs,
				};

				entityEditorHelper.checkTabsForErrorFields(
					fieldKey,
					viewModel.errorFieldsList,
					viewModel.tabsWithErrors,
					attributes,
					viewModel.entity,
					viewModel.entityType,
					viewModel.tabs
				);
				// < When all faulty fields corrected, remove tab's error indicator. >

			}

		}

		return {
			onFieldChange: onFieldChange
		}

	};

}());