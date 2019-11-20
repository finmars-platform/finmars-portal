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

    var getValueTypes = function () {
        return metaRepository.getValueTypes();
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
        var filteredValueTypes = getValueTypes();
        //var filteredValueTypes = getValueTypes().filter(function (item) {
        //	// return item.value !== 'field' && item.value !== 'decoration';
        //	return item.value !== 'field';
        //});
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
                break;
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

        if ($state.current.name.indexOf('app.settings') !== -1) {
            result = 'Settings';
        }

        switch ($state.current.name) {
            case 'app.dashboard':
                result = "Dashboard";
                break;
            case 'app.data.portfolio':
                result = "Portfolio";
                break;
            case 'app.data.account':
                result = "Account";
                break;
            case 'app.data.counterparty':
                result = "Counterparty";
                break;
            case 'app.data.counterparty-group':
                result = "Counterparty group";
                break;
            case 'app.data.responsible':
                result = "Responsible";
                break;
            case 'app.data.responsible-group':
                result = "Responsible group";
                break;
            case 'app.data.instrument':
                result = "Instrument";
                break;
            case 'app.data.transaction':
                result = "Transaction";
                break;
            case 'app.data.price-history':
                result = "Price history";
                break;
            case 'app.data.currency-history':
                result = "Currency history";
                break;
            case 'app.data.strategy':
                result = "Strategy";
                break;
            case 'app.data.strategy-subgroup':
                result = "Strategy subgroup";
                break;
            case 'app.data.strategy-group':
                result = "Strategy group";
                break;
            case 'app.data.account-type':
                result = "Account types";
                break;
            case 'app.data.instrument-type':
                result = "Instrument types";
                break;
            case 'app.data.pricing-policy':
                result = "Pricing policy";
                break;
            case 'app.data.transaction-type':
                result = "Transaction type";
                break;
            case 'app.data.transaction-type-group':
                result = "Transaction type groups";
                break;
            case 'app.data.currency':
                result = "Currency";
                break;
            case 'app.data.complex-transaction':
                result = "Transaction";
                break;
            case 'app.data.tag':
                result = "Tags";
                break;
            case 'app.reports.balance-report':
                result = "Balance report";
                break;
            case 'app.reports.pl-report':
                result = "P&L report";
                break;
            case 'app.reports.transaction-report':
                result = "Transaction report";
                break;
            case 'app.reports.cash-flow-projection-report':
                result = "Cash flow projection report";
                break;
            case 'app.reports.performance-report':
                result = "Performance report";
                break;
            case 'app.actions':
                result = 'Actions';
                break;
            case 'app.system.notifications':
                break;
            case 'app.system.transactions':
                result = 'Audit transactions';
                break;
            case 'app.system.instruments':
                result = 'Audit instruments';
                break;
            case 'app.settings.users-groups':
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
                case 'app.home':
                    name = 'HOME PAGE';
                    break;

                case 'app.reports.balance-report':
                    name = 'REPORT > BALANCE';
                    break;
                case 'app.reports.pl-report':
                    name = 'REPORT > P&L';
                    break;
                case 'app.reports.transaction-report':
                    name = 'REPORT > TRANSACTION';
                    break;
                case 'app.reports.check-for-events':
                    name = 'REPORT > EVENTS';
                    break;
                case 'app.data.portfolio':
                    name = "DATA > PORTFOLIOS";
                    break;
                case 'app.data.account':
                    name = "DATA > ACCOUNTS";
                    break;
                case 'app.data.instrument':
                    name = "DATA > INSTRUMENTS";
                    break;
                case 'app.data.counterparty':
                    name = "DATA > COUNTERPARTIES";
                    break;
                case 'app.data.responsible':
                    name = "DATA > RESPONSIBLES";
                    break;
                case 'app.data.currency':
                    name = "DATA > CURRENCIES";
                    break;
                case 'app.data.strategy':
                    name = "DATA > STRATEGIES";
                    break;

                case 'app.data.complex-transaction':
                    name = "HISTORY > TRANSACTIONS";
                    break;
                case 'app.data.price-history':
                    name = "HISTORY > PRICES";
                    break;
                case 'app.data.currency-history':
                    name = "HISTORY > FX RATES";
                    break;

                case 'app.import.simple-entity':
                    name = 'IMPORT > DATA';
                    break;
                case 'app.import.transaction':
                    name = 'IMPORT > TRANSACTIONS';
                    break;
                case 'app.import.complex-import':
                    name = 'IMPORT > DATA AND TRANSACTIONS';
                    break;
                case 'app.import.instrument':
                    name = 'IMPORT > INSTRUMENT';
                    break;
                case 'app.import.prices':
                    name = 'IMPORT > PRICES/FX';
                    break;
                case 'app.import.mapping-tables':
                    name = 'IMPORT > MAPPING TABLES';
                    break;

                case 'app.system.instruments':
                    name = 'JOURNAL > INSTRUMENTS AUDIT';
                    break;
                case 'app.system.transactions':
                    name = 'JOURNAL > TRANSACTIONS AUDIT';
                    break;
                case 'app.data.transaction':
                    name = 'JOURNAL > BASE TRANSACTIONS';
                    break;

                case 'app.developer-panel':
                    name = 'DEVELOPER PANEL';
                    break;
                case 'app.dashboard':
                    name = 'DASHBOARD';
                    break;

                case 'app.dashboard-layout-manager':
                    name = 'SETTINGS > DASHBOARD LAYOUTS';
                    break;
                case 'app.settings.forms':
                    name = 'SETTINGS > FORMS';
                    break;
                case 'app.settings.layouts':
                    name = 'SETTINGS > LAYOUTS';
                    break;
                case 'app.settings.notifications':
                    name = 'SETTINGS > NOTIFICATIONS';
                    break;
                case 'app.settings.interface-access':
                    name = 'SETTINGS > INTERFACE COMPLEXITY';
                    break;

                case 'app.data.account-type':
                    name = 'SETTINGS > DATA TYPES > ACCOUNT TYPES';
                    break;
                case 'app.data.instrument-type':
                    name = 'SETTINGS > DATA TYPES > INSTRUMENT TYPES';
                    break;
                case 'app.data.transaction-type':
                    name = 'SETTINGS > DATA TYPES > TRANSACTION TYPES';
                    break;
                case 'app.data.pricing-policy':
                    name = 'SETTINGS > DATA TYPES > PRICING TYPES';
                    break;
                case 'app.settings.entities-custom-attributes':
                    name = 'SETTINGS > DATA TYPES > USER ATTRIBUTES';
                    break;
                case 'app.import.reference-tables':
                    name = 'SETTINGS > DATA TYPES > REFERENCE TABLE';
                    break;
                case 'app.template-layout-manager':
                    name = 'SETTINGS > DATA TYPES > TEMPLATES';
                    break;

                case 'app.settings.price-download-scheme':
                    name = 'SETTINGS > IMPORT FROM PROVIDERS > PRICE SCHEMES';
                    break;
                case 'app.settings.instrument-import':
                    name = 'SETTINGS > IMPORT FROM PROVIDERS > INSTRUMENT IMPORT';
                    break;
                case 'app.settings.automated-uploads-history':
                    name = 'SETTINGS > IMPORT FROM PROVIDERS > AUTOMATED PRICE SCHEDULE';
                    break;
                case 'app.settings.simple-entity-import':
                    name = 'SETTINGS > IMPORT FROM FILES > DATA IMPORT';
                    break;
                case 'app.settings.transaction-import':
                    name = 'SETTINGS > IMPORT FROM FILES > TRANSACTION IMPORT';
                    break;
                case 'app.settings.complex-import':
                    name = 'SETTINGS > IMPORT FROM FILES > COMPLEX IMPORT';
                    break;

                case 'app.settings.template-fields':
                    name = 'SETTINGS > ALIASES';
                    break;
                case 'app.settings.import-configuration':
                    name = 'SETTINGS > CONFIGURATION > IMPORT';
                    break;
                case 'app.settings.export-configuration':
                    name = 'SETTINGS > CONFIGURATION > EXPORT';
                    break;
                case 'app.settings.data-providers':
                    name = 'SETTINGS > DATA PROVIDERS';
                    break;
                case 'app.settings.data-providers-config':
                    name = 'SETTINGS > DATA PROVIDERS';
                    break;
                case 'app.settings.init-configuration':
                    name = 'SETTINGS > NEW USER SETUP';
                    break;
                case 'app.settings.users-groups':
                    name = 'SETTINGS > PERMISSIONS';
                    break;
                case 'app.settings.ecosystem-default-settings':
                    name = 'SETTINGS > DEFAULT SETTINGS';
                    break;
                case 'app.processes':
                    name = 'SETTINGS > ACTIVE PROCESSES';
                    break;
            }
        }

        return name;

    };

    var getContentGroups = function (typeOfGroups) {

        return metaRepository.getContentGroups(typeOfGroups);

    };

    module.exports = {
        isReport: isReport,
        getMenu: getMenu,
        getBaseAttrs: getBaseAttrs,
        getEntityAttrs: getEntityAttrs,
        getValueTypes: getValueTypes,
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
        getContentGroups: getContentGroups
    }

}());