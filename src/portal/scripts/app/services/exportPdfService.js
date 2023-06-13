/**
 * Created by szhitenev on 13.01.2017.
 */
(function () {

    'use strict';


    var generatePdf = function (data) {

        // return window.fetch('http://0.0.0.0:5000/generate/',
        return window.fetch('/services/pdf/generate/',
            {
                method: 'POST',
                credentials: 'include', // disable on local development
                body: JSON.stringify(data),
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return data.blob();
        })

    };

    module.exports = {
        generatePdf: generatePdf
    }

}());