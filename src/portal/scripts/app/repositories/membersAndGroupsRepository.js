(function () {
    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var xhrService = require('../../../../core/services/xhrService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function (type) {
        var fetchUrl = '';
        type === 'members' ? fetchUrl = 'users/member/' : fetchUrl = 'users/group/';
        return xhrService.fetch(baseUrl + fetchUrl,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getMemberOrGroupByKey = function (type, id) {
        var fetchUrl = '';
        type === 'members' ? fetchUrl = 'users/member/' : fetchUrl = 'users/group/';
        return xhrService.fetch(baseUrl + fetchUrl + id + '/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            });
    }

    var create = function (type, data) {
        var fetchUrl = '';
        type === 'members' ? fetchUrl = 'users/member/' : fetchUrl = 'users/group/';
        console.log('url is', baseUrl + fetchUrl);
        return xhrService.fetch(baseUrl + fetchUrl,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var update = function (type, id, data) {
        var fetchUrl = '';
        type === 'members' ? fetchUrl = 'users/member/' : fetchUrl = 'users/group/';
        return xhrService.fetch(baseUrl + fetchUrl + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var deleteByKey = function (type, id) {
        var fetchUrl = '';
        type === 'members' ? fetchUrl = 'users/member/' : fetchUrl = 'users/group/';
        return xhrService.fetch(baseUrl + fetchUrl + id + '/',
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return new Promise(function (resolve, reject) {
                resolve({status: 'deleted'});
            });
            //return data.json();
        })
    };

    var inviteUser = function (username) {

        return xhrService.fetch(baseUrl + 'users/create-invite-to-master-user/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({username: username})
        })

    };

    module.exports = {
        getList: getList,
        getMemberOrGroupByKey: getMemberOrGroupByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,
        inviteUser: inviteUser
    }
}());