/**
 * Created by szhitenev on 07.12.2016.
 */
(function () {

    'use strict';

    var resolve = function () {

        var result = '';

        if(window.location.hostname == 'localhost') {
            result = 'http://' + window.location.host;
        }

        if(window.location.hostname == 'dev.finmars.com') {
            // result = 'https://api.dev.finmars.com/api/v1/';
            result = 'https://dev.finmars.com';
        }

        if(window.location.hostname == 'ec2-18-196-215-43.eu-central-1.compute.amazonaws.com/') {
            result = 'http://ec2-18-196-215-43.eu-central-1.compute.amazonaws.com/api/v1/';
        }

        if(window.location.hostname == 'finmars.com') {
            // result = 'https://api.finmars.com';
            result = 'https://finmars.com';
        }

        result = result + '/api/v1/';

        return result;
    };

    module.exports = {
        resolve: resolve
    }

}());