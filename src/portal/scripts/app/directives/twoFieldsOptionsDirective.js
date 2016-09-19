(function () {

	'use strict';

	module.exports = function () {
		return {
			restrict: 'E',
			scope: {
				allOptions: "=",
				selectedOptions: "="
			},
			templateUrl: 'views/directives/two-fields-options-view.html',
			link: function (scope, elem, attr) {
				// var getAvailableOptions = function () {
				// 	if (scope.selectedOptions && selectedOptions.length > 0) {
				// 		var sOptionsId = scope.selectedOptions['id'];
				// 		scope.selectedOptions.map(function(sOption) {
				// 			scope.allOptions.map(function(option) {
				// 				if (sOption !== option['id']) {
				// 					scope.allOptions.push(option);
				// 				}
				// 			});
				// 		});
				// 	}
				// }
				console.log('two columns directive', scope.allOptions, scope.selectedOptions);
				
				scope.highlightOption = function (ev) {
					var clickedOption = ev.currentTarget;
					if ($(clickedOption).hasClass('active-option')) {
						$(clickedOption).removeClass('active-option');
					}
					else {
						$(clickedOption).addClass('active-option');	
					}
				}
				// switch options to selected
				scope.switchOptions = function (optionsSelector, spliceScope, pushScope) {
					// var hOptions = $('p.two-fields-available-option.active-option');
					var hOptions = $(optionsSelector);
					if (hOptions && hOptions.length > 0) {
						hOptions.each(function() {
							var hOption = $(this);
							var hOptionId = parseInt(hOption.data('member-group-id'));
							// scope.allOptions.map(function(option, optionIndex) {
							// 	if (option['id'] === hOptionId) {
							// 		console.log('before select', scope.allOptions, scope.selectedOptions);
							// 		scope.allOptions.splice(optionIndex, 1); //remove options from available
							// 		scope.selectedOptions.push(option); // add options to selected
							// 		console.log('after select', scope.allOptions, scope.selectedOptions);
							// 	}
							// });
							spliceScope.map(function(option, optionIndex) {
								if (option['id'] === hOptionId) {
									spliceScope.splice(optionIndex, 1); //remove options from available
									pushScope.push(option); // add options to selected
									console.log('after select', scope.allOptions, scope.selectedOptions);
								}
							});
						});
					}
				}

				// getAvailableOptions();
			}
		}
	}

}());