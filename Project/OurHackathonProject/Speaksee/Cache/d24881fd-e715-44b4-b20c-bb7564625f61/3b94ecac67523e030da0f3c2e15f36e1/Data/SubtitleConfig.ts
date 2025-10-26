/**
 * Configuration manager for AI subtitle generation
 * Handles API keys, language settings, and subtitle preferences
 */

import { MicrophoneRecorder } from "./MicrophoneRecorder";

@component
export class SubtitleConfig extends BaseScriptComponent {
  @input
  @hint("OpenAI API Key for Whisper")
  openAIApiKey: string = "";

  @input  
  @hint("Language for subtitle generation (e.g., 'en', 'es', 'fr')")
  language: string = "en";

  @input
  @hint("AI Model to use for transcription")
  aiModel: string = "whisper-1";

  @input
  @hint("Response format from AI service")
  responseFormat: string = "verbose_json";

  @input
  @hint("Enable subtitle generation by default")
  enableSubtitlesByDefault: boolean = true;

  @input
  @allowUndefined
  microphoneRecorder: MicrophoneRecorder;

  @input
  @allowUndefined
  debugText: Text;

  onAwake() {
    this.initializeConfiguration();
  }

  /**
   * Initialize subtitle configuration
   */
  private initializeConfiguration() {
    if (!isNull(this.microphoneRecorder)) {
      // Configure the microphone recorder with subtitle settings
      this.applyConfiguration();
    }

    this.updateDebugText("Subtitle configuration ready");
  }

  /**
   * Apply current configuration to the microphone recorder
   */
  applyConfiguration() {
    if (isNull(this.microphoneRecorder)) {
      this.updateDebugText("Error: No MicrophoneRecorder assigned");
      return;
    }

    if (!this.openAIApiKey || this.openAIApiKey.trim() === "") {
      this.updateDebugText("Warning: No API key configured");
      return;
    }

    // Configure subtitle generation
    this.microphoneRecorder.configureSubtitleGeneration(
      this.openAIApiKey,
      this.language
    );

    // Enable/disable subtitle generation
    this.microphoneRecorder.toggleSubtitleGeneration(this.enableSubtitlesByDefault);

    this.updateDebugText("Configuration applied successfully");
  }

  /**
   * Update API key and reconfigure
   */
  setApiKey(apiKey: string) {
    this.openAIApiKey = apiKey;
    this.applyConfiguration();
    this.updateDebugText(`API key updated: ${apiKey.substring(0, 8)}...`);
  }

  /**
   * Update language setting
   */
  setLanguage(language: string) {
    this.language = language;
    this.applyConfiguration();
    this.updateDebugText(`Language set to: ${language}`);
  }

  /**
   * Toggle subtitle generation
   */
  toggleSubtitles(enabled: boolean) {
    this.enableSubtitlesByDefault = enabled;
    if (!isNull(this.microphoneRecorder)) {
      this.microphoneRecorder.toggleSubtitleGeneration(enabled);
    }
    this.updateDebugText(`Subtitles ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Validate current configuration
   */
  validateConfiguration(): boolean {
    if (!this.openAIApiKey || this.openAIApiKey.trim() === "") {
      this.updateDebugText("Error: API key required");
      return false;
    }

    if (!this.language || this.language.trim() === "") {
      this.updateDebugText("Error: Language required");
      return false;
    }

    if (isNull(this.microphoneRecorder)) {
      this.updateDebugText("Error: MicrophoneRecorder required");
      return false;
    }

    return true;
  }

  /**
   * Get configuration summary
   */
  getConfigSummary(): string {
    return `Language: ${this.language}, Model: ${this.aiModel}, Subtitles: ${this.enableSubtitlesByDefault ? 'ON' : 'OFF'}`;
  }

  /**
   * Reset to default configuration
   */
  resetToDefaults() {
    this.language = "en";
    this.aiModel = "whisper-1";
    this.responseFormat = "verbose_json";
    this.enableSubtitlesByDefault = true;
    
    this.applyConfiguration();
    this.updateDebugText("Configuration reset to defaults");
  }

  /**
   * Update debug text if available
   */
  private updateDebugText(message: string) {
    if (!isNull(this.debugText)) {
      this.debugText.text = `Config: ${message}`;
    }
    print(`SubtitleConfig: ${message}`);
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages(): string[] {
    return [
      "en", // English
      "es", // Spanish
      "fr", // French
      "de", // German
      "it", // Italian
      "pt", // Portuguese
      "nl", // Dutch
      "pl", // Polish
      "ru", // Russian
      "ja", // Japanese
      "ko", // Korean
      "zh", // Chinese
      "ar", // Arabic
      "hi", // Hindi
      "tr", // Turkish
      "sv", // Swedish
      "da", // Danish
      "no", // Norwegian
      "fi"  // Finnish
    ];
  }

  /**
   * Check if a language is supported
   */
  isLanguageSupported(language: string): boolean {
    return this.getSupportedLanguages().includes(language.toLowerCase());
  }
}
