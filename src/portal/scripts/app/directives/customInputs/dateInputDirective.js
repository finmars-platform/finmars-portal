(function () {
  "use strict";

  module.exports = function () {
    return {
      restrict: "E",
      scope: {
        label: "@",
        model: "=",
        customButtons: "=",
        customStyles: "=",
        elemsStyles: "=",
        eventSignal: "=",
        smallOptions: "=",
        onChangeCallback: "&?",
      },
      templateUrl: "views/directives/customInputs/date-input-view.html",
      link: function (scope, elem, attr) {

        scope.error = "";
        scope.placeholderText = "yyyy-mm-dd";
        scope.dateValue = ""; // prevents from calling on change method when date changed to the same date

        var stylePreset;

        // TIPS
        // scope.smallOptions probable properties
        // tooltipText: custom tolltip text
        // notNull: turn on error mode if field is not filled

        var inputContainer = elem[0].querySelector(".dateInputContainer");
        var inputElem = elem[0].querySelector(".dateInputElem");

        var inputLoaded = false; // prevents not null inputs highlight from start

        var doNotShowDatepicker = true; // used to prevent datepicker show on click
        var position = "right";
        var defaultDate = false;

        if (scope.smallOptions) {
          if (scope.smallOptions.tooltipText) {
            scope.tooltipText = scope.smallOptions.tooltipText;
          }

          if (scope.smallOptions.position) {
            position = scope.position;
          }

          if (scope.smallOptions.defaultDate) {
            defaultDate = scope.defaultDate;
          }
        }

        scope.getInputContainerClasses = function () {

          var classes = "";

          if (scope.error) {
            classes = "custom-input-error";
          } else if (stylePreset) {
            classes = "custom-input-preset" + stylePreset;
          } else if (scope.valueIsValid) {
            classes = "custom-input-is-valid";
          }

          return classes;

        };

        var onDateBlur = function () {
          scope.error = "";
          stylePreset = "";

          if (scope.dateValue) {

            if (scope.dateValue !== scope.model) {

              if (moment(scope.dateValue, "YYYY-MM-DD", true).isValid()) {

                scope.valueIsValid = true;
                scope.model = JSON.parse(JSON.stringify(scope.dateValue));

              } else {

                scope.valueIsValid = false;
                scope.error ="Date has wrong format. Use one of these formats instead: YYYY-MM-DD.";
                scope.model = null;

              }

              if (scope.onChangeCallback) {

                setTimeout(function () {
                  scope.onChangeCallback();
                }, 0);

              }

            }

          } else if (scope.dateValue !== scope.model) {

            scope.valueIsValid = false;
            scope.model = null;

            if (scope.smallOptions && scope.smallOptions.notNull) {
              scope.error = "Field should not be null";
            }

            if (scope.onChangeCallback) {
              setTimeout(function () {
                scope.onChangeCallback();
              }, 0);
            }

          }
        };

        scope.callFnForCustomBtn = function (actionData) {

          if (actionData.parameters) {
            actionData.callback(actionData.parameters);
          } else {
            actionData.callback();
          }

        };

        scope.focusDateInput = function () {

          inputElem.focus();
          doNotShowDatepicker = false;

          pickmeup(inputElem).show();

        };

        var applyCustomStyles = function () {

          Object.keys(scope.customStyles).forEach(function (className) {

            var elemClass = "." + className;
            var elemToApplyStyles = elem[0].querySelectorAll(elemClass);

            if (elemToApplyStyles.length) {

              elemToApplyStyles.forEach(function (htmlNode) {
                htmlNode.style.cssText = scope.customStyles[className];
              })

            }

          });

        };

        var prepareCustomButtons = function () {

          scope.plussMinusButtons = [];
          scope.usualCustomButtons = [];

          scope.customButtons.forEach(function (cBtn) {

            if (cBtn.classes && cBtn.classes.indexOf("date-input-specific-btns") > -1) {
              scope.plussMinusButtons.push(cBtn);

            } else {
              scope.usualCustomButtons.push(cBtn);

            }

          });

        }

        var initEventListeners = function () {

          elem[0].addEventListener("mouseover", function () {
            inputContainer.classList.add("custom-input-hovered");
          });

          elem[0].addEventListener("mouseleave", function () {
            inputContainer.classList.remove("custom-input-hovered");
          });

          inputElem.addEventListener("focus", function () {
            doNotShowDatepicker = true;
            inputContainer.classList.add("custom-input-focused");
          });

          inputElem.addEventListener("blur", function () {
            inputContainer.classList.remove("custom-input-focused");

            setTimeout(function () {
              // without timeout changes will be discarded on fast blur
              onDateBlur();
              scope.$apply();

            }, 250);

          });

          inputElem.addEventListener("pickmeup-show", function (event) {
            if (doNotShowDatepicker) {
              event.preventDefault();
            }
          });

          inputElem.addEventListener("pickmeup-change", function (event) {
            scope.dateValue = event.detail.formatted_date;
            scope.$apply();
          });

          inputElem.addEventListener("pickmeup-hide", function (event) {
            doNotShowDatepicker = true;
          });

        };

        var initScopeWatchers = function () {

          scope.$watch("model", function () {
            //if (scope.model && scope.model.value) {
            if (scope.model) {

              if (scope.model !== scope.dateValue) {

                scope.error = "";
                scope.dateValue = JSON.parse(JSON.stringify(scope.model));

                if (!moment(scope.dateValue, "YYYY-MM-DD", true).isValid()) {

                  scope.valueIsValid = false;
                  scope.error = "Date has wrong format. Use one of these formats instead: YYYY-MM-DD.";
                  scope.model = null;

                }

              }

            } else {

              if (scope.dateValue) {

                if (!scope.error) {
                  scope.dateValue = "";
                }

              } else if (scope.smallOptions && scope.smallOptions.notNull && inputLoaded) {
                scope.error = "Field should not be null";
              }

            }

            inputLoaded = true;
          });

          if (scope.eventSignal) {
            // this if prevents watcher below from running without need

            scope.$watch("eventSignal", function () {
              if (scope.eventSignal && scope.eventSignal.key) {
                switch (scope.eventSignal.key) {

                  case "mark_not_valid_fields":
                    /*if (scope.smallOptions && scope.smallOptions.notNull) {

                        if (!scope.model && !scope.dateValue) {
                            scope.error = 'Field should not be null';
                        }

                    }*/

                    if (!scope.model && !scope.dateValue) {
                      scope.error = "Field should not be null";
                    }

                    break;

                  case "set_style_preset1":
                    stylePreset = 1;
                    break;

                  case "set_style_preset2":
                    stylePreset = 2;
                    break;
                }

                scope.eventSignal = {};
              }
            });
          }
        };

        var init = function () {

          if (scope.customButtons) {
            prepareCustomButtons();
          }

          if (scope.dateValue) {

            pickmeup(inputElem, {
              date: new Date(scope.dateValue),
              current: new Date(scope.dateValue),
              position: position,
              default_date: defaultDate,
              hide_on_select: true,
              format: "Y-m-d",
            });

          } else {

            pickmeup(inputElem, {
              position: position,
              default_date: defaultDate,
              hide_on_select: true,
              format: "Y-m-d",
            });

          }

          initScopeWatchers();

          initEventListeners();

          if (scope.customStyles) {
            applyCustomStyles();
          }
        };

        init();
      },
    };
  };

}());
