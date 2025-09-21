import google.generativeai as genai

class GeminiService:
    def __init__(self, api_key: str, model_name: str = 'gemini-1.5-flash'):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(model_name)

    def generate_content(self, prompt: str) -> str:
        response = self.model.generate_content(prompt)
        return response.text
    def generate_answer(self, prompt: str) -> str:
        return self.generate_content(prompt)