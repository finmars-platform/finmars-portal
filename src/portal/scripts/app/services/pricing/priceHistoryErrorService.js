/**
 * Created by szhitenev on 03.03.2020.
 */
import PriceHistoryErrorRepository from "../../repositories/pricing/priceHistoryErrorRepository";

export default function (cookieService, xhrService) {

    var priceHistoryErrorRepository = new PriceHistoryErrorRepository(cookieService, xhrService);

    var getList = function (options) {
        return priceHistoryErrorRepository.getList(options);
    };

    var getByKey = function (id) {
        return priceHistoryErrorRepository.getByKey(id);
    };

    var update = function(id, account) {
        return priceHistoryErrorRepository.update(id, account);
    };

    var deleteByKey = function (id) {
        return priceHistoryErrorRepository.deleteByKey(id);
    };

    var deleteBulk = function(data) {
        return priceHistoryErrorRepository.deleteBulk(data)
    };


    return {

        getList: getList,
        getByKey: getByKey,
        update: update,
        deleteByKey: deleteByKey,
        deleteBulk: deleteBulk
    };

};