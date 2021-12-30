/**
 * Created by mevstratov on 01.05.2019.
 */
(function () {

    'use strict';

    function areObjectsTheSame (obj1, obj2) {

            // console.log('object comparison objects', obj1, obj2);
            var firstObject, secondObject;

            function areTwoObjectsTheSame(x, y) {
                var p;

                // Checking for isNaN
                if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
                    return true;
                }

                if (x === y) {
                    return true;
                }

                // Checking for prototype and constructor
                if (typeof x === 'function' && typeof y === 'function') {
                    return true;
                }

                // Check for infinitive linking loops
                if (firstObject.indexOf(x) > -1 || secondObject.indexOf(y) > -1) {
                    return false;
                }

                // Checking of one object being a subset of another.
                for (p in y) {
                    if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                        // console.log('object comparison lack of equivalent property', p);
                        return false;
                    } else if (typeof y[p] !== typeof x[p]) {
                        return false;
                    }
                }

                for (p in x) {

                    if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                        // console.log('object comparison lack of equivalent property', p);
                        return false;
                    } else if (typeof y[p] !== typeof x[p]) {
                        return false;
                    }

                    switch (typeof (x[p])) {
                        case 'object':
                        case 'function':

                            firstObject.push(x);
                            secondObject.push(y);

                            if (!areTwoObjectsTheSame(x[p], y[p])) {
                                // console.log('object comparison not the same objects', x[p], y[p]);
                                return false;
                            }

                            firstObject.pop();
                            secondObject.pop();
                            break;

                        default:
                            if (x[p] !== y[p]) {
                                // console.log('object comparison properties with various values', x[p], y[p]);
                                return false;
                            }
                            break;
                    }
                }
                // console.log('object comparison objects are equals');
                return true;
            }

            firstObject = [];
            secondObject = [];

            if (!areTwoObjectsTheSame(obj1, obj2)) {
                return false;
            }

            return true;

    }

