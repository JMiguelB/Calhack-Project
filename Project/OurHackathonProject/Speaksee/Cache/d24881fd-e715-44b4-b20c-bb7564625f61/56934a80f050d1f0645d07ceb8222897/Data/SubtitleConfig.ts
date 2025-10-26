/**
 * Simple configuration script for subtitle functionality
 * Automatically sets up API key and subtitle settings
 */

import { MicrophoneRecorder } from "./MicrophoneRecorder";

@component
export class SubtitleConfig extends BaseScriptComponent {
  @input
  microphoneRecorder: MicrophoneRecorder;

  @input
  @hint("Your OpenAI API key for subtitle generation")
  apiKey: string = "";

  @input
  @hint("Language for subtitle generation (e.g., 'en', 'es', 'fr')")
  language: string = "en";

  @input
  @hint("Enable subtitle generation")
  enableSubtitles: boolean = true;

  @input
  @allowUndefined
  statusText: Text;

  onAwake() {
    this.configureSubtitles();
  }

  private configureSubtitles() {
    if (!this.microphoneRecorder) {
      this.updateStatus("Error: MicrophoneRecorder not connected");
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

  private updateStatus(message: string) {
    if (this.statusText) {
      this.statusText.text = `Config: ${message}`;
    }
    print(`SubtitleConfig: ${message}`);
  }
}