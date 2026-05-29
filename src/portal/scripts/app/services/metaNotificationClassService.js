'use strict';

import metaNotificationClassRepository from '../repositories/metaNotificationClassRepository';

var getList = function(options){
    return metaNotificationClassRepository.getList(options);
};

export default {
    getList: getList
};