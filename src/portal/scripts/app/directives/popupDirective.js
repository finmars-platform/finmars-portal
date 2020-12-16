(function () {

    'use strict';

    var evEvents = require('../services/entityViewerEvents');

    module.exports = function ($compile) {
        return {
            restrict: 'A',
            scope: {
                popupTemplate: '@', // all data must be already rendered in template
                popupTemplateUrl: '@', // can bind data from popupData when compile in createPopup
                popupData: '=',
				positionRelativeTo: '@', // ('mouse', 'elem'). Default - 'mouse'.

				closeOnClickOutside: '=',
				preventDefault: '@',
				rightClickOpen: '@', // open popup on right click
                backdropClasses: '@', // add css classes to backdrop

				popupX: '@', // set left position for popup (optional) ('left', 'right', pixels). Default - 'left' of target element
                popupY: '@',  // set top position for popup (optional) ('top', 'bottom', pixels). Default - 'bottom' of target element

                offsetX: '@', // add offset to left position
                offsetY: '@', // add offset to top position

                onSaveCallback: '&?',

                eventService: '=',

            },
            link: function (scope, elem, attrs) {

                scope.vm = scope.popupData;
				console.log('scope.popupTemplate', scope.popupTemplateUrl);
                console.log('#69 scope.vm', scope.vm)

                scope.isPopupOpen = false;

                // var templateElem = elem[0].querySelector('template');
                // var targetElement = elem[0].querySelector('.fields-popup-target');
                let popupBackdropElem = document.createElement("div");
				popupBackdropElem.classList.add('popup-area-backdrop');

				if (typeof scope.backdropClasses === 'string' && scope.backdropClasses.trim().length > 0) {

				    const classes = scope.backdropClasses.split(' ');

				    popupBackdropElem.classList.add(...classes);

                }

                let popUpElem = document.createElement("div");
				popUpElem.classList.add("popup-container");
                // console.log('templateElem', templateElem);


                let setPopupPosition = function (event) {
                    // const coords = targetElement.getBoundingClientRect();
					let positionX;
					let positionY;

					if (scope.positionRelativeTo === 'elem') {

						const coords = elem[0].getBoundingClientRect();
						popUpElem.style.width = coords.width + 'px';

						positionX = coords.left;
						positionY = coords.bottom;

						if (scope.popupX) {
							positionX = ['left', 'right'].includes(scope.popupX) ? coords[scope.popupX] : Number(scope.popupX);
						}

						if (scope.popupY) {
							positionY = ['top', 'bottom'].includes(scope.popupY) ? coords[scope.popupY] : Number(scope.popupY);
						}

					} else {

						positionX = event.clientX;
						positionY = event.clientY;

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
                        popUpElem.style.left = null;

                    } else if (positionX < 20) {
                        popUpElem.style.left = '0';
                        popUpElem.style.right = null;

                    } else {
                        popUpElem.style.left = positionX + 'px';
                        popUpElem.style.right = null;
                    }

                    if (positionY + popupHeight > windowHeight) {
                        popUpElem.style.bottom = '0';
                        popUpElem.style.top = null;

                    } else if (positionY < 20) {
                        popUpElem.style.top = '0';
                        popUpElem.style.bottom = null;

                    } else {
                        popUpElem.style.top = positionY + 'px';
                        popUpElem.style.bottom = null;
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

                    if (scope.eventService) {

                        closePopupListenerIndex = scope.eventService.addEventListener(evEvents.CLOSE_POPUP, removePopUp);

                    }

                };

                let removeListeners = function () {

                    document.removeEventListener('keyup', keyUpHandler);
                    window.removeEventListener('resize', resizeThrottler);

                    if (scope.eventService && closePopupListenerIndex >= 0) {

                        scope.eventService.removeEventListener(evEvents.CLOSE_POPUP, closePopupListenerIndex);

                    }

                };

				let createPopup = function () {

                	// var popupTemplate = templateElem.content.cloneNode(true);

                    if (scope.popupTemplateUrl) {

                    	/* var contentElem = popupTemplate.querySelector('.popup-content-template-url');
                        contentElem.setAttribute('data-ng-include', scope.popupTemplateUrl); */
						// popUpElem.setAttribute('ng-include', scope.popupTemplateUrl);
						popUpElem.innerHTML = '<div ng-include="' + scope.popupTemplateUrl + '"></div>';

                    } else if (scope.popupTemplate) {

                    	/* var contentElem = popupTemplate.querySelector('.popup-content-template');
                        contentElem.innerHTML = scope.popupTemplate; */
						popUpElem.innerHtml = scope.popupTemplate;
                    }

                    // $compile($(popupTemplate))(scope);
					$compile(popUpElem)(scope);
                    // popupBackdropElem = popupTemplate.querySelector('.popup-area-backdrop');
                    // popUpElem = popupTemplate.querySelector('.popup-container');

					document.body.appendChild(popupBackdropElem);
					document.body.appendChild(popUpElem);

					scope.$apply(); // needed to show ng-include content after $compile
                    // setTimeout(setPopupPosition, 0) // append is async. setPopupPosition must be called after append

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
                    console.log('testing onTargetElementClick', scope.rightClickOpen)

					if (scope.preventDefault || scope.rightClickOpen) {
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

                    removePopUp();

                };


                scope.cancel = function () {
                    removePopUp();
                };


                scope.init = function () {

					let openEvent = scope.rightClickOpen ? "contextmenu": "click";

					elem[0].addEventListener(openEvent, scope.onTargetElementClick);

					// TODO Victor 2020.12.15 maybe set this event listener when the popup is open? And remove after popup close?
					if (scope.closeOnClickOutside) {
						popupBackdropElem.addEventListener("click", removePopUp);
					}

                }

                scope.init();


            }
        }
    }

}());