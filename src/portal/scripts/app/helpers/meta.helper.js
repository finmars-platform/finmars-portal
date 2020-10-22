(function () {

    function recursiveDeepCopy(o, saveFunctions) {
        var newO,
            i;

        if (typeof o !== 'object') {
            return o;
        }
        if (!o) {
            return o;
        }

        if ('[object Array]' === Object.prototype.toString.apply(o)) {
            newO = [];
            for (i = 0; i < o.length; i += 1) {
                newO[i] = recursiveDeepCopy(o[i]);
            }
            return newO;

        } else if (saveFunctions && {}.toString.call(o) === '[object Function') {
            return o;
        }

        newO = {};
        for (i in o) {
            if (o.hasOwnProperty(i)) {
                newO[i] = recursiveDeepCopy(o[i]);
            }
        }
        return newO;
    }

    function setObjectNestedPropVal (obj, pathToProp, value) {

        var objPlace = obj;
        var lastIndex = Math.max(0, pathToProp.length - 1); // needed to work with one item array

        pathToProp.forEach(function (prop, index) {

            if (lastIndex === index) {
                objPlace[prop] = value

            } else {
                objPlace = objPlace[prop]
            }

        });

    }

    let getObjectNestedPropVal = (obj, pathToProp) => {

        var objPlace = obj;

        pathToProp.forEach(function (prop) {
            objPlace = objPlace[prop];
        });

        return objPlace;

    }

    let textWithDashSort = (arr, field)  => {
        const keys = ['name', 'user_code', 'public_name']; // preferred fields for sort
        const key = field || keys.find(key => arr.every(item => item.hasOwnProperty(key)));

        if (!key) {
            return arr;
        }

        return arr.sort(function (a, b) {

            if (!a[key] || !b[key]) {
                return 0;
            }

            const aStartsWithDash = a[key].startsWith('-');
            const bStartsWithDash = b[key].startsWith('-');

            // if (a.name.indexOf('-') !== 0 && b.name.indexOf('-') === 0) {
            //     return 1;
            // }

            if (!aStartsWithDash && bStartsWithDash) {
                return 1;
            }

            // if (a.name.indexOf('-') === 0 && b.name.indexOf('-') !== 0) {
            //     return -1;
            // }

            if (aStartsWithDash && !bStartsWithDash) {
                return -1;
            }

            // if (a.name.indexOf('-') === 0 && b.name.indexOf('-') === 0) { // if both words starts with '-', filter as usual
            //
            //     var aWithoutDash = a.name.slice(1);
            //     var bWithoutDash = b.name.slice(1);
            //
            //     if (aWithoutDash > bWithoutDash) {
            //         return 1;
            //     }
            //
            //     if (aWithoutDash < bWithoutDash) {
            //         return -1;
            //     }
            //
            // }

            if (aStartsWithDash && bStartsWithDash) {
                const aWithoutDash = a.name.slice(1);
                const bWithoutDash = b.name.slice(1);

                if (aWithoutDash > bWithoutDash) {
                    return 1
                }
                if (aWithoutDash < bWithoutDash) {
                    return -1
                }
                return 0;
            }

            // if (a.name > b.name) {
            //     return 1;
            // }

            if (a[key] > b[key]) {
                return 1;
            }

            // if (a.name < b.name) {
            //     return -1;
            // }

            if (a[key] < b[key]) {
                return -1;
            }

            return 0;

        });
    }

    module.exports = {
        recursiveDeepCopy: recursiveDeepCopy,
        setObjectNestedPropVal: setObjectNestedPropVal,
        getObjectNestedPropVal: getObjectNestedPropVal,
        textWithDashSort: textWithDashSort
    }

}());

