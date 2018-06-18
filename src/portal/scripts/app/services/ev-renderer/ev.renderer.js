(function () {

    'use strict';

    var groupRender = require('./group.renderer');

    var render = function (elem, items) {

        var rows = items.map(function (item) {

            return groupRender.render(item);

        });

        console.log('elem', {elem: elem});
        console.log('rows', rows);

        elem.innerHTML = rows.join('');


    };

    module.exports = {
        render: render
    }


}());