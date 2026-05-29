'use strict';

import metaEventClassRepository from '../repositories/metaEventClassRepository';

var getList = function(options){
    return metaEventClassRepository.getList(options);
};

export default {
    getList: getList
};