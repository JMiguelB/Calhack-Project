/**
 * Simple configuration script for subtitle functionality
 * Automatically sets up API key and subtitle settings
 */

import { MicrophoneRecorder } from "./MicrophoneRecorder";

@component
export class SubtitleConfig extends BaseScriptComponent {
  @input
  @allowUndefined
  microphoneRecorder: MicrophoneRecorder;

  @input
  @hint("Your OpenAI API key for subtitle generation")
  apiKey: string = "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";

  @input
  @hint("Language for subtitle generation (e.g., 'en', 'es', 'fr')")
  language: string = "en";

  @input
  @hint("Enable subtitle generation")
  enableSubtitles: boolean = true;

  // Alias for backward compatibility
  get enableSubtitlesByDefault(): boolean {
    return this.enableSubtitles;
  }

  @input
  @allowUndefined
  statusText: Text;

  onAwake() {
    this.configureSubtitles();
  }

  private configureSubtitles() {
    if (isNull(this.microphoneRecorder)) {
      this.updateStatus("Warning: MicrophoneRecorder not connected");
      print("SubtitleConfig: Warning - MicrophoneRecorder not connected, configuration stored for later use");
      return;
    }

    // Configure subtitle settings
    this.microphoneRecorder.toggleSubtitleGeneration(this.enableSubtitles);

    if (this.enableSubtitles && this.apiKey && this.apiKey.trim() !== "") {
      // Configure with API key
      this.microphoneRecorder.configureSubtitleGeneration(this.apiKey, this.language);
      this.updateStatus(`Subtitles configured for language: ${this.language}`);
      print("SubtitleConfig: Subtitle generation configured successfully");
    } else if (this.enableSubtitles) {
      this.updateStatus("Warning: API key needed for subtitle generation");
      print("SubtitleConfig: Warning - API key not provided");
    } else {
      this.updateStatus("Subtitles disabled");
      print("SubtitleConfig: Subtitle generation disabled");
    }
  }

  // Call this method to update API key at runtime
  updateApiKey(newApiKey: string) {
    this.apiKey = newApiKey;
    this.configureSubtitles();
  }

  // Alias methods for backward compatibility with SubtitleActivator
  setApiKey(newApiKey: string) {
    this.updateApiKey(newApiKey);
  }

  setLanguage(newLanguage: string) {
    this.updateLanguage(newLanguage);
  }

  // Call this to change language
  updateLanguage(newLanguage: string) {
    this.language = newLanguage;
    this.configureSubtitles();
  }

  // Toggle subtitle functionality
  toggleSubtitles(enabled: boolean) {
    this.enableSubtitles = enabled;
    this.configureSubtitles();
  }

  // Get configuration summary for display
  getConfigSummary(): string {
    if (this.enableSubtitles) {
      const hasApiKey = this.apiKey && this.apiKey.trim() !== "";
      const hasRecorder = !isNull(this.microphoneRecorder);
      return `Enabled, Lang: ${this.language}, API: ${hasApiKey ? 'Set' : 'Missing'}, Recorder: ${hasRecorder ? 'Connected' : 'Missing'}`;
    } else {
      return "Disabled";
    }
  }

  // Connect MicrophoneRecorder after component creation
  connectMicrophoneRecorder(recorder: MicrophoneRecorder) {
    this.microphoneRecorder = recorder;
    this.configureSubtitles();
    this.updateStatus("MicrophoneRecorder connected and configured");
  }

  private updateStatus(message: string) {
    if (this.statusText) {
      this.statusText.text = `Config: ${message}`;
    }
    print(`SubtitleConfig: ${message}`);
  }
}