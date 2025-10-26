/**
 * UI component for displaying generated subtitles
 * Shows subtitles with timing synchronization during playback
 */

import { SubtitleSegment } from "./SubtitleGenerator";

@component
export class SubtitleDisplay extends BaseScriptComponent {
  @input
  @allowUndefined
  subtitleText: Text;

  @input
  @allowUndefined
  subtitleBackground: Image;

  @input
  @hint("Maximum number of lines to display at once")
  maxLines: number = 2;

  @input
  @hint("Font size for subtitle text")
  fontSize: number = 24;

  @input
  @hint("Show subtitles with word highlighting")
  enableWordHighlight: boolean = false;

  private subtitles: SubtitleSegment[] = [];
  private currentPlaybackTime: number = 0;
  private isDisplaying: boolean = false;
  private currentSegmentIndex: number = -1;

  onAwake() {
    this.initializeDisplay();
  }

  /**
   * Initialize the subtitle display
   */
  private initializeDisplay() {
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
  private setTextStyle() {
    if (!this.subtitleText) return;

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
  loadSubtitles(subtitles: SubtitleSegment[]) {
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
  updatePlaybackTime(currentTime: number) {
    if (!this.isDisplaying || this.subtitles.length === 0) {
      return;
    }

    this.currentPlaybackTime = currentTime;
    this.updateCurrentSubtitle();
  }

  /**
   * Update the currently displayed subtitle based on playback time
   */
  private updateCurrentSubtitle() {
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
      } else {
        this.hideSubtitles();
      }
    }
  }

  /**
   * Display a subtitle text
   */
  private displaySubtitle(text: string) {
    if (!this.subtitleText) return;

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
  private formatSubtitleText(text: string): string {
    // Split long text into multiple lines if needed
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    const maxCharsPerLine = 40; // Adjust based on display requirements

    for (const word of words) {
      if (currentLine.length + word.length + 1 <= maxCharsPerLine) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
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
  private hideSubtitles() {
    if (this.subtitleText) {
      this.subtitleText.enabled = false;
      this.subtitleText.text = "";
    }
  }

  /**
   * Show subtitle background
   */
  private showSubtitleBackground() {
    if (this.subtitleBackground) {
      this.subtitleBackground.enabled = true;
    }
  }

  /**
   * Hide subtitle background
   */
  private hideSubtitleBackground() {
    if (this.subtitleBackground) {
      this.subtitleBackground.enabled = false;
    }
  }

  /**
   * Show a temporary message
   */
  showMessage(message: string, duration: number = 3.0) {
    if (!this.subtitleText) return;

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
  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Get current subtitle statistics
   */
  getSubtitleStats(): { count: number; totalDuration: number; averageLength: number } {
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
  hasSubtitles(): boolean {
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
}
