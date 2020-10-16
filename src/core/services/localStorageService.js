(function () {

    'use strict';

    let currentMasterUser = {};

    let setCurrentMasterUser = function (masterUser) {
        currentMasterUser = masterUser
    };

    let getCache = () => {

        let cache = localStorage.getItem("cache");
        console.log("layout caching getCache", cache);
        return cache;

    };

    let getCachedLayout = (layoutId) => {

        let cache = getCache();
        let objPath = [currentMasterUser.id, 'layouts', layoutId];
        let objPlace = cache;

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


        return objPlace;

    };

    let cacheLayout = (layout) => {

        let cache = getCache();
        let objPath = [currentMasterUser.id, 'layouts'];
        let objPlace = cache;

        if (currentMasterUser.id) {

            for (let i = 0; i < objPath.length; i++) {

                let prop = objPath[i];

                if (objPlace[prop]) {
                    objPlace = objPlace[prop]
                }

            }

            if (layout.id) {

                objPlace[layout.id] = layout
                localStorage.setItem("cache", cache);

            }

        }
    };

    module.exports = {

        setCurrentMasterUser: setCurrentMasterUser,

        getCachedLayout: getCachedLayout,
        cacheLayout: cacheLayout

    }

}());