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
exports.CommunicationFeedbackDisplay = void 0;
var __selfType = requireType("./CommunicationFeedbackDisplay");
function component(target) { target.getTypeName = function () { return __selfType; }; }
let CommunicationFeedbackDisplay = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var CommunicationFeedbackDisplay = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.feedbackText = this.feedbackText;
            this.scoreText = this.scoreText;
            this.strengthsText = this.strengthsText;
            this.improvementsText = this.improvementsText;
            this.adviceText = this.adviceText;
            this.feedbackBackground = this.feedbackBackground;
            this.displayDuration = this.displayDuration;
            this.enableAutoScroll = this.enableAutoScroll;
            this.currentFeedback = null;
            this.isDisplaying = false;
            this.scrollIndex = 0;
        }
        __initialize() {
            super.__initialize();
            this.feedbackText = this.feedbackText;
            this.scoreText = this.scoreText;
            this.strengthsText = this.strengthsText;
            this.improvementsText = this.improvementsText;
            this.adviceText = this.adviceText;
            this.feedbackBackground = this.feedbackBackground;
            this.displayDuration = this.displayDuration;
            this.enableAutoScroll = this.enableAutoScroll;
            this.currentFeedback = null;
            this.isDisplaying = false;
            this.scrollIndex = 0;
        }
        onAwake() {
            this.initializeDisplay();
            this.setupScrolling();
        }
        /**
         * Initialize the feedback display
         */
        initializeDisplay() {
            this.hideAllSections();
            this.updateAllTexts('Communication Feedback Ready');
        }
        /**
         * Setup auto-scrolling functionality
         */
        setupScrolling() {
            this.scrollUpdateEvent = this.createEvent("UpdateEvent");
            this.scrollUpdateEvent.bind(() => {
                this.updateScrollDisplay();
            });
            this.scrollUpdateEvent.enabled = false;
        }
        /**
         * Display communication feedback
         */
        displayFeedback(feedback) {
            this.currentFeedback = feedback;
            this.isDisplaying = true;
            this.scrollIndex = 0;
            this.showFeedbackBackground();
            if (this.enableAutoScroll) {
                this.startAutoScroll();
            }
            else {
                this.displayAllFeedback();
            }
            // Auto-hide after duration
            if (this.displayDuration > 0) {
                const hideEvent = this.createEvent("DelayedCallbackEvent");
                hideEvent.bind(() => {
                    this.hideFeedback();
                });
                hideEvent.reset(this.displayDuration);
            }
            print(`CommunicationFeedbackDisplay: Displaying feedback (Score: ${feedback.overallScore}/100)`);
        }
        /**
         * Display all feedback sections at once
         */
        displayAllFeedback() {
            if (!this.currentFeedback)
                return;
            const feedback = this.currentFeedback;
            // Overall score and summary
            this.updateScoreText(feedback);
            // Main feedback text
            this.updateFeedbackText(feedback);
            // Strengths
            this.updateStrengthsText(feedback);
            // Improvements
            this.updateImprovementsText(feedback);
            // Actionable advice
            this.updateAdviceText(feedback);
        }
        /**
         * Start auto-scroll through sections
         */
        startAutoScroll() {
            this.scrollUpdateEvent.enabled = true;
            this.updateScrollDisplay();
        }
        /**
         * Update scroll display (cycles through different sections)
         */
        updateScrollDisplay() {
            if (!this.currentFeedback || !this.enableAutoScroll) {
                this.scrollUpdateEvent.enabled = false;
                return;
            }
            const sections = [
                () => this.displayScoreSection(),
                () => this.displayStrengthsSection(),
                () => this.displayImprovementsSection(),
                () => this.displayAdviceSection(),
                () => this.displaySummarySection()
            ];
            // Display current section
            if (this.scrollIndex < sections.length) {
                sections[this.scrollIndex]();
            }
            // Move to next section after delay
            const nextSectionEvent = this.createEvent("DelayedCallbackEvent");
            nextSectionEvent.bind(() => {
                this.scrollIndex++;
                if (this.scrollIndex >= sections.length) {
                    this.scrollIndex = 0; // Loop back to start
                }
            });
            nextSectionEvent.reset(3.0); // 3 seconds per section
        }
        /**
         * Display score section
         */
        displayScoreSection() {
            this.hideAllSections();
            this.updateScoreText(this.currentFeedback);
            this.updateFeedbackText(this.currentFeedback, true); // Show summary only
        }
        /**
         * Display strengths section
         */
        displayStrengthsSection() {
            this.hideAllSections();
            this.updateStrengthsText(this.currentFeedback);
            if (this.feedbackText) {
                this.feedbackText.text = "💪 Your Strengths";
                this.feedbackText.enabled = true;
            }
        }
        /**
         * Display improvements section
         */
        displayImprovementsSection() {
            this.hideAllSections();
            this.updateImprovementsText(this.currentFeedback);
            if (this.feedbackText) {
                this.feedbackText.text = "📈 Areas to Improve";
                this.feedbackText.enabled = true;
            }
        }
        /**
         * Display advice section
         */
        displayAdviceSection() {
            this.hideAllSections();
            this.updateAdviceText(this.currentFeedback);
            if (this.feedbackText) {
                this.feedbackText.text = "💡 Action Steps";
                this.feedbackText.enabled = true;
            }
        }
        /**
         * Display summary section
         */
        displaySummarySection() {
            this.hideAllSections();
            if (this.feedbackText) {
                this.feedbackText.text = `📋 Summary\n\n${this.currentFeedback.summary}`;
                this.feedbackText.enabled = true;
            }
        }
        /**
         * Update score text
         */
        updateScoreText(feedback) {
            if (!this.scoreText)
                return;
            const score = feedback.overallScore;
            let emoji = "📊";
            let grade = "Good";
            if (score >= 90) {
                emoji = "🌟";
                grade = "Excellent";
            }
            else if (score >= 80) {
                emoji = "🎯";
                grade = "Great";
            }
            else if (score >= 70) {
                emoji = "👍";
                grade = "Good";
            }
            else if (score >= 60) {
                emoji = "📈";
                grade = "Fair";
            }
            else {
                emoji = "💪";
                grade = "Room to Grow";
            }
            this.scoreText.text = `${emoji} ${score}/100 - ${grade}`;
            this.scoreText.enabled = true;
        }
        /**
         * Update main feedback text
         */
        updateFeedbackText(feedback, summaryOnly = false) {
            if (!this.feedbackText)
                return;
            if (summaryOnly) {
                this.feedbackText.text = feedback.summary;
            }
            else {
                let feedbackContent = `📊 Communication Analysis\n\n`;
                feedbackContent += `${feedback.summary}\n\n`;
                // Add specific scores
                feedbackContent += `📈 Detailed Scores:\n`;
                feedbackContent += `• Pace: ${feedback.specificFeedback.pace.score}/100\n`;
                feedbackContent += `• Clarity: ${feedback.specificFeedback.clarity.score}/100\n`;
                feedbackContent += `• Vocabulary: ${feedback.specificFeedback.vocabulary.score}/100\n`;
                feedbackContent += `• Confidence: ${feedback.specificFeedback.confidence.score}/100\n`;
                if (feedback.specificFeedback.fillerWords.count > 0) {
                    feedbackContent += `• Filler Words: ${feedback.specificFeedback.fillerWords.count} (${feedback.specificFeedback.fillerWords.percentage.toFixed(1)}%)`;
                }
                this.feedbackText.text = feedbackContent;
            }
            this.feedbackText.enabled = true;
        }
        /**
         * Update strengths text
         */
        updateStrengthsText(feedback) {
            if (!this.strengthsText)
                return;
            let strengthsContent = `💪 Your Strengths:\n\n`;
            feedback.strengths.forEach((strength, index) => {
                strengthsContent += `• ${strength}\n`;
            });
            this.strengthsText.text = strengthsContent;
            this.strengthsText.enabled = true;
        }
        /**
         * Update improvements text
         */
        updateImprovementsText(feedback) {
            if (!this.improvementsText)
                return;
            let improvementsContent = `📈 Areas to Improve:\n\n`;
            feedback.improvements.forEach((improvement, index) => {
                improvementsContent += `• ${improvement}\n`;
            });
            this.improvementsText.text = improvementsContent;
            this.improvementsText.enabled = true;
        }
        /**
         * Update advice text
         */
        updateAdviceText(feedback) {
            if (!this.adviceText)
                return;
            let adviceContent = `💡 Action Steps:\n\n`;
            feedback.actionableAdvice.forEach((advice, index) => {
                adviceContent += `${index + 1}. ${advice}\n`;
            });
            this.adviceText.text = adviceContent;
            this.adviceText.enabled = true;
        }
        /**
         * Hide feedback display
         */
        hideFeedback() {
            this.isDisplaying = false;
            this.scrollUpdateEvent.enabled = false;
            this.hideAllSections();
            this.hideFeedbackBackground();
            print("CommunicationFeedbackDisplay: Feedback hidden");
        }
        /**
         * Show a quick score summary
         */
        showQuickSummary(feedback, duration = 5.0) {
            if (!this.feedbackText)
                return;
            const score = feedback.overallScore;
            const emoji = score >= 80 ? "🌟" : score >= 60 ? "👍" : "💪";
            this.feedbackText.text = `${emoji} Score: ${score}/100\n${feedback.summary}`;
            this.feedbackText.enabled = true;
            this.showFeedbackBackground();
            // Auto-hide
            const hideEvent = this.createEvent("DelayedCallbackEvent");
            hideEvent.bind(() => {
                this.hideFeedback();
            });
            hideEvent.reset(duration);
        }
        /**
         * Show only improvement tips
         */
        showImprovementTips(feedback) {
            this.hideAllSections();
            this.updateImprovementsText(feedback);
            this.updateAdviceText(feedback);
            this.showFeedbackBackground();
        }
        /**
         * Toggle auto-scroll mode
         */
        toggleAutoScroll(enabled) {
            this.enableAutoScroll = enabled;
            if (enabled && this.isDisplaying) {
                this.startAutoScroll();
            }
            else {
                this.scrollUpdateEvent.enabled = false;
                if (this.isDisplaying) {
                    this.displayAllFeedback();
                }
            }
        }
        /**
         * Hide all text sections
         */
        hideAllSections() {
            const textComponents = [this.feedbackText, this.scoreText, this.strengthsText, this.improvementsText, this.adviceText];
            textComponents.forEach(text => {
                if (text) {
                    text.enabled = false;
                }
            });
        }
        /**
         * Show feedback background
         */
        showFeedbackBackground() {
            if (this.feedbackBackground) {
                this.feedbackBackground.enabled = true;
            }
        }
        /**
         * Hide feedback background
         */
        hideFeedbackBackground() {
            if (this.feedbackBackground) {
                this.feedbackBackground.enabled = false;
            }
        }
        /**
         * Update all text components with the same message
         */
        updateAllTexts(message) {
            const textComponents = [this.feedbackText, this.scoreText, this.strengthsText, this.improvementsText, this.adviceText];
            textComponents.forEach(text => {
                if (text) {
                    text.text = message;
                    text.enabled = false;
                }
            });
        }
        /**
         * Check if feedback is currently being displayed
         */
        isDisplayingFeedback() {
            return this.isDisplaying;
        }
        /**
         * Get current feedback
         */
        getCurrentFeedback() {
            return this.currentFeedback;
        }
    };
    __setFunctionName(_classThis, "CommunicationFeedbackDisplay");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CommunicationFeedbackDisplay = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CommunicationFeedbackDisplay = _classThis;
})();
exports.CommunicationFeedbackDisplay = CommunicationFeedbackDisplay;
//# sourceMappingURL=CommunicationFeedbackDisplay.js.map