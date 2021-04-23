(function () {

	'use strict';

	const popupEvents = require('../services/events/popupEvents');

    module.exports = function ($compile) {
        return {
            restrict: 'A',
            scope: {
                popupId: '@',

                popupTemplate: '@', // all data must be already rendered in template
                popupTemplateUrl: '@', // can bind data from popupData when compile in createPopup
                popupData: '=',
				popupEventService: '=', // can be used to open popup

				openOn: '@', // ('click', 'right_click') - set event listener to open popup
				closeOnClickOutside: '=',
				closeOnMouseLeave: '=',
				preventDefault: '@',

				positionRelativeTo: '@', // ('mouse', 'element').

				popupClasses: '<', // add css classes to popup-container, example: popup-classes="class1 class2"
				backdropClasses: '=', // add css classes to backdrop

				/*
				position relative to element or mouse

					if positionRelativeTo === 'element'
						moves popup to element border

				*/
				relativePopupX: '@', // [ 'left', 'right' ] Default - 'left'
				relativePopupY: '@', // [ 'top', 'bottom' ] Default - 'bottom'

				popupWidth: '@', // [ 'element', 'content' ] Default - 'content'

				// obj with property value
				popupX: '=',
				popupY: '=',

				offsetX: '@', // add offset to the left
				offsetY: '@', // add offset to the top

				onCancel: '&?',
				onSaveCallback: '&?',
				onPopupClose: '='

            },
            link: function (scope, elem, attrs) {

				scope.isPopupOpen = false;

				let coords;
				let popupBackdropElem = document.createElement("div");
				popupBackdropElem.classList.add('popup-area-backdrop');

				if (scope.backdropClasses) {

					const classes = scope.backdropClasses.split(' ');

					popupBackdropElem.classList.add(...classes);

				}

				let popupElem = document.createElement("div");
				popupElem.classList.add("popup-container");

				let originalPopupData;

				if (scope.popupClasses) {

					const classes = scope.popupClasses.split(' ');

					popupElem.classList.add(...classes);

				}

				let setPopupPosition = function (event) {
					// const coords = targetElement.getBoundingClientRect();
					let positionX;

					if (scope.popupX) { positionX = scope.popupX.value }

					let positionY;

					if (scope.popupY) { positionY = scope.popupY.value }

					if (scope.positionRelativeTo === 'element') {

						if (!coords) { // better for rendering performance to declare it once
							coords = elem[0].getBoundingClientRect();
						}

						if (scope.popupWidth === 'element') {

							popupElem.style.width = coords.width + 'px';

						}

						if (!positionX) {
							positionX = scope.relativePopupX ? coords[scope.relativePopupX] : coords['left'];
						}

						if (!positionY) {
							positionY = scope.relativePopupY ? coords[scope.relativePopupY] : coords['bottom'];
						}

					}

					else if (scope.positionRelativeTo === 'mouse' && event) {

						if (!positionX) { positionX = event.clientX; }

						if (!positionY) { positionY = positionY = event.clientY; }

					}

					if (scope.offsetX) {
						positionX = positionX + Number(scope.offsetX);
					}

					if (scope.offsetY) {
						positionY = positionY + Number(scope.offsetY);
					}

					// Prevents popup from creeping out of window
					const popupHeight = popupElem.clientHeight;
					const popupWidth = popupElem.clientWidth;

					const windowHeight = document.body.clientHeight;
					const windowWidth = document.body.clientWidth;

					if (positionX + popupWidth > windowWidth) {
						popupElem.style.right = '0';
						popupElem.style.left = "";

					} else if (positionX < 20) {
						popupElem.style.left = '0';
						popupElem.style.right = "";

					} else {
						popupElem.style.left = positionX + 'px';
						popupElem.style.right = "";
					}

					if (positionY + popupHeight > windowHeight) {
						popupElem.style.bottom = '0';
						popupElem.style.top = "";

					} else if (positionY < 20) {
						popupElem.style.top = '0';
						popupElem.style.bottom = "";

					} else {
						popupElem.style.top = positionY + 'px';
						popupElem.style.bottom = "";
					}
					// < Prevents popup from creeping out of window >

				};

				let keyUpHandler = function (event) {

					if (scope.isPopupOpen && event.key === "Escape") {
						removePopUp();
					}

				};


				let resizeTimeout;
				let resizeThrottler = function () {

					if ( !resizeTimeout ) {

						resizeTimeout = setTimeout(function() {

							resizeTimeout = null;
							resizeHandler();

						}, 66);

					}

				};

				let resizeHandler = function (event) {
					setPopupPosition();
				}

				let closePopupListenerIndex = null;
				let addListeners = function () {

					document.addEventListener('keyup', keyUpHandler, {once: true});
					window.addEventListener('resize', resizeThrottler);

					if (scope.popupEventService) {

						closePopupListenerIndex = scope.popupEventService.addEventListener(popupEvents.CLOSE_POPUP, removePopUp);

					}

					if (scope.closeOnClickOutside) {
						popupBackdropElem.addEventListener("click", removePopUp);
					}

					if (scope.closeOnMouseLeave) {

						elem[0].addEventListener('mouseleave', onElementMouseLeave);
						popupBackdropElem.addEventListener('mouseenter', removePopUp);

					}
				};

				let removeListeners = function () {
					document.removeEventListener('keyup', keyUpHandler);
					window.removeEventListener('resize', resizeThrottler);

					if (scope.popupEventService && closePopupListenerIndex >= 0) {

						scope.popupEventService.removeEventListener(popupEvents.CLOSE_POPUP, closePopupListenerIndex);

					}

					if (scope.closeOnClickOutside) {
						popupBackdropElem.removeEventListener("click", removePopUp);
					}

					if (scope.closeOnMouseLeave) {

						elem[0].removeEventListener('mouseleave', onElementMouseLeave);
						popupBackdropElem.removeEventListener('mouseenter', removePopUp);

					}

				};

				let createPopup = function (doNotUpdateScope) {

					if (scope.popupTemplateUrl) {

						popupElem.innerHTML = '<div ng-include="' + scope.popupTemplateUrl + '"></div>';

					} else if (scope.popupTemplate) {

						popupElem.innerHTML = scope.popupTemplate;

					}

					$compile(popupElem)(scope);

					document.body.appendChild(popupBackdropElem);
					document.body.appendChild(popupElem);

					if (!doNotUpdateScope) {
						scope.$apply(); // needed for $compile when called not by angular method
					}

					addListeners();

					scope.isPopupOpen = true;

				};

				let removePopUp = function (event) {

					document.body.removeChild(popupBackdropElem);
					document.body.removeChild(popupElem);

					removeListeners();

					scope.isPopupOpen = false;
					if (scope.onPopupClose) {
						scope.onPopupClose();
					}

				}

                /* scope.onBackdropClick = function () {

					if (scope.closeOnClickOutside !== false) {
						removePopUp();
					}

                } */

				scope.onTargetElementClick = function (event) {

					if (scope.preventDefault || scope.openOn === 'right_click') {
						event.preventDefault();
					}

					if (scope.isPopupOpen) {
						removePopUp();

					} else {

						createPopup();

						setPopupPosition(event);

					}

				};

				const onTargetElementMouseEnter = function (event) {

					if (scope.isPopupOpen) {
						return;
					}

					createPopup();
					setPopupPosition(event);

				};

				const onElementMouseLeave = function (event) {

					if (popupElem.contains(event.toElement)) {

						return;

					}

					removePopUp();

				};

				const getOpenEvent =function (openOn) {
					switch (openOn) {
						case 'right_click':
							return {event: 'contextmenu', handler: scope.onTargetElementClick};
						case 'mouse_over':
							return {event: 'mouseenter', handler: onTargetElementMouseEnter};
						default:
							return {event: 'click', handler: scope.onTargetElementClick};
					}
				};


				scope.save = function () {

					if (scope.onSaveCallback) {
						scope.onSaveCallback();
					}

					if (scope.popupEventService) {

						scope.popupEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

					} else {
						removePopUp();
					}

				};

				scope.cancel = function () {

					if (scope.onCancel) {
						scope.onCancel();
					}

					if (scope.popupEventService) {

						scope.popupEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

					} else {
						removePopUp();
					}

				};


				scope.init = function () {

					if (scope.openOn) {

						const {event, handler} = getOpenEvent(scope.openOn);

						elem[0].addEventListener(event, handler);

					}

/*					if (scope.closeOnClickOutside) {
						popupBackdropElem.addEventListener("click", removePopUp);
					}

					if (scope.closeOnMouseLeave) {

						elem[0].addEventListener('mouseleave', onElementMouseLeave);
						popupBackdropElem.addEventListener('mouseenter', removePopUp);

					}*/

					if (scope.popupEventService) {

						scope.popupEventService.addEventListener(popupEvents.OPEN_POPUP, function(argumentObj) {

							if (!scope.isPopupOpen) {

								let doNotUpdateScope = (argumentObj && argumentObj.doNotUpdateScope);

								createPopup(doNotUpdateScope);
								setPopupPosition();

							}

						});

					}

				};

                scope.init();

			}
		}
	}

}());