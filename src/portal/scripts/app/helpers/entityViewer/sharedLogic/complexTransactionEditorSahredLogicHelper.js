(function () {

	'use strict';

	const evEditorEvents = require('../../../services/ev-editor/entityViewerEditorEvents');
	const entityEditorHelper = require('../../../helpers/entity-editor.helper');

	module.exports = function (viewModel, $scope, $mdDialog) {

		let preRecalculationActions = function (inputs, updateScope) {

			removeUserInputsInvalidForRecalculation(inputs, viewModel.transactionType.inputs);

			viewModel.evEditorDataService.setUserInputsToRecalculate(inputs);
			viewModel.evEditorEventService.dispatchEvent(evEditorEvents.FIELDS_RECALCULATION_START);

			if (updateScope) {
				$scope.$apply();
			}

		};

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

				let userInput = viewModel.userInputs.find(input => input.key === fieldKey);

				if (userInput) {

					let calcInput = viewModel.inputsWithCalculations.find(input => {

						return input.name === userInput.name &&
						       input.settings &&
						       input.settings.recalc_on_change_linked_inputs;

					});

					if (calcInput) {

						let linkedInputsNames = calcInput.settings.recalc_on_change_linked_inputs.split(',');

						viewModel.evEditorDataService.setUserInputsToRecalculate(linkedInputsNames);

						viewModel.recalculate({
							inputs: linkedInputsNames,
							recalculationData: "linked_inputs",
							updateScope: true
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

		let removeUserInputsInvalidForRecalculation = function (inputsList, actualUserInputs) {

			inputsList.forEach(function (inputName, index) { // remove deleted inputs from list for recalculation

				let inputInvalid = true;

				for (let i = 0; i < actualUserInputs.length; i++) {

					if (inputName === actualUserInputs[i].name) { // whether input actually exist

						if (actualUserInputs[i].value_expr) { // whether input has expression for recalculation

							inputInvalid = false;

						}


						break;

					}

				}

				if (inputInvalid) {
					inputsList.splice(index, 1);
				}

			});

			// return inputsList;

		}

		return {
			preRecalculationActions: preRecalculationActions,
			onFieldChange: onFieldChange
		}

	};

}());