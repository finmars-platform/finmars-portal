/**
 * Created by szhitenev on 09.08.2016.
 */
(function(){

    'use strict';

    var metaPermissionsRepository = require('../repositories/metaPermissionsRepository');

    var getEntitiesWithDisabledPermissions = function(){
        return metaPermissionsRepository.getEntitiesWithDisabledPermissions();
    };

    module.exports = {
        getEntitiesWithDisabledPermissions: getEntitiesWithDisabledPermissions
    }

}());