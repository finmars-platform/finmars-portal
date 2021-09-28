'use strict';

export default function () {

	return {
		restrict: 'E',
		scope: {
			label: '@',
			model: '=',
			menuOptions: '=',
			favoriteOptions: '=',
			onChange: '&?'
		},
		templateUrl: "views/directives/customInputs/complex-dropdown-select-view.html",
		link: function (scope, elem, attrs) {

			scope.selectedOption = null;

			scope.menuOptions = scope.menuOptions.map(option => {
				option.folded = true;
				return option;
			});

			if (scope.model || scope.model === 0) {

				scope.selectedOption = scope.menuOptions.find(option => option.id === scope.model);
				scope.selectedOption.isActive = true;

				if (scope.favoriteOptions && scope.favoriteOptions.length) {
					let selFavOpt = scope.favoriteOptions.find(option => option.id === scope.model);
					if (selFavOpt) selFavOpt.isActive = true;
				}

			}

			const selectOption = function (groupName, option, _$popup) {

				_$popup.cancel();

				if (scope.selectedOption && scope.selectedOption.id === option.id) return;

				if (scope.selectedOption) scope.selectedOption.isActive = false; // unmark previous selected option

				if (scope.favoriteOptions && scope.favoriteOptions.length) {

					let prevSelectedFavOpt = scope.favoriteOptions.find(favOpt => favOpt.isActive);
					prevSelectedFavOpt.isActive = false;

					let selectedFavOpt = scope.favoriteOptions.find(favOpt => favOpt.id === option.id);
					selectedFavOpt.isActive = true;

				}

				const selOptGroup = scope.menuOptions.find(group => group.name === groupName);
				scope.selectedOption = selOptGroup.children.find(mOption => mOption.id === option.id);
				scope.selectedOption.isActive = true;

				scope.model = scope.selectedOption.id;
				scope.popupData.selectedOptions = scope.selectedOption.id;

				if (scope.onChange) {

					setTimeout(() => {
						scope.onChange({selected: scope.selectedOption});
					}, 0);

				}

			};

			scope.popupData = {
				selectedOptions: scope.model,
				menuOptions: scope.menuOptions,
				favoriteOptions: scope.favoriteOptions || [],
				showDescriptions: false,
				selectOptionCallback: selectOption
			}

		}
	}

}