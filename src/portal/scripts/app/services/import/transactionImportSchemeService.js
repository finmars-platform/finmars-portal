/**
 * Created by szhitenev on 17.08.2016.
 */
import TransactionImportSchemeRepository from "../../repositories/import/transactionImportSchemeRepository";

export default function (cookieService, xhrService) {

    const transactionImportSchemeRepository = new TransactionImportSchemeRepository(cookieService, xhrService);

    const getList = function (options) {
        return transactionImportSchemeRepository.getList(options);
    };

    const getListLight = function (options) {
        return transactionImportSchemeRepository.getListLight(options);
    };

    const create = function (data) {
        return transactionImportSchemeRepository.create(data);
    };

    const getByKey = function(id) {
        return transactionImportSchemeRepository.getByKey(id);
    };

    const update = function(id, data) {
        return transactionImportSchemeRepository.update(id, data);
    };

    const deleteByKey = function(id) {
        return transactionImportSchemeRepository.deleteByKey(id)
    };

    return {
        getList: getList,
        getListLight: getListLight,
        create: create,
        getByKey: getByKey,
        update: update,
        deleteByKey: deleteByKey
    };
}