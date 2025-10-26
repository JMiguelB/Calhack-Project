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
exports.SubtitleConfig = void 0;
var __selfType = requireType("./SubtitleConfig");
function component(target) { target.getTypeName = function () { return __selfType; }; }
let SubtitleConfig = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SubtitleConfig = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.openAIApiKey = this.openAIApiKey;
            this.language = this.language;
            this.aiModel = this.aiModel;
            this.responseFormat = this.responseFormat;
            this.enableSubtitlesByDefault = this.enableSubtitlesByDefault;
            this.microphoneRecorder = this.microphoneRecorder;
            this.debugText = this.debugText;
        }
        __initialize() {
            super.__initialize();
            this.openAIApiKey = this.openAIApiKey;
            this.language = this.language;
            this.aiModel = this.aiModel;
            this.responseFormat = this.responseFormat;
            this.enableSubtitlesByDefault = this.enableSubtitlesByDefault;
            this.microphoneRecorder = this.microphoneRecorder;
            this.debugText = this.debugText;
        }
        onAwake() {
            this.initializeConfiguration();
        }
        /**
         * Initialize subtitle configuration
         */
        initializeConfiguration() {
            if (!isNull(this.microphoneRecorder)) {
                // Configure the microphone recorder with subtitle settings
                this.applyConfiguration();
            }
            this.updateDebugText("Subtitle configuration ready");
        }
        /**
         * Apply current configuration to the microphone recorder
         */
        applyConfiguration() {
            if (isNull(this.microphoneRecorder)) {
                this.updateDebugText("Error: No MicrophoneRecorder assigned");
                return;
            }
            if (!this.openAIApiKey || this.openAIApiKey.trim() === "") {
                this.updateDebugText("Warning: No API key configured");
                return;
            }
            // Configure subtitle generation
            this.microphoneRecorder.configureSubtitleGeneration(this.openAIApiKey, this.language);
            // Enable/disable subtitle generation
            this.microphoneRecorder.toggleSubtitleGeneration(this.enableSubtitlesByDefault);
            this.updateDebugText("Configuration applied successfully");
        }
        /**
         * Update API key and reconfigure
         */
        setApiKey(apiKey) {
            this.openAIApiKey = apiKey;
            this.applyConfiguration();
            this.updateDebugText(`API key updated: ${apiKey.substring(0, 8)}...`);
        }
        /**
         * Update language setting
         */
        setLanguage(language) {
            this.language = language;
            this.applyConfiguration();
            this.updateDebugText(`Language set to: ${language}`);
        }
        /**
         * Toggle subtitle generation
         */
        toggleSubtitles(enabled) {
            this.enableSubtitlesByDefault = enabled;
            if (!isNull(this.microphoneRecorder)) {
                this.microphoneRecorder.toggleSubtitleGeneration(enabled);
            }
            this.updateDebugText(`Subtitles ${enabled ? 'enabled' : 'disabled'}`);
        }
        /**
         * Validate current configuration
         */
        validateConfiguration() {
            if (!this.openAIApiKey || this.openAIApiKey.trim() === "") {
                this.updateDebugText("Error: API key required");
                return false;
            }
            if (!this.language || this.language.trim() === "") {
                this.updateDebugText("Error: Language required");
                return false;
            }
            if (isNull(this.microphoneRecorder)) {
                this.updateDebugText("Error: MicrophoneRecorder required");
                return false;
            }
            return true;
        }
        /**
         * Get configuration summary
         */
        getConfigSummary() {
            return `Language: ${this.language}, Model: ${this.aiModel}, Subtitles: ${this.enableSubtitlesByDefault ? 'ON' : 'OFF'}`;
        }
        /**
         * Reset to default configuration
         */
        resetToDefaults() {
            this.language = "en";
            this.aiModel = "whisper-1";
            this.responseFormat = "verbose_json";
            this.enableSubtitlesByDefault = true;
            this.applyConfiguration();
            this.updateDebugText("Configuration reset to defaults");
        }
        /**
         * Update debug text if available
         */
        updateDebugText(message) {
            if (!isNull(this.debugText)) {
                this.debugText.text = `Config: ${message}`;
            }
            print(`SubtitleConfig: ${message}`);
        }
        /**
         * Get supported languages
         */
        getSupportedLanguages() {
            return [
                "en", // English
                "es", // Spanish
                "fr", // French
                "de", // German
                "it", // Italian
                "pt", // Portuguese
                "nl", // Dutch
                "pl", // Polish
                "ru", // Russian
                "ja", // Japanese
                "ko", // Korean
                "zh", // Chinese
                "ar", // Arabic
                "hi", // Hindi
                "tr", // Turkish
                "sv", // Swedish
                "da", // Danish
                "no", // Norwegian
                "fi" // Finnish
            ];
        }
        /**
         * Check if a language is supported
         */
        isLanguageSupported(language) {
            return this.getSupportedLanguages().includes(language.toLowerCase());
        }
    };
    __setFunctionName(_classThis, "SubtitleConfig");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SubtitleConfig = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SubtitleConfig = _classThis;
})();
exports.SubtitleConfig = SubtitleConfig;
//# sourceMappingURL=SubtitleConfig.js.map