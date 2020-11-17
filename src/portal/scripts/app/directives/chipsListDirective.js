(function () {

	'use strict';

	let directivesEvents = require("../services/directivesEvents");

	module.exports = function ($filter) {
		return {
			restrict: "E",
			scope: {
				chipsList: "=",
				eventService: "=",
				chipsDeletion: "@",
				onChipDeletion: "=",
				orderChips: "@",
				isDisabled: "=",
				onChipClick: "=" // pass function with argument that contains object with next properties: chipsList
			},
			templateUrl: "views/directives/chips-list-view.html",
			link: function (scope, elem, attr) {
				// console.log("testing chipsList", scope.chipsList);
				// console.log("testing eventService", scope.eventService);
				// console.log("testing orderChips", scope.orderChips);
				// scope.chipsToDisplay = [];
				scope.hiddenChips = [];
				scope.hiddenChipsTexts = "";

				scope.orderOptions = null;

				if (scope.orderChips) {
					scope.orderOptions = "text"
				}
				// console.log("testing orderOptions", scope.orderOptions);
				let chipsContainer, chipsContainerWidth = 0;

				scope.getChipsListClasses = function () {

					let classes = "";

					if (scope.chipsDeletion) {
						classes = "chips-deletion-enabled"
					}

					return classes;

				};

				scope.onChipClickMethod = function (chipData) {

					let chipsList = chipData;

					if (!Array.isArray(chipData)) {

						chipsList = [chipData];

					}

					if (scope.onChipClick) {
						scope.onChipClick(chipsList);
					}

				};

				/* scope.$watch('chipsList', function () {

					scope.chipsToDisplay = [];
					// console.log("testing chipsList changed", scope.chipsList);
					if (scope.chipsList) {

						scope.chipsToDisplay = JSON.parse(JSON.stringify(scope.chipsList));

					}

				}); */

				let getHiddenChipsTexts = function () {

					scope.hiddenChipsTexts = "";

					let hiddenChips = scope.hiddenChips;

                    if (scope.orderOptions) {
                        hiddenChips = $filter('orderBy')(hiddenChips, scope.orderOptions);
                    }

                    hiddenChips.forEach(function (hChip) {

						if (hChip.text) {
							scope.hiddenChipsTexts = scope.hiddenChipsTexts + hChip.text + "; ";
						}

					});

					if (scope.hiddenChipsTexts) {

						// remove "; " from the end
						let endIndex = scope.hiddenChipsTexts.length - 2;
						scope.hiddenChipsTexts = scope.hiddenChipsTexts.substring(0, endIndex)

						scope.hiddenChipsTexts = "Hidden chips: " + scope.hiddenChipsTexts + "."

					}

				};

				// hideOverflowingChips function called from chips-list-view.html by ng-init
				scope.hideOverflowingChips = function (updateScope) {

					setTimeout(function () { // wait for ng-repeat to finish rendering

						scope.hiddenChips = [];
						// console.log("testing chipsContainer data", chipsContainer, chipsContainerWidth, updateScope);

						let chipsElemsList = elem[0].querySelectorAll('.chipWrapElem');
						let expandChipWidth = 74;
						let chipsWidth = 0; // size of .expand-chip (width + margins)

						if (chipsElemsList.length) {
							// console.log("testing hideOverflow chipsElemsList1", chipsElemsList);
						}

						let hideChips = function (index) {
							// scope.chipsToDisplay = scope.chipsList.slice(0, i);
							// console.log("testing hideOverflow hideChips", JSON.parse(JSON.stringify(scope.chipsList)));
							scope.hiddenChips = scope.chipsList.slice(index);
							// console.log("testing hideOverflow hideChips index", index);
							getHiddenChipsTexts();
							// scope.$apply();
						}

						chipsElemsList.forEach(function (cElem) {
							cElem.classList.add('chip-hidden');
						});

						for (let i = 0; i < chipsElemsList.length; i++) {

							let cElem = chipsElemsList[i];
							// console.log("testing hideOverflow cElem.clientWidth", cElem.clientWidth);
							chipsWidth += cElem.clientWidth;

							if (i + 1 === chipsElemsList.length) { // for the last chip

								if (chipsWidth > chipsContainerWidth) {

									hideChips(i);
									// console.log("testing hideOverflowingChips triggered1");
									break;

								}


							} else if (chipsWidth + expandChipWidth > chipsContainerWidth) {

								hideChips(i);
								// console.log("testing hideOverflowingChips triggered2");
								break;

							}

							// console.log("testing hideOverflowingChips triggered3");
							cElem.classList.remove('chip-hidden');

						}
						// console.log("testing hideOverflowingChips hiddenChips", scope.hiddenChips);
						if (updateScope) {
							scope.$apply();
						}

					}, 100);

				};

				scope.deleteChips = function (chipsData, index) {

					let chipsForDeletion = JSON.parse(JSON.stringify(chipsData));

					if (!Array.isArray(chipsForDeletion)) { // one chip deletion

						chipsForDeletion = [chipsForDeletion]

					} else { // hidden chips deletion
						scope.hiddenChips = [];
					}

					chipsForDeletion.forEach(function (chipData) {

						for (let i = 0; i < scope.chipsList.length; i++) {

							if (scope.chipsList[i].id === chipData.id) {

								scope.chipsList.splice(i, 1);
								break;

							}

						}

					})

					scope.hideOverflowingChips();

					if (scope.onChipDeletion) {

						setTimeout(function () {

							scope.onChipDeletion(chipsForDeletion);

						}, 500);

					}


				};

				let init = function () {

					chipsContainer = elem[0].querySelector('.chipsListContainer');
					chipsContainerWidth = chipsContainer.clientWidth;
					// console.log("testing chipsList", scope.chipsList);
					if (scope.eventService) {

						scope.eventService.addEventListener(directivesEvents.CHIPS_LIST_CHANGED, function (argumentsObj) {
							/*
							argumentsObj properties
							chipsList: new array of chips
							updateScope: whether call scope.$apply at the end of hideOverflowingChips()
							*/
							scope.chipsList = argumentsObj.chipsList;
							scope.hideOverflowingChips(argumentsObj.updateScope);
							// console.log("testing CHIPS_LIST_CHANGED chipsList", scope.chipsList);
						});

						scope.eventService.addEventListener(directivesEvents.CHIPS_LIST_ELEMENT_SIZE_CHANGED, function () {

							chipsContainerWidth = chipsContainer.clientWidth;
							scope.hideOverflowingChips();

						});

					}

				};

				init();

			}

		}
	};

}());