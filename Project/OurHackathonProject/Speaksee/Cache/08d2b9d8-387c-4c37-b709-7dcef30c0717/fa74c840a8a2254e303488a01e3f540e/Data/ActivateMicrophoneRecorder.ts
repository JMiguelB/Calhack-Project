import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { MicrophoneRecorder } from "./MicrophoneRecorder";
import { ASRController } from "./ASRController";

@component
export class ActivateMicrophoneRecorder extends BaseScriptComponent {
  @input
  microphoneRecorder: MicrophoneRecorder;

  @input
  @allowUndefined
  asrController: ASRController;

  @input
  @allowUndefined
  buttonText: Text;

  private interactable: Interactable;
  private isListening: boolean = false;

  onAwake() {
    this.interactable = this.sceneObject.getComponent(
      Interactable.getTypeName()
    );

    if (this.interactable) {
      this.interactable.onTriggerStart.add(() => {
        print("ActivateMicrophoneRecorder: Button pressed - starting recording");
        if (!isNull(this.microphoneRecorder)) {
          this.microphoneRecorder.recordMicrophoneAudio(true);
          this.asrController.startListening()
        } else {
          print("ERROR: MicrophoneRecorder is null in ActivateMicrophoneRecorder!");
        }
      });
      this.interactable.onTriggerCanceled.add(() => {
         print("ActivateMicrophoneRecorder: Button canceled - stopping recording");
         if (!isNull(this.microphoneRecorder)) {
           this.microphoneRecorder.recordMicrophoneAudio(false);
         } else {
           print("ERROR: MicrophoneRecorder is null in ActivateMicrophoneRecorder!");
         }
       });
      print("ActivateMicrophoneRecorder: Button events set up successfully");
    } else {
      print("ERROR: No Interactable component found on ActivateMicrophoneRecorder!");
    }
  }
}
