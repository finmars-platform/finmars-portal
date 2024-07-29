/**
 * @typedef {Object} entityViewerEventService
 * @property {addEventListener} addEventListener
 * @property {removeEventListener} removeEventListener
 * @property {dispatchEvent} dispatchEvent
 */

(function () {

    /**
     *
     * @return { entityViewerEventService }
     */
    module.exports = function () {

        var events = {};

        /**
         * @typedef {Function} addEventListener
         * @param {String} eventName
         * @param {Function} callback
         * @return {number}
         */
        /** @type {addEventListener} */
        function addEventListener(eventName, callback) {

            if (!events.hasOwnProperty(eventName)) {
                events[eventName] = [];
            }

            events[eventName].push(callback);

            return events[eventName].length - 1

        }

        /**
         * @typedef {Function} removeEventListener
         * @param eventName {String}
         * @param index {Number}
         * @memberof entityViewerEventService
         */
        /**
         * @param eventName {String}
         * @param index {Number}
         */
        function removeEventListener(eventName, index) {

            if (!events.hasOwnProperty(eventName)) {
                throw "Event is not exist";
            }

            if (index < 0) {
                throw "Index is 0 or lesser";
            }

            if (index > events[eventName].length) {
                throw "Index is greater then listeners count"
            }

            delete events[eventName][index]

        }

        /**
         * @typedef {Function} dispatchEvent
         * @param {String} eventName
         * @param {Object} [argumentsObj]
         * @memberof entityViewerEventService
         */
        /**
         *
         * @param {String} eventName
         * @param {Object} [argumentsObj]
         */
        function dispatchEvent(eventName, argumentsObj) {
            // console.log('events[eventName]', events[eventName]);

            if (events.hasOwnProperty(eventName)) {

                events[eventName].forEach(function (callback) {

                	if (argumentsObj) {
						callback(argumentsObj);
					} else {
						callback();
					}

                })

            } /* else {

                // console.warn('Event ' + eventName + ' is not listened');
                // throw "Event is not listened"
            } */

        }

        function getListeners() {
            return events;
        }

        return {
            addEventListener: addEventListener,
            removeEventListener: removeEventListener,
            dispatchEvent: dispatchEvent,
            getListeners: getListeners
        }
    }

}());