import os
from yolcu_backend.prompts.summary_prompts import SUMMARY_PROMPT

class SummaryCreator:
    def __init__(self, ai_service):
        """
        ai_service: Gemini API servis objesi
        """
        self.ai_service = ai_service

    def clean_summary_text(self, text: str, main_topic: str) -> str:
        """
        Gemini'den gelen metni temizler:
        - ** işaretlerini kaldırır
        - Satır başlarını korur
        - Başlığı bold gibi gösterir
        """
        text = text.replace("**", "").strip()
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        formatted_text = f"{main_topic}:\n" + "\n".join(lines)
        return formatted_text

    def generate_summary(
        self,
        roadmap_json: dict,
        item_id: str
    ) -> str:
        """
        roadmap_json: Roadmap.content
        item_id: left veya right item ID
        """
        topic_title = None
        center_node_title = None

        for stage in roadmap_json.get("mainStages", []):
            for node in stage.get("subNodes", []):
                for side in ["leftItems", "rightItems"]:
                    for item in node.get(side, []):
                        if item.get("id") == item_id:
                            topic_title = item.get("name")
                            center_node_title = node.get("centralNodeTitle")
                            break
                    if topic_title:
                        break
                if topic_title:
                    break
            if topic_title:
                break

        if not topic_title:
            raise ValueError("Item not found in roadmap JSON.")

        # Promptu SUMMARY_PROMPT ile oluştur
        prompt = SUMMARY_PROMPT.format(topic=topic_title, center_node=center_node_title)

        # Gemini API çağrısı
        raw_summary = self.ai_service.generate_content(prompt)

        # Metni temizle
        clean_summary = self.clean_summary_text(raw_summary, topic_title)

        return clean_summary