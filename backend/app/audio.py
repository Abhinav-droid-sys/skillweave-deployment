import os
from fastapi import UploadFile, HTTPException
from faster_whisper import WhisperModel
import tempfile
import shutil

class AudioTranscriber:
    def __init__(self, model_size="small", device="cpu", compute_type="int8"):
        print(f"Loading faster-whisper model '{model_size}'...")
        self.model = WhisperModel(model_size, device=device, compute_type=compute_type)
        print("Whisper model loaded successfully.")

    def transcribe(self, file: UploadFile) -> str:
        """
        Takes an uploaded audio file, saves it temporarily, transcribes it, 
        and returns the transcript text.
        """
        # Ensure it's an audio or video file (FastAPI does some basic checking based on extension, but it's good to be safe)
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")

        # Save the uploaded file to a temporary location
        try:
            # We use NamedTemporaryFile with delete=False so windows doesn't block the file read
            suffix = os.path.splitext(file.filename)[1]
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                shutil.copyfileobj(file.file, tmp)
                tmp_path = tmp.name
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save file temporarily: {str(e)}")

        try:
            # Transcribe the audio file
            segments, info = self.model.transcribe(tmp_path, beam_size=5)
            
            # Combine all segments into a single transcript
            transcript = " ".join([segment.text for segment in segments])
            return transcript.strip()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to transcribe audio: {str(e)}")
        finally:
            # Clean up the temporary file
            if os.path.exists(tmp_path):
                try:
                    os.remove(tmp_path)
                except:
                    pass
