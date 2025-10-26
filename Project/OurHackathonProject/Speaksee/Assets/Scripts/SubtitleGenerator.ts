/**
 * AI-powered subtitle generator for audio recordings
 * Integrates with OpenAI Whisper API to generate subtitles from audio data
 */

//@input Asset.InternetModule internetModule

export interface SubtitleSegment {
  text: string;
  startTime: number;
  endTime: number;
}

export interface SubtitleGenerationConfig {
  apiKey: string;
  language?: string;
  model?: 'whisper-1';
  responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
}

@component
export class SubtitleGenerator extends BaseScriptComponent {
  @input
  internetModule: InternetModule;
  @input
  @allowUndefined
  debugText: Text;

  private config: SubtitleGenerationConfig = {
    apiKey: '', // Will need to be set
    language: 'en',
    model: 'whisper-1',
    responseFormat: 'verbose_json'
  };

  private isGenerating: boolean = false;
  private generatedSubtitles: SubtitleSegment[] = [];

  onAwake() {
    // Initialize any required components
    this.updateDebugText('Subtitle Generator Ready');
  }

  /**
   * Configure the AI service for subtitle generation
   */
  configure(config: Partial<SubtitleGenerationConfig>) {
    this.config = { ...this.config, ...config };
    this.updateDebugText('Subtitle Generator Configured');
  }

  /**
   * Generate subtitles from recorded audio frames
   */
  async generateSubtitles(audioFrames: Float32Array[], sampleRate: number = 44100): Promise<SubtitleSegment[]> {
    if (this.isGenerating) {
      this.updateDebugText('Generation already in progress...');
      return this.generatedSubtitles;
    }

    if (!this.config.apiKey) {
      this.updateDebugText('Error: API key not configured');
      return [];
    }

    try {
      this.isGenerating = true;
      this.updateDebugText('Generating subtitles...');

      // Convert audio frames to WAV format for API
      const audioBlob = this.convertToWav(audioFrames, sampleRate);
      
      // Generate subtitles using AI API
      const subtitles = await this.callWhisperAPI(audioBlob);
      
      this.generatedSubtitles = subtitles;
      this.updateDebugText(`Generated ${subtitles.length} subtitle segments`);
      
      return subtitles;
    } catch (error) {
      this.updateDebugText(`Error generating subtitles: ${error.message}`);
      return [];
    } finally {
      this.isGenerating = false;
    }
  }

  /**
   * Convert Float32Array audio frames to WAV blob for API upload
   */
  private convertToWav(audioFrames: Float32Array[], sampleRate: number): Blob {
    // Combine all audio frames into single array
    let totalLength = 0;
    for (const frame of audioFrames) {
      totalLength += frame.length;
    }

    const combinedAudio = new Float32Array(totalLength);
    let offset = 0;
    for (const frame of audioFrames) {
      combinedAudio.set(frame, offset);
      offset += frame.length;
    }

    // Convert to WAV format
    const wavBuffer = this.encodeWAV(combinedAudio, sampleRate);
    // Convert ArrayBuffer to base64 string for Spectacles compatibility
    const wavBytes = new Uint8Array(wavBuffer);
    const base64String = this.arrayBufferToBase64(wavBytes);
    return new Blob([base64String], { type: 'audio/wav' });
  }

  /**
   * Convert Uint8Array to base64 string (custom implementation for Spectacles)
   */
  private arrayBufferToBase64(buffer: Uint8Array): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    let i = 0;
    
    while (i < buffer.length) {
      const a = buffer[i++];
      const b = i < buffer.length ? buffer[i++] : 0;
      const c = i < buffer.length ? buffer[i++] : 0;
      
      const bitmap = (a << 16) | (b << 8) | c;
      
      result += chars.charAt((bitmap >> 18) & 63);
      result += chars.charAt((bitmap >> 12) & 63);
      result += i - 2 < buffer.length ? chars.charAt((bitmap >> 6) & 63) : '=';
      result += i - 1 < buffer.length ? chars.charAt(bitmap & 63) : '=';
    }
    
    return result;
  }

  /**
   * Encode Float32Array as WAV file
   */
  private encodeWAV(audioData: Float32Array, sampleRate: number): ArrayBuffer {
    const length = audioData.length;
    const buffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(buffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);

    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, audioData[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }

    return buffer;
  }

  /**
   * Call OpenAI Whisper API for speech-to-text
   */
  private async callWhisperAPI(audioBlob: Blob): Promise<SubtitleSegment[]> {
    // Note: Spectacles environment may not support FormData directly
    // This is a simplified implementation - in a real scenario, you would need
    // to handle multipart/form-data encoding manually or use alternative approaches
    
    if (!this.internetModule) {
      throw new Error('InternetModule not configured');
    }

    // Create a basic request without FormData for now
    // In production, you would need to properly encode the audio data
    const request = new Request('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.config.model,
        response_format: this.config.responseFormat,
        language: this.config.language,
        // Note: This is a placeholder - actual audio data needs proper encoding
        audio_data: 'base64_encoded_audio_would_go_here'
      })
    });

    const response = await this.internetModule.fetch(request);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    // Parse response based on format
    if (this.config.responseFormat === 'verbose_json' && result.segments) {
      return result.segments.map((segment: any) => ({
        text: segment.text.trim(),
        startTime: segment.start,
        endTime: segment.end
      }));
    } else if (result.text) {
      // Simple text response - create single segment
      return [{
        text: result.text.trim(),
        startTime: 0,
        endTime: 0 // Will need to be calculated based on audio duration
      }];
    }

    return [];
  }

  /**
   * Get the currently generated subtitles
   */
  getSubtitles(): SubtitleSegment[] {
    return this.generatedSubtitles;
  }

  /**
   * Check if subtitle generation is in progress
   */
  isGeneratingSubtitles(): boolean {
    return this.isGenerating;
  }

  /**
   * Clear generated subtitles
   */
  clearSubtitles() {
    this.generatedSubtitles = [];
    this.updateDebugText('Subtitles cleared');
  }

  /**
   * Export subtitles in SRT format
   */
  exportToSRT(): string {
    let srtContent = '';
    for (let i = 0; i < this.generatedSubtitles.length; i++) {
      const segment = this.generatedSubtitles[i];
      srtContent += `${i + 1}\n`;
      srtContent += `${this.formatTime(segment.startTime)} --> ${this.formatTime(segment.endTime)}\n`;
      srtContent += `${segment.text}\n\n`;
    }
    return srtContent;
  }

  /**
   * Format time for SRT format (HH:MM:SS,mmm)
   */
  private formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
  }

  /**
   * Update debug text if available
   */
  private updateDebugText(message: string) {
    if (!isNull(this.debugText)) {
      this.debugText.text = `Subtitles: ${message}`;
    }
    print(`SubtitleGenerator: ${message}`);
  }
}
