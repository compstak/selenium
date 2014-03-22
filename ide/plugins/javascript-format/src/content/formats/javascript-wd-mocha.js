/*
 * Formatter for Selenium 2 / WebDriver Mocha client.
 */

if (!this.formatterType) {  // this.formatterType is defined for the new Formatter system
  // This method (the if block) of loading the formatter type is deprecated.
  // For new formatters, simply specify the type in the addPluginProvidedFormatter() and omit this
  // if block in your formatter.
  var subScriptLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
  subScriptLoader.loadSubScript('chrome://selenium-ide/content/formats/webdriver.js', this);
}

function testClassName(testName) {
  return testName.split(/[^0-9A-Za-z]+/).map(
      function(x) {
        return capitalize(x);
      }).join('');
}

function testMethodName(testName) {
  return "test_" + underscore(testName);
}

function nonBreakingSpace() {
  return "\"\\xa0\"";
}

function array(value) {
  var str = '[';
  for (var i = 0; i < value.length; i++) {
    str += string(value[i]);
    if (i < value.length - 1) str += ", ";
  }
  str += ']';
  return str;
}

notOperator = function() {
  return "!";
};

Equals.prototype.toString = function() {
  return this.e2.toString() + " === " + this.e1.toString();
};

// Unlike the other language bindings, which all provide blocking APIs, WebDriverJS is purely asynchronous.
Equals.prototype.assert = function() {
  return this.e2.toString() + ".then(function (value) { value.should.equal(" + this.e1.toString() + "); })";
};

Equals.prototype.verify = function() {
  return verify(this.assert());
};

NotEquals.prototype.toString = function() {
  return this.e1.toString() + " !== " + this.e2.toString();
};

// Unlike the other language bindings, which all provide blocking APIs, WebDriverJS is purely asynchronous.
NotEquals.prototype.assert = function() {
  return this.e2.toString() + ".then(function (value) { value.should.not.equal(" + this.e1.toString() + "); })";
};

NotEquals.prototype.verify = function() {
  return verify(this.assert());
};

function joinExpression(expression) {
  return expression.toString() + ".join(\",\")";
}

function statement(expression) {
  expression.noBraces = true;
  return expression.toString() + ';';
}

function assignToVariable(type, variable, expression) {
  return variable + " = " + expression.toString();
}

function ifCondition(expression, callback) {
  return "if (" + expression.toString() + ") {\n" + callback() + "}";
}

function tryCatch(tryStatement, catchStatement, exception) {
  return "try {\n" +
      indents(1) + tryStatement + "\n" +
      "catch (" + exception + ") {\n" +
      indents(1) + catchStatement + "\n" +
      "}";
}

function assertTrue(expression) {
  var exp = expression.toString();
  var r = exp.match(/^(.+)\.([0-9A-Za-z_]+)\?$/);
  if (r && r.length == 3) {
    return r[1] + ".should.be(" + r[2] + ")";
  } else {
    return exp + ".should.be(true)";
  }
}

function assertFalse(expression) {
  var exp = expression.toString();
  var r = exp.match(/^(.+)\.([0-9A-Za-z_]+)\?$/);
  if (r && r.length == 3) {
    return r[1] + ".should.not.be(" + r[2] + ")";
  } else {
    return exp + ".should.be(false)";
  }
}

function verify(statement) {
  return "verify(function() { " + statement + " })";
}

function verifyTrue(expression) {
  return verify(assertTrue(expression));
}

function verifyFalse(expression) {
  return verify(assertFalse(expression));
}

