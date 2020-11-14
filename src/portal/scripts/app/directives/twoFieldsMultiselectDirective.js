/**
 * Created by mevstratov on 25.03.2019.
 */
(function () {

	"use strict";

	var ChipsListEventService = require('../services/eventService');
	let directivesEvents = require("../services/directivesEvents");

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
				onChangeCallback: "&?",
			},
			require: "?ngModel",
			templateUrl: "views/directives/two-fields-multiselect-view.html",
			link: function (scope, elem, attr, ngModel) {

				scope.inputText = '';
				scope.error = '';

				if (!scope.nameProperty) {
					scope.nameProperty = 'name';
				}

				let dialogTitle = scope.dialogTitle || scope.title;
				let items;

				// TIPS
				// scope.smallOptions probable properties
					// tooltipText: custom tolltip text
					// noIndicatorBtn: whether to show button at the right part of input

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

				let arrayLikeInputText = function () {

					var propName = scope.nameProperty || 'name';

					if (scope.model && scope.model.length) {

						if (items.length) {

							scope.inputText = '[';
							scope.tooltipText = 'Values selected:';

							scope.model.forEach(function (sItemId, index) {

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

						//scope.inputText = '[' + scope.model.join(', ') + ']';

					} else if (scope.nothingSelectedText) {

						scope.inputText = scope.nothingSelectedText;

					} else {

						scope.inputText = "[ ]";

					}

				};

				let setInputText = function () {

					if (scope.selectedItemsIndication) {

						switch (scope.selectedItemsIndication) {
							case "array":
								arrayLikeInputText();
								break;
						}

					} else {
						defaultInputText();
					}

				};

				//setInputText();

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
								console.log("testing getItems2", items);
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
									title: dialogTitle,
									nameProperty: scope.nameProperty
								}
							}

						}).then(function (res) {

							if (res.status === "agree") {

								scope.model = res.selectedItems;

								if (scope.selectedItemsIndication === 'chips') {

									formatDataForChips();
									let chipsList = JSON.parse(JSON.stringify(scope.chipsList));

									scope.chipsListEventService.dispatchEvent(
										directivesEvents.CHIPS_LIST_CHANGED,
										{chipsList: chipsList, updateScope: true}
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

				let formatDataForChips = function () {

					if (scope.model && items) {

						scope.chipsList = scope.model.map(function (selOption) {

							let selOptId = selOption;

							if (typeof selOptId === 'object') {
								selOptId = selOption.id;
							}

							for (let i = 0; i < items.length; i++) {

								if (items[i].id === selOptId) {

									return {
										id: selOptId,
										text: items[i][scope.nameProperty]
									};

								}

							}

						});

					}
					console.log("testing formatDataForChips", scope.chipsList);
				};

				let init = function () {

					scope.chipsListEventService = new ChipsListEventService();

					if (scope.selectedItemsIndication === 'chips') {

						scope.onChipDeletion = function (chipsData) {

							chipsData.forEach(function (chipData) {

								for (let i = 0; i < scope.model.length; i++) {

									let optionId = scope.model[i];

									if (typeof scope.model[i] === 'object') {
										optionId = scope.model[i].id;
									}

									if (optionId === chipData.id) {
										console.log("testing onChipDeletion option to delete", scope.model[i], chipData);
										scope.model.splice(i, 1);
										break;

									}

								}

							});

							console.log("testing onChipRemove after", scope.model, scope.chipsList);

						};

						if (scope.model || scope.model.length) {

							getItems().then(function () {

								formatDataForChips();
								scope.$apply();

							});

						}

					} else {

						$(elem).click(scope.openMultiselectorDialog);

					}

					scope.$watch('model', function () {
						setInputText();
					});

					scope.$watch('items', function () {

						if (scope.items) {

							items = JSON.parse(JSON.stringify(scope.items));

							if (scope.selectedItemsIndication === 'chips') {
								formatDataForChips();
							}

						}

					});


					scope.resizeInput = function () {
						let customInputCont = elem[0].querySelector('.custom-input-container');
						customInputCont.style.width = '500px';
					};

				};

				init();

			},
		};
	};
})();
