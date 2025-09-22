# generators/roadmap_chat_service.py
from typing import List, TYPE_CHECKING
import json

if TYPE_CHECKING:
    from yolcu_backend.services.ai_service import GeminiService


class RoadmapChatService:
    def __init__(self, ai_service: "GeminiService", **kwargs):
        self.ai_service = ai_service
        self.GREETINGS = ["selam", "merhaba", "selamlar", "merhabalar", "günaydın", "iyi günler", "iyi akşamlar",
                          "nasılsın", "naber"]

    def extract_topics(self, roadmap_content: dict) -> List[str]:
        """Helper function to get a flat list of all topic titles from the roadmap JSON."""
        topics = []
        if roadmap_content.get("diagramTitle"):
            topics.append(roadmap_content["diagramTitle"])
        for stage in roadmap_content.get("mainStages", []):
            for node in stage.get("subNodes", []):
                if node.get("centralNodeTitle"):
                    topics.append(node["centralNodeTitle"])
                for side in ["leftItems", "rightItems"]:
                    for item in node.get(side, []):
                        if item.get("name"):
                            topics.append(item["name"])
        return list(set(topics))  # Return unique topics

    def generate_answer(self, question: str, roadmap_content: dict) -> str:
        """
        Handles a user's question using a robust two-step LLM process.
        """
        normalized_question = question.lower().strip().replace("?", "").replace("'", "")

        # --- 1. Programatik Selamlama Kontrolü ---
        if normalized_question in self.GREETINGS:
            if normalized_question in ["nasılsın", "naber"]:
                return "Teşekkür ederim, iyiyim! Yol haritanla ilgili bir konuda yardımcı olabilirim."
            return "Merhaba! Yol haritanla ilgili nasıl yardımcı olabilirim?"

        # --- 2. Yapay Zeka ile Alaka Kontrolü (1. LLM Çağrısı) ---
        topic_list = self.extract_topics(roadmap_content)
        if not topic_list:
            return "Üzgünüm, bu yol haritasında henüz bir konu bulunmuyor."

        relevance_check_prompt = f"""
        Kullanıcının sorusu: '{question}'
        Yol haritası konuları: {json.dumps(topic_list, ensure_ascii=False)}

        Bu soru, verilen yol haritası konularından herhangi biriyle doğrudan ilgili mi?
        - Eğer ilgiliyse, sadece ve sadece ilgili olan konunun tam adını yaz.
        - Eğer ilgili değilse, sadece "İlgisiz" yaz.
        Başka hiçbir açıklama yapma.
        """

        try:
            matched_topic = self.ai_service.generate_content(relevance_check_prompt).strip()
        except Exception as e:
            print(f"Relevance check failed: {e}")
            return "Sorunuzu analiz ederken bir sorunla karşılaştım."

        if "İlgisiz" in matched_topic or matched_topic not in topic_list:
            return "Bu soru, mevcut yol haritanızdaki konularla ilgili görünmüyor. Lütfen yol haritanızdaki bir konu hakkında soru sorun."

        # --- 3. Alakalıysa Cevap Üretme (2. LLM Çağrısı) ---
        answer_generation_prompt = f"""
        Bir kullanıcı, '{matched_topic}' konusu hakkında bir soru sordu.
        Kullanıcının sorusu: '{question}'
        Lütfen bu soruya, konuyu hiç bilmeyen birine anlatır gibi, açık, anlaşılır ve öğretici bir cevap ver.
        Cevabın sadece sorulan soruyla ilgili olsun ve Türkçe olsun.
        ÖNEMLİ: Cevabında markdown formatlaması (yıldız, liste, kalın metin vb.) KESİNLİKLE kullanma. Cevabı sadece düz metin olarak, paragraflar halinde yaz.
        """

        try:
            raw_answer = self.ai_service.generate_content(answer_generation_prompt)
            # --- CEVAP TEMİZLEME (GARANTİLİ YÖNTEM) ---
            # Yeni satır karakterlerini boşlukla değiştir ve baş/sondaki boşlukları temizle
            cleaned_answer = raw_answer.replace('\n', ' ').strip()
            return cleaned_answer
        except Exception as e:
            print(f"Answer generation failed: {e}")
            return f"'{matched_topic}' konusuyla ilgili cevabı oluştururken bir sorunla karşılaştım."