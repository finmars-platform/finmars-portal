/**
 * Created by mevstratov on 25.03.2019.
 */
(function () {

	"use strict";

	let ChipsListEventService = require('../services/eventService');
	let directivesEvents = require("../services/events/directivesEvents");

	module.exports = function ($mdDialog) {
		return {
			restrict: "E",
			scope: {
				items: "=",
				model: "=",
				customButtons: '=',
				customStyles: "=",
				title: "@",
				dialogTitle: "@",
				nothingSelectedText: "@",
				selectedItemsIndication: "@",
				nameProperty: "@",
				smallOptions: "=",
				getDataMethod: "&?", // needed for downloading items on opening multiselector
				strictOrder: "=",
				optionsCheckboxes: "=",
				onChangeCallback: "&?",
			},
			require: "?ngModel",
			templateUrl: "views/directives/two-fields-multiselect-view.html",
			link: function (scope, elem, attr, ngModel) {

				scope.inputText = '';
				scope.error = '';
				scope.orderOptions = {
					options: true,
					selectedOptions: true
				};

				if (!scope.nameProperty) {
					scope.nameProperty = 'name';
				}

				scope.orderSelectedOpts = '';

				// let dialogTitle = scope.dialogTitle || scope.title;
				let items;
				let selOptionsIdsList = [];
				let chipElem;

				// TIPS
				// scope.smallOptions probable properties
					// tooltipText: custom tolltip text
					// noIndicatorBtn: whether to show button at the right part of input
					// optionsOrdering: default alphabetical ordering for options; true by default
					// selectedOptionsOrdering: default alphabetical ordering for selected options

				if (scope.smallOptions) {

					scope.tooltipText = scope.smallOptions.tooltipText
					scope.noIndicatorBtn = scope.smallOptions.noIndicatorBtn

					if (scope.smallOptions.optionsOrdering === false) {
						scope.orderOptions.options = false
					}

					if (scope.smallOptions.selectedOptionsOrdering === false) {
						scope.orderOptions.selectedOptions = false
					}

				}

				scope.chipsOrderSettings = 'true';

				if (scope.strictOrder || !scope.orderOptions.selectedOptions) {
					scope.chipsOrderSettings = ''
				}

				let getSelectedOptionsIds = function () {

					if (scope.model) {

						selOptionsIdsList = scope.model.map(function (selOption) {

							let optionId = selOption;

							if (typeof selOption === 'object') {
								optionId = selOption.id;
							}

							return optionId;

						});

					}

				};

				let defaultInputText = function () {

					var selElemNumber = 0;

					if (scope.model && scope.model.length > 0) {
						selElemNumber = scope.model.length;
					}

					if (selElemNumber === 0) {

						scope.inputText = "";

						if (scope.nothingSelectedText || typeof scope.nothingSelectedText === "string") {
							scope.inputText = scope.nothingSelectedText;

						} else {
							scope.inputText = "0 items selected";
						}

					} else {
						scope.inputText = selElemNumber + " " + "items selected";
					}

				};

				var arrayLikeInputText = function () {

					var propName = scope.nameProperty || 'name';

					if (scope.model && scope.model.length) {

						if (scope.items && scope.items.length) {

							scope.inputText = '[';
							scope.tooltipText = 'Values selected:';
							/*var selItemsIds = scope.model;

							if (typeof selItemsIds[0] === 'object') { // multiselector returns array of objects

								selItemsIds = selItemsIds.map(function (sItem) {
									return sItem.id;
								});
							}

							selItemsIds.forEach(function (sItemId, index) { */
							selOptionsIdsList.forEach(function (sItemId, index) {

								for (var i = 0; i < scope.items.length; i++) {

									if (scope.items[i].id === sItemId) {

										if (index > 0) { // add comma between selected items

											scope.inputText = scope.inputText + ',';
											scope.tooltipText = scope.tooltipText + ',';

										}

										scope.inputText = scope.inputText + ' ' + scope.items[i][propName];
										scope.tooltipText = scope.tooltipText + ' ' + scope.items[i][propName];

										break;
									}
								}
							});

							scope.inputText = scope.inputText + ' ]';

						} else { // in case of error
							scope.inputText = scope.model.length + ' items selected';
						}

					} else if (scope.nothingSelectedText) {
						scope.inputText = scope.nothingSelectedText;

					} else {
						scope.inputText = "[ ]";
					}
				};

				var setInputText = function () {

					if (scope.selectedItemsIndication === 'array') {
						arrayLikeInputText();
					}

					else if (scope.selectedItemsIndication === 'chips') {
						formatDataForChips();
					}

					else {
						defaultInputText();
					}

				};

				// setInputText();

				let getItems = function () {

					return new Promise(function (resolve, reject) {

						/*if (items && items.length) {
							resolve(items);

						} else {*/

						if (items && Array.isArray(items)) {
							resolve(items);

						} else if (scope.getDataMethod) {

							scope.getDataMethod().then(function (resData) {

								items = resData.results;
								resolve(items);

							}).catch(function (error) {

								items = [];
								resolve(items);

							});

						}

						// }

					});

				}

				scope.openMultiselectorDialog = function (event) {

					event.preventDefault();
					event.stopPropagation();

					getItems().then(function (data) {

						items = data;

						$mdDialog.show({
							controller: "TwoFieldsMultiselectDialogController as vm",
							templateUrl: "views/dialogs/two-fields-multiselect-dialog-view.html",
							targetEvent: event,
							multiple: true,
							locals: {
								data: {
									items: items,
									model: scope.model,
									// title: dialogTitle,
									nameProperty: scope.nameProperty,
									orderOptions: scope.orderOptions,
									strictOrder: scope.strictOrder,
									optionsCheckboxes: scope.optionsCheckboxes
								}
							}

						}).then(function (res) {

								if (res.status === "agree") {

									scope.model = res.selectedItems
									if (scope.model) {
										getSelectedOptionsIds();
									}

									if (scope.selectedItemsIndication === 'chips') {

										formatDataForChips();
										getAvailableOptions();

										scope.chipsListEventService.dispatchEvent(
											directivesEvents.CHIPS_LIST_CHANGED,
											{chipsList: scope.chipsList, updateScope: true}
										);

									}

									if (scope.onChangeCallback) {

										setTimeout(function () {

											scope.onChangeCallback();

										}, 500);

									} else if (ngModel) { // old method but still used in some places
										ngModel.$setViewValue(res.selectedItems);
									}

								}

							});

					});

				};

				let getAvailableOptions = function () {

				    if (items) {

						scope.dropdownMenuOptions = []

				    	for (let i = 0; i < items.length && i < 20; i++) {

				    		if (!selOptionsIdsList.includes(items[i].id)) {

				    			let availableOpt = Object.assign({}, items[i]);
				    			scope.dropdownMenuOptions.push(availableOpt);

							}

						}

                    }

                };

				let formatDataForChips = function () {

					if (scope.model && items) {

						scope.chipsList = selOptionsIdsList.map(function (selOptId) {

							let selOpt = items.find(item => {

								let itemId = item;

								if (typeof item === 'object') {
									itemId = item.id;
								}

								return itemId === selOptId;

							});

							return {
								id: selOptId,
								text: selOpt[scope.nameProperty]
							}

						});

					}

				};

				scope.callFnForCustomBtn = function (actionData, event) {

					event.stopPropagation();

					if (actionData.parameters) {
						actionData.callback(actionData.parameters);
					} else {
						actionData.callback();
					}

				};

				let applyCustomStyles = function () {

					Object.keys(scope.customStyles).forEach(function (className) {

						let elemClass = "." + className;
						let elemToApplyStyles = elem[0].querySelectorAll(elemClass);

						if (elemToApplyStyles.length) {

							elemToApplyStyles.forEach(function (htmlNode) {
								htmlNode.style.cssText = scope.customStyles[className]
							})

						}

					});

				};

				let init = function () {

					scope.chipsListEventService = new ChipsListEventService();

					if (scope.selectedItemsIndication === 'chips') {

						scope.dropdownMenuShown = false
						scope.menuFilterTerms = {}
						scope.menuFilterTerms[scope.nameProperty] = ""

						scope.dropdownMenuOptions = []
						scope.orderMenuOptions = scope.nameProperty

						if (scope.orderOptions.options === false) {
							scope.orderMenuOptions = null
						}

						chipElem = elem[0].querySelector("chips-list");

						scope.onDropdownMenuFilterBlur = function () {
							scope.dropdownMenuShown = false
							scope.menuFilterTerms[scope.nameProperty] = ""
						}

						scope.getChipsContainerWidth = function () {

							let customInputContent = elem[0].querySelector(".twoFieldsChipsWrap");
							scope.chipsContainerWidth = customInputContent.clientWidth - 8; // padding size is '8px'

						};

						scope.addDropdownMenuListeners = function () {

							let customInputContent = elem[0].querySelector(".twoFieldsChipsWrap");
							let dropdownMenuFilter = elem[0].querySelector('.dropdownMenuFilter');

							customInputContent.addEventListener("click", function (event) {

								let targetElem = event.target;

								if (customInputContent === targetElem) {

									scope.dropdownMenuShown = true
									scope.$apply();

									dropdownMenuFilter.focus();

								}

							});

						};

						scope.onChipsDeletion = function (chipsData) {

							chipsData.forEach(function (chipData) {

								for (let i = 0; i < selOptionsIdsList.length; i++) {

									let optionId = selOptionsIdsList[i];

									if (optionId === chipData.id) {

										scope.model.splice(i, 1);
										selOptionsIdsList.splice(i, 1);

										break;

									}

								}

							});

							getAvailableOptions();

							scope.onChangeCallback();

						};

						scope.selectOption = function (option) {

							let selOption = option.id;

							if (scope.optionsCheckboxes) {

								selOption = {
									id: option.id,
									isChecked: false
								}

							}

							scope.model.push(selOption);
							selOptionsIdsList.push(option.id);
							formatDataForChips();

							getAvailableOptions();

							scope.chipsListEventService.dispatchEvent(
								directivesEvents.CHIPS_LIST_CHANGED,
								{chipsList: scope.chipsList, updateScope: true}
							);

							scope.onChangeCallback();

						};

						if (scope.model && scope.model.length) {

							getItems().then(function () {

                                getAvailableOptions();
								formatDataForChips();

								/* scope.chipsListEventService.dispatchEvent(
								    directivesEvents.DROPDOWN_MENU_OPTIONS_CHANGED,
                                    {optionsList: scope.dropdownMenuOptions}); */

								scope.$apply();

							});

						}

					}

					else {
						$(elem).click(scope.openMultiselectorDialog);
					}

					if (scope.customStyles) {
						applyCustomStyles();
					}

					scope.$watch('model', function () {

						if (scope.model) {
							getSelectedOptionsIds();
						}

						setInputText();

					});

					scope.$watch('items', function () {

						if (scope.items) {

							items = JSON.parse(JSON.stringify(scope.items));
							getAvailableOptions();

							if (scope.selectedItemsIndication === 'chips') {
								formatDataForChips();
							}

						}

					});

				};

				init();

			}
		};
	};
})();
