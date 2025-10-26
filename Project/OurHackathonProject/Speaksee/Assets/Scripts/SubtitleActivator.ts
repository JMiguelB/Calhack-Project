/**
 * UI helper for subtitle-related interactions
 * Provides buttons for subtitle display, export, and configuration
 */

import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { MicrophoneRecorder } from "./MicrophoneRecorder";
import { SubtitleConfig } from "./SubtitleConfig";

@component
export class SubtitleActivator extends BaseScriptComponent {
  @input
  @allowUndefined
  microphoneRecorder: MicrophoneRecorder;

  @input
  @allowUndefined
  subtitleConfig: SubtitleConfig;

  @input
  @hint("Action type: 'display', 'export', 'toggle', 'configure'")
  actionType: string = "display";

  @input
  @allowUndefined
  debugText: Text;

  private interactable: Interactable;

  onAwake() {
    this.interactable = this.sceneObject.getComponent(
      Interactable.getTypeName()
    );

    if (this.interactable) {
      this.interactable.onTriggerStart.add(() => {
        this.performAction();
      });
    }
  }

  /**
   * Perform the configured action
   */
  private performAction() {
    switch (this.actionType.toLowerCase()) {
      case "display":
        this.displayAllSubtitles();
        break;
      case "export":
        this.exportSubtitles();
        break;
      case "toggle":
        this.toggleSubtitleGeneration();
        break;
      case "configure":
        this.showConfiguration();
        break;
      default:
        this.updateDebugText(`Unknown action: ${this.actionType}`);
    }
  }

  /**
   * Display all generated subtitles
   */
  private displayAllSubtitles() {
    if (isNull(this.microphoneRecorder)) {
      this.updateDebugText("No MicrophoneRecorder assigned");
      return;
    }

    if (!this.microphoneRecorder.hasSubtitles()) {
      this.updateDebugText("No subtitles available");
      return;
    }

    // Get subtitle display component from the recorder
    const subtitleDisplay = this.microphoneRecorder.subtitleDisplay;
    if (!isNull(subtitleDisplay)) {
      subtitleDisplay.displayAllSubtitles();
      this.updateDebugText("Displaying all subtitles");
    } else {
      this.updateDebugText("No subtitle display component found");
    }
  }

  /**
   * Export subtitles to SRT format
   */
  private exportSubtitles() {
    if (isNull(this.microphoneRecorder)) {
      this.updateDebugText("No MicrophoneRecorder assigned");
      return;
    }

    if (!this.microphoneRecorder.hasSubtitles()) {
      this.updateDebugText("No subtitles to export");
      return;
    }

    const srtContent = this.microphoneRecorder.exportSubtitlesToSRT();
    if (srtContent && srtContent.length > 0) {
      // In a real implementation, you might save this to a file
      // For now, we'll just log it
      print("Exported SRT Content:");
      print(srtContent);
      this.updateDebugText("Subtitles exported to console");
    } else {
      this.updateDebugText("Failed to export subtitles");
    }
  }

  /**
   * Toggle subtitle generation on/off
   */
  private toggleSubtitleGeneration() {
    if (!isNull(this.subtitleConfig)) {
      const currentState = this.subtitleConfig.enableSubtitlesByDefault;
      this.subtitleConfig.toggleSubtitles(!currentState);
      this.updateDebugText(`Subtitles ${!currentState ? 'enabled' : 'disabled'}`);
    } else if (!isNull(this.microphoneRecorder)) {
      // Fallback to direct control if no config component
      this.microphoneRecorder.toggleSubtitleGeneration(true);
      this.updateDebugText("Subtitle generation enabled");
    } else {
      this.updateDebugText("No subtitle components found");
    }
  }

  /**
   * Show configuration information
   */
  private showConfiguration() {
    if (!isNull(this.subtitleConfig)) {
      const summary = this.subtitleConfig.getConfigSummary();
      this.updateDebugText(`Config: ${summary}`);
    } else {
      this.updateDebugText("No configuration component found");
    }
  }

  /**
   * Set up subtitle system with API key
   */
  setupSubtitles(apiKey: string, language: string = "en") {
    if (!isNull(this.subtitleConfig)) {
      this.subtitleConfig.setApiKey(apiKey);
      this.subtitleConfig.setLanguage(language);
      this.updateDebugText("Subtitle system configured");
    } else {
      this.updateDebugText("No configuration component available");
    }
  }

  /**
   * Get subtitle statistics
   */
  getSubtitleStats(): string {
    if (isNull(this.microphoneRecorder)) {
      return "No recorder available";
    }

    const subtitleDisplay = this.microphoneRecorder.subtitleDisplay;
    if (isNull(subtitleDisplay)) {
      return "No display component";
    }

    if (!subtitleDisplay.hasSubtitles()) {
      return "No subtitles generated";
    }

    const stats = subtitleDisplay.getSubtitleStats();
    return `Segments: ${stats.count}, Duration: ${stats.totalDuration.toFixed(1)}s, Avg Length: ${stats.averageLength} chars`;
  }

  /**
   * Update debug text if available
   */
  private updateDebugText(message: string) {
    if (!isNull(this.debugText)) {
      this.debugText.text = `Subtitle Action: ${message}`;
    }
    print(`SubtitleActivator: ${message}`);
  }
}
