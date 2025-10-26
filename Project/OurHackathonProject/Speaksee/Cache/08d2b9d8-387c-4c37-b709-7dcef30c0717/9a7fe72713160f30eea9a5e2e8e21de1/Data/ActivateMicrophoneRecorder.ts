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
    // Initialize button state
    this.isListening = false;
    this.updateButtonText();

    this.interactable = this.sceneObject.getComponent(
      Interactable.getTypeName()
    );

    if (this.interactable) {
      // Toggle recording on button press (onTriggerStart only)
      this.interactable.onTriggerStart.add(() => {
        this.toggleListening();
      });

      print("ActivateMicrophoneRecorder: Toggle button events set up successfully");
    } else {
      print("ERROR: No Interactable component found on ActivateMicrophoneRecorder!");
    }
  }

  /**
   * Toggle between listening and not listening
   */
  private toggleListening() {
    this.isListening = !this.isListening;
    
    if (this.isListening) {
      this.startListening();
    } else {
      this.stopListening();
    }
    
    this.updateButtonText();
  }

  /**
   * Start both microphone recording and ASR listening
   */
  private startListening() {
    print("ActivateMicrophoneRecorder: Starting listening mode...");

    // Start microphone recording
    if (!isNull(this.microphoneRecorder)) {
      this.microphoneRecorder.recordMicrophoneAudio(true);
      print("✅ Microphone recording started");
    } else {
      print("❌ ERROR: MicrophoneRecorder is null!");
    }

    // Start ASR listening
    if (!isNull(this.asrController)) {
      this.asrController.startListening();
      print("✅ ASR listening started");
    } else {
      print("❌ ERROR: ASRController is null!");
    }
  }

  /**
   * Stop both microphone recording and ASR listening
   */
  private stopListening() {
    print("ActivateMicrophoneRecorder: Stopping listening mode...");

    // Stop microphone recording
    if (!isNull(this.microphoneRecorder)) {
      this.microphoneRecorder.recordMicrophoneAudio(false);
      print("⏹️ Microphone recording stopped");
    }

    // Stop ASR listening
    if (!isNull(this.asrController)) {
      this.asrController.stopListening();
      print("⏹️ ASR listening stopped");
    }
  }

  /**
   * Update button text to reflect current state
   */
  private updateButtonText() {
    if (!isNull(this.buttonText)) {
      if (this.isListening) {
        this.buttonText.text = "🔴 Stop Recording";
      } else {
        this.buttonText.text = "🎙️ Start Recording";
      }
    }
  }

  /**
   * Get current listening state
   */
  public getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Force stop listening (useful for external control)
   */
  public forceStopListening() {
    if (this.isListening) {
      this.isListening = false;
      this.stopListening();
      this.updateButtonText();
    }
  }
}
