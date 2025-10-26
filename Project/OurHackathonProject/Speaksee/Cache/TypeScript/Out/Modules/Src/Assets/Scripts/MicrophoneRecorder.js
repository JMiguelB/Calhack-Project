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
exports.MicrophoneRecorder = void 0;
var __selfType = requireType("./MicrophoneRecorder");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const SAMPLE_RATE = 44100;
let MicrophoneRecorder = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var MicrophoneRecorder = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.microphoneAsset = this.microphoneAsset;
            this.audioOutput = this.audioOutput;
            this.debugText = this.debugText;
            this.subtitleGenerator = this.subtitleGenerator;
            this.subtitleDisplay = this.subtitleDisplay;
            this.enableSubtitles = this.enableSubtitles;
            this.recordedAudioFrames = [];
            this.generatedSubtitles = [];
            this.numberOfSamples = 0;
            this._recordingDuration = 0;
            this.currentPlaybackTime = 0;
        }
        __initialize() {
            super.__initialize();
            this.microphoneAsset = this.microphoneAsset;
            this.audioOutput = this.audioOutput;
            this.debugText = this.debugText;
            this.subtitleGenerator = this.subtitleGenerator;
            this.subtitleDisplay = this.subtitleDisplay;
            this.enableSubtitles = this.enableSubtitles;
            this.recordedAudioFrames = [];
            this.generatedSubtitles = [];
            this.numberOfSamples = 0;
            this._recordingDuration = 0;
            this.currentPlaybackTime = 0;
        }
        onAwake() {
            if (isNull(this.microphoneAsset)) {
                print("ERROR: MicrophoneRecorder - microphoneAsset not connected!");
                return;
            }
            if (isNull(this.audioOutput)) {
                print("ERROR: MicrophoneRecorder - audioOutput not connected!");
                return;
            }
            // Initialize microphone control and set sample rate
            this.microphoneControl = this.microphoneAsset
                .control;
            this.microphoneControl.sampleRate = SAMPLE_RATE;
            // Create and configure audio component
            this.audioComponent = this.sceneObject.createComponent("AudioComponent");
            this.audioComponent.audioTrack = this.audioOutput;
            this.audioOutputProvider = this.audioOutput.control;
            this.audioOutputProvider.sampleRate = SAMPLE_RATE;
            // Create and bind record audio update event
            this.recordAudioUpdateEvent = this.createEvent("UpdateEvent");
            this.recordAudioUpdateEvent.bind(() => {
                this.onRecordAudio();
            });
            this.recordAudioUpdateEvent.enabled = false;
            // Create and bind playback audio update event
            this.playbackAudioUpdateEvent = this.createEvent("UpdateEvent");
            this.playbackAudioUpdateEvent.bind(() => {
                this.onPlaybackAudio();
            });
            this.playbackAudioUpdateEvent.enabled = false;
            print("MicrophoneRecorder: Initialized successfully");
        }
        // Called to record audio from the microphone
        onRecordAudio() {
            if (isNull(this.microphoneControl)) {
                print("ERROR: onRecordAudio called but microphoneControl is null!");
                return;
            }
            let frameSize = this.microphoneControl.maxFrameSize;
            let audioFrame = new Float32Array(frameSize);
            // Get audio frame shape
            const audioFrameShape = this.microphoneControl.getAudioFrame(audioFrame);
            // If no audio data, return early
            if (audioFrameShape.x === 0) {
                return;
            }
            // Reduce the initial subarray size to the audioFrameShape value
            audioFrame = audioFrame.subarray(0, audioFrameShape.x);
            // Update the number of samples and recording duration
            this.numberOfSamples += audioFrameShape.x;
            this._recordingDuration = this.numberOfSamples / SAMPLE_RATE;
            // Update debug text with recording information
            this.updateRecordingDebugText();
            // Store the recorded audio frame
            this.recordedAudioFrames.push({
                audioFrame: audioFrame,
                audioFrameShape: audioFrameShape,
            });
            // Log progress every second
            if (Math.floor(this._recordingDuration) != Math.floor((this.numberOfSamples - audioFrameShape.x) / SAMPLE_RATE)) {
                print(`Recording: ${this._recordingDuration.toFixed(1)}s, ${this.recordedAudioFrames.length} frames`);
            }
        }
        // Called to handle playback of recorded audio
        onPlaybackAudio() {
            this.currentPlaybackTime += getDeltaTime();
            this.currentPlaybackTime = Math.min(this.currentPlaybackTime, this._recordingDuration);
            // Update debug text with playback information
            this.updatePlaybackDebugText();
            // Update subtitle display if available
            if (!isNull(this.subtitleDisplay)) {
                this.subtitleDisplay.updatePlaybackTime(this.currentPlaybackTime);
            }
            // Stop playback if the end of the recording is reached
            if (this.currentPlaybackTime >= this._recordingDuration) {
                this.audioComponent.stop(false);
                this.playbackAudioUpdateEvent.enabled = false;
                // Stop subtitle display
                if (!isNull(this.subtitleDisplay)) {
                    this.subtitleDisplay.stopDisplay();
                }
            }
        }
        // Update the debug text with recording information
        updateRecordingDebugText() {
            if (isNull(this.debugText)) {
                return;
            }
            this.debugText.text =
                "Duration: " + this._recordingDuration.toFixed(1) + "s";
            this.debugText.text +=
                "\n Size: " + (this.getTotalRecordedBytes() / 1000).toFixed(1) + "kB";
            this.debugText.text += "\nSample Rate: " + SAMPLE_RATE;
        }
        // Update the debug text with playback information
        updatePlaybackDebugText() {
            if (isNull(this.debugText)) {
                return;
            }
            if (this.numberOfSamples <= 0) {
                this.debugText.text =
                    "Oops! \nNo audio has been recorded yet. Please try recording again.";
                return;
            }
            this.debugText.text = "Playback Time: \n";
            this.debugText.text +=
                this.currentPlaybackTime.toFixed(1) +
                    "s / " +
                    this._recordingDuration.toFixed(1) +
                    "s";
        }
        // Start or stop recording audio from the microphone
        recordMicrophoneAudio(toRecord) {
            if (toRecord) {
                print("MicrophoneRecorder: Starting recording...");
                this.recordedAudioFrames = [];
                this.generatedSubtitles = [];
                this.audioComponent.stop(false);
                this.numberOfSamples = 0;
                this._recordingDuration = 0;
                if (isNull(this.microphoneControl)) {
                    print("ERROR: MicrophoneControl is null! Check microphone asset connection.");
                    return;
                }
                this.microphoneControl.start();
                this.recordAudioUpdateEvent.enabled = true;
                this.playbackAudioUpdateEvent.enabled = false;
                // Clear previous subtitles from display
                if (!isNull(this.subtitleDisplay)) {
                    this.subtitleDisplay.clearSubtitles();
                }
                print("MicrophoneRecorder: Recording started successfully");
            }
            else {
                print("MicrophoneRecorder: Stopping recording...");
                if (!isNull(this.microphoneControl)) {
                    this.microphoneControl.stop();
                }
                this.recordAudioUpdateEvent.enabled = false;
                print(`MicrophoneRecorder: Recording stopped. Duration: ${this._recordingDuration.toFixed(2)}s, Frames: ${this.recordedAudioFrames.length}`);
                // Generate subtitles after recording stops
                if (this.enableSubtitles && !isNull(this.subtitleGenerator)) {
                    this.generateSubtitlesFromRecording();
                }
            }
        }
        // Start playback of the recorded audio
        playbackRecordedAudio() {
            this.updatePlaybackDebugText();
            if (this.recordedAudioFrames.length <= 0) {
                return false;
            }
            this.currentPlaybackTime = 0;
            this.audioComponent.stop(false);
            this.playbackAudioUpdateEvent.enabled = true;
            this.audioComponent.play(-1);
            // Start subtitle display if subtitles are available
            if (!isNull(this.subtitleDisplay) && this.generatedSubtitles.length > 0) {
                this.subtitleDisplay.loadSubtitles(this.generatedSubtitles);
                this.subtitleDisplay.startDisplay();
            }
            for (let i = 0; i < this.recordedAudioFrames.length; i++) {
                this.audioOutputProvider.enqueueAudioFrame(this.recordedAudioFrames[i].audioFrame, this.recordedAudioFrames[i].audioFrameShape);
            }
            return true;
        }
        // Getter for recording duration
        get recordingDuration() {
            return this._recordingDuration;
        }
        // Calculate the total recorded bytes
        getTotalRecordedBytes() {
            let totalBytes = 0;
            for (const frame of this.recordedAudioFrames) {
                totalBytes += frame.audioFrame.byteLength;
            }
            return totalBytes;
        }
        // Generate subtitles from the recorded audio
        async generateSubtitlesAndAnalysis() {
            if (this.recordedAudioFrames.length === 0) {
                print("No audio frames to generate subtitles from");
                return;
            }
            try {
                // Extract audio frames for subtitle generation
                const audioFrames = this.recordedAudioFrames.map(frame => frame.audioFrame);
                // Generate subtitles
                this.generatedSubtitles = await this.subtitleGenerator.generateSubtitles(audioFrames, SAMPLE_RATE);
                // Load subtitles into display component if available
                if (!isNull(this.subtitleDisplay)) {
                    this.subtitleDisplay.loadSubtitles(this.generatedSubtitles);
                }
                print(`Generated ${this.generatedSubtitles.length} subtitle segments`);
            }
            catch (error) {
                print(`Error generating subtitles: ${error.message}`);
                // Create fallback subtitles on error
                this.generateFallbackSubtitles();
            }
        }
        // Generate fallback subtitles for testing when AI is not available
        generateFallbackSubtitles() {
            const duration = this._recordingDuration;
            // Create simple fallback subtitles based on recording duration 
            this.generatedSubtitles = [
                {
                    text: "Voice recording captured",
                    startTime: 0,
                    endTime: Math.min(2, duration)
                }
            ];
            // Add more segments for longer recordings
            if (duration > 2) {
                this.generatedSubtitles.push({
                    text: "Audio playback in progress",
                    startTime: 2,
                    endTime: Math.min(4, duration)
                });
            }
            if (duration > 4) {
                this.generatedSubtitles.push({
                    text: "Recording duration: " + duration.toFixed(1) + " seconds",
                    startTime: 4,
                    endTime: duration
                });
            }
            // Load subtitles into display if available
            if (!isNull(this.subtitleDisplay)) {
                this.subtitleDisplay.loadSubtitles(this.generatedSubtitles);
            }
            print(`Generated ${this.generatedSubtitles.length} fallback subtitle segments`);
        }
        // Generate subtitles from the recorded audio (legacy method)
        async generateSubtitlesFromRecording() {
            await this.generateSubtitlesAndAnalysis();
        }
        // Configure subtitle generation (call this to set API key and options)
        configureSubtitleGeneration(apiKey, language = 'en') {
            if (!isNull(this.subtitleGenerator)) {
                this.subtitleGenerator.configure({
                    apiKey: apiKey,
                    language: language,
                    model: 'whisper-1',
                    responseFormat: 'verbose_json'
                });
            }
        }
        // Get generated subtitles
        getGeneratedSubtitles() {
            return this.generatedSubtitles;
        }
        // Export subtitles in SRT format
        exportSubtitlesToSRT() {
            if (!isNull(this.subtitleGenerator)) {
                return this.subtitleGenerator.exportToSRT();
            }
            return "";
        }
        // Check if subtitles are available
        hasSubtitles() {
            return this.generatedSubtitles.length > 0;
        }
        // Toggle subtitle generation
        toggleSubtitleGeneration(enabled) {
            this.enableSubtitles = enabled;
        }
    };
    __setFunctionName(_classThis, "MicrophoneRecorder");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MicrophoneRecorder = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MicrophoneRecorder = _classThis;
})();
exports.MicrophoneRecorder = MicrophoneRecorder;
//# sourceMappingURL=MicrophoneRecorder.js.map