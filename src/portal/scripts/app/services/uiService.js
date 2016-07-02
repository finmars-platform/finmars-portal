/**
 * Created by szhitenev on 16.06.2016.
 */
(function(){

    'use strict';

    var uiRepository = require('../repositories/uiRepository');

    var getEditLayout = function(entity){
        return uiRepository.getEditLayout(entity);
    };

    var updateEditLayout = function(id, ui){
        return uiRepository.updateEditLayout(id, ui);
    };

    var getListLayout = function(entity, name) {
        return uiRepository.getListLayout(entity, name);
    };

    var updateListLayout = function(id, ui){
        return uiRepository.updateListLayout(id, ui)
    };

    module.exports = {
        getEditLayout: getEditLayout,
        updateEditLayout: updateEditLayout,
        getListLayout: getListLayout,
        updateListLayout: updateListLayout
    }

}());