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
exports.CommunicationAnalyzer = void 0;
var __selfType = requireType("./CommunicationAnalyzer");
function component(target) { target.getTypeName = function () { return __selfType; }; }
let CommunicationAnalyzer = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var CommunicationAnalyzer = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.internetModule = this.internetModule;
            this.debugText = this.debugText;
            this.config = {
                apiKey: '',
                apiProvider: 'claude',
                model: 'claude-3-sonnet-20240229',
                focusAreas: ['general'],
                analysisType: 'detailed',
                includePositiveFeedback: true
            };
            this.isAnalyzing = false;
            this.lastAnalysis = null;
        }
        __initialize() {
            super.__initialize();
            this.internetModule = this.internetModule;
            this.debugText = this.debugText;
            this.config = {
                apiKey: '',
                apiProvider: 'claude',
                model: 'claude-3-sonnet-20240229',
                focusAreas: ['general'],
                analysisType: 'detailed',
                includePositiveFeedback: true
            };
            this.isAnalyzing = false;
            this.lastAnalysis = null;
        }
        onAwake() {
            this.updateDebugText('Communication Analyzer Ready');
        }
        /**
         * Configure the analyzer
         */
        configure(config) {
            this.config = { ...this.config, ...config };
            this.updateDebugText('Communication Analyzer Configured');
        }
        /**
         * Analyze communication skills from transcribed text
         */
        async analyzeCommunication(transcriptText, recordingDuration) {
            if (this.isAnalyzing) {
                this.updateDebugText('Analysis already in progress...');
                return this.lastAnalysis || this.getDefaultFeedback();
            }
            if (!this.config.apiKey) {
                this.updateDebugText('Error: API key not configured');
                return this.getDefaultFeedback();
            }
            if (!transcriptText || transcriptText.trim().length === 0) {
                this.updateDebugText('Error: No transcript provided for analysis');
                return this.getDefaultFeedback();
            }
            try {
                this.isAnalyzing = true;
                this.updateDebugText('Analyzing communication skills...');
                const feedback = await this.callAnalysisAPI(transcriptText, recordingDuration);
                this.lastAnalysis = feedback;
                this.updateDebugText(`Analysis complete - Score: ${feedback.overallScore}/100`);
                return feedback;
            }
            catch (error) {
                this.updateDebugText(`Analysis error: ${error.message}`);
                return this.getDefaultFeedback();
            }
            finally {
                this.isAnalyzing = false;
            }
        }
        /**
         * Call OpenAI API for communication analysis
         */
        async callAnalysisAPI(transcript, duration) {
            if (isNull(this.internetModule)) {
                throw new Error('InternetModule not configured - please connect an Internet Module');
            }
            const analysisPrompt = this.buildAnalysisPrompt(transcript, duration);
            const request = new Request('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert communication coach who provides constructive, specific, and actionable feedback on speaking skills. Always be encouraging while offering concrete improvement suggestions.'
                        },
                        {
                            role: 'user',
                            content: analysisPrompt
                        }
                    ],
                    max_tokens: 1500,
                    temperature: 0.7
                })
            });
            const response = await this.internetModule.fetch(request);
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }
            const result = await response.json();
            if (!result.choices || result.choices.length === 0) {
                throw new Error('No analysis results received');
            }
            return this.parseAnalysisResponse(result.choices[0].message.content);
        }
        /**
         * Build the analysis prompt for OpenAI
         */
        buildAnalysisPrompt(transcript, duration) {
            const wordsPerMinute = this.calculateWPM(transcript, duration);
            const focusContext = this.config.focusAreas?.join(', ') || 'general communication';
            return `Please analyze this speech transcript for communication skills. Focus on: ${focusContext}

TRANSCRIPT (${duration.toFixed(1)} seconds, ~${wordsPerMinute} WPM):
"${transcript}"

Please provide analysis in this JSON format:
{
  "overallScore": 85,
  "strengths": ["Clear articulation", "Good pacing"],
  "improvements": ["Reduce filler words", "Vary sentence length"],
  "specificFeedback": {
    "pace": {"score": 80, "comment": "Good speaking pace, well-controlled"},
    "clarity": {"score": 90, "comment": "Very clear pronunciation and articulation"},
    "vocabulary": {"score": 75, "comment": "Good vocabulary, could use more varied expressions"},
    "confidence": {"score": 85, "comment": "Sounds confident and assured"},
    "fillerWords": {"count": 3, "percentage": 2.1, "comment": "Minimal use of filler words"}
  },
  "summary": "Strong overall communication with clear delivery. Focus on reducing hesitations for even better flow.",
  "actionableAdvice": [
    "Practice speaking without 'um' and 'uh' by pausing instead",
    "Try varying your sentence structure for more engaging delivery",
    "Keep up the clear articulation - it's excellent"
  ]
}

Key evaluation criteria:
- Speaking pace (ideal: 150-160 WPM for presentations, 120-150 for conversations)
- Filler words (um, uh, like, you know, etc.)
- Vocabulary richness and appropriateness
- Sentence structure and flow
- Confidence indicators in speech patterns
- Clarity and articulation

Be encouraging but specific. Focus on 2-3 key improvement areas.`;
        }
        /**
         * Parse the API response into structured feedback
         */
        parseAnalysisResponse(responseText) {
            try {
                // Try to extract JSON from the response
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    return this.validateAndNormalizeFeedback(parsed);
                }
            }
            catch (error) {
                print(`Failed to parse analysis response: ${error.message}`);
            }
            // Fallback: create feedback from text analysis
            return this.createFallbackFeedback(responseText);
        }
        /**
         * Validate and normalize the feedback structure
         */
        validateAndNormalizeFeedback(feedback) {
            return {
                overallScore: Math.max(0, Math.min(100, feedback.overallScore || 70)),
                strengths: Array.isArray(feedback.strengths) ? feedback.strengths : ['Good effort in recording'],
                improvements: Array.isArray(feedback.improvements) ? feedback.improvements : ['Continue practicing'],
                specificFeedback: {
                    pace: feedback.specificFeedback?.pace || { score: 70, comment: 'Reasonable speaking pace' },
                    clarity: feedback.specificFeedback?.clarity || { score: 75, comment: 'Generally clear speech' },
                    vocabulary: feedback.specificFeedback?.vocabulary || { score: 70, comment: 'Appropriate vocabulary use' },
                    confidence: feedback.specificFeedback?.confidence || { score: 70, comment: 'Shows confidence' },
                    fillerWords: feedback.specificFeedback?.fillerWords || { count: 0, percentage: 0, comment: 'Filler word usage not detected' }
                },
                summary: feedback.summary || 'Analysis completed successfully',
                actionableAdvice: Array.isArray(feedback.actionableAdvice) ? feedback.actionableAdvice : ['Keep practicing your speaking skills']
            };
        }
        /**
         * Create fallback feedback when parsing fails
         */
        createFallbackFeedback(responseText) {
            return {
                overallScore: 75,
                strengths: ['Completed recording successfully', 'Attempted communication analysis'],
                improvements: ['Analysis parsing incomplete', 'Try recording again for better feedback'],
                specificFeedback: {
                    pace: { score: 75, comment: 'Unable to analyze pace automatically' },
                    clarity: { score: 75, comment: 'Unable to analyze clarity automatically' },
                    vocabulary: { score: 75, comment: 'Unable to analyze vocabulary automatically' },
                    confidence: { score: 75, comment: 'Unable to analyze confidence automatically' },
                    fillerWords: { count: 0, percentage: 0, comment: 'Unable to count filler words automatically' }
                },
                summary: 'Analysis completed with limited results. Try recording again.',
                actionableAdvice: ['Ensure clear speech', 'Speak at moderate pace', 'Record in quiet environment']
            };
        }
        /**
         * Calculate words per minute
         */
        calculateWPM(text, durationSeconds) {
            const words = text.trim().split(/\s+/).length;
            const minutes = durationSeconds / 60;
            return Math.round(words / minutes);
        }
        /**
         * Get default feedback when analysis fails
         */
        getDefaultFeedback() {
            return {
                overallScore: 50,
                strengths: ['Made an attempt to record'],
                improvements: ['Ensure proper setup', 'Check API configuration'],
                specificFeedback: {
                    pace: { score: 50, comment: 'Analysis unavailable' },
                    clarity: { score: 50, comment: 'Analysis unavailable' },
                    vocabulary: { score: 50, comment: 'Analysis unavailable' },
                    confidence: { score: 50, comment: 'Analysis unavailable' },
                    fillerWords: { count: 0, percentage: 0, comment: 'Analysis unavailable' }
                },
                summary: 'Analysis could not be completed. Please check configuration.',
                actionableAdvice: ['Check API key configuration', 'Ensure internet connection', 'Try recording again']
            };
        }
        /**
         * Quick analysis for shorter recordings
         */
        async quickAnalyze(transcript, duration) {
            const wpm = this.calculateWPM(transcript, duration);
            const wordCount = transcript.trim().split(/\s+/).length;
            let quickFeedback = `📊 Quick Analysis:\n`;
            quickFeedback += `• Duration: ${duration.toFixed(1)}s\n`;
            quickFeedback += `• Words: ${wordCount}\n`;
            quickFeedback += `• Pace: ${wpm} WPM\n`;
            if (wpm < 120) {
                quickFeedback += `• Tip: Try speaking a bit faster\n`;
            }
            else if (wpm > 180) {
                quickFeedback += `• Tip: Slow down for better clarity\n`;
            }
            else {
                quickFeedback += `• Tip: Good speaking pace!\n`;
            }
            return quickFeedback;
        }
        /**
         * Get the last analysis results
         */
        getLastAnalysis() {
            return this.lastAnalysis;
        }
        /**
         * Check if analysis is in progress
         */
        isAnalysisInProgress() {
            return this.isAnalyzing;
        }
        /**
         * Clear analysis history
         */
        clearAnalysis() {
            this.lastAnalysis = null;
            this.updateDebugText('Analysis history cleared');
        }
        /**
         * Update debug text if available
         */
        updateDebugText(message) {
            if (!isNull(this.debugText)) {
                this.debugText.text = `Analyzer: ${message}`;
            }
            print(`CommunicationAnalyzer: ${message}`);
        }
    };
    __setFunctionName(_classThis, "CommunicationAnalyzer");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CommunicationAnalyzer = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CommunicationAnalyzer = _classThis;
})();
exports.CommunicationAnalyzer = CommunicationAnalyzer;
//# sourceMappingURL=CommunicationAnalyzer.js.map