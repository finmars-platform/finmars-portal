// /**
//  * Created by sergey on 04.11.16.
//  */
// (function () {

//   'use strict';

//   var logService = require('../../../../../../core/services/logService');

//   var uiService = require('../../../services/uiService');

//   module.exports = function ($scope, $mdDialog, options) {

//     logService.controller('UiLayoutSaveAsDialogController', 'initialized');

//     var vm = this;

//     vm.complexSaveAsLayoutDialog = false;

//     var layoutsUserCodes = ["New Layout"];

//     if (options) {

//       if (options.complexSaveAsLayoutDialog) {

//         vm.complexSaveAsLayoutDialog = true;
//         vm.entityType = options.complexSaveAsLayoutDialog.entityType;

//         uiService.getListLayout(vm.entityType).then(function (data) {

//           var layouts = data.results;

//           layouts.map(function (layout) {
//             layoutsUserCodes.push(layout.user_code);
//           });

//         });

//       }

//       if (options.layoutName) {

//         vm.layoutName = options.layoutName;

//       }

//       if (options.layoutUserCode) {
//         vm.layoutUserCode = options.layoutUserCode;
//       }

//     }

//     vm.cancel = function () {
//       $mdDialog.hide({ status: 'disagree' });
//     };

//     vm.agree = function ($event) {

//       var layoutNameOccupied = false;

//       if (vm.complexSaveAsLayoutDialog) {

//         var i;
//         for (i = 0; i < layoutsUserCodes.length; i++) {

//           if (layoutsUserCodes[i] === vm.layoutUserCode) {
//             layoutNameOccupied = true;

//             $mdDialog.show({
//               controller: 'WarningDialogController as vm',
//               templateUrl: 'views/warning-dialog-view.html',
//               parent: angular.element(document.body),
//               targetEvent: $event,
//               clickOutsideToClose: false,
//               multiple: true,
//               locals: {
//                 warning: {
//                   title: 'Warning',
//                   description: 'There is already layout with such user code. Layouts should have unique user codes.'
//                 }
//               }
//             });

//             break;
//           }
//         }
//       }

//       if (!layoutNameOccupied) {
//         $mdDialog.hide({ status: 'agree', data: { name: vm.layoutName, user_code: vm.layoutUserCode } });
//       }

//         vm.validateUserCode = function () {

//             var expression = /^\w+$/;

//             if (expression.test(vm.layoutUserCode)) {
//                 vm.userCodeError = false;
//             } else {
//                 vm.userCodeError = true;
//             }

//         };

//     }

// })();
