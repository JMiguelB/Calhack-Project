/**
 * Simple subtitle test script for basic functionality
 * Shows test subtitles without needing API integration
 */

import { SubtitleDisplay } from "./SubtitleDisplay";
import { SubtitleSegment } from "./SubtitleGenerator";

@component
export class SimpleSubtitleTest extends BaseScriptComponent {
  @input
  @allowUndefined
  subtitleDisplay: SubtitleDisplay;

  @input
  @allowUndefined
  testText: Text;

  @input
  @hint("Show test subtitles on start")
  showTestOnStart: boolean = false;

  private testSubtitles: SubtitleSegment[] = [
    { text: "Hello! This is a test subtitle.", startTime: 0, endTime: 3 },
    { text: "These subtitles demonstrate the display system.", startTime: 3, endTime: 6 },
    { text: "You can customize the text and timing.", startTime: 6, endTime: 9 },
    { text: "Perfect for testing your subtitle setup!", startTime: 9, endTime: 12 }
  ];

  private currentTestTime: number = 0;
  private isTestRunning: boolean = false;
  private testUpdateEvent: UpdateEvent;

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
  private updateTestSubtitles() {
    if (!this.isTestRunning) return;

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
  showTestMessage(message: string, duration: number = 5.0) {
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
  createCustomTest(texts: string[], duration: number = 3.0) {
    const customSubtitles: SubtitleSegment[] = [];
    
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
  isTestActive(): boolean {
    return this.isTestRunning;
  }

  private updateStatus(message: string) {
    if (this.testText) {
      this.testText.text = `Test: ${message}`;
    }
    print(`SimpleSubtitleTest: ${message}`);
  }
}
