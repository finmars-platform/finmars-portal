(function () {

	'use strict';

	const popupEvents = require('../services/events/popupEvents');

    module.exports = function ($compile) {
        return {
            restrict: 'A',
            scope: {
                popupTemplate: '@', // all data must be already rendered in template
                popupTemplateUrl: '@', // can bind data from popupData when compile in createPopup
                popupData: '=',
				popupEventService: '=', // can be used to open popup

				openOn: '@', // ('click', 'right_click') - set event listener to open popup
				closeOnClickOutside: '=',
				preventDefault: '@',

				positionRelativeTo: '@', // ('mouse', 'element').

                popupClasses: '=', // add css classes to popup-container, example: popup-classes="class1 class2"
                backdropClasses: '=', // add css classes to backdrop

				// position relative to element or mouse
				relativePopupX: '@', // [ 'left', 'right' ] Default - 'left'
				relativePopupY: '@', // [ 'top', 'bottom' ] Default - 'bottom'

                popupWidth: '@', // [ 'element', 'content' ] Default - 'content'

				// obj with property value
				popupX: '=',
				popupY: '=',

                offsetX: '@', // add offset to the left
                offsetY: '@', // add offset to the top

                onSaveCallback: '&?',

            },
            link: function (scope, elem, attrs) {
                console.log('#69 popup', scope)

                scope.isPopupOpen = false;

                // var templateElem = elem[0].querySelector('template');
                // var targetElement = elem[0].querySelector('.fields-popup-target');
				let coords;
                let popupBackdropElem = document.createElement("div");
				popupBackdropElem.classList.add('popup-area-backdrop');

				if (scope.backdropClasses) {

				    const classes = scope.backdropClasses.split(' ');

				    popupBackdropElem.classList.add(...classes);

                }

                let popUpElem = document.createElement("div");
				popUpElem.classList.add("popup-container");
                // console.log('templateElem', templateElem);

                if (scope.popupClasses) {

                    const classes = scope.popupClasses.split(' ');

                    popUpElem.classList.add(...classes);

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

                            popUpElem.style.width = coords.width + 'px';

                        }

						if (!positionX) {
							positionX = scope.relativePopupX ? coords[scope.relativePopupX] : coords['left'];
						}

						if (!positionY) {
							positionY = scope.relativePopupY ? coords[scope.relativePopupY] : coords['bottom'];
						}

					}

					else if (scope.positionRelativeTo === 'mouse') {

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
                    const popupHeight = popUpElem.clientHeight;
                    const popupWidth = popUpElem.clientWidth;

                    const windowHeight = document.body.clientHeight;
                    const windowWidth = document.body.clientWidth;

                    if (positionX + popupWidth > windowWidth) {
                        popUpElem.style.right = '0';
                        popUpElem.style.left = "";

                    } else if (positionX < 20) {
                        popUpElem.style.left = '0';
                        popUpElem.style.right = "";

                    } else {
                        popUpElem.style.left = positionX + 'px';
                        popUpElem.style.right = "";
                    }

                    if (positionY + popupHeight > windowHeight) {
                        popUpElem.style.bottom = '0';
                        popUpElem.style.top = "";

                    } else if (positionY < 20) {
                        popUpElem.style.top = '0';
                        popUpElem.style.bottom = "";

                    } else {
                        popUpElem.style.top = positionY + 'px';
                        popUpElem.style.bottom = "";
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
                };

                let removeListeners = function () {
                    document.removeEventListener('keyup', keyUpHandler);
                    window.removeEventListener('resize', resizeThrottler);

                    if (scope.popupEventService && closePopupListenerIndex >= 0) {

                        scope.popupEventService.removeEventListener(popupEvents.CLOSE_POPUP, closePopupListenerIndex);

                    }

                };

				let createPopup = function (doNotUpdateScope) {
                	// var popupTemplate = templateElem.content.cloneNode(true);

                    if (scope.popupTemplateUrl) {

                    	popUpElem.innerHTML = '<div ng-include="' + scope.popupTemplateUrl + '"></div>';

                    } else if (scope.popupTemplate) {

                    	/* var contentElem = popupTemplate.querySelector('.popup-content-template');
                        contentElem.innerHTML = scope.popupTemplate; */
						popUpElem.innerHtml = scope.popupTemplate;
                    }

					$compile(popUpElem)(scope);

					document.body.appendChild(popupBackdropElem);
					document.body.appendChild(popUpElem);

					if (!doNotUpdateScope) {
						scope.$apply(); // needed for $compile when called not by angular method
					}

                    addListeners();

                    scope.isPopupOpen = true;

                }

				let removePopUp = function () {

					document.body.removeChild(popupBackdropElem);
					document.body.removeChild(popUpElem);

                    removeListeners();

                    scope.isPopupOpen = false;

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

                }

                scope.save = function () {

                    if (scope.onSaveCallback) {
                        scope.onSaveCallback();
                    }

					scope.popupEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                };


                scope.cancel = function () {
                    // removePopUp();
					scope.popupEventService.dispatchEvent(popupEvents.CLOSE_POPUP);
                };

                scope.init = function () {

                	if (scope.openOn) {

                		let openEvent = scope.openOn === "right_click" ? "contextmenu" : "click";

						elem[0].addEventListener(openEvent, scope.onTargetElementClick);

					}

					if (scope.closeOnClickOutside) {
						popupBackdropElem.addEventListener("click", removePopUp);
					}

					if (scope.popupEventService) {

						scope.popupEventService.addEventListener(popupEvents.OPEN_POPUP, function(argumentObj) {

							if (!scope.isPopupOpen) {

								let doNotUpdateScope = (argumentObj && argumentObj.doNotUpdateScope);

								createPopup(doNotUpdateScope);
								setPopupPosition();

							}

						});

					}

                }

                scope.init();

            }
        }
    }

}());