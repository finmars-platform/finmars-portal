(function () {

    function recursiveDeepCopy(o) {
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

        } else if ({}.toString.call(o) === '[object Function') {
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

    module.exports = {
        recursiveDeepCopy: recursiveDeepCopy
    }

}());