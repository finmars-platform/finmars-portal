(function () {
    'use strict';

    module.exports = function ($compile) {
        return {
            restrict: 'A',
            scope: {
                popupTemplate: '@', // all data must be already rendered in template
                popupTemplateUrl: '@', // can bind data from popupData when compile in createPopup
                popupData: '=',
                closeOnClick: '=',

                popupX: '@', // set left position for popup (optional) ('left', 'right', pixels). Default - 'left' of target element
                popupY: '@',  // set top position for popup (optional) ('top', 'bottom', pixels). Default - 'bottom' of target element

                offsetX: '@', // add offset to left position
                offsetY: '@', // add offset to top position

                onSaveCallback: '&?'

            },
            templateUrl: 'views/directives/customInputs/popup-view.html',
            transclude: true,
            link: function (scope, elem, attrs) {

                scope.vm = scope.popupData;
                console.log('scope.vm', scope.vm);
                console.log('scope.popupTemplate', scope.popupTemplate)

                scope.isPopupOpen = false;
                console.log('scope', scope)

                var bodyElem = document.querySelector("body");
                var templateElem = elem[0].querySelector('template');
                var targetElement = elem[0].querySelector('.fields-popup-target');
                var popupBackdropElem;
                var popUpElem;
                console.log('templateElem', templateElem);


                var setPopupPosition = function () {
                    const coords = targetElement.getBoundingClientRect();
                    popUpElem.style.width = coords.width + 'px';

                    let positionX = coords.left; // default X
                    let positionY = coords.bottom; // default Y

                    if (scope.popupX) {
                        positionX = ['left', 'right'].includes(scope.popupX) ? coords[scope.popupX] : Number(scope.popupX);
                    }

                    if (scope.popupY) {
                        positionY = ['top', 'bottom'].includes(scope.popupY) ? coords[scope.popupY] : Number(scope.popupY);
                    }

                    if (scope.offsetX) {
                        positionX = positionX + Number(scope.offsetX);
                    }

                    if (scope.offsetY) {
                        positionY = positionY + Number(scope.offsetY);
                    }

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

                };

                var keyUpHandler = function (event) {
                    scope.isPopupOpen &&  event.key === "Escape" && removePopUp();
                };


                var resizeTimeout;
                var resizeThrottler = function () {

                    if ( !resizeTimeout ) {
                        resizeTimeout = setTimeout(function() {
                            resizeTimeout = null;
                            resizeHandler();
                        }, 66);
                    }

                };

                var resizeHandler = function (event) {
                    setPopupPosition();
                }

                var addListeners = function () {
                    document.addEventListener('keyup', keyUpHandler, {once: true});
                    window.addEventListener('resize', resizeThrottler);
                };

                var removeListeners = function () {
                    document.removeEventListener('keyup', keyUpHandler);
                    window.removeEventListener('resize', resizeThrottler);
                };

                var createPopup = function () {
                    var popupTemplate = templateElem.content.cloneNode(true);

                    if (scope.popupTemplateUrl) {
                        var contentElem = popupTemplate.querySelector('.popup-content-template-url');
                        contentElem.setAttribute('data-ng-include', scope.popupTemplateUrl)
                    } else if (scope.popupTemplate) {
                        var contentElem = popupTemplate.querySelector('.popup-content-template');
                        contentElem.innerHTML = scope.popupTemplate;
                    }

                    $compile($(popupTemplate))(scope);

                    popupBackdropElem = popupTemplate.querySelector('.popup-area-backdrop');
                    popUpElem = popupTemplate.querySelector('.popup-container');

                    $(bodyElem).append($(popupTemplate));

                    setTimeout(setPopupPosition, 0) // append is async. setPopupPosition must be called after append

                    addListeners();

                    scope.isPopupOpen = true;

                }

                var removePopUp = function () {

                    bodyElem.removeChild(popupBackdropElem);
                    bodyElem.removeChild(popUpElem);

                    removeListeners();

                    scope.isPopupOpen = false;

                }

                scope.onBackdropClick = function () {
                    scope.closeOnClick !== false && removePopUp();
                }


                scope.onTargetElementClick = function ($event) {
                    console.log('onTargetElementClick')

                    if (scope.isPopupOpen) {
                        return removePopUp();
                    }

                    var posX = $event.pageX;
                    var posY = $event.pageY;

                    createPopup(posX, posY);

                }

                scope.save = function () {

                    if (scope.onSaveCallback) {
                        scope.onSaveCallback();
                    }

                    return removePopUp();

                };


                scope.cancel = function () {

                    return removePopUp();

                };


                scope.init = function () {

                }

                scope.init();


            }
        }
    }

}());