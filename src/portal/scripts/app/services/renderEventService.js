(function () {

    'use strict';

    var events = {};

    var emit = function (eventName) {

        //console.log(' emit events', events);

        if (!events.hasOwnProperty(eventName)) {
            events[eventName] = {listeners: []};
        }

        if (events[eventName].listeners.length) {
            events[eventName].listeners.forEach(function (action) {
                action();
            })
        } else {
            console.warn('Event ' + eventName + ' is not listening');
        }


    };

    var on = function (eventName, action) {

        //console.log('on events', events);

        if (!events.hasOwnProperty(eventName)) {
            events[eventName] = {listeners: []};
        }

        events[eventName].listeners.push(action);

    };

    var destroy = function (eventName) {

        //console.log('events', events);

        delete events[eventName];
    };

    module.exports = {
        emit: emit,
        on: on,
        destroy: destroy
    }

}());