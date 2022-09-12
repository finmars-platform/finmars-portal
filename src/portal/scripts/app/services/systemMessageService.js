/**
 * Created by szhitenev on 30.10.2020.
 */
'use strict';
const systemMessageRepository = require('../repositories/systemMessageRepository');
export default function systemMessageService () {

    const getList = function (options) {
        return systemMessageRepository.getList(options);
    };

	const getByKey = function (id) {
        return systemMessageRepository.getByKey(id);
    };

	const update = function(id, account) {
        return systemMessageRepository.update(id, account);
    };

	const viewFile = function (id) {
        return systemMessageRepository.viewFile(id)
    }

    return {
        getList: getList,
        getByKey: getByKey,
        update: update,

        viewFile: viewFile
    }


};