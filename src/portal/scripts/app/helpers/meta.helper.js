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

    var getObjectNestedPropVal = function(obj, pathToProp) {

        var objPlace = obj;

        pathToProp.forEach(function (prop) {
            objPlace = objPlace[prop];
        });

        return objPlace;

    }

    module.exports = {
        recursiveDeepCopy: recursiveDeepCopy,
        setObjectNestedPropVal: setObjectNestedPropVal,
        getObjectNestedPropVal: getObjectNestedPropVal
    }

}());