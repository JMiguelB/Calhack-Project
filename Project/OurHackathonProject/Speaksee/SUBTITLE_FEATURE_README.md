# AI Subtitle Generator Feature

## Overview

The AI Subtitle Generator feature adds automatic subtitle generation capability to the Voice Playback project. It uses OpenAI's Whisper API to transcribe recorded audio in real-time and displays synchronized subtitles during playback.

## Features

- **Automatic Speech-to-Text**: Uses OpenAI Whisper API for accurate transcription
- **Real-time Subtitle Display**: Shows subtitles synchronized with audio playback  
- **Multiple Language Support**: Supports 19+ languages including English, Spanish, French, German, etc.
- **Subtitle Export**: Export generated subtitles in SRT format
- **Configurable Settings**: Customizable API keys, language settings, and display options
- **Visual Subtitle Display**: Clean, readable subtitle overlay with background

## New Components

### 1. SubtitleGenerator.ts
The core AI integration component that handles:
- Audio format conversion (Float32Array to WAV)
- API calls to OpenAI Whisper
- Subtitle timing and segmentation
- SRT format export

### 2. SubtitleDisplay.ts
UI component for subtitle visualization:
- Real-time subtitle display during playback
- Text formatting and line wrapping
- Background overlay for readability
- Timing synchronization with audio

### 3. SubtitleConfig.ts
Configuration manager for subtitle settings:
- API key management
- Language selection
- Model configuration
- Enable/disable subtitle generation

### 4. SubtitleActivator.ts
UI interaction helper for subtitle features:
- Display all subtitles
- Export subtitles to SRT
- Toggle subtitle generation
- Show configuration info

### 5. Enhanced MicrophoneRecorder.ts
Extended the original recorder with subtitle integration:
- Automatic subtitle generation after recording
- Subtitle display during playback
- Configuration methods for AI settings
- Export functionality

## Setup Instructions

### 1. API Key Configuration

You'll need an OpenAI API key to use the subtitle generation feature:

1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Configure the API key using one of these methods:

**Method A: Using SubtitleConfig component**
```typescript
// In your scene setup
subtitleConfig.setApiKey("your-openai-api-key-here");
subtitleConfig.setLanguage("en"); // or your preferred language
```

**Method B: Direct configuration**
```typescript
// In your microphone recorder setup
microphoneRecorder.configureSubtitleGeneration("your-openai-api-key-here", "en");
```

### 2. Scene Setup in Lens Studio

1. **Add Subtitle Components to your scene:**
   - Create empty SceneObjects for each subtitle component
   - Assign the respective TypeScript components

2. **Set up UI Elements:**
   - Add a Text component for subtitle display
   - Optionally add an Image component for subtitle background
   - Position them appropriately in your UI

3. **Connect Components:**
   - Assign the SubtitleGenerator and SubtitleDisplay to your MicrophoneRecorder
   - Set up SubtitleConfig with your preferred settings
   - Add SubtitleActivator buttons as needed

### 3. Component Connections

Wire up the components in Lens Studio Inspector:

```
MicrophoneRecorder:
├── subtitleGenerator: [SubtitleGenerator component]
├── subtitleDisplay: [SubtitleDisplay component]
└── enableSubtitles: true

SubtitleDisplay:
├── subtitleText: [Text component for subtitles]
├── subtitleBackground: [Image component for background]
├── maxLines: 2
└── fontSize: 24

SubtitleConfig:
├── openAIApiKey: "your-api-key"
├── language: "en"
├── microphoneRecorder: [MicrophoneRecorder component]
└── enableSubtitlesByDefault: true
```

## Usage

### Basic Workflow

1. **Record Audio**: Use the existing record button to capture audio
2. **Automatic Generation**: Subtitles are automatically generated when recording stops
3. **Playback with Subtitles**: Press play to see audio with synchronized subtitles
4. **View All Subtitles**: Use subtitle display buttons to see complete transcription

### API Integration

The system automatically:
1. Converts recorded audio to WAV format
2. Sends audio to OpenAI Whisper API
3. Processes the transcription response
4. Creates timed subtitle segments
5. Displays subtitles during playback

