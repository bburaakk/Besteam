import json
import re
import fitz  # PyMuPDF
import os
import zipfile
import tempfile
from yolcu_backend.services.ai_service import GeminiService
from yolcu_backend.prompts.evaluation_prompt import EVALUATION_PROMPT


# ARTIK DESTEKLENEN UZANTI LİSTESİ YOK

class ProjectEvaluator:
    def __init__(self, ai_service: GeminiService):
        """
        Initializes the ProjectEvaluator with an AI service instance.
        """
        self.ai_service = ai_service

    def read_project_file(self, file_path: str, original_filename: str) -> str:
        """
        Reads a project file, extracting text content using a best-effort approach.
        - Handles PDF and ZIP files with special logic.
        - Attempts to read any other file as text; fails if it's a binary file.
        """
        lower_filename = original_filename.lower()

        try:
            # PDF dosyalarını oku
            if lower_filename.endswith('.pdf'):
                text = ""
                with fitz.open(file_path) as doc:
                    for page in doc:
                        text += page.get_text()
                return text

            # ZIP arşivlerini işle
            elif lower_filename.endswith('.zip'):
                all_text_content = []
                with zipfile.ZipFile(file_path, 'r') as zip_ref:
                    with tempfile.TemporaryDirectory() as temp_dir:
                        zip_ref.extractall(temp_dir)

                        for root, _, files in os.walk(temp_dir):
                            for filename in files:
                                file_to_read_path = os.path.join(root, filename)
                                try:
                                    # Her dosyayı metin olarak okumayı dene
                                    with open(file_to_read_path, 'r', encoding='utf-8', errors='strict') as f:
                                        content = f.read()
                                        all_text_content.append(f"--- Dosya: {filename} ---\n{content}")
                                except (UnicodeDecodeError, IOError):
                                    # Okunamayanlar (binary dosyalar) atlanır
                                    print(f"Atlanan binary dosya (ZIP içinde): {filename}")
                                    continue

                if not all_text_content:
                    raise ValueError("ZIP archive does not contain any readable text files.")
                return "\n\n".join(all_text_content)

            # Diğer tüm dosyalar için metin olarak okumayı dene
            else:
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='strict') as f:
                        return f.read()
                except (UnicodeDecodeError, IOError):
                    # Bu bir binary dosya ise, hata fırlat
                    raise ValueError(
                        f"'{original_filename}' dosyası metin olarak okunamadı. "
                        "Resim, video veya program gibi bir binary dosya olabilir."
                    )

        except Exception as e:
            # Diğer beklenmedik hataları yakala
            print(f"Error processing file {original_filename}: {e}")
            raise

    def evaluate_project(self, project_code: str, original_suggestion: dict) -> str:
        """
        Generates a structured JSON evaluation based on the user's code
        and the original project suggestion.
        """
        prompt = EVALUATION_PROMPT.format(
            suggestion_title=original_suggestion.get('title', 'Başlık belirtilmemiş'),
            suggestion_description=original_suggestion.get('description', 'Açıklama belirtilmemiş'),
            project_code=project_code
        )
        raw_evaluation = self.ai_service.generate_content(prompt)
        print(f"--- Raw AI Evaluation Response ---\n{raw_evaluation}")
        cleaned_json = self._clean_and_parse_json_string(raw_evaluation)
        print(f"--- Cleaned & Parsed JSON ---\n{cleaned_json}")
        return cleaned_json

    def _clean_and_parse_json_string(self, raw_text: str) -> str:
        """
        Cleans a raw string from an AI to extract a valid JSON object string.
        """
        try:
            clean_text = re.sub(r'```json\s*|\s*```', '', raw_text, flags=re.DOTALL)
            clean_text = re.sub(r'[\*]', '', clean_text)
            clean_text = clean_text.strip()
            parsed = json.loads(clean_text)

            if isinstance(parsed, dict):
                return clean_text
            else:
                return "{}"
        except json.JSONDecodeError:
            try:
                start_index = raw_text.find('{')
                end_index = raw_text.rfind('}')
                if start_index != -1 and end_index != -1 and end_index > start_index:
                    json_part = raw_text[start_index: end_index + 1]
                    json_part_cleaned = re.sub(r'[\*]', '', json_part)
                    json.loads(json_part_cleaned)
                    return json_part_cleaned
                return "{}"
            except Exception:
                return "{}"
        except Exception:
            return "{}"