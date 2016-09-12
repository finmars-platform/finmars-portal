/**
 * Created by szhitenev on 16.06.2016.
 */
(function () {

    'use strict';

    var uiRepository = require('../repositories/uiRepository');

    var getEditLayout = function (entity) {
        return uiRepository.getEditLayout(entity);
    };

    var createEditLayout = function (entity, ui) {
        return uiRepository.createEditLayout(entity, ui);
    };

    var updateEditLayout = function (id, ui) {
        return uiRepository.updateEditLayout(id, ui);
    };

    var getListLayout = function (entity, name) {
        return uiRepository.getListLayout(entity, name);
    };

    var createListLayout = function (entity, ui) {
        return uiRepository.createListLayout(entity, ui);
    };

    var updateListLayout = function (id, ui) {
        return uiRepository.updateListLayout(id, ui)
    };

    var getDefaultListLayout = function () {
        return uiRepository.getDefaultListLayout();
    };

    var getDefaultEditLayout = function () {
        return uiRepository.getDefaultEditLayout();
    };

    module.exports = {
        getDefaultListLayout: getDefaultListLayout,
        getDefaultEditLayout: getDefaultEditLayout,
        getEditLayout: getEditLayout,
        createEditLayout: createEditLayout,
        updateEditLayout: updateEditLayout,
        getListLayout: getListLayout,
        createListLayout: createListLayout,
        updateListLayout: updateListLayout
    }

}());