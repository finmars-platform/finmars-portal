(function () {
    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var xhrService = require('../../../../core/services/xhrService');
    var baseUrlService = require('../services/baseUrlService');

    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');

    var baseUrl = baseUrlService.resolve();

    var getMembersList = function () {

        return xhrService.fetch(baseUrl + 'users/member/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getMemberByKey = function (id) {

        return xhrService.fetch(baseUrl + 'users/member/' + id + '/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            });
    };


    var updateMember = function (id, data) {

        return xhrService.fetch(baseUrl + 'users/member/' + id + '/',
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

    var deleteMemberByKey = function (id) {
        return xhrService.fetch(baseUrl + 'users/member/' + id + '/',
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
        })
    };

    var getGroupsList = function () {
        return xhrService.fetch(baseUrl + 'users/group/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getGroupByKey = function (id) {
        return xhrService.fetch(baseUrl + 'users/group/' + id + '/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            });
    };

    var createGroup = function (data) {
        return xhrService.fetch(baseUrl + 'users/group/',
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

    var updateGroup = function (id, data) {
        return xhrService.fetch(baseUrl + 'users/group/' + id + '/',
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

    var deleteGroupByKey = function (id) {
        return xhrService.fetch(baseUrl + 'users/group/' + id + '/',
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
        })
    };

    var inviteUser = function (data) {

        return xhrService.fetch(baseUrl + 'users/create-invite-to-user/', {
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

    var getInvitesList = function(options){

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'users/invite-to-user/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })

    };

    var deleteInviteByKey = function (id) {
        return xhrService.fetch(baseUrl + 'users/invite-to-user/' + id + '/',
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
        })
    };

    module.exports = {

        getMembersList: getMembersList,
        getMemberByKey: getMemberByKey,
        updateMember: updateMember,
        deleteMemberByKey: deleteMemberByKey,

        getGroupsList: getGroupsList,
        getGroupByKey: getGroupByKey,
        createGroup: createGroup,
        updateGroup: updateGroup,
        deleteGroupByKey: deleteGroupByKey,

        inviteUser: inviteUser,
        getInvitesList: getInvitesList,
        deleteInviteByKey: deleteInviteByKey

    }

}());