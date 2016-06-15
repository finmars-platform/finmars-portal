/**
 * Created by szhitenev on 04.05.2016.
 */
(function(){

    'use strict';

    var baseUrl = '/api/v1/';


    var getList = function(){
        return window.fetch(baseUrl + 'notifications/notification/?all=true&type=',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return data.json();
        })
    };

    module.exports = {
        getList: getList
    }

}());