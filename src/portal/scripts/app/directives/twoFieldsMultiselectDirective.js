/**
 * Created by mevstratov on 25.03.2019.
 */
(function () {

	"use strict";

	const EventService = require("../services/eventService").default;
	const popupEvents = require("../services/events/popupEvents").default;

	let ChipsListEventService = require('../services/eventService');
	let directivesEvents = require("../services/events/directivesEvents");

	module.exports = function ($mdDialog, customInputsService) {
		return {
			restrict: "E",
			scope: {
				items: "=",
				model: "=",
				title: "@",

				customButtons: '=',
				customStyles: "=",

				dialogTitle: "@",
				nothingSelectedText: "@",
				selectedItemsIndication: "@",
				nameProperty: "@",
				smallOptions: "=",
				getDataMethod: "&?", // needed for downloading items on opening multiselector
				strictOrder: "=",
				isDisabled: "=",
				/*
				 * @type { {availableOptions: Boolean, selectedOptions: Boolean}|null|undefined }
				 * availableOptions - to show checkboxes for available options
				 * selectedOptions = to show checkboxes for selected options
				 */
				optionsCheckboxes: "=",

				multiselectEventService: "=",
				onChangeCallback: "&?",
			},
			require: "?ngModel",
			templateUrl: "views/directives/two-fields-multiselect-view.html",
			link: {
				pre: function (scope) {
					scope.popupEventService = new EventService();
				},
				post: function (scope, elem, attr, ngModel) {

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

					/** Used to prevent loading options after the first time */
					let items;
					/** For convenience */
					let selOptionsIdsList = [];
					let chipElem;
					let customInputContent;
					let dialogParent = document.querySelector('.dialog-containers-wrap');

					// TIPS
					// scope.smallOptions probable properties
					// tooltipText: custom tolltip text
					// noIndicatorBtn: whether to show button at the right part of input
					// optionsOrdering: default alphabetical ordering for options; true by default
					// selectedOptionsOrdering: default alphabetical ordering for selected options

					if (scope.smallOptions) {

						scope.tooltipText = scope.smallOptions.tooltipText;
						scope.noIndicatorBtn = scope.smallOptions.noIndicatorBtn;

						if (scope.smallOptions.dialogParent) {
							dialogParent = scope.smallOptions.dialogParent;
						}

						if (scope.smallOptions.optionsOrdering === false) {
							// disable alphabetic ordering for available options
							scope.orderOptions.options = false;
						}

						if (scope.smallOptions.selectedOptionsOrdering === false) {
							// disable alphabetic ordering for selected options
							scope.orderOptions.selectedOptions = false;
						}

					}

					scope.chipsOrderSettings = 'true';

					if (scope.strictOrder || !scope.orderOptions.selectedOptions) {
						scope.chipsOrderSettings = ''
					}

					const inputContainer = elem[0].querySelector('.multiselectorInputContainer');

					const initEventListeners = function () {

						elem[0].addEventListener('mouseover', function () {
							inputContainer.classList.add('custom-input-hovered');
						});

						elem[0].addEventListener('mouseleave', function () {
							inputContainer.classList.remove('custom-input-hovered');
						});

						document.addEventListener('click', function(event) {
							if (!elem[0].contains(event.target)) {
								scope.dropdownMenuShown = false;
								scope.$apply();
							}
						});

					};

					let getSelectedOptionsIds = function () {

						if (scope.model) {

							console.log('# scope.model', scope.model)

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

							if (items && items.length) {

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

									for (var i = 0; i < items.length; i++) {

										if (items[i].id === sItemId) {

											if (index > 0) { // add comma between selected items

												scope.inputText = scope.inputText + ',';
												scope.tooltipText = scope.tooltipText + ',';

											}

											scope.inputText = scope.inputText + ' ' + items[i][propName];
											scope.tooltipText = scope.tooltipText + ' ' + items[i][propName];

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

					const getItems = function (filterTerm) {

						return new Promise(function (resolve, reject) {

							/*if (items && items.length) {
                                resolve(items);

                            } else {*/

							if (Array.isArray(items)) {

								if (filterTerm) {

									const filterTermLc = filterTerm.toLowerCase();

									const filteredItems = items.filter(item => {

										if (!item.name) {
											return false;
										}

										return item.name.toLowerCase().includes(filterTermLc);

									});

									resolve(filteredItems);

								} else {
									resolve(items);
								}

							} else if (scope.getDataMethod) {

								scope.getDataMethod().then(function (resData) {

									if ( Array.isArray(resData) ) {
										items = resData;

									} else {
										items = resData.results;
									}

									resolve(items);

								}).catch(function (error) {

									items = [];
									resolve(items);

								});

							} else {
								items = [];
								resolve(items);
							}

							// }

						});

					}

					//# region Dropdown menu
					scope.menuOptionsPopupData = {
						options: null,
						filterTerm: "",
						loadingOptions: false,
						selectOption: function (item, _$popup, $event) {

							scope.selectOption(item);

							// IMPORTANT: should be at the end of function because it call scope.$apply() from closeDropdownMenu()
							_$popup.cancel();

						},
						onFilterChange: async function (changedValue) {

							scope.menuOptionsPopupData.loadingOptions = true;

							scope.menuOptionsPopupData.filterTerm = changedValue;
							const filteredItems = await getItems(changedValue);

							scope.menuOptionsPopupData.options = getAvailableOptions(filteredItems);

							scope.menuOptionsPopupData.loadingOptions = false;

							scope.$apply();

						},
						focusInput: function () {
							setTimeout(() => {
								const filter = document.querySelector('input.popup-select-filter');
								filter.focus();
							}, 100);
						},
						onInit: async function () {

							scope.menuOptionsPopupData.loadingOptions = true;

							scope.menuOptionsPopupData.filterTerm = "";

							// window.addEventListener('click', closeDDMenuOnClick);
							document.addEventListener('keydown', closeByKeydownPress);

							/*if (scope.getDataMethod) {
								// scope.menuOptions = await scope.loadMenuOptions();
								scope.menuOptionsPopupData.options = await scope.getDataMethod({
									filter: scope.menuOptionsPopupData.filterTerm
								});

								setTimeout(function () {
									scope.$apply();
								}, 100);

							}*/
							const itemsList = await getItems();

							scope.menuOptionsPopupData.options = getAvailableOptions(itemsList);

							scope.menuOptionsPopupData.loadingOptions = false;

							setTimeout(function () {
								scope.$apply();
							}, 100);

						},
					};

					var closeByKeydownPress = function (event) {
						customInputsService.closeMenuByKeydown(event, scope.popupEventService);
					};

					scope.onMenuClose = function () {}
					//# endregion

					scope.openMultiselectorDialog = function (event) {

						event.preventDefault();
						event.stopPropagation();

						if (scope.isDisabled) return;

						/*let parent = angular.element(document.body);

                        if (dialogParent) {

                            var parentElem = document.querySelector(dialogParent);

                            if (parentElem) {
                                parent = parentElem
                            }

                        }*/

						getItems().then(function (data) {

							items = data;

							$mdDialog.show({
								controller: "TwoFieldsMultiselectDialogController as vm",
								templateUrl: "views/dialogs/two-fields-multiselect-dialog-view.html",
								parent: dialogParent,
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
										optionsCheckboxes: scope.optionsCheckboxes,
									}
								}

							}).then(function (res) {

								if (res.status === "agree") {

									scope.model = res.selectedItems;

									if (scope.model) {
										getSelectedOptionsIds();
									}

									if (scope.selectedItemsIndication === 'chips') {

										formatDataForChips();
										// getAvailableOptions();

										scope.chipsListEventService.dispatchEvent(
											directivesEvents.CHIPS_LIST_CHANGED,
											{chipsList: scope.chipsList, updateScope: true}
										);

									}

									if (scope.onChangeCallback) {

										setTimeout(function () {

											scope.onChangeCallback({
												changedValue: structuredClone(scope.model),
											});

										}, 0);

									} else if (ngModel) { // old method but still used in some places
										ngModel.$setViewValue(res.selectedItems);
									}

								}

							});

						});

					};

					const getAvailableOptions = function (items) {

						let options = [];

						if (items) {

							// scope.dropdownMenuOptions = []

							for (let i = 0; i < items.length && i < 20; i++) {

								if ( !selOptionsIdsList.includes(items[i].id) ) {

									const availableOpt = Object.assign({}, items[i]);
									options.push(availableOpt);

								}

							}

						}

						return options;

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

								if (selOpt) {
									return {
										id: selOptId,
										text: selOpt[scope.nameProperty]
									}
								} else {
									return {
										id: selOptId,
										// text: '<span>&lt;Not found&gt;</span>',
										text: 'Not found',
										error_data: {
											code: 10,
											description: ''
										}
									}
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

							scope.dropdownMenuShown = false;
							scope.menuFilterTerms = {};
							scope.menuFilterTerms[scope.nameProperty] = "";

							scope.dropdownMenuOptions = [];

							//# region Order settings
							scope.orderMenuOptions = scope.nameProperty;

							if (scope.orderOptions.options === false) {
								scope.orderMenuOptions = null;
							}
							//# endregion

							chipElem = elem[0].querySelector("chips-list");

							scope.onDropdownMenuFilterBlur = function () {
								scope.dropdownMenuShown = false;
								scope.menuFilterTerms[scope.nameProperty] = "";
							}

							scope.getChipsContainerWidth = function () {
								customInputContent = elem[0].querySelector(".twoFieldsChipsWrap");
								scope.chipsContainerWidth = customInputContent.clientWidth - 8; // padding size is '8px'
							};

							scope.addDropdownMenuListeners = function () {

								const customInputContent = elem[0].querySelector(".twoFieldsChipsWrap");

								customInputContent.addEventListener("click", async function (event) {

									let targetElem = event.target;

									if (customInputContent === targetElem) {

										scope.popupEventService.dispatchEvent(popupEvents.OPEN_POPUP);

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

								// getAvailableOptions();

								if (scope.onChangeCallback) {

									scope.onChangeCallback({
										changedValue: structuredClone(scope.model),
									});

								}

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

								// getAvailableOptions();

								scope.chipsListEventService.dispatchEvent(
									directivesEvents.CHIPS_LIST_CHANGED,
									{chipsList: scope.chipsList, updateScope: true}
								);

								if (scope.onChangeCallback) {

									scope.onChangeCallback({
										changedValue: structuredClone(scope.model),
									});

								}

							};

							if (scope.model && scope.model.length) {

								if (scope.items && scope.items.length) items = JSON.parse(JSON.stringify(scope.items));

								getItems().then(function () {

									// getAvailableOptions();
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

						if (scope.multiselectEventService) {

							scope.multiselectEventService.addEventListener(directivesEvents.CHIPS_LIST_ELEMENT_SIZE_CHANGED, function () {
								scope.chipsContainerWidth = customInputContent.clientWidth - 8; // padding size is '8px'
								scope.chipsListEventService.dispatchEvent(directivesEvents.CHIPS_LIST_ELEMENT_SIZE_CHANGED);
							});

						}

						initEventListeners();

						scope.$watch('model', function () {

							if (scope.model) {
								getSelectedOptionsIds();
							}

							setInputText();

						});

						scope.$watch('items', function () {

							if (scope.items) {

								items = JSON.parse(JSON.stringify(scope.items));

								// getAvailableOptions();

								if (scope.selectedItemsIndication === 'chips') {
									formatDataForChips();
								}

							}

						});

					};

					init();

				}
			}

		};
	};
})();
