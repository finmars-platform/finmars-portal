/**
 * Created by mevstratov on 05.08.2019.
 */
(function () {

    'use strict';

    module.exports = function () {
        return {
            restrict: 'E',
            scope: {
                result: '='
            },
            templateUrl: 'views/directives/calculator-button-view.html',
            link: function (scope, elem, attr) {

                scope.calcResult = 0;
                var calcResultNumber = "";
                var prevNumber;
                var currentNumber;
                var operatorType;

                scope.showCalculatorBlock = false;

                // Variables
                /*var viewer = elem[0].querySelectorAll("#viewer"), // Calculator screen where result is displayed
                    equals = el("#equals"), // Equal button
                    nums = el(".num"), // List of numbers
                    ops = el(".ops"), // List of operators
                    currentNumber = "", // Current number
                    prevNumber = "", // First number
                    calcResultNumber, // Result
                    operator; // Batman*/

                // When: Number is clicked. Get the current number selected
                scope.setNumber = function(number) {
                    if (calcResultNumber) { // If a result was displayed, reset number
                        currentNumber = number;
                        calcResultNumber = null;
                    } else { // Otherwise, add digit to previous number (this is a string!)
                        currentNumber += number;
                    }

                    scope.calcResult = currentNumber; // Display current number

                };

                // When operator is clicked. Pass currentNumber to prevNumber and save operator
                scope.applyOperator = function(operator) {
                    prevNumber = currentNumber;
                    currentNumber = null;
                    operatorType = operator;

                    calcResultNumber = ""; // Reset result in attr
                };

                // When: Equals is clicked. Calculate result
                scope.calculateResult = function() {

                    // Convert string input to numbers
                    prevNumber = parseFloat(prevNumber);
                    currentNumber = parseFloat(currentNumber);

                    // Perform operation
                    switch (operatorType) {
                        case "+":
                            calcResultNumber = prevNumber + currentNumber;
                            break;

                        case "-":
                            calcResultNumber = prevNumber - currentNumber;
                            break;

                        case "*":
                            calcResultNumber = prevNumber * currentNumber;
                            break;

                        case "/":
                            calcResultNumber = prevNumber / currentNumber;
                            break;

                        // If equal is pressed without an operator, keep number and continue
                        default:
                            calcResultNumber = currentNumber;
                    }

                    // If NaN or Infinity returned
                    if (!isFinite(calcResultNumber)) {

                        if (isNaN(calcResultNumber)) { // If result is not a number; set off by, eg, double-clicking operators
                            calcResultNumber = "Can't divide by zero";
                        } else { // If result is infinity, set off by dividing by zero
                            scope.calcResult = "Can't divide by zero";
                            elem[0].querySelector('calculator-interface').classList.add("calculator-broken"); // Break calculator
                            // elem[0].querySelector('#reset').classList.add("show"); // And show reset button
                        }

                    }

                    // Display result, finally!
                    scope.calcResult = calcResultNumber;

                    // Now reset prevNumber & keep result
                    prevNumber = 0;
                    currentNumber = calcResultNumber;

                };

                // When: Clear button is pressed. Clear everything
                scope.clearAll = function() {
                    prevNumber = "";
                    currentNumber = "";
                    scope.calcResult = "0";
                    // equals.setAttribute("data-result", calcResultNumber);
                };

                /* The click events */

                // Add click event to reset button
                /*el("#reset").onclick = function() {
                    window.location = window.location;
                };*/

            }
        }
    }
}());