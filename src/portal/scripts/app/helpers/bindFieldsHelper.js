/**
 * Created by szhitenev on 12.09.2016.
 */
(function () {

    'use strict';

    var groupFieldsByTagsWithDuplicates = function (fields, tags) {

        tags.forEach(function (tag) {
            tag.fields = [];

            fields.forEach(function (field) {
                field.tags.forEach(function (fieldTag) {
                    if (fieldTag == tag.id) {
                        tag.fields.push(field);
                    }
                })
            })

        });

        return tags;
    };

    module.exports = {
        groupFieldsByTagsWithDuplicates: groupFieldsByTagsWithDuplicates
    }

}());