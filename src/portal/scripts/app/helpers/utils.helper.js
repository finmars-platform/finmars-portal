(function () {

    function decimalAdjust(type, value, exp) {

        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;

        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }

        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));

        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    function debounce(func, wait, immediate) {

        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };

    }

    function floor10(value, exp) {
        return decimalAdjust('floor', value, exp);
    }

    function flattenTree(root, key) {

        var flatten = [Object.assign({}, root)];
        // delete flatten[0][key];

        if (root[key] && root[key].length > 0) {
            return flatten.concat(root[key]
                .map(function (child) {
                    return flattenTree(child, key)
                })
                .reduce(function (a, b) {
                    return a.concat(b)
                }, [])
            );
        }

        return flatten;
    }

    function insertItemInNode(list, map, node, data) {

        var index = 0;

        data[node.___parentId].results.forEach(function (item, i) {

            if (item && item.___id === node.___id) {
                index = i;
            }

        });

        list[map[node.___parentId]].results[index] = node;

    }

    function convertToTree(data, rootGroup) {

        var _rootGroup = JSON.parse(JSON.stringify(rootGroup));
        var _data = JSON.parse(JSON.stringify(data));
        var _dataOrderReference = JSON.parse(JSON.stringify(data));

        var list = [];

        _rootGroup.results.forEach(function (item) {
            if (!_data[item.___id]) {

                if (item.___type === 'group' || item.___type === 'placeholder_group') {
                    _data[item.___id] = item;
                }
            }
        });

        var originalKeys = Object.keys(_data);

        originalKeys.forEach(function (key) {

            if (_data[key].___type === 'group' || _data[key].___type === 'placeholder_group') {

                if (_data[key].hasOwnProperty('results')) {

                    _data[key].results.forEach(function (item) {
                        if (!_data[item.___id]) {
                            _data[item.___id] = item;
                        }
                    });

                }

            }

        });

        var extendedKeys = Object.keys(_data);

        extendedKeys.forEach(function (key) {

            list.push(_data[key]);

        });

        var map = {}, node, roots = [], i;
        for (i = 0; i < extendedKeys.length; i += 1) {
            map[list[i].___id] = i;
            list[i].results = [];
        }
        for (i = 0; i < list.length; i += 1) {
            node = list[i];

            if (node.___parentId !== null) {

                if (node.___type === 'group' || node.___type === 'placeholder_group') {
                    insertItemInNode(list, map, node, _dataOrderReference)
                }

                if (node.___type === 'object' || node.___type === 'placeholder_object') {
                    list[map[node.___parentId]].results.push(node)
                }

                if (node.___type === 'blankline' && node.___blankline_type === 'area') {

                    list[map[node.___parentId]].results.push(node)

                }

                if (node.___type === 'subtotal' && node.___subtotal_type === 'proxyline') {
                    list[map[node.___parentId]].results.unshift(node)
                }

                if (node.___type === 'subtotal' && node.___subtotal_type === 'line') {
                    list[map[node.___parentId]].results.unshift(node)
                }

                if (node.___type === 'subtotal' && node.___subtotal_type === 'area') {
                    list[map[node.___parentId]].results.push(node)
                }

                if (node.___type === 'subtotal' && node.___subtotal_type === 'arealine') {

                    if (node.___subtotal_subtype === 'line') {
                        list[map[node.___parentId]].results.unshift(node)
                    }

                    if (node.___subtotal_subtype === 'area') {
                        list[map[node.___parentId]].results.push(node)
                    }

                }

            } else {

                roots.push(node);

            }
        }

        return roots[0];

    }

    function convertTreeToList(tree) {
        return flattenTree(tree, 'results');
    }

    function toNextLevel(item, result) {

        if (item.hasOwnProperty('results')) {

            result[item.___id] = item;

            item.results.forEach(function (child) {

                toNextLevel(child, result);

            })

        }

    }

    function convertTreeToTreeList(tree) {

        var resultAsObj = {};
        var result = [];

        toNextLevel(tree, resultAsObj);

        console.log('convertTreeToTreeList.resultAsObj', resultAsObj);

        Object.keys(resultAsObj).forEach(function (key) {
            result.push(resultAsObj[key]);
        });

        console.log('convertTreeToTreeList.result', resultAsObj);

        return result;

    }

    module.exports = {
        floor10: floor10,
        debounce: debounce,
        convertToTree: convertToTree,
        convertTreeToList: convertTreeToList,
        convertTreeToTreeList: convertTreeToTreeList
    }


}());