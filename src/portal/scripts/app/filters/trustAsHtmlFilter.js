'use strict';

export default function ($sce) {
    return function (val) {
        //console.log('val', val);
        if (val) {
            return $sce.trustAsHtml(val.toString());
        }
    };
};