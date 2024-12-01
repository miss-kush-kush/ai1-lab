/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*******************!*\
  !*** ./script.ts ***!
  \*******************/


function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var styles = {
  "Style 1": "css/style1.css",
  "Style 2": "css/style2.css",
  "Style 3": "css/style3.css"
};
var currentStyle = "Style 1";
function changeStyle(styleName) {
  var head = document.head;
  var existingLink = document.querySelector('link[rel="stylesheet"]');
  if (existingLink) {
    head.removeChild(existingLink);
  }
  var link = document.createElement('link');
  link.rel = "stylesheet";
  link.href = styles[styleName];
  head.appendChild(link);
  localStorage.setItem('selectedStyle', styleName);
  currentStyle = styleName;
}
function createStyleLinks() {
  var footer = document.querySelector("footer");
  if (!footer) return;
  var existingLinks = footer.querySelectorAll("a[data-style]");
  Object.keys(styles).forEach(function (styleName) {
    if (!_toConsumableArray(existingLinks).some(function (link) {
      return link.getAttribute("data-style") === styleName;
    })) {
      var newParagraph = document.createElement("p");
      var newLink = document.createElement("a");
      newLink.href = "#";
      newLink.textContent = "Switch to ".concat(styleName);
      newLink.setAttribute("data-style", styleName);
      newLink.addEventListener("click", function (event) {
        event.preventDefault();
        changeStyle(styleName);
      });
      newParagraph.appendChild(newLink);
      footer.appendChild(newParagraph);
    }
  });
}
function restoreStyle() {
  var savedStyle = localStorage.getItem('selectedStyle');
  var styleToApply = savedStyle && styles[savedStyle] ? savedStyle : Object.keys(styles)[0];
  changeStyle(styleToApply);
}
document.addEventListener('DOMContentLoaded', function () {
  restoreStyle();
  createStyleLinks();
});
/******/ })()
;