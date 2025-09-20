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

        # JSON'u temizle ve çıkar
        cleaned_json_str = self._clean_and_extract_json_object(raw_suggestions)

        # Debug: Temizlenmiş JSON'u yazdır
        print(f"Cleaned JSON: {cleaned_json_str}")

        return cleaned_json_str

    def _clean_and_extract_json_object(self, raw_text: str) -> str:
        """
        Cleans the raw text from the AI to extract a valid JSON string
        representing the project levels object.
        Returns a string representation of a JSON object, or an empty object string '{}' on failure.
        """
        try:
            # Remove markdown code blocks and strip whitespace
            clean_text = re.sub(r'```json\s*|\s*```', '', raw_text, flags=re.DOTALL).strip()

            # Find the start and end of the main JSON object
            start_index = clean_text.find('{')
            end_index = clean_text.rfind('}')

            if start_index != -1 and end_index != -1 and end_index > start_index:
                json_part = clean_text[start_index:end_index + 1]

                # Try to parse the extracted part to ensure it's valid JSON
                parsed = json.loads(json_part)

                # We expect a dictionary with 'project_levels'
                if isinstance(parsed, dict) and 'project_levels' in parsed:
                    return json_part
                else:
                    print("Warning: Parsed JSON is not in the expected format (dict with 'project_levels').")
                    return "{}"
            else:
                 print("Warning: Could not find a valid JSON object in the AI response.")
                 return "{}"

        except json.JSONDecodeError as e:
            print(f"JSON decode error during cleaning: {e}")
            return "{}"
        except Exception as e:
            print(f"Unexpected error in JSON cleaning: {e}")
            return "{}"
