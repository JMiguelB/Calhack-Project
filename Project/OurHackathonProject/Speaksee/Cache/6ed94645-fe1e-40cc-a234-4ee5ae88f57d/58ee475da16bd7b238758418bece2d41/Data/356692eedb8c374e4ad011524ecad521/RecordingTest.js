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
exports.RecordingTest = void 0;
var __selfType = requireType("./RecordingTest");
function component(target) { target.getTypeName = function () { return __selfType; }; }
/**
 * Simple recording test script
 * Use this to test if basic recording works
 */
let RecordingTest = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var RecordingTest = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.microphoneAsset = this.microphoneAsset;
            this.audioOutput = this.audioOutput;
            this.isRecording = false;
        }
        __initialize() {
            super.__initialize();
            this.microphoneAsset = this.microphoneAsset;
            this.audioOutput = this.audioOutput;
            this.isRecording = false;
        }
        onAwake() {
            print("RecordingTest: Starting test...");
            if (isNull(this.microphoneAsset)) {
                print("❌ TEST FAILED: Microphone Asset not connected");
                return;
            }
            if (isNull(this.audioOutput)) {
                print("❌ TEST FAILED: Audio Output not connected");
                return;
            }
            this.microphoneControl = this.microphoneAsset.control;
            this.microphoneControl.sampleRate = 44100;
            print("✅ RecordingTest: All assets connected properly");
            print("👆 Tap screen to test recording");
            // Add tap to record
            const tapEvent = this.createEvent("TapEvent");
            tapEvent.bind(() => {
                this.toggleRecording();
            });
        }
        toggleRecording() {
            if (!this.isRecording) {
                print("🔴 Starting test recording...");
                this.microphoneControl.start();
                this.isRecording = true;
                // Stop after 3 seconds
                const stopEvent = this.createEvent("DelayedCallbackEvent");
                stopEvent.bind(() => {
                    this.stopRecording();
                });
                stopEvent.reset(3.0);
            }
        }
        stopRecording() {
            if (this.isRecording) {
                print("⏹️ Stopping test recording...");
                this.microphoneControl.stop();
                this.isRecording = false;
                print("✅ TEST COMPLETE: Recording worked!");
            }
        }
    };
    __setFunctionName(_classThis, "RecordingTest");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RecordingTest = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RecordingTest = _classThis;
})();
exports.RecordingTest = RecordingTest;
//# sourceMappingURL=RecordingTest.js.map