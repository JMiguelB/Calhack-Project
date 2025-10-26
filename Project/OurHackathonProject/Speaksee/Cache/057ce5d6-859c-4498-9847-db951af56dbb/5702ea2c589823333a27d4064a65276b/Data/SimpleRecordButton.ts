/**
 * Simple record button for clean audio recording
 * Press and hold to record, release to stop
 */

import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { SimpleAudioRecorder } from "./SimpleAudioRecorder";

@component
export class SimpleRecordButton extends BaseScriptComponent {
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
      // Start recording when button is pressed
      this.interactable.onTriggerStart.add(() => {
        this.startRecording();
      });

      // Stop recording when button is released
      this.interactable.onTriggerEnd.add(() => {
        this.stopRecording();
      });

      // Stop recording if interaction is cancelled
      this.interactable.onTriggerCanceled.add(() => {
        this.stopRecording();
      });
    }

    this.updateButtonText("🎤 Hold to Record");
  }

  private startRecording() {
    if (this.audioRecorder) {
      this.audioRecorder.recordMicrophoneAudio(true);
      this.updateButtonText("🔴 Recording... (Release to stop)");
      print("SimpleRecordButton: Recording started");
    }
  }

  private stopRecording() {
    if (this.audioRecorder) {
      this.audioRecorder.recordMicrophoneAudio(false);
      this.updateButtonText("🎤 Hold to Record");
      print("SimpleRecordButton: Recording stopped");
    }
  }

  private updateButtonText(text: string) {
    if (!isNull(this.buttonText)) {
      this.buttonText.text = text;
    }
  }
}
