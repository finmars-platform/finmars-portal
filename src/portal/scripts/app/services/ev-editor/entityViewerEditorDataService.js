(function () {
    'use strict';

    module.exports = function () {

    	var defaultLocationWithErrors = {
			fixed_area: {
				fields: []
			},
			system_tab: {},
			user_tab: {}
		}

        var data = {
			changedUserInputData: null,
			tooltipsList: [],
			colorPalettes: [],
			entityAttributesToRecalculate: null,
			userInputsToRecalculate: null,
			entityAttributeTypes: [],

			locationsWithErrors: JSON.parse(JSON.stringify(defaultLocationWithErrors)),
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

		/**
		 *
		 * @param { [String] } attributesKeys - array of keys of attributes
		 */
		function setEntityAttributesToRecalculate(attributesKeys) {
			data.entityAttributesToRecalculate = attributesKeys;
		}

		function getEntityAttributesToRecalculate () {
			return data.entityAttributesToRecalculate || [];
		}

		/**
		 *
		 * @param { [String] } userInputs - array of names of user inputs of a transaction type
		 */
        function setUserInputsToRecalculate (userInputs) {
        	data.userInputsToRecalculate = userInputs
		}

		function getUserInputsToRecalculate () {
			return data.userInputsToRecalculate || [];
		}

		function setEntityAttributeTypes (attributeTypes) {
			data.entityAttributeTypes = attributeTypes || [];
		}

		function getEntityAttributeTypes () {
			return JSON.parse(angular.toJson(data.entityAttributeTypes));
		}

        function setRecalculationFunction (fn) {
            data.recalculate = fn;
        }

        function getRecalculationFunction () {
            return data.recalculate;
        }

        function setLocationsWithErrors (locationsWithErrors) {
			data.locationsWithErrors = locationsWithErrors;
		}

		function getLocationsWithErrors () {
			return data.locationsWithErrors || JSON.parse(JSON.stringify(defaultLocationWithErrors));
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
			setEntityAttributesToRecalculate: setEntityAttributesToRecalculate,
			getEntityAttributesToRecalculate: getEntityAttributesToRecalculate,
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

			setLocationsWithErrors: setLocationsWithErrors,
			getLocationsWithErrors: getLocationsWithErrors,
			setFormErrorsList: setFormErrorsList,
			getFormErrorsList: getFormErrorsList
        }
    }

}());