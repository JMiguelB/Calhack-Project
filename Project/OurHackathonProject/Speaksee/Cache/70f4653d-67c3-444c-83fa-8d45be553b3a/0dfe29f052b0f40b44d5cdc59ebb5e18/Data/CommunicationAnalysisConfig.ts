/**
 * Configuration script for communication analysis
 * Easy setup for AI-powered speaking skills feedback
 */

import { MicrophoneRecorder } from "./MicrophoneRecorder";

@component
export class CommunicationAnalysisConfig extends BaseScriptComponent {
  @input
  @allowUndefined
  microphoneRecorder: MicrophoneRecorder;

  @input
  @hint("Your OpenAI API key for communication analysis")
  apiKey: string = "";

  @input
  @hint("Focus areas: presentation, interview, conversation, meeting")
  focusAreas: string = "presentation";

  @input
  @hint("Enable communication analysis")
  enableAnalysis: boolean = true;

  @input
  @hint("Analysis type: detailed, quick, focused")
  analysisType: string = "detailed";

  @input
  @allowUndefined
  statusText: Text;

  onAwake() {
    this.configureCommunicationAnalysis();
  }

  private configureCommunicationAnalysis() {
    if (isNull(this.microphoneRecorder)) {
      this.updateStatus("Warning: MicrophoneRecorder not connected");
      print("CommunicationAnalysisConfig: Warning - MicrophoneRecorder not connected");
      return;
    }

    // Configure analysis settings
    this.microphoneRecorder.toggleCommunicationAnalysis(this.enableAnalysis);
    this.microphoneRecorder.setAnalysisFocusAreas(this.focusAreas);

    if (this.enableAnalysis && this.apiKey && this.apiKey.trim() !== "") {
      // Configure with API key
      const focusAreasArray = this.focusAreas.split(',').map(area => area.trim());
      this.microphoneRecorder.configureCommunicationAnalysis(this.apiKey, focusAreasArray);
      this.updateStatus(`Analysis configured for: ${this.focusAreas}`);
      print("CommunicationAnalysisConfig: Communication analysis configured successfully");
    } else if (this.enableAnalysis) {
      this.updateStatus("Warning: API key needed for analysis");
      print("CommunicationAnalysisConfig: Warning - API key not provided");
    } else {
      this.updateStatus("Communication analysis disabled");
      print("CommunicationAnalysisConfig: Communication analysis disabled");
    }
  }

  // Update API key at runtime
  updateApiKey(newApiKey: string) {
    this.apiKey = newApiKey;
    this.configureCommunicationAnalysis();
  }

  // Update focus areas
  updateFocusAreas(newAreas: string) {
    this.focusAreas = newAreas;
    this.configureCommunicationAnalysis();
  }

  // Toggle analysis
  toggleAnalysis(enabled: boolean) {
    this.enableAnalysis = enabled;
    this.configureCommunicationAnalysis();
  }

  // Get configuration summary
  getConfigSummary(): string {
    if (this.enableAnalysis) {
      const hasApiKey = this.apiKey && this.apiKey.trim() !== "";
      const hasRecorder = !isNull(this.microphoneRecorder);
      return `Enabled, Focus: ${this.focusAreas}, API: ${hasApiKey ? 'Set' : 'Missing'}, Recorder: ${hasRecorder ? 'Connected' : 'Missing'}`;
    } else {
      return "Disabled";
    }
  }

  // Connect MicrophoneRecorder after creation
  connectMicrophoneRecorder(recorder: MicrophoneRecorder) {
    this.microphoneRecorder = recorder;
    this.configureCommunicationAnalysis();
    this.updateStatus("MicrophoneRecorder connected and configured");
  }

  // Set preset configurations
  setPresetConfiguration(preset: string) {
    switch (preset.toLowerCase()) {
      case "presentation":
        this.focusAreas = "presentation";
        this.analysisType = "detailed";
        this.updateStatus("Configured for presentation practice");
        break;
      case "interview":
        this.focusAreas = "interview";
        this.analysisType = "detailed";
        this.updateStatus("Configured for interview preparation");
        break;
      case "conversation":
        this.focusAreas = "conversation";
        this.analysisType = "quick";
        this.updateStatus("Configured for conversation practice");
        break;
      case "meeting":
        this.focusAreas = "meeting";
        this.analysisType = "focused";
        this.updateStatus("Configured for meeting skills");
        break;
      default:
        this.focusAreas = "general";
        this.analysisType = "detailed";
        this.updateStatus("Configured for general communication");
        break;
    }
    this.configureCommunicationAnalysis();
  }

  private updateStatus(message: string) {
    if (this.statusText) {
      this.statusText.text = `Analysis: ${message}`;
    }
    print(`CommunicationAnalysisConfig: ${message}`);
  }
}
