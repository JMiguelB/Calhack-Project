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
exports.ActivateMicrophoneRecorder = void 0;
var __selfType = requireType("./ActivateMicrophoneRecorder");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const Interactable_1 = require("SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable");
let ActivateMicrophoneRecorder = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var ActivateMicrophoneRecorder = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.microphoneRecorder = this.microphoneRecorder;
            this.asrController = this.asrController;
            this.buttonText = this.buttonText;
            this.isListening = false;
        }
        __initialize() {
            super.__initialize();
            this.microphoneRecorder = this.microphoneRecorder;
            this.asrController = this.asrController;
            this.buttonText = this.buttonText;
            this.isListening = false;
        }
        onAwake() {
            // Initialize button state
            this.isListening = false;
            this.updateButtonText();
            this.interactable = this.sceneObject.getComponent(Interactable_1.Interactable.getTypeName());
            if (this.interactable) {
                // Toggle recording on button press (onTriggerStart only)
                this.interactable.onTriggerStart.add(() => {
                    this.toggleListening();
                });
                print("ActivateMicrophoneRecorder: Toggle button events set up successfully");
            }
            else {
                print("ERROR: No Interactable component found on ActivateMicrophoneRecorder!");
            }
        }
        /**
         * Toggle between listening and not listening
         */
        toggleListening() {
            this.isListening = !this.isListening;
            if (this.isListening) {
                this.startListening();
            }
            else {
                this.stopListening();
            }
            this.updateButtonText();
        }
        /**
         * Start both microphone recording and ASR listening
         */
        startListening() {
            print("ActivateMicrophoneRecorder: Starting listening mode...");
            // Start microphone recording
            if (!isNull(this.microphoneRecorder)) {
                this.microphoneRecorder.recordMicrophoneAudio(true);
                print("✅ Microphone recording started");
            }
            else {
                print("❌ ERROR: MicrophoneRecorder is null!");
            }
            // Start ASR listening
            if (!isNull(this.asrController)) {
                this.asrController.startListening();
                print("✅ ASR listening started");
            }
            else {
                print("❌ ERROR: ASRController is null!");
            }
        }
        /**
         * Stop both microphone recording and ASR listening
         */
        stopListening() {
            print("ActivateMicrophoneRecorder: Stopping listening mode...");
            // Stop microphone recording
            if (!isNull(this.microphoneRecorder)) {
                this.microphoneRecorder.recordMicrophoneAudio(false);
                print("⏹️ Microphone recording stopped");
            }
            // Stop ASR listening
            if (!isNull(this.asrController)) {
                this.asrController.stopListening();
                print("⏹️ ASR listening stopped");
            }
        }
        /**
         * Update button text to reflect current state
         */
        updateButtonText() {
            if (!isNull(this.buttonText)) {
                if (this.isListening) {
                    this.buttonText.text = "🔴 Stop Recording";
                }
                else {
                    this.buttonText.text = "🎙️ Start Recording";
                }
            }
        }
        /**
         * Get current listening state
         */
        getIsListening() {
            return this.isListening;
        }
        /**
         * Force stop listening (useful for external control)
         */
        forceStopListening() {
            if (this.isListening) {
                this.isListening = false;
                this.stopListening();
                this.updateButtonText();
            }
        }
    };
    __setFunctionName(_classThis, "ActivateMicrophoneRecorder");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ActivateMicrophoneRecorder = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ActivateMicrophoneRecorder = _classThis;
})();
exports.ActivateMicrophoneRecorder = ActivateMicrophoneRecorder;
//# sourceMappingURL=ActivateMicrophoneRecorder.js.map