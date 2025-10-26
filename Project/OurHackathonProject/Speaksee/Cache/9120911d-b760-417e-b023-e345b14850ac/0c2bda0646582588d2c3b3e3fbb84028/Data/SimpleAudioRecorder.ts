/**
 * Simple, clean audio recorder for voice recording and playback
 * No subtitles, no analysis - just pure audio functionality
 */

type AudioFrameData = {
  audioFrame: Float32Array;
  audioFrameShape: vec3;
};

const SAMPLE_RATE = 44100;

@component
export class SimpleAudioRecorder extends BaseScriptComponent {
  @input
  microphoneAsset: AudioTrackAsset;

  @input
  audioOutput: AudioTrackAsset;

  @input
  @allowUndefined
  debugText: Text;

  private audioComponent: AudioComponent;
  private recordAudioUpdateEvent: UpdateEvent;
  private playbackAudioUpdateEvent: UpdateEvent;

  private microphoneControl: MicrophoneAudioProvider;
  private audioOutputProvider: AudioOutputProvider;

  private recordedAudioFrames: AudioFrameData[] = [];
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

    this.updateDebugText("Audio Recorder Ready");
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

    // Stop playback if the end of the recording is reached
    if (this.currentPlaybackTime >= this._recordingDuration) {
      this.audioComponent.stop(false);
      this.playbackAudioUpdateEvent.enabled = false;
      this.updateDebugText("Playback completed");
    }
  }

  // Update the debug text with recording information
  private updateRecordingDebugText() {
    if (isNull(this.debugText)) {
      return;
    }

    this.debugText.text = "🔴 Recording...";
    this.debugText.text += "\nDuration: " + this._recordingDuration.toFixed(1) + "s";
    this.debugText.text += "\nSize: " + (this.getTotalRecordedBytes() / 1000).toFixed(1) + "kB";
    this.debugText.text += "\nSample Rate: " + SAMPLE_RATE;
  }

  // Update the debug text with playback information
  private updatePlaybackDebugText() {
    if (isNull(this.debugText)) {
      return;
    }

    if (this.numberOfSamples <= 0) {
      this.debugText.text = "❌ No audio recorded yet!\nPlease try recording again.";
      return;
    }

    this.debugText.text = "▶️ Playing Audio";
    this.debugText.text += "\nTime: " + this.currentPlaybackTime.toFixed(1) + "s / " + this._recordingDuration.toFixed(1) + "s";
    
    // Progress indicator
    const progress = Math.round((this.currentPlaybackTime / this._recordingDuration) * 10);
    const progressBar = "█".repeat(progress) + "░".repeat(10 - progress);
    this.debugText.text += "\n[" + progressBar + "]";
  }

  // Start or stop recording audio from the microphone
  recordMicrophoneAudio(toRecord: boolean) {
    if (toRecord) {
      // Start recording
      this.recordedAudioFrames = [];
      this.audioComponent.stop(false);
      this.numberOfSamples = 0;
      this.microphoneControl.start();
      this.recordAudioUpdateEvent.enabled = true;
      this.playbackAudioUpdateEvent.enabled = false;
      this.updateDebugText("🔴 Recording started...");
      print("SimpleAudioRecorder: Recording started");
    } else {
      // Stop recording
      this.microphoneControl.stop();
      this.recordAudioUpdateEvent.enabled = false;
      this.updateDebugText("⏹️ Recording stopped");
      print(`SimpleAudioRecorder: Recording stopped - ${this._recordingDuration.toFixed(1)}s, ${this.recordedAudioFrames.length} frames`);
    }
  }

  // Start playback of the recorded audio
  playbackRecordedAudio(): boolean {
    if (this.recordedAudioFrames.length <= 0) {
      this.updateDebugText("❌ No audio to play!\nRecord something first.");
      return false;
    }

    this.currentPlaybackTime = 0;
    this.audioComponent.stop(false);
    this.playbackAudioUpdateEvent.enabled = true;
    this.audioComponent.play(-1);
    this.updateDebugText("▶️ Starting playback...");
    print("SimpleAudioRecorder: Starting playback");
    
    // Queue all recorded audio frames for playback
    for (let i = 0; i < this.recordedAudioFrames.length; i++) {
      this.audioOutputProvider.enqueueAudioFrame(
        this.recordedAudioFrames[i].audioFrame,
        this.recordedAudioFrames[i].audioFrameShape
      );
    }
    
    return true;
  }

  // Stop playback
  stopPlayback() {
    this.audioComponent.stop(false);
    this.playbackAudioUpdateEvent.enabled = false;
    this.updateDebugText("⏹️ Playback stopped");
    print("SimpleAudioRecorder: Playback stopped");
  }

  // Get recording duration
  public get recordingDuration(): number {
    return this._recordingDuration;
  }

  // Check if audio is recorded
  hasRecording(): boolean {
    return this.recordedAudioFrames.length > 0;
  }

  // Get recording stats
  getRecordingStats(): string {
    if (this.recordedAudioFrames.length === 0) {
      return "No recording available";
    }
    
    return `Duration: ${this._recordingDuration.toFixed(1)}s, Frames: ${this.recordedAudioFrames.length}, Size: ${(this.getTotalRecordedBytes() / 1000).toFixed(1)}kB`;
  }

  // Clear recorded audio
  clearRecording() {
    this.recordedAudioFrames = [];
    this.numberOfSamples = 0;
    this._recordingDuration = 0;
    this.currentPlaybackTime = 0;
    this.updateDebugText("🗑️ Recording cleared");
    print("SimpleAudioRecorder: Recording cleared");
  }

  // Calculate the total recorded bytes
  private getTotalRecordedBytes(): number {
    let totalBytes = 0;
    for (const frame of this.recordedAudioFrames) {
      totalBytes += frame.audioFrame.byteLength;
    }
    return totalBytes;
  }

  // Update debug text helper
  private updateDebugText(message: string) {
    if (!isNull(this.debugText)) {
      this.debugText.text = message;
    }
    print(`SimpleAudioRecorder: ${message}`);
  }
}
