import json
import re
from typing import List, Dict
from yolcu_backend.services.ai_service import GeminiService
from yolcu_backend.prompts.quiz_prompts import QUIZ_GENERATOR_PROMPT_TEMPLATE


class QuizGenerator:
    def __init__(self, ai_service: GeminiService):
        self.ai_service = ai_service

    def _clean_and_parse_json(self, raw_text: str) -> dict:
        clean_text = re.sub(r'```json\s*|\s*```', '', raw_text, flags=re.DOTALL).strip()
        
        if not clean_text:
            raise ValueError("AI service returned an empty or invalid response. Cannot generate quiz.")

        try:
            return json.loads(clean_text)
        except json.JSONDecodeError as e:
            # Raise a new error with more context
            raise ValueError(f"Failed to decode JSON from AI response. Error: {e}. Response was: '{clean_text}'")

    def create_quiz(self, roadmap_id: int, rightItems: List[Dict], leftItems: List[Dict]) -> dict:
        print(f"Roadmap ID '{roadmap_id}' için quiz mantığı çalıştırılıyor...")

        right_items_str = ", ".join([item['name'] for item in rightItems])
        left_items_str = ", ".join([item['name'] for item in leftItems])

        final_prompt = QUIZ_GENERATOR_PROMPT_TEMPLATE.format(
            rightItems=right_items_str,
            leftItems=left_items_str
        )

        raw_response = self.ai_service.generate_content(final_prompt)
        quiz_json = self._clean_and_parse_json(raw_response)
        
        quiz_json['roadmap_id'] = roadmap_id

        return quiz_json
