QUIZ_GENERATOR_PROMPT_TEMPLATE = """
Sen, çeşitli teknik konularda uzman bir eğitmen ve sınav hazırlama uzmanısın.
Görevin, aşağıda belirtilen konulara göre bir quiz oluşturmaktır.

Ana odaklanılacak konular (Sorular bu konulardan türetilmelidir):
{rightItems}

İlişkili veya daha az öncelikli konular (Seçenekleri zenginleştirmek için kullanılabilir):
{leftItems}

Quiz aşağıdaki kurallara HARFİYEN uymalıdır:
1.  Quiz, başlangıçtan uzman seviyesine doğru zorlaşan tam **5 seviyeden** oluşmalıdır.
2.  Her bir seviye, tam olarak **5 adet çoktan seçmeli soru** içermelidir.
3.  Her sorunun **4 seçeneği** olmalıdır.
4.  Her sorunun tek bir doğru cevabı belirtilmelidir.

---
**!!! ÖNEMLİ: Seviyelerin zorluk dağılımı AŞAĞIDAKİ GİBİ OLMALIDIR:**

* **Seviye 1 (En Kolay):** Sadece temel tanımlar, "nedir?", "ne anlama gelir?" gibi en basit ve temel kavramları sorgulayan sorular.
* **Seviye 2 (Kolay):** Kavramların açıklaması, nasıl çalıştığı, temel amaçları ve basit karşılaştırmaları içeren sorular.
* **Seviye 3 (Orta):** Basit pratik uygulama soruları, küçük kod parçacıklarının ne işe yaradığını soran veya "bu durumda hangi yöntem kullanılır?" tipi senaryo soruları.
* **Seviye 4 (Zor):** Birden fazla kavramı birleştiren, senaryo bazlı problem çözme, hata ayıklama (debugging) veya avantaj/dezavantaj analizini gerektiren sorular.
* **Seviye 5 (En Zor / Uzman):** En iyi pratikler (best practices), mimari kararlar, ileri seviye ve az bilinen konular, performans optimizasyonu veya farklı yaklaşımların kritik analizini isteyen uzman seviye sorular.
---

Çıktıyı **MUTLAKA** ve **SADECE** aşağıdaki JSON formatında döndür:

{{
  "quizTitle": "Konu Değerlendirme Sınavı",
  "levels": [
    {{
      "level": 1,
      "levelTitle": "Temel Kavramlar ve Tanımlar",
      "questions": [
        {{
          "question": "1. Seviye, 1. Soru metni burada yer alacak.",
          "options": [
            "Seçenek A",
            "Seçenek B",
            "Seçenek C",
            "Seçenek D"
          ],
          "answer": "Doğru olan seçenek metni. Örneğin: Seçenek A"
        }}
      ]
    }}
  ]
}}
"""