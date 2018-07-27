const functions = require('firebase-functions');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

(function (modules) {
    modules.map(f => f(exports));
})([
    function (exports) {
        exports.helloWorld = functions["https"].onRequest((request, response) => {
            response.send("Hello from Firebase!");
        });
    }
])

// exports.helloWorld = functions.https.onRequest((request, response) => {
//     response.send("Hello from Firebase!");
// });