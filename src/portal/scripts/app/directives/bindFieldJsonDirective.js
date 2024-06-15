(function () {

    /** @module bindFieldTableDirective */
    module.exports = function ($mdDialog) {
        return {
            require: "^^bindFieldControl",
            restrict: "E",
            scope: {
                item: '=',
                entity: '=',
                onChangeCallback: '&?'
            },
            templateUrl: "views/directives/bind-field-json-view.html",
            link: function (scope, elem, attr, bfcVm) {

                console.log('bindFieldJson.item', scope.item);
                console.log('bindFieldJson.entity', scope.entity);

                scope.items = []


                scope.openJsonEditor = function ($event, item) {


                    $mdDialog.show({
                        controller: 'JsonEditorDialogController as vm',
                        templateUrl: 'views/dialogs/json-editor-dialog-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
                        targetEvent: $event,
                        preserveScope: true,
                        multiple: true,
                        autoWrap: true,
                        skipHide: true,
                        locals: {
                            item: {expression: JSON.stringify(scope.entity[scope.item.key])},
                            data: {}
                        }
                    }).then(function (res) {

                        if (res.status === 'agree') {

                            // console.log("JSON dialog", res);

                            const resultObject = JSON.parse(res.data.item.expression)

                            // console.log('resultObject', resultObject);

                            Object.assign(scope.entity[scope.item.key], resultObject);

                            // console.log("JSON dialog entity", scope.entity);

                            // scope.entity[scope.item.key] = JSON.parse(res.data.item.expression);

                            if (scope.onChangeCallback) scope.onChangeCallback({changedValue: scope.entity[scope.item.key]});

                            scope.syncItems();

                        }

                    });


                }

                scope.syncItems = function () {

                    scope.items = []

                    // var localDict = JSON.parse(Object.keys(scope.entity[scope.item.key]));

                    if (Object.keys(scope.entity[scope.item.key]).length) {

                        Object.keys(scope.entity[scope.item.key]).forEach(function (key) {

                            scope.items.push({
                                key: key,
                                value: scope.entity[scope.item.key][key]
                            })

                        })

                    }
                }

                scope.init = function () {

                    scope.syncItems();


                }

                scope.init()


            }
        }
    };

}());