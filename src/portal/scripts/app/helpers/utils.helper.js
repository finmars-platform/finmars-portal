/**
 * Module contains different useful functions
 * @module UtilsHelper
 */
(function () {

    'use strict';

    // var metaHelper = require('./meta.helper');

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

    /**
     *
     * @param fn {Function}
     * @param wait {number} - milliseconds to wait
     * @param [options] {Object}
     * @param {boolean} [options.trailing=true] - execute fn on its last call after wait time
     * @returns {(function(): void)|*}
     */
    function throttle(fn, wait, options) {

        var time = Date.now();
        var timeout = null;
        options = options || {};

        return function () {
            var waitRemains = time + wait - Date.now();

            if (waitRemains < 0) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                fn();
                time = Date.now();
            } else if (options.trailing !== false && !timeout && waitRemains > 0) {
                timeout = setTimeout(function () {
                    timeout = null;
                    fn();
                    time = Date.now();
                }, waitRemains);
            }
        };
    }

    function floor10(value, exp) {
        return decimalAdjust('floor', value, exp);
    }

    // Old method, not efficient
    // function flattenTree(root, key) {
    //
    //     var flatten = [Object.assign({}, root)];
    //     // delete flatten[0][key];
    //
    //     if (root[key] && root[key].length > 0) {
    //         return flatten.concat(root[key]
    //             .map(function (child) {
    //                 return flattenTree(child, key)
    //             })
    //             .reduce(function (a, b) {
    //                 return a.concat(b)
    //             }, [])
    //         );
    //     }
    //
    //     return flatten;
    // }

    function flattenTree(root, key) {
        const stack = [root];
        const result = [];

        while (stack.length) {
            const node = stack.pop();

            if (node) {
                result.push(Object.assign({}, node));

                if (node[key]) {
                    for (let i = node[key].length - 1; i >= 0; i--) {
                        stack.push(node[key][i]);
                    }
                }
            }
        }

        return result;
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

    function convertToTree(data, rootGroup, optimize) {
        console.log(
            "testing116.rvDataHelper convertToTree data",
            structuredClone(data)
        );
        var list = [];

        // var dataOrderReference = {}; // Only need for keep tracking on original item index
        var referenceItem;


        for (const item of rootGroup.results) {
            if (!data[item.___id]) {

                if (item.___type === 'group' || item.___type === 'placeholder_group') {
                    data[item.___id] = item;
                }
            }
        }

        // var originalKeys = Object.keys(data);

        var indicesInsideParentData = {
            [rootGroup.___id]: null
        };

        Object.keys(data).forEach(function (key) {

            if (data[key].___type === 'group' || data[key].___type === 'placeholder_group') {

                if ( data[key].hasOwnProperty('results') ) {

                    data[key].results.forEach(function (item, index) {

                        indicesInsideParentData[item.___id] = index;

                        try { // temporary for debugging plat691

                            if (!data[item.___id]) {
                                data[item.___id] = item;
                            }

                        } catch (e) {

                            console.error(
                                `plat691 [utilsHelper.convertToTree] ` +
                                "data " +
                                JSON.parse(JSON.stringify(data))
                            );
                            console.error(
                                `plat691 [utilsHelper.convertToTree] ` +
                                "key, data[key] " +
                                key, JSON.parse(JSON.stringify( data[key] ))
                            );
                            console.error(
                                `plat691 [utilsHelper.convertToTree] ` +
                                `item index ${index}`
                            );
                            throw e;
                        }

                    });


                }

            }

        });

        console.timeEnd("convertToTree.thirdLoop");

        // var extendedKeys = Object.keys(data);

        console.time("convertToTree.forthLoop");

        // console.log('convertToTree.extendedKeys', extendedKeys)
        // performance update

        var listMap = {};
        var typeSpecificProps = [
            "___is_selected",
            "___subtotal_type",
            "___items_count",
            "___group_name",
            "___is_open",
            "___has_selected_child",
            "___group_identifier",
        ];

        Object.keys(indicesInsideParentData).forEach(function (key, index) {

            /*if ( !indicesInsideParentData[node.___parentId] && indicesInsideParentData[node.___parentId] !== 0 ) {
                console.error(`[utilsHelper convertToTree] Unable to identify index for the parent of: `, node);
            }*/

            var listItem = {
                ___index: indicesInsideParentData[key],
                ___id: data[key].___id,
                ___parentId: data[key].___parentId,
                ___level: data[key].___level,
                ___type: data[key].___type,
            };

            typeSpecificProps.forEach(function (prop) {

                if ( data[key].hasOwnProperty(prop) ) {
                    listItem[prop] = data[key][prop]
                }

            })

            if ( (data[key].___type === 'group' || data[key].___type === 'placeholder_group') &&

                data[key].hasOwnProperty('results') ) {

                listItem.results = [];

            }

            list.push(listItem);

            listMap[listItem.___id] = index;

        });

        console.timeEnd("convertToTree.forthLoop");

        console.time("convertToTree.toTree");

        /*var map = {}, node, roots = [], i;
        for (i = 0; i < extendedKeys.length; i += 1) {
            map[list[i].___id] = i;
            list[i].results = [];
        }*/
        // console.log("testing116.utilsHelper convertToTree map", structuredClone(map));
        console.log("testing116.utilsHelper convertToTree indicesInsideParentData", structuredClone(indicesInsideParentData));
        console.log("testing116.utilsHelper convertToTree list", structuredClone(list));
        var node, roots = [];
        var i;
        for (i = 0; i < list.length; i += 1) {
            node = list[i];

            if (node.___id !== rootGroup.___id) {

                var parentListIndex = listMap[node.___parentId];

                if ( !parentListIndex && parentListIndex !== 0 ) {
                    console.error(`[utilsHelper convertToTree] Unable to identify index inside list for the parent of: `, node);
                }

                if ( !list[parentListIndex] ) {
                    console.error(`[utilsHelper convertToTree] Can not find parent for: `, node);
                }

                // verify `___type`, `___subtotal_type`, `___subtotal_subtype`


                list[parentListIndex].results.splice(node.___index, 0, node);

                /*if (node.___type === 'group' || node.___type === 'placeholder_group') {
                    // insertItemInNode(list, map, node, dataOrderReference)
                    list[map[node.___parentId]].results[node.___index] = node;
                } else if (node.___type === 'object' || node.___type === 'placeholder_object' || node.___type === 'control') {
                    list[map[node.___parentId]].results.push(node)
                } else if (node.___type === 'blankline' && node.___blankline_type === 'area') {

                    list[map[node.___parentId]].results.push(node)

                } else if (node.___type === 'subtotal' && node.___subtotal_type === 'proxyline') {
                    list[map[node.___parentId]].results.unshift(node)
                } else if (node.___type === 'subtotal' && node.___subtotal_type === 'line') {
                    list[map[node.___parentId]].results.unshift(node)
                } else if (node.___type === 'subtotal' && node.___subtotal_type === 'area') {
                    list[map[node.___parentId]].results.push(node)
                } else if (node.___type === 'subtotal' && node.___subtotal_type === 'arealine') {

                    if (node.___subtotal_subtype === 'line') {
                        list[map[node.___parentId]].results.unshift(node)
                    } else if (node.___subtotal_subtype === 'area') {
                        list[map[node.___parentId]].results.push(node)
                    }

                }
                else if (node.___type === 'control') {

                    list[map[node.___parentId]].results.push(node)

                }*/

            } else {

                roots.push(node);

            }
        }
        console.log("testing116.utilsHelper convertToTree result",
            structuredClone(roots));
        console.timeEnd("convertToTree.toTree");

        return roots[0];

    }

    function convertTreeToList(tree) {
        return flattenTree(tree, 'results');
    }

    function fillListWithData(list, data) {

        // console.log('fillListWithData', data);

        list = list.map(function (item) {

            return data[item.___id]

        })

        return list
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

        // console.log('convertTreeToTreeList.resultAsObj', resultAsObj);

        Object.keys(resultAsObj).forEach(function (key) {
            result.push(resultAsObj[key]);
        });

        // console.log('convertTreeToTreeList.result', resultAsObj);

        return result;

    }

    function orderSort(property, sortOrder) {

        return function (a, b) {

            if (a[property] === null || a[property] === undefined) {
                return 1 * sortOrder;
            }
            if (b[property] === null || b[property] === undefined) {
                return -1 * sortOrder;
            }

            if (a[property] < b[property]) {
                return -1 * sortOrder
            }

            if (a[property] > b[property]) {
                return 1 * sortOrder
            }

        }

    }

    const sortItems = function (items, property) {

        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }

        return items.sort(orderSort(property, sortOrder))

    };

    // comparator for orderBy which set empty item last
    const emptyLastComparator = (v1, v2) => {

        // If we don't get strings, just compare by index
        if (v1.type !== 'string' || v2.type !== 'string') {
            return (v1.index < v2.index) ? -1 : 1;
        }

        if (v1.value === '') {
            return 1
        }

        if (v2.value === '') {
            return -1;
        }

        return v1.value.toLowerCase() < v2.value.toLowerCase() ? -1 : 1;
    };


    function isEqual(value1, value2) {
        if (typeof value1 !== typeof value2) return false;
        if (typeof value1 === 'object' && value1 !== null && value2 !== null) {
            if (Array.isArray(value1)) {
                if (!Array.isArray(value2) || value1.length !== value2.length) return false;
                for (let i = 0; i < value1.length; i++) {
                    if (!isEqual(value1[i], value2[i])) return false;
                }
                return true;
            } else {
                const keys1 = Object.keys(value1);
                const keys2 = Object.keys(value2);
                if (keys1.length !== keys2.length) return false;
                for (const key of keys1) {
                    if (!keys2.includes(key) || !isEqual(value1[key], value2[key])) return false;
                }
                return true;
            }
        }
        return value1 === value2;
    }

    function hasStateChanged(oldState, newState, fieldsToCompare) {

        if (fieldsToCompare) {
            for (const field of fieldsToCompare) {
                if (!isEqual(oldState[field], newState[field])) {
                    return true; // Change detected
                }
            }
        }

        return false; // No changes detected
    }

    module.exports = {
        floor10: floor10,
        debounce: debounce,
        throttle: throttle,
        convertToTree: convertToTree,
        convertTreeToList: convertTreeToList,
        fillListWithData: fillListWithData,
        convertTreeToTreeList: convertTreeToTreeList,

        sortItems: sortItems,
        emptyLastComparator: emptyLastComparator,
        isEqual: isEqual,
        hasStateChanged: hasStateChanged
    }


}());