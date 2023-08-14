/**
 * Created by szhitenev on 01.08.2023.
 */
(function () {

    'use strict';

    module.exports = function ($mdDialog) {
        return {
            restrict: 'E',
            templateUrl: 'views/directives/python-editor-view.html',
            scope: {
                source: '=',
                index: '=',
                filePathList: '=',
            },
            link: function (scope, elem, attrs, ngModelCtrl) {

                // console.log('pythonEditor', scope.source);

                scope.init = function () {

                    setTimeout(function () {

                        scope.editor = ace.edit('aceEditor' + scope.index);
                        scope.editor.setTheme("ace/theme/monokai");
                        scope.editor.getSession().setMode("ace/mode/python");
                        scope.editor.getSession().setUseWorker(false);
                        scope.editor.setHighlightActiveLine(false);
                        scope.editor.setShowPrintMargin(false);

                        ace.require("ace/ext/language_tools");
                        scope.editor.setOptions({
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true
                        });
                        scope.editor.setFontSize(14)
                        scope.editor.setBehavioursEnabled(true);
                        scope.editor.setValue(scope.source)

                        scope.editor.focus();
                        scope.editor.navigateFileStart();
                        scope.editor.getSession().on('change', function () {
                            scope.source = scope.editor.getValue();
                        });

                        var undoManager = scope.editor.session.getUndoManager();

                        var path = scope.filePathList.join('__')


                        undoManager.toJSON = function () {
                            return {
                                $redoStack: this.$redoStack,
                                $undoStack: this.$undoStack
                            };
                        }

                        undoManager.fromJSON = function (json) {
                            this.reset();
                            this.$undoStack = json.$undoStack;
                            this.$redoStack = json.$redoStack;
                        }

                        scope.editor.session.on('change', function () {
                            var history = undoManager.toJSON();
                            // console.log('vm.editor.session history', history);
                            localStorage.setItem('ace_editor_' + path + '__' + scope.index, JSON.stringify(history));
                        });

                        var savedHistory = localStorage.getItem('ace_editor_' + path + '__' + scope.index);
                        if (savedHistory) {
                            undoManager.fromJSON(JSON.parse(savedHistory));

                            // console.log('undoManager.$undoStack', undoManager.$undoStack)
                            // console.log('undoManager.$redoStack', undoManager.$redoStack)
                        }


                    }, 100)


                }

                scope.init();

            }
        }
    }

}());