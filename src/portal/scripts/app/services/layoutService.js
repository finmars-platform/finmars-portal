/**
 * Created by szhitenev on 01.06.2016.
 */
(function(){

    'use strict';

    var getLayoutAttrs = function() {
        return [
            {
                key: 'layoutLine',
                name: 'Line',
                "value_type": 'decoration'
            },
            {
                key: 'layoutLineWithLabel',
                name: 'Labeled Line',
                "value_type": 'decoration'
            }
        ]
    };

    module.exports = {
        getLayoutAttrs: getLayoutAttrs
    }

}());