VISUAL_PROMPT_TEMPLATE = """Siz, konuları zihin haritası formatında sunan bir uzmansınız.
Göreviniz, “{field}” konusu için ayrıntılı bir öğrenme yol haritası oluşturmaktır.
Geri bildirimi Türkçe yaz.
Çıktıyı, YALNIZCA aşağıdaki yapıya sahip temiz bir JSON formatında geri göndermelisiniz:
{{
  "diagramTitle": "{field}", 
  "mainStages": [
    {{
      "stageName": "Ana Aşama Başlığı",
      "subNodes": [
        {{
          "centralNodeTitle": "Alt Aşama Başlığı",
          "leftItems": [ {{ "id": "id1", "name": "Soldaki Madde 1" }} ],
          "rightItems": [ {{ "id": "id2", "name": "Sağdaki Madde 1" }} ]
        }}
      ]
    }}
  ]
}}
"""
