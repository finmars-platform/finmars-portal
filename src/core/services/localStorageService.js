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

    let cacheData = function (objPath, item) {

        let cache = getCache();
        let objPlace = cache;
        let lastProp = objPath.pop();
        console.log("layout caching cacheData objPath", objPath);
        for (let i = 0; i < objPath.length; i++) {

            let prop = objPath[i];
            if (!objPlace[prop]) {
                objPlace[prop] = {};
            }

            objPlace = objPlace[prop]

        }


        objPlace[lastProp] = item
        console.log("layout caching cacheData", cache);
        localStorage.setItem("cache", JSON.stringify(cache));

    };

    let getCacheProp = function (objPath) {

        let cache = getCache();
        let objPlace = cache;
        console.log("layout caching getCacheProp objPath", objPath);
        for (let i = 0; i < objPath.length; i++) {

            let prop = objPath[i];

            if (!objPlace[prop]) {
                return null;
            }

            objPlace = objPlace[prop]

        }
        console.log("layout caching getCacheProp", objPlace);
        return objPlace;

    };


    let cacheDefaultLayout = function (contentType, layout) {

        let objPath = [currentMasterUser.id, 'layouts', 'defaultLayouts', contentType];

        if (currentMasterUser.id) {
            cacheData(objPath, layout);

        } else {
            throw("No current master user set");
        }

    };

    let getDefaultLayout = (contentType) => {

        let objPath = [currentMasterUser.id, 'layouts', 'defaultLayouts', contentType];

        if (currentMasterUser.id) {
            return getCacheProp(objPath);
        }

    };

    let cacheLayout = (layout) => {

        let objPath = [currentMasterUser.id, 'layouts', 'layoutsList', layout.id];

        if (currentMasterUser.id) {
            cacheData(objPath, layout);

        } else {
            throw("No current master user set");
        }

    };

    let getCachedLayout = (layoutId) => {

        let objPath = [currentMasterUser.id, 'layouts', 'layoutsList', layoutId];

        if (currentMasterUser.id) {
            return getCacheProp(objPath);
        }

    };

    module.exports = {

        setCurrentMasterUser: setCurrentMasterUser,

        cacheDefaultLayout: cacheDefaultLayout,
        getDefaultLayout: getDefaultLayout,
        cacheLayout: cacheLayout,
        getCachedLayout: getCachedLayout

    }

}());