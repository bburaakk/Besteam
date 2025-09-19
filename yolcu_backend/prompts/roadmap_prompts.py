VISUAL_PROMPT_TEMPLATE = """You are an expert who presents topics in mind map format.
Your task is to create a detailed learning roadmap for the topic “{field}”. 
You MUST return the output in a clean JSON format with ONLY the following structure:
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
