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
            if (Array.isArray(data.tooltipsObj)) {
                return data.tooltipsObj
            }

            return  [];
        }

        function setColorPalettesList (palettesList) {
            data.colorPalettes = palettesList;
        }

        function getColorPalettesList () {
            if (data.colorPalettes) {
                return data.colorPalettes;
            } else {
                return [];
            }
        }

        return {
            setChangedUserInputData: setChangedUserInputData,
            getChangedUserInputData: getChangedUserInputData,

            setTooltipsData: setTooltipsData,
            getTooltipsData: getTooltipsData,
            setColorPalettesList: setColorPalettesList,
            getColorPalettesList: getColorPalettesList
        }
    }

}());