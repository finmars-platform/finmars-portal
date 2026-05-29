'use strict';

import metaPermissionsRepository from '../repositories/metaPermissionsRepository';

var getEntitiesWithDisabledPermissions = function(){
    return metaPermissionsRepository.getEntitiesWithDisabledPermissions();
};

export default {
    getEntitiesWithDisabledPermissions: getEntitiesWithDisabledPermissions
};