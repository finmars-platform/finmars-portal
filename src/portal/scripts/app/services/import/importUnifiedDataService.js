/**
 * Created by szhitenev on 19.01.2022.
 */
(function(){

    'use strict';

    var importUnifiedDataRepository = require('../../repositories/import/importUnifiedDataRepository');

    var download = function(config){
        return importUnifiedDataRepository.download(config);
    };

    module.exports = {
        download: download
    }

}());