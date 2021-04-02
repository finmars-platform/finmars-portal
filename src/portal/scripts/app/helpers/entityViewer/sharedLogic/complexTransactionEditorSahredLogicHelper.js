(function () {

	'use strict';

	const evEditorEvents = require('../../../services/ev-editor/entityViewerEditorEvents');
	const entityEditorHelper = require('../../../helpers/entity-editor.helper');

	module.exports = function (viewModel, $scope, $mdDialog) {

		const removeUserInputsInvalidForRecalculation = function (inputsList, actualUserInputs) {

			inputsList.forEach(function (inputName, index) { // remove deleted inputs from list for recalculation

				let inputInvalid = true;

				if (inputName) {

					for (let i = 0; i < actualUserInputs.length; i++) {

						if (inputName === actualUserInputs[i].name) { // whether input actually exist

							if (actualUserInputs[i].value_expr) { // whether input has expression for recalculation

								inputInvalid = false;

							}

							break;

						}

					}

				}

				if (inputInvalid) {
					inputsList.splice(index, 1);
				}

			});

			// return inputsList;

		};

		const preRecalculationActions = (inputs, updateScope) => {

			let book = {
				transaction_type: viewModel.entity.transaction_type,
				recalculate_inputs: inputs,
				process_mode: 'recalculate',
				values: {}
			};

			viewModel.userInputs.forEach(function (item) {
				book.values[item.name] = viewModel.entity[item.name]
			});

			viewModel.evEditorDataService.setUserInputsToRecalculate(inputs);
			viewModel.evEditorEventService.dispatchEvent(evEditorEvents.FIELDS_RECALCULATION_START);

			if (updateScope) {
				$scope.$apply();
			}

			return book;

		};

		const processRecalculationResolve = function (recalculationPromise, inputs, recalculationData) {

			recalculationPromise.then(function (data) {

				inputs.forEach(inputName => {

					viewModel.entity[inputName] = data.values[inputName]

					if (data.values[inputName + '_object']) {

						viewModel.entity[inputName + '_object'] = data.values[inputName + '_object']

					}

					let userInputIndex = viewModel.userInputs.findIndex(input => input.name === inputName);
					viewModel.userInputs[userInputIndex].frontOptions.recalculated = recalculationData;

				});

				viewModel.evEditorEventService.dispatchEvent(evEditorEvents.FIELDS_RECALCULATION_END);

				$scope.$apply();

			});

		};

		let recalculateTimeoutID;

		const onFieldChange = function (fieldKey) {

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

						clearTimeout(recalculateTimeoutID);

						recalculateTimeoutID = setTimeout(() => {

							viewModel.recalculate({
								inputs: linkedInputsNames,
								recalculationData: "linked_inputs",
								updateScope: true
							});

						}, 1200);

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

		};

		const processTabsErrors = function (errors, tabsWithErrors, errorFieldsList) {

			const entityTabsMenuBtn = document.querySelector('.entityTabsMenu');

			errors.forEach(errorObj => {

				if (errorObj.locationData &&
					errorObj.locationData.type === 'system_tab' || errorObj.locationData.type === 'user_tab') {

					var tabName = errorObj.locationData.name.toLowerCase();

					if (errorObj.locationData.type === 'user_tab') {

						const selectorString = ".evFormUserTabName[data-tab-name='" + tabName + "']";
						const tabNameElem = document.querySelector(selectorString);

						if (tabNameElem) tabNameElem.classList.add('error-tab');

					}

					else if (errorObj.locationData.type === 'system_tab') {
						entityTabsMenuBtn.classList.add('error-tab');
					}

					if (!tabsWithErrors.hasOwnProperty(tabName)) { // if it is tab's first error, create property
						tabsWithErrors[tabName] = [errorObj.key];

					} else if (!tabsWithErrors[tabName].includes(errorObj.key)) { // if there is no same error, add it
						tabsWithErrors[tabName].push(errorObj.key);

					}

					if (!errorFieldsList.includes(errorObj.key)) errorFieldsList.push(errorObj.key);

				}

			});

		};

		return {
			preRecalculationActions: preRecalculationActions,
			removeUserInputsInvalidForRecalculation: removeUserInputsInvalidForRecalculation,
			processRecalculationResolve: processRecalculationResolve,

			onFieldChange: onFieldChange,

			processTabsErrors: processTabsErrors
		}

	};

}());