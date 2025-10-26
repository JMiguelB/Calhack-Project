import { SubtitleGenerator, SubtitleSegment } from "./SubtitleGenerator";
import { SubtitleDisplay } from "./SubtitleDisplay";
import { CommunicationAnalyzer, CommunicationFeedback } from "./CommunicationAnalyzer";
import { CommunicationFeedbackDisplay } from "./CommunicationFeedbackDisplay";

type AudioFrameData = {
  audioFrame: Float32Array;
  audioFrameShape: vec3;
};

const SAMPLE_RATE = 44100;

@component
export class MicrophoneRecorder extends BaseScriptComponent {
  @input
  microphoneAsset: AudioTrackAsset;

  @input
  audioOutput: AudioTrackAsset;

  @input
  @allowUndefined
  debugText: Text;

  @input
  @allowUndefined
  subtitleGenerator: SubtitleGenerator;

  @input
  @allowUndefined
  subtitleDisplay: SubtitleDisplay;

  @input
  @hint("Enable automatic subtitle generation")
  enableSubtitles: boolean = true;

  @input
  @allowUndefined
  communicationAnalyzer: CommunicationAnalyzer;

  @input
  @allowUndefined
  feedbackDisplay: CommunicationFeedbackDisplay;

  @input
  @hint("Enable communication skills analysis")
  enableCommunicationAnalysis: boolean = true;

  @input
  @hint("Analysis focus areas (comma-separated): presentation, interview, conversation")
  analysisFocusAreas: string = "general";

  private audioComponent: AudioComponent;
  private recordAudioUpdateEvent: UpdateEvent;
  private playbackAudioUpdateEvent: UpdateEvent;

  private microphoneControl: MicrophoneAudioProvider;
  private audioOutputProvider: AudioOutputProvider;

  private recordedAudioFrames: AudioFrameData[] = [];
  private generatedSubtitles: SubtitleSegment[] = [];
  private communicationFeedback: CommunicationFeedback | null = null;

  private numberOfSamples: number = 0;
  private _recordingDuration: number = 0;

  private currentPlaybackTime: number = 0;

  onAwake() {
    // Initialize microphone control and set sample rate
    this.microphoneControl = this.microphoneAsset
      .control as MicrophoneAudioProvider;
    this.microphoneControl.sampleRate = SAMPLE_RATE;

    // Create and configure audio component
    this.audioComponent = this.sceneObject.createComponent("AudioComponent");
    this.audioComponent.audioTrack = this.audioOutput;
    this.audioOutputProvider = this.audioOutput.control as AudioOutputProvider;
    this.audioOutputProvider.sampleRate = SAMPLE_RATE;

    // Create and bind record audio update event
    this.recordAudioUpdateEvent = this.createEvent("UpdateEvent");
    this.recordAudioUpdateEvent.bind(() => {
      this.onRecordAudio();
    });
    this.recordAudioUpdateEvent.enabled = false;

    // Create and bind playback audio update event
    this.playbackAudioUpdateEvent = this.createEvent("UpdateEvent");
    this.playbackAudioUpdateEvent.bind(() => {
      this.onPlaybackAudio();
    });
    this.playbackAudioUpdateEvent.enabled = false;
  }

  // Called to record audio from the microphone
  private onRecordAudio() {
    let frameSize: number = this.microphoneControl.maxFrameSize;
    let audioFrame = new Float32Array(frameSize);

    // Get audio frame shape
    const audioFrameShape = this.microphoneControl.getAudioFrame(audioFrame);

    // If no audio data, return early
    if (audioFrameShape.x === 0) {
      return;
    }

    // Reduce the initial subarray size to the audioFrameShape value
    audioFrame = audioFrame.subarray(0, audioFrameShape.x);

    // Update the number of samples and recording duration
    this.numberOfSamples += audioFrameShape.x;
    this._recordingDuration = this.numberOfSamples / SAMPLE_RATE;

    // Update debug text with recording information
    this.updateRecordingDebugText();

    // Store the recorded audio frame
    this.recordedAudioFrames.push({
      audioFrame: audioFrame,
      audioFrameShape: audioFrameShape,
    });
  }

