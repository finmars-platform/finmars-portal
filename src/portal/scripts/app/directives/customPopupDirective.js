(function () {

	'use strict';

	const popupEvents = require('../services/events/popupEvents');

    module.exports = function ($rootScope, $compile, $timeout) {
        return {
            restrict: 'A',
            scope: {
                // popupId: '@', // for now scope.popupClasses and scope.backdropClasses are enough

				popupTemplate: '@', // all data must be already rendered in template
				popupTemplateUrl: '@', // can bind data from popupData when compile in createPopup
				popupData: '=',
				popupEventService: '=', // can be used to open popup
				noBackdrop: '@',
				isDisabled: '=',

				openOn: '@', // [ 'click', 'right_click', 'mouse_over' ] - set event listener to open popup.
				closeOnClickOutside: '@', // Default - 'true'
				closeOnMouseLeave: '@',
				preventDefault: '@',

				positionRelativeTo: '@', // ['mouse', 'element'].
				//region this properties work only if scope.positionRelativeTo === 'element'

				/*
				position relative to element or mouse

					if positionRelativeTo === 'element'
						moves popup to element border

				*/
				relativePopupX: '@', // [ 'left', 'right' ] Default - 'left'
				relativePopupY: '@', // [ 'top', 'bottom' ] Default - 'bottom'

				popupWidth: '@', // [ 'element', 'content' ] Default - 'content'
				popupMinWidth: '@', // [ 'element' ]
				//endregion

				// If you need to change classes dynamically, do it through template and popupData
				popupClasses: '@', // add css classes to popup-container, example: popup-classes="class1 class2"
				backdropClasses: '@', // add css classes to backdrop

				// obj with property 'value'
				popupX: '=',
				popupY: '=',

				offsetX: '@', // add offset to the left in pixels
				offsetY: '@', // add offset to the top in pixels

				onCancel: '&?',
				onSave: '&?'

			},
			link: function (scope, elem, attrs) {

				scope.isPopupOpen = false;

				const popupWrap = document.querySelector(".dialog-containers-wrap");

				let coords;
				let popupBackdropElem;
				/** Wait for width of popupElem to recalculate. When opening popup while page is still rendering. */
				let setPosTimeout = 150;

				if (scope.noBackdrop !== 'true') popupBackdropElem = document.createElement("div");

				if (popupBackdropElem) {

					popupBackdropElem.classList.add('popup-area-backdrop');

					if (scope.backdropClasses) {

						const classes = scope.backdropClasses.split(' ');

						popupBackdropElem.classList.add(...classes);

					}

				}

				let popupElem = document.createElement("div");
				popupElem.classList.add("popup-container");


				let openPopupEvent;
				let resizeObserverTo;

				/**
				 * Wait until popup width calculated by browser
				 * on slower devices.
				 *
				 * @type {ResizeObserver}
				 */
				const popupElemObserver = new ResizeObserver(entries => {

					let popupElemEntry = entries[0];

					if (popupElemEntry.contentRect.width > 0) {

						if (!resizeObserverTo) {
							// calculate position right after showing popup
							setPopupPosition(openPopupEvent);
						}

						$timeout.cancel(resizeObserverTo);

						resizeObserverTo = $timeout(function () {
							/* *
							 * call again because sizes of popup
							 * can change at the end of its rendering
							 * */
							setPopupPosition(openPopupEvent);
							openPopupEvent = null;

							popupElemObserver.unobserve(popupElem);
							resizeObserverTo = undefined;

						}, 300);

					}

				})

				// let originalPopupData;
				let popupContentScope;

				if (scope.popupClasses) {

					let classes = scope.popupClasses;

					if (typeof scope.popupClasses === 'string') {
						classes = scope.popupClasses.split(' ');
					}

					popupElem.classList.add(...classes);

				}

				//region Apply defaults
				if (!scope.positionRelativeTo) scope.positionRelativeTo = 'mouse';
				//endregion

				const setPopupPosition = function (event) {
					// const coords = targetElement.getBoundingClientRect();
					let positionX;
					if (scope.popupX) positionX = scope.popupX.value;

					let positionY;
					if (scope.popupY) positionY = scope.popupY.value;

					let popupHeight = popupElem.clientHeight;
					let popupMinWidth = 0;
					let popupWidth = popupElem.clientWidth;

					if (scope.popupMinWidth === 'element') {

						coords = elem[0].getBoundingClientRect();

						popupMinWidth = coords.width;
						popupWidth = Math.max(popupWidth, popupMinWidth);

					}

					if ( popupMinWidth && !isNaN(popupMinWidth) ) {
						popupElem.style['min-width'] = popupMinWidth + 'px';
					}

					if (scope.positionRelativeTo === 'element') {

						/*						if (!coords) { // better for rendering performance to declare it once
													coords = elem[0].getBoundingClientRect();
												}*/

						coords = elem[0].getBoundingClientRect();

						if (scope.popupWidth === 'element') {

							popupWidth = Math.max(coords.width, popupMinWidth);
							popupElem.style.width = popupWidth + 'px';

						}

						if (!positionX) {
							// positionX = scope.relativePopupX ? coords[scope.relativePopupX] : coords['left'];
							if (scope.relativePopupX === 'right') {
								positionX = coords['right'] - popupWidth;

							} else {
								positionX = coords['left'];
							}

						}

						if (!positionY) {
							positionY = scope.relativePopupY ? coords[scope.relativePopupY] : coords['bottom'];
						}

					}
					else if (scope.positionRelativeTo === 'mouse') {

						if (event) {

							if (!positionX) positionX = event.clientX;

							if (!positionY) positionY = positionY = event.clientY;

						} else {
							console.error("event object for mouse action is not defined")
						}

					}

					if (scope.offsetX) {
						positionX = positionX + Number(scope.offsetX);
					}

					if (scope.offsetY) {
						positionY = positionY + Number(scope.offsetY);
					}

					// Prevents popup from creeping out of window
					const windowHeight = document.body.clientHeight;
					const windowWidth = document.body.clientWidth;

					if (popupHeight > windowHeight) popupHeight = windowHeight;

					if (positionX + popupWidth > windowWidth) {
						popupElem.style.right = '0';
						popupElem.style.left = "";

					} /*else if (positionX < 20) {
						popupElem.style.left = '0';
						popupElem.style.right = "";

					}*/ else {
						popupElem.style.left = positionX + 'px';
						popupElem.style.right = "";
					}

					if (positionY + popupHeight > windowHeight) {
						popupElem.style.bottom = '0';
						popupElem.style.top = "";

					}
					else {
						popupElem.style.top = positionY + 'px';
						popupElem.style.bottom = "";
					}
					// < Prevents popup from creeping out of window >

				};

				let keyUpHandler = function (event) {

					if (scope.isPopupOpen && event.key === "Escape") {
						cancelPopup();
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

				const resizeHandler = function (event) {
					// wait for width calculation for popupElement
					setPopupPosition();
				}

				const bodyClickHandler = function (event) {

					const clickTarget = event.target;

					if (!elem[0].contains(clickTarget) && !popupElem.contains(clickTarget)) {
						scope.cancel();
					}

				};

				let closePopupListenerIndex = null;
				const addListeners = function () {

					document.addEventListener('keyup', keyUpHandler, {once: true});
					window.addEventListener('resize', resizeThrottler);

					if (scope.popupEventService) {

						closePopupListenerIndex = scope.popupEventService.addEventListener(popupEvents.CLOSE_POPUP, cancelPopup);

					}

					if (scope.closeOnClickOutside !== 'false') {
						popupBackdropElem.addEventListener("click", scope.cancel);
						// document.body.addEventListener("click", bodyClickHandler);
					}

					if (scope.closeOnMouseLeave === 'true') {

						elem[0].addEventListener('mouseleave', onElementMouseLeave);
						if (popupBackdropElem) popupBackdropElem.addEventListener('mouseenter', scope.cancel);

					}
				};

				const removeListeners = function () {
					document.removeEventListener('keyup', keyUpHandler);
					window.removeEventListener('resize', resizeThrottler);

					if (scope.popupEventService && closePopupListenerIndex >= 0) {

						scope.popupEventService.removeEventListener(popupEvents.CLOSE_POPUP, closePopupListenerIndex);

					}

					if (scope.closeOnClickOutside !== 'false') {
						popupBackdropElem.removeEventListener("click", scope.cancel);
						// document.body.removeEventListener("click", bodyClickHandler);
					}

					if (scope.closeOnMouseLeave === 'true') {

						elem[0].removeEventListener('mouseleave', onElementMouseLeave);
						if (popupBackdropElem) popupBackdropElem.removeEventListener('mouseenter', scope.cancel);

					}

				};

				const createScopeForPopupContent = () => {

					popupContentScope = $rootScope.$new(false, scope);

					popupContentScope.popupData = scope.popupData;
					popupContentScope._$popup = scope._$popup;

					popupContentScope.save = scope.save;
					popupContentScope.cancel = scope.cancel;

					if (scope.popupEventService) popupContentScope.popupEventService = scope.popupEventService;

					return popupContentScope;

				};

				const createPopup = function (doNotUpdateScope) {

					if (scope.popupTemplateUrl) {

						if (scope.popupTemplateUrl.startsWith('"')) {
							throw new Error("Use quotes instead of double quotes to encase template url path.");
						}

						if (!scope.popupTemplateUrl.startsWith("'")) {
							scope.popupTemplateUrl = "'" + scope.popupTemplateUrl + "'";
						}

						popupElem.innerHTML = '<div ng-include="' + scope.popupTemplateUrl + '"></div>';

					} else if (scope.popupTemplate) {

						popupElem.innerHTML = scope.popupTemplate;

					}

					popupContentScope = createScopeForPopupContent();

					$compile(popupElem)(popupContentScope);

					if (popupBackdropElem) popupWrap.appendChild(popupBackdropElem);
					popupWrap.appendChild(popupElem);

					if (!doNotUpdateScope) {
						scope.$apply(); // needed for $compile when called not by angular method
					}

					addListeners();

					scope.isPopupOpen = true;

				};

				const removePopUp = function (event) {

					if (popupBackdropElem) popupWrap.removeChild(popupBackdropElem);
					popupWrap.removeChild(popupElem);

					removeListeners();

					scope.isPopupOpen = false;

					if (popupContentScope) popupContentScope.$destroy();

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

					if (scope.isDisabled) {
						return;
					}
					/*if (scope.isPopupOpen) {
						removePopUp();

					} else {

						createPopup();

						setPopupPosition(event);

					}*/
					if (!scope.isPopupOpen) {

						openPopupEvent = event;
						popupElemObserver.observe(popupElem);

						createPopup();

						// wait for width calculation for popupElement
						/*$timeout(function() {
							setPopupPosition(event);
						}, setPosTimeout);*/

					}

				};

				const onTargetElementMouseEnter = function (event) {

					if (scope.isPopupOpen || scope.isDisabled) {
						return;
					}

					openPopupEvent = event;
					popupElemObserver.observe(popupElem);

					createPopup();

					// wait for width calculation for popupElement
					/*$timeout(function() {
						setPopupPosition(event);
					}, setPosTimeout);*/

				};

				const onElementMouseLeave = function (event) {

					if (popupElem.contains(event.toElement)) {

						return;

					}

					// removePopUp();
					scope.cancel();

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

					if (scope.onSave) {
						scope.onSave();
					}

					if (scope.popupEventService) {

						scope.popupEventService.dispatchEvent(popupEvents.CLOSE_POPUP, {onCancelCallback: false});

					} else {
						removePopUp();
					}

				};

				const cancelPopup = function (argumentsObj) {

					removePopUp();

					if (scope.onCancel && (!argumentsObj || argumentsObj.onCancelCallback !== false)) {
						scope.onCancel();
					}

				}

				scope.cancel = function () {

					if (scope.popupEventService) {
						scope.popupEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

					} else {
						cancelPopup();
					}

				};


				scope.init = function () {

					scope._$popup = {
						cancel: scope.cancel
					}

					if (scope.openOn) {

						const {event, handler} = getOpenEvent(scope.openOn);

						elem[0].addEventListener(event, handler);

					}

					/* if (scope.closeOnClickOutside) {
						popupBackdropElem.addEventListener("click", removePopUp);
					}

					if (scope.closeOnMouseLeave === 'true') {

						elem[0].addEventListener('mouseleave', onElementMouseLeave);
						popupBackdropElem.addEventListener('mouseenter', removePopUp);

					} */

					if (scope.popupEventService) {

						scope.popupEventService.addEventListener(popupEvents.OPEN_POPUP, function(argumentObj) {

							if (!scope.isPopupOpen) {

								let doNotUpdateScope = (argumentObj && argumentObj.doNotUpdateScope);

								popupElemObserver.observe(popupElem);
								createPopup(doNotUpdateScope);

								// wait for width calculation for popupElement
								/*$timeout(function() {
									setPopupPosition();
								}, setPosTimeout);*/

							}

						});

					}

				};

				scope.init();

				scope.$on("$destroy", function () {
					popupElemObserver.disconnect();
				});

			}
		}
	}

}());