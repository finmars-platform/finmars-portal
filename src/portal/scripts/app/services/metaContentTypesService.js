/**
 * Created by szhitenev on 12.09.2016.
 */
(function () {

    var metaContentTypesRepository = require('../repositories/metaContentTypesRepository');

    var getListForTags = function (entity) {
        return metaContentTypesRepository.getListForTags(entity);
    };

    var getListForUi = function () {
        return metaContentTypesRepository.getListForUi();
    };

    var getList = function () {
        return metaContentTypesRepository.getList();
    };

    var findContentTypeByEntity = function (entity, type) {

        var contentTypes = getList();

        if (type === 'tag') {
            contentTypes = getListForTags();
        } else {
            if (type === 'ui') {
                contentTypes = getListForUi();
            }
        }

        var contentType = null;

        contentTypes.forEach(function (item) {
            if (item.entity === entity) {
                contentType = item.key
            }
        });

        return contentType;
    };

    var findEntityByContentType = function (contentType, type) {

        var contentTypes = getList();

        if (type === 'tag') {
            contentTypes = getListForTags();
        } else {
            if (type === 'ui') {
                contentTypes = getListForUi();
            }
        }

        var entity = null;

        contentTypes.forEach(function (item) {
            if (item.key === contentType) {
                entity = item.entity
            }
        });

        return entity;

    };

    var getListForTransactionTypeInputs = function () {
        return metaContentTypesRepository.getListForTransactionTypeInputs();
    };

    var getListForSimpleEntityImport = function () {
        return metaContentTypesRepository.getListForSimpleEntityImport();
    };

    var getContentTypeUIByState = function (stateName, stateParams) {

        var result = '';

        console.log('stateName', stateName, stateParams);

        if (stateName.indexOf('app.data') !== -1 || stateName.indexOf('app.reports') !== -1) {

            if (stateName === 'app.data.strategy') {
                result = 'strategy-' + stateParams;
            } else {
                result = stateName.split('.')[2];
            }

        }

        if (stateName == 'app.dashboard') {
            result = stateName.split('.')[1];
        }

        return result;

    };

    var getContentTypeList = function () {
        return metaContentTypesRepository.getContentTypeList();
    };

    var findEntityByAPIContentType = function () {
        return metaContentTypesRepository.getContentTypeList().then(function (data) {
            var contentTypeList = data.results,
                listForUi = getListForUi(),
                entities = [];

            if (contentTypeList && contentTypeList.length > 0) {
                contentTypeList.forEach(function (type) {
                    var typeKey,
                        entityFound = false;
                    // Create key property for content type from api
                    typeKey = type.app_label + '.' + type.model;

                    for (var a = 0; a < listForUi.length; a++) {
                        var UiType = listForUi[a],
                            APIEntity = {};
                        if (entityFound == true) {
                            break;
                        } else if (typeKey == UiType.key) {
                            APIEntity.id = type.id;
                            APIEntity.name = UiType.name;
                            entities.push(APIEntity);
                            entityFound = true;
                        }
                    }
                });
            }

            return entities;
        });
    };

    var getEntityNameByContentType = function (contentType) {

        var result = '';

        switch (contentType) {

            case 'accounts.account':
                result = 'Account';
                break;
            case 'accounts.accounttype':
                result = 'Account Type';
                break;
            case 'counterparties.responsible':
                result = 'Responsible';
                break;
            case 'counterparties.responsiblegroup':
                result = 'Responsible Group';
                break;
            case 'counterparties.counterparty':
                result = 'Counterparty';
                break;
            case 'counterparties.counterpartygroup':
                result = 'Counterparty Group'
                break;
            case 'currencies.currencyhistory':
                result = 'Currency History';
                break;
            case 'currencies.currency':
                result = 'Currencies';
                break;
            case 'instruments.pricingpolicy':
                result = 'Pricing Policy';
                break;
            case 'instruments.instrumenttype':
                result = 'Instrument Type';
                break;
            case 'instruments.pricehistory':
                result = 'Price History';
                break;
            case 'instruments.instrument':
                result = 'Instrument';
                break;
            case 'portfolios.portfolio':
                result = 'Portfolio';
                break;
            case 'ui.listlayout':
                result = 'Layout';
                break;
            case 'ui.reportlayout':
                result = 'Report Layout';
                break;
            case 'ui.editlayout':
                result = 'Form';
                break;
            case 'strategies.strategy1':
                result = 'Strategy 1';
                break;
            case 'strategies.strategy1group':
                result = 'Strategy 1 Group';
                break;
            case 'strategies.strategy1subgroup':
                result = 'Strategy 1 Subgroup';
                break;
            case 'strategies.strategy2':
                result = 'Strategy 2';
                break;
            case 'strategies.strategy2group':
                result = 'Strategy 2 Group';
                break;
            case 'strategies.strategy2subgroup':
                result = 'Strategy 2 Subgroup';
                break;
            case 'strategies.strategy3':
                result = 'Strategy 3';
                break;
            case 'strategies.strategy3group':
                result = 'Strategy 3 Group';
                break;
            case 'strategies.strategy3subgroup':
                result = 'Strategy 3 Subgroup';
                break;
            case 'tags.tag':
                result = 'Tags';
                break;
            case 'transactions.transactiontype':
                result = 'Transaction Type';
                break;
            case 'transactions.transactiontypegroup':
                result = 'Transaction Type Group';
                break;
            case 'transactions.complextransaction':
                result = 'Complex Transaction';
                break;
            case 'transactions.transaction':
                result = 'Transaction';
                break;
            case 'integrations.pricedownloadscheme':
                result = 'Price Download Sceme';
                break;
            case 'integrations.complextransactionimportscheme':
                result = 'Complex Transaction Import Scheme';
                break;
            case 'csv_import.csvimportscheme':
                result = 'CSV Import Scheme';
                break;
            case 'integrations.portfoliomapping':
                result = 'Portfolio Mapping';
                break;
            case 'integrations.currencymapping':
                result = 'Currency Mapping';
                break;
            case 'instrumenttypemapping':
                result = 'Instrument Type Mapping';
                break;
            case 'integrations.instrumenttypemapping':
                result = 'Instrument Type Mapping';
                break;
            case 'integrations.accounttypemapping':
                result = 'Account Type Mapping';
                break;
            case 'integrations.pricingpolicymapping':
                result = 'Pricing Policy Mapping';
                break;
            case 'complex_import.compleximportscheme':
                result = 'Complex Import Scheme';
                break;
            case 'integrations.accountmapping':
                result = 'Account Mapping';
                break;
            case 'integrations.instrumentmapping':
                result = 'Instrument Mapping';
                break;
            case 'integrations.counterpartymapping':
                result = 'Counterparty Mapping';
                break;
            case 'integrations.responsiblemapping':
                result = 'Responsible Mapping';
                break;
            case 'integrations.strategy1mapping':
                result = 'Strategy 1 Mapping';
                break;
            case 'integrations.strategy2mapping':
                result = 'Strategy 2 Mapping';
                break;
            case 'integrations.strategy3mapping':
                result = 'Strategy 3 Mapping';
                break;
            case 'integrations.periodicitymapping':
                result = 'Periodicity Mapping';
                break;
            case 'integrations.dailypricingmodelmapping':
                result = 'Daily Pricing Model Mapping';
                break;
            case 'integrations.paymentsizedetailmapping':
                result = 'Payment Size Detail Mapping';
                break;
            case 'integrations.accrualcalculationmodelmapping':
                result = 'Accrual Calculation Model Mapping';
                break;
            case 'integrations.pricedownloadschememapping':
                result = 'Price Download Scheme Mapping';
                break;
            case 'obj_attrs.instrumentattributetype':
                result = 'Instrument Attribute Types';
                break;
            case 'obj_attrs.currencyattributetype':
                result = 'Currency Attribute Types';
                break;
            case 'obj_attrs.accountattributetype':
                result = 'Account Attribute Types';
                break;
            case 'integrations.pricingautomatedschedule:':
                result = 'Pricing Download Schedule';
                break;
            case 'ui.transactionuserfieldmodel':
                result = 'Transaction User field'
                break;
            case 'ui.dashboardlayout':
                result = 'Dashboard Layout';
                break;

        }

        if (!result) {
            result = contentType;
        }

        return result

    };

    module.exports = {
        getListForTags: getListForTags,
        getListForUi: getListForUi,
        getList: getList,

        findContentTypeByEntity: findContentTypeByEntity,
        findEntityByContentType: findEntityByContentType,
        findEntityByAPIContentType: findEntityByAPIContentType,

        getListForTransactionTypeInputs: getListForTransactionTypeInputs,

        getContentTypeUIByState: getContentTypeUIByState,

        getContentTypeList: getContentTypeList,

        getEntityNameByContentType: getEntityNameByContentType,
        getListForSimpleEntityImport: getListForSimpleEntityImport
    }


}());