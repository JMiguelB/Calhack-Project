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
exports.CommunicationAnalysisConfig = void 0;
var __selfType = requireType("./CommunicationAnalysisConfig");
function component(target) { target.getTypeName = function () { return __selfType; }; }
let CommunicationAnalysisConfig = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var CommunicationAnalysisConfig = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.microphoneRecorder = this.microphoneRecorder;
            this.apiKey = this.apiKey;
            this.focusAreas = this.focusAreas;
            this.enableAnalysis = this.enableAnalysis;
            this.analysisType = this.analysisType;
            this.statusText = this.statusText;
        }
        __initialize() {
            super.__initialize();
            this.microphoneRecorder = this.microphoneRecorder;
            this.apiKey = this.apiKey;
            this.focusAreas = this.focusAreas;
            this.enableAnalysis = this.enableAnalysis;
            this.analysisType = this.analysisType;
            this.statusText = this.statusText;
        }
        onAwake() {
            this.configureCommunicationAnalysis();
        }
        configureCommunicationAnalysis() {
            if (isNull(this.microphoneRecorder)) {
                this.updateStatus("Warning: MicrophoneRecorder not connected");
                print("CommunicationAnalysisConfig: Warning - MicrophoneRecorder not connected");
                return;
            }
            // Configure analysis settings
            this.microphoneRecorder.toggleCommunicationAnalysis(this.enableAnalysis);
            this.microphoneRecorder.setAnalysisFocusAreas(this.focusAreas);
            if (this.enableAnalysis && this.apiKey && this.apiKey.trim() !== "") {
                // Configure with API key
                const focusAreasArray = this.focusAreas.split(',').map(area => area.trim());
                this.microphoneRecorder.configureCommunicationAnalysis(this.apiKey, focusAreasArray);
                this.updateStatus(`Analysis configured for: ${this.focusAreas}`);
                print("CommunicationAnalysisConfig: Communication analysis configured successfully");
            }
            else if (this.enableAnalysis) {
                this.updateStatus("Warning: API key needed for analysis");
                print("CommunicationAnalysisConfig: Warning - API key not provided");
            }
            else {
                this.updateStatus("Communication analysis disabled");
                print("CommunicationAnalysisConfig: Communication analysis disabled");
            }
        }
        // Update API key at runtime
        updateApiKey(newApiKey) {
            this.apiKey = newApiKey;
            this.configureCommunicationAnalysis();
        }
        // Update focus areas
        updateFocusAreas(newAreas) {
            this.focusAreas = newAreas;
            this.configureCommunicationAnalysis();
        }
        // Toggle analysis
        toggleAnalysis(enabled) {
            this.enableAnalysis = enabled;
            this.configureCommunicationAnalysis();
        }
        // Get configuration summary
        getConfigSummary() {
            if (this.enableAnalysis) {
                const hasApiKey = this.apiKey && this.apiKey.trim() !== "";
                const hasRecorder = !isNull(this.microphoneRecorder);
                return `Enabled, Focus: ${this.focusAreas}, API: ${hasApiKey ? 'Set' : 'Missing'}, Recorder: ${hasRecorder ? 'Connected' : 'Missing'}`;
            }
            else {
                return "Disabled";
            }
        }
        // Connect MicrophoneRecorder after creation
        connectMicrophoneRecorder(recorder) {
            this.microphoneRecorder = recorder;
            this.configureCommunicationAnalysis();
            this.updateStatus("MicrophoneRecorder connected and configured");
        }
        // Set preset configurations
        setPresetConfiguration(preset) {
            switch (preset.toLowerCase()) {
                case "presentation":
                    this.focusAreas = "presentation";
                    this.analysisType = "detailed";
                    this.updateStatus("Configured for presentation practice");
                    break;
                case "interview":
                    this.focusAreas = "interview";
                    this.analysisType = "detailed";
                    this.updateStatus("Configured for interview preparation");
                    break;
                case "conversation":
                    this.focusAreas = "conversation";
                    this.analysisType = "quick";
                    this.updateStatus("Configured for conversation practice");
                    break;
                case "meeting":
                    this.focusAreas = "meeting";
                    this.analysisType = "focused";
                    this.updateStatus("Configured for meeting skills");
                    break;
                default:
                    this.focusAreas = "general";
                    this.analysisType = "detailed";
                    this.updateStatus("Configured for general communication");
                    break;
            }
            this.configureCommunicationAnalysis();
        }
        updateStatus(message) {
            if (this.statusText) {
                this.statusText.text = `Analysis: ${message}`;
            }
            print(`CommunicationAnalysisConfig: ${message}`);
        }
    };
    __setFunctionName(_classThis, "CommunicationAnalysisConfig");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CommunicationAnalysisConfig = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CommunicationAnalysisConfig = _classThis;
})();
exports.CommunicationAnalysisConfig = CommunicationAnalysisConfig;
//# sourceMappingURL=CommunicationAnalysisConfig.js.map