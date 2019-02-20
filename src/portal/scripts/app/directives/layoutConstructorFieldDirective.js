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

                var choices = metaService.getTypeCaptions();

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

                scope.attrs = scope.$parent.vm.attrs || [];
                scope.entityAttrs = scope.$parent.vm.entityAttrs || [];
                scope.userInputs = scope.$parent.vm.userInputs || [];
                scope.layoutAttrs = layoutService.getLayoutAttrs();

                var entityAttrsKeys = [];
                scope.entityAttrs.forEach(function (entityAttr) {
                    entityAttrsKeys.push(entityAttr.key);
                });
                var layoutAttrsKeys = [];
                scope.layoutAttrs.forEach(function (layoutAttr) {
                    layoutAttrsKeys.push(layoutAttr.key);
                });

                var tabs = scope.$parent.vm.tabs;

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

                    if (scope.item.name || scope.item.id) {
                        scope.item = scope.backupItem;
                        scope.item.colspan = scope.backupItem.colspan;
                    } else {
                        scope.item.attr = null;
                        scope.item.colspan = 1;
                    }

                    scope.item.editMode = false;

                };

                scope.toggleEditMode = function () {
                    var i;
                    for (i = 0; i < scope.tab.layout.fields.length; i = i + 1) {
                        scope.tab.layout.fields[i].editMode = false;
                    }

                    scope.item.editMode = true;
                };

                var lastEmptyRowsChecker = function (newFieldRow) {
                    var rows = scope.tab.layout.rows;
                    console.log('addRows lastEmptyRowsChecker', newFieldRow, rows);

                    var r;
                    for (r = rows; rows - r !== 4; r = a - 1) {
                        if (r === newFieldRow) {
                            console.log('addRows newField, rows', newFieldRow, r);
                            addRow();
                            break;
                        }
                    }
                };

                scope.saveField = function () {
                    var i;

                    for (i = 0; i < scope.tab.layout.fields.length; i = i + 1) {

                        if (scope.tab.layout.fields[i].row === scope.item.row &&
                            scope.tab.layout.fields[i].column === scope.item.column) {

                            scope.tab.layout.fields[i].attribute_class = 'userInput';

                            if (scope.item.attribute.hasOwnProperty('id')) {
                                scope.tab.layout.fields[i].attribute_class = 'attr';
                                scope.tab.layout.fields[i].id = scope.item.attribute.id;
                            }

                            if (entityAttrsKeys.indexOf(scope.item.attribute.key) !== -1) {
                                scope.tab.layout.fields[i].attribute_class = 'entityAttr';
                            }

                            if (layoutAttrsKeys.indexOf(scope.item.attribute.key) !== -1) {
                                scope.tab.layout.fields[i].attribute_class = 'decorationAttr';
                            }


                            scope.tab.layout.fields[i].name = scope.item.attribute.name;
                            scope.tab.layout.fields[i].type = 'field';
                            scope.tab.layout.fields[i].colspan = scope.item.colspan;
                            scope.tab.layout.fields[i].attribute = scope.item.attribute;

                            if (scope.tab.layout.fields[i].row === scope.tab.layout.rows) {
                                addRow();
                            } else {
                                //findEmptyRows();
                            }


                        }
                    }

                    scope.item.editMode = false;

                    scope.$parent.vm.syncItems();


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
                    scope.item.attribute_class = null;
                    scope.item.disabled = false;
                    scope.item.options = null;
                    scope.item.colspan = 1;
                    for (i = 0; i < scope.tab.layout.fields.length; i = i + 1) {
                        if (scope.tab.layout.fields[i].row === scope.item.row) {
                            if (scope.tab.layout.fields[i].column === scope.item.column) {
                                scope.tab.layout.fields[i].id = null;
                                scope.tab.layout.fields[i].key = null;
                                scope.tab.layout.fields[i].attribute_class = null;
                                scope.tab.layout.fields[i].disabled = false;
                                scope.tab.layout.fields[i].colspan = 1;
                                scope.tab.layout.fields[i].name = '';
                                scope.tab.layout.fields[i].type = 'empty';
                                findEmptyRows();
                                break;
                            }
                        }
                    }

                    scope.$parent.vm.syncItems();
                };

                function findAttribute() {
                    var i, b, l, e, u;
                    for (i = 0; i < scope.attrs.length; i = i + 1) {
                        if (scope.attrs[i].id && scope.item.id) {
                            if (scope.attrs[i].id === scope.item.id) {
                                scope.item.attribute = scope.attrs[i];
                                scope.backupItem.attribute = scope.attrs[i];
                            }
                        } else {
                            for (e = 0; e < scope.entityAttrs.length; e = e + 1) {
                                if (scope.entityAttrs[e].name === scope.item.name) {
                                    scope.item.attribute = scope.entityAttrs[e];
                                    scope.backupItem.attribute = scope.entityAttrs[e];
                                }
                            }
                            for (u = 0; u < scope.userInputs.length; u = u + 1) {
                                if (scope.userInputs[u].name === scope.item.name) {
                                    scope.item.attribute = scope.userInputs[u];
                                    scope.backupItem.attribute = scope.userInputs[u];
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

                scope.findAttrsLeft = function () {

                    scope.attrs.forEach(function (attr) {
                        attr.disabled = false;
                        tabs.forEach(function (tab) {
                            tab.layout.fields.forEach(function (item) {
                                if (item.type === 'field') {
                                    if (attr.id === item.id) {
                                        attr.disabled = true;
                                    }
                                }
                            })
                        })
                    });

                    scope.entityAttrs.forEach(function (entityAttr) {
                        entityAttr.disabled = false;
                        tabs.forEach(function (tab) {
                            tab.layout.fields.forEach(function (item) {
                                if (item.type === 'field') {
                                    if (entityAttr.key === item.attribute.key) {
                                        entityAttr.disabled = true;
                                    }
                                }
                            })
                        })
                    });

                    scope.userInputs.forEach(function (userInput) {
                        userInput.disabled = false;
                        tabs.forEach(function (tab) {
                            tab.layout.fields.forEach(function (item) {
                                if (item.type === 'field') {
                                    if (userInput.key === item.attribute.key) {
                                        userInput.disabled = true;
                                        return false;
                                    }
                                }
                            })
                        })
                    });

                };

                scope.bindAttrName = function (item) {

                    if (item.attribute.hasOwnProperty('verbose_name')) {
                        return item.attribute.verbose_name;
                    }

                    return item.attribute.name;
                };

                scope.bindTypeByValueType = function (valueType) {
                    var i;
                    for (i = 0; i < choices.length; i = i + 1) {
                        if (valueType === choices[i].value) {
                            return choices[i]["caption_name"];
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

                    for (e = 0; e < scope.entityAttrs.length; e = e + 1) {
                        if (scope.entityAttrs[e]['value_type'] === 10) {
                            stringAttrs.push(scope.entityAttrs[e]);
                        }
                    }

                    return stringAttrs;

                };

                scope.checkForSpecialOptions = function () {

                    if (scope.item.attribute) {

                        if (scope.item.attribute.name === 'Notes') {
                            scope.specialOptionTemplate = 'views/attribute-options/notes.html';
                            return true;
                        }

                        if (scope.item.attribute['value_type'] === 10) {
                            scope.specialOptionTemplate = 'views/attribute-options/string.html';
                            return true;
                        }

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

                        if (scope.item.attribute['value_type'] === 'decoration' && scope.item.attribute.key === 'layoutLineWithLabel') {
                            scope.specialOptionTemplate = 'views/attribute-options/labeled-line.html';
                            return true;
                        }
                    }

                    return false;
                };

            }
        }
    }

}());