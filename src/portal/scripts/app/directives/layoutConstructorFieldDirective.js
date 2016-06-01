/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var metaService = require('../services/metaService');
    var layoutService = require('../services/layoutService');

    module.exports = function () {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/layout-constructor-field-view.html',
            scope: {
                tab: '=',
                row: '=',
                column: '='
            },
            link: function (scope, elem, attr) {

                var choices = metaService.getValueTypes();
                scope.item = {
                    column: scope.column,
                    row: scope.row,
                    colspan: 1
                };
                scope.specialOptionTemplate = '';

                function findItem() {
                    var i;

                    for (i = 0; i < scope.tab.layout.fields.length; i = i + 1) {
                        if (scope.tab.layout.fields[i].row === scope.row) {
                            if (scope.tab.layout.fields[i].column === scope.column) {
                                scope.item = scope.tab.layout.fields[i];
                            }
                        }
                    }
                }

                findItem();

                scope.fieldType = null;
                scope.editMode = false;
                scope.attrs = scope.$parent.vm.attrs;
                scope.baseAttrs = scope.$parent.vm.baseAttrs[scope.$parent.vm.entityType];
                scope.layoutAttrs = layoutService.getLayoutAttrs();
                var tabs = scope.$parent.vm.tabs;

                scope.attrsLeft = scope.attrs.concat(scope.baseAttrs);
                scope.attrsLeft = scope.attrsLeft.concat(scope.layoutAttrs);

                scope.toggleEditMode = function () {
                    scope.editMode = !scope.editMode;
                };

                scope.saveLayout = function () {
                    //console.log('scope.attribute', scope.attribute);
                    var row;
                    var bottomLevel = false;
                    //console.log('scope.row', scope.row);
                    if(!scope.row) {
                        row = scope.tab.layout.rows + 1;
                        scope.tab.layout.rows = scope.tab.layout.rows + 1;
                        bottomLevel = true;
                    } else {
                        row = scope.row;
                    }
                    //console.log(scope.tab.layout);
                    var i;
                    var exist = false;
                    for(i = 0; i < scope.tab.layout.fields.length; i = i + 1) {
                        if(scope.tab.layout.fields[i].row === row && scope.tab.layout.fields[i].column === scope.column) {
                            if(scope.tab.layout.fields[i].hasOwnProperty('id')) {
                                scope.tab.layout.fields[i].id  = scope.attribute.id;
                            } else {
                                scope.tab.layout.fields[i].name  = scope.attribute.name;
                            }
                            scope.tab.layout.fields[i].colspan = scope.item.colspan;
                            exist = true;
                        }
                    }
                    if(!exist) {
                        console.log('not exist');
                        if(scope.attribute.hasOwnProperty('id')) {
                            scope.tab.layout.fields.push({
                                row: row,
                                column: scope.column,
                                id: scope.attribute.id,
                                colspan: scope.item.colspan
                            });
                        } else {
                            scope.tab.layout.fields.push({
                                row: row,
                                column: scope.column,
                                name: scope.attribute.name,
                                colspan: scope.item.colspan
                            });
                        }
                    }
                    if(bottomLevel) {
                        scope.attribute = null;
                    }
                    scope.editMode = false;
                };

                scope.getCols = function () {
                    return [
                        1,
                        2
                    ]
                };

                scope.changeModel = function (item) {
                    scope.attribute = item;
                };

                scope.deleteAttribute = function () {
                    var i;
                    var maxRow = 1;
                    for (i = 0; i < scope.tab.layout.fields.length; i = i + 1) {

                        if (scope.tab.layout.fields[i].row == scope.row && scope.tab.layout.fields[i].column == scope.column) {
                            scope.tab.layout.fields.splice(i, 1);
                            i = i - 1;
                        }
                        if(scope.tab.layout.fields[i].row > maxRow) {
                            maxRow = scope.tab.layout.fields[i].row;
                        }
                    }
                    scope.attribute = null;
                    scope.tab.layout.rows = maxRow;
                    console.log(scope.tab.layout.fields);
                };

                function findAttribute() {
                    var i, b, l;
                    for (i = 0; i < scope.attrs.length; i = i + 1) {
                    if (scope.attrs[i].id && scope.item.id) {
                        if (scope.attrs[i].id === scope.item.id) {
                            scope.attribute = scope.attrs[i];
                        }
                    } else {
                        for (b = 0; b < scope.baseAttrs.length; b = b + 1) {
                            if (scope.baseAttrs[b].name === scope.item.name) {
                                scope.attribute = scope.baseAttrs[b];
                            }
                        }
                        if(!scope.attribute) {
                            for (l = 0; l < scope.layoutAttrs.length; l = l + 1) {
                                if (scope.layoutAttrs[l].name === scope.item.name) {
                                    scope.attribute = scope.layoutAttrs[l];
                                }
                            }
                        }
                    }
                }
                }
                findAttribute();

                function findAttrsLeft() {
                    var i, x, t;
                    for (t = 0; t < tabs.length; t = t + 1) {
                        for (i = 0; i < tabs[t].layout.fields.length; i = i + 1) {
                            for (x = 0; x < scope.attrsLeft.length; x = x + 1) {
                                if (tabs[t].layout.fields[i].id && scope.attrsLeft[x].id) {
                                    if (tabs[t].layout.fields[i].id === scope.attrsLeft[x].id) {
                                        if (scope.attribute) {
                                            if (scope.attribute.id !== scope.attrsLeft[x].id) {
                                                scope.attrsLeft.splice(x, 1);
                                                x = x - 1;
                                            }
                                        } else {
                                            scope.attrsLeft.splice(x, 1);
                                            x = x - 1;
                                        }
                                    }
                                }
                                else {
                                    if (tabs[t].layout.fields[i].name === scope.attrsLeft[x].name) {
                                        if (scope.attribute) {
                                            if (scope.attribute.name !== scope.attrsLeft[x].name) {
                                                scope.attrsLeft.splice(x, 1);
                                                x = x - 1;
                                            }
                                        } else {

                                                scope.attrsLeft.splice(x, 1);
                                                x = x - 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                findAttrsLeft();

                function appendDecoration() {
                    var i, l, isLayoutAttributeExist;
                    for(l = 0; l < scope.layoutAttrs.length; l = l + 1) {
                        isLayoutAttributeExist = false;
                        for(i = 0; i < scope.attrsLeft.length; i = i + 1) {
                            if(scope.attrsLeft[i].name === scope.layoutAttrs[l].name) {
                                isLayoutAttributeExist = true;
                            }
                        }
                        if(!isLayoutAttributeExist) {
                            console.log('scope.attrsLeft', scope.attrsLeft);
                            scope.attrsLeft.push(scope.layoutAttrs[l]);
                        }
                    }

                }
                appendDecoration();

                scope.bindType = function () {
                    var i;
                    if(scope.attribute["value_type"] == 'decoration'){
                        return scope.attribute["value_type"];
                    }
                    for (i = 0; i < choices.length; i = i + 1) {
                        if (scope.attribute["value_type"] === choices[i].value) {
                            return choices[i]["display_name"];
                        }
                    }
                };

                scope.checkForSpecialOptions = function(){
                    if (scope.attribute.hasOwnProperty('id')) {


                        if(scope.attribute['value_type'] == 10) {
                            scope.specialOptionTemplate = 'views/attribute-options/string.html';
                            return true;
                        }

                    } else {

                        if(scope.attribute.name === 'Notes') {
                            scope.specialOptionTemplate = 'views/attribute-options/notes.html';
                            return true;
                        }

                        if(scope.attribute['value_type'] == 10) {
                            scope.specialOptionTemplate = 'views/attribute-options/string.html';
                            return true;
                        }

                    }

                    return false;
                }
            }
        }
    }

}());