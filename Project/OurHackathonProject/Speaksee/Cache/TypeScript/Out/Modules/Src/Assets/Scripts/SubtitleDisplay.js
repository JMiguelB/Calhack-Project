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
exports.SubtitleDisplay = void 0;
var __selfType = requireType("./SubtitleDisplay");
function component(target) { target.getTypeName = function () { return __selfType; }; }
let SubtitleDisplay = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SubtitleDisplay = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.subtitleText = this.subtitleText;
            this.subtitleBackground = this.subtitleBackground;
            this.maxLines = this.maxLines;
            this.fontSize = this.fontSize;
            this.enableWordHighlight = this.enableWordHighlight;
            this.subtitles = [];
            this.currentPlaybackTime = 0;
            this.isDisplaying = false;
            this.currentSegmentIndex = -1;
        }
        __initialize() {
            super.__initialize();
            this.subtitleText = this.subtitleText;
            this.subtitleBackground = this.subtitleBackground;
            this.maxLines = this.maxLines;
            this.fontSize = this.fontSize;
            this.enableWordHighlight = this.enableWordHighlight;
            this.subtitles = [];
            this.currentPlaybackTime = 0;
            this.isDisplaying = false;
            this.currentSegmentIndex = -1;
        }
        onAwake() {
            this.initializeDisplay();
        }
        /**
         * Initialize the subtitle display
         */
        initializeDisplay() {
            if (this.subtitleText) {
                this.subtitleText.text = "";
                this.subtitleText.size = this.fontSize;
                // Set text properties for better readability
                this.setTextStyle();
            }
            if (this.subtitleBackground) {
                this.subtitleBackground.enabled = false;
            }
            this.hideSubtitles();
        }
        /**
         * Set text styling for better subtitle readability
         */
        setTextStyle() {
            if (!this.subtitleText)
                return;
            // Set text alignment to center
            this.subtitleText.horizontalAlignment = HorizontalAlignment.Center;
            this.subtitleText.verticalAlignment = VerticalAlignment.Center;
            // Add outline for better visibility using Spectacles Text component API
            if (this.subtitleText.outlineSettings) {
                this.subtitleText.outlineSettings.enabled = true;
                this.subtitleText.outlineSettings.size = 0.1; // Outline strength (0.0 to 1.0)
                if (this.subtitleText.outlineSettings.fill) {
                    this.subtitleText.outlineSettings.fill.color = new vec4(0, 0, 0, 1); // Black outline
                }
            }
        }
        /**
         * Load subtitles to display
         */
        loadSubtitles(subtitles) {
            this.subtitles = subtitles;
            this.currentSegmentIndex = -1;
            print(`SubtitleDisplay: Loaded ${subtitles.length} subtitle segments`);
        }
        /**
         * Start displaying subtitles synchronized with playback
         */
        startDisplay() {
            if (this.subtitles.length === 0) {
                this.showMessage("No subtitles available");
                return;
            }
            this.isDisplaying = true;
            this.currentPlaybackTime = 0;
            this.currentSegmentIndex = -1;
            this.showSubtitleBackground();
            print("SubtitleDisplay: Started subtitle display");
        }
        /**
         * Stop displaying subtitles
         */
        stopDisplay() {
            this.isDisplaying = false;
            this.hideSubtitles();
            this.hideSubtitleBackground();
            print("SubtitleDisplay: Stopped subtitle display");
        }
        /**
         * Update playback time and show appropriate subtitles
         */
        updatePlaybackTime(currentTime) {
            if (!this.isDisplaying || this.subtitles.length === 0) {
                return;
            }
            this.currentPlaybackTime = currentTime;
            this.updateCurrentSubtitle();
        }
        /**
         * Update the currently displayed subtitle based on playback time
         */
        updateCurrentSubtitle() {
            let activeSegmentIndex = -1;
            let activeText = "";
            // Find the active subtitle segment for current time
            for (let i = 0; i < this.subtitles.length; i++) {
                const segment = this.subtitles[i];
                if (this.currentPlaybackTime >= segment.startTime &&
                    this.currentPlaybackTime <= segment.endTime) {
                    activeSegmentIndex = i;
                    activeText = segment.text;
                    break;
                }
            }
            // Update display if segment changed
            if (activeSegmentIndex !== this.currentSegmentIndex) {
                this.currentSegmentIndex = activeSegmentIndex;
                if (activeSegmentIndex >= 0) {
                    this.displaySubtitle(activeText);
                }
                else {
                    this.hideSubtitles();
                }
            }
        }
        /**
         * Display a subtitle text
         */
        displaySubtitle(text) {
            if (!this.subtitleText)
                return;
            // Handle multi-line text if needed
            const formattedText = this.formatSubtitleText(text);
            this.subtitleText.text = formattedText;
            this.subtitleText.enabled = true;
            // Show background if available
            this.showSubtitleBackground();
        }
        /**
         * Format subtitle text for display (handle line breaks, length limits)
         */
        formatSubtitleText(text) {
            // Split long text into multiple lines if needed
            const words = text.split(' ');
            const lines = [];
            let currentLine = '';
            const maxCharsPerLine = 40; // Adjust based on display requirements
            for (const word of words) {
                if (currentLine.length + word.length + 1 <= maxCharsPerLine) {
                    currentLine += (currentLine ? ' ' : '') + word;
                }
                else {
                    if (currentLine) {
                        lines.push(currentLine);
                        currentLine = word;
                    }
                    else {
                        // Word is too long for a single line, add it anyway
                        lines.push(word);
                    }
                }
            }
            if (currentLine) {
                lines.push(currentLine);
            }
            // Limit to max lines
            const displayLines = lines.slice(0, this.maxLines);
            return displayLines.join('\n');
        }
        /**
         * Hide subtitles
         */
        hideSubtitles() {
            if (this.subtitleText) {
                this.subtitleText.enabled = false;
                this.subtitleText.text = "";
            }
        }
        /**
         * Show subtitle background
         */
        showSubtitleBackground() {
            if (this.subtitleBackground) {
                this.subtitleBackground.enabled = true;
            }
        }
        /**
         * Hide subtitle background
         */
        hideSubtitleBackground() {
            if (this.subtitleBackground) {
                this.subtitleBackground.enabled = false;
            }
        }
        /**
         * Show a temporary message
         */
        showMessage(message, duration = 3.0) {
            if (!this.subtitleText)
                return;
            this.subtitleText.text = message;
            this.subtitleText.enabled = true;
            this.showSubtitleBackground();
            // Hide message after duration
            const hideEvent = this.createEvent("DelayedCallbackEvent");
            hideEvent.bind(() => {
                if (this.subtitleText.text === message) {
                    this.hideSubtitles();
                    this.hideSubtitleBackground();
                }
            });
            hideEvent.reset(duration);
        }
        /**
         * Display all subtitles as scrolling text (for review)
         */
        displayAllSubtitles() {
            if (this.subtitles.length === 0) {
                this.showMessage("No subtitles generated");
                return;
            }
            let fullText = "";
            for (let i = 0; i < this.subtitles.length; i++) {
                const segment = this.subtitles[i];
                fullText += `[${this.formatTime(segment.startTime)}] ${segment.text}\n`;
            }
            if (this.subtitleText) {
                this.subtitleText.text = fullText.trim();
                this.subtitleText.enabled = true;
                this.showSubtitleBackground();
            }
        }
        /**
         * Format time for display (MM:SS)
         */
        formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        /**
         * Get current subtitle statistics
         */
        getSubtitleStats() {
            if (this.subtitles.length === 0) {
                return { count: 0, totalDuration: 0, averageLength: 0 };
            }
            const totalDuration = this.subtitles[this.subtitles.length - 1].endTime;
            const totalLength = this.subtitles.reduce((sum, segment) => sum + segment.text.length, 0);
            const averageLength = totalLength / this.subtitles.length;
            return {
                count: this.subtitles.length,
                totalDuration,
                averageLength: Math.round(averageLength)
            };
        }
        /**
         * Check if subtitles are currently loaded
         */
        hasSubtitles() {
            return this.subtitles.length > 0;
        }
        /**
         * Clear all loaded subtitles
         */
        clearSubtitles() {
            this.subtitles = [];
            this.hideSubtitles();
            this.hideSubtitleBackground();
            this.currentSegmentIndex = -1;
            print("SubtitleDisplay: Cleared subtitles");
        }
    };
    __setFunctionName(_classThis, "SubtitleDisplay");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SubtitleDisplay = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SubtitleDisplay = _classThis;
})();
exports.SubtitleDisplay = SubtitleDisplay;
//# sourceMappingURL=SubtitleDisplay.js.map