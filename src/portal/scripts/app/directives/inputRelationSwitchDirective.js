/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    module.exports = function () {
        return {
            scope: {
                section: '='
            },
            templateUrl: 'views/directives/input-relation-switch-view.html',
            link: function (scope, elem) {


                scope.switchControl = function (item, propertyName, fieldName) {

                    item[propertyName][fieldName] = null;
                    item[propertyName][fieldName + '_input'] = null;

                    item[propertyName][fieldName + '_toggle'] = !item[propertyName][fieldName + '_toggle'];

                };

            }
        }
    }


}());