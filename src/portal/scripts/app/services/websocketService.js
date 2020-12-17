/**
 * Created by szhitenev on 17.12.2020.
 */
(function () {

    'use strict';

    var callbacks = {}

    let send = function (data) {

        console.log('websocket send', data);

        if (window.ws) {

            window.ws.send(JSON.stringify(data));

        }

    };

    let addEventListener = function (event, callback) {

        if (!callbacks[event]) {
            callbacks[event] = [];
        }

        callbacks[event].push(callback);

        window.ws.onmessage = function (message) {

            console.log('Websocket.message ', message);

            try {

                var parsedMessage = JSON.parse(message.data)

                if (parsedMessage.hasOwnProperty('type')) {
                    callbacks[parsedMessage.type].forEach(function (callback) {
                        callback(parsedMessage.payload);
                    })
                } else {
                    console.log("Websocket onmessage error. Type is not set", message);
                }

            } catch (error) {
                console.log("Websocket onmessage error. Error: ", error);
                console.log("Websocket onmessage error. Message: ", message);
            }


        }

    };

    module.exports = {
        send: send,
        addEventListener: addEventListener,


    }

}());