/**
 * Created by mevstratov on 25.03.2019.
 */
(function () {
  "use strict";

  module.exports = function ($mdDialog) {
    return {
      restrict: "E",
      scope: {
        getDataMethod: "&?", // needed for downloading items on opening multiselector
        items: "=",
        model: "=",
        title: "@",
        dialogTitle: "@",
        nothingSelectedText: "@",
        selectedItemsIndication: "@",
        nameProperty: "@",
        onChangeCallback: "&?",
      },
      require: "?ngModel",
      templateUrl: "views/directives/two-fields-multiselect-view.html",
      link: function (scope, elem, attr, ngModel) {

        // Andrew's code here
        /*
        scope.inputText = "";
        scope.itemsSelected = [];
        scope.itemAxact = "";
        scope.clientWidth = 0;

        scope.deleteAllSelectedItems = function (event) {
          scope.inputText = "Off";
          scope.model = [];
        };

        scope.deleteById = async function ({ id }, $index) {

          let items = await getItems();
          scope.model = await scope.itemsSelected
            .filter((el) => el.id !== id)
            .map((s) => s.id);
          scope.itemsSelected = await scope.itemsSelected.filter(
            (el) => el.id !== id
          );
          //   idx = Math.min(...scope.model);
          scope.itemAxact = items
            .filter((el) => el.id == id)
            .map((n) => n.name)
            .join("");
          scope.$apply();
        };

        if (!scope.nameProperty) {
          scope.nameProperty = "name";
        }
        var items = [];
        scope.$watch("model", function () {
          setInputText();
        });

        var defaultInputText = async function () {
          var selElemNumber = 0;
          let chipsName = "";
          if (scope.model && scope.model.length > 0) {
            selElemNumber = scope.model.length;
          }
          if (selElemNumber === 0) {
            scope.inputText = "";
            if (
              scope.nothingSelectedText ||
              typeof scope.nothingSelectedText === "string"
            ) {
              scope.inputText = scope.nothingSelectedText;
            } else {
              scope.inputText = "0 items selected";
            }
          } else {

            const items = await getItems();

            let idx = Math.min(...scope.model);
            scope.itemAxact = items
              .filter((el) => el.id == idx)
              .map((n) => n.name)
              .join("");
            scope.itemsSelected = [];
            scope.model.forEach((Elem) => {
              items.forEach((el) => {
                if (Elem == el.id) {
                  scope.itemsSelected.push(el);
                }
              });
            });

            scope.inputText = selElemNumber - scope.clientWidth;

            scope.$apply();

          }
        };

        var arrayLikeInputText = function () {

          var propName = scope.nameProperty || "name";

          if (scope.model && scope.model.length) {

            if (scope.items && scope.items.length) {

              scope.inputText = "[";
              scope.tooltipText = "Values selected:";
              scope.model.forEach(function (sItemId, index) {

                for (var i = 0; i < scope.items.length; i++) {
                  if (scope.items[i].id === sItemId) {
                    if (index > 0) {
                      scope.inputText = scope.inputText + ",";
                      scope.tooltipText = scope.tooltipText + ",";
                    }
                    scope.inputText =
                      scope.inputText + " " + scope.items[i][propName];
                    scope.tooltipText =
                      scope.tooltipText + " " + scope.items[i][propName];
                    break;
                  }
                }
              });

              scope.inputText = scope.inputText + " ]";

            } else {
              // in case of error
              scope.inputText = scope.model.length + " items selected";
            }

          } else if (scope.nothingSelectedText) {
            scope.inputText = scope.nothingSelectedText;

          } else {
            scope.inputText = "[ ]";
          }
        };

        var setInputText = function () {
          if (scope.selectedItemsIndication) {
            switch (scope.selectedItemsIndication) {
              case "array":
                arrayLikeInputText();
                break;
            }
          } else {
            defaultInputText();
          }
        };

        var getItems = function () {
          return new Promise(function (resolve, reject) {
            if (items && items.length) {
              resolve(items);
            } else {
              if (scope.items && scope.items.length) {
                items = JSON.parse(JSON.stringify(scope.items));
                resolve(items);
              } else if (scope.getDataMethod) {
                scope
                  .getDataMethod()
                  .then(function (resData) {
                    items = JSON.parse(JSON.stringify(resData.results));
                    resolve(items);
                  })
                  .catch(function (error) {
                    items = [];
                    resolve(items);
                  });
              }
            }
          });
        };

        scope.selectItemModal = function (event) {

          if (scope.clientWidth < event.currentTarget.clientWidth) {
            const maxItemSize = 130;
            scope.clientWidth = parseInt(
              event.currentTarget.clientWidth / maxItemSize
            );
          }

          getItems().then(function (data) {
            items = data;
            $mdDialog
              .show({
                controller: "TwoFieldsMultiselectDialogController as vm",
                templateUrl:
                  "views/dialogs/two-fields-multiselect-dialog-view.html",
                targetEvent: event,
                multiple: true,
                locals: {
                  data: {
                    items: items,
                    model: scope.model,
                    title: scope.title,
                    nameProperty: scope.nameProperty,
                  },
                },

              }).then(function (res) {

                if (res.status === "agree") {

                  scope.model = res.selectedItems;

                  if (scope.onChangeCallback) {

                    scope.model = res.selectedItems;

                    setTimeout(function () {
                      scope.onChangeCallback();
                    }, 500);

                  } else if (ngModel) {
                    ngModel.$setViewValue(res.selectedItems);
                  }

                }

              });
          });
        };

        $(elem).mouseover(function (event) {
          event.preventDefault();
          event.stopPropagation();
          scope.toltipShow = true;
          scope.$apply();
        });

        $(elem).mouseleave(function (event) {
          event.preventDefault();
          event.stopPropagation();
          scope.toltipShow = false;
          scope.$apply();
        }); */
        // < Andrew's code here >

        scope.inputText = '';

        if (!scope.nameProperty) {
          scope.nameProperty = 'name';
        }

        var dialogTitle = scope.dialogTitle || scope.title;
        var items = [];

        scope.$watch('model', function () {
          setInputText();
        });

        scope.$watch('items', function () {

        	if (Array.isArray(scope.items)) {
				items = JSON.parse(JSON.stringify(scope.items));

        	} else {
				items = [];
			}

        });

        var defaultInputText = function () {

          var selElemNumber = 0;
          if (scope.model && scope.model.length > 0) {
            selElemNumber = scope.model.length;
          }

          if (selElemNumber === 0) {

            scope.inputText = "";

            if (scope.nothingSelectedText || typeof scope.nothingSelectedText === "string") {
              scope.inputText = scope.nothingSelectedText;

            } else {
              scope.inputText = "0 items selected";
            }

          } else {
            scope.inputText = selElemNumber + " " + "items selected";
          }

        };

        var arrayLikeInputText = function () {

          var propName = scope.nameProperty || 'name';

          if (scope.model && scope.model.length) {

            if (scope.items && scope.items.length) {

              scope.inputText = '[';
              scope.tooltipText = 'Values selected:';

              scope.model.forEach(function (sItemId, index) {

                for (var i = 0; i < scope.items.length; i++) {

                  if (scope.items[i].id === sItemId) {

                    if (index > 0) { // add comma between selected items
                      scope.inputText = scope.inputText + ',';
                      scope.tooltipText = scope.tooltipText + ',';
                    }

                    scope.inputText = scope.inputText + ' ' + scope.items[i][propName];
                    scope.tooltipText = scope.tooltipText + ' ' + scope.items[i][propName];

                    break;

                  }

                }

              });

              scope.inputText = scope.inputText + ' ]';

            } else { // in case of error
              scope.inputText = scope.model.length + ' items selected';
            }

            //scope.inputText = '[' + scope.model.join(', ') + ']';

          } else if (scope.nothingSelectedText) {

            scope.inputText = scope.nothingSelectedText;

          } else {

            scope.inputText = "[ ]";

          }

        };

        var setInputText = function () {

          if (scope.selectedItemsIndication) {

            switch (scope.selectedItemsIndication) {
              case "array":
                arrayLikeInputText();
                break;
            }

          } else {
            defaultInputText();
          }

        };

        //setInputText();

        var getItems = function () {

          return new Promise(function (resolve, reject) {

            /*if (items && items.length) {
              resolve(items);

            } else {*/

              if (scope.items && Array.isArray(scope.items)) {

                items = JSON.parse(JSON.stringify(scope.items));
                resolve(items);

              } else if (scope.getDataMethod) {

                scope.getDataMethod().then(function (resData) {

                  scope.items = resData.results;
                  items = JSON.parse(JSON.stringify(scope.items));
                  resolve(items);

                }).catch(function (error) {

                  items = [];
                  resolve(items);

                });

              }

            // }

          })

        }

        $(elem).click(function (event) {

          event.preventDefault();
          event.stopPropagation();

          getItems().then(function (data) {

            items = data;

            $mdDialog.show({
              controller: "TwoFieldsMultiselectDialogController as vm",
              templateUrl: "views/dialogs/two-fields-multiselect-dialog-view.html",
              targetEvent: event,
              multiple: true,
              locals: {
                data: {
                  items: items,
                  model: scope.model,
                  title: dialogTitle,
                  nameProperty: scope.nameProperty
                }
              }
            }).then(function (res) {

              if (res.status === "agree") {

                scope.model = res.selectedItems;

                if (scope.onChangeCallback) {
                  scope.model = res.selectedItems;

                  setTimeout(function () {
                    scope.onChangeCallback();
                  }, 500);

                } else if (ngModel) {
                  ngModel.$setViewValue(res.selectedItems);
                }

              }

            });

          });

        });

      },
    };
  };
})();
