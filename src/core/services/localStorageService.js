(function () {

    'use strict';

    let currentMasterUser = {};

    let setCurrentMasterUser = function (masterUser) {
        currentMasterUser = masterUser
    };

    let getCache = () => {

        let cache = localStorage.getItem("cache");

        if (cache) {
            cache = JSON.parse(cache);

        } else {
            cache = {}

        }

        return cache;

    };

    let cacheData = function (objPath, item, cache) {

        if (!cache) {
            cache = getCache();
        }

        let objPlace = cache;
        let lastProp = objPath.pop();
        // console.log("layout caching cacheData objPath", objPath);
        for (let i = 0; i < objPath.length; i++) {

            let prop = objPath[i];
            if (!objPlace[prop]) {
                objPlace[prop] = {};
            }

            objPlace = objPlace[prop]

        }


        objPlace[lastProp] = item

        return cache;

    };

    let getCacheProp = function (objPath, cache) {

        if (!cache) {
            cache = getCache();
        }

        let objPlace = cache;
        // console.log("layout caching getCacheProp objPath", objPath);
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

    let removeFromCache = (objPath, cache) => {

        if (!cache) {
            cache = getCache();
        }
        console.log("layout caching removeLayoutFromCache", objPath, JSON.parse(JSON.stringify(cache)));
        let objPlace = cache;
        let lastProp = objPath.pop();
        let propertyExist = true;
        // console.log("layout caching getCacheProp objPath", objPath);
        for (let i = 0; i < objPath.length; i++) {

            let prop = objPath[i];

            if (!objPlace[prop]) {
                propertyExist = false;
                break;
            }

            objPlace = objPlace[prop]

        }
        console.log("layout caching removeLayoutFromCache propertyExist", JSON.parse(JSON.stringify(objPlace)), propertyExist);
        if (propertyExist) {
            console.log("layout caching removeLayoutFromCache objPlace", JSON.parse(JSON.stringify(objPlace)), lastProp);
            delete objPlace[lastProp];
        }
        console.log("layout caching removeLayoutFromCache2", JSON.parse(JSON.stringify(cache)));
        return cache;

    };


    let cacheLayout = function (layout) {

        let objPath = [currentMasterUser.id, 'layouts', 'layoutsList', layout.id];

        if (currentMasterUser.id) {
            let cache = cacheData(objPath, layout);
            localStorage.setItem("cache", JSON.stringify(cache));

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

    let cacheDefaultLayout = function (layout) {

        let defLayoutDataPath = [currentMasterUser.id, 'layouts', 'defaultLayouts', layout.content_type];
        let layoutPath = [currentMasterUser.id, 'layouts', 'layoutsList', layout.id];
        let defaultLayoutData = {
            content_type: layout.content_type,
            id: layout.id,
            name: layout.name,
            user_code: layout.user_code
        }

        if (currentMasterUser.id) {

            let cache = cacheData(defLayoutDataPath, defaultLayoutData);
            cache = cacheData(layoutPath, layout, cache);
            console.log("layout caching cacheDefaultLayout", cache);
            localStorage.setItem("cache", JSON.stringify(cache));

        } else {
            throw("No current master user set");
        }

    };

    let getDefaultLayout = (contentType) => {

        let objPath = [currentMasterUser.id, 'layouts', 'defaultLayouts', contentType];

        if (currentMasterUser.id) {

            let defaultLayoutData = getCacheProp(objPath);

            if (!defaultLayoutData || !defaultLayoutData.id) {
                return null;
            }

            let defaultLayout = getCachedLayout(defaultLayoutData.id);

            return defaultLayout;

        }

    };

    let deleteLayoutFromCache = function (layoutId) {

        let layoutPath = [currentMasterUser.id, 'layouts', 'layoutsList', layoutId];
        let cache = getCache();
        console.log("layout caching deleteLayoutFromCache data", layoutId, JSON.parse(JSON.stringify(cache)));
        let layoutToDelete = getCacheProp(layoutPath, cache);
        // let cache = removeFromCache(layoutPath);
        console.log("layout caching deleteLayoutFromCache layoutToDelete", layoutToDelete);
        // clear content_type default layout
        if (layoutToDelete.is_default) {
            let defLayoutPath = [currentMasterUser.id, 'layouts', 'defaultLayouts', layoutToDelete.content_type];
            console.log("layout caching deleteLayoutFromCache default layout", defLayoutPath);
            cache = removeFromCache(defLayoutPath, cache);
            console.log("layout caching deleteLayoutFromCache removeDefaultLayout", JSON.parse(JSON.stringify(cache)));
        }

        cache = removeFromCache(layoutPath, cache);
        console.log("layout caching deleteLayoutFromCache", cache);
        localStorage.setItem("cache", JSON.stringify(cache));

    };

    module.exports = {

        setCurrentMasterUser: setCurrentMasterUser,

        cacheDefaultLayout: cacheDefaultLayout,
        getDefaultLayout: getDefaultLayout,
        cacheLayout: cacheLayout,
        getCachedLayout: getCachedLayout,
        deleteLayoutFromCache: deleteLayoutFromCache

    }

}());