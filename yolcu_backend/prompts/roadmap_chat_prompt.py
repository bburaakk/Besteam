ROADMAP_CHAT_PROMPT = """
Kullanıcı roadmap konularından birine dair soru soruyor.
- Cevap verirken sadece roadmap içeriğini ve ilgili konuyu kullan.
- Roadmap dışında herhangi bir bilgi verme.
- Kullanıcının sorusu: "{question}"
- İlgili roadmap konusu: "{topic}"
- Roadmap içeriği: {roadmap_content}

Lütfen bu konu hakkında açık, anlaşılır ve öğretici bir cevap üret.
"""
