"""
Speech-to-Text for AROGYA-DI.
Transcribes citizen helpline calls / voice reports into text,
which can then be fed into the health data pipeline as unstructured input.
"""

from google.cloud import speech

PROJECT_ID = "ameer-491011"


def transcribe_audio(audio_bytes: bytes, sample_rate: int = 16000, language_code: str = "en-IN") -> str:
    """
    Transcribes an audio clip (e.g. citizen helpline call) to text.
    Supports English (en-IN), Hindi (hi-IN), and Kannada (kn-IN).
    """
    client = speech.SpeechClient()

    audio = speech.RecognitionAudio(content=audio_bytes)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=sample_rate,
        language_code=language_code,
        alternative_language_codes=["hi-IN", "kn-IN"],
    )

    response = client.recognize(config=config, audio=audio)

    transcript = " ".join(
        result.alternatives[0].transcript for result in response.results
    )
    return transcript if transcript else "No speech detected in audio."


if __name__ == "__main__":
    print("Speech-to-Text module ready. Call transcribe_audio(audio_bytes) with a .wav file's bytes.")