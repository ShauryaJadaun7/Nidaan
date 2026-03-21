const SARVAM_API_KEY = process.env.NEXT_PUBLIC_SARVAM_API_KEY;

export const getLanguageCode = (lang: string) => {
  if (lang.includes('Hindi')) return 'hi-IN';
  if (lang.includes('Tamil')) return 'ta-IN';
  if (lang.includes('Marathi')) return 'mr-IN';
  if (lang.includes('Gujarati')) return 'gu-IN';
  if (lang.includes('Bengali')) return 'bn-IN';
  if (lang.includes('Telugu')) return 'te-IN';
  if (lang.includes('Kannada')) return 'kn-IN';
  return 'en-IN';
};

export async function textToSpeech(text: string, language: string): Promise<string | null> {
  if (!SARVAM_API_KEY) {
    console.error("SARVAM API key is missing");
    return null;
  }
  const code = getLanguageCode(language);
  try {
    const response = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'api-subscription-key': SARVAM_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: [text],
        target_language_code: code,
        speaker: "meera",
        pitch: 0,
        pace: 1.0,
        loudness: 1.5,
        model: "bulbul:v1"
      })
    });

    if (!response.ok) {
      console.error("TTS Failed:", await response.text());
      return null;
    }

    const data = await response.json();
    if (data && data.audios && data.audios.length > 0) {
      return data.audios[0];
    }
  } catch (e) {
    console.error("TTS Error:", e);
  }
  return null;
}

export async function speechToText(audioBlob: Blob, language: string): Promise<string | null> {
  if (!SARVAM_API_KEY) {
    console.error("SARVAM API key is missing");
    return null;
  }
  const formData = new FormData();
  // MediaRecorder outputs webm natively. Using .webm ensures Sarvam parses the container properly.
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', 'saaras:v3');
  formData.append('language_code', getLanguageCode(language));

  try {
    const response = await fetch('https://api.sarvam.ai/speech-to-text', {
      method: 'POST',
      headers: {
        'api-subscription-key': SARVAM_API_KEY
      },
      body: formData
    });

    if (!response.ok) {
      console.error("STT Failed:", await response.text());
      // Fallback: Try speech-to-text-translate if saaras:v1 with language_code fails
      const fallbackFormData = new FormData();
      fallbackFormData.append('file', audioBlob, 'audio.webm');

      const fallbackRes = await fetch('https://api.sarvam.ai/speech-to-text-translate', {
        method: 'POST',
        headers: {
          'api-subscription-key': SARVAM_API_KEY
        },
        body: fallbackFormData
      });
      if (fallbackRes.ok) {
        const fbData = await fallbackRes.json();
        return fbData.transcript || null;
      }
      return null;
    }

    const data = await response.json();
    return data.transcript || null;
  } catch (e) {
    console.error("STT Error:", e);
  }
  return null;
}
