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
// @input Asset.AudioTrackAsset microphoneAsset
// @input Asset.AudioTrackAsset audioOutput
// @input Component.Text debugText
// @input AssignableType subtitleGenerator
// @input AssignableType_1 subtitleDisplay
// @input bool enableSubtitles = true {"hint":"Enable automatic subtitle generation"}
// @input AssignableType_2 communicationAnalyzer
// @input AssignableType_3 feedbackDisplay
// @input bool enableCommunicationAnalysis = true {"hint":"Enable communication skills analysis"}
// @input string analysisFocusAreas = "general" {"hint":"Analysis focus areas (comma-separated): presentation, interview, conversation"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../Modules/Src/Assets/Scripts/MicrophoneRecorder");
Object.setPrototypeOf(script, Module.MicrophoneRecorder.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("microphoneAsset", []);
    checkUndefined("audioOutput", []);
    checkUndefined("enableSubtitles", []);
    checkUndefined("enableCommunicationAnalysis", []);
    checkUndefined("analysisFocusAreas", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
