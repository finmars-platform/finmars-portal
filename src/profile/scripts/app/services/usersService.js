/**
 * Created by szhitenev on 04.05.2016.
 */

(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var baseUrlService = require('./baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getByKey = function (id) {
        return window.fetch(baseUrl + 'users/user/' + id + '/', {
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

    var update = function (id, user) {
        return window.fetch(baseUrl + 'users/user/' + id + '/', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(function (data) {
            return new Promise(function (resolve, reject) {
                data.json().then(function (result) {
                    resolve({
                        response: result,
                        status: data.status
                    })
                })
            });
        })
    };

    var checkMasterUserUniqueness = function (name) {

        return window.fetch(baseUrl + 'users/master-user-check-uniqueness/?name=' + name, {
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

    var createMasterUser = function (user) {
        return window.fetch(baseUrl + 'users/master-user-create/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(function (data) {

            if (data.status !== 200 && data.status !== 201) {
                throw data
            }

            return data.json();

        }).catch(function (reason) {

            console.log('createMasterUser reject?', reason);

            throw reason
        })
    };

    var getMasterList = function () {
        return window.fetch(baseUrl + 'users/master-user/', {
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

    var getMasterListLight = function () {
        return window.fetch(baseUrl + 'users/master-user-light/', {
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

    var getMasterByKey = function (id) {
        return window.fetch(baseUrl + 'users/master-user/' + id, {
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

    var updateMaster = function (id, user) {
        return window.fetch(baseUrl + 'users/master-user/' + id + '/', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(function (data) {
            return data.json();
        })
    };

    var setMasterUser = function (id) {
        return window.fetch(baseUrl + 'users/master-user/' + id + '/set-current/', {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        }).then(function (data) {
            return data.json();
        })
    };

    var getInviteFromMasterUserList = function () {
        return window.fetch(baseUrl + 'users/invite-from-master-user/', {
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

    var updateInviteFromMasterUserByKey = function (id, invite) {
        return window.fetch(baseUrl + 'users/invite-from-master-user/' + id + '/', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(invite)
        }).then(function (data) {
            return data.json();
        })
    };

    var leaveMasterUser = function (masterUserId) {
        return window.fetch(baseUrl + 'users/master-user-leave/' + masterUserId + '/', {
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

    var deleteMasterUser = function (masterUserId) {
        return window.fetch(baseUrl + 'users/master-user-delete/' + masterUserId + '/', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        }).then(function (data) {
            return data.json();
        })
    };

    module.exports = {

        getByKey: getByKey,
        update: update,

        createMasterUser: createMasterUser,
        getMasterListLight: getMasterListLight,
        getMasterList: getMasterList,
        getMasterByKey: getMasterByKey,
        updateMaster: updateMaster,
        setMasterUser: setMasterUser,

        checkMasterUserUniqueness: checkMasterUserUniqueness,

        getInviteFromMasterUserList: getInviteFromMasterUserList,
        updateInviteFromMasterUserByKey: updateInviteFromMasterUserByKey,

        leaveMasterUser: leaveMasterUser,
        deleteMasterUser: deleteMasterUser
    }

}());