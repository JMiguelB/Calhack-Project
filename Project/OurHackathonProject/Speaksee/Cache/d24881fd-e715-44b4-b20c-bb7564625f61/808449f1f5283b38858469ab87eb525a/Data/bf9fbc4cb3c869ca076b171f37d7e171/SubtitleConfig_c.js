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
// @input AssignableType microphoneRecorder
// @input string apiKey {"hint":"Your OpenAI API key for subtitle generation"}
// @input string language = "en" {"hint":"Language for subtitle generation (e.g., 'en', 'es', 'fr')"}
// @input bool enableSubtitles = true {"hint":"Enable subtitle generation"}
// @input Component.Text statusText
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../Modules/Src/Assets/Scripts/SubtitleConfig");
Object.setPrototypeOf(script, Module.SubtitleConfig.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("apiKey", []);
    checkUndefined("language", []);
    checkUndefined("enableSubtitles", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