  // Called to handle playback of recorded audio
  private onPlaybackAudio() {
    this.currentPlaybackTime += getDeltaTime();
    this.currentPlaybackTime = Math.min(
      this.currentPlaybackTime,
      this._recordingDuration
    );

    // Update debug text with playback information
    this.updatePlaybackDebugText();

    // Update subtitle display if available
    if (!isNull(this.subtitleDisplay)) {
      this.subtitleDisplay.updatePlaybackTime(this.currentPlaybackTime);
    }

    // Stop playback if the end of the recording is reached
    if (this.currentPlaybackTime >= this._recordingDuration) {
      this.audioComponent.stop(false);
      this.playbackAudioUpdateEvent.enabled = false;
      
      // Stop subtitle display
      if (!isNull(this.subtitleDisplay)) {
        this.subtitleDisplay.stopDisplay();
      }
    }
  }

  // Update the debug text with recording information
  updateRecordingDebugText() {
    if (isNull(this.debugText)) {
      return;
    }

    this.debugText.text =
      "Duration: " + this._recordingDuration.toFixed(1) + "s";
    this.debugText.text +=
      "\n Size: " + (this.getTotalRecordedBytes() / 1000).toFixed(1) + "kB";
    this.debugText.text += "\nSample Rate: " + SAMPLE_RATE;
  }

  // Update the debug text with playback information
  updatePlaybackDebugText() {
    if (this.numberOfSamples <= 0) {
      this.debugText.text =
        "Oops! \nNo audio has been recorded yet. Please try recording again.";
      return;
    }

    this.debugText.text = "Playback Time: \n";
    this.debugText.text +=
      this.currentPlaybackTime.toFixed(1) +
      "s / " +
      this._recordingDuration.toFixed(1) +
      "s";
  }

  // Start or stop recording audio from the microphone
  recordMicrophoneAudio(toRecord: boolean) {
    if (toRecord) {
      this.recordedAudioFrames = [];
      this.generatedSubtitles = [];
      this.communicationFeedback = null;
      this.audioComponent.stop(false);
      this.numberOfSamples = 0;
      this.microphoneControl.start();
      this.recordAudioUpdateEvent.enabled = true;
      this.playbackAudioUpdateEvent.enabled = false;
      
      // Clear previous subtitles and feedback from display
      if (!isNull(this.subtitleDisplay)) {
        this.subtitleDisplay.clearSubtitles();
      }
      if (!isNull(this.feedbackDisplay)) {
        this.feedbackDisplay.hideFeedback();
      }
    } else {
      this.microphoneControl.stop();
      this.recordAudioUpdateEvent.enabled = false;
      
      // Generate subtitles and analysis after recording stops
      if (this.enableSubtitles && !isNull(this.subtitleGenerator)) {
        this.generateSubtitlesAndAnalysis();
      } else if (this.enableCommunicationAnalysis && !isNull(this.communicationAnalyzer)) {
        // Just generate analysis without subtitles
        this.generateCommunicationAnalysis();
      }
    }
  }

  // Start playback of the recorded audio
  playbackRecordedAudio(): boolean {
    this.updatePlaybackDebugText();
    if (this.recordedAudioFrames.length <= 0) {
      return false;
    }
    this.currentPlaybackTime = 0;
    this.audioComponent.stop(false);
    this.playbackAudioUpdateEvent.enabled = true;
    this.audioComponent.play(-1);
    
    // Start subtitle display if subtitles are available
    if (!isNull(this.subtitleDisplay) && this.generatedSubtitles.length > 0) {
      this.subtitleDisplay.loadSubtitles(this.generatedSubtitles);
      this.subtitleDisplay.startDisplay();
    }
    
    for (let i = 0; i < this.recordedAudioFrames.length; i++) {
      this.audioOutputProvider.enqueueAudioFrame(
        this.recordedAudioFrames[i].audioFrame,
        this.recordedAudioFrames[i].audioFrameShape
      );
    }
    return true;
  }

  // Getter for recording duration
  public get recordingDuration(): number {
    return this._recordingDuration;
  }

  // Calculate the total recorded bytes
  private getTotalRecordedBytes(): number {
    let totalBytes = 0;
    for (const frame of this.recordedAudioFrames) {
      totalBytes += frame.audioFrame.byteLength;
    }
    return totalBytes;
  }

