import Event from "SpectaclesInteractionKit.lspkg/Utils/Event";

@component
export class ASRController extends BaseScriptComponent {
    private asr: AsrModule = require("LensStudio:AsrModule");
    private options = null;
    onFinalVoiceEvent = new Event<string>();
    private currentTextSaid: string;
    onAwake() {
        this.options = AsrModule.AsrTranscriptionOptions.create();
        this.options.mode = AsrModule.AsrMode.Balanced;
        this.options.onTranscriptionUpdateEvent.add((args) => {
            this.currentTextSaid = args.text
        })
        this.options.onTranscriptionErrorEvent.add((args) => {
            print("Error: " + args);
        })
    }

    startListening() {
        this.asr.startTranscribing(this.options);
    }

    stopListening() {
        this.asr.stopTranscribing();
        this.onFinalVoiceEvent.invoke(this.currentTextSaid);
    }
}
