'use strict';

var findExistingState = function (basePath, entityType) {

    var state = '';
    var options = {};
    if (entityType.indexOf('strategy') !== -1) {

        var entityTypePieces = entityType.split('-');

        state = basePath + entityTypePieces[0] + '-' + entityTypePieces[2];
        options = {strategyNumber: entityTypePieces[1]};

    } else {
        state = basePath + entityType;
    }


    return {
        state: state,
        options: options
    };

};

export default {
    findExistingState: findExistingState
};