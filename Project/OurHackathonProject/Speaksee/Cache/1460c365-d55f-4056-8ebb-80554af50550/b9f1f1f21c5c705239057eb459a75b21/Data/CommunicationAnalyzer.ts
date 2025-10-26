/**
 * AI-powered communication skills analyzer
 * Analyzes voice recordings and provides feedback on speaking skills
 */

//@input Asset.InternetModule internetModule

export interface CommunicationFeedback {
  overallScore: number; // 0-100
  strengths: string[];
  improvements: string[];
  specificFeedback: {
    pace: { score: number; comment: string };
    clarity: { score: number; comment: string };
    vocabulary: { score: number; comment: string };
    confidence: { score: number; comment: string };
    fillerWords: { count: number; percentage: number; comment: string };
  };
  summary: string;
  actionableAdvice: string[];
}

export interface AnalysisConfig {
  apiKey: string;
  focusAreas?: string[]; // e.g., ["presentation", "interview", "conversation"]
  analysisType?: 'detailed' | 'quick' | 'focused';
  includePositiveFeedback?: boolean;
}

@component
export class CommunicationAnalyzer extends BaseScriptComponent {
  @input
  @allowUndefined
  internetModule: InternetModule;

  @input
  @allowUndefined
  debugText: Text;

  private config: AnalysisConfig = {
    apiKey: '',
    focusAreas: ['general'],
    analysisType: 'detailed',
    includePositiveFeedback: true
  };

  private isAnalyzing: boolean = false;
  private lastAnalysis: CommunicationFeedback | null = null;

  onAwake() {
    this.updateDebugText('Communication Analyzer Ready');
  }

  /**
   * Configure the analyzer
   */
  configure(config: Partial<AnalysisConfig>) {
    this.config = { ...this.config, ...config };
    this.updateDebugText('Communication Analyzer Configured');
  }

  /**
   * Analyze communication skills from transcribed text
   */
  async analyzeCommunication(transcriptText: string, recordingDuration: number): Promise<CommunicationFeedback> {
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
    } catch (error) {
      this.updateDebugText(`Analysis error: ${error.message}`);
      return this.getDefaultFeedback();
    } finally {
      this.isAnalyzing = false;
    }
  }

  /**
   * Call AI API for communication analysis (Claude AI or OpenAI)
   */
  private async callAnalysisAPI(transcript: string, duration: number): Promise<CommunicationFeedback> {
    if (isNull(this.internetModule)) {
      throw new Error('InternetModule not configured - please connect an Internet Module');
    }

    if (this.config.apiProvider === 'claude') {
      return this.callClaudeAPI(transcript, duration);
    } else {
      return this.callOpenAIAPI(transcript, duration);
    }
  }

  /**
   * Call Claude AI API for communication analysis
   */
  private async callClaudeAPI(transcript: string, duration: number): Promise<CommunicationFeedback> {
    const analysisPrompt = this.buildAnalysisPrompt(transcript, duration);

    const request = new Request('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.config.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.config.model || 'claude-3-sonnet-20240229',
        max_tokens: 1500,
        system: 'You are an expert communication coach who provides constructive, specific, and actionable feedback on speaking skills. Always be encouraging while offering concrete improvement suggestions.',
        messages: [
          {
            role: 'user',
            content: analysisPrompt
          }
        ]
      })
    });

    const response = await this.internetModule.fetch(request);

    if (!response.ok) {
      throw new Error(`Claude API request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.content || result.content.length === 0) {
      throw new Error('No analysis results received from Claude');
    }

    return this.parseAnalysisResponse(result.content[0].text);
  }

  /**
   * Call OpenAI API for communication analysis (fallback)
   */
  private async callOpenAIAPI(transcript: string, duration: number): Promise<CommunicationFeedback> {
    const analysisPrompt = this.buildAnalysisPrompt(transcript, duration);

    const request = new Request('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.config.model || 'gpt-4',
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
      throw new Error(`OpenAI API request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.choices || result.choices.length === 0) {
      throw new Error('No analysis results received from OpenAI');
    }

    return this.parseAnalysisResponse(result.choices[0].message.content);
  }

  /**
   * Build the analysis prompt for OpenAI
   */
  private buildAnalysisPrompt(transcript: string, duration: number): string {
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
  private parseAnalysisResponse(responseText: string): CommunicationFeedback {
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return this.validateAndNormalizeFeedback(parsed);
      }
    } catch (error) {
      print(`Failed to parse analysis response: ${error.message}`);
    }

    // Fallback: create feedback from text analysis
    return this.createFallbackFeedback(responseText);
  }

  /**
   * Validate and normalize the feedback structure
   */
  private validateAndNormalizeFeedback(feedback: any): CommunicationFeedback {
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
  private createFallbackFeedback(responseText: string): CommunicationFeedback {
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
  private calculateWPM(text: string, durationSeconds: number): number {
    const words = text.trim().split(/\s+/).length;
    const minutes = durationSeconds / 60;
    return Math.round(words / minutes);
  }

  /**
   * Get default feedback when analysis fails
   */
  private getDefaultFeedback(): CommunicationFeedback {
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
  async quickAnalyze(transcript: string, duration: number): Promise<string> {
    const wpm = this.calculateWPM(transcript, duration);
    const wordCount = transcript.trim().split(/\s+/).length;
    
    let quickFeedback = `📊 Quick Analysis:\n`;
    quickFeedback += `• Duration: ${duration.toFixed(1)}s\n`;
    quickFeedback += `• Words: ${wordCount}\n`;
    quickFeedback += `• Pace: ${wpm} WPM\n`;
    
    if (wpm < 120) {
      quickFeedback += `• Tip: Try speaking a bit faster\n`;
    } else if (wpm > 180) {
      quickFeedback += `• Tip: Slow down for better clarity\n`;
    } else {
      quickFeedback += `• Tip: Good speaking pace!\n`;
    }

    return quickFeedback;
  }

  /**
   * Get the last analysis results
   */
  getLastAnalysis(): CommunicationFeedback | null {
    return this.lastAnalysis;
  }

  /**
   * Check if analysis is in progress
   */
  isAnalysisInProgress(): boolean {
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
  private updateDebugText(message: string) {
    if (!isNull(this.debugText)) {
      this.debugText.text = `Analyzer: ${message}`;
    }
    print(`CommunicationAnalyzer: ${message}`);
  }
}
