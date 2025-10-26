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
// @input Component.Text subtitleText
// @input Component.Image subtitleBackground
// @input float maxLines = 2 {"hint":"Maximum number of lines to display at once"}
// @input float fontSize = 24 {"hint":"Font size for subtitle text"}
// @input bool enableWordHighlight {"hint":"Show subtitles with word highlighting"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../Modules/Src/Assets/Scripts/SubtitleDisplay");
Object.setPrototypeOf(script, Module.SubtitleDisplay.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("subtitleText", []);
    checkUndefined("maxLines", []);
    checkUndefined("fontSize", []);
    checkUndefined("enableWordHighlight", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
