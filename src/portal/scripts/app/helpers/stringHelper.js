/**
 * Created by szhitenev on 07.12.2016.
 */
(function () {

    'use strict';

    var md5Helper = require('./md5.helper');
    var sha1Helper = require('./sha1.helper');

    var toHash = function (str) {

        // return md5Helper.md5(str);
        return sha1Helper.sha1(str);
    };

    module.exports = {
        toHash: toHash
    }

}());