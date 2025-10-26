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
exports.SubtitleGenerator = void 0;
var __selfType = requireType("./SubtitleGenerator");
function component(target) { target.getTypeName = function () { return __selfType; }; }
let SubtitleGenerator = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SubtitleGenerator = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.internetModule = this.internetModule;
            this.debugText = this.debugText;
            this.config = {
                apiKey: '', // Will need to be set
                language: 'en',
                model: 'whisper-1',
                responseFormat: 'verbose_json'
            };
            this.isGenerating = false;
            this.generatedSubtitles = [];
        }
        __initialize() {
            super.__initialize();
            this.internetModule = this.internetModule;
            this.debugText = this.debugText;
            this.config = {
                apiKey: '', // Will need to be set
                language: 'en',
                model: 'whisper-1',
                responseFormat: 'verbose_json'
            };
            this.isGenerating = false;
            this.generatedSubtitles = [];
        }
        onAwake() {
            // Initialize any required components
            this.updateDebugText('Subtitle Generator Ready');
        }
        /**
         * Configure the AI service for subtitle generation
         */
        configure(config) {
            this.config = { ...this.config, ...config };
            this.updateDebugText('Subtitle Generator Configured');
        }
        /**
         * Generate subtitles from recorded audio frames
         */
        async generateSubtitles(audioFrames, sampleRate = 44100) {
            if (this.isGenerating) {
                this.updateDebugText('Generation already in progress...');
                return this.generatedSubtitles;
            }
            if (!this.config.apiKey) {
                this.updateDebugText('Error: API key not configured');
                return [];
            }
            try {
                this.isGenerating = true;
                this.updateDebugText('Generating subtitles...');
                // Convert audio frames to WAV format for API
                const audioBlob = this.convertToWav(audioFrames, sampleRate);
                // Generate subtitles using AI API
                const subtitles = await this.callWhisperAPI(audioBlob);
                this.generatedSubtitles = subtitles;
                this.updateDebugText(`Generated ${subtitles.length} subtitle segments`);
                return subtitles;
            }
            catch (error) {
                this.updateDebugText(`Error generating subtitles: ${error.message}`);
                return [];
            }
            finally {
                this.isGenerating = false;
            }
        }
        /**
         * Convert Float32Array audio frames to WAV blob for API upload
         */
        convertToWav(audioFrames, sampleRate) {
            // Combine all audio frames into single array
            let totalLength = 0;
            for (const frame of audioFrames) {
                totalLength += frame.length;
            }
            const combinedAudio = new Float32Array(totalLength);
            let offset = 0;
            for (const frame of audioFrames) {
                combinedAudio.set(frame, offset);
                offset += frame.length;
            }
            // Convert to WAV format
            const wavBuffer = this.encodeWAV(combinedAudio, sampleRate);
            // Convert ArrayBuffer to base64 string for Spectacles compatibility
            const wavBytes = new Uint8Array(wavBuffer);
            const base64String = this.arrayBufferToBase64(wavBytes);
            return new Blob([base64String], { type: 'audio/wav' });
        }
        /**
         * Convert Uint8Array to base64 string (custom implementation for Spectacles)
         */
        arrayBufferToBase64(buffer) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            let result = '';
            let i = 0;
            while (i < buffer.length) {
                const a = buffer[i++];
                const b = i < buffer.length ? buffer[i++] : 0;
                const c = i < buffer.length ? buffer[i++] : 0;
                const bitmap = (a << 16) | (b << 8) | c;
                result += chars.charAt((bitmap >> 18) & 63);
                result += chars.charAt((bitmap >> 12) & 63);
                result += i - 2 < buffer.length ? chars.charAt((bitmap >> 6) & 63) : '=';
                result += i - 1 < buffer.length ? chars.charAt(bitmap & 63) : '=';
            }
            return result;
        }
        /**
         * Encode Float32Array as WAV file
         */
        encodeWAV(audioData, sampleRate) {
            const length = audioData.length;
            const buffer = new ArrayBuffer(44 + length * 2);
            const view = new DataView(buffer);
            // WAV header
            const writeString = (offset, string) => {
                for (let i = 0; i < string.length; i++) {
                    view.setUint8(offset + i, string.charCodeAt(i));
                }
            };
            writeString(0, 'RIFF');
            view.setUint32(4, 36 + length * 2, true);
            writeString(8, 'WAVE');
            writeString(12, 'fmt ');
            view.setUint32(16, 16, true);
            view.setUint16(20, 1, true);
            view.setUint16(22, 1, true);
            view.setUint32(24, sampleRate, true);
            view.setUint32(28, sampleRate * 2, true);
            view.setUint16(32, 2, true);
            view.setUint16(34, 16, true);
            writeString(36, 'data');
            view.setUint32(40, length * 2, true);
            // Convert float samples to 16-bit PCM
            let offset = 44;
            for (let i = 0; i < length; i++) {
                const sample = Math.max(-1, Math.min(1, audioData[i]));
                view.setInt16(offset, sample * 0x7FFF, true);
                offset += 2;
            }
            return buffer;
        }
        /**
         * Call OpenAI Whisper API for speech-to-text
         */
        async callWhisperAPI(audioBlob) {
            // Note: Spectacles environment may not support FormData directly
            // This is a simplified implementation - in a real scenario, you would need
            // to handle multipart/form-data encoding manually or use alternative approaches
            if (!this.internetModule) {
                throw new Error('InternetModule not configured');
            }
            // Create a basic request without FormData for now
            // In production, you would need to properly encode the audio data
            const request = new Request('https://api.openai.com/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.config.model,
                    response_format: this.config.responseFormat,
                    language: this.config.language,
                    // Note: This is a placeholder - actual audio data needs proper encoding
                    audio_data: 'base64_encoded_audio_would_go_here'
                })
            });
            const response = await this.internetModule.fetch(request);
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }
            const result = await response.json();
            // Parse response based on format
            if (this.config.responseFormat === 'verbose_json' && result.segments) {
                return result.segments.map((segment) => ({
                    text: segment.text.trim(),
                    startTime: segment.start,
                    endTime: segment.end
                }));
            }
            else if (result.text) {
                // Simple text response - create single segment
                return [{
                        text: result.text.trim(),
                        startTime: 0,
                        endTime: 0 // Will need to be calculated based on audio duration
                    }];
            }
            return [];
        }
        /**
         * Get the currently generated subtitles
         */
        getSubtitles() {
            return this.generatedSubtitles;
        }
        /**
         * Check if subtitle generation is in progress
         */
        isGeneratingSubtitles() {
            return this.isGenerating;
        }
        /**
         * Clear generated subtitles
         */
        clearSubtitles() {
            this.generatedSubtitles = [];
            this.updateDebugText('Subtitles cleared');
        }
        /**
         * Export subtitles in SRT format
         */
        exportToSRT() {
            let srtContent = '';
            for (let i = 0; i < this.generatedSubtitles.length; i++) {
                const segment = this.generatedSubtitles[i];
                srtContent += `${i + 1}\n`;
                srtContent += `${this.formatTime(segment.startTime)} --> ${this.formatTime(segment.endTime)}\n`;
                srtContent += `${segment.text}\n\n`;
            }
            return srtContent;
        }
        /**
         * Format time for SRT format (HH:MM:SS,mmm)
         */
        formatTime(seconds) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = Math.floor(seconds % 60);
            const milliseconds = Math.floor((seconds % 1) * 1000);
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
        }
        /**
         * Update debug text if available
         */
        updateDebugText(message) {
            if (!isNull(this.debugText)) {
                this.debugText.text = `Subtitles: ${message}`;
            }
            print(`SubtitleGenerator: ${message}`);
        }
    };
    __setFunctionName(_classThis, "SubtitleGenerator");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SubtitleGenerator = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SubtitleGenerator = _classThis;
})();
exports.SubtitleGenerator = SubtitleGenerator;
//# sourceMappingURL=SubtitleGenerator.js.map