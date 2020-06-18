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

        return {
            setChangedUserInputData: setChangedUserInputData,
            getChangedUserInputData: getChangedUserInputData
        }
    }

}());