import json
import re
from services.ai_service import GeminiService
from prompts.project_evaluation_prompt import EVALUATION_PROMPT

class ProjectEvaluator:
    def __init__(self, ai_service: GeminiService):
        self.ai_service = ai_service

    def _clean_and_parse_json(self, raw_text: str) -> dict:
        clean_text = re.sub(r'```json\s*|\s*```', '', raw_text, flags=re.DOTALL).strip()
        return json.loads(clean_text)

    def evaluate(self, project_title: str, project_description: str, project_code: str) -> dict:
        final_prompt = EVALUATION_PROMPT.format(
            project_title=project_title,
            project_description=project_description,
            project_code=project_code
        )
        raw_response = self.ai_service.generate_content(final_prompt)
        return self._clean_and_parse_json(raw_response)