var object1 = {
	"account_mode": 1,
	"accounts": [],
	"accounts_cash": [],
	"accounts_cash_object": [],
	"accounts_object": [],
	"accounts_position": [],
	"accounts_position_object": [],
	"allocation_detailing": true,
	"approach_multiplier": 0.5,
	"cost_method": 1,
	"cost_method_object": {
		"id": 1,
		"user_code": "AVCO",
		"name": "AVCO",
		"description": "AVCO"
	},
	"custom_fields_to_calculate": "",
	"date_field": "transaction_date",
	"item_account_types": [
		{
			"id": 48,
			"name": "-",
			"notes": null,
			"public_name": null,
			"short_name": "-",
			"show_transaction_details": false,
			"transaction_details_expr": null,
			"user_code": "-"
		}
	],
	"item_instrument_types": [
		{
			"id": 84,
			"instrument_class": 3,
			"instrument_class_object": {
				"id": 3,
				"user_code": "REGULAR_EVENT_AT_MATURITY",
				"name": "Regular Event with Maturity",
				"description": "Regular Event with Maturity"
			},
			"user_code": "Bonds",
			"name": "Bonds",
			"short_name": "Bonds",
			"public_name": "Bonds",
			"notes": null,
			"deleted_user_code": null
		},
		{
			"id": 90,
			"instrument_class": 1,
			"instrument_class_object": {
				"id": 1,
				"user_code": "GENERAL",
				"name": "General Class",
				"description": "General Class"
			},
			"user_code": "FX-Forwards",
			"name": "FX-Forwards",
			"short_name": "FX-Forwards",
			"public_name": "FX-Forwards",
			"notes": "",
			"deleted_user_code": null
		},
		{
			"id": 91,
			"instrument_class": 3,
			"instrument_class_object": {
				"id": 3,
				"user_code": "REGULAR_EVENT_AT_MATURITY",
				"name": "Regular Event with Maturity",
				"description": "Regular Event with Maturity"
			},
			"user_code": "Loans",
			"name": "Private loans",
			"short_name": "Loans",
			"public_name": "Private loans",
			"notes": null,
			"deleted_user_code": null
		}
	],
	"member": 124,
	"pl_include_zero": false,
	"portfolio_mode": 1,
	"portfolios": [],
	"portfolios_object": [],
	"pricing_policy": 21,
	"pricing_policy_object": {
		"id": 21,
		"user_code": "-",
		"name": "-",
		"short_name": "-",
		"notes": null,
		"expr": "(ask+bid)/2",
		"deleted_user_code": null
	},
	"report_currency": 1055,
	"report_currency_object": {
		"id": 1055,
		"user_code": "USD",
		"name": "USD",
		"short_name": "USD",
		"deleted_user_code": null
	},
	"report_date": "2019-04-07",
	"report_type": 1,
	"show_balance_exposure_details": false,
	"show_transaction_details": false,
	"strategies1": [],
	"strategies1_object": [],
	"strategies2": [],
	"strategies2_object": [],
	"strategies3": [],
	"strategies3_object": [],
	"strategy1_mode": 0,
	"strategy2_mode": 0,
	"strategy3_mode": 0,
	"transaction_classes": [],
	"transaction_classes_object": []
}
var object2 = {
	"account_mode": 1,
	"accounts": [],
	"accounts_cash": [],
	"accounts_cash_object": [],
	"accounts_object": [],
	"accounts_position": [],
	"accounts_position_object": [],
	"allocation_detailing": true,
	"approach_multiplier": 0.5,
	"cost_method": 1,
	"cost_method_object": {
		"id": 1,
		"user_code": "AVCO",
		"name": "AVCO",
		"description": "AVCO"
	},
	"custom_fields_to_calculate": "",
	"date_field": "transaction_date",
	"item_account_types": [
		{
			"id": 48,
			"name": "-",
			"notes": null,
			"public_name": null,
			"short_name": "-",
			"show_transaction_details": false,
			"transaction_details_expr": null,
			"user_code": "-"
		}
	],
	"item_instrument_types": [
		{
			"id": 84,
			"instrument_class": 3,
			"instrument_class_object": {
				"id": 3,
				"user_code": "REGULAR_EVENT_AT_MATURITY",
				"name": "Regular Event with Maturity",
				"description": "Regular Event with Maturity"
			},
			"user_code": "Bonds",
			"name": "Bonds",
			"short_name": "Bonds",
			"public_name": "Bonds",
			"notes": null,
			"deleted_user_code": null
		},
		{
			"id": 90,
			"instrument_class": 1,
			"instrument_class_object": {
				"id": 1,
				"user_code": "GENERAL",
				"name": "General Class",
				"description": "General Class"
			},
			"user_code": "FX-Forwards",
			"name": "FX-Forwards",
			"short_name": "FX-Forwards",
			"public_name": "FX-Forwards",
			"notes": "",
			"deleted_user_code": null
		},
		{
			"id": 91,
			"instrument_class": 3,
			"instrument_class_object": {
				"id": 3,
				"user_code": "REGULAR_EVENT_AT_MATURITY",
				"name": "Regular Event with Maturity",
				"description": "Regular Event with Maturity"
			},
			"user_code": "Loans",
			"name": "Private loans",
			"short_name": "Loans",
			"public_name": "Private loans",
			"notes": null,
			"deleted_user_code": null
		}
	],
	"member": 124,
	"pl_include_zero": false,
	"portfolio_mode": 1,
	"portfolios": [],
	"portfolios_object": [],
	"pricing_policy": 21,
	"pricing_policy_object": {
		"id": 21,
		"user_code": "-",
		"name": "-",
		"short_name": "-",
		"notes": null,
		"expr": "(ask+bid)/2",
		"deleted_user_code": null
	},
	"report_currency": 1055,
	"report_currency_object": {
		"id": 1055,
		"user_code": "USD",
		"name": "USD",
		"short_name": "USD",
		"deleted_user_code": null
	},
	"report_date": "2019-04-07",
	"report_type": 1,
	"show_balance_exposure_details": false,
	"show_transaction_details": false,
	"strategies1": [],
	"strategies1_object": [],
	"strategies2": [],
	"strategies2_object": [],
	"strategies3": [],
	"strategies3_object": [],
	"strategy1_mode": 0,
	"strategy2_mode": 0,
	"strategy3_mode": 0,
	"transaction_classes": [],
	"transaction_classes_object": [],
	"custom_fields": [
		16,
		19,
		54,
		55,
		56,
		57,
		82
	],
	"custom_fields_object": [
		{
			"id": 16,
			"name": "Test Balance CC",
			"user_code": "test_balance_cc",
			"expr": "\"\"",
			"value_type": 40,
			"notes": ""
		},
		{
			"id": 19,
			"name": "test custom col",
			"user_code": "test_custom_col",
			"expr": "0",
			"value_type": 20,
			"notes": ""
		},
		{
			"id": 54,
			"name": "Asset_types",
			"user_code": "Asset_types",
			"expr": "iff(item_type_name=='Currency', currency.attributes.Currency_type, instrument.attributes.Asse_Sub_Type)",
			"value_type": 10,
			"notes": ""
		},
		{
			"id": 55,
			"name": "Currency_asset",
			"user_code": "Currency_asset",
			"expr": "iff(item_type_name=='Currency', user_code, pricing_currency.user_code)",
			"value_type": 10,
			"notes": ""
		},
		{
			"id": 56,
			"name": "Country",
			"user_code": "Country",
			"expr": "iff(item_type_name=='Currency', currency.attributes.Country, instrument.attributes.Country)",
			"value_type": 10,
			"notes": ""
		},
		{
			"id": 57,
			"name": "dur_int",
			"user_code": "dur_int",
			"expr": "iff(modified_duration>1, (iff(modified_duration>3, (iff(modified_duration>5, '5 - 10 years duration', '3 - 5 years duration')), '1 - 3 years duration')), '0 - 1 year duration')",
			"value_type": 10,
			"notes": ""
		},
		{
			"id": 82,
			"name": "002",
			"user_code": "002",
			"expr": "\"\"",
			"value_type": 10,
			"notes": ""
		}
	]
}

    module.exports = {
        areObjectsTheSame: areObjectsTheSame
    }

}());