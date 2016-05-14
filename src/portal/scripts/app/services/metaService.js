/**
 * Created by szhitenev on 04.05.2016.
 */
(function(){

    var metaRepository = require('../repositories/metaRepository');

    var getMenu = function(){
        return metaRepository.getMenu();
    };

    var getReservedKeys = function(){
        return metaRepository.getReservedKeys();
    };

    module.exports = {
        getMenu: getMenu,
        getReservedKeys: getReservedKeys
    }

}());