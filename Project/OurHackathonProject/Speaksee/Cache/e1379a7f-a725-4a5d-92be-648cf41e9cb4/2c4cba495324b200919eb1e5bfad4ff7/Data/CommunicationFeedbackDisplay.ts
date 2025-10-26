/**
 * UI component for displaying communication skills feedback
 * Shows analysis results in a user-friendly format
 */

import { CommunicationFeedback } from "./CommunicationAnalyzer";

@component
export class CommunicationFeedbackDisplay extends BaseScriptComponent {
  @input
  @allowUndefined
  feedbackText: Text;

  @input
  @allowUndefined
  scoreText: Text;

  @input
  @allowUndefined
  strengthsText: Text;

  @input
  @allowUndefined
  improvementsText: Text;

  @input
  @allowUndefined
  adviceText: Text;

  @input
  @allowUndefined
  feedbackBackground: Image;

  @input
  @hint("Display duration in seconds (0 = permanent)")
  displayDuration: number = 15.0;

  @input
  @hint("Auto-scroll through different sections")
  enableAutoScroll: boolean = false;

  private currentFeedback: CommunicationFeedback | null = null;
  private isDisplaying: boolean = false;
  private scrollIndex: number = 0;
  private scrollUpdateEvent: UpdateEvent;

  onAwake() {
    this.initializeDisplay();
    this.setupScrolling();
  }

  /**
   * Initialize the feedback display
   */
  private initializeDisplay() {
    this.hideAllSections();
    this.updateAllTexts('Communication Feedback Ready');
  }

  /**
   * Setup auto-scrolling functionality
   */
  private setupScrolling() {
    this.scrollUpdateEvent = this.createEvent("UpdateEvent");
    this.scrollUpdateEvent.bind(() => {
      this.updateScrollDisplay();
    });
    this.scrollUpdateEvent.enabled = false;
  }

  /**
   * Display communication feedback
   */
  displayFeedback(feedback: CommunicationFeedback) {
    this.currentFeedback = feedback;
    this.isDisplaying = true;
    this.scrollIndex = 0;

    this.showFeedbackBackground();
    
    if (this.enableAutoScroll) {
      this.startAutoScroll();
    } else {
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
  private displayAllFeedback() {
    if (!this.currentFeedback) return;

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
  private startAutoScroll() {
    this.scrollUpdateEvent.enabled = true;
    this.updateScrollDisplay();
  }

  /**
   * Update scroll display (cycles through different sections)
   */
  private updateScrollDisplay() {
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
  private displayScoreSection() {
    this.hideAllSections();
    this.updateScoreText(this.currentFeedback!);
    this.updateFeedbackText(this.currentFeedback!, true); // Show summary only
  }

  /**
   * Display strengths section
   */
  private displayStrengthsSection() {
    this.hideAllSections();
    this.updateStrengthsText(this.currentFeedback!);
    if (this.feedbackText) {
      this.feedbackText.text = "💪 Your Strengths";
      this.feedbackText.enabled = true;
    }
  }

  /**
   * Display improvements section
   */
  private displayImprovementsSection() {
    this.hideAllSections();
    this.updateImprovementsText(this.currentFeedback!);
    if (this.feedbackText) {
      this.feedbackText.text = "📈 Areas to Improve";
      this.feedbackText.enabled = true;
    }
  }

  /**
   * Display advice section
   */
  private displayAdviceSection() {
    this.hideAllSections();
    this.updateAdviceText(this.currentFeedback!);
    if (this.feedbackText) {
      this.feedbackText.text = "💡 Action Steps";
      this.feedbackText.enabled = true;
    }
  }

  /**
   * Display summary section
   */
  private displaySummarySection() {
    this.hideAllSections();
    if (this.feedbackText) {
      this.feedbackText.text = `📋 Summary\n\n${this.currentFeedback!.summary}`;
      this.feedbackText.enabled = true;
    }
  }

  /**
   * Update score text
   */
  private updateScoreText(feedback: CommunicationFeedback) {
    if (!this.scoreText) return;

    const score = feedback.overallScore;
    let emoji = "📊";
    let grade = "Good";

    if (score >= 90) {
      emoji = "🌟";
      grade = "Excellent";
    } else if (score >= 80) {
      emoji = "🎯";
      grade = "Great";
    } else if (score >= 70) {
      emoji = "👍";
      grade = "Good";
    } else if (score >= 60) {
      emoji = "📈";
      grade = "Fair";
    } else {
      emoji = "💪";
      grade = "Room to Grow";
    }

    this.scoreText.text = `${emoji} ${score}/100 - ${grade}`;
    this.scoreText.enabled = true;
  }

  /**
   * Update main feedback text
   */
  private updateFeedbackText(feedback: CommunicationFeedback, summaryOnly: boolean = false) {
    if (!this.feedbackText) return;

    if (summaryOnly) {
      this.feedbackText.text = feedback.summary;
    } else {
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
  private updateStrengthsText(feedback: CommunicationFeedback) {
    if (!this.strengthsText) return;

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
  private updateImprovementsText(feedback: CommunicationFeedback) {
    if (!this.improvementsText) return;

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
  private updateAdviceText(feedback: CommunicationFeedback) {
    if (!this.adviceText) return;

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
  showQuickSummary(feedback: CommunicationFeedback, duration: number = 5.0) {
    if (!this.feedbackText) return;

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
  showImprovementTips(feedback: CommunicationFeedback) {
    this.hideAllSections();
    this.updateImprovementsText(feedback);
    this.updateAdviceText(feedback);
    this.showFeedbackBackground();
  }

  /**
   * Toggle auto-scroll mode
   */
  toggleAutoScroll(enabled: boolean) {
    this.enableAutoScroll = enabled;
    if (enabled && this.isDisplaying) {
      this.startAutoScroll();
    } else {
      this.scrollUpdateEvent.enabled = false;
      if (this.isDisplaying) {
        this.displayAllFeedback();
      }
    }
  }

  /**
   * Hide all text sections
   */
  private hideAllSections() {
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
  private showFeedbackBackground() {
    if (this.feedbackBackground) {
      this.feedbackBackground.enabled = true;
    }
  }

  /**
   * Hide feedback background
   */
  private hideFeedbackBackground() {
    if (this.feedbackBackground) {
      this.feedbackBackground.enabled = false;
    }
  }

  /**
   * Update all text components with the same message
   */
  private updateAllTexts(message: string) {
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
  isDisplayingFeedback(): boolean {
    return this.isDisplaying;
  }

  /**
   * Get current feedback
   */
  getCurrentFeedback(): CommunicationFeedback | null {
    return this.currentFeedback;
  }
}
