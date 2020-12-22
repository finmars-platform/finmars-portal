(function () {

	'use strict';

	let directivesEvents = require("../services/events/directivesEvents");

	module.exports = function ($filter) {
		return {
			restrict: "E",
			scope: {
				chipsList: "=",

				eventService: "=",

				chipsDeletion: "@", // whether allow chips deletion
				chipsAddition: "@",
				orderChips: "@",
				isDisabled: "=",
                // dropdownMenuOptions: "=",
				chipsContainerWidth: "=", // in pixels

				hideOverflowingChips: "@", // [ 'false' ] - will prevent chips concealment. [ 'true' ] - by default

				onChipsDeletion: "&?", // pass function with argument that is array of deleted inputs
				onChipClick: "&?", // [ function({}) ]
				onAddChipClick: "&?"
			},
			templateUrl: "views/directives/chips-list-view.html",
			link: function (scope, elem, attr) {

				// scope.chipsToDisplay = [];
				scope.hiddenChips = [];
				scope.hiddenChipsTexts = "";

				scope.orderOptions = null

				if (scope.orderChips) {
					scope.orderOptions = "text"
				}

				let lastChipRendered = false;
				let addChipElem, addChipWidth = 0;

				/* scope.orderMenuOptions = null

                if (scope.orderMenuOptions) {
                    scope.orderMenuOptions = "name"
                } */

				let chipsContainer, chipsContainerWidth = 0;
                // let dropdownMenuFilter;

				scope.getChipsListClasses = function () {

					let classes = "";

					if (scope.chipsDeletion) {
						classes = "chips-deletion-enabled"
					}

					return classes;

				};

				scope.onChipClickMethod = function (chipData, $event) {

                    $event.stopPropagation();

					let chipsData = {
						hiddenChips: Array.isArray(chipData),
						data: chipData
					};

					if (scope.onChipClick) {
						scope.onChipClick({chipsData: chipsData, event: $event});
					}

				};

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
				scope.getChipClasses = chipData => {
					return chipData.classes ? chipData.classes : "";
				};


				scope.concealOverflowingChips = function (updateScope) {

					if (scope.hideOverflowingChips !== 'false') {

						setTimeout(function () { // wait for ng-repeat to finish rendering

							scope.hiddenChips = [];

							const expandChipWidth = 74;
							let chipsElemsList = elem[0].querySelectorAll('.chipWrapElem');
							let chipsWidth = 0; // size of .expand-chip (width + margins)

							const hideChips = function (index) {

								scope.hiddenChips = scope.chipsList.slice(index);
								getHiddenChipsTexts();

							};

							chipsElemsList.forEach(function (cElem) {
								cElem.classList.add('chip-hidden');
							});

							for (let i = 0; i < chipsElemsList.length; i++) {

								let cElem = chipsElemsList[i];
								chipsWidth += cElem.clientWidth;

								if (i + 1 === chipsElemsList.length) { // for the last chip

									if (chipsWidth > chipsContainerWidth) {

										hideChips(i);
										break;

									}


								} else if (chipsWidth + expandChipWidth > chipsContainerWidth) {

									hideChips(i);
									break;

								}

								cElem.classList.remove('chip-hidden');

							}

							if (updateScope) {
								scope.$apply();
							}

						}, 100);

					}

				};

				scope.onLastChipInit = function () {

					if (typeof scope.chipsAddition === 'string') {

						lastChipRendered = true;

						if (addChipElem) { // if addChipElem rendered
							scope.concealOverflowingChips(true);
						}

					} else {
						scope.concealOverflowingChips(true);
					}

				};

				scope.onAddChipInit = function () {

					addChipElem = elem[0].querySelector(".add-chip-wrap");
					addChipWidth = addChipElem.clientWidth;

					if (lastChipRendered) {
						scope.concealOverflowingChips(true);
					}

				};

				scope.deleteChips = function (chipsData, $event) {

					$event.stopPropagation();

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

					scope.concealOverflowingChips();

					if (scope.onChipsDeletion) {
						scope.onChipsDeletion({chipsData: chipsForDeletion});
					}


				};

                /* scope.selectOption = function (option) {

                    let newChip = {
                        id: option.id,
                        text: option.name
                    };

                    scope.chipsList.push(newChip);
                    scope.concealOverflowingChips();

                }; */

				let init = function () {

					if (scope.chipsContainerWidth) {

						chipsContainerWidth = scope.chipsContainerWidth - addChipWidth;

					} else {

						chipsContainer = elem[0].querySelector('.chipsListContainer');
						chipsContainerWidth = chipsContainer.clientWidth - addChipWidth;

					}

					if (scope.eventService) {

						scope.eventService.addEventListener(directivesEvents.CHIPS_LIST_CHANGED, function (argumentsObj) {

							/*
							argumentsObj properties
							chipsList: new array of chips
							updateScope: whether call scope.$apply at the end of concealOverflowingChips()
							*/
							scope.chipsList = argumentsObj.chipsList;
							scope.concealOverflowingChips(argumentsObj.updateScope);

						});

						scope.eventService.addEventListener(directivesEvents.CHIPS_LIST_ELEMENT_SIZE_CHANGED, function () {

							chipsContainerWidth = chipsContainer.clientWidth - addChipWidth;
							scope.concealOverflowingChips();

						});

                        /* scope.eventService.addEventListener(directivesEvents.DROPDOWN_MENU_OPTIONS_CHANGED, function (argumentsObj) {

                            if (argumentsObj.optionsList) {

                                scope.dropdownMenuOptions = argumentsObj.optionsList
                                scope.menuOptions = JSON.parse(JSON.stringify(scope.dropdownMenuOptions));

                            }

                        }); */

					}

					/* if (scope.dropdownMenuOptions) {

					    scope.menuOptions = JSON.parse(JSON.stringify(scope.dropdownMenuOptions));

                        scope.addDropdownMenuListeners = function () {

							chipsContainer.addEventListener("click", function () {
								scope.dropdownMenuShown = true
							});

                        	dropdownMenuFilter = elem[0].querySelector('.dropdownMenuFilter');

							dropdownMenuFilter.addEventListener('blur', function () {
								scope.dropdownMenuShown = false
							});

						}



                    } */
				};

				init();

			}

		}
	};

}());