RegexpMatch.patternAsRegEx = function(pattern) {
  var str = pattern.replace(/\//g, "\\/");
  if (str.match(/\n/)) {
    str = str.replace(/\n/g, '\\n');
    return '/' + str + '/m';
  } else {
    return str = '/' + str + '/g';
  }
};

RegexpMatch.prototype.patternAsRegEx = function() {
  return RegexpMatch.patternAsRegEx(this.pattern);
};

RegexpMatch.prototype.toString = function() {
  return this.expression + ".match(" + this.patternAsRegEx() + ")";
};

RegexpMatch.prototype.assert = function() {
  return this.expression + ".should.match(" + this.patternAsRegEx() + ")";
};

RegexpMatch.prototype.verify = function() {
  return verify(this.assert());
};

RegexpNotMatch.prototype.patternAsRegEx = function() {
  return RegexpMatch.patternAsRegEx(this.pattern);
};

RegexpNotMatch.prototype.toString = function() {
  return notOperator + this.expression + ".match(" + this.patternAsRegEx() + ")";
};

RegexpNotMatch.prototype.assert = function() {
  return this.expression + ".should.not.match(" + this.patternAsRegEx() + ")";
};

RegexpNotMatch.prototype.verify = function() {
  return verify(this.assert());
};

function waitFor(expression) {
  if (expression.negative) {
    return "driver.wait(function () { return " + expression.invert().toString() + "; }, 60);";
  } else {
    return "driver.wait(function () { return " + expression.toString() + "; }, 60);";
  }
}

function assertOrVerifyFailure(line, isAssert) {
  return "assert_raise(Kernel) { " + line + "}";
}

function pause(milliseconds) {
  return "driver.sleep(" + parseInt(milliseconds, 10) + ")";
}

function echo(message) {
  return "console.log(" + xlateArgument(message) + ")";
}

function formatComment(comment) {
  return comment.comment.replace(/.+/mg, function(str) {
    return "// " + str;
  });
}

function keyVariable(key) {
  return ":" + key;
}

this.sendKeysMaping = {
  BKSP: "backspace",
  BACKSPACE: "backspace",
  TAB: "tab",
  ENTER: "enter",
  SHIFT: "shift",
  CONTROL: "control",
  CTRL: "control",
  ALT: "alt",
  PAUSE: "pause",
  ESCAPE: "escape",
  ESC: "escape",
  SPACE: "space",
  PAGE_UP: "page_up",
  PGUP: "page_up",
  PAGE_DOWN: "page_down",
  PGDN: "page_down",
  END: "end",
  HOME: "home",
  LEFT: "left",
  UP: "up",
  RIGHT: "right",
  DOWN: "down",
  INSERT: "insert",
  INS: "insert",
  DELETE: "delete",
  DEL: "delete",
  SEMICOLON: "semicolon",
  EQUALS: "equals",

  NUMPAD0: "numpad0",
  N0: "numpad0",
  NUMPAD1: "numpad1",
  N1: "numpad1",
  NUMPAD2: "numpad2",
  N2: "numpad2",
  NUMPAD3: "numpad3",
  N3: "numpad3",
  NUMPAD4: "numpad4",
  N4: "numpad4",
  NUMPAD5: "numpad5",
  N5: "numpad5",
  NUMPAD6: "numpad6",
  N6: "numpad6",
  NUMPAD7: "numpad7",
  N7: "numpad7",
  NUMPAD8: "numpad8",
  N8: "numpad8",
  NUMPAD9: "numpad9",
  N9: "numpad9",
  MULTIPLY: "multiply",
  MUL: "multiply",
  ADD: "add",
  PLUS: "add",
  SEPARATOR: "separator",
  SEP: "separator",
  SUBTRACT: "subtract",
  MINUS: "subtract",
  DECIMAL: "decimal",
  PERIOD: "decimal",
  DIVIDE: "divide",
  DIV: "divide",

  F1: "f1",
  F2: "f2",
  F3: "f3",
  F4: "f4",
  F5: "f5",
  F6: "f6",
  F7: "f7",
  F8: "f8",
  F9: "f9",
  F10: "f10",
  F11: "f11",
  F12: "f12",

  META: "meta",
  COMMAND: "command"
};

/**
 * Returns a string representing the suite for this formatter language.
 *
 * @param testSuite  the suite to format
 * @param filename   the file the formatted suite will be saved as
 */
function formatSuite(testSuite, filename) {
  formattedSuite = "var webdriver = require('selenium-webdriver');\n" +
      "var driver = require('./client.js').driver;\n" +
      '\n' +
      '\n';

  for (var i = 0; i < testSuite.tests.length; ++i) {
    // have saved or loaded a suite
    if (typeof testSuite.tests[i].filename != 'undefined') {
      formattedSuite += 'require File.join(File.dirname(__FILE__),  "' + testSuite.tests[i].filename.replace(/\.\w+$/, '') + '")\n';
    } else {
      // didn't load / save as a suite
      var testFile = testSuite.tests[i].getTitle();
      formattedSuite += 'require "' + testFile + '"\n';
    }
  }
  return formattedSuite;
}

function defaultExtension() {
  return this.options.defaultExtension;
}

this.options = {
  receiver: "driver",
  showSelenese: 'false',
  header: "var wd = require('selenium-webdriver');\n" +
          "var should = require('chai').should();\n" + // actually call the function
          "var AssertionError = require('chai').AssertionError;\n" +
          '\n' +
          "describe('${className}', function () {\n" +
          '\n' +
          '    var driver;\n' +
          '    var baseUrl;\n' +
          '    var verificationErrors;\n' +
          '\n' +
          '    beforeEach(function (done) {\n' +
          "        driver = require('./client.js').driver;\n" +
          '        driver.manage().timeouts().implicitlyWait(30000);\n' +
          "        baseUrl = '${baseURL}';\n" +
          '        verificationErrors = [];\n' +
          '        done();\n' +
          '    });\n' +
          '\n' +
          "    it('${methodName}', function (done) {\n",
  footer: '        done();\n' +
          '    });\n' +
          '\n' +
          '    afterEach(function (done) {\n' +
          '        driver.quit().then(function () {\n' +
          '            verificationErrors.should.be.empty;\n' +
          '            done();\n' +
          '        });\n' +
          '    });\n' +
          '\n' +
          '    var verify = function (promise) {\n' +
          '        try {\n' +
          '            promise();\n' +
          '        } catch (exception) {\n' +
          '            if (exception instanceof AssertionError) {\n' +
          '                verificationErrors.push(exception);\n' +
          '            } else {\n' +
          '                throw exception;\n' +
          '            }\n' +
          '        }\n' +
          '    };\n' +
          '\n' +
          '});\n',
          // TODO do we need alert handling?
  indent: "4",
  initialIndents: "2",
  defaultExtension: "js"
};

this.configForm =
    '<description>Variable for Selenium instance</description>' +
        '<textbox id="options_receiver" />' +
        '<description>Header</description>' +
        '<textbox id="options_header" multiline="true" flex="1" rows="4"/>' +
        '<description>Footer</description>' +
        '<textbox id="options_footer" multiline="true" flex="1" rows="4"/>' +
        '<description>Indent</description>' +
        '<menulist id="options_indent"><menupopup>' +
        '<menuitem label="Tab" value="tab"/>' +
        '<menuitem label="1 space" value="1"/>' +
        '<menuitem label="2 spaces" value="2"/>' +
        '<menuitem label="3 spaces" value="3"/>' +
        '<menuitem label="4 spaces" value="4"/>' +
        '<menuitem label="5 spaces" value="5"/>' +
        '<menuitem label="6 spaces" value="6"/>' +
        '<menuitem label="7 spaces" value="7"/>' +
        '<menuitem label="8 spaces" value="8"/>' +
        '</menupopup></menulist>' +
        '<checkbox id="options_showSelenese" label="Show Selenese"/>';

this.name = "Mocha (WebDriver)";
this.testcaseExtension = ".js";
this.suiteExtension = ".js";
this.webdriver = true;

WDAPI.Driver = function() {
  this.ref = options.receiver;
};

WDAPI.Driver.searchContext = function(locatorType, locator) {
  var locatorString = xlateArgument(locator);
  switch (locatorType) {
    case 'xpath':
      return 'wd.By.xpath(' + locatorString + ')';
    case 'css':
      return 'wd.By.css(' + locatorString + ')';
    case 'id':
      return 'wd.By.id(' + locatorString + ')';
    case 'link':
      return 'wd.By.partialLinkText(' + locatorString + ')';
    case 'name':
      return 'wd.By.name(' + locatorString + ')';
    case 'tag_name':
      return 'wd.By.tagName(' + locatorString + ')';
  }
  throw 'Error: unknown strategy [' + locatorType + '] for locator [' + locator + ']';
};

WDAPI.Driver.prototype.back = function() {
  return this.ref + ".navigate().back()";
};

WDAPI.Driver.prototype.close = function() {
  return this.ref + ".close()";
};

WDAPI.Driver.prototype.findElement = function(locatorType, locator) {
  return new WDAPI.Element(this.ref + ".findElement(" + WDAPI.Driver.searchContext(locatorType, locator) + ")");
};

WDAPI.Driver.prototype.findElements = function(locatorType, locator) {
  return new WDAPI.ElementList(this.ref + ".findElements(" + WDAPI.Driver.searchContext(locatorType, locator) + ")");
};

WDAPI.Driver.prototype.getCurrentUrl = function() {
  return this.ref + ".getCurrentUrl()";
};

WDAPI.Driver.prototype.get = function(url) {
  if (url.length > 1 && (url.substring(1,8) == "http://" || url.substring(1,9) == "https://")) { // url is quoted
    return this.ref + ".get(" + url + ")";
  } else {
    return this.ref + ".get(baseUrl + " + url + ")"
  }
};

WDAPI.Driver.prototype.getTitle = function() {
  return this.ref + ".getTitle()";
};

WDAPI.Driver.prototype.getAlert = function() {
  return "close_alert_and_get_its_text()";
};

WDAPI.Driver.prototype.chooseOkOnNextConfirmation = function() {
  return "@accept_next_alert = true";
};

WDAPI.Driver.prototype.chooseCancelOnNextConfirmation = function() {
  return "@accept_next_alert = false";
};

WDAPI.Driver.prototype.refresh = function() {
  return this.ref + ".navigate().refresh()";
};

WDAPI.Element = function(ref) {
  this.ref = ref;
};

WDAPI.Element.prototype.clear = function() {
  return this.ref + ".clear()";
};

WDAPI.Element.prototype.click = function() {
  return this.ref + ".click()";
};

WDAPI.Element.prototype.getAttribute = function(attributeName) {
  return this.ref + ".getAttribute(" + xlateArgument(attributeName) + ")";
};

WDAPI.Element.prototype.getText = function() {
  return this.ref + ".getText()";
};

WDAPI.Element.prototype.isDisplayed = function() {
  return this.ref + ".isDisplayed()";
};

WDAPI.Element.prototype.isSelected = function() {
  return this.ref + ".isSelected()";
};

WDAPI.Element.prototype.sendKeys = function(text) {
  return this.ref + ".sendKeys(" + xlateArgument(text, 'args') + ")";
};

WDAPI.Element.prototype.submit = function() {
  return this.ref + ".submit()";
};

WDAPI.Element.prototype.select = function(selectLocator) {
  if (selectLocator.type == 'index') {
    return "Selenium::WebDriver::Support::Select.new(" + this.ref + ").select_by(:index, " + selectLocator.string + ")";
  }
  if (selectLocator.type == 'value') {
    return "Selenium::WebDriver::Support::Select.new(" + this.ref + ").select_by(:value, " + xlateArgument(selectLocator.string) + ")";
  }
  return "Selenium::WebDriver::Support::Select.new(" + this.ref + ").select_by(:text, " + xlateArgument(selectLocator.string) + ")";
};

WDAPI.ElementList = function(ref) {
  this.ref = ref;
};

WDAPI.ElementList.prototype.getItem = function(index) {
  return this.ref + "[" + index + "]";
};

WDAPI.ElementList.prototype.getSize = function() {
  return this.ref + ".size";
};

WDAPI.ElementList.prototype.isEmpty = function() {
  return this.ref + ".empty?";
};


WDAPI.Utils = function() {
};

WDAPI.Utils.isElementPresent = function(how, what) {
  return "driver.findElement(wd.By." + how + "(" + xlateArgument(what) + "))";
};

WDAPI.Utils.isAlertPresent = function() {
  return "alert_present?";
};
