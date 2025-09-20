import json
import re
from yolcu_backend.services.ai_service import GeminiService
from yolcu_backend.prompts.suggestion_prompt import SUGGESTION_PROMPT



class ProjectSuggestionGenerator:
    def __init__(self, ai_service: GeminiService):
        self.ai_service = ai_service

    def generate_suggestions(self, titles: list[str]) -> str:
        """
        Generates project suggestions based on a list of titles and cleans the output
        to ensure it's a valid JSON string for downstream parsing.
        """
        titles_str = ", ".join(titles)
        prompt = SUGGESTION_PROMPT.format(titles=titles_str)
        raw_suggestions = self.ai_service.generate_content(prompt)

        # Debug: Raw response'u yazdır
        print(f"Raw AI response: {raw_suggestions}")

        # JSON'u temizle ve çıkar - roadmap_generator'daki basit yöntemi kullan
        cleaned_json = self._clean_and_parse_json_string(raw_suggestions)

        # Debug: Temizlenmiş JSON'u yazdır
        print(f"Cleaned JSON: {cleaned_json}")

        return cleaned_json

    def _clean_and_parse_json_string(self, raw_text: str) -> str:
        """
        Roadmap generator'daki temizleme mantığını kullanarak JSON çıkar.
        """
        try:
            # Markdown kod bloklarını temizle
            clean_text = re.sub(r'```json\s*|\s*```', '', raw_text, flags=re.DOTALL).strip()

            # JSON'u test et
            parsed = json.loads(clean_text)
            if isinstance(parsed, list):
                return clean_text
            else:
                print("Warning: Parsed content is not a list")
                return "[]"

        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            print(f"Trying to extract JSON array...")

            # Fallback: JSON array'ini bulmaya çalış
            try:
                start_index = raw_text.find('[')
                end_index = raw_text.rfind(']')

                if start_index != -1 and end_index != -1 and end_index > start_index:
                    json_part = raw_text[start_index:end_index + 1]
                    parsed = json.loads(json_part)
                    if isinstance(parsed, list):
                        return json_part

                return "[]"
            except Exception:
                return "[]"
        except Exception as e:
            print(f"Unexpected error in JSON cleaning: {e}")
            return "[]"