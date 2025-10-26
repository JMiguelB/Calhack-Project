if (script.onAwake) {
    script.onAwake();
    return;
}
function checkUndefined(property, showIfData) {
    for (var i = 0; i < showIfData.length; i++) {
        if (showIfData[i][0] && script[showIfData[i][0]] != showIfData[i][1]) {
            return;
        }
    }
    if (script[property] == undefined) {
        throw new Error("Input " + property + " was not provided for the object " + script.getSceneObject().name);
    }
}
// @input Component.Text feedbackText
// @input Component.Text scoreText
// @input Component.Text strengthsText
// @input Component.Text improvementsText
// @input Component.Text adviceText
// @input Component.Image feedbackBackground
// @input float displayDuration = 15 {"hint":"Display duration in seconds (0 = permanent)"}
// @input bool enableAutoScroll {"hint":"Auto-scroll through different sections"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../Modules/Src/Assets/Scripts/CommunicationFeedbackDisplay");
Object.setPrototypeOf(script, Module.CommunicationFeedbackDisplay.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("displayDuration", []);
    checkUndefined("enableAutoScroll", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
