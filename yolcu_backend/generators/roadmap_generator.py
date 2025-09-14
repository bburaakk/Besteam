import json, re
from services.ai_service import GeminiService
from prompts.roadmap_prompts import VISUAL_PROMPT_TEMPLATE

class RoadmapGenerator:
    def __init__(self, ai_service: GeminiService):
        self.ai_service = ai_service

    def _clean_and_parse_json(self, raw_text: str) -> dict:
        clean_text = re.sub(r'''```json\s*|\s*```''', '', raw_text, flags=re.DOTALL).strip()
        return json.loads(clean_text)

    def create_roadmap(self, topic: str) -> dict:
        final_prompt = VISUAL_PROMPT_TEMPLATE.format(field=topic)
        raw_response = self.ai_service.generate_content(final_prompt)
        return self._clean_and_parse_json(raw_response)