/**
 * Simple play button for audio playback
 * Tap to play recorded audio
 */

import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { SimpleAudioRecorder } from "./SimpleAudioRecorder";

@component
export class SimplePlayButton extends BaseScriptComponent {
  @input
  audioRecorder: SimpleAudioRecorder;

  @input
  @allowUndefined
  buttonText: Text;

  private interactable: Interactable;

  onAwake() {
    this.interactable = this.sceneObject.getComponent(
      Interactable.getTypeName()
    );

    if (this.interactable) {
      this.interactable.onTriggerStart.add(() => {
        this.playRecording();
      });
    }

    this.updateButtonText("▶️ Tap to Play");
  }

  private playRecording() {
    if (!this.audioRecorder) {
      this.updateButtonText("❌ No recorder connected");
      return;
    }

    if (!this.audioRecorder.hasRecording()) {
      this.updateButtonText("❌ No audio recorded");
      
      // Reset text after delay
      const resetEvent = this.createEvent("DelayedCallbackEvent");
      resetEvent.bind(() => {
        this.updateButtonText("▶️ Tap to Play");
      });
      resetEvent.reset(2.0);
      return;
    }

    const success = this.audioRecorder.playbackRecordedAudio();
    if (success) {
      this.updateButtonText("▶️ Playing...");
      print("SimplePlayButton: Started playback");
      
      // Reset text after playback duration
      const duration = this.audioRecorder.recordingDuration + 1.0;
      const resetEvent = this.createEvent("DelayedCallbackEvent");
      resetEvent.bind(() => {
        this.updateButtonText("▶️ Tap to Play");
      });
      resetEvent.reset(duration);
    } else {
      this.updateButtonText("❌ Playback failed");
    }
  }

  private updateButtonText(text: string) {
    if (!isNull(this.buttonText)) {
      this.buttonText.text = text;
    }
  }
}
