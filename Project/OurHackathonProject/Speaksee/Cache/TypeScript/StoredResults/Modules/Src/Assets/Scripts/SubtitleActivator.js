"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubtitleActivator = void 0;
var __selfType = requireType("./SubtitleActivator");
function component(target) { target.getTypeName = function () { return __selfType; }; }
/**
 * UI helper for subtitle-related interactions
 * Provides buttons for subtitle display, export, and configuration
 */
const Interactable_1 = require("SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable");
let SubtitleActivator = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SubtitleActivator = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.microphoneRecorder = this.microphoneRecorder;
            this.subtitleConfig = this.subtitleConfig;
            this.actionType = this.actionType;
            this.debugText = this.debugText;
        }
        __initialize() {
            super.__initialize();
            this.microphoneRecorder = this.microphoneRecorder;
            this.subtitleConfig = this.subtitleConfig;
            this.actionType = this.actionType;
            this.debugText = this.debugText;
        }
        onAwake() {
            this.interactable = this.sceneObject.getComponent(Interactable_1.Interactable.getTypeName());
            if (this.interactable) {
                this.interactable.onTriggerStart.add(() => {
                    this.performAction();
                });
            }
        }
        /**
         * Perform the configured action
         */
        performAction() {
            switch (this.actionType.toLowerCase()) {
                case "display":
                    this.displayAllSubtitles();
                    break;
                case "export":
                    this.exportSubtitles();
                    break;
                case "toggle":
                    this.toggleSubtitleGeneration();
                    break;
                case "configure":
                    this.showConfiguration();
                    break;
                default:
                    this.updateDebugText(`Unknown action: ${this.actionType}`);
            }
        }
        /**
         * Display all generated subtitles
         */
        displayAllSubtitles() {
            if (isNull(this.microphoneRecorder)) {
                this.updateDebugText("No MicrophoneRecorder assigned");
                return;
            }
            if (!this.microphoneRecorder.hasSubtitles()) {
                this.updateDebugText("No subtitles available");
                return;
            }
            // Get subtitle display component from the recorder
            const subtitleDisplay = this.microphoneRecorder.subtitleDisplay;
            if (!isNull(subtitleDisplay)) {
                subtitleDisplay.displayAllSubtitles();
                this.updateDebugText("Displaying all subtitles");
            }
            else {
                this.updateDebugText("No subtitle display component found");
            }
        }
        /**
         * Export subtitles to SRT format
         */
        exportSubtitles() {
            if (isNull(this.microphoneRecorder)) {
                this.updateDebugText("No MicrophoneRecorder assigned");
                return;
            }
            if (!this.microphoneRecorder.hasSubtitles()) {
                this.updateDebugText("No subtitles to export");
                return;
            }
            const srtContent = this.microphoneRecorder.exportSubtitlesToSRT();
            if (srtContent && srtContent.length > 0) {
                // In a real implementation, you might save this to a file
                // For now, we'll just log it
                print("Exported SRT Content:");
                print(srtContent);
                this.updateDebugText("Subtitles exported to console");
            }
            else {
                this.updateDebugText("Failed to export subtitles");
            }
        }
        /**
         * Toggle subtitle generation on/off
         */
        toggleSubtitleGeneration() {
            if (!isNull(this.subtitleConfig)) {
                const currentState = this.subtitleConfig.enableSubtitlesByDefault;
                this.subtitleConfig.toggleSubtitles(!currentState);
                this.updateDebugText(`Subtitles ${!currentState ? 'enabled' : 'disabled'}`);
            }
            else if (!isNull(this.microphoneRecorder)) {
                // Fallback to direct control if no config component
                this.microphoneRecorder.toggleSubtitleGeneration(true);
                this.updateDebugText("Subtitle generation enabled");
            }
            else {
                this.updateDebugText("No subtitle components found");
            }
        }
        /**
         * Show configuration information
         */
        showConfiguration() {
            if (!isNull(this.subtitleConfig)) {
                const summary = this.subtitleConfig.getConfigSummary();
                this.updateDebugText(`Config: ${summary}`);
            }
            else {
                this.updateDebugText("No configuration component found");
            }
        }
        /**
         * Set up subtitle system with API key
         */
        setupSubtitles(apiKey, language = "en") {
            if (!isNull(this.subtitleConfig)) {
                this.subtitleConfig.setApiKey(apiKey);
                this.subtitleConfig.setLanguage(language);
                this.updateDebugText("Subtitle system configured");
            }
            else {
                this.updateDebugText("No configuration component available");
            }
        }
        /**
         * Get subtitle statistics
         */
        getSubtitleStats() {
            if (isNull(this.microphoneRecorder)) {
                return "No recorder available";
            }
            const subtitleDisplay = this.microphoneRecorder.subtitleDisplay;
            if (isNull(subtitleDisplay)) {
                return "No display component";
            }
            if (!subtitleDisplay.hasSubtitles()) {
                return "No subtitles generated";
            }
            const stats = subtitleDisplay.getSubtitleStats();
            return `Segments: ${stats.count}, Duration: ${stats.totalDuration.toFixed(1)}s, Avg Length: ${stats.averageLength} chars`;
        }
        /**
         * Update debug text if available
         */
        updateDebugText(message) {
            if (!isNull(this.debugText)) {
                this.debugText.text = `Subtitle Action: ${message}`;
            }
            print(`SubtitleActivator: ${message}`);
        }
    };
    __setFunctionName(_classThis, "SubtitleActivator");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SubtitleActivator = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SubtitleActivator = _classThis;
})();
exports.SubtitleActivator = SubtitleActivator;
//# sourceMappingURL=SubtitleActivator.js.map