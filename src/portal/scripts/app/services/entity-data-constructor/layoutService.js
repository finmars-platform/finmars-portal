'use strict';

const getLayoutAttrs = function() {
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
        },
        {
            key: 'layoutPlainText',
            name: 'Plain Text',
            "value_type": 'decoration'
        },
        {
            key: 'layoutCalculatedText',
            name: 'Calculated Text',
            "value_type": 'decoration'
        }
    ]
};

const readonlyAttributes = Object.freeze({
    'complex-transaction': ['code', 'transaction_unique_code'],
    'base-transaction': ['transaction_code'],
});

const getReadonlyAttributes = function (entityType) {
    return readonlyAttributes[entityType] || [];
};

/** Used by bindFieldControlDirective, entityDataConstructorDialogController and directives inside them
 * @module: layoutService **/
export default {
    getLayoutAttrs: getLayoutAttrs,
    getReadonlyAttributes: getReadonlyAttributes,
};