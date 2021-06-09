(function () {
    'use strict';

    module.exports = function () {

        var data = {
			changedUserInputData: null,
			tooltipsList: [],
			colorPalettes: [],
			userInputsToRecalc: null,
			entityAttributeTypes: [],

			tabsWithErrors: {
				system_tab: {},
				user_tab: {}
			},
			formErrorsList: []
		};

        /* function setChangedUserInputData (uInputData) {
            data.changedUserInputData = uInputData;
        }

        function getChangedUserInputData () {
            return data.changedUserInputData;
        } */

        function setTooltipsData (tooltips) {
            data.tooltipsList = tooltips;
        }

        function getTooltipsData () {
            if (Array.isArray(data.tooltipsList)) {
                return data.tooltipsList
            }

            return [];
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

        function setUserInputsToRecalculate (userInputs) {
        	data.userInputsToRecalc = userInputs
		}

		function getUserInputsToRecalculate () {
			return data.userInputsToRecalc;
		}

		function setEntityAttributeTypes (attributeTypes) {
			data.entityAttributeTypes = attributeTypes || [];
		}

		function getEntityAttributeTypes () {
			return data.entityAttributeTypes;
		}

        function setRecalculationFunction (fn) {
            data.recalculate = fn;
        }

        function getRecalculationFunction () {
            return data.recalculate;
        }

        function setTabsWithErrors (tabsWithErrors) {
			data.tabsWithErrors = tabsWithErrors;
		}

		function getTabsWithErrors () {
			return data.tabsWithErrors || {system_tab: {}, user_tab: {}};
		}

		function setFormErrorsList (errorsList) {
			data.formErrorsList = errorsList;
		}

		function getFormErrorsList () {
			return data.formErrorsList || [];
		}

        return {
            /*setChangedUserInputData: setChangedUserInputData,
            getChangedUserInputData: getChangedUserInputData,*/
			setUserInputsToRecalculate: setUserInputsToRecalculate,
			getUserInputsToRecalculate: getUserInputsToRecalculate,
			setEntityAttributeTypes: setEntityAttributeTypes,
			getEntityAttributeTypes: getEntityAttributeTypes,

            setTooltipsData: setTooltipsData,
            getTooltipsData: getTooltipsData,
            setColorPalettesList: setColorPalettesList,
            getColorPalettesList: getColorPalettesList,

            setRecalculationFunction: setRecalculationFunction,
            getRecalculationFunction: getRecalculationFunction,

			setTabsWithErrors: setTabsWithErrors,
			getTabsWithErrors: getTabsWithErrors,
			setFormErrorsList: setFormErrorsList,
			getFormErrorsList: getFormErrorsList
        }
    }

}());