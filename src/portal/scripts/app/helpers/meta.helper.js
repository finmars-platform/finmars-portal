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

    // sorts array alphabetically but puts text that starts with '-' at the beginning
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

    let openLinkInNewTab = function (event) {

		event.preventDefault();
		let targetElem = event.target;

		if (targetElem.classList.contains('openLinkInNewTab')) {

			let url = targetElem.href;
			window.open(url);

		}

	};

    let closeComponent = function (openedIn, $mdDialog, $bigDrawer, response) {

        if (openedIn === 'big-drawer') {

            $bigDrawer.hide(response);

        } else { // opened in mdDialog
            $mdDialog.hide(response);
        }

    };

	let getDefaultFilterType = valueType => {

		const defaultTextFilterType = "contains";
		const defaultNumberAndDateFilterType = "equal";

		return valueType === 10 ? defaultTextFilterType: defaultNumberAndDateFilterType;

	};

    const getMultitypeFieldsForAccruals = function () {
        const multitypeFieldsForRows = {
            'accrual_start_date': [
                {
                    'model': null,
                    'fieldType': 'dateInput',
                    'isDefault': false,
                    'isActive': false,
                    'sign': '<div class="multitype-field-type-letter">A</div>',
                    'value_type': 40,
                    'fieldData': {
                        'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
                    }
                },
                {
                    'model': null,
                    'fieldType': 'dropdownSelect',
                    'isDefault': false,
                    'isActive': false,
                    'sign': '<div class="multitype-field-type-letter">L</div>',
                    'value_type': 70,
                    'fieldData': {
                        'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
                    }
                }
            ],
            'first_payment_date': [
                {
                    'model': null,
                    'fieldType': 'dateInput',
                    'isDefault': false,
                    'isActive': false,
                    'sign': '<div class="multitype-field-type-letter">A</div>',
                    'value_type': 40,
                    'fieldData': {
                        'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
                    }
                },
                {
                    'model': null,
                    'fieldType': 'dropdownSelect',
                    'isDefault': false,
                    'isActive': false,
                    'sign': '<div class="multitype-field-type-letter">L</div>',
                    'value_type': 70,
                    'fieldData': {
                        'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
                    }
                }
            ],
            'accrual_size': [
                {
                    'model': null,
                    'fieldType': 'numberInput',
                    'isDefault': false,
                    'isActive': false,
                    'sign': '<div class="multitype-field-type-letter">A</div>',
                    'value_type': 20,
                    'fieldData': {
                        'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
                    }
                },
                {
                    'model': null,
                    'fieldType': 'dropdownSelect',
                    'isDefault': false,
                    'isActive': false,
                    'sign': '<div class="multitype-field-type-letter">L</div>',
                    'value_type': 70,
                    'fieldData': {
                        'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
                    }
                }
            ],
            'periodicity_n': [
                {
                    'model': null,
                    'fieldType': 'numberInput',
                    'isDefault': false,
                    'isActive': false,
                    'sign': '<div class="multitype-field-type-letter">A</div>',
                    'value_type': 20,
                    'fieldData': {
                        'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
                    }
                },
                {
                    'model': null,
                    'fieldType': 'dropdownSelect',
                    'isDefault': false,
                    'isActive': false,
                    'sign': '<div class="multitype-field-type-letter">L</div>',
                    'value_type': 70,
                    'fieldData': {
                        'smallOptions': {'dialogParent': '.dialog-containers-wrap'}
                    }
                }
            ]
        };

        return multitypeFieldsForRows;
    };

    const setSelectorItemsToMultiTypeFields = function (instrumentAttrTypes, multitypeFields) {

        Object.keys(multitypeFields).forEach(key => {

            const fieldTypeObj = multitypeFields[key];

            const selTypeIndex = fieldTypeObj.findIndex(type => type.fieldType === 'dropdownSelect');
            const notSelType = fieldTypeObj.find(type => type.fieldType !== 'dropdownSelect');

            const formattedAttrTypes = instrumentAttrTypes
                .filter(attrType => attrType.value_type === notSelType.value_type)
                .map(attrType => {
                    return {id: attrType.user_code, name: attrType.short_name};
                });

            fieldTypeObj[selTypeIndex].fieldData = {
                menuOptions: formattedAttrTypes || []
            };

        });

    };

    module.exports = {
        recursiveDeepCopy: recursiveDeepCopy,
        setObjectNestedPropVal: setObjectNestedPropVal,
        getObjectNestedPropVal: getObjectNestedPropVal,
        textWithDashSort: textWithDashSort,
		openLinkInNewTab: openLinkInNewTab,

        closeComponent: closeComponent,
		getDefaultFilterType: getDefaultFilterType,

		getMultitypeFieldsForAccruals: getMultitypeFieldsForAccruals,
		setSelectorItemsToMultiTypeFields:setSelectorItemsToMultiTypeFields
    }

}());