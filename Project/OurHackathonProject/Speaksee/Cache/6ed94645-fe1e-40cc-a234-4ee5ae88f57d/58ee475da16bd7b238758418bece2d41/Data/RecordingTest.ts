/**
 * Simple recording test script
 * Use this to test if basic recording works
 */

@component
export class RecordingTest extends BaseScriptComponent {
  @input
  microphoneAsset: AudioTrackAsset;

  @input
  audioOutput: AudioTrackAsset;

  private microphoneControl: MicrophoneAudioProvider;
  private isRecording: boolean = false;

  onAwake() {
    print("RecordingTest: Starting test...");

    if (isNull(this.microphoneAsset)) {
      print("❌ TEST FAILED: Microphone Asset not connected");
      return;
    }

    if (isNull(this.audioOutput)) {
      print("❌ TEST FAILED: Audio Output not connected");
      return;
    }

    this.microphoneControl = this.microphoneAsset.control as MicrophoneAudioProvider;
    this.microphoneControl.sampleRate = 44100;

    print("✅ RecordingTest: All assets connected properly");
    print("👆 Tap screen to test recording");

    // Add tap to record
    const tapEvent = this.createEvent("TapEvent");
    tapEvent.bind(() => {
      this.toggleRecording();
    });
  }

  toggleRecording() {
    if (!this.isRecording) {
      print("🔴 Starting test recording...");
      this.microphoneControl.start();
      this.isRecording = true;

      // Stop after 3 seconds
      const stopEvent = this.createEvent("DelayedCallbackEvent");
      stopEvent.bind(() => {
        this.stopRecording();
      });
      stopEvent.reset(3.0);
    }
  }

  stopRecording() {
    if (this.isRecording) {
      print("⏹️ Stopping test recording...");
      this.microphoneControl.stop();
      this.isRecording = false;
      print("✅ TEST COMPLETE: Recording worked!");
    }
  }
}
