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
exports.SimpleSubtitleTest = void 0;
var __selfType = requireType("./SimpleSubtitleTest");
function component(target) { target.getTypeName = function () { return __selfType; }; }
let SimpleSubtitleTest = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SimpleSubtitleTest = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.subtitleDisplay = this.subtitleDisplay;
            this.testText = this.testText;
            this.showTestOnStart = this.showTestOnStart;
            this.testSubtitles = [
                { text: "Hello! This is a test subtitle.", startTime: 0, endTime: 3 },
                { text: "These subtitles demonstrate the display system.", startTime: 3, endTime: 6 },
                { text: "You can customize the text and timing.", startTime: 6, endTime: 9 },
                { text: "Perfect for testing your subtitle setup!", startTime: 9, endTime: 12 }
            ];
            this.currentTestTime = 0;
            this.isTestRunning = false;
        }
        __initialize() {
            super.__initialize();
            this.subtitleDisplay = this.subtitleDisplay;
            this.testText = this.testText;
            this.showTestOnStart = this.showTestOnStart;
            this.testSubtitles = [
                { text: "Hello! This is a test subtitle.", startTime: 0, endTime: 3 },
                { text: "These subtitles demonstrate the display system.", startTime: 3, endTime: 6 },
                { text: "You can customize the text and timing.", startTime: 6, endTime: 9 },
                { text: "Perfect for testing your subtitle setup!", startTime: 9, endTime: 12 }
            ];
            this.currentTestTime = 0;
            this.isTestRunning = false;
        }
        onAwake() {
            // Create update event for test subtitle timing
            this.testUpdateEvent = this.createEvent("UpdateEvent");
            this.testUpdateEvent.bind(() => {
                this.updateTestSubtitles();
            });
            this.testUpdateEvent.enabled = false;
            if (this.showTestOnStart) {
                // Delay test start slightly
                const delayEvent = this.createEvent("DelayedCallbackEvent");
                delayEvent.bind(() => {
                    this.startSubtitleTest();
                });
                delayEvent.reset(1.0);
            }
            this.updateStatus("Simple Subtitle Test Ready");
        }
        /**
         * Start the subtitle test sequence
         */
        startSubtitleTest() {
            if (!this.subtitleDisplay) {
                this.updateStatus("Error: SubtitleDisplay not connected");
                return;
            }
            if (this.isTestRunning) {
                this.stopSubtitleTest();
                return;
            }
            this.updateStatus("Starting subtitle test...");
            this.isTestRunning = true;
            this.currentTestTime = 0;
            // Load test subtitles into display
            this.subtitleDisplay.loadSubtitles(this.testSubtitles);
            this.subtitleDisplay.startDisplay();
            // Start update event
            this.testUpdateEvent.enabled = true;
            print("SimpleSubtitleTest: Started test sequence");
        }
        /**
         * Stop the subtitle test
         */
        stopSubtitleTest() {
            this.isTestRunning = false;
            this.testUpdateEvent.enabled = false;
            if (this.subtitleDisplay) {
                this.subtitleDisplay.stopDisplay();
            }
            this.updateStatus("Subtitle test stopped");
            print("SimpleSubtitleTest: Stopped test sequence");
        }
        /**
         * Update test subtitle timing
         */
        updateTestSubtitles() {
            if (!this.isTestRunning)
                return;
            this.currentTestTime += getDeltaTime();
            // Update subtitle display with current time
            if (this.subtitleDisplay) {
                this.subtitleDisplay.updatePlaybackTime(this.currentTestTime);
            }
            // Stop test when finished
            const maxDuration = Math.max(...this.testSubtitles.map(s => s.endTime));
            if (this.currentTestTime >= maxDuration + 1) {
                this.stopSubtitleTest();
            }
        }
        /**
         * Show a simple message on the subtitle display
         */
        showTestMessage(message, duration = 5.0) {
            if (this.subtitleDisplay) {
                this.subtitleDisplay.showMessage(message, duration);
            }
        }
        /**
         * Display all test subtitles as static text
         */
        showAllTestSubtitles() {
            if (!this.subtitleDisplay) {
                this.updateStatus("Error: SubtitleDisplay not connected");
                return;
            }
            this.subtitleDisplay.loadSubtitles(this.testSubtitles);
            this.subtitleDisplay.displayAllSubtitles();
            this.updateStatus("Showing all test subtitles");
        }
        /**
         * Create custom test subtitles
         */
        createCustomTest(texts, duration = 3.0) {
            const customSubtitles = [];
            for (let i = 0; i < texts.length; i++) {
                customSubtitles.push({
                    text: texts[i],
                    startTime: i * duration,
                    endTime: (i + 1) * duration
                });
            }
            if (this.subtitleDisplay) {
                this.subtitleDisplay.loadSubtitles(customSubtitles);
                this.updateStatus(`Created custom test with ${texts.length} subtitles`);
            }
        }
        /**
         * Check if subtitle test is running
         */
        isTestActive() {
            return this.isTestRunning;
        }
        updateStatus(message) {
            if (this.testText) {
                this.testText.text = `Test: ${message}`;
            }
            print(`SimpleSubtitleTest: ${message}`);
        }
    };
    __setFunctionName(_classThis, "SimpleSubtitleTest");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SimpleSubtitleTest = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SimpleSubtitleTest = _classThis;
})();
exports.SimpleSubtitleTest = SimpleSubtitleTest;
//# sourceMappingURL=SimpleSubtitleTest.js.map