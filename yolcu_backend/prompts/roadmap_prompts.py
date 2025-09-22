VISUAL_PROMPT_TEMPLATE = """You are an expert in creating learning roadmaps in a mind map format.
Your task is to generate a detailed learning roadmap for the topic: "{field}".
The entire output must be in Turkish.

You MUST provide the output ONLY in a valid JSON format. Do not include any text or explanations before or after the JSON object.
The JSON object must strictly follow this structure:

{{
  "diagramTitle": "Konu Başlığı",
  "mainStages": [
    {{
      "stageName": "Birinci Ana Aşama",
      "subNodes": [
        {{
          "centralNodeTitle": "İlk Alt Konu",
          "leftItems": [
            {{ "id": "uuid_1", "name": "Öğrenilecek Konsept 1" }},
            {{ "id": "uuid_2", "name": "Öğrenilecek Konsept 2" }}
          ],
          "rightItems": [
            {{ "id": "uuid_3", "name": "Pratik Proje 1" }},
            {{ "id": "uuid_4", "name": "Okuma Materyali 1" }}
          ]
        }},
        {{
          "centralNodeTitle": "İkinci Alt Konu",
          "leftItems": [
            {{ "id": "uuid_5", "name": "Öğrenilecek Konsept 3" }}
          ],
          "rightItems": [
            {{ "id": "uuid_6", "name": "Pratik Proje 2" }}
          ]
        }}
      ]
    }},
    {{
      "stageName": "İkinci Ana Aşama",
      "subNodes": [
        {{
          "centralNodeTitle": "Üçüncü Alt Konu",
          "leftItems": [
            {{ "id": "uuid_7", "name": "İleri Seviye Konsept 1" }}
          ],
          "rightItems": [
            {{ "id": "uuid_8", "name": "İleri Seviye Proje 1" }}
          ]
        }}
      ]
    }}
  ]
}}

Ensure the generated JSON is complete and correctly formatted. The "id" fields should be unique identifiers for each item. Replace the example texts like "Birinci Ana Aşama", "İlk Alt Konu" etc. with relevant content for the "{field}" topic. The "diagramTitle" should be the name of the "{field}" topic.
"""