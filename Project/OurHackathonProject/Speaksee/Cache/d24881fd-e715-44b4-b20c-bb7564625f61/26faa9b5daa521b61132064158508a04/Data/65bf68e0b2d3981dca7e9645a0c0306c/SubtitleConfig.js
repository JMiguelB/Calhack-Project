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
            this.microphoneRecorder = this.microphoneRecorder;
            this.apiKey = this.apiKey;
            this.language = this.language;
            this.enableSubtitles = this.enableSubtitles;
            this.statusText = this.statusText;
        }
        __initialize() {
            super.__initialize();
            this.microphoneRecorder = this.microphoneRecorder;
            this.apiKey = this.apiKey;
            this.language = this.language;
            this.enableSubtitles = this.enableSubtitles;
            this.statusText = this.statusText;
        }
        // Alias for backward compatibility
        get enableSubtitlesByDefault() {
            return this.enableSubtitles;
        }
        onAwake() {
            this.configureSubtitles();
        }
        configureSubtitles() {
            if (isNull(this.microphoneRecorder)) {
                this.updateStatus("Warning: MicrophoneRecorder not connected");
                print("SubtitleConfig: Warning - MicrophoneRecorder not connected, configuration stored for later use");
                return;
            }
            // Configure subtitle settings
            this.microphoneRecorder.toggleSubtitleGeneration(this.enableSubtitles);
            if (this.enableSubtitles && this.apiKey && this.apiKey.trim() !== "") {
                // Configure with API key
                this.microphoneRecorder.configureSubtitleGeneration(this.apiKey, this.language);
                this.updateStatus(`Subtitles configured for language: ${this.language}`);
                print("SubtitleConfig: Subtitle generation configured successfully");
            }
            else if (this.enableSubtitles) {
                this.updateStatus("Warning: API key needed for subtitle generation");
                print("SubtitleConfig: Warning - API key not provided");
            }
            else {
                this.updateStatus("Subtitles disabled");
                print("SubtitleConfig: Subtitle generation disabled");
            }
        }
        // Call this method to update API key at runtime
        updateApiKey(newApiKey) {
            this.apiKey = newApiKey;
            this.configureSubtitles();
        }
        // Alias methods for backward compatibility with SubtitleActivator
        setApiKey(newApiKey) {
            this.updateApiKey(newApiKey);
        }
        setLanguage(newLanguage) {
            this.updateLanguage(newLanguage);
        }
        // Call this to change language
        updateLanguage(newLanguage) {
            this.language = newLanguage;
            this.configureSubtitles();
        }
        // Toggle subtitle functionality
        toggleSubtitles(enabled) {
            this.enableSubtitles = enabled;
            this.configureSubtitles();
        }
        // Get configuration summary for display
        getConfigSummary() {
            if (this.enableSubtitles) {
                const hasApiKey = this.apiKey && this.apiKey.trim() !== "";
                const hasRecorder = !isNull(this.microphoneRecorder);
                return `Enabled, Lang: ${this.language}, API: ${hasApiKey ? 'Set' : 'Missing'}, Recorder: ${hasRecorder ? 'Connected' : 'Missing'}`;
            }
            else {
                return "Disabled";
            }
        }
        // Connect MicrophoneRecorder after component creation
        connectMicrophoneRecorder(recorder) {
            this.microphoneRecorder = recorder;
            this.configureSubtitles();
            this.updateStatus("MicrophoneRecorder connected and configured");
        }
        updateStatus(message) {
            if (this.statusText) {
                this.statusText.text = `Config: ${message}`;
            }
            print(`SubtitleConfig: ${message}`);
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