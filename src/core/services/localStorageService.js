(function () {

    'use strict';

    let currentMasterUser = {};

    let setCurrentMasterUser = function (masterUser) {
        console.log("layout caching masterUser", masterUser);
        currentMasterUser = masterUser
    };

    let getCache = () => {

        let cache = localStorage.getItem("cache");

        if (cache) {
            cache = JSON.parse(cache);

        } else {
            cache = {}

        }
        console.log("layout caching getCache", cache);
        return cache;

    };

    let getCachedLayout = (layoutId) => {

        let cache = getCache();
        let objPath = [currentMasterUser.id, 'layouts', layoutId];
        let objPlace = cache;
        console.log("layout caching getCachedLayout objPath", objPath);
        if (objPlace) {

            for (let i = 0; i < objPath.length; i++) {

                let prop = objPath[i];

                if (prop && objPlace[prop]) {
                    objPlace = objPlace[prop]

                } else {
                    return null;
                }

            }

        }
        console.log("layout caching getCachedLayout objPlace", objPlace);
        return objPlace;

    };

    let cacheLayout = (layout) => {

        let cache = getCache();
        let objPath = [currentMasterUser.id, 'layouts'];
        let objPlace = cache;

        if (currentMasterUser.id) {

            for (let i = 0; i < objPath.length; i++) {

                let prop = objPath[i];
                console.log("layout caching prop", prop);
                console.log("layout caching objPlace", objPlace, objPlace[prop]);
                if (!objPlace[prop]) {
                    objPlace[prop] = {}
                }

                objPlace = objPlace[prop]

            }
            console.log("layout caching cacheLayout layout", layout);
            if (layout.id) {

                objPlace[layout.id] = layout
                console.log("layout caching prop", cache);
                localStorage.setItem("cache", JSON.stringify(cache));
                console.log("layout caching cache after ", getCache());
            }

        }
    };

    module.exports = {

        setCurrentMasterUser: setCurrentMasterUser,

        getCachedLayout: getCachedLayout,
        cacheLayout: cacheLayout

    }

}());