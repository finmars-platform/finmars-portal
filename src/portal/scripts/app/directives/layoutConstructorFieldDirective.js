/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../services/logService');

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
                    colspan: 1,
                    editMode: false
                };

                scope.specialOptionTemplate = '';

                function findItem() {
                    var i;

                    for (i = 0; i < scope.tab.layout.fields.length; i = i + 1) {
                        if (scope.tab.layout.fields[i].row === scope.row) {
                            if (scope.tab.layout.fields[i].column === scope.column) {
                                scope.item = scope.tab.layout.fields[i];
                                scope.backupItem = JSON.parse(JSON.stringify(scope.tab.layout.fields[i]));
                            }
                        }
                    }
                }

                findItem();

                scope.fieldType = null;
                scope.editMode = false;
                scope.entityType = scope.$parent.vm.entityType;
                scope.attrs = scope.$parent.vm.attrs;
                scope.baseAttrs = scope.$parent.vm.baseAttrs;
                scope.entityAttrs = scope.$parent.vm.entityAttrs;
                scope.layoutAttrs = layoutService.getLayoutAttrs();

                var tabs = scope.$parent.vm.tabs;

                scope.attrsLeft = scope.attrs.concat(scope.baseAttrs);
                scope.attrsLeft = scope.attrsLeft.concat(scope.entityAttrs);
                scope.attrsLeft = scope.attrsLeft.concat(scope.layoutAttrs);

                function addRow() {
                    var c;
                    scope.tab.layout.rows = scope.tab.layout.rows + 1;
                    for (c = 0; c < scope.tab.layout.columns; c = c + 1) {
                        scope.tab.layout.fields.push({
                            row: scope.tab.layout.rows,
                            column: c + 1,
                            colspan: 1,
                            type: 'empty'
                        });
                        console.log('tab', scope.tab);
                    }
                }

                scope.cancel = function () {
                    console.log('scope.item', scope.item);
                    console.log('scope.backupItem', scope.backupItem);
                    if (scope.item.name || scope.item.id) {
                        scope.item = scope.backupItem;
                        scope.item.colspan = scope.backupItem.colspan;
                    } else {
                        scope.item.attr = null;
                        scope.item.colspan = 1;
                    }
                    //console.log('scope.item', scope.item);
                    //console.log('scope.backupItem', scope.backupItem);
                    scope.item.editMode = false;
                };

                scope.toggleEditMode = function () {
                    var i;
                    for (i = 0; i < scope.tab.layout.fields.length; i = i + 1) {
                        scope.tab.layout.fields[i].editMode = false;
                    }
                    console.log('ite55555555555555555555555555m', scope.item);
                    scope.item.editMode = true;
                };

                scope.saveField = function () {
                    var i;

                    for (i = 0; i < scope.tab.layout.fields.length; i = i + 1) {
                        //console.log('scope.tab.layout', scope.tab.layout.fields[i]);
                        if (scope.tab.layout.fields[i].row === scope.item.row && scope.tab.layout.fields[i].column === scope.item.column) {
                            if (scope.item.attribute.hasOwnProperty('id')) {
                                scope.tab.layout.fields[i].id = scope.item.attribute.id;
                            } else {
                                scope.tab.layout.fields[i].name = scope.item.attribute.name;
                            }
                            scope.tab.layout.fields[i].type = 'field';
                            scope.tab.layout.fields[i].colspan = scope.item.colspan;
                            scope.tab.layout.fields[i].attribute = scope.item.attribute;
                            //console.log('scope.tab.layout', scope.tab.layout);
                            if (scope.tab.layout.fields[i].row == scope.tab.layout.rows) {
                                addRow();
                            } else {
                                //findEmptyRows();
                            }
                        }
                    }
                    scope.item.editMode = false;
                };

                function findEmptyRows() {
                    var i, r, columnsIsEmpty;
                    var emptyRows = [];
                    for (r = 1; r <= scope.tab.layout.rows; r = r + 1) {
                        columnsIsEmpty = true;
                        for (i = 0; i < scope.tab.layout.fields.length; i = i + 1) {
                            if (scope.tab.layout.fields[i].row == r) {
                                if (scope.tab.layout.fields[i].type === 'field') {
                                    columnsIsEmpty = false;
                                    break;
                                }
                            }
                        }
                        if (columnsIsEmpty) {
                            emptyRows.push(r);
                        }
                    }

                    deleteEmptyRows(emptyRows);
                }

                function deleteEmptyRows(emptyRows) {
                    var i, e;
                    //console.log('emptyRows', emptyRows);
                    for (i = scope.tab.layout.rows; i > 0; i = i - 1) {
                        for (e = emptyRows.length; e > 0; e = e - 1) {
                            //console.log('e', e);
                            //console.log('emptyRows[e]', emptyRows[e]);
                            //console.log('i', i);
                            //console.log('------------------------------------------');
                            if (i === emptyRows[e]) {
                                if (i - 1 === emptyRows[e - 1] && i !== emptyRows[0]) {
                                    var f;
                                    for (f = 0; f < scope.tab.layout.fields.length; f = f + 1) {
                                        if (scope.tab.layout.fields[f].row == scope.tab.layout.rows) {
                                            scope.tab.layout.fields.splice(f, 1);
                                            f = f - 1;
                                        }
                                    }
                                    //console.log('scope.tab.layout', scope.tab.layout);
                                    scope.tab.layout.rows = scope.tab.layout.rows - 1;
                                }
                            }
                        }
                    }
                }

                scope.getCols = function () {

                    var i, c = 1;
                    var colsLeft = [1];
                    for (i = scope.column; i < scope.tab.layout.columns; i = i + 1) {
                        c = c + 1;
                        colsLeft.push(c);
                    }

                    return colsLeft;
                };

                scope.changeModel = function (item) {
                    scope.item.attribute = item;
                };

                scope.deleteField = function () {
                    var i;
                    scope.item.id = null;
                    scope.item.key = null;
                    scope.item.attribute = null;
                    scope.item.colspan = 1;
                    for (i = 0; i < scope.tab.layout.fields.length; i = i + 1) {
                        if (scope.tab.layout.fields[i].row == scope.item.row) {
                            if (scope.tab.layout.fields[i].column == scope.item.column) {
                                scope.tab.layout.fields[i].id = null;
                                scope.tab.layout.fields[i].key = null;
                                scope.tab.layout.fields[i].colspan = 1;
                                scope.tab.layout.fields[i].name = '';
                                scope.tab.layout.fields[i].type = 'empty';
                                findEmptyRows();
                                break;
                            }
                        }
                    }

                };

                function findAttribute() {
                    var i, b, l, e;
                    for (i = 0; i < scope.attrs.length; i = i + 1) {
                        if (scope.attrs[i].id && scope.item.id) {
                            if (scope.attrs[i].id === scope.item.id) {
                                scope.item.attribute = scope.attrs[i];
                                scope.backupItem.attribute = scope.attrs[i];
                            }
                        } else {
                            for (b = 0; b < scope.baseAttrs.length; b = b + 1) {
                                if (scope.baseAttrs[b].name === scope.item.name) {
                                    scope.item.attribute = scope.baseAttrs[b];
                                    scope.backupItem.attribute = scope.baseAttrs[b];
                                }
                            }
                            for (e = 0; e < scope.entityAttrs.length; e = e + 1) {
                                if (scope.entityAttrs[e].name === scope.item.name) {
                                    scope.item.attribute = scope.entityAttrs[e];
                                    scope.backupItem.attribute = scope.entityAttrs[e];
                                }
                            }
                            if (!scope.item.attribute) {
                                for (l = 0; l < scope.layoutAttrs.length; l = l + 1) {
                                    if (scope.layoutAttrs[l].name === scope.item.name) {
                                        scope.item.attribute = scope.layoutAttrs[l];
                                        scope.backupItem.attribute = scope.layoutAttrs[l];
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
                                        if (scope.item.attribute) {
                                            if (scope.item.attribute.id !== scope.attrsLeft[x].id) {
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
                                        if (scope.item.attribute) {
                                            if (scope.item.attribute.name !== scope.attrsLeft[x].name) {
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
                    for (l = 0; l < scope.layoutAttrs.length; l = l + 1) {
                        isLayoutAttributeExist = false;
                        for (i = 0; i < scope.attrsLeft.length; i = i + 1) {
                            if (scope.attrsLeft[i].name === scope.layoutAttrs[l].name) {
                                isLayoutAttributeExist = true;
                            }
                        }
                        if (!isLayoutAttributeExist) {
                            //console.log('scope.attrsLeft', scope.attrsLeft);
                            scope.attrsLeft.push(scope.layoutAttrs[l]);
                        }
                    }

                }

                appendDecoration();

                scope.bindType = function () {
                    var i;
                    if (scope.item.attribute["value_type"] == 'decoration') {
                        return scope.item.attribute["value_type"];
                    }
                    for (i = 0; i < choices.length; i = i + 1) {
                        if (scope.item.attribute["value_type"] === choices[i].value) {
                            return choices[i]["display_name"];
                        }
                    }
                };

                scope.findSelected = function (fields, val) {
                    //console.log(fields, val);

                    if (fields && val) {
                        if (fields.join(' ') === val.join(' ')) {
                            return true;
                        }
                    }

                    return false;
                };

                scope.copyFromValue = function (attr) {
                    if (attr.id) {
                        return JSON.stringify({id: attr.id});
                    }
                    return JSON.stringify({key: attr.key});
                };

                scope.findStringAttributes = function () {
                    var b, a, e;
                    var stringAttrs = [];

                    for (a = 0; a < scope.attrs.length; a = a + 1) {
                        if (scope.attrs[a]['value_type'] === 10) {
                            stringAttrs.push(scope.attrs[a]);
                        }
                    }
                    if (metaService.getEntitiesWithoutBaseAttrsList().indexOf(scope.entityType) === -1) {
                        for (b = 0; b < scope.baseAttrs.length; b = b + 1) {
                            if (scope.baseAttrs[b]['value_type'] === 10) {
                                stringAttrs.push(scope.baseAttrs[b]);
                            }
                        }
                    }

                    for (e = 0; e < scope.entityAttrs.length; e = e + 1) {
                        if (scope.entityAttrs[e]['value_type'] === 10) {
                            stringAttrs.push(scope.entityAttrs[e]);
                        }
                    }

                    //console.log('stringAttrs', stringAttrs);

                    return stringAttrs;

                };

                scope.checkForSpecialOptions = function () {

                    if (scope.item.attribute) {

                        if (scope.item.attribute.hasOwnProperty('id')) {

                            if (scope.item.attribute['value_type'] == 10) {
                                scope.specialOptionTemplate = 'views/attribute-options/string.html';
                                return true;
                            }


                        } else { // entity && base attrs

                            if (scope.item.attribute.name === 'Notes') {
                                scope.specialOptionTemplate = 'views/attribute-options/notes.html';
                                return true;
                            }

                            if (scope.item.attribute['value_type'] == 10) {
                                scope.specialOptionTemplate = 'views/attribute-options/string.html';
                                return true;
                            }
                            //console.log('scope.item.attribute', scope.item.attribute);
                            if (scope.item.attribute['value_type'] === 'field'
                                && metaService.getRestrictedEntitiesWithTypeField().indexOf(scope.item.attribute.key) === -1) {
                                scope.specialOptionTemplate = 'views/attribute-options/field.html';
                                return true;
                            }


                            if (scope.item.attribute['value_type'] === 40) {
                                scope.specialOptionTemplate = 'views/attribute-options/date.html';
                                return true;
                            }

                            if (scope.item.attribute['value_type'] === 20 || scope.item.attribute['value_type'] === 'float') {
                                scope.specialOptionTemplate = 'views/attribute-options/number.html';
                                return true;
                            }

                        }
                    }

                    return false;
                };

            }
        }
    }

}());