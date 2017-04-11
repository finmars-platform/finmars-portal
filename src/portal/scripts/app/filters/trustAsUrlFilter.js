/**
 * Created by szhitenev on 24.06.2016.
 */
(function () {

    'use strict';

    module.exports = function ($sce) {
        return function (val) {
            //console.log('val', val);
            if (val) {
                return $sce.trustAsResourceUrl(val.toString());
            }
        };
    }

}());