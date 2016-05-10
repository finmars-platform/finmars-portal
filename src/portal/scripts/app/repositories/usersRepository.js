/**
 * Created by szhitenev on 04.05.2016.
 */

(function(){

    'use strict';

    var baseUrl = '/api/v1/';

    var login = function(login, password){
        return window.fetch(baseUrl + 'users/login/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({username: login, password: password})
        }).then(function(data){
            return data.json();
        })
    };

    var logout = function() {
        return window.fetch(baseUrl + 'users/logout/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        }).then(function(data){
            return data.json();
        })
    };

    var ping = function() {
        return window.fetch(baseUrl + 'users/ping/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        }).then(function(data){
            return data.json();
        })
    };

    var protectedPing = function() {
        return window.fetch(baseUrl + 'users/protected-ping/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        }).then(function(data){
            return data.json();
        })
    };

    var getList = function() {
        return window.fetch(baseUrl + 'users/user/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        }).then(function(data){
            return data.json();
        })
    };

    var getByKey = function(id){
        return window.fetch(baseUrl + 'users/user/' + id, {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        }).then(function(data){
            return data.json();
        })
    };

    var update = function(id, user){
        return window.fetch(baseUrl + 'users/user/' + id, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(function(data){
            return data.json();
        })
    };

    var patch = function(id, user){
        return window.fetch(baseUrl + 'users/user/' + id, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(function(data){
            return data.json();
        })
    };

    var deleteByKey = function(id) {
        return window.fetch(baseUrl + 'users/user/' + id, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        }).then(function(data){
            return data.json();
        })
    };

    var getMasterList = function() {
        return window.fetch(baseUrl + 'users/master-user/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        }).then(function(data){
            return data.json();
        })
    };

    var getMasterByKey = function(id){
        return window.fetch(baseUrl + 'users/master-user/' + id, {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        }).then(function(data){
            return data.json();
        })
    };

    var updateMaster = function(id, user){
        return window.fetch(baseUrl + 'users/master-user/' + id, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(function(data){
            return data.json();
        })
    };

    var patchMaster = function(id, user){
        return window.fetch(baseUrl + 'users/master-user/' + id, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(function(data){
            return data.json();
        })
    };

    var deleteMasterByKey = function(id) {
        return window.fetch(baseUrl + 'users/master-user/' + id, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        }).then(function(data){
            return data.json();
        })
    };

    var getMemberList = function() {
        return window.fetch(baseUrl + 'users/member/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        }).then(function(data){
            return data.json();
        })
    };

    var getMemberByKey = function(id){
        return window.fetch(baseUrl + 'users/member/' + id, {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        }).then(function(data){
            return data.json();
        })
    };

    var updateMember = function(id, user){
        return window.fetch(baseUrl + 'users/member/' + id, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(function(data){
            return data.json();
        })
    };

    var patchMember = function(id, user){
        return window.fetch(baseUrl + 'users/member/' + id, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(function(data){
            return data.json();
        })
    };

    var deleteMemberByKey = function(id) {
        return window.fetch(baseUrl + 'users/member/' + id, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        }).then(function(data){
            return data.json();
        })
    };

    var getGroupList = function() {
        return window.fetch(baseUrl + 'users/group/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        }).then(function(data){
            return data.json();
        })
    };

    module.exports = {
        login: login,
        logout: logout,

        ping: ping,
        protectedPing: protectedPing,

        getList: getList,
        getByKey: getByKey,
        update: update,
        patch: patch,
        deleteByKey: deleteByKey,

        getMasterList: getMasterList,
        getMasterByKey: getMasterByKey,
        updateMaster: updateMaster,
        patchMaster: patchMaster,
        deleteMasterByKey: deleteMasterByKey,

        getMemberList: getMemberList,
        getMemberByKey: getMemberByKey,
        updateMember: updateMember,
        patchMember: patchMember,
        deleteMemberByKey: deleteMemberByKey,

        getGroupList: getGroupList

    }

}());