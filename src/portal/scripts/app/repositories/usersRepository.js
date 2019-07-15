/**
 * Created by szhitenev on 04.05.2016.
 */

(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var xhrService = require('../../../../core/services/xhrService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var handleError = function (methodName) {
        console.log('Method: ' + methodName + '. Cannot get data from server');
    };

    var login = function (login, password) {
        return xhrService.fetch(baseUrl + 'users/login/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({username: login, password: password})
        })
    };

    var logout = function () {
        return xhrService.fetch(baseUrl + 'users/logout/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({})
        })
    };

    var ping = function () {
        return xhrService.fetch(baseUrl + 'users/ping/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
    };

    var protectedPing = function () {
        return xhrService.fetch(baseUrl + 'users/protected-ping/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
    };

    var getList = function () {
        return xhrService.fetch(baseUrl + 'users/user/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
    };

    var getByKey = function (id) {
        return xhrService.fetch(baseUrl + 'users/user/' + id + '/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
    };

    var getMe = function () {
        return xhrService.fetch(baseUrl + 'users/user/0/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
    };

    var getCurrentMasterUser = function () {
        return xhrService.fetch(baseUrl + 'users/get-current-master-user', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
    };

    var changePassword = function (id, user) {
        return xhrService.fetch(baseUrl + 'users/user/' + id + '/set-password/', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
    };

    var update = function (id, user) {
        return xhrService.fetch(baseUrl + 'users/user/' + id + '/', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
    };

    var patch = function (id, user) {
        return xhrService.fetch(baseUrl + 'users/user/' + id + '/', {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
    };

    var deleteByKey = function (id) {
        return xhrService.fetch(baseUrl + 'users/user/' + id + '/', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
    };

    var createMasterUser = function (user) {
        return xhrService.fetch(baseUrl + 'users/master-user/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
    };

    var getMasterList = function () {
        return xhrService.fetch(baseUrl + 'users/master-user/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
    };

    var getMasterByKey = function (id) {
        return xhrService.fetch(baseUrl + 'users/master-user/' + id, {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
    };

    var updateMaster = function (id, user) {
        return xhrService.fetch(baseUrl + 'users/master-user/' + id, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
    };

    var patchMaster = function (id, user) {
        return xhrService.fetch(baseUrl + 'users/master-user/' + id, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
    };

    var deleteMasterByKey = function (id) {
        return xhrService.fetch(baseUrl + 'users/master-user/' + id, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
    };

    var setMasterUser = function (id) {
        return xhrService.fetch(baseUrl + 'users/master-user/' + id + '/set-current/', {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
    };

    var getMemberList = function () {
        return xhrService.fetch(baseUrl + 'users/member/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
    };

    var getMemberByKey = function (id) {
        return xhrService.fetch(baseUrl + 'users/member/' + id, {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
    };

    var updateMember = function (id, user) {
        return xhrService.fetch(baseUrl + 'users/member/' + id, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
    };

    var patchMember = function (id, user) {
        return xhrService.fetch(baseUrl + 'users/member/' + id, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
    };

    var deleteMemberByKey = function (id) {
        return xhrService.fetch(baseUrl + 'users/member/' + id, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
    };

    var getGroupList = function () {
        return xhrService.fetch(baseUrl + 'users/group/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
    };

    var getOwnMemberSettings = function () {
        return xhrService.fetch(baseUrl + 'users/user-member/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
    };

    var updateOwnMemberSettings = function (id, member) {
        return xhrService.fetch(baseUrl + 'users/user-member/' + id + '/', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(member)
        })
    };

    module.exports = {
        login: login,
        logout: logout,

        ping: ping,
        protectedPing: protectedPing,

        getList: getList,
        getByKey: getByKey,
        getMe: getMe,
        changePassword: changePassword,
        update: update,
        patch: patch,
        deleteByKey: deleteByKey,

        getCurrentMasterUser: getCurrentMasterUser,
        createMasterUser: createMasterUser,
        getMasterList: getMasterList,
        getMasterByKey: getMasterByKey,
        updateMaster: updateMaster,
        patchMaster: patchMaster,
        deleteMasterByKey: deleteMasterByKey,
        setMasterUser: setMasterUser,

        getMemberList: getMemberList,
        getMemberByKey: getMemberByKey,
        updateMember: updateMember,
        patchMember: patchMember,
        deleteMemberByKey: deleteMemberByKey,

        getGroupList: getGroupList,

        getOwnMemberSettings: getOwnMemberSettings,
        updateOwnMemberSettings: updateOwnMemberSettings

    }

}());