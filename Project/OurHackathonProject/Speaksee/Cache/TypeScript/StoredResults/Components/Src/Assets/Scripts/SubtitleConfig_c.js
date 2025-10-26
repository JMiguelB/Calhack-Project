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
// @input string apiKey = "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" {"hint":"Your OpenAI API key for subtitle generation"}
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
