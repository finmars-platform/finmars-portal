/**
 * Created by szhitenev on 13.01.2017.
 */
(function () {

    'use strict';

    var generatePdf = function (data) {

        return window.fetch('/services/pdf',
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(data),
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return data.json();
        })

    };

    module.exports = {
        generatePdf: generatePdf
    }

}());