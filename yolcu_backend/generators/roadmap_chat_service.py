# generators/roadmap_chat_service.py
from difflib import get_close_matches
from typing import List, Optional, TYPE_CHECKING
from yolcu_backend.prompts.roadmap_chat_prompt import ROADMAP_CHAT_PROMPT

if TYPE_CHECKING:
    from yolcu_backend.services.ai_service import GeminiService

class RoadmapChatService:
    def __init__(self, ai_service: "GeminiService"):
        self.ai_service = ai_service

    def extract_topics(self, roadmap_content: dict) -> List[str]:
        topics = []

        if roadmap_content.get("diagramTitle"):
            topics.append(roadmap_content["diagramTitle"])

        for stage in roadmap_content.get("mainStages", []):
            if stage.get("stageName"):
                topics.append(stage["stageName"])

            for node in stage.get("subNodes", []):
                if node.get("centralNodeTitle"):
                    topics.append(node["centralNodeTitle"])

                for side in ["leftItems", "rightItems"]:
                    for item in node.get(side, []):
                        if item.get("name"):
                            topics.append(item["name"])

        return topics

    def match_question_to_topic(self, question: str, topics: List[str]) -> Optional[str]:
        question_lower = question.lower()

        for topic in topics:
            topic_lower = topic.lower()
            # Topic’i kelimelere ayır, kısa kelimeleri atla
            topic_words = [w for w in topic_lower.replace("/", " ").split() if len(w) > 2]

            # Soruda topic kelimelerinden en az biri geçiyorsa eşleştir
            if any(word in question_lower for word in topic_words):
                return topic

        # Hiç eşleşme yoksa None döndür
        return None

    def generate_answer(self, question: str, topic: str, roadmap_content: dict) -> str:
        if not topic:
            return "Lütfen sadece roadmap konularına dair bir soru sorun."

        prompt = ROADMAP_CHAT_PROMPT.format(
            question=question,
            topic=topic,
            roadmap_content=roadmap_content
        )
        raw_response = self.ai_service.generate_content(prompt)

        # Gemini'den gelen yanıtı formatla
        formatted_response = (
            raw_response
            .replace("**", "")  # ** işaretlerini kaldır
            .replace("\\n", "\n")  # \n stringini gerçek satır sonuna dönüştür
        )

        return formatted_response
