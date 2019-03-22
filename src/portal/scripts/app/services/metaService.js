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
        }
        else {
            return groups;
        }
    };

    var checkRestrictedEntityTypesForAM = function (entityType) {
        switch (entityType) {
            case "portfolio":
            case "account":
            case "counterparty":
            case "responsible":
            case "instrument":
            case "transaction":
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
            'performance-report', 'pnl-report',
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
            case 'app.reports.pnl-report':
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
        getContentGroups: getContentGroups
    }

}());