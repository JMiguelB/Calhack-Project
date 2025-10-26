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
// @input string openAIApiKey {"hint":"OpenAI API Key for Whisper"}
// @input string language = "en" {"hint":"Language for subtitle generation (e.g., 'en', 'es', 'fr')"}
// @input string aiModel = "whisper-1" {"hint":"AI Model to use for transcription"}
// @input string responseFormat = "verbose_json" {"hint":"Response format from AI service"}
// @input bool enableSubtitlesByDefault = true {"hint":"Enable subtitle generation by default"}
// @input AssignableType microphoneRecorder
// @input Component.Text debugText
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
    checkUndefined("openAIApiKey", []);
    checkUndefined("language", []);
    checkUndefined("aiModel", []);
    checkUndefined("responseFormat", []);
    checkUndefined("enableSubtitlesByDefault", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
