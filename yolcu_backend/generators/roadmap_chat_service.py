from difflib import get_close_matches
from typing import List, Optional
from prompts.roadmap_chat_prompt import ROADMAP_CHAT_PROMPT

class RoadmapChatService:
    def __init__(self, ai_service):
        self.ai_service = ai_service

    def extract_topics(self, roadmap_content: dict) -> List[str]:
        topics = []
        for stage in roadmap_content.get("mainStages", []):
            for node in stage.get("subNodes", []):
                for side in ["leftItems", "rightItems"]:
                    for item in node.get(side, []):
                        if item.get("name"):
                            topics.append(item.get("name"))
        return topics

    def match_question_to_topic(self, question: str, topics: List[str]) -> Optional[str]:
        # Tam eşleşme
        for topic in topics:
            if topic.lower() in question.lower():
                return topic

        # Yakın eşleşme
        matches = get_close_matches(question.lower(), [t.lower() for t in topics], n=1, cutoff=0.6)
        if matches:
            for t in topics:
                if t.lower() == matches[0]:
                    return t
        return None

    def generate_answer(self, question: str, topic: str, roadmap_content: dict) -> str:
        prompt = ROADMAP_CHAT_PROMPT.format(
            question=question,
            topic=topic,
            roadmap_content=roadmap_content
        )
        return self.ai_service.generate_answer(prompt)