  // Generate subtitles and communication analysis
  private async generateSubtitlesAndAnalysis() {
    if (!this.subtitleGenerator || this.recordedAudioFrames.length === 0) {
      // Fallback to analysis only if no subtitle generator
      if (this.enableCommunicationAnalysis) {
        this.generateCommunicationAnalysis();
      }
      return;
    }

    try {
      // Extract audio frames for subtitle generation
      const audioFrames = this.recordedAudioFrames.map(frame => frame.audioFrame);
      
      // Generate subtitles first
      this.generatedSubtitles = await this.subtitleGenerator.generateSubtitles(audioFrames, SAMPLE_RATE);
      
      // Load subtitles into display component if available
      if (!isNull(this.subtitleDisplay)) {
        this.subtitleDisplay.loadSubtitles(this.generatedSubtitles);
      }
      
      print(`Generated ${this.generatedSubtitles.length} subtitle segments`);

      // Generate communication analysis using the transcript
      if (this.enableCommunicationAnalysis && !isNull(this.communicationAnalyzer)) {
        const transcript = this.generatedSubtitles.map(segment => segment.text).join(' ');
        this.analyzeCommunicationFromTranscript(transcript);
      }
    } catch (error) {
      print(`Error generating subtitles: ${error.message}`);
      
      // Try to generate analysis anyway using simple transcript
      if (this.enableCommunicationAnalysis) {
        this.generateCommunicationAnalysis();
      }
    }
  }

  // Generate subtitles from the recorded audio (legacy method)
  private async generateSubtitlesFromRecording() {
    await this.generateSubtitlesAndAnalysis();
  }

  // Generate communication analysis without subtitles
  private async generateCommunicationAnalysis() {
    if (!this.communicationAnalyzer || this.recordedAudioFrames.length === 0) {
      return;
    }

    try {
      // For analysis without subtitles, we create a simple transcript placeholder
      // In a real implementation, you might want to use a faster speech-to-text service
      const simpleTranscript = `[Audio recording of ${this._recordingDuration.toFixed(1)} seconds]`;
      this.analyzeCommunicationFromTranscript(simpleTranscript);
    } catch (error) {
      print(`Error generating communication analysis: ${error.message}`);
    }
  }

  // Analyze communication from transcript text
  private async analyzeCommunicationFromTranscript(transcript: string) {
    if (!this.communicationAnalyzer || !transcript || transcript.trim().length === 0) {
      return;
    }

    try {
      print("Starting communication analysis...");
      
      const focusAreas = this.analysisFocusAreas.split(',').map(area => area.trim());
      
      // Generate communication feedback
      this.communicationFeedback = await this.communicationAnalyzer.analyzeCommunication(
        transcript, 
        this._recordingDuration
      );
      
      // Display feedback if component is available
      if (!isNull(this.feedbackDisplay)) {
        this.feedbackDisplay.displayFeedback(this.communicationFeedback);
      }
      
      print(`Communication analysis complete - Score: ${this.communicationFeedback.overallScore}/100`);
    } catch (error) {
      print(`Error analyzing communication: ${error.message}`);
    }
  }

  // Configure subtitle generation (call this to set API key and options)
  configureSubtitleGeneration(apiKey: string, language: string = 'en') {
    if (!isNull(this.subtitleGenerator)) {
      this.subtitleGenerator.configure({
        apiKey: apiKey,
        language: language,
        model: 'whisper-1',
        responseFormat: 'verbose_json'
      });
    }
  }

  // Get generated subtitles
  getGeneratedSubtitles(): SubtitleSegment[] {
    return this.generatedSubtitles;
  }

  // Export subtitles in SRT format
  exportSubtitlesToSRT(): string {
    if (!isNull(this.subtitleGenerator)) {
      return this.subtitleGenerator.exportToSRT();
    }
    return "";
  }

  // Check if subtitles are available
  hasSubtitles(): boolean {
    return this.generatedSubtitles.length > 0;
  }

  // Toggle subtitle generation
  toggleSubtitleGeneration(enabled: boolean) {
    this.enableSubtitles = enabled;
  }
}