### Supported Languages

The system supports these languages:
- `en` - English
- `es` - Spanish  
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `nl` - Dutch
- `pl` - Polish
- `ru` - Russian
- `ja` - Japanese
- `ko` - Korean
- `zh` - Chinese
- `ar` - Arabic
- `hi` - Hindi
- `tr` - Turkish
- `sv` - Swedish
- `da` - Danish
- `no` - Norwegian
- `fi` - Finnish

## Configuration Options

### SubtitleGenerator Configuration
```typescript
{
  apiKey: string,           // OpenAI API key (required)
  language: string,         // Language code (e.g., 'en', 'es')
  model: 'whisper-1',       // AI model to use
  responseFormat: 'verbose_json' | 'text' | 'srt' | 'vtt'
}
```

### SubtitleDisplay Configuration
- `maxLines`: Maximum subtitle lines to show (default: 2)
- `fontSize`: Text size for subtitles (default: 24)
- `enableWordHighlight`: Enable word-by-word highlighting (future feature)

## Export Functionality

### SRT Format Export
Generated subtitles can be exported in standard SRT format:

```srt
1
00:00:01,000 --> 00:00:04,500
Hello, this is a test recording.

2
00:00:05,000 --> 00:00:08,200
The subtitle system is working correctly.
```

### Export Methods
```typescript
// Export via MicrophoneRecorder
const srtContent = microphoneRecorder.exportSubtitlesToSRT();

// Export via SubtitleGenerator
const srtContent = subtitleGenerator.exportToSRT();
```

## Error Handling

The system includes comprehensive error handling for:
- **Missing API Key**: Warns when no API key is configured
- **Network Errors**: Handles API request failures gracefully
- **Audio Format Issues**: Validates audio data before processing
- **Empty Recordings**: Checks for valid audio content

Error messages are displayed in debug text components and console logs.

## Performance Considerations

### Audio Processing
- Audio is processed locally before sending to API
- WAV encoding is done client-side to minimize data transfer
- Only recorded audio frames are processed (no continuous streaming)

### API Usage
- Subtitles are generated once per recording
- API calls are made only when recording stops
- Failed requests don't block the audio playback functionality

### Memory Management
- Audio frames are released after processing
- Subtitle data is stored efficiently as text segments
- Components can be disabled to reduce resource usage

## Troubleshooting

### Common Issues

**Subtitles not generating:**
1. Check API key configuration
2. Verify internet connectivity
3. Ensure recording contains audio
4. Check console for error messages

**Subtitles not displaying:**
1. Verify SubtitleDisplay component is assigned
2. Check Text component is properly connected
3. Ensure subtitles were successfully generated

**Timing issues:**
1. Verify audio sample rate matches (44100 Hz)
2. Check subtitle segment timing data
3. Ensure playback time is updating correctly

### Debug Information

Enable debug output by assigning Text components to:
- `MicrophoneRecorder.debugText`
- `SubtitleGenerator.debugText` 
- `SubtitleConfig.debugText`
- `SubtitleActivator.debugText`

## API Costs

OpenAI Whisper API pricing (as of current rates):
- $0.006 per minute of audio
- Typical 30-second recording costs ~$0.003
- 1-minute recording costs ~$0.006

Monitor your API usage in the OpenAI dashboard.

## Future Enhancements

Potential improvements for future versions:
- **Offline transcription**: Local speech-to-text processing
- **Real-time transcription**: Live subtitle generation during recording
- **Speaker identification**: Multi-speaker subtitle formatting
- **Confidence scoring**: Display transcription confidence levels
- **Subtitle editing**: Manual correction of generated subtitles
- **Multiple export formats**: WebVTT, TTML, etc.

## Support

For issues or questions:
1. Check the console logs for error messages
2. Verify all components are properly connected
3. Test with a simple API key setup
4. Ensure Spectacles device has internet connectivity

---

*AI Subtitle Generator Feature - Built for Spectacles Voice Playback Project*
