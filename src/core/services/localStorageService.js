(function () {

    'use strict';

    let UMuM = ''; // <user.id>_<masterUser.id>_<member.id>

    let setUMuM = function (userId, masterUserId, memberId) {

        console.log('setUMuM', userId, masterUserId, memberId)

    	if ((userId || userId === 0) &&
			(masterUserId || masterUserId === 0) &&
			(memberId || memberId === 0)) {

    		UMuM = userId + '_' + masterUserId + '_' + memberId;

		}

    };

    let getCache = () => {

        let cache = localStorage.getItem(UMuM);

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

        for (let i = 0; i < objPath.length; i++) {

            let prop = objPath[i];

            if (!objPlace[prop]) {
                return null;
            }

            objPlace = objPlace[prop]

        }

        return objPlace;

    };

    let removeFromCache = (objPath, cache) => {

        if (!cache) {
            cache = getCache();
        }

        let objPlace = cache;
        let lastProp = objPath.pop();
        let propertyExist = true;

        for (let i = 0; i < objPath.length; i++) {

            let prop = objPath[i];

            if (!objPlace[prop]) {
                propertyExist = false;
                break;
            }

            objPlace = objPlace[prop]

        }

        if (propertyExist) {
            delete objPlace[lastProp];
        }

        return cache;

    };


    let cacheLayout = function (layout) {

        let objPath = ['layouts', 'layoutsList', layout.id];

        if (UMuM) {
            let cache = cacheData(objPath, layout);
            localStorage.setItem(UMuM, JSON.stringify(cache));

        } else {
            throw("No current master user set");
        }

    };

    let getCachedLayout = (layoutId) => {

        let objPath = ['layouts', 'layoutsList', layoutId];

        if (UMuM) {
            return getCacheProp(objPath);
        }

    };

    let cacheDefaultLayout = function (layout) {

        const defLayoutDataPath = ['layouts', 'defaultLayouts', layout.content_type];
        const cachedLayoutsList = ['layouts', 'layoutsList']
        const layoutPath = ['layouts', 'layoutsList', layout.id];

        let defaultLayoutData = {
            content_type: layout.content_type,
            id: layout.id,
            name: layout.name,
            user_code: layout.user_code
        }

        if (UMuM) {

			const cachedLayouts = getCacheProp(cachedLayoutsList);

			if (cachedLayouts && typeof cachedLayouts === 'object') {

				Object.keys(cachedLayouts).forEach(layoutId => {

					if (cachedLayouts[layoutId].content_type === layout.content_type) {
						cachedLayouts[layoutId].is_default = false;
					}

				});

			}

			let cache = cacheData(cachedLayoutsList, cachedLayouts);

            cacheData(defLayoutDataPath, defaultLayoutData, cache);
            cacheData(layoutPath, layout, cache);

            localStorage.setItem(UMuM, JSON.stringify(cache));

        } else {
            throw("No current master user set");
        }

    };

    let getDefaultLayout = (contentType) => {

        let objPath = ['layouts', 'defaultLayouts', contentType];

        if (UMuM) {

            let defaultLayoutData = getCacheProp(objPath);

            if (!defaultLayoutData || !defaultLayoutData.id) {
                return null;
            }

            let defaultLayout = getCachedLayout(defaultLayoutData.id);

            return defaultLayout;

        }

    };

    let deleteLayoutFromCache = function (layoutId) {

        let layoutPath = ['layouts', 'layoutsList', layoutId];
        let cache = getCache();
        let layoutToDelete = getCacheProp(layoutPath, cache);

        // clear content_type default layout
        if (layoutToDelete && layoutToDelete.is_default) {
            let defLayoutPath = ['layouts', 'defaultLayouts', layoutToDelete.content_type];
            cache = removeFromCache(defLayoutPath, cache);
        }

        cache = removeFromCache(layoutPath, cache);
        localStorage.setItem(UMuM, JSON.stringify(cache));

    };

    module.exports = {

		setUMuM: setUMuM,

        cacheDefaultLayout: cacheDefaultLayout,
        getDefaultLayout: getDefaultLayout,
        cacheLayout: cacheLayout,
        getCachedLayout: getCachedLayout,
        deleteLayoutFromCache: deleteLayoutFromCache

    }

}());