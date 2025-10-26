import { ASRController } from "./ASRController";

@component
export class UpdateSubtitle extends BaseScriptComponent {
    @input
    private asrController: ASRController

    @input
    private subtitleText: Text
    onAwake() {
        this.createEvent("OnStartEvent").bind(this.onStart.bind(this))
    }

    onStart() {
        this.asrController.onFinalVoiceEvent.add((completedSubtitle: string) => {
            this.subtitleText.text = completedSubtitle;
        });
    }
}
