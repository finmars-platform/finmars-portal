/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var metaRepository = require('../repositories/metaRepository');

    var getMenu = function () {
        return metaRepository.getMenu();
    };

    var getBaseAttrs = function () {
        return metaRepository.getBaseAttrs();
    };

    var getEntityAttrs = function (entity) {
        return metaRepository.getEntityAttrs(entity);
    };

    var getRequiredEntityAttrs = function (entityType) {
        return metaRepository.getRequiredEntityAttrs(entityType);
    };

    var getEntityViewerFormComponentsValueTypes = function () {
        return metaRepository.getEntityViewerFormComponentsValueTypes();
    };

    var getEntitiesWithoutBaseAttrsList = function () {
        return metaRepository.getEntitiesWithoutBaseAttrsList();
    };

    var getEntitiesWithoutDynAttrsList = function () {
        return metaRepository.getEntitiesWithoutDynAttrsList();
    };

    var getRestrictedEntitiesWithTypeField = function () {
        return metaRepository.getRestrictedEntitiesWithTypeField();
    };

    var getTypeCaptions = function () {
        var filteredValueTypes = getEntityViewerFormComponentsValueTypes();
        /* var filteredValueTypes = getValueTypes().filter(function (item) {
        	// return item.value !== 'field' && item.value !== 'decoration';
        	return item.value !== 'field';
        }); */
        var typeCaptions = filteredValueTypes.map(function (item) {
            switch (item['display_name']) {
                case 'Number':
                    // item['caption_name'] = 'Integer';
                    item['caption_name'] = 'Whole number';
                    break;
                case 'Float':
                    item['caption_name'] = 'Number with decimals';
                    break;
                case 'Classifier':
                    item['caption_name'] = 'Classification';
                    break;
                case 'Field':
                    item['caption_name'] = 'Reference';
                    break;
                case 'String':
                    item['caption_name'] = 'Text';
                    break;
                case 'Boolean':
                    item['caption_name'] = 'True/False';
                    break;
                case 'Decoration':
                    item['caption_name'] = 'Decoration';
                    break;
                case 'Button':
                    item['caption_name'] = 'Button';
                    break;
				case 'Table':
					item['caption_name'] = 'Table';
					break;
                default:
                    item['caption_name'] = item['display_name'];
                    break;
            }
            return item;
        });
        //console.log(typeCaptions);
        return typeCaptions;
    };

    var groups = {
        "groupOne": "400px",
        "groupTwo": "600px",
        "groupThree": "300px",
        "groupFour": "450px",
        "groupFive": "200px",
        "newColumnAdded": false
    };

    var getDynamicAttrsValueTypes = function () {
        return metaRepository.getDynamicAttrsValueTypes();
    };

    var getDynamicAttrsValueTypesCaptions = function () {
        var filteredValueTypes = getDynamicAttrsValueTypes();
        //var filteredValueTypes = getValueTypes().filter(function (item) {
        //	// return item.value !== 'field' && item.value !== 'decoration';
        //	return item.value !== 'field';
        //});
        var typeCaptions = filteredValueTypes.map(function (item) {
            switch (item['display_name']) {
                case 'Number':
                    item['caption_name'] = 'Number with decimals';
                    break;
                case 'Classifier':
                    item['caption_name'] = 'Classification';
                    break;
                case 'Date':
                    item['caption_name'] = 'Date';
                    break;
                case 'String':
                    item['caption_name'] = 'Text';
                    break;
            }
            return item;
        });
        //console.log(typeCaptions);
        return typeCaptions;
    };

    var columnsWidthGroups = function (newColumn) {

        if (typeof newColumn === "boolean") {
            groups["newColumnAdded"] = newColumn;
        } else {
            return groups;
        }
    };

    var checkRestrictedEntityTypesForAM = function (entityType) {
        switch (entityType) {
            case "portfolio":
            case "account":
            case "strategy-1":
            case "strategy-2":
            case "strategy-3":
            case "account-type":
            case "counterparty":
            case "responsible":
            case "currency":
            case "instrument":
            case "instrument-type":
            case "transaction":
            case "transaction-type":
            case "complex-transaction":
            case "strategies":
                return true;
            default:
                return false;
        }
    };

    var getEntityTabs = function (entityType) {
        return metaRepository.getEntityTabs(entityType);
    };

    var getEntitiesWithSimpleFields = function () {
        return metaRepository.getEntitiesWithSimpleFields();
    };

    var getFieldsWithTagGrouping = function () {
        return metaRepository.getFieldsWithTagGrouping();
    };

    var isReport = function (entityType) {

        return ['balance-report',
            'cash-flow-projection-report',
            'performance-report', 'pl-report',
            'transaction-report'].indexOf(entityType) !== -1

    };

    var getCurrentLocation = function ($state) {

        var result = '';

        if ($state.current.name.indexOf('app.forum') !== -1) {
            result = 'Forum';
        }

        if ($state.current.name.indexOf('app.portal.settings') !== -1) {
            result = 'Settings';
        }

        switch ($state.current.name) {
            case 'app.portal.dashboard':
                result = "Dashboard";
                break;
            case 'app.portal.data.portfolio':
                result = "Portfolio";
                break;
            case 'app.portal.data.account':
                result = "Account";
                break;
            case 'app.portal.data.counterparty':
                result = "Counterparty";
                break;
            case 'app.portal.data.counterparty-group':
                result = "Counterparty group";
                break;
            case 'app.portal.data.responsible':
                result = "Responsible";
                break;
            case 'app.portal.data.responsible-group':
                result = "Responsible group";
                break;
            case 'app.portal.data.instrument':
                result = "Instrument";
                break;
            case 'app.portal.data.transaction':
                result = "Transaction";
                break;
            case 'app.portal.data.price-history':
                result = "Price history";
                break;
            case 'app.portal.data.currency-history':
                result = "Currency history";
                break;
            case 'app.portal.data.strategy':
                result = "Strategy";
                break;
            case 'app.portal.data.strategy-subgroup':
                result = "Strategy subgroup";
                break;
            case 'app.portal.data.strategy-group':
                result = "Strategy group";
                break;
            case 'app.portal.data.account-type':
                result = "Account types";
                break;
            case 'app.portal.data.instrument-type':
                result = "Instrument types";
                break;
            /* case 'app.portal.data.pricing-policy':
                result = "Pricing policy";
                break; */
            case 'app.portal.data.transaction-type':
                result = "Transaction type";
                break;
            case 'app.portal.data.transaction-type-group':
                result = "Transaction type groups";
                break;
            case 'app.portal.data.currency':
                result = "Currency";
                break;
            case 'app.portal.data.complex-transaction':
                result = "Transaction";
                break;
            case 'app.portal.data.tag':
                result = "Tags";
                break;
            case 'app.portal.reports.balance-report':
                result = "Balance report";
                break;
            case 'app.portal.reports.pl-report':
                result = "P&L report";
                break;
            case 'app.portal.reports.transaction-report':
                result = "Transaction report";
                break;
            case 'app.portal.reports.cash-flow-projection-report':
                result = "Cash flow projection report";
                break;
            case 'app.portal.reports.performance-report':
                result = "Performance report";
                break;
            case 'app.portal.actions':
                result = 'Actions';
                break;
            case 'app.portal.system.notifications':
                break;
            case 'app.portal.system.transactions':
                result = 'Audit transactions';
                break;
            case 'app.portal.system.instruments':
                result = 'Audit instruments';
                break;
            case 'app.portal.settings.users-groups':
                result = 'Users & Groups';
                break;
            default:
                result = '';
                break;
        }

        return result;

    };

    var getHeaderTitleForCurrentLocation = function ($state) {

        var name = '';

        if ($state.current.name.indexOf('app.forum') !== -1) {

            name = 'FORUM';

        } else {

            switch ($state.current.name) {
                case 'app.portal.home':
                    name = 'HOME PAGE';
                    break;

                case 'app.portal.reports.balance-report':
                    name = 'REPORT > BALANCE';
                    break;
                case 'app.portal.reports.pl-report':
                    name = 'REPORT > P&L';
                    break;
                case 'app.portal.reports.transaction-report':
                    name = 'REPORT > TRANSACTION';
                    break;
                case 'app.portal.reports.check-for-events':
                    name = 'REPORT > EVENTS';
                    break;
                case 'app.portal.data.portfolio':
                    name = "DATA > PORTFOLIOS";
                    break;
                case 'app.portal.data.account':
                    name = "DATA > ACCOUNTS";
                    break;
                case 'app.portal.data.instrument':
                    name = "DATA > INSTRUMENTS";
                    break;
                case 'app.portal.data.counterparty':
                    name = "DATA > COUNTERPARTIES";
                    break;
                case 'app.portal.data.responsible':
                    name = "DATA > RESPONSIBLES";
                    break;
                case 'app.portal.data.currency':
                    name = "DATA > CURRENCIES";
                    break;
                case 'app.portal.data.strategy':
                    name = "DATA > STRATEGIES";
                    break;

                case 'app.portal.data.complex-transaction':
                    name = "TRANSACTIONS > TRANSACTIONS";
                    break;
                case 'app.portal.data.price-history':
                    name = "VALUATIONS > PRICES";
                    break;
                case 'app.portal.data.currency-history':
                    name = "VALUATIONS > FX RATES";
                    break;

                case 'app.portal.import.simple-entity':
                    name = 'IMPORT > DATA';
                    break;
                case 'app.portal.import.transaction':
                    name = 'IMPORT > TRANSACTIONS';
                    break;
                case 'app.portal.import.complex-import':
                    name = 'IMPORT > DATA AND TRANSACTIONS';
                    break;
                case 'app.portal.import.instrument':
                    name = 'IMPORT > INSTRUMENT';
                    break;
                case 'app.portal.import.prices':
                    name = 'IMPORT > PRICES/FX';
                    break;
                case 'app.portal.import.mapping-tables':
                    name = 'IMPORT > MAPPING TABLES';
                    break;

                case 'app.portal.system.instruments':
                    name = 'JOURNAL > INSTRUMENTS AUDIT';
                    break;
                case 'app.portal.system.transactions':
                    name = 'JOURNAL > TRANSACTIONS AUDIT';
                    break;
                case 'app.portal.data.transaction':
                    name = 'TRANSACTIONS > BASE TRANSACTIONS';
                    break;

                case 'app.portal.developer-panel':
                    name = 'DEVELOPER PANEL';
                    break;
                case 'app.portal.dashboard':
                    name = 'DASHBOARD';
                    break;
                case 'app.portal.dashboard-constructor':
                    name = 'DASHBOARD CONSTRUCTOR';
                    break;

                case 'app.portal.dashboard-layout-manager':
                    name = 'SETTINGS > DASHBOARD LAYOUTS';
                    break;
                case 'app.portal.settings.forms':
                    name = 'SETTINGS > FORMS';
                    break;
                case 'app.portal.settings.layouts':
                    name = 'SETTINGS > LAYOUTS';
                    break;
                case 'app.portal.settings.notifications':
                    name = 'SETTINGS > NOTIFICATIONS';
                    break;
                case 'app.portal.settings.interface-access':
                    name = 'SETTINGS > INTERFACE COMPLEXITY';
                    break;

                case 'app.portal.data.account-type':
                    name = 'SETTINGS > DATA TYPES > ACCOUNT TYPES';
                    break;
                case 'app.portal.data.instrument-type':
                    name = 'SETTINGS > DATA TYPES > INSTRUMENT TYPES';
                    break;
                case 'app.portal.data.transaction-type':
                    name = 'SETTINGS > DATA TYPES > TRANSACTION TYPES';
                    break;
                /* case 'app.portal.data.pricing-policy':
                    name = 'SETTINGS > DATA TYPES > PRICING TYPES';
                    break; */
                case 'app.portal.settings.entities-custom-attributes':
                    name = 'SETTINGS > DATA TYPES > USER ATTRIBUTES';
                    break;
                case 'app.portal.import.reference-tables':
                    name = 'SETTINGS > DATA TYPES > REFERENCE TABLE';
                    break;
                case 'app.portal.template-layout-manager':
                    name = 'SETTINGS > DATA TYPES > TEMPLATES';
                    break;

                case 'app.portal.settings.price-download-scheme':
                    name = 'SETTINGS > IMPORT FROM PROVIDERS > PRICE SCHEMES';
                    break;
                case 'app.portal.settings.instrument-import':
                    name = 'SETTINGS > IMPORT FROM PROVIDERS > INSTRUMENT IMPORT';
                    break;
                case 'app.portal.settings.simple-entity-import':
                    name = 'SETTINGS > IMPORT FROM FILES > DATA IMPORT';
                    break;
                case 'app.portal.settings.transaction-import':
                    name = 'SETTINGS > IMPORT FROM FILES > TRANSACTION IMPORT';
                    break;
                case 'app.portal.settings.complex-import':
                    name = 'SETTINGS > IMPORT FROM FILES > COMPLEX IMPORT';
                    break;

                case 'app.portal.settings.template-fields':
                    name = 'SETTINGS > ALIASES';
                    break;
                case 'app.portal.settings.import-configuration':
                    name = 'SETTINGS > CONFIGURATION > IMPORT';
                    break;
                case 'app.portal.settings.export-configuration':
                    name = 'SETTINGS > CONFIGURATION > EXPORT';
                    break;
                case 'app.portal.settings.data-providers':
                    name = 'SETTINGS > DATA PROVIDERS';
                    break;
                case 'app.portal.settings.data-providers-config':
                    name = 'SETTINGS > DATA PROVIDERS';
                    break;
                case 'app.portal.settings.init-configuration':
                    name = 'SETTINGS > NEW USER SETUP';
                    break;
                case 'app.portal.settings.users-groups':
                    name = 'SETTINGS > PERMISSIONS';
                    break;
                case 'app.portal.settings.ecosystem-default-settings':
                    name = 'SETTINGS > DEFAULT SETTINGS';
                    break;
                case 'app.portal.processes':
                    name = 'SETTINGS > ACTIVE PROCESSES';
                    break;
                case 'app.portal.schedules':
                    name = 'SETTINGS > PRICING > SCHEDULES';
                    break;
            }
        }

        return name;

    };

    var getContentGroups = function (typeOfGroups) {

        return metaRepository.getContentGroups(typeOfGroups);

    };

    var getEntityViewerFixedFieldsAttributes = function (entityType) {

        switch (entityType) {
            case 'instrument':
                return ['name', 'short_name', 'user_code', 'instrument_type', 'public_name'];
                break;

            case 'account':
                return ['name', 'short_name', 'user_code', 'type', 'public_name'];
                break;

            case 'portfolio':
                return ['name', 'short_name', 'user_code', null, 'public_name'];
                break;

            case 'counterparty':
            case 'responsible':
            case 'strategy-1':
            case 'strategy-2':
            case 'strategy-3':
                return ['name', 'short_name', 'user_code', null, 'public_name'];
                break;

            case 'currency':
                return ['name', 'short_name', 'user_code'];
                break;

            case 'account-type':
                return ['name', 'short_name', 'user_code', 'transaction_details_expr', 'public_name'];
                break;

            case 'instrument-type':
                return ['name', 'short_name', 'user_code', 'instrument_class', 'public_name'];
                break;

            default:
                return [];
        }

    };

	/**
	 *
	 * @param dataRequest {function} - asynchronous method that returns array of items
	 * @param argumentsList {array} - array of arguments for dataRequest method. Must contain argument with options {pageSize: 1000, page: 1}
	 * @returns {Promise<unknown>}
	 */
    var loadDataFromAllPages = function (dataRequest, argumentsList) {

		var dataList = [];

		var loadAllPages = (resolve, reject) => {

			dataRequest(...argumentsList).then(function (data) {

				dataList = dataList.concat(data.results);

				if (data.next) {

					options.page = options.page + 1;
					loadAllPages(resolve, reject);

				} else {
					resolve(dataList);
				}

			}).catch(error => reject(error));

		};

		return new Promise((resolve, reject) => {

			loadAllPages(resolve, reject);

		});

	};

	/**
	 *
	 * @param promisesResultList {Array}
	 * @param errorPremise {string=} - string to go before data from promise rejection
	 */
	var logRejectedPromisesAfterAllSettled = function (promisesResultList, errorPremise) {

		promisesResultList.forEach(result => {
			if (result.status === "rejected") {

				var errorArgs = [];

				if (errorPremise) errorArgs.push(errorPremise);

				errorArgs.push(result.reason);

				console.error(...errorArgs);

			}
		});

	};

    module.exports = {
        isReport: isReport,
        getMenu: getMenu,
        getBaseAttrs: getBaseAttrs,
        getEntityAttrs: getEntityAttrs,
        getRequiredEntityAttrs: getRequiredEntityAttrs,
		getEntityViewerFormComponentsValueTypes: getEntityViewerFormComponentsValueTypes,
        getDynamicAttrsValueTypes: getDynamicAttrsValueTypes,
        getDynamicAttrsValueTypesCaptions: getDynamicAttrsValueTypesCaptions,
        getEntitiesWithoutBaseAttrsList: getEntitiesWithoutBaseAttrsList,
        getEntitiesWithoutDynAttrsList: getEntitiesWithoutDynAttrsList,
        getRestrictedEntitiesWithTypeField: getRestrictedEntitiesWithTypeField,
        getTypeCaptions: getTypeCaptions,
        columnsWidthGroups: columnsWidthGroups,
        getEntityTabs: getEntityTabs,
        getEntitiesWithSimpleFields: getEntitiesWithSimpleFields,
        checkRestrictedEntityTypesForAM: checkRestrictedEntityTypesForAM,
        getFieldsWithTagGrouping: getFieldsWithTagGrouping,
        getCurrentLocation: getCurrentLocation,
        getHeaderTitleForCurrentLocation: getHeaderTitleForCurrentLocation,
        getContentGroups: getContentGroups,
        getEntityViewerFixedFieldsAttributes: getEntityViewerFixedFieldsAttributes,

		logRejectedPromisesAfterAllSettled: logRejectedPromisesAfterAllSettled,

		loadDataFromAllPages: loadDataFromAllPages
    }

}());