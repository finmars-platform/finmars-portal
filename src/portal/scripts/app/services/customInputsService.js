const popupEvents = require("./events/popupEvents");

/** @module customInputsService */
export default function () {

    /**
     *
     * @param {Object} elem - element of directive
     * @param {Object} event
     * @param {Object} popupEventService
     * @memberOf module:customInputsService
     */
    function closeMenuOnClickOutside (elem, event, popupSelector, popupEventService) {

        const target = event.target;

        const selElem = target.closest(elem[0].tagName);
        const outsideSel = !selElem || !elem[0].isSameNode(selElem);
        const outsidePopup = !target.closest(popupSelector);

        if (outsideSel && outsidePopup) {
            popupEventService.dispatchEvent(popupEvents.CLOSE_POPUP);
        }

    }

    /**
     *
     * @param {Object} event
     * @param {Object} popupEventService
     * @memberOf module:customInputsService
     */
    function closeMenuByKeydown (event, popupEventService) {

        var pressedKey = event.key;

        switch (pressedKey) {
            case "Tab":
                popupEventService.dispatchEvent(popupEvents.CLOSE_POPUP);
                break;

            case "Esc":
            case "Escape":
                popupEventService.dispatchEvent(popupEvents.CLOSE_POPUP);
                break;
        }

    }

    /**
     * Called by ngInit inside popup for dropdown menu
     *
     * @param {HTMLElement} inputContainer
     * @param {HTMLElement} inputElem
     * @param {Function} closeOnClickOutsideFn
     * @param {Function} closeByKeydownFn
     */
    function onMenuInit(inputContainer, inputElem, closeOnClickOutsideFn, closeByKeydownFn) {

        inputContainer.classList.add('custom-input-focused');

        inputElem.select();
        inputElem.focus();

        document.addEventListener('click', closeOnClickOutsideFn);
        document.addEventListener('keydown', closeByKeydownFn);

    }

    return {
        closeMenuOnClickOutside: closeMenuOnClickOutside,
        closeMenuByKeydown: closeMenuByKeydown,
        onMenuInit: onMenuInit,
    }

}