(function () {

    var useShortNameAttrs = ['instrument', 'instrument_type'];

    function getAttributesWithShortNameToUse () {
        return useShortNameAttrs;
    }

    module.exports = {
        getAttributesWithShortNameToUse: getAttributesWithShortNameToUse
    }

}());