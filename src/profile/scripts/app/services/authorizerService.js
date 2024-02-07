/**
 * Created by szhitenev on 30.03.2021.
 *
 * Used when creating database.
 */

// (function () {

'use strict';

/*var cookieService = require('../../../../core/services/cookieService').default;
var baseUrlService = require('./baseUrlService').default;

var authorizerUrl = baseUrlService.getAuthorizerUrl();*/

// import baseUrlService from '../services/baseUrlService';
import shellBaseUrlService from '../../../../shell/scripts/app/services/baseUrlService.js';

export default function (xhrService, cookieService) {

    const authorizerUrl = shellBaseUrlService.getAuthorizerUrl();

    const getByKey = function (id) {

        return xhrService.fetch(authorizerUrl + '/user/' + id + '/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        });
    };

    const update = function (id, user) {

        return xhrService.fetch(authorizerUrl + '/user/' + id + '/', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
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

    const checkMasterUserUniqueness = function (name) {

        return xhrService.fetch(authorizerUrl + '/master-user-check-uniqueness/?name=' + name, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        });
    };

    const checkUserLicenseKey = function (key) {

        return xhrService.fetch(authorizerUrl + '/user-check-license/?key=' + key, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        });
    };

    const createMasterUser = function (user) {

        return xhrService.fetch(authorizerUrl + '/master-user-create/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
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

    const getMasterUsersList = function () {

        return xhrService.fetch(authorizerUrl + '/master-user/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        });
    };

    const getMasterUsersListLight = function () {

        return xhrService.fetch(authorizerUrl + '/master-user/light/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        });
    };

    const getMasterUserByKey = function (id) {

        return xhrService.fetch(authorizerUrl + '/master-user/' + id, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        });
    };

    const updateMasterUser = function (id, user) {

        return xhrService.fetch(authorizerUrl + '/master-user/' + id + '/', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        });
    };

    const getInviteFromMasterUserList = function (status) {

        return xhrService.fetch(authorizerUrl + '/invite-from-master-user/?status=' + status, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        });
    };

    const updateInviteFromMasterUserByKey = function (id, invite) {

        return xhrService.fetch(authorizerUrl + '/invite-from-master-user/' + id + '/', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(invite)
        });
    };

    const leaveMasterUser = function (masterUserId) {

        return xhrService.fetch(authorizerUrl + '/master-user-leave/' + masterUserId + '/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        });
    };

    const deleteMasterUserByKey = function (masterUserId) {

        return xhrService.fetch(authorizerUrl + '/master-user-delete/' + masterUserId + '/', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        });
    };

    const copyMasterUser = function (data) {

        return xhrService.fetch(authorizerUrl + '/master-user-copy/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
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

    const exportToBackup = function (masterUserId) {

        return xhrService.fetch(authorizerUrl + '/master-user-export/' + masterUserId + '/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })

    };

    const createMasterUserFromBackup = function (data) {

        return xhrService.fetch(authorizerUrl + '/master-user-create-from-backup/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token')
            },
            data: data
        })
    }

    const redeployMasterUser = function (base_api_url) {

        return xhrService.fetch(authorizerUrl + '/master-user-redeploy/?base_api_url=' + base_api_url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token')
            }
        })
    }

    const startMasterUser = function (base_api_url) {

        return xhrService.fetch(authorizerUrl + '/master-user-start/?base_api_url=' + base_api_url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token')
            }
        })
    }

    const stopMasterUser = function (base_api_url) {

        return xhrService.fetch(authorizerUrl + '/master-user-stop/?base_api_url=' + base_api_url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token')
            }
        })
    }

    const downloadUpdateForMasterUser = function (base_api_url, tag) {

        return xhrService.fetch(authorizerUrl + '/master-user-download-update/?base_api_url=' + base_api_url + '&tag=' + tag, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token')
            }
        })
    }


    // module.exports = {
    return {
        getByKey: getByKey,
        update: update,

        createMasterUser: createMasterUser,
        getMasterUsersListLight: getMasterUsersListLight,
        getMasterUsersList: getMasterUsersList,
        getMasterUserByKey: getMasterUserByKey,
        updateMasterUser: updateMasterUser,

        checkMasterUserUniqueness: checkMasterUserUniqueness,
        checkUserLicenseKey: checkUserLicenseKey,

        getInviteFromMasterUserList: getInviteFromMasterUserList,
        updateInviteFromMasterUserByKey: updateInviteFromMasterUserByKey,

        leaveMasterUser: leaveMasterUser,
        deleteMasterUserByKey: deleteMasterUserByKey,


        copyMasterUser: copyMasterUser,

        exportToBackup: exportToBackup,
        createMasterUserFromBackup: createMasterUserFromBackup,

        redeployMasterUser: redeployMasterUser,
        startMasterUser: startMasterUser,
        stopMasterUser: stopMasterUser,
        downloadUpdateForMasterUser: downloadUpdateForMasterUser
    }

};
// }());