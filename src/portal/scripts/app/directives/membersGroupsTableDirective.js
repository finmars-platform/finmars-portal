'use strict';

import logService from '../../../../core/services/logService';

export default function () {
    return {
        restrict: 'A',
        scope: {
            rows: '=',
            columnsNames: '=',
            columns: '='
        },
        templateUrl: 'views/directives/members-groups-table-view.html'
    }
};