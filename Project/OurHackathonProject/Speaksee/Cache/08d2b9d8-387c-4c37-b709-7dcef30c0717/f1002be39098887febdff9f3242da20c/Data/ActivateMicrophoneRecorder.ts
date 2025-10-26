import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { MicrophoneRecorder } from "./MicrophoneRecorder";

@component
export class ActivateMicrophoneRecorder extends BaseScriptComponent {
  @input
  microphoneRecorder: MicrophoneRecorder;

  private interactable: Interactable;

  onAwake() {
    this.interactable = this.sceneObject.getComponent(
      Interactable.getTypeName()
    );

    if (this.interactable) {
      this.interactable.onTriggerStart.add(() => {
        if (!isNull(this.microphoneRecorder)) {
          this.microphoneRecorder.recordMicrophoneAudio(true);
        }
      });
      this.interactable.onTriggerEnd.add(() => {
        if (!isNull(this.microphoneRecorder)) {
          this.microphoneRecorder.recordMicrophoneAudio(false);
        }
      });
      this.interactable.onTriggerCanceled.add(() => {
        if (!isNull(this.microphoneRecorder)) {
          this.microphoneRecorder.recordMicrophoneAudio(false);
        }
      });
    }
  }
}
