(function () {

	'use strict';

	module.exports = function () {
		return {
			restrict: 'E',
			scope: {
				allOptions: "=",
				selectedOptions: "=",
				nameProperty: "@",
				classes: "="
			},
			templateUrl: 'views/directives/two-fields-options-view.html',
			link: function (scope, elem, attr) {

				scope.highlightOption = function (ev) {

					var clickedOption = ev.currentTarget;
					if ($(clickedOption).hasClass('active-option')) {
						$(clickedOption).removeClass('active-option');
					}
					else {
						$(clickedOption).addClass('active-option');	
					}

				};

				// switch options to selected
				scope.switchOptions = function (mode) {

					var optionsType = "";
					var removeFrom = [];
					var addTo = [];

					switch (mode) {
						case "select":
							optionsType = ".two-fields-available-option";
							removeFrom = scope.allOptions;
							addTo = scope.selectedOptions;
							break;
						case "deselect":
							optionsType = ".two-fields-selected-option";
							removeFrom = scope.selectedOptions;
							addTo = scope.allOptions;
							break;
						default:
							return false;
					}

					// var fieldOptions = elem.find('.active-option' + optionsType);
					var fieldOptions = elem[0].querySelectorAll('.active-option' + optionsType);

					if (fieldOptions && fieldOptions.length > 0) {

						for (var i = 0; i < fieldOptions.length; i++) {

							var hOption = fieldOptions[i];
							var hOptionId = hOption.dataset.memberGroupId;

							removeFrom.forEach(function(option, optionIndex) {

								if (option.id == hOptionId) {
									removeFrom.splice(optionIndex, 1); //remove options from available
									addTo.push(option); // add options to selected
								}

							});
						}

					}
				};

				scope.switchOptionOnDoubleClick = function (mode, optionToSwitchId) {

					var removeFrom = [];
					var addTo = [];

					switch (mode) {
						case "select":
							removeFrom = scope.allOptions;
							addTo = scope.selectedOptions;
							break;
						case "deselect":
							removeFrom = scope.selectedOptions;
							addTo = scope.allOptions;
							break;
						default:
							return false;
					}

					var i;
					for (i = 0; i < removeFrom.length; i++) {
						var option = removeFrom[i];
						if (optionToSwitchId === option.id) {
							removeFrom.splice(i, 1);
							addTo.push(option);
						}
					}

				};

				scope.selectAll = function () {
					var mergedArray = [];

					mergedArray = scope.selectedOptions.concat(scope.allOptions);
					scope.selectedOptions = mergedArray;
					scope.allOptions = [];

				};

				scope.deselectAll = function () {
					var mergedArray = [];

					mergedArray = scope.allOptions.concat(scope.selectedOptions);
					scope.allOptions = mergedArray;
					scope.selectedOptions = [];

				}


			}
		}
	}

}());