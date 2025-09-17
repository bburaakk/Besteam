import re
import fitz  # PyMuPDF
import chardet
import json
from typing import List, Dict, Any
from langdetect import detect, DetectorFactory
from collections import Counter
from services.ai_service import GeminiService
from prompts.cv_prompts import CV_FEEDBACK_PROMPT

DetectorFactory.seed = 0  # Dil tespiti deterministik olsun diye


class CVAnalyzer:
    def __init__(self, gemini_api_key: str):
        self.gemini = GeminiService(api_key=gemini_api_key)

    # ------------------ CV Okuma ------------------
    def read_pdf(self, file_path: str) -> str:
        """PDF dosyasından metin okur."""
        text = ""
        with fitz.open(file_path) as doc:
            for page in doc:
                text += page.get_text("text")
        return text.strip()

    def read_txt(self, file_path: str) -> str:
        """TXT dosyasından metin okur (encoding tespit ederek)."""
        with open(file_path, "rb") as f:
            raw_data = f.read()
        enc = chardet.detect(raw_data)["encoding"] or "utf-8"
        return raw_data.decode(enc, errors="ignore")

    def read_cv(self, file_path: str) -> str:
        """CV dosyasını (PDF veya TXT) okur."""
        if file_path.lower().endswith(".pdf"):
            return self.read_pdf(file_path)
        elif file_path.lower().endswith(".txt"):
            return self.read_txt(file_path)
        else:
            raise ValueError("Unsupported file format. Only PDF or TXT allowed.")

    # ------------------ Anahtar Kelime Analizi ------------------
    def extract_keywords(self, text: str, top_n: int = 15) -> Dict[str, List[str]]:
        """CV'den en sık geçen anahtar kelimeleri çıkarır."""
        words = re.findall(r"\b[a-zA-ZğüşöçıİĞÜŞÖÇ]+\b", text.lower())
        stopwords = {"ve", "ile", "bir", "için", "the", "to", "of", "in", "a", "an", "on", "at"}
        filtered_words = [w for w in words if w not in stopwords and len(w) > 2]
        counts = Counter(filtered_words).most_common(top_n)

        keywords = [w for w, _ in counts]
        return {"found": keywords, "missing": []}  # missing ATS analizinde dolacak

    def ats_score_basic(self, text: str, keywords: List[str]) -> Dict[str, Any]:
        """Anahtar kelime eşleşmesine göre basit ATS skoru döndürür."""
        text_lower = text.lower()
        found = [kw for kw in keywords if kw.lower() in text_lower]
        missing = [kw for kw in keywords if kw.lower() not in text_lower]
        score = round(len(found) / len(keywords) * 100, 2) if keywords else 0

        return {
            "basic_score": score,
            "found_keywords": found,
            "missing_keywords": missing,
            "total_keywords": len(keywords),
            "found_count": len(found),
        }

    def ats_score_advanced(self, text: str, keywords: List[str]) -> Dict[str, Any]:
        """ATS skoru + ağırlıklı analiz (ör. önemli keywordler daha fazla puan getirir)."""
        base_result = self.ats_score_basic(text, keywords)

        counts = Counter(re.findall(r"\b[a-zA-ZğüşöçıİĞÜŞÖÇ]+\b", text.lower()))
        weighted_score = 0
        for kw in keywords:
            weighted_score += min(10, counts.get(kw.lower(), 0))  # tekrar limiti

        final_score = round((base_result["basic_score"] + weighted_score) / 2, 2)

        base_result["final_score"] = final_score
        return base_result

    # ------------------ Dil Tespiti ------------------
    def detect_language(self, text: str) -> str:
        """CV'nin dilini tespit eder."""
        try:
            lang = detect(text[:1000])  # ilk 1000 karakter
            return lang
        except Exception:
            return "unknown"

    # ------------------ ATS İpuçları ------------------
    def get_ats_optimization_tips(self, issues: Dict[str, Any]) -> List[str]:
        """ATS uyumluluğu için genel ipuçları döner."""
        tips = [
            "Tablolar yerine basit listeleme kullan.",
            "Standart fontlar (Arial, Calibri, Times New Roman) tercih et.",
            "Her bölüm için net başlıklar (Eğitim, Deneyim, Beceriler) kullan.",
            "Anahtar kelimeleri doğal şekilde ekle, spam yapma.",
            "Uzun 'Hakkımda' bölümleri yerine kısa bir özet yaz.",
        ]

        if issues.get("missing_keywords"):
            tips.append(f"Şu anahtar kelimeleri ekle: {', '.join(issues['missing_keywords'])}")

        return tips

    # ------------------ AI Feedback ------------------
    def generate_ai_feedback(self, cv_text: str, issues: Dict[str, Any]) -> str:
        """Gemini ile ATS odaklı geri bildirim üretir."""
        try:
            prompt = CV_FEEDBACK_PROMPT.format(
                issues_context=json.dumps(issues, ensure_ascii=False, indent=2),
                cv_text=cv_text[:4000]  # 4K karakter limiti
            )
            response = self.gemini.generate_content(prompt)
            return response
        except Exception as e:
            return f"AI feedback error: {e}"

    # ------------------ Anahtar Analiz + Feedback ------------------
    def analyze_cv(self, file_path: str, keywords: List[str]) -> Dict[str, Any]:
        """Anahtar kelime + ATS analizi + AI feedback döndürür."""
        try:
            cv_text = self.read_cv(file_path)
            basic_score = self.ats_score_basic(cv_text, keywords)
            advanced_score = self.ats_score_advanced(cv_text, keywords)
            language = self.detect_language(cv_text)
            feedback = self.generate_ai_feedback(cv_text, advanced_score)
            tips = self.get_ats_optimization_tips(advanced_score)

            return {
                "success": True,
                "basic": basic_score,
                "advanced": advanced_score,
                "language": language,
                "length": len(cv_text),
                "feedback": feedback,
                "tips": tips,
            }
        except Exception as e:
            return {"success": False, "error": str(e)}
