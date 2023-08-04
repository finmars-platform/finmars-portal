/**
 * Created by szhitenev on 04.08.2023.
 */
(function () {

    'use strict';

    module.exports = function ($mdDialog) {
        return {
            restrict: 'E',
            templateUrl: 'views/directives/json-editor-view.html',
            scope: {
                source: '=',
                index: '='
            },
            link: function (scope, elem, attrs, ngModelCtrl) {

                // console.log('pythonEditor', scope.source);

                scope.init = function () {

                    setTimeout(function () {

                        scope.editor = ace.edit('jsonAceEditor' + scope.index);
                        scope.editor.setTheme("ace/theme/monokai");
                        scope.editor.getSession().setMode("ace/mode/json");
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
                        scope.editor.getSession().on('change', function() {
                            scope.source = scope.editor.getValue();
                        });


                    }, 100)


                }

                scope.init();

            }
        }
    }

}());