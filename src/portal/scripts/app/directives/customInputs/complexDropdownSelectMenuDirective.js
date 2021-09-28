'use strict';

const utilsHelper = require('../../helpers/utils.helper');

export default function () {

	return {
		restrict: 'E',
		scope: {
			model: '=',
			menuOptions: '=',
			favoriteOptions: '=',
			popupData: '=',

			showDescriptions: '=',

			selectOptionCallback: '&'
		},
		templateUrl: "views/directives/customInputs/complex-dropdown-select-menu-view.html",
		link: function (scope, elem, attrs) {

			if (typeof scope.showDescriptions !== 'boolean') scope.showDescriptions = false;

			scope.filterTerms = '';
			const scrollElem = elem[0].querySelector('.cdsContentScroll');

			scope.filterGroups = function (value, index, array) {

				if (scope.filterTerms) {

					const childThatPassedFilterIndex = value.children.findIndex(child => {

						const name = child.name.toLowerCase();
						const terms = scope.filterTerms.toLowerCase();

						return name.includes(terms);

					});

					return childThatPassedFilterIndex > -1;

				}

				return true;

			};

			scope.onScrollBarChange = function () {

				setTimeout(() => { // wait until the end of dom elements reflow

					scope.hasYScroll = scrollElem.scrollHeight > scrollElem.clientHeight;

					if (scope.hasYScroll) {
						scrollElem.classList.add('has-y-scroll');

					} else {
						scrollElem.classList.remove('has-y-scroll');
					}

				}, 100);

			};

			scope.toggleDescription = function () {

				scope.showDescriptions = !scope.showDescriptions;

				scope.onScrollBarChange();

			};

			scope.toggleGroupFolding = function (group) {

				group.folded = !group.folded;

				scope.onScrollBarChange();

			};

			scope.optionIsFavorite = function (optionId) {
				return !!scope.favoriteOptions.find(option => option.id === optionId);
			};

			scope.addToFavorites = function (groupName, option, $event) {

				$event.stopPropagation();

				const favOption = {...{}, ...option};
				favOption.groupName = groupName;

				scope.favoriteOptions.push(favOption);

			};

			scope.removeFromFavorites = function (optionId, $event) {

				$event.stopPropagation();

				const optIndex = scope.favoriteOptions.findIndex(option => option.id === optionId);
				scope.favoriteOptions.splice(optIndex, 1);

			};

			const onWindowResize = utilsHelper.throttle(function () {
				scope.hasYScroll = scrollElem.scrollHeight > scrollElem.clientHeight;
			}, 500);

			window.addEventListener('resize', onWindowResize);

			scope.$on('$destroy', function () {
				window.removeEventListener('resize', onWindowResize);
			});

		}
	};

}