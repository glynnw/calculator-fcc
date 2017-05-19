/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);

class Calculator {
  constructor(calcElem) {
    this.calcElem = calcElem;
    this.smallScreen = this.calcElem.querySelector('.calculator__screen--small');
    this.largeScreen = this.calcElem.querySelector('.calculator__screen--large');
    this.state = new ClearState(this, null);
    this.history = [];
    this.number = "";

    const calculatorButtons = this.calcElem.querySelectorAll('.calculator__button');
    calculatorButtons.forEach(button => {
      button.addEventListener("click", this);
    });
  }

  del() {
    this.number = this.number.slice(0, this.number.length - 1);
  }

  pressKey(strNum) {
    this.number += strNum;
  }

  setScreen(value) {
    this.largeScreen.value = value;
  }

  updateScreen() {
    this.largeScreen.innerHTML = this.number;
    this.smallScreen.innerHTML = this.history.join(' ');
  }

  clear() {
    this.number = "";
    this.history = [];
  }

  nextState(state) {
    this.state = state;
  }

  handleEvent(event) {
    const key = event.target.value;
    this.state.operation(key);
    this.updateScreen();
  }
}

class BaseState {
  BaseState(calculator, entryKey) {
    this.calculator = calculator;
    this.entryKey = entryKey;
  }

  operation(key) {
    if (key === 'clear') {
      this.calculator.nextState(new ClearState(this.calculator, key));
    } else if (key === '=') {
      this.calculator.nextState(new ResultState(this.calculator, key));
    }
  }

  isOperator(key) {
    const operators = ["/", "+", "-", "*", "%"];
    return operators.some(elem => elem === key);
  }

  isInput(key) {
    const keyNumber = parseInt(key, 10);
    return keyNumber || keyNumber === 0 || key === "." || key === "del" || key === "sign";
  }
}

class ClearState extends BaseState {
  constructor(calculator, entryKey) {
    super(calculator);
    console.log("ClearState");
    this.calculator = calculator;
    this.calculator.clear();
  }

  operation(key) {
    super.operation(key);
    if (this.isInput(key)) {
      this.calculator.nextState(new InputState(this.calculator, key));
    }
  }
}

class InputState extends BaseState {
  operation(key) {
    super.operation(key);
    if (this.isOperator(key)) {
      this.calculator.nextState(new OperatorState(this.calculator, key));
    } else if (key === 'del') {
      this.calculator.del();
    } else if (key === 'sign') {
      if (this.calculator.number) {
        this.calculator.number = -parseFloat(this.calculator.number, 10);
      } else {
        this.calculator.number = '-';
      }
    } else if (this.isInput(key)) {
      console.log(key);
      this.calculator.pressKey(key);
    }
  }

  constructor(calculator, entryKey) {
    super(calculator);
    this.calculator = calculator;
    if (super.isInput(entryKey)) {
      this.operation(entryKey);
    }
    this.calculator.updateScreen();
    console.log("InputState");
  }
}

class ResultState extends BaseState {
  constructor(calculator, entryKey) {
    super(calculator);
    console.log("ResultState");
    this.calculator = calculator;
    this.calculator.history.push(this.calculator.number);
    this.result = eval(this.calculator.history.join(' '));
    console.log(this.result);
    this.calculator.history.push("=", this.result);
    this.calculator.number = this.result.toString();
  }

  operation(key) {
    super.operation(key);
    if (this.isInput(key)) {
      this.calculator.clear();
      this.calculator.nextState(new InputState(this.calculator, key));
    } else if (this.isOperator(key)) {
      this.calculator.history = [];
      this.calculator.number = this.result;
      this.calculator.nextState(new OperatorState(this.calculator, key));
    }
  }
}

class OperatorState extends BaseState {
  constructor(calculator, entryKey) {
    super(calculator);
    this.calculator = calculator;
    console.log("OperatorState");
    this.key = entryKey;
    this.calculator.history.push(this.calculator.number);
    this.calculator.number = "";
    this.calculator.setScreen(this.key);
    this.calculator.history.push(this.key);
  }

  operation(key) {
    super.operation(key);
    if (this.isInput(key)) {
      this.number = "";
      this.calculator.nextState(new InputState(this.calculator, key));
    } else if (this.isOperator(key)) {
      this.calculator.setScreen(key);
      this.calculator.history.pop();
      this.calculator.history.push(key);
    }
  }
}

const calculator = new Calculator(document.querySelector('.calculator'));

/***/ })
/******/ ]);