import Event from "SpectaclesInteractionKit.lspkg/Utils/Event";

@component
export class ASRController extends BaseScriptComponent {
    private asr: AsrModule = require("LensStudio:ASRModule");
    private options = null;
    onFinalVoiceEvent = new Event<string>();
    onAwake() {
        this.options = AsrModule.AsrTranscriptionOptions.create();
        this.options.mode = AsrModule.AsrMode.Balanced;
        this.options.onTranscriptionUpdateEvent.add((args) => {
            if (args.isFinal) {
                print("Final Transcription: " + args.text);
                this.onFinalVoiceEvent.invoke(args.text);
            }
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
    }
}
