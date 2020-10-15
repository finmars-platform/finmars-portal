(function () {

    'use strict';

    let currentMasterUser = '';

    let setCurrentMasterUser = function (masterUser) {
        currentMasterUser = masterUser
    };

    let getCache = () => {
        return localStorage.getItem("cache");
    }

    let getLayout = () => {

        let cache = getCache();


    }

    module.exports = {
        getCache: getCache

    }

}());