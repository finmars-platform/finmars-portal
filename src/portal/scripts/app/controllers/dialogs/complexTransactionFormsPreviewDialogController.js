/**
 * Created by mevstratov on 18.01.2020. Form Editor Preview Andrew
 */
(function () {
  "use strict";
  var evEditorEvents = require("../../services/ev-editor/entityViewerEditorEvents");
  var layoutService = require("../../services/layoutService");
  var metaService = require("../../services/metaService");

  var gridHelperService = require("../../services/gridHelperService");
  var attributeTypeService = require("../../services/attributeTypeService");

  var transactionTypeService = require("../../services/transactionTypeService");
  var portfolioService = require("../../services/portfolioService");
  var instrumentTypeService = require("../../services/instrumentTypeService");

  var uiService = require("../../services/uiService");
  //   Из функции 1
  var entityEditorHelper = require("../../helpers/entity-editor.helper");
  var transactionHelper = require("../../helpers/transaction.helper");
  //

  // Andrew 1
  var EntityViewerEditorEventService = require("../../services/ev-editor/entityViewerEditorEventService");
  var EntityViewerEditorDataService = require("../../services/ev-editor/entityViewerEditorDataService");
  //

  module.exports = function ($scope, $mdDialog, inputFormTabs, data) {
    // Переменная из функции 1
    var notCopiedTransaction = true;
    var tabsWithErrors = {};
    // vm.transactionType = null;
    var dataConstructorLayout = [];
    var errorFieldsList = [];
    //   Переменная 1 из функции 1
    var inputsWithCalculations;
    //   Переменная 1
    // Переменная 2 из функции 3
    var dcLayoutHasBeenFixed = false;
    //  Переменная 2
    var vm = this;

    vm.entityType = data.entityType;

    vm.entity = { $_isValid: true };

    vm.tabs = inputFormTabs;

    vm.readyStatus = {
      content: false,
      entity: true,
      transactionTypes: false,
      layout: false,
    };

    vm.attrs = [];
    vm.layoutAttrs = layoutService.getLayoutAttrs();
    vm.entityAttrs = metaService.getEntityAttrs(vm.entityType) || [];

    vm.range = gridHelperService.range;

    vm.transactionTypeId = data.transactionTypeId;

    vm.attributesLayout = [];

    // vm.generateAttributesFromLayoutFields = function () {
    //   vm.attributesLayout = [];
    //   var tabResult;
    //   var fieldResult;
    //   var i, l, e, u;

    //   vm.tabs.forEach(function (tab) {
    //     tabResult = [];

    //     tab.layout.fields.forEach(function (field) {
    //       fieldResult = {};

    //       if (field && field.type === "field") {
    //         if (field.attribute_class === "attr") {
    //           for (i = 0; i < vm.attrs.length; i = i + 1) {
    //             if (field.key) {
    //               if (field.key === vm.attrs[i].user_code) {
    //                 vm.attrs[i].options = field.options;
    //                 fieldResult = vm.attrs[i];
    //               }
    //             } else {
    //               if (field.attribute.user_code) {
    //                 if (field.attribute.user_code === vm.attrs[i].user_code) {
    //                   vm.attrs[i].options = field.options;
    //                   fieldResult = vm.attrs[i];
    //                 }
    //               }
    //             }
    //           }
    //         } else {
    //           var attrFound = false;

    //           for (e = 0; e < vm.entityAttrs.length; e = e + 1) {
    //             if (field.name === vm.entityAttrs[e].name) {
    //               vm.entityAttrs[e].options = field.options;
    //               fieldResult = vm.entityAttrs[e];

    //               attrFound = true;
    //               break;
    //             }
    //           }

    //           if (!attrFound) {
    //             for (u = 0; u < vm.userInputs.length; u = u + 1) {
    //               if (field.name === vm.userInputs[u].name) {
    //                 vm.userInputs[u].options = field.options;
    //                 fieldResult = vm.userInputs[u];

    //                 attrFound = true;
    //                 break;
    //               }
    //             }
    //           }

    //           if (!attrFound) {
    //             for (l = 0; l < vm.layoutAttrs.length; l = l + 1) {
    //               if (field.name === vm.layoutAttrs[l].name) {
    //                 vm.layoutAttrs[l].options = field.options;
    //                 fieldResult = vm.layoutAttrs[l];

    //                 attrFound = true;
    //                 break;
    //               }
    //             }
    //           }
    //         }

    //         if (field.backgroundColor) {
    //           fieldResult.backgroundColor = field.backgroundColor;
    //         }

    //         fieldResult.editable = field.editable;
    //       }

    //       tabResult.push(fieldResult);
    //     });

    //     vm.attributesLayout.push(tabResult);
    //   });
    // };

    /*vm.loadPermissions = function () {

            var promises = [];

            promises.push(vm.getCurrentMember());
            promises.push(vm.getGroupList());

            Promise.all(promises).then(function (data) {

                vm.entity.object_permissions.forEach(function (perm) {

                    if (perm.permission === "change_" + vm.entityType.split('-').join('')) {

                        if (vm.currentMember.groups.indexOf(perm.group) !== -1) {
                            vm.hasEditPermission = true;
                        }

                    }

                });

                if (vm.currentMember && vm.currentMember.is_admin) {
                    vm.hasEditPermission = true;
                    vm.canManagePermissions = true;
                }

                vm.readyStatus.permissions = true;
                $scope.$apply();
            });

        };

        vm.getCurrentMember = function () {

            return usersService.getMyCurrentMember().then(function (data) {

                vm.currentMember = data;

                $scope.$apply();

            });
        };

        vm.checkPermissions = function () {

            if (metaPermissionsService.getEntitiesWithDisabledPermissions().indexOf(vm.entityType) !== -1) {
                return false;
            }

            if (vm.currentMember && vm.currentMember.is_admin) {
                return true
            }

            var permission_code = "manage_" + vm.entityType.split('-').join('').toLowerCase();

            var haveAccess = false;

            vm.entity.object_permissions.forEach(function (item) {

                if (item.permission === permission_code && vm.currentMember.groups.indexOf(item.group) !== -1) {
                    haveAccess = true;
                }

            });

            return haveAccess;
        };*/

    vm.getContextParameters = function () {
      var result = {};

      if (vm.contextData) {
        Object.keys(vm.contextData).forEach(function (key) {
          if (key.indexOf("_object") === -1) {
            result[key] = vm.contextData[key];
          }
        });
      }

      return result;
    };
    // тут
    vm.getFormLayoutFields = function () {
      return new Promise(function (resolve, reject) {
        vm.readyStatus.layout = false;

        var contextParameters = vm.getContextParameters();

        transactionTypeService
          .initBookComplexTransaction(vm.transactionTypeId, contextParameters)
          .then(function (data) {
            var inputsWithCalculations = data.transaction_type_object.inputs;

            vm.entity = data.complex_transaction;

            vm.readyStatus.entity = true;
            // тут
            vm.transactionType = data.transaction_type_object;
            if (Object.keys(data).length) {
              if (data.hasOwnProperty("contextData")) {
                vm.contextData = Object.assign({}, data.contextData);
                //delete entity.contextData;

                vm.transactionTypeId = entity.transaction_type;

                vm.dataConstructorData = {
                  entityType: vm.entityType,
                  instanceId: vm.transactionTypeId,
                };

                vm.getFormLayout().then(function (value) {
                  $scope.$apply();
                });
              } /*else if (entity.hasOwnProperty('transaction_type')) {
        
                            vm.transactionTypeId = entity.transaction_type;
        
                            vm.dataConstructorData = {
                                entityType: vm.entityType,
                                instanceId: vm.transactionTypeId
                            };
        
                            vm.getFormLayout().then(function (value) {
                                $scope.$apply();
                            })
        
                        }*/ else if (
                data.isCopy
              ) {
                // if copy

                console.log("Apply from make copy", entity);
                notCopiedTransaction = false;
                vm.entity = entity;

                var copy = JSON.parse(JSON.stringify(entity));

                vm.transactionTypeId = vm.entity.transaction_type;

                vm.getFormLayout().then(function (value) {
                  Object.keys(copy).forEach(function (key) {
                    vm.entity[key] = copy[key];
                  });

                  console.log("Copy finished vm.entity", vm.entity);

                  delete vm.entity.id;

                  vm.entity.is_locked = false;
                  vm.entity.is_active = false;

                  $scope.$apply();
                });
              }
            }
            // тут

            var keys = Object.keys(data.values);

            keys.forEach(function (item) {
              vm.entity[item] = data.values[item];
            });
            // Добавил book
            // if (dcLayoutHasBeenFixed) {
            //     vm.transactionType.book_transaction_layout = dataConstructorLayout;

            //     transactionTypeService.update(
            //       vm.transactionType.id,
            //       vm.transactionType
            //     );
            //   }

            //
            if (data.book_transaction_layout) {
              vm.missingLayoutError = false;

              postBookComplexTransactionActions(data);

              /*vm.oldValues = {};
  
                          vm.userInputs.forEach(function (item) {
                              vm.oldValues[item.name] = vm.entity[item.name]
                          });*/
            } else {
              vm.missingLayoutError = true;
            }

            //

            vm.userInputs = [];
            vm.tabs.forEach(function (tab) {
              tab.layout.fields.forEach(function (field) {
                if (field.attribute_class === "userInput") {
                  vm.userInputs.push(field.attribute);
                }
              });
            });

            vm.tabs = vm.tabs.map(function (item, index) {
              item.index = index;

              return item;
            });
            // тут 1
            // vm.generateAttributesFromLayoutFields();

            // inputsWithCalculations.forEach(function (inputWithCalc) {
            //   vm.userInputs.forEach(function (userInput) {
            //     if (userInput.name === inputWithCalc.name) {
            //       if (inputWithCalc.can_recalculate === true) {
            //         userInput.buttons = [
            //           {
            //             icon: "iso",
            //             tooltip: "Recalculate",
            //             caption: "",
            //             classes: "md-raised",
            //             action: vm.recalculate,
            //           },
            //         ];
            //       }
            //     }
            //   });
            // });
            // баг

            vm.readyStatus.layout = true;

            resolve();
          });
      });
    };

    function getGroupsFromItems(items) {
      var groups = {};

      items.forEach(function (item) {
        if (item.group_object) {
          if (!groups[item.group_object.id]) {
            groups[item.group_object.id] = item.group_object;
            groups[item.group_object.id].items = [];
          }

          groups[item.group_object.id].items.push(item);
        } else {
          if (!groups["ungrouped"]) {
            groups["ungrouped"] = { name: "Ungrouped" };
            groups["ungrouped"].items = [];
          }

          groups["ungrouped"].items.push(item);
        }
      });

      var groupsList = Object.keys(groups).map(function (key) {
        return groups[key];
      });

      groupsList = groupsList.filter(function (item) {
        return !!item;
      });

      return groupsList;
    }

    vm.getPortfolios = function () {
      portfolioService.getList().then(function (data) {
        vm.portfolios = data.results;
        $scope.$apply();
      });
    };

    vm.getInstrumentTypes = function () {
      instrumentTypeService.getList().then(function (data) {
        vm.instrumentTypes = data.results;
        $scope.$apply();
      });
    };

    vm.loadTransactionTypes = function () {
      var options = {
        filters: {
          portfolio: null,
          instrument_type: null,
        },
        pageSize: 1000,
      };

      return transactionTypeService.getListLight(options).then(function (data) {
        vm.transactionGroups = getGroupsFromItems(data.results);

        vm.readyStatus.transactionTypes = true;
      });
    };

    vm.getAttributeTypes = function () {
      return attributeTypeService.getList(vm.entityType).then(function (data) {
        vm.attrs = data.results;
        vm.readyStatus.content = true;
      });
    };

    vm.checkReadyStatus = function () {
      return (
        vm.readyStatus.content &&
        vm.readyStatus.entity &&
        vm.readyStatus.transactionTypes &&
        vm.readyStatus.layout
      );
    };
    // Изменение flex

    vm.bindFlex = function (tab, field) {
      var flexUnit = 100 / tab.layout.columns;
      return Math.floor(field.colspan * flexUnit);
    };
    //

    vm.checkFieldRender = function (tab, row, field) {
      if (field.row === row) {
        if (field.type === "field") {
          return true;
        } else {
          var spannedCols = [];
          var itemsInRow = tab.layout.fields.filter(function (item) {
            return item.row === row;
          });

          itemsInRow.forEach(function (item) {
            if (item.type === "field" && item.colspan > 1) {
              var columnsToSpan = item.column + item.colspan - 1;

              for (var i = item.column; i <= columnsToSpan; i = i + 1) {
                spannedCols.push(i);
              }
            }
          });

          if (spannedCols.indexOf(field.column) !== -1) {
            return false;
          }

          return true;
        }
      }
      return false;
    };

    vm.cancel = function () {
      $mdDialog.hide({ status: "disagree" });
    };

    var init = function () {
      var promises = [];
      //   Andrew 1
      vm.evEditorDataService = new EntityViewerEditorDataService();
      vm.evEditorEventService = new EntityViewerEditorEventService();
      //   Andrew

      promises.push(vm.getFormLayoutFields());
      //vm.getFormLayoutFields();

      vm.getPortfolios();
      vm.getInstrumentTypes();
      promises.push(vm.loadTransactionTypes());
      //vm.loadTransactionTypes();

      promises.push(vm.getAttributeTypes());
      //vm.getAttributeTypes();

      Promise.all(promises).then(function () {
        $scope.$apply(function () {
          setTimeout(function () {
            $("body")
              .find(".md-select-search-pattern")
              .on("keydown", function (ev) {
                ev.stopPropagation();
              });
          }, 100);
        });
      });
    };
    // Функция 8
    vm.bookAsPending = function ($event) {
      vm.updateEntityBeforeSave();

      vm.entity.$_isValid = entityEditorHelper.checkForNotNullRestriction(
        vm.entity,
        vm.entityAttrs,
        vm.attrs
      );

      var hasProhibitNegNums = entityEditorHelper.checkForNegNumsRestriction(
        vm.entity,
        vm.entityAttrs,
        vm.userInputs,
        vm.layoutAttrs
      );

      if (vm.entity.$_isValid) {
        if (hasProhibitNegNums.length === 0) {
          var resultEntity = entityEditorHelper.removeNullFields(vm.entity);

          resultEntity.values = {};

          vm.userInputs.forEach(function (userInput) {
            if (userInput !== null) {
              var keys = Object.keys(vm.entity);
              keys.forEach(function (key) {
                if (key === userInput.name) {
                  resultEntity.values[userInput.name] =
                    vm.entity[userInput.name];
                }
              });
            }
          });

          resultEntity.store = true;
          resultEntity.calculate = true;

          console.log("resultEntity", resultEntity);

          new Promise(function (resolve, reject) {
            transactionTypeService
              .initBookPendingComplexTransaction(resultEntity.transaction_type)
              .then(function (data) {
                var res = Object.assign(data, resultEntity);

                res.complex_transaction.is_locked = resultEntity.is_locked;
                res.complex_transaction.is_canceled = resultEntity.is_canceled;

                transactionTypeService
                  .bookPendingComplexTransaction(
                    resultEntity.transaction_type,
                    res
                  )
                  .then(function (data) {
                    toastNotificationService.success(
                      "Transaction was successfully booked"
                    );

                    resolve(data);
                  });
              });
          })
            .then(function (data) {
              if (
                data.hasOwnProperty("has_errors") &&
                data.has_errors === true
              ) {
                $mdDialog.show({
                  controller: "ValidationDialogController as vm",
                  templateUrl: "views/dialogs/validation-dialog-view.html",
                  targetEvent: $event,
                  locals: {
                    validationData: {
                      errorData: data,
                      tableColumnsNames: ["Name of fields", "Error Cause"],
                      entityType: "complex-transaction",
                    },
                  },
                  multiple: true,
                  preserveScope: true,
                  autoWrap: true,
                  skipHide: true,
                });
              } else {
                $mdDialog.hide({ res: "agree" });
              }

              $mdDialog.hide({ res: "agree" });
            })
            .catch(function (data) {
              $mdDialog.show({
                controller: "ValidationDialogController as vm",
                templateUrl: "views/dialogs/validation-dialog-view.html",
                targetEvent: $event,
                locals: {
                  validationData: {
                    errorData: data,
                    tableColumnsNames: ["Name of fields", "Error Cause"],
                    entityType: "complex-transaction",
                  },
                },
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
              });
            });
        } else {
          var warningDescription =
            "<p>Next fields should have positive number value to proceed:";

          hasProhibitNegNums.forEach(function (field) {
            warningDescription = warningDescription + "<br>" + field;
          });

          warningDescription = warningDescription + "</p>";

          $mdDialog.show({
            controller: "WarningDialogController as vm",
            templateUrl: "views/warning-dialog-view.html",
            multiple: true,
            clickOutsideToClose: false,
            locals: {
              warning: {
                title: "Warning",
                description: warningDescription,
                actionsButtons: [
                  {
                    name: "CLOSE",
                    response: { status: "disagree" },
                  },
                ],
              },
            },
          });
        }
      }
    };

    //
    // Функция 7
    vm.transactionTypeChange = function () {
      notCopiedTransaction = true;
      vm.entity.transaction_type = vm.transactionTypeId;

      vm.dataConstructorData = {
        entityType: vm.entityType,
        instanceId: vm.transactionTypeId,
      };
      // тут
      vm.getFormLayoutFields().then(function () {
        $scope.$apply();
      });
    };
    // Функция 7
    // i hope
    vm.book = function ($event) {
      vm.updateEntityBeforeSave();

      var errors = entityEditorHelper.validateComplexTransactionFields(
        vm.entity,
        vm.transactionType.actions,
        vm.tabs,
        vm.entityAttrs,
        vm.attrs,
        vm.userInputs
      );

      if (errors.length) {
        tabsWithErrors = {};

        errors.forEach(function (errorObj) {
          if (errorObj.locationData && errorObj.locationData.type === "tab") {
            var tabName = errorObj.locationData.name.toLowerCase();

            var selectorString =
              ".tab-name-elem[data-tab-name='" + tabName + "']";

            var tabNameElem = document.querySelector(selectorString);
            tabNameElem.classList.add("error-tab");

            if (!tabsWithErrors.hasOwnProperty(tabName)) {
              tabsWithErrors[tabName] = [errorObj.key];
            } else if (tabsWithErrors[tabName].indexOf(errorObj.key) < 0) {
              tabsWithErrors[tabName].push(errorObj.key);
            }

            errorFieldsList.push(errorObj.key);
          }
        });

        vm.evEditorEventService.dispatchEvent(
          evEditorEvents.MARK_FIELDS_WITH_ERRORS
        );

        $mdDialog.show({
          controller: "EvAddEditValidationDialogController as vm",
          templateUrl: "views/dialogs/ev-add-edit-validation-dialog-view.html",
          targetEvent: $event,
          multiple: true,
          locals: {
            data: {
              errorsList: errors,
            },
          },
        });
      } else {
        // var resultEntity = entityEditorHelper.removeNullFields(vm.entity);
        var resultEntity = vm.entity;

        resultEntity.values = {};

        vm.userInputs.forEach(function (userInput) {
          if (userInput !== null) {
            var keys = Object.keys(vm.entity);
            keys.forEach(function (key) {
              if (key === userInput.name) {
                resultEntity.values[userInput.name] = vm.entity[userInput.name];
              }
            });
          }
        });

        resultEntity.store = true;
        resultEntity.calculate = true;

        console.log("resultEntity", resultEntity);

        new Promise(function (resolve, reject) {
          vm.processing = true;

          transactionTypeService
            .initBookComplexTransaction(resultEntity.transaction_type, {})
            .then(function (data) {
              var res = Object.assign(data, resultEntity);

              res.complex_transaction.is_locked = resultEntity.is_locked;
              res.complex_transaction.is_canceled = resultEntity.is_canceled;

              if (dcLayoutHasBeenFixed) {
                vm.transactionType.book_transaction_layout = dataConstructorLayout;

                transactionTypeService.update(
                  vm.transactionType.id,
                  vm.transactionType
                );
              }

              transactionTypeService
                .bookComplexTransaction(resultEntity.transaction_type, res)
                .then(function (data) {
                  vm.processing = false;

                  toastNotificationService.success(
                    "Transaction was successfully booked"
                  );

                  resolve(data);
                })
                .catch(function (data) {
                  vm.processing = false;

                  $mdDialog.show({
                    controller: "ValidationDialogController as vm",
                    templateUrl: "views/dialogs/validation-dialog-view.html",
                    targetEvent: $event,
                    parent: angular.element(document.body),
                    multiple: true,
                    locals: {
                      validationData: {
                        errorData: data,
                        tableColumnsNames: ["Name of fields", "Error Cause"],
                        entityType: "complex-transaction",
                      },
                    },
                  });

                  reject(data);
                });
            });
        }).then(function (data) {
          if (data.hasOwnProperty("has_errors") && data.has_errors === true) {
            $mdDialog.show({
              controller: "ValidationDialogController as vm",
              templateUrl: "views/dialogs/validation-dialog-view.html",
              targetEvent: $event,
              locals: {
                validationData: {
                  errorData: data,
                  tableColumnsNames: ["Name of fields", "Error Cause"],
                  entityType: "complex-transaction",
                },
              },
              multiple: true,
            });
          } else {
            $mdDialog.hide({ res: "agree", data: data });
          }
        });
      }
    };
    //   i hope
    // Функция 5 рекалькуляция

    var bookComplexTransaction = function (
      inputsToRecalculate,
      recalculationData
    ) {
      vm.processing = true;

      var values = {};

      vm.userInputs.forEach(function (item) {
        values[item.name] = vm.entity[item.name];
      });

      var book = {
        transaction_type: vm.entity.transaction_type,
        recalculate_inputs: inputsToRecalculate,
        process_mode: "recalculate",
        values: values,
      };

      transactionTypeService
        .bookComplexTransaction(book.transaction_type, book)
        .then(function (data) {
          vm.transactionTypeId = data.transaction_type;
          vm.editLayoutEntityInstanceId = data.transaction_type;

          vm.entity = data.complex_transaction;

          vm.transactionType = data.transaction_type_object;

          vm.specialRulesReady = true;
          vm.readyStatus.entity = true;

          var keys = Object.keys(data.values);

          keys.forEach(function (key) {
            vm.entity[key] = data.values[key];
          });

          data.complex_transaction.attributes.forEach(function (item) {
            if (item.attribute_type_object.value_type === 10) {
              vm.entity[item.attribute_type_object.name] = item.value_string;
            }
            if (item.attribute_type_object.value_type === 20) {
              vm.entity[item.attribute_type_object.name] = item.value_float;
            }
            if (item.attribute_type_object.value_type === 30) {
              vm.entity[item.attribute_type_object.name] = item.classifier;
            }
            if (item.attribute_type_object.value_type === 40) {
              vm.entity[item.attribute_type_object.name] = item.value_date;
            }
          });

          var recalculationInfo = {
            recalculatedInputs: inputsToRecalculate,
            recalculationData: recalculationData,
          };

          postBookComplexTransactionActions(data, recalculationInfo);

          vm.processing = false;

          $scope.$apply();

          if (
            recalculationInfo.recalculatedInputs &&
            recalculationInfo.recalculatedInputs.length
          ) {
            vm.evEditorEventService.dispatchEvent(
              evEditorEvents.FIELDS_RECALCULATED
            );
          }
        })
        .catch(function (reason) {
          console.log("Something went wrong with recalculation", reason);

          vm.processing = false;
          vm.readyStatus.layout = true;

          $scope.$apply();
        });
    };
    vm.recalculate = function (paramsObj) {
      var inputs = paramsObj.inputs;
      var recalculationData = paramsObj.recalculationData;

      bookComplexTransaction(inputs, recalculationData);
    };
    // Функция 5 рекалькуляция
    // Функция 4 из 3 вынимаем
    var fixFieldsLayoutWithMissingSockets = function () {
      var socketsHasBeenAddedToTabs = entityEditorHelper.fixCustomTabs(
        vm.tabs,
        dataConstructorLayout
      );

      if (vm.fixedArea && vm.fixedArea.isActive) {
        var socketsHasBeenAddedToFixedArea = entityEditorHelper.fixCustomTabs(
          vm.fixedArea,
          dataConstructorLayout
        );
      }

      if (socketsHasBeenAddedToTabs || socketsHasBeenAddedToFixedArea) {
        dcLayoutHasBeenFixed = true;
      }
    };
    var mapAttributesToLayoutFields = function () {
      var attributes = {
        entityAttrs: vm.entityAttrs,
        dynamicAttrs: vm.attrs,
        layoutAttrs: vm.layoutAttrs,
        userInputs: vm.userInputs,
      };

      var attributesLayoutData = entityEditorHelper.generateAttributesFromLayoutFields(
        vm.tabs,
        attributes,
        dataConstructorLayout,
        true
      );

      vm.attributesLayout = attributesLayoutData.attributesLayout;

      if (vm.fixedArea && vm.fixedArea.isActive) {
        var fixedAreaAttributesLayoutData = entityEditorHelper.generateAttributesFromLayoutFields(
          vm.fixedArea,
          attributes,
          dataConstructorLayout,
          true
        );

        vm.fixedAreaAttributesLayout =
          fixedAreaAttributesLayoutData.attributesLayout;
      }

      if (
        attributesLayoutData.dcLayoutHasBeenFixed ||
        (fixedAreaAttributesLayoutData &&
          fixedAreaAttributesLayoutData.dcLayoutHasBeenFixed)
      ) {
        dcLayoutHasBeenFixed = true;
      }
    };
    // Функция 4

    // Функция 3
    var mapAttributesAndFixFieldsLayout = function () {
      dcLayoutHasBeenFixed = false;

      fixFieldsLayoutWithMissingSockets();
      mapAttributesToLayoutFields();
    };
    // Функция 3
    // Функция 2
    var postBookComplexTransactionActions = function (
      transactionData,
      recalculationInfo
    ) {
      // ng-repeat with bindFieldControlDirective may not update without this
      vm.tabs = {};
      vm.fixedArea = {};
      // < ng-repeat with bindFieldControlDirective may not update without this >
      // Открываем форму
      if (Array.isArray(transactionData.book_transaction_layout.data)) {
        vm.tabs = transactionData.book_transaction_layout.data;
      } else {
        vm.tabs = transactionData.book_transaction_layout.data.tabs;
        vm.fixedArea = transactionData.book_transaction_layout.data.fixedArea;
      }

      dataConstructorLayout = JSON.parse(
        JSON.stringify(transactionData.book_transaction_layout)
      ); // unchanged layout that is used to remove fields without attributes

      vm.userInputs = [];
      vm.tabs.forEach(function (tab) {
        tab.layout.fields.forEach(function (field) {
          if (field.attribute_class === "userInput") {
            vm.userInputs.push(field.attribute);
          }
        });
      });

      if (vm.fixedArea && vm.fixedArea.isActive) {
        vm.fixedArea.layout.fields.forEach(function (field) {
          if (field.attribute_class === "userInput") {
            vm.userInputs.push(field.attribute);
          }
        });
      }

      if (vm.tabs.length && !vm.tabs[0].hasOwnProperty("tabOrder")) {
        vm.tabs.forEach(function (tab, index) {
          tab.tabOrder = index;
        });
      }

      vm.userInputs.forEach(function (userInput) {
        if (!userInput.frontOptions) {
          userInput.frontOptions = {};
        }
        // actions
        if (
          transactionHelper.isUserInputUsedInTTypeExpr(
            userInput,
            vm.transactionType.actions
          )
        ) {
          userInput.frontOptions.usedInExpr = true;
        }

        if (
          notCopiedTransaction &&
          (vm.entity[userInput.name] || vm.entity[userInput.name] === 0)
        ) {
          userInput.frontOptions.autocalculated = true;
        }
      });

      inputsWithCalculations = transactionData.transaction_type_object.inputs;

      if (inputsWithCalculations) {
        inputsWithCalculations.forEach(function (inputWithCalc) {
          vm.userInputs.forEach(function (userInput) {
            if (userInput.name === inputWithCalc.name) {
              if (!userInput.buttons) {
                userInput.buttons = [];
              }

              if (inputWithCalc.can_recalculate === true) {
                userInput.buttons.push({
                  iconObj: { type: "fontawesome", icon: "fas fa-redo" },
                  tooltip: "Recalculate this field",
                  caption: "",
                  classes: "",
                  action: {
                    key: "input-recalculation",
                    callback: vm.recalculate,
                    parameters: {
                      inputs: [inputWithCalc.name],
                      recalculationData: "input",
                    },
                  },
                });
                console.log(userInput, "userInput super");
                console.log(vm.recalculate, "userInput super");
              }

              if (
                inputWithCalc.settings &&
                inputWithCalc.settings.linked_inputs_names
              ) {
                var linkedInputsList = inputWithCalc.settings.linked_inputs_names.split(
                  ","
                );

                userInput.buttons.push({
                  iconObj: { type: "fontawesome", icon: "fas fa-sync-alt" },
                  tooltip: "Recalculate linked fields",
                  caption: "",
                  classes: "",
                  action: {
                    key: "linked-inputs-recalculation",
                    callback: vm.recalculate,
                    parameters: {
                      inputs: linkedInputsList,
                      recalculationData: "linked_inputs",
                    },
                  },
                });
              }
              //   console.log(JSON.parse(JSON.stringify()), "После");

              if (
                recalculationInfo &&
                recalculationInfo.recalculatedInputs.indexOf(userInput.name) >
                  -1
              ) {
                // mark userInputs that were recalculated
                userInput.frontOptions.recalculated =
                  recalculationInfo.recalculationData;
              }
            }
          });
        });
      }
      var userInputsTest = vm.userInputs;
      console.log(
        "bind-field-control-buttons!!!!!, vm.userInputs min1:",
        vm.recalculate,
        Object.freeze(userInputsTest)
      );

      mapAttributesAndFixFieldsLayout();
      console.log("bind-field-control tabs", vm.tabs);
    };
    // Функция 2
    // Функция 1
    vm.onFieldChange = function (fieldKey) {
      if (fieldKey) {
        if (inputsWithCalculations) {
          var i, a;
          for (i = 0; i < vm.userInputs.length; i++) {
            if (vm.userInputs[i].key === fieldKey) {
              var uInputName = vm.userInputs[i].name;

              for (a = 0; a < inputsWithCalculations.length; a++) {
                var inputWithCalc = inputsWithCalculations[a];

                if (
                  inputWithCalc.name === uInputName &&
                  inputWithCalc.settings &&
                  inputWithCalc.settings.linked_inputs_names
                ) {
                  var changedUserInputData = JSON.parse(
                    JSON.stringify(vm.userInputs[i])
                  );

                  changedUserInputData.frontOptions.linked_inputs_names = JSON.parse(
                    JSON.stringify(
                      inputWithCalc.settings.linked_inputs_names.split(",")
                    )
                  );

                  vm.evEditorDataService.setChangedUserInputData(
                    changedUserInputData
                  );
                  vm.evEditorEventService.dispatchEvent(
                    evEditorEvents.FIELD_CHANGED
                  );

                  break;
                }
              }

              break;
            }
          }
        }

        var attributes = {
          entityAttrs: vm.entityAttrs,
          attrsTypes: vm.attrs,
          userInputs: vm.userInputs,
        };

        entityEditorHelper.checkTabsForErrorFields(
          fieldKey,
          errorFieldsList,
          tabsWithErrors,
          attributes,
          vm.entity,
          vm.entityType,
          vm.tabs
        );
      }
    };
    // Функция 1
    //
    init();
  };
})();
