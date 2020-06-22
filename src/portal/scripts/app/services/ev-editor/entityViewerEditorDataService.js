(function () {
    'use strict';

    module.exports = function () {

        var data = {};

        function setChangedUserInputData (uInputData) {
            data.changedUserInputData = uInputData;
        }

        function getChangedUserInputData () {
            return data.changedUserInputData;
        }

        function setTooltipsData (tooltips) {
            data.tooltipsObj = tooltips;
        }

        function getTooltipsData () {
            return data.tooltipsObj;
        }

        return {
            setChangedUserInputData: setChangedUserInputData,
            getChangedUserInputData: getChangedUserInputData,
            setTooltipsData: setTooltipsData,
            getTooltipsData: getTooltipsData
        }
    }

}());