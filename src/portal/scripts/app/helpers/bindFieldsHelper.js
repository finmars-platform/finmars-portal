/**
 * Created by szhitenev on 12.09.2016.
 */
(function () {

    'use strict';

    var groupFieldsByTagsWithDuplicates = function (fields, tags) {

        if (tags && tags.length) {
            tags.forEach(function (tag) {
                tag.fields = [];

                if (fields && fields.length) {
                    fields.forEach(function (field) {
                        field.tags.forEach(function (fieldTag) {
                            if (fieldTag == tag.id) {
                                tag.fields.push(field);
                            }
                        })
                    })
                }

            });
        }

        return [{name: 'No group', fields: fields}];
    };

    module.exports = {
        groupFieldsByTagsWithDuplicates: groupFieldsByTagsWithDuplicates
    }

}());