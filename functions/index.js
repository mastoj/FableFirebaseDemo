"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.helloWorld = undefined;

var _firebaseFunctions = require("firebase-functions");

function handler(req, res) {
  res.send("Hello"), void 0;
}

var helloWorld = exports.helloWorld = _firebaseFunctions.https.onRequest(handler);
//# sourceMappingURL=App.js.map